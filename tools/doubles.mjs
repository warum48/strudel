// Разбор «что играется дважды»: по каждой дорожке — события в такте 0 и такте 1.
// Если такт 0 даёт больше событий, чем такт 1 — что-то срабатывает только на
// старте. Так нашлось, что every(n, f) в Strudel стреляет на НУЛЕВОМ такте
// (в techno/01-berlin первый такт шёл 32-ми хэтами: 74 события вместо 40),
// и что sometimesBy(…, ply(2)) дублирует первую ноту баса, потому что rand
// в нулевой позиции всегда 0.
//
//   npm run doubles -- tracks/techno/01-berlin.js
//
// В конце — карта «позиция:сэмпл → номера дорожек». Если один и тот же сэмпл
// в одной и той же позиции играют РАЗНЫЕ дорожки, это слышно как удар дважды.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import * as core from '@strudel/core';
import * as mini from '@strudel/mini';

mini.miniAllStrings();

const file = process.argv[2];
if (!file) {
  console.error('укажи файл: npm run doubles -- tracks/techno/01-berlin.js');
  process.exit(1);
}
const code = fs.readFileSync(file, 'utf8');

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

const pats = [];
const ctx = {
  ...core, ...mini,
  P: (p) => { pats.push(p); return p; },
  slider: (v) => core.signal(() => v),
  setcpm: () => {}, setcps: () => {}, console,
};
vm.createContext(ctx);
vm.runInContext(wrapLabels(code), ctx, { filename: path.basename(file) });

const sig = (p, cyc) =>
  p.queryArc(cyc, cyc + 1).filter((h) => h.hasOnset())
    .map((h) => {
      const sName = h.value.s ?? h.value.note ?? h.value.n ?? '?';
      // hh:2 — это другой сэмпл, а не тот же хэт; без варианта он ложно
      // совпадал с hh у соседней дорожки
      const variant = h.value.s && h.value.n !== undefined ? ':v' + h.value.n : '';
      const note = h.value.note ? ':' + h.value.note : '';
      return `${Math.round(Number(h.whole.begin) * 16 * 1e6) / 1e6}:${sName}${variant}${note}`;
    });

// то же, но только реально слышимое: событие с gain = 0 — это выключенная
// ветка режима или заглушённый гейтом филл. Для карты наложений такие
// события нельзя считать ударом, иначе ловятся фантомы (в 06 призрак
// снейра и филл совпадают по позиции, но никогда не звучат в одном такте).
const sigAudible = (p, cyc) =>
  p.queryArc(cyc, cyc + 1)
    .filter((h) => h.hasOnset() && Number(h.value.gain ?? 1) > 0.001)
    .map((h) => {
      const sName = h.value.s ?? h.value.note ?? h.value.n ?? '?';
      const variant = h.value.s && h.value.n !== undefined ? ':v' + h.value.n : '';
      const note = h.value.note ? ':' + h.value.note : '';
      return `${Math.round(Number(h.whole.begin) * 16 * 1e6) / 1e6}:${sName}${variant}${note}`;
    });

console.log(`\n${path.basename(file)}  — дорожек: ${pats.length}`);
pats.forEach((p, i) => {
  const a = sig(p, 0);
  const b = sig(p, 1);
  const flag = a.length !== b.length ? `   <-- такт 0 даёт ${a.length}, такт 1 даёт ${b.length}` : '';
  console.log(`\n#${i}${flag}`);
  console.log(`  такт 0: ${a.join(' ') || '(тишина)'}`);
  console.log(`  такт 1: ${b.join(' ') || '(тишина)'}`);
});

// один и тот же сэмпл в одной и той же позиции от РАЗНЫХ дорожек = наложение
console.log('\n── наложения по сэмплам (позиция:сэмпл → дорожки) ──');
const map = new Map();
pats.forEach((p, i) => {
  for (const s of sigAudible(p, 0)) {
    if (!map.has(s)) map.set(s, []);
    map.get(s).push(i);
  }
});
let any = false;
for (const [k, v] of [...map].sort()) {
  const tracks = [...new Set(v)];
  if (tracks.length > 1) { console.log(`  ${k} → дорожки ${tracks.join(', ')}`); any = true; }
}
if (!any) console.log('  нет');
