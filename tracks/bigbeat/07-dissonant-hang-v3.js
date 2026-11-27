// BIG BEAT 07 · dissonant hang v3 · 128 BPM · C minor
// V3 (v2 kept as reference):
//   - default break is "movement"; the TEMPORARY breakSel switch stays for
//     auditioning the alternatives.
//   - three riff stages: minimal intro (0) → continuous driving line (2); the
//     original dense riff (1) plays only on the mid ACID BREAK.
// Mini-notation only through m(...) (docs/pitfalls.en.md, Rule #1).
const BPM = 128
setcpm(BPM / 4) // one cycle = one 4/4 bar = 1875 ms

if (typeof samples === 'function') {
  samples('github:yaxu/clean-breaks/main')
  samples('github:tidalcycles/Dirt-Samples')
}

// ── transport / switches ─────────────────────────────────────────
const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
  switches: {
    // TEMPORARY: break audition. Pick one break for the mix later.
    breakSel: ['movement', 'think', 'eeloil', 'neworleans', 'squib', 'breaks125:0', 'breaks125:1', 'apache', 'amen'],
  },
}
const play = slider(1, 0, 2, 1)
const breakSel = slider(0, 0, 8, 1)
const wave = pure(2) // SQUARE
const octave = pure(0) // 0
const holdBar = slider(0, 0, 128, 1)
const pickBreak = (i) => breakSel.fmap((v) => (v === i ? 1 : 0))
const WAVE = wave.fmap((v) => ['sine', 'triangle', 'square'][v] || 'square')
const OCT = octave.fmap((v) => [0, 12, -12, -24][v] ?? 0)

// ── global mix ───────────────────────────────────────────────────
const verb = slider(0.32, 0, 1, 0.01)
const tape = slider(0.18, 0, 1, 0.01)

const instruments = {
  drums: {
    name: 'Drums',
    break: {
      name: 'Break',
      vol: slider(0.42, 0, 1.2, 0.01),
      cut: slider(9000, 50, 14000, 100),
      grit: slider(0.35, 0, 0.9, 0.01),
      crush: slider(12, 8, 16, 0.5),
    },
    amen: {
      name: 'Sub break',
      vol: slider(0.28, 0, 0.8, 0.01),
      cut: slider(950, 50, 1800, 10),
    },
    chop: {
      name: 'Chop',
      vol: slider(0.22, 0, 0.6, 0.01),
      cut: slider(7500, 50, 14000, 100),
    },
    kick: {
      name: 'Kick',
      vol: slider(0.55, 0, 1, 0.01),
      cut: slider(140, 50, 600, 10),
      shape: slider(0.35, 0, 0.8, 0.01),
      decay: slider(0.22, 0.05, 0.6, 0.01),
    },
    snare: {
      name: 'Snare',
      vol: slider(0.42, 0, 0.9, 0.01),
      cut: slider(9500, 50, 16000, 100),
    },
    clap: {
      name: 'Clap',
      vol: slider(0.22, 0, 0.7, 0.01),
    },
    hat: {
      name: 'Hats',
      vol: slider(0.16, 0, 0.5, 0.01),
    },
    oh: {
      name: 'Open hat',
      vol: slider(0.12, 0, 0.4, 0.01),
    },
    rim: {
      name: 'Rim',
      vol: slider(0.18, 0, 1.0, 0.01),
    },
    perc: {
      name: 'Perc',
      vol: slider(0.15, 0, 0.4, 0.01),
    },
  },
  low: {
    name: 'Low',
    sub: {
      name: 'Sub',
      vol: slider(0.7, 0, 1.4, 0.01),
      cut: slider(65, 50, 140, 1),
    },
    bass: {
      name: 'Acid bass',
      vol: slider(1.15, 0, 1.4, 0.01),
      cut: slider(3120, 50, 4200, 20),
      grit: slider(0.42, 0, 0.7, 0.01),
    },
  },
  keys: {
    name: 'Synths',
    acid: {
      name: 'Riff lead',
      vol: slider(1.0, 0, 1.6, 0.01),
      cut: slider(100, 50, 6000, 20),
      att: slider(0.002, 0.001, 0.2, 0.001),
      dec: slider(0.24, 0.05, 1.5, 0.01),
    },
    ghost: {
      name: 'Pulse echo',
      vol: slider(0.75, 0, 1.4, 0.01),
      cut: slider(2400, 50, 5500, 20),
      att: slider(0.004, 0.001, 0.5, 0.005),
      dec: slider(0.35, 0.05, 2.0, 0.01),
    },
    solo: {
      name: 'Scream lead',
      vol: slider(0.7, 0, 1.8, 0.01),
      cut: slider(3400, 50, 6800, 20),
      att: slider(0.004, 0.001, 0.2, 0.001),
      dec: slider(0.55, 0.05, 2.0, 0.01),
    },
    stab: {
      name: 'Power hit',
      vol: slider(0.65, 0, 1.2, 0.01),
      cut: slider(2600, 50, 8500, 50),
    },
    pad: {
      name: 'Low drone',
      vol: slider(0.45, 0, 2.0, 0.01),
      cut: slider(900, 50, 3500, 20),
      att: slider(0.6, 0.01, 2.5, 0.01),
      dec: slider(2.0, 0.05, 4, 0.01),
    },
  },
  atmos: {
    name: 'Atmos',
    siren: {
      name: 'Siren',
      vol: slider(0.22, 0, 0.35, 0.01),
    },
    riser: {
      name: 'Riser',
      vol: slider(0.24, 0, 0.4, 0.01),
    },
    vinyl: {
      name: 'Noise bed',
      vol: slider(0.04, 0, 0.25, 0.01),
    },
  },
  fx: {
    reverb: {
      name: 'Reverb',
      size: slider(4.0, 1, 8, 0.1),
    },
  },
}
const { drums, low, keys, atmos, fx } = instruments

