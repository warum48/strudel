// ============================================================
//  VOIDFIRE v8 · HARD TECHNO / BREAKCORE-GABBER · 160 BPM · F phrygian
//  144 bars (~3:36). Hardcore kick-bass samples on every quarter,
//  breakbeat snares + amen, industrial break loops, saw bass, 303.
//  Cutoffs start low (~80 Hz) in every section and open up.
// ============================================================
const BPM = 160
setcps(BPM / 60 / 4)

// If silent: AMEN = 'amn', HBASS = 'hb', DIST = 'dst' (same files, jsDelivr mirror).
const AMEN = 'amencutup'
const HBASS = 'bass2'
const DIST = 'dist'
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
    hb: [
      'bass2/69988__noizemassacre__hardcore-bass-1.wav',
      'bass2/69989__noizemassacre__hardcore-bass-2.wav',
      'bass2/69990__noizemassacre__hardcore-bass-3.wav',
      'bass2/69991__noizemassacre__hardcore-bass-4.wav',
      'bass2/69992__noizemassacre__hardcore-bass-5.wav',
    ],
    dst: [
      'dist/000_inddistb1.wav',
      'dist/001_inddistb2.wav',
      'dist/002_inddistb1ride.wav',
      'dist/003_inddistb2ride.wav',
      'dist/004_inddistb3.wav',
      'dist/005_inddistb3ride.wav',
      'dist/006_inddistb4.wav',
      'dist/007_inddistb4ride.wav',
      'dist/008_inddistb5.wav',
      'dist/009_inddistb5ride.wav',
      'dist/010_inddistb6.wav',
      'dist/011_inddistb6ride.wav',
      'dist/012_inddistb7.wav',
      'dist/013_inddistb7ride.wav',
      'dist/014_inddistb8.wav',
      'dist/015_inddistb8ride.wav',
    ],
  }, 'https://cdn.jsdelivr.net/gh/tidalcycles/Dirt-Samples@master/')
}

const grit = slider(0.25, 0, 1, 0.01)
const verb = slider(0.12, 0, 1, 0.01)

// @switches song=loop,song riff=omen,fire chopMode=seq,rand
const song = slider(1, 0, 1, 1)
const riff = slider(0, 0, 1, 1)
const chopMode = slider(0, 0, 1, 1)

// @mutes muteDrums,muteLow,muteLead
const muteDrums = slider(0, 0, 1, 1)
const muteLow = slider(0, 0, 1, 1)
const muteLead = slider(0, 0, 1, 1)

// @scenes {"clean":{"grit":0.1,"low.bass.drive":0.5,"drums.amen.vol":0.35,"drums.dist.vol":0.3,"drums.gkick.vol":0.55},"dark":{"grit":0.25,"low.bass.drive":1.5,"drums.amen.vol":0.5,"drums.dist.vol":0.45,"drums.gkick.vol":0.7},"insane":{"grit":0.5,"low.bass.drive":3,"drums.amen.vol":0.7,"drums.dist.vol":0.65,"drums.gkick.vol":0.9,"lead.acid.res":15,"lead.acid.cut":4200}}

const instruments = {
  drums: {
    name: 'Drums',
    gkick: {
      name: 'Hardcore Kick',
      mute: 'muteDrums',
      vol: slider(0, 0, 1, 0.01),
      cut: slider(9000, 300, 16000, 100),
      tune: slider(1.078, 0.8, 1.3, 0.001),
    },
    kick: {
      name: 'Break Kick',
      mute: 'muteDrums',
      vol: slider(0.95, 0, 1, 0.01),
      cut: slider(2000, 300, 8000, 50),
    },
    snare: {
      name: 'Snare',
      mute: 'muteDrums',
      vol: slider(0.8, 0, 1, 0.01),
      cut: slider(6000, 800, 16000, 100),
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
      cut: slider(9000, 1500, 16000, 100),
    },
    amen: {
      name: 'Amen Chops',
      mute: 'muteDrums',
      vol: slider(0.5, 0, 1, 0.01),
      cut: slider(9000, 300, 16000, 100),
      crush: slider(10, 2, 16, 1),
    },
    dist: {
      name: 'Industrial Break',
      mute: 'muteDrums',
      vol: slider(0.45, 0, 1, 0.01),
      cut: slider(6000, 800, 16000, 100),
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
      vol: slider(0.45, 0, 1, 0.01),
      cut: slider(1500, 80, 6000, 10),
      drive: slider(1.5, 0, 10, 0.1),
    },
    sub: {
      name: 'Sub',
      mute: 'muteLow',
      vol: slider(0.5, 0, 1, 0.01),
    },
  },
  lead: {
    name: 'Lead',
    acid: {
      name: 'Acid 303',
      mute: 'muteLead',
      vol: slider(0.63, 0, 1, 0.01),
      cut: slider(80, 80, 8000, 10),
      res: slider(12, 0, 25, 0.5),
    },
    stab: {
      name: 'Dark Stab',
      mute: 'muteLead',
      vol: slider(1, 0, 1, 0.01),
      cut: slider(6000, 200, 12000, 100),
      detune: slider(0.5, 0, 1.5, 0.01),
    },
    riser: {
      name: 'Riser',
      mute: 'muteLead',
      vol: slider(0.86, 0, 1, 0.01),
    },
  },
}
const { drums, low, lead } = instruments

