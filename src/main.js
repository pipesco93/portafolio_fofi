import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portfolioData from './data/portfolio.json';

gsap.registerPlugin(ScrollTrigger);

// ===========================
// CUSTOM CURSOR (desktop / fine pointer only)
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
// HERO ANIMATIONS
// ===========================
window.addEventListener('load', () => {
  const tl = gsap.timeline();

  tl.fromTo('.title-line',
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power4.out' }
  );

  tl.fromTo('.hero-image-wrapper',
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
    '-=0.5'
  );

  tl.fromTo('#hero-img',
    { scale: 1.1 },
    { scale: 1, duration: 1.5, ease: 'power2.out' },
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
gsap.from('.about-text', {
  opacity: 0, y: 40, duration: 0.9, ease: 'power2.out',
  scrollTrigger: { trigger: '.about', start: 'top 85%' }
});

// Parallax on hero image — desktop only, for performance
if (window.matchMedia('(min-width: 1024px)').matches) {
  gsap.to('#hero-img', {
    scrollTrigger: { trigger: '.hero', scrub: 1 },
    y: -60
  });
}

// ===========================
// FEATURED WORK GRID
// ===========================
const grid = document.getElementById('portfolio-grid');
if (grid) {
  // Max 4 featured projects on the home page
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
      img.src = project.coverImage;
      img.alt = project.title;
      img.loading = 'lazy';
      img.decoding = 'async';
      item.appendChild(img);
    }

    // Hover overlay: brand + title
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

  gsap.fromTo('.portfolio-item',
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '.work', start: 'top 70%' }
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

  // Duplicate for seamless infinite loop
  marqueeTrack.innerHTML += marqueeTrack.innerHTML;

  const marqueeAnim = gsap.to('.marquee-track', {
    xPercent: -50,
    repeat: -1,
    duration: 22,
    ease: 'linear'
  });

  // Pause on hover
  marqueeTrack.addEventListener('mouseenter', () => marqueeAnim.pause());
  marqueeTrack.addEventListener('mouseleave', () => marqueeAnim.resume());
}

// ===========================
// MOBILE MENU
// ===========================
const hamburger = document.querySelector('.hamburger');
const mainNav = document.querySelector('.main-nav');
if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mainNav.classList.toggle('open');
  });

  // Close menu when a link is clicked
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mainNav.classList.remove('open');
    });
  });
}
