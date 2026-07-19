/**
 * about.js
 * Page-specific behaviour for about.html only.
 *
 * Navigation, footer rendering, scroll-reveal, scroll progress and every
 * shared component are already wired up globally by js/main.js. This
 * module adds only the one interaction unique to this page: highlighting
 * the active milestone as the visitor scrolls through the Professional
 * Journey and Education timelines.
 */

const TIMELINE_ITEM_SELECTOR = '.timeline__item';
const ACTIVE_CLASS = 'is-active';

function initTimelineActiveState() {
  const items = document.querySelectorAll(TIMELINE_ITEM_SELECTOR);
  if (!items.length) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle(ACTIVE_CLASS, entry.isIntersecting);
      });
    },
    {
      root: null,
      // Treat an item as "active" once it crosses the vertical center
      // of the viewport, so only one milestone is emphasised at a time.
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0,
    }
  );

  items.forEach((item) => observer.observe(item));

  // Reduced-motion users still get the active state (it's a state change,
  // not an animation), but without any transition applied via JS.
  if (prefersReducedMotion) {
    items.forEach((item) => item.style.setProperty('transition', 'none'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTimelineActiveState();
});
