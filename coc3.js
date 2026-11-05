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

async function loadSharedLabLink() {
  try {
    const response = await fetch(labStoreUrl(), { cache: "no-store" });
    if (!response.ok) return CONFIG.labConsoleUrl || "https://portal.azure.com/";
    const data = await response.json();
    if (data && data.consoleUrl) return data.consoleUrl;
  } catch (error) {
    /* fall back to Azure */
  }
  return CONFIG.labConsoleUrl || "https://portal.azure.com/";
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
    throw new Error("Could not save the lab link. In Firebase rules, allow read and write on lab.");
  }
}

async function openStudentLab() {
  const link = normalizeLabLink(await loadSharedLabLink());
  window.location.href = link || "https://portal.azure.com/";
}

const openButton = document.getElementById("open-vm");
if (openButton) {
  openButton.addEventListener("click", () => {
    openStudentLab();
  });
}
