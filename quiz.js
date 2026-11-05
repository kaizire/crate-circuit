const app = document.getElementById("app");
const led = document.getElementById("status-led");
const who = document.getElementById("who-label");

const state = {
  name: "",
  length: 10,
  deck: [],
  index: 0,
  picks: [],
  endsAt: "",
  closing: false
};

const lengths = [10, QUESTIONS.length];
const QUIZ_SECONDS = {
  10: 10 * 60,
  [QUESTIONS.length]: 30 * 60
};

let timerTick = null;

function quizSecondsFor(length) {
  if (QUIZ_SECONDS[length]) return QUIZ_SECONDS[length];
  return Math.max(Number(length) || 1, 1) * 60;
}

function formatMinutes(seconds) {
  return Math.round(seconds / 60) + " min";
}

function formatClock(seconds) {
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return String(minutes).padStart(2, "0") + ":" + String(rest).padStart(2, "0");
}

function remainingMs() {
  const ends = Date.parse(state.endsAt || "");
  if (!Number.isFinite(ends)) return 0;
  return ends - Date.now();
}

function stopQuizTimer() {
  if (timerTick) {
    clearInterval(timerTick);
    timerTick = null;
  }
}

function paintTimer() {
  const node = document.getElementById("quiz-timer");
  if (!node) return;
  const left = remainingMs();
  node.textContent = formatClock(left / 1000);
  node.classList.toggle("low", left <= 60 * 1000);
}

function startQuizTimer() {
  stopQuizTimer();
  paintTimer();
  timerTick = setInterval(() => {
    paintTimer();
    if (state.closing) return;
    if (remainingMs() <= 0) finishQuiz({ timedOut: true });
  }, 250);
}

function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function setLed(mode) {
  led.className = "led" + (mode ? " " + mode : "");
}

function requireStudentName(noteId) {
  const name = String(state.name || "").trim();
  const note = noteId ? document.getElementById(noteId) : null;
  if (name) {
    state.name = name;
    if (note) note.hidden = true;
    return name;
  }
  if (note) {
    note.hidden = false;
    note.classList.add("warn-note");
    note.textContent = "Type your name first before you start the quiz.";
  }
  const input = document.getElementById("player");
  if (input) {
    input.focus();
    input.setAttribute("aria-invalid", "true");
  }
  return "";
}

function showStart() {
  stopQuizTimer();
  setLed("");
  who.textContent = "Parts inside the case";
  app.innerHTML = `
    <section class="intro">
      <h2>Open the case.<br>Choose the function.</h2>
      <p class="lede">Enter the same name each time. From My quizzes you can open your last attempt or type the quiz number.</p>
      <label for="player">Your name</label>
      <input id="player" type="text" maxlength="40" placeholder="Type your name" value="${escapeHtml(state.name)}" required autocomplete="name">
      <label>How many questions</label>
      <div class="lengths" id="lengths"></div>
      <div class="row start-actions">
        <button class="primary" id="continue" type="button">Continue</button>
        <button class="ghost" id="history" type="button">My quizzes</button>
      </div>
      <div class="row start-actions">
        <button class="ghost" id="coc3" type="button">COC 3 · Virtual machine</button>
      </div>
      <p class="muted-note" id="history-note" hidden></p>
    </section>
  `;
  const box = document.getElementById("lengths");
  lengths.forEach((count) => {
    const button = document.createElement("button");
    button.type = "button";
    const label = count === QUESTIONS.length ? `All ${count}` : String(count);
    button.textContent = label + " · " + formatMinutes(quizSecondsFor(count));
    if (count === state.length) button.classList.add("picked");
    button.addEventListener("click", () => {
      state.length = count;
      box.querySelectorAll("button").forEach((item) => item.classList.remove("picked"));
      button.classList.add("picked");
    });
    box.appendChild(button);
  });
  document.getElementById("player").addEventListener("input", (event) => {
    state.name = event.target.value;
    const note = document.getElementById("history-note");
    if (note && String(event.target.value || "").trim()) note.hidden = true;
  });
  document.getElementById("player").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("continue").click();
    }
  });
  document.getElementById("continue").addEventListener("click", () => {
    if (!requireStudentName("history-note")) return;
    showReady();
  });
  document.getElementById("history").addEventListener("click", () => {
    const name = requireStudentName("history-note");
    if (!name) return;
    showMyQuizzes(name);
  });
  document.getElementById("coc3").addEventListener("click", () => {
    window.location.href = "coc3.html";
  });
}

