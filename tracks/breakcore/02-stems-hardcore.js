// ══════════════════════════════════════════════════════════════════
//  HARDCORE 02  ·  Strudel  ·  200 BPM  ·  stems / gabber  ·  F phrygian
//
//  Написан С НУЛЯ. Никаких патчей, рисунков, нот и ручек из
//  13-gabber-v3: другая тональность (F, bII = Gb), другая структура,
//  другой кик (параллельный dry/wet, два разных источника), нет 303,
//  нет мелодии вообще.
//
//  ── ИСТОЧНИКИ (только практики, не вкусовщина) ──────────────────
//  • Gearspace #630598: «раздели кик на два канала — сухой и мокрый,
//    обработай мокрый и сведи обратно; это огромная разница». И там же:
//    «слой резкого транзиента одного кика поверх грязного buzz другого».
//  • KVR #107771: треугольник → фильтр с падением питча сразу после
//    щелчка → сильная компрессия → overdrive 100% wet → МУЛЬТИБЭНД-
//    дисторшн, который «искажает и подчёркивает верх, оставляя низ
//    гладким».
//  • Audiosex #83974: цепочка EQ → distortion → EQ → distortion →
//    comb filter → clippers, чтобы приручить пики.
//  • BeatKey: 160–200 BPM; синус с питч-огибающей 200–500 Гц → корень
//    за 10–50 мс; hard clip 6–18 дБ; кик в тональности (F1 = 43.7 Гц);
//    reverse bass НЕТ; короткие брейки; мастер −8…−5 LUFS.
//  • Renoise #44325: трёхчастный кик (чистый клик, дисторшн-часть,
//    чистый саб); дисторшн на сенде с EQ; кабинет после дисторшна
//    убирает mid-bloat.
//  • GitHub vdgbcrypto/gabber-kick-distortion: LR4-кроссовер 50–150 Гц,
//    саб возвращается чистым (~0.7), верх: pre-EQ → tanh → клиппер.
//  • Reddit r/TechnoProduction: «плоский и резкий» = дисторшишь слишком
//    много всего и слишком сильно; квадрат съедает тело.
//
//  ── ГОТОВЫЙ ДИСТОРТЕД-КИК ──────────────────────────────────────
//  Не делать дисторшн самому: в Dirt-Samples есть `hardkick` —
//  `hardcore:4` / `5` — hckick1/hckick2, уже хардкоровые кики.
//  Ручка `char` выбирает hckick1/hckick2; wet-слой только EQ-ится
//  и слегка склеивается шейпером. Никакого повторного клиппинга.
//
//  ── ТРИ КИКА ────────────────────────────────────────────────────
//  1) DRY   — 909, чистый низ и тело;
//  2) WET   — готовый `hardkick` (VEC1 BD Distortion), характер;
//  3) EXTRA — синтезированный перегруз (hardcore:4 + shape/distort).
//     По умолчанию 0: это «третий характер», который можно тихо
//     подмешать фейдером Kick extra, не меняя первые два.
//
//  ── КИК: ПАРАЛЛЕЛЬНЫЙ DRY/WET (главное) ────────────────────────
//   DRY  — 909 bd, lpf 120: тело и низ. Всегда в миксе, но тише при
//          перегрузе. Плюс BODY: синус F1 с падением питча.
//   WET  — ДРУГОЙ источник (hardcore:4), hpf 90 → lpf 2000 → shape →
//          distort → (верх режется после клиппинга). Это buzz.
//   CLICK — белый шум 4 мс, hpf 3500: резкий транзиент поверх buzz,
//          без дисторшна. Именно так «читается» на маленьких колонках.
//   kick=clean — wet выключен (обычная бочка); dist/hard — wet включён,
//   dry подмешивается 0.6/0.45. Это ДВА разных кика, а не ручка drive.
//
//  ── ШУМ КАК ИНСТРУМЕНТ (Myloops, industrial textures) ───────────
//  • Не брать готовые wind/noise-сэмплы: строить текстуры из белого,
//    розового и коричневого шума, играя фильтром как инструментом.
//  • Сначала дисторшн, ПОТОМ фильтр: гармоники рождаются до среза, а не
//    после (иначе они висят поверх микса и звучат хрупко).
//  • Короткий feedback-делэй 2–40 мс = металл: линия резонирует на 1/t.
//    Для F3 (174.6 Гц) это 5.7 мс; модуляция времени «гнёт» металл.
//  • Текстуры дышат: LFO 0.1–0.3 Гц на срез, панорама LFO, разная
//    скорость слоёв. Никакого «ровного ветра» на весь трек.
//
//  ── НИЗ КИКА ────────────────────────────────────────────────────
//  kickDry.pitch — высота сэмплов в полутонах (по умолчанию −4). BODY
//  остаётся на F1: саб в тональности, а вес берём из низкого сэмпла.
//
//  ── DRIVE THEN TRIM (жирно, но не громко) ───────────────────────
//  В superdough порядок фиксирован: shape/distort → … → gain (выход).
//  Поэтому «сначала драйв, потом убавь громкость» делается буквально:
//  shape/distort вверх, .gain() вниз. Выходная громкость остаётся
//  обычной, а перегруз — реальный.
//  Драйв есть ТОЛЬКО у кика: kickWet.drive (лёгкая склейка) и
//  kickExtra.drive (третий характер). Глобального драйва нет — он
//  валил query и размывал микс.
//
//  ── ТЕМП СЛОЯ ───────────────────────────────────────────────────
//  У баса и кислоты свои ручки `pace` в Tone: `.slow(n)`.
//  1 = 8-е, 2 = 4-е, 4 = половинные. decay/release меняют длину
//  ноты, но не частоту событий. Гейт glide замедляется тем же n.
//
//  ── КИСЛОТА (рецепт Switch Angel) ───────────────────────────────
//  Не портаменто на каждой ноте — от этого «полоскание горла».
//  • supersaw + detune 0.5 + unison 1 (её acid-патч);
//  • glide только на ВЫБРАННЫХ 16-х: гейт-паттерн без угловых скобок
//    (`0 0 1 …` = 16 шагов), иначе он становится константой;
//  • accent = громче И ярче одним движением;
//  • РАЗРЕЖЕНО: 3–5 нот на такт по 8-м, интервалы шире (f→ab, gb→bb).
//    Плотный 16-й поток + хроматика f→gb + glide = «бурление».
//
//  ── ЗАКОНЧЕННЫЙ ТРЕК ────────────────────────────────────────────
//  scene = intro → build → main → break → outro. Это аранжировка:
//  кик/бас/кислота/пэд входят и уходят по сценам, а не всё сразу.
//
//  ── СТИЛЬ ───────────────────────────────────────────────────────
//  F + Gb, две ноты. Никаких аккордов, арпеджио и «мелодий». Ритм —
//  это и есть музыка; фон — дрон, ветер, ржавчина. Anti-pop.
//
//  ── 🛑 CPU ──────────────────────────────────────────────────────
//  shape/distort/crush — worklet на событие. Кик ≤16 событий, ок.
//  Хэты (16) — без worklet'ов. Burst-пэд — только когда держат.
// ══════════════════════════════════════════════════════════════════

