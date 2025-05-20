import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * تنسيق القيم المالية بطريقة سهلة القراءة
 * @param value القيمة المالية
 * @param digits عدد الأرقام العشرية (افتراضي: 2)
 * @returns نص منسق
 */
export function formatCurrency(value: number, digits: number = 2): string {
  // التعامل مع القيم الكبيرة
  if (value >= 1000000) {
    return (value / 1000000).toFixed(digits) + "M";
  }
  
  // التعامل مع القيم المتوسطة
  if (value >= 1000) {
    return (value / 1000).toFixed(digits) + "K";
  }

  // القيم العادية
  return value.toLocaleString(undefined, {
    minimumFractionDigits: value < 1 ? 4 : digits,
    maximumFractionDigits: value < 1 ? 6 : digits,
  });
}
