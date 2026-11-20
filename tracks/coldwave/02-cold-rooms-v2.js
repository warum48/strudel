// COLDWAVE 02 · COLD ROOMS v2 · 108 BPM
// Классический kit: TR-606 (kick/hats), LinnDrum (snare), TR-808 (rim/toms).
// Холодный пост-панк/минимал-вейв: механические барабаны, обрезанный бас,
// Juno-пэд, угловатая гитара, тонкий лид. Dm, почти статичная гармония.
// v2: CHORUS короче (8), на BREAK — редкое соло, на VERSE 2 — стена арпеджио.
// Гайд: docs/coldwave/README.md. Моды: 4 рисунка, состав не выключается.
setcpm(108 / 4)

if (typeof samples === 'function') {
  const CDN = 'https://cdn.jsdelivr.net/gh/tidalcycles/uzu-drumkit@main/'
  samples({
    bd: ['bd/11_bd_mot4i.wav'], sd: ['sd/11_sd_switchangel_3.wav'],
    rim: ['rim/10_rim_switchangel.wav'], hh: ['hh/10_hh_switchangel.wav'],
    oh: ['oh/10_oh_switchangel.wav'], lt: ['lt/10_lt_mot4i.wav'],
  }, CDN)
  // Грустная немецкая фраза (Рильке, public domain), локальный wav.
  samples({ rilke: ['https://cdn.jsdelivr.net/gh/warum48/strudel@main/samples/de-quote/rilke.wav'] })
}

// ── переключатели ────────────────────────────────────────────────
// @switches song=loop,song mode=machine,offbeat,half,toms
const song = slider(1, 0, 1, 1)   // SONG по форме; LOOP — без TIMELINE
const mode = slider(0, 0, 3, 1)   // четыре механических рисунка

// ── глобальные ───────────────────────────────────────────────────
const verb = slider(0.8, 0, 1, 0.01)
const tape = slider(0.5, 0, 1, 0.01)

