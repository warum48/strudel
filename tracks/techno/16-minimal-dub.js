// ══════════════════════════════════════════════════════════════════
//  MINIMAL DUB 16  ·  Strudel  ·  120 BPM  ·  anti-pop dub techno
//
//  Не попса. Не «трек с дропом». Один стаб, один саб, приглушённый
//  кик, длинный дилей и много воздуха. Всё движение — в фильтре,
//  обратной связи и медленном открытии/закрытии, а не в новых
//  секциях. Это ближе к Basic Channel / Rhythm & Sound / Maurizio,
//  чем к «dub techno для плейлиста».
//
//  ── ЧТО ПРОЧИТАНО ВОВНЕ ────────────────────────────────────────
//  • Tunary, «How to make dub techno»: 120–130 BPM; muted four-on-floor;
//    soft offbeat hats; short filtered chord stab through long delay;
//    deep warm sub; hiss/fog; long patient arrangement, tiny changes.
//  • Studio Brootle, «Dub Techno Tutorial: 4 Ingredients»: только кик,
//    саб, хэты и 2 аккорда; всё остальное — фильтры, delay/reverb и
//    автоматизация. Дилей/реверб — не украшение, а сам звук.
//  • House of Loop: стаб через ping-pong delay с feedback ~40–65%,
//    фильтрованные повторы (каждый эхо темнее), реверб после.
//  • Basic Channel / Chain Reaction: шум, хайс, минимум событий,
//    аккорд живёт в эхе; верх срезан, низ — центр.
//
//  ── ПРАВИЛА ПРОЕКТА (docs/rules.md) ────────────────────────────
//  • Весь бас: срез НЕ ВЫШЕ 80 Гц. Здесь оба баса (sub и dub) имеют
//    max 80 на слайдере; выше физически не поднять.
//  • Бочка по умолчанию максимально глухая: lpf ~260, мягкая атака.
//  • Никаких смешных мелодических линий. Мелодии здесь нет вообще:
//    только аккорд-стаб, эхо и шум. 303 тоже нет — ему тут нечего
//    обыгрывать, а аккорды 303-пиу — это как раз попса.
//  • Не 1–2–4–5: гармония висит на Am9, затем bII (Bbmaj9). Никакого
//    разрешения доминанты, только 9-я и bII как сочный диссонанс.
//  • Никакого sidechain-пумпа, райзеров и дропов: это EDM, не даб.
//
//  ── ГАРМОНИЯ ────────────────────────────────────────────────────
//  8 тактов: Am9 (1–4) → Bbmaj9 (5–8). Корни: a a a a bb bb bb bb.
//  Am9 = a c e g b; Bbmaj9 = bb d f a c. В обоих аккордах нет пары
//  e–bb (тритона), поэтому стаб и бас могут ходить по тонам без
//  «грязных» совпадений. Bbmaj9 — это bII: тот самый сочный сдвиг
//  на полтона, который не даёт треку звучать как кафе-лаунж.
//  @roots a a a a bb bb bb bb
//
//  ── РЕЖИМЫ ──────────────────────────────────────────────────────
//  mode:     0 DUB / 1 STRIP / 2 PRESSURE / 3 CLICK.
//            Меняются только хэты/rim/click и плотность — кик и саб
//            остаются. Никаких «дропов».
//  harmony:  0 WARM (мягкий пад) / 1 AIR (высокий, воздушный).
//  Оба переключателя — защёлки на 8 тактов.
//
//  ── СТАРТ ──────────────────────────────────────────────────────
//  Звучит только атмосфера: hiss, air, field. Всё остальное в нуле.
//  Сначала поднимай kick и sub, потом stab, потом pad/хэты.
//  Держи бас на 60–80 Гц: выше — уже не даб, а попытка «услышать бас».
// ══════════════════════════════════════════════════════════════════

const BPM = 120
setcpm(BPM / 4) // один цикл = один такт 4/4 (2 с)

// ══════════════════════════════════════════════════════════════════
//  СЭМПЛЫ
// ══════════════════════════════════════════════════════════════════
// uzu — кик/хэты/rim/шейкер; Dirt-Samples — click и wind.
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
// @switches mode=dub,strip,pressure,click harmony=warm,air
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
const verb = slider(0.7, 0, 1, 0.01)   // большой, но тёмный реверб

