// ══════════════════════════════════════════════════════════════════
//  EXPERIMENTAL 01 · COMPLEX BASS · Strudel · 160 BPM
//
//  Buchla-подход: не «осциллятор + фильтр», а сложный осциллятор:
//  FM/AM, динамический waveshaping, вейвтейблы и парная модуляция.
//  Цель — шершавый жир на басу, а не мультяшный тембр.
//
//  10 основных осцилляторов = 5 пар:
//    WT1 wt_dbass      + FM1 sine
//    WT2 wt_distorted  + FM2 sawtooth
//    WT3 wt_ebass      + FM3 square
//    WT4 wt_raw        + FM4 triangle
//    WT5 wt_bitreduced + FM5 sine
//  В каждой паре WT-слой сканируется LFO (wt/warp), FM-слой имеет
//  собственный 2-op модулятор, а kick дакает общий bass bus через duckorbit.
//  Честно: в Strudel вейвтейбл — сэмпловый источник, его нельзя
//  аудио-рейт FM-ить другим слоем. Настоящая cross-mod — внутри
//  FM-голоса (carrier+modulator); у WT — wt/warp + амплитудное ducking.
//
//  Низ: D1/F1/G1/A1/C2/D2/F2/G2; @dark разрешает тритоны.
//  @roots d d d d d d d d
//  @dark
// ══════════════════════════════════════════════════════════════════

const BPM = 160
setcpm(BPM / 4)

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

// @switches riff=acid,roll,dnb,prod,off,oct,stair,two,pedal,stab,skip,crawl mode=clean,grit,fold,scream harmony=low,axis
const riff = slider(10, 0, 11, 1)
const mode = slider(2, 0, 3, 1)
const harmony = slider(1, 0, 1, 1)

// @defaultMutes
// @mutes muteWT,muteFM,muteDrone,muteKick,muteHats
const muteWT = slider(0, 0, 1, 1)
const muteFM = slider(0, 0, 1, 1)
const muteDrone = slider(0, 0, 1, 1)
const muteKick = slider(0, 0, 1, 1)
const muteHats = slider(0, 0, 1, 1)

const sidechain = slider(0.5, 0, 1, 0.01)
const verb = slider(0.35, 0, 1, 0.01)
const verbSize = slider(12, 1, 20, 0.5)

// ══════════════════════════════════════════════════════════════════
//  СЭМПЛЫ / ИНСТРУМЕНТЫ
// ══════════════════════════════════════════════════════════════════
if (typeof samples === 'function') {
  samples('bubo:waveforms')
  samples('github:tidalcycles/Dirt-Samples')
}

