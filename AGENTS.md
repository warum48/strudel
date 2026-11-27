# Project agent rules

## Slider lower bounds — cutoff must reach 50

**Every cutoff slider's lower bound (`min`) is 50, never higher.**
`cut: slider(160, 50, 400, 5)` — good; `slider(160, 60, …)`,
`slider(1200, 200, …)`, `slider(6500, 800, …)` — wrong: the filter cannot be
closed and the user cannot tame the layer. `min` below 50 (e.g. bass `40`) is
fine. This is a standing request, not a per-track nicety — apply it when writing
any track without being asked. Details: `docs/rules.en.md` → “Slider ranges”.

## 303 cutoff automation — an ornament, not a law

**Cutoff automation on a 303 is a recommendation, not a standing requirement.**
Many tracks should open already acid from bar 1, or start the knob around 100.
A low sweep from ~80 upward belongs only to a genuine acid moment and only for a
short stretch — at most ~4 bars. Never let the track (or half of it) spend many
bars climbing out of a closed filter: that reads as a mute, not as a filter
move. A static `cut` knob is fine when the phrasing itself carries the acid.
The slider `min` still stays 50 (hard rule above). Details:
`docs/rules.en.md` → “303 cutoff automation”.

## Theory page upkeep

The **running Strudel theory notebook** exists in two files:

- `docs/theory.en.html` — English, the primary notebook;
- `docs/theory.html` — Russian original, kept as reference and allowed to lag.

Both use the same dark style, code examples and table of contents.

- Whenever the user asks a **theoretical / "how does it work" question about
  Strudel** (mini-notation, `note`/`s`/`sound`, chords vs arpeggios, sliders,
  filters/cutoff, `stack`/`$:`, structure, `arrange`/`TIMELINE`, granular,
  effects, sample loading, etc.) — answer the question **and** add/update the
  matching section in `docs/theory.en.html` automatically. The user keeps this
  as a conspectus, so do not wait for a separate request. Update the Russian
  `theory.html` too only when it is cheap; it is an archive.
- **Only what was asked.** Do not add adjacent theory, background, or "for
  completeness" material. No overdose: short section, minimal code, no extra
  examples. If the question is narrow, the note is narrow.
- If the topic already exists, **extend that section** instead of duplicating.
- Keep the page's table of contents in sync when adding a new section.
- The pages are opened directly at `/docs/theory.en.html` and
  `/docs/theory.html`; intentionally **no link in the UI**. Do not add one
  unless asked.

## Track authoring hard rule

**Any mini-notation string must go through `m(...)`** — `note(m('c4 e4'))`,
`n(m('3 4 5'))`, `struct(m('x*4'))`, `s(m('bd*4'))`. In real strudel.cc the
transpiler auto-wraps only **double-quoted** strings; single quotes stay plain
strings and fail (`"3 4 5" is not a number`, missing kick/perc). The local panel
calls `miniAllStrings()` and hides this, so always verify the track in
strudel.cc too. Details: `docs/pitfalls.en.md` → Rule #1.


## Production tracks (`tracks/_selected/`)

- `tracks/_selected/` is the public production set. Non-local hosts serve only
  these files; everything else under `tracks/` stays local.
- Production files use curated, user-facing titles/headers (e.g. `ACID JAZZ ·
  jazzy breaks` rather than the internal working name).
- Comments in production files must be official and useful to every user: no
  dev notes, version history, tooling commands, audition leftovers or
  "removed from the final track" notes.
- Keep the **code** of a production file in sync with its source track. When
  editing the source, port the same code change to its `_selected` copy;
  comments may stay curated. Current mapping (also in `docs/TRACKS.md`):
  - `00-jazzy-breaks` ← `bigbeat/04-acid-breaks-v4`
  - `01-mekong-sunrise` ← `techno/18-khmer-dub-v5`
  - `02-bodhi` ← `techno/17-halfstep-dub-v3`
  - `03-cold-rooms` ← `coldwave/03-cold-rooms-v3`
  - `04-ein-fest` ← `darkwave/01-static-confession`
  - `05-bright-road` ← `psytrance/02-acid-euphoria`
  - `new-track` is the starter, no source copy.

## Docs language

English is the default documentation language. New docs and updates go to the
English files (`README.md`, `docs/TRACKS.md`, `docs/PANEL.md`, `docs/CHECKS.md`,
`*.en.md`). Russian files (`README.ru.md`, the Russian `*.md` originals) are
archives: keep them, but let them lag unless a correction is cheap and factual.
