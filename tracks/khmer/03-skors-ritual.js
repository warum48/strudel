// ══════════════════════════════════════════════════════════════════
//  KHMER 03 · SKORS RITUAL  ·  Strudel  ·  76 BPM
//
//  Третий трек — только ударные. Без ксилофонов, без сралая, без
//  «детского» блеска. Медленно, низко, с воздухом: церемония, а не
//  саундтрек к мультику.
//
//  Состав — из 01, с вашими громкостями:
//  • Skor thom high 0.33
//  • Sampho low 0.34
//  • Sampho high 0.28
//  • Sampho ghost 0.23
//  • Chhing 0.23
//  • Chhing open 0.21
//  • Krap 0.19
//  • Drum fills 0.18
//  Плюс один низкий конг-том для веса и оси C–G / C–Gb.
//
//  ── ПРАВИЛА ────────────────────────────────────────────────────
//  • Сцены меняют ТОЛЬКО ритм: все инструменты есть в каждой сцене.
//  • Под сценами — mute-кнопки (обычные 0/1, не momentary).
//  • Пэдов нет: всё играет из обычных `$:`-секвенсоров.
//  • `mode` — касание (straight/drag/roll/broken): филл, призраки,
//    свинг. `harmony` — fifth/axis, защёлка на 8 тактов (гонг).
//
//  ── ХАРАКТЕР ───────────────────────────────────────────────────
//  Ниже строй (skor/sam −2), длиннее хвосты, тёмные часы, редкий
//  krap. Мелодии нет — есть цикл, дыхание и удар. 76 BPM.
//
//  @roots c c c c c c c c
//  @dark
// ══════════════════════════════════════════════════════════════════

const BPM = 76
setcpm(BPM / 4) // один цикл = один такт 4/4

