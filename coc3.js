function showVmFrame(link) {
  const frame = document.getElementById("vm-frame");
  const wait = document.getElementById("vm-wait");
  const rdp = document.getElementById("open-rdp");
  if (!frame || !wait) return;
  if (!link) {
    frame.removeAttribute("src");
    frame.hidden = true;
    wait.hidden = false;
    wait.textContent = "Wait for your teacher to start the lab, then tap Refresh.";
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
  wait.innerHTML = "<strong>Tap Open the VM.</strong> The desktop opens on this phone.";
}

async function bootLab() {
  const link = normalizeLabLink(await loadSharedLabLink());
  showVmFrame(link);
  return link;
}

const azure = document.getElementById("open-azure");
if (azure) azure.href = azureLabHref();

document.getElementById("open-vm").addEventListener("click", async () => {
  const link = normalizeLabLink(await loadSharedLabLink());
  if (!link) {
    document.getElementById("vm-wait").textContent = "The teacher has not shared the lab yet. Tap Refresh after they start it.";
    return;
  }
  showVmFrame(link);
  if (!/^https:\/\//i.test(link)) window.location.href = link;
});

document.getElementById("refresh-lab").addEventListener("click", () => {
  bootLab();
});

bootLab();
