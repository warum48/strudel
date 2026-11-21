// MINIMAL TECHNO 01 · HOLLOW FORM · 128 BPM · 128 тактов
// Не «техно без всего», а техно на микро-сдвигах: кик, редкая перкуссия,
// саб ≤80, mid-pulse, sine-дрон (не наш обычный пэд) и металлическая
// текстура. Без мелодии и функциональных каденсов: A-модальность, A+E,
// редкий Bb. Сэмплы — uzu-drumkit и Dirt-Samples, не дефолтные банки.
// Гайд: docs/minimal-techno/README.md.
setcpm(128 / 4)

if (typeof samples === 'function') {
  samples('github:tidalcycles/uzu-drumkit')
  samples('github:tidalcycles/Dirt-Samples')
}

const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
  switches: {
    mode: ['straight', 'broken', 'shuffle', 'strip'],
  },
}

const play = slider(1, 0, 2, 1)
const mode = slider(0, 0, 3, 1)
const holdBar = slider(0, 0, 127, 1)
const verb = slider(0.22, 0, 0.5, 0.01)
const duck = slider(0.4, 0, 1, 0.01)

const instruments = {
  atmos: {
    crackle: {
      name: 'Vinyl',
      vol: slider(0.03, 0, 0.15, 0.005),
      cut: slider(3200, 300, 9000, 20),
      hpf: slider(90, 20, 600, 10),
    },
    noise: {
      name: 'Noise',
      vol: slider(0.025, 0, 0.12, 0.005),
      cut: slider(1200, 200, 6000, 20),
      hpf: slider(300, 40, 1200, 10),
    },
  },
  drums: {
    kick: {
      name: 'Kick',
      vol: slider(0.45, 0, 0.9, 0.01),
      cut: slider(160, 70, 500, 5),
      decay: slider(0.35, 0.08, 0.7, 0.01),
      shape: slider(0.12, 0, 0.5, 0.01),
    },
    hat: {
      name: 'Hats',
      vol: slider(0.17, 0, 0.4, 0.01),
      cut: slider(7600, 1200, 14000, 50),
      decay: slider(0.045, 0.01, 0.2, 0.005),
      swing: slider(0.06, 0, 0.2, 0.01),
    },
    ohat: {
      name: 'Open hat',
      vol: slider(0.09, 0, 0.3, 0.01),
      cut: slider(6400, 1000, 12000, 50),
      decay: slider(0.2, 0.03, 0.6, 0.01),
    },
    rim: {
      name: 'Rim',
      vol: slider(0.14, 0, 0.4, 0.01),
      cut: slider(4800, 800, 12000, 20),
      decay: slider(0.06, 0.02, 0.2, 0.005),
    },
    clap: {
      name: 'Clap',
      vol: slider(0.2, 0, 0.5, 0.01),
      cut: slider(4200, 800, 12000, 20),
      decay: slider(0.14, 0.03, 0.4, 0.01),
      room: slider(0.3, 0, 0.8, 0.01),
    },
    shaker: {
      name: 'Shaker',
      vol: slider(0.09, 0, 0.3, 0.01),
      cut: slider(9000, 1500, 16000, 50),
      decay: slider(0.04, 0.01, 0.15, 0.005),
    },
    click: {
      name: 'Kick click',
      vol: slider(0.045, 0, 0.2, 0.005),
      cut: slider(10000, 2000, 16000, 100),
      decay: slider(0.02, 0.008, 0.08, 0.002),
    },
    metal: {
      name: 'Metal',
      vol: slider(0.11, 0, 0.4, 0.01),
      cut: slider(900, 200, 6000, 20),
      q: slider(10, 0, 18, 0.5),
      speed: slider(0.6, 0.25, 1.5, 0.01),
    },
  },
  low: {
    sub: {
      name: 'Sub ≤80',
      vol: slider(0.3, 0, 0.8, 0.01),
      cut: slider(70, 40, 80, 1),
      decay: slider(0.45, 0.1, 1.4, 0.01),
    },
    pulse: {
      name: 'Mid pulse',
      vol: slider(0.12, 0, 0.4, 0.01),
      cut: slider(300, 80, 900, 5),
      res: slider(7, 0, 16, 0.5),
      env: slider(1.4, 0, 5, 0.1),
      decay: slider(0.12, 0.03, 0.4, 0.005),
      pw: slider(0.32, 0.1, 0.5, 0.01),
    },
  },
  keys: {
    drone: {
      name: 'Sine drone',
      vol: slider(0.08, 0, 0.3, 0.01),
      cut: slider(700, 100, 4000, 10),
      res: slider(2, 0, 12, 0.1),
      det: slider(0.03, 0, 0.2, 0.005),
      atk: slider(1.8, 0.1, 4, 0.05),
      rel: slider(3, 0.5, 6, 0.1),
    },
    bleep: {
      name: 'Bleep',
      vol: slider(0.08, 0, 0.3, 0.01),
      cut: slider(5000, 400, 12000, 20),
      decay: slider(0.18, 0.03, 0.6, 0.01),
      echo: slider(0.4, 0, 0.8, 0.01),
    },
  },
  fx: {
    delay: { time: slider(0.375, 0.125, 0.75, 0.005), feedback: slider(0.4, 0, 0.8, 0.01) },
    reverb: { size: slider(2.5, 0.5, 8, 0.1) },
  },
}
const { atmos, drums, low, keys, fx } = instruments

