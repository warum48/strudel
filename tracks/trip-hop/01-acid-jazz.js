// ══════════════════════════════════════════════════════════════════
//  TRIP-HOP 01 · ACID JAZZ BREAKS · Strudel · 84 BPM
//
//  Trip-hop, а не «мрачный даунтемпо для кафе»: глухой низ, винил,
//  ломаные барабаны, Rhodes, квартовые пэды и два голоса Moog. Джаз
//  здесь — в гармонии и контрапункте, а не в имитации саксофона:
//  духовых нет вообще.
//
//  ── ВОСЕМЬ РИТМОВ ────────────────────────────────────────────────
//  `mode` — это не «слои вкл/выкл», а восемь брейков. Каждая ручка
//  (kick/snare/hat/rim/Rhodes) выбирает свой рисунок по индексу mode,
//  поэтому ни один режим не выключает инструмент: меняется грув,
//  а состав остаётся. 0 boom / 1 break / 2 half / 3 roll /
//  4 shuffle / 5 stutter / 6 broken / 7 open.
//
//  ── ГАРМОНИЯ ─────────────────────────────────────────────────────
//  D дорийский с хроматической медиантой: d → eb → bb → f → g → eb →
//  c → d. Никаких ii–V–I и доминантовых разрешений: аккорды висят.
//  PAD_A — квартовые укладки без терций (McCoy Tyner), PAD_B — 9/11/13.
//  Защёлка на 8 тактов: фраза доигрывает целиком.
//
//  ── ДВА MOOG ─────────────────────────────────────────────────────
//  moog.bass — низкий пилообразный голос, 24 dB фильтр, срез по
//  правилу проекта ≤80 Гц, открывается огибающей, glide на подходе к
//  следующей доле. Контрапункт, а не «тоника–терция–квинта».
//  moog.lead — второй голос: square, унисон, LFO на срезе, дилей;
//  играет квартовое арпеджио 16-ми — тот слой, где «много нот».
//
//  ── СТАРТ ────────────────────────────────────────────────────────
//  Все инструменты в нуле, звучит только атмосфера. Поднимай по
//  шпаргалке внизу; это не баг, а правило серии.
//
//  // @roots d eb bb f g eb c d
// ══════════════════════════════════════════════════════════════════

const BPM = 84
setcpm(BPM / 4) // один цикл = один такт 4/4 (≈ 2.857 с)

// ══════════════════════════════════════════════════════════════════
//  ШИРИНА СЛАЙДЕРОВ + ЛЕЧЕНИЕ ИХ РАССИНХРОНА
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
//  СЭМПЛЫ
// ══════════════════════════════════════════════════════════════════
// Явная карта вместо `github:...`: raw.githubusercontent периодически
// отдаёт 503 и упирается в лимиты, из-за чего часть сэмплов молчит.
// jsDelivr — тот же репозиторий uzu-drumkit, но стабильный CDN.
// Грузятся только имена, которые реально играются (без 221 папки Dirt).
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
    cp: ['cp/10_cp_switchangel.wav', 'cp/11_cp_mot4i.wav'],
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
    cb: ['cb/10_perc_switchangel.wav'],
  }, 'https://cdn.jsdelivr.net/gh/tidalcycles/uzu-drumkit@main/')
}

// ══════════════════════════════════════════════════════════════════
//  GLIDE — слайд от предыдущей ноты (рецепт Switch Angel)
// ══════════════════════════════════════════════════════════════════
// Нужен только Moog-басу: в джазе подход к доле — короткий съезд.
// getFrequencyFromValue есть в браузере, но не экспортируется в node,
// поэтому фолбэк через noteToMidi — иначе verify не прогонит трек.
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

// ВОСЕМЬ БРЕЙКОВ. Меняется рисунок, не состав: каждый инструмент
// играет во всех восьми режимах.
// @switches mode=boom,break,half,roll,shuffle,stutter,broken,open harmony=quartal,ninth
const mode = slider(0, 0, 7, 1)

// ГАРМОНИЯ: кварты / 9-е и 13-я. Одна тональность, разная укладка.
// seg(1/8) — защёлка на 8 тактов.
const harmony = slider(0, 0, 1, 1)
const hQ = harmony.seg(1 / 8)
const hA = hQ.fmap((h) => (h < 0.5 ? 1 : 0))
const hB = hQ.fmap((h) => (h < 0.5 ? 0 : 1))

