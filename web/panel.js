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
//    are hidden on desktop and shown at the bottom of the mobile stack.

// Локальный бандл (см. tools/build-vendor.mjs): один инстанс core для паттернов,
// codemirror и draw; никаких esm.sh в рантайме.
const V = await import('/web/vendor/strudel.js');
const cm = V.cm;
const core = V.core;
const mini = V.mini;
const tonal = V.tonal;
const wa = V.wa;
const draw = V.draw;
const { transpiler } = V.transpilerMod;

// Custom theme: all syntax colors from sublime, code panel + gutters black.
const ROOMV = 'RoomVDark';
if (cm.themes && cm.themes.sublime && !cm.themes[ROOMV]) {
  cm.themes[ROOMV] = cm.themes.sublime;
  cm.settings[ROOMV] = {
    ...cm.settings.sublime,
    background: '#000000',
    lineBackground: '#00000000',
    gutterBackground: '#000000',
  };
}

// Трек не зашит: меню в шапке собирается из /api/tracks (tools/serve.mjs
// читает папку tracks/), поэтому новый файл появляется в списке сам.
// Хэш в адресе (#/tracks/techno/13-gabber-v3.js) — чтобы ссылку можно было
// дать другому и открыть тот же трек.
const DEFAULT_TRACK = '/tracks/techno/12-slowtrap-v3.js';
let track = DEFAULT_TRACK;
const AUTOSAVE_KEY = 'strudex:autosave';
let baseCode = '';
let lastAutosaveCode = '';
let autosaveTimer = null;

