# Psytrance — Strudel recipes

Working snippets for full-on psytrance. Everything uses native Strudel
functions: `m(...)`, `struct`, `lpf/lpq/lpenv`, `duckorbit`, `delay`, `room`.
Sliders are non-negative literals only.

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
  .lpf(bassCut).lpq(12).ftype('24db')
  .lpenv(3).lpa(0.002).lpd(0.05).lpsustain(0)
  .decay(0.07).sustain(0).release(0.02)
  .distort(1.2).clip(0.9)
  .orbit(2)
  .mask(gateOf('bass')).filter(audible)

// sub: same figure, sine, root only
$: note(m('f#1')).struct(bassPat)
  .s('sine')
  .gain(subVol.mul(tlOr('sub')))
  .lpf(70)
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
  .lpf(acidCut.mul(autoAt('keys.acid.cut'))).lpq(15).ftype('24db')
  .lpenv(4).lpa(0.002).lpd(0.06).lpsustain(0)
  .decay(0.07).sustain(0.1).release(0.03)
  .distort(1.1)
  .delay(0.32).delaytime(0.375).delayfeedback(0.45)
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .mask(gateOf('acid')).filter(audible)
```

One or two notes from the scale, repetition, the filter crawls. This is not
"playing around chords" — it is a rhythmic riff.

## 4. Psy lead with a random bandpass

```js
$: note(m('<[f#3 ~ a#3 ~ c#4 ~ a#3 ~] [g3 ~ a#3 ~ f#3 ~ g3 ~]>'))
  .s('sawtooth').unison(2).detune(0.08)
  .gain(leadVol.mul(tlOr('lead')))
  .bpf(leadCut.mul(rand.range(0.7, 1.3))).bpq(8)
  .lpenv(2).lpa(0.002).lpd(0.1).lpsustain(0.1)
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
  .bpf(1800).bpq(10)
  .attack(0.001).decay(0.06).sustain(0).release(0.02)
  .delay(0.3).delaytime(0.375).delayfeedback(0.4)
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .pan(rand.range(0.3, 0.7))
  .mask(gateOf('squelch')).filter(audible)
```

2–4 squelches per bar, not on the downbeat.

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
