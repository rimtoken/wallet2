#!/usr/bin/env python3
from http.server import HTTPServer, BaseHTTPRequestHandler

class RimTokenHandler(BaseHTTPRequestHandler):
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
    <title>RimToken - منصة العملات الرقمية</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            min-height: 100vh;
            padding: 20px;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; padding: 40px 0; }
        .logo { font-size: 3rem; font-weight: bold; margin-bottom: 20px; }
        .status { 
            background: #10b981; 
            padding: 15px 30px; 
            border-radius: 50px; 
            display: inline-block; 
            margin: 20px 0; 
            font-weight: bold;
        }
        .features { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 30px; 
            margin-top: 50px; 
        }
        .feature { 
            background: rgba(255, 255, 255, 0.1); 
            padding: 30px; 
            border-radius: 15px; 
            text-align: center; 
        }
        .feature-icon { font-size: 3rem; margin-bottom: 20px; }
        .feature h3 { font-size: 1.5rem; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="status">✅ موقع RimToken يعمل بنجاح</div>
            <h1 class="logo">RimToken</h1>
            <p>منصة العملات الرقمية المتقدمة</p>
        </div>
        
        <div class="features">
            <div class="feature">
                <div class="feature-icon">🔒</div>
                <h3>الأمان المتقدم</h3>
                <p>حماية كاملة لأصولك الرقمية</p>
            </div>
            <div class="feature">
                <div class="feature-icon">⚡</div>
                <h3>التداول السريع</h3>
                <p>تنفيذ فوري للمعاملات</p>
            </div>
            <div class="feature">
                <div class="feature-icon">🌐</div>
                <h3>متعدد البلوك تشين</h3>
                <p>دعم Ethereum, Solana, BSC</p>
            </div>
            <div class="feature">
                <div class="feature-icon">📱</div>
                <h3>تطبيق موبايل</h3>
                <p>إدارة محفظتك من أي مكان</p>
            </div>
        </div>
    </div>
</body>
</html>'''
        
        self.wfile.write(html_content.encode('utf-8'))

if __name__ == '__main__':
    port = 3000
    server = HTTPServer(('0.0.0.0', port), RimTokenHandler)
    print(f'RimToken Website is running at http://localhost:{port}')
    print('موقع RimToken جاهز!')
    server.serve_forever()