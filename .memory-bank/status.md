# strudel: Status

## Current Phase
Track library. Techno 01–15 and atmospheric/dark dnb 01–02 are complete and green.

## Key Metrics
- `npm run verify` — all tracks load and run, 0 errors.
- `npm run tension` — dnb/01 clean; dnb/02 clean with 62 intentional tritones (`@dark`).
- `npm run live` — dnb/01 and dnb/02 evaluate and play in strudel.cc.

## Roadmap
### ✅ Done
- techno/01–15, including 12-slowtrap-v3, 13-gabber-v3, 14-acid-jazz, 15-house-rave.
- dnb/01-atmospheric-jungle (LTJ Bukem / Aphrodite).
- dnb/02-dark-techstep (dark jungle / techstep / IDM).
- Web panel and audit tooling updates.
- README index and per-track notes.

### 🔄 In Progress
- Nothing. dnb/02 is complete; do not modify it.

### 📋 Next
- Optional: record/perform dnb/02, or start dnb/03 as a separate track.
- Optional: add a sample-pack availability check to the live audit.

### 🔮 Horizon
- A third dnb character (e.g. halftime / autonomic) only as a new file, never as a rewrite of 01/02.

## Gates
A new track is done only when all pass:
`verify`, `tension`, `modes`, `latch`, `gains`, `doubles`, `cpu`, `live`.

## Known Constraints
- Samples lazy-load from GitHub; the first hit after raising a fader may wait for download.
- Node checks have no `samples()`; every track guards sample-map calls with `typeof samples === 'function'`.
- Do not rewrite dnb/02. New work = new file.
