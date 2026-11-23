# Psytrance — pitfalls and "how not to do it"

This is the checklist we wish we had before the first attempts. Each item is
**symptom → why → do instead**. The companion playbook is
[`README.en.md`](README.en.md); working code is in
[`strudel-recipes.en.md`](strudel-recipes.en.md).

## 1. Values and sound design

### Copying DAW cutoff/Q into Strudel
- **Symptom:** acid screams, bass whistles, the mix is thin or painful.
- **Why:** a DAW guide says "cutoff 400–1000, Q 12–15"; in Strudel `lpf` is
  Hz and `lpq` is a real Q 0–50. Q 12–15 is extreme, not a default.
- **Instead:** start at Q 0–4; acid needs a **low base cutoff + deep filter
  envelope** (e.g. 120 Hz + 4.5 octaves + ladder), not a high base + 1.5
  octaves. Tune by ear, not by a DAW screenshot.

### High base + shallow envelope acid
- **Symptom:** the 303 sounds like a static filtered saw; no "zap".
- **Why:** a high base cutoff means the filter never closes to a dark point;
  a shallow envelope barely moves.
- **Instead:** base 80–200 Hz, `lpenv` 3–5, `lpd` 0.05–0.15, `lps` 0–0.2,
  `ftype('ladder')` for 303 character. Then add a slow LFO on the base.

### Static cutoff
- **Symptom:** the synth sounds like a preset; the track is boring even when
  the notes are right.
- **Why:** no movement; no automation/LFO.
- **Instead:** `lpf(base × sine.range(...).slow(16) × autoAt(...))` for short
  events; `lpdepth`/`lpsync` for long pads/strings. Every synth should move.

### Distortion instead of filter movement
- **Symptom:** everything is loud and gritty, but still dull.
- **Why:** `distort` adds harmonics, not motion.
- **Instead:** use light drive (0–2) and a moving filter; acid can be clean.

### `roomsize` above 10 / multiple reverbs
- **Symptom:** washed-out, long tail, CPU spikes.
- **Why:** Strudel `roomsize` is 0–10; a big hall is not a psy room.
- **Instead:** one shared `fx.reverb.size` (6–9), short room; `room` 0.1–0.5
  depending on the layer. Do not change reverb size per section.

### Worklet storms / supersaw stacks
- **Symptom:** crackles, dropouts, high CPU on weak machines.
- **Why:** `ftype('ladder')`, `distort`, `crush`, `shape` are one worklet per
  event; `supersaw` expands to many oscillators.
- **Instead:** keep the worst section under ~150 worklets/s (`npm run cpu`);
  no ladder/distort on dense 16ths; no supersaw stacks on dense parts.

## 2. Kick and bass

### Long bass notes / sustain
- **Symptom:** the low end becomes a drone; no rolling motion.
- **Why:** sustain and no gap; notes overlap the kick and each other.
- **Instead:** 50–75 ms notes, attack 1–3 ms, **sustain 0**, release 20–40 ms;
  the note dies before the next. 12 notes per bar, three 16ths between kicks.

### Bass on the kick
- **Symptom:** kick and bass fight; no punch.
- **Why:** the first 16th is occupied by the kick; the bass also lands there.
- **Instead:** `~ x x x` per quarter; leave the downbeat to the kick. If you
  use a continuous 16th line, duck it (orbit 2) and shorten it.

### No sub/top split
- **Symptom:** the bass is either muddy or thin.
- **Why:** one layer trying to do sub and mid-bass at once.
- **Instead:** sine sub at the root (40–80 Hz) + saw/square top (300–600 Hz)
  with a fast filter envelope; mono below ~200 Hz; saturation only on the top.

### No gap / no sidechain
- **Symptom:** "pumping" or a constant wall of low end.
- **Why:** the kick tail overlaps the bass; no duck, or too much duck.
- **Instead:** short kick (<100 ms) + 2–4 dB sidechain with fast release, back
  to zero before the first bass note. If the pump is obvious, it is not psy.

### Bass tuned against the kick
- **Symptom:** two subs beat against each other.
- **Why:** kick and bass at the same fundamental.
- **Instead:** keep the kick fundamental a semitone or two away from the bass
  root; shorten the kick tail.

## 3. Acid, leads and riffs

