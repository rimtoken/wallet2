#!/usr/bin/env python3
import os
import json
import requests
from http.server import HTTPServer, BaseHTTPRequestHandler

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
    <title>RimToken - منصة التداول</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Arial', sans-serif; }
        body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh; }
        
        .header { background: rgba(255,255,255,0.1); padding: 1rem 2rem; backdrop-filter: blur(10px); }
        .nav { display: flex; justify-content: space-between; align-items: center; max-width: 1400px; margin: 0 auto; }
        .logo { font-size: 1.8rem; font-weight: bold; color: white; }
        .nav-links { display: flex; gap: 2rem; list-style: none; }
        .nav-links a { color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 8px; transition: background 0.3s; }
        .nav-links a:hover, .nav-links a.active { background: rgba(255,255,255,0.2); }
        
        .container { max-width: 1400px; margin: 0 auto; padding: 2rem; display: grid; grid-template-columns: 1fr 400px; gap: 2rem; }
        
        .main-section { background: rgba(255,255,255,0.1); border-radius: 20px; padding: 2rem; backdrop-filter: blur(10px); }
        .sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
        
        .trading-card { background: rgba(255,255,255,0.95); color: #333; border-radius: 15px; padding: 2rem; }
        .card-header { text-align: center; margin-bottom: 2rem; }
        .card-title { font-size: 1.5rem; margin-bottom: 0.5rem; color: #333; }
        .card-subtitle { color: #666; font-size: 0.9rem; }
        
        .form-group { margin-bottom: 1.5rem; }
        .form-label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #333; }
        .form-input { width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem; }
        .form-input:focus { outline: none; border-color: #4f46e5; }
        
        .btn { padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: all 0.3s; }
        .btn-primary { background: #4f46e5; color: white; width: 100%; }
        .btn-primary:hover { background: #4338ca; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px; text-align: center; }
        .stat-value { font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem; }
        .stat-label { font-size: 0.9rem; opacity: 0.8; }
        
        .networks { display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; }
        .network { padding: 0.5rem 1rem; background: rgba(255,255,255,0.2); border-radius: 20px; font-size: 0.8rem; }
        
        .price-ticker { background: rgba(0,0,0,0.3); padding: 1rem; margin-bottom: 2rem; border-radius: 10px; }
        .ticker-title { margin-bottom: 1rem; font-weight: bold; }
        .price-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        .price-item { display: flex; justify-content: space-between; padding: 0.5rem; background: rgba(255,255,255,0.1); border-radius: 6px; }
        .price-change.positive { color: #10b981; }
        .price-change.negative { color: #ef4444; }
        
        .ticker-scroll { 
            background: rgba(0,0,0,0.2); 
            padding: 0.5rem; 
            overflow: hidden; 
            white-space: nowrap; 
            border-radius: 8px;
            margin: 1rem 0;
        }
        .ticker-content { 
            display: inline-block; 
            animation: scroll-left 20s linear infinite; 
        }
        @keyframes scroll-left {{
            0% {{ transform: translateX(100%); }}
            100% {{ transform: translateX(-100%); }}
        }}
        .ticker-item { 
            display: inline-block; 
            margin: 0 2rem; 
            font-weight: 500;
        }
        
        .cta-section {
            text-align: center;
            margin: 2rem 0;
            padding: 2rem;
            background: rgba(255,255,255,0.05);
            border-radius: 15px;
        }
        
        .cta-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 1rem;
        }
        
        .btn-cta {
            padding: 1rem 2rem;
            border: none;
            border-radius: 25px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
        }
        
        .btn-primary-cta {
            background: linear-gradient(45deg, #4f46e5, #7c3aed);
            color: white;
        }
        
        .btn-secondary-cta {
            background: rgba(255,255,255,0.2);
            color: white;
            border: 2px solid rgba(255,255,255,0.3);
        }
        
        .btn-cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin: 2rem 0;
        }
        
        .feature-mini {
            background: rgba(255,255,255,0.1);
            padding: 1rem;
            border-radius: 10px;
            text-align: center;
        }
        
        .feature-mini-icon {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }
        
        @media (max-width: 768px) {
            .container { grid-template-columns: 1fr; }
            .nav { flex-direction: column; gap: 1rem; }
            .stats-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="logo">RimToken</div>
            <ul class="nav-links">
                <li><a href="#" class="active">الرئيسية</a></li>
                <li><a href="#">التداول</a></li>
                <li><a href="#">المحفظة</a></li>
                <li><a href="#">الستاكينغ</a></li>
                <li><a href="#">تحميل التطبيق</a></li>
            </ul>
        </nav>
    </header>

    <div class="container">
        <main class="main-section">
            <h1 style="font-size: 2.5rem; margin-bottom: 2rem; text-align: center;">مستقبل العملات المشفرة في يديك</h1>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value" style="color: #fbbf24;">+1000</div>
                    <div class="stat-label">عملة مدعومة</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: #fbbf24;">$2.5B</div>
                    <div class="stat-label">حجم التداول</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: #fbbf24;">+500K</div>
                    <div class="stat-label">مستخدم نشط</div>
                </div>
            </div>
            
            <p style="font-size: 1.2rem; text-align: center; margin-bottom: 2rem; opacity: 0.9;">
                منصة شاملة لإدارة وتداول العملات المشفرة مع دعم متعدد للشبكات ودعم فني على مدار الساعة
            </p>
            
            <div class="networks">
                <span class="network" style="background: #627eea;">Polygon</span>
                <span class="network" style="background: #f3ba2f;">BSC</span>
                <span class="network" style="background: #9945ff;">Solana</span>
                <span class="network" style="background: #627eea;">Ethereum</span>
            </div>
            
            <div class="ticker-scroll">
                <div class="ticker-content">
                    <span class="ticker-item">🪙 BTC: $42,150 (+2.3%)</span>
                    <span class="ticker-item">💎 ETH: $2,580 (+1.8%)</span>
                    <span class="ticker-item">⚡ SOL: $125 (-0.5%)</span>
                    <span class="ticker-item">🟡 BNB: $315 (+3.2%)</span>
                    <span class="ticker-item">💰 RIM: $0.85 (+12.5%)</span>
                    <span class="ticker-item">🔷 ADA: $0.48 (+1.2%)</span>
                    <span class="ticker-item">🔴 DOT: $7.82 (-2.1%)</span>
                </div>
            </div>
            
            <div class="cta-section">
                <h2 style="margin-bottom: 1rem;">ابدأ التداول الآن</h2>
                <p style="opacity: 0.9; margin-bottom: 1.5rem;">انضم إلى أكثر من 500,000 متداول واستفد من أفضل الأسعار</p>
                <div class="cta-buttons">
                    <button class="btn-cta btn-primary-cta">🚀 ابدأ التداول</button>
                    <button class="btn-cta btn-secondary-cta">📱 حمل التطبيق</button>
                </div>
            </div>
            
            <div class="features-grid">
                <div class="feature-mini">
                    <div class="feature-mini-icon">⚡</div>
                    <h4>معاملات فورية</h4>
                    <p style="font-size: 0.8rem; opacity: 0.8;">تنفيذ في أقل من 3 ثوان</p>
                </div>
                <div class="feature-mini">
                    <div class="feature-mini-icon">🔒</div>
                    <h4>أمان متقدم</h4>
                    <p style="font-size: 0.8rem; opacity: 0.8;">تشفير عسكري المستوى</p>
                </div>
                <div class="feature-mini">
                    <div class="feature-mini-icon">💰</div>
                    <h4>رسوم منخفضة</h4>
                    <p style="font-size: 0.8rem; opacity: 0.8;">أقل من 0.1% لكل معاملة</p>
                </div>
                <div class="feature-mini">
                    <div class="feature-mini-icon">🌍</div>
                    <h4>دعم 24/7</h4>
                    <p style="font-size: 0.8rem; opacity: 0.8;">فريق دعم متاح دائماً</p>
                </div>
            </div>
            
            <div class="price-ticker">
                <div class="ticker-title">أزواج التداول الأكثر نشاطاً</div>
                <div class="price-grid">
                    <div class="price-item">
                        <span>BTC/USDT</span>
                        <span class="price-change positive">$42,150 (+2.3%)</span>
                    </div>
                    <div class="price-item">
                        <span>ETH/USDT</span>
                        <span class="price-change positive">$2,580 (+1.8%)</span>
                    </div>
                    <div class="price-item">
                        <span>RIM/USDT</span>
                        <span class="price-change positive">$0.85 (+12.5%)</span>
                    </div>
                    <div class="price-item">
                        <span>SOL/BTC</span>
                        <span class="price-change negative">0.00297 (-0.5%)</span>
                    </div>
                </div>
            </div>
        </main>

        <aside class="sidebar">
            <div class="trading-card">
                <div class="card-header">
                    <h2 class="card-title">انضم إلى RimToken</h2>
                    <p class="card-subtitle">ابدأ رحلتك في عالم العملات الرقمية</p>
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
                
                <p style="text-align: center; margin-top: 1rem; font-size: 0.9rem; color: #666;">
                    الشبكات المدعومة
                </p>
            </div>
            
            <div style="text-align: center;">
                <button class="btn" style="background: #10b981; color: white; margin: 0.5rem;">خدمة العملاء المباشرة</button>
                <button class="btn" style="background: #ef4444; color: white; margin: 0.5rem;">تطبيق الهاتف</button>
            </div>
        </aside>
    </div>
</body>
</html>'''
        
        self.wfile.write(html_content.encode('utf-8'))

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 3000))
    server = HTTPServer(('0.0.0.0', port), TradingHandler)
    print(f'RimToken Trading Platform running on port {port}')
    print(f'Access at: http://localhost:{port}')
    print('✅ Server ready for connections')
    server.serve_forever()