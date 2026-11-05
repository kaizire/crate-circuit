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
    if (response.ok) {
      const data = await response.json();
      if (data && data.consoleUrl) return normalizeLabLink(data.consoleUrl);
    }
  } catch (error) {
    /* teacher has not shared a VM yet */
  }
  return normalizeLabLink(CONFIG.labConsoleUrl || "");
}

function setRdpLink(link) {
  const rdp = document.getElementById("open-rdp");
  if (!rdp) return;
  const host = hostFromLink(link);
  rdp.href = host
    ? "ms-rd:connect?full%20address=s:" + encodeURIComponent(host)
    : "#";
}

async function readyStudentLab() {
  const wait = document.getElementById("vm-wait");
  const link = await loadSharedLabLink();
  setRdpLink(link);
  if (!wait) return link;
  if (!link) {
    wait.textContent = "Wait for your teacher to start the virtual machine, then tap Refresh.";
  } else {
    wait.textContent = "The virtual machine is ready. Tap Open the VM.";
  }
  return link;
}

async function openStudentLab() {
  const wait = document.getElementById("vm-wait");
  const link = await readyStudentLab();
  if (!link) {
    if (wait) wait.textContent = "The VM is not shared yet. Ask your teacher to start COC3-SERVER.";
    return;
  }
  window.location.href = link;
}

const openButton = document.getElementById("open-vm");
if (openButton) openButton.addEventListener("click", () => openStudentLab());
const refresh = document.getElementById("refresh-lab");
if (refresh) refresh.addEventListener("click", () => readyStudentLab());
readyStudentLab();