const instruments = {
  wt: {
    name: 'Wavetables',
    wt1: {
      name: 'WT1 dbass',
      vol: slider(0, 0, 1, 0.01),
      pos: slider(0.3, 0, 1, 0.01),
      posDepth: slider(0.25, 0, 1, 0.01),
      warp: slider(0.35, 0, 1, 0.01),
      warpDepth: slider(0.2, 0, 1, 0.01),
      cut: slider(700, 80, 6000, 10),
      res: slider(6, 0, 20, 0.5),
      shape: slider(0.35, 0, 1, 0.01),
      decay: slider(0.28, 0.03, 1.2, 0.01),
      pan: slider(0.4, 0, 1, 0.01),
      echo: slider(0.18, 0, 0.8, 0.01),
      room: slider(0.22, 0, 0.9, 0.01),
      slide: slider(0.08, 0, 0.3, 0.005),
      oct: slider(0, 0, 4, 1),
      pace: slider(16, 4, 32, 1),
      gate: slider(1, 0, 1, 1),
      mute: 'muteWT',
    },
    wt2: {
      name: 'WT2 distorted',
      vol: slider(0, 0, 1, 0.01),
      pos: slider(0.4, 0, 1, 0.01),
      posDepth: slider(0.3, 0, 1, 0.01),
      warp: slider(0.5, 0, 1, 0.01),
      warpDepth: slider(0.25, 0, 1, 0.01),
      cut: slider(4140, 80, 6000, 10),
      res: slider(2.5, 0, 20, 0.5),
      shape: slider(0.5, 0, 1, 0.01),
      decay: slider(1, 0.03, 1.2, 0.01),
      pan: slider(0.6, 0, 1, 0.01),
      echo: slider(0.18, 0, 0.8, 0.01),
      room: slider(0.22, 0, 0.9, 0.01),
      slide: slider(0.08, 0, 0.3, 0.005),
      oct: slider(0, 0, 4, 1),
      pace: slider(16, 4, 32, 1),
      gate: slider(1, 0, 1, 1),
      mute: 'muteWT',
    },
    wt3: {
      name: 'WT3 ebass',
      vol: slider(0, 0, 1, 0.01),
      pos: slider(0.5, 0, 1, 0.01),
      posDepth: slider(0.2, 0, 1, 0.01),
      warp: slider(0.3, 0, 1, 0.01),
      warpDepth: slider(0.15, 0, 1, 0.01),
      cut: slider(2650, 80, 6000, 10),
      res: slider(7.5, 0, 20, 0.5),
      shape: slider(0.3, 0, 1, 0.01),
      decay: slider(0.35, 0.03, 1.2, 0.01),
      pan: slider(0.35, 0, 1, 0.01),
      echo: slider(0.18, 0, 0.8, 0.01),
      room: slider(0.22, 0, 0.9, 0.01),
      slide: slider(0.08, 0, 0.3, 0.005),
      oct: slider(0, 0, 4, 1),
      pace: slider(16, 4, 32, 1),
      gate: slider(1, 0, 1, 1),
      mute: 'muteWT',
    },
    wt4: {
      name: 'WT4 raw',
      vol: slider(0, 0, 1, 0.01),
      pos: slider(0.35, 0, 1, 0.01),
      posDepth: slider(0.35, 0, 1, 0.01),
      warp: slider(0.6, 0, 1, 0.01),
      warpDepth: slider(0.3, 0, 1, 0.01),
      cut: slider(1500, 80, 6000, 10),
      res: slider(10, 0, 20, 0.5),
      shape: slider(0.55, 0, 1, 0.01),
      decay: slider(0.16, 0.03, 1.2, 0.01),
      pan: slider(0.65, 0, 1, 0.01),
      echo: slider(0.18, 0, 0.8, 0.01),
      room: slider(0.22, 0, 0.9, 0.01),
      slide: slider(0.08, 0, 0.3, 0.005),
      oct: slider(0, 0, 4, 1),
      pace: slider(16, 4, 32, 1),
      gate: slider(0, 0, 1, 1),
      mute: 'muteWT',
    },
    wt5: {
      name: 'WT5 bitreduced',
      vol: slider(0, 0, 1, 0.01),
      pos: slider(0.45, 0, 1, 0.01),
      posDepth: slider(0.3, 0, 1, 0.01),
      warp: slider(0.45, 0, 1, 0.01),
      warpDepth: slider(0.25, 0, 1, 0.01),
      cut: slider(1800, 80, 6000, 10),
      res: slider(12, 0, 20, 0.5),
      shape: slider(0.6, 0, 1, 0.01),
      decay: slider(0.22, 0.03, 1.2, 0.01),
      pan: slider(0.5, 0, 1, 0.01),
      echo: slider(0.18, 0, 0.8, 0.01),
      room: slider(0.22, 0, 0.9, 0.01),
      slide: slider(0.08, 0, 0.3, 0.005),
      oct: slider(0, 0, 4, 1),
      pace: slider(16, 4, 32, 1),
      gate: slider(0, 0, 1, 1),
      mute: 'muteWT',
    },
  },
  fm: {
    name: 'FM Complex',
    fm1: {
      name: 'FM1 sine',
      vol: slider(0, 0, 1, 0.01),
      ratio: slider(1, 1, 8, 0.01),
      index: slider(2, 0, 20, 0.1),
      indexMod: slider(1.5, 0, 12, 0.1),
      cut: slider(420, 60, 5000, 10),
      res: slider(5, 0, 20, 0.5),
      shape: slider(0.4, 0, 1, 0.01),
      decay: slider(0.22, 0.03, 1.2, 0.01),
      pan: slider(0.5, 0, 1, 0.01),
      echo: slider(0.15, 0, 0.8, 0.01),
      room: slider(0.18, 0, 0.9, 0.01),
      slide: slider(0.08, 0, 0.3, 0.005),
      oct: slider(0, 0, 4, 1),
      pace: slider(16, 4, 32, 1),
      gate: slider(1, 0, 1, 1),
      mute: 'muteFM',
    },
    fm2: {
      name: 'FM2 sawtooth',
      vol: slider(0, 0, 1, 0.01),
      ratio: slider(2, 1, 8, 0.01),
      index: slider(4, 0, 20, 0.1),
      indexMod: slider(3, 0, 12, 0.1),
      cut: slider(900, 60, 5000, 10),
      res: slider(8, 0, 20, 0.5),
      shape: slider(0.55, 0, 1, 0.01),
      decay: slider(0.16, 0.03, 1.2, 0.01),
      pan: slider(0.4, 0, 1, 0.01),
      echo: slider(0.15, 0, 0.8, 0.01),
      room: slider(0.18, 0, 0.9, 0.01),
      slide: slider(0.12, 0, 0.3, 0.005),
      oct: slider(0, 0, 4, 1),
      pace: slider(16, 4, 32, 1),
      gate: slider(0, 0, 1, 1),
      mute: 'muteFM',
    },
    fm3: {
      name: 'FM3 square',
      vol: slider(0, 0, 1, 0.01),
      ratio: slider(3, 1, 8, 0.01),
      index: slider(3, 0, 20, 0.1),
      indexMod: slider(2, 0, 12, 0.1),
      cut: slider(700, 60, 5000, 10),
      res: slider(6, 0, 20, 0.5),
      shape: slider(0.35, 0, 1, 0.01),
      decay: slider(0.3, 0.03, 1.2, 0.01),
      pan: slider(0.6, 0, 1, 0.01),
      echo: slider(0.15, 0, 0.8, 0.01),
      room: slider(0.18, 0, 0.9, 0.01),
      slide: slider(0.06, 0, 0.3, 0.005),
      oct: slider(0, 0, 4, 1),
      pace: slider(16, 4, 32, 1),
      gate: slider(0, 0, 1, 1),
      mute: 'muteFM',
    },
    fm4: {
      name: 'FM4 triangle',
      vol: slider(0, 0, 1, 0.01),
      ratio: slider(1.5, 1, 8, 0.01),
      index: slider(5, 0, 20, 0.1),
      indexMod: slider(4, 0, 12, 0.1),
      cut: slider(1200, 60, 5000, 10),
      res: slider(9, 0, 20, 0.5),
      shape: slider(0.6, 0, 1, 0.01),
      decay: slider(0.14, 0.03, 1.2, 0.01),
      pan: slider(0.35, 0, 1, 0.01),
      echo: slider(0.15, 0, 0.8, 0.01),
      room: slider(0.18, 0, 0.9, 0.01),
      slide: slider(0.15, 0, 0.3, 0.005),
      oct: slider(0, 0, 4, 1),
      pace: slider(16, 4, 32, 1),
      gate: slider(0, 0, 1, 1),
      mute: 'muteFM',
    },
    fm5: {
      name: 'FM5 sine',
      vol: slider(0, 0, 1, 0.01),
      ratio: slider(2.5, 1, 8, 0.01),
      index: slider(7, 0, 20, 0.1),
      indexMod: slider(6, 0, 12, 0.1),
      cut: slider(1600, 60, 5000, 10),
      res: slider(11, 0, 20, 0.5),
      shape: slider(0.65, 0, 1, 0.01),
      decay: slider(0.18, 0.03, 1.2, 0.01),
      pan: slider(0.55, 0, 1, 0.01),
      echo: slider(0.15, 0, 0.8, 0.01),
      room: slider(0.18, 0, 0.9, 0.01),
      slide: slider(0.18, 0, 0.3, 0.005),
      oct: slider(0, 0, 4, 1),
      pace: slider(16, 4, 32, 1),
      gate: slider(1, 0, 1, 1),
      mute: 'muteFM',
    },
  },
  lfo: {
    name: 'Pair LFOs',
    lfo1: {
      name: 'LFO1',
      rate: slider(0.18, 0.05, 4, 0.01),
    },
    lfo2: {
      name: 'LFO2',
      rate: slider(0.35, 0.05, 4, 0.01),
    },
    lfo3: {
      name: 'LFO3',
      rate: slider(0.25, 0.05, 4, 0.01),
    },
    lfo4: {
      name: 'LFO4',
      rate: slider(0.5, 0.05, 4, 0.01),
    },
    lfo5: {
      name: 'LFO5',
      rate: slider(0.8, 0.05, 4, 0.01),
    },
  },
  drums: {
    name: 'Drums',
    kick: {
      name: 'Hardcore kick',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(280, 80, 1200, 5),
      shape: slider(0.9, 0, 0.98, 0.01),
      dist: slider(2.2, 0, 4, 0.1),
      decay: slider(0.5, 0.15, 1.2, 0.01),
      tune: slider(0.75, 0.55, 1.2, 0.01),
      gate: slider(1, 0, 1, 1),
      mute: 'muteKick',
    },
    kickSub: {
      name: 'Kick sub',
      vol: slider(0, 0, 0.7, 0.01),
      cut: slider(80, 40, 200, 2),
      decay: slider(0.5, 0.15, 1.5, 0.01),
      tune: slider(0.75, 0.55, 1.2, 0.01),
      gate: slider(1, 0, 1, 1),
      mute: 'muteKick',
    },
  },
  hats: {
    name: 'Hats',
    closed: {
      name: 'Closed hats',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(9000, 1000, 16000, 100),
      shape: slider(0.55, 0, 1, 0.01),
      decay: slider(0.04, 0.01, 0.2, 0.005),
      gate: slider(1, 0, 1, 1),
      mute: 'muteHats',
    },
    open: {
      name: 'Open hats',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(8000, 1000, 16000, 100),
      decay: slider(0.14, 0.03, 0.5, 0.01),
      gate: slider(1, 0, 1, 1),
      mute: 'muteHats',
    },
  },
  drone: {
    name: 'Drone',
    low: {
      name: 'Low bed',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(240, 60, 800, 5),
      det: slider(0.05, 0, 0.2, 0.005),
      room: slider(0.4, 0, 0.9, 0.01),
      gate: slider(1, 0, 1, 1),
      mute: 'muteDrone',
    },
  },
  dirt: {
    name: 'Dirt',
    crackle: {
      name: 'Crackle',
      vol: slider(0, 0, 0.2, 0.005),
      cut: slider(1200, 200, 6000, 20),
      gate: slider(1, 0, 1, 1),
    },
    air: {
      name: 'Air',
      vol: slider(0, 0, 0.2, 0.005),
      cut: slider(500, 100, 5000, 20),
      gate: slider(1, 0, 1, 1),
    },
  },
  fx: {
    name: 'FX',
    dub: {
      name: 'Dub delay',
      delaySend: slider(0.18, 0, 0.8, 0.01),
      delayTime: slider(0.375, 0.0625, 0.75, 0.0625),
      delayFeedback: slider(0.45, 0, 0.85, 0.01),
    },
  },
}

