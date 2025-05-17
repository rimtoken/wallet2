import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { FloatingActionMenu } from "@/components/ui/floating-action-menu";
import {
  Home,
  Wallet,
  BarChart3,
  ArrowUpDown,
  Settings,
  User,
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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* الشريط العلوي */}
      <header className="bg-white dark:bg-gray-800 border-b h-16 flex items-center px-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                  R
                </div>
                <span className="ml-2 text-xl font-bold">RimToken</span>
              </a>
            </Link>
          </div>
          <div className="flex items-center">
            {/* يمكن إضافة عناصر إضافية هنا مثل إشعارات أو رسائل أو بحث */}
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 container mx-auto py-4">
        {children}
      </main>

      {/* القائمة السفلية للهاتف المحمول */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t z-10">
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
      <div className="hidden lg:block fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-800 border-l pt-16">
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