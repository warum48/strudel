// DARK TECHSTEP 02 · v4 · 172 BPM · 144 такта · dark jungle / IDM
// v3 не тронут. v4 — лёгкая пересборка по референсу onefeather
// (strudelmarket): один fitted-брейк, редкие хэты, простой бас и мало
// слоёв, сухой микс. TIMELINE, SONG/LOOP/HOLD, gateOf на каждом слое,
// постоянные уровни. Гармония: Dm7 → Ebmaj7 → Dm7 → Bb / Gm7 → A°7.
// @roots d eb d bb g a d eb
// @dark
setcpm(172 / 4)

if (typeof samples === 'function') {
  samples('github:yaxu/clean-breaks/main')
  samples('github:tidalcycles/Dirt-Samples')
}

const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
  switches: {
    mode: ['void', 'jungle', 'techstep', 'glitch'],
    harmony: ['cluster', 'drone'],
    grind: ['long', 'drift', 'stutter'],
    grain: ['4', '8', '16'],
    drums: ['apache', 'dist', 'grain'],
    bass: ['grinder', 'coil'],
  },
}

const play = slider(1, 0, 2, 1)
const mode = slider(0, 0, 3, 1)
const harmony = slider(0, 0, 1, 1)
const grind = slider(0, 0, 2, 1)
const grain = slider(1, 0, 2, 1)
const drums = slider(0, 0, 2, 1)
const bass = slider(0, 0, 1, 1)
const holdBar = slider(0, 0, 143, 1)
const verb = slider(0.22, 0, 0.6, 0.01)

const __freqOf = (v) => {
  if (typeof getFrequencyFromValue === 'function') return getFrequencyFromValue(v)
  const n = v.note ?? v.n ?? 0
  return 440 * Math.pow(2, ((typeof n === 'number' ? n : noteToMidi(n)) - 69) / 12)
}

register('glide', (time, pat) => {
  let curr = []
  let prev = []
  let lastT = null
  const query = (state) => {
    const trig = !!state.controls._cps
    const haps = pat.query(state)
    const out = []
    for (const hap of haps) {
      const t = Number(hap.whole.begin)
      if (trig && (lastT == null || lastT !== t)) {
        prev = curr
        curr = []
        lastT = t
      }
      const glideHaps = time.query(state.setSpan(hap.wholeOrPart()))
      for (const gh of glideHaps) {
        const part = hap.part.intersection(gh.part)
        if (!part) continue
        const glideT = gh.value
        const freqF = __freqOf(hap.value)
        let freqI = null
        for (const v of prev) {
          const phase = glideT > 0 ? Math.min((t - v.t) / glideT, 1) : 1
          const cand = v.freqI + phase * (v.freqF - v.freqI)
          if (freqI == null || Math.abs(cand - freqF) < Math.abs(freqI - freqF)) freqI = cand
        }
        if (freqI == null) freqI = freqF
        if (trig) curr.push({ freqI, freqF, t })
        let val = hap.value
        if (glideT > 0 && Math.abs(freqF - freqI) > 1e-6) {
          val = {
            ...val,
            panchor: 0,
            psustain: 0,
            pattack: 0,
            pdecay: glideT,
            penv: -12 * Math.log2(freqF / freqI),
          }
        }
        out.push(new Hap(hap.whole, part, val, hap.combineContext(gh)))
      }
    }
    return out
  }
  return new Pattern(query)
}, false)