const trackName = (p) => p.replace(/^\/tracks\//, '').replace(/\.js$/, '');
const trackTitle = (p) => {
  const base = trackName(p).split('/').pop() ?? p;
  return base.replace(/^\d+-/, '').replace(/-/g, ' ');
};
const trackHeaderInfo = (p, src) => {
  const first = (src.split('\n')[0] ?? '').replace(/^\/\/\s*/, '').trim();
  const parts = first.split('·').map((v) => v.trim()).filter(Boolean);
  return {
    title: parts[1] || trackTitle(p),
    style: parts[0] || '',
    bpm: parts[2] || '',
  };
};

const $ = (id) => document.getElementById(id);
const statusEl = $('status');
const setStatus = (t, err) => {
  statusEl.textContent = t;
  statusEl.className = err ? 'err' : '';
};

// ── sample preloader ──────────────────────────────────────────────
// Universal: read the sample maps the current track declares in samples(...),
// then match every string literal in the track against those map keys. No
// hard-coded sample names. `warmSampleNetwork` starts on page load and fills
// the HTTP cache (no AudioContext needed); `downloadAllSamples` decodes into
// the engine cache after the first gesture, when loadBuffer is allowed.
let sampleBusy = false;
let sampleQueued = false;
let sampleRun = 0;
let sampleLoadedFor = '';
let warmRun = 0;

function currentTrackSource() {
  const raw = globalThis.strudelMirror?.editor?.state?.doc?.toString?.() ?? code ?? '';
  return raw.replace(/^\s*\/\/.*$/gm, '');
}

async function collectSampleUrls(src, isCurrent = () => true) {
  const mapUrls = [...new Set([
    'https://strudel.b-cdn.net/uzu-drumkit.json',
    ...[...src.matchAll(/\bsamples\(\s*['"]([^'"]+)['"]/g)].map((m) => m[1]),
  ])];
  const maps = new Map();
  for (const u of mapUrls) {
    if (!isCurrent()) return [];
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

  const used = new Set();
  for (const m of src.matchAll(/['"]([^'"]+)['"]/g)) {
    for (const token of m[1].match(/[a-zA-Z][a-zA-Z0-9_]*/g) ?? []) {
      if (maps.has(token)) used.add(token);
    }
  }
  const urls = [];
  for (const key of used) {
    for (const url of maps.get(key) ?? []) {
      if (!urls.includes(url)) urls.push(url);
    }
  }
  return urls;
}

let sampleProgTimer = null;
function setSampleProgress(fraction, done = false) {
  const el = $('sampleProg');
  if (!el) return;
  const bar = el.firstElementChild;
  clearTimeout(sampleProgTimer);
  if (fraction > 0) el.classList.add('on');
  bar.style.width = `${Math.max(0, Math.min(1, fraction)) * 100}%`;
  if (done) {
    sampleProgTimer = setTimeout(() => {
      el.classList.remove('on');
      bar.style.width = '0%';
    }, 900);
  }
}

// Page-load warm-up: download bytes into the browser cache before PLAY.
async function warmSampleNetwork() {
  const run = ++warmRun;
  const out = $('sampleStatus');
  const urls = await collectSampleUrls(currentTrackSource(), () => run === warmRun);
  if (!urls.length) return;
  if (out) out.textContent = `warming 0 / ${urls.length}`;
  setSampleProgress(0.01);
  let done = 0;
  for (const url of urls) {
    if (run !== warmRun) return;
    try {
      await fetch(url, { cache: 'force-cache' });
    } catch {}
    done++;
    setSampleProgress((done / urls.length) * 0.7);
    if (out && done % 5 === 0) out.textContent = `warming ${done} / ${urls.length}`;
  }
  setSampleProgress(0.7);
  if (out) out.textContent = `warmed ${done} / ${urls.length}`;
}

async function downloadAllSamples() {
  const run = ++sampleRun;
  warmRun++; // stop the network warm-up; we are decoding now
  if (sampleBusy) {
    sampleQueued = true;
    return;
  }
  const btn = $('samples');
  const out = $('sampleStatus');
  sampleBusy = true;
  btn.disabled = true;
  btn.textContent = 'SAMPLES…';
  out.textContent = 'scanning…';

  try {
    const src = currentTrackSource();
    if (src === sampleLoadedFor) {
      out.textContent = 'samples cached';
      btn.textContent = 'SAMPLES ✓';
      setSampleProgress(1, true);
      return;
    }
    const urls = await collectSampleUrls(src, () => run === sampleRun);
    if (!urls.length) {
      out.textContent = 'no matching sample keys';
      btn.textContent = 'SAMPLES';
      setSampleProgress(0, true);
      return;
    }

    setSampleProgress(0.7);
    let done = 0;
    let failed = 0;
    out.textContent = `0 / ${urls.length}`;
    for (const url of urls) {
      if (run !== sampleRun) break;
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
      setSampleProgress(0.7 + (done / urls.length) * 0.3);
      out.textContent = `${done} / ${urls.length}${failed ? ` · ${failed} err` : ''}`;
    }
    out.textContent = failed ? `done · ${failed} errors` : `all ${done} loaded`;
    btn.textContent = failed ? 'SAMPLES ⚠' : 'SAMPLES ✓';
    setSampleProgress(1, true);
    if (!failed) sampleLoadedFor = src;
  } catch (e) {
    out.textContent = e.message;
    btn.textContent = 'SAMPLES';
    setSampleProgress(0, true);
  } finally {
    sampleBusy = false;
    btn.disabled = false;
    if (sampleQueued) {
      sampleQueued = false;
      downloadAllSamples();
    }
  }
}

$('samples')?.addEventListener('click', downloadAllSamples);
bindUnsaved();

/*
 * FUTURE / WIP: offline WAV export (button removed from the final UI).
 * STATUS: unfinished, does NOT work end-to-end.
 *  - exports only part of the instruments (the renderer's sound/sample
 *    registry and the live registry are not fully shared);
 *  - output can be empty or missing layers;
 *  - extremely slow, especially on the full track;
 *  - full-track export needs chunking or a real-time recorder.
 *
 * async function exportWav() {
 *   if (!mirror) return;
 *   const pattern = mirror.repl?.state?.pattern ?? mirror.state?.pattern;
 *   if (!pattern) {
 *     setStatus('nothing to export — press PLAY first', true);
 *     return;
 *   }
 *   const sched = mirror.repl?.scheduler;
 *   let cps = Number(sched?.cps);
 *   if (!Number.isFinite(cps) || cps <= 0) {
 *     const bpm = Number(/const\\s+BPM\\s*=\\s*(\\d+(?:\\.\\d+)?)/.exec(code)?.[1]);
 *     cps = bpm > 0 ? bpm / 4 / 60 : 0.5;
 *   }
 *   const total = timeline.length
 *     ? Math.max(...timeline.map((s) => s.at + (s.length ?? s.len ?? 0)))
 *     : 32;
 *   const sel = timelineSel >= 0
 *     ? timeline[timelineSel]
 *     : (timeline.find((s) => /^DROP/i.test(s.name)) ?? timeline[0]);
 *   const start = sel ? sel.at : 0;
 *   const end = sel ? sel.at + (sel.length ?? sel.len ?? 0) : Math.min(total, 16);
 *   const label = sel ? String(sel.name || 'section').replace(/[^\\w.-]+/g, '-') : 'bars';
 *   const base = (track.split('/').pop() || 'track').replace(/\\.js$/i, '');
 *   const name = `${base}-${label}`;
 *   setStatus(`exporting ${label} (${end - start} bars) → ${name}.wav…`);
 *   try {
 *     await wa.renderPatternAudio(pattern, cps, start, end, 44100, 128, true, name);
 *     if (playing) stop();
 *     setStatus(`wav exported: ${name}.wav — press PLAY to continue`);
 *   } catch (e) {
 *     setStatus('export failed: ' + e.message, true);
 *   }
 * }
 * $('exportWav')?.addEventListener('click', exportWav);
 */




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
    // Крутили виджет в редакторе — это и есть новая base-громкость.
    // Посты самой панели (mute/solo) помечены internal и base не трогают.
    if (!d.internal && ui.knob && ui.knob.name === 'vol') {
      ui.knob.value = d.value;
      ui.knob.base = d.value;
    }
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
  bindEq();
}

// ── MASTER EQ ─────────────────────────────────────────────────────
// Hidden on desktop, shown at the bottom of the mobile stack (index.html).
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

// `$:`-блоки по порядку. Для каждого собираем: group.inst, которые он
// упоминает; сэмплы `s('…')` (база + индекс `:N`); и vol-пути — по текущему
// значению gain в hap'е понимаем, чей это звук (gain в hap уже число).
function sampleParts(lit) {
  const raw = lit.trim();
  const m = /:(\d+)/.exec(raw);
  return { base: raw.split(/[:\/*!?@\s]/)[0].trim(), n: m ? Number(m[1]) : null };
}
function laneSamples(text) {
  const out = [];
  const re = /\b(?:s|sound)\(\s*'([^']+)'\s*\)/g;
  let m;
  while ((m = re.exec(text))) out.push(sampleParts(m[1]));
  return out;
}
function scanLanes(src, sites) {
  const instruments = new Set();
  for (const s of sites) {
    if (s.path.length >= 2) instruments.add(`${s.path[0]}.${s.path[1]}`);
  }
  const known = [...instruments];
  const lines = src.split('\n');
  const lanes = [];
  let i = 0;
  while (i < lines.length) {
    if (!lines[i].startsWith('$:')) { i++; continue; }
    const block = [lines[i]];
    i++;
    while (i < lines.length) {
      const line = lines[i];
      if (line.trim() === '' || /^\s/.test(line)) { block.push(line); i++; continue; }
      break;
    }
    const text = block.join('\n');
    const insts = new Set();
    for (const inst of known) {
      const [g, name] = inst.split('.');
      if (new RegExp(`\\b${g}\\.${name}\\b`).test(text)) insts.add(inst);
    }
    const samples = laneSamples(text);
    if (/grainChain\b/.test(text)) {
      for (const inst of known) if (inst.endsWith('.grain')) insts.add(inst);
      samples.push({ base: 'funkydrummer', n: null });
    }
    lanes.push({ insts, samples, vols: [...insts].map((x) => `${x}.vol`) });
  }
  return lanes;
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

// UI-манифест в коде (не в комментариях): const UI = { ... } — валидный JSON.
//   "transport": { "name": "...", "labels": [...] }  (0 jam, 1 timeline, max HOLD)
//   "holdBar": "..."
//   "switches": { "name": ["v1","v2",...] }          (2+ варианта = группа)
// Разбор JS-литерала (объект/массив/строки/числа) без eval: манифест UI
// должен выглядеть как обычный JS, а не как заэкранированный JSON.
function parseJSLiteral(src, i) {
  const skip = () => {
    for (;;) {
      while (i < src.length && /\s/.test(src[i])) i++;
      if (src[i] === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
      if (src[i] === '/' && src[i + 1] === '*') { i += 2; while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; continue; }
      break;
    }
  };
  const readString = () => {
    const q = src[i++];
    let out = '';
    while (i < src.length && src[i] !== q) {
      if (src[i] === '\\') {
        const n = src[i + 1];
        out += n === 'n' ? '\n' : n === 't' ? '\t' : n;
        i += 2;
      } else out += src[i++];
    }
    i++;
    return out;
  };
  const readValue = () => {
    skip();
    const ch = src[i];
    if (ch === '{') {
      i++;
      const obj = {};
      for (;;) {
        skip();
        if (src[i] === '}') { i++; break; }
        let key;
        if (src[i] === '"' || src[i] === "'") key = readString();
        else {
          const st = i;
          while (i < src.length && /[A-Za-z0-9_$]/.test(src[i])) i++;
          key = src.slice(st, i);
        }
        skip();
        if (src[i] !== ':') throw new Error('expected :');
        i++;
        obj[key] = readValue();
        skip();
        if (src[i] === ',') { i++; continue; }
        if (src[i] === '}') { i++; break; }
        throw new Error('expected , or }');
      }
      return obj;
    }
    if (ch === '[') {
      i++;
      const arr = [];
      for (;;) {
        skip();
        if (src[i] === ']') { i++; break; }
        arr.push(readValue());
        skip();
        if (src[i] === ',') { i++; continue; }
        if (src[i] === ']') { i++; break; }
        throw new Error('expected , or ]');
      }
      return arr;
    }
    if (ch === '"' || ch === "'") return readString();
    if (ch === '-' || /[0-9]/.test(ch)) {
      const st = i;
      i++;
      while (i < src.length && /[0-9.eE+-]/.test(src[i])) i++;
      return Number(src.slice(st, i));
    }
    const st = i;
    while (i < src.length && /[A-Za-z0-9_$]/.test(src[i])) i++;
    const word = src.slice(st, i);
    if (word === 'true') return true;
    if (word === 'false') return false;
    if (word === 'null') return null;
    throw new Error('unexpected literal');
  };
  return { value: readValue(), end: i };
}

function scanUI(src) {
  const m = /const\s+UI\s*=\s*/.exec(src);
  if (!m) return null;
  try {
    const { value } = parseJSLiteral(src, m.index + m[0].length);
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  } catch (e) { return null; }
}

// Свитчи, у которых значение берётся из секций (автоматика таймлайна).
// В SONG/HOLD они неинтерактивны — панель их не показывает.
function scanTimelineSwitches(src) {
  const out = new Set();
  const re = /autoSwitch\(\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src))) out.add(m[1]);
  return out;
}

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
let timelineSwitches = new Set(); // свитчи, которыми в SONG/HOLD ведёт TIMELINE
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

// Трек может связать инструмент с групповым mute-слайдером:
//   skorHighA: { ..., mute: 'muteSkor' }
// Панель тогда рисует G рядом с M/S, а верхний ряд @mutes скрывает.
function scanInstrumentMutes(src) {
  const out = new Map();
  const re = /^ {4}(\w+): \{([\s\S]*?)^ {4}\},/gm;
  let m;
  while ((m = re.exec(src))) {
    const mm = /^\s{6}mute:\s*'([^']+)'/m.exec(m[2]);
    if (mm) out.set(m[1], mm[1]);
  }
  return out;
}
let instrumentMutes = new Map();

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
let automation = []; // const AUTOMATION = [{ path, points: [[bar, value], ...] }]
let timelineSel = -1;
let timelineTimer = null;
let timelineBar = 0;
let timelineLoop = true;
let timelineLines = []; // line of each TIMELINE section
let automationLines = []; // line of each AUTOMATION entry
let pendingSeek = null;
const soloed = new Set();
const muted = new Set();

// ── LIVE ACTIVITY: какие инструменты звучат прямо сейчас ─────────
// Repl вешает на каждый `$:`-паттерн controls.id (`$1`, `$2`, … по порядку).
// Мы разбираем `$:`-блоки в том же порядке и знаем, какие group.inst они
// трогают; в такте спрашиваем играющий pattern и подсвечиваем точки.
let activityLanes = []; // { insts:Set, samples:[{base,n}], vols:[…] }
let actTimer = null;
const actSeen = new Map(); // 'drums.kick' → performance.now()
const ACT_TTL = 200;
let defaultMutesApplied = false;
const knobByAnchor = new Map(); // widget id → { input, out }
// HOLD: номер секции (0 = выкл) и такт для снимка AUTOMATION. Панель пишет
// их только в движок (без правки документа) — это перформанс-состояние.
const knobByName = (name) => knobs.find((k) => k.name === name && k.path.length === 0)
// Панель не знает имён трека: роли объявляются UI-манифестом в коде
// (transport/holdBar/switches). Без манифеста — фолбэк на имена для старых
// треков: транспорт `song`, такт `holdBar`.
let transportName = 'song';
let holdBarName = 'holdBar';
const holdBarKnob = () => knobByName(holdBarName);
const playKnob = () => knobByName(transportName);
const transportMax = () => { const k = playKnob(); return k ? Math.round(k.max) : 1; };
const playState = () => {
  const k = playKnob();
  if (!k) return 1;
  return Math.max(0, Math.min(transportMax(), Math.round(Number(k.value))));
};
const inHold = () => {
  const k = playKnob();
  const max = transportMax();
  return !!k && max >= 2 && Math.round(Number(k.value)) === max;
};
const holdBarValue = () => { const k = holdBarKnob(); return k ? Math.round(Number(k.value)) : 0; }
const sectionIndexAtBar = (bar) => {
  if (!timeline.length) return -1;
  for (let i = 0; i < timeline.length; i++) {
    if (bar < timeline[i].at + timeline[i].length) return i;
  }
  return timeline.length - 1;
}
const heldSection = () => (inHold() ? sectionIndexAtBar(holdBarValue()) : -1)
let holdBarCache = 0;
function setKnobLive(k, v) {
  if (!k) return;
  k.value = Number(v);
  window.postMessage({ type: 'cm-slider', id: 'slider_' + k.anchor, value: Number(v), internal: true }, null);
}
// HOLD-такт: только в движок (в документ не пишем — это перформанс-состояние).
function setHoldBar(bar) {
  const v = Math.max(0, Math.min(Math.max(0, tlTotal() - 1), Math.round(bar)));
  holdBarCache = v;
  setKnobLive(holdBarKnob(), v);
}
// В LOOP таймлайн и автоматика не работают: сворачиваем и блокируем их,
// чтобы никто не тыкал в то, что не реагирует. Возврат в SONG/HOLD
// разворачивает таймлайн и возвращает автоматику как было.
let automationOpenBeforeLock = false;
function applyModeLock() {
  const loop = playState() === 0;
  const tl = $('timeline');
  const au = $('automation');
  const tlLoopBtn = $('tlLoop');
  if (tlLoopBtn) tlLoopBtn.style.display = loop ? 'none' : '';
  if (tl) {
    const wasLocked = tl.classList.contains('mode-locked');
    if (loop) {
      tl.classList.add('mode-locked');
      tl.open = false;
    } else {
      tl.classList.remove('mode-locked');
      if (wasLocked) tl.open = true; // возврат из LOOP — разворачиваем
    }
  }
  if (au) {
    if (loop) {
      if (!au.classList.contains('mode-locked')) automationOpenBeforeLock = au.open;
      au.classList.add('mode-locked');
      au.open = false;
    } else {
      const was = au.classList.contains('mode-locked') ? automationOpenBeforeLock : au.open;
      au.classList.remove('mode-locked');
      au.open = !!was;
    }
  }
}
function lockDetailsToggle(id) {
  const el = $(id);
  const summary = el?.querySelector('summary');
  if (!summary) return;
  const isControl = (e) => !!e.target?.closest?.('button, input, select, textarea, a, [role="button"]');
  const block = (e) => {
    if (!el.classList.contains('mode-locked')) return;
    if (isControl(e)) return; // кнопки внутри summary (режим, play/stop) работают
    e.preventDefault();
    e.stopPropagation();
  };
  summary.addEventListener('click', block, true);
  summary.addEventListener('keydown', (e) => {
    if (!el.classList.contains('mode-locked')) return;
    if (isControl(e)) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
}
const openState = new Map(); // 'group' / 'group.inst' → свёрнуто ли
// Groups/instruments that open by default in the Tone column.
const AUTO_OPEN_GROUPS = new Set(['keys', 'moog', 'arp', 'arp2'])
const AUTO_OPEN_INSTS = new Set(['keys', 'moog', 'arp', 'arp2'])

function buildKnobs() {
  const src = mirror.editor.state.doc.toString();
  const ui = scanUI(src);
  // Источник — UI-манифест в коде. Фолбэк на имена — только для старых треков,
  // где манифеста ещё нет (никаких комментариев-маркеров).
  transportName = ui?.transport?.name || 'song';
  holdBarName = ui?.holdBar || 'holdBar';
  const { sites, names } = scanSliders(src);
  labels = names;
  switchCaps = {};
  if (ui && ui.switches && typeof ui.switches === 'object') {
    for (const [k, v] of Object.entries(ui.switches)) {
      switchCaps[k] = Array.isArray(v) ? v.map(String) : [];
    }
  } else {
    switchCaps = scanSwitchCaps(src);
  }
  if (ui?.transport?.labels) switchCaps[transportName] = ui.transport.labels.map(String);
  timelineSwitches = scanTimelineSwitches(src);
  padNames = scanPadNames(src);
  muteNames = scanMuteNames(src);
  instrumentMutes = scanInstrumentMutes(src);
  timeline = scanTimeline(src);
  automation = scanAutomation(src);
  timelineLines = scanTimelineLines(src);
  automationLines = scanAutomationLines(src, automation);
  renderAutomation();
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
      anchor: w.originalFrom ?? w.from,
      min: w.min,
      max: w.max,
      step: w.step,
      value: Number(w.value),
      base: Number(w.value),   // последняя «человеческая» громкость; mute её не трогает
    });
  }
  activityLanes = scanLanes(src, sites);
  renderTimeline();
  render();
  applyModeLock();
  if (inHold()) setKnobLive(holdBarKnob(), holdBarCache);
  if (!defaultMutesApplied && /^[ \t]*\/\/[ \t]*@defaultMutes/m.test(src)) {
    applyDefaultMutes();
  }
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
      if (k.name === holdBarName) continue;
      if (muteNames.has(k.name)) mutes.push(k);
      else if (padNames.has(k.name)) pads.push(k);
      else if (isSwitch(k)) {
        // Свитч = группа только если реально есть из чего выбирать:
        // в UI/@switches объявлено ≥2 подписи. Один вариант — не свитч.
        const caps = switchCaps[k.name];
        const hasVariants = !caps || caps.length >= 2;
        // Свитчи, привязанные к TIMELINE, интерактивны только в LOOP:
        // в SONG/HOLD их значение берётся из секции, кнопки ничего не меняют.
        const timelineDriven = timelineSwitches.has(k.name) && playState() !== 0;
        if (hasVariants && !timelineDriven) switches.push(k);
      } else globals.push(k);
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
  applyMixerState();
}

