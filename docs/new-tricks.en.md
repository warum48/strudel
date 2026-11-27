# Strudel tricks we have not used yet

The user's point: docs must not only describe existing tracks — they must give
**new moves**. I audited all `tracks/**/*.js` and listed Strudel features with
**zero** occurrences in our code, then checked their syntax against the
official Strudel reference. Each trick below is new to this project.

Evidence: syntax `[S]` = documented at strudel.cc; `[A]` = confirmed absent
from our tracks by the grep audit. Try in strudel.cc first: our node `verify`
uses core+mini only and may not know a new effect — if it rejects one, do not
force it into a checked track.

Rule that still applies: mini-notation only via `m('...')`; data strings in
single quotes. Effects are **single-use** — calling `lpf` twice replaces the
first, it does not stack (`docs/pitfalls.en.md`).

## 1. `early()` — pull a hit *before* the grid `[S][A]`

We use `late()` in 8 files, `early()` in **zero**. This is the missing half of
micro-timing: push a ghost hit ahead while the backbeat stays put.

```js
$: s('sd').struct(m('~ ~ x ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x'))
  .early(1/64).gain(0.16)
$: s('hh').struct(m('x*16')).sometimesBy(0.2, x => x.early(1/64))
```
Use for J Dilla / drunk-drummer feel (hip-hop, IDM, breakcore). Tiny values
only: 1/64 of a cycle ≈ 7 ms at 120 BPM with `setcpm(120/4)`.

## 2. `scramble(n)` / `shuffle(n)` — random form without random noise `[S][A]`

Both slice a pattern into `n` parts; `shuffle` plays each part **once** in a
random order, `scramble` picks with replacement (some parts repeat, some never
sound). Zero uses in our tracks.

```js
$: note(m('c4 d4 eb4 g4 bb4')).s('sawtooth')
  .shuffle(5).lpf(1200).gain(0.14)
$: s('amen').slice(8, m('0 1 2 3 4 5 6 7')).scramble(4).gain(0.3)
```
Use on texture/motif lanes only — never on the kick. Deterministic per cycle
in Strudel, so a live set stays reproducible. Good for IDM, breakcore, trip-hop.

## 3. `compressor('threshold:ratio:knee:attack:release')` `[S][A]`

A real dynamic compressor exists in the effects chain (we only emulate it with
`duckorbit`). Zero uses in our tracks.

```js
$: s(m('bd*4 sd*2')).compressor('-20:20:10:.002:.02').gain(0.5)
```
Use on a **drum bus** for big beat / techno glue; keep it single-use per lane.
Do not stack with per-hit `gain` before it (see pitfalls on effect order).
Check `npm run gains` afterwards — compressor changes the peak but not the
`gain` parameter the check reads.

## 4. `xfade(a, control, b)` — crossfade between two patterns `[S][A]`

```js
$: xfade(s(m('bd*2')), m('<0 .25 .5 .75 1>'), s(m('hh*8')))
```
`0` = full first pattern, `1` = full second. New arrangement device for
section transitions (techno, dub techno, ambient) without changing levels by
hand. In SONG mode prefer timeline gates; `xfade` is best inside a LOOP or as
a one-shot transition lane.

## 5. `compress(start, end)` and `focus(start, end)` — put a groove in a window `[S][A]`

`compress` squeezes each cycle into a timespan and leaves a gap; `focus` does
the same without the gap. Both unused. A fresh way to make **breathing** parts
(techno, minimal, dub) instead of dropping whole instruments.

```js
$: s(m('bd sd hh sd')).compress(0.25, 0.75)
$: s(m('hh*8')).focus(0.1, 0.6)
```

## 6. `velocity('...')` — separate velocity from gain `[S][A]`

`velocity` multiplies `gain`; zero uses in our tracks. This is exactly what
our ghost notes have been faking with a second low-gain lane.

```js
$: s('sd').struct(m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'))
  .velocity(m('.4 1')).gain(0.5)
```
Use for snare ghosts and hat accents in hip-hop / big beat; keeps one lane
instead of two and makes the mixer manifest smaller.

## 7. Band-pass **envelope** — `bpf` + `bpq` + `bpenv` `[S][A]`

