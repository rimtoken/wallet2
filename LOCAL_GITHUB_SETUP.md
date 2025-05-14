# إعداد مشروع RimToken على جهازك المحلي وربطه بـ GitHub

هذا الدليل يشرح كيفية تنزيل مشروع RimToken من Replit وربطه بحساب GitHub الخاص بك.

## الخطوة 1: تنزيل المشروع من Replit

1. في Replit، انقر على زر "⋮" (القائمة) في الزاوية العلوية اليسرى من واجهة المشروع
2. اختر "Download as zip"
3. قم بتنزيل ملف ZIP المضغوط وفك ضغطه في مجلد على جهازك المحلي

## الخطوة 2: إعداد Git محليًا

1. افتح موجه الأوامر أو Terminal
2. انتقل إلى مجلد المشروع:
   ```bash
   cd path/to/rimtoken
   ```
3. قم بتهيئة Git في المجلد:
   ```bash
   git init
   ```
4. قم بتكوين معلومات المستخدم المحلية:
   ```bash
   git config user.name "rimtoken"
   git config user.email "your-email@example.com"  # استبدل بالبريد الإلكتروني المرتبط بحساب GitHub
   ```

## الخطوة 3: إنشاء رمز وصول شخصي على GitHub

1. قم بتسجيل الدخول إلى حساب rimtoken على [GitHub](https://github.com/)
2. انقر على صورة الملف الشخصي في الزاوية العلوية اليمنى
3. اختر "Settings" من القائمة المنسدلة
4. قم بالتمرير لأسفل واختر "Developer settings" من الشريط الجانبي
5. اختر "Personal access tokens" ثم "Tokens (classic)"
6. انقر على "Generate new token" واختر "Generate new token (classic)"
7. أدخل وصفًا مثل "RimToken Repository Access"
8. حدد الصلاحيات التالية:
   - `repo` (كامل الصلاحيات للمستودعات)
   - `workflow` (للسماح بتشغيل GitHub Actions)
9. انقر على "Generate token"
10. انسخ الرمز الذي تم إنشاؤه فورًا (لن تتمكن من رؤيته مرة أخرى)

## الخطوة 4: إنشاء مستودع على GitHub

1. على الصفحة الرئيسية لحساب rimtoken، انقر على زر "New" لإنشاء مستودع جديد
2. أدخل اسم المستودع: `rimtoken`
3. أضف وصفًا مختصرًا (اختياري)
4. اختر ما إذا كنت تريد أن يكون المستودع عامًا أو خاصًا
5. **لا تقم بتحديد** خيار "Initialize this repository with a README"
6. انقر على "Create repository"

## الخطوة 5: ربط المستودع المحلي بـ GitHub وتحميل الملفات

1. في موجه الأوامر أو Terminal، قم بإضافة المستودع البعيد:
   ```bash
   git remote add origin https://rimtoken:<TOKEN>@github.com/rimtoken/rimtoken.git
   ```
   (استبدل `<TOKEN>` برمز الوصول الشخصي الذي أنشأته)

2. قم بإضافة جميع الملفات إلى Git:
   ```bash
   git add .
   ```

3. قم بعمل أول commit:
   ```bash
   git commit -m "Initial commit: RimToken Web3 wallet application"
   ```

4. قم بدفع الكود إلى الفرع الرئيسي:
   ```bash
   git branch -M main
   git push -u origin main
   ```

## الخطوة 6: إعداد الأسرار (Secrets) للـ GitHub Actions

1. انتقل إلى صفحة المستودع على GitHub: https://github.com/rimtoken/rimtoken
2. انقر على علامة التبويب "Settings"
3. اختر "Secrets and variables" ثم "Actions" من القائمة الجانبية
4. انقر على "New repository secret"
5. أدخل `VITE_INFURA_API_KEY` كاسم السر
6. أدخل مفتاح API الخاص بـ Infura في حقل "Value"
7. انقر على "Add secret"

---

بعد اتباع هذه الخطوات، سيكون مشروع RimToken متاحًا على GitHub ويمكنك الاستفادة من جميع ميزات GitHub مثل تتبع المشكلات، وطلبات السحب، والتكامل المستمر/التسليم المستمر.

## ملاحظة هامة

تأكد من عدم نشر المعلومات الحساسة مثل المفاتيح والأسرار وكلمات المرور. استخدم ملف `.env` المحلي لتخزين هذه المعلومات وتأكد من إدراج هذا الملف في `.gitignore`.