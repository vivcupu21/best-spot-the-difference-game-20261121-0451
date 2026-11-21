// Twin Tails — scene art. Every picture is drawn with canvas shapes only:
// no image files, no network. Each scene is 600 x 560 units and is drawn
// twice (left panel = variant 0, right panel = variant 1). A "diff" is one
// small element whose drawing differs between the two variants.

'use strict';

function ttCircle(g, x, y, r, color) {
  g.fillStyle = color;
  g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
}
function ttEllipse(g, x, y, rx, ry, color) {
  g.fillStyle = color;
  g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.fill();
}
function ttRect(g, x, y, w, h, color) {
  g.fillStyle = color; g.fillRect(x, y, w, h);
}
function ttRr(g, x, y, w, h, r, color) {
  g.fillStyle = color;
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath(); g.fill();
}
function ttLine(g, x1, y1, x2, y2, color, w) {
  g.strokeStyle = color; g.lineWidth = w || 2; g.lineCap = 'round';
  g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
}
function ttPoly(g, pts, color) {
  g.fillStyle = color;
  g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
  g.closePath(); g.fill();
}
function ttText(g, s, x, y, size, color, align, weight) {
  g.fillStyle = color;
  g.font = (weight || '700') + ' ' + size + 'px Verdana, sans-serif';
  g.textAlign = align || 'center'; g.textBaseline = 'middle';
  g.fillText(s, x, y);
}

// ---------------------------------------------------------------- scene 1
function drawGardenBase(g) {
  const sky = g.createLinearGradient(0, 0, 0, 560);
  sky.addColorStop(0, '#8ec9ee'); sky.addColorStop(0.62, '#cfeef7'); sky.addColorStop(1, '#fdf3cf');
  g.fillStyle = sky; g.fillRect(0, 0, 600, 560);
  // clouds (shared)
  ttEllipse(g, 120, 70, 46, 18, '#ffffff'); ttEllipse(g, 150, 62, 34, 16, '#ffffff');
  ttEllipse(g, 380, 52, 40, 15, '#ffffff'); ttEllipse(g, 405, 46, 28, 13, '#ffffff');
  // hills
  ttEllipse(g, 110, 600, 330, 150, '#8ec97a');
  ttEllipse(g, 520, 610, 360, 160, '#79bd68');
  // path
  ttPoly(g, [[250, 560], [285, 470], [330, 470], [365, 560]], '#e8d9b0');
  ttEllipse(g, 300, 500, 9, 6, '#d9c48f'); ttEllipse(g, 312, 530, 9, 6, '#d9c48f');
  // tree (left)
  ttRect(g, 78, 300, 22, 130, '#8a5a33');
  ttCircle(g, 88, 265, 52, '#4f9e4d'); ttCircle(g, 52, 300, 36, '#5cb85c'); ttCircle(g, 126, 300, 36, '#5cb85c');
  ttCircle(g, 88, 235, 34, '#6cc46a');
  // fence behind bench
  g.fillStyle = '#c9a06a';
  for (let x = 400; x <= 560; x += 32) g.fillRect(x, 392, 10, 46);
  g.fillRect(392, 400, 180, 8); g.fillRect(392, 424, 180, 8);
  // bench frame (slats drawn by the diff)
  ttRect(g, 418, 452, 148, 10, '#7a4a21'); ttRect(g, 424, 462, 10, 26, '#7a4a21'); ttRect(g, 550, 462, 10, 26, '#7a4a21');
  // cat body (tail drawn by the diff)
  ttEllipse(g, 322, 448, 42, 26, '#f39c3d');           // body
  ttCircle(g, 348, 414, 24, '#f39c3d');                // head
  ttPoly(g, [[332, 396], [338, 374], [348, 392]], '#f39c3d'); // ear L
  ttPoly(g, [[356, 392], [366, 374], [368, 396]], '#f39c3d'); // ear R
  ttPoly(g, [[336, 390], [339, 378], [345, 388]], '#e07f22');
  ttPoly(g, [[359, 388], [365, 378], [367, 390]], '#e07f22');
  ttCircle(g, 340, 410, 3, '#222'); ttCircle(g, 356, 410, 3, '#222');
  ttPoly(g, [[346, 420], [350, 420], [348, 424]], '#d95f6b');
  ttLine(g, 330, 428, 316, 428, '#d98a4b', 2); ttLine(g, 366, 428, 380, 428, '#d98a4b', 2);
  ttEllipse(g, 300, 470, 16, 8, '#f39c3d'); ttEllipse(g, 344, 470, 16, 8, '#f39c3d');
  // flower bed: all tulips except the one at (180,470) which is a diff
  const spots = [[60, 500], [110, 512], [150, 498], [215, 508], [255, 496], [420, 505], [470, 512], [520, 500], [560, 510]];
  const cols = ['#e85d75', '#f2a541', '#b678e0', '#e85d75', '#f2a541', '#e85d75', '#b678e0', '#f2a541', '#e85d75'];
  for (let i = 0; i < spots.length; i++) {
    const [fx, fy] = spots[i];
    ttLine(g, fx, fy, fx, fy - 22, '#3d8b40', 3);
    ttCircle(g, fx, fy - 28, 9, cols[i]);
    ttEllipse(g, fx - 7, fy - 12, 7, 3, '#4f9e4d'); ttEllipse(g, fx + 7, fy - 12, 7, 3, '#4f9e4d');
  }
  // grass tufts
  ttLine(g, 40, 540, 34, 522, '#3d8b40', 3); ttLine(g, 46, 540, 46, 522, '#3d8b40', 3); ttLine(g, 52, 540, 58, 522, '#3d8b40', 3);
  ttLine(g, 580, 545, 574, 527, '#3d8b40', 3); ttLine(g, 586, 545, 586, 527, '#3d8b40', 3);
}

