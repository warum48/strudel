// dark hip-hop · BLACK ICE V4 · 88 BPM
// PRELUDE 2 (pad + riser) → INTRO 8 (sliced MLK-speech scratch) → VERSE 8 →
// INTRO copy 8 → VERSE 8 → outro 4 (drone + applause). D+A drone with a 4-bar
// filter sweep. Two short MLK excerpts for scratch/applause (personal use).
setcpm(88 / 4)

if (typeof samples === 'function') {
  const CDN = 'https://cdn.jsdelivr.net/gh/tidalcycles/uzu-drumkit@main/'
  samples({
    bd: ['bd/11_bd_mot4i.wav'],
    sd: ['sd/11_sd_switchangel_3.wav', 'sd/12_sd_switchangel_2.wav'],
    hh: ['hh/10_hh_switchangel.wav', 'hh/11_hh_mot4i.wav'],
    oh: ['oh/10_oh_switchangel.wav'],
    rim: ['rim/10_rim_switchangel.wav'],
    cb: ['cb/10_perc_switchangel.wav'],
  }, CDN)
  // two short excerpts of an MLK speech (archive.org), personal use:
  // mlk = applause tail, mlk2 = a spoken phrase for the scratch
  samples({ mlk: ['mlk/mlk.wav'], mlk2: ['mlk/mlk2.wav'] }, '/samples/')
}

const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
  switches: {},
}
const play = slider(1, 0, 2, 1)
const holdBar = slider(0, 0, 127, 1)
const space = slider(0.35, 0, 1, 0.01)
const drive = slider(0.35, 0, 1, 0.01)

const instruments = {
  drums: {
    name: 'Drums',
    kick: { name: 'Kick', vol: slider(0.66, 0, 1, 0.01), cut: slider(160, 50, 400, 5), decay: slider(0.30, 0.1, 1, 0.01) },
    snare: { name: 'Snare', vol: slider(0.46, 0, 0.9, 0.01), cut: slider(6500, 50, 12000, 50), decay: slider(0.16, 0.05, 0.6, 0.01) },
    hat: { name: 'Hat', vol: slider(0.17, 0, 0.6, 0.01), open: slider(0.60, 0, 1, 0.01) },
    perc: { name: 'Rim', vol: slider(0.20, 0, 0.6, 0.01) },
  },
  bass: {
    name: 'Bass',
    sub: { name: '808', vol: slider(0.60, 0, 1, 0.01), cut: slider(110, 40, 300, 5) },
  },
  keys: {
    name: 'Keys',
    motif: { name: 'Motif', vol: slider(0.28, 0, 0.8, 0.01), cut: slider(1200, 50, 6000, 20) },
    pad: { name: 'Drone', vol: slider(0.22, 0, 0.7, 0.01), cut: slider(420, 50, 3000, 10) },
  },
  fx: {
    name: 'FX',
    reverb: { name: 'Reverb', size: slider(4, 1, 9, 0.5) },
    noise: { name: 'Noise', vol: slider(0.03, 0, 0.2, 0.005) },
    scratch: { name: 'Scratch', vol: slider(0.30, 0, 1, 0.01) },
    siren: { name: 'Siren', vol: slider(0.20, 0, 1, 0.01), cut: slider(2600, 50, 9000, 20) },
    applause: { name: 'Applause', vol: slider(0.30, 0, 1, 0.01) },
  },
}
const { drums, bass, keys, fx } = instruments

// PRELUDE (2) → INTRO (8) → VERSE (8) → INTRO copy (8) → VERSE (8) → OUTRO (4)
const TIMELINE = [
  { at: 0, len: 2, name: 'PRELUDE', values: { kick: 0, snare: 0, ghost: 0, hat: 0, bass: 0, motif: 0, pad: 0, perc: 0, motif2: 1, riser: 1, scratch: 0, applause: 0, siren: 0 } },
  { at: 2, len: 8, name: 'INTRO', values: { kick: 1, hat: 1, snare: 0.7, ghost: 0.35, bass: 0.5, motif: 0, pad: 1, perc: 0.4, motif2: 1, riser: 0, scratch: 1, applause: 0, siren: 0 } },
  { at: 10, len: 8, name: 'VERSE', values: { kick: 1, hat: 1, snare: 1, ghost: 1, bass: 1, motif: 1, pad: 0.8, perc: 1, motif2: 0, riser: 0, scratch: 0, applause: 0, siren: 1 } },
  { at: 18, len: 8, name: 'INTRO 2', values: { kick: 1, hat: 1, snare: 0.7, ghost: 0.35, bass: 0.5, motif: 0, pad: 1, perc: 0.4, motif2: 1, riser: 0, scratch: 1, applause: 0, siren: 0 } },
  { at: 26, len: 8, name: 'VERSE 2', values: { kick: 1, hat: 1, snare: 1, ghost: 1, bass: 1, motif: 1, pad: 0.8, perc: 1, motif2: 0, riser: 0, scratch: 0, applause: 0, siren: 1 } },
  { at: 34, len: 4, name: 'OUTRO', values: { kick: 0, snare: 0, ghost: 0, hat: 0, bass: 0, motif: 0, pad: 1, perc: 0, motif2: 0, riser: 0, scratch: 0, applause: 1, siren: 0 } },
]

