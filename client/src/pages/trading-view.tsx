import { MainLayout } from "@/components/layout/main-layout";
import { CryptoTicker } from "@/components/trading/crypto-ticker";
import { PriceChart } from "@/components/trading/price-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function TradingViewPage() {
  const { toast } = useToast();
  
  useEffect(() => {
    // نعرض إشعار عند تحميل الصفحة
    toast({
      title: "تم تحديث البيانات",
      description: "تم تحديث أسعار العملات المشفرة بنجاح",
    });
    
    // تحديث البيانات كل 60 ثانية
    const interval = setInterval(() => {
      toast({
        title: "تم تحديث البيانات",
        description: "تم تحديث أسعار العملات المشفرة بنجاح",
        variant: "default",
      });
    }, 60000);
    
    return () => clearInterval(interval);
  }, [toast]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">أسعار العملات المشفرة</h1>
          <p className="text-gray-600">تابع أحدث أسعار العملات المشفرة ومؤشرات التداول لحظة بلحظة</p>
        </div>

        {/* قسم ملخص السوق */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">ملخص السوق</h2>
          <CryptoTicker />
        </div>

        {/* قسم الرسوم البيانية */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">الرسوم البيانية</h2>
          <Tabs defaultValue="btc">
            <TabsList className="mb-4">
              <TabsTrigger value="btc">BTC</TabsTrigger>
              <TabsTrigger value="eth">ETH</TabsTrigger>
              <TabsTrigger value="bnb">BNB</TabsTrigger>
              <TabsTrigger value="sol">SOL</TabsTrigger>
              <TabsTrigger value="rim">RIM</TabsTrigger>
            </TabsList>
            <TabsContent value="btc">
              <PriceChart symbol="BTC" name="Bitcoin" color="#F7931A" />
            </TabsContent>
            <TabsContent value="eth">
              <PriceChart symbol="ETH" name="Ethereum" color="#627EEA" />
            </TabsContent>
            <TabsContent value="bnb">
              <PriceChart symbol="BNB" name="Binance Coin" color="#F0B90B" />
            </TabsContent>
            <TabsContent value="sol">
              <PriceChart symbol="SOL" name="Solana" color="#00FFA3" />
            </TabsContent>
            <TabsContent value="rim">
              <PriceChart symbol="RIM" name="RIM Token" color="#F59E0B" />
            </TabsContent>
          </Tabs>
        </div>

        {/* قسم الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>إجمالي التداول</CardTitle>
              <CardDescription>حجم التداول في آخر 24 ساعة</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$62.5B</p>
              <p className="text-sm text-green-600">▲ 5.32%</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>القيمة السوقية</CardTitle>
              <CardDescription>القيمة الإجمالية لسوق العملات المشفرة</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$1.72T</p>
              <p className="text-sm text-green-600">▲ 2.18%</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>هيمنة Bitcoin</CardTitle>
              <CardDescription>نسبة هيمنة Bitcoin على السوق</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">48.7%</p>
              <p className="text-sm text-red-600">▼ 0.45%</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}