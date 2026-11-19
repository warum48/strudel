# Project agent rules

## Theory page upkeep

`docs/theory.html` is the **running Strudel theory notebook for this project**
(Russian, same dark style, code examples, table of contents).

- Whenever the user asks a **theoretical / "how does it work" question about
  Strudel** (mini-notation, `note`/`s`/`sound`, chords vs arpeggios, sliders,
  filters/cutoff, `stack`/`$:`, structure, `arrange`/`TIMELINE`, granular,
  effects, sample loading, etc.) — answer the question **and** add/update the
  matching section in `docs/theory.html` automatically. The user keeps this as
  a conspectus, so do not wait for a separate request.
- **Only what was asked.** Do not add adjacent theory, background, or "for
  completeness" material. No overdose: short section, minimal code, no extra
  examples. If the question is narrow, the note is narrow.
- If the topic already exists, **extend that section** instead of duplicating.
- Keep the page's table of contents in sync when adding a new section.
- The page is opened directly at `/docs/theory.html`; intentionally **no link
  in the UI**. Do not add one unless asked.