// v1 automation remapped to the 2-bar prelude; prelude uses v2's motif filter 0.6 → 0.9.
const AUTOMATION = [
  { path: 'keys.motif.cut', points: [[0, 0.6], [2, 0.9], [10, 1], [14, 2.4], [18, 1], [26, 1], [30, 2.4], [34, 1], [38, 1.2]] },
  { path: 'bass.sub.cut', points: [[2, 0.7], [10, 1], [18, 1.3], [26, 1.5], [34, 1.8], [38, 1.2]] },
  // siren opens to ~7 kHz in the middle of each verse and closes again
  { path: 'fx.siren.cut', points: [[10, 1], [14, 2.7], [18, 1], [26, 1], [30, 2.7], [34, 1]] },
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
const autoAt = (path) =>
  autoCurve(path).mul(songGate)
    .add(loopGate)
    .add(holdBar.fmap((b) => autoValueAt(path, b)).mul(holdGate))

// ══ PRELUDE (v2 break leftovers) ═════════════════════════════════
$: note(m('d3 ~ eb3 f3 ~ a3 bb3 ~'))
  .s('triangle')
  .gain(keys.motif.vol.mul(tlOr('motif2')))
  .lpf(keys.motif.cut.mul(autoAt('keys.motif.cut'))).lpq(6)
  .decay(0.14).sustain(0).release(0.08)
  .delay(0.22).delaytime(3 / 16)
  .room(space.mul(0.45)).roomsize(fx.reverb.size)
  .mask(gateOf('motif2'))

$: s('pink').struct(m('x*16'))
  .gain(fx.noise.vol.mul(tlOr('riser')).mul(0.6))
  .lpf(saw.range(300, 9000)).hpf(200)
  .room(space.mul(0.4)).roomsize(fx.reverb.size)
  .mask(gateOf('riser'))

$: s('sd').struct(m('~ ~ ~ ~ ~ ~ ~ ~ x x x x x x x x'))
  .gain(drums.snare.vol.mul(tlOr('riser')).mul(saw.range(0.15, 0.7)))
  .hpf(300).decay(0.06).sustain(0)
  .mask(gateOf('riser'))

// ── SCRATCH: MLK spoken phrase, 2 bars on / 2 bars air (intro) ──
// The sample is mono, so the stereo spread is ours: 10% off center per slice.
// Strudel pan is 0..1 (0.5 = center), and <a b> alternates per cycle, not per
// slice — so the pan pattern must list all 8 slices.
$: s('mlk2').slice(8, m('0 7 0 7 3 4 3 4'))
  .gain(fx.scratch.vol.mul(tlOr('scratch')))
  .hpf(350).lpf(6500)
  .pan(m('0.4 0.6 0.4 0.6 0.4 0.6 0.4 0.6'))
  .room(space.mul(0.12)).roomsize(3)
  .mask(gateOf('scratch'))
  .mask(m('<~ ~ x x>'))

// ── APPLAUSE: the first excerpt, moved to the very end ──────────
$: s('mlk').slice(8, m('0 7 0 7 2 5 2 5'))
  .gain(fx.applause.vol.mul(tlOr('applause')))
  .hpf(200).lpf(8000)
  .pan(m('0.35 0.65 0.35 0.65 0.35 0.65 0.35 0.65'))
  .room(space.mul(0.5)).roomsize(7)
  .mask(gateOf('applause'))

// ── SIREN: dense glide up over one bar, then one bar of air ─────
// One chord per bar (slow(2) over `[a1, c2, e3] ~`), the rise lives inside the
// event: penv 12 semitones, pattack ≈ one bar at 88 BPM (2.7 s).
$: note(m('[a1, c2, e3] ~')).slow(2)
  .s('sawtooth').unison(3).detune(0.12)
  .gain(fx.siren.vol.mul(tlOr('siren')))
  .lpf(fx.siren.cut.mul(autoAt('fx.siren.cut'))).lpq(4)
  .penv(12).panchor(0).pattack(2.7).pdecay(0.02).psustain(1).prelease(0.08)
  .room(space.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('siren'))

// ══ V1 (copied from 01-black-ice.js) ═════════════════════════════
$: s('bd').struct(m('x ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~ ~'))
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .lpf(drums.kick.cut).lpq(1)
  .decay(drums.kick.decay).sustain(0).release(0.04)
  .distort(drive.mul(0.5))
  .duckorbit(2).duckdepth(0.6).duckattack(0.005)
  .mask(gateOf('kick'))

$: s('sd').struct(m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'))
  .gain(drums.snare.vol.mul(tlOr('snare')))
  .lpf(drums.snare.cut).lpq(2).hpf(180)
  .decay(drums.snare.decay).sustain(0).release(0.08)
  .room(space.mul(0.35)).roomsize(fx.reverb.size)
  .mask(gateOf('snare'))

$: s('sd').struct(m('~ ~ x ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x'))
  .gain(drums.snare.vol.mul(tlOr('ghost')).mul(0.28))
  .lpf(4200).hpf(300).decay(0.05).sustain(0).release(0.02)
  .mask(gateOf('ghost'))

$: s('hh').struct(m('x*16'))
  .gain(drums.hat.vol.mul(tlOr('hat')).mul(m('[.9 .25 .6 .3]*4')))
  .hpf(600).decay(0.04).sustain(0)
  .swingBy(0.07, 8)
  .mask(gateOf('hat'))

$: s('oh').struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'))
  .gain(drums.hat.vol.mul(drums.hat.open).mul(tlOr('hat')))
  .hpf(700).decay(0.12).sustain(0)
  .mask(gateOf('hat'))

$: s('rim').struct(m('~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~'))
  .gain(drums.perc.vol.mul(tlOr('perc')))
  .hpf(400).lpf(5000).decay(0.06).sustain(0)
  .room(space.mul(0.4)).roomsize(fx.reverb.size)
  .mask(gateOf('perc'))

$: note(m('d1 ~ d1 ~ f1 ~ a1 ~ d1 ~ f1 ~ a1 ~ c2 ~'))
  .s('sine')
  .gain(bass.sub.vol.mul(tlOr('bass')))
  .lpf(bass.sub.cut.mul(autoAt('bass.sub.cut'))).lpq(2)
  .clip(0.95).decay(0.20).sustain(0.45).release(0.10)
  .distort(drive)
  .orbit(2)
  .mask(gateOf('bass'))

// Drone: one long event, so move the filter inside it — one LFO sweep per
// 4 bars (lpsync 0.25), from the current base up to 1400 Hz and back.
$: note(m('<[d2,a2]>')).slow(4)
  .s('sawtooth').unison(2).detune(0.10)
  .gain(keys.pad.vol.mul(tlOr('pad')))
  .lpf(keys.pad.cut).lpq(3)
  .lpdepth(2.33).lpsync(0.25).lpdc(0)
  .attack(1.8).decay(1.2).sustain(0.85).release(2.5)
  .room(space.mul(0.6)).roomsize(fx.reverb.size)
  .mask(gateOf('pad'))

$: note(m('d3 eb3 f3 a3 bb3 a3 db3 eb3'))
  .s('triangle')
  .gain(keys.motif.vol.mul(tlOr('motif')))
  .lpf(keys.motif.cut.mul(autoAt('keys.motif.cut'))).lpq(6)
  .decay(0.14).sustain(0).release(0.08)
  .delay(0.22).delaytime(3 / 16)
  .room(space.mul(0.45)).roomsize(fx.reverb.size)
  .mask(gateOf('motif'))

$: s('pink').struct(m('x*2'))
  .gain(fx.noise.vol)
  .lpf(900).hpf(80)
  .room(space.mul(0.5)).roomsize(fx.reverb.size)
