import { cn } from "@/lib/utils";

interface CryptoIconProps {
  symbol: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CryptoIcon({ symbol, name, size = 'md', className }: CryptoIconProps) {
  // Define size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-12 h-12 text-lg'
  };
  
  // Get background and text color based on symbol
  const getColorClasses = (symbol: string) => {
    switch (symbol) {
      case 'BTC':
        return 'bg-orange-100 text-orange-600';
      case 'ETH':
        return 'bg-blue-100 text-blue-600';
      case 'USDC':
      case 'USDT':
        return 'bg-green-100 text-green-600';
      case 'SOL':
        return 'bg-purple-100 text-purple-600';
      case 'DOGE':
        return 'bg-blue-100 text-blue-600';
      case 'BNB':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-neutral-100 text-neutral-600';
    }
  };
  
  // Get icon character based on symbol
  const getIconChar = (symbol: string) => {
    switch (symbol) {
      case 'BTC':
        return '₿';
      case 'ETH':
        return 'Ξ';
      case 'USDC':
      case 'USDT':
        return '$';
      case 'SOL':
        return 'S';
      case 'DOGE':
        return 'D';
      case 'BNB':
        return 'B';
      default:
        return symbol.charAt(0);
    }
  };
  
  const colorClasses = getColorClasses(symbol);
  const iconChar = getIconChar(symbol);
  
  return (
    <div 
      className={cn(
        'crypto-icon border-radius-50 flex items-center justify-center font-bold rounded-full',
        sizeClasses[size],
        colorClasses,
        className
      )}
      title={name}
    >
      <span>{iconChar}</span>
    </div>
  );
}
