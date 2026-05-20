/*  «СВОЯ ИГРА» — Открытые вопросы с ответами
    
    КАК РЕДАКТИРОВАТЬ:
    Каждая категория — объект с name, icon и questions.
    Вопросы идут по порядку: 5, 10, 15, 20 баллов.
    
    { text: "Вопрос?", answer: "Ответ." }
*/

const CATEGORIES = [
  {
    name: "Дэн Сяопин",
    icon: "🇨🇳",
    questions: [
      {
        text: "В какой стране Дэн Сяопин учился и подрабатывал в молодости?",
        answer:
          "Во Франции, где он работал на заводе Renault, кочегаром и официантом.",
      },
      {
        text: "Почему Дэн взял фамилию Сяопин?",
        answer:
          "Для подпольной партийной деятельности. «Сяо» означает «маленький», а «Пин» — «справедливый, мирный».",
      },
      {
        text: "В какие организации вступил Дэн Сяопин в 1922 и 1924 годах?",
        answer:
          "В Социалистический союз молодежи Китая и в европейское отделение Коммунистической партии Китая.",
      },
      {
        text: "Какое значение имели реформы Дэн Сяопина для Китая?",
        answer:
          "Они стали основой модернизации Китая и перехода страны к экономическим реформам и быстрому развитию.",
      },
    ],
  },

  {
    name: "Ли Куан Ю",
    icon: "🇸🇬",
    questions: [
      {
        text: "В каком городе родился Ли Куан Ю?",
        answer: "В Сингапуре.",
      },
      {
        text: "Какую партию основал Ли Куан Ю вместе со сторонниками в 1954 году?",
        answer: "Партию народного действия (ПНД).",
      },
      {
        text: "Какая организация была создана в 1961 году для развития экономики Сингапура?",
        answer: "Управление экономического развития (УЭР).",
      },
      {
        text: "Почему реформы Ли Куан Ю называют «сингапурским чудом»?",
        answer:
          "Потому что Сингапур превратился из бедной страны в одно из самых развитых государств мира.",
      },
    ],
  },

  {
    name: "Махатхир Мохамад",
    icon: "🇲🇾",
    questions: [
      {
        text: "Какое образование получил Махатхир Мохамад?",
        answer:
          "Он получил медицинское образование в университете Малайя в Сингапуре.",
      },
      {
        text: "Как называлась программа развития Малайзии, связанная с Махатхиром Мохамадом?",
        answer: "«Новая экономическая политика» (НЭП).",
      },
      {
        text: "Какие основные задачи ставила Новая экономическая политика?",
        answer:
          "Снижение бедности и выравнивание экономического положения разных этнических групп.",
      },
      {
        text: "Что способствовало возникновению «малайзийского чуда»?",
        answer:
          "Экономические реформы, развитие государственных корпораций и поддержка национального бизнеса.",
      },
    ],
  },

  {
    name: "Назарбаев и Казахстан",
    icon: "🇰🇿",
    questions: [
      {
        text: "Когда Казахстан официально стал независимым государством?",
        answer: "16 декабря 1991 года.",
      },
      {
        text: "Как называется общенациональная идея, предложенная Назарбаевым в 2014 году?",
        answer: "«Мәңгілік ел».",
      },
      {
        text: "Назовите одну из основных идей программы «Рухани жаңғыру».",
        answer:
          "Сохранение национальной идентичности и модернизация общественного сознания.",
      },
      {
        text: "Почему роль Назарбаева считают важной в период модернизации Казахстана?",
        answer:
          "Он провел реформы в тяжелые 1990-е годы и определил стратегическое направление развития страны.",
      },
    ],
  },
];

const POINT_VALUES = [5, 10, 15, 20];

const state = {
  score: 0,
  answered: 0,
  correct: 0,
  wrong: 0,
  board: CATEGORIES.map(() => POINT_VALUES.map(() => null)),
  names: CATEGORIES.map(() => POINT_VALUES.map(() => "")),
  totalQuestions: CATEGORIES.length * POINT_VALUES.length,
  maxScore: CATEGORIES.length * POINT_VALUES.reduce((a, b) => a + b, 0),
};

const $ = (id) => document.getElementById(id);
const screens = {
  start: $("screen-start"),
  game: $("screen-game"),
  result: $("screen-result"),
};
const modal = {
  overlay: $("modal-overlay"),
  category: $("modal-category"),
  points: $("modal-points"),
  question: $("modal-question"),
  btnReveal: $("btn-reveal"),
  answerReveal: $("answer-reveal"),
  answerText: $("answer-text"),
  judge: $("modal-judge"),
  nameGroup: $("name-input-group"),
  nameInput: $("player-name-input"),
  btnClose: $("btn-close-modal"),
  btnX: $("btn-modal-x"),
};

