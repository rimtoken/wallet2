import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BetterThemeToggle() {
  // استخدام حالة محلية لتتبع الوضع الداكن
  const [isDark, setIsDark] = useState(false);
  
  // تحقق من الوضع الحالي عند التحميل
  useEffect(() => {
    // تحقق من وضع النظام
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // تحقق من الإعداد المحفوظ
    const savedTheme = localStorage.getItem('theme');
    
    // تعيين الوضع المبدئي
    const initialDarkMode = savedTheme === 'dark' || (savedTheme !== 'light' && prefersDark);
    setIsDark(initialDarkMode);
    
    // تطبيق الوضع المبدئي
    applyTheme(initialDarkMode);
  }, []);
  
  // وظيفة تطبيق الوضع الداكن
  const applyTheme = (dark: boolean) => {
    // تطبيق الوضع الداكن على عنصر الجذر
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  // مؤثر تبديل الوضع الداكن
  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    applyTheme(newDarkMode);
  };
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-9 w-9 rounded-full"
      onClick={toggleDarkMode}
    >
      {isDark ? (
        <Moon className="h-5 w-5 text-gray-100 hover:text-white" />
      ) : (
        <Sun className="h-5 w-5 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white" />
      )}
      <span className="sr-only">تبديل الوضع</span>
    </Button>
  );
}