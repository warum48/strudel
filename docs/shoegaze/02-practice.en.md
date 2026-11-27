# Shoegaze — practice material (synth-only wall, chords, Strudel)

Companion to `docs/shoegaze/README.en.md` and `docs/practice-atlas.en.md` §14.
**Project law:** no acoustic guitar imitation and no lead vocals. The "wall"
is detuned synth layers through filter/chorus/delay/reverb; the "hidden vocal"
is a low filtered texture. Evidence: `[D]` documented, `[T]` tab/chord source,
`[R]` my sketch. All mini-notation via `m(...)`.

## 1. Timing

| BPM | bar | beat | dotted 1/8 | Reference |
|---:|---:|---:|---:|---|
| 100.5 | 2390 ms | 597 ms | 448 ms | Slowdive "Alison" `[T]` |
| 115 | 2087 ms | 522 ms | 391 ms | "When the Sun Hits" cover `[T]` |
| 95–105 | — | — | ~450 ms at 100 | classic sweet spot `[D]` |

`delaytime 0.1875` = dotted eighth; feedback 30–50%, mix 25–35% `[D]`.

## 2. Chord loops — simple, open, one key

- "When the Sun Hits": **D – F♯m – G – A** (I–iii–IV–V), D major, 115 BPM `[T]`.
- "Only Shallow": **E – F♯ – A – B** cycle `[T]`; lead phrases F♯4→G♯4 and
  C♯5→D♯5 (bends as two successive notes in Strudel).
- "Alison": **A – E – A♭m – B – D♭m** at ~100.5 BPM, A major `[T]` (borrowed
  ♭VI colour — one key, not a modulation).
- I–iii–IV–I, I–IV, Isus2–IVsus2–V, i–♭VII–♭VI–♭VII `[D]`.

```js
const WALL = note(m('<[d3,a3,d4,f#4] [f#3,c#4,f#4,a4] [g3,d4,g4,b4] [a3,e4,a4,c#5]>'))
$: WALL.s('sawtooth').unison(4).detune(0.12)
  .lpf(1800).chorus(0.5).delay(0.3).delaytime(0.1875).delayfeedback(0.4)
  .room(0.7).gain(0.12)
```
One chord per bar; 3–4 layers in **one key**. Complex jazz voicings turn to
mud under effects `[D]`.

## 3. Drum grid (behind the wall)

```
step   1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
kick   X . . . . . . . X .  .  .  .  .  .  .    (1/3 [D])
snare  . . . . X . . . . .  .  .  X  .  .  .
hat    x . x . x . x . x .  x  .  x  .  x  .    even 8ths
ride   . . . . . . . . . .  .  .  x  x  x  x    CHORUS only [R]
```
```js
$: s('bd').struct(m('x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~')).gain(0.35)
$: s('sd').struct(m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~')).room(0.5).gain(0.28)
$: s('hh').struct(m('x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~')).hpf(5000).gain(0.08)
```
Drums sit −6…−10 dB relative to the wall `[D]`; large room/plate, low top end.

## 4. Lead texture and "glide"

- No tremolo arm in Strudel: emulate with `unison`/`detune`, slow `lpf` sweeps
  and rare `sometimesBy(x => x.speed(1.005))` micro-shifts `[R]`.
- Lead phrases from "Only Shallow" `[T]`: F♯4–G♯4 and C♯5–D♯5; play them as
  short, filtered, drowned notes, never up front.
- Reverse-reverb feel: `sometimesBy(0.15, x => x.rev())` on a long chord,
  or a reversed sample before the downbeat.
- Low end: roots/octaves, HPF 30 Hz, boost 80–120 Hz, light distortion; it
  must not fight the kick.

## 5. Arrangement = density, not chord changes

```
INTRO    8–16 bar  one wall layer + reverb
VERSE   16–24 bar  drums + 2 layers, texture low
CHORUS   8–16 bar  3–4 layers, ride, maximum delay/room
VERSE 2 16–24 bar  remove a layer
PEAK    16–24 bar  maximum density, tremolo-like picking
BRIDGE   8–16 bar  one layer or feedback drone
OUTRO   16–32 bar  tails, fade
```
New element only on those boundaries; levels stay constant — gate layers with
TIMELINE. One shared reverb size; HPF ~80 Hz on the wall, gentle cut ~400 Hz.

## 6. Sources

- tohereknowswhen — "Only Shallow" tab (E–F♯–A–B cycle, lead phrases):
  http://tohereknowswhen.org/tabs/only-shallow.html
- GuitarTuna — "Only Shallow" tab/chords (E major, F♯, A, B):
  https://guitartuna.com/tabs/only-shallow-my-bloody-valentine-tab-6217b3327d0e3fa4285c302f
- Chordify — "When the Sun Hits" (D major, 115 BPM, D/F♯m/G/A):
  https://chordify.net/chords/when-the-sun-hits-slowdive-piano-cover-souvlakisynthstatic
- ChordU — "Alison" (~100.5 BPM, A major, A/E/A♭m/B/D♭m):
  https://chordu.com/tabs/alison-chords-by-slowdive-id_0x1b2dc
- Sound On Sound — Classic Tracks: "Only Shallow"; BeatKey Shoegaze;
  Wikipedia Shoegaze — links in `docs/shoegaze/README.en.md` §9.
