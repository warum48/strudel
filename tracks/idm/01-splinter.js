// ══════════════════════════════════════════════════════════════════
//  IDM 01 · SPLINTER  ·  Strudel  ·  136 BPM  ·  glitch / granular
//
//  Не техно и не брейккор. Это IDM: музыка, где ритм собран из
//  микро-событий, щелчков, обрывков и 8-битных писков, а не из
//  ровной сетки. Основа — C с тритоновой осью C–Gb и хроматическими
//  медиантами Db/Bb. Никакого «счастливого хардкора»: мажорных
//  трезвучий и подъёмов здесь нет.
//
//  ── ХАРАКТЕР ────────────────────────────────────────────────────
//  • ГРАНУЛЯР — три слоя: cloud (chop 32 на длинном сэмпле), scan
//    (позиция едет синусом) и freeze (держишь пэд — облако стоит).
//    Источник — банк `padlong / space / wind / noise2`: в AUTO он
//    меняется раз в 4 такта, `grainSrc` фиксирует один сэмпл.
//    У всех слоёв pitch −24…+12 полутонов (до двух октав вниз).
//  • ГЛИТЧ — микро-события из `glitch`, `click`, `rim`; часть слоёв
//    включается режимом и пэдами, а не висит постоянно.
//  • 8 БИТ — pulse/square с `crush`; лид и быстрое арпеджио. Это
//    тембр, а не мелодия: ноты короткие и злые.
//  • ЭЙСИД — 303 с glide только на выбранных 16-х, без «обыгрывания
//    аккордов». Интервалы широкие, линия разрежена. По умолчанию
//    `acidMode` 2: низкая линия + октавой выше, чтобы её было слышно.
//  • ГОЛОС — `numbers`: человеческий голос произносит цифры 0–8,
//    одно слово на такт. `voxMode` — dry / chop / pitch.
//  • БАС — саб ≤80 + отдельный шершавый growl-слой и FM-слой.
//    Growl — осознанное исключение из правила «только ≤80»: это
//    гудящая середина, а не фундамент. Саб остаётся ниже 80.
//  • РЕВЕРБА МАЛО — комнаты короткие, `verb` по умолчанию 0.18.
//    Пространство делают дилей, панорама и сухие короткие хвосты.
//
//  ── ГАРМОНИЯ ────────────────────────────────────────────────────
//  8 тактов: C (1–2) → Db (3–4) → Gb (5–6) → Bb (7–8).
//  Пэд A — тритоновые пары, пэд B — открытые квинты с 9-й. Оба
//  варианта атональны по характеру, но B — «призрак», а не второй
//  аккорд. Переключатель `harmony` — защёлка на 8 тактов.
//  @roots c c db db gb gb bb bb
//  @dark
//
//  ── КНОПКИ И ПЭДЫ ───────────────────────────────────────────────
//  Восемь переключателей: scene, mode, grainMode, grainSrc, bitMode,
//  acidMode, voxMode, harmony. Шесть пэдов: roll, cut, freeze, burst,
//  acid, drop.
//  Пэд — momentary: держишь — играет, отпустил — исчез.
//  Клавиши 1–6 в панели.
//
//  ── СТАРТ ──────────────────────────────────────────────────────
//  Атмосфера, гранулярное облако, клики, бас и бочка слышны сразу.
//  Кислота и 8-битный лид — тише: это краска, а не главная тема.
//  Всё остальное поднимай руками.
// ══════════════════════════════════════════════════════════════════

const BPM = 136
setcpm(BPM / 4) // один цикл = один такт 4/4 (≈ 1.76 с)

// ══════════════════════════════════════════════════════════════════
//  СЭМПЛЫ
// ══════════════════════════════════════════════════════════════════
// uzu — bd/sd/hh/oh/rim/sh; Dirt-Samples — glitch/click/crackle/
// padlong/wind/breaks165. Синтезаторы (square/pulse/sine) идут без
// сэмплов; в node-проверках `samples()` нет, поэтому вызов под typeof.
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
//  GLIDE — настоящий слайд 303 (рецепт Switch Angel)
// ══════════════════════════════════════════════════════════════════
// Считаем, ОТ какой ноты едем: для каждой ноты берём частоту
// предыдущей и ставим питч-огибающую (panchor 0, psustain 0,
// pattack 0, pdecay = время, penv = -12*log2(fTo/fFrom)). Слайд только
// на выбранных 16-х — иначе линия превращается в портаменто.
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
// @switches scene=intro,build,main,break,outro mode=glitch,grain,acid,strip,skitter,shuffle,poly,fracture grainMode=off,cloud,scan,edit grainSrc=auto,padlong,space,wind,noise2 bitMode=clean,crush,coarse,both acidMode=off,sparse,run,scream voxMode=off,dry,chop,pitch harmony=dark,ghost
const scene = slider(2, 0, 4, 1)
const mode = slider(0, 0, 7, 1)
const grainMode = slider(1, 0, 3, 1)
const grainSrc = slider(0, 0, 4, 1)
const bitMode = slider(1, 0, 3, 1)
const acidMode = slider(2, 0, 3, 1)
const voxMode = slider(1, 0, 3, 1)
const harmony = slider(0, 0, 1, 1)

// @pads padRoll,padCut,padFreeze,padBurst,padAcid,padDrop
const padRoll = slider(0, 0, 1, 1)
const padCut = slider(0, 0, 1, 1)
const padFreeze = slider(0, 0, 1, 1)
const padBurst = slider(0, 0, 1, 1)
const padAcid = slider(0, 0, 1, 1)
const padDrop = slider(0, 0, 1, 1)

// Глобальные ручки.
const verb = slider(0.18, 0, 0.6, 0.01) // мало реверба — это принцип
const duck = slider(0.45, 0, 1, 0.01)

// Мутация ритма: не «рандом вместо грува», а управляемая вероятность
// добавить призрак или филл. `mutate` — доля оставленных призраков,
// `fill` — громкость 32-го ролла на последнюю долю.
const mutate = slider(0.25, 0, 1, 0.01)
const fill = slider(0, 0, 1, 0.01)

// ══════════════════════════════════════════════════════════════════
//  ГЕЙТЫ
// ══════════════════════════════════════════════════════════════════
const atScene = (n) => scene.fmap((v) => (v === n ? 1 : 0))
const sIntro = atScene(0)
const sBuild = atScene(1)
const sMain = atScene(2)
const sBreak = atScene(3)
const sOutro = atScene(4)

const drumsOn = scene.fmap((v) => (v === 1 || v === 2 || v === 4 ? 1 : 0))
const bassOn = scene.fmap((v) => (v === 1 || v === 2 || v === 4 ? 1 : 0))
const acidOn = scene.fmap((v) => (v === 2 ? 1 : 0))
const leadOn = scene.fmap((v) => (v === 2 || v === 3 ? 1 : 0))
const padOn = scene.fmap((v) => (v === 0 || v === 4 ? 0.6 : 1))
const grainOn = scene.fmap((v) => (v === 4 ? 0.5 : 1))

// Режим: 0 GLITCH / 1 GRAIN / 2 ACID / 3 STRIP /
// 4 SKITTER / 5 SHUFFLE / 6 POLY / 7 FRACTURE.
// Новые режимы 4–7 намеренно включают ВСЕ барабанные слои: это не
// «ещё один брейк», а другая сетка для тех же инструментов.
const m0 = mode.fmap((v) => (v === 0 ? 1 : 0))
const m1 = mode.fmap((v) => (v === 1 ? 1 : 0))
const m2 = mode.fmap((v) => (v === 2 ? 1 : 0))
const m3 = mode.fmap((v) => (v === 3 ? 1 : 0))
const m4 = mode.fmap((v) => (v === 4 ? 1 : 0))
const m5 = mode.fmap((v) => (v === 5 ? 1 : 0))
const m6 = mode.fmap((v) => (v === 6 ? 1 : 0))
const m7 = mode.fmap((v) => (v === 7 ? 1 : 0))
const mNew = m4.add(m5).add(m6).add(m7)