// ══════════════════════════════════════════════════════════════════
//  ОБЩЕЕ
// ══════════════════════════════════════════════════════════════════
const verb = slider(0.38, 0, 1, 0.01)  // сколько сигнала уходит в реверб
const duck = slider(0.5, 0, 1, 0.01)   // насколько бочка приседает низ

// ══════════════════════════════════════════════════════════════════
//  ИНСТРУМЕНТЫ
// ══════════════════════════════════════════════════════════════════
// Панель читает дерево как есть: группа → инструмент → параметр.
// vol первым (микшер), остальные — правый столбец.
const instruments = {
  // ── БАРАБАНЫ ───────────────────────────────────────────────────
  drums: {
    name: 'Drums',
    kick: {
      name: 'Kick',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(220, 80, 3000, 10),        // глухо: правило проекта
      shape: slider(0.5, 0, 0.95, 0.01),
      decay: slider(0.5, 0.15, 1.4, 0.01),
      tune: slider(0.88, 0.55, 1.3, 0.01),
    },
    snare: {
      name: 'Snare',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(3800, 800, 12000, 100),
      decay: slider(0.16, 0.03, 0.6, 0.01),
    },
    clap: {
      name: 'Clap',
      vol: slider(0, 0, 0.8, 0.01),
      cut: slider(4800, 800, 12000, 100),
      decay: slider(0.12, 0.03, 0.4, 0.01),
    },
    hat: {
      name: 'Hats',
      vol: slider(0, 0, 0.9, 0.01),
      cut: slider(7600, 800, 16000, 100),
      decay: slider(0.045, 0.01, 0.2, 0.005),
    },
    ohat: {
      name: 'Open hats',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(6000, 800, 16000, 100),
      decay: slider(0.13, 0.03, 0.5, 0.01),
    },
    rim: {
      name: 'Rim',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(3200, 400, 12000, 100),
      decay: slider(0.05, 0.01, 0.2, 0.005),
      echo: slider(0.2, 0, 0.8, 0.01),
    },
    shaker: {
      name: 'Shaker',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(6800, 800, 16000, 100),
      decay: slider(0.03, 0.01, 0.15, 0.005),
    },
  },

  // ── НИЗ ────────────────────────────────────────────────────────
  low: {
    name: 'Low',
    sub: {
      name: 'Sub',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(80, 40, 80, 5),            // максимум 80 Гц — правило
      decay: slider(0.45, 0.1, 1.5, 0.01),
    },
  },

  // ── MOOG · ДВА ГОЛОСА ─────────────────────────────────────────
  moog: {
    name: 'Moog',
    bass: {
      name: 'Moog bass',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(80, 40, 80, 5),            // срез ≤80, открывает огибающая
      res: slider(9, 0, 20, 0.5),
      env: slider(2.4, 0, 8, 0.1),
      decay: slider(0.25, 0.05, 1, 0.01),
      glide: slider(0.055, 0, 0.2, 0.001),
      det: slider(0.04, 0, 0.2, 0.005),
      shape: slider(0.3, 0, 0.9, 0.01),
    },
    lead: {
      name: 'Moog lead',
      vol: slider(0, 0, 0.9, 0.01),
      cut: slider(1400, 200, 6000, 10),
      res: slider(6, 0, 20, 0.5),
      lfo: slider(2.2, 0, 8, 0.1),
      env: slider(1.4, 0, 8, 0.1),
      decay: slider(0.16, 0.03, 0.8, 0.01),
      glide: slider(0.03, 0, 0.15, 0.001),
      det: slider(0.06, 0, 0.25, 0.005),
    },
  },

  // ── КЛАВИШИ ────────────────────────────────────────────────────
  keys: {
    name: 'Keys',
    rhodes: {
      name: 'Rhodes',
      vol: slider(0, 0, 0.9, 0.01),
      cut: slider(2600, 200, 10000, 20),
      fm: slider(0.9, 0, 4, 0.05),
      decay: slider(0.32, 0.05, 1.2, 0.01),
      echo: slider(0.15, 0, 0.8, 0.01),
    },
    pad: {
      name: 'Pad',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(1200, 80, 6000, 10),
      q: slider(1.2, 0, 20, 0.5),
      lfo: slider(1.2, 0, 8, 0.1),
      det: slider(0.08, 0, 0.5, 0.01),
    },
    vibes: {
      name: 'Vibes',
      vol: slider(0, 0, 0.8, 0.01),
      cut: slider(3600, 400, 12000, 20),
      decay: slider(0.5, 0.05, 1.6, 0.01),
      echo: slider(0.3, 0, 0.9, 0.01),
    },
  },

  // ── АТМОСФЕРА ──────────────────────────────────────────────────
  atmos: {
    name: 'Atmos',
    air: {
      name: 'Air',
      vol: slider(0.1, 0, 0.5, 0.01),
      cut: slider(600, 100, 8000, 20),
      lfo: slider(2.2, 0, 10, 0.5),
    },
    drone: {
      name: 'Drone',
      vol: slider(0.08, 0, 0.6, 0.01),
      cut: slider(260, 60, 2000, 10),
      det: slider(0.09, 0, 0.5, 0.01),
    },
    vinyl: {
      name: 'Vinyl',
      vol: slider(0.04, 0, 0.3, 0.01),
      cut: slider(2400, 300, 12000, 100),
    },
  },

  // ── ЭФФЕКТЫ ────────────────────────────────────────────────────
  fx: {
    name: 'FX',
    dub: {
      name: 'Dub delay',
      delaySend: slider(0.2, 0, 0.8, 0.01),
      delayTime: slider(0.375, 0.0625, 0.75, 0.0625),
      delayFeedback: slider(0.45, 0, 0.85, 0.01),
    },
    reverb: {
      name: 'Reverb',
      size: slider(9, 1, 20, 0.5),
    },
  },
}

