// DARK TECHSTEP 02 · v3 · 172 BPM · 144 такта · dark jungle / IDM
// v2 (02-dark-techstep-v2.js) и v1 не тронуты — референсы. v3 собирает
// тот же материал (Apache/Funky, breaks165, dist, grain/chop, FM-гринд,
// Reese, кластерный пад, тритоновый колокол) в композицию: TIMELINE,
// SONG/LOOP/HOLD, gateOf на каждом слое, постоянные уровни, автоматика
// срезов. Гармония прежняя: Dm7 → Ebmaj7 → Dm7 → Bb / Gm7 → A°7.
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
  },
}

const play = slider(1, 0, 2, 1)
const mode = slider(0, 0, 3, 1)
const harmony = slider(0, 0, 1, 1)
const grind = slider(0, 0, 2, 1)
const grain = slider(1, 0, 2, 1)
const holdBar = slider(0, 0, 143, 1)
const verb = slider(0.6, 0, 1, 0.01)
const duck = slider(0.8, 0, 1, 0.01)

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
      name: 'Apache',
      vol: slider(0.55, 0, 1, 0.01),
      cut: slider(4200, 200, 16000, 100),
      hpf: slider(60, 20, 500, 10),
      crush: slider(11, 1, 16, 0.5),
      shape: slider(0.25, 0, 0.95, 0.01),
      room: slider(0.12, 0, 1, 0.01),
    },
    funk: {
      name: 'Funky Drummer',
      vol: slider(0.35, 0, 0.8, 0.01),
      cut: slider(5000, 300, 16000, 100),
      hpf: slider(80, 20, 500, 10),
      crush: slider(13, 1, 16, 0.5),
    },
    cut: {
      name: 'Breaks165 cut',
      vol: slider(0.08, 0, 0.9, 0.01),
      cut: slider(7000, 500, 16000, 100),
      hpf: slider(100, 20, 800, 10),
      crush: slider(10, 1, 16, 0.5),
    },
    dist: {
      name: 'Distorted break',
      vol: slider(0.38, 0, 0.8, 0.01),
      cut: slider(3000, 200, 12000, 50),
      hpf: slider(80, 20, 500, 10),
      crush: slider(8, 1, 16, 0.5),
    },
    grain: {
      name: 'Grain chop',
      vol: slider(0.09, 0, 0.9, 0.01),
      cut: slider(7000, 300, 16000, 100),
      hpf: slider(100, 20, 800, 10),
      crush: slider(10, 1, 16, 0.5),
      speed: slider(1, 0.5, 1.5, 0.01),
      rev: slider(0.15, 0, 0.8, 0.01),
      jitter: slider(0.01, 0, 0.05, 0.001),
      drop: slider(0.1, 0, 0.7, 0.01),
      room: slider(0.15, 0, 1, 0.01),
    },
  },
  drums: {
    kick: {
      name: 'Industrial kick',
      vol: slider(0.3, 0, 0.5, 0.01),
      cut: slider(650, 80, 5000, 10),
      shape: slider(0.7, 0, 0.95, 0.01),
      crush: slider(13, 1, 16, 0.5),
      decay: slider(0.4, 0.1, 2, 0.01),
    },
    snare: {
      name: 'Metal snare',
      vol: slider(0.24, 0, 1, 0.01),
      cut: slider(5200, 800, 14000, 100),
      decay: slider(0.16, 0.03, 0.7, 0.01),
      air: slider(0.08, 0, 0.8, 0.01),
    },
    ghost: {
      name: 'Ghost snare',
      vol: slider(0.1, 0, 0.6, 0.01),
      cut: slider(4200, 500, 12000, 50),
      decay: slider(0.1, 0.02, 0.4, 0.01),
    },
    hat: {
      name: 'Hardcore hats',
      vol: slider(0.1, 0, 0.8, 0.01),
      cut: slider(8200, 800, 16000, 100),
    },
    ohat: {
      name: 'Open hats',
      vol: slider(0.1, 0, 0.6, 0.01),
      cut: slider(6000, 800, 16000, 100),
    },
    metal: {
      name: 'Metal hits',
      vol: slider(0.15, 0, 0.7, 0.01),
      cut: slider(5000, 300, 14000, 100),
      echo: slider(0.25, 0, 0.8, 0.01),
    },
    click: {
      name: 'Glitch clicks',
      vol: slider(0.1, 0, 0.6, 0.01),
      cut: slider(9000, 800, 16000, 100),
      crush: slider(7, 1, 16, 0.5),
    },
    crash: {
      name: 'Crash',
      vol: slider(0.22, 0, 0.7, 0.01),
      cut: slider(7000, 1000, 16000, 100),
    },
  },
  bass: {
    abyss: {
      name: 'Abyss sub',
      vol: slider(0.55, 0, 1.2, 0.01),
      cut: slider(90, 40, 300, 5),
      decay: slider(0.8, 0.1, 3, 0.01),
    },
    grinder: {
      name: 'FM grinder',
      vol: slider(0.3, 0, 1, 0.01),
      cut: slider(620, 80, 3000, 10),
      res: slider(9, 0, 26, 0.5),
      fm: slider(3.4, 0.2, 8, 0.1),
      ratio: slider(1.51, 0.5, 4, 0.01),
      drive: slider(1.8, 0.2, 2.6, 0.01),
      dist: slider(0.35, 0, 0.9, 0.01),
      decay: slider(0.3, 0.05, 1.5, 0.01),
      glide: slider(0.04, 0, 0.15, 0.001),
      attack: slider(0.8, 0.01, 2, 0.01),
      release: slider(2, 0.1, 4, 0.01),
      fmMod: slider(0.8, 0, 3, 0.01),
      lfo: slider(1.2, 0, 8, 0.1),
      chance: slider(0.3, 0, 1, 0.01),
      jitter: slider(0.02, 0, 0.1, 0.001),
      drop: slider(0.1, 0, 0.5, 0.01),
    },
    coil: {
      name: 'Coil Reese',
      vol: slider(0.2, 0, 0.8, 0.01),
      cut: slider(700, 100, 4000, 10),
      res: slider(12, 0, 26, 0.5),
      det: slider(0.22, 0.02, 0.6, 0.01),
      drive: slider(1.3, 0.2, 2.6, 0.01),
      lfo: slider(1.6, 0, 8, 0.1),
    },
    wraith: {
      name: 'Wraith scream',
      vol: slider(0.1, 0, 0.6, 0.01),
      cut: slider(4000, 300, 14000, 50),
      fm: slider(6, 1, 12, 0.1),
      ratio: slider(2.41, 1, 4, 0.01),
      decay: slider(0.1, 0.02, 1, 0.01),
    },
  },
  pads: {
    void: {
      name: 'Void cluster',
      vol: slider(0.12, 0, 0.7, 0.01),
      cut: slider(1100, 80, 6000, 10),
      hpf: slider(70, 20, 500, 10),
      q: slider(2, 0, 20, 0.5),
      lfo: slider(0.6, 0, 6, 0.1),
      det: slider(0.18, 0, 0.6, 0.01),
      grit: slider(0.18, 0, 0.6, 0.01),
    },
    tape: {
      name: 'Tape pad',
      vol: slider(0.18, 0, 0.6, 0.01),
      cut: slider(1400, 80, 8000, 10),
      hpf: slider(80, 20, 500, 10),
      crush: slider(11, 1, 16, 0.5),
    },
    drone: {
      name: 'Drone',
      vol: slider(0.16, 0, 0.7, 0.01),
      cut: slider(420, 40, 3000, 10),
    },
  },
  leads: {
    bell: {
      name: 'Metal bell',
      vol: slider(0.24, 0, 0.8, 0.01),
      cut: slider(5000, 300, 14000, 50),
      fm: slider(4.2, 0.5, 12, 0.1),
      ratio: slider(2.76, 0.5, 4, 0.01),
      decay: slider(0.5, 0.05, 2, 0.01),
      echo: slider(0.5, 0, 0.9, 0.01),
    },
    pulse: {
      name: 'IDM pulse',
      vol: slider(0.1, 0, 0.6, 0.01),
      cut: slider(9000, 500, 16000, 100),
      crush: slider(6, 1, 16, 0.5),
      decay: slider(0.06, 0.01, 0.4, 0.01),
      echo: slider(0.35, 0, 0.9, 0.01),
    },
  },
  fx: {
    impact: {
      name: 'Impact',
      vol: slider(0.3, 0, 0.7, 0.01),
      cut: slider(120, 40, 600, 5),
    },
    reverse: {
      name: 'Reverse swell',
      vol: slider(0.2, 0, 0.5, 0.01),
      cut: slider(2500, 200, 12000, 50),
    },
    reverb: {
      size: slider(14, 1, 20, 0.5),
    },
  },
  atmos: {
    dust: {
      name: 'Dust',
      vol: slider(0.1, 0, 0.4, 0.01),
      cut: slider(500, 80, 6000, 20),
      hpf: slider(100, 20, 1200, 10),
      lfo: slider(1.2, 0, 8, 0.1),
    },
    space: {
      name: 'Space',
      vol: slider(0.06, 0, 0.4, 0.01),
      cut: slider(900, 100, 6000, 20),
      hpf: slider(120, 20, 1000, 10),
    },
  },
}
const { breaks, drums, bass, pads, leads, fx, atmos } = instruments

