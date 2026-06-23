import { Link } from 'react-router-dom'
import { useMeta } from '../useMeta'

const principles = [
  {
    n: '01',
    title: 'Text first',
    body: 'The readable text of a Studio Document must be accessible without proprietary software. Process and context are additive, never obstructive.',
  },
  {
    n: '02',
    title: 'Portable by default',
    body: 'Studio Documents are files, not database records. They can be copied, archived, and opened on any system. The file is the document.',
  },
  {
    n: '03',
    title: 'Process is not metadata',
    body: 'Revision history, session data, and authorship signals are first-class citizens — not afterthoughts in a document header.',
  },
  {
    n: '04',
    title: 'Open and unencumbered',
    body: 'No licence fee, no certification, no governing body. Implementations may adopt the standard freely and completely.',
  },
  {
    n: '05',
    title: 'Layered, not monolithic',
    body: 'A tool need not implement every layer to be a Writing Studio. It must implement the layers it claims.',
  },
  {
    n: '06',
    title: 'Human-interpretable',
    body: 'A Studio Document should be legible to a careful reader even if all tooling disappears. Structure follows meaning.',
  },
]

const defined = [
  { term: 'Writing Studio',  def: 'Software that creates Studio Documents, implementing at least the Content layer.' },
  { term: 'Studio Document', def: 'A file conforming to the Writing Studio Standard, containing content and at least one additional layer.' },
  { term: 'Studio Text',     def: 'A Studio Document in text-first format (.studio.txt). Always human-readable. The canonical source.' },
  { term: 'Studio PDF',      def: 'A Studio Document rendered as a portable document (.studio.pdf), with embedded provenance and metadata.' },
  { term: 'Studio JSON',     def: 'An optional machine-readable companion (.studio.json) for tooling and indexing.' },
]

export default function Standard() {
  useMeta({
    title: 'The Standard',
    description: 'The Writing Studio Standard defines Writing Studios, Studio Documents, and six guiding principles for process-aware creative writing tools with seven composable layers.',
    path: '/standard',
  })
  return (
    <main>
      <div className="container">
        <div className="page-hero">
          <p className="page-hero__kicker">Specification</p>
          <h1 className="page-hero__title">Writing Studio Standard</h1>
          <p className="page-hero__lead">
            A definition of what it means for software to be a Writing Studio,
            and what a Studio Document must contain.
          </p>
        </div>
      </div>

      <section>
        <div className="container container--narrow">
          <p className="section-label">Introduction</p>
          <h2>What this standard defines</h2>
          <hr className="divider" />
          <p>
            The Writing Studio Standard is not a file format. It is a layered
            model that defines what a writing studio is, what it produces, and
            what a conformant document must contain.
          </p>
          <p>
            A <strong>text editor</strong> stores text.{' '}
            A <strong>word processor</strong> stores formatted documents.{' '}
            A <strong>writing studio</strong> stores text plus process, context,
            provenance, layout, images, and the creative environment in which
            the work was made.
          </p>
          <p>
            The standard defines the layers that compose a Studio Document
            and the minimum conformance requirements for each. It does not
            prescribe encoding choices, implementation details, or user
            interface decisions.
          </p>
        </div>
      </section>

      <section>
        <div className="container container--narrow">
          <p className="section-label">Definitions</p>
          <h2>Primary terms</h2>
          <hr className="divider" />
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {defined.map(d => (
              <div key={d.term} className="card">
                <p className="card__label">{d.term}</p>
                <p className="card__body">{d.def}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container container--narrow">
          <p className="section-label">Principles</p>
          <h2>Six guiding principles</h2>
          <hr className="divider" />
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {principles.map(p => (
              <div key={p.n} style={{ display: 'grid', gridTemplateColumns: '3rem 1fr', gap: '0 1.25rem', alignItems: 'start' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--teal-light)', paddingTop: '0.15em' }}>{p.n}</span>
                <div>
                  <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1rem', color: 'var(--charcoal)', marginBottom: '0.35rem', maxWidth: 'none' }}>
                    {p.title}
                  </p>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--slate)', maxWidth: '56ch' }}>{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container container--narrow">
          <p className="section-label">Conformance</p>
          <h2>What conformance means</h2>
          <hr className="divider" />
          <p>
            A <strong>conformant Writing Studio</strong> creates Studio Documents
            implementing at least the Content layer and one additional layer.
          </p>
          <p>
            A <strong>conformant Studio Document</strong> carries readable text,
            at least one additional layer, and is named according to the
            <code className="tag" style={{ margin: '0 0.35em' }}>.studio.*</code>
            convention.
          </p>
          <p>
            Conformance is self-declared. There is no authority that certifies
            implementations.
          </p>
          <div className="btn-group">
            <Link to="/architecture" className="btn btn--outline">Layer model</Link>
            <Link to="/documents" className="btn btn--outline">Studio Documents</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
