# Research Log

## Hypotheses
| ID | Hypothesis | Status | Metric | Target | Result | EXP |
|---|---|---|---|---|---|---|
| H-001 | Bukem atmosphere comes from slow pads over fast breaks, not from a slow tempo | ✅ CONFIRMED | pad movement vs break tempo | pads 4× slower | phreak.fm / Logical Progression analysis | — |
| H-002 | Liquid dnb sits at 170–174 BPM with pads HPF 200 Hz and Rhodes HPF 120 Hz | ✅ CONFIRMED | BPM / HPF | 172 ± 2 | BeatKey liquid guide | — |
| H-003 | Dark dnb is made by dissonance and sound design, not just filtering | ✅ CONFIRMED | tritone / minor 2nd count | intentional | DOA/Grid dark dnb thread; Preset Drive techstep guide | — |

## Confirmed Findings
- LTJ Bukem: breaks at full tempo but mixed back; pads move at quarter speed; melodic bass, not a static sub.
- Liquid dnb: D minor/Dorian, 170–174 BPM, dotted-8 delay, HPF pads 200 Hz, Rhodes 120 Hz.
- Amen: original ~136 BPM, stretched to 160–180; ghost snares, ride on offbeats, 20–25% swing; do not over-chop.
- Dark/techstep: tritone, minor 2nd and 7th; bitcrushed/distorted breaks; industrial kick; distorted Reese 600–800 Hz; FM metal; aggressive kick→bass sidechain.
- IDM: glitch, bit reduction, buffer repeats, stutter, granular/resampling.
- Sample maps: `yaxu/clean-breaks` (amen, think, apache, funkydrummer); `tidalcycles/Dirt-Samples` (amencutup, breaks165, dist, hardcore, industrial, glitch, noise2, padlong, space, jungle, jungbass, hoover).
- `slice` chops and reorders; `chop` plays the slices in order and is the API the Strudel docs describe as granular. v1 used only slice; v2 adds a real chop layer.
- Long grinder variants: LONG (sustain + slow filter), DRIFT (perlin FM/cut + rare octave + jitter), STUTTER (ply/degrade + bitcrush). All use the same per-mode note phrases.
- Sample downloader scope: track-declared maps + uzu-drumkit, used keys only; `fetchSampleMap` resolves JSON, `loadBuffer` fills the engine buffer cache. Downloading the whole Dirt-Samples JSON library would be hundreds of MB and is not needed.
- Minimal dub techno (Tunary / Studio Brootle / House of Loop / Basic Channel): 120–130 BPM; muted 4/4 kick; soft offbeat hats; one short filtered chord stab into long delay/reverb; deep sub; hiss/field recordings; slow filter/feedback moves over 8/16/32 bars; no new sections.
- Dub delay: feedback ~40–65%, filter the repeats, keep the dry stab louder than the echo; at 120 BPM dotted-quarter delay = 0.375 cycles.
- Anti-pop rules applied to techno/16: bass cut max 80, kick lpf 260, no melody/303, no snare backbeat, no sidechain/riser/drop, bII/9 instead of 1–2–4–5.

## Genre Recipe Library (saved 2026-11-15)

Source pattern for every entry: ingredients → processing → arrangement. Verified pages were read, not just listed.

### Core recurring sources
- Attack Magazine — Beat Dissected: https://www.attackmagazine.com/technique/beat-dissected/ (exact "6 samples + chain + pattern" format).
- BeatKey genre guides: https://beatkey.app/genre-production-guide (BPM/key/grid/sidechain/bar arrangement per genre).
- DNB Academy: https://app.dnbacademy.net/learn (jungle/dnb step-by-step with settings).
- Studio Brootle: https://www.studiobrootle.com/studio-technique/ (techno/IDM techniques + free Ableton racks).
- DOA The Grid: https://www.dogsonacid.com/forums/the-grid/ (dark dnb / techstep / break science).

### IDM
- Studio Brootle — How To Make An IDM Beat: 114 BPM, 3 LinnDrum samples + 3 Operators; randomness via Follow Actions and Velocity→random (amount 45) modulating FM amount, filter and envelope; Beat Repeat stutter; ping-pong; heavy sub. https://www.studiobrootle.com/how-to-make-an-idm-beat-aphex-twin-autechre-influenced/
- Studio Brootle — IDM Techniques hub: https://www.studiobrootle.com/idm-techniques/
- Sonic State / Felix Fleer — How To Create IDM (synth design, drum processing, glitches): https://sonicstate.com/news/2023/02/18/how-to-create-idm/
- Side Brain — IDM/Braindance: https://sidebrain.net/product/idm/
- GitHub idm-course — 12-week reverse-engineering (Aphex, Autechre, Squarepusher, Burial): https://github.com/ZacharySBrown/idm-course

