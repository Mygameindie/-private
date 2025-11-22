/* === Frozen SFX + Frozen Item (append only) === */
(function setupFrozenAppendOnly(){
  // 1) Create (or reuse) a dedicated <audio> for the frozen sound
  let frozenSfx = document.getElementById('frozenSfx');
  if (!frozenSfx) {
    frozenSfx = document.createElement('audio');
    frozenSfx.id = 'frozenSfx';
    frozenSfx.src = 'frozen.mp3'; // <-- put your frozen sound here
    frozenSfx.preload = 'auto';
    document.body.appendChild(frozenSfx);
  }

  // 2) Ensure a 'frozen' visual item exists but stays hidden by default
  function ensureFrozenVisual() {
    const base = document.body;  // Always attach hammer to body to avoid scroll trap
    let frozenImg = document.getElementById('frozen1');
    if (!frozenImg) {
      frozenImg = document.createElement('img');
      frozenImg.id = 'frozen1';
      frozenImg.src = 'frozen.png';  // <-- your frozen image file
      frozenImg.alt = 'frozen effect';
      frozenImg.className = 'frozen';
      frozenImg.style.position = 'absolute';
      frozenImg.style.left = '0';
      frozenImg.style.top = '0';
      // If your getZIndex exists, try to place it above clothes; else fall back.
      const z = (typeof window.getZIndex === 'function') ? (window.getZIndex('jacket') + 1) : 18;
      frozenImg.style.zIndex = (isFinite(z) ? z : 18);
      frozenImg.style.display = 'none'; // hidden initially
      base.appendChild(frozenImg);
    }
    return frozenImg;
  }

  // 3) Attach behavior to the frozen button (no edits to existing handlers)
  function attach() {
    const btn = document.getElementById('toggleFrozenBtn');
    if (!btn) return;

    // Guard against double-binding
    if (btn.dataset.frozenBound === '1') return;
    btn.dataset.frozenBound = '1';

    // Make sure the visual exists
    const frozenImg = ensureFrozenVisual();

    btn.addEventListener('click', () => {
      // Play SFX OVER the BGM (clone for overlap)
      try {
        const inst = frozenSfx.cloneNode(true);
        inst.volume = 1.0;
        inst.play().catch(()=>{ /* ignore autoplay block on iOS */ });
      } catch(e) { /* no-op */ }

      // Toggle the frozen visual on canvas
      if (frozenImg.style.display === 'none') {
        frozenImg.style.display = 'block';
        // Optional: ensure it’s on top in case z-index changed elsewhere
        if (typeof window.getZIndex === 'function') {
          const z = window.getZIndex('jacket') + 1;
          if (isFinite(z)) frozenImg.style.zIndex = z;
        }
      } else {
        frozenImg.style.display = 'none';
      }
    });
  }

  // 4) Hook after load without touching your existing window.onload
  if (document.readyState === 'complete') {
    attach();
  } else {
    window.addEventListener('load', attach);
  }
})();
