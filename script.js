document.addEventListener('DOMContentLoaded', function () {
  // --- TASKS ---
  let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const taskInput = document.getElementById("taskInput");
  const taskList = document.getElementById("taskList");
  const completedCount = document.getElementById("completedCount");
  const pendingCount = document.getElementById("pendingCount");

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function updateList() {
    taskList.innerHTML = "";
    const now = Date.now();
    tasks = tasks.filter(task => now - task.createdAt < 86400000); // 24 hours
    tasks.forEach(task => {
      const li = document.createElement("li");
      if (task.completed) li.classList.add("completed");
      const span = document.createElement("span");
      span.textContent = task.text;
      span.onclick = () => toggleTask(task.id);
      li.appendChild(span);
      // Delete button
      const del = document.createElement('button');
      del.textContent = '🗑️';
      del.onclick = (e) => { e.stopPropagation(); deleteTask(task.id); };
      li.appendChild(del);
      taskList.appendChild(li);
    });
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;
    updateProgressBar();
    saveTasks();
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (text) {
      const task = {
        id: Date.now(),
        text,
        completed: false,
        createdAt: Date.now()
      };
      tasks.push(task);
      taskInput.value = "";
      updateList();
    }
  }

  function toggleTask(id) {
    tasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    updateList();
    playChime();
  }

  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    updateList();
  }

  window.addTask = addTask;

  // --- PROGRESS BAR ---
  function updateProgressBar() {
    const bar = document.getElementById('progressBar');
    const percent = tasks.length ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0;
    if (bar) bar.style.width = percent + "%";
  }

  // --- CHIME ON COMPLETE ---
  function playChime() {
    const audio = new Audio("https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa1c7b.mp3");
    audio.volume = 0.2;
    audio.play();
  }

  // --- DAILY GOAL ---
  function setGoal() {
    const goalInput = document.getElementById('goalInput');
    const goalText = document.getElementById('goalText');
    const goalInputSection = document.getElementById('goalInputSection');
    const changeGoalBtn = document.getElementById('changeGoalBtn');
    if (goalInput.value.trim()) {
      goalText.textContent = `🌟 ${goalInput.value}`;
      goalInputSection.style.display = 'none';
      changeGoalBtn.style.display = '';
      localStorage.setItem('dailyGoal', goalInput.value);
    }
  }
  window.setGoal = setGoal;

  function showGoalInput() {
  document.getElementById('goalInputSection').style.display = '';
  document.getElementById('changeGoalBtn').style.display = 'none';
  document.getElementById('goalText').textContent = '';
  localStorage.removeItem('dailyGoal');
}

  const savedGoal = localStorage.getItem('dailyGoal');
  if (savedGoal) {
    document.getElementById('goalText').textContent = `🌟 ${savedGoal}`;
    document.getElementById('goalInputSection').style.display = 'none';
    document.getElementById('changeGoalBtn').style.display = '';
  }

  document.getElementById('changeGoalBtn').onclick = showGoalInput;

  // --- VISION BOARD ---
  const visionInput = document.getElementById('visionInput');
  const visionImageInput = document.getElementById('visionImageInput');
  const visionImages = document.getElementById('visionImages');
  // Save vision text
  visionInput.value = localStorage.getItem('visionText') || '';
  visionInput.oninput = () => localStorage.setItem('visionText', visionInput.value);

  // Vision images
  let images = JSON.parse(localStorage.getItem('visionImages') || '[]');
  function renderImages() {
    visionImages.innerHTML = '';
    images.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.title = "Click to remove";
      img.onclick = () => { images.splice(i, 1); saveImages(); renderImages(); };
      visionImages.appendChild(img);
    });
  }
  function saveImages() {
    localStorage.setItem('visionImages', JSON.stringify(images));
  }
  visionImageInput.onchange = function () {
    Array.from(this.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        images.push(e.target.result);
        saveImages();
        renderImages();
      };
      reader.readAsDataURL(file);
    });
    this.value = '';
  };
  renderImages();

 


  // --- DOODLE PAD ---
  const doodlePad = document.getElementById('doodlePad');
  const clearDoodleBtn = document.getElementById('clearDoodleBtn');
  const ctx = doodlePad.getContext('2d');
  let drawing = false;
  doodlePad.onmousedown = e => { drawing = true; ctx.beginPath(); };
  doodlePad.onmouseup = e => { drawing = false; };
  doodlePad.onmouseleave = e => { drawing = false; };
  doodlePad.onmousemove = function(e) {
    if (!drawing) return;
    const rect = doodlePad.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#b388ff";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };
  clearDoodleBtn.onclick = () => ctx.clearRect(0, 0, doodlePad.width, doodlePad.height);



  setTimeout(() => {
  const popup = document.getElementById('welcomePopup');
  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 2500);
}, 400);

// ...inside DOMContentLoaded...
const dateDisplay = document.getElementById('dateDisplay');
const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
dateDisplay.textContent = today.toLocaleDateString(undefined, options);

 // --- TIC TAC TOE GAME ---
const tictacBoard = document.getElementById('tictacBoard');
const tictacStatus = document.getElementById('tictacStatus');
const tictacRestartBtn = document.getElementById('tictacRestartBtn');
let tictacCells, tictacTurn, tictacGameOver;

