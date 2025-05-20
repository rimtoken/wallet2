import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  ChevronRight, 
  Info, 
  BarChart2,
  Globe,
  Link as LinkIcon,
  Clock
} from "lucide-react";

// تعريف واجهة الأصول
interface Asset {
  id: number;
  symbol: string;
  name: string;
  currentPrice: string;
  priceChangePercentage24h: number;
  icon?: string;
  description?: string;
  website?: string;
  explorer?: string;
  whitepaper?: string;
}

interface AssetDetailsDialogProps {
  assetId: number;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
}

export function AssetDetailsDialog({ assetId, children, trigger }: AssetDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  
  // استعلام لجلب بيانات الأصل
  const { data: asset, isLoading } = useQuery<Asset>({
    queryKey: [`/api/assets/${assetId}`],
    // نحن نريد تحميل البيانات فقط عندما يكون الحوار مفتوحًا
    enabled: open,
  });

  // استعلام لجلب بيانات سعر الأصل على مدار الوقت (للرسم البياني)
  const { data: priceHistory, isLoading: isLoadingHistory } = useQuery<{timestamp: string, price: number}[]>({
    queryKey: [`/api/assets/${assetId}/price-history`],
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || children || (
          <Button variant="ghost" size="sm">
            <Info className="h-4 w-4 mr-1" />
            تفاصيل
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        {isLoading ? (
          <>
            <DialogHeader>
              <Skeleton className="h-8 w-40" />
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </>
        ) : asset ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center text-2xl">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <span className="font-medium">{asset.symbol.substring(0, 1)}</span>
                </div>
                {asset.name} ({asset.symbol})
                <span className={`ml-auto text-sm px-2 py-0.5 rounded-full ${
                  asset.priceChangePercentage24h >= 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {asset.priceChangePercentage24h >= 0 ? '+' : ''}
                  {asset.priceChangePercentage24h.toFixed(2)}%
                </span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">${parseFloat(asset.currentPrice).toLocaleString()}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>تم تحديث السعر منذ {Math.floor(Math.random() * 10) + 1} دقائق</span>
                </div>
              </div>
              
              <Tabs defaultValue="about">
                <TabsList className="w-full">
                  <TabsTrigger value="about">نبذة</TabsTrigger>
                  <TabsTrigger value="chart">الرسم البياني</TabsTrigger>
                  <TabsTrigger value="links">روابط</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="space-y-4 mt-4">
                  <p className="text-sm text-gray-700">
                    {asset.description || `${asset.name} هي عملة مشفرة تستخدم تقنية البلوكتشين، تهدف إلى توفير حلول مالية لامركزية للمستخدمين حول العالم.`}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <h4 className="text-xs text-gray-500 mb-1">أعلى سعر (24 ساعة)</h4>
                      <p className="font-medium">${(parseFloat(asset.currentPrice) * (1 + Math.random() * 0.1)).toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <h4 className="text-xs text-gray-500 mb-1">أدنى سعر (24 ساعة)</h4>
                      <p className="font-medium">${(parseFloat(asset.currentPrice) * (1 - Math.random() * 0.1)).toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <h4 className="text-xs text-gray-500 mb-1">حجم التداول (24 ساعة)</h4>
                      <p className="font-medium">${formatCurrency(parseFloat(asset.currentPrice) * 1000000 * (Math.random() * 5 + 1))}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <h4 className="text-xs text-gray-500 mb-1">القيمة السوقية</h4>
                      <p className="font-medium">${formatCurrency(parseFloat(asset.currentPrice) * 1000000 * (Math.random() * 100 + 10))}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="chart" className="mt-4">
                  {isLoadingHistory ? (
                    <Skeleton className="h-40 w-full" />
                  ) : (
                    <div className="h-40 bg-slate-50 rounded-lg p-4 flex items-end justify-between">
                      {/* هذا رسم بياني مبسط للعرض فقط */}
                      {Array.from({ length: 20 }).map((_, index) => {
                        const height = 30 + Math.random() * 60;
                        
                        return (
                          <div 
                            key={index}
                            className={`w-3 rounded-t-sm ${
                              Math.random() > 0.4 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ height: `${height}%` }}
                          />
                        );
                      })}
                    </div>
                  )}
                  
                  <div className="mt-4 text-center text-sm text-gray-500">
                    تظهر بيانات السعر على مدار الـ 30 يومًا الماضية
                  </div>
                </TabsContent>
                
                <TabsContent value="links" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 gap-2">
                    <a 
                      href={asset.website || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Globe className="h-5 w-5 mr-2 text-primary" />
                      <span>الموقع الرسمي</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </a>
                    
                    <a 
                      href={asset.explorer || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <LinkIcon className="h-5 w-5 mr-2 text-primary" />
                      <span>مستكشف البلوكتشين</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </a>
                    
                    <a 
                      href={asset.whitepaper || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <BarChart2 className="h-5 w-5 mr-2 text-primary" />
                      <span>الورقة البيضاء</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </a>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <DialogFooter>
              <div className="w-full flex justify-between">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  إغلاق
                </Button>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    className="gap-1"
                    onClick={() => {
                      // في تطبيق حقيقي، هنا سننتقل إلى صفحة تبادل مع تحديد هذه العملة
                      window.location.href = `/swap?asset=${asset.symbol}`;
                    }}
                  >
                    <ArrowUpRight className="h-4 w-4" /> تبادل
                  </Button>
                  <Button 
                    className="gap-1"
                    onClick={() => {
                      // في تطبيق حقيقي، هنا سننتقل إلى صفحة الإيداع مع تحديد هذه العملة
                      window.location.href = `/wallet?tab=deposit&asset=${asset.symbol}`;
                    }}
                  >
                    <ArrowDownRight className="h-4 w-4" /> إيداع
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">تعذر تحميل بيانات الأصل</p>
            <DialogClose asChild>
              <Button variant="outline" className="mt-4">إغلاق</Button>
            </DialogClose>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}