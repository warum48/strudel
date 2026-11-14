// ══════════════════════════════════════════════════════════════════
//  DARK TECHSTEP 02 · V2  ·  Strudel  ·  172 BPM  ·  dark jungle / IDM
//
//  Это v2 трека 02. v1 (`02-dark-techstep.js`) не тронут: новый файл,
//  та же основа, но другой grinder и настоящий chop/granular слой.
//
//  ── ЧТО ПРОЧИТАНО ВОВНЕ ────────────────────────────────────────
//  • DOA / The Grid, тред «how do you make dark sounding dnb/jungle»:
//    дарк делается саунд-дизайном, жуткими сэмплами, тёмными падами
//    и диссонансными стабами. Тритон (b5), малая секунда и 7-я —
//    главные интервалы. Это не «медленнее и с ревербом».
//  • Techstep guide (Preset Drive): биткраш и дисторшн на брейках,
//    промышленный кик (синус + питч-огибающая + дисторшн), снейр
//    с металлическим шумом, distorted Reese 600–800 Гц, FM-металл,
//    тёмные пады через bitcrush/distortion, срез верха, агрессивный
//    сайдчейн бочка→бас.
//  • Reese guide (Transmission Samples): две пилы ±детюн, унисон,
//    саб отдельным слоем, glide/portamento, фильтр-модуляция,
//    дисторшн. Саб не должен дисторшиться — он держит низ.
//  • IDM: глитч, гранулярность, bit reduction, buffer repeats,
//    stutter, resampling. Здесь это отдельный слой `glitch`/`click`
//    и режим 3.
//
//  ── СЭМПЛЫ (другие, не из 01) ──────────────────────────────────
//  samples('github:yaxu/clean-breaks/main')
//    apache       — главный брейк (Incredible Bongo Band), тяжелее Amen;
//    funkydrummer — второй брейк для джунгла/филла.
//  samples('github:tidalcycles/Dirt-Samples')
//    breaks165    — чистый брейк 165 BPM для нарезки (slice);
//    dist         — уже искажённые брейки (dist:4) для техстепа;
//    hardcore     — кик/снейр/хэт/краш: новый кит, не jungle;
//    industrial   — металлические удары;
//    glitch       — IDM-клики и цифровая грязь;
//    noise2       — шумовые вспышки;
//    padlong      — тёмный пад atmospheric-abduction;
//    space        — космические текстуры для атмосферы.
//  Amen, amencutup, think, jungle-кит и wind из 01 здесь НЕ используются.
//
//  ── ГАРМОНИЯ: D ФРИГИЙСКИЙ / УМЕНЬШЁННЫЙ, 8 ТАКТОВ ────────────
//  Dm7 → Ebmaj7 → Dm7 → Bbmaj7 → Gm7 → A°7 → Dm7 → Ebmaj7.
//  b2 (Eb) — главная «тревожная» нота, A°7 даёт тритон a–eb.
//  Тритоны здесь намеренные, поэтому в файле стоит маркер `@dark`:
//  tension разрешает их в якорных фразах (все фразы — 8 тактов), но
//  малые секунды в одном регистре остаются ошибкой.
//  @roots d eb d bb g a d eb
//  @dark
//
//  ── РЕЖИМЫ ─────────────────────────────────────────────────────
//  mode:     0 VOID (тёмный полутемп) / 1 JUNGLE (Apache + chop) /
//            2 TECHSTEP (бочка в пол, dist-брейк, ментосм-бас) /
//            3 GLITCH (IDM: рваные удары, glitch-клики, stutter).
//  harmony:  0 CLUSTER (синтезированные кластеры) /
//            1 DRONE (padlong + квинты).
//  mode и harmony — защёлки на 8 тактов.
//
//  ── СТАРТ ──────────────────────────────────────────────────────
//  Звучит только атмосфера (dust + space). Всё остальное в нуле:
//  сначала поднимай пады и саб, потом брейк, потом остальное.
//
//  ── ЧТО НОВОГО В V2 ────────────────────────────────────────────
//  * GRINDER больше не короткий 16-й риф: длинные ноты, долгая атака,
//    случайное движение FM/фильтра. Три варианта саунд-дизайна:
//      grind 0 — LONG    ( sustain, медленный фильтр, без рандома )
//      grind 1 — DRIFT   ( FM/срез плывут, иногда октава, jitter )
//      grind 2 — STUTTER ( ply/degrade, битый цифровой край )
//    Для каждого mode своя фраза: VOID / JUNGLE / TECHSTEP / GLITCH.
//  * GRAIN — настоящий `chop` (docs называют это granular-подходом):
//    Funky Drummer режется на 4/8/16 кусков, с настройками в панели
//    (cut/hpf/crush/speed/rev/jitter/drop). Это не `slice` из v1:
//    slice переставляет куски, chop играет их подряд.
//  * В шапке web-панели — кнопка DOWNLOAD SAMPLES со статусом.
// ══════════════════════════════════════════════════════════════════

const BPM = 172
setcpm(BPM / 4) // один цикл = один такт 4/4 (≈ 1.395 с)

// ══════════════════════════════════════════════════════════════════
//  СЭМПЛЫ
// ══════════════════════════════════════════════════════════════════
// В node samples() нет — вызов под typeof, чтобы verify шёл без сети.
if (typeof samples === 'function') {
  samples('github:yaxu/clean-breaks/main')
  samples('github:tidalcycles/Dirt-Samples')
}

