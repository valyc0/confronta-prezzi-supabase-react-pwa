import { precacheAndRoute } from 'workbox-precaching'

// Self type declaration
declare let self: ServiceWorkerGlobalScope

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Precache all assets generated by vite
precacheAndRoute(self.__WB_MANIFEST)

// Cache first strategy for static assets
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch new version
      return response || fetch(event.request)
    })
  )
})
