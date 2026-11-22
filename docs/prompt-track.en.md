# Prompt: generate a track in Strudel

> **IMPORTANT: the most common one — mini-notation only through `m(...)`.**
> In original strudel.cc only **double** quotes are auto-wrapped in `m()`;
> single quotes stay a string. Then `n('3 4 5')` gives
> `"3 4 5" is not a number, falling back to 0`, `s('bd*4')` loses the kick,
> `struct('x*4')` — the grid, `note('c4 e4')` — the melody. The panel calls
> `miniAllStrings()` and masks this, so check the track in strudel.cc as well.
> Any rhythm/pitch string — `m('...')`; data strings
> (UI manifest, sample names) — plain single quotes.

A template for AI. Copy the block between the `BEGIN PROMPT` / `END PROMPT` markers,
replace `{{...}}` and send it to the model. When publishing, replace internal
repository links with direct URLs (see “Publishing” at the end).

<!-- BEGIN PROMPT -->

# Task

Write a musical track in **Strudel** (live-coding, JavaScript) in the style
**{{STYLE}}**. This is not a demo sketch but a full track by our standards:
section-based form, automation, its own mixer, checks.

Extra wishes (may be empty): {{TEMPO / KEY / MOOD / LENGTH}}
Style docs (if any): {{STYLE_DOCS_LINK}}

# What to read before the code

1. `docs/rules.en.md` — our style frames and anti-patterns.
2. `docs/pitfalls.en.md` — Strudel gotchas we have already hit
   (mandatory to follow).
3. `docs/references.en.md` — index of external sources (docs, examples).
4. Style docs, if given: `docs/{{style}}/README.en.md` or the link above.
5. Reference file structure — `tracks/coldwave/03-cold-rooms-v3.js`
   (full: mixer, TIMELINE, AUTOMATION, noise, granular). Simple example —
   `tracks/coldwave/01-cold-rooms.js`. For jazz/trip-hop —
   `tracks/trip-hop/02-acid-jazz-v2.js`.

