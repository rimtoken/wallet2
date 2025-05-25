import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  ArrowRightLeft, 
  Home, 
  LineChart, 
  LogIn,
  Users,
  Newspaper,
  Building2,
  PhoneCall
} from "lucide-react";
import rimLogo from "@assets/rim.png";
import rimTokenLogo from "@assets/469063470_586302450756454_5997633519251771466_n.jpg";
import { MainNav } from "@/components/navigation/main-nav";
import { useLanguage } from "@/contexts/language-context";

export default function MainSimplifiedPage() {
  const { translate, language } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* استخدام مكون التنقل الرئيسي الذي يحتوي على شريط الأسعار وأزرار تغيير اللغة والثيمات */}
      <MainNav currentPage="/" />
      
      {/* محتوى الصفحة الرئيسية */}
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <div className="flex flex-col items-center justify-center mb-6">
            <img src={rimTokenLogo} alt="RimToken" className="h-40 mb-4 rounded-full object-contain bg-white p-2 shadow-md" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {translate('app.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {translate('app.description')}
          </p>
        </div>
        
        {/* بطاقات الميزات */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
              <Wallet className="h-6 w-6 text-amber-700 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">{translate('features.wallet')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {translate('features.wallet.desc')}
            </p>
            <Button variant="outline" className="w-full dark:text-gray-200 dark:border-gray-600" asChild>
              <Link href="/wallet">
                {translate('features.wallet.cta')}
              </Link>
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <ArrowRightLeft className="h-6 w-6 text-blue-700 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">{translate('features.swap')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {translate('features.swap.desc')}
            </p>
            <Button variant="outline" className="w-full dark:text-gray-200 dark:border-gray-600" asChild>
              <Link href="/swap">
                {translate('features.swap.cta')}
              </Link>
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <LineChart className="h-6 w-6 text-green-700 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">{translate('features.market')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {translate('features.market.desc')}
            </p>
            <Button variant="outline" className="w-full dark:text-gray-200 dark:border-gray-600" disabled>
              {translate('features.market.cta')}
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-purple-700 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">{translate('features.team')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {translate('features.team.desc')}
            </p>
            <Button variant="outline" className="w-full dark:text-gray-200 dark:border-gray-600" asChild>
              <Link href="/team">
                {translate('features.team.cta')}
              </Link>
            </Button>
          </div>
        </div>

        {/* صف إضافي من البطاقات */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card-enhanced bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-4">
              <Newspaper className="h-6 w-6 text-yellow-700 dark:text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">{translate('nav.news')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {language === 'fr' 
                ? "Suivez les dernières actualités et mises à jour concernant RimToken et les cryptomonnaies"
                : language === 'en'
                ? "Follow the latest news and updates about RimToken platform and cryptocurrencies"
                : "تابع آخر الأخبار والتحديثات حول منصة ريم توكن والعملات الرقمية"
              }
            </p>
            <Button variant="outline" className="w-full dark:text-gray-200 dark:border-gray-600" asChild>
              <Link href="/news">
                {language === 'fr' ? "Lire les Actualités" : language === 'en' ? "Read News" : "قراءة الأخبار"}
              </Link>
            </Button>
          </div>
          
          <div className="card-enhanced bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-indigo-700 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">{translate('nav.about')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {language === 'fr' 
                ? "Découvrez l'histoire de RimToken, notre vision, notre mission et nos valeurs fondamentales"
                : language === 'en'
                ? "Learn about RimToken's story, our vision, mission and core values"
                : "تعرف على قصة RimToken ورؤيتنا ورسالتنا وقيمنا الأساسية"
              }
            </p>
            <Button variant="outline" className="w-full dark:text-gray-200 dark:border-gray-600" asChild>
              <Link href="/about">
                {language === 'fr' ? "En Savoir Plus" : language === 'en' ? "Learn More" : "المزيد عنا"}
              </Link>
            </Button>
          </div>
          
          <div className="card-enhanced bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-4">
              <PhoneCall className="h-6 w-6 text-teal-700 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">{translate('nav.contact')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {language === 'fr' 
                ? "Contactez notre équipe d'assistance pour répondre à vos questions et vous aider"
                : language === 'en'
                ? "Contact our support team to answer your inquiries and assist you"
                : "تواصل مع فريق الدعم للإجابة على استفساراتك ومساعدتك"
              }
            </p>
            <Button variant="outline" className="w-full dark:text-gray-200 dark:border-gray-600" asChild>
              <Link href="/contact">
                {language === 'fr' ? "Nous Contacter" : language === 'en' ? "Contact Us" : "تواصل معنا"}
              </Link>
            </Button>
          </div>
        </div>
        
        {/* قسم الدعوة للعمل */}
        <div className="bg-gradient-to-r from-amber-500/10 to-amber-700/10 dark:from-amber-600/5 dark:to-amber-800/5 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'fr' 
              ? "Commencez votre aventure avec RimToken aujourd'hui" 
              : language === 'en' 
              ? "Start your journey with RimToken today" 
              : "ابدأ رحلتك مع RimToken اليوم"}
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-xl mx-auto">
            {language === 'fr' 
              ? "Rejoignez des milliers d'utilisateurs qui gèrent leurs actifs numériques avec facilité et sécurité" 
              : language === 'en' 
              ? "Join thousands of users who manage their digital assets with ease and security" 
              : "انضم إلى الآلاف من المستخدمين الذين يديرون أصولهم الرقمية بسهولة وأمان"}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white dark:text-gray-900 text-lg px-6 py-2" asChild>
              <Link href="/wallet">
                {language === 'fr' ? "Commencer" : language === 'en' ? "Get Started" : "بدء الاستخدام"}
              </Link>
            </Button>
            <Button variant="outline" className="text-lg px-6 py-2 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700" asChild>
              <Link href="/swap">
                {language === 'fr' ? "Essayer l'échange" : language === 'en' ? "Try Swapping" : "تجربة التبادل"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* تذييل الصفحة */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <img src={rimLogo} alt="RimToken Logo" className="w-10 h-10 mr-2 rounded-full object-cover" />
                <h2 className="text-xl font-bold text-white">RimToken</h2>
              </div>
              <p className="text-gray-400 mt-2">
                {language === 'fr' 
                  ? "Portefeuille et échange de cryptomonnaies en toute simplicité" 
                  : language === 'en' 
                  ? "Cryptocurrency wallet and exchange made simple" 
                  : "محفظة وتبادل العملات المشفرة ببساطة"}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">{translate('footer.quickLinks')}</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                      {translate('nav.home')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/wallet" className="text-gray-400 hover:text-white transition-colors">
                      {translate('nav.wallet')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/swap" className="text-gray-400 hover:text-white transition-colors">
                      {translate('nav.swap')}
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">{translate('footer.contact')}</h3>
                <ul className="space-y-2">
                  <li className="text-gray-400">support@rimtoken.com</li>
                  <li className="text-gray-400">+1 234 567 890</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            {/* أيقونة تطبيق أسفل الصفحة */}
            <div className="flex justify-center mb-6">
              <a href="#" className="block mx-2">
                <img 
                  src="/android-app-badge.png" 
                  alt="Get RimToken Android App" 
                  className="h-12"
                  onError={(e) => {
                    // إذا فشل تحميل الصورة، نعرض بديلاً
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgNjAiIGZpbGw9Im5vbmUiPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iNjAiIHJ4PSI4IiBmaWxsPSIjMzNkMjZhIi8+PHBhdGggZD0iTTUwLjUgMzBsMTAtMTdoLTZsLTYuNSAxMS4ybC02LjYtMTEuMmgtNmwxMCAxNy0xMCAxN2g2bDYuNi0xMS4yIDYuNSAxMS4yaDZsLTEwLTE3eiIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjgwIiB5PSIzMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZmZiIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+R2V0IGl0IG9uPC90ZXh0Pjx0ZXh0IHg9IjgwIiB5PSI0OCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZmZiIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+QW5kcm9pZDwvdGV4dD48L3N2Zz4=';
                  }}
                />
              </a>
            </div>
            
            <p className="text-gray-500">
              &copy; {new Date().getFullYear()} RimToken - {translate('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}