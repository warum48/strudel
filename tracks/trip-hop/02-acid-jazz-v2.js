// ══════════════════════════════════════════════════════════════════
//  TRIP-HOP 02 · ACID JAZZ BREAKS v2 · Strudel · 82 BPM
//
//  Версия 01, развёрнутая в композицию. Не «луп на 8 тактов», а форма:
//  INTRO → BUILD A → BUILD B → BREAK A → BREAK B → RETURN →
//  CLIMAX A → CLIMAX B → DECAY → OUTRO A → OUTRO B. 96 тактов.
//  Плотность, срезы, дилей и дакинг ведёт TIMELINE внизу; слайдеры
//  остаются hot-ручками поверх.
//
//  ── ЧТО ВЗЯТО ИЗ ПРАКТИКИ ────────────────────────────────────────
//  • Trip-hop: 82 BPM (60–90), тяжёлый шаффл на 16-х, «два снейра»
//    (sd + rim), грязный верх и моно-комната на снейре, spot-FX раз в
//    8 тактов, глубокий бас с паузами. (MusicRadar, Plugg Supply)
//  • Portishead: запись → «винил» → ресемпл; тёмный верх, низ полный,
//    сдержанность, Rhodes и кинематографичные слои. (Siesta Audio)
//  • Acid jazz: грув важнее соло-виртуозности; кварты, 9/11/13,
//    «hip hop tuning» — слои чуть расстроены, но не фальшивы.
//    (Wikipedia/AllMusic, mDecks/VoicingLab про кварты и верхние структуры)
//
//  ── СОЛО · ТРИ СОСТОЯНИЯ ────────────────────────────────────────
//  LEAD_A — абстрактные искры: короткие обрывки и вариации на тему
//  (INTRO/BUILD/DECAY/OUTRO). LEAD_B — плавнее и насыщеннее, длинные
//  связки, без узнаваемого ритма (BREAK A/B). LEAD_C — главная тема
//  («припев») только в RETURN и CLIMAX: это изюминка, не основа.
//  Вибрафон отвечает в паузах; в кульминации тема дублируется октавой
//  выше 32-ми (`spark`).
//
//  ── LOOP / SONG ──────────────────────────────────────────────────
//  song=LOOP — TIMELINE не идёт: ровный луп на реальных громкостях,
//  состояния переключаются ручками lead/drum/vibes (и mode/harmony).
//  song=SONG — идёт форма; TIMELINE сам переключает те же состояния и
//  перебивает ручной выбор: предсказуемее, чем запоминать ручные правки.
//
//  ── ДВА MOOG ─────────────────────────────────────────────────────
//  moog.bass — пила, 24 dB, срез 57 (в кульминации TIMELINE поднимает
//  до ~79), glide по умолчанию 0. Линия дабовая: 3–4 длинные ноты в такт,
//  паузы, редкая квинта/октава, дилей. Не джазовый ход 50-х.
//  moog.lead — square, унисон, LFO на срезе, дилей; срез 900 в спокойных
//  частях и ~1450 в кульминации. Три варианта фразы — см. выше.
//
//  // @roots d eb bb f g eb c d
// ══════════════════════════════════════════════════════════════════

const BPM = 82
setcpm(BPM / 4) // один цикл = один такт 4/4 (≈ 2.93 с)

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
//  СЭМПЛЫ
// ══════════════════════════════════════════════════════════════════
// Явная карта вместо `github:...`: raw.githubusercontent периодически
// отдаёт 503 и упирается в лимиты, из-за чего часть сэмплов молчит.
// jsDelivr — тот же репозиторий uzu-drumkit, но стабильный CDN.
// Грузятся только имена, которые реально играются (без 221 папки Dirt).
if (typeof samples === 'function') {
  samples({
    bd: [
      'bd/10_bd_switchangel.wav', 'bd/11_bd_mot4i.wav', 'bd/12_bd_mot4i.wav',
      'bd/13_bd_mot4i.wav', 'bd/14_bd_switchangel.wav', 'bd/15_bd_switchangel.wav',
      'bd/16_bd_switchangel.wav', 'bd/17_bd_switchangel.wav',
    ],
    sd: [
      'sd/10_sd_switchangel-bounce-2.wav', 'sd/11_sd_switchangel_3.wav',
      'sd/12_sd_switchangel_2.wav', 'sd/13_sd_switchangel_2.wav', 'sd/14_sd.wav',
    ],
    cp: ['cp/10_cp_switchangel.wav', 'cp/11_cp_mot4i.wav'],
    hh: [
      'hh/10_hh_switchangel.wav', 'hh/11_hh_mot4i.wav', 'hh/12_hh_switchangel.wav',
      'hh/13_hh_switchangel.wav', 'hh/14_hh_mot4i.wav',
    ],
    oh: [
      'oh/10_oh_switchangel.wav', 'oh/11_oh_switchangel.wav',
      'oh/12_oh_switchangel.wav', 'oh/13_oh_switchangel.wav',
    ],
    rim: ['rim/10_rim_switchangel.wav', 'rim/11_rim_switch_angel.wav'],
    sh: ['sh/10_sh_switchangel.wav'],
    lt: ['lt/10_lt_mot4i.wav'],
    tb: ['tb/10_tb.wav'],
    cb: ['cb/10_perc_switchangel.wav'],
  }, 'https://cdn.jsdelivr.net/gh/tidalcycles/uzu-drumkit@main/')
}

// ══════════════════════════════════════════════════════════════════
//  GLIDE — слайд от предыдущей ноты (рецепт Switch Angel)
// ══════════════════════════════════════════════════════════════════
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

// ВОСЕМЬ БРЕЙКОВ: меняется рисунок, не состав.
// @switches song=loop,song mode=boom,break,half,roll,shuffle,stutter,broken,open harmony=quartal,ninth lead=sparks,smooth,theme drum=off,soft,full vibes=off,sparse,dense
const mode = slider(0, 0, 7, 1)

// LOOP = статичный луп, TIMELINE не идёт; SONG = форма на 96 тактов.
// В SONG таймлайн главнее ручных переключений: выбор не запоминается.
const song = slider(0, 0, 1, 1)

// Мелодические состояния (в LOOP — ручки, в SONG — таймлайн).
const lead = slider(0, 0, 2, 1)    // sparks / smooth / theme
const drum = slider(2, 0, 2, 1)   // off / soft / full — вся ударная группа
const vibes = slider(1, 0, 2, 1)   // off / sparse / dense

// ГАРМОНИЯ: кварты / 9-е и 13-я. Защёлка на 8 тактов.
const harmony = slider(0, 0, 1, 1)
const hQ = harmony.seg(1 / 8)
const hA = hQ.fmap((h) => (h < 0.5 ? 1 : 0))
const hB = hQ.fmap((h) => (h < 0.5 ? 0 : 1))

// ══════════════════════════════════════════════════════════════════
//  ОБЩЕЕ
// ══════════════════════════════════════════════════════════════════
const verb = slider(0.38, 0, 1, 0.01)
const duck = slider(0.5, 0, 1, 0.01)

// Групповые мьюты: панель рисует G рядом с M/S и складывает их в одну
// кнопку на группу. В документе остаётся base-громкость, глушит `1 - mute`.
// @mutes muteDrums,muteKeys,muteMoog,muteAtmos
const muteDrums = slider(0, 0, 1, 1)
const muteKeys = slider(0, 0, 1, 1)
const muteMoog = slider(0, 0, 1, 1)
const muteAtmos = slider(0, 0, 1, 1)
const onDrums = muteDrums.fmap((v) => 1 - v)
const onKeys = muteKeys.fmap((v) => 1 - v)
const onMoog = muteMoog.fmap((v) => 1 - v)
const onAtmos = muteAtmos.fmap((v) => 1 - v)