function showReady() {
  setLed("");
  who.textContent = state.name;
  app.innerHTML = `
    <section class="intro">
      <h2>Study first,<br>then take the quiz.</h2>
      <p class="lede">Look at each part’s picture, name, and function. The 10-question quiz is 10 minutes. All 64 questions is 30 minutes. The clock starts when you go to the quiz.</p>
      <div class="row start-actions">
        <button class="primary" id="study" type="button">Study</button>
        <button class="ghost" id="start" type="button">Go to quiz</button>
      </div>
      <div class="row start-actions">
        <button class="ghost" id="last" type="button">Open last quiz</button>
        <button class="ghost" id="history" type="button">My quizzes</button>
      </div>
      <button class="ghost" id="home" type="button">Back</button>
    </section>
  `;
  document.getElementById("study").addEventListener("click", () => showStudy(0));
  document.getElementById("start").addEventListener("click", startQuiz);
  document.getElementById("last").addEventListener("click", () => openLastQuiz(state.name));
  document.getElementById("history").addEventListener("click", () => showMyQuizzes(state.name));
  document.getElementById("home").addEventListener("click", showStart);
}

function showStudy(index) {
  const item = QUESTIONS[index];
  const last = QUESTIONS.length - 1;
  setLed("on");
  who.textContent = "Study mode";
  app.innerHTML = `
    <div class="progress">
      <span>Study ${index + 1} of ${QUESTIONS.length}</span>
      <span>Look, then remember the function</span>
    </div>
    <div class="track"><span style="width:${((index + 1) / QUESTIONS.length) * 100}%"></span></div>
    <div class="ask">
      <figure class="photo-card">
        <img class="photo" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.part)}">
        <figcaption class="part-name">${escapeHtml(item.part)}</figcaption>
      </figure>
      <div class="answers">
        <p class="prompt">Function</p>
        <p class="study-function">${escapeHtml(item.answer)}</p>
        <div class="row">
          <button class="ghost" id="prev-part" type="button"${index === 0 ? " disabled" : ""}>Previous</button>
          <button class="primary" id="next-part" type="button">${index === last ? "Go to quiz" : "Next part"}</button>
        </div>
        <button class="ghost" id="home" type="button">Back</button>
      </div>
    </div>
  `;
  document.getElementById("prev-part").addEventListener("click", () => {
    if (index > 0) showStudy(index - 1);
  });
  document.getElementById("next-part").addEventListener("click", () => {
    if (index === last) startQuiz();
    else showStudy(index + 1);
  });
  document.getElementById("home").addEventListener("click", showReady);
}

function startQuiz() {
  const name = String(state.name || "").trim();
  if (!name) {
    showStart();
    requireStudentName("history-note");
    return;
  }
  state.name = name;
  state.deck = shuffle(QUESTIONS).slice(0, state.length).map((item) => ({
    ...item,
    choices: shuffle(item.choices)
  }));
  state.index = 0;
  state.picks = [];
  state.closing = false;
  state.endsAt = new Date(Date.now() + quizSecondsFor(state.length) * 1000).toISOString();
  logVisitStart(state.name, state.length, snapshotFromState());
  showQuestion();
}

