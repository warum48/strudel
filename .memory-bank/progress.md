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
- Panel: static tab title `STRUDEL EXTENSION`; new Scenes/JSON bar. `// @scenes` drives Intro/Theme; Export downloads `{track,values,scenes}`, Import applies values and can replace scenes. v2 e2e: 90 knobs, Intro 19/19, Theme 22/22, Export 90, Import 2.

## 2026-11-15 — dub techno docs
- Extracted the dub-techno research and recipes from `docs/thoughts/dub_session.md` into `docs/dub-techno/`.
- Added `README.md` (playbook), `sources.md` (guides + listening canon), `strudel-recipes.md` (code: chords, sub ≤80, dub stab, pad, hats, modes, audits).
- Linked the folder from `docs/references.md` and the README tree.

## 2026-11-15 — techno/16 sub sustain
- Added `bass.sub.sustain` (0.85) and `release` (0.6), raised decay to 1.0, +25 % sub gain.
- Reason: 8th-note event length + short release made the sub feel dotted/disappearing between hits.
- Audits: verify 49 sliders, gains silent, live eval ok.

## 2026-11-15 — idm/01-splinter + docs/idm
- Added `tracks/idm/01-splinter.js`: 136 BPM glitch/granular IDM in the 17-v2 tree/panel style.
  C–Gb–Db–Bb axis; PAD A = tritone dyads, PAD B = fifths+9; `@dark` allows anchored tritones, no minor seconds.
  33 tracks, 193 sliders, 8 switches (`scene`/`mode`/`grainMode`/`grainSrc`/`bitMode`/`acidMode`/`voxMode`/`harmony`),
  6 momentary pads (`padRoll`/`padCut`/`padFreeze`/`padBurst`/`padAcid`/`padDrop`), `@scenes` intro/theme.
- Modes: 8 grids (`glitch`/`grain`/`acid`/`strip`/`skitter`/`shuffle`/`poly`/`fracture`); 4–7 use every drum layer.
- Mutation: `mutate` keeps random ghost snare/hat/glitch hits, `fill` adds a 32nd snare fill on the last beat.
- Granular: cloud (`chop` 32 + begin/end + density), scan (sine position), freeze (pad), edit (`slice` micro-montage).
  Source bank `padlong/space/wind/noise2`: `grainSrc=auto` changes it every 4 bars; pitch −24…+12 on all four layers.
- 8-bit: pulse lead + square `arp(run(8/16/32))` + noise blips, `crush` by `bitMode`.
- Acid: default `acidMode=2` (line + octave run), cut 1400/res 12/env 3.2/drive 1.1 so it cuts through;
  sparse and scream still available.
- Vox: `numbers` spoken digits 0–8, one word per bar, `voxMode` off/dry/chop/pitch.
- Bass: sub ≤80 + growl (two saws, LFO, shape) + FM rubber (triangle + FM).
- Docs: `docs/idm/` (README, techniques, arrangement, Strudel, sources; RU + EN) + README index/prose.
- Audits: verify 29 tracks / idm 33 tracks / 130 hits / 193 sliders, tension clean (140 deliberate tritones),
  modes 8/8 (4–7 all layers), latch bar 8, gains silent, doubles no collisions, cpu 28/bar (16/s), live eval ok.

## 2026-11-15 — revert 16 sub tweak; 17-v2 sub comments
- Reverted the 16-minimal-dub sub sustain/release/boost changes; back to 47 sliders, original 0.6/0.3 envelope.
- 17-halfstep-dub-v2: added comments that an inaudible sub should be raised (`bass.sub.vol`), because the growl starts on the same beat/note every second bar and masks it.
- Audits: 16 verify 47 sliders + gains silent; 17-v2 verify 90 sliders.

## 2026-11-16 — khmer/01-sathukar + docs/khmer
- Researched Khmer music: pinpeat line-ups and roles, roneat ek/thung/dek,
  kong vong/thom, sralai (quadruple reed, ensemble tunes to it), sampho
  (ting/tip/theung/tup, leads), skor thom (tight/loose pair), chhing
  (timekeeper, closed accent + open "ching"), krap; 7-tone near-equidistant
  scale (~171.4 cents; Ellis 1885, disputed by Garzoli 2015), 5- and 7-note
  scales, no absolute pitch; colotomy and heterophony; Sathukar as an opening
  piece; boxing music (sralai + sampho + chhing, rubato → fast metred).
