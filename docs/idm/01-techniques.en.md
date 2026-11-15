# 01 · IDM techniques

Only what is verified by tracks or by the sources in `04-sources`.
Each entry: what it is → how to make it → where it lives in
`01-splinter` → pitfall.

---

## 1. Glitch

**What it is.** Short digital artefacts: sample splinters, stutter,
repeat, hard cut, bit-crush, speed jump. Glitch is not a genre; it is a
way to make an event sound "wrong".

**How to make it.**

- Source: `glitch`, `click`, `noise`, `crackle`, short break slices.
- Time: `chop`, `slice`, `striate`, `splice`, `stut`, `fast`, `slow`.
- Tone: `crush`, `coarse`, `shape`, `distort`, `speed`, `begin/end`.
- Space: short delay, ping-pong, pan, little reverb.
- Probability: `degradeBy`, `sometimesBy` — as spice only.

**In the track.**

- `drums.glitch` — `glitch` fragments with `n` variants, random speed and pan.
- `grain.edit` — 8 micro-pieces through `slice`, speed drifts.
- `padCut` — broken stutter with gaps.
- `padRoll` — 32nd `glitch` roll, momentary.

**Pitfall.** `degradeBy`/`sometimesBy` drop the event at position zero
for any argument (`rand` is 0 at t=0). The first bar may be empty; that
is not a bug, but do not build the groove on it.

---

## 2. Granular

**What it is.** Audio is cut into grains around 1–100 ms; grains can be
layered, scanned, pitched, panned and repeated. Slow = cloud, fast = new
timbre.

**How to make it.**

- `chop(n)` — cut one event into n pieces, play them in order.
- `striate(n)` — spread n pieces across n events.
- `splice(n, idx)` — insert a piece into a step, fitting its speed.
- `slice(n, idx)` — select specific pieces.
- `begin`/`end` — sample window; `speed` — pitch/speed; `pan` — scatter.
- `fast`/`slow` — cloud density.

**In the track.**

- `grain.cloud` — `padlong` → `begin(scan)` → `end(scan+window)` →
  `chop(32)` → `speed` → `fast(density)` → `pan(rand)`. A dry cloud,
  not a reverb pad.
- `grain.scan` — position moves on `sine.slow(rate)`.
- `grain.freeze` — fixed position, `padFreeze` holds it.
- `grain.edit` — micro-montage through `slice`.

**Pitfall.** Grains across transients cause flamming (double hits). Use
a short window for drums and a long window with low density for pads.

---

## 3. Micro-events

**What they are.** Clicks, ticks, squeaks, short notes between beats.
They do not carry harmony; they carry rhythm and texture.

**How to make them.**

- Separate tracks: `click`, `rim`, `sh`, short `white`.
- Explicit `struct` patterns, not continuous 16ths.
- High register, short `decay`, `sustain(0)`.
- Pan and delay instead of reverb.

**In the track.**

- `drums.click` — dry dots at 1, 4, 7, 10, 13, 15.
- `drums.squeak` — high sine with pitch envelope and FM.
- `bits.noise` — white noise as short ticks.
- `drums.glitch` — fragments between beats.

**Pitfall.** Micro-events must not collide with kick/sub in position or
band. Keep them above 1 kHz; leave the low end to bass.

---

## 4. 8-bit

**What it is.** Limited voices, pulse/square, noise channel, fast
arpeggios instead of chords, reduced bit depth/rate.

**How to make it.**

- `s("pulse")` + `pw(...)` — duty cycle.
- `s("square")` — harder and simpler.
- `crush(1…16)` — bit-crush; `coarse` is harsher but not everywhere.
- `arp(run(8/16/32))` — a chord becomes an arpeggio, NES/Game Boy style.
- Short `decay`, `sustain(0)`, high register.

**In the track.**

- `bits.lead` — `pulse` + `pw` + `crush`, sparse notes.
- `bits.arp` — `square` + `arp(run(rate))`, 8/16/32 notes per bar.
- `bits.noise` — noise ticks with `crush`.
- `drums.squeak` — FM squeak, same aesthetic.

