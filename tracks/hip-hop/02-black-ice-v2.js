// dark hip-hop · BLACK ICE V2 · 88 BPM
// Punchy, dark boom-bap with a real form: intro → build → verse → break →
// hook → verse → hook → outro. Verses are boom-bap, hooks switch to half-time
// with a clap, triplet hats and a lead answer; the break is a noise riser.
// D Phrygian motif with a C# accent, short Dm7/Bb/Gm/A7 stabs (no long drone),
// sliding 808 ducked under the kick. Native Strudel; no acoustic imitation.
setcpm(88 / 4)

if (typeof samples === 'function') {
  const CDN = 'https://cdn.jsdelivr.net/gh/tidalcycles/uzu-drumkit@main/'
  samples({
    bd: ['bd/11_bd_mot4i.wav'],
    sd: ['sd/11_sd_switchangel_3.wav', 'sd/12_sd_switchangel_2.wav'],
    hh: ['hh/10_hh_switchangel.wav', 'hh/11_hh_mot4i.wav'],
    oh: ['oh/10_oh_switchangel.wav'],
    rim: ['rim/10_rim_switchangel.wav'],
    cp: ['cp/10_cp_switchangel.wav'],
  }, CDN)
}

const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
  switches: {},
}
const play = slider(1, 0, 2, 1)
const holdBar = slider(0, 0, 127, 1)
const space = slider(0.32, 0, 1, 0.01)
const drive = slider(0.35, 0, 1, 0.01)

const instruments = {
  drums: {
    name: 'Drums',
    kick: { name: 'Kick', vol: slider(0.74, 0, 1, 0.01), cut: slider(160, 60, 400, 5), decay: slider(0.30, 0.1, 1, 0.01) },
    snare: { name: 'Snare', vol: slider(0.52, 0, 0.9, 0.01), cut: slider(6500, 800, 12000, 50), decay: slider(0.16, 0.05, 0.6, 0.01) },
    hat: { name: 'Hat', vol: slider(0.17, 0, 0.6, 0.01), open: slider(0.60, 0, 1, 0.01) },
    perc: { name: 'Rim', vol: slider(0.18, 0, 0.6, 0.01) },
    clap: { name: 'Clap', vol: slider(0.26, 0, 0.7, 0.01) },
  },
  bass: {
    name: 'Bass',
    sub: { name: '808', vol: slider(0.38, 0, 1, 0.01), cut: slider(115, 40, 300, 5) },
  },
  keys: {
    name: 'Keys',
    motif: { name: 'Motif', vol: slider(0.28, 0, 0.8, 0.01), cut: slider(1200, 200, 6000, 20) },
    stab: { name: 'Stab', vol: slider(0.13, 0, 0.7, 0.01), cut: slider(1600, 200, 7000, 20) },
    lead: { name: 'Lead', vol: slider(0.16, 0, 0.8, 0.01), cut: slider(1800, 200, 8000, 20) },
  },
  fx: {
    name: 'FX',
    reverb: { name: 'Reverb', size: slider(4, 1, 9, 0.5) },
    noise: { name: 'Noise', vol: slider(0.05, 0, 0.2, 0.005) },
  },
}
const { drums, bass, keys, fx } = instruments

// Full form: 48 bars. `hook` flips the rhythm from boom-bap to half-time.
const TIMELINE = [
  { at: 0, len: 4, name: 'INTRO', values: { kick: 0, snare: 0, ghost: 0, hat: 0, open: 0, rim: 0, clap: 0, bass: 0, motif: 0.5, stab: 0, lead: 0, riser: 0, noise: 1, hook: 0 } },
  { at: 4, len: 4, name: 'BUILD', values: { kick: 1, snare: 0, ghost: 0, hat: 1, open: 0, rim: 0, clap: 0, bass: 0.5, motif: 0.5, stab: 0, lead: 0, riser: 0, noise: 0.6, hook: 0 } },
  { at: 8, len: 8, name: 'VERSE A', values: { kick: 1, snare: 1, ghost: 1, hat: 1, open: 1, rim: 1, clap: 0, bass: 1, motif: 1, stab: 0.6, lead: 0, riser: 0, noise: 0.25, hook: 0 } },
  { at: 16, len: 4, name: 'BREAK', values: { kick: 0, snare: 0, ghost: 0, hat: 0, open: 0, rim: 0, clap: 0, bass: 0, motif: 0.6, stab: 0, lead: 0, riser: 1, noise: 1, hook: 0 } },
  { at: 20, len: 8, name: 'HOOK', values: { kick: 1, snare: 1, ghost: 0, hat: 1, open: 0, rim: 0, clap: 1, bass: 1, motif: 0, stab: 1, lead: 1, riser: 0, noise: 0.3, hook: 1 } },
  { at: 28, len: 8, name: 'VERSE B', values: { kick: 1, snare: 1, ghost: 1, hat: 1, open: 1, rim: 1, clap: 0, bass: 1, motif: 1, stab: 0.4, lead: 0, riser: 0, noise: 0.25, hook: 0 } },
  { at: 36, len: 8, name: 'HOOK 2', values: { kick: 1, snare: 1, ghost: 0, hat: 1, open: 0, rim: 0, clap: 1, bass: 1, motif: 0, stab: 1, lead: 1, riser: 0, noise: 0.3, hook: 1 } },
  { at: 44, len: 4, name: 'OUTRO', values: { kick: 0, snare: 0, ghost: 0, hat: 0, open: 0, rim: 0, clap: 0, bass: 0, motif: 0.4, stab: 0, lead: 0, riser: 0, noise: 1, hook: 0 } },
]

