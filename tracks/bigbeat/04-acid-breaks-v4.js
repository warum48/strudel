// BIG BEAT 04 · acid breaks v4 · 125 BPM · C minor
// V4 arrangement (v3 kept as reference):
//   - STOP is 2 bars, no drums, only the existing stab/pad/vinyl bed.
//   - DROP 2 is split into 2A/2B: 2A thins the scale runs with quarter-note
//     triplets, 2B keeps the full runs and adds percussion/hats.
//     DROP 3 uses the moderate 3-up / 1-back line.
//   - the whole DROP 2 (both halves) is copied again after OUTRO as DROP 3.
//   - final OUTRO 2 is 14 bars; OUTRO 3 (14 bars) mirrors INTRO.
// Jazz phrasing notes: docs/jazz-solo.en.md.
// Mini-notation only through m(...) (docs/pitfalls.en.md, Rule #1).
const BPM = 125
setcpm(BPM / 4) // one cycle = one 4/4 bar = 1920 ms

if (typeof samples === 'function') {
  samples('github:yaxu/clean-breaks/main')
  samples('github:tidalcycles/Dirt-Samples')
}

// ── transport (switches fixed for the final mix) ─────────────────
const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
  // final mix: no switches.
  // mode: straight / broken / roll
  // breakSel: apache / amen / think / movement / ...
  // wave: sine / tri / square
  // octave: 0 / +1 / -1 / -2
}
const play = slider(1, 0, 2, 1)
// Final-track settings: wave/octave fixed; mode comes from TIMELINE.
const wave = pure(0) // SINE
const octave = pure(0) // 0
const holdBar = slider(0, 0, 132, 1)
const WAVE = wave.fmap((v) => ['sine', 'triangle', 'square'][v] || 'sine')
const OCT = octave.fmap((v) => [0, 12, -12, -24][v] ?? 0)
// Removed from the final track (for reference):
// mode: driven by TIMELINE (GROOVE = straight, every DROP B = roll)
// breakSel: slider 0..8, fixed to 0 (APACHE)
// wave: slider 0..2, fixed to 0 (SINE)
// octave: slider 0..3, fixed to 0

// ── global mix ───────────────────────────────────────────────────
const verb = slider(0.42, 0, 1, 0.01)
const tape = slider(0.3, 0, 1, 0.01)

const instruments = {
  drums: {
    name: 'Drums',
    break: {
      name: 'Break',
      vol: slider(0.27, 0, 1.2, 0.01),
      cut: slider(7000, 50, 14000, 100),
      grit: slider(0.28, 0, 0.9, 0.01),
      crush: slider(13, 8, 16, 0.5),
    },
    amen: {
      name: 'Amen weight',
      vol: slider(0.28, 0, 0.8, 0.01),
      cut: slider(600, 50, 1200, 10),
    },
    chop: {
      name: 'Chop',
      vol: slider(0.16, 0, 0.6, 0.01),
      cut: slider(6000, 50, 14000, 100),
    },
    kick: {
      name: 'Kick',
      vol: slider(0.36, 0, 1, 0.01),
      cut: slider(120, 50, 600, 10),
      shape: slider(0.22, 0, 0.8, 0.01),
      decay: slider(0.2, 0.05, 0.6, 0.01),
    },
    snare: {
      name: 'Snare',
      vol: slider(0.34, 0, 0.9, 0.01),
      cut: slider(8000, 50, 16000, 100),
    },
    clap: {
      name: 'Clap',
      vol: slider(0.18, 0, 0.7, 0.01),
    },
    hat: {
      name: 'Hats',
      vol: slider(0.13, 0, 0.5, 0.01),
    },
    oh: {
      name: 'Open hat',
      vol: slider(0.08, 0, 0.4, 0.01),
    },
    rim: {
      name: 'Rim',
      vol: slider(0.16, 0, 1.0, 0.01),
    },
    perc: {
      name: 'Perc',
      vol: slider(0.12, 0, 0.4, 0.01),
    },
  },
  low: {
    name: 'Low',
    sub: {
      name: 'Sub',
      vol: slider(0.6, 0, 1.4, 0.01),
      cut: slider(55, 50, 120, 1),
    },
    bass: {
      name: 'Bass',
      vol: slider(1.0, 0, 1.4, 0.01),
      cut: slider(80, 50, 80, 1),
      grit: slider(0.25, 0, 0.6, 0.01),
    },
  },
  keys: {
    name: 'Keys',
    acid: {
      name: 'Rhodes lead',
      vol: slider(1.1, 0, 1.6, 0.01),
      cut: slider(2450, 50, 4000, 20),
      att: slider(0.001, 0.001, 0.2, 0.001),
      dec: slider(0.7, 0.05, 1.5, 0.01),
    },
    ghost: {
      name: 'Rhodes ghost',
      vol: slider(0.85, 0, 1.4, 0.01),
      cut: slider(2270, 50, 4000, 20),
      att: slider(0.005, 0.005, 0.5, 0.005),
      dec: slider(1.0, 0.1, 2.5, 0.01),
    },
    solo: {
      name: 'Jazz Rhodes',
      vol: slider(0.6, 0, 1.8, 0.01),
      cut: slider(2600, 50, 6000, 20),
      att: slider(0.003, 0.001, 0.2, 0.001),
      dec: slider(0.8, 0.05, 2, 0.01),
    },
    stab: {
      name: 'Chord stab',
      vol: slider(0.63, 0, 1.2, 0.01),
      cut: slider(1850, 50, 10000, 50),
    },
    pad: {
      name: 'Pad',
      vol: slider(1.0, 0, 2.0, 0.01),
      cut: slider(1250, 50, 4000, 20),
      att: slider(0.95, 0.01, 2.5, 0.01),
      dec: slider(2.83, 0.05, 4, 0.01),
    },
  },
  atmos: {
    name: 'Atmos',
    siren: {
      name: 'Siren',
      vol: slider(0.17, 0, 0.3, 0.01),
    },
    riser: {
      name: 'Riser',
      vol: slider(0.2, 0, 0.35, 0.01),
    },
    vinyl: {
      name: 'Vinyl',
      vol: slider(0.05, 0, 0.25, 0.01),
    },
  },
  fx: {
    reverb: {
      name: 'Reverb',
      size: slider(3.5, 1, 8, 0.1),
    },
  },
}
const { drums, low, keys, atmos, fx } = instruments

