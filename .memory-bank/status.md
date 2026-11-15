# strudel: Status

## Current Phase
Track library. Techno 01–17 (+ 17-v2), dnb 01–02 and three breakcore tracks are green.
breakcore/01 exists in two variants (chop 4/8/16/32; 16th fragments with no pitch shift).
breakcore/02 is 200 BPM stems/gabber in F phrygian: parallel dry/wet kick (909 + saturated
band + noise click), metal ring from a tuned feedback delay, synthesized noise textures with
LFO filters (no wind/noise/pad samples), kick clean/dist/hard, 5 modes, 4 pads.
Reference: `docs/breakcore/` (RU + EN); play guide in `10-panel.md`.

## Key Metrics
- `npm run verify` — 28 tracks load and run, 0 errors.
- breakcore/01 (both variants): verify ok, tension clean, gains silent, cpu ≤20/bar, modes 5/5, live ok.
- breakcore/02: verify ok (20 tracks, 78 sliders), tension clean, gains silent, doubles no collisions,
  cpu ≤19/bar (16/s), modes 5/5, live eval ok (slider sync ok).
- techno/17-halfstep-dub: verify ok (16 tracks, 65 sliders), tension clean, gains silent,
  modes 4/4 (kick 8/4/8/8), latch bar 8, cpu 6/bar (3/s), doubles no collisions,
  live eval ok (slider sync ok).
- techno/17-halfstep-dub-v2: verify ok (17 tracks, 90 sliders), separate low `Moog note` with octave +
  arp with pace 2–16, full Moog note/arp controls, pad.fb regulator, tension clean, gains silent,
  modes 4/4, latch bar 8, cpu 10/bar (4/s),
  doubles no collisions, live eval ok. v1 untouched.
- `npm run tension` — dnb/01 clean; dnb/02 clean with 62 intentional tritones; dnb/02-v2 clean with 112; techno/16, 17 and 17-v2 clean.
- `npm run live` — dnb/01, dnb/02, dnb/02-v2, techno/16, techno/17 and techno/17-v2 evaluate and play in strudel.cc.
- Sample button (browser e2e): techno/15 = 27 files, dnb/02-v2 = 98, techno/16 = 45; all `SAMPLES ✓`.

## Roadmap
### ✅ Done
- techno/01–17, including 12-slowtrap-v3, 13-gabber-v3, 14-acid-jazz, 15-house-rave,
  16-minimal-dub, 17-halfstep-dub and 17-halfstep-dub-v2.
- dnb/01-atmospheric-jungle (LTJ Bukem / Aphrodite).
- dnb/02-dark-techstep (dark jungle / techstep / IDM).
- breakcore/01-rinse + 01-rinse-slices (two rinse variants, 174 BPM).
- breakcore/02-stems-hardcore (200 BPM gabber, layered kick, clean/dist/hard).
- Web panel: momentary pads (`// @pads`), docs/breakcore library (RU + EN).
- README index and per-track notes.

### 🔄 In Progress
- Nothing. breakcore/01 is complete; do not rewrite it.

### 📋 Next
- Listen to 01 vs 01-slices and decide which one to keep (user: both are interesting for now).
- Tune the 02 kick by ear (`kick` clean/dist/hard, grit values) and the pad set.
- Tune 17-v2 growl, Moog note/arp and `chords.pad.fb` by ear; v1 stays as the reference.

### 🔮 Horizon
- A third dnb character (e.g. halftime / autonomic) only as a new file, never as a rewrite of 01/02.

## Gates
A new track is done only when all pass:
`verify`, `tension`, `modes`, `latch`, `gains`, `doubles`, `cpu`, `live`.

## Known Constraints
- Samples lazy-load from GitHub; the first hit after raising a fader may wait for download.
- Node checks have no `samples()`; every track guards sample-map calls with `typeof samples === 'function'`.
- Do not rewrite dnb/02. New work = new file.
