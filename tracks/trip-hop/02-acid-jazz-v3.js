// TRIP-HOP 02 · ACID JAZZ BREAKS v3 · 82 BPM · 88 тактов (≈4:18)
// v2 не тронут. v3 — та же гармония и материал, но по текущим стандартам:
// TIMELINE + SONG/LOOP/HOLD, gateOf/mask на каждом слое, постоянные уровни
// (секции включают слои, а не крутят громкости), сухой микс, лёгкий пэд.
// Форма: INTRO 8 → BUILD 8 → GROOVE A 16 → BREAK 8 → GROOVE B 16 →
// CLIMAX 16 → DECAY 8 → OUTRO 8.
// @roots d eb bb f g eb c d
setcpm(82 / 4)

if (typeof samples === 'function') {
  samples({
    bd: [
      'bd/10_bd_switchangel.wav', 'bd/11_bd_mot4i.wav', 'bd/12_bd_mot4i.wav',
      'bd/13_bd_mot4i.wav', 'bd/14_bd_switchangel.wav', 'bd/15_bd_switchangel.wav',
      'bd/16_bd_switchangel.wav', 'bd/17_bd_switchangel.wav',
    ],
    sd: [
      'sd/10_sd_switchangel-bounce-2.wav', 'sd/11_sd_switchangel_3.wav',
      'sd/12_sd_switchangel_2.wav', 'sd/13_sd_switchangel_2.wav', 'sd/14_sd.wav',
    ],
    hh: [
      'hh/10_hh_switchangel.wav', 'hh/11_hh_mot4i.wav', 'hh/12_hh_switchangel.wav',
      'hh/13_hh_switchangel.wav', 'hh/14_hh_mot4i.wav',
    ],
    oh: [
      'oh/10_oh_switchangel.wav', 'oh/11_oh_switchangel.wav',
      'oh/12_oh_switchangel.wav', 'oh/13_oh_switchangel.wav',
    ],
    rim: ['rim/10_rim_switchangel.wav', 'rim/11_rim_switch_angel.wav'],
    sh: ['sh/10_sh_switchangel.wav'],
    lt: ['lt/10_lt_mot4i.wav'],
    tb: ['tb/10_tb.wav'],
  }, 'https://cdn.jsdelivr.net/gh/tidalcycles/uzu-drumkit@main/')
}

const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
  switches: {
    mode: ['boom', 'break', 'half', 'roll', 'shuffle', 'stutter', 'broken', 'open'],
    harmony: ['quartal', 'ninth'],
    lead: ['sparks', 'smooth', 'theme'],
    vibes: ['off', 'sparse', 'dense'],
  },
}

