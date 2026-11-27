# References

Verified 2026-11-12 (HTTP 200). If something breaks, fix it freely.

## For AI: how to write tracks

- `docs/TRACKS.md` — catalog of every track (form, layers, sliders, transport).
- `docs/PANEL.md` — how the local panel reads a track (UI manifest, timeline).
- `docs/CHECKS.md` — verify/gains/tension/cpu/live and their blind spots.
- `docs/theory.en.html` — running theory notebook (mini-notation, filters, form).
- `docs/prompt-track.en.md` — the “generate a track by our scheme” prompt template.
- `docs/pitfalls.en.md` — mandatory Strudel gotchas (m(), slow vs struct,
  seg/worklet budget, sliders without negative literals, one roomsize).
- `docs/rules.en.md` — style frames and anti-patterns.
- `docs/darkwave/README.en.md` — darkwave/new wave (Depeche-middle): BPM,
  minor, drum machines, pulse bass, pads/strings, FM bell, sources.
- `docs/minimal-techno/README.en.md` — minimal techno: 4/4, modality,
  uzu/Dirt samples, kick/percussion, drone without a pad, 128-bar form.
- `docs/techno/README.en.md` — berlin techno: kick/rumble/sidechain, clap on
  the second kick, industrial percussion, form, sources.
- `docs/coldwave/README.en.md` — coldwave: sparseness, 606/808/Linn, form.
- `docs/psytrance/README.en.md` — psytrance: one root, rolling bass, offbeat hats,
  acid/psy lead/squelch, arrangement, mix, sources.
- `docs/psytrance/strudel-recipes.en.md` — working Strudel chunks for psytrance.
- `docs/psytrance/pitfalls.en.md` — anti-patterns and the before-commit checklist.

## Strudel docs

- https://strudel.cc/learn/ — tutorial table of contents, everything else from here
- https://strudel.cc/learn/mini-notation/ — mini-notation: `~`, `[]`, `<>`, `*`, `,`, `:`
- https://strudel.cc/learn/synths/ — synthesizers, `s("supersaw")`, `unison`, `detune`, FM
- https://strudel.cc/learn/effects/ — filters, delay, reverb, distortion
- https://strudel.cc/learn/samples/ — samples, banks, `.bank('RolandTR909')`

The function reference is not at a link but in the REPL itself: the “?” icon on
the left / the functions tab, with live search there too. A direct URL returns
403 to bots.

## Trance / techno — first sources (code and recipes)

If you need fat trance or techno — start here. These are short working
tracks/recipes in Strudel, not articles:

- https://github.com/DanielTRZ/strudel-trance — one file `trance.js` (~90
  lines): `bd*4`, supersaw as a stab, saw bass on 16ths, riser, room/delay.
  The `distort` on the kick and the layer structure were taken from here.
- https://github.com/honcoops/strudel_trance — `TIPS_AND_TRICKS.md` and
  `examples/`: rolling bass, sidechain pulse, supersaw lead, delay/room,
  euclid groove. The clearest trance tutorial on Strudel.
- https://github.com/frixdk/strudeltechno — `lausfødselsdagstechno.js`:
  `distort("3:.3")`, `duck("2:3:4")`, `rib`, `arrange` as a sequencer.
- https://github.com/dotcomdudee/strudel-tracks — `germantechno3/4.js`:
  `stut`, `perlin` filters, `supersaw` + `hpf`, “German” techno.
- https://github.com/iemmolo/trance-strudel and
  https://github.com/mikejcsmith/strudel-basic-trance — small examples
  for a quick start.
- https://github.com/terryds/awesome-strudel — index: if you need another
  genre, links to track sources lead from here.

### Psytrance: local reference patterns

- `refs/strudel/github/dotcomdudee/strudel-tracks/switchangel_acid.js` —
  acid sound (`distort 2.2:.3`, saw, `lpf 200`, `lpenv 2.256`, `lpq 12`) and
  the pulse/FM layer.
- `refs/strudel/github/frixdk/strudeltechno/lausfødselsdagstechno.js` —
  `sbd` kick + distort + duck, hats, dynamic acid cutoff.
