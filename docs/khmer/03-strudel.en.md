# The Khmer track in Strudel

Track: `tracks/khmer/01-sathukar.js`. 88 BPM, 27 tracks, 83 sliders.
One cycle = one 4/4 bar: `setcpm(88 / 4)`.

## 1. Skeleton

```js
const BPM = 88
setcpm(BPM / 4)

const scene = slider(2, 0, 4, 1)   // intro build main break outro
const mode = slider(1, 0, 3, 1)    // sathukar pinpeat boxing percussion
const harmony = slider(0, 0, 1, 1) // fifth axis
```

Gates are ordinary signals:

```js
const atScene = (n) => scene.fmap((v) => (v === n ? 1 : 0))
const drumsOn = scene.fmap((v) => (v === 1 || v === 2 || v === 3 ? 1 : 0))
const m0 = mode.fmap((v) => (v === 0 ? 1 : 0))
// …
```

Harmony latch:

```js
const hQ = harmony.seg(1 / 8)
const hA = hQ.fmap((h) => (h < 0.5 ? 1 : 0))
const hB = hQ.fmap((h) => (h < 0.5 ? 0 : 1))
```

`seg(1/8)` makes one sample per 8 bars: you can move the slider at any
time, the sound changes on the phrase boundary. `latch` reports this
as "bar 8, not bar 4".

## 2. Instruments

### Roneat ek — wooden xylophone

```js
note(EK7)
  .s("triangle").partials([1, 0.5, 0.25, 0.12])
  .penv(-5).panchor(1).pattack(0.001).pdecay(0.02).psustain(0)
  .gain(roneat.ek.vol.mul(ek7On).mul(ekOn))
  .lpf(roneat.ek.cut).hpf(400).lpq(1)
  .decay(roneat.ek.decay).sustain(0).release(0.05)
```

A negative `penv` with `panchor(1)` gives a short pitch drop on the
attack — the "tok" of a bar. `partials` adds odd overtones so the
triangle does not sound like a sine.

### Kong vong — bronze gong

```js
note(VONG)
  .s("sine")
  .fm(gong.vong.fm).fmh(gong.vong.ratio)
  .fmdecay(gong.vong.decay).fmsustain(0)
  .decay(gong.vong.decay).sustain(0).release(0.4)
```

FM with an inharmonic `fmh` (1.41) gives a bronze overtone.
`fmsustain(0)` is mandatory: otherwise the modulator drags the tail.

### Sralai — reed oboe

```js
note(REED)
  .s("sawtooth").unison(2).detune(0.05)
  .lpf(reed.lead.cut).lpq(reed.lead.q).ftype("24db")
  .shape(reed.lead.grit)
  .attack(reed.lead.att).decay(0.2).sustain(0.8).release(reed.lead.rel)
```

Saw + resonance + a short `shape` = dirty reed. No smooth vibrato and
no "jazz" articulation.

### Sampho — two heads

```js
s("sine").struct("x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ x")
  .gain(drums.samLow.vol.mul(drumsOn).mul(m1))
  // …
  .note("<eb2>").add(note(drums.samLow.pitch))
  .penv(-8).panchor(1).pattack(0.001).pdecay(0.04).psustain(0)
  .lpf(drums.samLow.cut).hpf(80)
  .decay(drums.samLow.decay).sustain(0)
```

Three layers: low (theung), high (ting), ghost (tip/tup). Each has its
own pitch and filter.

### Skor thom — pair of drums

```js
s("triangle").struct("x ~ ~ ~ ~ ~ x ~ x ~ ~ ~ ~ ~ x ~")
  .gain(drums.skorLow.vol.mul(drumsOn).mul(m1))
  // …
  .note("<c1>").add(note(drums.skorLow.pitch))
  .penv(-12).panchor(1).pattack(0.001).pdecay(0.08).psustain(0)
  .lpf(drums.skorLow.cut).hpf(30)
  .decay(drums.skorLow.decay).sustain(0).release(0.08)
```

Low is loose and dull, high is tight and higher. No samples, so the
pair does not become a drum kit.

### Chhing — the clock

```js
s("sine").struct("x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~")
  .gain(drums.chhing.vol.mul(m1))
  .note("<c6>")
  .fm(1.8).fmh(2.76).fmdecay(drums.chhing.decay).fmsustain(0)
  .decay(drums.chhing.decay).sustain(0)
```

Closed is short; open is longer and on another note. In BOXING the
grid becomes 8ths.