const play = slider(1, 0, 2, 1)
const mode = slider(0, 0, 7, 1)
const harmony = slider(0, 0, 1, 1)
const lead = slider(0, 0, 2, 1)
const vibes = slider(1, 0, 2, 1)
const holdBar = slider(0, 0, 87, 1)
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
  drums: {
    kick: {
      name: 'Kick',
      vol: slider(0.3, 0, 0.5, 0.01),
      cut: slider(240, 80, 3000, 10),
      shape: slider(0.55, 0, 0.95, 0.01),
      decay: slider(0.5, 0.15, 1.4, 0.01),
      tune: slider(0.88, 0.55, 1.3, 0.01),
    },
    snare: {
      name: 'Snare',
      vol: slider(0.22, 0, 1, 0.01),
      cut: slider(3800, 800, 12000, 100),
      decay: slider(0.16, 0.03, 0.6, 0.01),
    },
    ghost: {
      name: 'Ghost snare',
      vol: slider(0.08, 0, 0.4, 0.01),
      cut: slider(3200, 600, 9000, 100),
      decay: slider(0.05, 0.01, 0.2, 0.005),
    },
    hat: {
      name: 'Hats',
      vol: slider(0.12, 0, 0.9, 0.01),
      cut: slider(7600, 800, 16000, 100),
      decay: slider(0.045, 0.01, 0.2, 0.005),
    },
    ohat: {
      name: 'Open hats',
      vol: slider(0.1, 0, 0.7, 0.01),
      cut: slider(6000, 800, 16000, 100),
      decay: slider(0.13, 0.03, 0.5, 0.01),
    },
    rim: {
      name: 'Rim',
      vol: slider(0.12, 0, 0.7, 0.01),
      cut: slider(3200, 400, 12000, 100),
      decay: slider(0.05, 0.01, 0.2, 0.005),
      echo: slider(0.2, 0, 0.8, 0.01),
    },
    shaker: {
      name: 'Shaker',
      vol: slider(0.06, 0, 0.5, 0.01),
      cut: slider(6800, 800, 16000, 100),
      decay: slider(0.03, 0.01, 0.15, 0.005),
    },
    rolls: {
      name: 'Rolls',
      vol: slider(0.1, 0, 0.6, 0.01),
      cut: slider(4200, 800, 14000, 100),
      decay: slider(0.04, 0.01, 0.15, 0.005),
    },
  },
  perc: {
    tom: {
      name: 'Toms',
      vol: slider(0.12, 0, 0.6, 0.01),
      cut: slider(1400, 200, 6000, 10),
      decay: slider(0.25, 0.05, 0.8, 0.01),
      echo: slider(0.2, 0, 0.7, 0.01),
    },
    tabla: {
      name: 'Tabla',
      vol: slider(0.1, 0, 0.5, 0.01),
      cut: slider(2200, 300, 8000, 20),
      decay: slider(0.12, 0.03, 0.4, 0.01),
      echo: slider(0.15, 0, 0.7, 0.01),
    },
  },
  low: {
    sub: {
      name: 'Sub',
      vol: slider(0.22, 0, 1, 0.01),
      cut: slider(80, 40, 80, 5),
      decay: slider(0.45, 0.1, 1.5, 0.01),
    },
  },
  moog: {
    bass: {
      name: 'Moog bass',
      vol: slider(0.3, 0, 1, 0.01),
      cut: slider(57, 40, 80, 1),
      res: slider(9, 0, 20, 0.5),
      env: slider(2.4, 0, 8, 0.1),
      decay: slider(0.25, 0.05, 1, 0.01),
      glide: slider(0, 0, 0.09, 0.001),
      det: slider(0.04, 0, 0.2, 0.005),
      shape: slider(0.25, 0, 0.9, 0.01),
      echo: slider(0.18, 0, 0.7, 0.01),
    },
    lead: {
      name: 'Moog lead',
      vol: slider(0.16, 0, 0.9, 0.01),
      cut: slider(900, 200, 6000, 10),
      res: slider(6, 0, 20, 0.5),
      lfo: slider(2.2, 0, 8, 0.1),
      env: slider(1.4, 0, 8, 0.1),
      decay: slider(0.16, 0.03, 0.8, 0.01),
      glide: slider(0, 0, 0.06, 0.001),
      det: slider(0.06, 0, 0.25, 0.005),
    },
  },
  keys: {
    rhodes: {
      name: 'Rhodes',
      vol: slider(0.18, 0, 0.9, 0.01),
      cut: slider(2200, 200, 10000, 20),
      fm: slider(0.9, 0, 4, 0.05),
      decay: slider(0.32, 0.05, 1.2, 0.01),
      echo: slider(0.15, 0, 0.8, 0.01),
    },
    pad: {
      name: 'Pad',
      vol: slider(0.18, 0, 0.7, 0.01),
      cut: slider(1200, 80, 6000, 10),
      q: slider(1.2, 0, 20, 0.5),
      lfo: slider(1.2, 0, 8, 0.1),
      det: slider(0.08, 0, 0.5, 0.01),
    },
    vibes: {
      name: 'Vibes',
      vol: slider(0.16, 0, 0.8, 0.01),
      cut: slider(3400, 400, 12000, 20),
      decay: slider(0.5, 0.05, 1.6, 0.01),
      echo: slider(0.3, 0, 0.9, 0.01),
    },
    spark: {
      name: 'Spark 32nd',
      vol: slider(0.07, 0, 0.5, 0.01),
      cut: slider(4200, 400, 14000, 20),
      decay: slider(0.06, 0.02, 0.3, 0.005),
      echo: slider(0.35, 0, 0.85, 0.01),
    },
  },
  atmos: {
    air: {
      name: 'Air',
      vol: slider(0.1, 0, 0.5, 0.01),
      cut: slider(600, 100, 8000, 20),
      lfo: slider(2.2, 0, 10, 0.5),
    },
    drone: {
      name: 'Drone',
      vol: slider(0.07, 0, 0.6, 0.01),
      cut: slider(260, 60, 2000, 10),
      det: slider(0.09, 0, 0.5, 0.01),
    },
    vinyl: {
      name: 'Vinyl',
      vol: slider(0.04, 0, 0.3, 0.01),
      cut: slider(2400, 300, 12000, 100),
    },
  },
  fx: {
    dub: {
      name: 'Dub delay',
      delaySend: slider(0.2, 0, 0.8, 0.01),
      delayTime: slider(0.375, 0.0625, 0.75, 0.0625),
      delayFeedback: slider(0.45, 0, 0.85, 0.01),
    },
    spot: {
      name: 'Spot FX',
      vol: slider(0.06, 0, 0.5, 0.01),
      cut: slider(2400, 200, 10000, 20),
      decay: slider(1.8, 0.3, 4, 0.1),
    },
    reverb: {
      size: slider(7, 1, 16, 0.5),
    },
  },
}
const { drums, perc, low, moog, keys, atmos, fx } = instruments

