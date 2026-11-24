// hip-hop · NEW TRACK · 85 BPM
// Starter template: two sections, kick + hat, D-minor arp (eighths), a D-minor
// pad that enters in section 2, and AUTOMATION that opens the arp cutoff ×2 at
// the start of the second section. Sound is native Strudel (autoCurve/tlCurve).
setcpm(85 / 4)

if (typeof samples === 'function') {
  const CDN = 'https://cdn.jsdelivr.net/gh/tidalcycles/uzu-drumkit@main/'
  samples({
    bd: ['bd/11_bd_mot4i.wav'],
    hh: ['hh/10_hh_switchangel.wav'],
  }, CDN)
}

// ── switches / transport ─────────────────────────────────────────
const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
  switches: {},
}
const play = slider(1, 0, 2, 1)      // 0 LOOP, 1 SONG, 2 HOLD
const holdBar = slider(0, 0, 127, 1) // HOLD snapshot bar

// ── globals + mixer ──────────────────────────────────────────────
const verb = slider(0.35, 0, 1, 0.01)

const instruments = {
  drums: {
    name: 'Drums',
    kick: { name: 'Kick', vol: slider(0.55, 0, 1, 0.01) },
    hat: { name: 'Hat', vol: slider(0.22, 0, 0.6, 0.01) },
  },
  keys: {
    name: 'Keys',
    arp: { name: 'Arp', vol: slider(0.32, 0, 0.8, 0.01), cut: slider(1400, 200, 8000, 20) },
    pad: { name: 'Pad', vol: slider(0.22, 0, 0.7, 0.01), cut: slider(900, 200, 6000, 20) },
  },
  fx: {
    reverb: { name: 'Reverb', size: slider(3, 1, 8, 0.5) },
  },
}
const { drums, keys, fx } = instruments

// ── form: INTRO (8) → VERSE (8) ──────────────────────────────────
// pad = 0 in the first section, 1 from the second; drums + arp the whole time.
const TIMELINE = [
  { at: 0, len: 8, name: 'INTRO', values: { kick: 1, hat: 1, arp: 1, pad: 0 } },
  { at: 8, len: 8, name: 'VERSE', values: { kick: 1, hat: 1, arp: 1, pad: 1 } },
]

// ── automation: arp cutoff stays at ×1, then rises to ×2 at bar 8 ─
const AUTOMATION = [
  { path: 'keys.arp.cut', points: [[0, 1], [8, 1], [12, 2]] },
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
// SONG → section value, LOOP → loopLevel, HOLD → section under holdBar.
const tlOr = (key, loopLevel = pure(1)) =>
  tlCurve(key).mul(songGate).add(loopLevel.mul(loopGate)).add(sectionValue(key).mul(holdGate))
const gateOf = (key) => tlOr(key).fmap((v) => v > 0.001)

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
// AUTOMATION: SONG → curve, LOOP → ×1, HOLD → snapshot at holdBar.
const autoAt = (path) =>
  autoCurve(path).mul(songGate)
    .add(loopGate)
    .add(holdBar.fmap((b) => autoValueAt(path, b)).mul(holdGate))

// ── ARP: D minor, eighths ────────────────────────────────────────
$: note(m('d3 f3 a3 d4 f4 a4 d4 f4'))
  .s('triangle')
  .gain(keys.arp.vol.mul(tlOr('arp')))
  .lpf(keys.arp.cut.mul(autoAt('keys.arp.cut'))).lpq(4)
  .attack(0.002).decay(0.12).sustain(0).release(0.05)
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .mask(gateOf('arp'))

// ── PAD: D minor chord, silent in section 1, on from section 2 ────
$: note(m('<[d3,f3,a3]>')).slow(2)
  .s('sawtooth').unison(3).detune(0.12)
  .gain(keys.pad.vol.mul(tlOr('pad')))
  .lpf(keys.pad.cut).lpq(2)
  .attack(1.2).decay(1).sustain(0.8).release(2)
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .mask(gateOf('pad'))

// ── DRUMS ────────────────────────────────────────────────────────
$: s('bd').struct(m('x*4'))
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .lpf(180).decay(0.33).sustain(0)
  .mask(gateOf('kick'))

$: s('hh').struct(m('x*8'))
  .gain(drums.hat.vol.mul(tlOr('hat')))
  .lpf(8000).decay(0.04).sustain(0)
  .mask(gateOf('hat'))
