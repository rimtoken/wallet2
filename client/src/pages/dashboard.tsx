import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";

interface DashboardProps {
  userId: number;
}

export default function Dashboard({ userId }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar className={sidebarOpen ? 'block' : 'hidden'} />
      
      {/* Main Content */}
      <main className="w-full lg:pl-64 flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <Topbar onToggleSidebar={toggleSidebar} />
        
        {/* Content */}
        <div className="p-4 lg:p-6 flex-1 overflow-auto bg-neutral-100 dark:bg-neutral-900">
          {/* قابلية تخصيص لوحة المعلومات مع السحب والإفلات */}
          <DashboardGrid userId={userId} />
        </div>
      </main>
      
      {/* Mobile Nav */}
      <MobileNav />
    </div>
  );
}