// ══════════════════════════════════════════════════════════════════
//  ШИРИНА СЛАЙДЕРОВ + СИНХРОНИЗАЦИЯ
// ══════════════════════════════════════════════════════════════════
const SLIDER_PX = 180
if (typeof document !== 'undefined' && !document.getElementById('slider-w')) {
  const st = document.createElement('style')
  st.id = 'slider-w'
  st.textContent = '.cm-slider input { width: ' + SLIDER_PX + 'px !important; }'
  document.head.appendChild(st)
}

if (typeof document !== 'undefined' && !window.__sliderSync) {
  const syncSliders = () => {
    const m = window.strudelMirror
    if (!m || !m.editor) return
    const doc = m.editor.state.doc
    for (const el of document.querySelectorAll('.cm-slider input')) {
      if (typeof el.from !== 'number') continue
      const t = doc.sliceString(el.from, el.from + 24).match(/^-?\d+(?:\.\d+)?/)
      if (!t) continue
      if (el.originalValue !== t[0]) el.originalValue = t[0]
      if (Number(el.value) !== Number(t[0])) el.value = t[0]
    }
  }
  window.__sliderSync = setInterval(syncSliders, 200)
  document.addEventListener('scroll', () => requestAnimationFrame(syncSliders), true)
  document.addEventListener('pointerdown', syncSliders, true)
}

// ══════════════════════════════════════════════════════════════════
//  GLIDE — слайд от предыдущей ноты (для гринд-баса)
// ══════════════════════════════════════════════════════════════════
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
//  ПЕРЕКЛЮЧАТЕЛИ
// ══════════════════════════════════════════════════════════════════
// @switches mode=void,jungle,techstep,glitch harmony=cluster,drone grind=long,drift,stutter grain=4,8,16
const mode = slider(0, 0, 3, 1)
const m0 = mode.fmap((m) => (m === 0 ? 1 : 0))
const m1 = mode.fmap((m) => (m === 1 ? 1 : 0))
const m2 = mode.fmap((m) => (m === 2 ? 1 : 0))
const m3 = mode.fmap((m) => (m === 3 ? 1 : 0))
// Apache-подложка: везде, кроме чистого IDM-режима.
const mBreak = mode.fmap((m) => (m === 3 ? 0 : 1))
// Нарезка и dist-брейк — в джунгле/техстепе/глитче.
const mCut = mode.fmap((m) => (m === 1 || m === 2 || m === 3 ? 1 : 0))

const harmony = slider(0, 0, 1, 1)
const hQ = harmony.seg(1 / 8)
const hA = hQ.fmap((h) => (h < 0.5 ? 1 : 0))
const hB = hQ.fmap((h) => (h < 0.5 ? 0 : 1))

// GRINDER-ВАРИАНТ: 0 LONG / 1 DRIFT / 2 STUTTER.
const grind = slider(0, 0, 2, 1)
const gLong = grind.fmap((g) => (g === 0 ? 1 : 0))
const gDrift = grind.fmap((g) => (g === 1 ? 1 : 0))
const gStutter = grind.fmap((g) => (g === 2 ? 1 : 0))

// GRAIN: 0 = 4 куска, 1 = 8, 2 = 16. Это chop, а не slice.
const grain = slider(1, 0, 2, 1)
const g4 = grain.fmap((g) => (g === 0 ? 1 : 0))
const g8 = grain.fmap((g) => (g === 1 ? 1 : 0))
const g16 = grain.fmap((g) => (g === 2 ? 1 : 0))

// ══════════════════════════════════════════════════════════════════
//  ОБЩЕЕ
// ══════════════════════════════════════════════════════════════════
const verb = slider(0.6, 0, 1, 0.01)   // тёмный, большой реверб
const duck = slider(0.8, 0, 1, 0.01)   // агрессивный сайдчейн низа

