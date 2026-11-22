// ══════════════════════════════════════════════════════════════════
//  KHMER DUB 18 · v5 · Strudel · 122 BPM · 144 такта
//
//  v5 собран из дампа v4: тише хэты/chhing/samRim, снята автоматика
//  hat/rim. DUB A и DUB A2 убраны — после INTRO 2 сразу STRIP.
//  RELEASE/OUT заменены на DEEP 2 (копия DEEP; открытый хэт в 2 раза реже).
//  Между DEEP и DEEP 2 вставлена копия DUB B без chhing; в OUTRO chhing тоже нет.
//
//  ── ФОРМА ────────────────────────────────────────────────────────
//  INTRO 8 → INTRO 2 8 → STRIP 8 → PRESSURE 16 → BREAK 8 →
//  DUB B 16 → DEEP 16 → DEEP 2A 16 → DEEP 2 16 → DEEP 3 16 → OUTRO 16.
//  Всего 144 такта ≈ 4:43.
//
//  DEEP 2A — копия DEEP 2, но открытый хэт играет как в DUB B.
//  DEEP 3 — копия DEEP 2 без Muted kick, Soft hats, Rim и всей кхмерской
//  перкуссии. Оба арпеджио в первой половине DEEP 3 уходят в 0 по cutoff
//  и громкости (к 120-му такту уже 0); shaker и оба баса гаснут во второй
//  половине (120→128). Click-дорожка выставлена в 0; все cut-слайдеры
//  имеют минимум 50. Dub stab продолжается в OUTRO: cutoff в 0 к 136,
//  громкость — к 144.
//
//  ── ЧТО ДОБАВЛЕНО ───────────────────────────────────────────────
//  • 11 секций; группы Khmer-перкуссии (skor/sampho/chhing)
//    включаются отдельно, поэтому секции звучат разными ансамблями.
//  • TIMELINE ведёт включённость слоёв, mode/harmony/bassVar: LOOP — ручки,
//    SONG — форма, HOLD — снимок под holdBar.
//  • 19 линий AUTOMATION; почти все — срезы (pad/stab/organ/skank/horns,
//    Moog note/arp, dub-бас, kick/hat/rim/click/shaker, hiss/air/field,
//    общий percCut). Плюс арп-бёрсты и лёгкое движение dub-feedback.
//  • Уровни инструментов постоянны; энергия — плотность, группы перкуссии
//    и срезы. Перкуссия — исключение: у каждого канала свой vol/cut/clip.
//
//  ── ПРАВИЛА ──────────────────────────────────────────────────────
//  • Khmer-перкуссия — только ритм/остинато, без мелодий.
//  • mode: dub / strip / pressure / click — меняет только верх.
//  • harmony: warm / air — укладка пэда.
//  • Никаких райзеров, sidechain-пумпа, snare 2/4 и поп-дропов.
//  • Один roomsize на все слои; общий delay/reverb для перкуссии.
//  • Низ: sub/dub по умолчанию ≤80; слайдер среза открыт до 200.
//
//  ── НАГРУЗКА ─────────────────────────────────────────────────────
//  Worklet'ов мало (shape только на кике и Moog), но 18 каналов плюс
//  длинный реверб — самая тяжёлая часть. Поэтому дефолт roomsize 12
//  (не 16), verb 0.65, percVerb 0.58, percEcho 0.22; релизы пэда и Moog
//  короче, чтобы не копить хвосты. Если всё ещё рвётся: roomsize 8–10,
//  percVerb 0.4 или G-мьют групп chhing/sampho.
// ══════════════════════════════════════════════════════════════════

const BPM = 122
setcpm(BPM / 4) // один цикл = один такт 4/4

// ══════════════════════════════════════════════════════════════════
//  СЭМПЛЫ
// ══════════════════════════════════════════════════════════════════
if (typeof samples === 'function') {
  samples('github:tidalcycles/uzu-drumkit')
  samples('github:tidalcycles/Dirt-Samples')
}

// ══════════════════════════════════════════════════════════════════
//  ШИРИНА СЛАЙДЕРОВ + СИНХРОНИЗАЦИЯ
// ══════════════════════════════════════════════════════════════════
// Штатные 64px — мышкой в шаг 0.01 не попасть. Строки только в
// одинарных кавычках: двойные транспайлер превращает в m().
const SLIDER_PX = 180
if (typeof document !== 'undefined' && !document.getElementById('slider-w')) {
  const st = document.createElement('style')
  st.id = 'slider-w'
  st.textContent = '.cm-slider input { width: ' + SLIDER_PX + 'px !important; }'
  document.head.appendChild(st)
}

// Заплатка на рассинхрон виджета слайдера в strudel.cc (docs/slider-bug.md).
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
//  UI + ПЕРЕКЛЮЧАТЕЛИ
// ══════════════════════════════════════════════════════════════════
const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
  switches: {
    mode: ['dub', 'strip', 'pressure', 'click'],
    harmony: ['warm', 'air'],
    bassVar: ['straight', 'deep'],
  },
}

const play = slider(1, 0, 2, 1) // 0 LOOP, 1 SONG, 2 HOLD
const mode = slider(0, 0, 3, 1) // dub / strip / pressure / click
const harmony = slider(0, 0, 1, 1) // warm / air
const bassVar = slider(0, 0, 1, 1) // straight / deep
const holdBar = slider(0, 0, 143, 1)

// Глобальные ручки: реверб/дилей и шина перкуссии.
const verb = slider(0.65, 0, 1, 0.01)
const percEcho = slider(0.22, 0, 0.8, 0.01)
const percVerb = slider(0.58, 0, 1, 0.01)
const percLevel = slider(1, 0, 1, 0.01)
const percCut = slider(1, 0.15, 2.5, 0.01)

// @mutes muteSkor,muteSampho,muteChhing
const muteSkor = slider(0, 0, 1, 1)
const muteSampho = slider(0, 0, 1, 1)
const muteChhing = slider(0, 0, 1, 1)

