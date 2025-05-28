import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Wallet, 
  Send, 
  Download, 
  Eye, 
  EyeOff, 
  Copy, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Coins
} from 'lucide-react';

interface WalletBalance {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  icon: string;
  network: string;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  symbol: string;
  from: string;
  to: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  hash: string;
}

export default function WalletPage() {
  const { toast } = useToast();
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletAddress, setWalletAddress] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('RIM');

  // Initialize wallet data
  useEffect(() => {
    initializeWallet();
  }, []);

  const initializeWallet = () => {
    // Generate wallet address (this would normally be done securely)
    const address = '0x' + Math.random().toString(16).substr(2, 40);
    setWalletAddress(address);

    // Mock balances data
    const mockBalances: WalletBalance[] = [
      {
        symbol: 'RIM',
        name: 'RimToken',
        balance: 2500.50,
        usdValue: 31256.25,
        icon: '🟡',
        network: 'Ethereum'
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: 5.25,
        usdValue: 13545.00,
        icon: '⟠',
        network: 'Ethereum'
      },
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        balance: 0.5,
        usdValue: 21625.00,
        icon: '₿',
        network: 'Bitcoin'
      },
      {
        symbol: 'BNB',
        name: 'BNB',
        balance: 10.0,
        usdValue: 3152.00,
        icon: '🟨',
        network: 'BSC'
      }
    ];

    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'receive',
        amount: 100,
        symbol: 'RIM',
        from: '0x1234...5678',
        to: address,
        timestamp: new Date(Date.now() - 86400000),
        status: 'completed',
        hash: '0xabc123...def456'
      },
      {
        id: '2',
        type: 'send',
        amount: 0.1,
        symbol: 'ETH',
        from: address,
        to: '0x9876...5432',
        timestamp: new Date(Date.now() - 172800000),
        status: 'completed',
        hash: '0x789abc...123def'
      },
      {
        id: '3',
        type: 'receive',
        amount: 500,
        symbol: 'RIM',
        from: '0x5555...9999',
        to: address,
        timestamp: new Date(Date.now() - 259200000),
        status: 'completed',
        hash: '0x456789...abcdef'
      }
    ];

    setBalances(mockBalances);
    setTransactions(mockTransactions);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ العنوان إلى الحافظة",
    });
  };

  const handleSend = () => {
    if (!sendAmount || !sendAddress) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال جميع البيانات المطلوبة",
        variant: "destructive",
      });
      return;
    }

    // Mock send transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'send',
      amount: parseFloat(sendAmount),
      symbol: selectedCurrency,
      from: walletAddress,
      to: sendAddress,
      timestamp: new Date(),
      status: 'pending',
      hash: '0x' + Math.random().toString(16).substr(2, 64)
    };

    setTransactions([newTransaction, ...transactions]);
    setSendAmount('');
    setSendAddress('');

    toast({
      title: "تم إرسال المعاملة",
      description: `تم إرسال ${sendAmount} ${selectedCurrency} بنجاح`,
    });
  };

  const getTotalBalance = () => {
    return balances.reduce((total, balance) => total + balance.usdValue, 0);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Wallet className="h-8 w-8 text-primary" />
              محفظة RimToken
            </h1>
            <p className="text-muted-foreground mt-2">
              إدارة عملاتك المشفرة بأمان وسهولة
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            إنشاء محفظة جديدة
          </Button>
        </div>

        {/* Wallet Overview */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>إجمالي الرصيد</span>
              <Shield className="h-5 w-5" />
            </CardTitle>
            <CardDescription className="text-blue-100">
              عنوان المحفظة: {formatAddress(walletAddress)}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(walletAddress)}
                className="ml-2 text-white hover:bg-white/20"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">
              ${formatNumber(getTotalBalance())}
            </div>
            <div className="text-blue-100">
              {balances.length} عملة مختلفة
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="balances" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="balances" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              الأرصدة
            </TabsTrigger>
            <TabsTrigger value="send" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              إرسال
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4" />
              المعاملات
            </TabsTrigger>
          </TabsList>

          {/* Balances Tab */}
          <TabsContent value="balances" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {balances.map((balance) => (
                <Card key={balance.symbol} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{balance.icon}</span>
                        <div>
                          <div>{balance.symbol}</div>
                          <div className="text-sm font-normal text-muted-foreground">
                            {balance.name}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">{balance.network}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">
                        {formatNumber(balance.balance)} {balance.symbol}
                      </div>
                      <div className="text-lg text-muted-foreground">
                        ${formatNumber(balance.usdValue)}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="flex-1">
                        <Send className="h-4 w-4 mr-1" />
                        إرسال
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-1" />
                        استقبال
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Send Tab */}
          <TabsContent value="send" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إرسال العملات المشفرة</CardTitle>
                <CardDescription>
                  أرسل عملاتك المشفرة إلى عنوان آخر بأمان
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">اختر العملة</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                  >
                    {balances.map((balance) => (
                      <option key={balance.symbol} value={balance.symbol}>
                        {balance.symbol} - {balance.name} ({formatNumber(balance.balance)} متاح)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">المبلغ</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">عنوان المستقبل</label>
                  <Input
                    placeholder="0x..."
                    value={sendAddress}
                    onChange={(e) => setSendAddress(e.target.value)}
                  />
                </div>

                <Separator />

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">تنبيه أمني</span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    تأكد من صحة عنوان المستقبل. المعاملات غير قابلة للإلغاء.
                  </p>
                </div>

                <Button onClick={handleSend} className="w-full" size="lg">
                  إرسال المعاملة
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تاريخ المعاملات</CardTitle>
                <CardDescription>
                  جميع معاملاتك الواردة والصادرة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'send' 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {transaction.type === 'send' ? 
                            <ArrowUpRight className="h-4 w-4" /> : 
                            <ArrowDownRight className="h-4 w-4" />
                          }
                        </div>
                        <div>
                          <div className="font-medium">
                            {transaction.type === 'send' ? 'إرسال' : 'استقبال'} {transaction.symbol}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.type === 'send' 
                              ? `إلى ${formatAddress(transaction.to)}`
                              : `من ${formatAddress(transaction.from)}`
                            }
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.timestamp.toLocaleDateString('ar')} - {transaction.timestamp.toLocaleTimeString('ar')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${
                          transaction.type === 'send' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.type === 'send' ? '-' : '+'}{formatNumber(transaction.amount)} {transaction.symbol}
                        </div>
                        <Badge 
                          variant={transaction.status === 'completed' ? 'default' : 
                                  transaction.status === 'pending' ? 'secondary' : 'destructive'}
                        >
                          {transaction.status === 'completed' ? 'مكتملة' :
                           transaction.status === 'pending' ? 'في الانتظار' : 'فاشلة'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}