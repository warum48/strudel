# Buchla / West Coast: what we take

Don Buchla founded Buchla & Associates in Berkeley in 1963. The first modular
instrument was commissioned by Morton Subotnick and Ramon Sender for the San
Francisco Tape Music Center; the 100 series was installed in 1965, the 200
"Electric Music Box" followed in 1970. The 200e (2004) added digital control
and patch memory with an analog panel.

## 1. Philosophy

Buchla avoided the word "synthesizer": he did not want to imitate existing
instruments, but to build instruments for **new** sounds. Hence:

- no piano keyboard; touch/pressure plates;
- voltage control (CV), almost everything is modulatable;
- sound is the result of **interaction**, not a preset.

## 2. West Coast vs Moog (East Coast)

| Moog / East Coast | Buchla / West Coast |
|---|---|
| oscillator → 24 dB lowpass → VCA | complex oscillator → waveshaping → LPG |
| timbre = subtractive filtering | timbre = FM/AM, folding, waveform |
| keyboard, equal temperament | touch controllers, non-12-TET |
| "play a familiar sound" | "make a new sound" |

## 3. Complex oscillator

The key idea: **two oscillators in one module**. One principal (carrier),
one modulation oscillator. Between them:

- **FM** — frequency modulation; index and ratio set brightness/metal.
- **AM** — amplitude modulation; sidebands and ring-mod character.
- **waveshaping / folding** — dynamic waveform distortion; adds harmonics
  without becoming ordinary distortion.
- crossfade between clean and modulated signal.

In the 259 / 261e this is the "timbre" section: one complex voice can be a
fat bass, metal, or a cloud of partials without an external filter.

## 4. Lopass Gate and vactrol

Buchla 292 is a low-pass gate: a VCA and lowpass together, driven by a vactrol
(photoresistor + lamp). The vactrol gives a **non-linear, natural** decay:
short hit = "bongo", long = "breath". It is not just a filter with an envelope:
amplitude and timbre close together.

## 5. Other modules

- **281 / 281e** — function generator: arbitrary functions, LFO, one-shot.
- **266 Source of Uncertainty** — random/uncertain voltages.
- **245 / 250e / 248 MARF** — analog/digital sequencers, CV recorders,
  quantizers; MARF can be sequencer, envelope and LFO.
- **200e** — digital bus, patch memory, analog sound.

## 6. What the track uses

- 5 complex-oscillator pairs: WT layer + FM voice.
- FM inside the pair: carrier + modulator (2-op), index/ratio.
- Waveshaping: `.shape()` + wavetable `warp`; `mode` changes depth.
- LPG-like: short attack, shared decay, `lpf` + `shape`, not just a filter.
- Pair modulation: LFO scans WT `wt`/`warp`; the FM voice ducks the WT a
  shared bus: the kick ducks orbit 7 via `duckorbit` (sidechain).
- Drone = low support, not a chord.
- Dirt = noise/dust as instability.

## 7. What is not here

- A full patch matrix with arbitrary audio routing.
- Audio-rate FM **between separate Strudel layers**.
- Vactrol non-linearity; the LPG is only imitated.
- A Buchla reconstruction: it is an adaptation of ideas, not a module clone.
