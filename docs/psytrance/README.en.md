# Psytrance — production playbook

Psytrance is not "trance with acid". It is **one root, one carrying kick,
one rolling bass and a grid of short events** that move for 6–8 minutes.
Harmony barely changes here: hypnosis matters more than chords. If a track
has a progression and "plays around chords", it is no longer psytrance but
trance pop.

## 1. Tempo and subgenres

- **Full-on:** 140–148 BPM, peak-time, melodic, often an "eastern" scale.
- **Progressive:** 135–140 BPM, fewer melodies, more groove and groove textures.
- **Dark psy:** 150+ BPM, tritones/minor seconds, heavy low end.
- **Goa:** 140–145 BPM, more melodic and "more analog", the ancestor of the genre.
- **Forest / hi-tech:** 148–160+, broken textures and aggressive design.

Our track is **full-on 145 BPM**, F# phrygian dominant.

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

- **303 line:** saw/square, high resonance, filter envelope, short decay.
  Plays 1–2 notes from the scale, repeats and mutates through the filter.
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

## 6. Arrangement

- 16 bars of **kick + bass only** — the foundation and DJ intro.
- Layers: hats (16–32), clap/snare (32–48), open hat and percussion
  (48–64).
- Break: remove kick/bass/hats, keep drone, lead, reverse, riser.
- Build: kick/bass return, snare roll, riser, filter sweep; the lead enters
  1–2 bars before the drop.
- Main changes at 8/16-bar boundaries; big ones at 16/32.
- Full-on form roughly: INTRO → GROOVE → LIFT → BREAK → BUILD → DROP →
  GROOVE 2 → PEAK → BREAK 2 → OUTRO.
- Ideal length is 7–7.5 minutes; in our format it is 5–6 minutes (192 bars
  at 145 BPM ≈ 5:18).

## 7. Mix

- Low end mono; kick and bass do not fight over 40–80 Hz.
- Bass high-pass ~30 Hz; notch at the kick's fundamental if needed.
- Width on leads, pads, FX; bass and kick in the center.
- Do not cram: if a section is muddy, remove an element rather than add
  processing.
- Reference: solo kick+bass against the reference, then the whole mix.

## 8. What not to do

- Chord progressions and "playing around" chords with arpeggios.
- Long bass notes with sustain — the bass turns into a drone.
- Bass on the kick (the first 16th is taken by the kick).
- Melodic pop leads and "pretty" cadences.
- 10 layers "just in case", static 4-bar loops.
- One squelch per bar, "polite" 16th hats, a big hall instead of a short
  room.
- Glide/portamento in the rolling bass.

## 9. Our track

`tracks/psytrance/01-serpent-engine.js` — 145 BPM, F# phrygian dominant,
192 bars, static root (no chord progression). 19 tracks:
kick, hats, open hat, clap, shaker, ride, tom, rim, roll, sub, rolling bass,
acid 303, psy lead, FM squelch, drone, pad, air, riser, reverse.
Switches: `mode` (straight/rolling/tribal/stomp), `bassVar` (root/oct),
`leadVar` (serpent/squelch/hypno); transport: `play` (LOOP/SONG/HOLD).

Strudel recipes — `docs/psytrance/strudel-recipes.en.md`.

## 10. Sources

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