// ══════════════════════════════════════════════════════════════════
//  ИНСТРУМЕНТЫ
// ══════════════════════════════════════════════════════════════════
const instruments = {
  // ── БРЕЙКИ ─────────────────────────────────────────────────────
  breaks: {
    name: 'Breaks',
    // Apache — главный брейк. Не Amen: другая динамика, другой низ.
    apache: {
      name: 'Apache',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(4200, 200, 16000, 100),
      hpf: slider(60, 20, 500, 10),
      crush: slider(11, 1, 16, 0.5),
      shape: slider(0.25, 0, 0.95, 0.01),
      room: slider(0.12, 0, 1, 0.01),
    },
    // Funky Drummer — второй брейк только в джунгле/глитче.
    funk: {
      name: 'Funky Drummer',
      vol: slider(0, 0, 0.8, 0.01),
      cut: slider(5000, 300, 16000, 100),
      hpf: slider(80, 20, 500, 10),
      crush: slider(13, 1, 16, 0.5),
    },
    // Нарезка breaks165: 16 кусков, рваный рисунок, не Amen-chop.
    cut: {
      name: 'Breaks165 cut',
      vol: slider(0, 0, 0.9, 0.01),
      cut: slider(7000, 500, 16000, 100),
      hpf: slider(100, 20, 800, 10),
      crush: slider(10, 1, 16, 0.5),
    },
    // dist:4 — уже искажённый брейк, для техстепа.
    dist: {
      name: 'Distorted break',
      vol: slider(0, 0, 0.8, 0.01),
      cut: slider(3000, 200, 12000, 50),
      hpf: slider(80, 20, 500, 10),
      crush: slider(8, 1, 16, 0.5),
    },
    // GRAIN — настоящий chop: сэмпл режется на 4/8/16 кусков и играет
    // их подряд. Все настройки — в панели, как обычные ручки.
    grain: {
      name: 'Grain chop',
      vol: slider(0, 0, 0.9, 0.01),
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

  // ── БАРАБАНЫ ───────────────────────────────────────────────────
  // hardcore: 0 closedhh, 2 crash, 4 kick1, 6 openhh, 7/8 perc,
  // 10 snare1, 11 snare2.
  drums: {
    name: 'Drums',
    kick: {
      name: 'Industrial kick',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(650, 80, 5000, 10),
      shape: slider(0.7, 0, 0.95, 0.01),
      crush: slider(13, 1, 16, 0.5),
      decay: slider(0.4, 0.1, 2, 0.01),
    },
    snare: {
      name: 'Metal snare',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(5200, 800, 14000, 100),
      decay: slider(0.16, 0.03, 0.7, 0.01),
      air: slider(0, 0, 0.8, 0.01),          // шумовой слой поверх снейра
    },
    hat: {
      name: 'Hardcore hats',
      vol: slider(0, 0, 0.8, 0.01),
      cut: slider(8200, 800, 16000, 100),
    },
    ohat: {
      name: 'Open hats',
      vol: slider(0, 0, 0.6, 0.01),
      cut: slider(6000, 800, 16000, 100),
    },
    metal: {
      name: 'Metal hits',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(5000, 300, 14000, 100),
      echo: slider(0.25, 0, 0.8, 0.01),
    },
    click: {
      name: 'Glitch clicks',
      vol: slider(0, 0, 0.6, 0.01),
      cut: slider(9000, 800, 16000, 100),
      crush: slider(7, 1, 16, 0.5),
    },
    crash: {
      name: 'Crash',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(7000, 1000, 16000, 100),
    },
  },

  // ── БАС ────────────────────────────────────────────────────────
  bass: {
    name: 'Bass',
    // ABYSS — чистый саб. Не дисторшится: он держит низ, а не характер.
    abyss: {
      name: 'Abyss sub',
      vol: slider(0, 0, 1.2, 0.01),
      cut: slider(90, 40, 300, 5),
      decay: slider(0.8, 0.1, 3, 0.01),
    },
    // GRINDER — FM-гринд: синус с FM, металлические обертоны,
    // низкий срез и дисторшн. Это главный дарк-бас.
    grinder: {
      name: 'FM grinder',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(620, 80, 3000, 10),
      res: slider(9, 0, 26, 0.5),
      fm: slider(3.4, 0.2, 8, 0.1),
      ratio: slider(1.51, 0.5, 4, 0.01),
      drive: slider(1.8, 0.2, 2.6, 0.01),
      dist: slider(0.35, 0, 0.9, 0.01),
      decay: slider(0.3, 0.05, 1.5, 0.01),
      glide: slider(0.04, 0, 0.15, 0.001),
      attack: slider(0.8, 0.01, 2, 0.01),    // долгая атака: это не панч
      release: slider(2, 0.1, 4, 0.01),
      fmMod: slider(0.8, 0, 3, 0.01),        // размах случайного FM
      lfo: slider(1.2, 0, 8, 0.1),           // медленное движение среза
      chance: slider(0.3, 0, 1, 0.01),       // вероятность сдвига/стана
      jitter: slider(0.02, 0, 0.1, 0.001),   // случайное время
      drop: slider(0.1, 0, 0.5, 0.01),       // вероятность пропуска
    },
    // COIL — широкий Reese с вокальным фильтром. Не саб, а середина.
    coil: {
      name: 'Coil Reese',
      vol: slider(0, 0, 0.8, 0.01),
      cut: slider(700, 100, 4000, 10),
      res: slider(12, 0, 26, 0.5),
      det: slider(0.22, 0.02, 0.6, 0.01),
      drive: slider(1.3, 0.2, 2.6, 0.01),
      lfo: slider(1.6, 0, 8, 0.1),
    },
    // WRAITH — высокий FM-крик для IDM/техстепа.
    wraith: {
      name: 'Wraith scream',
      vol: slider(0, 0, 0.6, 0.01),
      cut: slider(4000, 300, 14000, 50),
      fm: slider(6, 1, 12, 0.1),
      ratio: slider(2.41, 1, 4, 0.01),
      decay: slider(0.1, 0.02, 1, 0.01),
    },
  },

  // ── ПЭДЫ ───────────────────────────────────────────────────────
  pads: {
    name: 'Pads',
    // VOID — синтезированный кластер. partials + унисон + chorus,
    // низкий срез: верх специально убран, чтобы было «холодно».
    void: {
      name: 'Void cluster',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(1100, 80, 6000, 10),
      hpf: slider(70, 20, 500, 10),
      q: slider(2, 0, 20, 0.5),
      lfo: slider(0.6, 0, 6, 0.1),
      det: slider(0.18, 0, 0.6, 0.01),
      grit: slider(0.18, 0, 0.6, 0.01),
    },
    // TAPE — сэмпл padlong (atmospheric-abduction), растянутый на 8
    // тактов. Это не «ещё один пад», а записанная тёмная комната.
    tape: {
      name: 'Tape pad',
      vol: slider(0, 0, 0.6, 0.01),
      cut: slider(1400, 80, 8000, 10),
      hpf: slider(80, 20, 500, 10),
      crush: slider(11, 1, 16, 0.5),
    },
    // DRONE — низкий корень+квинта во втором режиме гармонии.
    drone: {
      name: 'Drone',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(420, 40, 3000, 10),
    },
  },

  // ── ЛИДЫ ───────────────────────────────────────────────────────
  leads: {
    name: 'Leads',
    // BELL — металлический FM-колокол. Тритоны в мелодии намеренные.
    bell: {
      name: 'Metal bell',
      vol: slider(0, 0, 0.8, 0.01),
      cut: slider(5000, 300, 14000, 50),
      fm: slider(4.2, 0.5, 12, 0.1),
      ratio: slider(2.76, 0.5, 4, 0.01),
      decay: slider(0.5, 0.05, 2, 0.01),
      echo: slider(0.5, 0, 0.9, 0.01),
    },
    // PULSE — IDM-блипы: квадрат, bitcrush, stutter.
    pulse: {
      name: 'IDM pulse',
      vol: slider(0, 0, 0.6, 0.01),
      cut: slider(9000, 500, 16000, 100),
      crush: slider(6, 1, 16, 0.5),
      decay: slider(0.06, 0.01, 0.4, 0.01),
      echo: slider(0.35, 0, 0.9, 0.01),
    },
  },

  // ── ЭФФЕКТЫ ────────────────────────────────────────────────────
  fx: {
    name: 'FX',
    impact: {
      name: 'Impact',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(120, 40, 600, 5),
    },
    reverse: {
      name: 'Reverse swell',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(2500, 200, 12000, 50),
    },
    reverb: {
      name: 'Reverb',
      size: slider(14, 1, 20, 0.5),          // большая тёмная комната
    },
  },

  // ── АТМОСФЕРА ──────────────────────────────────────────────────
  atmos: {
    name: 'Atmos',
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


const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}


// ══════════════════════════════════════════════════════════════════
//  ФРАЗЫ
// ══════════════════════════════════════════════════════════════════
const phrase = (bars) => m('<' + bars.join(' ') + '>')

// Корни: Dm7 → Ebmaj7 → Dm7 → Bb → Gm7 → A°7 → Dm7 → Ebmaj7.
// @roots d eb d bb g a d eb
// @dark

// ROOT — саб по корням, одна нота на такт.
const ROOT = phrase([
  '[d1]', '[eb1]', '[d1]', '[bb1]',
  '[g1]', '[a1]', '[d1]', '[eb1]',
])

// PAD_A — тёмные кластеры. A°7 даёт тритон a–eb; Eb — b2.
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

// PAD_B — DRONE: только корень и квинта. Второй режим не спорит
// с кластерами, а держит пустоту.
const PAD_B = phrase([
  '[d3,a3]',
  '[eb3,bb3]',
  '[d3,a3]',
  '[bb2,f3]',
  '[g2,d3]',
  '[a2,eb3]',
  '[d3,a3]',
  '[eb3,bb3]',
])

// GRINDER, 4 фразы под режимы. Ноты длиннее, чем в v1: @ держит их
// внутри такта. Тритоны прежние: d–ab, eb–a, bb–e, g–db, a–eb.
// Это не ошибка: @dark разрешает их в якорной 8-тактовой фразе.
const GRIND_VOID = phrase([
  '[d2]', '[ab2]', '[eb2]', '[a1]',
  '[d2]', '[bb1]', '[e2]', '[eb2]',
])

const GRIND_JUNGLE = phrase([
  '[d2@2 ab2@2]',
  '[eb2@2 a2@2]',
  '[d2@3 ~]',
  '[bb1@2 e2@2]',
  '[g1@2 db2@2]',
  '[a1@2 eb2@2]',
  '[d2@2 ab2@2]',
  '[eb2@2 a2@2]',
])

const GRIND_TECH = phrase([
  '[d2@3 ab2@1]',
  '[eb2@3 a2@1]',
  '[d2@2 ~ ab2@2]',
  '[bb1@3 e2@1]',
  '[g1@3 db2@1]',
  '[a1@3 eb2@1]',
  '[d2@3 ab2@1]',
  '[eb2@3 a2@1]',
])

const GRIND_GLITCH = phrase([
  '[d2@2 ~ ab2@2]',
  '[eb2@2 a2@2]',
  '[d2@1 ab2@3]',
  '[bb1@2 e2@2]',
  '[g1@2 db2@2]',
  '[a1@1 eb2@3]',
  '[d2@2 ab2@2]',
  '[eb2@1 a2@3]',
])

// COIL — одна длинная нота на такт. Широкий Reese, не риф.
const COIL = phrase([
  '[d2]', '[eb2]', '[d2]', '[bb1]',
  '[g1]', '[a1]', '[d2]', '[eb2]',
])

// BELL — мелодия из тритонов: a–eb, bb–e, d–ab, f–b, g–db.
// Редкие ноты; дарк здесь в интервалах, а не в плотности.
const BELL = phrase([
  '[~ ~ a4 ~ ~ eb5 ~ ~]',
  '[~ ~ bb4 ~ ~ e5 ~ ~]',
  '[~ ~ d5 ~ ~ ab4 ~ ~]',
  '[~ ~ f4 ~ ~ b4 ~ ~]',
  '[~ ~ g4 ~ ~ db5 ~ ~]',
  '[~ ~ a4 ~ ~ eb5 ~ ~]',
  '[~ ~ d5 ~ ~ ab4 ~ ~]',
  '[~ ~ eb5 ~ ~ a4 ~ ~]',
])

// WRAITH — высокий крик, ещё реже. Это акцент IDM, не мелодия.
const WRAITH = phrase([
  '[~ ~ ~ eb6 ~ ~ ~ ~]',
  '[~ ~ ~ a5 ~ ~ ~ ~]',
  '[~ ~ ~ d6 ~ ~ ~ ~]',
  '[~ ~ ~ ab5 ~ ~ ~ ~]',
  '[~ ~ ~ g5 ~ ~ ~ ~]',
  '[~ ~ ~ db6 ~ ~ ~ ~]',
  '[~ ~ ~ d6 ~ ~ ~ ~]',
  '[~ ~ ~ eb6 ~ ~ ~ ~]',
])

// ══════════════════════════════════════════════════════════════════
//  АТМОСФЕРА — звучит с первого нажатия
// ══════════════════════════════════════════════════════════════════

// ПЫЛЬ — шумовой слой, срез дышит; верх срезан, чтобы не было «воздуха»
$: s("noise2:0")
  .gain(atmos.dust.vol)
  .lpf(atmos.dust.cut).hpf(atmos.dust.hpf).lpq(0.9).ftype("24db")
  .lpdepth(atmos.dust.lfo).lpsync(0.0625).lpdc(0)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// КОСМОС — сэмпл space, растянутый на 8 тактов. Не мелодия, а среда.
$: s("space:0")
  .loopAt(8)
  .gain(atmos.space.vol)
  .lpf(atmos.space.cut).hpf(atmos.space.hpf)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(32).range(0.3, 0.7))
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  БРЕЙКИ — Apache, Funky Drummer, нарезка, dist
// ══════════════════════════════════════════════════════════════════

// APACHE — главный брейк. Биткраш + shape: это не «чистый луп»,
// а запись, прошедшая через убитый сэмплер.
$: s("apache")
  .loopAt(2)
  .gain(breaks.apache.vol.mul(mBreak))
  .hpf(breaks.apache.hpf).lpf(breaks.apache.cut)
  .crush(breaks.apache.crush)
  .shape(breaks.apache.shape)
  .room(breaks.apache.room).roomsize(fx.reverb.size)
  .filter(audible)

// FUNKY DRUMMER — второй брейк. Только джунгл/глитч: в техстепе
// он бы спорил с dist-брейком.
$: s("funkydrummer")
  .loopAt(2)
  .gain(breaks.funk.vol.mul(m1.add(m3)))
  .hpf(breaks.funk.hpf).lpf(breaks.funk.cut)
  .crush(breaks.funk.crush)
  .room(0.1).roomsize(fx.reverb.size)
  .filter(audible)

// BREAKS165 CUT — 16 кусков, рваный рисунок с повторами. Это не
// амен-чоп: другая нарезка, другие акценты.
$: s("breaks165")
  .slice(16, "<[0 0 2 3 0 4 5 6 0 0 8 9 0 10 11 12] [1 1 3 4 1 5 6 7 1 1 9 10 1 11 12 13]>")
  .clip(1)
  .gain(breaks.cut.vol.mul(mCut))
  .hpf(breaks.cut.hpf).lpf(breaks.cut.cut)
  .crush(breaks.cut.crush)
  .sometimesBy(0.18, (x) => x.speed(-1))
  .room(0.15).roomsize(fx.reverb.size)
  .filter(audible)

// DIST BREAK — уже искажённый брейк. В техстепе это второй слой
// агрессии; в глитче — лужа, из которой торчат клики.
$: s("dist:4")
  .loopAt(2)
  .gain(breaks.dist.vol.mul(m2.add(m3)))
  .hpf(breaks.dist.hpf).lpf(breaks.dist.cut)
  .crush(breaks.dist.crush)
  .shape(0.4)
  .room(0.1).roomsize(fx.reverb.size)
  .filter(audible)

// GRAIN — настоящий chop/granular. `chop(n)` режет Funky Drummer на
// n кусков и играет их подряд; `slice` из v1 их переставлял. Размер
// выбирается переключателем 4/8/16, всё остальное — ручки панели.
const grainChain = (n, on) => s("funkydrummer")
  .chop(n)
  .gain(breaks.grain.vol.mul(on).mul(mCut))
  .hpf(breaks.grain.hpf).lpf(breaks.grain.cut)
  .crush(breaks.grain.crush)
  .speed(breaks.grain.speed)
  .sometimesBy(breaks.grain.rev, (x) => x.speed(breaks.grain.speed.mul(-1)))
  .nudge(rand.sub(0.5).mul(breaks.grain.jitter))
  .degradeBy(breaks.grain.drop)
  .room(breaks.grain.room).roomsize(fx.reverb.size)
  .filter(audible)

// GRAIN 4 — крупные куски, слышно тело брейка
$: grainChain(4, g4)

// GRAIN 8 — средний помол
$: grainChain(8, g8)

// GRAIN 16 — мелкая цифровая крошка
$: grainChain(16, g16)

// ══════════════════════════════════════════════════════════════════
//  УДАРНЫЕ
// ══════════════════════════════════════════════════════════════════

// INDUSTRIAL KICK — hardcore:4. Громкость внутри веток: `.gain()`
// СТАВИТ громкость, поэтому общий gain стёр бы гейты режимов.
$: stack(
     s("hardcore:4 ~ ~ ~ ~ ~ ~ ~ ~ ~ hardcore:4 ~ ~ ~ ~ ~").gain(drums.kick.vol.mul(m0)),
     s("hardcore:4 ~ ~ ~ hardcore:4 ~ ~ ~ ~ ~ hardcore:4 ~ ~ ~ ~ ~").gain(drums.kick.vol.mul(m1)),
     s("hardcore:4 ~ ~ ~ hardcore:4 ~ ~ ~ hardcore:4 ~ ~ ~ hardcore:4 ~ ~ ~").gain(drums.kick.vol.mul(m2)),
     s("hardcore:4 ~ ~ hardcore:4 ~ ~ hardcore:4 ~ ~ ~ hardcore:4 ~ ~ hardcore:4 ~").gain(drums.kick.vol.mul(m3)),
   )
  .lpf(drums.kick.cut).lpq(1)
  .shape(drums.kick.shape)
  .crush(drums.kick.crush)
  .decay(drums.kick.decay).sustain(0).release(0.08)
  .duckorbit(2).duckdepth(duck).duckattack(0.01)
  .filter(audible)

// METAL SNARE — hardcore:10 + призрак :11. В техстепе добавляется
// шумовой слой `air`: он даёт металлический оверхед, но не реверб.
$: stack(
     s("~ ~ ~ ~ hardcore:10 ~ ~ ~ ~ ~ ~ ~ hardcore:10 ~ ~ ~").gain(drums.snare.vol.mul(m0)),
     s("~ ~ ~ ~ hardcore:10 ~ ~ ~ ~ ~ ~ ~ hardcore:10 ~ ~ ~").gain(drums.snare.vol.mul(m1)),
     s("~ ~ ~ ~ hardcore:10 ~ ~ ~ hardcore:10 ~ ~ hardcore:10 ~ ~ ~").gain(drums.snare.vol.mul(m2)),
     s("~ ~ ~ ~ hardcore:10 ~ ~ ~ ~ ~ ~ ~ hardcore:10 ~ ~ ~").gain(drums.snare.vol.mul(m3)),
     s("~ ~ ~ ~ ~ ~ hardcore:11 ~ ~ ~ ~ ~ ~ ~ hardcore:11 ~").gain(drums.snare.vol.mul(m1).mul(0.28)),
     s("~ ~ hardcore:11 ~ ~ ~ ~ ~ hardcore:11 ~ ~ ~ ~ ~ hardcore:11 ~").gain(drums.snare.vol.mul(m3).mul(0.3)),
   )
  .lpf(drums.snare.cut).hpf(180)
  .decay(drums.snare.decay).sustain(0).release(0.08)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// SNARE AIR — шумовая вспышка поверх снейра. По умолчанию 0; это
// ручка «металл», а не обязательный слой.
$: s("noise2:0")
  .struct("~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~")
  .gain(drums.snare.air.mul(mode.fmap((m) => (m >= 1 ? 1 : 0))))
  .lpf(9000).hpf(1500)
  .decay(0.05).sustain(0)
  .pan(rand.mul(0.8).sub(0.4))
  .room(0.2).roomsize(fx.reverb.size)
  .filter(audible)

// HARDCORE HATS — 16-е. В VOID — 8-е со свингом 20%.
$: stack(
     s("hardcore:0*8").gain(drums.hat.vol.mul("[1 .4 .7 .4]*2").mul(m0)).swingBy(0.2, 8),
     s("hardcore:0*16").gain(drums.hat.vol.mul("[1 .3 .6 .3]*4").mul(m1)),
     s("hardcore:0*8").gain(drums.hat.vol.mul("[1 .5]*4").mul(m2)),
     s("hardcore:0*16").gain(drums.hat.vol.mul("[1 .25 .55 .25 .8 .25 .55 .25]*2").mul(m3)),
   )
  .lpf(drums.hat.cut).hpf(500)
  .sometimesBy(0.14, (x) => x.ply(2))
  .lastOf(4, (x) => x.ply(2))
  .degradeBy(0.04)
  .filter(audible)

// OPEN HATS — на «и», в джунгле/техстепе/глитче
$: stack(
     s("~ ~ hardcore:6 ~ ~ ~ hardcore:6 ~ ~ ~ hardcore:6 ~ ~ ~ hardcore:6 ~").gain(drums.ohat.vol.mul(m1)),
     s("~ ~ hardcore:6 ~ ~ ~ hardcore:6 ~ ~ ~ hardcore:6 ~ ~ ~ hardcore:6 ~").gain(drums.ohat.vol.mul(m2).mul(0.8)),
     s("~ ~ hardcore:6 ~ ~ ~ hardcore:6 ~ ~ ~ hardcore:6 ~ ~ ~ hardcore:6 ~").gain(drums.ohat.vol.mul(m3).mul(0.7)),
   )
  .lpf(drums.ohat.cut)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// METAL HITS — industrial-сэмплы. Случайная скорость и панорама:
// это не ритм, а обломки, летящие по такту.
$: s("industrial")
  .n("<0 5 12 20 27 3>")
  .struct("~ x ~ ~ x ~ ~ ~ ~ x ~ ~ x ~ ~ ~")
  .gain(drums.metal.vol.mul(m1.add(m2).add(m3)))
  .lpf(drums.metal.cut).hpf(300)
  .speed(rand.range(0.7, 1.3))
  .sometimesBy(0.3, (x) => x.ply(2))
  .pan(rand.mul(1.6).sub(0.8))
  .delay(drums.metal.echo).delaytime(0.1875).delayfeedback(0.35)
  .room(0.3).roomsize(fx.reverb.size)
  .filter(audible)

// GLITCH CLICKS — IDM-слой. Только в режиме 3; в остальных это была
// бы просто цифровая пыль поверх джунгла.
$: s("glitch")
  .n("<2 5 6 7>")
  .struct("~ ~ x ~ x ~ ~ x ~ x ~ ~ x ~ ~ x")
  .gain(drums.click.vol.mul(m3))
  .lpf(drums.click.cut)
  .crush(drums.click.crush)
  .sometimesBy(0.4, (x) => x.ply(2))
  .speed(rand.range(0.6, 1.4))
  .pan(rand.mul(1.8).sub(0.9))
  .room(0.15).roomsize(fx.reverb.size)
  .filter(audible)

// CRASH — hardcore:2, раз в 8 тактов
$: s("hardcore:2")
  .gain(drums.crash.vol.mul("<1 0 0 0 0 0 0 0>"))
  .lpf(drums.crash.cut).hpf(2000)
  .decay(0.9).sustain(0)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  БАС — саб, FM-гринд, Reese и крик
// ══════════════════════════════════════════════════════════════════

// ABYSS — чистый саб. Без дисторшна: он держит низ, а не характер.
// Срез 90 Гц, shape 0.35 — это не «синус в ноль», а тело.
$: note(ROOT)
  .s("sine")
  .gain(bass.abyss.vol)
  .lpf(bass.abyss.cut).lpq(1)
  .shape(0.35)
  .attack(0.004).decay(bass.abyss.decay).sustain(0.75).release(0.2)
  .orbit(2)
  ._pianoroll()
  .filter(audible)

// GRIND NOTES — одна сетка на три варианта саунд-дизайна. Фраза
// выбирается режимом, звук — ручкой grind.
const grindNotes = (on) => stack(
  note(GRIND_VOID).gain(m0.mul(on).mul(bass.grinder.vol)),
  note(GRIND_JUNGLE).gain(m1.mul(on).mul(bass.grinder.vol)),
  note(GRIND_TECH).gain(m2.mul(on).mul(bass.grinder.vol)),
  note(GRIND_GLITCH).gain(m3.mul(on).mul(bass.grinder.vol)),
)

// 0 LONG — длинные ноты, долгая атака, медленно плывущий срез.
// Это тот же FM-гринд, но он дышит, а не строчит.
$: grindNotes(gLong)
  .s("sine").fm(bass.grinder.fm).fmh(bass.grinder.ratio)
  .glide(bass.grinder.glide.mul("0 0 1 0 0 0 1 0"))
  .lpf(bass.grinder.cut).lpq(bass.grinder.res).ftype("ladder").drive(bass.grinder.drive)
  .lpenv(2.6)
  .lpa(0.006).lpd(0.18).lpsustain(0.4)
  .lpdepth(bass.grinder.lfo).lpsync(0.5).lpdc(1)
  .shape(0.25)
  .distort(bass.grinder.dist).distortvol(0.6)
  .attack(bass.grinder.attack).decay(0.6).sustain(0.8).release(bass.grinder.release)
  .orbit(2)
  ._pianoroll()
  .filter(audible)

// 1 DRIFT — FM и срез двигаются случайно, иногда нота уезжает на
// октаву, время чуть плывёт. Живой, неровный бас.
$: grindNotes(gDrift)
  .s("sine")
  .fm(bass.grinder.fm.add(perlin.slow(8).mul(bass.grinder.fmMod)))
  .fmh(bass.grinder.ratio)
  .glide(bass.grinder.glide.mul("0 0 1 0 0 0 1 0"))
  .sometimesBy(bass.grinder.chance, (x) => x.add(note("12")))
  .nudge(rand.sub(0.5).mul(bass.grinder.jitter))
  .lpf(bass.grinder.cut.add(perlin.slow(8).mul(220)))
  .lpq(bass.grinder.res).ftype("ladder").drive(bass.grinder.drive)
  .lpenv(2.6)
  .lpa(0.006).lpd(0.2).lpsustain(0.4)
  .lpdepth(bass.grinder.lfo).lpsync(0.5).lpdc(1)
  .shape(0.25)
  .distort(bass.grinder.dist).distortvol(0.6)
  .attack(bass.grinder.attack.mul(0.6)).decay(0.5).sustain(0.75).release(bass.grinder.release.mul(0.8))
  .orbit(2)
  ._pianoroll()
  .filter(audible)

// 2 STUTTER — ply/degrade и bitcrush: длинные ноты, но с цифровым
// заиканием. Это уже IDM-край, не гладкий дарк.
$: grindNotes(gStutter)
  .s("sine").fm(bass.grinder.fm).fmh(bass.grinder.ratio)
  .sometimesBy(bass.grinder.chance, (x) => x.ply(2))
  .sometimesBy(0.2, (x) => x.ply(3))
  .degradeBy(bass.grinder.drop)
  .nudge(rand.sub(0.5).mul(bass.grinder.jitter))
  .lpf(bass.grinder.cut).lpq(bass.grinder.res).ftype("ladder").drive(bass.grinder.drive)
  .lpenv(2.6).lpa(0.004).lpd(0.14).lpsustain(0.3)
  .crush(perlin.range(8, 14))
  .shape(0.3)
  .distort(bass.grinder.dist).distortvol(0.6)
  .attack(bass.grinder.attack.mul(0.35)).decay(0.3).sustain(0.6).release(bass.grinder.release.mul(0.5))
  .orbit(2)
  ._pianoroll()
  .filter(audible)

// COIL — широкий Reese с вокальным фильтром. Одна нота на такт:
// это не риф, а давление. `vowel` строкой, не паттерном: иначе слой
// молча умирает (грабля из 11).
$: note(COIL)
  .s("sawtooth").unison(3).detune(bass.coil.det)
  .vowel("<a e>")
  .gain(bass.coil.vol)
  .lpf(bass.coil.cut).lpq(bass.coil.res).ftype("ladder").drive(bass.coil.drive)
  .lpdepth(bass.coil.lfo).lpsync(0.25).lpdc(1)
  .decay(0.4).sustain(0.8).release(0.3)
  .room(0.15).roomsize(fx.reverb.size)
  .orbit(2)
  .filter(audible)

// WRAITH — высокий FM-крик. Только техстеп/глитч: в джунгле это
// была бы уже не тёмная краска, а цирк.
$: note(WRAITH)
  .s("sine").fm(leads.bell.fm.mul(1.4)).fmh(bass.wraith.ratio)
  .gain(bass.wraith.vol.mul(m2.add(m3)))
  .lpf(bass.wraith.cut).hpf(300)
  .decay(bass.wraith.decay).sustain(0).release(0.1)
  .delay(0.3).delaytime(0.1875).delayfeedback(0.35)
  .room(verb).roomsize(fx.reverb.size)
  .pan(rand.mul(1.2).sub(0.6))
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ГАРМОНИЯ
// ══════════════════════════════════════════════════════════════════

// VOID — синтезированный кластер. partials + унисон + chorus;
// низкий срез, верх убран. `grit` добавляет waveshaper.
$: note(PAD_A)
  .s("sawtooth").partials([1, 0.2, 0.6, 0.1, 0.35, 0.05, 0.25])
  .unison(3).detune(pads.void.det)
  .gain(pads.void.vol.mul(hA))
  .lpf(pads.void.cut).hpf(pads.void.hpf).lpq(pads.void.q).ftype("24db")
  .lpdepth(pads.void.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.4)
  .shape(pads.void.grit)
  .attack(3).decay(2).sustain(0.85).release(8)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// TAPE — записанный тёмный пад, растянутый на 8 тактов. Это не
// «ещё один синтез»: у него своя комната и свои дефекты.
$: s("padlong:0")
  .loopAt(8)
  .gain(pads.tape.vol.mul(hB))
  .lpf(pads.tape.cut).hpf(pads.tape.hpf)
  .crush(pads.tape.crush)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(64).range(0.3, 0.7))
  .filter(audible)

// DRONE — корень+квинта в самом низу, только в DRONE-режиме.
$: note(PAD_B)
  .s("sawtooth").unison(2).detune(0.06)
  .gain(pads.drone.vol.mul(hB))
  .lpf(pads.drone.cut).hpf(40).ftype("24db").lpq(2)
  .attack(2).decay(2).sustain(0.9).release(8)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ЛИДЫ
// ══════════════════════════════════════════════════════════════════

// BELL — металлический FM-колокол. Мелодия из тритонов: тёмная,
// но не хаотичная. Длинный дилей делает из неё пространство.
$: note(BELL)
  .s("sine").fm(leads.bell.fm).fmh(leads.bell.ratio)
  .gain(leads.bell.vol)
  .lpf(leads.bell.cut).hpf(200).lpq(2)
  .decay(leads.bell.decay).sustain(0).release(1.5)
  .delay(leads.bell.echo).delaytime(0.1875).delayfeedback(0.45)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.3, 0.7))
  ._pianoroll()
  .filter(audible)