const TIMELINE = [
  { at: 0,  len: 8,  name: 'INTRO',    values: { air: 1, drone: 1, vinyl: 1, kick: 0, snare: 0, ghost: 0, hat: 0, ohat: 0, rim: 0, shaker: 0, rolls: 0, tom: 0, tabla: 0, sub: 0, moogBass: 1, rhodes: 0, pad: 1, spot: 0, spark: 0, leadSel: 0, vibesSel: 1, mode: 2, harmony: 1 } },
  { at: 8,  len: 8,  name: 'BUILD',    values: { air: 1, drone: 1, vinyl: 1, kick: 1, snare: 1, ghost: 0, hat: 1, ohat: 0, rim: 1, shaker: 1, rolls: 0, tom: 0, tabla: 0, sub: 1, moogBass: 1, rhodes: 1, pad: 1, spot: 0, spark: 0, leadSel: 0, vibesSel: 1, mode: 0, harmony: 0 } },
  { at: 16, len: 16, name: 'GROOVE A', values: { air: 1, drone: 1, vinyl: 1, kick: 1, snare: 1, ghost: 1, hat: 1, ohat: 1, rim: 1, shaker: 1, rolls: 0, tom: 0, tabla: 0, sub: 1, moogBass: 1, rhodes: 1, pad: 1, spot: 0, spark: 0, leadSel: 0, vibesSel: 1, mode: 1, harmony: 0 } },
  { at: 32, len: 8,  name: 'BREAK',    values: { air: 1, drone: 1, vinyl: 1, kick: 0, snare: 0, ghost: 0, hat: 0, ohat: 0, rim: 1, shaker: 1, rolls: 0, tom: 1, tabla: 1, sub: 1, moogBass: 1, rhodes: 1, pad: 1, spot: 1, spark: 0, leadSel: 1, vibesSel: 2, mode: 2, harmony: 1 } },
  { at: 40, len: 16, name: 'GROOVE B', values: { air: 1, drone: 1, vinyl: 1, kick: 1, snare: 1, ghost: 1, hat: 1, ohat: 1, rim: 1, shaker: 1, rolls: 0, tom: 0, tabla: 0, sub: 1, moogBass: 1, rhodes: 1, pad: 1, spot: 0, spark: 0, leadSel: 1, vibesSel: 1, mode: 4, harmony: 0 } },
  { at: 56, len: 16, name: 'CLIMAX',   values: { air: 1, drone: 1, vinyl: 1, kick: 1, snare: 1, ghost: 1, hat: 1, ohat: 1, rim: 1, shaker: 1, rolls: 1, tom: 1, tabla: 1, sub: 1, moogBass: 1, rhodes: 1, pad: 1, spot: 0, spark: 1, leadSel: 2, vibesSel: 2, mode: 1, harmony: 0 } },
  { at: 72, len: 8,  name: 'DECAY',    values: { air: 1, drone: 1, vinyl: 1, kick: 1, snare: 1, ghost: 0, hat: 1, ohat: 0, rim: 1, shaker: 1, rolls: 0, tom: 0, tabla: 1, sub: 1, moogBass: 1, rhodes: 1, pad: 1, spot: 1, spark: 0, leadSel: 0, vibesSel: 1, mode: 0, harmony: 1 } },
  { at: 80, len: 8,  name: 'OUTRO',    values: { air: 1, drone: 1, vinyl: 1, kick: 0, snare: 0, ghost: 0, hat: 0, ohat: 0, rim: 0, shaker: 0, rolls: 0, tom: 0, tabla: 0, sub: 1, moogBass: 1, rhodes: 1, pad: 1, spot: 0, spark: 0, leadSel: 0, vibesSel: 1, mode: 7, harmony: 1 } },
]

