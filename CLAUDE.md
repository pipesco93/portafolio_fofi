# Fofi Model Portfolio — CLAUDE.md

## Project Overview

High-end, minimalist model portfolio website. Built for a professional fashion model to showcase campaigns, attract brands and photographers, and make booking effortless. Aesthetic inspiration: [brittanycarel.com](https://www.brittanycarel.com/) — clean, editorial, light.

The site must communicate **premium quality and professionalism at a glance**, especially on mobile (where most agency scouts browse).

## Related Links

- **Live Site**: https://[YOUR-SITE-NAME].netlify.app ← update when connected
- **GitHub Repo**: https://github.com/[YOUR-USERNAME]/portafolio_fofi ← update when created
- **Netlify Dashboard**: https://app.netlify.com

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Vite + Vanilla JS** | Fast dev server, optimized production build, no framework bloat |
| Styling | **Vanilla CSS** (modular files) | Full control, zero overhead, easy to maintain |
| Animations | **GSAP** (via CDN or npm) | Industry-standard for buttery scroll reveals and parallax |
| Data | **`portfolio.json`** | Add new projects/prices without touching HTML |
| Hosting | **Netlify** (Free tier) | Continuous deploy from Git, 100 GB/month bandwidth, form handling |
| Version Control | **Git + GitHub** | Source of truth; Netlify auto-deploys on every push to `main` |
| Fonts | **Google Fonts CDN** | Cormorant Garamond (headers) + Inter (body) |
| Image Format | **WebP + JPEG fallback** | Best quality-to-size ratio for fashion photography |

---

## Image Strategy (Critical — Read Before Adding Photos)

This is a portfolio-heavy site. Images must be **stunning but web-optimized** or the site will be slow and Netlify bandwidth will be wasted.

### Rules
- **Source images**: Full-res originals stored locally only (never committed to Git)
- **Web images**: Optimized versions committed at exactly 2 sizes per image:
  - `*-large.webp` — 1600px wide, quality 85 (for desktop/lightbox)
  - `*-thumb.webp` — 600px wide, quality 80 (for grid thumbnails)
- **Max file size per image**: 400 KB large / 100 KB thumb
- **JPEG fallbacks**: Only if browser support for WebP is a concern (modern browsers: not needed)

### Optimization Workflow (one-time setup, then repeat per shoot)
```bash
# Install sharp-cli globally once
npm install -g sharp-cli

# Process a folder of raw JPEGs from a shoot
# Run from the project root
sharp -i "source-images/zara-campaign/*.jpg" -o "public/images/portfolio/zara-campaign/" --webp --width 1600 --quality 85
sharp -i "source-images/zara-campaign/*.jpg" -o "public/images/portfolio/zara-campaign/thumbs/" --webp --width 600 --quality 80
```

### GitHub Storage Note
GitHub free repos have a **1 GB soft limit** (5 GB hard). With the optimization rules above, each shoot (~20 images) = roughly 8–15 MB. This comfortably supports 50+ campaigns before needing to consider Git LFS or an image CDN.

**If the repo approaches 800 MB:** Migrate images to [Cloudinary free tier](https://cloudinary.com/) (25 GB storage free) and update `portfolio.json` image paths to Cloudinary URLs — no HTML changes needed.

---

## File Structure

```
portafolio_fofi/
├── index.html                    # Home page (hero, about, featured work, marquee, contact)
├── rates.html                    # Rates page (pricing by session type)
├── projects.html                 # All projects grid
├── project-detail.html           # Single project template (populated by JS from URL param)
├── 404.html                      # Custom 404 page
├── netlify.toml                  # Netlify build config and redirect rules
├── vite.config.js                # Vite config (build output to /dist)
├── package.json                  # Dependencies: vite, gsap
├── .gitignore                    # Ignores: node_modules, dist, .netlify, source-images/
├── CLAUDE.md                     # This file
│
├── public/                       # Copied as-is to /dist — not processed by Vite
│   └── images/
│       ├── hero.webp             # Home hero full-bleed image
│       ├── about.webp            # About section portrait
│       ├── brands/               # Brand logos (SVG preferred, PNG fallback)
│       │   ├── zara.svg
│       │   └── mango.svg
│       └── portfolio/            # One subfolder per project/campaign
│           ├── zara-campaign/
│           │   ├── cover.webp         # Used as grid thumbnail (600px)
│           │   ├── 01-large.webp
│           │   ├── 02-large.webp
│           │   └── thumbs/            # 600px versions for grid
│           │       ├── 01.webp
│           │       └── 02.webp
│           └── mango-ss25/
│               └── ...
│
└── src/
    ├── main.js                   # Entry point: imports all modules
    │
    ├── data/
    │   ├── portfolio.json        # All project metadata + image lists
    │   └── rates.json            # All pricing tiers and items
    │
    ├── styles/
    │   ├── variables.css         # Design tokens (colors, fonts, spacing, breakpoints)
    │   ├── global.css            # Reset, base typography, body, ::selection
    │   ├── layout.css            # Nav, footer, containers, grid systems
    │   ├── components.css        # Buttons, cards, marquee, modal, form
    │   └── animations.css        # Keyframes, transition utilities, cursor
    │
    └── js/
        ├── animations.js         # GSAP: scroll reveals, parallax, page transitions
        ├── marquee.js            # Brand logo infinite scroll
        ├── cursor.js             # Custom cursor (desktop only)
        ├── projectGrid.js        # Renders projects.html grid from portfolio.json
        ├── projectDetail.js      # Renders project-detail.html from URL ?id= param
        ├── rates.js              # Renders rates.html from rates.json
        └── contact.js            # Contact form submission (Netlify Forms)
```

---

## Data Files

### `src/data/portfolio.json` — Structure

```json
{
  "projects": [
    {
      "id": "zara-campaign",
      "title": "Zara — Spring Campaign",
      "brand": "Zara",
      "year": "2024",
      "category": "Editorial",
      "tags": ["fashion", "editorial", "commercial"],
      "featured": true,
      "coverImage": "/images/portfolio/zara-campaign/cover.webp",
      "description": "Spring/Summer 2024 campaign shot in Barcelona. Wardrobe by Zara Studio.",
      "images": [
        "/images/portfolio/zara-campaign/01-large.webp",
        "/images/portfolio/zara-campaign/02-large.webp"
      ],
      "photographer": "Juan García",
      "location": "Barcelona, Spain"
    }
  ],
  "brands": [
    { "name": "Zara", "logo": "/images/brands/zara.svg" },
    { "name": "Mango", "logo": "/images/brands/mango.svg" }
  ]
}
```

**To add a new project:** Add a new object to the `projects` array. Set `"featured": true` to show it in the home page Featured Work section (max 4 featured at a time).

### `src/data/rates.json` — Structure

```json
{
  "currency": "USD",
  "note": "All rates are starting prices. Final quote depends on project scope and usage rights.",
  "categories": [
    {
      "id": "hourly",
      "title": "Hourly Rate",
      "icon": "clock",
      "items": [
        { "label": "First hour (minimum)", "price": 150 },
        { "label": "Each additional hour", "price": 120 }
      ]
    },
    {
      "id": "day-rate",
      "title": "Full Day",
      "icon": "sun",
      "items": [
        { "label": "Half day (4 hrs)", "price": 500 },
        { "label": "Full day (8 hrs)", "price": 900 }
      ]
    },
    {
      "id": "makeup",
      "title": "Hair & Makeup",
      "icon": "star",
      "items": [
        { "label": "Basic glam", "price": 80 },
        { "label": "Editorial / full look", "price": 150 }
      ]
    },
    {
      "id": "usage",
      "title": "Usage Rights",
      "icon": "globe",
      "items": [
        { "label": "Personal / lookbook", "price": 0, "note": "Included" },
        { "label": "Social media (1 year)", "price": 200 },
        { "label": "Commercial / print", "price": "Quote" },
        { "label": "Exclusive buyout", "price": "Quote" }
      ]
    }
  ]
}
```

---

## Page Architecture

### `index.html` — Home (Main Page)

1. **Nav** — Logo left, links right: Work · Rates · Contact. Mobile: hamburger menu
2. **Hero** — Full-screen image, model name in large serif type, subtle scroll indicator. Text fades in on load via GSAP
3. **About Strip** — Two-column: editorial photo left, short punchy bio right. "Available for editorial, commercial, and brand campaigns."
4. **Featured Work** — Asymmetric 2×2 grid (4 projects where `featured: true`). Each card: image fills card, project title + brand overlays on hover. Click → `project-detail.html?id=zara-campaign`
5. **Brand Marquee** — Infinite horizontal scroll of brand logos. Pauses on hover
6. **CTA Block** — Full-width off-white panel: "Let's create something." + email button + "View all work" link
7. **Footer** — Logo, nav links, Instagram icon, copyright

### `rates.html` — Rates Page

1. **Nav** — Same as all pages
2. **Hero** — Minimal: page title "Rates & Availability", short subtitle
3. **Rates Grid** — Rendered from `rates.json`. Each category = a card. Pricing table within each card
4. **Note** — Small text: "All rates negotiable for long-term collaborations. Rates do not include travel."
5. **CTA** — "Request a custom quote" → scrolls to contact form or mailto
6. **Inline Contact Form** — Name, Email, Project type (dropdown), Message. Handled by Netlify Forms
7. **Footer**

### `projects.html` — All Projects Grid

1. **Nav**
2. **Page Header** — "Work" title + optional filter tabs: All · Editorial · Commercial · Campaigns
3. **Masonry/Grid** — Rendered from `portfolio.json`. Mobile: 1 col. Tablet: 2 col. Desktop: 3 col. Each card: cover image, brand name, category tag. Click → project detail
4. **Footer**

### `project-detail.html` — Single Project Page

One HTML file. JS reads `?id=` URL param, fetches matching project from `portfolio.json`, and populates the page.

1. **Nav**
2. **Project Header** — Brand name (large), campaign title, year, location, photographer credit
3. **Hero Image** — First image full-width
4. **Gallery** — Remaining images in a 2-col staggered layout with GSAP scroll reveals
5. **Description** — Short paragraph of context text from `portfolio.json`
6. **Next/Prev Navigation** — "← Previous Project" and "Next Project →" to browse sequentially
7. **CTA** — "Interested in working together?" → contact
8. **Footer**

### `404.html` — Custom 404

Simple, on-brand. Model photo, "Page not found", link back home.

---

## Design System

### Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#faf9f7` | Page background (warm off-white) |
| `--color-bg-alt` | `#f0ede8` | Alternate sections, cards |
| `--color-surface` | `#ffffff` | Cards, nav background |
| `--color-text` | `#1a1a1a` | Body text |
| `--color-text-muted` | `#8a8580` | Captions, labels, metadata |
| `--color-accent` | `#a08060` | Hover states, accents (warm brown) |
| `--color-accent-light` | `#c9b89a` | Decorative lines, dividers |
| `--color-border` | `#e8e4df` | Card borders, section dividers |

### Typography

```css
/* Variables */
--font-serif: 'Cormorant Garamond', Georgia, serif;   /* All headers, hero text */
--font-sans:  'Inter', system-ui, sans-serif;          /* Body, nav, labels */

/* Scale */
--text-xs:   0.75rem;    /* 12px — captions, tags */
--text-sm:   0.875rem;   /* 14px — labels, small body */
--text-base: 1rem;       /* 16px — body */
--text-lg:   1.25rem;    /* 20px — intro text */
--text-xl:   2rem;       /* 32px — section headers */
--text-2xl:  3.5rem;     /* 56px — page heroes */
--text-hero: clamp(3rem, 10vw, 7rem); /* Responsive hero type */
```

### Spacing

All spacing via CSS custom properties to keep rhythm consistent:
```css
--space-xs:  0.5rem;
--space-sm:  1rem;
--space-md:  2rem;
--space-lg:  4rem;
--space-xl:  8rem;
--space-2xl: 12rem;
```

### Corner Radii

Editorial minimal — almost no rounding:
- Default: `2px`
- Cards: `4px`
- Buttons: `2px` (near-square)
- **No pill shapes anywhere**

### Breakpoints (Mobile-First)

```css
/* Variables defined in variables.css */
--bp-sm:  480px;   /* Large phones */
--bp-md:  768px;   /* Tablets */
--bp-lg:  1024px;  /* Laptops */
--bp-xl:  1280px;  /* Desktops */
--bp-2xl: 1600px;  /* Wide screens */
```

Media queries always written mobile-first:
```css
/* Mobile (default — no query) */
.grid { grid-template-columns: 1fr; }

/* Tablet up */
@media (min-width: 768px) {
  .grid { grid-template-columns: 1fr 1fr; }
}

/* Desktop up */
@media (min-width: 1024px) {
  .grid { grid-template-columns: 1fr 1fr 1fr; }
}
```

---

## Mobile-First Requirements

Every component must be designed for mobile first. Key rules:

- **Touch targets**: Minimum 48×48px for all interactive elements
- **Nav**: Hamburger on mobile, horizontal links on desktop (≥768px)
- **Hero text**: Uses `clamp()` — never overflows on small screens
- **Images**: Always `width: 100%; height: auto;` with `object-fit: cover` in fixed containers
- **Grid**: Always 1 column on mobile, never force horizontal scroll
- **Tap gestures**: Image gallery swipeable on mobile (use touch events or a minimal library like Swiper)
- **No hover-only interactions**: Anything revealed on hover must also be accessible on tap
- **Font sizes**: Minimum 16px body text on mobile (prevents iOS auto-zoom on inputs)
- **Contact form inputs**: Font-size ≥16px on all `<input>` and `<textarea>` (iOS rule)

---

## Animation Guidelines (GSAP)

### Scroll Reveals (used on all sections)
```js
gsap.from(".reveal", {
  scrollTrigger: { trigger: ".reveal", start: "top 85%" },
  y: 40,
  opacity: 0,
  duration: 0.9,
  ease: "power2.out",
  stagger: 0.15
});
```

### Hero Text Entrance (index.html only)
```js
gsap.from(".hero-title", { y: 60, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.3 });
gsap.from(".hero-sub",   { y: 30, opacity: 0, duration: 1,   ease: "power3.out", delay: 0.6 });
```

### Image Parallax (desktop only — skip on mobile for performance)
```js
if (window.matchMedia("(min-width: 1024px)").matches) {
  gsap.to(".parallax-img", {
    scrollTrigger: { trigger: ".parallax-img", scrub: 1 },
    y: -60
  });
}
```

### Page Transitions
Simple fade: outgoing page fades out (0.3s), new page fades in (0.4s). Use `sessionStorage` to flag first-load vs navigation.

### Rules
- Never animate things that aren't in the viewport
- All animations must respect `prefers-reduced-motion`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
  ```

---

## Git Workflow

### Branch Convention

| Branch | Purpose |
|---|---|
| `main` | Production — auto-deploys to Netlify |
| `feature/[page-name]` | New pages or major features |
| `fix/[description]` | Bug fixes |
| `content/[project-name]` | Adding new portfolio projects |

### Daily Flow
```bash
# Start new work
git checkout -b feature/rates-page

# Work, then commit often
git add .
git commit -m "feat: add rates grid with pricing cards"

# Push and open PR (or merge directly if solo)
git push origin feature/rates-page
git checkout main
git merge feature/rates-page
git push origin main
# Netlify auto-deploys within ~30 seconds
```

### Adding a New Project (Content Workflow)
```bash
git checkout -b content/zara-spring-2025

# 1. Optimize images and place in public/images/portfolio/zara-spring-2025/
# 2. Add project entry to src/data/portfolio.json
# 3. Test locally: npm run dev

git add .
git commit -m "content: add Zara Spring 2025 campaign"
git checkout main
git merge content/zara-spring-2025
git push origin main
```

### IMPORTANT: Never Commit These
- `node_modules/` — auto-ignored
- `dist/` — Netlify builds this itself
- `source-images/` — raw unoptimized originals, too large
- `.env` — never needed here, but good habit

---

## Netlify Setup

### `netlify.toml` (place at project root)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/project/:id"
  to = "/project-detail.html"
  status = 200

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

### Netlify Forms (Contact Form)

Add `netlify` attribute to any `<form>` tag:
```html
<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="contact" />
  <input type="hidden" name="bot-field" />
  <!-- fields -->
</form>
```
No backend needed. Submissions arrive in the Netlify dashboard. Free tier: 100 submissions/month.

### Connecting GitHub → Netlify (one-time)
1. Push repo to GitHub
2. Netlify dashboard → "Add new site" → "Import from Git" → Select repo
3. Build command: `npm run build` / Publish directory: `dist`
4. Deploy. Every future `git push origin main` auto-deploys.

---

## Local Development

```bash
# Install dependencies (first time only)
npm install

# Start dev server (hot reload)
npm run dev
# Opens at http://localhost:5173

# Production build (test before pushing)
npm run build
npm run preview
# Opens at http://localhost:4173
```

---

## Common Tasks

### Update Model's Bio or Contact Info
Edit the relevant section directly in `index.html`. Wrapped in a `<!-- BIO -->` comment for quick find.

### Change Accent Color
In `src/styles/variables.css`:
```css
--color-accent: #a08060;        /* Change this */
--color-accent-light: #c9b89a;  /* And this */
```

### Update Prices
Edit `src/data/rates.json`. The rates page renders from this file automatically.

### Add a Project to Featured Work (Home Page)
In `portfolio.json`, set `"featured": true` on the project. Max 4 featured projects display on home. If more than 4 are marked featured, the most recent 4 (by order in array) show.

### Add New Brand Logo to Marquee
1. Add `logo.svg` (or `.png`) to `public/images/brands/`
2. Add entry to `portfolio.json` under `"brands"` array

### Change Hero Image
Replace `public/images/hero.webp`. Must be at least 2000px wide, optimized to under 500 KB.

### Update Social Links
Search for `<!-- SOCIAL -->` in `index.html` and `rates.html`. Links are in the footer and CTA sections.

---

## Performance Targets

These should be verified in Chrome DevTools Lighthouse before each major deploy:

| Metric | Target |
|---|---|
| Performance score | ≥ 90 |
| LCP (Largest Contentful Paint) | < 2.5s |
| CLS (Cumulative Layout Shift) | < 0.1 |
| First image load | < 1s on fast 3G |
| Mobile score | ≥ 85 |

### Key Optimizations Already Built In
- Hero image uses `<link rel="preload">` in `<head>`
- All portfolio images use `loading="lazy"` + `decoding="async"`
- Fonts preloaded with `display=swap`
- GSAP loaded only after DOM ready
- CSS split into modules (Vite tree-shakes unused styles in build)

---

## Notes & Rules

- **Mobile first, always** — Write the mobile CSS rule first, then add `@media (min-width: ...)` for larger screens
- **No pills or heavy rounding** — The aesthetic is editorial and minimal, not bubbly
- **Serif for emotion, sans for clarity** — Headers in Cormorant Garamond, body/UI in Inter
- **White space is content** — Don't fill every section. Let images breathe
- **`project-detail.html` is a single file** — JS populates it from `?id=` param. Do not create separate HTML files per project
- **Test on a real phone** — Use `npm run dev` and access via your local network IP on an actual mobile device before every push
- **Netlify builds from `main` only** — Never push broken code directly to main; use feature branches
- **Keep `portfolio.json` as the single source of truth** — never hardcode project data in HTML
