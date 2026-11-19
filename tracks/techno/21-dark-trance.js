// TECHNO 21 · DARK TRANCE · 140 BPM
// Настоящий тёмный транс: e-фригийский, b2 и тритоны в аккордах и acid-линии.
// Диссонанс здесь — краска, а не авария: такой tension часто приемлем
// (см. docs/rules.md); `tension` для этого трека не догма
// (см. docs/rules.md — правила рамки, не законы). Жир — distort на бочке,
// супер-пила-кластер, acid-сквер с резонансом, дрон e+bb.
setcpm(140 / 4)

if (typeof samples === 'function') {
  const CDN = 'https://cdn.jsdelivr.net/gh/tidalcycles/uzu-drumkit@main/'
  samples({
    bd: ['bd/11_bd_mot4i.wav'], cp: ['cp/10_cp_switchangel.wav'],
    hh: ['hh/10_hh_switchangel.wav', 'hh/11_hh_mot4i.wav'],
    oh: ['oh/10_oh_switchangel.wav'], rim: ['rim/10_rim_switchangel.wav'],
  }, CDN)
}

const drive = slider(0.32, 0, 1, 0.01)
const bassCut = slider(80, 40, 80, 1)
const acidCut = slider(1800, 200, 8000, 20)
const padCut = slider(700, 80, 5000, 10)
const verb = slider(0.6, 0, 1, 0.01)
const fat = slider(0.45, 0, 1, 0.01)   // масса/грохот; 0 — если рвётся

// ── НОТЫ: e-фригийский + b2 (f) и тритон (bb) ────────────────────
const riff = note('e2 e2 f2 g2 bb2 a2 g2 f2')

// Acid: та же строка в 2×, иногда +1 полутон и +6 (тритон) — намеренно.
const acid = riff.fast(2)
  .sometimesBy(0.22, (x) => x.add(note(1)))
  .sometimesBy(0.14, (x) => x.add(note(6)))
  .degradeBy(0.08)

// Пэд-кластер: e+f (малая секунда) и e+bb (тритон) — тёмная укладка.
const PAD = note('<[e3,f3,bb3] [e3,f3,b3] [e3,g3,bb3] [f3,ab3,b3]>')

// ── ГРУВ ─────────────────────────────────────────────────────────
$: s('bd').struct('x*4')
  .gain(0.92).lpf(150).lpq(1).distort(drive.mul(6))
  .decay(0.36).sustain(0).release(0.06)
  .duckorbit(2).duckdepth(0.8).duckattack(0.02)

$: s('cp').struct('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~')
  .sometimesBy(0.3, (x) => x.stut(2, 1/16, 0.85))
  .gain(0.42).lpf(3600).lpq(3).decay(0.14).sustain(0)
  .room(verb.mul(0.5)).roomsize(9)

$: s('hh').struct('x*16').n(run(8))
  .every(16, (x) => x.stut(3, 1/32, 0.9))
  .gain(m('[.85 .25 .5 .3]*4').mul(0.3))
  .lpf(9000).hpf(900).clip(sine.slow(8).range(0.08, 0.3))
  .decay(0.035).sustain(0).swingBy(0.08, 8)

$: s('oh').struct('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~')
  .gain(0.15).lpf(6000).decay(0.14).sustain(0)
  .room(verb.mul(0.6)).roomsize(10)

// RIM — сухая перкуссия, отвечает acid-линии.
$: s('rim').struct('~ ~ ~ x ~ ~ x ~ ~ x ~ ~ x ~ ~ ~')
  .gain(0.2).lpf(3000).hpf(600).decay(0.05).sustain(0)
  .delay(0.2).delaytime(0.375).delayfeedback(0.3)
  .room(verb.mul(0.35)).roomsize(8)

// БАС — на e, с заходами в f (b2) и bb (тритон). Срез ≤80.
$: note('<e1 e1 f1 bb1>').struct('~ x ~ x ~ x [x x] x')
  .sometimesBy(0.18, (x) => x.add(note(12)))
  .s('sawtooth').unison(2).detune(0.05)
  .gain(0.58).lpf(bassCut.mul(perlin.slow(8).range(0.8, 1.1))).lpq(10).ftype('24db')
  .lpenv(3.4).lpa(0.004).lpd(0.12).lpsustain(0.1)
  .clip(0.9).decay(0.09).sustain(0.6).release(0.05)
  .orbit(2)

// ПЭД — супер-пила, медленно, очень тёмный срез. Кластер = злоба.
$: PAD.slow(2)
  .s('supersaw').unison(5).detune(0.35)
  .gain(0.17).lpf(padCut.mul(perlin.slow(16).range(0.6, 1.4))).lpq(5)
  .attack(2.2).decay(1.6).sustain(0.85).release(3.5)
  .room(verb.mul(0.8)).roomsize(11)

// ДРОН — e+bb (тритон) тянется под всем; медленная атака.
$: note('<[e2,bb2] [e2,b2] [e2,bb2] [f2,b2]>').slow(2)
  .s('sawtooth').unison(2).detune(0.08)
  .gain(0.1).lpf(140).lpq(2)
  .attack(3).decay(2).sustain(0.9).release(4)
  .room(verb).roomsize(12)

// ACID — квадрат, высокий резонанс, LFO на срезе, дилей. Главная злость.
$: acid
  .s('square').gain(0.16)
  .lpf(acidCut.mul(perlin.slow(8).range(0.5, 1.3))).lpq(14).ftype('24db')
  .lpenv(4).lpa(0.003).lpd(0.09).lpsustain(0.15)
  .decay(0.07).sustain(0.3).release(0.05)
  .delay(0.45).delaytime(0.375).delayfeedback(0.55)
  .room(verb.mul(0.35)).roomsize(9)
  .pan(sine.slow(8).range(0.3, 0.7))
  .juxBy(0.2, rev)

// МАССА — кластер октавой выше; `fat` решает, сколько.
$: PAD.slow(2).add(note(12))
  .s('supersaw').unison(3).detune(0.4)
  .gain(fat.mul(0.11)).hpf(500).lpf(padCut).lpq(2)
  .attack(2.5).decay(2).sustain(0.8).release(4)
  .room(verb).roomsize(11)

// ГРОХОТ — rumble-бочка в дилей, сдвинута, чтобы не дублировать удар.
$: s('bd').struct('x*4').late(1/32)
  .gain(fat.mul(0.2)).lpf(90).lpq(1)
  .decay(0.5).sustain(0).delay(0.25).delaytime(0.375).delayfeedback(0.6)
  .room(verb.mul(0.3)).roomsize(8)

// ВОЗДУХ — шум, фильтр ползёт; держит напряжение между секциями.
$: s('pink').struct('x*16')
  .gain(perlin.slow(4).range(0.005, 0.04))
  .hpf(sine.slow(8).range(220, 5200)).lpf(9000)
  .room(verb).roomsize(10)

// ── ЕСЛИ ТОРМОЗИТ: fat = 0 → МАССА → ГРОХОТ → acid `juxBy` → румы/verb.
//    Не возвращать shape/distort на каждую ноту и unison 6-7 (42 worklet).
//    Запись: fat 0, прогрев 8–16 тактов, закрыть вкладки со звуком.
