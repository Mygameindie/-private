// effects.js
// Factory for press-and-hold visual effects (Hammer, Whip, etc.)
// To add a new effect, call _createPressHoldEffect() with a config object.

function _createPressHoldEffect(config) {
  const { btnId, imgId, imgSrc, imgAlt, sfxSrc, animClass, onPress, zIndex } = config;

  let sfxEl = document.getElementById(imgId + 'Sfx');
  if (!sfxEl) {
    sfxEl = document.createElement('audio');
    sfxEl.id = imgId + 'Sfx';
    sfxEl.src = sfxSrc;
    sfxEl.preload = 'auto';
    document.body.appendChild(sfxEl);
  }

  function ensureVisual() {
    let img = document.getElementById(imgId);
    if (!img) {
      img = document.createElement('img');
      img.id = imgId;
      img.src = imgSrc;
      img.alt = imgAlt || imgId;
      img.style.position = 'absolute';
      img.style.pointerEvents = 'none';
      img.style.zIndex = zIndex != null ? String(zIndex) : '999999';
      img.style.display = 'none';
      document.body.appendChild(img);
    }
    return img;
  }

  function updatePosition(img) {
    const base = document.getElementById('base-image');
    if (!base) return;
    const rect = base.getBoundingClientRect();
    img.style.left   = rect.left   + 'px';
    img.style.top    = rect.top    + 'px';
    img.style.width  = rect.width  + 'px';
    img.style.height = rect.height + 'px';
  }

  function attach() {
    const btn = document.getElementById(btnId);
    if (!btn || btn.dataset.effectBound === '1') return;
    btn.dataset.effectBound = '1';

    const img = ensureVisual();

    const show = (e) => {
      updatePosition(img);
      img.style.display = 'block';
      img.classList.remove(animClass);
      void img.offsetWidth; // force reflow to restart animation
      img.classList.add(animClass);
      const inst = sfxEl.cloneNode(true);
      inst.volume = 1.0;
      inst.play().catch(() => {});
      if (onPress) onPress();
      if (e && e.preventDefault) e.preventDefault();
    };

    const hide = () => {
      img.style.display = 'none';
      img.classList.remove(animClass);
    };

    btn.addEventListener('mousedown', show);
    btn.addEventListener('touchstart', show, { passive: false });
    window.addEventListener('mouseup',     hide);
    window.addEventListener('mouseleave',  hide);
    window.addEventListener('touchend',    hide);
    window.addEventListener('touchcancel', hide);
    window.addEventListener('resize', () => updatePosition(img));
    window.addEventListener('scroll', () => updatePosition(img));
  }

  if (document.readyState === 'complete') attach();
  else window.addEventListener('load', attach);
}

// ===== HAMMER =====
_createPressHoldEffect({
  btnId:     'toggleHammerBtn',
  imgId:     'Hammer',
  imgSrc:    'Hammer.png',
  imgAlt:    'hammer effect',
  sfxSrc:    'hammer.mp3',
  animClass: 'hammer-slam',
  onPress: () => {
    // Switch to face6 expression on hammer hit
    document.querySelectorAll('img.face, img[id^="face"]').forEach(f => {
      f.style.visibility = 'hidden';
    });
    const f6 = document.getElementById('face6') ||
               document.querySelector('img[src*="face6.png"]');
    if (f6) f6.style.visibility = 'visible';
  }
});

// ===== WHIP =====
// zIndex 4 = behind the base character (base-image is z-index 5)
_createPressHoldEffect({
  btnId:     'toggleWhipBtn',
  imgId:     'WhipEffect',
  imgSrc:    'whip.png',
  imgAlt:    'whip effect',
  sfxSrc:    'whip.mp3',
  animClass: 'whip-crack',
  zIndex:    4
});
