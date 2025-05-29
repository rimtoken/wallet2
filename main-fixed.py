#!/usr/bin/env python3

from http.server import HTTPServer, BaseHTTPRequestHandler

class RimTokenHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        
        html = '''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RimToken - محفظة العملات الرقمية</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 40px 0;
        }
        .logo {
            font-size: 4rem;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .tagline {
            font-size: 1.5rem;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        .nav {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 30px 0;
            flex-wrap: wrap;
        }
        .nav-btn {
            padding: 12px 25px;
            background: rgba(255,255,255,0.2);
            border: none;
            border-radius: 25px;
            color: white;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s;
        }
        .nav-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }
        .feature {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 15px;
            text-align: center;
        }
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 15px;
        }
        .status {
            position: fixed;
            top: 20px;
            left: 20px;
            background: #10b981;
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="status">الموقع يعمل بنجاح</div>
    
    <div class="container">
        <header class="header">
            <div class="logo">RimToken</div>
            <div class="tagline">محفظة العملات الرقمية الآمنة والمتطورة</div>
        </header>

        <nav class="nav">
            <a href="#" class="nav-btn">الرئيسية</a>
            <a href="#" class="nav-btn">التداول</a>
            <a href="#" class="nav-btn">المحفظة</a>
            <a href="#" class="nav-btn">الستاكينغ</a>
            <a href="#" class="nav-btn">التنزيلات</a>
        </nav>

        <div class="features">
            <div class="feature">
                <div class="feature-icon">🔒</div>
                <h3>الأمان المتقدم</h3>
                <p>حماية كاملة لأصولك الرقمية مع أحدث تقنيات التشفير</p>
            </div>
            <div class="feature">
                <div class="feature-icon">⚡</div>
                <h3>التداول السريع</h3>
                <p>معاملات فورية برسوم منخفضة على جميع الشبكات</p>
            </div>
            <div class="feature">
                <div class="feature-icon">🌐</div>
                <h3>متعدد البلوك تشين</h3>
                <p>دعم Ethereum, Solana, BSC, Polygon والمزيد</p>
            </div>
            <div class="feature">
                <div class="feature-icon">📱</div>
                <h3>تطبيق موبايل</h3>
                <p>إدارة محفظتك من أي مكان بسهولة تامة</p>
            </div>
        </div>
    </div>

    <script>
        console.log('تم تحميل RimToken بنجاح');
        document.title = 'RimToken - يعمل';
        
        // إضافة تفاعل للأزرار
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('تم النقر على:', this.textContent);
            });
        });
    </script>
</body>
</html>'''
        
        self.wfile.write(html.encode('utf-8'))

if __name__ == '__main__':
    port = 3000
    server = HTTPServer(('0.0.0.0', port), RimTokenHandler)
    print(f'RimToken Website is running at http://localhost:{port}')
    print(f'Primary URL: https://dahm2621.repl.co')
    print(f'Alternative URL: https://workspace-{port}.dahm2621.repl.co')
    print('Your beautiful crypto website is ready!')
    server.serve_forever()