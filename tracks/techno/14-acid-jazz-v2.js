// ACID JAZZ 14 · v2 · 90 BPM · 128 тактов
// 14-acid-jazz остаётся референсом. Это та же музыка, развёрнутая в форму:
// TIMELINE, AUTOMATION, SONG/LOOP/HOLD, gateOf. Тот же F дорийский
// (f bb eb c g eb bb f), тот же TIA-арпеджио, частичный пэд, контрабас
// с подходом, свинг и Rhodes-компинг. Ничего из 14 не перезаписано.
//
// ── ФОРМА ────────────────────────────────────────────────────────
// INTRO 8 → INTRO 2 8 → A 16 → A2 16 → BREAK 8 → B 16 → B2 16 →
// PEAK 16 → DECAY 8 → OUTRO 8 → OUTRO 2 8. Итого 128 тактов ≈ 5:41.
// Развитие — плотность, включение слоёв, срезы и два варианта арпеджио;
// громкости инструментов постоянны (перкуссия — единственное исключение).
//
// ── ПОЧЕМУ ЭТО ACID JAZZ ─────────────────────────────────────────
// 1. Свинг в хэтах (swingBy, разный по режимам).
// 2. Ходящий контрабас: не только корень — терция, квинта, подход.
// 3. Rhodes-компинг на 2 и 4, а не аккордовая «шансон» на каждой доле.
// 4. Sparse-мелодия: пауза вокруг ноты важнее самой ноты.
// 5. Мягкая бочка, кисть, шейкер только в ломе.
// Гармония — кварты (PAD_A) и 9/11/13 (PAD_B); без тритоновых пар.
//
// Контрабас — единственный mid-bass с деревянным срезом (~520 Гц): это
// осознанное отступление от дефолта «бас ≤80», иначе джазовый тон
// превращается в саб. Настоящий саб — отдельный слой `sub` ≤80.
//
// ── ДВА АРПЕДЖИО ─────────────────────────────────────────────────
// TIA — восходяще-нисходящая фигура из 14: 8 тактов, ровно круг корней.
// TIA2 — нисходящая, другой тембр (square), для B/PEAK. Играет вместо TIA,
// а не поверх: у слоёв отдельные ключи TIMELINE.
//
// // @roots f bb eb c g eb bb f
const BPM = 90
setcpm(BPM / 4) // один цикл = один такт 4/4 (≈ 2.667 с)

// ══════════════════════════════════════════════════════════════════
//  GLIDE — слайд от предыдущей ноты (рецепт Switch Angel)
// ══════════════════════════════════════════════════════════════════
// Нужен только контрабасу: подход к следующей доле — короткий съезд,
// а не портаменто на каждой ноте. Гейт выбирает, где он случается.
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

// ══════════════════════════════════════════════════════════════════
//  UI + ПЕРЕКЛЮЧАТЕЛИ
// ══════════════════════════════════════════════════════════════════
// Панель читает роли из этого манифеста: транспорт, такт HOLD и свитчи.
// Строки — только в одинарных кавычках (двойные транспайлер превращает в m()).
const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
  switches: {
    mode: ['jazz', 'break', 'half', 'roll'],
    harmony: ['quartal', 'ninth'],
  },
}

const play = slider(1, 0, 2, 1) // 0 LOOP, 1 SONG, 2 HOLD
const mode = slider(0, 0, 3, 1) // jazz / break / half / roll
const harmony = slider(0, 0, 1, 1) // quartal / ninth
const holdBar = slider(0, 0, 127, 1)

// Общее: только эти два параметра принадлежат сразу всем слоям.
const verb = slider(0.38, 0, 1, 0.01) // send в реверб
const duck = slider(0.5, 0, 1, 0.01) // насколько бочка приседает низ

