import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portfolioData from '../data/portfolio.json';
import { cldUrl } from '../cloudinary.js';

gsap.registerPlugin(ScrollTrigger);

// ===========================
// CUSTOM CURSOR
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
// HEADER — always solid on inner pages (no hero backdrop)
// ===========================
const header = document.querySelector('.header');
if (header) header.classList.add('scrolled');

// ===========================
// RENDER ALL PROJECTS GRID
// ===========================
const grid = document.getElementById('portfolio-grid-full');
if (grid) {
  portfolioData.projects.forEach(project => {
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

    // Hover overlay
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
    { y: 40 },
    { y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.2, clearProps: 'transform' }
  );
}

// Page title entrance
gsap.fromTo('.section-title',
  { opacity: 0, y: 30 },
  { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.1 }
);

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

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mainNav.classList.remove('open');
    });
  });
}
