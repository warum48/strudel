// Живая проверка трека в настоящем strudel.cc: headless Chromium по CDP.
//
//   npm run live                              # последний трек серии (techno/03-dub-v2)
//   npm run live -- tracks/techno/02-dub.js
//   CHROME=/path/to/chrome npm run live       # если браузер лежит в другом месте
//
// Отвечает на два вопроса, на которые `npm run verify` ответить не может:
//   1. грузится ли файл в РЕДАКТОРЕ и появляется ли паттерн (реальный eval);
//   2. не врёт ли виджет слайдера — ползунок после скролла и текст кода.
//
// Второй пункт — баг самого strudel.cc, не наших треков. Разбор: docs/slider-bug.md.

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// pathname у URL кодирует пробелы (%20), а в пути есть «Local Docs» — берём fileURLToPath.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_TRACK = 'tracks/techno/03-dub-v2.js';
const PORT = 9333;

const CHROMES = [
  process.env.CHROME,
  '/Users/vadimrumyantsev/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
].filter(Boolean);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function launch(url) {
  const bin = CHROMES.find((p) => fs.existsSync(p));
  if (!bin) {
    console.log('✗ не нашёл браузер. Укажи путь: CHROME=/path/to/chrome npm run live');
    process.exit(1);
  }
  const proc = spawn(
    bin,
    [
      '--remote-debugging-port=' + PORT,
      '--user-data-dir=/tmp/chrome-prof-strudel',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-default-browser-check',
      '--autoplay-policy=no-user-gesture-required',
      '--window-size=1400,900',
      url,
    ],
    { stdio: 'ignore' },
  );

  let info;
  for (let i = 0; i < 80; i++) {
    try {
      const list = await (await fetch('http://127.0.0.1:' + PORT + '/json/list')).json();
      info = list.find((t) => t.type === 'page');
      if (info) break;
    } catch {}
    await sleep(250);
  }
  if (!info) throw new Error('chrome не поднялся');

  const ws = new WebSocket(info.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let id = 0;
  const waiting = new Map();
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && waiting.has(msg.id)) {
      const { res, rej } = waiting.get(msg.id);
      waiting.delete(msg.id);
      msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
    }
  };
  const send = (method, params = {}) =>
    new Promise((res, rej) => {
      const myId = ++id;
      waiting.set(myId, { res, rej });
      ws.send(JSON.stringify({ id: myId, method, params }));
    });

  await send('Page.enable');
  await send('Runtime.enable');

  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };

  // ws.close() не зовём: undici успевает получить кадр уже после закрытия и
  // падает из websocketMessageReceived — проверки к этому моменту напечатаны,
  // но процесс выходил с кодом 1, и зелёный прогон выглядел красным.
  // Убиваем браузер — сокет закроется сам, а process.exit() ниже завершит всё.
  const close = () => {
    try {
      ws.onmessage = null;
      ws.onerror = null;
      ws.onopen = null;
    } catch {}
    proc.kill('SIGKILL');
  };
  return { send, evaluate, close };
}

const file = process.argv[2] ?? DEFAULT_TRACK;
const abs = path.resolve(ROOT, file);
if (!fs.existsSync(abs)) {
  console.log('✗ нет файла: ' + file);
  process.exit(1);
}
const code = fs.readFileSync(abs, 'utf8');

console.log(`== ${file} (${code.length} символов) ==`);

const b = await launch('https://strudel.cc/');
const kill = setTimeout(() => { console.log('✗ таймаут'); b.close(); process.exit(2); }, 150000);

