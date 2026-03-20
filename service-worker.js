// ═══════════════════════════════════════════
// SERVICE WORKER — The Internet Judges You
// Makes the app installable + works offline
// ═══════════════════════════════════════════

const CACHE_NAME = 'tijy-v1';
const ASSETS = [
'/The-Internet-Judge/',
  '/The-Internet-Judge/index.html',
  '/The-Internet-Judge/judgements.json',
  '/The-Internet-Judge/manifest.json',
  '/The-Internet-Judge/icons/icon-192.png',
  '/The-Internet-Judge/icons/icon-512.png'
];

// Install: cache all core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => {
        return caches.match('./index.html');
      });
    })
  );
});    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => {
        // If offline and asset not cached, return index.html
        return caches.match('/index.html');
      });
    })
  );
});
