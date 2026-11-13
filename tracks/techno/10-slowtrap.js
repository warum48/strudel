// ══════════════════════════════════════════════════════════════════
//  SLOW TRAP 10  ·  Strudel  ·  136 BPM (half-time)  ·  IDM
//
//  Четвёртый характер, не версия. 08/09 — эйсид на 180, это — медленный
//  трэп: 136 BPM, но ритм полутемповый, то есть удар и снейр стоят через
//  полтакта, а между ними живут 32-е. Медленно по ощущению, быстро по сетке.
//
//  ЧТО ЗДЕСЬ ОТ ЧЕГО:
//   1. 808 — главный инструмент, а не «бас под бочкой». Синус, длинный
//      сэмпл-хвост, глиссандо между нотами (glide из prebake Switch Angel,
//      см. блок GLIDE). В трэпе слайд 808 — это и есть грув.
//   2. ЭЙСИД — берлинский, а не кислотный: та же 303, но играет редко и
//      низко, как в дарк-техно, а не 16-ми как в 08. Она тут фактура, а не
//      главная линия.
//   3. ЛОМАНЫЙ РИТМ. Бочка не «четыре в пол» ни в одном режиме: везде
//      синкопы, euclid и сдвиги. Снейр иногда уезжает с 3-й доли на 2-ю
//      (m1) — это и есть «сломано», а не «сложно».
//   4. ВОКОДЕР. Настоящего вокодера в движке нет (нужен носитель + модулятор),
//      поэтому это имитация: суперпила через вокальный фильтр `vowel` с
//      бегущими гласными + phaser. Звучит как робот-хор, а не как человек.
//   5. IDM, А НЕ 90-е. Спецэффекты — это микротайминг, а не реверб-холл:
//      ply-роллы на 32-х, degradeBy, coarse на точках, press/squeeze,
//      off() для хокетинга, длинные хвосты вместо больших комнат.
//
//  ── 🛑 ПРАВИЛО: ФИЛЬТР — СРАЗУ ПОД ГРОМКОСТЬЮ ────────────────────
//  У каждой дорожки с фильтром сначала `.gain(...)`, сразу под ним `.lpf`
//  (и `.hpf`, если есть). На звук порядок в цепочке не влияет — superdough
//  собирает контролы в один объект и применяет эффекты в своём фиксированном
//  порядке. Это правило ЧИТАЕМОСТИ: когда открываешь трек, видно «громкость →
//  срез» и не надо искать срез в середине цепочки. Исключение — `.gain()`
//  после `stut`/`echo`: они ПЕРЕЗАПИСЫВАЮТ громкость, поэтому таких мест тут
//  нет вообще (эхо сделано через delay, а не через stut).
//
//  ── 🛑 БЮДЖЕТ CPU ────────────────────────────────────────────────
//  shape / crush / coarse / distort / ftype("ladder") — это worklet на КАЖДОЕ
//  событие. Здесь они стоят только там, где событий мало: бочка (3–9), клэп
//  (2–4), тики (6), блипы (3), эйсид (6 — один ladder). Хэты (32 события) —
//  без worklet'ов вообще.
//  Замер (`npm run cpu`, по факту событий за 8 тактов): 18–33 worklet'а на
//  такт, то есть 10–19 в секунду. Для сравнения: 08 — 37/такт (28/с), 07 —
//  15 (8/с). Бюджет — это «в секунду», поэтому 136 BPM тут в плюсе: при
//  180 BPM те же 33 на такт были бы 25/с.
//
//  ── РЕЖИМЫ ──────────────────────────────────────────────────────
//  УДАРНЫЕ (mode, 4): 0 ТРАП / 1 ЛОМ / 2 ПОЛУТЕМП / 3 ДРОБЬ.
//  МЕЛОДИЯ (harmony, 2): 0 КОЛОКОЛЬЧИКИ / 1 ВОКОДЕР — одна и та же фраза,
//  разные инструменты. Переключается на границе 8 тактов (см. tools/latch.mjs).
// ══════════════════════════════════════════════════════════════════

const BPM = 136
setcpm(BPM / 4) // один цикл = один такт 4/4 (≈ 1.76 с) — полутемп по ощущению

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
// заменяются 3 символа → «0.62» вместо «0.6». Лечится снаружи: держим
// el.originalValue равным тому, что реально в документе. В документ НЕ
// пишем — звук идёт через postMessage, id считается от originalFrom.
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
//  GLIDE — настоящий слайд (рецепт Switch Angel)
// ══════════════════════════════════════════════════════════════════
// Из github.com/switchangel/strudel-scripts (prebake.strudel). Считает
// частоту ПРЕДЫДУЩЕЙ ноты и ставит питч-огибающую сам:
//   panchor 0, psustain 0, pattack 0, pdecay = время глиссандо,
//   penv = -12 * log2(freqTo / freqFrom)
// В трэпе это главный приём 808: слайд из одной ноты в другую, а не
// «подъехать снизу на N полутонов».
// getFrequencyFromValue есть в скоупе редактора strudel.cc, но НЕ
// экспортируется из @strudel/core в node — поэтому фолбэк через noteToMidi,
// иначе npm run verify не сможет прогнать трек.
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

