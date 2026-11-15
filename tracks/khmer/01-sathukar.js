// ══════════════════════════════════════════════════════════════════
//  KHMER 01 · SATHUKAR  ·  Strudel  ·  88 BPM  ·  pinpeat / percussion
//
//  Не «этника для ресторана» и не саундтрек к тревел-блогу. Это
//  современный трек, собранный по правилам кхмерского ансамбля
//  пинпет (ពិណពាទ្យ): цикл, колотомия, гетерофония, семитоновая
//  шкала и ударные на первом плане. Никаких западных аккордовых
//  прогрессий и «красивых» каденций — в пинпете их нет.
//
//  ── ИНСТРУМЕНТЫ ────────────────────────────────────────────────
//  • RONEAT EK — свинцовый ксилофон, 21 планка; здесь деревянный
//    синтез: triangle + частичные, короткий «ток» на атаке.
//  • RONEAT THUNG — нижний ксилофон: та же мелодия, но скелет,
//    октавой ниже и реже.
//  • KONG VONG — круглые гонги: остинатная опора, длинный хвост.
//  • SRALAI — кхмерский гобой (квадрупольный тростник): только
//    духовой инструмент пинпета, ансамбль строится от его строя.
//    Здесь — пила с формантным фильтром, без «саксофона».
//  • SAMPHO — маленький двуглавый барабан, ведущий ансамбль;
//    четыре удара (ting / tip / theung / tup).
//  • SKOR THOM — пара больших барабанов палочками: один tight,
//    второй loose. Спереди ансамбля.
//  • CHHING — маленькие тарелочки-«часы»: закрытый акцент и
//    открытый «чинг». Держат цикл.
//  • KRAP — деревянные клэпперы; в пинпете почти вышли из моды,
//    здесь — редкий акцент в «боксёрском» режиме.
//  • DRONE — современный бурдон C (не часть пинпета): низкая
//    опора, чтобы синтез не висел в воздухе.
//
//  ── СТРОЙ И ГАРМОНИЯ ───────────────────────────────────────────
//  Кхмерская шкала — семь тонов в октаве, близко к равномерным
//  шагам ~171 цент (классическая теория Эллиса; на практике строй
//  плавает). Абсолютной высоты нет: ансамбль настраивается по
//  сралаю. В 12-TET это приближается двумя способами:
//    7 тонов:  c db eb f gb ab bb   (тёмное округление, взято здесь)
//    5 тонов:  c eb f g bb          (пентатонический скелет)
//  Roneat ek играет 7 тонов, roneat thung и конг вонг — скелет.
//  Гетерофония: одна мелодия в разных плотностях, без аккордов.
//  @roots c c c c c c c c
//  @dark
//
//  ── РИТМ ───────────────────────────────────────────────────────
//  Один цикл = один такт 4/4. Chhing отмечает доли, sampho ведёт
//  рисунок, skor thom держит «пол». Восемь тактов = фраза. Никаких
//  1–2–4–5: гармония не движется, движется плотность.
//
//  ── РЕЖИМЫ ─────────────────────────────────────────────────────
//  mode 0 SATHUKAR  — медленный церемониальный: 5 тонов, редко.
//  mode 1 PINPEAT   — полный ансамбль: 7 тонов, сралай, самфо.
//  mode 2 BOXING    — «боксёрский» кусок: чаще, злее, с филлами.
//  mode 3 PERCUSSION — только ударные, гонги и часы; мелодии нет.
//
//  ── КНОПКИ И ПЭДЫ ──────────────────────────────────────────────
//  Три переключателя: scene, mode, harmony (защёлка на 8 тактов).
//  Шесть momentary-пэдов: gong, sampho, skor, chhing, reed, swell.
//  Клавиши 1–6 в панели. Пэд — 0/1, панель пишет его на время
//  нажатия; в треке он обязан быть гейтом.
//
//  ── СТАРТ ──────────────────────────────────────────────────────
//  scene 2 (MAIN), mode 1 (PINPEAT), harmony 0 (fifth). Сразу
//  слышны гонги, часы, барабаны, ксилофон и сралай. Бурдон тихий.
// ══════════════════════════════════════════════════════════════════

const BPM = 88
setcpm(BPM / 4) // один цикл = один такт 4/4 (≈ 2.73 с)

// ══════════════════════════════════════════════════════════════════
//  СЭМПЛОВ НЕТ
// ══════════════════════════════════════════════════════════════════
// Весь трек — синтез: sine / triangle / sawtooth / white / pink.
// Это осознанно: кхмерские инструменты не семплируются «первым
// попавшимся» банком, а их строй всё равно не совпадает с 12-TET.
// Заодно live-проверка не зависит от загрузки GitHub-сэмплов.

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
// @switches scene=intro,build,main,break,outro mode=sathukar,pinpeat,boxing,percussion harmony=fifth,axis
const scene = slider(2, 0, 4, 1)
const mode = slider(1, 0, 3, 1)
const harmony = slider(0, 0, 1, 1)

// @pads padGong,padSampho,padSkor,padChhing,padReed,padSwell
const padGong = slider(0, 0, 1, 1)
const padSampho = slider(0, 0, 1, 1)
const padSkor = slider(0, 0, 1, 1)
const padChhing = slider(0, 0, 1, 1)
const padReed = slider(0, 0, 1, 1)
const padSwell = slider(0, 0, 1, 1)

