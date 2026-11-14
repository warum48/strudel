// ══════════════════════════════════════════════════════════════════
//  HOUSE RAVE 15  ·  Strudel  ·  120 BPM  ·  jazz house / rave
//
//  Шестой характер серии: хаус, который умеет уходить в рейв. 120 BPM,
//  четыре в пол, джазовая гармония на всём — но с рифами, которые
//  хочется включить громче. Это не «эйсид-джаз 14» и не трэп 12:
//  здесь драйв важнее атмосферы.
//
//  ── ЧТО ВЗЯТО ИЗ 12/14 ──────────────────────────────────────────
//  Форма: дерево `instruments`, четыре режима ударов, защёлка гармонии
//  на 8 тактов, `.filter(audible)`, глобальные `verb` / `duck`, старт в
//  тишине (звучит только воздух и винил). Именование — как в 12.
//  Из 06/14 — `glide` для баса и эйсида и привычка ставить вольюм
//  первым, а срез сразу под ним.
//
//  ── ГАРМОНИЯ: F МАЖОР, ВОСЕМЬ ТАКТОВ ────────────────────────────
//  Корни: f a d g c f a c. Это I–vi–ii–v в F:
//    Fmaj9 → Am7 → Dm9 → Gm9 → C6/9 → Fmaj9 → Am7 → C6/9.
//  C6/9, а не C13: в C13 живут e и bb, а это тритон. Джазовый вкус
//  остаётся (6/9 — самый «светлый» джазовый аккорд), но линиям есть
//  где играть: в F мажоре нет ни одной пары нот на тритон. Поэтому
//  все рифы могут ходить по ладу и не спорить с пэдом.
//  Строка ниже — машинный маркер для tools/tension.mjs.
//  @roots f a d g c f a c
//
//  ── ТРИ ПЕРЕКЛЮЧАТЕЛЯ ───────────────────────────────────────────
//  mode:    0 HOUSE / 1 JACK / 2 BREAK / 3 ROLL — рисунок ударов.
//  harmony: 0 JAZZ (тёплый пэд) / 1 RAVE (суперпила).
//  rave:    0 OFF / 1 ON — добавляет хур (hoover) и рейв-стабы.
//  mode и harmony — защёлки на 8 тактов; rave — мгновенный слой,
//  его можно щёлкать когда угодно (это эффект, а не форма).
//
//  ── РИФЫ ────────────────────────────────────────────────────────
//  1. CLAV — синкопированный фанк-риф на квадрате: 16-е с паузами,
//     короткий спад. Это главный «крючок» трека.
//  2. ACID — 303-риф с ladder-фильтром и glide. Играет редко и зло,
//     но нотами аккорда: эйсид здесь — краска, а не хаос.
//  3. HOOVER — рейв-лид: суперпила, вокальный фильтр, питч-сброс.
//     Включается только ручкой rave.
//  4. ARP — 16-е с паузами по тонам аккорда: дом-спаркл, не трель.
//
//  ── ПОЧЕМУ ЭТО ХАУС ─────────────────────────────────────────────
//  Бочка четыре в пол, клэп на 2 и 4, открытые хэты на «и», шаффл
//  закрытых хэтов, конга и шейкер. В JACK бочка идёт восьмыми — это
//  уже не мягкий хаус, а «jackin». В BREAK четыре в пол исчезает,
//  в ROLL возвращается с 16-ми хэтами и снейр-роллом.
// ══════════════════════════════════════════════════════════════════

const BPM = 120
setcpm(BPM / 4) // один цикл = один такт 4/4 (2 с)

// ══════════════════════════════════════════════════════════════════
//  ШИРИНА СЛАЙДЕРОВ + ЛЕЧЕНИЕ ИХ РАССИНХРОНА
// ══════════════════════════════════════════════════════════════════
// Штатные 64px — мышкой в шаг 0.01 не попасть. Строки ТОЛЬКО в
// одинарных кавычках: транспайлер оборачивает в m() всё, что в
// двойных и в бэктиках.
const SLIDER_PX = 180
if (typeof document !== 'undefined' && !document.getElementById('slider-w')) {
  const st = document.createElement('style')
  st.id = 'slider-w'
  st.textContent = '.cm-slider input { width: ' + SLIDER_PX + 'px !important; }'
  document.head.appendChild(st)
}

// СИНХРОНИЗАЦИЯ ПОЛЗУНКОВ — заплатка на баг strudel.cc (docs/slider-bug.md).
// Держим el.originalValue равным тексту в документе, иначе драг считает
// длину заменяемого числа от устаревшего значения и портит код.
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
//  GLIDE — слайд от предыдущей ноты (рецепт Switch Angel)
// ══════════════════════════════════════════════════════════════════
// Нужен басу и эйсиду: короткий съезд в следующую ноту, а не
// портаменто на каждой. getFrequencyFromValue есть в редакторе
// strudel.cc, но не экспортируется из @strudel/core в node —
// поэтому фолбэк через noteToMidi.
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

