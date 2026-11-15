// ══════════════════════════════════════════════════════════════════
//  KHMER DUB 18  ·  Strudel  ·  122 BPM  ·  dub techno + Khmer drums
//
//  Настроение — от даба. Сверху — кхмерская перкуссия. Это не
//  «кхмерский трек с дабом», а даб, в котором живёт храмовая кожа.
//
//  ── НИЗ ────────────────────────────────────────────────────────
//  Fm9 → Gbmaj9 (bII). Другие ноты, чем в 16/17 (Am/Dm).
//  @roots f f f f gb gb gb gb
//  Саб и dub-бас ≤80 Гц. Мелодии нет: только аккорды, бас и ритм.
//
//  ── СТАНДАРТНЫЙ ДАБОВЫЙ НАБОР ──────────────────────────────────
//  atmos: hiss / air / field
//  drums: kick / hat / rim / click / shaker
//  bass: sub / dub
//  chords: pad (warm/air) / stab / organ / skank / horns
//  fx: dub delay / reverb
//
//  ── 30 КХМЕРСКИХ ДРАМОВ ───────────────────────────────────────
//  skor low/high/fill ×6, sampho low/high/ghost/rim ×8,
//  chhing closed/open/roll ×6, krap ×2, kong ×6,
//  woodblock/shime ×2. Все 30 идут через общий delay + reverb.
//  У каждого свой канал в MIXER: vol / cut / clip.
//
//  ── ПРАВИЛА ──────────────────────────────────────────────────
//  • Khmer-перкуссия — только ритм/остинато. Никаких мелодий.
//  • mode: dub / strip / pressure / click — меняет только верх.
//  • harmony: warm / air — защёлка на 8 тактов.
//  • Никаких райзеров, sidechain-пумпа, snare на 2/4 и дропов.
// ══════════════════════════════════════════════════════════════════

const BPM = 122
setcpm(BPM / 4) // один цикл = один такт 4/4

