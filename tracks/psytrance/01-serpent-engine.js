// PSYTRANCE 01 · SERPENT ENGINE · 145 BPM · F# phrygian dominant · 192 bars
// Full-on psytrance: один корень, без аккордовой прогрессии. Роллинг-бас
// 12 нот на такт (три 16-х между киками), оффбит-хэты, 303, psy lead,
// FM-сквелчи, 16 тактов кик+бас в интро, два брейка/билда, два дропа.
// Гайд: docs/psytrance/README.md. Рецепты: docs/psytrance/strudel-recipes.md.
const BPM = 145
setcpm(BPM / 4)

if (typeof samples === 'function') {
  samples('github:tidalcycles/uzu-drumkit')
  samples('github:tidalcycles/Dirt-Samples')
}

const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
  switches: {
    mode: ['straight', 'rolling', 'tribal', 'stomp'],
    bassVar: ['root', 'oct'],
    leadVar: ['serpent', 'squelch', 'hypno'],
  },
}

// ── переключатели ────────────────────────────────────────────────
const play = slider(1, 0, 2, 1)      // 0 LOOP, 1 SONG, 2 HOLD
const mode = slider(0, 0, 3, 1)      // 4 грува
const bassVar = slider(0, 0, 1, 1)   // root / oct
const leadVar = slider(0, 0, 2, 1)   // serpent / squelch / hypno
const holdBar = slider(0, 0, 191, 1)

// ── глобальные ───────────────────────────────────────────────────
const verb = slider(0.12, 0, 1, 0.01)
const duck = slider(0.45, 0, 1, 0.01)
const swing = slider(0.02, 0, 0.08, 0.005)

