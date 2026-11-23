# Ссылки

Проверено 2026-11-12 (код ответа 200). Если что-то отвалилось — правь смело.

## Для ИИ: как писать треки

- `docs/prompt-track.md` — промпт-шаблон «сгенерируй трек по нашей схеме».
- `docs/pitfalls.md` — обязательные грабли Strudel (m(), slow vs struct,
  seg/worklet-бюджет, слайдеры без отрицательных литералов, один roomsize).
- `docs/rules.md` — стилевые рамки и антипаттерны.
- `docs/darkwave/README.md` — darkwave/new wave (Depeche-середина): BPM,
  минор, драм-машины, pulse-бас, пэды/струнные, FM-колокол, источники.
- `docs/minimal-techno/README.md` — minimal techno: 4/4, модальность,
  uzu/Dirt сэмплы, кик/перкуссия, дрон без пэда, форма 128 тактов.
- `docs/techno/README.md` — berlin techno: кик/rumble/сайдчейн, клэп на
  второй кик, индустриальная перкуссия, форма, источники.
- `docs/coldwave/README.md` — coldwave: разреженность, 606/808/Linn, форма.
- `docs/psytrance/README.md` — psytrance: один корень, роллинг-бас, оффбит-хэты,
  acid/psy lead/сквелч, аранжировка, микс, источники.
- `docs/psytrance/strudel-recipes.md` — рабочие Strudel-куски для psytrance.
- `docs/psytrance/pitfalls.md` — антипаттерны и чеклист перед коммитом.

## Доки Strudel

- https://strudel.cc/learn/ — оглавление туториала, отсюда всё остальное
- https://strudel.cc/learn/mini-notation/ — мини-нотация: `~`, `[]`, `<>`, `*`, `,`, `:`
- https://strudel.cc/learn/synths/ — синтезаторы, `s("supersaw")`, `unison`, `detune`, FM
- https://strudel.cc/learn/effects/ — фильтры, дилей, реверб, дисторшн
- https://strudel.cc/learn/samples/ — сэмплы, банки, `.bank('RolandTR909')`

Справочник по функциям — не по ссылке, а в самом REPL: слева иконка «?» /
вкладка с функциями, там же живой поиск. Прямой URL отдаёт 403 ботам.

## Транс / техно — первые источники (код и рецепты)

Если нужен жирный транс или техно — сначала сюда. Это короткие рабочие
треки/рецепты на Strudel, а не статьи:

- https://github.com/DanielTRZ/strudel-trance — один файл `trance.js` (~90
  строк): `bd*4`, супер-пила стабом, saw-бас 16-ми, райзер, рум/дилей.
  Отсюда взяты `distort` на бочке и структура слоёв.
- https://github.com/honcoops/strudel_trance — `TIPS_AND_TRICKS.md` и
  `examples/`: роллинг-бас, sidechain-пульс, supersaw-лид, дилей/рум,
  euclid-грув. Самый понятный учебник по трансу на Strudel.
- https://github.com/frixdk/strudeltechno — `lausfødselsdagstechno.js`:
  `distort("3:.3")`, `duck("2:3:4")`, `rib`, `arrange` как секвенсор.
- https://github.com/dotcomdudee/strudel-tracks — `germantechno3/4.js`:
  `stut`, `perlin`-фильтры, `supersaw` + `hpf`, «немецкое» техно.
- https://github.com/iemmolo/trance-strudel и
  https://github.com/mikejcsmith/strudel-basic-trance — маленькие примеры
  для быстрого старта.
- https://github.com/terryds/awesome-strudel — индекс: если нужен другой
  жанр, отсюда ведут ссылки на исходники треков.

### Психоделик-транс: локальные референсы

- `refs/strudel/github/dotcomdudee/strudel-tracks/switchangel_acid.js` —
  acid-звук (`distort 2.2:.3`, saw, `lpf 200`, `lpenv 2.256`, `lpq 12`) и
  pulse/FM-слой.
- `refs/strudel/github/frixdk/strudeltechno/lausfødselsdagstechno.js` —
  `sbd`-кик + distort + duck, хэты, динамический срез acid.
- `refs/strudel/github/honcoops/strudel_trance/examples/01_driving_bassline.js` —
  EX3/4/6 роллинг/acid-бас.
- `refs/strudel/github/honcoops/strudel_trance/examples/02_euphoric_leads.js` —
  EX7 широкое арпеджио, EX9 pluck, EX12 струнные.
- `refs/strudel/strudelmarket/Ambient/DISSOLUTION-PROTOCOL-7ec2a894.js` —
  acid с низким base и bytebeat/noise-текстура.
