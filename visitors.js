const VISIT_KEY = "cratecircuit-visit-id";
const LOCAL_VISITS = "cratecircuit-visits";
const WIPE_KEY = "cratecircuit-wiped-at";
const WIPE_ID = "_wipe";

let currentVisit = null;
let remoteSave = Promise.resolve();

function newVisitId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return "v-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}

function loadLocalVisits() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_VISITS) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeLocalVisits(list) {
  localStorage.setItem(LOCAL_VISITS, JSON.stringify(list.slice(0, 400)));
}

function upsertLocal(visit) {
  const list = loadLocalVisits();
  const index = list.findIndex((item) => item.visitId && item.visitId === visit.visitId);
  const copy = Object.assign({}, visit);
  if (index >= 0) list[index] = Object.assign({}, list[index], copy);
  else list.unshift(copy);
  writeLocalVisits(list);
  currentVisit = copy;
  return copy;
}

function liveStoreBase() {
  const url = CONFIG.firebase && CONFIG.firebase.databaseURL;
  return url ? String(url).replace(/\/$/, "") + "/visits" : "";
}

function liveListUrl() {
  return liveStoreBase() ? liveStoreBase() + ".json" : "";
}

function liveItemUrl(id) {
  return liveStoreBase() ? liveStoreBase() + "/" + encodeURIComponent(id) + ".json" : "";
}

function visitsFromPayload(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.visits)) return data.visits;
  if (typeof data === "object") {
    return Object.keys(data).map((key) => {
      const item = data[key] && typeof data[key] === "object" ? Object.assign({}, data[key]) : { value: data[key] };
      item._id = item._id || item.visitId || key;
      return item;
    });
  }
  return [];
}

function isLabVisit(visit) {
  if (!visit || typeof visit !== "object") return true;
  const id = String(visit._id || visit.visitId || "");
  if (id === "cratecircuit-lab" || id === "_cratecircuitLab" || id === WIPE_ID) return true;
  if (visit.kind === "lab" || visit.kind === "wipe") return true;
  const name = String(visit.name || "").trim().toLowerCase();
  return name === "_lab";
}

function wipedAtFrom(data) {
  try {
    const stored = localStorage.getItem(WIPE_KEY);
    if (stored) return stored;
  } catch (error) {
    /* ignore */
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) return "";
  const row = data[WIPE_ID];
  return row && row.wipedAt ? String(row.wipedAt) : "";
}

function rememberWipe(iso) {
  if (!iso) return;
  try {
    localStorage.setItem(WIPE_KEY, iso);
  } catch (error) {
    /* ignore */
  }
}

function afterWipe(iso, visit) {
  if (!iso || !visit) return true;
  const started = Date.parse(visit.startedAt || visit.finishedAt || 0);
  if (!started) return false;
  return started >= Date.parse(iso);
}

function studentVisits(list, wipedAt) {
  const cut = wipedAt || "";
  return (list || []).filter((visit) => !isLabVisit(visit) && afterWipe(cut, visit));
}

function setActiveVisit(visit) {
  currentVisit = visit || null;
  const id = visit && (visit._id || visit.visitId);
  if (id) sessionStorage.setItem(VISIT_KEY, id);
  else sessionStorage.removeItem(VISIT_KEY);
}

async function logVisitStart(name, length, snapshot) {
  const payload = {
    visitId: newVisitId(),
    name: (name && name.trim()) || "Anonymous",
    startedAt: new Date().toISOString(),
    endsAt: snapshot && snapshot.endsAt ? snapshot.endsAt : "",
    length: length,
    status: "started",
    parts: snapshot && snapshot.parts ? snapshot.parts.slice() : [],
    picks: snapshot && snapshot.picks ? snapshot.picks.slice() : [],
    index: snapshot && typeof snapshot.index === "number" ? snapshot.index : 0
  };
  payload._id = payload.visitId;
  setActiveVisit(upsertLocal(payload));
  remoteSave = (async () => {
    try {
      const cut = wipedAtFrom();
      if (cut && !afterWipe(cut, payload)) return;
      const url = liveItemUrl(payload.visitId);
      if (!url) return;
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) return;
      setActiveVisit(upsertLocal(payload));
    } catch (error) {
      /* local copy still works if the online store is down */
    }
  })();
  return remoteSave;
}

function findStoredVisit(id) {
  if (!id) return null;
  return loadLocalVisits().find((item) => item._id === id || item.visitId === id) || null;
}

async function patchVisit(changes) {
  await remoteSave;
  if (!currentVisit) currentVisit = findStoredVisit(sessionStorage.getItem(VISIT_KEY));
  if (!currentVisit) return;
  Object.assign(currentVisit, changes);
  currentVisit._id = currentVisit._id || currentVisit.visitId;
  upsertLocal(currentVisit);
  const remoteId = currentVisit.visitId || currentVisit._id;
  if (!remoteId) return;
  try {
    const cut = wipedAtFrom();
    if (cut && !afterWipe(cut, currentVisit)) return;
    const url = liveItemUrl(remoteId);
    if (!url) return;
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentVisit)
    });
  } catch (error) {
    /* logging is best-effort so the quiz still runs */
  }
}

function snapshotFromState() {
  return {
    parts: (state.deck || []).map((item) => item.part),
    picks: (state.picks || []).slice(),
    index: state.index || 0,
    length: state.deck ? state.deck.length : state.length,
    endsAt: state.endsAt || ""
  };
}