const SCENE_GARDEN = {
  id: 0, name: 'Taman Pagi', sub: 'Level 1 · pagi yang cerah',
  drawBase: drawGardenBase,
  diffs: [
    { x: 505, y: 72, r: 42, name: 'Kacamata matahari',
      draw(g, v) {
        ttCircle(g, 505, 72, 32, '#ffd94d');
        for (let a = 0; a < 8; a++) {
          const t = a * Math.PI / 4;
          ttLine(g, 505 + Math.cos(t) * 38, 72 + Math.sin(t) * 38, 505 + Math.cos(t) * 50, 72 + Math.sin(t) * 50, '#f2b705', 4);
        }
        if (v === 1) {
          ttRr(g, 478, 62, 24, 16, 7, '#222'); ttRr(g, 508, 62, 24, 16, 7, '#222');
          ttLine(g, 502, 68, 508, 68, '#222', 3); ttLine(g, 478, 68, 468, 62, '#222', 3); ttLine(g, 532, 68, 542, 62, '#222', 3);
        }
      } },
    { x: 150, y: 80, r: 26, name: 'Burung kedua',
      draw(g, v) {
        if (v === 0) {
          ttLine(g, 138, 80, 146, 74, '#33475b', 3); ttLine(g, 146, 74, 154, 80, '#33475b', 3);
          ttLine(g, 158, 86, 166, 80, '#33475b', 3); ttLine(g, 166, 80, 174, 86, '#33475b', 3);
        }
      } },
    { x: 430, y: 300, r: 26, name: 'Kupu-kupu',
      draw(g, v) {
        if (v === 0) {
          ttEllipse(g, 420, 292, 12, 16, '#b678e0'); ttEllipse(g, 440, 292, 12, 16, '#e08ad0');
          ttEllipse(g, 420, 312, 9, 12, '#e08ad0'); ttEllipse(g, 440, 312, 9, 12, '#b678e0');
          ttLine(g, 430, 286, 430, 314, '#5b3a7a', 2);
        }
      } },
    { x: 180, y: 470, r: 24, name: 'Warna tulip',
      draw(g, v) {
        ttLine(g, 180, 498, 180, 476, '#3d8b40', 3);
        ttCircle(g, 180, 470, 9, v === 0 ? '#e85d75' : '#f2d13d');
        ttEllipse(g, 173, 486, 7, 3, '#4f9e4d'); ttEllipse(g, 187, 486, 7, 3, '#4f9e4d');
      } },
    { x: 348, y: 420, r: 30, name: 'Ekor kucing',
      draw(g, v) {
        if (v === 0) { // tail up, curled
          g.strokeStyle = '#f39c3d'; g.lineWidth = 9; g.lineCap = 'round';
          g.beginPath(); g.moveTo(286, 452); g.quadraticCurveTo(262, 430, 272, 402); g.stroke();
          ttCircle(g, 272, 400, 6, '#f39c3d');
        } else { // tail down along the ground
          g.strokeStyle = '#f39c3d'; g.lineWidth = 9; g.lineCap = 'round';
          g.beginPath(); g.moveTo(286, 452); g.quadraticCurveTo(268, 466, 250, 470); g.stroke();
          ttCircle(g, 248, 470, 6, '#f39c3d');
        }
      } },
    { x: 88, y: 190, r: 28, name: 'Balon merah',
      draw(g, v) {
        if (v === 0) {
          ttLine(g, 88, 214, 96, 258, '#888', 2);
          ttEllipse(g, 88, 190, 20, 26, '#e85d75');
          ttPoly(g, [[84, 214], [92, 214], [88, 222]], '#c94a61');
        }
      } },
    { x: 492, y: 430, r: 30, name: 'Papan bangku',
      draw(g, v) {
        ttRect(g, 418, 414, 148, 9, '#a06a35');
        if (v === 0) { ttRect(g, 418, 428, 148, 9, '#a06a35'); ttRect(g, 418, 442, 148, 9, '#a06a35'); }
        else { ttRect(g, 418, 436, 148, 9, '#a06a35'); }
      } },
  ],
};