- `refs/strudel/strudelmarket/Synth/Adventure-Lime2-303d203e.js` — 303-бас.
- `refs/strudel/strudelmarket/Bass/Stranger-schranz-soul-0a13ccdc.js` —
  acid/бас-дизайн.

### Психоделик-транс: бас

- https://psychedelicisland.com/en/articles/how-to-create-the-perfect-bassline-for-psytrance —
  классика «KBBB»: кик на доле, бас на трёх 16-х после него.
- https://lofimonster.com/blog/psytrance-bass-ableton — то же KBBB с разбором
  сетки и длины нот.
- https://www.psytrance-blueprint.com/tutorials/triplet-bass/ — триоли/свинг,
  чтобы прямой 16-й бас не звучал жёстко.
- https://www.myloops.net/how-to-make-a-psytrance-rolling-bassline — полный
  разбор: 12 нот/такт, 50–75 мс, sub+top, sidechain 2–4 дБ, EQ, моно <200 Гц.
- https://www.myloops.net/designing-psytrance-bass-sounds-in-spire — HPF
  35–40 Гц, сайдчейн, огибающие под BPM.
- https://psytrance-blueprint.com/tutorials/psytrance-quickstart/ — порядок:
  kick+bass → drums → leads → FX; референсы.
- https://psytrance-blueprint.com/tutorials/better-psytrance-arrangement/ —
  16 тактов kick+bass, слои по 8–16, границы 8/16, open hat до 64 тактов.
- https://psytrance-blueprint.com/tutorials/three-tips-better-melodies/ —
  ритм/мотивы, вопрос-ответ, простота, автоматика.
- https://psytrance-blueprint.com/tutorials/psytrance-grids-rhythm/ — 16-е
  на корне, оффбит, core/accent, 2–4 сквелча.
- https://dsokolovskiy.com/blog/all/psytrance-bassline-synthesis/ — saw −1
  октава, LP 24 дБ, короткий decay без sustain, ресемплинг.
- https://dsokolovskiy.com/blog/all/creating-a-weird-psychedelic-lead/ —
  bandpass + Sample&Hold LFO, distortion/phaser/reverb.
- https://www.theoryhelper.com/genres/psytrance/scales — phrygian dominant,
  double harmonic, малая секунда, минимум гармонии.
- https://www.starseedinvaded.com/post/advanced-techniques-for-psytrance-production —
  140–150 BPM, rolling 16th bass, оффбит-хэты, модуляция, микс.
- https://en.wikipedia.org/wiki/Psychedelic_trance — поджанры/темпы, слои
  каждые 4–8 тактов, длина 6–10 минут.
- Attack Magazine, Ostinatos and Acid Riffs (passing notes, 2021) — простые
  acid-остинато из корня + интервала; ищи по названию.

Рецепты, которые реально дают «жир»: 4-on-floor + `distort` + `duck`,
роллинг-бас 16-ми с `lpenv`/`shape`, `supersaw` с `unison 5-7` и `jux(rev)`,
райзер из `white` с `hpf(sine…)`, и `perlin` на срезах вместо статики.

## Форумы и сообщества

- https://club.tidalcycles.org — Tidal Club, главный форум сцены. Tidal, но 90%
  приёмов переносится в Strudel один в один (`lpf`/`lpenv`/`lpsync` те же).
  Ищи по словам `reese`, `wobble`, `lfo`, `sustain`.
- https://codeberg.org/uzu/strudel — исходники (не GitHub, репа переехала).
  Issues — фактически второй форум; там же отвечают мейнтейнеры.
- https://tidalcycles.org/docs/ — доки Tidal, полезны для понимания концепций
  (cycle, event, control pattern), даже если пишешь на JS.

## Код людей

Switch Angel (алгорейв, пишет на Tidal и Strudel, много видео):

- https://www.youtube.com/@switchangel — видео, код обычно на экране
- https://github.com/switchangel/strudel-scripts — её кастомные функции
  (`prebake.strudel`). Оттуда взяты рецепты ниже.
- https://github.com/switchangel/breaks — брейки, которые она правил
- https://github.com/switchangel/beginningtrance — сэмплы из видео

Её два рецепта баса (из `prebake.strudel`), если не хочется изобретать:

```js
// "acid": сустейн-бас с резонансным фильтром
pat.s('supersaw').detune(.5).unison(1).lpf(100)
   .lpsustain(0.2).lpd(.2).lpenv(2).lpq(12)

// "protobass": волновой бас, LFO синхронный с тактом
s("wt_ana:1").unison(5).wtsync(1.2).detune(rand.mul(1.5))
  .lpsync("[3 16] 8").lpdepth(5).lpq(0).fm(1.4).fmh(2.04).lpskew(rand)
```

