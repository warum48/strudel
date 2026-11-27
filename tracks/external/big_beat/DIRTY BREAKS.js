// ============================================================
//  VOIDFIRE v4 · HARD · dark big beat · 150 BPM · F phrygian
//  96 bars (~2:35): broken break, chopped amen + 2nd dirty break,
//  filthy bass + HARD BASS layer, 303, stabs
// ============================================================
setcps(150 / 60 / 4)

// If the amen is silent, set AMEN = 'amn' (same slices, jsDelivr mirror).
const AMEN = 'amencutup'
// Second (dirty) break. If silent, set BRK = 'brk' (jsDelivr mirror below).
const BRK = 'breaks165'
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
    brk: ['breaks165/000_RAWCLN.WAV'],
  }, 'https://cdn.jsdelivr.net/gh/tidalcycles/Dirt-Samples@master/')
}

const grit = slider(0.45, 0, 1, 0.01)
const verb = slider(0.12, 0, 1, 0.01)

// @switches song=loop,song riff=omen,fire chopMode=seq,rand
const song = slider(1, 0, 1, 1)
const riff = slider(0, 0, 1, 1)
const chopMode = slider(0, 0, 1, 1)

// @mutes muteDrums,muteLow,muteLead
const muteDrums = slider(0, 0, 1, 1)
const muteLow = slider(0, 0, 1, 1)
const muteLead = slider(0, 0, 1, 1)

// @scenes {"clean":{"grit":0.2,"low.bass.drive":3,"drums.amen.vol":0.35},"dark":{"grit":0.45,"low.bass.drive":4.5,"drums.amen.vol":0.5},"insane":{"grit":0.75,"low.bass.drive":7,"low.hard.drive":10,"low.hard.vol":0.7,"drums.brk.vol":0.75,"drums.amen.vol":0.75,"lead.acid.res":15,"lead.acid.cut":1400}}

const instruments = {
  drums: {
    name: 'Drums',
    kick: {
      name: 'Kick',
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
      cut: slider(7000, 800, 16000, 100),
      crush: slider(8, 2, 16, 1),
    },
    brk: {
      name: 'Dirty Break',
      mute: 'muteDrums',
      vol: slider(0.55, 0, 1, 0.01),
      cut: slider(5000, 800, 16000, 100),
      crush: slider(5, 2, 16, 1),
      drive: slider(3, 0, 10, 0.1),
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
      vol: slider(0.7, 0, 1, 0.01),
      cut: slider(500, 120, 4000, 10),
      drive: slider(4.5, 0, 10, 0.1),
    },
    sub: {
      name: 'Sub',
      mute: 'muteLow',
      vol: slider(0.55, 0, 1, 0.01),
    },
    hard: {
      name: 'Hard Bass',
      mute: 'muteLow',
      vol: slider(0.55, 0, 1, 0.01),
      cut: slider(480, 200, 6000, 10),
      drive: slider(4.5, 0, 12, 0.1),
      detune: slider(0.15, 0, 1.5, 0.01),
    },
  },
  lead: {
    name: 'Lead',
    acid: {
      name: 'Acid 303',
      mute: 'muteLead',
      vol: slider(0.38, 0, 1, 0.01),
      cut: slider(700, 150, 5000, 10),
      res: slider(12, 0, 25, 0.5),
    },
    stab: {
      name: 'Dark Stab',
      mute: 'muteLead',
      vol: slider(0.42, 0, 1, 0.01),
      cut: slider(2800, 500, 12000, 100),
      detune: slider(0.5, 0, 1.5, 0.01),
    },
    riser: {
      name: 'Riser',
      mute: 'muteLead',
      vol: slider(0.35, 0, 1, 0.01),
    },
  },
}
const { drums, low, lead } = instruments