- `refs/strudel/github/honcoops/strudel_trance/examples/01_driving_bassline.js` —
  EX3/4/6 rolling/acid bass.
- `refs/strudel/github/honcoops/strudel_trance/examples/02_euphoric_leads.js` —
  EX7 wide arp, EX9 pluck, EX12 strings.
- `refs/strudel/strudelmarket/Ambient/DISSOLUTION-PROTOCOL-7ec2a894.js` —
  low-base acid envelope and bytebeat/noise texture.
- `refs/strudel/strudelmarket/Synth/Adventure-Lime2-303d203e.js` — 303 bass.
- `refs/strudel/strudelmarket/Bass/Stranger-schranz-soul-0a13ccdc.js` —
  acid/bass design.

### Psytrance: bass

- https://psychedelicisland.com/en/articles/how-to-create-the-perfect-bassline-for-psytrance —
  the classic “KBBB”: kick on the beat, bass on the three 16ths after it.
- https://lofimonster.com/blog/psytrance-bass-ableton — the same KBBB with a
  breakdown of the grid and note lengths.
- https://www.psytrance-blueprint.com/tutorials/triplet-bass/ — triplets/swing
  so the straight 16th bass does not sound stiff.
- https://www.myloops.net/how-to-make-a-psytrance-rolling-bassline — a full
  breakdown: 12 notes/bar, 50–75 ms, sub+top, sidechain 2–4 dB, EQ, mono <200 Hz.
- https://www.myloops.net/designing-psytrance-bass-sounds-in-spire — HPF
  35–40 Hz, sidechain, envelopes matched to BPM.
- https://psytrance-blueprint.com/tutorials/psytrance-quickstart/ — order:
  kick+bass → drums → leads → FX; references.
- https://psytrance-blueprint.com/tutorials/better-psytrance-arrangement/ —
  16 bars of kick+bass, layers every 8–16, boundaries 8/16, open hat up to 64 bars.
- https://psytrance-blueprint.com/tutorials/three-tips-better-melodies/ —
  rhythm/motifs, question-answer, simplicity, automation.
- https://psytrance-blueprint.com/tutorials/psytrance-grids-rhythm/ — 16ths
  on the root, offbeat, core/accent, 2–4 squelches.
- https://dsokolovskiy.com/blog/all/psytrance-bassline-synthesis/ — saw −1
  octave, LP 24 dB, short decay without sustain, resampling.
- https://dsokolovskiy.com/blog/all/creating-a-weird-psychedelic-lead/ —
  bandpass + Sample&Hold LFO, distortion/phaser/reverb.
- https://www.theoryhelper.com/genres/psytrance/scales — phrygian dominant,
  double harmonic, minor second, minimum harmony.
- https://www.starseedinvaded.com/post/advanced-techniques-for-psytrance-production —
  140–150 BPM, rolling 16th bass, offbeat hats, modulation, mix.
- https://en.wikipedia.org/wiki/Psychedelic_trance — subgenres/tempos, layers
  every 4–8 bars, length 6–10 minutes.
- Attack Magazine, Ostinatos and Acid Riffs (passing notes, 2021) — simple
  root + interval acid ostinatos; search the title for the current URL.

Recipes that actually deliver “fat”: 4-on-floor + `distort` + `duck`,
rolling 16th bass with `lpenv`/`shape`, `supersaw` with `unison 5-7` and
`jux(rev)`, a riser from `white` with `hpf(sine…)`, and `perlin` on cutoffs
instead of static.

## Forums and communities

- https://club.tidalcycles.org — Tidal Club, the main forum of the scene. Tidal,
  but 90% of the techniques transfer to Strudel one-to-one (`lpf`/`lpenv`/`lpsync`
  are the same). Search for the words `reese`, `wobble`, `lfo`, `sustain`.
- https://codeberg.org/uzu/strudel — source code (not GitHub, the repo moved).
  Issues are effectively a second forum; the maintainers answer there too.
- https://tidalcycles.org/docs/ — Tidal docs, useful for understanding concepts
  (cycle, event, control pattern), even if you write in JS.

## People's code

