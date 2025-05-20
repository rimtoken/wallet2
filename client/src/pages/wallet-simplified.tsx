import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Wallet className="mr-2 h-8 w-8" />
        محفظتي
      </h1>
      
      {/* ملخص المحفظة */}
      <Card className="mb-6 bg-gradient-to-r from-amber-50 to-amber-100">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-medium text-gray-700">إجمالي قيمة المحفظة</h2>
              <p className="text-3xl font-bold">${totalPortfolioValue.toLocaleString()}</p>
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
                className="gap-1"
                onClick={() => setActiveTab("deposit")}
              >
                <ArrowDownRight className="h-4 w-4" /> إيداع
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
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