// Глобальные ручки.
const verb = slider(0.22, 0, 0.6, 0.01)

// ══════════════════════════════════════════════════════════════════
//  ИНСТРУМЕНТЫ
// ══════════════════════════════════════════════════════════════════
const instruments = {
  // ── ВОЗДУХ ────────────────────────────────────────────────────
  atmos: {
    name: 'Atmos',
    air: {
      name: 'Temple air',
      vol: slider(0.025, 0, 0.15, 0.005),
      cut: slider(900, 100, 6000, 20),
      lfo: slider(0.25, 0, 2, 0.05),
    },
    dust: {
      name: 'Dust',
      vol: slider(0.015, 0, 0.12, 0.005),
      cut: slider(4200, 400, 12000, 50),
    },
  },

  // ── БУРДОН ─────────────────────────────────────────────────────
  // Не аккорд и не «пэд»: одна низкая опора. В пинпете её нет,
  // это современная подложка, поэтому громкость маленькая.
  drone: {
    name: 'Drone',
    low: {
      name: 'Drone low',
      vol: slider(0.1, 0, 0.5, 0.01),
      cut: slider(220, 60, 600, 5),
      det: slider(0.04, 0, 0.2, 0.005),
    },
  },

  // ── САБ ────────────────────────────────────────────────────────
  // По правилу проекта саб ≤80. В традиции его нет; здесь он
  // слышен только в build/main и не спорит с барабанами.
  bass: {
    name: 'Bass',
    sub: {
      name: 'Sub ≤80',
      vol: slider(0.12, 0, 0.6, 0.01),
      cut: slider(72, 40, 80, 1),
      decay: slider(0.9, 0.2, 2.5, 0.05),
    },
  },

  // ── ГОНГИ ──────────────────────────────────────────────────────
  gong: {
    name: 'Gong',
    vong: {
      name: 'Kong vong',
      vol: slider(0.16, 0, 0.7, 0.01),
      cut: slider(2600, 300, 9000, 50),
      decay: slider(1.4, 0.2, 4, 0.05),
      fm: slider(1.6, 0, 5, 0.1),
      ratio: slider(1.41, 1, 3, 0.01),
      room: slider(0.3, 0, 0.8, 0.01),
    },
    thom: {
      name: 'Kong thom',
      vol: slider(0.1, 0, 0.5, 0.01),
      cut: slider(400, 80, 2000, 10),
      decay: slider(2.4, 0.4, 6, 0.1),
      fm: slider(0.8, 0, 3, 0.05),
      ratio: slider(2.76, 1, 4, 0.01),
    },
  },

  // ── КСИЛОФОНЫ ──────────────────────────────────────────────────
  roneat: {
    name: 'Roneat',
    ek: {
      name: 'Roneat ek',
      vol: slider(0.16, 0, 0.6, 0.01),
      cut: slider(5200, 800, 12000, 50),
      decay: slider(0.16, 0.05, 0.5, 0.005),
    },
    thung: {
      name: 'Roneat thung',
      vol: slider(0.12, 0, 0.5, 0.01),
      cut: slider(2600, 400, 8000, 50),
      decay: slider(0.3, 0.08, 0.9, 0.01),
    },
  },

  // ── СРАЛАЙ ─────────────────────────────────────────────────────
  // Квадрупольный тростник, а не саксофон: пила + резонанс +
  // короткий «грязный» shape, без гладкого вибрато.
  reed: {
    name: 'Sralai',
    lead: {
      name: 'Sralai',
      vol: slider(0.1, 0, 0.5, 0.01),
      cut: slider(2200, 300, 7000, 20),
      q: slider(2, 0, 10, 0.1),
      grit: slider(0.18, 0, 0.6, 0.01),
      att: slider(0.09, 0.02, 0.6, 0.01),
      rel: slider(0.4, 0.05, 1.2, 0.01),
      echo: slider(0.18, 0, 0.6, 0.01),
    },
  },

  // ── БАРАБАНЫ ───────────────────────────────────────────────────
  drums: {
    name: 'Drums',
    skorLow: {
      name: 'Skor thom low',
      vol: slider(0.22, 0, 0.8, 0.01),
      cut: slider(140, 60, 400, 5),
      pitch: slider(0, -12, 6, 1),
      decay: slider(0.55, 0.15, 1.4, 0.01),
    },
    skorHigh: {
      name: 'Skor thom high',
      vol: slider(0.16, 0, 0.7, 0.01),
      cut: slider(260, 80, 700, 5),
      pitch: slider(0, -12, 6, 1),
      decay: slider(0.35, 0.1, 1, 0.01),
    },
    samLow: {
      name: 'Sampho low',
      vol: slider(0.18, 0, 0.7, 0.01),
      cut: slider(500, 100, 1800, 10),
      pitch: slider(0, -12, 6, 1),
      decay: slider(0.22, 0.05, 0.6, 0.01),
    },
    samHigh: {
      name: 'Sampho high',
      vol: slider(0.12, 0, 0.6, 0.01),
      cut: slider(1400, 300, 5000, 20),
      pitch: slider(0, -12, 6, 1),
      decay: slider(0.12, 0.03, 0.4, 0.005),
    },
    samGhost: {
      name: 'Sampho ghost',
      vol: slider(0.07, 0, 0.5, 0.01),
      cut: slider(1800, 300, 6000, 20),
      pitch: slider(0, -12, 6, 1),
      decay: slider(0.06, 0.02, 0.2, 0.005),
      prob: slider(0.7, 0.2, 1, 0.01),
    },
    chhing: {
      name: 'Chhing',
      vol: slider(0.09, 0, 0.5, 0.01),
      cut: slider(9000, 3000, 16000, 100),
      decay: slider(0.04, 0.01, 0.2, 0.005),
      ring: slider(0.16, 0.02, 0.5, 0.01),
    },
    chhingOpen: {
      name: 'Chhing open',
      vol: slider(0.07, 0, 0.5, 0.01),
      cut: slider(7000, 2000, 16000, 100),
      decay: slider(0.18, 0.05, 0.6, 0.01),
    },
    krap: {
      name: 'Krap',
      vol: slider(0.06, 0, 0.4, 0.01),
      cut: slider(3000, 800, 9000, 50),
      decay: slider(0.03, 0.01, 0.12, 0.005),
    },
    fills: {
      name: 'Drum fills',
      vol: slider(0.08, 0, 0.6, 0.01),
      cut: slider(1600, 300, 6000, 20),
      rate: slider(16, 8, 32, 1),
    },
  },

  // ── ЭФФЕКТЫ ────────────────────────────────────────────────────
  fx: {
    name: 'FX',
    delay: {
      name: 'Delay',
      send: slider(0.18, 0, 0.6, 0.01),
      time: slider(0.375, 0.0625, 0.75, 0.0625),
      feedback: slider(0.3, 0, 0.7, 0.01),
    },
    reverb: {
      name: 'Reverb',
      size: slider(4, 1, 10, 0.1),
    },
  },
}

