# Ссылки

Проверено 2026-11-12 (код ответа 200). Если что-то отвалилось — правь смело.

## Доки Strudel

- https://strudel.cc/learn/ — оглавление туториала, отсюда всё остальное
- https://strudel.cc/learn/mini-notation/ — мини-нотация: `~`, `[]`, `<>`, `*`, `,`, `:`
- https://strudel.cc/learn/synths/ — синтезаторы, `s("supersaw")`, `unison`, `detune`, FM
- https://strudel.cc/learn/effects/ — фильтры, дилей, реверб, дисторшн
- https://strudel.cc/learn/samples/ — сэмплы, банки, `.bank('RolandTR909')`

Справочник по функциям — не по ссылке, а в самом REPL: слева иконка «?» /
вкладка с функциями, там же живой поиск. Прямой URL отдаёт 403 ботам.

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

Чего нет в опубл. `@strudel/core` 1.2.6, хотя в доках примеры есть: `penv`,
`panchor` (питч-огибающая) и `glide` (портаменто). Не используем.
