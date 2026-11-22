# Dub Techno — recipes for Strudel

Ready-made pieces from `techno/16-minimal-dub` and `techno/17-halfstep-dub`.
Full tracks are in `tracks/techno/`; here only what gets reused.

## Skeleton

```js
const BPM = 120
setcpm(BPM / 4) // one cycle = one 4/4 bar

if (typeof samples === 'function') {
  samples('github:tidalcycles/uzu-drumkit')
  samples('github:tidalcycles/Dirt-Samples')
}

const phrase = (bars) => m('<' + bars.join(' ') + '>')
const verb = slider(0.7, 0, 1, 0.01) // big dark reverb
```

The instrument tree — the usual one:

```js
const instruments = {
  atmos: { name: 'Atmos', hiss: { vol, cut, hpf }, air: { vol, cut, lfo }, field: { vol, cut } },
  drums: { name: 'Drums', kick: { vol, cut, shape, decay }, hat: { ... }, rim: { ... }, click: { ... } },
  bass:  { name: 'Bass',  sub: { vol, cut, decay }, dub: { vol, cut, decay } },
  chords:{ name: 'Chords', pad: { ... }, stab: { ... } },
  fx:    { name: 'FX', dub: { send, time, feedback }, reverb: { size } },
}
const { atmos, drums, bass, chords, fx } = instruments
const audible = (h) => {
  const g = h.value?.gain
  return typeof g !== 'number' || g > 0.001
}
```

## Harmony

### Classic 120 BPM: Am9 → Bbmaj9

```js
// @roots a a a a bb bb bb bb
const ROOT = phrase([
  '[a1]', '[a1]', '[a1]', '[a1]',
  '[bb1]', '[bb1]', '[bb1]', '[bb1]',
])

const PAD_A = phrase([
  '[a2,c3,e3,g3,b4]', '[a2,c3,e3,g3,b4]',
  '[a2,c3,e3,g3,b4]', '[a2,c3,e3,g3,b4]',
  '[bb2,d3,f3,c4,a4]', '[bb2,d3,f3,c4,a4]',
  '[bb2,d3,f3,c4,a4]', '[bb2,d3,f3,c4,a4]',
])

const PAD_B = phrase([
  '[a3,e4,b4]', '[a3,e4,b4]',
  '[a3,e4,b4]', '[a3,e4,b4]',
  '[bb3,f4,c5]', '[bb3,f4,c5]',
  '[bb3,f4,c5]', '[bb3,f4,c5]',
])
```

Why this way:
- `bII` (Bb) — a juicy half-step shift, not 1–2–4–5.
- Am9 has `e`, Bbmaj9 has `bb`; don't put them in the same bar at the same time.
- `PAD_A` — a warm stacking; `PAD_B` — open fifths/9ths without thirds.
- `b4`/`a4` are raised so the stab doesn't catch a minor second with `b3`/`a3`.

### Halfstep 104 BPM: Dm9 → Bbmaj9

```js
// @roots d d d d bb bb bb bb
const PAD_A = phrase([
  '[d3,f3,a3,c4,e4]', '[d3,f3,a3,c4,e4]',
  '[d3,f3,a3,c4,e4]', '[d3,f3,a3,c4,e4]',
  '[bb2,d3,f3,c4,a4]', '[bb2,d3,f3,c4,a4]',
  '[bb2,d3,f3,c4,a4]', '[bb2,d3,f3,c4,a4]',
])
```

## Sub and dub bass

Project rule: **cutoff ≤80 Hz**. Slider max = 80; you can't go higher.

```js
bass: {
  name: 'Bass',
  sub: { vol, cut: slider(70, 40, 80, 1), decay },
  dub: { vol, cut: slider(80, 40, 80, 1), decay },
}
```

```js
// Sub — offbeat pulse, not on the kick beat.
$: note(ROOT)
  .s("sine")
  .struct("~ x ~ ~ ~ x ~ ~")
  .gain(bass.sub.vol)
  .lpf(bass.sub.cut)
  .shape(0.2)
  .attack(0.01).decay(bass.sub.decay).sustain(0.6).release(0.3)
  .filter(audible)

// Dub bass — a phrase with rests and counterpoint, not "root-third-fifth".
$: note(BASS)
  .s("triangle")
  .gain(bass.dub.vol)
  .lpf(bass.dub.cut).lpq(1.2)
  .decay(bass.dub.decay).sustain(0.5).release(0.2)
  .filter(audible)
```

An example `BASS` for Am/Bb (all notes below 80 Hz):

```js
const BASS = phrase([
  '[a1 ~ ~ e1 ~ ~ g1 ~]',
  '[~ a1 ~ ~ c2 ~ ~ e1]',
  '[a1 ~ ~ ~ e1 ~ g1 ~]',
  '[~ ~ d2 ~ ~ e1 ~ a1]',
  '[bb1 ~ ~ f1 ~ ~ d2 ~]',
  '[~ a1 ~ ~ c2 ~ ~ f1]',
  '[a1 ~ ~ ~ f1 ~ d2 ~]',
  '[~ ~ c2 ~ ~ f1 ~ bb1]',
])
```

