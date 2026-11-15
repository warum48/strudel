// ══════════════════════════════════════════════════════════════════
//  KHMER 02 · SKORS  ·  Strudel  ·  96 BPM  ·  percussion / xylophones
//
//  Второй кхмерский трек — по замечаниям к 01:
//  • больше ударных и ксилофонов, меньше духовых; сралая здесь нет;
//  • реальные сэмплы: VSCO 2 CE (CC0) для ксилофонов/маримбы/гонгов/
//    клаве и Dirt-Samples для тайко/хэнд-драмов/таблы/металла;
//  • сцены меняют ТОЛЬКО ритм — все инструменты играют всегда;
//  • под сценами — ряд mute-кнопок: они глушат группы, но не прячут
//    инструменты из секвенсора;
//  • ни один инструмент не запускается только пэдом: пэдов нет.
//
//  ── ИНСТРУМЕНТЫ ────────────────────────────────────────────────
//  • RONEAT EK — xylo-сэмплы VSCO, высокий регистр, 7-тоновая линия.
//  • RONEAT THUNG — marimba-сэмплы VSCO, скелет октавой ниже.
//  • KONG VONG — gong-сэмплы VSCO, остинато.
//  • KONG THOM — большой гонг, fifth/axis (защёлка на 8 тактов).
//  • SKOR THOM — пара тайко-сэмплов: low (loose) и high (tight).
//  • SAMPHO — хэнд-драм и табла: low / high / ghost.
//  • CHHING — металлические сэмплы: closed / open / roll.
//  • KRAP — клаве VSCO, деревянный акцент.
//
//  ── СТРОЙ ──────────────────────────────────────────────────────
//  Семитоновая кхмерская шкала в 12-TET-приближении:
//    c db eb f gb ab bb   (тёмное округление)
//    c eb f g bb          (пятитоновый скелет)
//  Roneat ek — 7 тонов, thung и kong vong — скелет. Тритон C–Gb —
//  ось, а не ошибка; @dark разрешает его в якорных фразах.
//  @roots c c c c c c c c
//  @dark
//
//  ── СЦЕНЫ (только ритм) ────────────────────────────────────────
//  0 sathukar — церемониально, редко
//  1 walk     — обычный интерлок
//  2 pinpeat  — плотнее, призраки, орнаменты
//  3 boxing   — часто и зло, 16-е
//  4 break    — разряжено, но все инструменты на месте
//
//  ── MUTE-КНОПКИ ────────────────────────────────────────────────
//  Под сценами: skor, sampho, chhing, krap, gong, xylo, thung.
//  Это обычные 0/1-кнопки, не momentary. Они только глушат слой;
//  рисунок и инструмент остаются в коде.
//
//  ── ЧЕСТНОСТЬ ──────────────────────────────────────────────────
//  VSCO 2 CE — это западные оркестровые ксилофон/маримба/гонг, а не
//  кхмерские инструменты. Dirt-сэмплы — тайко, хэнд-драмы, табла,
//  металл. Это ближе к «реальному» звуку, чем синтез, но не полевая
//  запись пинпета. Для настоящего звука нужны локальные записи.
// ══════════════════════════════════════════════════════════════════

const BPM = 96
setcpm(BPM / 4) // один цикл = один такт 4/4