// Грануляр: 0 OFF / 1 CLOUD / 2 SCAN / 3 EDIT.
const gCloud = grainMode.fmap((v) => (v === 1 ? 1 : 0))
const gScan = grainMode.fmap((v) => (v === 2 ? 1 : 0))
const gEdit = grainMode.fmap((v) => (v === 3 ? 1 : 0))

// Биты: 0 clean / 1 crush / 2 coarse / 3 both. В Strudel `crush`
// 1 = злой, 16 = почти чисто; `coarse` есть не везде, поэтому
// «coarse» здесь — другая глубина crush, а не отдельный worklet.
const crushAmt = bitMode.fmap((v) => [16, 5, 9, 2][v])

// Эйсид: 0 off / 1 sparse / 2 run / 3 scream.
const aLine = acidMode.fmap((v) => (v === 1 || v === 2 ? 1 : 0))
const aRun = acidMode.fmap((v) => (v === 2 ? 1 : 0))
const aScream = acidMode.fmap((v) => (v === 3 ? 1 : 0))

// Голос: 0 OFF / 1 DRY / 2 CHOP / 3 PITCH.
const voxOn = voxMode.fmap((v) => (v === 0 ? 0 : 1))
const voxChop = voxMode.fmap((v) => (v === 2 ? 1 : 0))
const voxPitch = voxMode.fmap((v) => (v === 3 ? 1 : 0))

// Защёлка гармонии: 1 сэмпл на 8 тактов.
const hQ = harmony.seg(1 / 8)
const hA = hQ.fmap((h) => (h < 0.5 ? 1 : 0))
const hB = hQ.fmap((h) => (h < 0.5 ? 0 : 1))

// Источник грануляра: AUTO меняет банк раз в 4 такта, остальные
// значения фиксируют один сэмпл. `pick` выбирает паттерн по номеру,
// поэтому `s` получает уже готовое имя (или мини-паттерн) сэмпла.
const GRAIN_SRC = grainSrc.pick([
  m('<padlong@4 space@4 wind@4 noise2@4>'),
  'padlong',
  'space',
  'wind',
  'noise2',
])

