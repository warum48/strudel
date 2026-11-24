// DUB TECHNO · BODHI · 104 BPM
// @roots d d d d bb bb bb bb
setcpm(104 / 4)

if (typeof samples === 'function') {
  samples('github:tidalcycles/uzu-drumkit')
  samples('github:tidalcycles/Dirt-Samples')
}

const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
  switches: {
    mode: ['half', 'drag', 'step', 'strip'],
    harmony: ['dark', 'ghost'],
  },
}

const play = slider(1, 0, 2, 1)
const mode = slider(0, 0, 3, 1)
const harmony = slider(0, 0, 1, 1)
const holdBar = slider(0, 0, 191, 1)
const verb = slider(0.65, 0, 1, 0.01)

const instruments = {
  atmos: {
    hiss: {
      name: 'Vinyl',
      vol: slider(0.05, 0, 0.3, 0.01),
      cut: slider(3200, 200, 10000, 20),
      hpf: slider(80, 20, 600, 10),
    },
    air: {
      name: 'Air',
      vol: slider(0.03, 0, 0.3, 0.01),
      cut: slider(450, 100, 5000, 20),
      lfo: slider(0.7, 0, 6, 0.1),
    },
    field: {
      name: 'Field',
      vol: slider(0.035, 0, 0.3, 0.01),
      cut: slider(650, 100, 5000, 20),
    },
  },
  drums: {
    kick: {
      name: 'Muted kick',
      vol: slider(0.45, 0, 0.5, 0.01),
      cut: slider(240, 80, 700, 5),
      shape: slider(0.32, 0, 0.8, 0.01),
      decay: slider(0.55, 0.1, 1.6, 0.01),
    },
    snare: {
      name: 'Snare',
      vol: slider(0.3, 0, 0.5, 0.01),
      cut: slider(2800, 400, 10000, 50),
      decay: slider(0.18, 0.03, 0.8, 0.01),
      room: slider(0.4, 0, 1, 0.01),
    },
    hat: {
      name: 'Shuffled hats',
      vol: slider(0.22, 0, 0.5, 0.01),
      cut: slider(6500, 800, 14000, 50),
      swing: slider(0.12, 0, 0.3, 0.01),
      decay: slider(0.06, 0.02, 0.4, 0.01),
    },
    open: {
      name: 'Open hat',
      vol: slider(0.12, 0, 0.5, 0.01),
      cut: slider(6000, 800, 12000, 50),
      decay: slider(0.2, 0.03, 0.8, 0.01),
    },
    rim: {
      name: 'Rim',
      vol: slider(0.15, 0, 0.5, 0.01),
      cut: slider(4200, 400, 12000, 50),
      decay: slider(0.05, 0.02, 0.3, 0.01),
      echo: slider(0.25, 0, 0.8, 0.01),
    },
    shaker: {
      name: 'Shaker',
      vol: slider(0.05, 0, 0.5, 0.01),
      cut: slider(7000, 800, 14000, 100),
    },
    click: {
      name: 'Clicks',
      vol: slider(0.04, 0, 0.4, 0.01),
      cut: slider(9000, 1000, 16000, 100),
      echo: slider(0.3, 0, 0.8, 0.01),
    },
  },
  bass: {
    sub: {
      name: 'Sub ≤80',
      vol: slider(0.5, 0, 1.1, 0.01),
      cut: slider(70, 40, 80, 1),
      decay: slider(1.3, 0.2, 3, 0.01),
    },
    growl: {
      name: 'Growl (mid)',
      vol: slider(0.25, 0, 0.8, 0.01),
      cut: slider(345, 100, 1000, 5),
      q: slider(7, 0, 18, 0.5),
      lfo: slider(0.55, 0, 4, 0.05),
      sync: slider(0.5, 0.0625, 2, 0.0625),
      grit: slider(0.28, 0, 0.8, 0.01),
      decay: slider(0.9, 0.1, 2.5, 0.01),
    },
  },
  chords: {
    pad: {
      name: 'Vowel pad',
      vol: slider(0.18, 0, 0.7, 0.01),
      cut: slider(850, 80, 5000, 10),
      hpf: slider(100, 20, 600, 10),
      q: slider(2.2, 0, 20, 0.5),
      lfo: slider(0.35, 0, 6, 0.05),
      det: slider(0.09, 0, 0.4, 0.01),
      fb: slider(0.6, 0, 1, 0.01),
    },
    stab: {
      name: 'Dub stab',
      vol: slider(0.14, 0, 0.8, 0.01),
      cut: slider(950, 100, 6000, 10),
      res: slider(9.5, 0, 18, 0.5),
      decay: slider(0.71, 0.05, 1.8, 0.01),
      room: slider(0.63, 0, 1, 0.01),
    },
  },
  moog: {
    note: {
      name: 'Moog note',
      vol: slider(0.2, 0, 0.6, 0.01),
      octave: slider(2, 0, 4, 1),
      cut: slider(940, 100, 4000, 10),
      q: slider(3, 0, 18, 0.5),
      det: slider(0.08, 0, 0.3, 0.01),
      attack: slider(0.45, 0.005, 1, 0.005),
      decay: slider(2.39, 0.2, 4, 0.01),
      sustain: slider(0.49, 0, 1, 0.01),
      release: slider(2.4, 0.1, 6, 0.01),
      shape: slider(0.12, 0, 0.8, 0.01),
      lfo: slider(1.45, 0, 4, 0.05),
      sync: slider(0.4375, 0.0625, 2, 0.0625),
      echo: slider(0.5, 0, 1, 0.01),
      room: slider(0.94, 0, 1, 0.01),
      slide: slider(0.135, 0, 0.3, 0.005),
    },
    arp: {
      name: 'Moog arp',
      vol: slider(0.14, 0, 0.5, 0.01),
      cut: slider(2200, 200, 5000, 10),
      q: slider(4, 0, 18, 0.5),
      det: slider(0.04, 0, 0.3, 0.01),
      attack: slider(0.02, 0.005, 0.5, 0.005),
      decay: slider(0.32, 0.03, 1.5, 0.01),
      sustain: slider(0.15, 0, 1, 0.01),
      release: slider(1.1, 0.05, 3, 0.01),
      shape: slider(0.08, 0, 0.8, 0.01),
      lfo: slider(0.25, 0, 4, 0.05),
      sync: slider(1.3125, 0.0625, 2, 0.0625),
      echo: slider(0.76, 0, 1, 0.01),
      room: slider(0.85, 0, 1, 0.01),
      pace: slider(4, 4, 16, 1),
    },
  },
  fx: {
    dub: {
      name: 'Dub delay',
      send: slider(0.6, 0, 1, 0.01),
      time: slider(0.375, 0.0625, 0.75, 0.0625),
      feedback: slider(0.75, 0, 0.85, 0.01),
    },
    reverb: {
      name: 'Reverb',
      size: slider(10, 1, 20, 0.5),
    },
  },
}
const { atmos, drums, bass, chords, moog, fx } = instruments

