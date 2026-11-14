// Разовая проверка: сколько worklet'ов реально строится за такт.
// worklet = shape / crush / coarse / distort / ftype("ladder") — по исходнику
// superdough каждый из них делает new AudioWorkletNode на КАЖДОЕ событие.
// Громкости поднимаются до 0.8 (иначе все ветки режимов с gain 0 и считать
// нечего), запрос — 8 тактов, результат делится на 8.
// ══════════════════════════════════════════════════════════════════
//  БЮДЖЕТ CPU — сколько worklet'ов строится за такт
// ══════════════════════════════════════════════════════════════════
//   npm run cpu -- tracks/techno/10-slowtrap.js
//
// Зачем: `shape`, `crush`, `coarse`, `distort` и `ftype("ladder")` — это
// AudioWorklet, и superdough делает `new AudioWorkletNode` на КАЖДОЕ событие,
// никогда их не переиспользуя (обычные biquad-фильтры берутся из пула). Это
// самая дорогая операция в движке, и именно она роняет звук на слабых машинах.
//
// Считаем не «на глаз», а по факту: прогоняем трек через движок, для каждого
// события смотрим, какие из этих контролов в нём есть, и складываем. Запрос —
// 8 тактов (дорожка, которая входит на 3-м, тоже попадёт), результат делится
// на 8. Громкости поднимаются до 0.8: иначе все ветки режимов с gain 0 и
// считать нечего.
//
// Печатает по режимам (`mode`) и в пересчёте на секунды, потому что бюджет —
// это не «на такт», а «в секунду»: 180 BPM и 136 BPM при одинаковом числе
// worklet'ов на такт грузят машину по-разному.
import fs from 'node:fs';
import vm from 'node:vm';
import * as core from '@strudel/core';
import * as mini from '@strudel/mini';
import './viz-stub.mjs';
import { loudVolumes } from './loud.mjs';
mini.miniAllStrings();

const file = process.argv[2];
const raw = fs.readFileSync(file, 'utf8');

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

const KEYS = ['shape', 'crush', 'coarse', 'distort'];
const BARS = 8;

// Громкости поднимаем (см. tools/loud.mjs): с гейтом `.filter(audible)` на
// нулях не остаётся ни одного события, и «сколько worklet'ов на такт» было бы 0.
const loud = loudVolumes(raw);

function run(modeValue) {
  const pats = [];
  const ctx = {
    ...core, ...mini,
    P: (p) => { pats.push(p); return p; },
    slider: (v) => core.signal(() => v),
    setcpm: () => {}, setcps: () => {}, console,
  };
  vm.createContext(ctx);
  const code = loud.replace(
    /const\s+mode\s*=\s*slider\([^)]*\)/,
    `const mode = signal(() => ${modeValue})`,
  );
  vm.runInContext(wrapLabels(code), ctx, { filename: 'probe' });
  let total = 0;
  const per = [];
  pats.forEach((p, i) => {
    let n = 0;
    for (const h of p.queryArc(0, BARS)) {
      if (!h.hasOnset()) continue;
      if (Number(h.value.gain ?? 1) <= 0.001) continue;
      let w = 0;
      for (const k of KEYS) if (h.value[k] !== undefined) w++;
      if (h.value.ftype === 'ladder') w++;
      n += w;
    }
    if (n) per.push(i + ':' + Math.round(n / BARS));
    total += n;
  });
  return { total: Math.round(total / BARS), per };
}

const bpm = Number((raw.match(/const BPM = (\d+)/) || [])[1] || 120);
// 136 BPM → 0.567 такта в секунду; worklet'ов в секунду = на такт × BPM/240.
const perSec = (n) => (n * (bpm / 240)).toFixed(0);
const hasMode = /const\s+mode\s*=\s*slider\(/.test(raw);
const modes = hasMode ? [0, 1, 2, 3] : [0];

console.log(`\n${file} — ${bpm} BPM, ${hasMode ? 'режимов: 4' : 'без режимов'}\n`);
let worst = 0;
for (const m of modes) {
  const { total, per } = run(m);
  worst = Math.max(worst, total);
  const label = hasMode ? `mode ${m}` : 'трек  ';
  console.log(
    `  ${label}: ${String(total).padStart(3)} worklet/такт  =  ${perSec(total).padStart(3)}/с` +
      (per.length ? `   [${per.join(' ')}]` : ''),
  );
}
console.log(
  `\n  худший режим: ${worst}/такт = ${perSec(worst)}/с` +
    `\n  ориентир: до ~150/с живёт спокойно, 300+ начинает рвать звук на слабых машинах.`,
);
