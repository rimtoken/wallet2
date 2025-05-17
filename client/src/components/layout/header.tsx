import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, ChevronDown, Menu } from "lucide-react";
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
            <Link href="/about">
              <span className="text-sm font-medium transition-colors hover:text-primary">حول</span>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative md:flex hidden">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          
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
                  <Link href="/profile">
                    <span className="text-lg font-medium transition-colors hover:text-primary">الملف الشخصي</span>
                  </Link>
                  <Link href="/settings">
                    <span className="text-lg font-medium transition-colors hover:text-primary">الإعدادات</span>
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}