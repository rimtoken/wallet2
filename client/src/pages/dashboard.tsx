import { Container } from "@/components/ui/container";
import { WalletSummary } from "@/components/dashboard/wallet-summary";
import { TransactionHistory } from "@/components/transactions/transaction-history";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, BarChart3, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { useState } from "react";

interface DashboardProps {
  userId: number;
}

export default function Dashboard({ userId }: DashboardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // تحديث جميع البيانات
  const refreshAllData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [`/api/portfolio/${userId}`] }),
        queryClient.invalidateQueries({ queryKey: [`/api/wallets/${userId}`] }),
        queryClient.invalidateQueries({ queryKey: [`/api/transactions/${userId}`] }),
        queryClient.invalidateQueries({ queryKey: ["/api/market"] }),
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={refreshAllData}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              تحديث
            </Button>
            <Button asChild>
              <Link href="/swap">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                تبادل
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <WalletSummary userId={userId} />
          </div>
          <div>
            <TransactionHistory userId={userId} limit={5} />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            نظرة عامة على السوق
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Market Overview Cards */}
            <MarketOverviewCard
              title="بيتكوين"
              symbol="BTC"
              price="61,245.30"
              change="+2.5%"
              isPositive={true}
            />
            <MarketOverviewCard
              title="إيثريوم"
              symbol="ETH"
              price="3,120.84"
              change="-0.8%"
              isPositive={false}
            />
            <MarketOverviewCard
              title="سولانا"
              symbol="SOL"
              price="147.62"
              change="+5.2%"
              isPositive={true}
            />
            <MarketOverviewCard
              title="بينانس كوين"
              symbol="BNB"
              price="573.45"
              change="+1.2%"
              isPositive={true}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

interface MarketOverviewCardProps {
  title: string;
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
}

function MarketOverviewCard({ title, symbol, price, change, isPositive }: MarketOverviewCardProps) {
  return (
    <div className="bg-card rounded-lg p-4 border">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
            <span className="font-medium text-xs">{symbol.substring(0, 1)}</span>
          </div>
          <div>
            <div className="font-medium">{title}</div>
            <div className="text-xs text-muted-foreground">{symbol}</div>
          </div>
        </div>
        <div>
          <div className="font-medium text-right">${price}</div>
          <div className={`text-xs text-right ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {change}
          </div>
        </div>
      </div>
    </div>
  );
}