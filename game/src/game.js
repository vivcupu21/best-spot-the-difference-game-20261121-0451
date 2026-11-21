// Twin Tails — Spot the Difference. Game engine: state, input, HUD, sound.
// Static files only, no network. Keyboard: H hint, M mute, N next, R restart,
// Esc menu, 1/2/3 pick a level from the menu. Mouse: click a difference on
// either picture. ?demo=start|mid|late|win renders a fixed game state, used
// to take the entry's screenshots from the game's own code.

'use strict';

const cv = document.getElementById('game');
const ctx = cv.getContext('2d');
const W = 1280, H = 800;
const PANEL = { y: 96, w: 600, h: 560, xs: [20, 660] };
const DIFFS_PER_LEVEL = 7;

const G = {
  state: 'menu', // menu | playing | levelDone | gameDone
  level: 0,
  found: new Set(),
  mistakes: 0,
  hintsLeft: 3,
  hintsUsed: 0,
  score: 0,
  levelScore: 0,
  startAt: 0,
  elapsed: 0,
  muted: false,
  floats: [],   // {x, y, text, life, panel}
  wrongs: [],   // {x, y, life, panel}
  hintPulse: null, // {x, y, until}
  stars: 0,
  totalTime: 0,
  message: 'Klik perbedaan pada gambar kiri atau kanan.',
};
let buttons = []; // rebuilt every frame: {x,y,w,h,label,action}

function fmtTime(s) {
  s = Math.max(0, Math.floor(s));
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}

// ---------------------------------------------------------------- audio
let AC = null;
function tone(freq, dur, type, vol, delay) {
  if (G.muted) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const t = AC.currentTime + (delay || 0);
    const o = AC.createOscillator(), gn = AC.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    gn.gain.setValueAtTime(vol || 0.12, t);
    gn.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(gn); gn.connect(AC.destination);
    o.start(t); o.stop(t + dur + 0.02);
  } catch (e) { /* audio unavailable: game still plays */ }
}
function sfxFound() { tone(660, 0.12, 'sine', 0.14); tone(880, 0.18, 'sine', 0.14, 0.09); }
function sfxWrong() { tone(160, 0.22, 'square', 0.08); }
function sfxClick() { tone(440, 0.05, 'triangle', 0.06); }
function sfxWin() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'sine', 0.13, i * 0.11)); }

// ---------------------------------------------------------------- flow
function startLevel(i) {
  G.level = i;
  G.found = new Set();
  G.mistakes = 0;
  G.hintsLeft = 3;
  G.hintsUsed = 0;
  G.levelScore = 0;
  G.floats = []; G.wrongs = []; G.hintPulse = null;
  G.startAt = performance.now();
  G.elapsed = 0;
  G.state = 'playing';
  G.message = 'Cari 7 perbedaan — klik pada gambar kiri atau kanan.';
}

function levelComplete() {
  G.elapsed = (performance.now() - G.startAt) / 1000;
  const bonus = Math.max(0, 200 - Math.floor(G.elapsed));
  G.levelScore += bonus;
  G.score += bonus;
  G.stars = (G.mistakes === 0 && G.hintsUsed === 0) ? 3 : (G.mistakes <= 2 ? 2 : 1);
  G.totalTime += G.elapsed;
  G.state = 'levelDone';
  sfxWin();
}

function nextLevel() {
  if (G.level + 1 < SCENES.length) startLevel(G.level + 1);
  else { G.state = 'gameDone'; }
}

function useHint() {
  if (G.state !== 'playing' || G.hintsLeft <= 0) return;
  const scene = SCENES[G.level];
  const rest = scene.diffs.map((d, i) => i).filter(i => !G.found.has(i));
  if (!rest.length) return;
  const pick = rest[Math.floor(Math.random() * rest.length)];
  G.hintsLeft--; G.hintsUsed++;
  G.score = Math.max(0, G.score - 50);
  G.hintPulse = { x: scene.diffs[pick].x, y: scene.diffs[pick].y, until: performance.now() + 1400 };
  G.message = 'Petunjuk: lihat lingkaran yang berdenyut. (-50 poin)';
  tone(520, 0.15, 'sine', 0.1);
}

