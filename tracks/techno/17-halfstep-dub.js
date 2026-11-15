// ══════════════════════════════════════════════════════════════════
//  HALFSTEP DUB 17  ·  Strudel  ·  104 BPM  ·  Burial-leaning dub
//
//  Не версия 16 и не «ещё один даб». Это отдельный характер: медленнее,
//  тягучее, с половинным грувом и большим количеством воздуха. Ритм —
//  не четыре в пол, а halfstep/two-step: кик на 1 (иногда с затяжным
//  пикапом), снейр на 3, шуршащие 16-е хэты со свингом. Это ближе к
//  Burial / Hyperdub, чем к Basic Channel, но гармония и дилей остаются
//  дабовыми.
//
//  ── ЧТО ИМЕННО ДРУГОЕ ───────────────────────────────────────────
//  • Темп 104 BPM вместо 120: медленно и тягуче.
//  • Ритм halfstep, а не 4/4: кик/снейр/шуршащие хэты.
//  • Пэд не saw/triangle-стек, а вокальный: formant-фильтр `vowel`
//    медленно ходит между «a» и «o». Второй пэд — высокий призрак.
//  • Бас: саб ≤80 + отдельный шершавый growl-слой с медленным LFO.
//    Это сознательное исключение из правила «бас ≤80»: growl — не саб,
//    а гудящая середина. Саб при этом остаётся ниже 80.
//  • Moog: редкая одиночная нота, много воздуха, длинный release.
//    По умолчанию выключен — это краска, а не лид.
//
//  ── ГАРМОНИЯ ────────────────────────────────────────────────────
//  8 тактов: Dm9 (1–4) → Bbmaj9 (5–8). Корни: d d d d bb bb bb bb.
//  Dm9 = d f a c e; Bbmaj9 = bb d f a c. Bb — это bVI, а не bII:
//  другой сдвиг, более «киношный» и менее знакомый по 16. Оба аккорда
//  делят d/f/a/c, поэтому переход не ломает воздух. В басу и стабе
//  на Bb-тактах нет e, а на D-тактах нет bb — так мы не ловим тритон
//  e–bb, который живёт в дорийском/натуральном миноре.
//  @roots d d d d bb bb bb bb
//
//  ── РЕЖИМЫ ──────────────────────────────────────────────────────
//  mode:     0 HALF / 1 DRAG / 2 STEP / 3 STRIP.
//            HALF — основной halfstep; DRAG — почти без хэтов, только
//            кик и снейр; STEP — более плотный two-step с шейкером;
//            STRIP — один кик, rim и клики.
//  harmony:  0 DARK (вокальный пэд) / 1 GHOST (высокий призрак).
//  Обе ручки — защёлки на 8 тактов.
//
//  ── СТАРТ ──────────────────────────────────────────────────────
//  Звучит только атмосфера: винил, воздух, ветер. Всё остальное в нуле.
//  Сначала подними кик и саб, потом growl, стаб, пэд и в последнюю
//  очередь Moog. Growl — по вкусу: это грязь, а не фундамент.
// ══════════════════════════════════════════════════════════════════

const BPM = 104
setcpm(BPM / 4) // один цикл = один такт 4/4 (≈ 2.31 с)

