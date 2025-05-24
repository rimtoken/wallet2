import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import rimLogo from "@assets/rim.png";

interface MainNavProps {
  currentPage?: string;
}

export function MainNav({ currentPage }: MainNavProps) {
  const navItems = [
    { href: "/", label: "الرئيسية" },
    { href: "/wallet", label: "المحفظة" },
    { href: "/deposit", label: "إيداع" },
    { href: "/swap", label: "تبديل" },
    { href: "/market", label: "السوق" },
    { href: "/news", label: "الأخبار" },
    { href: "/price", label: "الأسعار" },
    { href: "/team", label: "الفريق" },
    { href: "/about", label: "حول" },
  ];

  return (
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

        <div className="flex items-center space-x-2 space-x-reverse">
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
  );
}