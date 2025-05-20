import { Container } from "@/components/ui/container";
import { WalletActions } from "@/components/wallet/wallet-actions";
import { TransactionHistory } from "@/components/transactions/transaction-history";
import { PortfolioSummary } from "@/components/portfolio/portfolio-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownRight, ArrowUpRight, BarChart3, Filter, Wallet as WalletIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WalletPageProps {
  userId: number;
}

export default function WalletPage({ userId }: WalletPageProps) {
  const [displayFilter, setDisplayFilter] = useState<'all' | 'gainers' | 'losers'>('all');
  
  // استعلام لجلب بيانات الأصول في المحفظة
  const { data: walletAssets, isLoading: isLoadingWallet } = useQuery({
    queryKey: [`/api/wallets/${userId}`],
  });

  // تصفية الأصول حسب الفلتر المحدد
  const filteredAssets = () => {
    if (!walletAssets || walletAssets.length === 0) return [];
    
    switch(displayFilter) {
      case 'gainers':
        return walletAssets.filter((asset: any) => asset.priceChangePercentage24h > 0);
      case 'losers':
        return walletAssets.filter((asset: any) => asset.priceChangePercentage24h < 0);
      default:
        return walletAssets;
    }
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center mb-2 md:mb-0">
            <WalletIcon className="mr-2 h-8 w-8" />
            محفظتي
          </h1>
          <div className="flex space-x-2">
            <Button 
              variant={displayFilter === 'all' ? "default" : "outline"} 
              size="sm"
              onClick={() => setDisplayFilter('all')}
            >
              جميع الأصول
            </Button>
            <Button 
              variant={displayFilter === 'gainers' ? "default" : "outline"} 
              size="sm"
              onClick={() => setDisplayFilter('gainers')}
              className="text-green-600"
            >
              <ArrowUpRight className="mr-1 h-4 w-4" />
              الرابحة
            </Button>
            <Button 
              variant={displayFilter === 'losers' ? "default" : "outline"} 
              size="sm"
              onClick={() => setDisplayFilter('losers')}
              className="text-red-600"
            >
              <ArrowDownRight className="mr-1 h-4 w-4" />
              الخاسرة
            </Button>
          </div>
        </div>

        {/* ملخص المحفظة */}
        <div className="mb-6">
          <PortfolioSummary userId={userId} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <WalletActions userId={userId} />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>أصول المحفظة</CardTitle>
                <Badge variant="outline">
                  {displayFilter === 'all' 
                    ? 'جميع الأصول' 
                    : displayFilter === 'gainers' 
                      ? 'الأصول الرابحة' 
                      : 'الأصول الخاسرة'
                  }
                </Badge>
              </CardHeader>
              <CardContent>
                {isLoadingWallet ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : !walletAssets || walletAssets.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">لا توجد أصول في محفظتك حتى الآن</p>
                    <p className="text-sm text-gray-400 mt-2">
                      يمكنك إيداع العملات المشفرة أو شرائها لتظهر هنا
                    </p>
                  </div>
                ) : filteredAssets().length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">لا توجد أصول تطابق الفلتر المحدد</p>
                    <Button 
                      variant="link" 
                      className="mt-2"
                      onClick={() => setDisplayFilter('all')}
                    >
                      عرض جميع الأصول
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAssets().map((asset: any) => (
                      <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg transition-all hover:shadow-md">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                            asset.priceChangePercentage24h >= 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            <span className="font-medium">{asset.symbol.substring(0, 1)}</span>
                          </div>
                          <div>
                            <h3 className="font-medium">{asset.name}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <span>{asset.balance} {asset.symbol}</span>
                              {asset.balance > 0 && (
                                <Badge variant="outline" className="ml-2 text-xs py-0">
                                  استثمار نشط
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${asset.value.toLocaleString()}</p>
                          <p className={`text-xs flex items-center justify-end ${
                            asset.priceChangePercentage24h >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {asset.priceChangePercentage24h >= 0 ? (
                              <ArrowUpRight className="mr-0.5 h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="mr-0.5 h-3 w-3" />
                            )}
                            {asset.priceChangePercentage24h >= 0 ? '+' : ''}
                            {asset.priceChangePercentage24h.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">جميع المعاملات</TabsTrigger>
                <TabsTrigger value="deposits">
                  <ArrowDownRight className="mr-2 h-4 w-4" /> إيداعات
                </TabsTrigger>
                <TabsTrigger value="withdrawals">
                  <ArrowUpRight className="mr-2 h-4 w-4" /> سحوبات
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <TransactionHistory userId={userId} limit={10} />
              </TabsContent>
              <TabsContent value="deposits">
                <Card>
                  <CardHeader>
                    <CardTitle>تاريخ الإيداعات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-gray-500">سيتم عرض معاملات الإيداع هنا</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="withdrawals">
                <Card>
                  <CardHeader>
                    <CardTitle>تاريخ السحوبات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-gray-500">سيتم عرض معاملات السحب هنا</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Container>
  );
}