function init() {
  $("btn-start").addEventListener("click", startGame);
  $("btn-restart").addEventListener("click", () => location.reload());
  modal.btnReveal.addEventListener("click", revealAnswer);
  modal.btnClose.addEventListener("click", submitAnswer);
  modal.btnX.addEventListener("click", dismissModal);
}

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
}

function startGame() {
  state.score = 0;
  state.answered = 0;
  state.correct = 0;
  state.wrong = 0;
  state.board = CATEGORIES.map(() => POINT_VALUES.map(() => null));
  state.names = CATEGORIES.map(() => POINT_VALUES.map(() => ""));
  buildBoard();
  updateHeader();
  showScreen("game");
}

function buildBoard() {
  const board = $("game-board");
  board.innerHTML = "";
  CATEGORIES.forEach((cat, col) => {
    const h = document.createElement("div");
    h.className = `board-category cat-col-${col}`;
    h.innerHTML = `<span class="cat-icon">${cat.icon}</span><span class="cat-name">${cat.name}</span>`;
    board.appendChild(h);
  });
  POINT_VALUES.forEach((pts, row) => {
    CATEGORIES.forEach((_, col) => {
      const cell = document.createElement("div");
      cell.className = `board-cell col-${col}`;
      cell.id = `cell-${col}-${row}`;
      cell.innerHTML = `<span class="cell-points">${pts}</span><span class="cell-label">баллов</span>`;
      cell.addEventListener("click", () => openQuestion(col, row));
      board.appendChild(cell);
    });
  });
}

function openQuestion(col, row) {
  const cat = CATEGORIES[col];
  const q = cat.questions[row];
  const pts = POINT_VALUES[row];
  const colors = [
    "var(--cat-1)",
    "var(--cat-2)",
    "var(--cat-3)",
    "var(--cat-4)",
  ];
  const bgs = [
    "var(--cat-1-bg)",
    "var(--cat-2-bg)",
    "var(--cat-3-bg)",
    "var(--cat-4-bg)",
  ];

  modal.category.textContent = cat.name;
  modal.category.style.color = colors[col];
  modal.points.textContent = `${pts} баллов`;
  modal.points.style.background = bgs[col];
  modal.points.style.color = colors[col];
  modal.question.textContent = q.text;
  modal.answerText.textContent = q.answer;

  // Reset state
  modal.btnReveal.style.display = "inline-flex";
  modal.answerReveal.classList.remove("show");
  modal.judge.classList.remove("show");
  modal.nameInput.value = "";

  modal.overlay.dataset.col = col;
  modal.overlay.dataset.row = row;
  modal.overlay.classList.add("open");
}

function revealAnswer() {
  modal.btnReveal.style.display = "none";
  modal.answerReveal.classList.add("show");
  setTimeout(() => modal.judge.classList.add("show"), 300);
}

// Кнопка "Записать и продолжить" — засчитывает ответ
function submitAnswer() {
  const col = parseInt(modal.overlay.dataset.col);
  const row = parseInt(modal.overlay.dataset.row);
  const pts = POINT_VALUES[row];
  const name = modal.nameInput.value.trim();

  // Засчитываем как правильный ответ
  state.answered++;
  state.correct++;
  state.score += pts;
  state.board[col][row] = "correct";
  if (name) state.names[col][row] = name;

  modal.overlay.classList.remove("open");
  updateHeader();

  // Обновить ячейку
  const cell = $(`cell-${col}-${row}`);
  cell.classList.add("answered-correct");
  showFloatScore(cell, `+${pts}`, true);
  if (name) {
    const tag = document.createElement("span");
    tag.className = "cell-player-name";
    tag.textContent = name;
    cell.appendChild(tag);
  }

  const chip = $("score-chip");
  chip.classList.remove("bump");
  void chip.offsetHeight;
  chip.classList.add("bump");

  if (state.answered >= state.totalQuestions) setTimeout(showResults, 600);
}

// Крестик — мирное закрытие, ячейка остаётся доступной
function dismissModal() {
  modal.overlay.classList.remove("open");
}

function updateHeader() {
  $("total-score").textContent = state.score;
  $("questions-left").innerHTML =
    `Осталось: <strong>${state.totalQuestions - state.answered}</strong>`;
}

