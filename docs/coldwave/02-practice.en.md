# Coldwave — practice material (mechanical grid, Dm/Am, Strudel)

Companion to `docs/coldwave/README.en.md` and `docs/practice-atlas.en.md` §13.
Evidence: `[D]` from the genre sources, `[R]` my playable sketch. I cannot hear
audio; `[R]` is a starting point. All mini-notation via `m(...)`.

## 1. Timing

| BPM | bar | beat | 1/16 | dotted 1/8 | dotted 1/4 |
|---:|---:|---:|---:|---:|---:|
| 108 | 2222 ms | 556 ms | 139 ms | 417 ms (`delaytime 0.1875`) | 833 ms (`0.375`) |

Do not confuse the two delay values — the doc's `0.375` is a **dotted
quarter**, `0.1875` is a dotted eighth `[D]`.

## 2. The mechanical grid (108 BPM)

```
step   1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
kick   X . . . . . . . X .  .  .  .  .  .  .
snare  . . . . X . . . . .  .  .  X  .  .  .
hat    x . x . x . x . x .  x  .  x  .  x  .
rim    . . . . . . . . . .  .  .  x  .  .  .    optional, not a shuffle
tom    . . . . . . . . . .  .  .  .  .  x  x    fill only at bar 8/16 [R]
```
```js
$: s('bd').bank('RolandTR606').struct(m('x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~'))
$: s('sd').bank('LinnLM1').struct(m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'))
$: s('hh').bank('RolandTR606').struct(m('x ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~'))
  .gain(0.12)
$: s('rim').bank('RolandTR808').struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'))
  .delay(0.3).delaytime(0.1875).delayfeedback(0.35)
```
Kick on 1 and 3, rim/snare on 2 and 4, even 8th hats `[D]`. **No** funk
syncopation, no reggae skank; keep it rigid.

## 3. Bass and harmony

One or two notes per bar, root/octave, low LP, short decay, `clip`.
```js
$: note(m('d2 ~ ~ ~ d2 ~ ~ ~ a2 ~ ~ ~ d2 ~ ~ ~'))
  .s('sawtooth').lpf(380).clip(0.9).decay(0.25).gain(0.32)
$: note(m('<[d3,f3,a3] [bb2,d3,f3] [g2,bb2,d3]>')).slow(2)
  .s('sawtooth').unison(3).detune(0.07)
  .lpf(900).attack(1.0).release(2.5).room(0.6).gain(0.14)
```
One chord every 2–4 bars; D minor / Dorian, ♭VI (B♭) and ♭VII (G) as colour,
no dominant cadence `[D]`. Pad is cut on top so it does not fight the bass.

## 4. Space and form

- One shared `roomsize` (different sizes rebuild the impulse response and
  break Strudel); reverb 2–4 s with a moderate send `[D]`.
- Thin mono lead/arp: square/saw, LP 1500–3000, dotted-eighth delay.
- Form: INTRO 8 (pad+bass) → VERSE 16 → CHORUS 12 → BREAK 8 → VERSE 16 →
  OUTRO 4. Removing a layer is a stronger move than adding one.
- 3–6 layers total; emptiness *is* the genre.

## 5. Sources
The Sound Atlas Coldwave, BeatKey darkwave, Wikipedia Cold wave — full links
in `docs/coldwave/README.en.md` §9. Drum banks are `tidal-drum-machines`,
loaded in stock strudel.cc.
