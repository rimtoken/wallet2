import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Route, Switch } from "wouter";
import SimpleHome from "@/pages/simple-home";
import WalletPage from "@/pages/wallet-page";
import TradingPage from "@/pages/trading-page";
import EnhancedTradingPage from "@/pages/enhanced-trading-page";
import StakingPage from "@/pages/staking-page";
import MobileWalletPage from "@/pages/mobile-wallet-page";
import { Button } from "@/components/ui/button";
import { Wallet, Home, BarChart3, Coins, Smartphone } from "lucide-react";
import { Link } from "wouter";

function NavBar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-primary">RimToken</h1>
        </div>
        <div className="flex items-center space-x-2 gap-1">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link href="/wallet">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Wallet
            </Button>
          </Link>
          <Link href="/trading">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Trading
            </Button>
          </Link>
          <Link href="/enhanced-trading">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Swap
            </Button>
          </Link>
          <Link href="/staking">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Staking
            </Button>
          </Link>
          <Link href="/mobile">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Mobile
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <NavBar />
        <Switch>
          <Route path="/" component={SimpleHome} />
          <Route path="/wallet" component={WalletPage} />
          <Route path="/trading" component={TradingPage} />
          <Route path="/staking" component={StakingPage} />
          <Route path="/mobile" component={MobileWalletPage} />
          <Route>
            <div className="container mx-auto p-6 text-center">
              <h1 className="text-2xl font-bold">الصفحة غير موجودة</h1>
              <Link href="/">
                <Button className="mt-4">العودة للرئيسية</Button>
              </Link>
            </div>
          </Route>
        </Switch>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;