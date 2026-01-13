// sfx_hat.js (robust, append-only delegated)
(function setupHatSfxDelegated(){
  const CONE_SRC   = 'conehead.mp3';
  const BUCKET_SRC = 'bucket.mp3';

  const coneBase   = new Audio(CONE_SRC);
  const bucketBase = new Audio(BUCKET_SRC);
  coneBase.preload = 'auto';
  bucketBase.preload = 'auto';

  function unlockOnce(){
    const a = new Audio();
    a.src = CONE_SRC;
    a.muted = true;
    a.play().then(()=>a.pause()).catch(()=>{});
    document.removeEventListener('touchend', unlockOnce, true);
    document.removeEventListener('click', unlockOnce, true);
  }
  document.addEventListener('touchend', unlockOnce, true);
  document.addEventListener('click', unlockOnce, true);

  function playCopy(src){
    try {
      const inst = new Audio(src);
      inst.currentTime = 0;
      inst.volume = 1.0;
      inst.play().catch(()=>{});
    } catch (e) {}
  }

  function pickHatSfx(target){
    const alt = (target.getAttribute('alt') || target.dataset.name || target.getAttribute('src') || '').toLowerCase();
    if (alt.includes('hat2')) return CONE_SRC;
    if (alt.includes('hat4')) return BUCKET_SRC;
    return null;
  }

  document.addEventListener('click', (ev)=>{
    const btn = ev.target.closest('img.item-button, .item-button');
    if (!btn) return;
    const src = pickHatSfx(btn);
    if (src) playCopy(src);
  }, {passive:true});

  document.addEventListener('keydown', (ev)=>{
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    const btn = document.activeElement && document.activeElement.closest && document.activeElement.closest('img.item-button, .item-button');
    if (!btn) return;
    const src = pickHatSfx(btn);
    if (src) playCopy(src);
  });
})();
