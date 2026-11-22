# Psytrance — production playbook

Психоделик-транс — это не «транс с кислотой». Это **один корень, одна
несущая бочка, один роллинг-бас и сетка коротких событий**, которые
двигаются 6–8 минут. Гармония здесь почти не меняется: гипноз важнее
аккордов. Если в треке есть прогрессия и «обыгрывание аккордов» — это уже
не psytrance, а трансовый поп.

## 1. Темп и поджанры

- **Full-on:** 140–148 BPM, пиковый, мелодичный, часто «восточный» лад.
- **Progressive:** 135–140 BPM, меньше мелодий, больше грува и грува-текстур.
- **Dark psy:** 150+ BPM, тритоны/малые секунды, тяжёлый низ.
- **Goa:** 140–145 BPM, мелодичнее и «аналоговее», предок жанра.
- **Forest / hi-tech:** 148–160+, ломаные текстуры и агрессивный дизайн.

Наш трек — **full-on 145 BPM**, F# phrygian dominant.

## 2. Бочка и роллинг-бас — фундамент

Сначала только бочка и бас. Если они не качают вдвоём, мелодия не спасёт.

### Бочка
- 4/4, удар на каждой четверти.
- Короткая, с кликом и телом; саб-хвост не должен висеть на первой
  бас-ноте.
- Тюнинг: фундамент бочки лучше держать на полутон-два **в стороне** от
  корня баса, иначе два саба дерутся.
- Сайдчейн: 2–4 дБ, быстрый attack, release успевает вернуться к нулю до
  первой бас-ноты. Если слышно «насос» — это уже progressive house, а не psy.

### Роллинг-бас
- На каждую четверть: **KICK — бас — бас — бас**. То есть 12 нот на такт:
  три 16-х между ударами.
- Все ноты одинаковые по высоте, длине и velocity. Движение — позже.
- Длина ноты: ~50–75 мс при 145 BPM; между нотами должен быть воздух.
- Амплитудная огибающая: attack 1–3 мс, короткий decay, **sustain 0**,
  release 20–40 мс. Нота умирает до следующей.
- Два слоя: **sub** (sine, корень F1–A1) и **top** (saw/square, LP 400–1000
  Гц, быстрый filter-envelope на 1/16). Сатурация — только на top.
- Всё ниже ~200 Гц — моно.
- Движение без ломки пульса: октавный сброс раз в 4–8 тактов, замена
  корня на квинту/терцию на 2 такта, вырезание последней 16-й, медленный
  срез top-слоя. Никаких glide/portamento и мелодических пробегов в низу.

## 3. Ритм-сетка и перкуссия

- Основа — быстрые 16-е на корне; грув делают **смещения**, а не более
  частые ноты.
- Закрытые хэты: 16-е с акцентами; открытый хэт — **на оффбит** (между
  бочками), это и есть «rolling drive».
- Слои вводятся по 8–16 тактов: сначала хэты, потом клэп/снейр, потом
  открытый хэт с переходом.
- Перкуссия: шейкер, райд, томы, rim, конга/бонго. Не всё сразу.
- «Сетка» psytrance — это core-элементы, которые повторяются, плюс
  2–4 редких accent-звука (FM-сквелч, том, реверс, вокальный выкрик).
- Accent-хиты ставь на вторую 16-ю или оффбит, не на даунбит.
- Открытый хэт не держи дольше ~64 тактов без сброса/брейка.

## 4. Гармония: один корень

- Лады: **phrygian dominant** (1–b2–3–4–5–b6–b7), double harmonic,
  harmonic minor. Малая секунда (b2) — главная краска жанра.
- Аккорды не обязательны. Один корень + дрон + acid/lead-риффы — норма.
- Если хочется движения: смена **одной ноты** на 8–16 тактов, а не
  прогрессия из 4 аккордов.
- Пэд/дрон — статичный. Не «обыгрывай» аккорды арпеджио: в psytrance
  арпеджио — это ритмическая фигура, а не гармонический аккомпанемент.
- Ключи: удобны G#–A# и F–G; C/C#/B часто слишком низкие/высокие для
  плотного микса.

## 5. Кислота, лид, сквелч

- **303-линия:** saw/square, **низкий базовый срез** (100–200 Гц) плюс
  **глубокий filter-envelope** (3–5 октав) и ladder/24 дБ фильтр. Резонанс
  умеренный (2–5), не 12–15. Короткий filter-decay (0.05–0.15 с), без
  sustain. По умолчанию чисто; дисторшн — опционально и слегка. Играет 1–2
  ноты из лада, повторяется и мутирует фильтром.
- **Psy lead:** пила/квадрат, detune, bandpass или LP с медленной
  автоматикой; delay + reverb. Мелодия — короткий мотив «вопрос-ответ»,
  а не пассаж.
- **Weird lead / squelch:** bandpass + LFO Sample&Hold на cutoff (в Strudel
  аналог — `rand`/`perlin` на срез), FM-блип, реверс, короткий delay.
  2–4 сквелча на такт — норма; один не читается.