function showFloatScore(anchor, text, positive) {
  const r = anchor.getBoundingClientRect();
  const el = document.createElement("div");
  el.className = `float-score ${positive ? "plus" : "zero"}`;
  el.textContent = text;
  el.style.left = `${r.left + r.width / 2 - 20}px`;
  el.style.top = `${r.top}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

function showResults() {
  const pct =
    state.totalQuestions > 0 ? state.correct / state.totalQuestions : 0;
  $("result-score-number").textContent = state.score;
  $("result-max-score").textContent = state.maxScore;
  $("stat-correct").textContent = state.correct;
  $("stat-wrong").textContent = state.wrong;
  $("stat-percent").textContent = Math.round(pct * 100) + "%";
  const rank = getRank(pct);
  $("result-trophy").textContent = rank.trophy;
  $("result-title").textContent = rank.title;
  $("result-subtitle").textContent = rank.subtitle;
  $("rank-badge-icon").textContent = rank.icon;
  $("rank-badge-text").textContent = rank.rank;
  buildLeaderboard();
  showScreen("result");
  if (pct >= 0.6) setTimeout(launchConfetti, 400);
}

function buildLeaderboard() {
  const players = {};
  CATEGORIES.forEach((_, col) => {
    POINT_VALUES.forEach((pts, row) => {
      const name = state.names[col][row];
      if (name) {
        if (!players[name]) players[name] = { count: 0, score: 0, levels: [] };
        players[name].count++;
        players[name].score += pts;
        players[name].levels.push(pts);
      }
    });
  });
  const tbody = $("leaderboard-body");
  tbody.innerHTML = "";
  const sorted = Object.entries(players).sort(
    (a, b) => b[1].score - a[1].score,
  );
  if (!sorted.length) {
    $("leaderboard-section").style.display = "none";
    return;
  }
  $("leaderboard-section").style.display = "block";
  const medals = ["🥇", "🥈", "🥉"];
  sorted.forEach(([name, data], i) => {
    const tr = document.createElement("tr");
    const medal = i < 3 ? `<span class="leader-medal">${medals[i]}</span>` : "";
    const badges = data.levels
      .sort((a, b) => a - b)
      .map((l) => `<span class="points-badge p${l}">${l}</span>`)
      .join("");
    tr.innerHTML = `<td><span class="leader-name">${medal} ${name}</span></td><td>${data.count}</td><td><strong>${data.score}</strong></td><td><span class="leader-points-badges">${badges}</span></td>`;
    tbody.appendChild(tr);
  });
}

function getRank(pct) {
  if (pct === 1)
    return {
      trophy: "👑",
      title: "Идеальная игра!",
      subtitle: "Все ответы верны",
      icon: "👑",
      rank: "Магистр истории",
    };
  if (pct >= 0.85)
    return {
      trophy: "🏆",
      title: "Великолепно!",
      subtitle: "Настоящие знатоки",
      icon: "🎓",
      rank: "Профессор",
    };
  if (pct >= 0.65)
    return {
      trophy: "🌟",
      title: "Отличный результат!",
      subtitle: "Впечатляющие знания",
      icon: "📚",
      rank: "Историк-эрудит",
    };
  if (pct >= 0.5)
    return {
      trophy: "👍",
      title: "Хорошо!",
      subtitle: "Есть над чем поработать",
      icon: "📖",
      rank: "Юный историк",
    };
  if (pct >= 0.3)
    return {
      trophy: "🤔",
      title: "Неплохо…",
      subtitle: "Подтяните знания",
      icon: "🔍",
      rank: "Исследователь",
    };
  return {
    trophy: "📚",
    title: "Попробуйте ещё раз!",
    subtitle: "Каждая ошибка — шаг к знанию",
    icon: "🌱",
    rank: "Новичок",
  };
}

function launchConfetti() {
  const colors = [
    "#6366f1",
    "#0891b2",
    "#d97706",
    "#059669",
    "#ec4899",
    "#f59e0b",
    "#ef4444",
  ];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement("div");
    p.className = "confetti";
    p.style.left = Math.random() * 100 + "vw";
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = Math.random() * 2 + 2 + "s";
    p.style.animationDelay = Math.random() * 1.2 + "s";
    p.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    p.style.width = Math.random() * 7 + 4 + "px";
    p.style.height = Math.random() * 7 + 4 + "px";
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 4500);
  }
}

document.addEventListener("DOMContentLoaded", init);