const instruments = {
  breaks: {
    apache: {
      name: 'Apache break',
      vol: slider(0.5, 0, 1, 0.01),
      cut: slider(4500, 300, 12000, 100),
      hpf: slider(60, 20, 400, 10),
      crush: slider(15, 1, 16, 0.5),
      room: slider(0.05, 0, 1, 0.01),
    },
    dist: {
      name: 'Distorted break',
      vol: slider(0.36, 0, 0.8, 0.01),
      cut: slider(3200, 300, 10000, 50),
      hpf: slider(70, 20, 400, 10),
      crush: slider(14, 1, 16, 0.5),
      room: slider(0.05, 0, 1, 0.01),
    },
    grain: {
      name: 'Grain chop',
      vol: slider(0.05, 0, 0.6, 0.01),
      cut: slider(6500, 500, 14000, 100),
      hpf: slider(100, 20, 800, 10),
      crush: slider(14, 1, 16, 0.5),
      speed: slider(1, 0.7, 1.3, 0.01),
      jitter: slider(0.005, 0, 0.04, 0.001),
      drop: slider(0.1, 0, 0.5, 0.01),
      room: slider(0.08, 0, 1, 0.01),
    },
  },
  perc: {
    hat: {
      name: 'Hats',
      vol: slider(0.09, 0, 0.5, 0.01),
      cut: slider(9000, 2000, 16000, 100),
      decay: slider(0.05, 0.01, 0.2, 0.005),
      room: slider(0.06, 0, 1, 0.01),
    },
    click: {
      name: 'Glitch clicks',
      vol: slider(0.09, 0, 0.5, 0.01),
      cut: slider(9000, 1000, 16000, 100),
      crush: slider(12, 1, 16, 0.5),
      decay: slider(0.05, 0.01, 0.3, 0.005),
      room: slider(0.1, 0, 1, 0.01),
    },
  },
  low: {
    sub: {
      name: 'Sub ≤90',
      vol: slider(0.5, 0, 1.1, 0.01),
      cut: slider(85, 40, 200, 5),
      decay: slider(0.9, 0.1, 3, 0.01),
    },
    grinder: {
      name: 'FM grinder',
      vol: slider(0.22, 0, 0.8, 0.01),
      cut: slider(620, 80, 3000, 10),
      res: slider(8, 0, 22, 0.5),
      fm: slider(3.2, 0.2, 8, 0.1),
      ratio: slider(1.51, 0.5, 4, 0.01),
      drive: slider(1.4, 0.2, 2.6, 0.01),
      dist: slider(0.2, 0, 0.8, 0.01),
      glide: slider(0.04, 0, 0.15, 0.001),
      attack: slider(0.6, 0.01, 2, 0.01),
      release: slider(1.2, 0.1, 4, 0.01),
      fmMod: slider(0.5, 0, 3, 0.01),
      lfo: slider(1, 0, 8, 0.1),
      chance: slider(0.25, 0, 1, 0.01),
      jitter: slider(0.01, 0, 0.1, 0.001),
      drop: slider(0.08, 0, 0.4, 0.01),
    },
    coil: {
      name: 'Coil Reese',
      vol: slider(0.22, 0, 0.7, 0.01),
      cut: slider(700, 100, 4000, 10),
      res: slider(11, 0, 22, 0.5),
      det: slider(0.18, 0.02, 0.6, 0.01),
      drive: slider(1.2, 0.2, 2.4, 0.01),
      lfo: slider(1.2, 0, 8, 0.1),
      room: slider(0.08, 0, 1, 0.01),
    },
  },
  pads: {
    void: {
      name: 'Void pad',
      vol: slider(0.2, 0, 0.7, 0.01),
      cut: slider(1000, 80, 6000, 10),
      hpf: slider(80, 20, 500, 10),
      q: slider(1.8, 0, 20, 0.5),
      lfo: slider(0.6, 0, 6, 0.1),
      det: slider(0.06, 0, 0.4, 0.01),
      grit: slider(0.08, 0, 0.5, 0.01),
    },
    tape: {
      name: 'Tape pad',
      vol: slider(0.16, 0, 0.6, 0.01),
      cut: slider(1400, 80, 8000, 10),
      hpf: slider(80, 20, 500, 10),
      crush: slider(13, 1, 16, 0.5),
    },
    drone: {
      name: 'Drone',
      vol: slider(0.18, 0, 0.7, 0.01),
      cut: slider(400, 40, 3000, 10),
    },
  },
  leads: {
    bell: {
      name: 'Metal bell',
      vol: slider(0.2, 0, 0.8, 0.01),
      cut: slider(4500, 300, 14000, 50),
      fm: slider(4, 0.5, 12, 0.1),
      ratio: slider(2.76, 0.5, 4, 0.01),
      decay: slider(0.45, 0.05, 2, 0.01),
      echo: slider(0.3, 0, 0.8, 0.01),
    },
  },
  fx: {
    reverse: {
      name: 'Reverse swell',
      vol: slider(0.16, 0, 0.5, 0.01),
      cut: slider(2200, 200, 10000, 50),
    },
    reverb: {
      name: 'Reverb',
      size: slider(7, 1, 16, 0.5),
    },
  },
  atmos: {
    dust: {
      name: 'Dust',
      vol: slider(0.08, 0, 0.4, 0.01),
      cut: slider(500, 80, 6000, 20),
      hpf: slider(100, 20, 1200, 10),
      lfo: slider(1.2, 0, 8, 0.1),
    },
    space: {
      name: 'Space',
      vol: slider(0.05, 0, 0.4, 0.01),
      cut: slider(900, 100, 6000, 20),
      hpf: slider(120, 20, 1000, 10),
    },
  },
}
const { breaks, perc, low, pads, leads, fx, atmos } = instruments

