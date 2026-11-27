# Big Beat — practice material: steps, scales, riffs

**Evidence honesty:** I cannot audition audio in this environment. Everything
below comes from written sources (tabs, beat grids, sampled-note listings,
technical deconstructions), and every claim is tagged:

- `[D]` documented in a source (interview, sample credit, tutorial instruction);
- `[T]` transcribed tab / note listing in a source;
- `[B]` "by ear" analysis published by a source (explicitly not a fact about
  how the record was made);
- `[R]` my playable reconstruction from those facts — **not** an exact copy.

Check `[R]` material by ear against the real records before treating it as a
transcription. Full source list at the end and in `05-sources.en.md`.

Notation: one bar of 4/4 = 16 steps (1/16 notes). `X` accent, `x` quiet/ghost,
`.` rest, `o` open hat. Step 1 = beat 1, step 5 = beat 2, step 9 = beat 3,
step 13 = beat 4. Mini-notation in code always goes through `m(...)`
(`docs/pitfalls.en.md`).

## 1. Tempo → milliseconds (for programming delays and rolls)

| BPM | bar | beat | 1/16 | dotted 1/8 | Source |
|---:|---:|---:|---:|---:|---|
| 109–109.5 | 2192–2202 ms | 549–550 ms | 137 ms | 411 ms | "Block Rockin' Beats" tap/tempo `[D]` |
| 121 | 1984 ms | 496 ms | 124 ms | 372 ms | "Chemical Beats" AcousticBrainz `[B]` |
| 125 | 1920 ms | 480 ms | 120 ms | 360 ms | "Busy Child" (98% key/tempo agreement) `[D]` |
| 130 | 1846 ms | 462 ms | 115 ms | 346 ms | Attack Beat Dissected `[D]` |
| 132 | 1818 ms | 455 ms | 114 ms | 341 ms | onefootstep archetype `[B]` |
| 141.5–143 | 1678–1696 ms | 420–424 ms | 105–106 ms | 315–318 ms | "Firestarter" `[D]` |
| 152 | 1579 ms | 395 ms | 99 ms | 296 ms | "Rockafeller Skank" `[D]` |

## 2. Drum patterns by 16th steps

### A. Attack Magazine big-beat techno (130 BPM) `[D]`

```
step   1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
kick   X . x x X . x x X .  x  x  X  .  x  x
rim    X . . . X x . . X .  .  .  X  x  .  .
hat    . . x . . . x . . .  x  .  .  .  x  .
tom    . . . . . . . . . .  .  .  .  x  .  .
```

`x` kicks on the last two 16ths of each beat are the article's "fake
sidechain" trick (`−10 dB` at step level in the onefootstep build version).
Rim = sample 24, layered on the kick and additionally on the 2nd 16th of
beats 2 and 4; low tom = 200 ms decay, pitched down 3 st, slightly early.

```js
$: s('bd').struct(m('x ~ .7 .7 x ~ .7 .7 x ~ .7 .7 x ~ .7 .7'))
$: s('rim').struct(m('x ~ ~ ~ x [.7] ~ ~ x ~ ~ ~ x [.7] ~ ~'))
$: s('hh').struct(m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~')).hpf(6000)
```

`s('rim')` needs a declared sample map (see `tracks/hip-hop/01-black-ice.js`)
or `.bank('RolandTR808')`; the grid above describes the hits, not a sample
choice.

### B. "Block Rockin' Beats" break construction `[D]` + `[R]`

Documented by Mind Flux's sample teardown (109.5 BPM tap): drums from Bernard
Purdie's "Changes" (~90 BPM original); the used part runs **3 bars + 3 six-
teenths**; one segment is a dotted 8th (3 sixteenths); the fill covers the
**last 3 beats of bar 4**; an open-hat variation enters at **bar 5, step 8**
(last 16th of beat 2) and repeats 3 bars until the fill; the vocal stab hits
**step 1 for 3 bars, rests 1 bar**. Exact hit positions are in screenshots,
not text — the grid below is `[R]`:

