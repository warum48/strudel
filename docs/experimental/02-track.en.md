# Track 01 · Complex Bass

`tracks/experimental/01-complex-bass.js` — 160 BPM, 18 tracks, 206 sliders.
Goal: **fat gritty bass**, no cartoon wavetables.

## 1. Pairs

| # | WT | FM | Orbit | Role |
|---|---|---|---|---|
| 1 | `wt_dbass` | sine | 7 | sub, D1 |
| 2 | `wt_distorted` | sawtooth | 7 | grit, D1/F1 |
| 3 | `wt_ebass` | square | 7 | body, G1/D1 |
| 4 | `wt_raw` | triangle | 7 | upper dirt, A1/C2 |
| 5 | `wt_bitreduced` | sine (an octave up) | 7 | scream, D2/F2/G2 |

Per pair:

- WT: `.wt(lfo * posDepth + pos)`, `.warp(lfo * warpDepth + warp)`,
  `lpf/res`, `shape`, `decay`.
- FM: `.fm(index + lfo * indexMod) * fmMode`, `.fmh(ratio)`,
  `lpf/res`, `shape`, `slide`, `.orbit(7)`.
- LFO: `sine.range(0,1).fast(rate)` drives both WT and FM.

All 10 basses share orbit 7 and the kick ducks that orbit with
`duckorbit(7)` — real sidechain, not an LFO saw. Not audio-rate FM; the pair
is coupled by the shared riff and the shared bus.

## 2. Riffs

12 selectable riffs: `acid`, `roll`, `dnb`, `prod`, `off`, `oct`, `stair`,
`two`, `pedal`, `stab`, `skip`, `crawl`. All 10 oscillators play the same
`RIFF`; `riff` 0…11 changes the pattern, not the timbre. FM5 plays the same
riff an octave up. Details: `05-riffs.md`.

Each bass has its own `pace` 4…32 (16 = 1×, 4 = 4× slower, 32 = 2× faster):
`note(RIFF).fast(pace.fmap(p => p / 16))`. Paces are independent, so the
basses can drift out of phase — that is intentional.

## 3. Notes and tuning

- Low end: D1/F1/G1/A1/C2/D2/F2/G2.
- `@roots d d d d d d d d`, `@dark`: D–Ab tritones are deliberate.
- `PAD_A` = D2–A2 (low), `PAD_B` = D2–Ab3 (axis); drone latches every 8 bars.
- No major triads, no pretty cadences.

## 4. Modes

| mode | What it does |
|---|---|
| 0 CLEAN | hats on weak beats (offbeat), four-on-floor; minimal grit |
| 1 GRIT | 8th hats, four-on-floor; main gritty bass |
| 2 FOLD | broken 16th hats; more warp/shape |
| 3 SCREAM | hardcore 16th hats; kick on beat 4 of every 2nd bar |

`mode` changes kick (16/16/16/2 over 4 bars), hats (16/32/40/52),
`grit`/`fmMode` and air density (4/12/24/28), so `modes` sees a difference.

## 5. Controls

- WT: `oct pace vol pos posDepth warp warpDepth cut res shape decay pan echo room`.
- FM: `oct pace vol ratio index indexMod cut res shape decay pan echo room slide`.
- LFO: `rate`.
- Drone: `vol cut det room`.
- Dirt: `crackle` / `air` — vol/cut.
- FX: `fx.dub.delaySend/delayTime/delayFeedback`, global `verb/verbSize`.
- `mode` / `harmony` switches.
- Panel starts with `vol = 0` and M on; code keeps preset levels for Strudel.
- M/S on 17 MIXER channels; G on 15 (WT/FM/drone), colored by
  `muteWT/muteFM/muteDrone`.

## 6. Kick / hats / sidechain

`bd*4` — exactly every beat; `shape` + `distort` + `lpf` 280 + `sub` body.
Hats: `hh` 16ths and `oh` on offbeats, `shape`/`hpf` for hardcore.
`sidechain` (0…1) — `duckorbit(7)` on the kick: real ducking of every bass,
depth = `sidechain`, attack 0.02.

`bd*4` — exactly every beat. `shape` + `distort` + `lpf` 280 make it hardcore;
a `sub` layer on the same beats adds body. Controls: `drums.kick.vol/cut/shape/
dist/decay/tune`, `drums.kickSub.vol/cut/decay/tune`; G group `muteKick`.

## 7. Gates

- `verify` — 18 tracks, 106 hits/bar, 206 sliders.
- `tension` — clean; 37 deliberate tritones.
- `modes` — air 4/12/24/28; FM/WT change timbre.
- `latch` — bar 8.
- `gains` — silent; `doubles` — no collisions.
- `cpu` — 112 worklets/bar (75/s).
- `live` — eval ok, pattern plays.