// РЕЖИМ УДАРНЫХ: 0 трап / 1 лом / 2 полутемп / 3 дробь.
const mode = slider(0, 0, 3, 1)
const m0 = mode.fmap((m) => (m === 0 ? 1 : 0))
const m1 = mode.fmap((m) => (m === 1 ? 1 : 0))
const m2 = mode.fmap((m) => (m === 2 ? 1 : 0))
const m3 = mode.fmap((m) => (m === 3 ? 1 : 0))

// МЕЛОДИЯ: 0 колокольчики / 1 вокодер. Одна фраза (MEL), два инструмента.
// Защёлка: слайдер двигаешь когда угодно, звук меняется на границе 8 тактов —
// начатая фраза доигрывает (tools/latch.mjs проверяет именно это).
const harmony = slider(0, 0, 1, 1)
// seg(1/8) = защёлка на 8 тактов: значение берётся один раз на 8 тактов,
// поэтому начатая фраза доигрывает целиком и мелодия не рвётся посередине.
// Без этого gain меняется в тот же такт, где двинули ручку (проверяется
// через tools/latch.mjs — он двигает слайдер на 4-м такте и смотрит, где
// реально щёлкнуло; без seg будет «такт 4», с ним — «такт 8»).
const hQ = harmony.seg(1 / 8)
const hA = hQ.fmap((h) => (h < 0.5 ? 1 : 0))
const hB = hQ.fmap((h) => (h < 0.5 ? 0 : 1))

// ══════════════════════════════════════════════════════════════════
//  МИКШЕР — только громкости, 26 инструментов + общее
// ══════════════════════════════════════════════════════════════════

const airVol    = slider(0.1, 0, 0.5, 0.01)   // воздух (звучит сразу)
const droneVol  = slider(0.14, 0, 0.6, 0.01)  // дрон (звучит сразу)
const vinylVol  = slider(0.03, 0, 0.3, 0.01)  // песок
const kickVol   = slider(0, 0, 1.5, 0.01)     // бочка
const subVol    = slider(0, 0, 1.2, 0.01)     // саб под бочку
const eightVol  = slider(0, 0, 1.4, 0.01)     // 808 — главный низ
const snareVol  = slider(0, 0, 1, 0.01)       // снейр
const clapVol   = slider(0, 0, 0.9, 0.01)     // клэп
const hatVol    = slider(0, 0, 0.9, 0.01)     // закрытые хэты
const ohatVol   = slider(0, 0, 0.7, 0.01)     // открытые хэты
const rimVol    = slider(0, 0, 0.7, 0.01)     // rim / вудблок
const shakerVol = slider(0, 0, 0.6, 0.01)     // шейкер
const tickVol   = slider(0, 0, 0.5, 0.01)     // IDM-тики (белый шум)
const crashVol  = slider(0, 0, 0.7, 0.01)     // тарелка
const riserVol  = slider(0, 0, 0.6, 0.01)     // райзер
const swellVol  = slider(0, 0, 0.5, 0.01)     // обратный свелл
const impactVol = slider(0, 0, 0.7, 0.01)     // импакт
const acidVol   = slider(0, 0, 1.1, 0.01)     // 303 — берлинская фактура
const ghostVol  = slider(0, 0, 0.7, 0.01)     // эйсид-ответ (высокий)
const melVol    = slider(0, 0, 1, 0.01)       // мелодия (колокольчики/вокодер)
const padVol    = slider(0, 0, 0.7, 0.01)     // пэд
const stabVol   = slider(0, 0, 0.8, 0.01)     // стаб с b9
const blipVol   = slider(0, 0, 0.5, 0.01)     // блипы
const gritVol   = slider(0, 0, 0.5, 0.01)     // гранулярная пыль
const tapeVol   = slider(0, 0, 0.6, 0.01)     // «ленточный» слой
const bellVol   = slider(0, 0, 0.6, 0.01)     // дальний колокол

// ОБЩЕЕ: пространство и сайдчейн
const verb     = slider(0.45, 0, 1, 0.01)   // общий реверб
const verbSize = slider(8, 1, 20, 0.5)      // размер комнаты (свёртка: 12 с дорого)
const duck     = slider(0.65, 0, 1, 0.01)   // сайдчейн низа от бочки

// ══════════════════════════════════════════════════════════════════
//  НАСТРОЙКИ — по группам, в том же порядке, что и дорожки
// ══════════════════════════════════════════════════════════════════

