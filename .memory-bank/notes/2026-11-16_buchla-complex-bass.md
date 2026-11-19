# Buchla complex bass

- Buchla = West Coast: complex oscillator (carrier + modulator), FM/AM,
  waveshaping/folding, LPG/vactrol, touch control, new sounds rather than
  imitation. East Coast (Moog) = subtractive filter.
- Track `experimental/01-complex-bass` (160 BPM): 5 pairs WT+FM, 10 oscillators; 12 selectable acid riffs, all basses play the same riff; each WT/FM bass has oct 0…4 and pace 4…32 (`.fast(pace / 16)`: 16 = 1×, 4 = ÷4, 32 = ×2; paces independent, can drift out of phase); hardcore bd*4 kick with sub body. WT is a
  sampler source in Strudel: no cross-layer audio-rate FM. Real FM is inside the
  synth voice; WT gets `wt`/`warp` scanning. All 10 basses share orbit 7 and the
  kick ducks it with `duckorbit(7)` — real sidechain, not an LFO saw.
- Dark tables: wt_dbass, wt_distorted, wt_ebass, wt_raw, wt_bitreduced.
  Target is gritty fat bass, not cartoon timbres.
- Modes clean/grit/fold/scream change grit, FM index and air density; G groups
  muteWT/muteFM/muteDrone are color-coded, top @mutes hidden.
