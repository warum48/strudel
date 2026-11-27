# Techno — practice material (grids, low end, Strudel)

Companion to `docs/techno/README.en.md` and `docs/practice-atlas.en.md` §6.
Evidence tags: `[D]` documented in a source, `[R]` my playable reconstruction.
I cannot audition audio; `[R]` is a sketch, not a transcription. All mini-
notation goes through `m(...)`.

## 1. Timing

| BPM | bar | beat | 1/16 | Source |
|---:|---:|---:|---:|---|
| 128 | 1875 ms | 469 ms | 117 ms | classic Berlin range `[D]` |
| 132 | 1818 ms | 455 ms | 114 ms | our `tracks/techno/23-black-room.js` |

Kick **shorter than a beat**: with a 500 ms tail at 128 BPM the subs cancel
`[D]`. Short kick, long rumble — two different layers.

## 2. The core grid (132 BPM)

```
step   1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
kick   X . . . X . . . X .  .  .  X  .  .  .
clap   . . . . X . . . . .  .  .  .  .  .  .    (second kick only [D])
rim    . . x . . . x . . .  x  .  .  .  x  .    [R] dots, not a break
hat    x x x x x x x x x x  x  x  x  x  x  x    accents [D], 50–55% swing
tom    . . . . . . . . . .  .  .  x  .  .  .    "second kick" [D]
```
```js
$: s('bd').struct(m('x*4')).gain(0.6)
$: s('cp').struct(m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'))
$: s('hh').struct(m('x*16')).gain(m('[.9 .3 .6 .35]*4')).swingBy(0.04, 8)
$: s('lt').struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~')).gain(0.18)
```
Note: the clap on the **second** kick (not 2-and-4) is the documented
"open groove" trick; a low tom acts as a second kick, not a fill.

## 3. Bass pulse and rumble

Our track's low-end notes: **A1, Bb2, Eb2** — 1–3 notes per loop, no melody.
```js
$: note(m('a1 ~ ~ ~ ~ ~ ~ ~ bb2 ~ ~ ~ ~ ~ ~ ~'))
  .s('sawtooth').lpf(200).clip(0.9).gain(0.3).duckorbit(2).duckdepth(0.5)
$: note(m('e1*8')).s('sine').lpf(70).gain(0.25).duckorbit(2).duckdepth(0.6)
```
Rumble chain from the docs `[D]`: kick → **100% wet reverb, 2–4 s decay** →
saturation → LP 150–250 Hz → HP ~30 Hz → sidechain 4:1, release until the
next kick. Automate size/drive/cutoff over 16–32 bars; soloing it sounds weak,
in the mix it glues.

## 4. Events, not melodies

- Stabs/sequences of **1–3 notes** that "never sound the same twice" through
  filter, delay and drive changes `[D]`.
- No chord pad, no FM bell with a pop melody, no "pew-pew" pitch envelopes.
- Pure subtraction for tension: remove hats/clap/bass, keep kick + rumble.

## 5. Bar map (our 192-bar track, compressed)

```
INTRO 0–16     kick + rumble + texture
BUILD 16–48    hats, rim, first bass pulse
LIFT 48–64     subtract hats, filter opens
DRIVE 64–128   full groove, tom as second kick
PEAK 128–176   maximum density, 16–32 bar master filter sweep
OUTRO 176–192  layers leave, kick remains
```
New element on 8/16/32-bar boundaries, never every 4 bars. Levels stay
constant; turn layers on/off via `gateOf`.

## 6. Checks
`npm run verify`, `tension`, `gains`, `cpu`, `live` — plus the 16/32-bar
automation in song mode; LOOP must not drift.

## 7. Sources
Already indexed in `docs/techno/README.en.md` §11: Attack Dark Berlin Techno,
Distrikt Audio Berlin Techno Sound Design, Maxim Schunk kick/rumble, IQSounds
rumble processing.
