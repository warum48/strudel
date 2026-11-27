// ============================================================
//  VOIDFIRE · big beat / rave · 140 BPM · E minor
//  Prodigy-style: broken break, filthy saw bass, 303 acid,
//  rave stabs, siren, snare-roll build, hard drops.
// ============================================================
setcps(140 / 60 / 4)

// ---------- GLOBAL KNOBS ----------
const grit = slider(0.35, 0, 1, 0.01)   // overall saturation on drums
const verb = slider(0.15, 0, 1, 0.01)   // global room

// @switches song=loop,song riff=omen,fire
const song = slider(1, 0, 1, 1)
const riff = slider(0, 0, 1, 1)

// @mutes muteDrums,muteLow,muteLead
const muteDrums = slider(0, 0, 1, 1)
const muteLow = slider(0, 0, 1, 1)
const muteLead = slider(0, 0, 1, 1)

// @scenes {"warmup":{"riff":0,"low.bass.drive":2,"lead.acid.cut":600,"lead.stab.vol":0.3},"rave":{"riff":0,"low.bass.drive":3.5,"lead.acid.cut":1100,"lead.stab.vol":0.5},"insane":{"riff":1,"low.bass.drive":6,"lead.acid.cut":1800,"lead.acid.res":14,"lead.stab.vol":0.6,"drums.kick.vol":1}}

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
      vol: slider(0.5, 0, 1, 0.01),
    },
    hats: {
      name: 'Hats',
      mute: 'muteDrums',
      vol: slider(0.42, 0, 1, 0.01),
      cut: slider(11000, 1500, 16000, 100),
    },
    roll: {
      name: 'Roll',
      mute: 'muteDrums',
      vol: slider(0.7, 0, 1, 0.01),
    },
  },
  low: {
    name: 'Low',
    bass: {
      name: 'Bass',
      mute: 'muteLow',
      vol: slider(0.46, 0, 1, 0.01),
      cut: slider(700, 120, 4000, 10),
      drive: slider(3.5, 0, 10, 0.1),
    },
    sub: {
      name: 'Sub',
      mute: 'muteLow',
      vol: slider(0.55, 0, 1, 0.01),
    },
  },
  lead: {
    name: 'Lead',
    acid: {
      name: 'Acid 303',
      mute: 'muteLead',
      vol: slider(0.34, 0, 1, 0.01),
      cut: slider(1090, 150, 5000, 10),
      res: slider(11, 0, 25, 0.5),
    },
    stab: {
      name: 'Rave Stab',
      mute: 'muteLead',
      vol: slider(0.45, 0, 1, 0.01),
      cut: slider(3800, 500, 12000, 100),
      detune: slider(0.45, 0, 1.5, 0.01),
    },
    siren: {
      name: 'Siren',
      mute: 'muteLead',
      vol: slider(0.28, 0, 1, 0.01),
      cut: slider(5000, 800, 12000, 100),
    },
    riser: {
      name: 'Riser',
      mute: 'muteLead',
      vol: slider(0.35, 0, 1, 0.01),
    },
  },
}
const { drums, low, lead } = instruments

