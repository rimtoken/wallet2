import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown, 
  DollarSign,
  BarChart3,
  Activity,
  Zap,
  Target
} from 'lucide-react';

interface TradingPair {
  id: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface Order {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  status: 'pending' | 'filled' | 'cancelled';
  timestamp: Date;
}

export default function TradingPage() {
  const { toast } = useToast();
  const [selectedPair, setSelectedPair] = useState<TradingPair>();
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [buyOrders, setBuyOrders] = useState<OrderBookEntry[]>([]);
  const [sellOrders, setSellOrders] = useState<OrderBookEntry[]>([]);

  const tradingPairs: TradingPair[] = [
    {
      id: 'RIM_USDT',
      symbol: 'RIM/USDT',
      baseAsset: 'RIM',
      quoteAsset: 'USDT',
      price: 12.45,
      change24h: 8.3,
      volume24h: 2540000,
      high24h: 13.20,
      low24h: 11.80
    },
    {
      id: 'BTC_USDT',
      symbol: 'BTC/USDT',
      baseAsset: 'BTC',
      quoteAsset: 'USDT',
      price: 43250,
      change24h: 2.5,
      volume24h: 890000,
      high24h: 44100,
      low24h: 42300
    },
    {
      id: 'ETH_USDT',
      symbol: 'ETH/USDT',
      baseAsset: 'ETH',
      quoteAsset: 'USDT',
      price: 2580,
      change24h: 1.8,
      volume24h: 1250000,
      high24h: 2650,
      low24h: 2520
    }
  ];

  useEffect(() => {
    setSelectedPair(tradingPairs[0]);
    generateOrderBook();
    generateMockOrders();
    
    // Simulate real-time price updates
    const interval = setInterval(() => {
      updatePrices();
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const generateOrderBook = () => {
    const currentPrice = selectedPair?.price || 12.45;
    
    // Generate buy orders (below current price)
    const buyOrdersData: OrderBookEntry[] = [];
    for (let i = 0; i < 10; i++) {
      const price = currentPrice - (i + 1) * 0.1;
      const amount = Math.random() * 1000 + 100;
      buyOrdersData.push({
        price,
        amount,
        total: price * amount
      });
    }
    
    // Generate sell orders (above current price)
    const sellOrdersData: OrderBookEntry[] = [];
    for (let i = 0; i < 10; i++) {
      const price = currentPrice + (i + 1) * 0.1;
      const amount = Math.random() * 1000 + 100;
      sellOrdersData.push({
        price,
        amount,
        total: price * amount
      });
    }
    
    setBuyOrders(buyOrdersData);
    setSellOrders(sellOrdersData);
  };

  const generateMockOrders = () => {
    const mockOrders: Order[] = [
      {
        id: '1',
        type: 'buy',
        amount: 100,
        price: 12.40,
        total: 1240,
        status: 'filled',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        type: 'sell',
        amount: 50,
        price: 12.50,
        total: 625,
        status: 'pending',
        timestamp: new Date(Date.now() - 1800000)
      }
    ];
    setOrders(mockOrders);
  };

  const updatePrices = () => {
    // Simulate price movements
    setSelectedPair(prev => {
      if (!prev) return prev;
      const change = (Math.random() - 0.5) * 0.2;
      return {
        ...prev,
        price: Math.max(0.01, prev.price + change)
      };
    });
  };

  const handleTrade = () => {
    if (!amount || (!price && orderType === 'limit')) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال جميع البيانات المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const newOrder: Order = {
      id: Date.now().toString(),
      type: tradeType,
      amount: parseFloat(amount),
      price: orderType === 'market' ? selectedPair?.price || 0 : parseFloat(price),
      total: parseFloat(amount) * (orderType === 'market' ? selectedPair?.price || 0 : parseFloat(price)),
      status: orderType === 'market' ? 'filled' : 'pending',
      timestamp: new Date()
    };

    setOrders([newOrder, ...orders]);
    setAmount('');
    setPrice('');

    toast({
      title: "تم تنفيذ الأمر",
      description: `تم ${tradeType === 'buy' ? 'شراء' : 'بيع'} ${amount} ${selectedPair?.baseAsset} بنجاح`,
    });
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              منصة التداول المباشر
            </h1>
            <p className="text-muted-foreground mt-2">
              تداول العملات المشفرة مع أدوات متقدمة وأسعار لحظية
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              متصل
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              تداول فوري
            </Badge>
          </div>
        </div>

        {/* Trading Pairs Selection */}
        <Card>
          <CardHeader>
            <CardTitle>أزواج التداول المتاحة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tradingPairs.map((pair) => (
                <div
                  key={pair.id}
                  onClick={() => setSelectedPair(pair)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedPair?.id === pair.id ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{pair.symbol}</h3>
                      <p className="text-2xl font-mono">${formatNumber(pair.price, 2)}</p>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center gap-1 ${
                        pair.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {pair.change24h >= 0 ? 
                          <TrendingUp className="h-4 w-4" /> : 
                          <TrendingDown className="h-4 w-4" />
                        }
                        {pair.change24h >= 0 ? '+' : ''}{formatNumber(pair.change24h)}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        الحجم: {formatVolume(pair.volume24h)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trading Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  تنفيذ الأوامر
                </CardTitle>
                <CardDescription>
                  {selectedPair?.symbol} - ${formatNumber(selectedPair?.price || 0, 2)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Buy/Sell Toggle */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={tradeType === 'buy' ? 'default' : 'outline'}
                    onClick={() => setTradeType('buy')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    شراء
                  </Button>
                  <Button
                    variant={tradeType === 'sell' ? 'default' : 'outline'}
                    onClick={() => setTradeType('sell')}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    بيع
                  </Button>
                </div>

                {/* Order Type */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={orderType === 'market' ? 'default' : 'outline'}
                    onClick={() => setOrderType('market')}
                  >
                    أمر سوقي
                  </Button>
                  <Button
                    variant={orderType === 'limit' ? 'default' : 'outline'}
                    onClick={() => setOrderType('limit')}
                  >
                    أمر محدود
                  </Button>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    الكمية ({selectedPair?.baseAsset})
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                {/* Price Input (for limit orders) */}
                {orderType === 'limit' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      السعر ({selectedPair?.quoteAsset})
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                )}

                {/* Total */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">المجموع</label>
                  <div className="p-2 bg-muted rounded">
                    {amount && (orderType === 'market' ? selectedPair?.price : price) ? 
                      `${formatNumber(
                        parseFloat(amount) * (orderType === 'market' ? selectedPair?.price || 0 : parseFloat(price || '0'))
                      )} ${selectedPair?.quoteAsset}` : 
                      `0.00 ${selectedPair?.quoteAsset}`
                    }
                  </div>
                </div>

                {/* Execute Button */}
                <Button 
                  onClick={handleTrade} 
                  className={`w-full ${
                    tradeType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {tradeType === 'buy' ? 'شراء' : 'بيع'} {selectedPair?.baseAsset}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Order Book & Trading History */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="orderbook" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="orderbook">دفتر الأوامر</TabsTrigger>
                <TabsTrigger value="history">تاريخ الأوامر</TabsTrigger>
              </TabsList>

              <TabsContent value="orderbook">
                <Card>
                  <CardHeader>
                    <CardTitle>دفتر الأوامر - {selectedPair?.symbol}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Buy Orders */}
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">أوامر الشراء</h4>
                        <div className="space-y-1">
                          <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground">
                            <div>السعر</div>
                            <div>الكمية</div>
                            <div>المجموع</div>
                          </div>
                          {buyOrders.slice(0, 8).map((order, index) => (
                            <div key={index} className="grid grid-cols-3 gap-2 text-sm hover:bg-green-50 p-1 rounded">
                              <div className="text-green-600 font-mono">
                                {formatNumber(order.price, 2)}
                              </div>
                              <div className="font-mono">
                                {formatNumber(order.amount, 0)}
                              </div>
                              <div className="font-mono">
                                {formatNumber(order.total, 0)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sell Orders */}
                      <div>
                        <h4 className="font-semibold text-red-600 mb-2">أوامر البيع</h4>
                        <div className="space-y-1">
                          <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground">
                            <div>السعر</div>
                            <div>الكمية</div>
                            <div>المجموع</div>
                          </div>
                          {sellOrders.slice(0, 8).map((order, index) => (
                            <div key={index} className="grid grid-cols-3 gap-2 text-sm hover:bg-red-50 p-1 rounded">
                              <div className="text-red-600 font-mono">
                                {formatNumber(order.price, 2)}
                              </div>
                              <div className="font-mono">
                                {formatNumber(order.amount, 0)}
                              </div>
                              <div className="font-mono">
                                {formatNumber(order.total, 0)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>تاريخ أوامرك</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={order.type === 'buy' ? 'default' : 'destructive'}
                              className={order.type === 'buy' ? 'bg-green-600' : 'bg-red-600'}
                            >
                              {order.type === 'buy' ? 'شراء' : 'بيع'}
                            </Badge>
                            <div>
                              <div className="font-medium">
                                {formatNumber(order.amount)} {selectedPair?.baseAsset}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                بسعر ${formatNumber(order.price)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              ${formatNumber(order.total)}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={
                                  order.status === 'filled' ? 'default' : 
                                  order.status === 'pending' ? 'secondary' : 'destructive'
                                }
                              >
                                {order.status === 'filled' ? 'مُنفذ' : 
                                 order.status === 'pending' ? 'في الانتظار' : 'ملغي'}
                              </Badge>
                            </div>
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
      </div>
    </div>
  );
}