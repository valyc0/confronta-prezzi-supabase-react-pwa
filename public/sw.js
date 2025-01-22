const CACHE_NAME = 'product-comparison-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

console.log('[Service Worker] Initializing');

self.addEventListener('install', event => {
  console.log('[Service Worker] Install event started');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell and content');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] All required content is cached');
      })
      .catch(error => {
        console.error('[Service Worker] Cache error:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  console.log('[Service Worker] Fetch event for:', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          console.log('[Service Worker] Returning cached response for:', event.request.url);
          return response;
        }

        console.log('[Service Worker] Fetching new response for:', event.request.url);
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              console.log('[Service Worker] Invalid response, returning as-is for:', event.request.url);
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                console.log('[Service Worker] Caching new response for:', event.request.url);
                cache.put(event.request, responseToCache);
              })
              .catch(error => {
                console.error('[Service Worker] Error caching new response:', error);
              });

            return response;
          }
        ).catch(error => {
          console.error('[Service Worker] Fetch error:', error);
          throw error;
        });
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate event started');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      console.log('[Service Worker] Checking caches:', cacheNames);
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Activate completed');
    })
  );
});
