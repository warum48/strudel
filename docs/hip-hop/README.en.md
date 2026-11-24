# Hip-hop — playbook (synth/electronic, instrumental)

A practical brief for writing hip-hop in this project: fat, swinging drums with
sampled character, punchy bass, and a groove people nod to. **We are not SUNO**:
no vocals, no imitation of acoustic instruments (see `docs/rules.en.md`). We
write code for browser synthesizers; "live-sounding" comes from samples,
layering and timing, not from faking a sax.

## 1. Tempo and feel

| Sub-style | BPM | Feel |
|---|---|---|
| Boom-bap / classic | 80–95 (usually 85–90) | snare on 2 & 4, swung 8ths/16ths, dusty |
| Lo-fi / chill | 70–85 | lazy swing, vinyl noise, soft transients |
| Trap / drill | 130–150 | **half-time** feel: snare on beat 3 of a 2-bar frame, 16th/triplet hats |
| Instrumental / beat tape | 75–100 | loop-first, sparse, leaves room |

Half-time (Wikipedia): the backbeat interval doubles — instead of snare on 2 & 4
of a 4/4 bar, it lands on 3 and 7 across two bars; notes "sound" twice as slow
while tempo stays the same. Most modern trap is written in 4/4 but *heard* in
half-time.

## 2. What "swing" and "groove" actually are

- **Swing** = unequal subdivision of a pulse. Ratios range from 1:1 (straight) to
  3:1 (hard/dotted); 2:1 is the classic triplet feel. The ratio is typically
  **wider at slow tempos and narrower at fast tempos** (Friberg & Sundström 2002).
  On MPC-style gear the swing control is usually 50% (straight) to ~66%
  (triplet-ish); subtle hip-hop sits around 54–62%.
- **Groove** = the felt cycle that makes you move; research frames it as
  sensorimotor coupling and entrainment — recurring pulses, a cycle, and
  synchronised body response (Pressing 2002; Janata et al. 2011).
- **"Participatory discrepancies"** (Prögler 1995; Keil): players sit slightly
  ahead/behind the grid; that tension is part of the feel. J Dilla famously
  turned quantize off on his MPC for an "off-kilter" pocket.
- But exactitude is not automatically bad: Frühauf/Kopiez/Platz (2013) found the
  strongest groove in some modern drum patterns with **no microtiming
  deviations**. Microtiming is stylistic, not a magic "humanize" button.

**Why people nod:** a stable pulse the body can predict, a strong backbeat,
syncopation against that pulse, weight in the sub/bass, repetition, and small
timing/velocity tensions that keep it alive. Remove the pulse and it stops
working; remove the tension and it becomes stiff.

## 3. Drums — "fat" and sampled character

The core is kick, snare, hats. Classic tools: TR-808/909, Oberheim DMX, E-mu
SP-1200, Akai MPC (sampling + sequencing, 4x4 pads). Hip-hop drums are usually
**sampled or drum-machine sounds, often layered**, not a clean acoustic kit.

**Kick:** layer 2–3 parts — sub (≈45–65 Hz sine/triangle), body (≈80–120 Hz),
click/attack (≈2–5 kHz). High-pass everything above the sub you don't need.
Short-to-medium decay, saturation for harmonics, light compression. Sidechain
the bass to the kick (see §4).

**Snare/clap:** strong on the backbeat. Combine a body (200–400 Hz) with noise
(2–6 kHz). Ghost notes = very soft snare hits between main notes, usually on
16ths — they create a "subtle 16th-note feel around a strong backbeat"
(Wikipedia, *Ghost note*). Vary velocity, don't machine-gun them.

**Hats:** 8ths or 16ths; velocity accents every 2nd/4th hit; occasional
open hat; triplet rolls and stutters in trap. Pan slightly; keep them out of the
sub range (high-pass ≈500–800 Hz).

**Swing in Strudel:** `...swingBy(0.06, 8)` (0.02–0.10 is subtle; too much at
fast tempo sounds drunk). For Dilla-style looseness use `.late()`/`.early()` on
individual hits or `sometimesBy` to nudge.

## 4. Bass — punchy, not muddy

- Split the job: **sub** (sine/triangle, 30–60 Hz) + **mid/harmonic** layer
  (80–250 Hz, saturated saw/square or a filtered sample). Punch is mid-range
  attack + short decay, not just loud sub.