const TIMELINE = [
  { at: 0,   len: 8,  name: 'INTRO',  values: { kick: 0, hat: 0, ohat: 0, rim: 0, clap: 0, shaker: 0, click: 0, metal: 1, sub: 0, pulse: 0, drone: 0, bleep: 0, crackle: 1, noise: 1, mode: 3  } },
  { at: 8,   len: 8,  name: 'FLOOR',  values: { kick: 1, hat: 0, ohat: 0, rim: 0, clap: 0, shaker: 0, click: 1, metal: 1, sub: 0, pulse: 0, drone: 0, bleep: 0, crackle: 1, noise: 1, mode: 3  } },
  { at: 16,  len: 32, name: 'PULSE',  values: { kick: 1, hat: 1, ohat: 0, rim: 1, clap: 0, shaker: 0, click: 1, metal: 0, sub: 1, pulse: 1, drone: 1, bleep: 0, crackle: 1, noise: 1, mode: 0  } },
  { at: 48,  len: 8,  name: 'BREAK',  values: { kick: 0, hat: 0, ohat: 0, rim: 0, clap: 0, shaker: 0, click: 0, metal: 1, sub: 0, pulse: 0, drone: 1, bleep: 1, crackle: 1, noise: 1, mode: 3  } },
  { at: 56,  len: 32, name: 'DRIVE',  values: { kick: 1, hat: 1, ohat: 1, rim: 1, clap: 1, shaker: 1, click: 1, metal: 0, sub: 1, pulse: 1, drone: 1, bleep: 0, crackle: 1, noise: 1, mode: 1  } },
  { at: 88,  len: 16, name: 'SHIFT',  values: { kick: 1, hat: 1, ohat: 1, rim: 1, clap: 1, shaker: 1, click: 1, metal: 0, sub: 1, pulse: 1, drone: 1, bleep: 1, crackle: 1, noise: 1, mode: 2  } },
  { at: 104, len: 16, name: 'OUTRO',  values: { kick: 1, hat: 0, ohat: 0, rim: 0, clap: 0, shaker: 0, click: 1, metal: 1, sub: 1, pulse: 0, drone: 1, bleep: 0, crackle: 1, noise: 1, mode: 3  } },
  { at: 120, len: 8,  name: 'OUTRO 2',values: { kick: 0, hat: 0, ohat: 0, rim: 0, clap: 0, shaker: 0, click: 0, metal: 1, sub: 0, pulse: 0, drone: 0, bleep: 0, crackle: 1, noise: 1, mode: 3  } },
]