// ── form: 133 bars ───────────────────────────────────────────────
const TIMELINE = [
  { at: 0, len: 8, name: 'INTRO', values: { mode: 1, break: 0, amen: 0, chop: 0, kick: 0, snare: 0, clap: 0, hat: 0.25, oh: 0, rim: 0, perc: 0, sub: 0, bass: 0, acid: 0.2, ghost: 0.5, stab: 0, pad: 0.6, solo: 0, soloPart: 0, siren: 0.1, riser: 0, vinyl: 1 } },
  { at: 8, len: 8, name: 'INTRO 2', values: { mode: 1, break: 0, amen: 0, chop: 0, kick: 1, snare: 1, clap: 0.7, hat: 1, oh: 0.6, rim: 0, perc: 0, sub: 0.6, bass: 0.4, acid: 0.4, ghost: 0.5, stab: 0.3, pad: 0.5, solo: 0.15, soloPart: 0, siren: 0.1, riser: 0, vinyl: 0.8 } },
  { at: 16, len: 8, name: 'GROOVE', values: { mode: 0, break: 1, amen: 0, chop: 0, kick: 1, snare: 1, clap: 0.7, hat: 1, oh: 0.6, rim: 0, perc: 0, sub: 1, bass: 1, acid: 0.9, ghost: 0.7, stab: 0.6, pad: 0.35, solo: 0, soloPart: 0, siren: 0, riser: 0, vinyl: 0.5 } },
  { at: 24, len: 8, name: 'BUILD', values: { mode: 2, break: 1, amen: 0, chop: 0.3, kick: 1, snare: 0.6, clap: 0.5, hat: 1, oh: 0.4, rim: 0, perc: 0, sub: 1, bass: 1, acid: 0.8, ghost: 0.5, stab: 0.4, pad: 0.5, solo: 0, soloPart: 0, siren: 0.5, riser: 1, vinyl: 0.4 } },
  { at: 32, len: 2, name: 'STOP', values: { mode: 1, break: 0, amen: 0, chop: 0, kick: 0, snare: 0, clap: 0, hat: 0, oh: 0, rim: 0, perc: 0, sub: 0, bass: 0, acid: 0, ghost: 0, stab: 1, pad: 0.3, solo: 0, soloPart: 0, siren: 0, riser: 0, vinyl: 0.2 } },
  { at: 34, len: 16, name: 'DROP', values: { mode: 1, break: 1, amen: 0.8, chop: 0.5, kick: 1, snare: 1, clap: 0.9, hat: 1, oh: 0.7, rim: 0.4, perc: 0, sub: 1, bass: 1, acid: 1, ghost: 1, stab: 1, pad: 0.4, solo: 1.0, soloPart: 0, siren: 0.6, riser: 0, vinyl: 0.3 } },
  { at: 50, len: 8, name: 'BREAK', values: { mode: 1, break: 0.55, amen: 0.3, chop: 0, kick: 0, snare: 0, clap: 0, hat: 0.3, oh: 0, rim: 0.7, perc: 0, sub: 0, bass: 0, acid: 0.45, ghost: 0.9, stab: 0.5, pad: 1.0, solo: 1.0, soloPart: 1, siren: 0.7, riser: 0, vinyl: 1 } },
  { at: 58, len: 8, name: 'RETURN', values: { mode: 1, break: 1, amen: 0.6, chop: 0.6, kick: 1, snare: 1, clap: 0.8, hat: 1, oh: 0.7, rim: 0.5, perc: 0, sub: 1, bass: 1, acid: 1, ghost: 0.8, stab: 0.8, pad: 0.4, solo: 0.85, soloPart: 0, siren: 0, riser: 0, vinyl: 0.4 } },
  { at: 66, len: 8, name: 'DROP 2A', values: { mode: 1, break: 1, amen: 0.8, chop: 0.5, kick: 1, snare: 1, clap: 0.9, hat: 1, oh: 0.7, rim: 0.4, perc: 0, sub: 1, bass: 1, acid: 1, ghost: 1, stab: 1, pad: 0.4, solo: 1.0, soloPart: 4, siren: 0.6, riser: 0, vinyl: 0.3 } },
  { at: 74, len: 8, name: 'DROP 2B', values: { mode: 2, break: 1, amen: 0.8, chop: 0.5, kick: 1, snare: 1, clap: 1.0, hat: 1.2, oh: 1.0, rim: 0.6, perc: 1, sub: 1, bass: 1, acid: 1, ghost: 1, stab: 1, pad: 0.4, solo: 1.0, soloPart: 2, siren: 0.6, riser: 0, vinyl: 0.3 } },
  { at: 82, len: 7, name: 'OUTRO', values: { mode: 1, break: 0.7, amen: 0, chop: 0, kick: 0, snare: 0, clap: 0, hat: 0.25, oh: 0, rim: 0, perc: 0, sub: 0, bass: 0, acid: 0.4, ghost: 0.5, stab: 0.4, pad: 0.8, solo: 0.3, soloPart: 0, siren: 0.2, riser: 0, vinyl: 1 } },
  { at: 89, len: 8, name: 'DROP 3A', values: { mode: 1, break: 1, amen: 0.8, chop: 0.5, kick: 1, snare: 1, clap: 0.9, hat: 1, oh: 0.7, rim: 0.4, perc: 0, sub: 1, bass: 1, acid: 1, ghost: 1, stab: 1, pad: 0.4, solo: 1.0, soloPart: 3, siren: 0.6, riser: 0, vinyl: 0.3 } },
  { at: 97, len: 8, name: 'DROP 3B', values: { mode: 2, break: 1, amen: 0.8, chop: 0.5, kick: 1, snare: 1, clap: 1.0, hat: 1.2, oh: 1.0, rim: 0.6, perc: 1, sub: 1, bass: 1, acid: 1, ghost: 1, stab: 1, pad: 0.4, solo: 1.0, soloPart: 3, siren: 0.6, riser: 0, vinyl: 0.3 } },
  { at: 105, len: 14, name: 'OUTRO 2', values: { mode: 1, break: 0.7, amen: 0, chop: 0, kick: 0, snare: 0, clap: 0, hat: 0.25, oh: 0, rim: 0, perc: 0, sub: 0, bass: 0, acid: 0.4, ghost: 0.5, stab: 0.4, pad: 0.8, solo: 0.3, soloPart: 0, siren: 0.2, riser: 0, vinyl: 1 } },
  { at: 119, len: 14, name: 'OUTRO 3', values: { mode: 1, break: 0, amen: 0, chop: 0, kick: 0, snare: 0, clap: 0, hat: 0.25, oh: 0, rim: 0, perc: 0, sub: 0, bass: 0, acid: 0.2, ghost: 0.5, stab: 0, pad: 0.6, solo: 0, soloPart: 0, siren: 0.1, riser: 0, vinyl: 1 } },
]

