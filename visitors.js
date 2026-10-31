const VISIT_KEY = "cratecircuit-visit-id";

function newVisitId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return "v-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}

async function logVisitStart(name, length) {
  const payload = {
    visitId: newVisitId(),
    name: (name && name.trim()) || "Anonymous",
    startedAt: new Date().toISOString(),
    length: length,
    status: "started"
  };
  try {
    const response = await fetch(CONFIG.storeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) return;
    const saved = await response.json();
    if (saved && saved._id) sessionStorage.setItem(VISIT_KEY, saved._id);
  } catch (error) {
    /* logging is best-effort so the quiz still runs */
  }
}

async function logVisitScore(correct, total, percent) {
  const id = sessionStorage.getItem(VISIT_KEY);
  if (!id) return;
  try {
    const response = await fetch(CONFIG.storeUrl + "/" + encodeURIComponent(id));
    if (!response.ok) return;
    const current = await response.json();
    delete current._id;
    current.status = "finished";
    current.finishedAt = new Date().toISOString();
    current.score = correct;
    current.total = total;
    current.percent = percent;
    await fetch(CONFIG.storeUrl + "/" + encodeURIComponent(id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(current)
    });
  } catch (error) {
    /* logging is best-effort so the quiz still runs */
  }
}

async function loadVisits() {
  const response = await fetch(CONFIG.storeUrl);
  if (!response.ok) throw new Error("Could not load visits");
  const visits = await response.json();
  return visits.sort((a, b) => {
    const aTime = Date.parse(a.finishedAt || a.startedAt || 0) || 0;
    const bTime = Date.parse(b.finishedAt || b.startedAt || 0) || 0;
    return bTime - aTime;
  });
}

function samePlayerName(a, b) {
  const clean = (value) => String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
  return clean(a) && clean(a) === clean(b);
}

async function deleteVisit(id) {
  if (!id) throw new Error("Missing visit id");
  const response = await fetch(CONFIG.storeUrl + "/" + encodeURIComponent(id), {
    method: "DELETE"
  });
  if (!response.ok && response.status !== 204) {
    throw new Error("Could not delete visit");
  }
}

async function loadVisitsByName(name) {
  const visits = await loadVisits();
  return visits.filter((visit) => samePlayerName(visit.name, name));
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