const { drums, low, moog, keys, atmos, fx } = instruments

// Ноль на ручке — событие всё равно проходит весь путь. Поэтому каждая
// дорожка кончается `.filter(audible)`: молчащий hap не доходит до триггера.
const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}

// ══════════════════════════════════════════════════════════════════
//  ФРАЗЫ
// ══════════════════════════════════════════════════════════════════
const phrase = (bars) => m('<' + bars.join(' ') + '>')

// Корни на 8 тактов: d eb bb f g eb c d — круг, а не каденция.
// Строка ниже — машинный маркер для tools/tension.mjs.
// @roots d eb bb f g eb c d

// ПЭД A — кварты без терций. Ни мажора, ни минора: воздух.
const PAD_A = phrase([
  '[d3,g3,c4,f4]',
  '[g3,c4,f4,bb4]',
  '[d4,g4,c5,f5]',
  '[a3,d4,g4,c5]',
  '[c4,f4,bb4,eb5]',
  '[g3,c4,f4,bb4]',
  '[g3,c4,f4,bb4]',
  '[d3,g3,c4,f4]',
])

// ПЭД B — 9-е, 11-е, 13-я. Тёплые укладки, терции есть, тритонов нет.
const PAD_B = phrase([
  '[f3,c4,a4,e5]',
  '[g3,bb3,d4,f4]',
  '[d4,f4,a4,c5]',
  '[a3,c4,e4,g4]',
  '[bb3,d4,f4,a4]',
  '[g3,bb3,d4,f4]',
  '[eb4,g4,bb4,d6]',
  '[f3,c4,a4,e5]',
])

// RHODES — аккорд такта. Ритм задаётся отдельно (`compPat`), поэтому
// один и тот же аккорд может быть компингом в любом из восьми рисунков.
const KEYS = phrase([
  '[f4,a4,c5,e5]',
  '[g4,bb4,d5,f5]',
  '[d4,f4,a4,c5]',
  '[a4,c5,e5,g5]',
  '[c5,f5,bb5,d6]',
  '[g4,bb4,d5,f5]',
  '[eb4,g4,bb4,d5]',
  '[f4,a4,c5,e5]',
])