// ══════════════════════════════════════════════════════════════════
//  ИНСТРУМЕНТЫ — дерево для панели
// ══════════════════════════════════════════════════════════════════
const instruments = {
  atmos: {
    name: 'Atmos',
    hiss: {
      name: 'Hiss',
      vol: slider(0.035, 0, 0.3, 0.01),
      cut: slider(1200, 50, 8000, 20),
      hpf: slider(80, 20, 600, 10),
    },
    air: {
      name: 'Air',
      vol: slider(0.022, 0, 0.3, 0.01),
      cut: slider(500, 50, 6000, 20),
      lfo: slider(0.6, 0, 6, 0.1),
    },
    field: {
      name: 'Field',
      vol: slider(0.028, 0, 0.3, 0.01),
      cut: slider(700, 50, 5000, 20),
    },
  },
  drums: {
    name: 'Drums',
    kick: {
      name: 'Muted kick',
      vol: slider(0.36, 0, 0.6, 0.01),
      cut: slider(270, 50, 800, 5),
      shape: slider(0.42, 0, 0.8, 0.01),
      decay: slider(0.4, 0.1, 1.2, 0.01),
    },
    hat: {
      name: 'Soft hats',
      vol: slider(0.14, 0, 0.6, 0.01),
      cut: slider(5200, 50, 12000, 50),
      decay: slider(0.22, 0.03, 0.8, 0.01),
    },
    rim: {
      name: 'Rim',
      vol: slider(0.18, 0, 0.6, 0.01),
      cut: slider(3600, 50, 12000, 50),
      echo: slider(0.25, 0, 0.8, 0.01),
    },
    click: {
      name: 'Clicks',
      vol: slider(0, 0, 0.5, 0.01),
      cut: slider(9000, 50, 16000, 100),
      echo: slider(0.3, 0, 0.8, 0.01),
    },
    shaker: {
      name: 'Shaker',
      vol: slider(0.08, 0, 0.5, 0.01),
      cut: slider(6500, 50, 14000, 100),
    },
  },
  bass: {
    name: 'Bass',
    sub: {
      name: 'Sub',
      vol: slider(0.5, 0, 1.1, 0.01),
      cut: slider(70, 50, 200, 1),
      decay: slider(0.8, 0.1, 2.5, 0.01),
    },
    dub: {
      name: 'Dub bass',
      vol: slider(0.36, 0, 1, 0.01),
      cut: slider(80, 50, 200, 1),
      decay: slider(0.5, 0.1, 2, 0.01),
    },
  },
  chords: {
    name: 'Chords',
    pad: {
      name: 'Pad',
      vol: slider(0.16, 0, 0.7, 0.01),
      cut: slider(850, 50, 5000, 10),
      hpf: slider(100, 20, 600, 10),
      q: slider(1.4, 0, 20, 0.5),
      lfo: slider(0.45, 0, 6, 0.1),
      det: slider(0.08, 0, 0.4, 0.01),
    },
    stab: {
      name: 'Dub stab',
      vol: slider(0.4, 0, 0.9, 0.01),
      cut: slider(900, 50, 6000, 10),
      res: slider(4, 0, 18, 0.5),
      decay: slider(0.22, 0.03, 1.2, 0.01),
      room: slider(0.4, 0, 1, 0.01),
    },
    organ: {
      name: 'Organ',
      vol: slider(0.16, 0, 0.7, 0.01),
      cut: slider(1600, 50, 6000, 10),
      decay: slider(0.22, 0.03, 1, 0.01),
      echo: slider(0.28, 0, 0.8, 0.01),
    },
    skank: {
      name: 'Skank',
      vol: slider(0.14, 0, 0.7, 0.01),
      cut: slider(2200, 50, 8000, 10),
      decay: slider(0.14, 0.03, 0.8, 0.01),
      echo: slider(0.3, 0, 0.8, 0.01),
    },
    horns: {
      name: 'Horns',
      vol: slider(0.12, 0, 0.7, 0.01),
      cut: slider(900, 50, 4000, 10),
      decay: slider(0.35, 0.05, 1.2, 0.01),
      echo: slider(0.32, 0, 0.8, 0.01),
    },
  },
  moog: {
    name: 'Moog',
    note: {
      name: 'Moog note',
      vol: slider(0.18, 0, 0.6, 0.01),
      octave: slider(2, 0, 4, 1),
      cut: slider(780, 50, 4000, 10),
      q: slider(3.5, 0, 18, 0.5),
      det: slider(0.07, 0, 0.3, 0.01),
      attack: slider(0.35, 0.005, 1, 0.005),
      decay: slider(2.1, 0.2, 4, 0.01),
      sustain: slider(0.45, 0, 1, 0.01),
      release: slider(2.2, 0.1, 6, 0.01),
      shape: slider(0.11, 0, 0.8, 0.01),
      lfo: slider(1.2, 0, 4, 0.05),
      sync: slider(0.4375, 0.0625, 2, 0.0625),
      echo: slider(0.82, 0, 1, 0.01),
      room: slider(0.9, 0, 1, 0.01),
      slide: slider(0.14, 0, 0.3, 0.005),
    },
    arp: {
      name: 'Moog arp',
      vol: slider(0.09, 0, 0.5, 0.01),
      cut: slider(650, 50, 5000, 10),
      q: slider(4.5, 0, 18, 0.5),
      det: slider(0.05, 0, 0.3, 0.01),
      attack: slider(0.02, 0.005, 0.5, 0.005),
      decay: slider(0.3, 0.03, 1.5, 0.01),
      sustain: slider(0.12, 0, 1, 0.01),
      release: slider(1.2, 0.05, 3, 0.01),
      shape: slider(0.06, 0, 0.8, 0.01),
      lfo: slider(1.4, 0, 4, 0.05),
      sync: slider(1.3125, 0.0625, 2, 0.0625),
      echo: slider(0.78, 0, 1, 0.01),
      room: slider(0.88, 0, 1, 0.01),
      pace: slider(8, 4, 16, 1),
    },
    arp2: {
      name: 'Moog arp 2',
      vol: slider(0.07, 0, 0.5, 0.01),
      cut: slider(1200, 50, 6000, 10),
      q: slider(5, 0, 18, 0.5),
      det: slider(0.06, 0, 0.3, 0.01),
      attack: slider(0.01, 0.005, 0.3, 0.005),
      decay: slider(0.22, 0.03, 1.2, 0.01),
      sustain: slider(0.1, 0, 1, 0.01),
      release: slider(1.2, 0.05, 3, 0.01),
      shape: slider(0.08, 0, 0.8, 0.01),
      lfo: slider(1.8, 0, 4, 0.05),
      sync: slider(0.875, 0.0625, 2, 0.0625),
      echo: slider(0.82, 0, 1, 0.01),
      room: slider(0.9, 0, 1, 0.01),
      pace: slider(12, 4, 16, 1),
    },
  },
  perc: {
    name: 'Khmer Percussion',
    skorHighA: {
      name: 'skorHigh A',
      vol: slider(0.33, 0, 1, 0.01),
      cut: slider(280, 50, 16000, 10),
      clip: slider(0.5, 0.02, 4, 0.01),
      mute: 'muteSkor',
    },
    skorHighB: {
      name: 'skorHigh B',
      vol: slider(0.3, 0, 1, 0.01),
      cut: slider(240, 50, 16000, 10),
      clip: slider(0.55, 0.02, 4, 0.01),
      mute: 'muteSkor',
    },
    skorFillA: {
      name: 'skorFill A',
      vol: slider(0.18, 0, 1, 0.01),
      cut: slider(1600, 50, 16000, 10),
      clip: slider(0.22, 0.02, 4, 0.01),
      mute: 'muteSkor',
    },
    skorFillB: {
      name: 'skorFill B',
      vol: slider(0.16, 0, 1, 0.01),
      cut: slider(2200, 50, 16000, 10),
      clip: slider(0.18, 0.02, 4, 0.01),
      mute: 'muteSkor',
    },
    samLowA: {
      name: 'samLow A',
      vol: slider(0.34, 0, 1, 0.01),
      cut: slider(520, 50, 16000, 10),
      clip: slider(0.5, 0.02, 4, 0.01),
      mute: 'muteSampho',
    },
    samLowB: {
      name: 'samLow B',
      vol: slider(0.3, 0, 1, 0.01),
      cut: slider(450, 50, 16000, 10),
      clip: slider(0.55, 0.02, 4, 0.01),
      mute: 'muteSampho',
    },
    samHighA: {
      name: 'samHigh A',
      vol: slider(0.28, 0, 1, 0.01),
      cut: slider(1400, 50, 16000, 10),
      clip: slider(0.3, 0.02, 4, 0.01),
      mute: 'muteSampho',
    },
    samHighB: {
      name: 'samHigh B',
      vol: slider(0.26, 0, 1, 0.01),
      cut: slider(1800, 50, 16000, 10),
      clip: slider(0.26, 0.02, 4, 0.01),
      mute: 'muteSampho',
    },
    samGhostA: {
      name: 'samGhost A',
      vol: slider(0.23, 0, 1, 0.01),
      cut: slider(1800, 50, 16000, 10),
      clip: slider(0.1, 0.02, 4, 0.01),
      mute: 'muteSampho',
    },
    samGhostB: {
      name: 'samGhost B',
      vol: slider(0.2, 0, 1, 0.01),
      cut: slider(2400, 50, 16000, 10),
      clip: slider(0.08, 0.02, 4, 0.01),
      mute: 'muteSampho',
    },
    samRimA: {
      name: 'samRim A',
      vol: slider(0.09, 0, 1, 0.01),
      cut: slider(3000, 50, 16000, 10),
      clip: slider(0.06, 0.02, 4, 0.01),
      mute: 'muteSampho',
    },
    samRimB: {
      name: 'samRim B',
      vol: slider(0.06, 0, 1, 0.01),
      cut: slider(3600, 50, 16000, 10),
      clip: slider(0.05, 0.02, 4, 0.01),
      mute: 'muteSampho',
    },
    chhingA: {
      name: 'chhing A',
      vol: slider(0.09, 0, 1, 0.01),
      cut: slider(9000, 50, 16000, 10),
      clip: slider(0.09, 0.02, 4, 0.01),
      mute: 'muteChhing',
    },
    chhingB: {
      name: 'chhing B',
      vol: slider(0.09, 0, 1, 0.01),
      cut: slider(8000, 50, 16000, 10),
      clip: slider(0.07, 0.02, 4, 0.01),
      mute: 'muteChhing',
    },
    chhingOpenA: {
      name: 'chhingOpen A',
      vol: slider(0.07, 0, 1, 0.01),
      cut: slider(7000, 50, 16000, 10),
      clip: slider(0.28, 0.02, 4, 0.01),
      mute: 'muteChhing',
    },
    chhingOpenB: {
      name: 'chhingOpen B',
      vol: slider(0.05, 0, 1, 0.01),
      cut: slider(6500, 50, 16000, 10),
      clip: slider(0.32, 0.02, 4, 0.01),
      mute: 'muteChhing',
    },
    chhingRollA: {
      name: 'chhingRoll A',
      vol: slider(0.11, 0, 1, 0.01),
      cut: slider(12000, 50, 16000, 10),
      clip: slider(0.05, 0.02, 4, 0.01),
      mute: 'muteChhing',
    },
    chhingRollB: {
      name: 'chhingRoll B',
      vol: slider(0.1, 0, 1, 0.01),
      cut: slider(13000, 50, 16000, 10),
      clip: slider(0.04, 0.02, 4, 0.01),
      mute: 'muteChhing',
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
      size: slider(12, 1, 20, 0.5),
    },
  },
}

