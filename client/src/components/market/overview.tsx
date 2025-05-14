import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MarketAsset } from "@shared/schema";
import { MarketItem } from "./market-item";
import { refreshMarketData } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type TimeRange = '24h' | '7d' | '30d';

export function MarketOverview() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: marketData, isLoading } = useQuery<MarketAsset[]>({
    queryKey: ['/api/market'],
  });
  
  // Auto-refresh market data every 60 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      await handleRefresh();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshMarketData();
      await queryClient.invalidateQueries({ queryKey: ['/api/market'] });
      toast({
        title: "Market data refreshed",
        description: "Latest cryptocurrency prices have been updated.",
      });
    } catch (error) {
      toast({
        title: "Failed to refresh market data",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-200 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold">Market Overview</h2>
          {isRefreshing ? (
            <Loader2 className="w-4 h-4 ml-2 animate-spin text-neutral-400" />
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-1 p-1 h-6 text-neutral-500"
              onClick={handleRefresh}
            >
              <i className="ri-refresh-line text-lg"></i>
            </Button>
          )}
        </div>
        <div className="relative">
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as TimeRange)}
          >
            <SelectTrigger className="bg-neutral-100 border-0 h-8 text-sm">
              <SelectValue placeholder="24h" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24h</SelectItem>
              <SelectItem value="7d">7d</SelectItem>
              <SelectItem value="30d">30d</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          // Skeleton loading state
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="ml-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-8 mt-1" />
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-12 mt-1" />
              </div>
              <div className="w-20">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))
        ) : (
          marketData?.map((asset) => (
            <MarketItem key={asset.id} asset={asset} timeRange={timeRange} />
          ))
        )}
      </div>
    </div>
  );
}