// ══════════════════════════════════════════════════════════════════
//  СЭМПЛЫ
// ══════════════════════════════════════════════════════════════════
if (typeof samples === 'function') {
  samples('github:tidalcycles/uzu-drumkit')
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

// @mutes muteSkor,muteSampho,muteChhing,muteKrap,muteGong,muteWood
const muteSkor = slider(0, 0, 1, 1)
const muteSampho = slider(0, 0, 1, 1)
const muteChhing = slider(0, 0, 1, 1)
const muteKrap = slider(0, 0, 1, 1)
const muteGong = slider(0, 0, 1, 1)
const muteWood = slider(0, 0, 1, 1)

// Реверб/дилей: сильнее, чем в 16/17, но всё ещё даб, а не собор.
const verb = slider(0.75, 0, 1, 0.01)
const verbSize = slider(16, 1, 20, 0.5)
const percEcho = slider(0.28, 0, 0.8, 0.01)
const percVerb = slider(0.7, 0, 1, 0.01)

// ══════════════════════════════════════════════════════════════════
//  ИНСТРУМЕНТЫ
// ══════════════════════════════════════════════════════════════════
const instruments = {
  atmos: {
    name: 'Atmos',
    hiss: {
      name: 'Hiss',
      vol: slider(0.035, 0, 0.3, 0.01),
      cut: slider(1200, 200, 8000, 20),
      hpf: slider(80, 20, 600, 10),
    },
    air: {
      name: 'Air',
      vol: slider(0.022, 0, 0.3, 0.01),
      cut: slider(500, 100, 6000, 20),
      lfo: slider(0.6, 0, 6, 0.1),
    },
    field: {
      name: 'Field',
      vol: slider(0.028, 0, 0.3, 0.01),
      cut: slider(700, 100, 5000, 20),
    },
  },
  drums: {
    name: 'Drums',
    kick: {
      name: 'Muted kick',
      vol: slider(0.36, 0, 0.6, 0.01),
      cut: slider(270, 80, 800, 5),
      shape: slider(0.42, 0, 0.8, 0.01),
      decay: slider(0.4, 0.1, 1.2, 0.01),
    },
    hat: {
      name: 'Soft hats',
      vol: slider(0.2, 0, 0.6, 0.01),
      cut: slider(5200, 800, 12000, 50),
      decay: slider(0.22, 0.03, 0.8, 0.01),
    },
    rim: {
      name: 'Rim',
      vol: slider(0.18, 0, 0.6, 0.01),
      cut: slider(3600, 400, 12000, 50),
      echo: slider(0.25, 0, 0.8, 0.01),
    },
    click: {
      name: 'Clicks',
      vol: slider(0.08, 0, 0.5, 0.01),
      cut: slider(9000, 1000, 16000, 100),
      echo: slider(0.3, 0, 0.8, 0.01),
    },
    shaker: {
      name: 'Shaker',
      vol: slider(0.08, 0, 0.5, 0.01),
      cut: slider(6500, 800, 14000, 100),
    },
  },
  bass: {
    name: 'Bass',
    sub: {
      name: 'Sub',
      vol: slider(0.5, 0, 1.1, 0.01),
      cut: slider(70, 40, 80, 1),
      decay: slider(0.8, 0.1, 2.5, 0.01),
    },
    dub: {
      name: 'Dub bass',
      vol: slider(0.36, 0, 1, 0.01),
      cut: slider(80, 40, 80, 1),
      decay: slider(0.5, 0.1, 2, 0.01),
    },
  },
  chords: {
    name: 'Chords',
    pad: {
      name: 'Pad',
      vol: slider(0.24, 0, 0.7, 0.01),
      cut: slider(950, 80, 5000, 10),
      hpf: slider(100, 20, 600, 10),
      q: slider(1.4, 0, 20, 0.5),
      lfo: slider(0.45, 0, 6, 0.1),
      det: slider(0.08, 0, 0.4, 0.01),
    },
    stab: {
      name: 'Dub stab',
      vol: slider(0.44, 0, 0.9, 0.01),
      cut: slider(1100, 100, 6000, 10),
      res: slider(4, 0, 18, 0.5),
      decay: slider(0.3, 0.03, 1.2, 0.01),
      room: slider(0.45, 0, 1, 0.01),
    },
    organ: {
      name: 'Organ',
      vol: slider(0.16, 0, 0.7, 0.01),
      cut: slider(1600, 100, 6000, 10),
      decay: slider(0.22, 0.03, 1, 0.01),
      echo: slider(0.28, 0, 0.8, 0.01),
    },
    skank: {
      name: 'Skank',
      vol: slider(0.14, 0, 0.7, 0.01),
      cut: slider(2200, 200, 8000, 10),
      decay: slider(0.14, 0.03, 0.8, 0.01),
      echo: slider(0.3, 0, 0.8, 0.01),
    },
    horns: {
      name: 'Horns',
      vol: slider(0.12, 0, 0.7, 0.01),
      cut: slider(900, 80, 4000, 10),
      decay: slider(0.35, 0.05, 1.2, 0.01),
      echo: slider(0.32, 0, 0.8, 0.01),
    },
  },
  perc: {
    name: 'Khmer Percussion',
    skorLowA: {
      name: 'skorLow A',
      vol: slider(0.4, 0, 1, 0.01),
      cut: slider(300, 40, 16000, 10),
      clip: slider(0.7, 0.02, 4, 0.01),
    },
    skorLowB: {
      name: 'skorLow B',
      vol: slider(0.36, 0, 1, 0.01),
      cut: slider(260, 40, 16000, 10),
      clip: slider(0.8, 0.02, 4, 0.01),
    },
    skorHighA: {
      name: 'skorHigh A',
      vol: slider(0.33, 0, 1, 0.01),
      cut: slider(280, 40, 16000, 10),
      clip: slider(0.5, 0.02, 4, 0.01),
    },
    skorHighB: {
      name: 'skorHigh B',
      vol: slider(0.3, 0, 1, 0.01),
      cut: slider(240, 40, 16000, 10),
      clip: slider(0.55, 0.02, 4, 0.01),
    },
    skorFillA: {
      name: 'skorFill A',
      vol: slider(0.18, 0, 1, 0.01),
      cut: slider(1600, 40, 16000, 10),
      clip: slider(0.22, 0.02, 4, 0.01),
    },
    skorFillB: {
      name: 'skorFill B',
      vol: slider(0.16, 0, 1, 0.01),
      cut: slider(2200, 40, 16000, 10),
      clip: slider(0.18, 0.02, 4, 0.01),
    },
    samLowA: {
      name: 'samLow A',
      vol: slider(0.34, 0, 1, 0.01),
      cut: slider(520, 40, 16000, 10),
      clip: slider(0.5, 0.02, 4, 0.01),
    },
    samLowB: {
      name: 'samLow B',
      vol: slider(0.3, 0, 1, 0.01),
      cut: slider(450, 40, 16000, 10),
      clip: slider(0.55, 0.02, 4, 0.01),
    },
    samHighA: {
      name: 'samHigh A',
      vol: slider(0.28, 0, 1, 0.01),
      cut: slider(1400, 40, 16000, 10),
      clip: slider(0.3, 0.02, 4, 0.01),
    },
    samHighB: {
      name: 'samHigh B',
      vol: slider(0.26, 0, 1, 0.01),
      cut: slider(1800, 40, 16000, 10),
      clip: slider(0.26, 0.02, 4, 0.01),
    },
    samGhostA: {
      name: 'samGhost A',
      vol: slider(0.23, 0, 1, 0.01),
      cut: slider(1800, 40, 16000, 10),
      clip: slider(0.1, 0.02, 4, 0.01),
    },
    samGhostB: {
      name: 'samGhost B',
      vol: slider(0.2, 0, 1, 0.01),
      cut: slider(2400, 40, 16000, 10),
      clip: slider(0.08, 0.02, 4, 0.01),
    },
    samRimA: {
      name: 'samRim A',
      vol: slider(0.18, 0, 1, 0.01),
      cut: slider(3000, 40, 16000, 10),
      clip: slider(0.06, 0.02, 4, 0.01),
    },
    samRimB: {
      name: 'samRim B',
      vol: slider(0.17, 0, 1, 0.01),
      cut: slider(3600, 40, 16000, 10),
      clip: slider(0.05, 0.02, 4, 0.01),
    },
    chhingA: {
      name: 'chhing A',
      vol: slider(0.23, 0, 1, 0.01),
      cut: slider(9000, 40, 16000, 10),
      clip: slider(0.09, 0.02, 4, 0.01),
    },
    chhingB: {
      name: 'chhing B',
      vol: slider(0.21, 0, 1, 0.01),
      cut: slider(8000, 40, 16000, 10),
      clip: slider(0.07, 0.02, 4, 0.01),
    },
    chhingOpenA: {
      name: 'chhingOpen A',
      vol: slider(0.21, 0, 1, 0.01),
      cut: slider(7000, 40, 16000, 10),
      clip: slider(0.28, 0.02, 4, 0.01),
    },
    chhingOpenB: {
      name: 'chhingOpen B',
      vol: slider(0.2, 0, 1, 0.01),
      cut: slider(6500, 40, 16000, 10),
      clip: slider(0.32, 0.02, 4, 0.01),
    },
    chhingRollA: {
      name: 'chhingRoll A',
      vol: slider(0.11, 0, 1, 0.01),
      cut: slider(12000, 40, 16000, 10),
      clip: slider(0.05, 0.02, 4, 0.01),
    },
    chhingRollB: {
      name: 'chhingRoll B',
      vol: slider(0.1, 0, 1, 0.01),
      cut: slider(13000, 40, 16000, 10),
      clip: slider(0.04, 0.02, 4, 0.01),
    },
    krapHigh: {
      name: 'krapHigh',
      vol: slider(0.19, 0, 1, 0.01),
      cut: slider(3000, 40, 16000, 10),
      clip: slider(0.12, 0.02, 4, 0.01),
    },
    krapLow: {
      name: 'krapLow',
      vol: slider(0.17, 0, 1, 0.01),
      cut: slider(2400, 40, 16000, 10),
      clip: slider(0.14, 0.02, 4, 0.01),
    },
    gongVongA: {
      name: 'gongVong A',
      vol: slider(0.3, 0, 1, 0.01),
      cut: slider(2600, 40, 16000, 10),
      clip: slider(1.8, 0.02, 4, 0.01),
    },
    gongVongB: {
      name: 'gongVong B',
      vol: slider(0.28, 0, 1, 0.01),
      cut: slider(2200, 40, 16000, 10),
      clip: slider(2.0, 0.02, 4, 0.01),
    },
    gongThomA: {
      name: 'gongThom A',
      vol: slider(0.26, 0, 1, 0.01),
      cut: slider(400, 40, 16000, 10),
      clip: slider(3.0, 0.02, 4, 0.01),
    },
    gongThomB: {
      name: 'gongThom B',
      vol: slider(0.24, 0, 1, 0.01),
      cut: slider(350, 40, 16000, 10),
      clip: slider(3.2, 0.02, 4, 0.01),
    },
    gongAxis: {
      name: 'gong Axis',
      vol: slider(0.22, 0, 1, 0.01),
      cut: slider(380, 40, 16000, 10),
      clip: slider(2.6, 0.02, 4, 0.01),
    },
    gongHigh: {
      name: 'gongHigh',
      vol: slider(0.2, 0, 1, 0.01),
      cut: slider(1200, 40, 16000, 10),
      clip: slider(1.4, 0.02, 4, 0.01),
    },
    woodblock: {
      name: 'woodblock',
      vol: slider(0.15, 0, 1, 0.01),
      cut: slider(4500, 40, 16000, 10),
      clip: slider(0.12, 0.02, 4, 0.01),
    },
    shime: {
      name: 'shime',
      vol: slider(0.14, 0, 1, 0.01),
      cut: slider(5000, 40, 16000, 10),
      clip: slider(0.1, 0.02, 4, 0.01),
    },
  },
  fx: {
    name: 'FX',
    dub: {
      name: 'Dub delay',
      send: slider(0.55, 0, 1, 0.01),
      time: slider(0.375, 0.0625, 0.75, 0.0625),
      feedback: slider(0.55, 0, 0.85, 0.01),
    },
    reverb: {
      name: 'Reverb',
      size: slider(16, 1, 20, 0.5),
    },
  },
}

const { atmos, drums, bass, chords, perc, fx } = instruments
const MUTES = {
  skor: muteSkor,
  sampho: muteSampho,
  chhing: muteChhing,
  krap: muteKrap,
  gong: muteGong,
  wood: muteWood,
}

const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}
const unmuted = (m) => m.fmap((v) => (v ? 0 : 1))