// ══════════════════════════════════════════════════════════════════
//  ИНСТРУМЕНТЫ — дерево для панели
// ══════════════════════════════════════════════════════════════════
// Группа → инструмент → параметр. `vol` первым, `cut` вторым.
// Громкости заданы не с нуля: в LOOP трек звучит сразу.
const instruments = {
  // ── БАРАБАНЫ ───────────────────────────────────────────────────
  drums: {
    name: 'Drums',
    kick: {
      name: 'Kick',
      vol: slider(0.45, 0, 0.5, 0.01),
      cut: slider(260, 90, 4000, 10), // глухо, но с телом
      shape: slider(0.5, 0, 0.95, 0.01),
      decay: slider(0.6, 0.15, 2, 0.01),
      tune: slider(0.88, 0.55, 1.4, 0.01),
      bodyLevel: slider(0.3, 0, 1, 0.01),
      bodyDecay: slider(0.9, 0.3, 3, 0.01),
      bodyDrop: slider(4, 0, 12, 0.5),
    },
    snare: {
      name: 'Snare',
      vol: slider(0.3, 0, 1, 0.01),
      cut: slider(4800, 800, 14000, 100),
      decay: slider(0.18, 0.03, 0.7, 0.01),
    },
    clap: {
      name: 'Clap',
      vol: slider(0.16, 0, 0.9, 0.01),
      cut: slider(5200, 800, 14000, 100),
      hpf: slider(700, 200, 4000, 50),
      crush: slider(13, 1, 16, 0.5),
    },
    hat: {
      name: 'Hats',
      vol: slider(0.22, 0, 0.9, 0.01),
      cut: slider(7800, 800, 16000, 100),
      swing: slider(0.16, 0, 0.3, 0.005),
      decay: slider(0.05, 0.01, 0.2, 0.005),
    },
    ohat: {
      name: 'Open hats',
      vol: slider(0.12, 0, 0.7, 0.01),
      cut: slider(5400, 800, 16000, 100),
      decay: slider(0.18, 0.03, 0.6, 0.01),
    },
    rim: {
      name: 'Rim',
      vol: slider(0.14, 0, 0.7, 0.01),
      cut: slider(3200, 400, 14000, 100),
      decay: slider(0.05, 0.01, 0.2, 0.005),
      echo: slider(0.18, 0, 0.6, 0.01),
    },
    shaker: {
      name: 'Shaker',
      vol: slider(0.06, 0, 0.6, 0.01),
      cut: slider(6800, 800, 16000, 100),
      decay: slider(0.03, 0.01, 0.15, 0.005),
    },
    brush: {
      name: 'Brush',
      vol: slider(0.1, 0, 0.5, 0.01),
      cut: slider(3200, 400, 12000, 100),
      decay: slider(0.07, 0.02, 0.3, 0.01),
    },
    crash: {
      name: 'Crash',
      vol: slider(0.18, 0, 0.7, 0.01),
      cut: slider(6000, 1000, 16000, 100),
    },
  },

  // ── БАС ────────────────────────────────────────────────────────
  bass: {
    name: 'Bass',
    upright: {
      name: 'Upright',
      vol: slider(0.5, 0, 1.1, 0.01),
      cut: slider(520, 80, 4000, 10), // деревянный тон, не суб
      res: slider(4, 0, 20, 0.5),
      env: slider(1.8, 0, 8, 0.1),
      decay: slider(0.22, 0.05, 1, 0.01),
      glide: slider(0.07, 0, 0.2, 0.001),
    },
    sub: {
      name: 'Sub ≤80',
      vol: slider(0.22, 0, 1, 0.01),
      cut: slider(80, 40, 80, 1),
      decay: slider(0.5, 0.1, 2, 0.01),
    },
    ghost: {
      name: 'Ghost bass',
      vol: slider(0.12, 0, 0.7, 0.01),
      cut: slider(900, 100, 4000, 10),
      echo: slider(0.5, 0, 0.9, 0.01),
    },
  },

  // ── ПЭДЫ ───────────────────────────────────────────────────────
  pads: {
    name: 'Pads',
    pad: {
      name: 'Pad',
      vol: slider(0.18, 0, 0.7, 0.01),
      cut: slider(1300, 80, 6000, 10),
      q: slider(1.2, 0, 20, 0.5),
      lfo: slider(1.4, 0, 8, 0.1),
      det: slider(0.09, 0, 0.6, 0.01),
    },
    organ: {
      name: 'Organ',
      vol: slider(0.16, 0, 0.8, 0.01),
      cut: slider(900, 100, 6000, 10),
    },
    keys: {
      name: 'Keys',
      vol: slider(0.24, 0, 0.9, 0.01),
      cut: slider(2600, 200, 10000, 20),
      fm: slider(0.9, 0, 4, 0.05),
      decay: slider(0.3, 0.05, 1.2, 0.01),
    },
    brass: {
      name: 'Brass',
      vol: slider(0.14, 0, 0.8, 0.01),
      cut: slider(2400, 200, 12000, 20),
      decay: slider(0.25, 0.03, 1, 0.01),
    },
  },

  // ── МЕЛОДИЯ ────────────────────────────────────────────────────
  melody: {
    name: 'Melody',
    tia: {
      name: 'TIA arp',
      vol: slider(0.28, 0, 1, 0.01),
      cut: slider(800, 80, 2400, 10),
      res: slider(9, 0, 20, 0.5),
      env: slider(3.2, 0, 9, 0.1),
      lfo: slider(2.2, 0, 8, 0.1),
      echo: slider(0.55, 0, 0.95, 0.01),
    },
    tia2: {
      name: 'TIA alt',
      vol: slider(0.22, 0, 1, 0.01),
      cut: slider(1100, 80, 3000, 10),
      res: slider(6, 0, 20, 0.5),
      env: slider(2.4, 0, 9, 0.1),
      lfo: slider(1.6, 0, 8, 0.1),
      echo: slider(0.45, 0, 0.95, 0.01),
    },
    mel: {
      name: 'Melody',
      vol: slider(0.22, 0, 0.9, 0.01),
      cut: slider(3000, 200, 10000, 20),
      decay: slider(0.4, 0.05, 1.5, 0.01),
      echo: slider(0.3, 0, 0.9, 0.01),
    },
    mel2: {
      name: 'Melody alt',
      vol: slider(0.18, 0, 0.9, 0.01),
      cut: slider(3400, 200, 12000, 20),
      decay: slider(0.5, 0.05, 1.6, 0.01),
      echo: slider(0.35, 0, 0.9, 0.01),
    },
    bub: {
      name: 'Bubbles',
      vol: slider(0.12, 0, 0.7, 0.01),
      cut: slider(1800, 200, 8000, 20),
      echo: slider(0.5, 0, 0.95, 0.01),
    },
  },

  // ── ЭФФЕКТЫ ────────────────────────────────────────────────────
  fx: {
    name: 'FX',
    blip: {
      name: 'Blips',
      vol: slider(0.1, 0, 0.5, 0.01),
      cut: slider(9000, 1000, 16000, 100),
      delay: slider(0.45, 0, 0.9, 0.01),
      time: slider(0.1875, 0.03, 0.5, 0.005),
    },
    sweep: {
      name: 'Sweep',
      vol: slider(0.14, 0, 0.6, 0.01),
      cut: slider(1200, 100, 8000, 20),
    },
    reverb: {
      name: 'Reverb',
      size: slider(8, 1, 20, 0.5),
    },
  },

  // ── АТМОСФЕРА ──────────────────────────────────────────────────
  atmos: {
    name: 'Atmos',
    air: {
      name: 'Air',
      vol: slider(0.12, 0, 0.5, 0.01),
      cut: slider(620, 100, 8000, 20),
      lfo: slider(2.5, 0, 10, 0.5),
    },
    drone: {
      name: 'Drone',
      vol: slider(0.1, 0, 0.6, 0.01),
      cut: slider(300, 60, 2000, 10),
      det: slider(0.1, 0, 0.5, 0.01),
    },
    vinyl: {
      name: 'Vinyl',
      vol: slider(0.04, 0, 0.3, 0.01),
      cut: slider(2400, 300, 12000, 100),
    },
  },
}