const BPM = 200
setcpm(BPM / 4)

if (typeof samples === 'function') {
  samples('github:tidalcycles/Dirt-Samples')
}

// ── ШИРИНА СЛАЙДЕРОВ + СИНХРОНИЗАЦИЯ ─────────────────────────────
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
//  GLIDE — настоящий слайд 303 (рецепт Switch Angel)
// ══════════════════════════════════════════════════════════════════
// Из github.com/switchangel/strudel-scripts. Считаем, ОТ какой ноты едем:
// для каждой ноты берём частоту предыдущей и ставим питч-огибающую
// (panchor 0, psustain 0, pattack 0, pdecay = время, penv = -12*log2(fTo/fFrom)).
// Интервал точный, глиссандо переживает несколько нот. Это НЕ `.slide()`:
// slide с паттерном в 1.2.6 валит query (`cannot parse as numeral`).
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

// ── ПЕРЕКЛЮЧАТЕЛИ + ПЭДЫ ─────────────────────────────────────────
// @switches scene=intro,build,main,break,outro mode=ritual,stomp,roll,half,collapse kick=clean,dist,hard char=kick1,kick2 perc=dry,metal
// @pads padFill,padRoll,padBurst,padGate
const scene = slider(2, 0, 4, 1)
const mode = slider(1, 0, 4, 1)
const kick = slider(1, 0, 2, 1)
const char = slider(0, 0, 1, 1)
const perc = slider(1, 0, 1, 1)