// ══════════════════════════════════════════════════════════════════
//  СЭМПЛЫ
// ══════════════════════════════════════════════════════════════════
// uzu — кик/снейр/хэты/rim/шейкер; Dirt-Samples — wind и click.
if (typeof samples === 'function') {
  samples('github:tidalcycles/uzu-drumkit')
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
//  ПЕРЕКЛЮЧАТЕЛИ
// ══════════════════════════════════════════════════════════════════
// @switches mode=half,drag,step,strip harmony=dark,ghost
const mode = slider(0, 0, 3, 1)
const m0 = mode.fmap((m) => (m === 0 ? 1 : 0))
const m1 = mode.fmap((m) => (m === 1 ? 1 : 0))
const m2 = mode.fmap((m) => (m === 2 ? 1 : 0))
const m3 = mode.fmap((m) => (m === 3 ? 1 : 0))

const harmony = slider(0, 0, 1, 1)
const hQ = harmony.seg(1 / 8)
const hA = hQ.fmap((h) => (h < 0.5 ? 1 : 0))
const hB = hQ.fmap((h) => (h < 0.5 ? 0 : 1))

// ══════════════════════════════════════════════════════════════════
//  ОБЩЕЕ
// ══════════════════════════════════════════════════════════════════
const verb = slider(0.78, 0, 1, 0.01) // большой тёмный реверб

// ══════════════════════════════════════════════════════════════════
//  ИНСТРУМЕНТЫ
// ══════════════════════════════════════════════════════════════════
const instruments = {
  // ── АТМОСФЕРА ──────────────────────────────────────────────────
  atmos: {
    name: 'Atmos',
    hiss: {
      name: 'Vinyl',
      vol: slider(0.05, 0, 0.3, 0.01),
      cut: slider(3200, 200, 10000, 20),
      hpf: slider(80, 20, 600, 10),
    },
    air: {
      name: 'Air',
      vol: slider(0.03, 0, 0.3, 0.01),
      cut: slider(450, 100, 5000, 20),
      lfo: slider(0.7, 0, 6, 0.1),
    },
    field: {
      name: 'Field',
      vol: slider(0.035, 0, 0.3, 0.01),
      cut: slider(650, 100, 5000, 20),
    },
  },

  // ── БАРАБАНЫ ───────────────────────────────────────────────────
  drums: {
    name: 'Drums',
    // Кик глухой, с длинным хвостом: на 104 BPM он должен тянуться.
    kick: {
      name: 'Muted kick',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(240, 80, 700, 5),
      shape: slider(0.32, 0, 0.8, 0.01),
      decay: slider(0.55, 0.1, 1.6, 0.01),
    },
    // Снейр на 3 — это halfstep, а не 2/4-поп-бэкбит.
    snare: {
      name: 'Snare',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(2800, 400, 10000, 50),
      decay: slider(0.18, 0.03, 0.8, 0.01),
      room: slider(0.4, 0, 1, 0.01),
    },
    // Шуршащие 16-е со свингом. Не «хэт на каждой доле», а пыль.
    hat: {
      name: 'Shuffled hats',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(6500, 800, 14000, 50),
      swing: slider(0.12, 0, 0.3, 0.01),
      decay: slider(0.06, 0.02, 0.4, 0.01),
    },
    open: {
      name: 'Open hat',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(6000, 800, 12000, 50),
      decay: slider(0.2, 0.03, 0.8, 0.01),
    },
    rim: {
      name: 'Rim',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(4200, 400, 12000, 50),
      decay: slider(0.05, 0.02, 0.3, 0.01),
      echo: slider(0.25, 0, 0.8, 0.01),
    },
    shaker: {
      name: 'Shaker',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(7000, 800, 14000, 100),
    },
    click: {
      name: 'Clicks',
      vol: slider(0, 0, 0.4, 0.01),
      cut: slider(9000, 1000, 16000, 100),
      echo: slider(0.3, 0, 0.8, 0.01),
    },
  },

  // ── БАС ────────────────────────────────────────────────────────
  bass: {
    name: 'Bass',
    // SUB — синус, только низ. Срез max 80 (правило проекта).
    sub: {
      name: 'Sub ≤80',
      vol: slider(0, 0, 1.1, 0.01),
      cut: slider(70, 40, 80, 1),
      decay: slider(1.3, 0.2, 3, 0.01),
    },
    // GROWL — шершавая середина. Это осознанное исключение из «≤80»:
    // это не саб, а гудящий слой с медленным LFO. Срез можно открыть
    // до 1000, но по умолчанию он низкий и тёмный.
    growl: {
      name: 'Growl (mid)',
      vol: slider(0, 0, 0.8, 0.01),
      cut: slider(360, 100, 1000, 5),
      q: slider(7, 0, 18, 0.5),
      lfo: slider(0.55, 0, 4, 0.05),
      sync: slider(0.5, 0.0625, 2, 0.0625),
      grit: slider(0.28, 0, 0.8, 0.01),
      decay: slider(0.9, 0.1, 2.5, 0.01),
    },
  },

  // ── АККОРДЫ ────────────────────────────────────────────────────
  chords: {
    name: 'Chords',
    // PAD — вокальный: formant-фильтр `vowel` медленно ходит a↔o.
    // Долгая атака, низкий срез, chorus. Это фон, а не аккомпанемент.
    pad: {
      name: 'Vowel pad',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(850, 80, 5000, 10),
      hpf: slider(100, 20, 600, 10),
      q: slider(2.2, 0, 20, 0.5),
      lfo: slider(0.35, 0, 6, 0.05),
      det: slider(0.09, 0, 0.4, 0.01),
    },
    // STAB — редкий короткий аккорд; дальше его растягивает дилей.
    stab: {
      name: 'Dub stab',
      vol: slider(0, 0, 0.8, 0.01),
      cut: slider(950, 100, 6000, 10),
      res: slider(4.5, 0, 18, 0.5),
      decay: slider(0.5, 0.05, 1.8, 0.01),
      room: slider(0.5, 0, 1, 0.01),
    },
  },

  // ── MOOG ───────────────────────────────────────────────────────
  // Одна нота раз в два такта, длинный release, много дилея.
  // По умолчанию 0: это краска, которую добавляют руками.
  moog: {
    name: 'Moog',
    vol: slider(0, 0, 0.5, 0.01),
    cut: slider(700, 100, 4000, 10),
    q: slider(5, 0, 18, 0.5),
    det: slider(0.05, 0, 0.3, 0.01),
    decay: slider(1.8, 0.2, 4, 0.01),
  },

  // ── ЭФФЕКТЫ ────────────────────────────────────────────────────
  fx: {
    name: 'FX',
    dub: {
      name: 'Dub delay',
      send: slider(0.6, 0, 1, 0.01),
      time: slider(0.375, 0.0625, 0.75, 0.0625),
      feedback: slider(0.6, 0, 0.85, 0.01),
    },
    reverb: {
      name: 'Reverb',
      size: slider(16, 1, 20, 0.5),
    },
  },
}

const { atmos, drums, bass, chords, moog, fx } = instruments

const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}