## Что я выяснил по исходникам (не по докам)

Фильтровый LFO — `packages/superdough/helpers.mjs`, функция `createFilter`:

| контрол | что делает |
|---|---|
| `lpf(f)` | базовый срез, Гц |
| `lpdepth(k)` | глубина LFO = **k × f** (множитель, не герцы) |
| `lpdepthfrequency(hz)` | то же, но в герцах |
| `lpsync(n)` | `rate = cps × n` → n качков **на такт** |
| `lprate(hz)` | то же, но в герцах (не синхронно с тактом) |
| `lpdc(0)` | униполярно: LFO только открывает фильтр вверх (по умолчанию `-0.5`, качает в обе стороны) |
| `lpenv(n)` | огибающая фильтра в **октавах**: `2**n × f` |
| `lpa/lpd/lpsustain` | атака/спад/сустейн этой огибающей |
| `ftype("24db")` | два каскада биквадов — круче и толще |
| `ftype("ladder")` | ворклет-лестница, у неё есть `drive` |

Порядок в звуке: огибающая пишет в `filter.frequency`, LFO-нода **прибавляется**
к тому же параметру. Поэтому `lpenv` даёт «ВУ» на атаке, а LFO — «УУУ-УУУ» поверх.

`penv` / `panchor` / `pattack` / `pdecay` / `psustain` / `pcurve` в
`@strudel/core` 1.2.6 есть и работают (см. README, «Грабли движка»).
`glide` — не встроенная функция, а регистр из `09-dark-acid-v2.js` /
Switch Angel: он считает интервал от предыдущей ноты и пишет `penv`.

## Даб-техно

- `docs/dub-techno/README.md` — плейбук: характер, гармония, звук, микс,
  чек-лист следующего трека.
- `docs/dub-techno/sources.md` — внешние гайды, канон для наслушанности,
  что именно из них взято.
- `tracks/techno/18-khmer-dub.js` — 122 BPM dub techno + 18 Khmer percussion channels + @timeline, Fm9→Abmaj9→Dbmaj9→Gbmaj9.
- `docs/dub-techno/strudel-recipes.md` — готовые куски: аккорды, саб ≤80,
  стаб в дилее, пэд, хэты, режимы, аудиты.
- Живые примеры: `tracks/techno/16-minimal-dub.js` (120 BPM),
  `tracks/techno/17-halfstep-dub.js` / `-v2` (104 BPM, Burial-leaning).

## IDM

- `docs/idm/README.md` — характер, карта инструментов, переключатели, пэды,
  сцены, как играть, гейты.
- `docs/idm/01-techniques.md` — глитч, грануляр, микро-события, 8 бит,
  эйсид, шершавый бас, барабаны, «мало реверба».
- `docs/idm/02-arrangement.md` — темп, форма, тёмная/атональная гармония,
  антипоп, рандом под контролем, микс, перформанс.
- `docs/idm/03-strudel.md` — `chop`/`slice`/`striate`/`splice`, `glide`,
  `seg`, пэды, бюджеты CPU и грабли 1.2.6.
- `docs/idm/04-sources.md` — источники и что именно взято.
- Живой пример: `tracks/idm/01-splinter.js` (136 BPM, glitch/granular).

## Experimental / Buchla

- `docs/experimental/README.md` — серия, 5 пар, как играть, гейты.
- `docs/experimental/01-buchla.md` — Buchla / West Coast: complex oscillator,
  FM/AM, waveshaping, LPG/vactrol, 100/200/200e, философия.
- `docs/experimental/02-track.md` — карта `01-complex-bass`, пары, ручки.
- `docs/experimental/03-strudel.md` — вейвтейблы, FM/матрица, ducking, грабли.
- `docs/experimental/04-sources.md` — Wikipedia/SOS/AKWF/Strudel.
- `tracks/experimental/01-complex-bass.js` — 160 BPM, 5 пар WT+FM, 10
  осцилляторов, 206 слайдеров, у каждого баса `oct` и `pace`.

## Shoegaze

- `docs/shoegaze/README.md` — стена гитар, fuzz/chorus/delay/reverb, glide guitar,
  reverse reverb, BPM/гармония, аранжировка плотностью, микс и ошибки.
- Источники: Wikipedia, Sound on Sound (Only Shallow), BeatKey, ToneMirror,
  GuitarBomb, Plugg Supply.

## Coldwave

- `docs/coldwave/README.md` — холодный пост-панк: ритм, бас, Juno-пэд,
  гитара, форма, ошибки, источники (Sound Atlas, BeatKey, Wikipedia, Dummy).
