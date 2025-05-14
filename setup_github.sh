#!/bin/bash

# تم تحديث هذه المعلومات لربط المشروع بحساب rimtoken على GitHub
GITHUB_USERNAME="rimtoken"
REPO_NAME="rimtoken"
GITHUB_EMAIL="your-email@example.com"  # يجب تغيير هذا إلى البريد الإلكتروني المرتبط بحساب GitHub
GITHUB_TOKEN="your-github-personal-access-token"  # يجب إضافة رمز الوصول الشخصي الخاص بك هنا

# تهيئة Git في المشروع
git init

# إضافة Remote URL
git remote add origin https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git

# تكوين معلومات المستخدم المحلية
git config user.name "$GITHUB_USERNAME"
git config user.email "$GITHUB_EMAIL"

# إضافة جميع الملفات إلى Git
git add .

# عمل أول commit
git commit -m "Initial commit: RimToken Web3 wallet application"

# دفع الكود إلى الفرع الرئيسي
git branch -M main
git push -u origin main

echo "تم ربط المشروع بمستودع GitHub بنجاح!"