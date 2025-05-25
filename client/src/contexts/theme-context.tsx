import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system' | 'spooky';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');

  // عند بدء التشغيل، نقرأ الثيم المخزن سابقا
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  // تطبيق الثيم على العناصر
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // إزالة كل الثيمات السابقة
    root.classList.remove('dark-theme', 'light-theme', 'system-theme', 'spooky-theme', 'dark');
    document.body.classList.remove('dark-theme', 'light-theme', 'system-theme', 'spooky-theme', 'dark');
    root.setAttribute('data-theme', 'light');
    
    // تطبيق الثيم الجديد
    if (newTheme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark');
      root.classList.add('dark-theme');
      document.body.classList.add('dark-theme');
      root.setAttribute('data-theme', 'dark');
    } else if (newTheme === 'spooky') {
      root.classList.add('spooky-theme');
      document.body.classList.add('spooky-theme');
      root.setAttribute('data-theme', 'spooky');
    } else if (newTheme === 'system') {
      // التحقق من تفضيلات النظام
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
        document.body.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.setAttribute('data-theme', 'light');
      }
    } else {
      // الوضع الفاتح هو الافتراضي
      root.setAttribute('data-theme', 'light');
    }
    
    // حفظ الثيم في التخزين المحلي
    localStorage.setItem('theme', newTheme);
  };

  // تحديث الثيم
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}