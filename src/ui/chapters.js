import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Escyncial chapters, tight edition. About two screens of scroll in total.
 *  - Numbers: the 4x2 grid snaps in as tiles flip up out of the dark, figures count up. No pin.
 *  - Work: brand cards slide past horizontally in one short pin.
 *  - Founders: the two cards swing in as they enter. No pin.
 */
export function initChapters({ enabled, onChange }) {
  if (!enabled) return;
  document.documentElement.classList.add('chapters');

  // ---- Numbers: fast flip-in + count-up ----
  const nums = [...document.querySelectorAll('#numbers .xnum')];
  if (nums.length) {
    gsap.set(nums, { rotateX: -75, y: 60, opacity: 0, transformOrigin: '50% 100%' });
    ScrollTrigger.create({
      trigger: '#numbers .xnums', start: 'top 80%', once: true,
      onEnter: () => {
        gsap.to(nums, { rotateX: 0, y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: { each: 0.06, grid: [2, 4], from: 'start' } });
        nums.forEach((el, i) => {
          const b = el.querySelector('b');
          const node = b.firstChild; // text node before <sup>
          const m = node && node.nodeValue.match(/^(\D*)([\d.]+)(.*)$/);
          if (!m) return;
          const end = parseFloat(m[2]); const dec = (m[2].split('.')[1] || '').length;
          const o = { v: 0 };
          gsap.to(o, { v: end, duration: 1.1, delay: i * 0.06, ease: 'power2.out',
            onUpdate: () => { node.nodeValue = m[1] + o.v.toFixed(dec) + m[3]; } });
        });
      },
    });
  }

  // ---- Work: horizontal sweep in one short pin ----
  const track = document.querySelector('#stages .xidx');
  if (track) {
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '#stages', start: 'top top', end: () => `+=${Math.round(dist() * 0.6)}`, pin: true, scrub: 0.5, invalidateOnRefresh: true },
    });
  }

  // ---- Founders: swing in on entry ----
  const cards = document.querySelectorAll('#founders .xfdr article');
  if (cards.length === 2) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: '#founders .xfdr', start: 'top 85%', end: 'top 45%', scrub: 0.6 } });
    tl.from(cards[0], { xPercent: -40, rotateY: 35, opacity: 0, ease: 'power3.out' }, 0)
      .from(cards[1], { xPercent: 40, rotateY: -35, opacity: 0, ease: 'power3.out' }, 0.1);
  }

  ScrollTrigger.refresh();
  onChange?.();
}