// атмосфера
const airCut   = slider(500, 100, 8000, 20)
const airLfo   = slider(2.5, 0, 10, 0.5)
const droneCut = slider(240, 60, 2000, 10)
const droneDet = slider(0.1, 0, 0.5, 0.01)
const vinylCut = slider(2200, 300, 12000, 100)

// ударные
const kickCut   = slider(1100, 200, 12000, 100)
const kickShape = slider(0.8, 0, 0.95, 0.01)  // вейвшейпер бочки
const kickDist  = slider(1.6, 0, 4, 0.1)      // клиппинг бочки: вот он, жир
const kickDecay = slider(0.7, 0.15, 2, 0.01)
const kickTune  = slider(0.82, 0.55, 1.4, 0.01)
const subDecay  = slider(0.5, 0.1, 2, 0.01)
const snareCut  = slider(5200, 800, 14000, 100)
const snareDecay = slider(0.16, 0.03, 0.7, 0.01)
const clapCut   = slider(5000, 800, 14000, 100)
const clapHpf   = slider(700, 200, 4000, 50)
const clapCrush = slider(12, 1, 16, 0.5)
const hatCut    = slider(8000, 800, 16000, 100)
const ohatCut   = slider(5600, 800, 16000, 100)
const rimCut    = slider(3200, 400, 14000, 100)
const shakerCut = slider(6500, 800, 16000, 100)
const tickCut   = slider(3200, 400, 12000, 100)
const crashCut  = slider(6000, 1000, 16000, 100)
const riserCut  = slider(4000, 200, 16000, 100)
const swellCut  = slider(4500, 300, 16000, 100)

// 808 и эйсид
const eightCut   = slider(160, 40, 800, 5)     // выше 300 — уже не 808
const eightShape = slider(0.35, 0, 0.9, 0.01)  // «жир» без цифровой рвани
const eightGlide = slider(0.09, 0, 0.3, 0.001) // время слайда 808
const eightDecay = slider(0.9, 0.2, 3, 0.01)
const acidCut   = slider(300, 80, 5000, 10)    // берлинский эйсид = тёмный срез
const acidRes   = slider(16, 0, 30, 0.5)
const acidDrive = slider(1.3, 0.2, 2.6, 0.01)
const acidEnv   = slider(3.2, 0, 9, 0.1)
const acidDecay = slider(0.12, 0.02, 0.6, 0.01)
const acidLfo   = slider(0.8, 0, 8, 0.1)
const acidGlide = slider(0.05, 0, 0.15, 0.001)
const acidEcho  = slider(0.3, 0, 0.9, 0.01)

// мелодия и гармония
const melCut    = slider(4200, 400, 14000, 50)
const melDecay  = slider(0.35, 0.05, 1.5, 0.01)
const melEcho   = slider(0.4, 0, 0.9, 0.01)
const vocCut    = slider(2600, 300, 12000, 50)  // срез вокодера
const vocVowel  = slider(3, 1, 8, 1)            // скорость бега гласных
const vocPhase  = slider(0.5, 0, 1, 0.01)
const vocChorus = slider(0.35, 0, 1, 0.01)
const padCut    = slider(420, 80, 4000, 10)
const padQ      = slider(2, 0, 20, 0.5)
const padLfo    = slider(1.5, 0, 8, 0.1)
const padDet    = slider(0.12, 0, 0.6, 0.01)
const stabCut   = slider(2400, 200, 12000, 20)
const stabDecay = slider(0.22, 0.03, 1, 0.01)

// IDM-спецэффекты
const blipCut   = slider(9000, 1000, 16000, 100)
const blipDelay = slider(0.45, 0, 0.9, 0.01)
const blipTime  = slider(0.1875, 0.03, 0.5, 0.005) // 3/16 — «косой» дилей
const gritCut   = slider(1800, 200, 10000, 20)
const gritCrush = slider(6, 1, 16, 0.5)
const tapeSpeed = slider(0.5, 0.2, 1.2, 0.01)   // скорость «ленты»
const bellCut   = slider(3000, 300, 12000, 50)

// ══════════════════════════════════════════════════════════════════
//  ФРАЗЫ
// ══════════════════════════════════════════════════════════════════
const phrase = (bars) => m('<' + bars.join(' ') + '>')

// Корни на 8 тактов: f f ab ab eb eb db f. Это не прогрессия, а круг
// вокруг f: f — ab (m3) — eb (m7) — db (bVI) и домой. Последний такт
// возвращается на f, но БЕЗ разрешения в мажор — трек не «приходит домой»,
// он просто останавливается.
// Строка ниже — машинный маркер для tools/tension.mjs.
// @roots f f ab ab eb eb db f
// @dark — тритоны в ЯКОРНЫХ фразах (длина кратна 8) считаются намеренными.
// В 808 и в эйсиде это b (b5 к f): та самая нота, из которой сделан весь
// трек. У дрейфующих фраз тритон по-прежнему ошибка.