Switch Angel (algo-rave, writes in Tidal and Strudel, many videos):

- https://www.youtube.com/@switchangel — videos, the code is usually on screen
- https://github.com/switchangel/strudel-scripts — her custom functions
  (`prebake.strudel`). The recipes below are taken from there.
- https://github.com/switchangel/breaks — breaks she edited
- https://github.com/switchangel/beginningtrance — samples from the videos

Her two bass recipes (from `prebake.strudel`), if you do not want to invent
your own:

```js
// "acid": sustain bass with a resonant filter
pat.s('supersaw').detune(.5).unison(1).lpf(100)
   .lpsustain(0.2).lpd(.2).lpenv(2).lpq(12)

// "protobass": wavetable bass, LFO synced to the bar
s("wt_ana:1").unison(5).wtsync(1.2).detune(rand.mul(1.5))
  .lpsync("[3 16] 8").lpdepth(5).lpq(0).fm(1.4).fmh(2.04).lpskew(rand)
```

## What I found in the source code (not in the docs)

Filter LFO — `packages/superdough/helpers.mjs`, function `createFilter`:

| control | what it does |
|---|---|
| `lpf(f)` | base cutoff, Hz |
| `lpdepth(k)` | LFO depth = **k × f** (multiplier, not hertz) |
| `lpdepthfrequency(hz)` | same, but in hertz |
| `lpsync(n)` | `rate = cps × n` → n pumps **per bar** |
| `lprate(hz)` | same, but in hertz (not synced to the bar) |
| `lpdc(0)` | unipolar: the LFO only opens the filter upward (default `-0.5`, swings both ways) |
| `lpenv(n)` | filter envelope in **octaves**: `2**n × f` |
| `lpa/lpd/lpsustain` | attack/decay/sustain of that envelope |
| `ftype("24db")` | two biquad stages — steeper and fatter |
| `ftype("ladder")` | worklet ladder, it has `drive` |

Order in the sound: the envelope writes to `filter.frequency`, the LFO node is
**added** to the same parameter. So `lpenv` gives a “WOW” on the attack, and the
LFO — “OOO-OOO” on top.

`penv` / `panchor` / `pattack` / `pdecay` / `psustain` / `pcurve` in
`@strudel/core` 1.2.6 exist and work (see README, “Engine gotchas”).
`glide` is not a built-in function but a registered function from
`09-dark-acid-v2.js` / Switch Angel: it calculates the interval from the previous
note and writes `penv`.

## Dub techno

- `docs/dub-techno/README.en.md` — playbook: character, harmony, sound, mix,
  checklist for the next track.
- `docs/dub-techno/sources.en.md` — external guides, the canon for listening,
  what exactly was taken from them.
- `tracks/techno/18-khmer-dub.js` — 122 BPM dub techno + 18 Khmer percussion channels + TIMELINE, Fm9→Abmaj9→Dbmaj9→Gbmaj9.
- `docs/dub-techno/strudel-recipes.en.md` — ready-made chunks: chords, sub ≤80,
  stab in the delay, pad, hats, modes, audits.
- Live examples: `tracks/techno/16-minimal-dub.js` (120 BPM),
  `tracks/techno/17-halfstep-dub.js` / `-v2` (104 BPM, Burial-leaning).

## IDM

- `docs/idm/README.en.md` — character, instrument map, switches, pads,
  scenes, how to play, gates.
- `docs/idm/01-techniques.en.md` — glitch, granular, micro-events, 8-bit,
  acid, rough bass, drums, “little reverb”.
- `docs/idm/02-arrangement.en.md` — tempo, form, dark/atonal harmony,
  anti-pop, random under control, mix, performance.
- `docs/idm/03-strudel.en.md` — `chop`/`slice`/`striate`/`splice`, `glide`,
  `seg`, pads, CPU budgets and 1.2.6 gotchas.
- `docs/idm/04-sources.en.md` — sources and what exactly was taken.
- Live example: `tracks/idm/01-splinter.js` (136 BPM, glitch/granular).

## Experimental / Buchla