// ══════════════════════════════════════════════════════════════════
//  ФРАЗЫ — Fm9 → Gbmaj9
// ══════════════════════════════════════════════════════════════════
const phrase = (bars) => m('<' + bars.join(' ') + '>')

// @roots f f f f gb gb gb gb
// @scenes {"intro":{"mode":0,"harmony":0},"theme":{"mode":2,"harmony":0}}

const ROOT = phrase([
  '[f1]', '[f1]', '[f1]', '[f1]',
  '[gb1]', '[gb1]', '[gb1]', '[gb1]',
])

const BASS = phrase([
  '[f1 ~ ~ c2 ~ ~ eb2 ~]',
  '[~ f1 ~ ~ ab1 ~ ~ c2]',
  '[f1 ~ ~ ~ c2 ~ eb2 ~]',
  '[~ ~ ab1 ~ ~ c2 ~ f1]',
  '[gb1 ~ ~ db2 ~ ~ bb1 ~]',
  '[~ f1 ~ ~ ab1 ~ ~ db2]',
  '[gb1 ~ ~ ~ bb1 ~ f1 ~]',
  '[~ ~ eb2 ~ ~ ab1 ~ gb1]',
])

const PAD_A = phrase([
  '[f2,ab2,c3,eb3,g4]', '[f2,ab2,c3,eb3,g4]',
  '[f2,ab2,c3,eb3,g4]', '[f2,ab2,c3,eb3,g4]',
  '[gb2,bb2,db3,ab4]', '[gb2,bb2,db3,ab4]',
  '[gb2,bb2,db3,ab4]', '[gb2,bb2,db3,ab4]',
])

