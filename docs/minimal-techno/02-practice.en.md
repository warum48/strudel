# Minimal techno — practice material (grids, A modality, Strudel)

Companion to `docs/minimal-techno/README.en.md` and `docs/practice-atlas.en.md`
§8. Evidence: `[D]` documented source, `[R]` my playable sketch. I cannot
audition audio; verify by ear. All mini-notation via `m(...)`.

## 1. Timing

128 BPM → bar 1875 ms, beat 469 ms, 1/16 117 ms, dotted 1/8 352 ms.
Hawtin: 128 is "ideal" `[D]`; genre range 125–130 `[D]`.

## 2. Grid — development is micro-shifts, not new patterns

```
step   1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
kick   X . . . X . . . X .  .  .  X  .  .  .
hat    . . x . . . x . . .  x  .  .  .  x  .    offbeats/8ths [D]
rim    . . . . . x . . . .  .  .  .  x  .  .    rare dots [R]
bleep  . . . . . . . . . .  .  .  x  .  .  .    once every 2–4 bars [D]
```
```js
$: s('bd').struct(m('x*4')).gain(0.55)
$: s('hh').struct(m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~')).gain(0.08)
$: s('rim').struct(m('~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~')).gain(0.07)
$: note(m('a5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ eb6 ~ ~ ~'))
  .s('sine').lpf(4000).delay(0.3).delaytime(0.1875).gain(0.07)
```
Modes `straight / broken / shuffle / strip` change micro-shifts
(`.late(1/64)`, `.swingBy`), **not** the instrument lineup `[D]`.

## 3. Low end and modality

- Sub: A1, long decay, ≤80 Hz.
- Mid-pulse: A2 / E2, `cut` ~300, no melody, no octave "pew".
- Drone: sine `[a2,e3]` with detune; rare `[a2,bb3]` (♭2 as colour), **not**
  our usual saw/Juno pad `[D]`. The drone enters after metal/noise/vinyl —
  not on bar 1.

```js
$: note(m('a1*8')).s('sine').lpf(70).gain(0.3)
$: note(m('a2 ~ ~ ~ ~ ~ ~ ~ e2 ~ ~ ~ ~ ~ ~ ~'))
  .s('triangle').lpf(300).gain(0.12)
$: note(m('<[a2,e3]>')).slow(4).s('sine').unison(2).detune(0.06)
  .lpf(600).gain(0.14)
```

## 4. Form (128 bars, from our track)

```
INTRO 0–8       metal, noise, vinyl; no pad, no pulse
FLOOR 8–16      kick + click attack, texture
PULSE 16–48     kick, hats, sub, drone
BREAK 48–56     kick leaves; drone/noise/bleep
DRIVE 56–88     full groove, rim/clap, cutoffs open
SHIFT 88–104    broken/shuffle, stabs, micro-shifts
OUTRO 104–128   layers leave, tail without drums
```
One change per 8–16 bars; slow cutoffs. Never fill 16ths, never develop every
4 bars. Do not add dub stabs unless asked.

## 5. Sources
Wikipedia Minimal techno, The Sound Atlas, `docs/rules.en.md` — full links in
`docs/minimal-techno/README.en.md` §7.
