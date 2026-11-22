// TECHNO 22 v2 · DARK TRANCE 160 · e-фригийский · 96 тактов
// Форма — в TIMELINE, автоматика — нативная (arrange/pure/saw.range).
// INTRO → BUILD → ROLL → DROP → BREAK → BUILD2 → DROP2 → PEAK → OUTRO.
// База 22 сохранена: e-фригийский, габбер-акцент на «и» 4-й, psy-бас,
// acid-рифф, супер-пила-пэд, грануляр Кафки. Новое — мелодии из примеров
// honcoops/strudel_trance, транспонированные в e-фригийский:
//   EX3/EX6  — роллинг-бас 16-ми (два рисунка, свитч bassVar)
//   EX7/EX4  — широкое арпеджио (low/high, свитч arpVar)
//   EX9      — euphoric pluck на паузах BREAK/PEAK/OUTRO
//   EX12     — string machine в BREAK/DROP2/PEAK
//   EX6      — пентатонический лид для DROP2/PEAK (свитч leadVar)
//   EX3      — snare roll (BUILD2) + noise riser (BUILD/ROLL/BUILD2)
setcpm(160 / 4)

const BPM = 160

if (typeof samples === 'function') {
  const CDN = 'https://cdn.jsdelivr.net/gh/tidalcycles/uzu-drumkit@main/'
  samples({
    bd: ['bd/11_bd_mot4i.wav'], cp: ['cp/10_cp_switchangel.wav'],
    sd: ['sd/11_sd_switchangel_3.wav', 'sd/12_sd_switchangel_2.wav'],
    hh: ['hh/10_hh_switchangel.wav', 'hh/11_hh_mot4i.wav'],
    oh: ['oh/10_oh_switchangel.wav'], rim: ['rim/10_rim_switchangel.wav'],
  }, CDN)
  // Локальный голос: Кафка, «Ein Käfig ging einen Vogel suchen.» (public domain).
  samples({ dequote: ['samples/de-quote/kafka.wav'] }, './')
}

// UI-манифест для панели: обычный JS-объект, строки — одинарные.
const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
  switches: {
    mode: ['straight', 'rolling', 'broken', 'roll'],
    bassVar: ['roll', 'kick'],
    leadVar: ['acid', 'penta'],
    arpVar: ['low', 'high'],
  },
}

// ── переключатели ────────────────────────────────────────────────
const play = slider(1, 0, 2, 1)      // 0 LOOP, 1 SONG, 2 HOLD
const mode = slider(0, 0, 3, 1)      // 4 грува
const bassVar = slider(0, 0, 1, 1)   // roll / kick
const leadVar = slider(0, 0, 1, 1)   // acid / penta
const arpVar = slider(0, 0, 1, 1)    // low / high
const holdBar = slider(0, 0, 95, 1)

// ── глобальные ───────────────────────────────────────────────────
const verb = slider(0.62, 0, 1, 0.01)

