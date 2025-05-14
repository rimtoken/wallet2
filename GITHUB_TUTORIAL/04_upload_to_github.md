# الخطوة 4: رفع المشروع إلى GitHub

بعد تنزيل المشروع وفك ضغطه، وإنشاء مستودع GitHub ورمز الوصول الشخصي، ستحتاج إلى تنفيذ الخطوات التالية في موجه الأوامر أو Terminal لرفع المشروع:

1. افتح موجه الأوامر (Command Prompt) أو Terminal على جهازك:

![افتح Terminal](https://i.imgur.com/GWy1JbB.png)

2. انتقل إلى مجلد المشروع الذي فككت ضغطه:
   ```bash
   cd path/to/rimtoken
   ```
   (استبدل "path/to/rimtoken" بالمسار الفعلي لمجلد المشروع على جهازك)

   ![انتقل إلى المجلد](https://i.imgur.com/pRlwA4P.png)

3. قم بتهيئة Git في المجلد:
   ```bash
   git init
   ```

   ![تهيئة Git](https://i.imgur.com/YiGRxHz.png)

4. قم بتكوين معلومات المستخدم المحلية:
   ```bash
   git config user.name "rimtoken"
   git config user.email "your-email@example.com"
   ```
   (استبدل "your-email@example.com" بالبريد الإلكتروني المرتبط بحساب GitHub)

   ![تكوين معلومات المستخدم](https://i.imgur.com/FO8sVMW.png)

5. قم بإضافة جميع الملفات إلى Git:
   ```bash
   git add .
   ```

   ![إضافة الملفات](https://i.imgur.com/JoHmtcB.png)

6. قم بعمل أول commit:
   ```bash
   git commit -m "Initial commit: RimToken Web3 wallet application"
   ```

   ![عمل commit](https://i.imgur.com/h8vQvY6.png)

7. قم بإضافة المستودع البعيد:
   ```bash
   git remote add origin https://rimtoken:<TOKEN>@github.com/rimtoken/rimtoken.git
   ```
   (استبدل `<TOKEN>` برمز الوصول الشخصي الذي أنشأته في الخطوة 2)

   ![إضافة المستودع البعيد](https://i.imgur.com/vZXF9NV.png)

8. قم بدفع الكود إلى الفرع الرئيسي:
   ```bash
   git branch -M main
   git push -u origin main
   ```

   ![دفع الكود](https://i.imgur.com/QEmwTPi.png)

9. بعد الانتهاء من رفع الملفات، يمكنك زيارة صفحة المستودع على GitHub للتحقق من أن جميع الملفات قد تم رفعها بنجاح:
   
   https://github.com/rimtoken/rimtoken

   ![الملفات على GitHub](https://i.imgur.com/HCrqJXU.png)