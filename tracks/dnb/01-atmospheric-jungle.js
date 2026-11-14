// ══════════════════════════════════════════════════════════════════
//  ATMOSPHERIC JUNGLE 01  ·  Strudel  ·  174 BPM  ·  LTJ Bukem / Aphrodite
//
//  Это не «ещё один dnb». Это две школы сразу:
//    · LTJ Bukem / Good Looking — барабаны на полном темпе, но смешаны
//      в середину; пады огромные и медленные (в 4 раза медленнее бита),
//      бас мелодический, а не просто низ; воздух, джаз, дымка.
//    · Aphrodite / jump-up — тяжёлый ментосм-бас, большие снейры,
//      «four on the floor» в дропе и рейвовый хувер.
//  Переключатель mode ведёт между ними: 0 ATMOS / 1 JUNGLE / 2 JUMP / 3 ROLL.
//
//  ── ЧТО ПРОЧИТАНО ВОВНЕ (не в моих прошлых треках) ──────────────
//  • LTJ Bukem: брейки в полный темп, но НЕ главные в миксе; пады
//    движутся в четверть скорости бита; бас — инструмент с фразировкой;
//    сэмплы из jazz fusion/soul, а не «цинтаты» (phreak.fm, разбор
//    Logical Progression).
//  • Liquid DnB: 170–174 BPM, чаще D minor / A minor / D Dorian; пады
//    HPF 200 Гц, Rhodes HPF 120 Гц, саб 100–200 Гц; dotted-8 delay;
//    аккорды Dm9 / Gm7 / Bbmaj9 / Cmaj7 (BeatKey liquid guide).
//  • Amen: оригинал ~136 BPM, в dnb растягивают до 160–180; ghost-снейры
//    на 2.5 и 4.5, ride на оффбитах, open hat на «и» 3-й в 4-м такте;
//    свинг 20–25%; не перехлёстывать chop'ом — пусть грув дышит
//    (lockah.net, amen break guide).
//  • Aphrodite / jump-up: ментосм/хувер-бас, дисторшн, большие снейры,
//    рейвовые стабы. Здесь это режим 2 + хур-сэмпл.
//
//  ── СЭМПЛЫ: ЧТО ИМЕННО ЗАГРУЖАЕТСЯ ─────────────────────────────
//  Маленькие, проверенные карты, а не «всё подряд»:
//    samples('github:yaxu/clean-breaks/main')
//      amen  — тот самый Amen Brother (The Winstons), полный брейк;
//      think — Think break (Lyn Collins) для второго слоя/филла;
//      apache — Apache (Incredible Bongo Band), если захочется третий.
//    samples('github:tidalcycles/Dirt-Samples')
//      amencutup — 32 нарезанных куска Amen (классический jungle-chop);
//      jungle    — готовый jungle-кит: kick/snare/hat/ride/perc;
//      jungbass  — глубокие jungle-сабы, в т.ч. mega_jungasubdown;
//      hoover    — рейвовые хуверы для Aphrodite-режима.
//  Эти имена есть в strudel.json обоих репозиториев; URL проверены.
//  В node (npm run verify) samples() нет — поэтому вызов под typeof.
//
//  ── ГАРМОНИЯ: D НАТУРАЛЬНЫЙ МИНОР, 8 ТАКТОВ ─────────────────────
//  Dm9 → Gm9 → Bbmaj9 → A7sus4 → Fmaj9 → C6/9 → Bbmaj9 → A7sus4.
//  Это классический liquid-вамп i–iv–bVI–V, только V взята как sus4
//  (a d e g), без c#: так в ладу нет лишней «доминантовой» остроты.
//  Все аккорды без пары e–bb (тритон), поэтому линии могут ходить
//  по ладу и не спорить с пэдом. Корни ниже — машинный маркер для
//  tools/tension.mjs.
//  @roots d g bb a f c bb a
//
//  ── РЕЖИМЫ ──────────────────────────────────────────────────────
//  УДАРНЫЕ (mode, 4): 0 ATMOS / 1 JUNGLE / 2 JUMP / 3 ROLL.
//  ГАРМОНИЯ (harmony, 2): 0 ATMOS-пады / 1 DARK-пады (суперпила).
//  mode и harmony — защёлки на 8 тактов. rave-слой (хувер) включается
//  режимом 2, отдельной ручки нет: в jump-up он часть формы.
//
//  ── СТАРТ ───────────────────────────────────────────────────────
//  Звучит сразу только атмосфера: air, wind, vinyl. Всё остальное в
//  нуле. Сначала поднимай paды и саб, потом amen, потом остальное.
// ══════════════════════════════════════════════════════════════════

const BPM = 174
setcpm(BPM / 4) // один цикл = один такт 4/4 (≈ 1.379 с)

