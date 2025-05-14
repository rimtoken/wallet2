import { ReactNode } from 'react';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface TouchFriendlyDndContextProps {
  items: string[];
  onDragEnd: (event: DragEndEvent) => void;
  children: ReactNode;
}

/**
 * مكون لتوفير سياق drag-and-drop محسن للأجهزة اللمسية
 */
export function TouchFriendlyDndContext({
  items,
  onDragEnd,
  children,
}: TouchFriendlyDndContextProps) {
  // تكوين المستشعرات للعمل بشكل أفضل مع الأجهزة اللمسية والأجهزة المكتبية
  const sensors = useSensors(
    // مستشعر المؤشر يعمل مع الفأرة
    useSensor(PointerSensor, {
      // تخفيض المسافة المطلوبة لبدء السحب على أجهزة الماوس
      activationConstraint: { distance: 4 },
    }),
    
    // مستشعر اللمس يعمل بشكل أفضل مع الأجهزة اللمسية
    useSensor(TouchSensor, {
      // تخفيض وقت الضغط المطلوب لبدء السحب على الأجهزة اللمسية
      activationConstraint: { delay: 150, tolerance: 8 },
    }),
    
    // لدعم السحب باستخدام لوحة المفاتيح للوصول
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}