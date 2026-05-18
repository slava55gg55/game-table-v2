/*  «СВОЯ ИГРА» — Открытые вопросы с ответами
    
    КАК РЕДАКТИРОВАТЬ:
    Каждая категория — объект с name, icon и questions.
    Вопросы идут по порядку: 5, 10, 15, 20 баллов.
    
    { text: "Вопрос?", answer: "Ответ." }
*/

const CATEGORIES = [
  {
    name: "Традиционное религиозное обучение",
    icon: "📖",
    questions: [
      {
        text: "В каких учебных заведениях до середины XIX века в основном осуществлялось обучение казахских детей?",
        answer:
          "Обучение осуществлялось в мектебах и медресе, которые обеспечивали мусульманское образование",
      },
      {
        text: "Кто преимущественно выполнял функции учителя в мусульманских мектебах и за чей счет велось обучение?",
        answer:
          "Функции учителя выполнял мулла, а обучение оплачивалось за счет финансовых средств родителей",
      },
      {
        text: "Помимо основ ислама, какие светские науки преподавались в медресе со сроком обучения от 3 до 4 лет?",
        answer:
          "Учащиеся получали знания по философии, химии, математике, медицине, истории, географии, лингвистике и астрономии",
      },
      {
        text: "Какое важное нововведение было внедрено в медресе с 1870 года по инициативе царского правительства?",
        answer:
          "В медресе в обязательном порядке ввели преподавание основ русского языка",
      },
    ],
  },

  {
    name: "Новометодные школы",
    icon: "📚",
    questions: [
      {
        text: "Как называлось общественно-политическое движение, организаторы которого начали реформирование мусульманских школ?",
        answer: "Это движение называлось джадидизм",
      },
      {
        text: "Кто был одним из главных основателей новометодного направления обучения и известным тюркским просветителем?",
        answer: "Одним из основателей был Исмаил Гаспринский",
      },
      {
        text: "В чем заключалась главная методическая инновация новометодных школ, позволившая ускорить процесс обучения чтению?",
        answer:
          "Буквослагательный метод был заменен звуковым, благодаря чему срок обучения чтению сократился с 3 лет до 2–3 месяцев",
      },
      {
        text: "По какой политической причине царское правительство препятствовало распространению новометодных школ?",
        answer:
          "Царское правительство видело в них центры пропаганды идей панисламизма и пантюркизма",
      },
    ],
  },

  {
    name: "Светские учебные заведения",
    icon: "🏫",
    questions: [
      {
        text: "В каком городе в 1850 году была открыта школа с семилетним сроком обучения для подготовки писарей и переводчиков?",
        answer: "Эта школа была открыта в Оренбурге",
      },
      {
        text: "Кому принадлежит большая заслуга в открытии первой учительской школы для казахов в Орске в 1883 году?",
        answer: "Заслуга в её открытии принадлежит Ибраю Алтынсарину",
      },
      {
        text: "Почему казахское население настороженно отнеслось к открытию русско-казахских аульных школ?",
        answer:
          "Родители опасались русификации, христианизации и воинской повинности",
      },
      {
        text: "В чем проявлялось ограничение прав казахов-кадетов в кадетских корпусах?",
        answer:
          "Казахов-кадетов не допускали к изучению ряда секретных военных дисциплин",
      },
    ],
  },

  {
    name: "Высшее образование и интеллигенция",
    icon: "🎓",
    questions: [
      {
        text: "Какой город С. Садвакасов называл крупным образовательным центром края?",
        answer: "Город Омск",
      },
      {
        text: "Какой факультет старалась выбрать значительная часть казахской молодежи?",
        answer: "Юридические факультеты",
      },
      {
        text: "В каком городе обучалось около 100 казахских студентов на рубеже XIX–XX веков?",
        answer: "В городе Казань",
      },
      {
        text: "Назовите двух женщин-казашек, окончивших Санкт-Петербургский женский медицинский институт.",
        answer: "Гульсум и Мариям Асфендиаровы",
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