// КОРЕНЬ — одна нота на такт, для саба и «ленты». Отдельная фраза, потому
// что аккорд в сабе и в tape-слое звучит как грязь, а не как низ.
const ROOT = phrase([
  '[f1]', '[f1]', '[ab1]', '[ab1]',
  '[eb1]', '[eb1]', '[db1]', '[f1]',
])

// 808 — не мелодия, а низ. Длинные ноты, потому что 808 в трэпе держит
// полтакта и больше; слайды между ними делают переходы (см. glide в дорожке).
// Регистр f1…c2 — это 43–65 Гц, то есть настоящий саб. Всё, что выше,
// отдано эйсиду и мелодии.
const EIGHT = phrase([
  '[f1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[f1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ab1 ~ ~]',
  '[f1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[ab1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ eb2 ~ ~]',
  '[eb1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[eb1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ bb1 ~ ~]',
  '[db1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[f1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ c2 ~ ~]',
])

// 303 — берлинская, не кислотная. Отличие от 08: она играет РЕДКО (6–8 нот
// на такт вместо 16) и низко (f2…c3), потому что здесь она не главная линия,
// а фактура. b (b5) — в каждом такте: это и есть эйсид, а не «пила с
// фильтром». 8 тактов, по корням.
const ACID = phrase([
  '[f2 ~ ~ f3 ~ ~ f2 ~ ~ ab2 ~ ~ b2 ~ ~ ~]',
  '[f2 ~ f2 ~ ~ f3 ~ ~ f2 ~ ~ c3 ~ ~ b2 ~]',
  '[f2 ~ ~ f3 ~ ~ f2 ~ ab2 ~ ~ f2 ~ b2 ~ ~]',
  '[f2 ~ f2 ~ ~ f3 ~ ~ f2 ~ eb3 ~ ~ b2 ~ ~]',
  '[f3 ~ ~ f2 ~ ~ f3 ~ ~ f2 ~ b2 ~ ~ f2 ~]',
  '[f2 ~ ~ f3 ~ ~ f2 ~ c3 ~ ~ f2 ~ ab2 ~ ~]',
  '[f2 ~ f2 ~ ~ f3 ~ ~ f2 ~ b2 ~ ~ eb3 ~ ~]',
  '[f2 ~ ~ f3 ~ ~ f2 ~ ~ ab2 ~ ~ b2 ~ ~ ~]',
])

// ЭЙСИД-ОТВЕТ — редкие высокие ноты, отвечают 808 через такт. Это не второй
// слой той же линии, а именно «ответ»: три ноты за 8 тактов.
const GHOST = phrase([
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ c4 ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ eb4 ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ b4 ~ ~ ~]',
])

// МЕЛОДИЯ — одна фраза на оба режима. 8 тактов, по корням, дырами:
// в трэпе мелодия не должна заполнять такт, она должна появляться.
const MEL = phrase([
  '[~ ~ c5 ~ ~ eb5 ~ ~ ~ ~ ab4 ~ ~ ~ ~ ~]',
  '[~ ~ c5 ~ ~ eb5 ~ ~ f5 ~ ~ ~ eb5 ~ ~ ~]',
  '[~ ~ ab4 ~ ~ c5 ~ ~ ~ ~ eb5 ~ ~ ~ ~ ~]',
  '[~ ~ f5 ~ ~ eb5 ~ ~ c5 ~ ~ ~ ab4 ~ ~ ~]',
  '[~ ~ c5 ~ ~ eb5 ~ ~ ~ ~ ab5 ~ ~ ~ ~ ~]',
  '[~ ~ f5 ~ ~ eb5 ~ ~ c5 ~ ~ ~ bb4 ~ ~ ~]',
  '[~ ~ ab4 ~ ~ c5 ~ ~ db5 ~ ~ ~ c5 ~ ~ ~]',
  '[~ ~ f5 ~ ~ eb5 ~ ~ ~ ~ c5 ~ ~ ~ ~ ~]',
])

// ПЭД — квинты без терций: ни мажора, ни минора, просто стена. Регистр
// f3…eb4 — выше эйсида (f2…c3) и ниже мелодии (c5…ab5), поэтому малых
// секунд с линией нет.
const PAD = phrase([
  '[f3,c4]', '[f3,c4]',
  '[ab3,eb4]', '[ab3,eb4]',
  '[eb3,bb3]', '[eb3,bb3]',
  '[db3,ab3]', '[f3,c4]',
])

// СТАБ — b9 к f (gb) раз в 8 тактов, огромным ударом. Единственное место,
// где в треке есть настоящая «неправильная» нота, и она стоит осознанно.
const STAB = phrase([
  '[~ ~ [f3,c4,gb4] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ [f3,c4,gb4] ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
])

// ══════════════════════════════════════════════════════════════════
//  АТМОСФЕРА — звучит с первого нажатия
// ══════════════════════════════════════════════════════════════════

