// Array of JSON file paths
const jsonFiles = [
	'emotion.json',
'backitem.json',
    'hair.json',
	'face.json',
	'bottomunderwear.json', 
    'topunderwear.json' ,
    'shoes.json', 
    'pants.json', 
    'top.json', 
	'skirt.json', 
    'dress.json', 
    'jacket.json', 
    'accessories.json',
	'maccessories.json',
    'hat.json', 
	'weapon.json',
	'mask.json',
	'Waist.json',
	
	
];



// Track currently selected item for color changing
let currentlySelectedItem = null;

// Helper function to set z-index for categories
function getZIndex(categoryName) {
    const zIndexMap = {
		backitem:1,
        hair: 12,
        face: 11,
        bottomunderwear: 30,
        topunderwear: 40,
        shoes: 50,
        pants: 60,
		skirt:61,
        waist: 160,
        top: 70,
        dress: 90,
        jacket: 100,
        accessories: 110,
        hat: 120,
        plants: 130,
        weapon: 140,
		maccessories: 150,
		mask:160,
		Waist:161,
		emotion: 999
		
    };
    return zIndexMap[categoryName] || 0;
}

// Load each JSON file
async function loadItemFile(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Error loading file: ${file}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to load ${file}:`, error);
        return [];
    }
}
// Load each JSON file
async function loadItemFile(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Error loading file: ${file}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to load ${file}:`, error);
        return [];
    }
}

