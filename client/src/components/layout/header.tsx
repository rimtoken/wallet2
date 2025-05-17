import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, ChevronDown, Menu, Globe, LogIn, UserPlus } from "lucide-react";
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
  return (
    <header className={cn("w-full border-b bg-white z-10", className)}>
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6 lg:gap-10">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <Logo size="md" />
            </div>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link href="/">
              <span className="text-sm font-medium transition-colors hover:text-primary">الرئيسية</span>
            </Link>
            <Link href="/wallet">
              <span className="text-sm font-medium transition-colors hover:text-primary">المحفظة</span>
            </Link>
            <Link href="/swap">
              <span className="text-sm font-medium transition-colors hover:text-primary">تبادل</span>
            </Link>
            <Link href="/markets">
              <span className="text-sm font-medium transition-colors hover:text-primary">السوق</span>
            </Link>
            <Link href="/about-simple">
              <span className="text-sm font-medium transition-colors hover:text-primary">حول</span>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          {/* قائمة تغيير اللغة */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:flex hidden">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>اختر اللغة</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>العربية</DropdownMenuItem>
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>Français</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* أزرار تسجيل الدخول/التسجيل (للزوار) */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <LogIn className="h-4 w-4" />
              <span>تسجيل الدخول</span>
            </Button>
            <Button variant="default" size="sm" className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              <span>التسجيل</span>
            </Button>
          </div>
          
          {/* إشعارات (للمستخدمين المسجّلين) */}
          <Button variant="ghost" size="icon" className="relative md:flex hidden">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          
          {/* قائمة المستخدم (للمستخدمين المسجّلين) - يمكن إخفاؤها عندما يكون الزائر غير مسجّل */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hidden md:flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-white">مس</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">مستخدم</span>
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
                    <span className="text-lg font-medium transition-colors hover:text-primary">الرئيسية</span>
                  </Link>
                  <Link href="/wallet">
                    <span className="text-lg font-medium transition-colors hover:text-primary">المحفظة</span>
                  </Link>
                  <Link href="/swap">
                    <span className="text-lg font-medium transition-colors hover:text-primary">تبادل</span>
                  </Link>
                  <Link href="/markets">
                    <span className="text-lg font-medium transition-colors hover:text-primary">السوق</span>
                  </Link>
                  <Link href="/about-simple">
                    <span className="text-lg font-medium transition-colors hover:text-primary">حول</span>
                  </Link>
                  <Link href="/profile">
                    <span className="text-lg font-medium transition-colors hover:text-primary">الملف الشخصي</span>
                  </Link>
                  <Link href="/settings">
                    <span className="text-lg font-medium transition-colors hover:text-primary">الإعدادات</span>
                  </Link>
                  
                  <div className="border-t border-gray-100 my-2 pt-2">
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="text-lg font-medium">اللغة</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-2 ml-7">
                      <button className="text-md text-gray-600 hover:text-primary text-right">العربية</button>
                      <button className="text-md text-gray-600 hover:text-primary text-right">English</button>
                      <button className="text-md text-gray-600 hover:text-primary text-right">Français</button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 my-2 pt-2">
                    <div className="flex gap-2 mt-2">
                      <Button className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600">
                        <UserPlus className="h-4 w-4 mr-1" />
                        التسجيل
                      </Button>
                      <Button variant="outline" className="flex-1 border-amber-500 text-amber-500">
                        <LogIn className="h-4 w-4 mr-1" />
                        تسجيل الدخول
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