const padFill = slider(0, 0, 1, 1)
const padRoll = slider(0, 0, 1, 1)
const padBurst = slider(0, 0, 1, 1)
const padGate = slider(0, 0, 1, 1)

const verb = slider(0.12, 0, 1, 0.01)
const duck = slider(0.75, 0, 1, 0.01)

// ── ГЕЙТЫ ────────────────────────────────────────────────────────
const at = (n) => mode.fmap((v) => (v === n ? 1 : 0))
const mRitual = at(0)
const mStomp = at(1)
const mRoll = at(2)
const mHalf = at(3)
const mCollapse = at(4)
// снейр: только stomp/roll/half
const gSnare = mode.fmap((v) => (v >= 1 && v <= 3 ? 1 : 0))
// клэп: только roll/half
const gClap = mode.fmap((v) => (v === 2 || v === 3 ? 1 : 0))
// металл: везде кроме ritual/collapse
const gPerc = mode.fmap((v) => (v >= 1 && v <= 3 ? 1 : 0)).mul(perc)

// ── АРАНЖИРОВКА (scene) ─────────────────────────────────────────
// intro 0 · build 1 · main 2 · break 3 · outro 4
const arrKick = scene.fmap((v) => (v === 3 ? 0 : 1))
const arrHats = scene.fmap((v) => (v === 0 || v === 4 ? 0 : 1))
const arrSnare = scene.fmap((v) => (v === 2 ? 1 : 0))
const arrBass = scene.fmap((v) => (v >= 1 && v <= 3 ? 1 : 0))
const arrAcid = scene.fmap((v) => (v === 2 || v === 3 ? 1 : 0))
const arrPad = scene.fmap((v) => (v >= 1 && v <= 3 ? 1 : 0))
const arrTex = scene.fmap((v) => (v === 3 ? 1.15 : 1))


// ── KICK: DRY/WET ────────────────────────────────────────────────
// clean — wet выключен. dist/hard — wet включён, dry подмешан.
const wetOn = kick.fmap((v) => (v === 0 ? 0 : 1))
const dryMix = kick.fmap((v) => [1, 0.6, 0.45][v])
// готовые дистортед-кики из Dirt-Samples, выбор по char
const wetN = char.fmap((v) => 4 + v)

// ── РИСУНКИ КИКА ─────────────────────────────────────────────────
const K_RITUAL = m('x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~')
const K_STOMP = m('x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~')
const K_HALF = m('x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~')
const K_COLLAPSE = m('x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~')


