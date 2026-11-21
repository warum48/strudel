// BERLIN TECHNO 23 · BLACK ROOM · 132 BPM · 192 такта
// Новый трек по итогам ресёрча (docs/techno/README.md): давление и
// повторение, кик-якорь, rumble как бас/клей, сайдчейн, клэп на второй
// кик, индустриальная перкуссия, 1–3 нотные петли. Без мелодии, пэда и
// поп-дропов. 01-berlin оставлен референсом.
setcpm(132 / 4)

if (typeof samples === 'function') {
  samples('github:tidalcycles/uzu-drumkit')
  samples('github:tidalcycles/Dirt-Samples')
}

const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
  switches: {
    mode: ['straight', 'rolling', 'broken'],
  },
}

const play = slider(1, 0, 2, 1)
const mode = slider(0, 0, 2, 1)
const holdBar = slider(0, 0, 255, 1)
const verb = slider(0.2, 0, 0.6, 0.01)
const duck = slider(0.55, 0, 1, 0.01)
const swing = slider(0.055, 0, 0.15, 0.005)

const instruments = {
  master: {
    cut: {
      name: 'Master cut',
      hz: slider(9000, 200, 16000, 100),
      res: slider(4, 0, 20, 0.5),
      hpf: slider(240, 20, 2000, 10),
      lfo: slider(1.2, 0, 6, 0.1),
      lfoR: slider(0.125, 0.03, 2, 0.005),
    },
  },
  drums: {
    kick: {
      name: 'Kick',
      vol: slider(0.55, 0, 1, 0.01),
      tune: slider(1, 0.7, 1.4, 0.01),
      cut: slider(190, 70, 800, 5),
      shape: slider(0.3, 0, 0.9, 0.01),
      decay: slider(0.28, 0.08, 0.5, 0.01),
    },
    click: {
      name: 'Kick click',
      vol: slider(0.045, 0, 0.2, 0.005),
      cut: slider(12000, 3000, 16000, 100),
      decay: slider(0.02, 0.006, 0.08, 0.002),
    },
    rumble: {
      name: 'Rumble',
      vol: slider(0.2, 0, 0.8, 0.01),
      cut: slider(170, 80, 400, 5),
      decay: slider(0.7, 0.2, 1.6, 0.01),
      drive: slider(0.6, 0, 0.95, 0.01),
      size: slider(8, 2, 10, 0.5),
    },
    tom: {
      name: 'Low tom',
      vol: slider(0.16, 0, 0.5, 0.01),
      cut: slider(380, 100, 2000, 10),
      decay: slider(0.3, 0.08, 0.8, 0.01),
    },
    hat: {
      name: 'Hats',
      vol: slider(0.1, 0, 0.4, 0.01),
      cut: slider(9000, 1500, 16000, 50),
      decay: slider(0.04, 0.01, 0.2, 0.005),
    },
    ohat: {
      name: 'Open hat',
      vol: slider(0.07, 0, 0.3, 0.01),
      cut: slider(7000, 1000, 12000, 50),
      decay: slider(0.22, 0.03, 0.6, 0.01),
    },
    clap: {
      name: 'Clap',
      vol: slider(0.18, 0, 0.5, 0.01),
      cut: slider(4500, 800, 12000, 20),
      decay: slider(0.15, 0.03, 0.4, 0.01),
      room: slider(0.3, 0, 0.8, 0.01),
    },
    rim: {
      name: 'Rim',
      vol: slider(0.09, 0, 0.3, 0.01),
      cut: slider(5200, 800, 12000, 20),
      decay: slider(0.06, 0.02, 0.2, 0.005),
      echo: slider(0.18, 0, 0.6, 0.01),
    },
    metal: {
      name: 'Industrial metal',
      vol: slider(0.18, 0, 0.4, 0.01),
      cut: slider(1600, 200, 8000, 20),
      q: slider(9, 0, 18, 0.5),
      speed: slider(0.65, 0.25, 1.4, 0.01),
    },
    ride: {
      name: 'Ride',
      vol: slider(0.06, 0, 0.3, 0.01),
      cut: slider(8000, 1500, 14000, 50),
      decay: slider(0.12, 0.03, 0.4, 0.01),
    },
  },
  low: {
    sub: {
      name: 'Sub ≤80',
      vol: slider(0.3, 0, 0.8, 0.01),
      cut: slider(70, 40, 80, 1),
      decay: slider(0.45, 0.1, 1.2, 0.01),
    },
    bass: {
      name: 'Mid bass',
      vol: slider(0.22, 0, 0.6, 0.01),
      cut: slider(320, 80, 900, 5),
      res: slider(9, 0, 18, 0.5),
      env: slider(2, 0, 6, 0.1),
      decay: slider(0.1, 0.03, 0.3, 0.005),
      pw: slider(0.32, 0.1, 0.5, 0.01),
    },
  },
  keys: {
    seq: {
      name: 'Tension pulse',
      vol: slider(0.14, 0, 0.3, 0.01),
      cut: slider(1800, 300, 6000, 20),
      res: slider(6, 0, 16, 0.5),
      decay: slider(0.14, 0.03, 0.5, 0.005),
      echo: slider(0.28, 0, 0.7, 0.01),
    },
  },
  atmos: {
    noise: {
      name: 'Noise',
      vol: slider(0.04, 0, 0.2, 0.005),
      cut: slider(1400, 200, 7000, 20),
      lfo: slider(2, 0, 8, 0.1),
    },
    crackle: {
      name: 'Vinyl',
      vol: slider(0.03, 0, 0.15, 0.005),
      cut: slider(3200, 300, 9000, 20),
      hpf: slider(90, 20, 600, 10),
    },
  },
  fx: {
    reverb: { size: slider(4, 0.5, 10, 0.5) },
    delay: { time: slider(0.375, 0.125, 0.75, 0.005), feedback: slider(0.4, 0, 0.8, 0.01) },
  },
}
const { master, drums, low, keys, atmos, fx } = instruments

