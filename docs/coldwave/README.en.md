# Coldwave — playbook

Strudel practice card: `docs/practice-atlas.en.md` §13. Full grid, Dm bass
and delay values: `docs/coldwave/02-practice.en.md`.

Cold post-punk/minimal wave of the late 70s–80s (France, Belgium, Poland):
Kraftwerk + Joy Division + cheap synthesizers. Not "gloomy synthwave" and not
goth: **sparseness, mechanical rhythm, icy timbre, space**.
Our tracks: `tracks/coldwave/01-cold-rooms.js` (base), `02-cold-rooms-v2.js`
(CHORUS 16, OUTRO 8, a sparse solo and granular in BREAK, a clean German phrase
in OUTRO, an arpeggio wall in VERSE 2) and `03-cold-rooms-v3.js` (VERSE 3 with
the same levels as VERSE 2, rarer guitar, its own rate/resonance on the arp; a
rough bass pad after the "Horn" reference; a long noisy fuzz chord; 88 bars,
grain in OUTRO 1, OUTRO 2 without drums and bass).

## 1. Sound

| Trait | How we do it |
|---|---|
| Rhythm | 4/4, mechanical drum machine: kick on 1/3, rim/snare on 2/4, 8th-note hats |
| Tempo | 100–115 BPM (cold wave); rarely up to 120–130 |
| Key | Dm / Am, modal minor; harmony is almost static |
| Bass | short repeating notes, root/octave, low cutoff |
| Synths | thin mono lines, Juno pad with a long attack and release |
| Guitar | angular short phrases, chorus, no "rock" |
| Vocals | low, detached (ours has no vocals) |
| Mix | dark top end, long tails, lots of pauses |

The key: **do not fill in**. 3–6 layers; emptiness is part of the genre.
Removing a layer between sections is a stronger move than adding a new one.

## 2. Rhythm

- Kick: 1 and 3 (sometimes 4-on-floor, but not house).
- Snare/rim: 2 and 4; no light human shift is needed — on the contrary, keep it rigid.
- Hats: even 8ths; 16ths only as a rare accent.
- Toms: fills at the end of 4/8 bars, not every time.
- No funk syncopation and no reggae "skank" — that is a different genre.

## 3. Bass

- One or two notes per bar, repeating; sometimes an octave and b7.
- Sound: saw/square through a low LP, short decay, `clip`, no bright click.
- The bass holds the low end; the pad is cut on top so they do not fight.

## 4. Harmony

- One chord every 2–4 bars; movement comes from the upper voices and the bass,
  not from chord changes every half bar.
- Minor/Dorian; bVI and bVII as color, without dominant cadences.
- Ours: Dm pad + Bb/Gm as rare shifts; melody in a narrow range.

## 5. Synths and processing

- Pad: sawtooth, `unison 3`, `detune`, `attack 0.6–1.5`, `release 2–4`,
  `lpf 600–1200`, large `room`.
- Mono lead/arp: thin square/saw, `lpf 1500–3000`, dotted-eighth delay.
- Guitar: short pluck, `chorus`, `room`; plays "in angles", not chords.
- Delay: `delaytime 0.375` is ⅜ of a bar = 1.5 beats, i.e. a dotted
  quarter, not a dotted eighth. A dotted eighth is `delaytime 0.1875`
  (0.75 beat). At 108 BPM those are ≈ 833 ms and ≈ 417 ms.
- Reverb: long (2–4 s), but a moderate send; one shared IR size
  (otherwise Strudel rebuilds the impulse response and the sound breaks up).

## 6. Form

Typical: intro (pad+bass) → verse (drums+bass) → chorus (all layers) →
break (pad/bass, no drums) → verse/chorus → outro (tails).
Ours is 64 bars: INTRO 8 → VERSE 16 → CHORUS 12 → BREAK 8 → VERSE 16 →
OUTRO 4 — see the TIMELINE in the track.

## 7. Mistakes

- Too bright/loud: coldwave is not about "bright production"; the top end is muted.
- Major keys and pop progressions: almost always minor/modality.
- Overloading with layers and syncopation: the "cold" is lost.
- Short reverb: the tail is part of the genre.
- Many different `roomsize` at once: in Strudel this kills the CPU.

## 8. Drums: classic banks

Real coldwave is drum machines, not modern one-shots:

- **Roland TR-606** — the most genre-appropriate: thin kick, metallic hats,
  short snare (Trisomie 21, early French coldwave).
- **Roland TR-808** — low end, toms, rim; good for an "empty" mechanical bottom.
- **LinnDrum (LinnLM1)** — big gated snare for the 80s.
- In `02` there is also a German phrase by Rilke (`samples/de-quote/rilke.wav`,
  public domain): separately as a clean layer and as granular.

In Strudel this is `bank`, not sample loading:

```js
s('bd').bank('RolandTR606')
s('sd').bank('LinnLM1')
s('hh').bank('RolandTR606')
s('rim').bank('RolandTR808')
s('lt').bank('RolandTR808')
```

`strudel.cc` and our panel already load `tidal-drum-machines`, so it also sounds
in stock Strudel. v2 is assembled that way: 606 + Linn snare + 808 toms.

## 9. Sources

- The Sound Atlas — Coldwave (overview, BPM 95–145, instruments, rhythm/harmony):
  https://thesoundatlas.org/discover/coldwave
- BeatKey — How to Make Darkwave (BPM 100–130, cold wave 100–115, drum patterns,
  Juno pad, dotted-eighth delay, mistakes, chord vamps):
  https://beatkey.app/how-to-make-darkwave-music
- Wikipedia — Cold wave (history, France/Belgium/Poland, aesthetics, artists):
  https://en.wikipedia.org/wiki/Cold_wave_(music)
- Tracklister — What Is Coldwave (brief characterization; the page sometimes
  returns 500): https://tracklist.live/discover/guide/coldwave
- Dummy Mag — The Dummy Guide To Cold Wave (historical context):
  http://www.dummymag.com/features/the-dummy-guide-to-cold-wave

The guides above are consolidated into this file; the links are kept as primary
sources.
