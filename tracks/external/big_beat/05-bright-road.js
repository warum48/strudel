// ============================================================
//  VOIDFIRE v2 · EXTENDED · big beat / rave · 140 BPM · E minor
//  128 bars (~3:40): chopped Amen break, siren zone, FX, 3 drops
// ============================================================
setcps(140 / 60 / 4)

// Amen slices come from the default dirt-samples bank ('amencutup').
// If the break is silent, set AMEN = 'amn' (same slices, jsDelivr mirror).
const AMEN = 'amencutup'
if (typeof samples === 'function') {
  samples({
    amn: [
    'amencutup/000_AMENCUT_001.wav',
    'amencutup/001_AMENCUT_002.wav',
    'amencutup/002_AMENCUT_003.wav',
    'amencutup/003_AMENCUT_004.wav',
    'amencutup/004_AMENCUT_005.wav',
    'amencutup/005_AMENCUT_006.wav',
    'amencutup/006_AMENCUT_007.wav',
    'amencutup/007_AMENCUT_008.wav',
    'amencutup/008_AMENCUT_009.wav',
    'amencutup/009_AMENCUT_010.wav',
    'amencutup/010_AMENCUT_011.wav',
    'amencutup/011_AMENCUT_012.wav',
    'amencutup/012_AMENCUT_013.wav',
    'amencutup/013_AMENCUT_014.wav',
    'amencutup/014_AMENCUT_015.wav',
    'amencutup/015_AMENCUT_016.wav',
    'amencutup/016_AMENCUT_017.wav',
    'amencutup/017_AMENCUT_018.wav',
    'amencutup/018_AMENCUT_019.wav',
    'amencutup/019_AMENCUT_020.wav',
    'amencutup/020_AMENCUT_021.wav',
    'amencutup/021_AMENCUT_022.wav',
    'amencutup/022_AMENCUT_023.wav',
    'amencutup/023_AMENCUT_024.wav',
    'amencutup/024_AMENCUT_025.wav',
    'amencutup/025_AMENCUT_026.wav',
    'amencutup/026_AMENCUT_027.wav',
    'amencutup/027_AMENCUT_028.wav',
    'amencutup/028_AMENCUT_029.wav',
    'amencutup/029_AMENCUT_030.wav',
    'amencutup/030_AMENCUT_031.wav',
    'amencutup/031_AMENCUT_032.wav'
    ],
  }, 'https://cdn.jsdelivr.net/gh/tidalcycles/Dirt-Samples@master/')
}

// ---------- GLOBAL KNOBS ----------
const grit = slider(0.35, 0, 1, 0.01)   // overall saturation on drums
const verb = slider(0.15, 0, 1, 0.01)   // global room

// @switches song=loop,song riff=omen,fire,half chopMode=seq,rand
const song = slider(1, 0, 1, 1)
const riff = slider(0, 0, 2, 1)
const chopMode = slider(0, 0, 1, 1)

// @mutes muteDrums,muteLow,muteLead
const muteDrums = slider(0, 0, 1, 1)
const muteLow = slider(0, 0, 1, 1)
const muteLead = slider(0, 0, 1, 1)

// @scenes {"clean":{"grit":0.15,"low.bass.drive":2,"drums.amen.vol":0.35,"lead.acid.cut":600},"rave":{"grit":0.35,"low.bass.drive":3.5,"drums.amen.vol":0.5,"lead.acid.cut":1100},"insane":{"grit":0.7,"low.bass.drive":6.5,"drums.amen.vol":0.75,"lead.acid.cut":1800,"lead.acid.res":14,"lead.stab.vol":0.6},"sirens":{"lead.siren.vol":0.5,"lead.yelp.vol":0.4,"lead.zap.vol":0.5,"lead.jet.vol":0.35}}