- **808-style:** long sustained sine with glide/portamento, tuned to the key,
  distortion to add harmonics so it reads on small speakers.
- **Sidechain/duck to the kick** so the low end doesn't fight. Keep kick and
  bass **mono** below ~100–120 Hz; pan only the upper harmonics if at all.
- In Strudel: `duckorbit(...)`/`duckdepth(...)` on the kick (as in the techno
  tracks), `.lpf(...)`, `.distort(...)`, `.clip(...)`, short `.decay()`.

## 5. Harmony and textures (electronic only)

- Minor keys, 7th/9th chords, Rhodes/electric-piano-like timbres, Moog-like
  mono leads, synth brass — **not** fake horns, strings or voices.
- Sample-like chops: short filtered chords with `clip`, slight detune, low-pass
  and vinyl-ish noise (pink noise bed, very quiet).
- Keep the mid-range clear for the (absent) vocal: leave a pocket around
  1–4 kHz; don't stack pads and chops in the same octave.

## 6. Arrangement

- Loop-first: 2/4/8-bar cells; intro → verse pocket → hook → break → hook.
- Energy via **density, filter, decay and subtraction**, not volume.
- Leave space: an instrumental beat still breathes where a vocal would sit.
- Drops and stops are part of the groove; silence is a drum.

## 7. Mix

- Center: kick, snare, 808/sub, lead. Pan: hats, shakers, chops, noise.
- Kick + 808 clash → EQ carve + sidechain (Wikipedia, *Hip-hop production*).
- Saturation on drums for presence; light glue compression on the drum bus.
- Short room reverb on snare/clap; keep the sub dry.
- Check mono: the beat must survive on a phone speaker (that is the "nod" test).

## 8. Strudel implementation notes

- Mini-notation only through `m(...)` (hard rule; see `docs/pitfalls.en.md`).
- Sections: `const TIMELINE` + `tlCurve`/`tlOr`/`gateOf`; automation:
  `const AUTOMATION` + `autoCurve`/`autoAt` (copy from
  `tracks/coldwave/03-cold-rooms-v3.js`).
- Drums: `s('bd').struct(m('x*4'))`, `s('sd').struct(m('~ x ~ x'))`,
  `s('hh').struct(m('x*8')).gain(m('[.8 .3 .6 .4]*2'))`.
- Groove: `swingBy(0.06, 8)`, `.late(1/64)` nudges, `sometimesBy` variations.
- Bass: `note(m('...'))` + `.s('sine')`/`sawtooth`, `.lpf`, `.distort`,
  sidechain via `duckorbit`.
- Scratch without vocals: take a short percussive sample and splice it
  back-and-forth, e.g.
  `s('cb').splice(16, m('0 1 0 1 3 1 0 1')).hpf(300).lpf(6000)`.
  `splice(n, idx)` re-plays slices, so the same slice alternating sounds like a
  turntable scratch. No rapper/vocal samples needed.
- Starter shape: `tracks/_selected/new-track.js`; full reference:
  `tracks/coldwave/03-cold-rooms-v3.js`; dark mix example:
  `tracks/hip-hop/03-black-ice-v3.js`.

## 9. Checks

```bash
npm run verify -- tracks/hip-hop/NN-slug.js
npm run gains  -- tracks/hip-hop/NN-slug.js
npm run cpu    -- tracks/hip-hop/NN-slug.js      # ≤ ~150 worklets/s
npm run levels -- tracks/hip-hop/NN-slug.js 34   # no zero-volume events
```

## 10. Avoid

- Fake acoustic soloists (sax/flute/violin/trumpet) and vocals — answer plainly
  if asked; offer an electronic timbre instead.
- Over-quantized stiffness **and** blanket "humanize" on everything; decide
  where the tension lives.
- Reverb wash, sub on every element, kick+808 unmixed.
- Filling all 16ths; the pocket is defined by what you leave out.
- Swing so hard it drags at 140 BPM.

## 11. Authoritative tutorials (links checked)

- **Attack Magazine — Beat Dissected** (pro series; one beat per article with
  full 16-step grid, tempo, sample choices): https://www.attackmagazine.com/technique/beat-dissected/