// ══════════════════════════════════════════════════════════════════
//  ИНСТРУМЕНТЫ
// ══════════════════════════════════════════════════════════════════
const instruments = {
  // ── БАРАБАНЫ ───────────────────────────────────────────────────
  drums: {
    name: 'Drums',
    kick: {
      name: 'Kick',
      mute: 'muteDrums',
      vol: slider(0.3, 0, 0.5, 0.01),
      cut: slider(240, 80, 3000, 10),
      shape: slider(0.55, 0, 0.95, 0.01),
      decay: slider(0.5, 0.15, 1.4, 0.01),
      tune: slider(0.88, 0.55, 1.3, 0.01),
    },
    snare: {
      name: 'Snare',
      mute: 'muteDrums',
      vol: slider(0.22, 0, 1, 0.01),
      cut: slider(3800, 800, 12000, 100),
      decay: slider(0.16, 0.03, 0.6, 0.01),
    },
    ghost: {
      name: 'Ghost snare',
      mute: 'muteDrums',
      vol: slider(0.08, 0, 0.4, 0.01),
      cut: slider(3200, 600, 9000, 100),
      decay: slider(0.05, 0.01, 0.2, 0.005),
    },
    clap: {
      name: 'Clap',
      mute: 'muteDrums',
      vol: slider(0.1, 0, 0.8, 0.01),
      cut: slider(4800, 800, 12000, 100),
      decay: slider(0.12, 0.03, 0.4, 0.01),
    },
    hat: {
      name: 'Hats',
      mute: 'muteDrums',
      vol: slider(0.18, 0, 0.9, 0.01),
      cut: slider(7600, 800, 16000, 100),
      decay: slider(0.045, 0.01, 0.2, 0.005),
    },
    ohat: {
      name: 'Open hats',
      mute: 'muteDrums',
      vol: slider(0.1, 0, 0.7, 0.01),
      cut: slider(6000, 800, 16000, 100),
      decay: slider(0.13, 0.03, 0.5, 0.01),
    },
    rim: {
      name: 'Rim',
      mute: 'muteDrums',
      vol: slider(0.12, 0, 0.7, 0.01),
      cut: slider(3200, 400, 12000, 100),
      decay: slider(0.05, 0.01, 0.2, 0.005),
      echo: slider(0.2, 0, 0.8, 0.01),
    },
    shaker: {
      name: 'Shaker',
      mute: 'muteDrums',
      vol: slider(0.06, 0, 0.5, 0.01),
      cut: slider(6800, 800, 16000, 100),
      decay: slider(0.03, 0.01, 0.15, 0.005),
    },
    rolls: {
      name: 'Rolls',
      mute: 'muteDrums',
      vol: slider(0.1, 0, 0.6, 0.01),
      cut: slider(4200, 800, 14000, 100),
      decay: slider(0.04, 0.01, 0.15, 0.005),
    },
  },

  // ── ПЕРКУССИЯ ─────────────────────────────────────────────────
  perc: {
    name: 'Perc',
    tom: {
      name: 'Toms',
      mute: 'muteDrums',
      vol: slider(0.12, 0, 0.6, 0.01),
      cut: slider(1400, 200, 6000, 10),
      decay: slider(0.25, 0.05, 0.8, 0.01),
      echo: slider(0.2, 0, 0.7, 0.01),
    },
    tabla: {
      name: 'Tabla',
      mute: 'muteDrums',
      vol: slider(0.1, 0, 0.5, 0.01),
      cut: slider(2200, 300, 8000, 20),
      decay: slider(0.12, 0.03, 0.4, 0.01),
      echo: slider(0.15, 0, 0.7, 0.01),
    },
    cb: {
      name: 'Cowbell',
      mute: 'muteDrums',
      vol: slider(0.07, 0, 0.4, 0.01),
      cut: slider(3600, 400, 10000, 20),
      decay: slider(0.18, 0.03, 0.6, 0.01),
      echo: slider(0.35, 0, 0.8, 0.01),
    },
  },

  // ── НИЗ ────────────────────────────────────────────────────────
  low: {
    name: 'Low',
    sub: {
      name: 'Sub',
      mute: 'muteMoog',
      vol: slider(0.22, 0, 1, 0.01),
      cut: slider(80, 40, 80, 5),
      decay: slider(0.45, 0.1, 1.5, 0.01),
    },
  },

  // ── MOOG · ДВА ГОЛОСА ─────────────────────────────────────────
  moog: {
    name: 'Moog',
    bass: {
      name: 'Moog bass',
      mute: 'muteMoog',
      vol: slider(0.42, 0, 1, 0.01),
      cut: slider(57, 40, 80, 1),            // ниже: ровной линии нужен тёмный тон
      res: slider(9, 0, 20, 0.5),
      env: slider(2.4, 0, 8, 0.1),
      decay: slider(0.25, 0.05, 1, 0.01),
      glide: slider(0, 0, 0.09, 0.001),      // слайд по умолчанию выключен
      det: slider(0.04, 0, 0.2, 0.005),
      shape: slider(0.25, 0, 0.9, 0.01),
      echo: slider(0.18, 0, 0.7, 0.01),      // даб-дилей на длинных нотах
    },
    lead: {
      name: 'Moog lead',
      mute: 'muteMoog',
      vol: slider(0.22, 0, 0.9, 0.01),
      cut: slider(900, 200, 6000, 10),       // в кульминации TIMELINE откроет
      res: slider(6, 0, 20, 0.5),
      lfo: slider(2.2, 0, 8, 0.1),
      env: slider(1.4, 0, 8, 0.1),
      decay: slider(0.16, 0.03, 0.8, 0.01),
      glide: slider(0, 0, 0.06, 0.001),      // 0: фраза говорит артикуляцией
      det: slider(0.06, 0, 0.25, 0.005),
    },
  },

  // ── КЛАВИШИ ────────────────────────────────────────────────────
  keys: {
    name: 'Keys',
    rhodes: {
      name: 'Rhodes',
      mute: 'muteKeys',
      vol: slider(0.26, 0, 0.9, 0.01),
      cut: slider(2200, 200, 10000, 20),
      fm: slider(0.9, 0, 4, 0.05),
      decay: slider(0.32, 0.05, 1.2, 0.01),
      echo: slider(0.15, 0, 0.8, 0.01),
    },
    pad: {
      name: 'Pad',
      mute: 'muteKeys',
      vol: slider(0.18, 0, 0.7, 0.01),
      cut: slider(1200, 80, 6000, 10),
      q: slider(1.2, 0, 20, 0.5),
      lfo: slider(1.2, 0, 8, 0.1),
      det: slider(0.08, 0, 0.5, 0.01),
    },
    vibes: {
      name: 'Vibes',
      mute: 'muteKeys',
      vol: slider(0.16, 0, 0.8, 0.01),
      cut: slider(3400, 400, 12000, 20),
      decay: slider(0.5, 0.05, 1.6, 0.01),
      echo: slider(0.3, 0, 0.9, 0.01),
    },
    spark: {
      name: 'Spark 32nd',
      mute: 'muteKeys',
      vol: slider(0.1, 0, 0.5, 0.01),
      cut: slider(4200, 400, 14000, 20),
      decay: slider(0.06, 0.02, 0.3, 0.005),
      echo: slider(0.35, 0, 0.85, 0.01),
    },
  },

  // ── АТМОСФЕРА ──────────────────────────────────────────────────
  atmos: {
    name: 'Atmos',
    air: {
      name: 'Air',
      mute: 'muteAtmos',
      vol: slider(0.1, 0, 0.5, 0.01),
      cut: slider(600, 100, 8000, 20),
      lfo: slider(2.2, 0, 10, 0.5),
    },
    drone: {
      name: 'Drone',
      mute: 'muteAtmos',
      vol: slider(0.07, 0, 0.6, 0.01),
      cut: slider(260, 60, 2000, 10),
      det: slider(0.09, 0, 0.5, 0.01),
    },
    vinyl: {
      name: 'Vinyl',
      mute: 'muteAtmos',
      vol: slider(0.04, 0, 0.3, 0.01),
      cut: slider(2400, 300, 12000, 100),
    },
  },

  // ── ЭФФЕКТЫ ────────────────────────────────────────────────────
  fx: {
    name: 'FX',
    dub: {
      name: 'Dub delay',
      delaySend: slider(0.2, 0, 0.8, 0.01),
      delayTime: slider(0.375, 0.0625, 0.75, 0.0625),
      delayFeedback: slider(0.45, 0, 0.85, 0.01),
    },
    spot: {
      name: 'Spot FX',
      mute: 'muteAtmos',
      vol: slider(0.06, 0, 0.5, 0.01),
      cut: slider(2400, 200, 10000, 20),
      decay: slider(1.8, 0.3, 4, 0.1),
    },
    reverb: {
      name: 'Reverb',
      size: slider(9, 1, 20, 0.5),
    },
  },
}

