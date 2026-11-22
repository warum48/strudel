# Switch Angel recipes — read BEFORE a new track

Someone else's experience is cheaper to borrow than to reinvent. This collects
what lives in [Switch Angel](https://github.com/switchangel)'s public
repositories (a live coder, dark trance/techno), with notes on what we already
use and what we don't yet.

**Rule:** when starting a new track, look here first. Half the knobs we write by
hand are already done with one function in her setup — and done better.

---

## Where it comes from

| repository | what's inside | how to hook it up |
|---|---|---|
| [`strudel-scripts`](https://github.com/switchangel/strudel-scripts) | `prebake.strudel` — ~35 functions with doc comments | paste into Settings → Prebake, or load into the editor |
| [`breaks`](https://github.com/switchangel/breaks) | 5 breaks, exactly 2 bars, −12 dB | `samples('github:switchangel/breaks')` |
| [`pad`](https://github.com/switchangel/pad) | 5 recorded pads | `samples('github:switchangel/pad')` |
| [`beginningtrance`](https://github.com/switchangel/beginningtrance) | samples from the video "In the Beginning There was Trance" | `samples(...)`, the pattern itself is on Patreon |

She has no written tutorials — only videos. The repository holds **code**, and
it is documented with comments right in `prebake.strudel`.

---

## 1. Slide: `glide` (the main one)

Not "slide up from below by N semitones", but calculate **which note** we are
sliding from:

```js
newVal = { ...value, panchor: 0, psustain: 0, pattack: 0,
           pdecay: glideT, penv: -12 * Math.log2(freqF / freqI) }
```

The interval comes out exact (a fourth, an octave, b2 — anything), and the
glissando survives several notes: the next one slides from the point where the
previous one still was.

```js
$: note('a1 a1 c2 a1 eb2 a1').s('sawtooth')
  .glide(0.06)                       // 0.06 s for the slide
  .glide(acidGlide.mul('0 0 1 0 0 1 0 0 0 0 1 0 0 0 0 0'))  // slide only on selected 16ths
```

**Gotcha:** write the gate **without** angle brackets. `<0 0 1 …>` is
alternation, one element per cycle, and the gate turns into a constant (that is
exactly what happened to us: the line either slid everywhere or nowhere). A bare
list `0 0 1 …` = 16 steps in a bar.

**Gotcha 2:** `getFrequencyFromValue` exists in the strudel.cc editor scope but
is not exported from `@strudel/core` 1.2.6 — in node tools you need a fallback
through `noteToMidi`.

Ours: `09-dark-acid-v2.js`, three layers (line, scream, switchable) — 2 slides
per bar instead of portamento on every note.

## 2. `bend(bends, speedUp, speedDown)` — pitch between notes

Unlike `penv` (which lives inside a note), `bend` can place events **between**
the events of the main pattern. For squeals, sirens, "risers" in a break.

## 3. 303: three functions instead of ten knobs

```js
// ready-made acid patch
register('acid', (pat) => pat.s('supersaw').detune(.5).unison(1)
  .lpf(100).lpsustain(0.2).lpd(.2).lpenv(2).lpq(12))

// filter envelope from a SINGLE number 0..1
register('acidenv', (x, pat) => pat.lpf(100).lpenv(x * 9).lps(.2).lpd(.12).lpq(2))

// accent = louder AND brighter in one call
register('accent', (a, pat) => pat.mul(velocity(1 + a/8)).mul(lpenv(1 + a/5)).lpd(.13).lpa(.01))
```

Her example — an arpeggio with an acid envelope:

```js
$: n(trancearp('<0:2:6@3 2:4:8>', 'F@5 B@3', '<1 1 1@2 1 1@2 1>*16'))
  .acidenv(trancearp('.4:.5:.7', 'F B', '<1!3 1@3 1!2>*16'))
  .scale('g:minor').s('sawtooth')
```

Ours: applied in `breakcore/02-stems-hardcore.js` — supersaw + detune 0.5,
glide register (2 slides per bar), accent via volume and filter. Rhythm — 8ths,
3–5 notes per bar: a dense 16th stream + f→gb chromaticism + glide produced
"bubbling". Wider intervals: f→ab, gb→bb.
08/09 keep the `acidCut`/`acidEnv`/`acidRes` knobs.

## 4. Low end

- **`DX(env, fm, harm)`** — 2-op FM sine: `fm`, `fmenv`, `fmh`, `fmdecay .2`.
  A cheap fat sub or kick without a sample.
- **`chordshapes`** — 60+ voicings by number. Directly about the low end:
  `[53] Dark Bass Cluster` (`-7,0,1,5`), `[55] Acid Tension` (`0,1,5,8`),
  `[49] Quartal Stack` (`0,5,7`), `[54] Industrial Spread` (`-7,-3,0,5`).
- **`octave(n)`** — `transpose((n-3)*12)`, register switching with a single digit.
- **`fill()`** — stretches each event to the next onset: a sparse pattern becomes
  a legato bass without manual `~`.
- **`vstruct(ipat)`** — structure + velocity from one pattern.

Ours: our own bass (2 detuned saws + `lpenv`), our own `octave` via
`.add(note(12))`. We have not tried `DX` or `fill`.

## 5. Filters as 0..1 knobs

```js
register('rlpf', (x, pat) => pat.lpf(pure(x).mul(12).pow(4)))
register('rhpf', (x, pat) => pat.hpf(pure(x).mul(12).pow(4)))
```

Instead of `lpf(420)` — `rlpf(0.42)`, and the slider behaves linearly by feel.
Ours are in hertz: `acidCut`, `bassCut`, `padCut`. Not worse, but coarser.

## 6. Groove and humanity

- **`strum(amt)`** — spreads a chord in time.
- **`humanize(amt)`** — shifts hits and velocity: `s('bd hh sd hh').humanize(0.03)`.
- **`oneshot(grid)`** — the sample plays once and is pinned to the grid
  (`downlifter` on the right bar).
- **`fill()`** — see above, legato.
- **`glitch(amt)`** — randomly breaks all controls; `all(x => x.glitch(rand))` at
  the end of a phrase.

## 7. Space

- **`comb(delay, feedback)`** — a comb of four delays with decay.
- **`flood(amt)`** — "drown": `room(amt*1.1)` + `dry` down.
- **`disperse(amt, size, rate, depth)`** — stereo smearing through three bands
  with modulated delays. Expensive, but it sounds like "space", not "reverb".

## 8. Mix

- **`o(orbit)` + `solo(...)` / `mute(...)`** — solo/mute by orbit.
- **`pg(x)`** — multiply by postgain.
- **`setGainCurve(x => x**2)`** — global volume curve: sliders become
  "musical" (low end quieter, top end sharper).

Ours: `orbit(2)` for bass and kick — the same trick, but without solo/mute.

## 9. Generation

- **`trancearp(notes, rst, rytm)`** — arpeggio from degrees, with rhythm presets.
- **`swap(find, rep)`**, **`grab`**, **`sb`**, **`ifit`** — permutations and conditions.
- **`stxt`** — text turns into synth parameters (letter = value).
- **`colorparty`**, **`disperse`**, **`mpan`** — visuals/panorama.

---

## What we already have

- `09-dark-acid-v2.js` — **`glide`** on three 303 layers (the main one).
- `08-dark-acid.js` — registers by band, CPU diet (worklets), `penv` by hand.
- `07-dark.js` — Phrygian, intentional tritone (`@dark` in `tension`).

## What to take next

1. **`accent`** — replace two synchronized patterns (gain + lpenv) with one call.
2. **`fill`** — legato bass without manual `~`.
3. **`DX`** — FM sub instead of a third saw.
4. **`rlpf`** — filters in 0..1 so knobs behave consistently.
