// ══════════════════════════════════════════════════════════════════
//  ACID JAZZ 14  ·  Strudel  ·  90 BPM  ·  pleasant acid jazz
//
//  Пятый характер серии. 06 — глубокий даб, 12 — медленный трэп, а это
//  acid jazz: тёплый, качающий, без злости. 90 BPM — тот темп, где
//  свинг ещё слышен как свинг, а 16-е арпеджио не превращаются в трель.
//
//  ── ЧТО ВЗЯТО ИЗ 06 ─────────────────────────────────────────────
//  Набор инструментов и их характер: воздух, дрон, винил, арпеджио TIA,
//  общая мелодия, бульки, бас-призрак, орган, стабы, шумовой свип.
//  TIA — главный гость: та же фигура «вверх-вниз» 16-ми, медленно
//  открывающийся фильтр и длинный дилей. Только теперь она играет не
//  по Cm, а по аккордам этого трека, поэтому всегда попадает в гармонию.
//
//  ── ЧТО ВЗЯТО ИЗ 12 ─────────────────────────────────────────────
//  Форма, а не музыка: дерево `instruments` (группа → инструмент →
//  параметр), имена дорожек, глобальные `verb` / `duck`, переключатели
//  `mode` и `harmony` с защёлкой на 8 тактов, `.filter(audible)` и
//  правило «громкость → срез» в каждой цепочке. Треки стартуют тихо:
//  звучит только атмосфера, остальное поднимаешь руками.
//
//  ── ПЭД — ДРУГОЙ ────────────────────────────────────────────────
//  В 06 пэды — sawtooth и supersaw. Здесь оба пэда — аддитивный синтез
//  самого Strudel через `partials`:
//    * `s("sawtooth").partials([...])` — оставлены только нечётные
//      гармоники: полый, деревянный тембр;
//    * `s("sine").partials([...])` — ровный тёплый стек.
//  Это не «ещё один суперпил»: грязи меньше, места в миксе больше.
//  Режимы:
//    0 — кварты без терций: ни мажора, ни минора, только воздух;
//    1 — 9-е и 13-я: тёплые джазовые укладки.
//
//  ── ГАРМОНИЯ ────────────────────────────────────────────────────
//  Одна тональность на оба режима — F дорийский (f g ab bb c d eb).
//  Корни на 8 тактов: f bb eb c g eb bb f. Это не cadence, а круг:
//  Fm9 → Bb6/9 → Ebmaj9 → Cm7 → Gm7 → Ebmaj9 → Bb6/9 → Fm9.
//  Дорийский, а не натуральный минор, потому что здесь важен d (6-я):
//  он даёт свет, а не печаль. Тритонов в аккордах не держим: пэды
//  собраны так, чтобы у линий не было «неправильной» пары (проверяет
//  `npm run tension`).
//
//  ── ПОЧЕМУ ЭТО ACID JAZZ, А НЕ ПРОСТО ДАБ ───────────────────────
//  1. СВИНГ. Хэты в первом режиме качаются через `swingBy(0.16, 8)`:
//     вторая восьмая приезжает позже — это и есть «качает».
//  2. ХОДЯЩИЙ БАС. Контрабас играет не только корень: терция, квинта,
//     подход к следующему такту. Слайд — через `glide`, редко.
//  3. RHODES-КОМПИНГ. `keys` — короткие аккорды на 2 и 4, как пианист
//     левой рукой, а не пэд на весь такт.
//  4. МЕЛОДИЯ SPARSE: в джазе важно не что сыграно, а что пропущено.
//  5. БАРАБАНЫ МЯГКИЕ: бочка 0.3–0.5, снейр на 2 и 4, шейкер и кисть.
//
//  ── РЕЖИМЫ ──────────────────────────────────────────────────────
//  УДАРНЫЕ (mode, 4): 0 JAZZ / 1 BREAK / 2 HALF / 3 ROLL.
//  ГАРМОНИЯ (harmony, 2): 0 QUARTAL / 1 NINTH.
//  Обе ручки — защёлки на 8 тактов: начатая фраза доигрывает целиком.
// ══════════════════════════════════════════════════════════════════

const BPM = 90
setcpm(BPM / 4) // один цикл = один такт 4/4 (≈ 2.667 с)

// ══════════════════════════════════════════════════════════════════
//  ШИРИНА СЛАЙДЕРОВ + ЛЕЧЕНИЕ ИХ РАССИНХРОНА
// ══════════════════════════════════════════════════════════════════
// Штатные 64px — мышкой в шаг 0.01 не попасть. Правило с !important
// перебивает инлайн. Строки ТОЛЬКО в одинарных кавычках: транспайлер
// оборачивает в m() всё, что в двойных и в бэктиках.
const SLIDER_PX = 180
if (typeof document !== 'undefined' && !document.getElementById('slider-w')) {
  const st = document.createElement('style')
  st.id = 'slider-w'
  st.textContent = '.cm-slider input { width: ' + SLIDER_PX + 'px !important; }'
  document.head.appendChild(st)
}

