// BIG BEAT 02 · acid breaks v2 · 125 BPM · C minor
// V2 goal: punch, not comedy. No square lead, no 16-note 303 noodle.
// Harmony is a two-chord Cm9 / Abmaj9 vamp with a Bb13sus turnaround;
// stabs are quartal (no block triads); the bass is one low-passed motif at
// 80 Hz, sidechained to the kick; the "melody" is a sparse delayed ghost note.
// Break policy: switchable break; Amen weight supports the drop.
// Sources: docs/bigbeat/README.en.md, 06-practice.en.md, 07-variants.en.md.
// Mini-notation only through m(...) (docs/pitfalls.en.md, Rule #1).
const BPM = 125
setcpm(BPM / 4) // one cycle = one 4/4 bar = 1920 ms

if (typeof samples === 'function') {
  samples('github:yaxu/clean-breaks/main')
  samples('github:tidalcycles/Dirt-Samples')
}

// ── transport / switches ─────────────────────────────────────────
const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
  switches: {
    mode: ['straight', 'broken', 'roll'],
    breakSel: ['apache', 'amen', 'think', 'movement', 'b125:1', 'eeloil', 'n.orl', 'squib', 'b125:0'],
    wave: ['sine', 'tri', 'square'],
    octave: ['0', '+1', '-1', '-2'],
  },
}
const play = slider(1, 0, 2, 1)
const mode = slider(1, 0, 2, 1)
const breakSel = slider(0, 0, 8, 1)
const wave = slider(0, 0, 2, 1)
const octave = slider(0, 0, 3, 1)
const holdBar = slider(0, 0, 63, 1)
const pickBreak = (i) => breakSel.fmap((v) => (v === i ? 1 : 0))
const WAVE = wave.fmap((v) => ['sine', 'triangle', 'square'][v] || 'sine')
const OCT = octave.fmap((v) => [0, 12, -12, -24][v] ?? 0)

// ── global mix ───────────────────────────────────────────────────
const verb = slider(0.42, 0, 1, 0.01)
const tape = slider(0.3, 0, 1, 0.01)

