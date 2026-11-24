import * as THREE from 'three';
import { shardGeometry } from './ShardField.js';

/* ------------------------------------------------------------------ */
/* Texture: real image / MP4 from the content file, or a placeholder   */
/* ------------------------------------------------------------------ */

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
function placeholderTexture(project, index) {
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

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return { tex, aspect: W / H };
}

function loadMedia(project, index) {
  const m = project.media || {};
  if (m.url && m.mime?.startsWith('video/')) {
    const v = document.createElement('video');
    Object.assign(v, { src: m.url, muted: true, loop: true, playsInline: true, crossOrigin: 'anonymous', preload: 'auto' });
    const tex = new THREE.VideoTexture(v);
    tex.colorSpace = THREE.SRGBColorSpace;
    return { tex, aspect: 16 / 10, video: v };
  }
  if (m.url) {
    const tex = new THREE.TextureLoader().load(m.url);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return { tex, aspect: 16 / 10 };
  }
  const yt = project.video;
  if (yt?.provider === 'youtube' && yt.id) {
    // YouTube thumbnail as the resolved texture (i.ytimg.com allows CORS); the live
    // preview iframe is laid on top by YouTubeLayer once the tiles have resolved.
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    const tex = loader.load(`https://i.ytimg.com/vi/${yt.id}/maxresdefault.jpg`, undefined, undefined, () => {
      loader.load(`https://i.ytimg.com/vi/${yt.id}/hqdefault.jpg`, (t) => {
        tex.image = t.image;
        tex.needsUpdate = true;
      });
    });
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return { tex, aspect: 16 / 9, youtubeId: yt.id, youtubeStart: yt.start || 0 };
  }
  return placeholderTexture(project, index);
}

/* ------------------------------------------------------------------ */

/**
 * A project floating in the space. Far away it is a loose cluster of
 * glitching tiles; as the camera approaches, the tiles fly into a grid
 * and resolve into the project visual. Chrome frame + orbiting shards
 * + a soft purple glow behind.
 */