const { atmos, drone, bass, gong, roneat, reed, drums, fx } = instruments

const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}

// ══════════════════════════════════════════════════════════════════
//  ГЕЙТЫ
// ══════════════════════════════════════════════════════════════════
const atScene = (n) => scene.fmap((v) => (v === n ? 1 : 0))

const drumsOn = scene.fmap((v) => (v === 1 || v === 2 || v === 3 ? 1 : 0))
const bassOn = scene.fmap((v) => (v === 1 || v === 2 ? 1 : 0))
const gongOn = scene.fmap((v) => (v === 1 || v === 2 || v === 3 || v === 4 ? 1 : 0))
const thungOn = scene.fmap((v) => (v === 1 || v === 2 || v === 4 ? 1 : 0))
const ekOn = scene.fmap((v) => (v === 2 ? 1 : 0))
const reedOn = scene.fmap((v) => (v === 2 ? 1 : 0))
const krapOn = scene.fmap((v) => (v === 2 || v === 3 ? 1 : 0))

// Режим: 0 SATHUKAR / 1 PINPEAT / 2 BOXING / 3 PERCUSSION.
const m0 = mode.fmap((v) => (v === 0 ? 1 : 0))
const m1 = mode.fmap((v) => (v === 1 ? 1 : 0))
const m2 = mode.fmap((v) => (v === 2 ? 1 : 0))
const m3 = mode.fmap((v) => (v === 3 ? 1 : 0))

const melodic = mode.fmap((v) => (v === 0 || v === 1 || v === 2 ? 1 : 0))
const ek5On = mode.fmap((v) => (v === 0 ? 1 : 0))
const ek7On = mode.fmap((v) => (v === 1 || v === 2 ? 1 : 0))

// Защёлка гармонии: 1 сэмпл на 8 тактов.
const hQ = harmony.seg(1 / 8)
const hA = hQ.fmap((h) => (h < 0.5 ? 1 : 0))
const hB = hQ.fmap((h) => (h < 0.5 ? 0 : 1))

// ══════════════════════════════════════════════════════════════════
//  ФРАЗЫ (8 тактов = одна фраза)
// ══════════════════════════════════════════════════════════════════
const phrase = (bars) => m('<' + bars.join(' ') + '>')

// @roots c c c c c c c c
// @scenes {"intro":{"scene":0,"mode":0,"harmony":0,"atmos.air.vol":0.025,"atmos.dust.vol":0.015,"drone.low.vol":0.1,"bass.sub.vol":0,"gong.vong.vol":0.16,"gong.thom.vol":0.1,"roneat.ek.vol":0,"roneat.thung.vol":0,"reed.lead.vol":0,"drums.skorLow.vol":0,"drums.skorHigh.vol":0,"drums.samLow.vol":0,"drums.samHigh.vol":0,"drums.samGhost.vol":0,"drums.chhing.vol":0.09,"drums.chhingOpen.vol":0.07,"drums.krap.vol":0,"drums.fills.vol":0,"verb":0.22},"theme":{"scene":2,"mode":1,"harmony":0,"atmos.air.vol":0.025,"atmos.dust.vol":0.015,"drone.low.vol":0.1,"bass.sub.vol":0.12,"gong.vong.vol":0.16,"gong.thom.vol":0.1,"roneat.ek.vol":0.16,"roneat.thung.vol":0.12,"reed.lead.vol":0.1,"drums.skorLow.vol":0.22,"drums.skorHigh.vol":0.16,"drums.samLow.vol":0.18,"drums.samHigh.vol":0.12,"drums.samGhost.vol":0.07,"drums.chhing.vol":0.09,"drums.chhingOpen.vol":0.07,"drums.krap.vol":0,"drums.fills.vol":0,"verb":0.22}}

