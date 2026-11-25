// Проверка режимов ударов: каждый ли режим реально что-то играет.
//
// Зачем: verify.mjs гоняет трек с дефолтами, то есть mode = 0. Ветки других
// режимов там дают gain = 0 и в отчёте выглядят как «есть события», хотя
// проверить, что mode = 3 действительно включается, он не может. Здесь трек
// прогоняется по каждому значению `mode`, и видно, какие дорожки меняются.
//
//   npm run modes -- tracks/techno/06-deep-dub-v2.js
//
// Что считать нормой:
//   • дорожка, у которой счётчик одинаков во всех режимах и не ноль — она
//     играет всегда (атмосфера, бас, пэды). Это правильно.
//   • дорожка, которая в каком-то режиме даёт 0 — значит в этом режиме она
//     молчит. Для перкуссии это часто задумано (шейкер только в «ломе»),
//     но если задумано обратное — вот оно.
//   • дорожка, которая не меняется там, где должна (например бочка в новом
//     режиме), — красный флаг: гейт не подключён.
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
  console.error('укажи файл: npm run modes -- tracks/techno/06-deep-dub-v2.js');
  process.exit(1);
}
const raw = fs.readFileSync(file, 'utf8');

const modeDecl = raw.match(/const\s+mode\s*=\s*slider\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*[\d.]+\s*\)/);
if (!modeDecl) {
  console.log('в файле нет `const mode = slider(...)` — режим зафиксирован, переключать нечего');
  process.exit(0);
}
const maxMode = Number(modeDecl[3]);

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

// имя дорожки = ПЕРВАЯ строка блока комментариев, который относится к её $:
// (в блоках вторая-третья строки — пояснение, а не название). Ищем начало
// блока, а не ближайшую строку: у «КЛИКОВ» между шапкой и $: стоит
// const stutGain, и ближайший комментарий — уже пояснение внутри.
function labelFor(lines, idx) {
  for (let i = idx - 1; i >= 0 && idx - i < 60; i--) {
    const t = lines[i].trim();
    if (!t.startsWith('//')) continue;
    const prev = i > 0 ? lines[i - 1].trim() : '';
    if (prev.startsWith('//')) continue; // это не начало блока
    return t.replace(/^\/\/\s*/, '').split(/[—:]/)[0].trim().slice(0, 24);
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

const lines = raw.split('\n');

// В этих треках по задумке все громкости стартуют с нуля (звучит только
// атмосфера), поэтому «слышимых» событий не будет ни в одном режиме.
// Для проверки режимов поднимаем все *Vol до 0.8 (см. tools/loud.mjs) — нам
// важен РИСУНОК, а не то, что зритель ещё не поднял ручку. Остальные слайдеры
// не трогаем: harmony должен остаться в дефолте, иначе пэды обоих режимов
// смешаются.
const loud = loudVolumes(raw);

const results = [];

for (let m = 0; m <= maxMode; m++) {
  const code = loud.replace(/const\s+mode\s*=\s*slider\(\s*-?[\d.]+\s*,/, 'const mode = slider(' + m + ',');
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
    console.error('режим ' + m + ' не запускается: ' + e.message);
    process.exit(1);
  }
  // считаем не только количество, но и подпись: позиция + сэмпл + громкость.
  // Иначе «прямо» и «брейк» выглядят одинаково (по 16 хэтов), хотя акценты
  // у них разные — а акцент в этом треке и есть рисунок.
  results.push(pats.map((p) => {
    const hits = p.queryArc(0, 4)
      .filter((h) => h.hasOnset() && Number(h.value.gain ?? 1) > 0.001);
    const sig = hits.map((h) =>
      Math.round(Number(h.whole.begin) * 16 * 100) / 100 + ':' +
      (h.value.s ?? h.value.note ?? '?') + ':' +
      Number(h.value.gain ?? 1).toFixed(2),
    ).join(',');
    return { count: hits.length, sig };
  }));
}

console.log('\n' + path.basename(file) + ' — режимов: ' + (maxMode + 1) + ', считаю по 4 такта\n');
const rows = results[0].map((_, t) => {
  const row = results.map((r) => r[t]);
  const same = row.every((v) => v.sig === row[0].sig);
  return { row, same, name: labelFor(lines, labelLine(lines, t)) || '#' + t };
});

// сначала то, ради чего инструмент: дорожки, которые реально меняются
const varies = rows.filter((r) => !r.same);
const constant = rows.filter((r) => r.same);

const head = '  дорожка'.padEnd(28) + results.map((_, m) => ('mode ' + m).padStart(8)).join('') + '   что меняется';
if (varies.length) {
  console.log(head);
  console.log('  ' + '─'.repeat(head.length - 2));
  for (const { row, name } of varies) {
    const silent = row.map((v) => v.count === 0).some(Boolean);
    const note = silent ? 'в части режимов тихо' : 'свой рисунок в каждом';
    console.log(('  ' + name).padEnd(28) + row.map((v) => String(v.count).padStart(8)).join('') + '   ' + note);
  }
} else {
  console.log('  ✗ ни одна дорожка не зависит от mode — гейты не подключены?');
  process.exitCode = 1;
}

if (constant.length) {
  const names = constant.map((r) => r.name + (r.row[0].count === 0 ? ' (0)' : '')).join(', ');
  console.log('\n  не зависят от mode: ' + names);
}

console.log('\n  «в части режимов тихо» — это нормально, если так задумано');
console.log('  (шейкер только в «ломе»). Плохо, если тихо там, где должен играть.');

