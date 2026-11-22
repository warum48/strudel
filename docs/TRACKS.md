# Track catalog

Every track is one self-contained `.js` file under `tracks/`. This catalog is
the human-readable index: BPM, form length, layer/slider counts, transport and
what the track is doing. It is intentionally compact; the source file is the
source of truth for exact parameter values.

**Legend**

- **Layers** — number of `$:` blocks.
- **Sliders** — number of `slider(...)` calls in the file.
- **Bars** — last `at + len` in `TIMELINE`; `—` means no fixed form (loop).
- **Transport:**
  - `loop` — no timeline, just a loop / hands-on track;
  - `timeline` — native `TIMELINE` with playhead, no LOOP/SONG/HOLD switch;
  - `song` — old two-state `song` (LOOP / SONG);
  - `play` — current three-state `play` (LOOP / SONG / HOLD) + `holdBar`.

## Drum & bass — root series

| File | BPM | Bars | Layers | Sliders | Transport | Description |
|---|---:|---:|---:|---:|---|---|
| `01-dnb-live.js` | 174 | — | 9 | 23 | loop | Original liquid DnB sketch: drums, sub, pads, sparse melodics. |
| `02-dnb-live-v2.js` | 174 | — | 11 | 30 | loop | Adds a rhythm switch, a melody and a heavier sub. |
| `03-dnb-live-v3.js` | 174 | — | 12 | 39 | loop | Adds a per-bar drone with a moving filter. |
| `04-dnb-live-v4.js` | 174 | — | 12 | 46 | loop | Adds a Bb→C→F bassline with a pressure-sensitive filter. |

## Breakcore — `tracks/breakcore/`

| File | BPM | Bars | Layers | Sliders | Transport | Description |
|---|---:|---:|---:|---:|---|---|
| `01-rinse.js` | 174 | — | 15 | 47 | loop | Rinse-style breakcore: Amen slicing, brutal kick/snare edits. |
| `01-rinse-slices.js` | 174 | — | 12 | 44 | loop | Slice-focused variant of the rinse idea. |
| `02-stems-hardcore.js` | 200 | — | 20 | 81 | loop | 200 BPM hardcore built from stem-style layered hits. |

Style notes: `docs/breakcore/README.en.md`.

## Coldwave — `tracks/coldwave/`

| File | BPM | Bars | Layers | Sliders | Transport | Description |
|---|---:|---:|---:|---:|---|---|
| `01-cold-rooms.js` | 108 | 64 | 13 | 58 | song | Sparse coldwave: 606/808/Linn, Juno pad, guitar, mono lead. |
| `02-cold-rooms-v2.js` | 108 | 72 | 17 | 82 | song | Longer form, voice and arp wall, more sections. |
| `03-cold-rooms-v3.js` | 108 | 88 | 19 | 105 | play | Current reference: noise insert, granular detail, UI manifest. |

Style notes: `docs/coldwave/README.en.md`.

## Darkwave — `tracks/darkwave/`

| File | BPM | Bars | Layers | Sliders | Transport | Description |
|---|---:|---:|---:|---:|---|---|
| `01-static-confession.js` | 124 | 104 | 17 | 86 | play | Midtempo darkwave, pulse bass, FM bell, strings, 9 sections. |

Style notes: `docs/darkwave/README.en.md`.

## Drum & bass — `tracks/dnb/`

| File | BPM | Bars | Layers | Sliders | Transport | Description |
|---|---:|---:|---:|---:|---|---|
| `01-atmospheric-jungle.js` | 174 | — | 27 | 91 | loop | LTJ Bukem-style atmospheric jungle: Amen/Think, pads, melodic sub. |
| `02-dark-techstep.js` | 172 | — | 25 | 102 | loop | Dark techstep base: Reese, chopped breaks, industrial space. |
| `02-dark-techstep-v2.js` | 172 | — | 30 | 120 | loop | Denser techstep variant. |
| `02-dark-techstep-v3.js` | 172 | 144 | 31 | 125 | play | Arranged techstep, 8 sections, full automation. |
| `02-dark-techstep-v4.js` | 172 | 144 | 19 | 90 | play | Alternative 144-bar techstep arrangement. |

## Experimental — `tracks/experimental/`

| File | BPM | Bars | Layers | Sliders | Transport | Description |
|---|---:|---:|---:|---:|---|---|
| `01-complex-bass.js` | 160 | — | 18 | 206 | loop | Buchla/west-coast complex bass: waveshaping, FM/AM, five WT+FM pairs. |

