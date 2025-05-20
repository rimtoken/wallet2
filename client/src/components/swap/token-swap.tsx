import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowDown, RefreshCw, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface TokenSwapProps {
  userId: number;
}

export function TokenSwap({ userId }: TokenSwapProps) {
  const { toast } = useToast();
  const [fromToken, setFromToken] = useState<string>("");
  const [toToken, setToToken] = useState<string>("");
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [slippage, setSlippage] = useState<number>(0.5);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // استعلام لجلب بيانات الأصول المتاحة
  const { data: assets, isLoading: isLoadingAssets } = useQuery({
    queryKey: ["/api/assets"],
  });

  // استعلام لجلب بيانات المحفظة
  const { data: walletAssets, isLoading: isLoadingWallet } = useQuery({
    queryKey: [`/api/wallets/${userId}`],
  });

  // تعيين القيم الافتراضية عند تحميل البيانات
  useEffect(() => {
    if (assets && assets.length > 0 && !fromToken) {
      setFromToken(assets[0].symbol);
    }
    
    if (assets && assets.length > 1 && !toToken) {
      setToToken(assets[1].symbol);
    }
  }, [assets, fromToken, toToken]);

  // حساب قيمة العملة المستلمة عند تغيير قيمة العملة المرسلة
  useEffect(() => {
    if (!fromAmount || !fromToken || !toToken || !assets) return;
    
    const fromAsset = assets.find((asset: any) => asset.symbol === fromToken);
    const toAsset = assets.find((asset: any) => asset.symbol === toToken);
    
    if (!fromAsset || !toAsset) return;
    
    const fromPrice = parseFloat(fromAsset.currentPrice);
    const toPrice = parseFloat(toAsset.currentPrice);
    
    if (fromPrice && toPrice) {
      const amount = parseFloat(fromAmount);
      const exchangeRate = fromPrice / toPrice;
      const calculatedAmount = (amount * exchangeRate).toFixed(6);
      setToAmount(calculatedAmount);
    }
  }, [fromAmount, fromToken, toToken, assets]);

  // تبديل العملات
  const handleSwitch = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    
    setFromToken(toToken);
    setFromAmount(toAmount);
    setToToken(tempToken);
    setToAmount(tempAmount);
  };

  // الحصول على الرصيد المتاح للعملة المختارة
  const getAvailableBalance = (symbol: string) => {
    if (!walletAssets) return 0;
    
    const asset = walletAssets.find((asset: any) => asset.symbol === symbol);
    return asset ? asset.balance : 0;
  };

  // تنفيذ التبادل
  const handleSwap = async () => {
    // التحقق من الرصيد
    const balance = getAvailableBalance(fromToken);
    const amount = parseFloat(fromAmount);
    
    if (amount > balance) {
      toast({
        title: "رصيد غير كافٍ",
        description: `ليس لديك رصيد كافٍ من ${fromToken} لإتمام هذه العملية`,
        variant: "destructive",
      });
      return;
    }
    
    // التحقق من أن المبلغ أكبر من الصفر
    if (amount <= 0) {
      toast({
        title: "قيمة غير صالحة",
        description: "يرجى إدخال قيمة أكبر من الصفر",
        variant: "destructive",
      });
      return;
    }

    // الحصول على معلومات العملات المختارة
    const fromAsset = assets.find((asset: any) => asset.symbol === fromToken);
    const toAsset = assets.find((asset: any) => asset.symbol === toToken);
    
    try {
      setIsSwapping(true);
      
      // إنشاء بيانات المعاملة
      const transactionData = {
        userId,
        type: "swap",
        assetId: fromAsset.id,
        amount: fromAmount,
        toAssetId: toAsset.id,
        toAmount: toAmount,
        status: "completed",
        fee: (parseFloat(fromAmount) * 0.001).toString(), // رسوم بنسبة 0.1%
      };

      // في تطبيق واقعي، هنا ستقوم بإرسال طلب إلى API
      // لمحاكاة سلوك API في هذا المثال
      
      setTimeout(() => {
        // محاكاة تأخير الشبكة
        toast({
          title: "تم التبادل بنجاح",
          description: `تم تبديل ${fromAmount} ${fromToken} إلى ${toAmount} ${toToken}`,
        });
        
        // إعادة تعيين قيم الإدخال
        setFromAmount("");
        setToAmount("");
        
        // تحديث بيانات المحفظة في تطبيق حقيقي
        // queryClient.invalidateQueries({ queryKey: [`/api/wallets/${userId}`] });
        // queryClient.invalidateQueries({ queryKey: [`/api/transactions/${userId}`] });
        
        setIsSwapping(false);
      }, 1500);
      
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "تعذر إتمام عملية التبادل، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
      setIsSwapping(false);
    }
  };

  if (isLoadingAssets || isLoadingWallet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>تبادل العملات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>تبادل العملات</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={20} />
        </Button>
      </CardHeader>
      <CardContent>
        {showSettings && (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="text-sm font-semibold mb-2">إعدادات التبادل</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label htmlFor="slippage">نسبة الانزلاق</Label>
                <Select
                  value={slippage.toString()}
                  onValueChange={(value) => setSlippage(parseFloat(value))}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="0.5%" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.1">0.1%</SelectItem>
                    <SelectItem value="0.5">0.5%</SelectItem>
                    <SelectItem value="1">1.0%</SelectItem>
                    <SelectItem value="2">2.0%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="auto-router">التوجيه التلقائي</Label>
                <Switch id="auto-router" defaultChecked />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* من العملة */}
          <div className="p-4 bg-slate-100 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-500">من</span>
              <span className="text-sm text-slate-500">
                الرصيد: {getAvailableBalance(fromToken).toFixed(6)} {fromToken}
              </span>
            </div>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.0"
                className="flex-1 text-xl font-medium bg-transparent border-none outline-none focus-visible:ring-0"
              />
              <Select value={fromToken} onValueChange={setFromToken}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="اختر العملة" />
                </SelectTrigger>
                <SelectContent>
                  {assets && assets.map((asset: any) => (
                    <SelectItem key={asset.symbol} value={asset.symbol}>
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <span className="text-xs font-medium">{asset.symbol.substring(0, 1)}</span>
                        </div>
                        {asset.symbol}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* زر التبديل */}
          <div className="flex justify-center -my-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white"
              onClick={handleSwitch}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>

          {/* إلى العملة */}
          <div className="p-4 bg-slate-100 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-500">إلى</span>
              <span className="text-sm text-slate-500">
                الرصيد: {getAvailableBalance(toToken).toFixed(6)} {toToken}
              </span>
            </div>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={toAmount}
                readOnly
                placeholder="0.0"
                className="flex-1 text-xl font-medium bg-transparent border-none outline-none focus-visible:ring-0"
              />
              <Select value={toToken} onValueChange={setToToken}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="اختر العملة" />
                </SelectTrigger>
                <SelectContent>
                  {assets && assets.map((asset: any) => (
                    <SelectItem key={asset.symbol} value={asset.symbol}>
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <span className="text-xs font-medium">{asset.symbol.substring(0, 1)}</span>
                        </div>
                        {asset.symbol}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* معلومات التبادل */}
          {fromAmount && toAmount && (
            <div className="p-3 bg-slate-50 rounded-lg text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-slate-500">سعر الصرف</span>
                <span className="font-medium">
                  1 {fromToken} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">الانزلاق المسموح</span>
                <span className="font-medium">{slippage}%</span>
              </div>
            </div>
          )}

          {/* زر التبادل */}
          <Button
            className="w-full py-6 text-lg"
            disabled={!fromAmount || !toAmount || fromToken === toToken || isSwapping}
            onClick={handleSwap}
          >
            {isSwapping ? (
              <>
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> جارِ التبادل...
              </>
            ) : fromToken === toToken ? (
              "اختر عملات مختلفة"
            ) : !fromAmount ? (
              "أدخل قيمة"
            ) : (
              "تبادل"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}