const { atmos, drums, bass, chords, moog, perc, fx } = instruments
const MUTES = {
  skor: muteSkor,
  sampho: muteSampho,
  chhing: muteChhing,
}
const unmuted = (m) => m.fmap((v) => (v ? 0 : 1))

// ══════════════════════════════════════════════════════════════════
//  TIMELINE — 144 такта, 12 секций
// ══════════════════════════════════════════════════════════════════
// Все 23 ключа явно в каждой секции: tlCurve несёт последнее значение
// вперёд, поэтому 0 важнее памяти. Уровни не трогаем — только включение.
const TIMELINE = [
  { at: 0,   len: 8,  name: 'INTRO',      values: { hiss: 1, air: 1, field: 1, kick: 0, hat: 0, rim: 0, click: 0, shaker: 0, sub: 0, dub: 0, pad: 1, stab: 0, organ: 0, skank: 0, horns: 0, moog: 0, arp: 0, arp2: 0, perc: 1, skor: 0, sampho: 0, chhing: 1, mode: 0, harmony: 0, bassVar: 0, hatSparse: 0, hatVar: 0 } },
  { at: 8,   len: 8,  name: 'INTRO 2',    values: { hiss: 1, air: 1, field: 1, kick: 0, hat: 0, rim: 0, click: 0, shaker: 0, sub: 0, dub: 0, pad: 1, stab: 0, organ: 0, skank: 0, horns: 0, moog: 1, arp: 0, arp2: 0, perc: 1, skor: 0, sampho: 1, chhing: 1, mode: 0, harmony: 1, bassVar: 0, hatSparse: 0, hatVar: 0 } },
  { at: 16,  len: 8,  name: 'STRIP',      values: { hiss: 1, air: 1, field: 1, kick: 1, hat: 1, rim: 1, click: 1, shaker: 0, sub: 1, dub: 1, pad: 1, stab: 0, organ: 0, skank: 0, horns: 0, moog: 1, arp: 0, arp2: 0, perc: 1, skor: 0, sampho: 1, chhing: 1, mode: 1, harmony: 1, bassVar: 0, hatSparse: 0, hatVar: 0 } },
  { at: 24,  len: 16, name: 'PRESSURE',   values: { hiss: 1, air: 1, field: 1, kick: 1, hat: 1, rim: 1, click: 0, shaker: 1, sub: 1, dub: 1, pad: 1, stab: 1, organ: 0, skank: 0, horns: 1, moog: 1, arp: 1, arp2: 0, perc: 1, skor: 1, sampho: 1, chhing: 1, mode: 2, harmony: 0, bassVar: 0, hatSparse: 0, hatVar: 0 } },
  { at: 40,  len: 8,  name: 'BREAK',      values: { hiss: 1, air: 1, field: 1, kick: 0, hat: 0, rim: 1, click: 0, shaker: 0, sub: 0, dub: 0, pad: 1, stab: 0, organ: 0, skank: 0, horns: 0, moog: 1, arp: 1, arp2: 0, perc: 1, skor: 0, sampho: 1, chhing: 1, mode: 1, harmony: 1, bassVar: 0, hatSparse: 0, hatVar: 0 } },
  { at: 48,  len: 16, name: 'DUB B',      values: { hiss: 1, air: 1, field: 1, kick: 1, hat: 1, rim: 1, click: 0, shaker: 0, sub: 1, dub: 1, pad: 1, stab: 1, organ: 1, skank: 1, horns: 1, moog: 1, arp: 1, arp2: 0, perc: 1, skor: 1, sampho: 1, chhing: 1, mode: 0, harmony: 0, bassVar: 0, hatSparse: 0, hatVar: 0 } },
  { at: 64,  len: 16, name: 'DEEP',       values: { hiss: 1, air: 1, field: 1, kick: 1, hat: 1, rim: 1, click: 0, shaker: 1, sub: 1, dub: 1, pad: 1, stab: 1, organ: 1, skank: 1, horns: 1, moog: 1, arp: 1, arp2: 1, perc: 1, skor: 1, sampho: 1, chhing: 0, mode: 2, harmony: 0, bassVar: 1, hatSparse: 0, hatVar: 0 } },
  { at: 80,  len: 16, name: 'DEEP 2A',    values: { hiss: 1, air: 1, field: 1, kick: 1, hat: 1, rim: 1, click: 0, shaker: 1, sub: 1, dub: 1, pad: 1, stab: 1, organ: 1, skank: 1, horns: 1, moog: 1, arp: 1, arp2: 1, perc: 1, skor: 1, sampho: 1, chhing: 0, mode: 2, harmony: 0, bassVar: 1, hatSparse: 0, hatVar: 1 } },
  { at: 96,  len: 16, name: 'DEEP 2',     values: { hiss: 1, air: 1, field: 1, kick: 1, hat: 1, rim: 1, click: 0, shaker: 1, sub: 1, dub: 1, pad: 1, stab: 1, organ: 1, skank: 1, horns: 1, moog: 1, arp: 1, arp2: 1, perc: 1, skor: 1, sampho: 1, chhing: 0, mode: 2, harmony: 0, bassVar: 1, hatSparse: 1, hatVar: 0 } },
  { at: 112, len: 16, name: 'DEEP 3',     values: { hiss: 1, air: 1, field: 1, kick: 0, hat: 0, rim: 0, click: 0, shaker: 1, sub: 1, dub: 1, pad: 1, stab: 1, organ: 1, skank: 1, horns: 1, moog: 1, arp: 1, arp2: 1, perc: 0, skor: 0, sampho: 0, chhing: 0, mode: 2, harmony: 0, bassVar: 1, hatSparse: 0, hatVar: 0 } },
  { at: 128, len: 16, name: 'OUTRO',      values: { hiss: 1, air: 1, field: 1, kick: 0, hat: 0, rim: 0, click: 0, shaker: 0, sub: 0, dub: 0, pad: 1, stab: 1, organ: 0, skank: 0, horns: 0, moog: 1, arp: 1, arp2: 0, perc: 1, skor: 0, sampho: 0, chhing: 0, mode: 0, harmony: 1, bassVar: 0, hatSparse: 0, hatVar: 0 } },
]