// СИНХРОНИЗАЦИЯ ПОЛЗУНКОВ — заплатка на баг strudel.cc (docs/slider-bug.md).
// Виджет запоминает число на момент Ctrl+Enter и после скролла строит
// ползунок из него, хотя в коде уже стоит накрученное. Драг считает длину
// заменяемого числа от устаревшего значения: код «0.82», ползунок «0.5» →
// заменяются 3 символа → в коде «0.62» вместо «0.6». Лечится снаружи:
// держим el.originalValue равным тому, что реально в документе.
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
// Нужен только контрабасу: в джазе подход к следующей доле — это
// короткий съезд, а не портаменто на каждой ноте. Гейт выбирает, где
// именно он случается (см. дорожку UPRIGHT).
// getFrequencyFromValue есть в скоупе strudel.cc, но НЕ экспортируется
// из @strudel/core в node — поэтому фолбэк через noteToMidi, иначе
// npm run verify не сможет прогнать трек.
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

// РЕЖИМ УДАРНЫХ: 0 джаз / 1 лом / 2 полутемп / 3 ролл.
// Строка ниже — подписи кнопок для панели (web/panel.js читает её как есть).
// @switches mode=jazz,break,half,roll harmony=quartal,ninth
const mode = slider(0, 0, 3, 1)
const m0 = mode.fmap((m) => (m === 0 ? 1 : 0))
const m1 = mode.fmap((m) => (m === 1 ? 1 : 0))
const m2 = mode.fmap((m) => (m === 2 ? 1 : 0))
const m3 = mode.fmap((m) => (m === 3 ? 1 : 0))

// ГАРМОНИЯ: 0 кварты / 1 9-е и 13-я. Одна тональность, разная укладка.
// seg(1/8) = защёлка на 8 тактов: начатая фраза доигрывает целиком.
const harmony = slider(0, 0, 1, 1)
const hQ = harmony.seg(1 / 8)
const hA = hQ.fmap((h) => (h < 0.5 ? 1 : 0))
const hB = hQ.fmap((h) => (h < 0.5 ? 0 : 1))

// ══════════════════════════════════════════════════════════════════
//  ОБЩЕЕ — не принадлежит ни одному инструменту
// ══════════════════════════════════════════════════════════════════
const verb = slider(0.38, 0, 1, 0.01)  // сколько сигнала уходит в реверб
const duck = slider(0.5, 0, 1, 0.01)   // насколько бочка приседает низ

