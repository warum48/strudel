# Dub Techno — a working playbook

A digest of the research and the tracks `techno/16-minimal-dub`, `techno/17-halfstep-dub`
and `techno/17-halfstep-dub-v2`. The goal: the next dub techno track can be
assembled without searching again.

## 1. Two characters

| | **Classic / Basic Channel** | **Burial-leaning halfstep** |
|---|---|---|
| Tempo | 120–125 BPM (Tunary: up to 130) | 104 BPM |
| Kick | 4/4, muffled, soft | 1 + pickup or 1 + 3.5 |
| Snare | none (or a rare rim) | on 3, halfstep |
| Hats | offbeat, soft, in the delay | noisy 16ths with swing |
| Harmony | 1–2 chords, 9/11, bII | Dm9 → Bbmaj9, vocal pad |
| Bass | sub ≤80 + dub bass ≤80 | sub ≤80 + growl (a deliberate exception) |
| Main sound | short stab in a long delay | stab + pad + Moog/echo |
| Reference in the repo | `techno/16-minimal-dub.js` | `techno/17-halfstep-dub.js`, `-v2` |

## 2. What makes the sound "dubby"

1. **Fewer events, more space.** Kick, sub, one stab, a rare rim,
   soft hats — that's enough. Emptiness and noise are part of the groove.
2. **Delay/reverb are an instrument, not decoration.** The dry stab is short;
   the filtered tail makes the character. Feedback ~0.40–0.65, the repeats are darker
   than the dry signal, reverb after the delay.
3. **Slow movement.** Cutoff, feedback and level change over 8/16/32 bars.
   No new sections, risers or drops.
4. **The low end is the center.** Sub ≤80 Hz; kick muffled (lpf ~250–300); the top is rolled off.
   No bright master and no "air" above 8–10 kHz.
5. **Noise as body.** Vinyl/crackle, pink air, wind/field recordings.
   Without them the stab sounds like MIDI.
6. **Harmony hangs.** Am9 → Bbmaj9 (bII) or Dm9 → Bbmaj9. No
   1–2–4–5, no dominant resolutions and no "pretty" melodies.

## 3. Arrangement

- **One cycle = one 4/4 bar.** `setcpm(BPM / 4)`.
- Phrases are 8 bars (or 16 for very slow pads). The `@roots` marker is mandatory.
- 4+4 bars is a good minimal move: 4 bars of one chord, 4 bars of bII.
- **Modes** change only the texture (hats/rim/click/shaker), not the form:
  `DUB → STRIP → PRESSURE → CLICK`.
- **Harmony** is an 8-bar latch: `WARM` (low vocal/saw pad) /
  `AIR` (high open ghost).
- **Scenes** (`// @scenes`) — Intro/Theme for fast mix switching.
- Start: atmosphere only. Kick/sub/stab/pad are brought up by hand.

## 4. Sound design

### Kick
- `s("bd*4")`, `.lpf(260)`, light `.shape(0.45)`, short decay.
- No click, distortion or "snap" on top. This is the heart, not a hit.
- In halfstep: kick on 1, sometimes a pickup on the last 16th.

### Sub and dub bass
- **Project rule: cutoff ≤80 Hz.** The slider max is 80; you can't go higher.
- Sub — `s("sine")`, offbeat pulse (`~ x ~ ~ ~ x ~ ~`), not on the beat with the kick.
- Dub bass — `s("triangle")`, a phrase with rests and counterpoint: fifth, b7,
  11th, pedal. Not "root–third–fifth".
- In classic dub the bass can be a copy of the kick tail filtered
  down to the sub. In Strudel a separate sine is simpler.

### Stab
- Short chord (3–5 notes) on the "and" of the beat, not on every beat.
- `s("sawtooth").unison(2).detune(...)`, lpf 900–1200, lpq 3–5.
- `.decay(0.25–0.4).sustain(0)`, then `.delay(send).delaytime(0.375)`
  (dotted quarter at 120 BPM = 0.75 s), `.delayfeedback(0.55)`,
  `.room(...)`.
- The dry stab must be audible louder than the first echo. Otherwise you get
  "reverb mush", not dub.

### Pad
- Not a lead and not accompaniment. Long attack (4–6 s), release 12–18 s,
  low cutoff, chorus, a big dark reverb.
- `WARM`: `sawtooth` + `partials`, unison 2, detune 0.06–0.09.
- `AIR`: `triangle` + `partials`, unison 3, detune 0.12–0.15, higher and more transparent.
- Open fifths/9ths without thirds are a good second layer.

### Hats, rim, click
- Hats — offbeat, soft, lpf 5–6 kHz, in the delay at 30–40 %.
- Rim — a dry wooden tick; in STRIP it replaces the hats.
- Click — rare digital dots, only in STRIP/CLICK; above 2 kHz.
- We don't put a snare on 2/4: that's no longer dub.

### Textures
- `crackle` — vinyl/hiss; `pink` — air; `wind` from Dirt-Samples —
  field/landscape. All very quiet, with filters and slow panning.