- Added `tracks/khmer/01-sathukar.js`: 88 BPM, 27 tracks, 83 sliders,
  3 switches (`scene`/`mode`/`harmony`), 6 pads, 4 modes
  (sathukar/pinpeat/boxing/percussion), 2 `@scenes` (Intro/Theme).
  Scale: `c db eb f gb ab bb` (7 tones) + `c eb f g bb` (5-tone skeleton).
  Instruments: roneat ek (triangle + partials + penv), thung (sine, octave
  down), kong vong/thom (sine + FM), sralai (saw + unison + 24db + shape),
  skor thom low/high, sampho low/high/ghost, chhing closed/open, krap, fills.
  No samples; drone C–G / C–Gb latched every 8 bars; sub ≤80 only build/main.
- Fixed a Strudel 1.2.6 gotcha: `.add(slider)` on a note pattern warns
  "Can't do arithmetic on control pattern"; use `.add(note(slider))`.
- Docs: `docs/khmer/` (README, instruments, tuning/rhythm, Strudel, sources;
  RU + EN) + README index/prose + `docs/references.md` links.
- Audits: verify 27 tracks / 83 sliders / 49 hits/bar, tension clean
  (96 deliberate tritones), modes 4/4, latch bar 8, gains silent,
  doubles no collisions, cpu 4/bar (1/s), live eval ok (slider sync ok).

## 2026-11-16 — khmer/02-skors + samples + mutes
- Added `tracks/khmer/02-skors.js`: 96 BPM percussion/xylophones, 16 tracks,
  86 sliders, no sralai, no pads. Real samples: Dirt-Samples (`east` taiko,
  `hand`, `tabla`, `metal`) + VSCO 2 CE (CC0: xylo, marimba, gong, claves).
- New control rule: `scene` 0–4 changes rhythm only; all instruments are present
  in every scene. Added `// @mutes` row under scenes (ordinary 0/1 buttons for
  skor/sampho/chhing/krap/gong/xylo/thung), not momentary. No pad-only parts;
  `mode` = fill/ghost/swing, `harmony` = fifth/axis latched 8 bars.
- Web panel: `#mutes` container + `scanMuteNames`/`renderMutes`; CSS for mute
  buttons; `// @mutes` documented in README.
- Docs: `docs/khmer/05-samples.md` (RU+EN) — what real samples exist, what 02
  uses, why no Khmer bank, how to swap local recordings. Updated khmer README,
  03-strudel, references, project README.
- Audits: verify 31 tracks total / 02 16 tracks / 86 sliders / 106 hits/bar,
  tension clean (132 deliberate tritones), modes 4/4, latch bar 8, gains silent,
  doubles no collisions, cpu 0/bar, live eval ok.
- Panel e2e (headless Chromium, khmer/02): 7 mute buttons, 60 TONE rows
  (Drums 40 / Gongs 8 / Xylophones 12), 15 MIXER rows, 0 pads.

## 2026-11-16 — khmer/03-skors-ritual
- Added `tracks/khmer/03-skors-ritual.js`: 76 BPM percussion + low xylophone, 11 tracks,
  58 sliders, no high melodic lines/sralai. Skor high .33,
  sampho low .34 / high .28 / ghost .23, chhing .23 / open .21, krap .19,
  fills .18, kong thom .22; lower tuning (skor/sam −2), longer tails.
- Scenes 0–3 (procession/invocation/trance/lament) change rhythm only; all
  instruments present. `// @mutes` row (skor/sampho/chhing/krap/gong), no pads.
  `mode` = fill/ghost/swing; `harmony` = fifth/axis gong latched 8 bars.
- Docs: khmer README (RU+EN), project README, references, memory bank.
- Audits: verify 11 tracks / 58 sliders / 40 hits/bar, tension clean
  (35 deliberate tritones), modes 4/4 (fills 8/20/52/44), latch bar 8,
  gains silent, doubles no collisions, cpu 0/bar, live eval ok.

## 2026-11-16 — 03 low xylophone
- Added `xylo.low` to `khmer/03-skors-ritual.js`: real VSCO marimba samples,
  `octave` 0/1/2 = 0/−1/−2, volume 0.24, `muteLow`. New LOW 8-bar phrase;
  no high xylophone lines. Track now 11 tracks / 58 sliders / 40 hits/bar.
- Audits: tension clean (35 deliberate tritones), modes 4/4, latch bar 8,
  gains silent, doubles no collisions, cpu 0/bar, live eval ok.

