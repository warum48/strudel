# Trip-hop / acid jazz — playbook

Strudel practice card: `docs/practice-atlas.en.md` §4.

Track: `tracks/trip-hop/01-acid-jazz.js` — 84 BPM, 17 tracks, 73 sliders.
This is not "gloomy café downtempo" and not retro noir: a muffled low end,
broken drums, Rhodes, quartal pads, vinyl and two Moog voices. Jazz is in the
harmony and counterpoint, not in imitating a saxophone.

---

## 1. Character

| Trait | How it sounds | What we do not do |
|---|---|---|
| Harmony | fourths, 9/11/13, suspended chords | ii–V–I, dominant resolutions |
| Rhythm | broken break, swing on the hats, pauses | even 16ths, "eurodance" |
| Low end | muffled kick + Moog ≤80 Hz | bright click, sub on every beat |
| Melody | sparse points, arpeggio as texture | a "pretty" theme, saxophone imitation |
| Space | vinyl, air, delay on the tails | a wall of reverb on everything |

Series rule: the track starts quiet. Only the atmosphere sounds; you raise the
rest by hand (cheat sheet at the bottom of the track).

---

## 2. Harmony

One key for both voicings — D Dorian with a chromatic mediant.
Roots over 8 bars: **d → eb → bb → f → g → eb → c → d**. A circle, not a
cadence: the chords hang, nothing "resolves".

- `PAD_A` — quartal voicings without thirds (McCoy Tyner), *quartal* mode.
- `PAD_B` — the same roots, 9ths, 11ths and the 13th, *ninth* mode.
- `harmony` — a latch on `seg(1/8)`: the phrase plays out all 8 bars.
- `// @roots` is mandatory: `npm run tension` checks the lines against the roots
  and pads. Tritones and minor seconds in the same octave are an error, not color.

The trick that keeps the "jazziness" without clichés: the chord changes once per
bar, and the lines (Moog bass, arpeggio, vibraphone) move in counterpoint —
approaches to the next beat, not a walk through tonic–third–fifth.

---

## 2a. Composition (v2)

`tracks/trip-hop/02-acid-jazz-v2.js` — the same harmony and the same eight
breaks, but expanded into a 96-bar form:

```
INTRO 8 → BUILD A 8 → BUILD B 8 → BREAK A 8 → BREAK B 8 → RETURN 8
→ CLIMAX A 12 → CLIMAX B 12 → DECAY 8 → OUTRO A 8 → OUTRO B 8
```

Mutes: M/S in the mixer do not touch the document (the engine receives the
effective volume), so solo does not reset vol; G — group mutes
`muteDrums / muteKeys / muteMoog / muteAtmos`.

Two modes: `song=loop` — the TIMELINE does not run, an even loop at real
levels; `song=song` — the form runs. In LOOP the switches `lead`
(sparks/smooth/theme), `vibes` (off/sparse/dense) and `drum` (off/soft/full,
the whole drum group) work. In SONG the TIMELINE switches the same states and
overrides the manual choice — deliberately simpler and more predictable.

The arrangement lives in `const TIMELINE = [...]`: `{ at, len, name, values }`,
where `values` are multipliers for the sliders and the cutoffs. `tlCurve('kick')`
and `tlCurve('cutBass')` assemble a stepped signal from the sections via
`arrange(...pure(...))`. The panel reads and edits the same array.

Form rules:

- **Density** grows in layers, not only in volume: ghost snares,
  32nd rolls, toms, tabla, cowbell and `SPARK` (a solo an octave up in 32nds)
  are switched on by section.
- **Cutoffs** rise toward the climax: Moog bass 57 → ~79 (≤80),
  Moog lead 900 → ~1450, pad/Rhodes/kick/hats too.
- **Solo — three states**: A — sparks/fragments (INTRO/BUILD/DECAY/OUTRO),
  B — a smooth line without a recognizable rhythm (BREAK A/B), C — the main theme
  only in RETURN and CLIMAX. Even 16ths are forbidden: only as a garnish.
- **Bass is dubby, not jazzy**: 3–4 long notes per bar, pauses, a rare
  fifth/octave, delay. The 50s walk is not needed here.
- **Glide** is 0 by default; a slide only on the approach to a beat, otherwise
  the phrase "mumbles".
- **BREAK A/B** — real relaxation: kick/snare leave, toms,
  tabla and filtered Rhodes lead; **DECAY/OUTRO** fade everything out, leaving
  the pad, air and vinyl.

## 3. Eight breaks

`mode` is not "layers on/off" but eight drummers on one kit.
Each pattern is chosen by the mode index, so no mode switches an instrument
off: the groove changes, the lineup stays.

| mode | name | character |
|---|---|---|
| 0 | boom | classic boom-bap: 1, the "and" of 3, a pickup |
| 1 | break | broken, doubled kicks |
| 2 | half | half-time: kick on 1, snare on 3 |
| 3 | roll | dense 16ths, rolls |
| 4 | shuffle | swing shift, kick on the "and" |
| 5 | stutter | stutter: doubled hits |
| 6 | broken | a snare that has drifted off the grid |
| 7 | open | sparse, lots of air |

