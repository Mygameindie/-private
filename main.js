// main.js
window.addEventListener('load', () => {
  loadItemsInBatches();
  adjustCanvasLayout();
  setupButterToggle();
  // ❌ ไม่เรียก music ที่นี่
});

window.addEventListener('resize', adjustCanvasLayout);