// ---------- MIXER / TONE TREE ----------
const instruments = {
  drums: {
    name: 'Drums',
    kick: {
      name: 'Kick',
      mute: 'muteDrums',
      vol: slider(0.95, 0, 1, 0.01),
      cut: slider(2400, 300, 8000, 50),
    },
    snare: {
      name: 'Snare',
      mute: 'muteDrums',
      vol: slider(0.8, 0, 1, 0.01),
      cut: slider(7000, 800, 16000, 100),
    },
    clap: {
      name: 'Clap',
      mute: 'muteDrums',
      vol: slider(0.45, 0, 1, 0.01),
    },
    hats: {
      name: 'Hats',
      mute: 'muteDrums',
      vol: slider(0.4, 0, 1, 0.01),
      cut: slider(11000, 1500, 16000, 100),
    },
    amen: {
      name: 'Amen Chops',
      mute: 'muteDrums',
      vol: slider(0.5, 0, 1, 0.01),
      cut: slider(9000, 800, 16000, 100),
      crush: slider(8, 2, 16, 1),
    },
    roll: {
      name: 'Roll',
      mute: 'muteDrums',
      vol: slider(0.65, 0, 1, 0.01),
    },
    crash: {
      name: 'Crash',
      mute: 'muteDrums',
      vol: slider(0.4, 0, 1, 0.01),
    },
  },
  low: {
    name: 'Low',
    bass: {
      name: 'Bass',
      mute: 'muteLow',
      vol: slider(0.67, 0, 1, 0.01),
      cut: slider(700, 120, 4000, 10),
      drive: slider(3.5, 0, 10, 0.1),
    },
    sub: {
      name: 'Sub',
      mute: 'muteLow',
      vol: slider(0.52, 0, 1, 0.01),
    },
  },
  lead: {
    name: 'Lead',
    acid: {
      name: 'Acid 303',
      mute: 'muteLead',
      vol: slider(0.38, 0, 1, 0.01),
      cut: slider(900, 150, 5000, 10),
      res: slider(11, 0, 25, 0.5),
    },
    stab: {
      name: 'Rave Stab',
      mute: 'muteLead',
      vol: slider(0.71, 0, 1, 0.01),
      cut: slider(3800, 500, 12000, 100),
      detune: slider(0.45, 0, 1.5, 0.01),
    },
    hoover: {
      name: 'Hoover',
      mute: 'muteLead',
      vol: slider(0.8, 0, 1, 0.01),
      cut: slider(4500, 600, 12000, 100),
    },
    siren: {
      name: 'Siren Wail',
      mute: 'muteLead',
      vol: slider(0.79, 0, 1, 0.01),
      cut: slider(5000, 800, 12000, 100),
    },
    yelp: {
      name: 'Siren Yelp',
      mute: 'muteLead',
      vol: slider(0.69, 0, 1, 0.01),
      cut: slider(6000, 800, 12000, 100),
    },
    zap: {
      name: 'Laser Zap',
      mute: 'muteLead',
      vol: slider(0.68, 0, 1, 0.01),
    },
    jet: {
      name: 'Jet Sweep',
      mute: 'muteLead',
      vol: slider(0.67, 0, 1, 0.01),
    },
    riser: {
      name: 'Riser',
      mute: 'muteLead',
      vol: slider(0.69, 0, 1, 0.01),
    },
  },
}
const { drums, low, lead } = instruments