const { wt, fm, lfo, drone, dirt, drums, hats, fx } = instruments
const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}
const unmuted = (m) => m.fmap((v) => (v ? 0 : 1))

// ══════════════════════════════════════════════════════════════════
//  ПАРНЫЕ LFO — управляющие осцилляторы, не звук
// ══════════════════════════════════════════════════════════════════
const lfo1 = sine.range(0, 1).fast(lfo.lfo1.rate)
const lfo2 = sine.range(0, 1).fast(lfo.lfo2.rate)
const lfo3 = sine.range(0, 1).fast(lfo.lfo3.rate)
const lfo4 = sine.range(0, 1).fast(lfo.lfo4.rate)
const lfo5 = sine.range(0, 1).fast(lfo.lfo5.rate)

const grit = mode.pick([0.1, 0.3, 0.55, 0.8])
const fmMode = mode.pick([0.6, 1, 1.4, 1.8])
const airPat = mode.pick([
  m('x ~ ~ ~ ~ ~ ~ ~'),
  m('x ~ ~ x ~ ~ x ~'),
  m('x x ~ x x ~ x x'),
  m('x x x x ~ x x x'),
])

// BOCHKA по режимам. 0–2 — четыре в пол; 3 — только 4-я доля
// каждого 2-го такта (полу-брейк).
const kickPat = mode.pick([
  m('x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~'),
  m('x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~'),
  m('x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~'),
  m('<[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~] [~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~]>'),
])

// Хэты: 0 — ровные четверти, 1 — 8-е, 2 — ломаные 16-е,
// 3 — хардкорные 16-е.
const hatPat = mode.pick([
  m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'),   // 0: ровно на слабую (оффбит)
  m('x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~'),   // 1: 8-е
  m('x ~ x x ~ x x ~ x ~ x x ~ x x ~'),   // 2: ломаные 16-е
  m('x x x x ~ x x x x ~ x x x ~ x x'),   // 3: хардкорные 16-е
])
const openPat = mode.pick([
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),   // 0: без открытых
  m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'),   // 1: открытые на слабую
  m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'),
  m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'),
])

// ══════════════════════════════════════════════════════════════════
//  ФРАЗЫ
// ══════════════════════════════════════════════════════════════════
const phrase = (bars) => m('<' + bars.join(' ') + '>')

// @roots d d d d d d d d
// @scenes {"intro":{"mode":0,"harmony":0},"theme":{"mode":2,"harmony":0}}
// @dark