const TIMELINE = [
  { at: 0,   len: 8,  name: 'INTRO',  values: { hiss: 1, air: 1, field: 1, kick: 0, snare: 0, hat: 0, open: 0, rim: 0, shaker: 0, click: 0, sub: 0, growl: 0, pad: 1, stab: 0, moogNote: 1, moogArp: 0, mode: 0, harmony: 0  } },
  { at: 8,   len: 8,  name: 'INTRO 2',values: { hiss: 1, air: 1, field: 1, kick: 0, snare: 0, hat: 0, open: 0, rim: 0, shaker: 0, click: 0, sub: 0, growl: 0, pad: 1, stab: 1, moogNote: 1, moogArp: 0, mode: 0, harmony: 0  } },
  { at: 16,  len: 16, name: 'A',      values: { hiss: 1, air: 1, field: 1, kick: 1, snare: 1, hat: 0, open: 0, rim: 1, shaker: 0, click: 0, sub: 1, growl: 0, pad: 1, stab: 1, moogNote: 1, moogArp: 0, mode: 0, harmony: 0  } },
  { at: 32,  len: 8,  name: 'BUILD',  values: { hiss: 1, air: 1, field: 1, kick: 1, snare: 1, hat: 1, open: 0, rim: 1, shaker: 0, click: 1, sub: 1, growl: 1, pad: 1, stab: 1, moogNote: 1, moogArp: 1, mode: 0, harmony: 0  } },
  { at: 40,  len: 16, name: 'MAIN 1', values: { hiss: 1, air: 1, field: 1, kick: 1, snare: 1, hat: 1, open: 1, rim: 1, shaker: 1, click: 0, sub: 1, growl: 1, pad: 1, stab: 1, moogNote: 1, moogArp: 1, mode: 0, harmony: 0  } },
  { at: 56,  len: 16, name: 'BREAK',  values: { hiss: 1, air: 1, field: 1, kick: 0, snare: 0, hat: 1, open: 1, rim: 0, shaker: 1, click: 1, sub: 1, growl: 0, pad: 1, stab: 1, moogNote: 1, moogArp: 1, mode: 3, harmony: 1  } },
  { at: 72,  len: 24, name: 'MAIN 2', values: { hiss: 1, air: 1, field: 1, kick: 1, snare: 1, hat: 1, open: 1, rim: 1, shaker: 1, click: 0, sub: 1, growl: 1, pad: 1, stab: 1, moogNote: 1, moogArp: 1, mode: 2, harmony: 0  } },
  { at: 96,  len: 16, name: 'OUTRO',  values: { hiss: 1, air: 1, field: 1, kick: 0, snare: 0, hat: 0, open: 0, rim: 0, shaker: 0, click: 0, sub: 0, growl: 1, pad: 1, stab: 1, moogNote: 1, moogArp: 1, mode: 0, harmony: 1  } },
]

