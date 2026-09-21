import { useMeta } from '../useMeta'
import DownloadSpecButton from '../components/DownloadSpecButton'

const terms = [
  { term: 'Writing Studio', def: 'Software that creates, opens or verifies Studio Documents while preserving the parts it understands and declaring the parts it does not.' },
  { term: 'Studio Document', def: 'A portable .studio record containing an editable document plus its readable representation and any optional associated material.' },
  { term: 'Master item', def: 'A source, email, document or media item kept in the writer’s own library. A Studio Document carries a frozen reference or payload only when that work needs it.' },
  { term: 'Voice edition', def: 'A rendered readalong or recording associated with a stable source revision. Audio is separate from its source so it can be retained, re-rendered or omitted without changing the original.' },
  { term: 'Verified record', def: 'A record with snapshots, signed receipt-chain evidence and, where present, independent timestamp proofs. It verifies the stated technical evidence, not an absolute claim about authorship.' },
]

export default function Standard() {
  useMeta({ title: 'The Standard', description: 'The Writing Studio Standard defines portable Studio Documents, source-aware writing, contextual modules and optional provenance.', path: '/standard' })
  return (
    <main>
      <div className="container"><div className="page-hero"><p className="page-hero__kicker">Specification</p><h1 className="page-hero__title">The Writing Studio Standard</h1><p className="page-hero__lead">A practical definition of a document that can preserve its writing, sources, working context and optional proof without being trapped inside a single product.</p><div className="btn-group"><DownloadSpecButton /></div></div></div>

      <section><div className="container container--narrow"><p className="section-label">Scope</p><h2>What the standard is for</h2><hr className="divider" /><p>A text editor keeps words. A word processor adds presentation. A Writing Studio can keep the surrounding work as well: evidence, reading state, correspondence, media, revisions and a deliberately bounded provenance record.</p><p>The standard defines the portable document contract, its vocabulary and its honesty rules. It does not prescribe one interface, one storage provider, one voice model, or one business model. A conforming implementation makes its supported capabilities visible rather than pretending all Studio Documents contain the same things.</p></div></section>

      <section><div className="container container--narrow"><p className="section-label">Principles</p><h2>Six commitments</h2><hr className="divider" /><div className="trio-grid">
        <article className="card"><p className="card__label">Readable</p><p className="card__body">A reader can find a plain-text representation of the work without reconstructing an editor’s private state.</p></article>
        <article className="card"><p className="card__label">Portable</p><p className="card__body">The file is data, not a service account. Documents can be exported, copied, inspected and opened elsewhere.</p></article>
        <article className="card"><p className="card__label">Source-aware</p><p className="card__body">References are real records with stable identifiers, citation metadata and optional frozen source material.</p></article>
        <article className="card"><p className="card__label">Modular</p><p className="card__body">Email, reader, media and voice surfaces share a document context without being forced into one monolithic page.</p></article>
        <article className="card"><p className="card__label">User-controlled</p><p className="card__body">Master files may live in a local folder or a cloud provider the writer chooses. Inkwave caches are not a secret fifth copy.</p></article>
        <article className="card"><p className="card__label">Honest</p><p className="card__body">Provenance states what its evidence supports. It does not turn a cryptographic record into a claim that all prose was independently conceived by one person.</p></article>
      </div></div></section>

      <section><div className="container container--narrow"><p className="section-label">Storage and loading</p><h2>Two durable tiers, then an evictable cache</h2><hr className="divider" /><p>A master library item is the writer’s reusable source in a provider or local folder they control. A Studio attachment is the frozen revision, excerpt or metadata used by one <code className="tag">.studio</code> document. These are the two durable product-visible tiers.</p><p>A thumbnail, page image, search index, waveform or downloaded payload may sit in local SSD storage for speed. It is derived and disposable: it is never an independent authoritative library copy, and clearing it cannot delete the master or the Studio attachment.</p><p>Opening a Studio reveals its compact document core before large attachments. Implementations should parse the container off the main interface, defer library restoration until after the first frame, and load PDFs, EPUBs, media and voice bytes only when their reader or player is opened. The intended cold-open experience is no slower than opening the equivalent writing in Markdown.</p></div></section>

      <section><div className="container container--narrow"><p className="section-label">Definitions</p><h2>Primary terms</h2><hr className="divider" /><dl className="definition-table">{terms.map(({ term, def }) => <div className="definition-table__row" key={term}><dt>{term}</dt><dd>{def}</dd></div>)}</dl></div></section>

      <section><div className="container container--narrow"><p className="section-label">Conformance</p><h2>What an implementation must do</h2><hr className="divider" /><p>A conforming writer produces a <code className="tag">.studio</code> record with a versioned, structured document and a readable text representation. It must preserve fields it does not understand whenever it can do so safely, and it must never silently discard provenance, citations or attached evidence during an ordinary open-and-save cycle.</p><p>A conforming reader identifies the capabilities carried by a document and clearly distinguishes unavailable material from absent material. A verifier checks the versioned evidence that is present; it does not infer stronger claims from missing information.</p></div></section>

      <section><div className="container container--narrow"><p className="section-label">Licence</p><h2>Published under CC BY 4.0</h2><hr className="divider" /><p>The Writing Studio Standard is published under the <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">Creative Commons Attribution 4.0 International licence</a>. Anyone may implement, extend or build upon it, provided they attribute the Writing Studio Standard.</p><p style={{ marginTop: '1rem', color: 'var(--slate)', fontSize: '0.95rem' }}>“Writing Studio Standard”, “Studio Document” and “Inkwave” are intended product and standard names. The format remains open; its name should not be used to imply compatibility that an implementation has not earned.</p></div></section>
    </main>
  )
}
