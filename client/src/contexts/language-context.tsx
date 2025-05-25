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
    'connectWalletArabic': 'ربط المحفظة',
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
    'myWallet': 'محفظتي',
    'assets': 'الأصول',
    'transactions': 'المعاملات',
    'connectedWallets': 'المحافظ المتصلة',
    'deposit': 'إيداع',
    'withdrawal': 'سحب',
    'swap': 'تبادل',
    'refresh': 'تحديث',
    'last24Hours': 'آخر 24 ساعة',
    'assetsCount': 'عدد الأصول',
    'volume24h': 'حجم التداول (24 ساعة)',
    'totalProfit': 'إجمالي الأرباح',
    'yourAssets': 'أصولك',
    'noAssetsFound': 'لم يتم العثور على أصول',
    'noAssetsDescription': 'لم يتم العثور على أصول في محفظتك. يمكنك إيداع أصول أو ربط محفظة خارجية.',
    'recentTransactions': 'المعاملات الأخيرة',
    'noTransactionsFound': 'لم يتم العثور على معاملات',
    'noTransactionsDescription': 'لم يتم العثور على معاملات في سجلك. قم بإجراء معاملة للبدء.',
    'makeTransaction': 'إجراء معاملة',
    'viewAll': 'عرض الكل',
    'walletAccessDenied': 'تم رفض الوصول إلى المحفظة',
    'pleaseLoginToAccessWallet': 'يرجى تسجيل الدخول للوصول إلى محفظتك',
    'price': 'السعر',
    'priceChart': 'مخطط السعر',
    'topAssets': 'أهم الأصول',
    'marketOverview': 'نظرة عامة على السوق',
    'portfolioChart': 'مخطط المحفظة',
    
    // ترجمات لصفحة تبادل العملات
    'swapTokens': 'تبادل العملات',
    'swapTokensDescription': 'تبادل العملات الرقمية بأسعار السوق',
    'from': 'من',
    'to': 'إلى',
    'selectToken': 'اختر العملة',
    'selectTokens': 'اختر العملات',
    'pleaseSelectBothTokens': 'يرجى اختيار العملات للتبادل',
    'invalidAmount': 'قيمة غير صحيحة',
    'pleaseEnterValidAmount': 'يرجى إدخال قيمة صحيحة للتبادل',
    'insufficientBalance': 'رصيد غير كافٍ',
    'youDontHaveEnoughBalance': 'ليس لديك رصيد كافٍ لإجراء هذا التبادل',
    'swapSuccessful': 'تم التبادل بنجاح',
    'swapFailed': 'فشل التبادل',
    'anErrorOccurredDuringSwap': 'حدث خطأ أثناء عملية التبادل',
    'balance': 'الرصيد',
    'exchangeRate': 'سعر الصرف',
    'priceImpact': 'تأثير السعر',
    'priceImpactDescription': 'تأثير معاملتك على سعر الصرف',
    'networkFee': 'رسوم الشبكة',
    'advancedSettings': 'إعدادات متقدمة',
    'adjustAdvancedSwapSettings': 'ضبط إعدادات التبادل المتقدمة',
    'slippageTolerance': 'تحمل الانزلاق',
    'minimumReceived': 'الحد الأدنى المستلم',
    'swapping': 'جاري التبادل',
    'swapButton': 'تبادل',
    'swapExactAmountFor': 'تبادل القيمة',
    'exchangeFor': 'مقابل',
    
    // دليل التبادل والتحذيرات
    'swapGuide': 'دليل التبادل',
    'swapGuideStep1': 'اختر العملة التي تريد استبدالها وأدخل المبلغ.',
    'swapGuideStep2': 'اختر العملة التي تريد الحصول عليها.',
    'swapGuideStep3': 'راجع تفاصيل الصرف والرسوم قبل المتابعة.',
    'swapGuideStep4': 'اضغط على زر "تبادل" لإتمام المعاملة.',
    'swapWarningTitle': 'تنبيه المخاطر',
    'swapWarningText': 'أسعار العملات الرقمية متقلبة. تأكد من فهم المخاطر قبل التبادل. قد تتغير الأسعار بسرعة مما يؤثر على قيمة المعاملة.',
    
    // تنبيهات الأسعار
    'createPriceAlert': 'إنشاء تنبيه سعر',
    'createPriceAlertDescription': 'إنشاء تنبيه عند وصول سعر العملة إلى قيمة محددة',
    'asset': 'الأصل',
    'selectAsset': 'اختر الأصل',
    'condition': 'الشرط',
    'selectCondition': 'اختر الشرط',
    'priceAbove': 'السعر أعلى من',
    'priceBelow': 'السعر أقل من',
    'targetPrice': 'السعر المستهدف',
    'createAlert': 'إنشاء تنبيه',
    'creatingAlert': 'جاري إنشاء التنبيه',
    'yourPriceAlerts': 'تنبيهات الأسعار الخاصة بك',
    'yourPriceAlertsDescription': 'إدارة تنبيهات أسعار العملات المشفرة الخاصة بك',
    'loadingAlerts': 'جاري تحميل التنبيهات',
    'noAlertsFound': 'لا توجد تنبيهات',
    'noAlertsFoundDescription': 'لم يتم العثور على أي تنبيهات. قم بإنشاء تنبيه جديد للبدء.',
    'activeAlerts': 'تنبيهات نشطة',
    'manageNotifications': 'إدارة الإشعارات',
    'alertCreatedSuccess': 'تم إنشاء التنبيه بنجاح',
    'alertCreatedDescription': 'سيتم إشعارك عندما يصل سعر العملة إلى القيمة المحددة',
    'alertCreationFailed': 'فشل إنشاء التنبيه',
    'alertCreationFailedDescription': 'حدث خطأ أثناء إنشاء التنبيه. يرجى المحاولة مرة أخرى.',
    'alertActivated': 'تم تفعيل التنبيه',
    'alertActivatedDescription': 'تم تفعيل التنبيه وستتلقى إشعارات عند تحقق الشرط',
    'alertDeactivated': 'تم إلغاء تفعيل التنبيه',
    'alertDeactivatedDescription': 'تم إلغاء تفعيل التنبيه ولن تتلقى إشعارات',
    'alertDeleted': 'تم حذف التنبيه',
    'alertDeletedDescription': 'تم حذف التنبيه بنجاح',
    'notifications': 'الإشعارات',
    'priceAlerts': 'تنبيهات الأسعار',
    
    // واجهة المحافظ المتصلة
    'web3ConnectWallet': 'ربط المحفظة',
    'web3ConnectYourWallet': 'قم بربط محفظة Web3 الخاصة بك للتفاعل مع البلوكتشين',
    'web3SelectWallet': 'اختر المحفظة',
    'web3SelectWalletDescription': 'اختر من محافظ Web3 المدعومة لإكمال الاتصال',
    'web3PopularWallets': 'المحافظ الشائعة',
    'web3AllWallets': 'جميع المحافظ',
    'web3ConnectingToWallet': 'جاري الاتصال بالمحفظة',
    'web3SecurityNote': 'نحن لا نخزن مفاتيحك الخاصة أو كلمات المرور أو العبارات السرية. تبقى بياناتك آمنة على جهازك.',
    'web3WalletConnectedSuccessfully': 'تم ربط المحفظة بنجاح',
    'web3YourWalletIsNowConnected': 'محفظتك متصلة الآن ويمكنك التفاعل مع التطبيق',
    'web3WalletConnectionFailed': 'فشل الاتصال بالمحفظة',
    'web3FailedToConnectWallet': 'تعذر الاتصال بالمحفظة. يرجى المحاولة مرة أخرى',
    'web3AddressCopied': 'تم نسخ العنوان',
    'web3WalletAddressCopiedToClipboard': 'تم نسخ عنوان محفظتك إلى الحافظة',
    'web3WalletDisconnected': 'تم فصل المحفظة',
    'web3WalletDisconnectedSuccessfully': 'تم فصل محفظتك بنجاح',
    'web3ConnectedWallets': 'المحافظ المتصلة',
    'web3ManageYourConnectedWallets': 'إدارة محافظ Web3 المتصلة الخاصة بك',
    'web3Explore': 'استكشاف',
    'web3Disconnect': 'فصل',
    'web3WalletsConnected': 'محافظ متصلة',
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
    'myWallet': 'My Wallet',
    'assets': 'Assets',
    'transactions': 'Transactions',
    'connectedWallets': 'Connected Wallets',
    'deposit': 'Deposit',
    'withdrawal': 'Withdrawal',
    'swap': 'Swap',
    'refresh': 'Refresh',
    'last24Hours': 'Last 24 hours',
    'assetsCount': 'Assets Count',
    'volume24h': 'Volume (24h)',
    'totalProfit': 'Total Profit',
    'yourAssets': 'Your Assets',
    'noAssetsFound': 'No Assets Found',
    'noAssetsDescription': 'No assets found in your wallet. You can deposit assets or connect an external wallet.',
    'recentTransactions': 'Recent Transactions',
    'noTransactionsFound': 'No Transactions Found',
    'noTransactionsDescription': 'No transactions found in your history. Make a transaction to get started.',
    'makeTransaction': 'Make Transaction',
    'viewAll': 'View All',
    'walletAccessDenied': 'Wallet Access Denied',
    'pleaseLoginToAccessWallet': 'Please login to access your wallet',
    'price': 'Price',
    'priceChart': 'Price Chart',
    'topAssets': 'Top Assets',
    'marketOverview': 'Market Overview',
    'portfolioChart': 'Portfolio Chart',
    
    // Token swap translations
    'swapTokens': 'Swap Tokens',
    'swapTokensDescription': 'Swap digital currencies at market rates',
    'from': 'From',
    'to': 'To',
    'selectToken': 'Select Token',
    'selectTokens': 'Select Tokens',
    'pleaseSelectBothTokens': 'Please select tokens for exchange',
    'invalidAmount': 'Invalid Amount',
    'pleaseEnterValidAmount': 'Please enter a valid amount to swap',
    'insufficientBalance': 'Insufficient Balance',
    'youDontHaveEnoughBalance': 'You don\'t have enough balance for this swap',
    'swapSuccessful': 'Swap Successful',
    'swapFailed': 'Swap Failed',
    'anErrorOccurredDuringSwap': 'An error occurred during swap',
    'balance': 'Balance',
    'exchangeRate': 'Exchange Rate',
    'priceImpact': 'Price Impact',
    'priceImpactDescription': 'The impact of your transaction on the exchange rate',
    'networkFee': 'Network Fee',
    'advancedSettings': 'Advanced Settings',
    'adjustAdvancedSwapSettings': 'Adjust advanced swap settings',
    'slippageTolerance': 'Slippage Tolerance',
    'minimumReceived': 'Minimum Received',
    'swapping': 'Swapping',
    'swapButton': 'Swap',
    'swapExactAmountFor': 'Swap exact amount',
    'exchangeFor': 'for',
    
    // Swap guide and warnings
    'swapGuide': 'Swap Guide',
    'swapGuideStep1': 'Select the currency you want to exchange and enter the amount.',
    'swapGuideStep2': 'Choose the currency you want to receive.',
    'swapGuideStep3': 'Review exchange details and fees before proceeding.',
    'swapGuideStep4': 'Click the "Swap" button to complete the transaction.',
    'swapWarningTitle': 'Risk Warning',
    'swapWarningText': 'Cryptocurrency prices are volatile. Make sure you understand the risks before exchanging. Prices can change rapidly, affecting the value of your transaction.',
    
    // Price alerts
    'createPriceAlert': 'Create Price Alert',
    'createPriceAlertDescription': 'Create an alert when a cryptocurrency reaches a specific price',
    'asset': 'Asset',
    'selectAsset': 'Select Asset',
    'condition': 'Condition',
    'selectCondition': 'Select Condition',
    'priceAbove': 'Price Above',
    'priceBelow': 'Price Below',
    'targetPrice': 'Target Price',
    'createAlert': 'Create Alert',
    'creatingAlert': 'Creating Alert',
    'yourPriceAlerts': 'Your Price Alerts',
    'yourPriceAlertsDescription': 'Manage your cryptocurrency price alerts',
    'loadingAlerts': 'Loading Alerts',
    'noAlertsFound': 'No Alerts Found',
    'noAlertsFoundDescription': 'No alerts found. Create a new alert to get started.',
    'activeAlerts': 'Active Alerts',
    'manageNotifications': 'Manage Notifications',
    'alertCreatedSuccess': 'Alert Created Successfully',
    'alertCreatedDescription': 'You will be notified when the price reaches your target',
    'alertCreationFailed': 'Alert Creation Failed',
    'alertCreationFailedDescription': 'An error occurred while creating the alert. Please try again.',
    'alertActivated': 'Alert Activated',
    'alertActivatedDescription': 'The alert has been activated and you will receive notifications',
    'alertDeactivated': 'Alert Deactivated',
    'alertDeactivatedDescription': 'The alert has been deactivated and you will not receive notifications',
    'alertDeleted': 'Alert Deleted',
    'alertDeletedDescription': 'The alert has been successfully deleted',
    'notifications': 'Notifications',
    'priceAlerts': 'Price Alerts',
    
    // Web3 wallet interface
    'connectWalletBtn': 'Connect Wallet',
    'connectYourWeb3Wallet': 'Connect your Web3 wallet to interact with the blockchain',
    'selectWallet': 'Select Wallet',
    'selectWalletDescription': 'Choose from supported Web3 wallets to complete the connection',
    'popularWallets': 'Popular Wallets',
    'allWallets': 'All Wallets',
    'connectingToWallet': 'Connecting to wallet',
    'web3SecurityNote': 'We do not store your private keys, passwords, or seed phrases. Your data remains secure on your device.',
    'walletConnectedSuccessfully': 'Wallet Connected Successfully',
    'yourWalletIsNowConnected': 'Your wallet is now connected and you can interact with the app',
    'walletConnectionFailed': 'Wallet Connection Failed',
    'failedToConnectWallet': 'Failed to connect wallet. Please try again',
    'addressCopied': 'Address Copied',
    'walletAddressCopiedToClipboard': 'Your wallet address has been copied to clipboard',
    'walletDisconnected': 'Wallet Disconnected',
    'walletDisconnectedSuccessfully': 'Your wallet has been disconnected successfully',
    'connectedWalletsList': 'Connected Wallets',
    'manageYourConnectedWallets': 'Manage your connected Web3 wallets',
    'explore': 'Explore',
    'disconnect': 'Disconnect',
    'walletsConnected': 'wallets connected',
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
    
    // Traductions d'authentification
    'login': 'Connexion',
    'register': 'Inscription',
    'loggingIn': 'Connexion en cours...',
    'registering': 'Inscription en cours...',
    'username': 'Nom d\'utilisateur',
    'email': 'Email',
    'password': 'Mot de passe',
    'confirmPassword': 'Confirmer le mot de passe',
    'usernamePlaceholder': 'Entrez votre nom d\'utilisateur',
    'emailPlaceholder': 'Entrez votre email',
    'passwordPlaceholder': 'Entrez votre mot de passe',
    'confirmPasswordPlaceholder': 'Confirmez votre mot de passe',
    'welcomeToRimToken': 'Bienvenue sur RimToken',
    'rimTokenDescription': 'Portefeuille de crypto-monnaies multi-chaînes avec échange intégré',
    'multiChainSupport': 'Support Multi-chaînes',
    'multiChainSupportDescription': 'Stockez et gérez vos crypto-monnaies sur différents réseaux blockchain',
    'secureStorage': 'Stockage Sécurisé',
    'secureStorageDescription': 'Contrôle total de vos clés privées avec sécurité avancée',
    'welcome': 'Bienvenue',
    'loginSuccessful': 'Connexion réussie',
    'loginFailed': 'Échec de la connexion',
    'registrationSuccessful': 'Compte créé avec succès',
    'registrationFailed': 'Échec de l\'inscription',
    'logoutSuccessful': 'Déconnexion réussie',
    'logoutFailed': 'Échec de la déconnexion',
    'seeSoonMessage': 'À bientôt!',
    'failedToFetchUser': 'Impossible de récupérer les données utilisateur',
    
    // Traductions du portefeuille
    'connectWalletHeader': 'Connecter un Portefeuille',
    'connectWalletDescription': 'Choisissez le portefeuille que vous souhaitez connecter à votre compte',
    'walletConnected': 'Portefeuille Connecté',
    'connectedTo': 'Connecté à',
    'walletAddress': 'Adresse du portefeuille',
    'connectionFailed': 'Échec de la connexion',
    'unknownError': 'Erreur inconnue',
    'connect': 'Connecter',
    'connecting': 'Connexion en cours...',
    'comingSoon': 'Bientôt Disponible',
    'walletSecurityNote': 'Note: RimToken ne stocke jamais vos clés privées. Vous gardez toujours le contrôle de vos fonds.',
    'connectWalletDialogDescription': 'Connectez votre portefeuille externe pour accéder à vos actifs numériques',
    'authRequired': 'Authentification Requise',
    'pleaseLoginFirst': 'Veuillez vous connecter d\'abord',
    'myWallet': 'Mon Portefeuille',
    'assets': 'Actifs',
    'transactions': 'Transactions',
    'connectedWallets': 'Portefeuilles Connectés',
    'deposit': 'Dépôt',
    'withdrawal': 'Retrait',
    'swap': 'Échange',
    'refresh': 'Actualiser',
    'last24Hours': 'Dernières 24 heures',
    'assetsCount': 'Nombre d\'actifs',
    'volume24h': 'Volume (24h)',
    'totalProfit': 'Profit Total',
    'yourAssets': 'Vos Actifs',
    'noAssetsFound': 'Aucun Actif Trouvé',
    'noAssetsDescription': 'Aucun actif trouvé dans votre portefeuille. Vous pouvez déposer des actifs ou connecter un portefeuille externe.',
    'recentTransactions': 'Transactions Récentes',
    'noTransactionsFound': 'Aucune Transaction Trouvée',
    'noTransactionsDescription': 'Aucune transaction trouvée dans votre historique. Effectuez une transaction pour commencer.',
    'makeTransaction': 'Effectuer une Transaction',
    'viewAll': 'Voir Tout',
    'walletAccessDenied': 'Accès au Portefeuille Refusé',
    'pleaseLoginToAccessWallet': 'Veuillez vous connecter pour accéder à votre portefeuille',
    'price': 'Prix',
    'priceChart': 'Graphique des Prix',
    'topAssets': 'Actifs Principaux',
    'marketOverview': 'Aperçu du Marché',
    'portfolioChart': 'Graphique du Portefeuille',
    
    // Traductions pour l'échange de jetons
    'swapTokens': 'Échanger des Jetons',
    'swapTokensDescription': 'Échangez des monnaies numériques aux taux du marché',
    'from': 'De',
    'to': 'À',
    'selectToken': 'Sélectionner un Jeton',
    'selectTokens': 'Sélectionner des Jetons',
    'pleaseSelectBothTokens': 'Veuillez sélectionner les jetons à échanger',
    'invalidAmount': 'Montant Invalide',
    'pleaseEnterValidAmount': 'Veuillez entrer un montant valide pour l\'échange',
    'insufficientBalance': 'Solde Insuffisant',
    'youDontHaveEnoughBalance': 'Vous n\'avez pas assez de solde pour cet échange',
    'swapSuccessful': 'Échange Réussi',
    'swapFailed': 'Échec de l\'Échange',
    'anErrorOccurredDuringSwap': 'Une erreur s\'est produite pendant l\'échange',
    'balance': 'Solde',
    'exchangeRate': 'Taux de Change',
    'priceImpact': 'Impact sur le Prix',
    'priceImpactDescription': 'L\'impact de votre transaction sur le taux de change',
    'networkFee': 'Frais de Réseau',
    'advancedSettings': 'Paramètres Avancés',
    'adjustAdvancedSwapSettings': 'Ajuster les paramètres avancés d\'échange',
    'slippageTolerance': 'Tolérance de Glissement',
    'minimumReceived': 'Minimum Reçu',
    'swapping': 'Échange en cours',
    'swapButton': 'Échanger',
    'swapExactAmountFor': 'Échanger',
    'exchangeFor': 'contre',
    
    // Guide d'échange et avertissements
    'swapGuide': 'Guide d\'Échange',
    'swapGuideStep1': 'Sélectionnez la monnaie que vous souhaitez échanger et entrez le montant.',
    'swapGuideStep2': 'Choisissez la monnaie que vous souhaitez recevoir.',
    'swapGuideStep3': 'Examinez les détails de l\'échange et les frais avant de continuer.',
    'swapGuideStep4': 'Cliquez sur le bouton "Échanger" pour finaliser la transaction.',
    'swapWarningTitle': 'Avertissement de Risque',
    'swapWarningText': 'Les prix des cryptomonnaies sont volatils. Assurez-vous de comprendre les risques avant d\'échanger. Les prix peuvent changer rapidement, affectant la valeur de votre transaction.',
    
    // Alertes de prix
    'createPriceAlert': 'Créer une Alerte de Prix',
    'createPriceAlertDescription': 'Créer une alerte lorsqu\'une cryptomonnaie atteint un prix spécifique',
    'asset': 'Actif',
    'selectAsset': 'Sélectionner un Actif',
    'condition': 'Condition',
    'selectCondition': 'Sélectionner une Condition',
    'priceAbove': 'Prix Au-dessus',
    'priceBelow': 'Prix En-dessous',
    'targetPrice': 'Prix Cible',
    'createAlert': 'Créer une Alerte',
    'creatingAlert': 'Création de l\'Alerte',
    'yourPriceAlerts': 'Vos Alertes de Prix',
    'yourPriceAlertsDescription': 'Gérer vos alertes de prix de cryptomonnaie',
    'loadingAlerts': 'Chargement des Alertes',
    'noAlertsFound': 'Aucune Alerte Trouvée',
    'noAlertsFoundDescription': 'Aucune alerte trouvée. Créez une nouvelle alerte pour commencer.',
    'activeAlerts': 'Alertes Actives',
    'manageNotifications': 'Gérer les Notifications',
    'alertCreatedSuccess': 'Alerte Créée avec Succès',
    'alertCreatedDescription': 'Vous serez notifié lorsque le prix atteindra votre cible',
    'alertCreationFailed': 'Échec de Création d\'Alerte',
    'alertCreationFailedDescription': 'Une erreur s\'est produite lors de la création de l\'alerte. Veuillez réessayer.',
    'alertActivated': 'Alerte Activée',
    'alertActivatedDescription': 'L\'alerte a été activée et vous recevrez des notifications',
    'alertDeactivated': 'Alerte Désactivée',
    'alertDeactivatedDescription': 'L\'alerte a été désactivée et vous ne recevrez pas de notifications',
    'alertDeleted': 'Alerte Supprimée',
    'alertDeletedDescription': 'L\'alerte a été supprimée avec succès',
    'notifications': 'Notifications',
    'priceAlerts': 'Alertes de Prix',
    
    // Interface portefeuille Web3
    'connectWalletBtn': 'Connecter le Portefeuille',
    'connectYourWeb3Wallet': 'Connectez votre portefeuille Web3 pour interagir avec la blockchain',
    'selectWallet': 'Sélectionner un Portefeuille',
    'selectWalletDescription': 'Choisissez parmi les portefeuilles Web3 pris en charge pour compléter la connexion',
    'popularWallets': 'Portefeuilles Populaires',
    'allWallets': 'Tous les Portefeuilles',
    'connectingToWallet': 'Connexion au portefeuille',
    'web3SecurityNote': 'Nous ne stockons pas vos clés privées, mots de passe ou phrases de récupération. Vos données restent sécurisées sur votre appareil.',
    'walletConnectedSuccessfully': 'Portefeuille Connecté avec Succès',
    'yourWalletIsNowConnected': 'Votre portefeuille est maintenant connecté et vous pouvez interagir avec l\'application',
    'walletConnectionFailed': 'Échec de Connexion du Portefeuille',
    'failedToConnectWallet': 'Impossible de connecter le portefeuille. Veuillez réessayer',
    'addressCopied': 'Adresse Copiée',
    'walletAddressCopiedToClipboard': 'L\'adresse de votre portefeuille a été copiée dans le presse-papiers',
    'walletDisconnected': 'Portefeuille Déconnecté',
    'walletDisconnectedSuccessfully': 'Votre portefeuille a été déconnecté avec succès',
    'manageYourConnectedWallets': 'Gérez vos portefeuilles Web3 connectés',
    'explore': 'Explorer',
    'disconnect': 'Déconnecter',
    'walletsConnected': 'portefeuilles connectés',
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