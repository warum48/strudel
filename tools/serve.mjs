// Минимальный статический сервер для панели: node tools/serve.mjs [порт]
// Нужен потому, что панель тянет трек через fetch — с file:// браузер это
// запрещает. Ничего кроме чтения файлов из репозитория не делает.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// HOST/PORT для контейнера на VPS: там панель должна слушать 0.0.0.0.
// Локально по умолчанию всё как раньше — 127.0.0.1:8080.
const port = Number(process.argv[2] ?? process.env.PORT ?? 8080);
const host = process.argv[3] ?? process.env.HOST ?? '127.0.0.1';

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
  // new URL(...).pathname, а не split: за прокси браузер вправе прислать
  // absolute-form ("GET http://host/web/x.js HTTP/1.1", RFC 7230 §5.3.2), и
  // path.join(root, 'http://host/web/x.js') давал ENOENT → 404 на живых файлах.
  const url = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  if (process.env.LOG_REQ) console.log(req.method, req.url, req.headers['user-agent']?.slice(0, 30));

  // Localhost gets the full local library; any other host is the public
  // deployment and only exposes the curated `_selected/` set.
  const hostName = String(req.headers.host ?? '')
    .toLowerCase()
    .replace(/:\d+$/, '')
    .replace(/^\[|\]$/g, '');
  const isLocal =
    hostName === '' ||
    hostName === 'localhost' ||
    hostName === '127.0.0.1' ||
    hostName === '0.0.0.0' ||
    hostName === '::1' ||
    hostName.endsWith('.local');

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
    if (isLocal) walk(path.join(root, 'tracks'), '');
    else walk(path.join(root, 'tracks', '_selected'), '_selected/');
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
  // Public hosts can only read the curated `_selected/` tracks; the rest of the
  // library exists on the box but is not fetchable from the internet.
  if (!isLocal && rel.startsWith('/tracks/') && !rel.startsWith('/tracks/_selected/')) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' }).end('нет файла: ' + rel);
    return;
  }
  const full = path.join(root, rel);
  // никакого выхода за пределы репозитория
  if (!full.startsWith(root)) {
    res.writeHead(403, { 'cache-control': 'no-store' }).end('forbidden');
    return;
  }
  fs.readFile(full, (err, buf) => {
    if (err) {
      if (process.env.LOG_REQ) console.log('404', rel, err.code);
      // no-store обязателен и здесь: без него браузер кеширует 404 по эвристике
      // и файл, появившийся после редеплоя, остаётся «отсутствующим» до сброса кеша.
      res
        .writeHead(404, {
          'content-type': 'text/plain; charset=utf-8',
          'cache-control': 'no-store',
        })
        .end('нет файла: ' + rel);
      return;
    }
    res.writeHead(200, {
      'content-type': MIME[path.extname(full)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(buf);
  });
});

server.listen(port, host, () => {
  console.log(`панель: http://${host}:${port}/`);
});