const AUTOMATION = [
  { path: 'keys.pad.cut', points: [[0, 0], [8, 1], [119, 1], [133, 0]] },
  { path: 'drums.break.cut', points: [[0, 0.5], [8, 0.7], [16, 0.1], [24, 1], [31, 1.7], [32, 0.35], [34, 1.5], [50, 0.55], [58, 1.2], [66, 1.5], [74, 1.6], [82, 0.45], [89, 1.5], [97, 1.6], [105, 0.45], [119, 0], [133, 0.5]] },
  { path: 'low.bass.cut', points: [[0, 0.85], [16, 1], [50, 0.7], [58, 1], [66, 1], [82, 0.8], [89, 1], [105, 0.8], [119, 0.85], [133, 0.85]] },
  { path: 'keys.acid.cut', points: [[0, 0.6], [16, 0.9], [24, 1.1], [31, 1.8], [34, 2], [50, 0.6], [58, 1.4], [66, 2], [82, 0.5], [89, 2], [105, 0.4], [119, 0.6], [133, 0.6]] },
  { path: 'keys.ghost.cut', points: [[0, 0.7], [16, 0.9], [31, 1.3], [34, 1.5], [50, 0.7], [58, 1.3], [66, 1.5], [82, 0.6], [89, 1.5], [105, 0.5], [119, 0.7], [133, 0.7]] },
  { path: 'keys.stab.cut', points: [[0, 0.7], [16, 1], [31, 1.4], [34, 1.6], [50, 0.6], [58, 1.3], [66, 1.6], [82, 0.5], [89, 1.6], [105, 0.4], [119, 0.7], [133, 0.7]] },
  { path: 'atmos.siren.vol', points: [[0, 0.5], [16, 0], [24, 0.8], [31, 1.4], [34, 0.6], [50, 1.2], [58, 0], [66, 0.6], [82, 0.2], [89, 0.6], [105, 0.2], [119, 0.5], [133, 0.5]] },
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
// Phrase vars are read by `npm run tension` (one bar per line).
const phrase = (bars) => m('<' + bars.map((bar) => '[' + bar + ']').join(' ') + '>')
// @roots c c ab ab c c bb bb
const PAD_A = phrase([
  '[eb3,g3,bb3,d4] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '[eb3,g3,bb3,d4] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '[ab2,eb3,g3,c4] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '[ab2,eb3,g3,c4] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '[eb3,g3,bb3,d4] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '[eb3,g3,bb3,d4] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '[bb2,f3,ab3,eb4] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '[bb2,f3,ab3,eb4] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
])
const PAD_B = phrase([
  '[eb3,g3,bb3,d4] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '[eb3,g3,bb3,d4] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '[ab2,eb3,g3,c4] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '[ab2,eb3,g3,c4] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '[eb3,g3,bb3,d4] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '[eb3,g3,bb3,d4] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '[bb2,f3,ab3,eb4] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '[bb2,f3,ab3,eb4] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
])
const BASS_A = phrase([
  'c2 ~ ~ ~ ~ ~ c2 ~ ~ ~ g1 ~ ~ ~ bb1 ~',
  'c2 ~ ~ ~ c2 ~ ~ ~ ~ ~ eb2 ~ ~ ~ bb1 ~',
  'ab1 ~ ~ ~ ~ ~ ab1 ~ ~ ~ eb2 ~ ~ ~ c2 ~',
  'ab1 ~ ~ ~ c2 ~ ~ ~ ~ ~ eb2 ~ ~ ~ g1 ~',
  'c2 ~ ~ ~ ~ ~ c2 ~ ~ ~ g1 ~ ~ ~ bb1 ~',
  'c2 ~ ~ ~ ~ ~ c2 ~ ~ ~ g1 ~ ~ ~ bb1 ~',
  'bb1 ~ ~ ~ ~ ~ bb1 ~ ~ ~ f2 ~ ~ ~ c2 ~',
  'bb1 ~ ~ ~ c2 ~ ~ ~ ~ ~ f2 ~ ~ ~ eb2 ~',
])
const ACID_A = phrase([
  'c3 ~ ~ ~ ~ ~ eb3 ~ ~ ~ g3 ~ ~ ~ bb2 ~',
  'c3 ~ ~ ~ ~ ~ eb3 ~ ~ ~ g3 ~ ~ ~ f3 ~',
  'c4 ~ ~ ~ ~ ~ eb4 ~ ~ ~ g4 ~ ~ ~ c4 ~',
  'c4 ~ ~ ~ ~ ~ eb4 ~ ~ ~ g4 ~ ~ ~ eb4 ~',
  'c3 ~ ~ ~ ~ ~ eb3 ~ ~ ~ g3 ~ ~ ~ bb2 ~',
  'c3 ~ ~ ~ ~ ~ g3 ~ ~ ~ bb3 ~ ~ ~ g3 ~',
  'bb2 ~ ~ ~ ~ ~ f3 ~ ~ ~ ab3 ~ ~ ~ c3 ~',
  'bb2 ~ ~ ~ ~ ~ f3 ~ ~ ~ ab3 ~ ~ ~ eb3 ~',
])
const MEL_A = phrase([
  '~ ~ ~ ~ ~ ~ bb3 ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ ~ ~ ~ ~ c4 ~ ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ eb4 ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ g4 ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ bb3 ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ ~ ~ ~ ~ c4 ~ ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ f4 ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ ~ ~ ~ ~ c4 ~ ~ ~ ~ ~',
])
const STAB_A = phrase([
  '~ ~ ~ ~ ~ ~ [c4,f4,bb4] ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ [g3,c4,f4] ~ ~ ~',
  '~ ~ ~ ~ ~ ~ [c4,eb4,bb4] ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ [c4,f4,ab4] ~ ~ ~',
  '~ ~ ~ ~ ~ ~ [c4,f4,bb4] ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ [d4,g4,c5] ~ ~ ~',
  '~ ~ ~ ~ ~ ~ [bb3,f4,ab4] ~ ~ ~ ~ ~ ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ [f4,bb4,c5] ~ ~ ~',
])
const solos = (bars) => note(m('<' + bars.map((bar) => '[' + bar + ']').join(' ') + '>'))
const SOLO_A = solos([
  'g3 ~ bb3 c4 ~ eb4 ~ g4 ~ eb4 c4 ~ bb3 ~ g3 ~',
  '~ f4 ~ eb4 d4 ~ c4 ~ bb3 ~ g3 ~ eb3 ~ f3 g3',
  'c4 ~ eb4 ~ g4 ~ bb4 ~ ab4 ~ g4 ~ eb4 ~ c4 ~',
  '~ bb4 ~ ab4 g4 ~ f4 ~ eb4 ~ c4 ~ bb3 ~ ab3 ~',
  'g3 ~ c4 ~ eb4 ~ g4 ~ bb4 ~ g4 ~ eb4 ~ c4 ~',
  '~ d4 ~ f4 ~ g4 ~ bb4 ~ g4 ~ f4 ~ eb4 ~ c4',
  'f4 ~ g4 ~ bb4 ~ d5 ~ c5 ~ bb4 ~ g4 ~ f4 ~',
  '~ eb5 ~ d5 ~ c5 ~ bb4 ~ f4 ~ d4 ~ bb3 ~',
])
const SOLO_B = solos([
  'g4 bb4 c5 eb5 g5 ~ eb5 c5 bb4 g4 ~ eb5 ~ c5 bb4',
  'c5 d5 eb5 f5 g5 ~ f5 eb5 d5 c5 ~ bb4 ~ g4 eb4',
  'c5 eb5 g5 bb5 ~ ab5 g5 eb5 c5 ~ bb4 ~ g4 eb4',
  '~ c5 eb5 g5 bb5 ~ c6 ~ bb5 g5 eb5 c5 ~ bb4 ~',
  'g4 c5 eb5 g5 ~ bb5 g5 eb5 c5 ~ g4 ~ eb4 c4',
  'd5 f5 g5 bb5 ~ c6 bb5 g5 f5 ~ d5 ~ c5 bb4',
  'f4 bb4 d5 f5 ~ bb5 f5 d5 ~ c5 ~ bb4 ~ f4 ~',
  'eb5 f5 g5 bb5 ~ c6 ~ d6 ~ c6 bb5 g5 f5 eb5 d5',
])
// SOLO_C — DROP 2: the earlier continuous scale-run version.
const SOLO_C = solos([
  'c4 d4 eb4 f4 g4 ab4 bb4 c5 ~ bb4 ab4 g4 f4 eb4 d4 c4',
  'c5 d5 eb5 f5 g5 ab5 bb5 c6 ~ bb5 ab5 g5 f5 eb5 d5 c5',
  'c4 eb4 g4 ab4 c5 eb5 g5 ab5 ~ g5 eb5 c5 ab4 g4 eb4 c4',
  'c4 d4 eb4 g4 ab4 c5 d5 eb5 ~ d5 c5 ab4 g4 eb4 d4 c4',
  'c4 d4 eb4 f4 g4 ab4 bb4 c5 ~ bb4 ab4 g4 f4 eb4 d4 c4',
  'eb5 f5 g5 ab5 bb5 c6 ~ bb5 ab5 g5 f5 eb5 d5 c5 ~',
  'bb3 c4 d4 f4 g4 bb4 c5 d5 ~ c5 bb4 g4 f4 d4 c4 bb3',
  'bb4 c5 d5 f5 g5 bb5 c6 d6 ~ c6 bb5 g5 f5 d5 c5 bb4',
])

// SOLO_D — DROP 3: the moderate 3-up / 1-back line.
const SOLO_D = solos([
  'c4 d4 eb4 ~ d4 eb4 f4 ~ eb4 f4 g4 ~ f4 eb4 d4 c4',
  '~ g4 f4 eb4 ~ f4 eb4 d4 ~ eb4 d4 c4 ~ bb3 g3 ~',
  'c4 eb4 g4 ~ eb4 g4 bb4 ~ g4 bb4 c5 ~ bb4 g4 eb4 c4',
  '~ c5 bb4 ab4 ~ bb4 ab4 g4 ~ ab4 g4 eb4 ~ c4 eb4 g4 ~',
  'g4 c5 eb5 ~ c5 eb5 g5 ~ eb5 g5 bb5 ~ g5 eb5 c5 g4',
  '~ d5 f5 g5 ~ f5 g5 bb5 ~ g5 bb5 c6 ~ bb5 g5 f5 d5',
  'f5 g5 bb5 ~ g5 bb5 d6 ~ bb5 d6 f6 ~ d6 bb5 g5 f5',
  '~ eb5 d5 c5 ~ d5 c5 bb4 ~ c5 bb4 f4 ~ d4 f4 bb4 ~',
])

// SOLO_E — DROP 2A: thinned scale runs; two groups of three per half-bar
// are quarter-note triplets (3 notes across 2 beats).
const SOLO_E = solos([
  '[g4 a4 bb4] [c5 d5 eb5]',
  'c5 d5 eb5 f5 g5 ab5 bb5 c6 ~ bb5 ab5 g5 f5 eb5 d5 c5',
  '[f4 ab4 c5] [eb5 c5 ab4]',
  'c4 d4 eb4 g4 ab4 c5 d5 eb5 ~ d5 c5 ab4 g4 eb4 d4 c4',
  '[g4 c5 eb5] [g5 eb5 c5]',
  'eb5 f5 g5 ab5 bb5 c6 ~ bb5 ab5 g5 f5 eb5 d5 c5 ~',
  '[eb4 f4 g4] [bb4 c5 eb5]',
  'bb4 c5 d5 f5 g5 bb5 c6 d6 ~ c6 bb5 g5 f5 d5 c5 bb4',
])
const SUB = note(BASS_A).ctranspose(-12)
const BASS = note(BASS_A)
const STAB = note(STAB_A)
const ACID = note(ACID_A)
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
    m('x ~ .55 .55 x ~ .55 .55 x ~ .55 .55 x ~ .55 .55'),
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

// BREAK — final mix uses Apache only. The audition set (amen, think,
// movement, breaks125, eeloil, neworleans, squib) is kept in git history.
$: s('apache').loopAt(2)
  .gain(drums.break.vol.mul(tlOr('break')))
  .hpf(70).lpf(drums.break.cut.mul(autoAt('drums.break.cut')))
  .distort(drums.break.grit)
  .crush(drums.break.crush)
  .compressor('-18:8:8:.002:.08')
  .room(verb.mul(0.08)).roomsize(fx.reverb.size)
  .mask(gateOf('break'))
  .filter(audible)

// AMEN WEIGHT — a low-passed 4-bar Amen under the drop. Body, not a second hook.
$: s('amen').loopAt(4).late(1)
  .gain(drums.amen.vol.mul(tlOr('amen')))
  .hpf(40).lpf(drums.amen.cut)
  .mask(gateOf('amen'))

// CHOP — short amencutup stutters for DROP / RETURN only.
$: s('amencutup').n(m('0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15'))
  .gain(drums.chop.vol.mul(tlOr('chop')))
  .hpf(220).lpf(drums.chop.cut).clip(0.5)
  .mask(gateOf('chop'))

// 909 KICK — four on the floor in "straight", syncopated in the other modes.
// It also owns the sidechain: duckorbit(2) pumps every bass/keys lane.
$: s('bd').bank('RolandTR909').struct(mode.pick(grooves.kick))
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .velocity(m('1 ~ .5 .5 1 ~ .5 .5 1 ~ .5 .5 1 ~ .5 .5'))
  .lpf(drums.kick.cut).lpq(1)
  .shape(drums.kick.shape)
  .decay(drums.kick.decay).sustain(0).release(0.06)
  .duckorbit(2).duckdepth(0.62).duckattack(0.012)
  .mask(gateOf('kick'))

// 909 SNARE + CLAP — backbeat on 2 and 4, ghosts between.
$: stack(
  s('sd').bank('RolandTR909').struct(mode.pick(grooves.snare))
    .velocity(m('1 1 1 1 1 1 1 .5 1 1 1 1 1 1 1 .5'))
    .gain(drums.snare.vol.mul(tlOr('snare'))),
  s('cp').struct(m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'))
    .gain(drums.clap.vol.mul(tlOr('clap'))),
  )
  .hpf(180).lpf(drums.snare.cut)
  .room(verb.mul(0.18)).roomsize(fx.reverb.size)
  .mask(gateOf('snare'))

// HATS + OPEN HAT — the top layer. No worklets here (16 events a bar).
$: s('hh').bank('RolandTR909').struct(mode.pick(grooves.hat))
  .gain(drums.hat.vol.mul(tlOr('hat')).mul(m('<1 .55 .8 .65>')))
  .hpf(6500)
  .pan(rand.mul(0.3).add(0.35))
  .mask(gateOf('hat'))

$: s('oh').bank('RolandTR909').struct(m('~ ~ ~ ~ ~ ~ ~ o ~ ~ ~ ~ ~ ~ ~ o'))
  .gain(drums.oh.vol.mul(tlOr('oh')))
  .hpf(5000)
  .mask(gateOf('oh'))

// RIM — a dry accent in BREAK / RETURN.
$: s('rim').struct(m('~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x'))
  .gain(drums.rim.vol.mul(tlOr('rim')))
  .hpf(600)
  .mask(gateOf('rim'))

// PERC — shaker 16ths + cowbell accents, only in the second half of DROP 2/3.
$: stack(
  s('perc').n(m('0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1'))
    .gain(drums.perc.vol.mul(tlOr('perc')).mul(m('<1 .5 .8 .6>'))),
  s('cb').struct(m('~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x'))
    .gain(drums.perc.vol.mul(tlOr('perc')).mul(0.5)),
  )
  .hpf(2500)
  .mask(gateOf('perc'))

// SUB — sine doubling the bass roots, dry and centred.
$: SUB.s('sine')
  .gain(low.sub.vol.mul(tlOr('sub')))
  .lpf(low.sub.cut)
  .pan(0.5)
  .orbit(2)
  .mask(gateOf('sub'))

// BASS — one low-passed motif at 80 Hz. No walking, no funny intervals:
// root on 1, fifth on the "and" of 2, b7 on 4. Ducking comes from the kick.
$: BASS.s('sawtooth')
  .gain(low.bass.vol.mul(tlOr('bass')))
  .lpf(low.bass.cut.mul(autoAt('low.bass.cut'))).lpq(3)
  .distort(low.bass.grit)
  .hpf(35)
  .pan(0.5)
  .orbit(2)
  .mask(gateOf('bass'))

// Rhodes voice: sine/triangle body, octave tines, chorus + tremolo + delay.
const rhodes = (pat, g, cut, att, dec, hold) => stack(
  pat.s(WAVE).gain(g).attack(att).decay(dec).sustain(0.18).release(1.0),
  pat.ctranspose(12).s('sine').gain(g.mul(0.12)).attack(0.001).decay(0.16).sustain(0).release(0.08),
  pat.ctranspose(24).s('sine').gain(g.mul(0.04)).attack(0.001).decay(0.1).sustain(0).release(0.06),
  )
  .clip(hold)
  .lpf(cut).lpq(1)
  .chorus(0.4)
  .tremolo(4.5).tremolodepth(0.28)
  .delay(0.22).delaytime(0.375).delayfeedback(0.34)

// RHODES LEAD — four notes a bar, long decay, wet.
$: rhodes(ACID.ctranspose(OCT), keys.acid.vol.mul(tlOr('acid')), keys.acid.cut, keys.acid.att, keys.acid.dec, 4)
  .room(verb.mul(0.9)).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.35, 0.65))
  .orbit(2)
  .mask(gateOf('acid'))

