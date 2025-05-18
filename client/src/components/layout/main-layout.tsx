import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { FloatingActionMenu } from "@/components/ui/floating-action-menu";
import { Header } from "@/components/layout/header";
import { Logo } from "@/components/ui/logo";
import {
  Home,
  Wallet,
  BarChart3,
  ArrowUpDown,
  Settings,
  User,
  Coins,
  Shield,
  LineChart,
  LucideIcon
} from "lucide-react";

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  end?: boolean;
}

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();

  const navItems: NavItem[] = [
    { icon: Home, label: "الرئيسية", href: "/", end: true },
    { icon: Wallet, label: "المحفظة", href: "/wallet" },
    { icon: ArrowUpDown, label: "تبادل", href: "/swap" },
    { icon: BarChart3, label: "السوق", href: "/markets" },
    { icon: Settings, label: "الإعدادات", href: "/settings" },
    { icon: User, label: "الملف الشخصي", href: "/profile" }
  ];

  const isActive = (path: string, end = false) => {
    if (end) {
      return location === path;
    }
    return location.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* الشريط العلوي */}
      <Header className="sticky top-0" />

      {/* الغلاف العلوي مع الشعار */}
      {location === "/" && (
        <div className="bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 py-12 text-center relative overflow-hidden">
          {/* زخارف الخلفية */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-amber-300"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-amber-400"></div>
            <div className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full bg-blue-300"></div>
            <div className="absolute bottom-1/4 left-1/4 w-20 h-20 rounded-full bg-blue-400"></div>
            <div className="hidden md:block absolute top-20 right-1/3 w-16 h-16 rounded-full bg-amber-500"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="bg-white/60 backdrop-blur-sm py-8 px-4 rounded-2xl shadow-lg max-w-3xl mx-auto">
              <div className="flex flex-col items-center justify-center">
                <div className="w-28 h-28 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-lg mb-4">
                  <span className="text-white text-5xl font-bold">R</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-amber-800 mb-3 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">RIM TOKEN</h1>
              <p className="text-lg text-amber-700 max-w-xl mx-auto mb-4">
                محفظة العملات المشفرة الأكثر بساطة وأمانًا للتخزين والتبادل
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <Link href="/wallet">
                  <a className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-2 px-6 rounded-full shadow-md transition-all font-medium">
                    ابدأ الآن
                  </a>
                </Link>
                <Link href="/swap">
                  <a className="bg-white text-amber-700 border border-amber-500 py-2 px-6 rounded-full shadow-md hover:bg-amber-50 transition-all font-medium">
                    استكشف الميزات
                  </a>
                </Link>
              </div>
              
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 p-4 rounded-lg shadow">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                    <Shield className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-medium text-amber-800 mb-2">محفظة آمنة</h3>
                  <p className="text-sm text-gray-600">تخزين العملات المشفرة بأمان تام مع تحكم كامل في مفاتيحك الخاصة</p>
                </div>
                
                <div className="bg-white/80 p-4 rounded-lg shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                    <ArrowUpDown className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-amber-800 mb-2">تبادل سريع</h3>
                  <p className="text-sm text-gray-600">تبادل العملات المشفرة بسهولة وسرعة مع أقل رسوم ممكنة</p>
                </div>
                
                <div className="bg-white/80 p-4 rounded-lg shadow">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                    <LineChart className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-amber-800 mb-2">تحليلات متقدمة</h3>
                  <p className="text-sm text-gray-600">متابعة أداء محفظتك وتحليل بيانات السوق في الوقت الحقيقي</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* المحتوى الرئيسي */}
      <main className="flex-1 container mx-auto py-6">
        {children}
      </main>

      {/* القائمة السفلية للهاتف المحمول */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-10">
        <div className="grid grid-cols-5 h-16">
          {navItems.slice(0, 5).map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex flex-col items-center justify-center h-full",
                  isActive(item.href, item.end)
                    ? "text-primary"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                <item.icon size={20} />
                <span className="text-xs mt-1">{item.label}</span>
              </a>
            </Link>
          ))}
        </div>
      </nav>

      {/* الشريط الجانبي للشاشات الكبيرة */}
      <div className="hidden lg:block fixed inset-y-0 right-0 w-64 bg-background border-l pt-16">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6">القائمة</h2>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <a
                    className={cn(
                      "flex items-center p-2 rounded-lg",
                      isActive(item.href, item.end)
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    <item.icon size={20} className="mr-3" />
                    <span>{item.label}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* قائمة الإجراءات السريعة العائمة */}
      <FloatingActionMenu position="bottom-right" />
    </div>
  );
}