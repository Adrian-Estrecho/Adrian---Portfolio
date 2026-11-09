import { useEffect, useRef } from 'react';

export default function Nav({ sections, active, onGo }) {
  const listRef = useRef(null);

  // On narrow phones the nav scrolls sideways, so keep the current section in view.
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector('.is-active');
    if (!link || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2 });
  }, [active]);

  return (
    <nav className="nav" aria-label="Sections">
      <ul className="nav-list" ref={listRef}>
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`nav-link${active === s.id ? ' is-active' : ''}`}
              aria-current={active === s.id ? 'true' : undefined}
              onClick={(e) => {
                e.preventDefault();
                onGo(s.id);
              }}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
