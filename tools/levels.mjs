// Быстрая проверка баланса: сколько «энергии» даёт каждая дорожка за такт.
// energy ≈ Σ (gain × unison) по событиям; это не LUFS, но ловит «лид в 2 раза
// тише пэда» и случайные перекосы. Запуск: node tools/levels.mjs <file> [bar]
import fs from 'node:fs';
import vm from 'node:vm';
import * as core from '@strudel/core';
import * as mini from '@strudel/mini';
import './viz-stub.mjs';
mini.miniAllStrings();

const file = process.argv[2];
const bar = Number(process.argv[3] ?? 34);
if (!file) { console.error('usage: node tools/levels.mjs <file> [bar]'); process.exit(1); }

function wrapLabels(code) {
  const lines = code.split('\n');
  const out = [];
  const labels = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('$: ')) {
      const label = line.slice(3).trim().slice(0, 64);
      const block = [line.slice(3)];
      i++;
      while (i < lines.length) {
        const n = lines[i];
        if (n.startsWith('  ')) { block.push(n); i++; continue; }
        if (n.trim() === '' && i + 1 < lines.length && lines[i + 1].startsWith('  ')) { block.push(n); i++; continue; }
        break;
      }
      labels.push(label);
      out.push('P(' + block[0], ...block.slice(1), ');');
    } else { out.push(line); i++; }
  }
  return { code: out.join('\n'), labels };
}

const { code, labels } = wrapLabels(fs.readFileSync(file, 'utf8'));
const pats = [];
const ctx = {
  ...core, ...mini,
  P: (p) => { pats.push(p); return p; },
  slider: (v) => core.signal(() => v),
  setcpm: () => {}, setcps: () => {}, console,
};
vm.createContext(ctx);
vm.runInContext(code, ctx);

const sample = (x, t) => {
  if (typeof x === 'number') return x;
  if (x && typeof x.queryArc === 'function') return x.queryArc(t, t + 0.0001)[0]?.value ?? 1;
  return Number(x) || 1;
};
const rows = pats.map((p, i) => {
  let energy = 0;
  let events = 0;
  for (const h of p.queryArc(bar, bar + 1)) {
    const v = h.value;
    if (!v || typeof v !== 'object') continue;
    const t = h.whole.begin.valueOf();
    const g = v.gain == null ? 1 : sample(v.gain, t);
    if (typeof g !== 'number' || !isFinite(g)) continue;
    const u = v.unison == null ? 1 : sample(v.unison, t);
    energy += g * u;
    events++;
  }
  return { label: labels[i] ?? `lane ${i + 1}`, energy, events };
});
rows.sort((a, b) => b.energy - a.energy);
const top = rows[0]?.energy || 1;
for (const r of rows) {
  const pct = Math.round((r.energy / top) * 100);
  console.log(`${String(pct).padStart(3)}%  ${r.energy.toFixed(2).padStart(6)}  ` +
    `${String(r.events).padStart(2)} ev  ${r.label}`);
}
const waste = rows.filter((r) => r.events > 0 && r.energy < 0.0001);
if (waste.length) {
  console.log(`\n⚠ ${waste.length} дорожек строят события при нулевой громкости:`);
  for (const r of waste) console.log(`   ${r.events} ev  ${r.label}`);
  console.log('   → добавь .mask(gateOf(\'lane\')) / паттерн-гейт, а не только gain 0');
}