// ── form: 128 bars ───────────────────────────────────────────────
// riffStage: 0 = minimal, 1 = original dense (ACID BREAK only),
//            2 = continuous driving line.
const TIMELINE = [
  { at: 0, len: 8, name: 'INTRO RIFF', values: { mode: 0, break: 0.25, amen: 0, chop: 0, kick: 0.5, snare: 0, clap: 0, hat: 0.35, oh: 0, rim: 0, perc: 0, sub: 0.5, bass: 0.5, acid: 0.6, ghost: 0.2, stab: 0, pad: 0.3, solo: 0, soloPart: 0, siren: 0.15, riser: 0, vinyl: 0.4, riffStage: 0 } },
  { at: 8, len: 8, name: 'BREAK + RIFF', values: { mode: 1, break: 0.85, amen: 0, chop: 0, kick: 0.9, snare: 0.8, clap: 0.4, hat: 0.75, oh: 0.4, rim: 0, perc: 0, sub: 0.8, bass: 0.85, acid: 0.9, ghost: 0.4, stab: 0.25, pad: 0.2, solo: 0, soloPart: 0, siren: 0.2, riser: 0, vinyl: 0.3, riffStage: 0 } },
  { at: 16, len: 12, name: 'BIG BEAT GROOVE', values: { mode: 1, break: 1, amen: 0.3, chop: 0, kick: 1, snare: 1, clap: 0.8, hat: 1, oh: 0.7, rim: 0.2, perc: 0.3, sub: 1, bass: 1, acid: 1, ghost: 0.6, stab: 0.65, pad: 0, solo: 0, soloPart: 0, siren: 0, riser: 0, vinyl: 0.15, riffStage: 2 } },
  { at: 28, len: 6, name: 'BUILD 1', values: { mode: 2, break: 1, amen: 0.4, chop: 0.5, kick: 1, snare: 0.85, clap: 0.7, hat: 1.1, oh: 0.6, rim: 0.3, perc: 0.6, sub: 1, bass: 1, acid: 1.1, ghost: 0.7, stab: 0.75, pad: 0, solo: 0.3, soloPart: 0, siren: 0.7, riser: 1, vinyl: 0.15, riffStage: 2 } },
  { at: 34, len: 2, name: 'STOP', values: { mode: 1, break: 0, amen: 0, chop: 0, kick: 0, snare: 0, clap: 0, hat: 0, oh: 0, rim: 0, perc: 0, sub: 0, bass: 0, acid: 0.5, ghost: 0.4, stab: 1, pad: 0.35, solo: 0, soloPart: 0, siren: 0.5, riser: 0, vinyl: 0.15, riffStage: 2 } },
  { at: 36, len: 16, name: 'DROP 1', values: { mode: 1, break: 1, amen: 0.85, chop: 0.6, kick: 1, snare: 1, clap: 1, hat: 1.1, oh: 0.85, rim: 0.4, perc: 0.7, sub: 1, bass: 1, acid: 1.15, ghost: 0.8, stab: 0.9, pad: 0, solo: 0.8, soloPart: 1, siren: 0.75, riser: 0, vinyl: 0.1, riffStage: 2 } },
  { at: 52, len: 10, name: 'ACID BREAK', values: { mode: 0, break: 0.35, amen: 0, chop: 0, kick: 0, snare: 0, clap: 0, hat: 0.3, oh: 0.4, rim: 0.6, perc: 0, sub: 0.4, bass: 0.55, acid: 0.85, ghost: 0.9, stab: 0.35, pad: 0.45, solo: 0.7, soloPart: 2, siren: 0.9, riser: 0, vinyl: 0.4, riffStage: 1 } },
  { at: 62, len: 6, name: 'BUILD 2', values: { mode: 2, break: 1, amen: 0.5, chop: 0.7, kick: 1, snare: 0.9, clap: 0.8, hat: 1.2, oh: 0.8, rim: 0.4, perc: 0.8, sub: 1, bass: 1, acid: 1.1, ghost: 0.8, stab: 0.8, pad: 0, solo: 0.9, soloPart: 1, siren: 0.95, riser: 1, vinyl: 0.15, riffStage: 2 } },
  { at: 68, len: 16, name: 'DROP 2', values: { mode: 2, break: 1, amen: 0.9, chop: 0.8, kick: 1, snare: 1, clap: 1, hat: 1.2, oh: 1, rim: 0.5, perc: 1, sub: 1, bass: 1, acid: 1.2, ghost: 0.9, stab: 1, pad: 0, solo: 1, soloPart: 3, siren: 0.85, riser: 0, vinyl: 0.1, riffStage: 2 } },
  { at: 84, len: 12, name: 'HEAVY RIFF', values: { mode: 1, break: 0.9, amen: 0.5, chop: 0.4, kick: 0.85, snare: 0.75, clap: 0.5, hat: 0.85, oh: 0.6, rim: 0.3, perc: 0.4, sub: 0.85, bass: 1, acid: 1.15, ghost: 0.8, stab: 0.7, pad: 0.25, solo: 0.85, soloPart: 2, siren: 0.8, riser: 0, vinyl: 0.3, riffStage: 2 } },
  { at: 96, len: 16, name: 'FINAL DROP', values: { mode: 2, break: 1, amen: 1, chop: 0.8, kick: 1, snare: 1, clap: 1, hat: 1.2, oh: 1, rim: 0.5, perc: 1, sub: 1, bass: 1, acid: 1.2, ghost: 0.9, stab: 1, pad: 0, solo: 1, soloPart: 4, siren: 0.95, riser: 0, vinyl: 0.1, riffStage: 2 } },
  { at: 112, len: 16, name: 'OUTRO', values: { mode: 0, break: 0.4, amen: 0, chop: 0, kick: 0.4, snare: 0, clap: 0, hat: 0.3, oh: 0.2, rim: 0, perc: 0, sub: 0.4, bass: 0.4, acid: 0.5, ghost: 0.3, stab: 0, pad: 0.4, solo: 0, soloPart: 0, siren: 0.1, riser: 0, vinyl: 0.5, riffStage: 0 } },
]

