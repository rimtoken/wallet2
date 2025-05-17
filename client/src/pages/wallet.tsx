import { Container } from "@/components/ui/container";
import { WalletActions } from "@/components/wallet/wallet-actions";
import { TransactionHistory } from "@/components/transactions/transaction-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownRight, ArrowUpRight, BarChart3, Wallet as WalletIcon } from "lucide-react";

interface WalletPageProps {
  userId: number;
}

export default function WalletPage({ userId }: WalletPageProps) {
  // استعلام لجلب بيانات الأصول في المحفظة
  const { data: walletAssets, isLoading: isLoadingWallet } = useQuery({
    queryKey: [`/api/wallets/${userId}`],
  });

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <WalletIcon className="mr-2 h-8 w-8" />
          محفظتي
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <WalletActions userId={userId} />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>أصول المحفظة</CardTitle>
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
                ) : (
                  <div className="space-y-4">
                    {walletAssets.map((asset: any) => (
                      <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <span className="font-medium">{asset.symbol.substring(0, 1)}</span>
                          </div>
                          <div>
                            <h3 className="font-medium">{asset.name}</h3>
                            <p className="text-sm text-gray-500">{asset.balance} {asset.symbol}</p>
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