// MOOG ARP — квартовые арпеджио 16-ми. Тот самый слой «много нот»:
// ноты берутся из аккорда такта, поэтому дрейфа мимо гармонии нет.
const ARP = phrase([
  '[f4 a4 c5 e5 a4 c5 e5 g4 c5 e5 g4 a4 e5 g4 a4 c5]',
  '[g4 bb4 d5 f5 bb4 d5 f5 c5 d5 f5 c5 bb4 f5 c5 bb4 g4]',
  '[d4 f4 a4 c5 f4 a4 c5 d5 a4 c5 d5 f5 c5 d5 f5 a4]',
  '[a4 c5 e5 g5 c5 e5 g5 a5 e5 g5 a5 c6 g5 a5 c6 e5]',
  '[f5 g5 bb5 d6 g5 bb5 d6 f6 bb5 d6 f6 g6 d6 f6 g6 bb5]',
  '[g4 bb4 d5 f5 bb4 d5 f5 c5 d5 f5 c5 bb4 f5 c5 bb4 g4]',
  '[eb4 g4 bb4 d5 g4 bb4 d5 eb5 bb4 d5 eb5 g5 d5 eb5 g5 bb4]',
  '[f4 a4 c5 e5 a4 c5 e5 g4 c5 e5 g4 a4 e5 g4 a4 c5]',
])

// VIBES — редкая линия: в джазе важна пауза вокруг ноты. Без духовых.
const VIBES = phrase([
  '[~ ~ ~ a4 ~ ~ ~ c5 ~ ~ e5 ~ ~ ~ ~ ~]',
  '[~ ~ g4 ~ ~ ~ bb4 ~ ~ ~ d5 ~ ~ ~ ~ ~]',
  '[~ ~ ~ d5 ~ ~ f5 ~ ~ ~ a4 ~ ~ ~ ~ ~]',
  '[~ ~ c5 ~ ~ e5 ~ ~ ~ g4 ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ f5 ~ ~ bb5 ~ ~ ~ g5 ~ ~ ~ ~ ~]',
  '[~ ~ g4 ~ ~ bb4 ~ ~ ~ d5 ~ ~ ~ ~ ~ ~]',
  '[~ ~ eb5 ~ ~ ~ bb4 ~ ~ g4 ~ ~ ~ ~ ~ ~]',
  '[~ ~ a4 ~ ~ ~ e5 ~ ~ ~ c5 ~ ~ ~ ~ ~]',
])

// MOOG BASS — контрапункт: подходы, педаль, скачки, а не проход по
// тонике. Регистр d1…g2; срез открывает огибающая, а не ручка.
const BASS = phrase([
  '[d1 ~ d1 f1 ~ g1 ~ a1 ~ f1 ~ d1 ~ c2 ~ d1 ~]',
  '[eb1 ~ eb1 g1 ~ bb1 ~ f1 ~ eb1 ~ d1 ~ c2 ~ eb1 ~]',
  '[bb1 ~ bb1 d2 ~ f2 ~ d2 ~ c2 ~ bb1 ~ g1 ~ f1 ~]',
  '[f1 ~ f1 a1 ~ c2 ~ g1 ~ a1 ~ c2 ~ d2 ~ f1 ~]',
  '[g1 ~ g1 bb1 ~ d2 ~ c2 ~ bb1 ~ g1 ~ f1 ~ g1 ~]',
  '[eb1 ~ g1 ~ bb1 ~ f1 ~ eb1 ~ d1 ~ c2 ~ eb1 ~]',
  '[c2 ~ c2 eb2 ~ g2 ~ f2 ~ eb1 ~ d1 ~ c2 ~ g1 ~]',
  '[d1 ~ f1 ~ g1 ~ a1 ~ d2 ~ c2 ~ a1 ~ g1 ~ d1 ~]',
])

// SUB — только корень, чтобы низ не спорил с Moog-басом.
const SUB_ROOTS = phrase([
  '[d1]', '[eb1]', '[bb1]', '[f1]',
  '[g1]', '[eb1]', '[c2]', '[d1]',
])

// ══════════════════════════════════════════════════════════════════
//  РИТМЫ · восемь брейков
// ══════════════════════════════════════════════════════════════════
// Все восемь — один и тот же набор слоёв. Меняется рисунок. Это не
// «режимы, где что-то выключено», а разные барабанщики на одном сетапе.

