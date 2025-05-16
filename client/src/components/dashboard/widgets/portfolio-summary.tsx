import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PortfolioSummaryProps {
  userId: number;
}

export function PortfolioSummaryWidget({ userId }: PortfolioSummaryProps) {
  const { data: portfolioData, isLoading } = useQuery({
    queryKey: [`/api/portfolio/${userId}`],
  });
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-14 w-3/4" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </div>
    );
  }
  
  if (!portfolioData) {
    return <div>لا توجد بيانات متاحة</div>;
  }
  
  const isPositive = portfolioData.changePercentage24h >= 0;
  
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">إجمالي القيمة</p>
        <h3 className="text-2xl font-bold">${portfolioData.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        <div className={`flex items-center mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
          <span className="text-sm font-medium">
            {isPositive ? '+' : ''}{portfolioData.changePercentage24h.toFixed(2)}% ({isPositive ? '+' : ''}${portfolioData.change24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-primary/10 rounded-md p-2">
          <p className="text-xs text-muted-foreground">حجم 24 ساعة</p>
          <p className="font-semibold">${portfolioData.volume24h.toLocaleString('en-US')}</p>
        </div>
        <div className="bg-primary/10 rounded-md p-2">
          <p className="text-xs text-muted-foreground">عدد الأصول</p>
          <p className="font-semibold">{portfolioData.assetCount}</p>
        </div>
      </div>
    </div>
  );
}