// Section details popup for the native TIMELINE.
// Extracted from panel.js. The popup hangs under the selected section block
// and edits the in-memory section list; every change goes through ctx.commit(),
// which reflows the timeline and writes the `const TIMELINE` literal.
//
// initSectionEditor({ getTimeline, getSelected, setSelected, commit, lanes })
// returns nothing; openSectionEditor(i) / closeSectionEditor() / syncSectionEditor()
// are used by panel.js.

const $ = (id) => document.getElementById(id);
let ctx = null;
let pop = null;
let anchorEl = null;

function spEnsure() {
  if (pop) return pop;
  pop = document.createElement('div');
  pop.id = 'sectionPop';
  pop.setAttribute('role', 'dialog');
  pop.setAttribute('aria-label', 'section details');
  pop.innerHTML = `
    <div class="sp-head">
      <span class="sp-title" id="spTitle"></span>
      <button type="button" id="spClose" title="close">×</button>
    </div>
    <div class="sp-body" id="spBody"></div>`;
  document.body.appendChild(pop);
  $('spClose').addEventListener('click', closeSectionEditor);
  document.addEventListener('pointerdown', (e) => {
    if (!pop.classList.contains('open')) return;
    if (pop.contains(e.target)) return;
    if (e.target.closest?.('#timeline')) return;
    closeSectionEditor();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pop.classList.contains('open')) {
      e.preventDefault();
      closeSectionEditor();
    }
  });
  window.addEventListener('resize', spPlace);
  window.addEventListener('scroll', spPlace, true);
  $('timeline')?.addEventListener('toggle', (e) => {
    if (!e.target.open) closeSectionEditor();
  });
  return pop;
}

function spRow(label, value, onchange, type = 'text') {
  const row = document.createElement('div');
  row.className = 'sp-row';
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
}

function spInfo(key) {
  return ctx.labelFor?.(key) || { group: '', label: key, kind: 'instrument' };
}

// Read-only answer to "which phrase line plays here": only lanes with a
// resolved phrase constant, grouped by instrument group. Multipliers stay in
// the editable target list below.
function spSummary(sec) {
  const wrap = document.createElement('div');
  wrap.className = 'sp-summary';
  const groups = new Map();
  const phrases = ctx.phrasesFor?.(sec) || {};
  for (const [key, raw] of Object.entries(sec.values || {})) {
    const d = spInfo(key);
    if (d.kind !== 'instrument') continue;
    if (!(Number(raw) > 0.001)) continue;
    const ph = phrases[key];
    if (!ph) continue;
    const g = d.group || 'Other';
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(`${d.label} ${ph.name}`);
  }
  if (!groups.size) return null;
  const playing = document.createElement('div');
  playing.className = 'sp-playing';
  for (const [g, items] of groups) {
    const line = document.createElement('div');
    line.className = 'sp-line';
    const b = document.createElement('b');
    b.textContent = g;
    const s = document.createElement('span');
    s.textContent = items.join(' · ');
    line.append(b, s);
    playing.appendChild(line);
  }
  wrap.appendChild(playing);
  return wrap;
}

