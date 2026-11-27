# Big Beat — character bank for multiple tracks

Answer to "are there enough examples for several tracks?": **yes for 8–10
distinct characters**, not for ten copies of one loop. Each row below is a
different combination of BPM, scale, break, riff and form. For every *new*
request, pick an unused row, then research 2–3 **new** references before
writing (rule at the end). Evidence tags as in `06-practice.en.md`:
`[D]` documented, `[T]` tabbed/noted, `[B]` published by-ear, `[R]` my recipe.

## 1. Character bank

| # | Character (reference) | BPM | Scale / key | Hook | Form / palette |
|---:|---|---:|---|---|---|
| 1 | Chemical acid-rock — "Chemical Beats" | 121 `[B]` | G# minor pentatonic `[T]` | Juno saw + pulse through metal pedal, **filter sweep is the riff** `[D]` | loop, sparse; distorted synth + one break |
| 2 | Fuzz-bass collage — "Block Rockin' Beats" | 109 `[D]` | E minor blues, bass E–A#–C `[T]` | distorted sampled bass, shouted one-shot, siren | 4-bar vocal hit/rest cycle + fills; dense sample collage |
| 3 | Punk-rave — "Firestarter" | 142 `[D]` | F# major / B mixolydian `[T]` | wah guitar riff A4–G#4, chords F#7/B7 `[T]` | verse/chorus, stadium, aggressive vocal slot → filtered stab |
| 4 | Surf-skank — "Rockafeller Skank" | 152 `[D]` | G minor, chords Gm–Bb–C `[T]` | G3 stabs + D4→D#4 bend, pitched "hook" fragment | sparse intro, riff + chord cycles, tempo-dip event `[D]` |
| 5 | Two-drummer piano loop — "Praise You" | ~110 `[B]` | Ab major / C minor `[B]` — detectors disagree | HPF piano-like loop + SE-1 rolling bass + live 303 `[D]` | piano intro → chopped "vocal" stutter → snare roll; clean+dirty kits from one trigger `[D]` |
| 6 | Acid breaks — "Busy Child" | 125 `[D]` | E♭ major / C minor pentatonic `[D]` | resonant 303 line + big drops, orchestral lift `[D]` | long 7-min arc, acid + funk break |
| 7 | Spy-jazz — "Spybreak!" | 128 `[D]` | F# minor / F# Locrian (b2, b5) `[D]` | funky bass described as ESG "Bam-Bam Jam"-like `[B]`, brass stabs, turntablism `[D]` | original instrumentation rather than samples, spy-film colour |
| 8 | Psychedelic song — "Setting Sun" | 135 `[D]` | C minor / A♭ major (ChordU: B♭–A♭–B♭–C–A♭–C) `[T]` | slow chord cycle + distorted guitar-like synth, 303 underneath | rock song form, breakdown, reverse cymbal `[T]` |
| 9 | Modern nostalgia — "Got to Keep On" (2019) | 128 `[B]` | F# minor `[B]` | 909 kick + filtered riff, no vocal needed | 6-min club-rock build, cleaner low end |
| 10 | Nu-skool breaks (variation) | 134 `[B]` | minor, simple | quantised two-step kick, electro bass, sidechain `[B]` | tighter, cleaner, fewer samples than 90s big beat |

Do **not** use the same row twice in a row. `tracks/bigbeat/01-acid-breaks.js`
already uses a rows 5–6 hybrid (two-drummer layering + acid breaks, C minor).
The next track should start from rows 7–10; rows 1–4 are mined in
`06-practice.en.md`.

## 2. Short playable recipes (one grid + one note line each)

### 1. Chemical acid-rock — 121 BPM, G# minor
```
kick  x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~     (compressed hip-hop break underneath)
lead  ab4 ~ b4 ~ db5 ~ eb5 ~ gb5 ~ ~ ~    (one sustained note per 8th, sweep filter by hand)
```
One performed parameter (filter cutoff into distortion) is the hook `[D]`.

