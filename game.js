// ── Constants ──────────────────────────────────────────────
const GRID  = 20;   // number of cells per axis
const CELL  = 16;   // pixels per cell
const SPEED = 140;  // ms per tick (lower = faster)

// ── State ──────────────────────────────────────────────────
let snake, dir, nextDir, food, score, best = 0;
let loop = null;
let started = false;

// ── Canvas ─────────────────────────────────────────────────
const canvas  = document.getElementById('c');
const ctx     = canvas.getContext('2d');
const overlay = document.getElementById('overlay');

// ── Colors ─────────────────────────────────────────────────
const C = {
  bg:      '#161b22',
  grid:    'rgba(48,54,61,0.5)',
  snake:   '#39d353',
  head:    '#a5f3a5',
  food:    '#f78166',
  foodStem:'#8b3a2e',
};

// ── Utilities ──────────────────────────────────────────────
const rnd = (n) => Math.floor(Math.random() * n);

function placeFood() {
  let pos;
  do {
    pos = { x: rnd(GRID), y: rnd(GRID) };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

// ── Game lifecycle ──────────────────────────────────────────
function startGame() {
  snake   = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  dir     = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score   = 0;
  food    = placeFood();
  started = true;

  updateScore(0);
  overlay.classList.remove('show');

  clearInterval(loop);
  loop = setInterval(tick, SPEED);
  draw();
}

function gameOver() {
  clearInterval(loop);
  started = false;

  overlay.classList.add('show');
  overlay.querySelector('.overlay-title').textContent = 'GAME OVER';
  overlay.querySelector('.overlay-sub').textContent   = `Score: ${score}`;
  document.getElementById('start-btn').textContent    = 'PLAY AGAIN';
}

function updateScore(n) {
  score = n;
  document.getElementById('score').textContent = score;
  if (score > best) {
    best = score;
    document.getElementById('best').textContent = best;
  }
}

// ── Tick ───────────────────────────────────────────────────
function tick() {
  dir = nextDir;

  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  // Wall collision
  if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
    gameOver(); return;
  }

  // Self collision
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    gameOver(); return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    updateScore(score + 1);
    food = placeFood();
  } else {
    snake.pop();
  }

  draw();
}

// ── Draw ───────────────────────────────────────────────────
function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);   ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);   ctx.arcTo(x,     y + h, x,     y + h - r, r);
  ctx.lineTo(x, y + r);       ctx.arcTo(x,     y,     x + r, y,         r);
  ctx.closePath();
}

function draw() {
  // Background
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid lines
  ctx.strokeStyle = C.grid;
  ctx.lineWidth   = 0.5;
  for (let i = 0; i <= GRID; i++) {
    ctx.beginPath(); ctx.moveTo(i * CELL, 0);          ctx.lineTo(i * CELL, GRID * CELL); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,        i * CELL);   ctx.lineTo(GRID * CELL, i * CELL); ctx.stroke();
  }

  // Food (circle with stem)
  const fx = food.x * CELL + CELL / 2;
  const fy = food.y * CELL + CELL / 2;
  const fr = CELL / 2 - 2;
  ctx.fillStyle = C.food;
  ctx.beginPath();
  ctx.arc(fx, fy, fr, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.foodStem;
  ctx.fillRect(fx - 1, fy - fr - 3, 2, 4);

  // Snake
  snake.forEach((seg, i) => {
    ctx.fillStyle = i === 0 ? C.head : C.snake;
    const opacity = 1 - (i / snake.length) * 0.4;
    ctx.globalAlpha = opacity;
    roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, 3);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Eyes on head
    if (i === 0) {
      ctx.fillStyle = '#0d1117';
      const ex = seg.x * CELL + (dir.x >= 0 ? 9 : 3);
      const ey = seg.y * CELL + (dir.y >= 0 ? 9 : 3);
      ctx.fillRect(ex, ey, 3, 3);
    }
  });
}

// ── Direction control ──────────────────────────────────────
function changeDir(dx, dy) {
  if (!started) { startGame(); return; }
  // Prevent 180° reversal
  if (dx !== 0 && dir.x !== 0) return;
  if (dy !== 0 && dir.y !== 0) return;
  nextDir = { x: dx, y: dy };
}

// ── Keyboard ───────────────────────────────────────────────
const keyMap = {
  ArrowUp:    [0, -1], w: [0, -1], W: [0, -1],
  ArrowDown:  [0,  1], s: [0,  1], S: [0,  1],
  ArrowLeft:  [-1, 0], a: [-1, 0], A: [-1, 0],
  ArrowRight: [1,  0], d: [1,  0], D: [1,  0],
};

document.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Enter') {
    if (!started) { startGame(); return; }
  }
  if (keyMap[e.key]) {
    e.preventDefault();
    const [dx, dy] = keyMap[e.key];
    changeDir(dx, dy);
  }
});

// ── On-screen buttons ──────────────────────────────────────
document.getElementById('btn-up').onclick    = () => changeDir(0, -1);
document.getElementById('btn-down').onclick  = () => changeDir(0,  1);
document.getElementById('btn-left').onclick  = () => changeDir(-1, 0);
document.getElementById('btn-right').onclick = () => changeDir(1,  0);

// ── Touch / swipe ──────────────────────────────────────────
let touchStart = null;

canvas.addEventListener('touchstart', (e) => {
  touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });

canvas.addEventListener('touchend', (e) => {
  if (!touchStart) return;
  const dx = e.changedTouches[0].clientX - touchStart.x;
  const dy = e.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    changeDir(dx > 0 ? 1 : -1, 0);
  } else {
    changeDir(0, dy > 0 ? 1 : -1);
  }
  touchStart = null;
}, { passive: true });

// ── Initial draw ───────────────────────────────────────────
(function init() {
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
})();