// PAD A — кварто-квинтовая опора C–G. Это не мажор и не минор:
// открытая квинта, как строй гонгов.
const PAD_A = phrase([
  '[c2,g2,c3]', '[c2,g2,c3]',
  '[c2,g2,c3]', '[c2,g2,c3]',
  '[c2,g2,c3]', '[c2,g2,c3]',
  '[c2,g2,c3]', '[c2,g2,c3]',
])

// PAD B — та же опора, но с тритоном C–Gb. Это «ось» семитоновой
// шкалы, а не второй аккорд: гармония не движется, меняется цвет.
const PAD_B = phrase([
  '[c2,gb2,c3]', '[c2,gb2,c3]',
  '[c2,gb2,c3]', '[c2,gb2,c3]',
  '[c2,gb2,c3]', '[c2,gb2,c3]',
  '[c2,gb2,c3]', '[c2,gb2,c3]',
])

// EK7 — семитоновая мелодия: C, Db, Eb, F, Gb, Ab, Bb. Тритон Gb
// к корню C — намеренный (@dark), малых секунд нет.
const EK7 = phrase([
  '[c5 ~ eb5 ~ f5 ~ eb5 ~]',
  '[c5 ~ ~ gb5 f5 ~ eb5 ~]',
  '[db5 ~ ~ f5 eb5 ~ db5 ~]',
  '[db5 ~ eb5 ~ ~ f5 gb5 ~]',
  '[gb5 ~ ~ f5 eb5 ~ db5 ~]',
  '[gb5 ~ ab5 ~ ~ bb5 ab5 ~]',
  '[bb5 ~ ~ ab5 gb5 ~ f5 ~]',
  '[f5 eb5 ~ db5 ~ c5 ~ ~]',
])

// EK5 — пентатонический скелет C, Eb, F, G, Bb. Режим SATHUKAR:
// та же мелодия, но без Db и Gb — ближе к «пятитоновой» основе.
const EK5 = phrase([
  '[c5 ~ eb5 ~ f5 ~ eb5 ~]',
  '[c5 ~ ~ g5 f5 ~ eb5 ~]',
  '[bb4 ~ ~ f5 eb5 ~ c5 ~]',
  '[bb4 ~ c5 ~ ~ eb5 f5 ~]',
  '[f5 ~ ~ eb5 c5 ~ bb4 ~]',
  '[f5 ~ g5 ~ ~ bb5 g5 ~]',
  '[bb5 ~ ~ g5 f5 ~ eb5 ~]',
  '[eb5 c5 ~ bb4 ~ c5 ~ ~]',
])

// THUNG — нижний ксилофон: скелет мелодии, реже и на октаву ниже.
const THUNG = phrase([
  '[c4 ~ ~ ~ ~ ~ eb4 ~]',
  '[c4 ~ ~ ~ ~ ~ ~ ~]',
  '[bb3 ~ ~ ~ ~ ~ c4 ~]',
  '[bb3 ~ ~ ~ ~ ~ ~ ~]',
  '[f4 ~ ~ ~ ~ ~ eb4 ~]',
  '[f4 ~ ~ ~ ~ ~ ~ ~]',
  '[bb4 ~ ~ ~ ~ ~ g4 ~]',
  '[eb4 ~ ~ c4 ~ ~ ~ ~]',
])

// VONG — круглые гонги: две опоры на такт, длинный хвост.
const VONG = phrase([
  '[c3 ~ ~ ~ g3 ~ ~ ~]',
  '[c3 ~ ~ ~ eb3 ~ ~ ~]',
  '[f3 ~ ~ ~ c3 ~ ~ ~]',
  '[f3 ~ ~ ~ eb3 ~ ~ ~]',
  '[bb3 ~ ~ ~ f3 ~ ~ ~]',
  '[bb3 ~ ~ ~ g3 ~ ~ ~]',
  '[eb3 ~ ~ ~ c3 ~ ~ ~]',
  '[g3 ~ ~ ~ c3 ~ ~ ~]',
])

// REED — сралай: длинные ноты, без бега по аккордам.
const REED = phrase([
  '[c5 ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ gb5 ~ ~ ~]',
  '[~ ~ eb5 ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ f5 ~ ~ ~]',
  '[~ ~ ~ ~ c5 ~ ~ ~]',
  '[~ ~ ab5 ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ gb5 ~ ~ ~]',
  '[~ ~ f5 ~ ~ ~ eb5 ~]',
])

// REED_BOX — короткие фразы для боксёрского режима.
const REED_BOX = phrase([
  '[c5 ~ gb5 c5 ~ f5 ~ eb5]',
  '[c5 ~ gb5 ~ f5 ~ eb5 ~]',
  '[db5 ~ f5 ~ eb5 ~ c5 ~]',
  '[db5 eb5 ~ f5 ~ gb5 ~ ~]',
  '[gb5 ~ f5 ~ eb5 ~ c5 ~]',
  '[gb5 ~ ab5 ~ bb5 ~ ab5 ~]',
  '[bb5 ~ gb5 ~ f5 ~ eb5 ~]',
  '[f5 ~ eb5 ~ c5 ~ ~ ~]',
])

// ══════════════════════════════════════════════════════════════════
//  ВОЗДУХ
// ══════════════════════════════════════════════════════════════════