// ══════════════════════════════════════════════════════════════════
//  AUTOMATION — в основном срезы
// ══════════════════════════════════════════════════════════════════
const AUTOMATION = [
  { path: 'chords.pad.cut',    points: [[0, 0.35], [8, 0.5], [16, 0.65], [24, 1.2], [40, 0.55], [48, 0.9], [64, 1.6], [80, 1.5], [96, 1.5], [112, 1.4], [128, 0.7], [144, 0.15]] },
  { path: 'chords.stab.cut',   points: [[0, 0.4], [8, 0.6], [16, 0.7], [24, 1.4], [40, 0.5], [48, 1], [64, 2.2], [80, 2], [96, 2], [112, 1.8], [128, 2], [136, 0], [144, 0]] },
  { path: 'chords.stab.vol',   points: [[0, 1], [136, 1], [144, 0]] },
  { path: 'drums.shaker.vol',  points: [[0, 1], [120, 1], [128, 0], [144, 0]] },
  { path: 'bass.sub.vol',      points: [[0, 1], [120, 1], [128, 0], [144, 0]] },
  { path: 'bass.dub.vol',      points: [[0, 1], [120, 1], [128, 0], [144, 0]] },
  { path: 'chords.organ.cut',  points: [[0, 0.5], [8, 0.7], [16, 0.8], [24, 0.8], [40, 0.5], [48, 1], [64, 1.8], [80, 1.7], [96, 1.7], [112, 1.6], [128, 0.6], [144, 0.15]] },
  { path: 'chords.skank.cut',  points: [[0, 0.4], [8, 0.5], [16, 0.6], [24, 0.9], [40, 0.5], [48, 1], [64, 2], [80, 1.9], [96, 1.9], [112, 1.8], [128, 0.5], [144, 0.12]] },
  { path: 'chords.horns.cut',  points: [[0, 0.4], [8, 0.5], [16, 0.6], [24, 1.2], [40, 0.45], [48, 0.9], [64, 1.8], [80, 1.7], [96, 1.7], [112, 1.6], [128, 0.5], [144, 0.12]] },
  { path: 'moog.note.cut',     points: [[0, 0.5], [8, 0.6], [16, 0.7], [24, 1.3], [40, 0.9], [48, 1], [64, 1.7], [80, 1.6], [96, 1.6], [112, 1.5], [128, 0.6], [144, 0.2]] },
  { path: 'moog.arp.cut',      points: [[0, 0.4], [8, 0.5], [16, 0.6], [24, 1.25], [40, 1], [48, 0.8], [64, 2.2], [80, 2], [96, 2], [112, 2], [120, 0], [144, 0]] },
  { path: 'moog.arp.pace',     points: [[0, 1], [16, 1], [24, 1.5], [28, 2], [32, 1], [48, 1.5], [52, 2], [56, 1], [64, 2], [80, 2], [96, 2], [112, 2], [120, 1], [144, 1]] },
  { path: 'moog.arp.vol',      points: [[0, 1], [112, 1], [120, 0], [144, 0]] },
  { path: 'moog.arp2.cut',     points: [[0, 0.4], [48, 0.6], [64, 2.2], [80, 2], [96, 2], [112, 2], [120, 0], [144, 0]] },
  { path: 'moog.arp2.vol',     points: [[0, 1], [112, 1], [120, 0], [144, 0]] },
  { path: 'bass.dub.cut',      points: [[0, 0.7], [16, 0.9], [24, 1], [40, 0.85], [48, 1], [64, 1], [80, 1], [96, 1], [112, 1], [128, 0.85], [144, 0.5]] },
  { path: 'drums.kick.cut',    points: [[0, 0.9], [16, 1], [24, 1.1], [40, 0.9], [64, 1.15], [80, 1.1], [96, 1.1], [112, 1], [128, 1], [144, 0.4]] },
  { path: 'drums.click.cut',   points: [[0, 0.5], [24, 1.3], [40, 0.9], [64, 1.2], [80, 1.1], [96, 1.1], [112, 1], [128, 0.6], [144, 0.15]] },
  { path: 'drums.shaker.cut',  points: [[0, 0.4], [24, 1], [40, 0.7], [64, 1.3], [80, 1.2], [96, 1.2], [112, 1.2], [128, 0.6], [144, 0.15]] },
  { path: 'atmos.hiss.cut',    points: [[0, 0.7], [16, 1], [24, 1.2], [40, 0.9], [64, 1.1], [80, 1.1], [96, 1.1], [112, 1.1], [128, 1], [144, 0.3]] },
  { path: 'atmos.air.cut',     points: [[0, 0.6], [8, 0.8], [16, 0.9], [24, 1.15], [40, 1.2], [48, 1], [64, 1.25], [80, 1.2], [96, 1.2], [112, 1.2], [128, 0.9], [144, 0.3]] },
  { path: 'atmos.field.cut',   points: [[0, 0.5], [8, 0.7], [16, 0.9], [24, 1.2], [40, 1], [48, 1], [64, 1.3], [80, 1.2], [96, 1.2], [112, 1.2], [128, 0.9], [144, 0.2]] },
  { path: 'percCut',           points: [[0, 0.35], [8, 0.6], [16, 0.9], [24, 1.4], [40, 0.8], [48, 1], [64, 1.5], [80, 1.4], [96, 1.4], [112, 1.4], [128, 1], [144, 0.2]] },
  { path: 'fx.dub.feedback',   points: [[0, 0.8], [16, 1], [24, 1.2], [40, 1], [64, 1.1], [80, 1.1], [96, 1.1], [112, 1.1], [128, 1], [144, 0.6]] },
]