// PULSE — IDM-блипы. Короткие, битые, с паузами. Это не мелодия,
// а цифровой мусор, который иногда попадает в ритм.
$: note("[d6|eb6|a5|bb5]")
  .struct("~ x ~ ~ x ~ ~ x")
  .s("square")
  .gain(leads.pulse.vol)
  .lpf(leads.pulse.cut)
  .crush(leads.pulse.crush)
  .decay(leads.pulse.decay).sustain(0).release(0.05)
  .delay(leads.pulse.echo).delaytime(0.1875).delayfeedback(0.3)
  .pan(rand.mul(1.6).sub(0.8))
  .degradeBy(0.2)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ЭФФЕКТЫ
// ══════════════════════════════════════════════════════════════════

// ИМПАКТ — низкий синус на входе, раз в 8 тактов
$: note("a1")
  .s("sine")
  .gain(fx.impact.vol.mul("<1 0 0 0 0 0 0 0>"))
  .lpf(fx.impact.cut)
  .attack(0.002).decay(2).sustain(0).release(1)
  .room(0.4).roomsize(fx.reverb.size)
  .filter(audible)

// ОБРАТНЫЙ СВЕЛЛ — шум задом наперёд, перед 8-м тактом. В техстепе
// это «всасывание» перед ударом, а не украшение.
$: s("noise2:0")
  .speed(-1)
  .gain(fx.reverse.vol.mul("<0 0 0 0 0 0 0 1>"))
  .lpf(fx.reverse.cut).hpf(200)
  .attack(0.3).release(0.2)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ШПАРГАЛКА НА НОЧЬ
