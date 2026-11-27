// DARK JAZZ · NIGHT CARTEL · 66 BPM · F# minor
// Slow noir jazz: brushed kit, upright bass, Rhodes bed, baritone sax,
// tape hiss and a very long room. Everything is native Strudel.

const BPM = 66
setcpm(BPM / 4) // one cycle = one 4/4 bar

if (typeof samples === 'function') {
  samples('github:tidalcycles/Dirt-Samples')
}

// ── transport ───────────────────────────────────────────────────
const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
}
const play = slider(1, 0, 2, 1) // 0 LOOP, 1 SONG, 2 HOLD
const holdBar = slider(0, 0, 63, 1)

// @switches mode=rubato,straight,double
const mode = slider(0, 0, 2, 1)

// ── global mix ──────────────────────────────────────────────────
const verb = slider(0.62, 0, 1, 0.01)
const tape = slider(0.34, 0, 1, 0.01)
const air = slider(0.4, 0, 1, 0.01)

// ── mixer / tone tree ───────────────────────────────────────────
const instruments = {
  drums: {
    name: 'Drums',
    kick: {
      name: 'Kick',
      vol: slider(0.3, 0, 1, 0.01),
      cut: slider(90, 50, 400, 5),
      decay: slider(0.26, 0.05, 0.8, 0.01),
    },
    brush: {
      name: 'Brushes',
      vol: slider(0.24, 0, 1, 0.01),
      cut: slider(4800, 400, 12000, 100),
    },
    ride: {
      name: 'Ride',
      vol: slider(0.12, 0, 0.6, 0.01),
      cut: slider(7000, 1000, 14000, 100),
    },
    rim: {
      name: 'Rim',
      vol: slider(0.16, 0, 0.8, 0.01),
    },
  },
  low: {
    name: 'Low',
    bass: {
      name: 'Upright',
      vol: slider(0.6, 0, 1.2, 0.01),
      cut: slider(300, 60, 900, 5),
      grit: slider(0.1, 0, 0.6, 0.01),
    },
    sub: {
      name: 'Sub',
      vol: slider(0.2, 0, 0.8, 0.01),
      cut: slider(60, 40, 120, 1),
    },
  },
  keys: {
    name: 'Keys',
    rhodes: {
      name: 'Rhodes',
      vol: slider(0.32, 0, 1, 0.01),
      cut: slider(1400, 200, 6000, 20),
      att: slider(0.03, 0.001, 0.5, 0.001),
      dec: slider(1.4, 0.1, 4, 0.05),
    },
    comp: {
      name: 'Comp',
      vol: slider(0.18, 0, 0.8, 0.01),
      cut: slider(1000, 200, 5000, 20),
    },
  },
  horns: {
    name: 'Horns',
    sax: {
      name: 'Baritone',
      vol: slider(0.28, 0, 1, 0.01),
      cut: slider(1200, 200, 6000, 20),
      att: slider(0.08, 0.01, 0.6, 0.01),
    },
  },
  atmos: {
    name: 'Atmos',
    vinyl: {
      name: 'Vinyl',
      vol: slider(0.14, 0, 0.6, 0.01),
    },
    drone: {
      name: 'Drone',
      vol: slider(0.1, 0, 0.6, 0.01),
      cut: slider(400, 100, 2000, 10),
    },
  },
  fx: {
    reverb: {
      name: 'Reverb',
      size: slider(7, 1, 10, 0.5),
    },
  },
}
const { drums, low, keys, horns, atmos, fx } = instruments

// ── form: 64 bars ───────────────────────────────────────────────
const TIMELINE = [
  { at: 0, len: 8, name: 'SMOKE', values: { kick: 0, brush: 0, ride: 0, rim: 0, bass: 0.35, sub: 0.3, rhodes: 0.55, comp: 0, sax: 0, vinyl: 1, drone: 0.5, phrase: 0 } },
  { at: 8, len: 8, name: 'BASS', values: { kick: 0.4, brush: 0, ride: 0, rim: 0.3, bass: 0.9, sub: 0.7, rhodes: 0.6, comp: 0.2, sax: 0, vinyl: 0.9, drone: 0.4, phrase: 0 } },
  { at: 16, len: 8, name: 'BRUSH', values: { kick: 0.8, brush: 1, ride: 0.7, rim: 0.5, bass: 1, sub: 0.8, rhodes: 0.6, comp: 0.5, sax: 0, vinyl: 0.7, drone: 0.2, phrase: 0 } },
  { at: 24, len: 8, name: 'BARITONE', values: { kick: 0.8, brush: 1, ride: 0.7, rim: 0.4, bass: 1, sub: 0.7, rhodes: 0.5, comp: 0.6, sax: 0.85, vinyl: 0.6, drone: 0.1, phrase: 0 } },
  { at: 32, len: 8, name: 'BREAK', values: { kick: 0, brush: 0.25, ride: 0.2, rim: 0, bass: 0.5, sub: 0.4, rhodes: 0.85, comp: 0.3, sax: 0.45, vinyl: 1, drone: 0.9, phrase: 1 } },
  { at: 40, len: 16, name: 'NIGHT', values: { kick: 1, brush: 1.1, ride: 0.9, rim: 0.6, bass: 1.05, sub: 0.85, rhodes: 0.7, comp: 0.7, sax: 1, vinyl: 0.5, drone: 0.3, phrase: 1 } },
  { at: 56, len: 8, name: 'LAST CALL', values: { kick: 0.3, brush: 0.4, ride: 0.3, rim: 0.2, bass: 0.6, sub: 0.4, rhodes: 0.75, comp: 0.2, sax: 0.3, vinyl: 1, drone: 0.8, phrase: 2 } },
]

