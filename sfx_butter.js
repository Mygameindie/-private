// sfx_butter.js (append-only)
(function setupButterSfxAppendOnly(){
  let sfxEl = document.getElementById('butterSfx');
  if (!sfxEl) {
    sfxEl = document.createElement('audio');
    sfxEl.id = 'butterSfx';
    sfxEl.src = 'butter.mp3';
    sfxEl.preload = 'auto';
    document.body.appendChild(sfxEl);
  }

  function attach() {
    const btn = document.getElementById('toggleButterBtn');
    if (!btn) return;
    if (btn.dataset.butterSfxBound === '1') return;
    btn.dataset.butterSfxBound = '1';

    btn.addEventListener('click', () => {
      try {
        const inst = sfxEl.cloneNode(true);
        inst.volume = 1.0;
        inst.play().catch(()=>{});
      } catch (e) {}
    });
  }

  if (document.readyState === 'complete') attach();
  else window.addEventListener('load', attach);
})();
