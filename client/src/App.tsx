import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from '@/contexts/language-context';
import { ThemeProvider } from '@/contexts/theme-context';
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import HomePage from "@/pages/home-page";
import Transactions from "@/pages/transactions";
import Markets from "@/pages/markets";
import Settings from "@/pages/settings";
import SettingsPage from "@/pages/settings-page";
import Web3WalletPage from "@/pages/web3-wallet";
import PosPage from "@/pages/point-of-sale/pos-page";
import AuthPage from "@/pages/auth-page";
import EnhancedRegisterPage from "@/pages/enhanced-register-page";
import ProfilePage from "@/pages/profile";
import AboutPage from "@/pages/about-simple";
import TradingViewPage from "@/pages/trading-view";
import NewsPage from "@/pages/news";
import PriceAlertsPage from "@/pages/price-alerts";
import TeamPage from "@/pages/team";
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import WalletPage from "@/pages/wallet";
import SwapPage from "@/pages/swap";
// Theme CSS is already imported in index.css
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
        <Route path="/settings" component={() => <SettingsPage />} />
        <Route path="/wallet" component={() => <WalletPage userId={userId} />} />
        <Route path="/swap" component={() => <SwapPage userId={userId} />} />
        <Route path="/web3-wallet" component={() => <Web3WalletPage userId={userId} />} />
        <Route path="/pos" component={PosPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/about-simple" component={() => <AboutPage />} />
        <Route path="/trading" component={TradingViewPage} />
        <Route path="/news" component={NewsPage} />
        <Route path="/price-alerts" component={PriceAlertsPage} />
        <Route path="/team" component={TeamPage} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );

  // Non-protected routes (no authentication required)
  const publicRoutes = (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/register" component={EnhancedRegisterPage} />
    </Switch>
  );

  // عرض المسارات المحمية فقط في هذه المرحلة من التطوير
  return protectedRoutes;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
