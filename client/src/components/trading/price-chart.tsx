import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TimeFrame = "1H" | "1D" | "1W" | "1M" | "1Y";

type PriceData = {
  timestamp: number;
  price: number;
};

interface PriceChartProps {
  symbol: string;
  name: string;
  color?: string;
}

export function PriceChart({ symbol, name, color = "#F59E0B" }: PriceChartProps) {
  const [data, setData] = useState<PriceData[]>([]);
  const [timeframe, setTimeframe] = useState<TimeFrame>("1D");
  const [loading, setLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0);

  useEffect(() => {
    // Create random realistic price data
    setLoading(true);
    
    // حساب عدد النقاط بناءً على الإطار الزمني
    const pointCount = {
      "1H": 60, // نقطة في كل دقيقة
      "1D": 24, // نقطة في كل ساعة
      "1W": 7, // نقطة في كل يوم
      "1M": 30, // نقطة في كل يوم
      "1Y": 12 // نقطة في كل شهر
    }[timeframe];
    
    // اختيار سعر أساسي مناسب للعملة
    let basePrice = 0;
    switch (symbol) {
      case "BTC": basePrice = 58432; break;
      case "ETH": basePrice = 3456; break;
      case "BNB": basePrice = 567; break;
      case "SOL": basePrice = 123; break;
      case "RIM": basePrice = 95; break;
      default: basePrice = 100;
    }
    
    // إنشاء بيانات تغير الأسعار بتقلبات واقعية
    const now = Date.now();
    const interval = {
      "1H": 60 * 1000, // دقيقة
      "1D": 60 * 60 * 1000, // ساعة
      "1W": 24 * 60 * 60 * 1000, // يوم
      "1M": 24 * 60 * 60 * 1000, // يوم
      "1Y": 30 * 24 * 60 * 60 * 1000 // شهر
    }[timeframe];

    const volatility = {
      "1H": 0.002, // تقلب لكل دقيقة
      "1D": 0.005, // تقلب لكل ساعة
      "1W": 0.02, // تقلب لكل يوم
      "1M": 0.03, // تقلب لكل يوم
      "1Y": 0.1 // تقلب لكل شهر
    }[timeframe];

    let mockData: PriceData[] = [];
    let currentP = basePrice * (1 + (Math.random() * 0.1 - 0.05)); // بداية سعر عشوائي ±5%

    for (let i = pointCount; i >= 0; i--) {
      const timestamp = now - (i * interval);
      // تغيير السعر بناءً على تقلب واقعي مع بعض الاتجاه العام
      const change = (Math.random() * 2 - 1) * volatility * currentP;
      currentP += change;
      if (currentP < basePrice * 0.7) currentP = basePrice * 0.7; // لا يسمح بانخفاض أكثر من 30٪
      if (currentP > basePrice * 1.3) currentP = basePrice * 1.3; // لا يسمح بارتفاع أكثر من 30٪
      
      mockData.push({
        timestamp,
        price: parseFloat(currentP.toFixed(2))
      });
    }

    const timer = setTimeout(() => {
      setData(mockData);
      setCurrentPrice(mockData[mockData.length - 1].price);
      const startPrice = mockData[0].price;
      const change = mockData[mockData.length - 1].price - startPrice;
      setPriceChange(parseFloat(change.toFixed(2)));
      setPriceChangePercent(parseFloat(((change / startPrice) * 100).toFixed(2)));
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [symbol, timeframe]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    switch (timeframe) {
      case "1H":
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case "1D":
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case "1W":
      case "1M":
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      case "1Y":
        return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
      default:
        return date.toLocaleDateString();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">{name} ({symbol})</CardTitle>
          <div>
            <TabsList>
              <TabsTrigger 
                value="1H" 
                onClick={() => setTimeframe("1H")}
                className={timeframe === "1H" ? "bg-amber-100 text-amber-800" : ""}
              >
                ساعة
              </TabsTrigger>
              <TabsTrigger 
                value="1D" 
                onClick={() => setTimeframe("1D")}
                className={timeframe === "1D" ? "bg-amber-100 text-amber-800" : ""}
              >
                يوم
              </TabsTrigger>
              <TabsTrigger 
                value="1W" 
                onClick={() => setTimeframe("1W")}
                className={timeframe === "1W" ? "bg-amber-100 text-amber-800" : ""}
              >
                أسبوع
              </TabsTrigger>
              <TabsTrigger 
                value="1M" 
                onClick={() => setTimeframe("1M")}
                className={timeframe === "1M" ? "bg-amber-100 text-amber-800" : ""}
              >
                شهر
              </TabsTrigger>
              <TabsTrigger 
                value="1Y" 
                onClick={() => setTimeframe("1Y")}
                className={timeframe === "1Y" ? "bg-amber-100 text-amber-800" : ""}
              >
                سنة
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-3xl font-bold">${currentPrice.toLocaleString()}</div>
            <div className={`flex items-center ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {priceChange >= 0 ? '▲' : '▼'} ${Math.abs(priceChange).toLocaleString()} ({Math.abs(priceChangePercent)}%)
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  labelFormatter={(value) => formatDate(value)}
                  formatter={(value) => [`$${value}`, 'السعر']}
                />
                <defs>
                  <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={color} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill={`url(#gradient-${symbol})`}
                />
                <ReferenceLine y={data[0].price} stroke="#888" strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}