// ВОЗДУХ — ровный шум, срез дышит раз в 16 тактов
$: s("pink")
  .gain(airVol)
  .lpf(airCut).lpq(0.8).ftype("24db")
  .lpdepth(airLfo).lpsync(0.0625).lpdc(0)
  .room(verb).roomsize(verbSize)

// ДРОН — f1 с квинтой. Две расстроенные пилы: одна нота, две — стена.
$: note(PAD)
  .add(note(-24))
  .s("sawtooth").unison(2).detune(droneDet)
  .gain(droneVol)
  .lpf(droneCut).lpq(3).ftype("24db")
  .attack(1.4).decay(1).sustain(0.9).release(2.2)
  .room(verb).roomsize(verbSize)

// ПЕСОК — 12 тактов на цикл, поэтому не совпадает ни с чем
$: s("crackle")
  .gain(vinylVol.mul("<1 1 .7 1 1 1 1 .8 1 1 1 1>"))
  .lpf(vinylCut).hpf(400)
  .room(0.2)

// ══════════════════════════════════════════════════════════════════
//  УДАРНЫЕ — четыре режима, ни один не «четыре в пол»
// ══════════════════════════════════════════════════════════════════

// БОЧКА. Жир даёт не громкость, а ДВА искажения подряд: shape (вейвшейпер,
// мягко ограничивает) и distort (клиппинг, срывает верх). speed 0.82
// растягивает 909-бочку вниз. Громкость внутри каждой ветки: .gain() СТАВИТ
// громкость, поэтому общий .gain(kickVol) снаружи стёр бы гейты режимов.
// Ритм: 0 — 0/6/9 (трэп), 1 — euclid 5 из 16 (лом), 2 — только 1-я доля
// (полутемп), 3 — дробь по 16-м.
$: stack(
     s("bd ~ ~ ~ ~ ~ bd ~ ~ bd ~ ~ ~ ~ ~ ~").gain(kickVol.mul(m0)),
     s("bd").euclid(5, 16).gain(kickVol.mul(m1).mul(0.95)),
     s("bd ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~").gain(kickVol.mul(m2).mul(1.1)),
     s("bd ~ bd bd ~ bd ~ bd bd ~ bd ~ bd ~ bd ~").gain(kickVol.mul(m3).mul(0.9)),
   )
  .lpf(kickCut).lpq(1)
  .speed(kickTune)
  .shape(kickShape)
  .distort(kickDist).distortvol(0.5)
  .decay(kickDecay).sustain(0)
  .duckorbit(2).duckdepth(duck).duckattack(0.02)

// САБ — синус под каждым ударом. Сам по себе не слышен, добавляет вес:
// без него бочка на ноутбуке — щелчок. Играет по корню, а не по аккорду:
// аккорд в сабе — это уже не саб, а грязь в низу.
$: note(ROOT)
  .s("sine")
  .struct("x ~ ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ ~ ~")
  .gain(subVol.mul(0.8))
  .lpf(120)
  .decay(subDecay).sustain(0)
  .orbit(2)

// 808 — главный инструмент. Синус, срез 160 Гц (выше — уже не 808), длинный
// спад и ГЛИССАНДО между нотами. Гейт слайда — вторая строка: слайд только
// там, где нота реально переезжает (позиции 13–14), а не на каждой ноте —
// иначе это портаменто, а не трэп. Гейт пишется БЕЗ угловых скобок:
// <...> это альтернация (один элемент на цикл) и онемеет в константу.
$: note(EIGHT)
  .s("sine")
  .glide(eightGlide.mul("0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0"))
  .gain(eightVol)
  .lpf(eightCut).lpq(1.2)
  .shape(eightShape)
  .attack(0.004).decay(eightDecay).sustain(0.55).release(0.25)
  .orbit(2)

// СНЕЙР — в трэпе он на 3-й доле (шаг 8). В «ломе» уезжает на 2-ю (шаг 6)
// и на 11 — это и есть сломанный ритм, а не просто «сдвинутый».
$: stack(
     s("~ ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~").gain(snareVol.mul(m0)),
     s("~ ~ ~ ~ ~ ~ sd ~ ~ ~ sd ~ ~ ~ ~ ~").gain(snareVol.mul(m1).mul(0.9)),
     s("~ ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~").gain(snareVol.mul(m2).mul(1.15)),
     s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").gain(snareVol.mul(m3).mul(0.85)),
   )
  .lpf(snareCut).hpf(180)
  .decay(snareDecay).sustain(0).release(0.08)
  .room(verb).roomsize(verbSize)

