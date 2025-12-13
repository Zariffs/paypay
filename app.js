/**
 * AMEX App - Main JavaScript
 * Handles page navigation, transitions, and touch interactions
 */

class AmexApp {
    constructor() {
        this.currentPage = 'home';
        this.isTransitioning = false;
        this.pageCache = {};
        this.pageOrder = ['home', 'membership', 'offers', 'account'];
        
        // Swipe tracking
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchStartTime = 0;
        this.edgeThreshold = 30; // pixels from edge to trigger swipe
        this.swipeThreshold = 80; // minimum swipe distance
        
        this.init();
    }

    async init() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    async setup() {
        // Cache home page content (already loaded)
        const homePage = document.querySelector('.page[data-page="home"]');
        if (homePage) {
            this.pageCache['home'] = homePage.innerHTML;
        }

        // Setup navigation
        this.setupNavigation();
        
        // Initialize nav indicator position
        this.initNavIndicator();
        
        // Setup touch handlers for buttons
        this.setupTouchHandlers();
        
        // Setup card drawer
        this.setupCardDrawer();
        
        // Setup edge swipe navigation
        this.setupEdgeSwipe();
        
        // Register service worker
        this.registerServiceWorker();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = item.getAttribute('data-target');
                this.navigateTo(target);
            });
        });
    }

    async navigateTo(targetPage) {
        if (targetPage === this.currentPage || this.isTransitioning) return;
        
        this.isTransitioning = true;

        const pagesContainer = document.querySelector('.pages-container');
        const currentEl = document.querySelector('.page.active');
        const targetEl = document.querySelector(`.page[data-page="${targetPage}"]`);
        
        // Determine direction
        const currentIndex = this.pageOrder.indexOf(this.currentPage);
        const targetIndex = this.pageOrder.indexOf(targetPage);
        const direction = targetIndex > currentIndex ? 'forward' : 'backward';

        // Load page content if not cached
        if (!this.pageCache[targetPage]) {
            await this.loadPage(targetPage);
        } else {
            targetEl.innerHTML = this.pageCache[targetPage];
        }

        // Re-setup touch handlers for new content
        this.setupTouchHandlers();
        this.setupCardDrawer();

        // Add transition classes for the morphing effect
        currentEl.classList.add('transitioning-out', `morph-${direction}`);
        targetEl.classList.add('transitioning-in', `morph-${direction}`);
        
        // Small delay to ensure classes are applied
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                currentEl.classList.add('out');
                targetEl.classList.add('active', 'in');
            });
        });

        // After animation completes
        setTimeout(() => {
            currentEl.classList.remove('active', 'transitioning-out', 'out', 'morph-forward', 'morph-backward');
            targetEl.classList.remove('transitioning-in', 'in', 'morph-forward', 'morph-backward');
            
            this.currentPage = targetPage;
            this.isTransitioning = false;
            
            // Scroll to top
            targetEl.scrollTop = 0;
            window.scrollTo(0, 0);
        }, 500);

        // Update nav active state
        this.updateNavState(targetPage);
    }

    async loadPage(pageName) {
        try {
            const response = await fetch(`pages/${pageName}.html`);
            if (response.ok) {
                const html = await response.text();
                this.pageCache[pageName] = html;
                
                const pageEl = document.querySelector(`.page[data-page="${pageName}"]`);
                if (pageEl) {
                    pageEl.innerHTML = html;
                }
            }
        } catch (error) {
            console.error(`Failed to load page: ${pageName}`, error);
        }
    }

    updateNavState(targetPage) {
        const navItems = document.querySelectorAll('.nav-item');
        const indicator = document.querySelector('.nav-indicator');
        
        navItems.forEach(item => {
            item.classList.remove('active');
            item.removeAttribute('aria-current');
        });
        
        const activeNav = document.querySelector(`.nav-item[data-target="${targetPage}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
            activeNav.setAttribute('aria-current', 'page');
            
            // Smooth slide the indicator using transform
            if (indicator) {
                const newIndex = parseInt(activeNav.getAttribute('data-index') || '0');
                const navItem = document.querySelector('.nav-item');
                const navWidth = navItem.offsetWidth;
                const gap = 8;
                
                // Use translateX for smooth GPU-accelerated animation
                const translateX = newIndex * (navWidth + gap);
                indicator.style.transform = `translateX(${translateX}px)`;
                
                this.currentNavIndex = newIndex;
            }
        }
    }

    setupTouchHandlers() {
        const pressableButtons = document.querySelectorAll('.section-plus, .rewards-btn, .insights-link, .offer-add-btn, .offer-action, .action-card, .menu-item');
        
        pressableButtons.forEach(btn => {
            // Clone to remove all existing listeners
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('touchstart', (e) => {
                newBtn.classList.add('pressed');
            }, { passive: true });
            
            newBtn.addEventListener('touchend', (e) => {
                // Instant removal for snappy feel
                newBtn.classList.remove('pressed');
            }, { passive: true });
            
            newBtn.addEventListener('touchcancel', (e) => {
                newBtn.classList.remove('pressed');
            }, { passive: true });
            
            // Mouse events for desktop
            newBtn.addEventListener('mousedown', (e) => {
                newBtn.classList.add('pressed');
            });
            
            newBtn.addEventListener('mouseup', (e) => {
                newBtn.classList.remove('pressed');
            });
            
            newBtn.addEventListener('mouseleave', (e) => {
                newBtn.classList.remove('pressed');
            });
        });
    }

    initNavIndicator() {
        // Set initial indicator position using transform
        const activeNav = document.querySelector('.nav-item.active');
        const indicator = document.querySelector('.nav-indicator');
        
        if (activeNav && indicator) {
            const index = parseInt(activeNav.getAttribute('data-index') || '0');
            const navWidth = activeNav.offsetWidth;
            const gap = 8;
            
            // Use translateX for GPU-accelerated positioning
            const translateX = index * (navWidth + gap);
            indicator.style.transform = `translateX(${translateX}px)`;
            this.currentNavIndex = index;
        }
    }

    setupEdgeSwipe() {
        const pagesContainer = document.querySelector('.pages-container');
        if (!pagesContainer) return;
        
        pagesContainer.addEventListener('touchstart', (e) => {
            if (this.isTransitioning) return;
            
            const touch = e.touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
            this.touchStartTime = Date.now();
        }, { passive: true });
        
        pagesContainer.addEventListener('touchend', (e) => {
            if (this.isTransitioning) return;
            
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - this.touchStartX;
            const deltaY = touch.clientY - this.touchStartY;
            const deltaTime = Date.now() - this.touchStartTime;
            
            // Check if it's a horizontal swipe (more horizontal than vertical)
            if (Math.abs(deltaX) < Math.abs(deltaY)) return;
            
            // Check if swipe started from edge
            const screenWidth = window.innerWidth;
            const startedFromLeftEdge = this.touchStartX < this.edgeThreshold;
            const startedFromRightEdge = this.touchStartX > screenWidth - this.edgeThreshold;
            
            // Check swipe distance and speed
            const isValidSwipe = Math.abs(deltaX) > this.swipeThreshold || 
                                 (Math.abs(deltaX) > 40 && deltaTime < 300);
            
            if (!isValidSwipe) return;
            
            const currentIndex = this.pageOrder.indexOf(this.currentPage);
            
            // Swipe right from left edge = go back
            if (startedFromLeftEdge && deltaX > 0 && currentIndex > 0) {
                this.navigateTo(this.pageOrder[currentIndex - 1]);
            }
            // Swipe left from right edge = go forward
            else if (startedFromRightEdge && deltaX < 0 && currentIndex < this.pageOrder.length - 1) {
                this.navigateTo(this.pageOrder[currentIndex + 1]);
            }
        }, { passive: true });
    }

    setupCardDrawer() {
        const accountTops = document.querySelectorAll('.account-top');
        const drawer = document.getElementById('cardDrawer');
        const overlay = document.getElementById('drawerOverlay');
        
        if (!drawer || !overlay) return;
        
        accountTops.forEach(accountTop => {
            // Remove existing to avoid duplicates
            accountTop.removeEventListener('click', this.openDrawer);
            
            accountTop.addEventListener('click', () => {
                this.openDrawer();
            });
        });
        
        // Close on overlay click
        overlay.addEventListener('click', () => {
            this.closeDrawer();
        });
        
        // Close on drawer handle swipe down (simple version - just click)
        const handle = drawer.querySelector('.drawer-handle');
        if (handle) {
            handle.addEventListener('click', () => {
                this.closeDrawer();
            });
        }
    }
    
    openDrawer() {
        const drawer = document.getElementById('cardDrawer');
        const overlay = document.getElementById('drawerOverlay');
        
        if (drawer && overlay) {
            drawer.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Start gyroscope tilt effect
            this.startGyroscopeTilt();
        }
    }
    
    closeDrawer() {
        const drawer = document.getElementById('cardDrawer');
        const overlay = document.getElementById('drawerOverlay');
        
        if (drawer && overlay) {
            drawer.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Stop gyroscope tilt effect
            this.stopGyroscopeTilt();
        }
    }
    
    startGyroscopeTilt() {
        const card = document.getElementById('tiltCard');
        const cardInner = card?.querySelector('.drawer-card-inner');
        const iridescent = card?.querySelector('.drawer-card-iridescent');
        
        if (!card || !cardInner) return;
        
        // Check if device orientation is available
        if (window.DeviceOrientationEvent) {
            // For iOS 13+ we need to request permission
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                // We'll use touch-based tilt as fallback since we can't request permission without user gesture
                this.setupTouchTilt(card, cardInner, iridescent);
            } else {
                // Android and older iOS
                this.gyroHandler = (e) => {
                    if (!document.getElementById('cardDrawer')?.classList.contains('active')) return;
                    
                    // Get device orientation
                    let gamma = e.gamma || 0; // Left/right tilt (-90 to 90)
                    let beta = e.beta || 0;   // Front/back tilt (-180 to 180)
                    
                    // Clamp values
                    gamma = Math.max(-30, Math.min(30, gamma));
                    beta = Math.max(-30, Math.min(30, beta - 45)); // Offset for natural holding position
                    
                    // Apply 3D transform
                    const rotateX = beta * 0.4;
                    const rotateY = gamma * 0.4;
                    
                    cardInner.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
                    
                    // Move the iridescent shine
                    if (iridescent) {
                        const shineX = 50 + gamma;
                        const shineY = 30 + beta * 0.5;
                        iridescent.style.setProperty('--shine-x', `${shineX}%`);
                        iridescent.style.setProperty('--shine-y', `${shineY}%`);
                        iridescent.style.setProperty('--iridescent-pos', `${50 + gamma}% ${50 + beta}%`);
                    }
                };
                
                window.addEventListener('deviceorientation', this.gyroHandler, true);
            }
        } else {
            // Fallback to touch-based tilt
            this.setupTouchTilt(card, cardInner, iridescent);
        }
    }
    
    setupTouchTilt(card, cardInner, iridescent) {
        this.touchTiltHandler = (e) => {
            if (!document.getElementById('cardDrawer')?.classList.contains('active')) return;
            
            const touch = e.touches[0];
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (touch.clientX - centerX) / (rect.width / 2);
            const deltaY = (touch.clientY - centerY) / (rect.height / 2);
            
            const rotateY = deltaX * 15;
            const rotateX = -deltaY * 15;
            
            cardInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            if (iridescent) {
                const shineX = 50 + deltaX * 30;
                const shineY = 30 + deltaY * 20;
                iridescent.style.setProperty('--shine-x', `${shineX}%`);
                iridescent.style.setProperty('--shine-y', `${shineY}%`);
            }
        };
        
        this.touchTiltEndHandler = () => {
            cardInner.style.transform = 'rotateX(0deg) rotateY(0deg)';
            if (iridescent) {
                iridescent.style.setProperty('--shine-x', '50%');
                iridescent.style.setProperty('--shine-y', '30%');
            }
        };
        
        document.addEventListener('touchmove', this.touchTiltHandler, { passive: true });
        document.addEventListener('touchend', this.touchTiltEndHandler, { passive: true });
    }
    
    stopGyroscopeTilt() {
        if (this.gyroHandler) {
            window.removeEventListener('deviceorientation', this.gyroHandler, true);
            this.gyroHandler = null;
        }
        if (this.touchTiltHandler) {
            document.removeEventListener('touchmove', this.touchTiltHandler);
            document.removeEventListener('touchend', this.touchTiltEndHandler);
            this.touchTiltHandler = null;
            this.touchTiltEndHandler = null;
        }
        
        // Reset card position
        const cardInner = document.querySelector('.drawer-card-inner');
        if (cardInner) {
            cardInner.style.transform = 'rotateX(0deg) rotateY(0deg)';
        }
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(err => {
                console.log('SW registration failed:', err);
            });
        }
    }
}

// Initialize app
const app = new AmexApp();
