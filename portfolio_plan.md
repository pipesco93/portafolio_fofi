# Model Portfolio Website - Project Plan

## 1. Project Overview
A high-end, minimalist portfolio website for a model. The primary goal is to showcase past work, attract new clients (brands, photographers, agencies), and make it extremely simple for potential clients to reach out for quotes and bookings. 

The aesthetic will be light, clean, and editorial, drawing inspiration from high-end fashion portfolios (e.g., Natale, Ange Studio).

## 2. Target Audience
* **Fashion Brands & Agencies:** Looking for the face of their next campaign.
* **Photographers & Art Directors:** Looking to collaborate on photoshoots.
* **Goal:** The site must immediately communicate professionalism, versatility, and premium quality.

## 3. Technology Stack Recommendation
Since you've used Vite, we will stick to a **Vite + Vanilla HTML/JS/CSS** approach, enhanced with **GSAP** for high-end animations.

* **Framework:** Vite + Vanilla JS (Incredibly fast development and optimized build).
* **Styling:** Vanilla CSS (Modular, clean, no unnecessary bloat).
* **Animations:** GSAP (GreenSock) for buttery-smooth scroll reveals, parallax, and page transitions.
* **Content Management:** A local `data.json` file to easily add new portfolio items and brand logos without touching the HTML.

## 4. Directory Structure
To keep everything organized and scalable as the portfolio grows, we will use the following structure:

```text
portafolio_fofi/
├── index.html                # Main entry point website structure
├── package.json              # Project dependencies and Vite scripts
├── vite.config.js            # Vite configuration
├── public/                   # Static assets that don't need processing
│   └── images/
│       ├── portfolio/        # High-res photoshoot images
│       └── brands/           # Brand logos for the marquee
└── src/                      # Source code for the application
    ├── main.js               # Main JavaScript entry point
    ├── data/
    │   └── portfolio.json    # The data file easily updated with new work
    ├── styles/
    │   ├── variables.css     # Colors, fonts, spacing (The Design System)
    │   ├── global.css        # Base resets and typography
    │   ├── layout.css        # Grid, masonry, and container layouts
    │   └── animations.css    # CSS-based micro-interactions
    ├── js/
    │   ├── animations.js     # GSAP animation logic
    │   └── renderData.js     # Logic to read data.json and populate the HTML
    └── components/           # (Optional) Reusable HTML snippets if needed
```

## 5. Website Architecture (Sitemap)

* **Home Page**
  * **Hero Section:** Full-screen stunning video loop or photo slider featuring her best shot.
  * **About / Intro:** Short, punchy bio about her versatility and look.
  * **Featured Work:** A beautiful, asymmetric grid showcasing top projects.
  * **Brand Marquee:** A smooth, infinite side-scrolling banner showing logos of brands she's worked with.
  * **Call to Action (CTA):** "Let's work together" leading to the contact form.

* **Portfolio / Work Section**
  * A masonry or minimalist grid of all photoshoots/campaigns.
  * Clicking an image opens a dedicated layout (or a sleek modal) showing more photos from that specific shoot.

* **Contact Section**
  * A clean form for quotes and inquiries (Name, Email, Brand/Agency, Project Details).
  * Links to her Instagram / Social media.

## 6. Design & Aesthetic Guidelines
* **Colors:** Cream/Off-white backgrounds (`#fcfcfc`, `#f5f5f0`), with deep charcoal or soft black text (`#1a1a1a`).
* **Typography:** Elegant modern sans-serif (e.g., *Inter* or *Outfit*) mixed with a sophisticated serif for cinematic headers (e.g., *Playfair Display*).
* **Interactions:** 
  * Parallax scrolling on images.
  * Fade-in and slide-up text reveals when scrolling.
  * Smooth, custom cursor or distinct hover effects over project images.