Technically: `mode.pick([m('…'), …])` for kick/snare/hat/rim and the Rhodes
comping. Rhodes plays the bar's chord, and `struct` sets only the rhythm — the
chord is not rewritten. The pattern changes, not the harmony.

---

## 4. Two Moogs

1. **Moog bass** (`moog.bass`) — a sawtooth voice, 24 dB filter,
   `cut ≤80` per the project rule, opened by `lpenv`, `glide` on the approach.
   Range d1…g2, counterpoint: pedal, leaps, approaches. "Tonic–third–
   fifth" — no.
2. **Moog lead** (`moog.lead`) — a different voice: square, unison, LFO on
   the cutoff, long delay. A quartal arpeggio in 16ths from the bar's chord — the
   layer where there are "lots of notes", but without the 303 cliché.

The two voices do not duplicate each other: the bass holds the low end and the
movement, the lead — the texture and the top.

---

## 5. Rhythm section and keys

- Kick: `cut 220`, `shape 0.5`, `duckorbit(2)` — ducks the bass and sub.
- Snare/clap: snare on 2 and 4 only in boom; in the others it drifts.
- Hats: `swingBy(0.14, 8)` — the second eighth arrives later; that is what
  "swings". Plus `nudge` and `degradeBy` for humanity.
- Open hats on the "and", a 16th shaker with dropouts, rim with delay.
- Rhodes: FM sine `fmh 1.01` — a warm electric piano, not a bell.
- Pads: `partials` (odd harmonics / warm stack), slow attack.
- Vibraphone: sparse points, long tail; there are no wind instruments in the track.

---

## 6. Checks

```
npm run verify  -- tracks/trip-hop/01-acid-jazz.js   # grid and lints
npm run tension -- tracks/trip-hop/01-acid-jazz.js   # tritones/minor seconds
npm run modes   -- tracks/trip-hop/01-acid-jazz.js   # eight breaks
npm run latch   -- tracks/trip-hop/01-acid-jazz.js   # 8-bar latch
npm run gains   -- tracks/trip-hop/01-acid-jazz.js   # quiet at zeros
npm run doubles -- tracks/trip-hop/01-acid-jazz.js   # overlaps
npm run cpu     -- tracks/trip-hop/01-acid-jazz.js   # worklets
```

Expected for 01: 17 tracks / 69 hits / 73 sliders, no friction, eight
breaks alive, `latch` — bar 8, quiet at zeros, no overlaps,
17 worklets/bar (6/s). For 02: 27 tracks / 69 hits / 107 sliders,
4 worklets/bar (1/s), bass — 3 long notes per bar, the lead theme only
in RETURN and CLIMAX; `gains` — quiet only with the knobs at zero; by default
the levels are real.

---

## 7. Sources and what was taken

- **MusicRadar, "Ditch the loops and build your own trip-hop beat"** —
  building a break from a single loop, boosting the kick with EQ/saturation, a
  16th shaker following the groove, spot-FX with a dark room once every 8 bars.
- **MusicRadar, "…your beats are slow — 90 bpm maximum — and they are filthy"** —
  the 60–90 BPM range, dirty top end, deep bass (sub/dub/Moog), strings
  and cinematic layers, final dub effects.
- **Plugg Supply, "How to Make Trip-Hop"** — 55–65% shuffle on 16ths,
  "two snares" (heavy on 2, dry on 4), a busy kick with 16th pickups,
  a mono room, textural layers, "hip hop tuning".
- **Siesta Audio, "How to sound like Portishead"** — record → vinyl →
  resample, dark top end, full low end, restraint, Rhodes and air.
- **Wikipedia / AllMusic, Acid jazz** — groove and long compositions matter more
  than virtuosity; funk/soul/hip-hop, rare groove and Blue Note; Rhodes, organ.
- **mDecks / VoicingLab / Jens Larsen** — quartal voicings (stacks of
  4ths), "So What" chords, upper structures: taken as the principle of
  quartal pads and rootless comping.

---

## 8. Samples and network

Both tracks load an **explicit map** from jsDelivr, not `github:...`:

```js
samples({ bd: [...], sd: [...], hh: [...], oh: [...], rim: [...], sh: [...],
          cp: [...], lt: [...], tb: [...], cb: [...] },
  'https://cdn.jsdelivr.net/gh/tidalcycles/uzu-drumkit@main/')
```

Why this way:

- `raw.githubusercontent.com` periodically returns **503** and hits rate
  limits — that is exactly why "some samples do not load".
- Dirt-Samples does not have `oh`, `rim`, `sh`, and the map is huge (221 folders).
  uzu-drumkit contains all the drums of the track and loads as a small map.
- `white` / `pink` are synthesized Strudel noises, `crackle` is built-in
  vinyl; they do not need to be downloaded.

If GitHub/CDN is unavailable: local wav files are placed in a folder and the map
points to `http://localhost:<port>/` (see `docs/khmer/05-samples.en.md`).