// Load items in batches to reduce load time and improve responsiveness
async function loadItemsInBatches(batchSize = 3) {
    const baseContainer = document.querySelector('.base-container');
    const controlsContainer = document.querySelector('.controls');
    
    for (let i = 0; i < jsonFiles.length; i += batchSize) {
        const batch = jsonFiles.slice(i, i + batchSize);

        await Promise.all(batch.map(async file => {
            const data = await loadItemFile(file);
            const categoryName = file.replace('.json', '');
            const categoryContainer = document.createElement('div');
            categoryContainer.classList.add('category');

            const categoryHeading = document.createElement('h3');
            categoryHeading.textContent = categoryName;
            categoryContainer.appendChild(categoryHeading);

            data.forEach(item => {
                const itemId = item.id.endsWith('.png') ? item.id : `${item.id}.png`;

                const img = document.createElement('img');
                img.id = itemId;
                img.src = item.src;
                img.alt = item.alt;
                img.classList.add(categoryName);
                img.setAttribute('data-file', file);
                img.style.visibility = item.visibility === "visible" ? "visible" : "hidden";
                img.style.position = 'absolute';
                img.style.zIndex = getZIndex(categoryName);
                baseContainer.appendChild(img);

                // Create container for buttons
                const buttonContainer = document.createElement('div');
                buttonContainer.classList.add('button-container');

                // Create a wrapper to stack buttons vertically
                const buttonWrap = document.createElement('div');
                buttonWrap.classList.add('button-wrap');

                // Main item button
                const button = document.createElement('img');
                const buttonFile = item.src.replace('.png', 'b.png');
                button.src = buttonFile;
                button.alt = item.alt + ' Button';
                button.classList.add('item-button');
                button.onclick = () => toggleVisibility(itemId, categoryName);
                buttonWrap.appendChild(button);

                // Add stacked buttonWrap to container
                buttonContainer.appendChild(buttonWrap);
                categoryContainer.appendChild(buttonContainer);
            });

            controlsContainer.appendChild(categoryContainer);
        }));

        await new Promise(resolve => setTimeout(resolve, 0.1));
    }
}
function toggleVisibility(itemId, categoryName) {
    const nonRemovableCategories = ['bottomunderwear', 'face'];

    // Auto-scroll to the item's category heading
    const allHeadings = document.querySelectorAll('.category h3');
    allHeadings.forEach(heading => {
        if (heading.textContent.trim() === categoryName.trim()) {
            heading.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    const categoryItems = document.querySelectorAll(`.${categoryName}`);
    categoryItems.forEach(item => {
        if (item.id !== itemId) {
            item.style.visibility = 'hidden';
        }
    });

    const selectedItem = document.getElementById(itemId);

    if (nonRemovableCategories.includes(categoryName)) {
        // Always make visible (force it on)
        selectedItem.style.visibility = 'visible';
    } else {
        // Toggle normally
        selectedItem.style.visibility = selectedItem.style.visibility === 'visible' ? 'hidden' : 'visible';
    }

    if (selectedItem.style.visibility === 'visible') {
    if (categoryName === 'dress') {
        // Wearing a dress: hide shirts, pants, skirts, sweatshirts, and underwear
        hideSpecificCategories(['top', 'pants', 'skirt', 'sweatshirt', 'topunderwear']);
    } else if (
        categoryName === 'top' || categoryName === 'top' ||
        categoryName === 'pants' || categoryName === 'pants' ||
        categoryName === 'skirt' || categoryName === 'skirt' ||
        categoryName === 'sweatshirt'
    ) {
        // Wearing any top/pants/skirt/sweatshirt: hide dress
        hideSpecificCategories(['dress']);
    }
}



if (categoryName === 'maccessories') {
        // Wearing a dress: hide shirts, pants, skirts, sweatshirts, and underwear
        hideSpecificCategories(['dress']);
    } else if (
	categoryName === 'dress'
    ) {
        // Wearing any top/pants/skirt/sweatshirt: hide dress
        hideSpecificCategories(['maccessories']);
    }

}
// Helper function to hide items for specific categories
function hideSpecificCategories(categories) {
    categories.forEach(category => {
        const items = document.querySelectorAll(`.${category}`);
        items.forEach(item => {
            item.style.visibility = 'hidden';
        });
    });
}

function adjustCanvasLayout() {
    const baseContainer = document.querySelector('.base-container');
    const controlsContainer = document.querySelector('.controls');
    const screenWidth = window.innerWidth;

    requestAnimationFrame(() => {
        if (screenWidth <= 600) {
            baseContainer.classList.add('mobile-layout');
            baseContainer.classList.remove('desktop-layout');
            controlsContainer.classList.add('mobile-controls');
            controlsContainer.classList.remove('desktop-controls');
        } else {
            baseContainer.classList.add('desktop-layout');
            baseContainer.classList.remove('mobile-layout');
            controlsContainer.classList.add('desktop-controls');
            controlsContainer.classList.remove('mobile-controls');
        }
    });
}


// Music control logic
function setupMusicToggle() {
    const audio = document.getElementById("backgroundMusic");
    const button = document.getElementById("musicToggleButton");
    let isPlaying = false;

    button.addEventListener("click", () => {
        if (isPlaying) {
            audio.pause();
            button.textContent = "🔇 Music Off";
        } else {
            audio.play();
            button.textContent = "🔊 Music On";
        }
        isPlaying = !isPlaying;
    });
}
function setupMusicSelector() {
    const selector = document.getElementById("musicSelector");
    const audio = document.getElementById("backgroundMusic");
    const source = audio.querySelector("source");

   selector.addEventListener("change", () => {
    const selectedTrack = selector.value;
    source.src = selectedTrack;
    audio.load();
    audio.play().catch(e => console.warn("Playback issue:", e));

    const button = document.getElementById("musicToggleButton");
    if (button) button.textContent = "🔊 Music On";

    // 🌿 Automatically change plants to plants6.png when Track 4 is selected
    if (selectedTrack === "my-music3.mp3") {
        // Hide all other plant items
        const plantItems = document.querySelectorAll(".plants");
        plantItems.forEach(item => item.style.visibility = "hidden");

        
			
        }
    
    });
}
function setupButterToggle() {
    const butterImg = document.getElementById("butter1");
    const toggleBtn = document.getElementById("toggleButterBtn");

    if (!butterImg || !toggleBtn) return;

    toggleBtn.addEventListener("click", () => {
        const isVisible = butterImg.style.display === "block";
        butterImg.style.display = isVisible ? "none" : "block";
    });
}

window.onload = () => {
    loadItemsInBatches();
    adjustCanvasLayout();
    setupMusicToggle();
    setupMusicSelector(); // 👈 this line
	setupButterToggle();
};

window.addEventListener('resize', adjustCanvasLayout);

function enterGame() {
    document.querySelector('.main-menu').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';

    const audio = document.getElementById("backgroundMusic");
    if (audio) {
        audio.play().catch(e => console.warn("Autoplay blocked:", e));
        const button = document.getElementById("musicToggleButton");
        if (button) button.textContent = "🔊 Music On";
    }
}

// Function to remove focus from button after interaction
function blurButton(event) {
    event.preventDefault(); // Prevent default focus behavior
    event.target.blur(); // Remove focus from the button
}

// Function for Button 1: Show Base2 on press, hide on release
function pressButton1(event) {
    blurButton(event);
    document.getElementById("base2-image").style.display = "block";
}

function releaseButton1(event) {
    blurButton(event);
    document.getElementById("base2-image").style.display = "none";
}

// Function for Button 2: Show Base3 on press, hide on release
function pressButton2(event) {
    blurButton(event);
    document.getElementById("base3-image").style.display = "block";
}

function releaseButton2(event) {
    blurButton(event);
    document.getElementById("base3-image").style.display = "none";
}



window.getZIndex = getZIndex;

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
/* === Plants Remove SFX (append only) === */
(function setupPlantsGulpAppendOnly(){
  // Prepare/reuse gulp audio
  let gulpSfx = document.getElementById('gulpSfx');
  if (!gulpSfx) {
    gulpSfx = document.createElement('audio');
    gulpSfx.id = 'gulpSfx';
    gulpSfx.src = 'gulp.mp3'; // <-- your gulp sound file
    gulpSfx.preload = 'auto';
    document.body.appendChild(gulpSfx);
  }

  function playGulp() {
    try {
      const inst = gulpSfx.cloneNode(true);
      inst.volume = 1.0;
      inst.play().catch(()=>{ /* ignore autoplay block */ });
    } catch(e) { /* no-op */ }
  }

  // Patch toggleVisibility append-only
  if (typeof window.toggleVisibility === 'function' && !window.toggleVisibility._plantsGulpBound) {
    const originalToggle = window.toggleVisibility;
    window.toggleVisibility = function(itemId, categoryName) {
      // Check visibility before toggling
      let wasVisible = false;
      if (categoryName === 'plants') {
        const el = document.getElementById(itemId);
        if (el && el.style.visibility === 'visible') {
          wasVisible = true;
        }
      }

      // Call original logic
      const result = originalToggle.apply(this, arguments);

      // If plants were visible and now hidden → gulp!
      if (categoryName === 'plants' && wasVisible) {
        const el = document.getElementById(itemId);
        if (el && el.style.visibility === 'hidden') {
          playGulp();
        }
      }

      return result;
    };
    window.toggleVisibility._plantsGulpBound = true;
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
/* === Hammer SFX + Visual (always on top) =============================== */
/* === Hammer SFX + Visual (always on top + perfect alignment) =============================== */
(function setupHammerAppendOnly(){

  // Hide old hammer if any
  window.addEventListener('load', () => {
    const old = document.getElementById('Hammer') || document.getElementById('hammer');
    if (old) old.style.display = 'none';
  }, { once:true });

  // Hammer sound
  let hammerSfx = document.getElementById('hammerSfx');
  if (!hammerSfx) {
    hammerSfx = document.createElement('audio');
    hammerSfx.id = 'hammerSfx';
    hammerSfx.src = 'hammer.mp3';
    hammerSfx.preload = 'auto';
    document.body.appendChild(hammerSfx);
  }

  // Create hammer visual
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

  // Anchor to #base-image (the real zombie)
  function updateHammerPosition(hammerImg) {
    const baseImage = document.getElementById('base-image');

    if (!baseImage) return;

    const rect = baseImage.getBoundingClientRect();

    // Hammer follows Base.png exactly
    hammerImg.style.left = rect.left + 'px';
    hammerImg.style.top = rect.top + 'px';
    hammerImg.style.width = rect.width + 'px';
    hammerImg.style.height = rect.height + 'px';
  }

  // Attach behavior
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

    // Press & hold
    btn.addEventListener('mousedown', showHammer);
    btn.addEventListener('touchstart', showHammer, { passive: false });

    window.addEventListener('mouseup', hideHammer);
    window.addEventListener('mouseleave', hideHammer);
    window.addEventListener('touchend', hideHammer);
    window.addEventListener('touchcancel', hideHammer);

    // Follow Base.png on resize/scroll
    window.addEventListener('resize', () => updateHammerPosition(hammerImg));
    window.addEventListener('scroll', () => updateHammerPosition(hammerImg));
  }

  if (document.readyState === 'complete') attach();
  else window.addEventListener('load', attach);

})();

/* === Base2 press-and-hold (append-only, robust) ========================= */
(function attachBase2PressHold(){
  function showBase2(){ 
    const el = document.getElementById('base2-image'); 
    if (el) el.style.display = 'block'; 
  }
  function hideBase2(){ 
    const el = document.getElementById('base2-image'); 
    if (el) el.style.display = 'none'; 
  }

  function onDown(e){ 
    if (e && e.preventDefault) e.preventDefault(); 
    showBase2(); 
    // prevent button from staying focused (mobile/safari quirks)
    if (e && e.target && e.target.blur) e.target.blur();
  }
  function onUp(){ hideBase2(); }

  window.addEventListener('load', () => {
    const btn =
      document.querySelector('.small-button.button-1') ||
      document.getElementById('toggleBase2Btn') ||
      document.getElementById('base2Btn');

    if (!btn) return;

    // remove any legacy inline click handler to avoid conflicts
    if (btn.hasAttribute('onclick')) btn.removeAttribute('onclick');

    // mouse + touch (press to show, release to hide)
    btn.addEventListener('mousedown', onDown);
    btn.addEventListener('touchstart', onDown, { passive: false });

    window.addEventListener('mouseup', onUp);
    window.addEventListener('mouseleave', onUp);
    window.addEventListener('touchend', onUp);
    window.addEventListener('touchcancel', onUp);

    // keyboard accessibility: hold Space/Enter = show; release = hide
    btn.addEventListener('keydown', (ev) => {
      if (ev.key === ' ' || ev.key === 'Enter') onDown(ev);
    });
    btn.addEventListener('keyup', (ev) => {
      if (ev.key === ' ' || ev.key === 'Enter') onUp();
    });
  });

  // ✅ Back-compat alias for any stray calls still using changeToBase2()
  window.changeToBase2 = function(){
    showBase2();
    // auto-hide on next mouseup (matches press-and-hold semantics)
    window.addEventListener('mouseup', hideBase2, { once: true });
    window.addEventListener('touchend', hideBase2, { once: true });
  };
})();
