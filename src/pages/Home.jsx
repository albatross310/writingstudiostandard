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
          <h1 className="hero__title">Portable documents for writing, sources and provenance</h1>
          <p className="hero__lead">
            An open format that keeps readable text, editable structure, sources, working context and
            optional verification evidence in a portable <code className="tag">.studio</code> record.
          </p>
          <div className="btn-group">
            <Link to="/standard" className="btn btn--primary">Read the standard</Link>
            <Link to="/architecture" className="btn btn--outline">Explore the file</Link>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <p className="section-label">Scope</p>
          <h2>Writing, evidence and working context</h2>
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
          <p className="section-label">Storage contract</p>
          <h2>Two durable copies per use. No hidden third library.</h2>
          <p style={{ marginTop: '0.75rem' }}>
            When a source is used in a Studio, it has two durable roles: the reusable master the writer
            owns, and the frozen subset that lets that one Studio travel and verify itself. Inkwave never
            creates a separate proprietary master behind either of them.
          </p>
          <div className="trio-grid">
            <article className="card">
              <p className="card__label">1 · Master library</p>
              <p className="card__body">The original lives in a folder, OneDrive, Google Drive or another provider the writer chooses. It has one stable ID, revision hash and library category.</p>
            </article>
            <article className="card">
              <p className="card__label">2 · Studio attachment</p>
              <p className="card__body">A Studio carries the exact source, excerpt or metadata it uses. That copy is frozen: a later master edit cannot quietly change an existing citation, quotation or recording.</p>
            </article>
            <article className="card">
              <p className="card__label">Cache is not a third tier</p>
              <p className="card__body">Thumbnails, search indexes, waveforms and downloaded payloads on the device are disposable SSD caches. Clearing them never deletes a master item or Studio attachment.</p>
            </article>
          </div>
          <p style={{ marginTop: '1rem', color: 'var(--slate)' }}>
            Reusing the same source in several Studios creates one intentional frozen attachment in each
            Studio that uses it. Attaching it twice to the same Studio reuses its existing attachment.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <p className="section-label">Open fast</p>
          <h2>The writing first; large material on demand.</h2>
          <div className="home-doc-grid">
            <div>
              <p>
                Inkwave opens the compact document core first: its title, readable text, editable document
                tree and attachment manifest. Parsing happens away from the main interface, and opening a
                document does not wait for a cloud library, a PDF, an audiobook or a media file.
              </p>
              <p style={{ marginTop: '1rem' }}>
                The target is that an Inkwave document becomes usable no slower than its writing equivalent
                in Markdown. The reader, player and source panels request the larger bytes only when the
                writer opens them.
              </p>
            </div>
            <aside className="card">
              <p className="card__label">Lazy payload path</p>
              <ul className="checklist">
                <li>Reveal the writing and its compact manifest</li>
                <li>Restore library metadata after the first frame</li>
                <li>Fetch or read a source only when its module opens</li>
                <li>Keep downloaded bytes as an evictable SSD cache</li>
              </ul>
            </aside>
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
              <div className="btn-group">
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
          <div className="btn-group">
            <Link to="/architecture" className="btn btn--outline">Full architecture</Link>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <p className="section-label">Privacy and provenance</p>
          <h2>Evidence without a surveillance product</h2>
          <div className="trio-grid">
            <div className="card"><p className="card__label">Snapshots, not keylogs</p><p className="card__body">A writer can keep a grow-only history of document states and changes without handing over their text or a log of every keystroke.</p></div>
            <div className="card"><p className="card__label">Signed, hash-only receipts</p><p className="card__body">Inkwave’s existing provenance chain signs cryptographic hashes. The signing service need not receive the document or the writer’s identity.</p></div>
            <div className="card"><p className="card__label">Honest verification</p><p className="card__body">A valid record can show that a particular state existed and that a chain is intact. It must never be presented as proof that a biological human conceived every word.</p></div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner">
          <p className="section-label">Open by design</p>
          <h2>Open format and independent implementations</h2>
          <p>The format is published under CC BY 4.0. Inkwave is one implementation; compatible readers and editors can implement the same document contract.</p>
          <div className="btn-group">
            <Link to="/standard" className="btn btn--primary">The Writing Studio Standard</Link>
            <Link to="/faq" className="btn btn--outline">Common questions</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