// ══════════════════════════════════════════════════════════════════
//  ФРАЗЫ
// ══════════════════════════════════════════════════════════════════
const phrase = (bars) => m('<' + bars.join(' ') + '>')

// Корни: Dm9 (1–4), Bbmaj9 (5–8). Строка ниже — маркер для tension.
// @roots d d d d bb bb bb bb

// ROOT — саб по корням, одна нота на такт.
const ROOT = phrase([
  '[d1]', '[d1]', '[d1]', '[d1]',
  '[bb1]', '[bb1]', '[bb1]', '[bb1]',
])

// GROWL — не проход по тонам, а редкая фраза с паузами: квинта,
// b3, b7, 11-я и A-педаль под Bb. Всё это — шершавая середина,
// а не мелодия. На Bb-тактах нет e, на D-тактах нет bb.
const GROWL = phrase([
  '[d2 ~ ~ ~ ~ ~ a1 ~]',
  '[~ ~ f2 ~ ~ ~ ~ ~]',
  '[d2 ~ ~ ~ c2 ~ ~ ~]',
  '[~ ~ ~ ~ ~ g1 ~ ~]',
  '[bb1 ~ ~ ~ ~ ~ f2 ~]',
  '[~ ~ d2 ~ ~ ~ ~ ~]',
  '[bb1 ~ ~ ~ a1 ~ ~ ~]',
  '[~ ~ ~ ~ ~ f2 ~ ~]',
])

// PAD_A — DARK: вокальная укладка, 9-я наверху.
const PAD_A = phrase([
  '[d3,f3,a3,c4,e4]',
  '[d3,f3,a3,c4,e4]',
  '[d3,f3,a3,c4,e4]',
  '[d3,f3,a3,c4,e4]',
  '[bb2,d3,f3,c4,a4]',
  '[bb2,d3,f3,c4,a4]',
  '[bb2,d3,f3,c4,a4]',
  '[bb2,d3,f3,c4,a4]',
])