// ══════════════════════════════════════════════════════════════════
//  Имена — пути по дереву: группа.инструмент.параметр.
//
//  пустота:       atmos.dust 0.1 + space 0.06, verb 0.7
//  вход:          pads.void.vol 0.3, bass.abyss.vol 0.5, bass.grinder.vol 0.3
//  брейк:         breaks.apache.vol 0.35, crush 11 → 8 (грязнее)
//  джунгл:        mode 1; breaks.funk.vol 0.3, breaks.cut.vol 0.35,
//                 drums.snare.vol 0.5, drums.hat.vol 0.35
//  техстеп:       mode 2; breaks.dist.vol 0.35, bass.grinder.drive 1.8 → 2.4,
//                 bass.grinder.dist 0.35 → 0.7, duck 0.8
//  глитч:         mode 3; drums.click.vol 0.35, leads.pulse.vol 0.3,
//                 breaks.cut.crush 10 → 6
//  гармония:      harmony 1 — tape + drone вместо кластера
//  темнее:        pads.void.cut 1100 → 600, pads.void.grit 0.18 → 0.4,
//                 beats.cut (срез брейка) 4200 → 2500
//  бас:           abyss.cut 90 (не выше 150), grinder.cut 620 → 350,
//                 coil.cut 700 → 1200 (злее)
//  грайндер:      grind 0 LONG / 1 DRIFT / 2 STUTTER; attack 0.8, release 2
//                 (для LONG), chance 0.3, jitter 0.02, fmMod 0.8
//  грануляр:      grain 0/1/2 = 4/8/16 кусков; breaks.grain.vol 0.3,
//                 rev 0.15, jitter 0.01, drop 0.1, speed 1
//  ровнее:        breaks.apache.crush 16 (чисто), drum.crush 16
// ══════════════════════════════════════════════════════════════════
