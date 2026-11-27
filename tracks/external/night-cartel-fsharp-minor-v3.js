// DARK JAZZ · NIGHT CARTEL (v3) · 66 BPM · F# minor
// Slow noir jazz: brushed kit, upright bass, Rhodes bed and lead,
// tape hiss and a very long room. Everything is native Strudel.
// v1/v2 tried to fake a baritone sax with a saw+square stack; it never
// sounded like a horn. v3 drops it: the theme moves to the Rhodes, which
// is what most nu-jazz records actually put on top of a walking bass.
// The bass is a plucked sine body with a triangle edge and a short pitch
// drop, i.e. the synth stand-in for a double bass (woody front, fast decay,
// no top), with a sine sub underneath.

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
    solo: {
      name: 'Solo (Rhodes)',
      vol: slider(0.6, 0, 1.8, 0.01),
      cut: slider(4200, 60, 8000, 20),
      res: slider(0.9, 0.3, 8, 0.05),
      att: slider(0.003, 0.001, 0.2, 0.001),
      dec: slider(0.8, 0.05, 2, 0.01),
      oct: slider(2, 0, 3, 1),
      chorus: slider(0.15, 0, 1, 0.01),
      trem: slider(5.5, 0, 12, 0.1),
      tremAmt: slider(0.1, 0, 1, 0.01),
      echo: slider(0.18, 0, 1, 0.01),
      echoTime: slider(0.375, 0.05, 1, 0.005),
      echoFb: slider(0.24, 0, 0.85, 0.01),
      space: slider(0.55, 0, 1.5, 0.01),
    },
  },
  lead: {
    name: 'Lead (off)',
    sax: {
      name: 'Rhodes lead',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(1800, 200, 6000, 20),
      att: slider(0.012, 0.003, 0.3, 0.001),
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
      size: slider(4.5, 1, 10, 0.5),
    },
  },
}
const { drums, low, keys, lead, atmos, fx } = instruments
const SOLO_OCT = keys.solo.oct.fmap((v) => [-12, 0, 12, 24][Math.max(0, Math.min(3, Math.round(v)))] ?? 0)

// ── form: 64 bars ───────────────────────────────────────────────
const TIMELINE = [
  { at: 0, len: 8, name: 'SMOKE', values: { kick: 0, brush: 0, ride: 0, rim: 0, bass: 0.35, sub: 0.3, rhodes: 0.55, comp: 0, sax: 0, vinyl: 1, drone: 0.5, phrase: 0, solo: 0.55, soloPart: 0 } },
  { at: 8, len: 8, name: 'BASS', values: { kick: 0.4, brush: 0, ride: 0, rim: 0.3, bass: 0.9, sub: 0.7, rhodes: 0.6, comp: 0.2, sax: 0, vinyl: 0.9, drone: 0.4, phrase: 0, solo: 0.6, soloPart: 0 } },
  { at: 16, len: 8, name: 'BRUSH', values: { kick: 0.8, brush: 1, ride: 0.7, rim: 0.5, bass: 1, sub: 0.8, rhodes: 0.6, comp: 0.5, sax: 0, vinyl: 0.7, drone: 0.2, phrase: 0, solo: 0.8, soloPart: 1 } },
  { at: 24, len: 8, name: 'BARITONE', values: { kick: 0.8, brush: 1, ride: 0.7, rim: 0.4, bass: 1, sub: 0.7, rhodes: 0.5, comp: 0.6, sax: 0.85, vinyl: 0.6, drone: 0.1, phrase: 0, solo: 0.9, soloPart: 1 } },
  { at: 32, len: 8, name: 'BREAK', values: { kick: 0, brush: 0.25, ride: 0.2, rim: 0, bass: 0.5, sub: 0.4, rhodes: 0.85, comp: 0.3, sax: 0.45, vinyl: 1, drone: 0.9, phrase: 1, solo: 0.6, soloPart: 0 } },
  { at: 40, len: 16, name: 'NIGHT', values: { kick: 1, brush: 1.1, ride: 0.9, rim: 0.6, bass: 1.05, sub: 0.85, rhodes: 0.7, comp: 0.7, sax: 1, vinyl: 0.5, drone: 0.3, phrase: 1, solo: 1.0, soloPart: 2 } },
  { at: 56, len: 8, name: 'LAST CALL', values: { kick: 0.3, brush: 0.4, ride: 0.3, rim: 0.2, bass: 0.6, sub: 0.4, rhodes: 0.75, comp: 0.2, sax: 0.3, vinyl: 1, drone: 0.8, phrase: 2, solo: 0.55, soloPart: 0 } },
]