const TIMELINE = [
  { at: 0,   len: 16, name: 'INTRO',    values: { dust: 1, space: 1, breakOn: 0, drums: 0, hat: 0, click: 0, sub: 0, bassOn: 0, bass: 1, pads: 1, bell: 0, reverse: 0, mode: 0, harmony: 1, grindSel: 0, grainSel: 1 } },
  { at: 16,  len: 16, name: 'VOID',     values: { dust: 1, space: 1, breakOn: 1, drums: 0, hat: 0, click: 0, sub: 1, bassOn: 1, bass: 0, pads: 1, bell: 1, reverse: 0, mode: 0, harmony: 1, grindSel: 0, grainSel: 1 } },
  { at: 32,  len: 16, name: 'BUILD',    values: { dust: 1, space: 1, breakOn: 1, drums: 0, hat: 1, click: 0, sub: 1, bassOn: 1, bass: 1, pads: 1, bell: 0, reverse: 0, mode: 1, harmony: 0, grindSel: 1, grainSel: 1 } },
  { at: 48,  len: 24, name: 'JUNGLE',   values: { dust: 1, space: 1, breakOn: 1, drums: 0, hat: 1, click: 0, sub: 1, bassOn: 1, bass: 1, pads: 1, bell: 1, reverse: 0, mode: 1, harmony: 0, grindSel: 0, grainSel: 1 } },
  { at: 72,  len: 24, name: 'TECHSTEP', values: { dust: 1, space: 1, breakOn: 1, drums: 1, hat: 1, click: 0, sub: 1, bassOn: 1, bass: 0, pads: 1, bell: 0, reverse: 0, mode: 2, harmony: 0, grindSel: 1, grainSel: 2 } },
  { at: 96,  len: 16, name: 'BREAK',    values: { dust: 1, space: 1, breakOn: 0, drums: 0, hat: 0, click: 0, sub: 1, bassOn: 0, bass: 0, pads: 1, bell: 1, reverse: 1, mode: 0, harmony: 1, grindSel: 0, grainSel: 1 } },
  { at: 112, len: 16, name: 'GLITCH',   values: { dust: 1, space: 1, breakOn: 1, drums: 2, hat: 0, click: 1, sub: 1, bassOn: 1, bass: 0, pads: 1, bell: 0, reverse: 0, mode: 3, harmony: 0, grindSel: 2, grainSel: 2 } },
  { at: 128, len: 16, name: 'OUTRO',    values: { dust: 1, space: 1, breakOn: 0, drums: 0, hat: 0, click: 0, sub: 1, bassOn: 0, bass: 0, pads: 1, bell: 1, reverse: 0, mode: 0, harmony: 1, grindSel: 0, grainSel: 1 } },
]