## 3. Pads

A pad is momentary: the panel writes 1 while held and 0 on release.
In the track it is always a gate:

```js
gain(gong.thom.vol.mul(padGong).mul(1.4))
```

Pads: `padGong`, `padSampho`, `padSkor`, `padChhing`, `padReed`,
`padSwell` (keys 1–6). None sounds by default; `gains` verifies that.

## 4. Scenes

`// @scenes` gives two panel buttons:

```js
// @scenes {"intro":{…},"theme":{…}}
```

Keys are full tree paths (`drums.skorLow.vol`, `roneat.ek.vol`,
`verb`). Intro: air, drone, gongs, chhing. Theme: full ensemble.

## 5. Strudel 1.2.6 gotchas

- **`.add(slider)` on a note pattern.** `note("<c1>").add(drums.skorLow.pitch)`
  prints `[warn]: Can't do arithmetic on control pattern` and does not
  apply the shift. Use `.add(note(drums.skorLow.pitch))`. The track
  does this.
- **`shape` is a worklet per event.** Expensive on drums; `shape` is
  only on the sralai (sparse notes). Drums use `penv` + `lpf` + `decay`.
- **No `samples()` in node.** This track has no samples at all: only
  `sine`, `triangle`, `sawtooth`, `white`, `pink`. `live` does not
  depend on GitHub.
- **`.gain()` after `stack()` overwrites inner gains.** So each
  pattern inside `stack` carries its own `vol.mul(gate)`, and there is
  no outer `.gain()`.
- **`lpdepth` is a multiplier, not hertz.** `atmos.air` uses
  `lpdepth(lfo).lpsync(0.125)`; see `docs/references.en.md`.

## 6. Budget

`npm run cpu -- tracks/khmer/01-sathukar.js`:

| mode | worklets/bar | per second |
|---|---|---|
| 0 sathukar | 0 | 0 |
| 1 pinpeat | 1 | 0 |
| 2 boxing | 4 | 1 |
| 3 percussion | 0 | 0 |

Very low: the track has almost no worklet effects. There is plenty of
headroom to add `shape` on the sralai or filters on the gongs without
risking dropouts.

## 7. Gates

```bash
npm run verify  -- tracks/khmer/01-sathukar.js
npm run tension -- tracks/khmer/01-sathukar.js
npm run modes   -- tracks/khmer/01-sathukar.js
npm run latch   -- tracks/khmer/01-sathukar.js
npm run gains   -- tracks/khmer/01-sathukar.js
npm run doubles -- tracks/khmer/01-sathukar.js
npm run cpu     -- tracks/khmer/01-sathukar.js
npm run live    -- tracks/khmer/01-sathukar.js
```

Result for 01:

- `verify` — 27 tracks, 49 hits/bar, 83 sliders, 0 errors;
- `tension` — clean, 96 deliberate tritones;
- `modes` — every drum changes pattern, melodies switch by mode;
- `latch` — bar 8;
- `gains` — silent at all zeros;
- `doubles` — no collisions;
- `cpu` — 4/bar worst case;
- `live` — eval ok, pattern plays, slider sync ok.

## 8. Why not microtones

`note()` in Strudel accepts fractional numbers, but `tension` and
`phrase([...])` read notes as names (`c5`, `db5`). Fractional MIDI
values would fall out of the analysis. So the tuning is approximated
in 12-TET, and the "drifting" Khmer pitch is described in the docs
rather than simulated. A deliberate trade-off: verifiability over
pseudo-precision.

## 9. 02-skors: real samples, rhythm scenes, mutes

The second track uses no synthesis. The sample map is two calls:

```js
if (typeof samples === 'function') {
  samples('github:tidalcycles/Dirt-Samples')
  samples({
    xylo: {
      c5: 'Percussion/Xylo/Xylo_Medium_C5_ff_01_far.wav',
      g5: 'Percussion/Xylo/Xylo_Medium_G5_ff_01_far.wav',
    },
    marimba: {
      c4: 'Percussion/Marimba/Marimba_hit_Outrigger_C4_loud_01.wav',
      g4: 'Percussion/Marimba/Marimba_hit_Outrigger_G4_loud_01.wav',
    },
    gong: {
      c2: 'Percussion/gongHit_mf.wav',
      g2: 'Percussion/gongHit_f.wav',
    },
    claves: {
      c6: 'Percussion/Claves1_Hit_v1_rr1_Sum.wav',
    },
  }, 'https://raw.githubusercontent.com/sgossner/VSCO-2-CE/master/')
}
```