// ---------------------------------------------------------------- scene 2
function drawCafeBase(g) {
  g.fillStyle = '#f7e3c2'; g.fillRect(0, 0, 600, 560);
  // floor
  g.fillStyle = '#b98a5a'; g.fillRect(0, 470, 600, 90);
  g.strokeStyle = '#9c7046'; g.lineWidth = 2;
  for (let y = 490; y < 560; y += 22) { g.beginPath(); g.moveTo(0, y); g.lineTo(600, y); g.stroke(); }
  // rug
  ttEllipse(g, 300, 520, 190, 34, '#c96f6f'); ttEllipse(g, 300, 520, 150, 24, '#e8a0a0');
  // window (bird outside is a diff)
  ttRr(g, 52, 66, 190, 190, 10, '#7fb3d5');
  ttRr(g, 62, 76, 170, 170, 6, '#bfe3f5');
  ttEllipse(g, 110, 120, 30, 12, '#ffffff'); ttEllipse(g, 190, 100, 24, 10, '#ffffff');
  ttEllipse(g, 150, 200, 46, 20, '#8ec97a');
  g.strokeStyle = '#7a4a21'; g.lineWidth = 8;
  g.beginPath(); g.moveTo(147, 76); g.lineTo(147, 246); g.moveTo(62, 161); g.lineTo(232, 161); g.stroke();
  // shelf (jars are a diff)
  ttRect(g, 400, 196, 180, 12, '#7a4a21');
  // wall clock face (hands are a diff)
  ttCircle(g, 505, 82, 34, '#fffdf5'); g.strokeStyle = '#7a4a21'; g.lineWidth = 5;
  g.beginPath(); g.arc(505, 82, 34, 0, Math.PI * 2); g.stroke();
  ttCircle(g, 505, 82, 3, '#222');
  // plant pot (leaves are a diff)
  ttPoly(g, [[62, 420], [128, 420], [120, 470], [70, 470]], '#c96f4a');
  ttRect(g, 58, 412, 74, 12, '#b25a38');
  // table
  ttRr(g, 190, 372, 250, 16, 6, '#8a5a33');
  ttRect(g, 210, 388, 14, 82, '#7a4a21'); ttRect(g, 406, 388, 14, 82, '#7a4a21');
  // teapot body (lid is a diff)
  ttEllipse(g, 292, 348, 34, 24, '#5b8fd6');
  ttPoly(g, [[322, 336], [344, 344], [322, 356]], '#5b8fd6');
  g.strokeStyle = '#5b8fd6'; g.lineWidth = 7; g.lineCap = 'round';
  g.beginPath(); g.moveTo(260, 336); g.quadraticCurveTo(240, 344, 258, 362); g.stroke();
  // cushion + sleeping cat (bow is a diff)
  ttRr(g, 430, 452, 140, 34, 16, '#e8b4d0');
  ttEllipse(g, 500, 448, 52, 22, '#9a9a9a');   // curled body
  ttCircle(g, 540, 432, 18, '#9a9a9a');        // head
  ttPoly(g, [[528, 420], [532, 404], [540, 418]], '#9a9a9a');
  ttPoly(g, [[546, 418], [554, 404], [556, 420]], '#9a9a9a');
  ttLine(g, 534, 434, 540, 434, '#444', 2);    // closed eye
  ttCircle(g, 452, 446, 5, '#8a8a8a');         // tail tip
  // wall picture
  ttRr(g, 300, 70, 90, 64, 6, '#ffffff'); g.strokeStyle = '#7a4a21'; g.lineWidth = 4; g.strokeRect(300, 70, 90, 64);
  ttCircle(g, 330, 100, 12, '#f2a541'); ttEllipse(g, 360, 118, 20, 8, '#8ec97a');
}

