// Service Worker v3 - Absolute Pass-through for maximum reliability
const CACHE_NAME = 'israa-it-cache-v3';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))
  );
  self.clients.claim();
});

// Pass-through strategy: Always go to network
self.addEventListener('fetch', event => {
  // Let the browser handle the request normally
  return;
});
