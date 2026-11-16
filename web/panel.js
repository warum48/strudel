// Panel + REAL editor. Left: MIXER (volumes only), middle: TONE (everything
// else, collapsible groups), right: the same CodeMirror strudel.cc runs.
//
// How it is put together (and why exactly like this):
//
// 1. EDITOR is `@strudel/codemirror` (StrudelMirror), the very package strudel.cc
//    is built from. It builds the repl, draws widgets and evals on its own. The
//    panel keeps no copy of the code: it looks at the same document.
//
// 2. KNOBS are a remote control for the real widgets. Move a knob → the panel does
//    exactly what a widget under your finger does: changes the number in the
//    document and posts `{type:'cm-slider', id, value}`. Two consequences: sound
//    changes immediately (no restart) and the code never lies. And back: drag a
//    widget in the editor and the knob follows.
//
// 3. THE TREE IS THE LAYOUT. The track declares its sliders inside
//    `const instruments = { drums: { kick: { name: 'Kick', vol: slider(...) } } }`.
//    We parse that literal out of the document (see scanSliders) and get
//    group → instrument → param for free, plus the display names from `name:`.
//    Hence:
//      * `vol` of any instrument → left column (MIXER);
//      * every other param → middle column (TONE), inside two collapsible
//        levels (group, instrument);
//      * top-level `verb` / `duck` → the Global block above the mixer, together
//        with the panel's own master gain (`#out`, after the engine);
//      * any top-level slider with min 0 and step 1 → the switch panel between
//        Global and the mixer (mode / harmony / acidMode …), button captions
//        from the track's `// @switches` line.
//    No hand-written name tables: add a key to the tree and it shows up in the
//    right column, with its own label, by itself.
//
// 4. sliderWithID is OURS. The transpiler rewrites `slider(...)` into
//    `sliderWithID(id, value, min, max)`. The stock one lives in
//    @strudel/codemirror and returns `ref` from another @strudel/core instance
//    (esm.sh loads packages separately) — the pattern does not understand such a
//    ref and audio dies with `t is not a function`. So we take `ref` from the same
//    core the pattern uses and keep the values ourselves.
//
// 5. MASTER CHAIN is real BiquadFilters on the master: the engine output
//    (`output.destinationGain`) is disconnected from the speakers and routed into
//    our chain low → mid → high → master gain → analyser → speakers. The EQ knobs
//    are hidden for now (see `bindEq`), the filters stay at 0 dB.

const EXT =
  '?external=@strudel/core,@strudel/mini,@strudel/tonal,@strudel/webaudio,@strudel/transpiler,@strudel/draw';

const cm = await import('https://esm.sh/@strudel/codemirror@1.3.0' + EXT);
const core = await import('https://esm.sh/@strudel/core@1.2.6');
const mini = await import('https://esm.sh/@strudel/mini@1.2.6');
const tonal = await import('https://esm.sh/@strudel/tonal@1.2.6');
const wa = await import('https://esm.sh/@strudel/webaudio@1.3.0');
// тот же инстанс, что грузит @strudel/codemirror: иначе cleanupDraw() из нашей
// копии не остановит анимации, которые запустила его копия
const draw = await import('https://esm.sh/@strudel/draw@1.2.6?external=@strudel/core');
const { transpiler } = await import('https://esm.sh/@strudel/transpiler@1.2.6');

// Трек не зашит: меню в шапке собирается из /api/tracks (tools/serve.mjs
// читает папку tracks/), поэтому новый файл появляется в списке сам.
// Хэш в адресе (#/tracks/techno/13-gabber-v3.js) — чтобы ссылку можно было
// дать другому и открыть тот же трек.
const DEFAULT_TRACK = '/tracks/techno/12-slowtrap-v3.js';
let track = DEFAULT_TRACK;