const SCENE_CAFE = {
  id: 1, name: 'Kafe Kucing', sub: 'Level 2 · aroma teh hangat',
  drawBase: drawCafeBase,
  diffs: [
    { x: 505, y: 82, r: 34, name: 'Jarum jam',
      draw(g, v) {
        if (v === 0) { ttLine(g, 505, 82, 505, 60, '#222', 4); ttLine(g, 505, 82, 526, 82, '#222', 4); }
        else { ttLine(g, 505, 82, 505, 60, '#222', 4); ttLine(g, 505, 82, 488, 96, '#222', 4); }
      } },
    { x: 292, y: 322, r: 22, name: 'Tutup teko',
      draw(g, v) {
        if (v === 0) { ttEllipse(g, 292, 324, 16, 7, '#3d6fb0'); ttCircle(g, 292, 316, 5, '#3d6fb0'); }
      } },
    { x: 398, y: 356, r: 24, name: 'Cangkir kedua',
      draw(g, v) {
        // first cup is shared
        ttRr(g, 348, 344, 26, 22, 4, '#e85d75'); ttLine(g, 374, 350, 384, 350, '#e85d75', 4);
        if (v === 0) { ttRr(g, 392, 344, 26, 22, 4, '#f2a541'); ttLine(g, 418, 350, 428, 350, '#f2a541', 4); }
      } },
    { x: 95, y: 340, r: 34, name: 'Daun tanaman',
      draw(g, v) {
        const leaves = v === 0 ? 5 : 4;
        for (let i = 0; i < leaves; i++) {
          const a = -Math.PI / 2 + (i - (leaves - 1) / 2) * 0.5;
          const lx = 95 + Math.cos(a) * 34, ly = 348 + Math.sin(a) * 52;
          g.strokeStyle = '#3d8b40'; g.lineWidth = 5; g.lineCap = 'round';
          g.beginPath(); g.moveTo(95, 412); g.quadraticCurveTo(95 + Math.cos(a) * 20, 380, lx, ly); g.stroke();
          ttEllipse(g, lx, ly, 10, 16, '#4f9e4d');
        }
      } },
    { x: 540, y: 414, r: 22, name: 'Pita kucing',
      draw(g, v) {
        if (v === 0) {
          ttPoly(g, [[536, 408], [524, 400], [524, 416]], '#e85d75');
          ttPoly(g, [[544, 408], [556, 400], [556, 416]], '#e85d75');
          ttCircle(g, 540, 408, 4, '#c94a61');
        }
      } },
    { x: 150, y: 130, r: 24, name: 'Burung di jendela',
      draw(g, v) {
        if (v === 0) {
          ttLine(g, 138, 130, 146, 124, '#33475b', 3); ttLine(g, 146, 124, 154, 130, '#33475b', 3);
          ttLine(g, 158, 136, 166, 130, '#33475b', 3); ttLine(g, 166, 130, 174, 136, '#33475b', 3);
        }
      } },
    { x: 472, y: 182, r: 30, name: 'Stoples di rak',
      draw(g, v) {
        ttRr(g, 414, 164, 30, 32, 4, '#b678e0'); ttRr(g, 452, 164, 30, 32, 4, '#f2a541');
        ttRect(g, 414, 158, 30, 8, '#8a5a33'); ttRect(g, 452, 158, 30, 8, '#8a5a33');
        if (v === 0) { ttRr(g, 490, 164, 30, 32, 4, '#5b8fd6'); ttRect(g, 490, 158, 30, 8, '#8a5a33'); }
      } },
  ],
};

