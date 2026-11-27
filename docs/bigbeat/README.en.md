# Big Beat — playbook (synth/electronic, instrumental)

A working brief for writing big beat in this project: a huge, compressed
breakbeat, an acid-style line, a sampled riff, and a rock-style build/drop.
**We are not SUNO:** no vocals and no imitation of acoustic instruments
(`docs/rules.en.md`). The 90s genre used voice/film samples; here their job is
done by synth stabs, noise and sampled *percussion* only.

Reading order: this file → `01-techniques.en.md` → `02-examples.en.md` →
`03-arrangement.en.md` → `04-strudel.en.md` → **`06-practice.en.md`** (playable
16-step drum grids, keys/scales and note-by-note riffs) →
**`07-variants.en.md`** (10 distinct characters for successive tracks + the
N+1 selection rule) → `05-sources.en.md`.

**Evidence note:** I cannot hear audio here. `06-practice.en.md` tags every
claim `[D]` documented, `[T]` tabbed, `[B]` published by-ear analysis, or `[R]`
my reconstruction — verify `[R]` material against the records by ear.

## 1. What it is

Wikipedia's definition: electronic music with **heavy, distorted breakbeats**
and **synthesizer-generated loops**, TB-303-style acid lines and heavy loops
from 60s/70s funk, soul, jazz and rock, at **100–140 BPM**, in conventional
pop/house/techno song structures. The sound is defined by loud compressed
breaks as much as by hooks; it shares DNA with jungle/DnB but is much slower.
Typical extras (original genre): punk-style shouts, spoken word, film/TV
dialogue, sirens, explosions, extended drum rolls, crescendos, drops, phasing
and flanging.

Fatboy Slim's own formula: "breakbeats of hip-hop, energy of acid house, pop
sensibilities of the Beatles, a little punk sensibility" (Wikipedia, citing
the Big Beat Boutique origin). Damian Harris (Skint) adds: dynamics and
machismo of hip-hop, energy and euphoria of acid house, dynamics of rock —
**"more about events" than grooves** (NPR/KEXP).

## 2. Tempo

| Frame | BPM | Reference |
|---|---:|---|
| Genre range | 100–140 | Wikipedia / EDM Bible |
| "Mid-tempo" hit zone | 90–120 | Vice: faster than hip-hop/trip-hop, below the 120 house baseline |
| Tutorial starting point | 135 | MusicRadar Beat Building |
| Techno-influenced big beat | 130 | Attack Magazine, Big Beat Techno |
| Early "slow dance record" | slower than contemporary rave | Liam Howlett on "Chemical Beats" (1994), NPR |

Practical rule: **pick 118–132** for a modern instrumental big beat; the break
must still breathe. Above 140 it turns into hardcore/jungle; below 100 it
turns into trip-hop.

## 3. Short history (why it sounds like that)

- 1989: Iain Williams (Big Bang) uses the term "big beat" (Wikipedia).
- 1994–95: London's Heavenly "Sunday Social" (Chemical Brothers, Jon Carter)
  and Brighton's **Big Beat Boutique** (Fatboy Slim + Damian Harris, 1995–2001).
- Labels: **Skint** (Fatboy Slim, Bentley Rhythm Ace, Lo Fidelity Allstars),
  **Wall of Sound** (Propellerheads, Wiseguys, Les Rythmes Digitales),
  Junior Boy's Own / Heavenly (Chemical Brothers), **City of Angels** (The
  Crystal Method, Überzone, Lunatic Calm) — AllMusic, NPR.
- Peak 1995–1999, decline from ~2001; soundtracks *The Matrix*, *Tomb Raider*,
  the *Wipeout* games carried it further (Wikipedia, Classic Pop).

## 4. The six-step formula (Vice, condensed)

1. Take a breakbeat and compress it hard.
2. Cut and paste bits of funk/soul records.
3. Add a shouted/sample "hook" fragment.
4. Fill gaps with one or two synth lines.
5. Add rock aggression, psychedelia or rave energy.
6. Repeat — the hook is the break itself.

For our instrumental version: **1** = sliced break + 909-style kick layering;
**2** = short filtered synth/chord stabs (no copyrighted lifts); **3** = a
vocal-like synth stab or noise sweep; **4** = one acid/303-style line; **5** =
distortion, rise and a hard drop; **6** = 8/16-bar cells.

## 5. Ingredients → processing → arrangement

| Ingredient | Job | Detail |
|---|---|---|
| Break sample | the hook | heavy compression, slice, keep original swing |
| 909-style kick + snare | weight and contrast | simple parts; synth kick for a heavy "1" |
| Acid line (303-ish) | rave energy | automation, resonance, selective notes |
| Sampled/synth riff | pop hook | short, repeated, filtered; no fake guitars |
| Build/roll/crescendo | tension | snare roll, filter open, one-bar silence |
| Tape sim + bus compression | glue | whole drum bus, not each hit |

Full processing notes: `01-techniques.en.md`. Form: `03-arrangement.en.md`.

## 6. Canonical listening (details in `02-examples.en.md`)

- The Chemical Brothers — "Chemical Beats" (1994), "Block Rockin' Beats"
  (1997), "Brothers Gonna Work It Out" (1998).
- Fatboy Slim — "Give the Po' Man a Break" (1996), "The Rockafeller Skank"
  (1998), "Praise You" (1998), "Right Here, Right Now" (1998).
- The Prodigy — "Firestarter" (1996), "Breathe" (1997), "The Fat of the Land"
  (1997).
- Propellerheads — "Spybreak!" (1997), "Take California" (1998),
  *Decksandrumsandrockandroll* (1998).
- The Crystal Method — "Busy Child" (1997), "Comin' Back" (1998).
- Wiseguys — "Ooh La La" (1998); Lo Fidelity Allstars — "Kool Rok Bass";
  David Holmes — "My Mate Paul" (1997).

## 7. In this repo

- Mini-notation **only via `m(...)`** (`docs/pitfalls.en.md`, Rule #1).
- Drums: `s('amen').slice(8, m('0 1 2 3 4 5 6 7'))` on a `github:`
  sample map; kick/snare from `s('bd')`/`s('sd')` layered over the break.
- Sections: native `TIMELINE` + `tlCurve`/`tlOr`; automation:
  `AUTOMATION` + `autoCurve` (see `tracks/coldwave/03-cold-rooms-v3.js`).
- Audits remain mandatory: `verify`, `tension`, `modes`, `latch`, `gains`,
  `doubles`, `cpu`, `live`. See `04-strudel.en.md`.

## 8. Sources

Everything above was read, not just listed: Wikipedia, AllMusic, Vice, NPR,
MusicRadar, Attack Magazine, Mixmag, Classic Pop, EDM Bible, Sonaa. Full index
with links and what each source confirmed: `05-sources.en.md`; also appended
to `docs/references.en.md`.
