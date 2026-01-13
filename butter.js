// butter.js
(function(){
  function setupButterToggle() {
    const butterImg = document.getElementById("butter1");
    const toggleBtn = document.getElementById("toggleButterBtn");
    if (!butterImg || !toggleBtn) return;

    toggleBtn.addEventListener("click", () => {
      const isVisible = butterImg.style.display === "block";
      butterImg.style.display = isVisible ? "none" : "block";
    });
  }
  window.setupButterToggle = setupButterToggle;
})();