### 2. Fuzz-bass collage — 109 BPM, E minor blues
```
kick  x ~ ~ x x ~ ~ ~ x ~ ~ x x ~ x x     [R] (Purdie-style dotted-8th fragments)
bass  e1 ~ ~ ~ bb1 ~ ~ ~ c2 ~ ~ ~ eb2 ~ ~ ~
hit   X at step 1 for 3 bars, rest bar 4 [D]; open hat step 8 from bar 5 [D]
```

### 3. Punk-rave — 142 BPM, F# major
```
snare x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ x     (backbeat + late ghost)
riff  a4*8 ab4*6 a4*2                      (tabbed A4/G#4 figure [T])
```
Chords F#7 → B7; replace the shouted vocal with a filtered stab `[R]`.

### 4. Surf-skank — 152 BPM, G minor
```
kick  x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~
riff  g3*4 d4 eb4 d4 ab3 g3 ~ ~ ~ ~ ~ ~ ~
chord Gm | Bb | C | Gm (one per bar [T])
```
Tempo dip is an *event*, not a new tempo: automate `setcpm` down and back `[B]`.

### 5. Two-drummer piano loop — 110 BPM, C minor
```
kit A (clean)  x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~   (same trigger as kit B [D])
kit B (dirty)  x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~   (not panned apart [D])
bass  c2 ~ ~ ~ c2 ~ eb2 ~ g2 ~ ~ ~ bb1 ~ ~ ~    [R] SE-1-style rolling line
```
Piano-like loop high-passed `[D]`; "stutter" from a chopped note replayed
with `ply`/`slice` instead of a vocal `[R]`.

### 6. Acid breaks — 125 BPM, C minor pentatonic
```
acid  c3 ~ eb3 ~ g3 ~ bb3 c4 ~ g3 ~ eb3 ~ g3 bb3 ~   [R] (accents on 1/5/9/13)
kick  x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ + break slices on 2,4,6,8
```
Acid high-passed ~150 Hz, bass mono below it `[B]`.

### 7. Spy-jazz — 128 BPM, F# Locrian (F# G A B C D E)
```
bass  gb2 ~ a2 ~ c3 ~ b2 ~ e3 ~ d3 ~ c3 ~   [R] (walking, not a pedal)
 stab [gb3,c4] ~ ~ ~ [a3,e4] ~ ~ ~ [b3,gb4] ~ ~ ~
```
Brass-like stab replaces a real horn section; keep the b2/b5 tension, avoid
major 3rd `[D]`.

### 8. Psychedelic song — 135 BPM, C minor
```
chord [bb2,f3,d4] ~ ~ ~ [ab2,eb3,c4] ~ ~ ~ [bb2,f3,d4] ~ ~ ~ [c3,g3,eb4] ~ ~ ~
lead  c5 ~ ~ ~ eb5 ~ ~ ~ g5 ~ ~ ~ ~ ~ ~ ~   [R] (guitar-like filtered synth)
```
Reverse cymbal into the bar line; breakdown with 303 alone `[T]`.

### 9. Modern nostalgia — 128 BPM, F# minor
Take character 1 but: longer 16-bar builds, 909 four-on-the-floor layer under
the break, cleaner sub, no sample pastiche. Reference: "Got to Keep On" (2019).

### 10. Nu-skool breaks — 134 BPM, minor
Quantised two-step kick, electro bass with filter LFO, programmed hats,
sidechain instead of fuzz `[B]`. Cleanest option when the user wants "big beat
but tighter".

## 3. Selection rule for track N+1

1. Pick the **next unused row** in the bank. If all are used, combine two rows
   from **different** families (e.g. 7 + 10) and record the new row.
2. Change at least **four axes** from the previous track: BPM (≥8 difference),
   key/scale family, break source (`amen`/`think`/`apache`/`funkydrummer`/
   `amencutup`), hook type (fuzz bass / acid / wah riff / chord loop / brass
   stab), form length, and sound palette.