const { drums, perc, low, moog, keys, atmos, fx } = instruments

const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}

// ══════════════════════════════════════════════════════════════════
//  TIMELINE — форма на 96 тактов
// ══════════════════════════════════════════════════════════════════
// at/len — такты. values — множители к слайдерам и к срезам.
// Слайдеры остаются hot: TIMELINE применяется при Ctrl+Enter.
// Гейны читаются через tlCurve('...'), срезы — через cut*.mul(tlCurve(...)).
const TIMELINE = [
  {
    at: 0,
    len: 8,
    name: 'INTRO',
    values: {
      kick: 0, snare: 0, clap: 0, ghost: 0, hats: 0.18, ohat: 0, rim: 0.15, shaker: 0.3, rolls: 0,
      tom: 0, tabla: 0, cb: 0, spot: 0, sub: 0, moog: 0.35, leadA: 0.12, leadB: 0, leadC: 0, spark: 0,
      rhodes: 0.3, pad: 0.75, vibes: 0.35, air: 1, drone: 0.6, vinyl: 1,
      cutKick: 0.85, cutHats: 0.8, cutBass: 0.8, cutLead: 0.55, cutPad: 0.6, cutRhodes: 0.6,
      envBass: 0.7, lfoLead: 0.5, echoLead: 0.5, space: 1.25, duck: 0,
    },
  },
  {
    at: 8,
    len: 8,
    name: 'BUILD A',
    values: {
      kick: 0.6, snare: 0.35, clap: 0.15, ghost: 0.15, hats: 0.45, ohat: 0.25, rim: 0.4, shaker: 0.5, rolls: 0,
      tom: 0.25, tabla: 0.2, cb: 0, spot: 0, sub: 0.6, moog: 0.6, leadA: 0.35, leadB: 0, leadC: 0, spark: 0,
      rhodes: 0.55, pad: 0.85, vibes: 0.5, air: 0.9, drone: 0.8, vinyl: 1,
      cutKick: 0.95, cutHats: 0.9, cutBass: 0.92, cutLead: 0.7, cutPad: 0.8, cutRhodes: 0.8,
      envBass: 0.85, lfoLead: 0.7, echoLead: 0.7, space: 1.1, duck: 0.5,
    },
  },
  {
    at: 16,
    len: 8,
    name: 'BUILD B',
    values: {
      kick: 0.85, snare: 0.75, clap: 0.4, ghost: 0.35, hats: 0.7, ohat: 0.5, rim: 0.65, shaker: 0.7, rolls: 0.15,
      tom: 0.5, tabla: 0.45, cb: 0.25, spot: 0, sub: 0.85, moog: 0.85, leadA: 0.55, leadB: 0, leadC: 0, spark: 0,
      rhodes: 0.8, pad: 0.95, vibes: 0.65, air: 0.8, drone: 0.9, vinyl: 0.95,
      cutKick: 1.05, cutHats: 1, cutBass: 1, cutLead: 0.9, cutPad: 0.95, cutRhodes: 0.95,
      envBass: 1, lfoLead: 0.85, echoLead: 0.9, space: 0.95, duck: 0.85,
    },
  },
  {
    at: 24,
    len: 8,
    name: 'BREAK A',
    values: {
      kick: 0.12, snare: 0, clap: 0, ghost: 0.1, hats: 0.3, ohat: 0.2, rim: 0.3, shaker: 0.4, rolls: 0,
      tom: 0.45, tabla: 0.55, cb: 0.3, spot: 0.5, sub: 0.35, moog: 0.5, leadA: 0, leadB: 0.45, leadC: 0, spark: 0,
      rhodes: 0.5, pad: 0.9, vibes: 0.8, air: 1.05, drone: 0.8, vinyl: 1,
      cutKick: 1, cutHats: 0.85, cutBass: 0.78, cutLead: 0.7, cutPad: 0.72, cutRhodes: 0.7,
      envBass: 0.8, lfoLead: 0.9, echoLead: 1.3, space: 1.2, duck: 0.3,
    },
  },
  {
    at: 32,
    len: 8,
    name: 'BREAK B',
    values: {
      kick: 0, snare: 0, clap: 0, ghost: 0.2, hats: 0.45, ohat: 0.3, rim: 0.5, shaker: 0.5, rolls: 0.1,
      tom: 0.8, tabla: 0.9, cb: 0.55, spot: 0.7, sub: 0.5, moog: 0.6, leadA: 0, leadB: 0.6, leadC: 0, spark: 0,
      rhodes: 0.6, pad: 0.95, vibes: 0.9, air: 1.1, drone: 0.85, vinyl: 1,
      cutKick: 1, cutHats: 0.9, cutBass: 0.85, cutLead: 0.85, cutPad: 0.8, cutRhodes: 0.8,
      envBass: 0.9, lfoLead: 1, echoLead: 1.45, space: 1.15, duck: 0.2,
    },
  },
  {
    at: 40,
    len: 8,
    name: 'RETURN',
    values: {
      kick: 1, snare: 0.95, clap: 0.75, ghost: 0.5, hats: 0.9, ohat: 0.8, rim: 0.9, shaker: 0.8, rolls: 0.35,
      tom: 0.55, tabla: 0.45, cb: 0.35, spot: 0, sub: 1, moog: 1, leadA: 0, leadB: 0, leadC: 0.85, spark: 0.35,
      rhodes: 0.95, pad: 1, vibes: 0.75, air: 0.85, drone: 0.85, vinyl: 0.9,
      cutKick: 1.1, cutHats: 1.1, cutBass: 1.08, cutLead: 1.05, cutPad: 1.05, cutRhodes: 1.05,
      envBass: 1.05, lfoLead: 1, echoLead: 1, space: 0.9, duck: 1,
    },
  },
  {
    at: 48,
    len: 12,
    name: 'CLIMAX A',
    values: {
      kick: 1.15, snare: 1.1, clap: 0.95, ghost: 0.75, hats: 1.1, ohat: 1, rim: 1.05, shaker: 0.95, rolls: 0.8,
      tom: 0.85, tabla: 0.85, cb: 0.7, spot: 0.3, sub: 1.15, moog: 1.15, leadA: 0, leadB: 0, leadC: 1.15, spark: 0.75,
      rhodes: 1.15, pad: 1.1, vibes: 1, air: 0.7, drone: 0.95, vinyl: 0.7,
      cutKick: 1.2, cutHats: 1.25, cutBass: 1.3, cutLead: 1.45, cutPad: 1.45, cutRhodes: 1.4,
      envBass: 1.2, lfoLead: 1.15, echoLead: 1.2, space: 0.85, duck: 1.1,
    },
  },
  {
    at: 60,
    len: 12,
    name: 'CLIMAX B',
    values: {
      kick: 1.25, snare: 1.25, clap: 1.1, ghost: 0.95, hats: 1.25, ohat: 1.1, rim: 1.15, shaker: 1.05, rolls: 1,
      tom: 1.05, tabla: 1.05, cb: 0.9, spot: 0.5, sub: 1.2, moog: 1.25, leadA: 0, leadB: 0, leadC: 1.3, spark: 1,
      rhodes: 1.25, pad: 1.15, vibes: 1.1, air: 0.65, drone: 1, vinyl: 0.6,
      cutKick: 1.25, cutHats: 1.3, cutBass: 1.38, cutLead: 1.6, cutPad: 1.6, cutRhodes: 1.5,
      envBass: 1.3, lfoLead: 1.25, echoLead: 1.35, space: 0.8, duck: 1.15,
    },
  },
  {
    at: 72,
    len: 8,
    name: 'DECAY',
    values: {
      kick: 0.35, snare: 0.25, clap: 0.15, ghost: 0.25, hats: 0.45, ohat: 0.35, rim: 0.35, shaker: 0.45, rolls: 0.2,
      tom: 0.55, tabla: 0.45, cb: 0.2, spot: 0.9, sub: 0.55, moog: 0.7, leadA: 0.4, leadB: 0, leadC: 0, spark: 0,
      rhodes: 0.7, pad: 1.05, vibes: 0.8, air: 1.1, drone: 0.9, vinyl: 1.1,
      cutKick: 0.95, cutHats: 0.95, cutBass: 0.92, cutLead: 0.85, cutPad: 0.9, cutRhodes: 0.85,
      envBass: 0.9, lfoLead: 1, echoLead: 1.5, space: 1.3, duck: 0.4,
    },
  },
  {
    at: 80,
    len: 8,
    name: 'OUTRO A',
    values: {
      kick: 0, snare: 0, clap: 0, ghost: 0, hats: 0.18, ohat: 0.12, rim: 0.2, shaker: 0.28, rolls: 0,
      tom: 0.25, tabla: 0.2, cb: 0.1, spot: 0.6, sub: 0.28, moog: 0.45, leadA: 0.2, leadB: 0, leadC: 0, spark: 0,
      rhodes: 0.45, pad: 0.95, vibes: 0.6, air: 1.15, drone: 0.7, vinyl: 1.15,
      cutKick: 0.9, cutHats: 0.8, cutBass: 0.78, cutLead: 0.6, cutPad: 0.68, cutRhodes: 0.6,
      envBass: 0.7, lfoLead: 0.7, echoLead: 1.45, space: 1.45, duck: 0.1,
    },
  },
  {
    at: 88,
    len: 8,
    name: 'OUTRO B',
    values: {
      kick: 0, snare: 0, clap: 0, ghost: 0, hats: 0, ohat: 0, rim: 0, shaker: 0, rolls: 0,
      tom: 0, tabla: 0, cb: 0, spot: 0.25, sub: 0, moog: 0.22, leadA: 0.1, leadB: 0, leadC: 0, spark: 0,
      rhodes: 0.22, pad: 0.8, vibes: 0.3, air: 1.2, drone: 0.5, vinyl: 1.2,
      cutKick: 0.9, cutHats: 0.7, cutBass: 0.7, cutLead: 0.5, cutPad: 0.55, cutRhodes: 0.5,
      envBass: 0.6, lfoLead: 0.5, echoLead: 1.5, space: 1.6, duck: 0,
    },
  },
]

