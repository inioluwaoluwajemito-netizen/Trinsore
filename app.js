// Trinsore Events — Frontend Logic
// Author: Inioluwa (Izzy Techub)

document.addEventListener('DOMContentLoaded', () => {
    initScrollHeader();
    initMobileNav();
    initPortfolioFilter();
    initLightbox();
    initTestimonials();
    initInquiryForm();
    initScrollAnimations();
});

/* ==========================================================================
   1. Header Scroll Effect
   ========================================================================== */
function initScrollHeader() {
    const header = document.getElementById('header');
    
    const checkScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Run once at load
}

/* ==========================================================================
   2. Mobile Drawer Navigation
   ========================================================================== */
function initMobileNav() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    
    const toggleMenu = () => {
        const isOpen = mobileDrawer.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', isOpen);
        mobileDrawer.setAttribute('aria-hidden', !isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : ''; // Prevent scroll behind drawer
    };
    
    const closeMenu = () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    mobileToggle.addEventListener('click', toggleMenu);
    
    // Close when clicking a link
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close when clicking outside drawer
    document.addEventListener('click', (e) => {
        if (mobileDrawer.classList.contains('open') && 
            !mobileDrawer.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
            closeMenu();
        }
    });
}

/* ==========================================================================
   3. Portfolio Filtering System
   ========================================================================== */
let activeCategory = 'all';

function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from previous active button
            filterButtons.forEach(button => button.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            activeCategory = filterValue;
            
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || itemCategory === filterValue) {
                    // Show item
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    // Hide item
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300); // match transition speed
                }
            });
        });
    });
}

/* ==========================================================================
   4. Lightbox Component (Full-Screen Image Viewer)
   ========================================================================== */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCat = document.getElementById('lightbox-cat');
    const lightboxTitle = document.getElementById('lightbox-title');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    
    let currentGalleryIndex = 0;
    let visibleItems = [];

    // Get only the currently visible items (based on filter)
    const updateVisibleItems = () => {
        const allItems = Array.from(document.querySelectorAll('.gallery-item'));
        visibleItems = allItems.filter(item => {
            if (activeCategory === 'all') return true;
            return item.getAttribute('data-category') === activeCategory;
        });
    };

    const openLightbox = (index) => {
        updateVisibleItems();
        currentGalleryIndex = index;
        
        const currentItem = visibleItems[currentGalleryIndex];
        const img = currentItem.querySelector('img');
        const cat = currentItem.querySelector('.gallery-category').textContent;
        const title = currentItem.querySelector('.gallery-item-title').textContent;
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCat.textContent = cat;
        lightboxTitle.textContent = title;
        
        lightbox.style.display = 'flex';
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.style.display = 'none';
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        lightboxImg.src = '';
    };

    const showNextImage = () => {
        if (visibleItems.length <= 1) return;
        currentGalleryIndex = (currentGalleryIndex + 1) % visibleItems.length;
        openLightbox(currentGalleryIndex);
    };

    const showPrevImage = () => {
        if (visibleItems.length <= 1) return;
        currentGalleryIndex = (currentGalleryIndex - 1 + visibleItems.length) % visibleItems.length;
        openLightbox(currentGalleryIndex);
    };

    // Attach click events to all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        const trigger = item.querySelector('.btn-lightbox-trigger');
        const imgBox = item.querySelector('.gallery-img-box');
        
        // Open when clicking the trigger icon or the entire card on mobile
        const clickHandler = (e) => {
            updateVisibleItems();
            const itemIndex = visibleItems.indexOf(item);
            if (itemIndex !== -1) {
                openLightbox(itemIndex);
            }
        };

        trigger.addEventListener('click', clickHandler);
        imgBox.addEventListener('click', (e) => {
            if (e.target !== trigger && !trigger.contains(e.target)) {
                clickHandler(e);
            }
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    // Close when clicking outside content (backdrop)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        }
    });
}

/* ==========================================================================
   5. Testimonials Slider
   ========================================================================== */
