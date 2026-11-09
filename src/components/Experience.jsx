import { useRef, useState } from 'react';
import { clients, resume } from '../content.js';
import { useSeen } from '../hooks.js';
import { FIRST_YEAR, SPAN, STOPS, YEARS, latestStopFor, nextStop, stateAt, stopFor, timelineClients, trackLayout } from '../timeline.js';
import { Bay, BayRow } from './Bays.jsx';
import { Star } from './Icons.jsx';

const FORMAT_YEARS = (c) => (c.from === c.to ? `${c.from}` : `${c.from} to ${c.to}`);
const SHORT_YEARS = (c) => (c.from === c.to ? `${c.from}` : `${c.from}–${String(c.to).slice(2)}`);
const AGENCIES = clients.filter((c) => c.roles);

function youtubeId(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{6,})/);
  return match ? match[1] : null;
}

function Sample({ client }) {
  const id = youtubeId(client.sample);
  if (id) {
    return (
      <iframe
        className="sample-media"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={`Video edited for ${client.name}`}
        allow="encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    );
  }
  return <video className="sample-media" src={client.sample} controls playsInline preload="metadata" />;
}

function AgencyBay({ agency, open, shut, onToggle, onShow }) {
  const points = resume.jobPoints[agency.id] ?? [];
  const onTimeline = Boolean(agency.from && agency.to);
  const facts = [
    agency.scope && { term: 'Work', detail: agency.scope },
    onTimeline && { term: 'Years', detail: FORMAT_YEARS(agency) },
  ].filter(Boolean);

  return (
    <Bay
      id={agency.id}
      name={agency.name}
      label={agency.work}
      open={open}
      shut={shut}
      onToggle={onToggle}
      cover={<div className="bay-cover bay-cover--clip" aria-hidden="true" />}
      face={
        <>
          <p className="bay-eyebrow">{agency.kind}</p>
          <p className="bay-name bay-name--agency">{agency.name}</p>
          <p className="bay-role">{agency.work}</p>
        </>
      }
    >
      <div className="ag">
        <div className="ag-lead">
          <p className="bay-eyebrow">{agency.kind}</p>
          <p className="bay-title" aria-hidden="true">
            {agency.name}
          </p>
          <ul className="ag-roles">
            {agency.roles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        </div>
        <div className="ag-more">
          {agency.sample && (
            <div className="ag-sample">
              <Sample client={agency} />
            </div>
          )}
          {facts.length > 0 && (
            <dl className="ag-facts">
              {facts.map((fact) => (
                <div key={fact.term}>
                  <dt>{fact.term}</dt>
                  <dd>{fact.detail}</dd>
                </div>
              ))}
            </dl>
          )}
          {agency.note && <p className="ag-note">{agency.note}</p>}
          {points.length > 0 && (
            <ul className="project-points">
              {points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          )}
          {(onTimeline || agency.link) && (
            <div className="ag-actions">
              {agency.link && (
                <a className="btn btn--small btn--primary" href={agency.link.url}>
                  {agency.link.label}
                </a>
              )}
              {onTimeline && (
                <button type="button" className="btn btn--small" onClick={() => onShow(agency)}>
                  Show on timeline
                </button>
              )}
            </div>
          )}
          {import.meta.env.DEV && points.length === 0 && <p className="ag-dev">Add results in resume.jobPoints in src/content.js.</p>}
          {import.meta.env.DEV && !onTimeline && <p className="ag-dev">Add from and to years in src/content.js to place this on the timeline.</p>}
        </div>
      </div>
    </Bay>
  );
}

export default function Experience() {
  const [p, setP] = useState(() => latestStopFor('ygcc')?.p ?? 0);
  const [timelineRef, seen] = useSeen(0.2);
  const rulerRef = useRef(null);
  const { year, client } = stateAt(p);

  const step = (direction) => setP(nextStop(p, direction).p);

  const showOnTimeline = (agency) => {
    setP(latestStopFor(agency.id).p);
    document.getElementById('timeline')?.scrollIntoView();
  };

  const scrubFrom = (event) => {
    const rect = rulerRef.current.getBoundingClientRect();
    const move = (clientX) => {
      const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      setP(ratio * SPAN);
    };
    move(event.clientX);
    const onMove = (e) => move(e.clientX);
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  const onHeadKey = (e) => {
    const keys = {
      ArrowRight: () => step(1),
      ArrowUp: () => step(1),
      ArrowLeft: () => step(-1),
      ArrowDown: () => step(-1),
      Home: () => setP(STOPS[0].p),
      End: () => setP(STOPS[STOPS.length - 1].p),
    };
    if (keys[e.key]) {
      e.preventDefault();
      keys[e.key]();
    }
  };

  return (
    <section id="experience" className="experience" aria-labelledby="experience-title">
      <div className="lead-head">
        <h2 id="experience-title" className="big-title">
          Experience
        </h2>
        <p className="lead-text">Senior editor and project manager for agencies, and video editor for companies and creators since {FIRST_YEAR}.</p>
      </div>

      <BayRow items={AGENCIES} label="Agency roles" className="bays--agencies">
        {(agency, state) => <AgencyBay key={agency.id} agency={agency} onShow={showOnTimeline} {...state} />}
      </BayRow>

      <div className="suite" id="timeline">
        <div className="suite-head">
          <h3 className="suite-title">Every client, by year</h3>
          <p className="suite-text">Each clip is a client or agency I have worked with. Drag the playhead across the years, or select a clip.</p>
        </div>

        <div ref={timelineRef} className={`tl${seen ? ' is-in' : ''}`} style={{ '--p': p / SPAN, '--span': SPAN, '--year': year - FIRST_YEAR }}>
          <div className="tl-ruler-row">
            <span className="tl-ruler-label">Year</span>
            <div className="tl-ruler" ref={rulerRef} onPointerDown={scrubFrom}>
              {YEARS.map((y) => (
                <span key={y} className={`tl-year${y === year ? ' is-current' : ''}`}>
                  {y}
                </span>
              ))}
            </div>
          </div>

          <div className="tl-tracks">
            {trackLayout.map((track) => (
              <div className="tl-track" key={track.id}>
                <p className="tl-label">
                  <span className="tl-tag">{track.tag}</span>
                  {track.name}
                </p>
                <div className="tl-lanes">
                  {track.lanes.map((lane, i) => (
                    <div className="tl-lane" key={i}>
                      {lane.map((c) => {
                        const live = c.from <= year && c.to >= year;
                        const current = c.id === client.id;
                        return (
                          <button
                            type="button"
                            key={c.id}
                            className={`clip clip--${c.track}${live ? ' is-live' : ''}${current ? ' is-current' : ''}`}
                            style={{
                              gridColumn: `${c.from - FIRST_YEAR + 1} / ${c.to - FIRST_YEAR + 2}`,
                              '--delay': `${(c.from - FIRST_YEAR) * 120 + i * 40}ms`,
                            }}
                            aria-label={`${c.name}. ${c.work}. ${FORMAT_YEARS(c)}.`}
                            aria-current={current ? 'true' : undefined}
                            onClick={() => setP(stopFor(c, year).p)}
                          >
                            <span className="clip-name">{c.name}</span>
                            <span className="clip-work">{c.work}</span>
                            <span className="clip-years">{SHORT_YEARS(c)}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="tl-head">
            <span className="tl-head-line" aria-hidden="true" />
            <div
              className="tl-head-grip"
              role="slider"
              tabIndex={0}
              aria-label="Timeline playhead"
              aria-valuemin={0}
              aria-valuemax={STOPS.length - 1}
              aria-valuenow={Math.max(
                STOPS.findIndex((s) => s.year === year && s.client.id === client.id),
                0,
              )}
              aria-valuetext={`${year}, ${client.name}`}
              onPointerDown={(e) => {
                e.stopPropagation();
                scrubFrom(e);
              }}
              onKeyDown={onHeadKey}
            >
              <Star size={22} />
            </div>
          </div>
        </div>
        <p className="tl-note">{timelineClients.length} clients and agencies. Dates are shown by year.</p>
      </div>
    </section>
  );
}
