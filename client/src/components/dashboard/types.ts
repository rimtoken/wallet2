// تعريف أنواع العناصر التي يمكن إضافتها إلى لوحة المعلومات
export type WidgetType = 
  | 'portfolio-summary' 
  | 'portfolio-chart' 
  | 'asset-list' 
  | 'transaction-history' 
  | 'market-overview'
  | 'price-alerts'
  | 'news-feed';

// تعريف نموذج العنصر في لوحة المعلومات
export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: 'small' | 'medium' | 'large' | 'full'; // حجم العنصر
  position: number; // ترتيب العنصر في اللوحة
}

// تعريف الإعدادات الافتراضية للعناصر
export const DEFAULT_WIDGETS: Widget[] = [
  {
    id: 'portfolio-summary',
    type: 'portfolio-summary',
    title: 'ملخص المحفظة',
    size: 'medium',
    position: 0,
  },
  {
    id: 'portfolio-chart',
    type: 'portfolio-chart',
    title: 'مخطط المحفظة',
    size: 'medium',
    position: 1,
  },
  {
    id: 'asset-list',
    type: 'asset-list',
    title: 'الأصول',
    size: 'full',
    position: 2,
  },
  {
    id: 'transaction-history',
    type: 'transaction-history',
    title: 'سجل المعاملات',
    size: 'large',
    position: 3,
  },
  {
    id: 'market-overview',
    type: 'market-overview',
    title: 'نظرة عامة على السوق',
    size: 'large',
    position: 4,
  },
];

// تعريف العناصر المتاحة للإضافة إلى لوحة المعلومات
export const AVAILABLE_WIDGETS: { type: WidgetType; title: string; description: string }[] = [
  {
    type: 'portfolio-summary',
    title: 'ملخص المحفظة',
    description: 'عرض ملخص لقيمة محفظتك والتغييرات اليومية',
  },
  {
    type: 'portfolio-chart',
    title: 'مخطط المحفظة',
    description: 'عرض مخطط بياني لأداء محفظتك عبر الوقت',
  },
  {
    type: 'asset-list',
    title: 'الأصول',
    description: 'قائمة بجميع الأصول في محفظتك',
  },
  {
    type: 'transaction-history',
    title: 'سجل المعاملات',
    description: 'عرض أحدث المعاملات التي قمت بها',
  },
  {
    type: 'market-overview',
    title: 'نظرة عامة على السوق',
    description: 'اطلع على حالة سوق العملات الرقمية',
  },
  {
    type: 'price-alerts',
    title: 'تنبيهات الأسعار',
    description: 'إعداد وإدارة تنبيهات عند تغير أسعار العملات',
  },
  {
    type: 'news-feed',
    title: 'آخر الأخبار',
    description: 'أحدث أخبار العملات الرقمية والتكنولوجيا المالية',
  },
];