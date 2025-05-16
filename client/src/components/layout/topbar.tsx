import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LogIn, UserPlus } from "lucide-react";
import rimTokenLogo from "@/assets/logo/rimtoken-logo.png";

interface TopbarProps {
  onToggleSidebar: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <header className="bg-white border-b border-neutral-200 p-4 flex items-center justify-between">
      <div className="flex items-center lg:hidden">
        <button 
          className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
          onClick={onToggleSidebar}
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
        <div className="ml-3 flex items-center">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
            <img src={rimTokenLogo} alt="RimToken Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="ml-2 text-lg font-semibold">RimToken</h1>
        </div>
      </div>
      
      <div className="hidden lg:block">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <i className="ri-search-line text-neutral-400"></i>
          </span>
          <input 
            type="text" 
            className="bg-neutral-100 pl-10 pr-4 py-2 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary" 
            placeholder="Search for assets, transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        {/* أزرار تسجيل الدخول والتسجيل */}
        <div className="flex items-center gap-2">
          <Link href="/auth">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex items-center gap-1 text-primary border-primary hover:bg-primary/10 rounded-full px-4"
            >
              <LogIn className="h-4 w-4" />
              <span>تسجيل الدخول</span>
            </Button>
          </Link>
          
          <Link href="/auth?tab=register">
            <Button 
              variant="default" 
              size="sm" 
              className="hidden md:flex items-center gap-1 bg-primary hover:bg-primary/90 rounded-full px-4"
            >
              <UserPlus className="h-4 w-4" />
              <span>التسجيل</span>
            </Button>
          </Link>
          
          {/* لعرض أيقونة فقط على الشاشات الصغيرة */}
          <Link href="/auth">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden p-2 rounded-full"
            >
              <LogIn className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        
        {/* أيقونة الإشعارات */}
        <button className="p-2 rounded-full text-neutral-600 hover:bg-neutral-100 relative">
          <i className="ri-notification-3-line text-xl"></i>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary"></span>
        </button>
        
        <div className="lg:hidden">
          <Avatar 
            alt="Alex Morgan" 
            fallback="AM"
            size="sm"
          />
        </div>
      </div>
    </header>
  );
}
