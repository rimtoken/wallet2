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
    port = 5000
    server = HTTPServer(('0.0.0.0', port), RimTokenHandler)
    print(f'🎉 RimToken Website is running at http://localhost:{port}')
    print('✨ Your beautiful crypto website is ready!')
    server.serve_forever()