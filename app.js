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
        const indicator = document.querySelector('.nav-indicator');
        if (!pagesContainer) return;
        
        let startX = 0;
        let startY = 0;
        let isSwiping = false;
        let direction = null;
        let targetPage = null;
        let currentEl = null;
        let targetEl = null;
        const commitThreshold = 0.35; // 35% of screen to commit navigation
        
        pagesContainer.addEventListener('touchstart', (e) => {
            if (this.isTransitioning) return;
            
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            isSwiping = false;
            direction = null;
            targetPage = null;
            currentEl = document.querySelector(`.page[data-page="${this.currentPage}"]`);
            targetEl = null;
            
            // Disable nav indicator transition during swipe
            if (indicator) {
                indicator.style.transition = 'none';
            }
        }, { passive: true });
        
        pagesContainer.addEventListener('touchmove', async (e) => {
            if (this.isTransitioning || !currentEl) return;
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            const screenWidth = window.innerWidth;
            
            // Determine if we should start swiping
            if (!isSwiping && Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
                const currentIndex = this.pageOrder.indexOf(this.currentPage);
                
                // Determine direction
                if (deltaX > 0 && currentIndex > 0) {
                    direction = 'backward';
                    targetPage = this.pageOrder[currentIndex - 1];
                } else if (deltaX < 0 && currentIndex < this.pageOrder.length - 1) {
                    direction = 'forward';
                    targetPage = this.pageOrder[currentIndex + 1];
                } else {
                    return;
                }
                
                isSwiping = true;
                targetEl = document.querySelector(`.page[data-page="${targetPage}"]`);
                
                // Preload and show target page behind current
                if (targetEl) {
                    if (!this.pageCache[targetPage]) {
                        await this.loadPage(targetPage);
                    } else {
                        targetEl.innerHTML = this.pageCache[targetPage];
                    }
                    // Show target page underneath with 0 opacity
                    targetEl.classList.add('active');
                    targetEl.style.opacity = '0';
                }
            }
            
            if (!isSwiping || !targetEl) return;
            
            // Calculate progress (0 to 1) based on screen width
            // Clamp so it doesn't go beyond 0-1
            const progress = Math.max(0, Math.min(1, Math.abs(deltaX) / screenWidth));
            
            // Cross-fade: current fades out, target fades in
            currentEl.style.opacity = 1 - progress;
            targetEl.style.opacity = progress;
            
            // Move nav indicator based on progress
            if (indicator) {
                const currentIndex = this.pageOrder.indexOf(this.currentPage);
                const targetIndex = this.pageOrder.indexOf(targetPage);
                const navItem = document.querySelector('.nav-item');
                if (navItem) {
                    const navWidth = navItem.offsetWidth;
                    const gap = 8;
                    const currentPos = currentIndex * (navWidth + gap);
                    const targetPos = targetIndex * (navWidth + gap);
                    const currentTranslate = currentPos + (targetPos - currentPos) * progress;
                    indicator.style.transform = `translateX(${currentTranslate}px)`;
                }
            }
        }, { passive: true });
        
        pagesContainer.addEventListener('touchend', async (e) => {
            // Re-enable nav indicator transition
            if (indicator) {
                indicator.style.transition = '';
            }
            
            if (!isSwiping || !currentEl) {
                if (currentEl) currentEl.style.opacity = '';
                isSwiping = false;
                return;
            }
            
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - startX;
            const screenWidth = window.innerWidth;
            const progress = Math.abs(deltaX) / screenWidth;
            
            // Capture references before async operations
            const _currentEl = currentEl;
            const _targetEl = targetEl;
            const _targetPage = targetPage;
            
            // Check if swipe exceeds threshold
            if (progress >= commitThreshold && _targetPage && _targetEl) {
                // Immediately update nav state with smooth transition
                this.currentPage = _targetPage;
                this.updateNavState(_targetPage);
                
                // Complete the fade animation
                _currentEl.style.transition = 'opacity 0.2s ease-out';
                _targetEl.style.transition = 'opacity 0.2s ease-out';
                _currentEl.style.opacity = '0';
                _targetEl.style.opacity = '1';
                
                setTimeout(() => {
                    if (_currentEl) {
                        _currentEl.classList.remove('active');
                        _currentEl.style.opacity = '';
                        _currentEl.style.transition = '';
                    }
                    if (_targetEl) {
                        _targetEl.style.transition = '';
                    }
                    
                    // Re-setup handlers
                    this.setupTouchHandlers();
                    this.setupCardDrawer();
                    
                    this.isTransitioning = false;
                }, 200);
            } else {
                // Snap back - restore opacity and nav position
                if (_currentEl) {
                    _currentEl.style.transition = 'opacity 0.2s ease-out';
                    _currentEl.style.opacity = '1';
                }
                
                if (_targetEl) {
                    _targetEl.style.transition = 'opacity 0.2s ease-out';
                    _targetEl.style.opacity = '0';
                    
                    setTimeout(() => {
                        if (_targetEl) {
                            _targetEl.classList.remove('active');
                            _targetEl.style.opacity = '';
                            _targetEl.style.transition = '';
                        }
                    }, 200);
                }
                
                this.updateNavState(this.currentPage);
                
                setTimeout(() => {
                    if (_currentEl) {
                        _currentEl.style.transition = '';
                    }
                }, 200);
            }
            
            // Reset state
            isSwiping = false;
            direction = null;
            targetPage = null;
            currentEl = null;
            targetEl = null;
        }, { passive: true });
        
        pagesContainer.addEventListener('touchcancel', () => {
            if (indicator) {
                indicator.style.transition = '';
            }
            if (currentEl) {
                currentEl.style.opacity = '';
                currentEl.style.transition = '';
            }
            if (targetEl) {
                targetEl.classList.remove('active');
                targetEl.style.opacity = '';
                targetEl.style.transition = '';
            }
            this.updateNavState(this.currentPage);
            isSwiping = false;
            direction = null;
            targetPage = null;
            currentEl = null;
            targetEl = null;
        }, { passive: true });
    }
    
    async navigateWithFade(targetPage) {
        if (targetPage === this.currentPage || this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        const currentEl = document.querySelector(`.page[data-page="${this.currentPage}"]`);
        const targetEl = document.querySelector(`.page[data-page="${targetPage}"]`);
        
        if (!currentEl || !targetEl) {
            this.isTransitioning = false;
            return;
        }
        
        // Load page content if not cached
        if (!this.pageCache[targetPage]) {
            await this.loadPage(targetPage);
        } else {
            targetEl.innerHTML = this.pageCache[targetPage];
        }
        
        // Complete fade out
        currentEl.style.transition = 'opacity 0.15s ease-out';
        currentEl.style.opacity = '0';
        
        // Update nav immediately
        this.updateNavState(targetPage);
        
        setTimeout(() => {
            // Switch pages
            currentEl.classList.remove('active');
            currentEl.style.opacity = '';
            currentEl.style.transition = '';
            
            targetEl.classList.add('active');
            targetEl.style.opacity = '0';
            targetEl.style.transition = 'opacity 0.15s ease-in';
            
            // Force reflow
            targetEl.offsetHeight;
            
            // Fade in target
            targetEl.style.opacity = '1';
            
            setTimeout(() => {
                targetEl.style.opacity = '';
                targetEl.style.transition = '';
                
                this.currentPage = targetPage;
                
                // Re-setup handlers
                this.setupTouchHandlers();
                this.setupCardDrawer();
                // Re-setup handlers
                this.setupTouchHandlers();
                this.setupCardDrawer();
                
                this.isTransitioning = false;
            }, 200);
        }, 200);
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