const TL_TOTAL = Math.max(...TIMELINE.map((s) => s.at + s.len))

const autoCurve = (path) => {
  const lane = AUTOMATION.find((a) => a.path === path)
  const pts = lane?.points || []
  if (!pts.length) return pure(1)
  const segs = []
  let pos = 0
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, va] = pts[i]
    const [b, vb] = pts[i + 1]
    if (a > pos) segs.push([a - pos, pure(1)])
    if (b > a) segs.push([b - a, va === vb ? pure(va) : saw.range(va, vb).slow(b - a)])
    pos = b
  }
  if (pos < TL_TOTAL) segs.push([TL_TOTAL - pos, pure(pts[pts.length - 1][1])])
  return arrange(...segs)
}

const tlCurve = (key) => {
  let last = 0
  const segs = []
  for (let i = 0; i < TIMELINE.length; i++) {
    const sec = TIMELINE[i]
    if (Object.prototype.hasOwnProperty.call(sec.values, key)) last = sec.values[key]
    const next = i + 1 < TIMELINE.length ? TIMELINE[i + 1].at : TL_TOTAL
    if (next - sec.at > 0) segs.push([next - sec.at, pure(last)])
  }
  return arrange(...segs)
}

const state = play.fmap((v) => Math.round(v))
const songGate = state.fmap((v) => (v === 1 ? 1 : 0))
const loopGate = state.fmap((v) => (v === 0 ? 1 : 0))
const holdGate = state.fmap((v) => (v === 2 ? 1 : 0))
const sectionAt = (bar) => {
  for (let i = 0; i < TIMELINE.length; i++) {
    if (bar < TIMELINE[i].at + TIMELINE[i].len) return i
  }
  return TIMELINE.length - 1
}
const holdIndex = holdBar.fmap((bar) => sectionAt(Math.max(0, Math.round(bar))))
const sectionValue = (key) => holdIndex.pick(TIMELINE.map((sec) => pure(sec.values[key] ?? 0)))
const tlOr = (key, loopLevel = pure(1)) => {
  const base = tlCurve(key).mul(songGate).add(loopLevel.mul(loopGate))
  return base.add(sectionValue(key).mul(holdGate))
}
const autoSwitch = (key, knob) =>
  tlCurve(key).mul(songGate).add(knob.mul(loopGate)).add(sectionValue(key).mul(holdGate))
const modeAuto = autoSwitch('mode', mode)
const harmonyAuto = autoSwitch('harmony', harmony)
const bassAuto = autoSwitch('bassVar', bassVar)
const hA = harmonyAuto.fmap((v) => (v === 0 ? 1 : 0))
const hB = harmonyAuto.fmap((v) => (v === 1 ? 1 : 0))

const autoValueAt = (path, bar) => {
  const pts = AUTOMATION.find((a) => a.path === path)?.points || []
  if (!pts.length) return 1
  if (bar < pts[0][0]) return 1
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, va] = pts[i]
    const [b, vb] = pts[i + 1]
    if (bar <= b) return a === b ? vb : va + ((vb - va) * (bar - a)) / (b - a)
  }
  return pts[pts.length - 1][1]
}
const autoAt = (path) =>
  autoCurve(path).mul(songGate).add(loopGate)
    .add(holdBar.fmap((b) => autoValueAt(path, b)).mul(holdGate))

const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}
const gateOf = (key, loopLevel = pure(1)) => tlOr(key, loopLevel).fmap((v) => v > 0.001)
const phrase = (bars) => m('<' + bars.join(' ') + '>')

// ══════════════════════════════════════════════════════════════════
//  ФРАЗЫ — Fm9 → Abmaj9 → Dbmaj9 → Gbmaj9
// ══════════════════════════════════════════════════════════════════
// @roots f f ab ab db db gb gb

const ROOT = phrase([
  '[f1]', '[f1]', '[ab1]', '[ab1]',
  '[db2]', '[db2]', '[gb1]', '[gb1]',
])

const BASS = phrase([
  '[f1 ~ ~ c2 ~ ~ eb2 ~]',
  '[~ f1 ~ ~ ab1 ~ ~ c2]',
  '[ab1 ~ ~ c2 ~ ~ eb2 ~]',
  '[~ ab1 ~ ~ c2 ~ eb2 ~]',
  '[db2 ~ ~ ab1 ~ ~ f1 ~]',
  '[~ db2 ~ ~ ab1 ~ ~ bb1]',
  '[gb1 ~ ~ db2 ~ ~ bb1 ~]',
  '[~ gb1 ~ ~ db2 ~ ~ f1]',
])