// ХРАМОВЫЙ ВОЗДУХ — розовый шум, срез дышит. Не реверб.
$: s("pink")
  .gain(atmos.air.vol)
  .lpf(atmos.air.cut).hpf(180).lpq(0.7)
  .lpdepth(atmos.air.lfo).lpsync(0.125).lpdc(0)
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .filter(audible)

// ПЫЛЬ — редкие высокие точки. Сухо: это не облако, а воздух.
$: s("white")
  .struct("~ x ~ ~ ~ x ~ ~ ~ ~ x ~ ~ x ~ ~")
  .clip(0.02)
  .gain(atmos.dust.vol)
  .hpf(3000).lpf(atmos.dust.cut)
  .decay(0.05).sustain(0)
  .pan(rand.mul(1.4).sub(0.7))
  .room(verb.mul(0.2)).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  БУРДОН И САБ
// ══════════════════════════════════════════════════════════════════

// ДРОН — открытая квинта C–G. Долгая атака, длинный хвост.
$: note(PAD_A)
  .s("triangle").partials([1, 0.4, 0.2])
  .unison(2).detune(drone.low.det)
  .gain(drone.low.vol.mul(hA))
  .lpf(drone.low.cut).hpf(40)
  .attack(1.6).decay(1.2).sustain(0.85).release(2.4)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .filter(audible)

// ДРОН B — та же опора с тритоном. Защёлка harmony = axis.
$: note(PAD_B)
  .s("triangle").partials([1, 0.4, 0.2])
  .unison(2).detune(drone.low.det.mul(1.2))
  .gain(drone.low.vol.mul(hB))
  .lpf(drone.low.cut.mul(0.9)).hpf(40)
  .attack(1.8).decay(1.2).sustain(0.85).release(2.6)
  .room(verb.mul(0.55)).roomsize(fx.reverb.size)
  .filter(audible)

// САБ — только build/main. Срез ≤80, как в правилах проекта.
$: note("<c1>")
  .s("sine")
  .struct("x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~")
  .gain(bass.sub.vol.mul(bassOn))
  .lpf(bass.sub.cut).lpq(1)
  .attack(0.01).decay(bass.sub.decay).sustain(0.5).release(0.4)
  .orbit(2)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ГОНГИ
// ══════════════════════════════════════════════════════════════════

// KONG VONG — остинатная опора. FM даёт негармонический обертон,
// как у бронзового гонга; фильтр держит удар, а не «колокол».
$: note(VONG)
  .s("sine")
  .fm(gong.vong.fm).fmh(gong.vong.ratio)
  .fmdecay(gong.vong.decay).fmsustain(0)
  .gain(gong.vong.vol.mul(gongOn))
  .lpf(gong.vong.cut).hpf(120).lpq(1)
  .decay(gong.vong.decay).sustain(0).release(0.4)
  .pan(sine.slow(16).range(0.4, 0.6))
  .delay(fx.delay.send.mul(0.15)).delaytime(fx.delay.time)
  .delayfeedback(fx.delay.feedback.mul(0.4))
  .room(verb.mul(gong.vong.room)).roomsize(fx.reverb.size)
  .filter(audible)

// KONG THOM — большой гонг на первой доле. Один удар, много воздуха.
$: note("<c2>")
  .s("sine")
  .struct("x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~")
  .fm(gong.thom.fm).fmh(gong.thom.ratio)
  .fmdecay(gong.thom.decay).fmsustain(0)
  .gain(gong.thom.vol.mul(gongOn))
  .lpf(gong.thom.cut).hpf(40)
  .decay(gong.thom.decay).sustain(0).release(1)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  КСИЛОФОНЫ
// ══════════════════════════════════════════════════════════════════

// RONEAT EK, 5 ТОНОВ — режим SATHUKAR. Короткий «ток» на атаке
// (penv) и частичные, чтобы планка звучала деревянно, а не как
// синус-писк.
$: note(EK5)
  .s("triangle").partials([1, 0.5, 0.25, 0.12])
  .penv(-5).panchor(1).pattack(0.001).pdecay(0.02).psustain(0)
  .gain(roneat.ek.vol.mul(ek5On).mul(ekOn))
  .lpf(roneat.ek.cut).hpf(400).lpq(1)
  .decay(roneat.ek.decay).sustain(0).release(0.05)
  .pan(sine.slow(12).range(0.45, 0.6))
  .room(verb.mul(0.18)).roomsize(fx.reverb.size)
  .filter(audible)

// RONEAT EK, 7 ТОНОВ — режимы PINPEAT и BOXING.
$: note(EK7)
  .s("triangle").partials([1, 0.5, 0.25, 0.12])
  .penv(-5).panchor(1).pattack(0.001).pdecay(0.02).psustain(0)
  .gain(roneat.ek.vol.mul(ek7On).mul(ekOn))
  .lpf(roneat.ek.cut).hpf(400).lpq(1)
  .decay(roneat.ek.decay).sustain(0).release(0.05)
  .pan(sine.slow(12).range(0.4, 0.65))
  .room(verb.mul(0.18)).roomsize(fx.reverb.size)
  .filter(audible)

// RONEAT THUNG — нижний ксилофон, скелет мелодии. Играет и в
// размеренных сценах, и в «ломе», но не в percussion-only.
$: note(THUNG)
  .s("sine").partials([1, 0.3, 0.12])
  .penv(-4).panchor(1).pattack(0.001).pdecay(0.03).psustain(0)
  .gain(roneat.thung.vol.mul(melodic).mul(thungOn))
  .lpf(roneat.thung.cut).hpf(220).lpq(1)
  .decay(roneat.thung.decay).sustain(0).release(0.08)
  .pan(sine.slow(14).range(0.35, 0.55))
  .room(verb.mul(0.2)).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  СРАЛАЙ