const AUTOMATION = [
  { path: 'keys.drone.cut', points: [[0, 0.6], [16, 0.8], [48, 1.2], [56, 0.8], [88, 1.6], [104, 1], [120, 0.6], [128, 0.2]] },
  { path: 'keys.bleep.cut', points: [[48, 0.8], [56, 1.1], [88, 1.5], [104, 1], [128, 0.2]] },
  { path: 'low.pulse.cut',  points: [[16, 0.6], [48, 1], [56, 0.8], [88, 1.4], [104, 1], [128, 0.2]] },
  { path: 'drums.metal.cut', points: [[0, 0.6], [16, 1], [48, 1.3], [56, 0.9], [104, 0.7], [128, 0.2]] },
  { path: 'low.sub.cut',    points: [[0, 1], [56, 1], [104, 1], [128, 0.5]] },
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
  autoCurve(path).mul(songGate).add(loopGate)
    .add(holdBar.fmap((b) => autoValueAt(path, b)).mul(holdGate))
const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}
const gateOf = (key) => tlOr(key).fmap((v) => v > 0.001)

// ── МАТЕРИАЛ ────────────────────────────────────────────────────
const droneNotes = note(m('<[a2,e3] [a2,e3] [a2,bb3] [a2,e3]>')).slow(2)
const bleepNotes = note(m('<a4 ~ ~ ~ e5 ~ bb5 ~>')).slow(2)
const subNotes = note(m('<a1 a1 e1 a1>'))
const pulseNotes = note(m('<a2 ~ ~ a2 ~ e2 ~ ~ bb2 ~ ~ a2 ~ e2 ~ ~>'))

// ── РИТМЫ ───────────────────────────────────────────────────────
const grooves = {
  kick: [
    m('x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~'),
    m('x ~ ~ x x ~ ~ ~ x ~ x ~ x ~ ~ x'),
    m('x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ x ~'),
    m('x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~'),
  ],
  hat: [
    m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'),
    m('x ~ ~ x ~ x ~ ~ x ~ x ~ ~ x ~ x'),
    m('~ ~ x ~ ~ x ~ ~ ~ x ~ ~ x ~ ~ x'),
    m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
  ],
  rim: [
    m('~ x ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~'),
    m('~ ~ x ~ ~ x ~ ~ ~ ~ x ~ ~ x ~ x'),
    m('~ x ~ ~ x ~ ~ x ~ x ~ ~ x ~ ~ ~'),
    m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
  ],
  clap: [
    m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
    m('~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~'),
    m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
    m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
  ],
}
const groove = (part) => modeAuto.pick(grooves[part])

// ── СЛОИ ────────────────────────────────────────────────────────
$: s('crackle')
  .gain(atmos.crackle.vol.mul(tlOr('crackle')))
  .lpf(atmos.crackle.cut.mul(autoAt('drums.metal.cut'))).hpf(atmos.crackle.hpf)
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .mask(gateOf('crackle')).filter(audible)

$: s('white').struct('x*2')
  .gain(atmos.noise.vol.mul(tlOr('noise')))
  .lpf(atmos.noise.cut.mul(autoAt('drums.metal.cut'))).hpf(atmos.noise.hpf)
  .room(verb.mul(0.2)).roomsize(fx.reverb.size)
  .mask(gateOf('noise')).filter(audible)

// Металл — новая интро-текстура, не пэд: низкий резонансный скрежет.
$: s('metal:0')
  .speed(drums.metal.speed)
  .struct('x ~ ~ ~ ~ ~ ~ ~')
  .gain(drums.metal.vol.mul(tlOr('metal')))
  .lpf(drums.metal.cut.mul(autoAt('drums.metal.cut'))).lpq(drums.metal.q)
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .pan(sine.slow(32).range(0.35, 0.65))
  .mask(gateOf('metal')).filter(audible)

$: s('bd')
  .struct(groove('kick'))
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .lpf(drums.kick.cut).lpq(1).shape(drums.kick.shape)
  .decay(drums.kick.decay).sustain(0).release(0.04)
  .duckorbit(2).duckdepth(duck).duckattack(0.02)
  .mask(gateOf('kick')).filter(audible)

// Короткий клик поверх кика — атака, не второй кик.
$: s('click:0')
  .struct(groove('kick'))
  .gain(drums.click.vol.mul(tlOr('click')))
  .hpf(2600).lpf(drums.click.cut)
  .decay(drums.click.decay).sustain(0)
  .pan(0.5)
  .mask(gateOf('click')).filter(audible)

