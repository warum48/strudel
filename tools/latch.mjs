// Проверка защёлки гармонии: переключатель двигается на середине фразы,
// а звук должен смениться только на границе (seg(1/8) = 1 сэмпл на 8 тактов).
//
//   npm run latch -- tracks/techno/07-dark.js
//
// Как это работает: `const harmony = slider(...)` подменяется на сигнал,
// который равен 0 до такта N и 1 после. Дальше для каждой дорожки считается
// gain по тактам, и печатаются те, что реально поменяли состояние — с номером
// такта, на котором это случилось. Если у пэдов там 8, а не 4, защёлка жива.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import * as core from '@strudel/core';
import * as mini from '@strudel/mini';
import './viz-stub.mjs';
import { loudVolumes } from './loud.mjs';

mini.miniAllStrings();

const file = process.argv[2];
if (!file) {
  console.error('укажи файл: npm run latch -- tracks/techno/07-dark.js');
  process.exit(1);
}
const raw = fs.readFileSync(file, 'utf8');

const decl = raw.match(/const\s+harmony\s*=\s*slider\([^)]*\)/);
if (!decl) {
  console.error('в файле нет `const harmony = slider(...)` — нечего защёлкивать');
  process.exit(1);
}

const SWITCH_AT = 4; // двигаем слайдер на 4-м такте, то есть посреди фразы
const CYCLES = 18;

function wrapLabels(code) {
  const lines = code.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('$: ')) {
      const block = [line.slice(3)];
      i++;
      while (i < lines.length) {
        const next = lines[i];
        if (next.startsWith('  ')) { block.push(next); i++; continue; }
        if (next.trim() === '' && i + 1 < lines.length && lines[i + 1].startsWith('  ')) { block.push(next); i++; continue; }
        break;
      }
      out.push('P(' + block[0], ...block.slice(1), ');');
    } else { out.push(line); i++; }
  }
  return out.join('\n');
}

// имя дорожки = первая строка блока комментариев над её $:
function labelFor(lines, idx) {
  for (let i = idx - 1; i >= 0 && idx - i < 60; i--) {
    const t = lines[i].trim();
    if (!t.startsWith('//')) continue;
    const prev = i > 0 ? lines[i - 1].trim() : '';
    if (prev.startsWith('//')) continue;
    return t.replace(/^\/\/\s*/, '').split(/[—:]/)[0].trim().slice(0, 26);
  }
  return '';
}
function labelLine(lines, n) {
  let count = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('$: ')) { count++; if (count === n) return i; }
  }
  return 0;
}

// Громкости поднимаем принудительно (см. tools/loud.mjs): иначе гейт
// `.filter(audible)` выкинет все hap'ы и в отчёте будет пусто.
const loud = loudVolumes(raw);

const code = loud.replace(
  /const\s+harmony\s*=\s*slider\([^)]*\)/,
  `const harmony = signal((t) => (t >= ${SWITCH_AT} ? 1 : 0))`,
);

const pats = [];
const ctx = {
  ...core, ...mini,
  P: (p) => { pats.push(p); return p; },
  slider: (v) => core.signal(() => v),
  setcpm: () => {}, setcps: () => {}, console,
};
vm.createContext(ctx);
try {
  vm.runInContext(wrapLabels(code), ctx, { filename: path.basename(file) });
} catch (e) {
  console.error('не запускается: ' + e.message);
  process.exit(1);
}

const lines = raw.split('\n');
const gainAt = (p, c) => {
  const hs = p.queryArc(c, c + 1);
  if (!hs.length) return 0;
  return Math.max(0, ...hs.map((h) => Number(h.value.gain ?? 0)));
};

console.log(
  `\n${path.basename(file)} — слайдер harmony двигаем на такте ${SWITCH_AT}\n`,
);
console.log('  дорожка                      0…7        8…17   переключилась на');

let any = false;
pats.forEach((p, i) => {
  const g = Array.from({ length: CYCLES }, (_, c) => gainAt(p, c));
  const first = g.slice(0, 8).reduce((a, b) => Math.max(a, b), 0);
  const second = g.slice(8).reduce((a, b) => Math.max(a, b), 0);
  if (Math.abs(first - second) < 0.001) return;
  any = true;
  const at = g.findIndex((v, c) => c > 0 && Math.abs(v - g[c - 1]) > 0.001);
  const name = labelFor(lines, labelLine(lines, i)) || '#' + i;
  // ожидаемая граница — первая кратная 8 после того, как двинули слайдер.
  // Всё, что меняется на другой границе (шумовой свип раз в 16 тактов),
  // к гармонии отношения не имеет — так и подписываем.
  const expected = Math.ceil(SWITCH_AT / 8) * 8;
  const note = at === expected ? '' : '   (не harmony — свой цикл)';
  console.log(
    '  ' + name.padEnd(28) +
    first.toFixed(2).padStart(5) + ' →' + second.toFixed(2).padStart(6) + '   ' +
    'такт ' + at + note,
  );
});

if (!any) {
  console.log('  ✗ ни одна дорожка не реагирует на harmony');
  process.exit(1);
}
console.log(
  `\n  ожидаемо: такт 8, а не ${SWITCH_AT} — начатая фраза доигрывает целиком.`,
);
