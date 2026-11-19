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

  // Список треков для выпадающего меню в шапке панели. Панель не хранит
  // имён файлов: положил новый .js в tracks/ — он появился в меню.
  if (url === '/api/tracks') {
    const out = [];
    const walk = (dir, prefix) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.name.startsWith('.')) continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p, `${prefix}${e.name}/`);
        else if (e.name.endsWith('.js')) out.push(`/tracks/${prefix}${e.name}`);
      }
    };
    walk(path.join(root, 'tracks'), '');
    out.sort();
    res.writeHead(200, {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    });
    res.end(JSON.stringify(out));
    return;
  }

  // Local reference scripts (git-ignored): loadable/listenable from the panel.
  if (url === '/api/refs') {
    const out = [];
    const base = path.join(root, 'refs', 'strudel');
    let ignored = [];
    try {
      ignored = fs
        .readFileSync(path.join(root, 'refs-ignore.txt'), 'utf8')
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith('#'));
    } catch {}
    const isIgnored = (rel) =>
      ignored.some((l) => rel === l || rel.startsWith(l.endsWith('/') ? l : l + '/') || rel.startsWith(l));
    const walk = (dir) => {
      if (!fs.existsSync(dir)) return;
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.name.startsWith('.')) continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (/\.(js|strudel|mjs)$/.test(e.name)) {
          const rel = path.relative(root, p).split(path.sep).join('/');
          if (!isIgnored(rel)) out.push('/' + rel);
        }
      }
    };
    walk(base);
    out.sort();
    res.writeHead(200, {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    });
    res.end(JSON.stringify(out));
    return;
  }

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