- **Attack — "Drunk Drummer-Style Grooves"** (J Dilla / Flying Lotus / Kaytranada;
  quintuplet/sextuplet/septuplet grids, flams, off-grid bass):
  https://www.attackmagazine.com/technique/beat-dissected/drunk-drummer-style-grooves/
- **Attack — "Low-End Theory"** (LA beat scene, wonky downtempo, low-end focus):
  https://www.attackmagazine.com/technique/beat-dissected/low-end-theory/
- **Attack — "Chillout: Raw strip-hop"** (downtempo strip-hop grooves):
  https://www.attackmagazine.com/technique/beat-dissected/chillout-beat-raw-strip-hop/
- **Attack — The Secrets of Dance Music Production** (book, authoritative):
  https://store.attackmagazine.com/collections/books/products/the-secrets-of-dance-music-production-book
- **Sound On Sound — Techniques** (long-form, engineer level):
  https://www.soundonsound.com/techniques
  - Mixing / Production: https://www.soundonsound.com/mixing-production
  - Drum Machines: https://www.soundonsound.com/drum-machines
  - Samplers / Sampling: https://www.soundonsound.com/samplers-sampling
- **Ableton — Learning Music** (official interactive: beats, backbeats, chords,
  basslines, song structure — basics, but concrete):
  https://learningmusic.ableton.com/

Read one Beat Dissected per sub-style before writing; copy the *grid and
timing*, not the samples.

## 12. Concrete examples

Velocity shorthand: `.` rest · `X` accent · `x` normal · `g` ghost.
Steps are 16ths in one 4/4 bar.

### Boom-bap, 90 BPM

```
step   01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16
kick   X  .  .  .  .  X  .  .  X  .  .  .  .  X  .  .
snare  .  .  .  .  X  .  .  .  .  .  .  .  X  .  .  .
ghost  .  .  g  .  .  .  g  .  .  g  .  .  .  .  g  .
hat    X  x  x  x  X  x  x  x  X  x  x  x  X  x  x  x
```

```js
$: s('bd').struct(m('x ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~ ~'))
$: s('sd').struct(m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'))
$: s('sd').struct(m('~ ~ x ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x')).gain(0.16) // ghosts
$: s('hh').struct(m('x*16')).gain(m('[.9 .3 .6 .35]*4')).swingBy(0.06, 8)
```

Note: kick on 1 / 2& / 3 / 4&, snare on 2 and 4, ghost 16ths around the
backbeat — this is the pocket. Swing ratio ≈ 3:2 at this tempo; do not push
past ~8%.

### Trap / drill, 140 BPM (half-time heard)

```
step   01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16
kick   X  .  .  .  .  .  .  .  .  .  X  .  .  .  .  .
snare  .  .  .  .  .  .  .  .  X  .  .  .  .  .  .  .
hat    x  x  x  xxx x  x  x  xxx x  x  x  xxx x  x  x xxx
```

```js
$: s('bd').struct(m('x ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~'))
$: s('sd').struct(m('~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~'))
$: s('hh').struct(m('x*16')).sometimesBy(0.25, (x) => x.stut(3, 1/24, 0.8))
```

Snare on beat 3 = the half-time feel; the "fast" hats are what makes it read as
140, not 70.

### J Dilla recipe (from Attack)

Fit **5 / 6 / 7** equal notes into one beat (quintuplet/sextuplet/septuplet) and
place hits from different grids so downbeats line up but everything else is
slightly off. Flams (two quick hits) and off-grid bass continue the motif. In
Strudel: nudge individual hits with `.late(1/64)` / `.early(1/64)`, or
`sometimesBy(0.3, x => x.late(1/64))`; do not blanket-humanize everything.

### Bass riff, D minor (punchy)

```js
$: note(m('d2 ~ d2 ~ f2 ~ a2 ~ d2 ~ f2 ~ a2 ~ c3 ~'))
  .s('sawtooth').lpf(220).lpq(6).clip(0.9)
  .decay(0.10).sustain(0.5).release(0.05).gain(0.5)
```

Add a sub layer on the same notes (`s('sine').lpf(90)`) and sidechain it to the
kick (`duckorbit` / `duckdepth`); keep both mono below ~120 Hz.

### Chord loop, Dm9 → Gm9 → A7♭9 (Rhodes-like synth, never acoustic piano)

