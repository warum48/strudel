# 08 · Strudel: mapping to this repository (EN)

How to translate forum techniques into code that already works here. Verified against
`tracks/**/*.js`: the repo uses `stack`, `slice`, `chop`, `ply`, `degradeBy`,
`sometimesBy`, `speed`, `crush`, `shape`, `lpf/hpf/lpq/ftype`, `room/roomsize`,
`delay/delaytime/delayfeedback`, `gain`, `pan`, `struct`, `euclid`.

---

## 1. Mapping table

| Breakcore technique | Strudel | Status in repo |
|---|---|---|
| Chop into N slices | `s("amencutup").slice(16, "<0 2 3 5 ...>")` | ✅ used |
| Granular chop in order | `.chop(8)` | ✅ used |
| Retrigger / roll | `.ply(2)` / `.ply("<1 2 4>")` | ✅ used |
| Note-off / tail cut | `~` rest in the pattern + short amp-env | ✅ via patterns |
| Probabilistic variation | `.degradeBy(0.2)` | ✅ used |
| "2 of 4" | `.sometimesBy(0.5, x => x.ply(2))` | ✅ used |
| Reverse | `.sometimesBy(0.18, x => x.speed(-1))` | ✅ (`dnb/02`) |
| Slice re-pitch | `.speed("<1 1.12 0.89>")` | ✅ used |
| Bit-crush | `.crush(4)` | ✅ used |
| Distortion/shaping | `.shape(0.4)` | ✅ used |
| Low-cut the break | `.hpf(150)` | ✅ used |
| Deaf kick | `.lpf(80)` | ✅ (repo rule) |
| Comb/resonance | `.lpq(2)` + `ftype("24db")` | ✅ used |
| Delay glitch | `.delay(0.2).delaytime("<0.125 0.0625>").delayfeedback(0.4)` | ✅ used |
| Reverb space | `.room(0.1).roomsize(4)` | ✅ used |
| Polyrhythm | `struct("x ~ ~ x ~ ~")` / `euclid(3,8)` | ✅ used |
| Layer stack | `stack(...)` | ✅ used |
| Break tempo sync | `.fit()` (re-pitch, +4.4 st for Amen) | ⚠️ rejected in `breakcore/01` |
| Break without pitch shift | `.slice(16, pat)` — short fragments | ✅ `breakcore/01` |
| Offset trigger (`09xx`) | `.begin("<0 0.25 0.5>")` | ⚠️ verify with `npm run verify` |
| Choke groups (note-off) | `.cut(1)` | ⚠️ verify with `npm run verify` |

If a function does not pass `npm run verify` — do not use it, replace it with a
pattern.

---

## 2. Track skeleton for this repo

File style: `tracks/<genre>/NN-name.js`, a Russian header comment with sources,
constants at the top, a `mode` switch, `stack(...)` at the end.

```js
// ══════════════════════════════════════════════════════════════════
//  BREAKCORE 01  ·  Strudel  ·  174 BPM  ·  rinse / note-off
//
//  ── EXTERNAL READING ───────────────────────────────────────────
//  • rinse technique: note-off before every sample, one column,
//    one DSP chain for the whole break [renoise #29927 #1].
//  • cut on 1/4–1/8, not 16ths; 3–5 markers are enough
//    [elektronauts #226901, #175570].
//  • never warp chops: "Warp is the groove killer" [#175570].
//  • thin out: ≤3 elements, one 16th figure at a time [#173927].
//
//  ── SAMPLES ────────────────────────────────────────────────────
//    amencutup — 32 pre-chopped Amen pieces (Dirt-Samples)
//    amen      — the full break (clean-breaks)
//    hardcore  — kick/snare for accents
// ══════════════════════════════════════════════════════════════════

samples('github:tidalcycles/Dirt-Samples')
samples('github:yaxu/clean-breaks/main')

const mode = 0   // 0 rinse · 1 stems · 2 solo

// 1) main break: coarse slicing, gaps instead of tails
const breakRinse = s("amencutup")
  .slice(8, "<0 0 2 3 0 4 5 6> <1 1 3 4 1 5 6 7>")
  .hpf(150).lpf(9000)
  .crush(3).shape(0.3)
  .gain(0.8).room(0.08).roomsize(3)

// 2) kick: deaf by repo rule
const kick = s("hardcore:4")
  .struct("x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~")
  .lpf(80).shape(0.4).gain(0.9)

// 3) snare: 3 variants + ghost
const snare = s("<hardcore:10 hardcore:11 hardcore:10>")
  .struct("~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~")
  .gain("<0.9 0.7 0.8 0.4>")   // the last one is a ghost
  .hpf(200).room(0.12).roomsize(2)

// 4) sub: mono, under the kick
const sub = note("a1").s("sine")
  .struct("x ~ ~ ~ ~ ~ x ~")
  .lpf(80).gain(0.5)

stack(kick, snare, breakRinse, sub)
```

