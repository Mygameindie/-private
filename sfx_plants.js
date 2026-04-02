// sfx_plants.js (append-only)
(function setupPlantsGulpAppendOnly(){
  let gulpSfx = document.getElementById('gulpSfx');
  if (!gulpSfx) {
    gulpSfx = document.createElement('audio');
    gulpSfx.id = 'gulpSfx';
    gulpSfx.src = 'gulp.mp3';
    gulpSfx.preload = 'auto';
    document.body.appendChild(gulpSfx);
  }

  function playGulp() {
    try {
      const inst = gulpSfx.cloneNode(true);
      inst.volume = 1.0;
      inst.play().catch(()=>{});
    } catch(e) {}
  }

  // Patch toggleVisibility append-only
  if (typeof window.toggleVisibility === 'function' && !window.toggleVisibility._plantsGulpBound) {
    const originalToggle = window.toggleVisibility;
    window.toggleVisibility = function(itemId, categoryName) {
      let wasVisible = false;
      if (categoryName === 'plants') {
        const el = document.getElementById(itemId);
        if (el && el.style.visibility === 'visible') wasVisible = true;
      }

      const result = originalToggle.apply(this, arguments);

      if (categoryName === 'plants' && wasVisible) {
        const el = document.getElementById(itemId);
        if (el && el.style.visibility === 'hidden') playGulp();
      }
      return result;
    };
    window.toggleVisibility._plantsGulpBound = true;
  }
})();
