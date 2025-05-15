import { WidgetType } from './types';
import { PortfolioSummary } from '@/components/portfolio/summary';
import { PortfolioChart } from '@/components/portfolio/chart';
import { AssetList } from '@/components/assets/asset-list';
import { TransactionHistory } from '@/components/transactions/history';
import { MarketOverview } from '@/components/market/overview';
import { FinancialMoodIndicator } from '@/components/financial-mood/financial-mood-indicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// نوع الخاصيات لمكون WidgetRenderer
interface WidgetRendererProps {
  type: WidgetType;
  userId: number;
}

/**
 * مكون لعرض المحتوى المناسب للعنصر حسب نوعه
 */
export function WidgetRenderer({ type, userId }: WidgetRendererProps) {
  // عرض المكون المناسب حسب نوع العنصر
  switch (type) {
    case 'portfolio-summary':
      return <PortfolioSummary userId={userId} />;
    
    case 'portfolio-chart':
      return <PortfolioChart userId={userId} />;
    
    case 'asset-list':
      return <AssetList userId={userId} />;
    
    case 'transaction-history':
      return <TransactionHistory userId={userId} limit={5} showViewAll />;
    
    case 'market-overview':
      return <MarketOverview />;
    
    case 'price-alerts':
      return (
        <Card>
          <CardHeader>
            <CardTitle>تنبيهات الأسعار</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-6">
              ميزة تنبيهات الأسعار قيد التطوير
            </p>
          </CardContent>
        </Card>
      );
    
    case 'news-feed':
      return (
        <Card>
          <CardHeader>
            <CardTitle>آخر الأخبار</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-6">
              ميزة الأخبار قيد التطوير
            </p>
          </CardContent>
        </Card>
      );
      
    case 'financial-mood-indicator':
      return <FinancialMoodIndicator userId={userId} />;
    
    default:
      return (
        <Card>
          <CardHeader>
            <CardTitle>عنصر غير معروف</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              لم يتم العثور على محتوى لهذا النوع من العناصر
            </p>
          </CardContent>
        </Card>
      );
  }
}