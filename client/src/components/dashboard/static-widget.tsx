import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, X } from "lucide-react";
import { Widget, WidgetType } from "./types";
import { PortfolioSummaryWidget } from "./widgets/portfolio-summary";
import { RecentTransactionsWidget } from "./widgets/recent-transactions";
import { FinancialMoodWidget } from "./widgets/financial-mood";

interface StaticWidgetProps {
  widget: Widget;
  userId: number;
  onRemove: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

/**
 * مكون العنصر الثابت في لوحة المعلومات بدون خاصية السحب والإفلات
 */
export function StaticWidget({
  widget,
  userId,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
}: StaticWidgetProps) {
  // تعيين أبعاد العنصر بناءً على حجمه
  const getSizeClasses = () => {
    switch (widget.size) {
      case "small":
        return "col-span-1";
      case "medium":
        return "col-span-1 md:col-span-1";
      case "large":
        return "col-span-1 md:col-span-2";
      case "full":
        return "col-span-1 md:col-span-4";
      default:
        return "col-span-1";
    }
  };

  // عرض المحتوى المناسب بناء على نوع العنصر
  const renderWidgetContent = () => {
    switch (widget.type) {
      case "portfolio-summary":
        return <PortfolioSummaryWidget userId={userId} />;
      case "portfolio-chart":
        return <div>مخطط المحفظة</div>;
      case "asset-list":
        return <div>قائمة الأصول</div>;
      case "recent-transactions":
        return <RecentTransactionsWidget userId={userId} />;
      case "market-overview":
        return <div>نظرة عامة على السوق</div>;
      case "price-alerts":
        return <div>تنبيهات الأسعار</div>;
      case "news-feed":
        return <div>آخر الأخبار</div>;
      case "financial-mood-indicator":
      case "financial-mood":
        return <FinancialMoodWidget userId={userId} />;
      default:
        return <div>محتوى غير معروف</div>;
    }
  };

  return (
    <Card className={`${getSizeClasses()} relative group bg-card`}>
      <div className="absolute top-2 left-2 flex items-center space-x-1 rtl:space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity">
        {!isFirst && onMoveUp && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onMoveUp(widget.id)}
            title="تحريك لأعلى"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        )}
        
        {!isLast && onMoveDown && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onMoveDown(widget.id)}
            title="تحريك لأسفل"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 ml-auto"
          onClick={() => onRemove(widget.id)}
          title="إزالة"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <CardHeader className="font-medium text-lg pb-0">
        {widget.title}
      </CardHeader>
      
      <CardContent className="pt-4">
        {renderWidgetContent()}
      </CardContent>
    </Card>
  );
}