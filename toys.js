// ===== TOYS =====
// Draggable toy items loaded from toys.json.
// Drag a toy over the belly button area  → character reacts (base2 shows).
// Drag a toy over the lower body button  → character reacts (base3 shows).
// Double-click / double-tap a toy to remove it.
//
// toys.json format:
// [ { "id": "toy_1", "src": "toy_1.png", "alt": "My Toy" }, ... ]

let _toyIdCounter = 0;
let _toyTopZ = 1;
let _toyLayer = null;
// Tracks which toy+zone pairs are currently overlapping
const _toyColliding = new Set();

// ===== SPAWN TOY =====
function spawnToy(src, alt) {
  const stage = _toyLayer || document.querySelector('.base-container');
  if (!stage) return;

  const toy = document.createElement('img');
  toy.className = 'toy-item';
  toy.src = src;
  toy.alt = alt || 'toy';
  toy.draggable = false;
  toy.dataset.toyId = ++_toyIdCounter;

  // Random starting position inside the stage
  toy.style.position = 'absolute';
  toy.style.left = (10 + Math.random() * 55) + '%';
  toy.style.top  = (5  + Math.random() * 45) + '%';
  toy.style.zIndex = ++_toyTopZ;

  stage.appendChild(toy);
  _makeToyDraggable(toy);
}

// ===== COLLISION CHECK =====
// Button-1 (belly area) → shows base2-image while toy overlaps.
// Button-2 (lower area) → shows base3-image while toy overlaps.
function _checkToyCollision(toy) {
  const toyRect = toy.getBoundingClientRect();
  const tid = toy.dataset.toyId;

  const zones = [
    { selector: '.small-button.button-1', key: 'btn1', imgId: 'base2-image' },
    { selector: '.small-button.button-2', key: 'btn2', imgId: 'base3-image' },
  ];

  zones.forEach(({ selector, key, imgId }) => {
    const btn = document.querySelector(selector);
    if (!btn) return;

    const colKey = `${tid}-${key}`;
    const r = btn.getBoundingClientRect();
    const overlapping = !(
      toyRect.right  < r.left  ||
      toyRect.left   > r.right ||
      toyRect.bottom < r.top   ||
      toyRect.top    > r.bottom
    );

    if (overlapping && !_toyColliding.has(colKey)) {
      _toyColliding.add(colKey);
      const img = document.getElementById(imgId);
      if (img) img.style.display = 'block';
      toy.classList.add('toy-touched');
      setTimeout(() => toy.classList.remove('toy-touched'), 400);
    } else if (!overlapping && _toyColliding.has(colKey)) {
      _toyColliding.delete(colKey);
      // Only hide if no other toy is still colliding with this zone
      const stillColliding = [..._toyColliding].some(k => k.endsWith('-' + key));
      if (!stillColliding) {
        const img = document.getElementById(imgId);
        if (img) img.style.display = 'none';
      }
    }
  });
}

// Clears all active collisions for a toy (call on removal).
function _clearToyCollisions(toy) {
  const tid = toy.dataset.toyId;
  const zones = [
    { key: 'btn1', imgId: 'base2-image' },
    { key: 'btn2', imgId: 'base3-image' },
  ];

  zones.forEach(({ key, imgId }) => {
    const colKey = `${tid}-${key}`;
    if (_toyColliding.has(colKey)) {
      _toyColliding.delete(colKey);
      const stillColliding = [..._toyColliding].some(k => k.endsWith('-' + key));
      if (!stillColliding) {
        const img = document.getElementById(imgId);
        if (img) img.style.display = 'none';
      }
    }
  });
}

