import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { AppLayout } from "@/components/layout/app-layout";
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Clock, 
  Bell, 
  Filter, 
  Download,
  Info,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// أنماط البيانات
interface PortfolioHistoryEntry {
  date: string;
  value: number;
  change: number;
}

interface AssetAllocation {
  name: string;
  symbol: string;
  value: number;
  percentage: number;
  color: string;
}

interface ProfitLossData {
  asset: string;
  symbol: string;
  profit: number;
  percentage: number;
  isProfit: boolean;
}

interface MarketStatistics {
  bitcoinDominance: number;
  globalMarketCap: number;
  marketCapChange24h: number;
  totalVolume24h: number;
  activeCryptocurrencies: number;
  activeExchanges: number;
}

export default function AdvancedDashboardPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [showAllAssets, setShowAllAssets] = useState(false);
  const userId = 1; // في التطبيق الحقيقي، سيتم الحصول على معرف المستخدم من حالة التطبيق أو سياق المصادقة

  // محاكاة استعلام الحصول على البيانات التاريخية للمحفظة
  const { data: portfolioHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: [`/api/portfolio/${userId}/history`, timeRange],
    queryFn: async () => {
      // في التطبيق الحقيقي، سيتم استدعاء نقطة نهاية API لاسترداد البيانات
      return mockPortfolioHistory[timeRange];
    },
  });

  // محاكاة استعلام الحصول على توزيع الأصول
  const { data: assetAllocation, isLoading: isLoadingAllocation } = useQuery({
    queryKey: [`/api/portfolio/${userId}/allocation`],
    queryFn: async () => {
      // في التطبيق الحقيقي، سيتم استدعاء نقطة نهاية API لاسترداد البيانات
      return mockAssetAllocation;
    },
  });

  // محاكاة استعلام الحصول على بيانات الربح والخسارة
  const { data: profitLossData, isLoading: isLoadingProfitLoss } = useQuery({
    queryKey: [`/api/portfolio/${userId}/profit-loss`, timeRange],
    queryFn: async () => {
      // في التطبيق الحقيقي، سيتم استدعاء نقطة نهاية API لاسترداد البيانات
      return mockProfitLossData;
    },
  });

  // محاكاة استعلام الحصول على إحصائيات السوق
  const { data: marketStats, isLoading: isLoadingMarketStats } = useQuery({
    queryKey: ['/api/market/statistics'],
    queryFn: async () => {
      // في التطبيق الحقيقي، سيتم استدعاء نقطة نهاية API لاسترداد البيانات
      return mockMarketStatistics;
    },
  });

  // تحويل البيانات إلى تنسيق يمكن استخدامه مع recharts
  const formatPortfolioData = () => {
    if (!portfolioHistory) return [];
    return portfolioHistory.map((entry) => ({
      ...entry,
      // تنسيق التاريخ حسب نطاق الوقت المحدد
      formattedDate: formatDate(entry.date, timeRange),
    }));
  };

  // تنسيق التاريخ بناءً على نطاق الوقت
  const formatDate = (dateString: string, range: string) => {
    const date = new Date(dateString);
    
    if (range === '24h') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (range === '7d') {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else if (range === '30d') {
      return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
    } else if (range === '90d' || range === '1y') {
      return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
    } else {
      return date.toLocaleDateString();
    }
  };

  // حساب إجمالي قيمة المحفظة
  const calculateTotalValue = () => {
    if (!assetAllocation) return 0;
    return assetAllocation.reduce((total, asset) => total + asset.value, 0);
  };

  // حساب التغيير في قيمة المحفظة خلال الفترة المحددة
  const calculateChange = () => {
    if (!portfolioHistory || portfolioHistory.length === 0) return { value: 0, percentage: 0 };
    
    const latestValue = portfolioHistory[portfolioHistory.length - 1].value;
    const earliestValue = portfolioHistory[0].value;
    
    const changeValue = latestValue - earliestValue;
    const changePercentage = (changeValue / earliestValue) * 100;
    
    return {
      value: changeValue,
      percentage: changePercentage,
    };
  };

  // الحصول على بيانات الأصول المراد عرضها (جميع الأصول أو أكبر 5 أصول)
  const getDisplayedAssets = () => {
    if (!assetAllocation) return [];
    
    if (showAllAssets) {
      return assetAllocation;
    } else {
      // عرض أكبر 5 أصول
      return [...assetAllocation].sort((a, b) => b.value - a.value).slice(0, 5);
    }
  };

  // الحصول على بيانات الربح والخسارة المراد عرضها (جميع الأصول أو أكبر 5 أصول)
  const getDisplayedProfitLoss = () => {
    if (!profitLossData) return [];
    
    if (showAllAssets) {
      return profitLossData;
    } else {
      // عرض أكبر 5 أصول
      return [...profitLossData].sort((a, b) => Math.abs(b.profit) - Math.abs(a.profit)).slice(0, 5);
    }
  };

  const totalValue = calculateTotalValue();
  const portfolioChange = calculateChange();
  const displayedAssets = getDisplayedAssets();
  const displayedProfitLoss = getDisplayedProfitLoss();
  const formattedPortfolioData = formatPortfolioData();

  return (
    <AppLayout 
      currentPage="/advanced-dashboard"
      breadcrumbs={[
        { label: "المحفظة", href: "/wallet" },
        { label: "لوحة المعلومات المتقدمة" }
      ]}
    >
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">لوحة المعلومات المتقدمة</h1>
            <p className="text-gray-600">تحليلات متقدمة ورؤى مفصلة حول محفظتك وأداء أصولك</p>
          </div>

          <div className="flex space-x-2 space-x-reverse mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="الفترة الزمنية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 ساعة</SelectItem>
                <SelectItem value="7d">7 أيام</SelectItem>
                <SelectItem value="30d">30 يوم</SelectItem>
                <SelectItem value="90d">90 يوم</SelectItem>
                <SelectItem value="1y">سنة</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ملخص المحفظة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">إجمالي قيمة المحفظة</CardTitle>
              <CardDescription>قيمة جميع أصولك المجمعة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`flex items-center mt-2 ${portfolioChange.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolioChange.value >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                <span>
                  {portfolioChange.percentage.toFixed(2)}% ({portfolioChange.value >= 0 ? '+' : ''}
                  ${Math.abs(portfolioChange.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">عدد الأصول</CardTitle>
              <CardDescription>عدد العملات المشفرة في محفظتك</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {assetAllocation ? assetAllocation.length : 0}
              </div>
              <div className="text-gray-500 mt-2">
                <span>أكثر {displayedAssets.length} أصول تشكل {displayedAssets.reduce((acc, asset) => acc + asset.percentage, 0).toFixed(2)}% من محفظتك</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">أكثر الأصول أداءً</CardTitle>
              <CardDescription>أفضل أصولك أداءً خلال هذه الفترة</CardDescription>
            </CardHeader>
            <CardContent>
              {profitLossData && profitLossData.length > 0 ? (
                <div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-bold">{profitLossData[0].asset}</span>
                      <Badge variant="outline" className="ml-2">{profitLossData[0].symbol}</Badge>
                    </div>
                    <div className={`font-semibold ${profitLossData[0].isProfit ? 'text-green-600' : 'text-red-600'}`}>
                      {profitLossData[0].isProfit ? '+' : ''}{profitLossData[0].percentage.toFixed(2)}%
                    </div>
                  </div>
                  <Progress className="mt-2" value={Math.abs(profitLossData[0].percentage)} max={100} 
                    indicatorClassName={profitLossData[0].isProfit ? 'bg-green-500' : 'bg-red-500'} />
                </div>
              ) : (
                <div className="text-gray-500">لا توجد بيانات متاحة</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* رسم بياني للقيمة على مدار الوقت */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>قيمة المحفظة على مدار الوقت</CardTitle>
            <CardDescription>
              تتبع قيمة محفظتك الإجمالية خلال الفترة المحددة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoadingHistory ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : formattedPortfolioData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  لا توجد بيانات متاحة لهذه الفترة
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={formattedPortfolioData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="formattedDate" 
                      tick={{ fontSize: 12 }} 
                      tickMargin={10}
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'القيمة']}
                      labelFormatter={(label) => `التاريخ: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* توزيع الأصول والربح/الخسارة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>توزيع الأصول</CardTitle>
                <CardDescription>
                  توزيع محفظتك حسب العملات المشفرة
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowAllAssets(!showAllAssets)}>
                {showAllAssets ? 'عرض أكبر 5' : 'عرض الكل'}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-6">
                {isLoadingAllocation ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : displayedAssets.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    لا توجد بيانات متاحة
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={displayedAssets}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                      >
                        {displayedAssets.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip 
                        formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'القيمة']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="space-y-2">
                {displayedAssets.map((asset, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: asset.color }}></div>
                      <span className="font-medium">{asset.symbol}</span>
                      <span className="text-gray-500 text-sm ml-2">({asset.name})</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {asset.percentage.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>الأرباح والخسائر</CardTitle>
                <CardDescription>
                  أداء أصولك خلال {timeRange === '24h' ? 'الـ 24 ساعة الماضية' : 
                              timeRange === '7d' ? 'الـ 7 أيام الماضية' : 
                              timeRange === '30d' ? 'الـ 30 يوم الماضية' : 
                              timeRange === '90d' ? 'الـ 90 يوم الماضية' : 'السنة الماضية'}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowAllAssets(!showAllAssets)}>
                {showAllAssets ? 'عرض أكبر 5' : 'عرض الكل'}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingProfitLoss ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : displayedProfitLoss.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    لا توجد بيانات متاحة لهذه الفترة
                  </div>
                ) : (
                  displayedProfitLoss.map((item, index) => (
                    <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <span className="font-medium">{item.asset}</span>
                          <Badge variant="outline" className="ml-2">{item.symbol}</Badge>
                        </div>
                        <div className={`font-semibold ${item.isProfit ? 'text-green-600' : 'text-red-600'}`}>
                          {item.isProfit ? '+' : ''}${Math.abs(item.profit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">تغيير النسبة المئوية</span>
                        <span className={item.isProfit ? 'text-green-600' : 'text-red-600'}>
                          {item.isProfit ? '+' : ''}{item.percentage.toFixed(2)}%
                        </span>
                      </div>
                      <Progress className="mt-2" value={Math.abs(item.percentage)} max={100} 
                        indicatorClassName={item.isProfit ? 'bg-green-500' : 'bg-red-500'} />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* إحصائيات السوق */}
        <Card>
          <CardHeader>
            <CardTitle>إحصائيات السوق</CardTitle>
            <CardDescription>
              نظرة عامة على حالة سوق العملات المشفرة
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingMarketStats ? (
              <div className="h-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : !marketStats ? (
              <div className="h-32 flex items-center justify-center text-gray-500">
                لا توجد بيانات متاحة
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-gray-500 mb-1">القيمة السوقية العالمية</div>
                  <div className="text-xl font-bold">
                    ${marketStats.globalMarketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className={`text-sm ${marketStats.marketCapChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {marketStats.marketCapChange24h >= 0 ? '+' : ''}{marketStats.marketCapChange24h.toFixed(2)}% (24 ساعة)
                  </div>
                </div>

                <div>
                  <div className="text-gray-500 mb-1">حجم التداول خلال 24 ساعة</div>
                  <div className="text-xl font-bold">
                    ${marketStats.totalVolume24h.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {((marketStats.totalVolume24h / marketStats.globalMarketCap) * 100).toFixed(2)}% من القيمة السوقية
                  </div>
                </div>

                <div>
                  <div className="text-gray-500 mb-1">هيمنة Bitcoin</div>
                  <div className="text-xl font-bold">
                    {marketStats.bitcoinDominance.toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-500">
                    من إجمالي القيمة السوقية للعملات المشفرة
                  </div>
                </div>

                <div>
                  <div className="text-gray-500 mb-1">عدد العملات المشفرة النشطة</div>
                  <div className="text-xl font-bold">
                    {marketStats.activeCryptocurrencies.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-gray-500 mb-1">عدد منصات التبادل النشطة</div>
                  <div className="text-xl font-bold">
                    {marketStats.activeExchanges.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* قسم التنبيهات */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">التنبيهات النشطة</h2>
          <Alert className="mb-6 border-blue-500 bg-blue-50">
            <Info className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800">تنبيهات السعر</AlertTitle>
            <AlertDescription className="text-blue-700">
              أعد ضبط التنبيهات الخاصة بك لتلقي إشعارات عندما تصل الأسعار إلى المستويات المحددة. يمكنك إضافة تنبيهات سعرية جديدة من صفحة تنبيهات الأسعار.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>تنبيهات السعر النشطة</CardTitle>
                <CardDescription>
                  التنبيهات التي ستتلقى إشعارًا عندما يصل السعر إليها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <div className="flex items-center">
                      <span className="font-medium">Bitcoin</span>
                      <Badge variant="outline" className="ml-2">BTC</Badge>
                    </div>
                    <div className="text-amber-600 font-medium">
                      $45,000.00
                    </div>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b">
                    <div className="flex items-center">
                      <span className="font-medium">Ethereum</span>
                      <Badge variant="outline" className="ml-2">ETH</Badge>
                    </div>
                    <div className="text-amber-600 font-medium">
                      $3,200.00
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-medium">Solana</span>
                      <Badge variant="outline" className="ml-2">SOL</Badge>
                    </div>
                    <div className="text-amber-600 font-medium">
                      $120.00
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  إدارة التنبيهات
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إعدادات التنبيهات</CardTitle>
                <CardDescription>
                  تخصيص كيفية تلقي تنبيهاتك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 text-gray-500 mr-2" />
                      <span>إشعارات متصفح</span>
                    </div>
                    <div className="text-green-600 font-medium">
                      مفعلة
                    </div>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b">
                    <div className="flex items-center">
                      <Wallet className="h-5 w-5 text-gray-500 mr-2" />
                      <span>تنبيهات محفظة</span>
                    </div>
                    <div className="text-green-600 font-medium">
                      مفعلة
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-gray-500 mr-2" />
                      <span>تنبيهات حركة السوق</span>
                    </div>
                    <div className="text-red-600 font-medium">
                      معطلة
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  تعديل الإعدادات
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// بيانات تجريبية لاختبار المكونات

// البيانات التاريخية للمحفظة
const mockPortfolioHistory: Record<string, PortfolioHistoryEntry[]> = {
  '24h': Array.from({ length: 24 }, (_, i) => {
    const date = new Date();
    date.setHours(date.getHours() - 23 + i);
    const baseValue = 25000;
    const fluctuation = Math.random() * 1000 - 500;
    const value = baseValue + (i * 100) + fluctuation;
    const change = i > 0 ? value - (baseValue + ((i - 1) * 100)) : 0;
    
    return {
      date: date.toISOString(),
      value,
      change
    };
  }),
  
  '7d': Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    const baseValue = 24000;
    const fluctuation = Math.random() * 2000 - 1000;
    const value = baseValue + (i * 300) + fluctuation;
    const change = i > 0 ? value - (baseValue + ((i - 1) * 300)) : 0;
    
    return {
      date: date.toISOString(),
      value,
      change
    };
  }),
  
  '30d': Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 29 + i);
    const baseValue = 22000;
    const fluctuation = Math.random() * 3000 - 1500;
    const value = baseValue + (i * 150) + fluctuation;
    const change = i > 0 ? value - (baseValue + ((i - 1) * 150)) : 0;
    
    return {
      date: date.toISOString(),
      value,
      change
    };
  }),
  
  '90d': Array.from({ length: 90 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 89 + i);
    const baseValue = 20000;
    const fluctuation = Math.random() * 5000 - 2500;
    const value = baseValue + (i * 100) + fluctuation;
    const change = i > 0 ? value - (baseValue + ((i - 1) * 100)) : 0;
    
    return {
      date: date.toISOString(),
      value,
      change
    };
  }),
  
  '1y': Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - 11 + i);
    const baseValue = 15000;
    const fluctuation = Math.random() * 8000 - 4000;
    const value = baseValue + (i * 1000) + fluctuation;
    const change = i > 0 ? value - (baseValue + ((i - 1) * 1000)) : 0;
    
    return {
      date: date.toISOString(),
      value,
      change
    };
  })
};

// بيانات توزيع الأصول
const mockAssetAllocation: AssetAllocation[] = [
  { name: 'Bitcoin', symbol: 'BTC', value: 12500, percentage: 50, color: '#F7931A' },
  { name: 'Ethereum', symbol: 'ETH', value: 6250, percentage: 25, color: '#627EEA' },
  { name: 'Binance Coin', symbol: 'BNB', value: 2500, percentage: 10, color: '#F3BA2F' },
  { name: 'Solana', symbol: 'SOL', value: 1875, percentage: 7.5, color: '#00FFA3' },
  { name: 'Cardano', symbol: 'ADA', value: 1250, percentage: 5, color: '#0033AD' },
  { name: 'Polkadot', symbol: 'DOT', value: 625, percentage: 2.5, color: '#E6007A' }
];

// بيانات الربح والخسارة
const mockProfitLossData: ProfitLossData[] = [
  { asset: 'Solana', symbol: 'SOL', profit: 450, percentage: 32, isProfit: true },
  { asset: 'Ethereum', symbol: 'ETH', profit: 320, percentage: 15, isProfit: true },
  { asset: 'Bitcoin', symbol: 'BTC', profit: 250, percentage: 8, isProfit: true },
  { asset: 'Cardano', symbol: 'ADA', profit: -50, percentage: -12, isProfit: false },
  { asset: 'Polkadot', symbol: 'DOT', profit: -30, percentage: -6, isProfit: false },
  { asset: 'Binance Coin', symbol: 'BNB', profit: 120, percentage: 10, isProfit: true }
];

// إحصائيات السوق
const mockMarketStatistics: MarketStatistics = {
  bitcoinDominance: 42.5,
  globalMarketCap: 2250000000000,
  marketCapChange24h: 1.2,
  totalVolume24h: 98500000000,
  activeCryptocurrencies: 10482,
  activeExchanges: 527
};