const AUTOMATION = [
  { path: 'breaks.apache.cut', points: [[0, 1], [32, 0.8], [48, 1.05], [72, 0.9], [96, 0.6], [128, 0.4], [144, 0.3]] },
  { path: 'low.grinder.cut',   points: [[16, 0.9], [48, 1.2], [96, 0.7], [112, 1.5], [144, 0.3]] },
  { path: 'low.coil.cut',      points: [[32, 0.9], [48, 1.1], [96, 0.6], [144, 0.4]] },
  { path: 'leads.bell.cut',    points: [[16, 0.7], [48, 1], [96, 1.2], [128, 0.7], [144, 0.4]] },
  { path: 'pads.void.cut',     points: [[0, 0.6], [32, 0.9], [72, 0.8], [96, 1.1], [128, 0.6], [144, 0.4]] },
  { path: 'atmos.dust.cut',    points: [[0, 0.7], [32, 1], [96, 1.1], [128, 0.7], [144, 0.4]] },
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
const harmonyAuto = autoSwitch('harmony', harmony)
const grindAuto = autoSwitch('grindSel', grind)
const grainAuto = autoSwitch('grainSel', grain)
const drumsAuto = autoSwitch('drums', drums)
const bassAuto = autoSwitch('bass', bass)
const hA = harmonyAuto.fmap((v) => (v === 0 ? 1 : 0))
const hB = harmonyAuto.fmap((v) => (v === 1 ? 1 : 0))
const gLong = grindAuto.fmap((v) => (v === 0 ? 1 : 0))
const gDrift = grindAuto.fmap((v) => (v === 1 ? 1 : 0))
const gStutter = grindAuto.fmap((v) => (v === 2 ? 1 : 0))
const g4 = grainAuto.fmap((v) => (v === 0 ? 1 : 0))
const g8 = grainAuto.fmap((v) => (v === 1 ? 1 : 0))
const g16 = grainAuto.fmap((v) => (v === 2 ? 1 : 0))
const bApache = drumsAuto.fmap((v) => (v === 0 ? 1 : 0))
const bDist = drumsAuto.fmap((v) => (v === 1 ? 1 : 0))
const bGrain = drumsAuto.fmap((v) => (v === 2 ? 1 : 0))
const bGrinder = bassAuto.fmap((v) => (v === 0 ? 1 : 0))
const bCoil = bassAuto.fmap((v) => (v === 1 ? 1 : 0))
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
const gateAnd = (a, b) => a.mul(b).fmap((v) => v > 0.001)
const phrase = (bars) => m('<' + bars.join(' ') + '>')

// ── МАТЕРИАЛ ────────────────────────────────────────────────────
const ROOT = phrase([
  '[d1]', '[eb1]', '[d1]', '[bb1]',
  '[g1]', '[a1]', '[d1]', '[eb1]',
])
const PAD_A = phrase([
  '[d3,f3,a3]',
  '[eb3,g3,bb3]',
  '[d3,f3,a3]',
  '[bb2,d3,f3]',
  '[g2,bb2,d3]',
  '[a2,c3,eb3]',
  '[d3,f3,a3]',
  '[eb3,g3,bb3]',
])
const PAD_B = phrase([
  '[d3,a3]', '[eb3,bb3]', '[d3,a3]', '[bb2,f3]',
  '[g2,d3]', '[a2,eb3]', '[d3,a3]', '[eb3,bb3]',
])
const COIL = phrase([
  '[d2]', '[eb2]', '[d2]', '[bb1]',
  '[g1]', '[a1]', '[d2]', '[eb2]',
])
const GRIND_VOID = phrase([
  '[d2]', '[ab2]', '[eb2]', '[a1]',
  '[d2]', '[bb1]', '[e2]', '[eb2]',
])
const GRIND_JUNGLE = phrase([
  '[d2@2 ab2@2]', '[eb2@2 a2@2]', '[d2@2 ~]', '[bb1@2 e2@2]',
  '[g1@2 db2@2]', '[a1@2 eb2@2]', '[d2@2 ab2@2]', '[eb2@2 a2@2]',
])
const GRIND_TECH = phrase([
  '[d2@3 ab2@1]', '[eb2@3 a2@1]', '[d2@2 ~ ab2@2]', '[bb1@3 e2@1]',
  '[g1@3 db2@1]', '[a1@3 eb2@1]', '[d2@3 ab2@1]', '[eb2@3 a2@1]',
])
const GRIND_GLITCH = phrase([
  '[d2@2 ~ ab2@2]', '[eb2@2 a2@2]', '[d2@1 ab2@3]', '[bb1@2 e2@2]',
  '[g1@2 db2@2]', '[a1@1 eb2@3]', '[d2@2 ab2@2]', '[eb2@1 a2@3]',
])
const BELL = phrase([
  '[~ ~ a4 ~ ~ ~ ~ ~]', '[~ ~ bb4 ~ ~ ~ ~ ~]',
  '[~ ~ d5 ~ ~ ~ ~ ~]', '[~ ~ f4 ~ ~ ~ ~ ~]',
  '[~ ~ g4 ~ ~ ~ ~ ~]', '[~ ~ a4 ~ ~ ~ ~ ~]',
  '[~ ~ d5 ~ ~ ~ ~ ~]', '[~ ~ eb5 ~ ~ ~ ~ ~]',
])
const mVoid = modeAuto.fmap((v) => (v === 0 ? 1 : 0))
const mJungle = modeAuto.fmap((v) => (v === 1 ? 1 : 0))
const mTech = modeAuto.fmap((v) => (v === 2 ? 1 : 0))
const mGlitch = modeAuto.fmap((v) => (v === 3 ? 1 : 0))
const grindNotes = (on) => stack(
  note(GRIND_VOID).gain(mVoid.mul(on)),
  note(GRIND_JUNGLE).gain(mJungle.mul(on)),
  note(GRIND_TECH).gain(mTech.mul(on)),
  note(GRIND_GLITCH).gain(mGlitch.mul(on)),
)
const hatPat = m('x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~')
const hatAcc = m('[1 .35 .6 .35]*4')
const clickPat = m('~ ~ x ~ x ~ ~ x ~ x ~ ~ x ~ ~ x')

// ── АТМОСФЕРА ───────────────────────────────────────────────────
$: s('noise2:0')
  .gain(atmos.dust.vol.mul(tlOr('dust')))
  .lpf(atmos.dust.cut.mul(autoAt('atmos.dust.cut'))).hpf(atmos.dust.hpf).lpq(0.9).ftype('24db')
  .lpdepth(atmos.dust.lfo).lpsync(0.0625).lpdc(0)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('dust')).filter(audible)

