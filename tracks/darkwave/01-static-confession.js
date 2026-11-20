// DARKWAVE 01 · STATIC CONFESSION · 124 BPM
// Тёмная сторона новой волны: Depeche-середина (Black Celebration → Violator).
// A минор/фригийский, БЕЗ доминанты: Am9 – Bbmaj7 – Fmaj7 – Dm7 (i–bII–bVI–iv).
// Бас — педаль A с b2-соседом, не проход по корням аккордов (антипоп).
// Синтетика: TR-909/808, pulse-бас, полый pulse-пэд, string machine,
// FM-колокол, арпеджио из аккордов, моно-лид.
// 104 такта: INTRO → VERSE → PRE → CHORUS → INTERLUDE → VERSE 2 → CHORUS 2 →
// OUTRO (последние 8 — без барабанов и баса). Гайд: docs/darkwave/README.md.
setcpm(124 / 4)

// UI-манифест для панели: обычный JS-объект в коде (строки — одинарные).
const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
  switches: {
    mode: ['drive', 'push', 'half', 'stomp'],
    arpVar: ['low', 'high'],
    leadVar: ['verse', 'chorus'],
  },
}

// ── переключатели ────────────────────────────────────────────────
const play = slider(1, 0, 2, 1)   // 0 LOOP, 1 SONG, 2 HOLD
const mode = slider(0, 0, 3, 1)   // четыре грува
const arpVar = slider(0, 0, 1, 1) // арп: low / high
const leadVar = slider(0, 0, 1, 1) // лид: verse / chorus
const holdBar = slider(0, 0, 127, 1)

// ── глобальные ───────────────────────────────────────────────────
const verb = slider(0.9, 0, 1, 0.01)
const tape = slider(0.4, 0, 1, 0.01)

