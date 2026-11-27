# Track rules

## Rule status

These are **the frames of our style**, not absolute laws. They help when the goal
is “our sound”: anti-pop, minimalism/complex jazz, counterpoint, muffled kicks, etc.
If a track has **a different goal** (stylization, reference, experiment, teaching
example, someone else's genre) — you can and should depart from the rules
deliberately. Then record in the track comment, README or message: which rule was
broken and why.

A pad is not mandatory: drums + bass + lead is a normal lineup.

**Dub — only on request.** If “dub” / “dub techno” is not explicitly stated — we
do not do reggae: no “skank” chords on every offbeat, no dub-reggae voicings by
default. That is bad taste in techno/trance and other styles; chords are placed by
the track's musical logic. In trance or experimental techno anything can happen;
adapt the rules to the goal.

**We do not overwrite versions.** When editing a track, make the next version
(`01` → `02` → `03`), and leave the old one as a reference of what was: it is
convenient to go back and compare. Files are light — history costs less than a
lost variant. So we do not touch `v2` when working on `v3`.

**Never bind different-sounding instruments to one slider.** Each independent
timbre has its own group and its own knobs (`vol`, cutoff, envelope, etc.), even
if the notes/source match. A shared slider for two different instruments = the
second one cannot be found in the mixer, and it lives “in the shadow” of someone
else's volume. That is how an abstract guitar got lost under a regular guitar's
knob.

**No negative literals in `slider(...)`.** The widget reads only the raw literal
of the argument, and `-2` is a unary minus → the value becomes `NaN`, the slider
shows `NaN`, and the instrument goes silent. Keep `0…N`, and do the sign/shift in
code (`.mul(-12)`, `.sub(4)`).

## Slider ranges

**Every cutoff slider's lower bound is 50, never higher** — `slider(160, 50, 400, 5)`.
A min of 60/100/200/800 leaves the filter half-open and there is no way to close
the layer in the panel. `min` below 50 (bass `40`) is fine. Applies to `cut` /
`lpf` knobs of every layer, in every new track, without a separate request.

## 303 cutoff automation

A **recommendation, not a requirement.** Applies to 303-style basses and leads.

- Acid lives in phrasing first (rests, repeats, accents). A static `cut` knob is
  fine when the line already carries it.
- Starting already open — full acid from bar 1 — or from about **100** is normal
  and good.
- A low-start sweep (from ~80 upward) is an ornament for a genuine acid moment,
  at most ~4 bars. Do not stretch it over the track — and never over half of it:
  a long climb out of a closed filter sounds like a mute, not acid.
- When you do automate, tie it to a real section move (build / climax), not to
  "every 303 must move".
- `min` still stays 50 (see “Slider ranges”) — that part is hard.

## LEVELS AND ENERGY

**An instrument plays at one level in all sections.** We change only on/off
(0/1), not volume: “quieter in the verse, louder in the chorus” — forbidden. The
exception is percussion: accents/fills (toms, rim, open hat) may change level,
that is justified.

**Section energy is not volume.** We achieve it with density (event frequency,
layers, fills), filter opening, decay/envelope length, ornaments. Volume — as a
last resort, a little; better to avoid.

**A disabled layer must not play.** `gain(0)` does not cancel building the
oscillator/sample: mute at the pattern level — `gateOf(key) = tlOr(key).fmap(v => v > 0.001)`
and `.mask(gateOf('lane'))`. Otherwise in INTRO/OUTRO the engine still counts
disabled drums and strings.

**The lead must not be in the shadow.** When creating a track, check the balance:
`node tools/levels.mjs <file> [bar]` shows the “energy” of lanes per bar
(Σ gain × unison over events). Guideline: lead/arp/pad/bass — in the same order;
if the lead is 2× quieter than the pad — that is a mistake, raise density/cutoff/
decay or the instrument level itself (constantly, not per section). Remember
polyphony: a chord + unison sound louder than one voice at the same `vol`.

**Checks** (`verify`, `tension`, `doubles`, `gains`, `cpu`, `levels`…) are also
**a tool, not a judge**. Their job is to find accidental mistakes within our
frames: “seems fine, but something hisses somewhere”. If the discrepancy is
deliberate, it is not a blocker.

## What “tension” is

In `tools/tension.mjs`, “tension” is harmonic collisions inside phrases:
1. **Tritone** (6 semitones) between a note and the bar root — in any octave.
2. **Tritone or minor second** (1 semitone) between a note and the bar's pad
   notes; a minor second is counted only in one octave.

This is not “bad/good” in itself, but a check for **accidental dirt**: in our
styles a tritone often sounds like a voicing mistake, not as color. Intentional
dissonance is marked with `// @dark` (tritones in anchored phrases) — then it is
considered the author's decision. A minor second in one register is often mush,
but in clusters and dark styles it can be deliberate color.

Threshold: 0 “tensions” is the norm for our “even” tracks, but **not a
requirement**. Tritones and minor seconds are often acceptable and even needed:
dark trance, industrial, experimental techno, tense transitions, clusters, acid
lines. If the collision sounds like a device, not accidental dirt — that is fine.

How to decide: listen, do not look at the counter. `tension` is a random-dirt
detector; found tension can be left deliberately. Example: `techno/21-dark-trance.js` —
`e+f+bb` cluster, drone `e+bb`, acid with +1/+6 semitones;
we do not run `tension` there because dissonance is the compositional goal.

By default, all bass is made with cutoff 80, not higher.

ANTI-POP

We do not make funny melodic lines.

Doing it through acid 303 playing around chords with a “pew” sound on every note
is funny; acid 303 is good for atonal riffs, or arpeggios where few notes change —
like one note from chord to chord — but not as a means of playing around chords.

Kicks by default are as muffled as possible.

We try to make music that is not funny, not to stay in the traditionally
overplayed center.

If jazz — we complicate the chords, more fourths, 9 11, move into modern jazz
rather than cafe lounge, never try to imitate a saxophone.

If reggae was not specifically requested — we do not do it; house must sound
stylish and minimalist, do not shove reggae chords onto every offbeat.

The main message — either minimalism-purity, with some juicy dissonances on 9ths,
or, if jazz and instrumental — then complex chords, non-worn transitions, complex
rhythms.

Try not to use banal 4-bar 1-2-4-5 schemes, with dominant resolutions, more
suspended notes.

Or the opposite — more counterpoint; counterpoint is good: there is a main motif
and a variety of harmonies on top. In the bass this rule is important too: the
bass line is not a walk through the chord harmony from its tonic, but more
counterpoint patterns characteristic of metal and techno riffs.

All the music should come out ultra-stylish; the rules above will help.

## No acoustic imitation, no vocals

**We are not SUNO.** We do not generate audio and we do not imitate live
instruments. The output is code that drives browser synthesizers.

- Never build fake saxophones, flutes, violins, trumpets, breath/reed ensembles
  or other acoustic “performers”. Winds especially read as cheap MIDI.
- If the user explicitly asks for a saxophone / flute / violin — answer plainly:
  this is a synth and electronic studio, we write code for browser synthesizers,
  it is not text-to-audio. Offer the closest electronic timbre instead.
- If there is no explicit request to imitate an acoustic instrument, do not
  announce anything — just silently pick the nearest electronic sound: a Moog-like
  voice instead of “piano”, an electric piano / Rhodes instead of an acoustic
  piano, synth brass instead of a trumpet, etc.
- No vocals and no “songs” in the lyrical sense: no singing and no vocal chops
  pretending to be a voice. If asked for vocals — same answer as above.

## Panel defaults

- Tone auto-opens the `keys`, `moog`, `arp` and `arp2` groups/instruments.
  A group that contains one of them opens as well, but its other instruments
  stay collapsed.
- The AUTOMATION body keeps its 160px max height; lanes stay 22px and the
  body scrolls instead of shrinking rows.
