import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentTransactionsProps {
  userId: number;
}

export function RecentTransactionsWidget({ userId }: RecentTransactionsProps) {
  const { data: transactions, isLoading } = useQuery({
    queryKey: [`/api/transactions/${userId}?limit=5`],
  });
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex items-center space-x-3 rtl:space-x-reverse">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    );
  }
  
  if (!transactions || transactions.length === 0) {
    return <div className="text-center text-muted-foreground">لا توجد معاملات حديثة</div>;
  }
  
  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className={`p-2 rounded-full ${tx.type === 'buy' || tx.type === 'receive' ? 'bg-green-100' : 'bg-red-100'}`}>
            {tx.type === 'buy' || tx.type === 'receive' ? (
              <ArrowDownLeft className="h-5 w-5 text-green-600" />
            ) : (
              <ArrowUpRight className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium">
              {tx.type === 'buy' ? 'شراء' : 
               tx.type === 'sell' ? 'بيع' : 
               tx.type === 'send' ? 'إرسال' : 
               tx.type === 'receive' ? 'استلام' : 
               tx.type}
              {' '}
              {tx.asset?.symbol}
            </h4>
            <p className="text-xs text-muted-foreground">
              {new Date(tx.createdAt).toLocaleDateString('ar-SA')}
            </p>
          </div>
          <div className={`text-sm font-medium ${tx.type === 'buy' || tx.type === 'receive' ? 'text-green-600' : 'text-red-600'}`}>
            {tx.type === 'buy' || tx.type === 'receive' ? '+' : '-'}
            {tx.amount} {tx.asset?.symbol}
          </div>
        </div>
      ))}
    </div>
  );
}