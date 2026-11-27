# Darkwave — practice material (bass, chords, big snare, Strudel)

Companion to `docs/darkwave/README.en.md` and `docs/practice-atlas.en.md` §13.
Evidence: `[D]` documented, `[T]` transcribed tab/analysis, `[R]` my sketch.
I cannot hear audio; check `[R]` by ear. All mini-notation via `m(...)`.
No vocals and no acoustic imitation — snare/bass/lead are synthesized.

## 1. Timing

| BPM | bar | beat | 1/16 | Context |
|---:|---:|---:|---:|---|
| 113–114 | 2115 ms | 529 ms | 132 ms | "Enjoy the Silence" `[T]` |
| 124 | 1935 ms | 484 ms | 121 ms | our `tracks/darkwave/01-static-confession.js` |

Darkwave genre range 100–140 `[D]`; 124 sits in the new-wave/mid-Depeche
zone. Straight groove, no swing; only hats may be lightly humanized.

## 2. Drum grid (124 BPM)

```
step   1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
kick   X . . . X . . . X .  .  .  X  .  .  .    (or 1/3 [D])
snare  . . . . X . . . . .  .  .  X  .  .  .
clap   . . . . X . . . . .  .  .  X  .  .  .    CHORUS only [D]
hat    x . x . x . x . x .  x  .  x  .  x  .    PRE: 16ths [D]
tom    . . . . . . . . . .  .  .  .  .  x  x    fill at bar 8/16 [R]
```
```js
$: s('bd').bank('RolandTR909').struct(m('x*4')).gain(0.55)
$: s('sd').bank('LinnLM1').struct(m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'))
  .room(0.4).clip(0.9).gain(0.45)
$: s('cp').bank('RolandTR909').struct(m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'))
  .gain(0.18)
$: s('hh').struct(m('x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~')).gain(0.1)
```
The gated-feel snare = short decay + `room` + **one shared** large
`roomsize` + `clip` `[D]`. Clap only in CHORUS; absent in verse.

## 3. Bass — pedal with a ♭2 neighbour

Published "Personal Jesus" bass tab `[T]` (standard E1/A1/D2/G2): E-string
fret 2 = **F♯1**, A-string 0/2 = **A1/B1**, D-string 4 = **F♯2** — a
5th–♭7–root–5th pattern in B minor. In A minor our track uses an **A pedal
with a B♭ neighbour** `[D]`, not a walk through chord roots.

```
step  1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
Bmin  f#1 . a1 . b1 . f#2 . f#1 . a1 . b1 . f#2 .    [T notes, R rhythm]
Amin  a1  . a1 . bb1 . a1 . e2  . a1 . bb1 . a1 .
```
```js
$: note(m('a1 ~ a1 ~ bb1 ~ a1 ~ e2 ~ a1 ~ bb1 ~ a1 ~'))
  .s('pulse').pw(0.3).lpf(350).clip(0.9).decay(0.2).gain(0.35)
$: s('pulse').pw(0.28).unison(2).detune(0.08).hpf(200)
  .attack(0.9).release(2.5).lpf(900).room(0.6)
```
Octave jumps (`sometimesBy` + `note(12)`) are a signature new-wave move `[D]`.

## 4. Harmony — anti-pop, no dominant

- Our track: **Am9 → B♭maj7 → Fmaj7 → Dm7** (i–♭II–♭VI–iv) `[D]` — the ♭II
  is Neapolitan colour; 7ths/9ths hang instead of resolving.
- "Enjoy the Silence": C minor verse, **F Dorian** chorus at 113–114 BPM `[T]`.
  Borrowed modal colour, not a functional V–I.
- One chord per bar, or pad/strings `slow(2)` for two bars. Melody in a narrow
  range (♭3–♭6–5) with phrases that do not close on the tonic.
- The arpeggio must come from the chords (`.arp`), not a separate line.

## 5. Ornaments and form

- FM bell: `s('sine').fmi(2).fmh(2.01)`, sparse, dotted-eighth delay — not
  an arpeggio `[D]`.
- String machine enters only in CHORUS/OUTRO; hollow pad is `pulse` + chorus,
  **not** a Juno stack.
- Form: INTRO 8 → VERSE 16 → PRE 24–32 → CHORUS 32–48 → INTERLUDE 48–56 →
  VERSE 2 → CHORUS 2 → OUTRO 88–104. Emptiness in INTRO/INTERLUDE/OUTRO.
- One shared `fx.reverb.size`; `delaytime 0.375` dotted-quarter at 124 BPM
  ≈ 363 ms.

## 6. Sources

- Hooktheory — "Enjoy the Silence": C minor / F Dorian, 113–114 BPM:
  https://www.hooktheory.com/theorytab/view/depeche-mode/enjoy-the-silence
- BigBassTabs — "Personal Jesus" bass tab:
  https://www.bigbasstabs.com/depeche_mode_bass_tabs/personal_jesus_ver_2.html
- Existing `docs/darkwave/README.en.md` §8: Wikipedia Dark wave, Music for the
  Masses, Violator, Depeche Mode, Sound Atlas, BeatKey.