const TL_TOTAL = Math.max(...TIMELINE.map((s) => s.at + s.len))

const tlCurve = (key) => {
  let last = 0
  const segs = []
  for (let i = 0; i < TIMELINE.length; i++) {
    const sec = TIMELINE[i]
    if (Object.prototype.hasOwnProperty.call(sec.values, key)) last = sec.values[key]
    const next = i + 1 < TIMELINE.length ? TIMELINE[i + 1].at : TL_TOTAL
    const len = next - sec.at
    if (len > 0) segs.push([len, pure(last)])
  }
  return arrange(...segs)
}

const songGate = song.fmap((v) => (v > 0.5 ? 1 : 0))
const loopGate = song.fmap((v) => (v > 0.5 ? 0 : 1))

// В SONG — значение из TIMELINE, в LOOP — постоянный уровень.
const tlOr = (key, loopLevel) => tlCurve(key).mul(songGate).add(loopLevel.mul(loopGate))

// Группа ударных: одна кнопка на kick/snare/hats/perc/ghost/rolls.
const drumLoop = drum.fmap((v) => (v < 0.5 ? 0 : v < 1.5 ? 0.6 : 1))
const loopLeadA = lead.fmap((v) => (v < 0.5 ? 1 : 0))
const loopLeadB = lead.fmap((v) => (v >= 0.5 && v < 1.5 ? 1 : 0))
const loopLeadC = lead.fmap((v) => (v >= 1.5 ? 1 : 0))
const loopSpark = lead.fmap((v) => (v >= 1.5 ? 0.8 : 0))
const loopVibesA = vibes.fmap((v) => (v >= 0.5 ? 1 : 0))
const loopVibesB = vibes.fmap((v) => (v >= 1.5 ? 1 : 0))

// ══════════════════════════════════════════════════════════════════
//  ФРАЗЫ
// ══════════════════════════════════════════════════════════════════
const phrase = (bars) => m('<' + bars.join(' ') + '>')

// @roots d eb bb f g eb c d

// ПЭД A — кварты без терций.
const PAD_A = phrase([
  '[d3,g3,c4,f4]',
  '[g3,c4,f4,bb4]',
  '[d4,g4,c5,f5]',
  '[a3,d4,g4,c5]',
  '[c4,f4,bb4,eb5]',
  '[g3,c4,f4,bb4]',
  '[g3,c4,f4,bb4]',
  '[d3,g3,c4,f4]',
])

// ПЭД B — 9-е, 11-е, 13-я.
const PAD_B = phrase([
  '[f3,c4,a4,e5]',
  '[g3,bb3,d4,f4]',
  '[d4,f4,a4,c5]',
  '[a3,c4,e4,g4]',
  '[bb3,d4,f4,a4]',
  '[g3,bb3,d4,f4]',
  '[eb4,g4,bb4,d6]',
  '[f3,c4,a4,e5]',
])

// RHODES — аккорд такта; ритм компинга выбирается отдельно.
const KEYS = phrase([
  '[f4,a4,c5,e5]',
  '[g4,bb4,d5,f5]',
  '[d4,f4,a4,c5]',
  '[a4,c5,e5,g5]',
  '[c5,f5,bb5,d6]',
  '[g4,bb4,d5,f5]',
  '[eb4,g4,bb4,d5]',
  '[f4,a4,c5,e5]',
])

// MOOG LEAD · A — абстрактные искры: короткие обрывки, вариации,
// паузы. Для INTRO/BUILD и после кульминации.
const LEAD_A = phrase([
  '[~ ~ ~ f5 ~ ~ ~ ~ a5 ~ ~ ~ ~ ~ c6 ~]',
  '[~ ~ bb4 ~ ~ ~ ~ ~ d5 ~ ~ ~ eb5 ~ ~ ~]',
  '[~ d5 ~ ~ ~ f5 ~ ~ ~ ~ a5 ~ ~ ~ ~ ~]',
  '[~ ~ a4 ~ ~ ~ c5 ~ ~ ~ e5 ~ ~ ~ ~ ~]',
  '[~ ~ ~ f5 ~ ~ bb5 ~ ~ ~ ~ ~ g5 ~ ~ ~]',
  '[~ ~ g4 ~ ~ d5 ~ ~ ~ ~ bb4 ~ ~ ~ ~ ~]',
  '[~ ~ eb5 ~ ~ ~ ~ g5 ~ ~ bb5 ~ ~ ~ ~ ~]',
  '[~ ~ ~ a4 ~ ~ ~ c5 ~ ~ e5 ~ ~ ~ ~ ~]',
])