const TIMELINE = [
  { at: 0, len: 8, name: 'INTRO', values: { kick: 0, gkick: 0, gk2: 0, rise: 0, snare: 0, clap: 0, hats: 1, hats2: 0, amen: 1.5, amen32: 0, dist: 0, crash: 0, rev: 0, bass: 0, sub: 0, riff: 0, chop: 0, acid: 1, stab: 0, riser: 1 } },
  { at: 8, len: 8, name: 'GROOVE HC', values: { kick: 0, gkick: 1, gk2: 0, rise: 0, snare: 0, clap: 0, hats: 0, hats2: 0, amen: 0, amen32: 0, dist: 0, crash: 1, rev: 0, bass: 0, sub: 0, riff: 0, chop: 0, acid: 1, stab: 0, riser: 0 } },
  { at: 16, len: 8, name: 'GROOVE', values: { kick: 0.6, gkick: 1, gk2: 0, rise: 0, snare: 1, clap: 0, hats: 1, hats2: 0, amen: 0.8, amen32: 0, dist: 0, crash: 1, rev: 0, bass: 0, sub: 0, riff: 0, chop: 0, acid: 1, stab: 0, riser: 0 } },
  { at: 24, len: 16, name: 'DROP 1', values: { kick: 0, gkick: 1, gk2: 0, rise: 0, snare: 1, clap: 1, hats: 1, hats2: 0, amen: 0.6, amen32: 0, dist: 0.5, crash: 1, rev: 0, bass: 1, sub: 1, riff: 0, chop: 0, acid: 1, stab: 1, riser: 0 } },
  { at: 40, len: 8, name: 'BREAK', values: { kick: 0, gkick: 1, gk2: 0, rise: 0, snare: 0, clap: 0, hats: 0, hats2: 0, amen: 0, amen32: 0, dist: 0, crash: 1, rev: 0, bass: 0, sub: 0, riff: 0, chop: 0, acid: 1, stab: 1, riser: 1 } },
  { at: 48, len: 8, name: 'BUILD', values: { kick: 0, gkick: 1, gk2: 0, rise: 1, snare: 0, clap: 0, hats: 0.6, hats2: 0, amen: 0, amen32: 0, dist: 0, crash: 0, rev: 1, bass: 0, sub: 0, riff: 0, chop: 0, acid: 1, stab: 0, riser: 1 } },
  { at: 56, len: 16, name: 'DROP 2', values: { kick: 0, gkick: 1, gk2: 0, rise: 0, snare: 1, clap: 1, hats: 1, hats2: 0, amen: 1, amen32: 0, dist: 1, crash: 1, rev: 0, bass: 1, sub: 1, riff: 1, chop: 1, acid: 1, stab: 1, riser: 0 } },
  { at: 72, len: 8, name: 'GABBER', values: { kick: 0, gkick: 1, gk2: 0, rise: 0, snare: 1, clap: 1, hats: 1, hats2: 0, amen: 0.7, amen32: 0, dist: 0.5, crash: 1, rev: 0, bass: 1, sub: 1, riff: 1, chop: 0, acid: 1, stab: 1, riser: 0 } },
  { at: 80, len: 8, name: 'BREAKCORE', values: { kick: 0, gkick: 0, gk2: 1, rise: 0, snare: 1, clap: 0, hats: 0, hats2: 1, amen: 1, amen32: 1, dist: 1.3, crash: 1, rev: 0, bass: 1, sub: 1, riff: 0, chop: 1, acid: 1, stab: 0, riser: 0 } },
  { at: 88, len: 8, name: 'PEAK', values: { kick: 0, gkick: 1, gk2: 0, rise: 0, snare: 1, clap: 1, hats: 1, hats2: 0.6, amen: 1, amen32: 0.6, dist: 1, crash: 1, rev: 0, bass: 1, sub: 1, riff: 1, chop: 1, acid: 1, stab: 1, riser: 0 } },
  { at: 96, len: 8, name: 'BREAK 2', values: { kick: 0, gkick: 1, gk2: 0, rise: 0, snare: 0, clap: 0, hats: 1, hats2: 0, amen: 0.8, amen32: 0, dist: 0, crash: 0, rev: 0, bass: 0, sub: 0, riff: 0, chop: 0, acid: 1, stab: 0, riser: 0 } },
  { at: 104, len: 8, name: 'GABBER 2', values: { kick: 0, gkick: 1, gk2: 0, rise: 0, snare: 1, clap: 1, hats: 1, hats2: 0, amen: 0.7, amen32: 0, dist: 0.5, crash: 1, rev: 0, bass: 1, sub: 1, riff: 1, chop: 0, acid: 1, stab: 1, riser: 0 } },
  { at: 112, len: 8, name: 'PEAK 2', values: { kick: 0, gkick: 1, gk2: 0, rise: 0, snare: 1, clap: 1, hats: 1, hats2: 0.6, amen: 1, amen32: 0.6, dist: 1, crash: 1, rev: 0, bass: 1, sub: 1, riff: 1, chop: 1, acid: 1, stab: 1, riser: 0 } },
  { at: 120, len: 8, name: 'BREAKCORE 2', values: { kick: 0, gkick: 0, gk2: 1, rise: 0, snare: 1, clap: 0, hats: 0, hats2: 1, amen: 1, amen32: 1, dist: 1.3, crash: 1, rev: 0, bass: 1, sub: 1, riff: 0, chop: 1, acid: 1, stab: 0, riser: 0 } },
  { at: 128, len: 8, name: 'BREAKCORE 3', values: { kick: 0, gkick: 0, gk2: 1, rise: 0, snare: 1, clap: 0, hats: 0, hats2: 1, amen: 1, amen32: 1, dist: 1.3, crash: 1, rev: 0, bass: 1, sub: 1, riff: 0, chop: 1, acid: 1, stab: 0, riser: 0 } },
  { at: 136, len: 8, name: 'OUTRO', values: { kick: 0, gkick: 1, gk2: 0, rise: 0, snare: 0, clap: 0, hats: 1, hats2: 0, amen: 0.8, amen32: 0, dist: 0, crash: 0, rev: 0, bass: 0, sub: 0, riff: 0, chop: 0, acid: 1, stab: 0, riser: 0 } },
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

const songGate = song.fmap((v) => (v > 0.5 ? 1 : 0))
const loopGate = song.fmap((v) => (v > 0.5 ? 0 : 1))
const tlOr = (key, loopLevel = pure(1)) =>
  tlCurve(key).mul(songGate).add(loopLevel.mul(loopGate))
const pickTl = (key, sw) => tlCurve(key).mul(songGate).add(sw.mul(loopGate))
const isRiff = (n) => pickTl('riff', riff).fmap((v) => (Math.round(v) === n ? 1 : 0))
const isChop = (n) => pickTl('chop', chopMode).fmap((v) => (Math.round(v) === n ? 1 : 0))

// ---------- CUTOFF AUTOMATION ----------
// multipliers on the slider value (= the PEAK cutoff). Ramps are exponential
// (musical). Every section starts low (~80-300 Hz) and opens up; the last bar
// of a section closes the filter again so the next one restarts from the bottom.
const AUTOMATION = [
  { path: 'lead.acid.cut', points: [[0, 0.031], [7, 0.3], [8, 0.05], [15, 0.45], [16, 0.07], [23, 0.55], [24, 0.12], [28, 0.5], [30, 0.2], [32, 0.55], [36, 0.3], [39, 0.9], [40, 0.031], [47, 0.7], [48, 0.1], [55, 1], [56, 0.3], [60, 1], [64, 0.45], [68, 1], [71, 0.9], [72, 0.35], [79, 1], [80, 0.5], [84, 0.9], [87, 0.3], [88, 0.8], [92, 1], [95, 1], [96, 0.6], [103, 0.08], [104, 0.4], [111, 1], [112, 0.85], [116, 1], [119, 1], [120, 0.55], [124, 0.95], [127, 0.35], [128, 0.7], [132, 1], [135, 0.5], [136, 0.7], [143, 0.031], [144, 0.031]] },
  { path: 'low.bass.cut', points: [[0, 0.055], [7, 0.055], [8, 0.055], [15, 0.055], [16, 0.055], [23, 0.055], [24, 0.055], [32, 0.45], [39, 0.7], [40, 0.2], [47, 0.2], [48, 0.2], [55, 0.3], [56, 0.3], [64, 0.8], [71, 0.6], [72, 0.4], [79, 1], [80, 0.5], [84, 0.9], [87, 0.9], [88, 0.9], [92, 1], [95, 0.8], [96, 0.3], [103, 0.2], [104, 0.4], [111, 1], [112, 0.9], [116, 1], [119, 0.85], [120, 0.5], [124, 0.95], [127, 0.9], [128, 0.6], [132, 1], [135, 0.9], [136, 0.3], [143, 0.1], [144, 0.1]] },
  { path: 'lead.stab.cut', points: [[0, 0.03], [7, 0.03], [8, 0.03], [15, 0.03], [16, 0.03], [23, 0.03], [24, 0.04], [32, 0.3], [39, 0.6], [40, 0.1], [47, 0.6], [48, 0.2], [55, 0.8], [56, 0.25], [64, 0.9], [71, 1], [72, 0.3], [79, 1], [80, 0.6], [87, 0.4], [88, 0.5], [92, 1], [95, 1], [96, 0.1], [103, 0.1], [104, 0.35], [111, 1], [112, 0.55], [116, 1], [119, 1], [120, 0.6], [127, 0.4], [128, 0.6], [135, 0.4], [136, 0.05], [143, 0.05], [144, 0.05]] },
  { path: 'drums.gkick.cut', points: [[0, 0.2], [7, 0.2], [8, 0.2], [15, 0.7], [16, 0.3], [23, 0.8], [24, 0.2], [28, 0.6], [32, 0.35], [39, 0.8], [40, 0.2], [47, 0.5], [48, 0.25], [55, 0.8], [56, 0.4], [63, 1], [64, 0.7], [71, 1], [72, 0.5], [79, 1], [80, 0.6], [87, 0.9], [88, 0.8], [95, 1], [96, 0.6], [103, 0.2], [104, 0.5], [111, 1], [112, 0.8], [119, 1], [120, 0.6], [127, 0.9], [128, 0.65], [135, 1], [136, 0.6], [143, 0.2], [144, 0.2]] },
  { path: 'drums.amen.cut', points: [[0, 0.08], [7, 0.7], [8, 1], [144, 1]] },
]
const autoCurve = (path) => {
  const pts = AUTOMATION.find((a) => a.path === path)?.points || []
  const segs = []
  let pos = 0
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, va] = pts[i], [b, vb] = pts[i + 1]
    if (a > pos) segs.push([a - pos, pure(va)])
    if (b > a) segs.push([b - a, va === vb ? pure(va) : saw.fmap((t) => va * Math.pow(vb / va, t)).slow(b - a)])
    pos = b
  }
  if (pos < TL_TOTAL) segs.push([TL_TOTAL - pos, pure(pts.at(-1)[1])])
  return arrange(...segs)
}

