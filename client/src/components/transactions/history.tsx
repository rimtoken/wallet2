import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@shared/schema";
import { Link } from "wouter";
import { TransactionItem } from "./transaction-item";

interface TransactionHistoryProps {
  userId: number;
  limit?: number;
  showViewAll?: boolean;
}

export function TransactionHistory({ userId, limit = 5, showViewAll = true }: TransactionHistoryProps) {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: [`/api/transactions/${userId}`, { limit }],
  });
  
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        {showViewAll && (
          <Link href="/transactions">
            <Button variant="link" className="text-primary text-sm p-0">View All</Button>
          </Link>
        )}
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          // Skeleton loading state
          Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div className="flex items-center">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="ml-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20 mt-1" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-24 ml-auto" />
                <Skeleton className="h-3 w-16 mt-1 ml-auto" />
              </div>
            </div>
          ))
        ) : (
          transactions?.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))
        )}
        
        {!isLoading && transactions?.length === 0 && (
          <div className="text-center py-8 text-neutral-500">
            <p>No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
