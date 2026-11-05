const app = document.getElementById("app");
const AUTH_KEY = "cratecircuit-admin-ok";

const TAB_KEY = "cratecircuit-staff-tab";

const dash = {
  visits: [],
  query: "",
  filter: "all",
  sort: "newest",
  tab: sessionStorage.getItem(TAB_KEY) || "scores"
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function percentOf(visit) {
  if (typeof visit.percent === "number") return visit.percent;
  if (typeof visit.score === "number" && visit.total) {
    return Math.round((visit.score / visit.total) * 100);
  }
  return null;
}

function uniqueNames(visits) {
  const names = new Set(
    visits.map((visit) => String(visit.name || "").trim().toLowerCase().replace(/\s+/g, " ")).filter(Boolean)
  );
  return names.size;
}

function averagePercent(visits) {
  const scored = visits.map(percentOf).filter((value) => typeof value === "number");
  if (!scored.length) return null;
  return Math.round(scored.reduce((sum, value) => sum + value, 0) / scored.length);
}

function groupedStudents(visits) {
  const groups = new Map();
  visits.forEach((visit) => {
    const key = String(visit.name || "Anonymous").trim().toLowerCase().replace(/\s+/g, " ") || "anonymous";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(visit);
  });
  return Array.from(groups.entries()).map(([, list]) => {
    const finished = list.filter((visit) => typeof percentOf(visit) === "number");
    const best = finished.length
      ? finished.reduce((top, visit) => (percentOf(visit) > percentOf(top) ? visit : top))
      : list[0];
    return {
      name: list[0].name || "Anonymous",
      attempts: list.length,
      finished: finished.length,
      best,
      latest: list[0]
    };
  }).sort((a, b) => (percentOf(b.best) ?? -1) - (percentOf(a.best) ?? -1));
}

function filteredVisits() {
  const query = dash.query.trim().toLowerCase();
  let list = dash.visits.filter((visit) => {
    const name = String(visit.name || "").toLowerCase();
    if (query && !name.includes(query)) return false;
    if (dash.filter === "finished") return visit.status === "finished";
    if (dash.filter === "started") return visit.status !== "finished";
    return true;
  });
  if (dash.sort === "score") {
    list = list.slice().sort((a, b) => (percentOf(b) ?? -1) - (percentOf(a) ?? -1));
  }
  return list;
}

function showGate(error) {
  document.getElementById("who-label").textContent = "Locked";
  app.innerHTML = `
    <section class="lock-panel crate-lock">
      <p class="kicker ink">Staff crate · Key</p>
      <h2>Unlock<br>dispatch</h2>
      <p class="lede">Scores in one bay. COC 3 lab in the other. Students never see this page.</p>
      ${error ? `<p class="gate-error">${escapeHtml(error)}</p>` : ""}
      <label for="password">Crate key</label>
      <div class="lock-row">
        <input id="password" type="password" maxlength="40" autocomplete="current-password" placeholder="Staff password">
        <button class="primary" id="unlock" type="button">Open crate</button>
      </div>
    </section>
  `;
  const field = document.getElementById("password");
  const unlock = () => {
    if (field.value === CONFIG.adminPassword) {
      sessionStorage.setItem(AUTH_KEY, "1");
      loadDashboard();
    } else {
      showGate("That password does not match.");
    }
  };
  document.getElementById("unlock").addEventListener("click", unlock);
  field.addEventListener("keydown", (event) => {
    if (event.key === "Enter") unlock();
  });
  field.focus();
}

async function loadDashboard() {
  app.innerHTML = `
    <section>
      <h2>Dashboard</h2>
      <p class="muted-note">Loading visits…</p>
    </section>
  `;
  try {
    dash.visits = await loadRemoteVisits();
    renderDashboard();
  } catch (error) {
    app.innerHTML = `
      <section>
        <h2>Could not load the dashboard</h2>
        <p class="lede">The visitor store did not respond. Try again in a moment.</p>
        <button class="primary" id="retry" type="button">Try again</button>
      </section>
    `;
    document.getElementById("retry").addEventListener("click", loadDashboard);
  }
}

function initials(name) {
  const parts = String(name || "A").trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part.charAt(0).toUpperCase()).join("") || "A";
}

