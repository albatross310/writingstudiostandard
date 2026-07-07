import { Link } from 'react-router-dom'
import './Home.css'

// The real .studio architecture, described as a layered file. Each layer is optional except the text.
const layers = [
  { name: 'Text — a Markdown header', desc: "The document's full prose, in plain Markdown at the top of the file. Readable in any editor, by any person, and more easily by an AI than a .docx or PDF. No Studio software required." },
  { name: 'Document model (JSON)', desc: 'The structured body below the header: blocks, headings, lists, tables, math, and inline formatting — the faithful editable form.' },
  { name: 'Sources & citations', desc: 'A bibliography with real CSL formatting, in-text citations pinned to exact pages and passages, and — optionally — the source PDFs themselves, embedded or linked.' },
  { name: 'Provenance record', desc: "A tamper-evident trace of a genuine writing session: hash-chained composition receipts, signed with a public key. The signing service sees only hashes — never your text or identity." },
  { name: 'Anchoring', desc: 'Document hashes are timestamped to the Bitcoin blockchain (via OpenTimestamps), so the record can be dated and checked by anyone, forever, without trusting the vendor.' },
]

const contents = [
  'The full readable text',
  'Structure and formatting',
  'References and in-text citations',
  'Pinpointed source PDFs',
  'A signed, hash-chained session record',
  'A Bitcoin timestamp anchor',
  'Everything needed to verify it — offline',
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
            An open, verifiable file format for serious writing — one that carries the text,
            its sources, and a tamper-evident record of the session that produced it. Readable
            anywhere. Provable by anyone. Owned by no one.
          </p>
          <div className="btn-group">
            <Link to="/standard" className="btn btn--primary">Read the standard</Link>
            <Link to="/architecture" className="btn btn--outline">The .studio file</Link>
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
                Plain, portable, unadorned. It keeps your words and nothing about how they arrived.
              </p>
            </div>
            <div className="trio-card">
              <span className="trio-card__stores">stores formatted documents</span>
              <h3>Word Processor</h3>
              <p className="card__body">
                Adds typefaces, margins, and styles. It records how a document <em>looks</em> — not how it was made.
              </p>
            </div>
            <div className="trio-card trio-card--highlight">
              <span className="trio-card__stores">stores text + sources + provenance</span>
              <h3>Writing Studio</h3>
              <p className="card__body">
                Keeps the writing and everything around it — the sources it rests on and a signed record of the
                real session that produced it — in one open, checkable file.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The .studio file ─────────────────────────────────────── */}
      <section>
        <div className="container">
          <p className="section-label">The Studio Document</p>
          <h2>One open file: <code className="tag">.studio</code></h2>
          <div className="home-doc-grid">
            <div>
              <p>
                A Studio Document is a single <code className="tag">.studio</code> file — a specific form of
                JSON that opens with a human-readable <strong>Markdown header carrying the document's full
                text</strong>. Anyone can read the raw file without the software that wrote it, and an AI can
                read it far more easily than a <code className="tag">.docx</code> or PDF.
              </p>
              <p style={{ marginTop: '1rem' }}>
                Beneath the header sits the structured document, its sources, and — for those who want it — a
                cryptographic record of the writing session, anchored to public infrastructure so it can be
                verified by anyone, with no account and nothing uploaded.
              </p>
              <div className="btn-group" style={{ marginTop: '1.5rem' }}>
                <Link to="/examples" className="btn btn--outline">See a file, annotated</Link>
              </div>
            </div>
            <div className="card">
              <p className="card__label">A Studio Document may carry</p>
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
          <h2>Layered, and optional past the text</h2>
          <p style={{ marginTop: '0.75rem' }}>
            Only the readable text is required. Each further layer is opt-in; an implementation claims the
            layers it actually supports, and a reader can check exactly which ones a file carries.
          </p>
          <div className="layer-stack">
            {layers.map((l, i) => (
              <div className="layer-card" key={l.name} style={{
                borderLeftColor: `hsl(${190 - i * 22}, ${52 - i * 4}%, ${46 - i * 2}%)`
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

      {/* ── Provenance ───────────────────────────────────────────── */}
      <section>
        <div className="container">
          <p className="section-label">Provenance without surveillance</p>
          <h2>Proof you wrote it — not a record of you</h2>
          <div className="trio-grid" style={{ marginTop: '1.75rem' }}>
            <div className="card">
              <p className="card__label">Signed, not watched</p>
              <p className="card__body">
                A live session is captured as hash-chained receipts signed with a public key. The service
                receives only cryptographic hashes — never your keystrokes, your text, or your identity.
              </p>
            </div>
            <div className="card">
              <p className="card__label">Anchored to Bitcoin</p>
              <p className="card__body">
                Each record is timestamped to the Bitcoin blockchain through OpenTimestamps, so it can be
                dated and trusted independently of any company remaining in business.
              </p>
            </div>
            <div className="card">
              <p className="card__label">Verifiable by anyone</p>
              <p className="card__body">
                Verification runs entirely in the reader's browser against a published signing key. No login,
                nothing uploaded. It confirms an authentic composition — never that a human wrote every word.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Implementations ──────────────────────────────────────── */}
      <section>
        <div className="container">
          <p className="section-label">Implementations</p>
          <h2>Software that speaks the standard</h2>
          <p style={{ marginTop: '0.75rem' }}>
            These tools explore the standard in practice. They do not define it — the format is open, and any
            software may read, write, and verify <code className="tag">.studio</code> files without restriction.
          </p>
          <div className="impl-grid">
            <div className="impl-card">
              <p className="impl-card__status">Live</p>
              <p className="impl-card__name">Inkwave Zero</p>
              <p className="impl-card__desc">
                A calm writing studio for students and academics. The verified ground floor: writes
                <code className="tag"> .studio</code> files, signs sessions, and anchors them to Bitcoin — free, with
                zero data retention.
              </p>
            </div>
            <div className="impl-card">
              <p className="impl-card__status">In development</p>
              <p className="impl-card__name">Inkwave Cubed</p>
              <p className="impl-card__desc">
                Living documents that link back to their verified counterparts and hyperlink each other and
                their sources — the beginnings of a verifiable network of essays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="container cta-inner">
          <h2>Read the standard</h2>
          <p>Open and free, for implementors, researchers, and anyone who wants writing they can prove.</p>
          <div className="btn-group">
            <Link to="/standard" className="btn btn--primary">Writing Studio Standard</Link>
            <Link to="/faq" className="btn btn--outline">Common questions</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
