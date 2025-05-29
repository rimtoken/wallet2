import axios from 'axios';

// خدمة محدثة للحصول على البيانات الحقيقية من CoinMarketCap
class CryptoAPIService {
  private cmcClient: any;
  
  constructor() {
    this.cmcClient = axios.create({
      baseURL: 'https://pro-api.coinmarketcap.com/v1',
      timeout: 10000,
      headers: {
        'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
        'Accept': 'application/json'
      }
    });
  }

  // الحصول على أسعار العملات الحقيقية
  async getRealTimePrices() {
    try {
      const symbols = ['BTC', 'ETH', 'BNB', 'SOL', 'DOGE', 'USDC'];
      
      const response = await this.cmcClient.get('/cryptocurrency/quotes/latest', {
        params: {
          symbol: symbols.join(','),
          convert: 'USD'
        }
      });

      const cryptoData = [];
      
      for (const symbol of symbols) {
        const coinData = response.data.data[symbol];
        if (coinData) {
          const quote = coinData.quote.USD;
          
          cryptoData.push({
            symbol: symbol,
            name: coinData.name,
            price: quote.price,
            change_24h: quote.percent_change_24h,
            market_cap: quote.market_cap,
            volume_24h: quote.volume_24h,
            last_updated: quote.last_updated
          });
        }
      }
      
      return cryptoData;
    } catch (error: any) {
      console.error('خطأ في الحصول على بيانات CoinMarketCap:', error.message);
      throw error;
    }
  }

  // الحصول على أهم العملات المشفرة
  async getTopCryptocurrencies(limit: number = 20) {
    try {
      const response = await this.cmcClient.get('/cryptocurrency/listings/latest', {
        params: {
          start: 1,
          limit: limit,
          convert: 'USD'
        }
      });

      return response.data.data.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price: coin.quote.USD.price,
        change_24h: coin.quote.USD.percent_change_24h,
        change_7d: coin.quote.USD.percent_change_7d,
        market_cap: coin.quote.USD.market_cap,
        volume_24h: coin.quote.USD.volume_24h,
        rank: coin.cmc_rank
      }));
    } catch (error: any) {
      console.error('خطأ في الحصول على قائمة العملات:', error.message);
      throw error;
    }
  }

  // معلومات تفصيلية عن عملة معينة
  async getCoinDetails(symbol: string) {
    try {
      const response = await this.cmcClient.get('/cryptocurrency/info', {
        params: {
          symbol: symbol
        }
      });

      const coinInfo = response.data.data[symbol];
      if (!coinInfo) {
        throw new Error(`العملة ${symbol} غير موجودة`);
      }

      return {
        id: coinInfo.id,
        name: coinInfo.name,
        symbol: coinInfo.symbol,
        description: coinInfo.description,
        website: coinInfo.urls.website[0],
        explorer: coinInfo.urls.explorer[0],
        source_code: coinInfo.urls.source_code[0],
        logo: coinInfo.logo
      };
    } catch (error: any) {
      console.error(`خطأ في الحصول على معلومات ${symbol}:`, error.message);
      throw error;
    }
  }

  // فحص حالة الاتصال بـ API
  async checkAPIStatus() {
    try {
      const response = await this.cmcClient.get('/key/info');
      
      return {
        status: 'active',
        plan: response.data.data.plan.name,
        credits_used: response.data.data.usage.current_month.credits_used,
        credits_left: response.data.data.usage.current_month.credits_left
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }
}

export const cryptoAPI = new CryptoAPIService();