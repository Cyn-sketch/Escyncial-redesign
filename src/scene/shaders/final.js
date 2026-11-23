import { Vector2 } from 'three';

/**
 * Final screen pass (Escyncial look): film grain, burgundy-leaning shadows
 * and a vignette. No RGB split, no block glitch, no scanlines.
 * `uGlitch` is kept as a uniform for compatibility but unused.
 */
export const FinalShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uAberration: { value: 0.6 },
    uGlitch: { value: 0 },
    uVignette: { value: 1.0 },
    uResolution: { value: new Vector2(1, 1) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime, uAberration, uGlitch, uVignette;
    uniform vec2 uResolution;
    varying vec2 vUv;

    float hash(float n) { return fract(sin(n) * 43758.5453123); }

    void main() {
      vec3 col = texture2D(tDiffuse, vUv).rgb;
      float lum = dot(col, vec3(0.299, 0.587, 0.114));

      // Film grain, a touch stronger in the shadows.
      float g = hash(dot(floor(vUv * uResolution), vec2(12.9898, 78.233)) + floor(uTime * 24.0)) - 0.5;
      col += g * 0.0; // Escyncial: no grain

      // Shadows lean burgundy, highlights stay clean white.
      col = mix(col, col * vec3(1.08, 0.9, 0.93), (1.0 - lum) * 0.5 * uAberration);

      // Vignette
      float v = smoothstep(0.95, 0.2, length(vUv - 0.5) * 1.25);
      col *= mix(1.0, v, 0.8 * uVignette);

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};