const TIMELINE = [
  { at: 0,   len: 16, name: 'INTRO',    values: { dust: 1, space: 1, apache: 0, funk: 0, cut: 0, dist: 0, grainOn: 0, kick: 0, snare: 0, ghost: 0, hat: 0, ohat: 0, metal: 0, click: 0, crash: 0, air: 0, abyss: 0, grinder: 0, coil: 0, wraith: 0, pads: 1, bell: 0, pulse: 0, impact: 0, reverse: 0, mode: 0, harmony: 1, grindSel: 0, grainSel: 1 } },
  { at: 16,  len: 16, name: 'VOID',     values: { dust: 1, space: 1, apache: 0, funk: 0, cut: 0, dist: 0, grainOn: 0, kick: 1, snare: 1, ghost: 0, hat: 1, ohat: 0, metal: 0, click: 0, crash: 0, air: 0, abyss: 1, grinder: 1, coil: 0, wraith: 0, pads: 1, bell: 1, pulse: 0, impact: 0, reverse: 0, mode: 0, harmony: 1, grindSel: 0, grainSel: 1 } },
  { at: 32,  len: 16, name: 'BUILD',    values: { dust: 1, space: 1, apache: 1, funk: 0, cut: 0, dist: 0, grainOn: 0, kick: 1, snare: 1, ghost: 0, hat: 1, ohat: 1, metal: 1, click: 0, crash: 1, air: 0, abyss: 1, grinder: 1, coil: 1, wraith: 0, pads: 1, bell: 1, pulse: 0, impact: 0, reverse: 0, mode: 1, harmony: 0, grindSel: 1, grainSel: 1 } },
  { at: 48,  len: 24, name: 'JUNGLE',   values: { dust: 1, space: 1, apache: 1, funk: 1, cut: 1, dist: 0, grainOn: 1, kick: 1, snare: 1, ghost: 1, hat: 1, ohat: 1, metal: 1, click: 0, crash: 0, air: 1, abyss: 1, grinder: 1, coil: 1, wraith: 0, pads: 1, bell: 1, pulse: 0, impact: 0, reverse: 0, mode: 1, harmony: 0, grindSel: 0, grainSel: 1 } },
  { at: 72,  len: 24, name: 'TECHSTEP', values: { dust: 1, space: 1, apache: 1, funk: 0, cut: 1, dist: 1, grainOn: 0, kick: 1, snare: 1, ghost: 0, hat: 1, ohat: 1, metal: 1, click: 0, crash: 1, air: 0, abyss: 1, grinder: 1, coil: 0, wraith: 1, pads: 1, bell: 0, pulse: 0, impact: 0, reverse: 0, mode: 2, harmony: 0, grindSel: 1, grainSel: 2 } },
  { at: 96,  len: 16, name: 'BREAK',    values: { dust: 1, space: 1, apache: 0, funk: 0, cut: 0, dist: 0, grainOn: 0, kick: 0, snare: 0, ghost: 0, hat: 0, ohat: 0, metal: 0, click: 0, crash: 0, air: 1, abyss: 1, grinder: 0, coil: 0, wraith: 0, pads: 1, bell: 1, pulse: 0, impact: 0, reverse: 1, mode: 0, harmony: 1, grindSel: 0, grainSel: 1 } },
  { at: 112, len: 16, name: 'GLITCH',   values: { dust: 1, space: 1, apache: 0, funk: 0, cut: 1, dist: 0, grainOn: 1, kick: 1, snare: 1, ghost: 1, hat: 1, ohat: 0, metal: 1, click: 1, crash: 0, air: 0, abyss: 1, grinder: 1, coil: 0, wraith: 1, pads: 1, bell: 0, pulse: 1, impact: 0, reverse: 0, mode: 3, harmony: 0, grindSel: 2, grainSel: 2 } },
  { at: 128, len: 16, name: 'OUTRO',    values: { dust: 1, space: 1, apache: 0, funk: 0, cut: 0, dist: 0, grainOn: 0, kick: 0, snare: 0, ghost: 0, hat: 0, ohat: 0, metal: 0, click: 0, crash: 0, air: 0, abyss: 1, grinder: 0, coil: 0, wraith: 0, pads: 1, bell: 1, pulse: 0, impact: 0, reverse: 0, mode: 0, harmony: 1, grindSel: 0, grainSel: 1 } },
]