// ── ДЕРЕВО ───────────────────────────────────────────────────────
const instruments = {
  drums: {
    name: 'Drums',
    kickDry: {
      name: 'Kick dry',
      // сухой канал: тело и низ, БЕЗ дисторшна
      vol: slider(0.4, 0, 0.8, 0.01),
      cut: slider(120, 60, 300, 5),
      // высота кика в полутонах: ниже = больше веса. Только сэмплы,
      // BODY остаётся на F1, чтобы не уехать из тональности.
      pitch: slider(-4, -12, 6, 1),
      tune: slider(0.9, 0.6, 1.3, 0.01),
      decay: slider(0.16, 0.06, 0.4, 0.01),
    },
    kickWet: {
      name: 'Kick wet',
      // мокрый канал: только средняя полоса, которую искажаем
      vol: slider(0.3, 0, 0.6, 0.01),
      hpf: slider(90, 60, 300, 5),
      cut: slider(2000, 500, 6000, 50),
      decay: slider(0.14, 0.05, 0.4, 0.01),
      // только лёгкая склейка: сэмпл уже перегружен
      drive: slider(0.5, 0, 1.5, 0.01),
    },
    kickExtra: {
      name: 'Kick extra',
      // третий характер: синтезированный перегруз; по умолчанию тихо
      vol: slider(0, 0, 0.5, 0.01),
      hpf: slider(100, 60, 400, 5),
      cut: slider(1800, 400, 6000, 50),
      decay: slider(0.12, 0.04, 0.4, 0.01),
      drive: slider(1.8, 0.4, 3.2, 0.01),
    },
    kickBody: {
      name: 'Kick body',
      vol: slider(0.34, 0, 0.8, 0.01),
      cut: slider(70, 45, 150, 5),
      drop: slider(20, 0, 36, 1),
      decay: slider(0.2, 0.06, 0.5, 0.01),
    },
    click: {
      name: 'Click',
      // резкий транзиент поверх buzz — без дисторшна
      vol: slider(0.12, 0, 0.5, 0.01),
      cut: slider(9000, 3000, 16000, 100),
    },
    roll: {
      name: 'Roll wet',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(1600, 300, 6000, 50),
      decay: slider(0.06, 0.02, 0.2, 0.005),
    },
    snare: {
      name: 'Snare',
      vol: slider(0.24, 0, 1, 0.01),
      cut: slider(5000, 800, 14000, 100),
      decay: slider(0.1, 0.03, 0.4, 0.01),
    },
    clap: {
      name: 'Clap',
      vol: slider(0.18, 0, 0.9, 0.01),
      cut: slider(6500, 800, 14000, 100),
    },
    hat: {
      name: 'Hats',
      vol: slider(0.1, 0, 0.9, 0.01),
      cut: slider(8500, 800, 16000, 100),
    },
    ohat: {
      name: 'Open hats',
      vol: slider(0.07, 0, 0.7, 0.01),
      cut: slider(6000, 800, 16000, 100),
    },
    metal: {
      name: 'Metal ring',
      // не сэмпл: щелчок в короткий feedback-делэй, настроенный на F3
      vol: slider(0.1, 0, 0.5, 0.01),
      cut: slider(8000, 2000, 16000, 100),
      time: slider(0.0057, 0.003, 0.012, 0.0001),
      fb: slider(0.72, 0.3, 0.88, 0.01),
    },
    fill: {
      name: 'Fill pad',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(6000, 800, 14000, 100),
    },
    burst: {
      name: 'Burst pad',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(9000, 800, 16000, 100),
      crush: slider(4, 1, 16, 0.5),
    },
    gate: {
      name: 'Gate pad',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(8000, 800, 16000, 100),
      crush: slider(4, 1, 16, 0.5),
    },
  },
  bass: {
    name: 'Bass',
    line: {
      name: 'Bass line',
      vol: slider(0.18, 0, 0.7, 0.01),
      cut: slider(80, 60, 100, 1),
      decay: slider(0.14, 0.04, 0.4, 0.01),
      // 1 = 8-е, 2 = 4-е, 4 = половинные
      pace: slider(2, 1, 4, 1),
    },
  },
  lead: {
    name: 'Lead',
    acid: {
      name: 'Acid 303',
      vol: slider(0.2, 0, 0.7, 0.01),
      cut: slider(700, 300, 5000, 50),
      res: slider(7, 2, 18, 0.5),
      env: slider(1.6, 0, 6, 0.1),
      decay: slider(0.18, 0.03, 0.35, 0.005),
      glide: slider(0.06, 0, 0.2, 0.005),
      // 1 = 8-е, 2 = 4-е, 4 = половинные
      pace: slider(2, 1, 4, 1),
    },
  },
  synth: {
    name: 'Synth',
    pad: {
      name: 'Pad',
      vol: slider(0.06, 0, 0.4, 0.01),
      cut: slider(700, 200, 3000, 25),
      attack: slider(0.6, 0.1, 2, 0.05),
      release: slider(1.5, 0.3, 4, 0.1),
      detune: slider(8, 0, 30, 1),
    },
  },
  atmos: {
    name: 'Atmos',
    air: {
      name: 'Air noise',
      // белый шум: shape → lpf-свип. Срез едет, а не стоит.
      vol: slider(0.05, 0, 0.4, 0.01),
      rate: slider(16, 2, 64, 1),
      q: slider(10, 1, 20, 0.5),
    },
    rust: {
      name: 'Rust drone',
      // розовый шум + резонансный lpf, очень медленный LFO
      vol: slider(0.04, 0, 0.3, 0.01),
      rate: slider(24, 4, 64, 1),
      q: slider(7, 1, 18, 0.5),
    },
    rumble: {
      name: 'Rumble',
      vol: slider(0.06, 0, 0.4, 0.01),
      cut: slider(90, 50, 200, 5),
    },
  },
  fx: {
    name: 'FX',
    reverb: {
      name: 'Reverb',
      size: slider(2, 0.5, 12, 0.1),
    },
  },
}

