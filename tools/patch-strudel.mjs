// Патч для node: опубликованный @strudel/core тянет @kabelsalat/web ради
// браузерного REPL, а в node этот пакет ломается на импорте (нет SalatRepl).
// Мы его не используем — подменяем заглушкой. Запускается из postinstall.
import fs from 'node:fs';
import path from 'node:path';

const pkgDir = path.join(process.cwd(), 'node_modules', '@kabelsalat', 'web');
const STUB = `// stub for node — real package only works in the browser
export class SalatRepl {
  constructor() {}
  evaluate() {
    throw new Error('SalatRepl is not available in node');
  }
}
export const transpiler = () => ({});
`;

if (!fs.existsSync(pkgDir)) {
  console.log('[patch] @kabelsalat/web не установлен — нечего патчить');
  process.exit(0);
}

fs.writeFileSync(
  path.join(pkgDir, 'package.json'),
  JSON.stringify(
    {
      name: '@kabelsalat/web',
      version: '0.0.0-stub',
      type: 'module',
      main: 'stub.mjs',
      exports: { '.': './stub.mjs' },
    },
    null,
    2,
  ),
);
fs.writeFileSync(path.join(pkgDir, 'stub.mjs'), STUB);
console.log('[patch] @kabelsalat/web → stub (node-safe)');
