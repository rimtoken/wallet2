import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Transactions from "@/pages/transactions";
import Markets from "@/pages/markets";
import Settings from "@/pages/settings";
import Web3WalletPage from "@/pages/web3-wallet";
import PosPage from "@/pages/point-of-sale/pos-page";
import AuthPage from "@/pages/auth-page";
import { useState, useEffect } from "react";
// سنضيف مزود المصادقة لاحقاً

function Router() {
  // Active user ID for demo purposes
  const [userId] = useState(1);
  
  // Prefetch market data and portfolio data on app start
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          queryClient.prefetchQuery({ queryKey: ['/api/market'] }),
          queryClient.prefetchQuery({ queryKey: [`/api/portfolio/${userId}`] }),
          queryClient.prefetchQuery({ queryKey: [`/api/wallets/${userId}`] }),
          queryClient.prefetchQuery({ queryKey: [`/api/transactions/${userId}?limit=5`] }),
        ]);
      } catch (error) {
        console.error("Failed to prefetch initial data:", error);
      }
    };
    
    fetchInitialData();
  }, [userId]);

  return (
    <Switch>
      <Route path="/" component={() => <Dashboard userId={userId} />} />
      <Route path="/transactions" component={() => <Transactions userId={userId} />} />
      <Route path="/markets" component={() => <Markets userId={userId} />} />
      <Route path="/settings" component={() => <Settings userId={userId} />} />
      <Route path="/web3-wallet" component={() => <Web3WalletPage userId={userId} />} />
      <Route path="/pos" component={PosPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
