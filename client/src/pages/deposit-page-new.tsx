import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
import { AppLayout } from "@/components/layout/app-layout";

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
    <AppLayout 
      currentPage="/deposit"
      breadcrumbs={[
        { label: "المحفظة", href: "/wallet" },
        { label: "إيداع الأموال" }
      ]}
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">إيداع الأموال</h1>
        <p className="text-gray-600 mb-8">اختر طريقة الإيداع المناسبة لك وأضف الأموال إلى محفظتك بسهولة وأمان</p>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <Tabs defaultValue="crypto" value={paymentTab} onValueChange={setPaymentTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="crypto" className="flex items-center">
                <Bitcoin className="w-4 h-4 mr-2" />
                <span>العملات المشفرة</span>
              </TabsTrigger>
              <TabsTrigger value="card" className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                <span>بطاقة ائتمان</span>
              </TabsTrigger>
              <TabsTrigger value="paypal" className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                <span>PayPal</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="crypto" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>إيداع بالعملات المشفرة</CardTitle>
                      <CardDescription>
                        أرسل العملات المشفرة من محفظة خارجية إلى محفظتك في RimToken
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="crypto-select">اختر العملة</Label>
                        <Select 
                          value={selectedCrypto} 
                          onValueChange={handleCryptoChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر العملة المشفرة" />
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
                        <Label htmlFor="amount">المبلغ</Label>
                        <div className="relative">
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            className="pl-12"
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none text-gray-500 font-medium">
                            {selectedCrypto}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>عنوان المحفظة</CardTitle>
                      <CardDescription>
                        امسح رمز QR أو انسخ العنوان أدناه
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                      <div className="bg-gray-100 p-4 rounded-lg w-48 h-48 flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-gray-800" />
                      </div>
                      
                      <div className="w-full">
                        <div className="flex items-center">
                          <Input
                            readOnly
                            value={cryptoAddress}
                            className="font-mono text-sm"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={copyToClipboard}
                            className="ml-2"
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          <Info className="inline-block w-4 h-4 mr-1" />
                          تأكد من إرسال {selectedCrypto} فقط إلى هذا العنوان
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="card" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>إيداع ببطاقة الائتمان</CardTitle>
                  <CardDescription>
                    استخدم بطاقة الائتمان الخاصة بك لإيداع الأموال في محفظتك
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="cardholder-name">اسم حامل البطاقة</Label>
                      <Input
                        id="cardholder-name"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        placeholder="كما هو مكتوب على البطاقة"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="card-number">رقم البطاقة</Label>
                      <Input
                        id="card-number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="expiry-date">تاريخ الانتهاء</Label>
                      <Input
                        id="expiry-date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="000"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="currency">العملة</Label>
                      <Select 
                        value={selectedCurrency} 
                        onValueChange={setSelectedCurrency}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر العملة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                          <SelectItem value="EUR">يورو (EUR)</SelectItem>
                          <SelectItem value="GBP">جنيه إسترليني (GBP)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="amount-card">المبلغ</Label>
                      <div className="relative">
                        <Input
                          id="amount-card"
                          type="number"
                          placeholder="0.00"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="pl-12"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none text-gray-500 font-medium">
                          {selectedCurrency}
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label>نوع البطاقة</Label>
                      <RadioGroup defaultValue="visa" className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="visa" id="visa" />
                          <Label htmlFor="visa" className="font-normal">Visa</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mastercard" id="mastercard" />
                          <Label htmlFor="mastercard" className="font-normal">Mastercard</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="md:col-span-2 border-t pt-4 mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>المبلغ:</span>
                        <span>{depositAmount ? parseFloat(depositAmount).toFixed(2) : "0.00"} {selectedCurrency}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>رسوم البطاقة (2.5%):</span>
                        <span>{depositAmount ? (parseFloat(depositAmount) * 0.025).toFixed(2) : "0.00"} {selectedCurrency}</span>
                      </div>
                      <div className="flex justify-between font-medium mt-2">
                        <span>المجموع:</span>
                        <span>{depositAmount ? (parseFloat(depositAmount) * 1.025).toFixed(2) : "0.00"} {selectedCurrency}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button 
                onClick={handleDeposit}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جارٍ المعالجة...
                  </span>
                ) : (
                  <span className="flex items-center">
                    إجراء الدفع
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="paypal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>إيداع باستخدام PayPal</CardTitle>
                  <CardDescription>
                    استخدم حسابك في PayPal لإيداع الأموال في محفظتك
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="paypal-email">البريد الإلكتروني المرتبط بـ PayPal</Label>
                      <Input
                        id="paypal-email"
                        type="email"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        placeholder="your-email@example.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="currency-paypal">العملة</Label>
                      <Select 
                        value={selectedCurrency} 
                        onValueChange={setSelectedCurrency}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر العملة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                          <SelectItem value="EUR">يورو (EUR)</SelectItem>
                          <SelectItem value="GBP">جنيه إسترليني (GBP)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="amount-paypal">المبلغ</Label>
                      <div className="relative">
                        <Input
                          id="amount-paypal"
                          type="number"
                          placeholder="0.00"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="pl-12"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none text-gray-500 font-medium">
                          {selectedCurrency}
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 border-t pt-4 mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>المبلغ:</span>
                        <span>{depositAmount ? parseFloat(depositAmount).toFixed(2) : "0.00"} {selectedCurrency}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>رسوم PayPal (3.4%):</span>
                        <span>{depositAmount ? (parseFloat(depositAmount) * 0.034).toFixed(2) : "0.00"} {selectedCurrency}</span>
                      </div>
                      <div className="flex justify-between font-medium mt-2">
                        <span>المجموع:</span>
                        <span>{depositAmount ? (parseFloat(depositAmount) * 1.034).toFixed(2) : "0.00"} {selectedCurrency}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button 
                onClick={handleDeposit}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جارٍ المعالجة...
                  </span>
                ) : (
                  <span className="flex items-center">
                    الدفع بواسطة PayPal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
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
    </AppLayout>
  );
}