const onDrums = muteDrums.fmap((v) => 1 - v)
const onLow = muteLow.fmap((v) => 1 - v)
const onLead = muteLead.fmap((v) => 1 - v)

// ================= HARDCORE KICK (bass2:0) =================
// ONE sample, ONE pitch (F), the same hit every time: no pitch games, no short
// samples, no 16th rolls. Each hit is gated at its event length with a short
// release, so it ends smoothly instead of clicking. `tune` = pitch (speed).
const gkCut = drums.gkick.cut.mul(autoCurve('drums.gkick.cut'))
const gkSnd = (nPat, k, loopLevel) => n(nPat)
  .s(HBASS)
  .speed(drums.gkick.tune)
  .clip(1)
  .release(0.05)
  .lpf(gkCut)
  .gain(drums.gkick.vol.mul(0.7).mul(onDrums).mul(tlOr(k, loopLevel)))

// straight kick on EVERY QUARTER; every 4th bar ends with an 8th-note double hit
$: gkSnd("<[0 0 0 0] [0 0 0 0] [0 0 0 0] [0 0 0 [0 0]]>", 'gkick', pure(1))

// build: 8th-note kicks in the last two bars of 8
$: gkSnd("<~ ~ ~ ~ ~ ~ [0*8] [0*8]>", 'rise', pure(0))

