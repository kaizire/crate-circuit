const VISIT_KEY = "cratecircuit-visit-id";
const LOCAL_VISITS = "cratecircuit-visits";

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
      if (key === "_cratecircuitLab" || key === "cratecircuit-lab" || key.charAt(0) === "_") return null;
      const item = data[key] && typeof data[key] === "object" ? Object.assign({}, data[key]) : { value: data[key] };
      if (item.kind === "lab" || (item.consoleUrl && !item.visitId)) return null;
      item._id = item._id || item.visitId || key;
      return item;
    }).filter(Boolean);
  }
  return [];
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

async function loadRemoteVisits() {
  const live = await loadJsonList(liveListUrl());
  const term = await loadJsonList(CONFIG.termLogUrl);
  return mergeVisits(term, live);
}

async function loadVisits() {
  return mergeVisits(await loadRemoteVisits(), loadLocalVisits());
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
