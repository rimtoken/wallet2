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
import TradingViewPage from "@/pages/trading-view";
import PriceAlertsPage from "@/pages/price-alerts";
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import WalletPage from "@/pages/wallet";
import SwapPage from "@/pages/swap";
import MainSimplifiedPage from "@/pages/main-simplified";
import WalletSimplifiedPage from "@/pages/wallet-simplified";
import SwapSimplifiedPage from "@/pages/swap-simplified";
import SwapPageNew from "@/pages/swap-page";

// الصفحات الجديدة
import TeamPage from "@/pages/team-page";
import NewsPage from "@/pages/news-page";
import AboutPage from "@/pages/about-page";
import ContactPage from "@/pages/contact-page";
import AchievementsPage from "@/pages/achievements-page";
import DepositPage from "@/pages/deposit-page";
import WithdrawalPage from "@/pages/withdrawal-page";
import FAQPage from "@/pages/faq-page";
import AdvancedDashboardPage from "@/pages/advanced-dashboard";
import DemoFeaturesPage from "@/pages/demo-features";
import AdvancedTradingPage from "@/pages/advanced-trading-page";
import PortfolioAnalyticsPage from "@/pages/portfolio-analytics-page";
import SmartAlertsPage from "@/pages/smart-alerts-page";
import DemoLoginPage from "@/pages/demo-login-page";
import RegisterPage from "@/pages/register-page";
import ModernWalletPage from "@/pages/modern-wallet-page";
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
        <DemoLoginPage />
      </Route>
      
      {/* صفحة إنشاء حساب جديد */}
      <Route path="/register">
        <RegisterPage />
      </Route>
      
      {/* الصفحة الرئيسية المبسطة كصفحة افتراضية */}
      <Route path="/">
        <MainSimplifiedPage />
      </Route>
      <Route path="/wallet">
        <ModernWalletPage />
      </Route>
      <Route path="/swap">
        <SwapPageNew />
      </Route>
      
      {/* الصفحات الإضافية الجديدة */}
      <Route path="/team">
        <TeamPage />
      </Route>
      <Route path="/news">
        <NewsPage />
      </Route>
      <Route path="/about">
        <AboutPage />
      </Route>
      <Route path="/contact">
        <ContactPage />
      </Route>

      <Route path="/deposit">
        <DepositPage />
      </Route>
      <Route path="/withdrawal">
        <WithdrawalPage />
      </Route>
      <Route path="/faq">
        <FAQPage />
      </Route>
      <Route path="/advanced-dashboard">
        <AdvancedDashboardPage />
      </Route>
      
      {/* المميزات المتقدمة الجديدة */}
      <Route path="/advanced-trading">
        <AdvancedTradingPage />
      </Route>
      <Route path="/portfolio-analytics">
        <PortfolioAnalyticsPage />
      </Route>
      <Route path="/smart-alerts">
        <SmartAlertsPage />
      </Route>
      
      {/* صفحة عرض المميزات الجديدة */}
      <Route path="/demo-features">
        <DemoFeaturesPage />
      </Route>

      {/* الصفحات القديمة تحت مسار جديد */}
      <Route path="/full">
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
      <Route path="/wallet-full">
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