// КЛЭП — 2 и 4, но в ломе его нет: там снейр, и вместе они звучат как каша.
$: stack(
     s("~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~").gain(clapVol.mul(m0)),
     s("~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~").gain(clapVol.mul(m2).mul(0.9)),
     s("~ ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~").gain(clapVol.mul(m3)),
   )
  .lpf(clapCut).hpf(clapHpf).lpq(3)
  .crush(clapCrush)
  .decay(0.12).sustain(0)
  .pan(rand.mul(1.2).sub(0.6))
  .room(0.3).roomsize(verbSize)

// ХЭТЫ — 16-е с роллами. ply(2) внутри sometimesBy даёт 32-е не везде,
// а случайно: это дешевле и живее, чем писать 32-е в паттерн. worklet'ов
// здесь нет вообще — 32 события в такт их не переживут.
$: stack(
     s("hh*16").gain(hatVol.mul("[1 .4 .7 .4]*4").mul(m0)),
     s("hh*8").gain(hatVol.mul("[1 .5]*4").mul(m1)),
     s("hh*8").gain(hatVol.mul("[1 .6 .4 .6]*2").mul(m2)),
     s("hh*16").gain(hatVol.mul("[1 .5 .8 .5]*4").mul(m3)),
   )
  .lpf(hatCut).hpf(320)
  .sometimesBy(0.35, (x) => x.ply(2))
  .lastOf(4, (x) => x.ply(2))
  .nudge(rand.mul(0.012).sub(0.006))
  .degradeBy(0.06)

// ОТКРЫТЫЕ ХЭТЫ — на «и», это то, что раскачивает полутемп
$: stack(
     s("~ ~ oh ~ ~ ~ ~ ~ ~ ~ oh ~ ~ ~ ~ ~").gain(ohatVol.mul(m0)),
     s("~ ~ ~ ~ oh ~ ~ ~ ~ ~ ~ ~ oh ~ ~ ~").gain(ohatVol.mul(m1)),
     s("~ ~ ~ ~ ~ ~ ~ ~ oh ~ ~ ~ ~ ~ ~ ~").gain(ohatVol.mul(m2).mul(1.2)),
     s("~ ~ oh ~ ~ ~ ~ ~ ~ ~ oh ~ ~ ~ ~ ~").gain(ohatVol.mul(m3)),
   )
  .lpf(ohatCut)
  .room(verb).roomsize(verbSize)

// RIM — 5 тактов, поэтому не совпадает с хэтами. Только лом и дробь.
$: stack(
     s("rim ~ ~ ~ ~ ~ rim ~ ~ ~ rim ~ ~ ~ ~ ~").gain(rimVol.mul(m1)),
     s("~ ~ rim ~ ~ ~ ~ ~ rim ~ ~ ~ ~ ~ rim ~").gain(rimVol.mul(m3).mul(0.8)),
   )
  .lpf(rimCut).hpf(500).lpq(2)
  .decay(0.05).sustain(0)
  .pan(rand.mul(1.4).sub(0.7))
  .delay(0.2).delaytime(0.3333).delayfeedback(0.28)

// ШЕЙКЕР — 3 такта, 16-е с вероятностным пропуском: сетка есть, рисунка нет
$: s("sh*16")
  .gain(shakerVol.mul(0.7))
  .lpf(shakerCut).hpf(2000)
  .decay(0.03).sustain(0)
  .degradeBy(0.4)
  .pan(rand.mul(0.8).add(0.1))

// ТАРЕЛКА — шумом, раз в 8 тактов. Не зависит от того, какие сэмплы есть.
$: s("white")
  .gain(crashVol.mul("<1 0 0 0 0 0 0 0>"))
  .lpf(crashCut).hpf(4000)
  .attack(0.002).decay(0.9).sustain(0).release(0.5)
  .room(verb).roomsize(verbSize)

// ══════════════════════════════════════════════════════════════════
//  303 — БЕРЛИНСКАЯ ФАКТУРА
// ══════════════════════════════════════════════════════════════════

// ЭЙСИД — пила, ladder-фильтр, drive. Фильтр-огибающая с атакой 2 мс:
// каждая нота — «квак» внутрь себя. Слайд — glide, но РЕДКО (гейт на 4-х
// позициях): в берлинском эйсиде слайд — акцент, а не стиль.
// Грязь — только drive (перегруз самого фильтра). shape и crush сюда не
// ставим: 8 нот × worklet на каждую — это уже дорого, а звук не изменится.
$: note(ACID)
  .s("sawtooth")
  .glide(acidGlide.mul("0 0 0 1 0 0 0 0 0 0 1 0 0 0 0 0"))
  .gain(acidVol.mul("[1 .5 .8 .5 .9 .5 .7 .5 1 .5 .8 .5 .85 .5 .7 .55]"))
  .lpf(acidCut).lpq(acidRes).ftype("ladder").drive(acidDrive)
  .lpenv(acidEnv)
  .lpa(0.002).lpd(acidDecay).lpsustain(0.15)
  .lpdepth(acidLfo).lpsync(0.25).lpdc(0)
  .decay(0.12).sustain(0.3).release(0.04)
  .delay(acidEcho).delaytime(0.375).delayfeedback(0.34)
  .room(0.2).roomsize(verbSize)
  .orbit(2)