const AUTOMATION = [
  { path: 'keys.pad.cut', points: [[0, 0.4], [16, 1.0], [52, 1.3], [68, 0.8], [84, 1.1], [112, 0.7], [128, 0.2]] },
  { path: 'drums.break.cut', points: [[0, 0.5], [16, 0.9], [28, 1.3], [34, 1.8], [36, 1.6], [52, 0.6], [62, 1.4], [68, 1.7], [84, 1.0], [96, 1.8], [112, 0.5], [128, 0.2]] },
  { path: 'low.bass.cut', points: [[0, 0.5], [16, 1.0], [28, 1.4], [34, 1.9], [36, 1.5], [52, 0.6], [62, 1.5], [68, 1.7], [84, 1.2], [96, 1.8], [112, 0.6], [128, 0.25]] },
  { path: 'keys.acid.cut', points: [[0, 0.45], [16, 0.95], [28, 1.45], [34, 2.0], [36, 1.7], [52, 0.7], [62, 1.5], [68, 1.9], [84, 1.6], [96, 2.0], [112, 0.55], [128, 0.25]] },
  { path: 'keys.ghost.cut', points: [[0, 0.5], [16, 0.9], [28, 1.2], [36, 1.4], [52, 0.8], [62, 1.3], [68, 1.5], [84, 1.2], [96, 1.6], [112, 0.6], [128, 0.3]] },
  { path: 'keys.stab.cut', points: [[0, 0.6], [16, 1.0], [28, 1.3], [36, 1.5], [52, 0.7], [68, 1.6], [96, 1.7], [112, 0.5], [128, 0.3]] },
  { path: 'atmos.siren.vol', points: [[0, 0.4], [16, 0], [28, 0.9], [34, 1.4], [36, 0.7], [52, 1.3], [62, 1.1], [68, 0.9], [84, 0.8], [96, 1.0], [112, 0.3], [128, 0.1]] },
]

