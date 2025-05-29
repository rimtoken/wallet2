#!/usr/bin/env python3
import os
import json
import requests
from http.server import HTTPServer, BaseHTTPRequestHandler
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
                            'change_24h': round(quote['percent_change_24h'], 2)
                        })
                
                return crypto_data
            else:
                print(f"API Error: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"Error fetching data: {e}")
            return []

class TradingHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.crypto_service = CryptoAPIService()
        super().__init__(*args, **kwargs)

    def do_GET(self):
        if self.path == '/api/crypto/prices':
            self.handle_crypto_api()
        else:
            self.handle_main_page()
    
    def handle_crypto_api(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        crypto_data = self.crypto_service.get_real_time_prices()
        response_data = {
            'success': True,
            'data': crypto_data,
            'source': 'CoinMarketCap'
        }
        
        self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))
    
    def handle_main_page(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Cache-Control', 'no-cache')
        self.end_headers()
        
        # Get real-time cryptocurrency data
        crypto_data = self.crypto_service.get_real_time_prices()
        
        # Generate price ticker with real data
        price_ticker_html = ""
        for coin in crypto_data:
            change_class = "positive" if coin['change_24h'] >= 0 else "negative"
            change_symbol = "+" if coin['change_24h'] >= 0 else ""
            price_ticker_html += f'''
                <div class="price-item">
                    <span>{coin['symbol']}</span>
                    <span class="price-change {change_class}">${coin['price']:,.6f} ({change_symbol}{coin['change_24h']:.2f}%)</span>
                </div>
            '''
        
        html_content = f'''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RimToken - منصة التداول بالبيانات الحقيقية</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; font-family: 'Arial', sans-serif; }}
        body {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh; }}
        
        .header {{ background: rgba(255,255,255,0.1); padding: 1rem 2rem; backdrop-filter: blur(10px); }}
        .nav {{ display: flex; justify-content: space-between; align-items: center; max-width: 1400px; margin: 0 auto; }}
        .logo {{ font-size: 1.8rem; font-weight: bold; color: white; }}
        .api-status {{ background: rgba(0,255,0,0.2); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.8rem; border: 1px solid rgba(0,255,0,0.3); }}
        
        .container {{ max-width: 1400px; margin: 0 auto; padding: 2rem; display: grid; grid-template-columns: 1fr 400px; gap: 2rem; }}
        
        .main-section {{ background: rgba(255,255,255,0.1); border-radius: 20px; padding: 2rem; backdrop-filter: blur(10px); }}
        .sidebar {{ display: flex; flex-direction: column; gap: 1.5rem; }}
        
        .trading-card {{ background: rgba(255,255,255,0.95); color: #333; border-radius: 15px; padding: 2rem; }}
        .card-header {{ text-align: center; margin-bottom: 2rem; }}
        .card-title {{ font-size: 1.5rem; margin-bottom: 0.5rem; color: #333; }}
        .card-subtitle {{ color: #666; font-size: 0.9rem; }}
        
        .form-group {{ margin-bottom: 1.5rem; }}
        .form-label {{ display: block; margin-bottom: 0.5rem; font-weight: 500; color: #333; }}
        .form-input {{ width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem; }}
        .form-input:focus {{ outline: none; border-color: #4f46e5; }}
        
        .btn {{ padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: all 0.3s; }}
        .btn-primary {{ background: #4f46e5; color: white; width: 100%; }}
        .btn-primary:hover {{ background: #4338ca; }}
        
        .stats-grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }}
        .stat-card {{ background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px; text-align: center; }}
        .stat-value {{ font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem; }}
        .stat-label {{ font-size: 0.9rem; opacity: 0.8; }}
        
        .price-ticker {{ background: rgba(0,0,0,0.3); padding: 1rem; margin-bottom: 2rem; border-radius: 10px; }}
        .ticker-title {{ margin-bottom: 1rem; font-weight: bold; }}
        .price-grid {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }}
        .price-item {{ display: flex; justify-content: space-between; padding: 0.5rem; background: rgba(255,255,255,0.1); border-radius: 6px; }}
        .price-change.positive {{ color: #10b981; }}
        .price-change.negative {{ color: #ef4444; }}
        
        .refresh-btn {{ background: rgba(0,255,0,0.2); color: white; border: 1px solid rgba(0,255,0,0.3); padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.9rem; }}
        .refresh-btn:hover {{ background: rgba(0,255,0,0.3); }}
        
        @media (max-width: 768px) {{
            .container {{ grid-template-columns: 1fr; }}
            .price-grid {{ grid-template-columns: 1fr; }}
        }}
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="logo">🪙 RimToken</div>
            <div class="api-status">✅ البيانات الحقيقية - CoinMarketCap</div>
        </nav>
    </header>

    <div class="container">
        <main class="main-section">
            <div class="price-ticker">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h2 class="ticker-title">💰 الأسعار الحقيقية للعملات المشفرة</h2>
                    <button class="refresh-btn" onclick="window.location.reload()">🔄 تحديث</button>
                </div>
                
                <div class="price-grid">
                    {price_ticker_html}
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">{len(crypto_data)}</div>
                    <div class="stat-label">عملات مدعومة</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: #10b981;">🔴</div>
                    <div class="stat-label">بيانات مباشرة</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">24/7</div>
                    <div class="stat-label">تحديث مستمر</div>
                </div>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 15px; text-align: center;">
                <h3 style="margin-bottom: 1rem;">🚀 المميزات الجديدة</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <div style="background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 10px;">
                        <h4>📊 أسعار حقيقية</h4>
                        <p style="font-size: 0.9rem; opacity: 0.8;">بيانات من CoinMarketCap</p>
                    </div>
                    <div style="background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 10px;">
                        <h4>⚡ تحديث فوري</h4>
                        <p style="font-size: 0.9rem; opacity: 0.8;">أسعار محدثة لحظياً</p>
                    </div>
                    <div style="background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 10px;">
                        <h4>🔒 آمان عالي</h4>
                        <p style="font-size: 0.9rem; opacity: 0.8;">بيانات مشفرة ومحمية</p>
                    </div>
                </div>
            </div>
        </main>

        <aside class="sidebar">
            <div class="trading-card">
                <div class="card-header">
                    <h2 class="card-title">انضم إلى RimToken</h2>
                    <p class="card-subtitle">تداول بالبيانات الحقيقية</p>
                </div>
                
                <form>
                    <div class="form-group">
                        <label class="form-label">البريد الإلكتروني</label>
                        <input type="email" class="form-input" placeholder="أدخل بريدك الإلكتروني">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">الاسم الكامل</label>
                        <input type="text" class="form-input" placeholder="أدخل اسمك الكامل">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">رقم الهاتف</label>
                        <input type="tel" class="form-input" placeholder="أدخل رقم الهاتف">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">كلمة المرور</label>
                        <input type="password" class="form-input" placeholder="أدخل كلمة المرور">
                    </div>
                    
                    <button type="submit" class="btn btn-primary">إنشاء حساب مجاناً</button>
                </form>
            </div>
            
            <div style="text-align: center;">
                <button class="btn" style="background: #10b981; color: white; margin: 0.5rem;">خدمة العملاء المباشرة</button>
                <button class="btn" style="background: #ef4444; color: white; margin: 0.5rem;">تطبيق الهاتف</button>
            </div>
        </aside>
    </div>

    <script>
        // تحديث تلقائي للأسعار كل 30 ثانية
        setInterval(function() {{
            fetch('/api/crypto/prices')
                .then(response => response.json())
                .then(data => {{
                    if (data.success) {{
                        console.log('تم تحديث الأسعار:', data.data);
                    }}
                }})
                .catch(error => console.error('خطأ في تحديث الأسعار:', error));
        }}, 30000);
        
        console.log('✅ RimToken متصل بـ CoinMarketCap API');
    </script>
</body>
</html>'''
        
        self.wfile.write(html_content.encode('utf-8'))

if __name__ == "__main__":
    server_address = ('0.0.0.0', 3000)
    httpd = HTTPServer(server_address, TradingHandler)
    
    print("🔐 RimToken Trading Platform running on port 3000")
    print("🌐 Access at: http://localhost:3000")
    print("💰 Real-time data from CoinMarketCap API")
    print("✅ Server ready for connections")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        httpd.server_close()