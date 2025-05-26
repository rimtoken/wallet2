import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/language-context";
import { User, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert(language === 'ar' ? 'كلمات المرور غير متطابقة' : 
            language === 'fr' ? 'Les mots de passe ne correspondent pas' : 
            'Passwords do not match');
      return;
    }

    if (!formData.agreeTerms) {
      alert(language === 'ar' ? 'يجب الموافقة على الشروط والأحكام' : 
            language === 'fr' ? 'Vous devez accepter les termes et conditions' : 
            'You must agree to terms and conditions');
      return;
    }

    setIsLoading(true);
    
    // محاكاة إنشاء الحساب
    setTimeout(() => {
      setIsLoading(false);
      alert(language === 'ar' ? `مرحباً ${formData.username}! تم إنشاء حسابك بنجاح` : 
            language === 'fr' ? `Bienvenue ${formData.username}! Votre compte a été créé avec succès` : 
            `Welcome ${formData.username}! Your account has been created successfully`);
      
      // توجيه المستخدم للمحفظة
      setLocation("/wallet");
    }, 2000);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        
        {/* العودة للصفحة الرئيسية */}
        <Button 
          variant="outline" 
          onClick={() => setLocation("/")}
          className="mb-6"
        >
          ← {language === 'ar' ? 'العودة' : language === 'fr' ? 'Retour' : 'Back'}
        </Button>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          
          {/* قسم التسجيل */}
          <Card className="border-2 border-blue-200 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">
                {language === 'ar' ? 'إنشاء حساب جديد' : 
                 language === 'fr' ? 'Créer un nouveau compte' : 
                 'Create New Account'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* اسم المستخدم */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {language === 'ar' ? 'اسم المستخدم' : 
                     language === 'fr' ? 'Nom d\'utilisateur' : 
                     'Username'}
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل اسم المستخدم' : 
                               language === 'fr' ? 'Entrez le nom d\'utilisateur' : 
                               'Enter username'}
                    required
                    className="text-center"
                  />
                </div>

                {/* البريد الإلكتروني */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {language === 'ar' ? 'البريد الإلكتروني' : 
                     language === 'fr' ? 'Email' : 
                     'Email'}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل البريد الإلكتروني' : 
                               language === 'fr' ? 'Entrez l\'email' : 
                               'Enter email'}
                    required
                    className="text-center"
                  />
                </div>

                {/* كلمة المرور */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    {language === 'ar' ? 'كلمة المرور' : 
                     language === 'fr' ? 'Mot de passe' : 
                     'Password'}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 
                               language === 'fr' ? 'Entrez le mot de passe' : 
                               'Enter password'}
                    required
                    className="text-center"
                  />
                </div>

                {/* تأكيد كلمة المرور */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    {language === 'ar' ? 'تأكيد كلمة المرور' : 
                     language === 'fr' ? 'Confirmer le mot de passe' : 
                     'Confirm Password'}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder={language === 'ar' ? 'أعد إدخال كلمة المرور' : 
                               language === 'fr' ? 'Confirmez le mot de passe' : 
                               'Confirm password'}
                    required
                    className="text-center"
                  />
                </div>

                {/* الموافقة على الشروط */}
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeTerms', checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    {language === 'ar' ? 'أوافق على الشروط والأحكام' : 
                     language === 'fr' ? 'J\'accepte les termes et conditions' : 
                     'I agree to terms and conditions'}
                  </Label>
                </div>

                {/* زر التسجيل */}
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {language === 'ar' ? 'جاري إنشاء الحساب...' : 
                       language === 'fr' ? 'Création du compte...' : 
                       'Creating account...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {language === 'ar' ? 'إنشاء الحساب' : 
                       language === 'fr' ? 'Créer le compte' : 
                       'Create Account'}
                    </>
                  )}
                </Button>

                {/* رابط تسجيل الدخول */}
                <div className="text-center pt-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'ar' ? 'لديك حساب بالفعل؟ ' : 
                     language === 'fr' ? 'Vous avez déjà un compte? ' : 
                     'Already have an account? '}
                  </span>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-blue-600"
                    onClick={() => setLocation("/auth")}
                  >
                    {language === 'ar' ? 'تسجيل الدخول' : 
                     language === 'fr' ? 'Se connecter' : 
                     'Login'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* قسم المعلومات */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border-green-200">
              <CardHeader>
                <CardTitle className="text-xl text-green-600 dark:text-green-400">
                  {language === 'ar' ? 'ماذا ستجد بعد التسجيل؟' : 
                   language === 'fr' ? 'Que trouverez-vous après l\'inscription?' : 
                   'What will you find after registration?'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">
                      {language === 'ar' ? 'محفظة شخصية آمنة' : 
                       language === 'fr' ? 'Portefeuille personnel sécurisé' : 
                       'Secure Personal Wallet'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {language === 'ar' ? 'محفظة مشفرة لحفظ وإدارة عملاتك الرقمية' : 
                       language === 'fr' ? 'Portefeuille crypté pour stocker et gérer vos cryptomonnaies' : 
                       'Encrypted wallet to store and manage your cryptocurrencies'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">
                      {language === 'ar' ? 'أدوات تداول متقدمة' : 
                       language === 'fr' ? 'Outils de trading avancés' : 
                       'Advanced Trading Tools'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {language === 'ar' ? 'واجهة تداول احترافية مع أوامر معقدة وتحليلات' : 
                       language === 'fr' ? 'Interface de trading professionnelle avec ordres complexes et analyses' : 
                       'Professional trading interface with complex orders and analytics'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">
                      {language === 'ar' ? 'تنبيهات ذكية' : 
                       language === 'fr' ? 'Alertes intelligentes' : 
                       'Smart Alerts'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {language === 'ar' ? 'تنبيهات مخصصة للأسعار والفرص الاستثمارية' : 
                       language === 'fr' ? 'Alertes personnalisées pour les prix et opportunités d\'investissement' : 
                       'Custom alerts for prices and investment opportunities'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">
                      {language === 'ar' ? 'تحليلات المحفظة' : 
                       language === 'fr' ? 'Analyses de portefeuille' : 
                       'Portfolio Analytics'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {language === 'ar' ? 'تحليل شامل لأدائك مع توصيات ذكية' : 
                       language === 'fr' ? 'Analyse complète de votre performance avec recommandations intelligentes' : 
                       'Comprehensive performance analysis with smart recommendations'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 border-amber-200">
              <CardHeader>
                <CardTitle className="text-lg text-amber-600 dark:text-amber-400">
                  {language === 'ar' ? 'بعد التسجيل مباشرة' : 
                   language === 'fr' ? 'Immédiatement après l\'inscription' : 
                   'Immediately after registration'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                  <ArrowRight className="w-4 h-4" />
                  <span className="font-medium">
                    {language === 'ar' ? 'ستوجه لمحفظتك الشخصية حيث يمكنك البدء فوراً' : 
                     language === 'fr' ? 'Vous serez dirigé vers votre portefeuille personnel où vous pourrez commencer immédiatement' : 
                     'You will be directed to your personal wallet where you can start immediately'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}