`a1` on Bb bars is a maj7 pedal, not a mistake. Don't add `e` on Bb:
`e–bb` is a tritone.

## Kick

```js
$: s("bd*4")
  .gain(drums.kick.vol)
  .lpf(drums.kick.cut).lpq(1)       // 250–300
  .shape(drums.kick.shape)          // 0.4–0.5, soft
  .decay(drums.kick.decay).sustain(0).release(0.08)
  .filter(audible)
```

No click, distortion or bright top. In halfstep the kick can be
`x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x` (1 + pickup) or `1 + 3.5`.

## Stab in the delay — the main sound

```js
const STAB = phrase([
  '[~ [a3,c4,e4,g4] ~ ~ ~ ~ ~ ~]',
  // ...
  '[~ [bb3,d4,f4,a4] ~ ~ ~ ~ ~ ~]',
])
```

```js
$: note(STAB)
  .s("sawtooth").unison(2).detune(0.06)
  .gain(chords.stab.vol)
  .lpf(chords.stab.cut).lpq(chords.stab.res).ftype("24db")
  .decay(chords.stab.decay).sustain(0).release(0.4)
  .delay(fx.dub.send)
  .delaytime(fx.dub.time)
  .delayfeedback(fx.dub.feedback)
  .room(chords.stab.room.mul(verb)).roomsize(fx.reverb.size)
  .filter(audible)
```

Values:
- `fx.dub.time` = `0.375` — a dotted quarter.
- At 120 BPM one cycle = 2 s, so the echo is **0.75 s** later.
- `fx.dub.feedback` 0.45–0.65; higher — mush.
- `chords.stab.cut` 900–1200; the repeats are darker than the dry stab.
- The dry stab must be louder than the first echo.

## Pad

```js
// WARM
$: note(PAD_A)
  .s("sawtooth").partials([1, 0.45, 0.25, 0.1, 0.05])
  .unison(2).detune(chords.pad.det)
  .gain(chords.pad.vol.mul(hA))
  .lpf(chords.pad.cut).hpf(chords.pad.hpf).lpq(chords.pad.q).ftype("24db")
  .lpdepth(chords.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.4)
  .attack(4).decay(3).sustain(0.9).release(12)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// AIR
$: note(PAD_B)
  .s("triangle").partials([1, 0.3, 0.15, 0.06])
  .unison(3).detune(chords.pad.det.mul(1.4))
  .gain(chords.pad.vol.mul(hB))
  .lpf(chords.pad.cut.mul(1.2)).hpf(300).lpq(chords.pad.q.mul(0.7))
  .attack(6).decay(4).sustain(0.9).release(16)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)
```

`hA`/`hB` — the harmony latch over 8 bars. The pad doesn't move with the kick.

## Hats, rim, click

```js
$: stack(
     s("~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~").gain(drums.hat.vol.mul(m0)),
     s("~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~").gain(drums.hat.vol.mul(m2).mul(0.8)),
   )
  .lpf(drums.hat.cut).hpf(500)
  .decay(drums.hat.decay).sustain(0)
  .delay(fx.dub.send.mul(0.35)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback.mul(0.5))
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .filter(audible)
```

```js
$: stack(
     s("~ ~ ~ ~ rim ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~").gain(drums.rim.vol.mul(m0)),
     s("~ ~ rim ~ ~ ~ rim ~ ~ ~ rim ~ ~ ~ rim ~").gain(drums.rim.vol.mul(m1)),
     // ...
   )
  .lpf(drums.rim.cut).hpf(500).lpq(2)
  .decay(0.06).sustain(0)
  .pan(rand.mul(1.2).sub(0.6))
  .delay(drums.rim.echo.mul(fx.dub.send))
  .delaytime(fx.dub.time).delayfeedback(fx.dub.feedback.mul(0.6))
  .filter(audible)
```

Click — only in STRIP/CLICK:

```js
$: s("click:0")
  .struct("~ x ~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~")
  .gain(drums.click.vol.mul(m1.add(m3)))
  .lpf(drums.click.cut).hpf(2000)
  .decay(0.03).sustain(0)
  .pan(rand.mul(1.6).sub(0.8))
  .delay(drums.click.echo.mul(fx.dub.send))
  .delaytime(fx.dub.time).delayfeedback(fx.dub.feedback)
  .filter(audible)
```

## Textures

```js
$: s("crackle")
  .gain(atmos.hiss.vol)
  .lpf(atmos.hiss.cut).hpf(atmos.hiss.hpf)
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .filter(audible)

$: s("pink")
  .gain(atmos.air.vol)
  .lpf(atmos.air.cut).hpf(120).lpq(0.7)
  .lpdepth(atmos.air.lfo).lpsync(0.0625)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

$: s("wind:0")
  .loopAt(8)
  .gain(atmos.field.vol)
  .lpf(atmos.field.cut).hpf(200)
  .room(verb.mul(0.7)).roomsize(fx.reverb.size)
  .pan(sine.slow(64).range(0.3, 0.7))
  .filter(audible)
```

