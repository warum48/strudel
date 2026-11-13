// Панель + НАСТОЯЩИЙ редактор. Слева ручки и эквалайзер, справа тот же
// CodeMirror, что на strudel.cc — с виджетами-ползунками, подсветкой и Ctrl+Enter.
//
// Как это устроено (и почему именно так):
//
// 1. РЕДАКТОР — это `@strudel/codemirror` (StrudelMirror), тот самый пакет,
//    из которого собран strudel.cc. Он сам строит repl, сам рисует виджеты и
//    сам делает eval. Своей копии кода у панели нет: она смотрит в тот же
//    документ, что и редактор.
//
// 2. РУЧКИ — не отдельные сигналы, а ПУЛЬТ от настоящих ползунков. Двигаешь
//    ручку слева → панель делает ровно то же, что делает виджет под пальцем:
//    меняет число в документе и шлёт `postMessage {type:'cm-slider', id, value}`.
//    Отсюда два следствия: звук меняется сразу (без перезапуска) и код справа
//    не врёт — в нём стоит то же число, что на ручке.
//
// 3. sliderWithID — СВОЙ. Транспайлер превращает `slider(...)` в
//    `sliderWithID(id, value, min, max)`. Штатный живёт в @strudel/codemirror и
//    возвращает `ref` из другого инстанса @strudel/core (esm.sh грузит пакеты
//    раздельно) — паттерн такой ref не понимает и звук умирает с
//    «t is not a function» / «is not a function». Поэтому берём `ref` из того же
//    core, что и паттерн, а значения храним сами.
//
// 4. ЭКВАЛАЙЗЕР — настоящие BiquadFilter на мастере: выход движка
//    (`output.destinationGain`) отцепляется от колонок и заводится на нашу цепь
//    низ → середина → верх → мастер-гейн → анализатор → колонки. Поэтому EQ
//    слышен сразу, он не в паттерне, он после движка.

const EXT =
  '?external=@strudel/core,@strudel/mini,@strudel/tonal,@strudel/webaudio,@strudel/transpiler,@strudel/draw';

const cm = await import('https://esm.sh/@strudel/codemirror@1.3.0' + EXT);
const core = await import('https://esm.sh/@strudel/core@1.2.6');
const mini = await import('https://esm.sh/@strudel/mini@1.2.6');
const tonal = await import('https://esm.sh/@strudel/tonal@1.2.6');
const wa = await import('https://esm.sh/@strudel/webaudio@1.3.0');
const draw = await import('https://esm.sh/@strudel/draw@1.2.6');
const { transpiler } = await import('https://esm.sh/@strudel/transpiler@1.2.6');

const TRACK = '/tracks/techno/11-slowtrap-v2.js';

const $ = (id) => document.getElementById(id);
const statusEl = $('status');
const setStatus = (t, err) => {
  statusEl.textContent = t;
  statusEl.className = err ? 'err' : '';
};

// ── 1. мост между ручками и виджетами ─────────────────────────────
const values = {}; // id → значение, из него читает сигнал паттерна

const sliderWithID = (id, value) => {
  values[id] = value;
  if (cm.sliderValues) cm.sliderValues[id] = value; // чтобы чужой слушатель не ругался
  return core.ref(() => values[id]);
};
const slider = (value) => core.pure(value);

// виджет шлёт сюда, когда его тянут мышкой в редакторе
window.addEventListener('message', (e) => {
  const d = e.data;
  if (!d || d.type !== 'cm-slider') return;
  if (values[d.id] === undefined) return;
  values[d.id] = d.value;
  const ui = knobByAnchor.get(d.id);
  if (ui) {
    ui.input.value = d.value;
    ui.out.textContent = fmt(d.value);
  }
});

// ── 2. мастер-цепь: EQ + анализатор ───────────────────────────────
let ctx;
let masterGain;
let analyser;
let eq = null;