const AUTOMATION = [
  { path: 'chords.pad.cut', points: [[0, 0.5], [16, 0.7], [40, 1], [56, 1.2], [72, 0.8], [96, 1.3], [112, 0.2]] },
  { path: 'chords.stab.cut', points: [[32, 0.6], [40, 1], [56, 1.2], [72, 0.7], [80, 3.7], [96, 1.2], [112, 0.2]] },
  { path: 'bass.growl.cut', points: [[32, 0.5], [40, 0.9], [56, 1.2], [72, 0.7], [96, .8], [112, 0]] },
  { path: 'moog.note.cut',  points: [[0, 0.7], [16, 1], [56, 1.3], [72, 0.8], [82, 2.8], [96, .8], [112, 0]] },
  { path: 'moog.arp.cut',   points: [[32, 0.6], [40, 1], [56, .8], [60, 1.9], [72, 0.7], [82, 1.2], [96, .2], [112, 0]] },
  { path: 'moog.arp.pace',  points: [[48, 1], [49, 4], [51, 4], [52, 1], [58, 1], [59, 4], [61, 4], [62, 1], [68, 1], [69, 4], [71, 4], [72, 1], [78, 1], [79, 4], [81, 4], [82, 1], [88, 1], [89, 4], [91, 4], [92, 1]] },
  { path: 'atmos.field.cut', points: [[0, 0.7], [40, 1], [56, 1.2], [72, 1], [96, 0.4], [112, 0.2]] },
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
const sectionValue = (key) => holdIndex.pick(TIMELINE.map((sec) => pure(sec.values[key] ?? 0)))
const tlOr = (key, loopLevel = pure(1)) => {
  const base = tlCurve(key).mul(songGate).add(loopLevel.mul(loopGate))
  return base.add(sectionValue(key).mul(holdGate))
}
const autoSwitch = (key, knob) => tlCurve(key).mul(songGate).add(knob.mul(loopGate)).add(sectionValue(key).mul(holdGate))
const modeAuto = autoSwitch('mode', mode)
const harmonyAuto = autoSwitch('harmony', harmony)
const hA = harmonyAuto.fmap((v) => (v === 0 ? 1 : 0))
const hB = harmonyAuto.fmap((v) => (v === 1 ? 1 : 0))
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
const autoAt = (path) => autoCurve(path).mul(songGate).add(loopGate).add(holdBar.fmap((b) => autoValueAt(path, b)).mul(holdGate))
const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}
const gateOf = (key) => tlOr(key).fmap((v) => v > 0.001)
const phrase = (bars) => m('<' + bars.join(' ') + '>')