// ══════════════════════════════════════════════════════════════════
//  СЭМПЛЫ
// ══════════════════════════════════════════════════════════════════
// В браузере загружаем две карты; в node samples() нет, и verify
// должен пройти без сети. Lazy loading: файлы качаются при первом ударе.
if (typeof samples === 'function') {
  samples('github:yaxu/clean-breaks/main')
  samples('github:tidalcycles/Dirt-Samples')
}

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
//  GLIDE — слайд от предыдущей ноты (Switch Angel)
// ══════════════════════════════════════════════════════════════════
// Нужен басу и ментосму: короткий съезд в следующую ноту, не портаменто.
// getFrequencyFromValue есть в редакторе, но не в node — фолбэк.
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
// @switches mode=atmos,jungle,jump,roll harmony=atmos,dark
const mode = slider(0, 0, 3, 1)
const m0 = mode.fmap((m) => (m === 0 ? 1 : 0))
const m1 = mode.fmap((m) => (m === 1 ? 1 : 0))
const m2 = mode.fmap((m) => (m === 2 ? 1 : 0))
const m3 = mode.fmap((m) => (m === 3 ? 1 : 0))
// amen-подложка живёт везде, кроме jump-up: в jump-up главный — кик.
const mBed = mode.fmap((m) => (m === 2 ? 0 : 1))
// chop и think — только jungle/roll.
const mChop = mode.fmap((m) => (m === 1 || m === 3 ? 1 : 0))

const harmony = slider(0, 0, 1, 1)
const hQ = harmony.seg(1 / 8)
const hA = hQ.fmap((h) => (h < 0.5 ? 1 : 0))
const hB = hQ.fmap((h) => (h < 0.5 ? 0 : 1))

// ══════════════════════════════════════════════════════════════════
//  ОБЩЕЕ
// ══════════════════════════════════════════════════════════════════
const verb = slider(0.55, 0, 1, 0.01)  // общий реверб (Bukem = много)
const duck = slider(0.7, 0, 1, 0.01)   // сайдчейн низа от бочки

