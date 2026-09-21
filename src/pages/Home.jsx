import { Link } from 'react-router-dom'
import './Home.css'

const capabilities = [
  { label: 'Write', title: 'A document remains a document', body: 'Rich text, mathematics, tables, images, notes, layout settings and a readable plain-text representation travel together. The writing stays accessible when the original app is gone.' },
  { label: 'Ground', title: 'Sources stay connected to claims', body: 'A Studio can carry CSL/BibTeX metadata, pinpoint citations, highlights and an optional frozen copy of a source. PDFs, EPUBs, Markdown, webpages and other material remain evidence rather than loose browser tabs.' },
  { label: 'Remember', title: 'Context is portable', body: 'Emails, reader sessions, media, readalongs and other modules can stay associated with the central Studio. They keep stable identities instead of becoming disposable copies of the same work.' },
]

const layers = [
  ['Readable record', 'A summary and plain-text representation near the top of the file.'],
  ['Structured document', 'The editable rich-text model, metadata and view settings.'],
  ['Sources and attachments', 'Citations, source metadata, page pinpoints and portable attachments.'],
  ['History and proof', 'Snapshots, signed receipt chains and optional public timestamps.'],
]

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container hero__inner">
          <p className="section-label">Writing Studio Standard</p>
          <h1 className="hero__title">Documents that carry<br /><em>the work around them.</em></h1>
          <p className="hero__lead">
            An open format for writing that keeps prose, sources, useful context and optional proof in a
            portable <code className="tag">.studio</code> document. It is designed for serious work that
            should outlast one app, one device, or one company.
          </p>
          <div className="btn-group">
            <Link to="/standard" className="btn btn--primary">Read the standard</Link>
            <Link to="/architecture" className="btn btn--outline">Explore the file</Link>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <p className="section-label">More than a word processor</p>
          <h2>A place for the writing and its working life</h2>
          <div className="trio-grid">
            {capabilities.map(({ label, title, body }, index) => (
              <article className={'trio-card' + (index === 2 ? ' trio-card--highlight' : '')} key={label}>
                <span className="trio-card__stores">{label}</span>
                <h3>{title}</h3>
                <p className="card__body">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <p className="section-label">The Studio Document</p>
          <h2>One portable record: <code className="tag">.studio</code></h2>
          <div className="home-doc-grid">
            <div>
              <p>
                A Studio Document is a structured JSON record with a human-readable summary and a clean,
                plain-text copy of the work near its beginning. The editor uses the structured model; a
                person opening the file can still find and read the writing without proprietary software.
              </p>
              <p style={{ marginTop: '1rem' }}>
                The same record can travel with its cited library, selected attachments, snapshots and
                verification material. Large master files and generated audio can remain in the writer’s
                own library, while each Studio carries the frozen subset it needs to stay meaningful.
              </p>
              <div className="btn-group" style={{ marginTop: '1.5rem' }}>
                <Link to="/examples" className="btn btn--outline">See an annotated record</Link>
              </div>
            </div>
            <aside className="card">
              <p className="card__label">A Studio may carry</p>
              <ul className="checklist">
                <li>The readable text and editable document model</li>
                <li>References, citation metadata and source pinpoints</li>
                <li>Emails, media, reader and readalong associations</li>
                <li>Snapshots and signed provenance receipts</li>
                <li>Optional timestamp proofs and portable exports</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <p className="section-label">A composable record</p>
          <h2>Clear layers, explicit claims</h2>
          <p style={{ marginTop: '0.75rem' }}>
            A reader should be able to see what a file contains and what an implementation is actually
            claiming. Plain text and document structure are the foundation; sources, voice editions,
            history and cryptographic proof are independent capabilities.
          </p>
          <div className="layer-stack">
            {layers.map(([name, desc]) => (
              <div className="layer-card" key={name}>
                <div className="layer-card__name">{name}</div>
                <p className="layer-card__desc">{desc}</p>
              </div>
            ))}
          </div>
          <div className="btn-group" style={{ marginTop: '1.75rem' }}>
            <Link to="/architecture" className="btn btn--outline">Full architecture</Link>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <p className="section-label">Privacy and provenance</p>
          <h2>Evidence without a surveillance product</h2>
          <div className="trio-grid" style={{ marginTop: '1.75rem' }}>
            <div className="card"><p className="card__label">Snapshots, not keylogs</p><p className="card__body">A writer can keep a grow-only history of document states and changes without handing over their text or a log of every keystroke.</p></div>
            <div className="card"><p className="card__label">Signed, hash-only receipts</p><p className="card__body">Inkwave’s existing provenance chain signs cryptographic hashes. The signing service need not receive the document or the writer’s identity.</p></div>
            <div className="card"><p className="card__label">Honest verification</p><p className="card__body">A valid record can show that a particular state existed and that a chain is intact. It must never be presented as proof that a biological human conceived every word.</p></div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner">
          <p className="section-label">Open by design</p>
          <h2>Build on the record, not a silo.</h2>
          <p>The format is published under CC BY 4.0. Inkwave is one implementation; any compatible reader or editor can take part.</p>
          <div className="btn-group">
            <Link to="/standard" className="btn btn--primary">The Writing Studio Standard</Link>
            <Link to="/faq" className="btn btn--outline">Common questions</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