const kickPat = mode.pick([
  m('x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ ~'),
  m('x ~ ~ x ~ ~ x ~ ~ ~ x ~ ~ x ~ ~'),
  m('x ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~'),
  m('x ~ x ~ x ~ x ~ ~ x ~ x x ~ x ~'),
  m('x ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~ ~'),
  m('x ~ ~ ~ x x ~ ~ ~ ~ x ~ ~ ~ ~ x'),
  m('x ~ ~ ~ ~ x ~ x ~ ~ ~ ~ x ~ ~ ~'),
  m('x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~'),
])

const snarePat = mode.pick([
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~ x ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~'),
  m('~ ~ x ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~'),
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ x'),
  m('~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ x ~'),
  m('~ x ~ ~ ~ ~ x ~ ~ ~ ~ x ~ ~ ~ ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~'),
])

const hatPat = mode.pick([
  m('x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~'),
  m('x x ~ x x ~ x x x ~ x x x ~ x ~'),
  m('x ~ ~ x ~ ~ x ~ x ~ ~ x ~ ~ x ~'),
  m('x x x x x x x x x x x x x x x x'),
  m('~ x ~ x ~ x ~ x ~ x ~ x ~ x ~ x'),
  m('x x x ~ x x ~ x x x ~ x x ~ x x'),
  m('x ~ x x ~ x ~ x x ~ x ~ x x ~ ~'),
  m('~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~'),
])

