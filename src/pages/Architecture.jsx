import { CodeBar, sourceLineRange } from '../components/CodeBar'
import { SyntaxHighlight } from '../components/SyntaxHighlight'
import engineeringSpec from '../content/engineering-spec.md?raw'
import { useMeta } from '../useMeta'

// The briefs describe the STANDARD (the shape a conformant file takes), not any one implementation's
// internals — kept deliberately general.
const layers = [
  {
    index: '01', name: 'Readable record', required: true, tagline: 'Summary and plain-text projection',
    desc: 'A short summary and deterministic plain-text projection appear near the beginning of the versioned record. A person or language model can inspect the writing without reconstructing the editing interface.',
    contains: ['Human-facing summary', 'Complete readable text projection', 'Verifier and capability metadata'],
    conformance: 'Required. Every reader must expose the readable projection even when richer structure is unsupported.',
    brief: `// A portable record carries readable text
// and structured data in one document.

record = {
  summary: makeSummary(doc),
  text: toPlainText(doc),
  document: toStructuredDoc(doc),
}

// text is derived from document.
// A reader can inspect it without
// rebuilding the editing interface.`,
  },
  {
    index: '02', name: 'Document model', required: true, tagline: 'The structured, editable source',
    desc: 'The editable representation is a versioned structured tree of blocks, headings, lists, tables, mathematics and inline formatting. The readable text is generated from this source of truth so the two representations cannot silently diverge.',
    contains: ['Block and inline node tree', 'Tables, lists, math', 'Figures and captions'],
    conformance: 'Required for a conforming writer. A read-only implementation may expose only the readable projection.',
    brief: `content: {
  type: "doc",
  content: Node[],
}

type Node = {
  type: "paragraph" | "heading"
      | "list" | "table" | "math",
  attrs?: Record<string, unknown>,
  content?: Node[],
  text?: string,
  marks?: Mark[],
}

// Marks hold emphasis, links,
// code and citation references.`,
  },
  {
    index: '03', name: 'Sources & citations', required: false, tagline: 'The bibliography and its evidence',
    desc: 'Real bibliographic records with formatted in-text citations, each pinnable to an exact page and passage of its source. Source files may be embedded in the document or linked, and highlights bind to the citation occurrence they belong to.',
    contains: ['CSL bibliography entries', 'Pinpointed in-text citations', 'Embedded or linked sources + highlights'],
    conformance: 'Optional. Implement when the document cites sources.',
    brief: `bibliography: CSLItem[]

type CSLItem = {
  id: string,       // stable citekey
  type: string,
  title: string,
  author?: Name[],
  issued?: DateInfo,
}

source?: {
  file?: Attachment,
  highlights?: Highlight[],
}

// A citation can name a page,
// a passage and its highlight.`,
  },
  {
    index: '04', name: 'Provenance record', required: false, tagline: 'Signed, without surveillance',
    desc: 'A tamper-evident trace of a genuine writing session: a hash-chained set of signed receipts, plus content snapshots. The signer receives only cryptographic hashes — never the writer’s text, keystrokes, or identity.',
    contains: ['Hash-chained signed receipts', 'Content snapshots with hashes', 'Bounded composition evidence'],
    conformance: 'Optional. Required if the implementation claims to preserve provenance.',
    brief: `receipts: Receipt[]

type Receipt = {
  period: number,
  prevHash: string | null,
  contentHash: string,
  keyId: string,
  signature: string,
}

snapshots: Snapshot[]

// The signer receives hashes only.
// It never receives text, keystrokes
// or the writer's identity.`,
  },
  {
    index: '05', name: 'Anchoring', required: false, tagline: 'Independently dateable',
    desc: 'Document hashes are timestamped to a public blockchain, so the record can be dated and checked by anyone, indefinitely, without trusting the software vendor to still exist.',
    contains: ['Timestamp proofs over document hashes', 'Confirmation state and block references', 'A published-key reference for verification'],
    conformance: 'Optional. Requires the provenance layer.',
    brief: `snapshot.anchor: {
  status: "pending" | "confirmed",
  block?: number,
  proof: TimestampProof,
}

// Many document hashes share one
// Merkle-tree commitment.
//
// Verification recomputes the hash,
// follows the proof, then checks the
// named public-chain commitment.`,
  },
  {
    index: '06', name: 'Portability & export', required: false, tagline: 'Cross-tool and cross-format travel',
    desc: 'How a document is packaged to move between tools and how it exports: a rendered PDF, a source-stripped copy, or a gzip-compressed .studio for email. Exports may carry the provenance record or a link back to the verified original.',
    contains: ['Rendered PDF export', 'Source-stripped and gzip variants', 'View settings and version records'],
    conformance: 'Optional. Implement when producing exports or packages.',
    brief: `export = {
  render: "pdf",
  sources: "all" | "public" | "none",
  compression: "gzip" | "none",
}

// View settings may travel with a
// document. They do not affect its
// text or verification record.

// Text extraction stays deterministic.
// Snapshot history is append-only.`,
  },
  {
    index: '07', name: 'Mnemonic tiles', required: false, tagline: 'Artwork linked to text — in development',
    desc: 'A studio is a place for drafting and artwork together. This planned layer carries mnemonic tiles, each linkable to words, phrases, or sentences as visual memory anchors. The underlying word list is planned to be open source, but the tiles themselves must be custom-built by each Writing Studio. Still in development and not yet part of a conformant implementation.',
    contains: ['Tile references (studio-built) keyed to an open word list', 'Word / phrase / sentence link targets', 'Placement and attribution records'],
    conformance: 'Optional, and provisional — the layer is not yet finalised.',
    brief: `// Planned; not yet a conformant layer.
tiles?: {
  ref: string,
  target: { from, to },
  placement?: "margin" | "inline",
}[]

// A tile links visual memory support
// to a word, phrase or passage.
//
// Future readers may also navigate
// between related Studio Documents.`,
  },
]

