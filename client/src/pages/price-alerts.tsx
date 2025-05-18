import { MainLayout } from "@/components/layout/main-layout";
import { PriceAlertDialog, CryptoCurrency, AlertCondition, PriceAlert } from "@/components/alerts/price-alert-dialog";
import { AlertsList } from "@/components/alerts/alerts-list";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { BellRing, Info } from "lucide-react";

// بيانات افتراضية للعملات - ستأتي من API في التطبيق الحقيقي
const mockCryptoCurrencies: CryptoCurrency[] = [
  { id: "bitcoin", symbol: "btc", name: "Bitcoin", currentPrice: 58432.21 },
  { id: "ethereum", symbol: "eth", name: "Ethereum", currentPrice: 3456.78 },
  { id: "binancecoin", symbol: "bnb", name: "Binance Coin", currentPrice: 567.89 },
  { id: "solana", symbol: "sol", name: "Solana", currentPrice: 123.45 },
  { id: "cardano", symbol: "ada", name: "Cardano", currentPrice: 1.23 },
  { id: "polkadot", symbol: "dot", name: "Polkadot", currentPrice: 21.34 },
  { id: "ripple", symbol: "xrp", name: "XRP", currentPrice: 0.87 },
  { id: "dogecoin", symbol: "doge", name: "Dogecoin", currentPrice: 0.15 },
  { id: "avalanche", symbol: "avax", name: "Avalanche", currentPrice: 42.67 },
  { id: "rimtoken", symbol: "rim", name: "RIM Token", currentPrice: 95.46 },
];

// للتجربة فقط - في التطبيق الحقيقي ستأتي من API
const mockUserAlerts: PriceAlert[] = [
  {
    id: "1",
    userId: 1,
    cryptoId: "bitcoin",
    cryptoSymbol: "btc",
    cryptoName: "Bitcoin",
    condition: AlertCondition.ABOVE,
    targetPrice: 60000,
    createdAt: new Date(),
    isActive: true,
  },
  {
    id: "2",
    userId: 1,
    cryptoId: "ethereum",
    cryptoSymbol: "eth",
    cryptoName: "Ethereum",
    condition: AlertCondition.BELOW,
    targetPrice: 3000,
    createdAt: new Date(),
    isActive: true,
  },
  {
    id: "3",
    userId: 1,
    cryptoId: "rimtoken",
    cryptoSymbol: "rim",
    cryptoName: "RIM Token",
    condition: AlertCondition.ABOVE,
    targetPrice: 100,
    createdAt: new Date(),
    isActive: false,
  },
];

export default function PriceAlertsPage() {
  const [currencies, setCurrencies] = useState<CryptoCurrency[]>(mockCryptoCurrencies);
  const [alerts, setAlerts] = useState<PriceAlert[]>(mockUserAlerts);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);
  const { toast } = useToast();

  // محاكاة جلب البيانات - في التطبيق الحقيقي ستكون من خلال React Query
  useEffect(() => {
    // محاكاة تأخير الشبكة
    const timer = setTimeout(() => {
      setCurrencies(mockCryptoCurrencies);
      setAlerts(mockUserAlerts);
      setIsLoadingAlerts(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // إنشاء تنبيه جديد
  const handleCreateAlert = async (newAlert: Omit<PriceAlert, "id" | "userId" | "createdAt" | "isActive">) => {
    // محاكاة طلب API
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const createdAlert: PriceAlert = {
          ...newAlert,
          id: `alert-${Date.now()}`,
          userId: 1, // في التطبيق الحقيقي سيكون من معلومات المستخدم المسجل
          createdAt: new Date(),
          isActive: true,
        };
        
        setAlerts((prevAlerts) => [...prevAlerts, createdAlert]);
        resolve();
      }, 500);
    });
  };

  // تبديل حالة التنبيه
  const handleToggleAlert = async (alertId: string, isActive: boolean) => {
    // محاكاة طلب API
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setAlerts((prevAlerts) =>
          prevAlerts.map((alert) =>
            alert.id === alertId ? { ...alert, isActive } : alert
          )
        );
        
        toast({
          title: `تم ${isActive ? 'تفعيل' : 'تعطيل'} التنبيه`,
          description: `تم ${isActive ? 'تفعيل' : 'تعطيل'} التنبيه بنجاح`,
        });
        
        resolve();
      }, 300);
    });
  };

  // حذف تنبيه
  const handleDeleteAlert = async (alertId: string) => {
    // محاكاة طلب API
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== alertId));
        
        toast({
          title: "تم حذف التنبيه",
          description: "تم حذف التنبيه بنجاح",
        });
        
        resolve();
      }, 300);
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">تنبيهات الأسعار</h1>
            <p className="text-gray-600">
              تتبع أسعار العملات المشفرة واحصل على تنبيهات عندما تصل إلى المستويات المحددة
            </p>
          </div>
          <PriceAlertDialog 
            currencies={currencies} 
            onCreateAlert={handleCreateAlert}
            userId={1} // في التطبيق الحقيقي سيكون من معلومات المستخدم المسجل
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <AlertsList 
              alerts={alerts}
              onToggleAlert={handleToggleAlert}
              onDeleteAlert={handleDeleteAlert}
              isLoading={isLoadingAlerts}
            />
          </div>
          
          <div className="lg:col-span-1">
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">كيف تعمل التنبيهات؟</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      تتيح لك تنبيهات الأسعار البقاء على اطلاع بتغيرات السوق دون الحاجة لمراقبة الأسعار باستمرار.
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <BellRing className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <span>سيتم إرسال إشعارات عندما يصل سعر العملة المشفرة إلى المستوى المحدد.</span>
                  </li>
                  <li className="flex gap-2">
                    <BellRing className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <span>يمكنك إنشاء تنبيهات متعددة لنفس العملة بمستويات سعر مختلفة.</span>
                  </li>
                  <li className="flex gap-2">
                    <BellRing className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <span>يمكنك تفعيل أو تعطيل أي تنبيه في أي وقت.</span>
                  </li>
                </ul>
                
                <div className="mt-5 pt-5 border-t border-amber-200">
                  <h4 className="font-medium mb-2">إعدادات الإشعارات</h4>
                  <p className="text-sm text-gray-600">
                    لتلقي الإشعارات، تأكد من السماح للمتصفح بإرسال الإشعارات أو قم بتنزيل تطبيق RimToken للجوال.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}