let failed = false;
try {
  for (let i = 0; i < 80; i++) {
    if (await b.evaluate(`!!(window.strudelMirror && document.querySelector('.cm-content'))`)) break;
    await sleep(250);
  }

  await b.evaluate(`(() => {
    const m = window.strudelMirror;
    m.editor.dispatch({ changes: { from: 0, to: m.editor.state.doc.length, insert: ${JSON.stringify(code)} } });
    return m.editor.state.doc.length;
  })()`);
  await sleep(400);

  // Реальный жест мышью: без него не поднимается audio context, а evaluate()
  // в headless не резолвится вообще. Ждать его нельзя — только fire and forget.
  await b.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 700, y: 400, button: 'left', clickCount: 1 });
  await b.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 700, y: 400, button: 'left', clickCount: 1 });
  await sleep(500);
  await b.send('Runtime.evaluate', { expression: `window.strudelMirror.evaluate()`, awaitPromise: false, userGesture: true });
  await sleep(4000);

  const st = JSON.parse(await b.evaluate(`(() => {
    const m = window.strudelMirror;
    return JSON.stringify({
      sliderCfgs: (m.widgets || []).filter(w => w.type === 'slider').length,
      dom: document.querySelectorAll('.cm-slider input').length,
      hasPattern: !!m.repl?.scheduler?.pattern,
      err: m.repl?.state?.evalError ? (m.repl.state.evalError.message + ' @ line ' + (m.repl.state.evalError.loc?.line ?? '?')) : null,
    });
  })()`));

  console.log(`  eval:        ${st.err ? '✗ ' + st.err : 'ок'}`);
  console.log(`  паттерн:     ${st.hasPattern ? 'играет' : '✗ НЕ играет'}`);
  console.log(`  слайдеров:   ${st.sliderCfgs} в конфиге, ${st.dom} видно сразу (остальные за вьюпортом)`);
  if (st.err || !st.hasPattern) failed = true;

  // Виджет слайдера: переживает ли значение скролл и не портит ли драг текст.
  // CodeMirror рендерит только то, что во вьюпорте, а шапка трека бывает длинной —
  // поэтому сначала доскролливаем до первого слайдера, а не ждём его наверху.
  const pick = await findSlider(b);
  if (pick) {
    // 64px = штатная ширина виджета; больше — значит CSS из трека применился
    console.log(`  ширина:      ${pick.w}px${pick.w > 64 ? ' (расширен из трека)' : ' (штатная)'}`);

    const target = String(Math.min(Number(pick.max), Number(pick.ov || 0) + Number(pick.step || 0.01) * 55));
    const drag = (val) =>
      b.evaluate(`(() => {
        const el = [...document.querySelectorAll('.cm-slider input')].find(e => e.from === ${pick.from});
        if (!el) return null;
        el.value = ${JSON.stringify(val)};
        el.dispatchEvent(new Event('input', { bubbles: true }));
        return el.value;
      })()`);
    const slice = (from, len) => b.evaluate(`window.strudelMirror.editor.state.doc.sliceString(${from}, ${from + len})`);
    const thumbAt = (from) =>
      b.evaluate(`(() => {
        const el = [...document.querySelectorAll('.cm-slider input')].find(e => e.from === ${from});
        return el ? el.value : null;
      })()`);

    await drag(target);
    await sleep(400);
    const inCode = await slice(pick.from, String(target).length);

    // уехать из вьюпорта и вернуться ровно туда, где слайдер снова отрендерится
    await b.evaluate(`(() => { const s = document.querySelector('.cm-scroller'); s.scrollTop = Math.min(s.scrollHeight, ${pick.scrollTop} + 4000); })()`);
    await sleep(600);
    await b.evaluate(`(() => { const s = document.querySelector('.cm-scroller'); s.scrollTop = ${pick.scrollTop}; })()`);
    await sleep(700);

    const thumb = await thumbAt(pick.from);

    const ok = inCode === String(target) && thumb === String(target);
    console.log(`  слайдер:     драг ${pick.ov} → ${target}; в коде "${inCode}", ползунок "${thumb}" ${ok ? 'ок' : '← РАССИНХРОН'}`);
    if (!ok) {
      console.log('               это баг strudel.cc (docs/slider-bug.md):');
      console.log('               перед драгом жми Ctrl+Enter, не скроллить во время игры');
    }
  } else {
    console.log('  слайдер:     ✗ ни один не отрендерился ни в одной позиции скролла');
    failed = true;
  }
} finally {
  clearTimeout(kill);
  b.close();
}

process.exit(failed ? 1 : 0);

// Доскроллить до первого слайдера и вернуть его параметры вместе с scrollTop,
// на котором он виден (нужно, чтобы вернуться в ту же точку после ухода).
async function findSlider(b) {
  const st = await b.evaluate(`(() => {
    const s = document.querySelector('.cm-scroller');
    return JSON.stringify({ h: s.scrollHeight, vh: s.clientHeight });
  })()`);
  const { h, vh } = JSON.parse(st);
  const step = Math.max(200, Math.round(vh * 0.7));
  for (let top = 0; top <= h; top += step) {
    await b.evaluate(`document.querySelector('.cm-scroller').scrollTop = ${top}`);
    await sleep(220);
    const found = await b.evaluate(`(() => {
      const els = [...document.querySelectorAll('.cm-slider input')];
      if (!els.length) return null;
      const el = els.find(e => Number(e.max) >= 1 && Number(e.step) < 1) || els[0];
      return JSON.stringify({
        ov: el.originalValue, from: el.from, min: el.min, max: el.max, step: el.step,
        w: Math.round(el.getBoundingClientRect().width),
        scrollTop: document.querySelector('.cm-scroller').scrollTop,
      });
    })()`);
    if (found) return JSON.parse(found);
  }
  return null;
}