function buildMasterChain() {
  ctx = wa.getAudioContext();
  const out = wa.getSuperdoughAudioController().output;

  const eqIn = new GainNode(ctx, { gain: 1 });
  const low = new BiquadFilterNode(ctx, { type: 'lowshelf', frequency: 120, gain: 0 });
  const mid = new BiquadFilterNode(ctx, { type: 'peaking', frequency: 900, Q: 0.9, gain: 0 });
  const high = new BiquadFilterNode(ctx, { type: 'highshelf', frequency: 5000, gain: 0 });
  masterGain = new GainNode(ctx, { gain: 0.9 });
  analyser = new AnalyserNode(ctx, { fftSize: 2048, smoothingTimeConstant: 0.75 });

  eqIn.connect(low);
  low.connect(mid);
  mid.connect(high);
  high.connect(masterGain);
  masterGain.connect(analyser);
  analyser.connect(ctx.destination);

  // звук движка → наша цепь (до этого destinationGain шёл прямо в колонки)
  out.destinationGain.disconnect();
  out.destinationGain.connect(eqIn);

  eq = { low, mid, high };
  globalThis.__panel = { ctx, eq, masterGain, analyser, get knobs() { return knobs; } };
  bindEq();
}

function bindEq() {
  const bands = [
    ['eqLow', 'eqLowV', 'low'],
    ['eqMid', 'eqMidV', 'mid'],
    ['eqHigh', 'eqHighV', 'high'],
  ];
  for (const [id, vid, key] of bands) {
    const input = $(id);
    const out = $(vid);
    const apply = () => {
      const db = Number(input.value);
      if (eq) eq[key].gain.setTargetAtTime(db, ctx.currentTime, 0.02);
      out.textContent = `${db.toFixed(1)} dB`;
    };
    input.addEventListener('input', apply);
    apply();
  }

  const m = $('master');
  const mv = $('masterV');
  const applyMaster = () => {
    const g = Number(m.value);
    if (masterGain) masterGain.gain.setTargetAtTime(g, ctx.currentTime, 0.02);
    mv.textContent = g.toFixed(2);
  };
  m.addEventListener('input', applyMaster);
  applyMaster();
}

// ── 3. спектр ─────────────────────────────────────────────────────
function drawSpectrum() {
  const cv = $('scope');
  const g = cv.getContext('2d');
  const w = cv.width;
  const h = cv.height;
  g.clearRect(0, 0, w, h);
  g.fillStyle = '#0a0c09';
  g.fillRect(0, 0, w, h);
  if (!analyser) {
    requestAnimationFrame(drawSpectrum);
    return;
  }

  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);

  const nyquist = ctx.sampleRate / 2;
  const bins = data.length;
  const bars = 96;
  for (let i = 0; i < bars; i++) {
    const f0 = 20 * Math.pow(1000, i / bars); // 20 → 20000 Гц
    const f1 = 20 * Math.pow(1000, (i + 1) / bars);
    const b0 = Math.floor((f0 / nyquist) * bins);
    const b1 = Math.max(b0 + 1, Math.floor((f1 / nyquist) * bins));
    let v = 0;
    for (let b = b0; b < b1 && b < bins; b++) v = Math.max(v, data[b]);
    const bh = (v / 255) * (h - 6);
    const x = (i / bars) * w;
    const bw = w / bars - 1.5;
    g.fillStyle = i < 24 ? '#b3d80d' : i < 60 ? '#8fb90c' : '#5c7a08';
    g.fillRect(x, h - bh, bw, bh);
  }
  g.strokeStyle = '#1d211a';
  g.beginPath();
  g.moveTo(0, h - 0.5);
  g.lineTo(w, h - 0.5);
  g.stroke();
  requestAnimationFrame(drawSpectrum);
}