const AUTOMATION = [
  { path: 'moog.bass.cut',    points: [[0, 0.8], [16, 1], [40, 1.1], [56, 1.35], [72, 0.9], [88, 0.7]] },
  { path: 'moog.lead.cut',    points: [[0, 0.6], [16, 0.9], [32, 1.1], [56, 1.5], [72, 0.8], [88, 0.5]] },
  { path: 'keys.pad.cut',     points: [[0, 0.6], [16, 0.9], [32, 1.1], [56, 1.4], [72, 0.9], [88, 0.5]] },
  { path: 'keys.rhodes.cut',  points: [[0, 0.7], [16, 1], [40, 1.1], [56, 1.3], [72, 0.9], [88, 0.6]] },
  { path: 'drums.hat.cut',    points: [[0, 0.8], [16, 1], [56, 1.2], [72, 0.9], [88, 0.7]] },
  { path: 'atmos.air.cut',    points: [[0, 0.7], [16, 1], [32, 1.2], [56, 0.9], [88, 1.4]] },
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
const leadAuto = autoSwitch('leadSel', lead)
const vibesAuto = autoSwitch('vibesSel', vibes)
const hA = harmonyAuto.fmap((v) => (v === 0 ? 1 : 0))
const hB = harmonyAuto.fmap((v) => (v === 1 ? 1 : 0))
const lSparks = leadAuto.fmap((v) => (v === 0 ? 1 : 0))
const lSmooth = leadAuto.fmap((v) => (v === 1 ? 1 : 0))
const lTheme = leadAuto.fmap((v) => (v === 2 ? 1 : 0))
const vSparse = vibesAuto.fmap((v) => (v >= 1 ? 1 : 0))
const vDense = vibesAuto.fmap((v) => (v >= 2 ? 1 : 0))
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

// ── ФРАЗЫ ───────────────────────────────────────────────────────
const PAD_A = phrase([
  '[d3,g3,c4,f4]', '[g3,c4,f4,bb4]', '[d4,g4,c5,f5]', '[a3,d4,g4,c5]',
  '[c4,f4,bb4,eb5]', '[g3,c4,f4,bb4]', '[g3,c4,f4,bb4]', '[d3,g3,c4,f4]',
])
const PAD_B = phrase([
  '[f3,c4,a4,e5]', '[g3,bb3,d4,f4]', '[d4,f4,a4,c5]', '[a3,c4,e4,g4]',
  '[bb3,d4,f4,a4]', '[g3,bb3,d4,f4]', '[eb4,g4,bb4,d6]', '[f3,c4,a4,e5]',
])
const KEYS = phrase([
  '[f4,a4,c5,e5]', '[g4,bb4,d5,f5]', '[d4,f4,a4,c5]', '[a4,c5,e5,g5]',
  '[c5,f5,bb5,d6]', '[g4,bb4,d5,f5]', '[eb4,g4,bb4,d5]', '[f4,a4,c5,e5]',
])
const LEAD_A = phrase([
  '[~ ~ ~ f5 ~ ~ ~ ~ a5 ~ ~ ~ ~ ~ c6 ~]',
  '[~ ~ bb4 ~ ~ ~ ~ ~ d5 ~ ~ ~ eb5 ~ ~ ~]',
  '[~ d5 ~ ~ ~ f5 ~ ~ ~ ~ a5 ~ ~ ~ ~ ~]',
  '[~ ~ a4 ~ ~ ~ c5 ~ ~ ~ e5 ~ ~ ~ ~ ~]',
  '[~ ~ ~ f5 ~ ~ bb5 ~ ~ ~ ~ ~ g5 ~ ~ ~]',
  '[~ ~ g4 ~ ~ d5 ~ ~ ~ ~ bb4 ~ ~ ~ ~ ~]',
  '[~ ~ eb5 ~ ~ ~ ~ g5 ~ ~ bb5 ~ ~ ~ ~ ~]',
  '[~ ~ ~ a4 ~ ~ ~ c5 ~ ~ e5 ~ ~ ~ ~ ~]',
])
const LEAD_B = phrase([
  '[~ [f4@2 a4] [c5@3 e5] ~ [g4@2 c5] [e5@3 a4] ~ ~]',
  '[~ [g4@2 bb4] [d5@3 f5] ~ [c5@2 bb4] [g4@3 d5] ~ ~]',
  '[~ [d5@2 f5] [a5@3 c5] ~ [f5@2 a5] [d6@3 f5] ~ ~]',
  '[~ [a4@2 c5] [e5@3 g5] ~ [f5@2 e5] [c5@3 a4] ~ ~]',
  '[~ [f5@2 g5] [bb5@3 d6] ~ [c6@2 bb5] [g5@3 f5] ~ ~]',
  '[~ [bb4@2 d5] [f5@3 g5] ~ [f5@2 d5] [bb4@3 g4] ~ ~]',
  '[~ [eb5@2 g5] [bb5@3 g5] ~ [eb5@2 bb4] [g4@3 eb5] ~ ~]',
  '[~ [f4@2 a4] [c5@3 e5] ~ [a4@2 c5] [e5@3 a4] ~ ~]',
])
const LEAD_C = phrase([
  '[~ ~ f4 a4 [c5@2 e5] ~ ~ d5 [c5 a4] ~ ~ [c5 e5] ~ ~ ~]',
  '[~ g4@2 bb4 ~ [d5 f5 d5] ~ ~ c5 bb4 ~ g4@2 ~ [bb4 d5] ~ ~ ~]',
  '[~ ~ d5 f5 ~ [a5@2 ~] ~ c5 [d5 f5] ~ ~ a5 ~ [f5 d5] ~ ~]',
  '[~ a4 c5 [e5@2 g5] ~ ~ f5 e5 ~ c5 ~ [a4 c5 e5] ~ ~ ~]',
  '[~ ~ f5 g5 [bb5@2 ~] ~ d6 [c6 bb5] ~ ~ g5 ~ [f5 g5 bb5] ~ ~]',
  '[~ ~ bb4 d5 [f5@2 ~] ~ g5 f5 ~ d5 ~ [bb4 d5 f5] ~ ~ g4]',
  '[~ eb5 g5 [bb5@2 ~] ~ d6 bb5 ~ g5 ~ [eb5 g5 bb5] ~ ~ ~ ~]',
  '[~ ~ a4 c5 [e5@2 g5] ~ ~ c5 a4 ~ ~ [f4 a4 c5] ~ ~ ~]',
])
const SPARK = phrase([
  '[[~ ~ f16 a16 [c17@2 e17] ~ ~ d17 [c17 a16] ~ ~ [c17 e17] ~ ~ ~]]',
  '[[~ g16@2 bb16 ~ [d17 f17 d17] ~ ~ c17 bb16 ~ g16@2 ~ [bb16 d17] ~ ~ ~]]',
  '[[~ ~ d17 f17 ~ [a17@2 ~] ~ c17 [d17 f17] ~ ~ a17 ~ [f17 d17] ~ ~]]',
  '[[~ a16 c17 [e17@2 g17] ~ ~ f17 e17 ~ c17 ~ [a16 c17 e17] ~ ~ ~]]',
  '[[~ ~ f17 g17 [bb17@2 ~] ~ d18 [c18 bb17] ~ ~ g17 ~ [f17 g17 bb17] ~ ~]]',
  '[[~ ~ bb16 d17 [f17@2 ~] ~ g17 f17 ~ d17 ~ [bb16 d17 f17] ~ ~ g16]]',
  '[[~ eb17 g17 [bb17@2 ~] ~ d18 bb17 ~ g17 ~ [eb17 g17 bb17] ~ ~ ~ ~]]',
  '[[~ ~ a16 c17 [e17@2 g17] ~ ~ c17 a16 ~ ~ [f16 a16 c17] ~ ~ ~]]',
])
const VIBES = phrase([
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ eb5 ~ ~ ~ ~ ~ ~ bb4 ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ d5 ~ ~ f5 ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ e5 ~ ~ g4 ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ bb5 ~ ~ ~ ~ ~ ~ g5 ~ ~]',
  '[~ ~ ~ ~ d5 ~ ~ ~ ~ f5 ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ bb4 ~ ~ ~ eb5 ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ a4 ~ ~ c5 ~ ~ ~ ~]',
])
const VIBES_B = phrase([
  '[~ ~ a4 ~ c5 ~ ~ e5 ~ ~ ~ a4 ~ ~ ~ ~]',
  '[~ bb4 ~ ~ ~ d5 ~ ~ g4 ~ ~ ~ bb4 ~ ~ ~]',
  '[~ ~ d5 ~ f5 ~ ~ a5 ~ ~ ~ d5 ~ ~ ~ ~]',
  '[~ c5 ~ ~ e5 ~ ~ g5 ~ ~ ~ c5 ~ ~ ~ ~]',
  '[~ ~ f5 ~ bb5 ~ ~ g5 ~ ~ ~ f5 ~ ~ ~ ~]',
  '[~ d5 ~ ~ g4 ~ ~ bb4 ~ ~ ~ d5 ~ ~ ~ ~]',
  '[~ ~ eb5 ~ g5 ~ ~ bb5 ~ ~ ~ eb5 ~ ~ ~ ~]',
  '[~ a4 ~ ~ c5 ~ ~ e5 ~ ~ ~ a4 ~ ~ ~ ~]',
])
const BASS = phrase([
  '[d1@3 ~ ~ d1@2 ~ ~ a1@2 ~]',
  '[eb1@3 ~ ~ eb1@2 ~ bb1@2 ~ ~]',
  '[bb1@3 ~ ~ bb1@2 ~ f1@2 ~ d2@2]',
  '[f1@3 ~ ~ f1@2 ~ c2@2 ~ a1@2]',
  '[g1@3 ~ ~ g1@2 ~ d2@2 ~ bb1@2]',
  '[eb1@3 ~ ~ bb1@2 ~ eb1@2 ~ ~]',
  '[c2@3 ~ ~ c2@2 ~ g1@2 ~ eb2@2]',
  '[d1@3 ~ ~ d1@2 ~ a1@2 ~ d1@2]',
])
const SUB_ROOTS = phrase([
  '[d1]', '[eb1]', '[bb1]', '[f1]', '[g1]', '[eb1]', '[c2]', '[d1]',
])

