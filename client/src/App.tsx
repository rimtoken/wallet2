import { Switch, Route, useLocation } from "wouter";
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
import MainSimplifiedPage from "@/pages/main-simplified";
import WalletSimplifiedPage from "@/pages/wallet-simplified";
import SwapSimplifiedPage from "@/pages/swap-simplified";
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
      {/* صفحة التسجيل خارج القالب الرئيسي */}
      <Route path="/auth">
        <AuthPage />
      </Route>
      
      {/* الصفحات المبسطة */}
      <Route path="/simple">
        <MainSimplifiedPage />
      </Route>
      <Route path="/wallet-simplified">
        <WalletSimplifiedPage />
      </Route>
      <Route path="/swap-simplified">
        <SwapSimplifiedPage />
      </Route>
      
      {/* كل المسارات الأخرى داخل القالب الرئيسي */}
      <Route path="/">
        <MainLayout>
          <HomePage />
        </MainLayout>
      </Route>
      <Route path="/dashboard">
        <MainLayout>
          <Dashboard userId={userId} />
        </MainLayout>
      </Route>
      <Route path="/transactions">
        <MainLayout>
          <Transactions userId={userId} />
        </MainLayout>
      </Route>
      <Route path="/markets">
        <MainLayout>
          <Markets userId={userId} />
        </MainLayout>
      </Route>
      <Route path="/settings">
        <MainLayout>
          <SettingsPage />
        </MainLayout>
      </Route>
      <Route path="/wallet">
        <MainLayout>
          <WalletPage userId={userId} />
        </MainLayout>
      </Route>
      <Route path="/swap">
        <MainLayout>
          <SwapPage userId={userId} />
        </MainLayout>
      </Route>
      <Route>
        <MainLayout>
          <NotFound />
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