// ---------- ARRANGEMENT (bars) ----------
const TIMELINE = [
  { at: 0, len: 8, name: 'INTRO', values: { kick: 0, snare: 0, clap: 0, hats: 1, roll: 0, half: 0, amen: 1.5, crash: 0, rev: 0, bass: 0, sub: 0, riff: 0, chop: 0, acid: 1, stab: 0, hoover: 0, siren: 0, yelp: 0, zap: 0, jet: 0, riser: 1 } },
  { at: 8, len: 8, name: 'GROOVE', values: { kick: 1, snare: 1, clap: 0, hats: 1, roll: 0, half: 0, amen: 0.8, crash: 1, rev: 0, bass: 0, sub: 0, riff: 0, chop: 0, acid: 1, stab: 0, hoover: 0, siren: 0, yelp: 0, zap: 1, jet: 0, riser: 0 } },
  { at: 16, len: 16, name: 'DROP 1', values: { kick: 1, snare: 1, clap: 1, hats: 1, roll: 0, half: 0, amen: 0.6, crash: 1, rev: 0, bass: 1, sub: 1, riff: 0, chop: 0, acid: 1, stab: 1, hoover: 0, siren: 0, yelp: 0, zap: 1, jet: 0, riser: 0 } },
  { at: 32, len: 8, name: 'BREAK 1', values: { kick: 0, snare: 0, clap: 0, hats: 0, roll: 0, half: 0, amen: 0, crash: 1, rev: 0, bass: 0, sub: 0, riff: 0, chop: 0, acid: 1, stab: 1, hoover: 0, siren: 1, yelp: 0, zap: 1, jet: 1, riser: 1 } },
  { at: 40, len: 8, name: 'BUILD 1', values: { kick: 0, snare: 0, clap: 0, hats: 0, roll: 1, half: 0, amen: 0, crash: 0, rev: 1, bass: 0, sub: 0, riff: 0, chop: 0, acid: 1, stab: 0, hoover: 0, siren: 1, yelp: 1, zap: 1, jet: 1, riser: 1 } },
  { at: 48, len: 16, name: 'DROP 2', values: { kick: 1, snare: 1, clap: 1, hats: 1, roll: 0, half: 0, amen: 1, crash: 1, rev: 0, bass: 1, sub: 1, riff: 1, chop: 1, acid: 1, stab: 1, hoover: 0, siren: 0, yelp: 0, zap: 1, jet: 0, riser: 0 } },
  { at: 64, len: 8, name: 'SIREN ZONE A', values: { kick: 0, snare: 0, clap: 1, hats: 1, roll: 0, half: 1, amen: 1, crash: 1, rev: 0, bass: 1, sub: 1, riff: 2, chop: 1, acid: 1, stab: 0, hoover: 0, siren: 1, yelp: 1, zap: 1, jet: 1, riser: 0 } },
  { at: 72, len: 8, name: 'SIREN ZONE B', values: { kick: 1, snare: 1, clap: 1, hats: 1, roll: 0, half: 0, amen: 1, crash: 1, rev: 0, bass: 1, sub: 1, riff: 1, chop: 1, acid: 1, stab: 1, hoover: 1, siren: 1, yelp: 1, zap: 1, jet: 1, riser: 0 } },
  { at: 80, len: 8, name: 'BREAK 2', values: { kick: 0, snare: 0, clap: 0, hats: 0, roll: 0, half: 0, amen: 0, crash: 1, rev: 0, bass: 0, sub: 0, riff: 0, chop: 0, acid: 1, stab: 1, hoover: 1, siren: 0, yelp: 0, zap: 1, jet: 0, riser: 1 } },
  { at: 88, len: 8, name: 'BUILD 2', values: { kick: 0, snare: 0, clap: 0, hats: 0, roll: 1, half: 0, amen: 1, crash: 0, rev: 1, bass: 0, sub: 0, riff: 0, chop: 1, acid: 1, stab: 0, hoover: 1, siren: 1, yelp: 1, zap: 1, jet: 1, riser: 1 } },
  { at: 96, len: 16, name: 'DROP 3', values: { kick: 1, snare: 1, clap: 1, hats: 1, roll: 0, half: 0, amen: 1.1, crash: 1, rev: 0, bass: 1, sub: 1, riff: 1, chop: 1, acid: 1, stab: 1, hoover: 1, siren: 1, yelp: 0, zap: 1, jet: 0, riser: 0 } },
  { at: 112, len: 8, name: 'LAST HIT', values: { kick: 1, snare: 1, clap: 1, hats: 1, roll: 0, half: 0, amen: 1, crash: 1, rev: 0, bass: 1, sub: 1, riff: 0, chop: 0, acid: 1, stab: 0, hoover: 0, siren: 0, yelp: 0, zap: 1, jet: 0, riser: 0 } },
  { at: 120, len: 8, name: 'OUTRO', values: { kick: 1, snare: 1, clap: 0, hats: 1, roll: 0, half: 0, amen: 0.8, crash: 0, rev: 0, bass: 0, sub: 0, riff: 0, chop: 0, acid: 1, stab: 0, hoover: 0, siren: 0, yelp: 0, zap: 0, jet: 0, riser: 0 } },
]
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

// LOOP = groove loop, SONG = full arrangement
const songGate = song.fmap((v) => (v > 0.5 ? 1 : 0))
const loopGate = song.fmap((v) => (v > 0.5 ? 0 : 1))
const tlOr = (key, loopLevel = pure(1)) =>
  tlCurve(key).mul(songGate).add(loopLevel.mul(loopGate))