// ── 4. ручки из виджетов ──────────────────────────────────────────
// Имена ручек нигде не перечислены руками: панель берёт их из виджетов, а группу
// получает, отрезав хвост-суффикс (`kickVol` → `kick`). Поэтому новый слайдер в
// треке появляется в панели сам — достаточно, чтобы его имя кончалось на один из
// суффиксов ниже. Не кончилось — ручка всё равно будет, но отдельной группой
// (так когда-то вылез `kickDist` рядом с «БОЧКОЙ»), поэтому список суффиксов
// держим полным, а не минимальным.
const SUFFIX = [
  'Feedback', 'Chorus', 'Vowel', 'Glide', 'Shape', 'Drive', 'Dist', 'Decay',
  'Delay', 'Crush', 'Bend', 'Speed', 'Depth', 'Phase', 'Pitch', 'Size', 'Time',
  'Tune', 'Body', 'Drop', 'Rate', 'Mix', 'Echo', 'Hpf', 'Cut', 'Res', 'Env',
  'Lfo', 'Det', 'Send', 'Level', 'Wet', 'Width', 'Accent', 'Spread', 'Freq',
  'Vol', 'Q',
];

const LABEL = {
  kick: 'БОЧКА', body: 'ТЕЛО БОЧКИ', eight: '808', acid: 'ЭЙСИД', ghost: 'ЭЙСИД-ОТВЕТ',
  reese: 'РИЗ', chip: '8-БИТ', chip2: '8-БИТ БЛИП', ladder: 'ЛЕСТНИЦА', stat: 'СТАТТЕР',
  mel: 'МЕЛОДИЯ', voc: 'ВОКОДЕР', pad: 'ПЭД', stab: 'СТАБ', snare: 'СНЕЙР', clap: 'КЛЭП',
  hat: 'ХЭТЫ', ohat: 'ОТКРЫТЫЕ ХЭТЫ', rim: 'RIM', shaker: 'ШЕЙКЕР', tick: 'ТИКИ',
  crash: 'ТАРЕЛКА', riser: 'РАЙЗЕР', swell: 'СВЕЛЛ', impact: 'ИМПАКТ', blip: 'БЛИПЫ',
  grit: 'ПЫЛЬ', tape: 'ЛЕНТА', air: 'ВОЗДУХ', drone: 'ДРОН', vinyl: 'ПЕСОК',
  verb: 'РЕВЕРБ', duck: 'САЙДЧЕЙН', mode: 'РЕЖИМ', harmony: 'ГАРМОНИЯ',
};

const ORDER = [
  'mode', 'harmony', 'kick', 'body', 'eight', 'reese', 'acid', 'ghost', 'snare',
  'clap', 'hat', 'ohat', 'rim', 'shaker', 'tick', 'crash', 'chip', 'chip2',
  'ladder', 'stat', 'mel', 'voc', 'pad', 'stab', 'blip', 'grit', 'tape',
  'riser', 'swell', 'impact', 'air', 'drone', 'vinyl', 'verb', 'duck',
];

const groupOf = (name) => {
  for (const s of SUFFIX) {
    if (name.length > s.length && name.endsWith(s)) return name.slice(0, -s.length);
  }
  return name;
};

const rank = (name) => (name.endsWith('Vol') ? 0 : name.endsWith('Cut') ? 1 : 2);
const fmt = (x) => {
  const n = Number(x);
  return Math.abs(n) >= 100 ? String(Math.round(n)) : String(Number(n.toFixed(3)));
};

let knobs = []; // { name, anchor, min, max, step, value }
const knobByAnchor = new Map(); // id виджета → { input, out }

