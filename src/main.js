import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portfolioData from './data/portfolio.json';

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

// Initial Animations
window.addEventListener('load', () => {
    const tl = gsap.timeline();

    // Hero text reveal
    tl.fromTo('.title-line',
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power4.out' }
    );

    // Minimal scroll triggers for demo
    gsap.fromTo('.about-text',
        { opacity: 0, y: 50 },
        {
            opacity: 1, y: 0, duration: 1,
            scrollTrigger: {
                trigger: '.about',
                start: 'top 80%'
            }
        }
    );
});

// Data rendering logic mock
const grid = document.getElementById('portfolio-grid');
if (grid) {
    portfolioData.projects.forEach(project => {
        const item = document.createElement('div');
        item.className = 'portfolio-item fade-up';
        // For now we just use a colored div, later an image
        // item.innerHTML = `<img src="${project.image}" alt="${project.title}" />`;
        grid.appendChild(item);
    });

    // Animate grid items on scroll
    gsap.to('.portfolio-item', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.work',
            start: 'top 70%'
        }
    });
}

// Brand Marquee Logic
const marqueeTrack = document.getElementById('marquee-track');
if (marqueeTrack) {
    portfolioData.brands.forEach(brand => {
        const el = document.createElement('div');
        el.className = 'brand-placeholder';
        el.innerText = brand.name;
        marqueeTrack.appendChild(el);
    });

    // Duplicate for infinite scroll effect
    marqueeTrack.innerHTML += marqueeTrack.innerHTML;

    gsap.to('.marquee-track', {
        xPercent: -50,
        repeat: -1,
        duration: 20,
        ease: 'linear'
    });
}