// ЭЙСИД-ОТВЕТ — высокий, редкий, с большим дилеем. Это не второй слой
// линии, а реплика: три ноты за 8 тактов.
$: note(GHOST)
  .s("square")
  .gain(ghostVol)
  .lpf(acidCut.mul(2.4)).lpq(acidRes.mul(0.7))
  .lpenv(acidEnv.mul(0.7))
  .lpa(0.003).lpd(0.2).lpsustain(0.05)
  .decay(0.2).sustain(0.1).release(0.3)
  .delay(0.55).delaytime(0.5).delayfeedback(0.5)
  .pan(sine.slow(8).range(0.3, 0.7))
  .room(0.3).roomsize(verbSize)

// ══════════════════════════════════════════════════════════════════
//  МЕЛОДИЯ — два режима, одна фраза
// ══════════════════════════════════════════════════════════════════

// КОЛОКОЛЬЧИКИ — треугольник, короткий спад, длинный дилей. Второй голос
// (октавой ниже) даёт «двойной колокол» без второго инструмента.
$: note(MEL)
  .s("triangle")
  .gain(melVol.mul(hA))
  .lpf(melCut).lpq(2)
  .attack(0.002).decay(melDecay).sustain(0.05).release(0.4)
  .delay(melEcho).delaytime(0.375).delayfeedback(0.45)
  .room(verb).roomsize(verbSize)
  .pan(sine.slow(8).range(0.35, 0.65))

// ВОКОДЕР — та же фраза, другой инструмент. Настоящего вокодера в движке
// нет (нужен носитель + модулятор), поэтому имитация: суперпила через
// вокальный фильтр vowel с бегущими гласными, phaser и хорус. Звучит как
// робот-хор; на слух это ближе всего к вокодеру из доступного.
// Гласные идут по кругу <a e i o u> со скоростью vocVowel.
$: note(MEL)
  .add(note(0))
  .s("supersaw").unison(3).detune(0.18)
  .gain(melVol.mul(hB).mul(0.85))
  .lpf(vocCut).lpq(4).ftype("24db")
  .vowel(m("<a e i o u>").fast(vocVowel))
  .phaser(vocPhase)
  .chorus(vocChorus)
  .attack(0.03).decay(0.4).sustain(0.55).release(0.5)
  .room(verb).roomsize(verbSize)

// ══════════════════════════════════════════════════════════════════
//  ГАРМОНИЯ — пэд и стаб, оба тихие
// ══════════════════════════════════════════════════════════════════

// ПЭД — квинты, срез низко: он не должен спорить с мелодией за место
$: note(PAD)
  .s("sawtooth").unison(3).detune(padDet)
  .gain(padVol)
  .lpf(padCut).lpq(padQ).ftype("24db")
  .lpdepth(padLfo).lpsync(0.125).lpdc(0)
  .chorus(0.25)
  .attack(1.6).decay(1.5).sustain(0.9).release(2.5)
  .room(verb).roomsize(verbSize)

// СТАБ — b9 (gb) раз в 8 тактов. Короткий удар, длинный хвост в реверб:
// малая нона тут живёт 200 мс, а не такт, поэтому не превращается в кашу.
$: note(STAB)
  .s("square")
  .gain(stabVol)
  .lpf(stabCut).lpq(5)
  .vowel("<a o>")
  .decay(stabDecay).sustain(0).release(0.6)
  .room(verb).roomsize(verbSize)

// ══════════════════════════════════════════════════════════════════
//  IDM — микротайминг и цифровая пыль, а не реверб-холл
// ══════════════════════════════════════════════════════════════════

// БЛИПЫ — высокие точки. 3 такта, поэтому фраза не совпадает с гармонией.
// coarse — worklet, но событий всего 8 в такт, это по карману.
// rev внутри sometimesBy: половина блипов играет наоборот.
$: note("[c6|eb6|f6|ab6|bb5]*8")
  .struct("~ x ~ ~ x ~ ~ ~")
  .s("sine")
  .gain(blipVol)
  .lpf(blipCut)
  .coarse(6)
  .decay(0.04).sustain(0)
  .delay(blipDelay).delaytime(blipTime).delayfeedback(0.55)
  .pan(rand.mul(1.8).sub(0.9))
  .degradeBy(0.25)
  .sometimesBy(0.35, (x) => x.rev())

// ТИКИ — белый шум, узкий band-pass. Это «цифровая пыль»: слышно, что
// что-то происходит, но что именно — нет.
$: s("white")
  .struct("x ~ ~ x ~ ~ ~ x ~ ~ x ~ ~ ~ x ~")
  .gain(tickVol.mul(0.6))
  .bpf(tickCut).bpq(14)
  .decay(0.02).sustain(0)
  .pan(rand.mul(1.6).sub(0.8))
  .sometimesBy(0.3, (x) => x.crush(4))