```
bar 1  kick/snare fragments on steps 1,4,7,10,13   (3/16 apart, dotted-8th feel)
       vocal stab step 1
bar 2  same 5 fragments; vocal stab step 1
bar 3  same 5 fragments; vocal stab step 1
bar 4  steps 1-4 normal; fill steps 6,8,10,12,14,15,16 (8ths → 16ths)
       vocal rest
bar 5  + open hat on step 8; 3-bar loop, then fill
```

```js
$: s('amen').slice(8, m('0 1 2 3 4 5 6 7'))
$: s('hh').struct(m('~ ~ ~ ~ ~ ~ ~ o ~ ~ ~ ~ ~ ~ ~ ~'))
$: s('sd').struct(m('x ~ ~ x ~ ~ x ~ ~ x ~ ~ x [1 [1 1]]'))
```

### C. Break stack + build (132 BPM archetype) `[B]`/`[R]`

From the Ableton 12 Sound Design Atlas deconstruction (explicitly an
*archetype*, not a transcript): three breaks (main / weight / top) sliced to
**16 slices over 2 bars** — one slice = one 1/8 = 227 ms; weight LP 400 Hz,
top HP 3 kHz; one-shot kick and snare only where the break already hits,
nudged 2–5 ms to its transients.

```
build (4 bars):   HP on drums 30 Hz → 2 kHz; sample rate 44 → 8 kHz in last 2 bars
fake pump:        ghost kicks steps 3,4,7,8,11,12,15,16 at -10 dB
snare roll:       steps 1..16 in last bar, 8ths → 16ths, velocity 70 → 127
last beat:        silent except the shout (steps 13-16)
breakdown:        kick step 1 only, snare step 9, hats unchanged, LP 900 Hz
```

```js
$: s('sd').struct(m('[.55 .6 .65 .7 .75 .8 .85 .9 .92 .94 .96 .98 1 1 1 1]'))
$: s('bd').struct(m('~ .3 .3 ~ ~ .3 .3 ~ ~ .3 .3 ~ ~ .3 .3 ~'))
```

### D. Sliced break + 909 (135 BPM) `[D]`

MusicRadar's big-beat recipe: keep the original two-bar break almost intact,
add a couple of kick hits at the **end of the two-bar loop**, layer a 909 kit
(kick on "1", snare) for contrast, and use a hat loop for breakdowns. Do not
quantise the break; keep the electronic layer clean and glue both with tape
sim/compression.

## 3. Scales and keys

Key-detection sites disagree because they analyse different masters and
different sections; the *tabbed/chord* evidence is stronger. Use the rightmost
column to write.

| Reference | Tempo | Key evidence | Notes to play |
|---|---|---|---|
| Block Rockin' Beats | 109 `[D]` | E minor `[B]`, A# minor / Db major (detectors disagree); bass notes E1–A#1–C2 `[T]` | E minor leaning blues: **E G A A# B D** (C and D# as passing notes) |
| Chemical Beats | 121 `[B]` | G# minor (getsongkey), F major 49% (AcousticBrainz) — disagree; Juno-106 + Boss Heavy Metal pedal `[D]` | **G# B C# D# F#** (G# minor pentatonic) |
| Firestarter | 141.5–143 `[D]` | F# major 90% agreement `[D]`; also B / 1B; chords F#7 and B7 `[T]` | **F# G# A# B C# D# E** or B mixolydian **B C# D# E F# G# A** |
| The Rockafeller Skank | 152 `[D]` | G major `[D]`, G minor (DJ software), chords **Gm–Bb–C** `[T]` | **G A A# C D D# F** (G natural minor) + chromatic G#/F# passing |
| Busy Child | 125 `[D]` | E♭ major 98% `[D]`; A# minor, B major also reported | **C D# F G A#** (C minor pentatonic) for the acid line |
| 132-BPM archetype | 132 `[B]` | E minor, blues-leaning `[B]` | **E G A A# B D**; fuzz bass E0/E1, acid E2–E3 |

