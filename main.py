#!/usr/bin/env python3

from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class RimTokenHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # Serve React app for SPA routes
        if self.path in ['/', '/enhanced-trading', '/trading', '/wallet', '/staking', '/mobile'] or self.path == '/index.html':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            try:
                with open('client/index.html', 'r', encoding='utf-8') as f:
                    html_content = f.read()
                self.wfile.write(html_content.encode('utf-8'))
                return
            except FileNotFoundError:
                # Fallback to static HTML
                try:
                    with open('rimtoken-chrome-compatible.html', 'r', encoding='utf-8') as f:
                        html_content = f.read()
                except FileNotFoundError:
                    with open('crypto-template.html', 'r', encoding='utf-8') as f:
                        html_content = f.read()
                
                self.wfile.write(html_content.encode('utf-8'))
                return
        
        # Handle all static files and assets
        if self.path.startswith('/src/') or self.path.startswith('/assets/') or self.path.startswith('/node_modules/'):
            file_path = f'client{self.path}'
            if os.path.exists(file_path):
                # Determine content type
                if self.path.endswith('.tsx') or self.path.endswith('.ts') or self.path.endswith('.js'):
                    content_type = 'application/javascript'
                elif self.path.endswith('.css'):
                    content_type = 'text/css'
                elif self.path.endswith('.json'):
                    content_type = 'application/json'
                elif self.path.endswith('.svg'):
                    content_type = 'image/svg+xml'
                elif self.path.endswith('.png'):
                    content_type = 'image/png'
                elif self.path.endswith('.jpg') or self.path.endswith('.jpeg'):
                    content_type = 'image/jpeg'
                else:
                    content_type = 'text/plain'
                
                self.send_response(200)
                self.send_header('Content-type', content_type)
                self.end_headers()
                
                # Handle binary files
                if content_type.startswith('image/'):
                    with open(file_path, 'rb') as f:
                        self.wfile.write(f.read())
                else:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        self.wfile.write(f.read().encode('utf-8'))
                return
        
        # Handle register-sw.js and other public files
        if self.path == '/register-sw.js':
            self.send_response(200)
            self.send_header('Content-type', 'application/javascript')
            self.end_headers()
            try:
                with open('client/public/register-sw.js', 'r', encoding='utf-8') as f:
                    self.wfile.write(f.read().encode('utf-8'))
                return
            except FileNotFoundError:
                self.wfile.write(b'// Service worker registration file not found')
                return
        
        # Handle service-worker.js
        if self.path == '/service-worker.js':
            self.send_response(200)
            self.send_header('Content-type', 'application/javascript')
            self.end_headers()
            try:
                with open('client/public/service-worker.js', 'r', encoding='utf-8') as f:
                    self.wfile.write(f.read().encode('utf-8'))
                return
            except FileNotFoundError:
                self.wfile.write(b'// Service worker file not found')
                return
        
        # Handle manifest.json and other public files
        if self.path == '/manifest.json':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            try:
                with open('client/public/manifest.json', 'r', encoding='utf-8') as f:
                    self.wfile.write(f.read().encode('utf-8'))
                return
            except FileNotFoundError:
                self.wfile.write(b'{}')
                return
        
        # Handle icons and other assets from public folder
        if self.path.startswith('/icons/') or self.path.startswith('/assets/'):
            file_path = f'client/public{self.path}'
            if os.path.exists(file_path):
                if self.path.endswith('.png'):
                    content_type = 'image/png'
                elif self.path.endswith('.svg'):
                    content_type = 'image/svg+xml'
                elif self.path.endswith('.jpg') or self.path.endswith('.jpeg'):
                    content_type = 'image/jpeg'
                else:
                    content_type = 'text/plain'
                
                self.send_response(200)
                self.send_header('Content-type', content_type)
                self.end_headers()
                
                if content_type.startswith('image/'):
                    with open(file_path, 'rb') as f:
                        self.wfile.write(f.read())
                else:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        self.wfile.write(f.read().encode('utf-8'))
                return
        
        # Handle other requests normally
        super().do_GET()

if __name__ == '__main__':
    import socket
    
    # استخدم المنفذ 3000 مباشرة للنشر
    port = 3000
    server = HTTPServer(('0.0.0.0', port), RimTokenHandler)
    
    print(f'🎉 RimToken Website is running at http://localhost:{port}')
    repl_owner = os.environ.get("REPL_OWNER", "dahm2621")
    print(f'🌐 Primary URL: https://{repl_owner}.repl.co')
    print(f'🌐 Alternative URL: https://workspace-{port}.{repl_owner}.repl.co')
    print('✨ Your beautiful crypto website is ready!')
    print('📱 Click the Preview button in Replit to see your site!')
    print('🔗 If links don\'t work, use the Preview button in Replit interface')
    
    server.serve_forever()