// MOOG LEAD · B — плавнее и насыщеннее, длинные связки; темы ещё нет.
const LEAD_B = phrase([
  '[~ [f4@2 a4] [c5@3 e5] ~ [g4@2 c5] [e5@3 a4] ~ ~]',
  '[~ [g4@2 bb4] [d5@3 f5] ~ [c5@2 bb4] [g4@3 d5] ~ ~]',
  '[~ [d5@2 f5] [a5@3 c5] ~ [f5@2 a5] [d6@3 f5] ~ ~]',
  '[~ [a4@2 c5] [e5@3 g5] ~ [f5@2 e5] [c5@3 a4] ~ ~]',
  '[~ [f5@2 g5] [bb5@3 d6] ~ [c6@2 bb5] [g5@3 f5] ~ ~]',
  '[~ [bb4@2 d5] [f5@3 g5] ~ [f5@2 d5] [bb4@3 g4] ~ ~]',
  '[~ [eb5@2 g5] [bb5@3 g5] ~ [eb5@2 bb4] [g4@3 eb5] ~ ~]',
  '[~ [f4@2 a4] [c5@3 e5] ~ [a4@2 c5] [e5@3 a4] ~ ~]',
])

// MOOG LEAD · C — главная тема («припев»). Узнаваемый ритм — только
// изюминка: звучит в RETURN и кульминации, не раньше.
const LEAD_C = phrase([
  '[~ ~ f4 a4 [c5@2 e5] ~ ~ d5 [c5 a4] ~ ~ [c5 e5] ~ ~ ~]',
  '[~ g4@2 bb4 ~ [d5 f5 d5] ~ ~ c5 bb4 ~ g4@2 ~ [bb4 d5] ~ ~ ~]',
  '[~ ~ d5 f5 ~ [a5@2 ~] ~ c5 [d5 f5] ~ ~ a5 ~ [f5 d5] ~ ~]',
  '[~ a4 c5 [e5@2 g5] ~ ~ f5 e5 ~ c5 ~ [a4 c5 e5] ~ ~ ~]',
  '[~ ~ f5 g5 [bb5@2 ~] ~ d6 [c6 bb5] ~ ~ g5 ~ [f5 g5 bb5] ~ ~]',
  '[~ ~ bb4 d5 [f5@2 ~] ~ g5 f5 ~ d5 ~ [bb4 d5 f5] ~ ~ g4]',
  '[~ eb5 g5 [bb5@2 ~] ~ d6 bb5 ~ g5 ~ [eb5 g5 bb5] ~ ~ ~ ~]',
  '[~ ~ a4 c5 [e5@2 g5] ~ ~ c5 a4 ~ ~ [f4 a4 c5] ~ ~ ~]',
])

// SPARK — солирующий голос октавой выше: та же фраза, 32-е в кульминации.
const SPARK = phrase([
  '[[~ ~ f16 a16 [c17@2 e17] ~ ~ d17 [c17 a16] ~ ~ [c17 e17] ~ ~ ~]]',
  '[[~ g16@2 bb16 ~ [d17 f17 d17] ~ ~ c17 bb16 ~ g16@2 ~ [bb16 d17] ~ ~ ~]]',
  '[[~ ~ d17 f17 ~ [a17@2 ~] ~ c17 [d17 f17] ~ ~ a17 ~ [f17 d17] ~ ~]]',
  '[[~ a16 c17 [e17@2 g17] ~ ~ f17 e17 ~ c17 ~ [a16 c17 e17] ~ ~ ~]]',
  '[[~ ~ f17 g17 [bb17@2 ~] ~ d18 [c18 bb17] ~ ~ g17 ~ [f17 g17 bb17] ~ ~]]',
  '[[~ ~ bb16 d17 [f17@2 ~] ~ g17 f17 ~ d17 ~ [bb16 d17 f17] ~ ~ g16]]',
  '[[~ eb17 g17 [bb17@2 ~] ~ d18 bb17 ~ g17 ~ [eb17 g17 bb17] ~ ~ ~ ~]]',
  '[[~ ~ a16 c17 [e17@2 g17] ~ ~ c17 a16 ~ ~ [f16 a16 c17] ~ ~ ~]]',
])

// VIBES — ответы в паузах солиста: перекличка, а не второй лид.
const VIBES = phrase([
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ eb5 ~ ~ ~ ~ ~ ~ bb4 ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ d5 ~ ~ f5 ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ ~ e5 ~ ~ g4 ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ bb5 ~ ~ ~ ~ ~ ~ g5 ~ ~]',
  '[~ ~ ~ ~ d5 ~ ~ ~ ~ f5 ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ bb4 ~ ~ ~ eb5 ~ ~ ~ ~ ~ ~]',
  '[~ ~ ~ ~ ~ ~ ~ ~ a4 ~ ~ c5 ~ ~ ~ ~]',
])

// VIBES · dense — более частые ответы; включается только в LOOP.
const VIBES_B = phrase([
  '[~ ~ a4 ~ c5 ~ ~ e5 ~ ~ ~ a4 ~ ~ ~ ~]',
  '[~ bb4 ~ ~ ~ d5 ~ ~ g4 ~ ~ ~ bb4 ~ ~ ~]',
  '[~ ~ d5 ~ f5 ~ ~ a5 ~ ~ ~ d5 ~ ~ ~ ~]',
  '[~ c5 ~ ~ e5 ~ ~ g5 ~ ~ ~ c5 ~ ~ ~ ~]',
  '[~ ~ f5 ~ bb5 ~ ~ g5 ~ ~ ~ f5 ~ ~ ~ ~]',
  '[~ d5 ~ ~ g4 ~ ~ bb4 ~ ~ ~ d5 ~ ~ ~ ~]',
  '[~ ~ eb5 ~ g5 ~ ~ bb5 ~ ~ ~ eb5 ~ ~ ~ ~]',
  '[~ a4 ~ ~ c5 ~ ~ e5 ~ ~ ~ a4 ~ ~ ~ ~]',
])

// MOOG BASS — дабовая линия, а не джазовый ход: 3–4 длинные ноты в такт,
// паузы, редкая квинта/октава. Простор между нотами — часть грува.
const BASS = phrase([
  '[d1@3 ~ ~ d1@2 ~ ~ a1@2 ~]',
  '[eb1@3 ~ ~ eb1@2 ~ bb1@2 ~ ~]',
  '[bb1@3 ~ ~ bb1@2 ~ f1@2 ~ d2@2]',
  '[f1@3 ~ ~ f1@2 ~ c2@2 ~ a1@2]',
  '[g1@3 ~ ~ g1@2 ~ d2@2 ~ bb1@2]',
  '[eb1@3 ~ ~ bb1@2 ~ eb1@2 ~ ~]',
  '[c2@3 ~ ~ c2@2 ~ g1@2 ~ eb2@2]',
  '[d1@3 ~ ~ d1@2 ~ a1@2 ~ d1@2]',
])

// SUB — только корень.
const SUB_ROOTS = phrase([
  '[d1]', '[eb1]', '[bb1]', '[f1]',
  '[g1]', '[eb1]', '[c2]', '[d1]',
])