const trackName = (p) => p.replace(/^\/tracks\//, '').replace(/\.js$/, '');
const trackTitle = (p) => {
  const base = trackName(p).split('/').pop() ?? p;
  return base.replace(/^\d+-/, '').replace(/-/g, ' ');
};

const $ = (id) => document.getElementById(id);
const statusEl = $('status');
const setStatus = (t, err) => {
  statusEl.textContent = t;
  statusEl.className = err ? 'err' : '';
};

// ── sample downloader ─────────────────────────────────────────────
// "Download all samples" = only the sample maps the current track
// declares in `samples(...)`, and only the keys it actually uses in
// `s(...)`. Dirt-Samples is huge; downloading the whole JSON library
// would be hundreds of MB for no reason. Each file goes through
// wa.loadBuffer, so it lands in the engine's decoded-buffer cache.
let sampleBusy = false;

async function downloadAllSamples() {
  if (sampleBusy) return;
  const btn = $('samples');
  const out = $('sampleStatus');
  sampleBusy = true;
  btn.disabled = true;
  btn.textContent = 'SAMPLES…';
  out.textContent = 'scanning…';

  try {
    const raw = globalThis.strudelMirror?.editor?.state?.doc?.toString?.() ?? code ?? '';
    // comments in the track header also mention `samples('github:...')`;
    // strip whole-line comments before looking for real calls.
    const src = raw.replace(/^\s*\/\/.*$/gm, '');
    // uzu-drumkit is already preloaded by the panel; include it so tracks
    // using bd/sd/hh/... also get real files, not just the JSON map.
    const mapUrls = [...new Set([
      'https://strudel.b-cdn.net/uzu-drumkit.json',
      ...[...src.matchAll(/\bsamples\(\s*['"]([^'"]+)['"]/g)].map((m) => m[1]),
    ])];
    // key → [absolute urls] across all maps the track declares.
    const maps = new Map();
    for (const u of mapUrls) {
      try {
        const [json, base] = await wa.fetchSampleMap(u);
        const b = String(base || '').endsWith('/') ? String(base) : String(base || '') + '/';
        for (const [key, v] of Object.entries(json || {})) {
          if (key === '_base') continue;
          const files = Array.isArray(v) ? v : typeof v === 'string' ? [v] : null;
          if (!files || !files.length) continue;
          maps.set(key, files.map((f) => b + f));
        }
      } catch (e) {
        console.warn('sample map failed', u, e);
      }
    }

    // sample keys used by the track: latin tokens inside s("..."), then
    // keep only those that exist in a loaded map (sine/sawtooth/etc. drop out).
    const used = new Set();
    for (const m of src.matchAll(/\bs\(\s*['"]([^'"]+)['"]\s*\)/g)) {
      for (const token of m[1].match(/[a-zA-Z][a-zA-Z0-9_]*/g) ?? []) {
        if (maps.has(token)) used.add(token);
      }
    }
    if (!used.size) {
      out.textContent = 'no matching sample keys';
      btn.textContent = 'SAMPLES';
      return;
    }

    const urls = [];
    for (const key of used) {
      for (const url of maps.get(key) ?? []) {
        if (!urls.includes(url)) urls.push(url);
      }
    }

    let done = 0;
    let failed = 0;
    out.textContent = `0 / ${urls.length}`;
    for (const url of urls) {
      try {
        if (typeof wa.loadBuffer === 'function') {
          await wa.loadBuffer(url, wa.getAudioContext(), 'download', 0);
        } else {
          await fetch(url).then((r) => r.arrayBuffer());
        }
      } catch {
        failed++;
      }
      done++;
      out.textContent = `${done} / ${urls.length}${failed ? ` · ${failed} err` : ''}`;
    }
    out.textContent = failed ? `done · ${failed} errors` : `all ${done} loaded`;
    btn.textContent = failed ? 'SAMPLES ⚠' : 'SAMPLES ✓';
  } catch (e) {
    out.textContent = e.message;
    btn.textContent = 'SAMPLES';
  } finally {
    sampleBusy = false;
    btn.disabled = false;
  }
}

$('samples')?.addEventListener('click', downloadAllSamples);

// ── 1. bridge between knobs and widgets ───────────────────────────
const values = {}; // id → value, the pattern signal reads from here

const sliderWithID = (id, value) => {
  values[id] = value;
  if (cm.sliderValues) cm.sliderValues[id] = value; // чтобы чужой слушатель не ругался
  return core.ref(() => values[id]);
};
const slider = (value) => core.pure(value);

// a widget posts here when you drag it in the editor
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

// ── 2. master chain: EQ + analyser ────────────────────────────────
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

  // engine output → our chain (before this destinationGain went straight to speakers)
  out.destinationGain.disconnect();
  out.destinationGain.connect(eqIn);

  eq = { low, mid, high };
  globalThis.__panel = { ctx, eq, masterGain, analyser, get knobs() { return knobs; } };
  bindMaster();
  // bindEq();  ← вернуть вместе с блоком MASTER EQ в index.html
}

// ── EQ СКРЫТ, НЕ УДАЛЁН ───────────────────────────────────────────
// Ручки убраны из разметки (см. комментарий в index.html), поэтому вызов
// bindEq() в buildMasterChain() закомментирован. Сама функция и фильтры
// на месте: раскомментировать блок в HTML + одну строку выше — и EQ вернётся.
// eslint-disable-next-line no-unused-vars
function bindEq() {
  const bands = [
    ['eqLow', 'eqLowV', 'low'],
    ['eqMid', 'eqMidV', 'mid'],
    ['eqHigh', 'eqHighV', 'high'],
  ];
  for (const [id, vid, key] of bands) {
    const input = $(id);
    const outEl = $(vid);
    if (!input) continue;
    const apply = () => {
      const db = Number(input.value);
      if (eq) eq[key].gain.setTargetAtTime(db, ctx.currentTime, 0.02);
      outEl.textContent = `${db.toFixed(1)} dB`;
    };
    input.addEventListener('input', apply);
    apply();
  }
}

function bindMaster() {
  const m = $('out');
  const mv = $('outV');
  const apply = () => {
    const g = Number(m.value);
    if (masterGain) masterGain.gain.setTargetAtTime(g, ctx.currentTime, 0.02);
    mv.textContent = g.toFixed(2);
  };
  m.addEventListener('input', apply);
  apply();
}

// ── 3. spectrum ───────────────────────────────────────────────────
// Канвас 440×132 в разметке, CSS 220×66: рисуем в двойном разрешении, браузер
// сжимает — так полосы не мылятся. Угол фиксированный, см. #scope в CSS.
function drawSpectrum() {
  const cv = $('scope');
  const g = cv.getContext('2d');
  const w = cv.width;
  const h = cv.height;
  g.clearRect(0, 0, w, h);
  if (!analyser) {
    requestAnimationFrame(drawSpectrum);
    return;
  }

  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);

  const nyquist = ctx.sampleRate / 2;
  const bins = data.length;
  const bars = 72;
  for (let i = 0; i < bars; i++) {
    const f0 = 20 * Math.pow(1000, i / bars); // 20 → 20000 Hz
    const f1 = 20 * Math.pow(1000, (i + 1) / bars);
    const b0 = Math.floor((f0 / nyquist) * bins);
    const b1 = Math.max(b0 + 1, Math.floor((f1 / nyquist) * bins));
    let v = 0;
    for (let b = b0; b < b1 && b < bins; b++) v = Math.max(v, data[b]);
    const bh = (v / 255) * (h - 6);
    const x = (i / bars) * w;
    const bw = w / bars - 1.5;
    g.fillStyle = i < 18 ? '#b3d80d' : i < 45 ? '#8fb90c' : '#5c7a08';
    g.fillRect(x, h - bh, bw, bh);
  }
  g.strokeStyle = '#1d211a';
  g.beginPath();
  g.moveTo(0, h - 0.5);
  g.lineTo(w, h - 0.5);
  g.stroke();
  requestAnimationFrame(drawSpectrum);
}

// ── 4. read the tree out of the document ──────────────────────────
// Ручки не перечисляются руками: панель берёт их из самого трека. Единственное,
// что нужно, — знать, ГДЕ стоит каждый `slider(` и в какой ключ он вложен.
// Поэтому идём по тексту посимвольно, пропуская комментарии и строки (в шапке
// трека слово `slider(` встречается в прозе — наивный поиск сбил бы нумерацию),
// и держим стек ключей по глубине фигурных скобок.
//
// Здесь же собираются ПОДПИСИ: `name: 'Kick'` в дереве — это не ручка, а имя
// для панели. Раньше они лежали таблицей в этом файле (INST_LABEL), и это была
// последняя ручная связка «код ↔ панель»: добавил инструмент в трек — пошёл
// дописывать словарь. Теперь имя живёт рядом с инструментом, а панель только
// читает. Нет имени — подпись делается из ключа (`bodyLevel` → `body level`).
function scanSliders(src) {
  const sites = [];
  const names = {}; // 'drums.kick' → 'Kick'
  const keys = []; // keys[depth] — последний ключ на этом уровне вложенности
  let depth = 0;
  let i = 0;
  const n = src.length;
  const isWord = (c) => /[A-Za-z0-9_$]/.test(c);
  const pathAt = (d) => keys.slice(1, d + 1).filter(Boolean).join('.');

  while (i < n) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') {
      const e = src.indexOf('\n', i);
      i = e < 0 ? n : e + 1;
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      const e = src.indexOf('*/', i + 2);
      i = e < 0 ? n : e + 2;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      i++;
      while (i < n) {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i] === c) { i++; break; }
        i++;
      }
      continue;
    }
    if (c === '{') {
      depth++;
      keys[depth] = null;
      i++;
      continue;
    }
    if (c === '}') {
      keys[depth] = null;
      depth = Math.max(0, depth - 1);
      i++;
      continue;
    }
    if (c === '[' || c === ']' || c === '(' || c === ')') {
      i++;
      continue;
    }
    if (isWord(c)) {
      let j = i + 1;
      while (j < n && isWord(src[j])) j++;
      const word = src.slice(i, j);
      // `word:` — это ключ объекта (не `word::`, не тернарник)
      let k = j;
      while (k < n && (src[k] === ' ' || src[k] === '\t')) k++;
      if (src[k] === ':' && src[k + 1] !== ':') {
        // `name: 'Kick'` — подпись объекта, в котором стоит. Путь берём ДО
        // того, как перезапишем keys[depth] словом `name`.
        if (word === 'name') {
          let q = k + 1;
          while (q < n && /\s/.test(src[q])) q++;
          const quote = src[q];
          if (quote === "'" || quote === '"' || quote === '`') {
            let e = q + 1;
            let out = '';
            while (e < n && src[e] !== quote) {
              if (src[e] === '\\') { out += src[e + 1] ?? ''; e += 2; continue; }
              out += src[e];
              e++;
            }
            names[pathAt(depth)] = out;
            i = e + 1;
            continue;
          }
        }
        keys[depth] = word;
        i = k + 1;
        continue;
      }
      if (word === 'slider' && src[j] === '(') {
        sites.push({ pos: i, path: keys.slice(1, depth + 1).filter(Boolean) });
      }
      i = j;
      continue;
    }
    i++;
  }
  return { sites, names };
}