// ══════════════════════════════════════════════════════════════════
//  СЭМПЛЫ
// ══════════════════════════════════════════════════════════════════
// VSCO 2 Community Edition — CC0; отдельные ноты ксилофона/маримбы,
// гонги и клаве. Dirt-Samples — реальные удары тайко/хэнд-драмов/
// таблы/металла. В node `samples()` нет, поэтому вызов под typeof.
if (typeof samples === 'function') {
  samples('github:tidalcycles/Dirt-Samples')
  samples({
    xylo: {
      g3: 'Percussion/Xylo/Xylo_Medium_G3_ff_01_far.wav',
      c4: 'Percussion/Xylo/Xylo_Medium_C4_ff_01_far.wav',
      g4: 'Percussion/Xylo/Xylo_Medium_G4_ff_01_far.wav',
      c5: 'Percussion/Xylo/Xylo_Medium_C5_ff_01_far.wav',
      g5: 'Percussion/Xylo/Xylo_Medium_G5_ff_01_far.wav',
      c6: 'Percussion/Xylo/Xylo_Medium_C6_ff_01_far.wav',
      g6: 'Percussion/Xylo/Xylo_Medium_G6_ff_01_far.wav',
      c7: 'Percussion/Xylo/Xylo_Medium_C7_ff_01_far.wav',
    },
    marimba: {
      f1: 'Percussion/Marimba/Marimba_hit_Outrigger_F1_loud_01.wav',
      c2: 'Percussion/Marimba/Marimba_hit_Outrigger_C2_loud_01.wav',
      g2: 'Percussion/Marimba/Marimba_hit_Outrigger_G2_loud_01.wav',
      b2: 'Percussion/Marimba/Marimba_hit_Outrigger_B2_loud_01.wav',
      f3: 'Percussion/Marimba/Marimba_hit_Outrigger_F3_loud_01.wav',
      c4: 'Percussion/Marimba/Marimba_hit_Outrigger_C4_loud_01.wav',
      g4: 'Percussion/Marimba/Marimba_hit_Outrigger_G4_loud_01.wav',
      b4: 'Percussion/Marimba/Marimba_hit_Outrigger_B4_loud_01.wav',
      f5: 'Percussion/Marimba/Marimba_hit_Outrigger_F5_loud_01.wav',
      c6: 'Percussion/Marimba/Marimba_hit_Outrigger_C6_loud_01.wav',
    },
    gong: {
      c2: 'Percussion/gongHit_mf.wav',
      g2: 'Percussion/gongHit_f.wav',
    },
    claves: {
      c6: 'Percussion/Claves1_Hit_v1_rr1_Sum.wav',
      g6: 'Percussion/Claves1_Hit_v2_rr1_Sum.wav',
    },
  }, 'https://raw.githubusercontent.com/sgossner/VSCO-2-CE/master/')
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
//  ПЕРЕКЛЮЧАТЕЛИ + MUTES
// ══════════════════════════════════════════════════════════════════
// @switches scene=sathukar,walk,pinpeat,boxing,break mode=straight,swing,roll,broken harmony=fifth,axis
const scene = slider(2, 0, 4, 1)
const mode = slider(0, 0, 3, 1)
const harmony = slider(0, 0, 1, 1)

// @mutes muteSkor,muteSampho,muteChhing,muteKrap,muteGong,muteXylo,muteThung
const muteSkor = slider(0, 0, 1, 1)
const muteSampho = slider(0, 0, 1, 1)
const muteChhing = slider(0, 0, 1, 1)
const muteKrap = slider(0, 0, 1, 1)
const muteGong = slider(0, 0, 1, 1)
const muteXylo = slider(0, 0, 1, 1)
const muteThung = slider(0, 0, 1, 1)

// Глобальный реверб: комнаты короткие, это не «большой зал».
const verb = slider(0.18, 0, 0.5, 0.01)

// ══════════════════════════════════════════════════════════════════
//  ИНСТРУМЕНТЫ (только громкости; звук — сэмплы)
// ══════════════════════════════════════════════════════════════════
const instruments = {
  drums: {
    name: 'Drums',
    skorLow: {
      name: 'Skor low',
      vol: slider(0.7, 0, 1, 0.01),
      cut: slider(520, 60, 16000, 10),
      hpf: slider(40, 20, 8000, 10),
      clip: slider(0.7, 0.02, 4, 0.01),
      room: slider(0.16, 0, 0.9, 0.01),
    },
    skorHigh: {
      name: 'Skor high',
      vol: slider(0.55, 0, 1, 0.01),
      cut: slider(1400, 60, 16000, 10),
      hpf: slider(60, 20, 8000, 10),
      clip: slider(0.4, 0.02, 4, 0.01),
      room: slider(0.12, 0, 0.9, 0.01),
    },
    skorFill: {
      name: 'Skor fill',
      vol: slider(0.4, 0, 1, 0.01),
      cut: slider(1600, 60, 16000, 10),
      hpf: slider(80, 20, 8000, 10),
      clip: slider(0.22, 0.02, 4, 0.01),
      room: slider(0.1, 0, 0.9, 0.01),
    },
    samLow: {
      name: 'Sampho low',
      vol: slider(0.55, 0, 1, 0.01),
      cut: slider(800, 60, 16000, 10),
      hpf: slider(60, 20, 8000, 10),
      clip: slider(0.5, 0.02, 4, 0.01),
      room: slider(0.13, 0, 0.9, 0.01),
    },
    samHigh: {
      name: 'Sampho high',
      vol: slider(0.4, 0, 1, 0.01),
      cut: slider(3200, 60, 16000, 10),
      hpf: slider(160, 20, 8000, 10),
      clip: slider(0.28, 0.02, 4, 0.01),
      room: slider(0.1, 0, 0.9, 0.01),
    },
    samGhost: {
      name: 'Sampho ghost',
      vol: slider(0.22, 0, 1, 0.01),
      cut: slider(4200, 60, 16000, 10),
      hpf: slider(300, 20, 8000, 10),
      clip: slider(0.1, 0.02, 4, 0.01),
      room: slider(0.08, 0, 0.9, 0.01),
    },
    chhingClosed: {
      name: 'Chhing closed',
      vol: slider(0.3, 0, 1, 0.01),
      cut: slider(14000, 60, 16000, 10),
      hpf: slider(3800, 20, 8000, 10),
      clip: slider(0.09, 0.02, 4, 0.01),
      room: slider(0.18, 0, 0.9, 0.01),
    },
    chhingOpen: {
      name: 'Chhing open',
      vol: slider(0.24, 0, 1, 0.01),
      cut: slider(13000, 60, 16000, 10),
      hpf: slider(3200, 20, 8000, 10),
      clip: slider(0.28, 0.02, 4, 0.01),
      room: slider(0.26, 0, 0.9, 0.01),
    },
    chhingRoll: {
      name: 'Chhing roll',
      vol: slider(0.18, 0, 1, 0.01),
      cut: slider(15000, 60, 16000, 10),
      hpf: slider(5000, 20, 8000, 10),
      clip: slider(0.055, 0.02, 4, 0.01),
      room: slider(0.12, 0, 0.9, 0.01),
    },
    krap: {
      name: 'Krap',
      vol: slider(0.2, 0, 1, 0.01),
      cut: slider(9000, 60, 16000, 10),
      hpf: slider(1200, 20, 8000, 10),
      clip: slider(0.12, 0.02, 4, 0.01),
      room: slider(0.08, 0, 0.9, 0.01),
    },
  },
  gongs: {
    name: 'Gongs',
    vong: {
      name: 'Kong vong',
      vol: slider(0.3, 0, 1, 0.01),
      cut: slider(3200, 60, 16000, 10),
      hpf: slider(100, 20, 8000, 10),
      clip: slider(1.6, 0.02, 4, 0.01),
      room: slider(0.3, 0, 0.9, 0.01),
    },
    thom: {
      name: 'Kong thom',
      vol: slider(0.26, 0, 1, 0.01),
      cut: slider(1800, 60, 16000, 10),
      hpf: slider(40, 20, 8000, 10),
      clip: slider(2.8, 0.02, 4, 0.01),
      room: slider(0.45, 0, 0.9, 0.01),
    },
  },
  xylo: {
    name: 'Xylophones',
    ek: {
      name: 'Roneat ek',
      vol: slider(0.5, 0, 1, 0.01),
      cut: slider(9000, 60, 16000, 10),
      hpf: slider(400, 20, 8000, 10),
      clip: slider(1.1, 0.02, 4, 0.01),
      room: slider(0.16, 0, 0.9, 0.01),
    },
    oct: {
      name: 'Roneat oct',
      vol: slider(0.2, 0, 1, 0.01),
      cut: slider(11000, 60, 16000, 10),
      hpf: slider(800, 20, 8000, 10),
      clip: slider(0.8, 0.02, 4, 0.01),
      room: slider(0.12, 0, 0.9, 0.01),
    },
    thung: {
      name: 'Roneat thung',
      vol: slider(0.36, 0, 1, 0.01),
      cut: slider(5000, 60, 16000, 10),
      hpf: slider(180, 20, 8000, 10),
      clip: slider(1.4, 0.02, 4, 0.01),
      room: slider(0.18, 0, 0.9, 0.01),
    },
  },
}

const { drums, gongs, xylo } = instruments

const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}