function briefFilename(name) {
  return `${name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}.ts`
}

function BriefCodeBar({ layer }) {
  const range = sourceLineRange(engineeringSpec, layer.brief)
  return <CodeBar
    filename={briefFilename(layer.name)}
    language="TypeScript"
    symbol="TS"
    lineStart={range.start}
    lineEnd={range.end}
  />
}

export default function Architecture() {
  useMeta({
    title: 'Architecture',
    description: 'The anatomy of a versioned .studio record: readable projection, structured document, sources, provenance, anchoring, portability, and planned mnemonic tiles.',
    path: '/architecture',
  })
  return (
    <main>
      <div className="container container--prose">
        <div className="page-hero">
          <p className="page-hero__kicker">The file</p>
          <h1 className="page-hero__title">Anatomy of a<code className="tag">.studio</code> file</h1>
          <p className="page-hero__lead">
            A versioned record with a readable projection, structured document and explicit optional
            capabilities. A reader can determine which layers are present before loading their payloads.
          </p>
        </div>
      </div>

      <section>
        <div className="container container--prose">
          <p className="section-label">The shape</p>
          <h2>One record, two core representations</h2>
          <hr className="divider" />
          <p>
            A <code className="tag">.studio</code> file is a versioned JSON record. Its summary and
            plain-text projection make the writing directly inspectable; its structured document field is
            the editable source of truth. Optional manifests declare sources, media, voice and provenance.
          </p>
          <p>
            Implementations load the compact document core first. Large attachments are indexed separately
            and requested only by the reader or player that needs them, so portability does not require a
            slow initial open.
          </p>
        </div>
      </section>

      <section>
        <div className="container container--prose">
          <p className="section-label">Storage and open path</p>
          <h2>Two durable tiers. One fast first frame.</h2>
          <hr className="divider" />
          <div className="trio-grid trio-grid--storage">
            <article className="card"><p className="card__label">Master item</p><p className="card__body">The reusable original remains in a user-chosen local folder or cloud provider. Its stable ID, revision and content hash identify the exact source.</p></article>
            <article className="card"><p className="card__label">Studio attachment</p><p className="card__body">The current Studio keeps the source bytes or explicit subset it uses, frozen to that master revision. It remains portable without the library being online.</p></article>
            <article className="card"><p className="card__label">Device cache</p><p className="card__body">Pages, search indexes, waveforms and downloaded media are derived SSD data. They speed later use and may be evicted without changing either durable tier.</p></article>
          </div>
          <p style={{ marginTop: '1rem', maxWidth: '72ch' }}>The initial open reads only the compact Studio core and attachment manifest. Parsing happens off the main interface. Library restoration follows the first reveal, while reader and player modules fetch their large payloads only when the writer asks for them. The target is a usable first frame no slower than the corresponding Markdown writing.</p>
        </div>
      </section>

      <section>
        <div className="container container--prose">
          <p className="section-label">Layer reference</p>
          <h2>The layers</h2>
          <hr className="divider" />
          <p style={{ marginBottom: '1.25rem', color: 'var(--quiet)', fontSize: '0.98rem' }}>
            Each layer sits beside a <strong>code brief</strong> — the general shape of that part of the file.
          </p>

          <div className="arch-rows">
            {layers.map((layer) => (
              <div className="arch-row" key={layer.name}>
                <div className="arch-card">
                  <div className="arch-card__top">
                    <span className="arch-card__number">{parseInt(layer.index, 10)}</span>
                    <h3>{layer.name}</h3>
                    <span className="arch-badge" data-req={layer.required ? '1' : '0'}>{layer.required ? 'Required' : 'Optional'}</span>
                  </div>
                  <p className="arch-card__tagline">{layer.tagline}</p>
                  <p className="arch-card__description">{layer.desc}</p>
                  <div className="arch-card__meta">
                    <div>
                      <p className="arch-sub">Carries</p>
                      <ul className="checklist arch-card__list">
                        {layer.contains.map(c => <li key={c}>{c}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="arch-sub">Conformance</p>
                      <p className="arch-card__conformance">{layer.conformance}</p>
                    </div>
                  </div>
                </div>

                <aside className="arch-brief">
                  <BriefCodeBar layer={layer} />
                  <pre className="arch-brief__code"><SyntaxHighlight text={layer.brief} /></pre>
                </aside>
              </div>
            ))}
          </div>

          <div className="card arch-scope-note">
            <p className="card__label">A note on scope</p>
            <p className="card__body">
              Optional-layer schemas remain draft where marked. Compatibility reports and implementation
              feedback are welcome; email the maintainer at{' '}
              <a href="mailto:petergibson127@gmail.com">petergibson127@gmail.com</a> with concrete cases.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
