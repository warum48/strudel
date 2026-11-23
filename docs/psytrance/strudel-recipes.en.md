# Psytrance — Strudel recipes

Working snippets for full-on psytrance. Everything uses native Strudel
functions: `m(...)`, `struct`, `lpf/lpq/lpenv`, `duckorbit`, `delay`, `room`.
Sliders are non-negative literals only.

## 0. Values that work in Strudel

- `lpf` is Hz (0–20000), `lpq` is Q (0–50), `lpenv` is octaves.
- Q 12–15 is a scream; use 0–4 for musical filters.
- Acid = **low base** (80–200 Hz) + **deep envelope** (3–5 octaves), not a
  high base + shallow envelope.
- `roomsize` is 0–10 (not 16). `room` is 0–1. `delaytime` is seconds.

## 1. Kick + rolling bass + sub

```js
const bassPat = m('~ x x x ~ x x x ~ x x x ~ x x x')

// kick: short, with a click, ducks orbit 2
$: s('bd').struct(m('x*4'))
  .gain(kickVol.mul(tlOr('kick')))
  .lpf(180).lpq(1).shape(0.4)
  .decay(0.10).sustain(0).release(0.01)
  .duckorbit(2).duckdepth(duck).duckattack(0.01)
  .mask(gateOf('kick')).filter(audible)

// top bass: saw, LP + filter envelope, the note dies before the next one
$: note(m('f#1')).struct(bassPat)
  .s('sawtooth').unison(1)
  .gain(bassVol.mul(tlOr('bass')))
  .lpf(bassCut).lpq(2).ftype('24db')
  .lpenv(3).lpa(0.002).lpd(0.05).lpsustain(0)
  .decay(0.05).sustain(0).release(0.02)
  .distort(1.2).clip(0.9)
  .orbit(2)
  .mask(gateOf('bass')).filter(audible)

// sub: same figure, sine, root only
$: note(m('f#1')).struct(bassPat)
  .s('sine')
  .gain(subVol.mul(tlOr('sub')))
  .lpf(42)
  .decay(0.08).sustain(0).release(0.02)
  .orbit(2)
  .mask(gateOf('sub')).filter(audible)
```

Rules: 12 notes per bar, all identical; `sustain 0`; top and sub are separate
tracks; the kick ducks orbit 2.

## 2. Open hat on the offbeat

```js
$: s('oh').struct(m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'))
  .gain(ohVol.mul(tlOr('oh')))
  .lpf(7000).hpf(400)
  .decay(0.18).sustain(0)
  .room(verb.mul(0.35)).roomsize(fx.reverb.size)
  .mask(gateOf('oh')).filter(audible)
```

The position `~ ~ x ~` is the third 16th of each quarter, i.e. the "and".
That is the offbeat drive.

## 3. 303 line

```js
$: note(m('f#2 ~ f#2 ~ g2 ~ f#2 a#2 ~ f#2 ~ g2 f#2 ~ a#2 ~'))
  .s('sawtooth').unison(1)
  .gain(acidVol.mul(tlOr('acid')))
  .lpf(acidCut.mul(autoAt('keys.acid.cut'))).lpq(4).ftype('ladder')
  .lpenv(4.5).lpa(0.002).lpd(0.055).lpsustain(0.05)
  .decay(0.055).sustain(0.1).release(0.03)
  .delay(0.17).delaytime(0.375).delayfeedback(0.45)
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .mask(gateOf('acid')).filter(audible)
```

One or two notes from the scale, repetition, the filter crawls. This is not
"playing around chords" — it is a rhythmic riff. The low base + deep ladder
envelope is the 303 move; a high base with Q 15 is how it turns into a scream.

## Repetitive dark-trance acid ostinato

Don't jump between many notes. Repeat the same note rhythmically and use
**intervals** as colour: minor second (m2) and minor third (m3).

