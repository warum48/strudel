# 04 · Sources

Collected 2026-11-15. Pages and threads were read, not just listed.
Format: source → what was taken → where it landed in the track.

---

## 1. IDM: sequence and sound

### Studio Brootle — How To Make An IDM Beat

https://www.studiobrootle.com/how-to-make-an-idm-beat-aphex-twin-autechre-influenced/

- 114 BPM, 3 LinnDrum samples + 3 Operators: complexity from few sources.
- Follow Actions: four clip variants play randomly, but the choice is bounded.
- Velocity → random → FM amount / filter cutoff / envelope length.
- Beat Repeat, grain delay, ping-pong delay, wide stereo.
- Short gated drums, pitched up/down.
- Separate deep sub.

**In the track:** `mode` branches, `degradeBy` on textures, `bits` and
`grain`, light sub, delay instead of big reverb.

### Studio Brootle — IDM Techniques

https://www.studiobrootle.com/idm-techniques/

- Looped envelopes → near audio-rate modulation.
- Grain delay tuned to 7 semitones.
- Chorus/phaser with high feedback.
- Beat Repeat followed by delay.
- Sample & Hold LFO (1/8, 1/16) on a resonant filter.
- Arpeggiator + random pitch.

**In the track:** filter LFO on growl/pad, `rand` on grain speed,
`arp(run(...))` with probabilistic note drops.

### Elektronauts — What’s the sequencing theory in IDM?

https://www.elektronauts.com/t/whats-the-sequencing-theory-in-idm/173927

- "Muddy chaos" is the main failure; fix with EQ, filtering, compression.
- Fewer layers, more attention to each.
- Melody as rhythm, rhythm as melody.
- Randomness is spice; the base is manual sequencing.
- Micro-slicing: take the peak and a little around it; play 8ths, not all 16ths.
- Do not overload the low end.

**In the track:** sparse patterns, separate micro-layers, explicit
`struct`, low end reserved for sub.

### Sonic State / Felix Fleer — How To Create IDM

https://sonicstate.com/news/2023/02/18/how-to-create-idm/

- Overview of sound design, drum processing and drum glitches.
- Glitch is processing, not a separate genre.

**In the track:** general frame; specifics came from other sources.

### ZacharySBrown — idm-course

https://github.com/ZacharySBrown/idm-course

- 12-week reverse-engineering course: Aphex, Autechre, Four Tet,
  Squarepusher, Dilla, Burial.
- Method: analyse tracks, do not assemble from loops.

**In the track:** "sequence first, layers second".

---

## 2. Granular

### Sound on Sound — Granular Synthesis

https://www.soundonsound.com/techniques/granular-synthesis

- Grains 1–100 ms; grain size, smoothing, density, position.
- Transients suffer first: flamming, double hits.
- Small grains + large transient window for drums.
- Grain cloud: many grains, jitter on pitch/position/length/pan.
- Position modulation is the main source of "life".

**In the track:** `grain.cloud` / `scan` / `freeze`; `window`, `density`,
`spread`, `pan(rand)`, `degradeBy`.

### Wikipedia — Granular synthesis

https://en.wikipedia.org/wiki/Granular_synthesis

- Grains 1–100 ms; cloud; microsound time scale.
- History: Gabor → Xenakis → Roads → Truax.
- Density/overlap changes timbre from cloud to note.

**In the track:** terminology and ranges; practice from SOS.

---

## 3. 8-bit / chiptune

### Wikipedia — Chiptune

https://en.wikipedia.org/wiki/Chiptune

- PSG: pulse (duty cycle), square, triangle, saw, noise.
- Game Boy: 2 pulse + 4-bit wave + noise; C64 SID: 3 channels, ring mod,
  resonant filter.
- Few voices → fast arpeggios instead of chords.
- FM era (PC-88/PC-98, AdLib/OPL) — "warm digital" timbre.
- Tracker culture: small samples, precise sequencing.

**In the track:** `pulse` + `pw`, `square`, `arp(run(8/16/32))`, `crush`,
short notes, high register.

### Project practice

- `crush` is a worklet; only on sparse layers.
- `coarse` is not available everywhere; "coarse" here is another `crush` depth.

---

## 4. Acid / 303

### Switch Angel — strudel-scripts

https://github.com/switchangel/strudel-scripts

- `glide`: compute which note we come from; `panchor 0`, `psustain 0`,
  `pattack 0`, `pdecay = time`, `penv = -12*log2(fTo/fFrom)`.
- Glide gate without `<…>`.
- `accent` = louder AND brighter.
- 303 patch: supersaw + detune 0.5 + unison 1.
- Sparse line, wide intervals.

**In the track:** `acid.line` (glide on three 16ths), `acid.run`,
`acid.scream`.

### `docs/switchangel-recipes.md`

- Local digest; read before a new track.

---

## 5. Breakcore / micro-slicing

### `docs/breakcore/`

- Rinse technique, micro-slicing, rolls, velocity-as-slice-selector.
- Do not over-chop; warp is the groove killer.
- Non-multiple slice counts deliberately break phrasing.

**In the track:** `grain.edit` via `slice`, `padRoll`, `padCut`; no
total chop.

---

## 6. Dark harmony

### `docs/rules.md`

- Bass ≤80 by default.
- Anti-pop: no funny melodies, 303 is not chord arpeggiation, muted kick,
  no 1–2–4–5.
- Complex chords only for jazz; otherwise minimalism with juicy 9th
  dissonances.

### Project practice

- Tritone as an axis, `@dark` in `tension`.
- Minor second is not forgiven.
- Registers separated: bass c1–db2, pad c3–e4, lead c5–f6.

**In the track:** C–Gb–Db–Bb, tritone dyads, fifths with 9ths.

---

## 7. Not taken

- Trip-hop and Burial atmosphere — already covered in techno/17.
- Big reverb and "ambient pad" — against the IDM task.
- Dense 16th acid flow — against anti-pop.
- Uncontrolled generative randomness — against forum consensus.