const AUTOMATION = [
  { path: 'keys.rhodes.cut', points: [[0, 0.5], [8, 0.8], [16, 1], [32, 0.7], [40, 1.4], [56, 0.6], [64, 0.4]] },
  { path: 'horns.sax.cut', points: [[24, 0.6], [32, 1.1], [40, 0.9], [48, 1.6], [56, 0.5]] },
  { path: 'atmos.drone.cut', points: [[0, 0.5], [32, 1.4], [40, 0.6], [56, 1.6], [64, 1.0]] },
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

const modeIdx = mode.fmap((v) => Math.round(v))

// ── material: F# minor, 8-bar cycle ─────────────────────────────
const phrase = (bars) => m('<' + bars.map((bar) => '[' + bar + ']').join(' ') + '>')

// @roots f# f# d c# b g e c#
// Rhodes bed — F#m9, F#m(maj7), Dmaj7#11, C#7b9, Bm9, Gmaj7#11, Em9, C#7alt
const PAD_A = phrase([
  '[f#3,a3,c#4,g#4]',
  '[f#3,a3,c#4,f4]',
  '[d3,a3,c#4,g#4]',
  '[c#3,f3,g#3,b3]',
  '[b2,d3,a3,c#4]',
  '[g2,b2,d3,f#3]',
  '[e3,g3,b3,d4]',
  '[c#3,f3,b3,e4]',
])

// Comping hits — sparse, off the beat, quartal where it hurts.
const COMP_A = phrase([
  '~ ~ [f#3,a3,c#4] ~ ~ ~ ~ ~ ~ ~ [g#3,c#4,e4] ~ ~ ~ ~ ~',
  '~ ~ ~ ~ [a3,c#4,e4] ~ ~ ~ ~ ~ ~ ~ [f#3,c#4,f4] ~ ~ ~',
  '~ ~ [d3,a3,c#4] ~ ~ ~ ~ ~ ~ ~ ~ [g#3,c#4,e4] ~ ~ ~ ~',
  '~ ~ ~ [c#3,f3,g#3] ~ ~ ~ ~ ~ [b3,e4,g#4] ~ ~ ~ ~ ~ ~',
  '~ ~ [b2,d3,f#3] ~ ~ ~ ~ ~ ~ ~ [a3,c#4,e4] ~ ~ ~ ~ ~',
  '~ ~ ~ ~ [g2,b2,d3] ~ ~ ~ ~ ~ ~ [f#3,c#4,e4] ~ ~ ~ ~',
  '~ ~ [e3,g3,b3] ~ ~ ~ ~ ~ ~ ~ ~ [d4,f#4,a4] ~ ~ ~ ~',
  '~ ~ ~ [c#3,f3,b3] ~ ~ ~ ~ ~ [e4,g#4,b4] ~ ~ ~ ~ ~ ~',
])

// Upright — root on the one, a pickup late in the bar.
const BASS_A = phrase([
  'f#2 ~ ~ ~ ~ ~ ~ f#2 ~ ~ ~ a2 ~ c#3 ~ ~',
  'f#2 ~ ~ ~ ~ ~ ~ ~ a2 ~ ~ ~ f#2 ~ ~ ~',
  'd2 ~ ~ ~ ~ ~ d2 ~ ~ ~ a2 ~ ~ ~ c#3 ~',
  'c#2 ~ ~ ~ ~ ~ e2 ~ ~ ~ g#2 ~ b2 ~ ~ ~',
  'b1 ~ ~ ~ ~ ~ ~ ~ b1 ~ ~ d2 ~ f#2 ~ ~',
  'g1 ~ ~ ~ ~ ~ b1 ~ ~ ~ d2 ~ ~ f#2 ~ ~',
  'e2 ~ ~ ~ ~ ~ g2 ~ ~ ~ b2 ~ d3 ~ ~ ~',
  'c#2 ~ ~ ~ ~ ~ f2 ~ ~ g#2 ~ ~ b2 ~ e3 ~',
])

// Baritone — three heads. A: the theme, B: the variation, C: last call.
const SAX_A = phrase([
  '~@8 f#4@4 ~@4',
  'a4@6 g#4@2 f#4@8',
  'e4@4 ~@4 c#4@8',
  '~@4 f4@4 e4@4 c#4@4',
  'd4@8 ~@4 f#4@4',
  'g4@6 f#4@2 d4@8',
  'e4@4 g4@4 b4@8',
  'a4@4 g#4@4 f#4@8',
])
const SAX_B = phrase([
  'f#4@4 a4@2 c#5@2 ~@2 b4@2 a4@4',
  'g#4@4 f#4@2 e4@2 ~@8',
  'c#4@2 d4@2 e4@2 f#4@2 g#4@4 ~@4',
  'f4@4 e4@2 c#4@2 ~@8',
  'b3@4 d4@4 f#4@4 a4@4',
  'g4@4 f#4@4 d4@4 ~@4',
  'e4@2 f#4@2 g4@2 a4@2 b4@4 ~@4',
  'c#5@4 b4@4 a4@4 f#4@4',
])
const SAX_C = phrase([
  '~@12 f#4@4',
  'a4@8 ~@8',
  '~@12 c#4@4',
  '~@16',
  'd4@8 ~@8',
  '~@12 f#4@4',
  '~@16',
  '~@8 f#4@8',
])

const phraseIdx = tlCurve('phrase').mul(songGate)
  .add(pure(0).mul(loopGate))
  .add(sectionValue('phrase').mul(holdGate))
const SAX = phraseIdx.fmap((v) => Math.round(v)).pick([SAX_A, SAX_B, SAX_C])
const BASS = note(BASS_A)
const SUB = note(BASS_A).ctranspose(-12)
const PAD = note(PAD_A)
const COMP = note(COMP_A)

// ── grooves: three feels on one switch ──────────────────────────
const grooves = {
  kick: [
    m('x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~'),
    m('x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~'),
    m('x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~'),
  ],
  brush: [
    m('x ~ ~ x ~ x ~ ~ x ~ x ~ ~ x ~ x'),
    m('x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~'),
    m('x x x x x x x x x x x x x x x x'),
  ],
  ride: [
    m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'),
    m('x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~'),
    m('x x x x x x x x x x x x x x x x'),
  ],
  rim: [
    m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
    m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'),
    m('~ x ~ x ~ x ~ x ~ x ~ x ~ x ~ x'),
  ],
}

const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}

