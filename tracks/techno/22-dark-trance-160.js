// TECHNO 22 · DARK TRANCE 160 · e-фригийский
// Форма живёт в TIMELINE: панель рисует секции и даёт править уровни.
// INTRO → BUILD → ROLL → DROP → BREAK → DROP2 → OUTRO (72 такта).
// Габбер-бочка: удар на «и» 4-й (шаг 14) каждый 4-й такт.
setcpm(160 / 4)

if (typeof samples === 'function') {
  const CDN = 'https://cdn.jsdelivr.net/gh/tidalcycles/uzu-drumkit@main/'
  samples({
    bd: ['bd/11_bd_mot4i.wav'], cp: ['cp/10_cp_switchangel.wav'],
    hh: ['hh/10_hh_switchangel.wav', 'hh/11_hh_mot4i.wav'],
    oh: ['oh/10_oh_switchangel.wav'], rim: ['rim/10_rim_switchangel.wav'],
  }, CDN)
  // Локальный голос: Кафка, «Ein Käfig ging einen Vogel suchen.»
  // public domain; wav сгенерирован macOS `say`, лежит в samples/de-quote.
  samples({ dequote: ['samples/de-quote/kafka.wav'] }, './')
}

const verb = slider(0.6, 0, 1, 0.01)  // только мастер-реверб; тон — в дереве

// Два бас-рисунка: твой «x ~ x x» и классический psy KBBB (kick-bass-bass-bass).
// @switches song=loop,song bass=user,roll
const song = slider(0, 0, 1, 1)   // LOOP — без TIMELINE, SONG — с формой
const bass = slider(0, 0, 1, 1)
const bassPat = bass.pick([
  m('x ~ x x x ~ x x x ~ x x x ~ x x'),   // твой: удар на доле, пропуск, два 16-х
  m('~ x x x ~ x x x ~ x x x ~ x x x'),   // KBBB: три 16-х после кика
])

