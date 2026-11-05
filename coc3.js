function labUrl() {
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
    const response = await fetch(labUrl(), { cache: "no-store" });
    if (!response.ok) return CONFIG.labConsoleUrl || "";
    const data = await response.json();
    if (data && data.consoleUrl) return data.consoleUrl;
  } catch (error) {
    /* local config still works */
  }
  return CONFIG.labConsoleUrl || "";
}

async function saveSharedLabLink(consoleUrl) {
  const response = await fetch(labUrl(), {
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

function showVmFrame(link) {
  const frame = document.getElementById("vm-frame");
  const wait = document.getElementById("vm-wait");
  const rdp = document.getElementById("open-rdp");
  if (!link) {
    frame.removeAttribute("src");
    frame.hidden = true;
    wait.hidden = false;
    return;
  }
  const host = hostFromLink(link);
  if (rdp) rdp.href = "ms-rd:connect?full%20address=s:" + encodeURIComponent(host);
  if (/^https:\/\//i.test(link)) {
    frame.src = link;
    frame.hidden = false;
    wait.hidden = true;
    return;
  }
  frame.hidden = true;
  wait.hidden = false;
  wait.innerHTML = "<strong>Tap Open the VM.</strong> School Wi‑Fi uses http, so the desktop opens on this phone instead of inside the box.";
}

async function bootLab() {
  const link = normalizeLabLink(await loadSharedLabLink());
  const field = document.getElementById("lab-link");
  if (field && link) field.value = link;
  showVmFrame(link);
  return link;
}

document.getElementById("open-vm").addEventListener("click", async () => {
  const link = normalizeLabLink((document.getElementById("lab-link") && document.getElementById("lab-link").value) || (await loadSharedLabLink()));
  if (!link) {
    document.getElementById("vm-wait").textContent = "Wait for the teacher to start the VM, then tap Refresh lab.";
    return;
  }
  showVmFrame(link);
  if (!/^https:\/\//i.test(link)) window.location.href = link;
});

document.getElementById("refresh-lab").addEventListener("click", () => {
  bootLab();
});

document.getElementById("save-lab").addEventListener("click", async () => {
  const note = document.getElementById("lab-note");
  const password = document.getElementById("lab-password").value;
  const link = normalizeLabLink(document.getElementById("lab-link").value);
  if (password !== CONFIG.adminPassword) {
    note.hidden = false;
    note.textContent = "Staff password does not match.";
    return;
  }
  if (!link) {
    note.hidden = false;
    note.textContent = "Paste the VM web address or the IP the phones should open.";
    return;
  }
  try {
    await saveSharedLabLink(link);
    showVmFrame(link);
    note.hidden = false;
    note.classList.remove("warn-note");
    note.textContent = "Saved. Students who refresh this page can open the VM.";
  } catch (error) {
    note.hidden = false;
    note.classList.add("warn-note");
    note.textContent = error.message;
  }
});

(function setAzureButton() {
  const azure = document.getElementById("open-azure");
  if (!azure) return;
  azure.href = CONFIG.azureLabUrl || "https://portal.azure.com";
})();

bootLab();