function initTestimonials() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    
    let currentSlide = 0;
    let slideInterval;
    
    const showSlide = (index) => {
        // Remove active class from all
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active to current
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    };
    
    const nextSlide = () => {
        let index = (currentSlide + 1) % slides.length;
        showSlide(index);
    };

    const prevSlide = () => {
        let index = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(index);
    };

    // Controls
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetTimer();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetTimer();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetTimer();
        });
    });

    // Auto slideshow
    const startTimer = () => {
        slideInterval = setInterval(nextSlide, 6000);
    };

    const resetTimer = () => {
        clearInterval(slideInterval);
        startTimer();
    };

    startTimer();

    // Pause on hover
    const wrapper = document.querySelector('.testimonials-carousel-wrapper');
    wrapper.addEventListener('mouseenter', () => clearInterval(slideInterval));
    wrapper.addEventListener('mouseleave', startTimer);
}

/* ==========================================================================
   6. Prefill Service Helper (Exposed globally)
   ========================================================================== */
window.prefillService = function(serviceName) {
    const eventTypeSelect = document.getElementById('eventType');
    const messageField = document.getElementById('clientMessage');
    
    if (eventTypeSelect) {
        eventTypeSelect.value = serviceName;
        // Trigger focus
        eventTypeSelect.focus();
    }
    
    if (messageField) {
        messageField.placeholder = `Hello Trinsore Events, I am interested in inquiring about your ${serviceName}...`;
    }
};

/* ==========================================================================
   7. Form Validation & WhatsApp Submission
   ========================================================================== */
function initInquiryForm() {
    const form = document.getElementById('inquiryForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            sendWhatsAppMessage();
        }
    });

    // Clean errors on input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const group = input.closest('.form-group');
            if (group) {
                group.classList.remove('has-error');
            }
        });
    });
}

function validateForm() {
    let isValid = true;
    
    const name = document.getElementById('clientName');
    const phone = document.getElementById('clientPhone');
    const eventType = document.getElementById('eventType');
    const message = document.getElementById('clientMessage');
    
    // Validate Name
    if (!name.value.trim()) {
        showError(name);
        isValid = false;
    }
    
    // Validate Phone (Basic digits and length check)
    const phoneRegex = /^[0-9+\s-]{8,15}$/;
    if (!phone.value.trim() || !phoneRegex.test(phone.value.trim())) {
        showError(phone);
        isValid = false;
    }
    
    // Validate Event Type Select
    if (!eventType.value) {
        showError(eventType);
        isValid = false;
    }
    
    // Validate Message
    if (!message.value.trim()) {
        showError(message);
        isValid = false;
    }
    
    return isValid;
}

function showError(element) {
    const group = element.closest('.form-group');
    if (group) {
        group.classList.add('has-error');
    }
}

function sendWhatsAppMessage() {
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const eventType = document.getElementById('eventType').value;
    const eventDate = document.getElementById('eventDate').value;
    const message = document.getElementById('clientMessage').value.trim();
    
    // Format Date
    let dateStr = "Not specified";
    if (eventDate) {
        const dateObj = new Date(eventDate);
        dateStr = dateObj.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    // Format Message Text nicely
    const formattedText = 
`*TRINSORE EVENTS CONSULTATION*
---------------------------------------
*Client Name:* ${name}
*Phone Number:* ${phone}
*Requested Service:* ${eventType}
*Preferred Event Date:* ${dateStr}

*Message details:*
${message}
---------------------------------------
_Sent via Trinsore Events Inquiry Web Portal_`;

    // Encode text
    const encodedText = encodeURIComponent(formattedText);
    
    // Primary WhatsApp number (Trinsore Events)
    const whatsappNum = "2348137270255";
    
    // Redirect to WhatsApp API
    const waUrl = `https://wa.me/${whatsappNum}?text=${encodedText}`;
    
    // Open in new tab
    window.open(waUrl, '_blank');
}

/* ==========================================================================
   8. Scroll Animations (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(el => observer.observe(el));
}