// ── lanes ───────────────────────────────────────────────────────

// KICK — a soft thump, never four on the floor in rubato.
$: s('bd').struct(modeIdx.pick(grooves.kick))
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .lpf(drums.kick.cut).lpq(1)
  .decay(drums.kick.decay).sustain(0).release(0.08)
  .room(verb.mul(0.1).mul(air)).roomsize(fx.reverb.size)
  .mask(gateOf('kick'))
  ._scope()

// BRUSHES — snare with no body: short, high, uneven.
$: s('sd').struct(modeIdx.pick(grooves.brush))
  .gain(drums.brush.vol.mul(tlOr('brush')).mul(m('<1 .72 .88 .6>')))
  .hpf(1400).lpf(drums.brush.cut)
  .clip(0.09).decay(0.09).sustain(0).release(0.05)
  .pan(rand.mul(0.25).add(0.375))
  .mask(gateOf('brush'))
  .filter(audible)

// RIDE — the tip, low in the mix, swinging on the off-beats.
$: s('hh').struct(modeIdx.pick(grooves.ride))
  .gain(drums.ride.vol.mul(tlOr('ride')))
  .hpf(6200).lpf(drums.ride.cut)
  .clip(0.22)
  .pan(rand.mul(0.18).add(0.6))
  .mask(gateOf('ride'))

// RIM — a dry wooden accent.
$: s('rim').struct(modeIdx.pick(grooves.rim))
  .gain(drums.rim.vol.mul(tlOr('rim')))
  .hpf(500)
  .room(verb.mul(0.25)).roomsize(fx.reverb.size)
  .mask(gateOf('rim'))

// UPRIGHT — low-passed saw, a little grit, no pumping.
$: BASS.s('sawtooth')
  .gain(low.bass.vol.mul(tlOr('bass')))
  .lpf(low.bass.cut).lpq(2)
  .distort(low.bass.grit)
  .attack(0.008).decay(0.35).sustain(0.55).release(0.25)
  .hpf(38)
  .pan(0.5).orbit(2)
  .mask(gateOf('bass'))
  ._pianoroll()

