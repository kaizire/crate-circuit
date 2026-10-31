const app = document.getElementById("app");
const led = document.getElementById("status-led");
const who = document.getElementById("who-label");

const state = {
  name: "",
  length: QUESTIONS.length,
  deck: [],
  index: 0,
  picks: []
};

const lengths = [12, 20, QUESTIONS.length];

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

function showStart() {
  setLed("");
  who.textContent = "Parts inside the case";
  app.innerHTML = `
    <section class="intro">
      <h2>Open the case.<br>Choose the function.</h2>
      <p class="lede">Each question shows the part and its picture. Pick the correct function. You will see right away if your answer is correct, and at the end you get your score.</p>
      <label for="player">Your name</label>
      <input id="player" type="text" maxlength="40" placeholder="Type your name" value="${escapeHtml(state.name)}">
      <label>How many questions</label>
      <div class="lengths" id="lengths"></div>
      <button class="primary" id="start" type="button">Start quiz</button>
    </section>
  `;
  const box = document.getElementById("lengths");
  lengths.forEach((count) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = count === QUESTIONS.length ? `All ${count}` : String(count);
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
  });
  document.getElementById("start").addEventListener("click", startQuiz);
}

function startQuiz() {
  const name = state.name.trim();
  state.name = name || "Player";
  state.deck = shuffle(QUESTIONS).slice(0, state.length).map((item) => ({
    ...item,
    choices: shuffle(item.choices)
  }));
  state.index = 0;
  state.picks = [];
  logVisitStart(state.name, state.length);
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
      <span>${state.name}</span>
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
      </div>
    </div>
  `;
  const choices = document.getElementById("choices");
  const locked = Boolean(picked);

  function markAnswers(selected) {
    const right = selected === item.answer;
    choices.querySelectorAll(".choice").forEach((node) => {
      const value = node.getAttribute("data-choice");
      node.disabled = true;
      node.classList.remove("selected", "correct", "missed");
      if (value === item.answer) node.classList.add("correct");
      if (value === selected && !right) node.classList.add("missed");
    });
    const box = document.getElementById("feedback");
    box.hidden = false;
    box.className = "feedback " + (right ? "ok" : "bad");
    box.textContent = right
      ? "Correct! That is the function of the " + item.part + "."
      : "Wrong. The correct function is: " + item.answer;
    document.getElementById("next").disabled = false;
    setLed(right ? "on" : "warn");
  }

  item.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
    button.setAttribute("data-choice", choice);
    button.innerHTML = `<span class="mark">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(choice)}</span>`;
    button.addEventListener("click", () => {
      if (state.picks[state.index]) return;
      state.picks[state.index] = choice;
      markAnswers(choice);
    });
    choices.appendChild(button);
  });
  if (locked) markAnswers(picked);
  document.getElementById("back").addEventListener("click", () => {
    if (state.index > 0) {
      state.index -= 1;
      showQuestion();
    }
  });
  document.getElementById("next").addEventListener("click", () => {
    if (!state.picks[state.index]) return;
    if (state.index === state.deck.length - 1) showScore();
    else {
      state.index += 1;
      showQuestion();
    }
  });
}

function showScore() {
  const total = state.deck.length;
  const correct = state.deck.filter((item, index) => state.picks[index] === item.answer).length;
  const percent = Math.round((correct / total) * 100);
  const title = percent >= 90 ? "Case master" : percent >= 70 ? "Bench technician" : percent >= 50 ? "Still tracing cables" : "Open the case again";
  setLed(percent >= 70 ? "on" : "warn");
  who.textContent = state.name;
  const review = state.deck.map((item, index) => {
    const mine = state.picks[index];
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

  app.innerHTML = `
    <section>
      <div class="score-hero">
        <div class="readout">
          <strong>${correct}/${total}</strong>
          <span>${percent}%</span>
        </div>
        <div>
          <h2>${title}</h2>
          <p>${escapeHtml(state.name)}, here is your score and the correct answer for every question.</p>
        </div>
      </div>
      <div class="review">${review}</div>
      <button class="primary" id="again" type="button">Try another round</button>
    </section>
  `;
  document.getElementById("again").addEventListener("click", showStart);
  app.scrollIntoView({ behavior: "smooth", block: "start" });
  logVisitScore(correct, total, percent);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

showStart();
