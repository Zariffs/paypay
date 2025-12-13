// AMEX PWA Service Worker - Caching for offline support
const CACHE_NAME = 'amex-pwa-v1';
const DATA_CACHE_NAME = 'amex-data-v1';

// Static assets to cache immediately on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/user-config.js',
    '/manifest.json',
    // Card images
    '/images/AMEX/centurion.jpeg',
    '/images/AMEX/platinum.jpg',
    '/images/AMEX/cryptojade.jpeg',
    '/images/AMEX/MemberSince.png',
    '/images/AMEX/italy.jpg',
    '/images/AMEX/cashapp.png',
    '/images/AMEX/amexDeltaSkyMilesPlatinum.png',
    '/images/AMEX/amexHiltonHonors.png',
    // Icons
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    // Page templates
    '/pages/home.html',
    '/pages/membership.html',
    '/pages/offers.html',
    '/pages/account.html'
];

// Install - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
            .catch((err) => {
                console.error('[SW] Failed to cache:', err);
                // Still skip waiting even if some assets fail
                return self.skipWaiting();
            })
    );
});

// Activate - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Skip non-http(s) requests (chrome-extension, etc.)
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Handle API requests (crypto prices) - network first, cache fallback
    if (url.hostname === 'api.coingecko.com') {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then((cache) => {
                return fetch(event.request)
                    .then((response) => {
                        // Cache successful API responses
                        if (response.ok) {
                            cache.put(event.request, response.clone());
                        }
                        return response;
                    })
                    .catch(() => {
                        // Network failed, try cache
                        console.log('[SW] Network failed, serving crypto prices from cache');
                        return cache.match(event.request).then((cached) => {
                            return cached || new Response(JSON.stringify({}), {
                                headers: {'Content-Type': 'application/json'}
                            });
                        });
                    });
            })
        );
        return;
    }
    
    // Handle version.json - always try network first for freshness
    if (url.pathname.includes('version.json')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Cache for offline use
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(DATA_CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request).then((cached) => {
                        return cached || new Response(JSON.stringify({commit: 'offline', build: 0, date: 'N/A'}), {
                            headers: {'Content-Type': 'application/json'}
                        });
                    });
                })
        );
        return;
    }
    
    // Handle user-config.js - cache but allow updates
    if (url.pathname.includes('user-config.js')) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then((cache) => {
                return fetch(event.request)
                    .then((response) => {
                        if (response.ok) {
                            cache.put(event.request, response.clone());
                        }
                        return response;
                    })
                    .catch(() => {
                        return cache.match(event.request).then((cached) => {
                            return cached || new Response('// Offline - config unavailable', {
                                headers: {'Content-Type': 'application/javascript'}
                            });
                        });
                    });
            })
        );
        return;
    }
    
    // Static assets - cache first, network fallback
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Return cached version
                    return cachedResponse;
                }
                
                // Not in cache, fetch from network
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-successful responses or non-GET requests
                        if (!response || response.status !== 200 || event.request.method !== 'GET') {
                            return response;
                        }
                        
                        // Cache new resources (only http/https)
                        const responseToCache = response.clone();
                        if (event.request.url.startsWith('http')) {
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        }
                        
                        return response;
                    });
            })
            .catch(() => {
                // Offline fallback for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html').then((cached) => {
                        return cached || new Response('Offline', {status: 503});
                    });
                }
                return new Response('Offline', {status: 503});
            })
    );
});

// Listen for messages from the app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    // Force update cache
    if (event.data && event.data.type === 'UPDATE_CACHE') {
        caches.open(CACHE_NAME).then((cache) => {
            cache.addAll(STATIC_ASSETS);
        });
    }
});
