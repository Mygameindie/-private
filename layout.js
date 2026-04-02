// layout.js
function adjustCanvasLayout() {
  const baseContainer = document.querySelector('.base-container');
  const controlsContainer = document.querySelector('.controls');
  const screenWidth = window.innerWidth;

  requestAnimationFrame(() => {
    if (screenWidth <= 600) {
      baseContainer.classList.add('mobile-layout');
      baseContainer.classList.remove('desktop-layout');
      controlsContainer.classList.add('mobile-controls');
      controlsContainer.classList.remove('desktop-controls');
    } else {
      baseContainer.classList.add('desktop-layout');
      baseContainer.classList.remove('mobile-layout');
      controlsContainer.classList.add('desktop-controls');
      controlsContainer.classList.remove('mobile-controls');
    }
  });
}