// 1 = слой звучит, 0 = слой заглушен. Mute не убирает инструмент из
// секвенсора: паттерн продолжает идти, меняется только gain.
const unmuted = (m) => m.fmap((v) => (v ? 0 : 1))

// ══════════════════════════════════════════════════════════════════
//  ФРАЗЫ (8 тактов) — для tension и для реальных сэмплов
// ══════════════════════════════════════════════════════════════════
const phrase = (bars) => m('<' + bars.join(' ') + '>')

// @roots c c c c c c c c
// @scenes {"intro":{"scene":0,"mode":0,"harmony":0},"theme":{"scene":2,"mode":2,"harmony":0}}

// PAD A — открытая квинта C–G: опора для гонгов и для tension.
const PAD_A = phrase([
  '[c2,g2]', '[c2,g2]', '[c2,g2]', '[c2,g2]',
  '[c2,g2]', '[c2,g2]', '[c2,g2]', '[c2,g2]',
])

// PAD B — C–Gb: та же опора, тритоновая ось. Защёлка harmony.
const PAD_B = phrase([
  '[c2,gb2]', '[c2,gb2]', '[c2,gb2]', '[c2,gb2]',
  '[c2,gb2]', '[c2,gb2]', '[c2,gb2]', '[c2,gb2]',
])