const TL_TOTAL = Math.max(...TIMELINE.map((s) => s.at + s.len))
const autoCurve = (path) => {
  const lane = AUTOMATION.find((a) => a.path === path)
  const pts = lane?.points || []
  if (!pts.length) return pure(1)
  const segs = []
  let pos = 0
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, va] = pts[i]
    const [b, vb] = pts[i + 1]
    if (a > pos) segs.push([a - pos, pure(1)])
    if (b > a) segs.push([b - a, va === vb ? pure(va) : saw.range(va, vb).slow(b - a)])
    pos = b
  }
  if (pos < TL_TOTAL) segs.push([TL_TOTAL - pos, pure(pts[pts.length - 1][1])])
  return arrange(...segs)
}
const tlCurve = (key) => {
  let last = 0
  const segs = []
  for (let i = 0; i < TIMELINE.length; i++) {
    const sec = TIMELINE[i]
    if (Object.prototype.hasOwnProperty.call(sec.values, key)) last = sec.values[key]
    const next = i + 1 < TIMELINE.length ? TIMELINE[i + 1].at : TL_TOTAL
    if (next - sec.at > 0) segs.push([next - sec.at, pure(last)])
  }
  return arrange(...segs)
}
const state = play.fmap((v) => Math.round(v))
const songGate = state.fmap((v) => (v === 1 ? 1 : 0))
const loopGate = state.fmap((v) => (v === 0 ? 1 : 0))
const holdGate = state.fmap((v) => (v === 2 ? 1 : 0))
const sectionAt = (bar) => {
  for (let i = 0; i < TIMELINE.length; i++) {
    if (bar < TIMELINE[i].at + TIMELINE[i].len) return i
  }
  return TIMELINE.length - 1
}
const holdIndex = holdBar.fmap((bar) => sectionAt(Math.max(0, Math.round(bar))))
const sectionValue = (key) =>
  holdIndex.pick(TIMELINE.map((sec) => pure(sec.values[key] ?? 0)))
const mode = tlCurve('mode').mul(songGate)
  .add(pure(1).mul(loopGate))
  .add(sectionValue('mode').mul(holdGate))
const tlOr = (key, loopLevel = pure(1)) =>
  tlCurve(key).mul(songGate).add(loopLevel.mul(loopGate)).add(sectionValue(key).mul(holdGate))