// breakcore: off-grid kicks on an 8th grid (never tighter than an 8th)
$: gkSnd("<0(3,8) 0(5,8,2) 0(3,8,1) 0(5,8)>", 'gk2', pure(0))

// ================= BREAKBEAT DRUMS =================
// classic broken-break kick (GROOVE only)
$: s('<[bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~] [bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~] [bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~] [bd ~ ~ ~ ~ ~ bd ~ ~ bd bd ~ ~ ~ bd bd]>')
  .bank('RolandTR909')
  .lpf(drums.kick.cut)
  .shape(grit.mul(0.6))
  .gain(drums.kick.vol.mul(onDrums).mul(tlOr('kick', pure(0))))

$: s('~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~')
  .bank('RolandTR909')
  .lpf(drums.snare.cut)
  .shape(grit)
  .gain(drums.snare.vol.mul(onDrums).mul(tlOr('snare')))

$: s('~ ~ ~ sd ~ ~ sd ~ ~ sd ~ ~ ~ ~ ~ sd')
  .bank('RolandTR909')
  .lpf(drums.snare.cut)
  .gain(drums.snare.vol.mul(0.22).mul(onDrums).mul(tlOr('snare')))

$: s('~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~')
  .bank('RolandTR909')
  .room(verb)
  .gain(drums.clap.vol.mul(onDrums).mul(tlOr('clap')))