```js
const CHORDS = note(m('<[d3,f3,a3,c4,e4] [g3,bb3,d4,f4,a4] [a3,db4,e4,g4,bb4]>'))
$: CHORDS.slow(2).s('triangle').unison(2).detune(0.08)
  .lpf(1800).attack(0.01).decay(0.4).sustain(0.4).release(0.6).gain(0.18)
  .room(0.3)
```

Voicings: Dm9 = D F A C E; Gm9 = G B♭ D F A; A7♭9 = A C♯ E G B♭ (spelled `db`).
Keep this in the mid-range; leave 1–4 kHz for a (future) vocal.

## 13. Dark hip-hop

Darkness is **harmonic + spatial**, not just slow:

- **Scales:** Phrygian (♭2 — the "menace" note), harmonic minor (♯7 adds a
  leading-tone bite), and the ♭II "Neapolitan" move. A tritone or a minor 2nd
  held against the root does more than any "dark" preset.
- **Motif:** 3–5 notes, mostly stepwise with one semitone crunch (e.g. D–E♭–F–A–B♭–A–C♯–E♭).
  Repeat it; let the filter open it across sections.
- **Low end:** short root notes / 808 hits and short chord stabs, not a long
  humming drone. A sustained ♭2 drone reads outside hip-hop — avoid it. If you
  want a bed, a quiet filtered root+fifth pad and only in some sections.
- **Drums:** either half-time (snare on 3) or punchy boom-bap with a heavy kick.
  Sliding 808 under the kick, ghost snares, sparse rim/clap; hats can be
  triplet-ish but leave holes.
- **Space:** short dark room on snare/rim, a low pink-noise bed, tape/vinyl
  grit on the bus; keep the sub dry. Saturation on kick/808 for phone speakers.
- **Arrangement:** drone + motif can carry the intro; drop drums for a bar
  before the hook. Silence is menace.

Reference implementation: `tracks/hip-hop/01-black-ice.js` — 88 BPM, D Phrygian
motif with a C♯ accent, punchy boom-bap verses, half-time hooks with clap and
triplet hats, a noise-riser break, short Dm7/Bb/Gm/A7 stabs (no long drone), and
a sliding 808 ducked under the kick.

Dark-specific tutorials (links checked):

- Attack — **UK Drill** (half-time, sliding 808, syncopated kicks):
  https://www.attackmagazine.com/technique/beat-dissected/uk-drill/
- Attack — **Make UK Drill (Dutchavelli / M24)**:
  https://www.attackmagazine.com/technique/beat-dissected/make-uk-drill-in-the-style-of-dutchavelli-or-m24/
- Attack — **Creating 808-Style Basslines** (glides, layers, distortion):
  https://www.attackmagazine.com/technique/tutorials/creating-808-style-basslines-for-jungle-trap-and-footwork/
- Attack — **Choosing The Right Key For Bass Weight**:
  https://www.attackmagazine.com/technique/passing-notes/choosing-keys-for-bass-weight/
- Real World Music Theory — **Phrygian for dark/eerie moods**:
  https://realworldmusictheory.com/how-to-create-dark-eerie-and-foreboding-moods-with-the-phrygian-mode/

## Sources (checked)

- Swing time — ratio 1:1–3:1, triplet 2:1, wider at slow tempos:
  https://en.wikipedia.org/wiki/Swing_time
- Friberg & Sundström (2002), swing ratios vs tempo — cited ibid.
- Groove — sensorimotor coupling, entrainment, Pressing 2002, Prögler 1995:
  https://en.wikipedia.org/wiki/Groove_(music)
- Frühauf, Kopiez & Platz (2013), microtiming vs groove quality — cited ibid.
- Hip-hop production — drum machines, sampling, MPC, kick/808 mixing:
  https://en.wikipedia.org/wiki/Hip-hop_production
- Akai MPC — sampling/sequencing, J Dilla disabled quantize:
  https://en.wikipedia.org/wiki/Akai_MPC
- Half-time — backbeat interval doubled, half-time shuffle in hip-hop:
  https://en.wikipedia.org/wiki/Half-time_(music)
- Ghost note — soft 16th snare hits around a strong backbeat:
  https://en.wikipedia.org/wiki/Ghost_note
