// IDM 03 · SPLINTER v3 · 136 BPM · glitch / granular / 8-bit / voice lab
// v3: 144 такта (в 1.5 раза длиннее v2), больше смен сетки, глитча,
// арпеджио и кислотных событий; VOICE LAB с автоматизацией голоса и
// грануляра; больше кривых среза. C–Gb–Db–Bb, тритоны — ось.
// Гайд: docs/idm/README.md.
// @roots c c db db gb gb bb bb
// @dark
setcpm(136 / 4)

if (typeof samples === 'function') {
  samples('github:tidalcycles/Dirt-Samples')
}

// UI-манифест для панели: обычный JS-объект в коде.
const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
  switches: {
    mode: ['glitch', 'skitter', 'half', 'fracture', 'stutter', 'shuffle'],
    grain: ['off', 'cloud', 'scan'],
    acid: ['off', 'sparse', 'run', 'scream'],
    vox: ['off', 'dry', 'chop', 'cloud'],
  },
}

const play = slider(1, 0, 2, 1)
const mode = slider(0, 0, 5, 1)
const grainVar = slider(1, 0, 2, 1)
const acidVar = slider(0, 0, 3, 1)
const voxVar = slider(1, 0, 4, 1)
const holdBar = slider(0, 0, 191, 1)

const verb = slider(0.2, 0, 0.6, 0.01)
const duck = slider(0.45, 0, 1, 0.01)
const mutate = slider(0.25, 0, 1, 0.01)

