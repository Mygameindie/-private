/* === Hat SFX (append only) === */
(function setupHatSfxAppendOnly(){
  // Prepare/reuse audio for cone head and bucket
  let coneSfx = document.getElementById('coneHeadSfx');
  if (!coneSfx) {
    coneSfx = document.createElement('audio');
    coneSfx.id = 'coneHeadSfx';
    coneSfx.src = 'conehead.mp3'; // <-- your cone head sound file
    coneSfx.preload = 'auto';
    document.body.appendChild(coneSfx);
  }

  let bucketSfx = document.getElementById('bucketSfx');
  if (!bucketSfx) {
    bucketSfx = document.createElement('audio');
    bucketSfx.id = 'bucketSfx';
    bucketSfx.src = 'bucket.mp3'; // <-- your bucket sound file
    bucketSfx.preload = 'auto';
    document.body.appendChild(bucketSfx);
  }

  // Play helper (clone so rapid clicks overlap)
  function playSfx(baseEl) {
    try {
      const inst = baseEl.cloneNode(true);
      inst.volume = 1.0;
      inst.play().catch(()=>{ /* iOS autoplay block safe ignore */ });
    } catch(e) { /* no-op */ }
  }

  // Attach listeners to hat buttons
  function attach() {
    // Hat1 & Hat2 → cone head sound
    ['hat2.png'].forEach(id => {
      const btn = document.querySelector(`img.item-button[alt*="${id.replace('.png','')}"]`);
      if (btn && !btn.dataset.hatSfxBound) {
        btn.dataset.hatSfxBound = '1';
        btn.addEventListener('click', () => playSfx(coneSfx));
      }
    });

    // Hat3 & Hat4 → bucket sound
    ['hat4.png'].forEach(id => {
      const btn = document.querySelector(`img.item-button[alt*="${id.replace('.png','')}"]`);
      if (btn && !btn.dataset.hatSfxBound) {
        btn.dataset.hatSfxBound = '1';
        btn.addEventListener('click', () => playSfx(bucketSfx));
      }
    });
  }

  // Hook after load (doesn't overwrite your window.onload)
  if (document.readyState === 'complete') {
    attach();
  } else {
    window.addEventListener('load', attach);
  }
})();


/* === Hat SFX (robust, append-only) === */
(function setupHatSfxDelegated(){
  // 1) Prepare base sound paths (ensure these files exist next to index.html)
  const CONE_SRC   = 'conehead.mp3';
  const BUCKET_SRC = 'bucket.mp3';

  // 2) Create lightweight base Audio objects (for preloading only)
  const coneBase   = new Audio(CONE_SRC);
  const bucketBase = new Audio(BUCKET_SRC);
  coneBase.preload = 'auto';
  bucketBase.preload = 'auto';

  // 3) iOS/Safari unlock: one-time user gesture primes the audio system
  function unlockOnce(){
    const a = new Audio();
    a.src = CONE_SRC;
    a.muted = true;
    a.play().then(()=>a.pause()).catch(()=>{ /* ignore */ });
    document.removeEventListener('touchend', unlockOnce, true);
    document.removeEventListener('click', unlockOnce, true);
  }
  document.addEventListener('touchend', unlockOnce, true);
  document.addEventListener('click', unlockOnce, true);

  // 4) Helper: play overlapping copies smoothly
  function playCopy(src){
    try {
      const inst = new Audio(src);
      inst.currentTime = 0;
      inst.volume = 1.0;
      // no need to add to DOM
      inst.play().catch(()=>{ /* user gesture not recognized? ignore */ });
    } catch (e) { /* no-op */ }
  }

  // 5) Decide which sound to play based on target (alt/src contains hat1/hat2/hat3/hat4)
  function pickHatSfx(target){
    // Normalize match text: try alt, data-name, src
    const alt = (target.getAttribute('alt') || target.dataset.name || target.getAttribute('src') || '').toLowerCase();
    // Adjust keywords if your hats use different identifiers
    if (alt.includes('hat2')) return CONE_SRC;
    if (alt.includes('hat4')) return BUCKET_SRC;
    return null;
  }

  // 6) Delegated click listener works even for dynamically-created buttons
  document.addEventListener('click', (ev)=>{
    // your buttons are images with class "item-button" (adjust selector if needed)
    const btn = ev.target.closest('img.item-button, .item-button');
    if (!btn) return;
    const src = pickHatSfx(btn);
    if (src) playCopy(src);
  }, {passive:true});

  // 7) Optional: also respond to keyboard/enter/space on focused buttons
  document.addEventListener('keydown', (ev)=>{
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    const btn = document.activeElement && document.activeElement.closest && document.activeElement.closest('img.item-button, .item-button');
    if (!btn) return;
    const src = pickHatSfx(btn);
    if (src) playCopy(src);
  });
})();
