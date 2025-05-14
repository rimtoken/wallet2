import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PortfolioSummary as PortfolioSummaryType } from "@shared/schema";
import { formatCurrency, formatPercent } from "@/lib/api";
import { useState } from "react";
import { SendReceiveDialog } from "@/components/send-receive-dialog";

interface PortfolioSummaryProps {
  userId: number;
}

export function PortfolioSummary({ userId }: PortfolioSummaryProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'send' | 'receive'>('send');
  
  const { data: portfolio, isLoading } = useQuery<PortfolioSummaryType>({
    queryKey: [`/api/portfolio/${userId}`],
  });
  
  const handleSendClick = () => {
    setDialogType('send');
    setDialogOpen(true);
  };
  
  const handleReceiveClick = () => {
    setDialogType('receive');
    setDialogOpen(true);
  };
  
  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={cn(
        "flex items-center text-sm font-medium",
        isPositive ? "text-success" : "text-error"
      )}>
        <i className={cn(
          "mr-1",
          isPositive ? "ri-arrow-up-line" : "ri-arrow-down-line"
        )}></i>
        {formatPercent(portfolio?.changePercentage24h || 0)}
      </span>
    );
  };
  
  return (
    <>
      <div className="bg-white rounded-xl p-5 mb-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <div>
            <h2 className="text-lg lg:text-xl font-semibold">Portfolio Value</h2>
            <p className="text-neutral-500 text-sm">Last updated: Today, 2:45 PM</p>
          </div>
          <div className="flex space-x-2 mt-4 lg:mt-0">
            <Button 
              variant="default" 
              className="bg-primary text-white"
              onClick={handleSendClick}
            >
              <i className="ri-send-plane-line mr-2"></i>
              <span>Send</span>
            </Button>
            <Button 
              variant="outline" 
              className="bg-neutral-100 text-neutral-800 border-neutral-200"
              onClick={handleReceiveClick}
            >
              <i className="ri-download-line mr-2"></i>
              <span>Receive</span>
            </Button>
          </div>
        </div>
        
        <div className="mt-4 border-b border-neutral-200 pb-6">
          {isLoading ? (
            <>
              <Skeleton className="h-9 w-48 mb-2" />
              <Skeleton className="h-5 w-24" />
            </>
          ) : (
            <>
              <h3 className="text-2xl lg:text-3xl font-bold">
                {formatCurrency(portfolio?.totalValue || 0)}
              </h3>
              <div className="flex items-center mt-1">
                {formatChange(portfolio?.changePercentage24h || 0)}
                <span className="text-neutral-500 text-sm ml-2">Past 24h</span>
              </div>
            </>
          )}
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="bg-neutral-50 rounded-lg p-3">
            <p className="text-neutral-500 text-xs">Assets</p>
            {isLoading ? (
              <Skeleton className="h-5 w-12 mt-1" />
            ) : (
              <p className="font-semibold mt-1">{portfolio?.assetCount || 0}</p>
            )}
          </div>
          <div className="bg-neutral-50 rounded-lg p-3">
            <p className="text-neutral-500 text-xs">24h Volume</p>
            {isLoading ? (
              <Skeleton className="h-5 w-20 mt-1" />
            ) : (
              <p className="font-semibold mt-1">{formatCurrency(portfolio?.volume24h || 0)}</p>
            )}
          </div>
          <div className="bg-neutral-50 rounded-lg p-3">
            <p className="text-neutral-500 text-xs">Total Profit</p>
            {isLoading ? (
              <Skeleton className="h-5 w-20 mt-1" />
            ) : (
              <p className="font-semibold mt-1 text-success">
                {formatCurrency(portfolio?.totalProfit || 0)}
              </p>
            )}
          </div>
          <div className="bg-neutral-50 rounded-lg p-3">
            <p className="text-neutral-500 text-xs">Transactions</p>
            {isLoading ? (
              <Skeleton className="h-5 w-12 mt-1" />
            ) : (
              <p className="font-semibold mt-1">{portfolio?.transactionCount || 0}</p>
            )}
          </div>
        </div>
      </div>
      
      <SendReceiveDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        type={dialogType}
        userId={userId}
      />
    </>
  );
}

import { cn } from "@/lib/utils";
