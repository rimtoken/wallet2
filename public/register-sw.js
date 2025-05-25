// تسجيل Service Worker لدعم العمل بدون إنترنت
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('تم تسجيل Service Worker بنجاح:', registration.scope);
      })
      .catch((error) => {
        console.error('فشل في تسجيل Service Worker:', error);
      });
  });
}

// تحديث Service Worker إذا كان هناك تحديث جديد متاح
let refreshing = false;
navigator.serviceWorker.addEventListener('controllerchange', () => {
  if (refreshing) return;
  refreshing = true;
  window.location.reload();
});

// إرسال رسالة إلى Service Worker لتخطي الانتظار
function skipWaiting() {
  const reloadPage = () => {
    window.location.reload();
    refreshing = true;
  };

  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    navigator.serviceWorker.addEventListener('controllerchange', reloadPage);
  }
}