// ══════════════════════════════════════════════════════════════════
//  СЭМПЛЫ ДЛЯ НИЗКОГО КСИЛОФОНА
// ══════════════════════════════════════════════════════════════════
// VSCO 2 CE (CC0), реальная маримба: низкий регистр для roneat low.
// 1–2 октавы ниже — это `xylo.low.octave` 1 или 2.
if (typeof samples === 'function') {
  samples({
    marimba: {
      f1: 'Percussion/Marimba/Marimba_hit_Outrigger_F1_loud_01.wav',
      c2: 'Percussion/Marimba/Marimba_hit_Outrigger_C2_loud_01.wav',
      g2: 'Percussion/Marimba/Marimba_hit_Outrigger_G2_loud_01.wav',
      b2: 'Percussion/Marimba/Marimba_hit_Outrigger_B2_loud_01.wav',
      f3: 'Percussion/Marimba/Marimba_hit_Outrigger_F3_loud_01.wav',
      c4: 'Percussion/Marimba/Marimba_hit_Outrigger_C4_loud_01.wav',
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
// @switches scene=procession,invocation,trance,lament mode=straight,drag,roll,broken harmony=fifth,axis
const scene = slider(1, 0, 3, 1)
const mode = slider(0, 0, 3, 1)
const harmony = slider(0, 0, 1, 1)

// @mutes muteSkor,muteSampho,muteChhing,muteKrap,muteGong,muteLow
const muteSkor = slider(0, 0, 1, 1)
const muteSampho = slider(0, 0, 1, 1)
const muteChhing = slider(0, 0, 1, 1)
const muteKrap = slider(0, 0, 1, 1)
const muteGong = slider(0, 0, 1, 1)
const muteLow = slider(0, 0, 1, 1)

const verb = slider(0.24, 0, 0.6, 0.01)

// ══════════════════════════════════════════════════════════════════
//  ИНСТРУМЕНТЫ
// ══════════════════════════════════════════════════════════════════
const instruments = {
  drums: {
    name: 'Drums',
    skor: {
      name: 'Skor thom high',
      vol: slider(0.33, 0, 1, 0.01),
      cut: slider(220, 60, 2000, 10),
      pitch: slider(-2, -12, 6, 1),
      decay: slider(0.55, 0.1, 2, 0.01),
      room: slider(0.24, 0, 0.9, 0.01),
    },
    samLow: {
      name: 'Sampho low',
      vol: slider(0.34, 0, 1, 0.01),
      cut: slider(420, 60, 3000, 10),
      pitch: slider(-2, -12, 6, 1),
      decay: slider(0.32, 0.05, 1.2, 0.01),
      room: slider(0.22, 0, 0.9, 0.01),
    },
    samHigh: {
      name: 'Sampho high',
      vol: slider(0.28, 0, 1, 0.01),
      cut: slider(1100, 100, 6000, 10),
      pitch: slider(-1, -12, 6, 1),
      decay: slider(0.18, 0.03, 0.8, 0.01),
      room: slider(0.18, 0, 0.9, 0.01),
    },
    samGhost: {
      name: 'Sampho ghost',
      vol: slider(0.23, 0, 1, 0.01),
      cut: slider(1500, 200, 8000, 10),
      pitch: slider(-1, -12, 6, 1),
      decay: slider(0.08, 0.02, 0.4, 0.005),
      prob: slider(0.6, 0.2, 1, 0.01),
      room: slider(0.12, 0, 0.9, 0.01),
    },
    chhing: {
      name: 'Chhing',
      vol: slider(0.23, 0, 1, 0.01),
      cut: slider(7000, 2000, 16000, 50),
      decay: slider(0.055, 0.01, 0.3, 0.005),
      room: slider(0.2, 0, 0.9, 0.01),
    },
    chhingOpen: {
      name: 'Chhing open',
      vol: slider(0.21, 0, 1, 0.01),
      cut: slider(6000, 1500, 16000, 50),
      decay: slider(0.24, 0.05, 0.8, 0.01),
      room: slider(0.32, 0, 0.9, 0.01),
    },
    krap: {
      name: 'Krap',
      vol: slider(0.19, 0, 1, 0.01),
      cut: slider(2600, 600, 12000, 20),
      decay: slider(0.04, 0.01, 0.2, 0.005),
      room: slider(0.1, 0, 0.9, 0.01),
    },
    fills: {
      name: 'Drum fills',
      vol: slider(0.18, 0, 1, 0.01),
      cut: slider(1200, 200, 8000, 10),
      rate: slider(16, 8, 32, 1),
      room: slider(0.15, 0, 0.9, 0.01),
    },
  },
  gongs: {
    name: 'Gongs',
    thom: {
      name: 'Kong thom',
      vol: slider(0.22, 0, 1, 0.01),
      cut: slider(300, 60, 2000, 5),
      decay: slider(3.2, 1, 6, 0.1),
      fm: slider(0.7, 0, 3, 0.05),
      ratio: slider(2.76, 1, 4, 0.01),
      room: slider(0.6, 0, 0.95, 0.01),
    },
  },
  xylo: {
    name: 'Xylophones',
    low: {
      name: 'Roneat low',
      vol: slider(0.24, 0, 1, 0.01),
      cut: slider(3500, 100, 12000, 10),
      octave: slider(1, 0, 2, 1),
      clip: slider(2, 0.2, 6, 0.01),
      room: slider(0.34, 0, 0.9, 0.01),
    },
  },
}

const { drums, gongs, xylo } = instruments

const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}

const unmuted = (m) => m.fmap((v) => (v ? 0 : 1))

// ══════════════════════════════════════════════════════════════════
//  ФРАЗЫ — гонг и опора для tension
// ══════════════════════════════════════════════════════════════════
const phrase = (bars) => m('<' + bars.join(' ') + '>')

// @roots c c c c c c c c
// @scenes {"intro":{"scene":0,"mode":0,"harmony":0},"theme":{"scene":2,"mode":2,"harmony":0}}

// Открытая квинта и тритоновая ось — для сравнения в tension.
const PAD_A = phrase([
  '[c2,g2]', '[c2,g2]', '[c2,g2]', '[c2,g2]',
  '[c2,g2]', '[c2,g2]', '[c2,g2]', '[c2,g2]',
])
const PAD_B = phrase([
  '[c2,gb2]', '[c2,gb2]', '[c2,gb2]', '[c2,gb2]',
  '[c2,gb2]', '[c2,gb2]', '[c2,gb2]', '[c2,gb2]',
])

// Конг-том: только C2/C3, чтобы не ловить малую секунду с PAD_B.
const GONG = phrase([
  '[c2 ~ c3 ~]',
  '[c2 ~ ~ ~]',
  '[c2 ~ c3 ~]',
  '[c2 ~ ~ ~]',
  '[c2 ~ c3 ~]',
  '[c3 ~ c2 ~]',
  '[c2 ~ ~ ~]',
  '[c3 ~ c2 ~]',
])

// LOW — низкий ксилофон: та же семитоновая линия, но на 1–2 октавы
// ниже (xylo.low.octave). Это не «высокая мелодия», а низкая опора.
const LOW = phrase([
  '[c4 ~ eb4 ~ f4 ~ eb4 ~]',
  '[c4 ~ ~ gb4 f4 ~ eb4 ~]',
  '[db4 ~ ~ f4 eb4 ~ db4 ~]',
  '[db4 ~ eb4 ~ ~ f4 gb4 ~]',
  '[gb4 ~ ~ f4 eb4 ~ db4 ~]',
  '[gb4 ~ ab4 ~ ~ bb4 ab4 ~]',
  '[bb4 ~ ~ ab4 gb4 ~ f4 ~]',
  '[f4 eb4 ~ db4 ~ c4 ~ ~]',
])

// ══════════════════════════════════════════════════════════════════
//  РИТМЫ СЦЕН — все инструменты присутствуют
// ══════════════════════════════════════════════════════════════════
const R = {
  skor: [
    'x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~',
    'x ~ ~ ~ ~ ~ x ~ x ~ ~ ~ ~ ~ x ~',
    'x ~ ~ x ~ ~ x ~ x ~ ~ x ~ ~ x x',
    'x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~',
  ],
  samLow: [
    'x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~',
    'x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ x',
    'x ~ x ~ ~ x x ~ x ~ x ~ ~ x x ~',
    'x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~',
  ],
  samHigh: [
    '~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~',
    '~ ~ x ~ x ~ ~ ~ x ~ ~ ~ x ~ x ~',
    '~ x x ~ x x ~ x x ~ x x ~ x x x',
    '~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  ],
  samGhost: [
    '~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~',
    '~ x ~ x ~ x ~ x ~ x ~ x ~ x ~ x',
    'x x ~ x x x ~ x x ~ x x x ~ x x',
    '~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~',
  ],
  chhing: [
    'x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~',
    'x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~',
    'x ~ x x x ~ x x x ~ x x x ~ x x',
    'x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~',
  ],
  chhingOpen: [
    '~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~',
    '~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~',
    '~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~',
    '~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~',
  ],
  krap: [
    'x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~',
    'x ~ ~ ~ ~ ~ x ~ x ~ ~ ~ ~ ~ x ~',
    'x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~',
    'x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~',
  ],
  gong: [
    'x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
    'x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~',
    'x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~',
    'x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~',
  ],
}

const sc = (arr) => scene.pick(arr.map((s) => m(s)))
const fillPat = mode.pick([
  m('x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x'),
  m('x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ x'),
  m('x x x x ~ x x x x ~ x x x ~ x x'),
  m('x ~ x ~ x x ~ x ~ x x ~ x x x x'),
])
const ghostProb = mode.pick([0.55, 0.4, 0.25, 0.7])
const swing = mode.pick([0, 0.05, 0.02, 0.09])

const hQ = harmony.seg(1 / 8)
const hA = hQ.fmap((h) => (h < 0.5 ? 1 : 0))
const hB = hQ.fmap((h) => (h < 0.5 ? 0 : 1))

// ══════════════════════════════════════════════════════════════════
//  УДАРНЫЕ
// ══════════════════════════════════════════════════════════════════

// SKOR THOM HIGH — ниже и длиннее, чем в 01: вес, а не щелчок.
$: s("sine").n("0")
  .struct(sc(R.skor))
  .note("<g1>").add(note(drums.skor.pitch))
  .penv(-10).panchor(1).pattack(0.001).pdecay(0.05).psustain(0)
  .gain(drums.skor.vol.mul(unmuted(muteSkor)))
  .lpf(drums.skor.cut).hpf(30).lpq(1)
  .decay(drums.skor.decay).sustain(0).release(0.12)
  .room(verb.mul(drums.skor.room)).roomsize(6)
  .filter(audible)

// SAMPHO LOW — большая голова, тёмный удар.
$: s("sine")
  .struct(sc(R.samLow))
  .note("<eb2>").add(note(drums.samLow.pitch))
  .penv(-8).panchor(1).pattack(0.001).pdecay(0.04).psustain(0)
  .gain(drums.samLow.vol.mul(unmuted(muteSampho)))
  .lpf(drums.samLow.cut).hpf(50).lpq(1.2)
  .decay(drums.samLow.decay).sustain(0).release(0.1)
  .pan(sine.slow(16).range(0.4, 0.6))
  .room(verb.mul(drums.samLow.room)).roomsize(6)
  .filter(audible)

// SAMPHO HIGH — малая голова, суше и тише.
$: s("sine")
  .struct(sc(R.samHigh))
  .note("<g2>").add(note(drums.samHigh.pitch))
  .penv(-14).panchor(1).pattack(0.001).pdecay(0.02).psustain(0)
  .gain(drums.samHigh.vol.mul(unmuted(muteSampho)))
  .lpf(drums.samHigh.cut).hpf(120).lpq(1.2)
  .decay(drums.samHigh.decay).sustain(0).release(0.06)
  .swingBy(swing, 8)
  .pan(sine.slow(13).range(0.44, 0.6))
  .room(verb.mul(drums.samHigh.room)).roomsize(6)
  .filter(audible)

// SAMPHO GHOST — закрытые призраки; в церемонии их мало.
$: s("sine")
  .struct(sc(R.samGhost))
  .note("<bb2>").add(note(drums.samGhost.pitch))
  .penv(-16).panchor(1).pattack(0.001).pdecay(0.015).psustain(0)
  .gain(drums.samGhost.vol.mul(unmuted(muteSampho)))
  .lpf(drums.samGhost.cut).hpf(240).lpq(1.4)
  .decay(drums.samGhost.decay).sustain(0).release(0.04)
  .degradeBy(drums.samGhost.prob.fmap((p) => 1 - p))
  .pan(rand.mul(1.1).sub(0.55))
  .room(verb.mul(drums.samGhost.room)).roomsize(6)
  .filter(audible)

// CHHING — часы. Темнее, чем в 01: не «динь», а бронза.
$: s("sine")
  .struct(sc(R.chhing))
  .note("<c6>")
  .fm(1.8).fmh(2.76).fmdecay(drums.chhing.decay).fmsustain(0)
  .gain(drums.chhing.vol.mul(unmuted(muteChhing)))
  .lpf(drums.chhing.cut).hpf(2600)
  .decay(drums.chhing.decay).sustain(0)
  .room(verb.mul(drums.chhing.room)).roomsize(6)
  .filter(audible)

// CHHING OPEN — длинный «чинг», больше воздуха.
$: s("sine")
  .struct(sc(R.chhingOpen))
  .note("<g6>")
  .fm(1.4).fmh(3.01).fmdecay(drums.chhingOpen.decay).fmsustain(0)
  .gain(drums.chhingOpen.vol.mul(unmuted(muteChhing)))
  .lpf(drums.chhingOpen.cut).hpf(2400)
  .decay(drums.chhingOpen.decay).sustain(0).release(0.06)
  .room(verb.mul(drums.chhingOpen.room)).roomsize(8)
  .filter(audible)

// KRAP — дерево, редко. Не сетка, а точка.
$: s("white")
  .struct(sc(R.krap))
  .clip(0.006)
  .gain(drums.krap.vol.mul(unmuted(muteKrap)))
  .hpf(1600).lpf(drums.krap.cut)
  .decay(drums.krap.decay).sustain(0)
  .pan(rand.mul(0.9).sub(0.45))
  .room(verb.mul(drums.krap.room)).roomsize(6)
  .filter(audible)

// FILLS — редкий «бег» по mode. Не превращается в сетку.
$: note("<c3 eb3 f3 g3>")
  .s("triangle")
  .struct(fillPat)
  .fast(drums.fills.rate.fmap((r) => r / 16))
  .gain(drums.fills.vol.mul(unmuted(muteSkor)))
  .penv(-18).panchor(1).pattack(0.001).pdecay(0.02).psustain(0)
  .lpf(drums.fills.cut).hpf(160)
  .decay(0.05).sustain(0).release(0.03)
  .pan(sine.slow(9).range(0.35, 0.65))
  .room(verb.mul(drums.fills.room)).roomsize(6)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ГОНГ
// ══════════════════════════════════════════════════════════════════

// KONG THOM, FIFTH — C–G, глубокий и долгий.
$: note(GONG)
  .s("sine")
  .struct(sc(R.gong))
  .fm(gongs.thom.fm).fmh(gongs.thom.ratio)
  .fmdecay(gongs.thom.decay).fmsustain(0)
  .gain(gongs.thom.vol.mul(hA).mul(unmuted(muteGong)))
  .lpf(gongs.thom.cut).hpf(30)
  .decay(gongs.thom.decay).sustain(0).release(1.4)
  .room(verb.mul(gongs.thom.room)).roomsize(10)
  .filter(audible)

// KONG THOM, AXIS — та же фраза +6: C–Gb. Вторая половина защёлки.
$: note(GONG).add(note(6))
  .s("sine")
  .struct(sc(R.gong))
  .fm(gongs.thom.fm).fmh(gongs.thom.ratio)
  .fmdecay(gongs.thom.decay).fmsustain(0)
  .gain(gongs.thom.vol.mul(hB).mul(unmuted(muteGong)))
  .lpf(gongs.thom.cut.mul(0.9)).hpf(30)
  .decay(gongs.thom.decay).sustain(0).release(1.6)
  .room(verb.mul(gongs.thom.room)).roomsize(10)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  НИЗКИЙ КСИЛОФОН
// ══════════════════════════════════════════════════════════════════

// RONEAT LOW — реальная маримба VSCO; octave 0/1/2 = 0/−1/−2.
$: note(LOW).add(note(xylo.low.octave.fmap((o) => -12 * o)))
  .s("marimba")
  .gain(xylo.low.vol.mul(unmuted(muteLow)))
  .lpf(xylo.low.cut).hpf(70)
  .clip(xylo.low.clip)
  .pan(sine.slow(18).range(0.38, 0.58))
  .room(verb.mul(xylo.low.room)).roomsize(8)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ШПАРГАЛКА
// ══════════════════════════════════════════════════════════════════
//  сцены:    0 procession / 1 invocation / 2 trance / 3 lament
//  режим:    0 straight / 1 drag / 2 roll / 3 broken
//  гармония:  0 fifth / 1 axis (защёлка на 8 тактов)
//  mutes:     skor · sampho · chhing · krap · gong · low
//  громкости: skor .33, samLow .34, samHigh .28, ghost .23,
//             chhing .23, open .21, krap .19, fills .18, gong .22
//  ксилофон:  roneat low, marimba VSCO; octave 0/1/2 = 0/−1/−2
//  характер:  ниже строй, длиннее хвосты, меньше нот; без высоких линий
// ══════════════════════════════════════════════════════════════════