// ══════════════════════════════════════════════════════════════════
//  ИНСТРУМЕНТЫ
// ══════════════════════════════════════════════════════════════════
// Панель читает эту структуру как есть: группа → инструмент → параметр.
// vol — левый столбец, остальное — правый. vol первым, cut сразу за ним.
const instruments = {
  // ── БРЕЙКИ ─────────────────────────────────────────────────────
  breaks: {
    name: 'Breaks',
    // Полный Amen: 2 такта, растянутые до темпа. Именно «подложка»:
    // громкость ниже кита, фильтр сверху, чтобы не спорил с мелодией.
    amen: {
      name: 'Amen',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(5200, 300, 16000, 100),
      hpf: slider(80, 20, 500, 10),
      crush: slider(16, 1, 16, 0.5),
      room: slider(0.18, 0, 1, 0.01),
    },
    // Chop: 32 куска Amen. Не «второй Amen», а рваная перкуссия поверх.
    chop: {
      name: 'Amen chop',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(9000, 500, 16000, 100),
      hpf: slider(120, 20, 800, 10),
    },
    // Think: второй классический брейк, только в roll/филле.
    think: {
      name: 'Think',
      vol: slider(0, 0, 0.8, 0.01),
      cut: slider(6000, 300, 16000, 100),
      hpf: slider(100, 20, 500, 10),
    },
  },

  // ── БАРАБАНЫ ───────────────────────────────────────────────────
  // Кит `jungle` из Dirt-Samples: kick1 = :5, snare1 = :11,
  // closed hh = :0, open hh = :7, ride = :10, perc = :8/:9, crash = :1.
  drums: {
    name: 'Drums',
    kick: {
      name: 'Jungle kick',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(900, 90, 5000, 10),
      shape: slider(0.5, 0, 0.95, 0.01),
      decay: slider(0.35, 0.1, 2, 0.01),
    },
    subkick: {
      name: 'Sub kick',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(180, 40, 800, 10),
      decay: slider(0.5, 0.1, 2, 0.01),
    },
    snare: {
      name: 'Jungle snare',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(5600, 800, 14000, 100),
      decay: slider(0.18, 0.03, 0.7, 0.01),
    },
    hat: {
      name: 'Jungle hats',
      vol: slider(0, 0, 0.9, 0.01),
      cut: slider(9000, 800, 16000, 100),
    },
    ohat: {
      name: 'Open hats',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(6200, 800, 16000, 100),
    },
    ride: {
      name: 'Ride',
      vol: slider(0, 0, 0.6, 0.01),
      cut: slider(8000, 800, 16000, 100),
    },
    perc: {
      name: 'Jungle perc',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(4000, 300, 14000, 100),
      echo: slider(0.2, 0, 0.8, 0.01),
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
    // Саб: одна длинная нота на такт, мелодически по корням.
    sub: {
      name: 'Sub',
      vol: slider(0, 0, 1.2, 0.01),
      cut: slider(120, 40, 400, 5),
      decay: slider(0.7, 0.1, 3, 0.01),
    },
    // Reese: две расстроенные пилы, низко и с drive. Характер, не саб.
    reese: {
      name: 'Reese',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(320, 80, 3000, 10),
      res: slider(8, 0, 26, 0.5),
      env: slider(2.4, 0, 8, 0.1),
      decay: slider(0.25, 0.05, 1.5, 0.01),
      drive: slider(1.4, 0.2, 2.6, 0.01),
      det: slider(0.16, 0.02, 0.6, 0.01),
      glide: slider(0.05, 0, 0.15, 0.001),
    },
    // Ментосм: jump-up-бас, только mode 2. Суперпила, питч-сброс,
    // дисторшн. Это уже не «глубокий бас», это характер Aphrodite.
    jump: {
      name: 'Mentasm',
      vol: slider(0, 0, 0.9, 0.01),
      cut: slider(900, 100, 5000, 10),
      res: slider(10, 0, 26, 0.5),
      drop: slider(7, 0, 12, 0.5),
      drive: slider(1.6, 0.2, 2.6, 0.01),
      dist: slider(0.35, 0, 0.9, 0.01),
      det: slider(0.18, 0.02, 0.6, 0.01),
    },
    // Sub drop: сэмпл jungbass (mega_jungasubdown) на входе jump-режима.
    drop: {
      name: 'Sub drop',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(160, 40, 800, 10),
    },
  },

  // ── ПЭДЫ ───────────────────────────────────────────────────────
  pads: {
    name: 'Pads',
    // ATMOS: огромный медленный пад. partials + unison + chorus +
    // hp/lp: он должен быть «туманом», а не пилой.
    pad: {
      name: 'Pad',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(1800, 80, 8000, 10),
      hpf: slider(200, 40, 800, 10),
      q: slider(1.4, 0, 20, 0.5),
      lfo: slider(0.8, 0, 6, 0.1),
      det: slider(0.12, 0, 0.6, 0.01),
    },
    // Rhodes: джазовая гармония в середине. HPF 120 — правило liquid,
    // чтобы не драться с сабом.
    rhodes: {
      name: 'Rhodes',
      vol: slider(0, 0, 0.8, 0.01),
      cut: slider(3200, 200, 12000, 20),
      hpf: slider(120, 40, 600, 10),
      fm: slider(0.8, 0, 4, 0.05),
      decay: slider(0.45, 0.05, 2, 0.01),
      echo: slider(0.3, 0, 0.9, 0.01),
    },
  },

  // ── МЕЛОДИЯ ────────────────────────────────────────────────────
  melody: {
    name: 'Melody',
    // Lead — «флейта/свисток» Bukem: синус+FM, мягкая атака, длинный
    // хвост, dotted-8 delay (0.1875 цикла = 3/16).
    lead: {
      name: 'Lead',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(4200, 300, 14000, 50),
      hpf: slider(150, 40, 1000, 10),
      decay: slider(0.5, 0.05, 2, 0.01),
      echo: slider(0.45, 0, 0.9, 0.01),
    },
    // Arp — высокий гипнотический рисунок, короткий и с дилеем.
    arp: {
      name: 'Arp',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(8000, 500, 16000, 100),
      hpf: slider(300, 80, 2000, 10),
      decay: slider(0.08, 0.02, 0.4, 0.01),
      echo: slider(0.4, 0, 0.9, 0.01),
    },
  },

  // ── ЭФФЕКТЫ ────────────────────────────────────────────────────
  fx: {
    name: 'FX',
    riser: {
      name: 'Riser',
      vol: slider(0, 0, 0.6, 0.01),
      cut: slider(5000, 200, 16000, 100),
    },
    impact: {
      name: 'Impact',
      vol: slider(0, 0, 0.7, 0.01),
    },
    // Хувер из Dirt-Samples: рейв-крик для Aphrodite-режима.
    hoover: {
      name: 'Hoover',
      vol: slider(0, 0, 0.6, 0.01),
      cut: slider(5000, 300, 14000, 50),
    },
    reverb: {
      name: 'Reverb',
      size: slider(12, 1, 20, 0.5),          // Bukem: большая комната
    },
  },

  // ── АТМОСФЕРА ──────────────────────────────────────────────────
  atmos: {
    name: 'Atmos',
    air: {
      name: 'Air',
      vol: slider(0.12, 0, 0.5, 0.01),
      cut: slider(700, 100, 8000, 20),
      lfo: slider(1.8, 0, 10, 0.5),
    },
    wind: {
      name: 'Wind',
      vol: slider(0.08, 0, 0.4, 0.01),
      cut: slider(900, 100, 6000, 20),
    },
    vinyl: {
      name: 'Vinyl',
      vol: slider(0.04, 0, 0.3, 0.01),
      cut: slider(2400, 300, 12000, 100),
    },
  },
}

const { breaks, drums, bass, pads, melody, fx, atmos } = instruments


// 🛑 НОЛЬ НА РУЧКЕ — это не бесплатно: событие с gain 0 всё равно строит
// узлы/worklet'ы. Поэтому каждая дорожка кончается `.filter(audible)`.
// Гейт стоит ПОСЛЕ визуализатора: ролл рисует паттерн до фильтра.
const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}