- Мелодия должна запоминаться после одного прослушивания; лишние ноты
  вырезай, оставляй паузы.
- Движение — автоматика: срез ползёт 16–32 такта, delay/reverb меняются,
  но мотив остаётся.

### Значения в Strudel, а не в DAW

`lpf` — это Гц, `lpq` — реальный Q (0–50), `lpenv` — глубина в октавах.
Совет из DAW «cutoff 400–1000, Q 12–15» не переносится 1:1: в Strudel Q 12–15
кричит, а кислоте нужен **низкий базовый срез + глубокий envelope**, а не
высокий base + мелкий envelope.

| Параметр | Диапазон в Strudel | Музыкальный старт |
|---|---|---|
| `lpf` | 0–20000 Гц | sub 40–80; top-бас 300–600; acid base 80–200; lead 800–2000; pad 200–600; хэты 6k–12k |
| `lpq` | 0–50 | 0–4 музыкально; 5–15 агрессивно; 12–15 — это крик, не дефолт |
| `lpenv` | октавы | 1–4 обычно; acid 3–5 **от низкого base** |
| `lpa` / `lpd` / `lps` | секунды / 0–1 | acid `lpd` 0.05–0.15, `lps` 0–0.2; бас `lpd` 0.03–0.08 |
| `ftype` | 12db / 24db / ladder | ladder для 303 (один worklet на ивент); 24db для баса; 12db для мягкого лида |
| `roomsize` | 0–10 | 6–9; не выше 10 |
| `room` | 0–1 | 0.1–0.3 барабаны, 0.2–0.5 пэды/лиды |
| `delaytime` | секунды | 0.375 = 3/8; 0.25 = 1/4 |
| `delayfeedback` | 0–1 | 0.3–0.55 |
| `distort` | 0–10 | 0–2; acid может быть чистым |

Наш acid: base 120 Гц, Q 4, `lpenv` 4.5, `lpd` 0.055, `lps` 0.05, ladder.
Наш бас: 410 Гц, Q 2, `lpenv` 3, `lpd` 0.05, 24db.

## 6. Аранжировка

- 16 тактов **только бочка + бас** — фундамент и DJ-интро.
- Слои: хэты (16–32), клэп/снейр (32–48), открытый хэт и перкуссия
  (48–64).
- Брейк: убрать бочку/бас/хэты, оставить дрон, лид, реверс, riser.
- Build: бочка/бас возвращаются, snare roll, riser, фильтр-свип; вход
  лида — за 1–2 такта до дропа.
- Основные смены — на границах 8/16 тактов; крупные — на 16/32.
- Форма full-on примерно: INTRO → GROOVE → LIFT → BREAK → BUILD → DROP →
  GROOVE 2 → PEAK → BREAK 2 → OUTRO.
- Идеальная длина — 7–7,5 минут; в нашем формате — 5–6 минут (192 такта
  при 145 BPM ≈ 5:18).

## 7. Микс

- Низ моно; кик и бас не борются за 40–80 Гц.
- Бас high-pass ~30 Гц; notch на фундаменте кика, если нужно.
- Ширина — на лидах, пэдах, FX; бас и кик — центр.
- Не забивай: если секция мутная, убирай элемент, а не добавляй обработку.
- Референс: соло кик+бас против референса, потом весь микс.

## 8. Чего не делать

- Прогрессии аккордов и «обыгрывание» аккордов арпеджио.
- Длинные бас-ноты с sustain — бас превращается в дрон.
- Бас на бочке (первая 16-я занята киком).
- Мелодичные поп-лиды и «красивые» кадансы.
- 10 слоёв «на всякий случай», статичные 4-тактовые петли.
- Один сквелч на такт, «вежливые» 16-е хэты, большой hall вместо
  короткой комнаты.
- Glide/portamento в роллинг-басу.

## 9. Наш трек

`tracks/psytrance/01-serpent-engine.js` — 145 BPM, F# phrygian dominant,
192 такта, статичный корень (без аккордовой прогрессии). 19 дорожек,
90 слайдеров: kick, hats, open hat, clap, shaker, ride, tom, rim, roll,
sub, rolling bass, acid 303, psy lead, FM squelch, drone, pad, air, riser,
reverse. Свитчи: `mode` (straight/rolling/tribal/stomp),
`bassVar` (root/oct), `leadVar` (serpent/squelch/hypno),
`play` (LOOP/SONG/HOLD).

- sub 42 Гц; top-бас 410 Гц / Q 2 / `lpenv` 3 / 24db.
- acid base 120 Гц / Q 4 / `lpenv` 4.5 / ladder, чисто (без дисторшна).
- lead 1280 Гц / Q 2 / `lpenv` 2; squelch bpf 1240 / Q 3.5.
- pad 320, drone 115, air 2500, `verb` 0.12, `roomsize` 8 (макс. 10).
- нет master-множителя: каждый срез = слайдер × своя автоматика.

