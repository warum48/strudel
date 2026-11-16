# strudel: Status

## Current Phase
Track library. Techno 01–18 (+ 17-v2), dnb 01–02, breakcore 01–02,
IDM 01 and Khmer 01–04 are green.
breakcore/01 exists in two variants (chop 4/8/16/32; 16th fragments with no pitch shift).
breakcore/02 is 200 BPM stems/gabber in F phrygian: parallel dry/wet kick (909 + saturated
band + noise click), metal ring from a tuned feedback delay, synthesized noise textures with
LFO filters (no wind/noise/pad samples), kick clean/dist/hard, 5 modes, 4 pads.
idm/01-splinter is 136 BPM glitch/granular IDM: C–Gb–Db–Bb, 33 tracks, 193 sliders,
8 switches, 6 momentary pads, 8 drum modes (glitch/grain/acid/strip/skitter/
shuffle/poly/fracture; 4–7 use every drum layer), mutate/fill rhythm macros,
grain cloud/scan/freeze/edit with a moving padlong/space/wind/noise2 bank,
pitch −24…+12, 8-bit pulse/square + arp, 303 with selective glide, `numbers`
voice (dry/chop/pitch), sub ≤80 + growl + FM rubber, little reverb.
khmer/01-sathukar is 88 BPM pinpeat / percussion: 27 tracks, 83 sliders,
3 switches (scene/mode/harmony), 6 pads, 7-tone scale c–db–eb–f–gb–ab–bb
plus 5-tone skeleton, roneat ek/thung, kong vong/thom, sralai, skor thom,
sampho, chhing, krap, 4 modes (sathukar/pinpeat/boxing/percussion), no samples.
khmer/02-skors is 96 BPM percussion / xylophones: 16 tracks, 86 sliders,
real samples (Dirt-Samples + VSCO 2 CE CC0), xylo/marimba/gong/claves +
taiko/hand/tabla/metal, scenes change rhythm only (all instruments present),
`// @mutes` row under scenes, no pads, no sralai.
khmer/03-skors-ritual is 76 BPM percussion + low xylophone: 11 tracks, 58 sliders,
skor high .33, sampho low .34 / high .28 / ghost .23, chhing .23 / open .21,
krap .19, fills .18, kong thom .22, roneat low .24; low xylo only, no high xylo/sralai, rhythm-only scenes,
`// @mutes` row, fifth/axis gong latched 8 bars, no pads.
khmer/04-confluence is 108 BPM mix of 01–03: 16 tracks, 79 sliders, 12 rhythm
scenes, percussion/gongs without melodic xylophones, acid bass + arp with
`pace` 4…32, `verb` up to 1.2, `verbSize` up to 16, mutes, no pads.
techno/18-khmer-dub is 122 BPM dub techno + Khmer percussion: 19 tracks (30
percussion channels in one bus), 187 sliders, Fm9→Abmaj9→Dbmaj9→Gbmaj9,
full dub set + Moog lead/arp, 30 Khmer drums through shared delay/reverb,
no melodic Khmer lines.
Reference: `docs/breakcore/`, `docs/idm/` and `docs/khmer/` (RU + EN);
play guides in `docs/breakcore/10-panel.md`, `docs/idm/README.md` and
`docs/khmer/README.md`.

## Key Metrics
- `npm run verify` — 34 tracks load and run, 0 errors.
- breakcore/01 (both variants): verify ok, tension clean, gains silent, cpu ≤20/bar, modes 5/5, live ok.
- breakcore/02: verify ok (20 tracks, 78 sliders), tension clean, gains silent, doubles no collisions,
  cpu ≤19/bar (16/s), modes 5/5, live eval ok (slider sync ok).
- techno/17-halfstep-dub: verify ok (16 tracks, 65 sliders), tension clean, gains silent,
  modes 4/4 (kick 8/4/8/8), latch bar 8, cpu 6/bar (3/s), doubles no collisions,
  live eval ok (slider sync ok).
- techno/17-halfstep-dub-v2: verify ok (17 tracks, 90 sliders), separate low `Moog note` with octave +
  arp with pace 4–16, full Moog note/arp controls, pad.fb regulator, `@scenes` intro/theme,
  tension clean, gains silent, modes 4/4, latch bar 8, cpu 10/bar (4/s),
  doubles no collisions, live eval ok. v1 untouched.
- idm/01-splinter: verify ok (33 tracks, 193 sliders, 130 hits/bar), tension clean
  (140 deliberate tritones under `@dark`), modes 8/8 (kick 16/8/16/4/28/20/24/40,
  snare 12/4/8/0/20/8/16/32), mutate/fill, latch bar 8, gains silent,
  doubles no collisions, cpu 25–28 worklets/bar for modes 0–3 (14–16/s),
  live eval ok (slider sync ok).
- khmer/01-sathukar: verify ok (27 tracks, 83 sliders, 49 hits/bar), tension clean
  (96 deliberate tritones), modes 4/4 (roneat ek 16/0/0/0 and 0/16/16/0,
  thung 6/6/6/0, sralai 0/4/0/0 and 0/0/17/0, skor low 8/16/28/16,
  sam high 8/20/44/20, chhing 8/16/32/16), latch bar 8, gains silent,
  doubles no collisions, cpu 4/bar (1/s), live eval ok (slider sync ok).