$: s('space:0')
  .loopAt(8)
  .gain(atmos.space.vol.mul(tlOr('space')))
  .lpf(atmos.space.cut).hpf(atmos.space.hpf)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(32).range(0.3, 0.7))
  .mask(gateOf('space')).filter(audible)

// ── БРЕЙК: всегда ровно один ────────────────────────────────────
$: s('apache')
  .loopAt(2)
  .gain(breaks.apache.vol.mul(tlOr('breakOn')).mul(bApache))
  .hpf(breaks.apache.hpf).lpf(breaks.apache.cut.mul(autoAt('breaks.apache.cut')))
  .crush(breaks.apache.crush)
  .room(breaks.apache.room).roomsize(fx.reverb.size)
  .mask(gateAnd(gateOf('breakOn'), bApache)).filter(audible)

$: s('dist:4')
  .loopAt(2)
  .gain(breaks.dist.vol.mul(tlOr('breakOn')).mul(bDist))
  .hpf(breaks.dist.hpf).lpf(breaks.dist.cut)
  .crush(breaks.dist.crush)
  .room(breaks.dist.room).roomsize(fx.reverb.size)
  .mask(gateAnd(gateOf('breakOn'), bDist)).filter(audible)

const grainChain = (n, on) => s('funkydrummer')
  .chop(n)
  .gain(breaks.grain.vol.mul(on).mul(tlOr('breakOn')))
  .hpf(breaks.grain.hpf).lpf(breaks.grain.cut)
  .crush(breaks.grain.crush)
  .speed(breaks.grain.speed)
  .nudge(rand.sub(0.5).mul(breaks.grain.jitter))
  .degradeBy(breaks.grain.drop)
  .room(breaks.grain.room).roomsize(fx.reverb.size)
  .mask(gateAnd(gateAnd(gateOf('breakOn'), bGrain), on)).filter(audible)