- `docs/experimental/README.en.md` — series, 5 pairs, how to play, gates.
- `docs/experimental/01-buchla.en.md` — Buchla / West Coast: complex oscillator,
  FM/AM, waveshaping, LPG/vactrol, 100/200/200e, philosophy.
- `docs/experimental/02-track.en.md` — map of `01-complex-bass`, pairs, knobs.
- `docs/experimental/03-strudel.en.md` — wavetables, FM/matrix, ducking, gotchas.
- `docs/experimental/04-sources.en.md` — Wikipedia/SOS/AKWF/Strudel.
- `docs/experimental/05-riffs.en.md` — 12 riff patterns.
- `tracks/experimental/01-complex-bass.js` — 160 BPM, 5 WT+FM pairs, 10
  oscillators, 206 sliders, each bass has `oct` and `pace`.

## Shoegaze

- `docs/shoegaze/README.en.md` — wall of guitars, fuzz/chorus/delay/reverb, glide guitar,
  reverse reverb, BPM/harmony, arrangement by density, mix and mistakes.
- Sources: Wikipedia, Sound on Sound (Only Shallow), BeatKey, ToneMirror,
  GuitarBomb, Plugg Supply.

## Coldwave

- `docs/coldwave/README.en.md` — cold post-punk: rhythm, bass, Juno pad,
  guitar, form, mistakes, sources (Sound Atlas, BeatKey, Wikipedia, Dummy).
- `tracks/coldwave/01-cold-rooms.js` — 108 BPM, Dm, 4 modes, 64-bar
  TIMELINE, LOOP/SONG, 13 lanes / 58 sliders.

## Trip-hop / acid jazz

- `docs/trip-hop/README.en.md` — character, harmony (d–eb–bb–f–g–eb–c–d),
  eight breaks without disabling layers, two Moog voices, rhythm section, checks.
- `tracks/trip-hop/01-acid-jazz.js` — 84 BPM, 17 lanes, 73 sliders,
  quartal voicings / 9-13, Moog bass (cut ≤80 + env + glide) and Moog lead
  (square, LFO, delay), Rhodes comping on eight figures.
- `tracks/trip-hop/02-acid-jazz-v2.js` — 82 BPM, 27 lanes, 107 sliders:
  version 01 as a 96-bar composition, TIMELINE arrangement, solo phrases,
  spark 32nds, toms/tabla/cowbell/ghost/rolls/spot-FX; dub bass and three
  lead states (sparks / smooth / theme), LOOP/SONG and real volumes.
- Genre practice: MusicRadar (trip-hop beats; 90 BPM max), Plugg Supply
  (shuffle 55–65%, two snares, hip hop tuning), Siesta Audio (Portishead:
  recording → vinyl → resample), Wikipedia/AllMusic (acid jazz: groove,
  long compositions), mDecks/VoicingLab (fourths and upper structures).

## Khmer music



- `docs/khmer/README.en.md` — character, pinpeat map, switches, pads
  (01) and mutes (02), scenes, how to play, gates.
- `docs/khmer/01-instruments.en.md` — roneat ek/thung/dek, kong vong/thom,
  sralai, sampho (ting/tip/theung/tup), skor thom (tight/loose),
  chhing, krap; small and large ensembles.
- `docs/khmer/02-tuning-rhythm.en.md` — seven tones ~171 cents, five-tone
  skeleton, 12-TET approximations, colotomy, Sathukar, boxing music.
- `docs/khmer/03-strudel.en.md` — synthesis, VSCO/Dirt samples, `seg(1/8)`,
  scene-rhythms, `@mutes`, CPU budgets, 1.2.6 gotchas (`.add(slider)`).
- `docs/khmer/04-sources.en.md` — Wikipedia, UMBC/Sam-Ang Sam, UNESCO,
  Garzoli, Garland; what was taken and what was adapted.
- `docs/khmer/05-samples.en.md` — which real samples exist, what is missing,
  how to substitute local recordings.
- Live examples: `tracks/khmer/01-sathukar.js` (88 BPM, synthesis),
  `tracks/khmer/02-skors.js` (96 BPM, real samples, scene-rhythms,
  mute buttons, no pads), `tracks/khmer/03-skors-ritual.js`
  (76 BPM, percussion only, no high melodic lines),
  `tracks/khmer/04-confluence.js` (108 BPM, a mix of 01–03, 12 rhythms,
  acid bass/arp with `pace`).

