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
    <section class="intro">
      <h2>Staff dashboard</h2>
      <p class="lede">Enter the password to see who took the quiz, their scores, and how many times they tried.</p>
      ${error ? `<p class="gate-error">${escapeHtml(error)}</p>` : ""}
      <label for="password">Password</label>
      <input id="password" type="password" maxlength="40" autocomplete="current-password">
      <button class="primary" id="unlock" type="button">Open dashboard</button>
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
    dash.visits = await loadVisits();
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

function studentMarkup() {
  const students = groupedStudents(dash.visits);
  if (!students.length) return `<p class="muted-note">No students yet.</p>`;
  return students.map((student) => {
    const best = percentOf(student.best);
    return `
      <article class="student-row">
        <div class="avatar">${escapeHtml(initials(student.name))}</div>
        <div class="student-copy">
          <div class="visit-name">${escapeHtml(student.name)}</div>
          <p class="muted-note">${student.attempts} ${student.attempts === 1 ? "try" : "tries"} · ${student.finished} finished</p>
        </div>
        <div class="score-chip">${best === null ? "—" : best + "%"}</div>
        <button class="ghost danger" type="button" data-delete-name="${escapeHtml(student.name)}">Delete</button>
      </article>
    `;
  }).join("");
}

function attemptMarkup() {
  const shown = filteredVisits();
  if (!shown.length) return `<p class="muted-note">No visits match this search.</p>`;
  return shown.map((visit) => {
    const percent = percentOf(visit);
    const tone = visit.status === "finished" ? (percent >= 70 ? "pass" : "fail") : "wait";
    return `
      <article class="attempt ${tone}">
        <div class="avatar">${escapeHtml(initials(visit.name || "A"))}</div>
        <div class="attempt-copy">
          <div class="visit-top">
            <div class="visit-name">${escapeHtml(visit.name || "Anonymous")}</div>
            <span class="pill-tag">${visit.status === "finished" ? "Finished" : "In progress"}</span>
          </div>
          <p class="muted-note">${escapeHtml(formatWhen(visit.startedAt))} · ${escapeHtml(visit.length ?? "—")} questions</p>
          ${percent === null ? "" : `<div class="bar"><span style="width:${Math.max(percent, 4)}%"></span></div>`}
        </div>
        <div class="score-chip">${percent === null ? "—" : percent + "%"}</div>
        ${visit._id ? `<button class="ghost danger" type="button" data-delete="${escapeHtml(visit._id)}" data-name="${escapeHtml(visit.name || "this student")}">Delete</button>` : ""}
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
          <p class="kicker ink">Overview</p>
          <h2>Quiz activity</h2>
          <p class="lede">Names, attempts, and scores from CrateCircuit.</p>
        </div>
        <div class="dash-actions">
          <button class="ghost" id="reload" type="button">Refresh</button>
          <button class="ghost" id="lock" type="button">Lock</button>
        </div>
      </div>
      <div class="stats">
        <article class="stat tone-amber"><span>Visits</span><strong>${all.length}</strong></article>
        <article class="stat tone-green"><span>Students</span><strong>${uniqueNames(all)}</strong></article>
        <article class="stat"><span>Finished</span><strong>${finished.length}</strong></article>
        <article class="stat"><span>In progress</span><strong>${started.length}</strong></article>
        <article class="stat tone-amber"><span>Average</span><strong>${avg === null ? "—" : avg + "%"}</strong></article>
      </div>
      <div class="dash-grid">
        <section class="panel">
          <h3 class="dash-title">Students</h3>
          <div class="visit-list" id="student-list">${studentMarkup()}</div>
        </section>
        <section class="panel">
          <h3 class="dash-title">Attempts</h3>
          <div class="filters">
            <input id="search" type="text" maxlength="40" placeholder="Search by name" value="${escapeHtml(dash.query)}">
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
    </section>
  `;
  document.getElementById("reload").addEventListener("click", loadDashboard);
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
