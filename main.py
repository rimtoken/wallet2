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
        elif self.path == '/logo.gif':
            self.handle_logo_image()
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
    
    def handle_logo_image(self):
        """Serve the logo image"""
        try:
            with open('attached_assets/unnamed.gif', 'rb') as f:
                image_data = f.read()
            
            self.send_response(200)
            self.send_header('Content-Type', 'image/gif')
            self.send_header('Content-Length', str(len(image_data)))
            self.end_headers()
            self.wfile.write(image_data)
        except FileNotFoundError:
            self.send_error(404)
    
    def handle_landing_page(self):
        """Single-page website with all sections accessible by scrolling"""
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        
        crypto_data = self.crypto_service.get_real_time_prices()
        
        # Generate live price ticker for moving ticker
        ticker_items = ""
        for coin in crypto_data:
            change_class = "positive" if coin['change_24h'] >= 0 else "negative"
            change_symbol = "+" if coin['change_24h'] >= 0 else ""
            ticker_items += f"""
                <div class="ticker-item">
                    <span class="ticker-symbol">{coin['symbol']}</span>
                    <span class="ticker-price">${coin['price']:,.2f}</span>
                    <span class="ticker-change {change_class}">{change_symbol}{coin['change_24h']:.2f}%</span>
                </div>
            """
        
        # Generate live price grid for home section
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
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
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
            background-image: url('/logo.gif');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }}
        
        .nav-menu {{
            display: flex;
            gap: 2rem;
            align-items: center;
        }}
        
        .language-selector {{
            position: relative;
            margin-left: 1rem;
        }}
        
        .language-btn {{
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            transition: all 0.2s ease;
        }}
        
        .language-btn:hover {{
            background: rgba(255,255,255,0.2);
        }}
        
        .language-icon {{
            width: 18px;
            height: 18px;
        }}
        
        .language-dropdown {{
            position: absolute;
            top: 100%;
            right: 0;
            background: rgba(20, 25, 40, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 8px;
            min-width: 150px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            z-index: 1000;
            margin-top: 0.5rem;
        }}
        
        .language-dropdown.show {{
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }}
        
        .language-option {{
            padding: 0.75rem 1rem;
            cursor: pointer;
            transition: background 0.2s ease;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: white;
        }}
        
        .language-option:last-child {{
            border-bottom: none;
        }}
        
        .language-option:hover {{
            background: rgba(255,255,255,0.1);
        }}
        
        .language-option.active {{
            background: rgba(255,255,255,0.15);
        }}
        
        .language-flag {{
            width: 20px;
            height: 15px;
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
        }}
        
        .auth-icons {{
            display: flex;
            gap: 1rem;
            align-items: center;
            margin-left: 1rem;
        }}
        
        .auth-btn {{
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            color: white;
            padding: 0.5rem;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            text-decoration: none;
        }}
        
        .auth-btn:hover {{
            background: rgba(255,255,255,0.2);
            color: white;
        }}
        
        .auth-icon {{
            width: 18px;
            height: 18px;
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
            color: #2d3748;
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
            padding: 8rem 2rem 4rem;
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
            color: #2d3748;
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
            color: #2d3748;
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
        
        /* Price Ticker */
        .price-ticker {{
            background: rgba(0,0,0,0.3);
            padding: 0.75rem 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            overflow: hidden;
            position: fixed;
            top: 80px;
            width: 100%;
            z-index: 999;
        }}
        
        .ticker-track {{
            display: flex;
            animation: scroll-ticker 60s linear infinite;
            gap: 3rem;
            white-space: nowrap;
        }}
        
        @keyframes scroll-ticker {{
            0% {{ transform: translateX(100%); }}
            100% {{ transform: translateX(-100%); }}
        }}
        
        .ticker-item {{
            display: flex;
            align-items: center;
            gap: 1rem;
            font-size: 0.9rem;
            color: white;
            min-width: 200px;
        }}
        
        .ticker-symbol {{
            font-weight: 700;
            color: white;
        }}
        
        .ticker-price {{
            font-weight: 600;
        }}
        
        .ticker-change {{
            font-weight: 600;
            font-size: 0.85rem;
        }}
        
        .ticker-change.positive {{
            color: #4ade80;
        }}
        
        .ticker-change.negative {{
            color: #f87171;
        }}
        
        /* Animated Logo */
        .floating-logo {{
            position: fixed;
            width: 60px;
            height: 60px;
            background-image: url('/logo.gif');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            border-radius: 15%;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            z-index: 998;
            animation: float-around 60s ease-in-out infinite;
            backdrop-filter: blur(10px);
        }}
        
        @keyframes float-around {{
            0% {{
                top: 200px;
                left: 50px;
                transform: rotate(0deg);
            }}
            25% {{
                top: 300px;
                left: calc(100% - 110px);
                transform: rotate(90deg);
            }}
            50% {{
                top: 500px;
                left: 50px;
                transform: rotate(180deg);
            }}
            75% {{
                top: 600px;
                left: calc(100% - 110px);
                transform: rotate(270deg);
            }}
            100% {{
                top: 200px;
                left: 50px;
                transform: rotate(360deg);
            }}
        }}
        
        /* Mobile Responsive */
        @media (max-width: 768px) {{
            .hero-title {{ font-size: 2.5rem; }}
            .nav-menu {{ display: none; }}
            .cta-buttons {{ flex-direction: column; align-items: center; }}
            .prices-grid {{ grid-template-columns: 1fr; }}
            .section {{ padding: 6rem 1rem 2rem; }}
            .price-ticker {{ top: 70px; }}
            .floating-logo {{ display: none; }}
        }}
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <a href="#home" class="logo">
                <div class="logo-icon"></div>
                RimToken
            </a>
            <div class="nav-menu">
                <a href="#home" class="nav-link">Home</a>
                <a href="#trading" class="nav-link">Trading</a>
                <a href="#wallet" class="nav-link">Wallet</a>
                <a href="#team" class="nav-link">Team</a>
                <a href="#features" class="nav-link">Features</a>
                
                <div class="language-selector">
                    <button class="language-btn" id="languageBtn">
                        <svg class="language-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
                        </svg>
                        <span id="currentLang">EN</span>
                        <svg style="width: 12px; height: 12px; margin-left: 0.25rem;" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7 10l5 5 5-5z"/>
                        </svg>
                    </button>
                    <div class="language-dropdown" id="languageDropdown">
                        <div class="language-option active" data-lang="en" data-name="English">
                            <div class="language-flag" style="background: linear-gradient(to bottom, #012169 33%, white 33%, white 66%, #C8102E 66%);">🇺🇸</div>
                            <span>English</span>
                        </div>
                        <div class="language-option" data-lang="ar" data-name="العربية">
                            <div class="language-flag" style="background: linear-gradient(to bottom, #000 33%, white 33%, white 66%, #007A3D 66%);">🇸🇦</div>
                            <span>العربية</span>
                        </div>
                        <div class="language-option" data-lang="fr" data-name="Français">
                            <div class="language-flag" style="background: linear-gradient(to right, #002654 33%, white 33%, white 66%, #ED2939 66%);">🇫🇷</div>
                            <span>Français</span>
                        </div>
                        <div class="language-option" data-lang="zh" data-name="中文">
                            <div class="language-flag" style="background: #DE2910;">🇨🇳</div>
                            <span>中文</span>
                        </div>
                    </div>
                </div>
                
                <div class="auth-icons">
                    <a href="#login" class="auth-btn" title="Login">
                        <svg class="auth-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    </a>
                    <a href="#register" class="auth-btn" title="Register">
                        <svg class="auth-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    </a>
                </div>
            </div>
            <a href="#wallet" class="download-btn">Downloads</a>
        </div>
    </nav>

    <!-- Price Ticker -->
    <div class="price-ticker">
        <div class="ticker-track">
            {ticker_items}
            {ticker_items}
        </div>
    </div>

    <!-- Animated Logo -->
    <div class="floating-logo"></div>

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
                <a href="#wallet" class="btn btn-secondary">Downloads</a>
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

    <!-- Team Section -->
    <section id="team" class="section feature-section">
        <div class="container">
            <h2 class="section-title">Our Team</h2>
            
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">👨‍💼</div>
                    <h3 class="feature-title">Leadership Team</h3>
                    <p>Experienced executives leading the future of cryptocurrency innovation.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">👩‍💻</div>
                    <h3 class="feature-title">Development Team</h3>
                    <p>Expert developers building secure and scalable blockchain solutions.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">👨‍🔬</div>
                    <h3 class="feature-title">Research Team</h3>
                    <p>Dedicated researchers advancing cryptocurrency technology and market analysis.</p>
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

        // Language selector functionality
        const languageBtn = document.getElementById('languageBtn');
        const languageDropdown = document.getElementById('languageDropdown');
        const currentLang = document.getElementById('currentLang');

        languageBtn.addEventListener('click', function(e) {{
            e.preventDefault();
            languageDropdown.classList.toggle('show');
        }});

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {{
            if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {{
                languageDropdown.classList.remove('show');
            }}
        }});

        // Handle language selection
        document.querySelectorAll('.language-option').forEach(option => {{
            option.addEventListener('click', function() {{
                // Remove active class from all options
                document.querySelectorAll('.language-option').forEach(opt => opt.classList.remove('active'));
                
                // Add active class to selected option
                this.classList.add('active');
                
                // Update button text
                const langCode = this.getAttribute('data-lang');
                const langName = this.getAttribute('data-name');
                
                switch(langCode) {{
                    case 'en':
                        currentLang.textContent = 'EN';
                        break;
                    case 'ar':
                        currentLang.textContent = 'AR';
                        break;
                    case 'fr':
                        currentLang.textContent = 'FR';
                        break;
                    case 'zh':
                        currentLang.textContent = 'ZH';
                        break;
                }}
                
                // Close dropdown
                languageDropdown.classList.remove('show');
                
                // Here you can add language switching logic
                console.log('Language changed to:', langName, '(' + langCode + ')');
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