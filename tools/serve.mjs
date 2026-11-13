// Минимальный статический сервер для панели: node tools/serve.mjs [порт]
// Нужен потому, что панель тянет трек через fetch — с file:// браузер это
// запрещает. Ничего кроме чтения файлов из репозитория не делает.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.argv[2] ?? 8080);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
};

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
  let rel = url === '/' ? '/web/index.html' : url;
  const full = path.join(root, rel);
  // никакого выхода за пределы репозитория
  if (!full.startsWith(root)) {
    res.writeHead(403).end('forbidden');
    return;
  }
  fs.readFile(full, (err, buf) => {
    if (err) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('нет файла: ' + rel);
      return;
    }
    res.writeHead(200, {
      'content-type': MIME[path.extname(full)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(buf);
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`панель: http://127.0.0.1:${port}/`);
});
