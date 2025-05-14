import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";

export function MobileNav() {
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
      label: "Web3", 
      icon: "ri-currency-line" 
    },
    { 
      path: "/settings", 
      label: "Settings", 
      icon: "ri-settings-3-line" 
    }
  ];
  
  return (
    <nav className="lg:hidden fixed bottom-0 w-full bg-white border-t border-neutral-200 px-4 py-2 z-40">
      <div className="flex justify-between items-center">
        {navItems.map((item, index) => {
          // Swap button in the center
          if (index === 2) {
            return (
              <Link key={`swap-button`} href="/exchange">
                <a className="flex flex-col items-center text-neutral-500">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center -mt-5">
                    <i className="ri-swap-line text-white text-xl"></i>
                  </div>
                  <span className="text-xs mt-1">Swap</span>
                </a>
              </Link>
            );
          }
          
          // All other navigation items
          return (
            <Link key={item.path} href={item.path}>
              <a className={cn(
                "flex flex-col items-center",
                location === item.path ? "text-primary" : "text-neutral-500"
              )}>
                <i className={cn(item.icon, "text-xl")}></i>
                <span className="text-xs mt-1">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
