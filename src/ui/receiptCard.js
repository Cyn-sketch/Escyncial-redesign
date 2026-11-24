/**
 * Proof panels: each receipt card shows the number as a picture, so the card
 * complements the headline beside it instead of repeating it. Only figures
 * already stated in the content are drawn; shapes carry no extra data.
 */
const PROOF = {
  'grid-flip': { kind: 'days', label: 'THE 21 DAYS', caption: 'Day 1 to day 21. Not one boosted reel.', end: '+14.2K' },
  'roas-report': { kind: 'bars', label: 'MONEY IN VS MONEY OUT', bars: [['SPENT', 12, '$12'], ['RETURNED', 412, '$412']], caption: 'Every dollar in came back 34 times.' },
  'reddit-threads': { kind: 'spikes', label: 'TWO THREADS, TWO SPIKES', marks: ['THREAD 01', 'THREAD 02'], caption: 'Lightning, twice. Both paid off.' },
  'community-building': { kind: 'steps', label: 'FROM ZERO', steps: ['MONTH 1', 'MONTH 2', 'MONTH 3'], end: '50K+', caption: 'Started at zero. Three months later, 50K+.' },
  'content-overhaul': { kind: 'bars', label: 'ENGAGEMENT, BEFORE VS AFTER', bars: [['BEFORE', 1, '1×'], ['AFTER', 4.2, '4.2×']], caption: 'Same brand. New content. +320%.' },
};