function renderGlobals(list) {
  const root = $('globalRows');
  root.innerHTML = '';
  for (const k of list) root.appendChild(makeRow(k));
  // блок не скрываем никогда: в нём живёт мастер-громкость (см. index.html)
}

// Переключатели — не ползунки: у mode 4 положения, у harmony 2. Рисуем кнопки,
// значение всё равно пишется в документ тем же setKnob.
// Режим (LOOP/SONG/HOLD) живёт в шапке таймлайна, остальные свитчи — в #switches.
function renderModeSwitch(k, root) {
  root.innerHTML = '';
  const caps = switchCaps[k.name] || [];
  const vals = [];
  for (let v = k.min; v <= k.max + 1e-9; v += 1) vals.push(v);
  const btns = [];
  const cur = Math.round(k.value);
  vals.forEach((v, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = (caps[i] || String(v)).toUpperCase();
    b.title = caps[i] || `${k.name} ${v}`;
    b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      k.value = v;
      setKnob(k, v);
      if (v === transportMax()) setHoldBar(timelineBar);
      renderTimeline();
      render();
      applyModeLock();
      btns.forEach((o, j) => o.classList.toggle('on', vals[j] === v));
    });
    btns.push(b);
    root.appendChild(b);
  });
  btns.forEach((b, i) => b.classList.toggle('on', vals[i] === cur));
}

function renderSwitches(list) {
  const root = $('switches');
  const modeRoot = $('playMode');
  const modeGroup = $('playModeGroup');
  root.innerHTML = '';
  if (modeRoot) modeRoot.innerHTML = '';
  for (const k of list) {
    if (modeRoot && k.name === transportName) {
      renderModeSwitch(k, modeRoot);
      continue;
    }
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
    const btnsBox = document.createElement('span');
    btnsBox.className = 'btns';
    box.appendChild(btnsBox);
    vals.forEach((v, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = (caps[i] || String(v)).toUpperCase();
      b.title = caps[i] || `${k.name} ${v}`;
      b.addEventListener('click', () => {
        k.value = v;
        setKnob(k, v);
        if (k.name === transportName) {
          if (v === transportMax()) setHoldBar(timelineBar);
          renderTimeline();
        }
        for (const other of btns) other.classList.toggle('on', other === b);
      });
      btns.push(b);
      btnsBox.appendChild(b);
    });
    const cur = Math.round(k.value);
    btns.forEach((b, i) => b.classList.toggle('on', vals[i] === cur));
    root.appendChild(box);
  }
  if (modeGroup) modeGroup.style.display = modeRoot && modeRoot.childElementCount ? '' : 'none';
  root.hidden = root.childElementCount === 0;
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
const MUTE_COLORS = ['#e06c5b', '#7fb0ff', '#e3f07a', '#c792ea', '#7bd1a8', '#f2a65a'];

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
  const linked = new Set(instrumentMutes.values());
  const allLinked = list.length > 0 && list.every((k) => linked.has(k.name));
  root.style.display = allLinked ? 'none' : '';
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

// ── TIMELINE: native const TIMELINE + horizontal editor ─────────
// Данные живут в треке как обычный JS-массив. Панель его читает/пишет,
// рисует секции и playhead. Автоматизация — нативная (tlCurve/arrange);
// правки применяются по Ctrl+Enter. Слайдеры остаются hot.
const TL_LANES = ['kick', 'sub', 'dub', 'pad', 'stab', 'organ', 'skank', 'horns', 'moog', 'arp', 'perc'];

function timelineLiteral(src) {
  const m = /const\s+TIMELINE\s*=\s*/.exec(src);
  if (!m) return null;
  const start = m.index + m[0].length;
  if (src[start] !== '[') return null;
  let depth = 0;
  let inStr = false;
  let quote = '';
  let esc = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === quote) inStr = false;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = true; quote = c; continue; }
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) return { start, end: i + 1, json: src.slice(start, i + 1) };
    }
  }
  return null;
}

