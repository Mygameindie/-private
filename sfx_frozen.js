// sfx_frozen.js (append-only)
(function setupFrozenAppendOnly(){
  let frozenSfx = document.getElementById('frozenSfx');
  if (!frozenSfx) {
    frozenSfx = document.createElement('audio');
    frozenSfx.id = 'frozenSfx';
    frozenSfx.src = 'frozen.mp3';
    frozenSfx.preload = 'auto';
    document.body.appendChild(frozenSfx);
  }

  function ensureFrozenVisual() {
    const base = document.body;
    let frozenImg = document.getElementById('frozen1');
    if (!frozenImg) {
      frozenImg = document.createElement('img');
      frozenImg.id = 'frozen1';
      frozenImg.src = 'frozen.png';
      frozenImg.alt = 'frozen effect';
      frozenImg.className = 'frozen';
      frozenImg.style.position = 'absolute';
      frozenImg.style.left = '0';
      frozenImg.style.top = '0';
      const z = (typeof window.getZIndex === 'function') ? (window.getZIndex('jacket') + 1) : 18;
      frozenImg.style.zIndex = (isFinite(z) ? z : 18);
      frozenImg.style.display = 'none';
      base.appendChild(frozenImg);
    }
    return frozenImg;
  }

  function attach() {
    const btn = document.getElementById('toggleFrozenBtn');
    if (!btn) return;
    if (btn.dataset.frozenBound === '1') return;
    btn.dataset.frozenBound = '1';

    const frozenImg = ensureFrozenVisual();

    btn.addEventListener('click', () => {
      try {
        const inst = frozenSfx.cloneNode(true);
        inst.volume = 1.0;
        inst.play().catch(()=>{});
      } catch(e) {}

      if (frozenImg.style.display === 'none') {
        frozenImg.style.display = 'block';
        if (typeof window.getZIndex === 'function') {
          const z = window.getZIndex('jacket') + 1;
          if (isFinite(z)) frozenImg.style.zIndex = z;
        }
      } else {
        frozenImg.style.display = 'none';
      }
    });
  }

  if (document.readyState === 'complete') attach();
  else window.addEventListener('load', attach);
})();
