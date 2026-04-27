// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Add slight delay for outline outline
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorOutline.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorOutline.style.opacity = '1';
});

// Hover effect for interactive elements
const interactables = document.querySelectorAll('a, button, .project-card, .creative-folder, .skill-tag');
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
});

// Navigation Bar Scroll Effect, Scrollspy & Progress Bar
const navbar = document.querySelector('.navbar');
const progressBar = document.querySelector('.scroll-progress');
const backToTop = document.getElementById('backToTop');
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links li a');

window.addEventListener('scroll', () => {
    // Navbar background
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Scroll Progress
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    if(progressBar) progressBar.style.width = scrollPercent + '%';

    // Back to top visibility
    if (backToTop) {
        if (scrollTop > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    // Scrollspy
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollTop >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (current && item.getAttribute('href').includes(current)) {
            item.classList.add('active');
        }
    });
});

if (backToTop) {
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('toggle');
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('toggle');
        navLinks.classList.remove('active');
    });
});

// Handle simple form submission using Web3Forms
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formStatus.style.color = 'var(--clr-primary)';
    formStatus.textContent = 'Sending...';
    
    // Create FormData object from the form
    const formData = new FormData(contactForm);
    
    // IMPORTANT: To make this work, replace 'YOUR_ACCESS_KEY_HERE' with your actual key from web3forms.com
    formData.append("access_key", "90814503-2365-453e-a35b-77dd51c072ed");

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });
        
        const data = await response.json();

        if (data.success) {
            contactForm.reset();
            formStatus.style.color = '#4CAF50';
            formStatus.textContent = "Thank you! I'll be in touch soon.";
        } else {
            console.error('Error:', data);
            formStatus.style.color = '#f472b6'; // error color
            formStatus.textContent = "Oops! Something went wrong. Did you add your Web3Forms access key?";
        }
    } catch (error) {
        console.error('Error:', error);
        formStatus.style.color = '#f472b6';
        formStatus.textContent = "Oops! Something went wrong. Please try again.";
    }

    setTimeout(() => formStatus.textContent = '', 6000);
});

// Scroll Reveal Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Select all elements that need to animate on scroll
const revealElements = document.querySelectorAll('.reveal');
revealElements.forEach(el => observer.observe(el));

// Trigger initial animations for items in view right away
window.addEventListener('load', () => {
    document.querySelectorAll('.slide-up, .fade-in').forEach(el => {
        el.classList.add('active');
    });
});

// Portfolio Filtering & Dynamic Media Gallery
const skillTags = document.querySelectorAll('.skill-tag');
const projectCards = document.querySelectorAll('.project-card');
const noProjectsMsg = document.getElementById('noProjectsMsg');
const mediaGallery = document.getElementById('mediaGallery');

// mediaData is now loaded globally from media.js
// Lightbox Carousel Logic
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.querySelector('.lightbox-content');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentGalleryItems = [];
let currentItemIndex = 0;

function openLightbox(filterValue) {
    const items = mediaData[filterValue];
    if (!items || items.length === 0) {
        console.log("No media found for this folder.");
        return; // Don't open if no media
    }

    currentGalleryItems = items;
    currentItemIndex = 0;
    
    renderLightboxItem();
    lightbox.classList.add('active');
}

function renderLightboxItem() {
    if (!lightboxContent) return;
    lightboxContent.innerHTML = ''; // clear previous

    const item = currentGalleryItems[currentItemIndex];

    if (item.type === 'video') {
        const video = document.createElement('video');
        video.src = item.src;
        video.controls = true;
        video.autoplay = true;
        lightboxContent.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.title || 'Media';
        lightboxContent.appendChild(img);
    }

    // Toggle navigation buttons visibility based on array length
    if (lightboxPrev && lightboxNext) {
        if (currentGalleryItems.length > 1) {
            lightboxPrev.style.display = 'flex';
            lightboxNext.style.display = 'flex';
        } else {
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
        }
    }
}

function showNextItem() {
    if (currentGalleryItems.length <= 1) return;
    currentItemIndex = (currentItemIndex + 1) % currentGalleryItems.length;
    renderLightboxItem();
}

function showPrevItem() {
    if (currentGalleryItems.length <= 1) return;
    currentItemIndex = (currentItemIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
    renderLightboxItem();
}

function closeLightbox() {
    if (lightbox) {
        lightbox.classList.remove('active');
        // Stop videos when closing
        setTimeout(() => { lightboxContent.innerHTML = ''; }, 300);
    }
    // Remove active state from skill buttons
    skillTags.forEach(t => t.classList.remove('active'));
}

if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNextItem(); });
if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrevItem(); });
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        // Close if clicking outside the image/video and not on a button
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextItem();
        if (e.key === 'ArrowLeft') showPrevItem();
    });
}

skillTags.forEach(tag => {
    tag.addEventListener('click', (e) => {
        e.preventDefault();
        // Remove active class from all tags
        skillTags.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tag
        tag.classList.add('active');

        const filterValue = tag.getAttribute('data-filter');
        
        // Open the dynamic media carousel
        openLightbox(filterValue);
    });
});

const creativeFolders = document.querySelectorAll('.creative-folder');
creativeFolders.forEach(folder => {
    folder.addEventListener('click', (e) => {
        e.preventDefault();
        const filterValue = folder.getAttribute('data-filter');
        openLightbox(filterValue);
    });
});

// Physics Particle Background
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let particles = [];
    
    // Mouse interaction variables
    let mouse = { x: null, y: null, radius: 150 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
        }
        draw() {
            ctx.fillStyle = `rgba(${window.particleRGB || '56, 189, 248'}, 0.5)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }
        }
    }

    function init() {
        particles = [];
        let numberOfParticles = (width * height) / 15000;
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }
    
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(${window.particleRGB || '56, 189, 248'}, ${opacityValue})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        window.particleRGB = document.documentElement.getAttribute('data-theme') === 'light' ? '234, 88, 12' : '56, 189, 248';
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].draw();
            particles[i].update();
        }
        connect();
        requestAnimationFrame(animate);
    }
    
    init();
    animate();
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        init();
    });
}

// 3D Glass Card Tilt Effect
const cards = document.querySelectorAll('.glass-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'none';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.5s ease';
    });
});

// Magnetic Buttons
const magneticButtons = document.querySelectorAll('.magnetic');
magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        btn.style.transition = 'none';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = `translate(0px, 0px)`;
        btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
});

// Testimonials Carousel Logic
const track = document.querySelector('.testimonial-track');
if (track) {
    const slides = Array.from(track.children);
    let currentIndex = 0;
    
    function moveToSlide(index) {
        if (!slides[index]) return;
        track.style.transform = `translateX(-${index * 100}%)`;
    }
    
    // Auto-advance
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        moveToSlide(currentIndex);
    }, 5000);
}

// Theme Toggle Logic
const themeToggleBtn = document.getElementById('themeToggle');
if (themeToggleBtn) {
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggleBtn.textContent = '🌙';
    }

    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.textContent = '☀️';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggleBtn.textContent = '🌙';
        }
    });
}
