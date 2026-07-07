import { Link } from 'react-router-dom'
import { useMeta } from '../useMeta'

const layers = [
  {
    index: '01', name: 'Readable text', required: true, tagline: 'The Markdown header',
    desc: 'The document’s full prose, in plain Markdown at the top of the file. Legible in any editor, by any person, and more easily by a language model than a .docx or PDF. A file with only this layer is a conformant minimum.',
    contains: ['The complete document text', 'Headings and structure', 'Emphasis and inline marks'],
    conformance: 'Required. Every Studio Document must be readable from its header alone.',
  },
  {
    index: '02', name: 'Document model', required: false, tagline: 'The structured, editable body',
    desc: 'Below the header, the same content as a structured tree — blocks, headings, lists, tables, mathematics, inline formatting. This is the faithful editable form; the header is generated from it, so the two never disagree.',
    contains: ['Block and inline node tree', 'Tables, lists, math', 'Figures and captions'],
    conformance: 'Optional. Implement when the tool edits rich structure, not just plain text.',
  },
  {
    index: '03', name: 'Sources & citations', required: false, tagline: 'The bibliography and its evidence',
    desc: 'Real bibliographic records with formatted in-text citations, each pinnable to an exact page and passage of its source. Source PDFs may be embedded in the file or linked, and highlights bind to the citation occurrence they belong to.',
    contains: ['CSL bibliography entries', 'Pinpointed in-text citations', 'Embedded or linked source PDFs + highlights'],
    conformance: 'Optional. Implement when the document cites sources.',
  },
  {
    index: '04', name: 'Provenance record', required: false, tagline: 'Signed, without surveillance',
    desc: 'A tamper-evident trace of a genuine writing session: hash-chained composition receipts signed with a private key, plus content snapshots. The signing service receives only cryptographic hashes — never the writer’s text, keystrokes, or identity.',
    contains: ['Hash-chained signed receipts', 'Content snapshots with hashes', 'An authorship signal (e.g. constraint friction)'],
    conformance: 'Optional. Required if the implementation claims to preserve provenance.',
  },
  {
    index: '05', name: 'Anchoring', required: false, tagline: 'Independently dateable',
    desc: 'Document hashes are timestamped to a public blockchain (via OpenTimestamps → Bitcoin), so the record can be dated and checked by anyone, indefinitely, without trusting the software vendor to still exist.',
    contains: ['OpenTimestamps proofs over snapshot hashes', 'Confirmation state and block references', 'A published-key reference for verification'],
    conformance: 'Optional. Requires the provenance layer.',
  },
  {
    index: '06', name: 'Portability & export', required: false, tagline: 'Cross-tool and cross-format travel',
    desc: 'How a document is packaged to move between tools and how it exports: a rendered PDF, a source-stripped copy, or a gzip-compressed .studio for email. Exports may carry the provenance record or a link back to the verified original.',
    contains: ['Rendered PDF export', 'Public-source-stripped and gzip variants', 'View settings and version records'],
    conformance: 'Optional. Implement when producing exports or packages.',
  },
  {
    index: '07', name: 'Mnemonic tiles', required: false, tagline: 'Artwork linked to text — in development',
    desc: 'A studio is a place for drafting and artwork together. This planned layer carries mnemonic tiles from an open library, each linkable to words, phrases, or sentences as visual memory anchors. It is still in development and not yet part of a conformant implementation.',
    contains: ['Tile references from an open library', 'Word / phrase / sentence link targets', 'Placement and attribution records'],
    conformance: 'Optional, and provisional — the layer is not yet finalised.',
  },
]

export default function Architecture() {
  useMeta({
    title: 'Architecture',
    description: 'The anatomy of a .studio file — a Markdown header over a JSON body — and the standard’s layers: readable text, document model, sources, provenance, anchoring, portability, and the in-development mnemonic tiles.',
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
          <p style={{ marginTop: '1.25rem' }}>
            <Link to="/examples">See a full file, annotated →</Link>
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <p className="section-label">Layer reference</p>
          <h2>The layers</h2>
          <hr className="divider" />
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {layers.map((layer, i) => (
              <div key={layer.name} style={{
                background: 'var(--white)', border: '1px solid var(--ivory-mid)',
                borderLeft: `5px solid hsl(${170 - i * 8}, ${36 - i * 2}%, ${50 - i}%)`,
                borderRadius: 'var(--radius)', padding: '1.75rem', boxShadow: 'var(--shadow-card)',
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--teal-light)' }}>{layer.index}</span>
                  <h3 style={{ margin: 0 }}>{layer.name}</h3>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
                    color: layer.required ? 'var(--teal)' : 'var(--slate)',
                    background: layer.required ? 'var(--teal-pale)' : 'var(--ivory-mid)',
                    padding: '0.2em 0.6em', borderRadius: '3px', border: '1px solid',
                    borderColor: layer.required ? '#c0d8d2' : 'var(--ivory-dark)',
                  }}>{layer.required ? 'Required' : 'Optional'}</span>
                </div>
                <p style={{ fontStyle: 'italic', color: 'var(--slate)', marginBottom: '0.875rem', fontSize: '0.9375rem' }}>{layer.tagline}</p>
                <p style={{ fontSize: '0.9375rem', color: 'var(--charcoal-mid)', marginBottom: '1.25rem', maxWidth: '68ch' }}>{layer.desc}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 2rem' }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--teal)', marginBottom: '0.5rem' }}>Carries</p>
                    <ul className="checklist" style={{ margin: 0 }}>
                      {layer.contains.map(c => <li key={c} style={{ fontSize: '0.875rem' }}>{c}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--teal)', marginBottom: '0.5rem' }}>Conformance</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--slate)', maxWidth: '36ch' }}>{layer.conformance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
