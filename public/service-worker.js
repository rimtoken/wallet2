// تكوين Service Worker لتطبيق RimToken
const CACHE_NAME = 'rimtoken-v1';

// الملفات التي سيتم تخزينها في ذاكرة التخزين المؤقت
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/index.css',
  '/assets/index.js',
];

// تثبيت Service Worker وتخزين الملفات الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('تم فتح ذاكرة التخزين المؤقت');
        return cache.addAll(urlsToCache);
      })
  );
});

// استراتيجية الشبكة أولاً ثم الرجوع إلى ذاكرة التخزين المؤقت
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // إذا كان الطلب ناجحًا، قم بتخزين النسخة في ذاكرة التخزين المؤقت
        if (event.request.method === 'GET') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // إذا فشل الطلب، حاول العثور عليه في ذاكرة التخزين المؤقت
        return caches.match(event.request);
      })
  );
});

// تحديث ذاكرة التخزين المؤقت عند تثبيت إصدار جديد
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // إزالة ذاكرة التخزين المؤقت القديمة
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// الاستماع للرسائل من النافذة الرئيسية
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// معالجة إشعارات الدفع
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'تم استلام تحديث جديد',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: data.data || {},
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'RimToken', options)
    );
  }
});

// معالجة النقر على الإشعارات
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});