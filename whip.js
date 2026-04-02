// whip.js
// Press-and-hold button effect — works exactly like hammer.js
(function setupWhip(){
  let whipSfx = document.getElementById('whipSfx');
  if (!whipSfx) {
    whipSfx = document.createElement('audio');
    whipSfx.id = 'whipSfx';
    whipSfx.src = 'whip.mp3';
    whipSfx.preload = 'auto';
    document.body.appendChild(whipSfx);
  }

  function ensureWhipVisual() {
    let whipImg = document.getElementById('WhipEffect');
    if (!whipImg) {
      whipImg = document.createElement('img');
      whipImg.id = 'WhipEffect';
      whipImg.src = 'whip.png';
      whipImg.alt = 'whip effect';
      whipImg.style.position = 'absolute';
      whipImg.style.pointerEvents = 'none';
      whipImg.style.zIndex = '999999';
      whipImg.style.display = 'none';
      document.body.appendChild(whipImg);
    }
    return whipImg;
  }

  function updateWhipPosition(whipImg) {
    const baseImage = document.getElementById('base-image');
    if (!baseImage) return;
    const rect = baseImage.getBoundingClientRect();
    whipImg.style.left = rect.left + 'px';
    whipImg.style.top = rect.top + 'px';
    whipImg.style.width = rect.width + 'px';
    whipImg.style.height = rect.height + 'px';
  }

  function attach() {
    const btn = document.getElementById('toggleWhipBtn');
    if (!btn) return;
    if (btn.dataset.whipBound === '1') return;
    btn.dataset.whipBound = '1';

    const whipImg = ensureWhipVisual();

    const playWhip = () => {
      const inst = whipSfx.cloneNode(true);
      inst.volume = 1.0;
      inst.play().catch(() => {});
    };

    const showWhip = (e) => {
      updateWhipPosition(whipImg);
      whipImg.style.display = 'block';
      whipImg.classList.remove('whip-crack');
      void whipImg.offsetWidth;
      whipImg.classList.add('whip-crack');
      playWhip();
      if (e && e.preventDefault) e.preventDefault();
    };

    const hideWhip = () => {
      whipImg.style.display = 'none';
      whipImg.classList.remove('whip-crack');
    };

    btn.addEventListener('mousedown', showWhip);
    btn.addEventListener('touchstart', showWhip, { passive: false });

    window.addEventListener('mouseup', hideWhip);
    window.addEventListener('mouseleave', hideWhip);
    window.addEventListener('touchend', hideWhip);
    window.addEventListener('touchcancel', hideWhip);

    window.addEventListener('resize', () => updateWhipPosition(whipImg));
    window.addEventListener('scroll', () => updateWhipPosition(whipImg));
  }

  if (document.readyState === 'complete') attach();
  else window.addEventListener('load', attach);
})();
