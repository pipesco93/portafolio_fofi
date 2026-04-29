# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

High-end, minimalist model portfolio website. Built for a professional fashion model to showcase campaigns, attract brands and photographers, and make booking effortless. Aesthetic inspiration: [brittanycarel.com](https://www.brittanycarel.com/) — clean, editorial, light.

The site must communicate **premium quality and professionalism at a glance**, especially on mobile (where most agency scouts browse).

## Related Links

- **Live Site**: https://[YOUR-SITE-NAME].netlify.app ← update when connected
- **GitHub Repo**: https://github.com/pipesco93/portafolio_fofi
- **Netlify Dashboard**: https://app.netlify.com

---

## Commands

```bash
npm install        # First-time setup
npm run dev        # Dev server at http://localhost:3000 (auto-opens)
npm run build      # Production build → dist/
npm run preview    # Preview built site at http://localhost:4173
```

No linting or test runner is configured. There is no TypeScript.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Build | **Vite + Vanilla JS** |
| Styling | **Vanilla CSS** (5 modular files) |
| Animations | **GSAP** (npm, ScrollTrigger plugin) |
| Data | **`portfolio.json` + `rates.json`** |
| Hosting | **Netlify** (auto-deploys from `main`) |
| Fonts | Google Fonts CDN — Cormorant Garamond (headers) + Inter (body) |
| Images | WebP format |

---

## Actual File Structure

```
portafolio_fofi/
├── index.html              # Home: hero, about, featured work, marquee, contact
├── projects.html           # All projects grid
├── project-detail.html     # Single project template (JS-populated via ?id= param)
├── rates.html              # Pricing page with inline contact form
├── 404.html                # Custom 404 (inline JS — not modular)
├── vite.config.js          # Multi-entry rollup: 5 HTML entry points, output → dist/
├── netlify.toml            # Build config, /project/:id rewrite, cache headers
│
├── public/images/          # Copied as-is to dist/ — not processed by Vite
│   ├── hero.webp
│   ├── about.webp
│   ├── brands/             # SVG/PNG brand logos for marquee
│   └── portfolio/          # One subfolder per project
│       └── [project-id]/
│           ├── cover.webp  # Grid thumbnail (600px)
│           └── *.webp      # Full-size images (1600px)
│
└── src/
    ├── main.js             # Home page: cursor, mobile menu, hero anims, featured grid, marquee
    ├── pages/
    │   ├── projects.js     # Renders projects grid from portfolio.json
    │   ├── projectDetail.js # Reads ?id= param, populates project-detail.html
    │   └── rates.js        # Renders rates grid from rates.json
    ├── data/
    │   ├── portfolio.json  # All project metadata + brands list
    │   └── rates.json      # All pricing tiers
    └── styles/
        ├── variables.css   # Design tokens (colors, fonts, spacing, breakpoints)
        ├── global.css      # Reset, base typography, custom cursor
        ├── layout.css      # Nav, hero, sections, footer, mobile menu overlay
        ├── components.css  # Buttons, portfolio cards, rates cards, project detail, CTA
        └── animations.css  # GSAP utility classes, prefers-reduced-motion override
```

**Important:** The JS is in `src/pages/` — not `src/js/`. Each HTML page loads its own script. `main.js` handles `index.html`; the `src/pages/` files handle the other pages.

---

## Architecture

### Multi-Entry Build

`vite.config.js` configures Rollup with 5 HTML entry points. Each page is a standalone HTML file that imports its own JS module — there is no shared runtime bundle or SPA router.

### Data-Driven Pages

`portfolio.json` and `rates.json` are imported directly by JS modules. Changing content means editing JSON, never HTML (except for the hardcoded "The Process" steps in `rates.html`).

**`portfolio.json` shape:**
```json
{
  "projects": [{
    "id": "string",          // Used as ?id= param and folder name under public/images/portfolio/
    "featured": true,        // Max 4 shown on home page (first 4 in array where featured: true)
    "coverImage": "/images/portfolio/[id]/cover.webp",
    "images": ["/images/portfolio/[id]/01-large.webp"],
    "title", "brand", "year", "category", "tags", "description", "photographer", "location"
  }],
  "brands": [{ "name": "string", "logo": "/images/brands/logo.svg" }]
}
```

**`rates.json` shape:**
```json
{
  "currency": "USD",
  "note": "string",
  "categories": [{
    "id": "string", "title": "string", "icon": "string",
    "items": [{ "label": "string", "price": 150 }]   // price can be number, 0, or "Quote"
  }]
}
```

### Project Detail Flow

`project-detail.html` is a single template. `src/pages/projectDetail.js` reads `?id=` from `window.location.search`, imports `portfolio.json`, finds the matching project, and populates the DOM. The Netlify rewrite `/project/:id → /project-detail.html` enables clean URLs in production.

### GSAP Animation Pattern

All animations use GSAP with ScrollTrigger. The consistent pattern across all page JS files:

```js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Scroll reveal (used site-wide)
gsap.from(".reveal", {
  scrollTrigger: { trigger: ".reveal", start: "top 85%" },
  y: 40, opacity: 0, duration: 0.9, ease: "power2.out", stagger: 0.15
});

// Desktop-only parallax
if (window.matchMedia("(min-width: 1024px)").matches) {
  gsap.to(".parallax-img", {
    scrollTrigger: { trigger: ".parallax-img", scrub: 1 },
    y: -60
  });
}
```

CSS in `animations.css` sets initial hidden states (`.reveal { opacity: 0; transform: translateY(40px); }`). GSAP's `from()` + `scrollTrigger` reveals them.

### Custom Cursor

Desktop-only 20px circle with `mix-blend-mode: difference`. Defined in `global.css`, animated in each page's JS. Hidden entirely via `animations.css` when `prefers-reduced-motion: reduce` is set.

### Mobile Menu

Full-screen overlay (`#mobile-menu`) toggled via `.menu-open` class on `<body>`. Hamburger `#menu-toggle` flips the 3 spans into an X. Each page JS initializes this independently (duplicated across all page scripts).

---

## Image Strategy

- **Source originals**: Never committed. Live in `source-images/` (gitignored).
- **Web sizes committed**: `*-large.webp` at 1600px / `cover.webp` at 600px.
- **Max sizes**: 400 KB large, 100 KB thumb.

```bash
# Optimize a new shoot
npm install -g sharp-cli
sharp -i "source-images/[shoot]/*.jpg" -o "public/images/portfolio/[shoot]/" --webp --width 1600 --quality 85
sharp -i "source-images/[shoot]/*.jpg" -o "public/images/portfolio/[shoot]/thumbs/" --webp --width 600 --quality 80
```

---

## Design System

### Colors (`variables.css`)

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#faf9f7` | Page background (warm off-white) |
| `--color-bg-alt` | `#f0ede8` | Alternate sections |
| `--color-surface` | `#ffffff` | Cards, nav |
| `--color-text` | `#1a1a1a` | Body text |
| `--color-text-muted` | `#8a8580` | Captions, metadata |
| `--color-accent` | `#a08060` | Hover states (warm brown) |
| `--color-accent-light` | `#c9b89a` | Decorative lines |
| `--color-border` | `#e8e4df` | Dividers |

### Typography

```css
--font-serif: 'Cormorant Garamond', Georgia, serif;  /* All headers */
--font-sans:  'Inter', system-ui, sans-serif;         /* Body, nav, labels */
--text-hero:  clamp(3rem, 10vw, 7rem);               /* Responsive hero */
```

### Key Rules

- No pill shapes, heavy rounding — editorial minimal (max `4px` radius on cards)
- White space is content — don't fill every section
- Mobile-first: write base styles first, add `@media (min-width: ...)` for larger
- All `<input>` and `<textarea>` must have `font-size ≥ 16px` (prevents iOS auto-zoom)
- Hover interactions must also work on tap (no hover-only reveals)

---

## Netlify

### Forms

```html
<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="contact" />
  <input type="hidden" name="bot-field" />
</form>
```

Submissions appear in the Netlify dashboard. Free tier: 100/month.

### Redirects

`/project/:id` → `project-detail.html` (200 rewrite, configured in `netlify.toml`).

---

## Git Workflow

| Branch | Purpose |
|---|---|
| `main` | Production — auto-deploys to Netlify |
| `feature/[name]` | New pages or major features |
| `fix/[description]` | Bug fixes |
| `content/[project-name]` | Adding new portfolio projects |

Never push broken code directly to `main`. Netlify auto-deploys within ~30 seconds of every push.

---

## Performance Targets (Lighthouse)

| Metric | Target |
|---|---|
| Performance | ≥ 90 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| Mobile score | ≥ 85 |

Hero image uses `<link rel="preload">`. Portfolio images use `loading="lazy" decoding="async"`.