function emptyPanel(title, copy) {
  return `
    <div class="empty-panel">
      <p class="empty-kicker">${escapeHtml(title)}</p>
      <p>${escapeHtml(copy)}</p>
    </div>
  `;
}

function statusLabel(visit) {
  if (visit.timedOut) return "Time up";
  if (visit.status === "finished") return "Finished";
  return "In progress";
}

function scoreLine(visit) {
  if (typeof visit.score === "number" && typeof visit.total === "number") {
    return visit.score + "/" + visit.total;
  }
  const percent = percentOf(visit);
  return percent === null ? "—" : percent + "%";
}

function studentMarkup() {
  const students = groupedStudents(dash.visits);
  if (!students.length) {
    return emptyPanel("No students yet", "Names appear here after a quiz is saved to the class log.");
  }
  return students.map((student) => {
    const best = percentOf(student.best);
    return `
      <article class="student-row">
        <div class="avatar">${escapeHtml(initials(student.name))}</div>
        <div class="student-copy">
          <div class="visit-name">${escapeHtml(student.name)}</div>
          <p class="muted-note">${student.finished}/${student.attempts} finished</p>
          ${best === null ? "" : `<div class="bar"><span style="width:${Math.max(best, 4)}%"></span></div>`}
        </div>
        <div class="score-chip" title="Best score">${best === null ? "—" : best + "%"}</div>
        <button class="ghost danger" type="button" data-delete-name="${escapeHtml(student.name)}">Remove</button>
      </article>
    `;
  }).join("");
}

function attemptMarkup() {
  const shown = filteredVisits();
  if (!shown.length) {
    return emptyPanel("No matching quizzes", "Try another name, or switch All / Finished / In progress.");
  }
  return shown.map((visit) => {
    const percent = percentOf(visit);
    const tone = visit.status === "finished" ? (percent >= 70 ? "pass" : "fail") : "wait";
    const length = visit.length || visit.total || "—";
    return `
      <article class="attempt ${tone}">
        <div class="avatar">${escapeHtml(initials(visit.name || "A"))}</div>
        <div class="attempt-copy">
          <div class="visit-top">
            <div class="visit-name">${escapeHtml(visit.name || "Anonymous")}</div>
            <span class="pill-tag ${visit.timedOut ? "warn" : ""}">${escapeHtml(statusLabel(visit))}</span>
          </div>
          <p class="muted-note">${escapeHtml(formatWhen(visit.startedAt))} · ${escapeHtml(length)} questions</p>
          ${percent === null ? "" : `<div class="bar"><span style="width:${Math.max(percent, 4)}%"></span></div>`}
        </div>
        <div class="score-stack">
          <div class="score-chip">${percent === null ? "—" : percent + "%"}</div>
          <span class="score-sub">${escapeHtml(scoreLine(visit))}</span>
        </div>
        ${visit._id ? `<button class="ghost danger" type="button" data-delete="${escapeHtml(visit._id)}" data-name="${escapeHtml(visit.name || "this student")}">Remove</button>` : ""}
      </article>
    `;
  }).join("");
}

function renderLists() {
  const students = document.getElementById("student-list");
  const attempts = document.getElementById("attempt-list");
  if (students) students.innerHTML = studentMarkup();
  if (attempts) attempts.innerHTML = attemptMarkup();
}

