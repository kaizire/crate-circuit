(function () {
  function base() {
    const fromConfig = typeof CONFIG !== "undefined" && CONFIG.firebase && CONFIG.firebase.databaseURL;
    return String(fromConfig || "https://crate-circuit-default-rtdb.firebaseio.com").replace(/\/$/, "");
  }

  function labUrl() {
    return base() + "/visits/cratecircuit-lab.json";
  }

  function normalize(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    if (/^[\w.-]+:\d+$/.test(raw) || /^\d{1,3}(\.\d{1,3}){3}(:\d+)?$/.test(raw)) return "http://" + raw;
    return raw;
  }

  window.loadLabAddress = async function () {
    try {
      const response = await fetch(labUrl(), { cache: "no-store" });
      if (!response.ok) return "";
      const data = await response.json();
      return (data && data.consoleUrl) || "";
    } catch (error) {
      return "";
    }
  };

  window.saveLabAddress = async function (link) {
    const consoleUrl = normalize(link);
    const payload = JSON.stringify({
      kind: "lab",
      visitId: "cratecircuit-lab",
      name: "_lab",
      consoleUrl: consoleUrl,
      updatedAt: new Date().toISOString()
    });
    let response = await fetch(labUrl(), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: payload
    });
    if (!response.ok) {
      response = await fetch(labUrl(), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: payload
      });
    }
    if (!response.ok) {
      throw new Error("Could not save here. Open share-vm.html instead.");
    }
    return consoleUrl;
  };

  function attach() {
    const save = document.getElementById("save-lab");
    const field = document.getElementById("lab-link");
    const note = document.getElementById("lab-note");
    if (!save || !field || save.getAttribute("data-lab-fix") === "1") return;
    save.setAttribute("data-lab-fix", "1");
    save.addEventListener("click", async function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const link = normalize(field.value);
      if (!note) return;
      if (!link) {
        note.hidden = false;
        note.textContent = "Paste the VM IP, for example 192.168.1.50.";
        return;
      }
      try {
        await window.saveLabAddress(link);
        note.hidden = false;
        note.classList.remove("warn-note");
        note.textContent = "Saved. Students can open the VM without a teacher account.";
      } catch (error) {
        note.hidden = false;
        note.classList.add("warn-note");
        note.textContent = error.message;
      }
    }, true);
    window.loadLabAddress().then(function (link) {
      if (link && !field.value) field.value = link.replace(/^https?:\/\//i, "");
    });
  }

  setInterval(attach, 400);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", attach);
  else attach();
})();