const AUTOMATION = [
  { path: 'breaks.apache.cut', points: [[0, 1], [32, 0.7], [48, 1], [96, 0.6], [128, 0.5], [144, 0.3]] },
  { path: 'bass.grinder.cut',  points: [[16, 0.8], [48, 1.1], [72, 1.4], [96, 0.7], [112, 1.8], [128, 0.6], [144, 0.2]] },
  { path: 'bass.coil.cut',     points: [[32, 0.8], [48, 1.2], [96, 0.6], [112, 1.5], [144, 0.3]] },
  { path: 'leads.bell.cut',    points: [[16, 0.6], [48, 1], [96, 1.3], [128, 0.7], [144, 0.3]] },
  { path: 'pads.void.cut',     points: [[0, 0.5], [16, 0.8], [48, 1], [72, 0.9], [96, 1.2], [128, 0.6], [144, 0.3]] },
  { path: 'drums.metal.cut',   points: [[32, 0.7], [48, 1], [72, 1.3], [96, 0.8], [112, 1.5], [128, 0.6], [144, 0.3]] },
  { path: 'atmos.dust.cut',    points: [[0, 0.6], [32, 1], [96, 1.2], [128, 0.7], [144, 0.4]] },
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
const hA = harmonyAuto.fmap((v) => (v === 0 ? 1 : 0))
const hB = harmonyAuto.fmap((v) => (v === 1 ? 1 : 0))
const gLong = grindAuto.fmap((v) => (v === 0 ? 1 : 0))
const gDrift = grindAuto.fmap((v) => (v === 1 ? 1 : 0))
const gStutter = grindAuto.fmap((v) => (v === 2 ? 1 : 0))
const g4 = grainAuto.fmap((v) => (v === 0 ? 1 : 0))
const g8 = grainAuto.fmap((v) => (v === 1 ? 1 : 0))
const g16 = grainAuto.fmap((v) => (v === 2 ? 1 : 0))
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
  '[d3,f3,a3,c4]',
  '[eb3,g3,bb3,d4]',
  '[d3,f3,a3,c4]',
  '[bb2,d3,f3,a3]',
  '[g2,bb2,d3,f3]',
  '[a2,c3,eb3,g3]',
  '[d3,f3,a3,c4]',
  '[eb3,g3,bb3,d4]',
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
  '[d2@2 ab2@2]', '[eb2@2 a2@2]', '[d2@3 ~]', '[bb1@2 e2@2]',
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
  '[~ ~ a4 ~ ~ eb5 ~ ~]', '[~ ~ bb4 ~ ~ e5 ~ ~]',
  '[~ ~ d5 ~ ~ ab4 ~ ~]', '[~ ~ f4 ~ ~ b4 ~ ~]',
  '[~ ~ g4 ~ ~ db5 ~ ~]', '[~ ~ a4 ~ ~ eb5 ~ ~]',
  '[~ ~ d5 ~ ~ ab4 ~ ~]', '[~ ~ eb5 ~ ~ a4 ~ ~]',
])
const WRAITH_PAT = phrase([
  '[~ ~ ~ eb6 ~ ~ ~ ~]', '[~ ~ ~ a5 ~ ~ ~ ~]',
  '[~ ~ ~ d6 ~ ~ ~ ~]', '[~ ~ ~ ab5 ~ ~ ~ ~]',
  '[~ ~ ~ g5 ~ ~ ~ ~]', '[~ ~ ~ db6 ~ ~ ~ ~]',
  '[~ ~ ~ d6 ~ ~ ~ ~]', '[~ ~ ~ eb6 ~ ~ ~ ~]',
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

const kicks = [
  m('x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
  m('x ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~'),
  m('x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~'),
  m('x ~ ~ x ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~'),
]
const snares = [
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
  m('~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~'),
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
]
const ghosts = [
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
  m('~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x'),
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
  m('~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~'),
]
const hatsP = [
  m('x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~'),
  m('x x x x x x x x x x x x x x x x'),
  m('x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~'),
  m('x x x x x x x x x x x x x x x x'),
]
const hatAcc = [
  m('[1 .4 .7 .4]*4'),
  m('[1 .3 .6 .3]*4'),
  m('[1 .5]*8'),
  m('[1 .25 .55 .25 .8 .25 .55 .25]*2'),
]
const kickPat = modeAuto.pick(kicks)
const snarePat = modeAuto.pick(snares)
const ghostPat = modeAuto.pick(ghosts)
const hatPat = modeAuto.pick(hatsP)
const hatGain = modeAuto.pick(hatAcc)

const ohatPat = m('~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~')
const metalPat = m('~ x ~ ~ x ~ ~ ~ ~ x ~ ~ x ~ ~ ~')
const clickPat = m('~ ~ x ~ x ~ ~ x ~ x ~ ~ x ~ ~ x')
const airPat = m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~')
const crashPat = m('<x ~ ~ ~ ~ ~ ~ ~>')
const impactPat = m('<x ~ ~ ~ ~ ~ ~ ~>')
const reversePat = m('<~ ~ ~ ~ ~ ~ ~ x>')

// ── АТМОСФЕРА ───────────────────────────────────────────────────
$: s('noise2:0')
  .gain(atmos.dust.vol.mul(tlOr('dust')))
  .lpf(atmos.dust.cut.mul(autoAt('atmos.dust.cut'))).hpf(atmos.dust.hpf).lpq(0.9).ftype('24db')
  .lpdepth(atmos.dust.lfo).lpsync(0.0625).lpdc(0)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('dust')).filter(audible)

$: s('space:0')
  .loopAt(8)
  .gain(atmos.space.vol.mul(tlOr('space')))
  .lpf(atmos.space.cut).hpf(atmos.space.hpf)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(32).range(0.3, 0.7))
  .mask(gateOf('space')).filter(audible)

// ── БРЕЙКИ ──────────────────────────────────────────────────────
$: s('apache')
  .loopAt(2)
  .gain(breaks.apache.vol.mul(tlOr('apache')))
  .hpf(breaks.apache.hpf).lpf(breaks.apache.cut.mul(autoAt('breaks.apache.cut')))
  .crush(breaks.apache.crush)
  .shape(breaks.apache.shape)
  .room(breaks.apache.room).roomsize(fx.reverb.size)
  .mask(gateOf('apache')).filter(audible)

$: s('funkydrummer')
  .loopAt(2)
  .gain(breaks.funk.vol.mul(tlOr('funk')))
  .hpf(breaks.funk.hpf).lpf(breaks.funk.cut)
  .crush(breaks.funk.crush)
  .room(0.1).roomsize(fx.reverb.size)
  .mask(gateOf('funk')).filter(audible)

$: s('breaks165')
  .slice(16, m('<[0 0 2 3 0 4 5 6 0 0 8 9 0 10 11 12] [1 1 3 4 1 5 6 7 1 1 9 10 1 11 12 13]>'))
  .clip(1)
  .gain(breaks.cut.vol.mul(tlOr('cut')))
  .hpf(breaks.cut.hpf).lpf(breaks.cut.cut)
  .crush(breaks.cut.crush)
  .sometimesBy(0.18, (x) => x.speed(-1))
  .room(0.15).roomsize(fx.reverb.size)
  .mask(gateOf('cut')).filter(audible)

$: s('dist:4')
  .loopAt(2)
  .gain(breaks.dist.vol.mul(tlOr('dist')))
  .hpf(breaks.dist.hpf).lpf(breaks.dist.cut)
  .crush(breaks.dist.crush)
  .shape(0.4)
  .room(0.1).roomsize(fx.reverb.size)
  .mask(gateOf('dist')).filter(audible)

const grainChain = (n, on) => s('funkydrummer')
  .chop(n)
  .gain(breaks.grain.vol.mul(on).mul(tlOr('grainOn')))
  .hpf(breaks.grain.hpf).lpf(breaks.grain.cut)
  .crush(breaks.grain.crush)
  .speed(breaks.grain.speed)
  .sometimesBy(breaks.grain.rev, (x) => x.speed(breaks.grain.speed.mul(-1)))
  .nudge(rand.sub(0.5).mul(breaks.grain.jitter))
  .degradeBy(breaks.grain.drop)
  .room(breaks.grain.room).roomsize(fx.reverb.size)
  .mask(gateAnd(gateOf('grainOn'), on)).filter(audible)

$: grainChain(4, g4)
$: grainChain(8, g8)
$: grainChain(16, g16)

// ── УДАРНЫЕ ─────────────────────────────────────────────────────
$: s('hardcore:4*16')
  .struct(kickPat)
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .lpf(drums.kick.cut).lpq(1)
  .shape(drums.kick.shape)
  .crush(drums.kick.crush)
  .decay(drums.kick.decay).sustain(0).release(0.08)
  .duckorbit(2).duckdepth(duck).duckattack(0.01)
  .mask(gateOf('kick')).filter(audible)

$: s('hardcore:10*16')
  .struct(snarePat)
  .gain(drums.snare.vol.mul(tlOr('snare')))
  .lpf(drums.snare.cut).hpf(180)
  .decay(drums.snare.decay).sustain(0).release(0.08)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('snare')).filter(audible)

