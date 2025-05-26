import React from "react";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/language-context";
import { User, Wallet, TrendingUp, Shield } from "lucide-react";

export default function DemoLoginPage() {
  const { getText, language } = useLanguage();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = async () => {
    setIsLoading(true);
    // محاكاة تسجيل الدخول
    setTimeout(() => {
      setIsLoading(false);
      // توجيه المستخدم للمحفظة مباشرة
      setLocation("/wallet");
    }, 1500);
  };

  const handleQuickAccess = (page: string) => {
    setLocation(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        
        {/* العودة للصفحة الرئيسية */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            ← {language === 'ar' ? 'العودة للصفحة الرئيسية' : language === 'fr' ? 'Retour à l\'accueil' : 'Back to Home'}
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {language === 'ar' ? 'مرحباً بك في RimToken' : language === 'fr' ? 'Bienvenue sur RimToken' : 'Welcome to RimToken'}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {language === 'ar' ? 'جرب منصة التداول الأكثر تقدماً' : language === 'fr' ? 'Essayez la plateforme de trading la plus avancée' : 'Try the most advanced trading platform'}
            </p>
          </div>

          {/* خيارات الوصول السريع */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            
            {/* تجربة سريعة */}
            <Card className="border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">
                  {language === 'ar' ? 'تجربة سريعة' : language === 'fr' ? 'Essai Rapide' : 'Quick Demo'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-gray-600 dark:text-gray-300">
                  {language === 'ar' ? 
                    'ادخل للتطبيق مباشرة واستكشف جميع المميزات بدون تسجيل' : 
                    language === 'fr' ? 
                    'Accédez directement à l\'application et explorez toutes les fonctionnalités sans inscription' :
                    'Access the app directly and explore all features without registration'
                  }
                </p>
                
                <Button 
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {language === 'ar' ? 'جاري التحضير...' : language === 'fr' ? 'Préparation...' : 'Preparing...'}
                    </>
                  ) : (
                    <>
                      <User className="w-5 h-5 mr-2" />
                      {language === 'ar' ? 'دخول تجريبي' : language === 'fr' ? 'Accès Démo' : 'Demo Access'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* وصول مخصص */}
            <Card className="border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                  {language === 'ar' ? 'حساب شخصي' : language === 'fr' ? 'Compte Personnel' : 'Personal Account'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-gray-600 dark:text-gray-300">
                  {language === 'ar' ? 
                    'سجل حساب جديد أو ادخل بحسابك الموجود للحصول على تجربة كاملة' : 
                    language === 'fr' ? 
                    'Créez un nouveau compte ou connectez-vous avec votre compte existant pour une expérience complète' :
                    'Create a new account or login with your existing account for full experience'
                  }
                </p>
                
                <div className="space-y-3">
                  <Input 
                    placeholder={language === 'ar' ? 'اسم المستخدم' : language === 'fr' ? 'Nom d\'utilisateur' : 'Username'} 
                    className="text-center"
                  />
                  <Input 
                    type="password"
                    placeholder={language === 'ar' ? 'كلمة المرور' : language === 'fr' ? 'Mot de passe' : 'Password'} 
                    className="text-center"
                  />
                  <Button variant="outline" className="w-full">
                    {language === 'ar' ? 'تسجيل الدخول' : language === 'fr' ? 'Se connecter' : 'Login'}
                  </Button>
                  <Button variant="ghost" className="w-full text-green-600">
                    {language === 'ar' ? 'إنشاء حساب جديد' : language === 'fr' ? 'Créer un nouveau compte' : 'Create New Account'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* وصول سريع للميزات */}
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 border-amber-200 dark:border-gray-600">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-amber-700 dark:text-amber-400">
                {language === 'ar' ? 'أو استكشف الميزات مباشرة' : language === 'fr' ? 'Ou explorez les fonctionnalités directement' : 'Or explore features directly'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-4 h-auto hover:bg-amber-50 dark:hover:bg-gray-600"
                  onClick={() => handleQuickAccess("/wallet")}
                >
                  <Wallet className="w-6 h-6 mb-2 text-amber-600" />
                  <span className="text-sm">{language === 'ar' ? 'المحفظة' : language === 'fr' ? 'Portefeuille' : 'Wallet'}</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-4 h-auto hover:bg-amber-50 dark:hover:bg-gray-600"
                  onClick={() => handleQuickAccess("/swap")}
                >
                  <TrendingUp className="w-6 h-6 mb-2 text-amber-600" />
                  <span className="text-sm">{language === 'ar' ? 'التبادل' : language === 'fr' ? 'Échange' : 'Swap'}</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-4 h-auto hover:bg-amber-50 dark:hover:bg-gray-600"
                  onClick={() => handleQuickAccess("/advanced-trading")}
                >
                  <TrendingUp className="w-6 h-6 mb-2 text-amber-600" />
                  <span className="text-sm">{language === 'ar' ? 'التداول المتقدم' : language === 'fr' ? 'Trading Avancé' : 'Advanced Trading'}</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-4 h-auto hover:bg-amber-50 dark:hover:bg-gray-600"
                  onClick={() => handleQuickAccess("/portfolio-analytics")}
                >
                  <TrendingUp className="w-6 h-6 mb-2 text-amber-600" />
                  <span className="text-sm">{language === 'ar' ? 'التحليلات' : language === 'fr' ? 'Analyses' : 'Analytics'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}