// Ксилофон: пять ритмических характеров, одна и та же шкала.
const X1 = phrase([
  '[c5 ~ ~ ~ eb5 ~ ~ ~]',
  '[c5 ~ ~ ~ gb5 ~ ~ ~]',
  '[f5 ~ ~ ~ eb5 ~ ~ ~]',
  '[db5 ~ ~ ~ c5 ~ ~ ~]',
  '[gb5 ~ ~ ~ f5 ~ ~ ~]',
  '[eb5 ~ ~ ~ db5 ~ ~ ~]',
  '[bb4 ~ ~ ~ c5 ~ ~ ~]',
  '[f5 ~ ~ ~ c5 ~ ~ ~]',
])

const X2 = phrase([
  '[c5 ~ eb5 ~ f5 ~ eb5 ~]',
  '[c5 ~ ~ gb5 f5 ~ eb5 ~]',
  '[db5 ~ ~ f5 eb5 ~ db5 ~]',
  '[db5 ~ eb5 ~ ~ f5 gb5 ~]',
  '[gb5 ~ ~ f5 eb5 ~ db5 ~]',
  '[gb5 ~ ab5 ~ ~ bb5 ab5 ~]',
  '[bb5 ~ ~ ab5 gb5 ~ f5 ~]',
  '[f5 eb5 ~ db5 ~ c5 ~ ~]',
])

const X3 = phrase([
  '[c5 [c5 db5] eb5 ~ f5 [eb5 f5] eb5 ~]',
  '[c5 ~ [gb5 f5] eb5 db5 ~ c5 ~]',
  '[db5 ~ [f5 eb5] ~ db5 [c5 db5] ~ ~]',
  '[db5 [eb5 f5] ~ gb5 f5 ~ eb5 ~]',
  '[gb5 ~ [f5 eb5] db5 ~ c5 ~ ~]',
  '[gb5 [ab5 bb5] ~ ab5 gb5 ~ f5 ~]',
  '[bb5 ~ [ab5 gb5] f5 ~ eb5 ~ c5]',
  '[f5 eb5 db5 ~ c5 ~ ~ ~]',
])

const X4 = phrase([
  '[c5 c5 gb5 c5 f5 c5 eb5 c5]',
  '[c5 c5 gb5 c5 f5 c5 db5 c5]',
  '[c5 c5 gb5 c5 f5 c5 eb5 c5]',
  '[c5 c5 gb5 c5 f5 c5 db5 c5]',
  '[gb5 gb5 f5 gb5 eb5 gb5 db5 gb5]',
  '[gb5 gb5 f5 gb5 eb5 gb5 db5 gb5]',
  '[bb5 bb5 ab5 bb5 gb5 bb5 f5 bb5]',
  '[f5 eb5 db5 c5 c5 c5 ~ ~]',
])

const X5 = phrase([
  '[c5 ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ gb5 ~ ~ ~]',
  '[~ ~ eb5 ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ f5 ~ ~ ~]',
  '[~ ~ ~ ~ c5 ~ ~ ~]',
  '[~ ~ ab5 ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ gb5 ~ ~ ~]',
  '[~ ~ f5 ~ ~ ~ eb5 ~]',
])

