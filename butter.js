/* === Butter SFX (append only) === */
(function setupButterSfxAppendOnly(){
  // Create (or reuse) an <audio> element for the butter sound
  let sfxEl = document.getElementById('butterSfx');
  if (!sfxEl) {
    sfxEl = document.createElement('audio');
    sfxEl.id = 'butterSfx';
    sfxEl.src = 'butter.mp3'; // <-- put your butter sound file here
    sfxEl.preload = 'auto';
    // do not set loop; this is a one-shot SFX
    document.body.appendChild(sfxEl);
  }

  // Safely attach an extra listener to the same button without touching existing logic
  function attach() {
    const btn = document.getElementById('toggleButterBtn');
    if (!btn) return;

    // Avoid double-binding if this runs again
    if (btn.dataset.butterSfxBound === '1') return;
    btn.dataset.butterSfxBound = '1';

    btn.addEventListener('click', () => {
      try {
        // Clone so rapid clicks can overlap without cutting off previous plays
        const inst = sfxEl.cloneNode(true);
        // Keep volume independent of BGM
        inst.volume = 1.0;
        // Play without affecting the backgroundMusic element
        inst.play().catch(()=>{ /* ignore iOS blocked edge cases */ });
      } catch (e) { /* no-op */ }
    });
  }

  // Hook after your onload setup without replacing it
  if (document.readyState === 'complete') {
    attach();
  } else {
    window.addEventListener('load', attach);
  }
})();
