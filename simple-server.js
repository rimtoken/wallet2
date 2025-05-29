const http = require('http');

const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
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
        h1 { font-size: 3rem; margin-bottom: 20px; }
        .status { 
            background: #10b981; 
            padding: 10px; 
            border-radius: 5px; 
            margin: 20px auto; 
            display: inline-block; 
        }
    </style>
</head>
<body>
    <div class="status">موقع RimToken يعمل</div>
    <h1>RimToken</h1>
    <p>منصة العملات الرقمية</p>
    <p>الموقع يعمل بنجاح</p>
</body>
</html>`;

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(html);
});

server.listen(3000, '0.0.0.0', () => {
    console.log('RimToken running on port 3000');
});