const TIMELINE = [
  { at: 0,   len: 16, name: 'INTRO',  values: { kick: 0, click: 0, rumble: 1, tom: 0, hat: 0, ohat: 0, clap: 0, rim: 0, metal: 1, ride: 0, sub: 0, bass: 0, seq: 0, noise: 1, crackle: 1, mode: 0  } },
  { at: 16,  len: 32, name: 'BUILD',  values: { kick: 1, click: 1, rumble: 1, tom: 0, hat: 1, ohat: 0, clap: 0, rim: 0, metal: 1, ride: 0, sub: 1, bass: 1, seq: 0, noise: 1, crackle: 1, mode: 0  } },
  { at: 48,  len: 32, name: 'LIFT',   values: { kick: 1, click: 1, rumble: 1, tom: 1, hat: 1, ohat: 1, clap: 1, rim: 1, metal: 1, ride: 0, sub: 1, bass: 1, seq: 1, noise: 1, crackle: 1, mode: 0  } },
  { at: 80,  len: 16, name: 'BREAK',  values: { kick: 1, click: 1, rumble: 1, tom: 0, hat: 0, ohat: 0, clap: 0, rim: 0, metal: 1, ride: 0, sub: 0, bass: 0, seq: 0, noise: 1, crackle: 1, mode: 0  } },
  { at: 96,  len: 48, name: 'DRIVE',  values: { kick: 1, click: 1, rumble: 1, tom: 1, hat: 1, ohat: 1, clap: 1, rim: 1, metal: 1, ride: 1, sub: 1, bass: 1, seq: 1, noise: 1, crackle: 1, mode: 1  } },
  { at: 144, len: 32, name: 'PEAK',   values: { kick: 1, click: 1, rumble: 1, tom: 1, hat: 1, ohat: 1, clap: 1, rim: 1, metal: 1, ride: 1, sub: 1, bass: 1, seq: 1, noise: 1, crackle: 1, mode: 2  } },
  { at: 176, len: 16, name: 'OUTRO',  values: { kick: 1, click: 1, rumble: 1, tom: 0, hat: 0, ohat: 0, clap: 0, rim: 0, metal: 1, ride: 0, sub: 0, bass: 0, seq: 0, noise: 1, crackle: 1, mode: 0  } },
]

