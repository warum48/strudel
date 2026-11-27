# Big Beat — arrangement (build, event, drop)

## 1. The form in one paragraph

Wikipedia: big beat uses **conventional pop, house and techno song structures**
with crescendos, builds, drops and extended drum rolls. NPR adds the two
parents explicitly: rock-style **verse/chorus/verse** flow plus the **build/
drop** format of house. Damian Harris (NPR): it is "more about **events**" than
house grooves — dynamics of hip-hop, euphoria of acid, dynamics of rock. Jon
Carter names "Private Psychedelic Reel" as the peak precisely because it kept
inventing instead of reusing obvious samples.

So a big beat arrangement is **cells of repetition punctuated by events**:
the break repeats, then one thing happens (a stab, a stop, a roll, a filter
open), then the repeat returns at a higher energy level.

## 2. Event vocabulary (use one at a time)

| Event | What changes | Source anchor |
|---|---|---|
| Stop / one-bar silence | everything drops out just before the return | house build/drop practice; Match the drop with silence |
| Snare/extended drum roll | 8ths → 16ths in the last 4 bars | extended drum rolls (Wikipedia) |
| Filter open + resonance sweep | the acid line or break gets brighter | phasing/filtering common in the genre (Wikipedia) |
| Vocal-like stab | short filtered chord/noise sweep where a shout would sit | Vice's sample hook; our synth-only replacement |
| Extra kick on the "1" | synth kick with a longer decay | MusicRadar, Big Beat beat |
| Crescendo / climax loop | repeated screech or stab after the drop | Mixmag on "Block Rockin' Beats" |

## 3. Working bar map (recipe, not a source claim)

32–48 bars is enough for an instrumental track; a 90s single would run longer.

| Bars | Section | Elements | Energy |
|---:|---|---|---|
| 1–8 | Intro | break only, compressed; one extra kick at the end of the 2-bar loop | low |
| 9–16 | Groove A | break + 909-style kick/snare + sub; acid line enters late | mid |
| 17–24 | Build | acid automation opens, hats double, snare roll in last 4 bars, **1 bar silence** | rising |
| 25–32 | Drop | full break + kick + acid + riff stab; one punctuating event | peak |
| 33–40 | Breakdown / verse | kick out, break filtered down, one synth motif (or drone) | low-mid |
| 41–48 | Return | rebuild the drop with one *new* element, then strip back to the break | peak → out |

Repeat cells at 4/8 bars; change **density, filter, decay and events**, not
volume. Silence right before the drop is the cheapest way to make it land.

## 4. Arrangement rules specific to this repo

- Use native `TIMELINE` with contiguous sections and `tlCurve`/`tlOr`/`gateOf`
  for section-gated lanes; automation goes in `AUTOMATION` with `autoCurve`/
  `autoAt`. Reference file: `tracks/coldwave/03-cold-rooms-v3.js`.
- Keep section markers human-readable (`INTRO / GROOVE / BUILD / DROP /
  BREAK / RETURN / OUTRO`) — the panel timeline shows them.
- Do not gate whole instruments with sliders if a scene can do it; voices that
  carry the drop should be present in the mix and gated by the timeline.
- Put the "event" (stab, roll, noise sweep) on its own lane so it can be
  triggered by a momentary pad (`// @pads`) during a live set.
- One hard rule: every mini-notation string goes through `m(...)` —
  `s('bd').struct(m('x*4'))`, not `s('bd').struct('x*4')`. The local panel
  hides the difference; strudel.cc does not (`docs/pitfalls.en.md`).
- Finish with the audit gates (`verify`, `tension`, `modes`, `latch`, `gains`,
  `doubles`, `cpu`, `live`) before calling a track done.