function clickAt(cx, cy) {
  // buttons first
  for (const b of buttons) {
    if (cx >= b.x && cx <= b.x + b.w && cy >= b.y && cy <= b.y + b.h) {
      sfxClick(); b.action(); return;
    }
  }
  if (G.state !== 'playing') return;
  // which panel?
  let panel = -1;
  for (let p = 0; p < 2; p++) {
    if (cx >= PANEL.xs[p] && cx <= PANEL.xs[p] + PANEL.w && cy >= PANEL.y && cy <= PANEL.y + PANEL.h) panel = p;
  }
  if (panel < 0) return;
  const sx = cx - PANEL.xs[panel], sy = cy - PANEL.y;
  const scene = SCENES[G.level];
  for (let i = 0; i < scene.diffs.length; i++) {
    if (G.found.has(i)) continue;
    const d = scene.diffs[i];
    const dx = sx - d.x, dy = sy - d.y;
    if (dx * dx + dy * dy <= (d.r + 10) * (d.r + 10)) {
      G.found.add(i);
      G.score += 100; G.levelScore += 100;
      G.floats.push({ x: d.x, y: d.y - d.r - 8, text: '+100', life: 1, panel });
      sfxFound();
      const left = DIFFS_PER_LEVEL - G.found.size;
      G.message = left === 0 ? 'Semua perbedaan ketemu!' : 'Ketemu! Sisa ' + left + ' lagi.';
      if (left === 0) levelComplete();
      return;
    }
  }
  // miss
  G.mistakes++;
  G.score = Math.max(0, G.score - 25);
  G.wrongs.push({ x: sx, y: sy, life: 1, panel });
  G.message = 'Bukan di situ. (-25 poin)';
  sfxWrong();
}

// ---------------------------------------------------------------- drawing
function drawHeader() {
  ttRect(ctx, 0, 0, W, 72, '#2b3a55');
  ttText(ctx, 'TWIN TAILS', 24, 38, 26, '#ffd94d', 'left', '800');
  ttText(ctx, 'Spot the Difference', 196, 40, 15, '#bcd0ea', 'left', '400');
  if (G.state === 'playing' || G.state === 'levelDone') {
    const scene = SCENES[G.level];
    ttText(ctx, scene.name + '  ·  ' + G.found.size + '/' + DIFFS_PER_LEVEL + ' ketemu', 640, 30, 19, '#ffffff');
    const left = DIFFS_PER_LEVEL - G.found.size;
    ttRr(ctx, 520, 44, 240, 24, 12, left === 0 ? '#3d8b40' : '#e85d75');
    ttText(ctx, left === 0 ? 'Semua ketemu!' : 'Sisa: ' + left + ' perbedaan', 640, 57, 15, '#ffffff');
  } else {
    ttText(ctx, '3 level · 7 perbedaan tiap level', 640, 40, 17, '#bcd0ea');
  }
  ttText(ctx, 'Skor ' + G.score, 1070, 30, 19, '#ffffff', 'right');
  ttText(ctx, 'Waktu ' + fmtTime(G.state === 'playing' ? (performance.now() - G.startAt) / 1000 : G.elapsed), 1070, 54, 15, '#bcd0ea', 'right');
  ttText(ctx, 'Level ' + (G.level + 1) + '/3', 1256, 38, 17, '#ffd94d', 'right');
}