### 02 — Acid Euphoria

`tracks/psytrance/02-acid-euphoria.js` — 140 BPM, F# minor, 160 тактов,
14 дорожек, 58 слайдеров. Здесь не изобретаем, а копируем референсы:

- **Acid:** цепочка `switchangel_acid` — `distort 2.2:.3` / sawtooth / `lpf` /
  `lpenv 2.256` / `lpq 12` — поверх **повторяющегося 16-го остинато на F#**,
  всего две краски: m2 (G) и m3 (A) как акценты. Без прыжков; вариацию даёт
  движущийся фильтр.
- **Kick/hats:** `sbd` + distort + `duck 2`, TR-909 хэты из
  `lausfødselsdagstechno`.
- **Bass:** honcoops EX3/6 saw-роллинг, `lpf 700`, `res 7`, короткий release.
- **Leads/pad:** honcoops EX7 широкое арпеджио, EX9 triangle pluck, EX12
  медленные saw-струнные.
- **Динамический cutoff:** двигается каждый синт — `lpf(base ×
  sine.range(…).slow(16) × autoAt(…))`; у струнных `lpdepth`/`lpsync`.
  Аккордовой прогрессии нет: статичный F#m, один корень.

Рецепты в Strudel — `docs/psytrance/strudel-recipes.md`.

## 10. Источники

Strudel-native:
- https://strudel.cc/learn/effects/ — `lpf` Гц, `lpq` Q 0–50, `lpenv`,
  LFO, duck, delay, reverb, `roomsize` 0–10.
- https://strudel.cc/learn/synths/ — волны, FM, partials.
- Локальные паттерны: `refs/strudel/strudelmarket/Ambient/DISSOLUTION-PROTOCOL-7ec2a894.js`
  (psytrance 145, acid с низким base), `refs/strudel/strudelmarket/Synth/Adventure-Lime2-303d203e.js`
  (303), `refs/strudel/strudelmarket/Bass/Stranger-schranz-soul-0a13ccdc.js`
  (acid/бас).

- Wikipedia, Psychedelic trance — темпы, поджанры, слои каждые 4–8 тактов,
  длина 6–10 минут, брейк 30 с–1 мин:
  https://en.wikipedia.org/wiki/Psychedelic_trance
- Myloops, How to Make a Psytrance Rolling Bassline That Locks With the Kick —
  три 16-х между киками, 50–75 мс, sub+top, sidechain 2–4 дБ, EQ-раздел,
  моно ниже 200 Гц, движение октавами/квинтой/фильтром:
  https://www.myloops.net/how-to-make-a-psytrance-rolling-bassline
- Myloops, Designing a Rolling Psytrance Bass in Spire — HPF 35–40 Гц,
  sidechain, перенастройка огибающих под BPM:
  https://www.myloops.net/designing-psytrance-bass-sounds-in-spire
- Psytrance Blueprint, Psytrance for Beginners — сначала кик и бас, потом
  барабаны, лиды, FX; референсы и повторение:
  https://psytrance-blueprint.com/tutorials/psytrance-quickstart/
- Psytrance Blueprint, Triplet Bassline — триоли, оффбит, groove pool:
  https://psytrance-blueprint.com/tutorials/triplet-bass/
- Psytrance Blueprint, Arrangement: 7 Rules — 16 тактов кик+бас, слои по
  8–16, границы 8/16, открытый хэт до 64 тактов, phrygian/minor, движение:
  https://psytrance-blueprint.com/tutorials/better-psytrance-arrangement/
- Psytrance Blueprint, 3 Tips for Better Melodies — ритм, мотивы,
  вопрос-ответ, простота, автоматика:
  https://psytrance-blueprint.com/tutorials/three-tips-better-melodies/
- Psytrance Blueprint, Psytrance Grids — 16-е на корне, оффбит, core/accent,
  2–4 сквелча, постепенные 8-тактовые блоки:
  https://psytrance-blueprint.com/tutorials/psytrance-grids-rhythm/
- Daniel Sokolovskiy, Psytrance bassline synthesis — saw −1 октава, LP 24 дБ,
  короткий decay без sustain, ресемплинг, EQ:
  https://dsokolovskiy.com/blog/all/psytrance-bassline-synthesis/
- Daniel Sokolovskiy, Creating a weird psychedelic lead using LFO — bandpass +
  Sample&Hold LFO на cutoff, distortion/phaser/reverb:
  https://dsokolovskiy.com/blog/all/creating-a-weird-psychedelic-lead/
- Theory Helper, Best Scales for Psytrance — phrygian dominant, double
  harmonic, малая секунда, минимум гармонии, acid-линии:
  https://www.theoryhelper.com/genres/psytrance/scales
- StarSeed Invaded, Advanced Techniques for Psytrance Production — 140–150
  BPM, rolling 16th bass, оффбит-хэты, модуляция, ресемплинг, микс:
  https://www.starseedinvaded.com/post/advanced-techniques-for-psytrance-production
