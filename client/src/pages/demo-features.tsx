import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  ArrowUp, 
  ArrowDown,
  Sun,
  Moon,
  Monitor,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// صفحة خاصة لعرض المميزات الجديدة بشكل واضح
export default function DemoFeaturesPage() {
  // حالة الثيم الحالية للعرض
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('light');
  
  // حالة اللغة الحالية للعرض
  const [currentLanguage, setCurrentLanguage] = useState<'ar' | 'en' | 'fr'>('ar');
  
  // بيانات وهمية لأسعار العملات
  const cryptoPrices = [
    { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 65789.32, priceChangePercentage24h: 2.45 },
    { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 3458.91, priceChangePercentage24h: 1.23 },
    { id: "binancecoin", symbol: "BNB", name: "Binance Coin", price: 567.89, priceChangePercentage24h: -0.78 },
    { id: "solana", symbol: "SOL", name: "Solana", price: 142.56, priceChangePercentage24h: 5.67 },
    { id: "ripple", symbol: "XRP", name: "XRP", price: 0.5678, priceChangePercentage24h: -1.45 },
    { id: "cardano", symbol: "ADA", name: "Cardano", price: 0.4123, priceChangePercentage24h: 0.89 },
    { id: "polkadot", symbol: "DOT", name: "Polkadot", price: 6.78, priceChangePercentage24h: 3.21 },
    { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", price: 0.1234, priceChangePercentage24h: -2.34 },
  ];

  // مؤثر تبديل السمة
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setCurrentTheme(theme);
  };

  // مؤثر تبديل اللغة
  const handleLanguageChange = (lang: 'ar' | 'en' | 'fr') => {
    setCurrentLanguage(lang);
  };

  // تنسيق العرض لأسماء اللغات
  const languageNames = {
    ar: 'العربية',
    en: 'English',
    fr: 'Français'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">استعراض المميزات الجديدة</h1>
        <p className="text-center text-gray-600 max-w-lg mx-auto">
          هنا يمكنك رؤية المميزات الجديدة التي تمت إضافتها للتطبيق بشكل واضح
        </p>
        <div className="flex justify-center mt-4">
          <Link href="/">
            <Button variant="outline">العودة للصفحة الرئيسية</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid gap-8">
        {/* عرض شريط الأسعار المتحرك */}
        <Card>
          <CardHeader>
            <CardTitle>شريط أسعار العملات المتحرك</CardTitle>
            <CardDescription>
              يعرض أسعار أهم العملات الرقمية بشكل متحرك أفقياً
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* تنفيذ مباشر لشريط العملات المتحرك */}
            <div className="bg-gray-900 text-white py-3 px-4 rounded-lg overflow-hidden">
              <div className="flex space-x-8 animate-marquee whitespace-nowrap">
                {cryptoPrices.map((crypto) => (
                  <span key={crypto.id} className="inline-block">
                    <span className="font-medium">{crypto.name}</span>
                    <span className="text-gray-400 mx-1">({crypto.symbol})</span>
                    <span className="font-bold">${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</span>
                    <span 
                      className={`ml-2 ${crypto.priceChangePercentage24h >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center inline-flex`}
                    >
                      {crypto.priceChangePercentage24h >= 0 ? (
                        <ArrowUp className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(crypto.priceChangePercentage24h).toFixed(2)}%
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* عرض أزرار تبديل السمة */}
        <Card>
          <CardHeader>
            <CardTitle>أزرار تبديل السمة (الثيم)</CardTitle>
            <CardDescription>
              تتيح للمستخدم اختيار السمة المفضلة لديه: فاتح، داكن، أو تلقائي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4 w-full">
                <div className="flex justify-center space-x-2">
                  <Button 
                    variant={currentTheme === 'light' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleThemeChange('light')}
                    className="flex items-center"
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    فاتح
                  </Button>
                  <Button 
                    variant={currentTheme === 'dark' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleThemeChange('dark')}
                    className="flex items-center"
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    داكن
                  </Button>
                  <Button 
                    variant={currentTheme === 'system' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleThemeChange('system')}
                    className="flex items-center"
                  >
                    <Monitor className="h-4 w-4 mr-2" />
                    تلقائي
                  </Button>
                </div>
              </div>
              <div className={`w-full p-6 rounded-lg transition-colors ${
                currentTheme === 'light' ? 'bg-white text-black' : 
                currentTheme === 'dark' ? 'bg-gray-900 text-white' : 
                'bg-gradient-to-r from-gray-100 to-gray-300 text-gray-800'
              }`}>
                <p className="text-center">
                  {currentTheme === 'light' && 'تم تفعيل السمة الفاتحة'}
                  {currentTheme === 'dark' && 'تم تفعيل السمة الداكنة'}
                  {currentTheme === 'system' && 'تم تفعيل السمة التلقائية حسب إعدادات النظام'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* عرض زر تبديل اللغة */}
        <Card>
          <CardHeader>
            <CardTitle>زر تبديل اللغة</CardTitle>
            <CardDescription>
              يتيح للمستخدم اختيار اللغة المفضلة: العربية، الإنجليزية، أو الفرنسية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4 w-full">
                <Tabs value={currentLanguage} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="ar" onClick={() => handleLanguageChange('ar')}>العربية</TabsTrigger>
                    <TabsTrigger value="en" onClick={() => handleLanguageChange('en')}>English</TabsTrigger>
                    <TabsTrigger value="fr" onClick={() => handleLanguageChange('fr')}>Français</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="flex items-center justify-center mb-4">
                  <Globe className="h-5 w-5 mr-2" />
                  <span className="font-medium">اللغة الحالية: {languageNames[currentLanguage]}</span>
                </div>
                <div className={`p-4 rounded border ${
                  currentLanguage === 'ar' ? 'border-amber-500' : 
                  currentLanguage === 'en' ? 'border-blue-500' : 
                  'border-red-500'
                }`}>
                  {currentLanguage === 'ar' && (
                    <p className="text-right">مرحبا بك في تطبيق ريم توكن! هذا مثال على النص باللغة العربية.</p>
                  )}
                  {currentLanguage === 'en' && (
                    <p className="text-left">Welcome to RimToken app! This is an example of English text.</p>
                  )}
                  {currentLanguage === 'fr' && (
                    <p className="text-left">Bienvenue dans l'application RimToken! Ceci est un exemple de texte en français.</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* زر للعودة للصفحة الرئيسية */}
      <div className="flex justify-center mt-8">
        <Link href="/">
          <Button>العودة للصفحة الرئيسية</Button>
        </Link>
      </div>
    </div>
  );
}