const PAD_B = phrase([
  '[f3,c4,g4]', '[f3,c4,g4]',
  '[f3,c4,g4]', '[f3,c4,g4]',
  '[gb3,db4,ab4]', '[gb3,db4,ab4]',
  '[gb3,db4,ab4]', '[gb3,db4,ab4]',
])

const STAB = phrase([
  '[~ [f3,ab3,c4,eb4] ~ ~ ~ ~ ~ ~]',
  '[~ [f3,ab3,c4,eb4] ~ ~ ~ ~ ~ ~]',
  '[~ [f3,ab3,c4,eb4] ~ ~ ~ ~ ~ ~]',
  '[~ [f3,ab3,c4,eb4] ~ ~ ~ ~ ~ ~]',
  '[~ [gb3,bb3,db4,f4] ~ ~ ~ ~ ~ ~]',
  '[~ [gb3,bb3,db4,f4] ~ ~ ~ ~ ~ ~]',
  '[~ [gb3,bb3,db4,f4] ~ ~ ~ ~ ~ ~]',
  '[~ [gb3,bb3,db4,f4] ~ ~ ~ ~ ~ ~]',
])

const ORGAN = phrase([
  '[~ ~ [f3,ab3,c4] ~ ~ ~ ~ ~]',
  '[~ ~ [f3,ab3,c4] ~ ~ ~ ~ ~]',
  '[~ ~ [f3,ab3,c4] ~ ~ ~ ~ ~]',
  '[~ ~ [f3,ab3,c4] ~ ~ ~ ~ ~]',
  '[~ ~ [gb3,bb3,db4] ~ ~ ~ ~ ~]',
  '[~ ~ [gb3,bb3,db4] ~ ~ ~ ~ ~]',
  '[~ ~ [gb3,bb3,db4] ~ ~ ~ ~ ~]',
  '[~ ~ [gb3,bb3,db4] ~ ~ ~ ~ ~]',
])

