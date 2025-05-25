import { useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { Skeleton } from "@/components/ui/skeleton";

// تعريف خيارات النطاق الزمني
const TIME_RANGES = ["24h", "7d", "30d", "90d", "1y", "all"] as const;
type TimeRange = typeof TIME_RANGES[number];

interface PriceChartProps {
  assetId: number;
  symbol: string;
  name: string;
  color?: string;
  height?: number;
  showControls?: boolean;
  className?: string;
}

// توليد بيانات عشوائية لغرض العرض التوضيحي
// في التطبيق الحقيقي، يجب استبدال هذه الوظيفة بطلب API للحصول على بيانات حقيقية
function generateMockData(timeRange: TimeRange, trend: "up" | "down" | "volatile" = "volatile") {
  const now = new Date();
  const data = [];
  let pointCount;
  
  switch (timeRange) {
    case "24h":
      pointCount = 24;
      break;
    case "7d":
      pointCount = 7;
      break;
    case "30d":
      pointCount = 30;
      break;
    case "90d":
      pointCount = 90;
      break;
    case "1y":
      pointCount = 12;
      break;
    case "all":
      pointCount = 24;
      break;
    default:
      pointCount = 24;
  }

  let baseValue = 10000 + Math.random() * 30000;
  const volatility = trend === "volatile" ? 0.1 : 0.03;
  const direction = trend === "up" ? 1 : trend === "down" ? -1 : 0;

  for (let i = 0; i < pointCount; i++) {
    const change = (Math.random() - 0.5) * volatility + (direction * 0.01);
    baseValue = baseValue * (1 + change);
    
    let date;
    if (timeRange === "24h") {
      date = new Date(now.getTime() - (pointCount - i) * 3600 * 1000);
    } else if (timeRange === "7d") {
      date = new Date(now.getTime() - (pointCount - i) * 24 * 3600 * 1000);
    } else if (timeRange === "30d" || timeRange === "90d") {
      date = new Date(now.getTime() - (pointCount - i) * 24 * 3600 * 1000);
    } else {
      date = new Date(now.getFullYear() - 1, i, 1);
    }
    
    data.push({
      date: date.toISOString(),
      price: baseValue,
      formattedDate: timeRange === "24h" 
        ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
    });
  }
  
  return data;
}

export default function PriceChart({ 
  assetId, 
  symbol, 
  name, 
  color = "#8884d8", 
  height = 300,
  showControls = true,
  className = ""
}: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(() => generateMockData(timeRange, "up"));
  const { getText } = useLanguage();
  
  // تحديث البيانات عند تغيير النطاق الزمني
  const handleRangeChange = (range: TimeRange) => {
    setIsLoading(true);
    setTimeRange(range);
    
    // محاكاة تأخير طلب API
    setTimeout(() => {
      setData(generateMockData(range, "up"));
      setIsLoading(false);
    }, 500);
  };
  
  // حساب نسبة التغيير
  const calculateChange = () => {
    if (data.length < 2) return { value: "0", percentage: "0" };
    
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    const change = lastPrice - firstPrice;
    const percentage = (change / firstPrice) * 100;
    
    return {
      value: change.toFixed(2),
      percentage: percentage.toFixed(2)
    };
  };
  
  const change = calculateChange();
  const positive = Number(change.value) >= 0;
  
  // تنسيق السعر
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };
  
  // تنسيق التاريخ
  const formatDate = (date: string) => {
    const d = new Date(date);
    if (timeRange === "24h") {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange === "7d" || timeRange === "30d") {
      return d.toLocaleDateString([], { weekday: 'short' });
    } else {
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {symbol} <span className="text-muted-foreground font-normal text-sm">{name}</span>
            </CardTitle>
            <CardDescription>
              {!isLoading ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold">{formatPrice(data[data.length - 1].price)}</span>
                  <span className={positive ? "text-green-500" : "text-red-500"}>
                    {positive ? "+" : ""}{change.value} ({positive ? "+" : ""}{change.percentage}%)
                  </span>
                </div>
              ) : (
                <Skeleton className="h-6 w-48 mt-1" />
              )}
            </CardDescription>
          </div>
          
          {showControls && (
            <div className="flex gap-1">
              {TIME_RANGES.map((range) => (
                <Button
                  key={range}
                  size="sm"
                  variant={timeRange === range ? "default" : "outline"}
                  onClick={() => handleRangeChange(range)}
                  className="px-2 py-1 h-8"
                >
                  {range}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <Skeleton className="h-[250px] w-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart
              data={data}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient id={`colorGradient-${assetId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              
              <XAxis
                dataKey="formattedDate"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              
              <YAxis
                domain={[(dataMin: number) => dataMin * 0.99, (dataMax: number) => dataMax * 1.01]}
                orientation="right"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                width={80}
              />
              
              <Tooltip
                formatter={(value: any) => [formatPrice(value), getText("price")]}
                labelFormatter={(label) => label.toString()}
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                }}
              />
              
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                fillOpacity={1}
                fill={`url(#colorGradient-${assetId})`}
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}