// Phrase editor: piano-roll for the plain note phrases a track declares.
// Extracted from panel.js. initPhraseEditor({ getMirror, status }) wires the
// toolbar button and the popup; all edits go into the document via CodeMirror.

const $ = (id) => document.getElementById(id);
let getMirror = () => null;
let onStatus = () => {};

// ── PHRASE EDITOR: piano-roll for note phrases ──────────────────
// Reads every `const NAME = phrase([...])` / `solos([...])` from the document,
// draws one bar as a monophonic piano roll and writes the edited bar back into
// that string literal. Nothing is auto-evaluated: Apply only edits the code.
const PH_GROUP_DEFS = [
  { id: 'riff', title: 'Riff lead', re: /^ACID/ },
  { id: 'echo', title: 'Pulse echo', re: /^MEL/ },
  { id: 'bass', title: 'Bass', re: /^BASS/ },
  { id: 'stab', title: 'Stabs', re: /^STAB/ },
  { id: 'pad', title: 'Pad', re: /^PAD/ },
  { id: 'solo', title: 'Solo', re: /^SOLO/ },
];
const PH_GROUP_OTHER = { id: 'other', title: 'Other' };
const PH_PC = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
const PH_FLAT = ['c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab', 'a', 'bb', 'b'];
const PH_BLACK = new Set([1, 3, 6, 8, 10]);
const PH_ACCENT = /[*\/,<>()[\]{}]/;
const PH_STORE_KEY = 'strudex:phraseSel';
const PH_VIEW_SPAN = 24; // two octaves are always visible
const PH_CELL = 18; // cell width/height; 4 bars of 16 steps still fit wide screens

let phList = [];
let phSel = null;
let phSteps = 16;
let phWorkingBars = [];
let phKey = '';
let phAnchor = null;
let phViewBase = 48; // lowest MIDI note of the visible two-octave window
const phEdits = new Map();

function phNoteMidi(tok) {
  const m = /^([a-g])([bs]?)(-?\d+)$/.exec(String(tok).toLowerCase());
  if (!m) return null;
  let pc = PH_PC[m[1]];
  if (m[2] === 's') pc = (pc + 1) % 12;
  if (m[2] === 'b') pc = (pc + 11) % 12;
  return (Number(m[3]) + 1) * 12 + pc;
}

function phMidiLabel(midi) {
  const pc = ((midi % 12) + 12) % 12;
  return PH_FLAT[pc] + (Math.floor(midi / 12) - 1);
}

function phArrayEnd(src, start) {
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
      if (depth === 0) return i;
    }
  }
  return -1;
}

function phStringLiterals(src, from, to) {
  const out = [];
  let i = from;
  while (i <= to) {
    const c = src[i];
    if (c === '"' || c === "'" || c === '`') {
      const q = c;
      let j = i + 1;
      let esc = false;
      let value = '';
      while (j < src.length) {
        const d = src[j];
        if (esc) { value += d; esc = false; }
        else if (d === '\\') esc = true;
        else if (d === q) break;
        else value += d;
        j++;
      }
      out.push({ start: i, end: j + 1, value, quote: q });
      i = j + 1;
    } else i++;
  }
  return out;
}

function phBarTokens(text) {
  const t = String(text).trim();
  if (!t) return [];
  if (PH_ACCENT.test(t)) return null;
  const toks = t.split(/\s+/);
  return toks.every((tok) => tok === '~' || phNoteMidi(tok) !== null) ? toks : null;
}