$: s('hh*16')
  .bank('RolandTR909')
  .hpf(600)
  .lpf(drums.hats.cut)
  .gain(drums.hats.vol.mul("[.55 .9 .7 1]*4").mul(onDrums).mul(tlOr('hats')))

$: s('<[~ ~ oh ~]*4 [~ ~ oh ~]*4 [~ ~ oh ~]*4 [~ oh ~ oh]*2>')
  .bank('RolandTR909')
  .hpf(900)
  .gain(drums.hats.vol.mul(0.65).mul(onDrums).mul(tlOr('hats')))

// breakcore double-time hats on selected bars
$: s('hh*32')
  .bank('RolandTR909')
  .hpf(2000)
  .mask("<1 1 0 1>")
  .gain(drums.hats.vol.mul(0.5).mul("[.5 1 .7 1]*8").mul(onDrums).mul(tlOr('hats2', pure(0))))

// ---- chopped amen ----
$: s(AMEN).fast(16)
  .n("<[0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15] [16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31]>")
  .cut(1)
  .clip(1)
  .speed(BPM / 136)
  .hpf(150)
  .lpf(drums.amen.cut.mul(autoCurve('drums.amen.cut')))
  .crush(drums.amen.crush)
  .shape(grit.mul(0.3))
  .gain(drums.amen.vol.mul(onDrums).mul(isChop(0)).mul(tlOr('amen', pure(0.6))))

$: s(AMEN).fast(16)
  .n(irand(32))
  .degradeBy(0.22)
  .cut(1)
  .clip(1)
  .speed(BPM / 136)
  .hpf(150)
  .lpf(drums.amen.cut.mul(autoCurve('drums.amen.cut')))
  .crush(drums.amen.crush)
  .shape(grit.mul(0.3))
  .gain(drums.amen.vol.mul(onDrums).mul(isChop(1)).mul(tlOr('amen', pure(0.6))))

// breakcore: 32nd-note amen cut-up, random slices and speeds, only on some bars
$: s(AMEN).fast(32)
  .n(irand(32))
  .degradeBy(0.45)
  .speed("<1 1 1.5 1 0.75 1 1 2>".mul(BPM / 136))
  .cut(1)
  .clip(1)
  .mask("<0 1 1 0 1 0 1 1>")
  .hpf(200)
  .lpf(drums.amen.cut.mul(autoCurve('drums.amen.cut')))
  .gain(drums.amen.vol.mul(0.8).mul(onDrums).mul(tlOr('amen32', pure(0))))

