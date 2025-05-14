import { SimpleVoiceCommand } from './simple-voice-command';
import { Widget, WidgetType } from '@/components/dashboard/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Mic, HelpCircle } from 'lucide-react';

interface VoiceCommandsProps {
  onAddWidget: (widget: Omit<Widget, 'id' | 'position'>) => void;
  onRemoveWidget: (id: string) => void;
  onResetToDefault: () => void;
  widgetIds: string[];
}

/**
 * مكون يوفر واجهة للأوامر الصوتية في تطبيق RimToken
 */
export function VoiceCommands({
  onAddWidget,
  onRemoveWidget,
  onResetToDefault,
  widgetIds,
}: VoiceCommandsProps) {
  // معالج إضافة عنصر جديد بناءً على الأمر الصوتي
  const handleAddWidget = (type: string, size: string) => {
    const widgetType = type as WidgetType;
    const widgetSize = size as Widget['size'];
    
    // تحديد العنوان المناسب حسب نوع العنصر
    let title = '';
    switch (widgetType) {
      case 'portfolio-summary':
        title = 'ملخص المحفظة';
        break;
      case 'portfolio-chart':
        title = 'مخطط المحفظة';
        break;
      case 'asset-list':
        title = 'الأصول';
        break;
      case 'transaction-history':
        title = 'سجل المعاملات';
        break;
      case 'market-overview':
        title = 'نظرة عامة على السوق';
        break;
      case 'price-alerts':
        title = 'تنبيهات الأسعار';
        break;
      case 'news-feed':
        title = 'آخر الأخبار';
        break;
      default:
        title = 'عنصر جديد';
    }
    
    onAddWidget({
      type: widgetType,
      title,
      size: widgetSize,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <SimpleVoiceCommand
        onAddWidget={handleAddWidget}
        onRemoveWidget={onRemoveWidget}
        onResetWidgets={onResetToDefault}
        widgetIds={widgetIds}
      />
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">الأوامر الصوتية المتاحة</h4>
            
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="flex items-start gap-1">
                <span className="font-semibold">•</span>
                <span>
                  <strong>أضف [نوع العنصر] [الحجم]</strong>: إضافة عنصر جديد
                  <br />
                  <span className="opacity-75">مثال: "أضف ملخص المحفظة متوسط"</span>
                </span>
              </li>
              
              <li className="flex items-start gap-1">
                <span className="font-semibold">•</span>
                <span>
                  <strong>احذف [رقم العنصر]</strong>: حذف عنصر موجود
                  <br />
                  <span className="opacity-75">مثال: "احذف العنصر 2"</span>
                </span>
              </li>
              
              <li className="flex items-start gap-1">
                <span className="font-semibold">•</span>
                <span>
                  <strong>إعادة تعيين</strong>: إعادة ضبط لوحة المعلومات إلى الحالة الافتراضية
                </span>
              </li>
              
              <li className="flex items-start gap-1">
                <span className="font-semibold">•</span>
                <span>
                  <strong>مساعدة</strong>: عرض قائمة الأوامر المتاحة
                </span>
              </li>
            </ul>
            
            <div className="mt-4 text-xs bg-muted p-2 rounded">
              <p className="font-medium mb-1">أنواع العناصر المتاحة:</p>
              <p>ملخص المحفظة، مخطط، أصول، معاملات، سوق، أخبار، تنبيهات</p>
              
              <p className="font-medium mb-1 mt-2">أحجام العناصر:</p>
              <p>صغير، متوسط، كبير، كامل</p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}