- khmer/02-skors: verify ok (16 tracks, 86 sliders, 106 hits/bar), tension clean
  (132 deliberate tritones), modes 4/4 (skor fill 8/20/52/44, sam high 44/44/44/44,
  ghosts 17/12/6/25), latch bar 8, gains silent, doubles no collisions,
  cpu 0/bar (samples only), live eval ok (slider sync ok).
- khmer/03-skors-ritual: verify ok (11 tracks, 58 sliders, 40 hits/bar), tension
  clean (35 deliberate tritones), modes 4/4 (fills 8/20/52/44), latch bar 8,
  gains silent, doubles no collisions, cpu 0/bar, live eval ok.
- khmer/04-confluence: verify ok (16 tracks, 79 sliders, 137 hits/bar), tension
  clean (13 deliberate tritones), modes 4/4, latch bar 8, gains silent, doubles
  no collisions, cpu 0/bar (16/bar, 7/s with acid), live eval ok.
- techno/18-khmer-dub: verify ok (19 tracks, 187 sliders, 186 hits/bar), tension
  clean, modes 4/4, latch bar 8, gains silent, doubles no collisions,
  cpu 15/bar (8/s), live eval ok.
- Panel scenes e2e (headless Chromium): title `STRUDEL EXTENSION`, v2 90 knobs;
  Intro applies 19/19 values, Theme 22/22, Export reports 90, Import applies 2.
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
- idm/01-splinter (136 BPM glitch/granular IDM, 8 switches, 6 pads, docs/idm).
- khmer/01-sathukar (88 BPM pinpeat/percussion, 7-tone + 5-tone skeleton,
  4 modes, 6 pads, docs/khmer).
- khmer/02-skors (96 BPM percussion/xylophones, real Dirt+VSCO samples,
  rhythm-only scenes, `@mutes` row, no pads, docs/khmer).
- khmer/03-skors-ritual (76 BPM percussion + low xylophone, no high xylo/sralai,
  rhythm-only scenes, `@mutes` row, fifth/axis gong, no pads, docs/khmer).
- khmer/04-confluence (108 BPM mix of 01–03, 12 rhythms, acid bass/arp with
  pace, strong reverb, mutes, no pads, docs/khmer).
- techno/18-khmer-dub (122 BPM dub techno + 30 Khmer percussion channels,
  Fm9→Abmaj9→Dbmaj9→Gbmaj9, full dub set + Moog lead/arp, shared delay/reverb, docs/dub-techno).
- Web panel: momentary pads (`// @pads`, keys 1–9), mute buttons (`// @mutes`),
  docs/breakcore + docs/idm + docs/khmer (RU + EN).
- README index and per-track notes.

### 🔄 In Progress
- Nothing. breakcore/01 is complete; do not rewrite it.

### 📋 Next
- Listen to 01 vs 01-slices and decide which one to keep (user: both are interesting for now).
- Tune the 02 kick by ear (`kick` clean/dist/hard, grit values) and the pad set.
- Tune 17-v2 growl, Moog note/arp and `chords.pad.fb` by ear; v1 stays as the reference.
- Tune idm/01 by ear: `grain.cloud.chop` 16–48, `grain.cloud.window`, `bass.growl.cut`,
  `acid.line.glide`, and the 6 pads; keep `verb` low (0.1–0.25).
- Tune khmer/01 by ear: `roneat.ek.decay` 0.1–0.25, `reed.lead.cut` 1500–3000,
  `samLow.cut` 300–800, `samHigh.cut` 1200–3000, `chhing.decay` 0.03–0.08,
  `gong.vong.decay` 1–2.5; keep the sub ≤80 and only in build/main.
- Tune khmer/02 by ear: sample mix (skor/sampho/chhing levels), `mode` swing/roll,
  mute combinations; decide whether to replace VSCO/Dirt with local Khmer recordings.
- Tune khmer/03 by ear: skor/sam pitch and decay, chhing darkness, gong decay;
  keep it sparse and low.
- Tune khmer/04 by ear: 12 scene rhythms, acid cut/res/env/pace, verb/verbSize;
  keep the Khmer layers rhythmic, not melodic.
- Tune techno/18 by ear: 30 percussion channel gains/cuts/clips, percEcho/percVerb,
  stab/organ/skank/horns, Fm/Gb voicings.

### 🔮 Horizon
- A third dnb character (e.g. halftime / autonomic) only as a new file, never as a rewrite of 01/02.
- A second IDM character (e.g. 8-bit/micro-edit or dark ambient glitch) only as a new file.
- A third Khmer character (mahori / arak / boxing standalone) only as a new file.
- Record local Khmer one-shots and swap the 02 sample map; docs/khmer/05-samples.md.

## Gates
A new track is done only when all pass:
`verify`, `tension`, `modes`, `latch`, `gains`, `doubles`, `cpu`, `live`.

## Known Constraints
- Samples lazy-load from GitHub; the first hit after raising a fader may wait for download.
- Node checks have no `samples()`; every track guards sample-map calls with `typeof samples === 'function'`.
- khmer/01 uses no samples at all (synth only); `s("pink")`/`s("white")` are built-in noise.
- khmer/02 uses Dirt-Samples + a custom VSCO 2 CE map; the panel SAMPLES button downloads only `github:` maps, VSCO loads lazily.
- Khmer tuning is approximated in 12-TET; 4/4 and the sub are modern adaptations, documented in `docs/khmer/`.
- Khmer 02 rule: scenes change rhythm only; all instruments stay present. Instrument mutes live in `// @mutes` and no instrument is pad-only.
- Do not rewrite dnb/02. New work = new file.