const SUB = phrase([
  '[d1 ~ ~ ~ ~ ~ ~ ~ ~ ~ d1 ~ ~ ~ ~ ~]',
  '[d1 ~ ~ ~ ~ ~ ~ ~ ~ ~ d1 ~ ~ ~ ~ ~]',
  '[d1 ~ ~ ~ ~ ~ ~ ~ ~ ~ d1 ~ ~ ~ ~ ~]',
  '[d1 ~ ~ ~ ~ ~ ~ ~ ~ ~ d1 ~ ~ ~ ~ ~]',
  '[bb1 ~ ~ ~ ~ ~ ~ ~ ~ ~ bb1 ~ ~ ~ ~ ~]',
  '[bb1 ~ ~ ~ ~ ~ ~ ~ ~ ~ bb1 ~ ~ ~ ~ ~]',
  '[bb1 ~ ~ ~ ~ ~ ~ ~ ~ ~ bb1 ~ ~ ~ ~ ~]',
  '[bb1 ~ ~ ~ ~ ~ ~ ~ ~ ~ bb1 ~ ~ ~ ~ ~]',
])
const GROWL = phrase([
  '[d2 ~ ~ ~ ~ ~ a1 ~]', '[~ ~ f2 ~ ~ ~ ~ ~]', '[d2 ~ ~ ~ c2 ~ ~ ~]', '[~ ~ ~ ~ ~ g1 ~ ~]',
  '[bb1 ~ ~ ~ ~ ~ f2 ~]', '[~ ~ d2 ~ ~ ~ ~ ~]', '[bb1 ~ ~ ~ a1 ~ ~ ~]', '[~ ~ ~ ~ ~ f2 ~ ~]',
])
const PAD_A = phrase([
  '[d3,f3,a3,c4,e4]', '[d3,f3,a3,c4,e4]', '[d3,f3,a3,c4,e4]', '[d3,f3,a3,c4,e4]',
  '[bb2,d3,f3,c4,a4]', '[bb2,d3,f3,c4,a4]', '[bb2,d3,f3,c4,a4]', '[bb2,d3,f3,c4,a4]',
])
const PAD_B = phrase([
  '[d3,a3,e4]', '[d3,a3,e4]', '[d3,a3,e4]', '[d3,a3,e4]',
  '[bb3,f4,c5]', '[bb3,f4,c5]', '[bb3,f4,c5]', '[bb3,f4,c5]',
])
const STAB = phrase([
  '[[d3,f3,a3,c4] ~ ~ ~ ~ ~ ~ ~]', '[~ ~ ~ ~ ~ ~ ~ ~]', '[~ ~ [d3,f3,a3,c4] ~ ~ ~ ~ ~]', '[~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ [bb3,d4,f4,a4] ~ ~ ~]', '[~ ~ ~ ~ ~ ~ ~ ~]', '[~ ~ [bb3,d4,f4,a4] ~ ~ ~ ~ ~]', '[~ ~ ~ ~ ~ ~ ~ ~]',
])
const MOOG = phrase([
  '[~ ~ ~ ~ ~ ~ ~ d3]', '[~ ~ ~ ~ ~ ~ ~ ~]', '[~ ~ ~ ~ ~ ~ a2 ~]', '[~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ bb2]', '[~ ~ ~ ~ ~ ~ ~ ~]', '[~ ~ ~ ~ ~ ~ d3 ~]', '[~ ~ ~ ~ ~ ~ ~ ~]',
])
const MOOG_ARP_CHORDS = phrase([
  '[d5,f5,a5]', '[a5,c6,e6]', '[d5,f5,a5]', '[f5,a5,c6]',
  '[bb3,f4,d5]', '[d4,f4,a4]', '[f4,a4,c5]', '[bb3,f4,d5]',
])