const SKANK = phrase([
  '[~ ~ ~ [f4,c5,eb5] ~ ~ ~ ~]',
  '[~ ~ ~ [f4,c5,eb5] ~ ~ ~ ~]',
  '[~ ~ ~ [f4,c5,eb5] ~ ~ ~ ~]',
  '[~ ~ ~ [f4,c5,eb5] ~ ~ ~ ~]',
  '[~ ~ ~ [gb4,bb4,db5] ~ ~ ~ ~]',
  '[~ ~ ~ [gb4,bb4,db5] ~ ~ ~ ~]',
  '[~ ~ ~ [gb4,bb4,db5] ~ ~ ~ ~]',
  '[~ ~ ~ [gb4,bb4,db5] ~ ~ ~ ~]',
])

const HORNS = phrase([
  '[~ ~ ~ ~ [f3,ab3,c4] ~ ~ ~]',
  '[~ ~ ~ ~ [f3,ab3,c4] ~ ~ ~]',
  '[~ ~ ~ ~ [f3,ab3,c4] ~ ~ ~]',
  '[~ ~ ~ ~ [f3,ab3,c4] ~ ~ ~]',
  '[~ ~ ~ ~ [gb3,bb3,db4] ~ ~ ~]',
  '[~ ~ ~ ~ [gb3,bb3,db4] ~ ~ ~]',
  '[~ ~ ~ ~ [gb3,bb3,db4] ~ ~ ~]',
  '[~ ~ ~ ~ [gb3,bb3,db4] ~ ~ ~]',
])

// ══════════════════════════════════════════════════════════════════
//  АТМОСФЕРА
// ══════════════════════════════════════════════════════════════════
$: s("crackle")
  .gain(atmos.hiss.vol.mul("<1 .8 1 1 .9 1 1 .85 1 1 .9 1>"))
  .lpf(atmos.hiss.cut).hpf(atmos.hiss.hpf)
  .room(verb.mul(0.4)).roomsize(verbSize)
  .filter(audible)

$: s("pink")
  .gain(atmos.air.vol)
  .lpf(atmos.air.cut).hpf(120).lpq(0.7)
  .lpdepth(atmos.air.lfo).lpsync(0.0625).lpdc(0)
  .room(verb).roomsize(verbSize)
  .filter(audible)

$: s("wind:0")
  .loopAt(8)
  .gain(atmos.field.vol)
  .lpf(atmos.field.cut).hpf(200)
  .room(verb.mul(0.7)).roomsize(verbSize)
  .pan(sine.slow(64).range(0.3, 0.7))
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ДАБОВЫЙ НАБОР
// ══════════════════════════════════════════════════════════════════
$: s("bd*4")
  .gain(drums.kick.vol)
  .lpf(drums.kick.cut).lpq(1)
  .shape(drums.kick.shape)
  .decay(drums.kick.decay).sustain(0).release(0.08)
  .room(verb.mul(0.12)).roomsize(verbSize)
  .filter(audible)