function buildKnobs() {
  const doc = mirror.editor.state.doc;
  knobs = [];
  for (const w of mirror.widgets) {
    if (w.type !== 'slider') continue;
    // виджет стоит ровно на числе, поэтому имя ищем слева от него
    const before = doc.sliceString(Math.max(0, w.from - 90), w.from);
    const m = /const\s+(\w+)\s*=\s*slider\(\s*$/.exec(before);
    knobs.push({
      name: m ? m[1] : `slider_${w.from}`,
      anchor: w.from, // id, который транспортёр выдал при eval
      min: w.min,
      max: w.max,
      step: w.step,
      value: Number(w.value),
    });
  }
  renderKnobs();
}

function renderKnobs() {
  const groups = new Map();
  for (const k of knobs) {
    const g = groupOf(k.name);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(k);
  }

  const keys = [...groups.keys()].sort((a, b) => {
    const ia = ORDER.indexOf(a);
    const ib = ORDER.indexOf(b);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    return a.localeCompare(b);
  });

  const root = $('knobs');
  root.innerHTML = '';
  knobByAnchor.clear();

  for (const g of keys) {
    const items = groups.get(g).sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name));
    const box = document.createElement('section');
    box.className = 'group';
    const h = document.createElement('h3');
    h.textContent = LABEL[g] ?? g.toUpperCase();
    box.appendChild(h);
    const rows = document.createElement('div');
    rows.className = 'rows';

    // громкость и срез — одной колонкой, срез ровно под громкостью:
    // та же привычка, что в коде трека
    const done = new Set();
    for (const k of items) {
      if (done.has(k.name)) continue;
      done.add(k.name);
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.appendChild(makeRow(k));
      if (k.name.endsWith('Vol')) {
        const cut = items.find((x) => x.name === k.name.slice(0, -3) + 'Cut');
        if (cut) {
          done.add(cut.name);
          cell.appendChild(makeRow(cut));
        }
      }
      rows.appendChild(cell);
    }
    box.appendChild(rows);
    root.appendChild(box);
  }
}

function makeRow(k) {
  const row = document.createElement('div');
  row.className = 'row' + (k.name.endsWith('Vol') ? ' is-vol' : '') + (k.name.endsWith('Cut') ? ' is-cut' : '');
  const label = document.createElement('label');
  label.textContent = k.name;
  label.title = k.name;
  const input = document.createElement('input');
  input.type = 'range';
  input.min = k.min;
  input.max = k.max;
  input.step = k.step ?? (k.max - k.min) / 1000;
  input.value = k.value;
  const out = document.createElement('span');
  out.className = 'v';
  out.textContent = fmt(k.value);
  input.addEventListener('input', () => {
    const v = Number(input.value);
    out.textContent = fmt(v);
    setKnob(k, v);
  });
  row.append(label, input, out);
  knobByAnchor.set('slider_' + k.anchor, { input, out });
  return row;
}

// Ручка = тот же драг, что мышкой по виджету: число в документ + сообщение
// движку. Позицию числа ищем в ТЕКУЩЕМ документе — после правки числа всё,
// что справа, сдвигается, и запомненный `from` устаревает.
function setKnob(k, v) {
  const text = mirror.editor.state.doc.toString();
  const re = new RegExp('const\\s+' + k.name + '\\s*=\\s*slider\\(\\s*(-?\\d+(?:\\.\\d+)?)');
  const m = re.exec(text);
  if (m) {
    const numFrom = m.index + m[0].length - m[1].length;
    mirror.editor.dispatch({
      changes: { from: numFrom, to: numFrom + m[1].length, insert: fmt(v) },
    });
  }
  window.postMessage({ type: 'cm-slider', id: 'slider_' + k.anchor, value: Number(v) }, '*');
}

// ── 5. редактор и запуск ──────────────────────────────────────────
let mirror;
let code = '';
let playing = false;

// ЛОВУШКА @strudel/draw. `getDrawContext()` без аргументов ищет
// canvas#test-canvas, не находит и СОЗДАЁТ его сам — position:fixed, во весь
// экран, и вставляет первым в body. Причём создаёт его не мы: `StrudelMirror`
// на каждом eval зовёт `cleanupDraw()`, а тот внутри делает ровно это. Сам по
// себе canvas прозрачный (cleanupDraw только чистит его), но в CSS панели
// правило `canvas { background: … }` красило и его тоже — и тогда он ложился
// чёрным поверх шапки и левой панели (они static, а canvas в positioned-слое).
// Снаружи это выглядело как «страница чёрная, видно только код», хотя
// getBoundingClientRect и elementFromPoint показывали идеальную геометрию.
// Отсюда два правила: CSS красит только `#scope`, и свой draw-canvas у нас
// маленький и спрятанный, а не во весь экран.
function makeDrawCanvas() {
  const c = document.createElement('canvas');
  c.id = 'panel-draw';
  c.width = 2;
  c.height = 2;
  c.style.display = 'none';
  document.body.appendChild(c);
  return c;
}