## Modes and transport

Declare the panel roles in a code manifest, not in comments:

```js
const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
  switches: {
    mode: ['dub', 'strip', 'pressure', 'click'],
    harmony: ['warm', 'air'],
  },
}
const play = slider(1, 0, 2, 1)
const holdBar = slider(0, 0, 191, 1)
const mode = slider(0, 0, 3, 1)
const harmony = slider(0, 0, 1, 1)
```

`mode` changes only hats/rim/click/shaker. The kick and sub stay. With
`autoSwitch('mode', mode)` / `autoSwitch('harmony', harmony)` the knob works
in LOOP and the TIMELINE supplies the value in SONG/HOLD.

## Scenes (legacy)

```js
// @scenes {"intro":{...},"theme":{...}}
```

Old tracks still parse this, but new tracks should use `TIMELINE` sections.
Keep `@scenes` only when you really want two quick A/B presets; keys are tree
paths (`drums.kick.vol`) or global knob names (`mode`, `harmony`).

## Halfstep variant (Burial)

- 104 BPM, `setcpm(104 / 4)`.
- Kick on 1 + pickup, snare on 3, noisy 16th hats with swing.
- `swingBy(0.12, 8)` on the hats.
- Harmony Dm9 → Bbmaj9; vocal pad `vowel("<a o>")`.
- Sub ≤80 + a separate growl (an exception to the 80 rule — this is the midrange).
- Moog note and Moog arp — color, not a lead.

## Audits

```bash
npm run verify -- tracks/techno/16-minimal-dub.js
npm run tension -- tracks/techno/16-minimal-dub.js
npm run modes -- tracks/techno/16-minimal-dub.js
npm run latch -- tracks/techno/16-minimal-dub.js
npm run gains -- tracks/techno/16-minimal-dub.js
npm run doubles -- tracks/techno/16-minimal-dub.js
npm run cpu -- tracks/techno/16-minimal-dub.js
npm run live -- tracks/techno/16-minimal-dub.js
```

Guidelines for minimal dub:
- `verify` — no errors; 13–17 tracks, 47–90 sliders.
- `tension` — clean; triads/9ths without tritones.
- `cpu` — 3–4 worklets/s, with headroom.
- `gains` — quiet with everything at zero.
- `doubles` — no overlaps; empty first bars in sparse layers are normal.
- `live` — eval ok; the PRELOAD SAMPLES button downloads 45 files for 16.

## Khmer percussion bus (18)

18 Khmer channels — one `stack`, so they all go through a shared
delay/reverb instead of 18 separate tails.

```js
const percLayers = PERC.map((p) => {
  const base = p.note ? note(p.note).s(p.s) : s(p.s).n(p.n)
  return base.struct(m(p.pat)).speed(p.speed)
    .gain(perc[p.key].vol.mul(unmuted(MUTES[p.group])))
    .lpf(perc[p.key].cut).hpf(p.hpf)
    .clip(perc[p.key].clip)
    .pan(p.pan)
})

$: stack(...percLayers)
  .delay(percEcho)
  .delaytime(fx.dub.time)
  .delayfeedback(fx.dub.feedback.mul(0.7))
  .room(verb.mul(percVerb)).roomsize(verbSize)
  .filter(audible)
```

`PERC` — 18 specs: `east`/`hand`/`tabla`/`metal`.
Each channel has `vol/cut/clip` in the tree, the groups have mutes. Notes/patterns
carry the rhythm, not a melody.

## Native timeline (18)

A timeline that plays in plain Strudel. The table is a readable array of
objects; the values are multipliers for the live sliders. Edits in the panel are applied
on Ctrl/Cmd+Enter.

```js
const TIMELINE = [
  {
    at: 0,
    len: 8,
    name: 'INTRO',
    values: { kick: 0, sub: 0, pad: 0.5, perc: 0.6 },
  },
  {
    at: 8,
    len: 16,
    name: 'DUB',
    values: { kick: 1, sub: 1, pad: 1, perc: 1 },
  },
]

const TL_TOTAL = Math.max(...TIMELINE.map((s) => s.at + s.len))
const tlCurve = (key) => {
  let last = 0
  const segs = []
  for (let i = 0; i < TIMELINE.length; i++) {
    const sec = TIMELINE[i]
    if (key in sec.values) last = sec.values[key]
    const next = i + 1 < TIMELINE.length ? TIMELINE[i + 1].at : TL_TOTAL
    if (next > sec.at) segs.push([next - sec.at, pure(last)])
  }
  return arrange(...segs)
}

$: s("bd*4").gain(drums.kick.vol.mul(tlCurve('kick')))
```

Important: strings in the table are in **single** quotes. The strudel.cc
transpiler fails on double quotes inside JS code (`Unexpected string`).