// Подписи. Приоритет: `name:` из трека → человеческая форма ключа.
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const pretty = (key) => key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase();
let labels = {}; // 'drums.kick' → 'Kick', заполняется в buildKnobs

const groupLabel = (g) => labels[g] || cap(g);
const instLabel = (g, inst) => labels[`${g}.${inst}`] || cap(inst);
const paramLabel = (name) => pretty(name);


// ПЕРЕКЛЮЧАТЕЛИ — не список имён, а признак структуры: глобальная ручка
// (вне дерева), min 0 и шаг 1 — значит это выбор режима, а не громкость.
// Подписи кнопок берутся из строки-маркера в треке:
//   // @switches mode=stomp,gabber,break,half,roll harmony=fifths,minor
// Нет строки — кнопки называются цифрами, но всё равно рисуются.
const isSwitch = (k) => k.path.length === 0 && k.step === 1 && k.min === 0;

function scanSwitchCaps(src) {
  const caps = {};
  const line = /^[ \t]*\/\/[ \t]*@switches[ \t]+(.+)$/m.exec(src);
  if (!line) return caps;
  for (const part of line[1].trim().split(/\s+/)) {
    const [name, list] = part.split('=');
    if (name && list) caps[name] = list.split(',');
  }
  return caps;
}
let switchCaps = {};

// PADS — momentary control. A top-level slider named in `// @pads a,b,c` is NOT
// a switch: press/hold writes max (1), release writes min (0). The track gates a
// one-bar fill layer by that slider, so holding loops the fill and releasing
// stops it — no timers, no bar quantization, the code stays the only state.
// Keys 1..n mirror the buttons and are ignored while typing in the editor.
function scanPadNames(src) {
  const line = /^[ \t]*\/\/[ \t]*@pads[ \t]+(.+)$/m.exec(src);
  if (!line) return new Set();
  return new Set(line[1].trim().split(/[\s,]+/).filter(Boolean));
}
let padNames = new Set();
const padButtons = new Map(); // index → { k, b }
const heldKeys = new Set();

// MUTES — top-level 0/1 sliders named in `// @mutes muteA,muteB`.
// Unlike pads they are not momentary: a click writes the opposite value
// and it stays. The row sits under Scenes; the track only multiplies a
// layer's gain by the unmuted signal, so mutes never reorder the code.
function scanMuteNames(src) {
  const line = /^[ \t]*\/\/[ \t]*@mutes[ \t]+(.+)$/m.exec(src);
  if (!line) return new Set();
  return new Set(line[1].trim().split(/[\s,]+/).filter(Boolean));
}
let muteNames = new Set();

// SCENES — трек может объявить два пресета прямо в комментарии:
//   // @scenes {"intro":{...},"theme":{...}}
// Ключи — пути дерева (`drums.kick.vol`) или имена глобальных ручек
// (`mode`, `harmony`). Нет строки — кнопки Intro/Theme выключены.
function scanScenes(src) {
  const line = /^[ \t]*\/\/[ \t]*@scenes[ \t]+(.+)$/m.exec(src);
  if (!line) return null;
  try {
    return JSON.parse(line[1]);
  } catch (e) {
    console.warn('panel: @scenes parse failed', e);
    return null;
  }
}
let scenes = null;
let importedScenes = null; // JSON import can override scenes until track change

const knobKey = (k) => (k.path.length ? k.path.join('.') : k.name);
function setSceneStatus(text) {
  const el = $('sceneStatus');
  if (el) el.textContent = text;
}

const fmt = (x) => {
  const n = Number(x);
  if (!Number.isFinite(n)) return String(x);
  if (Math.abs(n) >= 100) return String(Math.round(n));
  return String(Number(n.toFixed(4)));
};

let knobs = []; // { idx, path, name, anchor, min, max, step, value }
let timeline = []; // @timeline sections: { at, length, name, values }
let timelineSel = -1;
let timelineLast = -1;
let timelineTimer = null;
let timelineBar = 0;
const knobByAnchor = new Map(); // widget id → { input, out }
const openState = new Map(); // 'group' / 'group.inst' → свёрнуто ли

function buildKnobs() {
  const src = mirror.editor.state.doc.toString();
  const { sites, names } = scanSliders(src);
  labels = names;
  switchCaps = scanSwitchCaps(src);
  padNames = scanPadNames(src);
  muteNames = scanMuteNames(src);
  timeline = scanTimeline(src);
  if (timelineSel >= timeline.length) timelineSel = timeline.length - 1;
  scenes = importedScenes || scanScenes(src);
  renderScenes();
  const ws = mirror.widgets.filter((w) => w.type === 'slider').sort((a, b) => a.from - b.from);
  if (sites.length !== ws.length) {
    console.warn(`panel: ${sites.length} slider( в тексте против ${ws.length} виджетов`);
  }
  knobs = [];
  const n = Math.min(sites.length, ws.length);
  for (let i = 0; i < n; i++) {
    const w = ws[i];
    const path = sites[i].path;
    let name = path.length ? path[path.length - 1] : '';
    if (!name) {
      const before = src.slice(Math.max(0, sites[i].pos - 48), sites[i].pos);
      const m = /const\s+(\w+)\s*=\s*$/.exec(before);
      name = m ? m[1] : `slider_${i}`;
    }
    knobs.push({
      idx: i,
      path,
      name,
      anchor: w.from,
      min: w.min,
      max: w.max,
      step: w.step,
      value: Number(w.value),
    });
  }
  renderTimeline();
  render();
}

function render() {
  knobByAnchor.clear();

  const globals = [];
  const switches = [];
  const pads = [];
  const mutes = [];
  const groups = new Map(); // group → Map(instrument → knobs[])
  for (const k of knobs) {
    if (k.path.length === 0) {
      if (muteNames.has(k.name)) mutes.push(k);
      else if (padNames.has(k.name)) pads.push(k);
      else (isSwitch(k) ? switches : globals).push(k);
      continue;
    }
    if (k.path.length < 3) continue; // ключ-обёртка без параметра
    const [g, inst] = k.path;
    if (!groups.has(g)) groups.set(g, new Map());
    const m = groups.get(g);
    if (!m.has(inst)) m.set(inst, []);
    m.get(inst).push(k);
  }

  renderGlobals(globals);
  renderSwitches(switches);
  renderPads(pads);
  renderMutes(mutes);
  renderMixer(groups);
  renderTone(groups);

  $('mixCount').textContent = `${[...groups.values()].reduce((a, m) => a + m.size, 0)} inst`;
  $('toneCount').textContent = `${groups.size} groups`;
}

function renderGlobals(list) {
  const root = $('globalRows');
  root.innerHTML = '';
  for (const k of list) root.appendChild(makeRow(k));
  // блок не скрываем никогда: в нём живёт мастер-громкость (см. index.html)
}

