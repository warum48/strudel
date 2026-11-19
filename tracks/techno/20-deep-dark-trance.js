// TECHNO 20 · DEEP DARK TRANCE · 140 BPM
// «Ты-ды-дын»: 4-on-floor + оффбит/роллинг-бас, тёмный пэд, плак в дилее.
// Мало кода: одна строка нот f-минора, из неё бас, пэд и плак.
// Рецепты: docs/references.md → «Транс / техно — первые источники».
setcpm(140 / 4)

if (typeof samples === 'function') {
  const CDN = 'https://cdn.jsdelivr.net/gh/tidalcycles/uzu-drumkit@main/'
  samples({
    bd: ['bd/11_bd_mot4i.wav'], cp: ['cp/10_cp_switchangel.wav'],
    hh: ['hh/10_hh_switchangel.wav', 'hh/11_hh_mot4i.wav', 'hh/12_hh_switchangel.wav'],
    oh: ['oh/10_oh_switchangel.wav', 'oh/11_oh_switchangel.wav'],
    sd: ['sd/11_sd_switchangel_3.wav', 'sd/12_sd_switchangel_2.wav'],
  }, CDN)
}

const drive = slider(0.3, 0, 1, 0.01)
const bassCut = slider(80, 40, 80, 1)
const padCut = slider(900, 80, 6000, 10)
const leadCut = slider(2200, 300, 9000, 20)
const verb = slider(0.55, 0, 1, 0.01)
const fat = slider(0.4, 0, 1, 0.01)   // масса/грохот; 0 — если рвётся

// ── НОТЫ (f-минор) ───────────────────────────────────────────────
const cell = note('f2 f2 ab2 c3 eb3 c3 ab2 f2')
const tune = cell
  .sometimesBy(0.22, (x) => x.add(note(12)))
  .sometimesBy(0.12, (x) => x.add(note(7)))
  .degradeBy(0.12)

// Пэд: кварто-квинтовые укладки, без регги-«skank» — длинные аккорды.
const PAD = note('<[f3,c4,g4] [ab3,eb4,c5] [eb3,bb3,g4] [db3,ab3,f4]>')

// ── ГРУВ ─────────────────────────────────────────────────────────
$: s('bd').struct('x*4')
  .gain(0.9).lpf(150).lpq(1).distort(drive.mul(6))
  .decay(0.36).sustain(0).release(0.06)
  .duckorbit(2).duckdepth(0.78).duckattack(0.02)

$: s('cp').struct('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~')
  .sometimesBy(0.2, (x) => x.struct('~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ x ~ x ~'))
  .sometimesBy(0.3, (x) => x.stut(2, 1/16, 0.85)).every(32, (x) => x.stut(3, 1/32, 0.9))
  .gain(0.45).lpf(3800).lpq(2).decay(0.14).sustain(0)
  .room(verb.mul(0.5)).roomsize(9)

$: s('hh').struct('x*16').n(run(8))
  .sometimesBy(0.2, (x) => x.struct('x ~ x x x ~ x x x x ~ x x x x ~'))
  .every(16, (x) => x.stut(3, 1/32, 0.9))
  .gain(m('[.8 .25 .5 .3]*4').mul(0.32))
  .lpf(8500).hpf(800).clip(sine.slow(8).range(0.1, 0.3))
  .decay(0.035).sustain(0).swingBy(0.08, 8)

$: s('oh').struct('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~')
  .gain(0.16).lpf(6000).decay(0.14).sustain(0)
  .room(verb.mul(0.55)).roomsize(9)

// БАС — оффбит 8-е («ты-ды-дын»), иногда 16-я октава. Срез ≤80.
$: note('<f1 f1 ab1 c2>').struct('~ x ~ x ~ x [x x] x')
  .sometimesBy(0.2, (x) => x.add(note(12)))
  .sometimesBy(0.12, (x) => x.stut(2, 1/32, 0.9))
  .s('sawtooth').unison(2).detune(0.05)
  .gain(0.55).lpf(bassCut.mul(perlin.slow(8).range(0.8, 1.1))).lpq(9).ftype('24db')
  .lpenv(3.2).lpa(0.004).lpd(0.12).lpsustain(0.1)
  .clip(0.9).decay(0.09).sustain(0.6).release(0.05)
  .orbit(2)

// ПЭД — супер-пила, долгая атака, тёмный срез. Держит «глубину».
$: PAD.slow(2)
  .s('supersaw').unison(4).detune(0.28)
  .gain(0.16).lpf(padCut.mul(perlin.slow(16).range(0.7, 1.3))).lpq(3)
  .attack(2.2).decay(1.5).sustain(0.85).release(3.5)
  .room(verb.mul(0.8)).roomsize(11)

// ПЛАК — та же строка в 2× быстрее, высокий, в тёмном дилее.
$: tune.fast(2).degradeBy(0.15)
  .sometimesBy(0.18, (x) => x.add(note(12)))
  .s('triangle').gain(0.12)
  .lpf(leadCut.mul(0.8)).lpq(3)
  .attack(0.002).decay(0.08).sustain(0).release(0.06)
  .juxBy(0.22, rev)
  .delay(0.4).delaytime(0.375).delayfeedback(0.55)
  .room(verb.mul(0.5)).roomsize(10)
  .pan(sine.slow(8).range(0.3, 0.7))

// МАССА — та же гармония октавой выше, медленно; `fat` решает, сколько.
$: PAD.slow(2).add(note(12))
  .s('supersaw').unison(3).detune(0.32)
  .gain(fat.mul(0.1)).hpf(400).lpf(padCut).lpq(1)
  .attack(2.5).decay(2).sustain(0.8).release(4)
  .room(verb).roomsize(11)

// ГРОХОТ — низкая копия бочки в дилей, сдвинута, чтобы не дублировать удар.
$: s('bd').struct('x*4').late(1/32)
  .gain(fat.mul(0.2)).lpf(90).lpq(1)
  .decay(0.5).sustain(0).delay(0.25).delaytime(0.375).delayfeedback(0.6)
  .room(verb.mul(0.3)).roomsize(8)

// ВОЗДУХ — розовый шум, фильтр ползёт, связывает верх и низ.
$: s('pink').struct('x*16')
  .gain(perlin.slow(4).range(0.004, 0.035))
  .hpf(sine.slow(8).range(250, 5000)).lpf(9000)
  .room(verb).roomsize(10)

// ──────────────────────────────────────────────────────────────────
//  ЕСЛИ ТОРМОЗИТ: сначала `fat = 0` (МАССА+ГРОХОТ), потом закомментировать
//  МАССУ (`$: PAD.slow(2).add(note(12))`) и ГРОХОТ (`$: s('bd')...late`),
//  затем ПЛАК (`$: tune.fast(2)`), затем снизить `roomsize`/`verb`.
//  Рецепты из примеров: `stut` (clap/hats/бас), `n(run(8))` на хэтах,
//  `juxBy(0.22, rev)` на плаке — это +события, но не worklet'ы.
//  Не возвращать shape/distort на каждую ноту и unison 6-7: это бывшие
//  42 worklet/такт. Запись: fat 0, прогрев 8–16 тактов, закрыть вкладки.