// riff / chop selection: timeline in SONG mode, switches in LOOP mode
const pickTl = (key, sw) => tlCurve(key).mul(songGate).add(sw.mul(loopGate))
const isRiff = (n) => pickTl('riff', riff).fmap((v) => (Math.round(v) === n ? 1 : 0))
const isChop = (n) => pickTl('chop', chopMode).fmap((v) => (Math.round(v) === n ? 1 : 0))

// ---------- AUTOMATION (multipliers on cutoffs) ----------
const AUTOMATION = [
  { path: 'lead.acid.cut', points: [[0, 0.3], [8, 0.5], [16, 0.6], [28, 2.4], [32, 0.4], [40, 0.4], [47, 2.8], [48, 0.8], [60, 2.6], [64, 0.7], [72, 1.5], [80, 0.5], [88, 0.5], [95, 3], [96, 1.2], [110, 3], [112, 0.6], [120, 0.3], [128, 0.2]] },
  { path: 'low.bass.cut',  points: [[0, 0.5], [16, 1], [32, 1], [40, 0.4], [48, 1.1], [64, 0.7], [72, 1.2], [96, 1.4], [112, 1], [120, 0.5], [128, 0.5]] },
  { path: 'lead.stab.cut', points: [[0, 0.5], [48, 0.6], [64, 0.5], [72, 1.4], [80, 0.6], [96, 1.5], [112, 0.5], [128, 0.5]] },
]
const autoCurve = (path) => {
  const pts = AUTOMATION.find((a) => a.path === path)?.points || []
  const segs = []
  let pos = 0
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, va] = pts[i], [b, vb] = pts[i + 1]
    if (a > pos) segs.push([a - pos, pure(va)])
    if (b > a) segs.push([b - a, va === vb ? pure(va) : saw.range(va, vb).slow(b - a)])
    pos = b
  }
  if (pos < TL_TOTAL) segs.push([TL_TOTAL - pos, pure(pts.at(-1)[1])])
  return arrange(...segs)
}

// ---------- MUTE GATES ----------
const onDrums = muteDrums.fmap((v) => 1 - v)
const onLow = muteLow.fmap((v) => 1 - v)
const onLead = muteLead.fmap((v) => 1 - v)

// ============================================================
//  DRUMS
// ============================================================
// main kick (4-bar cycle, last bar = double-kick turnaround)
$: s('<[bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~] [bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~] [bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~] [bd ~ ~ ~ ~ ~ bd ~ ~ bd bd ~ ~ ~ bd bd]>')
  .bank('RolandTR909')
  .lpf(drums.kick.cut)
  .shape(grit.mul(0.8))
  .gain(drums.kick.vol.mul(onDrums).mul(tlOr('kick')))

// half-time kick + snare (siren zone A)
$: s('bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~')
  .bank('RolandTR909')
  .lpf(drums.kick.cut)
  .shape(grit.mul(0.9))
  .gain(drums.kick.vol.mul(onDrums).mul(tlOr('half', pure(0))))

$: s('~ ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~')
  .bank('RolandTR909')
  .lpf(drums.snare.cut)
  .shape(grit)
  .room(verb.mul(2))
  .gain(drums.snare.vol.mul(1.1).mul(onDrums).mul(tlOr('half', pure(0))))

// snare backbeat
$: s('~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~')
  .bank('RolandTR909')
  .lpf(drums.snare.cut)
  .shape(grit)
  .gain(drums.snare.vol.mul(onDrums).mul(tlOr('snare')))

// ghost notes
$: s('~ ~ ~ sd ~ ~ sd ~ ~ sd ~ ~ ~ ~ ~ sd')
  .bank('RolandTR909')
  .lpf(drums.snare.cut)
  .gain(drums.snare.vol.mul(0.22).mul(onDrums).mul(tlOr('snare')))

// clap on the backbeat
$: s('~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~')
  .bank('RolandTR909')
  .room(verb)
  .gain(drums.clap.vol.mul(onDrums).mul(tlOr('clap')))

// 16th hats + open hats on offbeats
$: s('hh*16')
  .bank('RolandTR909')
  .hpf(600)
  .lpf(drums.hats.cut)
  .gain(drums.hats.vol.mul("[.55 .9 .7 1]*4").mul(onDrums).mul(tlOr('hats')))

$: s('[~ ~ oh ~]*4')
  .bank('RolandTR909')
  .hpf(900)
  .gain(drums.hats.vol.mul(0.65).mul(onDrums).mul(tlOr('hats')))