const instruments = {
  atmos: {
    hiss: {
      name: 'Vinyl',
      vol: slider(0.035, 0, 0.2, 0.005),
      cut: slider(3200, 200, 10000, 20),
      hpf: slider(90, 20, 600, 10),
    },
    air: {
      name: 'Air',
      vol: slider(0.02, 0, 0.15, 0.005),
      cut: slider(650, 100, 5000, 20),
      lfo: slider(0.6, 0, 6, 0.1),
    },
  },
  drums: {
    kick: {
      name: 'Kick',
      vol: slider(0.07, 0, 0.7, 0.01),
      cut: slider(180, 70, 500, 5),
      decay: slider(0.14, 0.03, 0.4, 0.01),
      shape: slider(0.2, 0, 0.7, 0.01),
    },
    snare: {
      name: 'Snare',
      vol: slider(0.19, 0, 0.6, 0.01),
      cut: slider(5200, 400, 14000, 50),
      decay: slider(0.12, 0.03, 0.4, 0.01),
      room: slider(0.15, 0, 0.6, 0.01),
    },
    hat: {
      name: 'Hats',
      vol: slider(0.075, 0, 0.4, 0.01),
      cut: slider(8200, 800, 16000, 50),
      decay: slider(0.04, 0.01, 0.2, 0.005),
      swing: slider(0.06, 0, 0.2, 0.01),
    },
    open: {
      name: 'Open hat',
      vol: slider(0.06, 0, 0.4, 0.01),
      cut: slider(7000, 800, 14000, 50),
      decay: slider(0.18, 0.03, 0.6, 0.01),
    },
    click: {
      name: 'Clicks',
      vol: slider(0.05, 0, 0.3, 0.01),
      cut: slider(10000, 1000, 16000, 100),
      echo: slider(0.2, 0, 0.7, 0.01),
    },
    glitch: {
      name: 'Glitch',
      vol: slider(0.07, 0, 0.3, 0.01),
      cut: slider(6000, 600, 14000, 50),
      prob: slider(0.7, 0.2, 1, 0.01),
    },
    roll: {
      name: 'Roll',
      vol: slider(0.08, 0, 0.4, 0.01),
      cut: slider(5200, 400, 14000, 50),
      decay: slider(0.03, 0.01, 0.12, 0.005),
    },
    squeak: {
      name: 'Squeaks',
      vol: slider(0.05, 0, 0.3, 0.01),
      cut: slider(9000, 1000, 16000, 100),
      prob: slider(0.55, 0.1, 1, 0.01),
    },
  },
  bass: {
    sub: {
      name: 'Sub ≤80',
      vol: slider(0.19, 0, 1, 0.01),
      cut: slider(70, 40, 80, 1),
      decay: slider(0.38, 0.08, 1.2, 0.01),
    },
    growl: {
      name: 'Growl (mid)',
      vol: slider(0.16, 0, 0.8, 0.01),
      cut: slider(280, 80, 900, 5),
      q: slider(8, 0, 18, 0.5),
      grit: slider(0.28, 0, 0.8, 0.01),
      decay: slider(0.4, 0.08, 1.6, 0.01),
      det: slider(0.06, 0, 0.3, 0.01),
    },
    fm: {
      name: 'FM rubber',
      vol: slider(0.09, 0, 0.5, 0.01),
      cut: slider(220, 60, 800, 5),
      ratio: slider(1.5, 0.5, 4, 0.1),
      index: slider(2.5, 0, 8, 0.1),
      decay: slider(0.3, 0.05, 1.2, 0.01),
    },
  },
  acid: {
    line: {
      name: '303 line',
      vol: slider(0.17, 0, 0.6, 0.01),
      cut: slider(1400, 200, 5000, 20),
      res: slider(12, 2, 18, 0.5),
      env: slider(3.2, 0, 6, 0.1),
      decay: slider(0.13, 0.03, 0.4, 0.005),
      drive: slider(1.1, 0.4, 2.6, 0.01),
      echo: slider(0.22, 0, 0.7, 0.01),
    },
    run: {
      name: '303 run',
      vol: slider(0.12, 0, 0.5, 0.01),
      cut: slider(1600, 300, 6000, 20),
      res: slider(11, 2, 18, 0.5),
      env: slider(1.9, 0, 6, 0.1),
      decay: slider(0.08, 0.02, 0.3, 0.005),
      drive: slider(1.3, 0.4, 2.6, 0.01),
      oct: slider(0, 0, 3, 1),          // октава риффа, 0 = c2
      echo: slider(0.14, 0, 0.7, 0.01),
    },
    scream: {
      name: '303 scream',
      vol: slider(0.06, 0, 0.4, 0.01),
      cut: slider(2200, 400, 8000, 50),
      res: slider(14, 2, 18, 0.5),
      env: slider(3.5, 0, 6, 0.1),
      decay: slider(0.08, 0.02, 0.25, 0.005),
      shape: slider(0.35, 0, 0.8, 0.01),
      crush: slider(6, 1, 16, 1),
      echo: slider(0.25, 0, 0.8, 0.01),
    },
  },
  grain: {
    cloud: {
      name: 'Cloud',
      vol: slider(0.15, 0, 0.6, 0.01),
      chop: slider(32, 4, 64, 4),
      scan: slider(0.15, 0, 0.9, 0.01),
      window: slider(0.2, 0.02, 0.6, 0.01),
      speed: slider(0.7, 0.2, 1.6, 0.01),
      density: slider(1, 1, 3, 1),
      cut: slider(3200, 300, 12000, 50),
      hpf: slider(180, 40, 1200, 10),
      delay: slider(0.2, 0, 0.8, 0.01),
    },
    scan: {
      name: 'Scan',
      vol: slider(0.08, 0, 0.5, 0.01),
      chop: slider(16, 4, 64, 4),
      rate: slider(16, 2, 64, 1),
      window: slider(0.12, 0.02, 0.5, 0.01),
      speed: slider(0.9, 0.2, 1.6, 0.01),
      cut: slider(5000, 300, 14000, 50),
      hpf: slider(300, 40, 1600, 10),
    },
    edit: {
      name: 'Edit',
      vol: slider(0.09, 0, 0.4, 0.01),
      slice: slider(8, 2, 16, 1),
      speed: slider(1, 0.4, 2, 0.01),
      cut: slider(6000, 400, 14000, 50),
      hpf: slider(400, 40, 2000, 10),
      prob: slider(0.8, 0.2, 1, 0.01),
    },
  },
  bits: {
    lead: {
      name: '8-bit lead',
      vol: slider(0.24, 0, 0.4, 0.01),
      cut: slider(5200, 400, 12000, 50),
      decay: slider(0.09, 0.02, 0.3, 0.005),
      pw: slider(0.4, 0.1, 0.9, 0.01),
      crush: slider(8, 1, 16, 1),
      echo: slider(0.3, 0, 0.8, 0.01),
    },
    arp: {
      name: '8-bit arp',
      vol: slider(0.07, 0, 0.4, 0.01),
      cut: slider(3600, 300, 10000, 50),
      decay: slider(0.05, 0.01, 0.2, 0.005),
      pw: slider(0.25, 0.1, 0.9, 0.01),
      echo: slider(0.3, 0, 0.8, 0.01),
    },
  },
  vox: {
    phrase: {
      name: 'Numbers',
      vol: slider(0.29, 0, 0.5, 0.01),
      clip: slider(0.45, 0.1, 1.2, 0.01),
      cut: slider(11400, 400, 14000, 50),
      echo: slider(0.3, 0, 0.8, 0.01),
      room: slider(0.15, 0, 0.6, 0.01),
      chop: slider(8, 2, 32, 1),
      hpf: slider(280, 80, 1200, 10),
    },
    cloud: {
      name: 'Numbers cloud',
      vol: slider(0.13, 0, 0.5, 0.01),
      chop: slider(12, 2, 48, 1),
      speed: slider(1, 0.4, 1.8, 0.01),
      cut: slider(6000, 400, 14000, 50),
      hpf: slider(320, 80, 2000, 10),
      echo: slider(0.35, 0, 0.8, 0.01),
      room: slider(0.2, 0, 0.6, 0.01),
      density: slider(1, 1, 3, 1),
    },
  },
  chords: {
    pad: {
      name: 'Tritone pad',
      vol: slider(0.11, 0, 0.5, 0.01),
      cut: slider(1080, 80, 4000, 10),
      hpf: slider(120, 20, 600, 10),
      q: slider(2, 0, 16, 0.5),
      det: slider(0.06, 0, 0.3, 0.01),
      lfo: slider(0.3, 0, 6, 0.05),
    },
  },
  fx: {
    delay: { time: slider(0.375, 0.125, 0.75, 0.005), feedback: slider(0.45, 0, 0.8, 0.01) },
    reverb: { size: slider(3, 0.5, 10, 0.1) },
  },
}
const { atmos, drums, bass, acid, grain, bits, vox, chords, fx } = instruments