const { drums, bass, pads, melody, fx, atmos } = instruments

// ══════════════════════════════════════════════════════════════════
//  TIMELINE — 128 тактов
// ══════════════════════════════════════════════════════════════════
// values — включённость слоя и номер режима. Каждый ключ повторяем в
// каждой секции: tlCurve несёт последнее значение вперёд, и явный 0
// важнее памяти. Уровни не трогаем — это дело слайдеров.
const TIMELINE = [
  { at: 0,   len: 8,  name: 'INTRO',    values: { kick: 0, body: 0, sub: 0, snare: 0, clap: 0, hat: 0, ohat: 0, rim: 0, shaker: 0, brush: 0, crash: 0, upright: 0, ghost: 0, pad: 1, organ: 0, keys: 0, brass: 0, tia: 0, tia2: 0, mel: 0, mel2: 0, bub: 0, blip: 0, sweep: 0, air: 1, drone: 1, vinyl: 1, mode: 0, harmony: 0 } },
  { at: 8,   len: 8,  name: 'INTRO 2',  values: { kick: 0, body: 0, sub: 0, snare: 0, clap: 0, hat: 0, ohat: 0, rim: 0, shaker: 0, brush: 1, crash: 0, upright: 0, ghost: 1, pad: 1, organ: 0, keys: 1, brass: 0, tia: 0, tia2: 0, mel: 0, mel2: 0, bub: 0, blip: 0, sweep: 0, air: 1, drone: 1, vinyl: 1, mode: 0, harmony: 0 } },
  { at: 16,  len: 16, name: 'A',        values: { kick: 1, body: 1, sub: 1, snare: 1, clap: 0, hat: 1, ohat: 1, rim: 1, shaker: 0, brush: 1, crash: 1, upright: 1, ghost: 1, pad: 1, organ: 0, keys: 1, brass: 0, tia: 1, tia2: 0, mel: 1, mel2: 0, bub: 0, blip: 0, sweep: 0, air: 1, drone: 1, vinyl: 1, mode: 0, harmony: 0 } },
  { at: 32,  len: 16, name: 'A2',       values: { kick: 1, body: 1, sub: 1, snare: 1, clap: 0, hat: 1, ohat: 1, rim: 1, shaker: 0, brush: 0, crash: 0, upright: 1, ghost: 1, pad: 1, organ: 1, keys: 1, brass: 1, tia: 0, tia2: 1, mel: 0, mel2: 1, bub: 1, blip: 1, sweep: 0, air: 1, drone: 1, vinyl: 1, mode: 0, harmony: 1 } },
  { at: 48,  len: 8,  name: 'BREAK',    values: { kick: 0, body: 0, sub: 0, snare: 0, clap: 0, hat: 0, ohat: 0, rim: 1, shaker: 0, brush: 1, crash: 0, upright: 1, ghost: 1, pad: 1, organ: 1, keys: 1, brass: 0, tia: 0, tia2: 1, mel: 0, mel2: 1, bub: 1, blip: 1, sweep: 1, air: 1, drone: 1, vinyl: 1, mode: 0, harmony: 0 } },
  { at: 56,  len: 16, name: 'B',        values: { kick: 1, body: 1, sub: 1, snare: 1, clap: 0, hat: 1, ohat: 1, rim: 1, shaker: 1, brush: 0, crash: 0, upright: 1, ghost: 0, pad: 1, organ: 1, keys: 1, brass: 0, tia: 1, tia2: 0, mel: 1, mel2: 0, bub: 0, blip: 1, sweep: 0, air: 1, drone: 1, vinyl: 1, mode: 1, harmony: 1 } },
  { at: 72,  len: 16, name: 'B2',       values: { kick: 1, body: 1, sub: 1, snare: 1, clap: 1, hat: 1, ohat: 1, rim: 1, shaker: 1, brush: 0, crash: 1, upright: 1, ghost: 1, pad: 1, organ: 1, keys: 1, brass: 1, tia: 0, tia2: 1, mel: 0, mel2: 1, bub: 1, blip: 1, sweep: 0, air: 1, drone: 1, vinyl: 1, mode: 1, harmony: 0 } },
  { at: 88,  len: 16, name: 'PEAK',     values: { kick: 1, body: 1, sub: 1, snare: 1, clap: 1, hat: 1, ohat: 1, rim: 1, shaker: 1, brush: 0, crash: 1, upright: 1, ghost: 1, pad: 1, organ: 1, keys: 1, brass: 1, tia: 0, tia2: 1, mel: 1, mel2: 0, bub: 1, blip: 1, sweep: 1, air: 1, drone: 1, vinyl: 0, mode: 3, harmony: 1 } },
  { at: 104, len: 8,  name: 'DECAY',    values: { kick: 0, body: 0, sub: 0, snare: 0, clap: 0, hat: 0, ohat: 0, rim: 1, shaker: 0, brush: 0, crash: 0, upright: 1, ghost: 1, pad: 1, organ: 1, keys: 1, brass: 0, tia: 1, tia2: 0, mel: 1, mel2: 0, bub: 1, blip: 1, sweep: 0, air: 1, drone: 1, vinyl: 1, mode: 0, harmony: 0 } },
  { at: 112, len: 8,  name: 'OUTRO',    values: { kick: 0, body: 0, sub: 0, snare: 0, clap: 0, hat: 0, ohat: 0, rim: 0, shaker: 0, brush: 0, crash: 0, upright: 1, ghost: 0, pad: 1, organ: 0, keys: 1, brass: 0, tia: 1, tia2: 0, mel: 1, mel2: 0, bub: 0, blip: 0, sweep: 0, air: 1, drone: 1, vinyl: 1, mode: 0, harmony: 1 } },
  { at: 120, len: 8,  name: 'OUTRO 2',  values: { kick: 0, body: 0, sub: 0, snare: 0, clap: 0, hat: 0, ohat: 0, rim: 0, shaker: 0, brush: 0, crash: 0, upright: 0, ghost: 0, pad: 1, organ: 0, keys: 0, brass: 0, tia: 1, tia2: 0, mel: 0, mel2: 0, bub: 0, blip: 0, sweep: 0, air: 1, drone: 1, vinyl: 1, mode: 0, harmony: 0 } },
]

