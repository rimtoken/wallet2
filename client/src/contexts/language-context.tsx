import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// أنواع اللغات المدعومة
export type Language = 'ar' | 'en' | 'fr';

// معلومات اللغة
export interface LanguageInfo {
  code: Language;
  name: string;
  direction: 'rtl' | 'ltr';
}

// سياق اللغة
interface LanguageContextType {
  language: Language;
  languageInfo: LanguageInfo;
  setLanguage: (language: Language) => void;
  translate: (key: string) => string;
}

// معلومات اللغات المدعومة
export const LANGUAGES: Record<Language, LanguageInfo> = {
  ar: { code: 'ar', name: 'العربية', direction: 'rtl' },
  en: { code: 'en', name: 'English', direction: 'ltr' },
  fr: { code: 'fr', name: 'Français', direction: 'ltr' },
};

// إنشاء سياق اللغة
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// الترجمات المبدئية
const translations: Record<Language, Record<string, string>> = {
  ar: {
    // ترجمات القائمة الرئيسية
    'nav.home': 'الرئيسية',
    'nav.wallet': 'المحفظة',
    'nav.swap': 'تبادل',
    'nav.market': 'السوق',
    'nav.news': 'الأخبار',
    'nav.priceAlerts': 'تنبيهات الأسعار',
    'nav.team': 'فريقنا',
    'nav.about': 'حول',
    
    // ترجمات أزرار المستخدم
    'user.login': 'تسجيل الدخول',
    'user.register': 'التسجيل',
    'user.profile': 'الملف الشخصي',
    'user.settings': 'الإعدادات',
    
    // ترجمات عامة
    'general.chooseLanguage': 'اختر اللغة',
    'general.loading': 'جاري التحميل...',
    'general.error': 'حدث خطأ!',
    'general.success': 'تمت العملية بنجاح!',
  },
  en: {
    // Main navigation translations
    'nav.home': 'Home',
    'nav.wallet': 'Wallet',
    'nav.swap': 'Swap',
    'nav.market': 'Market',
    'nav.news': 'News',
    'nav.priceAlerts': 'Price Alerts',
    'nav.team': 'Our Team',
    'nav.about': 'About',
    
    // User button translations
    'user.login': 'Log in',
    'user.register': 'Register',
    'user.profile': 'Profile',
    'user.settings': 'Settings',
    
    // General translations
    'general.chooseLanguage': 'Choose Language',
    'general.loading': 'Loading...',
    'general.error': 'An error occurred!',
    'general.success': 'Operation completed successfully!',
  },
  fr: {
    // Traductions de la navigation principale
    'nav.home': 'Accueil',
    'nav.wallet': 'Portefeuille',
    'nav.swap': 'Échange',
    'nav.market': 'Marché',
    'nav.news': 'Actualités',
    'nav.priceAlerts': 'Alertes de Prix',
    'nav.team': 'Notre Équipe',
    'nav.about': 'À Propos',
    
    // Traductions des boutons utilisateur
    'user.login': 'Connexion',
    'user.register': 'Inscription',
    'user.profile': 'Profil',
    'user.settings': 'Paramètres',
    
    // Traductions générales
    'general.chooseLanguage': 'Choisir la Langue',
    'general.loading': 'Chargement...',
    'general.error': 'Une erreur est survenue!',
    'general.success': 'Opération réussie!',
  },
};

// مزود سياق اللغة
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // استرجاع اللغة المخزنة سابقًا في localStorage أو استخدام العربية كلغة افتراضية
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const savedLanguage = localStorage.getItem('language') as Language;
      // التحقق من أن اللغة المحفوظة مدعومة
      return savedLanguage && LANGUAGES[savedLanguage] ? savedLanguage : 'ar';
    } catch (e) {
      // في حالة عدم إمكانية الوصول إلى localStorage (مثل في بيئة SSR)
      return 'ar';
    }
  });

  const [languageInfo, setLanguageInfo] = useState<LanguageInfo>(LANGUAGES[language]);

  // تحديث اتجاه الصفحة عند تغيير اللغة
  useEffect(() => {
    document.documentElement.dir = LANGUAGES[language].direction;
    document.documentElement.lang = language;
    document.body.classList.remove('dir-rtl', 'dir-ltr');
    document.body.classList.add(`dir-${LANGUAGES[language].direction}`);
    
    try {
      localStorage.setItem('language', language);
    } catch (e) {
      console.error('Failed to save language preference to localStorage:', e);
    }
    setLanguageInfo(LANGUAGES[language]);
  }, [language]);

  // دالة للحصول على الترجمة بواسطة المفتاح
  const translate = (key: string): string => {
    const translation = translations[language][key];
    // إذا لم يتم العثور على ترجمة، نعرض المفتاح كما هو
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, languageInfo, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

// دالة مساعدة لاستخدام سياق اللغة
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};