const rimPat = mode.pick([
  m('~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~ ~'),
  m('~ x ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~'),
  m('~ x ~ x ~ x ~ ~ ~ x ~ x ~ ~ x ~'),
  m('~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~'),
  m('x ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
  m('~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ x'),
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
])

const compPat = mode.pick([
  m('~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~'),
  m('x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~'),
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
  m('x ~ ~ x ~ ~ x ~ x ~ ~ x ~ ~ x ~'),
  m('~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~'),
  m('~ ~ x ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x'),
  m('x ~ x ~ ~ x ~ x ~ ~ x ~ x ~ x ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~'),
])

// ══════════════════════════════════════════════════════════════════
//  АТМОСФЕРА — звучит с первого нажатия
// ══════════════════════════════════════════════════════════════════

// ВОЗДУХ — ровный шум, срез дышит раз в 16 тактов
$: s('pink')
  .gain(atmos.air.vol)
  .lpf(atmos.air.cut).lpq(0.8).ftype('24db')
  .lpdepth(atmos.air.lfo).lpsync(0.0625).lpdc(0)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ДРОН — корень с квинтой, две расстроенные пилы. Не вступает, а проявляется.
$: note(phrase([
     '[d2,a2]', '[eb2,g2]', '[bb1,f2]', '[f2,c3]',
     '[g2,d3]', '[eb2,g2]', '[c2,g2]', '[d2,a2]',
   ]))
  .s('sawtooth').unison(2).detune(atmos.drone.det)
  .gain(atmos.drone.vol)
  .lpf(atmos.drone.cut).lpq(3).ftype('24db')
  .attack(1.8).decay(1).sustain(0.9).release(2.6)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ВИНИЛ — 12 тактов на цикл, поэтому ни с чем не совпадает
$: s('crackle')
  .gain(atmos.vinyl.vol.mul(m('<1 1 .7 1 1 1 1 .8 1 1 1 1>')))
  .lpf(atmos.vinyl.cut).hpf(300)
  .room(0.2)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  УДАРНЫЕ — один сет, восемь брейков
// ══════════════════════════════════════════════════════════════════

// БОЧКА — глухая, с дакингом низа. Рисунок выбирается из eight.
$: s('bd')
  .struct(kickPat)
  .gain(drums.kick.vol)
  .lpf(drums.kick.cut).lpq(1)
  .speed(drums.kick.tune)
  .shape(drums.kick.shape)
  .decay(drums.kick.decay).sustain(0).release(0.08)
  .duckorbit(2).duckdepth(duck).duckattack(0.02)
  .filter(audible)

// СНЕЙР — восьмая брейков; в half он на 3, в broken уезжает с сетки
$: s('sd')
  .struct(snarePat)
  .gain(drums.snare.vol)
  .lpf(drums.snare.cut).hpf(180)
  .decay(drums.snare.decay).sustain(0).release(0.08)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .filter(audible)

// КЛЭП — тонкий слой на «и» четвёртой, не вместо снейра
$: s('cp')
  .struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~'))
  .gain(drums.clap.vol.mul(0.7))
  .lpf(drums.clap.cut).lpq(3)
  .decay(drums.clap.decay).sustain(0)
  .pan(rand.mul(1.1).sub(0.55))
  .room(0.28).roomsize(fx.reverb.size)
  .filter(audible)

// ХЭТЫ — свинг живёт здесь: вторая восьмая приезжает позже
$: s('hh')
  .struct(hatPat)
  .gain(drums.hat.vol.mul(m('[1 .5 .7 .5]*4')))
  .lpf(drums.hat.cut).hpf(320)
  .decay(drums.hat.decay).sustain(0)
  .swingBy(0.14, 8)
  .nudge(rand.mul(0.01).sub(0.005))
  .degradeBy(0.04)
  .filter(audible)

// ОТКРЫТЫЕ ХЭТЫ — на «и», раскачивают грув; рисунок общий для всех брейков
$: s('oh')
  .struct(m('~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x'))
  .gain(drums.ohat.vol.mul(0.8))
  .lpf(drums.ohat.cut)
  .decay(drums.ohat.decay).sustain(0)
  .room(verb.mul(0.8)).roomsize(fx.reverb.size)
  .filter(audible)

// RIM — восьмая брейков: у каждого рисунка свой, но всегда есть
$: s('rim')
  .struct(rimPat)
  .gain(drums.rim.vol.mul(0.9))
  .lpf(drums.rim.cut).hpf(500).lpq(2)
  .decay(drums.rim.decay).sustain(0)
  .pan(rand.mul(1.4).sub(0.7))
  .delay(drums.rim.echo).delaytime(fx.dub.delayTime).delayfeedback(0.25)
  .filter(audible)

// ШЕЙКЕР — 16-е, тихо, с потерями: это движение, а не удар
$: s('sh')
  .struct(m('x*16'))
  .gain(drums.shaker.vol.mul(0.6))
  .lpf(drums.shaker.cut).hpf(2200)
  .decay(drums.shaker.decay).sustain(0)
  .degradeBy(0.4)
  .pan(rand.mul(0.8).add(0.1))
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  НИЗ — Moog-бас и саб
// ══════════════════════════════════════════════════════════════════

// MOOG BASS (голос 1) — пила, 24 dB, срез 80 + огибающая, glide на подходе.
// Гейт слайда — только на 3-й и 8-й шестнадцатой такта, не портаменто везде.
$: note(BASS)
  .s('sawtooth')
  .unison(2).detune(moog.bass.det)
  .glide(moog.bass.glide.mul(m('0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0')))
  .gain(moog.bass.vol)
  .lpf(moog.bass.cut).lpq(moog.bass.res).ftype('24db')
  .lpenv(moog.bass.env)
  .lpa(0.004).lpd(moog.bass.decay).lpsustain(0.15)
  .shape(moog.bass.shape)
  .attack(0.004).decay(0.18).sustain(0.6).release(0.1)
  .orbit(2)
  .filter(audible)

// САБ — вес на «и», чтобы не спорить с телом бочки
$: note(SUB_ROOTS)
  .s('sine')
  .struct(m('~ x ~ ~ ~ x ~ ~'))
  .gain(low.sub.vol)
  .lpf(low.sub.cut).lpq(1)
  .decay(low.sub.decay).sustain(0).release(0.2)
  .orbit(2)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  MOOG LEAD (голос 2) — арпеджио 16-ми, LFO на срезе, дилей
// ══════════════════════════════════════════════════════════════════

$: note(ARP)
  .s('square').unison(3).detune(moog.lead.det)
  .glide(moog.lead.glide)
  .gain(moog.lead.vol)
  .lpf(moog.lead.cut).lpq(moog.lead.res).ftype('24db')
  .lpenv(moog.lead.env)
  .lpa(0.004).lpd(moog.lead.decay).lpsustain(0.2)
  .lpdepth(moog.lead.lfo).lpsync(0.125).lpdc(0)
  .decay(0.09).sustain(0.25).release(0.1)
  .delay(fx.dub.delaySend).delaytime(fx.dub.delayTime)
  .delayfeedback(fx.dub.delayFeedback.mul(0.8))
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.35, 0.65))
  .orbit(3)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  КЛАВИШИ
