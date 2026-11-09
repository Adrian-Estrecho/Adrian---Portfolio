import { useState } from 'react';
import { projects } from '../content.js';
import { Bay, BayRow } from './Bays.jsx';

function ProductMap({ project }) {
  return (
    <div className="pmap" role="img" aria-label={`Diagram of ${project.name} areas: ${project.map.join(', ')}.`}>
      <p className="pmap-title">Inside a {project.name} workspace</p>
      <div className="pmap-grid">
        {project.map.map((item) => (
          <span className="pmap-cell" key={item}>
            {item}
          </span>
        ))}
      </div>
      <p className="pmap-chain">Client → Project → Task → Subtask</p>
    </div>
  );
}

// The cover plays like a clip in an editor's bin: moving the mouse across it scrubs through its frames.
function Cover({ project, frame }) {
  return (
    <div className="bay-cover" aria-hidden="true">
      {project.images.length > 0 ? (
        project.images.map((img, i) => (
          <img
            key={img.src}
            className={i === frame ? 'is-current' : undefined}
            style={{ objectPosition: img.focus, transformOrigin: img.focus, scale: img.zoom }}
            src={img.src}
            alt=""
            loading="lazy"
            width="1440"
            height="900"
          />
        ))
      ) : (
        <div className="cover-map">
          {project.map.map((item, i) => (
            <span key={item} className={`cover-cell${i === frame ? ' is-current' : ''}`}>
              {item}
            </span>
          ))}
        </div>
      )}
      <span className="bay-scrub" />
    </div>
  );
}

function ProjectBay({ project, open, shut, onToggle }) {
  const [frame, setFrame] = useState(0);
  const frames = project.images.length || project.map.length;
  const image = project.images[frame];
  const closed = !open && !shut;

  const scrub = (event) => {
    if (event.pointerType !== 'mouse' || !closed) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 0.999);
    event.currentTarget.closest('.bay').style.setProperty('--scrub', ratio);
    setFrame(Math.floor(ratio * frames));
  };

  return (
    <Bay
      id={project.id}
      name={project.name}
      label={project.type}
      open={open}
      shut={shut}
      onToggle={onToggle}
      onPointerMove={scrub}
      onPointerLeave={() => closed && setFrame(0)}
      cover={<Cover project={project} frame={frame} />}
      face={
        <>
          <p className="bay-eyebrow">{project.type}</p>
          <p className="bay-name">{project.name}</p>
        </>
      }
    >
      <div className="pj">
        <div className="pj-body">
          <p className="bay-eyebrow">{project.type}</p>
          <p className="bay-title" aria-hidden="true">
            {project.name}
          </p>
          <p className="project-summary">{project.summary}</p>
          <ul className="project-points">
            {project.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <ul className="project-stack" aria-label="Built with">
            {project.stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </div>
        <div className="pj-media">
          {image ? (
            <div className="pj-screen">
              <img key={image.src} style={{ objectPosition: image.focus }} src={image.src} alt={image.alt} loading="lazy" width="1440" height="900" />
            </div>
          ) : (
            <ProductMap project={project} />
          )}
          {(project.images.length > 1 || project.links.length > 0) && (
            <div className="pj-bar">
              {project.images.length > 1 && (
                <div className="project-tabs" role="group" aria-label={`${project.name} screens`}>
                  {project.images.map((img, i) => (
                    <button
                      type="button"
                      key={img.src}
                      className={`project-tab${i === frame ? ' is-current' : ''}`}
                      aria-pressed={i === frame}
                      onClick={() => setFrame(i)}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              )}
              {project.links.map((link) => (
                <a className="btn btn--small btn--primary" key={link.url} href={link.url} target="_blank" rel="noreferrer">
                  {link.label}
                  <span aria-hidden="true"> ↗</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </Bay>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="projects" aria-labelledby="projects-title">
      <div className="lead-head">
        <h2 id="projects-title" className="big-title">
          Projects
        </h2>
        <p className="lead-text">Web applications with real accounts and databases. Select one to open it.</p>
      </div>
      <BayRow items={projects} label="Projects" className="bays--projects">
        {(project, state) => <ProjectBay key={project.id} project={project} {...state} />}
      </BayRow>
    </section>
  );
}
