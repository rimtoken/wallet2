import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, RefreshCw, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// مكون تبادل العملات المبسط مع التركيز على الوظائف الأساسية
export default function SwapSimplifiedPage() {
  const { toast } = useToast();
  const [fromToken, setFromToken] = useState("BTC");
  const [toToken, setToToken] = useState("ETH");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [isSwapping, setIsSwapping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // بيانات توضيحية للأصول (في التطبيق الحقيقي ستأتي من API)
  const assets = [
    { id: 1, name: "Bitcoin", symbol: "BTC", balance: 0.05, price: 50000 },
    { id: 2, name: "Ethereum", symbol: "ETH", balance: 1.2, price: 2500 },
    { id: 3, name: "Binance Coin", symbol: "BNB", balance: 10, price: 350 },
    { id: 4, name: "Solana", symbol: "SOL", balance: 25, price: 110 },
    { id: 5, name: "Cardano", symbol: "ADA", balance: 500, price: 0.40 },
    { id: 6, name: "Polkadot", symbol: "DOT", balance: 100, price: 5.75 },
  ];
  
  // حساب قيمة العملة المستلمة عند تغيير قيمة العملة المرسلة
  useEffect(() => {
    if (!fromAmount || !fromToken || !toToken) {
      setToAmount("");
      return;
    }
    
    const fromAsset = assets.find(asset => asset.symbol === fromToken);
    const toAsset = assets.find(asset => asset.symbol === toToken);
    
    if (!fromAsset || !toAsset) {
      setToAmount("");
      return;
    }
    
    const fromPrice = fromAsset.price;
    const toPrice = toAsset.price;
    
    const amount = parseFloat(fromAmount);
    const exchangeRate = fromPrice / toPrice;
    const calculatedAmount = (amount * exchangeRate).toFixed(6);
    
    setToAmount(calculatedAmount);
  }, [fromAmount, fromToken, toToken]);
  
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
  const getAvailableBalance = (symbol: string): number => {
    const asset = assets.find(asset => asset.symbol === symbol);
    return asset ? asset.balance : 0;
  };
  
  // تنفيذ التبادل
  const handleSwap = () => {
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
    const fromAsset = assets.find(asset => asset.symbol === fromToken);
    const toAsset = assets.find(asset => asset.symbol === toToken);
    
    try {
      setIsSwapping(true);
      
      // محاكاة لطلب API (في التطبيق الحقيقي سيتم إرسال طلب فعلي)
      setTimeout(() => {
        toast({
          title: "تم التبادل بنجاح",
          description: `تم تبديل ${fromAmount} ${fromToken} إلى ${toAmount} ${toToken}`,
        });
        
        // إعادة تعيين قيم الإدخال
        setFromAmount("");
        setToAmount("");
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
  
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">تبادل العملات المشفرة</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* مكون التبادل */}
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
                      {assets.map((asset) => (
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
                      {assets.map((asset) => (
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
                  <div className="flex justify-between mt-1">
                    <span className="text-slate-500">رسوم التبادل (0.1%)</span>
                    <span className="font-medium">{(parseFloat(fromAmount) * 0.001).toFixed(6)} {fromToken}</span>
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
        
        {/* الجانب الثاني - معلومات السوق */}
        <Card>
          <CardHeader>
            <CardTitle>سوق العملات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <span className="font-medium">{asset.symbol.substring(0, 1)}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{asset.name}</h3>
                      <p className="text-sm text-gray-500">{asset.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${asset.price.toLocaleString()}</p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="mt-1"
                      onClick={() => {
                        setFromToken(asset.symbol);
                        setFromAmount("1");
                      }}
                    >
                      تبادل
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}