// ---- CHOPPED AMEN ----
// seq  = slices in original order (2-bar loop)
// rand = random slices, a bit of drop-out: classic jungle/rave cut-up
$: s(AMEN + '*16')
  .n("<[0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15] [16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31]>")
  .cut(1)
  .clip(1)
  .speed(1.03)
  .hpf(150)
  .lpf(drums.amen.cut)
  .crush(drums.amen.crush)
  .shape(grit.mul(0.6))
  .gain(drums.amen.vol.mul(onDrums).mul(isChop(0)).mul(tlOr('amen', pure(0.6))))

$: s(AMEN + '*16')
  .n(irand(32))
  .degradeBy(0.22)
  .cut(1)
  .clip(1)
  .speed(1.03)
  .hpf(150)
  .lpf(drums.amen.cut)
  .crush(drums.amen.crush)
  .shape(grit.mul(0.6))
  .gain(drums.amen.vol.mul(onDrums).mul(isChop(1)).mul(tlOr('amen', pure(0.6))))

// snare + pitched roll for builds (8 bars, accelerating, rising)
$: s('sd*<8 8 8 8 16 16 32 32>')
  .bank('RolandTR909')
  .shape(grit)
  .speed(saw.range(1, 1.6).slow(8))
  .gain(drums.roll.vol.mul(saw.range(0.35, 1).slow(8)).mul(onDrums).mul(tlOr('roll', pure(0))))

// crash on section starts (every 8 bars) + reverse crash into the drop
$: s('cr')
  .bank('RolandTR909')
  .slow(8)
  .gain(drums.crash.vol.mul(onDrums).mul(tlOr('crash', pure(0))))

$: s('cr')
  .bank('RolandTR909')
  .speed(-1)
  .slow(8)
  .late(7)
  .gain(drums.crash.vol.mul(0.9).mul(onDrums).mul(tlOr('rev', pure(0))))

// ============================================================
//  LOW · filthy distorted saw + sub (3 riffs: omen / fire / half)
// ============================================================
const bassOmen = note('<[e1 e1 ~ e1 ~ ~ e1 ~ g1 ~ g1 ~ ~ a1 b1 ~] [e1 e1 ~ e1 ~ ~ e1 ~ d1 ~ d1 ~ ~ c1 d1 ~]>')
const bassFire = note('<[e1 ~ e1 e1 ~ e1 ~ e1 e1 ~ e1 e1 ~ g1 ~ a1] [e1 ~ e1 e1 ~ e1 ~ e1 d1 ~ d1 d1 ~ c1 ~ b0]>')
const bassHalf = note('<[e1 ~ ~ ~ ~ ~ ~ ~ g1 ~ ~ ~ a1 ~ ~ ~] [e1 ~ ~ ~ ~ ~ ~ ~ d1 ~ ~ ~ ~ ~ b0 ~]>')

const bassSaw = (pat, n) => pat
  .s('sawtooth')
  .clip(0.9)
  .lpf(low.bass.cut.mul(autoCurve('low.bass.cut')))
  .lpq(6)
  .distort(low.bass.drive)
  .gain(low.bass.vol.mul(0.5).mul(onLow).mul(isRiff(n)).mul(tlOr('bass')))

const bassSub = (pat, n) => pat
  .s('sine')
  .clip(0.9)
  .gain(low.sub.vol.mul(onLow).mul(isRiff(n)).mul(tlOr('sub')))

$: bassSaw(bassOmen, 0)
$: bassSaw(bassFire, 1)
$: bassSaw(bassHalf, 2)
$: bassSub(bassOmen, 0)
$: bassSub(bassFire, 1)
$: bassSub(bassHalf, 2)

// ============================================================
//  LEAD · acid, stabs, hoover, sirens, FX
// ============================================================
// 303 line, 4-bar variation
$: note('<[e2 e2 e3 e2 g2 e2 e3 d3 e2 e2 e3 e2 a2 g2 e3 b2] [e2 e3 e2 e2 g2 e3 g2 d3 e2 e3 e2 e2 b2 a2 g2 e3] [e2 e2 e3 e2 g2 e2 e3 d3 e2 e2 e3 e2 a2 g2 e3 b2] [e2 e2 e3 e2 g2 e2 e3 d3 e2 b2 b2 a2 g2 e2 d2 e2]>')
  .s('sawtooth')
  .clip(0.7)
  .lpf(lead.acid.cut.mul(autoCurve('lead.acid.cut')))
  .lpq(lead.acid.res)
  .lpenv(4)
  .lpd(0.16)
  .distort(1.5)
  .gain(lead.acid.vol.mul(0.5).mul(onLead).mul(tlOr('acid')))

