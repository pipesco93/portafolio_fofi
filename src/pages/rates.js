import gsap from 'gsap';

// Custom Cursor (Common across pages)
const cursor = document.querySelector('.cursor');
window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
});

// Animations specific to rates page
gsap.from('.section-title', { opacity: 0, y: 30, duration: 1 });
gsap.from('.about-text', { opacity: 0, y: 20, duration: 1, delay: 0.2 });

gsap.from('.process-step', {
    opacity: 0,
    x: -30,
    duration: 0.8,
    stagger: 0.2,
    delay: 0.5
});

gsap.from('.rate-card', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.2,
    delay: 0.8
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const mainNav = document.querySelector('.main-nav');
if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mainNav.classList.toggle('open');
  });
}