Samples:

- VSCO 2 CE (CC0) — xylo, marimba, gong, claves:
  https://github.com/sgossner/VSCO-2-CE
- Dirt-Samples — east (taiko/woodblock), hand, tabla, metal:
  https://github.com/tidalcycles/Dirt-Samples
- Roneat Studio Pro — an app for roneat ek; the repository has
  mock/dummy samples, not a bank: https://github.com/Vagabond404/Roneat-Studio-Pro
- Sounds of Angkor — videos/photos of instruments, not one-shots:
  https://soundsofangkor.org/

Key external sources:

- https://en.wikipedia.org/wiki/Music_of_Cambodia
- https://en.wikipedia.org/wiki/Pinpeat
- https://en.wikipedia.org/wiki/Roneat
- https://en.wikipedia.org/wiki/Samphor
- https://en.wikipedia.org/wiki/Sralai
- https://en.wikipedia.org/wiki/Ching_(instrument)
- https://en.wikipedia.org/wiki/Skor_thom
- https://www.umbc.edu/eol/cambodia/histcmus.htm
- https://www.umbc.edu/eol/cambodia/pinpeat.htm
- https://www2.umbc.edu/eol/cambodia/scale.htm
- https://unesdoc.unesco.org/ark:/48223/pf0000135257
- https://iftawm.org/journal/oldsite/articles/2015b/Garzoli_AAWM_Vol_4_2.pdf

## Hip-hop

Playbook: `docs/hip-hop/README.en.md` (tempo/feel, swing ratios, fat drums,
punchy bass, why the groove makes you nod).

Key external sources:

- https://en.wikipedia.org/wiki/Swing_time — swing ratio 1:1–3:1, triplet 2:1,
  wider at slow tempos
- https://en.wikipedia.org/wiki/Groove_(music) — entrainment, sensorimotor
  coupling, "participatory discrepancies" (Prögler 1995)
- https://en.wikipedia.org/wiki/Hip-hop_production — TR-808/SP-1200/MPC,
  sampling, kick+808 mixing
- https://en.wikipedia.org/wiki/Akai_MPC — MPC workflow; J Dilla unquantized
- https://en.wikipedia.org/wiki/Half-time_(music) — half-time feel and shuffle
- https://en.wikipedia.org/wiki/Ghost_note — ghost 16ths around the backbeat

Tutorials (authoritative, checked):

- Attack Magazine — Beat Dissected (full grids per beat):
  https://www.attackmagazine.com/technique/beat-dissected/
- Attack — Drunk Drummer-Style Grooves (J Dilla/Flying Lotus/Kaytranada,
  quintuplet/sextuplet/septuplet grids):
  https://www.attackmagazine.com/technique/beat-dissected/drunk-drummer-style-grooves/
- Attack — Low-End Theory (LA beat scene, low-end focus):
  https://www.attackmagazine.com/technique/beat-dissected/low-end-theory/
- Attack — Chillout: Raw strip-hop (downtempo strip-hop):
  https://www.attackmagazine.com/technique/beat-dissected/chillout-beat-raw-strip-hop/
- Attack — The Secrets of Dance Music Production (book):
  https://store.attackmagazine.com/collections/books/products/the-secrets-of-dance-music-production-book
- Sound On Sound — Techniques (engineer-level long-form):
  https://www.soundonsound.com/techniques
  (subsections: /mixing-production, /drum-machines, /samplers-sampling)
- Ableton — Learning Music (official interactive basics):
  https://learningmusic.ableton.com/

Dark hip-hop:

- Attack — UK Drill (half-time, sliding 808, syncopated kicks):
  https://www.attackmagazine.com/technique/beat-dissected/uk-drill/
- Attack — Make UK Drill (Dutchavelli / M24):
  https://www.attackmagazine.com/technique/beat-dissected/make-uk-drill-in-the-style-of-dutchavelli-or-m24/