- `tracks/coldwave/01-cold-rooms.js` — 108 BPM, Dm, 4 моды, 64-тактный
  TIMELINE, LOOP/SONG, 12 дорожек / 52 слайдера.

## Trip-hop / acid jazz

- `docs/trip-hop/README.md` — характер, гармония (d–eb–bb–f–g–eb–c–d),
  восемь брейков без выключения слоёв, два голоса Moog, ритм-секция, проверки.
- `tracks/trip-hop/01-acid-jazz.js` — 84 BPM, 17 дорожек, 73 слайдера,
  квартовые укладки / 9-13, Moog bass (cut ≤80 + env + glide) и Moog lead
  (square, LFO, дилей), Rhodes-компинг на восьми рисунках.
- `tracks/trip-hop/02-acid-jazz-v2.js` — 82 BPM, 24 дорожки, 98 слайдеров:
  версия 01 как композиция на 96 тактов, TIMELINE-аранжировка, соло-фразы,
  spark 32-ми, томы/табла/каубелл/ghost/rolls/spot-FX; дабовый бас и три
  состояния лида (искры / плавно / тема), LOOP/SONG и реальные громкости.
- Практика жанра: MusicRadar (trip-hop beats; 90 BPM max), Plugg Supply
  (шаффл 55–65%, два снейра, hip hop tuning), Siesta Audio (Portishead:
  запись → винил → ресемпл), Wikipedia/AllMusic (acid jazz: грув,
  длинные композиции), mDecks/VoicingLab (кварты и верхние структуры).

## Кхмерская музыка



- `docs/khmer/README.md` — характер, карта пинпета, переключатели, пэды
  (01) и mutes (02), сцены, как играть, гейты.
- `docs/khmer/01-instruments.md` — roneat ek/thung/dek, kong vong/thom,
  sralai, sampho (ting/tip/theung/tup), skor thom (tight/loose),
  chhing, krap; малый и большой составы.
- `docs/khmer/02-tuning-rhythm.md` — семь тонов ~171 цент, пятитоновый
  скелет, 12-TET-приближения, колотомия, Sathukar, боксёрская музыка.
- `docs/khmer/03-strudel.md` — синтез, сэмплы VSCO/Dirt, `seg(1/8)`,
  сцены-ритмы, `@mutes`, бюджеты CPU, грабли 1.2.6 (`.add(slider)`).
- `docs/khmer/04-sources.md` — Wikipedia, UMBC/Sam-Ang Sam, UNESCO,
  Garzoli, Garland; что взято, а что адаптировано.
- `docs/khmer/05-samples.md` — какие реальные сэмплы есть, чего нет,
  как подставить локальные записи.
- Живые примеры: `tracks/khmer/01-sathukar.js` (88 BPM, синтез),
  `tracks/khmer/02-skors.js` (96 BPM, реальные сэмплы, сцены-ритмы,
  mute-кнопки, без пэдов), `tracks/khmer/03-skors-ritual.js`
  (76 BPM, только ударные, без высоких мелодических линий),
  `tracks/khmer/04-confluence.js` (108 BPM, микс 01–03, 12 ритмов,
  acid bass/arp с `pace`).

Сэмплы:

- VSCO 2 CE (CC0) — xylo, marimba, gong, claves:
  https://github.com/sgossner/VSCO-2-CE
- Dirt-Samples — east (тайко/woodblock), hand, tabla, metal:
  https://github.com/tidalcycles/Dirt-Samples
- Roneat Studio Pro — приложение для roneat ek; в репозитории
  mock/dummy сэмплы, не банк: https://github.com/Vagabond404/Roneat-Studio-Pro
- Sounds of Angkor — видео/фото инструментов, не one-shots:
  https://soundsofangkor.org/

Ключевые внешние источники:

- https://en.wikipedia.org/wiki/Music_of_Cambodia
- https://en.wikipedia.org/wiki/Pinpeat
- https://en.wikipedia.org/wiki/Roneat
- https://en.wikipedia.org/wiki/Samphor
- https://en.wikipedia.org/wiki/Sralai
- https://en.wikipedia.org/wiki/Ching_(instrument)
- https://en.wikipedia.org/wiki/Skor_thom
- https://www.umbc.edu/eol/cambodia/histcmus.htm
- https://www.umbc.edu/eol/cambodia/pinpeat.htm
- https://www2.umbc.edu/eol/cambodia/scale.htm
- https://unesdoc.unesco.org/ark:/48223/pf0000135257
- https://iftawm.org/journal/oldsite/articles/2015b/Garzoli_AAWM_Vol_4_2.pdf
