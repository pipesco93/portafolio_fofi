import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portfolioData from './data/portfolio.json';
import { cldUrl } from './cloudinary.js';

gsap.registerPlugin(ScrollTrigger);

// ===========================
// CUSTOM CURSOR (desktop only)
// ===========================
const cursor = document.querySelector('.cursor');
if (cursor && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
  });

  document.querySelectorAll('a, button, .portfolio-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });
} else if (cursor) {
  cursor.style.display = 'none';
}

// ===========================
// HEADER — SCROLL BEHAVIOR
// ===========================
const header = document.querySelector('.header');
if (header) {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load in case page is already scrolled
}

// ===========================
// MOBILE MENU
// ===========================
const hamburger = document.querySelector('.hamburger');
const mainNav = document.querySelector('.main-nav');
const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];

function openMenu() {
  hamburger.classList.add('open');
  mainNav.classList.add('open');
  document.body.classList.add('menu-open');

  // GSAP stagger — links slide up and fade in
  gsap.fromTo(navLinks,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.08, duration: 0.55, ease: 'power3.out', delay: 0.1 }
  );
}

function closeMenu() {
  // Animate links out, then hide overlay
  gsap.to(navLinks, {
    y: -20, opacity: 0, stagger: 0.04, duration: 0.25, ease: 'power2.in',
    onComplete: () => {
      mainNav.classList.remove('open');
      document.body.classList.remove('menu-open');
      hamburger.classList.remove('open');
    }
  });
}

if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    if (mainNav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on tap outside the nav (on the overlay backdrop)
  mainNav.addEventListener('click', (e) => {
    if (e.target === mainNav) closeMenu();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) closeMenu();
  });
}

// ===========================
// HERO ANIMATIONS
// ===========================
window.addEventListener('load', () => {
  // Skip animations if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tl = gsap.timeline();

  tl.fromTo('.title-line',
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power4.out' }
  );

  tl.fromTo('.hero-image-wrapper',
    { y: 50 },
    { y: 0, duration: 1.2, ease: 'power3.out', clearProps: 'transform' },
    '-=0.5'
  );

  tl.fromTo('#hero-img',
    { scale: 1.1 },
    { scale: 1, duration: 1.5, ease: 'power2.out', clearProps: 'transform' },
    '-=1.0'
  );

  tl.fromTo('.hero-subtitle',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
    '-=0.8'
  );
});

// ===========================
// SCROLL REVEALS
// ===========================
const revealTargets = [
  { selector: '.about-text', start: 'top 85%' },
  { selector: '.section-title', start: 'top 88%' },
  { selector: '.contact-header', start: 'top 88%' },
  { selector: '.cta-block h2', start: 'top 85%' },
  { selector: '.cta-actions', start: 'top 88%' },
  { selector: '.footer-container', start: 'top 95%' },
];

revealTargets.forEach(({ selector, start }) => {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;
  gsap.from(els, {
    opacity: 0, y: 35, duration: 0.85, ease: 'power2.out',
    scrollTrigger: { trigger: els[0], start }
  });
});


// ===========================
// FEATURED WORK GRID
// ===========================
const grid = document.getElementById('portfolio-grid');
if (grid) {
  const featured = portfolioData.projects
    .filter(p => p.featured)
    .slice(0, 4);

  featured.forEach(project => {
    const link = document.createElement('a');
    link.href = `/project-detail.html?id=${project.id}`;
    link.setAttribute('aria-label', project.title);

    const item = document.createElement('div');
    item.className = 'portfolio-item';

    if (project.coverImage) {
      const img = document.createElement('img');
      img.src = cldUrl(project.coverImage, 800);
      img.alt = project.title;
      img.loading = 'lazy';
      img.decoding = 'async';
      item.appendChild(img);
    }

    const overlay = document.createElement('div');
    overlay.className = 'portfolio-item-overlay';
    overlay.innerHTML = `
      <span class="portfolio-item-brand">${project.brand || ''}</span>
      <span class="portfolio-item-title">${project.title}</span>
    `;
    item.appendChild(overlay);

    link.appendChild(item);
    grid.appendChild(link);
  });

  // Touch: tap to reveal overlay, tap again to navigate
  if (window.matchMedia('(pointer: coarse)').matches) {
    grid.querySelectorAll('.portfolio-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!item.classList.contains('touch-active')) {
          e.preventDefault();
          // Close any other open items
          grid.querySelectorAll('.portfolio-item.touch-active').forEach(other => {
            other.classList.remove('touch-active');
          });
          item.classList.add('touch-active');
        }
        // If already active, let the link navigate (don't preventDefault)
      });
    });

    // Tap outside closes touch overlays
    document.addEventListener('touchstart', (e) => {
      if (!e.target.closest('.portfolio-item')) {
        grid.querySelectorAll('.portfolio-item.touch-active').forEach(item => {
          item.classList.remove('touch-active');
        });
      }
    }, { passive: true });
  }

  gsap.fromTo('.portfolio-item',
    { y: 40 },
    {
      y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '.work', start: 'top 70%' },
      clearProps: 'transform'
    }
  );
}

// ===========================
// BRAND MARQUEE
// ===========================
const marqueeTrack = document.getElementById('marquee-track');
if (marqueeTrack && portfolioData.brands.length) {
  portfolioData.brands.forEach(brand => {
    const el = document.createElement('div');
    el.className = 'brand-placeholder';
    el.textContent = brand.name;
    marqueeTrack.appendChild(el);
  });

  // Duplicate for seamless loop
  marqueeTrack.innerHTML += marqueeTrack.innerHTML;

  const marqueeAnim = gsap.to('.marquee-track', {
    xPercent: -50,
    repeat: -1,
    duration: 22,
    ease: 'linear'
  });

  marqueeTrack.addEventListener('mouseenter', () => marqueeAnim.pause());
  marqueeTrack.addEventListener('mouseleave', () => marqueeAnim.resume());
}

// ===========================
// SMOOTH SCROLL (anchor links)
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