const instruments = {
  drums: {
    kick: {
      name: 'Kick',
      vol: slider(0.55, 0, 0.9, 0.01),
      tune: slider(1, 0.8, 1.2, 0.01),
      cut: slider(180, 60, 600, 5),
      shape: slider(0.45, 0, 0.9, 0.01),
      decay: slider(0.10, 0.05, 0.3, 0.005),
    },
    hats: {
      name: 'Closed hats',
      vol: slider(0.10, 0, 0.4, 0.01),
      cut: slider(11000, 2000, 16000, 100),
      decay: slider(0.035, 0.01, 0.15, 0.005),
      human: slider(0.15, 0, 0.6, 0.01),
    },
    oh: {
      name: 'Open hat',
      vol: slider(0.09, 0, 0.4, 0.01),
      cut: slider(8000, 1500, 14000, 100),
      decay: slider(0.16, 0.04, 0.4, 0.01),
    },
    clap: {
      name: 'Clap',
      vol: slider(0.20, 0, 0.6, 0.01),
      cut: slider(4500, 800, 12000, 20),
      decay: slider(0.12, 0.03, 0.4, 0.01),
      room: slider(0.3, 0, 0.8, 0.01),
    },
    shaker: {
      name: 'Shaker',
      vol: slider(0.08, 0, 0.3, 0.01),
      cut: slider(9000, 1500, 16000, 100),
      decay: slider(0.05, 0.01, 0.2, 0.005),
    },
    ride: {
      name: 'Ride',
      vol: slider(0.06, 0, 0.3, 0.01),
      cut: slider(9000, 1500, 16000, 50),
      decay: slider(0.12, 0.03, 0.4, 0.01),
    },
    tom: {
      name: 'Tom',
      vol: slider(0.14, 0, 0.5, 0.01),
      cut: slider(600, 100, 3000, 10),
      decay: slider(0.22, 0.05, 0.6, 0.01),
    },
    rim: {
      name: 'Rim',
      vol: slider(0.09, 0, 0.3, 0.01),
      cut: slider(5000, 800, 12000, 20),
      decay: slider(0.05, 0.01, 0.2, 0.005),
      echo: slider(0.15, 0, 0.6, 0.01),
    },
    roll: {
      name: 'Snare roll',
      vol: slider(0.16, 0, 0.5, 0.01),
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
      vol: slider(0.26, 0, 0.8, 0.01),
      // top-бас: psytrance намеренно открывает срез выше 80; sub остаётся ≤70.
      cut: slider(410, 120, 2000, 10),
      res: slider(2, 0, 20, 0.5),
      env: slider(3, 0, 8, 0.1),
      decay: slider(0.05, 0.02, 0.2, 0.005),
      drive: slider(1.2, 0, 4, 0.05),
    },
  },
  keys: {
    acid: {
      name: 'Acid 303',
      vol: slider(0.28, 0, 0.7, 0.01),
      cut: slider(120, 80, 1200, 5),
      res: slider(4, 0, 12, 0.5),
      env: slider(4.5, 0, 8, 0.1),
      decay: slider(0.055, 0.02, 0.2, 0.005),
      echo: slider(0.17, 0, 0.8, 0.01),
    },
    lead: {
      name: 'Psy lead',
      vol: slider(0.30, 0, 0.7, 0.01),
      cut: slider(1280, 200, 6000, 10),
      res: slider(2, 0, 16, 0.5),
      env: slider(2, 0, 6, 0.1),
      decay: slider(0.12, 0.03, 0.5, 0.005),
      det: slider(0.08, 0, 0.3, 0.005),
      echo: slider(0.40, 0, 0.9, 0.01),
    },
    squelch: {
      name: 'FM squelch',
      vol: slider(0.20, 0, 0.6, 0.01),
      cut: slider(1240, 300, 6000, 10),
      q: slider(3.5, 0.5, 16, 0.5),
      fm: slider(4, 0, 8, 0.1),
      ratio: slider(2.01, 1, 4, 0.01),
      decay: slider(0.06, 0.02, 0.3, 0.005),
      echo: slider(0.30, 0, 0.8, 0.01),
    },
    drone: {
      name: 'Drone',
      vol: slider(0.11, 0, 0.5, 0.01),
      cut: slider(115, 50, 1000, 5),
      det: slider(0.03, 0, 0.4, 0.01),
      atk: slider(2, 0.1, 8, 0.1),
      rel: slider(2.3, 0.2, 8, 0.1),
    },
    pad: {
      name: 'Air pad',
      vol: slider(0.10, 0, 0.4, 0.01),
      cut: slider(320, 100, 3000, 10),
      atk: slider(2, 0.1, 6, 0.1),
      rel: slider(4, 0.2, 8, 0.1),
      chorus: slider(0.5, 0, 1, 0.01),
    },
  },
  atmos: {
    air: {
      name: 'Air',
      vol: slider(0.05, 0, 0.2, 0.005),
      cut: slider(2500, 500, 12000, 50),
      lfo: slider(1, 0, 4, 0.05),
    },
    riser: {
      name: 'Riser',
      vol: slider(0.07, 0, 0.4, 0.01),
      cut: slider(6000, 800, 12000, 20),
      hpf: slider(400, 100, 2000, 10),
    },
    reverse: {
      name: 'Reverse',
      vol: slider(0.16, 0, 0.6, 0.01),
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

// ── TIMELINE: 192 такта; 0 = слой молчит в секции ────────────────
const TIMELINE = [
  { at: 0,   len: 16, name: 'INTRO',   values: { kick: 1, hats: 0, oh: 0, clap: 0, shaker: 0, ride: 0, tom: 0, rim: 0, roll: 0, sub: 1, bass: 1, acid: 0, lead: 0, squelch: 0, drone: 1, pad: 1, air: 1, riser: 0, reverse: 0, mode: 0, bassVar: 0, leadVar: 0 } },
  { at: 16,  len: 16, name: 'GROOVE',  values: { kick: 1, hats: 1, oh: 0, clap: 0, shaker: 1, ride: 0, tom: 0, rim: 0, roll: 0, sub: 1, bass: 1, acid: 1, lead: 0, squelch: 0, drone: 1, pad: 1, air: 1, riser: 0, reverse: 0, mode: 0, bassVar: 0, leadVar: 0 } },
  { at: 32,  len: 16, name: 'LIFT',    values: { kick: 1, hats: 1, oh: 1, clap: 1, shaker: 1, ride: 0, tom: 0, rim: 1, roll: 0, sub: 1, bass: 1, acid: 1, lead: 0, squelch: 0, drone: 1, pad: 1, air: 1, riser: 0, reverse: 0, mode: 1, bassVar: 0, leadVar: 0 } },
  { at: 48,  len: 16, name: 'GROOVE 2',values: { kick: 1, hats: 1, oh: 1, clap: 1, shaker: 1, ride: 1, tom: 0, rim: 1, roll: 0, sub: 1, bass: 1, acid: 1, lead: 0, squelch: 1, drone: 1, pad: 1, air: 1, riser: 0, reverse: 0, mode: 2, bassVar: 1, leadVar: 0 } },
  { at: 64,  len: 16, name: 'BREAK',   values: { kick: 0, hats: 0, oh: 0, clap: 0, shaker: 0, ride: 0, tom: 0, rim: 0, roll: 0, sub: 0, bass: 0, acid: 0, lead: 1, squelch: 1, drone: 1, pad: 1, air: 1, riser: 1, reverse: 1, mode: 0, bassVar: 0, leadVar: 2 } },
  { at: 80,  len: 16, name: 'BUILD',   values: { kick: 1, hats: 1, oh: 1, clap: 1, shaker: 1, ride: 0, tom: 1, rim: 1, roll: 1, sub: 1, bass: 1, acid: 1, lead: 1, squelch: 0, drone: 0, pad: 1, air: 1, riser: 1, reverse: 1, mode: 3, bassVar: 0, leadVar: 1 } },
  { at: 96,  len: 16, name: 'DROP',    values: { kick: 1, hats: 1, oh: 1, clap: 1, shaker: 1, ride: 1, tom: 0, rim: 1, roll: 0, sub: 1, bass: 1, acid: 1, lead: 1, squelch: 1, drone: 0, pad: 1, air: 1, riser: 0, reverse: 0, mode: 1, bassVar: 0, leadVar: 0 } },
  { at: 112, len: 16, name: 'GROOVE 3',values: { kick: 1, hats: 1, oh: 0, clap: 0, shaker: 1, ride: 1, tom: 0, rim: 0, roll: 0, sub: 1, bass: 1, acid: 1, lead: 0, squelch: 1, drone: 1, pad: 1, air: 1, riser: 0, reverse: 0, mode: 2, bassVar: 1, leadVar: 0 } },
  { at: 128, len: 16, name: 'PEAK',    values: { kick: 1, hats: 1, oh: 1, clap: 1, shaker: 1, ride: 1, tom: 1, rim: 1, roll: 0, sub: 1, bass: 1, acid: 1, lead: 1, squelch: 1, drone: 0, pad: 1, air: 1, riser: 0, reverse: 0, mode: 1, bassVar: 1, leadVar: 1 } },
  { at: 144, len: 16, name: 'PEAK 2',  values: { kick: 1, hats: 1, oh: 1, clap: 1, shaker: 1, ride: 1, tom: 1, rim: 1, roll: 0, sub: 1, bass: 1, acid: 1, lead: 1, squelch: 1, drone: 0, pad: 1, air: 1, riser: 0, reverse: 0, mode: 3, bassVar: 1, leadVar: 0 } },
  { at: 160, len: 16, name: 'BREAK 2', values: { kick: 0, hats: 0, oh: 0, clap: 0, shaker: 0, ride: 0, tom: 0, rim: 0, roll: 0, sub: 0, bass: 0, acid: 1, lead: 1, squelch: 1, drone: 1, pad: 1, air: 1, riser: 1, reverse: 1, mode: 0, bassVar: 0, leadVar: 2 } },
  { at: 176, len: 16, name: 'OUTRO',   values: { kick: 1, hats: 1, oh: 0, clap: 0, shaker: 1, ride: 0, tom: 0, rim: 0, roll: 0, sub: 1, bass: 1, acid: 0, lead: 0, squelch: 0, drone: 1, pad: 1, air: 1, riser: 0, reverse: 0, mode: 0, bassVar: 0, leadVar: 0 } },
]

// ── AUTOMATION: срезы и мастер-фильтр ────────────────────────────
const AUTOMATION = [
  { path: 'low.bass.cut',   points: [[0, 0.8], [16, 1], [64, 0.9], [80, 1.1], [96, 1], [160, 0.9], [176, 0.8], [192, 0.4]] },
  { path: 'keys.acid.cut',  points: [[16, 0.6], [32, 0.8], [64, 1.1], [80, 1.0], [96, 1.2], [128, 1.4], [160, 1.1], [176, 0.8], [192, 0.5]] },
  { path: 'keys.lead.cut',  points: [[64, 0.7], [80, 1.0], [96, 1.2], [128, 1.4], [160, 1.1], [192, 0.5]] },
  { path: 'keys.pad.cut',   points: [[0, 0.6], [64, 0.4], [80, 1], [160, 1.4], [192, 0.3]] },
  { path: 'atmos.air.cut',  points: [[0, 0.6], [64, 1.2], [80, 0.8], [160, 1.4], [192, 0.3]] },
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
const bassAuto = autoSwitch('bassVar', bassVar)
const leadAuto = autoSwitch('leadVar', leadVar)
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

// ── МАТЕРИАЛ: F# phrygian dominant, один корень ──────────────────
const ROOT = note(m('f#1'))
const bassPat = m('~ x x x ~ x x x ~ x x x ~ x x x')
const bassPitch = bassAuto.pick([
  ROOT,
  note(m('<f#1 f#1 f#1 f#2>')),
])
const acidLine = note(m('f#2 ~ f#2 ~ g2 ~ f#2 a#2 ~ f#2 ~ g2 f#2 ~ a#2 ~'))
  .sometimesBy(0.12, (x) => x.add(note(12)))
const leadLine = leadAuto.pick([
  note(m('<[f#3 ~ a#3 ~ c#4 ~ a#3 ~] [g3 ~ a#3 ~ f#3 ~ g3 ~]>')),
  note(m('<[f#3 g3 f#3 ~ a#3 ~ g3 ~] [f#3 ~ c#4 ~ a#3 g3 f#3 ~]>')),
  note(m('<[f#3 ~ ~ ~ c#4 ~ ~ ~] [a#3 ~ ~ ~ g3 ~ ~ ~]>')),
])
const squelchLine = note(m('~ ~ f#4 ~ ~ g4 ~ ~ ~ a#4 ~ ~ ~ g4 ~ ~'))

// ── РИТМЫ (grooves): mode 0..3 ──────────────────────────────────
const grooves = {
  hats: [
    m('x*16'),
    m('x ~ x x ~ x x ~ x ~ x x ~ x x ~'),
    m('x ~ ~ x ~ x ~ ~ x ~ ~ x ~ x ~ x'),
    m('x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~'),
  ],
  clap: [
    m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
    m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ x'),
    m('~ ~ x ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~'),
    m('~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~'),
  ],
  shaker: [
    m('x*16'),
    m('~ x ~ x ~ x ~ x ~ x ~ x ~ x ~ x'),
    m('x ~ x x ~ x x ~ x ~ x x ~ x x ~'),
    m('x*8'),
  ],
  ride: [
    m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
    m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ x'),
    m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'),
    m('~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~'),
  ],
  rim: [
    m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
    m('~ ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ ~'),
    m('~ ~ x ~ ~ x ~ ~ x ~ ~ x ~ x ~ x'),
    m('~ ~ ~ x ~ ~ x ~ ~ x ~ ~ x ~ ~ x'),
  ],
}
const groove = (part) => modeAuto.pick(grooves[part])

// ── СЛОИ ────────────────────────────────────────────────────────

// Kick — 4-on-floor, короткая, дакает orbit 2.
$: s('bd').struct(m('x*4'))
  .speed(drums.kick.tune)
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .shape(drums.kick.shape).lpf(drums.kick.cut).lpq(1)
  .decay(drums.kick.decay).sustain(0).release(0.01)
  .duckorbit(2).duckdepth(duck).duckattack(0.01)
  .mask(gateOf('kick')).filter(audible)

// Closed hats — 16-е, mode меняет рисунок.
$: s('hh').struct(groove('hats')).n(run(5))
  .sometimesBy(drums.hats.human, (x) => x.late(0.01))
  .gain(drums.hats.vol.mul(tlOr('hats')).mul(m('[.8 .35 .55 .3]*4')))
  .lpf(drums.hats.cut).hpf(900)
  .decay(drums.hats.decay).sustain(0)
  .swingBy(swing, 8)
  .mask(gateOf('hats')).filter(audible)

// Open hat — оффбит (третья 16-я каждой четверти).
$: s('oh').struct(m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'))
  .gain(drums.oh.vol.mul(tlOr('oh')))
  .lpf(drums.oh.cut).hpf(400)
  .decay(drums.oh.decay).sustain(0)
  .room(verb.mul(0.35)).roomsize(fx.reverb.size)
  .mask(gateOf('oh')).filter(audible)

// Clap — на 2 и 4; mode 1/2 добавляет синкопу.
$: s('cp').struct(groove('clap'))
  .sometimesBy(0.25, (x) => x.stut(2, 1/16, 0.8))
  .gain(drums.clap.vol.mul(tlOr('clap')))
  .lpf(drums.clap.cut).hpf(300).lpq(2)
  .decay(drums.clap.decay).sustain(0)
  .room(verb.mul(drums.clap.room)).roomsize(fx.reverb.size)
  .mask(gateOf('clap')).filter(audible)

// Shaker — 16-е, mode даёт оффбит/лом.
$: s('sh').struct(groove('shaker'))
  .gain(drums.shaker.vol.mul(tlOr('shaker')).mul(m('[.6 .3 .5 .25]*4')))
  .lpf(drums.shaker.cut).hpf(1200)
  .decay(drums.shaker.decay).sustain(0)
  .pan(sine.slow(16).range(0.4, 0.6))
  .mask(gateOf('shaker')).filter(audible)

// Ride — редкие акценты в GROOVE 2/DROP/PEAK.
$: s('rd').struct(groove('ride'))
  .gain(drums.ride.vol.mul(tlOr('ride')))
  .lpf(drums.ride.cut).hpf(700)
  .decay(drums.ride.decay).sustain(0)
  .pan(0.35)
  .mask(gateOf('ride')).filter(audible)

// Tom — филлы на сломе фразы, не каждый такт.
$: s('lt').bank('RolandTR808').struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ x ~'))
  .sometimesBy(0.4, (x) => x.struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ x x ~')))
  .gain(drums.tom.vol.mul(tlOr('tom')))
  .lpf(drums.tom.cut).lpq(2)
  .decay(drums.tom.decay).sustain(0)
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .mask(gateOf('tom')).filter(audible)

// Rim — синкопы, короткое эхо.
$: s('rim').struct(groove('rim'))
  .gain(drums.rim.vol.mul(tlOr('rim')))
  .lpf(drums.rim.cut).hpf(800).lpq(2)
  .decay(drums.rim.decay).sustain(0)
  .delay(drums.rim.echo).delaytime(fx.delay.time).delayfeedback(fx.delay.fb.mul(0.6))
  .mask(gateOf('rim')).filter(audible)

// Snare roll — только BUILD; в LOOP выключен.
$: s('sd').struct(m('x*16'))
  .gain(drums.roll.vol.mul(tlOr('roll', pure(0))).mul(m('[.3 .45 .6 .75]*4')))
  .lpf(drums.roll.cut).hpf(180)
  .decay(drums.roll.decay).sustain(0)
  .room(verb.mul(0.25)).roomsize(fx.reverb.size)
  .mask(gateOf('roll', pure(0))).filter(audible)

// Sub — sine, только корень; дакается киком.
$: ROOT.struct(bassPat)
  .s('sine')
  .gain(low.sub.vol.mul(tlOr('sub')))
  .lpf(low.sub.cut).lpq(1)
  .attack(0.002).decay(low.sub.decay).sustain(0).release(0.02)
  .orbit(2)
  .mask(gateOf('sub')).filter(audible)

// Top-бас — 12 нот на такт, короткие, без sustain; свитч root/oct.
$: bassPitch.struct(bassPat)
  .s('sawtooth').unison(1)
  .gain(low.bass.vol.mul(tlOr('bass')))
  .lpf(low.bass.cut.mul(autoAt('low.bass.cut'))).lpq(low.bass.res).ftype('24db')
  .lpenv(low.bass.env).lpa(0.002).lpd(low.bass.decay).lpsustain(0)
  .decay(low.bass.decay).sustain(0).release(0.02)
  .distort(low.bass.drive)
  .clip(0.9)
  .orbit(2)
  .mask(gateOf('bass')).filter(audible)

// Acid 303 — короткий рифф, фильтр ведёт автоматика.
$: acidLine
  .s('sawtooth').unison(1)
  .gain(keys.acid.vol.mul(tlOr('acid')))
  .lpf(keys.acid.cut.mul(autoAt('keys.acid.cut'))).lpq(keys.acid.res).ftype('ladder')
  .lpenv(keys.acid.env).lpa(0.002).lpd(keys.acid.decay).lpsustain(0.05)
  .decay(keys.acid.decay).sustain(0.1).release(0.03)
  .delay(keys.acid.echo).delaytime(fx.delay.time).delayfeedback(fx.delay.fb.mul(0.7))
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .mask(gateOf('acid')).filter(audible)

// Psy lead — короткий мотив «вопрос-ответ», свитч leadVar.
$: leadLine
  .s('sawtooth').unison(2).detune(keys.lead.det)
  .gain(keys.lead.vol.mul(tlOr('lead')))
  .lpf(keys.lead.cut.mul(autoAt('keys.lead.cut')).mul(perlin.slow(8).range(0.8, 1.2))).lpq(keys.lead.res)
  .lpenv(keys.lead.env).lpa(0.003).lpd(keys.lead.decay).lpsustain(0.1)
  .decay(keys.lead.decay).sustain(0.25).release(0.15)
  .delay(keys.lead.echo).delaytime(fx.delay.time).delayfeedback(fx.delay.fb.mul(0.8))
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.4, 0.6))
  .mask(gateOf('lead')).filter(audible)

// FM squelch — редкие психоделические блипы, не на даунбит.
$: squelchLine
  .s('sine').fmi(keys.squelch.fm).fmh(keys.squelch.ratio)
  .gain(keys.squelch.vol.mul(tlOr('squelch')))
  .bpf(keys.squelch.cut.mul(rand.range(0.6, 1.4))).bpq(keys.squelch.q)
  .attack(0.001).decay(keys.squelch.decay).sustain(0).release(0.02)
  .delay(keys.squelch.echo).delaytime(fx.delay.time).delayfeedback(fx.delay.fb.mul(0.6))
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .pan(rand.range(0.3, 0.7))
  .mask(gateOf('squelch')).filter(audible)

// Drone — статичная педаль F#, без аккордов.
$: note(m('f#1')).slow(4).s('sawtooth').unison(2).detune(keys.drone.det)
  .gain(keys.drone.vol.mul(tlOr('drone')))
  .lpf(keys.drone.cut).lpq(2)
  .attack(keys.drone.atk).decay(2).sustain(0.9).release(keys.drone.rel)
  .room(verb.mul(0.8)).roomsize(fx.reverb.size)
  .mask(gateOf('drone')).filter(audible)

// Air pad — тот же корень, октавой выше; никакой прогрессии.
$: note(m('f#2')).slow(4).s('sawtooth').unison(4).detune(0.2)
  .gain(keys.pad.vol.mul(tlOr('pad')))
  .hpf(180).lpf(keys.pad.cut.mul(perlin.slow(16).range(0.6, 1.4))).lpq(2)
  .attack(keys.pad.atk).decay(2).sustain(0.8).release(keys.pad.rel)
  .chorus(keys.pad.chorus)
  .room(verb.mul(0.7)).roomsize(fx.reverb.size)
  .mask(gateOf('pad')).filter(audible)

// Air — розовый шум, медленный фильтр.
$: s('pink').struct(m('x*2'))
  .gain(atmos.air.vol.mul(tlOr('air')).mul(perlin.slow(atmos.air.lfo).range(0.2, 1)))
  .hpf(sine.slow(16).range(300, 5000)).lpf(atmos.air.cut.mul(autoAt('atmos.air.cut')))
  .room(verb.mul(1)).roomsize(fx.reverb.size)
  .mask(gateOf('air')).filter(audible)

// Riser — один длинный шум на 4 такта; в LOOP выключен.
$: s('white').slow(4)
  .gain(atmos.riser.vol.mul(tlOr('riser', pure(0))))
  .hpf(atmos.riser.hpf).lpf(atmos.riser.cut)
  .lpenv(2).lpa(6).lpd(2).lpsustain(0.2)
  .attack(2).decay(2).sustain(0.7).release(1.2)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('riser', pure(0))).filter(audible)

// Reverse crash — на входе в секцию; в LOOP выключен.
$: s('cr').rev().slow(2)
  .gain(atmos.reverse.vol.mul(tlOr('reverse', pure(0))))
  .lpf(atmos.reverse.cut)
  .decay(atmos.reverse.decay).sustain(0)
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .mask(gateOf('reverse', pure(0))).filter(audible)

// ──────────────────────────────────────────────────────────────────
//  Форма: INTRO 16 (только kick+bass) → GROOVE → LIFT → GROOVE 2 →
//  BREAK 16 → BUILD 16 → DROP 16 → GROOVE 3 → PEAK → PEAK 2 →
//  BREAK 2 → OUTRO. Свитчи mode/bassVar/leadVar в LOOP — с кнопок,
//  в SONG/HOLD — из секции. Бас: sub ≤70, top ~700, всё в orbit 2.
