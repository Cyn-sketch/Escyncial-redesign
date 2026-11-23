/**
 * Escyncial's attention cursor: a burgundy dot that trails the pointer and
 * opens into a "Look" ring over anything clickable. Fine pointers only.
 */
export function initCursor() {
  if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const dot = document.createElement('div');
  dot.className = 'esc-cursor';
  dot.innerHTML = '<span>Look</span>';
  document.body.appendChild(dot);
  document.documentElement.classList.add('has-esc-cursor');
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener('pointermove', (e) => {
    x = e.clientX; y = e.clientY;
    dot.classList.toggle('is-hot', !!e.target.closest('a, button, [role="button"], input, select, textarea'));
  }, { passive: true });
  document.addEventListener('pointerleave', () => dot.classList.add('is-gone'));
  document.addEventListener('pointerenter', () => dot.classList.remove('is-gone'));
  const tick = () => {
    cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
    dot.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