const instruments = {
  drums: {
    kick: {
      name: 'Kick',
      vol: slider(0.62, 0, 1, 0.01),
      cut: slider(1200, 300, 6000, 20),
      tune: slider(1, 0.7, 1.4, 0.01),
      decay: slider(0.3, 0.08, 0.6, 0.01),
    },
    snare: {
      name: 'Snare',
      vol: slider(0.4, 0, 0.8, 0.01),
      cut: slider(4200, 800, 9000, 20),
      decay: slider(0.18, 0.05, 0.5, 0.01),
      room: slider(0.7, 0, 1, 0.01),
    },
    clap: {
      name: 'Clap',
      vol: slider(0.24, 0, 0.6, 0.01),
      cut: slider(3600, 800, 9000, 20),
      decay: slider(0.16, 0.04, 0.4, 0.01),
      room: slider(0.6, 0, 1, 0.01),
    },
    hat: {
      name: 'Hats',
      vol: slider(0.16, 0, 0.5, 0.01),
      cut: slider(9000, 2000, 14000, 50),
      decay: slider(0.05, 0.02, 0.2, 0.005),
      human: slider(0.15, 0, 0.6, 0.01),
    },
    ohat: {
      name: 'Open hat',
      vol: slider(0.14, 0, 0.5, 0.01),
      cut: slider(7200, 1500, 12000, 50),
      decay: slider(0.24, 0.05, 0.6, 0.01),
    },
    tom: {
      name: 'Toms',
      vol: slider(0.18, 0, 0.7, 0.01),
      cut: slider(2400, 400, 8000, 20),
      decay: slider(0.22, 0.05, 0.6, 0.01),
    },
    rim: {
      name: 'Rim / click',
      vol: slider(0.12, 0, 0.4, 0.01),
      cut: slider(5200, 800, 12000, 20),
      decay: slider(0.06, 0.02, 0.2, 0.005),
      echo: slider(0.18, 0, 0.6, 0.01),
    },
  },
  low: {
    bass: {
      name: 'Pulse bass',
      vol: slider(0.51, 0, 1, 0.01),
      cut: slider(80, 40, 300, 5),
      res: slider(6, 0, 18, 0.5),
      env: slider(2.4, 0, 8, 0.1),
      decay: slider(0.16, 0.04, 0.5, 0.01),
      pw: slider(0.35, 0.1, 0.5, 0.01),
      punch: slider(4, 0, 12, 0.5),
    },
    sub: {
      name: 'Sub',
      vol: slider(0.16, 0, 0.5, 0.01),
      cut: slider(120, 40, 400, 5),
      decay: slider(0.5, 0.1, 1.2, 0.01),
    },
  },
  keys: {
    pad: {
      name: 'Hollow pad',
      vol: slider(0.13, 0, 0.5, 0.01),
      cut: slider(860, 300, 6000, 20),
      res: slider(8, 0, 12, 0.1),
      pw: slider(0.28, 0.05, 0.5, 0.01),
      det: slider(0.12, 0, 0.6, 0.01),
      atk: slider(0.9, 0.05, 3, 0.05),
      rel: slider(2.6, 0.4, 6, 0.1),
      chorus: slider(0.84, 0, 1, 0.01),
    },
    strings: {
      name: 'String machine',
      vol: slider(0.15, 0, 0.5, 0.01),
      cut: slider(1240, 400, 8000, 20),
      atk: slider(0.5, 0.05, 3, 0.05),
      rel: slider(2.2, 0.3, 6, 0.1),
      chorus: slider(0.75, 0, 1, 0.01),
    },
    bell: {
      name: 'Glass bell',
      vol: slider(0.33, 0, 0.5, 0.01),
      cut: slider(2420, 600, 10000, 20),
      fm: slider(2, 0, 6, 0.1),
      ratio: slider(2.01, 1, 4, 0.01),
      decay: slider(1.4, 0.2, 3, 0.05),
      rel: slider(2.2, 0.3, 5, 0.1),
      echo: slider(0.3, 0, 0.7, 0.01),
    },
    arp: {
      name: 'Arp',
      vol: slider(0.39, 0, 0.4, 0.01),
      cut: slider(3520, 400, 8000, 20),
      pw: slider(0.2, 0.05, 0.5, 0.01),
      decay: slider(0.07, 0.02, 0.3, 0.005),
      echo: slider(0.38, 0, 0.8, 0.01),
    },
    lead: {
      name: 'Lead',
      vol: slider(0.32, 0, 0.5, 0.01),
      cut: slider(2520, 400, 8000, 20),
      q: slider(4, 0, 12, 0.5),
      pw: slider(0.35, 0.1, 0.5, 0.01),
      atk: slider(0.042, 0.002, 0.3, 0.002),
      decay: slider(0.28, 0.05, 0.8, 0.01),
      echo: slider(0.42, 0, 0.9, 0.01),
    },
  },
  atmos: {
    air: {
      name: 'Air',
      vol: slider(0.08, 0, 0.2, 0.005),
      cut: slider(1400, 200, 5000, 20),
      lfo: slider(0.5, 0, 2, 0.01),
    },
    tape: {
      name: 'Tape',
      vol: slider(0.05, 0, 0.2, 0.005),
      cut: slider(5200, 800, 12000, 20),
    },
    riser: {
      name: 'Noise riser',
      vol: slider(0.1, 0, 0.4, 0.01),
      cut: slider(5000, 800, 12000, 20),
      hpf: slider(400, 100, 2000, 10),
    },
  },
  fx: {
    reverb: { size: slider(6, 1, 10, 0.5) },
    delay: { time: slider(0.375, 0.125, 0.75, 0.005) },
  },
}
const { drums, low, keys, atmos, fx } = instruments

