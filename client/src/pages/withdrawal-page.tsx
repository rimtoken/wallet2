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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Wallet, 
  DollarSign, 
  Bitcoin, 
  AlertTriangle, 
  ArrowRight,
  Info,
  Shield,
  Clock
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function WithdrawalPage() {
  const { toast } = useToast();
  const [withdrawalTab, setWithdrawalTab] = useState("crypto");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [withdrawalAddress, setWithdrawalAddress] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");

  // محاكاة عملية السحب
  const handleWithdrawal = () => {
    // التحقق من إدخال المبلغ
    if (!withdrawalAmount || isNaN(parseFloat(withdrawalAmount)) || parseFloat(withdrawalAmount) <= 0) {
      toast({
        title: "خطأ في المبلغ",
        description: "يرجى إدخال مبلغ صحيح للسحب",
        variant: "destructive",
      });
      return;
    }

    // التحقق من العنوان في حالة سحب العملات المشفرة
    if (withdrawalTab === "crypto" && !withdrawalAddress) {
      toast({
        title: "عنوان غير صالح",
        description: "يرجى إدخال عنوان محفظة صالح للسحب",
        variant: "destructive",
      });
      return;
    }

    // التحقق من رمز المصادقة الثنائية
    if (!twoFACode || twoFACode.length !== 6 || !/^\d+$/.test(twoFACode)) {
      toast({
        title: "رمز 2FA غير صالح",
        description: "يرجى إدخال رمز المصادقة الثنائية المكون من 6 أرقام",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // محاكاة طلب API للسحب (سيتم استبداله بطلب API حقيقي)
    setTimeout(() => {
      toast({
        title: "تم تقديم طلب السحب",
        description: `تم بدء عملية سحب ${withdrawalAmount} ${withdrawalTab === "crypto" ? selectedCrypto : selectedCurrency} بنجاح. ستتم معالجة طلبك قريبًا.`,
      });
      setIsLoading(false);
      setWithdrawalAmount("");
      setTwoFACode("");
      
      // إعادة تعيين الحقول حسب طريقة السحب
      if (withdrawalTab === "crypto") {
        setWithdrawalAddress("");
      } else if (withdrawalTab === "bank") {
        setBankAccountName("");
        setBankAccountNumber("");
        setBankName("");
        setSwiftCode("");
      } else if (withdrawalTab === "paypal") {
        setPaypalEmail("");
      }
    }, 2000);
  };

  // حساب الرسوم المطبقة
  const calculateFee = () => {
    if (!withdrawalAmount || isNaN(parseFloat(withdrawalAmount))) return 0;
    
    const amount = parseFloat(withdrawalAmount);
    
    // الرسوم حسب طريقة السحب
    if (withdrawalTab === "crypto") {
      // رسوم شبكة العملات المشفرة تختلف حسب العملة
      const cryptoFees = {
        BTC: 0.0005,
        ETH: 0.005,
        BNB: 0.01,
        SOL: 0.01
      };
      
      return cryptoFees[selectedCrypto as keyof typeof cryptoFees];
    } else if (withdrawalTab === "bank") {
      // رسوم ثابتة للتحويلات البنكية
      return 25; // بالدولار
    } else if (withdrawalTab === "paypal") {
      // نسبة من المبلغ للسحب عبر PayPal
      return amount * 0.025;
    }
    
    return 0;
  };

  // حساب المبلغ الصافي بعد خصم الرسوم
  const calculateNetAmount = () => {
    if (!withdrawalAmount || isNaN(parseFloat(withdrawalAmount))) return 0;
    
    const amount = parseFloat(withdrawalAmount);
    const fee = calculateFee();
    
    return Math.max(0, amount - fee);
  };

  // الحصول على رمز العملة الحالية
  const getCurrentCurrency = () => {
    return withdrawalTab === "crypto" ? selectedCrypto : selectedCurrency;
  };

  return (
    <AppLayout 
      currentPage="/withdrawal"
      breadcrumbs={[
        { label: "المحفظة", href: "/wallet" },
        { label: "سحب الأموال" }
      ]}
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">سحب الأموال</h1>
        <p className="text-gray-600 mb-6">اختر طريقة السحب المناسبة لك واسحب الأموال من محفظتك بسهولة وأمان</p>

        <Alert className="mb-8 border-amber-500 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800">تنبيه أمان</AlertTitle>
          <AlertDescription className="text-amber-700">
            تأكد دائمًا من صحة تفاصيل السحب قبل تأكيد العملية. لا يمكن التراجع عن عمليات السحب بمجرد معالجتها.
          </AlertDescription>
        </Alert>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <Tabs defaultValue="crypto" value={withdrawalTab} onValueChange={setWithdrawalTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="crypto" className="flex items-center">
                <Bitcoin className="w-4 h-4 mr-2" />
                <span>العملات المشفرة</span>
              </TabsTrigger>
              <TabsTrigger value="bank" className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                <span>تحويل بنكي</span>
              </TabsTrigger>
              <TabsTrigger value="paypal" className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                <span>PayPal</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="crypto" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>سحب العملات المشفرة</CardTitle>
                  <CardDescription>
                    سحب العملات المشفرة إلى محفظتك الخارجية
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="crypto-select">اختر العملة</Label>
                    <Select 
                      value={selectedCrypto} 
                      onValueChange={setSelectedCrypto}
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
                    <Label htmlFor="amount-crypto">المبلغ</Label>
                    <div className="relative">
                      <Input
                        id="amount-crypto"
                        type="number"
                        placeholder="0.00"
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                        className="pl-12"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none text-gray-500 font-medium">
                        {selectedCrypto}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      الرصيد المتاح: 0.0215 {selectedCrypto}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="wallet-address">عنوان المحفظة</Label>
                    <Input
                      id="wallet-address"
                      placeholder={`أدخل عنوان محفظة ${selectedCrypto} الخاص بك`}
                      value={withdrawalAddress}
                      onChange={(e) => setWithdrawalAddress(e.target.value)}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      <Info className="inline-block w-4 h-4 mr-1" />
                      تأكد من أن العنوان صحيح ويتوافق مع شبكة {selectedCrypto}
                    </p>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>المبلغ:</span>
                      <span>{withdrawalAmount ? parseFloat(withdrawalAmount).toFixed(8) : "0.00"} {selectedCrypto}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>رسوم الشبكة:</span>
                      <span>{calculateFee()} {selectedCrypto}</span>
                    </div>
                    <div className="flex justify-between font-medium mt-2">
                      <span>المبلغ الصافي:</span>
                      <span>{calculateNetAmount().toFixed(8)} {selectedCrypto}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bank" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>سحب عبر التحويل البنكي</CardTitle>
                  <CardDescription>
                    سحب الأموال إلى حسابك البنكي
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="bank-name">اسم البنك</Label>
                      <Input
                        id="bank-name"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="أدخل اسم البنك"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="account-name">اسم صاحب الحساب</Label>
                      <Input
                        id="account-name"
                        value={bankAccountName}
                        onChange={(e) => setBankAccountName(e.target.value)}
                        placeholder="أدخل اسم صاحب الحساب البنكي"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="account-number">رقم الحساب</Label>
                      <Input
                        id="account-number"
                        value={bankAccountNumber}
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                        placeholder="أدخل رقم الحساب البنكي"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="swift-code">رمز SWIFT/BIC</Label>
                      <Input
                        id="swift-code"
                        value={swiftCode}
                        onChange={(e) => setSwiftCode(e.target.value)}
                        placeholder="أدخل رمز SWIFT/BIC"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="currency-bank">العملة</Label>
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
                      <Label htmlFor="amount-bank">المبلغ</Label>
                      <div className="relative">
                        <Input
                          id="amount-bank"
                          type="number"
                          placeholder="0.00"
                          value={withdrawalAmount}
                          onChange={(e) => setWithdrawalAmount(e.target.value)}
                          className="pl-12"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none text-gray-500 font-medium">
                          {selectedCurrency}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        الرصيد المتاح: 1,250.00 {selectedCurrency}
                      </p>
                    </div>
                    
                    <div className="md:col-span-2 border-t pt-4 mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>المبلغ:</span>
                        <span>{withdrawalAmount ? parseFloat(withdrawalAmount).toFixed(2) : "0.00"} {selectedCurrency}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>رسوم التحويل البنكي:</span>
                        <span>25.00 {selectedCurrency}</span>
                      </div>
                      <div className="flex justify-between font-medium mt-2">
                        <span>المبلغ الصافي:</span>
                        <span>{calculateNetAmount().toFixed(2)} {selectedCurrency}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="paypal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>سحب إلى PayPal</CardTitle>
                  <CardDescription>
                    سحب الأموال إلى حسابك في PayPal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
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
                    
                    <div>
                      <Label htmlFor="amount-paypal">المبلغ</Label>
                      <div className="relative">
                        <Input
                          id="amount-paypal"
                          type="number"
                          placeholder="0.00"
                          value={withdrawalAmount}
                          onChange={(e) => setWithdrawalAmount(e.target.value)}
                          className="pl-12"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none text-gray-500 font-medium">
                          {selectedCurrency}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        الرصيد المتاح: 1,250.00 {selectedCurrency}
                      </p>
                    </div>
                    
                    <div className="md:col-span-2 border-t pt-4 mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>المبلغ:</span>
                        <span>{withdrawalAmount ? parseFloat(withdrawalAmount).toFixed(2) : "0.00"} {selectedCurrency}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>رسوم PayPal (2.5%):</span>
                        <span>{withdrawalAmount ? (parseFloat(withdrawalAmount) * 0.025).toFixed(2) : "0.00"} {selectedCurrency}</span>
                      </div>
                      <div className="flex justify-between font-medium mt-2">
                        <span>المبلغ الصافي:</span>
                        <span>{calculateNetAmount().toFixed(2)} {selectedCurrency}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* قسم المصادقة الثنائية */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">التحقق الأمني</CardTitle>
              <CardDescription>
                يرجى إدخال رمز المصادقة الثنائية للمتابعة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 space-x-reverse">
                <Shield className="text-amber-500 h-10 w-10" />
                <div>
                  <h4 className="font-medium">مصادقة ثنائية (2FA)</h4>
                  <p className="text-sm text-gray-500">تحقق إضافي مطلوب لحماية حسابك</p>
                </div>
              </div>
              <div>
                <Label htmlFor="2fa-code">رمز المصادقة الثنائية</Label>
                <Input
                  id="2fa-code"
                  placeholder="أدخل رمز 2FA المكون من 6 أرقام"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value)}
                  maxLength={6}
                />
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-4">
            <Button 
              onClick={handleWithdrawal}
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
                  تأكيد السحب
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="flex items-start space-x-3 space-x-reverse">
                <Clock className="text-amber-500 h-5 w-5 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">وقت المعالجة المتوقع</h4>
                  <ul className="text-sm text-amber-700 mt-2 space-y-1">
                    <li>العملات المشفرة: 10 دقائق إلى ساعة حسب ازدحام الشبكة</li>
                    <li>التحويل البنكي: 1-3 أيام عمل</li>
                    <li>PayPal: خلال 24 ساعة</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">الأسئلة الشائعة</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">ما هي الحدود الدنيا والقصوى للسحب؟</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    الحد الأدنى للسحب يختلف حسب طريقة السحب:
                    <br />- العملات المشفرة: 0.001 BTC، 0.01 ETH، 0.1 BNB، 1 SOL
                    <br />- التحويل البنكي: 100 دولار أمريكي
                    <br />- PayPal: 50 دولار أمريكي
                    <br /><br />
                    الحد الأقصى للسحب يعتمد على مستوى التحقق من حسابك والطريقة المستخدمة.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">هل يمكنني إلغاء طلب السحب؟</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    يمكنك إلغاء طلب السحب فقط إذا كان لا يزال في حالة "قيد المعالجة". بمجرد أن يتغير الوضع إلى "تمت الموافقة" أو "تم الإرسال"، لا يمكن إلغاؤه.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">لماذا تطلبون رمز المصادقة الثنائية؟</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    المصادقة الثنائية (2FA) هي طبقة أمان إضافية لحماية حسابك وأموالك. نطلب دائمًا التحقق من خلال 2FA عند سحب الأموال لضمان أن صاحب الحساب الحقيقي هو من يقوم بالعملية.
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