Practical mapping: **root + b5 + b6** (E–A#–C) is the Block Rockin' bass
colour; **root + 3 + b7** (A4/G#4 over F#7/B7) is the Firestarter riff colour;
**minor 1–b3–4–5–b6** (Gm–Bb–C) is the Fatboy surf-riff colour.

## 4. Riffs: note + rhythm tables

### 4.1 Block Rockin' bass `[T]` notes, `[R]` placement

Mind Flux isolates three notes from The Crusaders' "The Well's Gone Dry":
**E1 → A#1 → C2**, with a final note C2 pitched up 3 semitones (**D#2**); a
one-bar pattern repeated through the track. Exact step positions are not in
the text, so the placement below is a sketch.

```
step   1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16
note  E1  .  .  .  A#1 .  .  .  C2 .  .  .  D#2 .  .  .
```

```js
$: note(m('e1 ~ ~ ~ bb1 ~ ~ ~ c2 ~ ~ ~ eb2 ~ ~ ~'))
  .s('sawtooth').lpf(550).gain(0.28).duckorbit(2).duckdepth(0.4)
```

### 4.2 Firestarter wah riff `[T]` tab → notes, `[R]` rhythm

Published tab (standard tuning): intro B-string 11 = **A#4**, G-string 13 =
**G#4** (bend to A4), B-string 9 = **G#4**, B-string 13 = **C5**. Verse:
G-string 14 = **A4** repeated 7×, then fret 13 = **G#4** 6×, then A4 again.
Tab gives no durations; play one 8th per repeated note as a starting point.

```
step  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16
verse A4 A4 A4 A4 A4 A4 A4 A4 G#4 G#4 G#4 G#4 G#4 G#4 A4 A4
intro A#4(bend) G#4 A#4 C5   (hold/answer, then the verse figure)
```

```js
$: note(m('a4*8 ab4*6 a4*2')).s('sawtooth').lpf(1800)
  .gain(0.22).distort(0.6)   // wah-like sweep comes from the filter, not a vocal
$: note(m('bb4 ab4 bb4 c5 ~ ~ ~ ~')).s('sawtooth').lpf(2200).gain(0.18)
```

### 4.3 Rockafeller Skank surf riff `[T]` tab → notes, `[R]` rhythm

Tab: D-string fret 5 = **G3** stabs; G-string fret 7 bend to 8 = **D4 → D#4 → D4**;
D-string fret 6 → 5 = **G#3 → G3** (chromatic approach). Chords used through
the song: **Gm, Bb, C** `[T]`.

```
step     1  2  3  4  5   6   7    8   9  10 11 12 13 14 15 16
riff     G3 G3 G3 G3 D4  D#4 D4   G#3 G3 .  .  .  .  .  .  .
chords   Gm .  .  .  Bb  .   .    .   C  .  .  .  Gm .  .  .
```

```js
$: note(m('g3*4 d4 eb4 d4 ab3 g3 ~ ~ ~ ~ ~ ~ ~')).s('sawtooth')
  .lpf(3000).gain(0.2)
$: note(m('<[g3,bb3,d4] [bb3,d4,f4] [c4,e4,g4] [g3,bb3,d4]>')).slow(4)
  .s('sawtooth').lpf(2200).gain(0.14)
```

### 4.4 Acid line over fuzz bass `[B]`/`[R]`

onefootstep's 132-BPM archetype: fuzz bass owns 40–200 Hz on E0/E1; the acid
lives at E2–E3, high-passed at 150 Hz. Keep the notes, vary accents and slide
every 8 bars; choose a 303-like patch (saw, LP24, high resonance, mono, glide).

```
step   1  2  3  4  5  6  7   8  9  10 11 12 13 14 15 16
note   E2 .  G2 .  A2 .  A#2 E3 .  G2 .  A2 .  B2 D3 A#2
acc    X  .  x  .  X  .  x  .  X  .  x  .  X  .  x  .
```

```js
$: note(m('e2 ~ g2 ~ a2 ~ bb2 e3 ~ g2 ~ a2 ~ b2 d3 bb2'))
  .s('sawtooth').lpf(450).hpf(150).gain(m('[1 .6 1 .6 1 .6 1 .6 1 .6 1 .6 1 .6 1 .6]'))
$: note(m('e1*12 e2 ~ g1 ~')).s('sawtooth').lpf(550).gain(0.3)
```

### 4.5 Power-chord stab `[B]`

From the same archetype: Chord +7/+12 (fifth + octave) = power chord. In
Strudel, note pairs inside `m('...')`:

```js
$: note(m('[e3,b3] ~ ~ ~ [e3,b3] ~ ~ ~ [a3,e4] ~ ~ ~ [b3,gb4] ~ ~ ~'))
  .s('sawtooth').lpf(4000).gain(0.14).clip(0.8)
```

## 5. How to verify this by ear (since I cannot)

1. Tap tempo in a DAW with the reference track: Block Rockin' ≈ 109.5 `[D]`,
   Chemical Beats ≈ 121 `[B]`, Firestarter ≈ 142 `[D]`, Skank 152 `[D]`.
2. Solo + low-pass the bass and run a tuner: check the E1–A#1–C2 set `[T]` for
   Block Rockin'; check Gm–Bb–C chords `[T]` for the Skank.
3. Extract the groove from the break and look at the 16-step grid; compare
   with patterns A–D above. Expect **swing from the break**, not from the grid.
4. On the Firestarter tab, play the tabbed frets on a guitar first — the A4/G#4
   pair is unmistakable — then map to the Strudel line.
5. Treat every `[R]` pattern as a *starting sketch*. If it doesn't sound like
   the record, the source didn't print the missing information; fix by ear.

## 6. Sources for this file

- Mind Flux / Michael L Penman — Sample Hacker: Block Rockin' Beats (109.5 BPM,
  bass notes, break construction, vocal placement):
  https://www.mind-flux.com/news-1/2023/1/27/sample-hacker-block-rockin-beats
- Ableton 12 Sound Design Atlas — Big Beat Track (132 BPM, E minor blues,
  E0/E1 bass vs E2–E3 acid, 16 slices over 2 bars, build/breakdown moves):
  https://ableton.onefootstep.us/deconstructions/big-beat-track.html
- Ableton 12 Sound Design Atlas — Famous Big Beat & Breakbeat Records (Juno 106
  + Boss Heavy Metal pedal for "Chemical Beats"; S950/SE-1 for "Praise You";
  claims labelled Documented / By ear):
  https://ableton.onefootstep.us/deconstructions/famous-big-beat-breakbeat-tracks.html
- Attack Magazine — Big Beat Techno (exact step placements, 130 BPM):
  https://www.attackmagazine.com/technique/beat-dissected/big-beat-techno/
- MusicRadar — Beat Building: big beat (2-bar break + kicks, 909, 135 BPM):
  https://www.musicradar.com/news/beat-building-how-to-build-a-big-beat-beat
- theprodigy.info / dbanz — Firestarter guitar tabs:
  https://theprodigy.info/tabs/firestarter.html ,
  https://dbanz.tripod.com/prodigy/firestarter_guitar.html
- TempoPeek — Firestarter 141.5 BPM, F# major 90%:
  https://tempopeek.com/song/prodigy-firestarter ; Songparts estimate:
  https://songparts.com/songs/prodigy/firestarter
- azchords / gotabs — Rockafeller Skank riff and Gm/Bb/C chords:
  https://www.azchords.com/f/fatboyslim-tabs-1440/therockafellerskank1-tabs-178519.html ,
  https://www.guitartabs.cc/tabs/f/fatboy_slim/the_rockafeller_skank_crd.html
- Gemtracks / getsongbpm — Skank 152 BPM, G major:
  https://www.gemtracks.com/resources/bpm-and-key/view-song.php?artist=fatboy-slim&id=7mCQK9YB25WZw1saUjfL4e&song=the-rockafeller-skank&year=1998
- TempoPeek / SongBPM / BeatTab — Busy Child 125 BPM, E♭/D♭ major vs A# minor:
  https://tempopeek.com/song/the-crystal-method-busy-child ,
  https://songbpm.com/@the-crystal-method/busy-child ,
  https://beattab.com/tab/studio-t6twhxa1gyw
- getsongkey / AcousticBrainz — Chemical Beats key/tempo disagreement:
  https://getsongkey.com/song/chemical-beats/P4y ,
  https://acousticbrainz.org/730a12a9-e40d-4766-bde5-685e108da8bb
- signalchain.fm — Block Rockin' Beats E minor / Em–G–D–A:
  https://signalchain.fm/songs/chemical-brothers/block-rockin-beats
