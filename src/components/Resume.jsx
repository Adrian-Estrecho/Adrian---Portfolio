import { clients, profile, projects, resume } from '../content.js';
import { editingApps, languages } from './Icons.jsx';

const RESUME_PDF = '/Adrian-Estrecho-Resume.pdf';

// Hiring software reads this page's text in order, so everything stays in one
// column of plain text: no tables, icons, or images, and links show their address.
const yearRange = (from, to) => {
  if (!from) return '';
  return from === to ? `${from}` : `${from} - ${to}`;
};
// Roles without years yet are listed first, since they are the newest.
const newestFirst = (a, b) => (b.to ?? 9999) - (a.to ?? 9999) || (b.from ?? 9999) - (a.from ?? 9999);

const companyJobs = clients
  .filter((c) => c.track === 'company')
  .map((c) => ({
    id: c.id,
    title: `${c.work}, ${c.name}`,
    from: c.from,
    to: c.to,
    points: resume.jobPoints[c.id] ?? [],
  }));

const freelanceClients = clients.filter((c) => c.track !== 'company').sort(newestFirst);

const freelanceJob = {
  id: 'freelance',
  title: 'Freelance video editor',
  from: Math.min(...freelanceClients.map((c) => c.from)),
  to: Math.max(...freelanceClients.map((c) => c.to)),
  points: freelanceClients.map((c) => {
    const kind = c.kind === 'Client' ? '' : ` (${c.kind})`;
    return `${c.name}${kind}: ${c.work}, ${yearRange(c.from, c.to)}`;
  }),
};

const jobs = [...companyJobs, freelanceJob].sort(newestFirst);

const contactLine = [profile.phoneDisplay, profile.email, resume.location, resume.website].filter(Boolean);

function Section({ title, children }) {
  return (
    <section className="r-section">
      <h2 className="r-heading">{title}</h2>
      {children}
    </section>
  );
}

function Entry({ title, meta, children }) {
  return (
    <div className="r-entry">
      <div className="r-entry-head">
        <h3 className="r-entry-title">{title}</h3>
        {meta && <p className="r-entry-meta">{meta}</p>}
      </div>
      {children}
    </div>
  );
}

function Points({ items }) {
  if (items.length === 0) return null;
  return (
    <ul className="r-points">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function Resume() {
  const missing = [
    !profile.email && 'work email',
    !resume.location && 'location',
    !resume.website && 'portfolio address',
    resume.education.length === 0 && 'education',
    resume.education.some((item) => !item.school || !item.years) && 'school name and years',
    companyJobs.some((job) => job.points.length === 0) && 'job results',
    projects.some((p) => !p.role) && 'your role on each project',
  ].filter(Boolean);

  return (
    <>
      <nav className="r-toolbar" aria-label="Resume actions">
        <a className="r-action" href="/">
          Back to portfolio
        </a>
        <a className="r-action r-action--main" href={RESUME_PDF} download>
          Download PDF
        </a>
      </nav>

      {import.meta.env.DEV && missing.length > 0 && (
        <p className="r-note">Still missing: {missing.join(', ')}. Add these in src/content.js. This note is hidden on the live site and in the PDF.</p>
      )}

      <main className="r-sheet">
        <header className="r-header">
          <h1 className="r-name">{profile.name}</h1>
          <p className="r-headline">{resume.headline}</p>
          <p className="r-contact">{contactLine.join(' | ')}</p>
        </header>

        <Section title="Summary">
          <p>{resume.summary}</p>
        </Section>

        <Section title="Experience">
          {jobs.map((job) => (
            <Entry key={job.id} title={job.title} meta={yearRange(job.from, job.to)}>
              <Points items={job.points} />
            </Entry>
          ))}
        </Section>

        <Section title="Projects">
          {projects.map((project) => (
            <Entry key={project.id} title={`${project.name}: ${project.type}`} meta={project.school && 'School project'}>
              {project.role && <p>Role: {project.role}</p>}
              <Points items={project.points} />
              <p>Built with: {project.stack.join(', ')}</p>
              {project.links.map((link) => (
                <p key={link.url}>{link.url}</p>
              ))}
            </Entry>
          ))}
        </Section>

        <Section title="Skills">
          <p>Video and design: {editingApps.map((a) => a.name).join(', ')}</p>
          <p>Web and programming: {languages.map((l) => l.name).join(', ')}</p>
        </Section>

        {resume.education.length > 0 && (
          <Section title="Education">
            {resume.education.map((item) => (
              <Entry key={item.degree} title={[item.degree, item.school].filter(Boolean).join(', ')} meta={item.years} />
            ))}
          </Section>
        )}
      </main>
    </>
  );
}