async function boot() {
  setStatus('загрузка движка…');
  const audioReady = wa.initAudioOnFirstClick();
  mini.miniAllStrings();

  setStatus('читаю трек…');
  const res = await fetch(TRACK);
  if (!res.ok) throw new Error(`${TRACK}: ${res.status}`);
  code = await res.text();

  // как в strudel.cc loadModules(): всё, что должно быть видно в eval
  await core.evalScope(core, mini, tonal, wa, cm, { sliderWithID, slider });

  const CDN = 'https://strudel.b-cdn.net';
  makeDrawCanvas();
  mirror = new cm.StrudelMirror({
    root: $('root'),
    initialCode: code,
    autodraw: false,
    drawTime: [-2, 2],
    drawContext: draw.getDrawContext('panel-draw'),
    pattern: core.silence,
    defaultOutput: wa.webaudioOutput,
    getTime: wa.getAudioContextCurrentTime,
    transpiler,
    prebake: async () => {
      setStatus('сэмплы…');
      // банк как у strudel.cc: без uzu-drumkit нет sh/oh/rim — три дорожки
      // трека молча ругаются «sound not found», и это слышно как пустые хэты
      await Promise.all([
        wa.registerSynthSounds(),
        wa.samples('github:tidalcycles/dirt-samples'),
        wa.samples(`${CDN}/uzu-drumkit.json`, `${CDN}/uzu-drumkit/`, { tag: 'drum-machines' }),
        wa.samples(`${CDN}/tidal-drum-machines.json`, `${CDN}/tidal-drum-machines/machines/`, {
          tag: 'drum-machines',
        }),
      ]);
      await wa.aliasBank(`${CDN}/tidal-drum-machines-alias.json`);
    },
    onUpdateState: (s) => {
      if (s?.evalError) setStatus(s.evalError.message, true);
    },
    // после любого eval (PLAY или Ctrl+Enter в редакторе) виджеты пересобраны —
    // значит и id слайдеров новые, ручки надо пересобрать, иначе они будут
    // крутить старые id и звук перестанет слушаться
    afterEval: () => {
      if (mirror) buildKnobs();
    },
  });

  // трек внутри сам синхронизирует ползунки через window.strudelMirror
  window.strudelMirror = mirror;
  window.__mirror = mirror;

  requestAnimationFrame(drawSpectrum);
  setStatus('готов — жми PLAY');
  return audioReady;
}

let audioReady;
async function play() {
  if (!mirror) return;
  await audioReady;
  if (!eq) buildMasterChain();
  setStatus('запуск…');
  await mirror.evaluate();
  playing = true;
  $('play').classList.add('on');
  buildKnobs();
  setStatus(`${knobs.length} ручек · играет`);
}

function stop() {
  if (!mirror) return;
  mirror.stop();
  playing = false;
  $('play').classList.remove('on');
  setStatus(`${knobs.length} ручек · стоп`);
}

$('play').addEventListener('click', () => play().catch((e) => setStatus(e.message, true)));
$('stop').addEventListener('click', () => stop());

// @strudel/codemirror вешает именно `Ctrl-Enter` / `Ctrl-.` (не Mod), поэтому на
// маке привычный Cmd+Enter молчит. Добавляем только Cmd: Ctrl остаётся за
// редактором, двойного запуска не будет.
$('root').addEventListener(
  'keydown',
  (e) => {
    if (!e.metaKey) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      play().catch((err) => setStatus(err.message, true));
    } else if (e.key === '.') {
      e.preventDefault();
      stop();
    }
  },
  true,
);

audioReady = boot().catch((e) => {
  console.error(e);
  setStatus(e.message, true);
});
