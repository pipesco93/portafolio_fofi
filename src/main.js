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

  document.querySelectorAll('a, button, .archive-card').forEach(el => {
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
  onScroll();
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

  gsap.fromTo(navLinks,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.08, duration: 0.55, ease: 'power3.out', delay: 0.1 }
  );
}

function closeMenu() {
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

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  mainNav.addEventListener('click', (e) => {
    if (e.target === mainNav) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) closeMenu();
  });
}

// ===========================
// HERO ANIMATIONS
// ===========================
window.addEventListener('load', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  // Left panel: image scales gently into view
  tl.fromTo('#hero-img',
    { scale: 1.08 },
    { scale: 1, duration: 1.8, ease: 'power2.out', clearProps: 'transform' },
    0
  );

  // Eyebrow fades up
  tl.fromTo('.hero-eyebrow',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.7 },
    0.3
  );

  // Name lines clip up from inside overflow:hidden
  tl.fromTo('.name-inner',
    { yPercent: 105 },
    { yPercent: 0, duration: 1.1, stagger: 0.18, clearProps: 'transform' },
    0.45
  );

  // Rule scales from left
  tl.fromTo('.hero-rule',
    { scaleX: 0, transformOrigin: 'left center' },
    { scaleX: 1, duration: 0.6 },
    1.1
  );

  // Agency text
  tl.fromTo('.hero-agency',
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.6 },
    1.25
  );

  // Explore button
  tl.fromTo('.hero-explore',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.5 },
    1.45
  );

  // Arrow bounces gently after load
  gsap.to('.hero-explore-arrow', {
    y: 7, duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.0
  });

  // Explore button scrolls to archive
  document.querySelector('.hero-explore')?.addEventListener('click', () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===========================
// SCROLL REVEALS
// ===========================
const revealTargets = [
  { selector: '.archive-heading',      start: 'top 88%' },
  { selector: '.measurements-heading', start: 'top 88%' },
  { selector: '.contact-header',       start: 'top 88%' },
  { selector: '.footer-container',     start: 'top 95%' },
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
// ARCHIVE STRIP (horizontal scroll)
// ===========================
const archiveStrip = document.getElementById('archive-strip');
if (archiveStrip) {
  const featured = portfolioData.projects
    .filter(p => p.featured)
    .slice(0, 6);

  featured.forEach((project, i) => {
    const size = i % 2 === 0 ? 'tall' : 'short';

    const card = document.createElement('a');
    card.href = `/project-detail.html?id=${project.id}`;
    card.className = 'archive-card';
    card.setAttribute('data-size', size);
    card.setAttribute('role', 'listitem');
    card.setAttribute('aria-label', project.title);

    const imgWrap = document.createElement('div');
    imgWrap.className = 'archive-card-image';

    if (project.coverImage) {
      const img = document.createElement('img');
      img.src = cldUrl(project.coverImage, 640);
      img.alt = project.title;
      img.loading = 'lazy';
      img.decoding = 'async';
      imgWrap.appendChild(img);
    }

    const caption = document.createElement('div');
    caption.className = 'archive-card-caption';
    caption.innerHTML = `
      <span class="archive-card-category">${project.category || ''}</span>
      <span class="archive-card-meta">${project.location || ''} &nbsp;·&nbsp; ${project.year || ''}</span>
    `;

    card.appendChild(imgWrap);
    card.appendChild(caption);
    archiveStrip.appendChild(card);
  });

  // Touch: tap-first-to-preview, tap-again-to-navigate
  if (window.matchMedia('(pointer: coarse)').matches) {
    archiveStrip.querySelectorAll('.archive-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!card.classList.contains('touch-active')) {
          e.preventDefault();
          archiveStrip.querySelectorAll('.archive-card.touch-active')
            .forEach(c => c.classList.remove('touch-active'));
          card.classList.add('touch-active');
        }
      });
    });

    document.addEventListener('touchstart', (e) => {
      if (!e.target.closest('.archive-card')) {
        archiveStrip.querySelectorAll('.archive-card.touch-active')
          .forEach(c => c.classList.remove('touch-active'));
      }
    }, { passive: true });
  }

  // Fade scroll hint once user scrolls the strip
  const scrollHint = document.getElementById('archive-scroll-hint');
  if (scrollHint) {
    archiveStrip.addEventListener('scroll', () => {
      if (archiveStrip.scrollLeft > 40) scrollHint.classList.add('is-hidden');
    }, { passive: true });
  }

  gsap.fromTo('.archive-card',
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: '.archive', start: 'top 75%' }
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
// MEASUREMENTS SECTION
// ===========================
const measGrid = document.getElementById('measurements-grid');
if (measGrid && portfolioData.model) {
  const m = portfolioData.model.measurements;
  const cells = [
    { label: 'Height', value: m.height.imperial, metric: m.height.metric },
    { label: 'Bust',   value: m.bust.imperial,   metric: m.bust.metric   },
    { label: 'Waist',  value: m.waist.imperial,  metric: m.waist.metric  },
    { label: 'Hips',   value: m.hips.imperial,   metric: m.hips.metric   },
    { label: 'Hair',   value: m.hair,             metric: null },
    { label: 'Eyes',   value: m.eyes,             metric: null },
    { label: 'Shoes',  value: m.shoes,            metric: null },
    { label: 'Dress',  value: m.dress,            metric: null },
  ];

  cells.forEach(cell => {
    const div = document.createElement('div');
    div.className = 'measurement-cell';
    div.innerHTML = `
      <span class="measurement-label">${cell.label}</span>
      <span class="measurement-value">${cell.value}</span>
      ${cell.metric ? `<span class="measurement-metric">${cell.metric}</span>` : ''}
    `;
    measGrid.appendChild(div);
  });

  gsap.fromTo('.measurement-cell',
    { opacity: 0, y: 25 },
    {
      opacity: 1, y: 0, duration: 0.65, stagger: 0.07, ease: 'power2.out',
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: '.measurements', start: 'top 80%' }
    }
  );
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
