import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Widget } from './types';
import { WidgetContainer } from './widget-container';
import { WidgetRenderer } from './widget-renderer';

// نوع الخاصيات لمكون DraggableWidget
interface DraggableWidgetProps {
  widget: Widget;
  userId: number;
  onRemove: (id: string) => void;
}

/**
 * مكون يجعل عنصر لوحة المعلومات قابلاً للسحب والإفلات
 */
export function DraggableWidget({ widget, userId, onRemove }: DraggableWidgetProps) {
  // استخدام مكتبة dnd-kit للسحب والإفلات
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: widget.id,
    data: {
      type: 'widget',
      widget,
    },
  });

  // تطبيق التحويلات المطلوبة أثناء السحب
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <WidgetContainer
        widget={widget}
        isDragging={isDragging}
        isOver={isOver}
        dragHandleProps={listeners}
        onRemove={() => onRemove(widget.id)}
      >
        <WidgetRenderer type={widget.type} userId={userId} />
      </WidgetContainer>
    </div>
  );
}