const { drums, bass, lead, synth, atmos, fx } = instruments

// полутоны → множитель скорости (2^(n/12)); ниже питч = ниже бочка.
const kickRate = drums.kickDry.pitch.fmap((st) => Math.pow(2, st / 12))

const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}

// ── ФРАЗЫ ────────────────────────────────────────────────────────
const phrase = (bars) => m('<' + bars.join(' ') + '>')
// @roots f f gb f
const PAD = phrase([
  '[f2] [f2] [gb2] [f2]',
])

// Гроул: F1 с заходом в bII (Gb1). Две ноты, без мелодии.
// Бас-линия: 8-е, F/Gb, без мелодии. Срез ≤ 80 по правилам проекта.
const BASS_LINE = m('[f1 ~ f1 ~ f1 ~ f1 ~] [f1 ~ f1 ~ f1 ~ f1 ~] [gb1 ~ gb1 ~ gb1 ~ gb1 ~] [f1 ~ f1 ~ f1 ~ f1 ~]')
// 303: 16-е, одна-две ноты, без восходящих трезвучий.
const ACID = m('[f2 ~ ~ f2 ~ ~ ab2 ~] [f2 ~ f2 ~ ~ gb2 ~ ~] [gb2 ~ ~ gb2 ~ ~ bb2 ~] [f2 ~ ~ f2 ~ ab2 ~ ~]')
// Пэд: только квинты, две тональности. Это фон, не мелодия.
const PAD_CHORDS = m('<[f3,c4] [f3,c4] [gb3,db4] [f3,c4]>')

// ══════════════════════════════════════════════════════════════════
//  ДОРОЖКИ
// ══════════════════════════════════════════════════════════════════

// KICK DRY — сухой канал, 909. Всегда в миксе, но при перегрузе тише.
$: stack(
     s("bd").struct(K_RITUAL).gain(drums.kickDry.vol.mul(mRitual).mul(dryMix).mul(arrKick)),
     s("bd").struct(K_STOMP).gain(drums.kickDry.vol.mul(mStomp).mul(dryMix).mul(arrKick)),
     s("bd").struct(K_HALF).gain(drums.kickDry.vol.mul(mHalf).mul(dryMix).mul(arrKick)),
     s("bd").struct(K_COLLAPSE).gain(drums.kickDry.vol.mul(mCollapse).mul(dryMix).mul(arrKick)),
   )
  .speed(drums.kickDry.tune.mul(kickRate))
  .lpf(drums.kickDry.cut).lpq(1)
  .decay(drums.kickDry.decay).sustain(0).release(0.04)
  .duckorbit(2).duckdepth(duck).duckattack(0.03)
  ._pianoroll()
  .filter(audible)