const PAD_A = phrase([
  '[d2,a2]', '[d2,a2]', '[d2,a2]', '[d2,a2]',
  '[d2,a2]', '[d2,a2]', '[d2,a2]', '[d2,a2]',
])
const PAD_B = phrase([
  '[d2,ab3]', '[d2,ab3]', '[d2,ab3]', '[d2,ab3]',
  '[d2,ab3]', '[d2,ab3]', '[d2,ab3]', '[d2,ab3]',
])
const hQ = harmony.seg(1 / 8)
const hA = hQ.fmap((h) => (h < 0.5 ? 1 : 0))
const hB = hQ.fmap((h) => (h < 0.5 ? 0 : 1))

const R1 = phrase([
  '[d1 d1 ~ d1 ~ f1 d1 ~ g1 ~ f1 ~ c2 ~ d1 ~]',
  '[d1 d1 ~ d1 ~ f1 d1 ~ g1 ~ d1 ~ c2 ~ d1 ~]',
  '[d1 d1 ~ d1 ~ f1 d1 ~ g1 ~ f1 ~ c2 ~ d1 ~]',
  '[d1 ~ d1 f1 ~ d1 d1 ~ g1 ~ f1 ~ c2 ~ d1 ~]',
  '[d1 d1 ~ d1 ~ f1 d1 ~ g1 ~ f1 ~ c2 ~ d1 ~]',
  '[d1 d1 ~ d1 ~ f1 d1 ~ a1 ~ g1 ~ c2 ~ d1 ~]',
  '[d1 ~ d1 f1 ~ d1 d1 ~ g1 ~ f1 ~ c2 ~ d1 ~]',
  '[d1 ~ d1 f1 ~ d1 ~ g1 d1 ~ f1 ~ c2 ~ d1 ~]',
])

const R2 = phrase([
  '[d1 ~ d1 ~ f1 ~ d1 ~ g1 ~ d1 ~ a1 ~ c2 ~]',
  '[d1 ~ d1 ~ f1 ~ d1 ~ g1 ~ d1 ~ a1 ~ c2 ~]',
  '[d1 ~ d1 ~ f1 ~ d1 ~ g1 ~ d1 ~ a1 ~ c2 ~]',
  '[d1 ~ d1 ~ f1 ~ d1 ~ g1 ~ d1 ~ a1 ~ c2 ~]',
  '[d1 ~ d1 ~ f1 ~ d1 ~ g1 ~ d1 ~ a1 ~ c2 ~]',
  '[d1 ~ d1 ~ f1 ~ d1 ~ g1 ~ d1 ~ a1 ~ c2 ~]',
  '[d1 ~ d1 ~ f1 ~ g1 ~ a1 ~ c2 ~ d2 ~ c2 ~]',
  '[d1 ~ d1 ~ f1 ~ g1 ~ a1 ~ c2 ~ d2 ~ c2 ~]',
])

const R3 = phrase([
  '[d1 ~ ~ d1 ~ f1 ~ ~ g1 ~ d1 ~ f1 ~ c2 ~]',
  '[d1 ~ ~ d1 ~ f1 ~ ~ g1 ~ d1 ~ f1 ~ c2 ~]',
  '[d1 ~ ~ d1 ~ f1 ~ ~ a1 ~ g1 ~ f1 ~ c2 ~]',
  '[d1 ~ ~ d1 ~ f1 ~ ~ g1 ~ d1 ~ c2 ~ d2 ~]',
  '[d1 ~ ~ d1 ~ f1 ~ ~ g1 ~ d1 ~ f1 ~ c2 ~]',
  '[d1 ~ ~ d1 ~ f1 ~ ~ a1 ~ g1 ~ f1 ~ c2 ~]',
  '[d1 ~ ~ d1 ~ f1 ~ ~ g1 ~ d1 ~ c2 ~ d2 ~]',
  '[d1 ~ ~ d1 ~ f1 ~ ~ g1 ~ f1 ~ d1 ~ c2 ~]',
])

const R4 = phrase([
  '[d1 d1 ~ f1 d1 ~ d1 g1 d1 ~ f1 ~ d1 c2 ~ d1]',
  '[d1 d1 ~ f1 d1 ~ d1 g1 d1 ~ f1 ~ d1 c2 ~ d1]',
  '[d1 d1 ~ f1 d1 ~ d1 g1 d1 ~ f1 ~ d1 c2 ~ d1]',
  '[d1 d1 ~ f1 d1 ~ d1 a1 d1 ~ g1 ~ f1 c2 ~ d1]',
  '[d1 d1 ~ f1 d1 ~ d1 g1 d1 ~ f1 ~ d1 c2 ~ d1]',
  '[d1 d1 ~ f1 d1 ~ d1 g1 d1 ~ f1 ~ d1 c2 ~ d1]',
  '[d1 d1 ~ f1 d1 ~ d1 a1 d1 ~ g1 ~ f1 c2 ~ d1]',
  '[d1 d1 ~ f1 d1 ~ d1 g1 ~ f1 d1 ~ c2 ~ d1 ~]',
])

const R5 = phrase([
  '[~ d1 ~ d1 ~ f1 ~ d1 ~ g1 ~ f1 ~ c2 ~ d1]',
  '[~ d1 ~ d1 ~ f1 ~ d1 ~ g1 ~ f1 ~ c2 ~ d1]',
  '[~ d1 ~ d1 ~ f1 ~ d1 ~ g1 ~ f1 ~ c2 ~ d1]',
  '[~ d1 ~ d1 ~ f1 ~ d1 ~ a1 ~ g1 ~ c2 ~ d1]',
  '[~ d1 ~ d1 ~ f1 ~ d1 ~ g1 ~ f1 ~ c2 ~ d1]',
  '[~ d1 ~ d1 ~ f1 ~ d1 ~ g1 ~ f1 ~ c2 ~ d1]',
  '[~ d1 ~ d1 ~ f1 ~ d1 ~ a1 ~ g1 ~ c2 ~ d1]',
  '[~ d1 ~ d1 ~ f1 ~ d1 ~ g1 ~ f1 ~ c2 ~ d1]',
])

