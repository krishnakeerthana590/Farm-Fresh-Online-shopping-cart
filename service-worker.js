const cacheName = 'farmfresh-v1';
const assets = [
  '/',
  '/index.html',
  '/checkout.html',
  '/manifest.json',
  '/service-worker.js',
  'https://cdn.tailwindcss.com',

  // Product images to cache
  'https://m.media-amazon.com/images/I/51cHCkeA9OL.jpg',
  'https://m.media-amazon.com/images/I/71fYpWUN-LL.jpg',
  'https://m.media-amazon.com/images/I/51HrWTG8boL.jpg',
  'https://m.media-amazon.com/images/I/81xUe8uy2UL.jpg',
  'https://m.media-amazon.com/images/I/51Py3w+VQFL.jpg',
  'https://m.media-amazon.com/images/I/61pE8vXyPLL.jpg',
  'https://m.media-amazon.com/images/I/71DnIqEw9UL.jpg',
  'https://m.media-amazon.com/images/I/71n8beFpC2L.jpg',
  'https://m.media-amazon.com/images/I/81APwvLCMXL.jpg',
  'https://m.media-amazon.com/images/I/61uxMgUZf-L.jpg',
  'https://m.media-amazon.com/images/I/71A7XQOaWgL.jpg'
];

// Install event - caching files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assets))
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve cached assets or fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request).catch(() => {
        // Fallback to index.html for navigation requests if offline
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