// ══════════════════════════════════════════════════════════════════

// SRALAI — длинные ноты, пила с резонансом. Это не саксофон:
// никакого гладкого вибрато и «джазовой» фразировки.
$: note(REED)
  .s("sawtooth").unison(2).detune(0.05)
  .gain(reed.lead.vol.mul(m1).mul(reedOn))
  .lpf(reed.lead.cut).lpq(reed.lead.q).ftype("24db")
  .shape(reed.lead.grit)
  .attack(reed.lead.att).decay(0.2).sustain(0.8).release(reed.lead.rel)
  .delay(reed.lead.echo.mul(fx.delay.send)).delaytime(fx.delay.time)
  .delayfeedback(fx.delay.feedback)
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .filter(audible)

// SRALAI, BOXING — короткие фразы в режиме BOXING. Тот же тембр,
// другая плотность: в боксе сралай и самфо играют «вопрос-ответ».
$: note(REED_BOX)
  .s("sawtooth").unison(2).detune(0.06)
  .gain(reed.lead.vol.mul(m2).mul(0.8).mul(reedOn))
  .lpf(reed.lead.cut.mul(1.15)).lpq(reed.lead.q).ftype("24db")
  .shape(reed.lead.grit)
  .attack(0.04).decay(0.12).sustain(0.55).release(0.22)
  .delay(reed.lead.echo.mul(fx.delay.send)).delaytime(fx.delay.time)
  .delayfeedback(fx.delay.feedback)
  .room(verb.mul(0.22)).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  БАРАБАНЫ
// ══════════════════════════════════════════════════════════════════
// Синтез, а не drumkit: у каждого барабана свой корпус (синус с
// падением питча) и своя роль. Палочки skor thom — короткий
// питч-спуск; руки sampho — мягче и выше.

// SKOR THOM LOW — большой «loose» барабан. Четыре рисунка по режимам.
$: stack(
     s("triangle").struct("x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~")
       .gain(drums.skorLow.vol.mul(drumsOn).mul(m0)),
     s("triangle").struct("x ~ ~ ~ ~ ~ x ~ x ~ ~ ~ ~ ~ x ~")
       .gain(drums.skorLow.vol.mul(drumsOn).mul(m1)),
     s("triangle").struct("x ~ ~ x ~ ~ x ~ x ~ ~ x ~ ~ x x")
       .gain(drums.skorLow.vol.mul(drumsOn).mul(m2)),
     s("triangle").struct("x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~")
       .gain(drums.skorLow.vol.mul(drumsOn).mul(m3)),
   )
  .note("<c1>").add(note(drums.skorLow.pitch))
  .penv(-12).panchor(1).pattack(0.001).pdecay(0.08).psustain(0)
  .lpf(drums.skorLow.cut).hpf(30).lpq(1)
  .decay(drums.skorLow.decay).sustain(0).release(0.08)
  .room(verb.mul(0.18)).roomsize(fx.reverb.size)
  .filter(audible)

// SKOR THOM HIGH — парный «tight» барабан. Отвечает low, не дублирует.
$: stack(
     s("sine").struct("~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~")
       .gain(drums.skorHigh.vol.mul(drumsOn).mul(m0)),
     s("sine").struct("~ ~ x ~ ~ x ~ ~ ~ ~ x ~ ~ x ~ ~")
       .gain(drums.skorHigh.vol.mul(drumsOn).mul(m1)),
     s("sine").struct("~ x ~ x ~ x ~ x ~ x ~ x ~ x ~ x")
       .gain(drums.skorHigh.vol.mul(drumsOn).mul(m2)),
     s("sine").struct("~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~")
       .gain(drums.skorHigh.vol.mul(drumsOn).mul(m3)),
   )
  .note("<g1>").add(note(drums.skorHigh.pitch))
  .penv(-10).panchor(1).pattack(0.001).pdecay(0.05).psustain(0)
  .lpf(drums.skorHigh.cut).hpf(40).lpq(1)
  .decay(drums.skorHigh.decay).sustain(0).release(0.06)
  .pan(sine.slow(10).range(0.42, 0.58))
  .room(verb.mul(0.15)).roomsize(fx.reverb.size)
  .filter(audible)

// SAMPHO LOW — открытая большая голова (theung). Ведёт ансамбль.
$: stack(
     s("sine").struct("x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~")
       .gain(drums.samLow.vol.mul(drumsOn).mul(m0)),
     s("sine").struct("x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ x")
       .gain(drums.samLow.vol.mul(drumsOn).mul(m1)),
     s("sine").struct("x ~ x ~ ~ x x ~ x ~ x ~ ~ x x ~")
       .gain(drums.samLow.vol.mul(drumsOn).mul(m2)),
     s("sine").struct("x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ x")
       .gain(drums.samLow.vol.mul(drumsOn).mul(m3)),
   )
  .note("<eb2>").add(note(drums.samLow.pitch))
  .penv(-8).panchor(1).pattack(0.001).pdecay(0.04).psustain(0)
  .lpf(drums.samLow.cut).hpf(80).lpq(1.2)
  .decay(drums.samLow.decay).sustain(0).release(0.06)
  .pan(sine.slow(12).range(0.4, 0.6))
  .room(verb.mul(0.14)).roomsize(fx.reverb.size)
  .filter(audible)