// ══════════════════════════════════════════════════════════════════
//  ИНСТРУМЕНТЫ
// ══════════════════════════════════════════════════════════════════
const instruments = {
  // ── АТМОСФЕРА ──────────────────────────────────────────────────
  atmos: {
    name: 'Atmos',
    hiss: {
      name: 'Vinyl',
      vol: slider(0.04, 0, 0.25, 0.01),
      cut: slider(3200, 200, 10000, 20),
      hpf: slider(90, 20, 600, 10),
    },
    air: {
      name: 'Air',
      vol: slider(0.02, 0, 0.2, 0.01),
      cut: slider(650, 100, 5000, 20),
      lfo: slider(0.6, 0, 6, 0.1),
    },
    field: {
      name: 'Field',
      vol: slider(0.02, 0, 0.2, 0.01),
      cut: slider(900, 100, 5000, 20),
    },
  },

  // ── БАРАБАНЫ ───────────────────────────────────────────────────
  drums: {
    name: 'Drums',
    kick: {
      name: 'Kick',
      vol: slider(0.3, 0, 0.7, 0.01),
      cut: slider(180, 70, 500, 5),
      decay: slider(0.14, 0.03, 0.4, 0.01),
      pitch: slider(0, -12, 6, 1),
      shape: slider(0.22, 0, 0.7, 0.01),
    },
    snare: {
      name: 'Snare',
      vol: slider(0.18, 0, 0.6, 0.01),
      cut: slider(5200, 400, 14000, 50),
      decay: slider(0.12, 0.03, 0.4, 0.01),
      room: slider(0.15, 0, 0.6, 0.01),
    },
    hat: {
      name: 'Hats',
      vol: slider(0.1, 0, 0.5, 0.01),
      cut: slider(8200, 800, 16000, 50),
      decay: slider(0.04, 0.01, 0.2, 0.005),
      swing: slider(0.06, 0, 0.2, 0.01),
    },
    open: {
      name: 'Open hat',
      vol: slider(0.06, 0, 0.5, 0.01),
      cut: slider(7000, 800, 14000, 50),
      decay: slider(0.18, 0.03, 0.6, 0.01),
    },
    click: {
      name: 'Clicks',
      vol: slider(0.06, 0, 0.4, 0.01),
      cut: slider(10000, 1000, 16000, 100),
      echo: slider(0.2, 0, 0.8, 0.01),
    },
    glitch: {
      name: 'Glitch',
      vol: slider(0.08, 0, 0.4, 0.01),
      cut: slider(6000, 600, 14000, 50),
      rate: slider(8, 4, 16, 1),
      prob: slider(0.75, 0.2, 1, 0.01),
    },
    squeak: {
      name: 'Squeaks',
      vol: slider(0.05, 0, 0.3, 0.01),
      cut: slider(9000, 1000, 16000, 100),
      rate: slider(4, 1, 8, 1),
      prob: slider(0.55, 0.1, 1, 0.01),
    },
    roll: {
      name: 'Roll pad',
      vol: slider(0.1, 0, 0.8, 0.01),
      cut: slider(5200, 400, 14000, 50),
      decay: slider(0.03, 0.01, 0.12, 0.005),
    },
    cut: {
      name: 'Cut pad',
      vol: slider(0.12, 0, 0.8, 0.01),
      cut: slider(6000, 400, 14000, 50),
      rate: slider(8, 2, 16, 1),
    },
    burst: {
      name: 'Burst pad',
      vol: slider(0.1, 0, 0.8, 0.01),
      cut: slider(10000, 800, 16000, 100),
      decay: slider(0.08, 0.01, 0.3, 0.005),
      crush: slider(6, 1, 16, 1),
    },
    drop: {
      name: 'Sub drop',
      vol: slider(0.2, 0, 0.8, 0.01),
      cut: slider(70, 40, 120, 1),
      decay: slider(0.6, 0.1, 1.6, 0.01),
    },
    // Призраки и филл — не отдельные рисунки, а мутация текущего.
    ghost: {
      name: 'Ghosts',
      vol: slider(0.06, 0, 0.4, 0.01),
      cut: slider(5200, 400, 14000, 50),
      decay: slider(0.05, 0.01, 0.2, 0.005),
    },
    fill: {
      name: 'Fill',
      vol: slider(0.08, 0, 0.5, 0.01),
      cut: slider(6000, 400, 14000, 50),
      decay: slider(0.04, 0.01, 0.15, 0.005),
    },
  },

  // ── БАС ────────────────────────────────────────────────────────
  bass: {
    name: 'Bass',
    sub: {
      name: 'Sub ≤80',
      vol: slider(0.28, 0, 1, 0.01),
      cut: slider(70, 40, 80, 1),
      decay: slider(0.38, 0.08, 1.2, 0.01),
    },
    // Шершавая середина. Не саб: срез выше 80 — осознанно, как в 17.
    growl: {
      name: 'Growl (mid)',
      vol: slider(0.18, 0, 0.8, 0.01),
      cut: slider(280, 80, 900, 5),
      q: slider(8, 0, 18, 0.5),
      lfo: slider(0.55, 0, 4, 0.05),
      sync: slider(0.5, 0.0625, 2, 0.0625),
      grit: slider(0.3, 0, 0.8, 0.01),
      decay: slider(0.4, 0.08, 1.6, 0.01),
      det: slider(0.06, 0, 0.3, 0.01),
      slide: slider(0.02, 0, 0.2, 0.005),
    },
    // FM-слой: резиновый призвук поверх саба, не отдельная мелодия.
    fm: {
      name: 'FM rubber',
      vol: slider(0.1, 0, 0.6, 0.01),
      cut: slider(220, 60, 800, 5),
      ratio: slider(1.5, 0.5, 4, 0.1),
      index: slider(2.5, 0, 8, 0.1),
      decay: slider(0.3, 0.05, 1.2, 0.01),
    },
  },

  // ── ЭЙСИД ──────────────────────────────────────────────────────
  acid: {
    name: 'Acid',
    line: {
      name: '303 line',
      vol: slider(0.2, 0, 0.7, 0.01),
      cut: slider(1400, 200, 5000, 20),
      res: slider(12, 2, 18, 0.5),
      env: slider(3.2, 0, 6, 0.1),
      decay: slider(0.13, 0.03, 0.4, 0.005),
      glide: slider(0.05, 0, 0.2, 0.005),
      drive: slider(1.1, 0.4, 2.6, 0.01),
      pace: slider(1, 1, 4, 1),
      echo: slider(0.22, 0, 0.7, 0.01),
    },
    run: {
      name: '303 run',
      vol: slider(0.1, 0, 0.5, 0.01),
      cut: slider(1400, 300, 6000, 20),
      res: slider(12, 2, 18, 0.5),
      env: slider(3.2, 0, 6, 0.1),
      decay: slider(0.1, 0.02, 0.3, 0.005),
      echo: slider(0.2, 0, 0.7, 0.01),
    },
    scream: {
      name: '303 scream',
      vol: slider(0.06, 0, 0.5, 0.01),
      cut: slider(2200, 400, 8000, 50),
      res: slider(14, 2, 18, 0.5),
      env: slider(3.5, 0, 6, 0.1),
      decay: slider(0.08, 0.02, 0.25, 0.005),
      shape: slider(0.35, 0, 0.8, 0.01),
      crush: slider(6, 1, 16, 1),
      echo: slider(0.25, 0, 0.8, 0.01),
    },
  },

  // ── ГРАНУЛЯР ───────────────────────────────────────────────────
  // Много ручек — это и есть инструмент. `chop` режет событие на
  // куски, `scan` задаёт позицию в сэмпле, `window` — длину окна,
  // `density` — сколько раз повторить облако за такт.
  grain: {
    name: 'Grain',
    cloud: {
      name: 'Cloud',
      vol: slider(0.16, 0, 0.7, 0.01),
      chop: slider(32, 4, 64, 4),
      scan: slider(0.15, 0, 0.9, 0.01),
      window: slider(0.2, 0.02, 0.6, 0.01),
      speed: slider(0.7, 0.2, 1.8, 0.01),
      pitch: slider(0, -24, 12, 1),
      density: slider(1, 1, 4, 1),
      spread: slider(0.7, 0, 1, 0.01),
      cut: slider(3200, 300, 12000, 50),
      hpf: slider(180, 40, 1200, 10),
      delay: slider(0.2, 0, 0.8, 0.01),
      prob: slider(0.9, 0.2, 1, 0.01),
    },
    scan: {
      name: 'Scan',
      vol: slider(0.12, 0, 0.6, 0.01),
      chop: slider(16, 4, 64, 4),
      rate: slider(16, 2, 64, 1),
      window: slider(0.12, 0.02, 0.5, 0.01),
      speed: slider(0.9, 0.2, 1.8, 0.01),
      pitch: slider(0, -24, 12, 1),
      density: slider(1, 1, 3, 1),
      spread: slider(0.5, 0, 1, 0.01),
      cut: slider(5000, 300, 14000, 50),
      hpf: slider(300, 40, 1600, 10),
      prob: slider(0.8, 0.2, 1, 0.01),
    },
    freeze: {
      name: 'Freeze pad',
      vol: slider(0.16, 0, 0.7, 0.01),
      chop: slider(48, 4, 64, 4),
      pos: slider(0.35, 0, 0.9, 0.01),
      window: slider(0.08, 0.02, 0.4, 0.01),
      speed: slider(0.6, 0.1, 1.6, 0.01),
      pitch: slider(0, -24, 12, 1),
      density: slider(2, 1, 4, 1),
      spread: slider(0.3, 0, 1, 0.01),
      cut: slider(4000, 300, 12000, 50),
      hpf: slider(200, 40, 1200, 10),
    },
    edit: {
      name: 'Edit',
      vol: slider(0.1, 0, 0.5, 0.01),
      slice: slider(16, 4, 32, 1),
      speed: slider(1, 0.4, 2, 0.01),
      pitch: slider(0, -24, 12, 1),
      prob: slider(0.8, 0.2, 1, 0.01),
      cut: slider(6000, 400, 14000, 50),
      hpf: slider(400, 40, 2000, 10),
    },
  },

  // ── 8 БИТ ──────────────────────────────────────────────────────
  bits: {
    name: '8-bit',
    lead: {
      name: 'Lead',
      vol: slider(0.08, 0, 0.5, 0.01),
      cut: slider(5200, 400, 12000, 50),
      decay: slider(0.09, 0.02, 0.3, 0.005),
      pw: slider(0.4, 0.1, 0.9, 0.01),
      pace: slider(1, 1, 4, 1),
      prob: slider(0.8, 0.2, 1, 0.01),
    },
    arp: {
      name: 'Arp',
      vol: slider(0.06, 0, 0.4, 0.01),
      cut: slider(3600, 300, 10000, 50),
      decay: slider(0.05, 0.01, 0.2, 0.005),
      pw: slider(0.25, 0.1, 0.9, 0.01),
      rate: slider(16, 4, 32, 1),
      prob: slider(0.75, 0.2, 1, 0.01),
    },
    noise: {
      name: 'Blips',
      vol: slider(0.04, 0, 0.3, 0.01),
      cut: slider(10000, 800, 16000, 100),
      decay: slider(0.03, 0.01, 0.15, 0.005),
      rate: slider(8, 2, 16, 1),
      prob: slider(0.45, 0.1, 1, 0.01),
    },
  },

  // ── ГОЛОС ──────────────────────────────────────────────────────
  // `numbers` — человеческий голос, произносит цифры 0–8. Это не
  // «йоу» и не «ах»: короткие слова, которые можно резать и питчить.
  vox: {
    name: 'Vox',
    phrase: {
      name: 'Numbers',
      vol: slider(0.12, 0, 0.6, 0.01),
      clip: slider(0.45, 0.1, 1.2, 0.01),
      speed: slider(1, 0.6, 1.4, 0.01),
      cut: slider(5000, 400, 14000, 50),
      echo: slider(0.3, 0, 0.8, 0.01),
      room: slider(0.15, 0, 0.6, 0.01),
      chop: slider(8, 2, 32, 1),
      pitch: slider(0, -12, 12, 1),
    },
  },

  // ── АККОРДЫ ────────────────────────────────────────────────────
  chords: {
    name: 'Chords',
    pad: {
      name: 'Dark pad',
      vol: slider(0.12, 0, 0.6, 0.01),
      cut: slider(600, 80, 4000, 10),
      hpf: slider(120, 20, 600, 10),
      q: slider(2, 0, 18, 0.5),
      lfo: slider(0.3, 0, 6, 0.05),
      det: slider(0.06, 0, 0.3, 0.01),
      fb: slider(0.5, 0, 1, 0.01),
    },
    stab: {
      name: 'Stab',
      vol: slider(0.06, 0, 0.6, 0.01),
      cut: slider(900, 100, 6000, 10),
      res: slider(3, 0, 18, 0.5),
      decay: slider(0.3, 0.03, 1.2, 0.01),
      room: slider(0.2, 0, 1, 0.01),
    },
  },

  // ── ЭФФЕКТЫ ────────────────────────────────────────────────────
  fx: {
    name: 'FX',
    delay: {
      name: 'Delay',
      send: slider(0.35, 0, 1, 0.01),
      time: slider(0.375, 0.0625, 0.75, 0.0625),
      feedback: slider(0.45, 0, 0.85, 0.01),
    },
    reverb: {
      name: 'Reverb',
      size: slider(3, 0.5, 10, 0.1),
    },
  },
}

const { atmos, drums, bass, acid, grain, bits, vox, chords, fx } = instruments

const semis = (s) => s.fmap((st) => Math.pow(2, st / 12))
const kickRate = semis(drums.kick.pitch)

const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}

// ══════════════════════════════════════════════════════════════════
//  ФРАЗЫ
// ══════════════════════════════════════════════════════════════════
const phrase = (bars) => m('<' + bars.join(' ') + '>')

