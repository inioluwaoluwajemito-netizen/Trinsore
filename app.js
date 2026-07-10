// Trinsore Events — Frontend Logic
// Author: Inioluwa (Izzy Techub)

// Supabase Configuration
// Configure these variables with your Supabase project credentials to connect your database and storage.
const SUPABASE_URL = 'https://jwzbmplejmzmalspvcsn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3emJtcGxlam16bWFsc3B2Y3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODU0MTEsImV4cCI6MjA4MjU2MTQxMX0.hBbFkAO-gELfX62eNShPj-4ez5ws6-qwORwd0sLgRdw';

let supabaseClient = null;

function initSupabase() {
    const url = SUPABASE_URL || localStorage.getItem('trinsore_supabase_url');
    const key = SUPABASE_ANON_KEY || localStorage.getItem('trinsore_supabase_key');
    
    if (url && key && typeof supabase !== 'undefined') {
        try {
            supabaseClient = supabase.createClient(url, key);
            return { url, key, connected: true };
        } catch (err) {
            console.error('Error creating Supabase client:', err);
        }
    }
    supabaseClient = null;
    return { url: '', key: '', connected: false };
}

// Initial connection attempt
initSupabase();

document.addEventListener('DOMContentLoaded', () => {
    initScrollHeader();
    initMobileNav();
    initPortfolioFilter();
    initTestimonials();
    initInquiryForm();
    initScrollAnimations();
    initCalendar();
    initVideoControl();
    initAdminPanel();
    initLogoTransparency();
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
let portfolioItems = [];

async function loadAndRenderGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    initSupabase();
    
    try {
        if (supabaseClient) {
            const { data, error } = await supabaseClient
                .from('portfolio')
                .select('*')
                .order('id', { ascending: true });
            
            if (error) throw error;
            
            portfolioItems = data.map(item => ({
                id: String(item.id),
                title: item.title,
                category: item.category,
                image: item.image_url,
                alt: item.alt || ''
            }));
        } else {
            const response = await fetch('assets/data/portfolio.json');
            if (!response.ok) throw new Error('Failed to load portfolio items');
            portfolioItems = await response.json();
        }
        
        renderGallery(portfolioItems);
        initLightbox(); // Hook up lightbox event handlers after render
    } catch (err) {
        console.error('Error loading gallery:', err);
        galleryGrid.innerHTML = `<p class="text-center text-muted" style="grid-column: 1/-1; padding: 40px 0;">Error loading portfolio. Please refresh.</p>`;
    }
}

async function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryGrid = document.getElementById('galleryGrid');
    
    if (!galleryGrid) return;
    
    await loadAndRenderGallery();
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(button => button.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            activeCategory = filterValue;
            
            const items = galleryGrid.querySelectorAll('.gallery-item');
            items.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function renderGallery(items) {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = items.map(item => {
        let categoryLabel = 'Service';
        if (item.category === 'bridals') categoryLabel = 'Bridals & Events';
        else if (item.category === 'makeup') categoryLabel = 'Makeup & Gele';
        else if (item.category === 'beads') categoryLabel = 'Beads & Aso Ofi';
        else if (item.category === 'fascinators') categoryLabel = 'Fascinators';
        else if (item.category === 'catering') categoryLabel = 'Catering';
        
        return `
            <div class="gallery-item" data-category="${item.category}">
                <div class="gallery-img-box">
                    <img src="${item.image}" alt="${item.alt}">
                    <div class="gallery-overlay">
                        <span class="gallery-category">${categoryLabel}</span>
                        <h4 class="gallery-item-title">${item.title}</h4>
                        <button class="btn-lightbox-trigger" aria-label="Enlarge image"><i class="fa-solid fa-magnifying-glass-plus"></i></button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
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

/* ==========================================================================
   10. Admin Portal Panel Logic (Syncs to GitHub)
   ========================================================================== */
function initAdminPanel() {
    const trigger = document.getElementById('admin-login-trigger');
    const modal = document.getElementById('adminModal');
    const closeBtn = document.getElementById('adminCloseBtn');
    
    const loginForm = document.getElementById('adminLoginForm');
    const authSection = document.getElementById('adminAuthSection');
    const panelSection = document.getElementById('adminPanelSection');
    
    const adminEmailInput = document.getElementById('adminEmail');
    const adminPasswordInput = document.getElementById('adminPassword');
    const authErrorMsg = document.getElementById('authErrorMsg');
    
    const uploadForm = document.getElementById('adminUploadForm');
    const uploadTitleInput = document.getElementById('uploadTitle');
    const uploadCategorySelect = document.getElementById('uploadCategory');
    const uploadFileInput = document.getElementById('uploadFile');
    const uploadAltInput = document.getElementById('uploadAlt');
    
    const uploadStatus = document.getElementById('uploadStatus');
    const uploadSubmitBtn = document.getElementById('uploadSubmitBtn');
    
    // DB Config Element Selectors
    const statusBadge = document.getElementById('supabaseStatusBadge');
    const configFields = document.getElementById('supabaseConfigFields');
    const configActive = document.getElementById('supabaseConfigActive');
    const connectedUrlText = document.getElementById('connectedUrlText');
    const dbUrlInput = document.getElementById('dbUrl');
    const dbKeyInput = document.getElementById('dbKey');
    const saveDbConfigBtn = document.getElementById('saveDbConfigBtn');
    const disconnectDbBtn = document.getElementById('disconnectDbBtn');
    
    const ADMIN_EMAIL = 'trinsorecartel@gmail.com';
    const ADMIN_PASSWORD = 'Trinsore1';
    
    function updateSupabaseConfigUI() {
        if (!statusBadge) return;
        const config = initSupabase();
        
        // Pre-populate input fields with existing configuration so they don't look blank
        if (config.url && dbUrlInput) dbUrlInput.value = config.url;
        if (config.key && dbKeyInput) dbKeyInput.value = config.key;
        
        if (typeof supabase === 'undefined') {
            statusBadge.textContent = 'CDN Error';
            statusBadge.style.background = 'rgba(239, 68, 68, 0.15)';
            statusBadge.style.color = '#ef4444';
            statusBadge.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            
            configFields.style.display = 'block';
            configActive.style.display = 'none';
            return;
        }
        
        if (config.connected) {
            statusBadge.textContent = 'Connected';
            statusBadge.style.background = 'rgba(16, 185, 129, 0.15)';
            statusBadge.style.color = '#10b981';
            statusBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            
            configFields.style.display = 'none';
            configActive.style.display = 'block';
            connectedUrlText.textContent = config.url;
            
            loadAdminItemsList();
        } else {
            statusBadge.textContent = 'Disconnected';
            statusBadge.style.background = 'rgba(239, 68, 68, 0.15)';
            statusBadge.style.color = '#ef4444';
            statusBadge.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            
            configFields.style.display = 'block';
            configActive.style.display = 'none';
            
            const listContainer = document.getElementById('adminItemsList');
            if (listContainer) listContainer.innerHTML = '<p class="text-muted" style="font-size: 0.85rem; text-align: center;">Supabase not connected. Please save settings above.</p>';
        }
    }
    
    async function loadAdminItemsList() {
        const listContainer = document.getElementById('adminItemsList');
        if (!listContainer) return;
        
        if (!supabaseClient) {
            listContainer.innerHTML = '<p class="text-muted" style="font-size: 0.85rem; text-align: center;">Supabase not connected. Unable to load items list.</p>';
            return;
        }
        
        listContainer.innerHTML = '<p class="text-muted" style="font-size: 0.85rem; text-align: center;"><i class="fa-solid fa-spinner fa-spin"></i> Loading gallery items...</p>';
        
        try {
            const { data, error } = await supabaseClient
                .from('portfolio')
                .select('*')
                .order('id', { ascending: false });
            
            if (error) throw error;
            
            if (data.length === 0) {
                listContainer.innerHTML = '<p class="text-muted" style="font-size: 0.85rem; text-align: center;">No items in portfolio yet.</p>';
                return;
            }
            
            listContainer.innerHTML = data.map(item => {
                let catLabel = item.category;
                if (item.category === 'bridals') catLabel = 'Bridals';
                else if (item.category === 'makeup') catLabel = 'Makeup';
                else if (item.category === 'beads') catLabel = 'Beads';
                else if (item.category === 'fascinators') catLabel = 'Fascinators';
                else if (item.category === 'catering') catLabel = 'Catering';
                
                return `
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.04);">
                        <div style="display: flex; align-items: center; gap: 10px; overflow: hidden; flex-grow: 1;">
                            <img src="${item.image_url}" alt="${item.title}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; border: 1px solid var(--glass-border); flex-shrink: 0;">
                            <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-grow: 1;">
                                <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-light); display: block; overflow: hidden; text-overflow: ellipsis;">${item.title}</span>
                                <span style="font-size: 0.75rem; color: var(--gold-primary); font-family: var(--font-primary);">${catLabel}</span>
                            </div>
                        </div>
                        <button type="button" class="admin-item-delete-btn" data-id="${item.id}" data-title="${item.title}" data-image-url="${item.image_url}" style="background: transparent; color: #ef4444; border: 1px solid rgba(239,68,68,0.2); border-radius: 4px; padding: 4px 8px; font-size: 0.75rem; cursor: pointer; flex-shrink: 0; transition: var(--transition-fast);">
                            <i class="fa-solid fa-trash-can"></i> Delete
                        </button>
                    </div>
                `;
            }).join('');
            
            // Add click listeners to delete buttons
            const deleteButtons = listContainer.querySelectorAll('.admin-item-delete-btn');
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    const title = btn.getAttribute('data-title');
                    const imageUrl = btn.getAttribute('data-image-url');
                    
                    if (confirm(`Are you sure you want to delete "${title}"?`)) {
                        btn.disabled = true;
                        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Deleting...';
                        
                        try {
                            // 1. Delete database record
                            const { error: dbError } = await supabaseClient
                                .from('portfolio')
                                .delete()
                                .eq('id', id);
                            
                            if (dbError) throw dbError;
                            
                            // 2. Delete file from Storage bucket if applicable
                            if (imageUrl.includes('/storage/v1/object/public/portfolio/')) {
                                const pathParts = imageUrl.split('/storage/v1/object/public/portfolio/');
                                if (pathParts.length > 1) {
                                    const filePath = pathParts[1];
                                    await supabaseClient.storage
                                        .from('portfolio')
                                        .remove([filePath]);
                                }
                            }
                            
                            alert('✅ Item deleted successfully!');
                            loadAdminItemsList();
                            loadAndRenderGallery();
                        } catch (err) {
                            console.error('Delete error:', err);
                            alert(`❌ Delete failed: ${err.message}`);
                            btn.disabled = false;
                            btn.innerHTML = '<i class="fa-solid fa-trash-can"></i> Delete';
                        }
                    }
                });
            });
        } catch (err) {
            console.error('Error loading admin items:', err);
            let errMsg = err.message || 'Unknown error';
            
            if (errMsg.includes('relation "public.portfolio" does not exist') || errMsg.includes('relation "portfolio" does not exist')) {
                errMsg = 'Setup Incomplete: The "portfolio" table does not exist in your Supabase database. Please run the SQL command to create it.';
            } else if (errMsg.includes('JWT') || errMsg.includes('Invalid API key')) {
                errMsg = 'Invalid Credentials: Your API Key is incorrect. Please check for typos and save again.';
            }
            
            listContainer.innerHTML = `<div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); padding: 10px; border-radius: 6px;">
                <p style="color: #ef4444; font-size: 0.85rem; margin-bottom: 5px;"><i class="fa-solid fa-circle-exclamation"></i> <strong>Connection Error</strong></p>
                <p style="color: var(--text-muted); font-size: 0.8rem; line-height: 1.4;">${errMsg}</p>
            </div>`;
        }
    }
    
    if (saveDbConfigBtn) {
        saveDbConfigBtn.addEventListener('click', () => {
            if (typeof supabase === 'undefined') {
                alert('⚠️ CDN Error: The Supabase client library could not be loaded. Please verify you are connected to the internet and reload the page.');
                return;
            }
            
            let url = dbUrlInput.value.trim();
            const key = dbKeyInput.value.trim();
            
            if (!url || !key) {
                alert('Please enter both your Supabase Project URL and Anon API Key.');
                return;
            }
            
            // Auto-format project reference ID (e.g. jwzbmplejmzmalspvcsn) into a valid URL
            if (!url.startsWith('http') && !url.includes('.')) {
                url = `https://${url}.supabase.co`;
            }
            
            if (!url.startsWith('https://')) {
                alert('Invalid URL: Your Supabase Project URL must start with "https://".');
                return;
            }
            
            localStorage.setItem('trinsore_supabase_url', url);
            localStorage.setItem('trinsore_supabase_key', key);
            
            alert('✅ Supabase credentials saved successfully!');
            
            updateSupabaseConfigUI();
            loadAndRenderGallery();
        });
    }
    
    if (disconnectDbBtn) {
        disconnectDbBtn.addEventListener('click', () => {
            localStorage.removeItem('trinsore_supabase_url');
            localStorage.removeItem('trinsore_supabase_key');
            if (dbUrlInput) dbUrlInput.value = '';
            if (dbKeyInput) dbKeyInput.value = '';
            
            alert('🔌 Disconnected from Supabase. Reverting to local fallback data.');
            
            updateSupabaseConfigUI();
            loadAndRenderGallery();
        });
    }
    
    if (trigger) {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            modal.setAttribute('aria-hidden', 'false');
            
            if (sessionStorage.getItem('trinsore_admin_authenticated') === 'true') {
                authSection.style.display = 'none';
                panelSection.style.display = 'block';
                updateSupabaseConfigUI();
            } else {
                authSection.style.display = 'block';
                panelSection.style.display = 'none';
                adminEmailInput.value = '';
                adminPasswordInput.value = '';
                authErrorMsg.style.display = 'none';
                adminEmailInput.focus();
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleAuth();
        });
    }
    
    function handleAuth() {
        if (adminEmailInput.value.trim().toLowerCase() === ADMIN_EMAIL && adminPasswordInput.value === ADMIN_PASSWORD) {
            sessionStorage.setItem('trinsore_admin_authenticated', 'true');
            authSection.style.display = 'none';
            panelSection.style.display = 'block';
            updateSupabaseConfigUI();
        } else {
            authErrorMsg.style.display = 'block';
            adminPasswordInput.value = '';
            adminPasswordInput.focus();
        }
    }
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const title = uploadTitleInput.value.trim();
            const category = uploadCategorySelect.value;
            const file = uploadFileInput.files[0];
            const alt = uploadAltInput.value.trim();
            
            if (!file) {
                showStatus('Please select an image file.', 'error');
                return;
            }
            
            if (!supabaseClient) {
                showStatus('Supabase is not configured. Please fill in SUPABASE_URL and SUPABASE_ANON_KEY variables at the top of app.js.', 'error');
                return;
            }
            
            setLoading(true);
            showStatus('Uploading image to Supabase Storage...', 'info');
            
            try {
                const fileExt = file.name.split('.').pop();
                const sanitizeFilename = file.name.split('.')[0].replace(/[^a-z0-9]/gi, '_').toLowerCase();
                const fileNamePath = `${Date.now()}_${sanitizeFilename}.${fileExt}`;
                
                const { data: uploadData, error: uploadError } = await supabaseClient.storage
                    .from('portfolio')
                    .upload(`images/${fileNamePath}`, file, {
                        cacheControl: '3600',
                        upsert: false
                    });
                
                if (uploadError) {
                    let errMsg = uploadError.message;
                    if (errMsg.toLowerCase().includes('bucket not found')) {
                        errMsg = 'Storage bucket "portfolio" was not found in your Supabase project. Please log in to your Supabase Dashboard, go to "Storage", and create a PUBLIC bucket named "portfolio".';
                    } else if (errMsg.toLowerCase().includes('violates row-level security') || errMsg.toLowerCase().includes('row-level security policy')) {
                        errMsg = 'Storage upload blocked by Row-Level Security (RLS). Please open your Supabase Dashboard -> Storage -> Policies, click "New Policy" next to your "portfolio" bucket, and allow INSERT, SELECT, and DELETE permissions for public users.';
                    }
                    throw new Error(errMsg);
                }
                
                showStatus('Retrieving public image URL...', 'info');
                const { data: urlData } = supabaseClient.storage
                    .from('portfolio')
                    .getPublicUrl(`images/${fileNamePath}`);
                
                const imageUrl = urlData.publicUrl;
                
                showStatus('Saving image metadata to database...', 'info');
                const { error: insertError } = await supabaseClient
                    .from('portfolio')
                    .insert([
                        {
                            title: title,
                            category: category,
                            image_url: imageUrl,
                            alt: alt
                        }
                    ]);
                
                if (insertError) {
                    throw new Error(`Database save failed: ${insertError.message}`);
                }
                
                showStatus('✨ Upload Success! The new image is live in your portfolio.', 'success');
                uploadForm.reset();
                
                // Instantly refresh the gallery grid
                await loadAndRenderGallery();
                // Refresh the admin items manager list
                loadAdminItemsList();
            } catch (err) {
                console.error(err);
                showStatus(`Upload Error: ${err.message}`, 'error');
            } finally {
                setLoading(false);
            }
        });
    }
    
    function showStatus(msg, type) {
        uploadStatus.style.display = 'block';
        uploadStatus.textContent = msg;
        uploadStatus.className = 'upload-status';
        
        if (type === 'error') {
            uploadStatus.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
            uploadStatus.style.border = '1px solid rgba(239, 68, 68, 0.3)';
            uploadStatus.style.color = '#ef4444';
        } else if (type === 'success') {
            uploadStatus.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
            uploadStatus.style.border = '1px solid rgba(16, 185, 129, 0.3)';
            uploadStatus.style.color = '#10b981';
        } else {
            uploadStatus.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
            uploadStatus.style.border = '1px solid rgba(212, 175, 55, 0.3)';
            uploadStatus.style.color = 'var(--gold-primary)';
        }
    }
    
    function setLoading(isLoading) {
        const btnText = uploadSubmitBtn.querySelector('.btn-text');
        const btnSpinner = uploadSubmitBtn.querySelector('.btn-spinner');
        
        if (isLoading) {
            uploadSubmitBtn.disabled = true;
            btnText.style.display = 'none';
            btnSpinner.style.display = 'inline-block';
        } else {
            uploadSubmitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnSpinner.style.display = 'none';
        }
    }
}