$: s('hardcore:11*16')
  .struct(ghostPat)
  .gain(drums.ghost.vol.mul(tlOr('ghost')))
  .lpf(drums.ghost.cut).hpf(200)
  .decay(drums.ghost.decay).sustain(0).release(0.05)
  .room(0.2).roomsize(fx.reverb.size)
  .mask(gateOf('ghost')).filter(audible)

$: s('hardcore:0*16')
  .struct(hatPat)
  .gain(drums.hat.vol.mul(hatGain).mul(tlOr('hat')))
  .lpf(drums.hat.cut).hpf(500)
  .sometimesBy(0.14, (x) => x.ply(2))
  .lastOf(4, (x) => x.ply(2))
  .degradeBy(0.04)
  .mask(gateOf('hat')).filter(audible)

$: s('hardcore:6*16')
  .struct(ohatPat)
  .gain(drums.ohat.vol.mul(tlOr('ohat')))
  .lpf(drums.ohat.cut)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('ohat')).filter(audible)

$: s('industrial*16')
  .struct(metalPat)
  .n(m('<0 5 12 20 27 3>'))
  .gain(drums.metal.vol.mul(tlOr('metal')))
  .lpf(drums.metal.cut.mul(autoAt('drums.metal.cut'))).hpf(300)
  .speed(rand.range(0.7, 1.3))
  .sometimesBy(0.3, (x) => x.ply(2))
  .pan(rand.mul(1.6).sub(0.8))
  .delay(drums.metal.echo).delaytime(0.1875).delayfeedback(0.35)
  .room(0.3).roomsize(fx.reverb.size)
  .mask(gateOf('metal')).filter(audible)