// Автоматика срезов. Только SONG: в LOOP множитель 1, в HOLD — снимок.
const AUTOMATION = [
  { path: 'pads.pad.cut',    points: [[0, 0.6], [16, 0.85], [32, 1], [48, 1.25], [56, 0.85], [72, 1.05], [88, 1.5], [104, 0.9], [112, 1.1], [120, 0.8], [128, 0.25]] },
  { path: 'melody.tia.cut',  points: [[0, 0.2], [16, 0.35], [32, 0.8], [48, 1.15], [56, 0.7], [72, 1.3], [88, 1.7], [104, 1], [112, 0.8], [128, 0.15]] },
  { path: 'melody.tia2.cut', points: [[0, 0.2], [48, 0.6], [56, 1], [72, 1.35], [88, 1.8], [104, 0.7], [128, 0.15]] },
  { path: 'melody.mel.cut',  points: [[0, 0.6], [32, 1], [48, 1.15], [72, 1.2], [88, 1.4], [104, 0.8], [128, 0.25]] },
  { path: 'bass.upright.cut', points: [[0, 0.9], [16, 1], [48, 1.2], [56, 0.85], [88, 1.25], [104, 1], [128, 0.4]] },
  { path: 'pads.keys.cut',   points: [[0, 0.7], [16, 0.9], [48, 1.15], [56, 1], [88, 1.35], [104, 0.9], [128, 0.3]] },
  { path: 'drums.kick.cut',  points: [[0, 1], [48, 1.15], [88, 1.2], [104, 1], [128, 0.7]] },
  { path: 'atmos.air.cut',   points: [[0, 0.7], [16, 0.9], [48, 1.15], [88, 1.3], [104, 0.8], [128, 0.35]] },
  { path: 'atmos.drone.cut', points: [[0, 0.8], [48, 1.1], [88, 1.2], [104, 0.8], [128, 0.3]] },
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

// LOOP / SONG / HOLD. Три режима — три источника значения.
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
const autoSwitch = (key, knob) =>
  tlCurve(key).mul(songGate).add(knob.mul(loopGate)).add(sectionValue(key).mul(holdGate))
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
const autoAt = (path) =>
  autoCurve(path).mul(songGate).add(loopGate)
    .add(holdBar.fmap((b) => autoValueAt(path, b)).mul(holdGate))

const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}
const gateOf = (key) => tlOr(key).fmap((v) => v > 0.001)
const phrase = (bars) => m('<' + bars.join(' ') + '>')

// ══════════════════════════════════════════════════════════════════
//  МАТЕРИАЛ — один источник правды
// ══════════════════════════════════════════════════════════════════
// Корни на 8 тактов: f bb eb c g eb bb f. Это круг, не cadence.
const ROOT = phrase([
  '[f1]', '[bb1]', '[eb2]', '[c2]',
  '[g1]', '[eb2]', '[bb1]', '[f1]',
])

// Дрон: корень с квинтой внизу. Держит тональность в INTRO/OUTRO.
const DRONE = phrase([
  '[f1,c2]', '[bb1,f2]', '[eb2,bb2]', '[c2,g2]',
  '[g1,d2]', '[eb2,bb2]', '[bb1,f2]', '[f1,c2]',
])

// Орган: корень с квинтой в середине.
const ORGAN = phrase([
  '[f2,c3]', '[bb2,f3]', '[eb3,bb3]', '[c3,g3]',
  '[g2,d3]', '[eb3,bb3]', '[bb2,f3]', '[f2,c3]',
])

// Контрабас: терция, квинта и подход к следующей доле.
const BASS = phrase([
  '[f2 ~ ab2 ~ c3 ~ ~ eb2]',
  '[bb1 ~ d2 ~ f2 ~ ~ c2]',
  '[eb2 ~ g2 ~ bb2 ~ ~ f2]',
  '[c2 ~ eb2 ~ g2 ~ ~ d2]',
  '[g1 ~ bb1 ~ d2 ~ ~ c2]',
  '[eb2 ~ g2 ~ bb2 ~ ~ f2]',
  '[bb1 ~ d2 ~ f2 ~ ~ g1]',
  '[f2 ~ ab2 ~ c3 ~ eb2 ~]',
])

// ПЭД A — кварты без терций. Ни мажора, ни минора: воздух.
const PAD_A = phrase([
  '[f3,bb3,eb4]',
  '[d4,g4,c5]',
  '[g3,c4,f4]',
  '[c4,f4,bb4]',
  '[g3,c4,f4]',
  '[c4,f4,bb4]',
  '[d4,g4,c5]',
  '[f3,bb3,eb4]',
])

// ПЭД B — 9-е, 11-е и 13-я. Без тритоновых пар.
const PAD_B = phrase([
  '[f3,ab3,c4,g5]',
  '[bb3,d4,f4,g4]',
  '[eb3,g3,bb3,f4]',
  '[c3,eb3,g3,bb3]',
  '[g3,bb3,d4,f4]',
  '[eb3,g3,bb3,f4]',
  '[bb3,d4,f4,g4]',
  '[f3,ab3,c4,g5]',
])

