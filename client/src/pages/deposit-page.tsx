import { useState } from "react";
import { Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { MainNav } from "@/components/navigation/main-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Wallet, 
  DollarSign, 
  Bitcoin, 
  QrCode, 
  Copy, 
  Check, 
  ArrowRight,
  Info
} from "lucide-react";
import rimLogo from "@assets/rim.png";

export default function DepositPage() {
  const { toast } = useToast();
  const [paymentTab, setPaymentTab] = useState("crypto");
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [cryptoAddress, setCryptoAddress] = useState("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kjx9uqmvpn");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // محاكاة لعملية الإيداع
  const handleDeposit = () => {
    // التحقق من إدخال المبلغ
    if (!depositAmount || isNaN(parseFloat(depositAmount)) || parseFloat(depositAmount) <= 0) {
      toast({
        title: "خطأ في المبلغ",
        description: "يرجى إدخال مبلغ صحيح للإيداع",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // محاكاة طلب API للإيداع (سيتم استبداله بطلب API حقيقي)
    setTimeout(() => {
      toast({
        title: "تم تقديم طلب الإيداع",
        description: `تم بدء عملية إيداع ${depositAmount} ${selectedCurrency} بنجاح. سيتم تحديث رصيد حسابك قريبًا.`,
      });
      setIsLoading(false);
      setDepositAmount("");
      // إعادة تعيين الحقول حسب طريقة الدفع
      if (paymentTab === "card") {
        setCardNumber("");
        setExpiryDate("");
        setCvv("");
        setCardholderName("");
      } else if (paymentTab === "paypal") {
        setPaypalEmail("");
      }
    }, 2000);
  };

  // نسخ عنوان المحفظة
  const copyToClipboard = () => {
    navigator.clipboard.writeText(cryptoAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "تم النسخ",
      description: "تم نسخ عنوان المحفظة إلى الحافظة",
    });
  };

  // الحصول على عنوان وصورة QR للعملة المشفرة المحددة
  const getCryptoDetails = (symbol: string) => {
    // في التطبيق الحقيقي، هذه المعلومات ستأتي من الخادم
    const cryptoDetails: Record<string, { address: string, name: string }> = {
      BTC: { 
        address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kjx9uqmvpn", 
        name: "Bitcoin" 
      },
      ETH: { 
        address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", 
        name: "Ethereum" 
      },
      BNB: { 
        address: "bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2", 
        name: "Binance Coin" 
      },
      SOL: { 
        address: "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH", 
        name: "Solana" 
      }
    };
    
    setCryptoAddress(cryptoDetails[symbol]?.address || "");
    return cryptoDetails[symbol];
  };

  // استدعاء الدالة عند تغيير العملة المشفرة
  const handleCryptoChange = (value: string) => {
    setSelectedCrypto(value);
    getCryptoDetails(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* شريط التنقل العلوي */}
      <header className="bg-white py-4 px-6 border-b shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <img src={rimLogo} alt="RimToken Logo" className="w-8 h-8 rounded-full object-cover border-2 border-amber-500" />
                <span className="font-bold text-amber-700 ml-2">RimToken</span>
              </a>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link href="/">
              <a className="text-gray-800 hover:text-gray-900 font-medium">الرئيسية</a>
            </Link>
            <Link href="/wallet">
              <a className="text-gray-800 hover:text-gray-900 font-medium">المحفظة</a>
            </Link>
            <Link href="/swap">
              <a className="text-gray-800 hover:text-gray-900 font-medium">التبديل</a>
            </Link>
            <Link href="/team">
              <a className="text-gray-800 hover:text-gray-900 font-medium">فريق العمل</a>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">إيداع الأموال</h1>
            <p className="text-gray-600">
              اختر طريقة الإيداع المناسبة لك وأضف الأموال إلى محفظتك بسهولة وأمان
            </p>
          </div>

          <Tabs 
            value={paymentTab} 
            onValueChange={setPaymentTab}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <TabsList className="w-full grid grid-cols-3 p-0 h-auto">
              <TabsTrigger 
                value="crypto" 
                className="py-4 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-amber-500"
              >
                <Bitcoin className="mr-2 h-5 w-5" />
                العملات المشفرة
              </TabsTrigger>
              <TabsTrigger 
                value="card" 
                className="py-4 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-amber-500"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                بطاقة الائتمان
              </TabsTrigger>
              <TabsTrigger 
                value="paypal" 
                className="py-4 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-amber-500"
              >
                <Wallet className="mr-2 h-5 w-5" />
                PayPal
              </TabsTrigger>
            </TabsList>

            {/* قسم العملات المشفرة */}
            <TabsContent value="crypto" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">إيداع العملات المشفرة</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="crypto-select">اختر العملة</Label>
                      <Select value={selectedCrypto} onValueChange={handleCryptoChange}>
                        <SelectTrigger id="crypto-select">
                          <SelectValue placeholder="اختر العملة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                          <SelectItem value="BNB">Binance Coin (BNB)</SelectItem>
                          <SelectItem value="SOL">Solana (SOL)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="crypto-amount">المبلغ</Label>
                      <div className="relative">
                        <Input
                          id="crypto-amount"
                          placeholder="0.00"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          type="number"
                          min="0"
                          step="0.0001"
                          className="pl-8"
                        />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          {selectedCrypto}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg mb-6">
                    <div className="flex items-start">
                      <Info className="w-5 h-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium">ملاحظات مهمة:</p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>أرسل العملات المشفرة فقط عبر شبكة {selectedCrypto}.</li>
                          <li>سيتم تحديث رصيدك بعد تأكيد المعاملة على الشبكة.</li>
                          <li>تأكد من إرسال المبلغ إلى العنوان الصحيح.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">عنوان الإيداع</h3>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 text-center">
                    <div className="inline-block mx-auto mb-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                      <QrCode className="w-32 h-32 mx-auto" />
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-500">عنوان محفظة {selectedCrypto}:</span>
                      <div className="mt-1 bg-gray-50 p-3 rounded-md flex items-center">
                        <p className="text-xs md:text-sm text-gray-700 font-mono truncate flex-1">
                          {cryptoAddress}
                        </p>
                        <button 
                          onClick={copyToClipboard}
                          className="ml-2 p-1.5 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-500" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleDeposit} 
                    disabled={!depositAmount || isLoading} 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    {isLoading ? "جاري المعالجة..." : "تأكيد الإيداع"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* قسم بطاقة الائتمان */}
            <TabsContent value="card" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">الإيداع ببطاقة الائتمان</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="card-amount">المبلغ</Label>
                      <div className="relative">
                        <Input
                          id="card-amount"
                          placeholder="0.00"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          type="number"
                          min="0"
                          step="0.01"
                          className="pl-8"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                            <SelectTrigger className="border-0 p-0 h-auto bg-transparent text-gray-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="card-name">اسم صاحب البطاقة</Label>
                      <Input
                        id="card-name"
                        placeholder="الاسم كما يظهر على البطاقة"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="card-number">رقم البطاقة</Label>
                      <Input
                        id="card-number"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry-date">تاريخ الانتهاء</Label>
                        <Input
                          id="expiry-date"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">ملخص الدفع</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">المبلغ:</span>
                      <span className="font-medium">{depositAmount || "0.00"} {selectedCurrency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">رسوم المعالجة (2.5%):</span>
                      <span className="font-medium">
                        {depositAmount ? (parseFloat(depositAmount) * 0.025).toFixed(2) : "0.00"} {selectedCurrency}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>المجموع:</span>
                        <span>
                          {depositAmount ? (parseFloat(depositAmount) * 1.025).toFixed(2) : "0.00"} {selectedCurrency}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <RadioGroup defaultValue="card">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="card" id="card-type-1" />
                        <Label htmlFor="card-type-1" className="flex items-center">
                          <svg className="h-6 w-8 mr-2" viewBox="0 0 32 21">
                            <path
                              d="M26.58 21H2.42A2.4 2.4 0 0 1 0 18.62V2.38A2.4 2.4 0 0 1 2.42 0h24.16A2.4 2.4 0 0 1 29 2.38v16.24A2.4 2.4 0 0 1 26.58 21z"
                              fill="#00579f"
                            />
                            <path
                              d="M10.5 8.39l-2.96 6.9H5.33L3.87 9.67a.63.63 0 0 0-.35-.51 5.75 5.75 0 0 0-1.4-.47l.03-.3h2.43a.8.8 0 0 1 .78.67l.72 3.8 1.77-4.47h2.16zm7.34 4.67c.01-1.73-2.4-1.82-2.38-2.6.01-.23.23-.48.72-.55.24-.03.93-.06 1.7.3l.3-1.41a4.84 4.84 0 0 0-1.6-.3c-1.68 0-2.87.89-2.88 2.17-.01.94.85 1.47 1.49 1.79.66.32.88.53.88.82-.01.45-.53.64-1.02.65-.86.02-1.35-.23-1.75-.42l-.31 1.45c.4.18 1.14.34 1.91.35 1.8 0 2.97-.88 2.98-2.24zm4.46 2.23h1.75l-1.53-6.9h-1.61c-.36 0-.67.2-.8.52l-2.84 6.38h1.99l.4-1.09h2.43l.21 1.09zm-2.1-2.48l1-2.75.58 2.75h-1.58zm-9.8-4.42L9.07 15.3h-1.9l1.33-6.9h1.9z"
                              fill="#fff"
                            />
                          </svg>
                          Visa
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse mt-2">
                        <RadioGroupItem value="mastercard" id="card-type-2" />
                        <Label htmlFor="card-type-2" className="flex items-center">
                          <svg className="h-6 w-8 mr-2" viewBox="0 0 32 21">
                            <path
                              d="M26.58 21H2.42A2.4 2.4 0 0 1 0 18.62V2.38A2.4 2.4 0 0 1 2.42 0h24.16A2.4 2.4 0 0 1 29 2.38v16.24A2.4 2.4 0 0 1 26.58 21z"
                              fill="#16366f"
                            />
                            <path
                              d="M11.64 17.78h5.73V3.22h-5.73v14.56z"
                              fill="#fff"
                            />
                            <path
                              d="M12.14 10.5c0-2.95 1.39-5.58 3.52-7.28A8.9 8.9 0 0 0 10.5 1.5C5.8 1.5 2 5.3 2 10s3.8 8.5 8.5 8.5a8.9 8.9 0 0 0 5.16-1.72c-2.13-1.7-3.52-4.33-3.52-7.28z"
                              fill="#d9222a"
                            />
                            <path
                              d="M27 10.5c0 4.7-3.8 8.5-8.5 8.5a8.9 8.9 0 0 1-5.16-1.72c2.13-1.7 3.52-4.33 3.52-7.28S16.47 4.42 14.34 2.72A8.9 8.9 0 0 1 18.5 1.5c4.7 0 8.5 3.8 8.5 8.5z"
                              fill="#ee9f2d"
                            />
                          </svg>
                          MasterCard
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button 
                    onClick={handleDeposit} 
                    disabled={!depositAmount || !cardNumber || !expiryDate || !cvv || !cardholderName || isLoading}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    {isLoading ? "جاري المعالجة..." : "إجراء الدفع"}
                  </Button>

                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                      المدفوعات آمنة ومشفرة
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* قسم PayPal */}
            <TabsContent value="paypal" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">الإيداع عبر PayPal</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="paypal-amount">المبلغ</Label>
                      <div className="relative">
                        <Input
                          id="paypal-amount"
                          placeholder="0.00"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          type="number"
                          min="0"
                          step="0.01"
                          className="pl-8"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                            <SelectTrigger className="border-0 p-0 h-auto bg-transparent text-gray-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="paypal-email">البريد الإلكتروني على PayPal</Label>
                      <Input
                        id="paypal-email"
                        type="email"
                        placeholder="your-email@example.com"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg mt-6">
                    <div className="flex items-start">
                      <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p>سيتم تحويلك إلى موقع PayPal لإكمال عملية الدفع بأمان.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="mb-8 flex justify-center">
                    <div className="bg-[#f0f6fe] p-4 rounded-xl inline-flex items-center">
                      <svg width="80" height="20" viewBox="0 0 124 33" xmlns="http://www.w3.org/2000/svg">
                        <path d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.97-1.142-2.694-1.746-4.985-1.746zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906zm19.654-.079h-3.275a.57.57 0 0 0-.563.481l-.145.916-.23-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zm22.007-6.374h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z" fill="#253B80" />
                        <path d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.746-4.983-1.746zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.359.42.468 1.044.331 1.906zm19.653-.079h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zm8.426-12.219l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.34.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z" fill="#179BD7" />
                        <path d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2c-.696.494-1.523.869-2.458 1.109-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035z" fill="#253B80" />
                        <path d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z" fill="#179BD7" />
                        <path d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.177h-7.352a1.172 1.172 0 0 0-1.159.992L8.05 17.605l-.045.289a1.336 1.336 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.594 6.594 0 0 0-1.017-.429 9.045 9.045 0 0 0-.277-.087z" fill="#222D65" />
                        <path d="M9.614 7.699a1.169 1.169 0 0 1 1.159-.991h7.352c.871 0 1.684.057 2.426.177a9.757 9.757 0 0 1 1.481.353c.365.121.704.264 1.017.429.368-2.347-.003-3.945-1.272-5.392C20.378.682 17.853 0 14.622 0h-9.38c-.66 0-1.223.48-1.325 1.133L.01 25.898a.806.806 0 0 0 .795.932h5.791l1.454-9.225 1.564-9.906z" fill="#253B80" />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-4">ملخص الإيداع</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">المبلغ:</span>
                      <span className="font-medium">{depositAmount || "0.00"} {selectedCurrency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">رسوم المعالجة (3.4%):</span>
                      <span className="font-medium">
                        {depositAmount ? (parseFloat(depositAmount) * 0.034).toFixed(2) : "0.00"} {selectedCurrency}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>المجموع:</span>
                        <span>
                          {depositAmount ? (parseFloat(depositAmount) * 1.034).toFixed(2) : "0.00"} {selectedCurrency}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleDeposit} 
                    disabled={!depositAmount || !paypalEmail || isLoading}
                    className="w-full bg-[#0070ba] hover:bg-[#003087] text-white flex items-center justify-center"
                  >
                    {isLoading ? (
                      "جاري المعالجة..."
                    ) : (
                      <>
                        <span>الدفع بواسطة</span>
                        <svg className="ml-2" width="80" height="20" viewBox="0 0 124 33" xmlns="http://www.w3.org/2000/svg">
                          <path d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.97-1.142-2.694-1.746-4.985-1.746zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906zm19.654-.079h-3.275a.57.57 0 0 0-.563.481l-.145.916-.23-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zm22.007-6.374h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z" fill="#ffffff" />
                        </svg>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">الأسئلة الشائعة</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">ما هي الحدود الدنيا والقصوى للإيداع؟</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    الحد الأدنى للإيداع هو 10 دولارات أمريكية أو ما يعادلها بالعملات الأخرى. 
                    الحد الأقصى للإيداع يعتمد على طريقة الدفع ومستوى التحقق من حسابك.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">ما هي رسوم الإيداع؟</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    رسوم الإيداع تختلف حسب طريقة الدفع:
                    <br />- العملات المشفرة: بدون رسوم
                    <br />- بطاقة الائتمان: 2.5%
                    <br />- PayPal: 3.4%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">متى سيظهر الإيداع في حسابي؟</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    الإيداعات ببطاقة الائتمان و PayPal تظهر فورًا في حسابك. 
                    بينما تتطلب الإيداعات بالعملات المشفرة تأكيدات على الشبكة، 
                    وقد تستغرق من 10 دقائق إلى ساعة حسب الشبكة والازدحام.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}