const instruments = {
  drums: {
    kick: {
      name: 'Kick',
      vol: slider(0.46, 0, 0.8, 0.01),
      cut: slider(160, 60, 2000, 10),
      drive: slider(0.4, 0, 1, 0.01),
      decay: slider(0.32, 0.1, 1, 0.01),
      tune: slider(1, 0.6, 1.3, 0.01),
    },
    gab: {
      name: 'Gabber',
      vol: slider(0.44, 0, 0.8, 0.01),
    },
    hats: {
      name: 'Hats',
      vol: slider(0.15, 0, 0.5, 0.01),
      cut: slider(9000, 1000, 16000, 100),
      decay: slider(0.03, 0.01, 0.15, 0.005),
    },
    oh: {
      name: 'Open hat',
      vol: slider(0.11, 0, 0.4, 0.01),
      cut: slider(6000, 800, 16000, 100),
      decay: slider(0.12, 0.03, 0.5, 0.01),
    },
    clap: {
      name: 'Clap',
      vol: slider(0.32, 0, 0.7, 0.01),
      cut: slider(3600, 600, 12000, 100),
      decay: slider(0.13, 0.03, 0.4, 0.01),
    },
    rim: {
      name: 'Rim',
      vol: slider(0.14, 0, 0.5, 0.01),
      cut: slider(3000, 400, 12000, 100),
      decay: slider(0.05, 0.01, 0.2, 0.005),
      echo: slider(0.2, 0, 0.7, 0.01),
    },
    roll: {
      name: 'Snare roll',
      vol: slider(0.18, 0, 0.6, 0.01),
      cut: slider(4200, 800, 12000, 50),
      decay: slider(0.08, 0.02, 0.3, 0.005),
    },
  },
  low: {
    bass: {
      name: 'Bass',
      vol: slider(0.30, 0, 1, 0.01),
      cut: slider(80, 40, 80, 1),          // бас не выше 80
      res: slider(12, 0, 20, 0.5),
      env: slider(3.6, 0, 8, 0.1),
      decay: slider(0.09, 0.03, 0.6, 0.01),
      drive: slider(1.6, 0, 4, 0.05),
      det: slider(0.06, 0, 0.2, 0.005),
    },
    sub: {
      name: 'Sub',
      vol: slider(0.24, 0, 1, 0.01),
      cut: slider(70, 40, 100, 1),
      decay: slider(0.22, 0.05, 0.8, 0.01),
    },
  },
  keys: {
    pad: {
      name: 'Pad',
      vol: slider(0.18, 0, 0.7, 0.01),
      cut: slider(700, 80, 5000, 10),
      res: slider(5, 0, 20, 0.5),
      det: slider(0.35, 0, 0.6, 0.01),
      atk: slider(1.2, 0.1, 6, 0.1),
      rel: slider(3, 0.2, 8, 0.1),
    },
    drone: {
      name: 'Drone',
      vol: slider(0.12, 0, 0.5, 0.01),
      cut: slider(140, 50, 1000, 5),
      det: slider(0.08, 0, 0.4, 0.01),
    },
    strings: {
      name: 'Strings',
      vol: slider(0.14, 0, 0.5, 0.01),
      cut: slider(2400, 400, 8000, 20),
      atk: slider(0.6, 0.05, 3, 0.05),
      rel: slider(2.4, 0.3, 6, 0.1),
      chorus: slider(0.6, 0, 1, 0.01),
    },
    arp: {
      name: 'Arp',
      vol: slider(0.16, 0, 0.5, 0.01),
      cut: slider(3200, 400, 8000, 20),
      q: slider(3, 0.5, 16, 0.5),
      decay: slider(0.07, 0.02, 0.3, 0.005),
      echo: slider(0.36, 0, 0.8, 0.01),
    },
    pluck: {
      name: 'Pluck',
      vol: slider(0.34, 0, 0.7, 0.01),
      cut: slider(4000, 600, 9000, 20),
      hpf: slider(800, 200, 2500, 10),
      decay: slider(0.06, 0.02, 0.3, 0.005),
      echo: slider(0.42, 0, 0.85, 0.01),
    },
    lead: {
      name: 'Lead',
      vol: slider(0.30, 0, 0.7, 0.01),
      cut: slider(1600, 150, 6000, 10),
      res: slider(14, 0, 20, 0.5),
      env: slider(4, 0, 8, 0.1),
      decay: slider(0.08, 0.02, 0.4, 0.005),
      echo: slider(0.45, 0, 0.85, 0.01),
    },
  },
  atmos: {
    air: {
      name: 'Air',
      vol: slider(0.06, 0, 0.3, 0.005),
      cut: slider(9000, 1000, 16000, 100),
      lfo: slider(1, 0, 4, 0.05),
    },
    riser: {
      name: 'Riser',
      vol: slider(0.07, 0, 0.4, 0.01),
      cut: slider(6000, 800, 12000, 20),
      hpf: slider(400, 100, 2000, 10),
    },
  },
  vox: {
    quote: {
      name: 'Kafka (de)',
      vol: slider(0.32, 0, 1, 0.01),
      begin: slider(0, 0, 1, 0.01),
      end: slider(1, 0, 1, 0.01),
      speed: slider(1, 0.5, 1.6, 0.01),
      striate: slider(24, 4, 64, 1),
      clip: slider(1, 0.05, 2, 0.01),
      cut: slider(4200, 400, 14000, 20),
      hpf: slider(180, 40, 1200, 10),
      res: slider(1, 0, 16, 0.5),
      pan: slider(0, 0, 1, 0.01),
      echo: slider(0.35, 0, 0.8, 0.01),
      room: slider(0.6, 0, 1, 0.01),
      revProb: slider(0.3, 0, 1, 0.01),
      degradeBy: slider(0, 0, 0.8, 0.01),
    },
  },
  fx: {
    reverb: { size: slider(9, 2, 16, 0.5) },
    delay: {
      time: slider(0.375, 0.125, 0.75, 0.005),
      feedback: slider(0.4, 0, 0.8, 0.01),
    },
  },
}
const { drums, low, keys, atmos, vox, fx } = instruments

