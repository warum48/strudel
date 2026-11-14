// ══════════════════════════════════════════════════════════════════
//  BREAKCORE 01  ·  Strudel  ·  174 BPM  ·  rinse / note-off  ·  mono
//
//  Первый трек серии. Школа — RINSE: один брейк, крупная нарезка,
//  note-off на каждом хвосте, один DSP на всю колонку. Не «много нот»,
//  а «мало событий, но каждое на своём месте».
//
//  ── ЧТО ПРОЧИТАНО ВОВНЕ ─────────────────────────────────────────
//  Полный справочник: docs/breakcore/ (README → 01 → 02 → 03 → 08).
//  • rinse technique: note-off перед каждым сэмплом, одна колонка,
//    один DSP на весь брейк (renoise #29927 #1).
//  • удалённые note-off'ы = «muddy and muffled» (renoise #18985 #46).
//  • резать по 1/4–1/8, не по 16-м; 3–5 маркеров достаточно
//    (elektronauts #226901, #175570).
//  • «Warp is the groove killer» — не варпить чопы (#175570).
//  • разрежение: ≤3 элемента, одна 16-я за раз (#173927).
//  • форма: барабаны = ритм-гитара + лид-гитара, мутация каждые 4 такта
//    (idmforums #6643 #47, #44354 #6).
//
//  ── ГДЕ ЧТО ИГРАТЬ (UI) ─────────────────────────────────────────
//  mode — сцены: 0 intro / 1 groove / 2 solo / 3 return / 4 outro.
//  breakSel — какой брейк: amen / think / apache / amencutup.
//  slice — крупность нарезки: off(1) / 4 / 8 / 16 / 32.
//  grit — грязь: clean / crush / shape / both.
//  ПЭДЫ (держишь — играет, отпустил — ушло; клавиши 1–4):
//    padRoll — снейр-ролл 32-ми;
//    padFill — снейр-раш 16-ми;
//    padChop — брейк 32-мя кусками;
//    padCut  — гейт-стуттер по брейку.
//  Пэды — momentary: значение 1, пока кнопка нажата. В коде это обычные
//  слайдеры, поэтому звук и документ не расходятся.
//
//  ── 🛑 БЮДЖЕТ CPU ───────────────────────────────────────────────
//  shape/crush — worklet на КАЖДОЕ событие. Поэтому shape только у бочки
//  (4 события в такт), crush — у брейка (4–32 события) и у cut-пэда
//  (8 событий). У хэтов (16) worklet'ов нет вообще.
//
//  ── ГАРМОНИЯ ────────────────────────────────────────────────────
//  Её нет. Это осознанно: в брейккоре барабаны — главный элемент,
//  остальное фон (idmforums #6643 #1). Низ — саб на a1, фон — дрон и
//  шум без нот. Поэтому tension-проверка видит только унисон.
// ══════════════════════════════════════════════════════════════════

const BPM = 174
setcpm(BPM / 4) // один цикл = один такт 4/4 (≈ 1.379 с)

// ── СЭМПЛЫ ────────────────────────────────────────────────────────
// В node samples() нет — вызов под typeof, чтобы verify шёл без сети.
if (typeof samples === 'function') {
  samples('github:yaxu/clean-breaks/main')
  samples('github:tidalcycles/Dirt-Samples')
}

// ── ШИРИНА СЛАЙДЕРОВ + ЛЕЧЕНИЕ РАССИНХРОНА ───────────────────────
// Штатные 64px мышкой в шаг 0.01 не попасть; заплатка — docs/slider-bug.md.
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

// ── ПЕРЕКЛЮЧАТЕЛИ + ПЭДЫ ─────────────────────────────────────────
// Строка ниже — машинный маркер для панели (кнопки и их подписи).
// @switches mode=intro,groove,solo,return,outro breakSel=amen,think,apache,cut slice=off,4,8,16,32 grit=clean,crush,shape,both
// @pads padFill,padRoll,padChop,padCut
const mode = slider(1, 0, 4, 1)
const breakSel = slider(0, 0, 3, 1)
const slice = slider(2, 0, 4, 1)
const grit = slider(1, 0, 3, 1)

// momentary: 1 пока держишь, 0 в покое
const padFill = slider(0, 0, 1, 1)
const padRoll = slider(0, 0, 1, 1)
const padChop = slider(0, 0, 1, 1)
const padCut = slider(0, 0, 1, 1)

// глобальная ручка реверба (панель кладёт её в Global)
const verb = slider(0.22, 0, 1, 0.01)

// ── ГЕЙТЫ СЦЕН ────────────────────────────────────────────────────
const at = (n) => mode.fmap((v) => (v === n ? 1 : 0))
const gIntro = at(0)
const gGroove = at(1)
const gSolo = at(2)
const gReturn = at(3)
const gOutro = at(4)
// снейр-бэкбит входит только со второй сцены
const gSnare = mode.fmap((v) => (v === 0 ? 0 : 1))
// дрон и шум уходят в соло: там должны быть слышны только барабаны
const gBed = mode.fmap((v) => (v === 2 ? 0 : 1))
// второй, переставленный брейк — только groove и return
const gAlter = mode.fmap((v) => (v === 1 || v === 3 ? 1 : 0))
// в intro/outro хэты тише
const gHat = mode.fmap((v) => (v === 0 || v === 4 ? 0.5 : 1))