$: stack(
     s("~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~").gain(drums.hat.vol.mul(m0)),
     s("~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~").gain(drums.hat.vol.mul(m2).mul(0.8)),
   )
  .lpf(drums.hat.cut).hpf(500)
  .decay(drums.hat.decay).sustain(0)
  .delay(fx.dub.send.mul(0.35)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback.mul(0.5))
  .room(verb.mul(0.4)).roomsize(verbSize)
  .filter(audible)

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
  .room(verb.mul(0.5)).roomsize(verbSize)
  .filter(audible)

$: s("click:0")
  .struct("~ x ~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~")
  .gain(drums.click.vol.mul(m1.add(m3)))
  .lpf(drums.click.cut).hpf(2000)
  .decay(0.03).sustain(0)
  .pan(rand.mul(1.6).sub(0.8))
  .delay(drums.click.echo.mul(fx.dub.send)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback)
  .room(verb.mul(0.5)).roomsize(verbSize)
  .filter(audible)

$: s("sh*16")
  .gain(drums.shaker.vol.mul(m2).mul(0.6))
  .lpf(drums.shaker.cut).hpf(2500)
  .decay(0.03).sustain(0)
  .pan(rand.mul(0.8).add(0.1))
  .room(verb.mul(0.3)).roomsize(verbSize)
  .filter(audible)

$: note(ROOT)
  .s("sine")
  .struct("~ x ~ ~ ~ x ~ ~")
  .gain(bass.sub.vol)
  .lpf(bass.sub.cut).lpq(1)
  .shape(0.2)
  .attack(0.01).decay(bass.sub.decay).sustain(0.6).release(0.3)
  .filter(audible)

$: note(BASS)
  .s("triangle")
  .gain(bass.dub.vol)
  .lpf(bass.dub.cut).lpq(1.2)
  .decay(bass.dub.decay).sustain(0.5).release(0.2)
  .filter(audible)

$: note(PAD_A)
  .s("sawtooth").partials([1, 0.45, 0.25, 0.1, 0.05])
  .unison(2).detune(chords.pad.det)
  .gain(chords.pad.vol.mul(hA))
  .lpf(chords.pad.cut).hpf(chords.pad.hpf).lpq(chords.pad.q).ftype("24db")
  .lpdepth(chords.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.4)
  .attack(4).decay(3).sustain(0.9).release(14)
  .room(verb).roomsize(verbSize)
  .filter(audible)

$: note(PAD_B)
  .s("triangle").partials([1, 0.3, 0.15, 0.06])
  .unison(3).detune(chords.pad.det.mul(1.4))
  .gain(chords.pad.vol.mul(hB))
  .lpf(chords.pad.cut.mul(1.2)).hpf(300).lpq(chords.pad.q.mul(0.7))
  .lpdepth(chords.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.5)
  .attack(6).decay(4).sustain(0.9).release(18)
  .room(verb).roomsize(verbSize)
  .filter(audible)

$: note(STAB)
  .s("sawtooth").unison(2).detune(0.06)
  .gain(chords.stab.vol)
  .lpf(chords.stab.cut).lpq(chords.stab.res).ftype("24db")
  .decay(chords.stab.decay).sustain(0).release(0.4)
  .delay(fx.dub.send)
  .delaytime(fx.dub.time)
  .delayfeedback(fx.dub.feedback)
  .room(chords.stab.room.mul(verb)).roomsize(verbSize)
  .filter(audible)

$: note(ORGAN)
  .s("square").unison(2).detune(0.04)
  .gain(chords.organ.vol)
  .lpf(chords.organ.cut).hpf(200).lpq(2).ftype("24db")
  .decay(chords.organ.decay).sustain(0).release(0.3)
  .delay(chords.organ.echo.mul(fx.dub.send)).delaytime(fx.dub.time)
  .delayfeedback(fx.dub.feedback.mul(0.7))
  .room(verb.mul(0.4)).roomsize(verbSize)
  .filter(audible)

$: note(SKANK)
  .s("triangle").unison(2).detune(0.05)
  .gain(chords.skank.vol)
  .lpf(chords.skank.cut).hpf(400).lpq(2)
  .decay(chords.skank.decay).sustain(0).release(0.2)
  .delay(chords.skank.echo.mul(fx.dub.send)).delaytime(fx.dub.time)
  .delayfeedback(fx.dub.feedback.mul(0.6))
  .room(verb.mul(0.35)).roomsize(verbSize)
  .filter(audible)

