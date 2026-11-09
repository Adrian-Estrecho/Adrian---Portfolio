import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { clients, profile, projects } from '../content.js';
import { AppTile, editingApps, LanguageTile, languages } from './Icons.jsx';
import ownSource from './Hero.jsx?raw';

// Each tile's place around the portrait, measured in portrait heights from the
// bottom center. `d` sets how far it drifts with the pointer.
const APP_PLACES = {
  pr: { x: -0.5, y: 0.88, rot: -8, d: 22 },
  capcut: { x: -0.86, y: 0.82, rot: 7, d: 26 },
  ps: { x: -0.52, y: 0.6, rot: 6, d: 18 },
  figma: { x: -0.42, y: 0.33, rot: -7, d: 24 },
};

const LANGUAGE_PLACES = {
  react: { x: 0.46, y: 0.9, rot: 8, d: 12 },
  js: { x: 0.66, y: 0.92, rot: -7, d: 10 },
  css: { x: 0.86, y: 0.88, rot: 6, d: 14 },
  html: { x: 1.04, y: 0.92, rot: -6, d: 9 },
  java: { x: 0.56, y: 0.72, rot: 7, d: 12 },
  php: { x: 0.76, y: 0.74, rot: -5, d: 11 },
  sql: { x: 0.96, y: 0.74, rot: -6, d: 9 },
  cpp: { x: 0.45, y: 0.52, rot: 8, d: 13 },
};

function placeStyle(place, index) {
  return {
    '--x': place.x,
    '--y': place.y,
    '--rot': `${place.rot}deg`,
    '--d': place.d,
    '--dur': `${3.4 + (index % 4) * 0.7}s`,
    '--delay': `${index * -0.6}s`,
    '--enter': `${160 + index * 55}ms`,
  };
}

// ---------- The playhead ----------
const CUT_MIN = 3;
const CUT_MAX = 97;
const CUT_REST = 50;
const CUT_LEAN = 18; // How far the side under the mouse grows.
const FOLLOW = 140;
const DRAG = 35;
const INTRO = 300;

