// ══════════════════════════════════════════════════════════════════
//  KHMER 04 · CONFLUENCE  ·  Strudel  ·  108 BPM
//
//  Микс из 01–03:
//  • из 01 — skor high .33, sampho low .34 / high .28 / ghost .23,
//    chhing .23 / open .21, krap .19, fills .18;
//  • из 02 — вся перкуссия и гонги, кроме мелодических ксилофонов;
//  • из 03 — вся перкуссия и гонги, кроме roneat low.
//
//  Новое:
//  • 12 разных ритмов (scene 0…11), а не 5;
//  • «не-подетски»: низкий строй, тёмные часы, длинные хвосты;
//  • реверб можно поднять сильно: `verb` до 1.2, `verbSize` до 16;
//  • секция ACID: acid bass + arp, у обоих есть `pace`;
//  • кхмерская перкуссия — только ритм, без мелодических линий.
//    Инструмент может менять ноты, но это остинато/минимализм, а не
//    тема. Мелодия живёт только в acid-секции — намеренно.
//
//  @roots c c c c c c c c
//  @dark
// ══════════════════════════════════════════════════════════════════

const BPM = 108
setcpm(BPM / 4) // один цикл = один такт 4/4

// ══════════════════════════════════════════════════════════════════
//  СЭМПЛЫ
// ══════════════════════════════════════════════════════════════════
if (typeof samples === 'function') {
  samples('github:tidalcycles/Dirt-Samples')
  samples({
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
// @switches scene=r01,r02,r03,r04,r05,r06,r07,r08,r09,r10,r11,r12 mode=straight,drag,roll,broken harmony=fifth,axis acid=off,on
const scene = slider(3, 0, 11, 1)
const mode = slider(0, 0, 3, 1)
const harmony = slider(0, 0, 1, 1)
const acid = slider(0, 0, 1, 1)

// @mutes muteSkor,muteSampho,muteChhing,muteKrap,muteGong
const muteSkor = slider(0, 0, 1, 1)
const muteSampho = slider(0, 0, 1, 1)
const muteChhing = slider(0, 0, 1, 1)
const muteKrap = slider(0, 0, 1, 1)
const muteGong = slider(0, 0, 1, 1)

// Реверб: send до 1.2 и размер до 16 — можно уйти в большой храм.
const verb = slider(0.34, 0, 1.2, 0.01)
const verbSize = slider(6, 1, 16, 0.1)

// ══════════════════════════════════════════════════════════════════
//  ИНСТРУМЕНТЫ
// ══════════════════════════════════════════════════════════════════
const instruments = {
  drums: {
    name: 'Drums',
    skorLow: {
      name: 'Skor low',
      vol: slider(0.4, 0, 1, 0.01),
      cut: slider(300, 60, 3000, 10),
      clip: slider(0.7, 0.02, 4, 0.01),
      room: slider(0.28, 0, 1.2, 0.01),
    },
    skorHigh: {
      name: 'Skor high',
      vol: slider(0.33, 0, 1, 0.01),
      cut: slider(280, 60, 3000, 10),
      clip: slider(0.5, 0.02, 4, 0.01),
      room: slider(0.3, 0, 1.2, 0.01),
    },
    skorFill: {
      name: 'Skor fill',
      vol: slider(0.18, 0, 1, 0.01),
      cut: slider(1600, 60, 8000, 10),
      clip: slider(0.22, 0.02, 4, 0.01),
      room: slider(0.2, 0, 1.2, 0.01),
    },
    samLow: {
      name: 'Sampho low',
      vol: slider(0.34, 0, 1, 0.01),
      cut: slider(520, 60, 3000, 10),
      clip: slider(0.5, 0.02, 4, 0.01),
      room: slider(0.3, 0, 1.2, 0.01),
    },
    samHigh: {
      name: 'Sampho high',
      vol: slider(0.28, 0, 1, 0.01),
      cut: slider(1400, 100, 6000, 10),
      clip: slider(0.3, 0.02, 4, 0.01),
      room: slider(0.26, 0, 1.2, 0.01),
    },
    samGhost: {
      name: 'Sampho ghost',
      vol: slider(0.23, 0, 1, 0.01),
      cut: slider(1800, 200, 8000, 10),
      clip: slider(0.1, 0.02, 4, 0.01),
      prob: slider(0.6, 0.2, 1, 0.01),
      room: slider(0.2, 0, 1.2, 0.01),
    },
    chhing: {
      name: 'Chhing',
      vol: slider(0.23, 0, 1, 0.01),
      cut: slider(9000, 2000, 16000, 50),
      clip: slider(0.09, 0.02, 2, 0.01),
      room: slider(0.32, 0, 1.2, 0.01),
    },
    chhingOpen: {
      name: 'Chhing open',
      vol: slider(0.21, 0, 1, 0.01),
      cut: slider(7000, 1500, 16000, 50),
      clip: slider(0.28, 0.02, 2, 0.01),
      room: slider(0.45, 0, 1.2, 0.01),
    },
    chhingRoll: {
      name: 'Chhing roll',
      vol: slider(0.11, 0, 1, 0.01),
      cut: slider(12000, 3000, 16000, 50),
      clip: slider(0.06, 0.02, 1, 0.01),
      room: slider(0.24, 0, 1.2, 0.01),
    },
    krap: {
      name: 'Krap',
      vol: slider(0.19, 0, 1, 0.01),
      cut: slider(3000, 800, 12000, 20),
      clip: slider(0.12, 0.02, 2, 0.01),
      room: slider(0.18, 0, 1.2, 0.01),
    },
    fills: {
      name: 'Drum fills',
      vol: slider(0.18, 0, 1, 0.01),
      cut: slider(1600, 200, 8000, 10),
      rate: slider(16, 8, 32, 1),
      room: slider(0.2, 0, 1.2, 0.01),
    },
  },
  gongs: {
    name: 'Gongs',
    vong: {
      name: 'Kong vong',
      vol: slider(0.3, 0, 1, 0.01),
      cut: slider(2600, 200, 12000, 10),
      clip: slider(1.6, 0.02, 5, 0.01),
      room: slider(0.5, 0, 1.2, 0.01),
    },
    thom: {
      name: 'Kong thom',
      vol: slider(0.26, 0, 1, 0.01),
      cut: slider(400, 60, 3000, 5),
      clip: slider(3, 0.02, 6, 0.01),
      room: slider(0.65, 0, 1.2, 0.01),
    },
  },
  acid: {
    name: 'Acid',
    bass: {
      name: 'Acid bass',
      vol: slider(0.2, 0, 1, 0.01),
      cut: slider(480, 80, 4000, 10),
      res: slider(8, 0, 20, 0.1),
      env: slider(6, 0, 12, 0.1),
      decay: slider(0.18, 0.02, 1, 0.01),
      drive: slider(0.35, 0, 1, 0.01),
      pace: slider(16, 4, 32, 1),
      room: slider(0.18, 0, 1.2, 0.01),
    },
    arp: {
      name: 'Acid arp',
      vol: slider(0.13, 0, 1, 0.01),
      cut: slider(1800, 200, 9000, 10),
      res: slider(4, 0, 16, 0.1),
      decay: slider(0.12, 0.02, 0.8, 0.01),
      pace: slider(16, 4, 32, 1),
      echo: slider(0.22, 0, 0.7, 0.01),
      room: slider(0.32, 0, 1.2, 0.01),
    },
  },
}

const { drums, gongs, acid: acidInst } = instruments

const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}
const unmuted = (m) => m.fmap((v) => (v ? 0 : 1))

// ══════════════════════════════════════════════════════════════════
//  ФРАЗЫ / ОПОРА
// ══════════════════════════════════════════════════════════════════
const phrase = (bars) => m('<' + bars.join(' ') + '>')

// @roots c c c c c c c c
// @scenes {"intro":{"scene":0,"mode":0,"harmony":0,"acid":0},"theme":{"scene":4,"mode":2,"harmony":0,"acid":0}}

const PAD_A = phrase([
  '[c2,g2]', '[c2,g2]', '[c2,g2]', '[c2,g2]',
  '[c2,g2]', '[c2,g2]', '[c2,g2]', '[c2,g2]',
])
const PAD_B = phrase([
  '[c2,gb2]', '[c2,gb2]', '[c2,gb2]', '[c2,gb2]',
  '[c2,gb2]', '[c2,gb2]', '[c2,gb2]', '[c2,gb2]',
])

// Гонг — только C2/C3: это ритм, а не мелодия.
const GONG = phrase([
  '[c2 ~ c3 ~]', '[c2 ~ ~ ~]', '[c2 ~ c3 ~]', '[c2 ~ ~ ~]',
  '[c2 ~ c3 ~]', '[c3 ~ c2 ~]', '[c2 ~ ~ ~]', '[c3 ~ c2 ~]',
])

// ══════════════════════════════════════════════════════════════════
//  12 РИТМОВ
// ══════════════════════════════════════════════════════════════════
// SKOR — костяк. 12 разных ячеек, все 16-шаговые.
const SKOR = [
  'x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~',
  'x ~ ~ ~ ~ ~ x ~ x ~ ~ ~ ~ ~ x ~',
  'x ~ ~ x ~ ~ x ~ x ~ ~ x ~ ~ x x',
  'x x ~ x x ~ x x x ~ x x ~ x x x',
  'x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~',
  'x ~ x ~ ~ x ~ x ~ x ~ ~ x ~ x ~',
  'x ~ ~ ~ ~ x ~ ~ x ~ ~ x ~ ~ x ~',
  'x x ~ ~ x ~ x ~ x ~ x ~ ~ x x ~',
  'x ~ ~ x ~ x ~ ~ x ~ ~ x ~ x ~ ~',
  'x ~ ~ ~ ~ ~ ~ x x ~ ~ ~ ~ ~ x ~',
  'x x x ~ x ~ x x x ~ x ~ x x x ~',
  'x ~ x x ~ ~ x ~ x x ~ ~ x ~ x x',
]

// SAM — interlock; high играет ту же ячейку со сдвигом.
const SAM = [
  'x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~',
  'x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ x',
  'x ~ x ~ ~ x x ~ x ~ x ~ ~ x x ~',
  'x ~ x x x ~ x ~ x x ~ x x ~ x x',
  'x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~',
  'x ~ ~ x ~ x ~ ~ x ~ ~ x ~ ~ x ~',
  'x ~ ~ ~ x ~ ~ ~ ~ ~ x ~ x ~ ~ x',
  'x x ~ ~ x ~ ~ x ~ x ~ ~ x ~ x ~',
  'x ~ ~ x ~ ~ x ~ x ~ x ~ ~ x ~ x',
  'x ~ ~ ~ ~ x ~ ~ ~ ~ x ~ ~ ~ x ~',
  'x x ~ x ~ x x ~ x ~ x x ~ x x ~',
  'x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~',
]

// CHHING — часы; open/roll — производные.
const CHHING = [
  'x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~',
  'x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~',
  'x ~ x x x ~ x x x ~ x x x ~ x x',
  'x x x x x x x x x x x x x x x x',
  'x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ x',
  'x ~ x ~ ~ x ~ x ~ x ~ ~ x ~ x ~',
  'x ~ ~ x ~ ~ x ~ x ~ ~ x ~ ~ x ~',
  'x x ~ ~ x ~ x ~ x ~ x ~ ~ x x ~',
  'x ~ ~ ~ ~ x ~ ~ x ~ ~ x ~ ~ x ~',
  'x ~ ~ x ~ x ~ ~ x ~ ~ x ~ x ~ ~',
  'x x x ~ x ~ x x x ~ x ~ x x x ~',
  'x ~ x x ~ ~ x ~ x x ~ ~ x ~ x x',
]

const sc = (arr) => scene.pick(arr.map((s) => m(s)))

const fillPat = mode.pick([
  m('x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x'),
  m('x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ x'),
  m('x x x x ~ x x x x ~ x x x ~ x x'),
  m('x ~ x ~ x x ~ x ~ x x ~ x x x x'),
])
const ghostProb = mode.pick([0.6, 0.45, 0.3, 0.75])
const swing = mode.pick([0, 0.05, 0.02, 0.09])

const hQ = harmony.seg(1 / 8)
const hA = hQ.fmap((h) => (h < 0.5 ? 1 : 0))
const hB = hQ.fmap((h) => (h < 0.5 ? 0 : 1))

// ══════════════════════════════════════════════════════════════════
//  KHMER PERCUSSION — только ритм
// ══════════════════════════════════════════════════════════════════

// SKOR LOW — нижняя пара, тайко-сэмплы.
$: s("east").n("6 7 8")
  .struct(sc(SKOR))
  .speed(0.8)
  .gain(drums.skorLow.vol.mul(unmuted(muteSkor)))
  .lpf(drums.skorLow.cut).hpf(30).lpq(1)
  .clip(drums.skorLow.clip)
  .room(verb.mul(drums.skorLow.room)).roomsize(verbSize)
  .filter(audible)

// SKOR HIGH — та же ячейка со сдвигом; не мелодия, а ритм.
$: s("east").n("3 4 5")
  .struct(sc(SKOR).late(0.25))
  .speed(1.0)
  .gain(drums.skorHigh.vol.mul(unmuted(muteSkor)))
  .lpf(drums.skorHigh.cut).hpf(50).lpq(1)
  .clip(drums.skorHigh.clip)
  .pan(sine.slow(14).range(0.42, 0.58))
  .room(verb.mul(drums.skorHigh.room)).roomsize(verbSize)
  .filter(audible)

// SKOR FILL — режимный филл.
$: s("east").n("0 1 2")
  .struct(fillPat)
  .speed(mode.pick([0.95, 1, 1.05, 0.9]))
  .gain(drums.skorFill.vol.mul(unmuted(muteSkor)))
  .lpf(drums.skorFill.cut).hpf(80)
  .clip(drums.skorFill.clip)
  .pan(sine.slow(9).range(0.35, 0.65))
  .room(verb.mul(drums.skorFill.room)).roomsize(verbSize)
  .filter(audible)

// SAMPHO LOW — большая голова.
$: s("hand").n("0 1 2 3")
  .struct(sc(SAM))
  .speed(0.9)
  .gain(drums.samLow.vol.mul(unmuted(muteSampho)))
  .lpf(drums.samLow.cut).hpf(50).lpq(1.2)
  .clip(drums.samLow.clip)
  .pan(sine.slow(16).range(0.4, 0.6))
  .room(verb.mul(drums.samLow.room)).roomsize(verbSize)
  .filter(audible)

// SAMPHO HIGH — та же ячейка со сдвигом, interlock.
$: s("tabla").n("9 10 11 12 13 14")
  .struct(sc(SAM).late(0.25))
  .speed(1.0)
  .swingBy(swing, 8)
  .gain(drums.samHigh.vol.mul(unmuted(muteSampho)))
  .lpf(drums.samHigh.cut).hpf(140).lpq(1.2)
  .clip(drums.samHigh.clip)
  .pan(sine.slow(13).range(0.44, 0.6))
  .room(verb.mul(drums.samHigh.room)).roomsize(verbSize)
  .filter(audible)

// SAMPHO GHOST — 32-е призраки, вероятность от mode.
$: s("tabla").n("19 20 21 22 23 24 25")
  .struct(sc(SAM).late(0.125))
  .ply(2)
  .speed(1.15)
  .gain(drums.samGhost.vol.mul(unmuted(muteSampho)))
  .lpf(drums.samGhost.cut).hpf(280).lpq(1.4)
  .clip(drums.samGhost.clip)
  .degradeBy(ghostProb.fmap((p) => 1 - p))
  .pan(rand.mul(1.1).sub(0.55))
  .room(verb.mul(drums.samGhost.room)).roomsize(verbSize)
  .filter(audible)

// CHHING CLOSED — часы.
$: s("metal").n("0 1 2 3")
  .struct(sc(CHHING))
  .gain(drums.chhing.vol.mul(unmuted(muteChhing)))
  .hpf(3800).lpf(drums.chhing.cut)
  .clip(drums.chhing.clip)
  .room(verb.mul(drums.chhing.room)).roomsize(verbSize)
  .filter(audible)

// CHHING OPEN — открытый «чинг» со сдвигом.
$: s("metal").n("4 5 6 7")
  .struct(sc(CHHING).late(0.25))
  .gain(drums.chhingOpen.vol.mul(unmuted(muteChhing)))
  .hpf(3200).lpf(drums.chhingOpen.cut)
  .clip(drums.chhingOpen.clip)
  .room(verb.mul(drums.chhingOpen.room)).roomsize(verbSize)
  .filter(audible)

// CHHING ROLL — секвенсорный ролл, не пэд.
$: s("metal").n("8 9")
  .struct(sc(CHHING))
  .ply(2)
  .gain(drums.chhingRoll.vol.mul(unmuted(muteChhing)))
  .hpf(5200).lpf(drums.chhingRoll.cut)
  .clip(drums.chhingRoll.clip)
  .pan(rand.mul(1.1).sub(0.55))
  .room(verb.mul(drums.chhingRoll.room)).roomsize(verbSize)
  .filter(audible)

// KRAP — дерево, редко.
$: s("claves").note("<c6 g6>")
  .struct(sc(CHHING))
  .degradeBy(0.55)
  .gain(drums.krap.vol.mul(unmuted(muteKrap)))
  .hpf(1200).lpf(drums.krap.cut)
  .clip(drums.krap.clip)
  .pan(rand.mul(0.9).sub(0.45))
  .room(verb.mul(drums.krap.room)).roomsize(verbSize)
  .filter(audible)

// FILLS — короткий бег, не сетка.
$: note("<c3 eb3 f3 g3>")
  .s("triangle")
  .struct(fillPat)
  .fast(drums.fills.rate.fmap((r) => r / 16))
  .gain(drums.fills.vol.mul(unmuted(muteSkor)))
  .penv(-18).panchor(1).pattack(0.001).pdecay(0.02).psustain(0)
  .lpf(drums.fills.cut).hpf(160)
  .decay(0.05).sustain(0).release(0.03)
  .pan(sine.slow(9).range(0.35, 0.65))
  .room(verb.mul(drums.fills.room)).roomsize(verbSize)
  .filter(audible)

// KONG VONG — остинато на одном звуке; ритм, не мелодия.
$: note("<g2>")
  .s("gong")
  .struct(sc(SKOR))
  .degradeBy(0.65)
  .gain(gongs.vong.vol.mul(unmuted(muteGong)))
  .lpf(gongs.vong.cut).hpf(80)
  .clip(gongs.vong.clip)
  .pan(sine.slow(18).range(0.38, 0.58))
  .room(verb.mul(gongs.vong.room)).roomsize(verbSize)
  .filter(audible)

// KONG THOM, FIFTH — C2/C3, ритм; защёлка harmony.
$: note(GONG)
  .s("gong")
  .struct(sc(SKOR))
  .degradeBy(0.5)
  .gain(gongs.thom.vol.mul(hA).mul(unmuted(muteGong)))
  .lpf(gongs.thom.cut).hpf(30)
  .clip(gongs.thom.clip)
  .room(verb.mul(gongs.thom.room)).roomsize(verbSize)
  .filter(audible)

// KONG THOM, AXIS — +6: C–Gb, тот же ритм.
$: note(GONG).add(note(6))
  .s("gong")
  .struct(sc(SKOR))
  .degradeBy(0.5)
  .gain(gongs.thom.vol.mul(hB).mul(unmuted(muteGong)))
  .lpf(gongs.thom.cut.mul(0.9)).hpf(30)
  .clip(gongs.thom.clip)
  .room(verb.mul(gongs.thom.room)).roomsize(verbSize)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ACID — секция, не ритм пинпета
// ══════════════════════════════════════════════════════════════════
// Сочетаем несочетаемое: кхмерский цикл + acid bass/arp. У обоих
// есть `pace`: 4…32, шаг 1. Это не украшение, а другой слой времени.

// ACID BASS — 16-шаговая линия, pace задаёт плотность.
$: note("c1 c1 eb1 c1 f1 c1 gb1 c1 bb0 c1 eb1 c1 f1 gb1 c1 bb0")
  .s("sawtooth")
  .fast(acidInst.bass.pace.fmap((p) => p / 16))
  .gain(acidInst.bass.vol.mul(acid))
  .lpf(acidInst.bass.cut).lpq(acidInst.bass.res)
  .ftype("ladder").drive(acidInst.bass.drive)
  .lpenv(acidInst.bass.env)
  .lpa(0.002).lpd(acidInst.bass.decay).lpsustain(0.1)
  .decay(0.12).sustain(0)
  .room(verb.mul(acidInst.bass.room)).roomsize(verbSize)
  .orbit(2)
  .filter(audible)

// ACID ARP — тот же цикл, но арпеджио; pace задаёт скорость.
$: note("[c4,eb4,gb4,bb4]")
  .s("sawtooth")
  .arp(run(acidInst.arp.pace))
  .gain(acidInst.arp.vol.mul(acid))
  .lpf(acidInst.arp.cut).lpq(acidInst.arp.res).ftype("24db")
  .decay(acidInst.arp.decay).sustain(0)
  .delay(acidInst.arp.echo).delaytime(0.375).delayfeedback(0.35)
  .pan(sine.slow(6).range(0.3, 0.7))
  .room(verb.mul(acidInst.arp.room)).roomsize(verbSize)
  .orbit(3)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ШПАРГАЛКА
// ══════════════════════════════════════════════════════════════════
//  сцены:    12 ритмов r01…r12 (scene 0…11)
//  режим:    0 straight / 1 drag / 2 roll / 3 broken
//  гармония:  0 fifth / 1 axis (защёлка 8 тактов)
//  acid:      0 off / 1 on; у bass и arp есть pace 4…32
//  mutes:     skor · sampho · chhing · krap · gong
//  реверб:    verb 0…1.2, verbSize 1…16
//  громкости: skorLow .4, skorHigh .33, samLow .34, samHigh .28,
//             ghost .23, chhing .23, open .21, krap .19, fills .18,
//             gong vong .3, gong thom .26, acid bass .2, arp .13
//  антипоп:   кхмерские слои — ритм/остинато; мелодия только в acid
// ══════════════════════════════════════════════════════════════════
