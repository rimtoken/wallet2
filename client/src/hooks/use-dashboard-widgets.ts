import { useState, useEffect } from 'react';
import { Widget, DEFAULT_WIDGETS } from '@/components/dashboard/types';

// مفتاح التخزين في localStorage
const DASHBOARD_WIDGETS_KEY = 'dashboard_widgets';

/**
 * هوك لإدارة العناصر في لوحة المعلومات
 */
export function useDashboardWidgets() {
  // حالة العناصر
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // تحميل العناصر من التخزين المحلي عند التحميل
  useEffect(() => {
    const loadWidgets = () => {
      try {
        const savedWidgets = localStorage.getItem(DASHBOARD_WIDGETS_KEY);
        if (savedWidgets) {
          setWidgets(JSON.parse(savedWidgets));
        } else {
          // استخدام الإعدادات الافتراضية إذا لم يتم العثور على تكوين مخصص
          setWidgets(DEFAULT_WIDGETS);
        }
      } catch (error) {
        console.error('فشل في تحميل عناصر لوحة المعلومات:', error);
        setWidgets(DEFAULT_WIDGETS);
      } finally {
        setIsLoading(false);
      }
    };

    loadWidgets();
  }, []);

  // حفظ العناصر في التخزين المحلي عند التغيير
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(DASHBOARD_WIDGETS_KEY, JSON.stringify(widgets));
    }
  }, [widgets, isLoading]);

  // إضافة عنصر جديد
  const addWidget = (widget: Omit<Widget, 'id' | 'position'>) => {
    const newWidget: Widget = {
      ...widget,
      id: `${widget.type}-${Date.now()}`,
      position: widgets.length,
    };

    setWidgets((prev) => [...prev, newWidget]);
  };

  // حذف عنصر بواسطة المعرف
  const removeWidget = (id: string) => {
    setWidgets((prev) => {
      const filteredWidgets = prev.filter((widget) => widget.id !== id);
      
      // إعادة ترتيب المواضع بعد الحذف
      return filteredWidgets.map((widget, index) => ({
        ...widget,
        position: index,
      }));
    });
  };

  // تحديث ترتيب العناصر
  const updateWidgetOrder = (updatedWidgets: Widget[]) => {
    setWidgets(updatedWidgets);
  };

  // تحديث حجم عنصر
  const updateWidgetSize = (id: string, size: Widget['size']) => {
    setWidgets((prev) =>
      prev.map((widget) =>
        widget.id === id ? { ...widget, size } : widget
      )
    );
  };

  // إعادة تعيين كل العناصر إلى الإعدادات الافتراضية
  const resetToDefault = () => {
    setWidgets(DEFAULT_WIDGETS);
  };

  return {
    widgets,
    isLoading,
    addWidget,
    removeWidget,
    updateWidgetOrder,
    updateWidgetSize,
    resetToDefault,
  };
}