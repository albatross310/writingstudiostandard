import { Link } from 'react-router-dom'
import './Home.css'

const layers = [
  { name: 'Content layer',     desc: 'Plain text, paragraphs, headings, and semantic blocks.' },
  { name: 'Formatting layer',  desc: 'Bold, italic, lists, tables, inline code, and block quotes.' },
  { name: 'Object layer',      desc: 'Images and embedded media.' },
  { name: 'Tiles layer',       desc: '2028 mnemonic art tiles (26² × 3) linked to words and phrases.' },
  { name: 'Process layer',     desc: 'Writing sessions, revisions, and encrypted keylog data.' },
  { name: 'Provenance layer',  desc: 'Author metadata, encrypted provenance snapshots, encrypted keylog metadata.' },
  { name: 'Portability layer', desc: 'Package manifest — source plus exported artefacts.' },
]

const contents = [
  'Readable text',
  'Formatting and structure',
  'Images and media',
  'Mnemonic tile artwork',
  'Writing session data',
  'Revision history',
  'Authorship and provenance',
  'Encrypted keylog data',
]

export default function Home() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container hero__inner">
          <p className="section-label">Writing Studio Standard</p>
          <h1 className="hero__title">
            Documents that remember<br />
            <em>how they were made.</em>
          </h1>
          <p className="hero__lead">
            An open standard defining what a Writing Studio is and what a Studio Document contains.
          </p>
          <div className="btn-group">
            <Link to="/standard" className="btn btn--primary">Read the standard</Link>
            <Link to="/examples" className="btn btn--outline">See examples</Link>
          </div>
        </div>
      </section>

      {/* ── Definitions ──────────────────────────────────────────── */}
      <section>
        <div className="container">
          <h2>Three kinds of writing software</h2>
          <div className="trio-grid">
            <div className="trio-card">
              <span className="trio-card__stores">stores text</span>
              <h3>Text Editor</h3>
              <p className="card__body">
                Plain, portable, unadorned. No memory of how the words arrived.
              </p>
            </div>
            <div className="trio-card">
              <span className="trio-card__stores">stores formatted documents</span>
              <h3>Word Processor</h3>
              <p className="card__body">
                Adds typefaces, margins, and styles. Records appearance, not process.
              </p>
            </div>
            <div className="trio-card trio-card--highlight">
              <span className="trio-card__stores">stores text + process + context</span>
              <h3>Writing Studio</h3>
              <p className="card__body">
                Stores the document and the environment around it — sessions,
                layout, images, provenance. Software that creates Studio Documents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Studio Document ──────────────────────────────────────── */}
      <section>
        <div className="container">
          <p className="section-label">The Studio Document</p>
          <h2>A portable record of writing in context</h2>
          <div className="home-doc-grid">
            <div>
              <p>
                A <strong>Studio Document</strong> carries text and the conditions
                of its making: sessions, layout, images, and authorship records.
                It is a file — it opens anywhere, archives safely, and needs no
                special software to read.
              </p>
              <div className="btn-group" style={{ marginTop: '1.5rem' }}>
                <Link to="/documents" className="btn btn--outline">About Studio Documents</Link>
              </div>
            </div>
            <div className="card">
              <p className="card__label">A Studio Document may contain</p>
              <ul className="checklist">
                {contents.map(c => <li key={c}>{c}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Architecture ─────────────────────────────────────────── */}
      <section>
        <div className="container">
          <p className="section-label">Architecture</p>
          <h2>Seven layers</h2>
          <p style={{ marginTop: '0.75rem' }}>
            Each layer is optional except Content. Implementations adopt the layers they claim.
          </p>
          <div className="layer-stack">
            {layers.map((l, i) => (
              <div className="layer-card" key={l.name} style={{
                borderLeftColor: `hsl(${163 + i * 4}, ${35 - i * 2}%, ${52 - i * 2}%)`
              }}>
                <div className="layer-card__name">{l.name}</div>
                <p className="layer-card__desc">{l.desc}</p>
              </div>
            ))}
          </div>
          <div className="btn-group" style={{ marginTop: '1.75rem' }}>
            <Link to="/architecture" className="btn btn--outline">Full architecture</Link>
          </div>
        </div>
      </section>

      {/* ── File formats ─────────────────────────────────────────── */}
      <section>
        <div className="container">
          <p className="section-label">File formats</p>
          <h2>Portable by design</h2>
          <div className="trio-grid" style={{ marginTop: '1.75rem' }}>
            <div className="card">
              <p className="card__label">Studio Text</p>
              <p className="card__title"><code className="tag">essay.studio.txt</code></p>
              <p className="card__body">Human-readable in any environment. The canonical source format.</p>
            </div>
            <div className="card">
              <p className="card__label">Studio PDF</p>
              <p className="card__title"><code className="tag">essay.studio.pdf</code></p>
              <p className="card__body">A rendered export with embedded provenance and metadata.</p>
            </div>
            <div className="card">
              <p className="card__label">Studio JSON <em style={{ fontWeight: 400, fontStyle: 'normal', color: 'var(--slate)', fontSize: '0.8em' }}>(optional)</em></p>
              <p className="card__title"><code className="tag">essay.studio.json</code></p>
              <p className="card__body">Machine-readable companion for tooling and indexing.</p>
            </div>
          </div>
          <div className="btn-group">
            <Link to="/examples" className="btn btn--outline">See file examples</Link>
          </div>
        </div>
      </section>

      {/* ── Implementations ──────────────────────────────────────── */}
      <section>
        <div className="container">
          <p className="section-label">Implementations</p>
          <h2>Early experimental software</h2>
          <p style={{ marginTop: '0.75rem' }}>
            These tools explore the standard in practice. They do not define it.
          </p>
          <div className="impl-grid">
            <div className="impl-card">
              <p className="impl-card__status">Experimental</p>
              <p className="impl-card__name">Inkwave Solo</p>
              <p className="impl-card__desc">
                Single-writer environment for long-form work. Implements Studio Text and process-layer provenance.
              </p>
            </div>
            <div className="impl-card">
              <p className="impl-card__status">In development</p>
              <p className="impl-card__name">Inkwave Cubed</p>
              <p className="impl-card__desc">
                Collaborative studio with tile-based layout, multi-writer provenance, and Studio PDF export.
              </p>
            </div>
          </div>
          <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--slate)' }}>
            Any software may implement the Writing Studio Standard without restriction.
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="container cta-inner">
          <h2>Read the standard</h2>
          <p>Open, free, and intended for implementors, researchers, and tool designers.</p>
          <div className="btn-group">
            <Link to="/standard" className="btn btn--primary">Writing Studio Standard</Link>
            <Link to="/faq" className="btn btn--outline">Common questions</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