// BASS_VAR — deep variant: same roots, more rests and a different contour.
const BASS_VAR = phrase([
  '[f1 ~ ~ c2 ~ ~ eb2 ~]',
  '[~ f1 ~ ~ ab1 ~ c2 ~]',
  '[ab1 ~ ~ eb2 ~ c2 ~ ~]',
  '[~ ab1 ~ ~ c2 ~ eb2 ~]',
  '[db2 ~ ~ ab1 ~ ~ f1 ~]',
  '[~ db2 ~ ~ ab1 ~ ~ bb1]',
  '[gb1 ~ ~ db2 ~ ~ bb1 ~]',
  '[~ gb1 ~ ~ db2 ~ f1 ~]',
])

const bassLine = bassAuto.pick([BASS, BASS_VAR])

const PAD_A = phrase([
  '[f2,ab2,c3,eb3,g4]', '[f2,ab2,c3,eb3,g4]',
  '[ab2,c3,eb3,g4,bb3]', '[ab2,c3,eb3,g4,bb3]',
  '[db3,f3,ab3,c4,eb5]', '[db3,f3,ab3,c4,eb5]',
  '[gb2,bb2,db3,f4,ab4]', '[gb2,bb2,db3,f4,ab4]',
])

const PAD_B = phrase([
  '[f3,c4,g4]', '[f3,c4,g4]',
  '[ab3,eb4,bb3]', '[ab3,eb4,bb3]',
  '[db4,ab4,eb5]', '[db4,ab4,eb5]',
  '[gb3,db4,ab4]', '[gb3,db4,ab4]',
])

const STAB = phrase([
  '[~ [f3,ab3,c4,eb4] ~ ~ ~ ~ ~ ~]',
  '[~ [f3,ab3,c4,eb4] ~ ~ ~ ~ ~ ~]',
  '[~ [ab3,c4,eb4,g4] ~ ~ ~ ~ ~ ~]',
  '[~ [ab3,c4,eb4,g4] ~ ~ ~ ~ ~ ~]',
  '[~ [db3,f3,ab3,eb4] ~ ~ ~ ~ ~ ~]',
  '[~ [db3,f3,ab3,eb4] ~ ~ ~ ~ ~ ~]',
  '[~ [gb3,bb3,db4,f4] ~ ~ ~ ~ ~ ~]',
  '[~ [gb3,bb3,db4,f4] ~ ~ ~ ~ ~ ~]',
])

const ORGAN = phrase([
  '[~ ~ [f3,ab3,c4] ~ ~ ~ ~ ~]',
  '[~ ~ [f3,ab3,c4] ~ ~ ~ ~ ~]',
  '[~ ~ [ab3,c4,eb4] ~ ~ ~ ~ ~]',
  '[~ ~ [ab3,c4,eb4] ~ ~ ~ ~ ~]',
  '[~ ~ [db3,f3,ab3] ~ ~ ~ ~ ~]',
  '[~ ~ [db3,f3,ab3] ~ ~ ~ ~ ~]',
  '[~ ~ [gb3,bb3,db4] ~ ~ ~ ~ ~]',
  '[~ ~ [gb3,bb3,db4] ~ ~ ~ ~ ~]',
])

const SKANK = phrase([
  '[~ ~ ~ [f4,c5,eb5] ~ ~ ~ ~]',
  '[~ ~ ~ [f4,c5,eb5] ~ ~ ~ ~]',
  '[~ ~ ~ [ab5,c5,eb5] ~ ~ ~ ~]',
  '[~ ~ ~ [ab5,c5,eb5] ~ ~ ~ ~]',
  '[~ ~ ~ [db5,f4,ab4] ~ ~ ~ ~]',
  '[~ ~ ~ [db5,f4,ab4] ~ ~ ~ ~]',
  '[~ ~ ~ [gb5,bb4,db5] ~ ~ ~ ~]',
  '[~ ~ ~ [gb5,bb4,db5] ~ ~ ~ ~]',
])

const HORNS = phrase([
  '[~ ~ ~ ~ [f3,ab3,c4] ~ ~ ~]',
  '[~ ~ ~ ~ [f3,ab3,c4] ~ ~ ~]',
  '[~ ~ ~ ~ [ab3,c4,eb4] ~ ~ ~]',
  '[~ ~ ~ ~ [ab3,c4,eb4] ~ ~ ~]',
  '[~ ~ ~ ~ [db3,f3,ab3] ~ ~ ~]',
  '[~ ~ ~ ~ [db3,f3,ab3] ~ ~ ~]',
  '[~ ~ ~ ~ [gb3,bb3,db4] ~ ~ ~]',
  '[~ ~ ~ ~ [gb3,bb3,db4] ~ ~ ~]',
])

const MOOG = phrase([
  '[~ ~ ~ ~ ~ ~ ~ c4]',
  '[~ ~ ~ ~ ~ ~ ~ eb4]',
  '[~ ~ ~ ~ ~ ~ ~ g4]',
  '[~ ~ ~ ~ ~ ~ ~ bb4]',
  '[~ ~ ~ ~ ~ ~ ~ f4]',
  '[~ ~ ~ ~ ~ ~ ~ ab4]',
  '[~ ~ ~ ~ ~ ~ ~ db5]',
  '[~ ~ ~ ~ ~ ~ ~ bb4]',
])

const MOOG_ARP_CHORDS = phrase([
  '[f4,c5,eb5]', '[f4,c5,eb5]',
  '[ab5,c5,eb5]', '[ab5,c5,eb5]',
  '[db5,f4,ab4]', '[db5,f4,ab4]',
  '[gb5,bb4,db5]', '[gb5,bb4,db5]',
])

