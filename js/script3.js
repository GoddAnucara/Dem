const stars = document.querySelector(".stars");
for (let i = 0; i < 100; i++) {
  const s = document.createElement("div");
  s.className = "star";
  s.style.top = `${Math.random() * 100}%`;
  s.style.left = `${Math.random() * 100}%`;
  s.style.animationDelay = `${Math.random() * 5}s`;
  stars.appendChild(s);
}

// Add 5 constellation lines
for (let i = 0; i < 5; i++) {
  const c = document.createElement("div");
  c.className = "constellation";
  c.style.top = `${Math.random() * 100}%`;
  c.style.left = `${Math.random() * 100}%`;
  c.style.width = `${Math.random() * 100 + 50}px`;
  stars.appendChild(c);
}

function goToMainMenu() {
  window.location.href = "page2.html"; // or whichever page is the main menu
}