// Переключатели — не ползунки: у mode 4 положения, у harmony 2. Рисуем кнопки,
// значение всё равно пишется в документ тем же setKnob.
function renderSwitches(list) {
  const root = $('switches');
  root.innerHTML = '';
  for (const k of list) {
    const box = document.createElement('span');
    box.className = 'sw';
    const cap = document.createElement('span');
    cap.className = 'cap';
    cap.textContent = k.name;
    box.appendChild(cap);
    const vals = [];
    for (let v = k.min; v <= k.max + 1e-9; v += 1) vals.push(v);
    const caps = switchCaps[k.name] || [];
    const btns = [];
    vals.forEach((v, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = String(v);
      b.title = caps[i] || `${k.name} ${v}`;
      b.addEventListener('click', () => {
        k.value = v;
        setKnob(k, v);
        for (const other of btns) other.classList.toggle('on', other === b);
      });
      btns.push(b);
      box.appendChild(b);
    });
    const cur = Math.round(k.value);
    btns.forEach((b, i) => b.classList.toggle('on', vals[i] === cur));
    root.appendChild(box);
  }
}

// ПЭДЫ: кнопка = мгновенное значение. pointerdown → max, pointerup/cancel/
// leave/blur → min. Значение идёт тем же setKnob, поэтому код и звук не врут,
// а нажатая кнопка подсвечивается. Пока пэд держат — слой играет (трек гейтит
// им одно-тактовый филл), отпустили — слой исчез.
function renderPads(list) {
  const root = $('pads');
  root.innerHTML = '';
  padButtons.clear();
  if (!list.length) return;
  const cap = document.createElement('span');
  cap.className = 'cap';
  cap.textContent = 'Pads — hold';
  root.appendChild(cap);
  list.forEach((k, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pad';
    const word = k.name.replace(/^pad/, '') || k.name;
    b.innerHTML = `${cap_(word)}<span class="k">${i + 1}</span>`;
    b.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      try { b.setPointerCapture(e.pointerId); } catch {}
      pressPadAt(i, true);
    });
    for (const ev of ['pointerup', 'pointercancel', 'pointerleave', 'blur']) {
      b.addEventListener(ev, () => pressPadAt(i, false));
    }
    padButtons.set(i, { k, b });
    root.appendChild(b);
    b.classList.toggle('on', Number(k.value) > (k.min + k.max) / 2);
  });
}

const cap_ = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function pressPadAt(i, on) {
  const p = padButtons.get(i);
  if (!p) return;
  const v = on ? p.k.max : p.k.min;
  p.k.value = v;
  setKnob(p.k, v);
  p.b.classList.toggle('on', on);
}

// MUTES: обычная кнопка-переключатель. Клик пишет max/min и остаётся там;
// трек глушит слой через `1 - mute`, поэтому инструмент не исчезает из кода.
function renderMutes(list) {
  const root = $('mutes');
  root.innerHTML = '';
  if (!list.length) return;
  const cap = document.createElement('span');
  cap.className = 'cap';
  cap.textContent = 'Mutes — click';
  root.appendChild(cap);
  for (const k of list) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'mute';
    const word = k.name.replace(/^mute/, '') || k.name;
    b.textContent = cap_(word);
    const isOn = () => Number(k.value) > (k.min + k.max) / 2;
    const paint = () => {
      const on = isOn();
      b.classList.toggle('on', on);
      b.title = `${k.name}: ${on ? 'muted' : 'live'}`;
    };
    b.addEventListener('click', () => {
      const next = isOn() ? k.min : k.max;
      k.value = next;
      setKnob(k, next);
      paint();
    });
    paint();
    root.appendChild(b);
  }
}

// ── TIMELINE: @timeline + horizontal editor + playback ────────────
function scanTimeline(src) {
  const line = /^[ \t]*\/\/[ \t]*@timeline[ \t]+(.+)$/m.exec(src);
  if (!line) return [];
  try {
    const arr = JSON.parse(line[1].trim());
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((s) => s && Number.isFinite(Number(s.at)))
      .map((s) => ({
        at: Math.max(0, Number(s.at) || 0),
        length: Math.max(1, Number(s.length) || 8),
        name: String(s.name || 'section'),
        values: s.values && typeof s.values === 'object' ? s.values : {},
      }));
  } catch {
    return [];
  }
}

const tlTotal = () => Math.max(8, ...timeline.map((s) => s.at + s.length));
const tlKeyLabel = (key) => {
  const k = knobs.find((x) => knobKey(x) === key);
  return k ? (k.path.length ? k.path.join('.') : k.name) : key;
};
const tlCurrent = (key) => {
  const k = knobs.find((x) => knobKey(x) === key);
  return k ? Number(k.value) : 0;
};

function updatePlayhead(bar = timelineBar) {
  const el = $('tlPlayhead');
  if (!el) return;
  const total = tlTotal();
  el.style.left = `${Math.max(0, Math.min(100, (bar / total) * 100))}%`;
}

function renderTimeline() {
  const root = $('timeline');
  if (!root) return;
  const total = tlTotal();
  const ruler = $('tlRuler');
  ruler.innerHTML = '';
  const step = total <= 16 ? 4 : total <= 64 ? 8 : 16;
  for (let b = 0; b <= total; b += step) {
    const t = document.createElement('div');
    t.className = 'tl-tick';
    t.style.left = `${(b / total) * 100}%`;
    t.textContent = b;
    ruler.appendChild(t);
  }
  const secs = $('tlSections');
  secs.innerHTML = '';
  timeline.forEach((sec, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tl-block' + (i === timelineSel ? ' sel' : '');
    b.style.left = `${(sec.at / total) * 100}%`;
    b.style.width = `${Math.max(1.5, (sec.length / total) * 100)}%`;
    b.title = `${sec.name} · bars ${sec.at}–${sec.at + sec.length}`;
    const nm = document.createElement('span');
    nm.className = 'nm';
    nm.textContent = sec.name;
    const mt = document.createElement('span');
    mt.className = 'mt';
    mt.textContent = `${sec.at}–${sec.at + sec.length} · ${Object.keys(sec.values).length} v`;
    b.append(nm, mt);
    b.addEventListener('click', () => {
      timelineSel = i;
      renderTimeline();
    });
    secs.appendChild(b);
  });
  $('tlStatus').textContent = timeline.length
    ? `${timeline.length} sections · ${total} bars`
    : 'no @timeline';
  updatePlayhead();
  renderTimelineInspector();
}

