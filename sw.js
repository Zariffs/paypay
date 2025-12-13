// AMEX PWA Service Worker - Simple and robust caching
const CACHE_NAME = 'amex-pwa-v2';

// Static assets to cache
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/user-config.js',
    '/manifest.json',
    '/images/AMEX/centurion.jpeg',
    '/images/AMEX/platinum.jpg',
    '/images/AMEX/cryptojade.jpeg',
    '/images/AMEX/MemberSince.png',
    '/images/AMEX/italy.jpg',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

// Install - cache static assets
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_ASSETS))
            .catch((err) => console.log('[SW] Cache failed:', err))
    );
});

// Activate - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) => {
            return Promise.all(
                names.filter(name => name !== CACHE_NAME)
                     .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch - network first, cache fallback
self.addEventListener('fetch', (event) => {
    // Skip non-http requests
    if (!event.request.url.startsWith('http')) {
        return;
    }
    
    // Skip API calls - let them go directly to network
    if (event.request.url.includes('api.coingecko.com')) {
        return;
    }
    
    // For version.json - always network, no cache interference
    if (event.request.url.includes('version.json')) {
        return;
    }
    
    // For everything else - try cache first, then network
    event.respondWith(
        caches.match(event.request)
            .then((cached) => {
                if (cached) {
                    return cached;
                }
                return fetch(event.request)
                    .then((response) => {
                        // Cache successful GET requests
                        if (response.ok && event.request.method === 'GET') {
                            const clone = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, clone);
                            });
                        }
                        return response;
                    });
            })
            .catch(() => {
                // Offline fallback
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            })
    );
});
