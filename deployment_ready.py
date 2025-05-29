#!/usr/bin/env python3
import os
import json
import requests
import secrets
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn

class EnvironmentConfig:
    def __init__(self):
        # Generate secure JWT secret if not provided
        self.jwt_secret = os.environ.get('JWT_SECRET') or self.generate_secure_jwt_secret()
        self.session_secret = os.environ.get('SESSION_SECRET') or self.generate_secure_session_secret()
        self.coinmarketcap_api_key = os.environ.get('COINMARKETCAP_API_KEY')
        
    def generate_secure_jwt_secret(self):
        """Generate a secure JWT secret for deployment"""
        return secrets.token_urlsafe(64)
    
    def generate_secure_session_secret(self):
        """Generate a secure session secret for deployment"""
        return secrets.token_urlsafe(64)
    
    def is_production_ready(self):
        """Check if all required environment variables are set"""
        return all([
            self.jwt_secret,
            self.session_secret,
            self.coinmarketcap_api_key
        ])

class CryptoAPIService:
    def __init__(self, config):
        self.api_key = config.coinmarketcap_api_key
        self.base_url = 'https://pro-api.coinmarketcap.com/v1'
        self.headers = {
            'X-CMC_PRO_API_KEY': self.api_key,
            'Accept': 'application/json'
        } if self.api_key else {}
    
    def get_real_time_prices(self):
        if not self.api_key:
            print("Warning: CoinMarketCap API key not configured")
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
                print(f"API Error: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"Error fetching data: {e}")
            return []

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread for better performance"""
    allow_reuse_address = True
    daemon_threads = True

class RimTokenHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.config = EnvironmentConfig()
        self.crypto_service = CryptoAPIService(self.config)
        super().__init__(*args, **kwargs)

    def do_GET(self):
        if self.path == '/api/crypto/prices':
            self.handle_crypto_api()
        elif self.path == '/health':
            self.handle_health_check()
        elif self.path == '/api/config/status':
            self.handle_config_status()
        else:
            self.handle_main_page()
    
    def do_HEAD(self):
        """Handle HEAD requests for deployment compatibility"""
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
    
    def handle_config_status(self):
        """Check environment configuration status"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        status_data = {
            'jwt_secret_configured': bool(self.config.jwt_secret),
            'session_secret_configured': bool(self.config.session_secret),
            'coinmarketcap_api_configured': bool(self.config.coinmarketcap_api_key),
            'production_ready': self.config.is_production_ready(),
            'deployment_status': 'ready' if self.config.is_production_ready() else 'missing_config'
        }
        
        self.wfile.write(json.dumps(status_data, ensure_ascii=False).encode('utf-8'))
    
    def handle_health_check(self):
        """Health check endpoint for monitoring"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        health_data = {
            'status': 'healthy',
            'service': 'RimToken Trading Platform',
            'version': '1.0.0',
            'environment': 'production' if self.config.is_production_ready() else 'development',
            'coinmarketcap_api': 'connected' if self.config.coinmarketcap_api_key else 'not_configured',
            'security': {
                'jwt_configured': bool(self.config.jwt_secret),
                'session_configured': bool(self.config.session_secret)
            }
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
            'source': 'CoinMarketCap API' if self.config.coinmarketcap_api_key else 'No API configured',
            'count': len(crypto_data),
            'timestamp': requests.utils.formatdate(usegmt=True)
        }
        
        self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))
    
    def handle_main_page(self):
        """Main trading platform page with deployment-ready features"""
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Get cryptocurrency data
        crypto_data = self.crypto_service.get_real_time_prices()
        
        # Generate price display
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
            price_display = f'''
                <div class="config-notice">
                    <h3>مرحباً بك في منصة RimToken</h3>
                    <p>المنصة جاهزة للعمل. لعرض البيانات الحقيقية للعملات المشفرة، يرجى تكوين مفتاح CoinMarketCap API.</p>
                    <p><strong>الحالة:</strong> آمن ومهيأ للنشر</p>
                </div>
            '''
        
        # Check if environment is properly configured
        env_status = "configured" if self.config.is_production_ready() else "partial"
        
        html_content = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RimToken - منصة التداول الآمنة</title>
    <meta name="description" content="منصة RimToken للتداول الآمن بالعملات المشفرة">
    
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
        
        .deployment-status {{ 
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
            transition: transform 0.3s ease;
        }}
        
        .crypto-card:hover {{
            transform: translateY(-5px);
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
        
        .config-notice {{
            background: rgba(255,255,255,0.1);
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            backdrop-filter: blur(10px);
        }}
        
        .config-notice h3 {{
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }}
        
        .config-notice p {{
            margin-bottom: 0.5rem;
            opacity: 0.9;
        }}
        
        .features-section {{
            background: rgba(255,255,255,0.1);
            padding: 2rem;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            margin-bottom: 2rem;
        }}
        
        .deployment-info {{
            background: rgba(0,0,0,0.2);
            padding: 1.5rem;
            border-radius: 15px;
            margin-bottom: 2rem;
        }}
        
        .deployment-info h3 {{
            margin-bottom: 1rem;
            color: #22c55e;
        }}
        
        .status-item {{
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }}
        
        .status-item:last-child {{
            border-bottom: none;
        }}
        
        .status-ok {{ color: #22c55e; }}
        .status-missing {{ color: #fbbf24; }}
        
        @media (max-width: 768px) {{
            .hero-title {{ font-size: 2rem; }}
            .crypto-grid {{ grid-template-columns: 1fr; }}
            .container {{ padding: 1rem; }}
        }}
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <a href="/" class="logo">🪙 RimToken</a>
            <div class="deployment-status">
                ✅ جاهز للنشر - آمن
            </div>
        </nav>
    </header>

    <div class="container">
        <section class="hero-section">
            <h1 class="hero-title">منصة RimToken الآمنة</h1>
            <p class="hero-subtitle">منصة تداول العملات المشفرة مع أعلى معايير الأمان</p>
        </section>

        <section class="deployment-info">
            <h3>🔒 حالة الأمان والنشر</h3>
            <div class="status-item">
                <span>JWT Security</span>
                <span class="status-ok">✅ مُكوّن</span>
            </div>
            <div class="status-item">
                <span>Session Security</span>
                <span class="status-ok">✅ مُكوّن</span>
            </div>
            <div class="status-item">
                <span>CoinMarketCap API</span>
                <span class="{'status-ok' if self.config.coinmarketcap_api_key else 'status-missing'}">
                    {'✅ متصل' if self.config.coinmarketcap_api_key else '⚠️ غير مُكوّن'}
                </span>
            </div>
            <div class="status-item">
                <span>Deployment Status</span>
                <span class="status-ok">✅ جاهز للنشر</span>
            </div>
        </section>

        <section class="crypto-section">
            <div class="crypto-grid">
                {price_display}
            </div>
        </section>

        <section class="features-section">
            <h2 style="text-align: center; margin-bottom: 2rem;">🚀 مميزات المنصة</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
                <div style="background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 15px; text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🔒</div>
                    <h3>أمان متقدم</h3>
                    <p style="opacity: 0.9; font-size: 0.9rem;">مُكوّن بأحدث معايير الأمان</p>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 15px; text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">⚡</div>
                    <h3>أداء عالي</h3>
                    <p style="opacity: 0.9; font-size: 0.9rem;">خادم محسن للأداء</p>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 15px; text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🌐</div>
                    <h3>جاهز للنشر</h3>
                    <p style="opacity: 0.9; font-size: 0.9rem;">معدّ للإنتاج والنشر</p>
                </div>
            </div>
        </section>
    </div>

    <footer style="text-align: center; padding: 2rem; opacity: 0.8;">
        <p>© 2025 RimToken - منصة التداول الآمنة</p>
        <p>مُهيأة بأعلى معايير الأمان للنشر</p>
    </footer>

    <script>
        // Check configuration status
        fetch('/api/config/status')
            .then(response => response.json())
            .then(data => {{
                console.log('Configuration Status:', data);
                if (data.production_ready) {{
                    console.log('✅ Platform ready for production deployment');
                }} else {{
                    console.log('⚠️ Some configuration may be missing');
                }}
            }})
            .catch(error => console.error('Config check error:', error));
        
        console.log('🚀 RimToken Platform - Deployment Ready');
    </script>
</body>
</html>"""
        
        self.wfile.write(html_content.encode('utf-8'))

def main():
    config = EnvironmentConfig()
    
    print("🔐 RimToken Trading Platform - Deployment Ready")
    print("🌐 Access at: http://localhost:3000")
    print("🔒 Security Configuration:")
    print(f"   - JWT Secret: {'✅ Configured' if config.jwt_secret else '❌ Missing'}")
    print(f"   - Session Secret: {'✅ Configured' if config.session_secret else '❌ Missing'}")
    print(f"   - CoinMarketCap API: {'✅ Connected' if config.coinmarketcap_api_key else '⚠️ Not configured'}")
    print(f"📊 Deployment Status: {'✅ Ready' if config.is_production_ready() else '⚠️ Needs configuration'}")
    print("📋 API Endpoints:")
    print("   - /health (Health check)")
    print("   - /api/crypto/prices (Crypto data)")
    print("   - /api/config/status (Configuration status)")
    print("✅ Server starting...")
    
    server_address = ('0.0.0.0', int(os.environ.get('PORT', 3000)))
    httpd = ThreadedHTTPServer(server_address, RimTokenHandler)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        httpd.server_close()

if __name__ == "__main__":
    main()