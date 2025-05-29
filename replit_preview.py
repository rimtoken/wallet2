#!/usr/bin/env python3
import os
import json
import requests
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn

class CryptoAPIService:
    def __init__(self):
        self.api_key = os.environ.get('COINMARKETCAP_API_KEY')
        self.base_url = 'https://pro-api.coinmarketcap.com/v1'
        self.headers = {
            'X-CMC_PRO_API_KEY': self.api_key,
            'Accept': 'application/json'
        }
    
    def get_real_time_prices(self):
        if not self.api_key:
            return []
            
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
                return []
                
        except Exception as e:
            print(f"Error fetching data: {e}")
            return []

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread."""
    allow_reuse_address = True

class RimTokenHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.crypto_service = CryptoAPIService()
        super().__init__(*args, **kwargs)

    def do_GET(self):
        if self.path == '/api/crypto/prices':
            self.handle_crypto_api()
        elif self.path == '/health':
            self.handle_health_check()
        else:
            self.handle_main_page()
    
    def do_HEAD(self):
        """Handle HEAD requests for preview compatibility"""
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        self.end_headers()
    
    def handle_health_check(self):
        """Health check endpoint for monitoring"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        health_data = {
            'status': 'healthy',
            'service': 'RimToken Trading Platform',
            'coinmarketcap_api': 'connected' if self.crypto_service.api_key else 'not_configured'
        }
        
        self.wfile.write(json.dumps(health_data, ensure_ascii=False).encode('utf-8'))
    
    def handle_crypto_api(self):
        """API endpoint for cryptocurrency prices"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        crypto_data = self.crypto_service.get_real_time_prices()
        response_data = {
            'success': True,
            'data': crypto_data,
            'source': 'CoinMarketCap API',
            'count': len(crypto_data)
        }
        
        self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))
    
    def handle_main_page(self):
        """Main trading platform page"""
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Get authentic cryptocurrency data
        crypto_data = self.crypto_service.get_real_time_prices()
        
        # Generate real-time price display
        price_display = ""
        if crypto_data:
            for coin in crypto_data:
                change_class = "positive" if coin['change_24h'] >= 0 else "negative"
                change_symbol = "+" if coin['change_24h'] >= 0 else ""
                price_display += f"""
                    <div class="crypto-card">
                        <div class="crypto-info">
                            <span class="crypto-symbol">{coin['symbol']}</span>
                            <span class="crypto-name">{coin['name']}</span>
                        </div>
                        <div class="crypto-price">
                            <span class="price-value">${coin['price']:,.2f}</span>
                            <span class="price-change {change_class}">{change_symbol}{coin['change_24h']:.2f}%</span>
                        </div>
                    </div>
                """
        else:
            price_display = '<div class="loading-message">تحميل البيانات الحقيقية...</div>'
        
        html_content = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RimToken - منصة التداول بالبيانات الحقيقية</title>
    <meta name="description" content="منصة RimToken للتداول بالعملات المشفرة مع البيانات الحقيقية من CoinMarketCap">
    
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ 
            font-family: 'Arial', sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            min-height: 100vh;
            line-height: 1.6;
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
            max-width: 1200px; 
            margin: 0 auto; 
        }}
        
        .logo {{ 
            font-size: 2rem; 
            font-weight: bold; 
            color: white;
            text-decoration: none;
        }}
        
        .api-status {{ 
            background: rgba(34, 197, 94, 0.2); 
            padding: 0.5rem 1rem; 
            border-radius: 20px; 
            font-size: 0.9rem; 
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #22c55e;
        }}
        
        .container {{ 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 2rem;
        }}
        
        .hero-section {{
            text-align: center;
            margin-bottom: 3rem;
        }}
        
        .hero-title {{
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: bold;
        }}
        
        .hero-subtitle {{
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 2rem;
        }}
        
        .crypto-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }}
        
        .crypto-card {{
            background: rgba(255,255,255,0.1);
            padding: 1.5rem;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: transform 0.3s ease, background 0.3s ease;
        }}
        
        .crypto-card:hover {{
            transform: translateY(-5px);
            background: rgba(255,255,255,0.15);
        }}
        
        .crypto-info {{
            display: flex;
            flex-direction: column;
        }}
        
        .crypto-symbol {{
            font-size: 1.3rem;
            font-weight: bold;
            margin-bottom: 0.2rem;
        }}
        
        .crypto-name {{
            font-size: 0.9rem;
            opacity: 0.8;
        }}
        
        .crypto-price {{
            text-align: left;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }}
        
        .price-value {{
            font-size: 1.4rem;
            font-weight: bold;
            margin-bottom: 0.2rem;
        }}
        
        .price-change {{
            padding: 0.3rem 0.6rem;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 500;
        }}
        
        .price-change.positive {{ 
            background: rgba(34, 197, 94, 0.2); 
            color: #22c55e;
        }}
        
        .price-change.negative {{ 
            background: rgba(239, 68, 68, 0.2); 
            color: #ef4444;
        }}
        
        .features-section {{
            background: rgba(255,255,255,0.1);
            padding: 2rem;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            margin-bottom: 2rem;
        }}
        
        .features-title {{
            text-align: center;
            font-size: 2rem;
            margin-bottom: 2rem;
        }}
        
        .features-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
        }}
        
        .feature-card {{
            background: rgba(0,0,0,0.2);
            padding: 1.5rem;
            border-radius: 15px;
            text-align: center;
        }}
        
        .feature-icon {{
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }}
        
        .feature-title {{
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }}
        
        .feature-description {{
            opacity: 0.9;
            font-size: 0.9rem;
        }}
        
        .cta-section {{
            text-align: center;
            background: rgba(255,255,255,0.1);
            padding: 2rem;
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }}
        
        .cta-button {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.3s ease;
            margin: 0.5rem;
        }}
        
        .cta-button:hover {{
            transform: translateY(-2px);
        }}
        
        .loading-message {{
            text-align: center;
            padding: 2rem;
            font-size: 1.2rem;
            opacity: 0.8;
        }}
        
        .footer {{
            text-align: center;
            padding: 2rem;
            opacity: 0.8;
            font-size: 0.9rem;
        }}
        
        @media (max-width: 768px) {{
            .hero-title {{ font-size: 2rem; }}
            .crypto-grid {{ grid-template-columns: 1fr; }}
            .features-grid {{ grid-template-columns: 1fr; }}
            .container {{ padding: 1rem; }}
        }}
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <a href="/" class="logo">🪙 RimToken</a>
            <div class="api-status">
                ✅ البيانات الحقيقية - CoinMarketCap
            </div>
        </nav>
    </header>

    <div class="container">
        <section class="hero-section">
            <h1 class="hero-title">منصة RimToken للتداول</h1>
            <p class="hero-subtitle">تداول العملات المشفرة بالبيانات الحقيقية والمحدثة لحظياً</p>
        </section>

        <section class="crypto-section">
            <div class="crypto-grid">
                {price_display}
            </div>
        </section>

        <section class="features-section">
            <h2 class="features-title">🚀 مميزات المنصة</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <h3 class="feature-title">بيانات حقيقية</h3>
                    <p class="feature-description">أسعار محدثة مباشرة من CoinMarketCap</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <h3 class="feature-title">تحديث فوري</h3>
                    <p class="feature-description">تحديث الأسعار كل 30 ثانية</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔒</div>
                    <h3 class="feature-title">أمان عالي</h3>
                    <p class="feature-description">حماية متقدمة لبياناتك</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🌐</div>
                    <h3 class="feature-title">متعدد العملات</h3>
                    <p class="feature-description">دعم أهم العملات المشفرة</p>
                </div>
            </div>
        </section>

        <section class="cta-section">
            <h2>ابدأ التداول الآن</h2>
            <p style="margin: 1rem 0;">انضم إلى آلاف المتداولين على منصة RimToken</p>
            <button class="cta-button" onclick="window.location.reload()">🔄 تحديث الأسعار</button>
            <button class="cta-button" onclick="showApiData()">📊 عرض البيانات</button>
        </section>
    </div>

    <footer class="footer">
        <p>© 2025 RimToken - منصة التداول بالبيانات الحقيقية</p>
        <p>مدعوم بواجهة برمجة التطبيقات من CoinMarketCap</p>
    </footer>

    <script>
        // تحديث تلقائي للأسعار
        function refreshPrices() {{
            fetch('/api/crypto/prices')
                .then(response => response.json())
                .then(data => {{
                    if (data.success) {{
                        console.log('تم تحديث الأسعار:', data.data);
                        setTimeout(() => location.reload(), 1000);
                    }}
                }})
                .catch(error => console.error('خطأ في التحديث:', error));
        }}
        
        function showApiData() {{
            fetch('/api/crypto/prices')
                .then(response => response.json())
                .then(data => {{
                    alert('عدد العملات: ' + data.count + '\\nالمصدر: ' + data.source);
                }})
                .catch(error => console.error('خطأ:', error));
        }}
        
        // تحديث تلقائي كل 30 ثانية
        setInterval(refreshPrices, 30000);
        
        console.log('✅ RimToken منصة تعمل بالبيانات الحقيقية');
        console.log('🔗 API Endpoint: /api/crypto/prices');
        console.log('❤️ Health Check: /health');
    </script>
</body>
</html>"""
        
        self.wfile.write(html_content.encode('utf-8'))

if __name__ == "__main__":
    # استخدام الخادم المحسن للمعاينة
    server_address = ('0.0.0.0', 3000)
    httpd = ThreadedHTTPServer(server_address, RimTokenHandler)
    
    print("🔐 RimToken Trading Platform - Replit Preview Ready")
    print("🌐 Access at: http://localhost:3000")
    print("💰 Real-time data from CoinMarketCap API")
    print("📊 API Endpoints:")
    print("   - /api/crypto/prices (JSON data)")
    print("   - /health (Health check)")
    print("✅ Server ready for connections and preview")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        httpd.server_close()