#!/usr/bin/env python3
import os
import json
import requests
from datetime import datetime

class CryptoAPIService:
    def __init__(self):
        self.api_key = os.environ.get('COINMARKETCAP_API_KEY')
        self.base_url = 'https://pro-api.coinmarketcap.com/v1'
        self.headers = {
            'X-CMC_PRO_API_KEY': self.api_key,
            'Accept': 'application/json'
        }
    
    def get_real_time_prices(self):
        """الحصول على أسعار العملات الحقيقية من CoinMarketCap"""
        try:
            symbols = ['BTC', 'ETH', 'BNB', 'SOL', 'DOGE', 'USDC']
            
            response = requests.get(
                f'{self.base_url}/cryptocurrency/quotes/latest',
                headers=self.headers,
                params={
                    'symbol': ','.join(symbols),
                    'convert': 'USD'
                },
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                crypto_data = []
                
                for symbol in symbols:
                    if symbol in data['data']:
                        coin = data['data'][symbol]
                        quote = coin['quote']['USD']
                        
                        crypto_data.append({
                            'symbol': symbol,
                            'name': coin['name'],
                            'price': round(quote['price'], 6),
                            'change_24h': round(quote['percent_change_24h'], 2),
                            'market_cap': quote['market_cap'],
                            'volume_24h': quote['volume_24h'],
                            'last_updated': quote['last_updated']
                        })
                
                return crypto_data
            else:
                print(f"خطأ في API: {response.status_code}")
                return self.get_fallback_data()
                
        except Exception as e:
            print(f"خطأ في الحصول على البيانات: {e}")
            return self.get_fallback_data()
    
    def get_fallback_data(self):
        """بيانات احتياطية عند فشل API"""
        return [
            {'symbol': 'BTC', 'name': 'Bitcoin', 'price': 67500.00, 'change_24h': 2.3},
            {'symbol': 'ETH', 'name': 'Ethereum', 'price': 3850.00, 'change_24h': 1.8},
            {'symbol': 'BNB', 'name': 'BNB', 'price': 635.00, 'change_24h': -0.5},
            {'symbol': 'SOL', 'name': 'Solana', 'price': 165.00, 'change_24h': 3.2},
            {'symbol': 'DOGE', 'name': 'Dogecoin', 'price': 0.38, 'change_24h': -1.1},
            {'symbol': 'USDC', 'name': 'USD Coin', 'price': 1.00, 'change_24h': 0.0}
        ]
    
    def get_top_cryptocurrencies(self, limit=10):
        """الحصول على أهم العملات المشفرة"""
        try:
            response = requests.get(
                f'{self.base_url}/cryptocurrency/listings/latest',
                headers=self.headers,
                params={
                    'start': 1,
                    'limit': limit,
                    'convert': 'USD'
                },
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                return [
                    {
                        'rank': coin['cmc_rank'],
                        'name': coin['name'],
                        'symbol': coin['symbol'],
                        'price': round(coin['quote']['USD']['price'], 6),
                        'change_24h': round(coin['quote']['USD']['percent_change_24h'], 2),
                        'market_cap': coin['quote']['USD']['market_cap'],
                        'volume_24h': coin['quote']['USD']['volume_24h']
                    }
                    for coin in data['data']
                ]
            else:
                return []
                
        except Exception as e:
            print(f"خطأ في الحصول على قائمة العملات: {e}")
            return []
    
    def check_api_status(self):
        """فحص حالة مفتاح API"""
        try:
            response = requests.get(
                f'{self.base_url}/key/info',
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    'status': 'active',
                    'plan': data['data']['plan']['name'],
                    'credits_used': data['data']['usage']['current_month']['credits_used'],
                    'credits_left': data['data']['usage']['current_month']['credits_left']
                }
            else:
                return {'status': 'error', 'message': f'HTTP {response.status_code}'}
                
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

# إنشاء كائن من الخدمة
crypto_service = CryptoAPIService()

# اختبار الخدمة
if __name__ == "__main__":
    print("🔍 اختبار خدمة CoinMarketCap API...")
    
    # فحص حالة API
    status = crypto_service.check_api_status()
    print(f"📊 حالة API: {status}")
    
    # الحصول على الأسعار
    prices = crypto_service.get_real_time_prices()
    print(f"💰 تم الحصول على {len(prices)} عملات مشفرة")
    
    for coin in prices:
        change_icon = "📈" if coin['change_24h'] > 0 else "📉"
        print(f"{change_icon} {coin['symbol']}: ${coin['price']:,.2f} ({coin['change_24h']:+.2f}%)")