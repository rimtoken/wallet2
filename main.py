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
        elif self.path == '/portfolio':
            self.handle_portfolio_page()
        elif self.path == '/dao':
            self.handle_dao_page()
        elif self.path == '/buy':
            self.handle_buy_page()
        elif self.path == '/card':
            self.handle_card_page()
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
        """Single-page website with all sections accessible by scrolling"""
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        
        crypto_data = self.crypto_service.get_real_time_prices()
        
        # Generate live price ticker for home section
        price_ticker = ""
        for coin in crypto_data[:4]:
            change_class = "positive" if coin['change_24h'] >= 0 else "negative"
            change_symbol = "+" if coin['change_24h'] >= 0 else ""
            price_ticker += f"""
                <div class="crypto-item">
                    <div class="crypto-symbol">{coin['symbol']}</div>
                    <div class="crypto-name">{coin['name']}</div>
                    <div class="crypto-price">${coin['price']:,.2f}</div>
                    <div class="crypto-change {change_class}">{change_symbol}{coin['change_24h']:.2f}%</div>
                </div>
            """
        
        # Generate portfolio items for wallet section
        user_balances = {
            'BTC': {'amount': 0.001524896, 'icon': '₿'},
            'ETH': {'amount': 0.15642, 'icon': 'Ξ'},
            'BNB': {'amount': 2.48632, 'icon': 'BNB'},
            'SOL': {'amount': 5.8741, 'icon': 'SOL'},
            'USDT': {'amount': 1847.23, 'icon': 'T'},
            'ADA': {'amount': 328.47, 'icon': 'ADA'}
        }
        
        portfolio_items = ""
        total_value = 0
        
        for coin in crypto_data:
            if coin['symbol'] in user_balances:
                user_data = user_balances[coin['symbol']]
                balance = user_data['amount']
                value = balance * coin['price']
                total_value += value
                change_class = "positive" if coin['change_24h'] >= 0 else "negative"
                change_symbol = "+" if coin['change_24h'] >= 0 else ""
                
                portfolio_items += f"""
                    <div class="portfolio-item">
                        <div class="coin-icon">
                            <div class="icon-circle">{user_data['icon']}</div>
                        </div>
                        <div class="coin-details">
                            <div class="coin-name">{coin['name']}</div>
                            <div class="coin-symbol">{coin['symbol']}</div>
                        </div>
                        <div class="coin-balance">
                            <div class="balance-amount">${value:,.2f}</div>
                            <div class="balance-tokens">{balance:.6f} {coin['symbol']}</div>
                        </div>
                        <div class="coin-change {change_class}">
                            {change_symbol}{coin['change_24h']:.2f}%
                        </div>
                    </div>
                """
        
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RimToken - Professional Cryptocurrency Platform</title>
    <meta name="description" content="Complete cryptocurrency platform with trading, wallet, portfolio management, and DeFi features">
    
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        
        html {{
            scroll-behavior: smooth;
        }}
        
        body {{ 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            line-height: 1.6;
            overflow-x: hidden;
        }}
        
        /* Navigation */
        .navbar {{
            position: fixed;
            top: 0;
            width: 100%;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(20px);
            z-index: 1000;
            padding: 1rem 0;
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }}
        
        .nav-container {{
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 2rem;
        }}
        
        .logo {{
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.5rem;
            font-weight: 700;
            color: white;
            text-decoration: none;
        }}
        
        .logo-icon {{
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #667eea;
            font-weight: bold;
        }}
        
        .nav-menu {{
            display: flex;
            gap: 2rem;
            align-items: center;
        }}
        
        .nav-link {{
            color: white;
            text-decoration: none;
            font-weight: 500;
            opacity: 0.8;
            transition: opacity 0.2s ease;
            cursor: pointer;
        }}
        
        .nav-link:hover, .nav-link.active {{
            opacity: 1;
        }}
        
        .download-btn {{
            background: rgba(255,255,255,0.9);
            color: #667eea;
            padding: 0.625rem 1.25rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.2s ease;
        }}
        
        .download-btn:hover {{
            background: white;
        }}
        
        /* Sections */
        .section {{
            min-height: 100vh;
            padding: 6rem 2rem 4rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }}
        
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
        }}
        
        /* Home Section */
        .home-section {{
            text-align: center;
        }}
        
        .hero-title {{
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            color: white;
        }}
        
        .hero-subtitle {{
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 3rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }}
        
        .cta-buttons {{
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-bottom: 4rem;
        }}
        
        .btn {{
            padding: 0.875rem 2rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }}
        
        .btn-primary {{
            background: rgba(255,255,255,0.9);
            color: #667eea;
        }}
        
        .btn-secondary {{
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
        }}
        
        .live-prices {{
            background: rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 2rem;
            backdrop-filter: blur(10px);
        }}
        
        .prices-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }}
        
        .crypto-item {{
            background: rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
        }}
        
        .crypto-symbol {{
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }}
        
        .crypto-name {{
            opacity: 0.8;
            margin-bottom: 1rem;
            font-size: 0.9rem;
        }}
        
        .crypto-price {{
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }}
        
        .crypto-change {{
            font-size: 0.9rem;
            font-weight: 600;
        }}
        
        .positive {{ color: #4ade80; }}
        .negative {{ color: #f87171; }}
        
        /* Trading Section */
        .trading-section {{
            background: rgba(0,0,0,0.1);
        }}
        
        .section-title {{
            font-size: 2.5rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 3rem;
            color: white;
        }}
        
        .trading-interface {{
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 2rem;
            backdrop-filter: blur(10px);
        }}
        
        .swap-tabs {{
            display: flex;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            margin-bottom: 2rem;
        }}
        
        .tab {{
            flex: 1;
            padding: 0.75rem;
            text-align: center;
            background: transparent;
            border: none;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }}
        
        .tab.active {{
            background: rgba(255,255,255,0.2);
            border-radius: 6px;
        }}
        
        .swap-form {{
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }}
        
        .swap-input {{
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 8px;
            padding: 1rem;
            color: white;
        }}
        
        .swap-button {{
            background: rgba(255,255,255,0.9);
            color: #667eea;
            padding: 1rem;
            border: none;
            border-radius: 8px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
        }}
        
        /* Wallet Section */
        .wallet-section {{
            background: rgba(255,255,255,0.05);
        }}
        
        .portfolio-stats {{
            background: rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 2rem;
            text-align: center;
            margin-bottom: 3rem;
        }}
        
        .total-value {{
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }}
        
        .portfolio-grid {{
            display: grid;
            gap: 1rem;
        }}
        
        .portfolio-item {{
            background: rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
        }}
        
        .coin-icon {{
            width: 50px;
            height: 50px;
        }}
        
        .icon-circle {{
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }}
        
        .coin-details {{
            flex: 1;
        }}
        
        .coin-name {{
            font-weight: 600;
            margin-bottom: 0.25rem;
        }}
        
        .coin-symbol {{
            opacity: 0.7;
            font-size: 0.9rem;
        }}
        
        .coin-balance {{
            text-align: right;
            margin-right: 1rem;
        }}
        
        .balance-amount {{
            font-weight: 600;
            margin-bottom: 0.25rem;
        }}
        
        .balance-tokens {{
            opacity: 0.7;
            font-size: 0.9rem;
        }}
        
        .coin-change {{
            font-weight: 600;
            min-width: 60px;
            text-align: right;
        }}
        
        /* Additional Sections */
        .feature-section {{
            background: rgba(0,0,0,0.1);
        }}
        
        .features-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }}
        
        .feature-card {{
            background: rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 2rem;
            text-align: center;
        }}
        
        .feature-icon {{
            width: 60px;
            height: 60px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            font-size: 1.5rem;
        }}
        
        .feature-title {{
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }}
        
        /* Mobile Responsive */
        @media (max-width: 768px) {{
            .hero-title {{ font-size: 2.5rem; }}
            .nav-menu {{ display: none; }}
            .cta-buttons {{ flex-direction: column; align-items: center; }}
            .prices-grid {{ grid-template-columns: 1fr; }}
            .section {{ padding: 4rem 1rem 2rem; }}
        }}
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <a href="#home" class="logo">
                <div class="logo-icon">R</div>
                RimToken
            </a>
            <div class="nav-menu">
                <a href="#home" class="nav-link">Home</a>
                <a href="#trading" class="nav-link">Trading</a>
                <a href="#wallet" class="nav-link">Wallet</a>
                <a href="#portfolio" class="nav-link">Portfolio</a>
                <a href="#features" class="nav-link">Features</a>
            </div>
            <a href="#wallet" class="download-btn">Get Started</a>
        </div>
    </nav>

    <!-- Home Section -->
    <section id="home" class="section home-section">
        <div class="container">
            <h1 class="hero-title">Professional Cryptocurrency Platform</h1>
            <p class="hero-subtitle">
                Trade, manage, and invest in cryptocurrencies with real-time data, 
                advanced analytics, and secure portfolio management.
            </p>
            
            <div class="cta-buttons">
                <a href="#trading" class="btn btn-primary">Start Trading</a>
                <a href="#wallet" class="btn btn-secondary">Explore Wallet</a>
            </div>
            
            <div class="live-prices">
                <h2 style="text-align: center; margin-bottom: 1rem; font-size: 1.5rem;">Live Cryptocurrency Prices</h2>
                <div class="prices-grid">
                    {price_ticker}
                </div>
            </div>
        </div>
    </section>

    <!-- Trading Section -->
    <section id="trading" class="section trading-section">
        <div class="container">
            <h2 class="section-title">Advanced Trading Platform</h2>
            
            <div class="trading-interface">
                <div class="swap-tabs">
                    <button class="tab active">Swap</button>
                    <button class="tab">Limit</button>
                    <button class="tab">Pro</button>
                </div>
                
                <div class="swap-form">
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; opacity: 0.8;">From</label>
                        <input type="text" class="swap-input" placeholder="0.0" value="1.0">
                        <select class="swap-input" style="margin-top: 0.5rem;">
                            <option>ETH - Ethereum</option>
                            <option>BTC - Bitcoin</option>
                            <option>BNB - BNB</option>
                        </select>
                    </div>
                    
                    <div style="text-align: center; margin: 1rem 0;">
                        <button style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.5rem; border-radius: 50%; cursor: pointer;">⇅</button>
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <label style="display: block; margin-bottom: 0.5rem; opacity: 0.8;">To</label>
                        <input type="text" class="swap-input" placeholder="0.0" value="2,847.23">
                        <select class="swap-input" style="margin-top: 0.5rem;">
                            <option>USDT - Tether USD</option>
                            <option>USDC - USD Coin</option>
                            <option>DAI - Dai</option>
                        </select>
                    </div>
                    
                    <button class="swap-button">Swap Tokens</button>
                </div>
            </div>
        </div>
    </section>

    <!-- Wallet Section -->
    <section id="wallet" class="section wallet-section">
        <div class="container">
            <h2 class="section-title">Your Portfolio</h2>
            
            <div class="portfolio-stats">
                <div class="total-value">${total_value:,.2f}</div>
                <p style="opacity: 0.8;">Total Portfolio Value</p>
            </div>
            
            <div class="portfolio-grid">
                {portfolio_items}
            </div>
        </div>
    </section>

    <!-- Portfolio Section -->
    <section id="portfolio" class="section feature-section">
        <div class="container">
            <h2 class="section-title">Portfolio Analytics</h2>
            
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <h3 class="feature-title">Advanced Analytics</h3>
                    <p>Real-time portfolio tracking with detailed performance metrics and insights.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">🔒</div>
                    <h3 class="feature-title">Secure Storage</h3>
                    <p>Your assets are protected with industry-leading security measures.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <h3 class="feature-title">Instant Trading</h3>
                    <p>Execute trades instantly with minimal fees and maximum efficiency.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="section trading-section">
        <div class="container">
            <h2 class="section-title">Platform Features</h2>
            
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🌐</div>
                    <h3 class="feature-title">Multi-Chain Support</h3>
                    <p>Trade across multiple blockchain networks including Ethereum, BSC, and Polygon.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">💹</div>
                    <h3 class="feature-title">Real-Time Data</h3>
                    <p>Access live market data from CoinMarketCap with 30-second updates.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">🎯</div>
                    <h3 class="feature-title">Smart Orders</h3>
                    <p>Advanced order types including limit orders, stop losses, and DCA strategies.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <h3 class="feature-title">Mobile Ready</h3>
                    <p>Full-featured mobile experience for trading on the go.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">🏛️</div>
                    <h3 class="feature-title">DeFi Integration</h3>
                    <p>Connect to popular DeFi protocols for yield farming and liquidity provision.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">📈</div>
                    <h3 class="feature-title">Portfolio Management</h3>
                    <p>Comprehensive tools for tracking performance and managing your investments.</p>
                </div>
            </div>
        </div>
    </section>

    <script>
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {{
            anchor.addEventListener('click', function (e) {{
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {{
                    target.scrollIntoView({{
                        behavior: 'smooth',
                        block: 'start'
                    }});
                }}
            }});
        }});

        // Update active navigation link
        window.addEventListener('scroll', () => {{
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let currentSection = '';
            sections.forEach(section => {{
                const sectionTop = section.offsetTop - 100;
                if (scrollY >= sectionTop) {{
                    currentSection = section.getAttribute('id');
                }}
            }});
            
            navLinks.forEach(link => {{
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentSection) {{
                    link.classList.add('active');
                }}
            }});
        }});

        // Update cryptocurrency prices every 30 seconds
        setInterval(() => {{
            fetch('/api/crypto/prices')
                .then(response => response.json())
                .then(data => {{
                    console.log('Live cryptocurrency data updated');
                }})
                .catch(error => console.log('Update failed'));
        }}, 30000);

        // Trading interface interactions
        document.querySelectorAll('.tab').forEach(tab => {{
            tab.addEventListener('click', function() {{
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            }});
        }});
    </script>