// RHODES GHOST — one note per bar, longer tail, heavier delay/reverb.
$: rhodes(MEL.ctranspose(OCT), keys.ghost.vol.mul(tlOr('ghost')), keys.ghost.cut, keys.ghost.att, keys.ghost.dec, 8)
  .delay(0.28).delaytime(0.75).delayfeedback(0.4)
  .room(verb.mul(1.0)).roomsize(fx.reverb.size)
  .pan(sine.slow(12).range(0.3, 0.7))
  .orbit(2)
  .mask(gateOf('ghost'))

// STABS — quartal voicings, short and filtered. No block triads.
$: STAB.s('sawtooth').clip(0.4)
  .gain(keys.stab.vol.mul(tlOr('stab')))
  .lpf(keys.stab.cut.mul(autoAt('keys.stab.cut'))).lpq(3)
  .attack(0.002).decay(0.09).sustain(0.02).release(0.07)
  .room(verb.mul(0.35)).roomsize(fx.reverb.size)
  .delay(0.15).delaytime(0.375).delayfeedback(0.25)
  .orbit(2)
  .mask(gateOf('stab'))

// PAD — low sustained chord bed, only where the arrangement asks for air.
$: PAD.s('sawtooth').clip(1)
  .gain(keys.pad.vol.mul(tlOr('pad')))
  .hpf(180).lpf(keys.pad.cut.mul(autoAt('keys.pad.cut'))).lpq(1)
  .attack(keys.pad.att).decay(keys.pad.dec).sustain(0.8).release(2.4)
  .chorus(0.35)
  .room(verb.mul(1.0)).roomsize(8).roomlp(9000).roomdim(0.2)
  .pan(sine.slow(16).range(0.3, 0.7))
  .orbit(3)
  .mask(gateOf('pad'))