// ── TIMELINE: 104 такта ───────────────────────────────────────────
const TIMELINE = [
  { at: 0,  len: 8,  name: 'INTRO',  values: { kick: 0, snare: 0, clap: 0, hat: 0, ohat: 0, tom: 0, rim: 0, bass: 0, sub: 0, pad: 1, strings: 0, bell: 0.6, arp: 0, lead: 0, air: 1, tape: 0.6, riser: 0, mode: 2, arpVar: 0, leadVar: 0  } },
  { at: 8,  len: 16, name: 'VERSE',  values: { kick: 1, snare: 1, clap: 0, hat: 1, ohat: 0.2, tom: 0.2, rim: 0.3, bass: 1, sub: 0, pad: 1, strings: 0, bell: 0.2, arp: 0.55, lead: 0.25, air: 0.7, tape: 0.5, riser: 0, mode: 0, arpVar: 0, leadVar: 0  } },
  { at: 24, len: 8,  name: 'PRE',    values: { kick: 1, snare: 0.7, clap: 0.4, hat: 1, ohat: 0.4, tom: 0.8, rim: 0.4, bass: 1, sub: 0, pad: 1, strings: 0.3, bell: 0.15, arp: 0.8, lead: 0.3, air: 0.8, tape: 0.6, riser: 1, mode: 1, arpVar: 1, leadVar: 0  } },
  { at: 32, len: 16, name: 'CHORUS', values: { kick: 1, snare: 1, clap: 1, hat: 1, ohat: 0.7, tom: 0.5, rim: 0.2, bass: 1, sub: 0.7, pad: 1, strings: 0.9, bell: 0.35, arp: 0.8, lead: 1, air: 0.7, tape: 0.5, riser: 0, mode: 1, arpVar: 1, leadVar: 1  } },
  { at: 48, len: 8,  name: 'INTERLUDE', values: { kick: 0, snare: 0, clap: 0, hat: 0.3, ohat: 0, tom: 0.5, rim: 0.4, bass: 0.3, sub: 0, pad: 1, strings: 0.6, bell: 0.8, arp: 0.2, lead: 0, air: 1.1, tape: 0.8, riser: 0.6, mode: 3, arpVar: 0, leadVar: 0  } },
  { at: 56, len: 16, name: 'VERSE 2',values: { kick: 1, snare: 1, clap: 0, hat: 0.8, ohat: 0.15, tom: 0.2, rim: 0.3, bass: 1, sub: 0, pad: 1, strings: 0, bell: 0.2, arp: 0.4, lead: 0.2, air: 0.8, tape: 0.5, riser: 0, mode: 2, arpVar: 0, leadVar: 0  } },
  { at: 72, len: 16, name: 'CHORUS 2', values: { kick: 1, snare: 1, clap: 1, hat: 1, ohat: 0.7, tom: 0.5, rim: 0.2, bass: 1, sub: 0.7, pad: 1, strings: 1, bell: 0.3, arp: 0.75, lead: 1, air: 0.7, tape: 0.5, riser: 0, mode: 1, arpVar: 1, leadVar: 1  } },
  { at: 88, len: 8,  name: 'OUTRO',  values: { kick: 0.5, snare: 0, clap: 0, hat: 0.4, ohat: 0, tom: 0.2, rim: 0.2, bass: 0.5, sub: 0, pad: 1, strings: 0.5, bell: 0.5, arp: 0.15, lead: 0.1, air: 1.1, tape: 0.8, riser: 0, mode: 3, arpVar: 0, leadVar: 0  } },
  { at: 96, len: 8,  name: 'OUTRO 2',values: { kick: 0, snare: 0, clap: 0, hat: 0, ohat: 0, tom: 0, rim: 0, bass: 0, sub: 0, pad: 1, strings: 0.4, bell: 0.5, arp: 0, lead: 0, air: 1.2, tape: 1, riser: 0, mode: 3, arpVar: 0, leadVar: 0  } },
]

