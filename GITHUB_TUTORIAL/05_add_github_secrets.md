# الخطوة 5: إضافة الأسرار (Secrets) لـ GitHub Actions

لضمان عمل GitHub Actions بشكل صحيح، تحتاج إلى إضافة مفتاح API الخاص بـ Infura كسر في المستودع:

1. انتقل إلى صفحة المستودع على GitHub: https://github.com/rimtoken/rimtoken

2. انقر على علامة التبويب "Settings" في أعلى الصفحة:

![انقر على Settings](https://i.imgur.com/bx1v16o.png)

3. من القائمة الجانبية، اختر "Secrets and variables" ثم "Actions":

![اختر Secrets and variables](https://i.imgur.com/Tyr9lQv.png)

4. انقر على زر "New repository secret":

![انقر على New repository secret](https://i.imgur.com/dWMJg2r.png)

5. أدخل `VITE_INFURA_API_KEY` كاسم للسر:

6. أدخل مفتاح API الخاص بـ Infura في حقل "Value":

![أدخل السر](https://i.imgur.com/z06w82S.png)

7. انقر على "Add secret":

![انقر على Add secret](https://i.imgur.com/aPzm9Wx.png)

8. سيظهر السر في قائمة الأسرار المستخدمة في المستودع:

![قائمة الأسرار](https://i.imgur.com/0ZbL1yn.png)

بهذا، تكون قد أكملت جميع الخطوات اللازمة لربط مشروع RimToken بحساب GitHub والتأكد من أنه يعمل بشكل صحيح مع GitHub Actions.