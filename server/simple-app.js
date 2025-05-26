const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            padding: 3rem;
            width: 90%;
            max-width: 500px;
            text-align: center;
        }
        .logo {
            font-size: 3rem;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 1rem;
        }
        .subtitle {
            color: #666;
            margin-bottom: 2rem;
            font-size: 1.2rem;
        }
        .form-group {
            margin-bottom: 1.5rem;
            text-align: right;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            color: #333;
            font-weight: 600;
        }
        input {
            width: 100%;
            padding: 1rem;
            border: 2px solid #e1e1e1;
            border-radius: 10px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        input:focus {
            outline: none;
            border-color: #667eea;
        }
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            cursor: pointer;
            width: 100%;
            margin-top: 1rem;
            transition: transform 0.3s;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .features {
            margin-top: 3rem;
            text-align: right;
        }
        .feature {
            margin-bottom: 1rem;
            color: #666;
        }
        .contact {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid #e1e1e1;
            color: #888;
        }
        .success {
            display: none;
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 1rem;
            border-radius: 10px;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🪙 RimToken</div>
        <div class="subtitle">منصة العملات المشفرة الحديثة</div>
        
        <form id="registerForm">
            <div class="form-group">
                <label>الاسم الكامل</label>
                <input type="text" id="fullName" required placeholder="أدخل اسمك الكامل">
            </div>
            
            <div class="form-group">
                <label>البريد الإلكتروني</label>
                <input type="email" id="email" required placeholder="example@email.com">
            </div>
            
            <div class="form-group">
                <label>رقم الهاتف</label>
                <input type="tel" id="phone" required placeholder="+966 XX XXX XXXX">
            </div>
            
            <div class="form-group">
                <label>كلمة المرور</label>
                <input type="password" id="password" required placeholder="كلمة مرور قوية">
            </div>
            
            <button type="submit" class="btn">إنشاء حساب جديد</button>
        </form>
        
        <div id="successMessage" class="success">
            تم إنشاء حسابك بنجاح! مرحباً بك في RimToken 🎉
        </div>
        
        <div class="features">
            <h3>مميزات RimToken:</h3>
            <div class="feature">💰 محفظة آمنة متعددة العملات</div>
            <div class="feature">🔄 تبديل سريع للعملات المشفرة</div>
            <div class="feature">📊 تحليلات مالية متقدمة</div>
            <div class="feature">🔒 أمان عالي المستوى</div>
        </div>
        
        <div class="contact">
            <p>📞 37968897 | 📧 INFO@RIMTOKEN.ORG</p>
            <p>🌐 rimtoken.org</p>
        </div>
    </div>
    
    <script>
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // إخفاء النموذج
            document.getElementById('registerForm').style.display = 'none';
            
            // إظهار رسالة النجاح
            document.getElementById('successMessage').style.display = 'block';
            
            // إعادة توجيه بعد 3 ثوان
            setTimeout(() => {
                alert('سيتم توجيهك للوحة التحكم...');
                location.reload();
            }, 3000);
        });
    </script>
</body>
</html>
  `);
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('🎉 RimToken Registration App running on port ' + PORT);
});