// Корни: C (1–2) → Db (3–4) → Gb (5–6) → Bb (7–8).
// @roots c c db db gb gb bb bb
// @scenes {"intro":{"scene":0,"mode":1,"grainMode":1,"bitMode":0,"acidMode":0,"harmony":0,"atmos.hiss.vol":0.04,"atmos.air.vol":0.02,"atmos.field.vol":0.02,"drums.kick.vol":0,"drums.snare.vol":0,"drums.hat.vol":0,"drums.open.vol":0,"drums.click.vol":0.06,"drums.glitch.vol":0.06,"drums.squeak.vol":0.03,"bass.sub.vol":0,"bass.growl.vol":0,"bass.fm.vol":0,"acid.line.vol":0,"acid.run.vol":0,"acid.scream.vol":0,"grain.cloud.vol":0.2,"grain.scan.vol":0,"grain.edit.vol":0,"bits.lead.vol":0,"bits.arp.vol":0,"bits.noise.vol":0,"chords.pad.vol":0.1,"chords.stab.vol":0},"theme":{"scene":2,"mode":1,"grainMode":1,"grainSrc":2,"bitMode":2,"acidMode":1,"voxMode":2,"harmony":0,"padRoll":0,"padCut":0,"padFreeze":0,"padBurst":0,"padAcid":0,"padDrop":0,"verb":0.18,"duck":0.45,"mutate":0.25,"fill":0,"atmos.hiss.vol":0.04,"atmos.hiss.cut":3200,"atmos.hiss.hpf":90,"atmos.air.vol":0.02,"atmos.air.cut":650,"atmos.air.lfo":0.6,"atmos.field.vol":0.02,"atmos.field.cut":900,"drums.kick.vol":0.3,"drums.kick.cut":180,"drums.kick.decay":0.14,"drums.kick.pitch":0,"drums.kick.shape":0.22,"drums.snare.vol":0.18,"drums.snare.cut":5200,"drums.snare.decay":0.12,"drums.snare.room":0.15,"drums.hat.vol":0.1,"drums.hat.cut":8200,"drums.hat.decay":0.04,"drums.hat.swing":0.06,"drums.open.vol":0.06,"drums.open.cut":7000,"drums.open.decay":0.18,"drums.click.vol":0.06,"drums.click.cut":10000,"drums.click.echo":0.2,"drums.glitch.vol":0.08,"drums.glitch.cut":6000,"drums.glitch.rate":8,"drums.glitch.prob":0.75,"drums.squeak.vol":0.05,"drums.squeak.cut":9000,"drums.squeak.rate":4,"drums.squeak.prob":0.55,"drums.roll.vol":0.1,"drums.roll.cut":5200,"drums.roll.decay":0.03,"drums.cut.vol":0.12,"drums.cut.cut":6000,"drums.cut.rate":8,"drums.burst.vol":0.1,"drums.burst.cut":10000,"drums.burst.decay":0.08,"drums.burst.crush":6,"drums.drop.vol":0.2,"drums.drop.cut":70,"drums.drop.decay":0.6,"drums.ghost.vol":0.06,"drums.ghost.cut":5200,"drums.ghost.decay":0.05,"drums.fill.vol":0.08,"drums.fill.cut":6000,"drums.fill.decay":0.04,"bass.sub.vol":0.28,"bass.sub.cut":70,"bass.sub.decay":0.38,"bass.growl.vol":0.18,"bass.growl.cut":280,"bass.growl.q":8,"bass.growl.lfo":0.55,"bass.growl.sync":0.5,"bass.growl.grit":0.3,"bass.growl.decay":0.4,"bass.growl.det":0.06,"bass.growl.slide":0.02,"bass.fm.vol":0.1,"bass.fm.cut":220,"bass.fm.ratio":1.5,"bass.fm.index":2.5,"bass.fm.decay":0.3,"acid.line.vol":0.2,"acid.line.cut":1400,"acid.line.res":12,"acid.line.env":3.2,"acid.line.decay":0.13,"acid.line.glide":0.05,"acid.line.drive":1.1,"acid.line.pace":1,"acid.line.echo":0.22,"acid.run.vol":0.1,"acid.run.cut":1400,"acid.run.res":12,"acid.run.env":3.2,"acid.run.decay":0.1,"acid.run.echo":0.2,"acid.scream.vol":0.06,"acid.scream.cut":2200,"acid.scream.res":14,"acid.scream.env":3.5,"acid.scream.decay":0.08,"acid.scream.shape":0.35,"acid.scream.crush":6,"acid.scream.echo":0.25,"grain.cloud.vol":0.16,"grain.cloud.chop":32,"grain.cloud.scan":0.15,"grain.cloud.window":0.2,"grain.cloud.speed":0.7,"grain.cloud.pitch":0,"grain.cloud.density":1,"grain.cloud.spread":0.7,"grain.cloud.cut":3200,"grain.cloud.hpf":180,"grain.cloud.delay":0.2,"grain.cloud.prob":0.9,"grain.scan.vol":0.12,"grain.scan.chop":16,"grain.scan.rate":16,"grain.scan.window":0.12,"grain.scan.speed":0.9,"grain.scan.pitch":0,"grain.scan.density":1,"grain.scan.spread":0.5,"grain.scan.cut":5000,"grain.scan.hpf":300,"grain.scan.prob":0.8,"grain.freeze.vol":0.16,"grain.freeze.chop":48,"grain.freeze.pos":0.35,"grain.freeze.window":0.08,"grain.freeze.speed":0.6,"grain.freeze.pitch":0,"grain.freeze.density":2,"grain.freeze.spread":0.3,"grain.freeze.cut":4000,"grain.freeze.hpf":200,"grain.edit.vol":0.1,"grain.edit.slice":16,"grain.edit.speed":1,"grain.edit.pitch":0,"grain.edit.prob":0.8,"grain.edit.cut":6000,"grain.edit.hpf":400,"bits.lead.vol":0.08,"bits.lead.cut":5200,"bits.lead.decay":0.09,"bits.lead.pw":0.4,"bits.lead.pace":1,"bits.lead.prob":0.8,"bits.arp.vol":0.06,"bits.arp.cut":3600,"bits.arp.decay":0.05,"bits.arp.pw":0.25,"bits.arp.rate":16,"bits.arp.prob":0.75,"bits.noise.vol":0.04,"bits.noise.cut":10000,"bits.noise.decay":0.03,"bits.noise.rate":8,"bits.noise.prob":0.45,"vox.phrase.vol":0.12,"vox.phrase.clip":0.45,"vox.phrase.speed":1,"vox.phrase.cut":5000,"vox.phrase.echo":0.3,"vox.phrase.room":0.15,"vox.phrase.chop":8,"vox.phrase.pitch":0,"chords.pad.vol":0.12,"chords.pad.cut":600,"chords.pad.hpf":120,"chords.pad.q":2,"chords.pad.lfo":0.3,"chords.pad.det":0.06,"chords.pad.fb":0.5,"chords.stab.vol":0.06,"chords.stab.cut":900,"chords.stab.res":3,"chords.stab.decay":0.3,"chords.stab.room":0.2,"fx.delay.send":0.35,"fx.delay.time":0.375,"fx.delay.feedback":0.45,"fx.reverb.size":3}}

// ROOT — саб по корням, одна нота на такт.
const ROOT = phrase([
  '[c1]', '[c1]', '[db1]', '[db1]',
  '[gb1]', '[gb1]', '[bb1]', '[bb1]',
])

// GROWL — редкая фраза с паузами. Низкие ноты, широкие интервалы,
// никакой мелодии: это гул, а не бас-гитара.
const GROWL = phrase([
  '[c1 ~ ~ ~ gb1 ~ ~ ~]',
  '[c1 ~ bb0 ~ ~ ~ gb1 ~]',
  '[db1 ~ ~ ~ ab0 ~ ~ ~]',
  '[db1 ~ g1 ~ ~ ~ eb1 ~]',
  '[gb1 ~ ~ ~ c1 ~ ~ ~]',
  '[gb1 ~ db1 ~ ~ ~ bb0 ~]',
  '[bb1 ~ ~ ~ e1 ~ ~ ~]',
  '[bb1 ~ f1 ~ ~ ~ c1 ~]',
])

// FM_BASS — короткие резиновые ноты поверх саба.
const FM_BASS = phrase([
  '[c1 ~ ~ c1 ~ ~ gb1 ~]',
  '[c1 ~ bb0 ~ ~ ~ gb1 ~]',
  '[db1 ~ ~ db1 ~ ~ ab0 ~]',
  '[db1 ~ g1 ~ ~ ~ eb1 ~]',
  '[gb1 ~ ~ gb1 ~ ~ c1 ~]',
  '[gb1 ~ db1 ~ ~ ~ bb0 ~]',
  '[bb1 ~ ~ bb1 ~ ~ e1 ~]',
  '[bb1 ~ f1 ~ ~ ~ c1 ~]',
])

