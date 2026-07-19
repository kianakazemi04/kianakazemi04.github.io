/**
 * portfolio.js
 * Page-specific behaviour for portfolio.html only.
 *
 * Navigation, footer rendering, scroll-reveal, scroll progress and every
 * shared component are already wired up globally by js/main.js. This
 * module adds only the interaction unique to this page: smooth-scrolling
 * from the sticky portfolio tabs to each consulting-domain section, and
 * keeping the active tab in sync with scroll position.
 */

const NAV_SELECTOR = '[data-sticky-tabs]';
const TAB_LINK_SELECTOR = '.tabs__link';
const CATEGORY_SELECTOR = '[data-portfolio-category]';
const ACTIVE_CLASS = 'is-active';

function initSmoothScrollToCategory(nav) {
  const links = nav.querySelectorAll(TAB_LINK_SELECTOR);

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('data-tab-target');
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;

      event.preventDefault();

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });

      // Keep the URL shareable/bookmarkable without a jump.
      history.pushState(null, '', `#${targetId}`);
    });
  });
}

function initActiveTabOnScroll(nav) {
  const categories = document.querySelectorAll(CATEGORY_SELECTOR);
  if (!categories.length || !('IntersectionObserver' in window)) return;

  const setActive = (id) => {
    nav.querySelectorAll(TAB_LINK_SELECTOR).forEach((link) => {
      link.classList.toggle(
        ACTIVE_CLASS,
        link.getAttribute('data-tab-target') === id
      );
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      root: null,
      // Fires once a category header has cleared the sticky nav, and
      // before it fully leaves the top of the viewport.
      rootMargin: '-88px 0px -70% 0px',
      threshold: 0,
    }
  );

  categories.forEach((category) => observer.observe(category));
}

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector(NAV_SELECTOR);
  if (!nav) return;

  initSmoothScrollToCategory(nav);
  initActiveTabOnScroll(nav);
});