function tlQuote(v) {
  return "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

function formatTimelineLiteral() {
  const lines = ['['];
  for (const sec of timeline) {
    lines.push('  {');
    lines.push(`    at: ${sec.at},`);
    lines.push(`    len: ${sec.length},`);
    lines.push(`    name: ${tlQuote(sec.name)},`);
    const vals = Object.entries(sec.values || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
    lines.push(`    values: { ${vals} },`);
    lines.push('  },');
  }
  lines.push(']');
  return lines.join('\n');
}

function scanTimeline(src) {
  let arr = null;
  const lit = timelineLiteral(src);
  if (lit) {
    try { arr = Function('"use strict"; return (' + lit.json + ')')(); } catch { arr = null; }
    if (!Array.isArray(arr)) {
      try { arr = JSON.parse(lit.json); } catch { arr = null; }
    }
  }
  if (!Array.isArray(arr)) {
    const line = /^[ \t]*\/\/[ \t]*@timeline[ \t]+(.+)$/m.exec(src);
    if (line) {
      try { arr = JSON.parse(line[1].trim()); } catch { arr = null; }
    }
  }
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((s) => s && Number.isFinite(Number(s.at)))
    .map((s) => ({
      at: Math.max(0, Number(s.at) || 0),
      length: Math.max(1, Number(s.len ?? s.length) || 8),
      name: String(s.name || 'section'),
      values: s.values && typeof s.values === 'object' ? s.values : {},
    }));
}

const tlTotal = () => Math.max(8, ...timeline.map((s) => s.at + s.length));

// Секции всегда идут подряд: длина одной сдвигает at всех следующих.
function reflowTimeline() {
  let at = 0;
  for (const sec of timeline) {
    sec.at = at;
    at += sec.length;
  }
}
const tlKeyLabel = (key) => key;

function updatePlayhead(bar = timelineBar) {
  const el = $('tlPlayhead');
  if (!el) return;
  const total = tlTotal();
  el.style.left = `${Math.max(0, Math.min(100, (bar / total) * 100))}%`;
}

// Перемотка. В main-thread scheduler у Strudel нет setCycle, поэтому
// двигаем его внутренний курсор (lastEnd/lastBegin/num_cycles...). Если
// появится setCycle, используем его. Это единственное место, где лезем
// во внутренности планировщика.
function seekTimeline(bar) {
  if (!mirror) return;
  const total = tlTotal();
  const target = Math.max(0, Math.min(Math.max(0, total - 1), Math.round(bar)));
  const s = mirror.repl?.scheduler;
  if (s) {
    if (typeof s.setCycle === 'function') {
      s.setCycle(target);
    } else if ('lastEnd' in s) {
      s.lastEnd = target;
      s.lastBegin = target;
      s.num_cycles_at_cps_change = target;
      s.num_ticks_since_cps_change = 0;
      const dur = Number(s.clock?.duration) || 0.1;
      if (typeof s.getTime === 'function') s.lastTick = s.getTime() - dur;
    }
  }
  timelineBar = target;
  updatePlayhead(target);
  if (!playing) {
    pendingSeek = target;
    setSceneStatus(`seek: bar ${target} (on play)`);
    return;
  }
  setSceneStatus(`seek: bar ${target}`);
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
  const held = heldSection();
  timeline.forEach((sec, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tl-block' + (i === timelineSel ? ' sel' : '') + (i === held ? ' hold' : '');
    b.style.left = `${(sec.at / total) * 100}%`;
    b.style.width = `${Math.max(1.5, (sec.length / total) * 100)}%`;
    b.title = `${sec.name} · bars ${sec.at}–${sec.at + sec.length}`;
    const nm = document.createElement('span');
    nm.className = 'nm';
    nm.textContent = sec.name;
    const mt = document.createElement('span');
    mt.className = 'mt';
    mt.textContent = `${sec.at}–${sec.at + sec.length}`;
    b.append(nm, mt);
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      timelineSel = i;
      if (inHold()) {
        setHoldBar(sec.at);
        seekTimeline(sec.at);
        setSceneStatus(`hold: ${sec.name} @${sec.at}`);
      }
      renderTimeline();
      scrollEditorToLine(timelineLines[i]);
    });
    // Двойной клик — войти в HOLD на этой секции (если ещё не в нём).
    b.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const pk = playKnob();
      if (!pk) return;
      if (!inHold()) setKnob(pk, transportMax());
      setHoldBar(sec.at);
      timelineSel = i;
      seekTimeline(sec.at);
      renderTimeline();
      setSceneStatus(`hold: ${sec.name} @${sec.at}`);
    });
    secs.appendChild(b);
  });
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

  const nameRow = textRow('name', sec.name, (v) => {
    sec.name = String(v || 'section');
    commitTimeline();
  });
  const atRow = textRow('at', sec.at, () => {}, 'number');
  const atInput = atRow.querySelector('input');
  if (atInput) {
    atInput.disabled = true;
    atInput.title = 'auto: sections are contiguous';
  }
  const lenRow = textRow('length', sec.length, (v) => {
    const n = Math.max(1, Number(v) || 1);
    sec.length = n;
    commitTimeline();
  }, 'number');
  root.append(nameRow, atRow, lenRow);

  const moveRow = document.createElement('div');
  moveRow.className = 'tl-row';
  const moveLab = document.createElement('label');
  moveLab.textContent = 'order';
  const up = document.createElement('button');
  up.type = 'button';
  up.textContent = '↑';
  up.title = 'move section earlier';
  const down = document.createElement('button');
  down.type = 'button';
  down.textContent = '↓';
  down.title = 'move section later';
  up.addEventListener('click', () => {
    if (timelineSel <= 0) return;
    [timeline[timelineSel - 1], timeline[timelineSel]] = [timeline[timelineSel], timeline[timelineSel - 1]];
    timelineSel--;
    commitTimeline();
  });
  down.addEventListener('click', () => {
    if (timelineSel >= timeline.length - 1) return;
    [timeline[timelineSel + 1], timeline[timelineSel]] = [timeline[timelineSel], timeline[timelineSel + 1]];
    timelineSel++;
    commitTimeline();
  });
  moveRow.append(moveLab, up, down);
  root.appendChild(moveRow);

  const vals = document.createElement('div');
  vals.className = 'tl-vals';
  const entries = Object.entries(sec.values || {});
  for (const [key, raw] of entries) {
    const row = document.createElement('div');
    row.className = 'tl-val';
    const lab = document.createElement('span');
    lab.textContent = tlKeyLabel(key) + ' ×';
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
  const lanes = [...new Set([...TL_LANES, ...Object.keys(sec.values || {})])];
  for (const key of lanes) {
    const o = document.createElement('option');
    o.value = key;
    o.textContent = key;
    sel.appendChild(o);
  }
  sel.value = lanes[0];
  const val = document.createElement('input');
  val.type = 'number';
  val.step = '0.01';
  val.value = sec.values[sel.value] ?? 1;
  sel.addEventListener('change', () => {
    val.value = sec.values[sel.value] ?? 1;
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
  reflowTimeline();
  timelineSel = sel ? timeline.indexOf(sel) : -1;
  writeTimeline();
  renderTimeline();
}

function writeTimeline() {
  if (!mirror) return;
  const data = timeline.map((s) => ({
    at: s.at,
    len: s.length,
    name: s.name,
    values: s.values,
  }));
  const json = JSON.stringify(data);
  const literal = formatTimelineLiteral();
  const src = mirror.editor.state.doc.toString();
  const lit = timelineLiteral(src);
  if (lit) {
    mirror.editor.dispatch({ changes: { from: lit.start, to: lit.end, insert: literal } });
  } else {
    const m = /^([ \t]*\/\/[ \t]*@timeline[ \t]+)(.*)$/m.exec(src);
    if (m) {
      const from = m.index + m[1].length;
      mirror.editor.dispatch({ changes: { from, to: m.index + m[0].length, insert: json } });
    } else {
      const c = /^.*setcpm\(.*\).*$/m.exec(src);
      const pos = c ? c.index + c[0].length : 0;
      mirror.editor.dispatch({ changes: { from: pos, to: pos, insert: `\nconst TIMELINE = ${literal}\n` } });
    }
  }
  setStatus('timeline saved — Ctrl+Enter or APPLY');
}

function addTimelineSection() {
  const end = timeline.length ? Math.max(...timeline.map((s) => s.at + s.length)) : 0;
  const at = Math.max(end, Math.floor(timelineBar));
  timeline.push({ at, length: 8, name: `SEC ${timeline.length + 1}`, values: {} });
  timelineSel = timeline.length - 1;
  commitTimeline();
}

// ── AUTOMATION: изменения слайдеров во времени ───────────────────
// const AUTOMATION = [{ path: 'keys.lead.cut', points: [[24, 2200], [29, 5300], [32, 2200]] }]
// Панель читает массив, рисует строки под TIMELINE и во время SONG
// подмешивает значения в движок (документ и base-громкость не трогает).
function automationLiteral(src) {
  const m = /const\s+AUTOMATION\s*=\s*/.exec(src);
  if (!m) return null;
  const start = m.index + m[0].length;
  if (src[start] !== '[') return null;
  let depth = 0;
  let inStr = false;
  let quote = '';
  let esc = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === quote) inStr = false;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = true; quote = c; continue; }
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  return null;
}

function scanAutomation(src) {
  const json = automationLiteral(src);
  if (!json) return [];
  let arr = null;
  try { arr = Function('"use strict"; return (' + json + ')')(); } catch { arr = null; }
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((a) => a && typeof a.path === 'string' && Array.isArray(a.points))
    .map((a) => ({
      path: a.path,
      points: a.points
        .filter((p) => Array.isArray(p) && p.length >= 2)
        .map((p) => [Number(p[0]), Number(p[1])])
        .filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]))
        .sort((x, y) => x[0] - y[0]),
    }))
    .filter((a) => a.points.length > 0);
}

function autoLabel(path) {
  const p = path.split('.');
  const inst = p.length >= 2 ? p[p.length - 2] : p[0];
  const param = p[p.length - 1];
  return `${inst} · ${param}`;
}

function autoValue(points, bar) {
  let prev = null;
  for (const [at, v] of points) {
    if (bar < at) {
      if (!prev) return null;
      const [pa, pv] = prev;
      const t = at === pa ? 0 : (bar - pa) / (at - pa);
      return pv + (v - pv) * t;
    }
    if (bar === at) return v;
    prev = [at, v];
  }
  return null;
}

