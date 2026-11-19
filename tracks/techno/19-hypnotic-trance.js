// TECHNO 19 · FAT TRANCE · 138 BPM
// Мало кода — много звука: 4-on-floor + distort, роллинг-бас 16-ми,
// супер-пила стабом, оффбит-хэт, клэп, райзер. Одна строка нот.
// Рецепты и источники: docs/references.md → «Транс / техно — первые источники».
setcpm(138 / 4)

// Явная карта: raw.githubusercontent любит 503, jsDelivr стабильнее.
if (typeof samples === 'function') {
  const CDN = 'https://cdn.jsdelivr.net/gh/tidalcycles/uzu-drumkit@main/'
  samples({
    bd: ['bd/11_bd_mot4i.wav'], cp: ['cp/10_cp_switchangel.wav'],
    hh: ['hh/10_hh_switchangel.wav'],
    oh: ['oh/10_oh_switchangel.wav'],
  }, CDN)
}

const drive = slider(0.35, 0, 1, 0.01)   // distort на низах
const bassCut = slider(80, 40, 80, 1)    // бас ≤80, открывает огибающая
const leadCut = slider(2600, 300, 9000, 20)
const energy = slider(0.8, 0, 1, 0.01)
const fat = slider(0.45, 0, 1, 0.01)     // «жир»: масса и грохот, двигай до срыва
const verb = slider(0.5, 0, 1, 0.01)

// ── ОДНА СТРОКА НОТ (f-минор) ────────────────────────────────────
const cell = note('f2 f2 ab2 c3 eb3 c3 ab2 f2')

// Мелодия: опциональные октавы/квинты/реверс и пропуски.
const tune = cell
  .sometimesBy(0.26, (x) => x.add(note(12)))
  .sometimesBy(0.14, (x) => x.add(note(7)))
  .sometimesBy(0.1, (x) => x.rev())
  .degradeBy(0.1)

// Стаб — аккорд из той же строки: нота, +3, +7.
const stab = stack(tune, tune.add(note(3)), tune.add(note(7)))

// ── ЖИР ──────────────────────────────────────────────────────────
// Бочка: 4-on-floor, дисторшн, дакает бас/стаб через orbit 2.
$: s('bd').struct('x*4')
  .gain(0.9).lpf(160).lpq(1).distort(drive.mul(6))
  .decay(0.34).sustain(0).release(0.06)
  .duckorbit(2).duckdepth(0.8).duckattack(0.02)

// Клэп на 2 и 4, широкий рум.
$: s('cp').struct('~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~')
  .gain(0.5).lpf(4200).lpq(2).decay(0.14).sustain(0)
  .room(verb.mul(0.45)).roomsize(9)

// Хэты 16-ми с акцентом; оффбит-открытый сверху.
$: s('hh').struct('x*16')
  .gain(m('[.9 .3 .5 .35]*4').mul(0.35))
  .lpf(9000).hpf(700).clip(sine.slow(8).range(0.1, 0.35))
  .decay(0.035).sustain(0).swingBy(0.06, 8)

$: s('oh').struct('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~')
  .gain(0.18).lpf(6500).decay(0.12).sustain(0)
  .room(verb.mul(0.5)).roomsize(8)

// РОЛЛИНГ-БАС: 16-ми, пропуск на доле, иногда октава.
$: note('<f1 f1 ab1 c2>').struct('~ x x x ~ x x x ~ x x x ~ x x x')
  .sometimesBy(0.18, (x) => x.add(note(12)))
  .s('sawtooth').unison(2).detune(0.05)
  .gain(0.5).lpf(bassCut.mul(perlin.slow(8).range(0.8, 1.1))).lpq(8).ftype('24db')
  .lpenv(3.6).lpa(0.004).lpd(0.12).lpsustain(0.1)
  .clip(0.9)
  .decay(0.1).sustain(0.6).release(0.06).orbit(2)

// СТАБ: супер-пила, редкий ритм, дилей/реверб. Масса из трёх нот.
$: stab.struct('x ~ ~ x ~ ~ x ~ ~ ~ x ~ ~ x ~ ~')
  .s('supersaw').unison(4).detune(0.3)
  .gain(energy.mul(0.24))
  .lpf(leadCut.mul(perlin.slow(16).range(0.5, 1.2))).lpq(4)
  .attack(0.003).decay(0.18).sustain(0).release(0.1)
  .delay(0.35).delaytime(0.375).delayfeedback(0.45)
  .room(verb.mul(0.55)).roomsize(8)