// ── TIMELINE: 96 тактов. Значения — включён/выключен для слоёв;
//    mode/bassVar/leadVar/arpVar — состояние свитчей в секции.
const TIMELINE = [
  { at: 0,  len: 8,  name: 'INTRO',  values: { kick: 1, gab: 0, hats: 0, oh: 0, clap: 0, rim: 0, roll: 0, bass: 0, sub: 0, pad: 1, drone: 1, strings: 0, arp: 0, pluck: 1, lead: 0, air: 1, riser: 0, vox: 0, mode: 0, bassVar: 0, leadVar: 0, arpVar: 0 } },
  { at: 8,  len: 8,  name: 'BUILD',  values: { kick: 1, gab: 0, hats: 1, oh: 0, clap: 0, rim: 1, roll: 0, bass: 1, sub: 0, pad: 1, drone: 1, strings: 0, arp: 0, pluck: 1, lead: 0, air: 1, riser: 1, vox: 0, mode: 0, bassVar: 0, leadVar: 0, arpVar: 0 } },
  { at: 16, len: 8,  name: 'ROLL',   values: { kick: 1, gab: 0, hats: 1, oh: 1, clap: 1, rim: 1, roll: 0, bass: 1, sub: 1, pad: 1, drone: 1, strings: 0, arp: 1, pluck: 0, lead: 0, air: 1, riser: 1, vox: 0, mode: 1, bassVar: 0, leadVar: 0, arpVar: 0 } },
  { at: 24, len: 16, name: 'DROP',   values: { kick: 1, gab: 1, hats: 1, oh: 1, clap: 1, rim: 1, roll: 0, bass: 1, sub: 1, pad: 1, drone: 0, strings: 0, arp: 1, pluck: 0, lead: 1, air: 1, riser: 0, vox: 0, mode: 1, bassVar: 1, leadVar: 0, arpVar: 0 } },
  { at: 40, len: 8,  name: 'BREAK',  values: { kick: 0, gab: 0, hats: 0, oh: 0, clap: 0, rim: 0, roll: 0, bass: 0, sub: 0, pad: 1, drone: 1, strings: 1, arp: 0, pluck: 1, lead: 0, air: 1, riser: 0, vox: 1, mode: 0, bassVar: 0, leadVar: 0, arpVar: 0 } },
  { at: 48, len: 8,  name: 'BUILD2', values: { kick: 1, gab: 0, hats: 1, oh: 0, clap: 1, rim: 1, roll: 1, bass: 1, sub: 1, pad: 1, drone: 0, strings: 0, arp: 1, pluck: 0, lead: 0, air: 1, riser: 1, vox: 0, mode: 3, bassVar: 0, leadVar: 0, arpVar: 0 } },
  { at: 56, len: 16, name: 'DROP 2', values: { kick: 1, gab: 1, hats: 1, oh: 1, clap: 1, rim: 1, roll: 0, bass: 1, sub: 1, pad: 1, drone: 0, strings: 1, arp: 1, pluck: 0, lead: 1, air: 1, riser: 0, vox: 0, mode: 1, bassVar: 1, leadVar: 1, arpVar: 1 } },
  { at: 72, len: 16, name: 'PEAK',   values: { kick: 1, gab: 1, hats: 1, oh: 1, clap: 1, rim: 1, roll: 0, bass: 1, sub: 1, pad: 1, drone: 0, strings: 1, arp: 1, pluck: 1, lead: 1, air: 1, riser: 0, vox: 1, mode: 2, bassVar: 1, leadVar: 1, arpVar: 1 } },
  { at: 88, len: 8,  name: 'OUTRO',  values: { kick: 1, gab: 0, hats: 0, oh: 0, clap: 0, rim: 0, roll: 0, bass: 0, sub: 0, pad: 1, drone: 1, strings: 1, arp: 0, pluck: 1, lead: 0, air: 1, riser: 0, vox: 0, mode: 0, bassVar: 0, leadVar: 0, arpVar: 0 } },
]