const kickPat = modeAuto.pick([
  m('x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ x'),
  m('x ~ ~ x ~ ~ x ~ ~ x ~ ~ x x ~ ~'),
  m('x ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~'),
  m('x ~ x x ~ x ~ x x ~ x x ~ x x ~'),
  m('x ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~ x'),
  m('x ~ ~ x x ~ ~ ~ ~ x ~ x x ~ x ~'),
  m('x ~ ~ ~ ~ x ~ x ~ ~ x ~ x ~ x ~'),
  m('x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~'),
])
const snarePat = modeAuto.pick([
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ x x ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~'),
  m('~ ~ x x ~ ~ x ~ ~ x x ~ ~ ~ x x'),
  m('~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~ ~ ~'),
  m('~ x ~ ~ x ~ ~ ~ x ~ ~ x x ~ x ~'),
  m('~ x ~ ~ ~ ~ x ~ ~ ~ x x ~ ~ x ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~'),
])
const hatPat = modeAuto.pick([
  m('x ~ [x x] ~ x ~ [x x] ~ x ~ x ~ [x x] ~ x ~'),
  m('x x ~ [x x] x ~ x x [x x] ~ x x ~ [x x] ~ x'),
  m('x ~ ~ x [x x] ~ x ~ x ~ ~ x [x x] ~ x ~'),
  m('[x x x] ~ x x [x x x] ~ x [x x x] ~ x x [x x x] ~ x'),
  m('~ x ~ [x x] ~ x ~ [x x] ~ x ~ [x x] ~ x ~ [x x]'),
  m('x [x x] ~ x x [x x] ~ x x [x x] ~ x x [x x] ~ x'),
  m('x ~ x [x x x] ~ x ~ x [x x x] ~ x ~ x [x x x] ~'),
  m('~ ~ x ~ ~ ~ [x x] ~ ~ x ~ ~ ~ [x x] ~ ~'),
])
const rimPat = modeAuto.pick([
  m('~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~'),
  m('~ x ~ ~ ~ ~ ~ ~ x ~ x ~ ~ ~ ~ x'),
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
  m('~ x x ~ x ~ ~ x x ~ x x ~ x ~ x'),
  m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'),
  m('x ~ ~ x ~ x ~ ~ x ~ ~ ~ x ~ ~ x'),
  m('~ ~ x ~ ~ x ~ ~ ~ x ~ ~ x ~ x ~'),
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
])
const compPat = modeAuto.pick([
  m('~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~'),
  m('x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ x'),
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
  m('x ~ x x ~ ~ x ~ x ~ x x ~ ~ x ~'),
  m('~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ x'),
  m('~ ~ x ~ ~ ~ x x ~ ~ x ~ ~ ~ x ~'),
  m('x ~ x ~ x ~ ~ x ~ x ~ x x ~ x ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~'),
])