// ---------------------------------------------------------------- scene 3
function drawBeachBase(g) {
  const sky = g.createLinearGradient(0, 0, 0, 560);
  sky.addColorStop(0, '#ff9a5c'); sky.addColorStop(0.45, '#ffb37a'); sky.addColorStop(0.62, '#ffd9a0'); sky.addColorStop(1, '#f7dcb0');
  g.fillStyle = sky; g.fillRect(0, 0, 600, 560);
  // clouds
  ttEllipse(g, 110, 70, 42, 14, '#ffe9d6'); ttEllipse(g, 480, 56, 38, 13, '#ffe9d6');
  // sea
  g.fillStyle = '#3d9ec9'; g.fillRect(0, 250, 600, 110);
  g.fillStyle = '#5cb8d6'; g.fillRect(0, 250, 600, 8);
  ttLine(g, 60, 300, 180, 300, '#bfe6f2', 3); ttLine(g, 380, 320, 520, 320, '#bfe6f2', 3);
  ttLine(g, 220, 340, 320, 340, '#bfe6f2', 3);
  // sand
  g.fillStyle = '#f2ddab'; g.fillRect(0, 360, 600, 200);
  ttEllipse(g, 300, 380, 600, 26, '#e8cf96');
  // palm trunk + fronds (coconuts are a diff)
  g.strokeStyle = '#8a5a33'; g.lineWidth = 16; g.lineCap = 'round';
  g.beginPath(); g.moveTo(100, 430); g.quadraticCurveTo(84, 300, 108, 180); g.stroke();
  const fronds = [[108, 180, 40, 130], [108, 180, 176, 130], [108, 180, 80, 110], [108, 180, 140, 104], [108, 180, 108, 96]];
  for (const [x1, y1, x2, y2] of fronds) {
    g.strokeStyle = '#3d8b40'; g.lineWidth = 8;
    g.beginPath(); g.moveTo(x1, y1); g.quadraticCurveTo((x1 + x2) / 2, y1 - 14, x2, y2); g.stroke();
  }
  // umbrella pole + bucket (stripes are a diff)
  ttLine(g, 330, 300, 330, 430, '#8a5a33', 6);
  ttPoly(g, [[160, 440], [200, 440], [194, 478], [166, 478]], '#e85d75');
  ttRr(g, 156, 432, 48, 10, 5, '#c94a61');
  ttLine(g, 200, 440, 226, 420, '#8a5a33', 4);
  ttLine(g, 226, 420, 244, 436, '#8a5a33', 4);
  // towel
  ttRr(g, 380, 470, 120, 26, 6, '#5b8fd6'); ttRr(g, 380, 470, 120, 8, 6, '#ffffff');
  // footprints
  ttEllipse(g, 250, 520, 7, 4, '#d9c48f'); ttEllipse(g, 272, 530, 7, 4, '#d9c48f'); ttEllipse(g, 250, 544, 7, 4, '#d9c48f');
}