// ── TIMELINE: 96 тактов ─────────────────────────────────────────
const TIMELINE = [
  { at: 0,   len: 8,  name: 'INTRO',  values: { kick: 0, snare: 0, hat: 0, open: 0, click: 1, glitch: 1, roll: 0, squeak: 0, sub: 0, growl: 0, fm: 0, acidLine: 0, acidRun: 0, acidScream: 0, acidOld: 0, cloud: 1, scan: 0, edit: 0, pad: 1, lead: 0, arp: 0, vox: 0, voxCloud: 0, hiss: 1, air: 1, mode: 5, grainVar: 1, acidVar: 0, voxVar: 0  } },
  { at: 8,   len: 16, name: 'VERSE',  values: { kick: 1, snare: 1, hat: 1, open: 0, click: 1, glitch: 1, roll: 0, squeak: 0, sub: 1, growl: 1, fm: 0, acidLine: 1, acidRun: 0, acidScream: 0, acidOld: 0, cloud: 1, scan: 0, edit: 0, pad: 1, lead: 0, arp: 0, vox: 0, voxCloud: 0, hiss: 1, air: 1, mode: 0, grainVar: 1, acidVar: 1, voxVar: 0  } },
  { at: 24,  len: 8,  name: 'BUILD',  values: { kick: 1, snare: 1, hat: 1, open: 1, click: 1, glitch: 1, roll: 1, squeak: 1, sub: 1, growl: 1, fm: 1, acidLine: 1, acidRun: 0, acidScream: 0, acidOld: 1, cloud: 1, scan: 0, edit: 0, pad: 1, lead: 1, arp: 0, vox: 0, voxCloud: 0, hiss: 1, air: 1, mode: 1, grainVar: 1, acidVar: 2, voxVar: 0  } },
  { at: 32,  len: 16, name: 'MAIN',   values: { kick: 1, snare: 1, hat: 1, open: 1, click: 1, glitch: 1, roll: 0, squeak: 0, sub: 1, growl: 1, fm: 1, acidLine: 1, acidRun: 1, acidScream: 0, acidOld: 0, cloud: 0, scan: 1, edit: 0, pad: 1, lead: 1, arp: 1, vox: 1, voxCloud: 0, hiss: 1, air: 1, mode: 1, grainVar: 2, acidVar: 2, voxVar: 2  } },
  { at: 48,  len: 8,  name: 'BREAK',  values: { kick: 0, snare: 0, hat: 0, open: 0, click: 1, glitch: 1, roll: 0, squeak: 0, sub: 0, growl: 0, fm: 0, acidLine: 0, acidRun: 0, acidScream: 0, acidOld: 0, cloud: 0, scan: 1, edit: 0, pad: 1, lead: 0, arp: 0, vox: 1, voxCloud: 0, hiss: 1, air: 1, mode: 3, grainVar: 2, acidVar: 0, voxVar: 1  } },
  { at: 56,  len: 16, name: 'VERSE 2',values: { kick: 1, snare: 1, hat: 1, open: 0, click: 1, glitch: 1, roll: 0, squeak: 0, sub: 1, growl: 1, fm: 0, acidLine: 1, acidRun: 0, acidScream: 0, acidOld: 0, cloud: 1, scan: 0, edit: 0, pad: 1, lead: 1, arp: 0, vox: 0, voxCloud: 0, hiss: 1, air: 1, mode: 2, grainVar: 1, acidVar: 1, voxVar: 0  } },
  { at: 72,  len: 16, name: 'MAIN 2', values: { kick: 1, snare: 1, hat: 1, open: 1, click: 1, glitch: 1, roll: 1, squeak: 1, sub: 1, growl: 1, fm: 1, acidLine: 1, acidRun: 1, acidScream: 0, acidOld: 0, cloud: 0, scan: 1, edit: 0, pad: 1, lead: 1, arp: 1, vox: 1, voxCloud: 0, hiss: 1, air: 1, mode: 1, grainVar: 2, acidVar: 2, voxVar: 2  } },
  { at: 88,  len: 8,  name: 'GLITCH', values: { kick: 1, snare: 1, hat: 1, open: 0, click: 1, glitch: 1, roll: 1, squeak: 1, sub: 1, growl: 0, fm: 0, acidLine: 0, acidRun: 0, acidScream: 1, acidOld: 0, cloud: 0, scan: 0, edit: 1, pad: 1, lead: 0, arp: 0, vox: 0, voxCloud: 0, hiss: 1, air: 1, mode: 4, grainVar: 0, acidVar: 3, voxVar: 0  } },
  { at: 96,  len: 8,  name: 'VOICE LAB', values: { kick: 0, snare: 0, hat: 0, open: 0, click: 1, glitch: 1, roll: 0, squeak: 0, sub: 0, growl: 0, fm: 0, acidLine: 0, acidRun: 0, acidScream: 0, acidOld: 0, cloud: 0, scan: 1, edit: 0, pad: 1, lead: 0, arp: 0, vox: 0, voxCloud: 1, hiss: 1, air: 1, mode: 3, grainVar: 2, acidVar: 0, voxVar: 3  } },
  { at: 104, len: 8,  name: 'ACID',   values: { kick: 1, snare: 1, hat: 1, open: 1, click: 1, glitch: 1, roll: 0, squeak: 0, sub: 1, growl: 1, fm: 0, acidLine: 1, acidRun: 1, acidScream: 1, acidOld: 0, cloud: 1, scan: 0, edit: 0, pad: 1, lead: 1, arp: 1, vox: 0, voxCloud: 0, hiss: 1, air: 1, mode: 5, grainVar: 1, acidVar: 3, voxVar: 0  } },
  { at: 112, len: 16, name: 'MAIN 3', values: { kick: 1, snare: 1, hat: 1, open: 1, click: 1, glitch: 1, roll: 1, squeak: 1, sub: 1, growl: 1, fm: 1, acidLine: 1, acidRun: 1, acidScream: 0, acidOld: 0, cloud: 0, scan: 1, edit: 1, pad: 1, lead: 1, arp: 1, vox: 1, voxCloud: 0, hiss: 1, air: 1, mode: 0, grainVar: 2, acidVar: 2, voxVar: 2  } },
  { at: 128, len: 8,  name: 'OUTRO',  values: { kick: 0, snare: 0, hat: 0, open: 0, click: 1, glitch: 0, roll: 0, squeak: 0, sub: 0, growl: 0, fm: 0, acidLine: 0, acidRun: 0, acidScream: 0, acidOld: 0, cloud: 1, scan: 0, edit: 0, pad: 1, lead: 0, arp: 0, vox: 1, voxCloud: 0, hiss: 1, air: 1, mode: 3, grainVar: 1, acidVar: 0, voxVar: 1  } },
  { at: 136, len: 8,  name: 'OUTRO 2',values: { kick: 0, snare: 0, hat: 0, open: 0, click: 0, glitch: 0, roll: 0, squeak: 0, sub: 0, growl: 0, fm: 0, acidLine: 0, acidRun: 0, acidScream: 0, acidOld: 0, cloud: 1, scan: 0, edit: 0, pad: 1, lead: 0, arp: 0, vox: 0, voxCloud: 0, hiss: 1, air: 1, mode: 3, grainVar: 1, acidVar: 0, voxVar: 0  } },
]

