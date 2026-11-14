// В браузере `_pianoroll()` / `_punchcard()` / `_spiral()` / `_pitchwheel()` —
// это виджеты: они создают canvas прямо в коде и рисуют туда паттерн.
// В Node их нет вообще, поэтому `npm run verify` падал на живом треке с
// «._pianoroll is not a function» — хотя в strudel.cc он играет.
//
// Здесь это no-op, возвращающий паттерн: сетка, громкости и worklet-счёт
// считаются ровно так же, картинки просто не рисуются. Подключать ДО того,
// как трек начнёт выполняться (достаточно импорта в шапке инструмента).
import * as core from '@strudel/core';

const WIDGETS = ['_pianoroll', '_punchcard', '_spiral', '_pitchwheel', '_scope', '_spectrum'];

for (const name of WIDGETS) {
  if (typeof core.Pattern.prototype[name] !== 'function') {
    core.Pattern.prototype[name] = function () {
      return this;
    };
  }
}
