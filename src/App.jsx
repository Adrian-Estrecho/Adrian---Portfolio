import Certificates, { showCertificates } from './components/Certificates.jsx';
import Contact from './components/Contact.jsx';
import Experience from './components/Experience.jsx';
import Hero from './components/Hero.jsx';
import Nav from './components/Nav.jsx';
import Projects from './components/Projects.jsx';
import { profile } from './content.js';
import { useActiveSection } from './hooks.js';

const SECTIONS = [
  { id: 'profile', label: 'Profile' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  ...(showCertificates ? [{ id: 'certificates', label: 'Certificates' }] : []),
  { id: 'contact', label: 'Contact' },
];

const SECTION_IDS = SECTIONS.map((s) => s.id);

export default function App() {
  const active = useActiveSection(SECTION_IDS);
  const go = (id) => document.getElementById(id)?.scrollIntoView();

  return (
    <>
      <a className="skip" href="#projects">
        Skip to projects
      </a>
      <Nav sections={SECTIONS} active={active} onGo={go} />
      <Hero onGo={go} />
      <main className="page">
        <Projects />
        <Experience />
        {showCertificates && <Certificates />}
        <Contact />
        <footer className="footer">
          {profile.name}, {new Date().getFullYear()}
        </footer>
      </main>
    </>
  );
}