$: grainChain(4, g4)
$: grainChain(8, g8)
$: grainChain(16, g16)

// ── ПЕРКУССИЯ ───────────────────────────────────────────────────
$: s('hardcore:0*16')
  .struct(hatPat)
  .gain(perc.hat.vol.mul(hatAcc).mul(tlOr('hat')))
  .lpf(perc.hat.cut).hpf(700)
  .decay(perc.hat.decay).sustain(0)
  .room(perc.hat.room).roomsize(fx.reverb.size)
  .mask(gateOf('hat')).filter(audible)

$: s('glitch*16')
  .struct(clickPat)
  .n(m('<2 5 6 7>'))
  .gain(perc.click.vol.mul(tlOr('click')))
  .lpf(perc.click.cut)
  .crush(perc.click.crush)
  .decay(perc.click.decay).sustain(0)
  .room(perc.click.room).roomsize(fx.reverb.size)
  .mask(gateOf('click')).filter(audible)

// ── БАС: саб + ровно один средний ───────────────────────────────
$: note(ROOT)
  .s('sine')
  .gain(low.sub.vol.mul(tlOr('sub')))
  .lpf(low.sub.cut).lpq(1)
  .shape(0.2)
  .attack(0.004).decay(low.sub.decay).sustain(0.75).release(0.2)
  .orbit(2)
  .mask(gateOf('sub')).filter(audible)

$: grindNotes(low.grinder.vol.mul(tlOr('bassOn')).mul(bGrinder).mul(gLong))
  .s('sine').fm(low.grinder.fm).fmh(low.grinder.ratio)
  .glide(low.grinder.glide.mul(m('<1 1 1 0 1 1 1 0>')))
  .lpf(low.grinder.cut.mul(autoAt('low.grinder.cut'))).lpq(low.grinder.res).ftype('ladder').drive(low.grinder.drive)
  .lpenv(2.2)
  .lpa(0.006).lpd(0.18).lpsustain(0.4)
  .lpdepth(low.grinder.lfo).lpsync(0.5).lpdc(1)
  .shape(0.15)
  .distort(low.grinder.dist).distortvol(0.5)
  .attack(low.grinder.attack).decay(0.5).sustain(0.75).release(low.grinder.release)
  .orbit(2)
  .mask(gateAnd(gateAnd(gateOf('bassOn'), bGrinder), gLong)).filter(audible)

$: grindNotes(low.grinder.vol.mul(tlOr('bassOn')).mul(bGrinder).mul(gDrift))
  .s('sine')
  .fm(low.grinder.fm.add(perlin.slow(8).mul(low.grinder.fmMod)))
  .fmh(low.grinder.ratio)
  .glide(low.grinder.glide.mul(m('<1 1 1 0 1 1 1 0>')))
  .sometimesBy(low.grinder.chance, (x) => x.add(note('12')))
  .nudge(rand.sub(0.5).mul(low.grinder.jitter))
  .lpf(low.grinder.cut.mul(autoAt('low.grinder.cut')).add(perlin.slow(8).mul(180)))
  .lpq(low.grinder.res).ftype('ladder').drive(low.grinder.drive)
  .lpenv(2.2)
  .lpa(0.006).lpd(0.2).lpsustain(0.4)
  .lpdepth(low.grinder.lfo).lpsync(0.5).lpdc(1)
  .shape(0.15)
  .distort(low.grinder.dist).distortvol(0.5)
  .attack(low.grinder.attack.mul(0.6)).decay(0.5).sustain(0.7).release(low.grinder.release.mul(0.8))
  .orbit(2)
  .mask(gateAnd(gateAnd(gateOf('bassOn'), bGrinder), gDrift)).filter(audible)