Style notes: `docs/experimental/README.en.md`.

## IDM — `tracks/idm/`

| File | BPM | Bars | Layers | Sliders | Transport | Description |
|---|---:|---:|---:|---:|---|---|
| `01-splinter.js` | 136 | — | 33 | 193 | loop | Glitch/granular IDM: micro-events, 8-bit color, rough bass. |
| `02-splinter-v2.js` | 136 | 96 | 20 | 103 | play | Composed Splinter, 9 sections. |
| `03-splinter-v3.js` | 136 | 144 | 26 | 136 | play | Larger IDM form, 13 sections, more automation. |

Style notes: `docs/idm/README.en.md`.

## Khmer — `tracks/khmer/`

| File | BPM | Bars | Layers | Sliders | Transport | Description |
|---|---:|---:|---:|---:|---|---|
| `01-sathukar.js` | 88 | — | 27 | 83 | loop | Pinpeat ensemble: skor, sampho, chhing, krap, gongs, scenes. |
| `02-skors.js` | 96 | — | 16 | 86 | loop | Real Dirt/VSCO samples, rhythm scenes and group mutes. |
| `03-skors-ritual.js` | 76 | — | 11 | 58 | loop | Percussion only + low xylophone; no high melodic lines. |
| `04-confluence.js` | 108 | — | 16 | 79 | loop | Mix of 01–03 plus acid bass and arp. |

Style notes: `docs/khmer/README.en.md`.

## Minimal techno — `tracks/minimal-techno/`

| File | BPM | Bars | Layers | Sliders | Transport | Description |
|---|---:|---:|---:|---:|---|---|
| `01-hollow-form.js` | 128 | 128 | 14 | 61 | play | Modal minimal techno: 4/4, uzu/Dirt, kick+perc, drone instead of pad. |

Style notes: `docs/minimal-techno/README.en.md`.

## Psytrance — `tracks/psytrance/`

| File | BPM | Bars | Layers | Sliders | Transport | Description |
|---|---:|---:|---:|---:|---|---|
| `01-serpent-engine.js` | 145 | 192 | 19 | 90 | play | Full-on psytrance, one root, rolling 12-note bass, offbeat hats, 303, psy lead. |
| `02-acid-euphoria.js` | 140 | 160 | 14 | 58 | play | Reference-driven psytrance: repeated-note switchangel acid ostinato, EX7/9/12 arp/pluck/strings, dynamic cutoff. |

Style notes: `docs/psytrance/README.en.md` and
`docs/psytrance/strudel-recipes.en.md`.

## Techno — `tracks/techno/`