export class ProjectObject {
  constructor(project, index, { width = 4.4, grid = [26, 16], camera } = {}) {
    this.camera = camera;
    this.index = index;
    const media = loadMedia(project, index);
    this.media = media;
    const height = width / media.aspect;
    this.width = width;
    this.height = height;
    const [gx, gy] = grid;
    const n = gx * gy;
    const tint = new THREE.Color(project.palette?.[1] || '#d0304f');

    /* ---- Tiles ---- */
    const base = new THREE.PlaneGeometry(1, 1);
    const g = new THREE.InstancedBufferGeometry();
    g.index = base.index;
    g.setAttribute('position', base.getAttribute('position'));
    g.setAttribute('uv', base.getAttribute('uv'));
    const cell = new Float32Array(n * 2);
    const rand = new Float32Array(n * 4);
    const scatter = new Float32Array(n * 3);
    let k = 0;
    for (let y = 0; y < gy; y++) {
      for (let x = 0; x < gx; x++, k++) {
        cell.set([x, y], k * 2);
        rand.set([Math.random(), Math.random(), Math.random(), Math.random()], k * 4);
        // Scatter: mostly sideways in glitch bands, some depth.
        const band = Math.round((Math.random() - 0.5) * 6) * 0.5;
        scatter.set([(Math.random() - 0.5) * 9, band + (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 7], k * 3);
      }
    }
    g.setAttribute('aCell', new THREE.InstancedBufferAttribute(cell, 2));
    g.setAttribute('aRand', new THREE.InstancedBufferAttribute(rand, 4));
    g.setAttribute('aScatter', new THREE.InstancedBufferAttribute(scatter, 3));
    g.instanceCount = n;

    this.uniforms = {
      uMap: { value: media.tex },
      uTime: { value: 0 },
      uResolve: { value: 0 },
      uGlitch: { value: 0 },
      uGrid: { value: new THREE.Vector2(gx, gy) },
      uSize: { value: new THREE.Vector2(width, height) },
      uTint: { value: tint },
      uOpacity: { value: 1 },
    };

    const tiles = new THREE.Mesh(
      g,
      new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        vertexShader: /* glsl */ `
          uniform float uTime, uResolve, uGlitch;
          uniform vec2 uGrid, uSize;
          attribute vec2 aCell;
          attribute vec4 aRand;
          attribute vec3 aScatter;
          varying vec2 vUv;
          varying float vR, vRand;
          mat2 rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }
          void main() {
            vec2 cuv = (aCell + 0.5) / uGrid;
            vec2 center = cuv * uSize - uSize * 0.5;
            // Resolve from the middle outward, with jitter.
            float d = length(cuv - 0.5);
            float r = clamp(uResolve * 1.7 - d * 0.75 - aRand.x * 0.35, 0.0, 1.0);
            r = r * r * (3.0 - 2.0 * r);

            vec2 cs = uSize / uGrid;
            vec3 l = vec3(position.xy * cs * mix(0.55, 1.002, r), 0.0);
            float a = (1.0 - r) * (aRand.y - 0.5) * 7.0 + (1.0 - r) * uTime * (aRand.z - 0.5);
            l.xy = rot(a) * l.xy;
            l.xz = rot(a * 0.8) * l.xz;

            vec3 p = vec3(center, 0.0) + l;
            p += aScatter * (1.0 - r);
            p += vec3(sin(uTime * 0.7 + aRand.z * 6.28), cos(uTime * 0.6 + aRand.w * 6.28), sin(uTime * 0.5 + aRand.x * 6.28)) * 0.18 * (1.0 - r);

            // Row glitch on the resolved image.
            float band = floor(aCell.y * 0.5) + floor(uTime * 14.0) * 3.0;
            float h = fract(sin(band * 91.3) * 43758.5);
            p.x += 0.0 * h; // Escyncial: no row glitch

            vUv = (aCell + uv) / uGrid;
            vR = r;
            vRand = aRand.w;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform sampler2D uMap;
          uniform float uGlitch, uOpacity;
          uniform vec3 uTint;
          varying vec2 vUv;
          varying float vR, vRand;
          void main() {
            vec3 col = texture2D(uMap, vUv).rgb; // Escyncial: no RGB split
            // Unresolved tiles are glowing purple chips.
            vec3 chip = uTint * (0.35 + vRand * 0.9);
            col = mix(chip, col, smoothstep(0.15, 0.85, vR));
            col *= mix(1.0, 0.7, vR); // keep posters just under the bloom threshold
            gl_FragColor = vec4(col, uOpacity * mix(0.55, 1.0, vR));
          }
        `,
      })
    );
    tiles.frustumCulled = false;

    /* ---- Chrome frame with corner ticks ---- */
    const hw = width / 2 + 0.12, hh = height / 2 + 0.12, t = 0.32;
    const corners = [
      [-hw, hh, -hw + t, hh], [-hw, hh, -hw, hh - t],
      [hw, hh, hw - t, hh], [hw, hh, hw, hh - t],
      [-hw, -hh, -hw + t, -hh], [-hw, -hh, -hw, -hh + t],
      [hw, -hh, hw - t, -hh], [hw, -hh, hw, -hh + t],
    ].flatMap(([a, b, c, d]) => [a, b, 0, c, d, 0]);
    const fg = new THREE.BufferGeometry();
    fg.setAttribute('position', new THREE.Float32BufferAttribute(corners, 3));
    this.frameMat = new THREE.LineBasicMaterial({ color: '#d9d4d5', transparent: true, opacity: 0 });
    const frame = new THREE.LineSegments(fg, this.frameMat);