`note("c5").s("xylo")` picks the nearest sample and pitch-shifts it.
VSCO 2 CE is CC0; Dirt-Samples provides real taiko/hand/tabla/metal.

### Scenes are rhythm only

```js
const sc = (arr) => scene.pick(arr.map((s) => m(s)))
$: s("east").n("6 7 8")
  .struct(sc(R.skorLow))
  .gain(drums.skorLow.vol.mul(unmuted(muteSkor)))
```

`R.skorLow` is an array of five 16-step patterns. The scene selects a
pattern but does **not** multiply gain: every instrument exists in every
scene. `mode` changes only the fill/ghosts/swing.

### Mutes instead of scenes

```js
const muteSkor = slider(0, 0, 1, 1)
const unmuted = (m) => m.fmap((v) => (v ? 0 : 1))
.gain(drums.skorLow.vol.mul(unmuted(muteSkor)))
```

`// @mutes muteSkor,muteSampho,…` draws a row of buttons under the
scenes (panel `#mutes`). They are ordinary 0/1, not momentary: a click
mutes the layer, the pattern stays in the sequencer. The track has no
pads.

### Instrument settings

Each layer in the `instruments` tree has five controls:
`vol`, `cut` (lpf), `hpf`, `clip` (sample length), `room`. The panel
shows `vol` in MIXER and the rest in TONE; in code that is, for example,
`drums.skorLow.cut` or `xylo.ek.room`. They are ordinary signals, so
they can be changed live and saved to JSON.

### Limits

- The VSCO xylophone/marimba are Western instruments, not roneat.
- The PRELOAD SAMPLES button downloads only `github:` maps; VSCO loads lazily
  from direct URLs.
- No Khmer one-shot bank was found; local recordings are better. See
  `05-samples.md`.

## 10. 03-skors-ritual: percussion only

The third track has no high lines: no high xylophones, no sralai.
Drums (skor high, sampho low/high/ghost, chhing/open, krap, fills),
a low kong thom and a **low xylophone** (VSCO marimba).

```js
const BPM = 76
setcpm(BPM / 4)

// lower tuning and longer tails
.note("<g1>").add(note(drums.skor.pitch))
.penv(-10).panchor(1).pattack(0.001).pdecay(0.05).psustain(0)
.lpf(drums.skor.cut).decay(drums.skor.decay)
```

- Every layer is a regular `$:` sequencer; no pads.
- `scene` 0–3 changes rhythm only; `mode` is fill/ghosts/swing.
- `// @mutes` silences skor/sampho/chhing/krap/gong.
- `harmony` fifth/axis: kong thom C–G ⇄ C–Gb, latched every 8 bars.
- Low xylophone: `xylo.low` with `octave` 0/1/2 (0/−1/−2). Real marimba
  samples; `note(LOW).add(note(xylo.low.octave.fmap(o => -12 * o)))`.
- Low register and emptiness are part of the composition; do not add a
  high xylophone back.

## 11. 04-confluence: 12 rhythms + acid

The fourth track is a mix of 01–03. The Khmer part stays rhythmic:
12 `SKOR`, `SAM`, `CHHING` cells with `late`, `ply`, `degrade`.
Melody lives only in the separate acid section.

```js
const sc = (arr) => scene.pick(arr.map((s) => m(s)))
$: s("east").n("6 7 8")
  .struct(sc(SKOR))
  .gain(drums.skorLow.vol.mul(unmuted(muteSkor)))
```

Acid bass and arp:

```js
$: note("c1 c1 eb1 c1 f1 c1 gb1 c1 bb0 c1 eb1 c1 f1 gb1 c1 bb0")
  .s("sawtooth")
  .fast(acidInst.bass.pace.fmap((p) => p / 16))
  .lpenv(acidInst.bass.env)
  .lpa(0.002).lpd(acidInst.bass.decay).lpsustain(0.1)

$: note("[c4,eb4,gb4,bb4]")
  .arp(run(acidInst.arp.pace))   // pace = steps per bar
  .s("sawtooth")
```

- `acid` 0/1 enables the section; `pace` 4…32 on bass and arp.
- `verb` up to 1.2, `verbSize` up to 16.
- Khmer layers are ostinato/rhythm; do not add melody to them.
- `scene` 0…11 — 12 rhythms; `mode` — fill/ghost/swing.