// rave stabs on Em / D / G / A / B
$: note('<[[e4,g4,b4] ~ ~ [e4,g4,b4] ~ ~ [e4,g4,b4] ~ ~ ~ [d4,f#4,a4] ~ ~ ~ ~ ~] [[e4,g4,b4] ~ ~ [e4,g4,b4] ~ ~ [g4,b4,d5] ~ ~ ~ [a4,c5,e5] ~ ~ [b4,d5,f#5] ~ ~]>')
  .s('supersaw')
  .detune(lead.stab.detune)
  .decay(0.14)
  .sustain(0)
  .lpf(lead.stab.cut.mul(autoCurve('lead.stab.cut')))
  .room(verb)
  .gain(lead.stab.vol.mul(0.5).mul(onLead).mul(tlOr('stab')))

// hoover: pitch-dive supersaw chords
$: note('<[~ [e3,b3,e4] ~ ~ [e3,b3,e4] ~ ~ ~ [g3,d4,g4] ~ ~ ~ ~ ~ ~ ~] [~ [e3,b3,e4] ~ ~ [e3,b3,e4] ~ ~ ~ [d3,a3,d4] ~ ~ [c3,g3,c4] ~ ~ ~ ~]>')
  .s('supersaw')
  .detune(0.9)
  .penv(5)
  .pdecay(0.14)
  .decay(0.25)
  .sustain(0.15)
  .lpf(lead.hoover.cut)
  .room(verb)
  .gain(lead.hoover.vol.mul(0.45).mul(onLead).mul(tlOr('hoover', pure(0))))

// SIREN WAIL: slow swoop, one swoop per bar (synced to tempo)
$: note('<e5 e5 g5 b4>')
  .slow(2)
  .s('sawtooth')
  .clip(1)
  .vib(140 / 60 / 4)
  .vibmod(7)
  .lpf(lead.siren.cut)
  .room(verb)
  .gain(lead.siren.vol.mul(0.45).mul(onLead).mul(tlOr('siren', pure(0))))

// SIREN YELP: fast police-style two-tone, one swoop per beat
$: note('<b5 e6 b5 g5>')
  .s('square')
  .clip(1)
  .vib(140 / 60)
  .vibmod(4)
  .lpf(lead.yelp.cut)
  .room(verb)
  .gain(lead.yelp.vol.mul(0.4).mul(onLead).mul(tlOr('yelp', pure(0))))

// laser zaps with echo
$: note('<[~ ~ ~ ~ ~ ~ e4 ~ ~ ~ ~ ~ ~ ~ b3 ~] [~ ~ ~ ~ ~ ~ ~ ~ ~ ~ e4 ~ ~ ~ ~ e4] [~ ~ ~ e4 ~ ~ ~ ~ ~ ~ b3 ~ ~ ~ ~ ~] [~ ~ ~ ~ ~ ~ ~ ~ e4 ~ e4 ~ e4 ~ ~ ~]>')
  .s('sawtooth')
  .penv(24)
  .pdecay(0.1)
  .decay(0.14)
  .sustain(0)
  .lpf(7000)
  .delay(0.35)
  .delaytime(0.3214)
  .delayfeedback(0.45)
  .gain(lead.zap.vol.mul(0.5).mul(onLead).mul(tlOr('zap', pure(0))))

// jet sweep: swirling band-passed noise
$: s('white')
  .bpf(sine.range(300, 6500).slow(2))
  .bpq(5)
  .gain(lead.jet.vol.mul(0.4).mul(onLead).mul(tlOr('jet', pure(0))))

// noise riser (8-bar sweep)
$: s('white')
  .attack(0.01)
  .hpf(saw.range(400, 10000).slow(8))
  .gain(lead.riser.vol.mul(saw.range(0, 1).slow(8)).mul(0.5).mul(onLead).mul(tlOr('riser', pure(0))))
