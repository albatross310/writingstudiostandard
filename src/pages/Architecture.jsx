import { useMeta } from '../useMeta'

// The briefs describe the STANDARD (the shape a conformant file takes), not any one implementation's
// internals — kept deliberately general.
const layers = [
  {
    index: '01', name: 'Readable text', required: true, tagline: 'The Markdown header',
    desc: 'The document’s full prose, in plain Markdown at the top of the file. Legible in any editor, by any person, and more easily by a language model than a .docx or PDF. A file with only this layer is a conformant minimum.',
    contains: ['The complete document text', 'Headings and structure', 'Emphasis and inline marks'],
    conformance: 'Required. Every Studio Document must be readable from its header alone.',
    brief: `// A .studio file is:  Markdown header  +  a divider  +  JSON body.
file =
  markdownHeader(doc)
  + "\\n\\n" + RECORD_DIVIDER + "\\n\\n"   // a clear, fixed separator
  + JSON.stringify(body, null, 2)

// markdownHeader(doc): render the document to Markdown —
//   headings → #, ##, ###      emphasis → *…*, **…**
//   lists, tables, blockquotes, math as usual
// RULE: the header is DERIVED from the document model, never edited by
//       hand, so the two can never diverge. Everything above the
//       divider is readable with no tooling at all.`,
  },
  {
    index: '02', name: 'Document model', required: false, tagline: 'The structured, editable body',
    desc: 'Below the header, the same content as a structured tree — blocks, headings, lists, tables, mathematics, inline formatting. This is the faithful editable form; the header is generated from it, so the two never disagree.',
    contains: ['Block and inline node tree', 'Tables, lists, math', 'Figures and captions'],
    conformance: 'Optional. Implement when the tool edits rich structure, not just plain text.',
    brief: `content: {
  type: "doc",
  content: Node[]                 // a rich-text node tree
}

type Node = {
  type: "paragraph" | "heading" | "list"
      | "table" | "math" | "blockquote" | ...,
  attrs?: { level?: 1|2|3, align?: "left"|"center", ... },
  content?: Node[],              // child nodes (block → inline)
  text?: string,                 // text leaves only
  marks?: Mark[]                 // on text leaves
}

type Mark =
  | { type: "emphasis" | "strong" | "code" }
  | { type: "link", attrs: { href } }
  | { type: "citation", attrs: { citekey, locator? } }

// The Markdown header is a lossless projection of this tree.`,
  },
  {
    index: '03', name: 'Sources & citations', required: false, tagline: 'The bibliography and its evidence',
    desc: 'Real bibliographic records with formatted in-text citations, each pinnable to an exact page and passage of its source. Source files may be embedded in the document or linked, and highlights bind to the citation occurrence they belong to.',
    contains: ['CSL bibliography entries', 'Pinpointed in-text citations', 'Embedded or linked sources + highlights'],
    conformance: 'Optional. Implement when the document cites sources.',
    brief: `bibliography: CSLItem[]      // Citation Style Language JSON — a real standard

type CSLItem = {
  id: string,                 // citekey — referenced by citation marks
  type: "book" | "article-journal" | ...,
  title, author, issued, ...  // standard CSL fields
  // A studio may add a namespaced extension for, e.g.:
  //   · an attached / embedded source file
  //   · highlights pinned to a page + rectangle
  //   · a link from one citation use to a specific passage
}

sources?: { [citekey]: { name, data } }   // optional embedded files
// Pinpoints let a single source be cited at different
// pages or passages from different points in the text.`,
  },
  {
    index: '04', name: 'Provenance record', required: false, tagline: 'Signed, without surveillance',
    desc: 'A tamper-evident trace of a genuine writing session: a hash-chained set of signed receipts, plus content snapshots. The signer receives only cryptographic hashes — never the writer’s text, keystrokes, or identity.',
    contains: ['Hash-chained signed receipts', 'Content snapshots with hashes', 'An authorship signal'],
    conformance: 'Optional. Required if the implementation claims to preserve provenance.',
    brief: `receipts: Receipt[]          // one per writing period — a hash chain

type Receipt = {
  period: number,
  prevHash: string | null,   // = the previous receipt's content hash
  contentHash: string,       // hash of the canonical-JSON content
  keyId: string,
  signature: string          // over the fields above
}

snapshots: Snapshot[]        // { createdAt, wordCount, contentHash, ... }

// PRINCIPLE: the signer sees only HASHES — never the text, the
// keystrokes, or the writer's identity. Publish the signing key's
// PUBLIC half INDEPENDENTLY; a verifier checks against THAT, not
// against the key the file claims.`,
  },
  {
    index: '05', name: 'Anchoring', required: false, tagline: 'Independently dateable',
    desc: 'Document hashes are timestamped to a public blockchain, so the record can be dated and checked by anyone, indefinitely, without trusting the software vendor to still exist.',
    contains: ['Timestamp proofs over document hashes', 'Confirmation state and block references', 'A published-key reference for verification'],
    conformance: 'Optional. Requires the provenance layer.',
    brief: `snapshot.anchor: {
  status: "pending" | "confirmed",
  block?: number,            // the block it was committed in
  proof: ...                 // hash → Merkle path → chain transaction
}

// Aggregate many document hashes into one Merkle tree and commit only
// the ROOT to a public blockchain (e.g. via OpenTimestamps → Bitcoin),
// so many documents share a single on-chain footprint.
//
// A "pending" proof can be upgraded to "confirmed" by anyone, later.
// Verify = recompute the hash, walk the proof, check the named block.`,
  },
  {
    index: '06', name: 'Portability & export', required: false, tagline: 'Cross-tool and cross-format travel',
    desc: 'How a document is packaged to move between tools and how it exports: a rendered PDF, a source-stripped copy, or a gzip-compressed .studio for email. Exports may carry the provenance record or a link back to the verified original.',
    contains: ['Rendered PDF export', 'Source-stripped and gzip variants', 'View settings and version records'],
    conformance: 'Optional. Implement when producing exports or packages.',
    brief: `// Export modes a studio may offer
render : a fixed-layout PDF of the document
strip  : a copy with embedded source files removed
         (e.g. keep only those marked publicly available)
gzip   : a gzip-compressed .studio. Readers should detect the
         gzip magic bytes (1f 8b) and inflate transparently on open.

// A studio may store view settings (page style, zoom, …) so the
// document re-opens looking the same. These never affect the text or
// the verifiable record.

// Recommended invariants
// · text extraction is deterministic, so a verifier and the editor
//   agree byte-for-byte on what was written
// · provenance / snapshot history is append-only — a merge unions,
//   and never truncates, the existing record`,
  },
  {
    index: '07', name: 'Mnemonic tiles', required: false, tagline: 'Artwork linked to text — in development',
    desc: 'A studio is a place for drafting and artwork together. This planned layer carries mnemonic tiles, each linkable to words, phrases, or sentences as visual memory anchors. The underlying word list is planned to be open source, but the tiles themselves must be custom-built by each Writing Studio. Still in development and not yet part of a conformant implementation.',
    contains: ['Tile references (studio-built) keyed to an open word list', 'Word / phrase / sentence link targets', 'Placement and attribution records'],
    conformance: 'Optional, and provisional — the layer is not yet finalised.',
    brief: `// PLANNED — not yet part of a conformant implementation.
tiles?: {
  ref: string,               // id into an open word list
  target: { from, to },      // the passage it anchors to
  placement?: "margin" | "inline"
}[]

// Direction of travel:
//  · bring up OTHER .studio files from within a document
//  · hyperlink between documents so a reader can navigate a body of
//    work — and its sources — as one connected space
//  · tiles as visual memory anchors keyed to specific passages`,
  },
]

