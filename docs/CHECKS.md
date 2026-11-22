# Checks

All checkers run the real Strudel engine in Node (except `live`, which uses a
headless browser). They do not judge how the track sounds; they catch broken
patterns, bad levels, worklet budgets and real-Strudel regressions.

```bash
npm install                       # once

npm run verify                    # all tracks
npm run verify   -- tracks/techno/18-khmer-dub-v2.js
npm run doubles  -- tracks/techno/18-khmer-dub-v2.js
npm run tension  -- tracks/techno/18-khmer-dub-v2.js
npm run gains                     # all tracks
npm run modes    -- tracks/techno/06-deep-dub-v2.js
npm run cpu      -- tracks/techno/18-khmer-dub-v2.js
npm run latch    -- tracks/techno/07-dark.js
npm run levels   -- tracks/techno/18-khmer-dub-v2.js 52
npm run live     -- tracks/techno/18-khmer-dub-v2.js
```

## `verify`

Prints what actually lands on the 1/16 grid: step, sample name or notes.
Catches mini-notation typos, missing functions/controls, empty tracks, and
some static mistakes:

- mini-notation strings in variables without `m()`;
- `slider()` with a non-numeric first argument;
- sliders declared but never read.

It also reports `⚠ one sample in the same position from different layers` —
a duplicate-hit map. Warnings about a layer being silent in bar 1 but entering
later are normal for arranged tracks.

**Blind spot:** `verify` calls `miniAllStrings()`, so single-quoted mini
strings still pass here. Always run `npm run live` and check stock strudel.cc
for the `m()` quote rule.

## `live`

Opens real `https://strudel.cc` in headless Chromium, pastes the file, presses
eval and prints:

- whether the pattern plays;
- how many sliders exist in the config and how many are rendered;
- whether a slider drag desyncs after scrolling.

Needs a local Chromium or `CHROME=/path/to/chrome npm run live`.

`← РАССИНХРОН` is the known strudel.cc widget bug, not a track bug. See
`slider-bug.en.md`.

## `tension`

Reads the phrase constants and checks intervals:

- a note against the bar **root** — tritone (6 semitones) in any octave;
- a note against that bar's **pad notes** — tritone and minor second
  (1 semitone) in the same octave only. A second across an octave is color, not
  mud.

Marker requirements:

- `// @roots c ab f bb eb g f ab` — one root per bar of the cycle;
- `PAD_A` / `PAD_B`, or a single `PAD`. With one pad, modes A and B are the
  same.
- Phrase suffix decides the comparison: `MEL_A` / `STAB_A` against `PAD_A`,
  `MEL_B` / `STAB_B` against `PAD_B`, everything else against both.

The script runs enough bars for every phrase to drift through the full
harmony. A minor ninth is not flagged: in Cm9 both b3 and 9 live there.

**The 9th is style, not dirt.** If a 9th clashes with the pad, fix the pad
voicing or the note position, do not delete the 9th.

### Intentional dissonance — `// @dark`

`// @dark` allows tritones only in **anchored** phrases whose length is a
multiple of the root count. If the phrase always lands on a known bar, the
tritone is an author decision. A drifting phrase (7, 5, 12 bars against 8)
brings the tritone in a new place every cycle — that is still an error.

Minor seconds are always an error.

## `gains`

Sets every volume slider to zero and reports anything that still makes sound.
Usual causes: `gain()` / `stut()` / `echo()` after the volume gain, or a hard
coded gain that does not use the mixer slider.

`gains` is strict. At the time of writing the known pre-existing failures are
`19-hypnotic-trance.js`, `20-deep-dark-trance.js` and `21-dark-trance.js`
(gain after `stut`/`echo`). Check the output; a known failure is not a reason to
skip the tool for a new track.

## `doubles`

Lists two layers hitting the same sample at the same position — the “double
hit” you hear as one louder, phasey event.

## `modes`

Runs the `mode` switch through all values and prints the number of events per
mode. Useful to confirm that a drum mode actually changes the pattern, and to
spot a mode that is silently empty.

## `cpu`

Counts AudioWorklets per bar and per second (`shape`, `crush`, `coarse`,
`distort`, `ftype('ladder')`). Budget: **up to ~150 worklets/s** is comfortable;
300+ starts to break on weak machines.

Blind spot: `cpu` only looks at the first 8 bars by default. Layers that enter
later must be checked in LOOP or with their gate raised.

High worklet count is not the only load. Many voices, long releases and a large
reverb also cost; `levels` and the actual browser are the second opinion.

## `latch`

Shows on which bar a harmony switch changes. Useful for “8-bar latch” behavior.

## `levels`

Prints per-layer energy at a given bar, plus event counts. Warnings:

- lead more than 2× quieter than the pad;
- events with zero gain.

Use it at a heavy section, not at bar 1 of an intro.

## What to run before shipping

1. `npm run verify` — no exit 1.
2. `npm run gains` — no new offenders.
3. `npm run tension` — no unintentional tension.
4. `npm run cpu` — worst mode under ~150/s.
5. `npm run levels` — at the densest bar.
6. `npm run live` — eval ok, pattern plays, no quote/sample errors.
7. Check the track in stock strudel.cc once, by hand.
