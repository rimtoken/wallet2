import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import SimpleHome from "@/pages/simple-home";

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
        <SimpleHome />
      </Route>
      <Route path="/wallet">
        <SimpleHome />
      </Route>
      <Route path="/swap">
        <SimpleHome />
      </Route>
      
      {/* الصفحات الإضافية الجديدة */}
      <Route path="/team">
        <SimpleHome />
      </Route>
      <Route path="/news">
        <SimpleHome />
      </Route>
      <Route path="/about">
        <SimpleHome />
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