function logVisitProgress() {
  const snap = snapshotFromState();
  const answered = (snap.picks || []).filter(Boolean).length;
  const done = snap.parts.length && answered >= snap.parts.length;
  return patchVisit(Object.assign({}, snap, {
    status: done ? "finished" : "started"
  }));
}

function logVisitScore(correct, total, percent, timedOut) {
  return patchVisit(Object.assign(snapshotFromState(), {
    status: "finished",
    finishedAt: new Date().toISOString(),
    score: correct,
    total: total,
    percent: percent,
    timedOut: Boolean(timedOut)
  }));
}

function mergeVisits(remote, local) {
  const map = new Map();
  function add(visit) {
    if (!visit) return;
    const key = visit.visitId || visit._id;
    if (!key) return;
    const prev = map.get(key);
    if (!prev) {
      map.set(key, Object.assign({}, visit));
      return;
    }
    const merged = Object.assign({}, prev, visit);
    const prevPicks = Array.isArray(prev.picks) ? prev.picks.filter(Boolean).length : 0;
    const nextPicks = Array.isArray(visit.picks) ? visit.picks.filter(Boolean).length : 0;
    if (nextPicks < prevPicks) merged.picks = prev.picks;
    if (prev.status === "finished" || visit.status === "finished") merged.status = "finished";
    map.set(key, merged);
  }
  (remote || []).forEach(add);
  (local || []).forEach(add);
  return Array.from(map.values()).sort((a, b) => {
    const aTime = Date.parse(a.finishedAt || a.startedAt || 0) || 0;
    const bTime = Date.parse(b.finishedAt || b.startedAt || 0) || 0;
    return bTime - aTime;
  });
}

async function loadJsonList(url) {
  if (!url) return [];
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return [];
    return visitsFromPayload(await response.json());
  } catch (error) {
    return [];
  }
}

async function fetchLiveVisits() {
  const url = liveListUrl();
  if (!url) return { ok: false, visits: [], wipedAt: wipedAtFrom() };
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return { ok: false, visits: [], wipedAt: wipedAtFrom() };
    const data = await response.json();
    const wipedAt = wipedAtFrom(data) || wipedAtFrom();
    if (wipedAt) rememberWipe(wipedAt);
    return { ok: true, visits: studentVisits(visitsFromPayload(data), wipedAt), wipedAt };
  } catch (error) {
    return { ok: false, visits: [], wipedAt: wipedAtFrom() };
  }
}

async function loadRemoteVisits() {
  const live = await fetchLiveVisits();
  if (live.ok) return live.visits;
  return studentVisits(await loadJsonList(CONFIG.termLogUrl), live.wipedAt);
}

async function loadVisits() {
  const live = await fetchLiveVisits();
  const remote = live.ok ? live.visits : studentVisits(await loadJsonList(CONFIG.termLogUrl), live.wipedAt);
  const local = studentVisits(loadLocalVisits(), live.wipedAt);
  writeLocalVisits(local);
  return mergeVisits(remote, local);
}

function downloadTermLog(visits) {
  const blob = new Blob([JSON.stringify({ visits: visits || [] }, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "cratecircuit-scores.json";
  link.click();
  URL.revokeObjectURL(url);
}

function samePlayerName(a, b) {
  const clean = (value) => String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
  return clean(a) && clean(a) === clean(b);
}

async function deleteVisit(id) {
  if (!id) throw new Error("Missing visit id");
  writeLocalVisits(loadLocalVisits().filter((item) => item._id !== id && item.visitId !== id));
  const url = liveItemUrl(id);
  if (!url) return;
  const response = await fetch(url, {
    method: "DELETE"
  });
  if (!response.ok && response.status !== 204) {
    throw new Error("Could not delete visit");
  }
}

async function wipeAllVisits() {
  const wipedAt = new Date().toISOString();
  rememberWipe(wipedAt);
  writeLocalVisits([]);
  const url = liveListUrl();
  if (!url) return;
  let data = null;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (response.ok) data = await response.json();
  } catch (error) {
    data = null;
  }
  const kept = {};
  const stale = [];
  if (data && typeof data === "object" && !Array.isArray(data)) {
    Object.keys(data).forEach((key) => {
      const item = data[key];
      if (!item || typeof item !== "object") {
        stale.push(key);
        return;
      }
      const row = Object.assign({ _id: key }, item);
      if (isLabVisit(row) && key !== WIPE_ID) kept[key] = item;
      else stale.push(key);
    });
  }
  kept[WIPE_ID] = { kind: "wipe", wipedAt: wipedAt };
  let response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(kept)
  });
  if (!response.ok) {
    await fetch(liveItemUrl(WIPE_ID), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(kept[WIPE_ID])
    });
    for (const id of stale) {
      const del = await fetch(liveItemUrl(id), { method: "DELETE" });
      if (!del.ok && del.status !== 204) throw new Error("Could not clear visits");
    }
    return;
  }
}

async function loadVisitsByName(name) {
  const visits = await loadVisits();
  return visits.filter((visit) => samePlayerName(visit.name, name) && visit.visitId);
}

function formatWhen(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso);
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function scoreLabel(visit) {
  if (typeof visit.score === "number" && typeof visit.total === "number") {
    const percent = typeof visit.percent === "number" ? visit.percent + "%" : "";
    return visit.score + "/" + visit.total + (percent ? " · " + percent : "");
  }
  if (visit.status === "started") return "In progress";
  if (visit.status === "view") return "Opened page";
  return "No score yet";
}
