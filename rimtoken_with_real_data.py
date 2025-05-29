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
                return []
                
        except Exception as e:
            print(f"خطأ في الحصول على البيانات: {e}")
            return []

class RimTokenHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.crypto_service = CryptoAPIService()
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        if self.path == '/api/crypto/prices':
            self.handle_crypto_api()
        else:
            self.handle_main_page()
    
    def handle_crypto_api(self):
        """واجهة برمجة التطبيقات للحصول على أسعار العملات"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        crypto_data = self.crypto_service.get_real_time_prices()
        response_data = {
            'success': True,
            'data': crypto_data,
            'last_updated': datetime.now().isoformat(),
            'source': 'CoinMarketCap'
        }
        
        self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))
    
    def handle_main_page(self):
        """الصفحة الرئيسية مع البيانات الحقيقية"""
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Cache-Control', 'no-cache')
        self.end_headers()
        
        # الحصول على البيانات الحقيقية
        crypto_data = self.crypto_service.get_real_time_prices()
        
        # تحويل البيانات إلى JavaScript
        crypto_js_data = json.dumps(crypto_data, ensure_ascii=False)
        
        html_content = f'''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RimToken - منصة التداول مع البيانات الحقيقية</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; font-family: 'Arial', sans-serif; }}
        body {{ 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            min-height: 100vh; 
        }}
        
        .header {{ 
            background: rgba(255,255,255,0.1); 
            padding: 1rem 2rem; 
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }}
        
        .nav {{ 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            max-width: 1400px; 
            margin: 0 auto; 
        }}
        
        .logo {{ 
            font-size: 1.8rem; 
            font-weight: bold; 
            color: white; 
        }}
        
        .api-status {{
            background: rgba(0,255,0,0.2);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            border: 1px solid rgba(0,255,0,0.3);
        }}
        
        .container {{ 
            max-width: 1400px; 
            margin: 0 auto; 
            padding: 2rem; 
            display: grid; 
            grid-template-columns: 1fr 400px; 
            gap: 2rem; 
        }}
        
        .main-section {{ 
            background: rgba(255,255,255,0.1); 
            border-radius: 20px; 
            padding: 2rem; 
            backdrop-filter: blur(10px); 
        }}
        
        .real-time-prices {{
            background: rgba(0,0,0,0.3);
            padding: 2rem;
            border-radius: 15px;
            margin-bottom: 2rem;
        }}
        
        .prices-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }}
        
        .prices-title {{
            font-size: 1.5rem;
            font-weight: bold;
        }}
        
        .last-updated {{
            font-size: 0.8rem;
            opacity: 0.7;
        }}
        
        .crypto-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
        }}
        
        .crypto-card {{
            background: rgba(255,255,255,0.1);
            padding: 1.5rem;
            border-radius: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: transform 0.3s ease;
        }}
        
        .crypto-card:hover {{
            transform: translateY(-2px);
            background: rgba(255,255,255,0.15);
        }}
        
        .crypto-info {{
            display: flex;
            flex-direction: column;
        }}
        
        .crypto-symbol {{
            font-size: 1.2rem;
            font-weight: bold;
        }}
        
        .crypto-name {{
            font-size: 0.9rem;
            opacity: 0.8;
        }}
        
        .crypto-price {{
            text-align: left;
            display: flex;
            flex-direction: column;
        }}
        
        .price-value {{
            font-size: 1.3rem;
            font-weight: bold;
        }}
        
        .price-change {{
            font-size: 0.9rem;
            padding: 0.2rem 0.5rem;
            border-radius: 6px;
            text-align: center;
        }}
        
        .positive {{ background: rgba(0,255,0,0.2); color: #00ff00; }}
        .negative {{ background: rgba(255,0,0,0.2); color: #ff6b6b; }}
        
        .sidebar {{ 
            display: flex; 
            flex-direction: column; 
            gap: 1.5rem; 
        }}
        
        .trading-card {{ 
            background: rgba(255,255,255,0.95); 
            color: #333; 
            border-radius: 15px; 
            padding: 2rem; 
        }}
        
        .card-header {{ 
            text-align: center; 
            margin-bottom: 2rem; 
        }}
        
        .card-title {{ 
            font-size: 1.5rem; 
            margin-bottom: 0.5rem; 
            color: #333; 
        }}
        
        .card-subtitle {{ 
            color: #666; 
            font-size: 0.9rem; 
        }}
        
        .form-group {{ 
            margin-bottom: 1.5rem; 
        }}
        
        .form-label {{ 
            display: block; 
            margin-bottom: 0.5rem; 
            font-weight: 500; 
            color: #333; 
        }}
        
        .form-input {{ 
            width: 100%; 
            padding: 0.75rem; 
            border: 2px solid #e5e7eb; 
            border-radius: 8px; 
            font-size: 1rem; 
        }}
        
        .form-input:focus {{ 
            outline: none; 
            border-color: #4f46e5; 
        }}
        
        .btn {{ 
            padding: 0.75rem 1.5rem; 
            border: none; 
            border-radius: 8px; 
            font-size: 1rem; 
            font-weight: 500; 
            cursor: pointer; 
            transition: all 0.3s; 
        }}
        
        .btn-primary {{ 
            background: #4f46e5; 
            color: white; 
            width: 100%; 
        }}
        
        .btn-primary:hover {{ 
            background: #4338ca; 
        }}
        
        .refresh-btn {{
            background: rgba(0,255,0,0.2);
            color: white;
            border: 1px solid rgba(0,255,0,0.3);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
        }}
        
        .refresh-btn:hover {{
            background: rgba(0,255,0,0.3);
        }}
        
        @media (max-width: 768px) {{
            .container {{ grid-template-columns: 1fr; }}
            .crypto-grid {{ grid-template-columns: 1fr; }}
        }}
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="logo">🪙 RimToken</div>
            <div class="api-status">
                ✅ البيانات الحقيقية مفعلة - CoinMarketCap
            </div>
        </nav>
    </header>

    <div class="container">
        <main class="main-section">
            <div class="real-time-prices">
                <div class="prices-header">
                    <h2 class="prices-title">💰 الأسعار الحقيقية للعملات المشفرة</h2>
                    <div>
                        <button class="refresh-btn" onclick="refreshPrices()">🔄 تحديث</button>
                        <div class="last-updated" id="lastUpdated">آخر تحديث: الآن</div>
                    </div>
                </div>
                
                <div class="crypto-grid" id="cryptoGrid">
                    <!-- سيتم ملء البيانات عبر JavaScript -->
                </div>
            </div>
            
            <div class="stats-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem;">6</div>
                    <div style="font-size: 0.9rem; opacity: 0.8;">عملات مدعومة</div>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem;">🔴</div>
                    <div style="font-size: 0.9rem; opacity: 0.8;">بيانات مباشرة</div>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem;">24/7</div>
                    <div style="font-size: 0.9rem; opacity: 0.8;">تحديث مستمر</div>
                </div>
            </div>
        </main>

        <aside class="sidebar">
            <div class="trading-card">
                <div class="card-header">
                    <h2 class="card-title">انضم إلى RimToken</h2>
                    <p class="card-subtitle">ابدأ التداول بالبيانات الحقيقية</p>
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
                    
                    <button type="submit" class="btn btn-primary">إنشاء حساب مجاناً</button>
                </form>
            </div>
        </aside>
    </div>

    <script>
        // البيانات الحقيقية من CoinMarketCap
        let cryptoData = {crypto_js_data};
        
        function renderCryptoCards() {{
            const grid = document.getElementById('cryptoGrid');
            grid.innerHTML = '';
            
            cryptoData.forEach(coin => {{
                const changeClass = coin.change_24h >= 0 ? 'positive' : 'negative';
                const changeSymbol = coin.change_24h >= 0 ? '+' : '';
                
                const card = document.createElement('div');
                card.className = 'crypto-card';
                
                card.innerHTML = `
                    <div class="crypto-info">
                        <div class="crypto-symbol">${{coin.symbol}}</div>
                        <div class="crypto-name">${{coin.name}}</div>
                    </div>
                    <div class="crypto-price">
                        <div class="price-value">${{coin.price.toLocaleString()}}</div>
                        <div class="price-change ${{changeClass}}">
                            ${{changeSymbol}}${{coin.change_24h}}%
                        </div>
                    </div>
                `;
                
                grid.appendChild(card);
            }});
        }}
        
        async function refreshPrices() {{
            try {{
                const response = await fetch('/api/crypto/prices');
                const result = await response.json();
                
                if (result.success) {{
                    cryptoData = result.data;
                    renderCryptoCards();
                    
                    const now = new Date().toLocaleString('ar-SA');
                    document.getElementById('lastUpdated').textContent = `آخر تحديث: ${{now}}`;
                }}
            }} catch (error) {{
                console.error('خطأ في تحديث الأسعار:', error);
            }}
        }}
        
        // تحديث الأسعار كل 30 ثانية
        setInterval(refreshPrices, 30000);
        
        // رسم البطاقات عند تحميل الصفحة
        renderCryptoCards();
    </script>
</body>
</html>'''
        
        self.wfile.write(html_content.encode('utf-8'))

if __name__ == "__main__":
    server_address = ('0.0.0.0', 3000)
    httpd = HTTPServer(server_address, RimTokenHandler)
    
    print("🔐 RimToken Trading Platform running on port 3000")
    print("🌐 Access at: http://localhost:3000")
    print("💰 Real-time data from CoinMarketCap API")
    print("✅ Server ready for connections")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        httpd.server_close()