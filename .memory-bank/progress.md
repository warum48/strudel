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

## 2026-11-15 — techno/17 halfstep dub
- Added `tracks/techno/17-halfstep-dub.js`: 104 BPM, Burial-leaning halfstep/two-step, Dm9 (4 bars) → Bbmaj9 (4 bars).
- Rhythm: kick on 1 + pickup, snare on 3, shuffled 16th hats via `swingBy`; modes HALF/DRAG/STEP/STRIP.
- Bass: sub ≤80 + separate mid `growl` (slow LFO cutoff, light shape) — deliberate exception for the requested dubstep grit.
- Pad: `vowel("<a o>")` formant pad; GHOST pad on open fifths/ninths; sparse stab every 2 bars; sparse Moog, default 0.
- Audits: verify (16 tracks, 65 sliders), tension clean, modes 4/4, latch bar 8, gains silent, doubles no collisions, cpu 6/bar (3/s), live eval ok.

## 2026-11-15 — techno/15 arp pace
- Reverted the per-instrument duck experiment; `duck` stays global in 15 as before.
- Replaced the fixed ARP figure with `ARP_CHORDS` + `arp(run(melody.arp.pace))`: pace 8/16/32 sets arp notes per bar while following the current chord.
- Audits: verify 27 tracks / 101 hits / 90 sliders, tension clean, gains silent, live eval ok (slider sync ok).

## 2026-11-15 — techno/17 v2
- Copied `17-halfstep-dub.js` → `17-halfstep-dub-v2.js`; v1 untouched.
- Moog note is now a proper `moog.note` instrument (flat `moog` was skipped by the panel's 3-level tree): low d3/a2/bb2 velvet register, `vol` 0.2, octave −2…2, cut 1100, full controls (attack/decay/sustain/release, shape, LFO, echo, room, slide); arp has the same set + pace 2–16.
- Added `chords.pad.fb` macro scaling pad resonance/chorus/LFO depth: 1 = v1, 0 = dry pad.
- Audits: verify 28 tracks (17 tracks, 90 sliders), tension clean, gains silent, modes 4/4, latch bar 8, cpu 10/bar (4/s), doubles no collisions, live eval ok.