We use `bpf` in 6 files but never `bpenv`. This makes a resonant, *vocal-like*
filter sweep from noise — a tonal drone without a tonal source.

```js
$: s('white').bpf(440).bpq(14).bpenv(4)
  .bpa(0.01).bpd(0.4).bps(0.2).gain(0.08)
```
Use for coldwave air, darkwave siren beds, dub-techno feedback, shoegaze
reverse-sweeps. Keep it quiet and mono-compatible.

## 8. Reverb shaping — `rsize`, `rfade`, `rlp`, `rdim`, `ir` `[S][A]`

We always use one shared `roomsize`; these per-lane controls are unused. One
shared size still applies — use these to *colour* a single return, not to open
five different impulse responses (that rebuilds IRs and drops audio).

```js
$: s('sd').room(0.8).rsize(4).rfade(4).rlp(5000).rdim(400)
```
`ir('...')` can load a custom impulse; that is the one true way to get a
different *space* without multiple live sizes. Check CPU with `npm run cpu`.

## 9. `fanchor(0)` — anchor the filter envelope `[S][A]`

```js
$: note(m('c2 c3 c2 eb2')).s('sawtooth')
  .lpf(200).fanchor(0).lpenv(4).gain(0.2)
```
Keeps the filter sweep tied to a fixed point instead of drifting with the
note — useful for psytrance/acid and dub stabs. Unused in our tracks.

## 10. `shrink(n)` — progressive subtraction as an event `[S][A]`

```js
$: s(m('bd sd hh sd')).shrink(m('1'))
$: s(m('bd sd hh sd')).shrink(m('-1'))
```
Positive drops steps from the start, negative from the end. A ready-made
"breakdown" move for IDM / breakcore / techno that we have been writing by
hand with TIMELINE gates.

## 11. `stretch(factor)` — phase-vocoder pitch shift `[S][A]`

Despite the name, Strudel's `stretch` **changes pitch, not duration**: it is
the first step of the effect chain (phase vocoder). Frequencies are multiplied
by `factor + 1` for positive values and `max(factor/4 + 1, 0)` for negative
ones, so `1, 3, 7` tune up by octaves and `-2, -3, -3.5` down. We have granular
layers but never this.

```js
$: s('gm_flute').stretch(m('1 2 .5')).lpf(1800).gain(0.12)
$: s('amen').stretch(m('<2 1 0 -2>')).gain(0.25)
```
Best on a **rare, long** sample event (a stab or one-shot), not a 16th lane —
it is expensive. Not a time-stretch: use `slow`/`loopAt` for duration.

## 12. Where to put each new trick

| Style | Try first |
|---|---|
| hip-hop / breakcore / IDM | `early`, `shuffle`, `scramble`, `shrink`, `velocity` |
| big beat / techno | `compressor`, `xfade`, `focus`, `compress` |
| dub techno / coldwave / darkwave | `bpenv`, `rsize`/`rfade`/`rlp`/`rdim`, `fanchor` |
| shoegaze / psytrance / trip-hop | `fanchor`, `stretch` on long events, `bpenv` |

## 13. Adoption checklist

1. Write the trick into a **new** track file (`tracks/<style>/NN-slug.js`), not
   a rewrite of an existing one.
2. Check it in strudel.cc (browser) — the panel hides some parsing errors.
3. Run `verify`, `tension`, `modes`, `latch`, `gains`, `doubles`, `cpu`, `live`.
   If `verify` cannot parse the new effect, leave it in the browser sketch and
   note it in `docs/pitfalls.en.md` rather than breaking the check.
4. When it works, move the trick from "unused" to "used" here and add a line to
   the relevant `docs/<style>/02-practice.en.md`.

## 14. Source
Official Strudel reference and effects/learn pages (syntax read, not guessed):
https://strudel.cc/reference/ ,
https://strudel.cc/learn/effects/ ,
https://strudel.cc/learn/time-modifiers/ ,
https://strudel.cc/learn/stepwise/ ,
https://strudel.cc/learn/xen/ .
Usage counts came from grepping `tracks/**/*.js` in this repo on 2026-11-24.