const AUTOMATION = [
  { path: 'master.hz',        points: [[0, 0.4], [16, 0.6], [48, 1], [80, 0.55], [96, 0.9], [144, 1], [160, 1.2], [176, 0.8], [192, 0.2]] },
  { path: 'master.cut.hpf',   points: [[0, 1], [48, 1], [80, 1.5], [96, 1], [144, 1.1], [160, 1.9], [176, 1], [192, 0.5]] },
  { path: 'low.bass.cut',     points: [[16, 0.7], [48, 1], [80, 0.9], [96, 1.2], [144, 1.4], [176, 1], [192, 0.3]] },
  { path: 'keys.seq.cut',     points: [[48, 0.7], [80, 1], [96, 1.2], [144, 1.8], [176, 0.8], [192, 0.2]] },
  { path: 'drums.metal.cut',  points: [[0, 0.7], [16, 1], [48, 1.2], [80, 1.4], [96, 1], [144, 1.6], [176, 0.7], [192, 0.2]] },
  { path: 'atmos.noise.cut',  points: [[0, 0.7], [48, 1], [80, 1.2], [96, 1], [144, 1.4], [176, 0.7], [192, 0.3]] },
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
const phrase = (bars) => m('<' + bars.join(' ') + '>')

// ── МАТЕРИАЛ ────────────────────────────────────────────────────
const ROOT = note(m('<a1 a1 a1 a1>'))
const SUB = note(m('~ a1 ~ a1 ~ a1 ~ a1'))
const MID = note(m('<a2 ~ ~ bb2 ~ ~ eb2 ~>')).slow(2)
const SEQ = note(m('<a3 ~ ~ ~ ~ ~ bb3 ~>')).slow(4)
const RIM = phrase([
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ rim ~ rim]',
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~ ~]',
])
const METAL = phrase([
  '[~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ x]',
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ x ~]',
])

// ── РИТМЫ ───────────────────────────────────────────────────────
const hats = [
  m('x*16'),
  m('x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~'),
  m('x ~ ~ x ~ x ~ ~ x ~ x ~ ~ x ~ x'),
]
const claps = [
  m('~ ~ ~ x ~ ~ ~ ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~'),
  m('~ ~ x ~ ~ ~ x ~'),
]
const ohats = [
  m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
  m('~ ~ ~ x ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~'),
]
const rims = [
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ x'),
]
const hatPat = modeAuto.pick(hats)
const clapPat = modeAuto.pick(claps)
const ohatPat = modeAuto.pick(ohats)
const rimPat = modeAuto.pick(rims)

// ── СЛОИ ────────────────────────────────────────────────────────
$: s('bd*4')
  .speed(drums.kick.tune)
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .shape(drums.kick.shape)
  .lpf(drums.kick.cut).lpq(1)
  .decay(drums.kick.decay).sustain(0).release(0.03)
  .duckorbit(2).duckdepth(duck).duckattack(0.02)
  .mask(gateOf('kick')).filter(audible)

$: s('click:0*4')
  .gain(drums.click.vol.mul(tlOr('click')))
  .hpf(3200).lpf(drums.click.cut)
  .decay(drums.click.decay).sustain(0)
  .pan(0.5)
  .mask(gateOf('click')).filter(audible)

// RUMBLE: кик в длинный wet-реверб, сатурация, LP; в orbit 2, кик дакает.
$: s('bd*4')
  .gain(drums.rumble.vol.mul(tlOr('rumble')))
  .attack(0.004).decay(drums.rumble.decay).sustain(0)
  .shape(drums.rumble.drive)
  .lpf(drums.rumble.cut).lpq(5)
  .room(0.95).roomsize(drums.rumble.size)
  .orbit(2)
  .pan(0.5)
  .mask(gateOf('rumble')).filter(audible)

// Low tom как «второй кик»: редко, на сломе фразы (приём из Berghain-битов).
$: s('lt').bank('RolandTR808')
  .struct('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~')
  .gain(drums.tom.vol.mul(tlOr('tom')))
  .lpf(drums.tom.cut).lpq(2)
  .decay(drums.tom.decay).sustain(0)
  .room(verb.mul(0.25)).roomsize(fx.reverb.size)
  .mask(gateOf('tom')).filter(audible)

$: s('hh*16')
  .n('<0 1 2 1>')
  .struct(hatPat)
  .swingBy(swing, 8)
  .gain(drums.hat.vol.mul(tlOr('hat')).mul(m('<.9 .5 .75 .45 .8 .5 .7 .4>')))
  .lpf(drums.hat.cut.mul(autoAt('master.hz'))).lpq(master.cut.res).hpf(master.cut.hpf.mul(autoAt('master.cut.hpf')))
  .lpdepth(master.cut.lfo).lpsync(master.cut.lfoR)
  .decay(drums.hat.decay).sustain(0)
  .mask(gateOf('hat')).filter(audible)

