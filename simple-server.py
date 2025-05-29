#!/usr/bin/env python3

from http.server import HTTPServer, BaseHTTPRequestHandler
import json

class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        html_content = '''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RimToken - محفظة العملات الرقمية</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        .header {
            text-align: center;
            padding: 2rem 0;
        }
        .logo {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .nav {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin: 2rem 0;
            flex-wrap: wrap;
        }
        .nav-btn {
            padding: 1rem 2rem;
            background: rgba(255,255,255,0.2);
            border: none;
            border-radius: 50px;
            color: white;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s;
            cursor: pointer;
        }
        .nav-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
        .main-content {
            text-align: center;
            padding: 3rem 0;
        }
        .title {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 3rem;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
        }
        .feature {
            background: rgba(255,255,255,0.1);
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
        }
        .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        .status {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem;
            border-radius: 10px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="status">🟢 الموقع يعمل بنجاح</div>
    
    <div class="container">
        <header class="header">
            <div class="logo">🚀 RimToken</div>
        </header>

        <nav class="nav">
            <a href="#home" class="nav-btn">الرئيسية</a>
            <a href="#trading" class="nav-btn">التداول</a>
            <a href="#wallet" class="nav-btn">المحفظة</a>
            <a href="#staking" class="nav-btn">الستاكينغ</a>
            <a href="#downloads" class="nav-btn">التنزيلات</a>
        </nav>

        <main class="main-content">
            <h1 class="title">مرحباً بك في RimToken</h1>
            <p class="subtitle">منصة العملات الرقمية الآمنة والمتطورة</p>

            <div class="features">
                <div class="feature">
                    <div class="feature-icon">🔒</div>
                    <h3>الأمان المتقدم</h3>
                    <p>حماية كاملة لأصولك الرقمية</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">⚡</div>
                    <h3>التداول السريع</h3>
                    <p>معاملات فورية برسوم منخفضة</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🌐</div>
                    <h3>متعدد البلوك تشين</h3>
                    <p>دعم Ethereum, Solana, BSC</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">📱</div>
                    <h3>تطبيق موبايل</h3>
                    <p>إدارة من أي مكان</p>
                </div>
            </div>
        </main>
    </div>

    <script>
        console.log('RimToken loaded successfully!');
        document.title = 'RimToken - يعمل بنجاح';
        
        // تفعيل التفاعل مع الأزرار
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                alert('تم النقر على: ' + this.textContent);
            });
        });
    </script>
</body>
</html>'''
        
        self.wfile.write(html_content.encode('utf-8'))

if __name__ == '__main__':
    port = 3000
    server = HTTPServer(('0.0.0.0', port), SimpleHandler)
    print(f'خادم RimToken يعمل على المنفذ {port}')
    print(f'يمكن الوصول عبر: http://localhost:{port}')
    server.serve_forever()