- Noise is not an "effect" but the body of the track.

## 5. Harmony without pop

- **Am9**: a c e g b. **Bbmaj9**: bb d f a c. The bII + 9th pair is a juicy
  dissonance without a dominant.
- **Dm9**: d f a c e. **Bbmaj9**: bb d f a c. The same bVI shift for Burial.
- Avoid the **e–bb** pair (tritone) in one chord/bar. Am9 has e, Bbmaj9 has
  bb; don't put them in the bass and stab at the same time.
- Bass/stab lines shouldn't go up and down "along the chord tones". Rests,
  pedal, fifth, 11th are better.
- No 303 chord licks. 303 is only an atonal riff/arpeggio
  with 1–2 notes per chord, if it's needed at all.

## 6. Mix

- Dark master: no air boost, no bright top, no over-compression.
- Delay and reverb on individual instruments, not on the master.
- Bass ≤80; kick muffled; stab and pad must not clog the low end.
- No sidechain pumping, risers, white-noise builds, snare rolls
  or "drops". That's EDM language, not dub.
- If a part can be removed without losing identity — remove it.

## 7. What to look at in the repo

- `tracks/techno/16-minimal-dub.js` — classic 120 BPM, Am9 → Bbmaj9,
  13 tracks, 47 sliders. The reference for a minimal stab in a delay.
- `tracks/techno/17-halfstep-dub.js` — 104 BPM, halfstep, Dm9 → Bbmaj9,
  sub ≤80 + growl, vocal pad, Moog.
- `tracks/techno/17-halfstep-dub-v2.js` — v2: separate Moog note, Moog arp,
  `chords.pad.fb`, `@scenes`, `moog.arp.pace`.
- `docs/dub-techno/strudel-recipes.en.md` — ready-made code snippets.
- `docs/dub-techno/sources.en.md` — external sources and what was taken from them.
- `docs/rules.en.md` — the project's anti-pop rules.

## 8. Checklist for the next track

- [ ] Choose a character: 120 BPM classic / 104 BPM halfstep.
- [ ] Choose 1–2 chords: Am9/Bbmaj9 or Dm9/Bbmaj9; `@roots`.
- [ ] Build the `instruments` tree: atmos / drums / bass / chords / fx.
- [ ] Muffled kick, sub ≤80, dub bass with rests.
- [ ] One stab on the offbeat + delay 0.375 / feedback 0.55 / filter.
- [ ] WARM/AIR pad, no melody.
- [ ] Noise/hiss/field; start in silence.
- [ ] Modes + harmony latch 8; `@scenes` if desired.
- [ ] `verify`, `tension`, `modes`, `latch`, `gains`, `doubles`, `cpu`, `live`.
- [ ] Check that the track holds up for 2 minutes without new sections.

## 9. Khmer dub (`techno/18-khmer-dub.js`)

Dub low end + Khmer top end. 122 BPM, Fm9 → Abmaj9 → Dbmaj9 → Gbmaj9
(four chords, two bars each, 9ths), different notes from 16/17. The pad is
short, the stab is dark, and there is a Moog line and a quiet arpeggio.

- **Dub set:** kick / hat / rim / click / shaker, sub / dub bass,
  pad warm/air, stab, organ, skank, horns, hiss / air / field, dub delay
  + reverb. Sub ≤80, kick 270, stab in the delay, no melodies or drops.
- **18 Khmer drums:** skor high/fill, sampho low/high/ghost/rim,
  chhing closed/open/roll. 18 channels in the MIXER (vol / cut / clip), one
  percussion bus in the code.
- **All 18 through a shared delay + reverb:** `percEcho` 0…0.8, `percVerb` 0…1,
  `verb` 0…1, `verbSize` 1…20. This is cheaper than 18 separate tails.
- **Timeline:** native readable `const TIMELINE = [...]` — a plain array of
  objects (single quotes), 5 sections / 64 bars, 11 multipliers per section,
  `tlCurve` + `arrange`. It plays in plain
  Strudel; the sliders are live, table edits apply on Ctrl/Cmd+Enter. The panel
  draws sections, target multipliers and the playhead. LOOP returns the playhead to 0;
  with LOOP off the track stops at the end. In the MIXER every channel
  has M/S (mute/solo, they don't change the code) and G (group mute, colored by
  group). For 18 the group is set by the `mute:` field in the tree, so the top
  `@mutes` row is hidden. Sections are contiguous: the length of one
  shifts the `at` of the following ones; reorder with the ↑/↓ arrows. Click the
  ruler to seek. Reverb/delay are not automated so the tails aren't cut.
- **Mutes:** skor / sampho / chhing. `mode` — top end only,
  `harmony` — warm/air with an 8-bar latch.
- **Checks:** 19 tracks / 111 hits in INTRO / 149 sliders, tension
  clean, cpu 0 in INTRO and 15/bar (8/s) in DUB, doubles with no overlaps, live ok.
