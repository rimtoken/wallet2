import axios, { AxiosInstance } from "axios";
import { apiConfig, isServiceConfigured } from "./config";

// Secure API client for external services
class ExternalAPIService {
  private coinGeckoClient: AxiosInstance;
  
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
  }

  // Get cryptocurrency prices with proper authentication
  async getCryptoPrices(coinIds: string[], vsCurrency: string = "usd") {
    try {
      const endpoint = isServiceConfigured("COINGECKO_API_KEY") 
        ? "/simple/price" // Pro endpoint with API key
        : "/simple/price"; // Public endpoint
        
      const response = await this.coinGeckoClient.get(endpoint, {
        params: {
          ids: coinIds.join(","),
          vs_currencies: vsCurrency,
          include_24hr_change: true,
          include_market_cap: true,
          include_24hr_vol: true
        }
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429) {
        throw new Error("Rate limit exceeded. Please configure COINGECKO_API_KEY for higher limits.");
      }
      if (error.response?.status === 401) {
        throw new Error("Invalid CoinGecko API key. Please check your COINGECKO_API_KEY configuration.");
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