import { Link } from 'react-router-dom'
import { useMeta } from '../useMeta'

export default function Documents() {
  useMeta({
    title: 'Studio Documents',
    description: 'A Studio Document carries text, images, revision history, authorship signals, and export metadata — a portable record of writing in context.',
    path: '/documents',
  })
  return (
    <main>
      <div className="container">
        <div className="page-hero">
          <p className="page-hero__kicker">Studio Documents</p>
          <h1 className="page-hero__title">What a Studio Document contains</h1>
          <p className="page-hero__lead">
            A Studio Document holds content and the conditions of its making —
            text, creative environment, and a record of how it was produced.
          </p>
        </div>
      </div>

      <section>
        <div className="container container--narrow">
          <p className="section-label">The model</p>
          <h2>Text plus its world</h2>
          <hr className="divider" />
          <p>
            Ordinary documents carry content. A Studio Document carries content
            and the conditions of its making: the session in which paragraphs
            were written, the layout in which they were arranged, the tile artwork
            chosen to accompany them, and the record of authorship.
          </p>
          <p>
            A writing studio is a studio — a place for drafting and artwork
            together. The Studio Document format reflects that: prose and
            mnemonic tile artwork live in the same file, not as attachments
            but as first-class content.
          </p>
          <p>
            The goal is a document that remains interpretable across time and
            tools, without requiring the original software.
          </p>
        </div>
      </section>

      <section>
        <div className="container container--narrow">
          <p className="section-label">Contents</p>
          <h2>What a Studio Document may contain</h2>
          <hr className="divider" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1.75rem' }}>
            {[
              { title: 'Readable text',             desc: 'The primary content, always accessible without tooling.' },
              { title: 'Formatting',                desc: 'Emphasis, lists, tables, inline code, and block-level styles.' },
              { title: 'Images and tile artwork',   desc: 'Visual and mnemonic elements that belong to the document, not external attachments.' },
              { title: 'Layout hints',              desc: 'Compositional intent: columns, emphasis, spatial arrangement.' },
              { title: 'Revision history',          desc: 'Named checkpoints and significant states in the document\'s evolution.' },
              { title: 'Authorship signals',        desc: 'Attribution, session markers, and provenance records.' },
              { title: 'Keylog data',               desc: 'Keystroke-level session data, typically stored encrypted.' },
              { title: 'Export metadata',           desc: 'Information for rendering targets: page size, style, output intent.' },
            ].map(item => (
              <div className="card" key={item.title}>
                <p className="card__label">{item.title}</p>
                <p className="card__body">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container container--narrow">
          <p className="section-label">Formats</p>
          <h2>Two Studio Document formats</h2>
          <hr className="divider" />
          <p>
            Studio Documents exist in two forms. The <code className="tag">.studio</code> segment
            in the filename signals the format without requiring a registry or MIME lookup.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>

            <div className="card">
              <p className="card__label">Source format</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--charcoal)', fontWeight: 600, marginBottom: '0.5rem' }}>
                <code className="tag">.studio.txt</code>
                <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, marginLeft: '0.75rem', color: 'var(--charcoal)' }}>Studio Text</span>
              </p>
              <p className="card__body" style={{ marginBottom: '0.75rem' }}>
                Human-readable prose at the top. Structured JSON in the lower half of the same
                file — carrying process data, provenance, object references, and layer metadata.
                The text is always readable without tooling; the JSON is there for software
                that knows to look.
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--teal)', fontStyle: 'italic', maxWidth: 'none' }}>
                The canonical source. If Studio Text and any export conflict, Studio Text is authoritative.
              </p>
            </div>

            <div className="card">
              <p className="card__label">Rendered export</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--charcoal)', fontWeight: 600, marginBottom: '0.5rem' }}>
                <code className="tag">.studio.pdf</code>
                <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, marginLeft: '0.75rem', color: 'var(--charcoal)' }}>Studio PDF</span>
              </p>
              <p className="card__body" style={{ marginBottom: '0.75rem' }}>
                A standard PDF for reading, submission, or archiving — with the source
                Studio Text embedded as an attachment. The attachment makes the PDF
                self-contained: the rendered view and the full source travel together.
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--teal)', fontStyle: 'italic', maxWidth: 'none' }}>
                Intended for distribution. The embedded attachment preserves editability.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section>
        <div className="container container--narrow">
          <p className="section-label">Open licence</p>
          <h2>Licensing the format</h2>
          <hr className="divider" />
          <p>
            The Writing Studio Standard is released under the{' '}
            <strong>Creative Commons CC0 1.0 Universal</strong> public domain dedication.
            The specification, its terms, layer definitions, and file format conventions
            are placed in the public domain — no permission needed, no attribution
            required, no restrictions on use.
          </p>
          <p>
            Implementations — software that creates or reads Studio Documents — are
            governed by their own licences. The standard itself carries none.
          </p>
          <p>
            Anyone may implement, extend, publish, or build upon the Writing Studio
            Standard for any purpose, commercial or otherwise, without restriction.
          </p>
          <div className="btn-group">
            <Link to="/examples" className="btn btn--outline">See file examples</Link>
            <Link to="/architecture" className="btn btn--outline">Architecture model</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