// SUB — sine under the bass, dry.
$: SUB.s('sine')
  .gain(low.sub.vol.mul(tlOr('sub')))
  .lpf(low.sub.cut)
  .pan(0.5).orbit(2)
  .mask(gateOf('sub'))

// Rhodes voice: triangle body, sine tines, chorus, tremolo, tape delay.
const rhodes = (pat, g, cut, att, dec, hold) => stack(
  pat.s('triangle').gain(g).attack(att).decay(dec).sustain(0.2).release(1.2),
  pat.ctranspose(12).s('sine').gain(g.mul(0.14)).attack(0.001).decay(0.18).sustain(0).release(0.09),
  pat.ctranspose(24).s('sine').gain(g.mul(0.05)).attack(0.001).decay(0.12).sustain(0).release(0.07),
  )
  .clip(hold)
  .lpf(cut).lpq(1)
  .chorus(0.4)
  .tremolo(4).tremolodepth(0.3)
  .delay(0.22).delaytime(0.42).delayfeedback(0.36)

// RHODES BED — the harmony, long and wet.
$: rhodes(PAD, keys.rhodes.vol.mul(tlOr('rhodes')), keys.rhodes.cut.mul(autoAt('keys.rhodes.cut')), keys.rhodes.att, keys.rhodes.dec, 2)
  .room(verb.mul(1.0)).roomsize(fx.reverb.size).roomlp(7000).roomdim(0.3)
  .pan(sine.slow(16).range(0.32, 0.68))
  .orbit(3)
  .mask(gateOf('rhodes'))

// COMP — short chordal jabs between the long chords.
$: COMP.s('triangle').clip(0.35)
  .gain(keys.comp.vol.mul(tlOr('comp')))
  .lpf(keys.comp.cut).lpq(2)
  .attack(0.004).decay(0.14).sustain(0.05).release(0.25)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .delay(0.2).delaytime(0.375).delayfeedback(0.28)
  .orbit(2)
  .mask(gateOf('comp'))

// BARITONE — saw + a thin square an octave up, vibrato, long room.
$: stack(
  SAX.s('sawtooth').gain(horns.sax.vol.mul(tlOr('sax'))).attack(horns.sax.att).decay(0.4).sustain(0.75).release(0.9).vib(4.2).vibmod(0.18),
  SAX.ctranspose(12).s('square').gain(horns.sax.vol.mul(tlOr('sax')).mul(0.09)).attack(horns.sax.att).decay(0.3).sustain(0.5).release(0.6),
  )
  .lpf(horns.sax.cut.mul(autoAt('horns.sax.cut'))).lpq(2.5)
  .hpf(140)
  .delay(0.18).delaytime(0.5).delayfeedback(0.3)
  .room(verb.mul(0.9)).roomsize(fx.reverb.size)
  .pan(sine.slow(10).range(0.4, 0.6))
  .orbit(4)
  .mask(gateOf('sax'))

// DRONE — one low F# under everything, filter breathing.
$: note('f#1').s('sawtooth')
  .gain(atmos.drone.vol.mul(tlOr('drone')).mul(0.5))
  .lpf(atmos.drone.cut.mul(autoAt('atmos.drone.cut'))).lpq(3)
  .attack(0.8).release(3)
  .room(verb.mul(0.8)).roomsize(fx.reverb.size)
  .orbit(4)
  .mask(gateOf('drone'))

// VINYL — hiss and crackle, the room tone.
$: s('crackle')
  .gain(atmos.vinyl.vol.mul(tape).mul(tlOr('vinyl')))
  .hpf(1200)
  .mask(gateOf('vinyl'))

// @scenes {"smoke":{"mode":0,"verb":0.62,"tape":0.4,"drums.kick.vol":0.3,"drums.brush.vol":0,"low.bass.vol":0.35,"keys.rhodes.vol":0.5,"horns.sax.vol":0,"atmos.drone.vol":0.18},"theme":{"mode":1,"verb":0.5,"tape":0.28,"drums.kick.vol":0.3,"drums.brush.vol":0.24,"low.bass.vol":0.6,"keys.rhodes.vol":0.32,"horns.sax.vol":0.3,"atmos.drone.vol":0.1},"outro":{"mode":2,"verb":0.72,"tape":0.45,"drums.kick.vol":0.12,"drums.brush.vol":0.08,"low.bass.vol":0.4,"keys.rhodes.vol":0.45,"horns.sax.vol":0.12,"atmos.drone.vol":0.28}}
