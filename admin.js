const app = document.getElementById("app");
const AUTH_KEY = "cratecircuit-admin-ok";

const dash = {
  visits: [],
  query: "",
  filter: "all",
  sort: "newest"
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
    <section class="lock-panel">
      <p class="kicker ink">Staff access</p>
      <h2>Unlock the log</h2>
      <p class="lede">Staff only. Open scores and the COC 3 teacher setup. Students use the quiz and the student lab page.</p>
      ${error ? `<p class="gate-error">${escapeHtml(error)}</p>` : ""}
      <label for="password">Password</label>
      <div class="lock-row">
        <input id="password" type="password" maxlength="40" autocomplete="current-password" placeholder="Staff password">
        <button class="primary" id="unlock" type="button">Open log</button>
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
    <section class="dash">
      <div class="log-head">
        <div>
          <p class="kicker ink">Staff terminal</p>
          <h2>Class log</h2>
          <p class="lede">Scores for the class, plus COC 3 teacher setup. Students do not see this page.</p>
        </div>
        <div class="dash-actions">
          <button class="ghost" id="reload" type="button">Refresh</button>
          <button class="primary" id="download" type="button">Download scores</button>
          <a class="ghost" href="coc3.html">Student lab page</a>
          <button class="ghost" id="lock" type="button">Lock</button>
        </div>
      </div>
      <div class="stats">
        <article class="stat tone-amber"><span>Quizzes</span><strong>${all.length}</strong><em>saved in the log</em></article>
        <article class="stat"><span>Students</span><strong>${uniqueNames(all)}</strong><em>unique names</em></article>
        <article class="stat tone-green"><span>Finished</span><strong>${finished.length}</strong><em>with a score</em></article>
        <article class="stat"><span>Open</span><strong>${started.length}</strong><em>still in progress</em></article>
        <article class="stat tone-amber"><span>Average</span><strong>${avg === null ? "—" : avg + "%"}</strong><em>finished quizzes</em></article>
      </div>
      <div class="dash-grid">
        <section class="panel">
          <div class="panel-head">
            <h3 class="dash-title">Roster</h3>
            <span class="count-chip">${uniqueNames(all)}</span>
          </div>
          <p class="panel-copy">Best score for each name.</p>
          <div class="visit-list" id="student-list">${studentMarkup()}</div>
        </section>
        <section class="panel">
          <div class="panel-head">
            <h3 class="dash-title">Quiz runs</h3>
            <span class="count-chip">${all.length}</span>
          </div>
          <div class="filters">
            <input id="search" type="text" maxlength="40" placeholder="Find a student name" value="${escapeHtml(dash.query)}">
            <div class="pills" id="filters">
              <button type="button" class="pill${dash.filter === "all" ? " picked" : ""}" data-filter="all">All</button>
              <button type="button" class="pill${dash.filter === "finished" ? " picked" : ""}" data-filter="finished">Finished</button>
              <button type="button" class="pill${dash.filter === "started" ? " picked" : ""}" data-filter="started">In progress</button>
            </div>
            <div class="pills" id="sorts">
              <button type="button" class="pill${dash.sort === "newest" ? " picked" : ""}" data-sort="newest">Newest</button>
              <button type="button" class="pill${dash.sort === "score" ? " picked" : ""}" data-sort="score">Top score</button>
            </div>
          </div>
          <div class="visit-list" id="attempt-list">${attemptMarkup()}</div>
        </section>
      </div>
      <section class="panel staff-lab" id="coc3-teacher">
        <div class="panel-head">
          <h3 class="dash-title">COC 3 · Teacher</h3>
          <span class="count-chip">Staff only</span>
        </div>
        <p class="panel-copy">Students open the virtual machine from their phones. You run VMware on the lab PC. Do not send the class straight to Azure.</p>
        <h3 class="dash-title">1. Create the VMs on this PC</h3>
        <ol class="lab-steps">
          <li>Open <strong>VMware Workstation</strong>. Download <strong>Create empty VMs</strong> below if COC3-SERVER and COC3-CLIENT are not there yet.</li>
          <li>Attach a Windows Server ISO to <strong>COC3-SERVER</strong> and a Windows ISO to <strong>COC3-CLIENT</strong>.</li>
          <li>Start each VM and install Windows <em>inside the VM window</em>, never on the PC desktop.</li>
        </ol>
        <h3 class="dash-title">2. Set up COC 3 inside the server VM</h3>
        <ol class="lab-steps">
          <li>On <strong>COC3-SERVER</strong> only: install Active Directory Domain Services, DNS, DHCP, and File Services.</li>
          <li>Turn on Remote Desktop. Set the network adapter to <strong>Bridged</strong> so phones on school Wi‑Fi can reach it.</li>
          <li>In the VM, run <strong>ipconfig</strong> and copy the IPv4 address (example 192.168.1.50).</li>
        </ol>
        <h3 class="dash-title">3. Share the VM with phones</h3>
        <ol class="lab-steps">
          <li>Paste that IP below and tap <strong>Share with students</strong>.</li>
          <li>Tell the class to open the student lab page and tap <strong>Open the VM</strong>.</li>
        </ol>
        <label for="lab-link">VM address for students</label>
        <input id="lab-link" type="text" maxlength="200" placeholder="192.168.1.50">
        <div class="row start-actions">
          <button class="primary" id="save-lab" type="button">Share with students</button>
          <a class="ghost" href="lab/create-coc3-vms.ps1" download>Create empty VMs</a>
        </div>
        <p class="muted-note" id="lab-note" hidden></p>
      </section>
    </section>
  `;
  document.getElementById("reload").addEventListener("click", loadDashboard);
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
  bindTeacherLab();
}

function labStoreUrl() {
  return String((CONFIG.firebase && CONFIG.firebase.databaseURL) || "").replace(/\/$/, "") + "/lab.json";
}

function normalizeLabLink(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^[\w.-]+:\d+$/.test(raw) || /^\d{1,3}(\.\d{1,3}){3}(:\d+)?$/.test(raw)) return "http://" + raw;
  return raw;
}

async function bindTeacherLab() {
  const field = document.getElementById("lab-link");
  const note = document.getElementById("lab-note");
  const save = document.getElementById("save-lab");
  if (!field || !save) return;
  try {
    const response = await fetch(labStoreUrl(), { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      if (data && data.consoleUrl) field.value = data.consoleUrl;
    }
  } catch (error) {
    field.value = CONFIG.labConsoleUrl || "";
  }
  if (!field.value) field.value = CONFIG.labConsoleUrl || "";
  save.addEventListener("click", async () => {
    const link = normalizeLabLink(field.value);
    if (!link) {
      note.hidden = false;
      note.textContent = "Paste the VM IP, for example 192.168.1.50.";
      return;
    }
    try {
      const response = await fetch(labStoreUrl(), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consoleUrl: link, updatedAt: new Date().toISOString() })
      });
      if (!response.ok) throw new Error("Could not save. Allow read and write on lab in Firebase rules.");
      note.hidden = false;
      note.classList.remove("warn-note");
      note.textContent = "Saved. Students tap Open the VM on the student lab page.";
    } catch (error) {
      note.hidden = false;
      note.classList.add("warn-note");
      note.textContent = error.message;
    }
  });
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
