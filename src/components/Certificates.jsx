import { certificates } from '../content.js';

// Empty slots appear only on the local dev server, so the live site never shows blanks.
export const showCertificates = certificates.length > 0 || import.meta.env.DEV;

export default function Certificates() {
  return (
    <section id="certificates" className="certificates" aria-labelledby="certificates-title">
      <div className="section-head">
        <h2 id="certificates-title" className="section-title">
          Certificates
        </h2>
      </div>
      {certificates.length > 0 ? (
        <ul className="cert-grid">
          {certificates.map((cert) => {
            const body = (
              <>
                {cert.image && <img src={cert.image} alt="" loading="lazy" />}
                <span className="cert-title">{cert.title}</span>
                <span className="cert-meta">
                  {cert.issuer}
                  {cert.year ? `, ${cert.year}` : ''}
                </span>
              </>
            );
            return (
              <li key={cert.title} className="cert">
                {cert.url ? (
                  <a href={cert.url} target="_blank" rel="noreferrer">
                    {body}
                  </a>
                ) : (
                  body
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="cert-grid">
          {[1, 2, 3].map((slot) => (
            <li key={slot} className="cert cert--slot">
              <span className="cert-title">Certificate slot</span>
              <span className="cert-meta">Add to src/content.js. This slot is hidden on the live site.</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