// TIA — восходяще-нисходящая фигура 16-ми (из 14).
const TIA = phrase([
  '[f4 ab4 c5 g5 eb5 c5 ab4 f4 c5 eb5 g5 f5 eb5 c5 ab4 g4]',
  '[bb3 d4 f4 g4 f4 d4 bb3 d4 c5 g4 f4 d4 c4 d4 f4 g4]',
  '[eb4 g4 bb4 d5 f5 d5 bb4 g4 eb4 f4 g4 bb4 d5 bb4 g4 f4]',
  '[c4 eb4 g4 d5 eb5 d5 g4 eb4 c4 g4 d5 eb5 g5 eb5 d5 c5]',
  '[g3 bb3 d4 f4 c5 f4 d4 bb3 g3 d4 f4 g4 bb4 g4 f4 d4]',
  '[eb4 bb4 g4 f4 eb4 g4 bb4 d5 eb5 bb4 g4 f4 eb4 f4 g4 bb4]',
  '[bb3 f4 d4 c4 bb3 d4 f4 g4 bb4 g4 f4 d4 c4 d4 f4 g4]',
  '[f4 c5 ab4 g4 f4 ab4 c5 eb5 f5 eb5 c5 ab4 g4 ab4 c5 eb5]',
])

// TIA2 — нисходящий вариант для B/PEAK. Те же правила укладки.
const TIA2 = phrase([
  '[g4 ab4 g4 f4 ab4 c5 eb5 g5 f5 eb5 c5 ab4 f4 g4 ab4 c5]',
  '[d5 bb4 f4 d4 f4 bb4 c5 g5 f5 d5 bb4 f4 d4 f4 g4 bb4]',
  '[g4 eb4 bb3 eb4 g4 bb4 d5 f5 eb5 bb4 g4 d4 eb4 g4 bb4 d5]',
  '[eb4 c4 g3 c4 eb4 g4 bb4 d5 c5 bb4 g4 eb4 g4 bb4 d5 c5]',
  '[bb3 g3 d3 g3 bb3 d4 f4 c5 bb4 f4 d4 bb3 f4 d5 c5 bb4]',
  '[eb4 bb3 g3 bb3 eb4 g4 d5 f5 eb5 bb4 g4 eb4 bb4 d5 f5 eb5]',
  '[f4 d4 bb3 d4 f4 g4 c5 g5 f5 c5 g4 f4 d4 f4 g4 bb4]',
  '[g4 f4 c5 ab4 f4 c5 eb5 g5 f5 eb5 c5 ab4 f4 ab4 c5 eb5]',
])

// Мелодия: sparse, только ноты лада; над F не играем d, над остальными —
// не играем ab. Это «приятно» намеренно, а не случайно.
const MEL = phrase([
  '[~ c5 ~ ~ eb5 ~ ~ g5]',
  '[~ d5 ~ f5 ~ ~ g5 ~]',
  '[~ bb4 ~ ~ g4 ~ f4 ~]',
  '[~ eb5 ~ g5 ~ ~ c5 ~]',
  '[~ d5 ~ ~ bb4 ~ g4 ~]',
  '[~ f5 ~ eb5 ~ ~ bb4 ~]',
  '[~ c5 ~ d5 ~ ~ f5 ~]',
  '[~ eb5 ~ ~ c5 ~ ~ ~]',
])

// Второй вариант: длиннее и ниже, для BREAK/PEAK.
const MEL2 = phrase([
  '[~ g5 ~ ~ f5 ~ c5 ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ f5 ~ d5 ~ ~ bb4 ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ bb5 ~ g5 ~ f5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ eb5 ~ g5 ~ ~ d5 ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ bb4 ~ d5 ~ f5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ g5 ~ bb5 ~ ~ f5 ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ d5 ~ f5 ~ ~ g5 ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ c5 ~ ~ f5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
])

// KEYS — аккорд такта; ритм компинга выбирается отдельно.
// Трёхнотные укладки: достаточно для Rhodes, не каша в середине.
const KEYS = phrase([
  '[f4,c5,g5]',
  '[bb4,f5,g5]',
  '[eb4,bb4,f5]',
  '[c4,g4,bb4]',
  '[g4,d5,f5]',
  '[eb4,bb4,f5]',
  '[bb4,f5,g5]',
  '[f4,c5,g5]',
])

// BRASS — редкий духовой акцент только на 1-м и 5-м такте круга.
const BRASS = phrase([
  '[f4,ab4,c5,eb5]',
  '[bb4,d5,f5,g5]',
  '[eb4,g4,bb4,f5]',
  '[c5,eb5,g5,bb5]',
  '[g4,bb4,d5,f5]',
  '[eb4,g4,bb4,f5]',
  '[bb4,d5,f5,g5]',
  '[f4,ab4,c5,eb5]',
])

// Бульки: нота с падением внутри себя, высоко и редко.
const BUB = phrase([
  '[~ ~ [ab6@0.25 ab4@0.75] ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ [bb5@0.2 bb4@0.8] ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ [g6@0.3 g5@0.7] ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ f6@0.25 ~ ~ ~ ~ f5@0.75]',
  '[~ ~ ~ ~ ~ ~ ~ ~]',
])

// Бас-призрак: редкие высокие щипки в эхе.
const GBASS = phrase([
  '[~ ~ ~ ~ c3 ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ eb3 ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ bb2 ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ f3 ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~]',
])

// ══════════════════════════════════════════════════════════════════
//  РИТМЫ — режимы переключают рисунок, состав остаётся
// ══════════════════════════════════════════════════════════════════
const kicks = [
  m('x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~ ~'),
  m('x ~ ~ x ~ ~ x ~ ~ x ~ ~ x ~ x ~'),
  m('x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~'),
  m('x ~ ~ x ~ ~ x ~ ~ ~ x ~ ~ x ~ ~'),
]
const snares = [
  m('~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~'),
  m('~ ~ ~ ~ ~ ~ sd ~ ~ ~ sd ~ ~ ~ ~ ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~'),
  m('~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~'),
]
const claps = [
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~'),
  m('~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~'),
]
const hats = [
  m('x*8'),
  m('x*8'),
  m('x*4'),
  m('x*16'),
]
const ohats = [
  m('~ ~ ~ ~ ~ ~ oh ~ ~ ~ ~ ~ ~ ~ oh ~'),
  m('~ ~ oh ~ ~ ~ ~ ~ ~ ~ oh ~ ~ ~ ~ ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ oh ~ ~ ~ ~ ~ ~ ~'),
  m('~ ~ oh ~ ~ ~ ~ ~ ~ ~ oh ~ ~ ~ ~ ~'),
]
const rims = [
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~ ~ ~'),
  m('rim ~ ~ ~ ~ ~ rim ~ ~ ~ rim ~ ~ ~ ~ ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~'),
  m('~ ~ rim ~ ~ ~ ~ ~ rim ~ ~ ~ ~ ~ rim ~'),
]
const comps = [
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
  m('x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ x'),
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
  m('~ x ~ x ~ ~ x ~ ~ x ~ x ~ ~ x ~'),
]

