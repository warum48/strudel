// PSYTRANCE 02 · ACID EUPHORIA · 140 BPM · F# minor · 160 bars
// Best practices copied from the reference files:
// - refs/strudel/github/dotcomdudee/strudel-tracks/switchangel_acid.js
//   acid sound: distort 2.2:.3 -> sawtooth -> lpf + lpenv 2.256 + lpq 12;
//   riff: repeated F# 16ths with only m2 (G) and m3 (A) accents; no jumps
// - refs/strudel/github/frixdk/strudeltechno/lausfødselsdagstechno.js
//   kick sbd + distort + duck, simple hats, dynamic cutoff on the acid
// - refs/strudel/github/honcoops/strudel_trance/examples/01_driving_bassline.js
//   EX3/EX4/EX6: saw rolling bass, lpf 700 / res 7, short release
// - refs/strudel/github/honcoops/strudel_trance/examples/02_euphoric_leads.js
//   EX7 wide arp, EX9 triangle pluck, EX12 slow saw strings
// Added on top: every synth has a slow dynamic cutoff (lpf slider x sine LFO x
// section automation), because the examples are mostly static.
const BPM = 140
setcpm(BPM / 4)

if (typeof samples === 'function') {
  samples('github:tidalcycles/uzu-drumkit')
  samples('github:tidalcycles/Dirt-Samples')
}

const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
  switches: {
    mode: ['straight', 'rolling', 'tribal'],
    arpVar: ['low', 'high'],
  },
}

// ── switches ─────────────────────────────────────────────────────
const play = slider(1, 0, 2, 1)
const mode = slider(0, 0, 2, 1)
const arpVar = slider(0, 0, 1, 1)
const holdBar = slider(0, 0, 159, 1)

const verb = slider(0.5, 0, 1, 0.01)
const duck = slider(0.8, 0, 1, 0.01)
const swing = slider(0.02, 0, 0.08, 0.005)

const instruments = {
  drums: {
    kick: {
      name: 'Kick',
      vol: slider(0.9, 0, 1.2, 0.01),
      drive: slider(2, 0, 10, 0.1),
      post: slider(0.3, 0, 1, 0.01),
    },
    hats: {
      name: 'Hats',
      vol: slider(0.2, 0, 0.5, 0.01),
      cut: slider(9000, 1000, 16000, 100),
      decay: slider(0.04, 0.01, 0.2, 0.005),
    },
    oh: {
      name: 'Open hat',
      vol: slider(0.4, 0, 0.8, 0.01),
      cut: slider(7000, 1000, 16000, 100),
      decay: slider(0.2, 0.05, 0.6, 0.01),
    },
    clap: {
      name: 'Clap',
      vol: slider(0.5, 0, 0.9, 0.01),
      cut: slider(4200, 600, 12000, 50),
      decay: slider(0.14, 0.03, 0.4, 0.01),
    },
    shaker: {
      name: 'Shaker',
      vol: slider(0.15, 0, 0.4, 0.01),
      cut: slider(9000, 1000, 16000, 100),
      decay: slider(0.05, 0.01, 0.2, 0.005),
    },
    roll: {
      name: 'Snare roll',
      vol: slider(0.18, 0, 0.5, 0.01),
      cut: slider(5000, 800, 12000, 50),
      decay: slider(0.06, 0.02, 0.2, 0.005),
    },
  },
  low: {
    sub: {
      name: 'Sub',
      vol: slider(0.20, 0, 0.8, 0.01),
      cut: slider(42, 35, 90, 1),
      decay: slider(0.08, 0.03, 0.2, 0.005),
    },
    bass: {
      name: 'Rolling bass',
      vol: slider(0.42, 0, 0.9, 0.01),
      cut: slider(700, 200, 2000, 10),
      res: slider(7, 0, 20, 0.5),
      release: slider(0.1, 0.02, 0.3, 0.005),
    },
  },
  keys: {
    acid: {
      name: 'Acid 303',
      vol: slider(0.28, 0, 0.7, 0.01),
      cut: slider(250, 100, 2000, 10),
      res: slider(12, 0, 20, 0.5),
      env: slider(2.256, 0, 8, 0.001),
    },
    arp: {
      name: 'Arp',
      vol: slider(0.35, 0, 0.7, 0.01),
      cut: slider(2500, 500, 8000, 20),
      echo: slider(0.6, 0, 0.9, 0.01),
    },
    pluck: {
      name: 'Pluck',
      vol: slider(0.45, 0, 0.8, 0.01),
      cut: slider(2500, 500, 8000, 20),
      hpf: slider(800, 200, 2500, 10),
      decay: slider(0.05, 0.02, 0.3, 0.005),
      echo: slider(0.5, 0, 0.9, 0.01),
    },
    strings: {
      name: 'Strings',
      vol: slider(0.3, 0, 0.6, 0.01),
      cut: slider(2000, 200, 6000, 20),
      atk: slider(0.3, 0.05, 2, 0.05),
      rel: slider(2, 0.2, 6, 0.1),
      depth: slider(0.6, 0, 1.5, 0.01),
      sync: slider(0.0625, 0.015625, 0.25, 0.015625),
    },
  },
  atmos: {
    riser: {
      name: 'Riser',
      vol: slider(0.06, 0, 0.3, 0.005),
      cut: slider(6000, 800, 12000, 20),
      hpf: slider(400, 100, 2000, 10),
    },
    reverse: {
      name: 'Reverse',
      vol: slider(0.16, 0, 0.5, 0.01),
      cut: slider(8000, 800, 14000, 50),
      decay: slider(0.4, 0.1, 1.2, 0.01),
    },
  },
  fx: {
    reverb: { size: slider(8, 0, 10, 0.5) },
    delay: {
      time: slider(0.375, 0.125, 0.75, 0.005),
      fb: slider(0.45, 0, 0.8, 0.01),
    },
  },
}
const { drums, low, keys, atmos, fx } = instruments

