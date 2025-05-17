import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

interface WalletSummaryProps {
  userId: number;
}

export function WalletSummary({ userId }: WalletSummaryProps) {
  // استعلام لجلب بيانات المحفظة
  const { data: portfolioData, isLoading } = useQuery({
    queryKey: [`/api/portfolio/${userId}`],
  });

  // استعلام لجلب بيانات الأصول في المحفظة
  const { data: walletAssets, isLoading: isLoadingAssets } = useQuery({
    queryKey: [`/api/wallets/${userId}`],
  });

  if (isLoading || isLoadingAssets) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-bold">ملخص المحفظة</CardTitle>
          <Wallet className="text-gray-400" size={20} />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const portfolio = portfolioData || {
    totalValue: 0,
    change24h: 0,
    changePercentage24h: 0,
  };

  const assets = walletAssets || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold">ملخص المحفظة</CardTitle>
        <Wallet className="text-gray-400" size={20} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">القيمة الإجمالية</p>
            <h2 className="text-3xl font-bold">${portfolio.totalValue.toLocaleString()}</h2>
            
            <div className="flex items-center mt-1">
              {portfolio.changePercentage24h >= 0 ? (
                <div className="flex items-center text-green-500">
                  <ArrowUpRight size={16} />
                  <span className="text-sm font-medium mr-1">
                    {portfolio.changePercentage24h.toFixed(2)}%
                  </span>
                </div>
              ) : (
                <div className="flex items-center text-red-500">
                  <ArrowDownRight size={16} />
                  <span className="text-sm font-medium mr-1">
                    {Math.abs(portfolio.changePercentage24h).toFixed(2)}%
                  </span>
                </div>
              )}
              <span className="text-sm text-gray-500">
                (${Math.abs(portfolio.change24h).toLocaleString()}) في آخر 24 ساعة
              </span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-md font-semibold mb-3">الأصول ({assets.length})</h3>
            <div className="space-y-3">
              {assets.slice(0, 3).map((asset: any) => (
                <div key={asset.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                      <span className="font-medium text-xs">{asset.symbol}</span>
                    </div>
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-xs text-gray-500">{asset.balance} {asset.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${asset.value.toLocaleString()}</p>
                    <p className={`text-xs ${asset.priceChangePercentage24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {asset.priceChangePercentage24h >= 0 ? '+' : ''}
                      {asset.priceChangePercentage24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
              
              {assets.length > 3 && (
                <p className="text-center text-sm text-primary cursor-pointer">
                  عرض جميع الأصول ({assets.length})
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}