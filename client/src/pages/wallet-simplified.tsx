import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownRight, Wallet, ArrowDown, Download, ExternalLink, Twitter, MessageCircle, Shield, Github, Instagram } from "lucide-react";
import { AchievementsSummary } from "@/components/achievements/achievements-summary";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import rimLogo from "@assets/rim.png";
import rimTokenLogo from "@assets/469063470_586302450756454_5997633519251771466_n.jpg";

// مكون المحفظة المبسط مع التركيز على الوظائف الأساسية
export default function WalletSimplifiedPage() {
  const { toast } = useToast();
  const [selectedCurrency, setSelectedCurrency] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [activeTab, setActiveTab] = useState("assets");
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);
  
  // بيانات توضيحية للأصول (في التطبيق الحقيقي ستأتي من API)
  const walletAssets = [
    { id: 1, name: "Bitcoin", symbol: "BTC", balance: 0.05, value: 2500, priceChangePercentage24h: 5.2 },
    { id: 2, name: "Ethereum", symbol: "ETH", balance: 1.2, value: 3000, priceChangePercentage24h: -2.1 },
    { id: 3, name: "Binance Coin", symbol: "BNB", balance: 10, value: 3500, priceChangePercentage24h: 1.8 },
    { id: 4, name: "Solana", symbol: "SOL", balance: 25, value: 2750, priceChangePercentage24h: -0.5 },
  ];
  
  // بيانات توضيحية للمعاملات (في التطبيق الحقيقي ستأتي من API)
  const transactions = [
    { id: 1, type: "deposit", asset: "BTC", amount: 0.02, value: 1000, timestamp: "2025-05-18T14:30:00Z", status: "completed" },
    { id: 2, type: "withdraw", asset: "ETH", amount: 0.5, value: 1250, timestamp: "2025-05-17T10:15:00Z", status: "completed" },
    { id: 3, type: "swap", asset: "BNB", amount: 5, value: 1750, timestamp: "2025-05-16T09:45:00Z", status: "completed" },
  ];
  
  // حساب إجمالي قيمة المحفظة
  const totalPortfolioValue = walletAssets.reduce((total, asset) => total + asset.value, 0);
  
  // معالجة عملية السحب
  const handleWithdraw = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "تحذير",
        description: "يرجى إدخال مبلغ صحيح",
        variant: "destructive",
      });
      return;
    }
    
    if (!address) {
      toast({
        title: "تحذير",
        description: "يرجى إدخال عنوان للمستلم",
        variant: "destructive",
      });
      return;
    }
    
    const selectedAsset = walletAssets.find(asset => asset.symbol === selectedCurrency);
    if (!selectedAsset) return;
    
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > selectedAsset.balance) {
      toast({
        title: "رصيد غير كافٍ",
        description: `ليس لديك رصيد كافٍ من ${selectedCurrency} لإتمام هذه العملية`,
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessingTransaction(true);
    
    // محاكاة لطلب API (في التطبيق الحقيقي سيتم إرسال طلب فعلي)
    setTimeout(() => {
      toast({
        title: "تمت العملية بنجاح",
        description: `تم سحب ${amount} ${selectedCurrency} إلى العنوان المحدد`,
      });
      setAmount("");
      setAddress("");
      setIsProcessingTransaction(false);
    }, 1500);
  };
  
  // معالجة عملية الإيداع
  const handleDeposit = () => {
    toast({
      title: "عنوان الإيداع",
      description: `يمكنك إيداع ${selectedCurrency} إلى العنوان: 0x1234...5678`,
    });
  };
  
  return (
    <div className="min-h-screen">
      {/* شريط التنقل العلوي */}
      <header className="bg-white py-4 px-6 border-b shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/auth" className="text-gray-500 hover:text-gray-700 text-sm">تسجيل الدخول -</Link>
            <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-md px-4 py-1">
              Register
            </Button>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-gray-800 hover:text-gray-900 font-medium">Home</Link>
            <Link href="/wallet" className="text-gray-800 hover:text-gray-900 font-medium">Wallet</Link>
            <Link href="/swap" className="text-gray-800 hover:text-gray-900 font-medium">Swap</Link>
            <Link href="/market" className="text-gray-800 hover:text-gray-900 font-medium">Market</Link>
            <Link href="/news" className="text-gray-800 hover:text-gray-900 font-medium">News</Link>
            <Link href="/price" className="text-gray-800 hover:text-gray-900 font-medium">Price</Link>
            <Link href="/team" className="text-gray-800 hover:text-gray-900 font-medium">Team</Link>
            <Link href="/about" className="text-gray-800 hover:text-gray-900 font-medium">About</Link>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center ml-4">
              <span className="font-bold text-amber-700 mr-2">RimToken</span>
              <img src={rimLogo} alt="RimToken Logo" className="w-8 h-8 rounded-full object-cover border-2 border-amber-500" />
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي - قسم المحفظة */}
      <div className="bg-[#4e53e0] py-16">
        <div className="container mx-auto py-12 px-6 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <div className="text-white">
              <h2 className="text-5xl font-bold mb-2">rimtoken crypto</h2>
              <h1 className="text-6xl font-bold mb-6">
                Wallet:<br />
                Anonymous<br />
                Bitcoin Wallet
              </h1>
              <p className="text-xl mb-8 max-w-xl">
                Wallet is the best Crypto Wallet without Verification, ID or
                KYC. Get the most Secure & Anonymous Non-Custodial Crypto
                Wallet Now.
              </p>
              
              <div className="flex space-x-4 mb-8">
                <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#4e53e0] hover:bg-blue-100">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#4e53e0] hover:bg-blue-100">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#4e53e0] hover:bg-blue-100">
                  <Shield className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#4e53e0] hover:bg-blue-100">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#4e53e0] hover:bg-blue-100">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
              
              <div className="flex space-x-4">
                <a href="#" className="flex items-center">
                  <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" className="h-12" />
                </a>
                <a href="#" className="flex items-center">
                  <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download on the App Store" className="h-10" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80" alt="Mobile App Mockup" className="rounded-xl shadow-2xl mx-auto max-w-full" />
            </div>
          </div>
        </div>
      </div>
      
      {/* شريط العملات */}
      <div className="bg-[#ff7518] text-white p-3 flex justify-center items-center">
        <span className="font-bold ml-2">rimtoken</span>
        <span className="mx-2">Wallet token sale is live! • Go to</span>
        <a href="https://rimtokenwallet.com" className="underline mx-2">rimtokenwallet.com</a>
        <span>to buy $</span>
      </div>
      
      {/* قسم مزايا المحفظة */}
      <div id="features" className="bg-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">قم بإدارة أصولك الرقمية</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              أنشئ محفظتك اللامركزية بدون تحقق من الهوية أو إثبات شخصية
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-medium text-gray-800">إجمالي قيمة المحفظة</h2>
                <p className="text-3xl font-bold text-[#4e53e0]">${totalPortfolioValue.toLocaleString()}</p>
              </div>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={() => setActiveTab("withdraw")}
                >
                  <ArrowUpRight className="h-4 w-4" /> سحب
                </Button>
                <Button 
                  size="sm" 
                  className="bg-[#4e53e0] hover:bg-[#3a3eb8] gap-1"
                  onClick={() => setActiveTab("deposit")}
                >
                  <ArrowDownRight className="h-4 w-4" /> إيداع
                </Button>
              </div>
            </div>
          </div>
      
      {/* علامات التبويب الرئيسية */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="assets">الأصول</TabsTrigger>
          <TabsTrigger value="transactions">المعاملات</TabsTrigger>
          <TabsTrigger value="deposit">إيداع</TabsTrigger>
          <TabsTrigger value="withdraw">سحب</TabsTrigger>
        </TabsList>
        
        {/* محتوى تبويب الأصول */}
        <TabsContent value="assets">
          <Card>
            <CardHeader>
              <CardTitle>أصول المحفظة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {walletAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        asset.priceChangePercentage24h >= 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <span className="font-medium">{asset.symbol.substring(0, 1)}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{asset.name}</h3>
                        <p className="text-sm text-gray-500">
                          {asset.balance} {asset.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${asset.value.toLocaleString()}</p>
                      <p className={`text-xs ${asset.priceChangePercentage24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {asset.priceChangePercentage24h >= 0 ? '+' : ''}{asset.priceChangePercentage24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* محتوى تبويب المعاملات */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>تاريخ المعاملات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        tx.type === 'deposit' ? 'bg-green-100 text-green-700' : 
                        tx.type === 'withdraw' ? 'bg-red-100 text-red-700' : 
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {tx.type === 'deposit' ? (
                          <ArrowDownRight className="h-5 w-5" />
                        ) : tx.type === 'withdraw' ? (
                          <ArrowUpRight className="h-5 w-5" />
                        ) : (
                          <span className="font-medium">S</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {tx.type === 'deposit' ? 'إيداع' : 
                           tx.type === 'withdraw' ? 'سحب' : 'تبادل'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {tx.amount} {tx.asset}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${tx.value.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {tx.status === 'completed' ? 'مكتملة' : 'معلقة'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* محتوى تبويب الإيداع */}
        <TabsContent value="deposit">
          <Card>
            <CardHeader>
              <CardTitle>إيداع عملات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">اختر العملة</label>
                  <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العملة" />
                    </SelectTrigger>
                    <SelectContent>
                      {walletAssets.map(asset => (
                        <SelectItem key={asset.id} value={asset.symbol}>
                          {asset.name} ({asset.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-6 rounded-lg bg-gray-50 text-center">
                  <p className="text-lg font-bold mb-2">عنوان الإيداع الخاص بك</p>
                  <p className="font-mono text-sm bg-white p-3 rounded border mb-4">
                    0x1234567890abcdef1234567890abcdef12345678
                  </p>
                  <div className="w-40 h-40 bg-white mx-auto mb-4 border rounded-lg"></div>
                  <p className="text-sm text-gray-500">
                    استخدم العنوان أعلاه لإيداع {selectedCurrency} في محفظتك.
                    تأكد من إرسال {selectedCurrency} فقط إلى هذا العنوان.
                  </p>
                </div>
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handleDeposit}
                >
                  نسخ عنوان الإيداع
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* محتوى تبويب السحب */}
        <TabsContent value="withdraw">
          <Card>
            <CardHeader>
              <CardTitle>سحب عملات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">اختر العملة</label>
                  <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العملة" />
                    </SelectTrigger>
                    <SelectContent>
                      {walletAssets.map(asset => (
                        <SelectItem key={asset.id} value={asset.symbol}>
                          {asset.name} ({asset.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCurrency && (
                    <p className="text-sm text-gray-500 mt-1">
                      الرصيد المتاح: {walletAssets.find(a => a.symbol === selectedCurrency)?.balance || 0} {selectedCurrency}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">المبلغ</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">عنوان المستلم</label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="أدخل عنوان المحفظة"
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  disabled={isProcessingTransaction}
                  onClick={handleWithdraw}
                >
                  {isProcessingTransaction ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جارِ المعالجة...
                    </span>
                  ) : (
                    "سحب"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}