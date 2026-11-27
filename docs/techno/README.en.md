# Berlin techno — production playbook

Strudel practice card: `docs/practice-atlas.en.md` §6. Full grids, low-end
recipes and bar map: `docs/techno/02-practice.en.md`.

"Serious" Berlin techno is not a set of sounds but **pressure, repetition
and a few sounds that do all the work**. No pop dramaturgy:
not "verse-chorus", but a long groove where filters, density and
texture change. The kick is the anchor. Rumble is the bass and the glue. Everything else is minimal
events and space.

## 1. Tempo and groove

- 125–135 BPM for classic Berlin; 140+ is already the hard branch.
- 4/4, kick on every beat; swing 50–55 % (Attack) or almost straight — but not
  an "ideal grid": hats and percussion need a little slack.
- The kick never disappears. Exits are made with a filter and by removing layers, not with a
  "drop" or by stopping the kick.

## 2. Kick

- **Tuned, short, driven.** Foundation 45–60 Hz; below ~35 Hz is vibration,
  not weight.
- Three parts: **click** (snap/noise HP), **body**, **sub**; the pitch
  envelope falls 1–2 octaves in 10–20 ms.
- Length shorter than a beat: at 128 BPM a beat is ~469 ms; a kick with a 500 ms tail
  runs into the next one and the subs cancel each other. Short kick, long
  rumble — deliberate.
- Mono, saturation/clip, light drive. A second low tom as a "second kick" —
  a trick from Berghain bits (Attack).
- Our track: uzu `bd` + a quiet `click:0` only as the attack; `shape` + LP
  ~180; no long sub tail.

## 3. Rumble

- Kick → **100% wet reverb, decay 2–4 s**, then saturation/distortion, LP 150–250,
  HP ~30. This is no longer a reverb but a bass layer.
- **Mono** and **sidechained to the kick**: ratio ~4:1, release until the next hit —
  the rumble "breathes" between kicks.
- Automate the rumble size, drive or LP over 16/32 bars — it must not
  sound the same.
- Solo the rumble sounds strange and weak; in the mix it glues.

## 4. Bass and low end

- Sub 20–60 Hz: controlled, mono, little is a lot. Sidechain to the kick.
- Bass 60–250 Hz: short notes, 1–3 notes per loop; not a melody and not a hook.
- No "pew-pew": no pitch envelopes on every note; a filter envelope —
  yes, but short.
- Our track: sine sub A1 + short pulse bass A2/Bb2/Eb2, all on orbit 2,
  which ducks the kick.

## 5. Percussion

- Clap — **on the second kick**, not on 2 and 4 (Attack); this makes the groove
  "open".
- Hats: not too busy, not too clean, not too polite.
  16ths with accents, light swing, sample choice (`n`).
- Industrial sounds — processed real objects: pipes, doors,
  metal; a short dark room, not a big hall.
- Rim/clap/metal — dots, not a second break.

## 6. Harmony and events

- There may be no harmony at all: atonal/modal, one center.
- Stabs and short sequences of **1–3 notes** that spin
  while the sound itself changes (filter, delay, drive). "Never sounds
  the same twice".
- No FM bells with a melody and pop intervals; the decoration is
  texture, not a theme.

## 7. Arrangement

- Segments of 8/16/32 bars; a new element on the boundary, not every 4 bars.
- Long DJ form 6–8 minutes: INTRO → BUILD → LIFT → (subtraction) →
  DRIVE → PEAK → OUTRO. Development is density, filters, automation.
- Tension through **subtraction**: remove hats/clap/bass, keep kick+rumble;
  bring the layers back.
- A master filter on the top end is the main build tool; automate it over
  16/32 bars.
- Our track: 192 bars (≈5:50 at 132), no pop drops, kick anchor.

## 8. Mix and club

- Low end mono; sub separate from bass; kick and rumble must not fight.
- Small/medium speakers: the kick is heard thanks to click/saturation, not volume.
- Short dense rooms; the top end is dark but not dull.
- Check on references and on a system, not only in headphones.

## 9. What not to do (our v2 failure)

- A melodic FM lead/bell and "song-like" 7-bar phrases.
- Default 909/808 with no processing and no rumble.
- Bass notes as a melody; chords/pad.
- Many layers "just in case", polite 16th hats.
- A big hall and clean reverb instead of a short room.
- Changing levels by section instead of turning layers on/off.

## 10. Our track

`tracks/techno/23-black-room.js` — 132 BPM, 192 bars, 15 tracks, 68 sliders.
Kick uzu `bd` + `click:0` as the attack; rumble from the same kick into a wet reverb
(saturation, LP, orbit 2, ducked by the kick); low tom as a "second kick";
clap on the second kick; industrial metal + rim; sub ≤80 + short mid-pulse;
1–3 note tension pulse; noise/vinyl. No melody, pad or pop drops;
the master filter is automated over 16/32 bars.

## 11. Sources

- Attack Magazine — Beat Dissected: Dark Berlin Techno (120–130 BPM,
  swing 50–55 %, kick + low tom as a second kick, clap on the second kick,
  industrial percussion, dark room/spring reverb):
  https://www.attackmagazine.com/technique/beat-dissected/dark-berlin-techno/
- Distrikt Audio — Berlin Techno Sound Design (125–135 BPM; kick tuned/short/
  driven, click+body+sub, mono; rumble: 100% wet 2–4 s, saturation, LP
  150–250, HP 30, sidechain; clap: noise+tonal+tight room; industrial
  objects; 1–3 note loops; short dense rooms; 16/32-bar automation):
  https://distriktaudio.com/blogs/blog-education/berlin-techno-sound-design-capturing-underground-club-energy
- Maxim Schunk — hard techno kick & rumble (click/body/sub, pitch envelope
  1–2 octaves in 10–20 ms, short kick, rumble fills the gap,
  sidechain 4:1): https://maximschunk.com/news/hard-techno-kick-rumble-guide
- IQSounds — Techno Rumble Kick Processing (rumble as bass and glue, low-end
  control, sidechain): https://iqsounds.com/blogs/news/techno-rumble-kick-processing-guide
- r/TechnoProduction — arrangement threads (segments 2/4/8/16/32, "techno
  is not a song but a groove", a new event per segment):
  https://www.reddit.com/r/TechnoProduction/comments/kb0efl/what_kind_of_arrangement_would_you_recommend/
- Wikipedia — Berghain (club/sound context): https://en.wikipedia.org/wiki/Berghain
