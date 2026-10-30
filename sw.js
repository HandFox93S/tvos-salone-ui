const CACHE_NAME = 'tvos-salone-v17';
const ASSETS = [
  './',
  './index.html',
  './sc.html?v=9',
  './icons/youtube_custom.png?v=7',
  './icons/netflix_custom.png',
  './icons/mediaset_custom.png',
  './icons/2.png',
  './icons/2256.jpg',
  './icons/sc_9n.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (
    event.request.method !== 'GET' ||
    event.request.url.includes('/api/') ||
    event.request.url.includes('ntfy.sh') ||
    event.request.url.includes('bytebin.lucko.me') ||
    event.request.url.includes('streamingunity-premium.to')
  ) return;
  event.respondWith(
    fetch(event.request, { cache: 'no-cache' })
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