If there are no style docs — **find 2–3 sources yourself** (strudel.cc/learn/*,
GitHub examples from `docs/references.en.md`), write down tempo, harmony, rhythm,
instruments, mix and “what is not done in the genre”, and only then write.

# Hard requirements

- The track must **sound in original strudel.cc**. “Panel magic” is forbidden:
  only native Strudel functions. Automation — via
  `arrange`/`saw.range` (`autoCurve`), sections — with ordinary code.
- Mini-notation strings — **only through `m(...)`**: `note(m('d3 f3'))`,
  `s(m('bd ~ sd ~'))`, `n(m('3 4 5'))`, `.struct(m('x*4'))`. Single
  quotes do not parse in real strudel.cc (the panel masks this) — see
  the red block above and `docs/pitfalls.en.md`.
- No negative literals in `slider(...)` (the value becomes `NaN`).
- One timbre — **its own sliders**, not a shared `vol` with another instrument.
- One shared `roomsize` (`fx.reverb.size`) for all layers.
- Do not put `distort`/`shape`/`crush`/`ftype('ladder')` on dense parts
  (16ths, `seg(...)`): each such control is a worklet per event. Budget —
  up to ~150 worklets/s (`npm run cpu`).
- `supersaw` — 7 oscillators per voice: do not stack it in chords with `seg(8)`.
- Do not add `chord()`/`voicing()` without need: they are not in the node check,
  `verify` will not be able to check such a track. Write explicit notes.
- Dub/reggae — only if the style explicitly asks for it.

# File standard

One file `tracks/{{style}}/NN-{{slug}}.js`:

1. **Header comment**: BPM, genre, lineup, form, link to the style docs.
2. `setcpm(BPM / 4)`.
3. `samples({...})` block — only if samples are needed; jsDelivr CDN or
   local paths. No `raw.githubusercontent` (often 503).
4. **UI manifest** — if the track has switches (the panel labels them):
   `const UI = { switches: { mode: [...], gtr: [...] } }`. The switches
   themselves are ordinary top-level `slider(0,0,N,1)` with `min 0` and `step 1`.
   The panel shows a group only when there are ≥2 variants. The legacy
   `// @switches name=variant1,variant2,...` comment is still parsed as a
   fallback for old tracks.
5. **Mixer** — tree:
   ```js
   const instruments = {
     drums: { kick: { name: 'Kick', vol: slider(0.4, 0, 0.8, 0.01), cut: slider(...) } },
     low:   { bass: { name: 'Bass', vol: ..., cut: ... } },
     keys:  { pad:  { name: 'Pad',  vol: ..., cut: ..., atk: ... } },
     fx:    { reverb: { size: slider(3, 1, 8, 0.5) } },
   }
   const { drums, low, keys, fx } = instruments
   ```
6. **Section timeline**: array `{ at, len, name, values }` + function
   `tlCurve(key)`/`tlOr(key)` (as in the reference) and a `song` gate for SONG/LOOP.
   `tlCurve` carries the last value forward — set `0` explicitly.
   Separate material and rhythm: `figures` (notes, one source of truth),
   `grooves` (rhythms per slot: kick/snare/hat/bass…) and `autoSwitch(key, knob)`
   = “SONG → section / LOOP → knob / HOLD → section”. For each family
   (`mode`, `gtr`, `arp`…) — its own switch and its own key in the sections, but
   **only if there are ≥2 variants**: a single rhythm/variant stays without a
   switch, otherwise the panel draws an empty group. List all variants in the
   UI manifest — from their count the panel decides whether to show the group.
   Switches on `autoSwitch` live only in LOOP (in SONG/HOLD TIMELINE drives
   them, the panel hides them) — this is expected.
   Make the mode switch **three-position** and declare the roles **in code**
   with a manifest (a valid JS literal, not a comment):
   a plain JS object, strings in **single** quotes (double quotes outside
   `samples(...)` are turned into `m(...)` by the transpiler and the code crashes):
   `const UI = { transport: { name: 'play', labels: ['loop','song','hold'] },
   holdBar: 'holdBar', switches: { mode: [...], gtr: [...], arp: [...] } }`.
   The panel parses this literal without eval; comment markers are a deprecated
   fallback.
   0 = LOOP (no TIMELINE, all layers), 1 = SONG (by form), 2 = HOLD (the section
   state under `holdBar`, automation frozen). The panel switches and moves
   `holdBar` itself; without this branch hold mode will not work.
7. **AUTOMATION**: `[{ path, points: [[bar, mult], ...] }]` + `autoCurve`,
   which builds `arrange` from `pure`/`saw.range`. The prefix is `pure(1)`.
   The curve works only in SONG; in LOOP — neutral (×1), in HOLD —
   a snapshot at `holdBar`.
8. **Lanes** — one per instrument, `$: ...` with the chain
   `gain(vol.mul(tlOr('lane')))`, filter, envelope, `room`,
   `.mask(gateOf('lane'))`, `filter(audible)`. Helper in the track:
   `const gateOf = (key) => tlOr(key).fmap(v => v > 0.001)` — disabled
   sections produce no events (CPU savings), not just play at zero.
9. Comment the key decisions (why this cutoff, why `seg`, where
   a layer enters) — briefly, to the point.

# Musical requirements for the style

Before the code, write down (and follow) for {{STYLE}}:
- tempo and meter, groove type;
- harmony: key/modes, chords, how often they change;
- rhythm: kick, snare/clap, hats, percussion;
- bass: register, articulation, cutoff;
- synths/guitars: timbres, envelopes, effects;
- arrangement: 4–7 sections, what enters/exits, where the emptiness is;
- mix: dark/bright top end, reverb/delay, what does not clog;
- **what to avoid** in this genre (from docs/sources).

Key rule: **do not fill**. Emptiness and pauses are part of the music; removing
a layer between sections is stronger than adding a new one.

# Check before delivery (mandatory)

Run and fix until exit 0:

```bash
npm run verify -- tracks/{{style}}/NN-{{slug}}.js
npm run gains  -- tracks/{{style}}/NN-{{slug}}.js
npm run cpu    -- tracks/{{style}}/NN-{{slug}}.js
npm run levels -- tracks/{{style}}/NN-{{slug}}.js 34   # balance: lead not quieter than pad
npm run tension -- tracks/{{style}}/NN-{{slug}}.js   # if there is // @roots
```

Instrument levels are constant across sections; energy is density/filter/decay,
not volume (percussion is the exception).

- `verify` — parsing and the real 1/16 grid, the number of lanes/hits/sliders.
- `gains` — the track must mute to zero; otherwise look for `stut`/`echo` after `gain`.
- `cpu` — worklets/s; budget ~150/s. Remember: it looks at the first 8 bars,
  check layers from later sections separately.
- `levels` on a couple of sections: there must be no events at zero volume —
  disabled layers are muted by `.mask`/`gateOf`, not just `gain 0`.
- `tension` — only if there is `// @roots`; it is a random-dirt detector,
  deliberate dissonance can stay.

In the final answer: file path, BPM/key, list of sections, `verify`/`cpu`
numbers, and what you left to your taste.

# Delivery

- Create the file at the path above. **Do not overwrite the previous version**
  of the track: a new version is a new file (`01` → `02` → `03`), the old one
  stays as a reference.
- Add a track entry to `docs/TRACKS.md` (track section: style, BPM, lineup,
  form, checks).
- If you added a new genre — create/extend `docs/{{style}}/README.en.md`
  (playbook: sound, rhythm, bass, synths, arrangement, mix, mistakes) and add
  the link to `docs/references.en.md`.
- Do not add placeholder comments, `TODO` or `...` to the code.

# If something is unclear

Do not guess silently: ask 2–3 short questions (tempo, key, length,
mandatory/forbidden instruments) and only then write the code.

<!-- END PROMPT -->

## Publishing

When the prompt goes online, replace internal links with direct URLs:

| Internal link | Replace with |
|---|---|
| `docs/rules.en.md` | link to the published `rules.md` |
| `docs/pitfalls.en.md` | link to the published `pitfalls.md` |
| `docs/references.en.md` | link to the published `references.md` |
| `docs/{{style}}/README.en.md` | link to the genre playbook |
| `tracks/coldwave/03-cold-rooms-v3.js` | link to the raw reference file |
| `docs/TRACKS.md` | link to the track index |

When publishing, either leave the `npm run ...` commands as “if you have the
repository environment”, or remove them and replace with a manual check in strudel.cc.