// ── AUTOMATION: множители к слайдерам во времени (нативно) ────────
const AUTOMATION = [
  { path: 'keys.pad.cut',     points: [[0, 1], [24, 1.4], [32, 2.2], [48, 2.2], [56, 1], [72, 2.2], [88, 1], [104, 0.15]] },
  { path: 'keys.strings.cut', points: [[48, 1], [56, 2], [72, 1.6], [88, 1.2], [96, 0.4], [104, 0.1]] },
  { path: 'keys.arp.cut',     points: [[8, 1], [24, 1.6], [32, 2.2], [48, 2.2], [56, 1.2], [72, 2.4], [88, 2.4], [96, 1], [104, 0.2]] },
  { path: 'keys.lead.cut',    points: [[8, 0.7], [24, 1], [32, 2.6], [48, 2.6], [56, 1], [72, 2.8], [88, 2.8], [96, 1.2], [104, 0.2]] },
  { path: 'low.bass.cut',     points: [[0, 1], [24, 1], [32, 1.3], [48, 1.3], [56, 1], [72, 1.3], [88, 1], [96, 1], [104, 0.3]] },
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
// SONG → TIMELINE, LOOP → loopLevel, HOLD → значения секции.
const tlOr = (key, loopLevel = pure(1)) => {
  const base = tlCurve(key).mul(songGate).add(loopLevel.mul(loopGate))
  return base.add(sectionValue(key).mul(holdGate))
}
const autoSwitch = (key, knob) =>
  tlCurve(key).mul(songGate).add(knob.mul(loopGate)).add(sectionValue(key).mul(holdGate))
const modeAuto = autoSwitch('mode', mode)
const arpAuto = autoSwitch('arpVar', arpVar)
const leadAuto = autoSwitch('leadVar', leadVar)
// AUTOMATION: SONG — кривая, LOOP — ×1, HOLD — снимок на holdBar.
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

// ── МАТЕРИАЛ (figures): A minor ─────────────────────────────────
// Антипоп: никакой доминанты с G#; bII (Bb) — неаполитанская краска,
// 9-ки и 7-ки вместо «разрешения». Бас не идёт по корням — педаль A.
const figures = {
  chords: note(m('<[a3,c4,e4,b4] [bb2,d3,f3,a3] [f2,a2,c3,e3] [d3,f3,a3,c4]>')),
  pedal: note(m('<a1 a1 bb1 a1>')),
  sub: note(m('<a1 a1 a1 a1>')).slow(2),
  leadVerse: note(m('a3 c4 b3 a3 f4 e4 d4 c4')),
  leadChorus: note(m('e4 f4 e4 d4 c4 b3 a3 ~')),
  bell: note(m('<a4 ~ ~ ~ b4 ~ e5 ~>')).slow(2),
}
const { chords } = figures

// ── РИТМЫ (grooves): mode 0..3 ──────────────────────────────────
const grooves = {
  kick: [
    m('x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~'),
    m('x ~ ~ x x ~ ~ ~ x ~ ~ x x ~ ~ ~'),
    m('x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~'),
    m('x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~'),
  ],
  snare: [
    m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
    m('~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~ ~ x'),
    m('~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~'),
    m('~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ x ~ ~ ~'),
  ],
  hat: [
    m('x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~'),
    m('x x x x x x x x x x x x x x x x'),
    m('x ~ ~ x ~ ~ x ~ x ~ ~ x ~ ~ x ~'),
    m('x ~ x x ~ x ~ x x ~ x ~ x x ~ ~'),
  ],
  bass: [
    m('x ~ x ~ x ~ x ~'),
    m('x ~ x x ~ x x ~'),
    m('x ~ ~ ~ x ~ ~ ~'),
    m('x x ~ x x ~ x x'),
  ],
}
const groove = (part) => modeAuto.pick(grooves[part])

// ── СЛОИ ────────────────────────────────────────────────────────
$: s('bd').bank('RolandTR909').struct(groove('kick'))
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .lpf(drums.kick.cut).lpq(1)
  .speed(drums.kick.tune)
  .decay(drums.kick.decay).sustain(0).release(0.03)
  .duckorbit(2).duckdepth(0.4).duckattack(0.02)
  .filter(audible)

$: s('sd').bank('RolandTR909').struct(groove('snare'))
  .gain(drums.snare.vol.mul(tlOr('snare')))
  .lpf(drums.snare.cut).lpq(2).hpf(220)
  .decay(drums.snare.decay).sustain(0).release(0.06)
  .room(verb.mul(drums.snare.room)).roomsize(fx.reverb.size)
  .filter(audible)

$: s('cp').bank('RolandTR909').struct(groove('snare'))
  .gain(drums.clap.vol.mul(tlOr('clap')))
  .lpf(drums.clap.cut).hpf(600).lpq(1)
  .decay(drums.clap.decay).sustain(0)
  .room(verb.mul(drums.clap.room)).roomsize(fx.reverb.size)
  .filter(audible)

$: s('hh').bank('RolandTR909').struct(groove('hat'))
  .sometimesBy(drums.hat.human, (x) => x.late(0.015))
  .gain(drums.hat.vol.mul(tlOr('hat')).mul(m('[1 .55 .8 .45]*4')))
  .lpf(drums.hat.cut).hpf(700)
  .decay(drums.hat.decay).sustain(0)
  .filter(audible)

$: s('oh').bank('RolandTR909').struct(m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'))
  .gain(drums.ohat.vol.mul(tlOr('ohat')))
  .lpf(drums.ohat.cut).hpf(500)
  .decay(drums.ohat.decay).sustain(0)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .filter(audible)

// Томы — филлы, не в каждом такте.
$: s('lt').bank('RolandTR808').struct('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ x ~')
  .sometimesBy(0.5, (x) => x.struct('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ x x ~'))
  .gain(drums.tom.vol.mul(tlOr('tom')))
  .lpf(drums.tom.cut).lpq(2)
  .decay(drums.tom.decay).sustain(0)
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .filter(audible)

$: s('rim').bank('RolandTR808').struct('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~')
  .gain(drums.rim.vol.mul(tlOr('rim')))
  .lpf(drums.rim.cut).hpf(900).lpq(2)
  .decay(drums.rim.decay).sustain(0)
  .delay(drums.rim.echo).delaytime(fx.delay.time).delayfeedback(0.3)
  .filter(audible)

// Pulse-бас: педаль A + b2-сосед, не корни аккордов; редкий октавный бросок.
$: figures.pedal.struct(groove('bass'))
  .sometimesBy(0.14, (x) => x.add(note(12)))
  .s('pulse').pw(low.bass.pw).unison(1)
  .gain(low.bass.vol.mul(tlOr('bass')))
  .lpf(low.bass.cut.mul(autoAt('low.bass.cut')).mul(perlin.slow(8).range(0.85, 1))).lpq(low.bass.res).ftype('24db')
  .lpenv(low.bass.env).lpa(0.002).lpd(low.bass.decay).lpsustain(0.15)
  .penv(low.bass.punch).pattack(0.001).pdecay(0.05)
  .clip(0.9).decay(0.12).sustain(0.45).release(0.04)
  .orbit(2)
  .filter(audible)

// Sine-саб в припевах: тот же педальный A, без гармонического хода.
$: figures.sub.s('sine')
  .gain(low.sub.vol.mul(tlOr('sub')))
  .lpf(low.sub.cut)
  .attack(0.02).decay(low.sub.decay).sustain(0.8).release(0.3)
  .orbit(2)
  .filter(audible)

// Полый pulse-пэд: не Juno-стек, а «дудка» с chorus.
$: chords.slow(2)
  .s('pulse').pw(keys.pad.pw).unison(2).detune(keys.pad.det)
  .gain(keys.pad.vol.mul(tlOr('pad')))
  .hpf(200)
  .lpf(keys.pad.cut.mul(autoAt('keys.pad.cut')).mul(perlin.slow(16).range(0.8, 1.2))).lpq(keys.pad.res)
  .attack(keys.pad.atk).decay(1.8).sustain(0.85).release(keys.pad.rel)
  .chorus(keys.pad.chorus)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// String machine: октавой выше, только когда есть место.
$: chords.slow(2).add(note(12))
  .s('sawtooth').unison(4).detune(0.18)
  .gain(keys.strings.vol.mul(tlOr('strings')))
  .hpf(380)
  .lpf(keys.strings.cut.mul(autoAt('keys.strings.cut'))).lpq(1)
  .attack(keys.strings.atk).decay(2).sustain(0.8).release(keys.strings.rel)
  .chorus(keys.strings.chorus)
  .room(verb.mul(0.9)).roomsize(fx.reverb.size)
  .filter(audible)

// FM-колокол: редкие украшения, dotted delay.
$: figures.bell
  .s('sine').fmi(keys.bell.fm).fmh(keys.bell.ratio)
  .gain(keys.bell.vol.mul(tlOr('bell')))
  .lpf(keys.bell.cut)
  .attack(0.002).decay(keys.bell.decay).sustain(0).release(keys.bell.rel)
  .delay(keys.bell.echo).delaytime(fx.delay.time).delayfeedback(0.45)
  .room(verb.mul(0.7)).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.35, 0.65))
  .filter(audible)