### Trying to write a chord progression
- **Symptom:** it sounds like trance pop; the hypnosis disappears.
- **Why:** psytrance is one root; chords/comping are a different genre.
- **Instead:** static root + drone + intervals. If you need movement, change
  one note every 8–16 bars, not a 4-chord loop.

### Acid with too many different notes / jumps
- **Symptom:** the "acid" sounds like a random melody; no hypnotic cell.
- **Why:** many pitch classes and octave jumps; no repetition.
- **Instead:** repeat one note rhythmically; use m2/m3 as accents, occasionally
  m6. Pulse (straight 16ths) or gallop (3-3-2); the filter does the variation.

### Clunky 1-bar broken-chord lead
- **Symptom:** the lead sounds like a MIDI arpeggio exercise.
- **Why:** a 1-bar broken chord repeated; no direction, no rests, no register
  change.
- **Instead:** if you want an arpeggio, make it 2 bars, wide and directional
  (F#5→F#6), with returns and a jump. Or use a sparse melodic phrase with
  rests.

### Too many notes in a sparse melody
- **Symptom:** the "sparse" melody is a wall or disappears.
- **Why:** no gain/release compensation; or no rests; or no phrase length.
- **Instead:** 1 note, rest, 3-note group, rest; 4-bar phrase; longer release
  and a small gain lift. The space is the hook.

### Mutating the riff every bar
- **Symptom:** the riff never settles; no hypnosis.
- **Why:** changes on every bar instead of 8/16-bar boundaries.
- **Instead:** keep the cell for 8/16 bars; change one note on a boundary;
  break melody in 4-bar chunks.

### No dynamic cutoff on the lead
- **Symptom:** the lead is static and gets buried.
- **Why:** one cutoff value for a whole section.
- **Instead:** slow LFO on the base + section automation; for long notes use
  `lpdepth`/`lpsync`; delay/reverb help, but do not replace movement.

## 4. Psy FX inserts

### FX on every bar / in the drops
- **Symptom:** the track is cluttered; the FX compete with the melody.
- **Why:** no masks, no placement; FX treated as a continuous layer.
- **Instead:** the fat low is a **layer** and hits every 4 bars (from the
  intro; every second hit A0); laser/bubble/crunch are 1-in-8/16 in the gaps (intro/groove/build/
  outro), not in dense drops/lifts. Use 8/16-bar masks and timeline gates.

### High, thin "droplets" as the main FX
- **Symptom:** the FX sound like a ringtone; no weight.
- **Why:** high sine/FM clicks with a third/chord; too many notes; too often.
- **Instead:** bubble = 4 neutral clicks, root + m2 only (F#6/G6), one bar in
  16. For weight use the fat low layer: A1 from the intro, one note every 4 bars,
  every second hit A0; cutoff 1800–2400 (4-bar LFO), resonance 14–24 (8-bar
  LFO), attack, strong echo, unison/drive/pan. Do not use m3 in the bubble — it gets poppy.

### One-shot FX with no space
- **Symptom:** the FX is dry and disconnects.
- **Why:** no pan, delay, room; no phrase.
- **Instead:** pan LFO/random, delay (3/8), short room; use a 4-bar mask so it
  appears as a phrase, not a random hit.

### One reverb per FX / too many risers
- **Symptom:** washed-out, long tails, CPU.
- **Why:** multiple reverb sizes; risers in every section.
- **Instead:** one shared `roomsize`; a riser only in build/break; a reverse
  crash at the entry, not everywhere.

## 5. Arrangement

### No kick+bass intro / too many layers at bar 1
- **Symptom:** the track starts cluttered; no DJ entry.
- **Why:** everything at once; no subtraction.
- **Instead:** 16 bars kick+bass; add hats (16–32), clap/snare (32–48), open
  hat/percussion (48–64); remove elements for the break.

### Open hat running >64 bars
- **Symptom:** fatigue; the "rolling" stops feeling like a lift.
- **Why:** no reset.
- **Instead:** reset the open hat at a break, or drop it for 8–16 bars; bring
  it back with the drop.

### Static 4-bar loop
- **Symptom:** the track is a loop, not a journey.
- **Why:** no 8/16-bar changes; no build/break.
- **Instead:** form: INTRO → GROOVE → LIFT → BREAK → BUILD → DROP → GROOVE 2
  → PEAK → BREAK 2 → OUTRO; changes on 8/16; big ones on 16/32.

### Break melody not developed
- **Symptom:** the break is a repeated 1-bar pluck; no arc.
- **Why:** no extension, no variation.
- **Instead:** 1-bar motif ×4 = 4-bar chunk; four chunks: base / first +1,
  third +2 / base / first and third −2. 16 bars of development without chords.

### No subtraction / 10 layers
- **Symptom:** muddy, no space, no contrast.
- **Why:** adding instead of removing.
- **Instead:** if a section is muddy, remove an element; keep 2–4 accents, not
  10 "just in case" layers.

## 6. Mix

### Lead hidden under the pad/bass
- **Symptom:** the melody is there but not audible.
- **Why:** pad/bass levels too high; lead too quiet.
- **Instead:** `levels` check: lead not 2× quieter than the pad; high-pass the
  pad, leave space for the lead; use delay/reverb for presence.

### Too much reverb / big hall
- **Symptom:** everything is far away; no punch.
- **Why:** `room` too high; `roomsize` too big.
- **Instead:** short room, low send; reverb on pads/leads, not on kick/bass.

### Kick/bass fight over 40–80 Hz
- **Symptom:** no weight, or a flabby low end.
- **Why:** both occupy the same band; no EQ separation.
- **Instead:** kick and bass mono; high-pass bass ~30 Hz; notch at the kick
  fundamental if needed; tune the kick away from the root.

### Over-compression / no transients
- **Symptom:** flat, no punch.
- **Why:** heavy compression/distortion on everything.
- **Instead:** short kick, light drive; sidechain 2–4 dB; leave transients.

## 7. Strudel / project-specific

### Mini-notation strings in variables without `m()`
- **Symptom:** the track is silent in the browser; verify flags it.
- **Why:** the transpiler auto-wraps only double-quoted strings; single
  quotes stay plain strings.
- **Instead:** every mini string goes through `m(...)`; build computed strings
  and pass them to `m(...)`; no bare mini strings in variables.

### `.scale`, `chord()`, `voicing()` in the node check
- **Symptom:** `verify` fails with `not a function`; the browser may work.
- **Why:** the node check does not load `@strudel/tonal`.
- **Instead:** use explicit notes/patterns in the track; keep `.scale` for
  experiments; the track must pass `verify`.

### Wrong sample names / banks
- **Symptom:** silence or a missing-sample warning.
- **Why:** `s('sbd')`, `bank('RolandTR909')`, `s('sh')` are not in every map.
- **Instead:** test in stock strudel.cc; load the same maps you use; keep a
  fallback (`bd`, `hh`, `oh`); check the console.

### Negative slider literals
- **Symptom:** the widget shows NaN; the value is wrong.
- **Why:** the slider parser reads the literal.
- **Instead:** use 0…N and apply the sign in code (`.mul(-12)`).

### Dead layers / no gates
- **Symptom:** a layer plays when it should be silent; CPU wasted.
- **Why:** no `gateOf`/`audible`; a loop-only layer stays on.
- **Instead:** `.mask(gateOf(...))` + `.filter(audible)` on every layer;
  `loopLevel=pure(0)` for riser/roll/reverse.

### No checks / no stock strudel.cc
- **Symptom:** it works in the panel, fails in the real player.
- **Why:** panel-only helpers; no static/live check.
- **Instead:** `npm run verify`, `gains`, `cpu`, `levels`, `live`; check in
  stock strudel.cc; commit before experiments.

## 8. Before you commit — quick checklist

- [ ] One root; no chord progression/comping.
- [ ] 12-note rolling bass; sub+top; sustain 0; gap; mono; sidechain.
- [ ] Acid low base + deep envelope; Q 0–4; dynamic cutoff.
- [ ] Riff repeats one note; m2/m3; occasional m6; pulse or gallop.
- [ ] Break melody 4 chunks; lift melody sparse with rests.
- [ ] Fat low every 4 bars from intro (second hit A0); laser/bubble/crunch
  rare; bubble m2 only; not in drops.
- [ ] 16-bar intro; layers; break/build; open hat reset.
- [ ] One roomsize ≤10; lead not hidden; low end mono.
- [ ] `verify` 0; `gains` silent at zero; `cpu` <150/s; `levels` sensible.
- [ ] Played in stock strudel.cc; track catalog/docs updated.