// ══════════════════════════════════════════════════════════════════
//  ИНСТРУМЕНТЫ — дерево, которое читает панель
// ══════════════════════════════════════════════════════════════════
// Панель читает ЭТУ структуру как есть: группа → инструмент → параметр.
//   * vol любого инструмента — левый столбец (микшер);
//   * остальные параметры — правый столбец;
//   * порядок ключей = порядок в панели.
// Правило двух пальцев: у каждого инструмента vol стоит первым, cut —
// сразу за ним; в цепочке так же: .gain(...), под ним .lpf(...).
const instruments = {
  // ── БАРАБАНЫ ───────────────────────────────────────────────────
  drums: {
    name: 'Drums',
    kick: {
      name: 'Kick',
      vol: slider(0, 0, 0.5, 0.01),           // потолок 0.5: правило проекта
      cut: slider(420, 90, 4000, 10),         // глухо, но слышно тело
      shape: slider(0.55, 0, 0.95, 0.01),
      decay: slider(0.55, 0.15, 2, 0.01),
      tune: slider(0.86, 0.55, 1.4, 0.01),
      bodyLevel: slider(0.35, 0, 1, 0.01),    // слой ТЕЛО: длина и низ
      bodyDecay: slider(0.9, 0.3, 3, 0.01),
      bodyDrop: slider(4, 0, 12, 0.5),        // падение питча на атаке
    },
    snare: {
      name: 'Snare',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(4800, 800, 14000, 100),
      decay: slider(0.18, 0.03, 0.7, 0.01),
    },
    clap: {
      name: 'Clap',
      vol: slider(0, 0, 0.9, 0.01),
      cut: slider(5200, 800, 14000, 100),
      hpf: slider(700, 200, 4000, 50),
      crush: slider(13, 1, 16, 0.5),
    },
    hat: {
      name: 'Hats',
      vol: slider(0, 0, 0.9, 0.01),
      cut: slider(7800, 800, 16000, 100),
    },
    ohat: {
      name: 'Open hats',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(5400, 800, 16000, 100),
    },
    rim: {
      name: 'Rim',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(3200, 400, 14000, 100),
    },
    shaker: {
      name: 'Shaker',
      vol: slider(0, 0, 0.6, 0.01),
      cut: slider(6800, 800, 16000, 100),
    },
    brush: {
      name: 'Brush',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(3200, 400, 12000, 100),
      decay: slider(0.07, 0.02, 0.3, 0.01),
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
    // контрабас: не 808 и не риз, а деревянный ход с подходом
    upright: {
      name: 'Upright',
      vol: slider(0, 0, 1.1, 0.01),
      cut: slider(780, 80, 4000, 10),
      res: slider(4, 0, 20, 0.5),
      env: slider(1.8, 0, 8, 0.1),
      decay: slider(0.22, 0.05, 1, 0.01),
      glide: slider(0.07, 0, 0.2, 0.001),     // короткий съезд, не портаменто
    },
    // саб: только вес, на «и», чтобы не спорить с телом бочки
    sub: {
      name: 'Sub',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(220, 50, 1000, 10),
      decay: slider(0.5, 0.1, 2, 0.01),
    },
    // бас-призрак: редкие высокие щипки в эхе (как GBASS в 06)
    ghost: {
      name: 'Ghost bass',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(900, 100, 4000, 10),
      echo: slider(0.5, 0, 0.9, 0.01),
    },
  },

  // ── ПЭДЫ ───────────────────────────────────────────────────────
  pads: {
    name: 'Pads',
    // Пэд с partials: это и есть «другой пэд». В 06 были sawtooth и
    // supersaw, здесь — аддитивный синтез: набор гармоник задаёт тембр.
    // Режим 0 — нечётные гармоники (полый, деревянный звук).
    pad: {
      name: 'Pad',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(1300, 80, 6000, 10),
      q: slider(1.2, 0, 20, 0.5),
      lfo: slider(1.4, 0, 8, 0.1),
      det: slider(0.09, 0, 0.6, 0.01),
    },
    organ: {
      name: 'Organ',
      vol: slider(0, 0, 0.8, 0.01),
      cut: slider(900, 100, 6000, 10),
    },
    // Rhodes-компинг: короткие аккорды на 2 и 4
    keys: {
      name: 'Keys',
      vol: slider(0, 0, 0.9, 0.01),
      cut: slider(2600, 200, 10000, 20),
      fm: slider(0.9, 0, 4, 0.05),
      decay: slider(0.3, 0.05, 1.2, 0.01),
    },
    // редкий духовой удар: тот же аккорд, другой тембр и большой хвост
    stab: {
      name: 'Brass',
      vol: slider(0, 0, 0.8, 0.01),
      cut: slider(2400, 200, 12000, 20),
      decay: slider(0.25, 0.03, 1, 0.01),
    },
  },

  // ── МЕЛОДИЯ ────────────────────────────────────────────────────
  melody: {
    name: 'Melody',
    // TIA — тот самый «мугообразный» арпеджио из 06: 16-е, фильтр
    // открывается медленно, длинный дилей. По умолчанию в нуле.
    tia: {
      name: 'TIA arp',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(90, 80, 2400, 10),          // старт в самом низу
      res: slider(9, 0, 20, 0.5),
      env: slider(3.2, 0, 9, 0.1),
      lfo: slider(2.2, 0, 8, 0.1),
      echo: slider(0.55, 0, 0.95, 0.01),
    },
    // мелодия — вибры/электропиано, а не колокольчики: в джазе важна
    // середина, а не блеск наверху
    mel: {
      name: 'Melody',
      vol: slider(0, 0, 0.9, 0.01),
      cut: slider(3000, 200, 10000, 20),
      decay: slider(0.4, 0.05, 1.5, 0.01),
      echo: slider(0.3, 0, 0.9, 0.01),
    },
    bub: {
      name: 'Bubbles',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(1800, 200, 8000, 20),
      echo: slider(0.5, 0, 0.95, 0.01),
    },
  },

  // ── ЭФФЕКТЫ ────────────────────────────────────────────────────
  fx: {
    name: 'FX',
    blip: {
      name: 'Blips',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(9000, 1000, 16000, 100),
      delay: slider(0.45, 0, 0.9, 0.01),
      time: slider(0.1875, 0.03, 0.5, 0.005), // 3/16 — «косой» дилей
    },
    sweep: {
      name: 'Sweep',
      vol: slider(0, 0, 0.6, 0.01),
      cut: slider(1200, 100, 8000, 20),
    },
    // реверб как шина: send живёт над микшером (verb), размер — здесь
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

// Короткие имена групп для цепочек: drums.kick.vol вместо instruments...
const { drums, bass, pads, melody, fx, atmos } = instruments


// 🛑 НОЛЬ НА РУЧКЕ — ЭТО НЕ БЕСПЛАТНО. Событие с gain 0 всё равно проходит
// весь путь: сэмпл грузится, узлы строятся, орбита и дилей получают сигнал —
// просто всё умножается на ноль. Поэтому каждая дорожка кончается
// `.filter(audible)`: hap с нулевой громкостью не доходит до триггера.
// Гейт стоит ПОСЛЕ `._pianoroll()` намеренно: ролл рисует «тень» паттерна,
// снятую ДО фильтра, поэтому показывает ритм и на нулевой громкости.
const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}


// ══════════════════════════════════════════════════════════════════
//  ФРАЗЫ
// ══════════════════════════════════════════════════════════════════
const phrase = (bars) => m('<' + bars.join(' ') + '>')

// Корни на 8 тактов: f bb eb c g eb bb f. Это не прогрессия с каденцией,
// а круг: Fm9 → Bb6/9 → Ebmaj9 → Cm7 → Gm7 → Ebmaj9 → Bb6/9 → Fm9.
// Строка ниже — машинный маркер для tools/tension.mjs.
// @roots f bb eb c g eb bb f

// ROOT — одна нота на такт для саба и тела бочки.
const ROOT = phrase([
  '[f1]', '[bb1]', '[eb2]', '[c2]',
  '[g1]', '[eb2]', '[bb1]', '[f1]',
])

// ДРОН — корень с квинтой в самом низу. Держит тональность, когда
// остального ещё нет.
const DRONE = phrase([
  '[f1,c2]', '[bb1,f2]', '[eb2,bb2]', '[c2,g2]',
  '[g1,d2]', '[eb2,bb2]', '[bb1,f2]', '[f1,c2]',
])

// ОРГАН — корень с квинтой в середине, играет в обоих режимах.
const ORGAN = phrase([
  '[f2,c3]', '[bb2,f3]', '[eb3,bb3]', '[c3,g3]',
  '[g2,d3]', '[eb3,bb3]', '[bb2,f3]', '[f2,c3]',
])

// КОНТРАБАС — 8 тактов по восьмым. Не только корень: терция, квинта и
// подход к следующей доле. Регистр f1…c3 — это 43–130 Гц.
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

// ПЭД 0 — кварты без терций. Ни мажора, ни минора: только воздух.
// Укладки rootless (как у McCoy Tyner), поэтому не спорят с басом.
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

// ПЭД 1 — 9-е, 11-е и 13-я. Тёплые укладки, но без тритоновых пар:
// Fm9 (f ab c g5), Bb6/9 (bb d f g), Ebmaj9, Cm7, Gm7.
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

// TIA — арпеджио «в стиле», а не цитата: восходяще-нисходящая фигура
// 16-ми по тонам аккорда, фильтр медленно открывается, длинный дилей.
// 8 тактов = ровно круг корней, поэтому арпеджио всегда попадает в
// текущий аккорд. Верхний регистр (c4…g5) разведён с пэдом.
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

// МЕЛОДИЯ — 8 тактов, sparse: в джазе нота важна паузой вокруг неё.
// Только ноты лада; над F не играем d (там в пэде ab), над остальными —
// не играем ab (там в пэде d). Это и есть «приятно», а не «случайно».
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

// KEYS — Rhodes-компинг: короткие аккорды на 2 и 4, как левая рука
// пианиста. Две ноты, а не четыре: в этом регистре больше — уже каша.
const KEYS = phrase([
  '[~ [f4,c5] ~ [f4,c5]]',
  '[~ [bb4,f5] ~ [bb4,f5]]',
  '[~ [eb4,bb4] ~ [eb4,bb4]]',
  '[~ [c5,g5] ~ [c5,g5]]',
  '[~ [g4,d5] ~ [g4,d5]]',
  '[~ [eb4,bb4] ~ [eb4,bb4]]',
  '[~ [bb4,f5] ~ [bb4,f5]]',
  '[~ [f4,c5] ~ [f4,c5]]',
])

// BRASS — редкий духовой удар: тот же аккорд, другой тембр. Играет
// только на 1-м и 5-м такте (гейт в дорожке), поэтому это акцент,
// а не второй пэд.
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

// БУЛЬКИ — нота с падением внутри себя. 5 тактов не тянем: дрейф по
// дорийскому ладу дал бы случайные тритоны, поэтому фраза якорная (8).
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

// БАС-ПРИЗРАК — редкие высокие щипки в эхе. 8 тактов, чтобы не спорить
// с гармонией: это краска, а не линия.
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
//  АТМОСФЕРА — звучит с первого нажатия
// ══════════════════════════════════════════════════════════════════

// ВОЗДУХ — ровный шум, срез дышит раз в 16 тактов
$: s("pink")
  .gain(atmos.air.vol)
  .lpf(atmos.air.cut).lpq(0.8).ftype("24db")
  .lpdepth(atmos.air.lfo).lpsync(0.0625).lpdc(0)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ДРОН — корень с квинтой на октаву ниже; две расстроенные пилы дают
// не «одну ноту», а стену. Медленная атака: он не вступает, а проявляется.
$: note(DRONE)
  .s("sawtooth").unison(2).detune(atmos.drone.det)
  .gain(atmos.drone.vol)
  .lpf(atmos.drone.cut).lpq(3).ftype("24db")
  .attack(1.6).decay(1).sustain(0.9).release(2.4)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ВИНИЛ — 12 тактов на цикл, поэтому ни с чем не совпадает
$: s("crackle")
  .gain(atmos.vinyl.vol.mul("<1 1 .7 1 1 1 1 .8 1 1 1 1>"))
  .lpf(atmos.vinyl.cut).hpf(300)
  .room(0.2)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  УДАРНЫЕ — четыре режима, мягкая бочка
// ══════════════════════════════════════════════════════════════════

// БОЧКА. Громкость внутри каждой ветки: `.gain()` СТАВИТ громкость,
// поэтому общий `.gain(drums.kick.vol)` снаружи стёр бы гейты режимов.
// Риты: 0 — 1 и «и» третьей; 1 — euclid 3/16 (лом); 2 — только 1-я
// доля (полутемп); 3 — синкопы ролла.
$: stack(
     s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~ ~ ~ ~ ~").gain(drums.kick.vol.mul(m0)),
     s("bd").euclid(3, 16).gain(drums.kick.vol.mul(m1).mul(0.9)),
     s("bd ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~").gain(drums.kick.vol.mul(m2)),
     s("bd ~ ~ bd ~ ~ bd ~ ~ ~ bd ~ ~ bd ~ ~").gain(drums.kick.vol.mul(m3).mul(0.9)),
   )
  .lpf(drums.kick.cut).lpq(1)
  .speed(drums.kick.tune)
  .shape(drums.kick.shape)
  .decay(drums.kick.decay).sustain(0).release(0.08)
  .duckorbit(2).duckdepth(duck).duckattack(0.02)
  .filter(audible)

// ТЕЛО БОЧКИ — длина, которой у сэмпла нет. Синус по корню с падением
// питча на атаке: это «бум», а не «тук». Ритм тот же, что у бочки.
$: stack(
     note(ROOT).s("sine").struct("x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~ ~").gain(drums.kick.bodyLevel.mul(drums.kick.vol).mul(m0)),
     note(ROOT).s("sine").struct("x(3,16)").gain(drums.kick.bodyLevel.mul(drums.kick.vol).mul(m1).mul(0.9)),
     note(ROOT).s("sine").struct("x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~").gain(drums.kick.bodyLevel.mul(drums.kick.vol).mul(m2)),
     note(ROOT).s("sine").struct("x ~ ~ x ~ ~ x ~ ~ ~ x ~ ~ x ~ ~").gain(drums.kick.bodyLevel.mul(drums.kick.vol).mul(m3).mul(0.9)),
   )
  .lpf(drums.kick.cut.mul(0.5)).lpq(1)
  .penv(drums.kick.bodyDrop).panchor(0).pattack(0.002).pdecay(0.09).psustain(0).pcurve(1)
  .attack(0.002).decay(drums.kick.bodyDecay).sustain(0).release(0.12)
  .orbit(2)
  .filter(audible)

// САБ — только вес, на «и», чтобы не спорить с телом бочки.
$: note(ROOT)
  .s("sine")
  .struct("~ x ~ ~ ~ x ~ ~")
  .gain(bass.sub.vol)
  .lpf(bass.sub.cut).lpq(1)
  .decay(bass.sub.decay).sustain(0).release(0.2)
  .orbit(2)
  .filter(audible)

// СНЕЙР — 2 и 4 в джазе, 2-я и 3-я «сломанные» в ломе, 3-я в полутемпе.
// В ролле к нему добавляются призраки и филл (см. ниже).
$: stack(
     s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").gain(drums.snare.vol.mul(m0)),
     s("~ ~ ~ ~ ~ ~ sd ~ ~ ~ sd ~ ~ ~ ~ ~").gain(drums.snare.vol.mul(m1).mul(0.9)),
     s("~ ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~").gain(drums.snare.vol.mul(m2).mul(1.1)),
     s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").gain(drums.snare.vol.mul(m3).mul(0.9)),
     s("~ ~ ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ ~ ~").gain(drums.snare.vol.mul(m3).mul(0.3)),
     s("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ sd ~")
       .gain(drums.snare.vol.mul(m3).mul(0.3).mul("<1 1 1 0>")),
   )
  .lpf(drums.snare.cut).hpf(180)
  .decay(drums.snare.decay).sustain(0).release(0.08)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ФИЛЛ — 32-е по снейру на последнюю долю каждого 4-го такта.
// Четыре группы по два удара, а не `[sd*8]`: группа занимает ОДИН слот,
// и «12 ~ + [sd*8]» дал бы сетку 1/13 вместо 16 шагов.
$: s("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ [sd*2] [sd*2] [sd*2] [sd*2]")
  .gain(drums.snare.vol.mul(m3).mul("<0 0 0 1>").mul(0.8))
  .lpf(drums.snare.cut.mul(1.2)).hpf(200)
  .decay(0.05).sustain(0)
  .pan(rand.mul(0.8).sub(0.4))
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .filter(audible)

// КЛЭП — тонкий слой к снейру, не вместо него. В ломе молчит: там
// снейр уехал с сетки, и вместе они звучат как каша.
$: stack(
     s("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~").gain(drums.clap.vol.mul(m0).mul(0.8)),
     s("~ ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~").gain(drums.clap.vol.mul(m2)),
     s("~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~").gain(drums.clap.vol.mul(m3)),
   )
  .lpf(drums.clap.cut).hpf(drums.clap.hpf).lpq(3)
  .crush(drums.clap.crush)
  .decay(0.12).sustain(0)
  .pan(rand.mul(1.2).sub(0.6))
  .room(0.3).roomsize(fx.reverb.size)
  .filter(audible)

// ХЭТЫ — свинг живёт здесь. `swingBy(0.16, 8)` сдвигает вторую восьмую
// внутри каждой пары: это и есть «качает». В ролле — 16-е с акцентами.
$: stack(
     s("hh*8").gain(drums.hat.vol.mul("[1 .45 .7 .45]*2").mul(m0)).swingBy(0.16, 8),
     s("hh*8").gain(drums.hat.vol.mul("[1 .5]*4").mul(m1)).swingBy(0.12, 8),
     s("hh*4").gain(drums.hat.vol.mul("[1 .6 .4 .6]").mul(m2)),
     s("hh*16").gain(drums.hat.vol.mul("[1 .4 .6 .4]*4").mul(m3)),
   )
  .lpf(drums.hat.cut).hpf(320)
  .sometimesBy(0.25, (x) => x.ply(2))
  .lastOf(4, (x) => x.ply(2))
  .nudge(rand.mul(0.012).sub(0.006))
  .degradeBy(0.05)
  .filter(audible)

// ОТКРЫТЫЕ ХЭТЫ — на «и», это то, что раскачивает грув
$: stack(
     s("~ ~ ~ ~ ~ ~ oh ~ ~ ~ ~ ~ ~ ~ oh ~").gain(drums.ohat.vol.mul(m0)),
     s("~ ~ oh ~ ~ ~ ~ ~ ~ ~ oh ~ ~ ~ ~ ~").gain(drums.ohat.vol.mul(m1)),
     s("~ ~ ~ ~ ~ ~ ~ ~ oh ~ ~ ~ ~ ~ ~ ~").gain(drums.ohat.vol.mul(m2)),
     s("~ ~ oh ~ ~ ~ ~ ~ ~ ~ oh ~ ~ ~ ~ ~").gain(drums.ohat.vol.mul(m3)),
   )
  .lpf(drums.ohat.cut)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// RIM — 5 тактов, поэтому не совпадает с хэтами
$: stack(
     s("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~ ~ ~").gain(drums.rim.vol.mul(m0)),
     s("rim ~ ~ ~ ~ ~ rim ~ ~ ~ rim ~ ~ ~ ~ ~").gain(drums.rim.vol.mul(m1)),
     s("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~").gain(drums.rim.vol.mul(m2)),
     s("~ ~ rim ~ ~ ~ ~ ~ rim ~ ~ ~ ~ ~ rim ~").gain(drums.rim.vol.mul(m3).mul(0.8)),
   )
  .lpf(drums.rim.cut).hpf(500).lpq(2)
  .decay(0.05).sustain(0)
  .pan(rand.mul(1.4).sub(0.7))
  .delay(0.18).delaytime(0.375).delayfeedback(0.25)
  .filter(audible)

// ШЕЙКЕР — только в ломе, где 16-е хэты разрежены. В остальных режимах
// он садился бы ровно на хэты и слышался бы как двойной удар.
$: s("sh*16")
  .gain(drums.shaker.vol.mul(0.7).mul(m1))
  .lpf(drums.shaker.cut).hpf(2200)
  .decay(0.03).sustain(0)
  .degradeBy(0.35)
  .pan(rand.mul(0.8).add(0.1))
  .filter(audible)

// КИСТЬ — шумовой шорох по 8-м в джазе и полутемпе. Это не снейр:
// у кисти нет удара, есть движение.
$: s("pink")
  .struct("~ x ~ x ~ x ~ x ~ x ~ x ~ x ~")
  .gain(drums.brush.vol.mul(0.6).mul(m0).add(drums.brush.vol.mul(0.4).mul(m2)))
  .lpf(drums.brush.cut).hpf(1500)
  .decay(drums.brush.decay).sustain(0)
  .pan(rand.mul(0.8).sub(0.4))
  .room(0.2).roomsize(fx.reverb.size)
  .filter(audible)

// ТАРЕЛКА — шумом, раз в 8 тактов. Не зависит от того, какие сэмплы есть.
$: s("white")
  .gain(drums.crash.vol.mul("<1 0 0 0 0 0 0 0>"))
  .lpf(drums.crash.cut).hpf(4000)
  .attack(0.002).decay(1.2).sustain(0).release(0.6)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  БАС — контрабас и его призрак
// ══════════════════════════════════════════════════════════════════

// КОНТРАБАС — треугольник, а не пила: в джазе нужен деревянный тон,
// а не пила с резонансом. Слайд только на 4-й восьмой каждого такта
// (гейт без угловых скобок: `<...>` — альтернация и онемеет в константу).
$: note(BASS)
  .s("triangle")
  .glide(bass.upright.glide.mul("0 0 0 1 0 0 0 0"))
  .gain(bass.upright.vol)
  .lpf(bass.upright.cut).lpq(bass.upright.res).ftype("24db")
  .lpenv(bass.upright.env)
  .lpa(0.006).lpd(bass.upright.decay).lpsustain(0.2)
  .decay(0.18).sustain(0.55).release(0.12)
  .orbit(2)
  ._pianoroll()
  .filter(audible)

// БАС-ПРИЗРАК — высокие щипки в эхе. Не второй бас, а реплика.
$: note(GBASS)
  .s("square")
  .gain(bass.ghost.vol)
  .lpf(bass.ghost.cut).lpq(6)
  .decay(0.08).sustain(0)
  .delay(bass.ghost.echo).delaytime(0.375).delayfeedback(0.45)
  .pan(rand.mul(1).sub(0.5))
  .orbit(2)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ГАРМОНИЯ — два пэда, орган, Rhodes и духовой акцент
// ══════════════════════════════════════════════════════════════════

// ПЭД 0 — кварты без терций. Тембр — не sawtooth и не supersaw, а
// аддитивный: partials оставляет только нечётные гармоники. Полый,
// деревянный, «кларнетовый» стек.
$: note(PAD_A)
  .s("sawtooth").partials([1, 0, 0.5, 0, 0.3, 0, 0.16, 0, 0.08])
  .unison(3).detune(pads.pad.det)
  .gain(pads.pad.vol.mul(hA))
  .lpf(pads.pad.cut).lpq(pads.pad.q).ftype("24db")
  .lpdepth(pads.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.3)
  .attack(1.2).decay(1.4).sustain(0.85).release(2.4)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ПЭД 1 — те же корни, 9-е и 13-я. Другой тембр, а не только другая
// укладка: синус с partials — ровный тёплый стек, без пилы вообще.
$: note(PAD_B)
  .s("sine").partials([1, 0.55, 0.3, 0.16, 0.1, 0.06])
  .unison(2).detune(pads.pad.det.mul(0.8))
  .gain(pads.pad.vol.mul(hB))
  .lpf(pads.pad.cut.mul(1.2)).lpq(pads.pad.q.mul(0.8)).ftype("24db")
  .lpdepth(pads.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.22)
  .attack(1.0).decay(1.2).sustain(0.85).release(2.2)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ОРГАН — корень с квинтой, играет в обоих режимах. Держит «джазовую»
// середину, когда пэд ушёл в абстракцию.
$: note(ORGAN)
  .s("sine").partials([1, 0.3, 0.6, 0.15, 0.22, 0.08])
  .unison(2).detune(0.06)
  .gain(pads.organ.vol)
  .lpf(pads.organ.cut).lpq(1)
  .attack(0.4).decay(1).sustain(0.7).release(1.8)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// RHODES — короткий аккорд на 2 и 4. FM на синусе даёт «электрическое
// пиано»: не колокол (fmh 2.0), а тёплый деревянный удар (fmh 1.01).
$: note(KEYS)
  .s("sine").fm(pads.keys.fm).fmh(1.01)
  .gain(pads.keys.vol)
  .lpf(pads.keys.cut).lpq(2)
  .decay(pads.keys.decay).sustain(0).release(0.35)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.4, 0.6))
  ._pianoroll()
  .filter(audible)

