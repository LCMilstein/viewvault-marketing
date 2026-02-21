// CineSync Marketing Site JavaScript

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .screenshot-item, .platform-card').forEach(el => {
    observer.observe(el);
});

// Video placeholder click handler
const videoPlaceholder = document.querySelector('.video-placeholder');
if (videoPlaceholder) {
    videoPlaceholder.addEventListener('click', function() {
        // Check if there's a video element with a valid source
        const videoElement = document.querySelector('.video-container video');
        if (videoElement && videoElement.src && videoElement.src !== window.location.href) {
            videoElement.style.display = 'block';
            this.style.display = 'none';
            videoElement.play().catch(e => {
                console.log('Video playback failed:', e);
                alert('Please add your demo video to ./assets/videos/cinesync-demo.mp4');
            });
        } else {
            alert('Please add your demo video to ./assets/videos/cinesync-demo.mp4');
        }
    });
}

// Mobile menu toggle (basic implementation)
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
        const navMenu = document.querySelector('.nav-menu');

        // Toggle mobile menu visibility
        if (navMenu.style.display === 'flex') {
            navMenu.style.display = 'none';
        } else {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '100%';
            navMenu.style.left = '0';
            navMenu.style.right = '0';
            navMenu.style.background = 'white';
            navMenu.style.padding = '20px';
            navMenu.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            navMenu.style.zIndex = '999';
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const navMenu = document.querySelector('.nav-menu');
        if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            if (window.innerWidth <= 768) {
                navMenu.style.display = 'none';
            }
        }
    });
}

// Handle window resize
window.addEventListener('resize', function() {
    const navMenu = document.querySelector('.nav-menu');
    if (window.innerWidth > 768) {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'row';
        navMenu.style.position = 'static';
        navMenu.style.background = 'transparent';
        navMenu.style.padding = '0';
        navMenu.style.boxShadow = 'none';
    } else {
        navMenu.style.display = 'none';
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounced scroll handler
const debouncedScrollHandler = debounce(function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Analytics and tracking (placeholder)
function trackEvent(action, category, label) {
    // Add your analytics tracking here
    // Example: gtag('event', action, { event_category: category, event_label: label });
    console.log('Event tracked:', { action, category, label });
}

// Track CTA clicks
document.querySelectorAll('.btn-primary, .cta-button').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('click', 'CTA', this.textContent.trim());
    });
});

// Track navigation clicks
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        trackEvent('click', 'Navigation', this.textContent.trim());
    });
});

// Lazy loading for images (if needed)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Console easter egg for developers
console.log(`
🎬 ViewVault Marketing Site
Built with modern web technologies
Want to contribute? Check out our GitHub!
`);

// ── Coverflow Carousel ──────────────────────────────────────
(function () {
    const slides = document.querySelectorAll('.carousel-slide');
    const caption = document.getElementById('carouselCaption');
    const dots = document.querySelectorAll('.carousel-dot');
    if (!slides.length) return;

    const captions = [
        'Browse your full watchlist with collections, movies, and series',
        'Search and import from TMDB\'s massive catalog',
        'Dive into collections with watched progress and notes',
        'View details, manage lists, and add personal notes',
    ];

    let current = 0;
    const total = slides.length;

    function positionClass(offset) {
        if (offset === 0) return 'active';
        if (offset === -1) return 'pos-left-1';
        if (offset === -2) return 'pos-left-2';
        if (offset === 1) return 'pos-right-1';
        if (offset === 2) return 'pos-right-2';
        return 'hidden';
    }

    function update() {
        slides.forEach((slide, i) => {
            slide.className = 'carousel-slide';
            let offset = i - current;
            // Wrap around for looping feel
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;
            slide.classList.add(positionClass(offset));
        });

        dots.forEach((d, i) => d.classList.toggle('active', i === current));

        if (caption) {
            caption.style.opacity = 0;
            setTimeout(() => {
                caption.textContent = captions[current] || '';
                caption.style.opacity = 1;
            }, 200);
        }
    }

    function goTo(index) {
        current = ((index % total) + total) % total;
        update();
    }

    // Arrow buttons
    const prev = document.querySelector('.carousel-btn--prev');
    const next = document.querySelector('.carousel-btn--next');
    if (prev) prev.addEventListener('click', () => goTo(current - 1));
    if (next) next.addEventListener('click', () => goTo(current + 1));

    // Dot clicks
    dots.forEach(dot => {
        dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index, 10)));
    });

    // Click on a side slide to bring it to center
    slides.forEach(slide => {
        slide.addEventListener('click', () => {
            const idx = parseInt(slide.dataset.index, 10);
            if (idx !== current) goTo(idx);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goTo(current - 1);
        if (e.key === 'ArrowRight') goTo(current + 1);
    });

    // Touch / swipe support
    let touchStartX = 0;
    const wrapper = document.querySelector('.carousel-wrapper');
    if (wrapper) {
        wrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });
        wrapper.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? goTo(current + 1) : goTo(current - 1);
            }
        }, { passive: true });
    }

    // Initialize
    update();
})();

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize any components that need DOM to be ready
    console.log('ViewVault marketing site loaded successfully!');

    // Add loading animation cleanup if needed
    const loader = document.querySelector('.loading');
    if (loader) {
        loader.style.display = 'none';
    }
});
