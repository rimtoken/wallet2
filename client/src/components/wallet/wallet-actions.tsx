import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpRight, ArrowDownRight, Copy, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import QRCode from "qrcode";
import { useEffect } from "react";

interface WalletActionsProps {
  userId: number;
}

export function WalletActions({ userId }: WalletActionsProps) {
  const { toast } = useToast();
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // استعلام لجلب بيانات الأصول المتاحة
  const { data: assets, isLoading: isLoadingAssets } = useQuery({
    queryKey: ["/api/assets"],
  });

  // استعلام لجلب بيانات المحفظة
  const { data: walletAssets, isLoading: isLoadingWallet } = useQuery({
    queryKey: [`/api/wallets/${userId}`],
  });

  // تعيين القيمة الافتراضية للعملة المختارة
  useEffect(() => {
    if (walletAssets && walletAssets.length > 0 && !selectedAsset) {
      setSelectedAsset(walletAssets[0].symbol);
    }
  }, [walletAssets, selectedAsset]);

  // إنشاء رمز QR عند اختيار عملة للإيداع
  useEffect(() => {
    if (selectedAsset) {
      const asset = walletAssets?.find((asset: any) => asset.symbol === selectedAsset);
      if (asset) {
        const depositAddress = `${asset.address || "0x1234567890abcdef1234567890abcdef12345678"}`;
        
        QRCode.toDataURL(depositAddress)
          .then(url => {
            setQrCodeUrl(url);
          })
          .catch(err => {
            console.error("Error generating QR code:", err);
          });
      }
    }
  }, [selectedAsset, walletAssets]);

  // الحصول على الرصيد المتاح للعملة المختارة
  const getAvailableBalance = (symbol: string) => {
    if (!walletAssets) return 0;
    
    const asset = walletAssets.find((asset: any) => asset.symbol === symbol);
    return asset ? asset.balance : 0;
  };

  // الحصول على عنوان الإيداع للعملة المختارة
  const getDepositAddress = (symbol: string) => {
    if (!walletAssets) return "";
    
    const asset = walletAssets.find((asset: any) => asset.symbol === symbol);
    // في تطبيق حقيقي، ستحصل على العنوان الفعلي من قاعدة البيانات أو الخدمة
    return asset?.address || "0x1234567890abcdef1234567890abcdef12345678";
  };

  // نسخ العنوان إلى الحافظة
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    
    toast({
      title: "تم النسخ!",
      description: "تم نسخ العنوان إلى الحافظة.",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  // معالجة عملية السحب
  const handleWithdraw = async () => {
    // التحقق من صحة البيانات
    if (!selectedAsset) {
      toast({
        title: "اختر العملة",
        description: "يرجى اختيار العملة التي ترغب في سحبها",
        variant: "destructive",
      });
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "المبلغ غير صالح",
        description: "يرجى إدخال مبلغ صالح أكبر من 0",
        variant: "destructive",
      });
      return;
    }
    
    if (!address) {
      toast({
        title: "العنوان مطلوب",
        description: "يرجى إدخال عنوان المحفظة المستلمة",
        variant: "destructive",
      });
      return;
    }
    
    // التحقق من الرصيد
    const balance = getAvailableBalance(selectedAsset);
    const withdrawAmount = parseFloat(amount);
    
    if (withdrawAmount > balance) {
      toast({
        title: "رصيد غير كافٍ",
        description: `ليس لديك رصيد كافٍ من ${selectedAsset} لإتمام عملية السحب`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // في تطبيق حقيقي، هنا ستقوم بإرسال طلب إلى الخادم لتنفيذ عملية السحب
      // لأغراض العرض، سنقوم بمحاكاة عملية السحب بعد فترة زمنية
      
      setTimeout(() => {
        toast({
          title: "تم تنفيذ عملية السحب",
          description: `تم سحب ${amount} ${selectedAsset} بنجاح إلى العنوان المحدد`,
        });
        
        // إعادة تعيين قيم الإدخال
        setAmount("");
        setAddress("");
        
        // في تطبيق حقيقي، هنا ستقوم بتحديث بيانات المحفظة
        // queryClient.invalidateQueries({ queryKey: [`/api/wallets/${userId}`] });
        
        setIsProcessing(false);
      }, 2000);
      
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "تعذر إتمام عملية السحب، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  if (isLoadingAssets || isLoadingWallet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>عمليات المحفظة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>عمليات المحفظة</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="withdraw">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="withdraw">
              <ArrowUpRight className="mr-2 h-4 w-4" /> سحب
            </TabsTrigger>
            <TabsTrigger value="deposit">
              <ArrowDownRight className="mr-2 h-4 w-4" /> إيداع
            </TabsTrigger>
          </TabsList>
          
          {/* قسم السحب */}
          <TabsContent value="withdraw" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="withdraw-asset">العملة</Label>
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger id="withdraw-asset" className="mt-1.5">
                  <SelectValue placeholder="اختر العملة" />
                </SelectTrigger>
                <SelectContent>
                  {walletAssets && walletAssets.map((asset: any) => (
                    <SelectItem key={asset.symbol} value={asset.symbol}>
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <span className="text-xs font-medium">{asset.symbol.substring(0, 1)}</span>
                        </div>
                        {asset.symbol} - {asset.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedAsset && (
                <p className="text-sm text-gray-500 mt-1">
                  الرصيد: {getAvailableBalance(selectedAsset).toFixed(6)} {selectedAsset}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="withdraw-amount">المبلغ</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <Input
                  id="withdraw-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  min="0"
                  step="0.000001"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => selectedAsset && setAmount(getAvailableBalance(selectedAsset).toString())}
                >
                  الكل
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="withdraw-address">عنوان المستلم</Label>
              <Input
                id="withdraw-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="أدخل عنوان المحفظة المستلمة"
                className="mt-1.5"
              />
            </div>
            
            <Button
              className="w-full mt-4"
              disabled={!selectedAsset || !amount || !address || isProcessing}
              onClick={handleWithdraw}
            >
              {isProcessing ? "جارِ تنفيذ السحب..." : "سحب"}
            </Button>
          </TabsContent>
          
          {/* قسم الإيداع */}
          <TabsContent value="deposit" className="pt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="deposit-asset">العملة</Label>
                <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                  <SelectTrigger id="deposit-asset" className="mt-1.5">
                    <SelectValue placeholder="اختر العملة" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets && assets.map((asset: any) => (
                      <SelectItem key={asset.symbol} value={asset.symbol}>
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <span className="text-xs font-medium">{asset.symbol.substring(0, 1)}</span>
                          </div>
                          {asset.symbol} - {asset.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedAsset && (
                <div className="mt-4 space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg flex justify-center">
                    {qrCodeUrl && (
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code" 
                        className="w-48 h-48"
                      />
                    )}
                  </div>
                  
                  <div>
                    <Label>عنوان الإيداع</Label>
                    <div className="flex mt-1.5">
                      <Input
                        readOnly
                        value={getDepositAddress(selectedAsset)}
                        className="flex-1 font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="ml-2"
                        onClick={() => copyToClipboard(getDepositAddress(selectedAsset))}
                      >
                        {isCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      يرجى التأكد من استخدام شبكة {selectedAsset} عند إرسال الأموال إلى هذا العنوان.
                    </p>
                  </div>
                  
                  <div className="pt-4 text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">عرض تعليمات الإيداع</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>تعليمات إيداع {selectedAsset}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 p-4">
                          <div>
                            <h4 className="font-medium">الخطوة 1: اختر منصة الإرسال</h4>
                            <p className="text-sm text-gray-500">اختر منصة تبادل أو محفظة تدعم عملة {selectedAsset}.</p>
                          </div>
                          <div>
                            <h4 className="font-medium">الخطوة 2: انسخ العنوان</h4>
                            <p className="text-sm text-gray-500">انسخ عنوان محفظتك المعروض أعلاه.</p>
                          </div>
                          <div>
                            <h4 className="font-medium">الخطوة 3: أرسل العملات</h4>
                            <p className="text-sm text-gray-500">أدخل العنوان في منصة الإرسال وحدد المبلغ الذي ترغب في إرساله.</p>
                          </div>
                          <div>
                            <h4 className="font-medium">الخطوة 4: تأكيد المعاملة</h4>
                            <p className="text-sm text-gray-500">تأكد من صحة العنوان والمبلغ ثم أكد العملية.</p>
                          </div>
                          <div className="pt-2">
                            <p className="text-sm font-semibold text-amber-600">
                              ملاحظة مهمة: يرجى التأكد من إرسال العملات على الشبكة الصحيحة. قد يؤدي استخدام شبكة خاطئة إلى فقدان الأموال بشكل دائم.
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}