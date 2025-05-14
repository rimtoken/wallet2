import { WalletAsset } from "@shared/schema";
import { formatCurrency, formatCrypto, formatPercent } from "@/lib/api";
import { CryptoIcon } from "@/components/crypto-icon";

interface AssetItemProps {
  asset: WalletAsset;
}

export function AssetItem({ asset }: AssetItemProps) {
  const { name, symbol, balance, price, value, priceChangePercentage24h } = asset;
  
  // Determine if the price change is positive, negative or neutral
  const getPriceChangeClass = () => {
    if (priceChangePercentage24h > 0) return "text-success";
    if (priceChangePercentage24h < 0) return "text-error";
    return "text-neutral-500";
  };
  
  return (
    <tr className="border-b border-neutral-200 hover:bg-neutral-50">
      <td className="py-4 px-2">
        <div className="flex items-center">
          <CryptoIcon symbol={symbol} name={name} />
          <div className="ml-3">
            <div className="font-medium">{name}</div>
            <div className="text-neutral-500 text-xs">{symbol}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-2 text-right">
        <div className="font-medium">{formatCrypto(balance, symbol)}</div>
      </td>
      <td className="py-4 px-2 text-right">
        <div className="font-medium">{formatCurrency(price)}</div>
      </td>
      <td className="py-4 px-2 text-right hidden sm:table-cell">
        <div className={`font-medium ${getPriceChangeClass()}`}>
          {formatPercent(priceChangePercentage24h)}
        </div>
      </td>
      <td className="py-4 px-2 text-right">
        <div className="font-medium">{formatCurrency(value)}</div>
      </td>
    </tr>
  );
}