// ГРАНУЛЯРНАЯ ПЫЛЬ — тот же шум, но с длинным хвостом и бит-крушем.
// pressBy(0.4) сдвигает каждое событие внутрь его же длины: получается
// «заикание» (событие начинается позже и обрублено), а не ровный поток.
// Именно pressBy, а не press: press — это pressBy(0.5) без аргумента.
$: s("pink")
  .struct("x ~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~ ~")
  .gain(gritVol.mul(0.5))
  .lpf(gritCut).lpq(6)
  .crush(gritCrush)
  .decay(0.08).sustain(0)
  .pressBy(0.4)
  .pan(rand.mul(1.2).sub(0.6))

// «ЛЕНТА» — пила, играющая с неверной скоростью: speed 0.5 растягивает
// осциллятор вниз и в длину. Это дешёвый tape-stop без сэмпла.
$: note(ROOT)
  .s("sawtooth")
  .speed(tapeSpeed)
  .gain(tapeVol.mul(0.5))
  .lpf(900).lpq(2)
  .attack(0.6).decay(0.8).sustain(0.4).release(1.2)
  .room(verb).roomsize(verbSize)

// РАЙЗЕР — шум, у которого срез ползёт вверх за 8 тактов. Не «белый шум
// с ревербом», а именно подъём: слышно направление.
$: s("white")
  .gain(riserVol.mul("<0 0 0 0 0 0 0 1>"))
  .lpf(sine.range(300, riserCut).slow(8)).lpq(8)
  .attack(1.2).decay(0.4).sustain(0.7).release(0.3)
  .pan(sine.slow(16).range(0.2, 0.8))

// ОБРАТНЫЙ СВЕЛЛ — тот же шум, но с атакой 1.4 с: это и есть реверс-тарелка
// без сэмпла. Стоит за такт до импакта.
$: s("white")
  .gain(swellVol.mul("<0 0 0 0 0 0 0 1>"))
  .lpf(swellCut).hpf(700)
  .attack(1.4).decay(0.05).sustain(0).release(0.05)
  .room(0.5).roomsize(verbSize)

// ИМПАКТ — низкий синус с длинным хвостом, раз в 8 тактов. Не барабан:
// это точка, в которую приходит трек.
$: note("f1")
  .s("sine")
  .gain(impactVol.mul("<1 0 0 0 0 0 0 0>"))
  .lpf(110)
  .attack(0.002).decay(1.6).sustain(0).release(0.8)
  .room(0.4).roomsize(verbSize)

// ДАЛЬНИЙ КОЛОКОЛ — 5 тактов, синус с дилеем. Живёт на границе слышимости:
// появляется раз в 5 тактов и уходит.
$: note("[f5|ab5|c6]*4")
  .struct("x ~ ~ ~")
  .s("sine")
  .gain(bellVol.mul(0.5))
  .lpf(bellCut)
  .decay(0.6).sustain(0).release(1)
  .delay(0.5).delaytime(0.75).delayfeedback(0.55)
  .room(0.6).roomsize(verbSize)
  .pan(rand.mul(1.4).sub(0.7))

// ══════════════════════════════════════════════════════════════════
//  ШПАРГАЛКА НА НОЧЬ
// ══════════════════════════════════════════════════════════════════
//  пустота:       air 0.12 + verb 0.5, дрон 0.18, песок 0.04
//  вход:          + kick 0.9 (mode 0) → sub 0.5 → eight 0.8
//  808:           eightCut 160 (выше 300 уже не саб), eightDecay 0.9,
//                 eightGlide 0.09 (0.03 — щелчок, 0.2 — явный «слайд»)
//  полутемп:      mode 2 — бочка на 1, снейр на 3, хэты 8-ми
//  лом:           mode 1 — бочка euclid 5/16, снейр на 2 и 11
//  дробь:         mode 3 — 16-е бочки, для сбивки на 1–2 такта
//  эйсид:         acid 0.7, acidCut 300 → 1200 (ручка — это и есть 303)
//  злее:          acidRes 16 → 24, acidDrive 1.3 → 2 (шершавость)
//  мелодия:       mel 0.6, harmony 0 ⇄ 1 на границе 8 тактов
//  вокодер:       vocCut 2600 → 900 (темнее, «телефон»), vocVowel 3 → 6
//  IDM:           blip 0.3, tick 0.25, grit 0.2, pressBy на grit 0.4
//  тормозит:      grit в 0 (crush на 6 нотах), tick в 0, verbSize 8 → 5
//  импакт/райзер: раз в 8 тактов, вместе с mode 3 на 1 такт
// ══════════════════════════════════════════════════════════════════