// ── AUTOMATION ─────────────────────────────────────────────────
const AUTOMATION = [
  { path: 'keys.grain.cut',  points: [[0, .7], [8, 1], [24, 1.2], [32, 1.8], [48, 2], [56, 1], [72, 2], [88, 2.4], [96, 1.2], [104, 1.8], [112, 2.2], [128, 1], [136, .5], [144, .3]] },
  { path: 'chords.pad.cut',  points: [[0, .8], [24, 1.2], [32, 1.6], [48, 1.4], [56, 1], [72, 1.8], [88, 1.2], [96, 1.5], [104, 1.8], [112, 2], [128, 1], [144, .3]] },
  { path: 'acid.run.cut',    points: [[0, 1], [24, 0.05], [32, 0.05], [40, 1]] },
  { path: 'acid.line.cut',   points: [[8, .8], [24, 1], [32, 1.6], [48, 1.6], [56, 1], [72, 2], [88, 2.6], [96, 1.2], [104, 2.4], [112, 2], [128, 1], [144, .3]] },
  { path: 'bits.lead.cut',   points: [[24, .8], [32, 1.8], [48, 1.8], [56, 1], [72, 2], [88, 1.2], [104, 2.2], [112, 1.8], [128, 1], [144, .3]] },
  { path: 'bass.sub.cut',    points: [[0, 1], [48, .8], [56, 1], [96, .7], [112, 1], [144, .5]] },
  { path: 'vox.phrase.cut',  points: [[32, 1], [48, 1.2], [56, 1], [72, 1.4], [88, 1], [96, .7], [104, 1], [112, 1.4], [128, .8], [136, .4]] },
  { path: 'vox.cloud.cut',   points: [[88, 1], [96, 1.5], [104, 1], [144, .5]] },
  { path: 'vox.cloud.speed', points: [[96, 1], [98, .6], [100, 1.5], [102, .8], [104, 1]] },
  { path: 'vox.cloud.chop',  points: [[96, 1], [100, 3], [104, 1]] },
  { path: 'grain.edit.cut',  points: [[88, .8], [96, 1.6], [104, 1], [144, .4]] },
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
const grainAuto = autoSwitch('grainVar', grainVar)
// Грануляр: в SONG/HOLD уровень из секции, в LOOP — свитч grain (cloud/scan).
const grainLevel = (key, want) =>
  tlCurve(key).mul(songGate)
    .add(grainAuto.fmap((v) => (v === want ? 1 : 0)).mul(loopGate))
    .add(sectionValue(key).mul(holdGate))
const acidAuto = autoSwitch('acidVar', acidVar)
const voxAuto = autoSwitch('voxVar', voxVar)
const acidLevel = (key, min) =>
  tlCurve(key).mul(songGate)
    .add(acidAuto.fmap((v) => (v >= min ? 1 : 0)).mul(loopGate))
    .add(sectionValue(key).mul(holdGate))
const acidOldLevel = tlOr('acidOld', pure(0))
const voxLevel = (key, min) =>
  tlCurve(key).mul(songGate)
    .add(voxAuto.fmap((v) => (v >= min ? 1 : 0)).mul(loopGate))
    .add(sectionValue(key).mul(holdGate))
// Фраза numbers: dry/chop; в режиме cloud её сменяет гранулярный голос.
const voxPhraseLevel = () =>
  tlCurve('vox').mul(songGate)
    .add(voxAuto.fmap((v) => (v === 1 || v === 2 ? 1 : 0)).mul(loopGate))
    .add(sectionValue('vox').mul(holdGate))
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
const roots = note(m('<c1 c1 db1 db1 gb1 gb1 bb1 bb1>'))
const growlNotes = note(m('<[c1 ~ ~ ~ gb1 ~ ~ ~] [c1 ~ bb0 ~ ~ ~ gb1 ~] [db1 ~ ~ ~ ab0 ~ ~ ~] [db1 ~ g1 ~ ~ ~ eb1 ~] [gb1 ~ ~ ~ c1 ~ ~ ~] [gb1 ~ db1 ~ ~ ~ bb0 ~] [bb1 ~ ~ ~ e1 ~ ~ ~] [bb1 ~ f1 ~ ~ ~ c1 ~]>'))
const fmNotes = note(m('<[c1 ~ ~ c1 ~ ~ gb1 ~] [c1 ~ bb0 ~ ~ ~ gb1 ~] [db1 ~ ~ db1 ~ ~ ab0 ~] [db1 ~ g1 ~ ~ ~ eb1 ~] [gb1 ~ ~ gb1 ~ ~ c1 ~] [gb1 ~ db1 ~ ~ ~ bb0 ~] [bb1 ~ ~ bb1 ~ ~ e1 ~] [bb1 ~ f1 ~ ~ ~ c1 ~]>'))
const acidRiff = note(m('<[c2 ~ c2 gb2 ~ c2 bb1 c2 ~ c2 ~ eb2 c2 ~ gb2 c2 ~] [c2 ~ c2 gb2 ~ c2 bb1 ~ c2 c2 ~ eb2 ~ gb2 ~ c2] [db2 ~ db2 g2 ~ db2 c2 ~ db2 ~ ab1 db2 ~ g2 db2 ~] [bb1 ~ bb1 e2 ~ bb1 f2 ~ bb1 ~ c2 bb1 ~ e2 ~ f2]>'))
const acidNotes = note(m('<[c2 ~ gb2 ~ bb1 ~ gb2 ~] [c2 ~ bb1 ~ ~ gb2 ~ c2] [db2 ~ ~ ab1 ~ db2 ~ ~] [db2 ~ c2 ~ ~ eb2 ~ ~] [gb2 ~ ~ c2 ~ gb2 ~ bb1] [gb2 ~ db2 ~ ~ bb1 ~ ~] [bb1 ~ e2 ~ ~ bb1 ~ f2] [bb1 ~ f2 ~ ~ c2 ~ bb1]>'))
// 8-битная тема: 16 тактов, рваная, без ровных арпеджио. Большие скачки,
// короткие вскрики, паузы; иногда фраза замедляется или едет назад.
const leadTheme = note(m('<[c5 ~ ~ gb6 ~ ~ db7 ~] [~ bb4 ~ ~ f6 ~ ~ ~] [c6 ~ ~ ~ ~ eb7 ~ ~] [~ ~ g5 ~ ~ ~ db7 c6] [eb6 ~ ~ ~ ~ ~ ~ b5] [~ ~ ~ f6 ~ c6 ~ gb6] [db7 ~ ~ ~ ~ ~ bb5 ~] [~ e6 ~ ~ ~ ~ ~ ~ c5] [gb5 ~ ~ db7 ~ ~ ~ ~] [~ ~ f6 ~ ~ c6 ~ ~] [bb6 ~ ~ ~ ~ ~ gb6 ~] [~ ~ e6 ~ ~ ~ ~ db7] [c6 ~ ~ ~ ~ b5 ~ ~] [~ gb6 ~ ~ ~ ~ f6 ~] [eb6 ~ ~ c6 ~ ~ ~ gb5] [~ ~ db7 ~ ~ ~ c6 ~]>'))
const arpChords = note(m('<[c5,gb5,bb5] [c5,gb5,bb5] [db5,ab5,eb6] [db5,ab5,eb6] [gb5,db6,ab6] [gb5,db6,ab6] [bb5,f6,c7] [bb5,f6,c7]>'))
const padNotes = note(m('<[c3,gb3] [c3,gb3] [db3,g3] [db3,g3] [gb3,c4] [gb3,c4] [bb3,e4] [bb3,e4]>'))
const squeakNotes = note(m('<[c6 ~ ~ ~ gb6 ~ ~ ~] [~ ~ bb6 ~ ~ ~ db7 ~] [db7 ~ ~ ~ c6 ~ ~ ~] [~ ~ gb6 ~ ~ ~ bb6 ~] [gb6 ~ ~ ~ c6 ~ ~ ~] [~ ~ db7 ~ ~ ~ bb6 ~] [bb6 ~ ~ ~ e7 ~ ~ ~] [~ ~ f7 ~ ~ ~ c6 ~]>'))

// ── РИТМЫ ───────────────────────────────────────────────────────
const grooves = {
  kick: [
    m('x ~ ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~'),
    m('x ~ ~ x ~ x ~ ~ x ~ x ~ ~ x ~ x'),
    m('x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~'),
    m('x ~ x x ~ x ~ x x ~ x ~ x x ~ x'),
    m('x ~ ~ x x x ~ x x ~ ~ x x x ~ x'),
    m('x ~ ~ x ~ ~ x ~ x ~ ~ x ~ ~ x ~'),
  ],
  snare: [
    m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ x ~ ~ x ~'),
    m('~ ~ x ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x x'),
    m('~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~'),
    m('~ x ~ x x ~ x ~ ~ x ~ x x ~ x ~'),
    m('~ ~ x ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x x'),
    m('~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~ x ~'),
  ],
  hat: [
    m('x*16'),
    m('x*32'),
    m('x*8'),
    m('x*32'),
    m('x*32'),
    m('x*8'),
  ],
}
const groove = (part) => modeAuto.pick(grooves[part])

// ── СЛОИ ────────────────────────────────────────────────────────
$: s('crackle')
  .gain(atmos.hiss.vol.mul(tlOr('hiss')))
  .lpf(atmos.hiss.cut).hpf(atmos.hiss.hpf)
  .room(verb.mul(0.25)).roomsize(fx.reverb.size)
  .mask(gateOf('hiss')).filter(audible)

$: s('pink')
  .gain(atmos.air.vol.mul(tlOr('air')))
  .lpf(atmos.air.cut).hpf(160).lpq(0.8)
  .lpdepth(atmos.air.lfo).lpsync(0.125).lpdc(0)
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .mask(gateOf('air')).filter(audible)

$: s('bd').bank('RolandTR909').struct(groove('kick'))
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .lpf(drums.kick.cut).lpq(1).shape(drums.kick.shape)
  .decay(drums.kick.decay).sustain(0).release(0.04)
  .duckorbit(2).duckdepth(duck).duckattack(0.02)
  .mask(gateOf('kick')).filter(audible)

$: s('sd').bank('RolandTR909').struct(groove('snare'))
  .gain(drums.snare.vol.mul(tlOr('snare')))
  .lpf(drums.snare.cut).hpf(180).lpq(1.2)
  .decay(drums.snare.decay).sustain(0)
  .room(verb.mul(drums.snare.room)).roomsize(fx.reverb.size)
  .mask(gateOf('snare')).filter(audible)

$: s('hh').bank('RolandTR909').struct(groove('hat'))
  .swingBy(drums.hat.swing, 8)
  .gain(drums.hat.vol.mul(tlOr('hat')).mul(m('<.8 .3 .6 .25 .7 .3 .55 .2>')))
  .lpf(drums.hat.cut).hpf(600).lpq(1)
  .decay(drums.hat.decay).sustain(0)
  .delay(verb.mul(0.05)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.3))
  .mask(gateOf('hat')).filter(audible)

