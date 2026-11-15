# Dub Techno — источники и что из них взято

Ресёрч делался 2026-11-14/15 для `techno/16-minimal-dub`, затем для
`techno/17-halfstep-dub` / `-v2`. Сырой лог сессии:
`docs/thoughts/dub_session.md`.

## Внешние гайды

### Tunary — How to make dub techno
https://tunaryinstruments.com/guides/how-to-make-dub-techno/

Что взято:
- 120–130 BPM; ядро — 120–125.
- Приглушённый four-on-the-floor, мягкие оффбитные хэты.
- Короткий фильтрованный аккорд-стаб через длинный delay/reverb.
- Глубокий тёплый саб, хайс/туман, терпеливая аранжировка.
- Маленькие изменения несут трек; новые секции не нужны.

### Studio Brootle — Dub Techno Tutorial: 4 Ingredients
https://www.studiobrootle.com/dub-techno-tutorial-4-ingredients/

Что взято:
- Четыре ингредиента: кик, саб, хэты, 2 аккорда.
- Всё остальное — фильтры, delay/reverb и автоматизация.
- Delay/reverb — не украшение, а сам звук.
- Пространство и сдержанность важнее количества событий.

### House of Loop — How to create the iconic dub techno chord sound
https://houseofloop.com/how-to-create-the-iconic-dub-techno-chord-sound/

Что взято:
- Стаб через ping-pong delay с feedback примерно 40–65 %.
- Повторы темнее сухого сигнала: фильтровать каждое эхо.
- Реверб после дилея, а не вместо него.
- Минимальный гипнотический 4/4, tape warmth, длинные хвосты.

## Сцена / что слушать

Это не «источники с URL», а канон для наслушанности. Слушать не мелодии,
а **пространство, фильтры, задержки и количество пустоты**.

- **Basic Channel** — минимум событий, шум/хайс, аккорд живёт в эхе,
  верх срезан, низ — центр.
- **Rhythm & Sound** — даб-логика, суб, вокальные обрывки, бесконечные
  задержки; не регги-стилизация, а пространство.
- **Maurizio** — сухие минимальные петли, стаб как ритмический элемент.
- **Chain Reaction** — шум, шипение, длинные формы, почти без событий.
- **Deepchord / Echospace / cv313** — поле, реверб, подводный низ,
  очень медленные тембровые сдвиги.
- **Monolake** — клики, суб, минимальная электроника; полезно для
  STRIP/CLICK-режимов.
- **Pole / Vladislav Delay** — глитч-даб, трещины, пространство.
- **Fluxion / Porter Ricks / Deadbeat / Yagya / Substance / Vainqueur /
  Scion** — разные оттенки: от тёмного эмбиент-даба до минимального 4/4.
- **Burial** — не даб-техно, но источник halfstep-ритма, вокального пэда
  и «дождливого» пространства для `17-halfstep-dub`.

## Strudel

- https://strudel.cc/learn/ — оглавление.
- https://strudel.cc/learn/mini-notation/ — `~`, `[]`, `<>`, `*`, `,`,
  `:`; из этого собраны все фразы.
- https://strudel.cc/learn/synths/ — `sawtooth`, `triangle`, `sine`,
  `unison`, `detune`, `partials`, FM.
- https://strudel.cc/learn/effects/ — `lpf`, `lpq`, `lpdepth`, `lpsync`,
  `delay`, `delaytime`, `delayfeedback`, `room`, `roomsize`, `chorus`.
- https://club.tidalcycles.org — Tidal Club; большинство приёмов
  переносится в Strudel.
- https://codeberg.org/uzu/strudel — исходники и issues.

## Сэмплы и карты

- `github:tidalcycles/uzu-drumkit` — `bd`, `hh`, `oh`, `rim`, `sh`,
  `sd`, `cp` и т.д. Годится для глухого кика, мягких хэтов, rim.
- `github:tidalcycles/Dirt-Samples` — `click`, `wind`, `noise2`,
  `space`, `birds`, `insects`, `padlong` и т.д.
- `crackle` и `pink` — синтезированные текстуры, не сэмплы.
- Кнопка SAMPLES в панели скачивает только используемые ключи;
  для `16-minimal-dub` это 45 файлов.

## Что не брать

- EDM-переходы: райзеры, white-noise билды, дропы, sidechain-пумп,
  snare-роллы.
- «Красивый» лид и мелодию поверх аккордов.
- 303-обыгрывание аккордов «пиу» на каждой ноте.
- Регги-аккорды на каждую слабую долю, если регги не просили.
- Яркий верх и перекомпрессию.