// ── АТМОСФЕРА ───────────────────────────────────────────────────
$: s('pink')
  .gain(atmos.air.vol.mul(tlOr('air')))
  .lpf(atmos.air.cut.mul(autoAt('atmos.air.cut'))).lpq(0.8).ftype('24db')
  .lpdepth(atmos.air.lfo).lpsync(0.0625).lpdc(0)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('air')).filter(audible)

$: note(phrase([
     '[d2,a2]', '[eb2,g2]', '[bb1,f2]', '[f2,c3]',
     '[g2,d3]', '[eb2,g2]', '[c2,g2]', '[d2,a2]',
   ]))
  .s('sawtooth').unison(2).detune(atmos.drone.det)
  .gain(atmos.drone.vol.mul(tlOr('drone')))
  .lpf(atmos.drone.cut).lpq(3).ftype('24db')
  .attack(1.8).decay(1).sustain(0.9).release(3)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('drone')).filter(audible)

$: s('crackle')
  .gain(atmos.vinyl.vol.mul(m('<1 1 .7 1 1 1 1 .8 1 1 1 1>')).mul(tlOr('vinyl')))
  .lpf(atmos.vinyl.cut).hpf(300)
  .room(0.15)
  .mask(gateOf('vinyl')).filter(audible)

// ── УДАРНЫЕ ─────────────────────────────────────────────────────
$: s('bd')
  .struct(kickPat)
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .lpf(drums.kick.cut).lpq(1)
  .speed(drums.kick.tune)
  .shape(drums.kick.shape)
  .decay(drums.kick.decay).sustain(0).release(0.08)
  .mask(gateOf('kick')).filter(audible)

$: s('sd:0')
  .struct(snarePat)
  .gain(drums.snare.vol.mul(tlOr('snare')))
  .lpf(drums.snare.cut).hpf(180)
  .decay(drums.snare.decay).sustain(0).release(0.08)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('snare')).filter(audible)