const instruments = {
  drums: {
    name: 'Drums',
    break: {
      name: 'Break',
      vol: slider(0.1, 0, 1.2, 0.01),
      cut: slider(7000, 50, 14000, 100),
      grit: slider(0.28, 0, 0.9, 0.01),
      crush: slider(13, 8, 16, 0.5),
    },
    amen: {
      name: 'Amen weight',
      vol: slider(0.19, 0, 0.8, 0.01),
      cut: slider(600, 50, 1200, 10),
    },
    chop: {
      name: 'Chop',
      vol: slider(0.16, 0, 0.6, 0.01),
      cut: slider(6000, 50, 14000, 100),
    },
    kick: {
      name: 'Kick',
      vol: slider(0.46, 0, 1, 0.01),
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
      vol: slider(0.88, 0, 1.2, 0.01),
      cut: slider(2450, 50, 4000, 20),
      att: slider(0.001, 0.001, 0.2, 0.001),
      dec: slider(0.7, 0.05, 1.5, 0.01),
    },
    ghost: {
      name: 'Rhodes ghost',
      vol: slider(0.65, 0, 1.0, 0.01),
      cut: slider(2270, 50, 4000, 20),
      att: slider(0.005, 0.005, 0.5, 0.005),
      dec: slider(1.0, 0.1, 2.5, 0.01),
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
      att: slider(0.35, 0.01, 2, 0.01),
      dec: slider(0.4, 0.05, 3, 0.01),
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

// ── form: 64 bars ────────────────────────────────────────────────
const TIMELINE = [
  { at: 0, len: 4, name: 'INTRO', values: { break: 0.55, amen: 0, chop: 0, kick: 0, snare: 0, clap: 0, hat: 0.25, oh: 0, rim: 0, sub: 0, bass: 0, acid: 0.2, ghost: 0.5, stab: 0, pad: 0.6, siren: 0.1, riser: 0, vinyl: 1 } },
  { at: 4, len: 4, name: 'INTRO 2', values: { break: 0.8, amen: 0, chop: 0, kick: 0.5, snare: 0.3, clap: 0, hat: 0.5, oh: 0, rim: 0, sub: 0.6, bass: 0.4, acid: 0.4, ghost: 0.5, stab: 0.3, pad: 0.5, siren: 0.1, riser: 0, vinyl: 0.8 } },
  { at: 8, len: 8, name: 'GROOVE', values: { break: 1, amen: 0, chop: 0, kick: 1, snare: 1, clap: 0.7, hat: 1, oh: 0.6, rim: 0, sub: 1, bass: 1, acid: 0.9, ghost: 0.7, stab: 0.6, pad: 0.35, siren: 0, riser: 0, vinyl: 0.5 } },
  { at: 16, len: 8, name: 'BUILD', values: { break: 1, amen: 0, chop: 0.3, kick: 1, snare: 0.6, clap: 0.5, hat: 1, oh: 0.4, rim: 0, sub: 1, bass: 1, acid: 0.8, ghost: 0.5, stab: 0.4, pad: 0.5, siren: 0.5, riser: 1, vinyl: 0.4 } },
  { at: 24, len: 1, name: 'STOP', values: { break: 0, amen: 0, chop: 0, kick: 0, snare: 0, clap: 0, hat: 0, oh: 0, rim: 0, sub: 0, bass: 0, acid: 0, ghost: 0, stab: 1, pad: 0.3, siren: 0, riser: 0, vinyl: 0.2 } },
  { at: 25, len: 16, name: 'DROP', values: { break: 1, amen: 0.8, chop: 0.5, kick: 1, snare: 1, clap: 0.9, hat: 1, oh: 0.7, rim: 0.4, sub: 1, bass: 1, acid: 1, ghost: 1, stab: 1, pad: 0.4, siren: 0.6, riser: 0, vinyl: 0.3 } },
  { at: 41, len: 8, name: 'BREAK', values: { break: 0.55, amen: 0.3, chop: 0, kick: 0, snare: 0, clap: 0, hat: 0.3, oh: 0, rim: 0.7, sub: 0, bass: 0, acid: 0.45, ghost: 0.9, stab: 0.5, pad: 1.0, siren: 0.7, riser: 0, vinyl: 1 } },
  { at: 49, len: 8, name: 'RETURN', values: { break: 1, amen: 0.6, chop: 0.6, kick: 1, snare: 1, clap: 0.8, hat: 1, oh: 0.7, rim: 0.5, sub: 1, bass: 1, acid: 1, ghost: 0.8, stab: 0.8, pad: 0.4, siren: 0, riser: 0, vinyl: 0.4 } },
  { at: 57, len: 7, name: 'OUTRO', values: { break: 0.7, amen: 0, chop: 0, kick: 0, snare: 0, clap: 0, hat: 0.25, oh: 0, rim: 0, sub: 0, bass: 0, acid: 0.4, ghost: 0.5, stab: 0.4, pad: 0.8, siren: 0.2, riser: 0, vinyl: 1 } },
]

const AUTOMATION = [
  { path: 'drums.break.cut', points: [[0, 0.5], [4, 0.7], [8, 1], [16, 1], [23, 1.7], [24, 0.35], [25, 1.5], [41, 0.55], [49, 1.2], [57, 0.45]] },
  { path: 'low.bass.cut', points: [[0, 0.85], [8, 1], [23, 1], [25, 1], [41, 0.7], [49, 1], [57, 0.8]] },
  { path: 'keys.acid.cut', points: [[0, 0.6], [8, 0.9], [16, 1.1], [23, 1.8], [25, 2], [41, 0.6], [49, 1.4], [57, 0.5]] },
  { path: 'keys.ghost.cut', points: [[0, 0.7], [8, 0.9], [23, 1.3], [25, 1.5], [41, 0.7], [49, 1.3], [57, 0.6]] },
  { path: 'keys.stab.cut', points: [[0, 0.7], [8, 1], [23, 1.4], [25, 1.6], [41, 0.6], [49, 1.3], [57, 0.5]] },
  { path: 'atmos.siren.vol', points: [[0, 0.5], [8, 0], [16, 0.8], [23, 1.4], [25, 0.6], [41, 1.2], [49, 0], [57, 0]] },
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
const SUB = note(BASS_A).ctranspose(-12)
const BASS = note(BASS_A)
const STAB = note(STAB_A)
const ACID = note(ACID_A)
const MEL = note(MEL_A)
const PAD = note(PAD_A)

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

// BREAK — the hook, switchable so the alternatives can be auditioned live.
// apache / movement are instrumental; amen is the classic dry break; think is
// the vocal one. Each loop keeps its own natural length and pitch.
const breakLane = (name, bars, idx, shift = 0) => {
  const lane = shift ? s(name).loopAt(bars).late(shift) : s(name).loopAt(bars)
  return lane.gain(drums.break.vol.mul(tlOr('break')).mul(pickBreak(idx)))
}
// BREAK — the top lane; breakSel auditions the alternatives.
$: stack(
  breakLane('apache', 2, 0),
  breakLane('amen', 4, 1, 1),
  breakLane('think', 1, 2),
  breakLane('movement', 2, 3),
  breakLane('breaks125:1', 1, 4),
  breakLane('eeloil', 2, 5),
  breakLane('neworleans', 2, 6),
  breakLane('squib', 2, 7),
  breakLane('breaks125:0', 1, 8),
  )
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
  .lpf(keys.pad.cut).lpq(1)
  .attack(keys.pad.att).decay(keys.pad.dec).sustain(0.8).release(1.2)
  .room(verb.mul(1.0)).roomsize(fx.reverb.size)
  .orbit(2)
  .mask(gateOf('pad'))

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