function restoreAutomation() {
  document.querySelectorAll('.auto-row').forEach((r) => {
    r.classList.remove('active');
    const cur = r.querySelector('.cur');
    if (cur) cur.textContent = '×1';
  });
  updateAutoPlayhead(0);
}

function applyAutomation(bar) {
  if (!automation.length) return;
  const held = inHold();
  const at = held ? holdBarValue() : bar;
  updateAutoPlayhead(at);
  const inSong = playState() === 1;
  automation.forEach((a, i) => {
    const v = inSong || held ? autoValue(a.points, at) : null;
    const row = document.querySelector(`.auto-row[data-auto="${i}"]`);
    if (row) {
      row.classList.toggle('active', v != null);
      const cur = row.querySelector('.cur');
      if (cur) cur.textContent = v == null ? '×1' : '×' + fmt(v);
    }
  });
}

function renderAutomation() {
  const root = $('autolist');
  const status = $('autoStatus');
  if (!root || !status) return;
  root.innerHTML = '';
  status.textContent = automation.length ? `${automation.length} lanes` : 'no AUTOMATION';
  const total = Math.max(1, tlTotal());
  automation.forEach((a, i) => {
    const row = document.createElement('div');
    row.className = 'auto-row';
    row.dataset.auto = String(i);
    const nm = document.createElement('span');
    nm.className = 'nm';
    nm.textContent = autoLabel(a.path);
    nm.title = `${a.path} — click to scroll to code`;
    const cur = document.createElement('span');
    cur.className = 'cur';
    cur.textContent = '×1';
    cur.title = 'click to scroll to code';
    cur.addEventListener('click', () => scrollEditorToLine(automationLines[i]));
    const lane = document.createElement('div');
    lane.className = 'lane';
    lane.title = 'click to add a point';
    a.points.forEach(([at, v], pi) => {
      const dot = document.createElement('span');
      dot.className = 'dot';
      dot.style.left = ((Math.max(0, Math.min(total, at)) / total) * 100) + '%';
      dot.title = `bar ${at}: ×${fmt(v)} — click to edit`;
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        scrollEditorToLine(automationLines[i]);
        openAutoPointPopover(i, at, v, pi, e);
      });
      lane.appendChild(dot);
    });
    const play = document.createElement('span');
    play.className = 'play';
    lane.appendChild(play);
    nm.addEventListener('click', () => scrollEditorToLine(automationLines[i]));
    lane.addEventListener('click', (e) => {
      if (e.target.closest('.dot')) return;
      const rect = lane.getBoundingClientRect();
      const frac = rect.width ? (e.clientX - rect.left) / rect.width : 0;
      const bar = Math.max(0, Math.min(total, Math.round(frac * total)));
      openAutoPointPopover(i, bar, autoNearest(a.points, bar, a.path), -1, e);
    });
    row.append(nm, cur, lane);
    root.appendChild(row);
  });
}

function updateAutoPlayhead(bar) {
  const total = Math.max(1, tlTotal());
  const left = ((Math.max(0, Math.min(total, bar)) / total) * 100) + '%';
  document.querySelectorAll('.auto-row .play').forEach((p) => { p.style.left = left; });
}

// ── AUTOMATION point editor: click a lane to add, click a dot to edit ──
let autoPopEdit = null; // { i, idx }  idx = -1 → new point

function autoCurrentValue(path) {
  const k = knobs.find((kn) => knobKey(kn) === path);
  return k ? Number(k.value) : null;
}

function autoNearest(points, bar, path) {
  let prev = null;
  for (const p of points) {
    if (p[0] <= bar) prev = p;
    else break;
  }
  if (prev) return prev[1];
  if (points.length) return points[0][1];
  const cur = autoCurrentValue(path);
  return cur != null ? cur : 1;
}

// step follows the value's magnitude:
// <5 → .1, 5–20 → 1, 20–100 → 10, 100–1000 → 100, 1000+ → 1000
function autoStep(value) {
  const a = Math.abs(Number(value));
  if (!Number.isFinite(a) || a < 5) return 0.1;
  if (a < 20) return 1;
  if (a < 100) return 10;
  if (a < 1000) return 100;
  return 1000;
}

function ensureAutoPop() {
  let el = $('autoPop');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'autoPop';
  el.innerHTML = `
    <div class="ttl" id="autoPopTitle"></div>
    <div class="row"><label for="autoPopBar">bar</label><input id="autoPopBar" type="number" min="0" step="1" /></div>
    <div class="row"><label for="autoPopVal">value</label><input id="autoPopVal" type="number" step="any" /></div>
    <div class="btns">
      <button type="button" class="save" id="autoPopSave">Save</button>
      <button type="button" class="del" id="autoPopDel">Delete</button>
    </div>`;
  document.body.appendChild(el);
  $('autoPopSave').addEventListener('click', saveAutoPoint);
  $('autoPopDel').addEventListener('click', deleteAutoPoint);
  for (const id of ['autoPopBar', 'autoPopVal']) {
    $(id).addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); saveAutoPoint(); }
      else if (e.key === 'Escape') { e.preventDefault(); closeAutoPopover(); }
    });
  }
  $('autoPopVal').addEventListener('input', () => {
    $('autoPopVal').step = String(autoStep($('autoPopVal').value));
  });
  document.addEventListener('pointerdown', (e) => {
    if (!el.classList.contains('open')) return;
    if (el.contains(e.target)) return;
    closeAutoPopover();
  });
  return el;
}

function openAutoPointPopover(i, bar, value, idx, ev) {
  const a = automation[i];
  if (!a) return;
  const el = ensureAutoPop();
  autoPopEdit = { i, idx };
  $('autoPopTitle').textContent = autoLabel(a.path);
  $('autoPopBar').value = String(bar);
  $('autoPopVal').value = String(Number(value));
  $('autoPopVal').step = String(autoStep(value));
  $('autoPopDel').hidden = idx < 0;
  el.classList.add('open');
  const w = 196;
  const h = 156;
  const x = Math.min(ev.clientX + 10, window.innerWidth - w - 8);
  const y = Math.min(ev.clientY + 10, window.innerHeight - h - 8);
  el.style.left = Math.max(8, x) + 'px';
  el.style.top = Math.max(8, y) + 'px';
  $('autoPopVal').focus();
  $('autoPopVal').select();
}

function closeAutoPopover() {
  const el = $('autoPop');
  if (el) el.classList.remove('open');
  autoPopEdit = null;
}

async function commitAutomationChange() {
  if (!mirror?.editor) return;
  writeAutomation();
  const src = mirror.editor.state.doc.toString();
  automationLines = scanAutomationLines(src, automation);
  renderAutomation();
  setStatus('applying automation…');
  try {
    await mirror.evaluate();
    buildKnobs();
    setStatus('automation applied');
  } catch (e) {
    setStatus(e.message, true);
  }
}

function saveAutoPoint() {
  if (!autoPopEdit) return;
  const { i, idx } = autoPopEdit;
  const a = automation[i];
  if (!a) return;
  const bar = Math.round(Number($('autoPopBar').value));
  const value = Number($('autoPopVal').value);
  if (!Number.isFinite(bar) || !Number.isFinite(value)) return;
  const at = Math.max(0, bar);
  // bar already used by another point → overwrite that one instead of duplicating
  const dup = a.points.findIndex((p, pi) => pi !== idx && p[0] === at);
  if (dup >= 0) {
    a.points[dup] = [at, value];
    if (idx >= 0) a.points.splice(idx, 1);
  } else if (idx >= 0) {
    a.points[idx] = [at, value];
  } else {
    a.points.push([at, value]);
  }
  a.points.sort((x, y) => x[0] - y[0]);
  commitAutomationChange();
  closeAutoPopover();
}

function deleteAutoPoint() {
  if (!autoPopEdit) return;
  const { i, idx } = autoPopEdit;
  const a = automation[i];
  if (!a || idx < 0) return;
  a.points.splice(idx, 1);
  if (!a.points.length) automation.splice(i, 1);
  commitAutomationChange();
  closeAutoPopover();
}

function automationRange(src) {
  const m = /const\s+AUTOMATION\s*=\s*/.exec(src);
  if (!m) return null;
  const start = m.index + m[0].length;
  if (src[start] !== '[') return null;
  let depth = 0;
  let inStr = false;
  let quote = '';
  let esc = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === quote) inStr = false;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = true; quote = c; continue; }
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) return { start, end: i + 1 };
    }
  }
  return null;
}