// ===== TOY DRAG =====
function _makeToyDraggable(toy) {
  let sx, sy, ox, oy;

  function pointerDown(e) {
    e.preventDefault();
    e.stopPropagation();
    const pt = e.touches ? e.touches[0] : e;
    sx = pt.clientX;
    sy = pt.clientY;
    ox = toy.offsetLeft;
    oy = toy.offsetTop;
    toy.style.zIndex = ++_toyTopZ;
    toy.classList.add('toy-dragging');
    window.addEventListener('mousemove', pointerMove);
    window.addEventListener('mouseup',   pointerUp);
    window.addEventListener('touchmove', pointerMove, { passive: false });
    window.addEventListener('touchend',  pointerUp);
  }

  function pointerMove(e) {
    e.preventDefault();
    const pt = e.touches ? e.touches[0] : e;
    toy.style.left = (ox + pt.clientX - sx) + 'px';
    toy.style.top  = (oy + pt.clientY - sy) + 'px';
    _checkToyCollision(toy);
  }

  function pointerUp() {
    toy.classList.remove('toy-dragging');
    window.removeEventListener('mousemove', pointerMove);
    window.removeEventListener('mouseup',   pointerUp);
    window.removeEventListener('touchmove', pointerMove);
    window.removeEventListener('touchend',  pointerUp);
  }

  toy.addEventListener('mousedown',  pointerDown);
  toy.addEventListener('touchstart', pointerDown, { passive: false });
  toy.addEventListener('dragstart',  e => e.preventDefault());

  // Double-click / double-tap to remove
  let lastTap = 0;
  toy.addEventListener('dblclick', () => { _clearToyCollisions(toy); toy.remove(); });
  toy.addEventListener('touchend', () => {
    const now = Date.now();
    if (now - lastTap < 350) { _clearToyCollisions(toy); toy.remove(); }
    lastTap = now;
  });
}

// ===== LOAD JSON & BUILD PANEL =====
async function _initToys() {
  // Create a dedicated layer for toys so they always render below #base-image (z-index 5)
  const baseContainer = document.querySelector('.base-container');
  if (baseContainer) {
    _toyLayer = document.createElement('div');
    _toyLayer.id = 'toy-layer';
    baseContainer.appendChild(_toyLayer);
  }

  // Fetch toys.json
  let toyData = [];
  try {
    const res = await fetch('toys.json');
    if (res.ok) toyData = await res.json();
  } catch {
    console.warn('toys.json could not be loaded');
  }

  // Build toy-picker panel (appended to body, positioned via JS)
  const panel = document.createElement('div');
  panel.id = 'toy-panel';
  panel.className = 'toy-panel';
  panel.style.display = 'none';
  document.body.appendChild(panel);

  toyData.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'toy-spawn-btn';
    btn.title = item.alt || item.id;

    const thumb = document.createElement('img');
    thumb.src = item.src;
    thumb.alt = item.alt || item.id;
    thumb.draggable = false;
    btn.appendChild(thumb);

    btn.addEventListener('click', () => {
      spawnToy(item.src, item.alt || item.id);
      panel.style.display = 'none';
      toggleBtn.classList.remove('active');
    });
    panel.appendChild(btn);
  });

  // Insert Toys toggle button next to the hammer button
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'toggleToysBtn';
  toggleBtn.textContent = '🧸 Toys';
  toggleBtn.className = 'toy-toggle-btn';

  const hammerBtn = document.getElementById('toggleHammerBtn');
  if (hammerBtn && hammerBtn.parentNode) {
    hammerBtn.parentNode.insertBefore(toggleBtn, hammerBtn.nextSibling);
  } else {
    const bc = document.querySelector('.base-container');
    if (bc) bc.appendChild(toggleBtn);
  }

  toggleBtn.addEventListener('click', e => {
    e.stopPropagation();
    const visible = panel.style.display === 'flex';
    panel.style.display = visible ? 'none' : 'flex';
    toggleBtn.classList.toggle('active', !visible);

    // Position panel just below the toggle button
    if (!visible) {
      const rect = toggleBtn.getBoundingClientRect();
      panel.style.top  = (rect.bottom + 6) + 'px';
      panel.style.left = Math.max(4, rect.left) + 'px';
    }
  });

  // Close panel when clicking outside
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && e.target !== toggleBtn) {
      panel.style.display = 'none';
      toggleBtn.classList.remove('active');
    }
  }, true);
}

document.addEventListener('DOMContentLoaded', _initToys);
