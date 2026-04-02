// butter.js
(function () {
  // Audio
  let sfxEl = document.getElementById('butterSfx');
  if (!sfxEl) {
    sfxEl = document.createElement('audio');
    sfxEl.id = 'butterSfx';
    sfxEl.src = 'butter.mp3';
    sfxEl.preload = 'auto';
    document.body.appendChild(sfxEl);
  }

  function setupButterToggle() {
    const butterImg = document.getElementById('butter1');
    const toggleBtn = document.getElementById('toggleButterBtn');
    if (!butterImg || !toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      const isVisible = butterImg.style.display === 'block';
      if (isVisible) {
        butterImg.style.display = 'none';
        butterImg.classList.remove('butter-active');
      } else {
        butterImg.style.display = 'block';
        butterImg.classList.remove('butter-active');
        void butterImg.offsetWidth; // force reflow to restart animation
        butterImg.classList.add('butter-active');
        const inst = sfxEl.cloneNode(true);
        inst.volume = 1.0;
        inst.play().catch(() => {});
      }
    });
  }

  window.setupButterToggle = setupButterToggle;
})();