function renderTimelineInspector() {
  const root = $('tlInspector');
  if (!root) return;
  root.innerHTML = '';
  const sec = timeline[timelineSel];
  if (!sec) {
    const d = document.createElement('div');
    d.className = 'tl-empty';
    d.textContent = 'select a section to edit it';
    root.appendChild(d);
    return;
  }

  const textRow = (label, value, onchange, type = 'text') => {
    const row = document.createElement('div');
    row.className = 'tl-row';
    const lab = document.createElement('label');
    lab.textContent = label;
    const inp = document.createElement('input');
    inp.type = type;
    inp.value = value;
    if (type === 'number') {
      inp.min = '0';
      inp.step = '1';
    }
    inp.addEventListener('change', () => onchange(inp.value));
    row.append(lab, inp);
    return row;
  };

  root.append(
    textRow('name', sec.name, (v) => {
      sec.name = String(v || 'section');
      commitTimeline();
    }),
    textRow('at', sec.at, (v) => {
      const n = Math.max(0, Number(v) || 0);
      sec.at = n;
      commitTimeline();
    }, 'number'),
    textRow('length', sec.length, (v) => {
      const n = Math.max(1, Number(v) || 1);
      sec.length = n;
      commitTimeline();
    }, 'number'),
  );

  const vals = document.createElement('div');
  vals.className = 'tl-vals';
  const entries = Object.entries(sec.values || {});
  for (const [key, raw] of entries) {
    const row = document.createElement('div');
    row.className = 'tl-val';
    const lab = document.createElement('span');
    lab.textContent = tlKeyLabel(key);
    lab.title = key;
    const inp = document.createElement('input');
    inp.type = 'number';
    inp.step = '0.01';
    inp.value = raw;
    inp.addEventListener('change', () => {
      const v = Number(inp.value);
      if (!Number.isFinite(v)) return;
      sec.values[key] = v;
      commitTimeline();
    });
    const del = document.createElement('button');
    del.type = 'button';
    del.textContent = '×';
    del.title = 'remove target';
    del.addEventListener('click', () => {
      delete sec.values[key];
      commitTimeline();
    });
    row.append(lab, inp, del);
    vals.appendChild(row);
  }
  root.appendChild(vals);

  const add = document.createElement('div');
  add.className = 'tl-add';
  const sel = document.createElement('select');
  for (const k of [...knobs].sort((a, b) => knobKey(a).localeCompare(knobKey(b)))) {
    const o = document.createElement('option');
    o.value = knobKey(k);
    o.textContent = knobKey(k);
    sel.appendChild(o);
  }
  const val = document.createElement('input');
  val.type = 'number';
  val.step = '0.01';
  val.value = tlCurrent(sel.value);
  sel.addEventListener('change', () => {
    val.value = tlCurrent(sel.value);
  });
  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.textContent = '+';
  addBtn.title = 'add target at this section';
  addBtn.addEventListener('click', () => {
    const key = sel.value;
    const v = Number(val.value);
    if (!Number.isFinite(v)) return;
    sec.values[key] = v;
    commitTimeline();
  });
  add.append(sel, val, addBtn);
  root.appendChild(add);

  const delSec = document.createElement('button');
  delSec.type = 'button';
  delSec.textContent = 'remove section';
  delSec.style.marginTop = '6px';
  delSec.addEventListener('click', () => {
    timeline.splice(timelineSel, 1);
    timelineSel = -1;
    commitTimeline();
  });
  root.appendChild(delSec);
}

function commitTimeline() {
  const sel = timeline[timelineSel];
  timeline.sort((a, b) => a.at - b.at);
  timelineSel = sel ? timeline.indexOf(sel) : -1;
  writeTimeline();
  renderTimeline();
}

function writeTimeline() {
  if (!mirror) return;
  const json = JSON.stringify(timeline);
  const src = mirror.editor.state.doc.toString();
  const m = /^([ \t]*\/\/[ \t]*@timeline[ \t]+)(.*)$/m.exec(src);
  if (m) {
    const from = m.index + m[1].length;
    mirror.editor.dispatch({ changes: { from, to: m.index + m[0].length, insert: json } });
  } else {
    const a = /^[ \t]*\/\/[ \t]*@scenes.*$/m.exec(src);
    const pos = a ? a.index + a[0].length : 0;
    mirror.editor.dispatch({ changes: { from: pos, to: pos, insert: `\n// @timeline ${json}` } });
  }
  setStatus('timeline saved');
}

function addTimelineSection() {
  const end = timeline.length ? Math.max(...timeline.map((s) => s.at + s.length)) : 0;
  const at = Math.max(end, Math.floor(timelineBar));
  timeline.push({ at, length: 8, name: `SEC ${timeline.length + 1}`, values: {} });
  timelineSel = timeline.length - 1;
  commitTimeline();
}

function startTimeline() {
  stopTimeline();
  timelineLast = -1;
  timelineTimer = setInterval(timelineTick, 120);
}
function stopTimeline() {
  if (timelineTimer) clearInterval(timelineTimer);
  timelineTimer = null;
  timelineLast = -1;
  timelineBar = 0;
  updatePlayhead(0);
}
function timelineTick() {
  if (!playing || !mirror) return;
  const now = mirror.repl?.scheduler?.now?.();
  if (typeof now !== 'number' || !Number.isFinite(now)) return;
  timelineBar = Math.max(0, Math.floor(now));
  updatePlayhead(timelineBar);
  if (!timeline.length) return;
  let idx = -1;
  for (let i = 0; i < timeline.length; i++) {
    if (timeline[i].at <= timelineBar) idx = i;
  }
  if (idx === timelineLast) return;
  timelineLast = idx;
  if (idx >= 0) {
    const sec = timeline[idx];
    const n = applyTimelineValues(sec.values || {}, `timeline: ${sec.name}`);
    if (!n) setSceneStatus(`timeline: ${sec.name} (no matching knobs)`);
  }
}

$('tlAdd')?.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  addTimelineSection();
});

function bindPadKeys() {
  const typing = () => {
    const ae = document.activeElement;
    return !!(ae && (ae.closest?.('.cm-editor') || /INPUT|TEXTAREA|SELECT/.test(ae.tagName || '')));
  };
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || typing()) return;
    const i = Number(e.key) - 1;
    if (!Number.isInteger(i) || i < 0 || i > 8 || !padButtons.has(i)) return;
    e.preventDefault();
    if (e.repeat) return;
    heldKeys.add(i);
    pressPadAt(i, true);
  });
  document.addEventListener('keyup', (e) => {
    const i = Number(e.key) - 1;
    if (!Number.isInteger(i) || !heldKeys.delete(i)) return;
    pressPadAt(i, false);
  });
  window.addEventListener('blur', () => {
    for (const i of heldKeys) pressPadAt(i, false);
    heldKeys.clear();
  });
}

// ── SCENES: Intro / Theme + JSON export/import ─────────────────────
function renderScenes() {
  const intro = $('sceneIntro');
  const theme = $('sceneTheme');
  if (!intro || !theme) return;
  const hasIntro = !!(scenes && scenes.intro && Object.keys(scenes.intro).length);
  const hasTheme = !!(scenes && scenes.theme && Object.keys(scenes.theme).length);
  intro.disabled = !hasIntro;
  theme.disabled = !hasTheme;
  intro.title = hasIntro ? 'apply intro scene' : 'no @scenes.intro in this track';
  theme.title = hasTheme ? 'apply theme scene' : 'no @scenes.theme in this track';
  setSceneStatus(
    hasIntro || hasTheme
      ? [hasIntro && 'intro', hasTheme && 'theme'].filter(Boolean).join(' / ')
      : 'no scenes',
  );
}

// Применяем значения по путям дерева. Идём с конца: правка числа меняет
// длину текста и сдвигает только то, что правее, а мы уже отправили те
// значения по их исходным id. Так пачка из 90 ручек не путает движок.
function applyValues(values, label = 'scene') {
  const byKey = new Map(knobs.map((k) => [knobKey(k), k]));
  const entries = Object.entries(values || {});
  const pairs = [];
  for (const [key, raw] of entries) {
    const k = byKey.get(key);
    const v = Number(raw);
    if (!k || !Number.isFinite(v)) continue;
    pairs.push([k, Math.min(k.max, Math.max(k.min, v))]);
  }
  pairs.sort((a, b) => b[0].idx - a[0].idx);
  for (const [k, v] of pairs) {
    k.value = v;
    setKnob(k, v);
  }
  render();
  renderScenes();
  setSceneStatus(`${label}: ${pairs.length}/${entries.length} values`);
  return pairs.length;
}

