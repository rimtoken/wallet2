import { MarketAsset } from "@shared/schema";
import { CryptoIcon } from "@/components/crypto-icon";
import { Sparkline } from "@/components/ui/sparkline";
import { formatCurrency, formatPercent } from "@/lib/api";

interface MarketItemProps {
  asset: MarketAsset;
  timeRange: string;
}

export function MarketItem({ asset, timeRange }: MarketItemProps) {
  const { name, symbol, price, priceChangePercentage24h, sparklineData } = asset;
  
  // Determine color based on price change
  const getPriceChangeColor = () => {
    if (priceChangePercentage24h > 0) return "text-success";
    if (priceChangePercentage24h < 0) return "text-error";
    return "text-neutral-500";
  };
  
  // Determine trend for sparkline
  const getTrend = () => {
    if (priceChangePercentage24h > 0) return "up";
    if (priceChangePercentage24h < 0) return "down";
    return "neutral";
  };
  
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors">
      <div className="flex items-center">
        <CryptoIcon symbol={symbol} name={name} size="sm" />
        <div className="ml-3">
          <div className="font-medium">{name}</div>
          <div className="text-neutral-500 text-xs">{symbol}</div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-medium">{formatCurrency(price)}</span>
        <span className={getPriceChangeColor() + " text-xs"}>
          {formatPercent(priceChangePercentage24h)}
        </span>
      </div>
      <div className="w-20">
        <Sparkline 
          data={sparklineData}
          width={80}
          height={30}
          trend={getTrend()}
        />
      </div>
    </div>
  );
}