// ── БАНКИ ─────────────────────────────────────────────────────────
const BREAKS = ['amen', 'think', 'apache', 'amencutup']
const breakName = breakSel.fmap((v) => BREAKS[v] || BREAKS[0])
// 0 = целый луп, дальше 4/8/16/32 куска
const nSlice = slice.fmap((v) => [1, 4, 8, 16, 32][v] || 16)

const gritCrush = grit.fmap((v) => [16, 8, 4, 2][v])
const gritShape = grit.fmap((v) => [0, 0.18, 0.4, 0.55][v])

// ── ДЕРЕВО ИНСТРУМЕНТОВ ───────────────────────────────────────────
// Панель читает его напрямую: группа → инструмент → параметр.
const instruments = {
  drums: {
    name: 'Drums',
    kick: {
      name: 'Kick',
      vol: slider(0.42, 0, 0.5, 0.01),
      // 🛑 глухо по правилу проекта: верх бочки — песок, низ — вес
      cut: slider(80, 80, 320, 5),
      shape: slider(0.45, 0, 0.95, 0.01),
      tune: slider(0.9, 0.6, 1.3, 0.01),
      decay: slider(0.16, 0.05, 0.6, 0.01),
    },
    snare: {
      name: 'Snare',
      vol: slider(0.3, 0, 1, 0.01),
      cut: slider(5200, 800, 14000, 100),
      decay: slider(0.12, 0.03, 0.4, 0.01),
    },
    ghost: {
      name: 'Ghost',
      vol: slider(0.11, 0, 0.8, 0.01),
      cut: slider(4200, 800, 14000, 100),
    },
    hat: {
      name: 'Hats',
      vol: slider(0.1, 0, 0.9, 0.01),
      cut: slider(7000, 800, 16000, 100),
    },
    brk: {
      name: 'Break',
      vol: slider(0.55, 0, 1.2, 0.01),
      cut: slider(9000, 800, 16000, 100),
      hpf: slider(160, 80, 600, 10),
      // 0.62 — это и есть note-off: событие живёт 62% своего слота
      clip: slider(0.62, 0.2, 1, 0.01),
    },
    alter: {
      name: 'Break alt',
      vol: slider(0.24, 0, 1, 0.01),
      cut: slider(8000, 800, 16000, 100),
      hpf: slider(200, 80, 600, 10),
    },
    roll: {
      name: 'Roll pad',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(6000, 800, 14000, 100),
      decay: slider(0.06, 0.02, 0.3, 0.005),
    },
    fill: {
      name: 'Fill pad',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(6400, 800, 14000, 100),
    },
    chop: {
      name: 'Chop pad',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(9000, 800, 16000, 100),
    },
    cutpad: {
      name: 'Cut pad',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(7000, 800, 16000, 100),
      crush: slider(4, 1, 16, 0.5),
    },
  },
  bass: {
    name: 'Bass',
    sub: {
      name: 'Sub',
      vol: slider(0.3, 0, 0.8, 0.01),
      // правило проекта: бас не выше 80
      cut: slider(80, 60, 120, 1),
    },
  },
  atmos: {
    name: 'Atmos',
    drone: {
      name: 'Drone',
      vol: slider(0.05, 0, 0.5, 0.01),
      cut: slider(420, 120, 2000, 10),
      hpf: slider(90, 40, 400, 5),
    },
    noise: {
      name: 'Noise',
      vol: slider(0.04, 0, 0.4, 0.01),
      cut: slider(6000, 800, 16000, 100),
      hpf: slider(1800, 200, 6000, 50),
    },
  },
  fx: {
    name: 'FX',
    reverb: {
      name: 'Reverb',
      size: slider(3, 0.5, 12, 0.1),
    },
  },
}

const { drums, bass, atmos, fx } = instruments

// Ноль на ручке — не бесплатно: событие всё равно строило бы узлы.
// Поэтому каждая дорожка кончается `.filter(audible)`.
const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}

// Фразы (нужны tension-проверке; музыка здесь атональная).
const phrase = (bars) => m('<' + bars.join(' ') + '>')
// @roots a a a a
const PAD = phrase([
  '[a2] [a2] [a2] [a2]',
])

// ══════════════════════════════════════════════════════════════════
//  ДОРОЖКИ
// ══════════════════════════════════════════════════════════════════

// KICK — четыре в пол. shape один на удар: 4 события в такт, дёшево.
$: s("hardcore:4")
  .struct("x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~")
  .speed(drums.kick.tune)
  .lpf(drums.kick.cut)
  .shape(drums.kick.shape)
  .decay(drums.kick.decay).sustain(0).release(0.05)
  .gain(drums.kick.vol.mul(mode.fmap((v) => (v === 0 ? 0.75 : 1))))
  .filter(audible)

