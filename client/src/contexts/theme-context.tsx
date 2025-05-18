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
    root.classList.remove('light-theme', 'dark-theme', 'system-theme', 'spooky-theme');
    
    // تطبيق الثيم الجديد
    root.classList.add(`${newTheme}-theme`);
    
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