export default function Architecture() {
  useMeta({
    title: 'Architecture',
    description: 'The anatomy of a .studio file — a Markdown header over a JSON body — and its layers: readable text, document model, sources, provenance, anchoring, portability, and the in-development mnemonic tiles.',
    path: '/architecture',
  })
  return (
    <main>
      <div className="container">
        <div className="page-hero">
          <p className="page-hero__kicker">The file</p>
          <h1 className="page-hero__title">Anatomy of a <code className="tag">.studio</code> file</h1>
          <p className="page-hero__lead">
            A human-readable header over a machine-readable body, in composable layers. An implementation
            adopts only the layers it claims — and a reader can see exactly which ones a file carries.
          </p>
        </div>
      </div>

      <section>
        <div className="container container--narrow">
          <p className="section-label">The shape</p>
          <h2>Header, then body</h2>
          <hr className="divider" />
          <p>
            A <code className="tag">.studio</code> file is a single JSON document that opens with a
            Markdown header holding the entire text. Open it in any editor and you can read the document
            straight through; the structured body beneath carries everything a Writing Studio adds — sources,
            the signed session, the anchor — and is never needed simply to read the work.
          </p>
          <p>
            Because the text lives in a plain header, a <code className="tag">.studio</code> file is easier
            for both a person and a language model to read than a <code className="tag">.docx</code> or PDF,
            and it never locks the writing behind proprietary machinery.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <p className="section-label">Layer reference</p>
          <h2>The layers</h2>
          <hr className="divider" />
          <p style={{ marginBottom: '1.25rem', color: 'var(--slate)', fontSize: '0.98rem' }}>
            Each layer sits beside a <strong>code brief</strong> — the general shape of that part of the file.
          </p>

          <div className="arch-rows">
            {layers.map((layer, i) => (
              <div className="arch-row" key={layer.name}>
                <div className="arch-card" style={{ borderLeft: `5px solid hsl(${170 - i * 8}, ${36 - i * 2}%, ${50 - i}%)` }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.55rem', fontWeight: 700, color: 'var(--teal-light)', lineHeight: 1 }}>{parseInt(layer.index, 10)}</span>
                    <h3 style={{ margin: 0 }}>{layer.name}</h3>
                    <span className="arch-badge" data-req={layer.required ? '1' : '0'}>{layer.required ? 'Required' : 'Optional'}</span>
                  </div>
                  <p style={{ fontStyle: 'italic', color: 'var(--slate)', marginBottom: '0.7rem', fontSize: '0.92rem' }}>{layer.tagline}</p>
                  <p style={{ fontSize: '0.94rem', color: 'var(--charcoal-mid)', marginBottom: '1rem', maxWidth: '60ch' }}>{layer.desc}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem 1.5rem' }}>
                    <div>
                      <p className="arch-sub">Carries</p>
                      <ul className="checklist" style={{ margin: 0 }}>
                        {layer.contains.map(c => <li key={c} style={{ fontSize: '0.85rem' }}>{c}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="arch-sub">Conformance</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--slate)', maxWidth: '34ch' }}>{layer.conformance}</p>
                    </div>
                  </div>
                </div>

                <aside className="arch-brief">
                  <div className="arch-brief__head">{parseInt(layer.index, 10)} · {layer.name} — implementation brief</div>
                  <pre className="arch-brief__code">{layer.brief}</pre>
                </aside>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: '2rem' }}>
            <p className="card__label">A note on scope</p>
            <p className="card__body">
              This site is under active development. A more rigorous standard for precisely how each
              optional layer of a Studio Document should be structured — to maximise cross-compatibility
              between tools — is a continually evolving process. We welcome all feedback on how to balance
              the necessary technical detail against the understandability of the Writing Studio Standard as
              set out here, and warmly invite you to{' '}
              <a href="/contact">get in touch</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
