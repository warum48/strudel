# Darkwave / New wave — playbook

Strudel practice card: `docs/practice-atlas.en.md` §13. Full grid, tabbed
bass and chord/ornament recipes: `docs/darkwave/02-practice.en.md`.

The dark side of new wave: post-punk + synthesizers + drum machines; minor,
low timbres, melancholy, yet a **song**, not ambient. The reference is
mid-period Depeche Mode (`Black Celebration` → `Violator`): synths,
sampler details, a big gated snare, dark harmony and a memorable melody.
Not to be confused with our coldwave: there it is **sparseness and ice**,
here it is **denser, more dramatic, with a "hook"**.

Our track: `tracks/darkwave/01-static-confession.js` — A minor, 124 BPM,
a synthetic lineup (TR-909/808, pulse bass, hollow pad, string machine,
FM bell, arpeggio, lead), 104 bars, INTERLUDE and a long OUTRO.

## 1. Sound

| Trait | How we do it |
|---|---|
| Tempo | darkwave 100–140 BPM; our choice is 124 (new wave / mid Depeche) |
| Meter | 4/4, straight groove, no swing; light humanize only on the hats |
| Key | A minor/Phrygian, no dominant; bII (Bb) as color |
| Rhythm | mechanical drum machines, big snare, tom fills |
| Bass | pulse/square, low cutoff, octave jumps, short attack |
| Synths | hollow pulse pad, string machine, FM bell, arpeggio, mono lead |
| Mix | dark top end, long reverb, dotted-eighth delay, room for emptiness |

The key difference from coldwave: **more movement and drama**. The bass leads,
the arpeggio and bell provide "ornaments", the lead carries the melody.
Emptiness is needed too — in the INTERLUDE and OUTRO.

## 2. Rhythm

- 909: kick, snare, clap, hats; 808: toms, rim/cowbell for color.
  The kick is muffled (low `cut`), without a bright click.
- The main groove is 4-on-floor or 1/3 with an extra hit; snare on 2 and 4.
- Big snare: `room` + a shared large `roomsize` (gated feel),
  short `decay`, `clip`.
- Hats 8ths/16ths; open hat as an accent, not constantly.
- Toms are fills at the end of 8/16 bars, not every time.
- The clap doubles the snare only in CHORUS (drama); it is absent in the verse.

## 3. Bass

- Pulse/square with `pw` (hollow timbre), LP 250–450, `lpenv` for attack.
- Short notes, `clip`/`decay`, no bright click.
- Octave jumps (`sometimesBy` + `note(12)`) — a signature new-wave move.
- In CHORUS we add a quiet sine sub on the same roots.
- In OUTRO we take the bass cutoff down to a minimum — the bass "sinks into the floor".

## 4. Harmony

- **Anti-pop**: no dominant with G# and no 1–2–4–5 cadences.
  `Am9 – Bbmaj7 – Fmaj7 – Dm7` (i–bII–bVI–iv): bII is a Neapolitan color;
  the 9ths/7ths hang instead of resolving.
- One chord per bar (`chords`), pad/strings — `slow(2)` (two bars each).
- Melody in a narrow range, b3–b6–5; phrases do not "close" on the tonic.
- The arpeggio is built from the chords (`.arp`), not from a separate line —
  that way the harmony and the ornament do not diverge.
- Bass is an **A pedal** with a b2 neighbor (Bb) and a rare octave, not a walk
  through the chord roots: counterpoint matters more than "correct" harmony.
- The kick is muffled by default (`cut` 1200); the bass by default has `cut` 80.

## 5. Synths and processing

- **Hollow pad**: `s('pulse').pw(0.28)`, `unison 2`, `detune`, chorus,
  `hpf 200`, attack 0.8–1.2, release 2–3. Hollow, not a "Juno stack".
- **String machine**: `sawtooth` unison 4, `hpf 350–450`, chorus 0.7,
  slow attack; it enters in CHORUS and OUTRO.
- **FM bell**: `s('sine').fmi(2).fmh(2.01)`, short attack, long
  release, dotted-eighth delay; sparse phrases, not arpeggios.
- **Arpeggio**: pulse, short decay, `lpf 2200–3000`, delay, light pan LFO.
- **Lead**: square/pulse, `lpf 1800–2600`, delay + room; two phrases (verse /
  chorus) — the `leadVar` switch.
- A single reverb for everything (`fx.reverb.size`); dotted delay: `delaytime 0.375`.

## 6. Form (our track, 104 bars)

```
INTRO 0–8      pad, bell, noise; no drums
VERSE 8–24     drive groove, bass, arp low, sparse lead
PRE 24–32      build: 16th hats, toms, riser, arp higher
CHORUS 32–48   big snare + clap, open hat, string machine, lead
INTERLUDE 48–56  almost no drums: pad, bell (rev), noise
VERSE 2 56–72  half-time, dark bass, sparse arp
CHORUS 2 72–88  everything, lead +12, arp high
OUTRO 88–104   88–96 thin drums, 96–104 no drums; tails
```

Switches (as in our rules): `play` (LOOP/SONG/HOLD), `mode` (4 grooves),
`arpVar` (low/high), `leadVar` (two phrases). Timeline-dependent switches
are interactive only in LOOP.

## 7. Mistakes

- Copying coldwave instruments 1:1: it is a different genre in terms of density.
- A constant 16th arpeggio and lead at the same time — mush; separate them by section.
- Too "bright" a top end: darkwave likes a muted top and low mids.
- Many different `roomsize` — in Strudel this rebuilds the IR and causes dropouts.
- Forgetting about emptiness: INTRO/INTERLUDE/OUTRO must breathe.
- Dub stabs and reggae syncopations — not this genre.

## 8. Sources

- Wikipedia — Dark wave (definition, minor, "slower tempos, lower pitches,
  more minor keys", synth/sampler/drum machine, Depeche Mode in the first
  generation): https://en.wikipedia.org/wiki/Dark_wave
- The Sound Atlas — Darkwave (BPM 100–140, 4/4 straight, mechanical drum
  machine patterns, driving bass, minor key dominance, synth/guitar layers):
  https://thesoundatlas.org/discover/darkwave
- Wikipedia — Music for the Masses (lineup: ARP 2600, Minimoog, RSF Kobol,
  Emulator II, Synclavier, Fairlight CMI, EMS Synthi; sampling sessions;
  Wilder/Bascombe; the "minor-key" Strangelove):
  https://en.wikipedia.org/wiki/Music_for_the_Masses
- Wikipedia — Violator (Flood + Wilder; sampling live percussion and
  looping to avoid a "cold drum machine"; a mix of alternative/dance/
  goth): https://en.wikipedia.org/wiki/Violator_(album)
- Wikipedia — Depeche Mode (the Synclavier and E-mu Emulator shifted the band's sound):
  https://en.wikipedia.org/wiki/Depeche_Mode
- BeatKey — How to Make Darkwave (BPM 100–130, dotted-eighth delay, mistakes;
  a general reference, not for copying instruments):
  https://beatkey.app/how-to-make-darkwave-music

The guides above are consolidated into this file; the links are kept as primary
sources.