// ДУХОВОЙ АКЦЕНТ — тот же аккорд, другой тембр. Играет только на 1-м
// и 5-м такте: `<1 0 0 0 1 0 0 0>` — это гейт на 8 тактов, а не ритм.
$: note(BRASS)
  .s("square").unison(2).detune(0.05)
  .vowel("<a o>")
  .gain(pads.stab.vol.mul("<1 0 0 0 1 0 0 0>"))
  .lpf(pads.stab.cut).lpq(4)
  .decay(pads.stab.decay).sustain(0).release(0.6)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  МЕЛОДИКА
// ══════════════════════════════════════════════════════════════════

// TIA — главный инструмент этого трека. Та же идея, что в 06:
// восходяще-нисходящая фигура 16-ми, фильтр медленно открывается
// (lpsync 0.125 = раз в 8 тактов), длинный дилей. Но ноты — из
// текущего аккорда, поэтому дрейфа «мимо» здесь нет.
$: note(TIA)
  .s("sawtooth").unison(2).detune(0.07)
  .gain(melody.tia.vol)
  .lpf(melody.tia.cut).lpq(melody.tia.res).ftype("24db")
  .lpenv(melody.tia.env)
  .lpa(0.004).lpd(0.16).lpsustain(0.3)
  .lpdepth(melody.tia.lfo).lpsync(0.125).lpdc(0)
  .decay(0.09).sustain(0.25).release(0.1)
  .delay(melody.tia.echo).delaytime(0.375).delayfeedback(0.45)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.35, 0.65))
  ._pianoroll()
  .filter(audible)