// ══════════════════════════════════════════════════════════════════
//  ИНСТРУМЕНТЫ
// ══════════════════════════════════════════════════════════════════
const instruments = {
  // ── АТМОСФЕРА ──────────────────────────────────────────────────
  atmos: {
    name: 'Atmos',
    hiss: {
      name: 'Hiss',
      vol: slider(0.04, 0, 0.3, 0.01),
      cut: slider(1200, 200, 8000, 20),
      hpf: slider(80, 20, 600, 10),
    },
    air: {
      name: 'Air',
      vol: slider(0.025, 0, 0.3, 0.01),
      cut: slider(500, 100, 6000, 20),
      lfo: slider(0.8, 0, 6, 0.1),
    },
    field: {
      name: 'Field',
      vol: slider(0.03, 0, 0.3, 0.01),
      cut: slider(700, 100, 5000, 20),
    },
  },

  // ── БАРАБАНЫ ───────────────────────────────────────────────────
  drums: {
    name: 'Drums',
    // Бочка намеренно глухая: lpf 260, мягкий shape, короткий хвост.
    kick: {
      name: 'Muted kick',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(260, 80, 800, 5),
      shape: slider(0.45, 0, 0.8, 0.01),
      decay: slider(0.36, 0.1, 1.2, 0.01),
    },
    hat: {
      name: 'Soft hats',
      vol: slider(0, 0, 0.6, 0.01),
      cut: slider(5200, 800, 12000, 50),
      decay: slider(0.2, 0.03, 0.8, 0.01),
    },
    rim: {
      name: 'Rim',
      vol: slider(0, 0, 0.6, 0.01),
      cut: slider(3600, 400, 12000, 50),
      echo: slider(0.25, 0, 0.8, 0.01),
    },
    click: {
      name: 'Clicks',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(9000, 1000, 16000, 100),
      echo: slider(0.3, 0, 0.8, 0.01),
    },
    shaker: {
      name: 'Shaker',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(6500, 800, 14000, 100),
    },
  },

  // ── БАС ────────────────────────────────────────────────────────
  bass: {
    name: 'Bass',
    // SUB — синус, только низ. Срез не выше 80 (правило проекта).
    sub: {
      name: 'Sub',
      vol: slider(0, 0, 1.1, 0.01),
      cut: slider(70, 40, 80, 1),
      decay: slider(0.7, 0.1, 2.5, 0.01),
    },
    // DUB — треугольник, короткая фразировка, тоже max 80.
    dub: {
      name: 'Dub bass',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(80, 40, 80, 1),
      decay: slider(0.45, 0.1, 2, 0.01),
    },
  },

  // ── АККОРДЫ ────────────────────────────────────────────────────
  chords: {
    name: 'Chords',
    // PAD — не лид, а туман. Долгая атака, низкий срез, chorus.
    pad: {
      name: 'Pad',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(900, 80, 5000, 10),
      hpf: slider(100, 20, 600, 10),
      q: slider(1.4, 0, 20, 0.5),
      lfo: slider(0.5, 0, 6, 0.1),
      det: slider(0.08, 0, 0.4, 0.01),
    },
    // STAB — короткий удар по аккорду; главный звук трека. Живёт в
    // дилее, поэтому сам по себе почти сухой и очень короткий.
    stab: {
      name: 'Dub stab',
      vol: slider(0, 0, 0.9, 0.01),
      cut: slider(1100, 100, 6000, 10),
      res: slider(4, 0, 18, 0.5),
      decay: slider(0.28, 0.03, 1.2, 0.01),
      room: slider(0.45, 0, 1, 0.01),
    },
  },

  // ── ЭФФЕКТЫ ────────────────────────────────────────────────────
  fx: {
    name: 'FX',
    // DUB — общие настройки задержки. send = сколько стаба/хэтов
    // уходит в эхо; time в циклах (0.375 = пунктирная четверть);
    // feedback 0.55 = хвост на несколько тактов.
    dub: {
      name: 'Dub delay',
      send: slider(0.55, 0, 1, 0.01),
      time: slider(0.375, 0.0625, 0.75, 0.0625),
      feedback: slider(0.55, 0, 0.85, 0.01),
    },
    reverb: {
      name: 'Reverb',
      size: slider(14, 1, 20, 0.5),
    },
  },
}

