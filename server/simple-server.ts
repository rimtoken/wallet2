import express from "express";
import { createServer } from "http";

const app = express();
app.use(express.json());

// Simple test route
app.get("/api/test", (req, res) => {
  res.json({ message: "RimToken Server is working!" });
});

// Serve a simple HTML page
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RimToken - محفظة العملات المشفرة</title>
        <style>
            body {
                margin: 0;
                font-family: 'Arial', sans-serif;
                background: linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #3730a3 100%);
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                text-align: center;
            }
            .container {
                max-width: 800px;
                padding: 2rem;
            }
            h1 {
                font-size: 4rem;
                margin-bottom: 1rem;
                font-weight: bold;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .subtitle {
                font-size: 1.5rem;
                margin-bottom: 3rem;
                color: #ddd6fe;
            }
            .features {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 2rem;
                margin-bottom: 3rem;
            }
            .feature-card {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 1rem;
                padding: 2rem;
                transition: transform 0.3s ease;
            }
            .feature-card:hover {
                transform: translateY(-5px);
            }
            .feature-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            .feature-title {
                font-size: 1.5rem;
                margin-bottom: 1rem;
                font-weight: bold;
            }
            .contact-info {
                margin-top: 2rem;
                padding: 1rem;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 1rem;
            }
            .btn {
                background: #3b82f6;
                color: white;
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 0.5rem;
                font-size: 1rem;
                cursor: pointer;
                transition: background 0.3s ease;
                margin: 0.5rem;
            }
            .btn:hover {
                background: #2563eb;
            }
            .btn-purple {
                background: #7c3aed;
            }
            .btn-purple:hover {
                background: #6d28d9;
            }
            .btn-green {
                background: #059669;
            }
            .btn-green:hover {
                background: #047857;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>RimToken</h1>
            <p class="subtitle">محفظة العملات المشفرة الحديثة والآمنة</p>
            
            <div class="features">
                <div class="feature-card">
                    <div class="feature-icon">💰</div>
                    <div class="feature-title">المحفظة</div>
                    <p>إدارة آمنة لعملاتك المشفرة عبر شبكات متعددة</p>
                    <button class="btn">فتح المحفظة</button>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">🔄</div>
                    <div class="feature-title">التبديل</div>
                    <p>تبديل العملات المشفرة بسهولة وأمان</p>
                    <button class="btn btn-purple">تبديل العملات</button>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">📥</div>
                    <div class="feature-title">الإيداع والسحب</div>
                    <p>إيداع وسحب العملات بطريقة آمنة ومضمونة</p>
                    <button class="btn btn-green">إدارة الأموال</button>
                </div>
            </div>
            
            <div class="contact-info">
                <h3>تواصل معنا</h3>
                <p>📞 هاتف: 37968897</p>
                <p>📧 بريد إلكتروني: INFO@RIMTOKEN.ORG</p>
                <p>🌐 الموقع: rimtoken.org</p>
                <br>
                <p>شبكات مدعومة: Ethereum • Solana • BSC • Polygon</p>
            </div>
        </div>
        
        <script>
            // Add some interactivity
            document.querySelectorAll('.btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    alert('مرحباً بك في RimToken! الميزة قيد التطوير.');
                });
            });
            
            // Test API connection
            fetch('/api/test')
                .then(response => response.json())
                .then(data => console.log('✅ اتصال ناجح:', data))
                .catch(error => console.error('❌ خطأ في الاتصال:', error));
        </script>
    </body>
    </html>
  `);
});

const server = createServer(app);

const port = 5000;
server.listen(port, "0.0.0.0", () => {
  console.log(`✅ RimToken Server is running on port ${port}`);
  console.log(`🌐 Access the app at: http://localhost:${port}`);
});

export default app;