function renderDashboard() {
  const all = dash.visits;
  const finished = all.filter((visit) => visit.status === "finished");
  const started = all.filter((visit) => visit.status !== "finished");
  const avg = averagePercent(finished);
  document.getElementById("who-label").textContent = all.length + " visits";

  app.innerHTML = `
    <section class="dash staff-console">
      <nav class="side-rail" id="side-rail" aria-label="Staff bays">
        <button type="button" class="rail-btn${dash.tab === "scores" ? " picked" : ""}" data-tab="scores">
          <span class="rail-mark">01</span>
          <span>Scores</span>
        </button>
        <button type="button" class="rail-btn${dash.tab === "lab" ? " picked" : ""}" data-tab="lab">
          <span class="rail-mark">COC</span>
          <span>Server</span>
        </button>
        <button type="button" class="rail-btn${dash.tab === "client" ? " picked" : ""}" data-tab="client">
          <span class="rail-mark">PC</span>
          <span>Client</span>
        </button>
      </nav>
      <div class="staff-main">
      <div class="console-head">
        <div>
          <p class="kicker ink">Dispatch bay</p>
          <h2>Staff crate</h2>
        </div>
        <div class="dash-actions">
          <button class="ghost" id="reload" type="button">Refresh</button>
          <button class="danger wipe-all" id="wipe" type="button">Delete all data</button>
          <button class="ghost" id="lock" type="button">Lock</button>
        </div>
      </div>

      <div id="bay-scores" class="staff-bay" ${dash.tab === "scores" ? "" : "hidden"}>
        <div class="gauge-row">
          <article class="gauge"><span>Class</span><strong>${uniqueNames(all)}</strong><em>names</em></article>
          <article class="gauge tone-ok"><span>Done</span><strong>${finished.length}</strong><em>of ${all.length} quizzes</em></article>
          <article class="gauge tone-open"><span>Open</span><strong>${started.length}</strong><em>still running</em></article>
          <article class="gauge tone-avg"><span>Avg</span><strong>${avg === null ? "—" : avg + "%"}</strong><em>finished only</em></article>
        </div>
        <div class="console-toolbar">
          <input id="search" type="text" maxlength="40" placeholder="Find a name" value="${escapeHtml(dash.query)}">
          <div class="pills" id="filters">
            <button type="button" class="pill${dash.filter === "all" ? " picked" : ""}" data-filter="all">All</button>
            <button type="button" class="pill${dash.filter === "finished" ? " picked" : ""}" data-filter="finished">Done</button>
            <button type="button" class="pill${dash.filter === "started" ? " picked" : ""}" data-filter="started">Open</button>
          </div>
          <div class="pills" id="sorts">
            <button type="button" class="pill${dash.sort === "newest" ? " picked" : ""}" data-sort="newest">Newest</button>
            <button type="button" class="pill${dash.sort === "score" ? " picked" : ""}" data-sort="score">Top</button>
          </div>
          <button class="primary" id="download" type="button">Download</button>
        </div>
        <div class="dash-grid">
          <section class="panel crate-bay">
            <div class="panel-head">
              <h3 class="dash-title">Manifest</h3>
              <span class="count-chip">${uniqueNames(all)}</span>
            </div>
            <p class="panel-copy">Best score per student.</p>
            <div class="visit-list" id="student-list">${studentMarkup()}</div>
          </section>
          <section class="panel crate-bay">
            <div class="panel-head">
              <h3 class="dash-title">Tickets</h3>
              <span class="count-chip">${all.length}</span>
            </div>
            <p class="panel-copy">Each quiz run.</p>
            <div class="visit-list" id="attempt-list">${attemptMarkup()}</div>
          </section>
        </div>
      </div>

      <div id="bay-lab" class="staff-bay" ${dash.tab === "lab" ? "" : "hidden"}>
        <section class="panel lab-staff crate-bay">
          <div class="panel-head">
            <h3 class="dash-title">COC3-SERVER</h3>
          </div>
          <p class="panel-copy">Windows Server VM. Install AD, DNS, DHCP, and File Services only inside this machine.</p>
          <div class="lab-actions">
            <a class="primary" href="lab/auto-setup-coc3.ps1" download>Auto setup server + client</a>
            <a class="ghost" href="lab/setup-server-roles.ps1" download>Inside-server script</a>
            <a class="ghost" id="open-azure-staff" href="https://portal.azure.com" target="_blank" rel="noopener">Open Azure</a>
            <a class="ghost" href="coc3.html" target="_blank" rel="noopener">Student phone page</a>
          </div>
          <ol class="lab-steps">
            <li>On the lab PC, run <strong>Auto setup server + client</strong> (Right-click → Run with PowerShell). It creates and starts both VMs.</li>
            <li>Finish Windows setup inside the SERVER window. Then run <strong>Inside-server script</strong> as Administrator in that VM (creates crate.lab, DNS, DHCP, share).</li>
            <li>Share the server Bridged IP so phones can tap <strong>Open server</strong>.</li>
          </ol>
          <label for="lab-link">Server IP or https link</label>
          <input id="lab-link" type="text" maxlength="200" placeholder="192.168.1.50 or https://portal.azure.com">
          <div class="row start-actions">
            <button class="primary" id="save-lab" type="button">Share server</button>
          </div>
          <p class="muted-note" id="lab-note" hidden></p>
        </section>
      </div>

      <div id="bay-client" class="staff-bay" ${dash.tab === "client" ? "" : "hidden"}>
        <section class="panel lab-staff crate-bay">
          <div class="panel-head">
            <h3 class="dash-title">COC3-CLIENT</h3>
          </div>
          <p class="panel-copy">Windows client PC. Students join the domain and test DHCP and the shared folder from this VM, not from their phone OS.</p>
          <div class="lab-actions">
            <a class="primary" href="lab/auto-setup-coc3.ps1" download>Auto setup server + client</a>
            <a class="ghost" href="lab/setup-client-domain.ps1" download>Inside-client script</a>
            <a class="ghost" href="coc3.html" target="_blank" rel="noopener">Student phone page</a>
          </div>
          <ol class="lab-steps">
            <li>The same auto-setup also starts <strong>COC3-CLIENT</strong>. Finish Windows setup inside the CLIENT window.</li>
            <li>Run <strong>Inside-client script</strong> as Administrator in that VM to join domain <strong>crate.lab</strong>.</li>
            <li>Share the client Bridged IP so phones can tap <strong>Open client</strong>.</li>
          </ol>
          <label for="client-link">Client IP or https link</label>
          <input id="client-link" type="text" maxlength="200" placeholder="192.168.1.51">
          <div class="row start-actions">
            <button class="primary" id="save-client" type="button">Share client</button>
          </div>
          <p class="muted-note" id="client-note" hidden></p>
        </section>
      </div>
      </div>
    </section>
  `;
  bindTeacherLab();
  bindTabs();
  document.getElementById("reload").addEventListener("click", loadDashboard);
  document.getElementById("wipe").addEventListener("click", clearAllScores);
  document.getElementById("download").addEventListener("click", () => downloadTermLog(dash.visits));
  document.getElementById("lock").addEventListener("click", () => {
    sessionStorage.removeItem(AUTH_KEY);
    showGate();
  });
  document.getElementById("search").addEventListener("input", (event) => {
    dash.query = event.target.value;
    renderLists();
  });
  document.getElementById("filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    dash.filter = button.getAttribute("data-filter");
    document.querySelectorAll("#filters .pill").forEach((node) => node.classList.toggle("picked", node === button));
    renderLists();
  });
  document.getElementById("sorts").addEventListener("click", (event) => {
    const button = event.target.closest("[data-sort]");
    if (!button) return;
    dash.sort = button.getAttribute("data-sort");
    document.querySelectorAll("#sorts .pill").forEach((node) => node.classList.toggle("picked", node === button));
    renderLists();
  });
  document.getElementById("attempt-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete]");
    if (!button) return;
    removeAttempt(button.getAttribute("data-delete"), button.getAttribute("data-name"), button);
  });
  document.getElementById("student-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-name]");
    if (!button) return;
    removeStudent(button.getAttribute("data-delete-name"), button);
  });
}

