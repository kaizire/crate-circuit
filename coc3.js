const STUDENT_ADDRESS_KEY = "cratecircuit-vm-address";
const LAB_STORE = "https://crate-circuit-default-rtdb.firebaseio.com/visits/cratecircuit-lab.json";

function studentUser() {
  return (typeof CONFIG !== "undefined" && CONFIG.labStudentUser) || "student";
}

function studentPassword() {
  return (typeof CONFIG !== "undefined" && CONFIG.labStudentPassword) || "crate-lab";
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
  const raw = String(link || "").trim();
  if (!raw) return "";
  try {
    return new URL(normalizeLabLink(raw)).hostname;
  } catch (error) {
    return raw.replace(/^https?:\/\//i, "").split("/")[0].split(":")[0];
  }
}

function rdpBody(host) {
  return [
    "full address:s:" + host,
    "username:s:" + studentUser(),
    "prompt for credentials:i:1",
    "authentication level:i:0",
    "negotiate security layer:i:1",
    "screen mode id:i:2",
    "desktopwidth:i:1280",
    "desktopheight:i:720"
  ].join("\r\n");
}

function rdpUri(host) {
  return (
    "ms-rd:connect?full%20address=s:" + encodeURIComponent(host) +
    "&username=s:" + encodeURIComponent(studentUser())
  );
}

function androidIntent(host) {
  return (
    "intent://connect#Intent;scheme=ms-rd;package=com.microsoft.rdc.androidx;" +
    "S.full%20address=s:" + encodeURIComponent(host) +
    ";S.username=s:" + encodeURIComponent(studentUser()) +
    ";end"
  );
}

function clickUri(uri) {
  const link = document.createElement("a");
  link.href = uri;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function downloadRdp(host) {
  const blob = new Blob([rdpBody(host)], { type: "application/rdp" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "COC3-SERVER.rdp";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function loadSharedLabLink() {
  const typed = document.getElementById("vm-address");
  const local = typed && typed.value.trim()
    ? typed.value.trim()
    : (localStorage.getItem(STUDENT_ADDRESS_KEY) || "");
  try {
    const response = await fetch(LAB_STORE, { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      if (data && data.consoleUrl) return normalizeLabLink(data.consoleUrl);
    }
  } catch (error) {
    /* students can still type the address */
  }
  const fallback = (typeof CONFIG !== "undefined" && CONFIG.labConsoleUrl) || "";
  return normalizeLabLink(local || fallback);
}

function paintStudentLogon() {
  const user = document.getElementById("student-user");
  const pass = document.getElementById("student-pass");
  if (user) user.textContent = studentUser();
  if (pass) pass.textContent = studentPassword();
}

async function readyStudentLab() {
  const field = document.getElementById("vm-address");
  const wait = document.getElementById("vm-wait");
  const rdp = document.getElementById("open-rdp");
  let link = await loadSharedLabLink();
  const host = hostFromLink(field && field.value.trim() ? field.value : link);
  if (field && !field.value.trim() && host) field.value = host;
  if (field && field.value.trim()) localStorage.setItem(STUDENT_ADDRESS_KEY, field.value.trim());
  if (rdp) rdp.href = host ? rdpUri(host) : "#";
  if (wait) {
    wait.textContent = host
      ? "Tap Open the VM. Allow Remote Desktop. Log on as " + studentUser() + " / " + studentPassword() + "."
      : "Type the VM IP from the teacher, then tap Open the VM.";
  }
  return host;
}

async function openStudentLab() {
  const field = document.getElementById("vm-address");
  const wait = document.getElementById("vm-wait");
  if (field && field.value.trim()) localStorage.setItem(STUDENT_ADDRESS_KEY, field.value.trim());
  const host = await readyStudentLab();
  if (!host) {
    if (wait) wait.textContent = "Type the VM address first (example 192.168.1.50).";
    if (field) field.focus();
    return;
  }
  downloadRdp(host);
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) clickUri(androidIntent(host));
  else clickUri(rdpUri(host));
  if (wait) {
    wait.textContent =
      "If nothing opens, tap the downloaded COC3-SERVER.rdp file, or install Microsoft Remote Desktop. Then log on as " +
      studentUser() + " / " + studentPassword() + ". VMware itself stays on the school PC.";
  }
}

function pointToRemoteDesktopStore() {
  const store = document.getElementById("rd-store");
  if (!store) return;
  const ua = navigator.userAgent || "";
  const android = document.getElementById("rd-android");
  const ios = document.getElementById("rd-ios");
  const windows = document.getElementById("rd-windows");
  if (/android/i.test(ua) && android) {
    store.href = android.href;
    store.textContent = "Install on Android";
  } else if (/iPhone|iPad|iPod/i.test(ua) && ios) {
    store.href = ios.href;
    store.textContent = "Install on iPhone";
  } else if (/Windows/i.test(ua) && windows) {
    store.href = windows.href;
    store.textContent = "Install on Windows";
  } else {
    store.href = (android && android.href) || store.href;
    store.textContent = "Install Microsoft Remote Desktop";
  }
}

paintStudentLogon();
pointToRemoteDesktopStore();
const openButton = document.getElementById("open-vm");
if (openButton) openButton.addEventListener("click", () => openStudentLab());
const address = document.getElementById("vm-address");
if (address) {
  address.value = localStorage.getItem(STUDENT_ADDRESS_KEY) || "";
  address.addEventListener("change", () => readyStudentLab());
}
readyStudentLab();