$: grindNotes(low.grinder.vol.mul(tlOr('bassOn')).mul(bGrinder).mul(gStutter))
  .s('sine').fm(low.grinder.fm).fmh(low.grinder.ratio)
  .sometimesBy(low.grinder.chance, (x) => x.ply(2))
  .degradeBy(low.grinder.drop)
  .nudge(rand.sub(0.5).mul(low.grinder.jitter))
  .lpf(low.grinder.cut.mul(autoAt('low.grinder.cut'))).lpq(low.grinder.res).ftype('ladder').drive(low.grinder.drive)
  .lpenv(2.2).lpa(0.004).lpd(0.14).lpsustain(0.3)
  .crush(perlin.range(10, 14))
  .shape(0.2)
  .distort(low.grinder.dist).distortvol(0.5)
  .attack(low.grinder.attack.mul(0.35)).decay(0.3).sustain(0.55).release(low.grinder.release.mul(0.5))
  .orbit(2)
  .mask(gateAnd(gateAnd(gateOf('bassOn'), bGrinder), gStutter)).filter(audible)

$: note(COIL)
  .s('sawtooth').unison(2).detune(low.coil.det)
  .vowel('a')
  .gain(low.coil.vol.mul(tlOr('bassOn')).mul(bCoil))
  .lpf(low.coil.cut.mul(autoAt('low.coil.cut'))).lpq(low.coil.res).ftype('ladder').drive(low.coil.drive)
  .lpdepth(low.coil.lfo).lpsync(0.25).lpdc(1)
  .decay(0.4).sustain(0.8).release(0.3)
  .room(low.coil.room).roomsize(fx.reverb.size)
  .orbit(2)
  .mask(gateAnd(gateOf('bassOn'), bCoil)).filter(audible)

// ── ГАРМОНИЯ ────────────────────────────────────────────────────
$: note(PAD_A)
  .s('sawtooth').partials([1, 0.35])
  .unison(1).detune(pads.void.det)
  .gain(pads.void.vol.mul(tlOr('pads')).mul(hA))
  .lpf(pads.void.cut.mul(autoAt('pads.void.cut'))).hpf(pads.void.hpf).lpq(pads.void.q).ftype('24db')
  .lpdepth(pads.void.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.25)
  .shape(pads.void.grit)
  .attack(1.5).decay(2).sustain(0.85).release(2.5)
  .room(verb.mul(0.7)).roomsize(fx.reverb.size)
  .mask(gateAnd(gateOf('pads'), hA)).filter(audible)

$: s('padlong:0')
  .loopAt(8)
  .gain(pads.tape.vol.mul(tlOr('pads')).mul(hB))
  .lpf(pads.tape.cut).hpf(pads.tape.hpf)
  .crush(pads.tape.crush)
  .room(verb.mul(0.7)).roomsize(fx.reverb.size)
  .pan(sine.slow(64).range(0.3, 0.7))
  .mask(gateAnd(gateOf('pads'), hB)).filter(audible)

$: note(PAD_B)
  .s('sawtooth').unison(1).detune(0.04)
  .gain(pads.drone.vol.mul(tlOr('pads')).mul(hB))
  .lpf(pads.drone.cut).hpf(40).ftype('24db').lpq(2)
  .attack(2).decay(2).sustain(0.9).release(4)
  .room(verb.mul(0.7)).roomsize(fx.reverb.size)
  .mask(gateAnd(gateOf('pads'), hB)).filter(audible)

// ── ЛИД ─────────────────────────────────────────────────────────
$: note(BELL)
  .s('sine').fm(leads.bell.fm).fmh(leads.bell.ratio)
  .gain(leads.bell.vol.mul(tlOr('bell')))
  .lpf(leads.bell.cut.mul(autoAt('leads.bell.cut'))).hpf(200).lpq(2)
  .decay(leads.bell.decay).sustain(0).release(1.2)
  .delay(leads.bell.echo).delaytime(0.1875).delayfeedback(0.3)
  .room(verb.mul(0.8)).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.3, 0.7))
  .mask(gateOf('bell')).filter(audible)

// ── ЭФФЕКТ ──────────────────────────────────────────────────────
$: s('noise2:0')
  .speed(-1)
  .struct(m('<~ ~ ~ ~ ~ ~ ~ x>'))
  .gain(fx.reverse.vol.mul(tlOr('reverse')))
  .lpf(fx.reverse.cut).hpf(200)
  .attack(0.3).release(0.2)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('reverse')).filter(audible)