const AUTOMATION = [
  { path: 'keys.motif.cut', points: [[0, 0.6], [4, 0.9], [8, 1], [16, 1], [20, 2.4], [28, 1.4], [36, 2.4], [44, 0.6]] },
  { path: 'keys.lead.cut', points: [[20, 1], [24, 1.8], [36, 1.4], [40, 2.2]] },
  { path: 'bass.sub.cut', points: [[0, 1], [8, 1], [20, 1.5], [28, 1.3], [36, 1.7], [44, 1]] },
  { path: 'fx.noise.vol', points: [[0, 1], [8, 0.4], [16, 1], [20, 0.4], [44, 1]] },
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

// section flips: verse (boom-bap) vs hook (half-time)
const hookOn = tlOr('hook').fmap((v) => v > 0.001)
const hookOff = tlOr('hook').fmap((v) => v <= 0.001)

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

// ── KICK: boom-bap in verses, half-time in hooks ─────────────────
$: s('bd').struct(m('x ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~ ~'))
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .lpf(drums.kick.cut).lpq(1)
  .decay(drums.kick.decay).sustain(0).release(0.04)
  .distort(drive.mul(0.5))
  .duckorbit(2).duckdepth(0.6).duckattack(0.005)
  .mask(gateOf('kick')).mask(hookOff)

$: s('bd').struct(m('x ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~'))
  .gain(drums.kick.vol.mul(tlOr('kick')))
  .lpf(drums.kick.cut).lpq(1)
  .decay(0.42).sustain(0).release(0.06)
  .distort(drive.mul(0.5))
  .duckorbit(2).duckdepth(0.6).duckattack(0.005)
  .mask(gateOf('kick')).mask(hookOn)

// ── SNARE: backbeat in verses, beat 3 in hooks + clap ───────────
$: s('sd').struct(m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'))
  .gain(drums.snare.vol.mul(tlOr('snare')))
  .lpf(drums.snare.cut).lpq(2).hpf(180)
  .decay(drums.snare.decay).sustain(0).release(0.08)
  .room(space.mul(0.35)).roomsize(fx.reverb.size)
  .mask(gateOf('snare')).mask(hookOff)

$: s('sd').struct(m('~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~'))
  .gain(drums.snare.vol.mul(tlOr('snare')))
  .lpf(drums.snare.cut).lpq(2).hpf(180)
  .decay(0.22).sustain(0).release(0.10)
  .room(space.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('snare')).mask(hookOn)

$: s('cp').struct(m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'))
  .gain(drums.clap.vol.mul(tlOr('clap')))
  .lpf(7000).hpf(400).decay(0.10).sustain(0)
  .room(space.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('clap')).mask(hookOn)

// ghost 16ths around the backbeat — the pocket
$: s('sd').struct(m('~ ~ x ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x'))
  .gain(drums.snare.vol.mul(tlOr('ghost')).mul(0.28))
  .lpf(4200).hpf(300).decay(0.05).sustain(0).release(0.02)
  .mask(gateOf('ghost'))

// ── HATS: swung 16ths in verses, 12-step triplets in hooks ──────
$: s('hh').struct(m('x*16'))
  .gain(drums.hat.vol.mul(tlOr('hat')).mul(m('[.9 .25 .6 .3]*4')))
  .hpf(600).decay(0.04).sustain(0)
  .swingBy(0.07, 8)
  .mask(gateOf('hat')).mask(hookOff)

$: s('hh').struct(m('x*12'))
  .gain(drums.hat.vol.mul(tlOr('hat')).mul(m('[.9 .4 .6 .4]*3')))
  .hpf(600).decay(0.04).sustain(0)
  .mask(gateOf('hat')).mask(hookOn)

$: s('oh').struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'))
  .gain(drums.hat.vol.mul(drums.hat.open).mul(tlOr('open')))
  .hpf(700).decay(0.12).sustain(0)
  .mask(gateOf('open'))

$: s('rim').struct(m('~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~'))
  .gain(drums.perc.vol.mul(tlOr('rim')))
  .hpf(400).lpf(5000).decay(0.06).sustain(0)
  .room(space.mul(0.4)).roomsize(fx.reverb.size)
  .mask(gateOf('rim'))

// ── 808: short boom-bap line in verses, half-time roots in hooks ─
$: note(m('d1 ~ d1 ~ f1 ~ a1 ~ d1 ~ f1 ~ a1 ~ c2 ~'))
  .s('sine')
  .gain(bass.sub.vol.mul(tlOr('bass')))
  .lpf(bass.sub.cut.mul(autoAt('bass.sub.cut'))).lpq(2)
  .clip(0.95).decay(0.20).sustain(0.45).release(0.10)
  .distort(drive)
  .orbit(2)
  .mask(gateOf('bass')).mask(hookOff)

$: note(m('d1 ~ ~ ~ ~ ~ bb1 ~ ~ ~ ~ ~ f1 ~ ~ ~'))
  .s('sine')
  .gain(bass.sub.vol.mul(tlOr('bass')))
  .lpf(bass.sub.cut.mul(autoAt('bass.sub.cut'))).lpq(2)
  .clip(0.98).decay(0.55).sustain(0.55).release(0.30)
  .distort(drive)
  .orbit(2)
  .mask(gateOf('bass')).mask(hookOn)

// ── MOTIF (verse): D Phrygian with a C# (Db) accent, short notes ─
$: note(m('d3 ~ eb3 f3 ~ a3 bb3 ~'))
  .s('triangle')
  .gain(keys.motif.vol.mul(tlOr('motif')))
  .lpf(keys.motif.cut.mul(autoAt('keys.motif.cut'))).lpq(6)
  .decay(0.14).sustain(0).release(0.08)
  .delay(0.22).delaytime(3 / 16)
  .room(space.mul(0.45)).roomsize(fx.reverb.size)
  .mask(gateOf('motif'))

// ── STAB: short Dm7 / Bb / Gm / A7, never a sustained drone ──────
$: note(m('<[d3,f3,a3,c4] [bb2,d3,f3,a3] [g2,bb2,d3,f3] [a2,db3,e3,g3]>'))
  .s('triangle').unison(2).detune(0.06)
  .gain(keys.stab.vol.mul(tlOr('stab')))
  .lpf(keys.stab.cut).lpq(3)
  .clip(0.12).decay(0.18).sustain(0).release(0.10)
  .room(space.mul(0.4)).roomsize(fx.reverb.size)
  .mask(gateOf('stab'))

// ── HOOK ANSWER: a different phrase over the half-time groove ────
$: note(m('a3 c4 d4 eb4 d4 c4 a3 eb3'))
  .s('triangle')
  .gain(keys.lead.vol.mul(tlOr('lead')))
  .lpf(keys.lead.cut.mul(autoAt('keys.lead.cut'))).lpq(5)
  .decay(0.16).sustain(0).release(0.10)
  .delay(0.28).delaytime(3 / 16)
  .room(space.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('lead'))

// ── BREAK: noise riser + snare roll into the hook ────────────────
$: s('pink').struct(m('x*16'))
  .gain(fx.noise.vol.mul(tlOr('riser')).mul(0.6))
  .lpf(saw.range(300, 9000)).hpf(200)
  .room(space.mul(0.4)).roomsize(fx.reverb.size)
  .mask(gateOf('riser'))

$: s('sd').struct(m('~ ~ ~ ~ ~ ~ ~ ~ x x x x x x x x'))
  .gain(drums.snare.vol.mul(tlOr('riser')).mul(saw.range(0.15, 0.7)))
  .hpf(300).decay(0.06).sustain(0)
  .mask(gateOf('riser'))

// ── LOW NOISE BED: intro/outro air, very quiet elsewhere ─────────
$: s('pink').struct(m('x*2'))
  .gain(fx.noise.vol.mul(tlOr('noise')).mul(autoAt('fx.noise.vol')))
  .lpf(900).hpf(80)
  .room(space.mul(0.5)).roomsize(fx.reverb.size)