// @switches mode=house,jack,break,roll harmony=jazz,rave rave=off,on
// УДАРНЫЕ: 0 HOUSE / 1 JACK / 2 BREAK / 3 ROLL.
const mode = slider(0, 0, 3, 1)
const m0 = mode.fmap((m) => (m === 0 ? 1 : 0))
const m1 = mode.fmap((m) => (m === 1 ? 1 : 0))
const m2 = mode.fmap((m) => (m === 2 ? 1 : 0))
const m3 = mode.fmap((m) => (m === 3 ? 1 : 0))

// ГАРМОНИЯ: 0 JAZZ (тёплый пэд) / 1 RAVE (суперпила).
// seg(1/8) = защёлка на 8 тактов: начатая фраза доигрывает целиком.
const harmony = slider(0, 0, 1, 1)
const hQ = harmony.seg(1 / 8)
const hA = hQ.fmap((h) => (h < 0.5 ? 1 : 0))
const hB = hQ.fmap((h) => (h < 0.5 ? 0 : 1))

// РЕЙВ-СЛОЙ: 0 выкл / 1 вкл. Мгновенный, без защёлки: это эффект.
const rave = slider(0, 0, 1, 1)

// ══════════════════════════════════════════════════════════════════
//  ОБЩЕЕ
// ══════════════════════════════════════════════════════════════════
const verb = slider(0.35, 0, 1, 0.01)  // сколько сигнала уходит в реверб
const duck = slider(0.6, 0, 1, 0.01)   // насколько бочка приседает низ

// ══════════════════════════════════════════════════════════════════
//  ИНСТРУМЕНТЫ
// ══════════════════════════════════════════════════════════════════
// Панель читает эту структуру как есть: группа → инструмент →
// параметр. vol — левый столбец, всё остальное — правый. Порядок
// ключей = порядок в панели. vol первым, cut сразу за ним.
const instruments = {
  // ── БАРАБАНЫ ───────────────────────────────────────────────────
  drums: {
    name: 'Drums',
    kick: {
      name: 'Kick',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(650, 90, 4000, 10),
      shape: slider(0.6, 0, 0.95, 0.01),
      dist: slider(1.4, 0, 4, 0.1),
      decay: slider(0.42, 0.15, 2, 0.01),
      tune: slider(0.9, 0.55, 1.4, 0.01),
      bodyLevel: slider(0.3, 0, 1, 0.01),
      bodyDecay: slider(0.7, 0.3, 3, 0.01),
      bodyDrop: slider(4, 0, 12, 0.5),
    },
    clap: {
      name: 'Clap',
      vol: slider(0, 0, 0.9, 0.01),
      cut: slider(5400, 800, 14000, 100),
      hpf: slider(700, 200, 4000, 50),
      crush: slider(14, 1, 16, 0.5),
    },
    snare: {
      name: 'Snare',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(5200, 800, 14000, 100),
      decay: slider(0.16, 0.03, 0.7, 0.01),
    },
    hat: {
      name: 'Hats',
      vol: slider(0, 0, 0.9, 0.01),
      cut: slider(8200, 800, 16000, 100),
    },
    ohat: {
      name: 'Open hats',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(5600, 800, 16000, 100),
    },
    shaker: {
      name: 'Shaker',
      vol: slider(0, 0, 0.6, 0.01),
      cut: slider(7000, 800, 16000, 100),
    },
    conga: {
      name: 'Conga',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(2600, 300, 12000, 100),
      tune: slider(0.9, 0.6, 1.3, 0.01),
    },
    tamb: {
      name: 'Tamb',
      vol: slider(0, 0, 0.6, 0.01),
      cut: slider(7000, 800, 16000, 100),
    },
    crash: {
      name: 'Crash',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(6000, 1000, 16000, 100),
    },
  },

  // ── БАС ────────────────────────────────────────────────────────
  bass: {
    name: 'Bass',
    house: {
      name: 'House bass',
      vol: slider(0, 0, 1.1, 0.01),
      cut: slider(520, 80, 4000, 10),
      res: slider(7, 0, 24, 0.5),
      env: slider(2.6, 0, 9, 0.1),
      decay: slider(0.18, 0.03, 1, 0.01),
      drive: slider(1.2, 0.2, 2.6, 0.01),
      glide: slider(0.05, 0, 0.2, 0.001),
    },
    sub: {
      name: 'Sub',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(220, 50, 1000, 10),
      decay: slider(0.5, 0.1, 2, 0.01),
    },
  },

  // ── ПЭДЫ ───────────────────────────────────────────────────────
  pads: {
    name: 'Pads',
    // 0 JAZZ — тёплый аддитивный пэд; 1 RAVE — суперпила.
    pad: {
      name: 'Pad',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(1500, 80, 7000, 10),
      q: slider(1.2, 0, 20, 0.5),
      lfo: slider(1.6, 0, 8, 0.1),
      det: slider(0.1, 0, 0.6, 0.01),
    },
    // Hammond-подобный слой: корень с квинтой, играет всегда
    organ: {
      name: 'Organ',
      vol: slider(0, 0, 0.8, 0.01),
      cut: slider(1200, 100, 6000, 10),
    },
    // дом-пиано: короткие аккорды на «и» каждой доли
    keys: {
      name: 'Keys',
      vol: slider(0, 0, 0.9, 0.01),
      cut: slider(3000, 200, 12000, 20),
      fm: slider(0.9, 0, 4, 0.05),
      decay: slider(0.22, 0.03, 1, 0.01),
    },
  },

  // ── МЕЛОДИЯ И РИФЫ ─────────────────────────────────────────────
  melody: {
    name: 'Riffs',
    arp: {
      name: 'Arp',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(5200, 400, 14000, 50),
      decay: slider(0.07, 0.02, 0.4, 0.01),
      echo: slider(0.3, 0, 0.9, 0.01),
    },
    clav: {
      name: 'Clav',
      vol: slider(0, 0, 0.9, 0.01),
      cut: slider(2600, 200, 10000, 20),
      res: slider(6, 0, 20, 0.5),
      decay: slider(0.1, 0.02, 0.5, 0.01),
      echo: slider(0.22, 0, 0.9, 0.01),
    },
    acid: {
      name: 'Acid',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(360, 80, 4000, 10),
      res: slider(15, 0, 30, 0.5),
      env: slider(3.2, 0, 9, 0.1),
      decay: slider(0.18, 0.03, 0.8, 0.01),
      drive: slider(1.2, 0.2, 2.6, 0.01),
      glide: slider(0.05, 0, 0.15, 0.001),
    },
    hoover: {
      name: 'Hoover',
      vol: slider(0, 0, 0.8, 0.01),
      cut: slider(3400, 200, 12000, 20),
      det: slider(0.2, 0.02, 0.6, 0.01),
      drop: slider(7, 0, 12, 0.5),
    },
    rave: {
      name: 'Rave stabs',
      vol: slider(0, 0, 0.8, 0.01),
      cut: slider(4200, 200, 14000, 20),
      decay: slider(0.14, 0.03, 0.8, 0.01),
    },
  },

  // ── ЭФФЕКТЫ ────────────────────────────────────────────────────
  fx: {
    name: 'FX',
    riser: {
      name: 'Riser',
      vol: slider(0, 0, 0.6, 0.01),
      cut: slider(4200, 200, 16000, 100),
    },
    reverb: {
      name: 'Reverb',
      size: slider(6, 1, 20, 0.5),
    },
  },

  // ── АТМОСФЕРА ──────────────────────────────────────────────────
  atmos: {
    name: 'Atmos',
    air: {
      name: 'Air',
      vol: slider(0.1, 0, 0.5, 0.01),
      cut: slider(600, 100, 8000, 20),
      lfo: slider(2.5, 0, 10, 0.5),
    },
    drone: {
      name: 'Drone',
      vol: slider(0, 0, 0.6, 0.01),
      cut: slider(280, 60, 2000, 10),
      det: slider(0.1, 0, 0.5, 0.01),
    },
    vinyl: {
      name: 'Vinyl',
      vol: slider(0.03, 0, 0.3, 0.01),
      cut: slider(2400, 300, 12000, 100),
    },
  },
}

