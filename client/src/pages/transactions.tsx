import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { TransactionHistory } from "@/components/transactions/history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TransactionsPageProps {
  userId: number;
}

export default function Transactions({ userId }: TransactionsPageProps) {
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
        <div className="p-4 lg:p-6 flex-1 overflow-auto bg-neutral-100">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-500 mb-4">
                View all your cryptocurrency transactions in one place. This includes sends, receives, and swaps.
              </p>
            </CardContent>
          </Card>
          
          <TransactionHistory userId={userId} limit={20} showViewAll={false} />
        </div>
      </main>
      
      {/* Mobile Nav */}
      <MobileNav />
    </div>
  );
}
