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
  getText: (key: string) => string; // إضافة وظيفة getText كمرادف لـ translate
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
    'nav.deposit': 'إيداع',
    'nav.withdrawal': 'سحب',
    'nav.faq': 'الأسئلة الشائعة',
    'nav.advanced-dashboard': 'لوحة المعلومات',
    'nav.achievements': 'الإنجازات',
    'nav.contact': 'اتصل بنا',
    
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
    
    // عنوان التطبيق
    'app.title': 'محفظة وتبادل RimToken',
    'app.description': 'محفظة لامركزية متعددة السلاسل تتيح لك التحكم الكامل في أصولك الرقمية مع واجهة مستخدم سهلة وبسيطة',
    
    // الميزات
    'features.wallet': 'إدارة المحفظة',
    'features.wallet.desc': 'إدارة أصولك الرقمية بسهولة تامة مع واجهة مستخدم سلسة وآمنة',
    'features.wallet.cta': 'استكشاف المحفظة',
    'features.swap': 'تبادل العملات',
    'features.swap.desc': 'تبادل العملات المشفرة بسرعة وبدون تعقيدات مع رسوم منخفضة',
    'features.swap.cta': 'بدء التبادل',
    'features.market': 'تتبع الأسواق',
    'features.market.desc': 'متابعة أسعار العملات واتجاهات السوق في الوقت الحقيقي',
    'features.market.cta': 'قريباً',
    'features.team': 'فريق العمل',
    'features.team.desc': 'تعرف على فريق ريم توكن من الخبراء والمتخصصين',
    'features.team.cta': 'تعرف على الفريق',
    
    // التذييل
    'footer.quickLinks': 'روابط سريعة',
    'footer.contact': 'تواصل معنا',
    'footer.copyright': 'جميع الحقوق محفوظة',
    
    // ترجمات المصادقة
    'login': 'تسجيل الدخول',
    'register': 'إنشاء حساب',
    'loggingIn': 'جاري تسجيل الدخول...',
    'registering': 'جاري التسجيل...',
    'username': 'اسم المستخدم',
    'email': 'البريد الإلكتروني',
    'password': 'كلمة المرور',
    'confirmPassword': 'تأكيد كلمة المرور',
    'usernamePlaceholder': 'أدخل اسم المستخدم',
    'emailPlaceholder': 'أدخل البريد الإلكتروني',
    'passwordPlaceholder': 'أدخل كلمة المرور',
    'confirmPasswordPlaceholder': 'أكد كلمة المرور',
    'welcomeToRimToken': 'مرحباً بك في RimToken',
    'rimTokenDescription': 'محفظة العملات المشفرة متعددة السلاسل مع تبادل مدمج',
    'multiChainSupport': 'دعم متعدد السلاسل',
    'multiChainSupportDescription': 'تخزين وإدارة العملات المشفرة على مختلف شبكات البلوكتشين',
    'secureStorage': 'تخزين آمن',
    'secureStorageDescription': 'تحكم كامل في مفاتيحك الخاصة مع أمان متطور',
    'welcome': 'مرحباً',
    'loginSuccessful': 'تم تسجيل الدخول بنجاح',
    'loginFailed': 'فشل تسجيل الدخول',
    'registrationSuccessful': 'تم إنشاء الحساب بنجاح',
    'registrationFailed': 'فشل إنشاء الحساب',
    'logoutSuccessful': 'تم تسجيل الخروج بنجاح',
    'logoutFailed': 'فشل تسجيل الخروج',
    'seeSoonMessage': 'نراك قريباً!',
    'failedToFetchUser': 'فشل في جلب بيانات المستخدم',
    
    // ترجمات المحفظة
    'connectWallet': 'ربط المحفظة',
    'connectWalletDescription': 'اختر المحفظة التي ترغب في ربطها بحسابك',
    'walletConnected': 'تم ربط المحفظة',
    'connectedTo': 'متصل بـ',
    'walletAddress': 'عنوان المحفظة',
    'connectionFailed': 'فشل الاتصال',
    'unknownError': 'خطأ غير معروف',
    'connect': 'اتصال',
    'connecting': 'جاري الاتصال...',
    'comingSoon': 'قريباً',
    'walletSecurityNote': 'ملاحظة: RimToken لا يحفظ مفاتيحك الخاصة أبداً. أنت دائماً تتحكم في أموالك.',
    'connectWalletDialogDescription': 'قم بتوصيل محفظتك الخارجية للوصول إلى أصولك الرقمية',
    'authRequired': 'يجب تسجيل الدخول',
    'pleaseLoginFirst': 'يرجى تسجيل الدخول أولاً',
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
    'nav.deposit': 'Deposit',
    'nav.withdrawal': 'Withdrawal',
    'nav.faq': 'FAQ',
    'nav.advanced-dashboard': 'Dashboard',
    'nav.achievements': 'Achievements',
    'nav.contact': 'Contact',
    
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
    
    // App title
    'app.title': 'RimToken Wallet & Exchange',
    'app.description': 'A multi-chain self-custodial wallet that gives you complete control over your digital assets with a simple user interface',
    
    // Features
    'features.wallet': 'Wallet Management',
    'features.wallet.desc': 'Easily manage your digital assets with a smooth and secure user interface',
    'features.wallet.cta': 'Explore Wallet',
    'features.swap': 'Currency Exchange',
    'features.swap.desc': 'Exchange cryptocurrencies quickly and without complications with low fees',
    'features.swap.cta': 'Start Swapping',
    'features.market': 'Track Markets',
    'features.market.desc': 'Follow currency prices and market trends in real-time',
    'features.market.cta': 'Coming Soon',
    'features.team': 'Our Team',
    'features.team.desc': 'Meet the RimToken team of experts and specialists',
    'features.team.cta': 'Meet the Team',
    
    // Footer
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact Us',
    'footer.copyright': 'All Rights Reserved',
    
    // Authentication translations
    'login': 'Login',
    'register': 'Register',
    'loggingIn': 'Logging in...',
    'registering': 'Registering...',
    'username': 'Username',
    'email': 'Email',
    'password': 'Password',
    'confirmPassword': 'Confirm Password',
    'usernamePlaceholder': 'Enter your username',
    'emailPlaceholder': 'Enter your email',
    'passwordPlaceholder': 'Enter your password',
    'confirmPasswordPlaceholder': 'Confirm your password',
    'welcomeToRimToken': 'Welcome to RimToken',
    'rimTokenDescription': 'Multi-chain cryptocurrency wallet with integrated exchange',
    'multiChainSupport': 'Multi-Chain Support',
    'multiChainSupportDescription': 'Store and manage cryptocurrencies across different blockchain networks',
    'secureStorage': 'Secure Storage',
    'secureStorageDescription': 'Full control of your private keys with advanced security',
    'welcome': 'Welcome',
    'loginSuccessful': 'Logged in successfully',
    'loginFailed': 'Login failed',
    'registrationSuccessful': 'Account created successfully',
    'registrationFailed': 'Registration failed',
    'logoutSuccessful': 'Logged out successfully',
    'logoutFailed': 'Logout failed',
    'seeSoonMessage': 'See you soon!',
    'failedToFetchUser': 'Failed to fetch user data',
    
    // Wallet translations
    'connectWallet': 'Connect Wallet',
    'connectWalletDescription': 'Choose the wallet you want to connect to your account',
    'walletConnected': 'Wallet Connected',
    'connectedTo': 'Connected to',
    'walletAddress': 'Wallet address',
    'connectionFailed': 'Connection Failed',
    'unknownError': 'Unknown error',
    'connect': 'Connect',
    'connecting': 'Connecting...',
    'comingSoon': 'Coming Soon',
    'walletSecurityNote': 'Note: RimToken never stores your private keys. You always remain in control of your funds.',
    'connectWalletDialogDescription': 'Connect your external wallet to access your digital assets',
    'authRequired': 'Authentication Required',
    'pleaseLoginFirst': 'Please login first',
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
    'nav.deposit': 'Dépôt',
    'nav.withdrawal': 'Retrait',
    'nav.faq': 'FAQ',
    'nav.advanced-dashboard': 'Tableau de Bord',
    'nav.achievements': 'Réalisations',
    'nav.contact': 'Contact',
    
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
    
    // Titre de l'application
    'app.title': 'Portefeuille et Échange RimToken',
    'app.description': 'Un portefeuille multi-chaîne auto-dépositaire qui vous donne un contrôle total sur vos actifs numériques avec une interface utilisateur simple',
    
    // Fonctionnalités
    'features.wallet': 'Gestion du Portefeuille',
    'features.wallet.desc': 'Gérez facilement vos actifs numériques avec une interface utilisateur fluide et sécurisée',
    'features.wallet.cta': 'Explorer le Portefeuille',
    'features.swap': 'Échange de Devises',
    'features.swap.desc': 'Échangez des cryptomonnaies rapidement et sans complications avec des frais réduits',
    'features.swap.cta': 'Commencer l\'Échange',
    'features.market': 'Suivre les Marchés',
    'features.market.desc': 'Suivez les prix des devises et les tendances du marché en temps réel',
    'features.market.cta': 'Bientôt Disponible',
    'features.team': 'Notre Équipe',
    'features.team.desc': 'Rencontrez l\'équipe RimToken d\'experts et de spécialistes',
    'features.team.cta': 'Rencontrer l\'Équipe',
    
    // Pied de page
    'footer.quickLinks': 'Liens Rapides',
    'footer.contact': 'Contactez-nous',
    'footer.copyright': 'Tous Droits Réservés',
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

  // إضافة getText كمرادف لـ translate للتوافق مع الكود الجديد
  const getText = translate;

  return (
    <LanguageContext.Provider value={{ language, languageInfo, setLanguage, translate, getText }}>
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