// SAMPHO HIGH — малая голова (ting). Синкопы и ответы.
$: stack(
     s("sine").struct("~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~")
       .gain(drums.samHigh.vol.mul(drumsOn).mul(m0)),
     s("sine").struct("~ ~ x ~ x ~ ~ ~ x ~ ~ ~ x ~ x ~")
       .gain(drums.samHigh.vol.mul(drumsOn).mul(m1)),
     s("sine").struct("~ x x ~ x x ~ x x ~ x x ~ x x x")
       .gain(drums.samHigh.vol.mul(drumsOn).mul(m2)),
     s("sine").struct("~ ~ x ~ x ~ ~ ~ x ~ ~ ~ x ~ x ~")
       .gain(drums.samHigh.vol.mul(drumsOn).mul(m3)),
   )
  .note("<g2>").add(note(drums.samHigh.pitch))
  .penv(-14).panchor(1).pattack(0.001).pdecay(0.02).psustain(0)
  .lpf(drums.samHigh.cut).hpf(180).lpq(1.2)
  .decay(drums.samHigh.decay).sustain(0).release(0.04)
  .pan(sine.slow(9).range(0.45, 0.6))
  .room(verb.mul(0.12)).roomsize(fx.reverb.size)
  .filter(audible)

// SAMPHO GHOST — закрытые призраки (tip/tup). Только PINPEAT/BOXING,
// с вероятностью: это украшение, а не сетка.
$: stack(
     s("sine").struct("~ x ~ x ~ x ~ x ~ x ~ x ~ x ~ x")
       .gain(drums.samGhost.vol.mul(drumsOn).mul(m1)),
     s("sine").struct("x x ~ x x x ~ x x ~ x x x ~ x x")
       .gain(drums.samGhost.vol.mul(drumsOn).mul(m2)),
   )
  .note("<bb2>").add(note(drums.samGhost.pitch))
  .penv(-16).panchor(1).pattack(0.001).pdecay(0.015).psustain(0)
  .lpf(drums.samGhost.cut).hpf(240).lpq(1.4)
  .decay(drums.samGhost.decay).sustain(0).release(0.03)
  .pan(rand.mul(1.2).sub(0.6))
  .degradeBy(drums.samGhost.prob.fmap((p) => 1 - p))
  .room(verb.mul(0.1)).roomsize(fx.reverb.size)
  .filter(audible)

// CHHING CLOSED — «часы» ансамбля. Закрытый акцент; FM даёт бронзу.
$: stack(
     s("sine").struct("x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~")
       .gain(drums.chhing.vol.mul(m0)),
     s("sine").struct("x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~")
       .gain(drums.chhing.vol.mul(m1)),
     s("sine").struct("x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~")
       .gain(drums.chhing.vol.mul(m2)),
     s("sine").struct("x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~")
       .gain(drums.chhing.vol.mul(m3)),
   )
  .note("<c6>")
  .fm(1.8).fmh(2.76).fmdecay(drums.chhing.decay).fmsustain(0)
  .lpf(drums.chhing.cut).hpf(3000)
  .decay(drums.chhing.decay).sustain(0)
  .room(verb.mul(drums.chhing.ring)).roomsize(fx.reverb.size)
  .filter(audible)

// CHHING OPEN — открытый «чинг» на 2 и 4 (в BOXING — на «и»).
$: stack(
     s("sine").struct("~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~")
       .gain(drums.chhingOpen.vol.mul(m0)),
     s("sine").struct("~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~")
       .gain(drums.chhingOpen.vol.mul(m1)),
     s("sine").struct("~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~")
       .gain(drums.chhingOpen.vol.mul(m2)),
     s("sine").struct("~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~")
       .gain(drums.chhingOpen.vol.mul(m3)),
   )
  .note("<g6>")
  .fm(1.4).fmh(3.01).fmdecay(drums.chhingOpen.decay).fmsustain(0)
  .lpf(drums.chhingOpen.cut).hpf(2600)
  .decay(drums.chhingOpen.decay).sustain(0).release(0.05)
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .filter(audible)

// KRAP — деревянные клэпперы. Редкий акцент в BOXING и «ломе».
$: stack(
     s("white").struct("x ~ ~ ~ ~ ~ x ~ x ~ ~ ~ ~ ~ x ~")
       .gain(drums.krap.vol.mul(krapOn).mul(m2)),
     s("white").struct("x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~")
       .gain(drums.krap.vol.mul(krapOn).mul(m3)),
   )
  .clip(0.006)
  .hpf(2000).lpf(drums.krap.cut)
  .decay(drums.krap.decay).sustain(0)
  .pan(rand.mul(1.2).sub(0.6))
  .room(verb.mul(0.08)).roomsize(fx.reverb.size)
  .filter(audible)

// FILLS — короткий барабанный «бег» только в BOXING. Скорость
// задаётся rate (8/16/32), поэтому филл не превращается в сетку.
$: note("<c3 eb3 f3 g3>")
  .s("sine")
  .struct("x ~ x x ~ x ~ x")
  .fast(drums.fills.rate.fmap((r) => r / 16))
  .gain(drums.fills.vol.mul(m2).mul(drumsOn))
  .penv(-18).panchor(1).pattack(0.001).pdecay(0.02).psustain(0)
  .lpf(drums.fills.cut).hpf(200).lpq(1.2)
  .decay(0.045).sustain(0).release(0.03)
  .pan(sine.slow(8).range(0.35, 0.65))
  .room(verb.mul(0.12)).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ПЭДЫ — momentary, держишь — играет
