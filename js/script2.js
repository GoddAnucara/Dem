onload = () => {
    const c = setTimeout(() => {
      document.body.classList.remove("not-loaded");
      clearTimeout(c);
    }, 1000);
  };

// Wait until the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const buttonLayer = document.querySelector(".button-layer");
  if (!buttonLayer) return;

  // Activate buttons on first click/touch
  const activateButtons = () => {
    buttonLayer.classList.add("active");
  };

  document.addEventListener("click", activateButtons, { once: true });
  document.addEventListener("touchstart", activateButtons, { once: true });
});