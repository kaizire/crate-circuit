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
      <h2>Open the case.<br>Name the parts.</h2>
      <p class="lede">Every part of the system unit is here, with its picture. At the end you get your score, and every question shows the correct answer.</p>
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
    <img class="photo" src="${escapeHtml(item.image)}" alt="Part of the system unit">
    <h2 class="prompt">${escapeHtml(item.q)}</h2>
    <div class="choices" id="choices"></div>
    <div class="row">
      <button class="ghost" id="back" type="button"${state.index === 0 ? " disabled" : ""}>Back</button>
      <button class="primary" id="next" type="button" disabled>${number === state.deck.length ? "See score" : "Next"}</button>
    </div>
  `;
  const choices = document.getElementById("choices");
  item.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice" + (picked === choice ? " selected" : "");
    button.innerHTML = `<span class="mark">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(choice)}</span>`;
    button.addEventListener("click", () => {
      state.picks[state.index] = choice;
      choices.querySelectorAll(".choice").forEach((node) => node.classList.remove("selected"));
      button.classList.add("selected");
      document.getElementById("next").disabled = false;
    });
    choices.appendChild(button);
  });
  if (picked) document.getElementById("next").disabled = false;
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
        <h3>${index + 1}. ${escapeHtml(item.q)}</h3>
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
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

showStart();
