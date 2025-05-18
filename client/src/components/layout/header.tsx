import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, ChevronDown, Menu, Globe, LogIn, UserPlus, Moon, Sun, Palette } from "lucide-react";
import { useLanguage, Language, LANGUAGES } from "@/contexts/language-context";
import { useTheme } from "@/contexts/theme-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { language, setLanguage, translate } = useLanguage();
  const { theme, setTheme } = useTheme();
  return (
    <header className={cn("w-full border-b bg-white z-50 sticky top-0 shadow-md", className)} style={{height: "100px", minHeight: "100px"}}>
      <div className="w-full flex h-full items-center justify-between px-6 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-6 lg:gap-10">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <Logo size="md" />
            </div>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link href="/">
              <span className="text-sm font-medium transition-colors hover:text-primary">{translate('nav.home')}</span>
            </Link>
            <Link href="/wallet">
              <span className="text-sm font-medium transition-colors hover:text-primary">{translate('nav.wallet')}</span>
            </Link>
            <Link href="/swap">
              <span className="text-sm font-medium transition-colors hover:text-primary">{translate('nav.swap')}</span>
            </Link>
            <Link href="/markets">
              <span className="text-sm font-medium transition-colors hover:text-primary">{translate('nav.market')}</span>
            </Link>
            <Link href="/news">
              <span className="text-sm font-medium transition-colors hover:text-primary">{translate('nav.news')}</span>
            </Link>
            <Link href="/price-alerts">
              <span className="text-sm font-medium transition-colors hover:text-primary">{translate('nav.priceAlerts')}</span>
            </Link>
            <Link href="/team">
              <span className="text-sm font-medium transition-colors hover:text-primary">{translate('nav.team')}</span>
            </Link>
            <Link href="/about-simple">
              <span className="text-sm font-medium transition-colors hover:text-primary">{translate('nav.about')}</span>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          {/* سكريبت تداول العملات + تحميل التطبيق */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="md:flex hidden items-center gap-1 border-amber-500 text-amber-600">
                <span>أدوات إضافية</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>أدوات التداول والمحفظة</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="flex flex-col items-start">
                <Link href="/trading">
                  <span className="font-semibold">مؤشر تداول العملات</span>
                  <span className="text-xs text-gray-500">تابع أسعار العملات المشفرة مباشرة</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>تطبيق RimToken للجوال</DropdownMenuLabel>
              <DropdownMenuItem className="flex items-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 3H6.5C5.67157 3 5 3.67157 5 4.5V19.5C5 20.3284 5.67157 21 6.5 21H17.5C18.3284 21 19 20.3284 19 19.5V4.5C19 3.67157 18.3284 3 17.5 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>تحميل لأجهزة Android</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2H8C7.44772 2 7 2.44772 7 3V21C7 21.5523 7.44772 22 8 22H16C16.5523 22 17 21.5523 17 21V3C17 2.44772 16.5523 2 16 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>تحميل لأجهزة iPhone</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* قائمة تغيير المظهر (الثيمات) */}
          <DropdownMenu modal={true}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:flex hidden">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5" />
                ) : theme === 'spooky' ? (
                  <Palette className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>اختر المظهر</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setTheme('light')} 
                className={theme === 'light' ? 'bg-amber-50 font-medium' : ''}
              >
                <Sun className="h-4 w-4 mr-2" />
                <span>فاتح</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setTheme('dark')} 
                className={theme === 'dark' ? 'bg-amber-50 font-medium' : ''}
              >
                <Moon className="h-4 w-4 mr-2" />
                <span>داكن</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setTheme('spooky')} 
                className={theme === 'spooky' ? 'bg-amber-50 font-medium' : ''}
              >
                <Palette className="h-4 w-4 mr-2" />
                <span>مخيف</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex w-full cursor-pointer">
                  <span>المزيد من الإعدادات</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* قائمة تغيير اللغة */}
          <DropdownMenu modal={true}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:flex hidden">
                <Globe className="h-5 w-5" />
                <span className="ml-1 sr-only">{LANGUAGES[language].name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{translate('general.chooseLanguage')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setLanguage('ar')} 
                className={language === 'ar' ? 'bg-amber-50 font-medium' : ''}
              >
                العربية
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLanguage('en')} 
                className={language === 'en' ? 'bg-amber-50 font-medium' : ''}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLanguage('fr')} 
                className={language === 'fr' ? 'bg-amber-50 font-medium' : ''}
              >
                Français
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* أزرار تسجيل الدخول/التسجيل (للزوار) */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth">
              <Button variant="outline" size="default" className="flex items-center gap-2 px-5 border-amber-500 text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                <LogIn className="h-4 w-4" />
                <span className="font-medium">{translate('user.login')}</span>
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="default" size="default" className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 flex items-center gap-2 px-5 shadow-sm">
                <UserPlus className="h-4 w-4" />
                <span className="font-medium">{translate('user.register')}</span>
              </Button>
            </Link>
          </div>
          
          {/* إشعارات (للمستخدمين المسجّلين) */}
          <Button variant="ghost" size="icon" className="relative md:flex hidden">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          
          {/* قائمة المستخدم (للمستخدمين المسجّلين) - يمكن إخفاؤها عندما يكون الزائر غير مسجّل */}
          <div className="hidden md:block relative z-10">
            <DropdownMenu modal={true}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex gap-2 hover:bg-gray-100 transition-colors h-12 px-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-white text-sm">مس</AvatarFallback>
                  </Avatar>
                  <span className="text-base font-medium">مستخدم</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">الملف الشخصي</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">الإعدادات</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/auth">تسجيل الخروج</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-6 py-6">
                <div className="flex items-center gap-2">
                  <Logo size="lg" />
                </div>
                <nav className="grid gap-3">
                  <Link href="/">
                    <span className="text-lg font-medium transition-colors hover:text-primary">{translate('nav.home')}</span>
                  </Link>
                  <Link href="/wallet">
                    <span className="text-lg font-medium transition-colors hover:text-primary">{translate('nav.wallet')}</span>
                  </Link>
                  <Link href="/swap">
                    <span className="text-lg font-medium transition-colors hover:text-primary">{translate('nav.swap')}</span>
                  </Link>
                  <Link href="/markets">
                    <span className="text-lg font-medium transition-colors hover:text-primary">{translate('nav.market')}</span>
                  </Link>
                  <Link href="/about-simple">
                    <span className="text-lg font-medium transition-colors hover:text-primary">{translate('nav.about')}</span>
                  </Link>
                  <Link href="/profile">
                    <span className="text-lg font-medium transition-colors hover:text-primary">{translate('user.profile')}</span>
                  </Link>
                  <Link href="/settings">
                    <span className="text-lg font-medium transition-colors hover:text-primary">{translate('user.settings')}</span>
                  </Link>
                  
                  <div className="border-t border-gray-100 my-2 pt-2">
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="text-lg font-medium">{translate('general.chooseLanguage')}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-2 ml-7">
                      <button 
                        onClick={() => setLanguage('ar')} 
                        className={`text-md text-gray-600 hover:text-primary text-right ${language === 'ar' ? 'font-semibold text-primary' : ''}`}
                      >
                        العربية
                      </button>
                      <button 
                        onClick={() => setLanguage('en')} 
                        className={`text-md text-gray-600 hover:text-primary text-right ${language === 'en' ? 'font-semibold text-primary' : ''}`}
                      >
                        English
                      </button>
                      <button 
                        onClick={() => setLanguage('fr')} 
                        className={`text-md text-gray-600 hover:text-primary text-right ${language === 'fr' ? 'font-semibold text-primary' : ''}`}
                      >
                        Français
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 my-2 pt-2">
                    <div className="flex gap-3 mt-3">
                      <Button className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 py-6">
                        <UserPlus className="h-5 w-5 mr-2" />
                        <span className="font-medium">{translate('user.register')}</span>
                      </Button>
                      <Button variant="outline" className="flex-1 border-amber-500 text-amber-600 py-6">
                        <LogIn className="h-5 w-5 mr-2" />
                        <span className="font-medium">{translate('user.login')}</span>
                      </Button>
                    </div>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}