// АРП: та же строка в 2× быстрее; пропуски и случайная октава.
$: tune.fast(2).degradeBy(0.2)
  .sometimesBy(0.2, (x) => x.add(note(12)))
  .s('triangle').gain(energy.mul(0.13))
  .lpf(leadCut.mul(0.7)).lpq(2)
  .attack(0.002).decay(0.07).sustain(0).release(0.05)
  .delay(0.45).delaytime(0.25).delayfeedback(0.5)
  .room(verb.mul(0.4)).roomsize(9)
  .pan(sine.slow(8).range(0.3, 0.7))

// СТЕНА: та же строка медленно, широкая супер-пила в стерео. Масса.
$: stab.slow(4)
  .s('supersaw').unison(5).detune(0.35)
  .gain(energy.mul(0.13))
  .lpf(leadCut.mul(0.8)).lpq(2)
  .attack(1.4).decay(1.2).sustain(0.85).release(2.4)
  .room(verb).roomsize(9)

// МАССА: та же строка октавой выше, медленно, супер-пила. Добавляет вес.
$: stab.slow(8).add(note(12))
  .s('supersaw').unison(4).detune(0.35)
  .gain(fat.mul(0.14))
  .hpf(400).lpf(leadCut.mul(1.1)).lpq(1)
  .attack(1.8).decay(1.5).sustain(0.8).release(3)
  .room(verb).roomsize(9)

// ГРОХОТ: низкая копия бочки в дилей — «rumble», не считается как ноты.
$: s('bd').struct('x*4').late(1/32)
  .gain(fat.mul(0.22)).lpf(90).lpq(1)
  .decay(0.5).sustain(0)
  .delay(0.25).delaytime(0.375).delayfeedback(0.6)
  .room(verb.mul(0.3)).roomsize(8)

// РАЙЗЕР: один шум, фильтр и гейн ползут — вкатывает каждые 8 тактов.
$: s('white').struct('x*16')
  .gain(perlin.slow(4).range(0.005, 0.05))
  .hpf(sine.slow(8).range(300, 6000)).lpf(9000)
  .room(verb).roomsize(9)

// ──────────────────────────────────────────────────────────────────
//  ПРОИЗВОДИТЕЛЬНОСТЬ — если тормозит / рвётся при записи
// ──────────────────────────────────────────────────────────────────
// Не ритм в коде: узкое место — голоса супер-пилы, эффекты и запись.
// Сначала `fat = 0` (выключает МАССУ и ГРОХОТ) — как правило этого хватает,
// но при записи всё равно бывает; на середине записи срывается чаще:
// AudioContext + кодирование добавляют нагрузку к синтезу.
//
// Порядок облегчения (сверху вниз, пока не перестанет):
// 1. fat → 0 (МАССА и ГРОХОТ); либо закомментировать блоки:
//    `$: stab.slow(8).add(note(12))`            — МАССА (супер-пила)
//    `$: s('bd').struct('x*4').late(1/32)`      — ГРОХОТ (rumble + дилей)
// 2. Стаб: `.unison(4)` → `.unison(3)`; стена: `.unison(5)` → `.unison(4)`
// 3. Райзер: закомментировать `$: s('white').struct('x*16')` — шум 16-ми
// 4. Румы: `roomsize(8/9)` → `roomsize(6)`, `verb` 0.5 → 0.35
// 5. Закомментировать `$: tune.fast(2)` (АРП) — больше всего событий
//
// Что НЕ возвращать без нужды (это мы уже убирали — было 42 worklet/такт):
//  • `.shape()` / `.distort()` на каждую ноту баса и стаба (waveshaper worklet
//    на каждое событие; сейчас сатурация — только `distort` на бочке);
//  • `jux(rev)` на стене — удваивает все голоса супер-пилы;
//  • `unison(6-7)` на стабе/стене — главный пожиратель голосов.
// Кик со `drive` — единственный оставшийся worklet; `drive → 0` уберёт и его.
//
// Запись: закрой другие вкладки со звуком, поставь `fat 0`, дай странице
// «прогреться» 8-16 тактов, и только потом жми Record.