```js
$: note(m('f#3 f#3 f#3 g3 f#3 f#3 f#3 f#3 f#3 f#3 f#3 a3 f#3 f#3 f#3 f#3'))
  // 16th pulse: 14 x F#, one m2 (G), one m3 (A), no jumps
  .distort('2.2:.3').s('sawtooth')
  .lpf(cut.mul(sine.range(0.7, 1.8).slow(16)))
  .lpenv(2.256).lpq(12)
```

F# is the pulse; G is m2, A is m3; the rhythm repeats every bar. More notes is
fine if they are the same note; the filter/LFO carries the variation.
Myloops: repeat a hook and change a single note; Theory Helper: one/two-note
patterns with rhythmic filter movement; Attack: acid ostinatos from a root +
interval. The filter movement is the riff.

### Second riff: syncopated gallop

A more rhythmic, less arpeggio-like answer for a lift/drop:

```js
$: note(m('f#3 f#3 ~ f#3 g3 ~ f#3 f#3 ~ f#3 a3 ~ f#3 f#3 ~ f#3'))
  // same switchangel_acid chain; use it in LIFT/drops
```

The rhythm is the point: two 16ths, a rest, repeat; m2/m3 are only accents.
In the lift, turn the wide arpeggio lane off so this line leads.

### m6 instead of m3 (occasional colour)

```js
const pulseA = note(m('f#3 f#3 f#3 g3 f#3 f#3 f#3 f#3 f#3 f#3 f#3 a3 f#3 f#3 f#3 f#3'))
const pulseD = note(m('f#3 f#3 f#3 g3 f#3 f#3 f#3 f#3 f#3 f#3 f#3 d4 f#3 f#3 f#3 f#3'))
m('<0 0 0 1>').pick([pulseA, pulseD])  // m3 for 3 bars, m6 on the 4th
```

### Break melody: 4x longer, four 4-bar chunks

Start with a 1-bar motif; the chunk is that motif x4. The 16-bar break has
four chunks: base / variation / base / low variation.

```js
const baseBar = note(m('f#5 ~ a5 ~ c#6 ~ a5 ~ f#5 ~ g#5 ~ a5 ~ g#5 ~'))
const var2Bar = note(m('g5 ~ a5 ~ d#6 ~ a5 ~ f#5 ~ g#5 ~ a5 ~ g#5 ~'))
const var4Bar = note(m('e5 ~ a5 ~ b5 ~ a5 ~ f#5 ~ g#5 ~ a5 ~ g#5 ~'))
const pluckBreak = arrange(
  [4, baseBar],
  [1, var2Bar], [3, baseBar],  // chunk 2: first +1, third +2
  [4, baseBar],                // chunk 3: repeat chunk 1
  [1, var4Bar], [3, baseBar],  // chunk 4: first/third -2
)
```

### Sparse LIFT melody (Faithless-style)

Same notes, but groups of 1 and 3 with rests; the delay/reverb fill the gaps.
Use a slightly longer release and a small gain compensation for the sparse
notes.

```js
const pluckLift = note(m('<[f#5 ~ ~ ~ ~ ~ ~ ~ a5 c#6 a5 ~ ~ ~ ~ ~]
  [~ ~ ~ ~ f#5 ~ ~ ~ ~ ~ a5 ~ ~ ~ f#5 ~]
  [c#6 ~ a5 ~ f#5 ~ ~ ~ ~ ~ ~ ~ a5 ~ ~ ~]
  [~ ~ ~ ~ ~ ~ g#5 ~ a5 ~ c#6 ~ ~ ~ ~ ~]>'))
```

Bar 1: one note, then a 3-note group. Bar 2: one note, then two. Bar 3:
three, then one. Bar 4: a three-note group. Sparse and singable, not an arp.

## 4. Psy lead with a random bandpass