function spRender() {
  const body = $('spBody');
  if (!body) return;
  const secs = ctx.getTimeline();
  const i = ctx.getSelected();
  const sec = secs[i];
  if (!sec) {
    closeSectionEditor();
    return;
  }
  $('spTitle').textContent = `${sec.name} · bars ${sec.at}–${sec.at + sec.length}`;
  body.innerHTML = '';
  const summary = spSummary(sec);
  if (summary) body.appendChild(summary);

  body.appendChild(spRow('name', sec.name, (v) => {
    sec.name = String(v || 'section');
    ctx.commit();
  }));

  const atRow = spRow('at', sec.at, () => {}, 'number');
  const atInput = atRow.querySelector('input');
  if (atInput) {
    atInput.disabled = true;
    atInput.title = 'auto: sections are contiguous';
  }
  body.appendChild(atRow);

  body.appendChild(spRow('length', sec.length, (v) => {
    sec.length = Math.max(1, Number(v) || 1);
    ctx.commit();
  }, 'number'));

  const moveRow = document.createElement('div');
  moveRow.className = 'sp-row';
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
    if (i <= 0) return;
    [secs[i - 1], secs[i]] = [secs[i], secs[i - 1]];
    ctx.setSelected(i - 1);
    ctx.commit();
  });
  down.addEventListener('click', () => {
    if (i >= secs.length - 1) return;
    [secs[i + 1], secs[i]] = [secs[i], secs[i + 1]];
    ctx.setSelected(i + 1);
    ctx.commit();
  });
  moveRow.append(moveLab, up, down);
  body.appendChild(moveRow);

  const vals = document.createElement('div');
  vals.className = 'sp-vals';
  const entries = Object.entries(sec.values || {}).filter(([key, raw]) => {
    const d = spInfo(key);
    return d.kind !== 'instrument' || Number(raw) > 0.001;
  });
  for (const [key, raw] of entries) {
    const row = document.createElement('div');
    row.className = 'sp-val';
    const lab = document.createElement('span');
    lab.textContent = spInfo(key).label + ' ×';
    lab.title = key;
    const inp = document.createElement('input');
    inp.type = 'number';
    inp.step = '0.01';
    inp.value = raw;
    inp.addEventListener('change', () => {
      const v = Number(inp.value);
      if (!Number.isFinite(v)) return;
      sec.values[key] = v;
      ctx.commit();
    });
    const del = document.createElement('button');
    del.type = 'button';
    del.textContent = '×';
    del.title = 'remove target';
    del.addEventListener('click', () => {
      delete sec.values[key];
      ctx.commit();
    });
    row.append(lab, inp, del);
    vals.appendChild(row);
  }
  body.appendChild(vals);

  const add = document.createElement('div');
  add.className = 'sp-add';
  const sel = document.createElement('select');
  const lanes = [...new Set([...(ctx.lanes?.() || []), ...Object.keys(sec.values || {})])];
  for (const key of lanes) {
    const o = document.createElement('option');
    o.value = key;
    o.textContent = spInfo(key).label;
    sel.appendChild(o);
  }
  sel.value = lanes[0] ?? '';
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
    if (!key || !Number.isFinite(v)) return;
    sec.values[key] = v;
    ctx.commit();
  });
  add.append(sel, val, addBtn);
  body.appendChild(add);

  const delSec = document.createElement('button');
  delSec.type = 'button';
  delSec.className = 'sp-del';
  delSec.textContent = 'remove section';
  delSec.addEventListener('click', () => {
    secs.splice(i, 1);
    ctx.setSelected(-1);
    ctx.commit();
    closeSectionEditor();
  });
  body.appendChild(delSec);
}

function spPlace() {
  if (!pop?.classList.contains('open')) return;
  const target = document.querySelector('#tlSections .tl-block.sel') || anchorEl;
  if (!target) return;
  const r = target.getBoundingClientRect();
  const w = pop.offsetWidth || 340;
  const h = pop.offsetHeight || 240;
  let left = Math.min(Math.max(8, r.left), window.innerWidth - w - 8);
  let top = r.bottom + 6;
  if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 6);
  pop.style.left = `${Math.round(left)}px`;
  pop.style.top = `${Math.round(top)}px`;
}

export function openSectionEditor(index, anchor) {
  if (!ctx) return;
  const secs = ctx.getTimeline();
  if (index != null) ctx.setSelected(index);
  if (!secs[ctx.getSelected()]) return;
  anchorEl = anchor || null;
  spEnsure().classList.add('open');
  spRender();
  spPlace();
}

export function closeSectionEditor() {
  pop?.classList.remove('open');
  anchorEl = null;
}

export function syncSectionEditor() {
  if (!pop?.classList.contains('open')) return;
  const sec = ctx?.getTimeline?.()[ctx.getSelected()];
  if (!sec) {
    closeSectionEditor();
    return;
  }
  spRender();
  spPlace();
}

export function initSectionEditor(deps) {
  ctx = deps || {};
  spEnsure();
}
