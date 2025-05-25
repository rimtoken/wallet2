import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageToggle } from "@/components/language/language-toggle";
import { PriceTicker } from "@/components/crypto-ticker/price-ticker";
import rimLogo from "@assets/rim.png";

interface MainNavProps {
  currentPage?: string;
}

export function MainNav({ currentPage }: MainNavProps) {
  const navItems = [
    { href: "/", label: "الرئيسية" },
    { href: "/wallet", label: "المحفظة" },
    { href: "/deposit", label: "إيداع" },
    { href: "/withdrawal", label: "سحب" },
    { href: "/swap", label: "تبديل" },
    { href: "/advanced-dashboard", label: "لوحة المعلومات" },
    { href: "/market", label: "السوق" },
    { href: "/achievements", label: "الإنجازات" },
    { href: "/faq", label: "الأسئلة الشائعة" },
    { href: "/team", label: "الفريق" },
    { href: "/about", label: "حول" },
  ];

  return (
    <>
      {/* الشريط الرئيسي */}
      <header className="bg-white py-4 px-6 border-b shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <img 
                  src={rimLogo} 
                  alt="RimToken Logo" 
                  className="w-8 h-8 rounded-full object-cover border-2 border-amber-500" 
                />
                <span className="font-bold text-amber-700 ml-2">RimToken</span>
              </a>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6 space-x-reverse">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className={`text-gray-800 hover:text-gray-900 font-medium ${
                  currentPage === item.href ? "text-amber-600 font-semibold" : ""
                }`}>
                  {item.label}
                </a>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3 space-x-reverse">
            {/* أزرار تبديل اللغة والثيمات */}
            <div className="hidden md:flex items-center space-x-1 space-x-reverse mr-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
            
            {/* خط فاصل */}
            <div className="hidden md:block h-6 border-r border-gray-200 mx-2"></div>
            
            {/* أزرار تسجيل الدخول/التسجيل */}
            <Link href="/auth" className="text-gray-500 hover:text-gray-700 text-sm">
              تسجيل الدخول
            </Link>
            <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-md px-4 py-1">
              التسجيل
            </Button>
          </div>
          
          {/* زر القائمة للشاشات الصغيرة */}
          <button className="md:hidden text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </header>
      
      {/* شريط أسعار العملات المتحرك (أسفل الشريط العلوي) */}
      <PriceTicker />
    </>
  );
}