| File | BPM | Bars | Layers | Sliders | Transport | Description |
|---|---:|---:|---:|---:|---|---|
| `01-berlin.js` | 130 | — | 8 | 44 | loop | Berlin techno without chords: kick, sub, hats, noise. |
| `02-dub.js` | 124 | — | 10 | 63 | loop | Techno-dub: pad, reverb, bubbles, glitches. |
| `03-dub-v2.js` | 124 | — | 12 | 64 | loop | Drum modes, mixer on top, atonal⇄jazz. |
| `04-dub-v3.js` | 124 | — | 12 | 64 | loop | 180px sliders, same sound as 03. |
| `05-deep-dub.js` | 112 | — | 26 | 64 | loop | Deeper dub, one key for two modes. |
| `06-deep-dub-v2.js` | 112 | — | 28 | 66 | loop | Fourth break mode, snare/fill, kick 2/4 in the break. |
| `07-dark.js` | 126 | — | 30 | 76 | loop | Dark techno: phrygian b2, clusters, intentional tritone. |
| `08-dark-acid.js` | 180 | — | 23 | 79 | loop | Dark acid/gabber: 303 slides, five modes, hoover. |
| `09-dark-acid-v2.js` | 180 | — | 23 | 78 | loop | Version 08 with `glide` instead of manual `penv`. |
| `10-slowtrap.js` | 136 | — | 27 | 87 | loop | Slow trap/IDM: 808 slide, Berlin acid, four modes. |
| `11-slowtrap-v2.js` | 136 | — | 31 | 105 | loop | Version 10: muted kick with body, riser, 8-bit, less 90s. |
| `12-slowtrap-v3.js` | 136 | — | 31 | 106 | loop | Structural refactor: `instruments` tree, kick 0.5, two-column panel. |
| `13-gabber-v3.js` | 180 | — | 24 | 85 | loop | Version 08/09 in the scheme of 12: tree, muted kick, `audible`. |
| `14-acid-jazz.js` | 90 | — | 27 | 86 | loop | Acid jazz: TIA arp, partials pads, upright slide, swing, Rhodes. |
| `14-acid-jazz-v2.js` | 90 | 128 | 29 | 104 | play | Composition: 11 sections, two TIA arps, cut automation, `gateOf`. |
| `15-house-rave.js` | 120 | — | 26 | 90 | loop | Jazz house/rave: four-on-floor, Fmaj9–Dm9–C6/9, clav/acid/hoover. |
| `16-minimal-dub.js` | 120 | — | 13 | 47 | loop | Minimal dub techno: Am9→Bbmaj9, muted 4/4, offbeat stab, sub ≤80. |
| `17-halfstep-dub.js` | 104 | — | 16 | 65 | loop | Burial-leaning halfstep: shuffled hats, Dm9→Bbmaj9, vowel pad. |
| `17-halfstep-dub-v2.js` | 104 | — | 17 | 90 | loop | Version 17 with audible Moog note/arp and `pad.fb`. |
| `17-halfstep-dub-v3.js` | 104 | 112 | 17 | 92 | play | Composition: 8 sections, timeline, cut automation, constant levels. |
| `18-khmer-dub.js` | 122 | 64 | 19 | 149 | timeline | Dub techno + 18 Khmer channels, one shared delay/reverb bus. |
| `18-khmer-dub-v2.js` | 122 | 192 | 19 | 151 | play | 16 sections, group gates (skor/sampho/chhing), 19 automation lanes. |
| `18-khmer-dub-v3.js` | 122 | 144 | 19 | 151 | play | Compressed v2: first 64 bars kept, two climaxes, shorter tail. |
| `18-khmer-dub-v4.js` | 122 | 144 | 20 | 166 | play | v3 with DEEP: chhing off, Moog arp2, deep bass, higher cutoffs. |
| `18-khmer-dub-v5.js` | 122 | 144 | 20 | 166 | play | v4 dump applied; DEEP 2A + DEEP 2 + DEEP 3 (no kick/hats/rim/Khmer perc; arps/shaker/bass fade), stab carries into OUTRO. |
| `19-hypnotic-trance.js` | 138 | — | 11 | 6 | loop | Compact fat trance: one note row, rolling bass, distort, supersaw stab. |
| `20-deep-dark-trance.js` | 140 | — | 10 | 6 | loop | Deep dark trance built from the reference recipes. |
| `21-dark-trance.js` | 140 | — | 12 | 6 | loop | Dark trance with intentional dissonance. |
| `22-dark-trance-160.js` | 160 | 72 | 13 | 66 | song | E-phrygian dark trance: gabber accent, psy bass, acid, supersaw, Kafka granular. |
| `22-dark-trance-160-v2.js` | 160 | 96 | 18 | 92 | play | Melodies from the trance examples: rolling bass, arp, pluck, strings, lead. |
| `23-black-room.js` | 132 | 192 | 15 | 71 | play | Berlin techno: uzu bd + click attack, rumble in sidechained reverb, 7 sections. |

Style notes: `docs/techno/README.en.md`.

## Trip-hop — `tracks/trip-hop/`

| File | BPM | Bars | Layers | Sliders | Transport | Description |
|---|---:|---:|---:|---:|---|---|
| `01-acid-jazz.js` | 84 | — | 17 | 73 | loop | Acid-jazz breaks: quarter/ninth pads, Rhodes, upright bass, swing. |
| `02-acid-jazz-v2.js` | 82 | 96 | 27 | 107 | song | Composition: 11 sections, two Moog lines, tablas, scenes/mutes. |
| `02-acid-jazz-v3.js` | 82 | 88 | 25 | 95 | play | 4:18 composition on current standard: TIMELINE, 0/1 gates, 8 sections. |

Style notes: `docs/trip-hop/README.en.md`.

## Notes on the catalog

- Older tracks have no `TIMELINE`; they are hands-on loops. Their "form" is
  whatever you play with the switches.
- `song` is the previous transport (LOOP / SONG only). New tracks use `play`
  with LOOP / SONG / HOLD and `holdBar`.
- `timeline` means a native `TIMELINE` table without the LOOP/SONG/HOLD
  transport. It still supports section clicks and automation.
- Slider counts include global sliders, not only the `instruments` tree. A few
  files put several sliders on one line, so `verify` can print slightly fewer
  (`23-black-room.js`: 71 calls, `verify` 68).
- For check numbers and known failures, see `docs/CHECKS.md`.
