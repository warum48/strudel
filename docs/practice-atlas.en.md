# Strudel practice atlas — every style, playable ingredients

Cross-genre companion to `docs/pitfalls.en.md` (gotchas), `docs/rules.en.md`
(style law) and `docs/prompt-track.en.md` (file standard). This file is the
**positive recipe book**: BPM, scale, 16-step grid, one note/rhythm line and one
Strudel snippet per style. Every mini-notation string goes through `m(...)`.

These are **starter recipes distilled from the genre docs**, not transcriptions
of records; where a doc has a deeper source list, follow it. I cannot hear
audio here, so verify by ear when a detail matters.

For moves we have **not** used in any of our tracks (audited by grep) — `early`,
`scramble`, `shuffle`, `compressor`, `xfade`, `velocity`, `bpenv`, `rsize`,
`fanchor`, `shrink`, `stretch` — see `docs/new-tricks.en.md`.

## 0. Coverage — where the deep material is

| Depth | Styles | Where |
|---|---|---|
| Deep, multi-file, note-level | breakcore (11 files), big beat (8), khmer (6), experimental (6), IDM (5), dub techno (3), psytrance (3) | `docs/<style>/` |
| One long README with grids/riffs | hip-hop (298 lines), trip-hop (199) | `docs/hip-hop/README.en.md`, `docs/trip-hop/README.en.md` |
| Compact README, no step grids | techno, minimal-techno, coldwave, darkwave, shoegaze | cards 6, 8, 13 below |

**Hip-hop is diverse**: its README already has boom-bap and trap 16-step grids,
J Dilla micro-timing, D-minor bass, Dm9/Gm9/A7♭9 voicings and a separate dark
section (Phrygian, half-time hooks, sliding 808). It is one file, not ten —
this atlas gives it three cards (1–3) so it sits beside the other styles.

If a user asks to go deeper on a thin style, research 2–3 new sources and
create `docs/<style>/02-practice.en.md` in the same shape as
`docs/bigbeat/06-practice.en.md` — do not pad the compact README.

## 1. Boom-bap hip-hop — 90 BPM, D minor / Dorian

```
kick   x ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~ ~
snare  ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~
ghost  ~ ~ g ~ ~ ~ g ~ ~ g ~ ~ ~ ~ g ~
hat    x x x x x x x x x x x x x x x x
```
```js
$: s('bd').struct(m('x ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~ ~'))
$: s('sd').struct(m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'))
$: s('sd').struct(m('~ ~ x ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x')).gain(0.16)
$: s('hh').struct(m('x*16')).gain(m('[.9 .3 .6 .35]*4')).swingBy(0.06, 8)
$: note(m('d2 ~ d2 ~ f2 ~ a2 ~ d2 ~ f2 ~ a2 ~ c3 ~'))
  .s('sawtooth').lpf(220).clip(0.9).decay(0.1).gain(0.5)
```
**Practice:** the pocket is what you leave out; swing 0.02–0.08, never blanket
"humanize". Ghosts are 16ths around the backbeat. Source: `docs/hip-hop/`.

## 2. Trap / drill half-time — 140 BPM

```
kick   x ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~
snare  ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~
hat    x x x xxx x x x xxx x x x xxx x x x xxx
```
```js
$: s('bd').struct(m('x ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~'))
$: s('sd').struct(m('~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~'))
$: s('hh').struct(m('x*16')).sometimesBy(0.25, x => x.stut(3, 1/24, 0.8))
$: note(m('d1 ~ d1 ~ f1 ~ a1 ~')).s('sine').lpf(120).decay(0.3)
```
**Practice:** snare on beat 3 of the 2-bar frame, hats still run at 140 — that
contradiction *is* the half-time feel. Slide 808 into the key, mono below 120 Hz.

## 3. Dark hip-hop — 88 BPM, D Phrygian

```
riff   d3 ~ eb3 ~ f3 ~ a3 ~ bb3 ~ a3 ~ db3 ~ eb3 ~
```
```js
$: note(m('d3 ~ eb3 ~ f3 ~ a3 ~ bb3 ~ a3 ~ db3 ~ eb3 ~'))
  .s('sawtooth').lpf(700).lpq(6).gain(0.2)
$: s('rim').struct(m('~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~'))
```
**Practice:** ♭2 (E♭ against D) and the C♯ accent do the menace; keep the low
end short, no sustained ♭2 drone. One-bar silence before the hook.

## 4. Trip-hop — 84 BPM, D Dorian

```
kick   x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ ~
snare  ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~
hat    ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~
```
```js
$: s('bd').struct(m('x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ ~'))
$: s('sd').struct(m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~'))
$: note(m('<[d3,f3,a3,c4] [g3,bb3,d4,f4]>')).slow(2)
  .s('triangle').lpf(1400).room(0.4).gain(0.16)
```
**Practice:** 60–90 BPM, heavy slowed break, quartal/9th voicings, deep Moog;
one `mode` switch should select *eight drummers*, not mute layers
(`docs/trip-hop/README.en.md` §`2a`).

