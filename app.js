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
    initCalendar();
    initVideoControl();
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

window.prefillZobo = function(productName) {
    const eventTypeSelect = document.getElementById('eventType');
    const messageField = document.getElementById('clientMessage');
    
    if (eventTypeSelect) {
        eventTypeSelect.value = "Zobolinks Hibiscus Drinks";
        eventTypeSelect.focus();
    }
    
    if (messageField) {
        messageField.value = `Hello Trinsore Events, I'd like to place an order/inquire for your signature Zobolinks drink: *${productName}* for my upcoming event. Please share pricing and options.`;
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
    const eventDate = document.getElementById('eventDate');
    const timeSlot = document.getElementById('selectedTimeSlot');
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
    
    // Validate Event Date
    if (!eventDate.value) {
        showError(eventDate);
        isValid = false;
    }
    
    // Validate Time Slot
    if (document.getElementById('timeSlotGroup').style.display !== 'none' && !timeSlot.value) {
        showError(timeSlot);
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
    const timeSlot = document.getElementById('selectedTimeSlot').value;
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
*Consultation Time:* ${timeSlot || 'Not specified'}

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

/* ==========================================================================
   9. Custom Interactive Calendar & Time Slots
   ========================================================================== */
function initCalendar() {
    const calMonthYear = document.getElementById('calMonthYear');
    const calendarDaysGrid = document.getElementById('calendarDaysGrid');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    
    const eventDateInput = document.getElementById('eventDateInput');
    const eventDateHidden = document.getElementById('eventDate');
    const timeSlotGroup = document.getElementById('timeSlotGroup');
    const selectedTimeSlotInput = document.getElementById('selectedTimeSlot');
    const timeSlotsContainer = document.getElementById('timeSlotsContainer');
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth(); // 0-11
    let currentYear = currentDate.getFullYear();
    
    let selectedDate = null;
    
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    const renderCalendar = () => {
        // Clear previous grid
        calendarDaysGrid.innerHTML = '';
        
        // Update Title Header
        calMonthYear.textContent = `${months[currentMonth]} ${currentYear}`;
        
        // Get first day of the month and number of days
        const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 (Sun) to 6 (Sat)
        const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Spacer cells for previous month empty offsets
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-day', 'empty');
            calendarDaysGrid.appendChild(emptyCell);
        }
        
        // Get today's details for comparison
        const today = new Date();
        const todayDate = today.getDate();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();
        
        // Populate days
        for (let day = 1; day <= totalDays; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day');
            dayCell.textContent = day;
            
            // Check if day is in the past
            const thisDayDate = new Date(currentYear, currentMonth, day);
            const isPast = new Date(todayYear, todayMonth, todayDate) > thisDayDate;
            
            if (isPast) {
                dayCell.classList.add('disabled');
            } else {
                // Highlight today
                if (day === todayDate && currentMonth === todayMonth && currentYear === todayYear) {
                    dayCell.classList.add('today');
                }
                
                // Highlight selected date
                if (selectedDate && 
                    day === selectedDate.getDate() && 
                    currentMonth === selectedDate.getMonth() && 
                    currentYear === selectedDate.getFullYear()) {
                    dayCell.classList.add('selected');
                }
                
                // Click listener to select date
                dayCell.addEventListener('click', () => {
                    // Remove selected styling from others
                    const activeDays = calendarDaysGrid.querySelectorAll('.calendar-day.selected');
                    activeDays.forEach(d => d.classList.remove('selected'));
                    
                    dayCell.classList.add('selected');
                    selectedDate = new Date(currentYear, currentMonth, day);
                    
                    // Format and populate display inputs
                    const yearStr = selectedDate.getFullYear();
                    const monthStr = String(selectedDate.getMonth() + 1).padStart(2, '0');
                    const dayStr = String(selectedDate.getDate()).padStart(2, '0');
                    
                    // Format visual date (e.g. Saturday, August 15, 2026)
                    const visualDate = selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    
                    eventDateHidden.value = `${yearStr}-${monthStr}-${dayStr}`;
                    eventDateInput.value = visualDate;
                    
                    // Remove error if any
                    const group = eventDateHidden.closest('.form-group');
                    if (group) group.classList.remove('has-error');
                    
                    // Display and slide time slots group down
                    timeSlotGroup.style.display = 'block';
                    
                    // Trigger scroll animation check or view slots
                    timeSlotGroup.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                });
            }
            
            calendarDaysGrid.appendChild(dayCell);
        }
    };
    
    // Month toggle navigation
    prevMonthBtn.addEventListener('click', () => {
        // Restrict navigating into past months
        const today = new Date();
        const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const targetDate = new Date(currentYear, currentMonth - 1, 1);
        
        if (targetDate >= minDate) {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        }
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    // Time slots selection
    const timeSlots = timeSlotsContainer.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            timeSlots.forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            selectedTimeSlotInput.value = slot.getAttribute('data-time');
            
            // Clean error states
            const group = selectedTimeSlotInput.closest('.form-group');
            if (group) group.classList.remove('has-error');
        });
    });
    
    // Initial Render
    renderCalendar();
}

/* ==========================================================================
   9. Zobolinks Video Control
   ========================================================================== */
function initVideoControl() {
    const video = document.getElementById('zoboVideo');
    const muteBtn = document.getElementById('videoMuteBtn');
    
    if (video && muteBtn) {
        muteBtn.addEventListener('click', () => {
            video.muted = !video.muted;
            const icon = muteBtn.querySelector('i');
            if (video.muted) {
                icon.className = 'fa-solid fa-volume-xmark';
            } else {
                icon.className = 'fa-solid fa-volume-high';
            }
        });
    }
}