function phScanPhrases(src) {
  const list = [];
  const re = /const\s+([A-Za-z_$][\w$]*)\s*=\s*(phrase|solos)\s*\(\s*\[/g;
  let m;
  while ((m = re.exec(src))) {
    const arrStart = m.index + m[0].length - 1;
    const arrEnd = phArrayEnd(src, arrStart);
    if (arrEnd < 0) continue;
    const strings = phStringLiterals(src, arrStart + 1, arrEnd - 1);
    if (!strings.length) continue;
    const bars = strings.map((s) => s.value.trim());
    const tokens = bars.map(phBarTokens);
    list.push({
      name: m[1],
      kind: m[2],
      bars,
      strings,
      tokens,
      unsupported: tokens.some((t) => t === null),
    });
  }
  return list;
}

const phGroupOf = (name) => PH_GROUP_DEFS.find((g) => g.re.test(name)) || PH_GROUP_OTHER;

// Re-map a bar to the chosen grid: downsample keeps the first hit of each span,
// upsample places the original notes on the even steps and leaves the rest empty.
function phResample(tokens, steps) {
  const len = tokens ? tokens.length : 0;
  if (!len) return new Array(steps).fill('~');
  if (len === steps) return tokens.slice();
  const out = [];
  if (steps < len) {
    for (let i = 0; i < steps; i++) {
      const a = Math.floor((i * len) / steps);
      const b = Math.max(a + 1, Math.floor(((i + 1) * len) / steps));
      let pick = '~';
      for (let j = a; j < b; j++) {
        if (tokens[j] && tokens[j] !== '~') { pick = tokens[j]; break; }
      }
      out.push(pick);
    }
  } else {
    const f = steps / len;
    for (let i = 0; i < steps; i++) {
      const aligned = Number.isInteger(f) ? i % f === 0 : Math.abs(i - Math.round(i / f) * f) < 0.5;
      out.push(aligned ? tokens[Math.min(len - 1, Math.floor(i / f))] : '~');
    }
  }
  return out;
}

function phSetStatus(text, err = false) {
  const el = $('phStatus');
  if (!el) return;
  el.textContent = text || '';
  el.classList.toggle('err', !!err);
}

function phEnsureWorking() {
  if (!phSel) { phWorkingBars = []; phKey = ''; return; }
  phKey = `${phSel.name}#${phSteps}`;
  const saved = phEdits.get(phKey);
  if (saved && saved.length === phSel.bars.length && saved.every((b) => b.length === phSteps)) {
    phWorkingBars = saved.map((b) => b.slice());
    return;
  }
  phWorkingBars = phSel.tokens.map((t) => phResample(t, phSteps));
}

function phLoad(name) {
  const prevName = phSel?.name;
  phSel = phList.find((p) => p.name === name) || phSel;
  if (!phSel) { phWorkingBars = []; phRenderGrid(); return; }
  try { localStorage.setItem(PH_STORE_KEY, phSel.name); } catch {}
  const first = phSel.tokens[0];
  if (Array.isArray(first) && (first.length === 8 || first.length === 16)) phSteps = first.length;
  const stepsSel = $('phSteps');
  if (stepsSel) stepsSel.value = String(phSteps);
  phEnsureWorking();
  if (phSel.name !== prevName) phFitView();
  phRenderGrid();
}

function phRebuildSelect() {
  const sel = $('phName');
  if (!sel) return;
  const groups = new Map();
  for (const p of phList) {
    const g = phGroupOf(p.name);
    if (!groups.has(g.id)) groups.set(g.id, { g, items: [] });
    groups.get(g.id).items.push(p);
  }
  sel.innerHTML = '';
  const groupOrder = new Map(PH_GROUP_DEFS.map((g, i) => [g.id, i]));
  const ordered = [...groups.values()].sort(
    (a, b) => (groupOrder.get(a.g.id) ?? 99) - (groupOrder.get(b.g.id) ?? 99),
  );
  for (const { g, items } of ordered) {
    const og = document.createElement('optgroup');
    og.label = g.title;
    for (const p of items) {
      const o = document.createElement('option');
      o.value = p.name;
      o.textContent = p.unsupported ? `${p.name} (unsupported)` : p.name;
      o.disabled = p.unsupported;
      og.appendChild(o);
    }
    sel.appendChild(og);
  }
  let want = '';
  try { want = localStorage.getItem(PH_STORE_KEY) || ''; } catch {}
  const pick = phList.find((p) => p.name === want && !p.unsupported)
    || phList.find((p) => !p.unsupported && phGroupOf(p.name).id === 'riff')
    || phList.find((p) => !p.unsupported)
    || phList[0];
  if (pick) {
    sel.value = pick.name;
    phLoad(pick.name);
  }
}

function phPhraseRange() {
  const set = new Set();
  if (phSel) {
    for (const toks of phSel.tokens) {
      for (const t of toks || []) {
        const midi = phNoteMidi(t);
        if (midi !== null) set.add(midi);
      }
    }
  }
  for (const bar of phWorkingBars) {
    for (const t of bar) {
      const midi = phNoteMidi(t);
      if (midi !== null) set.add(midi);
    }
  }
  if (!set.size) return null;
  return { lo: Math.min(...set), hi: Math.max(...set) };
}

// Keep the window at a fixed two octaves so the popup never changes height.
function phFitView() {
  const r = phPhraseRange();
  if (!r) return;
  let base = Math.floor(r.lo / 12) * 12;
  if (r.hi > base + PH_VIEW_SPAN - 1) base = Math.floor((r.hi - (PH_VIEW_SPAN - 1)) / 12) * 12;
  phViewBase = Math.max(0, Math.min(120 - PH_VIEW_SPAN, base));
}

function phPitchRows() {
  const rows = [];
  for (let midi = phViewBase + PH_VIEW_SPAN - 1; midi >= phViewBase; midi--) rows.push(midi);
  return rows;
}

function phViewShift(dir) {
  phViewBase = Math.max(0, Math.min(120 - PH_VIEW_SPAN, phViewBase + dir * 12));
  phRenderGrid();
}

function phToggleStep(barIndex, step, midi) {
  const bar = phWorkingBars[barIndex];
  if (!bar || step >= bar.length) return;
  const cur = bar[step];
  const curMidi = cur && cur !== '~' ? phNoteMidi(cur) : null;
  bar[step] = curMidi === midi ? '~' : phMidiLabel(midi);
  if (phKey) phEdits.set(phKey, phWorkingBars.map((b) => b.slice()));
  phRenderGrid();
  phSetStatus('unsaved — Apply to code');
}

function phRenderGrid() {
  const body = $('phBody');
  if (!body) return;
  const octWrap = document.querySelector('#phrasePop .ph-oct');
  if (!phSel) {
    if (octWrap) octWrap.hidden = true;
    body.innerHTML = '<div class="ph-empty">no phrase constants found in this track</div>';
    $('phApply').disabled = true;
    return;
  }
  if (phSel.unsupported) {
    if (octWrap) octWrap.hidden = true;
    body.innerHTML = '<div class="ph-empty">this phrase uses mini-notation accents (* / , &lt;…&gt;) or non-note tokens — piano editing is off for it</div>';
    $('phApply').disabled = true;
    $('phHint').textContent = phSel.name;
    return;
  }
  if (octWrap) octWrap.hidden = false;
  if (!phWorkingBars.length || phWorkingBars.length !== phSel.bars.length) phEnsureWorking();
  const rows = phPitchRows();
  const bars = phSel.bars.length;
  const table = document.createElement('table');
  table.className = 'ph';
  const thead = document.createElement('thead');

  const barRow = document.createElement('tr');
  barRow.className = 'ph-bars';
  const corner = document.createElement('th');
  corner.className = 'ph-corner';
  corner.rowSpan = 2;
  corner.textContent = 'bar';
  barRow.appendChild(corner);
  for (let b = 0; b < bars; b++) {
    const th = document.createElement('th');
    th.className = 'ph-barhead';
    th.colSpan = phSteps;
    th.textContent = String(b + 1);
    barRow.appendChild(th);
  }
  thead.appendChild(barRow);

  const stepRow = document.createElement('tr');
  stepRow.className = 'ph-steps';
  for (let b = 0; b < bars; b++) {
    for (let s = 0; s < phSteps; s++) {
      const th = document.createElement('th');
      th.className = 'ph-step'
        + (s === 0 ? ' ph-bar' : '')
        + (s % 4 === 0 ? ' ph-4' : '');
      th.textContent = String(s + 1);
      stepRow.appendChild(th);
    }
  }
  thead.appendChild(stepRow);
  table.appendChild(thead);

  const tb = document.createElement('tbody');
  for (const midi of rows) {
    const pc = ((midi % 12) + 12) % 12;
    const tr = document.createElement('tr');
    const key = document.createElement('td');
    key.className = 'ph-key ' + (PH_BLACK.has(pc) ? 'black' : 'white') + (pc === 0 ? ' ph-c' : '');
    key.textContent = phMidiLabel(midi);
    tr.appendChild(key);
    for (let b = 0; b < bars; b++) {
      const bar = phWorkingBars[b] || [];
      for (let s = 0; s < phSteps; s++) {
        const td = document.createElement('td');
        td.className = 'ph-slot'
          + (s === 0 ? ' ph-bar' : '')
          + (s % 4 === 0 ? ' ph-4' : '')
          + (pc === 0 ? ' ph-c' : '');
        const tok = bar[s];
        const on = !!tok && tok !== '~' && phNoteMidi(tok) === midi;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ph-cell' + (on ? ' on' : '');
        btn.title = `${phMidiLabel(midi)} · bar ${b + 1} step ${s + 1}`;
        btn.setAttribute('aria-label', `${on ? 'clear' : 'place'} ${phMidiLabel(midi)} on bar ${b + 1} step ${s + 1}`);
        btn.addEventListener('click', () => phToggleStep(b, s, midi));
        td.appendChild(btn);
        tr.appendChild(td);
      }
    }
    tb.appendChild(tr);
  }
  table.appendChild(tb);
  body.innerHTML = '';
  body.appendChild(table);
  $('phHint').textContent = `${phSel.name} · ${bars} bar${bars === 1 ? '' : 's'} · ${phSteps} steps/bar`;
  const range = phPhraseRange();
  const outside = !!range && (range.lo < phViewBase || range.hi > phViewBase + PH_VIEW_SPAN - 1);
  const oct = $('phRange');
  if (oct) {
    oct.textContent = `${phMidiLabel(phViewBase)}–${phMidiLabel(phViewBase + PH_VIEW_SPAN - 1)}`;
    oct.classList.toggle('off-screen', outside);
    oct.title = outside ? 'some notes are outside the visible two octaves — use oct − / +' : '';
  }
  $('phApply').disabled = false;
  phSize();
  phPlace();
}

// The popup hugs the full phrase grid; when the screen is narrower than the
// grid, the body scrolls horizontally instead of squeezing the cells.
function phSize() {
  const el = $('phrasePop');
  if (!el) return;
  const bars = phSel ? phSel.bars.length : 1;
  const tableW = 60 + bars * phSteps * PH_CELL + 2;
  const w = Math.max(320, Math.min(window.innerWidth * 0.94, tableW + 22));
  el.style.width = `${Math.round(w)}px`;
}

function phPlace() {
  const el = $('phrasePop');
  const btn = phAnchor;
  if (!el || !btn || !el.classList.contains('open')) return;
  const r = btn.getBoundingClientRect();
  const w = el.offsetWidth || 320;
  const h = el.offsetHeight || 420;
  let left = r.left - w - 8;
  if (left < 8) left = Math.max(8, r.right - w);
  let top = r.bottom + 6;
  if (top + h > window.innerHeight - 8) top = Math.max(8, window.innerHeight - h - 8);
  el.style.left = `${Math.round(left)}px`;
  el.style.top = `${Math.round(top)}px`;
}

async function phApply() {
  if (!getMirror()?.editor || !phSel || phSel.unsupported) return;
  const src = getMirror().editor.state.doc.toString();
  const info = phScanPhrases(src).find((p) => p.name === phSel.name);
  if (!info || !info.strings.length) {
    phSetStatus('phrase moved in code — reopen the editor', true);
    return;
  }
  const changes = [];
  const n = Math.min(info.bars.length, phWorkingBars.length);
  for (let i = 0; i < n; i++) {
    const text = phWorkingBars[i].join(' ');
    if (text === info.bars[i]) continue;
    const s = info.strings[i];
    if (!s) continue;
    const q = s.quote || "'";
    changes.push({
      from: s.start + 1,
      to: s.end - 1,
      insert: text.replace(/\\/g, '\\\\').split(q).join('\\' + q),
    });
  }
  if (!changes.length) {
    phSetStatus('no changes');
    return;
  }
  for (const ch of changes.sort((a, b) => b.from - a.from)) {
    getMirror().editor.dispatch({ changes: ch });
  }
  if (phKey) phEdits.delete(phKey);
  phList = phScanPhrases(getMirror().editor.state.doc.toString());
  phSel = phList.find((p) => p.name === phSel.name) || phSel;
  phEnsureWorking();
  phRenderGrid();
  phSetStatus('applied — code updated');
  onStatus('phrase applied');
  try {
    await getMirror().evaluate();
  } catch (e) {
    phSetStatus(e?.message || 'eval failed', true);
    onStatus(e?.message || 'eval failed', true);
  }
}

function ensurePhrasePop() {
  let el = $('phrasePop');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'phrasePop';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'phrase editor');
  el.innerHTML = `
    <div class="ph-head">
      <label>phrase <select id="phName"></select></label>
      <label>steps <select id="phSteps"><option value="8">8</option><option value="16" selected>16</option></select></label>
      <span class="ph-hint" id="phHint"></span>
    </div>
    <div class="ph-body" id="phBody"></div>
    <div class="ph-foot">
      <span class="ph-oct">
        <button type="button" id="phOctDown" title="octave down">−</button>
        <span id="phRange"></span>
        <button type="button" id="phOctUp" title="octave up">+</button>
      </span>
      <span class="ph-status" id="phStatus"></span>
      <button type="button" class="save" id="phApply" title="apply to code">Apply</button>
      <button type="button" id="phClose">Close</button>
    </div>`;
  document.body.appendChild(el);
  $('phName').addEventListener('change', () => {
    phLoad($('phName').value);
  });
  $('phSteps').addEventListener('change', () => {
    phSteps = Number($('phSteps').value) === 8 ? 8 : 16;
    phEnsureWorking();
    phRenderGrid();
  });
  $('phApply').addEventListener('click', phApply);
  $('phClose').addEventListener('click', closePhraseEditor);
  $('phOctDown').addEventListener('click', () => phViewShift(-1));
  $('phOctUp').addEventListener('click', () => phViewShift(1));
  window.addEventListener('resize', phPlace);
  document.addEventListener('pointerdown', (e) => {
    if (!el.classList.contains('open')) return;
    if (el.contains(e.target)) return;
    if (phAnchor && (e.target === phAnchor || phAnchor.contains(e.target))) return;
    closePhraseEditor();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && el.classList.contains('open')) {
      e.preventDefault();
      closePhraseEditor();
    }
  });
  return el;
}