const kickPat = modeAuto.pick(kicks)
const snarePat = modeAuto.pick(snares)
const clapPat = modeAuto.pick(claps)
const hatPat = modeAuto.pick(hats)
const ohatPat = modeAuto.pick(ohats)
const rimPat = modeAuto.pick(rims)
const compPat = modeAuto.pick(comps)

// Свинг живой в jazz/break, почти ровный в half/roll.
const hatSwing = modeAuto.fmap((v) => (v === 0 ? 1 : v === 1 ? 0.75 : v === 2 ? 0.5 : 0.25))
const shakerOn = modeAuto.fmap((v) => (v === 1 || v === 3 ? 1 : 0))
const brushOn = modeAuto.fmap((v) => (v === 0 || v === 2 ? 1 : 0))
const rollOn = modeAuto.fmap((v) => (v === 3 ? 1 : 0))

// ══════════════════════════════════════════════════════════════════
//  АТМОСФЕРА
// ══════════════════════════════════════════════════════════════════
$: s('pink')
  .gain(atmos.air.vol.mul(tlOr('air')))
  .lpf(atmos.air.cut.mul(autoAt('atmos.air.cut'))).lpq(0.8).ftype('24db')
  .lpdepth(atmos.air.lfo).lpsync(0.0625).lpdc(0)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('air')).filter(audible)

// Дрон: две расстроенные пилы — не одна нота, а стена.
$: note(DRONE)
  .s('sawtooth').unison(2).detune(atmos.drone.det)
  .gain(atmos.drone.vol.mul(tlOr('drone')))
  .lpf(atmos.drone.cut.mul(autoAt('atmos.drone.cut'))).lpq(3).ftype('24db')
  .attack(1.6).decay(1).sustain(0.9).release(2.4)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('drone')).filter(audible)

$: s('crackle')
  .gain(atmos.vinyl.vol.mul(tlOr('vinyl')).mul(m('<1 1 .7 1 1 1 1 .8 1 1 1 1>')))
  .lpf(atmos.vinyl.cut).hpf(300)
  .room(0.2)
  .mask(gateOf('vinyl')).filter(audible)

// ══════════════════════════════════════════════════════════════════
//  УДАРНЫЕ
// ══════════════════════════════════════════════════════════════════
$: s('bd')
  .struct(kickPat)
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .lpf(drums.kick.cut.mul(autoAt('drums.kick.cut'))).lpq(1)
  .speed(drums.kick.tune).shape(drums.kick.shape)
  .decay(drums.kick.decay).sustain(0).release(0.08)
  .duckorbit(2).duckdepth(duck).duckattack(0.02)
  .mask(gateOf('kick')).filter(audible)

// ТЕЛО БОЧКИ — длина и низ, которых нет у сэмпла.
$: note(ROOT)
  .s('sine').struct(kickPat)
  .gain(drums.kick.vol.mul(drums.kick.bodyLevel).mul(tlOr('body')))
  .lpf(drums.kick.cut.mul(0.5)).lpq(1)
  .penv(drums.kick.bodyDrop).panchor(0).pattack(0.002).pdecay(0.09).psustain(0).pcurve(1)
  .attack(0.002).decay(drums.kick.bodyDecay).sustain(0).release(0.12)
  .orbit(2)
  .mask(gateOf('body')).filter(audible)

// САБ — только вес, на «и», чтобы не спорить с телом бочки.
$: note(ROOT)
  .s('sine').struct(m('~ x ~ ~ ~ x ~ ~'))
  .gain(bass.sub.vol.mul(tlOr('sub')))
  .lpf(bass.sub.cut).lpq(1)
  .decay(bass.sub.decay).sustain(0).release(0.2)
  .orbit(2)
  .mask(gateOf('sub')).filter(audible)

$: s('sd')
  .struct(snarePat)
  .gain(drums.snare.vol.mul(tlOr('snare')))
  .lpf(drums.snare.cut).hpf(180)
  .decay(drums.snare.decay).sustain(0).release(0.08)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('snare')).filter(audible)

// ФИЛЛ — 32-е по снейру на последнюю долю 4-го такта, только в ROLL.
$: s('sd')
  .struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ [sd*2] [sd*2] [sd*2] [sd*2]'))
  .gain(drums.snare.vol.mul(rollOn).mul(m('<0 0 0 1>')).mul(0.7))
  .lpf(drums.snare.cut.mul(1.2)).hpf(200)
  .decay(0.05).sustain(0)
  .pan(rand.range(-0.4, 0.4))
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .mask(gateOf('snare').mul(rollOn).fmap((v) => v > 0.001)).filter(audible)

$: s('cp')
  .struct(clapPat)
  .gain(drums.clap.vol.mul(tlOr('clap')))
  .lpf(drums.clap.cut).hpf(drums.clap.hpf).lpq(3)
  .crush(drums.clap.crush)
  .decay(0.12).sustain(0)
  .pan(rand.range(-0.6, 0.6))
  .room(0.3).roomsize(fx.reverb.size)
  .mask(gateOf('clap')).filter(audible)