$: s('glitch*16')
  .struct(clickPat)
  .n(m('<2 5 6 7>'))
  .gain(drums.click.vol.mul(tlOr('click')))
  .lpf(drums.click.cut)
  .crush(drums.click.crush)
  .sometimesBy(0.4, (x) => x.ply(2))
  .speed(rand.range(0.6, 1.4))
  .pan(rand.mul(1.8).sub(0.9))
  .room(0.15).roomsize(fx.reverb.size)
  .mask(gateOf('click')).filter(audible)

$: s('hardcore:2')
  .struct(crashPat)
  .gain(drums.crash.vol.mul(tlOr('crash')))
  .lpf(drums.crash.cut).hpf(2000)
  .decay(0.9).sustain(0)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('crash')).filter(audible)

$: s('noise2:0*16')
  .struct(airPat)
  .gain(drums.snare.air.mul(tlOr('air')))
  .lpf(9000).hpf(1500)
  .decay(0.05).sustain(0)
  .pan(rand.mul(0.8).sub(0.4))
  .room(0.2).roomsize(fx.reverb.size)
  .mask(gateOf('air')).filter(audible)

// ── БАС ─────────────────────────────────────────────────────────
$: note(ROOT)
  .s('sine')
  .gain(bass.abyss.vol.mul(tlOr('abyss')))
  .lpf(bass.abyss.cut).lpq(1)
  .shape(0.35)
  .attack(0.004).decay(bass.abyss.decay).sustain(0.75).release(0.2)
  .orbit(2)
  ._pianoroll()
  .mask(gateOf('abyss')).filter(audible)

