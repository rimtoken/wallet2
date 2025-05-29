#!/usr/bin/env python3
from http.server import HTTPServer, BaseHTTPRequestHandler

class RimTokenHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Cache-Control', 'no-cache')
        self.end_headers()
        
        try:
            with open('rimtoken-complete.html', 'r', encoding='utf-8') as f:
                html_content = f.read()
        except:
            html_content = '''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RimToken - منصة العملات الرقمية</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Arial, sans-serif; }
        body { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; min-height: 100vh; line-height: 1.6;
        }
        .header { background: rgba(255,255,255,0.1); padding: 1rem 2rem; backdrop-filter: blur(10px); }
        .nav { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; }
        .logo { font-size: 2rem; font-weight: bold; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .nav-links { display: flex; gap: 2rem; list-style: none; }
        .nav-links a { color: white; text-decoration: none; font-weight: 500; transition: opacity 0.3s; }
        .nav-links a:hover { opacity: 0.8; }
        .hero { text-align: center; padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; }
        .hero h1 { font-size: 3.5rem; margin-bottom: 1rem; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9; }
        .status { background: #10b981; padding: 15px 30px; border-radius: 50px; display: inline-block; margin: 20px 0; font-weight: bold; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; padding: 2rem; max-width: 1200px; margin: 0 auto; }
        .feature { background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 20px; text-align: center; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); transition: transform 0.3s; }
        .feature:hover { transform: translateY(-5px); }
        .feature-icon { font-size: 3rem; margin-bottom: 1rem; }
        .feature h3 { font-size: 1.5rem; margin-bottom: 1rem; }
        .crypto-ticker { background: rgba(0,0,0,0.2); padding: 1rem; overflow: hidden; white-space: nowrap; }
        .ticker-content { display: inline-block; animation: scroll 30s linear infinite; }
        @keyframes scroll { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .crypto-item { display: inline-block; margin: 0 2rem; }
        .footer { text-align: center; padding: 2rem; margin-top: 4rem; background: rgba(0,0,0,0.2); }
        @media (max-width: 768px) { .nav { flex-direction: column; gap: 1rem; } .hero h1 { font-size: 2.5rem; } }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="logo">RimToken</div>
            <ul class="nav-links">
                <li><a href="#home">الرئيسية</a></li>
                <li><a href="#trading">التداول</a></li>
                <li><a href="#wallet">المحفظة</a></li>
                <li><a href="#staking">الستاكينغ</a></li>
                <li><a href="#download">التحميل</a></li>
            </ul>
        </nav>
    </header>

    <div class="crypto-ticker">
        <div class="ticker-content">
            <span class="crypto-item">🪙 BTC: $42,150 (+2.3%)</span>
            <span class="crypto-item">💎 ETH: $2,580 (+1.8%)</span>
            <span class="crypto-item">⚡ SOL: $125 (-0.5%)</span>
            <span class="crypto-item">🟡 BNB: $315 (+3.2%)</span>
            <span class="crypto-item">💰 RIM: $0.85 (+12.5%)</span>
        </div>
    </div>

    <main>
        <section class="hero" id="home">
            <div class="status">✅ موقع RimToken يعمل بنجاح</div>
            <h1>مرحباً بك في RimToken</h1>
            <p>منصة العملات الرقمية الآمنة والمتطورة لإدارة أصولك الرقمية بكل سهولة</p>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">🔒</div>
                    <h3>الأمان المتقدم</h3>
                    <p>حماية كاملة لأصولك الرقمية مع أحدث تقنيات التشفير والحماية المتقدمة</p>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">⚡</div>
                    <h3>التداول السريع</h3>
                    <p>تنفيذ فوري للمعاملات مع رسوم منخفضة على جميع الشبكات المدعومة</p>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">🌐</div>
                    <h3>متعدد البلوك تشين</h3>
                    <p>دعم شامل لـ Ethereum, Solana, BSC, Polygon وشبكات أخرى</p>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">📱</div>
                    <h3>تطبيق موبايل</h3>
                    <p>إدارة محفظتك من أي مكان مع تطبيقاتنا المتقدمة للهواتف الذكية</p>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">💰</div>
                    <h3>الستاكينغ</h3>
                    <p>اربح عوائد تصل إلى 25% سنوياً من خلال ستاكينغ عملاتك الرقمية</p>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">🔄</div>
                    <h3>التبديل السريع</h3>
                    <p>تبديل العملات الرقمية بسرعة وسهولة مع أفضل الأسعار في السوق</p>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <p>&copy; 2025 RimToken. جميع الحقوق محفوظة.</p>
        <p>منصة العملات الرقمية الآمنة والموثوقة</p>
    </footer>
</body>
</html>'''
        
        self.wfile.write(html_content.encode('utf-8'))

if __name__ == '__main__':
    port = 8080
    server = HTTPServer(('0.0.0.0', port), RimTokenHandler)
    print(f'RimToken Website is running at http://localhost:{port}')
    print('موقع RimToken جاهز!')
    server.serve_forever()