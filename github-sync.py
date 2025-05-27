#!/usr/bin/env python3
# نظام المزامنة التلقائية لـ RimToken مع GitHub

import subprocess
import shutil
import os
import time
from datetime import datetime

def sync_to_github(commit_message="Auto-update RimToken website"):
    """رفع التحديثات تلقائياً إلى GitHub"""
    
    try:
        print("🚀 بدء عملية المزامنة التلقائية...")
        
        # نسخ أحدث ملف إلى مجلد docs
        source_files = [
            'rimtoken-chrome-compatible.html',
            'rimtoken-complete.html',
            'crypto-template.html'
        ]
        
        for source in source_files:
            if os.path.exists(source):
                shutil.copy2(source, 'docs/index.html')
                print(f"✅ تم نسخ {source} إلى docs/index.html")
                break
        
        # التحقق من وجود تغييرات
        result = subprocess.run(['git', 'status', '--porcelain'], 
                              capture_output=True, text=True)
        
        if not result.stdout.strip():
            print("ℹ️ لا توجد تغييرات جديدة")
            return False
        
        # إضافة الملفات المحدثة
        subprocess.run(['git', 'add', 'docs/index.html'], check=True)
        
        # إنشاء commit
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        full_message = f"{commit_message} - {timestamp}"
        subprocess.run(['git', 'commit', '-m', full_message], check=True)
        
        # رفع إلى GitHub
        subprocess.run(['git', 'push', 'origin', 'main'], check=True)
        
        print("🎉 تم رفع التحديثات بنجاح!")
        print("🌐 الموقع المحدث سيظهر على rimtoken.org خلال دقائق")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ خطأ في Git: {e}")
        return False
    except Exception as e:
        print(f"❌ خطأ عام: {e}")
        return False

def deploy_update(message="Automated RimToken website update"):
    """دالة سريعة للنشر"""
    return sync_to_github(message)

if __name__ == "__main__":
    import sys
    message = sys.argv[1] if len(sys.argv) > 1 else "Auto-update RimToken website"
    sync_to_github(message)