
setcpm(140/4)

$: arrange(
  [8, s("bd ~ bd ~, ~ sd ~ sd, hh*4")],
  [8, s("bd ~ [bd bd] ~, ~ sd ~ sd, hh*8")],
  [16, s("bd ~ [bd bd] ~, ~ sd ~ [sd sd], hh*8, cp ~ cp ~")],
  [8, s("bd ~ ~ ~, ~ sd ~ ~, hh*4")],
  [16, s("bd ~ [bd bd] ~, ~ sd ~ [sd sd], hh*8, cp ~ cp ~")],
  [8, s("bd ~ ~ ~, ~ sd ~ ~, hh*4")]
)

$: arrange(
  [8, s("~")],
  [8, note("c2 ~ c2 ~").s("sawtooth").lpf(300).gain(0.7)],
  [16, note("c2 ~ c2 eb2 ~ c2 ~ bb1").s("sawtooth").lpf(500).gain(0.8)],
  [8, s("~")],
  [16, note("c2 ~ c2 eb2 ~ c2 ~ bb1").s("sawtooth").lpf(900).gain(0.8)],
  [8, note("c2 ~ ~ ~").s("sawtooth").lpf(300).gain(0.5)]
)

$: arrange(
  [8, s("~")],
  [8, note("[c4,eb4,g4] ~ ~ ~").s("square").lpf(1000).gain(0.3)],
  [16, note("[c4,eb4,g4] ~ [c4,eb4,g4] ~").s("sawtooth").lpf(1600).gain(0.35)],
  [8, s("~")],
  [16, note("[c4,eb4,g4] ~ [bb3,d4,f4] ~").s("sawtooth").lpf(1800).gain(0.4)],
  [8, s("~")]
)

$: s("hh*16").gain(0.2).sometimesBy(0.3, x => x.fast(2))

