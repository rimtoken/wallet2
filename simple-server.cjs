const http = require('http');

const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RimToken - منصة العملات الرقمية</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            min-height: 100vh;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            padding: 40px 0;
        }
        
        .logo {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 20px;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .subtitle {
            font-size: 1.5rem;
            opacity: 0.9;
            margin-bottom: 30px;
        }
        
        .status {
            background: rgba(16, 185, 129, 0.9);
            padding: 15px 30px;
            border-radius: 50px;
            display: inline-block;
            margin: 20px 0;
            font-weight: bold;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        
        .feature h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
        }
        
        .feature p {
            opacity: 0.8;
        }
        
        @media (max-width: 768px) {
            .logo {
                font-size: 2rem;
            }
            
            .subtitle {
                font-size: 1.2rem;
            }
            
            .features {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="status">✅ الموقع يعمل بنجاح</div>
            <h1 class="logo">RimToken</h1>
            <p class="subtitle">منصة العملات الرقمية المتقدمة</p>
            <p>إدارة أصولك الرقمية بأمان وسهولة</p>
        </div>
        
        <div class="features">
            <div class="feature">
                <div class="feature-icon">🔒</div>
                <h3>الأمان المتقدم</h3>
                <p>حماية كاملة لأصولك الرقمية مع تقنيات التشفير المتقدمة</p>
            </div>
            
            <div class="feature">
                <div class="feature-icon">⚡</div>
                <h3>التداول السريع</h3>
                <p>تنفيذ فوري للمعاملات مع رسوم منخفضة</p>
            </div>
            
            <div class="feature">
                <div class="feature-icon">🌐</div>
                <h3>متعدد البلوك تشين</h3>
                <p>دعم Ethereum, Solana, BSC, Polygon</p>
            </div>
            
            <div class="feature">
                <div class="feature-icon">📱</div>
                <h3>تطبيق موبايل</h3>
                <p>إدارة محفظتك من أي مكان</p>
            </div>
        </div>
    </div>
</body>
</html>`;

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    res.end(html);
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`RimToken server running on port ${PORT}`);
    console.log(`Access: http://localhost:${PORT}`);
});