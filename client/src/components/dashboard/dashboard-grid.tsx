import { useState } from 'react';
import { useDashboardWidgets } from '@/hooks/use-dashboard-widgets';
import { Widget, AVAILABLE_WIDGETS, WidgetType } from './types';
import { Button } from '@/components/ui/button';
import { PlusCircle, RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { StaticWidget } from './static-widget';
import { VoiceCommands } from '@/components/voice/voice-commands';

// نوع الخاصيات لمكون DashboardGrid
interface DashboardGridProps {
  userId: number;
}

/**
 * مكون رئيسي لإدارة شبكة عناصر لوحة المعلومات وعمليات السحب والإفلات
 */
export function DashboardGrid({ userId }: DashboardGridProps) {
  // استخدام هوك لإدارة عناصر لوحة المعلومات
  const {
    widgets,
    isLoading,
    addWidget,
    removeWidget,
    updateWidgetOrder,
    resetToDefault,
  } = useDashboardWidgets();

  // حالة حوار إضافة عنصر جديد
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedWidgetType, setSelectedWidgetType] = useState<WidgetType | ''>('');
  const [selectedWidgetSize, setSelectedWidgetSize] = useState<Widget['size']>('medium');

  // معالجة تحريك العنصر للأعلى
  const handleMoveUp = (widgetId: string) => {
    const index = widgets.findIndex((w) => w.id === widgetId);
    if (index > 0) {
      const newWidgets = [...widgets];
      const temp = newWidgets[index];
      newWidgets[index] = newWidgets[index - 1];
      newWidgets[index - 1] = temp;
      
      // تحديث مواضع العناصر
      const updatedWidgets = newWidgets.map((widget, i) => ({
        ...widget,
        position: i,
      }));
      
      updateWidgetOrder(updatedWidgets);
    }
  };
  
  // معالجة تحريك العنصر للأسفل
  const handleMoveDown = (widgetId: string) => {
    const index = widgets.findIndex((w) => w.id === widgetId);
    if (index < widgets.length - 1) {
      const newWidgets = [...widgets];
      const temp = newWidgets[index];
      newWidgets[index] = newWidgets[index + 1];
      newWidgets[index + 1] = temp;
      
      // تحديث مواضع العناصر
      const updatedWidgets = newWidgets.map((widget, i) => ({
        ...widget,
        position: i,
      }));
      
      updateWidgetOrder(updatedWidgets);
    }
  };

  // إضافة عنصر جديد
  const handleAddWidget = () => {
    if (selectedWidgetType) {
      const widgetInfo = AVAILABLE_WIDGETS.find((w) => w.type === selectedWidgetType);
      
      if (widgetInfo) {
        addWidget({
          type: selectedWidgetType,
          title: widgetInfo.title,
          size: selectedWidgetSize,
        });

        // إعادة تعيين حالة الحوار وإغلاقه
        setSelectedWidgetType('');
        setSelectedWidgetSize('medium');
        setIsAddDialogOpen(false);
      }
    }
  };

  // غلق حوار الإضافة عند الإلغاء
  const handleDialogClose = () => {
    setSelectedWidgetType('');
    setSelectedWidgetSize('medium');
    setIsAddDialogOpen(false);
  };

  if (isLoading) {
    return <div className="text-center py-12">جاري تحميل لوحة المعلومات...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0 mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold">لوحة المعلومات</h2>
          {/* إضافة مكون الأوامر الصوتية */}
          <VoiceCommands
            onAddWidget={addWidget}
            onRemoveWidget={removeWidget}
            onResetToDefault={resetToDefault}
            widgetIds={widgets.map(w => w.id)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 text-sm sm:text-base" size="sm">
                <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="sm:inline">إضافة عنصر</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-center">إضافة عنصر جديد</DialogTitle>
                <DialogDescription className="text-center text-sm">
                  اختر نوع العنصر الذي تريد إضافته إلى لوحة المعلومات
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-3 sm:space-y-4 sm:py-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="widget-type" className="text-sm">نوع العنصر</Label>
                  <Select
                    value={selectedWidgetType}
                    onValueChange={(value) => setSelectedWidgetType(value as WidgetType)}
                  >
                    <SelectTrigger id="widget-type" className="text-sm">
                      <SelectValue placeholder="اختر نوع العنصر" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      <SelectGroup>
                        {AVAILABLE_WIDGETS.map((widget) => (
                          <SelectItem key={widget.type} value={widget.type} className="text-sm">
                            <div className="flex flex-col">
                              <span>{widget.title}</span>
                              <span className="text-xs text-gray-500">{widget.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="widget-size" className="text-sm">حجم العنصر</Label>
                  <Select
                    value={selectedWidgetSize}
                    onValueChange={(value) => setSelectedWidgetSize(value as Widget['size'])}
                  >
                    <SelectTrigger id="widget-size" className="text-sm">
                      <SelectValue placeholder="اختر حجم العنصر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="small" className="text-sm">صغير - ثلث العرض</SelectItem>
                        <SelectItem value="medium" className="text-sm">متوسط - نصف العرض</SelectItem>
                        <SelectItem value="large" className="text-sm">كبير - ثلثي العرض</SelectItem>
                        <SelectItem value="full" className="text-sm">كامل - العرض بالكامل</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={handleDialogClose} size="sm" className="sm:size-md w-full sm:w-auto">
                  إلغاء
                </Button>
                <Button
                  onClick={handleAddWidget}
                  disabled={!selectedWidgetType}
                  size="sm"
                  className="sm:size-md w-full sm:w-auto"
                >
                  إضافة
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            size="sm"
            title="إعادة تعيين إلى الإعدادات الافتراضية"
            onClick={resetToDefault}
            className="flex gap-1 items-center text-xs sm:text-sm"
          >
            <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="block">إعادة تعيين</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {widgets
          .sort((a, b) => a.position - b.position)
          .map((widget, index) => (
            <StaticWidget
              key={widget.id}
              widget={widget}
              userId={userId}
              onRemove={removeWidget}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              isFirst={index === 0}
              isLast={index === widgets.length - 1}
            />
          ))}
      </div>
    </div>
  );
}