// ══════════════════════════════════════════════════════════════════
//  ФРАЗЫ
// ══════════════════════════════════════════════════════════════════
const phrase = (bars) => m('<' + bars.join(' ') + '>')

// Корни: Dm9 → Gm9 → Bb → A7sus → F → C → Bb → A7sus.
// Строка ниже — машинный маркер для tools/tension.mjs.
// @roots d g bb a f c bb a

// SUB — одна длинная нота на такт. Мелодический саб, а не статичный:
// он идёт по корням и держит низ под всем треком.
const SUB = phrase([
  '[d1]', '[g1]', '[bb1]', '[a1]',
  '[f1]', '[c2]', '[bb1]', '[a1]',
])

// PAD_A — ATMOS-укладки: Dm9, Gm9, Bbmaj9, A7sus4, Fmaj9, C6/9.
// Ни в одном аккорде нет пары e–bb, поэтому это не «грязный» джаз.
const PAD_A = phrase([
  '[d3,f3,a3,c4,e4]',
  '[g2,bb2,d3,f3,a3]',
  '[bb2,d3,f3,a3,c4]',
  '[a2,d3,e3,g3]',
  '[f3,a3,c4,e4,g4]',
  '[c3,e3,g3,a3,d4]',
  '[bb2,d3,f3,a3,c4]',
  '[a2,d3,e3,g3]',
])

// PAD_B — DARK: те же корни, квинты/октавы. Суперпиле не нужны
// джазовые терции: в jump-up аккорд — стена.
const PAD_B = phrase([
  '[d3,a3,d4]',
  '[g2,d3,g3]',
  '[bb2,f3,bb3]',
  '[a2,e3,a3]',
  '[f2,c3,f3]',
  '[c3,g3,c4]',
  '[bb2,f3,bb3]',
  '[a2,e3,a3]',
])

// REESE — мелодический низ: корень, квинта, терция, подход. 8 тактов,
// чтобы фраза не дрейфовала по гармонии. Без e на Gm/Bb и без bb на
// Dm/A/F/C: это единственная пара на тритон в D миноре.
const REESE = phrase([
  '[d2 ~ ~ a1 ~ f2 ~ c2]',
  '[g2 ~ ~ d2 ~ bb1 ~ f2]',
  '[bb1 ~ ~ f2 ~ d2 ~ c2]',
  '[a1 ~ ~ e2 ~ g1 ~ d2]',
  '[f2 ~ ~ c2 ~ a1 ~ g1]',
  '[c2 ~ ~ g1 ~ e2 ~ d2]',
  '[bb1 ~ ~ f2 ~ d2 ~ a1]',
  '[a1 ~ ~ e2 ~ g1 ~ d2]',
])

// MENTASM — Aphrodite-бас, только mode 2. Короткие ноты, питч-сброс,
// дисторшн. Это не «ещё один риф», а смена характера.
const MENTASM = phrase([
  '[d3 ~ d3 ~ f3 ~ a2 ~]',
  '[g2 ~ g2 ~ bb2 ~ d3 ~]',
  '[bb2 ~ bb2 ~ d3 ~ f3 ~]',
  '[a2 ~ a2 ~ c3 ~ e3 ~]',
  '[f2 ~ f2 ~ a2 ~ c3 ~]',
  '[c3 ~ c3 ~ e3 ~ g2 ~]',
  '[bb2 ~ bb2 ~ d3 ~ f3 ~]',
  '[a2 ~ a2 ~ c3 ~ e3 ~]',
])

// LEAD — гипнотическая линия Bukem: редкие ноты, большие паузы.
const LEAD = phrase([
  '[~ ~ a4 ~ ~ d5 ~ ~]',
  '[~ bb4 ~ ~ d5 ~ ~ ~]',
  '[~ f5 ~ ~ d5 ~ ~ ~]',
  '[~ e5 ~ ~ c5 ~ ~ ~]',
  '[~ ~ a4 ~ c5 ~ e5 ~]',
  '[~ g4 ~ ~ e5 ~ ~ ~]',
  '[~ f5 ~ ~ d5 ~ ~ ~]',
  '[~ e5 ~ ~ c5 ~ ~ ~]',
])

// ARP — высокий рисунок по тонам аккорда; паузы важнее плотности.
const ARP = phrase([
  '[~ d5 ~ f5 ~ a5 ~ c6]',
  '[~ d5 ~ g5 ~ bb5 ~ d6]',
  '[~ f5 ~ bb5 ~ d6 ~ f6]',
  '[~ e5 ~ a5 ~ d6 ~ e6]',
  '[~ c5 ~ f5 ~ a5 ~ c6]',
  '[~ e5 ~ g5 ~ c6 ~ e6]',
  '[~ f5 ~ bb5 ~ d6 ~ f6]',
  '[~ e5 ~ a5 ~ d6 ~ e6]',
])