// ══════════════════════════════════════════════════════════════════
//  РИТМЫ — верх меняется по mode
// ══════════════════════════════════════════════════════════════════
const hats = [
  m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
  m('~ x ~ ~ x ~ ~ ~ ~ x ~ ~ x ~ ~ ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
]
const rims = [
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
  m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'),
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
  m('~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~'),
]
const clicks = [
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
  m('~ x ~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
  m('~ x ~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~'),
]
const shakers = [
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
  m('x*16'),
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
]
const hatPat = modeAuto.pick(hats)
// DEEP 2A uses the DUB B open-hat figure; DEEP 2 uses only its 2nd/4th hits.
const hatPatSparse = m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~')
const hatBase = tlOr('hatVar', pure(0)).pick([hatPat, hats[0]])
const hatLine = tlOr('hatSparse', pure(0)).pick([hatBase, hatPatSparse])
const rimPat = modeAuto.pick(rims)
const clickPat = modeAuto.pick(clicks)
const shakerPat = modeAuto.pick(shakers)

// ══════════════════════════════════════════════════════════════════
//  18 KHMER DRUMS — один автобус, 18 каналов
// ══════════════════════════════════════════════════════════════════
const PERC = [
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
]

// ══════════════════════════════════════════════════════════════════
//  АТМОСФЕРА
// ══════════════════════════════════════════════════════════════════
$: s('crackle')
  .gain(atmos.hiss.vol.mul(tlOr('hiss')).mul(m('<1 .8 1 1 .9 1 1 .85 1 1 .9 1>')))
  .lpf(atmos.hiss.cut.mul(autoAt('atmos.hiss.cut'))).hpf(atmos.hiss.hpf)
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .mask(gateOf('hiss')).filter(audible)

$: s('pink')
  .gain(atmos.air.vol.mul(tlOr('air')))
  .lpf(atmos.air.cut.mul(autoAt('atmos.air.cut'))).hpf(120).lpq(0.7)
  .lpdepth(atmos.air.lfo).lpsync(0.0625).lpdc(0)
  .room(verb).roomsize(fx.reverb.size)
  .mask(gateOf('air')).filter(audible)

$: s('brown')
  .gain(atmos.field.vol.mul(tlOr('field')))
  .lpf(atmos.field.cut.mul(autoAt('atmos.field.cut'))).hpf(200)
  .room(verb.mul(0.7)).roomsize(fx.reverb.size)
  .pan(sine.slow(64).range(0.3, 0.7))
  .mask(gateOf('field')).filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ДАБОВЫЙ НАБОР
// ══════════════════════════════════════════════════════════════════
$: s(m('bd*4'))
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .lpf(drums.kick.cut.mul(autoAt('drums.kick.cut'))).lpq(1)
  .shape(drums.kick.shape)
  .decay(drums.kick.decay).sustain(0).release(0.08)
  .room(verb.mul(0.12)).roomsize(fx.reverb.size)
  .mask(gateOf('kick')).filter(audible)

$: s('oh')
  .struct(hatLine)
  .gain(drums.hat.vol.mul(tlOr('hat')).mul(m('<1 .75 .9 .65>')))
  .lpf(drums.hat.cut.mul(autoAt('drums.hat.cut'))).hpf(500)
  .decay(drums.hat.decay).sustain(0)
  .delay(fx.dub.send.mul(0.35)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback.mul(0.5))
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .mask(gateOf('hat')).filter(audible)

$: s('rim')
  .struct(rimPat)
  .gain(drums.rim.vol.mul(tlOr('rim')))
  .lpf(drums.rim.cut.mul(autoAt('drums.rim.cut'))).hpf(500).lpq(2)
  .decay(0.06).sustain(0)
  .pan(rand.range(-0.6, 0.6))
  .delay(drums.rim.echo.mul(fx.dub.send)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback.mul(0.6))
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('rim')).filter(audible)

$: s('white')
  .struct(clickPat)
  .gain(drums.click.vol.mul(tlOr('click')))
  .lpf(drums.click.cut.mul(autoAt('drums.click.cut'))).hpf(2000)
  .decay(0.03).sustain(0)
  .pan(rand.range(-0.8, 0.8))
  .delay(drums.click.echo.mul(fx.dub.send)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('click')).filter(audible)

$: s('sh')
  .struct(shakerPat)
  .gain(drums.shaker.vol.mul(tlOr('shaker')).mul(0.6).mul(autoAt('drums.shaker.vol')))
  .lpf(drums.shaker.cut.mul(autoAt('drums.shaker.cut'))).hpf(2500)
  .decay(0.03).sustain(0)
  .pan(rand.mul(0.8).add(0.1))
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .mask(gateOf('shaker')).filter(audible)

$: note(ROOT)
  .s('sine')
  .struct(m('~ x ~ ~ ~ x ~ ~'))
  .gain(bass.sub.vol.mul(tlOr('sub')).mul(autoAt('bass.sub.vol')))
  .lpf(bass.sub.cut).lpq(1)
  .shape(0.2)
  .attack(0.01).decay(bass.sub.decay).sustain(0.6).release(0.3)
  .mask(gateOf('sub')).filter(audible)

$: note(bassLine)
  .s('triangle')
  .gain(bass.dub.vol.mul(tlOr('dub')).mul(autoAt('bass.dub.vol')))
  .lpf(bass.dub.cut.mul(autoAt('bass.dub.cut'))).lpq(1.2)
  .decay(bass.dub.decay).sustain(0.5).release(0.2)
  .mask(gateOf('dub')).filter(audible)

$: note(PAD_A)
  .s('sawtooth').partials([1, 0.45, 0.25, 0.1, 0.05])
  .unison(2).detune(chords.pad.det)
  .gain(chords.pad.vol.mul(tlOr('pad')).mul(hA))
  .lpf(chords.pad.cut.mul(autoAt('chords.pad.cut'))).hpf(chords.pad.hpf).lpq(chords.pad.q).ftype('24db')
  .lpdepth(chords.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.4)
  .attack(1.2).decay(1.6).sustain(0.35).release(2.5)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('pad').mul(hA).fmap((v) => v > 0.001)).filter(audible)

$: note(PAD_B)
  .s('triangle').partials([1, 0.3, 0.15, 0.06])
  .unison(3).detune(chords.pad.det.mul(1.4))
  .gain(chords.pad.vol.mul(tlOr('pad')).mul(hB))
  .lpf(chords.pad.cut.mul(1.2).mul(autoAt('chords.pad.cut'))).hpf(300).lpq(chords.pad.q.mul(0.7))
  .lpdepth(chords.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.5)
  .attack(2).decay(2).sustain(0.3).release(3.5)
  .room(verb.mul(0.55)).roomsize(fx.reverb.size)
  .mask(gateOf('pad').mul(hB).fmap((v) => v > 0.001)).filter(audible)

$: note(STAB)
  .s('sawtooth').unison(2).detune(0.06)
  .gain(chords.stab.vol.mul(tlOr('stab')).mul(autoAt('chords.stab.vol')))
  .lpf(chords.stab.cut.mul(autoAt('chords.stab.cut'))).lpq(chords.stab.res).ftype('24db')
  .decay(chords.stab.decay).sustain(0).release(0.4)
  .delay(fx.dub.send)
  .delaytime(fx.dub.time)
  .delayfeedback(fx.dub.feedback.mul(autoAt('fx.dub.feedback')))
  .room(chords.stab.room.mul(verb)).roomsize(fx.reverb.size)
  .mask(gateOf('stab')).filter(audible)

