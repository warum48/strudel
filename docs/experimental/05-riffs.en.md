# Acid riffs: how they work

The goal is not "play over a chord" but a **monophonic rhythmic motif**
that carries the bass. All 10 oscillators play the same riff; only the timbre
changes. Riffs switch with the `riff` knob 0…11.

## 1. What the TB-303 teaches

The Roland TB-303 is monophonic, saw/square, 24 dB lowpass, resonance, accent,
slide, octave. It was designed as a "bass guitar replacement" but became an
acid instrument: **a simple sequence + filter/accents/slides** creates the
character. In acid house "texture" matters more than melody: one figure,
repetition, mutation — not a theme with chords.

## 2. Riff principles

1. **One line.** Not a chord arpeggio, not jazz intervals.
2. **16 steps.** A bar is 16 sixteenths; the riff lives on that grid.
3. **Repetition + micro-variation.** One cell; bar 4/8 changes slightly.
4. **Rhythm first, pitch second.** Many repeated notes, rests, syncopation;
   small intervals, octave jumps as accents.
5. **Accent / slide / octave.** A hard hit, a glide, an octave jump.
6. **No "tю-тю-ту-ту".** If every note is a new pitch at even spacing, that
   is a melody, not a riff. You need repeats and rests.

## 3. Twelve riffs in the track

| `riff` | Name | Idea |
|---|---|---|
| 0 | `acid` | classic 303: repeats d1/f1/g1, rests, c2 |
| 1 | `roll` | trance rolling: d1 on offbeats, f1/g1/a1/c2 |
| 2 | `dnb` | sparse dnb sub: d1, rare f1/g1, c2 |
| 3 | `prod` | Prodigy aggression: dense d1/f1/g1 repeats, c2 |
| 4 | `off` | starts on a rest, offbeat hit, g1/f1/c2 |
| 5 | `oct` | octave jumps d1–d2, top scream |
| 6 | `stair` | one note → slightly higher → repeat: d1 d1 d1 → f1, then g1 |
| 7 | `two` | two notes rhythmically: d1 f1 d1 f1, then d1 a1 |
| 8 | `pedal` | d1 pedal, rare c2/f1/g1 |
| 9 | `stab` | sparse d1 hits, rare c2, short rests |
| 10 | `skip` | syncopation: d1 … d1 … c2 d1 |
| 11 | `crawl` | slower 8ths: d1 d1 f1, then a1/c2 |

### Motion examples

**Repeat → slightly higher → repeat** (`stair`):

```text
d1 d1 d1 ~ d1 d1 f1 ~ d1 d1 g1 ~ d1 f1 d1 ~
```

This is not an up-down melody: one note hammers the rhythm, then a neighbour
above with a slide, then back. The slide is the transition, not every note.

**Alternating two notes** (`two`):

```text
d1 f1 d1 f1 ~ d1 f1 d1 ~ d1 f1 ~ d1 f1 d1 ~
```

Two notes create the groove; an octave/third note is only an accent.

Each riff is 8 bars, 16 steps per bar. `ACCENT` is a shared accent pattern
(1 / .7 / .8) so the riff hits rather than sits flat.

## 4. Switching

```js
// @switches riff=acid,roll,dnb,prod,off,oct,stair,two,pedal,stab,skip,crawl ...
const riff = slider(0, 0, 11, 1)
const RIFF = riff.pick([R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12])
```

All WT/FM layers use `note(RIFF)`. Switching `riff` changes the **pattern**,
not the timbre. FM5 plays the same riff an octave up — octave doubling, not
a different riff.

## 5. Avoid

- arpeggiating the current chord;
- an up-down melody with even durations;
- too many different notes per bar;
- a slide on every note — slide is an accent, not a background;
- flat gain with no accent pattern.

## 6. Sources

- Wikipedia — Acid house: TB-303, resonance/cutoff, accent/slide/octave,
  texture over melody.
- Wikipedia — Roland TB-303: monophonic, saw/square, 24 dB LPF, accent/slide.
- Attack Magazine / Mixdown / SOS — 303 riff and acid/techno production
  material; see `04-sources.md`.
