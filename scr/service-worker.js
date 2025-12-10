const CACHE_VERSION = 'pwa-v2';
const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

// Adjust this if your Vite base path changes
const APP_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

// Install: pre-cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then(async (cache) => {
      try {
        await cache.addAll(APP_SHELL_ASSETS);
      } catch (err) {
        console.warn('[SW] Failed to pre-cache some app shell assets', err);
      }
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches and take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![APP_SHELL_CACHE, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

const DUMMYJSON_BASE = 'https://dummyjson.com/products';

// Helper: is this a navigation request?
function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// Helper: should we runtime-cache this request?
function isPublicApiRequest(url) {
  return url.origin === new URL(DUMMYJSON_BASE).origin &&
    url.pathname.startsWith(new URL(DUMMYJSON_BASE).pathname);
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Offline SPA navigation: always serve cached app shell
  if (isNavigationRequest(request)) {
    event.respondWith(
      caches.match('/index.html').then((cached) => {
        if (cached) return cached;
        return fetch(request).catch(() => caches.match('/index.html'));
      })
    );
    return;
  }

  // Runtime caching for public API (DummyJSON)
  if (isPublicApiRequest(url)) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        try {
          // Network-first
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          // Offline: fallback to cache or an offline JSON message
          const cached = await cache.match(request);
          if (cached) return cached;
          return new Response(
            JSON.stringify({
              error: 'offline',
              message: 'You are offline. No cached data available.'
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
      })
    );
    return;
  }

  // Static assets: try cache first then network
  if (request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'image' ||
      request.destination === 'font') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(APP_SHELL_CACHE).then((cache) => {
            cache.put(request, copy);
          });
          return response;
        });
      })
    );
  }
});


