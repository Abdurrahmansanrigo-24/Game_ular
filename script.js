const canvass = document.getElementById('gamecanvas');
const ctx = canvass.getContext('2d');
const scoreElement = document.getElementById('score');
const gameoverElement = document.getElementById('gameover');

const gridSize = 20;
const gridwidth = canvass.width / gridSize;
const gridheight = canvass.height / gridSize;

let snake = [{ x: Math.floor(gridwidth / 2), y: Math.floor(gridheight / 2) }];
let food = { x: 5, y: 5 };
let direction = 'RIGHT';
let score = 0;
let gameRunning = true;

// Mulai musik latar otomatis saat game dimulai
// 🎵 Tambahkan suara (gunakan .wav yang sudah dibuat)
const eatSound = new Audio("assets/audio/eat.wav");
const gameOverSound = new Audio("assets/audio/gameover.wav");
const bgMusic = new Audio("assets/audio/bgmusic_loop.wav");
bgMusic.loop = true;
bgMusic.volume = 0.35;

// Mulai musik latar otomatis saat game dimulai (beberapa browser butuh interaksi)
bgMusic.play().catch(() => {
  document.addEventListener('click', () => bgMusic.play(), { once: true });
});

// saat makan:
eatSound.currentTime = 0;
eatSound.play();

// saat game over:
gameOverSound.currentTime = 0;
gameOverSound.play();
bgMusic.pause();


// Gambar ular & makanan
function draw() {
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(0, 0, canvass.width, canvass.height);

  ctx.fillStyle = '#00ff66';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });

  ctx.fillStyle = '#ff3300';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Logika permainan
function update() {
  if (!gameRunning) return;

  const head = { ...snake[0] };
  if (direction === 'UP') head.y--;
  if (direction === 'DOWN') head.y++;
  if (direction === 'LEFT') head.x--;
  if (direction === 'RIGHT') head.x++;

  if (head.x < 0 || head.x >= gridwidth || head.y < 0 || head.y >= gridheight) {
    endGame();
    return;
  }

  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);

  // 🍎 Cek apakah makan
  if (head.x === food.x && head.y === food.y) {
    score += 100;
    scoreElement.textContent = score;
    eatSound.currentTime = 0;
    eatSound.play();
    generateFood();
  } else {
    snake.pop();
  }
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * gridwidth),
    y: Math.floor(Math.random() * gridheight)
  };
}

function endGame() {
  gameRunning = false;
  gameoverElement.style.display = 'block';
  gameOverSound.play();
  bgMusic.pause();
}

function gameloop() {
  update();
  draw();
}

function restartGame() {
  snake = [{ x: Math.floor(gridwidth / 2), y: Math.floor(gridheight / 2) }];
  direction = 'RIGHT';
  score = 0;
  scoreElement.textContent = score;
  gameRunning = true;
  gameoverElement.style.display = 'none';
  generateFood();
  draw();
  bgMusic.play();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
  if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});

restartGame();
setInterval(gameloop, 150);
