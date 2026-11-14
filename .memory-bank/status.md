# strudel: Status

## Current Phase
Track library. Techno 01–16, atmospheric/dark dnb 01–02 and the first breakcore track are green.
breakcore/01 is 174 BPM rinse / note-off: scenes (mode), break bank, slice coarseness, grit,
plus four momentary pads in the web panel (`// @pads`, keys 1–4, no MIDI).
Reference: `docs/breakcore/` (RU + EN), play guide in `10-panel.md`.

## Key Metrics
- `npm run verify` — 24 tracks load and run, 0 errors.
- breakcore/01: verify ok, tension clean, gains silent at zero, doubles no collisions,
  cpu 12 worklets/bar (9/s), modes 5/5, live eval ok (slider sync ok).
- `npm run tension` — dnb/01 clean; dnb/02 clean with 62 intentional tritones; dnb/02-v2 clean with 112; techno/16 clean.
- `npm run live` — dnb/01, dnb/02, dnb/02-v2 and techno/16 evaluate and play in strudel.cc.
- Sample button (browser e2e): techno/15 = 27 files, dnb/02-v2 = 98, techno/16 = 45; all `SAMPLES ✓`.

## Roadmap
### ✅ Done
- techno/01–16, including 12-slowtrap-v3, 13-gabber-v3, 14-acid-jazz, 15-house-rave, 16-minimal-dub.
- dnb/01-atmospheric-jungle (LTJ Bukem / Aphrodite).
- dnb/02-dark-techstep (dark jungle / techstep / IDM).
- breakcore/01-rinse (174 BPM rinse / note-off, scenes + bank + grit + 4 pads).
- Web panel: momentary pads (`// @pads`), docs/breakcore library (RU + EN).
- README index and per-track notes.

### 🔄 In Progress
- Nothing. breakcore/01 is complete; do not rewrite it.

### 📋 Next
- **breakcore/02-stems-hardcore.js — 200+ BPM stems-hardcore / gabber. User explicitly asked for it.**
- Optional: more scenes/pads once 02 exists.

### 🔮 Horizon
- A third dnb character (e.g. halftime / autonomic) only as a new file, never as a rewrite of 01/02.

## Gates
A new track is done only when all pass:
`verify`, `tension`, `modes`, `latch`, `gains`, `doubles`, `cpu`, `live`.

## Known Constraints
- Samples lazy-load from GitHub; the first hit after raising a fader may wait for download.
- Node checks have no `samples()`; every track guards sample-map calls with `typeof samples === 'function'`.
- Do not rewrite dnb/02. New work = new file.