// ══════════════════════════════════════════════════════════════════

// GONG — удар большого гонга с тритоновым призвуком.
$: note("<[c2,g2,c3] [c2,gb2,c3]>")
  .s("sine")
  .fm(2.2).fmh(2.76).fmdecay(2.4).fmsustain(0)
  .gain(gong.thom.vol.mul(padGong).mul(1.4))
  .lpf(gong.thom.cut.mul(1.4)).hpf(40)
  .decay(3).sustain(0).release(1.2)
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .filter(audible)

// SAMPHO ROLL — дробь по малой голове, 32-е. Держишь — ролл.
$: note("<c2 eb2 g2>")
  .s("sine")
  .struct("x ~ x x ~ x ~ x")
  .fast(4)
  .gain(drums.samHigh.vol.mul(padSampho).mul(1.3))
  .penv(-16).panchor(1).pattack(0.001).pdecay(0.02).psustain(0)
  .lpf(drums.samHigh.cut).hpf(180)
  .decay(0.05).sustain(0)
  .pan(rand.mul(1.2).sub(0.6))
  .room(verb.mul(0.12)).roomsize(fx.reverb.size)
  .filter(audible)

// SKOR — двойной удар большого барабана.
$: note("<c1>")
  .s("triangle")
  .struct("x ~ x ~ ~ ~ ~ ~")
  .gain(drums.skorLow.vol.mul(padSkor).mul(1.4))
  .penv(-12).panchor(1).pattack(0.001).pdecay(0.08).psustain(0)
  .lpf(drums.skorLow.cut).hpf(30)
  .decay(drums.skorLow.decay).sustain(0).release(0.1)
  .room(verb.mul(0.2)).roomsize(fx.reverb.size)
  .filter(audible)

// CHHING ROLL — быстрый «чинг-чинг». Держишь — тарелки сыпят.
$: note("<c6 g6>")
  .s("sine")
  .fast(16)
  .gain(drums.chhing.vol.mul(padChhing).mul(1.2))
  .fm(1.8).fmh(2.76).fmdecay(0.03).fmsustain(0)
  .lpf(drums.chhing.cut).hpf(3200)
  .decay(0.03).sustain(0)
  .room(verb.mul(0.2)).roomsize(fx.reverb.size)
  .filter(audible)

// SRALAI — короткий «крик» сралая. Пэд, не режим.
$: note("<c5 gb5 ab5 bb5>")
  .s("sawtooth").unison(2).detune(0.07)
  .struct("x ~ x ~ x ~ ~ x")
  .gain(reed.lead.vol.mul(padReed).mul(1.2))
  .lpf(reed.lead.cut.mul(1.2)).lpq(reed.lead.q)
  .shape(reed.lead.grit)
  .attack(0.02).decay(0.12).sustain(0.4).release(0.2)
  .delay(reed.lead.echo.mul(fx.delay.send)).delaytime(fx.delay.time)
  .delayfeedback(fx.delay.feedback.mul(0.6))
  .room(verb.mul(0.25)).roomsize(fx.reverb.size)
  .filter(audible)

// SWELL — бурдон раздувается. Держишь — входишь в новую секцию.
$: note("[c2,g2]")
  .s("triangle").partials([1, 0.35, 0.15])
  .gain(drone.low.vol.mul(padSwell).mul(1.6))
  .lpf(drone.low.cut.mul(1.6)).hpf(40)
  .attack(1.4).decay(1.0).sustain(0.8).release(2.8)
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ШПАРГАЛКА НА НОЧЬ
// ══════════════════════════════════════════════════════════════════
//  Имена — пути по дереву: группа.инструмент.параметр.
//
//  пустота:       atmos.air 0.025 + dust 0.015 + drone 0.1, verb 0.22
//  вход:          scene 1 BUILD, mode 1 PINPEAT, drums.skorLow.vol 0.22
//  полный:        scene 2 MAIN, roneat.ek 0.16, reed.lead 0.1
//  низ:           bass.sub.cut ≤80, skorLow.cut 140, gong.thom.cut 400
//  ксилофон:      roneat.ek.decay 0.1–0.25, cut 4000–7000
//  сралай:        reed.lead.cut 1500–3000, q 2–6, grit 0.1–0.3
//  барабаны:      samLow.cut 300–800, samHigh.cut 1200–3000
//  часы:          chhing.decay 0.03–0.08, chhingOpen.decay 0.12–0.3
//  гонги:         gong.vong.decay 1–2.5, room 0.2–0.5
//  режимы:        mode 0 sathukar / 1 pinpeat / 2 boxing / 3 percussion
//  сцены:         scene 0 intro / 1 build / 2 main / 3 break / 4 outro
//  гармония:      harmony 0 fifth / 1 axis (защёлка раз в 8 тактов)
//  пэды:          1 gong · 2 sampho · 3 skor · 4 chhing · 5 reed · 6 swell
//  антипоп:       никаких мажорных трезвучий, 1–2–4–5 и «красивых»
//                 каденций; мелодия — гетерофония, а не тема с аккордами
// ══════════════════════════════════════════════════════════════════
