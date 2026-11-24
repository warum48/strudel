// BIG BEAT 01 · acid breaks · 125 BPM · C minor
// DNA: looped break as the hook + 909 backbeat + TB-303 acid + fuzz bass +
// power-chord stabs, with build / stop / drop events. Instrumental only:
// no vocals and no imitation of acoustic instruments.
// Sources: docs/bigbeat/README.en.md, 06-practice.en.md, 07-variants.en.md.
// Mini-notation only through m(...) (docs/pitfalls.en.md, Rule #1).
//
// Why the break loops instead of slicing: the Think break is 2.10 s, almost
// exactly one bar at 125 BPM, so loopAt(1) keeps the original groove and pitch.
// The old 8-slice version cut every chunk at the bar line and lost the swing.
// A low-passed Amen sits underneath as weight, not as a second hook.

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
  switches: { mode: ['straight', 'broken', 'roll'] },
}
const play = slider(1, 0, 2, 1)
const mode = slider(1, 0, 2, 1)
const holdBar = slider(0, 0, 71, 1)

// ── global mix ───────────────────────────────────────────────────
const verb = slider(0.32, 0, 1, 0.01)
const tape = slider(0.3, 0, 1, 0.01)

const instruments = {
  drums: {
    name: 'Drums',
    break: {
      name: 'Break',
      vol: slider(0.95, 0, 1.2, 0.01),
      cut: slider(7000, 800, 14000, 100),
      grit: slider(0.28, 0, 0.9, 0.01),
      crush: slider(13, 8, 16, 0.5),
    },
    amen: {
      name: 'Amen weight',
      vol: slider(0.26, 0, 0.8, 0.01),
      cut: slider(320, 80, 1200, 10),
    },
    chop: {
      name: 'Chop',
      vol: slider(0.16, 0, 0.6, 0.01),
      cut: slider(6000, 800, 14000, 100),
    },
    kick: {
      name: 'Kick',
      vol: slider(0.46, 0, 1, 0.01),
      cut: slider(160, 60, 600, 10),
      shape: slider(0.22, 0, 0.8, 0.01),
      decay: slider(0.2, 0.05, 0.6, 0.01),
    },
    snare: {
      name: 'Snare',
      vol: slider(0.34, 0, 0.9, 0.01),
      cut: slider(8000, 1000, 16000, 100),
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
      vol: slider(0.1, 0, 0.5, 0.01),
    },
  },
  low: {
    name: 'Low',
    sub: {
      name: 'Sub',
      vol: slider(0.3, 0, 0.7, 0.01),
      cut: slider(70, 40, 140, 1),
    },
    fuzz: {
      name: 'Fuzz bass',
      vol: slider(0.23, 0, 0.7, 0.01),
      cut: slider(620, 120, 2400, 20),
    },
  },
  keys: {
    name: 'Keys',
    acid: {
      name: 'Acid 303',
      vol: slider(0.22, 0, 0.6, 0.01),
      cut: slider(700, 180, 4000, 20),
    },
    hook: {
      name: 'Hook synth',
      vol: slider(0.16, 0, 0.5, 0.01),
      cut: slider(2400, 500, 9000, 50),
    },
    stab: {
      name: 'Chord stab',
      vol: slider(0.17, 0, 0.6, 0.01),
      cut: slider(3200, 600, 10000, 50),
    },
    pad: {
      name: 'Pad',
      vol: slider(0.12, 0, 0.5, 0.01),
      cut: slider(900, 200, 4000, 20),
    },
  },
  atmos: {
    name: 'Atmos',
    siren: {
      name: 'Siren',
      vol: slider(0.07, 0, 0.3, 0.01),
    },
    riser: {
      name: 'Riser',
      vol: slider(0.09, 0, 0.35, 0.01),
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

// ── form: 72 bars ────────────────────────────────────────────────
const TIMELINE = [
  { at: 0, len: 4, name: 'INTRO', values: { break: 0.55, amen: 0, chop: 0, kick: 0, snare: 0, clap: 0, hat: 0.25, oh: 0, rim: 0, sub: 0, fuzz: 0, acid: 0.3, hook: 0, stab: 0, pad: 0.4, siren: 0.1, riser: 0, vinyl: 1 } },
  { at: 4, len: 4, name: 'INTRO 2', values: { break: 0.8, amen: 0, chop: 0, kick: 0.5, snare: 0.3, clap: 0, hat: 0.5, oh: 0, rim: 0, sub: 0.6, fuzz: 0, acid: 0.5, hook: 0, stab: 0.3, pad: 0.3, siren: 0.1, riser: 0, vinyl: 0.8 } },
  { at: 8, len: 16, name: 'GROOVE', values: { break: 1, amen: 0, chop: 0, kick: 1, snare: 1, clap: 0.7, hat: 1, oh: 0.6, rim: 0, sub: 1, fuzz: 1, acid: 1, hook: 0.8, stab: 0.7, pad: 0.2, siren: 0, riser: 0, vinyl: 0.5 } },
  { at: 24, len: 8, name: 'BUILD', values: { break: 1, amen: 0, chop: 0.3, kick: 1, snare: 0.6, clap: 0.5, hat: 1, oh: 0.4, rim: 0, sub: 1, fuzz: 1, acid: 1, hook: 0.5, stab: 0.4, pad: 0.5, siren: 0.5, riser: 1, vinyl: 0.4 } },
  { at: 32, len: 1, name: 'STOP', values: { break: 0, amen: 0, chop: 0, kick: 0, snare: 0, clap: 0, hat: 0, oh: 0, rim: 0, sub: 0, fuzz: 0, acid: 0, hook: 0, stab: 1, pad: 0.2, siren: 0, riser: 0, vinyl: 0.2 } },
  { at: 33, len: 16, name: 'DROP', values: { break: 1, amen: 0.8, chop: 0.5, kick: 1, snare: 1, clap: 0.9, hat: 1, oh: 0.7, rim: 0.4, sub: 1, fuzz: 1, acid: 1, hook: 1, stab: 1, pad: 0.3, siren: 0.6, riser: 0, vinyl: 0.3 } },
  { at: 49, len: 8, name: 'BREAK', values: { break: 0.55, amen: 0.3, chop: 0, kick: 0, snare: 0, clap: 0, hat: 0.3, oh: 0, rim: 0.7, sub: 0, fuzz: 0, acid: 0.8, hook: 0.4, stab: 0.6, pad: 1, siren: 0.7, riser: 0, vinyl: 1 } },
  { at: 57, len: 8, name: 'RETURN', values: { break: 1, amen: 0.6, chop: 0.6, kick: 1, snare: 1, clap: 0.8, hat: 1, oh: 0.7, rim: 0.5, sub: 1, fuzz: 1, acid: 1, hook: 0.9, stab: 0.8, pad: 0.3, siren: 0, riser: 0, vinyl: 0.4 } },
  { at: 65, len: 7, name: 'OUTRO', values: { break: 0.7, amen: 0, chop: 0, kick: 0, snare: 0, clap: 0, hat: 0.25, oh: 0, rim: 0, sub: 0, fuzz: 0, acid: 0.5, hook: 0, stab: 0.4, pad: 0.6, siren: 0.2, riser: 0, vinyl: 1 } },
]

const AUTOMATION = [
  { path: 'drums.break.cut', points: [[0, 0.5], [4, 0.7], [8, 1], [24, 1], [31, 1.7], [32, 0.35], [33, 1.5], [49, 0.55], [57, 1.2], [65, 0.45]] },
  { path: 'keys.acid.cut', points: [[0, 0.6], [8, 1], [24, 1.2], [31, 2], [33, 2.2], [49, 0.7], [57, 1.6], [65, 0.45]] },
  { path: 'low.fuzz.cut', points: [[8, 1], [31, 1], [33, 1.7], [49, 0.35], [57, 1], [65, 0.3]] },
  { path: 'keys.hook.cut', points: [[8, 0.8], [31, 1.4], [33, 1.6], [49, 0.6], [57, 1.2], [65, 0.5]] },
  { path: 'atmos.siren.vol', points: [[0, 0.5], [8, 0], [24, 0.8], [31, 1.4], [33, 0.6], [49, 1.2], [57, 0], [65, 0]] },
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
// @roots c ab f g
const MEL_A = phrase([
  'c4 ~ c4 eb4 ~ ~ g3 ~ bb3 ~ ~ c4 ~ ~ eb4 ~',
  'c4 ~ c4 eb4 ~ ~ g3 ~ f3 ~ ~ eb4 ~ ~ c4 ~',
  'ab3 ~ ab3 c4 ~ ~ eb4 ~ c4 ~ ~ ab3 ~ ~ g3 ~',
  'g3 ~ bb3 ~ d4 ~ ~ c4 ~ bb3 ~ g3 ~ ~ ~ ~',
])
const STAB_A = phrase([
  '[c4,eb4,g4] ~ ~ ~ ~ ~ [c4,eb4,g4] ~ ~ ~ [eb4,g4,bb4] ~ ~ ~ [c4,eb4,g4] ~',
  '[ab3,c4,eb4] ~ ~ ~ ~ ~ [ab3,c4,eb4] ~ ~ ~ [c4,eb4,g4] ~ ~ ~ [ab3,c4,eb4] ~',
  '[f3,ab3,c4] ~ ~ ~ ~ ~ [f3,ab3,c4] ~ ~ ~ [ab3,c4,eb4] ~ ~ ~ [f3,ab3,c4] ~',
  '[g3,bb3,d4] ~ ~ ~ ~ ~ [g3,bb3,d4] ~ ~ ~ [bb3,d4,f4] ~ ~ ~ [g3,bb3,d4] ~',
])
const ACID_A = phrase([
  'c4 ~ c4 eb4 ~ g4 ~ bb4 ~ c4 eb4 ~ f4 ~ g4 bb3',
  'c4 ~ c4 eb4 ~ g4 ~ bb4 ~ c4 ~ eb4 ~ g4 ~ ~',
  'ab3 ~ ab3 c4 ~ eb4 ~ g4 ~ ab3 c4 ~ eb4 ~ g4 ~',
  'g3 ~ g3 bb3 ~ d4 ~ g4 ~ bb3 ~ g4 ~ d4 bb3',
])
const PAD_A = phrase([
  '[c3,eb3,g3] ~ ~ ~ [c3,eb3,g3] ~ ~ ~ [c3,eb3,g3] ~ ~ ~ [c3,eb3,g3] ~ ~ ~',
  '[ab2,c3,eb3] ~ ~ ~ [ab2,c3,eb3] ~ ~ ~ [ab2,c3,eb3] ~ ~ ~ [ab2,c3,eb3] ~ ~ ~',
  '[f2,ab2,c3] ~ ~ ~ [f2,ab2,c3] ~ ~ ~ [f2,ab2,c3] ~ ~ ~ [f2,ab2,c3] ~ ~ ~',
  '[g2,bb2,d3] ~ ~ ~ [g2,bb2,d3] ~ ~ ~ [g2,bb2,d3] ~ ~ ~ [g2,bb2,d3] ~ ~ ~',
])
const PAD_B = phrase([
  '[c3,eb3,g3] ~ ~ ~ [c3,eb3,g3] ~ ~ ~ [c3,eb3,g3] ~ ~ ~ [c3,eb3,g3] ~ ~ ~',
  '[ab2,c3,eb3] ~ ~ ~ [ab2,c3,eb3] ~ ~ ~ [ab2,c3,eb3] ~ ~ ~ [ab2,c3,eb3] ~ ~ ~',
  '[f2,ab2,c3] ~ ~ ~ [f2,ab2,c3] ~ ~ ~ [f2,ab2,c3] ~ ~ ~ [f2,ab2,c3] ~ ~ ~',
  '[g2,bb2,d3] ~ ~ ~ [g2,bb2,d3] ~ ~ ~ [g2,bb2,d3] ~ ~ ~ [g2,bb2,d3] ~ ~ ~',
])
const FUZZ = note(m('c2 ~ ~ c2 ~ c2 ~ gb2 ~ ab2 ~ ~ c2 ~ bb1 ~'))
const HOOK = note(MEL_A)
const STAB = note(STAB_A)
const ACID = note(ACID_A)
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

// BREAK — the hook. Think is 2.10 s ≈ one bar at 125, so a full loop keeps
// the drummer's feel and pitch. The vocal shout is part of the loop and is
// wanted here; it carries the track.
$: s('think').loopAt(1)
  .gain(drums.break.vol.mul(tlOr('break')))
  .hpf(70).lpf(drums.break.cut.mul(autoAt('drums.break.cut')))
  .distort(drums.break.grit)
  .crush(drums.break.crush)
  .compressor('-18:8:8:.002:.08')
  .room(verb.mul(0.08)).roomsize(fx.reverb.size)
  .mask(gateOf('break'))

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

// SUB — sine under the kick, on orbit 2 so the kick ducks it.
$: note(m('c1')).s('sine').struct(mode.pick(grooves.kick))
  .gain(low.sub.vol.mul(tlOr('sub')))
  .lpf(low.sub.cut)
  .orbit(2)
  .mask(gateOf('sub'))

// FUZZ BASS — the rock weight: root, b5 and b6. Filtered, driven, ducked.
$: FUZZ.s('sawtooth')
  .gain(low.fuzz.vol.mul(tlOr('fuzz')))
  .lpf(low.fuzz.cut.mul(autoAt('low.fuzz.cut'))).lpq(5)
  .distort(0.45)
  .hpf(45)
  .orbit(2)
  .mask(gateOf('fuzz'))

// ACID 303 — resonant saw line, high-passed so it sits above the fuzz.
$: ACID.s('sawtooth')
  .gain(keys.acid.vol.mul(tlOr('acid')))
  .lpf(keys.acid.cut.mul(autoAt('keys.acid.cut'))).lpq(13).lpenv(4)
  .fanchor(0)
  .attack(0.002).decay(0.13).sustain(0.12).release(0.04)
  .distort(0.5)
  .hpf(140)
  .orbit(2)
  .mask(gateOf('acid'))

// HOOK — a short synth riff that stands in for the missing vocal hook.
$: HOOK.s('square')
  .gain(keys.hook.vol.mul(tlOr('hook')))
  .lpf(keys.hook.cut.mul(autoAt('keys.hook.cut'))).lpq(2)
  .attack(0.01).decay(0.16).sustain(0.25).release(0.12)
  .delay(0.22).delaytime(0.36).delayfeedback(0.32)
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .orbit(2)
  .mask(gateOf('hook'))

// STABS — filtered power-chord hits on the offbeats.
$: STAB.s('sawtooth').clip(0.6)
  .gain(keys.stab.vol.mul(tlOr('stab')))
  .lpf(keys.stab.cut)
  .attack(0.002).decay(0.1).sustain(0.05).release(0.06)
  .room(verb.mul(0.45)).roomsize(fx.reverb.size)
  .delay(0.16).delaytime(0.36).delayfeedback(0.25)
  .orbit(2)
  .mask(gateOf('stab'))

// PAD — a low sustained chord bed, only where the arrangement asks for air.
$: PAD.s('sawtooth').clip(1)
  .gain(keys.pad.vol.mul(tlOr('pad')))
  .lpf(keys.pad.cut).lpq(1)
  .attack(0.35).decay(0.4).sustain(0.8).release(1.2)
  .room(verb.mul(0.8)).roomsize(fx.reverb.size)
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
