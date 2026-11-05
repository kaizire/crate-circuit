const STUDENT_ADDRESS_KEY = "cratecircuit-vm-address";

function labStoreUrl() {
  return String((CONFIG.firebase && CONFIG.firebase.databaseURL) || "").replace(/\/$/, "") + "/visits/_cratecircuitLab.json";
}

function studentUser() {
  return CONFIG.labStudentUser || "student";
}

function studentPassword() {
  return CONFIG.labStudentPassword || "crate-lab";
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

function rdpUri(link) {
  const host = hostFromLink(link);
  if (!host) return "#";
  return (
    "ms-rd:connect?full%20address=s:" + encodeURIComponent(host) +
    "&username=s:" + encodeURIComponent(studentUser())
  );
}

async function loadSharedLabLink() {
  const typed = document.getElementById("vm-address");
  const local = typed && typed.value.trim()
    ? typed.value.trim()
    : (localStorage.getItem(STUDENT_ADDRESS_KEY) || "");
  try {
    const response = await fetch(labStoreUrl(), { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      if (data && data.consoleUrl) return normalizeLabLink(data.consoleUrl);
    }
  } catch (error) {
    /* students can still type the address */
  }
  return normalizeLabLink(local || CONFIG.labConsoleUrl || "");
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
  if (field && !field.value.trim() && link) field.value = hostFromLink(link) || link.replace(/^https?:\/\//i, "");
  if (field && field.value.trim()) {
    localStorage.setItem(STUDENT_ADDRESS_KEY, field.value.trim());
    link = normalizeLabLink(field.value);
  }
  if (rdp) rdp.href = rdpUri(link);
  if (wait) {
    wait.textContent = link
      ? "Use student / " + studentPassword() + ". You do not need a teacher account."
      : "Type the VM address, then tap Open the VM. Use the student logon, not the teacher account.";
  }
  return link;
}

async function openStudentLab() {
  const field = document.getElementById("vm-address");
  const wait = document.getElementById("vm-wait");
  if (field && field.value.trim()) localStorage.setItem(STUDENT_ADDRESS_KEY, field.value.trim());
  const link = await readyStudentLab();
  if (!link) {
    if (wait) wait.textContent = "Type the VM address first (example 192.168.1.50).";
    if (field) field.focus();
    return;
  }
  const rdp = rdpUri(link);
  if (rdp !== "#") window.location.href = rdp;
  else window.location.href = link;
}

paintStudentLogon();
const openButton = document.getElementById("open-vm");
if (openButton) openButton.addEventListener("click", () => openStudentLab());
const address = document.getElementById("vm-address");
if (address) {
  address.value = localStorage.getItem(STUDENT_ADDRESS_KEY) || "";
  address.addEventListener("change", () => readyStudentLab());
}
readyStudentLab();
