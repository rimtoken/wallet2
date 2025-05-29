import axios, { AxiosInstance } from "axios";
import { apiConfig, isServiceConfigured } from "./config";

// Secure API client for external services
class ExternalAPIService {
  private coinGeckoClient: AxiosInstance;
  private coinMarketCapClient: AxiosInstance;
  
  constructor() {
    // Initialize CoinGecko client with authentication if API key is available
    this.coinGeckoClient = axios.create({
      baseURL: "https://api.coingecko.com/api/v3",
      timeout: 10000,
      headers: {
        "Accept": "application/json",
        ...(apiConfig.coinGecko && {
          "x-cg-demo-api-key": apiConfig.coinGecko
        })
      }
    });

    // Initialize CoinMarketCap client
    this.coinMarketCapClient = axios.create({
      baseURL: "https://pro-api.coinmarketcap.com/v1",
      timeout: 10000,
      headers: {
        "Accept": "application/json",
        ...(process.env.COINMARKETCAP_API_KEY && {
          "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY
        })
      }
    });
  }

  // Get cryptocurrency prices from CoinMarketCap or CoinGecko
  async getCryptoPrices(symbols: string[] = ["BTC", "ETH", "BNB", "SOL", "DOGE", "USDC"], vsCurrency: string = "USD") {
    // Try CoinMarketCap first if API key is available
    if (process.env.COINMARKETCAP_API_KEY) {
      try {
        const response = await this.coinMarketCapClient.get("/cryptocurrency/quotes/latest", {
          params: {
            symbol: symbols.join(","),
            convert: vsCurrency
          }
        });
        
        const formattedData: any = {};
        
        // Convert CoinMarketCap format to our expected format
        Object.values(response.data.data).forEach((coin: any) => {
          const symbol = coin.symbol.toLowerCase();
          const quote = coin.quote[vsCurrency];
          
          formattedData[symbol] = {
            [vsCurrency.toLowerCase()]: quote.price,
            [`${vsCurrency.toLowerCase()}_24h_change`]: quote.percent_change_24h,
            [`${vsCurrency.toLowerCase()}_market_cap`]: quote.market_cap,
            [`${vsCurrency.toLowerCase()}_24h_vol`]: quote.volume_24h
          };
        });
        
        return formattedData;
      } catch (error: any) {
        console.warn("CoinMarketCap API failed, falling back to CoinGecko:", error.message);
      }
    }

    // Fallback to CoinGecko
    try {
      const coinIdMap: Record<string, string> = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum', 
        'USDC': 'usd-coin',
        'SOL': 'solana',
        'DOGE': 'dogecoin',
        'BNB': 'binancecoin'
      };
      
      const coinIds = symbols.map(symbol => coinIdMap[symbol]).filter(Boolean);
      
      const response = await this.coinGeckoClient.get("/simple/price", {
        params: {
          ids: coinIds.join(","),
          vs_currencies: vsCurrency.toLowerCase(),
          include_24hr_change: true,
          include_market_cap: true,
          include_24hr_vol: true
        }
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429) {
        throw new Error("Rate limit exceeded. Please provide API credentials for higher limits.");
      }
      throw new Error(`Failed to fetch crypto prices: ${error.message}`);
    }
  }

  // Get detailed market data
  async getMarketData(coinIds: string[], vsCurrency: string = "usd") {
    try {
      const response = await this.coinGeckoClient.get("/coins/markets", {
        params: {
          vs_currency: vsCurrency,
          ids: coinIds.join(","),
          order: "market_cap_desc",
          per_page: 250,
          page: 1,
          sparkline: true,
          price_change_percentage: "24h"
        }
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429) {
        throw new Error("Rate limit exceeded. Please configure COINGECKO_API_KEY for higher limits.");
      }
      throw new Error(`Failed to fetch market data: ${error.message}`);
    }
  }

  // Check API health and authentication status
  async checkAPIHealth() {
    try {
      const response = await this.coinGeckoClient.get("/ping");
      
      return {
        coingecko: {
          status: "connected",
          authenticated: isServiceConfigured("COINGECKO_API_KEY"),
          message: response.data?.gecko_says || "API is working"
        }
      };
    } catch (error: any) {
      return {
        coingecko: {
          status: "error",
          authenticated: false,
          message: error.message
        }
      };
    }
  }
}

export const externalAPIService = new ExternalAPIService();