import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RimToken - إنشاء حساب جديد</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #3730a3 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 30px;
            box-shadow: 0 30px 60px rgba(0,0,0,0.3);
            padding: 3rem;
            width: 100%;
            max-width: 800px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .logo {
            font-size: 4rem;
            font-weight: bold;
            color: white;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .subtitle {
            color: #ddd6fe;
            margin-bottom: 3rem;
            font-size: 1.5rem;
        }
        .register-form {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 3rem;
            margin: 2rem 0;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .register-form h2 {
            font-size: 2.5rem;
            margin-bottom: 2rem;
            color: #1e3a8a;
            font-weight: bold;
        }
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        .form-row input {
            padding: 1.2rem;
            border: 2px solid #e1e5e9;
            border-radius: 15px;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            background: #f8f9fa;
        }
        .form-row input:focus {
            outline: none;
            border-color: #7c3aed;
            background: white;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(124, 58, 237, 0.2);
        }
        .btn-register {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            color: white;
            padding: 1.5rem 3rem;
            border: none;
            border-radius: 15px;
            font-size: 1.3rem;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
            margin-top: 1rem;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(238, 90, 36, 0.4);
        }
        .btn-register:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(238, 90, 36, 0.6);
        }
        .success-message {
            display: none;
            background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
            color: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            font-size: 1.3rem;
            font-weight: bold;
            margin: 2rem 0;
            animation: slideIn 0.5s ease;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin: 3rem 0;
        }
        .feature-card {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 20px;
            padding: 2rem;
            transition: transform 0.3s ease;
            color: white;
        }
        .feature-card:hover {
            transform: translateY(-5px);
        }
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .feature-title {
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
            font-weight: bold;
        }
        .contact-info {
            margin-top: 3rem;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            color: white;
        }
        .social-links {
            margin-top: 1rem;
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
        }
        .social-link {
            color: #ddd6fe;
            text-decoration: none;
            padding: 0.8rem;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
            font-size: 0.9rem;
        }
        .social-link:hover {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            transform: translateY(-2px);
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }
            .container {
                padding: 2rem;
                margin: 1rem;
            }
            .register-form {
                padding: 2rem;
            }
            .logo {
                font-size: 3rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🪙 RimToken</div>
        <div class="subtitle">منصة العملات المشفرة الحديثة - ابدأ رحلتك الآن!</div>
        
        <!-- نموذج التسجيل الرئيسي -->
        <div class="register-form">
            <h2>إنشاء حساب جديد</h2>
            <form id="registerForm">
                <div class="form-row">
                    <input type="text" placeholder="الاسم الكامل" required>
                    <input type="email" placeholder="البريد الإلكتروني" required>
                </div>
                <div class="form-row">
                    <input type="tel" placeholder="رقم الهاتف" required>
                    <input type="password" placeholder="كلمة المرور" required>
                </div>
                <button type="submit" class="btn-register">إنشاء حساب مجاناً 🚀</button>
            </form>
            
            <div id="successMsg" class="success-message">
                🎉 تم إنشاء حسابك بنجاح! مرحباً بك في RimToken
            </div>
        </div>
        
        <!-- المميزات -->
        <div class="features">
            <div class="feature-card">
                <div class="feature-icon">💰</div>
                <div class="feature-title">محفظة متعددة العملات</div>
                <p>ادعم أكثر من 1000 عملة مشفرة</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🔄</div>
                <div class="feature-title">تبديل فوري</div>
                <p>تبديل العملات بأفضل الأسعار</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🔒</div>
                <div class="feature-title">أمان متقدم</div>
                <p>حماية عالية المستوى لأموالك</p>
            </div>
        </div>
        
        <div class="contact-info">
            <h3>تواصل معنا</h3>
            <p>📞 هاتف: 37968897</p>
            <p>📧 بريد إلكتروني: INFO@RIMTOKEN.ORG</p>
            <p>🌐 الموقع: rimtoken.org</p>
            
            <div class="social-links">
                <a href="https://www.reddit.com/u/rimtoken/s/HnGk0uGY70" class="social-link">Reddit</a>
                <a href="https://tiktok.com/@rimtoken" class="social-link">TikTok</a>
                <a href="https://discord.com/invite/ZqvXkQEwyA" class="social-link">Discord</a>
                <a href="https://t.me/rimtoken9" class="social-link">Telegram</a>
                <a href="https://www.youtube.com/@Rimtoken" class="social-link">YouTube</a>
                <a href="https://chat.whatsapp.com/HIjL1n2nLC55bJhTMifDZD" class="social-link">WhatsApp</a>
                <a href="https://github.com/Hacenm" class="social-link">GitHub</a>
                <a href="https://www.facebook.com/rimtoken1" class="social-link">Facebook</a>
                <a href="https://x.com/rimtoken" class="social-link">Twitter/X</a>
                <a href="https://www.linkedin.com/in/rim-token-6373082a2" class="social-link">LinkedIn</a>
                <a href="https://medium.com/@rimtoken9" class="social-link">Medium</a>
            </div>
            
            <br>
            <p><strong>شبكات مدعومة:</strong> Ethereum • Solana • BSC • Polygon</p>
        </div>
    </div>
    
    <script>
        // تفعيل نموذج التسجيل
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // إخفاء النموذج مع تأثير
            const form = document.getElementById('registerForm');
            form.style.transform = 'scale(0.95)';
            form.style.opacity = '0.3';
            
            setTimeout(() => {
                form.style.display = 'none';
                document.getElementById('successMsg').style.display = 'block';
                
                // رسالة ترحيب إضافية
                setTimeout(() => {
                    alert('🎉 مرحباً بك في عائلة RimToken!\\n\\nستتمكن الآن من:\\n• إدارة محفظتك بأمان\\n• تبديل العملات المشفرة\\n• تتبع استثماراتك\\n• الوصول لأفضل الأسعار\\n\\nابدأ رحلتك معنا الآن!');
                }, 1500);
            }, 800);
        });
    </script>
</body>
</html>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎉 RimToken Website is running at http://localhost:${PORT}`);
  console.log('✨ Your beautiful registration page is ready!');
});