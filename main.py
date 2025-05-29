#!/usr/bin/env python3

from http.server import HTTPServer, BaseHTTPRequestHandler

class RimTokenHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        
        html = """<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RimToken</title>
    <style>
        body {
            font-family: Arial;
            background: #4f46e5;
            color: white;
            text-align: center;
            padding: 50px;
            margin: 0;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        p {
            font-size: 1.2rem;
            margin: 20px 0;
        }
        .status {
            background: #10b981;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 30px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="status">Website Working</div>
    <h1>RimToken</h1>
    <p>Cryptocurrency Wallet Platform</p>
    <p>The website is running successfully!</p>
</body>
</html>"""
        
        self.wfile.write(html.encode('utf-8'))

if __name__ == '__main__':
    port = 3000
    server = HTTPServer(('0.0.0.0', port), RimTokenHandler)
    print(f'RimToken Website is running at http://localhost:{port}')
    print(f'Primary URL: https://dahm2621.repl.co')
    print(f'Alternative URL: https://workspace-{port}.dahm2621.repl.co')
    print('Your beautiful crypto website is ready!')
    server.serve_forever()