## 2026-11-16 — khmer/04-confluence
- Added `tracks/khmer/04-confluence.js`: 108 BPM mix of 01–03, 16 tracks,
  79 sliders, 12 rhythm scenes. Percussion/gongs from 01–03, no melodic
  xylophones. `verb` up to 1.2, `verbSize` up to 16.
- 12 rhythms via 12-cell SKOR/SAM/CHHING arrays; high/open shifted, ghost/roll
  `ply`/`degrade`. Khmer layers are ostinato/rhythm only.
- Acid section: `acid` 0/1, acid bass (`fast(pace/16)`) and acid arp
  (`arp(run(pace))`), both `pace` 4…32. Tested with acid on: 16 worklets/bar (7/s).
- Audits: verify 16 tracks / 79 sliders / 137 hits/bar, tension clean
  (13 deliberate tritones), modes 4/4, latch bar 8, gains silent, doubles no
  collisions, cpu 0/bar without acid, live eval ok.

## 2026-11-15 — idm/01 theme preset from dump
- Replaced `@scenes.theme` in `tracks/idm/01-splinter.js` with the exported
  `dumps/idm-01-splinter-2026-11-15-20-13-18.json` `values` (193 keys).
- Theme now restores: `scene 2`, `mode 1` (grain), `grainSrc 2` (space),
  `bitMode 2` (coarse), `acidMode 1` (sparse), `voxMode 2` (chop), plus all
  instrument/mix/mutation values.
- Audits: verify 33 tracks / 193 sliders / 130 hits, live eval ok.

## 2026-11-16 — techno/18-khmer-dub
- Added `tracks/techno/18-khmer-dub.js`: 122 BPM dub techno + Khmer percussion.
  Fm9 → Gbmaj9 (bII), full dub set (kick/hat/rim/click/shaker, sub/dub,
  pad/stab/organ/skank/horns, hiss/air/field, delay/reverb) + 30 Khmer
  percussion channels (skor/sampho/chhing/krap/kong/wood) as one bus through
  a shared delay/reverb. 17 tracks, 158 sliders, 177 hits/bar.
- Tension fixes: moved Gb maj7 color, changed BASS db2→ab1, removed pad f
  from Gb to avoid m2 with skank; tension clean.
- Audits: verify 17 tracks / 158 sliders / 177 hits/bar, tension clean,
  modes 4/4, latch bar 8, gains silent, doubles no collisions,
  cpu 6/bar (3/s), live eval ok.
- 18 revision: shortened pad envelope (attack 1.2/2, release 3.5/5, lower
  volume/send), moved harmony to Fm9→Abmaj9→Dbmaj9→Gbmaj9 (4 chords, 9ths),
  darker stab, added Moog lead + arp in the spirit of 17 with new notes.
  Fixed minor seconds/tritones in the new voicings. Now 19 tracks / 187 sliders
  / 186 hits, cpu 15/bar (8/s), live ok.
- 18 cleanup + timeline: removed skorLow A/B, krap, all gongs, woodblock/shime;
  now 18 Khmer channels, 149 sliders, 142 hits. Added `percLevel` global and
  `@timeline` (5 sections / 64 bars) with panel editor: horizontal collapsible
  track, section blocks, inspector for name/at/length/targets, playhead, and
  playback via scheduler.now() applying values at section boundaries. Verified
  e2e: DUB section applies at bar 8 (kick 0.36); full verify 34 files.
- Fixed timeline section-boundary dropout: removed effect-bus and switch
  targets (verb/verbSize/percEcho/percVerb/mode/harmony) from @timeline; added
  light `applyTimelineValues` that updates only 11 instrument levels and never
  re-renders the whole 149-slider sidebar. Section changes no longer restart the
  UI or reset reverb/delay tails.
- Switched 18 to a native Strudel timeline: `const TIMELINE = JSON.parse('…')`
  + `tlCurve`/`arrange`; values are multipliers over hot sliders. Works in
  ordinary Strudel; panel edits the table and applies on Ctrl+Enter. Discovered
  strudel.cc transpiler rejects double-quoted JS strings in code; use JSON.parse
  with a single-quoted string. Panel parses/writes that literal; section gains
  verified (kick 0 at bar 0, 0.36 at bar 8).
- Panel: added APPLY/LOOP/STOP to the timeline header. LOOP wraps playhead
  modulo TL_TOTAL; LOOP off stops at the end. APPLY re-evaluates the track.
- Mixer: per-instrument M/S buttons on all 35 channels. Mute/solo send
  effective `cm-slider` values to the engine and do not rewrite track code.
