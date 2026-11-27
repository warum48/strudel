# Big Beat — techniques (drums, bass, processing)

Based on MusicRadar's *Beat Building: big beat*, *How to get the classic
breakbeat sound*, *How to layer monstrously phat breakbeats*, Attack Magazine's
*Big Beat Techno*, and Vice's six-step formula. Full links: `05-sources.en.md`.

## 1. Start from a break, not from a grid

- "Sample selection was everything" — the break is the foundation, and the
  original 90s producers dug for unexpected material (Fatboy Slim used the
  intro of *Ashes, The Rain And I* by James Gang for "Right Here, Right Now";
  Billy Squier's "The Big Beat" is the obvious namesake source).
- MusicRadar does **not** convert the break to MIDI: the flavour of the
  original beat is the point. Slice it in a sampler, **poly mode on** so
  several hits can sound together.
- Keep most of the original two-bar pattern; add a couple of kick hits near
  the end of the loop. Work at **135 BPM** — "right in the ballpark".

Strudel equivalent: `samples('github:yaxu/clean-breaks/main')` +
`s('amen').slice(8, m('0 1 2 3 4 5 6 7'))`. Use `slice` to re-sequence; do not
warp the chops into a rigid grid if the groove is the reason you picked it.

## 2. Layer the break with programmed drums

- Add a **909-style kit** for beat and percussion: it gives contrast to the
  sampled break. Often only a kick on "1" and a snare are needed.
- For a really heavy "1", use a **synth kick** so decay can be adjusted
  independently.
- Don't worry about velocity/groove on the programmed parts — the sample
  already carries it. Keep the electronic layer clean-ish; **tape sim +
  compressor on the master** binds the two worlds together (MusicRadar).
- Layering rule (Computer Music): hits must **not share the same frequency**.
  Check the kick's peak (e.g. ~50 Hz) with an analyser, keep the bassline out
  of that band, and use the sampler's pitch control to move layers.
- "Vinyl personality": put a quiet vinyl-noise bed underneath and let the
  drum-bus compression react to it; this is what turns programmed hits into a
  sampled-sounding break (MusicRadar DnB break tutorial, same technique).

## 3. Slice, re-sequence, extend

From *How to get the classic breakbeat sound*:

1. Crop/warp the source break non-destructively; slice by transients (or by
   grid/manually), trigger slices from C1 upward.
2. Rearrange hits horizontally (new positions) and vertically (different
   slices at one position); delete hits; edit velocities.
3. Apply processing **per slice** — compressor/brick-wall on the kick, synced
   delay on a slice with the low end of the repeats filtered out, distortion
   or bitcrush where needed.
4. Timing choice: either extract the sample's groove and apply it to the
   programmed parts, or quantise the break when it plays against them. Keep
   the break unquantised when it is prominent or alone.
5. Bounce the result when happy, then load copies in a sampler and trigger
   them from different points for stutters, chops and fills.

## 4. The 303/acid line

- Wikipedia names **TB-303-style lines resembling acid house** as a genre
  ingredient; Liam Howlett cites "a breakbeat with an acid riff and a hip-hop
  influence" as the novelty of "Chemical Beats".
- MusicRadar adds an acid-style bassline with **automation to keep it
  evolving**; Mixmag describes "Busy Child" as "dripping in acid".
- Practical recipe: one resonant monophonic saw, short decay, **selective
  glide** (only when the interval asks for it), accent = louder + brighter,
  and a slow cutoff automation across 8–16 bars. Keep the fundamental above
  the kick's 50 Hz; give the sub its own sine layer.

## 5. The hook and the "events"

- Original genre: shouted vocal fragments, spoken word, film dialogue,
  sirens, air horns, explosions, gunshots (Wikipedia); Vice's formula adds a
  "get busy, child"-style vocal sprinkle.
- Damian Harris: "more about **events**" than house-style grooves — dynamics
  of rock, not constant flow.
- **Our replacement** (synth-only, no vocals): a short filtered stab, a
  noise/siren-like sweep from a resonant filter, a metallic ring from a tuned
  feedback delay, and silence. One event per 4–8 bars is enough.

## 6. Glue and loudness

- Fatboy Slim's breaks are **heavily compressed**; the compressed break is the
  sound, not a mastering afterthought (Wikipedia, Martin Whiteman in NPR).
- Drum bus: saturation/compression, tape simulator, light glue. Attack's Big
  Beat Techno uses a compressor preset ("Bass-Low Extender") plus a little
  synced echo (~25% on the kit macro) to bind the pattern.
- Attack's kick settings are instructive even outside Ableton: push the low
  end (Boom ~60, Drive ~10 dB, Glue high), pitch the kick down ~−6 semitones,
  add late 16th off-beat kicks to simulate a heavy sidechain, a short low tom
  (~200 ms decay) on the last beat, and an off-beat hat.
- Effects named by Wikipedia for the genre: **filters, phasing, flanging**;
  delay/reverb and tape sim from MusicRadar. Keep the sub dry and mono.

## 7. Common failures

| Failure | Fix |
|---|---|
| Over-chopping until no groove remains | coarse slices first (4/8), keep the original pattern audible |
| Kick and bass fight | check the peak frequency; move bass up or high-pass it; duck to the kick |
| Break and programmed drums feel disjointed | extract groove from the break, or quantise only when layered |
| Loud but lifeless | one compressed break + events (roll, stop, stab) instead of more layers |
| Lifting a famous sample | do not; use cleared maps or synthesize the riff (see `docs/rules.en.md`) |
| CPU blow-up | worklets (`shape`/`crush`) per event are expensive; put them on the kick or one break lane only |
