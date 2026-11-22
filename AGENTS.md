# Project agent rules

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


## Docs language

English is the default documentation language. New docs and updates go to the
English files (`README.md`, `docs/TRACKS.md`, `docs/PANEL.md`, `docs/CHECKS.md`,
`*.en.md`). Russian files (`README.ru.md`, the Russian `*.md` originals) are
archives: keep them, but let them lag unless a correction is cheap and factual.