$: grindNotes(bass.grinder.vol.mul(tlOr('grinder')).mul(gLong))
  .s('sine').fm(bass.grinder.fm).fmh(bass.grinder.ratio)
  .glide(bass.grinder.glide.mul(m('<1 1 1 0 1 1 1 0>')))
  .lpf(bass.grinder.cut.mul(autoAt('bass.grinder.cut'))).lpq(bass.grinder.res).ftype('ladder').drive(bass.grinder.drive)
  .lpenv(2.6)
  .lpa(0.006).lpd(0.18).lpsustain(0.4)
  .lpdepth(bass.grinder.lfo).lpsync(0.5).lpdc(1)
  .shape(0.25)
  .distort(bass.grinder.dist).distortvol(0.6)
  .attack(bass.grinder.attack).decay(0.6).sustain(0.8).release(bass.grinder.release)
  .orbit(2)
  .mask(gateAnd(gateOf('grinder'), gLong)).filter(audible)

$: grindNotes(bass.grinder.vol.mul(tlOr('grinder')).mul(gDrift))
  .s('sine')
  .fm(bass.grinder.fm.add(perlin.slow(8).mul(bass.grinder.fmMod)))
  .fmh(bass.grinder.ratio)
  .glide(bass.grinder.glide.mul(m('<1 1 1 0 1 1 1 0>')))
  .sometimesBy(bass.grinder.chance, (x) => x.add(note('12')))
  .nudge(rand.sub(0.5).mul(bass.grinder.jitter))
  .lpf(bass.grinder.cut.mul(autoAt('bass.grinder.cut')).add(perlin.slow(8).mul(220)))
  .lpq(bass.grinder.res).ftype('ladder').drive(bass.grinder.drive)
  .lpenv(2.6)
  .lpa(0.006).lpd(0.2).lpsustain(0.4)
  .lpdepth(bass.grinder.lfo).lpsync(0.5).lpdc(1)
  .shape(0.25)
  .distort(bass.grinder.dist).distortvol(0.6)
  .attack(bass.grinder.attack.mul(0.6)).decay(0.5).sustain(0.75).release(bass.grinder.release.mul(0.8))
  .orbit(2)
  .mask(gateAnd(gateOf('grinder'), gDrift)).filter(audible)