// ── TIMELINE: 160 bars, changes on 8/16-bar boundaries ──────────
const TIMELINE = [
  { at: 0,   len: 8,  name: 'INTRO',   values: { kick: 1, hats: 0, oh: 0, clap: 0, shaker: 0, roll: 0, sub: 1, bass: 1, acid: 0, arp: 0, pluck: 0, strings: 0, riser: 0, reverse: 0, mode: 0, arpVar: 0 } },
  { at: 8,   len: 8,  name: 'INTRO 2', values: { kick: 1, hats: 1, oh: 0, clap: 0, shaker: 0, roll: 0, sub: 1, bass: 1, acid: 0, arp: 0, pluck: 0, strings: 0, riser: 0, reverse: 0, mode: 0, arpVar: 0 } },
  { at: 16,  len: 16, name: 'GROOVE',  values: { kick: 1, hats: 1, oh: 1, clap: 1, shaker: 1, roll: 0, sub: 1, bass: 1, acid: 1, arp: 0, pluck: 0, strings: 0, riser: 0, reverse: 0, mode: 0, arpVar: 0 } },
  { at: 32,  len: 16, name: 'LIFT',    values: { kick: 1, hats: 1, oh: 1, clap: 1, shaker: 1, roll: 0, sub: 1, bass: 1, acid: 1, arp: 1, pluck: 1, strings: 0, riser: 0, reverse: 0, mode: 1, arpVar: 0 } },
  { at: 48,  len: 16, name: 'BREAK',   values: { kick: 0, hats: 0, oh: 0, clap: 0, shaker: 0, roll: 0, sub: 0, bass: 0, acid: 1, arp: 0, pluck: 1, strings: 1, riser: 1, reverse: 1, mode: 0, arpVar: 0 } },
  { at: 64,  len: 16, name: 'BUILD',   values: { kick: 1, hats: 1, oh: 1, clap: 1, shaker: 1, roll: 1, sub: 1, bass: 1, acid: 1, arp: 0, pluck: 0, strings: 0, riser: 1, reverse: 1, mode: 2, arpVar: 0 } },
  { at: 80,  len: 16, name: 'DROP',    values: { kick: 1, hats: 1, oh: 1, clap: 1, shaker: 1, roll: 0, sub: 1, bass: 1, acid: 1, arp: 1, pluck: 1, strings: 1, riser: 0, reverse: 0, mode: 0, arpVar: 0 } },
  { at: 96,  len: 16, name: 'GROOVE 2',values: { kick: 1, hats: 1, oh: 1, clap: 0, shaker: 1, roll: 0, sub: 1, bass: 1, acid: 1, arp: 0, pluck: 0, strings: 0, riser: 0, reverse: 0, mode: 1, arpVar: 0 } },
  { at: 112, len: 16, name: 'PEAK',    values: { kick: 1, hats: 1, oh: 1, clap: 1, shaker: 1, roll: 0, sub: 1, bass: 1, acid: 1, arp: 1, pluck: 1, strings: 1, riser: 0, reverse: 0, mode: 2, arpVar: 1 } },
  { at: 128, len: 16, name: 'BREAK 2', values: { kick: 0, hats: 0, oh: 0, clap: 0, shaker: 0, roll: 0, sub: 0, bass: 0, acid: 1, arp: 0, pluck: 1, strings: 1, riser: 1, reverse: 1, mode: 0, arpVar: 0 } },
  { at: 144, len: 16, name: 'OUTRO',   values: { kick: 1, hats: 1, oh: 0, clap: 0, shaker: 1, roll: 0, sub: 1, bass: 1, acid: 0, arp: 0, pluck: 0, strings: 0, riser: 0, reverse: 0, mode: 0, arpVar: 0 } },
]