// KICK WET — параллельный мокрый канал. ДРУГОЙ источник, узкая полоса:
// hpf → шейпер → клип → lpf. Низ сюда не попадает, поэтому не «орёт»
// и не размазывает саб. Именно это даёт реальный перегруз, а не gain.
$: stack(
     s("hardcore").n(wetN).struct(K_RITUAL).gain(drums.kickWet.vol.mul(mRitual).mul(wetOn).mul(arrKick)),
     s("hardcore").n(wetN).struct(K_STOMP).gain(drums.kickWet.vol.mul(mStomp).mul(wetOn).mul(arrKick)),
     s("hardcore").n(wetN).struct(K_HALF).gain(drums.kickWet.vol.mul(mHalf).mul(wetOn).mul(arrKick)),
     s("hardcore").n(wetN).struct(K_COLLAPSE).gain(drums.kickWet.vol.mul(mCollapse).mul(wetOn).mul(arrKick)),
   )
  .speed(drums.kickDry.tune.mul(kickRate))
  .hpf(drums.kickWet.hpf).lpf(drums.kickWet.cut).lpq(1)
  .shape(drums.kickWet.drive.mul(0.18))
  .decay(drums.kickWet.decay).sustain(0).release(0.03)
  .filter(audible)

// KICK EXTRA — третий характер: тот самый синтезированный перегруз.
// По умолчанию 0; поднимаешь `Kick extra`, если нужен ещё один слой.
$: stack(
     s("hardcore:4").struct(K_RITUAL).gain(drums.kickExtra.vol.mul(mRitual).mul(wetOn).mul(arrKick)),
     s("hardcore:4").struct(K_STOMP).gain(drums.kickExtra.vol.mul(mStomp).mul(wetOn).mul(arrKick)),
     s("hardcore:4").struct(K_HALF).gain(drums.kickExtra.vol.mul(mHalf).mul(wetOn).mul(arrKick)),
     s("hardcore:4").struct(K_COLLAPSE).gain(drums.kickExtra.vol.mul(mCollapse).mul(wetOn).mul(arrKick)),
   )
  .speed(drums.kickDry.tune.mul(kickRate))
  .hpf(drums.kickExtra.hpf).lpf(drums.kickExtra.cut).lpq(1)
  .shape(drums.kickExtra.drive.mul(0.45))
  .decay(drums.kickExtra.decay).sustain(0).release(0.03)
  .filter(audible)

// KICK BODY — синус по корню F1 с падением питча (BeatKey: 200–500 Гц
// → корень за 10–50 мс). Длина, которой у 909 нет.
$: stack(
     note("<f1 f1 gb1 f1>").s("sine").struct(K_RITUAL).gain(drums.kickBody.vol.mul(mRitual).mul(arrKick)),
     note("<f1 f1 gb1 f1>").s("sine").struct(K_STOMP).gain(drums.kickBody.vol.mul(mStomp).mul(arrKick)),
     note("<f1 f1 gb1 f1>").s("sine").struct(K_HALF).gain(drums.kickBody.vol.mul(mHalf).mul(arrKick)),
     note("<f1 f1 gb1 f1>").s("sine").struct(K_COLLAPSE).gain(drums.kickBody.vol.mul(mCollapse).mul(arrKick)),
   )
  .lpf(drums.kickBody.cut).lpq(1)
  .penv(drums.kickBody.drop).panchor(0).pattack(0.002).pdecay(0.08).psustain(0).pcurve(1)
  .attack(0.002).decay(drums.kickBody.decay).sustain(0).release(0.1)
  .filter(audible)

// CLICK — белый шум 4 мс. Резкий транзиент поверх buzz (Gearspace:
// «sharp transient of one kick on top of a dirty buzz»). Без клиппинга.
$: stack(
     s("white").clip(0.004).struct(K_RITUAL).gain(drums.click.vol.mul(mRitual).mul(arrKick)),
     s("white").clip(0.004).struct(K_STOMP).gain(drums.click.vol.mul(mStomp).mul(arrKick)),
     s("white").clip(0.004).struct(K_HALF).gain(drums.click.vol.mul(mHalf).mul(arrKick)),
     s("white").clip(0.004).struct(K_COLLAPSE).gain(drums.click.vol.mul(mCollapse).mul(arrKick)),
   )
  .hpf(3500).lpf(drums.click.cut)
  .filter(audible)

