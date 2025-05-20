import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, Activity } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// تعريف نوع بيانات ملخص المحفظة
interface PortfolioSummary {
  totalValue: number;
  change24h: number;
  changePercentage24h: number;
  assetCount: number;
  volume24h: number;
  totalProfit: number;
  transactionCount: number;
}

// تعريف نوع بيانات تاريخ المحفظة
interface PortfolioHistoryEntry {
  id: number;
  userId: number;
  timestamp: string;
  totalValue: number;
}

interface PortfolioSummaryProps {
  userId: number;
}

export function PortfolioSummary({ userId }: PortfolioSummaryProps) {
  // استعلام لجلب بيانات ملخص المحفظة
  const { data: portfolioSummary, isLoading: isLoadingPortfolio } = useQuery<PortfolioSummary>({
    queryKey: [`/api/portfolio/${userId}`],
  });

  // استعلام لجلب بيانات تاريخ المحفظة (7 أيام)
  const { data: portfolioHistory, isLoading: isLoadingHistory } = useQuery<PortfolioHistoryEntry[]>({
    queryKey: [`/api/portfolio/${userId}/history`, { days: 7 }],
  });

  if (isLoadingPortfolio || isLoadingHistory) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!portfolioSummary) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>ملخص المحفظة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">لا توجد بيانات متاحة للمحفظة</p>
            <p className="text-sm text-gray-400 mt-2">
              قم بإيداع أصول في محفظتك لمشاهدة ملخص المحفظة
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const performanceData = portfolioHistory || [];
  // إنشاء مصفوفة لرسم المخطط البياني
  const chartData = performanceData.map((entry) => ({
    date: new Date(entry.timestamp).toLocaleDateString(),
    value: entry.totalValue,
  }));

  return (
    <div className="space-y-4">
      {/* ملخص القيمة الإجمالية */}
      <Card className="bg-gradient-to-r from-amber-500/10 to-amber-700/10">
        <CardContent className="p-6">
          <div className="flex flex-col">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-medium text-gray-700">إجمالي قيمة المحفظة</h2>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                portfolioSummary.changePercentage24h >= 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {portfolioSummary.changePercentage24h >= 0 ? '+' : ''}
                {portfolioSummary.changePercentage24h.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-baseline mt-2">
              <span className="text-3xl font-bold">${formatCurrency(portfolioSummary.totalValue)}</span>
              <span className={`ml-2 text-sm ${
                portfolioSummary.change24h >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {portfolioSummary.change24h >= 0 ? (
                  <ArrowUp className="inline h-3 w-3 mr-0.5" />
                ) : (
                  <ArrowDown className="inline h-3 w-3 mr-0.5" />
                )}
                ${Math.abs(portfolioSummary.change24h).toFixed(2)}
              </span>
            </div>
          </div>

          {/* مخطط بسيط للتغير التاريخي (تمثيل بصري فقط) */}
          <div className="mt-6 h-16">
            <div className="w-full h-full flex items-end justify-between">
              {performanceData.map((entry: any, index: number) => {
                const maxValue = Math.max(...performanceData.map((d: any) => d.totalValue));
                const minValue = Math.min(...performanceData.map((d: any) => d.totalValue));
                const range = maxValue - minValue;
                const normalizedHeight = range === 0 
                  ? 50 
                  : ((entry.totalValue - minValue) / range) * 100;
                
                return (
                  <div 
                    key={index}
                    className={`w-2 rounded-t-sm ${
                      index > 0 && entry.totalValue >= performanceData[index - 1].totalValue
                        ? 'bg-green-500' 
                        : 'bg-red-500'
                    }`}
                    style={{ height: `${Math.max(10, normalizedHeight)}%` }}
                    title={`${new Date(entry.timestamp).toLocaleDateString()}: $${entry.totalValue.toFixed(2)}`}
                  />
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">إجمالي الربح</p>
              <p className="text-lg font-bold text-gray-900">${formatCurrency(portfolioSummary.totalProfit)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">حجم التداول (24س)</p>
              <p className="text-lg font-bold text-gray-900">${formatCurrency(portfolioSummary.volume24h)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">عدد العملات</p>
              <p className="text-lg font-bold text-gray-900">{portfolioSummary.assetCount}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="h-5 w-5 text-amber-600">
                <path d="M8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0ZM7.5 3V4H8.5V3H7.5ZM8.5 12.5V6H7V7H7.5V12.5H8.5Z" fill="currentColor" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">المعاملات</p>
              <p className="text-lg font-bold text-gray-900">{portfolioSummary.transactionCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}