$: note(HORNS)
  .s("sawtooth").unison(2).detune(0.03)
  .gain(chords.horns.vol)
  .lpf(chords.horns.cut).hpf(120).lpq(1.5)
  .decay(chords.horns.decay).sustain(0).release(0.5)
  .delay(chords.horns.echo.mul(fx.dub.send)).delaytime(fx.dub.time)
  .delayfeedback(fx.dub.feedback.mul(0.6))
  .room(verb.mul(0.45)).roomsize(verbSize)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  30 KHMER DRUMS — один автобус, 30 каналов
// ══════════════════════════════════════════════════════════════════
const PERC = [
  { key: 'skorLowA', group: 'skor', s: 'east', n: '6 7 8', pat: 'x ~ ~ ~ ~ ~ x ~ x ~ ~ ~ ~ ~ x ~', speed: 0.78, pan: 0.42, hpf: 30 },
  { key: 'skorLowB', group: 'skor', s: 'east', n: '6 8 7', pat: 'x ~ ~ x ~ ~ x ~ ~ ~ x ~ x ~ x x', speed: 0.72, pan: 0.58, hpf: 30 },
  { key: 'skorHighA', group: 'skor', s: 'east', n: '3 4 5', pat: '~ ~ x ~ ~ x ~ ~ ~ ~ x ~ ~ x ~ ~', speed: 1.0, pan: 0.47, hpf: 40 },
  { key: 'skorHighB', group: 'skor', s: 'east', n: '5 4 3', pat: 'x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~', speed: 1.05, pan: 0.55, hpf: 40 },
  { key: 'skorFillA', group: 'skor', s: 'east', n: '0 2', pat: 'x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~', speed: 0.95, pan: 0.38, hpf: 60 },
  { key: 'skorFillB', group: 'skor', s: 'east', n: '1 2 0', pat: '~ ~ x ~ x ~ ~ x ~ x ~ ~ x ~ x ~', speed: 1.1, pan: 0.62, hpf: 60 },
  { key: 'samLowA', group: 'sampho', s: 'hand', n: '0 1 2 3', pat: 'x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ x', speed: 0.9, pan: 0.4, hpf: 50 },
  { key: 'samLowB', group: 'sampho', s: 'hand', n: '3 2 1 0', pat: 'x ~ ~ x ~ ~ ~ ~ x ~ ~ x ~ ~ x ~', speed: 0.85, pan: 0.6, hpf: 50 },
  { key: 'samHighA', group: 'sampho', s: 'tabla', n: '9 10 11 12', pat: '~ ~ x ~ x ~ ~ ~ x ~ ~ ~ x ~ x ~', speed: 1.0, pan: 0.45, hpf: 140 },
  { key: 'samHighB', group: 'sampho', s: 'tabla', n: '13 14 15 16', pat: '~ x ~ ~ ~ x ~ x ~ ~ x ~ ~ x ~ ~', speed: 1.05, pan: 0.58, hpf: 160 },
  { key: 'samGhostA', group: 'sampho', s: 'tabla', n: '19 20 21', pat: '~ x ~ x ~ x ~ x ~ x ~ x ~ x ~ x', speed: 1.15, pan: 0.5, hpf: 280 },
  { key: 'samGhostB', group: 'sampho', s: 'tabla', n: '22 23 24', pat: 'x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~', speed: 1.2, pan: 0.44, hpf: 300 },
  { key: 'samRimA', group: 'sampho', s: 'tabla', n: '3 4 5', pat: '~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x', speed: 1.25, pan: 0.36, hpf: 400 },
  { key: 'samRimB', group: 'sampho', s: 'tabla', n: '6 7 8', pat: 'x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~', speed: 1.3, pan: 0.64, hpf: 500 },
  { key: 'chhingA', group: 'chhing', s: 'metal', n: '0 1', pat: 'x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~', speed: 1.0, pan: 0.42, hpf: 2600 },
  { key: 'chhingB', group: 'chhing', s: 'metal', n: '2 3', pat: 'x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~', speed: 1.0, pan: 0.58, hpf: 3000 },
  { key: 'chhingOpenA', group: 'chhing', s: 'metal', n: '4 5', pat: '~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~', speed: 1.0, pan: 0.38, hpf: 2400 },
  { key: 'chhingOpenB', group: 'chhing', s: 'metal', n: '6 7', pat: '~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~', speed: 1.0, pan: 0.62, hpf: 2200 },
  { key: 'chhingRollA', group: 'chhing', s: 'metal', n: '8', pat: 'x ~ x x ~ x ~ x x ~ x ~ x x ~ x', speed: 1.0, pan: 0.5, hpf: 5000 },
  { key: 'chhingRollB', group: 'chhing', s: 'metal', n: '9', pat: '~ x x ~ x x ~ x x ~ x x ~ x x ~', speed: 1.0, pan: 0.46, hpf: 5200 },
  { key: 'krapHigh', group: 'krap', s: 'claves', note: 'c6', pat: 'x ~ ~ ~ ~ ~ x ~ x ~ ~ ~ ~ ~ x ~', speed: 1.0, pan: 0.35, hpf: 1200 },
  { key: 'krapLow', group: 'krap', s: 'claves', note: 'g6', pat: '~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~', speed: 1.0, pan: 0.65, hpf: 1000 },
  { key: 'gongVongA', group: 'gong', s: 'gong', note: 'g2', pat: '~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~', speed: 0.9, pan: 0.4, hpf: 80 },
  { key: 'gongVongB', group: 'gong', s: 'gong', note: 'c2', pat: '~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~', speed: 0.8, pan: 0.6, hpf: 60 },
  { key: 'gongThomA', group: 'gong', s: 'gong', note: 'c2', pat: 'x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~', speed: 0.7, pan: 0.5, hpf: 30 },
  { key: 'gongThomB', group: 'gong', s: 'gong', note: 'g2', pat: 'x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~', speed: 0.65, pan: 0.5, hpf: 30 },
  { key: 'gongAxis', group: 'gong', s: 'gong', note: 'gb2', pat: '~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~', speed: 0.7, pan: 0.55, hpf: 30 },
  { key: 'gongHigh', group: 'gong', s: 'gong', note: 'c3', pat: 'x ~ ~ x ~ ~ x ~ ~ ~ x ~ ~ x ~ ~', speed: 0.95, pan: 0.35, hpf: 100 },
  { key: 'woodblock', group: 'wood', s: 'tok', n: '0 1 2 3', pat: 'x ~ ~ x ~ ~ x ~ x ~ ~ x ~ ~ x ~', speed: 1.0, pan: 0.45, hpf: 800 },
  { key: 'shime', group: 'wood', s: 'chin', n: '0 1 2 3', pat: 'x ~ x ~ ~ x ~ x x ~ x ~ ~ x ~ x', speed: 1.0, pan: 0.55, hpf: 700 },
]