const instruments = {
  drums: {
    name: 'Drums',
    kick: {
      name: 'Kick',
      vol: slider(0.46, 0, 0.8, 0.01),
      cut: slider(160, 60, 2000, 10),
      drive: slider(0.4, 0, 1, 0.01),      // distort = drive × 6
      decay: slider(0.32, 0.1, 1, 0.01),
      tune: slider(1, 0.6, 1.3, 0.01),
    },
    hats: {
      name: 'Hats',
      vol: slider(0.3, 0, 0.7, 0.01),
      cut: slider(9000, 1000, 16000, 100),
      decay: slider(0.03, 0.01, 0.15, 0.005),
    },
    oh: {
      name: 'Open hat',
      vol: slider(0.14, 0, 0.5, 0.01),
      cut: slider(6000, 800, 16000, 100),
      decay: slider(0.12, 0.03, 0.5, 0.01),
    },
    clap: {
      name: 'Clap',
      vol: slider(0.42, 0, 0.7, 0.01),
      cut: slider(3600, 600, 12000, 100),
      decay: slider(0.13, 0.03, 0.4, 0.01),
    },
    rim: {
      name: 'Rim',
      vol: slider(0.18, 0, 0.6, 0.01),
      cut: slider(3000, 400, 12000, 100),
      decay: slider(0.05, 0.01, 0.2, 0.005),
      echo: slider(0.2, 0, 0.7, 0.01),
    },
  },
  low: {
    name: 'Low',
    bass: {
      name: 'Bass',
      vol: slider(0.58, 0, 1, 0.01),
      cut: slider(80, 40, 220, 1),         // верхняя граница поднята: 220
      res: slider(12, 0, 20, 0.5),
      env: slider(3.6, 0, 8, 0.1),
      decay: slider(0.09, 0.03, 0.6, 0.01),
      drive: slider(1.6, 0, 4, 0.05),      // сатурация psy-баса
      det: slider(0.07, 0, 0.2, 0.005),    // расстройка унисона
    },
    sub: {
      name: 'Sub',
      vol: slider(0.3, 0, 1, 0.01),
      cut: slider(80, 40, 120, 1),
      decay: slider(0.2, 0.05, 0.8, 0.01),
    },
  },
  keys: {
    name: 'Keys',
    pad: {
      name: 'Pad',
      vol: slider(0.17, 0, 0.7, 0.01),
      cut: slider(700, 80, 5000, 10),
      res: slider(5, 0, 20, 0.5),
      det: slider(0.35, 0, 0.6, 0.01),
      atk: slider(2, 0.1, 6, 0.1),
      rel: slider(3, 0.2, 8, 0.1),
    },
    drone: {
      name: 'Drone',
      vol: slider(0.1, 0, 0.5, 0.01),
      cut: slider(140, 50, 1000, 5),
      det: slider(0.08, 0, 0.4, 0.01),
    },
    lead: {
      name: 'Acid',
      vol: slider(0.16, 0, 0.6, 0.01),
      cut: slider(900, 150, 6000, 10),     // ниже прошлого (было ~2200)
      res: slider(14, 0, 20, 0.5),
      env: slider(4, 0, 8, 0.1),
      decay: slider(0.08, 0.02, 0.4, 0.005),
      echo: slider(0.45, 0, 0.85, 0.01),
    },
  },
  atmos: {
    name: 'Atmos',
    air: {
      name: 'Air',
      vol: slider(1, 0, 2, 0.01),
      cut: slider(9000, 1000, 16000, 100),
      lfo: slider(1, 0, 4, 0.05),
    },
  },
  vox: {
    name: 'Vox',
    quote: {
      name: 'Kafka (de)',
      vol: slider(0.35, 0, 1, 0.01),
      // ── нарезка сэмпла: длина куска, скорость, гранулы ──
      begin: slider(0, 0, 1, 0.01),
      end: slider(1, 0, 1, 0.01),
      speed: slider(1, 0.5, 1.6, 0.01),
      striate: slider(24, 4, 64, 1),
      clip: slider(1, 0.05, 2, 0.01),
      // ── тембр ──
      cut: slider(4200, 400, 14000, 20),
      hpf: slider(180, 40, 1200, 10),
      res: slider(1, 0, 16, 0.5),
      // ── пространство и вариативность ──
      pan: slider(0, 0, 1, 0.01),
      echo: slider(0.35, 0, 0.8, 0.01),
      delaytime: slider(0.375, 0.0625, 0.75, 0.0625),
      delayfb: slider(0.4, 0, 0.85, 0.01),
      room: slider(0.6, 0, 1, 0.01),
      revProb: slider(0.3, 0, 1, 0.01),
      degradeBy: slider(0, 0, 0.8, 0.01),
    },
  },
  fx: {
    name: 'FX',
    reverb: {
      name: 'Reverb',
      size: slider(10, 2, 20, 0.5),
    },
  },
}
const { drums, low, keys, atmos, vox, fx } = instruments

// ── TIMELINE: 72 такта, values — множители к громкостям ───────────
const TIMELINE = [
  { at: 0,  len: 8,  name: 'INTRO',  values: { kick: 1, gab: 0, hats: 1, oh: 0, clap: 0, rim: 0, bass: 0, pad: 1, drone: 0, lead: 0, air: 1, vox: 0 } },
  { at: 8,  len: 8,  name: 'BUILD',  values: { kick: 1, gab: 0, hats: 1, oh: 0, clap: 0, rim: 1, bass: 1, pad: 1, drone: 0, lead: 0, air: 1, vox: 0 } },
  { at: 16, len: 8,  name: 'ROLL',   values: { kick: 1, gab: 0, hats: 1, oh: 0, clap: 1, rim: 1, bass: 1, pad: 1, drone: 0, lead: 1, air: 1, vox: 0 } },
  { at: 24, len: 16, name: 'DROP',   values: { kick: 1, gab: 1, hats: 1, oh: 1, clap: 1, rim: 1, bass: 1, pad: 1, drone: 0, lead: 1, air: 1, vox: 0 } },
  { at: 40, len: 8,  name: 'BREAK',  values: { kick: 0, gab: 0, hats: 0, oh: 0, clap: 0, rim: 0, bass: 0, pad: 1, drone: 1, lead: 1, air: 1, vox: 1 } },
  { at: 48, len: 16, name: 'DROP 2', values: { kick: 1, gab: 1, hats: 1, oh: 1, clap: 1, rim: 1, bass: 1, pad: 1, drone: 0, lead: 1, air: 1, vox: 0 } },
  { at: 64, len: 8,  name: 'OUTRO',  values: { kick: 1, gab: 0, hats: 1, oh: 0, clap: 0, rim: 0, bass: 0, pad: 1, drone: 0, lead: 0, air: 1, vox: 0 } },
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
// SONG — уровень из TIMELINE; LOOP — постоянный (по умолчанию 1).
const tlOr = (key, loopLevel = pure(1)) => tlCurve(key).mul(songGate).add(loopLevel.mul(loopGate))

const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}

