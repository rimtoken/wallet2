# دليل رفع المشروع إلى GitHub Pages

## الخطوات المطلوبة لرفع موقع RimToken إلى GitHub Pages:

### 1. إنشاء مستودع GitHub جديد
1. اذهب إلى [github.com](https://github.com) وسجل الدخول
2. انقر على "New repository" أو الزر الأخضر "New"
3. اسم المستودع: `rimtoken-website`
4. اجعل المستودع عاماً (Public)
5. انقر "Create repository"

### 2. رفع الملفات إلى المستودع
```bash
# في سطر الأوامر، انتقل إلى مجلد المشروع
cd /path/to/your/project

# تهيئة git
git init

# إضافة الملفات
git add docs/
git add CNAME
git add README.md

# تأكيد التغييرات
git commit -m "إضافة ملفات GitHub Pages"

# ربط المستودع المحلي بـ GitHub
git remote add origin https://github.com/YOUR_USERNAME/rimtoken-website.git

# رفع الملفات
git push -u origin main
```

### 3. تفعيل GitHub Pages
1. اذهب إلى إعدادات المستودع (Settings)
2. مرر إلى قسم "Pages" في القائمة الجانبية
3. في "Source"، اختر "Deploy from a branch"
4. اختر الفرع: `main`
5. اختر المجلد: `/docs`
6. انقر "Save"

### 4. ربط النطاق المخصص
1. في نفس صفحة Pages
2. في قسم "Custom domain"، أدخل: `rimtoken.org`
3. انقر "Save"
4. فعل خيار "Enforce HTTPS"

### 5. تحديث سجلات DNS
في لوحة تحكم مزود النطاق، تأكد من وجود:

```
نوع السجل: A
الاسم: @
القيمة: 185.199.108.153

نوع السجل: A  
الاسم: @
القيمة: 185.199.109.153

نوع السجل: A
الاسم: @
القيمة: 185.199.110.153

نوع السجل: A
الاسم: @
القيمة: 185.199.111.153

نوع السجل: CNAME
الاسم: www
القيمة: YOUR_USERNAME.github.io
```

### 6. التحقق من عمل الموقع
- انتظر 5-10 دقائق لانتشار التغييرات
- زر `https://rimtoken.org` للتأكد من عمل الموقع
- تأكد من عمل شهادة SSL (HTTPS)

## الملفات المطلوبة (تم إنشاؤها):
✅ `docs/index.html` - الصفحة الرئيسية  
✅ `docs/README.md` - وصف المشروع  
✅ `CNAME` - ملف النطاق المخصص  

## ملاحظات مهمة:
- GitHub Pages مجاني للمستودعات العامة
- يدعم شهادات SSL تلقائياً للنطاقات المخصصة
- التحديثات تنتشر خلال دقائق قليلة
- يمكنك ربط النطاق الفرعي www.rimtoken.org أيضاً

## الرابط إلى التطبيق الكامل:
الصفحة تحتوي على روابط إلى التطبيق الكامل على Replit:
`https://rimtoken-dahm2621.replit.app`

هذا يعني أن الزوار سيرون صفحة عرض جميلة على rimtoken.org ويمكنهم الانتقال إلى التطبيق الكامل عند الحاجة.