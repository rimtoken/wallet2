import React from 'react';

export default function PosPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-indigo-600 text-transparent bg-clip-text">
        نقاط بيع العملات الرقمية
      </h1>
      
      <div className="text-center mb-6">
        <p className="text-muted-foreground max-w-2xl mx-auto">
          اعثر على أقرب نقطة بيع للعملات الرقمية واشترِ وبع العملات المشفرة بسهولة وأمان. استخدم خريطة نقاط البيع لتحديد الموقع الأقرب إليك.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
        <div className="p-8 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">مرحبًا بك في خدمة نقاط البيع</h2>
          <p>قريبًا ستتمكن من:</p>
          <ul className="list-disc mr-6 mt-2 space-y-2">
            <li>عرض قائمة بنقاط البيع القريبة منك على الخريطة</li>
            <li>تصفية نقاط البيع حسب العملات المدعومة</li>
            <li>الاطلاع على تفاصيل كل نقطة بيع وساعات العمل</li>
            <li>معرفة أسعار الصرف المحدثة بشكل مباشر</li>
            <li>حجز موعد لزيارة نقطة البيع وإجراء المعاملات</li>
          </ul>
          <div className="mt-6 p-4 bg-yellow-50 rounded-md">
            <p className="text-yellow-800">هذه الميزة قيد التطوير حاليًا وستكون متاحة قريبًا.</p>
          </div>
        </div>
      </div>
    </div>
  );
}