const instruments = {
  drums: {
    name: 'Drums',
    kick: {
      name: 'Kick',
      vol: slider(0.42, 0, 0.8, 0.01),
      cut: slider(370, 60, 2000, 10),
      decay: slider(0.32, 0.08, 1, 0.01),
      tune: slider(0.95, 0.7, 1.2, 0.01),
    },
    snare: {
      name: 'Snare',
      vol: slider(0.57, 0, 1, 0.01),
      cut: slider(3500, 400, 9000, 100),
      decay: slider(0.18, 0.04, 0.6, 0.01),
      room: slider(0.7, 0, 1, 0.01),
    },
    rim: {
      name: 'Rim',
      vol: slider(0.2, 0, 0.6, 0.01),
      cut: slider(2800, 400, 9000, 100),
      decay: slider(0.06, 0.01, 0.2, 0.005),
      echo: slider(0.18, 0, 0.7, 0.01),
    },
    hat: {
      name: 'Hats',
      vol: slider(0.18, 0, 0.6, 0.01),
      cut: slider(7000, 800, 14000, 100),
      decay: slider(0.035, 0.01, 0.15, 0.005),
    },
    ohat: {
      name: 'Open hat',
      vol: slider(0.12, 0, 0.5, 0.01),
      cut: slider(5000, 800, 12000, 100),
      decay: slider(0.14, 0.03, 0.4, 0.01),
    },
    tom: {
      name: 'Toms',
      vol: slider(0.18, 0, 0.6, 0.01),
      cut: slider(1200, 200, 6000, 10),
      decay: slider(0.22, 0.05, 0.7, 0.01),
    },
  },
  low: {
    name: 'Low',
    bass: {
      name: 'Bass',
      vol: slider(0.55, 0, 1, 0.01),
      cut: slider(80, 40, 160, 1),
      res: slider(7, 0, 20, 0.5),
      env: slider(2.6, 0, 8, 0.1),
      decay: slider(0.12, 0.03, 0.5, 0.01),
    },
  },
  keys: {
    name: 'Keys',
    pad: {
      name: 'Juno pad',
      vol: slider(0.22, 0, 0.7, 0.01),
      cut: slider(1000, 100, 5000, 10),
      q: slider(2, 0, 12, 0.5),
      det: slider(0.12, 0, 0.4, 0.01),
      atk: slider(0.7, 0.1, 2, 0.01),
      rel: slider(3, 0.5, 6, 0.1),
    },
    guitar: {
      name: 'Guitar',
      vol: slider(0.48, 0, 0.7, 0.01),
      cut: slider(2760, 300, 9000, 20),
      chorus: slider(0.5, 0, 1, 0.01),
      decay: slider(0.15, 0.03, 0.5, 0.01),
      echo: slider(0.3, 0, 0.8, 0.01),
    },
    lead: {
      name: 'Mono lead',
      vol: slider(0.48, 0, 0.6, 0.01),
      cut: slider(2200, 300, 8000, 20),
      q: slider(5, 0, 16, 0.5),
      decay: slider(0.22, 0.05, 0.8, 0.01),
      echo: slider(0.4, 0, 0.8, 0.01),
    },
    wall: {
      name: 'String wall',
      vol: slider(0.14, 0, 0.6, 0.01),
      cut: slider(900, 100, 5000, 10),
      q: slider(1.5, 0, 12, 0.5),
      det: slider(0.2, 0, 0.6, 0.01),
      atk: slider(1.4, 0.2, 4, 0.1),
      rel: slider(3.5, 0.5, 6, 0.1),
    },
    arpwall: {
      name: 'Arp wall',
      vol: slider(0.13, 0, 0.5, 0.01),
      cut: slider(2400, 200, 9000, 20),
      decay: slider(0.06, 0.01, 0.3, 0.005),
      echo: slider(0.45, 0, 0.85, 0.01),
    },
    leadBreak: {
      name: 'Break lead',
      vol: slider(0.4, 0, 0.7, 0.01),
      cut: slider(1800, 200, 7000, 20),
      q: slider(6, 0, 16, 0.5),
      decay: slider(0.35, 0.05, 1, 0.01),
      echo: slider(0.55, 0, 0.9, 0.01),
    },
  },
  atmos: {
    name: 'Atmos',
    air: {
      name: 'Air',
      vol: slider(0.06, 0, 0.4, 0.01),
      cut: slider(600, 100, 8000, 20),
      lfo: slider(0.08, 0, 1, 0.01),
    },
    hiss: {
      name: 'Tape hiss',
      vol: slider(0.04, 0, 0.25, 0.01),
      cut: slider(3200, 300, 12000, 100),
    },
  },
  voice: {
    name: 'Voice',
    clean: {
      name: 'Clean phrase',
      vol: slider(0.16, 0, 0.8, 0.01),
      cut: slider(5000, 400, 12000, 20),
      speed: slider(1, 0.7, 1.3, 0.01),
      echo: slider(0.25, 0, 0.8, 0.01),
    },
    grain: {
      name: 'Grain texture',
      vol: slider(0.23, 0, 0.5, 0.01),
      // ── нарезка / скан сэмпла ──
      begin: slider(0, 0, 1, 0.01),       // окно в сэмпле
      end: slider(1, 0, 1, 0.01),
      slices: slider(55, 2, 64, 1),       // мелкость кусочков (striate)
      scan: slider(10, 1, 32, 1),         // за сколько циклов головка проходит сэмпл
      density: slider(2.7, 0.25, 4, 0.05), // плотность гранул (fast)
      speed: slider(1, 0.25, 2, 0.01),   // скорость = высота голоса
      clip: slider(1, 0.05, 2, 0.01),    // длина гранулы
      revProb: slider(0, 0, 1, 0.01),    // доля реверс-гранул
      // тембр/пространство
      cut: slider(3600, 300, 10000, 20),
      echo: slider(0.45, 0, 0.85, 0.01),
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
const { drums, low, keys, voice, atmos, fx } = instruments

// ── TIMELINE: 72 такта ───────────────────────────────────────────
const TIMELINE = [
  { at: 0,  len: 8,  name: 'INTRO',  values: { kick: 0, snare: 0, rim: 0, hat: 0.5, ohat: 0, tom: 0, bass: 0.6, pad: 1, guitar: 0, lead: 0, air: 1, hiss: 1, mode: 2, wall: 0, arpwall: 0, leadBreak: 0, voxClean: 0, voxGrain: 0  } },
  { at: 8,  len: 16, name: 'VERSE',  values: { kick: 1, snare: 1, rim: 0.4, hat: 1, ohat: 0.2, tom: 0, bass: 1, pad: 1, guitar: 0.6, lead: 0, air: 0.8, hiss: 0.8, mode: 0, wall: 0, arpwall: 0, leadBreak: 0, voxClean: 0, voxGrain: 0  } },
  { at: 24, len: 16, name: 'CHORUS', values: { kick: 1, snare: 1, rim: 0.6, hat: 1, ohat: 0.5, tom: 0.6, bass: 1, pad: 1, guitar: 1, lead: 1, air: 0.8, hiss: 0.7, mode: 1, wall: 0.8, arpwall: 0, leadBreak: 0, voxClean: 0, voxGrain: 0  } },
  { at: 40, len: 8,  name: 'BREAK',  values: { kick: 0, snare: 0, rim: 0, hat: 0.4, ohat: 0, tom: 0, bass: 0.8, pad: 1, guitar: 0.6, lead: 0, air: 1, hiss: 1, mode: 2, wall: 0.4, arpwall: 0, leadBreak: 1, voxClean: 0, voxGrain: 1  } },
  { at: 48, len: 16, name: 'VERSE 2',values: { kick: 1, snare: 1, rim: 0.4, hat: 1, ohat: 0.2, tom: 0.3, bass: 1, pad: 1, guitar: 0.7, lead: 0.4, air: 0.8, hiss: 0.8, mode: 1, wall: 0, arpwall: 1, leadBreak: 0, voxClean: 0, voxGrain: 0  } },
  { at: 64, len: 8,  name: 'OUTRO',  values: { kick: 0.4, snare: 0, rim: 0, hat: 0.3, ohat: 0, tom: 0, bass: 0.5, pad: 1, guitar: 0.4, lead: 0.2, air: 1.1, hiss: 1.1, mode: 3, wall: 0.6, arpwall: 0, leadBreak: 0, voxClean: 1, voxGrain: 0  } },
]
// ── AUTOMATION: множители к слайдерам во времени (нативно) ────────
// Читается и панелью (визуализация), и этим кодом (звук). В обычном
// Strudel работает так же: autoCurve строит arrange из saw.range/pure.
// Chorus 24–40: lead cut ×1 → ×2.4 (2200→5280) → ×1.
// Verse 2 48–64: lead снова; guitar ×2.3; arp wall vol ×2.75.
// Outro 64–72: lead/pad/wall/guitar cut плавно в минимум (×0.14 / ×0.1 / ×0.11).
const AUTOMATION = [
  { path: 'keys.lead.cut',    points: [[24, 1], [35, 2.4], [40, 1], [48, 1], [59, 2.4], [64, 1], [72, 0.14]] },
  { path: 'keys.guitar.cut',  points: [[48, 1], [59, 2.3], [64, 1], [72, 0.11]] },
  { path: 'keys.arpwall.vol', points: [[48, 1], [59, 2.75], [64, 1]] },
  { path: 'keys.pad.cut',     points: [[64, 1], [72, 0.1]] },
  { path: 'keys.wall.cut',    points: [[64, 1], [72, 0.11]] },
  // grain enters from silence: 1st bar of BREAK, 3rd beat → «и» 3-й (40.5→40.75).
  { path: 'voice.grain.vol',  points: [[40, 0], [40.5, 0], [40.75, 1], [48, 1]] },
]

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

const TL_TOTAL = Math.max(...TIMELINE.map((s) => s.at + s.len))
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
const songGate = song.fmap((v) => (v > 0.5 ? 1 : 0))
const loopGate = song.fmap((v) => (v > 0.5 ? 0 : 1))
const tlOr = (key, loopLevel = pure(1)) => tlCurve(key).mul(songGate).add(loopLevel.mul(loopGate))
// В SONG рисунок барабанов ведёт TIMELINE, в LOOP — ручка mode.
const modeAuto = tlCurve('mode').mul(songGate).add(mode.mul(loopGate))
const audible = (hap) => {
  const g = hap.value?.gain
  return typeof g !== 'number' || g > 0.001
}

// ── НОТЫ: Dm, модально; без поп-кадансов ─────────────────────────
const riff = note(m('d3 f3 a3 c4 a3 f3 d3 a3')) // узкий диапазон
const chords = note(m('<[d3,f3,a3] [d3,f3,a3] [bb2,d3,f3] [g2,bb2,d3]>'))

// ── РИТМЫ: mode 0..3, все слои остаются ──────────────────────────
const kickPat = modeAuto.pick([
  m('x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~'),
  m('x ~ ~ x ~ ~ x ~ x ~ ~ x ~ ~ x ~'),
  m('x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'),
  m('x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~'),
])
const snarePat = modeAuto.pick([
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ x'),
  m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'),
  m('~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ x ~'),
])
const hatPat = modeAuto.pick([
  m('x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~'),
  m('x x ~ x x ~ x x x ~ x x x ~ x ~'),
  m('x ~ ~ x ~ ~ x ~ x ~ ~ x ~ ~ x ~'),
  m('x ~ x x ~ x ~ x x ~ x ~ x x ~ ~'),
])
const bassPat = modeAuto.pick([
  m('x ~ ~ x ~ x ~ ~'),
  m('x ~ x ~ x ~ x x'),
  m('x ~ ~ ~ x ~ ~ ~'),
  m('x ~ x ~ ~ x ~ x'),
])

// ── СЛОИ ─────────────────────────────────────────────────────────
$: s('bd').bank('RolandTR606').struct(kickPat)
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .lpf(drums.kick.cut).lpq(1)
  .speed(drums.kick.tune)
  .decay(drums.kick.decay).sustain(0).release(0.04)
  .duckorbit(2).duckdepth(0.5).duckattack(0.01)
  .filter(audible)

$: s('sd').bank('LinnLM1').struct(snarePat)
  .gain(drums.snare.vol.mul(tlOr('snare')))
  .lpf(drums.snare.cut).lpq(2).hpf(180)
  .decay(drums.snare.decay).sustain(0).release(0.08)
  .room(verb.mul(drums.snare.room)).roomsize(fx.reverb.size)
  .filter(audible)

$: s('rim').bank('RolandTR808').struct(m('~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~ ~ x ~'))
  .gain(drums.rim.vol.mul(tlOr('rim')))
  .lpf(drums.rim.cut).hpf(500).lpq(2)
  .decay(drums.rim.decay).sustain(0)
  .delay(drums.rim.echo).delaytime(0.375).delayfeedback(0.3)
  .filter(audible)

$: s('hh').bank('RolandTR606').struct(hatPat)
  .gain(drums.hat.vol.mul(tlOr('hat')).mul(m('[1 .6 .8 .5]*4')))
  .lpf(drums.hat.cut).hpf(500)
  .decay(drums.hat.decay).sustain(0)
  .filter(audible)

$: s('oh').bank('RolandTR606').struct('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~')
  .gain(drums.ohat.vol.mul(tlOr('ohat')))
  .lpf(drums.ohat.cut).decay(drums.ohat.decay).sustain(0)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .filter(audible)

// Toms — заполнения в конце фраз, не в каждом такте.
$: s('lt').bank('RolandTR808').struct('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ x ~')
  .sometimesBy(0.5, (x) => x.struct('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ x x ~'))
  .gain(drums.tom.vol.mul(tlOr('tom')))
  .lpf(drums.tom.cut).lpq(2)
  .decay(drums.tom.decay).sustain(0)
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .filter(audible)

// Бас: обрезанный, повторяющийся; иногда октава.
$: note(m('<d1 d1 d1 d1>')).struct(bassPat)
  .sometimesBy(0.18, (x) => x.add(note(12)))
  .s('sawtooth').unison(1)
  .gain(low.bass.vol.mul(tlOr('bass')))
  .lpf(low.bass.cut.mul(perlin.slow(8).range(0.85, 1))).lpq(low.bass.res).ftype('24db')
  .lpenv(low.bass.env).lpa(0.003).lpd(low.bass.decay).lpsustain(0.2)
  .clip(0.9).decay(0.1).sustain(0.5).release(0.05)
  .orbit(2)
  .filter(audible)

// Juno-пэд: долгая атака/релиз, тёмный срез, один общий рум.
$: chords.slow(2)
  .s('sawtooth').unison(3).detune(keys.pad.det)
  .gain(keys.pad.vol.mul(tlOr('pad')))
  .lpf(keys.pad.cut.mul(autoCurve('keys.pad.cut')).mul(perlin.slow(16).range(0.8, 1.2))).lpq(keys.pad.q)
  .attack(keys.pad.atk).decay(1.4).sustain(0.85).release(keys.pad.rel)
  .chorus(0.35)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// Гитара: угловатый короткий плак, chorus и дилей.
$: riff.struct('~ ~ x ~ ~ x ~ ~ x ~ ~ x ~ ~ x ~')
  .sometimesBy(0.2, (x) => x.rev())
  .s('sawtooth').unison(1)
  .gain(keys.guitar.vol.mul(tlOr('guitar')))
  .lpf(keys.guitar.cut.mul(autoCurve('keys.guitar.cut'))).lpq(3)
  .chorus(keys.guitar.chorus)
  .attack(0.002).decay(keys.guitar.decay).sustain(0).release(0.08)
  .delay(keys.guitar.echo).delaytime(0.375).delayfeedback(0.35)
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .filter(audible)

// Моно-лид: редкая фраза, dotted-eighth delay.
$: riff.slow(2).struct('x ~ ~ ~ ~ x ~ ~')
  .s('square').unison(1)
  .gain(keys.lead.vol.mul(tlOr('lead')))
  .lpf(keys.lead.cut.mul(autoCurve('keys.lead.cut'))).lpq(keys.lead.q)
  .attack(0.01).decay(keys.lead.decay).sustain(0.3).release(0.2)
  .delay(keys.lead.echo).delaytime(0.375).delayfeedback(0.45)
  .room(verb.mul(0.7)).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.4, 0.6))
  .filter(audible)

// Стена: вторая октава пэда, появляется к середине (lane wall).
$: chords.slow(2).add(note(12))
  .s('sawtooth').unison(4).detune(keys.wall.det)
  .gain(keys.wall.vol.mul(tlOr('wall')))
  .lpf(keys.wall.cut.mul(autoCurve('keys.wall.cut'))).lpq(keys.wall.q)
  .attack(keys.wall.atk).decay(2).sustain(0.8).release(keys.wall.rel)
  .chorus(0.4)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// Стена арпеджио: та же строка в 4× быстрее, высоко, в дилее. Только VERSE 2.
$: riff.fast(4).add(note(12)).degradeBy(0.1)
  .sometimesBy(0.2, (x) => x.rev())
  .s('sawtooth').unison(1)
  .gain(keys.arpwall.vol.mul(autoCurve('keys.arpwall.vol')).mul(tlOr('arpwall')))
  .lpf(keys.arpwall.cut).lpq(2)
  .attack(0.002).decay(keys.arpwall.decay).sustain(0).release(0.05)
  .delay(keys.arpwall.echo).delaytime(0.375).delayfeedback(0.5)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.3, 0.7))
  .filter(audible)