// Арпеджио из аккордов (а не из отдельной строки).
const arpLine = arpAuto.pick([
  chords.slow(2).arp('0 1 2 1 2 3 2 1'),
  chords.slow(2).arp('0 2 3 2 1 0 1 2').add(note(12)),
])
$: arpLine
  .s('pulse').pw(keys.arp.pw).unison(1)
  .gain(keys.arp.vol.mul(tlOr('arp')))
  .lpf(keys.arp.cut.mul(autoAt('keys.arp.cut'))).lpq(2)
  .attack(0.002).decay(keys.arp.decay).sustain(0).release(0.05)
  .delay(keys.arp.echo).delaytime(fx.delay.time).delayfeedback(0.45)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.3, 0.7))
  .filter(audible)

// Лид: две фразы — куплетная и припевная.
const leadLine = leadAuto.pick([
  figures.leadVerse.struct('x ~ ~ x ~ ~ x ~'),
  figures.leadChorus.struct('~ x ~ ~ x ~ ~ x'),
])
$: leadLine
  .s('square').pw(keys.lead.pw).unison(1)
  .gain(keys.lead.vol.mul(tlOr('lead')))
  .lpf(keys.lead.cut.mul(autoAt('keys.lead.cut'))).lpq(keys.lead.q)
  .attack(keys.lead.atk).decay(keys.lead.decay).sustain(0.3).release(0.2)
  .delay(keys.lead.echo).delaytime(fx.delay.time).delayfeedback(0.5)
  .room(verb.mul(0.7)).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.42, 0.58))
  .filter(audible)

// Воздух: не «pink», а тёмный brown-шум.
$: s('brown').struct('x*2')
  .gain(atmos.air.vol.mul(tlOr('air')))
  .lpf(atmos.air.cut.mul(atmos.air.lfo.fmap((v) => 0.5 + v * 4))).hpf(300)
  .filter(audible)

// Лента — тихо, в паузах.
$: s('crackle').struct('x*2')
  .gain(atmos.tape.vol.mul(tape).mul(tlOr('tape')))
  .lpf(atmos.tape.cut).hpf(400)
  .filter(audible)

// Riser: длинный шум, открывается фильтром.
$: s('white').slow(4)
  .gain(atmos.riser.vol.mul(tlOr('riser')))
  .hpf(atmos.riser.hpf)
  .lpf(atmos.riser.cut)
  .lpenv(2).lpa(6).lpd(2).lpsustain(0.2)
  .attack(2).decay(2).sustain(0.7).release(1.2)
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .filter(audible)