/** Placeholder poster drawn on a canvas: a loud visual proof for the result. */
export function drawReceipt(project, index) {
  const W = 1280, H = 800;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const g = cv.getContext('2d');
  const [c1, c2] = project.palette || ['#3d0a16', '#d0304f'];
  const BURG = '#d0304f', INK = '#faf7f7', DIM = 'rgba(250,247,247,0.55)', FAINT = 'rgba(250,247,247,0.14)';
  const SERIF = '"DM Serif Display", Georgia, serif', SANS = 'Montserrat, sans-serif';
  const no = String(index + 1).padStart(3, '0');
  const proof = PROOF[project.slug] || { kind: 'days', label: 'THE RESULT', caption: '', end: '' };

  // Base
  g.fillStyle = '#000';
  g.fillRect(0, 0, W, H);
  const bg = g.createLinearGradient(0, H, W, 0);
  bg.addColorStop(0, c1);
  bg.addColorStop(0.7, '#050102');
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);
  const glow = g.createRadialGradient(W * 0.7, H * 0.7, 0, W * 0.7, H * 0.7, W * 0.6);
  glow.addColorStop(0, c2);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  g.globalAlpha = 0.35;
  g.fillStyle = glow;
  g.fillRect(0, 0, W, H);
  g.globalAlpha = 1;

  // Ticker strip
  g.fillStyle = BURG;
  g.fillRect(0, 0, W, 54);
  g.fillStyle = '#000';
  g.font = `800 20px ${SANS}`;
  const tick = 'STRATEGY MEETS SAVAGERY  ✦  ESCYNCIAL  ✦  RECEIPTS, NOT PROMISES  ✦  ';
  let tx = -40;
  while (tx < W) { g.fillText(tick, tx, 35); tx += g.measureText(tick).width; }

  // Header
  g.font = `700 20px ${SANS}`;
  g.fillStyle = DIM;
  g.fillText(`RECEIPT NO. ${no}`, 56, 108);
  g.fillStyle = BURG;
  g.textAlign = 'right';
  g.fillText(proof.label, W - 56, 108);
  g.textAlign = 'left';
  g.strokeStyle = 'rgba(250,247,247,0.3)';
  g.setLineDash([6, 8]);
  g.lineWidth = 2;
  g.beginPath(); g.moveTo(56, 132); g.lineTo(W - 56, 132); g.stroke();
  g.setLineDash([]);

  // Chart area
  const X0 = 56, X1 = W - 56, Y0 = 170, Y1 = H - 170;
  const CW = X1 - X0, CH = Y1 - Y0;
  g.lineCap = 'round';
  g.lineJoin = 'round';

  if (proof.kind === 'days') {
    // 21 day tiles in 3 rows of 7, burning brighter toward day 21
    const cols = 7, rows = 3, gap = 14;
    const tw = (CW * 0.62 - gap * (cols - 1)) / cols, th = (CH - gap * (rows - 1)) / rows;
    for (let d = 0; d < 21; d++) {
      const c = d % cols, r = Math.floor(d / cols);
      const x = X0 + c * (tw + gap), y = Y0 + r * (th + gap);
      const t = d / 20;
      g.fillStyle = `rgba(208,48,79,${0.15 + t * 0.85})`;
      g.fillRect(x, y, tw, th);
      g.fillStyle = t > 0.55 ? '#000' : DIM;
      g.font = `700 16px ${SANS}`;
      g.fillText(`DAY ${String(d + 1).padStart(2, '0')}`, x + 14, y + 28);
    }
    g.fillStyle = INK;
    g.font = `400 120px ${SERIF}`;
    g.textAlign = 'right';
    g.fillText(proof.end, X1, Y1 - 6);
    g.textAlign = 'left';
  } else if (proof.kind === 'bars') {
    const max = Math.max(...proof.bars.map((b) => b[1]));
    const bh = Math.min(150, (CH - 40) / proof.bars.length - 50);
    proof.bars.forEach(([lab, v, txt], i) => {
      const y = Y0 + 34 + i * (bh + 80);
      g.fillStyle = DIM;
      g.font = `700 18px ${SANS}`;
      g.fillText(lab, X0, y - 12);
      const w = Math.max(14, (v / max) * (CW - 300));
      g.fillStyle = i === proof.bars.length - 1 ? BURG : 'rgba(250,247,247,0.35)';
      g.fillRect(X0, y, w, bh);
      g.fillStyle = INK;
      g.font = `400 ${Math.round(bh * 0.85)}px ${SERIF}`;
      g.fillText(txt, X0 + w + 24, y + bh * 0.82);
    });
  } else if (proof.kind === 'spikes') {
    // Flat baseline with two sharp spikes
    const base = Y1 - 30;
    g.strokeStyle = FAINT;
    g.lineWidth = 2;
    g.beginPath(); g.moveTo(X0, base); g.lineTo(X1, base); g.stroke();
    const spikes = [0.3, 0.72];
    g.strokeStyle = BURG;
    g.lineWidth = 7;
    g.beginPath();
    g.moveTo(X0, base - 10);
    spikes.forEach((sx) => {
      const x = X0 + CW * sx;
      g.lineTo(x - 60, base - 14);
      g.lineTo(x, Y0 + 30);
      g.lineTo(x + 50, base - 40);
      g.lineTo(x + 140, base - 22);
    });
    g.lineTo(X1, base - 26);
    g.stroke();
    proof.marks.forEach((m, i) => {
      const x = X0 + CW * spikes[i];
      g.fillStyle = BURG;
      g.beginPath(); g.arc(x, Y0 + 30, 14, 0, Math.PI * 2); g.fill();
      g.fillStyle = INK;
      g.font = `800 20px ${SANS}`;
      g.textAlign = 'center';
      g.fillText(m, x, Y0 + 2);
      g.textAlign = 'left';
    });
  } else if (proof.kind === 'steps') {
    // Rising staircase from zero, labelled only at the end
    const n = proof.steps.length, gap = 18;
    const bw = (CW * 0.72 - gap * (n - 1)) / n;
    proof.steps.forEach((lab, i) => {
      const h = CH * (0.28 + 0.72 * Math.pow((i + 1) / n, 1.6));
      const x = X0 + i * (bw + gap);
      g.fillStyle = i === n - 1 ? BURG : `rgba(208,48,79,${0.25 + i * 0.25})`;
      g.fillRect(x, Y1 - h, bw, h);
      g.fillStyle = i === n - 1 ? '#000' : INK;
      g.font = `800 18px ${SANS}`;
      g.fillText(lab, x + 16, Y1 - 18);
    });
    g.fillStyle = DIM;
    g.font = `700 18px ${SANS}`;
    g.fillText('0', X0, Y1 + 30);
    g.fillStyle = INK;
    g.font = `400 130px ${SERIF}`;
    g.textAlign = 'right';
    g.fillText(proof.end, X1, Y0 + 110);
    g.textAlign = 'left';
  }

  // Caption + stamp
  g.strokeStyle = 'rgba(250,247,247,0.3)';
  g.setLineDash([6, 8]);
  g.lineWidth = 2;
  g.beginPath(); g.moveTo(56, H - 130); g.lineTo(W - 56, H - 130); g.stroke();
  g.setLineDash([]);
  g.fillStyle = INK;
  g.font = `400 italic 44px ${SERIF}`;
  g.fillText(proof.caption, 56, H - 66);
  g.save();
  g.translate(W - 190, H - 82);
  g.rotate(-0.12);
  g.strokeStyle = BURG;
  g.lineWidth = 4;
  g.strokeRect(-130, -38, 260, 76);
  g.fillStyle = BURG;
  g.font = `900 30px ${SANS}`;
  g.textAlign = 'center';
  g.fillText('DELIVERED', 0, 11);
  g.restore();

  // Perforated bottom edge
  g.fillStyle = '#000';
  for (let x = 0; x < W; x += 32) { g.beginPath(); g.arc(x + 16, H + 4, 11, 0, Math.PI * 2); g.fill(); }

  return cv;
}