const R6 = phrase([
  '[d1 ~ d1 d2 ~ d1 f1 ~ g1 ~ d1 d2 ~ c2 ~ d1]',
  '[d1 ~ d1 d2 ~ d1 f1 ~ g1 ~ d1 d2 ~ c2 ~ d1]',
  '[d1 ~ d1 d2 ~ d1 f1 ~ g1 ~ d1 d2 ~ c2 ~ d1]',
  '[d1 ~ d1 d2 ~ d1 f1 ~ a1 ~ g1 d2 ~ c2 ~ d1]',
  '[d1 ~ d1 d2 ~ d1 f1 ~ g1 ~ d1 d2 ~ c2 ~ d1]',
  '[d1 ~ d1 d2 ~ d1 f1 ~ g1 ~ d1 d2 ~ c2 ~ d1]',
  '[d1 ~ d1 d2 ~ d1 f1 ~ a1 ~ g1 d2 ~ c2 ~ d1]',
  '[d1 ~ d1 d2 ~ d1 f1 ~ g1 ~ f1 d2 ~ c2 ~ d1]',
])

const R7 = phrase([
  '[d1 d1 d1 ~ d1 d1 f1 ~ d1 d1 g1 ~ d1 f1 d1 ~]',
  '[d1 d1 d1 ~ d1 d1 f1 ~ d1 d1 g1 ~ d1 f1 d1 ~]',
  '[d1 d1 d1 ~ d1 d1 f1 ~ d1 d1 g1 ~ d1 f1 d1 ~]',
  '[d1 d1 d1 ~ d1 d1 f1 ~ d1 d1 a1 ~ d1 f1 d1 ~]',
  '[d1 d1 d1 ~ d1 d1 f1 ~ d1 d1 g1 ~ d1 f1 d1 ~]',
  '[d1 d1 d1 ~ d1 d1 f1 ~ d1 d1 g1 ~ d1 f1 d1 ~]',
  '[d1 d1 d1 ~ d1 d1 f1 ~ d1 d1 a1 ~ d1 c2 d1 ~]',
  '[d1 d1 d1 ~ d1 d1 f1 ~ d1 d1 g1 ~ d1 f1 d1 ~]',
])

const R8 = phrase([
  '[d1 f1 d1 f1 ~ d1 f1 d1 ~ d1 f1 ~ d1 f1 d1 ~]',
  '[d1 f1 d1 f1 ~ d1 f1 d1 ~ d1 f1 ~ d1 f1 d1 ~]',
  '[d1 f1 d1 f1 ~ d1 f1 d1 ~ d1 f1 ~ d1 f1 d1 ~]',
  '[d1 a1 d1 a1 ~ d1 a1 d1 ~ d1 a1 ~ d1 a1 d1 ~]',
  '[d1 f1 d1 f1 ~ d1 f1 d1 ~ d1 f1 ~ d1 f1 d1 ~]',
  '[d1 f1 d1 f1 ~ d1 f1 d1 ~ d1 f1 ~ d1 f1 d1 ~]',
  '[d1 a1 d1 a1 ~ d1 a1 d1 ~ d1 a1 ~ d1 a1 d1 ~]',
  '[d1 f1 d1 f1 ~ d1 f1 d1 ~ d1 f1 ~ d1 f1 d1 ~]',
])

const R9 = phrase([
  '[d1 d1 ~ d1 d1 ~ d1 d1 ~ d1 c2 ~ d1 d1 ~ d1]',
  '[d1 d1 ~ d1 d1 ~ d1 d1 ~ d1 c2 ~ d1 d1 ~ d1]',
  '[d1 d1 ~ d1 d1 ~ d1 d1 ~ d1 c2 ~ d1 d1 ~ d1]',
  '[d1 d1 ~ d1 d1 ~ f1 f1 ~ d1 c2 ~ d1 d1 ~ d1]',
  '[d1 d1 ~ d1 d1 ~ d1 d1 ~ d1 c2 ~ d1 d1 ~ d1]',
  '[d1 d1 ~ d1 d1 ~ d1 d1 ~ d1 c2 ~ d1 d1 ~ d1]',
  '[d1 d1 ~ d1 d1 ~ g1 g1 ~ d1 c2 ~ d1 d1 ~ d1]',
  '[d1 d1 ~ d1 d1 ~ d1 d1 ~ d1 c2 ~ d1 d1 ~ d1]',
])

const R10 = phrase([
  '[d1 ~ ~ d1 ~ ~ d1 ~ ~ d1 c2 ~ d1 ~ f1 ~]',
  '[d1 ~ ~ d1 ~ ~ d1 ~ ~ d1 c2 ~ d1 ~ f1 ~]',
  '[d1 ~ ~ d1 ~ ~ d1 ~ ~ d1 c2 ~ d1 ~ f1 ~]',
  '[d1 ~ ~ d1 ~ ~ d1 ~ ~ d1 a1 ~ d1 ~ f1 ~]',
  '[d1 ~ ~ d1 ~ ~ d1 ~ ~ d1 c2 ~ d1 ~ f1 ~]',
  '[d1 ~ ~ d1 ~ ~ d1 ~ ~ d1 c2 ~ d1 ~ f1 ~]',
  '[d1 ~ ~ d1 ~ ~ d1 ~ ~ d1 a1 ~ d1 ~ f1 ~]',
  '[d1 ~ ~ d1 ~ ~ d1 ~ ~ d1 c2 ~ d1 ~ f1 ~]',
])

