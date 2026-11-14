# Progress

## 2026-11-14
- Added `tracks/techno/14-acid-jazz.js` (90 BPM, D-minor-ish acid jazz, TIA arp, additive partials pads).
- Added `tracks/techno/15-house-rave.js` (120 BPM, F major jazz house, clav/acid/hoover riffs, rave switch).
- Added `tracks/dnb/01-atmospheric-jungle.js` (174 BPM, D natural minor, Amen/Think, Bukem pads, Aphrodite jump-up mode).
- Added `tracks/dnb/02-dark-techstep.js` (172 BPM, D phrygian/diminished, Apache + breaks165, FM grinder, dist/glitch layers).
- Researched external production guides for liquid/atmospheric dnb, Amen chopping, techstep/dark dnb, Reese bass and IDM.
- Audited all tracks: verify, tension, modes, latch, gains, doubles, cpu, live — green.
- README index updated; dnb/02 must not be modified.

## 2026-11-14 — dnb/02 v2 + sample downloader
- Copied `dnb/02-dark-techstep.js` → `dnb/02-dark-techstep-v2.js`; v1 untouched.
- Grinder redesigned: long notes, long attack, `grind` 0 LONG / 1 DRIFT / 2 STUTTER, per-mode phrases.
- Added real `chop`/granular layer: `grain` 4/8/16 + UI sliders cut/hpf/crush/speed/rev/jitter/drop/room.
- Added `DOWNLOAD SAMPLES` button to the panel header; downloads only used keys from track maps + uzu, via `wa.loadBuffer`, with progress/status.
- Browser e2e: techno/15 → 27 loaded; dnb/02-v2 → 98 loaded; both `SAMPLES ✓`.
- Audits green: verify, tension, modes, latch, gains, doubles, cpu, live.

## 2026-11-14 — techno/16 minimal dub
- Added `tracks/techno/16-minimal-dub.js`: 120 BPM, Am9 (4 bars) → Bbmaj9 (4 bars), no functional cadence.
- One offbeat chord stab into delay 0.375 / feedback 0.55 / filtered repeats; pad WARM/AIR; hiss/air/wind.
- Enforced `docs/rules.md`: both bass cut max 80, kick lpf 260, no melody, no 303, no snare on 2/4, no sidechain/risers/drops.
- Modes DUB/STRIP/PRESSURE/CLICK; 13 tracks, 47 sliders.
- Audits green; sample button e2e: 45 files loaded.
