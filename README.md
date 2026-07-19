# Kiana Kazemi — Executive Website

Production codebase for the personal executive site of Kiana Kazemi,
Business Strategy Consultant and Founder's Associate.

This repository currently contains the **foundation only**: the design
system, CSS architecture, JS architecture, reusable components, navigation,
footer and project scaffold. No content pages have been built yet —
`index.html`, `about.html` and the rest are built in separate, focused
passes so each page gets full attention. This document is what a future
session (or another engineer) needs to build any page consistently.

Pure HTML5 / CSS3 / vanilla JavaScript. No frameworks, no build step,
no dependencies. Deploys as-is to GitHub Pages, Netlify or Vercel.

---

## 1. Folder structure

```
project/
├── index.html                  (not yet built)
├── about.html                  (not yet built)
├── portfolio.html               (not yet built)
├── case-studies.html            (not yet built)
├── consulting.html              (not yet built)
├── risk-management.html         (not yet built)
├── tools-frameworks.html        (not yet built)
├── contact.html                 (not yet built)
├── 404.html                     (not yet built)
├── robots.txt
├── sitemap.xml
├── manifest.json
├── README.md
│
├── assets/
│   ├── images/
│   │   ├── profile/             → the site's two personal photographs only
│   │   ├── logo/
│   │   ├── favicon/
│   │   ├── illustrations/
│   │   ├── portfolio/
│   │   └── case-studies/
│   └── icons/                   → local SVG icon sprites, if any are self-hosted
│
├── css/
│   ├── reset.css                → load 1st
│   ├── variables.css            → load 2nd — every design token
│   ├── typography.css           → load 3rd
│   ├── layout.css               → load 4th — grid, container, section rhythm
│   ├── components.css           → load 5th — nav, footer, buttons, cards, forms…
│   ├── animations.css           → load 6th — keyframes, reveal system
│   ├── utilities.css            → load 7th — single-purpose helper classes
│   └── pages/                   → one file per page, loaded 8th, page-specific only
│       └── (empty — filled in per page)
│
└── js/
    ├── utils.js                 → pure helper functions, no DOM side effects
    ├── navigation.js            → renders + controls the nav and mobile overlay
    ├── animations.js            → IntersectionObserver reveal, counters, scroll progress
    ├── components.js            → footer render, accordion, tabs, modal, toast, forms…
    ├── main.js                  → entry point, imported by every page
    └── pages/                   → one optional module per page, page-specific behavior only
        └── (empty — filled in per page)
```

---

## 2. How every page must be wired up

Every HTML page follows the same `<head>` and script pattern. Copy this
skeleton when building a new page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title — Kiana Kazemi</title>
  <meta name="description" content="…">
  <link rel="canonical" href="https://www.kianakazemi.com/PAGE.html">

  <!-- Open Graph / Twitter Card — every page sets its own -->
  <meta property="og:title" content="…">
  <meta property="og:description" content="…">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://www.kianakazemi.com/PAGE.html">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="assets/images/favicon/favicon.ico">
  <link rel="manifest" href="manifest.json">

  <!-- Global CSS — same order, every page, never reordered -->
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/typography.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/animations.css">
  <link rel="stylesheet" href="css/utilities.css">
  <!-- Page-specific CSS — last, and only for what this page uniquely needs -->
  <link rel="stylesheet" href="css/pages/PAGE.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="scroll-progress" data-scroll-progress></div>

  <div id="site-nav"></div>

  <main id="main">
    <!-- page content -->
  </main>

  <footer id="site-footer" class="footer"></footer>

  <!-- Global JS — always a module, always last, always in this order -->
  <script type="module" src="js/main.js"></script>
  <!-- Page-specific JS — only if this page needs unique behavior -->
  <script type="module" src="js/pages/PAGE.js"></script>
</body>
</html>
```

`main.js` automatically renders the navigation and footer into `#site-nav`
and `#site-footer`, wires up every component present on the page (accordions,
tabs, modals, copy buttons, form validation) and starts the scroll-reveal
system. A page needs **zero** JS of its own unless it has genuinely unique
behavior (e.g. a Risk Matrix page might need its own interaction logic) — in
that case, add a page module under `js/pages/`.

---

## 3. Design tokens — where things live

All tokens are CSS custom properties in `css/variables.css`. Never hardcode
a color, spacing value, radius or duration in a page or component file —
reference the token instead.