This is a skeleton, not a finished track: next come 4-bar mutations, a snare rush,
and a "solo" passage without the kick.

---

### 🛑 chop does not change speed: two options, and why the second was chosen

`chop(n)` only sets `begin/end`; playback rate stays native. Amen (~136 BPM)
inside a 174 track drifts, and at coarse chop counts (4 pieces) that is most
audible.

1. **`fit()`** fits the whole sample into one bar by re-pitching: 174/136 =
   +4.4 semitones. Tempo fixed, break sounds higher — rejected in
   `breakcore/01`.
2. **Short fragments only.** `slice(16, pat)` gives 1/16-of-sample pieces
   (~86 ms at 174). The native tempo is not readable inside such a piece and
   the pitch is natural. "Coarseness" becomes density/order of 16ths, not
   piece length.

```js
// chosen: no re-pitch
s("amen").slice(16, "<[0 ~ 2 ~ 4 ~ 6 ~ 8 ~ 10 ~ 12 ~ 14 ~] [0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15]>").clip(0.62)
```

## 3. Recipes in code

### R1 · Rinse
```js
s("amen").slice(8, "<0 1 2 3 4 5 6 7>")
  .hpf(150).lpf(10000).crush(3).shape(0.35)
  .gain(0.8)
// gaps instead of tails: `~` in the slice pattern
```
Matches `[29927#1]`: one column, identical DSP, cut tails.

### R2 · Snare rush (rolls)
```js
s("<hardcore:10 hardcore:10 hardcore:11>")
  .struct("~ ~ ~ ~ x x x x ~ ~ ~ ~ x x x x")
  .ply("<1 2 3 4>")
  .speed("<1 1.06 0.94>")
  .gain("<0.9 0.7 0.8 0.5>")
```
Roll + re-pitch + velocity are three separate controls `[18985#65, #66]`.

### R3 · Generative variation (dosed)
```js
s("amencutup").slice(8, "<0 1 2 3 4 5 6 7>")
  .degradeBy(0.15)
  .sometimesBy(0.5, x => x.ply(2))
  .sometimesBy(0.18, x => x.speed(-1))
```
This is "2 of 4" and chance fills, not a randomizer `[173927]`.

### R4 · Polyrhythm without pain
```js
stack(
  s("hardcore:4").struct("x ~ ~ x ~ ~").lpf(80),        // 3
  s("hardcore:10").struct("~ ~ ~ x ~ ~ ~ ~ x").hpf(200) // 5
)
```
Kick every 3, snare every 5 → resolves after 15 beats `[173927]`.

### R5 · Odd meter
```js
s("amencutup").slice(8, "<0 1 2 3 4 5 6 7>")
  .struct("x ~ ~ x ~ ~ x ~ ~ x ~ ~ x ~ ~ x ~ ~ x ~")   // 20 steps = 5/4
```
20 lines @ LPB 4 = 5/4 — the same arithmetic as in a tracker `[2328#7]`.

### R6 · Delay glitch instead of a plugin
```js
s("amencutup").slice(4, "0 1 2 3")
  .delay(0.25)
  .delaytime("<0.125 0.0625 0.25>")
  .delayfeedback(0.45)
  .room(0.1)
```
A short delay with high feedback and changing time — the "chorus glitch" with no
plugins `[18985#37]`.

---

## 4. Repo constraints (`docs/rules.md`)

Mandatory — these outrank forum advice:

- Bass `lpf(80)` by default, never higher.
- Kick as deaf as possible, no "click".
- No funny melodic lines; 303 only for atonal riffs and arpeggios with few notes,
  never for comping chords.
- Avoid clichéd 4-bar `1–2–4–5`; prefer suspended notes and counterpoint.
- Do not imitate saxophone/reggae unless asked.
- The music must sound "ultra-stylish", not "funny" and not stuck in a clichéd center.

For breakcore this means: **drums lead, harmony is backdrop**. If you want a "pretty"
melody, keep it minimal and leave room for the drums.

---

## 5. Checks before committing

```bash
npm run verify     # the engine actually plays the pattern
npm run modes      # mode branches switch correctly
npm run tension    # no static passages / dead spots
npm run gains      # no clipping by gain
npm run doubles    # no duplicated layers
npm run cpu        # the pattern is not too heavy
```

Plus the checklist in `README.en.md` §7 and the diagnostics in `07-pitfalls.en.md`.

---

## 6. Where things live in the repo

- Break-technique reference: `tracks/dnb/02-dark-techstep-v2.js`
  (slice/chop/crush/shape).
- Atmosphere and structure reference: `tracks/dnb/01-atmospheric-jungle.js`.
- Hard kick and gabber layer reference: `tracks/techno/13-gabber-v3.js`.
- New genre folder: `tracks/breakcore/01-<name>.js` (create on the first track).
