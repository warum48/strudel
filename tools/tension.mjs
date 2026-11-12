// ══════════════════════════════════════════════════════════════════
//  ГАРМОНИЧЕСКОЕ ТРЕНИЕ — тритоны и малые секунды
// ══════════════════════════════════════════════════════════════════
// Зачем: на слух «где-то шипит» находится плохо, а посчитать — быстро.
// Скрипт читает фразы прямо из файла трека и сравнивает каждую ноту:
//   1) с корнем такта          — тритон (6 полутонов) в любой октаве;
//   2) с нотами пэда такта     — тритон и малая секунда (1 полутон)
//                                В ОДНОЙ октаве (это уже грязь, а не краска).
//
// Что НЕ считается трением: малая нона (13 полутонов). В Cm9 живут и b3,
// и 9 — это аккордовая краска, а не ошибка. Поэтому она не флагуется.
//
// 9-я — СТИЛЬ, а не ошибка. Если 9-я (d в C) образует тритон с нотой пэда,
// чини УКЛАДКУ пэда или место ноты в фразе, но не выбрасывай 9-ю: она
// держит джазовый вкус. В 05 так и сделано — в такте eb из квартового пэда
// убран ab, и d5 осталась на месте.
//
// Режимы: суффикс `_A` в имени фразы = играет только с PAD_A,
// `_B` = только с PAD_B, всё остальное — с обоими (общие партии).
//
// Корни берутся из строки-маркера в треке:
//   // @roots c ab f bb eb g f ab
//
// Запуск: npm run tension -- tracks/techno/05-deep-dub.js
import fs from 'node:fs';
import path from 'node:path';

const file = process.argv[2] ?? 'tracks/techno/05-deep-dub.js';
const full = path.resolve(file);
if (!fs.existsSync(full)) {
  console.error(`нет файла: ${file}`);
  process.exit(2);
}
const src = fs.readFileSync(full, 'utf8');

const PC = { c: 0, db: 1, d: 2, eb: 3, e: 4, f: 5, gb: 6, g: 7, ab: 8, a: 9, bb: 10, b: 11 };
const pc = (n) => PC[n];
const midi = (n, o) => 12 * (Number(o) + 1) + pc(n);

// ── корни ────────────────────────────────────────────────────────
// Только до конца строки: иначе в маркер затягивает «c» из следующей
// строки кода (const …) и вся сетка корней съезжает на один такт.
const rootsLine = src.match(/@roots[^\S\n]+([^\n]+)/);
if (!rootsLine) {
  console.error('в треке нет маркера «// @roots c ab f bb …» — нечего сравнивать');
  process.exit(2);
}
const ROOTS = rootsLine[1].trim().split(/\s+/).filter((n) => n in PC);
if (!ROOTS.length) {
  console.error('маркер @roots пустой или с нотами вне словаря');
  process.exit(2);
}

// ── фразы ────────────────────────────────────────────────────────
// phrase([...]) — и с переносами, и в одну строку; берём все кавычки блока.
function phraseBars(name) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*phrase\\(\\[([\\s\\S]*?)\\]\\)`);
  const m = src.match(re);
  if (!m) return null;
  return [...m[1].matchAll(/'([^']*)'/g)].map((q) =>
    q[1].replace(/@[0-9.]+/g, '').replace(/\*\d+/g, ' '),
  );
}

const names = [...src.matchAll(/const\s+([A-Za-z_][\w]*)\s*=\s*phrase\(\[/g)].map((m) => m[1]);
if (!names.length) {
  console.error('в треке нет ни одной phrase([...])');
  process.exit(2);
}
if (!names.includes('PAD_A') || !names.includes('PAD_B')) {
  console.error('нужны PAD_A и PAD_B — иначе непонятно, с чем сравнивать');
  process.exit(2);
}

function notesIn(bar) {
  const out = [];
  for (const raw of bar.split(/[\s[\],]+/)) {
    const tok = raw.trim().toLowerCase();
    if (!tok || tok === '~') continue;
    const m = tok.match(/^([a-g](?:b|#)?)(-?\d+)?$/);
    if (m && m[1] in PC) out.push({ n: m[1], o: Number(m[2] ?? 4) });
  }
  return out;
}

const uniq = (arr) => {
  const seen = new Set();
  return arr.filter((x) => {
    const k = JSON.stringify(x);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

const PAD = { A: phraseBars('PAD_A'), B: phraseBars('PAD_B') };
const padNotes = (b, which) => notesIn(PAD[which][b % PAD[which].length]);

function modesOf(name) {
  if (name === 'PAD_A' || name.endsWith('_A')) return ['A'];
  if (name === 'PAD_B' || name.endsWith('_B')) return ['B'];
  return ['A', 'B'];
}

// ── проверка ─────────────────────────────────────────────────────
// Гоняем столько тактов, чтобы все фразы и корни прошли полный дрейф.
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const lcm = (a, b) => (a * b) / gcd(a, b);
const bars = names
  .filter((n) => n !== 'PAD_A' && n !== 'PAD_B')
  .map((n) => phraseBars(n).length)
  .reduce((acc, l) => lcm(acc, l), ROOTS.length);
const BARS = Math.min(bars, 240);

let problems = 0;
console.log(`корни: ${ROOTS.join(' ')}  (${ROOTS.length} такт.)`);
console.log(`проверяю ${BARS} тактов (полный дрейф всех фраз)\n`);

for (const name of names) {
  if (name === 'PAD_A' || name === 'PAD_B') continue;
  const barsOf = phraseBars(name);
  if (!barsOf) continue;
  const modes = modesOf(name);
  const hits = [];

  for (let b = 0; b < BARS; b++) {
    const root = ROOTS[b % ROOTS.length];
    for (const { n, o } of uniq(notesIn(barsOf[b % barsOf.length]))) {
      if (((pc(n) - pc(root) + 12) % 12) === 6) {
        hits.push(`  такт ${b + 1}: ${n}${o} — тритон к корню ${root}`);
      }
      for (const which of modes) {
        for (const p of uniq(padNotes(b, which))) {
          const d = Math.abs(midi(n, o) - midi(p.n, p.o));
          if (d % 12 === 6) {
            hits.push(`  такт ${b + 1}: ${n}${o} vs ${p.n}${p.o} — тритон (режим ${which})`);
          } else if (d === 1) {
            hits.push(`  такт ${b + 1}: ${n}${o} vs ${p.n}${p.o} — малая секунда (режим ${which})`);
          }
        }
      }
    }
  }

  const label = `${name} (${barsOf.length} такт., режим ${modes.join('+')})`;
  if (!hits.length) {
    console.log(`✓ ${label}`);
  } else {
    problems += hits.length;
    console.log(`✗ ${label}`);
    console.log(uniq(hits).slice(0, 12).join('\n'));
    if (uniq(hits).length > 12) console.log(`  … ещё ${uniq(hits).length - 12}`);
  }
}

console.log(problems ? `\nвсего мест с трением: ${problems}` : '\nтрения нет');
process.exit(problems ? 1 : 0);
