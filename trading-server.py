#!/usr/bin/env python3
from http.server import HTTPServer, BaseHTTPRequestHandler

class TradingHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Cache-Control', 'no-cache')
        self.end_headers()
        
        html_content = '''<!DOCTYPE html>
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
            
            <div class="price-ticker">
                <div class="ticker-title">أسعار العملات الحية</div>
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
                        <span>SOL/USDT</span>
                        <span class="price-change negative">$125 (-0.5%)</span>
                    </div>
                    <div class="price-item">
                        <span>BNB/USDT</span>
                        <span class="price-change positive">$315 (+3.2%)</span>
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
    port = 3000
    server = HTTPServer(('0.0.0.0', port), TradingHandler)
    print(f'RimToken Trading Platform running on port {port}')
    server.serve_forever()