// ACID — не обыгрывание аккордов, а редкие широкие интервалы:
// C, Gb, Bb, Db, Ab, Eb. Тритоны здесь — ось, а не ошибка.
const ACID = phrase([
  '[c2 ~ gb2 ~ bb1 ~ gb2 ~]',
  '[c2 ~ bb1 ~ ~ gb2 ~ c2]',
  '[db2 ~ ~ ab1 ~ db2 ~ ~]',
  '[db2 ~ c2 ~ ~ eb2 ~ ~]',
  '[gb2 ~ ~ c2 ~ gb2 ~ bb1]',
  '[gb2 ~ db2 ~ ~ bb1 ~ ~]',
  '[bb1 ~ e2 ~ ~ bb1 ~ f2]',
  '[bb1 ~ f2 ~ ~ c2 ~ bb1]',
])

// BELL — 8-битный лид. Высокий регистр, чтобы не спорить с пэдом.
const BELL = phrase([
  '[c5 ~ gb5 ~ bb5 ~ db6 ~]',
  '[c5 ~ bb5 ~ gb5 ~ db6 ~]',
  '[db6 ~ ~ ~ c5 ~ ~ ~]',
  '[db6 ~ bb5 ~ ~ ~ gb5 ~]',
  '[gb5 ~ ~ ~ c5 ~ ~ ~]',
  '[gb5 ~ db6 ~ ~ ~ bb5 ~]',
  '[bb5 ~ ~ ~ e6 ~ ~ ~]',
  '[bb5 ~ f6 ~ ~ ~ c5 ~]',
])

// SQUEAK — писки: тот же регистр, но короткие и с питч-огибающей.
const SQUEAK = phrase([
  '[c6 ~ ~ ~ gb6 ~ ~ ~]',
  '[~ ~ bb6 ~ ~ ~ db7 ~]',
  '[db7 ~ ~ ~ c6 ~ ~ ~]',
  '[~ ~ gb6 ~ ~ ~ bb6 ~]',
  '[gb6 ~ ~ ~ c6 ~ ~ ~]',
  '[~ ~ db7 ~ ~ ~ bb6 ~]',
  '[bb6 ~ ~ ~ e7 ~ ~ ~]',
  '[~ ~ f7 ~ ~ ~ c6 ~]',
])

// ARP_CHORDS — аккорды для 8-битного арпеджио. Ноты всегда из
// текущего поля; 9-я и тритон — краска, а не мелодия.
const ARP_CHORDS = phrase([
  '[c5,gb5,bb5]',
  '[c5,gb5,bb5]',
  '[db5,ab5,eb6]',
  '[db5,ab5,eb6]',
  '[gb5,db6,ab6]',
  '[gb5,db6,ab6]',
  '[bb5,f6,c7]',
  '[bb5,f6,c7]',
])

// PAD_A — тритоновые пары. DARK: ни мажора, ни минора.
const PAD_A = phrase([
  '[c3,gb3]', '[c3,gb3]',
  '[db3,g3]', '[db3,g3]',
  '[gb3,c4]', '[gb3,c4]',
  '[bb3,e4]', '[bb3,e4]',
])

// PAD_B — открытые квинты с 9-й. GHOST: другой воздух над тем же полем.
const PAD_B = phrase([
  '[c3,g3,d4]', '[c3,g3,d4]',
  '[db3,ab3,eb4]', '[db3,ab3,eb4]',
  '[gb3,db4,ab4]', '[gb3,db4,ab4]',
  '[bb3,f4,c5]', '[bb3,f4,c5]',
])

// STAB — один короткий тритон раз в два такта. Пауза важнее события.
const STAB = phrase([
  '[~ ~ ~ ~ [c4,gb4] ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ [db4,g4] ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ [gb4,c5] ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ [bb4,e5] ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~]',
])

// ══════════════════════════════════════════════════════════════════
//  АТМОСФЕРА
// ══════════════════════════════════════════════════════════════════

// ВИНИЛ — тело, а не эффект. Без него цифровые щелчки звучат как MIDI.
$: s("crackle")
  .gain(atmos.hiss.vol.mul("<1 .7 .9 .65 .85 .7 .95 .6>"))
  .lpf(atmos.hiss.cut).hpf(atmos.hiss.hpf)
  .room(verb.mul(0.25)).roomsize(fx.reverb.size)
  .filter(audible)

// ВОЗДУХ — тихий розовый шум, срез дышит.
$: s("pink")
  .gain(atmos.air.vol)
  .lpf(atmos.air.cut).hpf(160).lpq(0.8)
  .lpdepth(atmos.air.lfo).lpsync(0.125).lpdc(0)
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .filter(audible)

// ПОЛЕ — wind, растянутый на 8 тактов. Далёкий пейзаж, не подложка.
$: s("wind:0")
  .loopAt(8)
  .gain(atmos.field.vol)
  .lpf(atmos.field.cut).hpf(220)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .pan(sine.slow(48).range(0.3, 0.7))
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  БАРАБАНЫ — ломаный бит, а не прямой
// ══════════════════════════════════════════════════════════════════

// KICK — восемь рисунков. 0–3 — старые, 4–7 — новые сетки, в которых
// играют все барабанные слои, а не только кик.
$: stack(
     s("bd").struct("x ~ ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~").gain(drums.kick.vol.mul(m0).mul(drumsOn)),
     s("bd").struct("x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~").gain(drums.kick.vol.mul(m1).mul(drumsOn)),
     s("bd").struct("x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~").gain(drums.kick.vol.mul(m2).mul(drumsOn)),
     s("bd").struct("x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~").gain(drums.kick.vol.mul(m3).mul(drumsOn)),
     s("bd").struct("x ~ ~ x ~ x ~ ~ x ~ x ~ ~ x ~ x").gain(drums.kick.vol.mul(m4).mul(drumsOn)),
     s("bd").struct("x ~ ~ ~ x ~ ~ x ~ ~ x ~ ~ ~ x ~").gain(drums.kick.vol.mul(m5).mul(drumsOn)),
     s("bd").struct("x ~ ~ x ~ ~ x ~ ~ x ~ ~ x ~ ~ x").gain(drums.kick.vol.mul(m6).mul(drumsOn)),
     s("bd").struct("x ~ x x ~ x ~ x x ~ x ~ x x ~ x").gain(drums.kick.vol.mul(m7).mul(drumsOn)),
   )
  .speed(kickRate)
  .lpf(drums.kick.cut).lpq(1)
  .shape(drums.kick.shape)
  .decay(drums.kick.decay).sustain(0).release(0.04)
  .duckorbit(2).duckdepth(duck).duckattack(0.02)
  .filter(audible)

// SNARE — не на 2 и 4. Призраки и сдвиги.
$: stack(
     s("sd").struct("~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ x ~ ~ x ~").gain(drums.snare.vol.mul(m0).mul(drumsOn)),
     s("sd").struct("~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~").gain(drums.snare.vol.mul(m1).mul(drumsOn)),
     s("sd").struct("~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~").gain(drums.snare.vol.mul(m2).mul(drumsOn)),
     s("sd").struct("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~").gain(drums.snare.vol.mul(m3).mul(drumsOn)),
     s("sd").struct("~ ~ x ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x x").gain(drums.snare.vol.mul(m4).mul(drumsOn)),
     s("sd").struct("~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~").gain(drums.snare.vol.mul(m5).mul(drumsOn)),
     s("sd").struct("~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x").gain(drums.snare.vol.mul(m6).mul(drumsOn)),
     s("sd").struct("~ x ~ x x ~ x ~ ~ x ~ x x ~ x ~").gain(drums.snare.vol.mul(m7).mul(drumsOn)),
   )
  .lpf(drums.snare.cut).hpf(180).lpq(1.2)
  .decay(drums.snare.decay).sustain(0)
  .room(drums.snare.room.mul(verb)).roomsize(fx.reverb.size)
  .filter(audible)