// PAD_B — GHOST: открытые квинты и 9-е без терций. Не второй аккорд,
// а другой воздух над тем же полем.
const PAD_B = phrase([
  '[d3,a3,e4]',
  '[d3,a3,e4]',
  '[d3,a3,e4]',
  '[d3,a3,e4]',
  '[bb3,f4,c5]',
  '[bb3,f4,c5]',
  '[bb3,f4,c5]',
  '[bb3,f4,c5]',
])

// STAB — один короткий аккорд раз в два такта. Пустые такты — это
// не ошибка: эхо и пауза здесь важнее события.
const STAB = phrase([
  '[~ ~ ~ ~ [d3,f3,a3,c4] ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ [d3,f3,a3,c4] ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ [bb3,d4,f4,a4] ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ [bb3,d4,f4,a4] ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~]',
])

// MOOG — сигнал, а не мелодия: одна нота на последнюю восьмую
// каждого второго такта. Дальше её растягивают delay и release.
const MOOG = phrase([
  '[~ ~ ~ ~ ~ ~ ~ d3]',
  '[~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ f3 ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ bb2]',
  '[~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ d3 ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~]',
])

// ══════════════════════════════════════════════════════════════════
//  АТМОСФЕРА — звучит с первого нажатия
// ══════════════════════════════════════════════════════════════════

// ВИНИЛ — не эффект, а тело. Без него стаб звучит как MIDI.
$: s("crackle")
  .gain(atmos.hiss.vol.mul("<1 .75 1 .9 .8 1 .85 1 1 .8 .95 1 .9 .75 1 .85>"))
  .lpf(atmos.hiss.cut).hpf(atmos.hiss.hpf)
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .filter(audible)

// ВОЗДУХ — очень тихий шум, срез дышит медленно.
$: s("pink")
  .gain(atmos.air.vol)
  .lpf(atmos.air.cut).hpf(150).lpq(0.7)
  .lpdepth(atmos.air.lfo).lpsync(0.125).lpdc(0)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ПОЛЕ — wind из Dirt-Samples, растянутый на 8 тактов. Далёкий
// пейзаж; панорама едет очень медленно.
$: s("wind:0")
  .loopAt(8)
  .gain(atmos.field.vol)
  .lpf(atmos.field.cut).hpf(200)
  .room(verb.mul(0.7)).roomsize(fx.reverb.size)
  .pan(sine.slow(64).range(0.3, 0.7))
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  БАРАБАНЫ — halfstep, а не четыре в пол
// ══════════════════════════════════════════════════════════════════

// KICK — 1 и пикап; в STEP ещё и 3.5. В DRAG/STRIP только 1.
$: stack(
     s("bd").struct("x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x").gain(drums.kick.vol.mul(m0)),
     s("bd").struct("x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~").gain(drums.kick.vol.mul(m1)),
     s("bd").struct("x ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~").gain(drums.kick.vol.mul(m2)),
     s("bd").struct("x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x").gain(drums.kick.vol.mul(m3)),
   )
  .lpf(drums.kick.cut).lpq(1)
  .shape(drums.kick.shape)
  .decay(drums.kick.decay).sustain(0).release(0.12)
  .filter(audible)

// SNARE — на 3 (halfstep). В STEP ещё призрак на «и» 2-й.
$: stack(
     s("sd").struct("~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~").gain(drums.snare.vol.mul(m0)),
     s("sd").struct("~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ x").gain(drums.snare.vol.mul(m1)),
     s("sd").struct("~ ~ ~ ~ ~ ~ x ~ x ~ ~ ~ ~ ~ ~ ~").gain(drums.snare.vol.mul(m2)),
   )
  .lpf(drums.snare.cut).hpf(180).lpq(1.5)
  .decay(drums.snare.decay).sustain(0)
  .room(drums.snare.room.mul(verb)).roomsize(fx.reverb.size)
  .filter(audible)