const gateOf = (key) => tlOr(key).fmap((v) => v > 0.001)
const autoValueAt = (path, bar) => {
  const pts = AUTOMATION.find((a) => a.path === path)?.points || []
  if (!pts.length) return 1
  if (bar < pts[0][0]) return 1
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, va] = pts[i]
    const [b, vb] = pts[i + 1]
    if (bar <= b) return a === b ? vb : va + ((vb - va) * (bar - a)) / (b - a)
  }
  return pts[pts.length - 1][1]
}
const autoAt = (path) =>
  autoCurve(path).mul(songGate)
    .add(loopGate)
    .add(holdBar.fmap((b) => autoValueAt(path, b)).mul(holdGate))

// ── material ─────────────────────────────────────────────────────
const phrase = (bars) => m('<' + bars.map((bar) => '[' + bar + ']').join(' ') + '>')

const PAD_A = phrase([
  'c2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  'db2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  'c2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  'gb1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
])

// Stage 0 — minimal intro: few notes per bar, hard rhythmic repeats.
const ACID_M = phrase([
  'c3 ~ ~ c3 ~ c3 ~ ~ c3 ~ ~ c3 ~ ~ c3 ~',
  'db3 ~ ~ db3 ~ ~ db3 ~ ~ db3 ~ gb3 ~ ~ ~ ~',
  'c3 ~ c3 ~ db3 ~ c3 ~ ~ c3 ~ db3 ~ ab3 ~ ~',
  'gb3 ~ ~ gb3 ~ ~ db3 ~ ~ gb3 ~ ~ db3 ~ b3 ~',
])

const BASS_M = phrase([
  'c2 ~ ~ c2 ~ ~ c2 ~ c2 ~ ~ c2 ~ ~ db2 ~',
  'db2 ~ ~ db2 ~ ~ db2 ~ ~ db2 ~ ~ db2 ~ gb1 ~',
  'c2 ~ c2 ~ c2 ~ ~ c2 ~ ~ db2 ~ ~ c2 ~ ~',
  'gb1 ~ ~ gb1 ~ ~ db2 ~ ~ gb1 ~ ~ db2 ~ bb1 ~',
])

// Stage 1 — original dense riff; ACID BREAK only.
const BASS_A = phrase([
  'c2 c2 ~ c2 c2 ~ c2 c2 ~ c2 ~ c2 c2 ~ ~ ~',
  'db2 db2 ~ db2 ~ ~ db2 ~ gb1 gb1 ~ ~ ~ ~ ~ ~',
  'c2 c2 ~ c2 c2 db2 c2 c2 ~ c2 ~ c2 c2 c2 ~ ~',
  'gb1 gb1 ~ db2 db2 ~ ~ ~ db2 ~ ~ ~ ~ ~ ~ ~',
])

const ACID_A = phrase([
  'c3 c3 ~ c3 c3 db3 ~ c3 c4 c4 ~ c3 c3 ~ ~ ~',
  'db3 db3 ~ db3 ~ ~ db3 ~ gb3 gb3 ~ gb3 ~ ~ ~ ~',
  'c3 c3 ~ c3 db3 ~ c3 c3 c4 c4 ~ c4 c3 c3 ~ ~',
  'gb3 gb3 ~ gb3 ~ ~ db3 ~ db3 db3 ~ ~ ~ ~ ~ ~',
])

// Stage 2 — continuous driving line: no long gaps, repeated notes, octave
// jumps and b2 / tritone accents keep it acid without becoming a melody.
const ACID_C = phrase([
  'c3 c3 c3 db3 c3 c3 c3 c4 c3 c3 db3 c3 c3 c3 gb3 c3',
  'db3 db3 db3 gb3 db3 db3 db3 db3 db3 bb3 db3 db3 ab3 db3 db3 db3',
  'c3 c3 db3 c3 c3 c3 c4 c3 c3 db3 c3 c3 c3 gb3 c3 c3',
  'gb3 gb3 db3 gb3 gb3 gb3 db3 gb3 ab3 gb3 gb3 db3 bb3 gb3 db3 gb3',
])

const BASS_C = phrase([
  'c2 c2 c2 c2 c2 c2 db2 c2 c2 c2 c2 c2 bb1 c2 c2 c2',
  'db2 db2 db2 db2 db2 db2 gb1 db2 db2 db2 db2 db2 ab1 db2 db2 db2',
  'c2 c2 c2 db2 c2 c2 c2 c2 c2 c2 db2 c2 c2 c2 bb1 c2',
  'gb1 gb1 gb1 db2 gb1 gb1 gb1 gb1 ab1 gb1 gb1 db2 bb1 gb1 db2 gb1',
])

