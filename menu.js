// MENU
const menuScreen = document.getElementById("menuScreen");
const difficultyScreen = document.getElementById("difficultyScreen");
const tableScreen = document.getElementById("table");
const backToMenuBtn = document.getElementById("backToMenu");

document.getElementById("btnHotseat").addEventListener("click", () => {
  menuScreen.classList.add("hidden");
  tableScreen.classList.remove("hidden");
  startGame(); // tryb hotseat
});

document.getElementById("btnSingle").addEventListener("click", () => {
  menuScreen.classList.add("hidden");
  difficultyScreen.classList.remove("hidden");
});

backToMenu.addEventListener("click", () => {
  difficultyScreen.classList.add("hidden");
  menuScreen.classList.remove("hidden");
  backToMenu.classList.add("hidden"); 
});

// wybór poziomu trudności
document.querySelectorAll(".btnDifficulty").forEach(btn => {
  btn.addEventListener("click", () => {
    const level = btn.dataset.level;
    console.log("Wybrano poziom bota:", level);

    difficultyScreen.classList.add("hidden");
    tableScreen.classList.remove("hidden");

    // tu możesz ustawić zmienną np. botDifficulty = level;
    startGameSingle(level);
  });
});

function startGameSingle(level) {
  console.log("Start gry single player. Poziom trudności:", level);

  startGame();
}


// Sakura płatki
const canvas = document.getElementById('sakuraCanvas');
const ctx = canvas.getContext('2d');
let petals = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createPetal() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    size: Math.random() * 15 + 10,
    speedY: Math.random() * 2 + 1,
    speedX: Math.random() * 1 - 0.5,
    rotation: Math.random() * 360,
    rotationSpeed: Math.random() * 2 - 1
  };
}

for (let i = 0; i < 40; i++) {
  petals.push(createPetal());
}

function drawPetal(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate((p.rotation * Math.PI) / 180);
  ctx.fillStyle = 'rgba(255, 182, 193, 0.8)';
  ctx.beginPath();
  ctx.ellipse(0, 0, p.size / 2, p.size / 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  petals.forEach(p => {
    p.y += p.speedY;
    p.x += p.speedX;
    p.rotation += p.rotationSpeed;
    if (p.y > canvas.height) {
      p.x = Math.random() * canvas.width;
      p.y = -10;
    }
    drawPetal(p);
  });
  requestAnimationFrame(animate);
}

animate();

// pokaż przycisk kiedy gra się uruchomi
function startSinglePlayer() {
  startGame("single");
  backToMenuBtn.classList.remove("hidden");
}

// otwieranie i zamykanie modala zasad
const rulesButton = document.getElementById("rulesButton");
const rulesModal = document.getElementById("rulesModal");
const closeRules = document.getElementById("closeRules");

rulesButton.addEventListener("click", () => {
  rulesModal.classList.remove("hidden");
});

closeRules.addEventListener("click", () => {
  rulesModal.classList.add("hidden");
});