// Timeline применяет только значения, не перестраивая весь сайдбар:
// перерисовка 149 ручек в момент смены секции — это и был слышимый провал.
// Меняем число, шлём cm-slider и обновляем конкретный input.
function applyTimelineValues(values, label = 'timeline') {
  const byKey = new Map(knobs.map((k) => [knobKey(k), k]));
  const entries = Object.entries(values || {});
  const pairs = [];
  for (const [key, raw] of entries) {
    const k = byKey.get(key);
    const v = Number(raw);
    if (!k || !Number.isFinite(v)) continue;
    pairs.push([k, Math.min(k.max, Math.max(k.min, v))]);
  }
  pairs.sort((a, b) => b[0].idx - a[0].idx);
  let applied = 0;
  let needsFull = false;
  for (const [k, v] of pairs) {
    if (Math.abs(Number(k.value) - v) < 1e-9) {
      applied++;
      continue;
    }
    k.value = v;
    setKnob(k, v);
    const ui = knobByAnchor.get('slider_' + k.anchor);
    if (ui) {
      ui.input.value = v;
      ui.out.textContent = fmt(v);
    } else if (isSwitch(k)) {
      needsFull = true;
    }
    applied++;
  }
  if (needsFull) render();
  setSceneStatus(`${label}: ${applied}/${entries.length} values`);
  return applied;
}

function applyScene(name) {
  const scene = scenes && scenes[name];
  if (!scene) {
    setSceneStatus(`no ${name} scene`);
    return;
  }
  applyValues(scene, name);
}

