// base_buttons.js
let baseClickCount = 0; // ⭐ ตัวนับคลิก

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

function blurButton(event) {
  event.preventDefault();
  event.target.blur();
}

/* ===============================
   BASE CLICK SYSTEM
   1–9   => base2
   10–15 => base3
   =============================== */

function updateBaseByClick() {
  baseClickCount++;

  // วนทุก 15 ครั้ง
  if (baseClickCount > 15) baseClickCount = 1;

  const base2 = document.getElementById("base2-image");
  const base3 = document.getElementById("base3-image");

  if (baseClickCount <= 9) {
    // 1–9 → base2
    if (base2) base2.style.display = "block";
    if (base3) base3.style.display = "none";
  } else {
    // 10–15 → base3
    if (base2) base2.style.display = "none";
    if (base3) base3.style.display = "block";
  }
}

/* === Button 1 (ใช้คลิกนับ) === */
function pressButton1(event) {
  blurButton(event);
  updateBaseByClick();
}
function releaseButton1(event) {
  blurButton(event);
}

/* === Button 2 (ถ้ายังอยากใช้กดโชว์ base3 ตรงๆ) === */
function pressButton2(event) {
  blurButton(event);
  document.getElementById("base3-image").style.display = "block";
}
function releaseButton2(event) {
  blurButton(event);
  document.getElementById("base3-image").style.display = "none";
}