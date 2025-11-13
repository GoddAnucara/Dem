const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
let fireflies = [];

// Create Stars
for (let i = 0; i < 150; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5,
    alpha: Math.random(),
    twinkle: Math.random() * 0.02
  });
}

// Create Fireflies
for (let i = 0; i < 15; i++) {
  fireflies.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 2 + Math.random() * 2,
    dx: (Math.random() - 0.5) * 0.7,
    dy: (Math.random() - 0.5) * 0.7,
    alpha: 0.5 + Math.random() * 0.5
  });
}

// Moon object
let moon = {
  x: canvas.width - 120,
  y: 100,
  r: 50,
  targetX: canvas.width - 120,
  targetY: 100,
  moving: false,
  pulse: 0,
  pulseDirection: 1,
  clickable: false
};

function drawMoon() {
  if (!moon.moving && moon.clickable) {
    moon.pulse += 0.02 * moon.pulseDirection;
    if (moon.pulse > 0.15 || moon.pulse < -0.15) moon.pulseDirection *= -1;
  } else {
    moon.pulse = 0;
  }

  const moonRadius = moon.r * (1 + moon.pulse);

  // Glow
  const gradient = ctx.createRadialGradient(moon.x, moon.y, moonRadius * 0.5, moon.x, moon.y, moonRadius * 2);
  gradient.addColorStop(0, "rgba(255, 255, 200, 0.9)");
  gradient.addColorStop(1, "rgba(255, 255, 200, 0)");

  ctx.beginPath();
  ctx.fillStyle = gradient;
  ctx.arc(moon.x, moon.y, moonRadius * 2, 0, Math.PI * 2);
  ctx.fill();

  // Solid moon
  ctx.beginPath();
  ctx.arc(moon.x, moon.y, moonRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#f5f3ce";
  ctx.fill();

  // Craters
  ctx.beginPath();
  ctx.arc(moon.x - 15, moon.y - 10, moonRadius * 0.14, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(200,200,180,0.5)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(moon.x + 10, moon.y + 15, moonRadius * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(200,200,180,0.4)";
  ctx.fill();
}

function animateMoon() {
  if (!moon.moving) return;
  const speed = 0.05;
  moon.x += (moon.targetX - moon.x) * speed;
  moon.y += (moon.targetY - moon.y) * speed;

  if (Math.abs(moon.x - moon.targetX) < 1 && Math.abs(moon.y - moon.targetY) < 1) {
    moon.x = moon.targetX;
    moon.y = moon.targetY;
    moon.moving = false;

    if (scrollStage === 2) {
      moon.clickable = true;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGradient.addColorStop(0, "#0d1b3d");
  skyGradient.addColorStop(1, "#000010");
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawMoon();

  // Stars
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 200, ${star.alpha})`;
    ctx.fill();

    star.alpha += star.twinkle;
    if (star.alpha <= 0 || star.alpha >= 1) star.twinkle *= -1;
  });

  // Fireflies
  fireflies.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 150, ${f.alpha})`;
    ctx.fill();

    f.x += f.dx;
    f.y += f.dy;

    if (f.x < 0 || f.x > canvas.width) f.dx *= -1;
    if (f.y < 0 || f.y > canvas.height) f.dy *= -1;
  });

  animateMoon();
  requestAnimationFrame(draw);
}

draw();

// Resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Scroll stages
let scrollStage = 0; // 0: header, 1: bottom text, 2: moon

function triggerScrollAction() {
  if (scrollStage === 0) {
    document.querySelector(".header-text").classList.add("hidden");
    document.querySelector(".bottom-text").classList.add("show-text");
    scrollStage = 1;
  } else if (scrollStage === 1) {
    document.querySelector(".bottom-text").classList.remove("show-text");
    moon.targetX = canvas.width / 2;
    moon.targetY = canvas.height / 2;
    moon.moving = true;
    scrollStage = 2;
  }
}

function handleScrollUp() {
  if (scrollStage === 2) {
    moon.targetX = canvas.width - 120;
    moon.targetY = 100;
    moon.moving = true;
    moon.clickable = false;
    document.querySelector(".bottom-text").classList.add("show-text");
    scrollStage = 1;
  } else if (scrollStage === 1) {
    document.querySelector(".bottom-text").classList.remove("show-text");
    document.querySelector(".header-text").classList.remove("hidden");
    scrollStage = 0;
  }
}

// Scroll and swipe
let touchStartY = 0;

window.addEventListener("wheel", (e) => {
  if (e.deltaY > 0) triggerScrollAction();
  else handleScrollUp();
});

window.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
});

window.addEventListener("touchend", (e) => {
  const touchEndY = e.changedTouches[0].clientY;
  if (touchStartY - touchEndY > 50) triggerScrollAction();
  else if (touchEndY - touchStartY > 50) handleScrollUp();
});

// Redirect to page2.html when moon is centered, anywhere on screen
window.addEventListener("click", () => {
  if (moon.clickable) {
    window.location.href = "page2.html";
  }
});

