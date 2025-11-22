/* === Plants Remove SFX (append only) === */
(function setupPlantsGulpAppendOnly(){
  // Prepare/reuse gulp audio
  let gulpSfx = document.getElementById('gulpSfx');
  if (!gulpSfx) {
    gulpSfx = document.createElement('audio');
    gulpSfx.id = 'gulpSfx';
    gulpSfx.src = 'gulp.mp3'; // <-- your gulp sound file
    gulpSfx.preload = 'auto';
    document.body.appendChild(gulpSfx);
  }

  function playGulp() {
    try {
      const inst = gulpSfx.cloneNode(true);
      inst.volume = 1.0;
      inst.play().catch(()=>{ /* ignore autoplay block */ });
    } catch(e) { /* no-op */ }
  }

  // Patch toggleVisibility append-only
  if (typeof window.toggleVisibility === 'function' && !window.toggleVisibility._plantsGulpBound) {
    const originalToggle = window.toggleVisibility;
    window.toggleVisibility = function(itemId, categoryName) {
      // Check visibility before toggling
      let wasVisible = false;
      if (categoryName === 'plants') {
        const el = document.getElementById(itemId);
        if (el && el.style.visibility === 'visible') {
          wasVisible = true;
        }
      }

      // Call original logic
      const result = originalToggle.apply(this, arguments);

      // If plants were visible and now hidden → gulp!
      if (categoryName === 'plants' && wasVisible) {
        const el = document.getElementById(itemId);
        if (el && el.style.visibility === 'hidden') {
          playGulp();
        }
      }

      return result;
    };
    window.toggleVisibility._plantsGulpBound = true;
  }
})();
