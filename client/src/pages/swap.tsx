import { Container } from "@/components/ui/container";
import { TokenSwap } from "@/components/swap/token-swap";
import { MarketList } from "@/components/market/market-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface SwapPageProps {
  userId: number;
}

export default function SwapPage({ userId }: SwapPageProps) {
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const handleSelectAsset = (asset: any) => {
    setSelectedAsset(asset);
    // يمكن هنا القيام بتمرير البيانات إلى مكون التبادل أو فتح نافذة منبثقة
    console.log("Selected asset for trading:", asset);
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-6">تبادل العملات المشفرة</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TokenSwap userId={userId} />
          </div>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="market">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="market">سوق العملات</TabsTrigger>
                <TabsTrigger value="popular">الأكثر تداولاً</TabsTrigger>
              </TabsList>
              
              <TabsContent value="market">
                <MarketList userId={userId} onSelectAsset={handleSelectAsset} />
              </TabsContent>
              
              <TabsContent value="popular">
                <div className="bg-card p-8 rounded-lg border text-center">
                  <h3 className="text-xl font-bold mb-2">العملات الأكثر تداولاً</h3>
                  <p className="text-muted-foreground">
                    ستظهر هنا قائمة بالعملات الأكثر تداولاً استناداً إلى حجم التداول والشعبية.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Container>
  );
}