$: grindNotes(bass.grinder.vol.mul(tlOr('grinder')).mul(gStutter))
  .s('sine').fm(bass.grinder.fm).fmh(bass.grinder.ratio)
  .sometimesBy(bass.grinder.chance, (x) => x.ply(2))
  .sometimesBy(0.2, (x) => x.ply(3))
  .degradeBy(bass.grinder.drop)
  .nudge(rand.sub(0.5).mul(bass.grinder.jitter))
  .lpf(bass.grinder.cut.mul(autoAt('bass.grinder.cut'))).lpq(bass.grinder.res).ftype('ladder').drive(bass.grinder.drive)
  .lpenv(2.6).lpa(0.004).lpd(0.14).lpsustain(0.3)
  .crush(perlin.range(8, 14))
  .shape(0.3)
  .distort(bass.grinder.dist).distortvol(0.6)
  .attack(bass.grinder.attack.mul(0.35)).decay(0.3).sustain(0.6).release(bass.grinder.release.mul(0.5))
  .orbit(2)
  .mask(gateAnd(gateOf('grinder'), gStutter)).filter(audible)

$: note(COIL)
  .s('sawtooth').unison(2).detune(bass.coil.det)
  .vowel('a')
  .gain(bass.coil.vol.mul(tlOr('coil')))
  .lpf(bass.coil.cut.mul(autoAt('bass.coil.cut'))).lpq(bass.coil.res).ftype('ladder').drive(bass.coil.drive)
  .lpdepth(bass.coil.lfo).lpsync(0.25).lpdc(1)
  .decay(0.4).sustain(0.8).release(0.3)
  .room(0.15).roomsize(fx.reverb.size)
  .orbit(2)
  .mask(gateOf('coil')).filter(audible)