$: s('oh').bank('RolandTR909').struct('~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~')
  .gain(drums.open.vol.mul(tlOr('open')))
  .lpf(drums.open.cut).hpf(500)
  .decay(drums.open.decay).sustain(0)
  .room(verb.mul(0.2)).roomsize(fx.reverb.size)
  .mask(gateOf('open')).filter(audible)

$: s('click:0')
  .struct('~ x ~ ~ x ~ ~ x ~ ~ x ~ ~ x ~ x')
  .gain(drums.click.vol.mul(tlOr('click')))
  .lpf(drums.click.cut).hpf(2200)
  .decay(0.03).sustain(0)
  .pan(rand.mul(1.6).sub(0.8))
  .delay(drums.click.echo.mul(0.4)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.5))
  .room(verb.mul(0.2)).roomsize(fx.reverb.size)
  .mask(gateOf('click')).filter(audible)

// GHOSTS — призраки с вероятностью mutate (не «рандом вместо грува»).
$: s('sd').bank('RolandTR909').struct('x*16')
  .degradeBy(mutate.fmap((p) => 1 - p))
  .gain(drums.snare.vol.mul(0.18).mul(tlOr('snare')))
  .lpf(4200).hpf(400)
  .decay(0.05).sustain(0)
  .pan(rand.mul(1.2).sub(0.6))
  .mask(gateOf('snare')).filter(audible)