// ---------- ARRANGEMENT (bars) ----------
const TIMELINE = [
  { at: 0,  len: 8,  name: 'INTRO',  values: { kick: 1, snare: 1, clap: 0, hats: 1, roll: 0, bass: 0, sub: 0, acid: 1, stab: 0, siren: 0, riser: 1 } },
  { at: 8,  len: 16, name: 'DROP 1', values: { kick: 1, snare: 1, clap: 1, hats: 1, roll: 0, bass: 1, sub: 1, acid: 1, stab: 1, siren: 0, riser: 0 } },
  { at: 24, len: 8,  name: 'BREAK',  values: { kick: 0, snare: 0, clap: 0, hats: 0, roll: 0, bass: 0, sub: 0, acid: 1, stab: 1, siren: 1, riser: 1 } },
  { at: 32, len: 4,  name: 'BUILD',  values: { kick: 0, snare: 0, clap: 0, hats: 0, roll: 1, bass: 0, sub: 0, acid: 1, stab: 0, siren: 1, riser: 1 } },
  { at: 36, len: 20, name: 'DROP 2', values: { kick: 1, snare: 1, clap: 1, hats: 1, roll: 0, bass: 1, sub: 1, acid: 1, stab: 1, siren: 1, riser: 0 } },
  { at: 56, len: 8,  name: 'OUTRO',  values: { kick: 1, snare: 1, clap: 0, hats: 1, roll: 0, bass: 0, sub: 0, acid: 1, stab: 0, siren: 0, riser: 0 } },
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

// LOOP = groove loop with everything on, SONG = full arrangement
const songGate = song.fmap((v) => (v > 0.5 ? 1 : 0))
const loopGate = song.fmap((v) => (v > 0.5 ? 0 : 1))
const tlOr = (key, loopLevel = pure(1)) =>
  tlCurve(key).mul(songGate).add(loopLevel.mul(loopGate))

// ---------- AUTOMATION (multipliers on cutoffs) ----------
const AUTOMATION = [
  { path: 'lead.acid.cut', points: [[0, 0.35], [8, 0.35], [16, 2.2], [24, 0.5], [36, 0.6], [48, 2.6], [56, 0.4], [64, 0.3]] },
  { path: 'low.bass.cut',  points: [[0, 0.5], [8, 1], [24, 1], [32, 0.4], [36, 1], [56, 1], [64, 0.5]] },
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

// ---------- MUTE + RIFF GATES ----------
const onDrums = muteDrums.fmap((v) => 1 - v)
const onLow = muteLow.fmap((v) => 1 - v)
const onLead = muteLead.fmap((v) => 1 - v)
const isOmen = riff.fmap((v) => (v === 0 ? 1 : 0))
const isFire = riff.fmap((v) => (v === 1 ? 1 : 0))

// ============================================================
//  DRUMS · broken break
// ============================================================
$: s('<[bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~] [bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~] [bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~] [bd ~ ~ ~ ~ ~ bd ~ ~ bd bd ~ ~ ~ bd bd]>')
  .bank('RolandTR909')
  .lpf(drums.kick.cut)
  .shape(grit.mul(0.8))
  .gain(drums.kick.vol.mul(onDrums).mul(tlOr('kick')))

// snare backbeat, hard
$: s('~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~')
  .bank('RolandTR909')
  .lpf(drums.snare.cut)
  .shape(grit)
  .gain(drums.snare.vol.mul(onDrums).mul(tlOr('snare')))

// ghost notes = the "broken" feel
$: s('~ ~ ~ sd ~ ~ sd ~ ~ sd ~ ~ ~ ~ ~ sd')
  .bank('RolandTR909')
  .lpf(drums.snare.cut)
  .gain(drums.snare.vol.mul(0.22).mul(onDrums).mul(tlOr('snare')))

// clap layered on the backbeat
$: s('~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~')
  .bank('RolandTR909')
  .room(verb)
  .gain(drums.clap.vol.mul(onDrums).mul(tlOr('clap')))

// 16th hats with accents + open hat on the offbeats
$: s('hh*16')
  .bank('RolandTR909')
  .hpf(600)
  .lpf(drums.hats.cut)
  .gain(drums.hats.vol.mul("[.55 .9 .7 1]*4").mul(onDrums).mul(tlOr('hats')))

$: s('[~ ~ oh ~]*4')
  .bank('RolandTR909')
  .hpf(900)
  .gain(drums.hats.vol.mul(0.65).mul(onDrums).mul(tlOr('hats')))

// snare roll for the build (accelerates over 4 bars)
$: s('sd*<8 8 16 32>')
  .bank('RolandTR909')
  .shape(grit)
  .gain(drums.roll.vol.mul(saw.range(0.35, 1).slow(4)).mul(onDrums).mul(tlOr('roll', pure(0))))

// ============================================================
//  LOW · filthy distorted saw + sub
// ============================================================
const bassOmen = note('<[e1 e1 ~ e1 ~ ~ e1 ~ g1 ~ g1 ~ ~ a1 b1 ~] [e1 e1 ~ e1 ~ ~ e1 ~ d1 ~ d1 ~ ~ c1 d1 ~]>')
const bassFire = note('<[e1 ~ e1 e1 ~ e1 ~ e1 e1 ~ e1 e1 ~ g1 ~ a1] [e1 ~ e1 e1 ~ e1 ~ e1 d1 ~ d1 d1 ~ c1 ~ b0]>')

$: bassOmen
  .s('sawtooth')
  .clip(0.9)
  .lpf(low.bass.cut.mul(autoCurve('low.bass.cut')))
  .lpq(6)
  .distort(low.bass.drive)
  .gain(low.bass.vol.mul(0.5).mul(onLow).mul(isOmen).mul(tlOr('bass')))

$: bassFire
  .s('sawtooth')
  .clip(0.9)
  .lpf(low.bass.cut.mul(autoCurve('low.bass.cut')))
  .lpq(6)
  .distort(low.bass.drive)
  .gain(low.bass.vol.mul(0.5).mul(onLow).mul(isFire).mul(tlOr('bass')))

$: bassOmen
  .s('sine')
  .clip(0.9)
  .gain(low.sub.vol.mul(onLow).mul(isOmen).mul(tlOr('sub')))

$: bassFire
  .s('sine')
  .clip(0.9)
  .gain(low.sub.vol.mul(onLow).mul(isFire).mul(tlOr('sub')))

// ============================================================
//  LEAD · acid, stabs, siren, riser
// ============================================================
// 303-style line with filter envelope
$: note('e2 e2 e3 e2 g2 e2 e3 d3 e2 e2 e3 e2 a2 g2 e3 b2')
  .s('sawtooth')
  .clip(0.7)
  .lpf(lead.acid.cut.mul(autoCurve('lead.acid.cut')))
  .lpq(lead.acid.res)
  .lpenv(4)
  .lpd(0.16)
  .distort(1.5)
  .gain(lead.acid.vol.mul(0.5).mul(onLead).mul(tlOr('acid')))

// rave stabs on Em / D
$: note('<[[e4,g4,b4] ~ ~ [e4,g4,b4] ~ ~ [e4,g4,b4] ~ ~ ~ [d4,f#4,a4] ~ ~ ~ ~ ~] [[e4,g4,b4] ~ ~ [e4,g4,b4] ~ ~ [g4,b4,d5] ~ ~ ~ [a4,c5,e5] ~ ~ [b4,d5,f#5] ~ ~]>')
  .s('supersaw')
  .detune(lead.stab.detune)
  .decay(0.14)
  .sustain(0)
  .lpf(lead.stab.cut)
  .room(verb)
  .gain(lead.stab.vol.mul(0.5).mul(onLead).mul(tlOr('stab')))

// siren / detuned wobble lead
$: note('<e5 g5 e5 b4>')
  .slow(2)
  .s('sawtooth')
  .vib(5)
  .vibmod(0.6)
  .lpf(lead.siren.cut)
  .room(verb)
  .gain(lead.siren.vol.mul(0.45).mul(onLead).mul(tlOr('siren', pure(0))))

// noise riser (8-bar sweep)
$: s('white')
  .attack(0.01)
  .hpf(saw.range(400, 10000).slow(8))
  .gain(lead.riser.vol.mul(saw.range(0, 1).slow(8)).mul(0.5).mul(onLead).mul(tlOr('riser', pure(0))))