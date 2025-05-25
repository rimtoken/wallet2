import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications, type Attachment } from '@capacitor/local-notifications';

// تهيئة الإشعارات إذا كنا على منصة جوال
export async function initPushNotifications() {
  if (Capacitor.isNativePlatform()) {
    try {
      // طلب الإذن للإشعارات
      const permissionStatus = await PushNotifications.requestPermissions();
      
      if (permissionStatus.receive === 'granted') {
        // تسجيل التطبيق للإشعارات
        await PushNotifications.register();
        
        // الاستماع للأحداث المتعلقة بالإشعارات
        addPushNotificationListeners();
        console.log('Push notifications registered successfully');
      } else {
        console.log('Push notification permission denied');
      }
    } catch (error) {
      console.error('Error registering push notifications', error);
    }
  } else {
    console.log('Push notifications not available in web environment');
  }
}

// إضافة مستمعي أحداث الإشعارات
function addPushNotificationListeners() {
  // عند استلام إشعار
  PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
    console.log('Push notification received:', notification);
    
    // إظهار إشعار محلي
    LocalNotifications.schedule({
      notifications: [
        {
          title: notification.title || 'RimToken',
          body: notification.body || '',
          id: Math.floor(Math.random() * 100000),
          schedule: { at: new Date(Date.now()) },
          sound: 'default',
          attachments: [],
          actionTypeId: '',
          extra: notification.data
        }
      ]
    });
  });
  
  // عند النقر على إشعار
  PushNotifications.addListener('pushNotificationActionPerformed', (action: any) => {
    console.log('Push notification action performed:', action);
    
    // يمكنك توجيه المستخدم إلى شاشة معينة حسب بيانات الإشعار
    const data = action.notification.data;
    handleNotificationAction(data);
  });
}

// معالجة الأفعال عند النقر على الإشعارات
function handleNotificationAction(data: any) {
  // مثال: إذا كان الإشعار متعلق بتغير سعر عملة معينة
  if (data?.type === 'price_alert') {
    // التنقل إلى صفحة معينة أو تنفيذ إجراء معين
    console.log('Navigating to price alert details', data);
    // window.location.href = `/alerts/${data.alertId}`;
  }
  
  // يمكنك إضافة منطق إضافي هنا للتعامل مع أنواع مختلفة من الإشعارات
}

// دالة لإرسال إشعار محلي (يمكن استخدامها للاختبار أو للإشعارات المحلية)
export async function sendLocalNotification(title: string, body: string, data: any = {}) {
  if (Capacitor.isNativePlatform()) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Math.floor(Math.random() * 100000),
            schedule: { at: new Date(Date.now()) },
            sound: 'default',
            attachments: [],
            actionTypeId: '',
            extra: data
          }
        ]
      });
      console.log('Local notification sent');
    } catch (error) {
      console.error('Error sending local notification', error);
    }
  } else {
    // محاكاة الإشعار في بيئة الويب
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(title, { body });
      }
    }
    console.log('Local notification simulated in web environment', { title, body, data });
  }
}