const percLayers = PERC.map((p) => {
  const base = p.note ? note(p.note).s(p.s) : s(p.s).n(p.n)
  return base
    .struct(m(p.pat))
    .speed(p.speed)
    .gain(perc[p.key].vol.mul(unmuted(MUTES[p.group])))
    .lpf(perc[p.key].cut).hpf(p.hpf)
    .clip(perc[p.key].clip)
    .pan(p.pan)
})

// Все 30 идут через один delay + reverb. Это дешевле и честнее,
// чем 30 отдельных хвостов: храм один, а не 30 храмов.
$: stack(...percLayers)
  .delay(percEcho)
  .delaytime(fx.dub.time)
  .delayfeedback(fx.dub.feedback.mul(0.7))
  .room(verb.mul(percVerb)).roomsize(verbSize)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ШПАРГАЛКА
// ══════════════════════════════════════════════════════════════════
//  гармония:  Fm9 → Gbmaj9 (bII), roots f f f f gb gb gb gb
//  режимы:   0 dub / 1 strip / 2 pressure / 3 click
//  гармония:  0 warm / 1 air (защёлка 8 тактов)
//  mutes:     skor · sampho · chhing · krap · gong · wood
//  перкуссия: 30 каналов, общий delay/reverb; vol/cut/clip у каждого
//  реверб:    verb 0…1, verbSize 1…20, percEcho 0…0.8, percVerb 0…1
//  даб:       fx.dub.time 0.375, feedback 0.45–0.65
//  низ:       bass.sub.cut ≤80, bass.dub.cut ≤80, kick.cut 270
//  антипоп:   без райзеров, sidechain, snare 2/4, мелодий и дропов
// ══════════════════════════════════════════════════════════════════