function showQuestion() {
  const item = state.deck[state.index];
  const number = state.index + 1;
  setLed("on");
  who.textContent = state.name;
  const picked = state.picks[state.index];
  app.innerHTML = `
    <div class="progress">
      <span>Question ${number} of ${state.deck.length}</span>
      <span class="quiz-timer" id="quiz-timer">${formatClock(remainingMs() / 1000)}</span>
    </div>
    <div class="track"><span style="width:${(number / state.deck.length) * 100}%"></span></div>
    <div class="ask">
      <figure class="photo-card">
        <img class="photo" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.part || "Part of the system unit")}">
        <figcaption class="part-name">${escapeHtml(item.part || "")}</figcaption>
      </figure>
      <div class="answers">
        <h2 class="prompt">Choose the correct function.</h2>
        <div class="choices" id="choices"></div>
        <p class="feedback" id="feedback" hidden></p>
        <div class="row">
          <button class="ghost" id="back" type="button"${state.index === 0 ? " disabled" : ""}>Back</button>
          <button class="primary" id="next" type="button" disabled>${number === state.deck.length ? "See score" : "Next"}</button>
        </div>
        <button class="ghost" id="leave" type="button">Save and leave</button>
      </div>
    </div>
  `;
  const choices = document.getElementById("choices");
  const locked = Boolean(picked);

  function lockChoice(selected) {
    choices.querySelectorAll(".choice").forEach((node) => {
      const value = node.getAttribute("data-choice");
      node.disabled = true;
      node.classList.toggle("selected", value === selected);
    });
    const box = document.getElementById("feedback");
    box.hidden = false;
    box.className = "feedback";
    box.textContent = "Answer saved. Correct answers appear after you finish the quiz.";
    const next = document.getElementById("next");
    if (next) next.disabled = false;
    setLed("on");
  }

  item.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
    button.setAttribute("data-choice", choice);
    button.innerHTML = `<span class="mark">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(choice)}</span>`;
    button.addEventListener("click", () => {
      if (state.closing || state.picks[state.index]) return;
      state.picks[state.index] = choice;
      lockChoice(choice);
      logVisitProgress();
    });
    choices.appendChild(button);
  });
  if (locked) lockChoice(picked);
  document.getElementById("back").addEventListener("click", () => {
    if (state.index > 0) {
      state.index -= 1;
      showQuestion();
    }
  });
  document.getElementById("next").addEventListener("click", () => {
    if (!state.picks[state.index]) return;
    if (state.index === state.deck.length - 1) finishQuiz();
    else {
      state.index += 1;
      logVisitProgress();
      showQuestion();
    }
  });
  document.getElementById("leave").addEventListener("click", async () => {
    await logVisitProgress();
    showMyQuizzes(state.name);
  });
  startQuizTimer();
}

function finishQuiz(options) {
  if (state.closing) return;
  state.closing = true;
  stopQuizTimer();
  const timedOut = Boolean(options && options.timedOut);
  const total = state.deck.length;
  const correct = state.deck.filter((item, index) => state.picks[index] === item.answer).length;
  const percent = total ? Math.round((correct / total) * 100) : 0;
  logVisitScore(correct, total, percent, timedOut);
  renderAttemptReview({
    name: state.name,
    deck: state.deck,
    picks: state.picks,
    correct: correct,
    total: total,
    percent: percent,
    heading: timedOut ? "Time is up" : null,
    leaveLabel: "My quizzes"
  });
}

function renderAttemptReview(view) {
  stopQuizTimer();
  const title = view.percent >= 90 ? "Case master" : view.percent >= 70 ? "Bench technician" : view.percent >= 50 ? "Still tracing cables" : "Open the case again";
  setLed(view.percent >= 70 ? "on" : "warn");
  who.textContent = view.name;
  const review = view.deck.map((item, index) => {
    const mine = view.picks[index];
    const right = mine === item.answer;
    return `
      <article class="item ${right ? "right" : "wrong"}">
        <img class="thumb" src="${escapeHtml(item.image)}" alt="">
        <div>
        <div class="tag">${right ? "Correct" : "Review"}</div>
        <h3>${index + 1}. ${escapeHtml(item.part || item.q)}</h3>
        <p><strong>Your answer:</strong> ${escapeHtml(mine || "No answer")}</p>
        <p><strong>Correct answer:</strong> ${escapeHtml(item.answer)}</p>
        <p class="why">${escapeHtml(item.why)}</p>
        </div>
      </article>
    `;
  }).join("");
  const scoreLine = typeof view.correct === "number" && view.total
    ? `${view.correct}/${view.total}`
    : scoreLabel(view);
  app.innerHTML = `
    <section>
      <div class="score-hero">
        <div class="readout">
          <strong>${escapeHtml(scoreLine)}</strong>
          <span>${view.percent != null ? view.percent + "%" : ""}</span>
        </div>
        <div>
          <h2>${escapeHtml(view.heading || title)}</h2>
          <p>${escapeHtml(view.name)}, here is this quiz and the correct answer for every saved question.</p>
        </div>
      </div>
      <div class="review">${review || "<p class='muted-note'>This older quiz has a score, but the question list was not saved yet.</p>"}</div>
      <div class="row start-actions">
        <button class="primary" id="again" type="button">Try another round</button>
        <button class="ghost" id="history" type="button">${escapeHtml(view.leaveLabel || "My quizzes")}</button>
      </div>
    </section>
  `;
  document.getElementById("again").addEventListener("click", showStart);
  document.getElementById("history").addEventListener("click", () => showMyQuizzes(view.name));
  app.scrollIntoView({ behavior: "smooth", block: "start" });
}