// ── AUTOMATION: section-level cutoff movement on top of the LFOs ─
const AUTOMATION = [
  { path: 'low.bass.cut',   points: [[0, 0.7], [16, 0.9], [48, 1], [64, 1.1], [80, 1], [112, 1], [128, 1], [144, 0.8], [160, 0.4]] },
  { path: 'keys.acid.cut',  points: [[16, 0.6], [32, 0.9], [48, 1.2], [64, 0.8], [80, 1.1], [112, 1.3], [128, 1.4], [144, 1], [160, 0.4]] },
  { path: 'keys.arp.cut',   points: [[32, 0.6], [48, 1.2], [56, 0.8], [72, 1.3], [96, 1], [112, 1.2], [144, 0.8], [160, 0.3]] },
  { path: 'keys.pluck.cut', points: [[32, 0.7], [48, 1.3], [64, 0.9], [80, 1.2], [112, 1.4], [144, 0.8], [160, 0.3]] },
  { path: 'keys.strings.cut', points: [[0, 0.5], [48, 1.2], [64, 0.7], [80, 1.1], [112, 1.3], [144, 0.9], [160, 0.3]] },
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
const tlOr = (key, loopLevel = pure(1)) => {
  const base = tlCurve(key).mul(songGate).add(loopLevel.mul(loopGate))
  return base.add(sectionValue(key).mul(holdGate))
}
const autoSwitch = (key, knob) =>
  tlCurve(key).mul(songGate).add(knob.mul(loopGate)).add(sectionValue(key).mul(holdGate))
const modeAuto = autoSwitch('mode', mode)
const arpAuto = autoSwitch('arpVar', arpVar)
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
const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}
const gateOf = (key, loopLevel = pure(1)) => tlOr(key, loopLevel).fmap((v) => v > 0.001)

// ── MATERIAL (F# minor, one root) ───────────────────────────────
// EX3/EX6 rolling bass: saw, lpf 700, resonance 7, short release.
const bassLine = note(m('f#2 f#2 a2 f#2 f#2 e2 f#2 a2')).fast(2)
const subLine = note(m('f#1')).struct(m('~ x x x ~ x x x ~ x x x ~ x x x'))

// switchangel_acid sound design, but a repetitive dark acid ostinato:
// F# 16ths with only two color notes — m2 (G) and m3 (A) as accents.
// No jumps, no random octaves; the moving filter makes the variation.
const acidLine = note(m('f#3 f#3 f#3 g3 f#3 f#3 f#3 f#3 f#3 f#3 f#3 a3 f#3 f#3 f#3 f#3'))