// ── НОТЫ: e-фригийский, b2=f, тритон=bb ───────────────────────────
const riff = note(m('e2 e2 f2 g2 bb2 a2 g2 f2'))
const acid = riff.fast(2)
  .sometimesBy(0.22, (x) => x.add(note(1)))
  .sometimesBy(0.14, (x) => x.add(note(6)))
  .degradeBy(0.08)
const PAD = note(m('<[e3,f3,bb3] [e3,f3,b3] [e3,g3,bb3] [f3,ab3,b3]>'))

// ── СЛОИ (каждый со своей ручкой громкости) ──────────────────────
$: s('bd').struct('x*4')
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .lpf(drums.kick.cut).lpq(1).distort(drums.kick.drive.mul(6))
  .speed(drums.kick.tune)
  .decay(drums.kick.decay).sustain(0).release(0.05)
  .duckorbit(2).duckdepth(0.8).duckattack(0.02)
  .filter(audible)

// Габбер — полная копия кика (тот же звук и цепь), только другой рисунок:
// удар на «и» 4-й (шаг 14) раз в 4 такта, гейт `gab` в TIMELINE.
$: s('bd').struct('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~').mask('<0 0 0 1>')
  .gain(drums.kick.vol.mul(tlOr('gab')))
  .lpf(drums.kick.cut).lpq(1).distort(drums.kick.drive.mul(6))
  .speed(drums.kick.tune)
  .decay(drums.kick.decay).sustain(0).release(0.05)
  .duckorbit(2).duckdepth(0.8).duckattack(0.02)
  .filter(audible)

$: s('hh').struct('x*16').n(run(8))
  .every(16, (x) => x.stut(3, 1/32, 0.9))
  .gain(drums.hats.vol.mul(tlOr('hats')).mul(m('[.85 .25 .5 .3]*4')))
  .lpf(drums.hats.cut).hpf(900).clip(sine.slow(8).range(0.08, 0.3))
  .decay(drums.hats.decay).sustain(0).swingBy(0.07, 8)
  .filter(audible)

$: s('oh').struct('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~')
  .gain(drums.oh.vol.mul(tlOr('oh')))
  .lpf(drums.oh.cut).decay(drums.oh.decay).sustain(0)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .filter(audible)

$: s('cp').struct('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~')
  .sometimesBy(0.3, (x) => x.stut(2, 1/16, 0.85))
  .gain(drums.clap.vol.mul(tlOr('clap')))
  .lpf(drums.clap.cut).lpq(3).decay(drums.clap.decay).sustain(0)
  .room(verb.mul(0.55)).roomsize(fx.reverb.size)
  .filter(audible)

$: s('rim').struct('~ ~ ~ x ~ ~ x ~ ~ x ~ ~ x ~ ~ ~')
  .gain(drums.rim.vol.mul(tlOr('rim')))
  .lpf(drums.rim.cut).hpf(600).decay(drums.rim.decay).sustain(0)
  .delay(drums.rim.echo).delaytime(0.375).delayfeedback(0.3)
  .filter(audible)