// HATS — 16-е со свингом; в GLITCH ещё 32-е призраки.
$: stack(
     s("hh*16").swingBy(drums.hat.swing, 8)
       .gain(drums.hat.vol.mul(m0).mul(drumsOn).mul("<.8 .3 .6 .25 .7 .3 .55 .2 .8 .3 .6 .25 .7 .3 .5 .2>")),
     s("hh*8").swingBy(drums.hat.swing.mul(0.7), 8)
       .gain(drums.hat.vol.mul(m1).mul(drumsOn).mul("<.7 .25 .5 .2 .6 .25 .45 .18>")),
     s("hh*16").swingBy(drums.hat.swing.mul(1.2), 8)
       .gain(drums.hat.vol.mul(m2).mul(drumsOn).mul("<.75 .25 .55 .2 .7 .25 .5 .18>")),
     s("hh*32")
       .gain(drums.hat.vol.mul(m4).mul(drumsOn).mul("<.9 .2 .6 .15 .8 .2 .55 .12 .85 .2 .65 .15 .8 .2 .5 .1>")),
     s("hh*16").swingBy(drums.hat.swing.mul(1.4), 8)
       .gain(drums.hat.vol.mul(m5).mul(drumsOn).mul("<.8 .2 .55 .15 .7 .2 .5 .12>")),
     s("hh*16")
       .gain(drums.hat.vol.mul(m6).mul(drumsOn).mul("<.7 .3 .6 .2 .8 .3 .55 .2>")),
     s("hh*32")
       .gain(drums.hat.vol.mul(m7).mul(drumsOn).mul("<1 .3 .7 .2 .9 .25 .6 .15 .95 .3 .75 .2 .85 .25 .55 .12>")),
     s("hh*32")
       .gain(drums.hat.vol.mul(m0).mul(drumsOn).mul(0.35).mul("<1 .2 .6 .15 .8 .2 .5 .12>")),
   )
  .lpf(drums.hat.cut).hpf(600).lpq(1)
  .decay(drums.hat.decay).sustain(0)
  .delay(fx.delay.send.mul(0.15)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.35))
  .room(verb.mul(0.2)).roomsize(fx.reverb.size)
  .filter(audible)

// OPEN HAT — редкие «и», только в GRAIN/ACID.
$: s("oh")
  .struct("~ ~ ~ ~ ~ ~ oh ~ ~ ~ ~ ~ ~ ~ oh ~")
  .gain(drums.open.vol.mul(m1.add(m2).add(mNew)).mul(drumsOn))
  .lpf(drums.open.cut).hpf(500)
  .decay(drums.open.decay).sustain(0)
  .delay(fx.delay.send.mul(0.2)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.45))
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .filter(audible)

// CLICKS — сухие точки. Мало реверба: это щелчок, а не облако.
$: s("click:0")
  .struct("~ x ~ ~ x ~ ~ x ~ ~ x ~ ~ x ~ x")
  .gain(drums.click.vol.mul(m0.add(m1).add(m3).add(mNew)).mul(drumsOn))
  .lpf(drums.click.cut).hpf(2200)
  .decay(0.03).sustain(0)
  .pan(rand.mul(1.6).sub(0.8))
  .delay(drums.click.echo.mul(fx.delay.send)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.5))
  .room(verb.mul(0.25)).roomsize(fx.reverb.size)
  .filter(audible)

// GLITCH — обрывки, не ритм. В GLITCH/ACID, с вероятностью.
$: s("glitch").n("0 1 0 2 1 0 3 0")
  .fast(drums.glitch.rate.fmap((r) => r / 8))
  .struct("x ~ x ~ ~ x ~ x ~ x ~ ~ x ~ x ~")
  .gain(drums.glitch.vol.mul(m0.add(m2).add(mNew)).mul(drumsOn))
  .speed(rand.range(0.7, 1.4))
  .lpf(drums.glitch.cut).hpf(500)
  .decay(0.04).sustain(0)
  .pan(rand.mul(1.6).sub(0.8))
  .delay(fx.delay.send.mul(0.3)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.5))
  .degradeBy(drums.glitch.prob.fmap((p) => 1 - p))
  .room(verb.mul(0.2)).roomsize(fx.reverb.size)
  .filter(audible)

// SQUEAKS — высокие писки с падением питча. Это не мелодия.
$: note(SQUEAK)
  .fast(drums.squeak.rate.fmap((r) => r / 4))
  .s("sine")
  .fm(1.8).fmh(3.01).fmdecay(0.05).fmsustain(0)
  .penv(12).panchor(1).pattack(0.001).pdecay(0.04).psustain(0)
  .gain(drums.squeak.vol.mul(m0.add(m1).add(mNew)).mul(drumsOn))
  .lpf(drums.squeak.cut).hpf(1200)
  .decay(0.06).sustain(0)
  .pan(rand.mul(1.4).sub(0.7))
  .delay(fx.delay.send.mul(0.25)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.5))
  .degradeBy(drums.squeak.prob.fmap((p) => 1 - p))
  .room(verb.mul(0.15)).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  МУТАЦИЯ — призраки и филл, а не «рандом вместо грува»
// ══════════════════════════════════════════════════════════════════

// GHOSTS — вероятность оставить случайный призрак. `degradeBy`
// решает, какие позиции из 16 останутся; `mutate` — доля оставленных.
$: stack(
     s("sd").struct("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~")
       .degradeBy(mutate.fmap((p) => 1 - p))
       .gain(drums.ghost.vol.mul(drumsOn)),
     s("hh*16")
       .degradeBy(mutate.fmap((p) => 1 - p * 0.6))
       .gain(drums.ghost.vol.mul(0.45).mul(drumsOn)),
     s("glitch").n("0 1 2 3").struct("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~")
       .degradeBy(mutate.fmap((p) => 1 - p))
       .gain(drums.ghost.vol.mul(drumsOn)),
   )
  .lpf(drums.ghost.cut).hpf(400)
  .decay(drums.ghost.decay).sustain(0)
  .pan(rand.mul(1.6).sub(0.8))
  .room(verb.mul(0.12)).roomsize(fx.reverb.size)
  .filter(audible)

// FILL — 32-е по снейру на последнюю долю. Громкость = `fill`;
// это детерминированный филл, который можно вводить руками.
$: s("sd*32")
  .struct("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x x x x x x x x")
  .gain(drums.fill.vol.mul(fill).mul(drumsOn))
  .lpf(drums.fill.cut).hpf(220)
  .decay(drums.fill.decay).sustain(0)
  .pan(rand.mul(0.4).sub(0.2))
  .room(verb.mul(0.1)).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  БАС — саб + шершавый growl + FM
// ══════════════════════════════════════════════════════════════════

// SUB — синус, срез ≤80. Давление, а не бас-гитара.
$: note(ROOT)
  .s("sine")
  .struct("x ~ ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ ~ ~")
  .gain(bass.sub.vol.mul(bassOn))
  .lpf(bass.sub.cut).lpq(1)
  .shape(0.08)
  .attack(0.01).decay(bass.sub.decay).sustain(0.7).release(0.2)
  .orbit(2)
  .duckorbit(2).duckdepth(duck).duckattack(0.01)
  .filter(audible)

// GROWL — шершавая середина: две пилы, резонанс, медленный LFO,
// shape. Срез выше 80 осознанно: саб уже отдельно и он ≤80.
$: note(GROWL)
  .s("sawtooth").unison(2).detune(bass.growl.det)
  .slide(bass.growl.slide)
  .gain(bass.growl.vol.mul(bassOn))
  .lpf(bass.growl.cut).lpq(bass.growl.q).ftype("24db")
  .lpdepth(bass.growl.lfo).lpsync(bass.growl.sync).lpdc(0)
  .shape(bass.growl.grit)
  .attack(0.01).decay(bass.growl.decay).sustain(0.5).release(0.25)
  .orbit(2)
  .duckorbit(2).duckdepth(duck.mul(0.8)).duckattack(0.01)
  .filter(audible)

