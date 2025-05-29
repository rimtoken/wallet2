#!/usr/bin/env node

// نظام المزامنة التلقائية لـ RimToken
// يرفع أي تحديثات تلقائياً إلى GitHub

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function deployToGitHub(message = 'Auto-update RimToken website') {
    try {
        console.log('🚀 بدء عملية الرفع التلقائي...');
        
        // نسخ الملف المحدث إلى مجلد docs
        if (fs.existsSync('rimtoken-chrome-compatible.html')) {
            fs.copyFileSync('rimtoken-chrome-compatible.html', 'docs/index.html');
            console.log('✅ تم نسخ الملف المحدث');
        }
        
        // التحقق من وجود تغييرات
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        
        if (!status.trim()) {
            console.log('ℹ️ لا توجد تغييرات جديدة');
            return;
        }
        
        // رفع التحديثات
        execSync('git add docs/index.html', { stdio: 'inherit' });
        execSync('git commit -m', [JSON.stringify(message)], { stdio: 'inherit' });
        execSync('git push origin main', { stdio: 'inherit' });
        
        console.log('🎉 تم رفع التحديثات بنجاح إلى GitHub!');
        console.log('🌐 سيظهر الموقع المحدث على rimtoken.org خلال دقائق');
        
    } catch (error) {
        console.error('❌ خطأ في عملية الرفع:', error.message);
    }
}

// تشغيل النظام
deployToGitHub(process.argv[2]);

module.exports = { deployToGitHub };