// Нижний ксилофон: пятитоновый скелет, без Db/Gb.
const T1 = phrase([
  '[c4 ~ ~ ~ ~ ~ eb4 ~]',
  '[c4 ~ ~ ~ ~ ~ ~ ~]',
  '[bb3 ~ ~ ~ ~ ~ c4 ~]',
  '[bb3 ~ ~ ~ ~ ~ ~ ~]',
  '[f4 ~ ~ ~ ~ ~ eb4 ~]',
  '[f4 ~ ~ ~ ~ ~ ~ ~]',
  '[bb4 ~ ~ ~ ~ ~ g4 ~]',
  '[eb4 ~ ~ c4 ~ ~ ~ ~]',
])

const T2 = phrase([
  '[c4 ~ eb4 ~ f4 ~ eb4 ~]',
  '[c4 ~ ~ g4 f4 ~ eb4 ~]',
  '[bb3 ~ ~ f4 eb4 ~ c4 ~]',
  '[bb3 ~ c4 ~ ~ eb4 f4 ~]',
  '[f4 ~ ~ eb4 c4 ~ bb3 ~]',
  '[f4 ~ g4 ~ ~ bb4 g4 ~]',
  '[bb4 ~ ~ g4 f4 ~ eb4 ~]',
  '[eb4 c4 ~ bb3 ~ c4 ~ ~]',
])

const T3 = phrase([
  '[c4 [c4 eb4] f4 ~ eb4 [c4 eb4] ~ ~]',
  '[c4 ~ [g4 f4] eb4 c4 ~ bb3 ~]',
  '[bb3 ~ [f4 eb4] ~ c4 [bb3 c4] ~ ~]',
  '[bb3 [c4 eb4] ~ f4 eb4 ~ c4 ~]',
  '[f4 ~ [eb4 c4] bb3 ~ c4 ~ ~]',
  '[f4 [g4 bb4] ~ g4 f4 ~ eb4 ~]',
  '[bb4 ~ [g4 f4] eb4 ~ c4 ~ bb3]',
  '[f4 eb4 c4 ~ bb3 ~ ~ ~]',
])

const T4 = phrase([
  '[c4 c4 f4 c4 eb4 c4 c4 c4]',
  '[c4 c4 f4 c4 eb4 c4 bb3 c4]',
  '[c4 c4 f4 c4 eb4 c4 c4 c4]',
  '[c4 c4 f4 c4 eb4 c4 bb3 c4]',
  '[f4 f4 eb4 f4 c4 f4 bb3 f4]',
  '[f4 f4 eb4 f4 c4 f4 bb3 f4]',
  '[bb4 bb4 g4 bb4 f4 bb4 eb4 bb4]',
  '[f4 eb4 c4 bb3 c4 c4 ~ ~]',
])

const T5 = phrase([
  '[c4 ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ g4 ~ ~ ~]',
  '[~ ~ eb4 ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ f4 ~ ~ ~]',
  '[~ ~ ~ ~ c4 ~ ~ ~]',
  '[~ ~ bb4 ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ g4 ~ ~ ~]',
  '[~ ~ f4 ~ ~ ~ eb4 ~]',
])

// Kong vong — остинато, четыре опоры на такт.
const VONG = phrase([
  '[c3 ~ g3 ~]',
  '[c3 ~ eb3 ~]',
  '[f3 ~ c3 ~]',
  '[f3 ~ eb3 ~]',
  '[bb3 ~ f3 ~]',
  '[bb3 ~ g3 ~]',
  '[eb3 ~ c3 ~]',
  '[g3 ~ c3 ~]',
])

