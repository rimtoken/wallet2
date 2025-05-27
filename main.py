#!/usr/bin/env python3

from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class RimTokenHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '/index.html':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            try:
                with open('rimtoken-chrome-compatible.html', 'r', encoding='utf-8') as f:
                    html_content = f.read()
            except FileNotFoundError:
                try:
                    with open('docs/index.html', 'r', encoding='utf-8') as f:
                        html_content = f.read()
                except FileNotFoundError:
                    with open('crypto-template.html', 'r', encoding='utf-8') as f:
                        html_content = f.read()
            
            self.wfile.write(html_content.encode('utf-8'))
            return
        
        # Handle other requests normally
        super().do_GET()

if __name__ == '__main__':
    import socket
    
    # البحث عن بورت متاح
    def find_port():
        for p in [3000, 8080, 8000, 5000, 4000]:
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.bind(('0.0.0.0', p))
                    return p
            except:
                continue
        return 3000
    
    port = find_port()
    server = HTTPServer(('0.0.0.0', port), RimTokenHandler)
    
    print(f'🎉 RimToken Website is running at http://localhost:{port}')
    print(f'🌐 Preview URL: https://{os.environ.get("REPL_SLUG", "preview")}-{port}.{os.environ.get("REPL_OWNER", "user")}.repl.co')
    print('✨ Your beautiful crypto website is ready!')
    print('📱 Click the Preview button to see your site!')
    
    server.serve_forever()