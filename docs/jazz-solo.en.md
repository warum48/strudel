# Jazz solo phrasing — research notes

Working notes for the Jazz Rhodes solo in `tracks/bigbeat/04-acid-breaks-v4.js`.
Sources are listed at the bottom.

## 1. Phrases, not scales

A jazz solo is built from **motifs/cells**, not from a continuous scale run.
A cell is a short rhythmic-melodic idea; the solo repeats it, transposes it,
shortens it and answers it. Charlie Parker is the usual reference: a clear
opening motif, development in the middle, a logical ending.

Practical rule: play 3–6 notes, leave a rest, answer with a variation. A wall
of 16ths reads as an exercise, not as a solo.

## 2. The 3-up / 1-back cell

The user's example:

```
c4 d4 eb4 ~   d4 eb4 f4 ~   eb4 f4 g4 ~   f4 eb4 d4 c4
```

Each group of three climbs, then the next group starts one note back. The
overlap smooths the ascent: it is not `c d e f g a b`, it is a chain of small
motifs. The last group turns around and resolves downwards.

Use it as:

- an ascent: `c d eb | d eb f | eb f g`;
- a descent: `g f eb | f eb d | eb d c`;
- an arpeggio version: `c eb g | eb g bb | g bb c5`.

Quarter-note triplets (3 notes over 2 beats) in mini-notation: put two
three-note groups in one bar, `[c4 d4 eb4] [f4 g4 ab4]`. Each group takes half
a bar, so each group is three equal notes across two beats.

In `SOLO_D` (DROP 3) this replaces the earlier continuous scale runs: fewer
notes, more rests, clearer shape. In `SOLO_E` (DROP 2A) some runs become
quarter-note triplets instead.

## 3. Target chord tones

Do not land at random. Aim at the **3rd, 7th or 9th** of the current chord,
then resolve. Two common ways:

- **chromatic approach** — a semitone below/above the target;
- **enclosure** — one scale tone above and one chromatic tone below the target
  (or the reverse), then the target.

In this vamp:

| Bar | Chord | Safe targets | Colour |
|---|---|---|---|
| 1–2 | Cm9 | Eb (m3), Bb (b7), D (9) | D natural = C Dorian |
| 3–4 | Abmaj9 | C (3), G (7), Bb (9) | C is the guide tone |
| 5–6 | Cm9 | Eb, Bb, D | same as above |
| 7–8 | Bb13sus | D (3), Ab (b7), F (5) | no E, keep it suspended |

## 4. Phrasing and space

- Start with a motif, answer it lower or higher; do not start every phrase on 1.
- Use **rests** as part of the line. A two-beat rest after a run makes the next
  entry stronger.
- Keep a register plan: state low, climb to a peak, come down, stop.
- End phrases on a chord tone, not in the middle of a scale.
- Vary rhythm: 8ths → a burst of 16ths → a long note → silence.

## 5. Applied in v4

- `SOLO_A` — normal solo (GROOVE/BUILD are muted; first DROP and RETURN).
- `SOLO_B` — high and fast for BREAK.
- `SOLO_C` — DROP 2B: the earlier continuous scale-run version.
- `SOLO_D` — DROP 3: the moderate 3-up / 1-back line with rests.
- `SOLO_E` — DROP 2A: scale runs thinned with quarter-note triplets
  (`[c4 d4 eb4] [f4 g4 ab4]`). DROP 2B keeps the full `SOLO_C` runs.
- DROP 2B and DROP 3B add shaker/cowbell and more open hats; the solo stays
  the same, the drums push it forward.

## Sources

- Wikipedia, *Jazz improvisation* — sections "Targeting", "Cells and lines",
  "Phrasing": <https://en.wikipedia.org/wiki/Jazz_improvisation>
- Wikipedia, *Lick (music)*: <https://en.wikipedia.org/wiki/Lick_(music)>
- Wikipedia, *Call and response (music)*:
  <https://en.wikipedia.org/wiki/Call_and_response_(music)>
- Jens Larsen, *Chromatic enclosures* (cited by the Wikipedia article):
  <https://jenslarsen.nl/5-chromatic-licks-chromatic-enclosures/>