- Attack — Creating 808-Style Basslines:
  https://www.attackmagazine.com/technique/tutorials/creating-808-style-basslines-for-jungle-trap-and-footwork/
- Attack — Choosing The Right Key For Bass Weight:
  https://www.attackmagazine.com/technique/passing-notes/choosing-keys-for-bass-weight/
- Real World Music Theory — Phrygian for dark/eerie moods:
  https://realworldmusictheory.com/how-to-create-dark-eerie-and-foreboding-moods-with-the-phrygian-mode/

## Big beat

Full digest + reading order: `docs/bigbeat/` (`README.en.md` → `01`…`05`).

Definition / history:

- Wikipedia — Big beat (100–140 BPM, breakbeats + 303 + 60s/70s samples,
  1989 term, Big Beat Boutique, 1995–99 peak): https://en.wikipedia.org/wiki/Big_beat
- AllMusic — Big Beat genre (Skint / Wall of Sound / City of Angels labels):
  https://www.allmusic.com/genre/big-beat-ma0000004997
- Vice — In Defense of Big Beat (six-step formula, 90–120 BPM mid-tempo):
  https://www.vice.com/en/article/big-beat-history-influence-prodigy-fatboy-slim/
- EDM Bible — glossary: https://edmbible.com/glossary/big-beat/
- Classic Pop — Popscene: Big Beat (Propellerheads, film/ad placements):
  https://www.classicpopmag.com/features/popscene-big-beat/

Tutorials:

- MusicRadar — Beat Building: how to make a Big Beat beat (slice the break in
  a sampler, 135 BPM, 909 over it, acid bass, tape sim):
  https://www.musicradar.com/news/beat-building-how-to-build-a-big-beat-beat
- MusicRadar — classic breakbeat sound (slice by transients, resequence,
  extract groove vs quantise): https://www.musicradar.com/how-to/classic-breakbeat-sound
- MusicRadar — layering phat breakbeats (no two layers on one frequency):
  https://www.musicradar.com/tuition/tech/how-to-layer-monstrously-phat-breakbeats-210120
- MusicRadar — '90s rave breakbeat (layered breaks, bitcrush, 808 sub):
  https://www.musicradar.com/tuition/tech/how-to-build-a-layered-90s-style-rave-breakbeat-636596
- Attack — Big Beat Techno, Beat Dissected (130 BPM, pushed-low kick, late
  16th kicks, rim, off-beat hat): https://www.attackmagazine.com/technique/beat-dissected/big-beat-techno/
- Attack — Mixing Breakbeats: https://www.attackmagazine.com/technique/tutorials/mixing-breakbeats/

Examples / scene:

- NPR/KEXP — 11 Essential Songs (picked by the original scene):
  https://www.npr.org/2011/08/19/139754112/the-big-beat-revolution-11-essential-songs
- Mixmag — 10 best big beat tracks released pre-'98:
  https://mixmag.net/feature/the-10-best-big-beat-tracks-released-pre-98
- RTÉ — Top 100 90s Dance Anthems:
  https://www.rte.ie/radio/gold/stories/1477879-top-100-90s-dance-anthems/
- AllMusic — Big Beat Song Highlights:
  https://www.allmusic.com/style/big-beat-ma0000004997/songs
- Sonaa — Big Beat: key tracks and production guide:
  https://sonaa.ca/en/styles/breaks/big-beat/

Note-level material (steps / notes / tabs; see `docs/bigbeat/06-practice.en.md`):

- Mind Flux — Sample Hacker: Block Rockin' Beats (109.5 BPM, E1–A#1–C2 bass,
  Purdie break construction):
  https://www.mind-flux.com/news-1/2023/1/27/sample-hacker-block-rockin-beats
- Ableton 12 Sound Design Atlas — Big Beat Track (132 BPM, E minor blues,
  16 slices / 2 bars, build and breakdown step maps):
  https://ableton.onefootstep.us/deconstructions/big-beat-track.html
- Ableton 12 Sound Design Atlas — Famous Big Beat & Breakbeat Records
  (documented gear vs by-ear claims, labelled):
  https://ableton.onefootstep.us/deconstructions/famous-big-beat-breakbeat-tracks.html
