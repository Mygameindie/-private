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



/* === Base3 / Base4 combo logic (FIXED: button-only) ===================== */
(function attachBase3PressHoldWithCounter(){
  let clickCount = 0;
  let base4UsesLeft = 0;

  let isPressing = false;
  let pressOwner = null; // 🔑 track which button started the press

  function showBase3(){ 
    const el = document.getElementById('base3-image'); 
    if (el) el.style.display = 'block'; 
  }
  function hideBase3(){ 
    const el = document.getElementById('base3-image'); 
    if (el) el.style.display = 'none'; 
  }

  function showBase4(){ 
    const el = document.getElementById('base4-image'); 
    if (el) el.style.display = 'block'; 
  }
  function hideBase4(){ 
    const el = document.getElementById('base4-image'); 
    if (el) el.style.display = 'none'; 
  }

  function hideCurrentBase(){
    hideBase3();
    hideBase4();
  }

  function onDown(e){
    // ❌ only allow if the actual button was pressed
    if (e.currentTarget !== pressOwner && pressOwner !== null) return;

    isPressing = true;
    pressOwner = e.currentTarget;

    if (e && e.preventDefault) e.preventDefault();

    clickCount++;

    // every 10 presses → next 5 uses = base4
    if (clickCount % 10 === 0) {
      base4UsesLeft = 5;
    }

    if (base4UsesLeft > 0) {
      showBase4();
    } else {
      showBase3();
    }
  }

  function onUp(e){
    // ❌ ignore releases not related to our button
    if (!isPressing || e.target !== pressOwner) return;

    if (base4UsesLeft > 0) {
      base4UsesLeft--;
    }

    hideCurrentBase();
    isPressing = false;
    pressOwner = null;
  }

  window.addEventListener('load', () => {
    const btn =
      document.querySelector('.small-button.button-2') ||
      document.getElementById('toggleBase3Btn') ||
      document.getElementById('base3Btn');

    if (!btn) return;

    if (btn.hasAttribute('onclick')) btn.removeAttribute('onclick');

    // ✅ listen ONLY on the button
    btn.addEventListener('mousedown', (e) => {
      pressOwner = btn;
      onDown(e);
    });

    btn.addEventListener('touchstart', (e) => {
      pressOwner = btn;
      onDown(e);
    }, { passive: false });

    btn.addEventListener('mouseup', onUp);
    btn.addEventListener('touchend', onUp);
    btn.addEventListener('touchcancel', onUp);

    // keyboard (button focused only)
    btn.addEventListener('keydown', (ev) => {
      if (ev.key === ' ' || ev.key === 'Enter') onDown(ev);
    });
    btn.addEventListener('keyup', onUp);
  });

  // ❌ disable back-compat auto trigger completely
  window.changeToBase3 = function(){};
})();