// EX7 wide arpeggio, low/high variants.
const arpPatterns = [
  note(m('f#3 a3 c#4 f#4 a4 c#5 f#5 c#5')).fast(2),
  note(m('f#4 a4 c#5 f#5 a5 c#6 f#6 c#6')).fast(2),
]
const arpLine = arpAuto.pick(arpPatterns)

// EX9 triangle pluck: short release, hpf 800, delay.
const pluckLine = note(m('f#5 ~ a5 ~ c#6 ~ a5 ~ f#5 ~ g#5 ~ a5 ~ g#5 ~'))

// EX12 strings: static F#m chord, slow attack, long release.
const stringsLine = note(m('[f#3,a3,c#4]'))

// ── groove grids (mode 0..2) ────────────────────────────────────
const grooves = {
  hats: [
    m('x*16'),
    m('x ~ x x ~ x x ~ x ~ x x ~ x x ~'),
    m('x ~ ~ x ~ x ~ ~ x ~ ~ x ~ x ~ x'),
  ],
  clap: [
    m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
    m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ x'),
    m('~ ~ x ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~'),
  ],
  shaker: [
    m('x*16'),
    m('~ x ~ x ~ x ~ x ~ x ~ x ~ x ~ x'),
    m('x ~ x x ~ x x ~ x ~ x x ~ x x ~'),
  ],
}
const groove = (part) => modeAuto.pick(grooves[part])

// ── LAYERS ─────────────────────────────────────────────────────

// Kick from switchangel/laus: sbd + distort 2:.3 + duck 2.
$: s('sbd').struct(m('x*4'))
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .distort(drums.kick.drive)
  .postgain(drums.kick.post)
  .duckorbit(2).duckattack(0.2).duckdepth(duck)
  .mask(gateOf('kick')).filter(audible)

// TR-909 closed hats, 16ths; mode changes the grid.
$: s('hh').bank('RolandTR909').struct(groove('hats'))
  .gain(drums.hats.vol.mul(tlOr('hats')).mul(m('[.7 .35 .6 .3]*4')))
  .lpf(drums.hats.cut).decay(drums.hats.decay).sustain(0)
  .swingBy(swing, 8)
  .mask(gateOf('hats')).filter(audible)

// Offbeat open hat.
$: s('oh').bank('RolandTR909').struct(m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'))
  .gain(drums.oh.vol.mul(tlOr('oh')))
  .lpf(drums.oh.cut).decay(drums.oh.decay).sustain(0)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('oh')).filter(audible)

// Clap on 2 and 4; mode 1/2 adds a syncopation.
$: s('cp').struct(groove('clap'))
  .gain(drums.clap.vol.mul(tlOr('clap')))
  .lpf(drums.clap.cut).decay(drums.clap.decay).sustain(0)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('clap')).filter(audible)

// Shaker, mode-dependent grid.
$: s('sh').struct(groove('shaker'))
  .gain(drums.shaker.vol.mul(tlOr('shaker')).mul(m('[.6 .3 .5 .25]*4')))
  .lpf(drums.shaker.cut).hpf(1200).decay(drums.shaker.decay).sustain(0)
  .mask(gateOf('shaker')).filter(audible)

// Snare roll for BUILD only.
$: s('sd').struct(m('x*16'))
  .gain(drums.roll.vol.mul(tlOr('roll', pure(0))).mul(m('[.3 .45 .6 .75]*4')))
  .lpf(drums.roll.cut).hpf(180).decay(drums.roll.decay).sustain(0)
  .room(verb.mul(0.25)).roomsize(fx.reverb.size)
  .mask(gateOf('roll', pure(0))).filter(audible)

// Sub: root F#1, KBBB shape, orbit 2.
$: subLine.s('sine')
  .gain(low.sub.vol.mul(tlOr('sub')))
  .lpf(low.sub.cut).decay(low.sub.decay).sustain(0).release(0.02)
  .orbit(2)
  .mask(gateOf('sub')).filter(audible)

