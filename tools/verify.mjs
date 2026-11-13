// Проверка трека без браузера и без звука: прогоняет паттерны через настоящий
// движок Strudel и печатает, что реально попадает в сетку 1/16.
//
//   npm run verify                      — все файлы в tracks/
//   npm run verify -- tracks/foo.js     — один файл
//
// Ловит: опечатки в мини-нотации, несуществующие функции/контролы,
// пустые дорожки, кривые вероятности. Не ловит: как это звучит.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import * as core from '@strudel/core';
import * as mini from '@strudel/mini';

mini.miniAllStrings(); // без этого строки не парсятся как мини-нотация

const root = process.cwd();
const tracksDir = path.join(root, 'tracks');

const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));

// треки лежат и в tracks/, и в подпапках (tracks/techno/…)
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

const files = args.length ? args : walk(tracksDir);

if (!files.length) {
  console.error('Нет файлов для проверки');
  process.exit(1);
}

// $: pattern  →  P(pattern)   (в REPL это регистрация дорожки, тут — просто вызов)
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
        if (next.startsWith('  ')) {
          block.push(next);
          i++;
          continue;
        }
        if (next.trim() === '' && i + 1 < lines.length && lines[i + 1].startsWith('  ')) {
          block.push(next);
          i++;
          continue;
        }
        break;
      }
      out.push('P(' + block[0], ...block.slice(1), ');');
    } else {
      out.push(line);
      i++;
    }
  }
  return out.join('\n');
}