// ══════════════════════════════════════════════════════════════════

// RHODES — аккорд такта, ритм из восьми рисунков. FM на синусе:
// тёплое электрическое пиано, а не колокол.
$: note(KEYS)
  .struct(compPat)
  .s('sine').fm(keys.rhodes.fm).fmh(1.01)
  .gain(keys.rhodes.vol)
  .lpf(keys.rhodes.cut).lpq(2)
  .decay(keys.rhodes.decay).sustain(0).release(0.35)
  .delay(keys.rhodes.echo).delaytime(fx.dub.delayTime).delayfeedback(0.3)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.4, 0.6))
  .filter(audible)

// ПЭД A — кварты без терций, аддитивный тембр: только нечётные гармоники
$: note(PAD_A)
  .s('sawtooth').partials([1, 0, 0.5, 0, 0.3, 0, 0.16, 0, 0.08])
  .unison(3).detune(keys.pad.det)
  .gain(keys.pad.vol.mul(hA))
  .lpf(keys.pad.cut).lpq(keys.pad.q).ftype('24db')
  .lpdepth(keys.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.3)
  .attack(1.2).decay(1.4).sustain(0.85).release(2.4)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ПЭД B — 9-е и 13-я, другой тембр: синус с partials
$: note(PAD_B)
  .s('sine').partials([1, 0.55, 0.3, 0.16, 0.1, 0.06])
  .unison(2).detune(keys.pad.det.mul(0.8))
  .gain(keys.pad.vol.mul(hB))
  .lpf(keys.pad.cut.mul(1.2)).lpq(keys.pad.q.mul(0.8)).ftype('24db')
  .lpdepth(keys.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.22)
  .attack(1.0).decay(1.2).sustain(0.85).release(2.2)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// VIBES — редкая линия с длинным дилеем. Не саксофон и не «красивая
// мелодия»: точки в гармонии, между ними воздух.
$: note(VIBES)
  .s('sine').fm(0.8).fmh(3.01)
  .gain(keys.vibes.vol)
  .lpf(keys.vibes.cut).lpq(2)
  .attack(0.002).decay(keys.vibes.decay).sustain(0).release(0.5)
  .delay(keys.vibes.echo).delaytime(0.4375).delayfeedback(0.4)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.3, 0.7))
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  СЦЕНЫ
// ══════════════════════════════════════════════════════════════════
// @scenes {"intro":{"mode":2,"harmony":0,"verb":0.45},"theme":{"mode":1,"harmony":1,"verb":0.38}}

// ══════════════════════════════════════════════════════════════════
//  ШПАРГАЛКА
// ══════════════════════════════════════════════════════════════════
//  пустота:      atmos.air.vol 0.1 + atmos.drone.vol 0.08 + atmos.vinyl.vol 0.04
//  вход:         drums.kick.vol 0.32 → low.sub.vol 0.3
//  брейк:        drums.snare.vol 0.3, drums.hat.vol 0.28, drums.rim.vol 0.18
//  низ:          moog.bass.vol 0.55, cut уже 80 → поднимай env до 3–4
//  гармония:     keys.rhodes.vol 0.3, keys.pad.vol 0.22
//  лид:          moog.lead.vol 0.22, cut 1400 → 2600 (ярче), res 6 → 10
//  вибрафон:     keys.vibes.vol 0.2
//  режимы:       mode 0 boom / 1 break / 2 half / 3 roll /
//                4 shuffle / 5 stutter / 6 broken / 7 open
//  гармония:     harmony 0 кварты / 1 9-е и 13-я (защёлка на 8 тактов)
//  злее:         drums.kick.shape 0.5 → 0.8, drums.kick.cut 220 → 320
//  глубже:       verb 0.38 → 0.5, moog.bass.env 2.4 → 4
// ══════════════════════════════════════════════════════════════════