// JAZZ SOLO — a brighter, louder Rhodes; phrase changes by section.
const soloRhodes = (pat, g, cut, att, dec, hold) => stack(
  pat.s(WAVE).gain(g).attack(att).decay(dec).sustain(0.12).release(0.7),
  pat.ctranspose(12).s('sine').gain(g.mul(0.16)).attack(0.001).decay(0.14).sustain(0).release(0.06),
  )
  .clip(hold)
  .lpf(cut).lpq(1)
  .chorus(0.35)
  .tremolo(5.5).tremolodepth(0.22)
  .delay(0.2).delaytime(0.375).delayfeedback(0.3)

// JAZZ SOLO — phrase switches by section: normal / high+fast / scales.
$: soloRhodes(SOLO.ctranspose(OCT), keys.solo.vol.mul(tlOr('solo')), keys.solo.cut, keys.solo.att, keys.solo.dec, 1.4)
  .room(verb.mul(0.75)).roomsize(fx.reverb.size)
  .pan(sine.slow(6).range(0.4, 0.6))
  .orbit(4)
  .mask(gateOf('solo'))

// SIREN — band-passed noise with a slow envelope; the "shout" replacement.
$: s('white').slow(8).bpf(660).bpq(11).bpenv(3)
  .bpa(0.01).bpd(0.5).bps(0.3)
  .gain(atmos.siren.vol.mul(tlOr('siren')).mul(autoAt('atmos.siren.vol')))
  .mask(gateOf('siren'))

// RISER — one long noise sweep across the 8-bar BUILD.
$: s('white').slow(8)
  .gain(atmos.riser.vol.mul(tlOr('riser')).mul(saw.range(0.3, 1).slow(8)))
  .lpf(saw.range(350, 8000).slow(8)).hpf(300)
  .mask(gateOf('riser'))

// VINYL — tape/crackle bed.
$: s('crackle')
  .gain(atmos.vinyl.vol.mul(tape).mul(tlOr('vinyl')))
  .hpf(1800)
  .mask(gateOf('vinyl'))