// SNARE — бэкбит на 5 и 13 (фанк-сетка, idmforums #173927 #8).
$: s("<hardcore:10 hardcore:11>")
  .struct("~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~")
  .hpf(180).lpf(drums.snare.cut)
  .decay(drums.snare.decay).sustain(0).release(0.05)
  .gain(drums.snare.vol.mul(gSnare))
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .filter(audible)

// GHOST — призраки на 7 и 11, тихо. Именно они дают «живость».
$: s("hardcore:11")
  .struct("~ ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ ~")
  .hpf(220).lpf(drums.ghost.cut)
  .decay(0.06).sustain(0).release(0.03)
  .gain(drums.ghost.vol.mul(gSnare).mul(0.7))
  .filter(audible)

// HATS — восьмые, без worklet'ов: 16 событий в такт.
$: s("hh")
  .struct("x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~")
  .hpf(5200).lpf(drums.hat.cut)
  .gain(drums.hat.vol.mul(gHat).mul("<1 .55 .8 .6>"))
  .pan(rand.mul(0.5).add(0.25))
  .filter(audible)

// BREAK — rinse-ядро. chop(n) режет брейк на n кусков и играет подряд;
// clip(0.62) обрезает хвост (note-off). Без варпа и без реверба на всё.
//
// Банк брейков — четыре отдельных блока, а не `s(switchPattern)`: в 1.2.6
// `chop` на паттерне из имён сэмплов даёт тишину (проверено verify), а на
// литерале работает. Поэтому выбор брейка — это гейт, а не подстановка.
const isBreak = (i) => breakSel.fmap((v) => (v === i ? 1 : 0))
const ALT = m('<[0 2 3 1 5 7 6 4 8 10 11 9 12 14 15 13] [0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15]>')
const breakBank = (name, i) => stack(
  s(name).chop(nSlice)
    .clip(drums.brk.clip)
    .hpf(drums.brk.hpf).lpf(drums.brk.cut)
    .crush(gritCrush)
    .gain(drums.brk.vol.mul(isBreak(i)))
    ._pianoroll({ labels: 1 }),
  s(name).slice(16, ALT)
    .clip(0.55)
    .hpf(drums.alter.hpf).lpf(drums.alter.cut)
    .gain(drums.alter.vol.mul(gAlter).mul(isBreak(i))),
).filter(audible)

// BREAK · amen — основной по умолчанию.
$: breakBank('amen', 0)
// BREAK · think — второй слой для филлов.
$: breakBank('think', 1)
// BREAK · apache — «дикий» грув.
$: breakBank('apache', 2)
// BREAK · amencutup — 32 готовых куска (не режется, а выбирается).
$: breakBank('amencutup', 3)

// SUB — моно, под кик. a1 = 55 Гц, срез 80.
$: note("<a1 a1 a1 a1>").s("sine")
  .lpf(bass.sub.cut)
  .gain(bass.sub.vol.mul(mode.fmap((v) => (v === 2 ? 1 : 0.85))))
  .filter(audible)

// DRONE — фон без нот, уходит в соло.
$: s("padlong")
  .hpf(atmos.drone.hpf).lpf(atmos.drone.cut)
  .gain(atmos.drone.vol.mul(gBed))
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .filter(audible)

// NOISE — винил/пыль, тоже фон.
$: s("crackle")
  .hpf(atmos.noise.hpf).lpf(atmos.noise.cut)
  .gain(atmos.noise.vol.mul(gBed))
  .filter(audible)

// ── ПЭДЫ ──────────────────────────────────────────────────────────

// ROLL — снейр 32-ми (8 восьмых × ply 4). Короткий decay, иначе слипнется.
$: s("hardcore:10")
  .struct("x ~ x ~ x ~ x ~")
  .ply(4)
  .hpf(260).lpf(drums.roll.cut)
  .decay(drums.roll.decay).sustain(0).release(0.02)
  .gain(drums.roll.vol.mul(padRoll).mul("<1 .7>"))
  .filter(audible)

// FILL — снейр-раш 16-ми на весь такт, с нарастанием.
$: s("hardcore:10*16")
  .hpf(240).lpf(drums.fill.cut)
  .gain(drums.fill.vol.mul(padFill).mul(saw.range(0.45, 1)))
  .filter(audible)

// CHOP — брейк 32-мя кусками. Здесь slice, а не chop: та же причина.
// worklet'ов нет, 32 события в такт проходят только lpf/hpf.
$: s(breakName)
  .slice(32, "0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31")
  .clip(0.45)
  .hpf(220).lpf(drums.chop.cut)
  .gain(drums.chop.vol.mul(padChop))
  .filter(audible)

// CUT — гейт-стуттер: 8 кусков, половина вырезана структурой.
$: s(breakName)
  .slice(8, "0 1 2 3 4 5 6 7")
  .struct("x ~ x ~ x x ~ x")
  .clip(0.5)
  .hpf(200).lpf(drums.cutpad.cut)
  .crush(drums.cutpad.crush)
  .gain(drums.cutpad.vol.mul(padCut))
  .filter(audible)