$: note(ORGAN)
  .s('square').unison(2).detune(0.04)
  .gain(chords.organ.vol.mul(tlOr('organ')))
  .lpf(chords.organ.cut.mul(autoAt('chords.organ.cut'))).hpf(200).lpq(2).ftype('24db')
  .decay(chords.organ.decay).sustain(0).release(0.3)
  .delay(chords.organ.echo.mul(fx.dub.send)).delaytime(fx.dub.time)
  .delayfeedback(fx.dub.feedback.mul(0.7))
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .mask(gateOf('organ')).filter(audible)

$: note(SKANK)
  .s('triangle').unison(2).detune(0.05)
  .gain(chords.skank.vol.mul(tlOr('skank')))
  .lpf(chords.skank.cut.mul(autoAt('chords.skank.cut'))).hpf(400).lpq(2)
  .decay(chords.skank.decay).sustain(0).release(0.2)
  .delay(chords.skank.echo.mul(fx.dub.send)).delaytime(fx.dub.time)
  .delayfeedback(fx.dub.feedback.mul(0.6))
  .room(verb.mul(0.35)).roomsize(fx.reverb.size)
  .mask(gateOf('skank')).filter(audible)

$: note(HORNS)
  .s('sawtooth').unison(2).detune(0.03)
  .gain(chords.horns.vol.mul(tlOr('horns')))
  .lpf(chords.horns.cut.mul(autoAt('chords.horns.cut'))).hpf(120).lpq(1.5)
  .decay(chords.horns.decay).sustain(0).release(0.5)
  .delay(chords.horns.echo.mul(fx.dub.send)).delaytime(fx.dub.time)
  .delayfeedback(fx.dub.feedback.mul(0.6))
  .room(verb.mul(0.45)).roomsize(fx.reverb.size)
  .mask(gateOf('horns')).filter(audible)

// ══════════════════════════════════════════════════════════════════
//  MOOG — редкая нота и арпеджио
// ══════════════════════════════════════════════════════════════════
$: note(MOOG)
  .withValue((v) => (o) => ({ ...v, note: midi2note(noteToMidi(v.note) + o * 12) }))
  .appLeft(moog.note.octave.sub(2))
  .s('sawtooth').unison(2).detune(moog.note.det)
  .gain(moog.note.vol.mul(tlOr('moog')))
  .lpf(moog.note.cut.mul(autoAt('moog.note.cut'))).hpf(180).lpq(moog.note.q).ftype('24db')
  .lpdepth(moog.note.lfo).lpsync(moog.note.sync).lpdc(0)
  .shape(moog.note.shape)
  .slide(moog.note.slide)
  .attack(moog.note.attack).decay(moog.note.decay)
  .sustain(moog.note.sustain).release(moog.note.release)
  .delay(fx.dub.send.mul(moog.note.echo)).delaytime(fx.dub.time)
  .delayfeedback(fx.dub.feedback)
  .room(verb.mul(moog.note.room)).roomsize(fx.reverb.size)
  .mask(gateOf('moog')).filter(audible)

$: note(MOOG_ARP_CHORDS)
  .arp(run(moog.arp.pace.mul(autoAt('moog.arp.pace'))))
  .s('sawtooth').unison(2).detune(moog.arp.det)
  .gain(moog.arp.vol.mul(tlOr('arp')).mul(autoAt('moog.arp.vol')))
  .lpf(moog.arp.cut.mul(autoAt('moog.arp.cut'))).hpf(300).lpq(moog.arp.q).ftype('24db')
  .lpdepth(moog.arp.lfo).lpsync(moog.arp.sync).lpdc(0)
  .shape(moog.arp.shape)
  .attack(moog.arp.attack).decay(moog.arp.decay)
  .sustain(moog.arp.sustain).release(moog.arp.release)
  .delay(fx.dub.send.mul(moog.arp.echo)).delaytime(fx.dub.time)
  .delayfeedback(fx.dub.feedback.mul(0.7))
  .room(verb.mul(moog.arp.room)).roomsize(fx.reverb.size)
  .mask(gateOf('arp')).filter(audible)

// ARP2 — octave-up Moog arp, only in DEEP; more saturated and open.
$: note(MOOG_ARP_CHORDS)
  .add(note(12))
  .arp(run(moog.arp2.pace))
  .s('sawtooth').unison(2).detune(moog.arp2.det)
  .gain(moog.arp2.vol.mul(tlOr('arp2', pure(0))).mul(autoAt('moog.arp2.vol')))
  .lpf(moog.arp2.cut.mul(autoAt('moog.arp2.cut'))).hpf(400).lpq(moog.arp2.q).ftype('24db')
  .lpdepth(moog.arp2.lfo).lpsync(moog.arp2.sync).lpdc(0)
  .shape(moog.arp2.shape)
  .attack(moog.arp2.attack).decay(moog.arp2.decay)
  .sustain(moog.arp2.sustain).release(moog.arp2.release)
  .delay(fx.dub.send.mul(moog.arp2.echo)).delaytime(fx.dub.time)
  .delayfeedback(fx.dub.feedback.mul(0.65))
  .room(verb.mul(moog.arp2.room)).roomsize(fx.reverb.size)
  .mask(gateOf('arp2', pure(0))).filter(audible)

// ══════════════════════════════════════════════════════════════════
//  18 KHMER DRUMS — общий delay/reverb, группы по секциям
// ══════════════════════════════════════════════════════════════════
const percLayers = PERC.map((p) => {
  const gate = tlOr('perc').mul(tlOr(p.group)).fmap((v) => v > 0.001)
  return s(p.s).n(m(p.n))
    .struct(m(p.pat))
    .speed(p.speed)
    .gain(perc[p.key].vol.mul(unmuted(MUTES[p.group])).mul(percLevel).mul(tlOr('perc')).mul(tlOr(p.group)))
    .lpf(perc[p.key].cut.mul(percCut).mul(autoAt('percCut'))).hpf(p.hpf)
    .clip(perc[p.key].clip)
    .pan(p.pan)
    .mask(gate)
})

$: stack(...percLayers)
  .delay(percEcho)
  .delaytime(fx.dub.time)
  .delayfeedback(fx.dub.feedback.mul(0.7))
  .room(verb.mul(percVerb)).roomsize(fx.reverb.size)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  ШПАРГАЛКА
// ══════════════════════════════════════════════════════════════════
//  транспорт: play 0 LOOP / 1 SONG / 2 HOLD, holdBar — такт для HOLD
//  режимы:    mode 0 dub / 1 strip / 2 pressure / 3 click
//  гармония:  harmony 0 warm / 1 air
//  mutes:     skor · sampho · chhing
//  низ:       sub ≤80 + dub ≤80; kick.cut 270
//  перкуссия: 18 каналов, группы skor/sampho/chhing включаются секциями
//  реверб:    один fx.reverb.size на все слои
//  автоматика: почти всё — срезы; арп-бёрсты на moog.arp.pace
// ══════════════════════════════════════════════════════════════════