## 5. Big beat — 109–152 BPM, E minor / F# / G minor

```
kick   x ~ .7 .7 x ~ .7 .7 x ~ .7 .7 x ~ .7 .7   (Attack 130 BPM)
bass   e1 ~ ~ ~ bb1 ~ ~ ~ c2 ~ ~ ~ eb2 ~ ~ ~     (Block Rockin', 109)
```
```js
$: s('amen').slice(8, m('0 1 2 3 4 5 6 7')).gain(0.35).lpf(6000)
$: note(m('e1 ~ ~ ~ bb1 ~ ~ ~ c2 ~ ~ ~ eb2 ~ ~ ~'))
  .s('sawtooth').lpf(550).clip(0.9).duckorbit(2).duckdepth(0.4)
```
**Practice:** compressed break hook + one acid/fuzz line + one event per 4–8
bars; full grids, scales, riffs and 10 characters in `docs/bigbeat/`.

## 6. Techno — 125–135 BPM, minor modality

```
kick   x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~
hat    ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~
rim    ~ x ~ x ~ x ~ x ~ x ~ x ~ x ~ x
```
```js
$: s('bd').struct(m('x*4')).lpf(260).gain(0.6)
$: s('hh').struct(m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~')).hpf(6500).gain(0.14)
$: note(m('a1 ~ ~ ~ a1 ~ ~ ~ c2 ~ ~ ~ g1 ~ ~ ~'))
  .s('sawtooth').lpf(120).gain(0.25)
```
**Practice:** kick shorter than a beat at 128 BPM (469 ms); rumble below 80 Hz
separate from the bass; energy comes from density/filter, not volume.
`docs/techno/README.en.md`.

## 7. Dub techno — 104–125 BPM, 9th chords

```
stab   [am9] . . . . . . . . . . . . . . . .    (one short chord per 1–2 bars)
```
```js
$: note(m('<[a2,e3,b3,c4] [bb2,f3,c4,d4]>')).slow(8)
  .s('sawtooth').lpf(1100).room(0.5).gain(0.16)
$: s('hh').struct(m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~')).gain(0.08)
```
**Practice:** dotted-quarter delay, filter the repeats, dry stab louder than
the echo; modes change *texture*, never harmony. `docs/dub-techno/README.en.md`.

## 8. Minimal techno — 128 BPM, A modality (A + E, rare B♭)

```
kick   x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~
click  ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~
```
```js
$: s('bd').struct(m('x*4')).gain(0.55)
$: s('rim').struct(m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~')).gain(0.08)
$: note(m('a1 ~ ~ ~ ~ ~ ~ ~ e2 ~ ~ ~ ~ ~ ~ ~')).s('sine').lpf(90).gain(0.3)
```
**Practice:** no ordinary pad — voice/drones carry the harmony; micro-shifts
instead of new patterns; modes straight/broken/shuffle/strip.
`docs/minimal-techno/README.en.md`.

## 9. Breakcore — 174 BPM, Amen, coarse slices

```
amen   slices 0 1 2 3 4 5 6 7 on 8ths; leave holes, do not warp chops
kick   x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~
```
```js
$: s('amen').slice(8, m('0 1 2 3 4 5 6 7')).gain(0.4)
$: s('bd').struct(m('x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~'))
$: s('sd').struct(m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~'))
```
**Practice:** over-chopping is the named beginner failure; "warp is the groove
killer"; worklets (`shape`/`crush`) only on the kick or one lane.
`docs/breakcore/01-techniques.en.md`.

## 10. Drum & bass — 174 BPM, D Dorian (liquid) / tritones (techstep)

```
kick   x ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~
snare  ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~
hat    x x x x x x x x x x x x x x x x
bass   d1 ~ ~ ~ ~ a1 ~ ~ c2 ~ ~ ~ ~ bb1 ~ ~
```
```js
$: s('bd').struct(m('x ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~'))
$: s('sd').struct(m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~'))
$: note(m('d1 ~ ~ ~ ~ a1 ~ ~ c2 ~ ~ ~ ~ bb1 ~ ~'))
  .s('sawtooth').lpf(400).gain(0.3).duckorbit(2).duckdepth(0.5)
```
**Practice:** sub mono below ~140 Hz, pads HPF 200 Hz, breaks at full tempo but
mixed back; dark branch = deliberate tritone/minor-2nd under `@dark`.

## 11. IDM — 136 BPM, C–G♭–D♭–B♭

```
kick   x ~ ~ ~ x ~ ~ x ~ ~ ~ x ~ ~ ~ ~
glitch ~ ~ x ~ ~ x ~ ~ ~ x ~ ~ ~ ~ x ~
```
```js
$: s('bd').struct(m('x ~ ~ ~ x ~ ~ x ~ ~ ~ x ~ ~ ~ ~'))
$: s('glitch').slice(8, m('0 1 2 3 4 5 6 7')).gain(m('[.8 .2 .6 .3]*2'))
$: s('noise2').slice(16, m('0 3 6 9 12 15')).hpf(2500).gain(0.1)
```
**Practice:** 3–4 foreground layers only; randomness on textures, not the
kick; grains dry (room ≤0.2); 8 switches + 6 pads for hands-on.
`docs/idm/README.en.md`.