$: note(m('<e1 e1 f1 bb1>')).struct(bassPat)
  .sometimesBy(0.18, (x) => x.add(note(12)))
  .s('sawtooth').unison(3).detune(low.bass.det)
  .gain(low.bass.vol.mul(tlOr('bass')))
  .lpf(low.bass.cut.mul(perlin.slow(8).range(0.8, 1.1))).lpq(low.bass.res).ftype('24db')
  .lpenv(low.bass.env).lpa(0.004).lpd(low.bass.decay).lpsustain(0.1)
  .distort(low.bass.drive)
  .clip(0.92)
  .attack(0.002).decay(0.09).sustain(0.2).release(0.04)
  .orbit(2)
  .filter(audible)

// SUB — низкая копия того же рисунка: вес, которого не хватало.
$: note(m('<e1 e1 f1 bb1>')).struct(bassPat)
  .s('sine')
  .gain(low.sub.vol.mul(tlOr('bass')))
  .lpf(low.sub.cut).lpq(1)
  .attack(0.004).decay(low.sub.decay).sustain(0.4).release(0.08)
  .orbit(2)
  .filter(audible)

$: PAD.slow(2)
  .s('supersaw').unison(5).detune(keys.pad.det)
  .gain(keys.pad.vol.mul(tlOr('pad')))
  .lpf(keys.pad.cut.mul(perlin.slow(16).range(0.6, 1.4))).lpq(keys.pad.res)
  .attack(keys.pad.atk).decay(1.4).sustain(0.85).release(keys.pad.rel)
  .room(verb.mul(0.9)).roomsize(fx.reverb.size)
  .filter(audible)

$: note(m('<[e2,bb2] [e2,b2] [e2,bb2] [f2,b2]>')).slow(2)
  .s('sawtooth').unison(2).detune(keys.drone.det)
  .gain(keys.drone.vol.mul(tlOr('drone')))
  .lpf(keys.drone.cut).lpq(2)
  .attack(3).decay(2).sustain(0.9).release(4)
  .room(verb.mul(1)).roomsize(fx.reverb.size)
  .filter(audible)

$: acid
  .s('square').gain(keys.lead.vol.mul(tlOr('lead')))
  .lpf(keys.lead.cut.mul(perlin.slow(8).range(0.45, 1.15))).lpq(keys.lead.res).ftype('24db')
  .lpenv(keys.lead.env).lpa(0.003).lpd(keys.lead.decay).lpsustain(0.15)
  .decay(0.06).sustain(0.3).release(0.04)
  .delay(keys.lead.echo).delaytime(0.375).delayfeedback(0.55)
  .room(verb.mul(0.65)).roomsize(fx.reverb.size)
  .juxBy(0.2, rev)
  .filter(audible)

$: s('pink').struct('x*16')
  .gain(atmos.air.vol.mul(tlOr('air')).mul(perlin.slow(atmos.air.lfo).range(0.004, 0.035)))
  .hpf(sine.slow(8).range(220, 5200)).lpf(atmos.air.cut)
  .room(verb.mul(1.1)).roomsize(fx.reverb.size)
  .filter(audible)

// ГОЛОС — немецкая цитата Кафки, грануляр (`striate`): облако осколков.
$: s('dequote')
  .begin(vox.quote.begin).end(vox.quote.end)
  .striate(vox.quote.striate).slow(4)
  .speed(vox.quote.speed).clip(vox.quote.clip)
  .sometimesBy(vox.quote.revProb, (x) => x.rev())
  .degradeBy(vox.quote.degradeBy)
  .gain(vox.quote.vol.mul(tlOr('vox')))
  .lpf(vox.quote.cut).lpq(vox.quote.res).hpf(vox.quote.hpf)
  .pan(vox.quote.pan)
  .delay(vox.quote.echo).delaytime(vox.quote.delaytime).delayfeedback(vox.quote.delayfb)
  .room(verb.mul(vox.quote.room)).roomsize(fx.reverb.size)
  .filter(audible)

// ──────────────────────────────────────────────────────────────────
//  TIMELINE виден и правится в панели: значения — множители громкости
//  (0 = слой молчит в секции). Секции ступенчатые; правки применяются
//  на границах секций. Если тормозит: убери `gab`/`lead`, затем `stut`,
//  затем снизь `fx.reverb.size`/`verb`. Габбер — один удар раз в 4 такта.
//  Запись: прогрев 8–16 тактов, закрыть вкладки со звуком.
