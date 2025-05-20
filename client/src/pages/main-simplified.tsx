import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  ArrowRightLeft, 
  Home, 
  LineChart, 
  LogIn 
} from "lucide-react";

// صفحة رئيسية مبسطة لتسهيل التنقل بين صفحات التطبيق
export default function MainSimplifiedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* رأس الصفحة */}
      <header className="bg-white border-b shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-2">
              <span className="text-amber-700 font-bold">R</span>
            </div>
            <h1 className="text-xl font-bold text-amber-700">RimToken</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth">
                <LogIn className="h-4 w-4 mr-1" /> تسجيل الدخول
              </Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* محتوى الصفحة الرئيسية */}
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">محفظة وتبادل RimToken</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            محفظة لامركزية متعددة السلاسل تتيح لك التحكم الكامل في أصولك الرقمية
            مع واجهة مستخدم سهلة وبسيطة
          </p>
        </div>
        
        {/* بطاقات الميزات */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <Wallet className="h-6 w-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-bold mb-2">إدارة المحفظة</h3>
            <p className="text-gray-600 mb-4">
              إدارة أصولك الرقمية بسهولة تامة مع واجهة مستخدم سلسة وآمنة
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/wallet">
                استكشاف المحفظة
              </Link>
            </Button>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <ArrowRightLeft className="h-6 w-6 text-blue-700" />
            </div>
            <h3 className="text-xl font-bold mb-2">تبادل العملات</h3>
            <p className="text-gray-600 mb-4">
              تبادل العملات المشفرة بسرعة وبدون تعقيدات مع رسوم منخفضة
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/swap">
                بدء التبادل
              </Link>
            </Button>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <LineChart className="h-6 w-6 text-green-700" />
            </div>
            <h3 className="text-xl font-bold mb-2">تتبع الأسواق</h3>
            <p className="text-gray-600 mb-4">
              متابعة أسعار العملات واتجاهات السوق في الوقت الحقيقي
            </p>
            <Button variant="outline" className="w-full" disabled>
              قريباً
            </Button>
          </div>
        </div>
        
        {/* قسم الدعوة للعمل */}
        <div className="bg-gradient-to-r from-amber-500/10 to-amber-700/10 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">ابدأ رحلتك مع RimToken اليوم</h3>
          <p className="text-lg text-gray-700 mb-6 max-w-xl mx-auto">
            انضم إلى الآلاف من المستخدمين الذين يديرون أصولهم الرقمية بسهولة وأمان
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-amber-500 hover:bg-amber-600 text-lg px-6 py-2" asChild>
              <Link href="/wallet">
                بدء الاستخدام
              </Link>
            </Button>
            <Button variant="outline" className="text-lg px-6 py-2" asChild>
              <Link href="/swap">
                تجربة التبادل
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* تذييل الصفحة */}
      <footer className="bg-gray-900 text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                  <span className="text-amber-700 font-bold">R</span>
                </div>
                <h2 className="text-xl font-bold text-white">RimToken</h2>
              </div>
              <p className="text-gray-400 mt-2">
                محفظة وتبادل العملات المشفرة ببساطة
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                      الصفحة الرئيسية
                    </Link>
                  </li>
                  <li>
                    <Link href="/wallet" className="text-gray-400 hover:text-white transition-colors">
                      المحفظة
                    </Link>
                  </li>
                  <li>
                    <Link href="/swap" className="text-gray-400 hover:text-white transition-colors">
                      تبادل العملات
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
                <ul className="space-y-2">
                  <li className="text-gray-400">support@rimtoken.com</li>
                  <li className="text-gray-400">+1 234 567 890</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500">
              &copy; {new Date().getFullYear()} RimToken - جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}