| Category | Examples | Notes |
|---|---|---|
| Color | `--color-bg`, `--color-accent`, `--color-text-secondary` | 70% black / 20% gray / 8% red / 2% white distribution |
| Spacing | `--space-8` … `--space-160` | 8px base rhythm |
| Typography | `--text-hero`, `--text-body`, `--weight-semibold` | fluid via `clamp()`, no per-breakpoint overrides needed |
| Radius | `--radius-sm` … `--radius-full` | cards use `--radius-xl` (24px) |
| Shadow | `--shadow-low` … `--shadow-overlay` | elevation scale |
| Motion | `--ease-standard`, `--duration-medium` | one easing curve for almost everything |

---

## 4. Component usage — reuse, never redesign

`css/components.css` and `js/components.js` define every reusable pattern:
navigation, footer, buttons (`.btn--primary/secondary/ghost/text`), cards
(`.card`, `.card--metric`, `.card--media`, `.card--empty`), badges, tags,
pills, accordion, tabs, tooltip, dropdown, modal, alert, toast, forms,
avatar, progress bar, timeline, diagram frame, KPI dashboard, skeleton
loaders and empty states.

A future page-building pass should **compose these**, not invent new class
names. If a page appears to need a new visual pattern, extend an existing
component (add a modifier class) rather than writing page-specific CSS for
a one-off look.

Naming convention: `component`, `component__part`, `component--variant`,
`.is-state` / `[aria-*]` for interaction state — e.g. `.card--metric`,
`.nav__link.is-active`, `[aria-expanded="true"]`.

---

## 5. Copy and content rules (for the page-building passes)

Content is generated from the Brand Foundation, Brand Personality & Tone of
Voice, and Content Rules documents already established for this project —
those are the source of truth for every headline, paragraph and CTA label.

Key constraints carried into every future page:

- Outcome-first, never feature-first. Never describe services — describe
  business problems, decisions and outcomes.
- Headlines: one idea, one promise, max 8 words, no buzzwords, no emojis,
  no exclamation marks.
- Paragraphs: 2–4 lines, max 60 words, one question answered per paragraph.
- Never use the banned word list (game-changing, revolutionary, leverage,
  transform, disruptive, world-class, etc.).
- CTAs: "Book Strategy Call," "Explore Portfolio," "View Case Study," "Let's
  Talk" — never "Hire Me," "Contact Today!!," "Click Here."
- No fabricated clients, metrics or testimonials. Use `Coming Soon`,
  `In Development` or `Concept Project` as honest placeholders.
- Exactly two personal photographs site-wide: one near the end of Home,
  one in the About "Who I Am" section. Never in a Hero.

---

## 6. Accessibility floor (non-negotiable on every page)

- Semantic HTML5, one `<h1>` per page, logical heading order.
- Visible focus state on every interactive element (`:focus-visible` is
  already styled globally — don't override it away).
- All interactive components are keyboard operable (nav overlay, accordion,
  tabs, modal all trap/return focus correctly out of the box).
- `prefers-reduced-motion` is respected globally in `reset.css` and again
  inside `animations.js` / `animations.css` — new motion must check it too.
- Minimum WCAG AA contrast; don't lighten `--color-text-muted` further.
- Minimum touch target 44×44px for anything tappable.

---

## 7. Performance rules

- Only animate `opacity`, `transform` and `filter` (already the only
  properties used across `animations.css` and `components.css`).
- Lazy-load below-the-fold images: `<img loading="lazy">`.
- Serve images as `.webp`, reference them by relative path — never inline
  Base64, never hotlink external URLs.
- No render-blocking scripts: all JS loads as `type="module"`, deferred by
  default.

---

## 8. What's intentionally NOT in this foundation yet

- No content pages (`index.html`, `about.html`, etc.) — built individually.
- No `css/pages/*.css` or `js/pages/*.js` content — created per page as needed.
- No real images — `assets/images/**` are empty, placeholder folders.
- No hidden landing pages (Founder Associate, Business Strategy, Consulting
  Landing, Venture) — built later, excluded from `sitemap.xml` and
  disallowed in `robots.txt` by design.

---

## 9. Local development

No build step is required. Because `main.js` uses native ES modules
(`import`/`export`), open pages through a local server rather than
`file://` — for example:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then visit `http://localhost:PORT/index.html`.
