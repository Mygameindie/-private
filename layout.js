// layout.js
function adjustCanvasLayout() {
  const base     = document.querySelector('.base-container');
  const controls = document.querySelector('.controls');
  if (!base || !controls) return;
  const mobile = window.innerWidth <= 600;
  base.dataset.layout     = mobile ? 'mobile' : 'desktop';
  controls.dataset.layout = mobile ? 'mobile' : 'desktop';
}