// RHODES — короткие аккорды на «и» 1-й и 3-й доли. Это hallmark
// liquid dnb: джазовая гармония, но высоко и с дилеем.
const KEYS = phrase([
  '[~ [d3,f3,a3,c4] ~ ~ ~ [d3,f3,a3,c4] ~ ~]',
  '[~ [g3,d4,bb4] ~ ~ ~ [g3,d4,bb4] ~ ~]',
  '[~ [d4,f4,a4] ~ ~ ~ [d4,f4,a4] ~ ~]',
  '[~ [a3,d4,e4,g4] ~ ~ ~ [a3,d4,e4,g4] ~ ~]',
  '[~ [f3,a3,c4,e4] ~ ~ ~ [f3,a3,c4,e4] ~ ~]',
  '[~ [c4,e4,g4,a4] ~ ~ ~ [c4,e4,g4,a4] ~ ~]',
  '[~ [d4,f4,a4] ~ ~ ~ [d4,f4,a4] ~ ~]',
  '[~ [a3,d4,e4,g4] ~ ~ ~ [a3,d4,e4,g4] ~ ~]',
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

// ВЕТЕР — сэмпл wind из Dirt-Samples. Это не «ещё один шум»: у него
// движение, поэтому он живёт под падами, а не вместо них.
$: s("wind:0")
  .gain(atmos.wind.vol)
  .lpf(atmos.wind.cut).hpf(200)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(16).range(0.35, 0.65))
  .filter(audible)

// ВИНИЛ — 12 тактов на цикл, не совпадает ни с чем
$: s("crackle")
  .gain(atmos.vinyl.vol.mul("<1 1 .7 1 1 1 1 .8 1 1 1 1>"))
  .lpf(atmos.vinyl.cut).hpf(300)
  .room(0.2)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  БРЕЙКИ — Amen подложка и Amen chop
// ══════════════════════════════════════════════════════════════════

// AMEN — полный брейк, растянутый на 2 такта. Он НЕ главный в миксе:
// громкость ниже кита, срез сверху, лёгкий crush для «акаевского»
// характера. `loopAt(2)` подгоняет длину сэмпла под 2 цикла.
$: s("amen")
  .loopAt(2)
  .gain(breaks.amen.vol.mul(mBed))
  .hpf(breaks.amen.hpf).lpf(breaks.amen.cut)
  .crush(breaks.amen.crush)
  .room(breaks.amen.room).roomsize(fx.reverb.size)
  .filter(audible)

// AMEN CHOP — 32 нарезанных куска. Ритм взят из классического Tidal-
// примера `n "0 [1 5] 2*2 [3 4]"`; вторая строка — вариация. Это не
// второй Amen, а рваная перкуссия поверх: короткая, с паузами.
$: s("amencutup")
  .n("<[0 [1 5] 2*2 [3 4]] [1 [2 6] 3*2 [4 5]]>")
  .gain(breaks.chop.vol.mul(mChop))
  .hpf(breaks.chop.hpf).lpf(breaks.chop.cut)
  .sometimesBy(0.12, (x) => x.speed(-1))
  .room(0.2).roomsize(fx.reverb.size)
  .filter(audible)

// THINK — второй брейк только в ROLL. Он не спорит с Amen, потому что
// включается там, где Amen уже переходит в ролл/филл.
$: s("think")
  .loopAt(2)
  .gain(breaks.think.vol.mul(m3))
  .hpf(breaks.think.hpf).lpf(breaks.think.cut)
  .room(0.15).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  УДАРНЫЕ — jungle-кит, четыре режима
// ══════════════════════════════════════════════════════════════════

// JUNGLE KICK — кит `jungle`, вариант 5 (kick1). Громкость внутри
// веток: `.gain()` СТАВИТ громкость, общий gain стёр бы гейты режимов.
$: stack(
     s("jungle:5 ~ ~ ~ ~ ~ jungle:5 ~ ~ ~ ~ ~ ~ ~ ~ ~").gain(drums.kick.vol.mul(m0)),
     s("jungle:5 ~ ~ ~ jungle:5 ~ ~ ~ ~ ~ jungle:5 ~ ~ ~ ~ ~").gain(drums.kick.vol.mul(m1)),
     s("jungle:5 ~ ~ ~ jungle:5 ~ ~ ~ jungle:5 ~ ~ ~ jungle:5 ~ ~ ~").gain(drums.kick.vol.mul(m2)),
     s("jungle:5 ~ ~ jungle:5 ~ ~ jungle:5 ~ ~ ~ jungle:5 ~ ~ jungle:5 ~").gain(drums.kick.vol.mul(m3).mul(0.95)),
   )
  .lpf(drums.kick.cut).lpq(1)
  .shape(drums.kick.shape)
  .decay(drums.kick.decay).sustain(0).release(0.08)
  .duckorbit(2).duckdepth(duck).duckattack(0.02)
  .filter(audible)

// SUB KICK — обычный bd, опущенный вниз. Jungle-кит даёт характер,
// но не всегда даёт достаточный низ; этот слой даёт вес на 1-й доле.
$: s("bd")
  .struct("x ~ ~ ~ ~ ~ ~ ~")
  .speed(0.8)
  .gain(drums.subkick.vol)
  .lpf(drums.subkick.cut).lpq(1)
  .decay(drums.subkick.decay).sustain(0).release(0.1)
  .orbit(2)
  .filter(audible)

// JUNGLE SNARE — основной снейр :11, призраки :12. В ATMOS их меньше,
// в JUNGLE/ROLL — больше: это и есть «rolling» характер.
$: stack(
     s("~ ~ ~ ~ jungle:11 ~ ~ ~ ~ ~ ~ ~ jungle:11 ~ ~ ~").gain(drums.snare.vol.mul(m0)),
     s("~ ~ ~ ~ jungle:11 ~ ~ ~ ~ ~ ~ ~ jungle:11 ~ ~ ~").gain(drums.snare.vol.mul(m1)),
     s("~ ~ ~ ~ jungle:11 ~ ~ ~ ~ ~ ~ ~ jungle:11 ~ ~ ~").gain(drums.snare.vol.mul(m2).mul(1.05)),
     s("~ ~ ~ ~ jungle:11 ~ ~ ~ ~ ~ ~ ~ jungle:11 ~ ~ ~").gain(drums.snare.vol.mul(m3)),
     s("~ ~ ~ ~ ~ ~ jungle:12 ~ ~ ~ ~ ~ ~ ~ jungle:12 ~").gain(drums.snare.vol.mul(m1).mul(0.25)),
     s("~ ~ ~ ~ ~ ~ jungle:12 ~ ~ ~ ~ ~ ~ ~ jungle:12 ~").gain(drums.snare.vol.mul(m3).mul(0.3)),
   )
  .lpf(drums.snare.cut).hpf(180)
  .decay(drums.snare.decay).sustain(0).release(0.08)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// SNARE ROLL — 32-е на последнюю долю каждого 4-го такта в ROLL.
$: s("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ [jungle:12*2] [jungle:12*2] [jungle:12*2] [jungle:12*2]")
  .gain(drums.snare.vol.mul(m3).mul("<0 0 0 1>").mul(0.5))
  .lpf(drums.snare.cut.mul(1.2)).hpf(200)
  .decay(0.04).sustain(0)
  .pan(rand.mul(0.8).sub(0.4))
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .filter(audible)

// JUNGLE HATS — 16-е с акцентами. В ATMOS — 8-е и свинг 0.2 (20%),
// в JUNGLE/ROLL — 16-е. Свинг только на восьмых: 16-е сами по себе рваные.
$: stack(
     s("jungle:0*8").gain(drums.hat.vol.mul("[1 .4 .7 .4]*2").mul(m0)).swingBy(0.2, 8),
     s("jungle:0*16").gain(drums.hat.vol.mul("[1 .35 .6 .35]*4").mul(m1)),
     s("jungle:0*8").gain(drums.hat.vol.mul("[1 .5]*4").mul(m2)),
     s("jungle:0*16").gain(drums.hat.vol.mul("[1 .3 .55 .3 .75 .3 .55 .3]*2").mul(m3)),
   )
  .lpf(drums.hat.cut).hpf(400)
  .sometimesBy(0.12, (x) => x.ply(2))
  .lastOf(4, (x) => x.ply(2))
  .degradeBy(0.04)
  .filter(audible)

// RIDE — на оффбитах, как в оригинальном Amen. Это «шиммер» сверху,
// поэтому громкость низкая: ride не должен перекрывать hats.
$: stack(
     s("~ ~ jungle:10 ~ ~ ~ jungle:10 ~ ~ ~ jungle:10 ~ ~ ~ jungle:10 ~").gain(drums.ride.vol.mul(m0).mul(0.6)),
     s("~ ~ jungle:10 ~ ~ ~ jungle:10 ~ ~ ~ jungle:10 ~ ~ ~ jungle:10 ~").gain(drums.ride.vol.mul(m1).mul(0.5)),
     s("~ ~ jungle:10 ~ ~ ~ jungle:10 ~ ~ ~ jungle:10 ~ ~ ~ jungle:10 ~").gain(drums.ride.vol.mul(m3).mul(0.5)),
   )
  .lpf(drums.ride.cut).hpf(1200)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// OPEN HAT — «и» 3-й доли; в ROLL и JUNGLE. Это тот самый акцент,
// который в Amen стоит на «and» of 3.
$: stack(
     s("~ ~ ~ ~ ~ ~ jungle:7 ~ ~ ~ ~ ~ ~ ~ ~ ~").gain(drums.ohat.vol.mul(m1)),
     s("~ ~ ~ ~ ~ ~ jungle:7 ~ ~ ~ ~ ~ ~ ~ ~ ~").gain(drums.ohat.vol.mul(m3).mul(0.9)),
   )
  .lpf(drums.ohat.cut)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// PERC — jungle perc :8/:9 с дилеем. 5 тактов, поэтому не совпадает
// с хэтами и снейром.
$: stack(
     s("~ ~ jungle:8 ~ ~ ~ ~ ~ ~ ~ jungle:9 ~ ~ ~ ~ ~").gain(drums.perc.vol.mul(m0).mul(0.5)),
     s("jungle:8 ~ ~ ~ ~ ~ jungle:9 ~ ~ ~ ~ ~ jungle:8 ~ ~ ~").gain(drums.perc.vol.mul(m1)),
     s("~ ~ ~ jungle:9 ~ ~ ~ ~ jungle:8 ~ ~ ~ ~ ~ jungle:9 ~").gain(drums.perc.vol.mul(m2)),
     s("jungle:8 ~ ~ jungle:9 ~ ~ jungle:8 ~ ~ ~ jungle:9 ~ ~ jungle:8 ~").gain(drums.perc.vol.mul(m3)),
   )
  .lpf(drums.perc.cut).hpf(400).lpq(2)
  .decay(0.06).sustain(0)
  .pan(rand.mul(1.4).sub(0.7))
  .delay(drums.perc.echo).delaytime(0.1875).delayfeedback(0.3)
  .filter(audible)

// CRASH — jungle crash :1, раз в 8 тактов
$: s("jungle:1")
  .gain(drums.crash.vol.mul("<1 0 0 0 0 0 0 0>"))
  .lpf(drums.crash.cut).hpf(2000)
  .decay(0.8).sustain(0)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  БАС — глубокий, мелодический, и отдельно — Aphrodite
// ══════════════════════════════════════════════════════════════════

// SUB — синус, одна длинная нота на такт. Это не «саб под бочкой»,
// а мелодическая линия по корням: D–G–Bb–A–F–C. Срез 120 Гц, чтобы
// не лезть в середину к Reese.
$: note(SUB)
  .s("sine")
  .gain(bass.sub.vol)
  .lpf(bass.sub.cut).lpq(1)
  .shape(0.25)
  .attack(0.004).decay(bass.sub.decay).sustain(0.7).release(0.2)
  .orbit(2)
  ._pianoroll()
  .filter(audible)

// REESE — две расстроенные пилы, низко, с drive фильтра. Это характер
// и «шершавость», а не второй саб. Glide только на 4-й восьмой.
$: note(REESE)
  .s("sawtooth").unison(2).detune(bass.reese.det)
  .glide(bass.reese.glide.mul("0 0 0 1 0 0 0 0"))
  .gain(bass.reese.vol)
  .lpf(bass.reese.cut).lpq(bass.reese.res).ftype("ladder").drive(bass.reese.drive)
  .lpenv(bass.reese.env)
  .lpa(0.006).lpd(bass.reese.decay).lpsustain(0.3)
  .decay(0.22).sustain(0.7).release(0.1)
  .orbit(2)
  .filter(audible)

// MENTASM — Aphrodite/jump-up. Только mode 2: суперпила, питч-сброс,
// дисторшн и ladder. Это уже не «глубокий бас», это крик.
$: note(MENTASM)
  .s("supersaw").unison(4).detune(bass.jump.det)
  .penv(bass.jump.drop.mul(-1)).panchor(1).pattack(0.005).pdecay(0.12).psustain(0.2)
  .gain(bass.jump.vol.mul(m2))
  .lpf(bass.jump.cut).lpq(bass.jump.res).ftype("ladder").drive(bass.jump.drive)
  .lpenv(2.2)
  .lpa(0.004).lpd(0.16).lpsustain(0.2)
  .shape(0.3)
  .distort(bass.jump.dist).distortvol(0.5)
  .decay(0.18).sustain(0.4).release(0.1)
  .orbit(2)
  .filter(audible)

// SUB DROP — сэмпл jungbass:10 (mega_jungasubdown). На входе jump-режима,
// раз в 8 тактов. Это не нота, а событие: «ныряние» в низ.
$: s("jungbass:10")
  .gain(bass.drop.vol.mul(m2).mul("<1 0 0 0 0 0 0 0>"))
  .lpf(bass.drop.cut)
  .room(0.2).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ГАРМОНИЯ — пады и Rhodes
// ══════════════════════════════════════════════════════════════════

// PAD 0 — ATMOS. Аддитивный синтез (partials), унисон, chorus,
// HPF 200 (правило liquid: пад не должен лезть в саб). Атака 2.5 с,
// release 6 с: пад движется в 4 раза медленнее барабанов.
$: note(PAD_A)
  .s("sawtooth").partials([1, 0.4, 0.2, 0.1, 0.05])
  .unison(4).detune(pads.pad.det)
  .gain(pads.pad.vol.mul(hA))
  .lpf(pads.pad.cut).hpf(pads.pad.hpf).lpq(pads.pad.q).ftype("24db")
  .lpdepth(pads.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.45)
  .attack(2.5).decay(2).sustain(0.85).release(6)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// PAD 1 — DARK. Те же корни, суперпила. Короткая атака: это уже не
// туман, а стена для jump-up.
$: note(PAD_B)
  .s("supersaw").unison(5).detune(pads.pad.det.mul(1.6))
  .gain(pads.pad.vol.mul(hB))
  .lpf(pads.pad.cut.mul(0.8)).hpf(pads.pad.hpf).lpq(pads.pad.q.mul(0.7))
  .lpdepth(pads.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.35)
  .attack(0.4).decay(1).sustain(0.85).release(2)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// RHODES — джазовая гармония в середине. FM на синусе, HPF 120,
// dotted-8 delay (0.1875 цикла), длинный реверб. Это hallmark liquid.
$: note(KEYS)
  .s("sine").fm(pads.rhodes.fm).fmh(1.01)
  .gain(pads.rhodes.vol)
  .lpf(pads.rhodes.cut).hpf(pads.rhodes.hpf).lpq(2)
  .decay(pads.rhodes.decay).sustain(0).release(0.5)
  .delay(pads.rhodes.echo).delaytime(0.1875).delayfeedback(0.35)
  .room(verb).roomsize(fx.reverb.size)
  .pan(rand.mul(0.6).sub(0.3))
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  МЕЛОДИЯ — гипнотический lead и arp
// ══════════════════════════════════════════════════════════════════

// LEAD — «флейта» Bukem: синус+FM, мягкая атака, большой хвост.
// Ноты редкие: в атмосферном dnb важна пауза, а не плотность.
$: note(LEAD)
  .s("sine").fm(0.6).fmh(2.005)
  .gain(melody.lead.vol)
  .lpf(melody.lead.cut).hpf(melody.lead.hpf).lpq(2)
  .attack(0.08).decay(melody.lead.decay).sustain(0.15).release(1.2)
  .delay(melody.lead.echo).delaytime(0.1875).delayfeedback(0.4)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.35, 0.65))
  ._pianoroll()
  .filter(audible)

