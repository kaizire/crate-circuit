const app = document.getElementById("app");
const AUTH_KEY = "cratecircuit-admin-ok";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatWhen(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return escapeHtml(iso);
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function scoreLabel(visit) {
  if (typeof visit.score === "number" && typeof visit.total === "number") {
    const percent = typeof visit.percent === "number" ? visit.percent + "%" : "";
    return visit.score + "/" + visit.total + (percent ? " · " + percent : "");
  }
  if (visit.status === "started") return "In progress";
  if (visit.status === "view") return "Opened page";
  return "No score yet";
}

function showGate(error) {
  app.innerHTML = `
    <section class="intro">
      <h2>Unlock the log.</h2>
      <p class="lede">Enter the staff password to see who started or finished the quiz.</p>
      ${error ? `<p class="gate-error">${escapeHtml(error)}</p>` : ""}
      <label for="password">Password</label>
      <input id="password" type="password" maxlength="40" autocomplete="current-password">
      <button class="primary" id="unlock" type="button">Open log</button>
    </section>
  `;
  const field = document.getElementById("password");
  const unlock = () => {
    if (field.value === CONFIG.adminPassword) {
      sessionStorage.setItem(AUTH_KEY, "1");
      showLog();
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

async function showLog() {
  app.innerHTML = `
    <section>
      <h2>Quiz visits</h2>
      <p class="lede">Newest first. Names come from the start screen; scores appear after someone finishes.</p>
      <p class="muted-note">Loading…</p>
    </section>
  `;
  try {
    const visits = await loadVisits();
    const rows = visits.length
      ? visits.map((visit) => `
          <article class="visit ${visit.status === "finished" ? "right" : ""}">
            <div class="visit-name">${escapeHtml(visit.name || "Anonymous")}</div>
            <dl>
              <div><dt>Started</dt><dd>${formatWhen(visit.startedAt)}</dd></div>
              <div><dt>Questions</dt><dd>${escapeHtml(visit.length ?? "—")}</dd></div>
              <div><dt>Score</dt><dd>${escapeHtml(scoreLabel(visit))}</dd></div>
              <div><dt>Finished</dt><dd>${formatWhen(visit.finishedAt)}</dd></div>
            </dl>
          </article>
        `).join("")
      : `<p class="muted-note">No visits yet. Start a quiz from the main page, then refresh this log.</p>`;
    app.innerHTML = `
      <section>
        <div class="log-head">
          <div>
            <h2>Quiz visits</h2>
            <p class="lede">${visits.length} recorded ${visits.length === 1 ? "visit" : "visits"}.</p>
          </div>
          <button class="ghost" id="reload" type="button">Refresh</button>
        </div>
        <div class="visit-list">${rows}</div>
      </section>
    `;
    document.getElementById("reload").addEventListener("click", showLog);
  } catch (error) {
    app.innerHTML = `
      <section>
        <h2>Could not load visits</h2>
        <p class="lede">The visitor store did not respond. Try again in a moment.</p>
        <button class="primary" id="retry" type="button">Try again</button>
      </section>
    `;
    document.getElementById("retry").addEventListener("click", showLog);
  }
}

if (sessionStorage.getItem(AUTH_KEY) === "1") showLog();
else showGate();
