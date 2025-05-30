# RimToken - محفظة عملات رقمية متكاملة

<div align="center">
  <img src="attached_assets/logo.png.png" alt="RimToken Logo" width="200"/>
</div>

## نظرة عامة

RimToken هي تطبيق محفظة عملات رقمية متكامل يدعم شبكات Ethereum وSolana وBinance Smart Chain. يوفر التطبيق واجهة آمنة لتخزين العملات الرقمية، وعرض رصيد المحفظة، وسجل المعاملات، وأسعار السوق الحالية، مع القدرة على التفاعل المباشر مع العقود الذكية والتطبيقات اللامركزية.

## الميزات

- **دعم متعدد للبلوكتشين**: تكامل مع Ethereum (عبر Infura) وSolana وBinance Smart Chain
- **تتبع المحفظة**: عرض الرصيد الكلي وتوزيع الأصول
- **تاريخ المعاملات**: سجل كامل للمعاملات السابقة
- **أسعار السوق**: أسعار العملات الرقمية المحدثة بانتظام
- **واجهة مستخدم عصرية**: تصميم متجاوب يعمل على جميع الأجهزة
- **تخزين آمن**: استخدام قاعدة بيانات PostgreSQL للتخزين الدائم
- **دعم اللغة العربية**: واجهة متعددة اللغات

## التقنيات المستخدمة

- **الواجهة الأمامية**: React, Tailwind CSS, Shadcn UI
- **الخادم الخلفي**: Express.js
- **قاعدة البيانات**: PostgreSQL
- **تكاملات البلوكتشين**: ethers.js, @solana/web3.js, @binance-chain/javascript-sdk

## بدء الاستخدام

### المتطلبات الأساسية

- Node.js (الإصدار 18 أو أعلى)
- قاعدة بيانات PostgreSQL
- مفتاح API من Infura للاتصال بشبكة Ethereum

### تثبيت وتشغيل المشروع

1. استنسخ المستودع:
   ```
   git clone https://github.com/yourusername/rimtoken.git
   cd rimtoken
   ```

2. تثبيت الاعتمادات:
   ```
   npm install
   ```

3. إعداد المتغيرات البيئية:
   قم بإنشاء ملف `.env` في المجلد الرئيسي وأضف ما يلي:
   ```
   DATABASE_URL=postgres://username:password@localhost:5432/rimtoken
   VITE_INFURA_API_KEY=your_infura_api_key
   ```

4. تشغيل التطبيق:
   ```
   npm run dev
   ```

5. افتح المتصفح واذهب إلى:
   ```
   http://localhost:5000
   ```

## التطويرات المستقبلية

- إنشاء محفظة حقيقية وتوقيع المعاملات
- تعزيز الأمان (2FA، والقياسات الحيوية)
- دعم المزيد من شبكات البلوكتشين
- واجهة مستخدم متعددة اللغات بشكل كامل

## الترخيص

هذا المشروع مرخص بموجب [MIT License](LICENSE).# wallet2
"# wallet2" 
