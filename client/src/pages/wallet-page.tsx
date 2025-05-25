import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import ConnectWallet from "@/components/wallet/connect-wallet";
import { Plus, ArrowUpDown, Clock, RefreshCw, Wallet, ExternalLink, ChevronRight } from "lucide-react";

// مكون نظرة عامة على المحفظة
const WalletOverview = () => {
  const { user } = useAuth();
  const { getText } = useLanguage();
  
  // استعلام لجلب ملخص المحفظة
  const { data: portfolioSummary, isLoading } = useQuery({
    queryKey: ["/api/portfolio", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/portfolio/${user?.id}`);
      if (!res.ok) throw new Error("Failed to fetch portfolio data");
      return res.json();
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">${portfolioSummary?.totalValue?.toFixed(2) || "0.00"}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={portfolioSummary?.change24h >= 0 ? "text-green-500" : "text-red-500"}>
              {portfolioSummary?.change24h >= 0 ? "+" : ""}{portfolioSummary?.change24h?.toFixed(2) || "0.00"} ({portfolioSummary?.changePercentage24h >= 0 ? "+" : ""}{portfolioSummary?.changePercentage24h?.toFixed(2) || "0.00"}%)
            </span>
            <span className="text-sm text-muted-foreground">{getText("last24Hours")}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" /> {getText("deposit")}
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="mr-2 h-4 w-4" /> {getText("swap")}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" /> {getText("refresh")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="p-4">
            <CardDescription>{getText("assetsCount")}</CardDescription>
            <CardTitle>{portfolioSummary?.assetCount || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardDescription>{getText("volume24h")}</CardDescription>
            <CardTitle>${portfolioSummary?.volume24h?.toFixed(2) || "0.00"}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardDescription>{getText("totalProfit")}</CardDescription>
            <CardTitle className={portfolioSummary?.totalProfit >= 0 ? "text-green-500" : "text-red-500"}>
              {portfolioSummary?.totalProfit >= 0 ? "+" : ""}{portfolioSummary?.totalProfit?.toFixed(2) || "0.00"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

// مكون عرض الأصول
const AssetsTab = () => {
  const { user } = useAuth();
  const { getText } = useLanguage();
  
  // استعلام لجلب أصول المحفظة
  const { data: walletAssets, isLoading } = useQuery({
    queryKey: ["/api/wallets", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/wallets/${user?.id}`);
      if (!res.ok) throw new Error("Failed to fetch wallet assets");
      return res.json();
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-[72px] w-full" />
        <Skeleton className="h-[72px] w-full" />
        <Skeleton className="h-[72px] w-full" />
      </div>
    );
  }

  if (!walletAssets || walletAssets.length === 0) {
    return (
      <div className="text-center py-12">
        <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">{getText("noAssetsFound")}</h3>
        <p className="text-muted-foreground mb-6">{getText("noAssetsDescription")}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> {getText("deposit")}
          </Button>
          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" /> {getText("connectWallet")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{getText("yourAssets")}</h3>
        <Button variant="ghost" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" /> {getText("refresh")}
        </Button>
      </div>
      
      <div className="space-y-2">
        {walletAssets.map((asset) => (
          <div key={asset.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                <img src={asset.icon} alt={asset.name} className="w-6 h-6" onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${asset.symbol}&background=random`;
                }} />
              </div>
              <div>
                <div className="font-medium">{asset.name}</div>
                <div className="text-sm text-muted-foreground">{asset.symbol}</div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="font-medium">{asset.balance} {asset.symbol}</div>
              <div className="text-sm flex items-center gap-1">
                <span className="text-muted-foreground">${(asset.balance * asset.price).toFixed(2)}</span>
                <span className={asset.priceChangePercentage24h >= 0 ? "text-green-500" : "text-red-500"}>
                  {asset.priceChangePercentage24h >= 0 ? "+" : ""}{asset.priceChangePercentage24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// مكون سجل المعاملات
const TransactionsTab = () => {
  const { user } = useAuth();
  const { getText } = useLanguage();
  
  // استعلام لجلب سجل المعاملات
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["/api/transactions", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/transactions/${user?.id}`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return res.json();
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-[72px] w-full" />
        <Skeleton className="h-[72px] w-full" />
        <Skeleton className="h-[72px] w-full" />
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">{getText("noTransactionsFound")}</h3>
        <p className="text-muted-foreground mb-6">{getText("noTransactionsDescription")}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button>
            <ArrowUpDown className="mr-2 h-4 w-4" /> {getText("makeTransaction")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{getText("recentTransactions")}</h3>
        <Button variant="link" size="sm">
          {getText("viewAll")} <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {tx.type === 'deposit' && <Plus className="h-5 w-5 text-green-500" />}
                {tx.type === 'withdrawal' && <ArrowUpDown className="h-5 w-5 text-red-500" />}
                {tx.type === 'swap' && <ArrowUpDown className="h-5 w-5 text-blue-500" />}
              </div>
              <div>
                <div className="font-medium">
                  {tx.type === 'deposit' && getText("deposit")}
                  {tx.type === 'withdrawal' && getText("withdrawal")}
                  {tx.type === 'swap' && getText("swap")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="font-medium">
                {tx.type === 'deposit' && `+${tx.amount} ${tx.symbol}`}
                {tx.type === 'withdrawal' && `-${tx.amount} ${tx.symbol}`}
                {tx.type === 'swap' && `${tx.amount} ${tx.symbol} → ${tx.targetAmount} ${tx.targetSymbol}`}
              </div>
              <div className="text-sm text-muted-foreground">
                ${tx.usdValue.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// مكون المحافظ المتصلة
const ConnectedWalletsTab = () => {
  const { user } = useAuth();
  const { getText } = useLanguage();
  
  // استعلام لجلب المحافظ المتصلة (عندما تصبح متاحة)
  const { data: connectedWallets, isLoading } = useQuery({
    queryKey: ["/api/connected-wallets", user?.id],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/connected-wallets/${user?.id}`);
        if (!res.ok) return [];
        return res.json();
      } catch (error) {
        console.error("Error fetching connected wallets:", error);
        return [];
      }
    },
    enabled: !!user,
  });

  return (
    <div className="space-y-6">
      <ConnectWallet />
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-[72px] w-full" />
          <Skeleton className="h-[72px] w-full" />
        </div>
      ) : connectedWallets && connectedWallets.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{getText("connectedWallets")}</h3>
          <div className="space-y-2">
            {connectedWallets.map((wallet) => (
              <div key={wallet.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {wallet.wallet_type === 'metamask' && 'M'}
                    {wallet.wallet_type === 'walletconnect' && 'W'}
                    {wallet.wallet_type === 'phantom' && 'P'}
                    {wallet.wallet_type === 'binance' && 'B'}
                  </div>
                  <div>
                    <div className="font-medium">{wallet.name || wallet.wallet_type}</div>
                    <div className="text-sm text-muted-foreground">
                      {wallet.wallet_address.substring(0, 6)}...{wallet.wallet_address.substring(wallet.wallet_address.length - 4)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

// تعريف خصائص صفحة المحفظة
interface WalletPageProps {
  userId?: number;
}

// الصفحة الرئيسية للمحفظة
export default function WalletPage({ userId }: WalletPageProps) {
  const { user, isLoading } = useAuth();
  const { getText } = useLanguage();
  const { toast } = useToast();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: getText("authRequired"),
        description: getText("pleaseLoginFirst"),
        variant: "destructive",
      });
      // يمكن إضافة إعادة توجيه إلى صفحة تسجيل الدخول هنا
    }
  }, [user, isLoading, toast, getText]);

  if (isLoading) {
    return (
      <div className="container py-8 space-y-6">
        <Skeleton className="h-12 w-[250px]" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{getText("walletAccessDenied")}</h1>
        <p className="mb-6">{getText("pleaseLoginToAccessWallet")}</p>
        <Button asChild>
          <a href="/auth">{getText("login")}</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold">{getText("myWallet")}</h1>
      
      <WalletOverview />
      
      <Separator className="my-6" />
      
      <Tabs defaultValue="assets">
        <TabsList className="mb-4">
          <TabsTrigger value="assets">{getText("assets")}</TabsTrigger>
          <TabsTrigger value="transactions">{getText("transactions")}</TabsTrigger>
          <TabsTrigger value="connectedWallets">{getText("connectedWallets")}</TabsTrigger>
        </TabsList>
        <TabsContent value="assets">
          <AssetsTab />
        </TabsContent>
        <TabsContent value="transactions">
          <TransactionsTab />
        </TabsContent>
        <TabsContent value="connectedWallets">
          <ConnectedWalletsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}