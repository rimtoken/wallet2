#!/usr/bin/env python3

from http.server import HTTPServer, BaseHTTPRequestHandler

class WorkingHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        
        html = '''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RimToken</title>
    <style>
        body { 
            font-family: Arial; 
            background: linear-gradient(45deg, #4f46e5, #7c3aed); 
            color: white; 
            margin: 0; 
            padding: 20px; 
            text-align: center; 
        }
        .container { 
            max-width: 800px; 
            margin: auto; 
            padding: 40px; 
            background: rgba(255,255,255,0.1); 
            border-radius: 20px; 
        }
        h1 { font-size: 3em; margin-bottom: 20px; }
        .nav { margin: 30px 0; }
        .nav a { 
            background: rgba(255,255,255,0.2); 
            padding: 10px 20px; 
            margin: 10px; 
            text-decoration: none; 
            color: white; 
            border-radius: 25px; 
            display: inline-block; 
        }
        .status { 
            background: #10b981; 
            padding: 10px; 
            border-radius: 5px; 
            margin-bottom: 20px; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="status">الموقع يعمل بنجاح</div>
        <h1>RimToken</h1>
        <p>محفظة العملات الرقمية الآمنة</p>
        <div class="nav">
            <a href="#">الرئيسية</a>
            <a href="#">التداول</a>
            <a href="#">المحفظة</a>
            <a href="#">الستاكينغ</a>
        </div>
        <p>مرحباً بك في منصة RimToken للعملات الرقمية</p>
    </div>
</body>
</html>'''
        
        self.wfile.write(html.encode('utf-8'))

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 3000), WorkingHandler)
    print('RimToken Server running on port 3000')
    server.serve_forever()