// ── AUTOMATION: только срезы; уровни инструментов постоянны ──────
const AUTOMATION = [
  { path: 'keys.pad.cut',     points: [[0, 0.5], [8, 0.9], [24, 0.8], [40, 0.5], [56, 1], [72, 1.4], [88, 0.8], [96, 0.3]] },
  { path: 'keys.strings.cut', points: [[40, 0.8], [48, 1.1], [56, 1.3], [72, 1.8], [88, 1], [96, 0.3]] },
  { path: 'keys.arp.cut',     points: [[0, 0.4], [16, 0.8], [24, 1.2], [40, 1.5], [48, 0.7], [56, 1.2], [72, 1.8], [88, 1], [96, 0.3]] },
  { path: 'keys.pluck.cut',   points: [[0, 0.6], [16, 1], [24, 1.1], [40, 1.4], [48, 0.8], [56, 1.3], [72, 1.7], [88, 1], [96, 0.3]] },
  { path: 'keys.lead.cut',    points: [[24, 0.6], [40, 1.2], [56, 1], [72, 1.5], [88, 1], [96, 0.3]] },
  { path: 'low.bass.cut',     points: [[0, 0.7], [16, 0.9], [24, 1], [40, 0.8], [56, 1], [72, 1], [88, 0.8], [96, 0.4]] },
  { path: 'atmos.air.cut',    points: [[0, 0.6], [24, 1], [40, 1.3], [56, 0.8], [72, 1.6], [88, 0.8], [96, 0.3]] },
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

// ── МАТЕРИАЛ: e-фригийский, i–bII–bIII–bVII (Em–F–G–Dm) ─────────
// Никакой доминанты: bII (F) даёт фригийскую тень, bVII (Dm) — модальный ход.
const CHORDS = note(m('<[e3,g3,b3] [f3,a3,c4] [g3,b3,d4] [d3,f3,a3]>'))
const ROOTS = note(m('<e1 f1 g1 d1>'))

// EX3: роллинг-бас 16-ми, 16 нот на такт — одна гармония на такт.
const bassRoll = note(m('<[e2 e2 g2 e2 e2 f2 e2 g2 e2 e2 g2 e2 e2 f2 e2 g2] [f2 f2 a2 f2 f2 g2 f2 a2 f2 f2 a2 f2 f2 e2 f2 a2] [g2 g2 b2 g2 g2 a2 g2 b2 g2 g2 b2 g2 g2 f2 g2 b2] [d2 d2 f2 d2 d2 e2 d2 f2 d2 d2 f2 d2 d2 e2 d2 f2]>'))
// EX6/22: KBBB — удар на доле, пропуск, три 16-х.
const bassKick = ROOTS.struct(m('~ x x x ~ x x x ~ x x x ~ x x x'))

// EX7/EX4: широкое арпеджио по аккордам, 16 нот на такт;
// low — восходящий, high — октавой выше и с изломом.
const arpLow = note(m('<[e4 g4 b4 e5 g5 b5 e6 b5 g5 e5 b5 g5 e5 b4 g4 e4] [f4 a4 c5 f5 a5 c5 a5 f5 c5 a5 f5 c5 a4 f4 a4 c5] [g4 b4 d5 g5 b5 d5 b5 g5 d5 b5 g5 d5 b4 g4 b4 d5] [d4 f4 a4 d5 f5 a5 f5 d5 a5 f5 d5 a4 f4 d4 f4 a4]>'))
const arpHigh = note(m('<[b5 g5 e5 b4 g4 e4 g4 b4 e5 g5 b5 g5 e5 b5 g5 e5] [c6 a5 f5 c5 a4 f4 a4 c5 f5 a5 c6 a5 f5 c6 a5 f5] [d6 b5 g5 d5 b5 g5 b5 d5 g5 b5 d6 b5 g5 d6 b5 g5] [a5 f5 d5 a4 f4 d4 f4 a4 d5 f5 a5 f5 d5 a5 f5 d5]>'))

// EX9: euphoric pluck; паузы — часть мелодии.
const pluckLine = note(m('<[e5 ~ g5 ~ b5 g5 a5 g5] [f5 ~ a5 ~ c6 a5 g5 f5] [g5 ~ b5 ~ d6 b5 a5 g5] [d5 ~ f5 ~ a5 f5 e5 d5]>'))

// EX12: string machine — длинные аккорды, октавой выше пэда.
const stringsLine = CHORDS.add(note(12))

// EX6: пентатонический лид для второго дропа, 4 такта.
const pentaLine = note(m('<[e4 c4 d4 e4 g4 e4 d4 c4] [a4 g4 e4 d4 c4 d4 e4 g4] [e4 g4 a4 c5 a4 g4 e4 d4] [c4 d4 e4 g4 e4 d4 c4 ~]>'))

// Acid: тот же e-фригийский рифф, +1 (b2) и +6 (тритон) — намеренно.
const acidLine = note(m('e2 e2 f2 g2 bb2 a2 g2 f2')).fast(2)
  .sometimesBy(0.22, (x) => x.add(note(1)))
  .sometimesBy(0.14, (x) => x.add(note(6)))
  .degradeBy(0.08)

const bassLine = bassAuto.pick([bassRoll, bassKick])
const arpLine = arpAuto.pick([arpLow, arpHigh])
const leadLine = leadAuto.pick([acidLine, pentaLine])

// ── РИТМЫ (grooves): mode 0..3 ──────────────────────────────────
const grooves = {
  hat: [
    m('x*16'),
    m('x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~'),
    m('x ~ ~ x ~ x ~ ~ x ~ x ~ ~ x ~ x'),
    m('x*16'),
  ],
  clap: [
    m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
    m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ x'),
    m('~ ~ x ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~'),
    m('~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~'),
  ],
  rim: [
    m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
    m('~ ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'),
    m('~ ~ x ~ ~ x ~ ~ x ~ ~ x ~ x ~ x'),
    m('~ ~ ~ x ~ ~ x ~ ~ x ~ ~ x ~ ~ x'),
  ],
}
const groove = (part) => modeAuto.pick(grooves[part])

// ── СЛОИ ────────────────────────────────────────────────────────

// Kick — 4-on-floor, дисторшн, дакает orbit 2.
$: s('bd').struct(m('x*4'))
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .lpf(drums.kick.cut).lpq(1).distort(drums.kick.drive.mul(6))
  .speed(drums.kick.tune)
  .decay(drums.kick.decay).sustain(0).release(0.05)
  .duckorbit(2).duckdepth(0.8).duckattack(0.02)
  .mask(gateOf('kick')).filter(audible)

// Габбер — тот же кик, другой рисунок: «и» 4-й (шаг 14) раз в 4 такта.
$: s('bd').struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~')).mask(m('<0 0 0 1>'))
  .gain(drums.gab.vol.mul(tlOr('gab')))
  .lpf(drums.kick.cut).lpq(1).distort(drums.kick.drive.mul(6))
  .speed(drums.kick.tune)
  .decay(drums.kick.decay).sustain(0).release(0.05)
  .duckorbit(2).duckdepth(0.8).duckattack(0.02)
  .mask(gateOf('gab')).filter(audible)

// Hats — 16-е с акцентами; mode меняет рисунок.
$: s('hh').struct(groove('hat')).n(run(8))
  .every(16, (x) => x.stut(3, 1/32, 0.9))
  .gain(drums.hats.vol.mul(tlOr('hats')).mul(m('[.85 .25 .5 .3]*4')))
  .lpf(drums.hats.cut).hpf(900).clip(sine.slow(8).range(0.08, 0.3))
  .decay(drums.hats.decay).sustain(0).swingBy(0.07, 8)
  .mask(gateOf('hats')).filter(audible)

// Open hat — оффбит, короткая комната.
$: s('oh').struct(m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'))
  .gain(drums.oh.vol.mul(tlOr('oh')))
  .lpf(drums.oh.cut).decay(drums.oh.decay).sustain(0)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('oh')).filter(audible)

// Clap — на 2 и 4; mode 2/3 сдвигает акценты.
$: s('cp').struct(groove('clap'))
  .sometimesBy(0.3, (x) => x.stut(2, 1/16, 0.85))
  .gain(drums.clap.vol.mul(tlOr('clap')))
  .lpf(drums.clap.cut).lpq(3).decay(drums.clap.decay).sustain(0)
  .room(verb.mul(0.55)).roomsize(fx.reverb.size)
  .mask(gateOf('clap')).filter(audible)

// Rim — синкопы, эхо в дилее.
$: s('rim').struct(groove('rim'))
  .gain(drums.rim.vol.mul(tlOr('rim')))
  .lpf(drums.rim.cut).hpf(600).decay(drums.rim.decay).sustain(0)
  .delay(drums.rim.echo).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.75))
  .mask(gateOf('rim')).filter(audible)

