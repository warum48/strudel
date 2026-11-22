# strudel tracks

A collection of ready-to-play [Strudel](https://strudel.cc) tracks plus a small
local panel and a headless checker that runs the real Strudel engine in Node.

Everything in `tracks/` is a single self-contained `.js` file. Copy it into
[strudel.cc](https://strudel.cc), press **Ctrl+Enter**, and play. Sliders are
Strudel widgets: drag them while the pattern is running.

## Quick start

### Play a track in strudel.cc

1. Open a file from `tracks/` (for example `tracks/techno/23-black-room.js`).
2. Paste its contents into the strudel.cc editor.
3. Press **Ctrl+Enter**.

If a track uses `samples('github:...')`, the first hit may wait for the sample
map to download. The local panel has a **PRELOAD SAMPLES** button.

### Run the local panel

```bash
npm install
npm run web
# open http://127.0.0.1:8080
```

The panel loads any file under `tracks/`, renders a mixer from the track's
`instruments` tree, shows `TIMELINE` / `AUTOMATION`, and lets you audition
tracks without copying them into strudel.cc. See `docs/PANEL.md`.

## Repository layout

```text
tracks/                 tracks grouped by style
  01-dnb-live.js …      root drum & bass series
  breakcore/            breakcore and hardcore
  coldwave/             coldwave
  darkwave/             darkwave
  dnb/                  atmospheric jungle and dark techstep
  experimental/         Buchla / west-coast experiments
  idm/                  IDM
  khmer/                Khmer pinpeat and percussion
  minimal-techno/       minimal techno
  psytrance/            psytrance
  techno/               techno, dub techno, trance, acid jazz
  trip-hop/             trip-hop / acid jazz
web/                    local panel (index.html, panel.js, help.html)
tools/                  verify/gains/tension/cpu/live and the dev server
docs/                   docs, style playbooks and the track catalog
```

Use `docs/TRACKS.md` for the catalog. It lists every track with BPM, form
length, layer/slider counts, transport and a short description.

## Track format

A track is one JS file. Most tracks share this shape:

- `const BPM = …` + `setcpm(BPM / 4)` — one cycle equals one 4/4 bar.
- `const UI = { … }` — optional panel manifest: transport roles, hold bar,
  switch variants.
- `const instruments = { … }` — mixer tree (group → instrument → sliders).
- `const TIMELINE = [ … ]` — sections with `at` / `len` / `values`.
- `const AUTOMATION = [ … ]` — cut/effect curves (mostly cutoff).
- `$:` blocks — layers (drums, bass, chords, melody, FX).

Tracks with a full arrangement use:

- `play` slider: `0` = LOOP, `1` = SONG, `2` = HOLD;
- `holdBar`: bar to snapshot in HOLD;
- `tlOr()` / `gateOf()` to gate layers from the timeline;
- `autoSwitch()` for `mode` / `harmony`, `autoAt()` for cutoff automation;
- `.mask(gateOf(...))` and `.filter(audible)` on every layer.

## Hard rules

- **Mini-notation goes through `m(...)`** — `note(m('c4 e4'))`,
  `n(m('3 4 5'))`, `struct(m('x*4'))`, `s(m('bd*4'))`. In real strudel.cc only
  double-quoted strings are auto-wrapped; single quotes stay plain strings.
  The local panel hides this, so always check the track in strudel.cc too.
- **The track must sound in stock strudel.cc.** No panel-only helpers.
- **One timbre — its own sliders.** Do not reuse another instrument's `vol`.
- **One `roomsize`** (`fx.reverb.size`) for the whole track. Reverb is shared
  per orbit; changing size at runtime recomputes the impulse response.
- **No negative literals in `slider(...)`.** The widget reads the literal, so
  `-2` becomes `NaN`. Use `0…N` and apply the sign in code.
- **Worklet budget:** `shape` / `crush` / `coarse` / `distort` /
  `ftype('ladder')` create one AudioWorklet per event. Keep the worst section
  under ~150 worklets/s (`npm run cpu`).
- **No `supersaw` stacks** on dense 16th/`seg()` parts; each voice expands to
  seven oscillators.

## Checks

```bash
npm run verify   -- tracks/techno/18-khmer-dub-v2.js
npm run gains    -- tracks/techno/18-khmer-dub-v2.js
npm run tension  -- tracks/techno/18-khmer-dub-v2.js
npm run cpu      -- tracks/techno/18-khmer-dub-v2.js
npm run levels   -- tracks/techno/18-khmer-dub-v2.js 52
npm run live     -- tracks/techno/18-khmer-dub-v2.js
```

`verify` runs the real engine and prints the 1/16 grid. `live` opens
strudel.cc in headless Chrome, evaluates the track and checks a slider drag.
`docs/CHECKS.md` explains what each tool catches and its blind spots.

## Documentation

English is the default documentation language. The core indexes are English
(`README.md`, `docs/TRACKS.md`, `docs/PANEL.md`, `docs/CHECKS.md`). For the
translated references and style playbooks, English is `*.en.md` and the Russian
original stays as `*.md`; the old Russian README is `README.ru.md`. Internal
research dumps under `docs/thoughts/` and scraped forum threads under
`docs/breakcore/threads/` remain source material, not user docs.

| Document | What it covers |
|---|---|
| `docs/TRACKS.md` | Catalog of every track: form, layers, sliders, transport |
| `docs/PANEL.md` | Local panel: manifest, mixer, timeline, scenes, mutes |
| `docs/CHECKS.md` | `verify` / `gains` / `tension` / `cpu` / `live` and budgets |
| `docs/pitfalls.en.md` | Strudel gotchas: `m()`, `slow` vs `struct`, worklets |
| `docs/prompt-track.en.md` | Prompt template for generating a new track |
| `docs/rules.en.md` | Style/arrangement rules and anti-patterns |
| `docs/references.en.md` | External docs, examples, sources |
| `docs/theory.en.html` | Running theory notebook (mini-notation, filters, form) |
| `docs/switchangel-recipes.en.md` | Slide, 303, accent and fill recipes |
| `docs/slider-bug.en.md` | Slider widget desync and the in-track patch |

Style playbooks live under `docs/<style>/` (`breakcore`, `coldwave`,
`darkwave`, `dub-techno`, `experimental`, `idm`, `khmer`, `minimal-techno`,
`psytrance`, `shoegaze`, `techno`, `trip-hop`). Several of them have both
Russian (`.md`) and English (`.en.md`) versions.

## Adding a track

1. Read `docs/prompt-track.en.md` and `docs/rules.en.md`.
2. Read `docs/pitfalls.en.md` — especially Rule #1 about `m()`.
3. Pick a reference track from the same style in `docs/TRACKS.md`.
4. Write one file in `tracks/<style>/`.
5. Run `npm run verify`, `npm run gains`, `npm run tension`, `npm run cpu`.
6. Run `npm run live` and check the track in stock strudel.cc.
7. Add it to `docs/TRACKS.md`.

## Versioning

Never overwrite a previous version. Add a new file:

- small variants: `01-track.js` → `02-track-v2.js` or keep the number and add
  a version suffix (`17-halfstep-dub-v2.js`), depending on the series;
- a full rework gets the next free number in the folder.

The old file stays as a reference; the new file gets its own `docs/TRACKS.md`
entry.

## License and samples

The code in this repository is project material. Samples are loaded from
public Strudel/Tidal sample maps (`github:tidalcycles/...`) or direct URLs.
Check the sample source before redistributing.
