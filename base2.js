/* === Base2 press-and-hold (append-only, robust) ========================= */
(function attachBase2PressHold(){
  function showBase2(){ 
    const el = document.getElementById('base2-image'); 
    if (el) el.style.display = 'block'; 
  }
  function hideBase2(){ 
    const el = document.getElementById('base2-image'); 
    if (el) el.style.display = 'none'; 
  }

  function onDown(e){ 
    if (e && e.preventDefault) e.preventDefault(); 
    showBase2(); 
    // prevent button from staying focused (mobile/safari quirks)
    if (e && e.target && e.target.blur) e.target.blur();
  }
  function onUp(){ hideBase2(); }

  window.addEventListener('load', () => {
    const btn =
      document.querySelector('.small-button.button-1') ||
      document.getElementById('toggleBase2Btn') ||
      document.getElementById('base2Btn');

    if (!btn) return;

    // remove any legacy inline click handler to avoid conflicts
    if (btn.hasAttribute('onclick')) btn.removeAttribute('onclick');

    // mouse + touch (press to show, release to hide)
    btn.addEventListener('mousedown', onDown);
    btn.addEventListener('touchstart', onDown, { passive: false });

    window.addEventListener('mouseup', onUp);
    window.addEventListener('mouseleave', onUp);
    window.addEventListener('touchend', onUp);
    window.addEventListener('touchcancel', onUp);

    // keyboard accessibility: hold Space/Enter = show; release = hide
    btn.addEventListener('keydown', (ev) => {
      if (ev.key === ' ' || ev.key === 'Enter') onDown(ev);
    });
    btn.addEventListener('keyup', (ev) => {
      if (ev.key === ' ' || ev.key === 'Enter') onUp();
    });
  });

  // ✅ Back-compat alias for any stray calls still using changeToBase2()
  window.changeToBase2 = function(){
    showBase2();
    // auto-hide on next mouseup (matches press-and-hold semantics)
    window.addEventListener('mouseup', hideBase2, { once: true });
    window.addEventListener('touchend', hideBase2, { once: true });
  };
})();