const AUTOMATION = [
  { path: 'keys.rhodes.cut', points: [[0, 0.5], [8, 0.8], [16, 1], [32, 0.7], [40, 1.4], [56, 0.6], [64, 0.4]] },
  { path: 'lead.sax.cut', points: [[24, 0.6], [32, 1.1], [40, 0.9], [48, 1.6], [56, 0.5]] },
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

// Solo — same idea as the Rhodes solo in 00-jazzy-breaks: a flowing,
// stepwise line over the changes, not isolated long tones.
const solos = (bars) => note(m('<' + bars.map((bar) => '[' + bar + ']').join(' ') + '>'))
const SOLO_A = solos([
  'f#4 ~ g#4 a4 ~ c#5 b4 ~',
  'a4 ~ g#4 f4 ~ c#4 ~ ~',
  'd4 ~ f#4 a4 ~ c#5 b4 ~',
  'c#4 ~ e4 f4 ~ g#4 ~ b3',
  'b3 ~ d4 f#4 ~ a4 b4 ~',
  'g4 ~ f#4 d4 ~ b3 ~ ~',
  'e4 ~ f#4 g4 ~ b4 a4 ~',
  'g#4 ~ f4 e4 ~ c#4 b3 ~',
])
const SOLO_B = solos([
  'f#4 g#4 a4 ~ c#5 b4 a4 ~ g#4 f#4 e4 ~ c#4 ~ ~ ~',
  'a4 ~ g#4 f4 ~ e4 ~ c#4 ~ ~ a3 ~ c#4 e4 f#4 ~',
  'd4 e4 f#4 ~ a4 ~ c#5 ~ b4 a4 ~ f#4 e4 ~ d4 ~',
  'c#4 ~ e4 ~ f4 g#4 ~ b3 ~ c#4 ~ e4 f4 ~ g#4 ~',
  'b3 d4 ~ f#4 ~ a4 b4 ~ c#5 ~ b4 a4 ~ f#4 d4 ~',
  'g4 ~ f#4 ~ d4 ~ b3 ~ d4 f#4 ~ g4 ~ b3 ~ ~',
  'e4 ~ g4 ~ b4 ~ a4 g4 ~ f#4 e4 ~ d4 ~ b3 ~',
  'c#4 e4 f4 ~ g#4 ~ b3 ~ c#4 ~ e4 ~ f4 g#4 ~ ~',
])
const SOLO_C = solos([
  'f#4 g#4 a4 b4 c#5 ~ b4 a4 g#4 f#4 e4 ~ c#4 ~ ~ ~',
  'a4 g#4 f#4 e4 f4 ~ e4 c#4 ~ ~ a3 c#4 e4 f#4 ~ ~',
  'd4 e4 f#4 g#4 a4 ~ b4 a4 g#4 f#4 e4 ~ d4 ~ ~ ~',
  'c#4 ~ e4 f4 g#4 b4 ~ a4 g#4 f4 e4 ~ c#4 ~ ~ ~',
  'b3 c#4 d4 f#4 ~ a4 b4 c#5 ~ b4 a4 ~ f#4 d4 b3 ~',
  'g3 b3 d4 f#4 ~ g4 f#4 d4 ~ b3 ~ d4 ~ g4 ~ ~',
  'e4 f#4 g4 b4 ~ a4 g4 ~ e4 d4 ~ b3 ~ d4 e4 ~',
  'c#5 b4 a4 g#4 f4 e4 c#4 ~ b3 c#4 e4 ~ f4 ~ g#4 ~',
])

const phraseIdx = tlCurve('phrase').mul(songGate)
  .add(pure(0).mul(loopGate))
  .add(sectionValue('phrase').mul(holdGate))
const SAX = note(phraseIdx.fmap((v) => Math.round(v)).pick([SAX_A, SAX_B, SAX_C]))
const soloPart = tlCurve('soloPart').mul(songGate)
  .add(pure(0).mul(loopGate))
  .add(sectionValue('soloPart').mul(holdGate))
const SOLO = soloPart.fmap((v) => Math.min(2, Math.max(0, Math.round(v)))).pick([SOLO_A, SOLO_B, SOLO_C])
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

// UPRIGHT — a plucked sine body with a triangle edge and a short downward
// pitch envelope: the woody front, the fast decay and the missing top are
// what make a synth read as a double bass.
const upright = (pat, g, cut) => stack(
  pat.s('sine').gain(g).penv(0.5).pattack(0.004).pdecay(0.05)
    .attack(0.004).decay(0.50).sustain(0.45).release(0.30),
  pat.s('triangle').gain(g.mul(0.26)).penv(1.4).pattack(0.004).pdecay(0.04)
    .attack(0.003).decay(0.28).sustain(0.20).release(0.18),
  )
  .lpf(cut).lpq(3)
  .hpf(36)
$: upright(BASS, low.bass.vol.mul(tlOr('bass')), low.bass.cut)
  .distort(low.bass.grit)
  .pan(0.5).orbit(2)
  .mask(gateOf('bass'))
  ._pianoroll()

// SUB — sine under the bass, dry.
$: SUB.s('sine')
  .gain(low.sub.vol.mul(tlOr('sub')))
  .lpf(low.sub.cut)
  .pan(0.5).orbit(2)
  .mask(gateOf('sub'))

// Rhodes voice: triangle body with one sine tine; chorus, tremolo and tape
// delay on the body only, so a four-note chord costs three effect chains.
const rhodes = (pat, g, cut, att, dec, hold) => stack(
  pat.s('triangle').gain(g).attack(att).decay(dec).sustain(0.2).release(1.2)
    .chorus(0.4).tremolo(4).tremolodepth(0.3)
    .delay(0.22).delaytime(0.42).delayfeedback(0.32),
  pat.ctranspose(12).s('sine').gain(g.mul(0.16)).attack(0.001).decay(0.2).sustain(0).release(0.1),
  )
  .clip(hold)
  .lpf(cut).lpq(1)

// Solo voice: same Rhodes family, but drier and more percussive so the
// improvised line speaks on top of the pad.
// Triangle body carries harmonics, the two sine tines are the Rhodes
// "bell": a 280 ms tine an octave up and a 90 ms sparkle two octaves up.
// ctranspose() REPLACES the pitch offset (it does not add up), so every
// layer gets its own explicit oct+12 / oct+24 instead of chaining calls.
const soloRhodes = (pat, oct, g, cut, res, att, dec, hold) => stack(
  pat.s('triangle').gain(g).ctranspose(oct)
    .attack(att).decay(dec).sustain(0.10).release(0.55),
  pat.s('sine').gain(g.mul(0.30)).ctranspose(oct.add(12))
    .attack(0.001).decay(0.28).sustain(0).release(0.12),
  pat.s('sine').gain(g.mul(0.12)).ctranspose(oct.add(24))
    .attack(0.001).decay(0.09).sustain(0).release(0.05),
  )
  .clip(hold)
  .lpf(cut).lpq(res)

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

// LEAD — the old baritone theme, now on the Rhodes. A synthetic sax never
// sits right; a bright, short-decay Rhodes lead over a walking bass is the
// nu-jazz answer.
$: rhodes(SAX, lead.sax.vol.mul(tlOr('sax')).mul(1.7), lead.sax.cut.mul(autoAt('lead.sax.cut')), lead.sax.att, 0.75, 1)
  .room(verb.mul(0.6)).roomsize(fx.reverb.size).roomlp(8000)
  .pan(sine.slow(12).range(0.42, 0.58))
  .orbit(4)
  .mask(gateOf('sax'))

// SOLO — Rhodes improvisation, sparse over the head, busier from BRUSH on.
$: soloRhodes(SOLO, SOLO_OCT, keys.solo.vol.mul(tlOr('solo')), keys.solo.cut, keys.solo.res, keys.solo.att, keys.solo.dec, 1.4)
  .chorus(keys.solo.chorus)
  .tremolo(keys.solo.trem).tremolodepth(keys.solo.tremAmt)
  .delay(keys.solo.echo).delaytime(keys.solo.echoTime).delayfeedback(keys.solo.echoFb)
  .room(verb.mul(keys.solo.space)).roomsize(fx.reverb.size)
  .pan(sine.slow(6).range(0.4, 0.6))
  .orbit(5)
  .mask(gateOf('solo'))
  ._pianoroll()

// DRONE — one low F# under everything, filter breathing.
$: note('f#1').s('sawtooth')
  .gain(atmos.drone.vol.mul(tlOr('drone')).mul(0.5))
  .lpf(atmos.drone.cut.mul(autoAt('atmos.drone.cut'))).lpq(3)
  .attack(0.8).release(3)
  .room(verb.mul(0.8)).roomsize(fx.reverb.size)
  .orbit(4)
  .mask(gateOf('drone'))

// VINYL — hiss and crackle, the room tone. Clipped to one bar so a new
// instance never overlaps the previous one.
$: s('crackle')
  .gain(atmos.vinyl.vol.mul(tape).mul(tlOr('vinyl')))
  .hpf(1200)
  .clip(1)
  .mask(gateOf('vinyl'))

// @scenes {"smoke":{"mode":0,"verb":0.62,"tape":0.4,"drums.kick.vol":0.3,"drums.brush.vol":0,"low.bass.vol":0.35,"keys.rhodes.vol":0.5,"lead.sax.vol":0,"atmos.drone.vol":0.18,"keys.solo.vol":0.5},"theme":{"mode":1,"verb":0.5,"tape":0.28,"drums.kick.vol":0.3,"drums.brush.vol":0.24,"low.bass.vol":0.6,"keys.rhodes.vol":0.32,"lead.sax.vol":0.3,"atmos.drone.vol":0.1,"keys.solo.vol":0.6},"outro":{"mode":2,"verb":0.72,"tape":0.45,"drums.kick.vol":0.12,"drums.brush.vol":0.08,"low.bass.vol":0.4,"keys.rhodes.vol":0.45,"lead.sax.vol":0.12,"atmos.drone.vol":0.28,"keys.solo.vol":0.4}}