// HATS — шуршащие 16-е со свингом. В DRAG/STRIP тихо: там работают
// пустота, rim и клики.
$: stack(
     s("hh*16").swingBy(drums.hat.swing, 8)
       .gain(drums.hat.vol.mul(m0).mul("<0.35 0.12 0.22 0.1 0.3 0.12 0.18 0.08 0.32 0.12 0.2 0.1 0.28 0.12 0.16 0.07>")),
     s("hh*16").swingBy(drums.hat.swing.mul(0.7), 8)
       .gain(drums.hat.vol.mul(m2).mul("<0.3 0.1 0.2 0.08 0.28 0.1 0.16 0.07 0.3 0.1 0.18 0.08 0.26 0.1 0.14 0.06>")),
   )
  .lpf(drums.hat.cut).hpf(600).lpq(1)
  .decay(drums.hat.decay).sustain(0)
  .delay(fx.dub.send.mul(0.2)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback.mul(0.4))
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .filter(audible)

// OPEN HAT — только HALF/STEP, на «и» 2-й и 4-й.
$: s("oh")
  .struct("~ ~ ~ ~ ~ ~ oh ~ ~ ~ ~ ~ ~ ~ oh ~")
  .gain(drums.open.vol.mul(m0.add(m2)))
  .lpf(drums.open.cut).hpf(500)
  .decay(drums.open.decay).sustain(0)
  .delay(fx.dub.send.mul(0.3)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback.mul(0.5))
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .filter(audible)

// RIM — сухой деревянный призрак. В каждом режиме свой рисунок.
$: stack(
     s("rim").struct("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~ ~").gain(drums.rim.vol.mul(m0)),
     s("rim").struct("~ ~ rim ~ ~ ~ ~ ~ ~ rim ~ ~ ~ ~ rim ~").gain(drums.rim.vol.mul(m1)),
     s("rim").struct("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~ ~ ~").gain(drums.rim.vol.mul(m2)),
     s("rim").struct("~ ~ ~ rim ~ ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~").gain(drums.rim.vol.mul(m3)),
   )
  .lpf(drums.rim.cut).hpf(600).lpq(2)
  .decay(drums.rim.decay).sustain(0)
  .pan(rand.mul(1.2).sub(0.6))
  .delay(drums.rim.echo.mul(fx.dub.send)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback.mul(0.6))
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .filter(audible)

// SHAKER — только STEP, очень тихо. Это текстура, а не грув.
$: s("sh*16")
  .gain(drums.shaker.vol.mul(m2).mul(0.5))
  .lpf(drums.shaker.cut).hpf(3000)
  .decay(0.03).sustain(0)
  .pan(rand.mul(0.8).add(0.1))
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .filter(audible)

