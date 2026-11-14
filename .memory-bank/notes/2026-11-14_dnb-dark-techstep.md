# dnb/02-dark-techstep — what makes it work

File: `tracks/dnb/02-dark-techstep.js` (172 BPM, 25 tracks, 102 sliders).
Do not rewrite this file; new work goes into a new file.

- Harmony: D phrygian/diminished `Dm7 → Ebmaj7 → Dm7 → Bb → Gm7 → A°7 → Dm7 → Ebmaj7`.
- `@dark` is intentional: 62 anchored tritones allowed; minor seconds in one register are forbidden and currently absent.
- Bass stack: `abyss` (sine sub, LPF 90), `grinder` (FM sine, ratio 1.51, Ladder + drive + distort), `coil` (detuned saws + `vowel("<a e>")`), `wraith` (high FM scream in techstep/glitch).
- Breaks: `apache` (main, `loopAt(2)` + crush/shape), `funkydrummer` (jungle/glitch), `breaks165` sliced 16 (stutter pattern), `dist:4` (techstep/glitch).
- Drums: `hardcore` kit (`:4` kick, `:10`/`:11` snare, `:0` hat, `:6` open hat, `:2` crash); `industrial` metal hits; `glitch` clicks.
- Modes: 0 VOID / 1 JUNGLE / 2 TECHSTEP / 3 GLITCH. Harmony: 0 CLUSTER / 1 DRONE (`padlong` + low drone).
- Audits: verify 0 errors; tension clean; modes kick 8/12/16/20; latch bar 8; gains quiet; doubles none; cpu 26/44/47/57 per bar; live eval ok.
- Samples are lazy: first hit after raising a fader may wait for the GitHub fetch.
