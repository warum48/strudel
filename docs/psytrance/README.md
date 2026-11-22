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

- **303-линия:** saw/square, высокий resonance, filter-envelope, короткий
  decay. Играет 1–2 ноты из лада, повторяется и мутирует фильтром.
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
192 такта, статичный корень (без аккордовой прогрессии). 19 дорожек:
kick, hats, open hat, clap, shaker, ride, tom, rim, roll, sub, rolling bass,
acid 303, psy lead, FM squelch, drone, pad, air, riser, reverse.
Свитчи: `mode` (straight/rolling/tribal/stomp), `bassVar` (root/oct),
`leadVar` (serpent/squelch/hypno), `play` (LOOP/SONG/HOLD).

Рецепты в Strudel — `docs/psytrance/strudel-recipes.md`.

## 10. Источники

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