// ROLL — 16-е мокрого канала. Отдельная дорожка: короткий decay, иначе
// 13 ударов в секунду слипаются. Играет в mode=roll и по пэду.
$: s("hardcore").n(wetN)
  .fast(16)
  .gain(drums.roll.vol.mul(mRoll.add(padRoll)).mul(wetOn))
  .hpf(120).lpf(drums.roll.cut)
  .shape(drums.kickWet.drive.mul(0.14))
  .decay(drums.roll.decay).sustain(0)
  .duckorbit(2).duckdepth(duck).duckattack(0.02)
  .filter(audible)

// SNARE — 5 и 13. Только фильтр, без worklet'ов.
$: s("<hardcore:10 hardcore:11>")
  .struct("~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~")
  .hpf(180).lpf(drums.snare.cut)
  .decay(drums.snare.decay).sustain(0).release(0.04)
  .gain(drums.snare.vol.mul(gSnare).mul(arrSnare))
  .room(verb.mul(0.2)).roomsize(fx.reverb.size)
  .filter(audible)

// CLAP — только roll/half: второй слой, чтобы снейр не был один.
$: s("hardcore:11")
  .struct("~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~")
  .hpf(320).lpf(drums.clap.cut)
  .crush(10)
  .gain(drums.clap.vol.mul(gClap).mul(arrSnare))
  .filter(audible)

// HATS — 8-е, без worklet'ов. В roll 4-е: 16-е заняты бочкой.
$: stack(
     s("hh").struct("x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~").gain(drums.hat.vol.mul(mRitual).mul(0.7).mul(arrHats).mul("<1 .5 .8 .6>")),
     s("hh").struct("x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~").gain(drums.hat.vol.mul(mStomp).mul(arrHats).mul("<1 .5 .8 .6>")),
     s("hh").struct("x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~").gain(drums.hat.vol.mul(mRoll).mul(arrHats).mul("<1 .5 .8 .6>")),
     s("hh").struct("x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~").gain(drums.hat.vol.mul(mHalf).mul(arrHats).mul("<1 .5 .8 .6>")),
     s("hh").struct("x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~").gain(drums.hat.vol.mul(mCollapse).mul(0.7).mul(arrHats).mul("<1 .5 .8 .6>")),
   )
  .hpf(5500).lpf(drums.hat.cut)
  .pan(sine.range(0.2, 0.8).slow(13))
  .filter(audible)

// OPEN HATS — на «и»: раскачивают топот.
$: stack(
     s("oh").struct("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~").gain(drums.ohat.vol.mul(mRitual).mul(arrHats)),
     s("oh").struct("~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~").gain(drums.ohat.vol.mul(mStomp).mul(arrHats)),
     s("oh").struct("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~").gain(drums.ohat.vol.mul(mRoll).mul(arrHats)),
     s("oh").struct("~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~").gain(drums.ohat.vol.mul(mHalf).mul(arrHats)),
     s("oh").struct("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~").gain(drums.ohat.vol.mul(mCollapse).mul(arrHats)),
   )
  .hpf(4200).lpf(drums.ohat.cut)
  .room(verb.mul(0.12)).roomsize(fx.reverb.size)
  .filter(audible)

// BASS LINE — пила, 8-е, F/Gb. Срез 80, короткий decay, сайдчейн.
// drive → дисторшн ДО выходного gain: перегруз есть, громкость обычная.
$: note(BASS_LINE).slow(bass.line.pace).s("sawtooth")
  .slide(0.03)
  .hpf(40).lpf(bass.line.cut).lpq(2)
  .decay(bass.line.decay).sustain(0).release(0.04)
  .gain(bass.line.vol.mul(arrBass))
  .duckorbit(2).duckdepth(duck).duckattack(0.01)
  .orbit(2)
  .filter(audible)

// ACID — Switch Angel: supersaw + glide-регистр + accent + lpf-огибающая.
// Glide только на 3 выбранных 16-х; это register, а не `.slide()`.
// Ноты f/gb/ab, без восходящих трезвучий.
$: note(ACID).slow(lead.acid.pace).s("supersaw").detune(0.5).unison(1)
  // слайд только на трёх 16-х в такте (Switch Angel: гейт без <>)
  .lpf(lead.acid.cut).lpq(lead.acid.res)
  .lpenv(lead.acid.env).lpa(0.004).lpd(lead.acid.decay).lpsustain(0.15)
  .decay(lead.acid.decay).sustain(0).release(0.04)
  .gain(lead.acid.vol.mul(arrAcid).mul("1 .68 1 .8 1 .72 1 .85"))
  .room(verb.mul(0.18)).roomsize(fx.reverb.size)
  .filter(audible)

