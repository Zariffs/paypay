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
        
        // Load and display version
        this.loadVersion();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = item.getAttribute('data-target');
                this.navigateInstant(target);
            });
        });
    }

    // Instant navigation for nav icon clicks - no animation
    async navigateInstant(targetPage) {
        if (targetPage === this.currentPage) return;
        
        // Use this.currentPage as source of truth for current element
        const currentEl = document.querySelector(`.page[data-page="${this.currentPage}"]`);
        const targetEl = document.querySelector(`.page[data-page="${targetPage}"]`);
        
        if (!currentEl || !targetEl) return;

        // Load page content if not cached
        if (!this.pageCache[targetPage]) {
            await this.loadPage(targetPage);
        } else {
            targetEl.innerHTML = this.pageCache[targetPage];
        }

        // Cleanup: remove active from ALL pages first
        document.querySelectorAll('.page.active').forEach(p => p.classList.remove('active'));
        
        // Add active only to target
        targetEl.classList.add('active');
        
        this.currentPage = targetPage;
        
        // Re-setup handlers
        this.setupTouchHandlers();
        this.setupCardDrawer();
        
        // Scroll to top
        targetEl.scrollTop = 0;
        window.scrollTo(0, 0);
        
        // Update nav
        this.updateNavState(targetPage);
    }

    // Keep old method for compatibility
    async navigateTo(targetPage) {
        return this.navigateInstant(targetPage);
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
        
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let isDragging = false;
        let direction = null;
        let targetPage = null;
        let currentEl = null;
        let targetEl = null;
        let initialDirection = null; // Lock in direction at start
        
        pagesContainer.addEventListener('touchstart', (e) => {
            if (this.isTransitioning) return;
            
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            currentX = startX;
            isDragging = false;
            direction = null;
            initialDirection = null;
            targetPage = null;
            // Use this.currentPage as source of truth
            currentEl = document.querySelector(`.page[data-page="${this.currentPage}"]`);
            targetEl = null;
            
            // Ensure only current page has active class (cleanup any stale active states)
            document.querySelectorAll('.page.active').forEach(p => {
                if (p.getAttribute('data-page') !== this.currentPage) {
                    p.classList.remove('active');
                }
            });
            // Ensure current page has active class
            if (currentEl && !currentEl.classList.contains('active')) {
                currentEl.classList.add('active');
            }
        }, { passive: true });
        
        pagesContainer.addEventListener('touchmove', async (e) => {
            if (this.isTransitioning || !currentEl) return;
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            currentX = touch.clientX;
            
            // Only start dragging if horizontal movement is dominant
            if (!isDragging) {
                if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
                    // Determine direction and target ONCE at the start
                    const currentIndex = this.pageOrder.indexOf(this.currentPage);
                    
                    // Lock in direction based on initial swipe
                    initialDirection = deltaX > 0 ? 'backward' : 'forward';
                    
                    if (initialDirection === 'backward' && currentIndex > 0) {
                        // Swiping right - go to previous page
                        direction = 'backward';
                        targetPage = this.pageOrder[currentIndex - 1];
                    } else if (initialDirection === 'forward' && currentIndex < this.pageOrder.length - 1) {
                        // Swiping left - go to next page
                        direction = 'forward';
                        targetPage = this.pageOrder[currentIndex + 1];
                    } else {
                        // Can't go in this direction, don't start dragging
                        return;
                    }
                    
                    // Now we have a valid target
                    isDragging = true;
                    targetEl = document.querySelector(`.page[data-page="${targetPage}"]`);
                    
                    if (!targetEl) return;
                    
                    // Load content if needed
                    if (!this.pageCache[targetPage]) {
                        await this.loadPage(targetPage);
                    } else {
                        targetEl.innerHTML = this.pageCache[targetPage];
                    }
                    
                    // Setup pages for swiping
                    pagesContainer.classList.add('swiping');
                    targetEl.classList.add('active');
                    
                    // Position target page to the side based on direction
                    if (direction === 'forward') {
                        targetEl.style.transform = 'translateX(100%)';
                    } else {
                        targetEl.style.transform = 'translateX(-100%)';
                    }
                } else {
                    return;
                }
            }
            
            if (!isDragging || !targetEl || !direction) return;
            
            // Constrain movement to the valid direction
            let constrainedDeltaX = deltaX;
            if (direction === 'forward' && deltaX > 0) {
                constrainedDeltaX = 0; // Don't allow swiping right when going forward
            } else if (direction === 'backward' && deltaX < 0) {
                constrainedDeltaX = 0; // Don't allow swiping left when going backward
            }
            
            // Move both pages with finger
            const screenWidth = window.innerWidth;
            
            if (direction === 'forward') {
                // Swiping left - current goes left, target comes from right
                currentEl.style.transform = `translateX(${constrainedDeltaX}px)`;
                targetEl.style.transform = `translateX(${screenWidth + constrainedDeltaX}px)`;
            } else {
                // Swiping right - current goes right, target comes from left
                currentEl.style.transform = `translateX(${constrainedDeltaX}px)`;
                targetEl.style.transform = `translateX(${-screenWidth + constrainedDeltaX}px)`;
            }
        }, { passive: true });
        
        pagesContainer.addEventListener('touchend', (e) => {
            if (!isDragging || !targetEl || !currentEl) {
                this.resetSwipeState(pagesContainer, currentEl, targetEl);
                isDragging = false;
                return;
            }
            
            const deltaX = currentX - startX;
            const screenWidth = window.innerWidth;
            const threshold = screenWidth * 0.3; // 30% of screen to commit
            
            pagesContainer.classList.remove('swiping');
            pagesContainer.classList.add('snapping');
            
            // Determine if we should complete the swipe or snap back
            const shouldComplete = (direction === 'forward' && deltaX < -threshold) ||
                                   (direction === 'backward' && deltaX > threshold);
            
            if (shouldComplete && targetPage) {
                // Complete the swipe
                currentEl.style.transform = direction === 'forward' ? 'translateX(-100%)' : 'translateX(100%)';
                targetEl.style.transform = 'translateX(0)';
                
                setTimeout(() => {
                    currentEl.classList.remove('active');
                    currentEl.style.transform = '';
                    targetEl.style.transform = '';
                    pagesContainer.classList.remove('snapping');
                    
                    this.currentPage = targetPage;
                    this.updateNavState(targetPage);
                    
                    // Re-setup handlers
                    this.setupTouchHandlers();
                    this.setupCardDrawer();
                    
                    // Reset locals
                    isDragging = false;
                    direction = null;
                    targetPage = null;
                    targetEl = null;
                    currentEl = null;
                }, 300);
            } else {
                // Snap back
                currentEl.style.transform = 'translateX(0)';
                if (direction === 'forward') {
                    targetEl.style.transform = 'translateX(100%)';
                } else {
                    targetEl.style.transform = 'translateX(-100%)';
                }
                
                setTimeout(() => {
                    targetEl.classList.remove('active');
                    targetEl.style.transform = '';
                    currentEl.style.transform = '';
                    pagesContainer.classList.remove('snapping');
                    
                    // Reset locals
                    isDragging = false;
                    direction = null;
                    targetPage = null;
                    targetEl = null;
                    currentEl = null;
                }, 300);
            }
        }, { passive: true });
        
        pagesContainer.addEventListener('touchcancel', () => {
            this.resetSwipeState(pagesContainer, currentEl, targetEl);
            isDragging = false;
            direction = null;
            targetPage = null;
            targetEl = null;
            currentEl = null;
        }, { passive: true });
    }
    
    resetSwipeState(container, currentEl, targetEl) {
        container?.classList.remove('swiping', 'snapping');
        if (currentEl) currentEl.style.transform = '';
        if (targetEl) {
            targetEl.classList.remove('active');
            targetEl.style.transform = '';
        }
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
        
        // Setup drawer pull-down gesture
        this.setupDrawerPullDown(drawer, overlay);
    }
    
    setupDrawerPullDown(drawer, overlay) {
        const handle = drawer.querySelector('.drawer-handle');
        if (!handle) return;
        
        let startY = 0;
        let currentY = 0;
        let isDragging = false;
        const drawerHeight = window.innerHeight * 0.85; // max-height: 85vh
        
        // Tap to close
        handle.addEventListener('click', (e) => {
            if (!isDragging) {
                this.closeDrawer();
            }
        });
        
        // Touch start
        handle.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            isDragging = false;
            drawer.style.transition = 'none';
            overlay.style.transition = 'none';
        }, { passive: true });
        
        // Touch move - drag the drawer
        handle.addEventListener('touchmove', (e) => {
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;
            
            // Only allow dragging down
            if (deltaY > 5) {
                isDragging = true;
                
                // Move drawer down
                drawer.style.transform = `translateY(${deltaY}px)`;
                
                // Fade overlay based on how far down we've dragged
                const progress = Math.min(deltaY / (drawerHeight * 0.4), 1);
                const overlayOpacity = 1 - progress;
                const blurAmount = 4 * (1 - progress);
                
                overlay.style.opacity = overlayOpacity;
                overlay.style.backdropFilter = `blur(${blurAmount}px)`;
                overlay.style.webkitBackdropFilter = `blur(${blurAmount}px)`;
            }
        }, { passive: true });
        
        // Touch end - snap closed or back open
        handle.addEventListener('touchend', (e) => {
            const deltaY = currentY - startY;
            
            // Re-enable transitions
            drawer.style.transition = '';
            overlay.style.transition = '';
            
            if (isDragging && deltaY > 80) {
                // Dragged far enough - close
                this.closeDrawer();
            } else {
                // Snap back open
                drawer.style.transform = '';
                overlay.style.opacity = '';
                overlay.style.backdropFilter = '';
                overlay.style.webkitBackdropFilter = '';
            }
            
            isDragging = false;
            startY = 0;
            currentY = 0;
        }, { passive: true });
        
        // Touch cancel
        handle.addEventListener('touchcancel', () => {
            drawer.style.transition = '';
            overlay.style.transition = '';
            drawer.style.transform = '';
            overlay.style.opacity = '';
            overlay.style.backdropFilter = '';
            overlay.style.webkitBackdropFilter = '';
            isDragging = false;
        }, { passive: true });
    }
    
    openDrawer() {
        const drawer = document.getElementById('cardDrawer');
        const overlay = document.getElementById('drawerOverlay');
        
        if (drawer && overlay) {
            drawer.classList.add('active');
            overlay.classList.add('active');
            // Reset any inline styles from dragging
            drawer.style.transform = '';
            overlay.style.opacity = '';
            overlay.style.backdropFilter = '';
            overlay.style.webkitBackdropFilter = '';
            
            // Prevent background scrolling
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${window.scrollY}px`;
            this.savedScrollY = window.scrollY;
            
            // Prevent touch events from reaching background
            this.preventBgScroll = (e) => {
                // Allow scrolling inside drawer content
                const drawerContent = drawer.querySelector('.drawer-content');
                const card = document.getElementById('tiltCard');
                if (drawerContent?.contains(e.target) || card?.contains(e.target)) {
                    return;
                }
                // Block all other touches on overlay
                if (overlay.contains(e.target)) {
                    e.preventDefault();
                }
            };
            overlay.addEventListener('touchmove', this.preventBgScroll, { passive: false });
            
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
            // Reset any inline styles from dragging
            drawer.style.transform = '';
            overlay.style.opacity = '';
            overlay.style.backdropFilter = '';
            overlay.style.webkitBackdropFilter = '';
            
            // Restore background scrolling
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
            if (this.savedScrollY !== undefined) {
                window.scrollTo(0, this.savedScrollY);
            }
            
            // Remove touch prevention listener
            if (this.preventBgScroll) {
                overlay.removeEventListener('touchmove', this.preventBgScroll);
                this.preventBgScroll = null;
            }
            
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
                    gamma = Math.max(-45, Math.min(45, gamma));
                    beta = Math.max(-45, Math.min(45, beta - 45)); // Offset for natural holding position
                    
                    // Check if there's significant tilt
                    const isTilting = Math.abs(gamma) > 2 || Math.abs(beta) > 2;
                    
                    if (isTilting) {
                        cardInner.classList.add('tilting');
                    } else {
                        cardInner.classList.remove('tilting');
                    }
                    
                    // Apply 3D transform - INCREASED sensitivity (0.8 instead of 0.4)
                    const rotateX = beta * 0.8;
                    const rotateY = gamma * 0.8;
                    
                    cardInner.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
                    
                    // Move shadow based on tilt (opposite direction for realistic lighting)
                    const shadowX = -gamma * 0.5;
                    const shadowY = 20 - beta * 0.3;
                    const shadowX2 = -gamma * 0.3;
                    const shadowY2 = 8 - beta * 0.2;
                    cardInner.style.setProperty('--shadow-x', `${shadowX}px`);
                    cardInner.style.setProperty('--shadow-y', `${shadowY}px`);
                    cardInner.style.setProperty('--shadow-x2', `${shadowX2}px`);
                    cardInner.style.setProperty('--shadow-y2', `${shadowY2}px`);
                    
                    // Move the iridescent shine based on tilt
                    if (iridescent) {
                        const shineX = 50 + gamma * 1.5;
                        const shineY = 30 + beta;
                        iridescent.style.setProperty('--shine-x', `${shineX}%`);
                        iridescent.style.setProperty('--shine-y', `${shineY}%`);
                        iridescent.style.setProperty('--iridescent-pos', `${50 + gamma * 2}% ${50 + beta * 2}%`);
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
        let isTouchingCard = false;
        
        // Only start tilt when touching the card
        card.addEventListener('touchstart', (e) => {
            isTouchingCard = true;
            e.stopPropagation();
        }, { passive: true });
        
        this.touchTiltHandler = (e) => {
            if (!isTouchingCard) return;
            if (!document.getElementById('cardDrawer')?.classList.contains('active')) return;
            
            const touch = e.touches[0];
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (touch.clientX - centerX) / (rect.width / 2);
            const deltaY = (touch.clientY - centerY) / (rect.height / 2);
            
            // Add tilting class to show iridescent effect
            cardInner.classList.add('tilting');
            
            // INCREASED rotation (25 instead of 15)
            const rotateY = deltaX * 25;
            const rotateX = -deltaY * 25;
            
            cardInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            // Move shadow based on tilt (opposite direction for realistic lighting)
            const shadowX = -deltaX * 15;
            const shadowY = 20 - deltaY * 10;
            const shadowX2 = -deltaX * 8;
            const shadowY2 = 8 - deltaY * 5;
            cardInner.style.setProperty('--shadow-x', `${shadowX}px`);
            cardInner.style.setProperty('--shadow-y', `${shadowY}px`);
            cardInner.style.setProperty('--shadow-x2', `${shadowX2}px`);
            cardInner.style.setProperty('--shadow-y2', `${shadowY2}px`);
            
            if (iridescent) {
                const shineX = 50 + deltaX * 50;
                const shineY = 30 + deltaY * 40;
                iridescent.style.setProperty('--shine-x', `${shineX}%`);
                iridescent.style.setProperty('--shine-y', `${shineY}%`);
                iridescent.style.setProperty('--iridescent-pos', `${50 + deltaX * 80}% ${50 + deltaY * 80}%`);
            }
        };
        
        this.touchTiltEndHandler = () => {
            if (!isTouchingCard) return;
            isTouchingCard = false;
            cardInner.classList.remove('tilting');
            cardInner.style.transform = 'rotateX(0deg) rotateY(0deg)';
            // Reset shadow
            cardInner.style.setProperty('--shadow-x', '0px');
            cardInner.style.setProperty('--shadow-y', '20px');
            cardInner.style.setProperty('--shadow-x2', '0px');
            cardInner.style.setProperty('--shadow-y2', '8px');
            if (iridescent) {
                iridescent.style.setProperty('--shine-x', '50%');
                iridescent.style.setProperty('--shine-y', '30%');
            }
        };
        
        // Store reference for cleanup
        this.cardTouchStartHandler = () => { isTouchingCard = true; };
        
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

    async loadVersion() {
        try {
            // Add cache-busting to ensure fresh version
            const response = await fetch(`version.json?t=${Date.now()}`);
            if (response.ok) {
                const version = await response.json();
                const versionText = `v${version.build} • ${version.commit}`;
                
                // Update all version footers (could be multiple on different pages)
                document.querySelectorAll('#versionFooter, .version-footer').forEach(el => {
                    el.textContent = versionText;
                });
                
                // Store version info for later page loads
                this.versionText = versionText;
                
                // Console log for debugging
                console.log(`AMEX App v${version.build} (${version.commit}) - ${version.date}`);
            }
        } catch (e) {
            console.log('Version info not available');
        }
    }
}

// Initialize app
const app = new AmexApp();