// Rolling bass: EX3 pattern + dynamic lowpass (base x sine LFO x section).
$: bassLine.s('sawtooth')
  .gain(low.bass.vol.mul(tlOr('bass')))
  .lpf(low.bass.cut.mul(sine.range(0.6, 1.3).slow(16)).mul(autoAt('low.bass.cut')))
  .lpq(low.bass.res)
  .release(low.bass.release)
  .orbit(2)
  .mask(gateOf('bass')).filter(audible)

// Acid: switchangel_acid + dynamic cutoff. This is the exemplary sound.
$: acidLine
  .distort('2.2:.3')
  .s('sawtooth')
  .gain(keys.acid.vol.mul(tlOr('acid')))
  .lpf(keys.acid.cut.mul(sine.range(0.7, 1.8).slow(16)).mul(autoAt('keys.acid.cut')))
  .lpenv(keys.acid.env).lpq(keys.acid.res)
  .orbit(2)
  .mask(gateOf('acid')).filter(audible)

// Arp: EX7 wide F#m arpeggio, square, delay/reverb, dynamic cutoff.
$: arpLine.s('square')
  .gain(keys.arp.vol.mul(tlOr('arp')))
  .lpf(keys.arp.cut.mul(sine.range(0.6, 1.4).slow(16)).mul(autoAt('keys.arp.cut')))
  .attack(0.002).decay(0.12).sustain(0).release(0.12)
  .room(verb.mul(1.4)).roomsize(fx.reverb.size)
  .delay(keys.arp.echo).delaytime(fx.delay.time).delayfeedback(fx.delay.fb)
  .mask(gateOf('arp')).filter(audible)

// Pluck: EX9 triangle pluck, hpf 800, short release, dynamic cutoff.
$: pluckLine.s('triangle')
  .gain(keys.pluck.vol.mul(tlOr('pluck')))
  .hpf(keys.pluck.hpf)
  .lpf(keys.pluck.cut.mul(sine.range(0.7, 1.4).slow(8)).mul(autoAt('keys.pluck.cut')))
  .attack(0.001).release(keys.pluck.decay)
  .room(verb.mul(1.2)).roomsize(fx.reverb.size)
  .delay(keys.pluck.echo).delaytime(fx.delay.time).delayfeedback(fx.delay.fb.mul(0.8))
  .mask(gateOf('pluck')).filter(audible)

// Strings: EX12 slow saw pad on a static F#m chord; continuous filter LFO.
$: stringsLine.slow(2).s('sawtooth')
  .gain(keys.strings.vol.mul(tlOr('strings')))
  .lpf(keys.strings.cut.mul(autoAt('keys.strings.cut')))
  .lpdepth(keys.strings.depth).lpsync(keys.strings.sync).lpdc(0)
  .attack(keys.strings.atk).release(keys.strings.rel)
  .room(verb.mul(1.6)).roomsize(fx.reverb.size)
  .mask(gateOf('strings')).filter(audible)

// Riser, section-only.
$: s('white').slow(4)
  .gain(atmos.riser.vol.mul(tlOr('riser', pure(0))))
  .hpf(atmos.riser.hpf).lpf(atmos.riser.cut)
  .lpenv(2).lpa(6).lpd(2).lpsustain(0.2)
  .attack(2).decay(2).sustain(0.7).release(1.2)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('riser', pure(0))).filter(audible)

// Reverse crash, section-only.
$: s('cr').rev().slow(2)
  .gain(atmos.reverse.vol.mul(tlOr('reverse', pure(0))))
  .lpf(atmos.reverse.cut)
  .decay(atmos.reverse.decay).sustain(0)
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .mask(gateOf('reverse', pure(0))).filter(audible)

// ──────────────────────────────────────────────────────────────────
//  Dynamic cutoff = slider base x sine LFO x section automation.
//  Acid is the switchangel recipe with a moving base; arp/pluck/strings
//  are honcoops EX7/9/12 with the same slow filter movement.
//  If the mix gets muddy: lower `verb`, then `arp`, then `strings`.