function openPhraseEditor(btn) {
  const el = ensurePhrasePop();
  phAnchor = btn || null;
  const src = getMirror()?.editor?.state?.doc?.toString?.() ?? '';
  phList = src ? phScanPhrases(src) : [];
  el.classList.add('open');
  btn?.classList.add('on');
  phSetStatus('');
  if (!phList.length) {
    $('phName').innerHTML = '';
    $('phHint').textContent = '';
    phSel = null;
    phWorkingBars = [];
    phRenderGrid();
    phSetStatus('nothing to edit in this track', true);
  } else {
    phRebuildSelect();
  }
  phPlace();
  $('phName')?.focus();
}

function closePhraseEditor() {
  const el = $('phrasePop');
  if (!el) return;
  el.classList.remove('open');
  phAnchor?.classList.remove('on');
}

function bindPhraseEditor() {
  const btn = $('phraseBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if ($('phrasePop')?.classList.contains('open')) {
      closePhraseEditor();
      return;
    }
    openPhraseEditor(btn);
  });
}


export function initPhraseEditor(deps = {}) {
  if (typeof deps.getMirror === 'function') getMirror = deps.getMirror;
  if (typeof deps.status === 'function') onStatus = deps.status;
  bindPhraseEditor();
}

// Reused by the section popup to resolve "which phrase is playing here".
export { phScanPhrases as scanPhrases };
