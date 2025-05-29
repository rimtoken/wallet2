import express from "express";
import { createServer } from "http";
import { config } from "./config";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());

// Initialize secure routes
async function startServer() {
  try {
    console.log("🔐 Initializing RimToken with secure configuration...");
    console.log(`📊 Environment: ${config.NODE_ENV}`);
    console.log(`🔑 JWT Secret configured: ${config.JWT_SECRET ? '✅' : '❌'}`);
    console.log(`🔒 Session Secret configured: ${config.SESSION_SECRET ? '✅' : '❌'}`);
    
    // Register all routes with security
    const server = await registerRoutes(app);
    
    const port = config.PORT;
    server.listen(port, "0.0.0.0", () => {
      console.log(`✅ RimToken Server running securely on port ${port}`);
      console.log(`🌐 Access at: http://localhost:${port}`);
      console.log(`🔍 Health check: http://localhost:${port}/api/system/health`);
    });
    
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Simple test route
app.get("/api/test", (req, res) => {
  res.json({ message: "RimToken Server is working securely!" });
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
                padding: 0.5rem;
                border-radius: 0.5rem;
                background: rgba(255, 255, 255, 0.1);
                transition: background 0.3s ease;
            }
            .social-link:hover {
                background: rgba(255, 255, 255, 0.2);
                color: white;
            }
            .register-form {
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(15px);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 2rem;
                padding: 3rem;
                margin: 3rem 0;
                box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            }
            .register-form h2 {
                font-size: 2.5rem;
                margin-bottom: 2rem;
                color: white;
                text-align: center;
            }
            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-bottom: 1.5rem;
            }
            .form-row input {
                padding: 1.2rem;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 1rem;
                background: rgba(255, 255, 255, 0.9);
                font-size: 1.1rem;
                transition: all 0.3s ease;
            }
            .form-row input:focus {
                outline: none;
                border-color: #fff;
                background: white;
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            }
            .btn-register {
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                color: white;
                padding: 1.5rem 3rem;
                border: none;
                border-radius: 1rem;
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
                background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
                color: white;
                padding: 2rem;
                border-radius: 1rem;
                text-align: center;
                font-size: 1.3rem;
                font-weight: bold;
                margin-top: 2rem;
                animation: slideIn 0.5s ease;
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
                    padding: 1rem;
                }
                .register-form {
                    padding: 2rem;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🪙 RimToken</h1>
            <p class="subtitle">منصة العملات المشفرة الحديثة - ابدأ رحلتك الآن!</p>
            
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
                    <button type="submit" class="btn btn-register">إنشاء حساب مجاناً</button>
                </form>
                
                <div id="successMsg" style="display:none;" class="success-message">
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
                    <a href="https://www.reddit.com/u/rimtoken/s/HnGk0uGY70" class="social-link" title="Reddit">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                        </svg>
                    </a>
                    <a href="https://tiktok.com/@rimtoken" class="social-link" title="TikTok">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                    </a>
                    <a href="https://discord.com/invite/ZqvXkQEwyA" class="social-link" title="Discord">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/>
                        </svg>
                    </a>
                    <a href="https://t.me/rimtoken9" class="social-link" title="Telegram">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                    </a>
                    <a href="https://www.youtube.com/@Rimtoken" class="social-link" title="YouTube">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                    </a>
                    <a href="https://chat.whatsapp.com/HIjL1n2nLC55bJhTMifDZD" class="social-link" title="WhatsApp">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.525 3.488"/>
                        </svg>
                    </a>
                    <a href="https://github.com/Hacenm" class="social-link" title="GitHub">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>
                    <a href="https://www.facebook.com/rimtoken1" class="social-link" title="Facebook">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </a>
                    <a href="https://x.com/rimtoken" class="social-link" title="Twitter/X">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                        </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/rim-token-6373082a2" class="social-link" title="LinkedIn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>
                    <a href="https://medium.com/@rimtoken9" class="social-link" title="Medium">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                        </svg>
                    </a>
                    <a href="https://m.me/rimtoken1" class="social-link" title="Messenger">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.374 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.626 0 12-4.974 12-11.111C24 4.975 18.626 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.1l3.131 3.26L19.752 8.1l-6.561 6.863z"/>
                        </svg>
                    </a>
                    <a href="https://m.me/ch/AbZ-TG2wxg2nmvRB" class="social-link" title="Messenger Channel">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.374 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.626 0 12-4.974 12-11.111C24 4.975 18.626 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.1l3.131 3.26L19.752 8.1l-6.561 6.863z"/>
                        </svg>
                    </a>
                </div>
                
                <br>
                <p>شبكات مدعومة: Ethereum • Solana • BSC • Polygon</p>
            </div>
        </div>
        
        <script>
            // تفعيل نموذج التسجيل
            document.getElementById('registerForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                // إخفاء النموذج مع تأثير
                const form = document.getElementById('registerForm');
                form.style.transform = 'scale(0.9)';
                form.style.opacity = '0.5';
                
                setTimeout(() => {
                    form.style.display = 'none';
                    document.getElementById('successMsg').style.display = 'block';
                    
                    // رسالة ترحيب إضافية
                    setTimeout(() => {
                        alert('🎉 مرحباً بك في عائلة RimToken!\n\nستتمكن الآن من:\n• إدارة محفظتك بأمان\n• تبديل العملات المشفرة\n• تتبع استثماراتك\n\nابدأ رحلتك معنا!');
                    }, 1000);
                }, 500);
            });
            
            // تفعيل الأزرار الأخرى
            document.querySelectorAll('.btn:not(.btn-register)').forEach(btn => {
                btn.addEventListener('click', () => {
                    alert('قم بإنشاء حساب أولاً للوصول لهذه الميزة!');
                });
            });
            
            // Test API connection
            fetch('/api/test')
                .then(response => response.json())
                .then(data => console.log('✅ RimToken متصل بنجاح:', data))
                .catch(error => console.error('❌ خطأ في الاتصال:', error));
        </script>
    </body>
    </html>
  `);
});

// Start the secure server
startServer();
