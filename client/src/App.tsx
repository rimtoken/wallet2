import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import HomePage from "@/pages/home-page";
import Transactions from "@/pages/transactions";
import Markets from "@/pages/markets";
import Settings from "@/pages/settings";
import Web3WalletPage from "@/pages/web3-wallet";
import PosPage from "@/pages/point-of-sale/pos-page";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile";
import AboutPage from "@/pages/about";
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import WalletPage from "@/pages/wallet";
import SwapPage from "@/pages/swap";
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

  // Protected routes (requiring authentication)
  const protectedRoutes = (
    <MainLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/dashboard" component={() => <Dashboard userId={userId} />} />
        <Route path="/transactions" component={() => <Transactions userId={userId} />} />
        <Route path="/markets" component={() => <Markets userId={userId} />} />
        <Route path="/settings" component={() => <Settings userId={userId} />} />
        <Route path="/wallet" component={() => <WalletPage userId={userId} />} />
        <Route path="/swap" component={() => <SwapPage userId={userId} />} />
        <Route path="/web3-wallet" component={() => <Web3WalletPage userId={userId} />} />
        <Route path="/pos" component={PosPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/about" component={AboutPage} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );

  // Non-protected routes (no authentication required)
  const publicRoutes = (
    <Switch>
      <Route path="/auth" component={AuthPage} />
    </Switch>
  );

  // For demo purposes, always show the protected routes
  // In a real application, this would depend on authentication state
  return protectedRoutes;
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