// Короткие имена групп для цепочек
const { drums, bass, pads, melody, fx, atmos } = instruments


// 🛑 НОЛЬ НА РУЧКЕ — ЭТО НЕ БЕСПЛАТНО: событие с gain 0 всё равно строит
// узлы и worklet'ы. Поэтому каждая дорожка кончается `.filter(audible)`:
// hap с нулевой громкостью не доходит до триггера вообще. Гейт стоит
// ПОСЛЕ `._pianoroll()` намеренно: ролл рисует паттерн ДО фильтра.
const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}


// ══════════════════════════════════════════════════════════════════
//  ФРАЗЫ
// ══════════════════════════════════════════════════════════════════
const phrase = (bars) => m('<' + bars.join(' ') + '>')

// Корни на 8 тактов: f a d g c f a c — I–vi–ii–v в F.
// Строка ниже — машинный маркер для tools/tension.mjs.
// @roots f a d g c f a c

// ROOT — одна нота на такт для саба и тела бочки.
const ROOT = phrase([
  '[f1]', '[a1]', '[d2]', '[g1]',
  '[c2]', '[f1]', '[a1]', '[c2]',
])

// ДРОН — корень с квинтой в самом низу; по умолчанию выключен.
const DRONE = phrase([
  '[f1,c2]', '[a1,e2]', '[d2,a2]', '[g1,d2]',
  '[c2,g2]', '[f1,c2]', '[a1,e2]', '[c2,g2]',
])

// ОРГАН — корень с квинтой в середине, играет всегда.
const ORGAN = phrase([
  '[f2,c3]', '[a2,e3]', '[d3,a3]', '[g2,d3]',
  '[c3,g3]', '[f2,c3]', '[a2,e3]', '[c3,g3]',
])

// БАС — хаус-линия по восьмым. Не только корень: квинта, терция и
// подход к следующей доле. Регистр f1…e2 — 43–82 Гц.
const BASS = phrase([
  '[f1 ~ ~ f1 ~ c2 ~ f1]',
  '[a1 ~ ~ a1 ~ c2 ~ e2]',
  '[d2 ~ ~ d2 ~ f2 ~ a1]',
  '[g1 ~ ~ g1 ~ bb1 ~ d2]',
  '[c2 ~ ~ c2 ~ g1 ~ e2]',
  '[f1 ~ ~ f1 ~ c2 ~ a1]',
  '[a1 ~ ~ a1 ~ e2 ~ c2]',
  '[c2 ~ ~ c2 ~ g1 ~ d2]',
])