### Trip hop
- BeatKey — Trip Hop: 70–100 BPM, slowed heavy breaks, dark cinematic samples, sub, vinyl texture. https://beatkey.app/how-to-make-trip-hop-music
- MusicRadar — build your own trip-hop beat instead of loops: https://www.musicradar.com/tutorials/music-production-tutorials/ditch-the-loops-and-build-your-own-trip-hop-beat
- Reason — trip-hop drums cheat sheet (loops vs custom kit): https://www.reasonstudios.com/news/post/trip-hop-drums-super-neat-beat-cheat-sheet
- Studio Brootle — VCV Rack "Trip Hop-ish One": https://www.studiobrootle.com/vcv-rack-patch-trip-hop-ish-one/

### Drum & bass
- BeatKey — Drum and Bass: 160–180 BPM, Amen chopping, Reese, liquid/neurofunk, mix. https://beatkey.app/how-to-make-drum-and-bass
- DNB Academy — How to Make Drum and Bass: 174, two-step, sub + mid bass, chords, arrangement, mixdown. https://app.dnbacademy.net/learn/how-to-make-drum-and-bass
- DNB Academy — Reese bass history/synthesis (detuned saws, notch, multiband, mono sub): https://app.dnbacademy.net/learn/how-to-make-reese-bass
- TrackSensei — mixing DnB at 174 (mono sub, kick layering, loudness): https://tracksensei.com/blog/how-to-mix-drum-and-bass

### Jungle
- DNB Academy — How to Make Jungle: 160–175 BPM; slice Amen; re-pitch copies at −5/+5 instead of stacking different breaks; ghost snares; mono sub below 140 Hz; 10 bass recipes (808, drop, old/new reese, warp, foghorn, noise); 16-bar phrases; wide wet intro → dry mono-sub drop; hard cut before second drop. https://app.dnbacademy.net/learn/how-to-make-jungle
- Transmission Samples — Stranjah Amen tutorial (slicing and re-sequencing, not looping): https://www.transmissionsamples.com/tutorials/drum-and-bass-production/drum-and-bass-jungle-stranjah-part-2
- Attack — Slicing Breakbeats Like Nia Archives: https://www.attackmagazine.com/technique/beat-dissected/
- Producer Hub — jungle guide (Amen slices, rolling sub, arrangement): https://producerhub.co.uk/blog/how-to-make-jungle/

### Hard techno / schranz
- Studio Brootle — Hard Techno Bass Gallop: 909 4/4 kick; copy the kick as an offbeat double; both into one distorted group (Amp + Drum Buss + Amp); filter off the punch; synced delay; sidechain gallop to the main kick. Sara Landry / Chris Liebing reference. https://www.studiobrootle.com/techno-technique-hard-techno-bass-gallop/
- Studio Brootle — Techno Kicks And Rumbles hub: https://www.studiobrootle.com/techno-kicks-and-rumbles/
- Attack — Dark Techno Rumble, Dark Cinematic Hypnotic Techno (Paula Temple), Rolling Techno, Industrial Techno, Techno like Dave Clarke.
- Studio Brootle — Movement In Techno Sequences (3 LFOs instead of new notes): https://www.studiobrootle.com/movement-in-techno-sequences/

### Trance
- BeatKey — Trance: 128–145 BPM (sweet spot 138); 4/4 + offbeat open hat; supersaw = 7 voices, unison spread 0.35–0.55, detune 15–25 cents, HPF 200; 16th arpeggio; sidechain 1 ms attack / 80–120 ms release; breakdown 32–64 bars; −9…−7 LUFS club master. https://beatkey.app/how-to-make-trance-music
- BeatKey — Hardstyle (boundary reference: 150 BPM + reverse bass): https://beatkey.app/how-to-make-hardstyle-music
- Attack — Dana Montana Inspired Techno ("90s techno + trance").
- Sonic Academy — trance deconstructions: https://www.sonicacademy.com/courses/genres/trance

