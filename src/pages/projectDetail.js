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
} else if (cursor) {
  cursor.style.display = 'none';
}

// ===========================
// HEADER — always solid on inner pages (no hero backdrop)
// ===========================
const header = document.querySelector('.header');
if (header) header.classList.add('scrolled');

// ===========================
// LOAD PROJECT FROM URL PARAM
// ===========================
const params = new URLSearchParams(window.location.search);
const projectId = params.get('id');

const brandEl    = document.getElementById('pd-brand');
const titleEl    = document.getElementById('pd-title');
const metaEl     = document.getElementById('pd-meta');
const heroImgEl  = document.getElementById('pd-hero-image');
const galleryEl  = document.getElementById('pd-gallery');
const descEl     = document.getElementById('pd-description');
const navEl      = document.getElementById('pd-nav');

if (!projectId) {
  if (titleEl) titleEl.textContent = 'No project specified';
} else {
  const projects = portfolioData.projects;
  const idx = projects.findIndex(p => p.id === projectId);
  const project = projects[idx];

  if (!project) {
    if (titleEl) titleEl.textContent = 'Project not found';
  } else {
    // Update page title
    document.title = `${project.title} — Fofi`;

    // Brand label
    if (brandEl) brandEl.textContent = project.brand || '';

    // Title
    if (titleEl) titleEl.textContent = project.title;

    // Meta: year, location, photographer, category
    if (metaEl) {
      const metas = [
        project.year       ? { label: 'Year',         value: project.year }        : null,
        project.category   ? { label: 'Category',     value: project.category }    : null,
        project.location   ? { label: 'Location',     value: project.location }    : null,
        project.photographer ? { label: 'Photographer', value: project.photographer } : null,
      ].filter(Boolean);

      metas.forEach(m => {
        const span = document.createElement('span');
        span.className = 'project-meta-item';
        span.innerHTML = `<strong>${m.label}:</strong> ${m.value}`;
        metaEl.appendChild(span);
      });
    }

    // Hero image — first in images array
    if (heroImgEl && project.images && project.images.length > 0) {
      const img = document.createElement('img');
      img.src = cldUrl(project.images[0], 1600);
      img.alt = `${project.title} — hero`;
      img.decoding = 'async';
      heroImgEl.appendChild(img);
    }

    // Gallery — remaining images (index 1+)
    if (galleryEl && project.images && project.images.length > 1) {
      project.images.slice(1).forEach((src, i) => {
        const div = document.createElement('div');
        div.className = 'gallery-item';

        const img = document.createElement('img');
        img.src = cldUrl(src, 1200);
        img.alt = `${project.title} — photo ${i + 2}`;
        img.loading = 'lazy';
        img.decoding = 'async';

        div.appendChild(img);
        galleryEl.appendChild(div);
      });
    }

    // Description
    if (descEl && project.description) {
      descEl.textContent = project.description;
    }

    // Prev / Next navigation
    if (navEl) {
      const prevProject = projects[idx - 1];
      const nextProject = projects[idx + 1];

      if (prevProject) {
        const prevLink = document.createElement('a');
        prevLink.href = `/project-detail.html?id=${prevProject.id}`;
        prevLink.textContent = `← ${prevProject.brand || prevProject.title}`;
        navEl.appendChild(prevLink);
      } else {
        navEl.appendChild(document.createElement('span')); // spacer
      }

      if (nextProject) {
        const nextLink = document.createElement('a');
        nextLink.href = `/project-detail.html?id=${nextProject.id}`;
        nextLink.textContent = `${nextProject.brand || nextProject.title} →`;
        navEl.appendChild(nextLink);
      }
    }

    // ===========================
    // ANIMATIONS
    // ===========================
    gsap.fromTo('.project-brand',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.1 }
    );

    gsap.fromTo('.project-title',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    );

    gsap.fromTo('.project-meta-item',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', delay: 0.4 }
    );

    gsap.fromTo('.project-hero-image',
      { y: 30 },
      { y: 0, duration: 1, ease: 'power2.out', delay: 0.5, clearProps: 'transform' }
    );

    gsap.fromTo('.gallery-item',
      { y: 40 },
      {
        y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: '.gallery-grid', start: 'top 85%' },
        clearProps: 'transform'
      }
    );

    gsap.fromTo('.project-description',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
        scrollTrigger: { trigger: '.project-description', start: 'top 85%' }
      }
    );
  }
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

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mainNav.classList.remove('open');
    });
  });
}