function bindTabs() {
  const nav = document.getElementById("side-rail");
  if (!nav) return;
  nav.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tab]");
    if (!button) return;
    dash.tab = button.getAttribute("data-tab");
    sessionStorage.setItem(TAB_KEY, dash.tab);
    document.getElementById("bay-scores").hidden = dash.tab !== "scores";
    document.getElementById("bay-lab").hidden = dash.tab !== "lab";
    document.getElementById("bay-client").hidden = dash.tab !== "client";
    nav.querySelectorAll(".rail-btn").forEach((node) => node.classList.toggle("picked", node === button));
  });
}

function bindShareField(fieldId, noteId, buttonId, key, okText, emptyText) {
  const field = document.getElementById(fieldId);
  const note = document.getElementById(noteId);
  const button = document.getElementById(buttonId);
  if (!field || !button) return;
  button.addEventListener("click", async () => {
    const link = normalizeLabLink(field.value);
    if (!link) {
      note.hidden = false;
      note.classList.add("warn-note");
      note.textContent = emptyText;
      return;
    }
    try {
      const payload = {};
      payload[key] = link;
      await saveSharedLab(payload);
      note.hidden = false;
      note.classList.remove("warn-note");
      note.textContent = okText;
    } catch (error) {
      note.hidden = false;
      note.classList.add("warn-note");
      note.textContent = error.message;
    }
  });
}

