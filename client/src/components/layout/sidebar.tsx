import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { Avatar } from "@/components/ui/avatar";
import rimTokenLogo from "@/assets/logo/rimtoken-logo.png";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  
  // Navigation items
  const navItems = [
    { 
      path: "/", 
      label: "Dashboard", 
      icon: "ri-dashboard-line" 
    },
    { 
      path: "/transactions", 
      label: "Transactions", 
      icon: "ri-exchange-funds-line" 
    },
    { 
      path: "/markets", 
      label: "Markets", 
      icon: "ri-bar-chart-box-line" 
    },
    { 
      path: "/web3-wallet", 
      label: "Web3 Wallet", 
      icon: "ri-currency-line" 
    },
    { 
      path: "/pos", 
      label: "نقاط البيع", 
      icon: "ri-store-2-line" 
    },
    { 
      path: "/exchange", 
      label: "Exchange", 
      icon: "ri-swap-line" 
    },
    { 
      path: "/settings", 
      label: "Settings", 
      icon: "ri-settings-3-line" 
    }
  ];
  
  return (
    <aside className={cn(
      "fixed top-0 left-0 z-40 h-screen w-64 hidden lg:block bg-white border-r border-neutral-200 overflow-y-auto transition-all",
      className
    )}>
      <div className="p-4 flex items-center border-b border-neutral-200">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
          <img src={rimTokenLogo} alt="RimToken Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="ml-3 text-xl font-semibold">RimToken</h1>
      </div>
      
      <div className="p-4">
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className="mb-1">
                <Link href={item.path}>
                  <a className={cn(
                    "flex items-center px-4 py-3 rounded-lg transition-colors",
                    location === item.path
                      ? "text-neutral-900 bg-neutral-100"
                      : "text-neutral-600 hover:bg-neutral-100"
                  )}>
                    <i className={cn(item.icon, "mr-3 text-lg")}></i>
                    <span>{item.label}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-neutral-200">
        <div className="flex items-center">
          <Avatar 
            alt="Alex Morgan" 
            fallback="AM"
            size="md"
          />
          <div className="ml-3">
            <p className="text-sm font-medium">Alex Morgan</p>
            <p className="text-xs text-neutral-500">alex@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