// Эхо-пульс: повторяет укол и оставляет висеть
const MEL_A = phrase([
  'c4 ~ ~ c4 ~ ~ ~ ~ c4 ~ ~ ~ ~ ~ ~ ~',
  'db4 ~ ~ db4 ~ ~ ~ ~ gb3 ~ ~ ~ ~ ~ ~ ~',
  'c4 ~ ~ c4 ~ db4 ~ ~ c4 ~ ~ c4 ~ ~ ~ ~',
  'gb3 ~ ~ ~ ~ ~ db4 ~ db4 ~ ~ ~ ~ ~ ~ ~',
])

// Ударные стабы: жесткие точки, без лесенок
const STAB_A = phrase([
  'c3 ~ ~ ~ c3 ~ ~ ~ c3 ~ ~ ~ c3 ~ ~ ~',
  'db3 ~ ~ ~ ~ ~ ~ ~ gb3 ~ ~ ~ ~ ~ ~ ~',
  'c3 ~ ~ ~ db3 ~ ~ ~ c4 ~ ~ ~ c3 ~ ~ ~',
  'gb3 ~ ~ ~ ~ ~ db3 ~ ~ ~ ~ ~ ~ ~ ~ ~',
])

const solos = (bars) => note(m('<' + bars.map((bar) => '[' + bar + ']').join(' ') + '>'))

const SOLO_A = solos([
  'c4 c4 ~ c4 ~ db4 ~ ~ c4 c4 ~ ~ c4 ~ ~ ~',
  'db4 db4 ~ ~ db4 ~ ~ ~ gb4 gb4 ~ ~ ~ ~ ~ ~',
  'c4 ~ db4 ~ c4 c4 ~ ~ c4 c4 ~ db4 c4 ~ ~ ~',
  'gb4 ~ ~ ~ db4 db4 ~ ~ gb4 ~ ~ ~ ~ ~ ~ ~',
])

const SOLO_B = solos([
  'c4 c4 ~ c4 db4 ~ ~ ~ c5 c5 ~ ~ c4 ~ ~ ~',
  'db5 db5 ~ ~ ~ ~ db5 ~ gb4 gb4 ~ ~ ~ ~ ~ ~',
  'c5 ~ ~ c4 db5 ~ ~ c4 c5 c5 ~ ~ c4 c4 ~ ~',
  'gb4 ~ ~ gb4 ~ ~ db5 ~ db5 ~ ~ ~ ~ ~ ~ ~',
])

const SOLO_C = solos([
  'c4 ~ c4 ~ db4 ~ db4 ~ c4 ~ c4 ~ c4 ~ ~ ~',
  'db4 ~ db4 ~ ~ ~ db4 ~ gb4 ~ gb4 ~ ~ ~ ~ ~',
  'c4 ~ db4 ~ c4 ~ c4 ~ c5 ~ c5 ~ c4 ~ ~ ~',
  'gb4 ~ ~ ~ db5 ~ db5 ~ gb4 ~ ~ ~ ~ ~ ~ ~',
])

const SOLO_D = solos([
  'c5 ~ ~ ~ ~ ~ ~ ~ c4 ~ ~ ~ ~ ~ ~ ~',
  'db5 ~ ~ ~ ~ ~ ~ ~ gb4 ~ ~ ~ ~ ~ ~ ~',
  'c5 ~ ~ ~ db5 ~ ~ ~ c5 ~ ~ ~ c4 ~ ~ ~',
  'gb4 ~ ~ ~ ~ ~ db5 ~ db5 ~ ~ ~ ~ ~ ~ ~',
])

const SOLO_E = solos([
  'c4 c4 ~ ~ db4 ~ ~ ~ c5 ~ ~ ~ ~ ~ ~ ~',
  'db5 ~ ~ ~ db5 ~ ~ ~ gb4 gb4 ~ ~ ~ ~ ~ ~',
  'c4 ~ db4 ~ c4 ~ ~ ~ c5 c5 ~ ~ c4 ~ ~ ~',
  'gb4 ~ ~ ~ db5 ~ ~ ~ db5 ~ ~ ~ ~ ~ ~ ~',
])