$: note(WRAITH_PAT)
  .s('sine').fm(leads.bell.fm.mul(1.4)).fmh(bass.wraith.ratio)
  .gain(bass.wraith.vol.mul(tlOr('wraith')))
  .lpf(bass.wraith.cut).hpf(300)
  .decay(bass.wraith.decay).sustain(0).release(0.1)
  .delay(0.3).delaytime(0.1875).delayfeedback(0.35)
  .room(verb).roomsize(fx.reverb.size)
  .pan(rand.mul(1.2).sub(0.6))
  .mask(gateOf('wraith')).filter(audible)

// ── ГАРМОНИЯ ────────────────────────────────────────────────────
$: note(PAD_A)
  .s('sawtooth').partials([1, 0.35])
  .unison(2).detune(pads.void.det)
  .gain(pads.void.vol.mul(tlOr('pads')).mul(hA))
  .lpf(pads.void.cut.mul(autoAt('pads.void.cut'))).hpf(pads.void.hpf).lpq(pads.void.q).ftype('24db')
  .lpdepth(pads.void.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.4)
  .shape(pads.void.grit)
  .attack(1.5).decay(2).sustain(0.85).release(2.5)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateAnd(gateOf('pads'), hA)).filter(audible)

$: s('padlong:0')
  .loopAt(8)
  .gain(pads.tape.vol.mul(tlOr('pads')).mul(hB))
  .lpf(pads.tape.cut).hpf(pads.tape.hpf)
  .crush(pads.tape.crush)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(64).range(0.3, 0.7))
  .mask(gateAnd(gateOf('pads'), hB)).filter(audible)

$: note(PAD_B)
  .s('sawtooth').unison(2).detune(0.06)
  .gain(pads.drone.vol.mul(tlOr('pads')).mul(hB))
  .lpf(pads.drone.cut).hpf(40).ftype('24db').lpq(2)
  .attack(2).decay(2).sustain(0.9).release(4)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateAnd(gateOf('pads'), hB)).filter(audible)

// ── ЛИДЫ ────────────────────────────────────────────────────────
$: note(BELL)
  .s('sine').fm(leads.bell.fm).fmh(leads.bell.ratio)
  .gain(leads.bell.vol.mul(tlOr('bell')))
  .lpf(leads.bell.cut.mul(autoAt('leads.bell.cut'))).hpf(200).lpq(2)
  .decay(leads.bell.decay).sustain(0).release(1.5)
  .delay(leads.bell.echo).delaytime(0.1875).delayfeedback(0.45)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.3, 0.7))
  ._pianoroll()
  .mask(gateOf('bell')).filter(audible)

$: note(m('[d6|eb6|a5|bb5]'))
  .struct(m('~ x ~ ~ x ~ ~ x'))
  .s('square')
  .gain(leads.pulse.vol.mul(tlOr('pulse')))
  .lpf(leads.pulse.cut)
  .crush(leads.pulse.crush)
  .decay(leads.pulse.decay).sustain(0).release(0.05)
  .delay(leads.pulse.echo).delaytime(0.1875).delayfeedback(0.3)
  .pan(rand.mul(1.6).sub(0.8))
  .degradeBy(0.2)
  .mask(gateOf('pulse')).filter(audible)

// ── ЭФФЕКТЫ ─────────────────────────────────────────────────────
$: note('a1')
  .s('sine')
  .struct(impactPat)
  .gain(fx.impact.vol.mul(tlOr('impact')))
  .lpf(fx.impact.cut)
  .attack(0.002).decay(2).sustain(0).release(1)
  .room(0.4).roomsize(fx.reverb.size)
  .mask(gateOf('impact')).filter(audible)

$: s('noise2:0')
  .speed(-1)
  .struct(reversePat)
  .gain(fx.reverse.vol.mul(tlOr('reverse')))
  .lpf(fx.reverse.cut).hpf(200)
  .attack(0.3).release(0.2)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('reverse')).filter(audible)
