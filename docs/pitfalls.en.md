# Strudel pitfalls (our experience)

> **IMPORTANT. Rule #1 — any mini-notation only through `m(...)`.**
> In real strudel.cc the transpiler wraps **only double** quotes in `m()`.
> Single quotes stay a plain string:
> `n('3 4 5')` → `"3 4 5" is not a number, falling back to 0`;
> `s('bd*4')` → no kick; `struct('x*4')` → no grid; `note('c4 e4')` → silence.
> Our panel calls `miniAllStrings()` before eval and **masks** this bug,
> so a track can work in the panel and fall apart in strudel.cc.
> Rule: notes, `n`, `struct`, `s` with `*`/`<>`/`~`/`[]` — always `m('...')`.
> Plain data strings (UI manifest, sample names) — in single quotes.
> `verify` catches only strings in variables, not literals inside a chain.

A short list of the gotchas we have already stepped on. Read it before
writing a track. Every item is a real breakage, not theory.

## Mini-notation and sources

- **Mini-notation strings — only through `m(...)`**: `note(m('d3 f3 a3'))`,
  `s(m('bd ~ sd ~'))`. In stock strudel.cc `note('d3 f3')` can go into the
  engine as a literal string — the melody is silent while the drums still sound.
- `m()` is `mini.m`; in the REPL it is global, in node checks it comes from
  `@strudel/mini`. Do not redefine it.
- **Double quotes = mini-notation.** The Strudel transpiler turns any string
  literal starting with `"` into `m("...")` (except `samples(...)` arguments).
  So an object with double quotes in the code breaks transpilation
  (`SyntaxError: Unexpected string`). Data strings — only in single quotes
  (or a tagged template). The UI manifest is a plain JS object with single
  quotes and unquoted keys: `{ switches: { gtr: ['riff','sparse'] } }`.
- `chord()` + `voicing()` live in the tonal package and exist in the browser,
  but are **not in `verify`** (only core+mini there). If you need a green
  `verify` — write explicit notes (`m('<[d3,f3,a3] ...>')`), not chord symbols.

## Event length and rhythm

- `s('white').struct('<x ~ ~ ~ ~ ~ ~ ~>')` does **not** give “one hit every
  8 bars”: `struct` slices on the cycle grid and retriggers every cycle —
  you get a hat. For one long event — `s('white').slow(8)`
  (one hap 8 cycles long) and put attack/sustain/release on it.
- `seg(n)` is **sampling the signal n times per cycle**; on a pattern with
  notes it multiplies the event count by n. `seg(8)` on a 3-note chord =
  24 events per bar, and if each one carries `dist` — that is 24 worklet nodes.
- `slow(n)` stretches an event, `fast(n)` speeds up a pattern. For “rare but
  long” — `slow`, for “more often” — `fast`/`struct`.

## CPU: oscillators and worklets

- `supersaw` is **7 oscillators per voice**. `s('saw,supersaw')` × 3 notes
  × `seg(8)` — already hundreds of oscillators per bar, the sound starts to
  break. Check with a number, not by ear.
- `shape`, `crush`, `coarse`, `distort` and `ftype('ladder')` are an
  **AudioWorklet per event**, the engine does not reuse them. On dense parts
  (16ths, `seg`) these are guaranteed dropouts. If you really need distortion —
  put it on rare long events, not on every step.
- `npm run cpu -- tracks/<...>.js` counts worklets from the actual output.
  Budget: **up to ~150/s** is comfortable; 300+ breaks the sound on weak
  machines.
- `cpu` has a blind spot: it looks at the first 8 bars, so layers that enter
  later (VERSE 3 etc.) must be checked separately — temporarily raise their
  gate in the first section.
- A “heavy instrument” ≠ a loud one. Count events and oscillators first
  (`verify` prints “hits per bar”), then turn the volume.

## Sliders and the panel

- **No negative literals in `slider(...)`**: the widget reads the raw
  literal, and `-2` is a unary minus → the value becomes `NaN`, the panel shows
  `NaN`, and the lane goes silent. Keep `0…N`, apply the sign in code
  (`oct.mul(-12)`).
- **One timbre — one slider.** Do not bind another instrument to someone
  else's `vol`: it cannot be found in the mixer, and it lives “in the shadow”.
- A slider outside the `instruments` tree with `min 0` and `step 1` is treated
  by the panel as a switch. Sliders inside the tree are normal knobs.
- The panel must not know track names, and metadata must not live in
  comments (they get erased). Declare roles and variants **in code** —
  `const UI = { ... }` — a plain JS object (strings in single quotes):
  `transport: { name, labels }`, `holdBar: '...'`, `switches: { name: [...] }`.
  The panel parses the literal itself (without eval). Comment markers are no
  longer the primary source; for old tracks without a manifest there is a fallback
  to the names `song`/`holdBar` and legacy `@switches` (only for labels and the
  ≥2 variants rule).