// industrial distorted break loops (100 BPM bar -> BPM), selected bars only
$: s(DIST)
  .n("<4 12 4 10 8 12 4 10>")
  .speed(BPM / 100)
  .mask("<0 0 0 1 0 0 1 1>")
  .hpf(120)
  .lpf(drums.dist.cut)
  .gain(drums.dist.vol.mul(onDrums).mul(tlOr('dist', pure(0))))

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

// ================= LOW =================
// bass notches out on every quarter so the hardcore kick owns the beat
const gkAmt = tlOr('gkick', pure(1))
const pump = "[.3 .65 1 1]*4".mul(gkAmt).add(gkAmt.fmap((v) => 1 - v))

const bassOmen = note('<[f1 f1 ~ f1 ~ ~ f1 ~ gb1 ~ gb1 ~ ~ ab1 c2 ~] [f1 f1 ~ f1 ~ ~ f1 ~ eb1 ~ eb1 ~ ~ db1 eb1 ~]>')
const bassFire = note('<[f1 ~ f1 f1 ~ f1 ~ f1 f1 ~ f1 f1 ~ gb1 ~ ab1] [f1 ~ f1 f1 ~ f1 ~ f1 eb1 ~ eb1 eb1 ~ db1 ~ c1]>')

const bassSaw = (pat, k) => pat
  .s('sawtooth')
  .clip(0.9)
  .lpf(low.bass.cut.mul(autoCurve('low.bass.cut')))
  .lpq(6)
  .distort(low.bass.drive)
  .gain(low.bass.vol.mul(0.5).mul(pump).mul(onLow).mul(isRiff(k)).mul(tlOr('bass')))

const bassSub = (pat, k) => pat
  .s('sine')
  .clip(0.9)
  .gain(low.sub.vol.mul(pump).mul(onLow).mul(isRiff(k)).mul(tlOr('sub')))

$: bassSaw(bassOmen, 0)
$: bassSaw(bassFire, 1)
$: bassSub(bassOmen, 0)
$: bassSub(bassFire, 1)

// ================= LEAD =================
$: note('<[f2 f2 f3 f2 gb2 f2 f3 eb3 f2 f2 f3 f2 ab2 gb2 f3 c3] [f2 f3 f2 f2 gb2 f3 gb2 eb3 f2 f3 f2 f2 c3 ab2 gb2 f3] [f2 f2 f3 f2 gb2 f2 f3 eb3 f2 f2 f3 f2 ab2 gb2 f3 c3] [f2 f2 f3 f2 gb2 f2 f3 eb3 f2 c3 c3 ab2 gb2 f2 eb2 f2]>')
  .s('sawtooth')
  .clip(0.7)
  .lpf(lead.acid.cut.mul(autoCurve('lead.acid.cut')))
  .lpq(lead.acid.res)
  .lpenv(4)
  .lpd(0.16)
  .distort(0.6)
  .gain(lead.acid.vol.mul(0.5).mul(onLead).mul(tlOr('acid')))

$: note('<[[f3,ab3,c4] ~ ~ [f3,ab3,c4] ~ ~ [f3,ab3,c4] ~ ~ ~ [gb3,bb3,db4] ~ ~ ~ ~ ~] [[f3,ab3,c4] ~ ~ [f3,ab3,c4] ~ ~ [ab3,c4,eb4] ~ ~ ~ [gb3,bb3,db4] ~ ~ [f3,ab3,c4] ~ ~]>')
  .s('supersaw')
  .detune(lead.stab.detune)
  .decay(0.14)
  .sustain(0)
  .lpf(lead.stab.cut.mul(autoCurve('lead.stab.cut')))
  .room(verb)
  .gain(lead.stab.vol.mul(0.5).mul(onLead).mul(tlOr('stab')))

$: s('white')
  .attack(0.01)
  .hpf(saw.range(400, 10000).slow(8))
  .gain(lead.riser.vol.mul(saw.range(0, 1).slow(8)).mul(0.5).mul(onLead).mul(tlOr('riser', pure(0))))
