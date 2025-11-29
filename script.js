const playArea = document.getElementById("play-area");
const startBtn = document.getElementById("start-btn");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");

const COLORS = ["#ff6f91", "#ffc75f", "#f9f871", "#a0e7e5", "#b39ddb"];
let score = 0;
let timeLeft = 30;
let timerId = null;
let spawnId = null;
let gameActive = false;

const randomInRange = (min, max) => Math.random() * (max - min) + min;

function startGame() {
  if (gameActive) return;
  gameActive = true;
  score = 0;
  timeLeft = 30;
  updateScore(0);
  updateTime();
  playArea.innerHTML = "";
  startBtn.textContent = "Playing...";
  startBtn.disabled = true;

  timerId = setInterval(() => {
    timeLeft -= 1;
    updateTime();
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  spawnId = setInterval(spawnBalloon, 900);
  spawnBalloon(); // immediate balloon
}

function endGame() {
  clearInterval(timerId);
  clearInterval(spawnId);
  timerId = null;
  spawnId = null;
  gameActive = false;
  startBtn.textContent = "Play Again";
  startBtn.disabled = false;
  announceResult();
}

function updateScore(amount) {
  score += amount;
  if (score < 0) score = 0;
  scoreEl.textContent = score.toString();
}

function updateTime() {
  timeEl.textContent = Math.max(timeLeft, 0).toString();
}

function spawnBalloon() {
  if (!gameActive) return;
  const balloon = document.createElement("button");
  balloon.className = "balloon";
  balloon.type = "button";
  balloon.ariaLabel = "Pop balloon";

  const isBonus = Math.random() < 0.2;
  const points = isBonus ? 2 : 1;
  if (isBonus) {
    balloon.classList.add("balloon--bonus");
    balloon.textContent = "⭐";
  }

  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  balloon.style.background = color;

  // random position within play area
  const areaRect = playArea.getBoundingClientRect();
  const size = areaRect.width < 500 ? 60 : 80;
  const maxLeft = playArea.clientWidth - size;
  const maxTop = playArea.clientHeight - size;

  balloon.style.left = `${randomInRange(0, maxLeft)}px`;
  balloon.style.top = `${randomInRange(0, maxTop)}px`;

  balloon.addEventListener("click", () => {
    if (!gameActive) return;
    updateScore(points);
    balloon.remove();
    createConfetti(balloon.style.left, balloon.style.top);
  });

  playArea.appendChild(balloon);

  setTimeout(() => {
    balloon.remove();
  }, 2500);
}

function announceResult() {
  const message =
    score === 0
      ? "Keep practicing! Try to pop the balloons."
      : `Great job! You popped ${score} balloon${score === 1 ? "" : "s"}!`;
  const announcer = document.createElement("p");
  announcer.className = "result-text";
  announcer.textContent = message;
  playArea.innerHTML = "";
  playArea.appendChild(announcer);
}

function createConfetti(left, top) {
  const confetti = document.createElement("span");
  confetti.className = "confetti";
  confetti.style.left = left;
  confetti.style.top = top;
  playArea.appendChild(confetti);
  setTimeout(() => confetti.remove(), 600);
}

startBtn.addEventListener("click", startGame);