```js
$: note(m('<[f#3 ~ a#3 ~ c#4 ~ a#3 ~] [g3 ~ a#3 ~ f#3 ~ g3 ~]>'))
  .s('sawtooth').unison(2).detune(0.08)
  .gain(leadVol.mul(tlOr('lead')))
  .lpf(leadCut.mul(perlin.slow(8).range(0.8, 1.2))).lpq(2)
  .lpenv(2).lpa(0.003).lpd(0.12).lpsustain(0.1)
  .decay(0.12).sustain(0.2).release(0.15)
  .delay(0.4).delaytime(0.375).delayfeedback(0.5)
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .mask(gateOf('lead')).filter(audible)
```

`rand.range(...)` on the cutoff is a cheap Sample&Hold analog: every event
gets its own value. Do not put this on the bass 16ths — only on sparse
lead notes.

## 5. FM squelch

```js
$: note(m('~ ~ f#4 ~ ~ g4 ~ ~ ~ a#4 ~ ~ ~ g4 ~ ~'))
  .s('sine').fmi(4).fmh(2.01)
  .gain(squelchVol.mul(tlOr('squelch')))
  .bpf(1240).bpq(3.5)
  .attack(0.001).decay(0.06).sustain(0).release(0.02)
  .delay(0.3).delaytime(0.375).delayfeedback(0.4)
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .pan(rand.range(0.3, 0.7))
  .mask(gateOf('squelch')).filter(audible)
```

2–4 squelches per bar, not on the downbeat.

## Psy FX inserts (flight elements)

Short, sparse synth inserts for the gaps. The **fat low** is the exception: it
is a layer, plays from the intro, hits every 4 bars: three hits A1, then A0. Laser/bubble/crunch
are rare (1 bar in 8/16), panned and delayed; do not stack them in drops.

```js
// fat low: A1 from the intro, one note every 4 bars; three hits A1, then A0.
// cutoff 1800–2400 (4-bar LFO), resonance 14–24 (8-bar LFO = half step),
// strong echo + long reverb, attack slider.
$: note(m('<a1 a1 a1 a1 a1 a1 a1 a1 a1 a1 a1 a1 a1 a1 a1 a0>'))
  .struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~'))
  .mask(m('<0 0 0 1>'))
  .s('sawtooth').unison(3).detune(0.25)
  .distort(1.2)
  .lpf(2100 .add(sine.range(-300, 300).slow(4)))
  .lpq(19 .add(sine.range(-5, 5).slow(8)))
  .attack(0.02).decay(0.4).sustain(0.6).release(1.4)
  .delay(0.85).delayfeedback(0.54)
  .room(1.2).pan(sine.slow(8).range(0.2, 0.8))

// laser: 4 low F#3 notes, hard cutoff, 1 bar in 8
$: note(m('f#3 f#3 f#3 f#3'))
  .struct(m('~ ~ ~ ~ ~ ~ ~ ~ x x x x ~ ~ ~ ~'))
  .mask(m('<0 0 0 0 0 0 0 1>'))
  .s('sawtooth').unison(2).detune(0.1)
  .distort(1.1)
  .lpf(2500 .mul(saw.range(0.2, 3.2))).lpq(4)
  .lpenv(3).lpa(0.002).lpd(0.08).lpsustain(0)
  .decay(0.08).sustain(0).release(0.04)
  .delay(0.35).room(0.4).pan(sine.slow(8).range(0.2, 0.8))

// bubble: 4 neutral F#6/G6 FM clicks (m2 only), 1 bar in 16
$: note(m('f#6 f#6 f#6 g6'))
  .struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x x x x'))
  .mask(m('<0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0>'))
  .s('sine').fmi(2).fmh(2.01)
  .attack(0.001).decay(0.03).sustain(0)
  .delay(0.3).pan(rand.range(0.2, 0.8))

// crunch: 2 crushed noise hits, 1 bar in 16
$: s('white')
  .struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ x ~'))
  .mask(m('<0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0>'))
  .crush(6).hpf(400).lpf(4000)
  .decay(0.08).sustain(0).room(0.4).pan(rand.range(0.2, 0.8))
```

