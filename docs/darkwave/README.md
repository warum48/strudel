# Darkwave / New wave — плейбук

Тёмная сторона новой волны: пост-панк + синтезаторы + драм-машины; минор,
низкие тембры, меланхолия, при этом — **песня**, а не эмбиент. Ориентир —
Depeche Mode среднего периода (`Black Celebration` → `Violator`): синтетика,
сэмплерные детали, большой gated snare, мрачная гармония и запоминающаяся
мелодия. Не путать с нашим coldwave: там **разреженность и лёд**, здесь —
**плотнее, драматичнее, есть «крючок»**.

Наш трек: `tracks/darkwave/01-static-confession.js` — A minor, 124 BPM,
синтетический состав (TR-909/808, pulse-бас, полый pad, string machine,
FM-колокол, арпеджио, лид), 104 такта, INTERLUDE и длинный OUTRO.

## 1. Звук

| Признак | Как делаем |
|---|---|
| Темп | darkwave 100–140 BPM; наш выбор — 124 (new wave / Depeche-середина) |
| Размер | 4/4, прямой грув, без свинга; лёгкий humanize только на хэтах |
| Тональность | A минор/фригийский, без доминанты; bII (Bb) как краска |
| Ритм | механические драм-машины, большой snare, томы-филлы |
| Бас | pulse/square, низкий срез, октавные прыжки, короткая атака |
| Синты | hollow pulse-pad, string machine, FM-колокол, арпеджио, моно-лид |
| Микс | тёмный верх, длинный реверб, dotted-eighth delay, место для пустоты |

Ключевое отличие от coldwave: **больше движения и драмы**. Бас ведёт,
арпеджио и колокол дают «украшения», лид — мелодию. Пустота тоже нужна —
в INTERLUDE и OUTRO.

## 2. Ритм

- 909: kick, snare, clap, hats; 808: томы, rim/cowbell для краски.
  Бочка — глухая (низкий `cut`), без яркого клика.
- Основной грув — 4-on-floor или 1/3 с доп. ударом; snare на 2 и 4.
- Большой snare: `room` + общий большой `roomsize` (gated-ощущение),
  короткий `decay`, `clip`.
- Хэты 8-е/16-е; open hat — как акцент, не постоянно.
- Томы — филлы в конце 8/16 тактов, а не в каждом.
- Clap дублирует snare только в CHORUS (драма), в куплете его нет.

## 3. Бас

- Pulse/square с `pw` (полый тембр), LP 250–450, `lpenv` для атаки.
- Короткие ноты, `clip`/`decay`, без яркого клика.
- Октавные прыжки (`sometimesBy` + `note(12)`) — фирменный new-wave приём.
- В CHORUS добавляем тихий sine-саб на тех же корнях.
- В OUTRO срез баса уводим в минимум — бас «уходит в пол».

## 4. Гармония

- **Антипоп**: никакой доминанты с G# и кадансов 1–2–4–5.
  `Am9 – Bbmaj7 – Fmaj7 – Dm7` (i–bII–bVI–iv): bII — неаполитанская краска,
  9-ки/7-ки висят, вместо разрешения.
- Аккорд на такт (`chords`), пэд/струнные — `slow(2)` (по 2 такта).
- Мелодия в узком диапазоне, b3–b6–5; фразы не «закрываются» в тонику.
- Арпеджио строится из аккордов (`.arp`), а не из отдельной строки —
  так гармония и украшение не расходятся.
- Бас — **педаль A** с b2-соседом (Bb) и редкой октавой, а не проход по
  корням аккордов: контрапункт важнее «правильной» гармонии.
- Бочка по умолчанию глухая (`cut` 1200), бас по умолчанию с `cut` 80.

## 5. Синты и обработка

- **Hollow pad**: `s('pulse').pw(0.28)`, `unison 2`, `detune`, chorus,
  `hpf 200`, атака 0.8–1.2, релиз 2–3. Полый, не «Juno-стек».
- **String machine**: `sawtooth` unison 4, `hpf 350–450`, chorus 0.7,
  медленная атака; входит в CHORUS и OUTRO.
- **FM-колокол**: `s('sine').fmi(2).fmh(2.01)`, короткая атака, длинный
  релиз, dotted-eighth delay; редкие фразы, не арпеджио.
- **Арпеджио**: pulse, короткий decay, `lpf 2200–3000`, delay, лёгкий pan LFO.
- **Лид**: square/pulse, `lpf 1800–2600`, delay + room; две фразы (куплет /
  припев) — свитч `lead`.
- Реверб один на всех (`fx.reverb.size`); dotted delay: `delaytime 0.375`.

## 6. Форма (наш трек, 104 такта)

```
INTRO 0–8      pad, колокол, шум; без барабанов
VERSE 8–24     грув drive, бас, арп низко, редкий лид
PRE 24–32      build: 16-е хэты, томы, riser, арп выше
CHORUS 32–48   большой snare + clap, open hat, string machine, лид
INTERLUDE 48–56  барабанов почти нет: pad, колокол (rev), шум
VERSE 2 56–72  half-time, тёмный бас, разреженный арп
CHORUS 2 72–88  всё, лид +12, арп high
OUTRO 88–104   88–96 тонкие барабаны, 96–104 без барабанов; хвосты
```

Свитчи (как в наших правилах): `play` (LOOP/SONG/HOLD), `mode` (4 грува),
`arp` (низкий/высокий), `lead` (две фразы). Таймлайн-зависимые свитчи
интерактивны только в LOOP.

## 7. Ошибки

- Копировать coldwave-инструменты 1-в-1: это другой жанр по плотности.
- Постоянный 16-й арпеджио и лид одновременно — каша; разводить по секциям.
- Слишком «яркий» верх: darkwave любит приглушённый верх и низкую середину.
- Много разных `roomsize` — в Strudel пересборка IR и дропауты.
- Забыть про пустоту: INRO/INTERLUDE/OUTRO должны дышать.
- Даб-стабы и регги-синкопы — не этот жанр.

## 8. Источники

- Wikipedia — Dark wave (определение, минор, «slower tempos, lower pitches,
  more minor keys», synth/sampler/drum machine, Depeche Mode в первом
  поколении): https://en.wikipedia.org/wiki/Dark_wave
- The Sound Atlas — Darkwave (BPM 100–140, 4/4 straight, mechanical drum
  machine patterns, driving bass, minor key dominance, synth/guitar layers):
  https://thesoundatlas.org/discover/darkwave
- Wikipedia — Music for the Masses (состав: ARP 2600, Minimoog, RSF Kobol,
  Emulator II, Synclavier, Fairlight CMI, EMS Synthi; сессии сэмплирования;
  Wilder/Bascombe; «minor-key» Strangelove):
  https://en.wikipedia.org/wiki/Music_for_the_Masses
- Wikipedia — Violator (Flood + Wilder; сэмплирование живой перкуссии и
  лупование, чтобы избежать «холодной драм-машины»; смесь alternative/dance/
  goth): https://en.wikipedia.org/wiki/Violator_(album)
- Wikipedia — Depeche Mode (Synclavier и E-mu Emulator сдвинули звук группы):
  https://en.wikipedia.org/wiki/Depeche_Mode
- BeatKey — How to Make Darkwave (BPM 100–130, dotted-eighth delay, ошибки;
  общий ориентир, не для копирования инструментов):
  https://beatkey.app/how-to-make-darkwave-music

Гайды выше сведены в этот файл; ссылки оставлены как первоисточники.
