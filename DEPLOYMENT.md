# Deployment Guide — Kiana Kazemi Website

This document covers everything needed to take the current production-ready
codebase live on GitHub Pages, connect the custom domain, set up search
engines and analytics, replace remaining placeholder content, and keep the
site healthy afterward.

This is a pure HTML5 / CSS3 / vanilla JavaScript site. No build step, no
package manager, no dependencies. What's in the repository is exactly what
gets deployed.

---

## Project Structure

```
project/
├── index.html                   Home
├── about.html                   About
├── portfolio.html                Portfolio
├── case-studies.html             Case Studies
├── consulting.html               Consulting
├── risk-management.html          Strategic Risk Management
├── tools-frameworks.html         Tools & Frameworks
├── contact.html                  Contact
├── 404.html                      Not-found page (served automatically by GitHub Pages)
├── robots.txt                    Crawler rules + sitemap reference
├── sitemap.xml                   Indexable page list for search engines
├── manifest.json                 Web app manifest (icons, theme color, install metadata)
├── browserconfig.xml             Windows pinned-tile configuration
├── .nojekyll                     Disables GitHub Pages' Jekyll processing
├── DEPLOYMENT.md                 This file
│
├── assets/
│   ├── images/
│   │   ├── profile/              Two personal photographs go here (see Content Replacement Guide)
│   │   ├── favicon/               Generated favicon package (svg, ico, png, apple-touch-icon)
│   │   ├── logo/                  Empty — reserved for a self-hosted logo file, if ever needed
│   │   ├── illustrations/         Empty — reserved for background/decorative graphics
│   │   ├── portfolio/             Empty — project cover images go here
│   │   └── case-studies/          Empty — case study cover images go here
│   ├── icons/                    Empty — reserved for self-hosted SVG icon sprites
│   └── documents/                Empty — the resume PDF goes here
│
├── css/
│   ├── reset.css                 Browser-default normalization only
│   ├── variables.css             Every design token (color, spacing, type, radius, motion)
│   ├── typography.css            Base type scale
│   ├── layout.css                Container, grid, section rhythm, skip-link, scroll progress
│   ├── components.css            Every reusable component (nav, footer, buttons, cards, etc.)
│   ├── animations.css            Scroll-reveal system and keyframes
│   ├── utilities.css             Single-purpose helper classes
│   └── pages/                    One file per page, page-specific composition only
│
└── js/
    ├── utils.js                  Pure helper functions
    ├── navigation.js              Mobile nav overlay, sticky-scroll state
    ├── animations.js              Scroll-reveal, scroll-progress bar, counters
    ├── components.js              Shared component wiring (accordion)
    ├── main.js                    Entry point, imported by every page
    └── pages/                     One optional module per page, page-specific behavior only
```

### Purpose of each major directory

