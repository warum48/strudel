# Experimental · Complex Bass

A new series: tracks where the sound is not "oscillator → filter" but a
Buchla-style complex oscillator with FM/AM, waveshaping and paired modulation.

Track: `tracks/experimental/01-complex-bass.js` — 160 BPM, fat gritty bass,
no cartoon timbres.

> **Honest.** In Strudel a wavetable is a sampler source. It cannot be
> audio-rate FM'd by another layer. Real cross-mod lives inside the FM voice
> (carrier + modulator). Wavetables use `wt`/`warp` + amplitude ducking from
> their FM partner. This is a deliberate adaptation, not a Buchla reconstruction.

## 5 pairs = 10 oscillators

| Pair | Wavetable | FM partner | Role |
|---|---|---|---|
| 1 | `wt_dbass` | sine | low sub |
| 2 | `wt_distorted` | sawtooth | mid grit |
| 3 | `wt_ebass` | square | answer/body |
| 4 | `wt_raw` | triangle | upper dirt |
| 5 | `wt_bitreduced` | sine | scream/harmonics |

Plus 5 control LFOs, a hardcore `bd*4` kick with a `sub` body, hardcore hats, sidechain, a low drone
and two dirt layers. 18 tracks, 206 sliders.

## How to play

1. `npm run web` → `tracks/experimental/01-complex-bass.js`.
2. `mode 0` — hats on the weak beats (offbeat) + four-on-floor; `mode 3` — hardcore 16ths and a kick on beat 4 of every 2nd bar.
3. The panel starts with **vol 0 + M on** for everything; raise a volume and unmute 1–2 instruments.
4. The `bd` kick is already on every beat; `drums.kick.dist/shape` set the character.
5. Start in `mode 0 CLEAN` or `mode 1 GRIT`; `mode 3 SCREAM` for the peak.
6. `mode 0 CLEAN` — almost no waveshaping; `mode 2 FOLD` — more warp.
7. `harmony 1 AXIS` = D–Ab drone; `0 LOW` = D–A.
8. MIXER has `M/S` for WT/FM/drone, and a color-coded `G` group mute.
   The top `@mutes` row is hidden because G replaces it.
9. Ride `wt.wtN.pos/warp`, `fm.fmN.index/indexMod`, `cut/res`, `shape`,
   `pace`, `decay`.

## Gates

`verify` — 18 tracks / 206 sliders / 106 hits per bar.
`tension` — clean (37 deliberate tritones under `@dark`).
`modes` — kick 16/16/16/2, hats 16/32/40/52.
`latch` — bar 8.
`gains` — silent, `doubles` — no collisions, `cpu` — 112 worklets/bar
(75/s), `live` — eval ok.

## Documents

- `01-buchla.md` — how Buchla / West Coast works.
- `02-track.md` — track map and controls.
- `03-strudel.md` — recipes and gotchas.
- `04-sources.md` — sources.

RU originals: the same names without `.en.md`.