$: s('glitch').n('0 1 0 2 1 0 3 0')
  .struct('x ~ x ~ ~ x ~ x ~ x ~ ~ x ~ x ~')
  .gain(drums.glitch.vol.mul(tlOr('glitch')))
  .speed(rand.range(0.7, 1.4))
  .lpf(drums.glitch.cut).hpf(500)
  .decay(0.04).sustain(0)
  .pan(rand.mul(1.6).sub(0.8))
  .delay(verb.mul(0.08)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.4))
  .degradeBy(drums.glitch.prob.fmap((p) => 1 - p))
  .room(verb.mul(0.15)).roomsize(fx.reverb.size)
  .mask(gateOf('glitch')).filter(audible)

$: s('sd').bank('RolandTR909').struct('~*24 x*8')
  .gain(drums.roll.vol.mul(tlOr('roll')))
  .lpf(drums.roll.cut).hpf(220)
  .decay(drums.roll.decay).sustain(0)
  .pan(rand.mul(0.4).sub(0.2))
  .room(verb.mul(0.1)).roomsize(fx.reverb.size)
  .mask(gateOf('roll')).filter(audible)

$: squeakNotes
  .s('sine')
  .fm(1.8).fmh(3.01).fmdecay(0.05).fmsustain(0)
  .penv(12).panchor(1).pattack(0.001).pdecay(0.04).psustain(0)
  .gain(drums.squeak.vol.mul(tlOr('squeak')))
  .lpf(drums.squeak.cut).hpf(1200)
  .decay(0.06).sustain(0)
  .pan(rand.mul(1.4).sub(0.7))
  .delay(verb.mul(0.08)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.5))
  .degradeBy(drums.squeak.prob.fmap((p) => 1 - p))
  .room(verb.mul(0.12)).roomsize(fx.reverb.size)
  .mask(gateOf('squeak')).filter(audible)

