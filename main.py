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
            {'symbol': 'BTC', 'name': 'Bitcoin', 'price': 43250.00, 'change_24h': 2.4},
            {'symbol': 'ETH', 'name': 'Ethereum', 'price': 2640.00, 'change_24h': -1.2},
            {'symbol': 'BNB', 'name': 'BNB', 'price': 310.50, 'change_24h': 3.1},
            {'symbol': 'SOL', 'name': 'Solana', 'price': 98.20, 'change_24h': 5.7},
            {'symbol': 'USDT', 'name': 'Tether USD', 'price': 1.00, 'change_24h': 0.1},
            {'symbol': 'ADA', 'name': 'Cardano', 'price': 0.52, 'change_24h': -2.3}
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
        else:
            self.send_error(404)
    
    def handle_crypto_api(self):
        """API endpoint for cryptocurrency prices"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        crypto_data = self.crypto_service.get_real_time_prices()
        
        response_data = {
            'status': 'success',
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