function drawPanel(p) {
  const ox = PANEL.xs[p];
  ctx.save();
  ctx.beginPath(); ctx.rect(ox, PANEL.y, PANEL.w, PANEL.h); ctx.clip();
  ctx.translate(ox, PANEL.y);
  const scene = SCENES[G.level];
  scene.drawBase(ctx);
  for (const d of scene.diffs) d.draw(ctx, p);
  // found markers on both pictures
  for (const i of G.found) {
    const d = scene.diffs[i];
    ctx.strokeStyle = '#2fae4e'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(d.x, d.y, d.r + 4, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(d.x, d.y, d.r + 8, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#2fae4e'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(d.x - 10, d.y); ctx.lineTo(d.x - 3, d.y + 8); ctx.lineTo(d.x + 11, d.y - 8);
    ctx.stroke();
  }
  // hint pulse
  if (G.hintPulse && performance.now() < G.hintPulse.until) {
    const k = 0.5 + 0.5 * Math.sin(performance.now() / 90);
    ctx.strokeStyle = 'rgba(232,93,117,' + (0.5 + 0.5 * k) + ')';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(G.hintPulse.x, G.hintPulse.y, 30 + 8 * k, 0, Math.PI * 2); ctx.stroke();
  }
  // floating +100
  for (const f of G.floats) {
    if (f.panel !== p) continue;
    ctx.globalAlpha = Math.max(0, f.life);
    ttText(ctx, f.text, f.x, f.y, 22, '#2fae4e', 'center', '800');
    ctx.globalAlpha = 1;
  }
  // wrong marks
  for (const w of G.wrongs) {
    if (w.panel !== p) continue;
    ctx.globalAlpha = Math.max(0, w.life);
    ctx.strokeStyle = '#e83a3a'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(w.x - 11, w.y - 11); ctx.lineTo(w.x + 11, w.y + 11);
    ctx.moveTo(w.x + 11, w.y - 11); ctx.lineTo(w.x - 11, w.y + 11);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  // frame + label
  ctx.strokeStyle = '#2b3a55'; ctx.lineWidth = 4;
  ctx.strokeRect(ox, PANEL.y, PANEL.w, PANEL.h);
  ttRr(ctx, ox + 10, PANEL.y + 10, 92, 28, 14, 'rgba(43,58,85,0.85)');
  ttText(ctx, p === 0 ? 'Gambar A' : 'Gambar B', ox + 56, PANEL.y + 25, 15, '#ffffff');
}

function drawButton(x, y, w, h, label, action, primary) {
  buttons.push({ x, y, w, h, label, action });
  ttRr(ctx, x, y, w, h, 10, primary ? '#e85d75' : '#ffffff');
  ctx.strokeStyle = primary ? '#c94a61' : '#b9c4d6'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 10, y); ctx.arcTo(x + w, y, x + w, y + h, 10); ctx.arcTo(x + w, y + h, x, y + h, 10);
  ctx.arcTo(x, y + h, x, y, 10); ctx.arcTo(x, y, x + w, y, 10); ctx.closePath(); ctx.stroke();
  ttText(ctx, label, x + w / 2, y + h / 2 + 1, 17, primary ? '#ffffff' : '#2b3a55');
}

function drawFooter() {
  ttText(ctx, G.message, 640, 690, 17, '#2b3a55');
  if (G.state === 'playing') {
    drawButton(20, 716, 170, 46, 'Petunjuk (H) · ' + G.hintsLeft, useHint, false);
    drawButton(206, 716, 170, 46, G.muted ? 'Suara: Mati (M)' : 'Suara: Nyala (M)', () => { G.muted = !G.muted; }, false);
    drawButton(1090, 716, 170, 46, 'Menu (Esc)', () => { G.state = 'menu'; }, false);
    // level dots
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i === G.level ? '#e85d75' : (i < G.level ? '#3d8b40' : '#b9c4d6');
      ctx.beginPath(); ctx.arc(600 + i * 44, 740, 10, 0, Math.PI * 2); ctx.fill();
    }
    ttText(ctx, 'Klik perbedaan · H petunjuk · M suara · R ulangi level', 640, 782, 13, '#7a8699');
  } else {
    ttText(ctx, 'Mouse + keyboard · H petunjuk · M suara · R ulangi · N lanjut', 640, 740, 14, '#7a8699');
  }
}

function drawMenu() {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f6ead8'); bg.addColorStop(1, '#ffe9c9');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // decorative sun + hills
  ttCircle(ctx, 1120, 120, 56, '#ffd94d');
  ttEllipse(ctx, 200, 820, 420, 180, '#8ec97a'); ttEllipse(ctx, 1080, 830, 460, 190, '#79bd68');
  ttText(ctx, 'TWIN TAILS', 640, 150, 64, '#2b3a55', 'center', '800');
  ttText(ctx, 'Spot the Difference', 640, 205, 28, '#e85d75', 'center', '700');
  ttText(ctx, 'Dua gambar nyaris sama. Temukan 7 perbedaannya sebelum waktu habis.', 640, 250, 18, '#4a5568');
  ttText(ctx, 'Klik perbedaannya di gambar kiri atau kanan · klik yang salah -25 poin', 640, 278, 15, '#7a8699');
  for (let i = 0; i < SCENES.length; i++) {
    const x = 200 + i * 300, y = 330;
    buttons.push({ x, y, w: 260, h: 190, label: SCENES[i].name, action: () => startLevel(i) });
    ttRr(ctx, x, y, 260, 190, 16, '#ffffff');
    ctx.strokeStyle = '#b9c4d6'; ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 260, 190);
    ttCircle(ctx, x + 130, y + 62, 34, ['#8ec9ee', '#f7e3c2', '#ff9a5c'][i]);
    ttText(ctx, ['🌿', '☕', '🌅'][i], x + 130, y + 63, 30, '#2b3a55');
    ttText(ctx, SCENES[i].name, x + 130, y + 128, 22, '#2b3a55');
    ttText(ctx, SCENES[i].sub, x + 130, y + 156, 14, '#7a8699');
  }
  ttText(ctx, 'atau tekan 1 / 2 / 3 untuk memilih level', 640, 560, 15, '#7a8699');
  ttText(ctx, 'Seni, nama, dan suara digambar & dibuat sendiri — tanpa file luar.', 640, 640, 14, '#7a8699');
}