// Break lead: редкая фраза вместо основного лида (только BREAK).
$: riff.slow(2).struct('x ~ ~ ~ ~ ~ ~ ~')
  .s('square').unison(1)
  .gain(keys.leadBreak.vol.mul(tlOr('leadBreak')))
  .lpf(keys.leadBreak.cut).lpq(keys.leadBreak.q)
  .attack(0.02).decay(keys.leadBreak.decay).sustain(0.2).release(0.4)
  .delay(keys.leadBreak.echo).delaytime(0.375).delayfeedback(0.5)
  .room(verb.mul(0.8)).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.4, 0.6))
  .filter(audible)

// ГОЛОС: чистая фраза целиком — один раз в начале OUTRO (узнаваемо).
$: s('rilke').struct('<x ~ ~ ~ ~ ~ ~ ~>')
  .speed(voice.clean.speed)
  .gain(voice.clean.vol.mul(tlOr('voxClean')))
  .lpf(voice.clean.cut).hpf(120)
  .delay(voice.clean.echo).delaytime(0.375).delayfeedback(0.25)
  .room(verb.mul(0.45)).roomsize(fx.reverb.size)
  .filter(audible)

// ГОЛОС: гранулярное облако поверх брейка; можно замьютить M, оставив clean.
$: s('rilke')
  .begin(voice.grain.begin).end(voice.grain.end)
  .striate(voice.grain.slices)
  .slow(voice.grain.scan)
  .fast(voice.grain.density)
  .speed(voice.grain.speed)
  .clip(voice.grain.clip)
  .sometimesBy(voice.grain.revProb, (x) => x.rev())
  .gain(voice.grain.vol.mul(autoCurve('voice.grain.vol')).mul(tlOr('voxGrain')))
  .lpf(voice.grain.cut).hpf(160)
  .delay(voice.grain.echo).delaytime(0.375).delayfeedback(0.4)
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .pan(sine.slow(8).range(0.3, 0.7))

// Воздух и лента.
$: s('pink').struct('x*16')
  .gain(atmos.air.vol.mul(tlOr('air')))
  .lpf(atmos.air.cut.mul(atmos.air.lfo.fmap((v) => 0.5 + v * 6))).hpf(200)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

$: s('crackle').struct('x*16')
  .gain(atmos.hiss.vol.mul(tape).mul(tlOr('hiss')))
  .lpf(atmos.hiss.cut).hpf(400)
  .room(verb.mul(0.2)).roomsize(fx.reverb.size)
  .filter(audible)

// ──────────────────────────────────────────────────────────────────
//  Если тормозит: verb → 0.3, room size 10 → 6, убери «tape» crackle,
//  затем гитару/лид. Один общий roomsize уже выставлен — не плоди IR.
//  LOOP — постоянный микс, SONG — форма. Запись: прогрев 8–16 тактов.
