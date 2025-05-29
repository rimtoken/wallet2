#!/usr/bin/env python3

from http.server import HTTPServer, BaseHTTPRequestHandler

class RimTokenHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            with open('rimtoken-local.html', 'r', encoding='utf-8') as f:
                content = f.read()
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(content.encode('utf-8'))
        except:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    port = 3000
    server = HTTPServer(('0.0.0.0', port), RimTokenHandler)
    print(f'RimToken Website is running at http://localhost:{port}')
    print(f'Primary URL: https://dahm2621.repl.co')
    print(f'Alternative URL: https://workspace-{port}.dahm2621.repl.co')
    print('Your beautiful crypto website is ready!')
    server.serve_forever()