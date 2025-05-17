import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowLeftRight, 
  Clock, 
  CheckCircle, 
  XCircle 
} from "lucide-react";
import { format } from "date-fns";

interface TransactionHistoryProps {
  userId: number;
  limit?: number;
}

export function TransactionHistory({ userId, limit }: TransactionHistoryProps) {
  // استعلام لجلب بيانات المعاملات
  const { data: transactions, isLoading } = useQuery({
    queryKey: [`/api/transactions/${userId}${limit ? `?limit=${limit}` : ''}`],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>تاريخ المعاملات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(limit || 5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // التحقق من وجود معاملات
  const hasTransactions = transactions && transactions.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>تاريخ المعاملات</span>
          {limit && hasTransactions && transactions.length >= limit && (
            <span className="text-sm text-primary cursor-pointer hover:underline">
              عرض الكل
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasTransactions ? (
          <div className="text-center py-8">
            <p className="text-gray-500">لا توجد معاملات حتى الآن</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx: any) => (
              <div key={tx.id} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                  {tx.type === "send" ? (
                    <ArrowUpRight className="text-red-500" />
                  ) : tx.type === "receive" ? (
                    <ArrowDownRight className="text-green-500" />
                  ) : (
                    <ArrowLeftRight className="text-blue-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">
                      {tx.type === "send" ? "إرسال" : tx.type === "receive" ? "استلام" : "تبادل"}
                    </h3>
                    <span className={`font-medium ${tx.type === "send" ? "text-red-500" : "text-green-500"}`}>
                      {tx.type === "send" ? "-" : "+"}{tx.amount} {tx.asset?.symbol || tx.assetId}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <div className="text-sm text-gray-500 flex items-center">
                      <Badge variant="outline" className="mr-2 text-xs">
                        {tx.status === "completed" ? (
                          <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                        ) : tx.status === "pending" ? (
                          <Clock className="mr-1 h-3 w-3 text-amber-500" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3 text-red-500" />
                        )}
                        {tx.status === "completed" ? "مكتمل" : tx.status === "pending" ? "قيد الانتظار" : "فشل"}
                      </Badge>
                      {tx.type === "send" && tx.toAddress && (
                        <span className="truncate max-w-[150px] inline-block">
                          إلى: {tx.toAddress.substring(0, 6)}...{tx.toAddress.substring(tx.toAddress.length - 4)}
                        </span>
                      )}
                      {tx.type === "receive" && tx.fromAddress && (
                        <span className="truncate max-w-[150px] inline-block">
                          من: {tx.fromAddress.substring(0, 6)}...{tx.fromAddress.substring(tx.fromAddress.length - 4)}
                        </span>
                      )}
                      {tx.type === "swap" && (
                        <span>تبادل لـ X</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(tx.createdAt), "dd/MM/yyyy HH:mm")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}