# Psytrance — production playbook

Psytrance is not "trance with acid". It is **one root, one carrying kick,
one rolling bass and a grid of short events** that move for 6–8 minutes.
Harmony barely changes here: hypnosis matters more than chords. If a track
has a progression and "plays around chords", it is no longer psytrance but
trance pop.

**In this guide:** [kick & bass](#2-kick-and-rolling-bass--the-foundation) ·
[rhythm](#3-rhythm-grid-and-percussion) · [harmony](#4-harmony-one-root) ·
[sound design](#5-acid-lead-squelch) ·
[riffs & melody](#6-riffs-and-melody) · [psy FX](#7-psy-fx-inserts) ·
[arrangement](#8-arrangement) · [pitfalls](#10-what-not-to-do) ·
[case studies](#11-case-studies). Code: [recipes](strudel-recipes.en.md);
full anti-pattern list: [pitfalls.en.md](pitfalls.en.md).

## 1. Tempo and subgenres

- **Full-on:** 140–148 BPM, peak-time, melodic, often an "eastern" scale.
- **Progressive:** 135–140 BPM, fewer melodies, more groove and groove textures.
- **Dark psy:** 150+ BPM, tritones/minor seconds, heavy low end.
- **Goa:** 140–145 BPM, more melodic and "more analog", the ancestor of the genre.
- **Forest / hi-tech:** 148–160+, broken textures and aggressive design.

Track 01 is full-on **145 BPM, F# phrygian dominant**; track 02 is **140 BPM, F# minor**.

## 2. Kick and rolling bass — the foundation

First only kick and bass. If they do not groove together, a melody will not
save it.

### Kick
- 4/4, a hit on every quarter.
- Short, with a click and a body; the sub tail must not hang over the first
  bass note.
- Tuning: it is better to keep the kick's fundamental a semitone or two
  **away** from the bass root, otherwise two subs fight.
- Sidechain: 2–4 dB, fast attack, release back to zero before the first
  bass note. If you can hear "pumping", it is already progressive house, not
  psy.

### Rolling bass
- Every quarter: **KICK — bass — bass — bass**. That is 12 notes per bar:
  three 16ths between hits.
- All notes are the same in pitch, length and velocity. Movement comes
  later.
- Note length: ~50–75 ms at 145 BPM; there must be air between notes.
- Amplitude envelope: attack 1–3 ms, short decay, **sustain 0**,
  release 20–40 ms. The note dies before the next one.
- Two layers: **sub** (sine, root F1–A1) and **top** (saw/square, LP 400–1000
  Hz, fast filter envelope at 1/16). Saturation only on the top.
- Everything below ~200 Hz is mono.
- Movement without breaking the pulse: an octave reset once every 4–8 bars,
  replacing the root with a fifth/third for 2 bars, cutting the last 16th,
  slowly lowering the top layer's cutoff. No glide/portamento or melodic
  runs in the low end.

## 3. Rhythm grid and percussion

- The basis is fast 16ths on the root; the groove is made by
  **displacements**, not by more frequent notes.
- Closed hats: 16ths with accents; open hat **on the offbeat** (between
  kicks) — that is the "rolling drive".
- Layers come in over 8–16 bars: first hats, then clap/snare, then the open
  hat with a transition.
- Percussion: shaker, ride, toms, rim, conga/bongo. Not all at once.
- The psytrance "grid" is core elements that repeat plus 2–4 rare accent
  sounds (FM squelch, tom, reverse, vocal shout).
- Put accent hits on the second 16th or the offbeat, not on the downbeat.
- Do not keep the open hat running longer than ~64 bars without a reset/break.

## 4. Harmony: one root

- Scales: **phrygian dominant** (1–b2–3–4–5–b6–b7), double harmonic,
  harmonic minor. The minor second (b2) is the genre's main color.
- Chords are optional. One root + drone + acid/lead riffs is normal.
- If you want movement: change **one note** every 8–16 bars, not a
  4-chord progression.
- Pad/drone is static. Do not "play around" chords with arpeggios: in
  psytrance an arpeggio is a rhythmic figure, not a harmonic accompaniment.
- Keys: G#–A# and F–G are convenient; C/C#/B are often too low/high for a
  dense mix.

## 5. Acid, lead, squelch

- **303 line:** saw/square, **low base cutoff** (100–200 Hz) plus a **deep
  filter envelope** (3–5 octaves) and a ladder/24 dB filter. Moderate
  resonance (2–5), not 12–15. Short filter decay (0.05–0.15 s), no sustain.
  Clean by default; distortion optional and light. Plays 1–2 notes from the
  scale, repeats and mutates through the filter.
- **Psy lead:** saw/square, detune, bandpass or LP with slow automation;
  delay + reverb. The melody is a short "question–answer" motif, not a
  passage.
- **Weird lead / squelch:** bandpass + LFO Sample&Hold on cutoff (in
  Strudel the analog is `rand`/`perlin` on the cutoff), FM blip, reverse,
  short delay. 2–4 squelches per bar is normal; one does not read.
- The melody must be memorable after one listen; cut extra notes, leave
  pauses.
- Movement is automation: the cutoff crawls over 16–32 bars, delay/reverb
  change, but the motif stays.

### Strudel-native values, not a DAW

Cutoff is Hz, `lpq` is a real Q factor (0–50), `lpenv` is envelope depth in
octaves. A DAW guide saying "cutoff 400–1000, Q 12–15" does **not** translate
1:1: in Strudel Q 12–15 screams, and an acid needs a **low base + deep
envelope**, not a high base + shallow envelope.

| Control | Range in Strudel | Musical start |
|---|---|---|
| `lpf` | 0–20000 Hz | sub 40–80; top bass 300–600; acid base 80–200; lead 800–2000; pad 200–600; hats 6k–12k |
| `lpq` | 0–50 | 0–4 musical; 5–15 aggressive; 12–15 is a scream, not a default |
| `lpenv` | octaves | 1–4 typical; acid 3–5 **from a low base** |
| `lpa` / `lpd` / `lps` | seconds / 0–1 | acid `lpd` 0.05–0.15, `lps` 0–0.2; bass `lpd` 0.03–0.08 |
| `ftype` | 12db / 24db / ladder | ladder for 303 (one worklet per event); 24db for bass; 12db for soft leads |
| `roomsize` | 0–10 | 6–9; never above 10 |
| `room` | 0–1 | 0.1–0.3 drums, 0.2–0.5 pads/leads |
| `delaytime` | seconds | 0.375 = 3/8; 0.25 = 1/4 |
| `delayfeedback` | 0–1 | 0.3–0.55 |
| `distort` | 0–10 | 0–2; acid can be clean |

Our acid: base 120 Hz, Q 4, `lpenv` 4.5, `lpd` 0.055, `lps` 0.05, ladder.
Our bass: 410 Hz, Q 2, `lpenv` 3, `lpd` 0.05, 24db.

## 6. Riffs and melody

A psy riff is a **rhythmic cell**, not a chord exercise. Repetition is the
point; variation is one note, not a new phrase.

- Use a tiny pitch set: root + m2, root + m3, occasionally m6. m2 is the dark
  phrygian color; m3 opens it slightly; m6 is a darker turn. Do not stack all
  three in one bar.
- **Pulse:** straight 16ths on the root, m2/m3 as accents; every 4th bar swap
  m3 for m6. Let the filter move. Use it for a break or a hypnotic groove.
- **Gallop:** 3-3-2 / two-notes-and-a-rest rhythm on the same note, m2/m3
  accents. More rhythmic, less arpeggio; good for a lift/drop.
- **Arpeggio:** if you want one, make it wide and directional (F#5→F#6) with
  returns and a jump. Avoid a 1-bar broken chord repeated; more notes is fine
  only if the phrase has direction.
- **Break melody:** take a 1-bar motif, repeat it 4× to make a 4-bar chunk.
  The 16-bar break is four chunks: base / first note +1, third +2 / base /
  first and third −2. The changes are on the first and third notes of the
  chunk; everything else repeats. That is motivic development without chords.
- **Lift melody:** same notes, sparse Faithless-style groups: 1 note, rest,
  3-note group, rest; 4-bar phrase. A longer release and a small gain lift
  keep the sparse notes singing. Not an arpeggio; the space is the hook.
- Write something you can hum. Rests are part of the motif; end on root or
  fifth; question then answer; repeat with one change.
- Keep changes on 8/16-bar boundaries; do not mutate every bar.

## 7. Psy FX inserts

The "flight" layer: short synth events that appear in the gaps, not a
continuous part. The point is a person flying and catching glitches —
noticeable, never in the way.

- **Laser / zap:** 4 low repeated notes (e.g. F#3) with a hard cutoff sweep
  (`lpf(cut × saw.range(...))` + `lpenv`), short decay, light drive. One bar
  in 8; pan/delay.
- **Bubble / clicks:** 4 neutral high FM/sine clicks, only root + m2 (F#6/G6),
  tiny decay. One bar in 16; random pan. No m3/chord — it gets poppy.
- **Fat low note (from the intro, every 4 bars):** A1; three hits in a row,
  then the fourth is A0 (octave down). `unison(3)`, detune, drive, long
  release, pan LFO, an attack slider. Cutoff **1800–2400** with a 4-bar LFO;
  resonance **14–24** with an 8-bar LFO (half the step); strong echo (0.85
  send, 1.2× feedback) and a long reverb (room 2.4×). This is a low **layer**,
  not a rare FX; the laser/bubble/crunch stay rare.
- **Crunch:** two short crushed noise hits (`crush`), one bar in 16.
- Placement: intro/groove/build/outro gaps, not dense drops/lifts. Use 4/8/16-
  bar masks; one event per phrase; pan, delay, room; low gain.
- Do not stack the rare FX; do not make the bubble a melody. The fat low hits
  every 4 bars (it is a layer); laser/bubble/crunch are 1-in-8/16. One reverb
  size; keep the CPU budget.
- Local references: `switchangel_acid` pulse/FM and `DISSOLUTION` bytebeat/
  noise.

## 8. Arrangement

- 16 bars of **kick + bass only** — the foundation and DJ intro.
- Layers: hats (16–32), clap/snare (32–48), open hat and percussion
  (48–64).
- Break: remove kick/bass/hats, keep drone, lead, reverse, riser.
- Build: kick/bass return, snare roll, riser, filter sweep; the lead enters
  1–2 bars before the drop.
- Main changes at 8/16-bar boundaries; big ones at 16/32.
- Full-on form roughly: INTRO → GROOVE → LIFT → BREAK → BUILD → DROP →
  GROOVE 2 → PEAK → BREAK 2 → OUTRO.
- Outro trick: copy the last break, then automate every cutoff lane to
  near-zero (0–0.2) at the end. The track fades dark without a new section.
- Ideal length is 7–7.5 minutes; in our format it is 5–6 minutes (192 bars
  at 145 BPM ≈ 5:18).

## 9. Mix

- Low end mono; kick and bass do not fight over 40–80 Hz.
- Bass high-pass ~30 Hz; notch at the kick's fundamental if needed.
- Width on leads, pads, FX; bass and kick in the center.
- Do not cram: if a section is muddy, remove an element rather than add
  processing.
- Reference: solo kick+bass against the reference, then the whole mix.

## 10. What not to do

- **Do not copy DAW cutoff/Q values.** In Strudel `lpf` is Hz and `lpq` is a
  real Q 0–50; Q 12–15 screams. Acid is a low base + deep envelope, not a high
  base + shallow envelope.
- **No chord progressions or chord comping.** No pad progression, no
  arpeggiating chords as accompaniment. One root, intervals, drones.
- **No long bass notes with sustain.** 50–75 ms, sustain 0, a gap before the
  next note; no bass on the kick.
- **No static cutoff.** Every synth should move (LFO + section automation);
  distortion does not replace filter movement.
- **No clunky 1-bar broken-chord leads.** Riffs repeat a note; use m2/m3,
  occasional m6; more notes only if repeated/directional. Leave rests.
- **No dense FX.** No FX on every bar, no FX in the drops, no 8-click pop
  bubble, no 4-bar laser loop at full level. Rare, panned, delayed, fat.
- **No 10-layer pile-up.** Subtract; open hat resets before 64 bars; no
  static 4-bar loops; changes on 8/16 boundaries.
- **No big hall / >10 roomsize / multiple reverbs.** One reverb size, short
  room; `roomsize` 0–10.
- **No worklet storms.** `ftype('ladder')`, `distort`, `crush`, `shape` are
  one worklet per event; keep CPU under ~150/s; no supersaw stacks on 16ths.
- **No node-check cheats.** No `.scale`/`chord()` in the check; mini strings
  only through `m()`; no mini strings stored in variables without `m()`;
  no negative slider literals; every layer needs `gateOf`/`audible`.
- **Do not trust the panel alone.** Check in stock strudel.cc; run verify,
  gains, cpu, levels.
- Full checklist and fixes: [pitfalls.en.md](pitfalls.en.md).

## 11. Case studies

`tracks/psytrance/01-serpent-engine.js` — 145 BPM, F# phrygian dominant,
192 bars, static root (no chord progression). 19 tracks, 90 sliders:
kick, hats, open hat, clap, shaker, ride, tom, rim, roll, sub, rolling bass,
acid 303, psy lead, FM squelch, drone, pad, air, riser, reverse.
Switches: `mode` (straight/rolling/tribal/stomp), `bassVar` (root/oct),
`leadVar` (serpent/squelch/hypno); transport: `play` (LOOP/SONG/HOLD).

- sub 42 Hz; top bass 410 Hz / Q 2 / `lpenv` 3 / 24db.
- acid base 120 Hz / Q 4 / `lpenv` 4.5 / ladder, clean (no distortion).
- lead 1280 Hz / Q 2 / `lpenv` 2; squelch bpf 1240 / Q 3.5.
- pad 320, drone 115, air 2500, `verb` 0.12, `roomsize` 8 (max 10).
- no master multiplier: every cutoff is the slider times its own automation.

### 02 — Acid Euphoria

`tracks/psytrance/02-acid-euphoria.js` — 140 BPM, F# minor, **168 bars**,
18 tracks, 83 sliders. This one copies the references instead of inventing:

- **Acid / riff A (pulse):** `switchangel_acid` chain — `distort 2.2:.3`/
  sawtooth/`lpf`/`lpenv 2.256`/`lpq 12` — over a repetitive 16th ostinato on
  F# with m2 (G) and m3 (A) accents; every 4th bar the m3 becomes m6 (D).
  Used **only in BREAK**.
- **Acid / riff B (gallop):** a syncopated 3-3-2-ish line on the same two/three
  notes; used in LIFT/drops. In LIFT the wide arp lane is off, so the section
  is rhythm-led, not arpeggio-led.
- **Kick/hats:** `sbd` + distort + `duck 2` and TR-909 hats from
  `lausfødselsdagstechno`.
- **Bass:** honcoops EX3/6 saw rolling bass, `lpf` 700–1500, `res 7`, short release.
- **Form detail:** INTRO 3 is INTRO 2 plus the open hat. The GROOVE starts the
  acid at ~80 Hz (the acid cut slider minimum is 80) and opens it to the middle
  of the groove by bar 32 via the `keys.acid.cut` automation.
  The OUTRO is a copy of **BREAK 2**; at bar 168 the automated cutoffs close
  (acid/pluck 0, strings 0.05, arp/bass 0.2), so the instruments fade dark.

**Current user preset** (saved in `dumps/02-acid-euphoria.js`): oh 0.31,
sub 37/0.07, bass 1450, acid 300, arp 2240, bubble 0.39, fat 0.08. The
reference starting points above remain the general recipe.

- **Leads/pad:** honcoops EX7 wide arp, EX9 triangle pluck, EX12 slow saw
  strings. The BREAK pluck is a 4x-longer melody in four 4-bar chunks: base / first +1,
  third +2 / base / first and third -2. The LIFT pluck uses the same notes but
  a sparse Faithless-style phrasing (1 note, rest, 3-note group, rest); the
  wide arp lane stays off there. `pluckVar` = arp / lift / break.
- **Psy FX inserts:** `laser` (4 low F#3 notes with a hard cutoff sweep and
  drive, 1 bar in 8), `bubble` (4 neutral high F#6/G6 FM clicks, m2 only, 1
  bar in 16), `fat` (A1 every 4 bars from the intro; three hits A1, then A0; cutoff
  1800–2400 4-bar LFO, resonance 14–24 8-bar LFO, attack slider, strong echo +
  long reverb, unison/drive/pan) and `crunch` (2 crushed noise hits, 1 bar in 16).
  The fat low hits every 4 bars; the other three are rare and live in the gaps
  (intro/groove/build/outro), not the dense drops.
- **Dynamic cutoff:** every synth moves — `lpf(base × sine.range(…).slow(16)
  × autoAt(…))`; the strings use `lpdepth`/`lpsync`. No chord progression:
  static F#m strings, one root.

Strudel recipes — `docs/psytrance/strudel-recipes.en.md`.

## 12. Lessons / final checklist

- One root; no chord progression or chord comping.
- Kick + bass first: 12-note rolling bass, sub + top, gap, mono, sidechain.
- Strudel-native values: `lpf` Hz, `lpq` Q 0–50; acid low base + deep
  envelope; dynamic cutoff on every synth.
- Riffs: repeated notes, m2/m3, occasional m6; pulse/gallop; break 4 chunks;
  sparse lift; more notes only if repeated/directional.
- FX: fat low from intro, every 4 bars, 3×A1 then A0; laser/bubble/crunch
  rare; bubble m2 only; not in dense drops.
- Arrangement: 16-bar intro, layers, 8/16 boundaries, break/build, open-hat
  reset; subtract, don't stack.
- Mix: low end mono, sidechain, less reverb, one roomsize, lead not hidden.
- Test: `verify`, `gains`, `cpu` (<150/s), `levels`, live in stock
  strudel.cc; commit before experiments.
- If it sounds clunky: fewer notes, more repetition, more filter movement,
  more space.

## 13. Sources

Strudel-native:
- Local reference patterns: `refs/strudel/github/dotcomdudee/strudel-tracks/switchangel_acid.js`
  (acid and pulse/FM), `refs/strudel/github/frixdk/strudeltechno/lausfødselsdagstechno.js`
  (kick/hats/acid), `refs/strudel/github/honcoops/strudel_trance/examples/01_driving_bassline.js`
  (EX3/4/6), `.../02_euphoric_leads.js` (EX7/9/12).
- https://strudel.cc/learn/effects/ — `lpf` Hz, `lpq` Q 0–50, `lpenv`,
  LFO, duck, delay, reverb, `roomsize` 0–10.
- https://strudel.cc/learn/synths/ — waveforms, FM, partials.
- Local patterns: `refs/strudel/strudelmarket/Ambient/DISSOLUTION-PROTOCOL-7ec2a894.js`
  (psytrance 145, low-base acid envelope), `refs/strudel/strudelmarket/Synth/Adventure-Lime2-303d203e.js`
  (303), `refs/strudel/strudelmarket/Bass/Stranger-schranz-soul-0a13ccdc.js`
  (acid/bass).

- Attack Magazine, Ostinatos and Acid Riffs (passing notes, 2021) — simple
  root+interval acid ostinatos; use the title to find the current URL.
- Wikipedia, Psychedelic trance — tempos, subgenres, layers every 4–8 bars,
  6–10 minute length, 30 s–1 min break:
  https://en.wikipedia.org/wiki/Psychedelic_trance
- Myloops, How to Make a Psytrance Rolling Bassline That Locks With the Kick —
  three 16ths between kicks, 50–75 ms, sub+top, sidechain 2–4 dB, EQ split,
  mono below 200 Hz, movement by octaves/fifth/filter:
  https://www.myloops.net/how-to-make-a-psytrance-rolling-bassline
- Myloops, Designing a Rolling Psytrance Bass in Spire — HPF 35–40 Hz,
  sidechain, retuning the envelopes to the BPM:
  https://www.myloops.net/designing-psytrance-bass-sounds-in-spire
- Psytrance Blueprint, Psytrance for Beginners — kick and bass first, then
  drums, leads, FX; references and repetition:
  https://psytrance-blueprint.com/tutorials/psytrance-quickstart/
- Psytrance Blueprint, Triplet Bassline — triplets, offbeat, groove pool:
  https://psytrance-blueprint.com/tutorials/triplet-bass/
- Psytrance Blueprint, Arrangement: 7 Rules — 16 bars kick+bass, layers every
  8–16, 8/16 boundaries, open hat up to 64 bars, phrygian/minor, movement:
  https://psytrance-blueprint.com/tutorials/better-psytrance-arrangement/
- Psytrance Blueprint, 3 Tips for Better Melodies — rhythm, motifs,
  question–answer, simplicity, automation:
  https://psytrance-blueprint.com/tutorials/three-tips-better-melodies/
- Psytrance Blueprint, Psytrance Grids — 16ths on the root, offbeat, core/accent,
  2–4 squelches, gradual 8-bar blocks:
  https://psytrance-blueprint.com/tutorials/psytrance-grids-rhythm/
- Daniel Sokolovskiy, Psytrance bassline synthesis — saw −1 octave, LP 24 dB,
  short decay without sustain, resampling, EQ:
  https://dsokolovskiy.com/blog/all/psytrance-bassline-synthesis/
- Daniel Sokolovskiy, Creating a weird psychedelic lead using LFO — bandpass +
  Sample&Hold LFO on cutoff, distortion/phaser/reverb:
  https://dsokolovskiy.com/blog/all/creating-a-weird-psychedelic-lead/
- Theory Helper, Best Scales for Psytrance — phrygian dominant, double
  harmonic, minor second, minimal harmony, acid lines:
  https://www.theoryhelper.com/genres/psytrance/scales
- StarSeed Invaded, Advanced Techniques for Psytrance Production — 140–150
  BPM, rolling 16th bass, offbeat hats, modulation, resampling, mix:
  https://www.starseedinvaded.com/post/advanced-techniques-for-psytrance-production