- **Root (`/`)** — every HTML page plus the crawler/PWA/deployment config files (`robots.txt`, `sitemap.xml`, `manifest.json`, `browserconfig.xml`, `.nojekyll`). GitHub Pages serves this folder directly as the site root.
- **`assets/`** — all binary/media files. Nothing in here is code; it's safe to add, replace, or remove files without touching HTML/CSS/JS logic (paths are already wired up).
- **`css/`** — the design system. Global files load in a fixed order (reset → variables → typography → layout → components → animations → utilities) on every page; `css/pages/*.css` adds only page-specific composition on top.
- **`js/`** — the behavior system. Global modules are imported by `main.js` and run on every page; `js/pages/*.js` exists only for the handful of pages with genuinely unique interactivity (Home's badge marquee, About's timeline highlighting, Portfolio's sticky tabs, Case Studies' tab-switching/filtering, Risk Management's interactive matrix). Consulting and Tools & Frameworks have no page script — they need none.

---

## GitHub Pages Deployment

### Repository setup

1. Create a new GitHub repository (e.g. `kiana-kazemi-website`). It can be public or private — GitHub Pages works with both on paid plans; on the free plan, Pages publishing from a private repo is also supported for personal accounts.
2. Clone it locally, or use GitHub's "Add file → Upload files" in the browser for a one-time upload.
3. Copy every file and folder listed in **Project Structure** above into the repository root — not into a subfolder. `index.html` must sit directly at the repo root.
4. Commit and push:
   ```bash
   git add .
   git commit -m "Initial production deployment"
   git push origin main
   ```

### Branch configuration

- Use a single primary branch — `main` — as the source of truth.
- GitHub Pages can publish either from a branch root or from a `/docs` folder. This project publishes from the branch root (`/`), since there's no build step producing a separate output folder.
- Optional but recommended: protect `main` (Settings → Branches → Branch protection rules) once the site is live, so changes go through a pull request rather than direct pushes.

### GitHub Pages settings

1. In the repository, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Under **Branch**, choose `main` and folder `/ (root)`. Save.
4. GitHub will build and publish the site at `https://<username>.github.io/<repository-name>/` within a minute or two. A green checkmark and URL will appear at the top of the Pages settings screen once it's live.

### First deployment

1. After enabling Pages (above), wait for the first deployment to finish — check the **Actions** tab for the "pages build and deployment" workflow to complete.
2. Visit the published URL and click through every nav link, footer link, and CTA to confirm nothing 404s.
3. Confirm `robots.txt` and `sitemap.xml` load correctly at `/robots.txt` and `/sitemap.xml`.
4. Confirm the favicon appears in the browser tab and `/manifest.json` loads without a JSON error (open it directly in the browser — it should pretty-print, not download).

### Updating the website

Because there's no build step, updates are just file edits, commit, and push:

```bash
git add .
git commit -m "Describe the change"
git push origin main
```

GitHub Pages automatically rebuilds and redeploys on every push to the configured branch — typically live within 1–2 minutes. There's no separate "deploy" command to run.

---

## Custom Domain

The site's canonical URLs, sitemap, and structured data are already written
for **`www.kianakazemi.com`**. To make that domain live:

### GitHub Pages custom domain setup

1. In **Settings → Pages → Custom domain**, enter `www.kianakazemi.com` and save.
2. GitHub will create a `CNAME` file at the repository root automatically (or create it manually with the single line `www.kianakazemi.com` if it doesn't appear).
3. Once DNS (below) is verified, check **Enforce HTTPS** in the same settings panel.

### DNS records

At your domain registrar or DNS provider, configure:

| Type | Host | Value | Purpose |
|---|---|---|---|
| CNAME | `www` | `<username>.github.io` | Points `www.kianakazemi.com` to GitHub Pages |
| A | `@` (apex) | `185.199.108.153` | Apex domain → GitHub Pages (IPv4) |
| A | `@` (apex) | `185.199.109.153` | Apex domain → GitHub Pages (IPv4) |
| A | `@` (apex) | `185.199.110.153` | Apex domain → GitHub Pages (IPv4) |
| A | `@` (apex) | `185.199.111.153` | Apex domain → GitHub Pages (IPv4) |
| AAAA | `@` (apex) | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` | Apex domain → GitHub Pages (IPv6, optional but recommended) |

Add a redirect (or an `apex → www` A/ALIAS setup, depending on the registrar) so visitors landing on the bare `kianakazemi.com` are forwarded to `www.kianakazemi.com`, matching the canonical URLs already in every page's `<head>`.

### HTTPS configuration

- DNS propagation typically takes anywhere from a few minutes to 24 hours.
- Once GitHub verifies the domain, it automatically provisions a free TLS certificate via Let's Encrypt.
- Return to **Settings → Pages** and enable **Enforce HTTPS** as soon as the checkbox becomes available (it's grayed out until the certificate is issued).
- After enforcing HTTPS, verify every internal link still works — this project uses relative paths throughout, so no link changes are needed.

---

## Cloudflare (Optional)

Cloudflare in front of GitHub Pages is optional — GitHub Pages already
serves over HTTPS with a CDN. Use Cloudflare if you want more control over
caching, redirects, or additional security features.

### DNS configuration

1. Add `kianakazemi.com` as a site in Cloudflare.
2. Update the domain's nameservers at the registrar to the two Cloudflare nameservers provided.
3. Recreate the same DNS records listed above (`www` CNAME to `<username>.github.io`, apex A/AAAA records to GitHub's IPs) inside Cloudflare's DNS panel.
4. Set the `www` and apex records to **Proxied** (orange cloud) if you want Cloudflare's CDN/caching/security layer active; set to **DNS only** (gray cloud) if you just want Cloudflare as a DNS host with GitHub handling everything else.

### SSL mode

- Set SSL/TLS mode to **Full (strict)**. GitHub Pages presents a valid certificate, so strict validation works correctly and avoids the redirect loops that "Flexible" mode can cause.
- Enable **Always Use HTTPS** under SSL/TLS → Edge Certificates.
- Enable **Automatic HTTPS Rewrites**.

### Performance recommendations

- Enable **Auto Minify** for HTML, CSS and JS (Speed → Optimization). This is a safe additional pass on top of the already-hand-optimized code.
- Enable **Brotli** compression (on by default on most plans).
- Enable **Early Hints** if available on your plan.
- Leave **Rocket Loader** off — this site's JavaScript is already minimal, deferred via `type="module"`, and order-sensitive (`main.js` before page scripts); Rocket Loader's script reordering can interfere with that.

### Caching recommendations

- Set a **Browser Cache TTL** of at least 4 hours for HTML, and a long TTL (30 days+) for `/css/*`, `/js/*`, and `/assets/*` via a Cache Rule, since none of these files are versioned/hashed — plan to hard-refresh or bump a query string (e.g. `styles.css?v=2`) after major CSS/JS updates if long caching is enabled.
- Add a Cache Rule to bypass cache for `sitemap.xml` and `robots.txt` (or keep their TTL short) so search engines always see the latest version.

---

## Search Engine Setup

### Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console) and add a property for `https://www.kianakazemi.com`.
2. Verify ownership — the simplest method here is **HTML tag verification**: Google gives you a `<meta name="google-site-verification" content="...">` tag to paste into the `<head>` of `index.html`, or a DNS TXT record if you'd rather verify at the domain level and avoid editing the site.
3. Once verified, submit the sitemap (see below).

### Bing Webmaster Tools

1. Go to [bing.com/webmasters](https://www.bing.com/webmasters) and add `https://www.kianakazemi.com`.
2. Bing Webmaster Tools offers an **import from Google Search Console** option — fastest path if Search Console is already verified.
3. Otherwise, verify via the same HTML meta tag or DNS TXT record method as Google.

### Sitemap submission

- In Google Search Console: **Sitemaps** (left nav) → enter `sitemap.xml` → Submit.
- In Bing Webmaster Tools: **Sitemaps** → **Submit sitemap** → enter `https://www.kianakazemi.com/sitemap.xml`.
- The sitemap already lists all 8 indexable pages (Home, About, Portfolio, Case Studies, Consulting, Risk Management, Tools & Frameworks, Contact) with `lastmod`, `changefreq`, and `priority` values.

### robots.txt verification

- Confirm it's reachable at `https://www.kianakazemi.com/robots.txt`.
- In Google Search Console, use **Settings → robots.txt** (or the URL Inspection tool) to confirm Google is reading the file without errors.
- The file currently allows all crawling except four intentionally hidden landing pages (`/founder-associate.html`, `/business-strategy.html`, `/consulting-landing.html`, `/venture.html`) reserved for targeted outreach — these are not yet built, so there's nothing to verify there until they exist.

---

## Analytics

### Google Analytics 4 integration

GA4 is **not yet added** to the codebase. To add it:

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com) and get your Measurement ID (format `G-XXXXXXXXXX`).
2. Add the standard GA4 snippet to the `<head>` of every page, immediately after the existing JSON-LD `<script>` block, before `</head>`:

   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

3. Because this snippet must be identical on all 9 pages (including `404.html`), the least error-prone approach is a find-and-replace across every HTML file rather than editing each by hand.
4. This is the one external script the site will load — everything else is self-hosted, so it's worth being deliberate about it. Keep `async` on the loader script so it never blocks rendering.

### Verification checklist

- [ ] Open the live site in an incognito window with GA4's **Realtime** report open — confirm your own visit registers.
- [ ] Click through to each of the 8 pages and confirm each pageview registers as a distinct page in Realtime.
- [ ] Test at least one outbound click (Calendly, WhatsApp, or email link) if you plan to track outbound clicks as events — GA4 does this automatically for enhanced measurement if enabled on the property (Admin → Data Streams → your stream → toggle **Outbound clicks**).
- [ ] Confirm the Measurement ID in the snippet matches the property in GA4 exactly — a mismatched ID silently sends no data with no error.
- [ ] Wait 24–48 hours and check the standard reports (not just Realtime) populate correctly.

---

## Content Replacement Guide

Every placeholder below is intentional — the project's content rules
explicitly prohibit fabricated photos, documents, clients, or metrics. This
is the map of what to swap in, and where.

### Profile photos

- **Location 1:** `assets/images/profile/profile-home.webp` — referenced by `index.html`, shown near the end of the homepage (Personal Philosophy section).
- **Location 2:** `assets/images/profile/profile-about.webp` — referenced by `about.html`, shown in the "Who I Am" section.
- Format: `.webp`, roughly a 4:5 portrait aspect ratio (the CSS expects `width="640" height="800"`). Convert with any image tool or `cwebp` before uploading.
- No other page should ever contain a personal photograph — this is a hard rule in the design system (never in a Hero, never anywhere else on the site).
- These same files are referenced by the `og:image` tag on Home and About — until they're added, social share previews for those two pages will show a broken image.

### Resume PDF

- **Location:** `assets/documents/kiana-kazemi-resume.pdf` — referenced twice on `about.html` (Download Resume button and View Online Resume link) and once in the Hero.
- Keep the filename exactly as referenced, or update the three `href` attributes in `about.html` if the filename changes.

### Portfolio images

- **Location:** `assets/images/portfolio/` — currently empty.
- Referenced by the `card__media` placeholder divs on `index.html` (Selected Portfolio) and throughout `portfolio.html`'s per-category "Selected Work" sections.
- These are currently styled `<div data-image-placeholder>` blocks, not `<img>` tags — swapping in real images means replacing each placeholder div with an `<img>` element (matching the existing `.card__media` sizing/`border-radius`) once real project covers exist. Until real projects exist to show, the current "Concept Project" placeholder cards are the intentionally correct state.

### Case study images

- **Location:** `assets/images/case-studies/` — currently empty.
- `case-studies.html` currently has no image slots at all (the five case study panels are text/structure only, per the "do not invent projects" instruction). If case study cover images are wanted later, they'd be added to each panel's Project Overview section.

### Contact information

Already live and correct throughout the site — no placeholder remains:

- **Email:** `kianakazemi04@gmail.com`
- **Location:** Istanbul, Türkiye

If any of these ever change, they appear in multiple places: the footer (identical on all 9 pages), `contact.html`, the JSON-LD schema blocks in `index.html`/`about.html`/`contact.html`, and `manifest.json`'s description. A project-wide find-and-replace is the safest way to update consistently.

### Social links

- **LinkedIn:** `https://www.linkedin.com/in/kianakazemi04?utm_source=share_via&utm_content=profile&utm_medium=member_ios` — appears in the footer (all pages) and on `contact.html`.

### Calendly

- **Current link:** `https://calendly.com/kianakazemi04/30min`
- Appears as the primary CTA target across every page's "Book Strategy Call" buttons (which link to `contact.html#calendly`, which itself links out to the real Calendly URL) and directly in the footer and `contact.html`.
- To change the Calendly link, only `contact.html` and the footer need editing — every other page routes through `contact.html#calendly` rather than linking to Calendly directly, so there's a single source of truth.

### WhatsApp

- **Current link:** `https://wa.me/message/TBNKY7AHI7MPF1`
- Appears in the footer (all pages) and in Final CTA sections on Home, Portfolio, Consulting, Risk Management, and Contact.
- No page-JS depends on this value — it's a plain link, safe to find-and-replace project-wide.

---

## Production Checklist

Pre-launch, confirm every item below:

- [ ] All 9 HTML files present at repo root (`index.html` through `404.html`)
- [ ] `robots.txt`, `sitemap.xml`, `manifest.json`, `browserconfig.xml`, `.nojekyll` present at repo root
- [ ] Full `css/` and `js/` folder structure present and untouched
- [ ] `CNAME` file present (once custom domain is configured) containing exactly `www.kianakazemi.com`
- [ ] GitHub Pages source set to `main` branch, `/ (root)` folder
- [ ] Site loads at the GitHub Pages URL with no console errors
- [ ] Every nav link, footer link, and CTA button clicked through with no 404s
- [ ] Favicon visible in browser tab; `manifest.json` loads without error
- [ ] DNS records configured and propagated (`dig www.kianakazemi.com` resolves to GitHub's IPs)
- [ ] Custom domain verified in GitHub Pages settings
- [ ] **Enforce HTTPS** enabled
- [ ] Profile photos uploaded (or explicitly deferred — not a launch blocker, but note it)
- [ ] Resume PDF uploaded (or explicitly deferred)
- [ ] GA4 snippet added and verified in Realtime (see Analytics section)
- [ ] Google Search Console property verified
- [ ] Bing Webmaster Tools property verified
- [ ] Sitemap submitted to both search consoles
- [ ] Tested on at least one real mobile device (not just browser devtools) for the nav overlay, accordions, and the Risk Management interactive matrix
- [ ] Tested with a screen reader on at least the Home and Contact pages (skip link, nav landmarks, form/button labels)
- [ ] Tested with `prefers-reduced-motion` enabled — reveal animations and the scroll-progress bar should be inert but content should remain fully visible

---

## Post-Launch Checklist

### First 24–48 hours

- [ ] Confirm HTTPS certificate is active and there's no mixed-content warning
- [ ] Re-check all internal links from the live custom domain (not just the GitHub Pages URL) — relative paths should behave identically, but confirm
- [ ] Confirm GA4 is receiving standard (non-Realtime) report data
- [ ] Run a Lighthouse audit (Chrome DevTools → Lighthouse, or [PageSpeed Insights](https://pagespeed.web.dev)) against the live URL for each page and record baseline scores
- [ ] Check `https://www.kianakazemi.com/sitemap.xml` and `/robots.txt` are reachable over the final domain, not just GitHub's default URL

### First 1–2 weeks

- [ ] In Google Search Console, check the **Coverage** report — confirm all 8 real pages are indexed and the 4 disallowed hidden pages are correctly excluded
- [ ] Check **Core Web Vitals** report once enough real-user data accumulates
- [ ] Search `site:kianakazemi.com` on Google to confirm indexing is progressing
- [ ] Check social share previews (paste the homepage URL into a fresh LinkedIn post draft or Twitter/X compose box, then discard) to confirm OG tags render correctly — this will also surface the missing `og:image` issue if photos haven't been uploaded yet
- [ ] Verify no crawl errors are reported in either Search Console or Bing Webmaster Tools

---

## Maintenance Checklist

### Monthly

- [ ] Click through every nav link, footer link, and CTA once, end to end
- [ ] Confirm Calendly, WhatsApp, and email links still work (Calendly links can expire or be reconfigured independently of this codebase)
- [ ] Check Google Search Console for new crawl errors or manual actions
- [ ] Check GA4 for traffic anomalies (sudden drops usually indicate a broken page or tracking issue, not just fewer visitors)
- [ ] Skim `sitemap.xml`'s `lastmod` dates — update any that have gone stale if content on that page changed

### Quarterly

- [ ] Re-run Lighthouse on all 9 pages and compare against the post-launch baseline
- [ ] Re-check WCAG contrast if any new accent-colored text was added — the project's `--color-accent-text` token exists specifically because the base accent fails AA on card surfaces; make sure any new component reuses it correctly rather than the base `--color-accent`
- [ ] Review whether any of the four hidden landing pages (Founder Associate, Business Strategy, Consulting Landing, Venture) are ready to be built and added to `sitemap.xml`/removed from `robots.txt`'s disallow list
- [ ] Confirm the SSL certificate (GitHub-issued or Cloudflare-issued) hasn't triggered any renewal warning emails
- [ ] Spot-check the site on an actual mobile device again, not just devtools emulation

### Yearly

- [ ] Update the footer copyright year (currently `© 2026 Kiana Kazemi. All Rights Reserved.` — hardcoded identically across all 9 pages, so this requires a project-wide find-and-replace)
- [ ] Full accessibility pass: keyboard-only navigation through every page, screen reader spot-check, reduced-motion check
- [ ] Review and refresh meta descriptions/OG copy if positioning or services have evolved
- [ ] Re-verify domain registration and DNS records haven't lapsed or drifted
- [ ] Reassess whether the site still needs Cloudflare (if adopted) or whether GitHub Pages' native HTTPS/CDN is sufficient on its own
- [ ] Full content audit against the Brand Foundation / Content Rules documents — confirm no placeholder text ("Coming Soon", "…", "Concept Project") has quietly become permanent where it shouldn't have