function exportScene() {
  const values = {};
  for (const k of knobs) values[knobKey(k)] = k.value;
  const payload = { track: trackName(track), values, scenes };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const base = trackName(track).replace(/[\/\\]+/g, '-');
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  a.download = `${base}-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  setSceneStatus(`exported ${Object.keys(values).length} values`);
}

async function importScene(file) {
  try {
    const text = await file.text();
    const json = JSON.parse(text);
    if (json && json.scenes && typeof json.scenes === 'object') {
      importedScenes = json.scenes;
      scenes = importedScenes;
      renderScenes();
    }
    const values = json && json.values && typeof json.values === 'object' ? json.values : json;
    if (!values || typeof values !== 'object') throw new Error('no values in JSON');
    const n = applyValues(values, 'imported');
    setSceneStatus(`imported ${n} values${json.track ? ' · ' + json.track : ''}`);
  } catch (e) {
    setSceneStatus('import error: ' + e.message);
    setStatus(e.message, true);
  }
}

function bindScenes() {
  $('sceneIntro').addEventListener('click', () => applyScene('intro'));
  $('sceneTheme').addEventListener('click', () => applyScene('theme'));
  $('sceneExport').addEventListener('click', exportScene);
  $('sceneImport').addEventListener('click', () => $('sceneFile').click());
  $('sceneFile').addEventListener('change', (e) => {
    const f = e.target.files?.[0];
    if (f) importScene(f);
    e.target.value = '';
  });
}

// МИКШЕР: ровно `vol` каждого инструмента, в порядке дерева.
function renderMixer(groups) {
  const root = $('mixlist');
  root.innerHTML = '';
  const rows = document.createElement('div');
  rows.className = 'rows';
  for (const [g, insts] of groups) {
    for (const [inst, params] of insts) {
      const vol = params.find((p) => p.path[2] === 'vol');
      if (!vol) continue;
      const row = makeRow(vol, instLabel(g, inst));
      row.classList.add('is-vol');
      rows.appendChild(row);
    }
  }
  root.appendChild(rows);
}

// ТОНКИЕ НАСТРОЙКИ: всё, кроме vol. Два уровня сворачивания — группа и
// инструмент; состояние запоминается между eval'ами (openState).
function renderTone(groups) {
  const root = $('tonelist');
  root.innerHTML = '';
  for (const [g, insts] of groups) {
    const gParams = [...insts.values()].reduce((a, p) => a + p.filter((x) => x.path[2] !== 'vol').length, 0);
    if (!gParams) continue;

    const gd = document.createElement('details');
    gd.className = 'grp';
    gd.open = openState.get(g) ?? true;
    gd.addEventListener('toggle', () => openState.set(g, gd.open));
    const gs = document.createElement('summary');
    gs.innerHTML = `<span>${groupLabel(g)}</span><span class="n">${gParams}</span>`;
    gd.appendChild(gs);
    const gbody = document.createElement('div');
    gbody.className = 'body';

    for (const [inst, params] of insts) {
      const own = params.filter((p) => p.path[2] !== 'vol');
      if (!own.length) continue;
      const key = `${g}.${inst}`;
      const id = document.createElement('details');
      id.className = 'inst';
      id.open = openState.get(key) ?? true;
      id.addEventListener('toggle', () => openState.set(key, id.open));
      const is = document.createElement('summary');
      is.innerHTML = `<span>${instLabel(g, inst)}</span><span class="n">${own.length}</span>`;
      id.appendChild(is);
      const body = document.createElement('div');
      body.className = 'rows';
      for (const p of own) body.appendChild(makeRow(p, paramLabel(p.name)));
      id.appendChild(body);
      gbody.appendChild(id);
    }

    gd.appendChild(gbody);
    root.appendChild(gd);
  }
}

function makeRow(k, label) {
  const row = document.createElement('div');
  row.className = 'row' + (k.name === 'vol' ? ' is-vol' : '') + (k.name === 'cut' ? ' is-cut' : '');
  const lab = document.createElement('label');
  lab.textContent = label || k.name;
  lab.title = k.path.length ? k.path.join('.') : k.name;
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
  row.append(lab, input, out);
  knobByAnchor.set('slider_' + k.anchor, { input, out });
  return row;
}

// A knob is the same drag a widget gets: the number into the document + a message
// to the engine. Позицию числа НЕ запоминаем: после любой правки всё правее
// сдвигается, а id виджета (`slider_<offset>`) живёт до следующего eval.
// Поэтому каждый раз заново сканируем документ и берём k.idx-й вызов slider(.
function setKnob(k, v) {
  const src = mirror.editor.state.doc.toString();
  const site = scanSliders(src).sites[k.idx];
  if (site) {
    const head = /^slider\(\s*(-?\d+(?:\.\d+)?)/.exec(src.slice(site.pos, site.pos + 40));
    if (head) {
      const from = site.pos + head[0].length - head[1].length;
      mirror.editor.dispatch({ changes: { from, to: from + head[1].length, insert: fmt(v) } });
    }
  }
  window.postMessage({ type: 'cm-slider', id: 'slider_' + k.anchor, value: Number(v) }, null);
}

// ── 5. editor theme and visualizer ────────────────────────────────
// cm.themes — 39 color schemes from strudel.cc itself; activateTheme writes the
// theme into `:root` as `--background/--foreground/--caret/...` variables. Our own
// variables are --bg/--panel/--text/--accent, they do not collide, so the panel
// keeps its lime accent whatever theme the code wears.
function fillThemes() {
  const sel = $('theme');
  for (const name of Object.keys(cm.themes || {})) {
    const o = document.createElement('option');
    o.value = name;
    o.textContent = name;
    sel.appendChild(o);
  }
  sel.value = 'strudelTheme';
  sel.addEventListener('change', () => applyTheme(sel.value));
}

function applyTheme(name) {
  try {
    cm.initTheme(name);
  } catch (e) {
    setStatus(e.message, true);
  }
}

// ── inline visualizers: `_pianoroll()` прямо в коде ─────────────────────────
// В strudel.cc это НЕ полноэкранная картинка, а block-widget CodeMirror: канвас
// вставляется блоком под той строкой, где стоит вызов. На трек их может быть
// сколько угодно — по одному на инструмент.
//
// Как это работает в пакете: транспайлер видит вызов зарегистрированного метода
// (`_pianoroll`, `_punchcard`, `_spiral`, `_pitchwheel`, `_scope`, `_spectrum`),
// переписывает его в `_pianoroll('<id>')` и кладёт в meta.widgets конфиг
// `{type, index, to}`. После eval StrudelMirror зовёт updateWidgets(), а
// BlockWidget.toDOM() достаёт готовый элемент из своего реестра по
// `getWidgetID(cfg)` = `<id>_widget_<type>_<index>`. Метод паттерна должен сам
// создать canvas и положить его в этот реестр — setWidget(id, canvas).
//
// Почему не работает «из коробки»: @strudel/codemirror регистрирует эти методы
// на СВОЁМ Pattern.prototype, а под esm.sh это не тот инстанс ядра, на котором
// евал-ится трек (та же причина, по которой нам нужен свой sliderWithID).
// Поэтому регистрируем руками на нашем core, а canvas отдаём в их реестр.
const widgetCanvases = {};

// ширина — по реальной ширине кода, иначе канвас 500px висит посреди пустой
// панели, а на узком окне вылезает за край. Замер один раз, при создании.
function codeWidth() {
  const el = document.querySelector('#root .cm-content');
  const w = el?.clientWidth || 0;
  return Math.max(320, Math.min(900, (w || 560) - 48));
}

function widgetCanvas(id, options = {}) {
  const { width = codeWidth(), height = 58, pixelRatio = window.devicePixelRatio || 1 } = options;
  let c = widgetCanvases[id];
  if (!c) {
    c = document.createElement('canvas');
    c.className = 'cm-inline-viz';
    widgetCanvases[id] = c;
  }
  // канвас 1:1 с CSS * pixelRatio: painter'ы считают геометрию в пикселях
  // канваса, поэтому растянутый CSS даёт мыло и уехавшие линии
  c.width = Math.round(width * pixelRatio);
  c.height = Math.round(height * pixelRatio);
  c.style.width = width + 'px';
  c.style.height = height + 'px';
  cm.setWidget(id, c); // реестр CodeMirror — оттуда его заберёт BlockWidget
  return c.getContext('2d');
}
// для отладки из консоли: какие канвасы уже созданы и под какими id
window.__vizCanvases = widgetCanvases;

// лайм панели по умолчанию; любой вызов может переопределить своими опциями.
// inactive не чёрный и не лайм: ноты должны читаться на тёмном фоне, но не
// спорить с активной (лаймовой) нотой и плейхедом.
const VIZ_LOOK = { active: '#b3d80d', inactive: '#6b7d55', playheadColor: '#e3f07a' };

// 🛑 ГЛАВНАЯ ЛОВУШКА ВИЗУАЛИЗАТОРОВ: __pianoroll рисует ноту с прозрачностью
// `velocity * gain` из значения hap'а. У нас `gain` — это РУЧКА ГРОМКОСТИ
// микшера, а все ударные по умолчанию стоят в нуле: картинка есть, нот не
// видно (проверено — на канвасе оставалась одна линия плейхеда). Поэтому в
// витрину отдаём копии hap'ов с gain = 1: ритм видно всегда, независимо от
// того, выкручена дорожка или нет. Звук при этом не трогаем — см. ниже, какая
// копия уходит в эфир, а какая только в canvas.
const vizHaps = (haps) =>
  haps.map((h) => {
    // уже 1 — не копируем: painter зовётся каждый кадр, а у хэтов это 300+ hap'ов
    if (h.value?.gain === 1) return h;
    const value = typeof h.value === 'object' && h.value !== null ? { ...h.value, gain: 1 } : { value: h.value, gain: 1 };
    return new core.Hap(h.whole, h.part, value, h.context);
  });

function registerInlineViz() {
  const P = core.Pattern.prototype;

  // pianoroll рисует сам (Pattern.prototype.draw → свой rAF), поэтому ему нужен
  // не painter, а сам паттерн. Отсюда приём с «тенью»: в эфир уходит исходный
  // паттерн (return this — звук и ручки как были), а рисуется его копия с
  // gain = 1 и тегом id.
  P._pianoroll = function (id, options = {}) {
    const ctx = widgetCanvas(id, options);
    const shadow = this.withHaps(vizHaps).tag(id);
    shadow.pianoroll({ fold: 1, ...VIZ_LOOK, ...options, ctx, id });
    return this;
  };

  // punchcard/spiral/pitchwheel работают наоборот: они вешают painter в state
  // паттерна (onPaint), а painter зовёт Drawer редактора — и painter обязан
  // висеть на ТОМ паттерне, который играет. Поэтому тут возвращаем this с
  // тегом, а gain правим уже внутри painter'а: нарисовать — да, сыграть — нет.
  //
  // 🛑 И рисуем НЕ переданные painter'у haps. Дорожка кончается
  // `.filter(audible)` — при нулевой громкости в паттерне нет ни одного hap'а,
  // и ролл был бы пустым (то есть ровно тем багом, который мы только что
  // вылечили). Поэтому спрашиваем свой, незагейченный паттерн: `self`.
  const ownHaps = (self, id, time, drawTime) => {
    const [lb, la] = drawTime ?? [-2, 2];
    const from = Math.max(0, time - Math.abs(lb));
    return vizHaps(self.queryArc(from, time + la).filter((h) => h.hasTag(id)));
  };

  P._punchcard = function (id, options = {}) {
    const ctx = widgetCanvas(id, options);
    const opts = { fold: 1, ...VIZ_LOOK, ...options, ctx, id };
    const self = this.tag(id);
    return self.onPaint((c, time, haps, drawTime) =>
      draw.__pianoroll({
        ctx,
        time,
        haps: ownHaps(self, id, time, drawTime),
        ...draw.getDrawOptions(drawTime, opts),
      }),
    );
  };

  // круглые — квадратный канвас, иначе кольцо растягивается в эллипс
  // `_spiral` сюда НЕ заведён намеренно: его функция рисования (drawSpiral)
  // не экспортируется из @strudel/draw, поэтому перехватить haps и починить
  // gain нельзя — на нулевой громкости он рисовал бы пустоту.
  P._pitchwheel = function (id, options = {}) {
    const size = options.size || 200;
    const opts = { width: size, height: size, ...VIZ_LOOK, ...options, size: size / 5, id };
    const ctx = widgetCanvas(id, opts);
    const self = this.tag(id);
    return self.onPaint((c, time, haps, drawTime) =>
      draw.pitchwheel({
        ...opts,
        time,
        ctx,
        // свой запрос, не haps от Drawer'а — см. ownHaps выше
        haps: ownHaps(self, id, time, drawTime).filter((h) => h.isActive(time)),
      }),
    );
  };

  // осциллограф/спектр живут в @strudel/webaudio; если их там нет — молча пропускаем
  if (typeof P.scope === 'function') {
    P._scope = function (id, options = {}) {
      const opts = { width: 500, height: 58, pos: 0.5, scale: 1, ...options };
      const ctx = widgetCanvas(id, opts);
      return this.tag(id).scope({ ...opts, ctx, id });
    };
  }
  if (typeof P.spectrum === 'function') {
    P._spectrum = function (id, options = {}) {
      const size = options.size || 200;
      const opts = { width: size, height: size, ...options, size: size / 5 };
      const ctx = widgetCanvas(id, opts);
      return this.tag(id).spectrum({ ...opts, ctx, id });
    };
  }
}

// ── 6. editor and transport ───────────────────────────────────────
let mirror;
let code = '';
let playing = false;

async function fillTrackSelect() {
  const sel = $('track');
  let list = [];
  try {
    const res = await fetch('/api/tracks');
    if (!res.ok) throw new Error(String(res.status));
    list = await res.json();
  } catch {
    list = [DEFAULT_TRACK]; // без сервера список не собрать — грузим дефолт
  }
  for (const p of list) {
    const o = document.createElement('option');
    o.value = p;
    o.textContent = trackName(p);
    sel.appendChild(o);
  }
  const fromHash = decodeURIComponent(location.hash.slice(1));
  const want = list.includes(fromHash) ? fromHash : DEFAULT_TRACK;
  sel.value = want;
  return want;
}

async function readTrack(p) {
  const res = await fetch(p);
  if (!res.ok) throw new Error(`${p}: ${res.status}`);
  return res.text();
}

// Заголовок и подпись — из самого файла: BPM берём из кода, а не из константы
// в панели, иначе при смене трека шапка врёт.
function showTrackInfo(p, src) {
  $('title').textContent = trackTitle(p);
  $('trackPath').textContent = trackName(p) + '.js';
  const bpm = /const\s+BPM\s*=\s*(\d+(?:\.\d+)?)/.exec(src);
  $('sub').textContent = bpm ? `${bpm[1]} BPM` : '';
}

async function loadTrack(p) {
  if (!mirror || p === track) return;
  setStatus('reading track…');
  const src = await readTrack(p);
  stop(); // старый паттерн глушим: иначе два трека играют разом
  track = p;
  code = src;
  importedScenes = null;
  scenes = scanScenes(src);
  renderScenes();
  mirror.setCode(src);
  showTrackInfo(p, src);
  // a different track uses different maps: reset the sample button/status
  const sBtn = $('samples');
  const sOut = $('sampleStatus');
  if (sBtn) { sBtn.textContent = 'SAMPLES'; sBtn.disabled = false; }
  if (sOut) sOut.textContent = '';
  history.replaceState(null, '', '#' + p);
  // даём CodeMirror разложить документ: evaluate() читает this.code, который
  // обновляет его же слушатель изменений
  await new Promise((r) => setTimeout(r, 0));
  await play(); // выбор в меню — это жест пользователя, звук уже разрешён
}

async function boot() {
  setStatus('loading engine…');
  const audioReady = wa.initAudioOnFirstClick();
  mini.miniAllStrings();

  setStatus('reading track…');
  track = await fillTrackSelect();
  code = await readTrack(track);
  scenes = scanScenes(code);
  renderScenes();
  showTrackInfo(track, code);

  // like loadModules() in strudel.cc: everything that must be visible in eval
  await core.evalScope(core, mini, tonal, wa, cm, { sliderWithID, slider });
  registerInlineViz(); // _pianoroll / _spiral / ... на нашем Pattern.prototype

  const CDN = 'https://strudel.b-cdn.net';
  mirror = new cm.StrudelMirror({
    root: $('root'),
    initialCode: code,
    // autodraw — это цикл отрисовки редактора: он каждый кадр зовёт painter'ы
    // всех паттернов. Нужен для _punchcard/_spiral/_pitchwheel (они копят
    // painter'ы через onPaint). _pianoroll рисует сам, через Pattern.draw.
    autodraw: true,
    drawTime: [-2, 2],
    // не getDrawContext() без аргумента: тот создаёт СВОЙ canvas во весь экран и
    // вставляет первым в body. У нас в разметке есть скрытый #test-canvas —
    // движок находит его и никуда не лезет.
    drawContext: draw.getDrawContext('test-canvas'),
    pattern: core.silence,
    defaultOutput: wa.webaudioOutput,
    getTime: wa.getAudioContextCurrentTime,
    transpiler,
    prebake: async () => {
      setStatus('samples…');
      // bank like strudel.cc: without uzu-drumkit there is no sh/oh/rim — three
      // tracks then quietly complain "sound not found", audible as empty hats
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
    // after any eval (PLAY or Ctrl+Enter) the widgets are rebuilt — so the slider
    // ids are new and the knobs must be rebuilt, otherwise they turn old ids and
    // the sound stops listening
    afterEval: () => {
      if (!mirror) return;
      buildKnobs();
    },
  });

  // StrudelMirror пишет на root ИНЛАЙН-стили:
  //   display:block; background-color: var(--background); font-size: 18px;
  // font-family: monospace
  // Инлайн сильнее любого нашего селектора (кроме !important), и это ровно два
  // наших симптома: фон перекрывал что угодно под редактором, а 18px — тот
  // самый крупный шрифт кода. Снимаем оба руками.
  const rootEl = $('root');
  rootEl.style.backgroundColor = 'transparent';
  rootEl.style.fontSize = '13px';

  // the track itself syncs sliders through window.strudelMirror
  window.strudelMirror = mirror;
  window.__mirror = mirror;
  window.__cm = cm;

  fillThemes();
  requestAnimationFrame(drawSpectrum);
  setStatus('ready — hit PLAY');
  return audioReady;
}

let audioReady;
async function play() {
  if (!mirror) return;
  await audioReady;
  if (!eq) buildMasterChain();
  setStatus('starting…');
  await mirror.evaluate();
  playing = true;
  $('play').classList.add('on');
  buildKnobs();
  startTimeline();
  setStatus(`${knobs.length} knobs · playing`);
}

function stop() {
  if (!mirror) return;
  stopTimeline();
  mirror.stop();
  playing = false;
  $('play').classList.remove('on');
  setStatus(`${knobs.length} knobs · stopped`);
}

$('play').addEventListener('click', () => play().catch((e) => setStatus(e.message, true)));
$('stop').addEventListener('click', () => stop());
$('track').addEventListener('change', (e) => {
  loadTrack(e.target.value).catch((err) => setStatus(err.message, true));
});

// @strudel/codemirror binds exactly `Ctrl-Enter` / `Ctrl-.` (not Mod), so the
// usual Cmd+Enter is silent on a mac. Add Cmd only: Ctrl stays with the editor,
// no double eval.
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

bindScenes();
bindPadKeys();
audioReady = boot().catch((e) => {
  console.error(e);
  setStatus(e.message, true);
});
