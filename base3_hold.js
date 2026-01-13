// base3_hold.js (append-only, robust)
(function attachBase3PressHold(){
  function showBase3(){
    const el = document.getElementById('base3-image');
    if (el) el.style.display = 'block';
  }
  function hideBase3(){
    const el = document.getElementById('base3-image');
    if (el) el.style.display = 'none';
  }

  function onDown(e){
    if (e && e.preventDefault) e.preventDefault();
    showBase3();
    if (e && e.target && e.target.blur) e.target.blur();
  }
  function onUp(){ hideBase3(); }

  window.addEventListener('load', () => {
    const btn =
      document.querySelector('.small-button.button-2') ||
      document.getElementById('toggleBase3Btn') ||
      document.getElementById('base3Btn');

    if (!btn) return;

    // remove any legacy inline handlers to avoid conflicts
    if (btn.hasAttribute('onclick')) btn.removeAttribute('onclick');

    btn.addEventListener('mousedown', onDown);
    btn.addEventListener('touchstart', onDown, { passive: false });

    window.addEventListener('mouseup', onUp);
    window.addEventListener('mouseleave', onUp);
    window.addEventListener('touchend', onUp);
    window.addEventListener('touchcancel', onUp);

    // keyboard accessibility
    btn.addEventListener('keydown', (ev) => {
      if (ev.key === ' ' || ev.key === 'Enter') onDown(ev);
    });
    btn.addEventListener('keyup', (ev) => {
      if (ev.key === ' ' || ev.key === 'Enter') onUp();
    });
  });

  // optional back-compat alias if you ever used changeToBase3()
  window.changeToBase3 = function(){
    showBase3();
    window.addEventListener('mouseup', hideBase3, { once: true });
    window.addEventListener('touchend', hideBase3, { once: true });
  };
})();