function numberQuizzes(visits) {
  const byStart = visits.slice().sort((a, b) => (Date.parse(a.startedAt) || 0) - (Date.parse(b.startedAt) || 0));
  const numbers = new Map();
  byStart.forEach((visit, index) => numbers.set(visit, index + 1));
  return visits.map((visit) => Object.assign({}, visit, { quizNumber: numbers.get(visit) }));
}

function deckFromVisit(visit) {
  const parts = Array.isArray(visit.parts) ? visit.parts : [];
  const picks = Array.isArray(visit.picks) ? visit.picks : [];
  const deck = parts.map((part) => {
    const item = QUESTIONS.find((question) => question.part === part);
    return item ? Object.assign({}, item, { choices: shuffle(item.choices.slice()) }) : null;
  }).filter(Boolean);
  let index = typeof visit.index === "number" ? visit.index : picks.findIndex((pick) => !pick);
  if (index < 0) index = Math.max(picks.length - 1, 0);
  if (deck.length) index = Math.min(index, deck.length - 1);
  return { deck, picks, index };
}

function usableVisit(visit) {
  if (!visit) return false;
  if (typeof visit.score === "number") return true;
  return Array.isArray(visit.parts) && visit.parts.length > 0;
}

function attemptIsComplete(visit, restored) {
  if (visit && (visit.timedOut || typeof visit.score === "number") && visit.status === "finished") return true;
  const picks = (restored && restored.picks) || visit.picks || [];
  const expected = (restored && restored.deck && restored.deck.length)
    || (Array.isArray(visit.parts) ? visit.parts.length : 0)
    || visit.total
    || visit.length
    || 0;
  return expected > 0 && picks.filter(Boolean).length >= expected;
}

function visitTimeLeft(visit) {
  const ends = Date.parse(visit && visit.endsAt ? visit.endsAt : "");
  if (!Number.isFinite(ends)) return 0;
  return ends - Date.now();
}

function openAttempt(visit) {
  if (!visit) return;
  const restored = deckFromVisit(visit);
  const complete = attemptIsComplete(visit, restored);
  state.name = visit.name || state.name;
  setActiveVisit(visit);
  if (!complete && restored.deck.length) {
    state.deck = restored.deck;
    state.picks = restored.picks;
    state.index = restored.index;
    state.length = restored.deck.length;
    state.endsAt = visit.endsAt || "";
    state.closing = false;
    if (!state.endsAt) {
      state.endsAt = new Date(Date.now() + quizSecondsFor(state.length) * 1000).toISOString();
      logVisitProgress();
      showQuestion();
      return;
    }
    if (visitTimeLeft(visit) <= 0) {
      finishQuiz({ timedOut: true });
      return;
    }
    showQuestion();
    return;
  }
  if (!complete) {
    app.innerHTML = `
      <section class="intro">
        <h2>Quiz ${escapeHtml(visit.quizNumber || "")} is not finished</h2>
        <p class="lede">Correct answers stay hidden until every question is done.</p>
        <div class="row start-actions">
          <button class="primary" id="again" type="button">Take the quiz</button>
          <button class="ghost" id="history" type="button">My quizzes</button>
        </div>
      </section>
    `;
    document.getElementById("again").addEventListener("click", showReady);
    document.getElementById("history").addEventListener("click", () => showMyQuizzes(state.name));
    return;
  }
  const correct = typeof visit.score === "number"
    ? visit.score
    : restored.deck.filter((item, index) => restored.picks[index] === item.answer).length;
  const total = visit.total || restored.deck.length || visit.length || 0;
  const percent = typeof visit.percent === "number"
    ? visit.percent
    : (total ? Math.round((correct / total) * 100) : 0);
  renderAttemptReview({
    name: state.name,
    deck: restored.deck,
    picks: restored.picks,
    correct: correct,
    total: total,
    percent: percent,
    heading: "Quiz " + visit.quizNumber
  });
}

async function openLastQuiz(name) {
  const player = (name || "").trim();
  if (!player) {
    showStart();
    return;
  }
  try {
    const numbered = numberQuizzes(await loadVisitsByName(player));
    const last = numbered.find((visit) => usableVisit(visit));
    if (!last) {
      showMyQuizzes(player);
      return;
    }
    openAttempt(last);
  } catch (error) {
    showMyQuizzes(player);
  }
}