const kicks = [
  m('x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x'),
  m('x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
  m('x ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~'),
  m('x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x'),
]
const snares = [
  m('~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
]
const hats = [
  m('x*16'), m('x*8'), m('x*16'), m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
]
const opens = [
  m('~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
  m('~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~'),
  m('~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~ ~'),
]
const rims = [
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~ ~'),
  m('~ ~ rim ~ ~ ~ ~ ~ ~ rim ~ ~ ~ ~ rim ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~ ~ ~'),
  m('~ ~ ~ rim ~ ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~'),
]
const kickPat = modeAuto.pick(kicks)
const snarePat = modeAuto.pick(snares)
const hatPat = modeAuto.pick(hats)
const openPat = modeAuto.pick(opens)
const rimPat = modeAuto.pick(rims)

$: s('crackle')
  .gain(atmos.hiss.vol.mul(tlOr('hiss')))
  .lpf(atmos.hiss.cut).hpf(atmos.hiss.hpf)
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .mask(gateOf('hiss')).filter(audible)

$: s('pink')
  .gain(atmos.air.vol.mul(tlOr('air')))
  .lpf(atmos.air.cut).hpf(150).lpq(0.7)
  .lpdepth(atmos.air.lfo).lpsync(0.125).lpdc(0)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('air')).filter(audible)

$: s('wind:0')
  .loopAt(8)
  .gain(atmos.field.vol.mul(tlOr('field')))
  .lpf(atmos.field.cut.mul(autoAt('atmos.field.cut'))).hpf(200)
  .room(verb.mul(0.7)).roomsize(fx.reverb.size)
  .pan(sine.slow(64).range(0.3, 0.7))
  .mask(gateOf('field')).filter(audible)

$: s('bd*16')
  .struct(kickPat)
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .lpf(drums.kick.cut).lpq(1).shape(drums.kick.shape)
  .decay(drums.kick.decay).sustain(0).release(0.12)
  .mask(gateOf('kick')).filter(audible)

$: s('sd*16')
  .struct(snarePat)
  .gain(drums.snare.vol.mul(tlOr('snare')))
  .lpf(drums.snare.cut).hpf(180).lpq(1.5)
  .decay(drums.snare.decay).sustain(0)
  .room(drums.snare.room.mul(verb)).roomsize(fx.reverb.size)
  .mask(gateOf('snare')).filter(audible)

$: s('hh*16')
  .struct(hatPat)
  .swingBy(drums.hat.swing, 8)
  .gain(drums.hat.vol.mul(tlOr('hat')).mul('<0.35 0.12 0.22 0.1 0.3 0.12 0.18 0.08 0.32 0.12 0.2 0.1 0.28 0.12 0.16 0.07>'))
  .lpf(drums.hat.cut).hpf(600).lpq(1)
  .decay(drums.hat.decay).sustain(0)
  .delay(fx.dub.send.mul(0.2)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback.mul(0.4))
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .mask(gateOf('hat')).filter(audible)

$: s('oh*16')
  .struct(openPat)
  .gain(drums.open.vol.mul(tlOr('open')))
  .lpf(drums.open.cut).hpf(500)
  .decay(drums.open.decay).sustain(0)
  .delay(fx.dub.send.mul(0.3)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback.mul(0.5))
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .mask(gateOf('open')).filter(audible)

$: s('rim*16')
  .struct(rimPat)
  .gain(drums.rim.vol.mul(tlOr('rim')))
  .lpf(drums.rim.cut).hpf(600).lpq(2)
  .decay(drums.rim.decay).sustain(0)
  .pan(rand.mul(1.2).sub(0.6))
  .delay(drums.rim.echo.mul(fx.dub.send)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback.mul(0.6))
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('rim')).filter(audible)

$: s('sh*16')
  .gain(drums.shaker.vol.mul(tlOr('shaker')).mul(0.5))
  .lpf(drums.shaker.cut).hpf(3000)
  .decay(0.03).sustain(0)
  .pan(rand.mul(0.8).add(0.1))
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .mask(gateOf('shaker')).filter(audible)

$: s('click:0')
  .struct('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~')
  .gain(drums.click.vol.mul(tlOr('click')))
  .lpf(drums.click.cut).hpf(2000)
  .decay(0.03).sustain(0)
  .pan(rand.mul(1.6).sub(0.8))
  .delay(drums.click.echo.mul(fx.dub.send)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('click')).filter(audible)

$: SUB
  .s('sine')
  .gain(bass.sub.vol.mul(tlOr('sub')))
  .lpf(bass.sub.cut).lpq(1).shape(0.1)
  .attack(0.01).decay(bass.sub.decay).sustain(0.8).release(0.5)
  .mask(gateOf('sub')).filter(audible)

$: note(GROWL)
  .s('sawtooth').unison(2).detune(0.04)
  .gain(bass.growl.vol.mul(tlOr('growl')))
  .lpf(bass.growl.cut.mul(autoAt('bass.growl.cut'))).lpq(bass.growl.q).ftype('24db')
  .lpdepth(bass.growl.lfo).lpsync(bass.growl.sync).lpdc(0)
  .shape(bass.growl.grit)
  .attack(0.02).decay(bass.growl.decay).sustain(0.6).release(0.5)
  .mask(gateOf('growl')).filter(audible)

$: note(PAD_A)
  .s('sawtooth').partials([1, 0.5])
  .unison(1).detune(chords.pad.det).vowel('<a o>')
  .gain(chords.pad.vol.mul(tlOr('pad')).mul(hA))
  .lpf(chords.pad.cut.mul(autoAt('chords.pad.cut'))).hpf(chords.pad.hpf).lpq(chords.pad.q.mul(chords.pad.fb)).ftype('24db')
  .lpdepth(chords.pad.lfo.mul(chords.pad.fb)).lpsync(0.25).lpdc(0)
  .chorus(chords.pad.fb.mul(0.5))
   .attack(3).decay(3).sustain(0.9).release(6)
  .room(verb.mul(0.9)).roomsize(fx.reverb.size)
  .mask(gateOf('pad').mul(hA).fmap((v) => v > 0.001)).filter(audible)

$: note(PAD_B)
  .s('triangle').partials([1, 0.3])
  .unison(2).detune(chords.pad.det.mul(1.5))
  .gain(chords.pad.vol.mul(tlOr('pad')).mul(hB))
  .lpf(chords.pad.cut.mul(1.3).mul(autoAt('chords.pad.cut'))).hpf(300).lpq(chords.pad.q.mul(0.7).mul(chords.pad.fb))
  .lpdepth(chords.pad.lfo.mul(chords.pad.fb)).lpsync(0.25).lpdc(0)
  .chorus(chords.pad.fb.mul(0.7))
   .attack(4).decay(4).sustain(0.9).release(8)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('pad').mul(hB).fmap((v) => v > 0.001)).filter(audible)

