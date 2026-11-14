// ══════════════════════════════════════════════════════════════════
//  ЗВУЧИТ ЛИ ЧТО-ТО ПРИ НУЛЕВОЙ ГРОМКОСТИ
// ══════════════════════════════════════════════════════════════════
// Зачем: «слайдер в ноль, а звук остался» — это не характер, а баг в цепочке.
// Самый частый виновник — stut()/echo(): внутри они делают
// `pat.gain(pow(feedback, i))`, то есть ПЕРЕЗАПИСЫВАЮТ gain. Первая копия
// получает 1.0 мимо слайдера, и слой не глушится никогда.
//
// Тул гоняет трек дважды: как в файле и со ВСЕМИ слайдерами в нуле.
// Во втором проходе любая дорожка с gain > 0 — баг. Exit 1, если такие есть.
//
//   npm run gains
//   npm run gains -- tracks/techno/05-deep-dub.js
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import * as core from '@strudel/core';
import * as mini from '@strudel/mini';
import './viz-stub.mjs';

mini.miniAllStrings();

const root = process.cwd();
const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((e) => {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) return walk(p);
      return e.name.endsWith('.js') ? [p] : [];
    });
}

const files = args.length ? args : walk(path.join(root, 'tracks'));
if (!files.length) {
  console.error('нет файлов для проверки');
  process.exit(1);
}

function wrapLabels(src) {
  const lines = src.split('\n');
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
        if (next.trim() === '' && i + 1 < lines.length && lines[i + 1].startsWith('  ')) {
          block.push(next); i++; continue;
        }
        break;
      }
      out.push('P(' + block[0], ...block.slice(1), ');');
    } else { out.push(line); i++; }
  }
  return out.join('\n');
}

// имя дорожки: первый комментарий над блоком $:
function labelFor(lines, idx) {
  let i = idx - 1;
  while (i >= 0 && !lines[i].trim()) i--;
  while (i >= 0 && lines[i].trim().startsWith('//')) {
    const t = lines[i].trim();
    if (t.length > 3 && !/^[─═]/.test(t)) return t.replace(/^\/\/\s*/, '').slice(0, 56);
    i--;
  }
  return '(без имени)';
}

function findLabelLine(lines, n) {
  let seen = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('$: ')) {
      seen++;
      if (seen === n) return i;
    }
  }
  return 0;
}

function load(file, zeroVolumes) {
  let code = fs.readFileSync(file, 'utf8');
  // Глушим ТОЛЬКО громкости (*Vol). Если занулить всё подряд, вместе с ними
  // умрёт и вероятность стутера — и баг «stut затирает gain» спрячется.
  if (zeroVolumes) {
    // оба стиля: `const kickVol = slider(...)` (10, 11) и `vol: slider(...)`
    // в дереве instruments (12)
    code = code
      .replace(/const\s+(\w*[Vv]ol\w*)\s*=\s*slider\(\s*[^,\n]+/g, (m) =>
        m.replace(/slider\(\s*[^,\n]+/, 'slider(0'),
      )
      .replace(/\bvol:\s*slider\(\s*[^,\n]+/g, (m) => m.replace(/slider\(\s*[^,\n]+/, 'slider(0'));
  }
  const pats = [];
  const ctx = {
    ...core,
    ...mini,
    P: (p) => { pats.push(p); return p; },
    slider: (v) => core.signal(() => v),
    setcpm: () => {},
    setcps: () => {},
    console,
  };
  vm.createContext(ctx);
  vm.runInContext(wrapLabels(code), ctx, { filename: path.basename(file) });
  return { pats, lines: code.split('\n') };
}

const CYCLES = 16;
const maxGain = (p) => {
  let m = 0;
  for (let c = 0; c < CYCLES; c++) {
    for (const h of p.queryArc(c, c + 1)) {
      if (!h.hasOnset()) continue;
      const g = h.value.gain === undefined ? 1 : Number(h.value.gain);
      if (g > m) m = g;
    }
  }
  return m;
};

let bad = 0;
for (const file of files) {
  const rel = path.relative(root, file);
  let zero;
  try {
    zero = load(file, true);
  } catch (e) {
    console.log(`✗ ${rel} — не загрузился: ${e.message}`);
    bad++;
    continue;
  }
  const offenders = [];
  zero.pats.forEach((p, i) => {
    const g = maxGain(p);
    if (g > 0.001) {
      const name = labelFor(zero.lines, findLabelLine(zero.lines, i));
      offenders.push(`  #${i} gain=${g.toFixed(3)}  ${name}`);
    }
  });
  if (offenders.length) {
    bad += offenders.length;
    console.log(`✗ ${rel}`);
    console.log(offenders.join('\n'));
  } else {
    console.log(`✓ ${rel} — при всех нулях тихо (${zero.pats.length} дорожек)`);
  }
}

console.log(
  bad
    ? `\nзвучит при нуле: ${bad} — ищи stut()/echo()/gain() после gain()`
    : '\nвсе треки глушатся в ноль',
);
process.exit(bad ? 1 : 0);