// ══════════════════════════════════════════════════════════════════
//  РИТМЫ СЦЕН — только рисунок, без выключения инструментов
// ══════════════════════════════════════════════════════════════════
const R = {
  skorLow: [
    'x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~',
    'x ~ ~ ~ ~ ~ x ~ x ~ ~ ~ ~ ~ x ~',
    'x ~ ~ x ~ ~ x ~ x ~ ~ x ~ ~ x x',
    'x x ~ x x ~ x x x ~ x x ~ x x x',
    'x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~',
  ],
  skorHigh: [
    '~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~',
    '~ ~ x ~ ~ x ~ ~ ~ ~ x ~ ~ x ~ ~',
    '~ x ~ x ~ x ~ x ~ x ~ x ~ x ~ x',
    '~ x x x ~ x x x ~ x x x ~ x x x',
    '~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  ],
  skorFill: [
    '~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x',
    '~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ x',
    'x x x x ~ x x x x ~ x x x ~ x x',
    'x ~ x ~ x x ~ x ~ x x ~ x x x x',
    '~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~',
  ],
  samLow: [
    'x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~',
    'x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ x',
    'x ~ x ~ ~ x x ~ x ~ x ~ ~ x x ~',
    'x ~ x x x ~ x ~ x x ~ x x ~ x x',
    'x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~',
  ],
  samHigh: [
    '~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~',
    '~ ~ x ~ x ~ ~ ~ x ~ ~ ~ x ~ x ~',
    '~ x x ~ x x ~ x x ~ x x ~ x x x',
    '~ x x ~ x x x ~ x x ~ x x x ~ x',
    '~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  ],
  samGhost: [
    '~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~',
    '~ x ~ x ~ x ~ x ~ x ~ x ~ x ~ x',
    'x x ~ x x x ~ x x ~ x x x ~ x x',
    'x x x x x x x x x x x x x x x x',
    '~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~',
  ],
  chhingClosed: [
    'x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~',
    'x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~',
    'x ~ x x x ~ x x x ~ x x x ~ x x',
    'x x x x x x x x x x x x x x x x',
    'x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~',
  ],
  chhingOpen: [
    '~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~',
    '~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~',
    '~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~',
    '~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~',
    '~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~',
  ],
  chhingRoll: [
    '~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x',
    '~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x',
    'x ~ x x x ~ x x x ~ x x x ~ x x',
    'x x x x x x x x x x x x x x x x',
    '~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~',
  ],
  krap: [
    'x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~',
    'x ~ ~ ~ ~ ~ x ~ x ~ ~ ~ ~ ~ x ~',
    'x ~ ~ x ~ ~ x ~ x ~ ~ x ~ ~ x x',
    'x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~',
    'x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~',
  ],
  gong: [
    'x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~',
    'x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~',
    'x ~ x ~ ~ x ~ x ~ ~ x ~ ~ x ~ x',
    'x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~',
    'x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  ],
  gongThomp: [
    'x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
    'x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
    'x ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~',
    'x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~',
    'x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  ],
}

const sc = (arr) => scene.pick(arr.map((s) => m(s)))

// Режим — это «касание», а не включение инструментов: он меняет
// филл, призраков и свинг. Все слои остаются в секвенсоре.
const fillPat = mode.pick([
  m('x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x'),
  m('x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ x'),
  m('x x x x ~ x x x x ~ x x x ~ x x'),
  m('x ~ x ~ x x ~ x ~ x x ~ x x x x'),
])
const ghostProb = mode.pick([0.45, 0.3, 0.15, 0.6])
const swing = mode.pick([0, 0.06, 0.03, 0.1])

// Защёлка гармонии: fifth / axis, один сэмпл на 8 тактов.
const hQ = harmony.seg(1 / 8)
const hA = hQ.fmap((h) => (h < 0.5 ? 1 : 0))
const hB = hQ.fmap((h) => (h < 0.5 ? 0 : 1))

// ══════════════════════════════════════════════════════════════════
//  УДАРНЫЕ
// ══════════════════════════════════════════════════════════════════

// SKOR THOM LOW — тайко-сэмплы, «loose». Палочки: короткий clip.
$: s("east").n("6 7 8")
  .struct(sc(R.skorLow))
  .speed(0.8)
  .gain(drums.skorLow.vol.mul(unmuted(muteSkor)))
  .lpf(drums.skorLow.cut).hpf(drums.skorLow.hpf).lpq(1)
  .clip(drums.skorLow.clip)
  .room(verb.mul(drums.skorLow.room)).roomsize(4)
  .filter(audible)

// SKOR THOM HIGH — тайко-сэмплы, «tight». Отвечает low.
$: s("east").n("3 4 5")
  .struct(sc(R.skorHigh))
  .speed(1.05)
  .gain(drums.skorHigh.vol.mul(unmuted(muteSkor)))
  .lpf(drums.skorHigh.cut).hpf(drums.skorHigh.hpf).lpq(1)
  .clip(drums.skorHigh.clip)
  .pan(sine.slow(10).range(0.42, 0.58))
  .room(verb.mul(drums.skorHigh.room)).roomsize(4)
  .filter(audible)

// SKOR FILL — короткий филл. Режим меняет рисунок, но слой не исчезает.
$: s("east").n("0 1 2")
  .struct(fillPat)
  .speed(mode.pick([0.95, 1, 1.05, 0.9]))
  .gain(drums.skorFill.vol.mul(unmuted(muteSkor)))
  .lpf(drums.skorFill.cut).hpf(drums.skorFill.hpf)
  .clip(drums.skorFill.clip)
  .pan(sine.slow(8).range(0.35, 0.65))
  .room(verb.mul(drums.skorFill.room)).roomsize(4)
  .filter(audible)

// SAMPHO LOW — хэнд-драм, большая голова.
$: s("hand").n("0 1 2 3")
  .struct(sc(R.samLow))
  .speed(0.9)
  .gain(drums.samLow.vol.mul(unmuted(muteSampho)))
  .lpf(drums.samLow.cut).hpf(drums.samLow.hpf).lpq(1.2)
  .clip(drums.samLow.clip)
  .pan(sine.slow(12).range(0.4, 0.6))
  .room(verb.mul(drums.samLow.room)).roomsize(4)
  .filter(audible)

// SAMPHO HIGH — табла, малая голова.
$: s("tabla").n("9 10 11 12 13 14")
  .struct(sc(R.samHigh))
  .speed(1.0)
  .swingBy(swing, 8)
  .gain(drums.samHigh.vol.mul(unmuted(muteSampho)))
  .lpf(drums.samHigh.cut).hpf(drums.samHigh.hpf).lpq(1.2)
  .clip(drums.samHigh.clip)
  .pan(sine.slow(11).range(0.45, 0.6))
  .room(verb.mul(drums.samHigh.room)).roomsize(4)
  .filter(audible)

// SAMPHO GHOST — закрытые призраки, табла. Вероятность зависит от mode.
$: s("tabla").n("19 20 21 22 23 24 25")
  .struct(sc(R.samGhost))
  .speed(1.15)
  .gain(drums.samGhost.vol.mul(unmuted(muteSampho)))
  .lpf(drums.samGhost.cut).hpf(drums.samGhost.hpf).lpq(1.4)
  .clip(drums.samGhost.clip)
  .degradeBy(ghostProb.fmap((p) => 1 - p))
  .pan(rand.mul(1.2).sub(0.6))
  .room(verb.mul(drums.samGhost.room)).roomsize(4)
  .filter(audible)

// CHHING CLOSED — металлические сэмплы, короткий «чинг».
$: s("metal").n("0 1 2 3")
  .struct(sc(R.chhingClosed))
  .gain(drums.chhingClosed.vol.mul(unmuted(muteChhing)))
  .hpf(drums.chhingClosed.hpf).lpf(drums.chhingClosed.cut)
  .clip(drums.chhingClosed.clip)
  .room(verb.mul(drums.chhingClosed.room)).roomsize(4)
  .filter(audible)

// CHHING OPEN — открытый «чинг» на 2/4 (в boxing — на «и»).
$: s("metal").n("4 5 6 7")
  .struct(sc(R.chhingOpen))
  .gain(drums.chhingOpen.vol.mul(unmuted(muteChhing)))
  .hpf(drums.chhingOpen.hpf).lpf(drums.chhingOpen.cut)
  .clip(drums.chhingOpen.clip)
  .room(verb.mul(drums.chhingOpen.room)).roomsize(4)
  .filter(audible)

// CHHING ROLL — секвенсорный ролл, не пэд. В сценах 0/4 — один удар.
$: s("metal").n("8 9")
  .struct(sc(R.chhingRoll))
  .gain(drums.chhingRoll.vol.mul(unmuted(muteChhing)))
  .hpf(drums.chhingRoll.hpf).lpf(drums.chhingRoll.cut)
  .clip(drums.chhingRoll.clip)
  .pan(rand.mul(1.2).sub(0.6))
  .room(verb.mul(drums.chhingRoll.room)).roomsize(4)
  .filter(audible)

// KRAP — клаве VSCO, деревянный акцент.
$: s("claves").note("<c6 g6>")
  .struct(sc(R.krap))
  .gain(drums.krap.vol.mul(unmuted(muteKrap)))
  .hpf(drums.krap.hpf).lpf(drums.krap.cut)
  .clip(drums.krap.clip)
  .pan(rand.mul(1).sub(0.5))
  .room(verb.mul(drums.krap.room)).roomsize(4)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ГОНГИ
// ══════════════════════════════════════════════════════════════════

// KONG VONG — остинато на реальных гонгах VSCO.
$: note(VONG)
  .s("gong")
  .struct(sc(R.gong))
  .gain(gongs.vong.vol.mul(unmuted(muteGong)))
  .lpf(gongs.vong.cut).hpf(gongs.vong.hpf)
  .clip(gongs.vong.clip)
  .pan(sine.slow(16).range(0.4, 0.6))
  .room(verb.mul(gongs.vong.room)).roomsize(6)
  .filter(audible)

// KONG THOM, FIFTH — большой гонг C–G. Защёлка harmony.
$: note(PAD_A)
  .s("gong")
  .struct(sc(R.gongThomp))
  .gain(gongs.thom.vol.mul(hA).mul(unmuted(muteGong)))
  .lpf(gongs.thom.cut).hpf(gongs.thom.hpf)
  .clip(gongs.thom.clip)
  .room(verb.mul(gongs.thom.room)).roomsize(8)
  .filter(audible)

// KONG THOM, AXIS — тот же гонг с C–Gb. Вторая половина защёлки.
$: note(PAD_B)
  .s("gong")
  .struct(sc(R.gongThomp))
  .gain(gongs.thom.vol.mul(hB).mul(unmuted(muteGong)))
  .lpf(gongs.thom.cut).hpf(gongs.thom.hpf)
  .clip(gongs.thom.clip)
  .room(verb.mul(gongs.thom.room)).roomsize(8)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  КСИЛОФОНЫ
// ══════════════════════════════════════════════════════════════════

const X = scene.pick([X1, X2, X3, X4, X5])
const T = scene.pick([T1, T2, T3, T4, T5])

// RONEAT EK — реальные xylo-сэмплы VSCO, 7-тоновая линия.
$: note(X)
  .s("xylo")
  .gain(xylo.ek.vol.mul(unmuted(muteXylo)))
  .lpf(xylo.ek.cut).hpf(xylo.ek.hpf).lpq(1)
  .clip(xylo.ek.clip)
  .pan(sine.slow(12).range(0.42, 0.62))
  .room(verb.mul(xylo.ek.room)).roomsize(4)
  .filter(audible)

// RONEAT OCT — та же линия октавой выше, тише. Это не второй
// инструмент, а удвоение; mute xylo глушит оба.
$: note(X).add(note(12))
  .s("xylo")
  .gain(xylo.oct.vol.mul(unmuted(muteXylo)))
  .lpf(xylo.oct.cut).hpf(xylo.oct.hpf)
  .clip(xylo.oct.clip)
  .pan(sine.slow(14).range(0.35, 0.55))
  .room(verb.mul(xylo.oct.room)).roomsize(4)
  .filter(audible)

// RONEAT THUNG — marimba-сэмплы VSCO, скелет октавой ниже.
$: note(T)
  .s("marimba")
  .gain(xylo.thung.vol.mul(unmuted(muteThung)))
  .lpf(xylo.thung.cut).hpf(xylo.thung.hpf).lpq(1)
  .clip(xylo.thung.clip)
  .pan(sine.slow(15).range(0.35, 0.55))
  .room(verb.mul(xylo.thung.room)).roomsize(4)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ШПАРГАЛКА
// ══════════════════════════════════════════════════════════════════
//  сцены:     scene 0 sathukar / 1 walk / 2 pinpeat / 3 boxing / 4 break
//  режим:     mode 0 straight / 1 swing / 2 roll / 3 broken
//  гармония:  harmony 0 fifth / 1 axis (защёлка на 8 тактов)
//  mutes:     skor · sampho · chhing · krap · gong · xylo · thung
//  ударные:   skorLow 0.7, samLow 0.55, chhingClosed 0.3, krap 0.2
//  ксилофон:  ek 0.5, oct 0.2, thung 0.36; lpf 9k / 5k
//  гонги:     vong 0.3, thom 0.26; room 0.3–0.5
//  сэмплы:    Dirt-Samples + VSCO 2 CE (CC0), без синтеза
// ══════════════════════════════════════════════════════════════════