const R11 = phrase([
  '[d1 ~ ~ d1 ~ ~ d1 ~ ~ d1 ~ c2 d1 ~ ~ d1]',
  '[d1 ~ ~ d1 ~ ~ d1 ~ ~ d1 ~ c2 d1 ~ ~ d1]',
  '[d1 ~ ~ d1 ~ ~ d1 ~ ~ d1 ~ c2 d1 ~ ~ d1]',
  '[d1 ~ ~ d1 ~ ~ d1 ~ ~ d1 ~ c2 d1 ~ f1 d1]',
  '[d1 ~ ~ d1 ~ ~ d1 ~ ~ d1 ~ c2 d1 ~ ~ d1]',
  '[d1 ~ ~ d1 ~ ~ d1 ~ ~ d1 ~ c2 d1 ~ ~ d1]',
  '[d1 ~ ~ d1 ~ ~ d1 ~ ~ d1 ~ c2 d1 ~ f1 d1]',
  '[d1 ~ ~ d1 ~ ~ d1 ~ ~ d1 ~ c2 d1 ~ ~ d1]',
])

const R12 = phrase([
  '[d1 ~ d1 ~ d1 ~ f1 ~ d1 ~ d1 ~ g1 ~ d1 ~]',
  '[d1 ~ d1 ~ d1 ~ f1 ~ d1 ~ d1 ~ g1 ~ d1 ~]',
  '[d1 ~ d1 ~ d1 ~ f1 ~ d1 ~ d1 ~ g1 ~ d1 ~]',
  '[d1 ~ d1 ~ d1 ~ a1 ~ d1 ~ d1 ~ g1 ~ d1 ~]',
  '[d1 ~ d1 ~ d1 ~ f1 ~ d1 ~ d1 ~ g1 ~ d1 ~]',
  '[d1 ~ d1 ~ d1 ~ f1 ~ d1 ~ d1 ~ g1 ~ d1 ~]',
  '[d1 ~ d1 ~ d1 ~ a1 ~ d1 ~ d1 ~ c2 ~ d1 ~]',
  '[d1 ~ d1 ~ d1 ~ f1 ~ d1 ~ d1 ~ g1 ~ d1 ~]',
])

const RIFF = riff.pick([R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12])
const ACCENT = m('1 .7 1 .8 1 .6 1 .7 1 .8 1 .6 1 .7')

// ══════════════════════════════════════════════════════════════════
//  10 ОСЦИЛЛЯТОРОВ · 5 ПАР
// ══════════════════════════════════════════════════════════════════
// PAIR 1 · wt_dbass + FM sine
$: note(RIFF).fast(wt.wt1.pace.fmap((p) => p / 16))
  .add(note(wt.wt1.oct.mul(12))).s('wt_dbass')
  .wt(lfo1.mul(wt.wt1.posDepth).add(wt.wt1.pos))
  .warp(lfo1.mul(wt.wt1.warpDepth).add(wt.wt1.warp))
  .gain(wt.wt1.vol.mul(unmuted(muteWT)).mul(wt.wt1.gate).mul(ACCENT))
  .lpf(wt.wt1.cut).lpq(wt.wt1.res).ftype('24db').hpf(30)
  .shape(wt.wt1.shape.add(grit.mul(0.15)))
  .slide(wt.wt1.slide)
  .attack(0.01).decay(wt.wt1.decay).sustain(0.6).release(0.12)
  .pan(wt.wt1.pan)
  .delay(wt.wt1.echo.mul(fx.dub.delaySend)).delaytime(fx.dub.delayTime)
  .delayfeedback(fx.dub.delayFeedback.mul(0.5))
  .room(verb.mul(wt.wt1.room)).roomsize(verbSize)
  .orbit(7)
  .filter(audible)

$: note(RIFF).fast(fm.fm1.pace.fmap((p) => p / 16))
  .add(note(fm.fm1.oct.mul(12))).s('sine')
  .fmh(fm.fm1.ratio)
  .fm(fm.fm1.index.add(lfo1.mul(fm.fm1.indexMod)).mul(fmMode))
  .gain(fm.fm1.vol.mul(unmuted(muteFM)).mul(fm.fm1.gate).mul(ACCENT))
  .lpf(fm.fm1.cut).lpq(fm.fm1.res).ftype('24db').hpf(25)
  .shape(fm.fm1.shape.add(grit.mul(0.2)))
  .slide(fm.fm1.slide)
  .attack(0.005).decay(fm.fm1.decay).sustain(0.55).release(0.08)
  .pan(fm.fm1.pan)
  .delay(fm.fm1.echo.mul(fx.dub.delaySend)).delaytime(fx.dub.delayTime)
  .delayfeedback(fx.dub.delayFeedback.mul(0.4))
  .room(verb.mul(fm.fm1.room)).roomsize(verbSize)
  .orbit(7)
  .filter(audible)

// PAIR 2 · wt_distorted + FM sawtooth
$: note(RIFF).fast(wt.wt2.pace.fmap((p) => p / 16))
  .add(note(wt.wt2.oct.mul(12))).s('wt_distorted')
  .wt(lfo2.mul(wt.wt2.posDepth).add(wt.wt2.pos))
  .warp(lfo2.mul(wt.wt2.warpDepth).add(wt.wt2.warp))
  .gain(wt.wt2.vol.mul(unmuted(muteWT)).mul(wt.wt2.gate).mul(ACCENT))
  .lpf(wt.wt2.cut).lpq(wt.wt2.res).ftype('24db').hpf(30)
  .shape(wt.wt2.shape.add(grit.mul(0.15)))
  .slide(wt.wt2.slide)
  .attack(0.01).decay(wt.wt2.decay).sustain(0.6).release(0.12)
  .pan(wt.wt2.pan)
  .delay(wt.wt2.echo.mul(fx.dub.delaySend)).delaytime(fx.dub.delayTime)
  .delayfeedback(fx.dub.delayFeedback.mul(0.5))
  .room(verb.mul(wt.wt2.room)).roomsize(verbSize)
  .orbit(7)
  .filter(audible)

