const GLYPHS = '█▓▒░▌▐ESCYNL';

/** Briefly overlays RGB-split slices on an element that has data-glitch-text. */
export function glitchOnce() {
  /* Escyncial: no glitch. */
}

/**
 * Scrambles an element's text and resolves it left to right. The real text
 * is already in the HTML (SEO) and is restored exactly at the end.
 */
export function scrambleIn(el) {
  /* Escyncial: a clean reveal instead of a text scramble. */
  el.classList.add('is-in');
  return Promise.resolve();
}

/** Occasional micro-glitch on the nav logo; also on hover/focus. */
export function logoGlitch() {
  /* Escyncial: no logo glitch. */
}
