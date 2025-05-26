import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { useLocation } from "wouter";
import { 
  Wallet, 
  ArrowUpDown, 
  Download, 
  Upload,
  Smartphone,
  Shield,
  Zap,
  TrendingUp,
  Eye,
  EyeOff,
  Settings,
  Bell,
  ChevronRight,
  Apple,
  PlayCircle
} from "lucide-react";
import rimTokenLogo from "@assets/469063470_586302450756454_5997633519251771466_n.jpg";

export default function ModernWalletPage() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const [showBalance, setShowBalance] = useState(true);

  const walletAssets = [
    { symbol: "ETH", name: "Ethereum", balance: 2.5847, value: 8456.32, change: 2.4, icon: "🔷" },
    { symbol: "BTC", name: "Bitcoin", balance: 0.1234, value: 8234.56, change: -1.2, icon: "₿" },
    { symbol: "SOL", name: "Solana", balance: 125.45, value: 12345.67, change: 5.8, icon: "🌟" },
    { symbol: "BNB", name: "BNB", balance: 15.67, value: 6234.89, change: 3.2, icon: "🟡" },
  ];

  const totalBalance = walletAssets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      
      {/* Header Navigation */}
      <nav className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={rimTokenLogo} 
                alt="RimToken" 
                className="w-10 h-10 rounded-full border-2 border-cyan-400" 
              />
              <span className="text-xl font-bold text-cyan-400">RimToken</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <div className="relative group">
                <button className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                  {language === 'ar' ? 'المنتجات' : language === 'fr' ? 'Produits' : 'Products'}
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </button>
              </div>
              <div className="relative group">
                <button className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                  {language === 'ar' ? 'المطورون' : language === 'fr' ? 'Développeurs' : 'Developers'}
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </button>
              </div>
              <div className="relative group">
                <button className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                  {language === 'ar' ? 'حول' : language === 'fr' ? 'À propos' : 'About'}
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </button>
              </div>
              <button className="text-slate-300 hover:text-white transition-colors">
                {language === 'ar' ? 'المجتمع' : language === 'fr' ? 'Communauté' : 'Community'}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900"
              >
                🌐 EN
              </Button>
              <Button 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                onClick={() => setLocation("/register")}
              >
                <Download className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'تحميل التطبيق' : language === 'fr' ? 'Télécharger l\'app' : 'Download app'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Products/Services Section */}
      <div className="bg-slate-800/30 backdrop-blur-sm border-t border-slate-700/50">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Apps Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">
                {language === 'ar' ? 'التطبيقات' : language === 'fr' ? 'Applications' : 'Apps'}
              </h2>
              
              <div className="space-y-6">
                {/* Swap */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer"
                     onClick={() => setLocation("/swap")}>
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <ArrowUpDown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {language === 'ar' ? 'التبديل' : language === 'fr' ? 'Swap' : 'Swap'}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {language === 'ar' ? 'تبديل أي رموز بأفضل الأسعار' : 
                       language === 'fr' ? 'Échangez tous les tokens aux meilleurs taux' : 
                       'Swap any tokens at the best rates'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 ml-auto" />
                </div>

                {/* Wallet */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {language === 'ar' ? 'المحفظة' : language === 'fr' ? 'Portefeuille' : 'Wallet'}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {language === 'ar' ? 'الوصول إلى ويب3 من هاتفك' : 
                       language === 'fr' ? 'Accédez au Web3 depuis votre téléphone' : 
                       'Access Web3 with your phone'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 ml-auto" />
                </div>

                {/* Portfolio */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer"
                     onClick={() => setLocation("/portfolio-analytics")}>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {language === 'ar' ? 'المحفظة الاستثمارية' : language === 'fr' ? 'Portefeuille' : 'Portfolio'}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {language === 'ar' ? 'تتبع أداء أصولك' : 
                       language === 'fr' ? 'Suivez la performance de vos actifs' : 
                       'Track your assets\' performance'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 ml-auto" />
                </div>
              </div>
            </div>

            {/* Physical & Other Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">
                {language === 'ar' ? 'المنتجات الفيزيائية' : language === 'fr' ? 'Physique' : 'Physical'}
              </h2>
              
              <div className="space-y-6 mb-12">
                {/* Card */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-4 bg-white rounded-sm"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {language === 'ar' ? 'البطاقة' : language === 'fr' ? 'Carte' : 'Card'}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {language === 'ar' ? 'ادفع بالعملات المشفرة في أي مكان' : 
                       language === 'fr' ? 'Payez avec des crypto partout' : 
                       'Pay with crypto anywhere'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 ml-auto" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-8">
                {language === 'ar' ? 'أخرى' : language === 'fr' ? 'Autre' : 'Other'}
              </h2>
              
              <div className="space-y-6">
                {/* Fusion+ */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {language === 'ar' ? 'فيوجن+' : language === 'fr' ? 'Fusion+' : 'Fusion+'}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {language === 'ar' ? 'استمتع بتبديل سلس عبر السلاسل مع حماية MEV' : 
                       language === 'fr' ? 'Profitez de swaps cross-chain sans friction avec protection MEV' : 
                       'Enjoy gasless cross-chain swaps and MEV protection'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 ml-auto" />
                </div>

                {/* RimToken Security */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {language === 'ar' ? 'حماية ريم توكن' : language === 'fr' ? 'Protection RimToken' : 'RimToken Guard'}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {language === 'ar' ? 'ابق محمياً من هجمات الساندويتش' : 
                       language === 'fr' ? 'Restez protégé des attaques sandwich' : 
                       'Stay protected from sandwich attacks'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 ml-auto" />
                </div>
              </div>
            </div>
            {/* Additional Services Grid */}
            <div className="grid lg:grid-cols-2 gap-12 mt-16">
              
              {/* Developers Section */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-8">
                  {language === 'ar' ? 'المطورون' : language === 'fr' ? 'Développeurs' : 'Developers'}
                </h2>
                
                <div className="space-y-6">
                  {/* Developer Portal */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white rounded border-dashed"></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                        {language === 'ar' ? 'بوابة المطورين' : language === 'fr' ? 'Portail Développeur' : 'Developer Portal'}
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {language === 'ar' ? 'دمج أدوات ويب3 التي تناسب احتياجاتك' : 
                         language === 'fr' ? 'Intégrez les outils Web3 qui correspondent à vos besoins' : 
                         'Integrate Web3 tools that suit your needs'}
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-6 mt-12">
                  {language === 'ar' ? 'البروتوكولات' : language === 'fr' ? 'Protocoles' : 'Protocols'}
                </h3>
                
                <div className="space-y-6">
                  {/* Aggregation Protocol */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {language === 'ar' ? 'بروتوكول التجميع' : language === 'fr' ? 'Protocole d\'Agrégation' : 'Aggregation Protocol'}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {language === 'ar' ? 'البروتوكول يجمع السيولة من DEXs متعددة لضمان أفضل أسعار التبديل' : 
                         language === 'fr' ? 'Le protocole agrège la liquidité de plusieurs DEXs pour garantir les meilleurs taux de swap' : 
                         'The protocol aggregates liquidity from multiple DEXes to ensure the best swap rates'}
                      </p>
                    </div>
                  </div>

                  {/* Limit Order Protocol */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white rounded-sm"></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {language === 'ar' ? 'بروتوكول الأوامر المحدودة' : language === 'fr' ? 'Protocole d\'Ordre Limite' : 'Limit Order Protocol'}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {language === 'ar' ? 'الوظائف الأكثر ابتكاراً ومرونة للأوامر المحدودة في DeFi' : 
                         language === 'fr' ? 'La fonctionnalité d\'ordre limite la plus innovante et flexible en DeFi' : 
                         'The most innovative and flexible limit order functionality in DeFi'}
                      </p>
                    </div>
                  </div>

                  {/* Liquidity Protocol */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 bg-gradient-to-b from-green-400 to-emerald-500 rounded"></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {language === 'ar' ? 'بروتوكول السيولة' : language === 'fr' ? 'Protocole de Liquidité' : 'Liquidity Protocol'}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {language === 'ar' ? 'AMM من الجيل التالي يوفر كفاءة رؤوس الأموال لمقدمي السيولة' : 
                         language === 'fr' ? 'AMM de nouvelle génération offrant l\'efficacité du capital aux fournisseurs de liquidité' : 
                         'A next-generation AMM that offers capital efficiency to liquidity providers'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* About & Other Section */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-8">
                  {language === 'ar' ? 'حول' : language === 'fr' ? 'À propos' : 'About'}
                </h2>
                
                <div className="space-y-6">
                  {/* Security */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {language === 'ar' ? 'الأمان' : language === 'fr' ? 'Sécurité' : 'Security'}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {language === 'ar' ? 'دفاعك ضد الأنشطة غير المشروعة في DeFi' : 
                         language === 'fr' ? 'Votre défense contre les activités illicites en DeFi' : 
                         'Your defense against illicit activity in DeFi'}
                      </p>
                    </div>
                  </div>

                  {/* Partners & Stakeholders */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full mx-0.5"></div>
                        <div className="w-2 h-2 bg-white rounded-full mx-0.5"></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {language === 'ar' ? 'الشركاء وأصحاب المصلحة' : language === 'fr' ? 'Partenaires et Parties Prenantes' : 'Partners & Stakeholders'}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {language === 'ar' ? 'قائمة بالشركاء الرئيسيين وأصحاب المصلحة في شبكة ريم توكن' : 
                         language === 'fr' ? 'Une liste des principaux partenaires et parties prenantes du réseau RimToken' : 
                         'A list of the RimToken Network\'s major partners and stakeholders'}
                      </p>
                    </div>
                  </div>

                  {/* Foundation */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 bg-gradient-to-t from-indigo-400 to-purple-400 rounded-t-full"></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {language === 'ar' ? 'المؤسسة' : language === 'fr' ? 'Fondation' : 'Foundation'}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {language === 'ar' ? 'منظمة غير ربحية مخصصة لتعزيز شبكة ريم توكن' : 
                         language === 'fr' ? 'Une organisation à but non lucratif dédiée à la promotion du réseau RimToken' : 
                         'A non-profit organization dedicated to fostering the RimToken Network'}
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-6 mt-12">
                  {language === 'ar' ? 'أخرى' : language === 'fr' ? 'Autre' : 'Other'}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                      {language === 'ar' ? 'غرفة الصحافة' : language === 'fr' ? 'Salle de presse' : 'Press room'}
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                      {language === 'ar' ? 'جهات الاتصال' : language === 'fr' ? 'Contacts' : 'Contacts'}
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                      {language === 'ar' ? 'شروط الاستخدام' : language === 'fr' ? 'Conditions d\'utilisation' : 'Terms of use'}
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                      {language === 'ar' ? 'سياسة الخصوصية' : language === 'fr' ? 'Politique de confidentialité' : 'Privacy policy'}
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                      {language === 'ar' ? 'الورقة البيضاء للأمان' : language === 'fr' ? 'Livre blanc sur la sécurité' : 'Security White paper'}
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                      {language === 'ar' ? 'الرموز' : language === 'fr' ? 'Tokens' : 'Tokens'}
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 text-sm">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-300">
                  {language === 'ar' ? 'RimToken متاح الآن على سولانا!' : 
                   language === 'fr' ? 'RimToken est maintenant sur Solana!' : 
                   'RimToken is live on Solana!'}
                </span>
                <button className="text-cyan-400 hover:text-cyan-300">
                  {language === 'ar' ? 'اعرف المزيد' : language === 'fr' ? 'En savoir plus' : 'Learn more'}
                </button>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-cyan-400">RimToken</span>
                <br />
                <span className="text-white">
                  {language === 'ar' ? 'ويب3 في' : language === 'fr' ? 'Web3 dans' : 'Web3 in your'}
                </span>
                <br />
                <span className="text-white">
                  {language === 'ar' ? 'جيبك' : language === 'fr' ? 'votre poche' : 'pocket'}
                </span>
              </h1>

              <div className="space-y-2 text-xl text-slate-300">
                <p className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  {language === 'ar' ? 'سلس. آمن.' : language === 'fr' ? 'Fluide. Sécurisé.' : 'Smooth. Safe.'}
                </p>
                <p className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-cyan-400" />
                  {language === 'ar' ? 'محفظة ذاتية الحراسة.' : language === 'fr' ? 'Auto-garde.' : 'Self-custodial.'}
                </p>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-black hover:bg-gray-900 text-white flex items-center gap-3 px-6 py-4 rounded-xl"
              >
                <Apple className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">
                    {language === 'ar' ? 'تحميل من' : language === 'fr' ? 'Télécharger sur' : 'Download on the'}
                  </div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </Button>

              <Button 
                size="lg"
                className="bg-black hover:bg-gray-900 text-white flex items-center gap-3 px-6 py-4 rounded-xl"
              >
                <PlayCircle className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">
                    {language === 'ar' ? 'متوفر على' : language === 'fr' ? 'Disponible sur' : 'Get it on'}
                  </div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Right Side - Wallet Interface */}
          <div className="relative">
            {/* Mobile Phone Mockup */}
            <div className="relative mx-auto w-80 h-[600px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-[3rem] border-8 border-slate-700 shadow-2xl">
              
              {/* Phone Screen */}
              <div className="absolute inset-4 bg-gradient-to-b from-slate-900 to-blue-900 rounded-[2rem] overflow-hidden">
                
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 py-3 text-xs text-slate-400">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-2 bg-green-400 rounded-sm"></div>
                    <span>●●●</span>
                  </div>
                </div>

                {/* Wallet Header */}
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-6 h-6 text-cyan-400" />
                      <span className="text-lg font-semibold text-white">
                        {language === 'ar' ? 'محفظتي' : language === 'fr' ? 'Mon Portefeuille' : 'My Wallet'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setShowBalance(!showBalance)}>
                        {showBalance ? <Eye className="w-5 h-5 text-slate-400" /> : <EyeOff className="w-5 h-5 text-slate-400" />}
                      </button>
                      <Settings className="w-5 h-5 text-slate-400" />
                      <Bell className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>

                  {/* Balance Card */}
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 mb-6">
                    <div className="text-center">
                      <div className="text-sm text-cyan-100 mb-1">
                        {language === 'ar' ? 'إجمالي الرصيد' : language === 'fr' ? 'Solde Total' : 'Total Balance'}
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">
                        {showBalance ? `$${totalBalance.toLocaleString()}` : '••••••'}
                      </div>
                      <div className="flex items-center justify-center gap-1 text-sm text-green-200">
                        <TrendingUp className="w-4 h-4" />
                        <span>+2.4% (24h)</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <button className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center hover:bg-slate-700/50 transition-colors">
                      <Upload className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <span className="text-xs text-slate-300">
                        {language === 'ar' ? 'إيداع' : language === 'fr' ? 'Dépôt' : 'Deposit'}
                      </span>
                    </button>
                    
                    <button className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center hover:bg-slate-700/50 transition-colors">
                      <Download className="w-6 h-6 text-red-400 mx-auto mb-2" />
                      <span className="text-xs text-slate-300">
                        {language === 'ar' ? 'سحب' : language === 'fr' ? 'Retrait' : 'Withdraw'}
                      </span>
                    </button>
                    
                    <button className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center hover:bg-slate-700/50 transition-colors">
                      <ArrowUpDown className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                      <span className="text-xs text-slate-300">
                        {language === 'ar' ? 'تبديل' : language === 'fr' ? 'Échanger' : 'Swap'}
                      </span>
                    </button>
                  </div>

                  {/* Assets List */}
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-slate-300 mb-3">
                      {language === 'ar' ? 'الأصول' : language === 'fr' ? 'Actifs' : 'Assets'}
                    </div>
                    
                    {walletAssets.slice(0, 3).map((asset) => (
                      <div key={asset.symbol} className="flex items-center justify-between bg-slate-800/30 rounded-xl p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-lg">
                            {asset.icon}
                          </div>
                          <div>
                            <div className="font-medium text-white">{asset.symbol}</div>
                            <div className="text-xs text-slate-400">{asset.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-white">
                            {showBalance ? `$${asset.value.toLocaleString()}` : '••••'}
                          </div>
                          <div className={`text-xs ${asset.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {asset.change > 0 ? '+' : ''}{asset.change}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Seamless Cross-chain Swaps Badge */}
                  <div className="mt-6 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-xl p-4 text-center">
                    <div className="text-sm font-semibold text-purple-300 mb-1">
                      {language === 'ar' ? 'تبديل سلس عبر السلاسل' : 
                       language === 'fr' ? 'Swaps cross-chain transparents' : 
                       'Seamless cross-chain swaps'}
                    </div>
                    <div className="text-xs text-slate-400">
                      {language === 'ar' ? 'تبديل بين الشبكات بنقرة واحدة' : 
                       language === 'fr' ? 'Échangez entre réseaux en un clic' : 
                       'Swap across networks with one click'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-pulse opacity-80"></div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-bounce opacity-60"></div>
            </div>

            {/* Additional Floating Badges */}
            <div className="absolute top-20 -left-8 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-xl p-3 animate-float">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  ETH
                </div>
                <div className="text-sm text-white">Ethereum</div>
              </div>
            </div>

            <div className="absolute top-40 -right-12 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-xl p-3 animate-float" style={{animationDelay: '1s'}}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  SOL
                </div>
                <div className="text-sm text-white">Solana</div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}