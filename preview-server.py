#!/usr/bin/env python3

from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
import socket

class PreviewHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '/index.html':
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            # قراءة الملف المحدث
            try:
                with open('rimtoken-chrome-compatible.html', 'r', encoding='utf-8') as f:
                    html_content = f.read()
                print("✅ تم تحميل rimtoken-chrome-compatible.html")
            except FileNotFoundError:
                html_content = """
                <!DOCTYPE html>
                <html><head><title>خطأ</title></head>
                <body><h1>لم يتم العثور على الملف</h1></body></html>
                """
                print("❌ لم يتم العثور على الملف")
            
            self.wfile.write(html_content.encode('utf-8'))
            return
        
        # التعامل مع طلبات أخرى
        super().do_GET()

def find_free_port():
    """البحث عن بورت متاح"""
    for port in [3000, 8080, 8000, 5000, 4000]:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', port))
                return port
        except:
            continue
    return 3000

if __name__ == '__main__':
    port = find_free_port()
    
    print(f"🚀 بدء تشغيل معاينة RimToken...")
    print(f"📱 الموقع متاح على: http://localhost:{port}")
    print(f"🌐 رابط المعاينة: https://{os.environ.get('REPL_SLUG', 'preview')}.{os.environ.get('REPL_OWNER', 'user')}.repl.co")
    print("✨ جاهز للعرض!")
    
    server = HTTPServer(('0.0.0.0', port), PreviewHandler)
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 تم إيقاف الخادم")
        server.shutdown()