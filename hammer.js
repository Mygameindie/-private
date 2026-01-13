// hammer.js (append-only)
(function setupHammerAppendOnly(){
  window.addEventListener('load', () => {
    const old = document.getElementById('Hammer') || document.getElementById('hammer');
    if (old) old.style.display = 'none';
  }, { once:true });

  let hammerSfx = document.getElementById('hammerSfx');
  if (!hammerSfx) {
    hammerSfx = document.createElement('audio');
    hammerSfx.id = 'hammerSfx';
    hammerSfx.src = 'hammer.mp3';
    hammerSfx.preload = 'auto';
    document.body.appendChild(hammerSfx);
  }

  function ensureHammerVisual() {
    let hammerImg = document.getElementById('Hammer');
    if (!hammerImg) {
      hammerImg = document.createElement('img');
      hammerImg.id = 'Hammer';
      hammerImg.src = 'Hammer.png';
      hammerImg.alt = 'hammer effect';
      hammerImg.className = 'hammer';
      hammerImg.style.position = 'absolute';
      hammerImg.style.pointerEvents = 'none';
      hammerImg.style.zIndex = '999999';
      hammerImg.style.display = 'none';
      document.body.appendChild(hammerImg);
    }
    return hammerImg;
  }

  function updateHammerPosition(hammerImg) {
    const baseImage = document.getElementById('base-image');
    if (!baseImage) return;
    const rect = baseImage.getBoundingClientRect();
    hammerImg.style.left = rect.left + 'px';
    hammerImg.style.top = rect.top + 'px';
    hammerImg.style.width = rect.width + 'px';
    hammerImg.style.height = rect.height + 'px';
  }

  function attach() {
    const btn = document.getElementById('toggleHammerBtn');
    if (!btn) return;
    if (btn.dataset.hammerBound === '1') return;
    btn.dataset.hammerBound = '1';

    const hammerImg = ensureHammerVisual();

    const playHammer = () => {
      const inst = hammerSfx.cloneNode(true);
      inst.volume = 1.0;
      inst.play().catch(()=>{});
    };

    const changeFaceTo6 = () => {
      const faces = document.querySelectorAll('img.face, img[id^="face"]');
      faces.forEach(f => (f.style.visibility = 'hidden'));
      const f6 = document.getElementById('face6') ||
                 document.querySelector('img[src*="face6.png"]');
      if (f6) f6.style.visibility = 'visible';
    };

    const showHammer = (e) => {
      updateHammerPosition(hammerImg);
      hammerImg.style.display = 'block';
      playHammer();
      changeFaceTo6();
      if (e && e.preventDefault) e.preventDefault();
    };

    const hideHammer = () => {
      hammerImg.style.display = 'none';
    };

    btn.addEventListener('mousedown', showHammer);
    btn.addEventListener('touchstart', showHammer, { passive: false });

    window.addEventListener('mouseup', hideHammer);
    window.addEventListener('mouseleave', hideHammer);
    window.addEventListener('touchend', hideHammer);
    window.addEventListener('touchcancel', hideHammer);

    window.addEventListener('resize', () => updateHammerPosition(hammerImg));
    window.addEventListener('scroll', () => updateHammerPosition(hammerImg));
  }

  if (document.readyState === 'complete') attach();
  else window.addEventListener('load', attach);
})();