- theprodigy.info / dbanz — Firestarter guitar tabs:
  https://theprodigy.info/tabs/firestarter.html ,
  https://dbanz.tripod.com/prodigy/firestarter_guitar.html
- azchords / gotabs — Rockafeller Skank riff + Gm/Bb/C chords:
  https://www.azchords.com/f/fatboyslim-tabs-1440/therockafellerskank1-tabs-178519.html ,
  https://www.guitartabs.cc/tabs/f/fatboy_slim/the_rockafeller_skank_crd.html
- TempoPeek — F# major / 141.5 BPM (Firestarter), E♭ major / 125 BPM
  (Busy Child): https://tempopeek.com/song/prodigy-firestarter ,
  https://tempopeek.com/song/the-crystal-method-busy-child
- BeatTab — Busy Child step grid: https://beattab.com/tab/studio-t6twhxa1gyw

Characters for successive tracks (`docs/bigbeat/07-variants.en.md`):

- BeatTab — Setting Sun grid (135 BPM): https://beattab.com/tab/studio-p5nx1fc-7-w
- Tunebat / ChordU — Setting Sun key + chord cycle:
  https://tunebat.com/Info/Setting-Sun-The-Chemical-Brothers-Noel-Gallagher/5JBGbFdBtLcCCygw8rtjli ,
  https://chordu.com/chords-tabs-the-chemical-brothers-setting-sun-instrumental--id_UiFjo_0Fflg
- Hooktheory / Songparts / Discogs — Spybreak! 128 BPM, F# minor/Locrian,
  ESG-like bass, original instruments:
  https://www.hooktheory.com/theorytab/view/propellerheads/spybreak ,
  https://songparts.com/songs/propellerheads/spybreak ,
  https://www.discogs.com/master/132208
- Sound On Sound — Classic Tracks: Fatboy Slim "Praise You" (two-kit trigger,
  HPF piano, SE-1 bass, 303):
  https://www.soundonsound.com/techniques/classic-tracks-fatboy-slim-praise-you
- Sonaa — 16 reference tracks / genre production:
  https://sonaa.ca/en/styles/breaks/big-beat/

## Strudel API (syntax for tricks we have not used)

- Strudel reference (full function list): https://strudel.cc/reference/
- Audio effects and single-use effect chain (compressor, tremolo, stretch,
  filter envelopes): https://strudel.cc/learn/effects/
- Time modifiers (`early`, `late`, `compress`): https://strudel.cc/learn/time-modifiers/
- `shrink` (progressive subtraction): https://strudel.cc/learn/stepwise/
- `stretch` pitch semantics and examples:
  https://github.com/tidalcycles/strudel/pull/1130 ,
  https://gitea.laenre.net/hacklab/strudel/commit/0e4d0484a35afee847462c566869029c358ca422
- `scramble` / `shuffle` / `xfade` / `focus` definitions:
  https://github.com/calvinw/strudel-llm-docs/blob/302311d9/docs/ref/strudel_reference_S-Z.txt

## Note-level material for techno / minimal / coldwave / darkwave / shoegaze

- Hooktheory — "Enjoy the Silence": C minor, F Dorian chorus, 113–114 BPM:
  https://www.hooktheory.com/theorytab/view/depeche-mode/enjoy-the-silence
- BigBassTabs — "Personal Jesus" bass tab:
  https://www.bigbasstabs.com/depeche_mode_bass_tabs/personal_jesus_ver_2.html
- tohereknowswhen — "Only Shallow" guitar tab (E–F♯–A–B):
  http://tohereknowswhen.org/tabs/only-shallow.html
- GuitarTuna — "Only Shallow" chords/tabs:
  https://guitartuna.com/tabs/only-shallow-my-bloody-valentine-tab-6217b3327d0e3fa4285c302f
- Chordify — "When the Sun Hits": D major, 115 BPM:
  https://chordify.net/chords/when-the-sun-hits-slowdive-piano-cover-souvlakisynthstatic
- ChordU — "Alison": ~100.5 BPM, A major:
  https://chordu.com/tabs/alison-chords-by-slowdive-id_0x1b2dc
