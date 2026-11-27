# Research Log

## Hypotheses
| ID | Hypothesis | Status | Metric | Target | Result | EXP |
|---|---|---|---|---|---|---|
| H-001 | Bukem atmosphere comes from slow pads over fast breaks, not from a slow tempo | ✅ CONFIRMED | pad movement vs break tempo | pads 4× slower | phreak.fm / Logical Progression analysis | — |
| H-002 | Liquid dnb sits at 170–174 BPM with pads HPF 200 Hz and Rhodes HPF 120 Hz | ✅ CONFIRMED | BPM / HPF | 172 ± 2 | BeatKey liquid guide | — |
| H-003 | Dark dnb is made by dissonance and sound design, not just filtering | ✅ CONFIRMED | tritone / minor 2nd count | intentional | DOA/Grid dark dnb thread; Preset Drive techstep guide | — |
| H-004 | IDM coherence comes from sparse layers + meticulous sequencing, not random generation | ✅ CONFIRMED | foreground layers / deterministic kick | ≤4 layers; kick deterministic | Elektronauts 173927; Studio Brootle IDM guides | — |
| H-005 | Granular IDM in Strudel = `chop`/`slice`/`begin`/`end`, and the cloud must stay dry | ✅ CONFIRMED | cloud room send | ≤0.2 | SOS granular; idm/01 cloud room 0.2 | — |
| H-006 | Fat rough bass = sub ≤80 + separate mid growl + FM rubber; `shape` before `gain` | ✅ CONFIRMED | sub cut / growl band / FM ratio | sub ≤80; growl 150–400; ratio 1.2–2.5 | idm/01 bass tree; docs/rules.md | — |
| H-007 | Khmer pinpeat can be adapted as cycle + heterophony + 7-tone scale, with percussion carrying the form and no Western chords | ✅ CONFIRMED | modes / tension / cpu / live | 4 modes, no tension, ≤20 worklets/bar | khmer/01-sathukar; docs/khmer | — |
| H-008 | Real samples beat synthesis for Khmer percussion/xylophones; rhythm-only scenes + manual mutes are a better performance model than scene gating/pads | ✅ CONFIRMED | verify / modes / latch / live; sample count | 16 tracks, 26 sliders, 0 worklets, no pad-only parts | khmer/02-skors; docs/khmer/05-samples | — |
| H-009 | A serious/ethnic Khmer percussion track works better with no high melodic lines: low drums, dark chhing, sparse krap, low gong only | ✅ CONFIRMED | register / density / modes / live | 11 tracks, 58 sliders, 40 hits/bar, 0 worklets | khmer/03-skors-ritual | — |
| H-010 | A mix of Khmer percussion + acid bass/arp can coexist if Khmer layers stay rhythmic and acid is a separate section with `pace` | ✅ CONFIRMED | verify / tension / latch / cpu / live | 16 tracks, 79 sliders, 12 scenes, 16 worklets/bar with acid | khmer/04-confluence | — |
| H-011 | Dub techno can carry 18 Khmer percussion channels if they share one delay/reverb bus; Fm9→Abmaj9→Dbmaj9→Gbmaj9 voicings avoid tension | ✅ CONFIRMED | tracks / sliders / tension / cpu / live | 19 tracks, 149 sliders, 18 perc channels, 15 worklets/bar | techno/18-khmer-dub | — |
| H-012 | A Buchla-style complex-bass track with 5 WT+FM pairs can be fat and gritty without cartoon timbres; FM inside the voice, WT scan/ducking between pairs | ✅ CONFIRMED | tracks / sliders / tension / modes / live | 18 tracks, 206 sliders, 106 hits/bar, 112 worklets/bar (150/s at pace 32) | experimental/01-complex-bass; docs/experimental | — |
| H-013 | Big beat can be adapted to this synth-only project: compressed break hook + 909-style programmed layer + one acid line + build/drop events at 118–132 BPM, with no vocals and no lifted samples | ✅ CONFIRMED | verify / tension / gains / doubles / cpu / levels on a new `tracks/bigbeat/` file | verify 0, 16 lanes / 21 hits per bar / 28 sliders; gains silent at zero; doubles no overlaps; CPU 8 worklets/bar = 4/s; levels bar 36 lead 0.84 vs acid 1.2 | `tracks/bigbeat/01-acid-breaks.js` — 125 BPM, C minor, 72 bars, 8 sections + 1-bar STOP; docs/bigbeat/ + new-tricks | — |

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
- Minimal dub techno (Tunary / Studio Brootle / House of Loop / Basic Channel): 120–130 BPM; muted 4/4 kick; soft offbeat hats; one short chord stab into long delay/reverb; deep sub; hiss/field recordings; slow filter/feedback moves over 8/16/32 bars; no new sections.
- IDM (Elektronauts 173927, Studio Brootle, SOS granular): complexity from manual sequencing, not layer count; randomness only on textures; melody as rhythm, rhythm as melody; micro-slicing (peak + a little around); grains 1–100 ms; transient flamming is the main granular failure; 8-bit = pulse duty + fast arps + noise channel; acid = selective glide, accent = louder+brighter, sparse wide intervals; space = short reverb + delay/pan.
- IDM track recipe: 130–140 BPM; 3–4 foreground layers; 8 switches + 6 momentary pads; 8 drum modes (4–7 use every layer); `mutate` ghosts + `fill` roll as rhythm macros; grain cloud (chop 32, dry), scan (sine position), freeze (pad), edit (slice); moving source bank `padlong/space/wind/noise2`; pitch −24…+12; 8-bit lead/arp (pulse/square + crush); sparse 303; spoken `numbers` voice (dry/chop/pitch); sub ≤80 + growl 150–400 + FM rubber; tritone axis with `@dark`, no minor 2nd; little reverb.
- Dub delay: feedback ~40–65%, filter the repeats, keep the dry stab louder than the echo; at 120 BPM dotted-quarter delay = 0.375 cycles.
- Anti-pop rules applied to techno/16: bass cut max 80, kick lpf 260, no melody/303, no snare backbeat, no sidechain/riser/drop, bII/9 instead of 1–2–4–5.
- Khmer pinpeat: seven tones per octave near equal (~171.4 cents; Ellis 1885, disputed by Garzoli 2015); no absolute pitch, ensemble tunes to the sralai; 21-bar roneat = 3 octaves; 5- and 7-note scales in use; heterophony + colotomy, not chord harmony.
- Khmer instruments/roles: roneat ek lead, roneat thung skeleton, kong vong/thom support, sralai only wind (quadruple reed, circular breathing), sampho leads (ting/tip/theung/tup), skor thom tight/loose pair, chhing timekeeper (closed accent + open "ching"), krap rare.
- Khmer form: `Sathukar` is an opening piece, not a genre; `bot` pieces for the Reamker; boxing music = sralai + sampho + chhing, slow rubato then fast metred and accelerating.
- Khmer adaptation recipe: 88 BPM 4/4 grid; 8-bar phrase; 7-tone `c db eb f gb ab bb` + 5-tone skeleton `c eb f g bb`; drone C–G / C–Gb latched 8 bars; roneat ek/thung + kong vong + sralai + skor thom + sampho + chhing + krap; 4 modes (sathukar/pinpeat/boxing/percussion); no samples; sub ≤80 only in build/main.
- Real-sample Khmer recipe (02): 96 BPM; Dirt-Samples (`east` taiko, `hand`, `tabla`, `metal`) + VSCO 2 CE CC0 (xylo, marimba, gong, claves); no sralai; scenes = rhythm patterns only, all instruments present; `// @mutes` 0/1 buttons under scenes; no pads/pad-only parts; `mode` = fill/ghost/swing; `harmony` = fifth/axis latched 8 bars; 0 worklets.
- Sample reality check: no public Khmer one-shot bank found; Dirt-Samples has no Khmer instruments; VSCO is Western orchestral; Roneat Studio Pro ships mock samples; Sounds of Angkor has videos, not one-shots; best path = local recordings mapped via `samples({...})` (docs/khmer/05-samples.md).
- Serious/ethnic Khmer percussion recipe (03): 76 BPM; skor high + sampho low/high/ghost + chhing/open + krap + fills + low kong thom; lower tuning (skor/sam −2), long tails, dark chhing, rare krap; low xylophone only (marimba, octave 0/1/2), no high xylophones/sralai/high melodic lines; scenes rhythm-only; mutes manual; gong fifth/axis latched. Volumes from 01: .33/.34/.28/.23/.23/.21/.19/.18 + gong .22.
- Mix + acid recipe (04): 108 BPM; SKOR/SAM/CHHING 12 cells each, high/open shifted, ghost/roll `ply`/`degrade`; all Khmer layers ostinato/rhythm, no melodic xylo; acid bass `fast(pace/16)` + acid arp `arp(run(pace))`, `pace` 4…32; `verb` 1.2, `verbSize` 16; 0 worklets without acid, 16/bar with acid.
- Khmer dub recipe (18): 122 BPM; Fm9→Abmaj9→Dbmaj9→Gbmaj9 (roots f ab db gb); full dub set (kick/hat/rim/click/shaker, sub/dub, pad/stab/organ/skank/horns, hiss/air/field, delay/reverb); 18 Khmer perc channels as one stack through shared delay/reverb; vol/cut/clip per channel; 6 group mutes; no melodic Khmer lines. `tension` clean, 15 worklets/bar; short pad (not a 5-bar hum) + Moog lead/arp in the spirit of 17.
- Buchla complex-bass recipe (experimental/01): 160 BPM; 5 pairs of dark WT + 2-op FM; LFO scans WT pos/warp and FM index; all basses on orbit 7, kick ducks it via `duckorbit(7)`; each bass has oct 0…4 and pace 4…32; `.shape`/`warp` waveshaping; drone D–A/Ab; modes clean/grit/fold/scream; 12 riffs (one selected riff for all bass layers); hardcore bd*4 kick + sub + hats + sidechain; 18 tracks, 206 sliders, 112 worklets/bar. Wavetable is a sampler source, so cross-layer audio-rate FM is impossible; be explicit.
- Big beat definition (Wikipedia, AllMusic, EDM Bible): 100–140 BPM (hits often 90–120), heavy distorted **compressed breaks** + TB-303 lines + 60s/70s funk/soul/jazz/rock loops; pop/house/techno song form, builds/drops, extended rolls, filters/phasing/flanging, spoken-word/film/siren effects; mid-90s UK (Big Beat Boutique 1995–2001, Skint / Wall of Sound / City of Angels), 1995–99 peak, decline from 2001.
- Big beat formula (Vice): compress a break, cut funk/soul bits, add a vocal/sample fragment, one or two synth lines, rock/rave aggression, repeat. NPR (Harris/Howlett/Cook): "events not grooves" — breakbeat of hip-hop + energy of acid + pop sensibility; "Chemical Beats" (1994) created the sound, "Brothers Gonna Work It Out" is the blueprint, "Private Psychedelic Reel" the peak.
- Big beat production (MusicRadar): sample selection is everything (James Gang intro → "Right Here, Right Now"); slice the break in a sampler with poly, do not convert to MIDI; keep the 2-bar pattern + extra kicks; 135 BPM; 909 kit over it; synth kick for heavy "1"; tape sim/compressor glues the layers; acid bass with automation; layer hits at different frequencies; vinyl-noise bed under the bus.
- Big beat form: rock verse/chorus/verse + house build/drop; one event per 4–8 bars (stop, roll, stab, filter open), one bar of silence before the drop; 32–48-bar instrumental recipe in `docs/bigbeat/03-arrangement.en.md`.
- Big beat canon (NPR/Mixmag/RTÉ/AllMusic/Sonaa): Chemical Beats, Block Rockin' Beats, Brothers Gonna Work It Out, Private Psychedelic Reel, Rockafeller Skank, Praise You, Right Here Right Now, Firestarter, Breathe, Spybreak!, Take California, Busy Child, Ooh La La, Everybody Needs A 303, Da Funk. Film/game placement: The Matrix, Tomb Raider, Wipeout.
- Big beat note-level reality check: key-detector sites disagree (Block Rockin' E minor vs A# minor vs Db major; Firestarter F# major 90% vs B; Busy Child E♭ major 98% vs A# minor/B). Trust tabs/chords over key detectors; mark by-ear claims explicitly. No audio audition is possible here, so all reconstructed step placements are labelled `[R]` in `docs/bigbeat/06-practice.en.md`.
- Big beat playable facts: Block Rockin' bass E1→A#1→C2(+3 st = D#2) at 109–109.5 BPM; break from Purdie "Changes" = 3 bars + 3 sixteenths with dotted-8th segment, fill in last 3 beats of bar 4, open hat step 8 from bar 5, vocal stab step 1 for 3 bars/rest 1. Firestarter tab: A#4/G#4/C5 intro, A4×7→G#4×6→A4 verse, chords F#7/B7, 141.5–143 BPM. Rockafeller Skank: G3 stabs, D4→D#4→D4 bend, G#3→G3 approach, chords Gm/Bb/C, 152 BPM. Attack 130 grid: kick 1/5/9/13 + quiet steps 3,4,7,8,11,12,15,16; rim +2nd 16th of beats 2/4; offbeat hat; tom step 14. Archetype 132: 16 slices/2 bars (227 ms), bass E0/E1 vs acid E2–E3 HP 150, build HP/Redux/roll/fake pump, breakdown kick step 1 + snare step 9.
- Big beat can yield 8–10 *distinct* tracks, not copies: character bank in `docs/bigbeat/07-variants.en.md` (Chemical acid-rock 121/G#m, fuzz collage 109/Em, punk-rave 142/F#, surf-skank 152/Gm, two-drummer piano 110/Cm, acid breaks 125/Eb, spy-jazz 128/F#m-Locrian, psychedelic song 135/Cm, modern nostalgia 128, nu-skool 134). N+1 rule: next unused row; change ≥4 axes (BPM, scale family, break source, hook type, form length, palette); research 2–3 NEW references per request and append to `05-sources.en.md`; write a `// BIG BEAT N · ...` DNA line in the track.
- Additional character evidence: Setting Sun 135 BPM, chords B♭–A♭–B♭–C–A♭–C (ChordU), F# major per Tunebat vs Cm per Chordify; Spybreak! 128 BPM F# minor (Songparts) vs F# Locrian (Hooktheory), ESG "Bam-Bam Jam"-like bass is a Discogs reviewer's claim [B]; Praise You ~110 BPM [B], two S950 kits from one trigger, HPF piano loop, SE-1 played bass, 303, time-stretched vocal (Sound On Sound, documented); modern Chem Bros 128 F#m "Got to Keep On" (2019).
- Tooling audit (grep over all tracks, 2026-11-24): `early`, `scramble`, `shuffle`, `xfade`, `compress`, `focus`, `stretch`, `shrink`, `bpenv`, `velocity`, `tremolo`, `fanchor`, `rsize`, `rfade`, `rlp`, `rdim`, `ir`, `compressor` have **zero** usages; `late` (8), `stut` (11), `chop` (8), `arp` (17), `fmi` (5), `pw` (7), `bpf` (6) are already used. Official syntax for the new ones verified at strudel.cc; recorded in `docs/new-tricks.en.md`. Note `stretch` changes pitch (phase vocoder), not duration — use `slow`/`loopAt` for time.
- Thin-genre note-level sources: Depeche Mode "Enjoy the Silence" C minor/F Dorian 113–114 BPM (Hooktheory); "Personal Jesus" bass tab F♯1–A1–B1–F♯2 (BigBassTabs); "Only Shallow" E–F♯–A–B with F♯4→G♯4 / C♯5→D♯5 phrases (tab sites); "When the Sun Hits" D major 115 BPM D–F♯m–G–A (Chordify); "Alison" ~100.5 BPM A major A–E–A♭m–B–D♭m (ChordU).

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

### IDM — research digest (2026-11-15)
- Studio Brootle — IDM beat: 114 BPM, 3 LinnDrum + 3 Operators; Follow Actions (bounded random), velocity→FM/filter/envelope, Beat Repeat, grain delay, ping-pong, short gated drums. https://www.studiobrootle.com/how-to-make-an-idm-beat-aphex-twin-autechre-influenced/
- Studio Brootle — IDM techniques: looped envelopes, grain delay tuned to 7 semitones, high-feedback chorus/phaser, sample&hold LFO 1/8–1/16 on resonant filter, arp + random pitch. https://www.studiobrootle.com/idm-techniques/
- Elektronauts — sequencing theory: less is more; manual sequencing; randomness is spice; rhythm as melody; micro-slicing peak+around; do not overload lows. https://www.elektronauts.com/t/whats-the-sequencing-theory-in-idm/173927
- Sonic State / Felix Fleer — IDM overview: sound design, drum processing, glitches. https://sonicstate.com/news/2023/02/18/how-to-create-idm/
- SOS — Granular Synthesis: grains 1–100 ms; density/overlap; transient flamming; grain cloud jitter on pitch/position/length/pan; position modulation is the life source. https://www.soundonsound.com/techniques/granular-synthesis
- Wikipedia — Granular synthesis: microsound scale, cloud vs note. https://en.wikipedia.org/wiki/Granular_synthesis
- Wikipedia — Chiptune: pulse duty, square/triangle/noise, few voices → fast arps, FM era, tracker culture. https://en.wikipedia.org/wiki/Chiptune
- Switch Angel — strudel-scripts: glide from previous note, accent = louder+brighter, sparse 303. https://github.com/switchangel/strudel-scripts

### Khmer — research digest (2026-11-16)
- Wikipedia — Music of Cambodia / Pinpeat: pin peat vs phleng kar vs mahori; small and large pinpeat; instrument list; `Sathukar` and `bot`; boxing music. https://en.wikipedia.org/wiki/Music_of_Cambodia ; https://en.wikipedia.org/wiki/Pinpeat
- Sam-Ang Sam (UMBC): history, village/court/temple contexts, pinpeat ensemble, scale page (5 or 7 notes; 7 available). https://www.umbc.edu/eol/cambodia/histcmus.htm ; https://www.umbc.edu/eol/cambodia/pinpeat.htm ; https://www2.umbc.edu/eol/cambodia/scale.htm
- Instrument pages: roneat (21 bars), samphor (two heads, 4 strokes, up to 8 pitches, leads), skor thom (pair, tight/loose, sticks), sralai (quadruple reed, ensemble tunes to it, circular breathing), chhing (timekeeper, closed accent + open "ching"), skor thom. https://en.wikipedia.org/wiki/Roneat ; https://en.wikipedia.org/wiki/Samphor ; https://en.wikipedia.org/wiki/Sralai ; https://en.wikipedia.org/wiki/Ching_(instrument) ; https://en.wikipedia.org/wiki/Skor_thom
- UNESCO — Traditional Musical Instruments of Cambodia (Khean et al.): instrument reference. https://unesdoc.unesco.org/ark:/48223/pf0000135257
- Garzoli — “The Myth of Equidistance in Thai Tuning” (AAWM 2015): critique of rigid 7-TET; measured tuning varies. https://iftawm.org/journal/oldsite/articles/2015b/Garzoli_AAWM_Vol_4_2.pdf
- Adaptation: 12-TET flat rounding `c db eb f gb ab bb` + 5-tone `c eb f g bb`; 88 BPM 4/4; 8-bar phrase; drone C–G / C–Gb latched; 4 modes; no samples.
- Samples: Dirt-Samples has no Khmer instruments (east = Japanese taiko/woodblock, hand, tabla, metal, tok/tink/chin); VSCO 2 CE (CC0) has real xylo/marimba/gong/claves; Roneat Studio Pro ships mock samples; Sounds of Angkor has videos. Best = local recordings, mapped with `samples({...})`. https://github.com/sgossner/VSCO-2-CE ; https://github.com/tidalcycles/Dirt-Samples ; https://github.com/Vagabond404/Roneat-Studio-Pro
- 02 rules: scenes change rhythm only (all instruments present); `// @mutes` row under scenes (ordinary 0/1, not momentary); no pad-only instruments; `mode` = fill/ghost/swing; `harmony` = fifth/axis latched 8 bars; real samples, no sralai, no sub.

### Big beat — research digest (2026-11-24)
- Wikipedia — https://en.wikipedia.org/wiki/Big_beat — definition, 100–140 BPM, 1989 term, 1995–99 peak, chart facts, soundtracks.
- AllMusic — https://www.allmusic.com/genre/big-beat-ma0000004997 — labels and the "party music" criticism.
- Vice — https://www.vice.com/en/article/big-beat-history-influence-prodigy-fatboy-slim/ — six-step formula, 90–120 BPM mid-tempo.
- NPR/KEXP — https://www.npr.org/2011/08/19/139754112/the-big-beat-revolution-11-essential-songs — 11 essential tracks picked by Howlett/Cook/Harris/White/Gifford/Carter et al.
- MusicRadar — Beat Building big beat: https://www.musicradar.com/news/beat-building-how-to-build-a-big-beat-beat ; classic breakbeat: https://www.musicradar.com/how-to/classic-breakbeat-sound ; phat layering: https://www.musicradar.com/tuition/tech/how-to-layer-monstrously-phat-breakbeats-210120 ; rave break: https://www.musicradar.com/tuition/tech/how-to-build-a-layered-90s-style-rave-breakbeat-636596 ; DnB break/vinyl bed: https://www.musicradar.com/tuition/tech/how-to-build-a-drum-n-bass-breakbeat-621105.
- Attack — Big Beat Techno: https://www.attackmagazine.com/technique/beat-dissected/big-beat-techno/ (130 BPM, pushed-low kick, late 16ths, rim/hat); Mixing Breakbeats: https://www.attackmagazine.com/technique/tutorials/mixing-breakbeats/.
- Mixmag pre-'98 10: https://mixmag.net/feature/the-10-best-big-beat-tracks-released-pre-98 ; RTÉ anthems: https://www.rte.ie/radio/gold/stories/1477879-top-100-90s-dance-anthems/ ; AllMusic songs: https://www.allmusic.com/style/big-beat-ma0000004997/songs ; Sonaa guide: https://sonaa.ca/en/styles/breaks/big-beat/ ; Classic Pop: https://www.classicpopmag.com/features/popscene-big-beat/.
- Note-level sources: Mind Flux Block Rockin teardown https://www.mind-flux.com/news-1/2023/1/27/sample-hacker-block-rockin-beats ; Ableton Atlas Big Beat Track + Famous Records (claims tagged Documented/By ear) https://ableton.onefootstep.us/deconstructions/big-beat-track.html , https://ableton.onefootstep.us/deconstructions/famous-big-beat-breakbeat-tracks.html ; Firestarter tabs https://theprodigy.info/tabs/firestarter.html , https://dbanz.tripod.com/prodigy/firestarter_guitar.html ; Skank riff/chords https://www.azchords.com/f/fatboyslim-tabs-1440/therockafellerskank1-tabs-178519.html , https://www.guitartabs.cc/tabs/f/fatboy_slim/the_rockafeller_skank_crd.html ; TempoPeek/BeatTab https://tempopeek.com/song/prodigy-firestarter , https://tempopeek.com/song/the-crystal-method-busy-child , https://beattab.com/tab/studio-t6twhxa1gyw.
- Full local digest: `docs/bigbeat/` README + 01 techniques + 02 examples + 03 arrangement + 04 Strudel + 06 practice (16-step grids, scales, note+rhythm riffs) + 07 variants (10 characters + N+1 rule) + 05 sources; also appended to `docs/references.en.md`.
- Adaptation decision: synth-only, no vocals, no lifted samples; `github:yaxu/clean-breaks` + Dirt-Samples for breaks, one acid line, native TIMELINE for build/drop, worklets only on kick/one break lane.

### Repo mapping
- Already covered: dub techno minimalism (techno/16), gabber kick (techno/13), atmospheric jungle (dnb/01), dark techstep/IDM (dnb/02), glitch/granular IDM (idm/01), Khmer pinpeat/percussion (khmer/01), Khmer percussion/xylophones with real samples (khmer/02).
- Big beat track built: `tracks/bigbeat/01-acid-breaks.js` (125 BPM, C minor, 72 bars, play/LOOP-SONG-HOLD); character = acid breaks + two-drummer hybrid from `docs/bigbeat/07-variants.en.md` rows 5–6. `modes` reports no mode-dependent lanes in SONG (same as the reference `coldwave/03`), `latch` is a no-op without a harmony slider — both known tool limitations, not track defects.
- Listening feedback on v1: Amen inaudible + nothing at bars 32–33. Root cause: `crush(0.2)` — `crush` is **bit depth 1–16**, so 0.2 crushed the break into near-silence; bar 32 STOP is an intentional one-bar silence and the DROP synth was too quiet. V2 (`02-acid-breaks-v2.js`, new file, v1 kept): crush 12 bits, intro cut ×0.6, stab 0.24 / acid 0.28 / spy 0.16, spy 0.5 in DROP, one filtered Cm chord on the last 16th of STOP as an audible cue. Audit green: verify 0 (17 lanes, 21 hits/bar, 28 sliders), gains silent, doubles no overlaps, CPU 4 worklets/s; bar 32 cue 1.44, bar 33 all lanes active. Lesson recorded in `docs/pitfalls.en.md`.
- Not yet covered: trance supersaw/breakdown, hard-techno gallop, trip hop, breakcore micro-slicing + odd meters, Khmer mahori/arak/boxing standalone. Any new one = new file, never a rewrite of dnb/01–02.
- Strudel primitives that map 1:1: `slice`/`chop`/`striate`/`splice` (granular), `ply` (retrig/rolls), `degrade` (generative variation), `sometimes`/`rarely` (velocity-random analogue), `speed` (re-pitch copies), `lpf`+`room` (gabber/dub chains), `arp(run(n))` (8-bit arps), `crush` (8-bit grit, worklet).

## Current Experiment
None.
