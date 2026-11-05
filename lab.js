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

async function loadSharedLabLink() {
  try {
    const response = await fetch(labStoreUrl(), { cache: "no-store" });
    if (!response.ok) return CONFIG.labConsoleUrl || "";
    const data = await response.json();
    if (data && data.consoleUrl) return data.consoleUrl;
  } catch (error) {
    /* config fallback */
  }
  return CONFIG.labConsoleUrl || "";
}

async function saveSharedLabLink(consoleUrl) {
  const response = await fetch(labStoreUrl(), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      consoleUrl: consoleUrl,
      updatedAt: new Date().toISOString()
    })
  });
  if (!response.ok) {
    throw new Error("Could not save the lab link. In Firebase Realtime Database rules, allow read and write on lab.");
  }
}

function azureLabHref() {
  return CONFIG.azureLabUrl || "https://portal.azure.com";
}
