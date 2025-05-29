import http.server
import socketserver

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        
        html = """<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>RimToken</title>
<style>body{font-family:Arial;background:#4f46e5;color:white;text-align:center;padding:50px;}
.box{background:#10b981;padding:20px;border-radius:10px;margin:20px;font-size:1.5rem;}</style>
</head><body><h1>RimToken</h1><div class="box">الموقع يعمل ✅</div></body></html>"""
        
        self.wfile.write(html.encode('utf-8'))

with socketserver.TCPServer(("0.0.0.0", 3000), MyHandler) as httpd:
    print("Server ready on port 3000")
    httpd.serve_forever()