// ══════════════════════════════════════════════════════════════════
//  РИТМЫ · восемь брейков (не только восьмые)
// ══════════════════════════════════════════════════════════════════
const kickPat = mode.pick([
  m('x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ x'),
  m('x ~ ~ x ~ ~ x ~ ~ x ~ ~ x x ~ ~'),
  m('x ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~'),
  m('x ~ x x ~ x ~ x x ~ x x ~ x x ~'),
  m('x ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~ x'),
  m('x ~ ~ x x ~ ~ ~ ~ x ~ x x ~ x ~'),
  m('x ~ ~ ~ ~ x ~ x ~ ~ x ~ x ~ x ~'),
  m('x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~'),
])

const snarePat = mode.pick([
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ x x ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~'),
  m('~ ~ x x ~ ~ x ~ ~ x x ~ ~ ~ x x'),
  m('~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~ ~ ~'),
  m('~ x ~ ~ x ~ ~ ~ x ~ ~ x x ~ x ~'),
  m('~ x ~ ~ ~ ~ x ~ ~ ~ x x ~ ~ x ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~'),
])

const hatPat = mode.pick([
  m('x ~ [x x] ~ x ~ [x x] ~ x ~ x ~ [x x] ~ x ~'),
  m('x x ~ [x x] x ~ x x [x x] ~ x x ~ [x x] ~ x'),
  m('x ~ ~ x [x x] ~ x ~ x ~ ~ x [x x] ~ x ~'),
  m('[x x x] ~ x x [x x x] ~ x [x x x] ~ x x [x x x] ~ x'),
  m('~ x ~ [x x] ~ x ~ [x x] ~ x ~ [x x] ~ x ~ [x x]'),
  m('x [x x] ~ x x [x x] ~ x x [x x] ~ x x [x x] ~ x'),
  m('x ~ x [x x x] ~ x ~ x [x x x] ~ x ~ x [x x x] ~'),
  m('~ ~ x ~ ~ ~ [x x] ~ ~ x ~ ~ ~ [x x] ~ ~'),
])

const rimPat = mode.pick([
  m('~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~'),
  m('~ x ~ ~ ~ ~ ~ ~ x ~ x ~ ~ ~ ~ x'),
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
  m('~ x x ~ x ~ ~ x x ~ x x ~ x ~ x'),
  m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'),
  m('x ~ ~ x ~ x ~ ~ x ~ ~ ~ x ~ ~ x'),
  m('~ ~ x ~ ~ x ~ ~ ~ x ~ ~ x ~ x ~'),
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
])

const compPat = mode.pick([
  m('~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~'),
  m('x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ x'),
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
  m('x ~ x x ~ ~ x ~ x ~ x x ~ ~ x ~'),
  m('~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ x'),
  m('~ ~ x ~ ~ ~ x x ~ ~ x ~ ~ ~ x ~'),
  m('x ~ x ~ x ~ ~ x ~ x ~ x x ~ x ~'),
  m('~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~'),
])

// ══════════════════════════════════════════════════════════════════
//  АТМОСФЕРА
// ══════════════════════════════════════════════════════════════════

$: s('pink')
  .gain(atmos.air.vol.mul(tlOr('air', pure(1))).mul(onAtmos))
  .lpf(atmos.air.cut).lpq(0.8).ftype('24db')
  .lpdepth(atmos.air.lfo).lpsync(0.0625).lpdc(0)
  .room(verb.mul(tlOr('space', pure(1)))).roomsize(fx.reverb.size)
  .filter(audible)

// ДРОН — «hip hop tuning»: слои чуть расстроены, но не фальшивы.
$: note(phrase([
     '[d2,a2]', '[eb2,g2]', '[bb1,f2]', '[f2,c3]',
     '[g2,d3]', '[eb2,g2]', '[c2,g2]', '[d2,a2]',
   ]))
  .s('sawtooth').unison(2).detune(atmos.drone.det)
  .gain(atmos.drone.vol.mul(tlOr('drone', pure(1))).mul(onAtmos))
  .lpf(atmos.drone.cut).lpq(3).ftype('24db')
  .attack(1.8).decay(1).sustain(0.9).release(2.6)
  .room(verb.mul(tlOr('space', pure(1)))).roomsize(fx.reverb.size)
  .filter(audible)

// ВИНИЛ — пыль и треск: часть грува, не украшение
$: s('crackle')
  .gain(atmos.vinyl.vol.mul(m('<1 1 .7 1 1 1 1 .8 1 1 1 1>')).mul(tlOr('vinyl', pure(1))).mul(onAtmos))
  .lpf(atmos.vinyl.cut).hpf(300)
  .room(0.2)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  УДАРНЫЕ
// ══════════════════════════════════════════════════════════════════

$: s('bd')
  .struct(kickPat)
  .gain(drums.kick.vol.mul(tlOr('kick', drumLoop)).mul(onDrums))
  .lpf(drums.kick.cut.mul(tlOr('cutKick', pure(1)))).lpq(1)
  .speed(drums.kick.tune)
  .shape(drums.kick.shape)
  .decay(drums.kick.decay).sustain(0).release(0.08)
  .duckorbit(2).duckdepth(duck.mul(tlOr('duck', pure(1)))).duckattack(0.02)
  .filter(audible)

// СНЕЙР + RIM: «два снейра» — тяжёлый sd на 2 и сухой stick на 4.
// СНЕЙР — тяжёлый удар на 2; rim ниже — сухой stick на 4
$: s('sd')
  .struct(snarePat)
  .gain(drums.snare.vol.mul(tlOr('snare', drumLoop)).mul(onDrums))
  .lpf(drums.snare.cut).hpf(180)
  .decay(drums.snare.decay).sustain(0).release(0.08)
  .room(verb.mul(0.5).mul(tlOr('space', pure(1)))).roomsize(fx.reverb.size)
  .filter(audible)

// КЛЭП — тонкий слой на «и» четвёртой
$: s('cp')
  .struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~'))
  .gain(drums.clap.vol.mul(0.7).mul(tlOr('clap', drumLoop)).mul(onDrums))
  .lpf(drums.clap.cut).lpq(3)
  .decay(drums.clap.decay).sustain(0)
  .pan(rand.mul(1.1).sub(0.55))
  .room(0.28).roomsize(fx.reverb.size)
  .filter(audible)