const { atmos, drums, bass, chords, fx } = instruments


const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}


// ══════════════════════════════════════════════════════════════════
//  ФРАЗЫ
// ══════════════════════════════════════════════════════════════════
const phrase = (bars) => m('<' + bars.join(' ') + '>')

// Корни: Am9 (1–4), Bbmaj9 (5–8). Строка ниже — маркер для tension.
// @roots a a a a bb bb bb bb

// ROOT — саб по корням, одна нота на такт.
const ROOT = phrase([
  '[a1]', '[a1]', '[a1]', '[a1]',
  '[bb1]', '[bb1]', '[bb1]', '[bb1]',
])

// BASS — не «проход по тонам аккорда», а фраза с паузами и
// контрапунктом: квинта, b7, 11-я, а на Bb — A как maj7-педаль.
// Всё это ниже 80 Гц, поэтому слышно как давление, а не мелодию.
const BASS = phrase([
  '[a1 ~ ~ e1 ~ ~ g1 ~]',
  '[~ a1 ~ ~ c2 ~ ~ e1]',
  '[a1 ~ ~ ~ e1 ~ g1 ~]',
  '[~ ~ d2 ~ ~ e1 ~ a1]',
  '[bb1 ~ ~ f1 ~ ~ d2 ~]',
  '[~ a1 ~ ~ c2 ~ ~ f1]',
  '[a1 ~ ~ ~ f1 ~ d2 ~]',
  '[~ ~ c2 ~ ~ f1 ~ bb1]',
])

// PAD_A — WARM: широкие 9-е укладки, низко и мягко.
const PAD_A = phrase([
  '[a2,c3,e3,g3,b4]',
  '[a2,c3,e3,g3,b4]',
  '[a2,c3,e3,g3,b4]',
  '[a2,c3,e3,g3,b4]',
  '[bb2,d3,f3,c4,a4]',
  '[bb2,d3,f3,c4,a4]',
  '[bb2,d3,f3,c4,a4]',
  '[bb2,d3,f3,c4,a4]',
])

// PAD_B — AIR: открытые квинты и 9-е, без терций. Это не второй
// аккорд, а другой воздух над тем же полем.
const PAD_B = phrase([
  '[a3,e4,b4]',
  '[a3,e4,b4]',
  '[a3,e4,b4]',
  '[a3,e4,b4]',
  '[bb3,f4,c5]',
  '[bb3,f4,c5]',
  '[bb3,f4,c5]',
  '[bb3,f4,c5]',
])

// STAB — один короткий аккорд на «и» первой доли. Дальше работает
// дилей: 0.375 цикла, feedback 0.55, фильтр на повторах. Это и есть
// «аккорд, который живёт в эхе», а не пэд и не риф.
const STAB = phrase([
  '[~ [a3,c4,e4,g4] ~ ~ ~ ~ ~ ~]',
  '[~ [a3,c4,e4,g4] ~ ~ ~ ~ ~ ~]',
  '[~ [a3,c4,e4,g4] ~ ~ ~ ~ ~ ~]',
  '[~ [a3,c4,e4,g4] ~ ~ ~ ~ ~ ~]',
  '[~ [bb3,d4,f4,a4] ~ ~ ~ ~ ~ ~]',
  '[~ [bb3,d4,f4,a4] ~ ~ ~ ~ ~ ~]',
  '[~ [bb3,d4,f4,a4] ~ ~ ~ ~ ~ ~]',
  '[~ [bb3,d4,f4,a4] ~ ~ ~ ~ ~ ~]',
])

// ══════════════════════════════════════════════════════════════════
//  АТМОСФЕРА — звучит с первого нажатия
// ══════════════════════════════════════════════════════════════════

