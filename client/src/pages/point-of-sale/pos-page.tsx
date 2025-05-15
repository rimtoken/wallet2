import React, { useState, useEffect } from 'react';
import { PosMap, type PosLocation } from '@/components/pos/pos-map';
import { PosDetails } from '@/components/pos/pos-details';

export default function PosPage() {
  // تعيين عنوان الصفحة
  useEffect(() => {
    document.title = 'نقاط البيع - RimToken';
  }, []);
  
  const [selectedLocation, setSelectedLocation] = useState<PosLocation | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  
  // اختيار موقع
  const handleSelectLocation = (location: PosLocation) => {
    setSelectedLocation(location);
    setShowDetails(true);
  };
  
  // العودة إلى الخريطة
  const handleBackToMap = () => {
    setShowDetails(false);
  };
  
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
        {showDetails && selectedLocation ? (
          <PosDetails 
            location={selectedLocation} 
            onBack={handleBackToMap} 
          />
        ) : (
          <PosMap 
            onSelectLocation={handleSelectLocation} 
          />
        )}
      </div>
    </div>
  );
}