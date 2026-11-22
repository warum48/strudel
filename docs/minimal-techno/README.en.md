# Minimal techno — playbook

Not "techno with everything stripped out", but techno where almost nothing changes — and because of that
everything changes. Material: kick, bass, rare percussion dots, one drone/pad,
a short stab or bleep. Development is in filters, density and micro-shifts,
not in a melody.

Our track: `tracks/minimal-techno/01-hollow-form.js` — 128 BPM, A modality
(A + E, rare Bb), 128 bars, 14 tracks, `mode` switch. **No ordinary pad**:
the intro is a metal texture + noise + vinyl; the low end is a sine drone, not our
"pad from track to track".

## 1. Sound

| Feature | How we do it |
|---|---|
| Tempo | 125–130 BPM (Hawtin: 128 is "ideal"); we take 128 |
| Meter | 4/4, four-on-the-floor, even pulse |
| Harmony | modal, without functional cadences; one center (A) |
| Rhythm | kick, rare hats/rim/clap; micro-shifts, not a "break" |
| Bass | sub ≤80 + rare mid-pulse (not a melody) |
| Texture | noise/air, short stab, high bleep |
| Development | slow cutoffs, turning layers on/off, density |

Minimal techno loves the **midrange** and emptiness: don't drown everything in sub and reverb,
leave room between hits.

## 2. Rhythm

- Samples — **uzu-drumkit** (bd/hh/oh/rim/cp/sh) and **Dirt-Samples**
  (metal/click/crackle), not the default TR-909/808 banks.
- Kick — deep and muffled (low `cut`), on every beat; on top a quiet
  `click:0` only as the attack, not a second kick.
- Hats — offbeat/8ths, rarely 16ths; don't fill everything.
- Rim/clap — dots that "surface" in sections, not a constant break.
- Modes: straight / broken / shuffle / strip — they change micro-shifts, not the lineup.

## 3. Bass

- Sub ≤80 on A1, long decay.
- Mid-pulse — short notes A2/E2, `cut` ~300, no melody.
- Octaves rare, as an accent; no "acid" pitch "pew".

## 4. Harmony and drone

- A modality: sine drone `[a2,e3]` with detune, occasionally `[a2,bb3]` (b2 as
  color). This is **not** our usual saw/Juno pad.
- The drone doesn't enter on the first bar: first metal/noise/vinyl, kick on the 8th.
- Stab `[a3,e4]` / `[a3,bb4]` — once every 2–4 bars, not on every weak beat
  (dub stabs — only if explicitly asked). In our track there is no stab: its role
  is played by a rare bleep.
- Bleep — a high sine, rare, in the delay.

## 5. Form

```
INTRO 0–8      metal, noise, vinyl; no pad and no pulse
FLOOR 8–16     the kick + click attack enters, texture
PULSE 16–48    minimal groove: kick, hats, sub, drone
BREAK 48–56    the kick leaves, drone/noise/bleep remain
DRIVE 56–88    full groove, rim/clap, cutoffs open up
SHIFT 88–104   broken/shuffle, stabs, micro-shifts
OUTRO 104–120  kick + texture, layers leave
OUTRO 2 120–128  tail without drums
```

## 6. Mistakes

- A melody/chord progression — that's no longer minimal.
- Filling 16ths and "developing" every 4 bars: development is slow.
- Starting with the same pad as in other tracks; here the intro is metal/noise.
- Default TR-909/808 banks "like everywhere"; uzu/Dirt and characteristic
  one-shots are better.
- Too much reverb: emptiness and the low end get lost.
- Dub stabs on the weak beat without a request.
- Changing instrument levels by section: turn layers on/off, not the volume.
- Duplicating noise (two identical white/brown): one source per texture.

## 7. Sources

- Wikipedia — Minimal techno (125–130 BPM, 128 for Hawtin, TR-808/909,
  repetition + understated development, "drums, basslines and funky grooves,
  only what's essential" — Robert Hood; mids more important than deep bass):
  https://en.wikipedia.org/wiki/Minimal_techno
- The Sound Atlas — Minimal techno (120–140 BPM, 4/4 four-on-the-floor,
  modal, sparse, meditative, bass heavy; Plastikman, Basic Channel, Robert Hood,
  Monolake): https://thesoundatlas.org/discover/minimal-techno
- `docs/rules.en.md` — anti-pop, constant levels, gates, versions.