async function showMyQuizzes(name) {
  const player = (name || "").trim();
  setLed("on");
  who.textContent = player;
  app.innerHTML = `
    <section>
      <h2>Quizzes for ${escapeHtml(player)}</h2>
      <p class="lede">Loading quizzes saved under this name…</p>
    </section>
  `;
  try {
    const numbered = numberQuizzes(await loadVisitsByName(player));
    const last = numbered.find((visit) => usableVisit(visit)) || numbered[0];
    const rows = numbered.length
      ? numbered.map((visit) => `
          <article class="visit ${visit.status === "finished" ? "right" : ""}" data-open="${escapeHtml(visit._id || "")}">
            <div class="visit-top">
              <div>
                <div class="visit-kicker">Quiz ${visit.quizNumber}</div>
                <div class="visit-name">${escapeHtml(scoreLabel(visit))}</div>
              </div>
              <button class="primary open-quiz" type="button" data-id="${escapeHtml(visit._id || "")}">Open</button>
            </div>
            <dl>
              <div><dt>Started</dt><dd>${escapeHtml(formatWhen(visit.startedAt))}</dd></div>
              <div><dt>Questions</dt><dd>${escapeHtml(visit.length ?? "—")}</dd></div>
              <div><dt>Finished</dt><dd>${escapeHtml(formatWhen(visit.finishedAt))}</dd></div>
              <div><dt>Status</dt><dd>${escapeHtml(visit.status === "finished" ? "Finished" : "In progress")}</dd></div>
            </dl>
          </article>
        `).join("")
      : `<p class="muted-note">No quizzes found for this name. Use the exact name you typed when you started.</p>`;
    app.innerHTML = `
      <section>
        <div class="log-head">
          <div>
            <h2>${escapeHtml(player)}</h2>
            <p class="lede">${numbered.length} saved ${numbered.length === 1 ? "quiz" : "quizzes"}. Open the last one, or type the quiz number.</p>
          </div>
          <button class="ghost" id="reload" type="button">Refresh</button>
        </div>
        ${last ? `<div class="row start-actions">
          <button class="primary" id="open-last" type="button">Open last quiz (Quiz ${last.quizNumber})</button>
        </div>` : ""}
        <label for="quiz-number">Open quiz number</label>
        <div class="row start-actions">
          <input id="quiz-number" type="number" min="1" max="${Math.max(numbered.length, 1)}" placeholder="1" inputmode="numeric">
          <button class="ghost" id="open-number" type="button">Open number</button>
        </div>
        <p class="muted-note" id="number-note" hidden></p>
        <div class="visit-list">${rows}</div>
        <div class="row start-actions">
          <button class="primary" id="again" type="button">Take the quiz</button>
          <button class="ghost" id="home" type="button">Back</button>
        </div>
      </section>
    `;
    const byId = new Map(numbered.map((visit) => [visit._id, visit]));
    const byNumber = new Map(numbered.map((visit) => [String(visit.quizNumber), visit]));
    function openFromList(id) {
      const visit = byId.get(id);
      if (visit) openAttempt(visit);
    }
    document.getElementById("reload").addEventListener("click", () => showMyQuizzes(player));
    document.getElementById("again").addEventListener("click", showReady);
    document.getElementById("home").addEventListener("click", showStart);
    const lastButton = document.getElementById("open-last");
    if (lastButton) lastButton.addEventListener("click", () => openAttempt(last));
    document.getElementById("open-number").addEventListener("click", () => {
      const value = document.getElementById("quiz-number").value.trim();
      const visit = byNumber.get(value);
      const note = document.getElementById("number-note");
      if (!visit) {
        note.hidden = false;
        note.textContent = numbered.length
          ? "Type a quiz number from 1 to " + numbered.length + "."
          : "No quizzes to open yet.";
        return;
      }
      openAttempt(visit);
    });
    document.querySelectorAll(".open-quiz").forEach((button) => {
      button.addEventListener("click", () => openFromList(button.getAttribute("data-id")));
    });
  } catch (error) {
    app.innerHTML = `
      <section>
        <h2>Could not load quizzes</h2>
        <p class="lede">Try again in a moment.</p>
        <button class="primary" id="retry" type="button">Try again</button>
      </section>
    `;
    document.getElementById("retry").addEventListener("click", () => showMyQuizzes(player));
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

showStart();
