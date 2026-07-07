import { useMeta } from '../useMeta'

// Each layer carries a `brief`: a terse implementation spec — the shape you'd hand another engineer (or
// model) to build that part of the file. Shown in a fold-out, scrollable panel to the right of the card.
const layers = [
  {
    index: '01', name: 'Readable text', required: true, tagline: 'The Markdown header',
    desc: 'The document’s full prose, in plain Markdown at the top of the file. Legible in any editor, by any person, and more easily by a language model than a .docx or PDF. A file with only this layer is a conformant minimum.',
    contains: ['The complete document text', 'Headings and structure', 'Emphasis and inline marks'],
    conformance: 'Required. Every Studio Document must be readable from its header alone.',
    brief: `// The file is: Markdown header  +  fixed divider  +  JSON body.
const file =
  markdownHeader(doc) + "\\n\\n" +
  "═══════════════════════════════════════════════════\\n" +
  "══════ INKWAVE RECORD · verify at iwzero.me/verify ══════\\n" +
  "Everything below is the structured record that proves\\n" +
  "the writing above. You don't need to read it.\\n" +
  "═══════════════════════════════════════════════════\\n\\n" +
  JSON.stringify(bundle, null, 2)

// markdownHeader(doc): project the document tree to GitHub-flavoured Markdown
//   heading  → #, ##, ###        emphasis → *…*, **…**
//   lists, tables, blockquotes, math ($…$) as usual
// RULE: the header is DERIVED from the document model, never hand-edited,
//       so the two can never diverge. Everything above the divider is
//       readable with no tooling at all.`,
  },
  {
    index: '02', name: 'Document model', required: false, tagline: 'The structured, editable body',
    desc: 'Below the header, the same content as a structured tree — blocks, headings, lists, tables, mathematics, inline formatting. This is the faithful editable form; the header is generated from it, so the two never disagree.',
    contains: ['Block and inline node tree', 'Tables, lists, math', 'Figures and captions'],
    conformance: 'Optional. Implement when the tool edits rich structure, not just plain text.',
    brief: `content: {
  type: "doc",
  content: Node[]                 // a ProseMirror / Tiptap tree
}

type Node = {
  type: "paragraph" | "heading" | "bulletList"
      | "table" | "mathBlock" | "blockquote" | ...,
  attrs?: { level?: 1 | 2 | 3, align?: "left" | "center", ... },
  content?: Node[],              // child nodes (block → inline)
  text?: string,                 // text leaves only
  marks?: Mark[]                 // on text leaves
}

type Mark =
  | { type: "em" | "strong" | "code" }
  | { type: "link", attrs: { href: string } }
  | { type: "citation", attrs: { citekey, locator?, instanceId } }

// Block nodes hold inline nodes; inline text carries marks.
// The Markdown header is a lossless projection of this tree.`,
  },
  {
    index: '03', name: 'Sources & citations', required: false, tagline: 'The bibliography and its evidence',
    desc: 'Real bibliographic records with formatted in-text citations, each pinnable to an exact page and passage of its source. Source PDFs may be embedded in the file or linked, and highlights bind to the citation occurrence they belong to.',
    contains: ['CSL bibliography entries', 'Pinpointed in-text citations', 'Embedded or linked source PDFs + highlights'],
    conformance: 'Optional. Implement when the document cites sources.',
    brief: `bibliography: CSLItem[]           // Citation Style Language JSON (the real standard)

type CSLItem = {
  id: string,                     // citekey — referenced by citation marks
  type: "book" | "article-journal" | ...,
  title: string,
  author: { family: string, given?: string }[],
  issued: { "date-parts": [[year, month?, day?]] },
  _iw?: {                         // "_" = Inkwave extension, ignored by CSL
    pdfName?: string,             // embedded or linked source PDF
    highlights?: {
      page: number,
      instanceId: string,         // ties this mark to ONE citation occurrence
      text: string,
      rects: { x, y, w, h }[]     // fractions of the page, 0..1
    }[]
  }
}

pdfs?: { [citekey]: { name, data: base64 } }   // embedded sources
// A pinpoint is keyed by instanceId, so two uses of one source
// can point at two different pages/passages.`,
  },
  {
    index: '04', name: 'Provenance record', required: false, tagline: 'Signed, without surveillance',
    desc: 'A tamper-evident trace of a genuine writing session: hash-chained composition receipts signed with a private key, plus content snapshots. The signing service receives only cryptographic hashes — never the writer’s text, keystrokes, or identity.',
    contains: ['Hash-chained signed receipts', 'Content snapshots with hashes', 'An authorship signal (e.g. constraint friction)'],
    conformance: 'Optional. Required if the implementation claims to preserve provenance.',
    brief: `receipts: Receipt[]               // one per writing period — a hash chain

type Receipt = {
  period: number,
  prevHash: string | null,        // = previous receipt's contentHash
  contentHash: string,            // sha256( JCS(contentJson) )   RFC 8785
  nudgesHash: string,             // sha256 of the constraints this period
  keyId: string,
  sig: string                     // Ed25519 over the four fields above
}

snapshots: Snapshot[]             // { id, createdAt, wordCount,
                                  //   contentHash, bundleHash, ots }

// THE SERVICE SEES ONLY HASHES. Never transmit text, keystrokes,
// or identity. Sign server-side; publish the key's PUBLIC half
// INDEPENDENTLY. Verifiers check against the published key —
// not the key the file claims.`,
  },
  {
    index: '05', name: 'Anchoring', required: false, tagline: 'Independently dateable',
    desc: 'Document hashes are timestamped to a public blockchain (via OpenTimestamps → Bitcoin), so the record can be dated and checked by anyone, indefinitely, without trusting the software vendor to still exist.',
    contains: ['OpenTimestamps proofs over snapshot hashes', 'Confirmation state and block references', 'A published-key reference for verification'],
    conformance: 'Optional. Requires the provenance layer.',
    brief: `snapshot.ots: {
  status: "pending" | "confirmed",
  bitcoinBlock?: number,
  proof: base64                   // hash → Merkle path → Bitcoin tx
}

// Aggregate many snapshot hashes into one Merkle tree; commit
// only the ROOT in a single Bitcoin transaction (OpenTimestamps
// calendar servers do the aggregation — millions of docs share
// one on-chain footprint).
//
// Upgrade pending → confirmed later; ANYONE can. Never re-stamp on
// load — Bitcoin confirms over hours, so stamp on creation and
// sweep on demand. Verify = recompute the hash, walk the proof,
// check the named block on the public chain.`,
  },
  {
    index: '06', name: 'Portability & export', required: false, tagline: 'Cross-tool and cross-format travel',
    desc: 'How a document is packaged to move between tools and how it exports: a rendered PDF, a source-stripped copy, or a gzip-compressed .studio for email. Exports may carry the provenance record or a link back to the verified original.',
    contains: ['Rendered PDF export', 'Public-source-stripped and gzip variants', 'View settings and version records'],
    conformance: 'Optional. Implement when producing exports or packages.',
    brief: `// Export modes
render : PDF of the current page view (fonts embedded)
strip  : drop embedded PDFs — 'all' | 'public'
         ('public' = sources with _iw.publiclyAvailable === true)
gzip   : .studio.gz via CompressionStream('gzip');
         readers gunzip transparently on open (magic bytes 1f 8b)

viewSettings: { zoom, gappedPages, style, ... }
// travels with the file so it re-opens looking the same.

// TWO HARD INVARIANTS
// 1. pmToText(doc) is byte-deterministic — verification depends on it.
// 2. Snapshot history is GROW-ONLY: every write-back UNIONS with the
//    target's existing snapshots. Never truncate the archive.`,
  },
  {
    index: '07', name: 'Mnemonic tiles', required: false, tagline: 'Artwork linked to text — in development',
    desc: 'A studio is a place for drafting and artwork together. This planned layer carries mnemonic tiles, each linkable to words, phrases, or sentences as visual memory anchors. The underlying word list is planned to be open source, but the tiles themselves must be custom-built by each Writing Studio. Still in development and not yet part of a conformant implementation.',
    contains: ['Tile references (studio-built) keyed to an open word list', 'Word / phrase / sentence link targets', 'Placement and attribution records'],
    conformance: 'Optional, and provisional — the layer is not yet finalised.',
    brief: `// PLANNED — not yet part of a conformant implementation.
tiles?: {
  ref: string,                    // id into an open tile library
  target: { from: number, to: number },  // doc positions it anchors to
  placement?: "margin" | "inline"
}[]

// Direction of travel:
//  · dynamically bring up OTHER .studio files from within one document
//  · hyperlink between documents so a reader can navigate a body of
//    work — and a document's sources — as one connected space
//  · tiles as visual memory anchors keyed to specific passages`,
  },
]

export default function Architecture() {
  useMeta({
    title: 'Architecture',
    description: 'The anatomy of a .studio file — a Markdown header over a JSON body — and its layers, each with a fold-out implementation brief: readable text, document model, sources, provenance, anchoring, portability, and the in-development mnemonic tiles.',
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
            Each layer sits beside its <strong>code brief</strong> — the shape you'd hand an engineer to build it.
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