// ХЭТЫ — свинг живёт здесь; в ROLL 16-е, но свинг почти снят.
$: s('hh')
  .struct(hatPat)
  .swingBy(drums.hat.swing.mul(hatSwing), 8)
  .gain(drums.hat.vol.mul(tlOr('hat')).mul(m('<.95 .5 .75 .45 .85 .5 .7 .4>')))
  .lpf(drums.hat.cut).hpf(320)
  .decay(drums.hat.decay).sustain(0)
  .nudge(rand.mul(0.012).sub(0.006))
  .degradeBy(0.05)
  .mask(gateOf('hat')).filter(audible)

$: s('oh')
  .struct(ohatPat)
  .gain(drums.ohat.vol.mul(tlOr('ohat')))
  .lpf(drums.ohat.cut)
  .decay(drums.ohat.decay).sustain(0)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('ohat')).filter(audible)

$: s('rim')
  .struct(rimPat)
  .gain(drums.rim.vol.mul(tlOr('rim')))
  .lpf(drums.rim.cut).hpf(500).lpq(2)
  .decay(drums.rim.decay).sustain(0)
  .pan(rand.range(-0.7, 0.7))
  .delay(drums.rim.echo).delaytime(0.375).delayfeedback(0.25)
  .mask(gateOf('rim')).filter(audible)

// ШЕЙКЕР — только в BREAK/ROLL, где 16-е хэты разрежены.
$: s('sh')
  .struct(m('x*16'))
  .gain(drums.shaker.vol.mul(tlOr('shaker')).mul(shakerOn).mul(0.7))
  .lpf(drums.shaker.cut).hpf(2200)
  .decay(drums.shaker.decay).sustain(0)
  .degradeBy(0.35)
  .pan(rand.range(0.1, 0.9))
  .mask(gateOf('shaker').mul(shakerOn).fmap((v) => v > 0.001)).filter(audible)

// КИСТЬ — шорох по 8-м в jazz/half. Это движение, а не удар.
$: s('pink')
  .struct(m('~ x ~ x ~ x ~ x ~ x ~ x ~ x ~ x'))
  .gain(drums.brush.vol.mul(tlOr('brush')).mul(brushOn).mul(0.8))
  .lpf(drums.brush.cut).hpf(1500)
  .decay(drums.brush.decay).sustain(0)
  .pan(rand.range(-0.4, 0.4))
  .room(0.2).roomsize(fx.reverb.size)
  .mask(gateOf('brush').mul(brushOn).fmap((v) => v > 0.001)).filter(audible)

// ТАРЕЛКА — раз в 8 тактов, шумом (не зависит от набора сэмплов).
$: s('white')
  .gain(drums.crash.vol.mul(tlOr('crash')).mul(m('<1 0 0 0 0 0 0 0>')))
  .lpf(drums.crash.cut).hpf(4000)
  .attack(0.002).decay(1.2).sustain(0).release(0.6)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('crash')).filter(audible)

// ══════════════════════════════════════════════════════════════════
//  БАС
// ══════════════════════════════════════════════════════════════════
// Контрабас: треугольник и деревянный срез. Слайд — только на подходе.
$: note(BASS)
  .s('triangle')
  .glide(bass.upright.glide.mul(m('0 0 0 1 0 0 0 0')))
  .gain(bass.upright.vol.mul(tlOr('upright')))
  .lpf(bass.upright.cut.mul(autoAt('bass.upright.cut'))).lpq(bass.upright.res).ftype('24db')
  .lpenv(bass.upright.env)
  .lpa(0.006).lpd(bass.upright.decay).lpsustain(0.2)
  .decay(0.18).sustain(0.55).release(0.12)
  .orbit(2)
  .mask(gateOf('upright')).filter(audible)

// БАС-ПРИЗРАК — высокие щипки в эхе, не второй бас.
$: note(GBASS)
  .s('square')
  .gain(bass.ghost.vol.mul(tlOr('ghost')))
  .lpf(bass.ghost.cut).lpq(6)
  .decay(0.08).sustain(0)
  .delay(bass.ghost.echo).delaytime(0.375).delayfeedback(0.45)
  .pan(rand.range(-0.5, 0.5))
  .orbit(2)
  .mask(gateOf('ghost')).filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ГАРМОНИЯ
// ══════════════════════════════════════════════════════════════════
// ПЭД 0 — нечётные гармоники пилы: полый, деревянный стек.
$: note(PAD_A)
  .s('sawtooth').partials([1, 0, 0.5, 0, 0.3, 0, 0.16, 0, 0.08])
  .unison(3).detune(pads.pad.det)
  .gain(pads.pad.vol.mul(tlOr('pad')).mul(hA))
  .lpf(pads.pad.cut.mul(autoAt('pads.pad.cut'))).lpq(pads.pad.q).ftype('24db')
  .lpdepth(pads.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.3)
  .attack(1.2).decay(1.4).sustain(0.85).release(2.4)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('pad').mul(hA).fmap((v) => v > 0.001)).filter(audible)

// ПЭД 1 — синус с тёплым стеком гармоник: другой тембр, не только укладка.
$: note(PAD_B)
  .s('sine').partials([1, 0.55, 0.3, 0.16, 0.1, 0.06])
  .unison(2).detune(pads.pad.det.mul(0.8))
  .gain(pads.pad.vol.mul(tlOr('pad')).mul(hB))
  .lpf(pads.pad.cut.mul(1.2).mul(autoAt('pads.pad.cut'))).lpq(pads.pad.q.mul(0.8)).ftype('24db')
  .lpdepth(pads.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.22)
  .attack(1.0).decay(1.2).sustain(0.85).release(2.2)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('pad').mul(hB).fmap((v) => v > 0.001)).filter(audible)

$: note(ORGAN)
  .s('sine').partials([1, 0.3, 0.6, 0.15, 0.22, 0.08])
  .unison(2).detune(0.06)
  .gain(pads.organ.vol.mul(tlOr('organ')))
  .lpf(pads.organ.cut).lpq(1)
  .attack(0.4).decay(1).sustain(0.7).release(1.8)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('organ')).filter(audible)