/* ==========================================================================
   9. Zobolinks Video Control
   ========================================================================== */
function initVideoControl() {
    const setupMuteControl = (videoId, btnId) => {
        const video = document.getElementById(videoId);
        const muteBtn = document.getElementById(btnId);
        
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
    };
    
    setupMuteControl('zoboVideo1', 'videoMuteBtn1');
    setupMuteControl('zoboVideo2', 'videoMuteBtn2');
    setupMuteControl('zoboVideo', 'videoMuteBtn');
}

/* ==========================================================================
   10. Logo White Background Cleaner (Frontend Canvas Helper)
   ========================================================================== */
function initLogoTransparency() {
    const logoImg = document.getElementById('zoboLogoImg');
    if (logoImg) {
        const cleanBg = () => {
            const canvas = document.createElement('canvas');
            canvas.width = logoImg.naturalWidth || logoImg.width;
            canvas.height = logoImg.naturalHeight || logoImg.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(logoImg, 0, 0);
            
            try {
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i+1];
                    const b = data[i+2];
                    // Clean pixels that are very close to white
                    if (r > 235 && g > 235 && b > 235) {
                        data[i+3] = 0; // Set Alpha transparent
                    }
                }
                ctx.putImageData(imgData, 0, 0);
                logoImg.src = canvas.toDataURL();
            } catch (e) {
                console.error('Failed to make logo transparent:', e);
            }
        };
        
        if (logoImg.complete) {
            cleanBg();
        } else {
            logoImg.addEventListener('load', cleanBg);
        }
    }
}