$: s('sd:1')
  .struct(m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'))
  .gain(drums.ghost.vol.mul(m('[.35 1 .5 .8]*4')).mul(tlOr('ghost')))
  .lpf(drums.ghost.cut).hpf(220)
  .decay(drums.ghost.decay).sustain(0)
  .pan(rand.mul(1.2).sub(0.6))
  .mask(gateOf('ghost')).filter(audible)

$: s('hh')
  .struct(hatPat)
  .gain(drums.hat.vol.mul(m('[1 .5 .7 .5]*4')).mul(tlOr('hat')))
  .lpf(drums.hat.cut.mul(autoAt('drums.hat.cut'))).hpf(320)
  .decay(drums.hat.decay).sustain(0)
  .swingBy(0.16, 16)
  .nudge(rand.mul(0.01).sub(0.005))
  .mask(gateOf('hat')).filter(audible)

$: s('oh')
  .struct(m('~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x'))
  .gain(drums.ohat.vol.mul(tlOr('ohat')))
  .lpf(drums.ohat.cut)
  .decay(drums.ohat.decay).sustain(0)
  .room(verb.mul(0.8)).roomsize(fx.reverb.size)
  .mask(gateOf('ohat')).filter(audible)

$: s('rim')
  .struct(rimPat)
  .gain(drums.rim.vol.mul(tlOr('rim')))
  .lpf(drums.rim.cut).hpf(500).lpq(2)
  .decay(drums.rim.decay).sustain(0)
  .pan(rand.mul(1.4).sub(0.7))
  .delay(drums.rim.echo).delaytime(fx.dub.delayTime).delayfeedback(0.25)
  .mask(gateOf('rim')).filter(audible)

$: s('sh')
  .struct(m('x*16'))
  .gain(drums.shaker.vol.mul(tlOr('shaker')))
  .lpf(drums.shaker.cut).hpf(2200)
  .decay(drums.shaker.decay).sustain(0)
  .degradeBy(0.4)
  .pan(rand.mul(0.8).add(0.1))
  .mask(gateOf('shaker')).filter(audible)

$: s('sd:2')
  .struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ [x*8] ~ ~ ~'))
  .gain(drums.rolls.vol.mul(tlOr('rolls')))
  .lpf(drums.rolls.cut).hpf(200)
  .decay(drums.rolls.decay).sustain(0)
  .pan(rand.mul(1.6).sub(0.8))
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .mask(gateAnd(gateOf('rolls'), m('<1 0 0 0>').fmap((v) => v > 0.001))).filter(audible)

// ── ПЕРКУССИЯ ───────────────────────────────────────────────────
$: s('lt')
  .struct(m('~ ~ ~ ~ ~ [x x] ~ ~ ~ x ~ ~ [x x] ~ ~'))
  .gain(perc.tom.vol.mul(tlOr('tom')))
  .lpf(perc.tom.cut).lpq(2)
  .decay(perc.tom.decay).sustain(0)
  .delay(perc.tom.echo).delaytime(fx.dub.delayTime).delayfeedback(0.3)
  .pan(rand.mul(1.2).sub(0.6))
  .mask(gateOf('tom')).filter(audible)

$: s('tb')
  .struct(m('~ x ~ [x x] ~ ~ x ~ x ~ [x x] ~ x ~ ~'))
  .gain(perc.tabla.vol.mul(tlOr('tabla')))
  .lpf(perc.tabla.cut).lpq(2)
  .decay(perc.tabla.decay).sustain(0)
  .delay(perc.tabla.echo).delaytime(fx.dub.delayTime).delayfeedback(0.25)
  .pan(rand.mul(1.2).sub(0.6))
  .mask(gateOf('tabla')).filter(audible)

// ── НИЗ ─────────────────────────────────────────────────────────
$: note(BASS)
  .s('sawtooth')
  .unison(2).detune(moog.bass.det)
  .glide(moog.bass.glide.mul(m('<0 0 1 0 0 0 0 1>')))
  .gain(moog.bass.vol.mul(tlOr('moogBass')))
  .lpf(moog.bass.cut.mul(autoAt('moog.bass.cut'))).lpq(moog.bass.res).ftype('24db')
  .lpenv(moog.bass.env)
  .lpa(0.004).lpd(moog.bass.decay).lpsustain(0.2)
  .shape(moog.bass.shape)
  .attack(0.004).decay(0.12).sustain(0.8).release(0.14)
  .delay(moog.bass.echo).delaytime(fx.dub.delayTime).delayfeedback(0.3)
  .orbit(2)
  .mask(gateOf('moogBass')).filter(audible)

$: note(SUB_ROOTS)
  .s('sine')
  .struct(m('~ x ~ ~ ~ x ~ ~'))
  .gain(low.sub.vol.mul(tlOr('sub')))
  .lpf(low.sub.cut).lpq(1)
  .decay(low.sub.decay).sustain(0).release(0.2)
  .orbit(2)
  .mask(gateOf('sub')).filter(audible)

// ── MOOG LEAD · три состояния ───────────────────────────────────
$: note(LEAD_A)
  .s('square').unison(2).detune(moog.lead.det)
  .glide(moog.lead.glide.mul(m('<0 0 0 1 0 0 0 1>')))
  .gain(moog.lead.vol.mul(lSparks))
  .lpf(moog.lead.cut.mul(autoAt('moog.lead.cut'))).lpq(moog.lead.res).ftype('24db')
  .lpenv(moog.lead.env)
  .lpa(0.004).lpd(moog.lead.decay).lpsustain(0.2)
  .lpdepth(moog.lead.lfo).lpsync(0.125).lpdc(0)
  .decay(0.09).sustain(0.3).release(0.12)
  .delay(fx.dub.delaySend).delaytime(fx.dub.delayTime).delayfeedback(fx.dub.delayFeedback.mul(0.8))
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.35, 0.65))
  .orbit(3)
  .mask(lSparks.fmap((v) => v > 0.001)).filter(audible)

$: note(LEAD_B)
  .s('square').unison(2).detune(moog.lead.det)
  .glide(moog.lead.glide.mul(m('<0 0 0 0 1 0 0 1>')))
  .gain(moog.lead.vol.mul(lSmooth))
  .lpf(moog.lead.cut.mul(autoAt('moog.lead.cut'))).lpq(moog.lead.res).ftype('24db')
  .lpenv(moog.lead.env)
  .lpa(0.004).lpd(moog.lead.decay).lpsustain(0.2)
  .lpdepth(moog.lead.lfo).lpsync(0.125).lpdc(0)
  .decay(0.12).sustain(0.4).release(0.15)
  .delay(fx.dub.delaySend).delaytime(fx.dub.delayTime).delayfeedback(fx.dub.delayFeedback.mul(0.8))
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.35, 0.65))
  .orbit(3)
  .mask(lSmooth.fmap((v) => v > 0.001)).filter(audible)