// Snare roll для BUILD2: 16-е с нарастающим акцентом, только в секции.
$: s('sd').struct(m('x*16'))
  .gain(drums.roll.vol.mul(tlOr('roll', pure(0))).mul(m('[.35 .5 .65 .8]*4')))
  .lpf(drums.roll.cut).hpf(180).decay(drums.roll.decay).sustain(0)
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .mask(gateOf('roll', pure(0))).filter(audible)

// Bass — роллинг 16-ми (EX3) или KBBB (EX6/22), свитч bassVar.
$: bassLine
  .sometimesBy(0.18, (x) => x.add(note(12)))
  .s('sawtooth').unison(2).detune(low.bass.det)
  .gain(low.bass.vol.mul(tlOr('bass')))
  .lpf(low.bass.cut.mul(autoAt('low.bass.cut')).mul(perlin.slow(8).range(0.8, 1.1))).lpq(low.bass.res).ftype('24db')
  .lpenv(low.bass.env).lpa(0.004).lpd(low.bass.decay).lpsustain(0.1)
  .distort(low.bass.drive)
  .clip(0.92)
  .attack(0.002).decay(0.09).sustain(0.2).release(0.04)
  .orbit(2)
  .mask(gateOf('bass')).filter(audible)

// Sub — вес; 4 доли, sine, дакается киком.
$: ROOTS.struct(m('x*4')).s('sine')
  .gain(low.sub.vol.mul(tlOr('sub')))
  .lpf(low.sub.cut).lpq(1)
  .attack(0.006).decay(low.sub.decay).sustain(0.45).release(0.1)
  .orbit(2)
  .mask(gateOf('sub')).filter(audible)