$: s('oh*8')
  .struct(ohatPat)
  .gain(drums.ohat.vol.mul(tlOr('ohat')))
  .lpf(drums.ohat.cut.mul(autoAt('master.hz'))).hpf(500)
  .decay(drums.ohat.decay).sustain(0)
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .mask(gateOf('ohat')).filter(audible)

$: s('cp*8')
  .struct(clapPat)
  .gain(drums.clap.vol.mul(tlOr('clap')))
  .lpf(drums.clap.cut.mul(autoAt('master.hz'))).hpf(400).lpq(1)
  .decay(drums.clap.decay).sustain(0)
  .room(verb.mul(drums.clap.room)).roomsize(fx.reverb.size)
  .mask(gateOf('clap')).filter(audible)

$: RIM
  .s('rim')
  .gain(drums.rim.vol.mul(tlOr('rim')))
  .lpf(drums.rim.cut.mul(autoAt('master.hz'))).hpf(900).lpq(2)
  .decay(drums.rim.decay).sustain(0)
  .pan(rand.mul(0.8).sub(0.4))
  .delay(drums.rim.echo).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.4))
  .mask(gateOf('rim')).filter(audible)

$: METAL
  .s('metal:0')
  .speed(drums.metal.speed)
  .gain(drums.metal.vol.mul(tlOr('metal')).mul(m('<.8 .5 .7 .4>')))
  .lpf(drums.metal.cut.mul(autoAt('drums.metal.cut'))).lpq(drums.metal.q)
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .pan(sine.slow(16).range(0.35, 0.65))
  .mask(gateOf('metal')).filter(audible)

$: s('rd*8')
  .struct(rimPat)
  .gain(drums.ride.vol.mul(tlOr('ride')))
  .lpf(drums.ride.cut.mul(autoAt('master.hz'))).hpf(700)
  .decay(drums.ride.decay).sustain(0)
  .pan(0.35)
  .mask(gateOf('ride')).filter(audible)

$: SUB
  .s('sine')
  .gain(low.sub.vol.mul(tlOr('sub')))
  .lpf(low.sub.cut.mul(1)).lpq(1)
  .attack(0.01).decay(low.sub.decay).sustain(0.55).release(0.15)
  .orbit(2)
  .mask(gateOf('sub')).filter(audible)

$: MID
  .s('pulse').pw(low.bass.pw)
  .gain(low.bass.vol.mul(tlOr('bass')))
  .lpf(low.bass.cut.mul(autoAt('low.bass.cut'))).lpq(low.bass.res).ftype('24db')
  .lpenv(low.bass.env).lpa(0.004).lpd(low.bass.decay).lpsustain(0.04)
  .decay(low.bass.decay).sustain(0.05).release(0.03)
  .orbit(2)
  .mask(gateOf('bass')).filter(audible)

$: SEQ
  .s('pulse').pw(0.22)
  .gain(keys.seq.vol.mul(tlOr('seq')))
  .lpf(keys.seq.cut.mul(autoAt('keys.seq.cut'))).lpq(keys.seq.res)
  .lpenv(1.5).lpa(0.004).lpd(keys.seq.decay).lpsustain(0.05)
  .decay(keys.seq.decay).sustain(0.04).release(0.05)
  .delay(keys.seq.echo).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.5))
  .room(verb.mul(0.2)).roomsize(fx.reverb.size)
  .orbit(2)
  .mask(gateOf('seq')).filter(audible)

$: s('white')
  .gain(atmos.noise.vol.mul(tlOr('noise')))
  .lpf(atmos.noise.cut.mul(autoAt('atmos.noise.cut'))).lpq(1).hpf(300)
  .lpdepth(atmos.noise.lfo).lpsync(0.0625)
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .mask(gateOf('noise')).filter(audible)

$: s('crackle')
  .gain(atmos.crackle.vol.mul(tlOr('crackle')))
  .lpf(atmos.crackle.cut).hpf(atmos.crackle.hpf)
  .room(verb.mul(0.2)).roomsize(fx.reverb.size)
  .mask(gateOf('crackle')).filter(audible)