// RHODES — FM на синусе: тёплый деревянный удар, не колокол.
$: note(KEYS)
  .struct(compPat)
  .s('sine').fm(pads.keys.fm).fmh(1.01)
  .gain(pads.keys.vol.mul(tlOr('keys')))
  .lpf(pads.keys.cut.mul(autoAt('pads.keys.cut'))).lpq(2)
  .decay(pads.keys.decay).sustain(0).release(0.35)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.4, 0.6))
  .mask(gateOf('keys')).filter(audible)

// ДУХОВОЙ АКЦЕНТ — только на 1-м и 5-м такте круга.
$: note(BRASS)
  .s('square').unison(2).detune(0.05)
  .vowel('<a o>')
  .gain(pads.brass.vol.mul(tlOr('brass')).mul(m('<1 0 0 0 1 0 0 0>')))
  .lpf(pads.brass.cut).lpq(4)
  .decay(pads.brass.decay).sustain(0).release(0.6)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('brass')).filter(audible)

// ══════════════════════════════════════════════════════════════════
//  МЕЛОДИКА
// ══════════════════════════════════════════════════════════════════
// TIA — главный арпеджио. 8 тактов = круг корней, поэтому всегда в аккорде.
$: note(TIA)
  .s('sawtooth').unison(2).detune(0.07)
  .gain(melody.tia.vol.mul(tlOr('tia')))
  .lpf(melody.tia.cut.mul(autoAt('melody.tia.cut'))).lpq(melody.tia.res).ftype('24db')
  .lpenv(melody.tia.env)
  .lpa(0.004).lpd(0.16).lpsustain(0.3)
  .lpdepth(melody.tia.lfo).lpsync(0.125).lpdc(0)
  .decay(0.09).sustain(0.25).release(0.1)
  .delay(melody.tia.echo).delaytime(0.375).delayfeedback(0.45)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.35, 0.65))
  .mask(gateOf('tia')).filter(audible)

// TIA alt — нисходящий контур и square: второй цвет, не второй слой.
$: note(TIA2)
  .s('square').unison(2).detune(0.05)
  .gain(melody.tia2.vol.mul(tlOr('tia2')))
  .lpf(melody.tia2.cut.mul(autoAt('melody.tia2.cut'))).lpq(melody.tia2.res).ftype('24db')
  .lpenv(melody.tia2.env)
  .lpa(0.004).lpd(0.18).lpsustain(0.28)
  .lpdepth(melody.tia2.lfo).lpsync(0.125).lpdc(0)
  .decay(0.1).sustain(0.22).release(0.12)
  .delay(melody.tia2.echo).delaytime(0.375).delayfeedback(0.45)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.6, 0.35))
  .mask(gateOf('tia2')).filter(audible)

$: note(MEL)
  .s('sine').fm(1.1).fmh(2.005)
  .gain(melody.mel.vol.mul(tlOr('mel')))
  .lpf(melody.mel.cut.mul(autoAt('melody.mel.cut'))).lpq(2)
  .attack(0.002).decay(melody.mel.decay).sustain(0.05).release(0.4)
  .delay(melody.mel.echo).delaytime(0.375).delayfeedback(0.4)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.4, 0.6))
  .mask(gateOf('mel')).filter(audible)

$: note(MEL2)
  .s('sine').fm(0.55).fmh(3.01)
  .gain(melody.mel2.vol.mul(tlOr('mel2')))
  .lpf(melody.mel2.cut).lpq(2)
  .attack(0.002).decay(melody.mel2.decay).sustain(0).release(0.5)
  .delay(melody.mel2.echo).delaytime(0.4375).delayfeedback(0.4)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.35, 0.65))
  .mask(gateOf('mel2')).filter(audible)

$: note(BUB)
  .s('sine').fm(0.7)
  .gain(melody.bub.vol.mul(tlOr('bub')))
  .lpf(melody.bub.cut).lpq(4)
  .decay(0.1).sustain(0).release(0.06)
  .delay(melody.bub.echo).delaytime(0.4375).delayfeedback(0.45)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('bub')).filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ФАКТУРА
// ══════════════════════════════════════════════════════════════════
// БЛИПЫ — высокие точки. 3-тактовый выбор ноты, чтобы не совпадать с кругом.
$: note(m('[f6|ab6|c6|eb6|g6|bb5]*8'))
  .struct(m('~ x ~ ~ x ~ ~ ~'))
  .s('sine')
  .gain(fx.blip.vol.mul(tlOr('blip')))
  .lpf(fx.blip.cut)
  .decay(0.04).sustain(0)
  .delay(fx.blip.delay).delaytime(fx.blip.time).delayfeedback(0.55)
  .pan(rand.range(-0.9, 0.9))
  .degradeBy(0.25)
  .mask(gateOf('blip')).filter(audible)

// ШУМОВОЙ СВИП — раз в 16 тактов; brown, чтобы не дублировать white.
$: s('brown')
  .gain(fx.sweep.vol.mul(tlOr('sweep')).mul(m('<0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0>')).mul(0.6))
  .hpf(500).lpf(fx.sweep.cut)
  .attack(0.02).decay(1.8).sustain(0).release(0.5)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('sweep')).filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ШПАРГАЛКА
// ══════════════════════════════════════════════════════════════════
//  транспорт: play 0 LOOP / 1 SONG / 2 HOLD, holdBar — такт для HOLD
//  режимы:    mode 0 jazz / 1 break / 2 half / 3 roll
//  гармония:  harmony 0 quartets / 1 ninths (нужен перезапуск, чтобы увидеть)
//  вход:      kick 0.45 → sub 0.22 → upright 0.5 → pad 0.18 → tia 0.28
//  ярче:      pads.pad.cut 1300 → 2600, melody.tia.cut 800 → 1600
//  глубже:    bass.upright.cut 520 → 320, kick.cut 260 → 160
//  Слои в SONG выключает TIMELINE, в LOOP — ручки, в HOLD — секция под holdBar.
// ══════════════════════════════════════════════════════════════════
