const GLYPHS = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10000', '10011', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  J: ['00111', '00010', '00010', '00010', '00010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
};

const CELL_W = 5;
const CELL_H = 7;
const TRACKING = 1;
const LEADING = 2;
const SPACE_W = 3;

function pixelLogo(lines) {
  const width = Math.max(
    ...lines.map((line) =>
      [...line].reduce((w, ch) => w + (ch === ' ' ? SPACE_W : CELL_W) + TRACKING, -TRACKING),
    ),
  );
  const height = lines.length * CELL_H + (lines.length - 1) * LEADING;
  let rects = '';

  lines.forEach((line, row) => {
    let x = 0;
    for (const ch of line) {
      if (ch === ' ') {
        x += SPACE_W + TRACKING;
        continue;
      }
      const glyph = GLYPHS[ch];
      if (glyph) {
        const y0 = row * (CELL_H + LEADING);
        for (let gy = 0; gy < CELL_H; gy++) {
          for (let gx = 0; gx < CELL_W; gx++) {
            if (glyph[gy][gx] === '1') {
              rects += `<rect x="${x + gx}" y="${y0 + gy}" width="1" height="1"/>`;
            }
          }
        }
      }
      x += CELL_W + TRACKING;
    }
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges" focusable="false" aria-hidden="true">${rects}</svg>`;
}

const PAGES = [
  `
    <p>Скорее всего ты сидишь и думаешь, - "что бы мне еще накодировать?". Вот отличное предложение: музыку! Мы не говорим о банальной генерации трека в бездушном SUNO, нет, мы будем делать музыку яваскриптом! Каждый параметр можно поменять в рилтайме, добавить, убрать, подвинуть, покрутить ручки пока играет композиция, поставить ее на холд в понравившемся моменте и модулировать, модулировать, модулировать. Мало ручек? - добавил и снова модулируешь.</p>
    <p>Если ты уже знаешь Strudel.cc - этот инструмент расширит твои возможности, только изучаешь - ИИ в помощь, просишь его изменить то что хочется, создать новый трек с нуля под твое настроение и бесконечно его играть и настраивать, делая его своим и просто погружаясь в метаморфозы волн.</p>
    <p class="se-note">Начини с прослушивания примеров, чтобы оценить возможности и погрузиться в гипноз звука.</p>
  `,
  `
    <p>Экспандер сочетает в себе лучшее из двух миров - визуальный таймлан, быстрое управление слайдерами и тонкие чрезвычайно гибкие настройки деталей кодом.</p>
    <p>Клик на название интрумента проскроллит код до его опеределения, на слайдер - до его параметров, точка на таймлайне - ее настройки.</p>
  `,
];

const FALLBACK_TRACKS = [
  '/tracks/01-dnb-live.js',
  '/tracks/02-dnb-live-v2.js',
  '/tracks/03-dnb-live-v3.js',
  '/tracks/04-dnb-live-v4.js',
  '/tracks/breakcore/01-rinse-slices.js',
];

const STYLE = `
  .se-intro {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: grid;
    place-items: center;
    padding: 24px;
    background: rgba(5, 7, 4, 0.76);
    -webkit-backdrop-filter: blur(9px) saturate(0.85);
    backdrop-filter: blur(9px) saturate(0.85);
    animation: se-fade 0.18s ease;
  }
  .se-intro .se-modal {
    position: relative;
    width: min(1080px, 100%);
    height: min(700px, 100%);
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
    background: #141712;
    border: 1px solid #31382a;
    box-shadow: 0 32px 90px rgba(0, 0, 0, 0.65), inset 0 0 0 1px rgba(179, 216, 13, 0.04);
    animation: se-rise 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .se-intro button { font: inherit; }

  .se-intro .se-x {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 3;
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    padding: 0;
    background: transparent;
    border: 1px solid #2b3226;
    border-radius: 3px;
    color: #7d8776;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
  }
  .se-intro .se-x:hover { color: #e8e8e8; border-color: #b3d80d; }

  .se-intro .se-left {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    padding: 38px 40px 28px;
    overflow: hidden;
  }
  .se-intro .se-brand { flex: none; margin-bottom: 18px; }
  .se-intro .se-brand svg {
    display: block;
    width: min(100%, 336px);
    height: auto;
    filter: drop-shadow(0 0 10px rgba(179, 216, 13, 0.2));
  }
  .se-intro .se-brand rect { fill: #b3d80d; }
  .se-intro .se-brand::after {
    content: '';
    display: block;
    width: 72px;
    height: 2px;
    margin-top: 16px;
    background: #b3d80d;
    opacity: 0.7;
  }
  .se-intro .se-copy {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding-right: 10px;
    font-size: 13px;
    line-height: 1.6;
    color: #ccd3c3;
    scrollbar-width: thin;
    scrollbar-color: #3a4234 transparent;
  }
  .se-intro .se-copy::-webkit-scrollbar { width: 8px; }
  .se-intro .se-copy::-webkit-scrollbar-thumb { background: #31382a; border-radius: 4px; }
  .se-intro .se-copy p { margin: 0 0 14px; }
  .se-intro .se-copy p:last-child { margin-bottom: 0; }
  .se-intro .se-copy.se-page-in { animation: se-page 0.22s ease; }
  .se-intro .se-note {
    padding-left: 12px;
    color: #e3f07a;
    border-left: 2px solid rgba(179, 216, 13, 0.6);
  }

  .se-intro .se-foot {
    flex: none;
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid #262b22;
  }
  .se-intro .se-dots { display: flex; gap: 9px; }
  .se-intro .se-dot {
    width: 9px;
    height: 9px;
    padding: 0;
    border: 1px solid #3a4234;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
  }
  .se-intro .se-dot:hover { border-color: #b3d80d; }
  .se-intro .se-dot.on {
    border-color: #b3d80d;
    background: #b3d80d;
    box-shadow: 0 0 10px rgba(179, 216, 13, 0.5);
  }
  .se-intro .se-next {
    margin-left: auto;
    width: 46px;
    height: 46px;
    display: grid;
    place-items: center;
    padding: 0;
    background: #b3d80d;
    border: 1px solid #b3d80d;
    border-radius: 3px;
    color: #0d0f0c;
    font-size: 22px;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
  }
  .se-intro .se-next:hover { filter: brightness(1.08); }

  .se-intro .se-right {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    padding: 38px 34px 28px;
    overflow: hidden;
    border-left: 1px solid #262b22;
    background: linear-gradient(180deg, #11140f, #0f120d);
  }
  .se-intro .se-right-cap {
    flex: none;
    margin-bottom: 16px;
    color: #b3d80d;
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }
  .se-intro .se-tracks {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 9px;
    overflow: auto;
  }
  .se-intro .se-track {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 4px;
    min-height: 62px;
    padding: 12px 16px;
    text-align: left;
    background: #171b14;
    border: 1px solid #2b3226;
    border-radius: 3px;
    color: #e8e8e8;
    cursor: pointer;
    transition: border-color 0.12s ease, background 0.12s ease, transform 0.12s ease;
  }
  .se-intro .se-track:hover {
    background: #1c2316;
    border-color: #b3d80d;
    transform: translateX(2px);
  }
  .se-intro .se-track-title {
    font-size: 17px;
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: 0.02em;
  }
  .se-intro .se-track-genre {
    color: #7d8776;
    font-size: 9.5px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  .se-intro .se-tracks-note {
    padding: 6px 2px;
    color: #7d8776;
    font-size: 11px;
  }

  .se-intro button:focus-visible {
    outline: 2px solid #b3d80d;
    outline-offset: 2px;
  }

  @keyframes se-fade { from { opacity: 0; } }
  @keyframes se-rise { from { opacity: 0; transform: translateY(8px) scale(0.995); } }
  @keyframes se-page { from { opacity: 0; transform: translateY(4px); } }

  @media (max-width: 880px) {
    .se-intro { padding: 12px; }
    .se-intro .se-modal {
      grid-template-columns: 1fr;
      height: auto;
      max-height: 92vh;
      overflow: auto;
    }
    .se-intro .se-left { padding: 26px 22px 20px; }
    .se-intro .se-copy { overflow: visible; }
    .se-intro .se-right {
      padding: 22px;
      border-left: 0;
      border-top: 1px solid #262b22;
    }
    .se-intro .se-tracks { overflow: visible; }
    .se-intro .se-track { flex: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .se-intro, .se-intro .se-modal, .se-intro .se-copy.se-page-in { animation: none; }
  }
`;

function fallbackTitle(path) {
  const base = path.split('/').pop() ?? path;
  return base.replace(/\.js$/, '').replace(/^\d+-/, '').replace(/-/g, ' ');
}

function fallbackGenre(path) {
  const parts = path.replace(/^\/tracks\//, '').split('/');
  if (parts.length > 1) return parts[0];
  return parts[0].replace(/^\d+-/, '').split('-')[0] || 'track';
}

async function tracksWithMeta() {
  let list = FALLBACK_TRACKS;
  try {
    const res = await fetch('/api/tracks');
    if (res.ok) {
      const all = await res.json();
      if (Array.isArray(all) && all.length) list = all.slice(0, 5);
    }
  } catch {}

  return Promise.all(
    list.map(async (path) => {
      let title = fallbackTitle(path);
      const genre = fallbackGenre(path);
      try {
        const res = await fetch(path, { cache: 'no-store' });
        if (res.ok) {
          const src = await res.text();
          const header = (src.split('\n')[1] ?? '').replace(/^\/\/\s*/, '');
          const parsed = header.split('·')[0].trim();
          if (parsed) title = parsed;
        }
      } catch {}
      return { path, title, genre };
    }),
  );
}

function mount() {
  const style = document.createElement('style');
  style.textContent = STYLE;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.className = 'se-intro';
  overlay.innerHTML = `
    <div class="se-modal" role="dialog" aria-modal="true" aria-label="Intro">
      <button type="button" class="se-x" aria-label="Закрыть">×</button>
      <section class="se-left">
        <div class="se-brand" role="img" aria-label="STRUDEL EXPANDER">
          ${pixelLogo(['STRUDEL', 'EXPANDER'])}
        </div>
        <div class="se-copy" id="seCopy" aria-live="polite"></div>
        <div class="se-foot">
          <div class="se-dots" id="seDots"></div>
          <button type="button" class="se-next" id="seNext" aria-label="Далее">→</button>
        </div>
      </section>
      <aside class="se-right">
        <div class="se-right-cap">Выбери трек</div>
        <div class="se-tracks" id="seTracks">
          <div class="se-tracks-note">loading…</div>
        </div>
      </aside>
    </div>`;

  document.body.appendChild(overlay);

  const modal = overlay.querySelector('.se-modal');
  const copy = overlay.querySelector('#seCopy');
  const dots = overlay.querySelector('#seDots');
  const next = overlay.querySelector('#seNext');
  const trackList = overlay.querySelector('#seTracks');

  let page = 0;

  const renderDots = () => {
    dots.innerHTML = PAGES.map(
      (_, i) =>
        `<button type="button" class="se-dot${i === page ? ' on' : ''}" data-page="${i}" aria-label="Шаг ${i + 1}"${
          i === page ? ' aria-current="step"' : ''
        }></button>`,
    ).join('');
  };

  const renderPage = () => {
    copy.innerHTML = PAGES[page];
    copy.classList.remove('se-page-in');
    void copy.offsetWidth;
    copy.classList.add('se-page-in');
    renderDots();
    const last = page === PAGES.length - 1;
    next.textContent = last ? '✓' : '→';
    next.setAttribute('aria-label', last ? 'Закрыть' : 'Далее');
  };

  const nextPage = () => {
    if (page < PAGES.length - 1) {
      page += 1;
      renderPage();
      copy.scrollTop = 0;
    } else {
      close();
    }
  };

  const close = () => {
    document.removeEventListener('keydown', onKey, true);
    overlay.remove();
  };

  function onKey(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    const focusables = [...modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(
      (el) => el.offsetParent !== null && !el.disabled,
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  overlay.addEventListener('pointerdown', (e) => {
    if (e.target === overlay) close();
  });
  overlay.querySelector('.se-x').addEventListener('click', close);
  next.addEventListener('click', nextPage);
  dots.addEventListener('click', (e) => {
    const dot = e.target.closest('.se-dot');
    if (!dot) return;
    page = Number(dot.dataset.page) || 0;
    renderPage();
    copy.scrollTop = 0;
  });

  trackList.addEventListener('click', async (e) => {
    const btn = e.target.closest('.se-track');
    if (!btn) return;
    const path = btn.dataset.path;
    if (!path) return;
    close();
    const pick = window.__strudelPickTrack;
    if (typeof pick === 'function') {
      try {
        await pick(path);
      } catch (err) {
        console.error(err);
      }
    }
  });

  document.addEventListener('keydown', onKey, true);
  renderPage();
  next.focus();

  tracksWithMeta().then((tracks) => {
    trackList.textContent = '';
    for (const t of tracks) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'se-track';
      btn.dataset.path = t.path;

      const title = document.createElement('span');
      title.className = 'se-track-title';
      title.textContent = t.title;

      const genre = document.createElement('span');
      genre.className = 'se-track-genre';
      genre.textContent = t.genre;

      btn.append(title, genre);
      trackList.appendChild(btn);
    }
  });
}

mount();
