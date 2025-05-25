import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { initPushNotifications } from './push-notifications';

// تهيئة تطبيق الجوال
export async function initializeCapacitor() {
  // التحقق مما إذا كان التطبيق يعمل على جهاز جوال أصلي
  if (Capacitor.isNativePlatform()) {
    console.log('Running on native platform:', Capacitor.getPlatform());
    
    try {
      // إخفاء شاشة البداية بعد اكتمال تحميل التطبيق
      await SplashScreen.hide();
      
      // ضبط لون شريط الحالة
      if (Capacitor.getPlatform() === 'android') {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#6366f1' });
      }
      
      // إضافة مستمع لأحداث التطبيق
      App.addListener('backButton', handleBackButton);
      App.addListener('appStateChange', handleAppStateChange);
      
      // تهيئة الإشعارات
      await initPushNotifications();
      
      console.log('Capacitor initialized successfully');
    } catch (error) {
      console.error('Error initializing Capacitor:', error);
    }
  } else {
    console.log('Running in web environment, Capacitor native features not available');
  }
}

// معالجة ضغط زر الرجوع على الأندرويد
function handleBackButton() {
  // إذا كنا في الصفحة الرئيسية، نسأل المستخدم إذا كان يريد الخروج
  if (window.location.pathname === '/') {
    App.exitApp();
  } else {
    // غير ذلك، نرجع إلى الصفحة السابقة
    window.history.back();
  }
}

// معالجة تغييرات حالة التطبيق (عندما يكون في الخلفية/المقدمة)
function handleAppStateChange({ isActive }: { isActive: boolean }) {
  if (isActive) {
    console.log('App came to foreground');
    // يمكنك تحديث البيانات أو تنفيذ إجراءات عندما يعود التطبيق إلى المقدمة
  } else {
    console.log('App went to background');
    // يمكنك حفظ الحالة أو تنفيذ إجراءات عندما يذهب التطبيق إلى الخلفية
  }
}

// معرفة ما إذا كان التطبيق يعمل على جهاز جوال
export function isNativeMobile(): boolean {
  return Capacitor.isNativePlatform();
}

// معرفة منصة التشغيل (android/ios/web)
export function getPlatform(): string {
  return Capacitor.getPlatform();
}

// إظهار شاشة البداية (مفيد عند تحميل بيانات أو الانتقال بين الشاشات الرئيسية)
export async function showSplashScreen() {
  if (Capacitor.isNativePlatform()) {
    await SplashScreen.show();
  }
}

// استخدام الاهتزاز (إن كان متاحًا)
export async function vibrateDevice() {
  if (Capacitor.isNativePlatform() && 'navigator' in window && 'vibrate' in navigator) {
    navigator.vibrate(200);
  }
}