function tictacInit() {
  tictacBoard.innerHTML = '';
  tictacCells = Array(9).fill('');
  tictacTurn = '❌';
  tictacGameOver = false;
  tictacStatus.textContent = "Your turn: ❌";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'tictac-cell';
    cell.onclick = () => tictacMove(i);
    tictacBoard.appendChild(cell);
  }
}
function tictacMove(i) {
  if (tictacGameOver || tictacCells[i]) return;
  tictacCells[i] = tictacTurn;
  tictacBoard.children[i].textContent = tictacTurn;
  if (tictacCheckWin(tictacTurn)) {
    tictacStatus.textContent = `${tictacTurn} wins! 🎉`;
    tictacGameOver = true;
    return;
  }
  if (tictacCells.every(cell => cell)) {
    tictacStatus.textContent = "It's a draw! 😸";
    tictacGameOver = true;
    return;
  }
  tictacTurn = tictacTurn === '❌' ? '⭕' : '❌';
  tictacStatus.textContent = `Your turn: ${tictacTurn}`;
}
function tictacCheckWin(player) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(line => line.every(idx => tictacCells[idx] === player));
}
tictacRestartBtn.onclick = tictacInit;
tictacInit();

// --- GRATITUDE SUNBEAM ---
const gratitudeSun = document.getElementById('gratitudeSun');
const gratitudeSunPopup = document.getElementById('gratitudeSunPopup');
const gratitudeSunInput = document.getElementById('gratitudeSunInput');
const gratitudeSunSave = document.getElementById('gratitudeSunSave');
const gratitudeSunKey = "gratitudeSun_" + new Date().toLocaleDateString();

gratitudeSun.onclick = function() {
  gratitudeSunPopup.style.display = 'flex';
  gratitudeSunInput.value = localStorage.getItem(gratitudeSunKey) || "";
  gratitudeSunInput.focus();
};
gratitudeSunSave.onclick = function() {
  localStorage.setItem(gratitudeSunKey, gratitudeSunInput.value);
  gratitudeSunPopup.style.display = 'none';
  gratitudeSun.classList.add('glow');
  setTimeout(() => gratitudeSun.classList.remove('glow'), 2000);
};
gratitudeSunPopup.onclick = function(e) {
  if (e.target === gratitudeSunPopup) gratitudeSunPopup.style.display = 'none';
};
document.addEventListener('keydown', function(e) {
  if (e.key === "Escape") gratitudeSunPopup.style.display = 'none';
});

// --- DREAMYDO POMODORO TIMER ---
const pomodoroTime = document.getElementById('pomodoroTime');
const pomodoroStart = document.getElementById('pomodoroStart');
const pomodoroPause = document.getElementById('pomodoroPause');
const pomodoroReset = document.getElementById('pomodoroReset');
const pomodoroProgress = document.getElementById('pomodoroProgress');

const petals = document.querySelectorAll('#bloomFlower .petal');

const focusDuration = 25 * 60; // 25 minutes
const breakDuration = 5 * 60;  // 5 minutes
let timer = focusDuration;
let interval = null;
let onBreak = false;
let running = false;



function updateTimerDisplay() {
  const min = String(Math.floor(timer / 60)).padStart(2, '0');
  const sec = String(timer % 60).padStart(2, '0');
  pomodoroTime.textContent = `${min}:${sec}`;
  // Progress bar
  const total = onBreak ? breakDuration : focusDuration;
  pomodoroProgress.style.width = `${100 * (1 - timer / total)}%`;
  // Animate flower petals
  petals.forEach((petal, i) => {
    const threshold = total / petals.length * (i + 1);
    petal.setAttribute('opacity', timer <= total - threshold ? 0.7 : 0.2);
  });
}


function tick() {
  if (timer > 0) {
    timer--;
    updateTimerDisplay();
  } else {
    clearInterval(interval);
    running = false;
    if (!onBreak) {
      onBreak = true;
      timer = breakDuration;
    } else {
      onBreak = false;
      timer = focusDuration;
    }
    updateTimerDisplay();
  }
}

pomodoroStart.onclick = function() {
  if (running) return;
  running = true;
  pomodoroStart.disabled = true;
  interval = setInterval(tick, 1000);
};

pomodoroPause.onclick = function() {
  clearInterval(interval);
  running = false;
  pomodoroStart.disabled = false;
};

pomodoroReset.onclick = function() {
  clearInterval(interval);
  running = false;
  onBreak = false;
  timer = focusDuration;
  pomodoroStart.disabled = false;
  updateTimerDisplay();
  petals.forEach(petal => petal.setAttribute('opacity', 0.2));
};

updateTimerDisplay();

const quotes = [
  "You’re blooming beautifully 🌸",
  "Gentle focus, gentle heart 💜",
  "You’re doing amazing, sweetie ✨",
  "Let your mind rest like a cloud ☁️",
  "Small steps, big dreams 🌱",
  "Shine softly, work gently 🌙",
  "You are magic in progress 💖"
];
const quoteText = document.getElementById('quoteText');
function setDailyQuote() {
  // Show a new quote every day
  const today = new Date().toLocaleDateString();
  let idx = localStorage.getItem('dreamydo_quote_idx');
  let date = localStorage.getItem('dreamydo_quote_date');
  if (date !== today || idx === null) {
    idx = Math.floor(Math.random() * quotes.length);
    localStorage.setItem('dreamydo_quote_idx', idx);
    localStorage.setItem('dreamydo_quote_date', today);
  }
  quoteText.textContent = quotes[idx];
}
setDailyQuote();
const helloWorldText = document.getElementById('helloWorldText');
if (helloWorldText) {
  const hw = 'Hello';
  let idx = 0;
  function typeHelloWorld() {
    helloWorldText.textContent = hw.slice(0, idx);
    idx++;
    if (idx <= hw.length) {
      setTimeout(typeHelloWorld, 120);
    } else {
      setTimeout(() => {
        idx = 0;
        typeHelloWorld();
      }, 1200);
    }
  }
  typeHelloWorld();
}

});
