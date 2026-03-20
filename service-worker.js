// ═══════════════════════════════════════════
// SERVICE WORKER — The Internet Judges You
// GitHub Pages compatible (project repo)
// ═══════════════════════════════════════════

const CACHE_NAME = 'tijy-v1';

// IMPORTANT: include repo path
const BASE_PATH = '/The-Internet-Judge';

const ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/judgements.json`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/icons/icon-192.png`,
  `${BASE_PATH}/icons/icon-512.png`
];

// ═══════════════════════════════════════════
// INSTALL — cache core assets
// ═══════════════════════════════════════════
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching assets');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// ═══════════════════════════════════════════
// ACTIVATE — clean old caches
// ═══════════════════════════════════════════
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

// ═══════════════════════════════════════════
// FETCH — cache-first strategy
// ═══════════════════════════════════════════
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          // Optional: cache new requests dynamically
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // Offline fallback
          if (event.request.mode === 'navigate') {
            return caches.match(`${BASE_PATH}/index.html`);
          }
        });
    })
  );
});