// МЕЛОДИЯ — вибры/электропиано. 8 тактов, дыры: нота появляется, а не
// заполняет такт. Это правило 12 (трэп) работает и в джазе.
$: note(MEL)
  .s("sine").fm(1.1).fmh(2.005)
  .gain(melody.mel.vol)
  .lpf(melody.mel.cut).lpq(2)
  .attack(0.002).decay(melody.mel.decay).sustain(0.05).release(0.4)
  .delay(melody.mel.echo).delaytime(0.375).delayfeedback(0.4)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.4, 0.6))
  .filter(audible)

// БУЛЬКИ — нота с падением внутри себя, высоко и редко
$: note(BUB)
  .s("sine").fm(0.7)
  .gain(melody.bub.vol)
  .lpf(melody.bub.cut).lpq(4)
  .decay(0.1).sustain(0).release(0.06)
  .delay(melody.bub.echo).delaytime(0.4375).delayfeedback(0.45)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ФАКТУРА
// ══════════════════════════════════════════════════════════════════

// БЛИПЫ — высокие точки. 3 такта, поэтому фраза не совпадает с
// гармонией. Выбор ноты — родным `|` в мини-нотации; часть съедается
// degradeBy, чтобы это были точки, а не арпеджио.
$: note("[f6|ab6|c6|eb6|g6|bb5]*8")
  .struct("~ x ~ ~ x ~ ~ ~")
  .s("sine")
  .gain(fx.blip.vol)
  .lpf(fx.blip.cut)
  .decay(0.04).sustain(0)
  .delay(fx.blip.delay).delaytime(fx.blip.time).delayfeedback(0.55)
  .pan(rand.mul(1.8).sub(0.9))
  .degradeBy(0.25)
  .filter(audible)

