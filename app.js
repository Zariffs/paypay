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
        // Populate home page from userConfig
        await this.populateHomePage();
        
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

        // Setup wallet button
        this.setupWalletButton();

        // Setup send money modal
        this.setupSendModal();

        // Setup edge swipe navigation
        this.setupEdgeSwipe();

        // Register service worker
        this.registerServiceWorker();
        
        // Load and display version
        this.loadVersion();
        
        // Fetch crypto prices and update crypto cards
        this.updateCryptoPrices();

        // Setup financial insights
        this.setupFinancialInsights();
    }
    
    async updateCryptoPrices() {
        try {
            // Fetch prices from CoinGecko API (free, no API key needed)
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple,cardano,dogecoin&vs_currencies=usd');
            const prices = await response.json();
            
            // Map API response to our symbols
            this.cryptoPrices = {
                BTC: prices.bitcoin?.usd || 0,
                ETH: prices.ethereum?.usd || 0,
                SOL: prices.solana?.usd || 0,
                XRP: prices.ripple?.usd || 0,
                ADA: prices.cardano?.usd || 0,
                DOGE: prices.dogecoin?.usd || 0
            };
            
            // Update crypto card balances in userConfig
            if (typeof userConfig !== 'undefined' && userConfig.cards) {
                Object.values(userConfig.cards).forEach(card => {
                    if (card.isCrypto && card.holdings) {
                        let totalValue = 0;
                        card.holdings.forEach(holding => {
                            const price = this.cryptoPrices[holding.symbol] || 0;
                            holding.valueUSD = holding.amount * price;
                            holding.price = price;
                            totalValue += holding.valueUSD;
                        });
                        card.balanceRaw = totalValue;
                        card.balance = '$' + totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    }
                });
            }
            
            // Re-populate home page with updated values
            this.populateHomePage();
            this.setupCardDrawer();
            
        } catch (error) {
            console.error('Failed to fetch crypto prices:', error);
            // Use fallback prices if API fails
            this.cryptoPrices = {
                BTC: 105000,
                ETH: 3900,
                SOL: 220,
                XRP: 2.30,
                ADA: 1.05,
                DOGE: 0.42
            };
        }
    }
    
    async calculateCryptoBalance() {
        // Initialize markets manager if not already initialized
        if (!this.marketsManager) {
            this.marketsManager = {
                holdings: userConfig.cards.cryptojade.holdings.map(h => ({...h})),
                priceCache: { data: null, timestamp: 0 },
                sparklineCache: {},
                cacheDuration: 30000,
                coinCapIds: {
                    'BTC': 'bitcoin',
                    'ETH': 'ethereum',
                    'SOL': 'solana',
                    'XRP': 'xrp',
                    'ADA': 'cardano',
                    'DOGE': 'dogecoin'
                },
                coinIcons: {
                    'BTC': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/btc.svg',
                    'ETH': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/eth.svg',
                    'SOL': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/sol.svg',
                    'XRP': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/xrp.svg',
                    'ADA': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/ada.svg',
                    'DOGE': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/doge.svg'
                }
            };
        }

        // Fetch current prices
        let prices;
        try {
            prices = await this.fetchMarketsPrices();
        } catch (e) {
            prices = this.getFallbackPrices();
        }

        // Calculate total value
        let totalValue = 0;
        this.marketsManager.holdings.forEach(holding => {
            const coinId = this.marketsManager.coinCapIds[holding.symbol];
            const priceData = prices[coinId];
            if (priceData) {
                const valueUSD = holding.amount * priceData.price;
                totalValue += valueUSD;
            }
        });

        return `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    async populateHomePage() {
        if (typeof userConfig === 'undefined') return;

        // Populate current date
        const dateEl = document.getElementById('currentDate');
        if (dateEl) {
            const now = new Date();
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            dateEl.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
            console.log(dateEl.textContent);
        }

        // Populate accounts
        const accountsContainer = document.getElementById('accountsContainer');
        if (accountsContainer && userConfig.cards) {
            const cards = Object.values(userConfig.cards);

            // Calculate crypto card balance dynamically
            const cryptoCard = cards.find(card => card.isCrypto);
            if (cryptoCard) {
                const cryptoBalance = await this.calculateCryptoBalance();
                cryptoCard.displayBalance = cryptoBalance;
            }

            accountsContainer.innerHTML = cards.map((card, index) => `
                ${index > 0 ? '<div class="account-divider"></div>' : ''}
                <div class="account" data-card="${card.id}">
                    <div class="account-top">
                        <img class="account-card" src="${card.image}" alt="" aria-hidden="true">
                        <div>
                            <div class="account-balance">${card.isCrypto && card.displayBalance ? card.displayBalance : card.balance}</div>
                            <div class="account-sub">${card.name} (•••${card.lastFour})</div>
                        </div>
                    </div>
                </div>
            `).join('');

            // Re-setup card drawer after DOM update
            this.setupCardDrawer();
        }
        
        // Populate rewards points
        const rewardsPoints = document.getElementById('rewardsPoints');
        if (rewardsPoints && userConfig.rewards) {
            rewardsPoints.textContent = userConfig.rewards.totalPoints.toLocaleString();
        }
        
        // Populate upcoming trips
        const upcomingTrips = document.getElementById('upcomingTrips');
        if (upcomingTrips) {
            this.renderTrips();
        }
        
        // Setup trip modal
        this.setupTripModal();
        
        // Populate member since year
        const memberSinceYear = document.getElementById('memberSinceYear');
        if (memberSinceYear && userConfig.profile) {
            memberSinceYear.textContent = userConfig.profile.memberSince;
        }

        // Populate version footer if available
        if (this.versionText) {
            const versionFooter = document.getElementById('versionFooter');
            if (versionFooter) {
                versionFooter.textContent = this.versionText;
            }
        }
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
        
        // Repopulate home page if navigating to it
        if (targetPage === 'home') {
            this.populateHomePage();
        }

        // Initialize markets page if navigating to it
        if (targetPage === 'markets') {
            this.initializeMarketsPage();
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
            const pageEl = document.querySelector(`.page[data-page="${pageName}"]`);

            // Skip loading if page already has content (embedded in index.html)
            if (pageEl && pageEl.innerHTML.trim()) {
                this.pageCache[pageName] = pageEl.innerHTML;
                return;
            }

            // Otherwise, fetch from external file
            const response = await fetch(`pages/${pageName}.html`);
            if (response.ok) {
                const html = await response.text();
                this.pageCache[pageName] = html;

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
        const pressableButtons = document.querySelectorAll('.section-plus, .rewards-btn, .insights-link, .offer-add-btn, .offer-action, .action-card, .menu-item, .pressable');
        
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
        let startTime = 0;
        let lastX = 0;
        let lastTime = 0;
        let velocity = 0;
        let isSwiping = false;
        let direction = null;
        let targetPage = null;
        let currentEl = null;
        let targetEl = null;
        const commitThreshold = 0.20; // 20% of screen to commit navigation
        const velocityThreshold = 0.5; // pixels per millisecond for quick swipe
        
        pagesContainer.addEventListener('touchstart', (e) => {
            if (this.isTransitioning || this.disableEdgeSwipe) return;

            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
            lastX = startX;
            lastTime = startTime;
            velocity = 0;
            isSwiping = false;
            direction = null;
            targetPage = null;
            currentEl = document.querySelector(`.page[data-page="${this.currentPage}"]`);
            targetEl = null;

            // Check if touch started on a horizontally scrollable element
            const upcomingTrips = e.target.closest('.upcoming-trips');
            const walletCarousel = e.target.closest('.wallet-carousel');
            this.isScrollingHorizontalContent = (upcomingTrips !== null) || (walletCarousel !== null);

            // Disable nav indicator transition during swipe
            if (indicator) {
                indicator.style.transition = 'none';
            }
        }, { passive: true });
        
        pagesContainer.addEventListener('touchmove', async (e) => {
            if (this.isTransitioning || !currentEl || this.disableEdgeSwipe) return;

            // Don't trigger page swipe if scrolling horizontal content
            if (this.isScrollingHorizontalContent) return;

            const touch = e.touches[0];
            const now = Date.now();

            // Calculate velocity
            if (now - lastTime > 10) {
                velocity = (touch.clientX - lastX) / (now - lastTime);
                lastX = touch.clientX;
                lastTime = now;
            }
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

            // Reset horizontal scrolling flag
            this.isScrollingHorizontalContent = false;

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
            
            // Check if swipe exceeds threshold OR velocity is high enough (quick flick)
            const isQuickSwipe = Math.abs(velocity) > velocityThreshold && 
                                 ((velocity < 0 && direction === 'forward') || 
                                  (velocity > 0 && direction === 'backward'));
            const shouldCommit = (progress >= commitThreshold || isQuickSwipe) && _targetPage && _targetEl;
            
            if (shouldCommit) {
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

                    // Repopulate home page if swiping to it
                    if (_targetPage === 'home') {
                        this.populateHomePage();
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
            this.isScrollingHorizontalContent = false;
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
        const accounts = document.querySelectorAll('.account[data-card]');
        const drawer = document.getElementById('cardDrawer');
        const overlay = document.getElementById('drawerOverlay');
        
        if (!drawer || !overlay) return;
        
        accounts.forEach(account => {
            const accountTop = account.querySelector('.account-top');
            if (!accountTop) return;
            
            // Clone to remove old listeners
            const newAccountTop = accountTop.cloneNode(true);
            accountTop.parentNode.replaceChild(newAccountTop, accountTop);
            
            newAccountTop.addEventListener('click', () => {
                const cardId = account.getAttribute('data-card');
                this.openDrawer(cardId);
            });
        });
        
        // Close on overlay click
        overlay.onclick = () => this.closeDrawer();
        overlay.addEventListener('click', () => {
            this.closeDrawer();
        });

        // Setup markets button
        const marketsBtn = document.querySelector('.markets-btn');
        if (marketsBtn) {
            // Remove old listener by cloning
            const newMarketsBtn = marketsBtn.cloneNode(true);
            marketsBtn.parentNode.replaceChild(newMarketsBtn, marketsBtn);

            newMarketsBtn.addEventListener('click', () => {
                this.closeDrawer();
                this.openMarketsPage();
            });
        }

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
    
    renderDrawerForCard(cardId) {
        const card = typeof userConfig !== 'undefined' && userConfig.cards ? userConfig.cards[cardId] : null;
        if (!card) return;
        
        // Update card image
        const cardImg = document.querySelector('.drawer-card-img');
        if (cardImg) {
            cardImg.src = card.image;
            cardImg.alt = card.name;
        }
        
        // Update card name
        const cardName = document.querySelector('.drawer-card-name');
        if (cardName) {
            cardName.textContent = card.name;
        }
        
        // Update card number
        const cardNumber = document.querySelector('.drawer-card-number');
        if (cardNumber) {
            cardNumber.textContent = card.fullNumber || `•••• •••• •••• ${card.lastFour}`;
        }
        
        // Update balance section based on card type
        const balanceSection = document.querySelector('.drawer-balance-section');
        const balanceLabel = document.querySelector('.drawer-balance-label');
        const balanceAmount = document.querySelector('.drawer-balance-amount');
        const availableRow = document.querySelector('.drawer-balance-available');
        
        if (card.isCrypto) {
            // Crypto card - show portfolio value
            if (balanceLabel) balanceLabel.textContent = 'Portfolio Value';
            if (balanceAmount) balanceAmount.textContent = card.balance;
            if (availableRow) {
                const change24h = '+5.2%'; // Could be dynamic
                availableRow.innerHTML = `
                    <span class="available-label">24h Change</span>
                    <span class="available-amount">${change24h}</span>
                `;
            }
        } else {
            // Regular card
            if (balanceLabel) balanceLabel.textContent = 'Current Balance';
            if (balanceAmount) balanceAmount.textContent = card.balance;
            if (availableRow) {
                availableRow.innerHTML = `
                    <span class="available-label">Available Credit</span>
                    <span class="available-amount">${card.availableCredit || '$0.00'}</span>
                `;
            }
        }
        
        // Show/hide crypto holdings section and transactions section
        const cryptoHoldingsSection = document.querySelector('.drawer-crypto-holdings');
        const transactionsHeader = document.querySelector('.drawer-transactions-header');
        const transactionsList = document.querySelector('.transactions-list');

        if (card.isCrypto && card.holdings) {
            // Show crypto holdings, hide transactions
            if (cryptoHoldingsSection) cryptoHoldingsSection.style.display = 'block';
            if (transactionsHeader) transactionsHeader.style.display = 'none';
            if (transactionsList) transactionsList.style.display = 'none';

            // Load and render crypto holdings with live data
            this.loadDrawerCryptoHoldings(card);
        } else {
            // Hide crypto holdings, show transactions
            if (cryptoHoldingsSection) cryptoHoldingsSection.style.display = 'none';
            if (transactionsHeader) transactionsHeader.style.display = 'flex';
            if (transactionsList) transactionsList.style.display = 'flex';
        }

        if (transactionsList && card.transactions && !card.isCrypto) {
            // Show regular transactions
            transactionsList.innerHTML = card.transactions.map(tx => `
                <div class="transaction-item">
                    <div class="transaction-icon">
                        <span style="font-size: 22px;">${tx.icon}</span>
                    </div>
                    <div class="transaction-details">
                        <div class="transaction-name">${tx.merchant}</div>
                        <div class="transaction-date">${tx.date}</div>
                    </div>
                    <div class="transaction-amount ${tx.amount.startsWith('+') ? 'positive' : ''}">${tx.amount}</div>
                </div>
            `).join('');
        }
    }

    async loadDrawerCryptoHoldings(card) {
        const holdingsList = document.getElementById('drawerCryptoList');
        if (!holdingsList || !card.holdings) return;

        // Initialize markets manager if needed
        if (!this.marketsManager) {
            this.marketsManager = {
                holdings: card.holdings.map(h => ({...h})),
                priceCache: { data: null, timestamp: 0 },
                sparklineCache: {},
                cacheDuration: 10000, // 10 second cache for fast updates
                coinCapIds: {
                    'BTC': 'bitcoin',
                    'ETH': 'ethereum',
                    'SOL': 'solana',
                    'XRP': 'xrp',
                    'ADA': 'cardano',
                    'DOGE': 'dogecoin'
                },
                coinIcons: {
                    'BTC': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/btc.svg',
                    'ETH': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/eth.svg',
                    'SOL': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/sol.svg',
                    'XRP': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/xrp.svg',
                    'ADA': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/ada.svg',
                    'DOGE': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/doge.svg'
                }
            };
        }

        // Fetch prices and render
        await this.updateDrawerCryptoHoldings();

        // Set up auto-refresh every 10 seconds
        if (this.cryptoUpdateInterval) {
            clearInterval(this.cryptoUpdateInterval);
        }
        this.cryptoUpdateInterval = setInterval(() => {
            this.updateDrawerCryptoHoldings();
        }, 10000);
    }

    async updateDrawerCryptoHoldings() {
        const holdingsList = document.getElementById('drawerCryptoList');
        if (!holdingsList || !this.marketsManager) return;

        // Fetch current prices
        let prices;
        try {
            prices = await this.fetchMarketsPrices();
        } catch (e) {
            prices = this.getFallbackPrices();
        }

        // Update holdings with prices
        this.marketsManager.holdings.forEach(holding => {
            const coinId = this.marketsManager.coinCapIds[holding.symbol];
            const priceData = prices[coinId];
            if (priceData) {
                holding.price = priceData.price;
                holding.change24h = priceData.change24h || 0;
                holding.valueUSD = holding.amount * priceData.price;
            }
        });

        // Render holdings
        this.renderDrawerCryptoHoldings();

        // Update portfolio value in drawer
        const balanceAmount = document.querySelector('.drawer-balance-amount');
        const availableRow = document.querySelector('.drawer-balance-available');
        if (balanceAmount) {
            const totalValue = this.marketsManager.holdings.reduce((sum, h) => sum + (h.valueUSD || 0), 0);
            balanceAmount.textContent = `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            // Calculate weighted average change
            let weightedChange = 0;
            this.marketsManager.holdings.forEach(holding => {
                const weight = (holding.valueUSD || 0) / totalValue;
                weightedChange += (holding.change24h || 0) * weight;
            });

            if (availableRow) {
                const changeClass = weightedChange >= 0 ? '' : 'negative';
                const changeSymbol = weightedChange >= 0 ? '+' : '';
                availableRow.innerHTML = `
                    <span class="available-label">24h Change</span>
                    <span class="available-amount ${changeClass}">${changeSymbol}${weightedChange.toFixed(2)}%</span>
                `;
            }
        }
    }

    renderDrawerCryptoHoldings() {
        const holdingsList = document.getElementById('drawerCryptoList');
        if (!holdingsList || !this.marketsManager) return;

        const holdingsHTML = this.marketsManager.holdings.map(holding => {
            const changeClass = (holding.change24h || 0) >= 0 ? '' : 'negative';
            const changeSymbol = (holding.change24h || 0) >= 0 ? '+' : '';
            const iconUrl = this.marketsManager.coinIcons[holding.symbol] || '';

            return `
                <div class="drawer-crypto-item">
                    <div class="drawer-crypto-icon">
                        <img src="${iconUrl}" alt="${holding.symbol}" onerror="this.style.display='none'; this.parentElement.textContent='${holding.icon}'">
                    </div>
                    <div class="drawer-crypto-info">
                        <div class="drawer-crypto-name">${holding.name}</div>
                        <div class="drawer-crypto-amount">${holding.amount.toLocaleString()} ${holding.symbol}</div>
                    </div>
                    <div class="drawer-crypto-price-info">
                        <div class="drawer-crypto-price">$${(holding.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</div>
                        <div class="drawer-crypto-change ${changeClass}">${changeSymbol}${(holding.change24h || 0).toFixed(2)}%</div>
                    </div>
                    <canvas class="drawer-crypto-sparkline" data-symbol="${holding.symbol}"></canvas>
                </div>
            `;
        }).join('');

        holdingsList.innerHTML = holdingsHTML;

        // Render sparklines after DOM update
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.marketsManager.holdings.forEach(holding => {
                    this.renderDrawerSparkline(holding);
                });
            });
        });
    }

    async renderDrawerSparkline(holding) {
        const canvas = document.querySelector(`.drawer-crypto-sparkline[data-symbol="${holding.symbol}"]`);
        if (!canvas) return;

        // Generate or fetch sparkline data
        const prices = this.generateFallbackSparkline(holding);
        if (!prices || prices.length === 0) return;

        // Wait for canvas to have dimensions
        await new Promise(resolve => requestAnimationFrame(resolve));

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const width = canvas.offsetWidth || canvas.parentElement.offsetWidth || 300;
        const height = canvas.offsetHeight || 40;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const max = Math.max(...prices);
        const min = Math.min(...prices);
        const range = max - min || 1;

        // Determine line color based on trend
        const isPositive = prices[prices.length - 1] >= prices[0];
        const lineColor = isPositive ? '#00d4aa' : '#ff6b6b';
        const fillColor = isPositive ? 'rgba(0, 212, 170, 0.1)' : 'rgba(255, 107, 107, 0.1)';

        // Draw gradient fill
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, fillColor);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(0, height);

        prices.forEach((price, i) => {
            const x = (i / (prices.length - 1)) * width;
            const y = height - ((price - min) / range) * height;
            ctx.lineTo(x, y);
        });

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw line
        ctx.beginPath();
        prices.forEach((price, i) => {
            const x = (i / (prices.length - 1)) * width;
            const y = height - ((price - min) / range) * height;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    openDrawer(cardId = 'centurion') {
        // Track the currently viewed card
        this.currentDrawerCard = cardId;

        // Render the drawer content for this card
        this.renderDrawerForCard(cardId);
        
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

    // ========================================
    // Trip Management
    // ========================================
    
    getTrips() {
        // Get trips from localStorage only
        const stored = localStorage.getItem('amex-trips');
        if (stored) {
            const trips = JSON.parse(stored);
            // Ensure all trips have IDs
            return trips.map((trip, i) => ({
                ...trip,
                id: trip.id || `trip-legacy-${i}`
            }));
        }
        // No trips stored - return empty array
        return [];
    }
    
    saveTrips(trips) {
        localStorage.setItem('amex-trips', JSON.stringify(trips));
    }
    
    renderTrips() {
        const container = document.getElementById('upcomingTrips');
        if (!container) return;

        const trips = this.getTrips();

        // Render trip cards + add button
        container.innerHTML = trips.map(trip => `
            <div class="upcoming-card" data-trip-id="${trip.id}">
                <button class="trip-delete-btn" type="button" data-delete-trip="${trip.id}">
                    <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
                <img class="upcoming-img" src="${trip.image || 'images/AMEX/italy.jpg'}" alt="${trip.name} trip" onerror="this.src='images/AMEX/italy.jpg'">
                <div class="upcoming-info">
                    <div class="upcoming-name">${trip.name}</div>
                    <div class="upcoming-date">${trip.startDate} - ${trip.endDate}</div>
                    <div class="upcoming-icons">
                        ${trip.hasFlights ? `<svg viewBox="0 0 24 24">
                            <path d="M21 16v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/>
                            <path d="M7 10V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"/>
                            <line x1="12" y1="14" x2="12" y2="18"/>
                        </svg>` : ''}
                        ${trip.hasHotel ? `<svg viewBox="0 0 24 24">
                            <rect x="3" y="7" width="18" height="13" rx="2"/>
                            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>` : ''}
                        ${trip.hasCar ? `<svg viewBox="0 0 24 24">
                            <path d="M5 17h14v-5H5v5z"/>
                            <path d="M6 12l2-5h8l2 5"/>
                            <circle cx="7" cy="17" r="1"/>
                            <circle cx="17" cy="17" r="1"/>
                        </svg>` : ''}
                    </div>
                </div>
            </div>
        `).join('') + `
            <div class="add-trip-card" id="addTripBtn">
                <div class="add-trip-icon">+</div>
                <div class="add-trip-text">Add Trip</div>
            </div>
        `;

        // Setup trip card click handlers
        container.querySelectorAll('.upcoming-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't open drawer if delete button was clicked
                if (e.target.closest('.trip-delete-btn')) return;

                const tripId = card.dataset.tripId;
                this.openTripDrawer(tripId);
            });
        });

        // Setup delete handlers
        container.querySelectorAll('.trip-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tripId = btn.dataset.deleteTrip;
                this.deleteTrip(tripId);
            });
        });

        // Setup add button handler
        const addBtn = document.getElementById('addTripBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openTripModal());
        }

        // Setup trip drawer handlers
        this.setupTripDrawer();
    }
    
    deleteTrip(tripId) {
        const trips = this.getTrips();
        const filtered = trips.filter(t => t.id !== tripId);
        this.saveTrips(filtered);
        this.renderTrips();
    }
    
    setupTripModal() {
        const overlay = document.getElementById('tripModalOverlay');
        const closeBtn = document.getElementById('closeTripModal');
        const cancelBtn = document.getElementById('cancelTripModal');
        const saveBtn = document.getElementById('saveTripBtn');

        if (!overlay) return;

        // Close handlers
        closeBtn?.addEventListener('click', () => this.closeTripModal());
        cancelBtn?.addEventListener('click', () => this.closeTripModal());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeTripModal();
        });

        // Save handler
        saveBtn?.addEventListener('click', () => this.saveTrip());

        // Toggle subsections based on checkboxes
        const flightCheckbox = document.getElementById('tripHasFlights');
        const hotelCheckbox = document.getElementById('tripHasHotel');
        const carCheckbox = document.getElementById('tripHasCar');

        flightCheckbox?.addEventListener('change', (e) => {
            document.getElementById('flightDetails').style.display = e.target.checked ? 'block' : 'none';
        });

        hotelCheckbox?.addEventListener('change', (e) => {
            document.getElementById('hotelDetails').style.display = e.target.checked ? 'block' : 'none';
        });

        carCheckbox?.addEventListener('change', (e) => {
            document.getElementById('carDetails').style.display = e.target.checked ? 'block' : 'none';
        });
    }
    
    openTripModal(tripToEdit = null) {
        const overlay = document.getElementById('tripModalOverlay');
        const modalTitle = document.querySelector('#tripModal .modal-title');

        if (overlay) {
            this.editingTripId = tripToEdit?.id || null;

            if (tripToEdit) {
                // Editing existing trip
                modalTitle.textContent = 'Edit Trip';
                this.populateTripForm(tripToEdit);
            } else {
                // Creating new trip
                modalTitle.textContent = 'Add Trip';
                // Set default dates
                const today = new Date();
                const nextWeek = new Date(today);
                nextWeek.setDate(nextWeek.getDate() + 7);

                document.getElementById('tripStartDate').value = today.toISOString().split('T')[0];
                document.getElementById('tripEndDate').value = nextWeek.toISOString().split('T')[0];
            }

            overlay.classList.add('active');
        }
    }

    populateTripForm(trip) {
        // Basic info
        document.getElementById('tripDestination').value = trip.name || '';
        document.getElementById('tripImage').value = trip.image || '';
        document.getElementById('tripNotes').value = trip.notes || '';

        // Dates - convert from formatted dates back to ISO if needed
        if (trip.startDateISO) document.getElementById('tripStartDate').value = trip.startDateISO;
        if (trip.endDateISO) document.getElementById('tripEndDate').value = trip.endDateISO;

        // Flight details
        const hasFlights = trip.hasFlights || false;
        document.getElementById('tripHasFlights').checked = hasFlights;
        document.getElementById('flightDetails').style.display = hasFlights ? 'block' : 'none';
        if (trip.flightNumber) document.getElementById('tripFlightNumber').value = trip.flightNumber;
        if (trip.departureTime) document.getElementById('tripDepartureTime').value = trip.departureTime;
        if (trip.arrivalTime) document.getElementById('tripArrivalTime').value = trip.arrivalTime;
        if (trip.airline) document.getElementById('tripAirline').value = trip.airline;

        // Hotel details
        const hasHotel = trip.hasHotel || false;
        document.getElementById('tripHasHotel').checked = hasHotel;
        document.getElementById('hotelDetails').style.display = hasHotel ? 'block' : 'none';
        if (trip.hotelName) document.getElementById('tripHotelName').value = trip.hotelName;
        if (trip.hotelAddress) document.getElementById('tripHotelAddress').value = trip.hotelAddress;
        if (trip.hotelConfirmation) document.getElementById('tripConfirmation').value = trip.hotelConfirmation;

        // Car rental details
        const hasCar = trip.hasCar || false;
        document.getElementById('tripHasCar').checked = hasCar;
        document.getElementById('carDetails').style.display = hasCar ? 'block' : 'none';
        if (trip.carCompany) document.getElementById('tripCarCompany').value = trip.carCompany;
        if (trip.carType) document.getElementById('tripCarType').value = trip.carType;
        if (trip.carConfirmation) document.getElementById('tripCarConfirmation').value = trip.carConfirmation;
    }

    closeTripModal() {
        const overlay = document.getElementById('tripModalOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            this.editingTripId = null;
            // Clear form
            document.getElementById('tripDestination').value = '';
            document.getElementById('tripImage').value = '';
            document.getElementById('tripNotes').value = '';
            document.getElementById('tripHasFlights').checked = false;
            document.getElementById('tripHasHotel').checked = false;
            document.getElementById('tripHasCar').checked = false;

            // Clear flight details
            document.getElementById('tripFlightNumber').value = '';
            document.getElementById('tripDepartureTime').value = '';
            document.getElementById('tripArrivalTime').value = '';
            document.getElementById('tripAirline').value = '';
            document.getElementById('flightDetails').style.display = 'none';

            // Clear hotel details
            document.getElementById('tripHotelName').value = '';
            document.getElementById('tripHotelAddress').value = '';
            document.getElementById('tripConfirmation').value = '';
            document.getElementById('hotelDetails').style.display = 'none';

            // Clear car details
            document.getElementById('tripCarCompany').value = '';
            document.getElementById('tripCarType').value = '';
            document.getElementById('tripCarConfirmation').value = '';
            document.getElementById('carDetails').style.display = 'none';
        }
    }
    
    saveTrip() {
        const destination = document.getElementById('tripDestination').value.trim();
        const startDate = document.getElementById('tripStartDate').value;
        const endDate = document.getElementById('tripEndDate').value;
        const image = document.getElementById('tripImage').value.trim();
        const notes = document.getElementById('tripNotes').value.trim();

        if (!destination) {
            document.getElementById('tripDestination').style.borderColor = '#ff6b6b';
            return;
        }

        // Format dates nicely
        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        };

        // Gather flight details
        const hasFlights = document.getElementById('tripHasFlights').checked;
        const flightNumber = document.getElementById('tripFlightNumber').value.trim();
        const departureTime = document.getElementById('tripDepartureTime').value;
        const arrivalTime = document.getElementById('tripArrivalTime').value;
        const airline = document.getElementById('tripAirline').value.trim();

        // Gather hotel details
        const hasHotel = document.getElementById('tripHasHotel').checked;
        const hotelName = document.getElementById('tripHotelName').value.trim();
        const hotelAddress = document.getElementById('tripHotelAddress').value.trim();
        const hotelConfirmation = document.getElementById('tripConfirmation').value.trim();

        // Gather car rental details
        const hasCar = document.getElementById('tripHasCar').checked;
        const carCompany = document.getElementById('tripCarCompany').value.trim();
        const carType = document.getElementById('tripCarType').value.trim();
        const carConfirmation = document.getElementById('tripCarConfirmation').value.trim();

        const tripData = {
            name: destination,
            image: image || 'images/AMEX/italy.jpg',
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            startDateISO: startDate,
            endDateISO: endDate,
            type: 'trip',
            hasFlights,
            hasHotel,
            hasCar,
            notes,
            // Flight details
            flightNumber,
            departureTime,
            arrivalTime,
            airline,
            // Hotel details
            hotelName,
            hotelAddress,
            hotelConfirmation,
            // Car rental details
            carCompany,
            carType,
            carConfirmation
        };

        const trips = this.getTrips();

        if (this.editingTripId) {
            // Update existing trip
            const index = trips.findIndex(t => t.id === this.editingTripId);
            if (index !== -1) {
                trips[index] = { ...trips[index], ...tripData };
            }
        } else {
            // Create new trip
            tripData.id = `trip-${Date.now()}`;
            tripData.createdAt = new Date().toISOString();
            trips.push(tripData);
        }

        this.saveTrips(trips);
        this.closeTripModal();
        this.renderTrips();
    }

    // ========================================
    // Trip Drawer
    // ========================================

    setupTripDrawer() {
        const drawer = document.getElementById('tripDrawer');
        const overlay = document.getElementById('drawerOverlay');

        if (!drawer || !overlay) return;

        // Setup drawer pull-down gesture
        this.setupTripDrawerPullDown(drawer, overlay);
    }

    setupTripDrawerPullDown(drawer, overlay) {
        const handle = drawer.querySelector('.drawer-handle');
        if (!handle) return;

        let startY = 0;
        let currentY = 0;
        let isDragging = false;
        const drawerHeight = window.innerHeight * 0.85;

        // Tap to close
        handle.addEventListener('click', () => {
            if (!isDragging) {
                this.closeTripDrawer();
            }
        });

        // Touch start
        handle.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            isDragging = false;
            drawer.style.transition = 'none';
            overlay.style.transition = 'none';
        }, { passive: true });

        // Touch move
        handle.addEventListener('touchmove', (e) => {
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;

            if (deltaY > 5) {
                isDragging = true;
                drawer.style.transform = `translateY(${deltaY}px)`;

                const progress = Math.min(deltaY / (drawerHeight * 0.4), 1);
                const overlayOpacity = 1 - progress;
                const blurAmount = 4 * (1 - progress);

                overlay.style.opacity = overlayOpacity;
                overlay.style.backdropFilter = `blur(${blurAmount}px)`;
                overlay.style.webkitBackdropFilter = `blur(${blurAmount}px)`;
            }
        }, { passive: true });

        // Touch end
        handle.addEventListener('touchend', () => {
            const deltaY = currentY - startY;

            drawer.style.transition = '';
            overlay.style.transition = '';

            if (isDragging && deltaY > 80) {
                this.closeTripDrawer();
            } else {
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

    openTripDrawer(tripId) {
        const trips = this.getTrips();
        const trip = trips.find(t => t.id === tripId);
        if (!trip) return;

        const drawer = document.getElementById('tripDrawer');
        const overlay = document.getElementById('drawerOverlay');

        if (!drawer || !overlay) return;

        // Store current trip ID for editing
        this.currentTripId = tripId;

        // Populate drawer with trip data
        const tripImg = document.getElementById('tripDrawerImg');
        const tripDestination = document.getElementById('tripDrawerDestination');
        const tripDates = document.getElementById('tripDrawerDates');

        if (tripImg) {
            tripImg.src = trip.image || 'images/AMEX/italy.jpg';
            tripImg.alt = trip.name;
        }

        if (tripDestination) {
            tripDestination.textContent = trip.name;
        }

        if (tripDates) {
            tripDates.textContent = `${trip.startDate} - ${trip.endDate}`;
        }

        // Flight Details
        const flightSection = document.getElementById('tripDrawerFlightSection');
        if (trip.hasFlights && (trip.flightNumber || trip.airline || trip.departureTime)) {
            const flightDetails = [];
            if (trip.flightNumber) flightDetails.push(`<strong>Flight:</strong> ${trip.flightNumber}`);
            if (trip.departureTime && trip.arrivalTime) {
                flightDetails.push(`<strong>Times:</strong> ${trip.departureTime} - ${trip.arrivalTime}`);
            } else if (trip.departureTime) {
                flightDetails.push(`<strong>Departure:</strong> ${trip.departureTime}`);
            }
            if (trip.airline) flightDetails.push(`<strong>Airline:</strong> ${trip.airline}`);

            document.getElementById('tripDrawerFlightNumber').innerHTML = flightDetails[0] || '';
            document.getElementById('tripDrawerFlightTimes').innerHTML = flightDetails[1] || '';
            document.getElementById('tripDrawerAirline').innerHTML = flightDetails[2] || '';
            flightSection.style.display = 'block';
        } else {
            flightSection.style.display = 'none';
        }

        // Hotel Details
        const hotelSection = document.getElementById('tripDrawerHotelSection');
        if (trip.hasHotel && (trip.hotelName || trip.hotelAddress || trip.hotelConfirmation)) {
            const hotelDetails = [];
            if (trip.hotelName) hotelDetails.push(`<strong>Hotel:</strong> ${trip.hotelName}`);
            if (trip.hotelAddress) hotelDetails.push(`<strong>Address:</strong> ${trip.hotelAddress}`);
            if (trip.hotelConfirmation) hotelDetails.push(`<strong>Confirmation:</strong> ${trip.hotelConfirmation}`);

            document.getElementById('tripDrawerHotelName').innerHTML = hotelDetails[0] || '';
            document.getElementById('tripDrawerHotelAddress').innerHTML = hotelDetails[1] || '';
            document.getElementById('tripDrawerHotelConfirmation').innerHTML = hotelDetails[2] || '';
            hotelSection.style.display = 'block';
        } else {
            hotelSection.style.display = 'none';
        }

        // Car Rental Details
        const carSection = document.getElementById('tripDrawerCarSection');
        if (trip.hasCar && (trip.carCompany || trip.carType || trip.carConfirmation)) {
            const carDetails = [];
            if (trip.carCompany) carDetails.push(`<strong>Company:</strong> ${trip.carCompany}`);
            if (trip.carType) carDetails.push(`<strong>Vehicle:</strong> ${trip.carType}`);
            if (trip.carConfirmation) carDetails.push(`<strong>Confirmation:</strong> ${trip.carConfirmation}`);

            document.getElementById('tripDrawerCarCompany').innerHTML = carDetails[0] || '';
            document.getElementById('tripDrawerCarType').innerHTML = carDetails[1] || '';
            document.getElementById('tripDrawerCarConfirmation').innerHTML = carDetails[2] || '';
            carSection.style.display = 'block';
        } else {
            carSection.style.display = 'none';
        }

        // Notes
        const tripNotes = document.getElementById('tripDrawerNotes');
        const tripNotesSection = document.getElementById('tripDrawerNotesSection');
        if (trip.notes && trip.notes.trim()) {
            if (tripNotes) tripNotes.textContent = trip.notes;
            if (tripNotesSection) tripNotesSection.style.display = 'block';
        } else {
            if (tripNotesSection) tripNotesSection.style.display = 'none';
        }

        // Show drawer and overlay
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

        // Close on overlay click
        const overlayClickHandler = () => {
            this.closeTripDrawer();
        };
        overlay.addEventListener('click', overlayClickHandler, { once: true });

        // Setup edit button
        const editBtn = document.getElementById('tripDrawerEditBtn');
        if (editBtn) {
            // Remove old listener by cloning
            const newEditBtn = editBtn.cloneNode(true);
            editBtn.parentNode.replaceChild(newEditBtn, editBtn);

            newEditBtn.addEventListener('click', () => {
                this.closeTripDrawer();
                setTimeout(() => {
                    this.openTripModal(trip);
                }, 300);
            });
        }
    }

    closeTripDrawer() {
        const drawer = document.getElementById('tripDrawer');
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
        }
    }

    // ========================================
    // Wallet Page
    // ========================================

    setupWalletButton() {
        const walletBtn = document.querySelector('.top-wallet');
        if (walletBtn) {
            walletBtn.addEventListener('click', () => {
                this.openWalletPage();
            });
        }
    }

    async openWalletPage() {
        // Load wallet page if not cached
        if (!this.pageCache['wallet']) {
            await this.loadPage('wallet');
        }

        const walletPage = document.querySelector('.page[data-page="wallet"]');
        const currentPage = document.querySelector('.page.active');
        const navbar = document.querySelector('.nav');

        if (!walletPage || !currentPage) return;

        // Hide current page
        currentPage.classList.remove('active');

        // Show wallet page
        walletPage.classList.add('active');
        this.currentPage = 'wallet';

        // Hide navbar
        if (navbar) {
            navbar.style.display = 'none';
        }

        // Setup wallet carousel and back button
        this.setupWalletCarousel();
        this.setupWalletBackButton();
    }

    setupWalletBackButton() {
        const backBtn = document.getElementById('walletBackBtn');
        if (backBtn) {
            // Remove old listener by cloning
            const newBackBtn = backBtn.cloneNode(true);
            backBtn.parentNode.replaceChild(newBackBtn, backBtn);

            newBackBtn.addEventListener('click', () => {
                this.closeWalletPage();
            });
        }
    }

    closeWalletPage() {
        const walletPage = document.querySelector('.page[data-page="wallet"]');
        const homePage = document.querySelector('.page[data-page="home"]');
        const navbar = document.querySelector('.nav');

        if (walletPage && homePage) {
            walletPage.classList.remove('active');
            homePage.classList.add('active');
            this.currentPage = 'home';

            // Show navbar again
            if (navbar) {
                navbar.style.display = '';
            }

            // Repopulate home page
            this.populateHomePage();
        }
    }

    setupWalletCarousel() {
        const carousel = document.getElementById('walletCarousel');
        if (!carousel) return;

        // Populate cards from user-config
        const allCards = getAllCards();
        carousel.innerHTML = '';

        allCards.forEach((card, index) => {
            const cardWrapper = document.createElement('div');
            cardWrapper.className = 'wallet-card-wrapper';
            cardWrapper.dataset.cardIndex = index;

            cardWrapper.innerHTML = `
                <div class="wallet-card">
                    <div class="wallet-card-inner">
                        <img src="${card.image}" alt="${card.name}" class="wallet-card-bg">
                        <div class="wallet-card-iridescent"></div>
                    </div>
                </div>
            `;

            carousel.appendChild(cardWrapper);
        });

        const cards = carousel.querySelectorAll('.wallet-card-wrapper');

        const updateCardScales = () => {
            const carouselRect = carousel.getBoundingClientRect();
            const centerX = carouselRect.left + carouselRect.width / 2;
            let closestCard = null;
            let closestDistance = Infinity;

            cards.forEach((card) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const distanceFromCenter = Math.abs(centerX - cardCenterX);
                const maxDistance = carouselRect.width / 2;

                // Track closest card to center
                if (distanceFromCenter < closestDistance) {
                    closestDistance = distanceFromCenter;
                    closestCard = card;
                }

                // Calculate scale based on distance from center
                // Center card = 1.0 scale, edge cards = 0.8 scale (20% difference)
                const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
                const scale = 1.0 - (normalizedDistance * 0.2);

                card.style.transform = `scale(${scale})`;
            });

            // Update card info for the centered card
            if (closestCard) {
                const cardIndex = parseInt(closestCard.dataset.cardIndex);
                this.updateWalletCardInfo(allCards[cardIndex]);
            }
        };

        // Update scales on scroll
        carousel.addEventListener('scroll', updateCardScales, { passive: true });

        // Initial scale update and card info
        setTimeout(() => {
            updateCardScales();
        }, 100);
    }

    updateWalletCardInfo(card) {
        const cardName = document.getElementById('walletCardName');
        const cardNumber = document.getElementById('walletCardNumber');

        if (cardName && cardNumber) {
            cardName.textContent = card.name;
            cardNumber.textContent = card.fullNumber;
        }
    }

    // ========================================
    // Send Money Modal
    // ========================================

    setupSendModal() {
        // Recipient database for autocomplete
        this.recipients = [
            { name: 'John Doe', initials: 'JD', cashtag: '$johndoe', email: 'john@example.com', phone: '(555) 123-4567' },
            { name: 'Sarah Kim', initials: 'SK', cashtag: '$sarahk', email: 'sarah@example.com', phone: '(555) 234-5678' },
            { name: 'Mike Jones', initials: 'MJ', cashtag: '$mikej', email: 'mike@example.com', phone: '(555) 345-6789' },
            { name: 'Emily Chen', initials: 'EC', cashtag: '$emilyc', email: 'emily@example.com', phone: '(555) 456-7890' },
            { name: 'David Smith', initials: 'DS', cashtag: '$dsmith', email: 'david@example.com', phone: '(555) 567-8901' },
        ];

        this.selectedRecipient = null;
        this.selectedCard = 'centurion';

        // Get all the drawer Send buttons
        const drawerActions = document.querySelector('.drawer-actions');

        // Use event delegation for Send buttons in drawer
        if (drawerActions) {
            drawerActions.addEventListener('click', (e) => {
                const sendBtn = e.target.closest('.drawer-action-btn');
                if (sendBtn && sendBtn.textContent.includes('Send')) {
                    this.openSendModal();
                }
            });
        }

        // Home page action buttons
        const homeActionButtons = document.getElementById('homeActionButtons');
        if (homeActionButtons) {
            homeActionButtons.addEventListener('click', (e) => {
                const actionBtn = e.target.closest('.home-action-btn');
                if (actionBtn) {
                    const action = actionBtn.dataset.action;
                    if (action === 'send') {
                        this.openSendModal();
                    }
                }
            });
        }

        // Setup modal controls
        const sendModalOverlay = document.getElementById('sendModalOverlay');

        // Close modal when clicking overlay
        if (sendModalOverlay) {
            sendModalOverlay.addEventListener('click', (e) => {
                if (e.target === sendModalOverlay) {
                    this.closeSendModal();
                }
            });
        }

        // Back button
        const sendBackBtn = document.getElementById('sendBackBtn');
        if (sendBackBtn) {
            sendBackBtn.addEventListener('click', () => this.closeSendModal());
        }

        // Recipient button
        const sendRecipientBtn = document.getElementById('sendRecipientBtn');
        if (sendRecipientBtn) {
            sendRecipientBtn.addEventListener('click', () => this.openRecipientSelector());
        }

        // Amount input
        const sendAmount = document.getElementById('sendAmount');
        if (sendAmount) {
            sendAmount.addEventListener('input', (e) => {
                this.formatAmountInput(e.target);
                this.updatePayButton();
            });
        }

        // Pay button
        const sendPayBtn = document.getElementById('sendPayBtn');
        if (sendPayBtn) {
            sendPayBtn.addEventListener('click', () => this.processSendMoney());
        }

        // Done button
        const sendDoneBtn = document.getElementById('sendDoneBtn');
        if (sendDoneBtn) {
            sendDoneBtn.addEventListener('click', () => this.closeSendModal());
        }

        // Card change button
        const sendCardChange = document.getElementById('sendCardChange');
        if (sendCardChange) {
            sendCardChange.addEventListener('click', () => this.openCardSelector());
        }

        // Setup modals
        this.setupCardSelector();
        this.setupRecipientSelector();
    }

    populateRecentRecipients() {
        const recentList = document.getElementById('sendRecentList');
        if (!recentList) return;

        recentList.innerHTML = this.recipients.slice(0, 3).map(recipient => `
            <div class="send-recent-item" data-recipient='${JSON.stringify(recipient)}'>
                <div class="send-recent-avatar">${recipient.initials}</div>
                <div class="send-recent-info">
                    <div class="send-recent-name">${recipient.name}</div>
                    <div class="send-recent-detail">${recipient.cashtag}</div>
                </div>
            </div>
        `).join('');

        // Add click handlers
        recentList.querySelectorAll('.send-recent-item').forEach(item => {
            item.addEventListener('click', () => {
                const recipient = JSON.parse(item.dataset.recipient);
                this.selectRecipient(recipient);
            });
        });
    }

    handleRecipientSearch(query) {
        const autocomplete = document.getElementById('sendAutocomplete');
        if (!autocomplete) return;

        if (!query || query.length < 1) {
            autocomplete.style.display = 'none';
            return;
        }

        const filtered = this.recipients.filter(r =>
            r.name.toLowerCase().includes(query.toLowerCase()) ||
            r.cashtag.toLowerCase().includes(query.toLowerCase()) ||
            r.email.toLowerCase().includes(query.toLowerCase()) ||
            r.phone.includes(query)
        );

        if (filtered.length === 0) {
            autocomplete.style.display = 'none';
            return;
        }

        autocomplete.innerHTML = filtered.map(recipient => `
            <div class="send-autocomplete-item" data-recipient='${JSON.stringify(recipient)}'>
                <div class="send-autocomplete-avatar">${recipient.initials}</div>
                <div class="send-autocomplete-info">
                    <div class="send-autocomplete-name">${recipient.name}</div>
                    <div class="send-autocomplete-detail">${recipient.cashtag} • ${recipient.email}</div>
                </div>
            </div>
        `).join('');

        autocomplete.style.display = 'block';

        // Add click handlers
        autocomplete.querySelectorAll('.send-autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                const recipient = JSON.parse(item.dataset.recipient);
                this.selectRecipient(recipient);
                autocomplete.style.display = 'none';
            });
        });
    }

    selectRecipient(recipient) {
        this.selectedRecipient = recipient;

        // Update preview
        const avatar = document.getElementById('sendRecipientAvatar');
        const name = document.getElementById('sendRecipientName');

        if (avatar) avatar.textContent = recipient.initials;
        if (name) name.textContent = recipient.name;

        // Go to amount step
        this.goToAmountStep();
    }

    goToAmountStep() {
        const recipientStep = document.getElementById('sendStepRecipient');
        const amountStep = document.getElementById('sendStepAmount');

        if (recipientStep && amountStep) {
            recipientStep.classList.add('exiting-left');
            recipientStep.classList.remove('active');

            amountStep.classList.add('active');

            // Focus on amount input
            setTimeout(() => {
                const amountInput = document.getElementById('sendAmount');
                if (amountInput) amountInput.focus();
            }, 100);
        }
    }

    goToRecipientStep() {
        const recipientStep = document.getElementById('sendStepRecipient');
        const amountStep = document.getElementById('sendStepAmount');

        if (recipientStep && amountStep) {
            amountStep.classList.remove('active');
            recipientStep.classList.remove('exiting-left');
            recipientStep.classList.add('active');

            // Clear amount
            const amountInput = document.getElementById('sendAmount');
            if (amountInput) amountInput.value = '';
            this.updatePayButton();
        }
    }

    formatPhoneNumber(phone) {
        // Remove all non-numeric characters
        const cleaned = phone.replace(/\D/g, '');

        // Format as (XXX) XXX-XXXX
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }

        // Return original if not 10 digits
        return phone;
    }

    formatAmountInput(input) {
        // Get cursor position
        const cursorPosition = input.selectionStart;
        const oldLength = input.value.length;

        // Remove all non-numeric characters except decimal point
        let value = input.value.replace(/[^0-9.]/g, '');

        // Ensure only one decimal point
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }

        // Limit to 2 decimal places
        if (parts[1] && parts[1].length > 2) {
            value = parts[0] + '.' + parts[1].slice(0, 2);
        }

        // Add commas to the integer part
        const [integerPart, decimalPart] = value.split('.');
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // Reconstruct the value with commas and $ sign
        value = decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;

        // Add $ prefix if there's a value
        if (value) {
            value = '$' + value;
        }

        input.value = value;

        // Adjust cursor position to account for added/removed commas and $ sign
        const newLength = input.value.length;
        const diff = newLength - oldLength;
        input.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
    }

    updatePayButton() {
        const payBtn = document.getElementById('sendPayBtn');
        const amountInput = document.getElementById('sendAmount');

        if (payBtn && amountInput) {
            // Remove commas and $ sign before parsing
            const amount = parseFloat(amountInput.value.replace(/,/g, '').replace(/\$/g, ''));
            payBtn.disabled = !amount || amount <= 0 || !this.selectedRecipient;
        }
    }

    setupCardSelector() {
        const closeCardSelector = document.getElementById('closeCardSelector');
        const cardSelectorOverlay = document.getElementById('cardSelectorOverlay');

        if (closeCardSelector) {
            closeCardSelector.addEventListener('click', () => this.closeCardSelector());
        }

        if (cardSelectorOverlay) {
            cardSelectorOverlay.addEventListener('click', (e) => {
                if (e.target === cardSelectorOverlay) {
                    this.closeCardSelector();
                }
            });
        }

        // Populate cards
        this.populateCardSelector();
    }

    populateCardSelector() {
        const cardSelectorList = document.getElementById('cardSelectorList');
        if (!cardSelectorList || typeof userConfig === 'undefined' || !userConfig.cards) return;

        const cards = Object.entries(userConfig.cards);

        cardSelectorList.innerHTML = cards.map(([id, card]) => `
            <div class="card-selector-item ${id === this.selectedCard ? 'selected' : ''}" data-card-id="${id}">
                <img class="card-selector-card-img" src="${card.image}" alt="${card.name}">
                <div class="card-selector-info">
                    <div class="card-selector-card-name">${card.name}</div>
                    <div class="card-selector-card-details">••••${card.lastFour} • ${card.balance}</div>
                </div>
                <div class="card-selector-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
            </div>
        `).join('');

        // Add click handlers
        cardSelectorList.querySelectorAll('.card-selector-item').forEach(item => {
            item.addEventListener('click', () => {
                const cardId = item.dataset.cardId;
                this.selectCard(cardId);
            });
        });
    }

    selectCard(cardId) {
        this.selectedCard = cardId;

        const card = userConfig.cards[cardId];
        if (!card) return;

        // Update card display
        const cardMiniImg = document.getElementById('sendCardMiniImg');
        const cardName = document.getElementById('sendCardName');
        const cardNumber = document.getElementById('sendCardNumber');

        if (cardMiniImg) cardMiniImg.src = card.image;
        if (cardName) cardName.textContent = card.name;
        if (cardNumber) cardNumber.textContent = `••••${card.lastFour}`;

        // Update selector UI
        document.querySelectorAll('.card-selector-item').forEach(item => {
            item.classList.toggle('selected', item.dataset.cardId === cardId);
        });

        // Close selector
        this.closeCardSelector();
    }

    openCardSelector() {
        const cardSelectorOverlay = document.getElementById('cardSelectorOverlay');
        if (cardSelectorOverlay) {
            cardSelectorOverlay.style.display = 'flex';
            setTimeout(() => {
                cardSelectorOverlay.classList.add('active');
            }, 10);
        }
    }

    closeCardSelector() {
        const cardSelectorOverlay = document.getElementById('cardSelectorOverlay');
        if (cardSelectorOverlay) {
            cardSelectorOverlay.classList.remove('active');
            setTimeout(() => {
                cardSelectorOverlay.style.display = 'none';
            }, 300);
        }
    }

    setupRecipientSelector() {
        const closeRecipientSelector = document.getElementById('closeRecipientSelector');
        const recipientSelectorOverlay = document.getElementById('recipientSelectorOverlay');
        const recipientSearchInput = document.getElementById('recipientSearchInput');

        if (closeRecipientSelector) {
            closeRecipientSelector.addEventListener('click', () => this.closeRecipientSelector());
        }

        if (recipientSelectorOverlay) {
            recipientSelectorOverlay.addEventListener('click', (e) => {
                if (e.target === recipientSelectorOverlay) {
                    this.closeRecipientSelector();
                }
            });
        }

        if (recipientSearchInput) {
            recipientSearchInput.addEventListener('input', (e) => {
                this.handleRecipientSelectorSearch(e.target.value);
            });

            recipientSearchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    if (query) {
                        this.createCustomRecipient(query);
                    }
                }
            });
        }

        // Populate recipients
        this.populateRecipientSelector();
    }

    populateRecipientSelector(filteredRecipients = null) {
        const recipientSelectorList = document.getElementById('recipientSelectorList');
        if (!recipientSelectorList) return;

        const recipientsToShow = filteredRecipients || this.recipients;

        recipientSelectorList.innerHTML = recipientsToShow.map(recipient => `
            <div class="recipient-selector-item ${this.selectedRecipient && this.selectedRecipient.name === recipient.name ? 'selected' : ''}" data-recipient='${JSON.stringify(recipient)}'>
                <div class="recipient-selector-avatar">${recipient.initials}</div>
                <div class="recipient-selector-info">
                    <div class="recipient-selector-name">${recipient.name}</div>
                    <div class="recipient-selector-detail">${recipient.cashtag} • ${recipient.email}</div>
                </div>
            </div>
        `).join('');

        // Add click handlers
        recipientSelectorList.querySelectorAll('.recipient-selector-item').forEach(item => {
            item.addEventListener('click', () => {
                const recipient = JSON.parse(item.dataset.recipient);
                this.selectRecipientFromModal(recipient);
            });
        });
    }

    handleRecipientSelectorSearch(query) {
        if (!query || query.trim() === '') {
            this.populateRecipientSelector();
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = this.recipients.filter(r =>
            r.name.toLowerCase().includes(lowerQuery) ||
            (r.cashtag && r.cashtag.toLowerCase().includes(lowerQuery)) ||
            (r.email && r.email.toLowerCase().includes(lowerQuery)) ||
            (r.phone && r.phone.includes(query))
        );

        this.populateRecipientSelector(filtered);
    }

    createCustomRecipient(input) {
        const trimmed = input.trim();

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Phone validation regex (various formats)
        const phoneRegex = /^[\d\s\-\(\)]+$/;

        let recipient;

        if (emailRegex.test(trimmed)) {
            // It's an email
            const initials = trimmed.substring(0, 2).toUpperCase();
            recipient = {
                name: trimmed,
                initials: initials,
                email: trimmed,
                cashtag: '',
                phone: '',
                isCustom: true
            };
        } else if (phoneRegex.test(trimmed.replace(/\D/g, ''))) {
            // It's a phone number
            const cleanedPhone = trimmed.replace(/\D/g, '');
            if (cleanedPhone.length >= 10) {
                const formattedPhone = this.formatPhoneNumber(cleanedPhone);
                recipient = {
                    name: formattedPhone,
                    initials: 'PH',
                    email: '',
                    cashtag: '',
                    phone: formattedPhone,
                    isCustom: true
                };
            } else {
                alert('Please enter a valid 10-digit phone number');
                return;
            }
        } else {
            // Assume it's a name/username
            const initials = trimmed.substring(0, 2).toUpperCase();
            recipient = {
                name: trimmed,
                initials: initials,
                email: '',
                cashtag: '@' + trimmed.toLowerCase().replace(/\s+/g, ''),
                phone: '',
                isCustom: true
            };
        }

        this.selectRecipientFromModal(recipient);
    }

    selectRecipientFromModal(recipient) {
        this.selectedRecipient = recipient;
        this.updatePayButton();

        // Update recipient button UI
        const recipientBtn = document.getElementById('sendRecipientBtn');
        const plusIcon = recipientBtn.querySelector('.send-recipient-icon-plus');
        const avatarIcon = document.getElementById('sendRecipientAvatar');
        const initialsSpan = document.getElementById('sendRecipientInitials');

        if (recipientBtn && plusIcon && avatarIcon && initialsSpan) {
            plusIcon.style.display = 'none';
            avatarIcon.style.display = 'flex';
            initialsSpan.textContent = recipient.initials;
            recipientBtn.classList.add('has-recipient');
        }

        // Update selector UI
        document.querySelectorAll('.recipient-selector-item').forEach(item => {
            const itemRecipient = JSON.parse(item.dataset.recipient);
            item.classList.toggle('selected', itemRecipient.name === recipient.name);
        });

        // Close selector
        this.closeRecipientSelector();
    }

    openRecipientSelector() {
        const recipientSelectorOverlay = document.getElementById('recipientSelectorOverlay');
        if (recipientSelectorOverlay) {
            this.populateRecipientSelector();
            recipientSelectorOverlay.style.display = 'flex';
            setTimeout(() => {
                recipientSelectorOverlay.classList.add('active');
            }, 10);
        }
    }

    closeRecipientSelector() {
        const recipientSelectorOverlay = document.getElementById('recipientSelectorOverlay');
        if (recipientSelectorOverlay) {
            recipientSelectorOverlay.classList.remove('active');
            setTimeout(() => {
                recipientSelectorOverlay.style.display = 'none';
            }, 300);
        }
    }

    updateSendModalCard() {
        if (typeof userConfig === 'undefined' || !userConfig.cards) return;

        const card = userConfig.cards[this.selectedCard];
        if (!card) return;

        const cardMiniImg = document.getElementById('sendCardMiniImg');
        const cardName = document.getElementById('sendCardName');
        const cardNumber = document.getElementById('sendCardNumber');

        if (cardMiniImg) cardMiniImg.src = card.image;
        if (cardName) cardName.textContent = card.name;
        if (cardNumber) cardNumber.textContent = `••••${card.lastFour}`;
    }

    openSendModal() {
        const sendModalOverlay = document.getElementById('sendModalOverlay');
        if (sendModalOverlay) {
            // Set selected card to the currently viewed card in drawer
            if (this.currentDrawerCard) {
                this.selectedCard = this.currentDrawerCard;
                this.updateSendModalCard();
            }

            // Reset to amount step
            const amountStep = document.getElementById('sendStepAmount');
            const confirmationStep = document.getElementById('sendStepConfirmation');

            if (amountStep) {
                amountStep.classList.add('active');
                amountStep.classList.remove('exiting-left');
            }
            if (confirmationStep) {
                confirmationStep.classList.remove('active');
            }

            // Clear inputs and reset recipient button
            const sendAmount = document.getElementById('sendAmount');
            const sendNote = document.getElementById('sendNote');
            const recipientBtn = document.getElementById('sendRecipientBtn');
            const plusIcon = recipientBtn?.querySelector('.send-recipient-icon-plus');
            const avatarIcon = document.getElementById('sendRecipientAvatar');

            if (sendAmount) sendAmount.value = '';
            if (sendNote) sendNote.value = '';

            if (recipientBtn && plusIcon && avatarIcon) {
                plusIcon.style.display = 'block';
                avatarIcon.style.display = 'none';
                recipientBtn.classList.remove('has-recipient');
            }

            this.selectedRecipient = null;
            this.updatePayButton();

            sendModalOverlay.style.display = 'flex';
            setTimeout(() => {
                sendModalOverlay.classList.add('active');
                // Focus on amount input
                if (sendAmount) sendAmount.focus();
            }, 10);
        }
    }

    closeSendModal() {
        const sendModalOverlay = document.getElementById('sendModalOverlay');
        if (sendModalOverlay) {
            sendModalOverlay.classList.remove('active');
            setTimeout(() => {
                sendModalOverlay.style.display = 'none';

                // Reset all steps
                const amountStep = document.getElementById('sendStepAmount');
                const confirmationStep = document.getElementById('sendStepConfirmation');

                if (amountStep) {
                    amountStep.classList.add('active');
                    amountStep.classList.remove('exiting-left');
                }
                if (confirmationStep) {
                    confirmationStep.classList.remove('active');
                }
            }, 300);
        }
    }

    async processSendMoney() {
        const amountInput = document.getElementById('sendAmount');
        const note = document.getElementById('sendNote').value;
        const amount = amountInput.value.replace(/,/g, '').replace(/\$/g, ''); // Remove commas and $ sign

        // Basic validation
        if (!this.selectedRecipient || !amount || parseFloat(amount) <= 0) {
            return;
        }

        // Get selected card info
        const selectedCardInfo = typeof userConfig !== 'undefined' && userConfig.cards ?
            userConfig.cards[this.selectedCard] : null;

        // Log payment info (in production, this would process the actual payment)
        console.log('Processing payment:', {
            amount: parseFloat(amount),
            recipient: this.selectedRecipient,
            note: note,
            card: selectedCardInfo,
            timestamp: new Date().toISOString()
        });

        // Go to confirmation step
        this.goToConfirmationStep();

        // Get confirmation elements
        const confirmationIcon = document.getElementById('sendConfirmationIcon');
        const confirmationTitle = document.getElementById('sendConfirmationTitle');
        const confirmationStatus = document.getElementById('sendConfirmationStatus');

        // Show spinner initially
        confirmationIcon.innerHTML = '<div class="send-spinner"></div>';
        confirmationTitle.textContent = 'Sending...';
        confirmationStatus.textContent = 'Verifying recipient';

        // Simulate multi-step sending process
        const steps = [
            { title: 'Sending...', status: 'Verifying recipient', duration: 1200 },
            { title: 'Sending...', status: 'Processing payment', duration: 1500 },
            { title: 'Sending...', status: 'Securing transaction', duration: 1300 },
            { title: 'Sending...', status: 'Confirming transfer', duration: 1000 }
        ];

        for (const step of steps) {
            confirmationTitle.textContent = step.title;
            confirmationStatus.textContent = step.status;
            await new Promise(resolve => setTimeout(resolve, step.duration));
        }

        // Show success state
        confirmationIcon.innerHTML = `
            <svg class="send-success-checkmark" viewBox="0 0 52 52">
                <defs>
                    <linearGradient id="success-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <circle class="send-success-circle" cx="26" cy="26" r="25" fill="none"/>
                <path class="send-success-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
        `;
        confirmationTitle.textContent = 'Sent!';

        // Format recipient display (phone or email)
        let recipientDisplay = this.selectedRecipient.name;
        if (this.selectedRecipient.phone) {
            recipientDisplay += ` (${this.formatPhoneNumber(this.selectedRecipient.phone)})`;
        } else if (this.selectedRecipient.email) {
            recipientDisplay += ` (${this.selectedRecipient.email})`;
        }

        // Format amount with commas
        const formattedAmount = parseFloat(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        confirmationStatus.textContent = `$${formattedAmount} sent to ${recipientDisplay}`;

        // Show note if provided
        const confirmationNote = document.getElementById('sendConfirmationNote');
        if (confirmationNote) {
            if (note && note.trim()) {
                confirmationNote.textContent = `"${note}"`;
                confirmationNote.style.display = 'block';
            } else {
                confirmationNote.style.display = 'none';
            }
        }

        // Show done button
        const doneBtn = document.getElementById('sendDoneBtn');
        if (doneBtn) {
            doneBtn.style.display = 'block';
        }
    }

    goToConfirmationStep() {
        const amountStep = document.getElementById('sendStepAmount');
        const confirmationStep = document.getElementById('sendStepConfirmation');
        const doneBtn = document.getElementById('sendDoneBtn');

        if (amountStep && confirmationStep) {
            amountStep.classList.add('exiting-left');
            amountStep.classList.remove('active');
            confirmationStep.classList.add('active');
        }

        // Hide done button initially (shown after success)
        if (doneBtn) {
            doneBtn.style.display = 'none';
        }
    }

    // Open Markets Page
    async openMarketsPage() {
        // Load markets page if not cached
        if (!this.pageCache['markets']) {
            await this.loadPage('markets');
        }

        const marketsPage = document.querySelector('.page[data-page="markets"]');
        const currentPage = document.querySelector('.page.active');
        const navbar = document.querySelector('.nav');

        if (!marketsPage || !currentPage) return;

        // Hide current page
        currentPage.classList.remove('active');

        // Show markets page
        marketsPage.classList.add('active');
        this.currentPage = 'markets';

        // Hide navbar
        if (navbar) {
            navbar.style.display = 'none';
        }

        // Disable edge swipe navigation
        this.disableEdgeSwipe = true;

        // Initialize markets page
        this.initializeMarketsPage();

        // Setup markets back button
        this.setupMarketsBackButton();
    }

    setupMarketsBackButton() {
        const backBtn = document.querySelector('.markets-back-btn');
        if (backBtn && !backBtn.dataset.listenerAdded) {
            backBtn.dataset.listenerAdded = 'true';
            backBtn.addEventListener('click', () => {
                this.closeMarketsPage();
            });
        }
    }

    closeMarketsPage() {
        const marketsPage = document.querySelector('.page[data-page="markets"]');
        const homePage = document.querySelector('.page[data-page="home"]');
        const navbar = document.querySelector('.nav');

        if (marketsPage && homePage) {
            marketsPage.classList.remove('active');
            homePage.classList.add('active');
            this.currentPage = 'home';

            // Show navbar again
            if (navbar) {
                navbar.style.display = '';
            }

            // Re-enable edge swipe navigation
            this.disableEdgeSwipe = false;

            // Repopulate home page
            this.populateHomePage();
        }
    }

    // Markets page functionality
    initializeMarketsPage() {
        if (!this.marketsManager) {
            this.marketsManager = {
                chart: null,
                currentCoin: null,
                currentTimeframe: '24H',
                holdings: [],
                priceUpdateInterval: null,
                chartUpdateInterval: null,
                priceCache: {},
                sparklineCache: {},
                cacheDuration: 30000, // 30 second cache
                // CoinCap API IDs (better rate limits: 200 req/min vs CoinGecko's strict limits)
                coinCapIds: {
                    'BTC': 'bitcoin',
                    'ETH': 'ethereum',
                    'SOL': 'solana',
                    'XRP': 'xrp',
                    'ADA': 'cardano',
                    'DOGE': 'dogecoin'
                },
                coinIcons: {
                    'BTC': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/btc.svg',
                    'ETH': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/eth.svg',
                    'SOL': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/sol.svg',
                    'XRP': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/xrp.svg',
                    'ADA': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/ada.svg',
                    'DOGE': 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/doge.svg'
                }
            };
        }

        // Clean up any existing intervals
        if (this.marketsManager.priceUpdateInterval) {
            clearInterval(this.marketsManager.priceUpdateInterval);
        }
        if (this.marketsManager.chartUpdateInterval) {
            clearInterval(this.marketsManager.chartUpdateInterval);
        }

        // Get holdings from crypto card
        const cryptoCard = userConfig.cards.cryptojade;
        if (cryptoCard && cryptoCard.holdings) {
            this.marketsManager.holdings = cryptoCard.holdings;
        }

        this.setupMarketsEventListeners();
        this.loadMarketsHoldings();
        this.startMarketsPriceUpdates();
    }

    setupMarketsEventListeners() {
        // Chart close button
        const chartCloseBtn = document.getElementById('marketsChartClose');
        if (chartCloseBtn && !chartCloseBtn.dataset.listenerAdded) {
            chartCloseBtn.dataset.listenerAdded = 'true';
            chartCloseBtn.addEventListener('click', () => {
                this.closeMarketsChart();
            });
        }

        // Timeframe buttons
        document.querySelectorAll('.markets-timeframe-btn').forEach(btn => {
            if (!btn.dataset.listenerAdded) {
                btn.dataset.listenerAdded = 'true';
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.markets-timeframe-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.marketsManager.currentTimeframe = e.target.dataset.timeframe;
                    this.updateMarketsChart();
                });
            }
        });
    }

    async loadMarketsHoldings() {
        const holdingsList = document.getElementById('marketsHoldingsList');
        if (!holdingsList) return;

        // Initialize with fallback prices immediately for fast display
        const fallbackPrices = this.getFallbackPrices();
        this.renderHoldings(fallbackPrices);

        // Then fetch real prices in background and update
        const prices = await this.fetchMarketsPrices();
        this.renderHoldings(prices);
    }

    renderHoldings(prices) {
        let totalValue = 0;
        const holdingsList = document.getElementById('marketsHoldingsList');
        if (!holdingsList) return;

        // Update holdings with current prices
        const holdingsHTML = this.marketsManager.holdings.map(holding => {
            const coinId = this.marketsManager.coinCapIds[holding.symbol];
            const priceData = prices[coinId];

            if (priceData) {
                holding.price = priceData.price;
                holding.change24h = priceData.change24h || 0;
                holding.valueUSD = holding.amount * priceData.price;
                totalValue += holding.valueUSD;
            }

            const changeClass = holding.change24h >= 0 ? '' : 'negative';
            const changeSymbol = holding.change24h >= 0 ? '+' : '';

            const iconUrl = this.marketsManager.coinIcons[holding.symbol] || '';

            return `
                <div class="markets-holding-item pressable" data-symbol="${holding.symbol}">
                    <div class="markets-holding-icon">
                        <img src="${iconUrl}" alt="${holding.symbol}" onerror="this.style.display='none'; this.parentElement.textContent='${holding.icon}'">
                    </div>
                    <div class="markets-holding-info">
                        <div class="markets-holding-name">${holding.name}</div>
                        <div class="markets-holding-symbol">${holding.symbol}</div>
                    </div>
                    <div class="markets-holding-price-info">
                        <div class="markets-holding-price">$${holding.price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</div>
                        <div class="markets-holding-change ${changeClass}">${changeSymbol}${holding.change24h?.toFixed(2) || '0.00'}%</div>
                    </div>
                    <canvas class="markets-holding-sparkline" data-symbol="${holding.symbol}"></canvas>
                </div>
            `;
        }).join('');

        holdingsList.innerHTML = holdingsHTML;

        // Render sparklines after DOM has settled
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.marketsManager.holdings.forEach(holding => {
                    this.renderSparkline(holding);
                });
            });
        });

        // Update portfolio total
        const portfolioValue = document.getElementById('marketsPortfolioValue');
        const portfolioChange = document.getElementById('marketsPortfolioChange');

        if (portfolioValue) {
            portfolioValue.textContent = `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }

        // Calculate weighted average change
        let weightedChange = 0;
        this.marketsManager.holdings.forEach(holding => {
            const weight = holding.valueUSD / totalValue;
            weightedChange += (holding.change24h || 0) * weight;
        });

        if (portfolioChange) {
            const changeClass = weightedChange >= 0 ? '' : 'negative';
            const changeSymbol = weightedChange >= 0 ? '+' : '';
            portfolioChange.textContent = `${changeSymbol}${weightedChange.toFixed(2)}%`;
            portfolioChange.className = `markets-portfolio-change ${changeClass}`;
        }

        // Add click listeners to holdings
        document.querySelectorAll('.markets-holding-item').forEach(item => {
            if (!item.dataset.listenerAdded) {
                item.dataset.listenerAdded = 'true';
                item.addEventListener('click', () => {
                    const symbol = item.dataset.symbol;
                    const holding = this.marketsManager.holdings.find(h => h.symbol === symbol);
                    if (holding) {
                        this.openMarketsChart(holding);
                    }
                });
            }
        });

        // Re-setup touch handlers for new elements
        this.setupTouchHandlers();
    }

    async fetchMarketsPrices() {
        // Check cache first
        const now = Date.now();
        if (this.marketsManager.priceCache.data &&
            (now - this.marketsManager.priceCache.timestamp) < this.marketsManager.cacheDuration) {
            return this.marketsManager.priceCache.data;
        }

        // Try multiple APIs - fallback chain for reliability
        try {
            return await this.fetchFromBinance();
        } catch (e1) {
            try {
                return await this.fetchFromCoinGecko();
            } catch (e2) {
                try {
                    return await this.fetchFromCoinCap();
                } catch (e3) {
                    // All APIs failed - use fallback
                    return this.marketsManager.priceCache.data || this.getFallbackPrices();
                }
            }
        }
    }

    async fetchFromBinance() {
        // Binance public API - no auth, very reliable
        const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT'];
        const coinMap = { BTCUSDT: 'bitcoin', ETHUSDT: 'ethereum', SOLUSDT: 'solana', XRPUSDT: 'xrp', ADAUSDT: 'cardano', DOGEUSDT: 'dogecoin' };

        const promises = symbols.map(symbol =>
            fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
                .then(r => r.ok ? r.json() : null)
        );

        const results = await Promise.all(promises);
        const data = {};
        const now = Date.now();

        results.forEach((ticker, i) => {
            if (ticker) {
                data[coinMap[symbols[i]]] = {
                    price: parseFloat(ticker.lastPrice),
                    change24h: parseFloat(ticker.priceChangePercent)
                };
            }
        });

        if (Object.keys(data).length > 0) {
            this.marketsManager.priceCache = { data, timestamp: now };
            return data;
        }
        throw new Error('No data');
    }

    async fetchFromCoinGecko() {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple,cardano,dogecoin&vs_currencies=usd&include_24hr_change=true');
        if (!response.ok) throw new Error('API error');

        const result = await response.json();
        const data = {};
        const now = Date.now();

        Object.entries(result).forEach(([id, values]) => {
            data[id === 'ripple' ? 'xrp' : id] = {
                price: values.usd,
                change24h: values.usd_24h_change || 0
            };
        });

        this.marketsManager.priceCache = { data, timestamp: now };
        return data;
    }

    async fetchFromCoinCap() {
        const ids = 'bitcoin,ethereum,solana,xrp,cardano,dogecoin';
        const response = await fetch(`https://api.coincap.io/v2/assets?ids=${ids}`);
        if (!response.ok) throw new Error('API error');

        const result = await response.json();
        const data = {};
        const now = Date.now();

        if (result.data) {
            result.data.forEach(asset => {
                data[asset.id] = {
                    price: parseFloat(asset.priceUsd),
                    change24h: parseFloat(asset.changePercent24Hr)
                };
            });
        }

        this.marketsManager.priceCache = { data, timestamp: now };
        return data;
    }

    getFallbackPrices() {
        // Realistic fallback prices (updated Dec 2024)
        return {
            bitcoin: { price: 106000, change24h: 1.8 },
            ethereum: { price: 4000, change24h: 2.3 },
            solana: { price: 220, change24h: 3.5 },
            xrp: { price: 2.45, change24h: 5.2 },
            cardano: { price: 1.12, change24h: 4.1 },
            dogecoin: { price: 0.42, change24h: 6.8 }
        };
    }

    async renderSparkline(holding) {
        const canvas = document.querySelector(`.markets-holding-sparkline[data-symbol="${holding.symbol}"]`);
        if (!canvas) return;

        const coinId = this.marketsManager.coinCapIds[holding.symbol];
        if (!coinId) return;

        // Check sparkline cache
        const now = Date.now();
        const cacheKey = holding.symbol;
        let prices;

        if (this.marketsManager.sparklineCache[cacheKey] &&
            (now - this.marketsManager.sparklineCache[cacheKey].timestamp) < this.marketsManager.cacheDuration) {
            prices = this.marketsManager.sparklineCache[cacheKey].data;
        } else {
            // Try different APIs for sparkline data (currently disabled due to network blocks)
            prices = await this.fetchSparklineData();

            if (prices && prices.length > 0) {
                // Cache successful sparkline data
                this.marketsManager.sparklineCache[cacheKey] = {
                    data: prices,
                    timestamp: now
                };
            } else {
                prices = this.generateFallbackSparkline(holding);
            }
        }

        if (!prices || prices.length === 0) return;

        // Wait for canvas to have dimensions (fixes blank sparkline issue)
        await new Promise(resolve => requestAnimationFrame(resolve));

        const ctx = canvas.getContext('2d');

        // Set canvas size - use explicit dimensions if offsetWidth is 0
        const dpr = window.devicePixelRatio || 1;
        const width = canvas.offsetWidth || canvas.parentElement.offsetWidth || 300;
        const height = canvas.offsetHeight || 50;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const max = Math.max(...prices);
        const min = Math.min(...prices);
        const range = max - min || 1; // Prevent division by zero

        // Determine line color based on trend
        const isPositive = prices[prices.length - 1] >= prices[0];
        const lineColor = isPositive ? '#00d4aa' : '#ff6b6b';
        const fillColor = isPositive ? 'rgba(0, 212, 170, 0.1)' : 'rgba(255, 107, 107, 0.1)';

        // Draw gradient fill
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, fillColor);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(0, height);

        prices.forEach((price, i) => {
            const x = (i / (prices.length - 1)) * width;
            const y = height - ((price - min) / range) * height;

            if (i === 0) {
                ctx.lineTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw line
        ctx.beginPath();
        prices.forEach((price, i) => {
            const x = (i / (prices.length - 1)) * width;
            const y = height - ((price - min) / range) * height;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    async fetchSparklineData() {
        // Skip API completely - network blocks CoinCap, just use fallback generation
        // This avoids ERR_NAME_NOT_RESOLVED errors in console
        return null; // Triggers fallback sparkline generation
    }

    generateFallbackSparkline(holding) {
        // Generate realistic-looking sparkline data
        const basePrice = holding.price || 100;
        const points = 24;
        const prices = [];

        for (let i = 0; i < points; i++) {
            const variance = (Math.random() - 0.5) * (basePrice * 0.05);
            const trend = (holding.change24h || 0) * (i / points) * (basePrice / 100);
            prices.push(basePrice + variance + trend);
        }

        return prices;
    }

    async openMarketsChart(holding) {
        this.marketsManager.currentCoin = holding;
        const modal = document.getElementById('marketsChartModal');
        if (!modal) return;

        // Update modal header
        document.getElementById('chartCoinName').textContent = holding.name;
        document.getElementById('chartCoinSymbol').textContent = holding.symbol;
        document.getElementById('chartCurrentPrice').textContent = `$${holding.price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`;

        const changeClass = holding.change24h >= 0 ? '' : 'negative';
        const changeSymbol = holding.change24h >= 0 ? '+' : '';
        const priceChangeEl = document.getElementById('chartPriceChange');
        priceChangeEl.textContent = `${changeSymbol}${holding.change24h?.toFixed(2) || '0.00'}%`;
        priceChangeEl.className = `markets-chart-price-change ${changeClass}`;

        // Show modal
        modal.style.display = 'block';

        // Load chart data
        await this.updateMarketsChart();

        // Start chart updates
        this.startMarketsChartUpdates();
    }

    closeMarketsChart() {
        const modal = document.getElementById('marketsChartModal');
        if (modal) {
            modal.style.display = 'none';
        }

        if (this.marketsManager.chartUpdateInterval) {
            clearInterval(this.marketsManager.chartUpdateInterval);
            this.marketsManager.chartUpdateInterval = null;
        }

        if (this.marketsManager.chart) {
            this.marketsManager.chart.destroy();
            this.marketsManager.chart = null;
        }

        this.marketsManager.currentCoin = null;
    }

    async updateMarketsChart() {
        if (!this.marketsManager.currentCoin) return;

        const geckoId = this.marketsManager.coinGeckoIds[this.marketsManager.currentCoin.symbol];
        if (!geckoId) return;

        const days = {
            '1H': 0.04,
            '24H': 1,
            '7D': 7,
            '30D': 30,
            '1Y': 365
        }[this.marketsManager.currentTimeframe] || 1;

        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${geckoId}/market_chart?vs_currency=usd&days=${days}`);
            const data = await response.json();

            const coinResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${geckoId}`);
            const coinData = await coinResponse.json();

            if (coinData.market_data) {
                document.getElementById('stat24hHigh').textContent = `$${coinData.market_data.high_24h?.usd?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`;
                document.getElementById('stat24hLow').textContent = `$${coinData.market_data.low_24h?.usd?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`;
                document.getElementById('statMarketCap').textContent = this.formatLargeNumber(coinData.market_data.market_cap?.usd || 0);
                document.getElementById('stat24hVolume').textContent = this.formatLargeNumber(coinData.market_data.total_volume?.usd || 0);
            }

            this.renderMarketsChart(data.prices);
        } catch (error) {
            console.error('Error updating chart:', error);
        }
    }

    renderMarketsChart(priceData) {
        const canvas = document.getElementById('marketsChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        if (this.marketsManager.chart) {
            this.marketsManager.chart.destroy();
        }

        const labels = priceData.map(p => new Date(p[0]));
        const prices = priceData.map(p => p[1]);

        const isPositive = prices[prices.length - 1] >= prices[0];
        const lineColor = isPositive ? '#00d4aa' : '#ff6b6b';
        const gradientColor = isPositive ? 'rgba(0, 212, 170, 0.15)' : 'rgba(255, 107, 107, 0.15)';

        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, gradientColor);
        gradient.addColorStop(1, 'transparent');

        this.marketsManager.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    data: prices,
                    borderColor: lineColor,
                    backgroundColor: gradient,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    pointHoverBackgroundColor: lineColor,
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(15, 15, 35, 0.95)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: (context) => `$${context.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        }
                    }
                },
                scales: {
                    x: { display: false },
                    y: {
                        display: true,
                        position: 'right',
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.5)',
                            callback: (value) => '$' + value.toLocaleString('en-US', { maximumFractionDigits: 0 }),
                            maxTicksLimit: 5
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    formatLargeNumber(num) {
        if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return '$' + (num / 1e3).toFixed(2) + 'K';
        return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    startMarketsPriceUpdates() {
        this.marketsManager.priceUpdateInterval = setInterval(() => {
            if (this.currentPage === 'markets') {
                this.loadMarketsHoldings();
            }
        }, 30000);
    }

    startMarketsChartUpdates() {
        this.marketsManager.chartUpdateInterval = setInterval(() => {
            this.updateMarketsChart();
        }, 60000);
    }

    // ========================================
    // Financial Insights
    // ========================================

    setupFinancialInsights() {
        this.currentInsightsCardIndex = 0;
        this.insightsCards = [];

        // Build insights for each card
        if (typeof userConfig !== 'undefined' && userConfig.cards) {
            this.insightsCards = Object.values(userConfig.cards);
        }

        // Setup toggle button
        const toggleBtn = document.getElementById('insightsCardToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.currentInsightsCardIndex = (this.currentInsightsCardIndex + 1) % this.insightsCards.length;
                this.updateInsightsDisplay();
            });
        }

        // Setup view button
        const viewBtn = document.getElementById('insightsViewBtn');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                const currentCard = this.insightsCards[this.currentInsightsCardIndex];
                if (currentCard) {
                    this.openDrawer(currentCard.id);
                }
            });
        }

        // Initial display
        this.updateInsightsDisplay();
    }

    updateInsightsDisplay() {
        if (this.insightsCards.length === 0) return;

        const currentCard = this.insightsCards[this.currentInsightsCardIndex];
        if (!currentCard) return;

        // Update card info
        const cardImg = document.getElementById('insightsAccountCard');
        const cardName = document.getElementById('insightsAccountName');

        if (cardImg && currentCard.image) cardImg.src = currentCard.image;
        if (cardName) {
            const lastFour = currentCard.number ? currentCard.number.slice(-4) : '0000';
            cardName.textContent = `${currentCard.name} (••••${lastFour})`;
        }

        // Check if crypto card
        if (currentCard.isCrypto) {
            this.updateCryptoInsights(currentCard);
        } else {
            this.updateSpendingInsights(currentCard);
        }
    }

    updateCryptoInsights(card) {
        // Change subtitle
        const subtitle = document.getElementById('insightsSubtitle');
        if (subtitle) subtitle.textContent = 'Portfolio Performance';

        // Calculate gains/losses
        const transactions = card.transactions || [];
        const weeklyData = this.calculateCryptoWeeklyPerformance(transactions, card);

        // Update range
        const range = document.getElementById('insightsRange');
        if (range && weeklyData.labels.length > 0) {
            const firstDate = weeklyData.labels[0];
            const lastDate = weeklyData.labels[weeklyData.labels.length - 1];
            range.textContent = `${firstDate} - ${lastDate}`;
        }

        // Update amount (current value)
        const amount = document.getElementById('insightsAmount');
        if (amount) {
            const currentValue = card.balanceRaw || 0;
            const weekChange = weeklyData.weekChange || 0;
            const changePercent = weeklyData.weekChangePercent || 0;
            const isPositive = weekChange >= 0;

            amount.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; justify-content: flex-end;">
                    <span>${this.formatCurrency(currentValue)}</span>
                    <span style="font-size: 14px; color: ${isPositive ? '#00d4aa' : '#ff6b6b'};">
                        ${isPositive ? '+' : ''}${changePercent.toFixed(2)}%
                    </span>
                </div>
            `;
        }

        // Update chart
        this.renderInsightsChart(weeklyData.values, weeklyData.labels, true);

        // Update button text
        const viewBtn = document.getElementById('insightsViewBtn');
        if (viewBtn) viewBtn.textContent = 'View Portfolio Details';
    }

    updateSpendingInsights(card) {
        // Change subtitle
        const subtitle = document.getElementById('insightsSubtitle');
        if (subtitle) subtitle.textContent = 'Weekly Spending';

        // Calculate weekly spending
        const transactions = card.transactions || [];
        const weeklyData = this.calculateWeeklySpending(transactions);

        // Update range
        const range = document.getElementById('insightsRange');
        if (range && weeklyData.labels.length > 0) {
            const firstDate = weeklyData.labels[0];
            const lastDate = weeklyData.labels[weeklyData.labels.length - 1];
            range.textContent = `${firstDate} - ${lastDate}`;
        }

        // Update amount (current week total)
        const amount = document.getElementById('insightsAmount');
        if (amount) {
            const currentWeekTotal = weeklyData.values[weeklyData.values.length - 1] || 0;
            amount.textContent = this.formatCurrency(currentWeekTotal);
        }

        // Update chart
        this.renderInsightsChart(weeklyData.values, weeklyData.labels, false);

        // Update button text
        const viewBtn = document.getElementById('insightsViewBtn');
        if (viewBtn) viewBtn.textContent = 'View Recent Spending';
    }

    calculateWeeklySpending(transactions) {
        const weeks = 6;
        const weeklyTotals = [];
        const labels = [];
        const now = new Date();

        // Get spending transactions only (negative amounts)
        const spendingTransactions = transactions.filter(t =>
            t.amount < 0 && t.type !== 'payment_received'
        );

        for (let i = weeks - 1; i >= 0; i--) {
            const weekEnd = new Date(now);
            weekEnd.setDate(now.getDate() - (i * 7));
            const weekStart = new Date(weekEnd);
            weekStart.setDate(weekEnd.getDate() - 6);

            // Calculate total for this week
            let weekTotal = 0;
            spendingTransactions.forEach(transaction => {
                const transactionDate = new Date(transaction.date);
                if (transactionDate >= weekStart && transactionDate <= weekEnd) {
                    weekTotal += Math.abs(transaction.amount);
                }
            });

            weeklyTotals.push(weekTotal);

            // Format label
            const month = weekEnd.toLocaleDateString('en-US', { month: 'short' });
            const day = weekEnd.getDate();
            labels.push(`${month} ${day}`);
        }

        return { values: weeklyTotals, labels };
    }

    calculateCryptoWeeklyPerformance(transactions, card) {
        const weeks = 6;
        const weeklyValues = [];
        const labels = [];
        const now = new Date();

        let initialValue = 0;
        let currentValue = card.balanceRaw || 0;

        for (let i = weeks - 1; i >= 0; i--) {
            const weekEnd = new Date(now);
            weekEnd.setDate(now.getDate() - (i * 7));

            // Calculate portfolio value at that time
            let weekValue = 0;
            if (card.holdings) {
                card.holdings.forEach(holding => {
                    // Simulate historical price (in real app, you'd fetch historical data)
                    const currentPrice = holding.price || 0;
                    const priceVariation = (Math.random() - 0.5) * 0.1; // ±5% random variation
                    const historicalPrice = currentPrice * (1 + (priceVariation * (weeks - i) / weeks));
                    weekValue += holding.amount * historicalPrice;
                });
            }

            if (i === weeks - 1) initialValue = weekValue;
            weeklyValues.push(weekValue);

            // Format label
            const month = weekEnd.toLocaleDateString('en-US', { month: 'short' });
            const day = weekEnd.getDate();
            labels.push(`${month} ${day}`);
        }

        const weekChange = currentValue - initialValue;
        const weekChangePercent = initialValue > 0 ? (weekChange / initialValue) * 100 : 0;

        return {
            values: weeklyValues,
            labels,
            weekChange,
            weekChangePercent
        };
    }

    renderInsightsChart(values, labels, isCrypto) {
        const chartContainer = document.getElementById('insightsChart');
        const yAxisContainer = document.getElementById('insightsYAxis');
        const labelsContainer = document.getElementById('insightsLabels');

        if (!chartContainer) return;

        // Calculate max value for scaling
        const maxValue = Math.max(...values, 1);
        const chartHeight = 70; // pixels

        // Clear existing bars
        chartContainer.innerHTML = '';

        // Render bars
        values.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const isLast = index === values.length - 1;

            const col = document.createElement('div');
            col.className = 'insights-bar-col';

            const bar = document.createElement('div');
            bar.className = 'insights-bar' + (isLast ? ' active' : '');
            bar.style.height = `${barHeight}px`;

            // Color based on type
            if (isCrypto) {
                const prevValue = index > 0 ? values[index - 1] : value;
                const isUp = value >= prevValue;
                bar.style.background = isUp ? 'rgba(0, 212, 170, 0.4)' : 'rgba(255, 107, 107, 0.4)';
            } else {
                bar.style.background = isLast ? 'rgba(74, 166, 255, 0.5)' : 'rgba(255, 255, 255, 0.18)';
            }

            col.appendChild(bar);
            chartContainer.appendChild(col);
        });

        // Update Y-axis
        if (yAxisContainer) {
            const topValue = maxValue;
            const midValue = maxValue / 2;
            yAxisContainer.innerHTML = `
                <span>${this.formatCurrency(topValue, true)}</span>
                <span>${this.formatCurrency(midValue, true)}</span>
            `;
        }

        // Update labels
        if (labelsContainer) {
            labelsContainer.innerHTML = '<span>Week</span>';
            labels.forEach(label => {
                const span = document.createElement('span');
                span.textContent = label;
                labelsContainer.appendChild(span);
            });
        }
    }

    formatCurrency(amount, compact = false) {
        if (compact && amount >= 1000) {
            if (amount >= 1000000) {
                return '$' + (amount / 1000000).toFixed(1) + 'M';
            }
            return '$' + (amount / 1000).toFixed(0) + 'K';
        }
        return '$' + amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}

// Initialize app
const app = new AmexApp();
