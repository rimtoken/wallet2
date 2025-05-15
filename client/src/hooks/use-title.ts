import { useEffect } from 'react';

/**
 * Hook لتغيير عنوان الصفحة
 * @param title عنوان الصفحة الجديد
 */
export function useTitle(title: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}