const stagePick = tlOr('riffStage', pure(0))
  .fmap((v) => Math.max(0, Math.min(2, Math.round(v))))
const BASS = stagePick.pick([note(BASS_M), note(BASS_A), note(BASS_C)])
const ACID = stagePick.pick([note(ACID_M), note(ACID_A), note(ACID_C)])
const SUB = BASS.ctranspose(-12)
const STAB = note(STAB_A)
const MEL = note(MEL_A)
const PAD = note(PAD_A)
const soloPart = tlCurve('soloPart').mul(songGate)
  .add(pure(0).mul(loopGate))
  .add(sectionValue('soloPart').mul(holdGate))
const SOLO = soloPart.pick([SOLO_A, SOLO_B, SOLO_C, SOLO_D, SOLO_E])

const grooves = {
  kick: [
    m('x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~'),
    m('x ~ ~ x x ~ ~ ~ x ~ ~ x x ~ ~ ~'),
    m('x ~ .65 .55 x ~ .65 .55 x ~ .65 .55 x ~ .65 .55'),
  ],
  snare: [
    m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
    m('~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~ ~ x'),
    m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ x'),
  ],
  hat: [
    m('x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~'),
    m('x ~ x x x ~ x ~ x ~ x x x ~ x ~'),
    m('x x x x x x x x x x x x x x x x'),
  ],
}

const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}

// ── lanes ────────────────────────────────────────────────────────

// BREAK — the hook. TEMPORARY breakSel switch auditions the alternatives.
const breakLane = (name, bars, idx, shift = 0) => {
  const lane = shift ? s(name).loopAt(bars).late(shift) : s(name).loopAt(bars)
  return lane.gain(drums.break.vol.mul(tlOr('break')).mul(pickBreak(idx)))
}
$: stack(
  breakLane('movement', 2, 0),
  breakLane('think', 1, 1),
  breakLane('eeloil', 2, 2),
  breakLane('neworleans', 2, 3),
  breakLane('squib', 2, 4),
  breakLane('breaks125:0', 1, 5),
  breakLane('breaks125:1', 1, 6),
  breakLane('apache', 2, 7),
  breakLane('amen', 4, 8, 1),
  )
  .hpf(70).lpf(drums.break.cut.mul(autoAt('drums.break.cut')))
  .distort(drums.break.grit)
  .crush(drums.break.crush)
  .room(verb.mul(0.06)).roomsize(fx.reverb.size)
  .mask(gateOf('break'))
  .filter(audible)

// AMEN WEIGHT — low-passed body under the drops, independent of breakSel.
$: s('amen').loopAt(4).late(1)
  .gain(drums.amen.vol.mul(tlOr('amen')))
  .hpf(40).lpf(drums.amen.cut)
  .mask(gateOf('amen'))

$: s('amencutup').n(m('0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15'))
  .gain(drums.chop.vol.mul(tlOr('chop')))
  .hpf(220).lpf(drums.chop.cut).clip(0.5)
  .mask(gateOf('chop'))

$: s('bd').bank('RolandTR909').struct(mode.pick(grooves.kick))
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .lpf(drums.kick.cut).lpq(1)
  .shape(drums.kick.shape)
  .decay(drums.kick.decay).sustain(0).release(0.06)
  .mask(gateOf('kick'))