### Gabber / hardcore
- BeatKey — Gabber: 160–200 BPM; kick = sine + pitch envelope 200–500 Hz → root in 10–50 ms + hard clip 6–18 dB (square-ish); kick tuned to root (A1 = 55 Hz); NO reverse bass; acid 303 line above 60–80 Hz; short breaks instead of drops; DJ intro/outro = kick only; −8…−5 LUFS. https://beatkey.app/how-to-make-gabber-music

### Breakcore — forum digest
Technique consensus from lllllllll.co #5102, elektronauts, idmforums, forum.renoise.com:
- Chop coarse: 8th/quarter grid beats per-hit slicing; "over-chopping" is the named beginner failure. Do not warp chops to the grid — "warp is the groove killer".
- Micro-slicing is a distinct style: keep only the peak plus a little around it, play ~160 BPM interleaved with other sounds.
- Slice count as composition: a non-multiple count (e.g. 13 slices over a 4-bar loop) deliberately breaks phrasing; M8/Renoise make this trivial.
- Renoise: `09xx` sample-offset instead of pre-sliced hits; Phrases as a sub-sequencer with automatable BPM/LPB for micro-timing; shared `.xrns` "rinse technique" file as the canonical breakcore demo.
- Velocity-as-slice-selector (Tonverk, 16 slices × velocity layers): velocity ramp = normal playback, velocity random = generative variation. Same trick on Digitakt Slice Machine + random locks.
- Octatrack: slice + LFO-driven slice selection, retrig, freeze delay, LoFi effect (reduced sample rate/bit depth) for grit.
- Rolls/retriggers layered over chops are the DnB/jungle phrasing glue; limiter is part of the classic chopped-break sound.
- Generative branch: BBCut (SuperCollider, Nick Collins), Tidal Cycles, Conductive; consensus warning — fractal/generative beats need fine control or they become "abstruse".
- Historical anchor: Aphex used ReCycle for slicing; Venetian Snares reference = intricate patterns that still read as drums (mix non-drum sounds into the break).
- Sample sources named on forums: "101 breaks", "Declassified breaks", 16-slice Amen packs; breakcore.com.au sample swaps.
- Full reference + 34 raw thread transcripts live in `docs/breakcore/` (RU `README.md` → `01`…`09`; EN copies are the same names with `.en.md`; raw transcripts in `threads/*.md`).

Breakcore source links:
- lllllllll.co — Breakcore glitch drums (37 posts): https://llllllll.co/t/breakcore-glitch-drums/5102
- Renoise — Breakcore Rinse Technique .xrns: https://forum.renoise.com/t/breakcore-rinse-technique-xrns/29927
- Renoise — 09xx Effect Breakcore Demos: https://forum.renoise.com/t/09xx-effect-breakcore-demos/20448
- Renoise — Made a breakcore tutorial (+xrns): https://forum.renoise.com/t/made-a-breakcore-tutorial-xrns/68373
- Renoise — Making Intricate Breakcore/IDM: https://forum.renoise.com/t/making-intricate-breakcore-idm/34022
- Elektronauts — Chopping Drum Breaks: https://www.elektronauts.com/t/chopping-drum-breaks/175570
- Elektronauts — What's the sequencing theory in IDM?: https://www.elektronauts.com/t/whats-the-sequencing-theory-in-idm/173927
- Elektronauts — Generative breakbeat slices (continuous variation): https://www.elektronauts.com/t/trying-to-reproduce-this-generative-breakbeat-slices-continuous-variation-trick-but/256454
- IDMForums — What is Breakcore? / Challenge #6: https://idmforums.com/t/what-is-breakcore/386 , https://idmforums.com/t/challenge-6-breakcore-complex/6643

### Repo mapping
- Already covered: dub techno minimalism (techno/16), gabber kick (techno/13), atmospheric jungle (dnb/01), dark techstep/IDM (dnb/02).
- Not yet covered: trance supersaw/breakdown, hard-techno gallop, trip hop, breakcore micro-slicing + odd meters. Any new one = new file, never a rewrite of dnb/01–02.
- Strudel primitives that map 1:1: `slice`/`chop` (granular), `ply` (retrig/rolls), `degrade` (generative variation), `sometimes`/`rarely` (velocity-random analogue), `speed` (re-pitch copies), `lpf`+`room` (gabber/dub chains).

## Current Experiment
None.