function bindTeacherLab() {
  const azure = document.getElementById("open-azure-staff");
  if (azure) azure.href = azureLabHref();
  loadSharedLab().then((lab) => {
    const server = document.getElementById("lab-link");
    const client = document.getElementById("client-link");
    if (server && lab.serverUrl) server.value = lab.serverUrl;
    if (client && lab.clientUrl) client.value = lab.clientUrl;
  });
  bindShareField("lab-link", "lab-note", "save-lab", "serverUrl", "Server shared. Students tap Open server.", "Paste the server IP or Azure link first.");
  bindShareField("client-link", "client-note", "save-client", "clientUrl", "Client shared. Students tap Open client.", "Paste the client IP or link first.");
}

async function clearAllScores() {
  if (!window.confirm("Delete ALL quiz data from Firebase and this staff dashboard? Lab server/client links stay. New quizzes can still be saved.")) return;
  if (!window.confirm("This cannot be undone. Delete all student scores now?")) return;
  const button = document.getElementById("wipe");
  if (button) {
    button.disabled = true;
    button.textContent = "Deleting…";
  }
  try {
    await wipeAllVisits();
    dash.visits = [];
    await loadDashboard();
  } catch (error) {
    if (button) {
      button.disabled = false;
      button.textContent = "Delete all data";
    }
    window.alert(error.message || "Could not delete Firebase data. Check Realtime Database rules allow write on /visits.");
  }
}

async function removeAttempt(id, name, button) {
  if (!id) return;
  if (!window.confirm("Delete this quiz by " + (name || "this student") + "?")) return;
  button.disabled = true;
  try {
    await deleteVisit(id);
    await loadDashboard();
  } catch (error) {
    button.disabled = false;
    window.alert("Could not delete that quiz. Try refresh, then delete again.");
  }
}

async function removeStudent(name, button) {
  const visits = dash.visits.filter((visit) => samePlayerName(visit.name, name) && visit._id);
  if (!visits.length) return;
  if (!window.confirm("Delete all " + visits.length + " quizzes for " + name + "?")) return;
  button.disabled = true;
  try {
    for (const visit of visits) {
      await deleteVisit(visit._id);
    }
    await loadDashboard();
  } catch (error) {
    button.disabled = false;
    window.alert("Could not delete those quizzes. Try refresh, then delete again.");
  }
}

if (sessionStorage.getItem(AUTH_KEY) === "1") loadDashboard();
else showGate();
