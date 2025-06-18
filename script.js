let score = 0;
let highScore = localStorage.getItem('dvdPongHighScore') || 0;
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const canvas = document.getElementById("gameCanvas");  
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restartButton");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const logo = new Image();
logo.src = 'dvd-logo.svg';

let dvd = {
  x: 200,
  y: 200,
  width: 128,
  height: 72,
  dx: 4,
  dy: 4
};

let paddle = {
  width: 150,
  height: 20,
  x: canvas.width / 2 - 75,
  y: canvas.height - 40,
  speed: 0
};

highScoreElement.textContent = `High Score: ${highScore}`;

let backgroundColor = "black";
let currentColor = "white";
const colors = ["red", "green", "blue", "yellow", "cyan", "magenta", "orange"];
let gameOver = false;

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function drawPaddle() {
  ctx.fillStyle = "white";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawDVD() {
  ctx.drawImage(logo, dvd.x, dvd.y, dvd.width, dvd.height);

  ctx.globalCompositeOperation = 'source-in';

  ctx.fillStyle = currentColor;
  ctx.fillRect(dvd.x, dvd.y, dvd.width, dvd.height);

  ctx.globalCompositeOperation = 'source-over';
}

function update() {
  if (gameOver) return;

  dvd.x += dvd.dx;
  dvd.y += dvd.dy;

  // Duvara çarpma
  if (dvd.x + dvd.width >= canvas.width || dvd.x <= 0) {
    dvd.dx *= -1;
    currentColor = getRandomColor();
  }

  if (dvd.y <= 0) {
    dvd.dy *= -1;
    currentColor = getRandomColor();
  }

  // Paddle çarpışması
  if (
    dvd.y + dvd.height > paddle.y &&
    dvd.x + dvd.width > paddle.x &&
    dvd.x < paddle.x + paddle.width
  ) {
    dvd.dy = -dvd.dy;
    dvd.y = paddle.y - dvd.height;

    // Hızı %2 artır
    dvd.dx *= 1.02;
    dvd.dy *= 1.02;

    // Skoru artır
    score++;
    scoreElement.textContent = `Score: ${score}`;
  }

  // Aşağı düştü mü?
  if (dvd.y + dvd.height > canvas.height) {
    gameOver = true;
    restartButton.style.display = 'block'; // Düğmeyi göster

    // Yüksek skoru kontrol et ve güncelle
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('dvdPongHighScore', highScore);
      highScoreElement.textContent = `High Score: ${highScore}`;
    }
  }
}

function draw() {
  canvas.style.backgroundColor = backgroundColor;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDVD();
  drawPaddle();
}

function loop() {
  update();
  draw();
  if (!gameOver) {
    requestAnimationFrame(loop);
  }
}

function restartGame() {
  // Oyun değişkenlerini sıfırla
  score = 0;
  scoreElement.textContent = `Score: ${score}`;
  gameOver = false;
  dvd.x = Math.random() * (canvas.width - dvd.width);
  dvd.y = 50;
  dvd.dx = 4;
  dvd.dy = 4;
  paddle.x = canvas.width / 2 - paddle.width / 2;

  // Düğmeyi gizle
  restartButton.style.display = 'none';

  // Oyun döngüsünü yeniden başlat
  loop();
}

// Fare hareketi ile paddle'ı kontrol et
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  paddle.x = e.clientX - rect.left - paddle.width / 2;
  // Taşmayı engelle
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
});

restartButton.addEventListener('click', restartGame);

logo.onload = () => {
  loop();
};