// PAD — синт-фон: квинты, детюн, медленная атака. Без мелодии.
$: note(PAD_CHORDS).s("sawtooth")
  .unison(2).detune(synth.pad.detune)
  .lpf(synth.pad.cut).lpq(1)
  .attack(synth.pad.attack).decay(0.8).sustain(0.7).release(synth.pad.release)
  .gain(synth.pad.vol.mul(arrPad))
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .filter(audible)

// METAL RING — не сэмпл: щелчок в короткий feedback-делэй. Линия
// резонирует на 1/t; 5.7 мс ≈ F3 (174.6 Гц), поэтому звон в тональности.
// Модуляция времени на миллисекунды «гнёт» металл (Myloops).
$: s("white")
  .struct("~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~")
  .clip(0.012)
  .hpf(800).lpf(drums.metal.cut)
  .delay(0.5)
  .delaytime(drums.metal.time)
  .delayfeedback(drums.metal.fb)
  .gain(drums.metal.vol.mul(gPerc).mul(arrHats))
  .pan(sine.range(-0.5, 0.5).slow(7))
  .room(verb.mul(0.2)).roomsize(fx.reverb.size)
  .filter(audible)

// AIR — белый шум как инструмент: сначала дисторшн, потом фильтр.
// Срез и панорама едут медленными LFO, слой всё время другой.
$: s("white")
  .shape(0.28)
  .hpf(220)
  .lpf(sine.range(300, 4000).slow(atmos.air.rate))
  .lpq(atmos.air.q)
  .gain(atmos.air.vol.mul(arrTex))
  .late(0.03)
  .pan(sine.range(0.15, 0.85).slow(11))
  .room(verb.mul(0.45)).roomsize(fx.reverb.size)
  .filter(audible)

// RUST — розовый шум в резонансный lpf с очень медленным LFO.
// Это низкий «ржавый» дрон, без сэмпла padlong и без нот.
$: s("pink")
  .shape(0.4)
  .lpf(sine.range(120, 720).slow(atmos.rust.rate))
  .lpq(atmos.rust.q)
  .attack(0.6).decay(1.2).sustain(0.8).release(1.5)
  .gain(atmos.rust.vol.mul(arrTex))
  .pan(sine.range(0.35, 0.65).slow(19))
  .filter(audible)

// RUMBLE — тоже синтез: белый шум, срез 90, дакается киком.
$: s("white")
  .lpf(atmos.rumble.cut).lpq(2)
  .attack(0.25).decay(0.6).sustain(0.9).release(0.5)
  .gain(atmos.rumble.vol.mul(arrTex))
  .late(0.06)
  .duckorbit(2).duckdepth(duck.mul(0.6)).duckattack(0.02)
  .orbit(2)
  .filter(audible)

// ── ПЭДЫ ──────────────────────────────────────────────────────────

// FILL — снейр-раш 16-ми с нарастанием.
$: s("hardcore:10*16")
  .hpf(240).lpf(drums.fill.cut)
  .gain(drums.fill.vol.mul(padFill).mul(saw.range(0.45, 1)))
  .filter(audible)

// BURST — промышленный удар 8-ю, с бит-крушем. Держишь — ржавчина.
$: s("white")
  .struct("x ~ x x ~ x ~ x")
  .clip(0.08)
  .hpf(1200).lpf(drums.burst.cut)
  .crush(drums.burst.crush)
  .gain(drums.burst.vol.mul(padBurst))
  .filter(audible)

// GATE — стуттер по хэтам.
$: s("hh")
  .struct("x x ~ x x ~ x ~")
  .hpf(5500).lpf(drums.gate.cut)
  .crush(drums.gate.crush)
  .gain(drums.gate.vol.mul(padGate))
  .filter(audible)