// ХАЙС — винил/шум. Это не «эффект», а часть тела трека: без него
// стаб звучит как MIDI, а не как запись.
$: s("crackle")
  .gain(atmos.hiss.vol.mul("<1 .8 1 1 .9 1 1 .85 1 1 .9 1>"))
  .lpf(atmos.hiss.cut).hpf(atmos.hiss.hpf)
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .filter(audible)

// ВОЗДУХ — очень тихий шум, срез дышит раз в 16 тактов
$: s("pink")
  .gain(atmos.air.vol)
  .lpf(atmos.air.cut).hpf(120).lpq(0.7)
  .lpdepth(atmos.air.lfo).lpsync(0.0625).lpdc(0)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// ПОЛЕ — wind из Dirt-Samples, растянутый на 8 тактов. Далёкий
// пейзаж, а не мелодия; панорама едет очень медленно.
$: s("wind:0")
  .loopAt(8)
  .gain(atmos.field.vol)
  .lpf(atmos.field.cut).hpf(200)
  .room(verb.mul(0.7)).roomsize(fx.reverb.size)
  .pan(sine.slow(64).range(0.3, 0.7))
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  БАРАБАНЫ — приглушённый 4/4, без снейра и без дропов
// ══════════════════════════════════════════════════════════════════

// KICK — четыре в пол, глухо. Никакого дисторшна и клика: это
// «сердце», а не удар. `shape` мягко ограничивает пик.
$: s("bd*4")
  .gain(drums.kick.vol)
  .lpf(drums.kick.cut).lpq(1)
  .shape(drums.kick.shape)
  .decay(drums.kick.decay).sustain(0).release(0.08)
  .filter(audible)

// HATS — оффбитный открытый хэт. В DUB и PRESSURE; в STRIP/CLICK
// тихо, там работают rim/click и пустота.
$: stack(
     s("~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~").gain(drums.hat.vol.mul(m0)),
     s("~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~").gain(drums.hat.vol.mul(m2).mul(0.8)),
   )
  .lpf(drums.hat.cut).hpf(500)
  .decay(drums.hat.decay).sustain(0)
  .delay(fx.dub.send.mul(0.35)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback.mul(0.5))
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .filter(audible)

// RIM — сухой деревянный тик. В STRIP он заменяет хэты.
$: stack(
     s("~ ~ ~ ~ rim ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~").gain(drums.rim.vol.mul(m0)),
     s("~ ~ rim ~ ~ ~ rim ~ ~ ~ rim ~ ~ ~ rim ~").gain(drums.rim.vol.mul(m1)),
     s("~ ~ ~ ~ rim ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~").gain(drums.rim.vol.mul(m2)),
     s("~ ~ rim ~ ~ ~ ~ ~ rim ~ ~ ~ ~ ~ rim ~").gain(drums.rim.vol.mul(m3)),
   )
  .lpf(drums.rim.cut).hpf(500).lpq(2)
  .decay(0.06).sustain(0)
  .pan(rand.mul(1.2).sub(0.6))
  .delay(drums.rim.echo.mul(fx.dub.send)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback.mul(0.6))
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .filter(audible)