function drawOverlay(title, lines, starCount) {
  ctx.fillStyle = 'rgba(29,36,51,0.55)'; ctx.fillRect(0, 0, W, H);
  ttRr(ctx, 390, 180, 500, 400, 20, '#fffdf5');
  ctx.strokeStyle = '#2b3a55'; ctx.lineWidth = 3; ctx.strokeRect(390, 180, 500, 400);
  ttText(ctx, title, 640, 240, 34, '#2b3a55', 'center', '800');
  if (starCount) {
    let stars = '';
    for (let i = 0; i < 3; i++) stars += i < starCount ? '★' : '☆';
    ttText(ctx, stars, 640, 292, 40, '#f2b705');
  }
  lines.forEach((ln, i) => ttText(ctx, ln, 640, 340 + i * 32, 18, '#4a5568'));
}

function draw() {
  buttons = [];
  if (G.state === 'menu') { drawMenu(); return; }
  drawHeader();
  drawPanel(0); drawPanel(1);
  drawFooter();
  if (G.state === 'levelDone') {
    const last = G.level + 1 >= SCENES.length;
    drawOverlay('Level Selesai!', [
      SCENES[G.level].name + ' · semua 7 perbedaan ketemu',
      'Waktu ' + fmtTime(G.elapsed) + '  ·  Bonus waktu +' + Math.max(0, 200 - Math.floor(G.elapsed)),
      'Skor level ' + G.levelScore + '  ·  Total ' + G.score,
    ], G.stars);
    drawButton(470, 500, 140, 48, 'Ulangi (R)', () => startLevel(G.level), false);
    drawButton(640, 500, 180, 48, last ? 'Lihat Hasil (N)' : 'Level Berikutnya (N)', nextLevel, true);
  } else if (G.state === 'gameDone') {
    drawOverlay('Kamu Menang!', [
      'Semua 3 level selesai — 21 perbedaan ditemukan.',
      'Total waktu ' + fmtTime(G.totalTime) + '  ·  Skor akhir ' + G.score,
      'Kesalahan ' + G.mistakes + ' kali · Petunjuk dipakai ' + G.hintsUsed + ' kali',
    ], 3);
    drawButton(480, 500, 160, 48, 'Main Lagi (R)', () => { G.score = 0; G.totalTime = 0; startLevel(0); }, true);
    drawButton(660, 500, 140, 48, 'Menu (Esc)', () => { G.state = 'menu'; }, false);
  }
}

function frame(now) {
  // decay floats and wrong marks
  for (const f of G.floats) { f.life -= 0.012; f.y -= 0.4; }
  G.floats = G.floats.filter(f => f.life > 0);
  for (const w of G.wrongs) w.life -= 0.02;
  G.wrongs = G.wrongs.filter(w => w.life > 0);
  draw();
  requestAnimationFrame(frame);
}

// ---------------------------------------------------------------- input
cv.addEventListener('click', (e) => {
  const r = cv.getBoundingClientRect();
  const cx = (e.clientX - r.left) * (W / r.width);
  const cy = (e.clientY - r.top) * (H / r.height);
  clickAt(cx, cy);
});

document.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (k === 'h') useHint();
  else if (k === 'm') G.muted = !G.muted;
  else if (k === 'r' && (G.state === 'playing' || G.state === 'levelDone' || G.state === 'gameDone')) {
    if (G.state === 'gameDone') { G.score = 0; G.totalTime = 0; }
    startLevel(G.state === 'gameDone' ? 0 : G.level);
  }
  else if (k === 'n' && G.state === 'levelDone') nextLevel();
  else if (k === 'escape') G.state = 'menu';
  else if (G.state === 'menu' && ['1', '2', '3'].includes(k)) startLevel(Number(k) - 1);
});

// ---------------------------------------------------------------- demo states for screenshots (real renders)
(function demo() {
  const q = new URLSearchParams(location.search);
  const d = q.get('demo');
  if (!d) return;
  if (d === 'mid') { startLevel(0); [0, 1, 2].forEach(i => G.found.add(i)); G.score = 300; G.levelScore = 300; }
  if (d === 'late') { startLevel(1); [0, 1, 2, 3, 4].forEach(i => G.found.add(i)); G.score = 500; G.levelScore = 500; }
  if (d === 'win') {
    startLevel(0);
    SCENES[0].diffs.forEach((_, i) => G.found.add(i));
    G.score = 813; G.levelScore = 813; G.elapsed = 87; G.stars = 3; G.state = 'levelDone';
  }
})();

requestAnimationFrame(frame);
