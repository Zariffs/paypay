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
        
        // Setup touch handlers for buttons
        this.setupTouchHandlers();
        
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
        
        navItems.forEach(item => {
            item.classList.remove('active');
            item.removeAttribute('aria-current');
        });
        
        const activeNav = document.querySelector(`.nav-item[data-target="${targetPage}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
            activeNav.setAttribute('aria-current', 'page');
        }
    }

    setupTouchHandlers() {
        const pressableButtons = document.querySelectorAll('.section-plus, .rewards-btn, .insights-link, .offer-add-btn, .offer-action, .action-card, .menu-item');
        
        pressableButtons.forEach(btn => {
            // Remove existing listeners to avoid duplicates
            btn.removeEventListener('touchstart', this.handleTouchStart);
            btn.removeEventListener('touchend', this.handleTouchEnd);
            btn.removeEventListener('touchcancel', this.handleTouchEnd);
            
            btn.addEventListener('touchstart', this.handleTouchStart, { passive: true });
            btn.addEventListener('touchend', this.handleTouchEnd, { passive: true });
            btn.addEventListener('touchcancel', this.handleTouchEnd, { passive: true });
            
            // Mouse events for desktop
            btn.addEventListener('mousedown', this.handleTouchStart);
            btn.addEventListener('mouseup', this.handleTouchEnd);
            btn.addEventListener('mouseleave', this.handleTouchEnd);
        });
    }

    handleTouchStart(e) {
        this.classList.add('pressed');
    }

    handleTouchEnd(e) {
        this.classList.remove('pressed');
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
