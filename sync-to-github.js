// نظام المزامنة التلقائية المبسط لـ RimToken
import fs from 'fs';

export async function syncToGitHub() {
    try {
        console.log('🚀 تحديث موقع RimToken...');
        
        // نسخ أحدث ملف إلى مجلد docs
        if (fs.existsSync('rimtoken-chrome-compatible.html')) {
            fs.copyFileSync('rimtoken-chrome-compatible.html', 'docs/index.html');
            console.log('✅ تم تحديث ملف الموقع');
        }
        
        // تحديث الملف مع طابع زمني
        const timestamp = new Date().toLocaleString('ar-SA');
        console.log(`📅 آخر تحديث: ${timestamp}`);
        
        return true;
    } catch (error) {
        console.error('❌ خطأ في التحديث:', error.message);
        return false;
    }
}

// تشغيل التحديث
syncToGitHub();