// Темп ~138 BPM (138 / 60 / 4 цикла в секунду)
setcps(138/60/4)

stack(
  // 1. Классический рваный брейкбит в стиле 90-х
  s("breaks165")
    .slice(8, "0 1 2 3 [4 4] 5 6 [7 2]")
    .speed(1.05)
    .distort(0.35)
    .gain(1.1),

  // 2. Прямая бочка для плотности (биг-бит кач)
  s("bd*4")
    .bank("RolandTR909")
    .distort(0.4)
    .lpf(1200)
    .gain(0.95),

  // 3. Грязный перегруженный acid-рифф (в духе Firestarter / Voodoo People)
  note("<[e1 e1 g1 e1 a1 ~ b1 g1] [e1 e1 g1 e1 d2 ~ b1 a1]>")
    .s("sawtooth")
    .lpf(sine.range(400, 3200).slow(4))
    .lpq(12)
    .distort(0.65)
    .crush(6)
    .gain(0.8),

  // 4. Высокий рейв-стаб / аккорды на заднем плане
  note("<[e3,g3,b3] ~ [g3,b3,d4] [a3,c4,e4]>")
    .s("square")
    .lpf(1800)
    .room(0.5)
    .delay(0.25)
    .gain(0.35)
)