$: note(STAB)
  .s('sawtooth').unison(2).detune(0.05)
  .gain(chords.stab.vol.mul(tlOr('stab')))
  .lpf(chords.stab.cut.mul(autoAt('chords.stab.cut'))).hpf(180).lpq(chords.stab.res).ftype('24db')
  .attack(0.005).decay(chords.stab.decay).sustain(0).release(0.8)
  .delay(fx.dub.send).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback)
  .room(chords.stab.room.mul(verb)).roomsize(fx.reverb.size)
  .mask(gateOf('stab')).filter(audible)

$: note(MOOG)
  .withValue((v) => (o) => ({ ...v, note: midi2note(noteToMidi(v.note) + o * 12) }))
  .appLeft(moog.note.octave.sub(2))
  .s('sawtooth').unison(2).detune(moog.note.det)
  .gain(moog.note.vol.mul(tlOr('moogNote')))
  .lpf(moog.note.cut.mul(autoAt('moog.note.cut'))).hpf(180).lpq(moog.note.q).ftype('24db')
  .lpdepth(moog.note.lfo).lpsync(moog.note.sync).lpdc(0)
  .shape(moog.note.shape).slide(moog.note.slide)
  .attack(moog.note.attack).decay(moog.note.decay).sustain(moog.note.sustain).release(moog.note.release)
  .delay(fx.dub.send.mul(moog.note.echo)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback)
  .room(verb.mul(moog.note.room)).roomsize(fx.reverb.size)
  .mask(gateOf('moogNote')).filter(audible)

$: note(MOOG_ARP_CHORDS)
  .arp(run(moog.arp.pace.mul(autoAt('moog.arp.pace'))))
  .s('sawtooth').unison(2).detune(moog.arp.det)
  .gain(moog.arp.vol.mul(tlOr('moogArp')))
  .lpf(moog.arp.cut.mul(autoAt('moog.arp.cut'))).hpf(300).lpq(moog.arp.q).ftype('24db')
  .lpdepth(moog.arp.lfo).lpsync(moog.arp.sync).lpdc(0)
  .shape(moog.arp.shape)
  .attack(moog.arp.attack).decay(moog.arp.decay).sustain(moog.arp.sustain).release(moog.arp.release)
  .delay(fx.dub.send.mul(moog.arp.echo)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback.mul(0.7))
  .room(verb.mul(moog.arp.room)).roomsize(fx.reverb.size)
  .pan(sine.slow(16).range(0.35, 0.65))
  .mask(gateOf('moogArp')).filter(audible)