- **A disabled layer must not play.** `gain(0)` still builds an
  oscillator/sample per event. Mute at the pattern level:
  `.mask(tlOr(key).fmap(v => v > 0.001))` (we have `gateOf(key)`), otherwise in
  INTRO/OUTRO the engine counts all disabled drums and strings for nothing.
  `node tools/levels.mjs <file> <bar>` now complains about events with zero
  volume.
- **One source per noise.** Do not keep two identical `s('white')` for a
  riser and “air”: brown/crackle/white are different timbres, but check that
  white noise is not duplicated.
- **Levels are constant across sections.** Do not do “quieter in the verse,
  louder in the chorus”: energy is density, filter, decay. Percussion is the
  exception. Balance check: `node tools/levels.mjs <file> <bar>`; the lead must
  not be 2× quieter than the pad.
- **A switch is drawn only if there is something to choose from.** The number
  of variants is the length of the array in `UI.switches` (or labels in legacy
  `@switches`): ≥2 — a button group, one — not a switch. A single rhythm/variant
  is not exposed.
- Not every rhythm has to live in `grooves`: those are only the slots that
  `mode` switches. A single rhythm stays in the lane as is; one-off patterns
  (rim, toms with `sometimesBy`) are not exposed either. Need a switch — that is
  a separate switch (`autoSwitch`) and a key in the sections, not someone else's
  group.
- The panel mirrors the structure `instruments = { group: { instrument: { name, ...slider } } }`.
  Group = first level, instrument = second.
- `slider()` also works in stock strudel.cc (it is a signal), but our panel
  transpiles it into `sliderWithID` — do not rely on that in musical logic.

## Filters and automation

- `lpf` and `cutoff` are **the same control**; if you call both, the last one
  wins. Do not “stack” cutoff with them.
- `lpenv` is the filter envelope depth **in octaves** (can be < 0), while
  `lpa`/`lpd`/`lpr` are seconds. It is not an LFO.
- LFO on cutoff, if you need it slow: `sine.slow(n)` (n — bars per cycle),
  not `sine.fast`. Controls are sampled at event onset — on sparse notes you
  get stepped movement, on 16ths — almost smooth.
- `AUTOMATION` must be **native**: `autoCurve` builds `arrange` from
  `pure`/`saw.range`. The panel only draws points. In stock strudel.cc it
  must sound without the panel.
- The `autoCurve` prefix before the first point is `pure(1)`, otherwise the
  layer sounds dull from the very start.
- `tlCurve` **carries the last value forward**: if a new key appears in only
  one section, it stays on in all subsequent ones until you explicitly set `0`.
- Switches declared via `autoSwitch` are interactive **only in LOOP**.
  In SONG/HOLD their value comes from TIMELINE, the buttons change nothing —
  the panel hides them. If you need a switch that always works, do not tie it
  to `autoSwitch`/sections.
- `AUTOMATION` is only for SONG. In LOOP it must not change the sound:
  `autoAt = autoCurve*songGate + loopGate + snapshot*holdGate` (in LOOP → ×1,
  in HOLD → the value at `holdBar`). Otherwise the track “drifts” in filters
  during the loop.
- Different `roomsize` values per layer = impulse response rebuild and dropouts.
  Keep one shared `fx.reverb.size` and mix with `room(...)`.
- `gain` before `stut()`/`echo()` is useless: they overwrite `gain`
  (`pow(feedback, i)`), the first copy goes out at 1.0 past the knob. Use
  `echoWith`/`withValue` or put the volume after.
- Volume after effects is `postgain`, but `npm run gains` looks at
  `gain` and complains “sounds at zero”. If a layer must be muted — put
  `gain` after `dist`/the filter, not only `postgain`.

## Samples and noise

- `s('white')`, `s('pink')`, `s('brown')` are generators with a looped buffer;
  a long event stretches as needed, but `brown` is noise, not a tone.
  If you need a “tonal drone” — a resonant filter (`bpf`/`lpf` + `q`)
  at the note frequency, not just noise.
- `hpf` above the fundamental kills the body: on low notes either lower `hpf`,
  or raise the register.
- `struct('<x ~ ...>')` on a sample is the same per-cycle retrigger; for “one
  time every N bars” you need `slow(N)` and a gate from the timeline.

## Checks and file structure

- `npm run verify -- tracks/...` is the single source of truth about whether
  patterns parse and what actually lands on the 1/16 grid. It must exit 0.
- `gains` catches “sounds at zero volume” (usually `stut`/`echo`).
- `tension` (if there is a `// @roots ...` marker) is a random-dirt detector,
  not a judge: deliberate dissonance can stay.
- `verify` wraps every `$:` block in `P(...)`. Therefore **continuation lines
  of a block must start with two spaces**, and closing brackets of nested
  `stack(...)` must also be indented, otherwise the check fails
  with “missing )”.
- Move helper constructs into `const` before the block, and leave one line in
  `$:` (`$: stack(a, b, c)`) — so both the check and the panel read the file
  the same way.