// FM RUBBER — короткий резиновый призвук. FM, не worklet.
// Треугольник, а не синус: это другой тембр и он не дублирует саб.
$: note(FM_BASS)
  .s("triangle")
  .fm(bass.fm.index).fmh(bass.fm.ratio).fmdecay(bass.fm.decay).fmsustain(0)
  .gain(bass.fm.vol.mul(bassOn))
  .lpf(bass.fm.cut).hpf(40).lpq(1)
  .decay(bass.fm.decay).sustain(0).release(0.08)
  .orbit(2)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ЭЙСИД — 303 с выборочным glide
// ══════════════════════════════════════════════════════════════════

// 303 LINE — лестничный фильтр, drive как грязь. Glide только на
// трёх 16-х: без гейта съезжает каждая нота и линия «полощет горло».
$: note(ACID)
  .slow(acid.line.pace)
  .s("sawtooth")
  .lpf(acid.line.cut).lpq(acid.line.res).ftype("ladder").drive(acid.line.drive)
  .lpenv(acid.line.env)
  .lpa(0.002).lpd(acid.line.decay).lpsustain(0.12)
  .glide(acid.line.glide.mul("0 0 1 0 0 1 0 0 0 0 1 0 0 0 0 0"))
  .decay(acid.line.decay).sustain(0.2).release(0.03)
  .gain(acid.line.vol.mul(aLine).mul(acidOn))
  .delay(acid.line.echo.mul(fx.delay.send)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.5))
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .orbit(2)
  .filter(audible)

// 303 RUN — та же линия октавой выше, тот же ритм. Режим RUN.
$: note(ACID).add(note(12))
  .s("sawtooth")
  .lpf(acid.run.cut).lpq(acid.run.res).ftype("24db")
  .lpenv(acid.run.env)
  .lpa(0.002).lpd(acid.run.decay).lpsustain(0.08)
  .decay(acid.run.decay).sustain(0.12).release(0.02)
  .gain(acid.run.vol.mul(aRun).mul(acidOn))
  .delay(acid.run.echo.mul(fx.delay.send)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.55))
  .room(verb.mul(0.25)).roomsize(fx.reverb.size)
  .orbit(2)
  .filter(audible)

// 303 SCREAM — квадрат, shape + crush. Два worklet'а только здесь:
// слой играет редко и тихо, поэтому бюджет не рвёт.
$: note(ACID).add(note(12))
  .s("square")
  .lpf(acid.scream.cut).lpq(acid.scream.res).ftype("24db")
  .lpenv(acid.scream.env)
  .lpa(0.002).lpd(acid.scream.decay).lpsustain(0.05)
  .shape(acid.scream.shape)
  .crush(acid.scream.crush)
  .decay(acid.scream.decay).sustain(0.1).release(0.02)
  .gain(acid.scream.vol.mul(aScream.add(padAcid)).mul(acidOn))
  .delay(acid.scream.echo.mul(fx.delay.send)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.6))
  .room(verb.mul(0.2)).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.35, 0.65))
  .orbit(2)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ГРАНУЛЯР — главный инструмент трека
// ══════════════════════════════════════════════════════════════════

// CLOUD — `chop` режет длинный сэмпл на куски, `scan` задаёт позицию,
// `window` — длину окна, `density` — сколько раз повторить облако.
// Источник — `GRAIN_SRC`: AUTO меняет банк раз в 4 такта, `grainSrc`
// фиксирует один сэмпл. Это не реверб: облако сухое, пространство
// даёт дилей и панорама.
$: s(GRAIN_SRC)
  .begin(grain.cloud.scan)
  .end(grain.cloud.scan.add(grain.cloud.window))
  .fast(grainSrc.fmap((v) => (v === 0 ? 4 : 1)))
  .chop(grain.cloud.chop)
  .speed(grain.cloud.speed.mul(semis(grain.cloud.pitch)))
  .fast(grain.cloud.density)
  .gain(grain.cloud.vol.mul(gCloud).mul(grainOn))
  .lpf(grain.cloud.cut).hpf(grain.cloud.hpf).lpq(1)
  .pan(rand.mul(grain.cloud.spread).sub(grain.cloud.spread.mul(0.5)))
  .delay(grain.cloud.delay.mul(fx.delay.send)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback)
  .degradeBy(grain.cloud.prob.fmap((p) => 1 - p))
  .room(verb.mul(0.2)).roomsize(fx.reverb.size)
  ._pianoroll()
  .filter(audible)

// SCAN — позиция едет синусом: облако медленно читает сэмпл.
// Тот же банк, что у CLOUD, поэтому источник тоже меняется.
$: s(GRAIN_SRC)
  .begin(sine.slow(grain.scan.rate).range(0.05, 0.82))
  .end(sine.slow(grain.scan.rate).range(0.05, 0.82).add(grain.scan.window))
  .fast(grainSrc.fmap((v) => (v === 0 ? 4 : 1)))
  .chop(grain.scan.chop)
  .speed(grain.scan.speed.mul(semis(grain.scan.pitch)))
  .fast(grain.scan.density)
  .gain(grain.scan.vol.mul(gScan).mul(grainOn))
  .lpf(grain.scan.cut).hpf(grain.scan.hpf).lpq(1)
  .pan(rand.mul(grain.scan.spread).sub(grain.scan.spread.mul(0.5)))
  .delay(fx.delay.send.mul(0.3)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.6))
  .degradeBy(grain.scan.prob.fmap((p) => 1 - p))
  .room(verb.mul(0.15)).roomsize(fx.reverb.size)
  .filter(audible)

// FREEZE — держишь пэд, облако стоит на месте и гудит. Это
// momentary-слой: отпустил — тишина, ничего не залипло.
$: s("padlong")
  .begin(grain.freeze.pos)
  .end(grain.freeze.pos.add(grain.freeze.window))
  .chop(grain.freeze.chop)
  .speed(grain.freeze.speed.mul(semis(grain.freeze.pitch)))
  .fast(grain.freeze.density)
  .gain(grain.freeze.vol.mul(padFreeze).mul(grainOn))
  .lpf(grain.freeze.cut).hpf(grain.freeze.hpf).lpq(1)
  .pan(rand.mul(grain.freeze.spread).sub(grain.freeze.spread.mul(0.5)))
  .delay(fx.delay.send.mul(0.25)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.7))
  .room(verb.mul(0.2)).roomsize(fx.reverb.size)
  .filter(audible)

// EDIT — микро-монтаж: 8 кусков из `glitch`, каждый со своим
// индексом и скоростью. Это не «брейк», а рвань между событиями.
$: s("glitch").n("0 1 0 2 1 0 3 0")
  .slice(grain.edit.slice, "0 3 7 1 15 2 8 4")
  .speed(grain.edit.speed.mul(semis(grain.edit.pitch)).mul(rand.range(0.7, 1.3)))
  .gain(grain.edit.vol.mul(gEdit).mul(grainOn))
  .lpf(grain.edit.cut).hpf(grain.edit.hpf)
  .decay(0.04).sustain(0)
  .pan(rand.mul(1.6).sub(0.8))
  .delay(fx.delay.send.mul(0.35)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.5))
  .degradeBy(grain.edit.prob.fmap((p) => 1 - p))
  .room(verb.mul(0.15)).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  8 БИТ — pulse/square, короткие ноты
// ══════════════════════════════════════════════════════════════════

// LEAD — высокий pulse, crush по режиму. Это тембр, а не мелодия.
$: note(BELL)
  .slow(bits.lead.pace)
  .s("pulse").pw(bits.lead.pw)
  .crush(crushAmt)
  .gain(bits.lead.vol.mul(leadOn))
  .lpf(bits.lead.cut).hpf(400)
  .decay(bits.lead.decay).sustain(0)
  .pan(rand.mul(1.2).sub(0.6))
  .delay(fx.delay.send.mul(0.4)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.5))
  .degradeBy(bits.lead.prob.fmap((p) => 1 - p))
  .room(verb.mul(0.15)).roomsize(fx.reverb.size)
  .filter(audible)

