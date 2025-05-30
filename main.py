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

# Global user storage (in production, this would be a database)
USERS_DATABASE = []

class LandingPageHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.crypto_service = CryptoAPIService()
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        if self.path == '/':
            self.handle_landing_page()
        elif self.path == '/register':
            self.handle_register_page()
        elif self.path == '/login':
            self.handle_login_page()
        elif self.path == '/api/crypto/prices':
            self.handle_crypto_api()
        elif self.path == '/logo.gif':
            self.handle_logo_image()
        elif self.path.startswith('/team-photos/'):
            self.handle_team_photo()
        elif self.path == '/admin/users':
            self.handle_admin_users()
        else:
            self.send_error(404)
    
    def do_POST(self):
        if self.path == '/api/register':
            self.handle_register_api()
        elif self.path == '/api/login':
            self.handle_login_api()
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
    
    def handle_team_photo(self):
        """Serve team member photos"""
        try:
            # Extract filename from URL path
            filename = self.path.split('/')[-1]
            file_path = f'attached_assets/{filename}'
            
            with open(file_path, 'rb') as f:
                image_data = f.read()
            
            # Determine content type based on file extension
            if filename.lower().endswith('.jpg') or filename.lower().endswith('.jpeg'):
                content_type = 'image/jpeg'
            elif filename.lower().endswith('.png'):
                content_type = 'image/png'
            elif filename.lower().endswith('.gif'):
                content_type = 'image/gif'
            else:
                content_type = 'image/jpeg'  # Default
            
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(image_data)))
            self.end_headers()
            self.wfile.write(image_data)
        except FileNotFoundError:
            self.send_error(404)
    
    def handle_register_api(self):
        """Handle user registration POST requests"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            username = data.get('username', '').strip()
            email = data.get('email', '').strip()
            password = data.get('password', '')
            
            # Basic validation
            if not username or not email or not password:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = {'success': False, 'message': 'All fields are required'}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                return
            
            if len(password) < 6:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = {'success': False, 'message': 'Password must be at least 6 characters'}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                return
            
            # Check if username already exists
            for user in USERS_DATABASE:
                if user['username'] == username:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    response = {'success': False, 'message': 'Username already exists'}
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                    return
            
            # Store user data
            user_data = {
                'id': len(USERS_DATABASE) + 1,
                'username': username,
                'email': email,
                'password': password,  # In production, this would be hashed
                'created_at': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            USERS_DATABASE.append(user_data)
            
            self.send_response(201)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response = {
                'success': True, 
                'message': 'Account created successfully',
                'user': {'username': username, 'email': email}
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response = {'success': False, 'message': 'Registration failed'}
            self.wfile.write(json.dumps(response).encode('utf-8'))
    
    def handle_login_api(self):
        """Handle user login POST requests"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            username = data.get('username', '').strip()
            password = data.get('password', '')
            
            # Basic validation
            if not username or not password:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = {'success': False, 'message': 'Username and password are required'}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                return
            
            # For now, simulate successful login
            # In a real implementation, this would verify against the database
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response = {
                'success': True, 
                'message': 'Login successful',
                'user': {'username': username}
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response = {'success': False, 'message': 'Login failed'}
            self.wfile.write(json.dumps(response).encode('utf-8'))
    
    def handle_register_page(self):
        """Registration page for new users"""
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        
        html_content = f"""<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - RimToken</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }}
        
        .auth-container {{
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 3rem;
            width: 100%;
            max-width: 450px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }}
        
        .logo-section {{
            text-align: center;
            margin-bottom: 2rem;
        }}
        
        .logo-icon {{
            width: 60px;
            height: 60px;
            background-image: url('/logo.gif');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            margin: 0 auto 1rem;
        }}
        
        .logo-text {{
            font-size: 2rem;
            font-weight: 700;
            color: white;
            margin-bottom: 0.5rem;
        }}
        
        .logo-subtitle {{
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
        }}
        
        .form-group {{
            margin-bottom: 1.5rem;
        }}
        
        .form-label {{
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
        }}
        
        .form-input {{
            width: 100%;
            padding: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 1rem;
            transition: all 0.3s ease;
        }}
        
        .form-input:focus {{
            outline: none;
            border-color: #4fd1c7;
            box-shadow: 0 0 0 3px rgba(79, 209, 199, 0.1);
        }}
        
        .form-input::placeholder {{
            color: rgba(255, 255, 255, 0.5);
        }}
        
        .submit-btn {{
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #4fd1c7 0%, #06b6d4 100%);
            border: none;
            border-radius: 12px;
            color: white;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 1rem;
        }}
        
        .submit-btn:hover {{
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(79, 209, 199, 0.3);
        }}
        
        .auth-link {{
            text-align: center;
            margin-top: 1.5rem;
        }}
        
        .auth-link a {{
            color: #4fd1c7;
            text-decoration: none;
            font-weight: 500;
        }}
        
        .auth-link a:hover {{
            text-decoration: underline;
        }}
        
        .error-message {{
            background: rgba(248, 113, 113, 0.2);
            border: 1px solid rgba(248, 113, 113, 0.3);
            color: #f87171;
            padding: 1rem;
            border-radius: 12px;
            margin-bottom: 1rem;
            display: none;
        }}
        
        .success-message {{
            background: rgba(34, 197, 94, 0.2);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #22c55e;
            padding: 1rem;
            border-radius: 12px;
            margin-bottom: 1rem;
            display: none;
        }}
        
        .home-link {{
            position: absolute;
            top: 2rem;
            left: 2rem;
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }}
        
        .home-link:hover {{
            color: white;
        }}
    </style>
</head>
<body>
    <a href="/" class="home-link">← Back to Home</a>
    
    <div class="auth-container">
        <div class="logo-section">
            <div class="logo-icon"></div>
            <h1 class="logo-text" data-translate="register_title">Create Account</h1>
            <p class="logo-subtitle" data-translate="register_subtitle">Join RimToken Platform</p>
        </div>
        
        <div class="error-message" id="errorMessage"></div>
        <div class="success-message" id="successMessage"></div>
        
        <form id="registerForm">
            <div class="form-group">
                <label class="form-label" data-translate="username_label">Username</label>
                <input type="text" class="form-input" id="username" name="username" 
                       placeholder="Enter your username" required>
            </div>
            
            <div class="form-group">
                <label class="form-label" data-translate="email_label">Email Address</label>
                <input type="email" class="form-input" id="email" name="email" 
                       placeholder="Enter your email" required>
            </div>
            
            <div class="form-group">
                <label class="form-label" data-translate="password_label">Password</label>
                <input type="password" class="form-input" id="password" name="password" 
                       placeholder="Create a strong password" required>
            </div>
            
            <div class="form-group">
                <label class="form-label" data-translate="confirm_password_label">Confirm Password</label>
                <input type="password" class="form-input" id="confirmPassword" name="confirmPassword" 
                       placeholder="Confirm your password" required>
            </div>
            
            <button type="submit" class="submit-btn" data-translate="register_btn">Create Account</button>
        </form>
        
        <div class="auth-link">
            <span data-translate="have_account">Already have an account?</span>
            <a href="/login" data-translate="login_link">Sign In</a>
        </div>
    </div>
    
    <script>
        // Form submission handling
        document.getElementById('registerForm').addEventListener('submit', async function(e) {{
            e.preventDefault();
            
            const formData = new FormData(this);
            const password = formData.get('password');
            const confirmPassword = formData.get('confirmPassword');
            
            // Clear previous messages
            document.getElementById('errorMessage').style.display = 'none';
            document.getElementById('successMessage').style.display = 'none';
            
            // Validate passwords match
            if (password !== confirmPassword) {{
                showError('Passwords do not match');
                return;
            }}
            
            // Validate password strength
            if (password.length < 6) {{
                showError('Password must be at least 6 characters long');
                return;
            }}
            
            try {{
                const response = await fetch('/api/register', {{
                    method: 'POST',
                    headers: {{
                        'Content-Type': 'application/json',
                    }},
                    body: JSON.stringify({{
                        username: formData.get('username'),
                        email: formData.get('email'),
                        password: formData.get('password')
                    }})
                }});
                
                const result = await response.json();
                
                if (result.success) {{
                    showSuccess('Account created successfully! Redirecting...');
                    setTimeout(() => {{
                        window.location.href = '/';
                    }}, 2000);
                }} else {{
                    showError(result.message || 'Registration failed');
                }}
            }} catch (error) {{
                showError('Network error. Please try again.');
            }}
        }});
        
        function showError(message) {{
            const errorDiv = document.getElementById('errorMessage');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }}
        
        function showSuccess(message) {{
            const successDiv = document.getElementById('successMessage');
            successDiv.textContent = message;
            successDiv.style.display = 'block';
        }}
    </script>
</body>
</html>"""
        
        self.wfile.write(html_content.encode('utf-8'))
    
    def handle_login_page(self):
        """Login page for existing users"""
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        
        html_content = f"""<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - RimToken</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }}
        
        .auth-container {{
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 3rem;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }}
        
        .logo-section {{
            text-align: center;
            margin-bottom: 2rem;
        }}
        
        .logo-icon {{
            width: 60px;
            height: 60px;
            background-image: url('/logo.gif');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            margin: 0 auto 1rem;
        }}
        
        .logo-text {{
            font-size: 2rem;
            font-weight: 700;
            color: white;
            margin-bottom: 0.5rem;
        }}
        
        .logo-subtitle {{
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
        }}
        
        .form-group {{
            margin-bottom: 1.5rem;
        }}
        
        .form-label {{
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
        }}
        
        .form-input {{
            width: 100%;
            padding: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 1rem;
            transition: all 0.3s ease;
        }}
        
        .form-input:focus {{
            outline: none;
            border-color: #4fd1c7;
            box-shadow: 0 0 0 3px rgba(79, 209, 199, 0.1);
        }}
        
        .form-input::placeholder {{
            color: rgba(255, 255, 255, 0.5);
        }}
        
        .submit-btn {{
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #4fd1c7 0%, #06b6d4 100%);
            border: none;
            border-radius: 12px;
            color: white;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 1rem;
        }}
        
        .submit-btn:hover {{
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(79, 209, 199, 0.3);
        }}
        
        .auth-link {{
            text-align: center;
            margin-top: 1.5rem;
        }}
        
        .auth-link a {{
            color: #4fd1c7;
            text-decoration: none;
            font-weight: 500;
        }}
        
        .auth-link a:hover {{
            text-decoration: underline;
        }}
        
        .error-message {{
            background: rgba(248, 113, 113, 0.2);
            border: 1px solid rgba(248, 113, 113, 0.3);
            color: #f87171;
            padding: 1rem;
            border-radius: 12px;
            margin-bottom: 1rem;
            display: none;
        }}
        
        .success-message {{
            background: rgba(34, 197, 94, 0.2);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #22c55e;
            padding: 1rem;
            border-radius: 12px;
            margin-bottom: 1rem;
            display: none;
        }}
        
        .home-link {{
            position: absolute;
            top: 2rem;
            left: 2rem;
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }}
        
        .home-link:hover {{
            color: white;
        }}
    </style>
</head>
<body>
    <a href="/" class="home-link">← Back to Home</a>
    
    <div class="auth-container">
        <div class="logo-section">
            <div class="logo-icon"></div>
            <h1 class="logo-text" data-translate="login_title">Welcome Back</h1>
            <p class="logo-subtitle" data-translate="login_subtitle">Sign in to your account</p>
        </div>
        
        <div class="error-message" id="errorMessage"></div>
        <div class="success-message" id="successMessage"></div>
        
        <form id="loginForm">
            <div class="form-group">
                <label class="form-label" data-translate="username_label">Username</label>
                <input type="text" class="form-input" id="username" name="username" 
                       placeholder="Enter your username" required>
            </div>
            
            <div class="form-group">
                <label class="form-label" data-translate="password_label">Password</label>
                <input type="password" class="form-input" id="password" name="password" 
                       placeholder="Enter your password" required>
            </div>
            
            <button type="submit" class="submit-btn" data-translate="login_btn">Sign In</button>
        </form>
        
        <div class="auth-link">
            <span data-translate="no_account">Don't have an account?</span>
            <a href="/register" data-translate="register_link">Create Account</a>
        </div>
    </div>
    
    <script>
        // Form submission handling
        document.getElementById('loginForm').addEventListener('submit', async function(e) {{
            e.preventDefault();
            
            const formData = new FormData(this);
            
            // Clear previous messages
            document.getElementById('errorMessage').style.display = 'none';
            document.getElementById('successMessage').style.display = 'none';
            
            try {{
                const response = await fetch('/api/login', {{
                    method: 'POST',
                    headers: {{
                        'Content-Type': 'application/json',
                    }},
                    body: JSON.stringify({{
                        username: formData.get('username'),
                        password: formData.get('password')
                    }})
                }});
                
                const result = await response.json();
                
                if (result.success) {{
                    showSuccess('Login successful! Redirecting...');
                    setTimeout(() => {{
                        window.location.href = '/';
                    }}, 1500);
                }} else {{
                    showError(result.message || 'Login failed');
                }}
            }} catch (error) {{
                showError('Network error. Please try again.');
            }}
        }});
        
        function showError(message) {{
            const errorDiv = document.getElementById('errorMessage');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }}
        
        function showSuccess(message) {{
            const successDiv = document.getElementById('successMessage');
            successDiv.textContent = message;
            successDiv.style.display = 'block';
        }}
    </script>
</body>
</html>"""
        
        self.wfile.write(html_content.encode('utf-8'))
    
    def handle_admin_users(self):
        """Admin panel to view all registered users"""
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        
        # Generate user rows for the table
        user_rows = ""
        for user in USERS_DATABASE:
            user_rows += f"""
                <tr>
                    <td>{user['id']}</td>
                    <td>{user['username']}</td>
                    <td>{user['email']}</td>
                    <td>{user['created_at']}</td>
                </tr>
            """
        
        if not user_rows:
            user_rows = """
                <tr>
                    <td colspan="4" style="text-align: center; color: #666;">No users registered yet</td>
                </tr>
            """
        
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RimToken - User Administration</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
            min-height: 100vh;
            color: white;
            padding: 2rem;
        }}
        
        .admin-container {{
            max-width: 1200px;
            margin: 0 auto;
        }}
        
        .header {{
            text-align: center;
            margin-bottom: 3rem;
        }}
        
        .logo-icon {{
            width: 60px;
            height: 60px;
            background-image: url('/logo.gif');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            margin: 0 auto 1rem;
        }}
        
        h1 {{
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            color: white;
        }}
        
        .subtitle {{
            color: rgba(255, 255, 255, 0.7);
            font-size: 1.1rem;
        }}
        
        .stats-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }}
        
        .stat-card {{
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 15px;
            padding: 1.5rem;
            text-align: center;
        }}
        
        .stat-number {{
            font-size: 2rem;
            font-weight: 700;
            color: #4fd1c7;
            margin-bottom: 0.5rem;
        }}
        
        .stat-label {{
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9rem;
        }}
        
        .users-table {{
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 15px;
            overflow: hidden;
            margin-bottom: 2rem;
        }}
        
        .table-header {{
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            font-weight: 600;
            font-size: 1.2rem;
        }}
        
        table {{
            width: 100%;
            border-collapse: collapse;
        }}
        
        th, td {{
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }}
        
        th {{
            background: rgba(255, 255, 255, 0.05);
            font-weight: 600;
            color: #4fd1c7;
        }}
        
        tr:hover {{
            background: rgba(255, 255, 255, 0.05);
        }}
        
        .back-btn {{
            background: linear-gradient(135deg, #4fd1c7 0%, #06b6d4 100%);
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
            margin-bottom: 2rem;
        }}
        
        .back-btn:hover {{
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(79, 209, 199, 0.3);
        }}
        
        .refresh-btn {{
            background: rgba(255, 255, 255, 0.1);
            color: white;
            padding: 0.75rem 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
            float: right;
        }}
        
        .refresh-btn:hover {{
            background: rgba(255, 255, 255, 0.2);
        }}
    </style>
</head>
<body>
    <div class="admin-container">
        <div class="header">
            <div class="logo-icon"></div>
            <h1>RimToken Administration</h1>
            <p class="subtitle">User Registration Management</p>
        </div>
        
        <a href="/" class="back-btn">← Back to Main Site</a>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">{len(USERS_DATABASE)}</div>
                <div class="stat-label">Total Registered Users</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{len([u for u in USERS_DATABASE if datetime.datetime.now().strftime('%Y-%m-%d') in u.get('created_at', '')])}</div>
                <div class="stat-label">Registered Today</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{len(set(u['email'].split('@')[1] for u in USERS_DATABASE if '@' in u['email']))}</div>
                <div class="stat-label">Email Domains</div>
            </div>
        </div>
        
        <div class="users-table">
            <div class="table-header">
                Registered Users
                <button class="refresh-btn" onclick="location.reload()">Refresh</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Registration Date</th>
                    </tr>
                </thead>
                <tbody>
                    {user_rows}
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>"""
        
        self.wfile.write(html_content.encode('utf-8'))
    
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
        
        .contact-section {{
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
        }}
        
        .contact-content {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            margin-top: 3rem;
        }}
        
        .contact-info {{
            display: grid;
            gap: 1.5rem;
        }}
        
        .contact-card {{
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 15px;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            transition: all 0.3s ease;
        }}
        
        .contact-card:hover {{
            transform: translateY(-3px);
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }}
        
        .contact-icon {{
            font-size: 2rem;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #4fd1c7 0%, #06b6d4 100%);
            border-radius: 12px;
            flex-shrink: 0;
        }}
        
        .contact-title {{
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
            color: white;
        }}
        
        .contact-detail {{
            color: rgba(255, 255, 255, 0.8);
            font-size: 1rem;
            font-weight: 500;
        }}
        
        .social-links-section {{
            text-align: center;
        }}
        
        .social-title {{
            font-size: 1.5rem;
            margin-bottom: 2rem;
            color: white;
        }}
        
        .social-links {{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
        }}
        
        .social-link {{
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            color: white;
            text-decoration: none;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            font-weight: 500;
        }}
        
        .social-link:hover {{
            background: linear-gradient(135deg, #4fd1c7 0%, #06b6d4 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(79, 209, 199, 0.3);
        }}
        
        .social-link svg {{
            flex-shrink: 0;
        }}
        
        @media (max-width: 768px) {{
            .contact-content {{
                grid-template-columns: 1fr;
                gap: 2rem;
            }}
            
            .social-links {{
                grid-template-columns: 1fr;
            }}
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
        
        /* Team Section Styles */
        .team-section {{
            background: rgba(255, 255, 255, 0.05);
            padding: 6rem 0;
        }}
        
        .team-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2.5rem;
            margin-top: 3rem;
        }}
        
        .team-member {{
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }}
        
        .team-member::before {{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #4fd1c7 0%, #06b6d4 100%);
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }}
        
        .team-member:hover {{
            transform: translateY(-10px);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }}
        
        .team-member:hover::before {{
            transform: scaleX(1);
        }}
        
        .member-photo {{
            width: 120px;
            height: 120px;
            margin: 0 auto 1.5rem;
            border-radius: 50%;
            overflow: hidden;
            border: 4px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }}
        
        .team-member:hover .member-photo {{
            border-color: #4fd1c7;
            transform: scale(1.05);
        }}
        
        .member-photo img {{
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: all 0.3s ease;
        }}
        
        .team-member:hover .member-photo img {{
            transform: scale(1.1);
        }}
        
        .member-info {{
            color: white;
        }}
        
        .member-name {{
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: white;
        }}
        
        .member-title {{
            font-size: 1rem;
            font-weight: 500;
            color: #4fd1c7;
            margin-bottom: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        
        .member-description {{
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
            font-size: 0.95rem;
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
            .team-grid {{ grid-template-columns: 1fr; gap: 2rem; }}
            .team-member {{ padding: 1.5rem; }}
            .member-photo {{ width: 100px; height: 100px; }}
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
                <a href="#home" class="nav-link" data-translate="home">Home</a>
                <a href="#trading" class="nav-link" data-translate="trading">Trading</a>
                <a href="#wallet" class="nav-link" data-translate="wallet">Wallet</a>
                <a href="#team" class="nav-link" data-translate="team">Team</a>
                <a href="#contact" class="nav-link" data-translate="contact">Contact</a>
                
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
                    <a href="/login" class="auth-btn" title="Login">
                        <svg class="auth-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    </a>
                    <a href="/register" class="auth-btn" title="Register">
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
            <h1 class="hero-title" data-translate="welcome_title">Welcome to RimToken</h1>
            <p class="hero-subtitle" data-translate="welcome_description">
                Experience seamless cryptocurrency trading with real-time market data, 
                advanced portfolio management, and secure wallet integration.
            </p>
            
            <div class="cta-buttons">
                <a href="#trading" class="btn btn-primary" data-translate="get_started_btn">Get Started</a>
                <a href="#wallet" class="btn btn-secondary" data-translate="learn_more_btn">Learn More</a>
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
            <h2 class="section-title" data-translate="trading_title">Live Trading Dashboard</h2>
            
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
            <h2 class="section-title" data-translate="wallet_title">Secure Digital Wallet</h2>
            
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
    <section id="team" class="section team-section">
        <div class="container">
            <h2 class="section-title" data-translate="team_title">Our Expert Team</h2>
            <p class="section-subtitle" data-translate="team_subtitle">Meet the professionals behind RimToken</p>
            
            <div class="team-grid">
                <div class="team-member">
                    <div class="member-photo">
                        <img src="/team-photos/othmankamra.jpg" alt="Othman Kamra" loading="lazy">
                    </div>
                    <div class="member-info">
                        <h3 class="member-name">Othman Kamra</h3>
                        <p class="member-title">Chief Executive Officer</p>
                        <p class="member-description">Visionary leader with extensive experience in fintech and blockchain technology. Driving RimToken's strategic direction and innovation.</p>
                    </div>
                </div>
                
                <div class="team-member">
                    <div class="member-photo">
                        <img src="/team-photos/rim.jpg" alt="Rim" loading="lazy">
                    </div>
                    <div class="member-info">
                        <h3 class="member-name">Rim</h3>
                        <p class="member-title">Chief Technology Officer</p>
                        <p class="member-description">Technical architect and blockchain expert leading our development team. Specializes in secure cryptocurrency infrastructure.</p>
                    </div>
                </div>
                
                <div class="team-member">
                    <div class="member-photo">
                        <img src="/team-photos/hacen.jpg" alt="Hacen" loading="lazy">
                    </div>
                    <div class="member-info">
                        <h3 class="member-name">Hacen</h3>
                        <p class="member-title">Lead Developer</p>
                        <p class="member-description">Full-stack developer with expertise in React, Node.js, and blockchain integration. Building scalable trading platform solutions.</p>
                    </div>
                </div>
                
                <div class="team-member">
                    <div class="member-photo">
                        <img src="/team-photos/hamido.jpg" alt="Hamido" loading="lazy">
                    </div>
                    <div class="member-info">
                        <h3 class="member-name">Hamido</h3>
                        <p class="member-title">Security Engineer</p>
                        <p class="member-description">Cybersecurity specialist ensuring the highest security standards for user funds and platform infrastructure.</p>
                    </div>
                </div>
                
                <div class="team-member">
                    <div class="member-photo">
                        <img src="/team-photos/hatan.jpg" alt="Hatan" loading="lazy">
                    </div>
                    <div class="member-info">
                        <h3 class="member-name">Hatan</h3>
                        <p class="member-title">Market Analyst</p>
                        <p class="member-description">Financial markets expert providing real-time analysis and insights for cryptocurrency trading strategies.</p>
                    </div>
                </div>
                
                <div class="team-member">
                    <div class="member-photo">
                        <img src="/team-photos/joen.jpg" alt="Joen" loading="lazy">
                    </div>
                    <div class="member-info">
                        <h3 class="member-name">Joen</h3>
                        <p class="member-title">Product Manager</p>
                        <p class="member-description">Product strategy expert focusing on user experience and feature development for the trading platform.</p>
                    </div>
                </div>
                
                <div class="team-member">
                    <div class="member-photo">
                        <img src="/team-photos/anbarzan.jpg" alt="Anbarzan" loading="lazy">
                    </div>
                    <div class="member-info">
                        <h3 class="member-name">Anbarzan</h3>
                        <p class="member-title">Marketing Director</p>
                        <p class="member-description">Digital marketing strategist building RimToken's brand presence and community engagement across global markets.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="section contact-section">
        <div class="container">
            <h2 class="section-title" data-translate="contact_title">Get In Touch</h2>
            <p class="section-subtitle" data-translate="contact_subtitle">We're here to help you succeed</p>
            
            <div class="contact-content">
                <div class="contact-info">
                    <div class="contact-card">
                        <div class="contact-icon">📞</div>
                        <h3 class="contact-title">Phone</h3>
                        <p class="contact-detail">37968897</p>
                    </div>
                    
                    <div class="contact-card">
                        <div class="contact-icon">📧</div>
                        <h3 class="contact-title">Email</h3>
                        <p class="contact-detail">INFO@RIMTOKEN.ORG</p>
                    </div>
                    
                    <div class="contact-card">
                        <div class="contact-icon">🌐</div>
                        <h3 class="contact-title">Website</h3>
                        <p class="contact-detail">rimtoken.org</p>
                    </div>
                </div>
                
                <div class="social-links-section">
                    <h3 class="social-title">Follow Us</h3>
                    <div class="social-links">
                        <a href="https://www.reddit.com/u/rimtoken/s/HnGk0uGY70" class="social-link" title="Reddit">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                            </svg>
                            <span>Reddit</span>
                        </a>
                        
                        <a href="https://tiktok.com/@rimtoken" class="social-link" title="TikTok">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                            </svg>
                            <span>TikTok</span>
                        </a>
                        
                        <a href="https://discord.com/invite/ZqvXkQEwyA" class="social-link" title="Discord">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/>
                            </svg>
                            <span>Discord</span>
                        </a>
                        
                        <a href="https://t.me/rimtoken9" class="social-link" title="Telegram">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                            </svg>
                            <span>Telegram</span>
                        </a>
                        
                        <a href="https://www.youtube.com/@Rimtoken" class="social-link" title="YouTube">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                            <span>YouTube</span>
                        </a>
                        
                        <a href="https://chat.whatsapp.com/HIjL1n2nLC55bJhTMifDZD" class="social-link" title="WhatsApp">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
                            </svg>
                            <span>WhatsApp</span>
                        </a>
                    </div>
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

        // Language selector functionality - wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', function() {{
            const languageBtn = document.getElementById('languageBtn');
            const languageDropdown = document.getElementById('languageDropdown');
            const currentLang = document.getElementById('currentLang');

            if (languageBtn && languageDropdown) {{
                languageBtn.addEventListener('click', function(e) {{
                    e.preventDefault();
                    e.stopPropagation();
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
                        
                        // Switch language content
                        switchLanguage(langCode);
                    }});
                }});
            }}
        }});
                
        // Language translation system
        const translations = {{
            'en': {{
                'home': 'Home', 'trading': 'Trading', 'wallet': 'Wallet', 'team': 'Team', 'contact': 'Contact',
                'contact_title': 'Get In Touch', 'contact_subtitle': 'We\'re here to help you succeed',
                'welcome_title': 'Welcome to RimToken', 'welcome_subtitle': 'The Future of Cryptocurrency Trading',
                'welcome_description': 'Experience seamless cryptocurrency trading with real-time market data, advanced portfolio management, and secure wallet integration.',
                'get_started_btn': 'Get Started', 'learn_more_btn': 'Learn More',
                'trading_title': 'Live Trading Dashboard', 'trading_subtitle': 'Real-time cryptocurrency market data',
                'name_symbol': 'Name/Symbol', 'price': 'Price', 'change_24h': 'Change (24h)', 'market_cap': 'Market Cap',
                'wallet_title': 'Secure Digital Wallet', 'wallet_subtitle': 'Manage your cryptocurrencies safely',
                'wallet_description': 'Your digital assets are protected with bank-level security. Enjoy seamless transactions and real-time portfolio tracking.',
                'create_wallet_btn': 'Create Wallet', 'import_wallet_btn': 'Import Wallet',
                'downloads_title': 'Download RimToken', 'downloads_subtitle': 'Get the app on all your devices',
                'downloads_description': 'Access your portfolio anywhere with our mobile and desktop applications.',
                'team_title': 'Our Expert Team', 'team_subtitle': 'Meet the professionals behind RimToken',
                'contact_title': 'Get In Touch', 'contact_subtitle': "We're here to help you succeed"
            }},
            'ar': {{
                'home': 'الرئيسية', 'trading': 'التداول', 'wallet': 'المحفظة', 'team': 'الفريق', 'contact': 'اتصل بنا',
                'contact_title': 'تواصل معنا', 'contact_subtitle': 'نحن هنا لمساعدتك على النجاح',
                'welcome_title': 'مرحباً بك في ريم توكن', 'welcome_subtitle': 'مستقبل تداول العملات المشفرة',
                'welcome_description': 'استمتع بتداول العملات المشفرة بسلاسة مع بيانات السوق في الوقت الفعلي وإدارة محفظة متقدمة.',
                'get_started_btn': 'ابدأ الآن', 'learn_more_btn': 'اعرف المزيد',
                'trading_title': 'لوحة التداول المباشر', 'trading_subtitle': 'بيانات سوق العملات المشفرة في الوقت الفعلي',
                'name_symbol': 'الاسم/الرمز', 'price': 'السعر', 'change_24h': 'التغيير (24 ساعة)', 'market_cap': 'القيمة السوقية',
                'wallet_title': 'محفظة رقمية آمنة', 'wallet_subtitle': 'إدارة عملاتك المشفرة بأمان',
                'wallet_description': 'أصولك الرقمية محمية بأمان مصرفي. استمتع بمعاملات سلسة وتتبع المحفظة في الوقت الفعلي.',
                'create_wallet_btn': 'إنشاء محفظة', 'import_wallet_btn': 'استيراد محفظة',
                'downloads_title': 'تحميل ريم توكن', 'downloads_subtitle': 'احصل على التطبيق على جميع أجهزتك',
                'downloads_description': 'الوصول إلى محفظتك في أي مكان مع تطبيقات الهاتف المحمول وسطح المكتب.',
                'team_title': 'فريقنا الخبير', 'team_subtitle': 'تعرف على المحترفين وراء ريم توكن',
                'contact_title': 'تواصل معنا', 'contact_subtitle': 'نحن هنا لمساعدتك على النجاح'
            }},
            'fr': {{
                'home': 'Accueil', 'trading': 'Trading', 'wallet': 'Portefeuille', 'team': 'Équipe', 'contact': 'Contact',
                'contact_title': 'Nous Contacter', 'contact_subtitle': 'Nous sommes là pour vous aider à réussir',
                'welcome_title': 'Bienvenue sur RimToken', 'welcome_subtitle': "L'avenir du trading de cryptomonnaies",
                'welcome_description': 'Découvrez le trading de cryptomonnaies fluide avec des données de marché en temps réel.',
                'get_started_btn': 'Commencer', 'learn_more_btn': 'En savoir plus',
                'trading_title': 'Tableau de bord trading', 'trading_subtitle': 'Données de marché en temps réel',
                'name_symbol': 'Nom/Symbole', 'price': 'Prix', 'change_24h': 'Changement (24h)', 'market_cap': 'Capitalisation',
                'wallet_title': 'Portefeuille sécurisé', 'wallet_subtitle': 'Gérez vos cryptomonnaies',
                'wallet_description': 'Vos actifs numériques sont protégés par une sécurité bancaire.',
                'create_wallet_btn': 'Créer portefeuille', 'import_wallet_btn': 'Importer portefeuille',
                'downloads_title': 'Télécharger RimToken', 'downloads_subtitle': "L'application sur tous vos appareils",
                'downloads_description': 'Accédez à votre portefeuille partout avec nos applications.',
                'team_title': 'Notre équipe', 'team_subtitle': 'Les professionnels derrière RimToken',
                'contact_title': 'Contactez-nous', 'contact_subtitle': 'Nous sommes là pour vous aider'
            }},
            'zh': {{
                'home': '首页', 'trading': '交易', 'wallet': '钱包', 'team': '团队', 'contact': '联系我们',
                'contact_title': '联系我们', 'contact_subtitle': '我们在这里帮助您成功',
                'welcome_title': '欢迎来到RimToken', 'welcome_subtitle': '加密货币交易的未来',
                'welcome_description': '体验无缝的加密货币交易，实时市场数据，先进的投资组合管理。',
                'get_started_btn': '开始使用', 'learn_more_btn': '了解更多',
                'trading_title': '实时交易面板', 'trading_subtitle': '实时加密货币市场数据',
                'name_symbol': '名称/符号', 'price': '价格', 'change_24h': '24小时变化', 'market_cap': '市值',
                'wallet_title': '安全数字钱包', 'wallet_subtitle': '安全管理您的加密货币',
                'wallet_description': '您的数字资产受到银行级安全保护。享受无缝交易和实时跟踪。',
                'create_wallet_btn': '创建钱包', 'import_wallet_btn': '导入钱包',
                'downloads_title': '下载RimToken', 'downloads_subtitle': '在所有设备上获取应用',
                'downloads_description': '通过我们的移动和桌面应用程序随时随地访问您的投资组合。',
                'team_title': '我们的专家团队', 'team_subtitle': '认识RimToken背后的专业人士',
                'contact_title': '联系我们', 'contact_subtitle': '我们在这里帮助您成功'
            }}
        }};

        function switchLanguage(lang) {{
            const elements = document.querySelectorAll('[data-translate]');
            elements.forEach(element => {{
                const key = element.getAttribute('data-translate');
                if (translations[lang] && translations[lang][key]) {{
                    element.textContent = translations[lang][key];
                }}
            }});
            document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        }}
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