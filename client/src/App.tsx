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
  
  // Prefetch market data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await queryClient.prefetchQuery({ queryKey: ['/api/market'] });
      } catch (error) {
        console.error("Failed to prefetch market data:", error);
      }
    };
    
    fetchInitialData();
  }, []);

  return (
    <Switch>
      {/* صفحة التسجيل وتسجيل الدخول */}
      <Route path="/auth">
        <AuthPage />
      </Route>
      
      {/* باقي المسارات العادية */}
      <Route path="/">
        <MainLayout>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/dashboard">
              <Dashboard userId={userId} />
            </Route>
            <Route path="/transactions">
              <Transactions userId={userId} />
            </Route>
            <Route path="/markets">
              <Markets userId={userId} />
            </Route>
            <Route path="/settings">
              <SettingsPage />
            </Route>
            <Route path="/wallet">
              <WalletPage userId={userId} />
            </Route>
            <Route path="/swap">
              <SwapPage userId={userId} />
            </Route>
            <Route path="/web3-wallet">
              <Web3WalletPage userId={userId} />
            </Route>
            <Route path="/pos">
              <PosPage />
            </Route>
            <Route path="/profile">
              <ProfilePage />
            </Route>
            <Route path="/about-simple">
              <AboutPage />
            </Route>
            <Route path="/trading">
              <TradingViewPage />
            </Route>
            <Route path="/news">
              <NewsPage />
            </Route>
            <Route path="/price-alerts">
              <PriceAlertsPage />
            </Route>
            <Route path="/team">
              <TeamPage />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </MainLayout>
      </Route>
    </Switch>
  );
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