    /* ---- Glow behind ---- */
    this.glowMat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: tint }, uAmt: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform vec3 uColor; uniform float uAmt; varying vec2 vUv;
        void main(){ float d = length((vUv - 0.5) * vec2(1.0, 1.6)); float a = smoothstep(0.5, 0.0, d); gl_FragColor = vec4(uColor * a * a * 0.55 * uAmt, 1.0); }`,
    });
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(width * 2.2, height * 2.6), this.glowMat);
    glow.position.z = -0.6;

    /* ---- Orbiting shards ---- */
    const on = 90;
    const og = shardGeometry();
    const orb = new Float32Array(on * 4);
    for (let i = 0; i < on; i++) {
      orb.set([Math.random() * Math.PI * 2, width * (0.7 + Math.random() * 0.55), (Math.random() - 0.5) * height * 1.7, 0.03 + Math.random() * 0.07], i * 4);
    }
    og.setAttribute('aOrb', new THREE.InstancedBufferAttribute(orb, 4));
    og.instanceCount = on;
    this.orbUniforms = { uTime: { value: 0 }, uColor: { value: tint }, uAmt: { value: 0.3 } };
    const orbit = new THREE.Mesh(
      og,
      new THREE.ShaderMaterial({
        uniforms: this.orbUniforms,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          uniform float uTime;
          attribute vec4 aOrb; // angle, radius, y, size
          varying float vF;
          void main() {
            float a = aOrb.x + uTime * (0.08 + aOrb.w);
            vec3 c = vec3(cos(a) * aOrb.y, aOrb.y * 0.0 + aOrb.z + sin(uTime + aOrb.x * 3.0) * 0.1, sin(a) * aOrb.y * 0.45);
            vec3 l = position * aOrb.w;
            float s = sin(uTime * 2.0 + aOrb.x * 9.0), co = cos(uTime * 2.0 + aOrb.x * 9.0);
            l.xy = mat2(co, -s, s, co) * l.xy;
            vF = 0.5 + 0.5 * sin(uTime * 3.0 + aOrb.x * 20.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(c + l, 1.0);
          }
        `,
        fragmentShader: `uniform vec3 uColor; uniform float uAmt; varying float vF; void main(){ gl_FragColor = vec4(uColor * (0.6 + vF) * uAmt, 1.0); }`,
      })
    );
    orbit.frustumCulled = false;

    this.object = new THREE.Group();
    this.inner = new THREE.Group();
    this.inner.add(glow, tiles, frame, orbit);
    this.object.add(this.inner);
    this._v = new THREE.Vector3();
    this.resolve = 0;
    this.phase = Math.random() * 10;
  }

  update(dt, t) {
    const u = this.uniforms;
    u.uTime.value = t;
    this.orbUniforms.uTime.value = t;

    // Resolve by camera distance.
    this.object.getWorldPosition(this._v);
    const d = this._v.distanceTo(this.camera.position);
    this.object.visible = d < 80; // distance culling: skip draw calls for far-away projects
    const r = 1 - THREE.MathUtils.clamp((d - 10.5) / (24 - 10.5), 0, 1);
    this.resolve += (r * r * (3 - 2 * r) - this.resolve) * (1 - Math.pow(0.02, dt));
    u.uResolve.value = this.resolve;
    this.frameMat.opacity = THREE.MathUtils.smoothstep(this.resolve, 0.75, 1) * 0.9;
    this.glowMat.uniforms.uAmt.value = 0.25 + this.resolve * 0.75;
    this.orbUniforms.uAmt.value = 0.35 - this.resolve * 0.12;

    // Idle float.
    this.inner.position.y = Math.sin(t * 0.6 + this.phase) * 0.12;
    this.inner.rotation.z = Math.sin(t * 0.4 + this.phase) * 0.015;

    if (this.media.video) {
      if (this.resolve > 0.15 && this.media.video.paused) this.media.video.play().catch(() => {});
      else if (this.resolve < 0.05 && !this.media.video.paused) this.media.video.pause();
    }
  }
}
