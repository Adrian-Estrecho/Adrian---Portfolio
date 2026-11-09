import { useEffect, useState } from 'react';
import { profile } from '../content.js';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.phone);
      setCopied(true);
    } catch {
      window.location.href = `tel:${profile.phone}`;
    }
  };

  return (
    <section id="contact" className="panel contact" aria-labelledby="contact-title">
      <h2 id="contact-title" className="contact-title">
        Send me the footage or the brief.
      </h2>
      <p className="contact-text">Tell me the format, length, and deadline, or describe the site you need built.</p>
      <div className="contact-row">
        <a className="contact-phone" href={`tel:${profile.phone}`}>
          {profile.phoneDisplay}
        </a>
        <button type="button" className="btn btn--small" onClick={copy}>
          {copied ? 'Copied' : 'Copy number'}
        </button>
        <a className="btn btn--small" href="/resume.html">
          See my resume
        </a>
        <span className="sr-only" role="status">
          {copied ? 'Phone number copied' : ''}
        </span>
      </div>
      {profile.email && (
        <a className="contact-email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      )}
      {!profile.email && import.meta.env.DEV && (
        <p className="dev-note">Add your email and social links to src/content.js. This note is hidden on the live site.</p>
      )}
      {profile.socials.length > 0 && (
        <ul className="contact-socials">
          {profile.socials.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