**Pitfall.** `crush` is a worklet per event. Do not put it on 16th hats;
keep it on sparse layers (lead, arp, rare noise).

---

## 5. Acid

**What it is.** A 303 line: saw/square, resonant filter, filter
envelope, accent, glide. In IDM it works as an atonal riff, not as
chord arpeggiation.

**How to make it.**

- `s("sawtooth")` or supersaw, `detune(0.5)`, `unison(1)`.
- `lpf` + `lpq` + `lpenv` + `lpa/lpd/lpsustain`.
- `ftype("ladder")` + `drive` — filter grit.
- `glide` only on selected 16ths (gate without `<…>`).
- Accent = louder AND brighter in one move.
- Sparse: 3–5 notes per bar, wide intervals.

**In the track.**

- `acid.line` — `ACID` phrase, `.slow(pace)`, glide on three 16ths.
- `acid.run` — same line an octave up, 16ths.
- `acid.scream` — square + `shape` + `crush`, rare and quiet.

**Pitfall.** Dense 16th flow + chromatic movement + glide = bubbling.
Glide on every note = portamento. Gate is `"0 0 1 …"` without angle
brackets.

---

## 6. Bass: sub + rough mid + rubber

**What it is.** In IDM bass is not only low end. It is pressure (sub),
grit (mid) and rubber (FM/pitch envelope).

**How to make it.**

- Sub: sine, `lpf` ≤80, short attack, long decay.
- Growl: two detuned saws, `lpq` 6–12, slow filter LFO, `shape` for
  roughness. Cutoff above 80 is deliberate; this is not the sub.
- FM rubber: `s("sine"/"triangle")` + `fm(index)` + `fmh(ratio)` +
  short `fmdecay`. Ratio 1.2–2.5, index 2–4.
- Slide: `.slide(0.02)` on growl, `penv` for the hit.
- `shape`/`distort` before output `gain` (the engine applies effects
  before gain). Drive up, then trim the volume.

**In the track.**

- `bass.sub` — sine ≤80.
- `bass.growl` — saws, LFO, `shape`, `.slide`.
- `bass.fm` — triangle + FM, short rubber hit.
- `padDrop` — sub drop on a pad.

**Pitfall.** Growl is not the foundation; the sub already is. Keep
growl around 150–400 Hz or the mix turns to mud.

---

## 7. Drums

**What it is.** A broken beat where the pattern matters more than the
timbre. Kick is often muted, snare avoids 2/4, hats are dust, not a
metronome.

**How to make it.**

- Kick: `bd`, `lpf` 150–250, `shape`, short decay.
- Snare: `sd`, ghosts, shifts, `hpf` 180.
- Hats: 16ths/32nds, `swingBy`, gain accents.
- Clicks/glitch: separate tracks, not inside hats.
- Modes: four patterns, each with its own layer set.

**In the track.**

- `mode` 0 GLITCH — broken kick, 32nd ghosts, clicks, glitch.
- `mode` 1 GRAIN — halfstep, sparse.
- `mode` 2 ACID — four-on-the-floor, more air.
- `mode` 3 STRIP — one kick, rim/clicks.

**Pitfall.** Do not put `shape`/`crush` on hats: a worklet per event.
Hats must stay cheap.

---

## 8. Space: little reverb

**What it is.** IDM reverb is often short and dry; space comes from
delay, pan, stereo scatter and different short tails.

**How to make it.**

- `room` 0.1–0.3, `roomsize` 1–4.
- Delay 0.25–0.375 cycles, feedback 0.3–0.6, filtered repeats.
- Pan with `rand`, `sine.slow`.
- Different tail lengths per layer.

**In the track.**

- `verb` defaults to 0.18, `fx.reverb.size` is 3.
- Delay is the main spatial effect.
- The cloud is dry: `room(verb.mul(0.2))`.

**Pitfall.** A big reverb turns a granular cloud into an ambient pad
and kills micro-detail. Keep the cloud dry.
