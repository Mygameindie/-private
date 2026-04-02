// butter.js
(function(){
  function setupButterToggle() {
    const butterImg = document.getElementById("butter1");
    const toggleBtn = document.getElementById("toggleButterBtn");
    if (!butterImg || !toggleBtn) return;

    toggleBtn.addEventListener("click", () => {
      const isVisible = butterImg.style.display === "block";
      if (isVisible) {
        butterImg.style.display = "none";
        butterImg.classList.remove("butter-active");
      } else {
        butterImg.style.display = "block";
        // Re-trigger animation each time it's shown
        butterImg.classList.remove("butter-active");
        void butterImg.offsetWidth; // reflow to restart animation
        butterImg.classList.add("butter-active");
      }
    });
  }
  window.setupButterToggle = setupButterToggle;
})();
