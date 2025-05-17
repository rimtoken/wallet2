import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import {
  Plus,
  ArrowUpDown,
  Wallet,
  BarChart3,
  ArrowDownToLine,
  ArrowUpFromLine,
  X,
  LucideIcon,
  Home,
  History,
  Settings,
  User,
  RefreshCw,
  Star
} from "lucide-react";

interface FloatingActionMenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  color?: string;
}

interface FloatingActionMenuProps {
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export function FloatingActionMenu({
  className,
  position = "bottom-right"
}: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".floating-action-menu")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  // إغلاق القائمة عند تغيير الصفحة
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // تعريف الإجراءات السريعة حسب الصفحة الحالية
  const getContextualActions = (): FloatingActionMenuItem[] => {
    // الإجراءات المشتركة المتاحة في جميع الصفحات
    const commonActions: FloatingActionMenuItem[] = [
      {
        icon: ArrowUpDown,
        label: "تبادل العملات",
        href: "/swap",
        color: "bg-blue-500 hover:bg-blue-600"
      },
      {
        icon: Wallet,
        label: "المحفظة",
        href: "/wallet",
        color: "bg-purple-500 hover:bg-purple-600"
      }
    ];

    // إجراءات محددة حسب الصفحة
    if (location === "/") {
      // صفحة لوحة التحكم
      return [
        ...commonActions,
        {
          icon: RefreshCw,
          label: "تحديث البيانات",
          href: "#refresh",
          color: "bg-emerald-500 hover:bg-emerald-600"
        },
        {
          icon: History,
          label: "المعاملات",
          href: "/transactions",
          color: "bg-orange-500 hover:bg-orange-600"
        }
      ];
    } else if (location.startsWith("/wallet")) {
      // صفحة المحفظة
      return [
        {
          icon: ArrowDownToLine,
          label: "إيداع",
          href: "/wallet?tab=deposit",
          color: "bg-green-500 hover:bg-green-600"
        },
        {
          icon: ArrowUpFromLine,
          label: "سحب",
          href: "/wallet?tab=withdraw",
          color: "bg-amber-500 hover:bg-amber-600"
        },
        {
          icon: ArrowUpDown,
          label: "تبادل العملات",
          href: "/swap",
          color: "bg-blue-500 hover:bg-blue-600"
        },
        {
          icon: History,
          label: "المعاملات",
          href: "/transactions",
          color: "bg-gray-500 hover:bg-gray-600"
        }
      ];
    } else if (location.startsWith("/swap")) {
      // صفحة التبادل
      return [
        {
          icon: BarChart3,
          label: "السوق",
          href: "/markets",
          color: "bg-indigo-500 hover:bg-indigo-600"
        },
        {
          icon: Wallet,
          label: "المحفظة",
          href: "/wallet",
          color: "bg-purple-500 hover:bg-purple-600"
        },
        {
          icon: History,
          label: "المعاملات",
          href: "/transactions",
          color: "bg-gray-500 hover:bg-gray-600"
        }
      ];
    } else if (location.startsWith("/markets")) {
      // صفحة السوق
      return [
        {
          icon: ArrowUpDown,
          label: "تبادل العملات",
          href: "/swap",
          color: "bg-blue-500 hover:bg-blue-600"
        },
        {
          icon: Star,
          label: "المفضلة",
          href: "#favorites",
          color: "bg-yellow-500 hover:bg-yellow-600"
        },
        {
          icon: RefreshCw,
          label: "تحديث الأسعار",
          href: "#refresh-market",
          color: "bg-emerald-500 hover:bg-emerald-600"
        }
      ];
    } else if (location.startsWith("/transactions")) {
      // صفحة المعاملات
      return [
        {
          icon: ArrowUpDown,
          label: "تبادل جديد",
          href: "/swap",
          color: "bg-blue-500 hover:bg-blue-600"
        },
        {
          icon: Wallet,
          label: "المحفظة",
          href: "/wallet",
          color: "bg-purple-500 hover:bg-purple-600"
        }
      ];
    } else {
      // أي صفحة أخرى
      return [
        {
          icon: Home,
          label: "الرئيسية",
          href: "/",
          color: "bg-pink-500 hover:bg-pink-600"
        },
        ...commonActions,
        {
          icon: BarChart3,
          label: "السوق",
          href: "/markets",
          color: "bg-indigo-500 hover:bg-indigo-600"
        }
      ];
    }
  };

  const contextualActions = getContextualActions();

  // تحديد موضع القائمة استنادًا إلى الخيار المحدد
  const positionClasses = {
    "bottom-right": "bottom-20 right-6 lg:bottom-6", // إضافة تباعد للشاشات الصغيرة لتفادي شريط التنقل السفلي
    "bottom-left": "bottom-20 left-6 lg:bottom-6",
    "top-right": "top-20 right-6",
    "top-left": "top-20 left-6"
  };

  // حساب موضع العناصر المنبثقة
  const getItemPosition = (index: number) => {
    if (position.includes("bottom")) {
      return { bottom: `${(index + 1) * 70}px` };
    } else {
      return { top: `${(index + 1) * 70}px` };
    }
  };

  // حساب اتجاه فتح القائمة
  const getAnimationDirection = () => {
    if (position.includes("bottom")) {
      return { y: 20 };
    } else {
      return { y: -20 };
    }
  };

  // توليد لون متدرج للزر الرئيسي بناءً على الصفحة الحالية
  const getMainButtonStyle = () => {
    if (isOpen) {
      return "bg-red-500 hover:bg-red-600";
    }

    // تحديد لون مخصص للزر حسب الصفحة الحالية
    if (location === "/") {
      return "bg-gradient-to-tr from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700";
    } else if (location.startsWith("/wallet")) {
      return "bg-gradient-to-tr from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700";
    } else if (location.startsWith("/swap")) {
      return "bg-gradient-to-tr from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700";
    } else if (location.startsWith("/markets")) {
      return "bg-gradient-to-tr from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700";
    } else {
      return "bg-primary hover:bg-primary/90";
    }
  };

  return (
    <div
      className={cn(
        "fixed z-50 floating-action-menu",
        positionClasses[position],
        className
      )}
    >
      {/* زر القائمة الرئيسي */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 rounded-full shadow-lg text-white",
            getMainButtonStyle()
          )}
          aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
        >
          {isOpen ? <X size={24} /> : <Plus size={24} />}
        </Button>
      </motion.div>

      {/* عناصر القائمة المنبثقة */}
      <AnimatePresence>
        {isOpen &&
          contextualActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, ...getAnimationDirection() }}
              animate={{
                opacity: 1,
                ...(position.includes("right")
                  ? { right: 0 }
                  : { left: 0 }),
                ...getItemPosition(index)
              }}
              exit={{ opacity: 0, ...getAnimationDirection() }}
              transition={{ delay: index * 0.05 }}
              className="absolute z-40"
            >
              <div className="flex items-center">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-3 py-2 mr-2 text-sm font-medium">
                  {action.label}
                </div>
                <Link href={action.href}>
                  <Button
                    className={cn(
                      "w-12 h-12 rounded-full shadow-md text-white",
                      action.color
                    )}
                    aria-label={action.label}
                    onClick={() => setIsOpen(false)}
                  >
                    <action.icon size={20} />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}