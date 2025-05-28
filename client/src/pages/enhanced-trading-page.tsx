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
  Settings,
  RefreshCw,
  Wallet,
  Activity
} from 'lucide-react';

interface TradingPair {
  id: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  change24h: number;
  volume24h: number;
}

export default function EnhancedTradingPage() {
  const { toast } = useToast();
  const [selectedPair, setSelectedPair] = useState<TradingPair>();
  const [amount, setAmount] = useState('1');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  const tradingPairs: TradingPair[] = [
    {
      id: 'ETH_USDS',
      symbol: 'ETH/USDS',
      baseAsset: 'ETH',
      quoteAsset: 'USDS',
      price: 2642.19,
      change24h: 8.3,
      volume24h: 2540000
    },
    {
      id: 'RIM_USDT',
      symbol: 'RIM/USDT',
      baseAsset: 'RIM',
      quoteAsset: 'USDT',
      price: 12.45,
      change24h: 5.7,
      volume24h: 890000
    },
    {
      id: 'BTC_USDT',
      symbol: 'BTC/USDT',
      baseAsset: 'BTC',
      quoteAsset: 'USDT',
      price: 43250,
      change24h: 2.5,
      volume24h: 1250000
    }
  ];

  useEffect(() => {
    setSelectedPair(tradingPairs[0]);
  }, []);

  useEffect(() => {
    if (amount && selectedPair) {
      setReceiveAmount((parseFloat(amount) * selectedPair.price).toFixed(2));
    }
  }, [amount, selectedPair]);

  const handleSwap = () => {
    if (!amount) {
      toast({
        title: "Error",
        description: "Please enter an amount",
        variant: "destructive",
      });
      return;
    }

    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      toast({
        title: "Swap Successful",
        description: `Successfully swapped ${amount} ${selectedPair?.baseAsset} for ${receiveAmount} ${selectedPair?.quoteAsset}`,
      });
    }, 2000);
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="font-semibold text-lg">rimtoken</span>
              </div>
              
              <nav className="flex items-center space-x-6">
                <Button variant="ghost" className="text-gray-600 hover:text-black">
                  Trade
                  <TrendingDown className="ml-1 h-4 w-4" />
                </Button>
                <Button variant="ghost" className="text-gray-600 hover:text-black">
                  Portfolio
                  <TrendingDown className="ml-1 h-4 w-4" />
                </Button>
                <Button variant="ghost" className="text-gray-600 hover:text-black">
                  DAO
                  <TrendingDown className="ml-1 h-4 w-4" />
                </Button>
                <Button variant="ghost" className="text-gray-600 hover:text-black">
                  Buy Crypto
                </Button>
                <Button variant="ghost" className="text-gray-600 hover:text-black">
                  Card
                </Button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                Connect wallet
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Activity className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              {/* Swap/Limit Tabs */}
              <Tabs defaultValue="swap" className="w-full mb-6">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                  <TabsTrigger value="swap" className="data-[state=active]:bg-white">
                    Swap
                  </TabsTrigger>
                  <TabsTrigger value="limit" className="data-[state=active]:bg-white">
                    Limit
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="swap" className="space-y-4 mt-6">
                  {/* Settings and Refresh */}
                  <div className="flex justify-end space-x-2 mb-4">
                    <Button variant="ghost" size="sm" className="p-2">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* You pay section */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-600">You pay</label>
                      <span className="text-xs text-gray-500">-$2,642.19</span>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-xl bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          E
                        </div>
                        <div>
                          <div className="font-semibold">ETH</div>
                          <div className="text-xs text-gray-500">on Ethereum</div>
                        </div>
                        <TrendingDown className="h-4 w-4 text-gray-400 ml-2" />
                      </div>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-right border-none shadow-none text-xl font-mono w-20 p-0"
                        placeholder="1"
                      />
                    </div>
                  </div>

                  {/* Swap direction */}
                  <div className="flex justify-center py-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full border">
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* You receive section */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">You receive</label>
                    <div className="flex items-center space-x-3 p-4 border rounded-xl bg-white">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          $
                        </div>
                        <div>
                          <div className="font-semibold">USDS</div>
                          <div className="text-xs text-gray-500">on Ethereum</div>
                        </div>
                        <TrendingDown className="h-4 w-4 text-gray-400 ml-2" />
                      </div>
                      <div className="text-right text-xl font-mono text-gray-600">
                        {receiveAmount || "0.00"}
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Rate</span>
                      <span>1 ETH = $2,642.19</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Slippage tolerance</span>
                      <span>0.5%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Network fee</span>
                      <span>~$12.50</span>
                    </div>
                  </div>

                  {/* Connect Wallet Button */}
                  <Button 
                    onClick={handleSwap}
                    disabled={isSwapping}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold mt-6"
                  >
                    {isSwapping ? (
                      <div className="flex items-center justify-center">
                        <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                        Swapping...
                      </div>
                    ) : (
                      "Connect wallet"
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="limit" className="space-y-4 mt-6">
                  <div className="text-center py-8 text-gray-500">
                    <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Limit orders coming soon</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Additional Trading Pairs */}
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-gray-800">Popular Trading Pairs</h3>
            {tradingPairs.map((pair) => (
              <Card 
                key={pair.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedPair?.id === pair.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedPair(pair)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{pair.symbol}</h4>
                      <p className="text-sm text-gray-500">24h Volume: {(pair.volume24h / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-semibold">${formatNumber(pair.price)}</p>
                      <div className={`flex items-center text-sm ${
                        pair.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {pair.change24h >= 0 ? 
                          <TrendingUp className="h-3 w-3 mr-1" /> : 
                          <TrendingDown className="h-3 w-3 mr-1" />
                        }
                        {pair.change24h >= 0 ? '+' : ''}{formatNumber(pair.change24h)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}