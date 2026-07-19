/**
 * home.js
 * Page-specific behaviour for index.html only.
 *
 * Navigation, footer rendering, scroll-reveal, scroll progress and every
 * shared component (buttons, cards, badges) are already wired up globally
 * by js/main.js. This module adds nothing that duplicates that system —
 * it only handles the one piece of behaviour unique to the homepage: a
 * gently auto-scrolling industry badge row in the "Trusted Expertise"
 * section that pauses on hover/focus and respects reduced-motion.
 */

const SELECTOR_BADGE_ROW = '[data-page="home"] .badge-row, #expertise .badge-row';
const AUTO_SCROLL_SPEED_PX_PER_SEC = 18;

function initExpertiseBadgeMarquee() {
  const row = document.querySelector('#expertise .badge-row');
  if (!row) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Respect reduced-motion: leave the row fully static, no auto-scroll.
  if (prefersReducedMotion) return;

  // Only auto-scroll if the row actually overflows its container.
  if (row.scrollWidth <= row.clientWidth) return;

  let isPaused = false;
  let rafId = null;
  let lastTimestamp = null;

  const step = (timestamp) => {
    if (lastTimestamp === null) lastTimestamp = timestamp;
    const deltaSeconds = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    if (!isPaused) {
      const maxScroll = row.scrollWidth - row.clientWidth;
      const next = row.scrollLeft + AUTO_SCROLL_SPEED_PX_PER_SEC * deltaSeconds;
      row.scrollLeft = next >= maxScroll ? 0 : next;
    }

    rafId = window.requestAnimationFrame(step);
  };

  const pause = () => { isPaused = true; };
  const resume = () => { isPaused = false; };

  row.addEventListener('mouseenter', pause);
  row.addEventListener('mouseleave', resume);
  row.addEventListener('focusin', pause);
  row.addEventListener('focusout', resume);

  rafId = window.requestAnimationFrame(step);

  // Stop cleanly if the page is being torn down (SPA-style nav, if ever added).
  window.addEventListener('pagehide', () => {
    if (rafId) window.cancelAnimationFrame(rafId);
  }, { once: true });
}

document.addEventListener('DOMContentLoaded', () => {
  initExpertiseBadgeMarquee();
});
