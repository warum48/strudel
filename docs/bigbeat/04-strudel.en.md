# Big Beat — Strudel implementation notes (this repo)

## 1. Hard rules first

1. **Mini-notation only through `m(...)`**: `s('bd').struct(m('x*4'))`,
   `note(m('c4 e4 gb4'))`. In real strudel.cc only double-quoted strings are
   auto-wrapped; single quotes fail (`docs/pitfalls.en.md`, Rule #1). The local
   panel calls `miniAllStrings()` and hides the bug — always check in
   strudel.cc too.
2. **Instrumental only**: no vocals, no fake sax/guitar/strings. Big beat's
   shouted-vocal slot becomes a filtered stab, noise sweep or metallic ring.
3. **No uncleared lifts**: use declared `github:` sample maps and synthesis,
   not famous funk/rock samples.
4. **Guard samples for node**: `if (typeof samples === 'function') { ... }`.
   Node checks have no `samples()` (`docs/pitfalls.en.md`).
5. Verify with `npm run verify`, `tension`, `modes`, `latch`, `gains`,
   `doubles`, `cpu`, `live` before calling the track done.

## 2. Primitive mapping

| Big Beat job | Strudel primitive | Notes |
|---|---|---|
| Break as hook | `samples('github:yaxu/clean-breaks/main')` + `s('amen').slice(8, m('0 1 2 3 4 5 6 7'))` | coarse slices keep the groove; `slice` = 90s sampler workflow |
| Heavy "1" | `s('bd').struct(m('x ~ ~ ~'))` + `note(m('a1')).s('sine')` | synth sub layered under the sampled kick; tune with the key |
| 909 contrast | `s('sd').struct(m('~ x ~ x'))`, `s('hh').struct(m('x*8'))` | programmed parts stay clean; the break carries the swing |
| Acid/303 line | `note(m('...')).s('sawtooth').lpf(cut)` with `.gain(...)` accents | one line only; automate `cut` over 8–16 bars; selective glide |
| Riff stab | short `note(...)` chord with `.lpf(...).gain(...)` | no fake guitar; filtered synth chord in the sampled-riff slot |
| Punk/noise event | `s('white')`/`s('pink')` burst through a resonant filter, or a tuned feedback delay ring | replaces shout/siren without vocals |
| Heavy compression | `duckorbit(2).duckdepth(...).duckattack(...)` on the bass + bus-level `.gain()` discipline | no `compressor()` in this repo's track vocabulary; ducking is the available dynamics tool |
| Grit | `.distort(...)`, `.clip(...)`, `.shape(...)`, `.crush(...)` | worklets cost CPU per event — put them on the kick or one break lane |
| Groove nudge | `.late(1/64)`, `.swingBy(0.06, 8)`, `.sometimesBy(...)` | subtle; the sampled break already has feel |
| Form | `const TIMELINE` with `tlCurve`/`tlOr`/`gateOf`, `const AUTOMATION` with `autoCurve` | copy the pattern from `tracks/coldwave/03-cold-rooms-v3.js` |
| Live control | `// @switches`, `// @pads`, sliders via `slider(...)` | momentary pads for stabs/rolls; keep values in the code so audio and panel agree |

## 3. Minimal sketch (syntax pattern, not a finished track)

```js
const BPM = 124
setcpm(BPM / 4)
if (typeof samples === 'function') {
  samples('github:yaxu/clean-breaks/main')
  samples('github:tidalcycles/Dirt-Samples')
}
// @switches scene=intro,groove,build,drop,outro slice=off,4,8,16
const sliceN = slider(2, 0, 4, 1)

$: s('amen').slice(8, m('0 1 2 3 4 5 6 7'))
  .gain(0.35).lpf(6000)
$: s('bd').struct(m('x*4')).gain(0.5)
$: s('sd').struct(m('~ x ~ x')).gain(0.3)
$: s('hh').struct(m('x*8')).gain(m('[.8 .3 .6 .4]*2')).hpf(6000)
$: note(m('a1 [a1 a1] c2 e2')).s('sawtooth').lpf(420)
  .gain(0.25).duckorbit(2).duckdepth(0.55).duckattack(0.01)
```

The `slice` count is a slider index in a real track (use a switch/array
lookup); here it is written flat only to show the call shape. Build the full
mixer tree, `UI` manifest, `TIMELINE` and `AUTOMATION` as in
`docs/prompt-track.en.md` and the reference tracks.

## 4. Performance notes

- Sections: `INTRO` (break only) → `GROOVE` → `BUILD` (filter/roll) → `DROP`
  → `BREAK` → `RETURN` → `OUTRO`. Put the "event" layers on momentary pads so
  a live set can punctuate the loop instead of just riding faders.
- Keep the kick, sub and break mono-compatible: all low end below ~80–100 Hz
  must survive a phone speaker. Pan only hats, noise and upper stabs.
- CPU budget: `shape`/`crush` are worklets on **every event**; a 16th-note hat
  lane with worklets is far more expensive than a 4/4 kick lane. Check
  `npm run cpu`.
- Do not rewrite an existing track to "try" big beat — new character = new
  file under `tracks/bigbeat/` (project rule), with the same audit gates.

## 5. Cross-check list

- [ ] every mini-notation string uses `m(...)`, including nested `gain(m(...))`;
- [ ] `samples()` is guarded for node checks;
- [ ] at least one compressed break lane and one 909-style programmed lane;
- [ ] one acid line, automation on cutoff, no overlapping bass fundamentals;
- [ ] one distinct event per section; one bar of silence before the drop;
- [ ] `verify`, `tension`, `modes`, `latch`, `gains`, `doubles`, `cpu`, `live`.