function createCut(heroRef, gripRef) {
  let now = CUT_REST;
  let target = CUT_REST;
  let speed = FOLLOW;
  let frame = 0;
  let last = 0;
  let timer = 0;
  let dragging = false;
  let touched = false;
  let zone = 'middle';

  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const paint = () => {
    heroRef.current?.style.setProperty('--cut', now.toFixed(2));
    const value = Math.round(now);
    gripRef.current?.setAttribute('aria-valuenow', value);
    gripRef.current?.setAttribute('aria-valuetext', `${value}% video editor, ${100 - value}% web developer`);
  };

  const tick = (time) => {
    const elapsed = Math.min(time - last, 50);
    last = time;
    now += (target - now) * (1 - Math.exp(-elapsed / speed));
    if (Math.abs(target - now) < 0.05) now = target;
    paint();
    frame = now === target ? 0 : requestAnimationFrame(tick);
  };

  const moveTo = (value, pace = FOLLOW) => {
    target = Math.min(Math.max(value, CUT_MIN), CUT_MAX);
    speed = pace;
    if (reduced()) {
      now = target;
      paint();
      return;
    }
    if (!frame) {
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }
  };

  const percentAt = (clientX) => {
    const rect = heroRef.current.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  };

  const zoneAt = (clientX) => {
    const percent = percentAt(clientX);
    if (percent < 36) return 'edit';
    return percent > 64 ? 'code' : 'middle';
  };

  const claim = () => {
    touched = true;
    heroRef.current?.classList.add('has-cut');
  };

  return {
    // The page opens on the editor, then the playhead sweeps in to show the second side.
    start() {
      if (reduced()) return;
      now = CUT_MAX;
      target = CUT_MAX;
      paint();
      timer = setTimeout(() => {
        if (!touched) moveTo(CUT_REST, INTRO);
      }, 850);
    },
    stop() {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      frame = 0;
    },
    // A press only becomes a drag after it moves sideways, so a touch can still scroll the page.
    press(event) {
      if (event.button !== 0) return;
      const from = event.clientX;
      let live = false;
      const onMove = (e) => {
        if (!live && Math.abs(e.clientX - from) < 6) return;
        live = true;
        dragging = true;
        claim();
        moveTo(percentAt(e.clientX), DRAG);
      };
      const onUp = (e) => {
        dragging = false;
        zone = zoneAt(e.clientX);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    },
    // The side under the mouse grows, so its button is never wiped away while you reach for it.
    hover(clientX) {
      if (dragging || reduced()) return;
      const next = zoneAt(clientX);
      if (next === zone) return;
      zone = next;
      touched = true;
      if (next === 'edit') moveTo(CUT_REST + CUT_LEAN);
      else if (next === 'code') moveTo(CUT_REST - CUT_LEAN);
      else moveTo(CUT_REST);
    },
    leave() {
      if (dragging || reduced()) return;
      zone = 'middle';
      moveTo(CUT_REST);
    },
    key(event) {
      const moves = {
        ArrowLeft: target - 5,
        ArrowDown: target - 5,
        ArrowRight: target + 5,
        ArrowUp: target + 5,
        Home: CUT_MIN,
        End: CUT_MAX,
      };
      if (moves[event.key] === undefined) return;
      event.preventDefault();
      claim();
      moveTo(moves[event.key]);
    },
  };
}

// ---------- The code portrait ----------
// Redraws the photo with the characters of this file. It reads profile.photo, so
// a new photo updates this side too.
const GLYPH_STOPS = [
  [0, [30, 72, 158]],
  [0.5, [46, 166, 255]],
  [1, [240, 249, 255]],
];

function glyphColor(light) {
  const [[from, a], [to, b]] = light < 0.5 ? [GLYPH_STOPS[0], GLYPH_STOPS[1]] : [GLYPH_STOPS[1], GLYPH_STOPS[2]];
  const mix = (light - from) / (to - from);
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * mix)).join(' ')})`;
}

function drawCodePortrait(canvas, photo) {
  const height = 1600;
  const width = Math.round((height * photo.naturalWidth) / photo.naturalHeight);
  const cellH = 18;
  const cellW = cellH * 0.6;
  const cols = Math.ceil(width / cellW);
  const rows = Math.ceil(height / cellH);
  canvas.width = width;
  canvas.height = height;

  // A solid silhouette keeps the code in the background from showing through the body.
  const ctx = canvas.getContext('2d');
  ctx.drawImage(photo, 0, 0, width, height);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = '#040919';
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';

  const sample = document.createElement('canvas');
  sample.width = cols;
  sample.height = rows;
  const sampleCtx = sample.getContext('2d', { willReadFrequently: true });
  sampleCtx.drawImage(photo, 0, 0, cols, rows);
  const { data } = sampleCtx.getImageData(0, 0, cols, rows);

  const lightAt = (at) => (0.2126 * data[at] + 0.7152 * data[at + 1] + 0.0722 * data[at + 2]) / 255;

  // Stretches the photo's own range, so a dark jacket and a lit face stay far apart.
  const lights = [];
  for (let at = 0; at < data.length; at += 4) {
    if (data[at + 3] >= 110) lights.push(lightAt(at));
  }
  lights.sort((a, b) => a - b);
  const dark = lights[Math.floor(lights.length * 0.05)];
  const bright = lights[Math.floor(lights.length * 0.97)];

  const chars = ownSource.replace(/\s+/g, '');
  let next = 0;
  ctx.font = `600 ${cellH}px 'JetBrains Mono Variable', ui-monospace, Consolas, monospace`;
  ctx.textBaseline = 'top';
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const at = (row * cols + col) * 4;
      if (data[at + 3] < 110) continue;
      const light = Math.min(Math.max((lightAt(at) - dark) / (bright - dark), 0), 1);
      ctx.fillStyle = glyphColor(light ** 0.8);
      ctx.fillText(chars[next % chars.length], col * cellW, row * cellH);
      next += 1;
    }
  }
}

function CodePortrait() {
  const ref = useRef(null);
  useEffect(() => {
    let live = true;
    const photo = new Image();
    photo.src = profile.photo;
    Promise.all([photo.decode(), document.fonts.load("600 18px 'JetBrains Mono Variable'")])
      .then(() => {
        if (live) drawCodePortrait(ref.current, photo);
      })
      .catch(() => {
        // Without the photo the code side simply shows no portrait.
      });
    return () => {
      live = false;
    };
  }, []);
  return <canvas className="hero-portrait" ref={ref} width="648" height="1076" />;
}

// ---------- The two scenes ----------
function CodePane({ className, lines, first }) {
  return (
    <pre className={`code-pane ${className}`}>
      {lines.map((line, i) => (
        <span className="code-line" data-n={first + i} key={i}>
          {line}
          {'\n'}
        </span>
      ))}
    </pre>
  );
}

const SOURCE_LINES = ownSource.split('\n');
const CUT_LINE = SOURCE_LINES.findIndex((line) => line.startsWith('function createCut'));

const BAND_ROWS = [
  { tag: 'V2', short: false, clips: clients.filter((c) => c.track !== 'short') },
  { tag: 'V1', short: true, clips: clients.filter((c) => c.track === 'short') },
];

const WAVE = Array.from({ length: 220 }, (_, i) => {
  const size = 0.18 + 0.82 * Math.abs(Math.sin(i * 0.37) * Math.sin(i * 0.087 + 1));
  return `M${i} ${10 - size * 9}V${10 + size * 9}`;
}).join('');

function EditBand() {
  return (
    <div className="band">
      <div className="band-ruler" />
      {BAND_ROWS.map((row) => (
        <div className="band-row" key={row.tag}>
          <span className="band-tag">{row.tag}</span>
          {row.clips.map((c) => (
            <span className={`band-clip${row.short ? ' band-clip--short' : ''}`} style={{ flexGrow: c.to - c.from + 1 }} key={c.id}>
              {c.name}
            </span>
          ))}
        </div>
      ))}
      <div className="band-row">
        <span className="band-tag">A1</span>
        <svg className="band-wave" viewBox="0 0 220 20" preserveAspectRatio="none">
          <path d={WAVE} />
        </svg>
      </div>
    </div>
  );
}

function CodeBand() {
  return (
    <div className="term">
      <p>
        <span className="term-prompt">$</span> ls projects
      </p>
      <p>{projects.map((p) => `${p.id}/`).join('  ')}</p>
    </div>
  );
}

export default function Hero({ onGo }) {
  const heroRef = useRef(null);
  const gripRef = useRef(null);
  const cut = useMemo(() => createCut(heroRef, gripRef), []);

  useLayoutEffect(() => {
    cut.start();
    return cut.stop;
  }, [cut]);

  // Stops the floating tiles while the hero is off screen.
  useEffect(() => {
    const hero = heroRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      hero.classList.toggle('is-away', !entry.isIntersecting);
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const rect = heroRef.current.getBoundingClientRect();
    heroRef.current.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width - 0.5) * 2);
    heroRef.current.style.setProperty('--my', ((e.clientY - rect.top) / rect.height - 0.5) * 2);
    cut.hover(e.clientX);
  };

  const onPointerLeave = (e) => {
    if (e.pointerType === 'mouse') cut.leave();
  };

  const [editSide, codeSide] = [profile.sides.edit, profile.sides.code];

  return (
    <header id="profile" className="hero" ref={heroRef} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <div className="cut" onPointerDown={(e) => cut.press(e)}>
        <div className="scene scene--edit">
          <h1 className="hero-name">
            <span>Adrian</span> <span>Estrecho</span>
          </h1>
          <div className="hero-stage">
            <div className="hero-halo" aria-hidden="true" />
            <div aria-hidden="true">
              <EditBand />
              {editingApps.map((app, i) => (
                <div key={app.id} className="float float--app" style={placeStyle(APP_PLACES[app.id], i)}>
                  <div className="float-body" data-name={app.name}>
                    <AppTile id={app.id} />
                  </div>
                </div>
              ))}
            </div>
            <img className="hero-portrait" src={profile.photo} alt={`Portrait of ${profile.name} taking a mirror selfie in a black denim jacket`} width="648" height="1076" />
          </div>
        </div>

        {/* The same frame as a developer sees it. The text below covers it for screen readers. */}
        <div className="scene scene--code" aria-hidden="true">
          <p className="hero-name hero-name--code">
            <span>Adrian</span> <span>Estrecho</span>
          </p>
          <div className="hero-stage">
            <div className="hero-halo hero-halo--code" />
            <CodePane className="code-pane--left" lines={SOURCE_LINES.slice(0, 40)} first={1} />
            <CodePane className="code-pane--right" lines={SOURCE_LINES.slice(CUT_LINE, CUT_LINE + 40)} first={CUT_LINE + 1} />
            <CodeBand />
            <CodePortrait />
            {languages.map((tech, i) => (
              <div key={tech.id} className="float float--lang" style={placeStyle(LANGUAGE_PLACES[tech.id], i + 4)}>
                <div className="float-body" data-name={tech.name}>
                  <LanguageTile tech={tech} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="playhead">
          <span className="playhead-line" aria-hidden="true" />
          <div
            className="playhead-grip"
            ref={gripRef}
            role="slider"
            tabIndex={0}
            aria-label="Move between the video editor and web developer sides"
            aria-valuemin={CUT_MIN}
            aria-valuemax={CUT_MAX}
            aria-valuenow={CUT_REST}
            aria-valuetext="50% video editor, 50% web developer"
            onKeyDown={(e) => cut.key(e)}
          >
            <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true">
              <path fill="currentColor" d="M8 0v14L0 7l8-7ZM14 0v14l8-7-8-7Z" />
            </svg>
            <span className="playhead-hint" aria-hidden="true">
              Drag
            </span>
          </div>
        </div>
      </div>

      <div className="hero-sides">
        <a className="btn btn--small hero-resume" href="/resume.html">
          See my resume
        </a>
        <section className="hero-side hero-side--edit">
          <h2 className="hero-side-title">{editSide.title}</h2>
          <p className="hero-side-text">{editSide.text}</p>
          <p className="hero-tools">{editingApps.map((a) => a.name).join(', ')}</p>
          <button type="button" className="btn btn--ice" onClick={() => onGo('experience')}>
            See my editing timeline
          </button>
        </section>
        <section className="hero-side hero-side--code">
          <h2 className="hero-side-title">{codeSide.title}</h2>
          <p className="hero-side-text">{codeSide.text}</p>
          <p className="hero-tools">{languages.map((l) => l.name).join(', ')}</p>
          <button type="button" className="btn btn--primary" onClick={() => onGo('projects')}>
            See my projects
          </button>
          <a className="hero-phone" href={`tel:${profile.phone}`}>
            {profile.phoneDisplay}
          </a>
        </section>
      </div>
    </header>
  );
}