function autoQuote(v) {
  return "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

function formatAutomationLiteral() {
  const lines = ['['];
  for (const a of automation) {
    const pts = a.points.map(([at, v]) => `[${at}, ${fmt(v)}]`).join(', ');
    lines.push(`  { path: ${autoQuote(a.path)}, points: [${pts}] },`);
  }
  lines.push(']');
  return lines.join('\n');
}

function writeAutomation() {
  if (!mirror?.editor) return;
  const literal = formatAutomationLiteral();
  const src = mirror.editor.state.doc.toString();
  const lit = automationRange(src);
  if (lit) {
    mirror.editor.dispatch({ changes: { from: lit.start, to: lit.end, insert: literal } });
    return;
  }
  const c = /^.*setcpm\(.*\).*$/m.exec(src);
  const pos = c ? c.index + c[0].length : 0;
  mirror.editor.dispatch({ changes: { from: pos, to: pos, insert: `\nconst AUTOMATION = ${literal};\n` } });
}


function lineAtSourcePos(src, pos) {
  let n = 1;
  for (let i = 0; i < pos && i < src.length; i++) if (src.charCodeAt(i) === 10) n++;
  return n;
}

function scanTimelineLines(src) {
  const lit = timelineLiteral(src);
  if (!lit) return [];
  const re = /\{\s*at:/g;
  re.lastIndex = lit.start;
  const out = [];
  let m;
  while ((m = re.exec(src)) && m.index < lit.end) out.push(lineAtSourcePos(src, m.index));
  return out;
}

function scanAutomationLines(src, arr) {
  const start = src.indexOf('const AUTOMATION');
  if (start < 0) return arr.map(() => 0);
  return arr.map((a) => {
    const at = src.indexOf(`path: '${a.path}'`, start);
    return at < 0 ? 0 : lineAtSourcePos(src, at);
  });
}

function scrollEditorToLine(line) {
  if (!mirror || !mirror.editor || !line) return;
  try {
    const ed = mirror.editor;
    const doc = ed.state.doc;
    const n = Math.max(1, Math.min(doc.lines, line));
    const pos = doc.line(n).from;
    ed.dispatch({ selection: { anchor: pos } });
    const block = ed.lineBlockAt ? ed.lineBlockAt(pos) : null;
    if (block) ed.scrollDOM.scrollTo({ top: Math.max(0, block.top - 80), behavior: 'smooth' });
    ed.focus();
  } catch {}
}

function scrollToInstrumentPattern(group, inst) {
  if (!mirror || !mirror.editor) return;
  try {
    const src = mirror.editor.state.doc.toString();
    const lines = src.split('\n');
    const needle = `${group}.${inst}.`;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.includes(needle)) continue;
      if (/^\s*\/\//.test(line) || line.includes('path:') || line.includes('values:')) continue;
      let j = i;
      while (j >= 0 && !/^\s*\$:/.test(lines[j])) j--;
      scrollEditorToLine(j >= 0 ? j + 1 : i + 1);
      return;
    }
    // fallback: instrument's vol slider
    const k = knobs.find((x) => x.path.length >= 3 && x.path[0] === group && x.path[1] === inst);
    if (k) scrollEditorToLine(mirror.editor.state.doc.lineAt(k.anchor).number);
  } catch {}
}

function startTimeline() {
  stopTimeline();
  timelineTimer = setInterval(timelineTick, 120);
}
function stopTimeline() {
  if (timelineTimer) clearInterval(timelineTimer);
  timelineTimer = null;
  restoreAutomation();
  timelineBar = 0;
  updatePlayhead(0);
}

// ── live activity dots ───────────────────────────────────────────
function paintActivity(t = performance.now()) {
  for (const dot of document.querySelectorAll('.act-dot')) {
    const inst = dot.dataset.inst;
    dot.classList.toggle('on', t - (actSeen.get(inst) || 0) < ACT_TTL);
  }
}
const knobByPath = (path) => knobs.find((k) => k.path.join('.') === path);
const hapSample = (h) => {
  const s = h.value?.s;
  if (typeof s !== 'string') return null;
  return s.replace(/[:*!?@].*$/, '').trim();
};
function laneHasSample(lane, h) {
  const base = hapSample(h);
  if (!base) return false;
  const n = h.value?.n;
  return lane.samples.some((sp) => sp.base === base && (sp.n == null || n == null || sp.n === n));
}
function laneHasGain(lane, h) {
  const g = h.value?.gain;
  if (typeof g !== 'number') return true;
  for (const vp of lane.vols) {
    const k = knobByPath(vp);
    if (k && Math.abs(g - Number(k.value)) < 0.012) return true;
  }
  return false;
}
function activityTick() {
  if (!playing || !mirror) return;
  const sched = mirror.repl?.scheduler;
  const pat = sched?.pattern;
  const now = sched?.now?.();
  if (!pat || typeof pat.queryArc !== 'function' || !Number.isFinite(now)) return;
  let haps = [];
  try {
    haps = pat.queryArc(now - 0.02, now + 0.04);
  } catch {
    paintActivity();
    return;
  }
  const t = performance.now();
  for (const h of haps) {
    const bySample = activityLanes.filter((l) => laneHasSample(l, h));
    if (!bySample.length) continue;
    let chosen = bySample.filter((l) => laneHasGain(l, h));
    // акценты (хэты) — gain = vol × accent, поэтому сверка по громкости мимо;
    // если по сэмплу+индексу дорожка одна, зажигаем её.
    if (!chosen.length && bySample.length === 1) chosen = bySample;
    // Несколько дорожек с тем же сэмплом, но все ведут к одному инструменту
    // (например, motif в разных секциях с разным множителем громкости):
    // лампа должна гореть, даже если эффективный gain тише ручки.
    if (!chosen.length && bySample.length) {
      const key = (l) => [...l.insts].sort().join(',');
      const only = key(bySample[0]);
      if (only && bySample.every((l) => key(l) === only)) chosen = bySample;
    }
    for (const lane of chosen) for (const inst of lane.insts) actSeen.set(inst, t);
  }
  paintActivity(t);
}
function startActivity() {
  stopActivity();
  actTimer = setInterval(activityTick, 120);
}
function stopActivity() {
  if (actTimer) clearInterval(actTimer);
  actTimer = null;
  actSeen.clear();
  paintActivity();
}
function timelineTick() {
  if (!playing || !mirror) return;
  const now = mirror.repl?.scheduler?.now?.();
  if (typeof now !== 'number' || !Number.isFinite(now)) return;
  const total = tlTotal();
  if (!timelineLoop && now >= total) {
    stop();
    timelineBar = total;
    updatePlayhead(total);
    setSceneStatus('timeline end — stopped');
    return;
  }
  const st = playState();
  if (st !== 1) {
    const bar = inHold() ? holdBarValue() : 0;
    timelineBar = bar;
    updatePlayhead(bar);
    applyAutomation(bar);
    return;
  }
  timelineBar = timelineLoop ? Math.floor(now) % total : Math.min(total, Math.floor(now));
  updatePlayhead(timelineBar);
  applyAutomation(timelineBar);
}

async function applyTimeline() {
  if (!mirror) return;
  setStatus('applying timeline…');
  try {
    await mirror.evaluate();
    buildKnobs();
    setStatus('timeline applied');
    setSceneStatus('timeline applied');
  } catch (e) {
    setStatus(e.message, true);
  }
}

$('tlAdd')?.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  addTimelineSection();
});
$('tlTrack')?.addEventListener('click', (e) => {
  if (e.target.closest?.('.tl-block')) return;
  const r = e.currentTarget.getBoundingClientRect();
  if (!r.width) return;
  const bar = ((e.clientX - r.left) / r.width) * tlTotal();
  if (inHold()) { setHoldBar(bar); renderTimeline(); }
  seekTimeline(bar);
});
$('tlRuler')?.addEventListener('click', (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  if (!r.width) return;
  const bar = ((e.clientX - r.left) / r.width) * tlTotal();
  if (inHold()) { setHoldBar(bar); renderTimeline(); }
  seekTimeline(bar);
});
$('tlApply')?.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  applyTimeline();
});
$('tlLoop')?.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  timelineLoop = !timelineLoop;
  e.currentTarget.classList.toggle('on', timelineLoop);
  setSceneStatus(`timeline: ${timelineLoop ? 'loop' : 'stop at end'}`);
});
$('tlStop')?.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  stop();
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
  $('sceneExport')?.addEventListener('click', exportScene);
  $('sceneImport')?.addEventListener('click', () => $('sceneFile')?.click());
  $('sceneFile')?.addEventListener('change', (e) => {
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
      const id = `${g}.${inst}`;
      const dot = document.createElement('i');
      dot.className = 'act-dot';
      dot.dataset.inst = id;
      dot.title = id + ' — sounding';
      row.querySelector('label')?.prepend(dot);
      const tools = document.createElement('span');
      tools.className = 'mx-tools';
      for (const [label, set, cls] of [
        ['M', muted, 'm'],
        ['S', soloed, 's'],
      ]) {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = label;
        b.title = cls === 'm' ? 'mute instrument' : 'solo instrument';
        b.classList.add(cls);
        b.classList.toggle('on', set.has(id));
        b.addEventListener('click', (e) => {
          e.stopPropagation();
          if (set.has(id)) set.delete(id);
          else set.add(id);
          b.classList.toggle('on', set.has(id));
          applyMixerState();
        });
        tools.appendChild(b);
      }
      const gm = instrumentMutes.get(inst);
      if (gm) {
        const gmKnob = knobs.find((k) => k.path.length === 0 && k.name === gm);
        if (gmKnob) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'g';
          b.dataset.gmute = gm;
          b.textContent = 'G';
          b.title = `group mute: ${gm}`;
          const groups2 = [...new Set(instrumentMutes.values())].sort();
          b.style.setProperty('--g', MUTE_COLORS[groups2.indexOf(gm) % MUTE_COLORS.length]);
          const paint = () => b.classList.toggle('on', Number(gmKnob.value) > 0.5);
          paint();
          b.addEventListener('click', (e) => {
            e.stopPropagation();
            const next = Number(gmKnob.value) > 0.5 ? gmKnob.min : gmKnob.max;
            gmKnob.value = next;
            setKnob(gmKnob, next);
            document
              .querySelectorAll(`.mx-tools button.g[data-gmute="${gm}"]`)
              .forEach((x) => x.classList.toggle('on', next > 0.5));
          });
          tools.appendChild(b);
        }
      }
      row.appendChild(tools);
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
    const autoGroup = AUTO_OPEN_GROUPS.has(g) || [...insts.keys()].some((i) => AUTO_OPEN_INSTS.has(i));
    gd.open = openState.get(g) ?? autoGroup;
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
      id.open = openState.get(key) ?? (AUTO_OPEN_GROUPS.has(g) || AUTO_OPEN_INSTS.has(inst));
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
  lab.title = k.path.length >= 3
    ? `${k.path.join('.')} — click: jump to pattern`
    : (k.path.length ? k.path.join('.') : k.name);
  lab.style.cursor = k.path.length >= 3 ? 'pointer' : '';
  if (k.path.length >= 3) {
    lab.addEventListener('click', (e) => {
      e.stopPropagation();
      scrollToInstrumentPattern(k.path[0], k.path[1]);
    });
  }
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
  row.addEventListener('click', (e) => {
    if (e.target.closest?.('button,input,select')) return;
    if (!mirror?.editor) return;
    scrollEditorToLine(mirror.editor.state.doc.lineAt(k.anchor).number);
  });
  knobByAnchor.set('slider_' + k.anchor, { input, out, knob: k });
  return row;
}

