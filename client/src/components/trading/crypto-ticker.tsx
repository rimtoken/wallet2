import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronUp, ChevronDown } from "lucide-react";

type CryptoPrice = {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  icon: string;
};

export function CryptoTicker() {
  const [cryptoData, setCryptoData] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // في حالة وجود API، يمكن استبدال هذه البيانات الثابتة بطلب فعلي
    const mockData: CryptoPrice[] = [
      {
        symbol: "BTC",
        name: "Bitcoin",
        price: 58432.21,
        change24h: 2.34,
        volume24h: 32456789012,
        marketCap: 1095432567890,
        icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png"
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        price: 3456.78,
        change24h: -1.23,
        volume24h: 18765432109,
        marketCap: 432567890123,
        icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png"
      },
      {
        symbol: "BNB",
        name: "Binance Coin",
        price: 567.89,
        change24h: 3.45,
        volume24h: 5678901234,
        marketCap: 98765432109,
        icon: "https://cryptologos.cc/logos/bnb-bnb-logo.png"
      },
      {
        symbol: "SOL",
        name: "Solana",
        price: 123.45,
        change24h: 5.67,
        volume24h: 4567890123,
        marketCap: 76543210987,
        icon: "https://cryptologos.cc/logos/solana-sol-logo.png"
      },
      {
        symbol: "RIM",
        name: "RIM Token",
        price: 95.46,
        change24h: 5.8,
        volume24h: 1800000000,
        marketCap: 28700000000,
        icon: "/logo.png" // استخدم شعار الموقع
      }
    ];

    // محاكاة تحميل البيانات
    const timer = setTimeout(() => {
      setCryptoData(mockData);
      setLoading(false);
    }, 1000);

    // في بيئة حقيقية، يمكن استخدام واجهة برمجية حية مثل:
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1');
    //     const data = await response.json();
    //     setCryptoData(data.map(coin => ({
    //       symbol: coin.symbol.toUpperCase(),
    //       name: coin.name,
    //       price: coin.current_price,
    //       change24h: coin.price_change_percentage_24h,
    //       volume24h: coin.total_volume,
    //       marketCap: coin.market_cap,
    //       icon: coin.image
    //     })));
    //   } catch (error) {
    //     console.error('Error fetching crypto data:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();

    return () => clearTimeout(timer);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  return (
    <div className="w-full overflow-hidden bg-white shadow-md rounded-lg">
      {loading ? (
        <div className="p-4 flex justify-center items-center h-20">
          <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">العملة</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعر</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التغير (24س)</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حجم التداول (24س)</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">القيمة السوقية</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cryptoData.map((crypto) => (
                <tr key={crypto.symbol} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-8 w-8 rounded-full" src={crypto.icon} alt={crypto.name} />
                      <div className="mr-3">
                        <div className="text-sm font-medium text-gray-900">{crypto.name}</div>
                        <div className="text-sm text-gray-500">{crypto.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    ${crypto.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className={`flex items-center justify-end ${crypto.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {crypto.change24h >= 0 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      {Math.abs(crypto.change24h)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    ${formatNumber(crypto.volume24h)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    ${formatNumber(crypto.marketCap)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}