// имя дорожки = первый содержательный комментарий из блока сверху
function labelFor(lines, idx) {
  let i = idx - 1;
  const isComment = (t) => t.startsWith('//');
  while (i >= 0 && !lines[i].trim()) i--;
  // Между комментарием и дорожкой часто стоит объявление фразы
  // (const PAD = phrase([ … ])) — перепрыгиваем его, иначе имя теряется.
  if (i >= 0 && !isComment(lines[i].trim())) {
    while (i >= 0 && !/^const\s+\w+\s*=\s*phrase\(/.test(lines[i].trim())) i--;
    if (i >= 0) {
      i--;
      while (i >= 0 && !lines[i].trim()) i--;
    }
  }
  const block = [];
  while (i >= 0 && lines[i].trim().startsWith('//')) {
    block.unshift(lines[i].trim());
    i--;
  }
  const isRule = (t) => /^\/\/\s*[─═━=]{3,}\s*$/.test(t);
  const first = block.find((t) => !isRule(t));
  if (!first) return '';
  return first
    .replace(/^\/\/\s*/, '')
    .replace(/[─═━=]{3,}/g, '')
    .trim()
    .slice(0, 62);
}

// Ловим строки мини-нотации, лежащие в переменных.
// Транспайлер REPL оборачивает в m() только строковые ЛИТЕРАЛЫ; строку в
// переменной он не видит, и note(BASS) получает одну «ноту» из всего текста
// фразы — то есть дорожка молчит. В node miniAllStrings() это маскирует,
// поэтому проверяем статически.
function lintStringVars(code) {
  const decls = [...code.matchAll(/^const\s+(\w+)\s*=\s*(['"])(.*?)\2\s*$/gm)];
  return decls
    .map(([, name]) => name)
    .filter((name) => (code.match(new RegExp('\\b' + name + '\\b', 'g')) || []).length > 1);
}

// Ловим слайдеры, которые в браузере ведут себя не так, как в node:
//  - первый аргумент не числовой литерал → у виджета нет raw-значения,
//    он откатывается к тексту кода и «уходит в ноль»;
//  - слайдер объявлен, но нигде не читается → мёртвая ручка в пульте.
function lintSliders(code) {
  const decls = [...code.matchAll(/^const\s+(\w+)\s*=\s*slider\(([^,\n]*)/gm)];
  const nonLiteral = decls
    .filter(([, , first]) => !/^\s*-?\d+(?:\.\d+)?\s*$/.test(first))
    .map(([, name, first]) => `${name}(${first.trim()})`);
  const unused = decls
    .map(([, name]) => name)
    .filter((name) => (code.match(new RegExp('\\b' + name + '\\b', 'g')) || []).length < 2);
  return { count: decls.length, nonLiteral, unused };
}

// stut()/echo() внутри делают `pat.gain(pow(feedback, i))`, то есть
// ПЕРЕЗАПИСЫВАЮТ gain, а не умножают. Если gain выставлен раньше в цепочке,
// слайдер громкости перестаёт работать: первая копия всегда идёт на 1.0,
// остальные на 0.55/0.30/0.17 — мимо ручки. Отсюда «громкость в ноль,
// а щелчки слышно». echoWith с withValue — это как раз лечение, его не трогаем.
function lintStutAfterGain(code) {
  return code
    .split(/^\$: /m)
    .slice(1)
    .filter((block) => {
      const gainAt = block.lastIndexOf('.gain(');
      const stutAt = block.search(/\.(stut|echo)\(/);
      return gainAt >= 0 && stutAt >= 0 && stutAt > gainAt;
    })
    .map((block) => block.split('\n')[0].trim().slice(0, 46));
}

function run(file) {
  const code = fs.readFileSync(file, 'utf8');
  const lines = code.split('\n');
  const pats = [];
  const ctx = {
    ...core,
    ...mini,
    P: (p) => {
      pats.push(p);
      return p;
    },
    slider: (v) => core.signal(() => v), // как в REPL: живой непрерывный сигнал
    setcpm: () => {},
    setcps: () => {},
    console,
  };
  vm.createContext(ctx);
  vm.runInContext(wrapLabels(code), ctx, { filename: path.basename(file) });
  return { pats, lines, code };
}

const g16 = (h) => Math.round(Number(h.whole.begin) * 16 * 1e6) / 1e6;

let failed = false;
for (const file of files) {
  const rel = path.relative(root, file);
  console.log(`\n── ${rel} ${'─'.repeat(Math.max(0, 58 - rel.length))}`);
  let res;
  try {
    res = run(file);
  } catch (e) {
    failed = true;
    console.log(`  ✗ ОШИБКА: ${e.message}`);
    continue;
  }
  if (!res.pats.length) {
    console.log('  ✗ нет ни одной дорожки ($:)');
    failed = true;
    continue;
  }

  let total = 0;
  const hitMap = new Map(); // "позиция:сэмпл" → какие дорожки туда попали
  res.pats.forEach((p, i) => {
    const onsets = p.queryArc(0, 1).filter((h) => h.hasOnset());
    total += onsets.length;
    // позиция в файле этого $: — чтобы подписать дорожку
    const name = labelFor(res.lines, findLabelLine(res.lines, i));
    const grid = onsets
      .map((h) => `${g16(h)}:${h.value.s ?? h.value.note ?? h.value.n ?? '?'}`)
      .join(' ');
    // «Тишина» проверяется по ВОСЬМИ тактам, а не по первому. Дорожка, которая
    // входит позже (ответ на 3-м такте, импakt раз в 8 тактов), в первом такте
    // молчит по замыслу — раньше это давало ложное ⚠. Сетка в отчёте всё равно
    // по первому такту: иначе строка на 8 тактов нечитаема.
    let late = null;
    if (!onsets.length) {
      const wide = p.queryArc(0, 8).filter((h) => h.hasOnset());
      if (wide.length) late = wide[0];
    }
    const mark = onsets.length || late ? ' ' : '⚠';
    console.log(`  ${mark} #${i} ${name}`);
    const lateNote = late
      ? `— в 1-м такте пусто, входит на такте ${Math.floor(Number(late.whole.begin)) + 1}`
      : '(тишина)';
    console.log(`       ${grid || lateNote}`);
    for (const h of onsets) {
      // событие с gain = 0 не звучит: это выключенная ветка режима или
      // заглушённый гейтом филл. Считать его ударом — значит ловить
      // фантомные коллизии (в 06 призрак снейра и филл совпадают по позиции,
      // но никогда не звучат в одном такте).
      if (Number(h.value.gain ?? 1) <= 0.001) continue;
      // ключ = позиция + сэмпл + вариант сэмпла + нота: два разных синуса
      // в разных октавах — это не дубль, а два разных звука, и hh:2 — это
      // другой сэмпл, а не тот же самый хэт
      const sName = h.value.s ?? h.value.note ?? h.value.n ?? '?';
      const variant = h.value.s && h.value.n !== undefined ? ':v' + h.value.n : '';
      const key = `${g16(h)}:${sName}${variant}${h.value.note ? ':' + h.value.note : ''}`;
      if (!hitMap.has(key)) hitMap.set(key, new Set());
      hitMap.get(key).add(i);
    }
  });
  console.log(`  итого ${res.pats.length} дорожек, ${total} ударов за такт`);

  // Один сэмпл в одной и той же позиции от РАЗНЫХ дорожек — это слышно как
  // удар дважды (так в 01-berlin бочка и румбл обе били bd в 0, 4, 8, 12).
  const clashes = [...hitMap].filter(([, set]) => set.size > 1);
  if (clashes.length) {
    const list = clashes
      .slice(0, 5)
      .map(([key, set]) => `${key} (#${[...set].join(', #')})`)
      .join(', ');
    console.log(`  ⚠ один сэмпл в одной позиции от разных дорожек: ${list}`);
  }

  const sl = lintSliders(res.code);
  console.log(`  слайдеров: ${sl.count}`);
  if (sl.nonLiteral.length) {
    // это не косметика: такой слайдер в браузере откатывается в ноль
    failed = true;
    console.log(`  ✗ первый аргумент не число: ${sl.nonLiteral.join(', ')} — в браузере такой слайдер откатывается`);
  }
  if (sl.unused.length) {
    console.log(`  ⚠ объявлены и не используются: ${sl.unused.join(', ')}`);
  }

  const strVars = lintStringVars(res.code);
  if (strVars.length) {
    // тоже поломка, а не стиль: в браузере эта дорожка молчит
    failed = true;
    console.log(`  ✗ строки в переменных без m(): ${strVars.join(', ')} — в браузере это тишина`);
  }

  const stut = lintStutAfterGain(res.code);
  if (stut.length) {
    console.log(`  ⚠ stut/echo после gain затирает громкость: ${stut.join(' | ')}`);
    console.log('     первая копия стутера играет на 1.0 мимо слайдера — см. tools/gains.mjs');
  }
}

// сопоставление индекса дорожки с номером строки в файле
function findLabelLine(lines, n) {
  let count = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('$: ')) {
      count++;
      if (count === n) return i;
    }
  }
  return 0;
}

process.exit(failed ? 1 : 0);
