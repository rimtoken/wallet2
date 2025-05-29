import express from 'express';
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createViteServer() {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
    root: resolve(__dirname, 'client')
  });

  const app = express();
  
  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);

  app.listen(3000, '0.0.0.0', () => {
    console.log('RimToken React App running on port 3000');
  });
}

createViteServer();