// ПЭД 0 — джазовые укладки: Fmaj9, Am7, Dm9, Gm9, C6/9. Ни одного
// тритона внутри: e и bb не встречаются в одном аккорде.
const PAD_A = phrase([
  '[f3,a3,c4,e4,g4]',
  '[a2,c3,e3,g3]',
  '[d3,f3,a3,c4,e4]',
  '[g2,bb2,d3,f3,a3]',
  '[c3,e3,g3,a3,d4]',
  '[f3,a3,c4,e4,g4]',
  '[a2,c3,e3,g3]',
  '[c3,e3,g3,a3,d4]',
])

// ПЭД 1 — рейв: те же корни, но квинты/октавы. Суперпиле не нужны
// джазовые терции: в рейве аккорд — это стена, а не укладка.
const PAD_B = phrase([
  '[f3,c4,f4]',
  '[a3,e4,a4]',
  '[d3,a3,d4]',
  '[g3,d4,g4]',
  '[c3,g3,c4]',
  '[f3,c4,f4]',
  '[a3,e4,a4]',
  '[c3,g3,c4]',
])

// KEYS — дом-пиано: аккорд на «и» каждой доли (8 токенов = восьмые).
// Трезвучия без 7-х: расширения уже держит пэд.
const KEYS = phrase([
  '[~ [f3,a3,c4] ~ [f3,a3,c4] ~ [f3,a3,c4] ~ [f3,a3,c4]]',
  '[~ [a3,c4,e4] ~ [a3,c4,e4] ~ [a3,c4,e4] ~ [a3,c4,e4]]',
  '[~ [d3,f3,a3] ~ [d3,f3,a3] ~ [d3,f3,a3] ~ [d3,f3,a3]]',
  '[~ [g3,d4,bb4] ~ [g3,d4,bb4] ~ [g3,d4,bb4] ~ [g3,d4,bb4]]',
  '[~ [c3,e3,g3] ~ [c3,e3,g3] ~ [c3,e3,g3] ~ [c3,e3,g3]]',
  '[~ [f3,a3,c4] ~ [f3,a3,c4] ~ [f3,a3,c4] ~ [f3,a3,c4]]',
  '[~ [a3,c4,e4] ~ [a3,c4,e4] ~ [a3,c4,e4] ~ [a3,c4,e4]]',
  '[~ [c3,e3,g3] ~ [c3,e3,g3] ~ [c3,e3,g3] ~ [c3,e3,g3]]',
])

// ARP — 16-е с паузами по тонам аккорда. Дом-спаркл, а не трель:
// паузы делают рисунок, а не плотность.
const ARP = phrase([
  '[f5 ~ a5 c6 ~ e6 c6 ~ a5 ~ c6 e6 ~ g6 e6 ~]',
  '[a5 ~ c6 e6 ~ g6 e6 ~ c6 ~ e6 g6 ~ a6 g6 ~]',
  '[d5 ~ f5 a5 ~ c6 a5 ~ f5 ~ a5 c6 ~ e6 c6 ~]',
  '[g5 ~ bb5 d6 ~ f6 d6 ~ bb5 ~ d6 f6 ~ a6 f6 ~]',
  '[c6 ~ e6 g6 ~ a6 g6 ~ e6 ~ g6 a6 ~ d7 a6 ~]',
  '[f5 ~ a5 c6 ~ e6 c6 ~ a5 ~ c6 e6 ~ g6 e6 ~]',
  '[a5 ~ c6 e6 ~ g6 e6 ~ c6 ~ e6 g6 ~ a6 g6 ~]',
  '[c6 ~ e6 g6 ~ a6 g6 ~ e6 ~ g6 a6 ~ d7 a6 ~]',
])

// CLAV — главный крючок: синкопы 16-ми, нотами аккорда и проходящими
// лада. 8 тактов, чтобы не дрейфовать по гармонии.
const CLAV = phrase([
  '[a4 ~ a4 c5 ~ e5 ~ g5 ~ e5 c5 ~ a4 ~ g4 ~]',
  '[a4 ~ a4 c5 ~ e5 ~ g5 ~ e5 ~ c5 a4 ~ c5 ~]',
  '[d4 ~ d4 a4 ~ c5 ~ e5 ~ c5 a4 ~ d4 ~ e4 ~]',
  '[g4 ~ g4 a4 ~ d5 ~ f5 ~ d5 a4 ~ g4 ~ d4 ~]',
  '[c5 ~ c5 d5 ~ e5 ~ g5 ~ e5 d5 ~ c5 ~ a4 ~]',
  '[a4 ~ a4 c5 ~ e5 ~ g5 ~ e5 c5 ~ a4 ~ g4 ~]',
  '[a4 ~ a4 c5 ~ e5 ~ g5 ~ e5 ~ c5 a4 ~ c5 ~]',
  '[c5 ~ e5 ~ g5 ~ e5 ~ c5 ~ a4 ~ g4 ~ e4 ~]',
])

