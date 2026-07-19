/**
 * animations.js
 * IntersectionObserver-driven scroll reveal, the top scroll-progress bar,
 * and a small count-up helper for metric values that opt in via
 * data-counter-target. All of it is inert under prefers-reduced-motion.
 */

import { prefersReducedMotion, qs, qsa, throttle } from './utils.js';

function initScrollReveal() {
  const items = qsa('[data-reveal]');
  if (!items.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );

  items.forEach((item) => observer.observe(item));
}

function initScrollProgress() {
  const bar = qs('[data-scroll-progress]');
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    bar.style.transform = `scaleX(${progress})`;
  };

  update();
  window.addEventListener('scroll', throttle(update, 50), { passive: true });
  window.addEventListener('resize', throttle(update, 150));
}

function initCounters() {
  const counters = qsa('[data-counter-target]');
  if (!counters.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    counters.forEach((el) => {
      el.textContent = el.getAttribute('data-counter-target');
    });
    return;
  }

  const animate = (el) => {
    const target = Number(el.getAttribute('data-counter-target'));
    if (Number.isNaN(target)) return;
    const durationMs = 1100;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / durationMs, 1);
      el.textContent = Math.round(target * progress).toString();
      if (progress < 1) window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((el) => observer.observe(el));
}

export function initAnimations() {
  initScrollReveal();
  initScrollProgress();
  initCounters();
}
