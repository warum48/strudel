# Shoegaze — playbook

Strudel practice card (synth-only adaptation): `docs/practice-atlas.en.md` §14.
Full chord/grid/arrangement material: `docs/shoegaze/02-practice.en.md`.

A British indie/alternative genre of the late 80s–90s: a wall of guitar noise,
effects more important than the riff, vocals drowned in the mix, a "dreamy"
atmosphere. The name comes from guitarists looking down at their pedalboards.

Our series: `tracks/shoegaze/…` (no separate track yet — this is a reference).
The first shoegaze experiment: `tracks/coldwave/03-cold-rooms-v3.js`, VERSE 3.

## 1. What it is and what it is not

- **Shoegaze** = attack, wall of sound, noise, processed guitars, hidden vocals.
- **Dream pop** = more room for melody and counter-melody, less noise.
- **Noise pop** = faster/meaner, punk energy (Jesus and Mary Chain, Ride).
- **Blackgaze** = black metal + shoegaze (Deafheaven, Alcest).

Key names: My Bloody Valentine, Slowdive, Ride, Lush, Chapterhouse,
Cocteau Twins, Swervedriver, Catherine Wheel.

## 2. Tempo, key, harmony

- **BPM:** 90–110 (classic), 80–100 (dream pop / ethereal), 110–130 (noise pop,
  blackgaze). The sweet spot is **95–105**.
- **Keys:** D, E, G, A major for "light"; A/D/F minor for dark shoegaze.
- **Harmony is simple:** open chords, sus2/sus4, power chords.
  Complex jazz voicings turn into mud under heavy effects.
- Typical loops: I–iii–IV–I; I–IV; Isus2–IVsus2–V; i–bVII–bVI–bVII;
  I5–bVII5–IV5 (open strings as a drone); I–II (Lydian shimmer).
