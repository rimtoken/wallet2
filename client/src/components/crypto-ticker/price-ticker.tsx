import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChangePercentage24h: number;
}

export function PriceTicker() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // في بيئة حقيقية، سنقوم بالاتصال بـ API لجلب أسعار العملات
    // مثال: CoinGecko API أو Binance API
    // لهذا المثال، سنستخدم بيانات وهمية

    const mockPrices: CryptoPrice[] = [
      { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 65789.32, priceChangePercentage24h: 2.45 },
      { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 3458.91, priceChangePercentage24h: 1.23 },
      { id: "binancecoin", symbol: "BNB", name: "Binance Coin", price: 567.89, priceChangePercentage24h: -0.78 },
      { id: "solana", symbol: "SOL", name: "Solana", price: 142.56, priceChangePercentage24h: 5.67 },
      { id: "ripple", symbol: "XRP", name: "XRP", price: 0.5678, priceChangePercentage24h: -1.45 },
      { id: "cardano", symbol: "ADA", name: "Cardano", price: 0.4123, priceChangePercentage24h: 0.89 },
      { id: "polkadot", symbol: "DOT", name: "Polkadot", price: 6.78, priceChangePercentage24h: 3.21 },
      { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", price: 0.1234, priceChangePercentage24h: -2.34 },
      { id: "avalanche-2", symbol: "AVAX", name: "Avalanche", price: 35.67, priceChangePercentage24h: 4.56 },
      { id: "chainlink", symbol: "LINK", name: "Chainlink", price: 15.89, priceChangePercentage24h: 1.98 },
      { id: "polygon", symbol: "MATIC", name: "Polygon", price: 0.6789, priceChangePercentage24h: -0.45 },
      { id: "near", symbol: "NEAR", name: "Near Protocol", price: 5.67, priceChangePercentage24h: 2.34 },
      { id: "uniswap", symbol: "UNI", name: "Uniswap", price: 8.91, priceChangePercentage24h: -1.23 },
      { id: "litecoin", symbol: "LTC", name: "Litecoin", price: 78.90, priceChangePercentage24h: 0.56 },
      { id: "cosmos", symbol: "ATOM", name: "Cosmos", price: 9.87, priceChangePercentage24h: 1.78 },
    ];

    // محاكاة لتأخير الشبكة
    setTimeout(() => {
      setPrices(mockPrices);
      setIsLoading(false);
    }, 1000);

    // في التطبيق الحقيقي، سيكون لدينا اشتراك في تحديثات الأسعار المباشرة
    // مثلا استخدام websocket
    const intervalId = setInterval(() => {
      setPrices(prevPrices => 
        prevPrices.map(crypto => ({
          ...crypto,
          price: crypto.price * (1 + (Math.random() * 0.02 - 0.01)), // تغيير السعر بنسبة -1% إلى +1%
          priceChangePercentage24h: crypto.priceChangePercentage24h + (Math.random() * 0.4 - 0.2) // تغيير نسبة التغيير
        }))
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-900 text-white py-1 overflow-hidden">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-8">
            <span className="animate-pulse">جاري تحميل أسعار العملات...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white py-1 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap">
        {prices.map((crypto) => (
          <span key={crypto.id} className="inline-block mx-4">
            <span className="font-medium">{crypto.name}</span>
            <span className="text-gray-400 mx-1">({crypto.symbol})</span>
            <span className="font-bold">${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</span>
            <span 
              className={`ml-2 ${crypto.priceChangePercentage24h >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center inline-flex`}
            >
              {crypto.priceChangePercentage24h >= 0 ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(crypto.priceChangePercentage24h).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}