const SCENE_BEACH = {
  id: 2, name: 'Pantai Senja', sub: 'Level 3 · matahari terbenam',
  drawBase: drawBeachBase,
  diffs: [
    { x: 300, y: 112, r: 44, name: 'Posisi matahari',
      draw(g, v) {
        const sy = v === 0 ? 88 : 138;
        ttCircle(g, 300, sy, 34, '#ffe08a');
        ttCircle(g, 300, sy, 26, '#ffdf6b');
      } },
    { x: 118, y: 196, r: 26, name: 'Kelapa',
      draw(g, v) {
        ttCircle(g, 100, 196, 9, '#7a4a21'); ttCircle(g, 118, 200, 9, '#7a4a21');
        if (v === 0) ttCircle(g, 134, 192, 9, '#7a4a21');
      } },
    { x: 452, y: 468, r: 26, name: 'Kepiting',
      draw(g, v) {
        if (v === 0) {
          ttEllipse(g, 452, 468, 20, 13, '#e86a5a');
          ttCircle(g, 436, 452, 7, '#e86a5a'); ttCircle(g, 468, 452, 7, '#e86a5a');
          ttCircle(g, 444, 458, 2, '#222'); ttCircle(g, 460, 458, 2, '#222');
          ttLine(g, 436, 476, 424, 484, '#e86a5a', 4); ttLine(g, 468, 476, 480, 484, '#e86a5a', 4);
        }
      } },
    { x: 420, y: 196, r: 30, name: 'Warna layar perahu',
      draw(g, v) {
        ttPoly(g, [[380, 240], [460, 240], [420, 240]], '#7a4a21');
        ttRect(g, 378, 238, 86, 10, '#8a5a33');
        ttLine(g, 420, 238, 420, 168, '#8a5a33', 5);
        ttPoly(g, [[420, 172], [420, 232], [456, 232]], v === 0 ? '#e85d75' : '#5b8fd6');
        ttPoly(g, [[416, 178], [416, 232], [388, 232]], '#f7f3e8');
      } },
    { x: 200, y: 484, r: 24, name: 'Bintang laut',
      draw(g, v) {
        if (v === 0) {
          g.fillStyle = '#f2a541';
          g.beginPath();
          for (let i = 0; i < 10; i++) {
            const a = -Math.PI / 2 + i * Math.PI / 5;
            const r = i % 2 === 0 ? 18 : 8;
            g[i === 0 ? 'moveTo' : 'lineTo'](200 + Math.cos(a) * r, 484 + Math.sin(a) * r);
          }
          g.closePath(); g.fill();
          ttCircle(g, 200, 484, 3, '#d98a2b');
        }
      } },
    { x: 330, y: 300, r: 34, name: 'Garis payung',
      draw(g, v) {
        const cols = v === 0
          ? ['#e85d75', '#ffffff', '#f2a541', '#ffffff', '#5b8fd6']
          : ['#e85d75', '#ffffff', '#f2a541', '#5b8fd6'];
        const n = cols.length, w = 200 / n;
        for (let i = 0; i < n; i++) {
          g.fillStyle = cols[i];
          g.beginPath();
          g.moveTo(330, 296);
          g.lineTo(230 + i * w, 330);
          g.lineTo(230 + (i + 1) * w, 330);
          g.closePath(); g.fill();
        }
        g.strokeStyle = '#c94a61'; g.lineWidth = 3;
        g.beginPath(); g.moveTo(230, 330); g.quadraticCurveTo(330, 348, 430, 330); g.stroke();
        ttCircle(g, 330, 292, 5, '#c94a61');
      } },
    { x: 520, y: 496, r: 26, name: 'Kerang',
      draw(g, v) {
        ttEllipse(g, 500, 496, 12, 8, '#ffffff'); ttEllipse(g, 522, 502, 12, 8, '#f2d13d');
        if (v === 0) ttEllipse(g, 542, 494, 12, 8, '#e8a0c0');
      } },
  ],
};

const SCENES = [SCENE_GARDEN, SCENE_CAFE, SCENE_BEACH];