// CLICKS — редкие точки в DRAG/STRIP. В HALF/STEP они были бы лишними.
$: s("click:0")
  .struct("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~")
  .gain(drums.click.vol.mul(m1.add(m3)))
  .lpf(drums.click.cut).hpf(2000)
  .decay(0.03).sustain(0)
  .pan(rand.mul(1.6).sub(0.8))
  .delay(drums.click.echo.mul(fx.dub.send)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  БАС — саб ниже 80 + шершавый growl
// ══════════════════════════════════════════════════════════════════

// SUB — синус на 1 и 3.5. Срез max 80: это давление, а не бас-гитара.
$: note(ROOT)
  .s("sine")
  .struct("x ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~")
  .gain(bass.sub.vol)
  .lpf(bass.sub.cut).lpq(1)
  .shape(0.1)
  .attack(0.01).decay(bass.sub.decay).sustain(0.8).release(0.5)
  .filter(audible)

// GROWL — гудящая шершавая середина. Длинные ноты, медленный LFO по
// срезу, лёгкий shape. Это не дабстеп-вобл на 16-х, а тянущийся гул.
// Срез здесь выше 80 осознанно: саб уже отдельно и он ≤80.
$: note(GROWL)
  .s("sawtooth").unison(2).detune(0.04)
  .gain(bass.growl.vol)
  .lpf(bass.growl.cut).lpq(bass.growl.q).ftype("24db")
  .lpdepth(bass.growl.lfo).lpsync(bass.growl.sync).lpdc(0)
  .shape(bass.growl.grit)
  .attack(0.02).decay(bass.growl.decay).sustain(0.6).release(0.5)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  АККОРДЫ — вокальный пэд и редкий стаб
// ══════════════════════════════════════════════════════════════════

// PAD 0 — DARK. Formant-фильтр `vowel` медленно ходит a↔o. Долгая
// атака/релиз, chorus. Это не аккомпанемент: пэд не двигается с киком.
$: note(PAD_A)
  .s("sawtooth").partials([1, 0.5, 0.35, 0.2, 0.12, 0.06])
  .unison(2).detune(chords.pad.det)
  .vowel("<a o>")
  .gain(chords.pad.vol.mul(hA))
  .lpf(chords.pad.cut).hpf(chords.pad.hpf).lpq(chords.pad.q).ftype("24db")
  .lpdepth(chords.pad.lfo).lpsync(0.25).lpdc(0)
  .chorus(0.5)
  .attack(5).decay(3).sustain(0.9).release(14)
  .room(verb.mul(0.9)).roomsize(fx.reverb.size)
  .filter(audible)

// PAD 1 — GHOST. Открытые квинты/9-е без терций, выше и прозрачнее.
// Это другой воздух над тем же полем, а не второй аккорд.
$: note(PAD_B)
  .s("triangle").partials([1, 0.3, 0.15, 0.07])
  .unison(3).detune(chords.pad.det.mul(1.5))
  .gain(chords.pad.vol.mul(hB))
  .lpf(chords.pad.cut.mul(1.3)).hpf(300).lpq(chords.pad.q.mul(0.7))
  .lpdepth(chords.pad.lfo).lpsync(0.25).lpdc(0)
  .chorus(0.7)
  .attack(7).decay(4).sustain(0.9).release(18)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// DUB STAB — один короткий аккорд раз в два такта. Дальше работает
// delay: 0.375 цикла, feedback 0.6. Верх срезан, поэтому эхо уходит
// в туман, а не в яркий «дилей».
$: note(STAB)
  .s("sawtooth").unison(2).detune(0.05)
  .gain(chords.stab.vol)
  .lpf(chords.stab.cut).hpf(180).lpq(chords.stab.res).ftype("24db")
  .attack(0.005).decay(chords.stab.decay).sustain(0).release(0.8)
  .delay(fx.dub.send)
  .delaytime(fx.dub.time)
  .delayfeedback(fx.dub.feedback)
  .room(chords.stab.room.mul(verb)).roomsize(fx.reverb.size)
  .filter(audible)

// MOOG — редкая одиночная нота с длинным релизом. Не лид и не
// мелодия: это сигнал, который появляется и растворяется в дилее.
$: note(MOOG)
  .s("sawtooth").unison(2).detune(moog.det)
  .gain(moog.vol)
  .lpf(moog.cut).hpf(180).lpq(moog.q).ftype("24db")
  .attack(0.12).decay(moog.decay).sustain(0.35).release(2.4)
  .delay(fx.dub.send.mul(0.7)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ШПАРГАЛКА НА НОЧЬ
// ══════════════════════════════════════════════════════════════════
//  Имена — пути по дереву: группа.инструмент.параметр.
//
//  пустота:       atmos.hiss 0.05 + air 0.03 + field 0.035, verb 0.78
//  вход:          drums.kick.vol 0.35, bass.sub.vol 0.5
//  грязь:         bass.growl.vol 0.25–0.4, cut 260–500
//  стаб:          chords.stab.vol 0.35, fx.dub.send 0.6, feedback 0.6
//  пад:           chords.pad.vol 0.25; harmony 0 DARK / 1 GHOST
//  хэты:          drums.hat.vol 0.25, rim 0.2, swing 0.1–0.16
//  режимы:        mode 0 HALF / 1 DRAG / 2 STEP / 3 STRIP
//  низ:           bass.sub.cut 60–80 (max 80), kick.cut 240
//  муг:           moog.vol 0.12–0.2, cut 600–900, появляется раз в 2 такта
//  даб:           fx.dub.time 0.375 (пунктирная четверть), feedback 0.5–0.7
//  движение:      открывай stab.cut / growl.cut / fx.dub.feedback на 8–32 такта
//  антипоп:       никаких райзеров, sidechain-пумпа, мелодий, 303-аккордов
//                 и «красивого» лида; снейр на 3, а не на 2 и 4
// ══════════════════════════════════════════════════════════════════
