import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Widget } from './types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, X } from 'lucide-react';

interface WidgetContainerProps {
  widget: Widget;
  children: ReactNode;
  isDragging?: boolean;
  isOver?: boolean;
  dragHandleProps?: any;
  onRemove?: () => void;
  className?: string;
}

export function WidgetContainer({
  widget,
  children,
  isDragging = false,
  isOver = false,
  dragHandleProps,
  onRemove,
  className,
}: WidgetContainerProps) {
  // تحديد الأحجام المختلفة للشاشات المختلفة
  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-1 sm:col-span-2',
    large: 'col-span-full sm:col-span-2 md:col-span-3',
    full: 'col-span-full',
  };

  return (
    <Card
      className={cn(
        sizeClasses[widget.size],
        isDragging && 'opacity-50 border-dashed',
        isOver && 'border-blue-500',
        className
      )}
    >
      <CardHeader className="p-2 sm:p-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2">
          <div
            {...dragHandleProps}
            className="cursor-grab p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="اسحب لإعادة الترتيب"
          >
            <GripVertical className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
          </div>
          <CardTitle className="text-sm sm:text-lg truncate max-w-[150px] sm:max-w-none">
            {widget.title}
          </CardTitle>
        </div>
        
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 sm:h-8 sm:w-8 ml-1"
            onClick={onRemove}
            aria-label="إزالة العنصر"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-2 sm:p-4 overflow-x-auto">
        <div className="min-w-0">{children}</div>
      </CardContent>
    </Card>
  );
}