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

function renderDashboard() {
  const all = dash.visits;
  const finished = all.filter((visit) => visit.status === "finished");
  const started = all.filter((visit) => visit.status !== "finished");
  const avg = averagePercent(finished);
  const students = groupedStudents(all);
  const shown = filteredVisits();

  document.getElementById("who-label").textContent = all.length + " visits";

  const studentRows = students.length
    ? students.map((student) => {
      const best = percentOf(student.best);
      return `
        <article class="student-row">
          <div>
            <div class="visit-name">${escapeHtml(student.name)}</div>
            <p class="muted-note">${student.attempts} ${student.attempts === 1 ? "try" : "tries"} · ${student.finished} finished</p>
          </div>
          <div class="score-chip">${best === null ? "No score" : best + "%"}</div>
        </article>
      `;
    }).join("")
    : `<p class="muted-note">No students yet.</p>`;

  const attemptRows = shown.length
    ? shown.map((visit) => {
      const percent = percentOf(visit);
      const tone = visit.status === "finished"
        ? (percent >= 70 ? "right" : "wrong")
        : "";
      return `
        <article class="visit ${tone}">
          <div class="visit-top">
            <div class="visit-name">${escapeHtml(visit.name || "Anonymous")}</div>
            <span class="tag">${visit.status === "finished" ? "Finished" : "In progress"}</span>
          </div>
          ${percent === null ? "" : `<div class="bar"><span style="width:${Math.max(percent, 3)}%"></span></div>`}
          <dl>
            <div><dt>Score</dt><dd>${escapeHtml(scoreLabel(visit))}</dd></div>
            <div><dt>Questions</dt><dd>${escapeHtml(visit.length ?? "—")}</dd></div>
            <div><dt>Started</dt><dd>${escapeHtml(formatWhen(visit.startedAt))}</dd></div>
            <div><dt>Finished</dt><dd>${escapeHtml(formatWhen(visit.finishedAt))}</dd></div>
          </dl>
        </article>
      `;
    }).join("")
    : `<p class="muted-note">No visits match this search.</p>`;

  app.innerHTML = `
    <section class="dash">
      <div class="log-head">
        <div>
          <h2>Dashboard</h2>
          <p class="lede">Who took CrateCircuit, how they scored, and how often they tried.</p>
        </div>
        <div class="dash-actions">
          <button class="ghost" id="reload" type="button">Refresh</button>
          <button class="ghost" id="lock" type="button">Lock</button>
        </div>
      </div>
      <div class="stats">
        <article class="stat"><span>Visits</span><strong>${all.length}</strong></article>
        <article class="stat"><span>Students</span><strong>${uniqueNames(all)}</strong></article>
        <article class="stat"><span>Finished</span><strong>${finished.length}</strong></article>
        <article class="stat"><span>In progress</span><strong>${started.length}</strong></article>
        <article class="stat"><span>Average score</span><strong>${avg === null ? "—" : avg + "%"}</strong></article>
      </div>
      <div class="dash-grid">
        <div>
          <h3 class="dash-title">Students</h3>
          <div class="visit-list">${studentRows}</div>
        </div>
        <div>
          <h3 class="dash-title">Attempts</h3>
          <div class="filters">
            <input id="search" type="text" maxlength="40" placeholder="Search by name" value="${escapeHtml(dash.query)}">
            <select id="filter">
              <option value="all"${dash.filter === "all" ? " selected" : ""}>All</option>
              <option value="finished"${dash.filter === "finished" ? " selected" : ""}>Finished</option>
              <option value="started"${dash.filter === "started" ? " selected" : ""}>In progress</option>
            </select>
            <select id="sort">
              <option value="newest"${dash.sort === "newest" ? " selected" : ""}>Newest</option>
              <option value="score"${dash.sort === "score" ? " selected" : ""}>Highest score</option>
            </select>
          </div>
          <div class="visit-list">${attemptRows}</div>
        </div>
      </div>
    </section>
  `;
  document.getElementById("reload").addEventListener("click", loadDashboard);
  document.getElementById("lock").addEventListener("click", () => {
    sessionStorage.removeItem(AUTH_KEY);
    showGate();
  });
  const search = document.getElementById("search");
  search.addEventListener("input", (event) => {
    dash.query = event.target.value;
    renderDashboard();
    const next = document.getElementById("search");
    next.focus();
    next.setSelectionRange(dash.query.length, dash.query.length);
  });
  document.getElementById("filter").addEventListener("change", (event) => {
    dash.filter = event.target.value;
    renderDashboard();
  });
  document.getElementById("sort").addEventListener("change", (event) => {
    dash.sort = event.target.value;
    renderDashboard();
  });
}

if (sessionStorage.getItem(AUTH_KEY) === "1") loadDashboard();
else showGate();