$: note(RIFF).fast(fm.fm2.pace.fmap((p) => p / 16))
  .add(note(fm.fm2.oct.mul(12))).s('sawtooth')
  .fmh(fm.fm2.ratio)
  .fm(fm.fm2.index.add(lfo2.mul(fm.fm2.indexMod)).mul(fmMode))
  .gain(fm.fm2.vol.mul(unmuted(muteFM)).mul(fm.fm2.gate).mul(ACCENT))
  .lpf(fm.fm2.cut).lpq(fm.fm2.res).ftype('24db').hpf(25)
  .shape(fm.fm2.shape.add(grit.mul(0.2)))
  .slide(fm.fm2.slide)
  .attack(0.005).decay(fm.fm2.decay).sustain(0.55).release(0.08)
  .pan(fm.fm2.pan)
  .delay(fm.fm2.echo.mul(fx.dub.delaySend)).delaytime(fx.dub.delayTime)
  .delayfeedback(fx.dub.delayFeedback.mul(0.4))
  .room(verb.mul(fm.fm2.room)).roomsize(verbSize)
  .orbit(7)
  .filter(audible)

// PAIR 3 · wt_ebass + FM square
$: note(RIFF).fast(wt.wt3.pace.fmap((p) => p / 16))
  .add(note(wt.wt3.oct.mul(12))).s('wt_ebass')
  .wt(lfo3.mul(wt.wt3.posDepth).add(wt.wt3.pos))
  .warp(lfo3.mul(wt.wt3.warpDepth).add(wt.wt3.warp))
  .gain(wt.wt3.vol.mul(unmuted(muteWT)).mul(wt.wt3.gate).mul(ACCENT))
  .lpf(wt.wt3.cut).lpq(wt.wt3.res).ftype('24db').hpf(30)
  .shape(wt.wt3.shape.add(grit.mul(0.15)))
  .slide(wt.wt3.slide)
  .attack(0.01).decay(wt.wt3.decay).sustain(0.6).release(0.12)
  .pan(wt.wt3.pan)
  .delay(wt.wt3.echo.mul(fx.dub.delaySend)).delaytime(fx.dub.delayTime)
  .delayfeedback(fx.dub.delayFeedback.mul(0.5))
  .room(verb.mul(wt.wt3.room)).roomsize(verbSize)
  .orbit(7)
  .filter(audible)

$: note(RIFF).fast(fm.fm3.pace.fmap((p) => p / 16))
  .add(note(fm.fm3.oct.mul(12))).s('square')
  .fmh(fm.fm3.ratio)
  .fm(fm.fm3.index.add(lfo3.mul(fm.fm3.indexMod)).mul(fmMode))
  .gain(fm.fm3.vol.mul(unmuted(muteFM)).mul(fm.fm3.gate).mul(ACCENT))
  .lpf(fm.fm3.cut).lpq(fm.fm3.res).ftype('24db').hpf(25)
  .shape(fm.fm3.shape.add(grit.mul(0.2)))
  .slide(fm.fm3.slide)
  .attack(0.005).decay(fm.fm3.decay).sustain(0.55).release(0.08)
  .pan(fm.fm3.pan)
  .delay(fm.fm3.echo.mul(fx.dub.delaySend)).delaytime(fx.dub.delayTime)
  .delayfeedback(fx.dub.delayFeedback.mul(0.4))
  .room(verb.mul(fm.fm3.room)).roomsize(verbSize)
  .orbit(7)
  .filter(audible)

// PAIR 4 · wt_raw + FM triangle
$: note(RIFF).fast(wt.wt4.pace.fmap((p) => p / 16))
  .add(note(wt.wt4.oct.mul(12))).s('wt_raw')
  .wt(lfo4.mul(wt.wt4.posDepth).add(wt.wt4.pos))
  .warp(lfo4.mul(wt.wt4.warpDepth).add(wt.wt4.warp))
  .gain(wt.wt4.vol.mul(unmuted(muteWT)).mul(wt.wt4.gate).mul(ACCENT))
  .lpf(wt.wt4.cut).lpq(wt.wt4.res).ftype('24db').hpf(30)
  .shape(wt.wt4.shape.add(grit.mul(0.15)))
  .slide(wt.wt4.slide)
  .attack(0.01).decay(wt.wt4.decay).sustain(0.6).release(0.12)
  .pan(wt.wt4.pan)
  .delay(wt.wt4.echo.mul(fx.dub.delaySend)).delaytime(fx.dub.delayTime)
  .delayfeedback(fx.dub.delayFeedback.mul(0.5))
  .room(verb.mul(wt.wt4.room)).roomsize(verbSize)
  .orbit(7)
  .filter(audible)

$: note(RIFF).fast(fm.fm4.pace.fmap((p) => p / 16))
  .add(note(fm.fm4.oct.mul(12))).s('triangle')
  .fmh(fm.fm4.ratio)
  .fm(fm.fm4.index.add(lfo4.mul(fm.fm4.indexMod)).mul(fmMode))
  .gain(fm.fm4.vol.mul(unmuted(muteFM)).mul(fm.fm4.gate).mul(ACCENT))
  .lpf(fm.fm4.cut).lpq(fm.fm4.res).ftype('24db').hpf(25)
  .shape(fm.fm4.shape.add(grit.mul(0.2)))
  .slide(fm.fm4.slide)
  .attack(0.005).decay(fm.fm4.decay).sustain(0.55).release(0.08)
  .pan(fm.fm4.pan)
  .delay(fm.fm4.echo.mul(fx.dub.delaySend)).delaytime(fx.dub.delayTime)
  .delayfeedback(fx.dub.delayFeedback.mul(0.4))
  .room(verb.mul(fm.fm4.room)).roomsize(verbSize)
  .orbit(7)
  .filter(audible)

// PAIR 5 · wt_bitreduced + FM sine
$: note(RIFF).fast(wt.wt5.pace.fmap((p) => p / 16))
  .add(note(wt.wt5.oct.mul(12))).s('wt_bitreduced')
  .wt(lfo5.mul(wt.wt5.posDepth).add(wt.wt5.pos))
  .warp(lfo5.mul(wt.wt5.warpDepth).add(wt.wt5.warp))
  .gain(wt.wt5.vol.mul(unmuted(muteWT)).mul(wt.wt5.gate).mul(ACCENT))
  .lpf(wt.wt5.cut).lpq(wt.wt5.res).ftype('24db').hpf(30)
  .shape(wt.wt5.shape.add(grit.mul(0.15)))
  .slide(wt.wt5.slide)
  .attack(0.01).decay(wt.wt5.decay).sustain(0.6).release(0.12)
  .pan(wt.wt5.pan)
  .delay(wt.wt5.echo.mul(fx.dub.delaySend)).delaytime(fx.dub.delayTime)
  .delayfeedback(fx.dub.delayFeedback.mul(0.5))
  .room(verb.mul(wt.wt5.room)).roomsize(verbSize)
  .orbit(7)
  .filter(audible)