// ARP — высокий рисунок по аккорду. Короткий, с паузами и дилеем:
// это искра, а не вторая мелодия.
$: note(ARP)
  .s("triangle")
  .gain(melody.arp.vol)
  .lpf(melody.arp.cut).hpf(melody.arp.hpf).lpq(2)
  .decay(melody.arp.decay).sustain(0).release(0.1)
  .delay(melody.arp.echo).delaytime(0.1875).delayfeedback(0.35)
  .room(verb).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.3, 0.7))
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ЭФФЕКТЫ
// ══════════════════════════════════════════════════════════════════

// РАЙЗЕР — раз в 8 тактов, срез ползёт вверх
$: s("white")
  .gain(fx.riser.vol.mul("<0 0 0 0 0 0 0 1>"))
  .lpf(sine.range(300, fx.riser.cut).slow(8)).lpq(8)
  .attack(1.2).decay(0.4).sustain(0.7).release(0.3)
  .pan(sine.slow(16).range(0.2, 0.8))
  .filter(audible)

// ИМПАКТ — низкий синус, раз в 8 тактов. Точка, в которую приходит трек.
$: note("d2")
  .s("sine")
  .gain(fx.impact.vol.mul("<1 0 0 0 0 0 0 0>"))
  .lpf(90)
  .attack(0.002).decay(1.8).sustain(0).release(0.8)
  .room(0.4).roomsize(fx.reverb.size)
  .filter(audible)