const TIMELINE = [
  { at: 0, len: 8, name: 'INTRO', values: { kick: 0, snare: 0, clap: 0, hats: 1, roll: 0, amen: 1.5, brk: 0, crash: 0, rev: 0, bass: 0, sub: 0, hard: 0, riff: 0, chop: 0, acid: 1, stab: 0, riser: 1 } },
  { at: 8, len: 8, name: 'GROOVE', values: { kick: 1, snare: 1, clap: 0, hats: 1, roll: 0, amen: 0.8, brk: 0, crash: 1, rev: 0, bass: 0, sub: 0, hard: 0, riff: 0, chop: 0, acid: 1, stab: 0, riser: 0 } },
  { at: 16, len: 16, name: 'DROP 1', values: { kick: 1, snare: 1, clap: 1, hats: 1, roll: 0, amen: 0.6, brk: 0.5, crash: 1, rev: 0, bass: 1, sub: 1, hard: 0.6, riff: 0, chop: 0, acid: 1, stab: 1, riser: 0 } },
  { at: 32, len: 8, name: 'BREAK', values: { kick: 0, snare: 0, clap: 0, hats: 0, roll: 0, amen: 0, brk: 0, crash: 1, rev: 0, bass: 0, sub: 0, hard: 0, riff: 0, chop: 0, acid: 1, stab: 1, riser: 1 } },
  { at: 40, len: 8, name: 'BUILD', values: { kick: 0, snare: 0, clap: 0, hats: 0, roll: 1, amen: 0, brk: 0, crash: 0, rev: 1, bass: 0, sub: 0, hard: 0, riff: 0, chop: 0, acid: 1, stab: 0, riser: 1 } },
  { at: 48, len: 16, name: 'DROP 2', values: { kick: 1, snare: 1, clap: 1, hats: 1, roll: 0, amen: 1, brk: 1, crash: 1, rev: 0, bass: 1, sub: 1, hard: 1, riff: 1, chop: 1, acid: 1, stab: 1, riser: 0 } },
  { at: 64, len: 24, name: 'DROP 3', values: { kick: 1, snare: 1, clap: 1, hats: 1, roll: 0, amen: 1.1, brk: 1.2, crash: 1, rev: 0, bass: 1, sub: 1, hard: 1.2, riff: 1, chop: 1, acid: 1, stab: 1, riser: 0 } },
  { at: 88, len: 8, name: 'OUTRO', values: { kick: 1, snare: 1, clap: 0, hats: 1, roll: 0, amen: 0.8, brk: 0, crash: 0, rev: 0, bass: 0, sub: 0, hard: 0, riff: 0, chop: 0, acid: 1, stab: 0, riser: 0 } },
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

const AUTOMATION = [
  { path: 'lead.acid.cut', points: [[0, 0.3], [8, 0.5], [16, 0.6], [28, 2.4], [32, 0.4], [40, 0.4], [47, 2.8], [48, 0.8], [60, 2.6], [64, 1], [84, 2.8], [88, 0.4], [96, 0.2]] },
  { path: 'low.bass.cut',  points: [[0, 0.5], [16, 0.9], [32, 0.9], [40, 0.4], [48, 1], [64, 1.2], [88, 0.9], [96, 0.5]] },
  { path: 'lead.stab.cut', points: [[0, 0.5], [48, 0.6], [64, 1.2], [88, 0.5], [96, 0.5]] },
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

const onDrums = muteDrums.fmap((v) => 1 - v)
const onLow = muteLow.fmap((v) => 1 - v)
const onLead = muteLead.fmap((v) => 1 - v)

// ================= DRUMS =================
$: s('<[bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~] [bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~] [bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~] [bd ~ ~ ~ ~ ~ bd ~ ~ bd bd ~ ~ ~ bd bd]>')
  .bank('RolandTR909')
  .lpf(drums.kick.cut)
  .shape(grit.mul(0.8))
  .gain(drums.kick.vol.mul(onDrums).mul(tlOr('kick')))

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

$: s('[~ ~ oh ~]*4')
  .bank('RolandTR909')
  .hpf(900)
  .gain(drums.hats.vol.mul(0.65).mul(onDrums).mul(tlOr('hats')))

// chopped amen: seq = original order, rand = cut-up
$: s(AMEN).fast(16)
  .n("<[0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15] [16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31]>")
  .cut(1)
  .clip(1)
  .speed(1.1)
  .hpf(150)
  .lpf(drums.amen.cut)
  .crush(drums.amen.crush)
  .shape(grit.mul(0.6))
  .gain(drums.amen.vol.mul(onDrums).mul(isChop(0)).mul(tlOr('amen', pure(0.6))))

$: s(AMEN).fast(16)
  .n(irand(32))
  .degradeBy(0.22)
  .cut(1)
  .clip(1)
  .speed(1.1)
  .hpf(150)
  .lpf(drums.amen.cut)
  .crush(drums.amen.crush)
  .shape(grit.mul(0.6))
  .gain(drums.amen.vol.mul(onDrums).mul(isChop(1)).mul(tlOr('amen', pure(0.6))))

// second DIRTY BREAK: random 1/16 slices, crushed + distorted, only on selected bars
const brkIx = irand(16)
$: s(BRK).fast(16)
  .begin(brkIx.div(16))
  .end(brkIx.add(1).div(16))
  .cut(2)
  .clip(1)
  .speed(0.95)
  .mask("<0 0 0 [0 1] 0 0 [1 0] 1>")
  .hpf(200)
  .lpf(drums.brk.cut)
  .crush(drums.brk.crush)
  .distort(drums.brk.drive)
  .gain(drums.brk.vol.mul(0.6).mul(onDrums).mul(tlOr('brk', pure(0))))

$: s('sd*<8 8 8 8 16 16 32 32>')
  .bank('RolandTR909')
  .shape(grit)
  .speed(saw.range(1, 1.6).slow(8))
  .gain(drums.roll.vol.mul(saw.range(0.35, 1).slow(8)).mul(onDrums).mul(tlOr('roll', pure(0))))

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
const bassOmen = note('<[f1 f1 ~ f1 ~ ~ f1 ~ gb1 ~ gb1 ~ ~ ab1 c2 ~] [f1 f1 ~ f1 ~ ~ f1 ~ eb1 ~ eb1 ~ ~ db1 eb1 ~]>')
const bassFire = note('<[f1 ~ f1 f1 ~ f1 ~ f1 f1 ~ f1 f1 ~ gb1 ~ ab1] [f1 ~ f1 f1 ~ f1 ~ f1 eb1 ~ eb1 eb1 ~ db1 ~ c1]>')

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
$: bassSub(bassOmen, 0)
$: bassSub(bassFire, 1)

const hardOmen = note('<[f2 f2 ~ f2 ~ ~ f2 ~ gb2 ~ gb2 ~ ~ ab2 c3 ~] [f2 f2 ~ f2 ~ ~ f2 ~ eb2 ~ eb2 ~ ~ db2 eb2 ~]>')
const hardFire = note('<[f2 ~ f2 f2 ~ f2 ~ f2 f2 ~ f2 f2 ~ gb2 ~ ab2] [f2 ~ f2 f2 ~ f2 ~ f2 eb2 ~ eb2 eb2 ~ db2 ~ c2]>')

// HARD BASS: detuned supersaw, short + punchy, pitch-dive, heavily clipped
const hardBass = (pat, n) => pat
  .s('supersaw')
  .detune(low.hard.detune)
  .clip(0.6)
  .penv(5)
  .pdecay(0.04)
  .lpf(low.hard.cut.mul(autoCurve('low.bass.cut')))
  .lpq(4)
  .distort(low.hard.drive)
  .gain(low.hard.vol.mul(0.35).mul(onLow).mul(isRiff(n)).mul(tlOr('hard', pure(0.8))))

$: hardBass(hardOmen, 0)
$: hardBass(hardFire, 1)

// ================= LEAD =================
$: note('<[f2 f2 f3 f2 gb2 f2 f3 eb3 f2 f2 f3 f2 ab2 gb2 f3 c3] [f2 f3 f2 f2 gb2 f3 gb2 eb3 f2 f3 f2 f2 c3 ab2 gb2 f3] [f2 f2 f3 f2 gb2 f2 f3 eb3 f2 f2 f3 f2 ab2 gb2 f3 c3] [f2 f2 f3 f2 gb2 f2 f3 eb3 f2 c3 c3 ab2 gb2 f2 eb2 f2]>')
  .s('sawtooth')
  .clip(0.7)
  .lpf(lead.acid.cut.mul(autoCurve('lead.acid.cut')))
  .lpq(lead.acid.res)
  .lpenv(4)
  .lpd(0.16)
  .distort(1.5)
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
