// Service Worker for File Hosting Website
// Enables basic offline functionality and caching

const CACHE_NAME = 'file-hosting-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/pdfs.html',
    '/notes.html',
    '/files.html',
    '/css/style.css',
    '/css/responsive.css',
    '/css/normalize.css',
    '/js/main.js',
    '/js/search.js',
    '/js/theme.js',
    '/js/optimization.js',
    // Add other critical assets here
];

// Install event - cache critical assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching app shell and assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    return cacheName !== CACHE_NAME;
                }).map(cacheName => {
                    console.log('Deleting old cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    // Skip non-GET requests and external URLs
    if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // For HTML pages - network first, then cache
    if (event.request.headers.get('accept').includes('text/html')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Cache the latest version
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // If network fails, try cache
                    return caches.match(event.request).then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        // If not in cache, serve offline page
                        return caches.match('/offline.html');
                    });
                })
        );
        return;
    }

    // For other assets - cache first, then network
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    // Return cached response
                    return cachedResponse;
                }
                
                // If not in cache, fetch from network
                return fetch(event.request).then(response => {
                    // Cache the response for future
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                });
            })
    );
}); 