import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketAsset } from "@shared/schema";
import { CryptoIcon } from "@/components/crypto-icon";
import { formatCurrency, formatPercent } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface MarketsPageProps {
  userId: number;
}

export default function Markets({ userId }: MarketsPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const { data: marketData, isLoading } = useQuery<MarketAsset[]>({
    queryKey: ['/api/market'],
  });
  
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar className={sidebarOpen ? 'block' : 'hidden'} />
      
      {/* Main Content */}
      <main className="w-full lg:pl-64 flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <Topbar onToggleSidebar={toggleSidebar} />
        
        {/* Content */}
        <div className="p-4 lg:p-6 flex-1 overflow-auto bg-neutral-100">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Cryptocurrency Markets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-500 mb-4">
                Track the latest prices and market movements for major cryptocurrencies. Prices update automatically every minute.
              </p>
              
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All Assets</TabsTrigger>
                  <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
                  <TabsTrigger value="losers">Top Losers</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-4">
                  <div className="divide-y divide-neutral-200">
                    {isLoading ? (
                      // Skeleton loading state
                      Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="py-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="ml-3">
                              <Skeleton className="h-5 w-24" />
                              <Skeleton className="h-4 w-14 mt-1" />
                            </div>
                          </div>
                          <div className="text-right">
                            <Skeleton className="h-5 w-24 ml-auto" />
                            <Skeleton className="h-4 w-16 mt-1 ml-auto" />
                          </div>
                        </div>
                      ))
                    ) : (
                      marketData?.map((asset) => (
                        <div key={asset.id} className="py-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <CryptoIcon symbol={asset.symbol} name={asset.name} />
                            <div className="ml-3">
                              <div className="font-medium">{asset.name}</div>
                              <div className="text-neutral-500 text-sm">{asset.symbol}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(asset.price)}</div>
                            <div className={`text-sm ${asset.priceChangePercentage24h >= 0 ? 'text-success' : 'text-error'}`}>
                              {formatPercent(asset.priceChangePercentage24h)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="gainers" className="mt-4">
                  <div className="divide-y divide-neutral-200">
                    {!isLoading && marketData
                      ?.filter(asset => asset.priceChangePercentage24h > 0)
                      .sort((a, b) => b.priceChangePercentage24h - a.priceChangePercentage24h)
                      .map((asset) => (
                        <div key={asset.id} className="py-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <CryptoIcon symbol={asset.symbol} name={asset.name} />
                            <div className="ml-3">
                              <div className="font-medium">{asset.name}</div>
                              <div className="text-neutral-500 text-sm">{asset.symbol}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(asset.price)}</div>
                            <div className="text-sm text-success">
                              {formatPercent(asset.priceChangePercentage24h)}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="losers" className="mt-4">
                  <div className="divide-y divide-neutral-200">
                    {!isLoading && marketData
                      ?.filter(asset => asset.priceChangePercentage24h < 0)
                      .sort((a, b) => a.priceChangePercentage24h - b.priceChangePercentage24h)
                      .map((asset) => (
                        <div key={asset.id} className="py-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <CryptoIcon symbol={asset.symbol} name={asset.name} />
                            <div className="ml-3">
                              <div className="font-medium">{asset.name}</div>
                              <div className="text-neutral-500 text-sm">{asset.symbol}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(asset.price)}</div>
                            <div className="text-sm text-error">
                              {formatPercent(asset.priceChangePercentage24h)}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Mobile Nav */}
      <MobileNav />
    </div>
  );
}