- **Open tunings** enhance the wow effect: DADGAD, Open D (DADF#AD), drop D.

## 3. Guitar is the genre

The guitar chain matters more than the notes:

```
guitar → fuzz/distortion → chorus → delay (dotted 8th) → reverb (hall, 3–6 s, 100% wet parallel)
```

- **Fuzz:** Big Muff / RAT, gain 60–80%, tone 40–50%. Not a metal distortion,
  but a dense cushion of harmonics.
- **Chorus:** slow (0.3–0.8 Hz), depth 40–60%, mix 40–60%. After the fuzz.
- **Delay:** dotted eighth (at 100 BPM ≈ 450 ms), feedback 30–50%, mix 25–35%.
- **Reverb:** a large hall, decay 3–6 s, pre-delay 30–60 ms, 100% wet on the send,
  return HPF ~200 Hz; in the mix 40–60% with the dry signal.
- **Reverse reverb:** a reversed reverb tail so that the "sigh" arrives before the
  chord (Yamaha SPX90 on Kevin Shields). This is not a forward reverb but one
  reversed in time.
- **Glide guitar (MBV):** the tremolo arm of a Jazzmaster/Jaguar, slightly pulled
  and "invisible" in the hand; when a chord is struck it constantly changes pitch
  and timbre. Plus open/non-standard tunings and many layers.
- **Guitars and amps:** Fender Jazzmaster/Jaguar guitars + Fender/Vox/Marshall
  amps; in the studio — dry cabinets so as not to smear the tremolo space.

## 4. Bass, drums, synths

- **Bass:** DI + amp, light fuzz (Vox Tone Bender-like), top-end cutoff,
  "felt" rather than "heard". Often plays roots/octaves.
- **Drums:** simple, behind the guitars. Kick 1/3, snare/rim 2/4, even 8th hats,
  ride in the choruses. Lots of room/plate reverb, low top end on the hats.
  On MBV's *Loveless* the drums are at times **sampled/programmed**
  (Akai S900 + Pro24) to get the desired groove.
- **Synths/textures:** flutes, feedback samples, vocals as an instrument, drones.
- **Vocals:** another texture, not a lead. Many layers, low level, no
  aggressive compression; on MBV — a dozen takes mixed into a "cushion".

## 5. Arrangement: density instead of progressions

One and the same harmony; the number of layers changes:

| Section | Bars | What plays |
|---|---|---|
| Intro | 8–16 | one guitar + reverb, layers gradually |
| Verse | 16–24 | drums, 2 guitars, vocals in the wall |
| Chorus | 8–16 | 3–4 guitars, maximum effects, ride |
| Verse 2 | 16–24 | remove a layer, contrast |
| Chorus/Peak | 16–24 | maximum density, tremolo picking, feedback |
| Bridge | 8–16 | one guitar + reverb or a feedback drone |
| Outro | 16–32 | reverb/feedback tails, fade-out |

Dynamics are the form: verse = 2 guitars, chorus = 4, bridge = 1.

## 6. Mix and mastering

- Guitars are the **loudest** element; drums sit −6…−10 dB relative to the wall.
- Guitar wall: HPF ~80 Hz, a gentle cut ~400 Hz; reverb/delay on sends.
- Vocals: HPF 300 Hz, LPF 8–10 kHz, soft chorus, Haas 10–20 ms; drowned.
- Bass: HPF 30 Hz, a boost at 80–120 Hz, light distortion; it does not fight the kick.
- Avoid a "wall of dirt": several guitars in one key, not in different keys;
  one shared reverb, otherwise mush.
- Mastering: −12…−9 LUFS, do not kill the dynamics with a limiter.

## 7. Common mistakes

- Too little reverb: if individual notes are audible, add tail.
- Drums louder than the guitars — that is no longer shoegaze.
- Complex chords/jazz voicings under heavy effects → mud.
- Vocals in front of the guitars.
- No contrast: everything at maximum from the first bar.
- Different keys across layers → not a wall but dirt.

## 8. How it fits Strudel

- Wall: `stack()` of 3–4 `s('sawtooth')`/`supersaw` layers with different `lpf`,
  `chorus`, `delay`, `room`; simple chords, not jazz voicings.
- Glide effect: `speed()`/`penv`/`slide` or detuned layers + `sometimesBy`
  with micro-shifts; Strudel has no tremolo arm, but it does have `detune` and `speed`.
- Reverse reverb: `rev()` on the reverb tail or reversing a sample/event before the beat.
- Vocals/texture: a sample in `striate`/`chop` and drown it in `room`/`delay`.
- Form: `arrange`/`TIMELINE` with layer density, not chord changes.

## 9. Sources

- Wikipedia — Shoegaze (history, characteristics, glide guitar):
  https://en.wikipedia.org/wiki/Shoegaze
- Sound on Sound — Classic Tracks: My Bloody Valentine "Only Shallow"
  (Kevin Shields on glide guitar, SPX90, Akai S900, vocal layers):
  https://www.soundonsound.com/techniques/classic-tracks-my-bloody-valentine-only-shallow
- BeatKey — How to Make Shoegaze Music (BPM, guitar chain, reverse reverb,
  chords, drums, mix, mistakes):
  https://beatkey.app/how-to-make-shoegaze-music
- ToneMirror — Shoegaze Guitar Tone (fuzz/reverb/modulation, offset guitars):
  https://www.tonemirror.so/guides/shoegaze-guitar-tone
- GuitarBomb — The Ultimate Shoegaze Pedal Guide (wall of sound, pedals):
  https://guitarbomb.com/blog/the-ultimate-shoegaze-pedal-guide-building-the-wall-of-sound/
- Plugg Supply — How to Make an 8-Minute Shoegaze Track (arrangement, reverb):
  https://plugg-supply.net/articles/how-to-make-shoegaze-beats-beats-2027-full-track-8-min

The guides are consolidated into this file; the links are primary sources for
going deeper.
