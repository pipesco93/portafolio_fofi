import gsap from 'gsap';
import portfolioData from '../data/portfolio.json';

// Custom Cursor (Common across pages)
const cursor = document.querySelector('.cursor');
window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
});

// Extract ID from URL
const params = new URLSearchParams(window.location.search);
const projectId = params.get('id');

const titleEl = document.getElementById('pd-title');
const metaEl = document.getElementById('pd-meta');
const galleryEl = document.getElementById('pd-gallery');

if (projectId) {
    // Find project in the JSON
    const project = portfolioData.projects.find(p => p.id === projectId);

    if (project) {
        // Inject Data
        titleEl.textContent = project.title;
        metaEl.innerHTML = `
      <p><strong>Client:</strong> ${project.client || 'Personal'}</p>
      <p><strong>Role:</strong> ${project.role || 'Fashion Model'}</p>
      <p><strong>Year:</strong> ${project.year || '2026'}</p>
    `;

        // Inject Images (Simulating multiple photos from one shoot)
        // Normally you would loop through an array of images in the JSON.
        // We will just show 3 dummy blocks or their main image duplicated for structural testing.
        for (let i = 0; i < 4; i++) {
            const div = document.createElement('div');
            div.className = 'gallery-item fade-up';
            if (project.image) {
                div.innerHTML = `<img src="${project.image}" alt="Photo ${i + 1} from ${project.title}" />`;
            } else {
                div.style.backgroundColor = 'var(--color-accent)';
                div.style.aspectRatio = '3/4';
            }
            galleryEl.appendChild(div);
        }

        // Animate entries
        gsap.from('.project-title', { opacity: 0, y: 30, duration: 1 });
        gsap.from('.project-meta p', { opacity: 0, y: 20, duration: 0.8, stagger: 0.1, delay: 0.3 });
        gsap.from('.gallery-item', { opacity: 0, y: 50, duration: 0.8, stagger: 0.2, delay: 0.5 });

    } else {
        titleEl.textContent = 'Project Not Found';
    }
} else {
    titleEl.textContent = 'Invalid Project Reference';
}

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const mainNav = document.querySelector('.main-nav');
if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mainNav.classList.toggle('open');
  });
}
