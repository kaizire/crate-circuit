function labStoreUrl() {
  return String((CONFIG.firebase && CONFIG.firebase.databaseURL) || "").replace(/\/$/, "") + "/lab.json";
}

function normalizeLabLink(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^[\w.-]+:\d+$/.test(raw) || /^\d{1,3}(\.\d{1,3}){3}(:\d+)?$/.test(raw)) {
    return "http://" + raw;
  }
  return raw;
}

function hostFromLink(link) {
  try {
    return new URL(normalizeLabLink(link)).hostname;
  } catch (error) {
    return String(link || "").replace(/^https?:\/\//i, "").split("/")[0].split(":")[0];
  }
}

function emptyLab() {
  return {
    serverUrl: CONFIG.labConsoleUrl || "",
    clientUrl: CONFIG.labClientUrl || ""
  };
}

async function loadSharedLab() {
  const fallback = emptyLab();
  try {
    const response = await fetch(labStoreUrl(), { cache: "no-store" });
    if (!response.ok) return fallback;
    const data = await response.json();
    if (!data || typeof data !== "object") return fallback;
    return {
      serverUrl: data.serverUrl || data.consoleUrl || fallback.serverUrl,
      clientUrl: data.clientUrl || fallback.clientUrl
    };
  } catch (error) {
    return fallback;
  }
}

async function loadSharedLabLink() {
  const lab = await loadSharedLab();
  return lab.serverUrl;
}

async function saveSharedLab(changes) {
  const current = await loadSharedLab();
  const next = Object.assign({}, current, changes, {
    consoleUrl: changes.serverUrl != null ? changes.serverUrl : current.serverUrl,
    updatedAt: new Date().toISOString()
  });
  const response = await fetch(labStoreUrl(), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(next)
  });
  if (!response.ok) {
    throw new Error("Could not save the lab link. In Firebase Realtime Database rules, allow read and write on lab.");
  }
  return next;
}

async function saveSharedLabLink(consoleUrl) {
  return saveSharedLab({ serverUrl: consoleUrl });
}

function azureLabHref() {
  return CONFIG.azureLabUrl || "https://portal.azure.com";
}