$: roots.struct('x ~ ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ ~ ~')
  .s('sine')
  .gain(bass.sub.vol.mul(tlOr('sub')))
  .lpf(bass.sub.cut.mul(autoAt('bass.sub.cut'))).lpq(1).shape(0.08)
  .attack(0.01).decay(bass.sub.decay).sustain(0.7).release(0.2)
  .orbit(2).duckorbit(2).duckdepth(duck).duckattack(0.01)
  .mask(gateOf('sub')).filter(audible)

$: growlNotes
  .s('sawtooth').unison(2).detune(bass.growl.det)
  .gain(bass.growl.vol.mul(tlOr('growl')))
  .lpf(bass.growl.cut).lpq(bass.growl.q).ftype('24db')
  .shape(bass.growl.grit)
  .attack(0.01).decay(bass.growl.decay).sustain(0.5).release(0.25)
  .orbit(2).duckorbit(2).duckdepth(duck.mul(0.8)).duckattack(0.01)
  .mask(gateOf('growl')).filter(audible)

$: fmNotes
  .s('triangle')
  .fm(bass.fm.index).fmh(bass.fm.ratio).fmdecay(bass.fm.decay).fmsustain(0)
  .gain(bass.fm.vol.mul(tlOr('fm')))
  .lpf(bass.fm.cut).hpf(40).lpq(1)
  .decay(bass.fm.decay).sustain(0).release(0.08)
  .orbit(2)
  .mask(gateOf('fm')).filter(audible)

$: acidNotes
  .s('sawtooth')
  .lpf(acid.line.cut.mul(autoAt('acid.line.cut'))).lpq(acid.line.res).ftype('ladder')
  .drive(acid.line.drive)
  .lpenv(acid.line.env).lpa(0.002).lpd(acid.line.decay).lpsustain(0.12)
  .decay(acid.line.decay).sustain(0.2).release(0.03)
  .gain(acid.line.vol.mul(acidLevel('acidLine', 1)))
  .delay(acid.line.echo.mul(0.5)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.5))
  .room(verb.mul(0.25)).roomsize(fx.reverb.size)
  .orbit(2)
  .mask(acidLevel('acidLine', 1).fmap((v) => v > 0.001)).filter(audible)

// 303 RUN — не редкие ноты, а ритмичный рифф: 16-е с синкопами, без
// питч-«пяу»; фильтр двигается огибающей, но атака короткая. Октава — слайдер.
$: acidRiff
  .add(note(acid.run.oct.mul(12)))
  .sometimesBy(0.16, (x) => x.add(note(12)))
  .degradeBy(0.05)
  .s('sawtooth')
  .lpf(acid.run.cut.mul(autoAt('acid.line.cut'))).lpq(acid.run.res).ftype('24db')
  .drive(acid.run.drive)
  .lpenv(acid.run.env).lpa(0.004).lpd(acid.run.decay).lpsustain(0.04)
  .decay(acid.run.decay).sustain(0.04).release(0.02)
  .gain(acid.run.vol.mul(acidLevel('acidRun', 2)))
  .delay(acid.run.echo.mul(0.5)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.4))
  .room(verb.mul(0.18)).roomsize(fx.reverb.size)
  .orbit(2)
  .mask(acidLevel('acidRun', 2).fmap((v) => v > 0.001)).filter(audible)

$: acidNotes.add(note(12))
  .s('square')
  .lpf(acid.scream.cut.mul(autoAt('acid.line.cut'))).lpq(acid.scream.res).ftype('24db')
  .lpenv(acid.scream.env).lpa(0.002).lpd(acid.scream.decay).lpsustain(0.05)
  .shape(acid.scream.shape).crush(acid.scream.crush)
  .decay(acid.scream.decay).sustain(0.1).release(0.02)
  .gain(acid.scream.vol.mul(acidLevel('acidScream', 3)))
  .delay(acid.scream.echo.mul(0.5)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.6))
  .room(verb.mul(0.2)).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.35, 0.65))
  .orbit(2)
  .mask(acidLevel('acidScream', 3).fmap((v) => v > 0.001)).filter(audible)

$: s('<padlong@4 space@4>')
  .begin(grain.cloud.scan)
  .end(grain.cloud.scan.add(grain.cloud.window))
  .chop(grain.cloud.chop)
  .speed(grain.cloud.speed)
  .fast(grain.cloud.density)
  .gain(grain.cloud.vol.mul(grainLevel('cloud', 1)))
  .lpf(grain.cloud.cut.mul(autoAt('keys.grain.cut'))).hpf(grain.cloud.hpf).lpq(1)
  .pan(rand.mul(0.4).sub(0.2))
  .delay(grain.cloud.delay.mul(0.5)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback)
  .room(verb.mul(0.15)).roomsize(fx.reverb.size)
  .mask(grainLevel('cloud', 1).fmap((v) => v > 0.001)).filter(audible)

$: s('space')
  .begin(sine.slow(grain.scan.rate).range(0.05, 0.82))
  .end(sine.slow(grain.scan.rate).range(0.05, 0.82).add(grain.scan.window))
  .chop(grain.scan.chop)
  .speed(grain.scan.speed)
  .gain(grain.scan.vol.mul(grainLevel('scan', 2)))
  .lpf(grain.scan.cut.mul(autoAt('keys.grain.cut'))).hpf(grain.scan.hpf).lpq(1)
  .pan(rand.mul(0.5).sub(0.25))
  .delay(verb.mul(0.1)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.6))
  .room(verb.mul(0.1)).roomsize(fx.reverb.size)
  .mask(grainLevel('scan', 2).fmap((v) => v > 0.001)).filter(audible)