$: s('hh').n('<0 1 2 1>')
  .struct(groove('hat'))
  .swingBy(drums.hat.swing, 8)
  .gain(drums.hat.vol.mul(tlOr('hat')).mul(m('<.9 .5 .7 .4 .8 .5 .65 .4>')))
  .lpf(drums.hat.cut).hpf(700)
  .decay(drums.hat.decay).sustain(0)
  .delay(verb.mul(0.06)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.3))
  .mask(gateOf('hat')).filter(audible)

$: s('oh').n(0)
  .struct('~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x')
  .gain(drums.ohat.vol.mul(tlOr('ohat')))
  .lpf(drums.ohat.cut).hpf(500)
  .decay(drums.ohat.decay).sustain(0)
  .room(verb.mul(0.2)).roomsize(fx.reverb.size)
  .mask(gateOf('ohat')).filter(audible)

$: s('rim').n('<0 1>')
  .struct(groove('rim'))
  .gain(drums.rim.vol.mul(tlOr('rim')))
  .lpf(drums.rim.cut).hpf(900).lpq(2)
  .decay(drums.rim.decay).sustain(0)
  .pan(rand.mul(0.8).sub(0.4))
  .delay(verb.mul(0.08)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.35))
  .mask(gateOf('rim')).filter(audible)

$: s('cp')
  .struct(groove('clap'))
  .gain(drums.clap.vol.mul(tlOr('clap')))
  .lpf(drums.clap.cut).hpf(400).lpq(1)
  .decay(drums.clap.decay).sustain(0)
  .room(verb.mul(drums.clap.room)).roomsize(fx.reverb.size)
  .mask(gateOf('clap')).filter(audible)

$: s('sh').n('<0 1 2>')
  .struct('x ~ ~ x ~ ~ x ~ x ~ ~ x ~ ~ x ~')
  .swingBy(0.08, 8)
  .gain(drums.shaker.vol.mul(tlOr('shaker')).mul(m('<.7 .35 .55 .3>')))
  .lpf(drums.shaker.cut).hpf(1400)
  .decay(drums.shaker.decay).sustain(0)
  .pan(rand.mul(0.6).sub(0.3))
  .mask(gateOf('shaker')).filter(audible)

$: subNotes.struct('x ~ ~ ~ ~ ~ ~ ~')
  .s('sine')
  .gain(low.sub.vol.mul(tlOr('sub')))
  .lpf(low.sub.cut.mul(autoAt('low.sub.cut'))).lpq(1)
  .attack(0.01).decay(low.sub.decay).sustain(0.7).release(0.2)
  .orbit(2).duckorbit(2).duckdepth(duck).duckattack(0.01)
  .mask(gateOf('sub')).filter(audible)

$: pulseNotes
  .s('pulse').pw(low.pulse.pw)
  .gain(low.pulse.vol.mul(tlOr('pulse')))
  .lpf(low.pulse.cut.mul(autoAt('low.pulse.cut'))).lpq(low.pulse.res).ftype('24db')
  .lpenv(low.pulse.env).lpa(0.004).lpd(low.pulse.decay).lpsustain(0.05)
  .decay(low.pulse.decay).sustain(0.05).release(0.04)
  .orbit(2)
  .mask(gateOf('pulse')).filter(audible)

$: droneNotes
  .s('sine').unison(2).detune(keys.drone.det)
  .gain(keys.drone.vol.mul(tlOr('drone')))
  .lpf(keys.drone.cut.mul(autoAt('keys.drone.cut'))).lpq(keys.drone.res)
  .attack(keys.drone.atk).decay(2).sustain(0.85).release(keys.drone.rel)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('drone')).filter(audible)

$: bleepNotes
  .s('sine')
  .gain(keys.bleep.vol.mul(tlOr('bleep')))
  .lpf(keys.bleep.cut.mul(autoAt('keys.bleep.cut')))
  .attack(0.002).decay(keys.bleep.decay).sustain(0).release(0.2)
  .delay(keys.bleep.echo).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.45))
  .room(verb.mul(0.35)).roomsize(fx.reverb.size)
  .pan(sine.slow(16).range(0.35, 0.65))
  .mask(gateOf('bleep')).filter(audible)
