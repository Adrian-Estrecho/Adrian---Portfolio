import {
  siHtml5,
  siCss,
  siJavascript,
  siReact,
  siPhp,
  siCplusplus,
} from 'simple-icons';

const DATABASE =
  'M12 2C6.9 2 3 3.8 3 6.2v11.6C3 20.2 6.9 22 12 22s9-1.8 9-4.2V6.2C21 3.8 17.1 2 12 2Zm0 2c4.5 0 7 1.5 7 2.2s-2.5 2.2-7 2.2-7-1.5-7-2.2S7.5 4 12 4ZM5 9.1c1.7 1 4.2 1.5 7 1.5s5.3-.5 7-1.5V12c0 .7-2.5 2.2-7 2.2S5 12.7 5 12V9.1Zm0 5.8c1.7 1 4.2 1.5 7 1.5s5.3-.5 7-1.5v2.9c0 .7-2.5 2.2-7 2.2s-7-1.5-7-2.2v-2.9Z';

const JAVA =
  'M6 14.5h11v2.2a5.3 5.3 0 0 1-5.3 5.3h-.4A5.3 5.3 0 0 1 6 16.7v-2.2Zm11 .7h1.3a2.7 2.7 0 0 1 0 5.4h-2.1l1-1.7h1.1a1 1 0 0 0 0-2H17v-1.7ZM11.8 2c1.7 2-2 3.4-.3 5.8.8 1.2.8 2.2.2 3.5-.2-1.5-1.2-2.3-2.1-3.4C7.8 5.3 11.1 4 11.8 2Zm3.3 3.4c.9 1.3-1.1 2.2 0 3.7.5.7.4 1.3.1 2-.1-.8-.7-1.3-1.2-1.9-1-1.4.7-2.4 1.1-3.8Z';

export const editingApps = [
  { id: 'pr', name: 'Premiere Pro' },
  { id: 'ps', name: 'Photoshop' },
  { id: 'capcut', name: 'CapCut' },
  { id: 'figma', name: 'Figma' },
];

export const languages = [
  { id: 'html', name: 'HTML5', path: siHtml5.path, brand: `#${siHtml5.hex}` },
  { id: 'css', name: 'CSS3', path: siCss.path, brand: '#3F8CFF' },
  { id: 'js', name: 'JavaScript', path: siJavascript.path, brand: `#${siJavascript.hex}` },
  { id: 'java', name: 'Java', path: JAVA, brand: '#F5A623' },
  { id: 'react', name: 'React', path: siReact.path, brand: `#${siReact.hex}` },
  { id: 'php', name: 'PHP', path: siPhp.path, brand: '#A5B4F0' },
  { id: 'sql', name: 'SQL', path: DATABASE, brand: '#3DA9F5' },
  { id: 'cpp', name: 'C++', path: siCplusplus.path, brand: '#5B9BE0' },
];

export function AppTile({ id }) {
  if (id === 'pr') return <span className="tile tile--pr">Pr</span>;
  if (id === 'ps') return <span className="tile tile--ps">Ps</span>;
  if (id === 'capcut') {
    return (
      <span className="tile tile--capcut">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinejoin="round"
            d="M4.5 7A1.5 1.5 0 0 1 6 5.5h12A1.5 1.5 0 0 1 19.5 7v1.5l-15 7V17A1.5 1.5 0 0 0 6 18.5h12a1.5 1.5 0 0 0 1.500-1.500v-1.500l-15-7V7Z"
          />
        </svg>
      </span>
    );
  }
  return (
    <span className="tile tile--figma">
      <svg viewBox="0 0 38 57" aria-hidden="true">
        <path fill="#1ABCFE" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
        <path fill="#0ACF83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
        <path fill="#FF7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
        <path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
        <path fill="#A259FF" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
      </svg>
    </span>
  );
}

export function LanguageTile({ tech }) {
  return (
    <span className="tile tile--lang" style={{ '--brand': tech.brand }}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d={tech.path} />
      </svg>
    </span>
  );
}

export function Star({ size = 24, className = '' }) {
  return (
    <svg className={`star ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 0c.7 7.7 4.3 11.3 12 12-7.7.7-11.3 4.3-12 12-.7-7.7-4.3-11.3-12-12C7.7 11.3 11.3 7.7 12 0Z"
      />
    </svg>
  );
}

