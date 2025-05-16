import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface FinancialMoodProps {
  userId: number;
}

export function FinancialMoodWidget({ userId }: FinancialMoodProps) {
  const { data: financialMood, isLoading } = useQuery({
    queryKey: [`/api/portfolio/${userId}/financial-mood`],
  });
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }
  
  if (!financialMood) {
    return <div className="text-center text-muted-foreground">لا توجد بيانات متاحة</div>;
  }
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`text-5xl mb-2 p-4 rounded-full ${financialMood.color}`}>
        {financialMood.emoji}
      </div>
      <h4 className="text-lg font-medium mb-1">{financialMood.message}</h4>
      <div className="text-sm text-muted-foreground mb-4">
        درجة التقييم: {financialMood.score}/100
      </div>
      
      <div className="w-full space-y-2">
        <h5 className="text-sm font-medium mb-1">العوامل المؤثرة:</h5>
        <ul className="space-y-1 text-sm">
          {financialMood.factors.map((factor, index) => (
            <li 
              key={index} 
              className={`flex items-center justify-between ${
                factor.type === 'positive' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              <span>{factor.description}</span>
              <span>{factor.type === 'positive' ? '+' : ''}{factor.impact}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}