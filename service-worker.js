// Minimal service worker. Its only job is to satisfy the browser's
// "installable to home screen" requirement (Chrome/Android requires a
// fetch-handling service worker before it will offer the install prompt).
// It does NOT cache anything or provide offline support - every request
// still goes straight to the network. See context.md if you want to add
// real offline caching later; that's a deliberate follow-up, not an
// oversight.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
