#!/usr/bin/env python3
import os
import json
import requests
import secrets
import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn

class CryptoAPIService:
    def __init__(self):
        self.api_key = os.environ.get('COINMARKETCAP_API_KEY')
        self.base_url = "https://pro-api.coinmarketcap.com/v1"
    
    def get_real_time_prices(self):
        """Get real-time cryptocurrency prices from CoinMarketCap"""
        if not self.api_key:
            return self.get_demo_data()
        
        try:
            headers = {
                'Accepts': 'application/json',
                'X-CMC_PRO_API_KEY': self.api_key,
            }
            
            response = requests.get(
                f"{self.base_url}/cryptocurrency/listings/latest",
                headers=headers,
                params={'start': '1', 'limit': '6', 'convert': 'USD'},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                crypto_list = []
                for coin in data['data']:
                    crypto_list.append({
                        'symbol': coin['symbol'],
                        'name': coin['name'],
                        'price': coin['quote']['USD']['price'],
                        'change_24h': coin['quote']['USD']['percent_change_24h']
                    })
                return crypto_list
            else:
                return self.get_demo_data()
        except:
            return self.get_demo_data()
    
    def get_demo_data(self):
        """Demo data when API is not available"""
        return [
            {'symbol': 'BTC', 'name': 'Bitcoin', 'price': 43250.00, 'change_24h': 2.45},
            {'symbol': 'ETH', 'name': 'Ethereum', 'price': 2580.00, 'change_24h': -1.23},
            {'symbol': 'BNB', 'name': 'BNB', 'price': 245.80, 'change_24h': 1.45},
            {'symbol': 'SOL', 'name': 'Solana', 'price': 98.60, 'change_24h': -0.75},
            {'symbol': 'ADA', 'name': 'Cardano', 'price': 0.485, 'change_24h': 3.20},
            {'symbol': 'DOT', 'name': 'Polkadot', 'price': 7.35, 'change_24h': -2.10}
        ]

class LandingPageHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.crypto_service = CryptoAPIService()
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        if self.path == '/':
            self.handle_landing_page()
        elif self.path == '/api/crypto/prices':
            self.handle_crypto_api()
        elif self.path == '/login':
            self.handle_login_page()
        elif self.path == '/signup':
            self.handle_signup_page()
        elif self.path == '/trading':
            self.handle_trading_page()
        elif self.path == '/wallet':
            self.handle_wallet_page()
        else:
            self.send_error(404)
    
    def handle_crypto_api(self):
        """API endpoint for cryptocurrency prices"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        crypto_data = self.crypto_service.get_real_time_prices()
        
        response_data = {
            'success': True,
            'data': crypto_data,
            'timestamp': datetime.datetime.utcnow().isoformat() + 'Z'
        }
        
        self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))
    
    def handle_landing_page(self):
        """Modern landing page for visitors to explore first"""
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        
        crypto_data = self.crypto_service.get_real_time_prices()
        
        # Generate live price ticker
        price_ticker = ""
        for coin in crypto_data[:4]:  # Show top 4 coins in ticker
            change_class = "positive" if coin['change_24h'] >= 0 else "negative"
            change_symbol = "+" if coin['change_24h'] >= 0 else ""
            price_ticker += f"""
                <div class="ticker-item">
                    <span class="ticker-symbol">{coin['symbol']}</span>
                    <span class="ticker-price">${coin['price']:,.2f}</span>
                    <span class="ticker-change {change_class}">{change_symbol}{coin['change_24h']:.2f}%</span>
                </div>
            """
        
        # Generate featured cryptocurrencies section
        featured_cryptos = ""
        for coin in crypto_data:
            change_class = "positive" if coin['change_24h'] >= 0 else "negative"
            change_symbol = "+" if coin['change_24h'] >= 0 else ""
            featured_cryptos += f"""
                <div class="crypto-card">
                    <div class="crypto-header">
                        <h3>{coin['symbol']}</h3>
                        <span class="crypto-name">{coin['name']}</span>
                    </div>
                    <div class="crypto-price">
                        <span class="price">${coin['price']:,.2f}</span>
                        <span class="change {change_class}">{change_symbol}{coin['change_24h']:.2f}%</span>
                    </div>
                </div>
            """
        
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RimToken - Advanced Cryptocurrency Trading Platform</title>
    <meta name="description" content="Professional cryptocurrency trading platform with real-time data, secure transactions, and advanced portfolio management">
    
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        
        body {{ 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
            background: #0a0e27;
            color: #ffffff;
            line-height: 1.6;
            overflow-x: hidden;
        }}
        
        /* Header */
        .header {{
            position: fixed;
            top: 0;
            width: 100%;
            background: rgba(10, 14, 39, 0.95);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1000;
            padding: 1rem 0;
        }}
        
        .nav {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }}
        
        .logo {{
            font-size: 1.8rem;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }}
        
        .nav-links {{
            display: flex;
            gap: 2rem;
            align-items: center;
        }}
        
        .nav-link {{
            color: #a0a9c0;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }}
        
        .nav-link:hover {{
            color: #667eea;
        }}
        
        .auth-buttons {{
            display: flex;
            gap: 1rem;
        }}
        
        .btn {{
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }}
        
        .btn-outline {{
            background: transparent;
            border: 2px solid #667eea;
            color: #667eea;
        }}
        
        .btn-outline:hover {{
            background: #667eea;
            color: white;
        }}
        
        .btn-primary {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }}
        
        .btn-primary:hover {{
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }}
        
        /* Live Price Ticker */
        .price-ticker {{
            background: rgba(255, 255, 255, 0.05);
            padding: 1rem 0;
            margin-top: 80px;
            overflow: hidden;
        }}
        
        .ticker-scroll {{
            display: flex;
            animation: scroll 30s linear infinite;
            gap: 3rem;
        }}
        
        @keyframes scroll {{
            0% {{ transform: translateX(100%); }}
            100% {{ transform: translateX(-100%); }}
        }}
        
        .ticker-item {{
            display: flex;
            align-items: center;
            gap: 0.5rem;
            white-space: nowrap;
        }}
        
        .ticker-symbol {{
            font-weight: 700;
            color: #667eea;
        }}
        
        .ticker-price {{
            font-weight: 600;
        }}
        
        .ticker-change.positive {{
            color: #00d4aa;
        }}
        
        .ticker-change.negative {{
            color: #ff4757;
        }}
        
        /* Hero Section */
        .hero {{
            padding: 6rem 2rem 4rem;
            text-align: center;
            background: radial-gradient(ellipse at center, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
        }}
        
        .hero-content {{
            max-width: 800px;
            margin: 0 auto;
        }}
        
        .hero-title {{
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            background: linear-gradient(135deg, #ffffff 0%, #a0a9c0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }}
        
        .hero-subtitle {{
            font-size: 1.25rem;
            color: #a0a9c0;
            margin-bottom: 3rem;
            line-height: 1.6;
        }}
        
        .hero-buttons {{
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }}
        
        /* Features Section */
        .features {{
            padding: 4rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }}
        
        .features-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }}
        
        .feature-card {{
            background: rgba(255, 255, 255, 0.05);
            padding: 2rem;
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            text-align: center;
            transition: transform 0.3s ease;
        }}
        
        .feature-card:hover {{
            transform: translateY(-5px);
        }}
        
        .feature-icon {{
            font-size: 3rem;
            margin-bottom: 1rem;
        }}
        
        .feature-title {{
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #667eea;
        }}
        
        .feature-description {{
            color: #a0a9c0;
        }}
        
        /* Live Prices Section */
        .live-prices {{
            padding: 4rem 2rem;
            background: rgba(255, 255, 255, 0.02);
        }}
        
        .section-title {{
            text-align: center;
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 3rem;
            color: #ffffff;
        }}
        
        .crypto-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            max-width: 1200px;
            margin: 0 auto;
        }}
        
        .crypto-card {{
            background: rgba(255, 255, 255, 0.05);
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }}
        
        .crypto-card:hover {{
            transform: translateY(-3px);
            border-color: #667eea;
        }}
        
        .crypto-header {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1rem;
        }}
        
        .crypto-header h3 {{
            font-size: 1.25rem;
            font-weight: 700;
            color: #667eea;
        }}
        
        .crypto-name {{
            color: #a0a9c0;
            font-size: 0.9rem;
        }}
        
        .crypto-price {{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }}
        
        .price {{
            font-size: 1.5rem;
            font-weight: 700;
        }}
        
        .change.positive {{
            color: #00d4aa;
            font-weight: 600;
        }}
        
        .change.negative {{
            color: #ff4757;
            font-weight: 600;
        }}
        
        /* Footer */
        .footer {{
            background: rgba(0, 0, 0, 0.3);
            padding: 3rem 2rem 2rem;
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }}
        
        .footer-content {{
            max-width: 1200px;
            margin: 0 auto;
        }}
        
        .footer-text {{
            color: #a0a9c0;
            margin-bottom: 1rem;
        }}
        
        /* Responsive Design */
        @media (max-width: 768px) {{
            .hero-title {{
                font-size: 2.5rem;
            }}
            
            .nav {{
                padding: 0 1rem;
            }}
            
            .hero-buttons {{
                flex-direction: column;
                align-items: center;
            }}
        }}
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="logo">RimToken</div>
            <div class="nav-links">
                <a href="/trading" class="nav-link">Trading</a>
                <a href="/wallet" class="nav-link">Wallet</a>
                <a href="#features" class="nav-link">Features</a>
                <a href="#prices" class="nav-link">Live Prices</a>
                <a href="#about" class="nav-link">About</a>
            </div>
            <div class="auth-buttons">
                <a href="/login" class="btn btn-outline">Sign In</a>
                <a href="/signup" class="btn btn-primary">Get Started</a>
            </div>
        </nav>
    </header>

    <div class="price-ticker">
        <div class="ticker-scroll">
            {price_ticker}
        </div>
    </div>

    <section class="hero">
        <div class="hero-content">
            <h1 class="hero-title">Trade Crypto with Confidence</h1>
            <p class="hero-subtitle">
                Experience the next generation of cryptocurrency trading with real-time data, 
                advanced security, and professional-grade tools designed for both beginners and experts.
            </p>
            <div class="hero-buttons">
                <a href="/signup" class="btn btn-primary">Start Trading Now</a>
                <a href="#features" class="btn btn-outline">Explore Features</a>
            </div>
        </div>
    </section>

    <section class="features" id="features">
        <div class="section-title">Why Choose RimToken?</div>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">🔒</div>
                <h3 class="feature-title">Bank-Level Security</h3>
                <p class="feature-description">
                    Advanced encryption and multi-layer security protocols to keep your assets safe
                </p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">⚡</div>
                <h3 class="feature-title">Real-Time Trading</h3>
                <p class="feature-description">
                    Lightning-fast execution with live market data and instant order processing
                </p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">📊</div>
                <h3 class="feature-title">Advanced Analytics</h3>
                <p class="feature-description">
                    Professional trading tools with detailed charts and market analysis
                </p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🌍</div>
                <h3 class="feature-title">Global Access</h3>
                <p class="feature-description">
                    Trade 24/7 from anywhere in the world with our responsive platform
                </p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">💼</div>
                <h3 class="feature-title">Portfolio Management</h3>
                <p class="feature-description">
                    Track and manage your crypto portfolio with detailed insights and reports
                </p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🎯</div>
                <h3 class="feature-title">Low Fees</h3>
                <p class="feature-description">
                    Competitive trading fees and transparent pricing with no hidden costs
                </p>
            </div>
        </div>
    </section>

    <section class="live-prices" id="prices">
        <div class="section-title">Live Cryptocurrency Prices</div>
        <div class="crypto-grid">
            {featured_cryptos}
        </div>
    </section>

    <footer class="footer" id="about">
        <div class="footer-content">
            <div class="footer-text">
                <strong>RimToken</strong> - Your trusted partner in cryptocurrency trading
            </div>
            <div class="footer-text">
                Professional platform • Secure trading • Real-time data • 24/7 support
            </div>
        </div>
    </footer>

    <script>
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {{
            anchor.addEventListener('click', function (e) {{
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({{
                    behavior: 'smooth'
                }});
            }});
        }});

        // Update prices every 30 seconds
        setInterval(() => {{
            fetch('/api/crypto/prices')
                .then(response => response.json())
                .then(data => {{
                    console.log('Price data updated:', data.timestamp);
                }})
                .catch(error => console.log('Price update failed:', error));
        }}, 30000);
    </script>
</body>
</html>"""
        
        self.wfile.write(html_content.encode('utf-8'))

    def handle_login_page(self):
        """Login page for existing users"""
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        
        html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In - RimToken</title>
    <style>
        body { 
            font-family: 'Inter', sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
        }
        .login-container {
            background: rgba(255, 255, 255, 0.95);
            padding: 3rem;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
        }
        .logo {
            text-align: center;
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 2rem;
            color: #667eea;
        }
        .form-group {
            margin-bottom: 1.5rem;
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
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        input:focus {
            outline: none;
            border-color: #667eea;
        }
        .btn {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .links {
            text-align: center;
            margin-top: 2rem;
        }
        .links a {
            color: #667eea;
            text-decoration: none;
            margin: 0 1rem;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">RimToken</div>
        <form>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn">Sign In</button>
        </form>
        <div class="links">
            <a href="/">← Back to Home</a>
            <a href="/signup">Create Account</a>
        </div>
    </div>
</body>
</html>"""
        
        self.wfile.write(html_content.encode('utf-8'))

    def handle_signup_page(self):
        """Registration page for new users"""
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        
        html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Get Started - RimToken</title>
    <style>
        body { 
            font-family: 'Inter', sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
        }
        .signup-container {
            background: rgba(255, 255, 255, 0.95);
            padding: 3rem;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
        }
        .logo {
            text-align: center;
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 2rem;
            color: #667eea;
        }
        .form-group {
            margin-bottom: 1.5rem;
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
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        input:focus {
            outline: none;
            border-color: #667eea;
        }
        .btn {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .links {
            text-align: center;
            margin-top: 2rem;
        }
        .links a {
            color: #667eea;
            text-decoration: none;
            margin: 0 1rem;
        }
    </style>
</head>
<body>
    <div class="signup-container">
        <div class="logo">RimToken</div>
        <form>
            <div class="form-group">
                <label for="fullname">Full Name</label>
                <input type="text" id="fullname" name="fullname" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn">Create Account</button>
        </form>
        <div class="links">
            <a href="/">← Back to Home</a>
            <a href="/login">Already have an account?</a>
        </div>
    </div>
</body>
</html>"""
        
        self.wfile.write(html_content.encode('utf-8'))

    def handle_trading_page(self):
        """Trading page with swap interface similar to the reference design"""
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        
        crypto_data = self.crypto_service.get_real_time_prices()
        
        # Get current prices for display
        eth_price = next((coin['price'] for coin in crypto_data if coin['symbol'] == 'ETH'), 2580.00)
        btc_price = next((coin['price'] for coin in crypto_data if coin['symbol'] == 'BTC'), 43250.00)
        
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trade - RimToken</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
        }}
        
        .header {{
            background: white;
            border-bottom: 1px solid #e2e8f0;
            padding: 1rem 0;
        }}
        
        .nav {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }}
        
        .logo-section {{
            display: flex;
            align-items: center;
            gap: 2rem;
        }}
        
        .logo {{
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.25rem;
            font-weight: 700;
            color: #1e293b;
            text-decoration: none;
        }}
        
        .logo-icon {{
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }}
        
        .nav-menu {{
            display: flex;
            gap: 2rem;
            align-items: center;
        }}
        
        .nav-item {{
            color: #64748b;
            text-decoration: none;
            font-weight: 500;
            padding: 0.5rem 0;
            border-bottom: 2px solid transparent;
            transition: all 0.2s ease;
        }}
        
        .nav-item:hover, .nav-item.active {{
            color: #1e293b;
            border-bottom-color: #3b82f6;
        }}
        
        .dropdown-arrow {{
            margin-left: 0.25rem;
            font-size: 0.8rem;
        }}
        
        .connect-wallet {{
            background: #3b82f6;
            color: white;
            padding: 0.625rem 1.25rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: background 0.2s ease;
        }}
        
        .connect-wallet:hover {{
            background: #2563eb;
        }}
        
        .main-content {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 2rem;
            display: flex;
            justify-content: center;
        }}
        
        .swap-container {{
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            width: 100%;
            max-width: 480px;
        }}
        
        .swap-tabs {{
            display: flex;
            background: #f1f5f9;
            border-radius: 8px;
            padding: 4px;
            margin-bottom: 2rem;
        }}
        
        .swap-tab {{
            flex: 1;
            padding: 0.75rem;
            text-align: center;
            background: transparent;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #64748b;
        }}
        
        .swap-tab.active {{
            background: white;
            color: #1e293b;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }}
        
        .swap-controls {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }}
        
        .settings-icon {{
            color: #64748b;
            cursor: pointer;
            transition: color 0.2s ease;
        }}
        
        .settings-icon:hover {{
            color: #1e293b;
        }}
        
        .token-input {{
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 0.5rem;
            transition: border-color 0.2s ease;
        }}
        
        .token-input:hover {{
            border-color: #cbd5e1;
        }}
        
        .token-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }}
        
        .token-label {{
            color: #64748b;
            font-size: 0.875rem;
            font-weight: 500;
        }}
        
        .token-balance {{
            color: #64748b;
            font-size: 0.875rem;
        }}
        
        .token-row {{
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        
        .token-selector {{
            display: flex;
            align-items: center;
            gap: 0.75rem;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 0.75rem 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }}
        
        .token-selector:hover {{
            background: #f1f5f9;
        }}
        
        .token-icon {{
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 0.75rem;
            font-weight: bold;
        }}
        
        .token-info {{
            display: flex;
            flex-direction: column;
        }}
        
        .token-symbol {{
            font-weight: 600;
            color: #1e293b;
        }}
        
        .token-network {{
            font-size: 0.75rem;
            color: #64748b;
        }}
        
        .amount-input {{
            background: transparent;
            border: none;
            font-size: 1.5rem;
            font-weight: 600;
            text-align: right;
            color: #1e293b;
            width: 200px;
        }}
        
        .amount-input:focus {{
            outline: none;
        }}
        
        .amount-input::placeholder {{
            color: #cbd5e1;
        }}
        
        .swap-arrow {{
            display: flex;
            justify-content: center;
            margin: 0.5rem 0;
        }}
        
        .arrow-btn {{
            background: #f8fafc;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 0.5rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }}
        
        .arrow-btn:hover {{
            background: #f1f5f9;
            border-color: #cbd5e1;
        }}
        
        .connect-wallet-main {{
            width: 100%;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 12px;
            padding: 1rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s ease;
            margin-top: 1.5rem;
        }}
        
        .connect-wallet-main:hover {{
            background: #2563eb;
        }}
        
        @media (max-width: 768px) {{
            .nav-menu {{
                gap: 1rem;
            }}
            
            .main-content {{
                padding: 2rem 1rem;
            }}
        }}
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="logo-section">
                <a href="/" class="logo">
                    <div class="logo-icon">R</div>
                    rimtoken
                </a>
                <div class="nav-menu">
                    <a href="/trading" class="nav-item active">Trade <span class="dropdown-arrow">▼</span></a>
                    <a href="/portfolio" class="nav-item">Portfolio <span class="dropdown-arrow">▼</span></a>
                    <a href="/dao" class="nav-item">DAO <span class="dropdown-arrow">▼</span></a>
                    <a href="/buy" class="nav-item">Buy Crypto</a>
                    <a href="/card" class="nav-item">Card</a>
                </div>
            </div>
            <div>
                <a href="#" class="connect-wallet">Connect wallet</a>
            </div>
        </nav>
    </header>

    <main class="main-content">
        <div class="swap-container">
            <div class="swap-tabs">
                <button class="swap-tab active" onclick="switchSwapTab('swap')">Swap</button>
                <button class="swap-tab" onclick="switchSwapTab('limit')">Limit</button>
            </div>
            
            <div class="swap-controls">
                <div></div>
                <div class="settings-icon">⚙️</div>
            </div>
            
            <div class="token-input">
                <div class="token-header">
                    <span class="token-label">You pay</span>
                    <span class="token-balance">~$2,642.19</span>
                </div>
                <div class="token-row">
                    <div class="token-selector" onclick="openTokenSelector('from')">
                        <div class="token-icon">E</div>
                        <div class="token-info">
                            <div class="token-symbol">ETH</div>
                            <div class="token-network">on Ethereum</div>
                        </div>
                        <span>▼</span>
                    </div>
                    <input type="text" class="amount-input" placeholder="1" value="1">
                </div>
            </div>
            
            <div class="swap-arrow">
                <button class="arrow-btn" onclick="swapTokens()">🔄</button>
            </div>
            
            <div class="token-input">
                <div class="token-header">
                    <span class="token-label">You receive</span>
                    <span class="token-balance"></span>
                </div>
                <div class="token-row">
                    <div class="token-selector" onclick="openTokenSelector('to')">
                        <div class="token-icon">U</div>
                        <div class="token-info">
                            <div class="token-symbol">USDS</div>
                            <div class="token-network">on Ethereum</div>
                        </div>
                        <span>▼</span>
                    </div>
                    <input type="text" class="amount-input" placeholder="0" value="${eth_price:,.2f}" readonly>
                </div>
            </div>
            
            <button class="connect-wallet-main" onclick="connectWallet()">
                Connect wallet
            </button>
        </div>
    </main>

    <script>
        function switchSwapTab(tab) {{
            document.querySelectorAll('.swap-tab').forEach(t => t.classList.remove('active'));
            event.target.classList.add('active');
        }}
        
        function openTokenSelector(type) {{
            // Token selector functionality would be implemented here
            console.log('Opening token selector for:', type);
        }}
        
        function swapTokens() {{
            // Swap tokens functionality
            console.log('Swapping tokens');
        }}
        
        function connectWallet() {{
            // Wallet connection functionality
            console.log('Connecting wallet');
        }}
        
        // Update exchange rate every 30 seconds
        setInterval(() => {{
            fetch('/api/crypto/prices')
                .then(response => response.json())
                .then(data => {{
                    const ethPrice = data.data.find(coin => coin.symbol === 'ETH')?.price || {eth_price};
                    document.querySelector('.token-input:last-of-type .amount-input').value = ethPrice.toFixed(2);
                }})
                .catch(error => console.log('Price update failed'));
        }}, 30000);
    </script>
</body>
</html>"""
        
        self.wfile.write(html_content.encode('utf-8'))

    def handle_wallet_page(self):
        """Wallet page for portfolio management"""
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        
        crypto_data = self.crypto_service.get_real_time_prices()
        
        # Generate portfolio items (mock user data)
        portfolio_items = ""
        mock_balances = [0.25, 1.5, 450.0, 12.5, 850.0, 25.0]
        total_value = 0
        
        for i, coin in enumerate(crypto_data):
            if i < len(mock_balances):
                balance = mock_balances[i]
                value = balance * coin['price']
                total_value += value
                change_class = "positive" if coin['change_24h'] >= 0 else "negative"
                change_symbol = "+" if coin['change_24h'] >= 0 else ""
                
                portfolio_items += f"""
                    <div class="wallet-item">
                        <div class="coin-info">
                            <div class="coin-details">
                                <h3>{coin['symbol']}</h3>
                                <p>{coin['name']}</p>
                            </div>
                        </div>
                        <div class="balance-info">
                            <div class="balance">{balance} {coin['symbol']}</div>
                            <div class="value">${value:,.2f}</div>
                            <div class="change {change_class}">{change_symbol}{coin['change_24h']:.2f}%</div>
                        </div>
                        <div class="actions">
                            <button class="action-btn send">Send</button>
                            <button class="action-btn receive">Receive</button>
                        </div>
                    </div>
                """
        
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wallet - RimToken</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
            background: #0a0e27;
            color: #ffffff;
            line-height: 1.6;
        }}
        .header {{
            position: fixed;
            top: 0;
            width: 100%;
            background: rgba(10, 14, 39, 0.95);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1000;
            padding: 1rem 0;
        }}
        .nav {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }}
        .logo {{
            font-size: 1.8rem;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-decoration: none;
        }}
        .nav-links {{
            display: flex;
            gap: 2rem;
            align-items: center;
        }}
        .nav-link {{
            color: #a0a9c0;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }}
        .nav-link:hover, .nav-link.active {{
            color: #667eea;
        }}
        .auth-buttons {{
            display: flex;
            gap: 1rem;
        }}
        .btn {{
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }}
        .btn-outline {{
            background: transparent;
            border: 2px solid #667eea;
            color: #667eea;
        }}
        .btn-primary {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 100px 2rem 2rem;
        }}
        .page-title {{
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 2rem;
            text-align: center;
        }}
        .portfolio-summary {{
            background: rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            padding: 2rem;
            margin-bottom: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
        }}
        .total-value {{
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }}
        .portfolio-stats {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }}
        .stat-item {{
            text-align: center;
        }}
        .stat-label {{
            color: #a0a9c0;
            margin-bottom: 0.5rem;
        }}
        .stat-value {{
            font-size: 1.5rem;
            font-weight: 700;
        }}
        .wallet-grid {{
            display: grid;
            gap: 1rem;
        }}
        .wallet-item {{
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.3s ease;
        }}
        .wallet-item:hover {{
            transform: translateY(-2px);
            border-color: #667eea;
        }}
        .coin-info {{
            display: flex;
            align-items: center;
            gap: 1rem;
        }}
        .coin-details h3 {{
            font-size: 1.2rem;
            margin-bottom: 0.25rem;
        }}
        .coin-details p {{
            color: #a0a9c0;
            font-size: 0.9rem;
        }}
        .balance-info {{
            text-align: right;
        }}
        .balance {{
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
        }}
        .value {{
            color: #a0a9c0;
            margin-bottom: 0.25rem;
        }}
        .change.positive {{
            color: #00d4aa;
            font-weight: 600;
        }}
        .change.negative {{
            color: #ff4757;
            font-weight: 600;
        }}
        .actions {{
            display: flex;
            gap: 0.5rem;
        }}
        .action-btn {{
            padding: 0.5rem 1rem;
            border: 1px solid #667eea;
            background: transparent;
            color: #667eea;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }}
        .action-btn:hover {{
            background: #667eea;
            color: white;
        }}
        .action-btn.send {{
            border-color: #ff4757;
            color: #ff4757;
        }}
        .action-btn.send:hover {{
            background: #ff4757;
            color: white;
        }}
        .quick-actions {{
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin: 2rem 0;
        }}
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <a href="/" class="logo">RimToken</a>
            <div class="nav-links">
                <a href="/trading" class="nav-link">Trading</a>
                <a href="/wallet" class="nav-link active">Wallet</a>
                <a href="/#features" class="nav-link">Features</a>
                <a href="/#prices" class="nav-link">Live Prices</a>
                <a href="/#about" class="nav-link">About</a>
            </div>
            <div class="auth-buttons">
                <a href="/login" class="btn btn-outline">Sign In</a>
                <a href="/signup" class="btn btn-primary">Get Started</a>
            </div>
        </nav>
    </header>

    <div class="container">
        <h1 class="page-title">My Wallet</h1>
        
        <div class="portfolio-summary">
            <div class="total-value">${total_value:,.2f}</div>
            <p>Total Portfolio Value</p>
            
            <div class="portfolio-stats">
                <div class="stat-item">
                    <div class="stat-label">24h Change</div>
                    <div class="stat-value" style="color: #00d4aa;">+$1,234.56</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Total Assets</div>
                    <div class="stat-value">{len(crypto_data)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Available Balance</div>
                    <div class="stat-value">${total_value * 0.95:,.2f}</div>
                </div>
            </div>
        </div>
        
        <div class="quick-actions">
            <button class="btn btn-primary">Add Funds</button>
            <button class="btn btn-outline">Withdraw</button>
            <button class="btn btn-outline">Transaction History</button>
        </div>
        
        <div class="wallet-grid">
            {portfolio_items}
        </div>
    </div>

    <script>
        // Update portfolio values every 30 seconds
        setInterval(() => {{
            fetch('/api/crypto/prices')
                .then(response => response.json())
                .then(data => {{
                    console.log('Portfolio data updated');
                }})
                .catch(error => console.log('Update failed'));
        }}, 30000);
    </script>
</body>
</html>"""
        
        self.wfile.write(html_content.encode('utf-8'))

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread for better performance"""
    allow_reuse_address = True
    daemon_threads = True

def main():
    try:
        server_address = ('0.0.0.0', 3000)
        httpd = ThreadedHTTPServer(server_address, LandingPageHandler)
        print("🚀 RimToken Platform")
        print("🌐 Running on http://localhost:3000")
        print("✨ Ready for preview")
        httpd.serve_forever()
    except OSError as e:
        if e.errno == 98:
            print("Port 3000 in use, trying alternative...")
            server_address = ('0.0.0.0', 8000)
            httpd = ThreadedHTTPServer(server_address, LandingPageHandler)
            print("🚀 RimToken Platform")
            print("🌐 Running on http://localhost:8000")
            httpd.serve_forever()
        else:
            raise e

if __name__ == "__main__":
    main()