// CLICKS — редкие цифровые точки. Только STRIP и CLICK: в DUB/PRESSURE
// они были бы уже «айдиэмом», а не дабом.
$: s("click:0")
  .struct("~ x ~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~")
  .gain(drums.click.vol.mul(m1.add(m3)))
  .lpf(drums.click.cut).hpf(2000)
  .decay(0.03).sustain(0)
  .pan(rand.mul(1.6).sub(0.8))
  .delay(drums.click.echo.mul(fx.dub.send)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .filter(audible)

// SHAKER — только PRESSURE, очень тихо. Это не грув, а текстура.
$: s("sh*16")
  .gain(drums.shaker.vol.mul(m2).mul(0.6))
  .lpf(drums.shaker.cut).hpf(2500)
  .decay(0.03).sustain(0)
  .pan(rand.mul(0.8).add(0.1))
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  БАС — всё ниже 80 Гц, без середины
// ══════════════════════════════════════════════════════════════════

// SUB — синус на «и» 1-й и 3-й. Срез max 80: это не бас-гитара, а
// давление. На долю не ставим — там уже кик.
$: note(ROOT)
  .s("sine")
  .struct("~ x ~ ~ ~ x ~ ~")
  .gain(bass.sub.vol)
  .lpf(bass.sub.cut).lpq(1)
  .shape(0.2)
  .attack(0.01).decay(bass.sub.decay).sustain(0.6).release(0.3)
  .filter(audible)

// DUB BASS — треугольник, фраза с паузами и контрапунктом. Не
// «тоника-терция-квинта»: квинта, b7, 11-я и A-педаль под Bb.
// Срез max 80, поэтому это характер, а не мелодия.
$: note(BASS)
  .s("triangle")
  .gain(bass.dub.vol)
  .lpf(bass.dub.cut).lpq(1.2)
  .decay(bass.dub.decay).sustain(0.5).release(0.2)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  АККОРДЫ — пад-туман и стаб в дилее
// ══════════════════════════════════════════════════════════════════

// PAD 0 — WARM. Долгая атака/релиз, низкий срез, chorus. Это фон,
// а не аккомпанемент: он не двигается вместе с киком.
$: note(PAD_A)
  .s("sawtooth").partials([1, 0.45, 0.25, 0.1, 0.05])
  .unison(2).detune(chords.pad.det)
  .gain(chords.pad.vol.mul(hA))
  .lpf(chords.pad.cut).hpf(chords.pad.hpf).lpq(chords.pad.q).ftype("24db")
  .lpdepth(chords.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.4)
  .attack(4).decay(3).sustain(0.9).release(12)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// PAD 1 — AIR. Открытые квинты/9-е без терций, выше и прозрачнее.
// Это не «второй аккорд», а другой воздух над тем же полем.
$: note(PAD_B)
  .s("triangle").partials([1, 0.3, 0.15, 0.06])
  .unison(3).detune(chords.pad.det.mul(1.4))
  .gain(chords.pad.vol.mul(hB))
  .lpf(chords.pad.cut.mul(1.2)).hpf(300).lpq(chords.pad.q.mul(0.7))
  .lpdepth(chords.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.5)
  .attack(6).decay(4).sustain(0.9).release(16)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// DUB STAB — главный звук. Один короткий аккорд на «и» первой доли.
// Дальше его растягивает delay: 0.375 цикла, feedback 0.55. Верх
// срезан, поэтому эхо уходит в туман, а не в «яркий дилей».
$: note(STAB)
  .s("sawtooth").unison(2).detune(0.06)
  .gain(chords.stab.vol)
  .lpf(chords.stab.cut).lpq(chords.stab.res).ftype("24db")
  .decay(chords.stab.decay).sustain(0).release(0.4)
  .delay(fx.dub.send)
  .delaytime(fx.dub.time)
  .delayfeedback(fx.dub.feedback)
  .room(chords.stab.room.mul(verb)).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ШПАРГАЛКА НА НОЧЬ
// ══════════════════════════════════════════════════════════════════
//  Имена — пути по дереву: группа.инструмент.параметр.
//
//  пустота:       atmos.hiss 0.04 + air 0.025 + field 0.03, verb 0.7
//  вход:          drums.kick.vol 0.35, bass.sub.vol 0.5, bass.dub.vol 0.35
//  стаб:          chords.stab.vol 0.4, fx.dub.send 0.55, feedback 0.55
//  пад:           chords.pad.vol 0.25; harmony 0 WARM / 1 AIR
//  хэты:          drums.hat.vol 0.25, drums.rim.vol 0.2
//  режимы:        mode 0 DUB / 1 STRIP / 2 PRESSURE / 3 CLICK
//  низ:           bass.sub.cut 60–80 (max 80), kick.cut 260
//  даб:           fx.dub.time 0.375 (пунктирная четверть), feedback 0.5–0.65
//  движение:      открывай chords.stab.cut / fx.dub.feedback на 8–32 такта,
//                 не добавляй новые секции и не делай дропов
//  антипоп:       никаких райзеров, sidechain-пумпа, снейра на 2/4,
//                 мелодий, 303-аккордов и «красивого» лида
// ══════════════════════════════════════════════════════════════════
