/**
 * case-studies.js
 * Page-specific behaviour for case-studies.html only.
 *
 * Navigation, footer rendering, scroll-reveal, scroll progress and every
 * shared component are already wired up globally by js/main.js. This
 * module adds only the interactions unique to this page:
 *   1. Switching between the five case-study tabs (only one panel visible
 *      at a time, with a soft fade transition).
 *   2. Filtering which tabs are available by business domain.
 *   3. "Continue Exploring" cards that jump straight to another case study.
 */

const TABS_NAV_SELECTOR = '[data-case-study-tabs]';
const TAB_SELECTOR = '.tabs__link';
const PANEL_SELECTOR = '[data-case-study-panel]';
const DOMAIN_FILTER_SELECTOR = '[data-domain-filter]';
const EMPTY_STATE_SELECTOR = '[data-filter-empty]';
const TRANSITION_CLASS = 'is-transitioning';
const ACTIVE_CLASS = 'is-active';
const FADE_DURATION_MS = 200;

function getPanels() {
  return Array.from(document.querySelectorAll(PANEL_SELECTOR));
}

function getTabs(nav) {
  return Array.from(nav.querySelectorAll(TAB_SELECTOR));
}

function activateTab(nav, targetId) {
  const panels = getPanels();
  const tabs = getTabs(nav);
  const currentPanel = panels.find((panel) => !panel.hidden);
  const nextPanel = document.getElementById(targetId);
  if (!nextPanel || nextPanel === currentPanel) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  tabs.forEach((tab) => {
    const isTarget = tab.getAttribute('data-tab-target') === targetId;
    tab.classList.toggle(ACTIVE_CLASS, isTarget);
    tab.setAttribute('aria-selected', String(isTarget));
  });

  const swap = () => {
    if (currentPanel) currentPanel.hidden = true;
    nextPanel.hidden = false;
    nextPanel.classList.add(TRANSITION_CLASS);
    // Force reflow so the transition actually runs.
    void nextPanel.offsetWidth;
    nextPanel.classList.remove(TRANSITION_CLASS);
    nextPanel.querySelector('h2, h3')?.focus?.();
    nextPanel.scrollIntoView({ behavior: 'auto', block: 'start' });
  };

  if (prefersReducedMotion || !currentPanel) {
    swap();
    return;
  }

  currentPanel.classList.add(TRANSITION_CLASS);
  window.setTimeout(swap, FADE_DURATION_MS);
}

function initTabSwitching(nav) {
  getTabs(nav).forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab-target');
      if (targetId) activateTab(nav, targetId);
    });
  });

  // Basic roving keyboard support across visible tabs.
  nav.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return;
    const visibleTabs = getTabs(nav).filter(
      (tab) => tab.closest('.tabs__item')?.style.display !== 'none'
    );
    const currentIndex = visibleTabs.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    event.preventDefault();
    const delta = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (currentIndex + delta + visibleTabs.length) % visibleTabs.length;
    visibleTabs[nextIndex].focus();
    visibleTabs[nextIndex].click();
  });
}

function initDomainFiltering(nav) {
  const filterButtons = Array.from(document.querySelectorAll(DOMAIN_FILTER_SELECTOR));
  const emptyState = document.querySelector(EMPTY_STATE_SELECTOR);
  if (!filterButtons.length) return;

  let activeDomain = null;

  const applyFilter = () => {
    const tabs = getTabs(nav);
    let firstVisibleTargetId = null;

    tabs.forEach((tab) => {
      const item = tab.closest('.tabs__item');
      const matches = !activeDomain || tab.getAttribute('data-domain') === activeDomain;
      if (item) item.style.display = matches ? '' : 'none';
      if (matches && !firstVisibleTargetId) {
        firstVisibleTargetId = tab.getAttribute('data-tab-target');
      }
    });

    if (emptyState) {
      emptyState.hidden = Boolean(firstVisibleTargetId);
    }

    const nav_ = document.querySelector(TABS_NAV_SELECTOR);
    nav_.hidden = !firstVisibleTargetId;

    if (firstVisibleTargetId) {
      activateTab(nav, firstVisibleTargetId);
    } else {
      getPanels().forEach((panel) => { panel.hidden = true; });
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const domain = button.getAttribute('data-domain-filter');
      const isReselecting = activeDomain === domain;
      activeDomain = isReselecting ? null : domain;

      filterButtons.forEach((btn) => {
        btn.setAttribute('aria-pressed', String(btn === button && !isReselecting));
      });

      applyFilter();
    });
  });
}

function initNextCaseStudyLinks(nav) {
  document.querySelectorAll('[data-tab-target].card--link').forEach((card) => {
    card.addEventListener('click', (event) => {
      const targetId = card.getAttribute('data-tab-target');
      if (!targetId) return;
      event.preventDefault();
      activateTab(nav, targetId);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector(TABS_NAV_SELECTOR);
  if (!nav) return;

  initTabSwitching(nav);
  initDomainFiltering(nav);
  initNextCaseStudyLinks(nav);
});