// Пэд — аккорды DO (1 такт), супер-пила; срез ведёт автоматика.
$: CHORDS.s('supersaw').unison(5).detune(keys.pad.det)
  .gain(keys.pad.vol.mul(tlOr('pad')))
  .lpf(keys.pad.cut.mul(autoAt('keys.pad.cut')).mul(perlin.slow(16).range(0.6, 1.4))).lpq(keys.pad.res)
  .attack(keys.pad.atk).decay(1.4).sustain(0.85).release(keys.pad.rel)
  .room(verb.mul(0.9)).roomsize(fx.reverb.size)
  .mask(gateOf('pad')).filter(audible)

// Дрон — педаль e; тёмный, но без второго тритона (он есть в acid).
$: note(m('e2')).slow(2).s('sawtooth').unison(2).detune(keys.drone.det)
  .gain(keys.drone.vol.mul(tlOr('drone')))
  .lpf(keys.drone.cut).lpq(2)
  .attack(3).decay(2).sustain(0.9).release(4)
  .room(verb.mul(1)).roomsize(fx.reverb.size)
  .mask(gateOf('drone')).filter(audible)

// String machine: аккорды на октаву выше пэда, длинные, с chorus.
$: stringsLine.s('sawtooth').unison(3).detune(0.14)
  .gain(keys.strings.vol.mul(tlOr('strings')))
  .hpf(380).lpf(keys.strings.cut.mul(autoAt('keys.strings.cut'))).lpq(1)
  .attack(keys.strings.atk).decay(2).sustain(0.8).release(keys.strings.rel)
  .chorus(keys.strings.chorus)
  .room(verb.mul(0.9)).roomsize(fx.reverb.size)
  .mask(gateOf('strings')).filter(audible)