const instId = (k) => (k.path.length >= 3 ? `${k.path[0]}.${k.path[1]}` : null);

// Mute/solo живут в панели, не в коде: в документе остаётся base-громкость,
// движку уходит эффективная. Так solo не сбрасывает vol и снимается сразу.
function effectiveVol(k, base = Number(k.base ?? k.value)) {
  const id = instId(k);
  if (!id) return base;
  if (muted.has(id)) return 0;
  if (soloed.size && !soloed.has(id)) return 0;
  return base;
}

function applyMixerState() {
  for (const k of knobs) {
    if (k.name !== 'vol' || k.path.length < 3) continue;
    window.postMessage(
      { type: 'cm-slider', id: 'slider_' + k.anchor, value: effectiveVol(k), internal: true },
      null,
    );
  }
}

function applyDefaultMutes() {
  if (defaultMutesApplied) return;
  const gates = knobs.filter((k) => k.name === 'gate' && k.path.length >= 3);
  const vols = knobs.filter((k) => k.name === 'vol' && k.path.length >= 3);
  const targets = [...vols, ...gates];
  if (!targets.length) return;
  for (const k of targets.sort((a, b) => b.idx - a.idx)) {
    if (Number(k.value) !== 0) {
      k.value = 0;
      setKnob(k, 0);
    }
  }
  defaultMutesApplied = true;
  render();
  setStatus('default: all volumes 0 and muted — raise vol + click M');
}

// A knob is the same drag a widget gets: the number into the document + a message
// to the engine. Позицию числа НЕ запоминаем: после любой правки всё правее
// сдвигается, а id виджета (`slider_<offset>`) живёт до следующего eval.
// Поэтому каждый раз заново сканируем документ и берём k.idx-й вызов slider(.
function setKnob(k, v) {
  // держим k.value актуальным: exportScene берёт значения из knobs, а не из кода
  k.value = Number(v);
  const src = mirror.editor.state.doc.toString();
  const site = scanSliders(src).sites[k.idx];
  if (site) {
    const head = /^slider\(\s*(-?\d+(?:\.\d+)?)/.exec(src.slice(site.pos, site.pos + 40));
    if (head) {
      const from = site.pos + head[0].length - head[1].length;
      mirror.editor.dispatch({ changes: { from, to: from + head[1].length, insert: fmt(v) } });
    }
  }
  if (k.name === 'vol' && k.path.length >= 3) k.base = Number(v)
  const out = k.name === 'vol' && k.path.length >= 3 ? effectiveVol(k, Number(v)) : Number(v)
  window.postMessage({ type: 'cm-slider', id: 'slider_' + k.anchor, value: out, internal: true }, null);
}

// ── 5. editor theme and visualizer ────────────────────────────────
lockDetailsToggle('timeline');
lockDetailsToggle('automation');
// cm.themes — 39 color schemes from strudel.cc itself; activateTheme writes the
// theme into `:root` as `--background/--foreground/--caret/...` variables. Our own
// variables are --bg/--panel/--text/--accent, they do not collide, so the panel
// keeps its lime accent whatever theme the code wears.
function paintCmSliders() {
  document.querySelectorAll('.cm-slider input[type="range"]').forEach((sl) => {
    const min = Number(sl.min);
    const max = Number(sl.max);
    const val = Number(sl.value);
    const pct = max > min ? Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100)) : 0;
    sl.style.setProperty('--p', pct + '%');
    if (!sl._paintBound) {
      sl._paintBound = true;
      sl.addEventListener('input', () => paintCmSliders());
    }
  });
}
setInterval(paintCmSliders, 250);

function fillThemes() {
  const sel = $('theme');
  const names = Object.keys(cm.themes || {}).filter((n) => n !== ROOMV);
  if (cm.themes?.[ROOMV]) names.unshift(ROOMV);
  for (const name of names) {
    const o = document.createElement('option');
    o.value = name;
    o.textContent = name;
    sel.appendChild(o);
  }
  sel.value = ROOMV;
  sel.addEventListener('change', () => applyTheme(sel.value));
  applyTheme(ROOMV);
}

function applyTheme(name) {
  try {
    // setTheme reconfigures the CodeMirror theme compartment (syntax colors);
    // initTheme alone only writes CSS variables used by the page background.
    if (mirror && typeof mirror.setTheme === 'function') mirror.setTheme(name);
    else cm.initTheme(name);
    document.documentElement.dataset.theme = name;
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
  let refs = [];
  try {
    const res = await fetch('/api/tracks');
    if (!res.ok) throw new Error(String(res.status));
    list = await res.json();
  } catch {
    list = [DEFAULT_TRACK]; // без сервера список не собрать — грузим дефолт
  }
  try {
    const res = await fetch('/api/refs');
    if (res.ok) refs = await res.json();
  } catch {
    refs = [];
  }
  for (const p of list) {
    const o = document.createElement('option');
    o.value = p;
    o.textContent = trackName(p);
    sel.appendChild(o);
  }
  if (refs.length) {
    // delimiter between our tracks and downloaded reference scripts
    const sep = document.createElement('option');
    sep.disabled = true;
    sep.textContent = '──────── REFS ────────';
    sel.appendChild(sep);
    for (const p of refs) {
      const o = document.createElement('option');
      o.value = p;
      o.textContent = 'ref · ' + p.replace('/refs/strudel/', '');
      sel.appendChild(o);
    }
  }
  const all = [...list, ...refs];
  const fromHash = decodeURIComponent(location.hash.slice(1));
  // На публичном хосте /api/tracks отдаёт только curated `_selected/`, и
  // DEFAULT_TRACK там нет — 404 при старте валил всю инициализацию. Берём
  // первый доступный трек, DEFAULT_TRACK остаётся последним фолбэком.
  const want = all.includes(fromHash) ? fromHash : (list[0] ?? DEFAULT_TRACK);
  sel.value = want;
  return want;
}

async function readTrack(p) {
  const res = await fetch(p);
  if (!res.ok) throw new Error(`${p}: ${res.status}`);
  return res.text();
}

function editorCode() {
  try { return mirror?.editor?.state?.doc?.toString?.() ?? code ?? ''; } catch { return code ?? ''; }
}

function readAutosave(p) {
  try {
    const j = JSON.parse(localStorage.getItem(AUTOSAVE_KEY) || 'null');
    if (j && j.track === p && typeof j.code === 'string') return j.code;
  } catch {}
  return null;
}

function writeAutosave(p, src) {
  if (!p || typeof src !== 'string' || !src) return;
  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ track: p, code: src, at: Date.now() }));
    lastAutosaveCode = src;
  } catch {}
}

function isDirty() {
  return !!mirror && !!baseCode && editorCode() !== baseCode;
}

function setEditedFlag(on) {
  const u = new URL(location.href);
  if (on) u.searchParams.set('edited', '1');
  else u.searchParams.delete('edited');
  history.replaceState(null, '', u);
}

function updateEditedFlag() {
  setEditedFlag(isDirty());
}

function startAutosave() {
  if (autosaveTimer) return;
  autosaveTimer = setInterval(() => {
    if (!mirror || !track) return;
    const src = editorCode();
    if (!src || src === lastAutosaveCode) return;
    writeAutosave(track, src);
    updateEditedFlag();
  }, 700);
  window.addEventListener('beforeunload', () => writeAutosave(track, editorCode()));
}

// ── unsaved changes warning ───────────────────────────────────────
let unsavedResolve = null;
function unsavedPrompt(nextPath) {
  const el = $('unsaved');
  if (!el) return Promise.resolve(true);
  $('uText').textContent =
    `Current track ${trackName(track)} has unsaved changes. ` +
    `Switching to ${trackName(nextPath)} discards them (this browser keeps only one autosave slot). ` +
    `Download a copy first if you need it.`;
  el.hidden = false;
  return new Promise((resolve) => { unsavedResolve = resolve; });
}
function closeUnsaved(result) {
  const el = $('unsaved');
  if (el) el.hidden = true;
  const resolve = unsavedResolve;
  unsavedResolve = null;
  if (resolve) resolve(result);
}
function bindUnsaved() {
  $('uSliders')?.addEventListener('click', () => exportScene());
  $('uCode')?.addEventListener('click', () => exportTrack());
  $('uDiscard')?.addEventListener('click', () => closeUnsaved(true));
  $('uCancel')?.addEventListener('click', () => closeUnsaved(false));
  $('unsaved')?.addEventListener('click', (e) => {
    if (e.target === $('unsaved')) closeUnsaved(false);
  });
  document.addEventListener('keydown', (e) => {
    if (!$('unsaved') || $('unsaved').hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeUnsaved(false); }
  });
}