// GHOST — призрачные снейры: «речь» брейка, а не сетка.
// GHOST — призрачные снейры: речь брейка, не сетка
$: s('sd')
  .struct(m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'))
  .gain(drums.ghost.vol.mul(m('[.35 1 .5 .8]*4')).mul(tlOr('ghost', drumLoop)).mul(onDrums))
  .lpf(drums.ghost.cut).hpf(220)
  .decay(drums.ghost.decay).sustain(0)
  .pan(rand.mul(1.2).sub(0.6))
  .degradeBy(0.15)
  .filter(audible)

// ХЭТЫ — шаффл на 16-х, группы и триоли. Не «ровные восьмые».
// ХЭТЫ — шаффл на 16-х, группы и триоли
$: s('hh')
  .struct(hatPat)
  .gain(drums.hat.vol.mul(m('[1 .5 .7 .5]*4')).mul(tlOr('hats', drumLoop)).mul(onDrums))
  .lpf(drums.hat.cut.mul(tlOr('cutHats', pure(1)))).hpf(320)
  .decay(drums.hat.decay).sustain(0)
  .swingBy(0.16, 16)
  .nudge(rand.mul(0.01).sub(0.005))
  .degradeBy(0.04)
  .filter(audible)

// ОТКРЫТЫЕ ХЭТЫ — на «и», раскачивают грув
$: s('oh')
  .struct(m('~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x'))
  .gain(drums.ohat.vol.mul(0.8).mul(tlOr('ohat', drumLoop)).mul(onDrums))
  .lpf(drums.ohat.cut)
  .decay(drums.ohat.decay).sustain(0)
  .room(verb.mul(0.8).mul(tlOr('space', pure(1)))).roomsize(fx.reverb.size)
  .filter(audible)

// RIM — сухой stick: второй «снейр» и ответ брейка
$: s('rim')
  .struct(rimPat)
  .gain(drums.rim.vol.mul(0.9).mul(tlOr('rim', drumLoop)).mul(onDrums))
  .lpf(drums.rim.cut).hpf(500).lpq(2)
  .decay(drums.rim.decay).sustain(0)
  .pan(rand.mul(1.4).sub(0.7))
  .delay(drums.rim.echo).delaytime(fx.dub.delayTime).delayfeedback(0.25)
  .filter(audible)

// ШЕЙКЕР — 16-е с потерями: движение, не удар
$: s('sh')
  .struct(m('x*16'))
  .gain(drums.shaker.vol.mul(0.6).mul(tlOr('shaker', drumLoop)).mul(onDrums))
  .lpf(drums.shaker.cut).hpf(2200)
  .decay(drums.shaker.decay).sustain(0)
  .degradeBy(0.4)
  .pan(rand.mul(0.8).add(0.1))
  .filter(audible)

// ROLLS — 32-е в конце каждого 4-го такта; включаются только в кульминации.
// ROLLS — 32-е в конце каждого 4-го такта
$: s('sd')
  .struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ [x*8] ~ ~ ~'))
  .gain(drums.rolls.vol.mul(m('<0 0 0 1>')).mul(tlOr('rolls', drumLoop)).mul(onDrums))
  .lpf(drums.rolls.cut).hpf(200)
  .decay(drums.rolls.decay).sustain(0)
  .pan(rand.mul(1.6).sub(0.8))
  .room(verb.mul(0.6).mul(tlOr('space', pure(1)))).roomsize(fx.reverb.size)
  .filter(audible)

// ── ПЕРКУССИЯ (входит по TIMELINE) ─────────────────────────────
// ТОМЫ — перкуссионные вставки в брейках
$: s('lt')
  .struct(m('~ ~ ~ ~ ~ [x x] ~ ~ ~ x ~ ~ ~ [x x] ~ ~'))
  .gain(perc.tom.vol.mul(tlOr('tom', drumLoop)).mul(onDrums))
  .lpf(perc.tom.cut).lpq(2)
  .decay(perc.tom.decay).sustain(0)
  .delay(perc.tom.echo).delaytime(fx.dub.delayTime).delayfeedback(0.3)
  .pan(rand.mul(1.2).sub(0.6))
  .filter(audible)

// ТАБЛА — латинско-джазовая краска, отвечает солисту
$: s('tb')
  .struct(m('~ x ~ [x x] ~ ~ x ~ x ~ [x x] ~ x ~ ~'))
  .gain(perc.tabla.vol.mul(tlOr('tabla', drumLoop)).mul(onDrums))
  .lpf(perc.tabla.cut).lpq(2)
  .decay(perc.tabla.decay).sustain(0)
  .delay(perc.tabla.echo).delaytime(fx.dub.delayTime).delayfeedback(0.25)
  .pan(rand.mul(1.2).sub(0.6))
  .filter(audible)

// КАУБЕЛЛ — редкий акцент в дилее
$: s('cb')
  .struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~'))
  .gain(perc.cb.vol.mul(tlOr('cb', drumLoop)).mul(onDrums))
  .lpf(perc.cb.cut).lpq(3)
  .decay(perc.cb.decay).sustain(0)
  .delay(perc.cb.echo).delaytime(0.4375).delayfeedback(0.4)
  .room(verb.mul(0.4).mul(tlOr('space', pure(1)))).roomsize(fx.reverb.size)
  .filter(audible)

// SPOT — редкий удар с тёмной комнатой: раз в 8 тактов, как в практике жанра.
// SPOT — редкий удар с тёмной комнатой раз в 8 тактов
$: s('white')
  .struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~'))
  .gain(fx.spot.vol.mul(m('<0 0 0 0 0 0 0 1>')).mul(tlOr('spot', pure(1))).mul(onAtmos))
  .hpf(700).lpf(fx.spot.cut)
  .attack(0.002).decay(fx.spot.decay).sustain(0).release(0.8)
  .room(verb.mul(1.2).mul(tlOr('space', pure(1)))).roomsize(fx.reverb.size)
  .pan(rand.mul(1.4).sub(0.7))
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  НИЗ
// ══════════════════════════════════════════════════════════════════

// MOOG BASS (голос 1): срез 57, в кульминации TIMELINE поднимает к 78–79.
// Glide по умолчанию 0; короткий слайд — только на подходе (2 позиции).
$: note(BASS)
  .s('sawtooth')
  .unison(2).detune(moog.bass.det)
  .glide(moog.bass.glide.mul(m('0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0')))
  .gain(moog.bass.vol.mul(tlOr('moog', pure(1))).mul(onMoog))
  .lpf(moog.bass.cut.mul(tlOr('cutBass', pure(1)))).lpq(moog.bass.res).ftype('24db')
  .lpenv(moog.bass.env.mul(tlOr('envBass', pure(1))))
  .lpa(0.004).lpd(moog.bass.decay).lpsustain(0.2)
  .shape(moog.bass.shape)
  .attack(0.004).decay(0.12).sustain(0.8).release(0.14)
  .delay(moog.bass.echo).delaytime(fx.dub.delayTime).delayfeedback(0.3)
  .orbit(2)
  .filter(audible)

// SUB — только корень, пауза между ударами
$: note(SUB_ROOTS)
  .s('sine')
  .struct(m('~ x ~ ~ ~ x ~ ~'))
  .gain(low.sub.vol.mul(tlOr('sub', pure(1))).mul(onMoog))
  .lpf(low.sub.cut).lpq(1)
  .decay(low.sub.decay).sustain(0).release(0.2)
  .orbit(2)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  MOOG LEAD (голос 2) — три состояния
// ══════════════════════════════════════════════════════════════════

// A — искры и обрывки: INTRO/BUILD/DECAY/OUTRO
$: note(LEAD_A)
  .s('square').unison(3).detune(moog.lead.det)
  .glide(moog.lead.glide.mul(m('0 0 0 1 0 0 0 0 0 0 1 0 0 0 0 0')))
  .gain(moog.lead.vol.mul(tlOr('leadA', loopLeadA)).mul(onMoog))
  .lpf(moog.lead.cut.mul(tlOr('cutLead', pure(1)))).lpq(moog.lead.res).ftype('24db')
  .lpenv(moog.lead.env)
  .lpa(0.004).lpd(moog.lead.decay).lpsustain(0.2)
  .lpdepth(moog.lead.lfo.mul(tlOr('lfoLead', pure(1)))).lpsync(0.125).lpdc(0)
  .decay(0.09).sustain(0.3).release(0.12)
  .delay(fx.dub.delaySend.mul(tlOr('echoLead', pure(1)))).delaytime(fx.dub.delayTime)
  .delayfeedback(fx.dub.delayFeedback.mul(0.8))
  .room(verb.mul(0.4).mul(tlOr('space', pure(1)))).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.35, 0.65))
  .orbit(3)
  .filter(audible)