// Арпеджио: 16-е, low/high; дилей и короткий релиз.
$: arpLine.s('square').unison(1)
  .gain(keys.arp.vol.mul(tlOr('arp')))
  .lpf(keys.arp.cut.mul(autoAt('keys.arp.cut'))).lpq(keys.arp.q)
  .attack(0.002).decay(keys.arp.decay).sustain(0).release(0.05)
  .delay(keys.arp.echo).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.9))
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('arp')).filter(audible)

// Pluck: euphoric-лид на паузах, triangle + HPF + дилей (EX9).
$: pluckLine.s('triangle').unison(1)
  .gain(keys.pluck.vol.mul(tlOr('pluck')))
  .hpf(keys.pluck.hpf).lpf(keys.pluck.cut.mul(autoAt('keys.pluck.cut')))
  .attack(0.002).decay(keys.pluck.decay).sustain(0).release(0.06)
  .delay(keys.pluck.echo).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback)
  .room(verb.mul(0.7)).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.35, 0.65))
  .mask(gateOf('pluck')).filter(audible)

// Лид: acid (DROP) или пентатоника (DROP2/PEAK), свитч leadVar.
// Square — кислота, saw — euphoric-лид; тембр меняется вместе с фразой.
$: leadLine.s(leadAuto.fmap((v) => (Math.round(v) === 1 ? 'sawtooth' : 'square'))).unison(1)
  .gain(keys.lead.vol.mul(tlOr('lead')))
  .lpf(keys.lead.cut.mul(autoAt('keys.lead.cut'))).lpq(keys.lead.res).ftype('24db')
  .lpenv(keys.lead.env).lpa(0.003).lpd(keys.lead.decay).lpsustain(0.15)
  .decay(0.06).sustain(0.3).release(0.04)
  .delay(keys.lead.echo).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.95))
  .room(verb.mul(0.65)).roomsize(fx.reverb.size)
  .mask(gateOf('lead')).filter(audible)

// Air — розовый шум, дышит фильтром; тихо под всем.
$: s('pink').struct(m('x*4'))
  .gain(atmos.air.vol.mul(tlOr('air')).mul(perlin.slow(atmos.air.lfo).range(0.2, 1)))
  .hpf(sine.slow(8).range(220, 5200)).lpf(atmos.air.cut.mul(autoAt('atmos.air.cut')))
  .room(verb.mul(1.1)).roomsize(fx.reverb.size)
  .mask(gateOf('air')).filter(audible)

// Riser: один длинный шум на 4 такта; в LOOP выключен (loopLevel 0).
$: s('white').slow(4)
  .gain(atmos.riser.vol.mul(tlOr('riser', pure(0))))
  .hpf(atmos.riser.hpf).lpf(atmos.riser.cut)
  .lpenv(2).lpa(6).lpd(2).lpsustain(0.2)
  .attack(2).decay(2).sustain(0.7).release(1.2)
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .mask(gateOf('riser', pure(0))).filter(audible)

// ГОЛОС — Кафка, грануляр; в SONG — BREAK и PEAK.
$: s('dequote')
  .begin(vox.quote.begin).end(vox.quote.end)
  .striate(vox.quote.striate).slow(4)
  .speed(vox.quote.speed).clip(vox.quote.clip)
  .sometimesBy(vox.quote.revProb, (x) => x.rev())
  .degradeBy(vox.quote.degradeBy)
  .gain(vox.quote.vol.mul(tlOr('vox')))
  .lpf(vox.quote.cut).lpq(vox.quote.res).hpf(vox.quote.hpf)
  .pan(vox.quote.pan)
  .delay(vox.quote.echo).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.85))
  .room(verb.mul(vox.quote.room)).roomsize(fx.reverb.size)
  .mask(gateOf('vox')).filter(audible)

// ──────────────────────────────────────────────────────────────────
//  TIMELINE в панели: 0 = слой молчит в секции. Свитчи mode/bassVar/
//  leadVar/arpVar живут в LOOP с кнопок, в SONG/HOLD их ведёт форма.
//  Если тормозит: сначала убери roll/riser, затем arp, затем снизь
//  fx.reverb.size. Бас всегда ≤80: вес даёт sub и p-loudness бочки.