- Native timeline remains source of truth; Ctrl+Enter/APPLY applies table edits.
- Timeline sections now reflow: length edit shifts `at` of all following;
  up/down reorder; `at` is read-only. Ruler click seeks (native scheduler
  cursor hack; visual + audio while playing, pending when stopped).
- Panel e2e: DUB length 16→20 shifted BREAK 24→28, DUB2 32→36, OUT 48→52;
  seek to bar 7 moved scheduler and playhead.
- Mixer G buttons: explicit `mute:` field on Khmer instruments maps each channel
  to muteSkor/muteSampho/muteChhing. G sits next to M/S, colored per group;
  toggling writes the group mute slider (native/hot). Top @mutes row hides when
  all group mutes are linked. E2E: 18 G buttons, 3 colors, skor G toggles all 4.
- Timeline is now a readable multiline `const TIMELINE = [{ at, len, name, values }]`
  object array (single-quoted strings). Panel parses it with a balanced-bracket
  extractor + Function, writes it back pretty-printed. Verified live eval and
  panel reflow; no more one-line JSON string.

## 2026-11-16 — experimental/01-complex-bass
- Added `tracks/experimental/01-complex-bass.js`: 92 BPM Buchla-style complex
  bass. 5 pairs = 10 oscillators: wt_dbass+sine, wt_distorted+saw,
  wt_ebass+square, wt_raw+triangle, wt_bitreduced+sine. 5 control LFOs +
  drone + dirt; 14 tracks, 148 sliders.
- FM/AM inside each pair (2-op), WT `wt`/`warp` scanned by LFO, FM voice
  ducks WT via `duckorbit`; `.shape` waveshaping; modes clean/grit/fold/scream.
- Dark wavetables only (no flute/birds/vgame); D1…G2 bass, @dark.
- Docs: `docs/experimental/` (README, Buchla, track, Strudel, sources; RU+EN);
  README/references/memory bank.
- Audits: verify 14 tracks / 148 sliders / 34 hits, tension clean (37 deliberate
  tritones), modes air 4/12/24/28, latch bar 8, gains silent, doubles no
  collisions, cpu 24/bar (9/s), live ok.
- Riff pass: replaced per-pair melodic phrases with 12 selectable 16-step
  acid riffs (acid/roll/dnb/prod/off/oct/stair/two/pedal/stab/skip/crawl).
  All 10 bass layers play the same `RIFF`; `riff` 0…11 switches the pattern,
  not timbre. Added shared ACCENT pattern, WT slide, BPM 160. Counts now
  154 sliders / 96 hits / 90 worklets per bar (60/s).
- Added hardcore `bd*4` kick on every beat + `sub` body layer; counts now
  16 tracks / 165 sliders / 104 hits, cpu 102/bar (68/s), live ok.
- Fixed mute/solo slider IDs: use `w.originalFrom` (the engine's slider id)
  instead of mapped `w.from`; applyMixerState is forced only on M/S changes,
  so play no longer sends all volumes / jumps to midpoint. E2E: 13 M buttons,
  13 unique ids, all values 0, no mid values after PLAY.
- Added hardcore hats (hh 16ths, oh offbeats) and `sidechain` saw ducking
  of all WT/FM basses from the 4-on-floor kick. Counts now 18 tracks /
  191 sliders / 116 hits, cpu 112/bar (75/s). Panel gates make mute remove
  events; default panel state is all volumes 0 + M on.
- Added per-bass octave switch `oct` 0…4 (0=as is, 1…4=+1…+4 octaves)
  to all 10 WT/FM basses; sliders now 201. Defaults 0; live/doubles/cpu pass.
- Modes now change kick and hats too: 0 quarter hats + 4-on-floor, 1 8th hats,
  2 broken 16ths, 3 hardcore 16ths + kick only on beat 4 of every 2nd bar.
  Default mode 0; verify 108 hits. Panel default zero/mute unchanged.
- Replaced the LFO-saw sidechain with a true one: `duckorbit(7)` on the kick,
  all 10 WT/FM basses moved to orbit 7, depth = `sidechain`, attack 0.02.
  Removed per-bass `duck` sliders (201 → 196).
- Added `pace` 4…32 to each of the 10 basses (`note(RIFF).fast(pace / 16)`;
  16 = 1×, 4 = 4× slower, 32 = 2× faster; independent per bass). Sliders now
  206. verify: 18 tracks / 106 hits / 206 sliders; cpu 112/bar (75/s), ~150/s
  at max pace; doubles/gains/tension/modes/latch/live unchanged.
