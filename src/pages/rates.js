import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ratesData from '../data/rates.json';

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
// RENDER RATES GRID FROM JSON
// ===========================
const ratesGrid = document.getElementById('rates-grid');
const ratesNote = document.getElementById('rates-note');

if (ratesGrid && ratesData) {
  ratesData.categories.forEach(category => {
    const card = document.createElement('div');
    card.className = 'rate-category';

    const title = document.createElement('h3');
    title.className = 'rate-category-title';
    title.textContent = category.title;
    card.appendChild(title);

    category.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'rate-item';

      const label = document.createElement('span');
      label.className = 'rate-label';
      label.textContent = item.label;

      const priceEl = document.createElement('span');
      priceEl.className = 'rate-price';

      if (item.note) {
        priceEl.innerHTML = `<span class="rate-price-note">${item.note}</span>`;
      } else if (item.price === 'Quote') {
        priceEl.innerHTML = `<span class="rate-price-note">Quote</span>`;
      } else if (typeof item.price === 'number' && item.price === 0) {
        priceEl.innerHTML = `<span class="rate-price-note">Included</span>`;
      } else {
        priceEl.textContent = `$${item.price}`;
      }

      row.appendChild(label);
      row.appendChild(priceEl);
      card.appendChild(row);
    });

    ratesGrid.appendChild(card);
  });

  if (ratesNote && ratesData.note) {
    ratesNote.textContent = ratesData.note;
  }

  // Animate rate cards on scroll
  gsap.fromTo('.rate-category',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out',
      scrollTrigger: { trigger: '#rates-grid', start: 'top 85%' }
    }
  );
}

// ===========================
// SCROLL REVEALS
// ===========================
gsap.utils.toArray('.reveal').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    }
  );
});

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