// ACID — 303-риф: короткие ноты, фильтр-огибающая, glide на выбранных
// позициях. Нотами аккорда, чтобы эйсид не спорил с джазом.
const ACID = phrase([
  '[f2 ~ f2 f3 ~ a2 ~ c3 ~ f2 ~ ~ f3 ~ g3 ~]',
  '[a2 ~ a2 c3 ~ e3 ~ a3 ~ e3 ~ c3 ~ a2 ~]',
  '[d2 ~ d2 f2 ~ a2 ~ d3 ~ a2 ~ f2 ~ e2 ~]',
  '[g2 ~ g2 bb2 ~ d3 ~ f3 ~ d3 ~ bb2 ~ g2 ~]',
  '[c3 ~ c3 e3 ~ g3 ~ c4 ~ g3 ~ e3 ~ d3 ~]',
  '[f2 ~ f2 f3 ~ a2 ~ c3 ~ f2 ~ ~ f3 ~ g3 ~]',
  '[a2 ~ a2 c3 ~ e3 ~ a3 ~ e3 ~ c3 ~ a2 ~]',
  '[c3 ~ e3 ~ g3 ~ e3 ~ c3 ~ a2 ~ g2 ~ e3 ~]',
])

// HOOVER — рейв-лид. 8 тактов, крупные ноты: в рейве риф должен
// запоминаться с первого раза, а не разбираться со второго.
const HOOVER = phrase([
  '[f5 ~ ~ c6 ~ ~ a5 ~]',
  '[a5 ~ ~ e6 ~ ~ c6 ~]',
  '[d5 ~ ~ a5 ~ ~ f5 ~]',
  '[g5 ~ ~ d6 ~ ~ bb5 ~]',
  '[c6 ~ ~ g5 ~ ~ e5 ~]',
  '[f5 ~ ~ c6 ~ ~ a5 ~]',
  '[a5 ~ ~ e6 ~ ~ c6 ~]',
  '[c6 ~ ~ g5 ~ ~ d6 ~]',
])

// RAVE — рейв-стабы: квинты на «и» каждой доли (8 токенов). Высоко,
// потому что низ уже занят: суперпила внизу — это каша, а не удар.
const RAVE = phrase([
  '[~ [f5,c6] ~ [f5,c6] ~ [f5,c6] ~ [f5,c6]]',
  '[~ [a5,e6] ~ [a5,e6] ~ [a5,e6] ~ [a5,e6]]',
  '[~ [d5,a5] ~ [d5,a5] ~ [d5,a5] ~ [d5,a5]]',
  '[~ [g5,d6] ~ [g5,d6] ~ [g5,d6] ~ [g5,d6]]',
  '[~ [c6,g6] ~ [c6,g6] ~ [c6,g6] ~ [c6,g6]]',
  '[~ [f5,c6] ~ [f5,c6] ~ [f5,c6] ~ [f5,c6]]',
  '[~ [a5,e6] ~ [a5,e6] ~ [a5,e6] ~ [a5,e6]]',
  '[~ [c6,g6] ~ [c6,g6] ~ [c6,g6] ~ [c6,g6]]',
])

// ══════════════════════════════════════════════════════════════════
//  АТМОСФЕРА — звучит с первого нажатия
// ══════════════════════════════════════════════════════════════════

// ВОЗДУХ — ровный шум, срез дышит раз в 16 тактов
$: s("pink")
  .gain(atmos.air.vol)
  .lpf(atmos.air.cut).lpq(0.8).ftype("24db")
  .lpdepth(atmos.air.lfo).lpsync(0.0625).lpdc(0)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ДРОН — по умолчанию выключен: в хаусе низ должен быть ритмичным,
// а не висеть. Включай на интро, если хочется «подложку».
$: note(DRONE)
  .s("triangle").unison(2).detune(atmos.drone.det)
  .gain(atmos.drone.vol)
  .lpf(atmos.drone.cut).lpq(3).ftype("24db")
  .attack(1.4).decay(1).sustain(0.9).release(2)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ВИНИЛ — 12 тактов на цикл, поэтому ни с чем не совпадает
$: s("crackle")
  .gain(atmos.vinyl.vol.mul("<1 1 .7 1 1 1 1 .8 1 1 1 1>"))
  .lpf(atmos.vinyl.cut).hpf(300)
  .room(0.2)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  УДАРНЫЕ — хаус, джек, брейк и ролл
// ══════════════════════════════════════════════════════════════════

// БОЧКА. Громкость внутри веток: `.gain()` СТАВИТ громкость, общий
// `.gain(kick.vol)` снаружи стёр бы гейты режимов. 0 — четыре в пол,
// 1 — восьмые (jackin), 2 — синкопы брейка, 3 — четыре в пол + ролл.
$: stack(
     s("bd*4").gain(drums.kick.vol.mul(m0)),
     s("bd*8").gain(drums.kick.vol.mul(m1).mul(0.8)),
     s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~").gain(drums.kick.vol.mul(m2).mul(1.1)),
     s("bd*4").gain(drums.kick.vol.mul(m3)),
   )
  .lpf(drums.kick.cut).lpq(1)
  .speed(drums.kick.tune)
  .shape(drums.kick.shape)
  .distort(drums.kick.dist).distortvol(0.6)
  .decay(drums.kick.decay).sustain(0).release(0.08)
  .duckorbit(2).duckdepth(duck).duckattack(0.02)
  .filter(audible)

