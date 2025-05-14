import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletAsset } from "@shared/schema";
import { AssetItem } from "./asset-item";

interface AssetListProps {
  userId: number;
}

type AssetFilter = 'all' | 'gainers' | 'losers';

export function AssetList({ userId }: AssetListProps) {
  const [filter, setFilter] = useState<AssetFilter>('all');
  
  const { data: assets, isLoading } = useQuery<WalletAsset[]>({
    queryKey: [`/api/wallets/${userId}`],
  });
  
  // Apply filter to assets
  const filteredAssets = assets?.filter(asset => {
    if (filter === 'all') return true;
    if (filter === 'gainers') return asset.priceChangePercentage24h > 0;
    if (filter === 'losers') return asset.priceChangePercentage24h < 0;
    return true;
  });
  
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-200 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">My Assets</h2>
        <div className="relative">
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as AssetFilter)}
          >
            <SelectTrigger className="bg-neutral-100 h-9 border-0 text-sm">
              <SelectValue placeholder="All Assets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assets</SelectItem>
              <SelectItem value="gainers">Gainers</SelectItem>
              <SelectItem value="losers">Losers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-neutral-500 text-xs uppercase border-b border-neutral-200">
              <th className="text-left font-medium py-3 px-2">Asset</th>
              <th className="text-right font-medium py-3 px-2">Balance</th>
              <th className="text-right font-medium py-3 px-2">Price</th>
              <th className="text-right font-medium py-3 px-2 hidden sm:table-cell">24h Change</th>
              <th className="text-right font-medium py-3 px-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Skeleton loading state
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-neutral-200">
                  <td className="py-4 px-2">
                    <div className="flex items-center">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="ml-3">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-8 mt-1" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </td>
                  <td className="py-4 px-2 text-right">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </td>
                  <td className="py-4 px-2 text-right hidden sm:table-cell">
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </td>
                  <td className="py-4 px-2 text-right">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </td>
                </tr>
              ))
            ) : (
              filteredAssets?.map((asset) => (
                <AssetItem key={asset.id} asset={asset} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