$: stack(
  s('sd').bank('RolandTR909').struct(mode.pick(grooves.snare))
    .gain(drums.snare.vol.mul(tlOr('snare'))),
  s('cp').struct(m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'))
    .gain(drums.clap.vol.mul(tlOr('clap')))
  )
  .hpf(180).lpf(drums.snare.cut)
  .room(verb.mul(0.15)).roomsize(fx.reverb.size)
  .mask(gateOf('snare'))

$: s('hh').bank('RolandTR909').struct(mode.pick(grooves.hat))
  .gain(drums.hat.vol.mul(tlOr('hat')).mul(m('<1 .55 .8 .65>')))
  .hpf(6500)
  .mask(gateOf('hat'))

$: s('oh').bank('RolandTR909').struct(m('~ ~ ~ ~ ~ ~ ~ o ~ ~ ~ ~ ~ ~ ~ o'))
  .gain(drums.oh.vol.mul(tlOr('oh')))
  .hpf(5000)
  .mask(gateOf('oh'))

$: s('rim').struct(m('~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x'))
  .gain(drums.rim.vol.mul(tlOr('rim')))
  .hpf(600)
  .mask(gateOf('rim'))

$: stack(
  s('perc').n(m('0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1'))
    .gain(drums.perc.vol.mul(tlOr('perc')).mul(m('<1 .5 .8 .6>'))),
  s('cb').struct(m('~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x'))
    .gain(drums.perc.vol.mul(tlOr('perc')).mul(0.5))
  )
  .hpf(2500)
  .mask(gateOf('perc'))

$: SUB.s('sine')
  .gain(low.sub.vol.mul(tlOr('sub')))
  .lpf(low.sub.cut)
  .mask(gateOf('sub'))

$: BASS.s('sawtooth')
  .gain(low.bass.vol.mul(tlOr('bass')))
  .lpf(low.bass.cut.mul(autoAt('low.bass.cut'))).lpq(8)
  .distort(low.bass.grit)
  .hpf(40)
  .mask(gateOf('bass'))

$: ACID.ctranspose(OCT).s('sawtooth')
  .gain(keys.acid.vol.mul(tlOr('acid')))
  .attack(keys.acid.att).decay(keys.acid.dec).sustain(0.15).release(0.25)
  .lpf(keys.acid.cut.mul(autoAt('keys.acid.cut'))).lpq(7)
  .distort(0.25).delay(0.22).delaytime(0.375)
  .mask(gateOf('acid'))

$: MEL.ctranspose(OCT).s(WAVE)
  .gain(keys.ghost.vol.mul(tlOr('ghost')))
  .attack(keys.ghost.att).decay(keys.ghost.dec).sustain(0.15).release(0.35)
  .lpf(keys.ghost.cut.mul(autoAt('keys.ghost.cut'))).lpq(6)
  .delay(0.28).delaytime(0.75)
  .mask(gateOf('ghost'))

$: STAB.s('square').clip(0.35)
  .gain(keys.stab.vol.mul(tlOr('stab')))
  .lpf(keys.stab.cut.mul(autoAt('keys.stab.cut'))).lpq(5)
  .delay(0.18).delaytime(0.375)
  .mask(gateOf('stab'))

$: PAD.s('sawtooth').clip(1)
  .gain(keys.pad.vol.mul(tlOr('pad')))
  .hpf(120).lpf(keys.pad.cut.mul(autoAt('keys.pad.cut'))).lpq(2)
  .attack(keys.pad.att).decay(keys.pad.dec).sustain(0.7).release(1.5)
  .room(verb.mul(0.8)).roomsize(fx.reverb.size)
  .mask(gateOf('pad'))

$: SOLO.ctranspose(OCT).s('sawtooth').slide(0.1)
  .gain(keys.solo.vol.mul(tlOr('solo')))
  .attack(keys.solo.att).decay(keys.solo.dec).sustain(0.2).release(0.4)
  .lpf(keys.solo.cut).lpq(6)
  .delay(0.25).delaytime(0.375).room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .mask(gateOf('solo'))

$: s('white').slow(8).bpf(720).bpq(12).bpenv(3)
  .bpa(0.01).bpd(0.45).bps(0.25)
  .gain(atmos.siren.vol.mul(tlOr('siren')).mul(autoAt('atmos.siren.vol')))
  .mask(gateOf('siren'))

$: s('white').slow(8)
  .gain(atmos.riser.vol.mul(tlOr('riser')).mul(saw.range(0.25, 1).slow(8)))
  .lpf(saw.range(300, 9000).slow(8)).hpf(280)
  .mask(gateOf('riser'))

$: s('crackle')
  .gain(atmos.vinyl.vol.mul(tape).mul(tlOr('vinyl')))
  .hpf(1800)
  .mask(gateOf('vinyl'))