// ТЕЛО БОЧКИ — длина и низ, которых у сэмпла нет. Синус по корню с
// падением питча на атаке. Ритм тот же, что у бочки.
$: stack(
     note(ROOT).s("sine").struct("x*4").gain(drums.kick.bodyLevel.mul(drums.kick.vol).mul(m0)),
     note(ROOT).s("sine").struct("x*8").gain(drums.kick.bodyLevel.mul(drums.kick.vol).mul(m1).mul(0.8)),
     note(ROOT).s("sine").struct("x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ ~").gain(drums.kick.bodyLevel.mul(drums.kick.vol).mul(m2).mul(1.1)),
     note(ROOT).s("sine").struct("x*4").gain(drums.kick.bodyLevel.mul(drums.kick.vol).mul(m3)),
   )
  .lpf(drums.kick.cut.mul(0.5)).lpq(1)
  .penv(drums.kick.bodyDrop).panchor(0).pattack(0.002).pdecay(0.09).psustain(0).pcurve(1)
  .attack(0.002).decay(drums.kick.bodyDecay).sustain(0).release(0.12)
  .orbit(2)
  .filter(audible)

// САБ — вес на «и» 1-й и 3-й. На долю не ставим: там уже тело бочки,
// и два синуса в одной точке дают не вес, а мутную кашу.
$: note(ROOT)
  .s("sine")
  .struct("~ x ~ ~ ~ x ~ ~")
  .gain(bass.sub.vol)
  .lpf(bass.sub.cut).lpq(1)
  .decay(bass.sub.decay).sustain(0).release(0.2)
  .orbit(2)
  .filter(audible)

// КЛЭП — 2 и 4 в хаусе, 3 в брейке. Тонкий слой, не вместо снейра.
$: stack(
     s("~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~").gain(drums.clap.vol.mul(m0)),
     s("~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~").gain(drums.clap.vol.mul(m1).mul(0.9)),
     s("~ ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~").gain(drums.clap.vol.mul(m2)),
     s("~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~").gain(drums.clap.vol.mul(m3)),
   )
  .lpf(drums.clap.cut).hpf(drums.clap.hpf).lpq(3)
  .crush(drums.clap.crush)
  .decay(0.12).sustain(0)
  .pan(rand.mul(1.2).sub(0.6))
  .room(0.3).roomsize(fx.reverb.size)
  .filter(audible)

// СНЕЙР — в брейке и ролле. В хаусе/джеке его нет: там клэп.
$: stack(
     s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").gain(drums.snare.vol.mul(m2)),
     s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").gain(drums.snare.vol.mul(m3).mul(0.9)),
     s("~ ~ ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ ~ ~").gain(drums.snare.vol.mul(m3).mul(0.3)),
   )
  .lpf(drums.snare.cut).hpf(180)
  .decay(drums.snare.decay).sustain(0).release(0.08)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ФИЛЛ — 32-е по снейру на последнюю долю каждого 4-го такта.
// Четыре группы по два удара: так получается ровно 16 шагов, а не 1/13.
$: s("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ [sd*2] [sd*2] [sd*2] [sd*2]")
  .gain(drums.snare.vol.mul(m3).mul("<0 0 0 1>").mul(0.8))
  .lpf(drums.snare.cut.mul(1.2)).hpf(200)
  .decay(0.05).sustain(0)
  .pan(rand.mul(0.8).sub(0.4))
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .filter(audible)

// ХЭТЫ — 16-е с акцентами. В JACK — восьмые с шаффлом: это и есть
// «качает», а не просто ровная сетка.
$: stack(
     s("hh*16").gain(drums.hat.vol.mul("[1 .4 .6 .4]*4").mul(m0)),
     s("hh*8").gain(drums.hat.vol.mul("[1 .5]*4").mul(m1)).swingBy(0.1, 8),
     s("hh*8").gain(drums.hat.vol.mul("[1 .6 .4 .6]*2").mul(m2)),
     s("hh*16").gain(drums.hat.vol.mul("[1 .35 .6 .35 .8 .35 .6 .35]*2").mul(m3)),
   )
  .lpf(drums.hat.cut).hpf(350)
  .sometimesBy(0.15, (x) => x.ply(2))
  .lastOf(4, (x) => x.ply(2))
  .degradeBy(0.04)
  .filter(audible)

// ОТКРЫТЫЕ ХЭТЫ — на «и» каждой доли, классический хаус-«тсс»
$: stack(
     s("~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~").gain(drums.ohat.vol.mul(m0)),
     s("~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~").gain(drums.ohat.vol.mul(m1)),
     s("~ ~ ~ ~ oh ~ ~ ~ ~ ~ ~ ~ oh ~ ~ ~").gain(drums.ohat.vol.mul(m2)),
     s("~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~").gain(drums.ohat.vol.mul(m3)),
   )
  .lpf(drums.ohat.cut)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ШЕЙКЕР — 16-е, но с вероятностным пропуском: сетка есть, рисунка нет
$: stack(
     s("sh*16").gain(drums.shaker.vol.mul(0.7).mul(m1)).degradeBy(0.3),
     s("sh*16").gain(drums.shaker.vol.mul(0.6).mul(m2)).degradeBy(0.25),
     s("sh*16").gain(drums.shaker.vol.mul(0.8).mul(m3)).degradeBy(0.2),
   )
  .lpf(drums.shaker.cut).hpf(2500)
  .decay(0.03).sustain(0)
  .pan(rand.mul(0.8).add(0.1))
  .filter(audible)