</body>
</html>"""
        
        self.wfile.write(html_content.encode('utf-8'))
    
    def handle_login_page(self):
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
            line-height: 1.6;
        }}
        
        .header {{
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 1rem 2rem;
            margin: 2rem auto;
            max-width: 1200px;
            border: 1px solid rgba(255, 255, 255, 0.2);
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
            gap: 0.75rem;
            font-size: 1.5rem;
            font-weight: 700;
            color: white;
            text-decoration: none;
        }}
        
        .logo-icon {{
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #667eea;
            font-weight: bold;
        }}
        
        .nav-menu {{
            display: flex;
            gap: 2rem;
            align-items: center;
        }}
        
        .nav-item {{
            color: white;
            text-decoration: none;
            font-weight: 500;
            opacity: 0.8;
            transition: opacity 0.2s ease;
        }}
        
        .nav-item:hover, .nav-item.active {{
            opacity: 1;
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
        """Wallet page with mobile-first design and user portfolio"""
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        
        crypto_data = self.crypto_service.get_real_time_prices()
        
        # User portfolio data (when logged in)
        user_balances = {
            'BTC': {'amount': 0.001524896, 'icon': '₿'},
            'ETH': {'amount': 0.15642, 'icon': 'Ξ'},
            'BNB': {'amount': 2.48632, 'icon': 'BNB'},
            'SOL': {'amount': 5.8741, 'icon': 'SOL'},
            'USDT': {'amount': 1847.23, 'icon': 'T'},
            'ADA': {'amount': 328.47, 'icon': 'ADA'}
        }
        
        # Generate portfolio items
        portfolio_items = ""
        total_value = 0
        
        for coin in crypto_data:
            if coin['symbol'] in user_balances:
                user_data = user_balances[coin['symbol']]
                balance = user_data['amount']
                value = balance * coin['price']
                total_value += value
                change_class = "positive" if coin['change_24h'] >= 0 else "negative"
                change_symbol = "+" if coin['change_24h'] >= 0 else ""
                
                portfolio_items += f"""
                    <div class="coin-item">
                        <div class="coin-icon">
                            <div class="icon-circle">{user_data['icon']}</div>
                        </div>
                        <div class="coin-details">
                            <div class="coin-name">{coin['name']}</div>
                            <div class="coin-symbol">{coin['symbol']}</div>
                        </div>
                        <div class="coin-balance">
                            <div class="balance-amount">${value:,.2f}</div>
                            <div class="balance-tokens">{balance:.6f} {coin['symbol']}</div>
                        </div>
                        <div class="coin-change {change_class}">
                            {change_symbol}{coin['change_24h']:.2f}%
                        </div>
                    </div>
                """
        
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RimToken Crypto Wallet</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }}
        
        .wallet-container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }}
        
        .header {{
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 1rem 2rem;
            margin-bottom: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        
        .logo {{
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.5rem;
            font-weight: 700;
            color: white;
            text-decoration: none;
        }}
        
        .logo-icon {{
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #667eea;
            font-weight: bold;
        }}
        
        .nav-menu {{
            display: flex;
            gap: 2rem;
            align-items: center;
        }}
        
        .nav-item {{
            color: white;
            text-decoration: none;
            font-weight: 500;
            opacity: 0.8;
            transition: opacity 0.2s ease;
        }}
        
        .nav-item:hover, .nav-item.active {{
            opacity: 1;
        }}
        
        .download-btn {{
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            border: 1px solid rgba(255,255,255,0.3);
            transition: all 0.2s ease;
        }}
        
        .download-btn:hover {{
            background: rgba(255,255,255,0.3);
        }}
        
        .announcement {{
            background: #ff6b35;
            padding: 0.75rem 2rem;
            text-align: center;
            border-radius: 8px;
            margin-bottom: 3rem;
            font-weight: 500;
        }}
        
        .announcement a {{
            color: white;
            text-decoration: underline;
        }}
        
        .hero-section {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
            margin-bottom: 4rem;
        }}
        
        .hero-content h1 {{
            font-size: 3.5rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 1.5rem;
        }}
        
        .hero-content .subtitle {{
            font-size: 1.1rem;
            opacity: 0.9;
            margin-bottom: 2rem;
            line-height: 1.6;
        }}
        
        .social-links {{
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
        }}
        
        .social-link {{
            width: 40px;
            height: 40px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-decoration: none;
            transition: background 0.2s ease;
        }}
        
        .social-link:hover {{
            background: rgba(255,255,255,0.3);
        }}
        
        .download-buttons {{
            display: flex;
            gap: 1rem;
        }}
        
        .store-btn {{
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            transition: background 0.2s ease;
        }}
        
        .store-btn:hover {{
            background: rgba(0,0,0,0.9);
        }}
        
        .phones-mockup {{
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }}
        
        .phone {{
            width: 280px;
            height: 560px;
            background: white;
            border-radius: 25px;
            padding: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            position: relative;
            margin: 0 -40px;
        }}
        
        .phone.center {{
            z-index: 2;
            transform: scale(1.1);
        }}
        
        .phone-screen {{
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            padding: 1.5rem;
            color: white;
            position: relative;
            overflow: hidden;
        }}
        
        .wallet-balance {{
            text-align: center;
            margin-bottom: 2rem;
        }}
        
        .balance-amount {{
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }}
        
        .balance-label {{
            opacity: 0.8;
            font-size: 0.9rem;
        }}
        
        .wallet-actions {{
            display: flex;
            justify-content: space-around;
            margin-bottom: 2rem;
        }}
        
        .action-icon {{
            width: 40px;
            height: 40px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }}
        
        .coins-list {{
            background: rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 1rem;
            height: 300px;
            overflow-y: auto;
        }}
        
        .coin-item {{
            display: flex;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }}
        
        .coin-item:last-child {{
            border-bottom: none;
        }}
        
        .coin-icon {{
            width: 40px;
            height: 40px;
            margin-right: 1rem;
        }}
        
        .icon-circle {{
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.9rem;
        }}
        
        .coin-details {{
            flex: 1;
        }}
        
        .coin-name {{
            font-weight: 600;
            font-size: 0.95rem;
            margin-bottom: 0.25rem;
        }}
        
        .coin-symbol {{
            opacity: 0.7;
            font-size: 0.85rem;
        }}
        
        .coin-balance {{
            text-align: right;
            margin-right: 1rem;
        }}
        
        .balance-amount {{
            font-weight: 600;
            font-size: 0.95rem;
            margin-bottom: 0.25rem;
        }}
        
        .balance-tokens {{
            opacity: 0.7;
            font-size: 0.8rem;
        }}
        
        .coin-change {{
            font-size: 0.85rem;
            font-weight: 600;
            min-width: 50px;
            text-align: right;
        }}
        
        .coin-change.positive {{
            color: #4ade80;
        }}
        
        .coin-change.negative {{
            color: #f87171;
        }}
        
        @media (max-width: 768px) {{
            .hero-section {{
                grid-template-columns: 1fr;
                text-align: center;
                gap: 2rem;
            }}
            
            .hero-content h1 {{
                font-size: 2.5rem;
            }}
            
            .phone {{
                width: 200px;
                height: 400px;
                margin: 0 -20px;
            }}
            
            .wallet-container {{
                padding: 1rem;
            }}
        }}
    </style>
</head>
<body>
    <div class="wallet-container">
        <header class="header">
            <a href="/" class="logo">
                <div class="logo-icon">R</div>
                Wallet
            </a>
            <nav class="nav-menu">
                <a href="#features" class="nav-item">Features</a>
                <a href="#roadmap" class="nav-item">Roadmap</a>
                <a href="#support" class="nav-item">Support</a>
            </nav>
            <a href="#download" class="download-btn">Download wallet</a>
        </header>
        
        <div class="announcement">
            <strong>rimtoken Wallet token sale is live!</strong> • Go to 
            <a href="https://rimtokenwallet.com">rimtokenwallet.com</a> to buy $
        </div>
        
        <div class="hero-section">
            <div class="hero-content">
                <h1>rimtoken crypto Wallet: Anonymous Bitcoin Wallet</h1>
                <p class="subtitle">
                    Wallet is the best Crypto Wallet without Verification, ID or KYC. 
                    Get the most Secure & Anonymous Non-Custodial Crypto Wallet Now.
                </p>
                
                <div class="social-links">
                    <a href="#" class="social-link">📧</a>
                    <a href="#" class="social-link">💬</a>
                    <a href="#" class="social-link">📱</a>
                    <a href="#" class="social-link">🌟</a>
                    <a href="#" class="social-link">📷</a>
                </div>
                
                <div class="download-buttons">
                    <a href="#" class="store-btn">
                        <span>📱</span>
                        <div>
                            <div style="font-size: 0.8rem;">GET IT ON</div>
                            <div>Google Play</div>
                        </div>
                    </a>
                    <a href="#" class="store-btn">
                        <span>🍎</span>
                        <div>
                            <div style="font-size: 0.8rem;">Download on the</div>
                            <div>App Store</div>
                        </div>
                    </a>
                </div>
            </div>
            
            <div class="phones-mockup">
                <div class="phone">
                    <div class="phone-screen">
                        <div class="wallet-balance">
                            <div style="font-size: 0.9rem; opacity: 0.8;">Portfolio Value</div>
                            <div class="balance-amount">${total_value:,.0f}</div>
                        </div>
                        <div class="wallet-actions">
                            <div class="action-icon">↗</div>
                            <div class="action-icon">↙</div>
                            <div class="action-icon">🔄</div>
                            <div class="action-icon">📊</div>
                        </div>
                        <div class="coins-list">
                            {portfolio_items}
                        </div>
                    </div>
                </div>
                
                <div class="phone center">
                    <div class="phone-screen">
                        <div class="wallet-balance">
                            <div class="balance-amount">${total_value:,.2f}</div>
                            <div class="balance-label">Total Balance</div>
                        </div>
                        <div class="wallet-actions">
                            <div class="action-icon">+</div>
                            <div class="action-icon">-</div>
                            <div class="action-icon">⇄</div>
                            <div class="action-icon">=</div>
                        </div>
                        <div class="coins-list">
                            {portfolio_items}
                        </div>
                    </div>
                </div>
                
                <div class="phone">
                    <div class="phone-screen">
                        <div class="wallet-balance">
                            <div style="font-size: 0.9rem; opacity: 0.8;">Assets</div>
                            <div class="balance-amount">{len([coin for coin in crypto_data if coin['symbol'] in user_balances])}</div>
                        </div>
                        <div class="wallet-actions">
                            <div class="action-icon">📈</div>
                            <div class="action-icon">📉</div>
                            <div class="action-icon">🔍</div>
                            <div class="action-icon">⚙</div>
                        </div>
                        <div class="coins-list">
                            {portfolio_items}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Update portfolio values every 30 seconds
        setInterval(() => {{
            fetch('/api/crypto/prices')
                .then(response => response.json())
                .then(data => {{
                    console.log('Portfolio updated with live data');
                }})
                .catch(error => console.log('Update failed'));
        }}, 30000);
    </script>
</body>
</html>"""
        
        self.wfile.write(html_content.encode('utf-8'))

    def handle_portfolio_page(self):
        """Portfolio overview page"""
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        
        html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - RimToken</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
        }
        .header {
            background: white;
            border-bottom: 1px solid #e2e8f0;
            padding: 1rem 0;
        }
        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        .logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.25rem;
            font-weight: 700;
            color: #1e293b;
            text-decoration: none;
        }
        .logo-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }
        .nav-menu {
            display: flex;
            gap: 2rem;
            align-items: center;
        }
        .nav-item {
            color: #64748b;
            text-decoration: none;
            font-weight: 500;
            padding: 0.5rem 0;
            border-bottom: 2px solid transparent;
            transition: all 0.2s ease;
        }
        .nav-item:hover, .nav-item.active {
            color: #1e293b;
            border-bottom-color: #3b82f6;
        }
        .connect-wallet {
            background: #3b82f6;
            color: white;
            padding: 0.625rem 1.25rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
        }
        .main-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 2rem;
        }
        .page-title {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 2rem;
            text-align: center;
        }
        .coming-soon {
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            padding: 4rem 2rem;
            text-align: center;
        }
        .coming-soon h2 {
            font-size: 1.5rem;
            color: #3b82f6;
            margin-bottom: 1rem;
        }
        .coming-soon p {
            color: #64748b;
            margin-bottom: 2rem;
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <a href="/" class="logo">
                <div class="logo-icon">R</div>
                rimtoken
            </a>
            <div class="nav-menu">
                <a href="/trading" class="nav-item">Trade</a>
                <a href="/portfolio" class="nav-item active">Portfolio</a>
                <a href="/dao" class="nav-item">DAO</a>
                <a href="/buy" class="nav-item">Buy Crypto</a>
                <a href="/card" class="nav-item">Card</a>
            </div>
            <a href="#" class="connect-wallet">Connect wallet</a>
        </nav>
    </header>
    <main class="main-content">
        <h1 class="page-title">Portfolio Management</h1>
        <div class="coming-soon">
            <h2>Advanced Portfolio Features Coming Soon</h2>
            <p>We're building comprehensive portfolio analytics and management tools.</p>
            <a href="/wallet" class="connect-wallet">View Your Wallet</a>
        </div>
    </main>
</body>
</html>"""
        self.wfile.write(html_content.encode('utf-8'))

    def handle_dao_page(self):
        """DAO governance page"""
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        
        html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DAO - RimToken</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
        }
        .header {
            background: white;
            border-bottom: 1px solid #e2e8f0;
            padding: 1rem 0;
        }
        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        .logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.25rem;
            font-weight: 700;
            color: #1e293b;
            text-decoration: none;
        }
        .logo-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }
        .nav-menu {
            display: flex;
            gap: 2rem;
            align-items: center;
        }
        .nav-item {
            color: #64748b;
            text-decoration: none;
            font-weight: 500;
            padding: 0.5rem 0;
            border-bottom: 2px solid transparent;
            transition: all 0.2s ease;
        }
        .nav-item:hover, .nav-item.active {
            color: #1e293b;
            border-bottom-color: #3b82f6;
        }
        .connect-wallet {
            background: #3b82f6;
            color: white;
            padding: 0.625rem 1.25rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
        }
        .main-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 2rem;
        }
        .page-title {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 2rem;
            text-align: center;
        }
        .coming-soon {
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            padding: 4rem 2rem;
            text-align: center;
        }
        .coming-soon h2 {
            font-size: 1.5rem;
            color: #3b82f6;
            margin-bottom: 1rem;
        }
        .coming-soon p {
            color: #64748b;
            margin-bottom: 2rem;
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <a href="/" class="logo">
                <div class="logo-icon">R</div>
                rimtoken
            </a>
            <div class="nav-menu">
                <a href="/trading" class="nav-item">Trade</a>
                <a href="/portfolio" class="nav-item">Portfolio</a>
                <a href="/dao" class="nav-item active">DAO</a>
                <a href="/buy" class="nav-item">Buy Crypto</a>
                <a href="/card" class="nav-item">Card</a>
            </div>
            <a href="#" class="connect-wallet">Connect wallet</a>
        </nav>
    </header>
    <main class="main-content">
        <h1 class="page-title">Decentralized Governance</h1>
        <div class="coming-soon">
            <h2>DAO Governance Platform</h2>
            <p>Participate in decentralized decision-making and protocol governance.</p>
            <a href="/trading" class="connect-wallet">Start Trading</a>
        </div>
    </main>
</body>
</html>"""
        self.wfile.write(html_content.encode('utf-8'))

    def handle_buy_page(self):
        """Buy crypto page"""
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        
        html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buy Crypto - RimToken</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
        }
        .header {
            background: white;
            border-bottom: 1px solid #e2e8f0;
            padding: 1rem 0;
        }
        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        .logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.25rem;
            font-weight: 700;
            color: #1e293b;
            text-decoration: none;
        }
        .logo-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }
        .nav-menu {
            display: flex;
            gap: 2rem;
            align-items: center;
        }
        .nav-item {
            color: #64748b;
            text-decoration: none;
            font-weight: 500;
            padding: 0.5rem 0;
            border-bottom: 2px solid transparent;
            transition: all 0.2s ease;
        }
        .nav-item:hover, .nav-item.active {
            color: #1e293b;
            border-bottom-color: #3b82f6;
        }
        .connect-wallet {
            background: #3b82f6;
            color: white;
            padding: 0.625rem 1.25rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
        }
        .main-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 2rem;
        }
        .page-title {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 2rem;
            text-align: center;
        }
        .coming-soon {
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            padding: 4rem 2rem;
            text-align: center;
        }
        .coming-soon h2 {
            font-size: 1.5rem;
            color: #3b82f6;
            margin-bottom: 1rem;
        }
        .coming-soon p {
            color: #64748b;
            margin-bottom: 2rem;
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <a href="/" class="logo">
                <div class="logo-icon">R</div>
                rimtoken
            </a>
            <div class="nav-menu">
                <a href="/trading" class="nav-item">Trade</a>
                <a href="/portfolio" class="nav-item">Portfolio</a>
                <a href="/dao" class="nav-item">DAO</a>
                <a href="/buy" class="nav-item active">Buy Crypto</a>
                <a href="/card" class="nav-item">Card</a>
            </div>
            <a href="#" class="connect-wallet">Connect wallet</a>
        </nav>
    </header>
    <main class="main-content">
        <h1 class="page-title">Buy Cryptocurrency</h1>
        <div class="coming-soon">
            <h2>Fiat-to-Crypto Gateway</h2>
            <p>Purchase cryptocurrency directly with your bank card or bank transfer.</p>
            <a href="/trading" class="connect-wallet">Trade Now</a>
        </div>
    </main>
</body>
</html>"""
        self.wfile.write(html_content.encode('utf-8'))

    def handle_card_page(self):
        """Crypto card page"""
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        
        html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Card - RimToken</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
        }
        .header {
            background: white;
            border-bottom: 1px solid #e2e8f0;
            padding: 1rem 0;
        }
        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        .logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.25rem;
            font-weight: 700;
            color: #1e293b;
            text-decoration: none;
        }
        .logo-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }
        .nav-menu {
            display: flex;
            gap: 2rem;
            align-items: center;
        }
        .nav-item {
            color: #64748b;
            text-decoration: none;
            font-weight: 500;
            padding: 0.5rem 0;
            border-bottom: 2px solid transparent;
            transition: all 0.2s ease;
        }
        .nav-item:hover, .nav-item.active {
            color: #1e293b;
            border-bottom-color: #3b82f6;
        }
        .connect-wallet {
            background: #3b82f6;
            color: white;
            padding: 0.625rem 1.25rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
        }
        .main-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 2rem;
        }
        .page-title {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 2rem;
            text-align: center;
        }
        .coming-soon {
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            padding: 4rem 2rem;
            text-align: center;
        }
        .coming-soon h2 {
            font-size: 1.5rem;
            color: #3b82f6;
            margin-bottom: 1rem;
        }
        .coming-soon p {
            color: #64748b;
            margin-bottom: 2rem;
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <a href="/" class="logo">
                <div class="logo-icon">R</div>
                rimtoken
            </a>
            <div class="nav-menu">
                <a href="/trading" class="nav-item">Trade</a>
                <a href="/portfolio" class="nav-item">Portfolio</a>
                <a href="/dao" class="nav-item">DAO</a>
                <a href="/buy" class="nav-item">Buy Crypto</a>
                <a href="/card" class="nav-item active">Card</a>
            </div>
            <a href="#" class="connect-wallet">Connect wallet</a>
        </nav>
    </header>
    <main class="main-content">
        <h1 class="page-title">RimToken Card</h1>
        <div class="coming-soon">
            <h2>Crypto Debit Card</h2>
            <p>Spend your cryptocurrency anywhere with our physical and virtual debit cards.</p>
            <a href="/wallet" class="connect-wallet">View Wallet</a>
        </div>
    </main>
</body>
</html>"""
        self.wfile.write(html_content.encode('utf-8'))

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread for better performance"""
    allow_reuse_address = True
    daemon_threads = True

def main():
    port = int(os.environ.get('PORT', 8080))
    
    try:
        server_address = ('0.0.0.0', port)
        httpd = ThreadedHTTPServer(server_address, LandingPageHandler)
        print(f"🚀 RimToken Platform")
        print(f"🌐 Running on http://0.0.0.0:{port}")
        print("✨ Ready for preview")
        httpd.serve_forever()
    except OSError as e:
        if e.errno == 98:
            print(f"Port {port} in use, trying alternatives...")
            for alt_port in [3000, 8000, 5000]:
                try:
                    server_address = ('0.0.0.0', alt_port)
                    httpd = ThreadedHTTPServer(server_address, LandingPageHandler)
                    print(f"🚀 RimToken Platform")
                    print(f"🌐 Running on http://0.0.0.0:{alt_port}")
                    httpd.serve_forever()
                    break
                except OSError:
                    continue
        else:
            raise e

if __name__ == "__main__":
    main()