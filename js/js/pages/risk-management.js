/**
 * risk-management.js
 * Page-specific behaviour for risk-management.html only.
 *
 * Navigation, footer rendering, scroll-reveal, scroll progress and every
 * shared component (cards, badges, accordion) are already wired up
 * globally by js/main.js. This module adds only the interaction unique to
 * this page: selecting a point on the Risk Matrix to reveal its likelihood,
 * impact and zone in the detail panel below it.
 */

const MATRIX_SELECTOR = '.risk-matrix';
const POINT_SELECTOR = '.risk-matrix__point';
const DETAIL_SELECTOR = '#risk-matrix-detail';
const SELECTED_CLASS = 'is-selected';

const ZONE_LABEL = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
  critical: 'Critical Risk',
};

function renderDetail(detailEl, point) {
  const zone = point.getAttribute('data-zone');
  const likelihood = point.getAttribute('data-likelihood');
  const impact = point.getAttribute('data-impact');
  const zoneLabel = ZONE_LABEL[zone] || 'Risk';

  detailEl.innerHTML = `
    <div class="risk-matrix__detail-body">
      <span class="risk-matrix__detail-zone">${zoneLabel}</span>
      <p>
        Likelihood: <strong>${likelihood}</strong> &middot;
        Business Impact: <strong>${impact}</strong>
      </p>
      <p>Example: &hellip; <span class="sr-only">(illustrative placeholder, not an actual assessment)</span></p>
    </div>
  `;
}

function initRiskMatrix() {
  const matrix = document.querySelector(MATRIX_SELECTOR);
  if (!matrix) return;

  const detailEl = document.querySelector(DETAIL_SELECTOR);
  const points = Array.from(matrix.querySelectorAll(POINT_SELECTOR));
  if (!points.length || !detailEl) return;

  const selectPoint = (point) => {
    points.forEach((p) => {
      p.classList.toggle(SELECTED_CLASS, p === point);
      p.setAttribute('aria-pressed', String(p === point));
    });
    renderDetail(detailEl, point);
  };

  points.forEach((point) => {
    point.addEventListener('click', () => selectPoint(point));
    point.addEventListener('mouseenter', () => renderDetail(detailEl, point));
    point.addEventListener('focus', () => renderDetail(detailEl, point));
  });

  matrix.addEventListener('mouseleave', () => {
    const selected = matrix.querySelector(`.${SELECTED_CLASS}`);
    if (selected) {
      renderDetail(detailEl, selected);
    } else {
      detailEl.innerHTML =
        '<p class="risk-matrix__detail-placeholder">Select a point on the matrix to see an example.</p>';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initRiskMatrix();
});