// КОНГА — рейвовый рим, опущенный по высоте. 5 тактов, поэтому не
// совпадает с хэтами; панорама едет случайно.
$: stack(
     s("~ ~ ~ rim ~ ~ ~ ~ rim ~ ~ ~ ~ rim ~ ~").gain(drums.conga.vol.mul(m0)),
     s("rim ~ ~ ~ ~ ~ rim ~ ~ ~ rim ~ ~ ~ ~ ~").gain(drums.conga.vol.mul(m1)),
     s("~ ~ rim ~ ~ ~ ~ ~ rim ~ ~ ~ ~ ~ rim ~").gain(drums.conga.vol.mul(m2)),
     s("rim ~ ~ rim ~ ~ rim ~ ~ ~ rim ~ ~ rim ~ ~").gain(drums.conga.vol.mul(m3)),
   )
  .lpf(drums.conga.cut).hpf(400).lpq(2)
  .speed(drums.conga.tune)
  .decay(0.06).sustain(0)
  .pan(rand.mul(1.4).sub(0.7))
  .delay(0.15).delaytime(0.375).delayfeedback(0.2)
  .filter(audible)

// ТАМБУРИН — «и» каждой доли в хаусе и ролле. Это не хэт: у него
// другой сэмпл и другая полоса, поэтому он не спорит с oh.
$: stack(
     s("~ ~ hh:2 ~ ~ ~ hh:2 ~ ~ ~ hh:2 ~ ~ ~ hh:2 ~").gain(drums.tamb.vol.mul(0.5).mul(m0)),
     s("~ ~ hh:2 ~ ~ ~ hh:2 ~ ~ ~ hh:2 ~ ~ ~ hh:2 ~").gain(drums.tamb.vol.mul(0.6).mul(m3)),
   )
  .lpf(drums.tamb.cut).hpf(4000)
  .decay(0.03).sustain(0)
  .pan(rand.mul(1.2).sub(0.6))
  .filter(audible)

// ТАРЕЛКА — шумом, раз в 8 тактов
$: s("white")
  .gain(drums.crash.vol.mul("<1 0 0 0 0 0 0 0>"))
  .lpf(drums.crash.cut).hpf(4000)
  .attack(0.002).decay(1.2).sustain(0).release(0.6)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  БАС — хаус-линия с драйвом
// ══════════════════════════════════════════════════════════════════

// HOUSE BASS — пила через ladder с перегрузом фильтра. Слайд только на
// двух позициях в такте (гейт без угловых скобок: `<...>` — альтерация).
$: note(BASS)
  .s("sawtooth")
  .glide(bass.house.glide.mul("0 0 1 0 0 0 0 1"))
  .gain(bass.house.vol)
  .lpf(bass.house.cut).lpq(bass.house.res).ftype("ladder").drive(bass.house.drive)
  .lpenv(bass.house.env)
  .lpa(0.005).lpd(bass.house.decay).lpsustain(0.15)
  .decay(0.15).sustain(0.4).release(0.08)
  .orbit(2)
  ._pianoroll()
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ГАРМОНИЯ — пэд (джаз/рейв), орган, дом-пиано
// ══════════════════════════════════════════════════════════════════

// ПЭД 0 — JAZZ. Аддитивный синтез: partials задают тёплый стек, а не
// пилу. Это тот самый «джаз на всём»: Fmaj9 / Am7 / Dm9 / Gm9 / C6/9.
$: note(PAD_A)
  .s("sawtooth").partials([1, 0.45, 0.25, 0.12, 0.06])
  .unison(3).detune(pads.pad.det)
  .gain(pads.pad.vol.mul(hA))
  .lpf(pads.pad.cut).lpq(pads.pad.q).ftype("24db")
  .lpdepth(pads.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.28)
  .attack(0.8).decay(1.2).sustain(0.9).release(2)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ПЭД 1 — RAVE. Та же гармония, но стена из суперпил. Короткая атака:
// в рейве пэд должен бить, а не проявляться.
$: note(PAD_B)
  .s("supersaw").unison(5).detune(pads.pad.det.mul(1.6))
  .gain(pads.pad.vol.mul(hB))
  .lpf(pads.pad.cut.mul(1.4)).lpq(pads.pad.q.mul(0.7))
  .lpdepth(pads.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.35)
  .attack(0.25).decay(0.8).sustain(0.85).release(1.4)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ОРГАН — корень с квинтой. Держит джазовую середину, когда пэд
// ушёл в суперпилу.
$: note(ORGAN)
  .s("sine").partials([1, 0.5, 0.3, 0.15, 0.1])
  .unison(2).detune(0.05)
  .gain(pads.organ.vol)
  .lpf(pads.organ.cut).lpq(1)
  .attack(0.3).decay(0.8).sustain(0.8).release(1.5)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ДОМ-ПИАНО — аккорд на «и» каждой доли. FM на синусе: яркий удар,