## 12. Psytrance — 140–148 BPM, F# phrygian dominant

```
kick   x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~
hat    ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~
bass   gb2*16 (rolling, short 50–75 ms notes, air between)
```
```js
$: s('bd').struct(m('x*4')).gain(0.6)
$: s('hh').struct(m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~')).gain(0.1)
$: note(m('gb2*16')).s('sawtooth').lpf(700).lpq(8).gain(0.22)
```
**Practice:** phrygian dominant (1–♭2–3–4–5–♭6–♭7), 3–5 octave filter sweep
per 8–16 bars, note length ~50–75 ms at 145 BPM. `docs/psytrance/README.en.md`.

## 13. Coldwave / darkwave — 100–124 BPM, minor / Phrygian

```
kick   x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~
snare  ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~
clap   ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ (dotted-8 delay, 0.75 beat)
```
```js
$: s('bd').struct(m('x*4')).gain(0.5)
$: s('sd').struct(m('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~'))
$: note(m('<[a2,e3,a3] [f2,c3,f3]>')).slow(2)
  .s('sawtooth').lpf(900).room(0.6).gain(0.14)
```
**Practice:** 3–6 layers, emptiness is the genre; one shared reverb size,
dotted-eighth delay; darkwave adds ♭II (B♭ in A minor) and a leading bass.
Both docs: `docs/coldwave/`, `docs/darkwave/`.

## 14. Shoegaze (synth-only adaptation) — 90–110 BPM, D/E/A major or A/D/F minor

```
kick   x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~
wall   one chord per bar, 2–4 detuned saw layers, slow filter, long delay
```
```js
$: note(m('<[d3,a3,d4,f#4] [a2,e3,a3,c#4]>')).slow(2)
  .s('sawtooth').unison(4).detune(0.12).lpf(1800).room(0.7).gain(0.12)
$: s('bd').struct(m('x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~'))
```
**Practice:** all layers in **one** key; delay dotted-eighth at 100 BPM ≈ 450 ms,
feedback 30–50%; **no acoustic guitar imitation** — the "wall" is detuned
synths through filters/delay/reverb. `docs/shoegaze/README.en.md`.

## 15. Khmer pinpeat — 88 BPM, 7-tone `c db eb f gb ab bb`

```
skor   x ~ x ~ x x ~ ~ x ~ x ~ x x ~ ~
chhing x ~ x x x ~ x x x ~ x x x ~ x x
```
```js
$: s('sampho').slice(4, m('0 1 2 3')).gain(0.3)
$: note(m('c4 db4 eb4 f4 gb4 ab4 bb4')).s('sine').lpf(2000).gain(0.1)
```
**Practice:** heterophony + colotomy, not chord harmony; 8-bar phrase, drone
latched 8 bars, scenes change rhythm only, `// @mutes` for instruments.
`s('sampho')` needs the declared Khmer sample map from `tracks/khmer/02-skors.js`.
`docs/khmer/README.en.md`.

## 16. Ten Strudel rules that matter in every style

1. Mini-notation **only** `m('...')`; double quotes in code are mini-notation to
   the transpiler, so data strings stay single-quoted.
2. No vocals, no acoustic soloists; offer electronic timbres.
3. Guard sample maps: `if (typeof samples === 'function') { samples('github:...') }`.
4. No negative literals in `slider(...)`; apply sign in code.
5. One instrument — one slider; declare roles in `const UI`, not comments.
6. Mute at the pattern level (`gateOf`/`mask`), not `gain(0)` — disabled layers
   still build nodes.
7. Energy = density / filter / decay / register, not volume changes per section.
8. Worklets (`shape`, `crush`, `distort`) are per event: put them on rare long
   hits, not 16ths; keep CPU ≤ ~150 worklets/s.
9. One shared `fx.reverb.size`; native `AUTOMATION`/`autoCurve`, and remember
   `tlCurve` carries its last value forward — set `0` explicitly.
10. Audits before delivery: `verify`, `tension`, `modes`, `latch`, `gains`,
    `doubles`, `cpu`, `levels`, `live`.

Full explanations with real failure cases: `docs/pitfalls.en.md`.

## 17. Writing a new style or a new track

- Read the style doc + this atlas card + `docs/rules.en.md` + `docs/pitfalls.en.md`.
- Research 2–3 **new** sources for that character; append URLs + one-line findings
  to `docs/references.en.md` (or `docs/<style>/`);
- Write the DNA line at the top: `// <STYLE> N · <character> · <BPM> · <key/scale> · <break> · <hook>`.
- New character = new file under `tracks/<style>/`; never rewrite an existing track.
- Verify in strudel.cc too — the local panel masks the single-quote bug.