$: note(LEAD_C)
  .s('square').unison(2).detune(moog.lead.det)
  .glide(moog.lead.glide.mul(m('<0 0 0 1 0 0 0 1>')))
  .gain(moog.lead.vol.mul(lTheme))
  .lpf(moog.lead.cut.mul(autoAt('moog.lead.cut'))).lpq(moog.lead.res).ftype('24db')
  .lpenv(moog.lead.env)
  .lpa(0.004).lpd(moog.lead.decay).lpsustain(0.2)
  .lpdepth(moog.lead.lfo).lpsync(0.125).lpdc(0)
  .decay(0.09).sustain(0.3).release(0.12)
  .delay(fx.dub.delaySend).delaytime(fx.dub.delayTime).delayfeedback(fx.dub.delayFeedback.mul(0.8))
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.35, 0.65))
  .orbit(3)
  .mask(lTheme.fmap((v) => v > 0.001)).filter(audible)

// ── КЛАВИШИ ─────────────────────────────────────────────────────
$: note(KEYS)
  .struct(compPat)
  .s('sine').fm(keys.rhodes.fm).fmh(1.01)
  .gain(keys.rhodes.vol.mul(tlOr('rhodes')))
  .lpf(keys.rhodes.cut.mul(autoAt('keys.rhodes.cut'))).lpq(2)
  .decay(keys.rhodes.decay).sustain(0).release(0.35)
  .delay(keys.rhodes.echo).delaytime(fx.dub.delayTime).delayfeedback(0.3)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.4, 0.6))
  .mask(gateOf('rhodes')).filter(audible)

$: note(PAD_A)
  .s('sawtooth').partials([1, 0.5, 0.3])
  .unison(1).detune(keys.pad.det)
  .gain(keys.pad.vol.mul(hA).mul(tlOr('pad')))
  .lpf(keys.pad.cut.mul(autoAt('keys.pad.cut'))).lpq(keys.pad.q).ftype('24db')
  .lpdepth(keys.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.25)
  .attack(1.2).decay(1.4).sustain(0.85).release(4)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateAnd(gateOf('pad'), hA)).filter(audible)

$: note(PAD_B)
  .s('sine').partials([1, 0.55, 0.3])
  .unison(1).detune(keys.pad.det.mul(0.8))
  .gain(keys.pad.vol.mul(hB).mul(tlOr('pad')))
  .lpf(keys.pad.cut.mul(1.2).mul(autoAt('keys.pad.cut'))).lpq(keys.pad.q.mul(0.8)).ftype('24db')
  .lpdepth(keys.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.22)
  .attack(1).decay(1.2).sustain(0.85).release(4)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateAnd(gateOf('pad'), hB)).filter(audible)

$: note(VIBES)
  .s('sine').fm(0.8).fmh(3.01)
  .gain(keys.vibes.vol.mul(vSparse))
  .lpf(keys.vibes.cut).lpq(2)
  .attack(0.002).decay(keys.vibes.decay).sustain(0).release(0.5)
  .delay(keys.vibes.echo).delaytime(0.4375).delayfeedback(0.4)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.3, 0.7))
  .mask(vSparse.fmap((v) => v > 0.001)).filter(audible)

$: note(VIBES_B)
  .s('sine').fm(0.8).fmh(3.01)
  .gain(keys.vibes.vol.mul(0.8).mul(vDense))
  .lpf(keys.vibes.cut).lpq(2)
  .attack(0.002).decay(keys.vibes.decay).sustain(0).release(0.5)
  .delay(keys.vibes.echo).delaytime(0.4375).delayfeedback(0.4)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.3, 0.7))
  .mask(vDense.fmap((v) => v > 0.001)).filter(audible)

$: note(SPARK).fast(2)
  .s('triangle')
  .gain(keys.spark.vol.mul(tlOr('spark')))
  .lpf(keys.spark.cut).lpq(2)
  .attack(0.002).decay(keys.spark.decay).sustain(0).release(0.1)
  .delay(keys.spark.echo).delaytime(0.375).delayfeedback(0.35)
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.25, 0.75))
  .orbit(3)
  .mask(gateOf('spark')).filter(audible)

// ── FX ──────────────────────────────────────────────────────────
$: s('white')
  .struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~'))
  .gain(fx.spot.vol.mul(tlOr('spot')))
  .hpf(700).lpf(fx.spot.cut)
  .attack(0.002).decay(fx.spot.decay).sustain(0).release(0.8)
  .room(verb).roomsize(fx.reverb.size)
  .pan(rand.mul(1.4).sub(0.7))
  .mask(gateAnd(gateOf('spot'), m('<0 0 0 0 0 0 0 1>').fmap((v) => v > 0.001))).filter(audible)