// короткий хвост, без реверба-холла.
$: note(KEYS)
  .s("sine").fm(pads.keys.fm).fmh(2.0)
  .gain(pads.keys.vol)
  .lpf(pads.keys.cut).lpq(2)
  .decay(pads.keys.decay).sustain(0).release(0.25)
  .room(verb).roomsize(fx.reverb.size)
  .pan(rand.mul(0.6).sub(0.3))
  ._pianoroll()
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  РИФЫ
// ══════════════════════════════════════════════════════════════════

// ARP — 16-е с паузами. Треугольник с FM: удар, а не колокол.
$: note(ARP)
  .s("triangle").fm(0.5).fmh(2.0)
  .gain(melody.arp.vol)
  .lpf(melody.arp.cut).lpq(2)
  .decay(melody.arp.decay).sustain(0).release(0.05)
  .delay(melody.arp.echo).delaytime(0.1875).delayfeedback(0.25)
  .pan(sine.slow(8).range(0.3, 0.7))
  .filter(audible)

// CLAV — главный крючок: квадрат, короткий спад, узкий резонанс.
// Это не пиано и не орган: у клавинета удар и сразу — тело.
$: note(CLAV)
  .s("square")
  .gain(melody.clav.vol)
  .lpf(melody.clav.cut).lpq(melody.clav.res)
  .hpf(300)
  .decay(melody.clav.decay).sustain(0).release(0.05)
  .delay(melody.clav.echo).delaytime(0.1875).delayfeedback(0.22)
  .pan(rand.mul(0.8).sub(0.4))
  ._pianoroll()
  .filter(audible)

// ACID — 303. Ladder + drive + glide, но ноты из аккорда: эйсид здесь
// фактура, а не хаос. Гейт слайда — 16 шагов, без угловых скобок.
$: note(ACID)
  .s("sawtooth")
  .glide(melody.acid.glide.mul("0 0 0 1 0 0 0 0 0 0 0 0 1 0 0 0"))
  .gain(melody.acid.vol)
  .lpf(melody.acid.cut).lpq(melody.acid.res).ftype("ladder").drive(melody.acid.drive)
  .lpenv(melody.acid.env)
  .lpa(0.002).lpd(melody.acid.decay).lpsustain(0.12)
  .decay(0.15).sustain(0.4).release(0.08)
  .room(0.15).roomsize(fx.reverb.size)
  .orbit(2)
  ._pianoroll()
  .filter(audible)

// HOOVER — рейв-лид. Включается ручкой rave (0/1): это слой, а не
// форма, поэтому без защёлки. Пила вниз на атаке — узнаваемый сброс.
$: note(HOOVER)
  .s("supersaw").unison(5).detune(melody.hoover.det)
  .vowel("<a e o>")
  .gain(melody.hoover.vol.mul(rave))
  .lpf(melody.hoover.cut).lpq(3)
  .penv(melody.hoover.drop.mul(-1)).panchor(1).pattack(0.005).pdecay(0.18).psustain(0.4)
  .decay(0.25).sustain(0.5).release(0.2)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// RAVE STABS — квинты на «и» каждой доли. Включаются той же ручкой
// rave; низ не трогают, поэтому не спорят с басом.
$: note(RAVE)
  .s("supersaw").unison(4).detune(0.12)
  .gain(melody.rave.vol.mul(rave))
  .lpf(melody.rave.cut).lpq(3)
  .decay(melody.rave.decay).sustain(0).release(0.2)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ЭФФЕКТЫ
// ══════════════════════════════════════════════════════════════════

// РАЙЗЕР — раз в 8 тактов, срез ползёт вверх: слышно направление
$: s("white")
  .gain(fx.riser.vol.mul("<0 0 0 0 0 0 0 1>"))
  .lpf(sine.range(300, fx.riser.cut).slow(8)).lpq(8)
  .attack(1.2).decay(0.4).sustain(0.7).release(0.3)
  .pan(sine.slow(16).range(0.2, 0.8))
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ШПАРГАЛКА НА НОЧЬ
// ══════════════════════════════════════════════════════════════════
//  Имена — пути по дереву: группа.инструмент.параметр.
//
//  пустота:       atmos.air.vol 0.1 + verb 0.35, винил 0.03
//  вход:          + drums.kick.vol 0.4 (mode 0) → bass.sub.vol 0.4
//  бас:           bass.house.vol 0.55, cut 520 → 260 (глубже), 1200 (ярче)
//  ритм:          drums.clap.vol 0.35, drums.hat.vol 0.35, drums.ohat.vol 0.25
//  перкуссия:     drums.shaker.vol 0.2, drums.conga.vol 0.25, drums.tamb.vol 0.2
//  гармония:      pads.pad.vol 0.3, pads.organ.vol 0.25, pads.keys.vol 0.4
//  рифы:          melody.clav.vol 0.45, melody.arp.vol 0.25, melody.acid.vol 0.35
//  рейв:          rave 1 — включаются hoover и rave stabs; harmony 1 — суперпила
//  злее:          melody.acid.res 15 → 24, drive 1.2 → 2; bass.house.drive 1.2 → 2
//  переключение:  harmony 0 ⇄ 1 — на границе 8 тактов; rave — мгновенно
//  режимы:        mode 0 house / 1 jack / 2 break / 3 roll
// ══════════════════════════════════════════════════════════════════
