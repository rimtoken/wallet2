// اسم التخزين المؤقت للتطبيق
const CACHE_NAME = 'rimtoken-cache-v1';

// قائمة بالموارد التي سيتم تخزينها مؤقتًا
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('فتح ذاكرة التخزين المؤقت');
        return cache.addAll(urlsToCache);
      })
  );
});

// استراتيجية الشبكة أولاً ثم التخزين المؤقت
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // نسخ الاستجابة
        const responseClone = response.clone();
        
        // فتح التخزين المؤقت وتخزين الاستجابة
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseClone);
          });
          
        return response;
      })
      .catch(() => {
        // إذا فشلت الشبكة، حاول من التخزين المؤقت
        return caches.match(event.request);
      })
  );
});

// تحديث التخزين المؤقت
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // حذف التخزين المؤقت القديم
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});