// ХУВЕР — рейв-крик из Dirt-Samples, только mode 2 и раз в 8 тактов.
// Это Aphrodite-краска: не «ещё один бас», а сигнал смены характера.
$: s("hoover:0")
  .gain(fx.hoover.vol.mul(m2).mul("<1 0 0 0 0 0 0 0>"))
  .lpf(fx.hoover.cut).hpf(200)
  .room(0.4).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ШПАРГАЛКА НА НОЧЬ
// ══════════════════════════════════════════════════════════════════
//  Имена — пути по дереву: группа.инструмент.параметр.
//
//  пустота:       atmos.air 0.12 + wind 0.08 + vinyl 0.04, verb 0.7
//  вход:          pads.pad.vol 0.3, pads.rhodes.vol 0.25, bass.sub.vol 0.5
//  amen:          breaks.amen.vol 0.35, cut 5200 (открой до 12000 — ярче)
//  атмосфера:     mode 0; melody.lead.vol 0.35, melody.arp.vol 0.2
//  джангл:        mode 1; breaks.chop.vol 0.35, drums.snare.vol 0.5,
//                 drums.hat.vol 0.35, bass.reese.vol 0.5
//  jump-up:       mode 2; harmony 1; bass.jump.vol 0.5, fx.hoover.vol 0.3,
//                 bass.drop.vol 0.4
//  ролл:          mode 3; breaks.think.vol 0.3, drums.ohat.vol 0.25
//  бас:           bass.sub.cut 120 (не выше 200), reese.cut 320 → 600
//  злее:          bass.jump.drive 1.6 → 2.4, bass.jump.dist 0.35 → 0.7
//  мягче:         verb 0.75, pads.rhodes.hpf 120, pads.pad.hpf 200
//  ровнее:        breaks.amen.crush 16 (чисто) → 10 (акай-грязь)
// ══════════════════════════════════════════════════════════════════
