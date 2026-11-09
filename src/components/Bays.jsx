import { useEffect, useState } from 'react';

// A row of panels. Selecting one opens it across the row and narrows the others to
// spines. Below 1081px the panels stack and open downward instead.
const STACKED = '(max-width: 1080px)';

export function BayRow({ items, label, className = '', children }) {
  const [openId, setOpenId] = useState(null);
  const key = items.map((item) => item.id).join('|');

  // A link such as #reedit opens that panel.
  useEffect(() => {
    const ids = key.split('|');
    const openFromHash = () => {
      const id = window.location.hash.slice(1);
      if (ids.includes(id)) setOpenId(id);
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [key]);

  // Closing a stacked panel moves the ones below it, so bring the opened one back into view.
  useEffect(() => {
    if (!openId || !window.matchMedia(STACKED).matches) return undefined;
    const timer = setTimeout(() => document.getElementById(openId)?.scrollIntoView({ block: 'start' }), 380);
    return () => clearTimeout(timer);
  }, [openId]);

  const toggle = (id) => {
    setOpenId((current) => (current === id ? null : id));
    // Clearing the address lets the same link open this panel again.
    if (window.location.hash === `#${id}`) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const onKeyDown = (event) => {
    if (event.key !== 'Escape' || !openId) return;
    document.getElementById(`${openId}-trigger`)?.focus();
    setOpenId(null);
  };

  return (
    <div className={`bays ${className}`} role="group" aria-label={label} onKeyDown={onKeyDown}>
      {items.map((item) =>
        children(item, {
          open: openId === item.id,
          shut: openId !== null && openId !== item.id,
          onToggle: () => toggle(item.id),
        }),
      )}
    </div>
  );
}

export function Bay({ id, name, label, open, shut, onToggle, cover, face, onPointerMove, onPointerLeave, children }) {
  return (
    <article id={id} className={`bay${open ? ' is-open' : ''}${shut ? ' is-shut' : ''}`}>
      <div className="bay-front">
        {cover}
        <div className="bay-face">{face}</div>
        <span className="bay-spine" aria-hidden="true">
          {name}
        </span>
        <h3 className="bay-head">
          <button
            type="button"
            id={`${id}-trigger`}
            className="bay-trigger"
            aria-label={`${name}, ${label}`}
            aria-expanded={open}
            aria-controls={`${id}-panel`}
            onClick={onToggle}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
          >
            <span className="bay-plus" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path fill="currentColor" d="M7 0h2v7h7v2H9v7H7V9H0V7h7z" />
              </svg>
            </span>
          </button>
        </h3>
      </div>
      <span className="bay-line" aria-hidden="true" />
      <div id={`${id}-panel`} className="bay-panel" role="region" aria-labelledby={`${id}-trigger`} inert={!open}>
        <div className="bay-panel-inner">{children}</div>
      </div>
    </article>
  );
}
