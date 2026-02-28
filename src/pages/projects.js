import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portfolioData from '../data/portfolio.json';

gsap.registerPlugin(ScrollTrigger);

// Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const interactiveElements = document.querySelectorAll('a, button, .portfolio-item');

window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
    });
});

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

// Render All Projects Grid
const grid = document.getElementById('portfolio-grid-full');
if (grid) {
    portfolioData.projects.forEach(project => {
        // Generate the path to the dynamic detailed page
        const link = document.createElement('a');
        link.href = `/project-detail.html?id=${project.id}`;

        const item = document.createElement('div');
        item.className = 'portfolio-item fade-up';

        // Create an image or a placeholder
        if (project.image) {
            item.innerHTML = `<img src="${project.image}" alt="${project.title}" />`;
        } else {
            item.innerHTML = `<h3>${project.title}</h3>`;
        }

        link.appendChild(item);
        grid.appendChild(link);
    });

    // Basic stagger animation on load
    gsap.fromTo('.portfolio-item',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
}

// Global page intro animation
gsap.from('.section-title', { opacity: 0, y: 30, duration: 1, delay: 0.2 });

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const mainNav = document.querySelector('.main-nav');
if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mainNav.classList.toggle('open');
  });
}