// B — плавная линия в брейках
$: note(LEAD_B)
  .s('square').unison(3).detune(moog.lead.det)
  .glide(moog.lead.glide.mul(m('0 0 0 0 1 0 0 0 0 0 0 0 0 1 0 0')))
  .gain(moog.lead.vol.mul(tlOr('leadB', loopLeadB)).mul(onMoog))
  .lpf(moog.lead.cut.mul(tlOr('cutLead', pure(1)))).lpq(moog.lead.res).ftype('24db')
  .lpenv(moog.lead.env)
  .lpa(0.004).lpd(moog.lead.decay).lpsustain(0.2)
  .lpdepth(moog.lead.lfo.mul(tlOr('lfoLead', pure(1)))).lpsync(0.125).lpdc(0)
  .decay(0.12).sustain(0.4).release(0.15)
  .delay(fx.dub.delaySend.mul(tlOr('echoLead', pure(1)))).delaytime(fx.dub.delayTime)
  .delayfeedback(fx.dub.delayFeedback.mul(0.8))
  .room(verb.mul(0.4).mul(tlOr('space', pure(1)))).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.35, 0.65))
  .orbit(3)
  .filter(audible)

// C — главная тема: RETURN и кульминация
$: note(LEAD_C)
  .s('square').unison(3).detune(moog.lead.det)
  .glide(moog.lead.glide.mul(m('0 0 0 1 0 0 0 0 0 0 1 0 0 0 0 0')))
  .gain(moog.lead.vol.mul(tlOr('leadC', loopLeadC)).mul(onMoog))
  .lpf(moog.lead.cut.mul(tlOr('cutLead', pure(1)))).lpq(moog.lead.res).ftype('24db')
  .lpenv(moog.lead.env)
  .lpa(0.004).lpd(moog.lead.decay).lpsustain(0.2)
  .lpdepth(moog.lead.lfo.mul(tlOr('lfoLead', pure(1)))).lpsync(0.125).lpdc(0)
  .decay(0.09).sustain(0.3).release(0.12)
  .delay(fx.dub.delaySend.mul(tlOr('echoLead', pure(1)))).delaytime(fx.dub.delayTime)
  .delayfeedback(fx.dub.delayFeedback.mul(0.8))
  .room(verb.mul(0.4).mul(tlOr('space', pure(1)))).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.35, 0.65))
  .orbit(3)
  .filter(audible)


// ══════════════════════════════════════════════════════════════════
//  КЛАВИШИ
// ══════════════════════════════════════════════════════════════════

$: note(KEYS)
  .struct(compPat)
  .s('sine').fm(keys.rhodes.fm).fmh(1.01)
  .gain(keys.rhodes.vol.mul(tlOr('rhodes', pure(1))).mul(onKeys))
  .lpf(keys.rhodes.cut.mul(tlOr('cutRhodes', pure(1)))).lpq(2)
  .decay(keys.rhodes.decay).sustain(0).release(0.35)
  .delay(keys.rhodes.echo).delaytime(fx.dub.delayTime).delayfeedback(0.3)
  .room(verb.mul(tlOr('space', pure(1)))).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.4, 0.6))
  .filter(audible)

// ПЭД A — кварты без терций
$: note(PAD_A)
  .s('sawtooth').partials([1, 0, 0.5, 0, 0.3, 0, 0.16, 0, 0.08])
  .unison(3).detune(keys.pad.det)
  .gain(keys.pad.vol.mul(hA).mul(tlOr('pad', pure(1))).mul(onKeys))
  .lpf(keys.pad.cut.mul(tlOr('cutPad', pure(1)))).lpq(keys.pad.q).ftype('24db')
  .lpdepth(keys.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.3)
  .attack(1.2).decay(1.4).sustain(0.85).release(2.4)
  .room(verb.mul(tlOr('space', pure(1)))).roomsize(fx.reverb.size)
  .filter(audible)

// ПЭД B — 9-е, 11-е, 13-я
$: note(PAD_B)
  .s('sine').partials([1, 0.55, 0.3, 0.16, 0.1, 0.06])
  .unison(2).detune(keys.pad.det.mul(0.8))
  .gain(keys.pad.vol.mul(hB).mul(tlOr('pad', pure(1))).mul(onKeys))
  .lpf(keys.pad.cut.mul(1.2).mul(tlOr('cutPad', pure(1)))).lpq(keys.pad.q.mul(0.8)).ftype('24db')
  .lpdepth(keys.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.22)
  .attack(1.0).decay(1.2).sustain(0.85).release(2.2)
  .room(verb.mul(tlOr('space', pure(1)))).roomsize(fx.reverb.size)
  .filter(audible)

// VIBES — ответы в паузах солиста
$: note(VIBES)
  .s('sine').fm(0.8).fmh(3.01)
  .gain(keys.vibes.vol.mul(tlOr('vibes', loopVibesA)).mul(onKeys))
  .lpf(keys.vibes.cut).lpq(2)
  .attack(0.002).decay(keys.vibes.decay).sustain(0).release(0.5)
  .delay(keys.vibes.echo).delaytime(0.4375).delayfeedback(0.4)
  .room(verb.mul(tlOr('space', pure(1)))).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.3, 0.7))
  .filter(audible)

// VIBES · dense — только LOOP/vibes=dense; в SONG молчит
$: note(VIBES_B)
  .s('sine').fm(0.8).fmh(3.01)
  .gain(keys.vibes.vol.mul(0.8).mul(loopVibesB).mul(loopGate).mul(onKeys))
  .lpf(keys.vibes.cut).lpq(2)
  .attack(0.002).decay(keys.vibes.decay).sustain(0).release(0.5)
  .delay(keys.vibes.echo).delaytime(0.4375).delayfeedback(0.4)
  .room(verb.mul(tlOr('space', pure(1)))).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.3, 0.7))
  .filter(audible)

// SPARK — тот же солирующий голос октавой выше и в 2× чаще:
// плотность в кульминации растёт нотами. Вне кульминации — 0.
$: note(SPARK).fast(2)
  .s('triangle')
  .gain(keys.spark.vol.mul(tlOr('spark', loopSpark)).mul(onKeys))
  .lpf(keys.spark.cut).lpq(2)
  .attack(0.002).decay(keys.spark.decay).sustain(0).release(0.1)
  .delay(keys.spark.echo).delaytime(0.375).delayfeedback(0.35)
  .room(verb.mul(0.3).mul(tlOr('space', pure(1)))).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.25, 0.75))
  .orbit(3)
  .filter(audible)

// ══════════════════════════════════════════════════════════════════
//  СЦЕНЫ
// ══════════════════════════════════════════════════════════════════
// @scenes {"intro":{"mode":2,"harmony":0},"theme":{"mode":1,"harmony":1}}

// ══════════════════════════════════════════════════════════════════
//  ШПАРГАЛКА
// ══════════════════════════════════════════════════════════════════
//  Таймлайн уже ведёт форму; слайдеры — поверх.
//  вход:        drums.kick.vol 0.32 → low.sub.vol 0.3
//  низ:         moog.bass.vol 0.55; cut 57 → 70 (ярче), env 2.4 → 4
//  соло:        moog.lead.vol 0.22; cut 900 → 1800, res 6 → 10
//               (A искры / B плавно / C тема — переключает TIMELINE)
//  ответы:      keys.vibes.vol 0.2
//  кульминация: keys.spark.vol 0.18 + drums.rolls.vol 0.25 + perc.tom.vol 0.3
//  воздух:      atmos.air.vol 0.1, atmos.vinyl.vol 0.04
//  режимы:      mode 0 boom / 1 break / 2 half / 3 roll /
//               4 shuffle / 5 stutter / 6 broken / 7 open
//  гармония:    harmony 0 кварты / 1 9-е и 13-я
//  форма:       96 тактов: INTRO → BUILD A/B → BREAK A/B → RETURN →
//               CLIMAX A/B → DECAY → OUTRO A/B
// ══════════════════════════════════════════════════════════════════