3. Write a one-line **DNA** at the top of the track file:
   `// BIG BEAT N · <character> · <BPM> · <key/scale> · <break> · <hook>`.
4. **Research before writing:** find 2–3 new references for that character
   (a tab, a sample teardown, a step-grid page, a documented gear interview),
   read them, and append their URLs + one-line findings to
   `docs/bigbeat/05-sources.en.md`. Do not reuse the same three sources for a
   new character.
5. I cannot hear the records. Ask the user to confirm character by ear when a
   `[B]`/`[R]` detail matters — especially key (detectors disagree constantly)
   and the exact placement of fill hits.

## 4. Coverage and gaps

| Character | Note-level data | Still missing / needs per-track research |
|---|---|---|
| 1 Chemical acid-rock | key, gear `[D]`, BPM `[B]` | exact riff notes (no published tab) |
| 2 Block Rockin | bass notes + break construction `[T]` | exact kick/snare step positions (only screenshots) |
| 3 Firestarter | guitar tab `[T]`, chords, BPM `[D]` | bass and drum parts |
| 4 Rockafeller Skank | riff tab + chords `[T]`, BPM `[D]` | drum grid |
| 5 Praise You | gear + method `[D]`, ~110 BPM `[B]` | piano loop notes, bass notes |
| 6 Busy Child | key/BPM `[D]`, beat-grid page exists | bass/acid note sequence (grid page hides velocities in text) |
| 7 Spybreak | key/BPM `[D]`, bass-line description `[D]` | exact bass tab (Songsterr page not read) |
| 8 Setting Sun | chords + BPM `[D]`, MIDI exists | riff note reading from MIDI |
| 9 Modern | BPM/key `[B]` | arrangement detail |
| 10 Nu-skool | recipe `[B]` | reference tracks |

## 5. Sources added for this file

- BeatTab — Setting Sun drum grid, 135 BPM, C major:
  https://beattab.com/tab/studio-p5nx1fc-7-w
- Tunebat / Chordify / ChordU — Setting Sun 135 BPM, F# major vs Cm, chord
  cycle B♭–A♭–B♭–C–A♭–C:
  https://tunebat.com/Info/Setting-Sun-The-Chemical-Brothers-Noel-Gallagher/5JBGbFdBtLcCCygw8rtjli ,
  https://chordify.net/chords/the-chemical-brothers-songs/setting-sun-3-chords ,
  https://chordu.com/chords-tabs-the-chemical-brothers-setting-sun-instrumental--id_UiFjo_0Fflg
- Songparts / Hooktheory / kapiko / Discogs — Spybreak! 128 BPM, F# minor vs
  F# Locrian, ESG-like bass, original instruments + turntablism:
  https://songparts.com/songs/propellerheads/spybreak ,
  https://www.hooktheory.com/theorytab/view/propellerheads/spybreak ,
  https://kapiko.ai/songs/spybreak-propellerheads/ ,
  https://www.discogs.com/master/132208
- Sound On Sound / Tom Doyle — Classic Tracks: Fatboy Slim "Praise You"
  (two S950 kits from one trigger, HPF piano loop, SE-1 played bass, 303,
  time-stretched vocal): https://www.soundonsound.com/techniques/classic-tracks-fatboy-slim-praise-you
- jackthobbit — Praise You ~110 BPM, Ab major analysis:
  https://jackthobbit.wordpress.com/2019/02/11/blog-dance-fatboy-slim/
- Sonaa — 16 reference tracks, 115–140 BPM centre 125–130, MPC swing 58–62%:
  https://sonaa.ca/en/styles/breaks/big-beat/
- Tunebat / getsongbpm / Vibes — modern Chemical Brothers BPM/key
  ("Go" 120, "Got to Keep On" 128 F#m):
  https://tunebat.com/Info/Go-The-Chemical-Brothers/2cNjgoSh1TBHFQIhfzRJUE ,
  https://getsongbpm.com/song/get-up-on-it-like-this/D9gXlq ,
  https://vibesdj.io/dj/the-chemical-brothers
