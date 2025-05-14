import { Transaction } from "@shared/schema";
import { formatCurrency, formatCrypto, formatDate } from "@/lib/api";

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'receive':
        return {
          bgColor: 'bg-green-100',
          iconClass: 'ri-arrow-down-line text-success'
        };
      case 'send':
        return {
          bgColor: 'bg-red-100',
          iconClass: 'ri-arrow-up-line text-error'
        };
      case 'swap':
        return {
          bgColor: 'bg-blue-100',
          iconClass: 'ri-swap-line text-blue-600'
        };
      default:
        return {
          bgColor: 'bg-neutral-100',
          iconClass: 'ri-exchange-funds-line text-neutral-600'
        };
    }
  };

  const getTransactionTitle = () => {
    const assetSymbol = transaction.asset?.symbol || '';
    
    switch (transaction.type) {
      case 'receive':
        return `Received ${assetSymbol}`;
      case 'send':
        return `Sent ${assetSymbol}`;
      case 'swap':
        // Extract target currency from toAddress (format: swap:USDC)
        const targetCurrency = transaction.toAddress?.split(':')[1] || 'Crypto';
        return `Swapped ${assetSymbol} to ${targetCurrency}`;
      default:
        return `${transaction.type} ${assetSymbol}`;
    }
  };

  const getAmountClass = () => {
    return transaction.type === 'receive' 
      ? 'text-success' 
      : transaction.type === 'send' 
        ? 'text-error' 
        : 'text-neutral-700';
  };

  const getAmountPrefix = () => {
    return transaction.type === 'receive' 
      ? '+' 
      : transaction.type === 'send' 
        ? '-' 
        : '';
  };

  const icon = getTransactionIcon();
  const assetSymbol = transaction.asset?.symbol || '';
  const amountClass = getAmountClass();
  const amountPrefix = getAmountPrefix();
  
  // Calculate approximate USD value based on amount
  // In real app, this would use historical price data
  const usdValue = Number(transaction.amount) * 42000; // Mock conversion rate
  
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full ${icon.bgColor} flex items-center justify-center`}>
          <i className={icon.iconClass}></i>
        </div>
        <div className="ml-3">
          <div className="font-medium">{getTransactionTitle()}</div>
          <div className="text-neutral-500 text-xs">{formatDate(transaction.createdAt)}</div>
        </div>
      </div>
      <div className="text-right">
        <div className={`font-medium ${amountClass}`}>
          {amountPrefix}{formatCrypto(Number(transaction.amount), assetSymbol)}
        </div>
        <div className="text-neutral-500 text-xs">{formatCurrency(usdValue)}</div>
      </div>
    </div>
  );
}