// ARP — 8/16/32 ноты на такт из нот текущего поля. Быстро и тупо,
// как арпеджиатор из детской игры. Это и есть 8-битная краска.
$: note(ARP_CHORDS)
  .arp(run(bits.arp.rate))
  .s("square").pw(bits.arp.pw)
  .crush(crushAmt)
  .gain(bits.arp.vol.mul(leadOn))
  .lpf(bits.arp.cut).hpf(500)
  .decay(bits.arp.decay).sustain(0)
  .pan(sine.slow(12).range(0.35, 0.65))
  .delay(fx.delay.send.mul(0.35)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback.mul(0.55))
  .degradeBy(bits.arp.prob.fmap((p) => 1 - p))
  .room(verb.mul(0.12)).roomsize(fx.reverb.size)
  .filter(audible)

// BLIPS — белый шум короткими точками. Не хэт: сухой цифровой тик.
$: s("white")
  .fast(bits.noise.rate.fmap((r) => r / 8))
  .struct("x ~ ~ x ~ ~ x ~")
  .clip(0.012)
  .crush(crushAmt)
  .gain(bits.noise.vol.mul(leadOn))
  .hpf(1200).lpf(bits.noise.cut)
  .decay(bits.noise.decay).sustain(0)
  .pan(rand.mul(1.8).sub(0.9))
  .degradeBy(bits.noise.prob.fmap((p) => 1 - p))
  .room(verb.mul(0.1)).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ГОЛОС — numbers: цифры 0–8, по одному слову на такт
// ══════════════════════════════════════════════════════════════════

// Это не «йоу» и не «ах»: `numbers` — человеческий голос, который
// произносит цифры. По умолчанию одно слово на такт, `clip` режет
// хвост, `voxMode` 2 рубит на куски, 3 — питчит.

// ГОЛОС — numbers: цифры 0–8, одно слово на такт.
$: s("numbers")
  .n("<0 1 2 3 4 5 6 7 8>")
  .clip(vox.phrase.clip)
  .speed(vox.phrase.speed.mul(semis(vox.phrase.pitch.mul(voxPitch))))
  .chop(vox.phrase.chop.mul(voxChop).add(1))
  .gain(vox.phrase.vol.mul(voxOn))
  .lpf(vox.phrase.cut).hpf(180).lpq(1)
  .delay(vox.phrase.echo.mul(fx.delay.send)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback)
  .room(vox.phrase.room.mul(verb)).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  АККОРДЫ — тёмный пэд и редкий стаб
// ══════════════════════════════════════════════════════════════════

// PAD A — DARK: тритоновые пары. Долгая атака, короткий хвост:
// реверба мало, поэтому пэд не «плавает», а висит.
$: note(PAD_A)
  .s("sawtooth").partials([1, 0.5, 0.3, 0.15])
  .unison(2).detune(chords.pad.det)
  .gain(chords.pad.vol.mul(hA).mul(padOn))
  .lpf(chords.pad.cut).hpf(chords.pad.hpf).lpq(chords.pad.q.mul(chords.pad.fb)).ftype("24db")
  .lpdepth(chords.pad.lfo.mul(chords.pad.fb)).lpsync(0.25).lpdc(0)
  .chorus(chords.pad.fb.mul(0.4))
  .attack(1.2).decay(1.0).sustain(0.8).release(2.2)
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .filter(audible)

// PAD B — GHOST: квинты с 9-й, выше и прозрачнее. Не второй аккорд,
// а другой воздух над тем же полем.
$: note(PAD_B)
  .s("triangle").partials([1, 0.3, 0.12])
  .unison(3).detune(chords.pad.det.mul(1.4))
  .gain(chords.pad.vol.mul(hB).mul(padOn))
  .lpf(chords.pad.cut.mul(1.3)).hpf(300).lpq(chords.pad.q.mul(0.7).mul(chords.pad.fb))
  .lpdepth(chords.pad.lfo.mul(chords.pad.fb)).lpsync(0.25).lpdc(0)
  .chorus(chords.pad.fb.mul(0.6))
  .attack(1.6).decay(1.2).sustain(0.8).release(2.8)
  .room(verb.mul(0.7)).roomsize(fx.reverb.size)
  .filter(audible)

// STAB — короткий тритон раз в два такта. Дальше работает дилей.
$: note(STAB)
  .s("sawtooth").unison(2).detune(0.04)
  .gain(chords.stab.vol.mul(padOn))
  .lpf(chords.stab.cut).hpf(180).lpq(chords.stab.res).ftype("24db")
  .attack(0.005).decay(chords.stab.decay).sustain(0).release(0.6)
  .delay(fx.delay.send.mul(0.7)).delaytime(fx.delay.time).delayfeedback(fx.delay.feedback)
  .room(chords.stab.room.mul(verb)).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ПЭДЫ — momentary, держишь — играет
// ══════════════════════════════════════════════════════════════════

// ROLL — 32-е из glitch. Держишь — ролл, отпустил — тишина.
$: s("glitch").n("0 1 2 0 1 3")
  .fast(32)
  .gain(drums.roll.vol.mul(padRoll))
  .lpf(drums.roll.cut).hpf(400)
  .decay(drums.roll.decay).sustain(0)
  .pan(rand.mul(1.4).sub(0.7))
  .filter(audible)

// CUT — рваный стуттер: короткие куски с дырами. Это не громкость,
// а ритмическая решётка поверх микса.
$: s("glitch").n("0 2 1 0")
  .fast(drums.cut.rate)
  .struct("x ~ x x ~ x ~ x")
  .gain(drums.cut.vol.mul(padCut))
  .lpf(drums.cut.cut).hpf(500)
  .decay(0.035).sustain(0)
  .pan(rand.mul(1.6).sub(0.8))
  .room(verb.mul(0.1)).roomsize(fx.reverb.size)
  .filter(audible)

// BURST — промышленный шумовой удар. Держишь — ржавчина.
$: s("white")
  .struct("x ~ x x ~ x ~ x")
  .clip(0.05)
  .crush(drums.burst.crush)
  .gain(drums.burst.vol.mul(padBurst))
  .hpf(900).lpf(drums.burst.cut)
  .decay(drums.burst.decay).sustain(0)
  .pan(rand.mul(1.2).sub(0.6))
  .filter(audible)

// DROP — саб-дроп на пэде. Короткий, чтобы не залезть в бас.
$: note("<c1 c1 db1 gb1>")
  .s("sine")
  .gain(drums.drop.vol.mul(padDrop))
  .lpf(drums.drop.cut).lpq(1)
  .penv(-24).panchor(1).pattack(0.001).pdecay(0.4).psustain(0)
  .decay(drums.drop.decay).sustain(0).release(0.1)
  .room(verb.mul(0.1)).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ШПАРГАЛКА НА НОЧЬ
// ══════════════════════════════════════════════════════════════════
//  Имена — пути по дереву: группа.инструмент.параметр.
//
//  пустота:       atmos.hiss 0.04 + air 0.02 + field 0.02, verb 0.18
//  вход:          scene 2 MAIN, drums.kick.vol 0.3, bass.sub.vol 0.28
//  грязь:         bass.growl.vol 0.15–0.3, cut 200–400, grit 0.2–0.4
//  резина:        bass.fm.vol 0.08–0.15, ratio 1.2–2.5, index 2–4
//  грануляр:      grainMode 1 cloud / 2 scan / 3 edit; cloud.chop 16–48
//  облако:        grain.cloud.scan 0.05–0.5, window 0.1–0.3, density 1–2
//  заморозка:     держи padFreeze; grain.freeze.pos 0.2–0.6
//  эйсид:         acidMode 1 sparse / 2 run / 3 scream; line.pace 1–4
//  биты:          bitMode 0 clean / 1 crush / 2 coarse / 3 both
//  8-бит:         bits.arp.rate 8/16/32, bits.lead.pw 0.2–0.6
//  ритм:          mode 0 glitch / 1 grain / 2 acid / 3 strip /
//                 4 skitter / 5 shuffle / 6 poly / 7 fracture
//  мутация:       mutate 0.25 (призраки), fill 0 (32-й филл)
//  сцены:         scene 0 intro / 1 build / 2 main / 3 break / 4 outro
//  низ:           bass.sub.cut 60–80 (max 80), kick.cut 180
//  реверб:        мало. verb 0.1–0.25; пространство — delay и панорама
//  антипоп:       никаких мажорных трезвучий, райзеров, «красивых»
//                 лидов и 1–2–4–5; тритон — ось, а не ошибка
// ══════════════════════════════════════════════════════════════════