$: note(RIFF).fast(fm.fm5.pace.fmap((p) => p / 16))
  .add(note(12)).add(note(fm.fm5.oct.mul(12))).s('sine')
  .fmh(fm.fm5.ratio)
  .fm(fm.fm5.index.add(lfo5.mul(fm.fm5.indexMod)).mul(fmMode))
  .gain(fm.fm5.vol.mul(unmuted(muteFM)).mul(fm.fm5.gate).mul(ACCENT))
  .lpf(fm.fm5.cut).lpq(fm.fm5.res).ftype('24db').hpf(25)
  .shape(fm.fm5.shape.add(grit.mul(0.2)))
  .slide(fm.fm5.slide)
  .attack(0.005).decay(fm.fm5.decay).sustain(0.55).release(0.08)
  .pan(fm.fm5.pan)
  .delay(fm.fm5.echo.mul(fx.dub.delaySend)).delaytime(fx.dub.delayTime)
  .delayfeedback(fx.dub.delayFeedback.mul(0.4))
  .room(verb.mul(fm.fm5.room)).roomsize(verbSize)
  .orbit(7)
  .filter(audible)


// ══════════════════════════════════════════════════════════════════
//  HARDCORE HATS
// ══════════════════════════════════════════════════════════════════
$: s('hh')
  .struct(hatPat)
  .gain(hats.closed.vol.mul(unmuted(muteHats)).mul(hats.closed.gate))
  .hpf(5000).lpf(hats.closed.cut)
  .shape(hats.closed.shape)
  .decay(hats.closed.decay).sustain(0)
  .pan(sine.slow(8).range(0.42, 0.58))
  .filter(audible)

$: s('oh')
  .struct(openPat)
  .gain(hats.open.vol.mul(unmuted(muteHats)).mul(hats.open.gate))
  .hpf(3500).lpf(hats.open.cut)
  .decay(hats.open.decay).sustain(0)
  .room(verb.mul(0.12)).roomsize(verbSize)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  HARDCORE KICK — ровно на каждый бит
// ══════════════════════════════════════════════════════════════════
$: s('bd')
  .struct(kickPat)
  .gain(drums.kick.vol.mul(unmuted(muteKick)).mul(drums.kick.gate))
  .duckorbit(7).duckdepth(sidechain).duckattack(0.02)
  .lpf(drums.kick.cut).lpq(1)
  .speed(drums.kick.tune)
  .shape(drums.kick.shape)
  .distort(drums.kick.dist).distortvol(0.7)
  .decay(drums.kick.decay).sustain(0).release(0.08)
  .room(verb.mul(0.05)).roomsize(verbSize)
  .filter(audible)

// тело/суб бочки: низкий слой, чтобы удар был «бум», а не «тук»
$: s('sub')
  .struct(kickPat)
  .gain(drums.kickSub.vol.mul(unmuted(muteKick)).mul(drums.kickSub.gate))
  .lpf(drums.kickSub.cut).lpq(1)
  .speed(drums.kickSub.tune)
  .shape(0.35)
  .decay(drums.kickSub.decay).sustain(0).release(0.08)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  DRONE / DIRT
// ══════════════════════════════════════════════════════════════════
$: note(PAD_A).s('triangle').unison(2).detune(drone.low.det)
  .gain(drone.low.vol.mul(hA).mul(unmuted(muteDrone)).mul(drone.low.gate))
  .lpf(drone.low.cut).hpf(30).lpq(1)
  .attack(2).decay(2).sustain(0.8).release(5)
  .room(verb.mul(drone.low.room)).roomsize(verbSize)
  .filter(audible)

$: note(PAD_B).s('triangle').unison(2).detune(drone.low.det.mul(1.3))
  .gain(drone.low.vol.mul(hB).mul(unmuted(muteDrone)).mul(drone.low.gate))
  .lpf(drone.low.cut.mul(0.85)).hpf(30).lpq(1)
  .attack(2.4).decay(2).sustain(0.8).release(6)
  .room(verb.mul(drone.low.room.mul(1.2))).roomsize(verbSize)
  .filter(audible)

$: s('crackle')
  .gain(dirt.crackle.vol.mul(dirt.crackle.gate))
  .lpf(dirt.crackle.cut).hpf(200)
  .room(verb.mul(0.3)).roomsize(verbSize)
  .filter(audible)

$: s('pink')
  .struct(airPat)
  .gain(dirt.air.vol.mul(dirt.air.gate))
  .lpf(dirt.air.cut).hpf(120)
  .decay(0.06).sustain(0)
  .room(verb.mul(0.4)).roomsize(verbSize)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ШПАРГАЛКА
// ══════════════════════════════════════════════════════════════════
//  mode:     clean / grit / fold / scream (grit/fmMode)
//  pairs:    wt1+fm1 … wt5+fm5; WT scan LFO, FM 2-op + ducking
//  wavetables: wt_dbass, wt_distorted, wt_ebass, wt_raw, wt_bitreduced
//  ручки:    WT vol/pos/warp/cut/res/shape/decay/pan/echo/room/duck
//            FM vol/ratio/index/indexMod/cut/res/shape/decay/pan/echo/room/slide
//  pace:     4…32 у каждого баса (16 = 1×, 4 = ÷4, 32 = ×2)
//  G:        muteWT / muteFM / muteDrone (цветные группы)
//  низ:      D1/F1/G1/A1/C2/D2; sub ≤80 у FM1/2
// ══════════════════════════════════════════════════════════════════