// Длина трека — из TIMELINE и BPM. Один такт = 4 доли,
// setcpm(BPM/4) => такт = 4/BPM минуты.
function trackDuration(src, bpm) {
  if (!bpm) return '';
  const sections = scanTimeline(src);
  if (!sections.length) return '';
  const bars = Math.max(...sections.map((s) => s.at + s.length));
  if (!(bars > 0)) return '';
  const total = Math.round((bars * 4 * 60) / bpm);
  const m = Math.floor(total / 60);
  const sec = total % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

// Заголовок и подпись — из самого файла: BPM берём из кода, а не из константы
// в панели, иначе при смене трека шапка врёт. Время — после BPM.
function showTrackInfo(p, src) {
  const info = trackHeaderInfo(p, src);
  $('title').textContent = info.title;
  $('trackPath').textContent = trackName(p) + '.js';
  const codeBpm = /const\s+BPM\s*=\s*(\d+(?:\.\d+)?)/.exec(src);
  const commentBpm = info.bpm.match(/\d+(?:\.\d+)?/);
  const bpm = commentBpm ? Number(commentBpm[0]) : (codeBpm ? Number(codeBpm[1]) : 0);
  const parts = [];
  if (info.style) parts.push(info.style);
  if (info.bpm) parts.push(info.bpm);
  else if (codeBpm) parts.push(`${codeBpm[1]} BPM`);
  const dur = trackDuration(src, bpm);
  if (dur) parts.push(dur);
  $('sub').textContent = parts.join(' · ');
}

async function loadTrack(p) {
  if (!mirror || p === track) return;
  if (isDirty()) {
    const ok = await unsavedPrompt(p);
    if (!ok) {
      const sel = $('track');
      if (sel) sel.value = track;
      return;
    }
  }
  setStatus('reading track…');
  const fileSrc = await readTrack(p);
  baseCode = fileSrc;
  const savedCode = readAutosave(p);
  const src = savedCode && savedCode !== fileSrc ? savedCode : fileSrc;
  stop(); // старый паттерн глушим: иначе два трека играют разом
  soloed.clear();
  muted.clear();
  defaultMutesApplied = false;
  timelineLoop = true;
  pendingSeek = null;
  $('tlLoop')?.classList.add('on');
  timelineSel = -1;
  track = p;
  code = src;
  lastAutosaveCode = src;
  writeAutosave(p, src);
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
  updateEditedFlag();
  // даём CodeMirror разложить документ: evaluate() читает this.code, который
  // обновляет его же слушатель изменений
  await new Promise((r) => setTimeout(r, 0));
  await play(); // выбор в меню — это жест пользователя, звук уже разрешён
}

async function boot() {
  setStatus('loading engine…');
  // Registers Strudel's own first-click unlock listener; our capture handler
  // below is a belt-and-braces resume that also survives stopPropagation.
  wa.initAudioOnFirstClick();
  // Mobile (iOS especially) needs the AudioContext resumed inside the very
  // first trusted gesture. Listen in the capture phase so a button that calls
  // stopPropagation (play) still unlocks audio.
  const unlockAudio = () => {
    try {
      const ac = wa.getAudioContext();
      if (ac.state !== 'running') ac.resume().catch(() => {});
    } catch {}
  };
  for (const ev of ['pointerdown', 'touchstart', 'keydown']) {
    window.addEventListener(ev, unlockAudio, { once: true, capture: true });
  }
  let preloadGesture = false;
  const kickPreload = async () => {
    if (preloadGesture) return;
    preloadGesture = true;
    try {
      await wa.getAudioContext().resume();
    } catch {}
    downloadAllSamples();
  };
  window.addEventListener('pointerdown', kickPreload, { once: true, capture: true });
  window.addEventListener('keydown', kickPreload, { once: true, capture: true });
  mini.miniAllStrings();

  setStatus('reading track…');
  track = await fillTrackSelect();
  const fileSrc = await readTrack(track);
  baseCode = fileSrc;
  const savedCode = readAutosave(track);
  code = savedCode && savedCode !== fileSrc ? savedCode : fileSrc;
  lastAutosaveCode = code;
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
  startAutosave();
  updateEditedFlag();

  fillThemes();
  requestAnimationFrame(drawSpectrum);
  setStatus('ready — hit PLAY');
  warmSampleNetwork();
}

let audioReady;
async function play() {
  if (!mirror) return;
  try {
    const ac = wa.getAudioContext();
    if (ac.state !== 'running') await ac.resume();
  } catch {}
  await audioReady;
  if (!eq) buildMasterChain();
  setStatus('starting…');
  await mirror.evaluate();
  playing = true;
  $('play').classList.add('on');
  buildKnobs();
  startTimeline();
  startActivity();
  if (pendingSeek != null) {
    const target = pendingSeek;
    pendingSeek = null;
    setTimeout(() => seekTimeline(target), 300);
  }
  setStatus(`${knobs.length} knobs · playing`);
  writeAutosave(track, editorCode());
  updateEditedFlag();
  // Warm the sample cache after the user gesture: loadBuffer needs a running
  // audio context, and the first break/sample should not wait for the network.
  downloadAllSamples();
}

function stop() {
  if (!mirror) return;
  stopTimeline();
  stopActivity();
  mirror.stop();
  playing = false;
  $('play').classList.remove('on');
  setStatus(`${knobs.length} knobs · stopped`);
}

$('play').addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); play().catch((err) => setStatus(err.message, true)); });
$('stop').addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); stop(); });

// ── TRACK CODE export/import (same idea as JSON scenes) ──────────
function exportTrack() {
  if (!mirror?.editor) return;
  const code = mirror.editor.state.doc.toString();
  const name = (track.split('/').pop() || 'track.js').replace(/[^\w.-]/g, '_');
  const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  setSceneStatus(`track exported: ${name}`);
}

async function importTrack(file) {
  if (!mirror?.editor || !file) return;
  const code = await file.text();
  stop();
  mirror.editor.dispatch({ changes: { from: 0, to: mirror.editor.state.doc.length, insert: code } });
  await mirror.evaluate();
  buildKnobs();
  $('title').textContent = file.name.replace(/\.js$/i, '');
  setSceneStatus(`track imported: ${file.name}`);
}

$('trackExport')?.addEventListener('click', (e) => { e.preventDefault(); exportTrack(); });
$('trackImport')?.addEventListener('click', (e) => { e.preventDefault(); $('trackFile')?.click(); });
$('trackFile')?.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  importTrack(file).catch((err) => setStatus(err.message, true));
  e.target.value = '';
});
$('track').addEventListener('change', (e) => {
  loadTrack(e.target.value).catch((err) => setStatus(err.message, true));
});

// The intro popup can pick a track before the engine is ready — wait for boot
// and then load it exactly like the header menu does.
window.__strudelPickTrack = async (p) => {
  try {
    await audioReady;
  } catch {}
  if (!mirror) return false;
  const sel = $('track');
  if (![...sel.options].some((o) => o.value === p)) {
    const o = document.createElement('option');
    o.value = p;
    o.textContent = trackName(p);
    sel.appendChild(o);
  }
  sel.value = p;
  if (p === track) {
    if (!playing) await play();
  } else {
    await loadTrack(p);
  }
  return true;
};

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

// ── mobile header menu + copy-code button ────────────────────────
function bindHeaderMenu() {
  const btn = $('menuBtn');
  const headerEl = document.querySelector('header');
  if (!btn || !headerEl) return;
  const setOpen = (open) => {
    headerEl.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!headerEl.classList.contains('menu-open'));
  });
  document.addEventListener('pointerdown', (e) => {
    if (!headerEl.classList.contains('menu-open')) return;
    if ($('hdrMenu')?.contains(e.target) || btn.contains(e.target)) return;
    setOpen(false);
  });
}

function bindCopyCode() {
  const btn = $('copyCode');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    if (!mirror?.editor) return;
    const code = mirror.editor.state.doc.toString();
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = code;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch {}
      ta.remove();
    }
    btn.classList.add('copied');
    setTimeout(() => btn.classList.remove('copied'), 900);
  });
}

function bindNewTrack() {
  $('newTrack')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.__strudelPickTrack?.('/tracks/_selected/new-track.js')
      .catch((err) => setStatus(err.message, true));
  });
}

bindScenes();
bindPadKeys();
bindHeaderMenu();
bindCopyCode();
bindNewTrack();
audioReady = boot().catch((e) => {
  console.error(e);
  setStatus(e.message, true);
});

// ── agent API: window.strudex ────────────────────────────────────
// Stable entry points for a browser-driving AI. Documented in /llms.txt.
window.strudex = {
  ready: () => audioReady,
  closeIntro: () => (window.__strudelCloseIntro ? window.__strudelCloseIntro() : true),
  listTracks: async () => (await (await fetch('/api/tracks')).json()),
  getCode: () => mirror?.editor?.state?.doc?.toString() ?? '',
  setCode: async (code) => {
    if (!mirror) { try { await audioReady; } catch {} }
    if (!mirror) throw new Error('engine not ready');
    mirror.setCode(String(code));
    await play();
    return true;
  },
  loadTrack: (p) => window.__strudelPickTrack(p),
  newTrack: () => window.__strudelPickTrack('/tracks/_selected/new-track.js'),
  play: () => play(),
  stop: () => stop(),
  getTrack: () => track,
  getStatus: () => $('status')?.textContent ?? '',
};