// 303 OLD — старый разреженный рисунок для BUILD: не суета, срез в минимум.
$: acidNotes.add(note(12))
  .s('sawtooth')
  .lpf(acid.run.cut.mul(autoAt('acid.run.cut'))).lpq(acid.run.res).ftype('24db')
  .lpenv(acid.run.env).lpa(0.004).lpd(acid.run.decay).lpsustain(0.05)
  .decay(acid.run.decay).sustain(0.08).release(0.03)
  .gain(acid.run.vol.mul(acidOldLevel))
  .delay(acid.run.echo.mul(0.5)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.4))
  .room(verb.mul(0.18)).roomsize(fx.reverb.size)
  .orbit(2)
  .mask(acidOldLevel.fmap((v) => v > 0.001)).filter(audible)

$: s('glitch').n('0 1 0 2 1 0 3 0')
  .slice(grain.edit.slice, '0 3 7 1 15 2 8 4')
  .speed(grain.edit.speed.mul(rand.range(0.7, 1.3)))
  .gain(grain.edit.vol.mul(tlOr('edit', pure(0))))
  .lpf(grain.edit.cut.mul(autoAt('grain.edit.cut'))).hpf(grain.edit.hpf)
  .decay(0.04).sustain(0)
  .pan(rand.mul(1.6).sub(0.8))
  .delay(verb.mul(0.1)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.5))
  .degradeBy(grain.edit.prob.fmap((p) => 1 - p))
  .room(verb.mul(0.15)).roomsize(fx.reverb.size)
  .mask(gateOf('edit')).filter(audible)

$: leadTheme
  .sometimesBy(0.22, (x) => x.add(note(12)))
  .sometimesBy(0.14, (x) => x.rev())
  .sometimesBy(0.12, (x) => x.slow(2))
  .sometimesBy(0.10, (x) => x.ply(2))
  .s('pulse').pw(bits.lead.pw)
  .crush(bits.lead.crush)
  .gain(bits.lead.vol.mul(tlOr('lead')))
  .lpf(bits.lead.cut.mul(autoAt('bits.lead.cut'))).hpf(400)
  .decay(bits.lead.decay).sustain(0)
  .delay(bits.lead.echo.mul(0.5)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.5))
  .degradeBy(0.2)
  .room(verb.mul(0.12)).roomsize(fx.reverb.size)
  .pan(rand.mul(1.2).sub(0.6))
  .mask(gateOf('lead')).filter(audible)

$: arpChords.arp('0 1 2 1 2 3 2 1')
  .s('square').pw(bits.arp.pw)
  .gain(bits.arp.vol.mul(tlOr('arp')))
  .lpf(bits.arp.cut.mul(autoAt('bits.lead.cut'))).hpf(500)
  .decay(bits.arp.decay).sustain(0)
  .pan(sine.slow(12).range(0.35, 0.65))
  .delay(bits.arp.echo.mul(0.5)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.55))
  .degradeBy(0.15)
  .room(verb.mul(0.1)).roomsize(fx.reverb.size)
  .mask(gateOf('arp')).filter(audible)

$: s('numbers')
  .n('<0 1 2 3 4 5 6 7 8>')
  .clip(vox.phrase.clip)
  .chop(vox.phrase.chop.mul(voxAuto.fmap((v) => (v === 2 ? 1 : 0))).add(1))
  .gain(vox.phrase.vol.mul(voxPhraseLevel()))
  .lpf(vox.phrase.cut.mul(autoAt('vox.phrase.cut'))).hpf(vox.phrase.hpf).lpq(1)
  .delay(vox.phrase.echo.mul(0.5)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback)
  .room(vox.phrase.room.mul(verb)).roomsize(fx.reverb.size)
  .mask(voxPhraseLevel().fmap((v) => v > 0.001)).filter(audible)

$: s('numbers').n('<0 1 2 3 4 5 6 7 8>')
  .chop(vox.cloud.chop.mul(autoAt('vox.cloud.chop')))
  .speed(vox.cloud.speed.mul(autoAt('vox.cloud.speed')))
  .fast(vox.cloud.density)
  .gain(vox.cloud.vol.mul(voxLevel('voxCloud', 3)))
  .lpf(vox.cloud.cut.mul(autoAt('vox.cloud.cut'))).hpf(vox.cloud.hpf)
  .vowel('a')
  .delay(vox.cloud.echo.mul(0.5)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback)
  .room(vox.cloud.room.mul(verb)).roomsize(fx.reverb.size)
  .pan(rand.mul(1.2).sub(0.6))
  .mask(voxLevel('voxCloud', 3).fmap((v) => v > 0.001)).filter(audible)

$: padNotes
  .s('sawtooth').partials([1, 0.5, 0.3, 0.15]).unison(2).detune(chords.pad.det)
  .gain(chords.pad.vol.mul(tlOr('pad')))
  .lpf(chords.pad.cut.mul(autoAt('chords.pad.cut'))).hpf(chords.pad.hpf).lpq(chords.pad.q).ftype('24db')
  .lpdepth(chords.pad.lfo).lpsync(0.25).lpdc(0)
  .chorus(0.25)
  .attack(1.2).decay(1.0).sustain(0.8).release(2.2)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('pad')).filter(audible)
