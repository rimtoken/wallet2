#!/usr/bin/env python3

from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class RimTokenHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '/index.html':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            html_content = '''<!DOCTYPE html>
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
        }
        
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            direction: rtl;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .logo {
            font-size: 3rem;
            font-weight: bold;
            color: white;
            margin-bottom: 1rem;
        }
        
        .logo-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            display: block;
        }
        
        .subtitle {
            font-size: 1.2rem;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 2rem;
        }
        
        .main-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            width: 100%;
            max-width: 1000px;
            align-items: center;
        }
        
        .form-section {
            background: rgba(255, 255, 255, 0.95);
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
        }
        
        .form-title {
            font-size: 2rem;
            color: #333;
            margin-bottom: 1rem;
            text-align: center;
        }
        
        .form-subtitle {
            color: #666;
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #333;
            font-weight: 500;
        }
        
        .form-group input {
            width: 100%;
            padding: 1rem;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .submit-btn {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.3s;
        }
        
        .submit-btn:hover {
            transform: translateY(-2px);
        }
        
        .features {
            display: grid;
            gap: 2rem;
        }
        
        .feature-card {
            background: rgba(255, 255, 255, 0.15);
            padding: 2rem;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            display: block;
        }
        
        .feature-title {
            font-size: 1.3rem;
            color: white;
            margin-bottom: 0.5rem;
            font-weight: bold;
        }
        
        .feature-text {
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.6;
        }
        
        .contact-info {
            text-align: center;
            margin-top: 3rem;
            color: rgba(255, 255, 255, 0.9);
        }
        
        .contact-info a {
            color: white;
            text-decoration: none;
            font-weight: bold;
        }
        
        .social-links {
            margin-top: 1rem;
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .social-link {
            color: white;
            font-size: 1.5rem;
            text-decoration: none;
            transition: transform 0.3s;
        }
        
        .social-link:hover {
            transform: scale(1.2);
        }
        
        @media (max-width: 768px) {
            .main-content {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
            
            .container {
                padding: 10px;
            }
            
            .form-section {
                padding: 2rem;
            }
        }
        
        .success-message {
            display: none;
            background: #4CAF50;
            color: white;
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1rem;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-icon">🪙</div>
            <h1 class="logo">RimToken</h1>
            <p class="subtitle">منصة العملات الرقمية الآمنة والموثوقة</p>
        </div>
        
        <div class="main-content">
            <div class="form-section">
                <div class="success-message" id="successMessage">
                    🎉 مرحباً بك في RimToken! تم إنشاء حسابك بنجاح
                </div>
                
                <h2 class="form-title">انضم إلى RimToken</h2>
                <p class="form-subtitle">ابدأ رحلتك في عالم العملات الرقمية</p>
                
                <form id="registrationForm">
                    <div class="form-group">
                        <label for="fullName">الاسم الكامل</label>
                        <input type="text" id="fullName" name="fullName" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">البريد الإلكتروني</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">رقم الهاتف</label>
                        <input type="tel" id="phone" name="phone" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="password">كلمة المرور</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    
                    <button type="submit" class="submit-btn">
                        إنشاء حساب مجاناً 🚀
                    </button>
                </form>
            </div>
            
            <div class="features">
                <div class="feature-card">
                    <span class="feature-icon">💼</span>
                    <h3 class="feature-title">محفظة آمنة</h3>
                    <p class="feature-text">احفظ عملاتك الرقمية بأمان تام مع أحدث تقنيات الحماية والتشفير</p>
                </div>
                
                <div class="feature-card">
                    <span class="feature-icon">🔄</span>
                    <h3 class="feature-title">تبديل سريع</h3>
                    <p class="feature-text">بدّل بين العملات المختلفة بسرعة وبأفضل الأسعار في السوق</p>
                </div>
                
                <div class="feature-card">
                    <span class="feature-icon">🛡️</span>
                    <h3 class="feature-title">أمان متطور</h3>
                    <p class="feature-text">نحمي أصولك بأحدث تقنيات الأمان والمصادقة الثنائية</p>
                </div>
            </div>
        </div>
        
        <div class="contact-info">
            <p>📞 <a href="tel:37968897">37968897</a> | ✉️ <a href="mailto:INFO@RIMTOKEN.ORG">INFO@RIMTOKEN.ORG</a></p>
            
            <div class="social-links">
                <a href="#" class="social-link" title="Reddit">🔴</a>
                <a href="#" class="social-link" title="TikTok">⚫</a>
                <a href="#" class="social-link" title="Discord">🟣</a>
                <a href="#" class="social-link" title="Telegram">🔵</a>
                <a href="#" class="social-link" title="YouTube">🔴</a>
                <a href="#" class="social-link" title="WhatsApp">🟢</a>
                <a href="#" class="social-link" title="GitHub">⚫</a>
                <a href="#" class="social-link" title="Facebook">🔵</a>
                <a href="#" class="social-link" title="X">⚫</a>
                <a href="#" class="social-link" title="LinkedIn">🔵</a>
            </div>
        </div>
    </div>
    
    <script>
        document.getElementById('registrationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            document.getElementById('successMessage').style.display = 'block';
            
            // Reset form
            this.reset();
            
            // Scroll to top
            window.scrollTo(0, 0);
        });
    </script>
</body>
</html>'''
            
            self.wfile.write(html_content.encode('utf-8'))
            return
        
        # Handle other requests normally
        super().do_GET()

if __name__ == '__main__':
    port = 5000
    server = HTTPServer(('0.0.0.0', port), RimTokenHandler)
    print(f'🎉 RimToken Website is running at http://localhost:{port}')
    print('✨ Your beautiful registration page is ready!')
    server.serve_forever()