The local `switchangel_acid` pulse/FM and `DISSOLUTION-PROTOCOL` bytebeat/
noise are good references for this kind of texture. Keep the rare inserts
unobtrusive: strong pan/delay, low gain; let the fat low carry the weight.


## Dynamic cutoff (the missing ingredient)

The reference examples are mostly static. Move the cutoff in two layers:

```js
// 8th/16th layers: base x slow LFO x section automation
.lpf(cut.mul(sine.range(0.6, 1.3).slow(16)).mul(autoAt('keys.acid.cut')))

// long pads/strings: continuous LFO, one sweep per 16 bars
.lpf(cut).lpdepth(0.6).lpsync(1/16).lpdc(0)
```

`sine.range` is sampled at each event, so it works on bass/acid/arp/plucks.
For long notes use `lpdepth`/`lpsync`; otherwise the filter is sampled only
at the note onset. `autoAt` moves the base per section, the LFO moves it
inside the section.

### Groove acid ramp (start dark, open to the middle)

With `acidCut = 250` and `lpf(acidCut × sine.range(0.7, 1.8) × autoAt(...))`,
the automation `[24, 0.45], [32, 1.0], [40, 0.9]` starts the groove around
80 Hz and opens it to the middle by bar 32. The acid cut slider minimum is 80.

## 6. Riser and reverse

```js
// one long noise hit over 4 bars; off in LOOP
$: s('white').slow(4)
  .gain(riserVol.mul(tlOr('riser', pure(0))))
  .hpf(400).lpf(6000)
  .lpenv(2).lpa(6).lpd(2).lpsustain(0.2)
  .attack(2).decay(2).sustain(0.7).release(1.2)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('riser', pure(0))).filter(audible)

// reverse crash on the way into a section
$: s('cr').rev().slow(2)
  .gain(reverseVol.mul(tlOr('reverse', pure(0))))
  .decay(0.4).sustain(0)
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .mask(gateOf('reverse', pure(0))).filter(audible)
```

Keep `reverse`/`roll` at `loopLevel = 0`: they are not needed in LOOP, only in
sections.

## 7. Arrangement skeleton

```js
const TIMELINE = [
  { at: 0,   len: 16, name: 'INTRO',  values: { kick: 1, bass: 1, sub: 1, hats: 0, acid: 0, lead: 0 } },
  { at: 16,  len: 16, name: 'GROOVE', values: { kick: 1, bass: 1, sub: 1, hats: 1, acid: 1, lead: 0 } },
  { at: 32,  len: 16, name: 'LIFT',   values: { kick: 1, bass: 1, sub: 1, hats: 1, oh: 1, clap: 1, acid: 1, lead: 0 } },
  { at: 48,  len: 16, name: 'BREAK',  values: { kick: 0, bass: 0, sub: 0, hats: 0, acid: 0, lead: 1, riser: 1 } },
  { at: 64,  len: 16, name: 'BUILD',  values: { kick: 1, bass: 1, sub: 1, hats: 1, oh: 1, clap: 1, roll: 1, riser: 1 } },
  { at: 80,  len: 16, name: 'DROP',   values: { kick: 1, bass: 1, sub: 1, hats: 1, oh: 1, clap: 1, acid: 1, lead: 1 } },
]
```

16 bars of kick+bass at the start, layers every 8–16, changes at 8/16
boundaries.

## 8. Checks

```bash
npm run verify  -- tracks/psytrance/01-serpent-engine.js
npm run gains   -- tracks/psytrance/01-serpent-engine.js
npm run cpu     -- tracks/psytrance/01-serpent-engine.js
npm run levels  -- tracks/psytrance/01-serpent-engine.js 104
npm run modes   -- tracks/psytrance/01-serpent-engine.js
```

Reference points: `cpu` — up to ~150 worklets/s; `gains` — silence at zero;
`levels` — the lead/acid is not buried under the pad; `modes` — every mode
changes the figure, not just the volume.