// ШУМОВОЙ СВИП — один раз в 16 тактов, чтобы не надоесть
$: s("white")
  .gain(fx.sweep.vol.mul("<0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0>"))
  .hpf(500).lpf(fx.sweep.cut)
  .attack(0.02).decay(1.8).sustain(0).release(0.5)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ШПАРГАЛКА НА НОЧЬ
// ══════════════════════════════════════════════════════════════════
//  Имена — пути по дереву: группа.инструмент.параметр.
//
//  пустота:       atmos.air.vol 0.12 + verb 0.45, дрон 0.14, винил 0.04
//  вход:          + drums.kick.vol 0.35 (mode 0) → bass.sub.vol 0.3
//  бас:           bass.upright.vol 0.6, cut 780 → 400 (глубже), 1200 (дерево)
//  свинг:         уже в хэтах (0.16); больше качает — подними 0.2
//  ритм:          drums.snare.vol 0.35, drums.hat.vol 0.35, drums.brush.vol 0.2
//  гармония:      pads.pad.vol 0.3, pads.organ.vol 0.25, pads.keys.vol 0.35
//  TIA:           melody.tia.vol 0.35 ← «всем приятное», cut открой до ~900
//  мелодия:       melody.mel.vol 0.3, melody.bub.vol 0.2
//  переключение:  harmony 0 ⇄ 1 — подхватится на границе 8 тактов
//  режимы:        mode 0 джаз / 1 лом / 2 полутемп / 3 ролл
//  злее:          pads.pad.cut 1300 → 3000, drums.clap.crush 13 → 8
// ══════════════════════════════════════════════════════════════════
