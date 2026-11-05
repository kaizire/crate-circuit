function bindVmBox(prefix, which) {
  const frame = document.getElementById(prefix + "-frame");
  const wait = document.getElementById(prefix + "-wait");
  const rdp = document.getElementById(prefix + "-rdp");
  const openBtn = document.getElementById("open-" + prefix);

  function paint(link) {
    if (!frame || !wait) return;
    if (!link) {
      frame.removeAttribute("src");
      frame.hidden = true;
      wait.hidden = false;
      wait.textContent = "Wait for your teacher to start the " + which + ".";
      return;
    }
    if (rdp) rdp.href = "ms-rd:connect?full%20address=s:" + encodeURIComponent(hostFromLink(link));
    if (/^https:\/\//i.test(link)) {
      frame.src = link;
      frame.hidden = false;
      wait.hidden = true;
      return;
    }
    frame.hidden = true;
    wait.hidden = false;
    wait.innerHTML = "<strong>Tap Open " + which + ".</strong> The desktop opens on this phone.";
  }

  if (openBtn) {
    openBtn.addEventListener("click", async () => {
      const lab = await loadSharedLab();
      const link = normalizeLabLink(which === "client" ? lab.clientUrl : lab.serverUrl);
      if (!link) {
        wait.textContent = "The teacher has not shared the " + which + " yet.";
        return;
      }
      paint(link);
      if (!/^https:\/\//i.test(link)) window.location.href = link;
    });
  }

  return paint;
}

const paintServer = bindVmBox("server", "server");
const paintClient = bindVmBox("client", "client");

async function bootLab() {
  const lab = await loadSharedLab();
  paintServer(normalizeLabLink(lab.serverUrl));
  paintClient(normalizeLabLink(lab.clientUrl));
}

const azure = document.getElementById("open-azure");
if (azure) azure.href = azureLabHref();

document.getElementById("refresh-lab").addEventListener("click", () => {
  bootLab();
});

bootLab();
