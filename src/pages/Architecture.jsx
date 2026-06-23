import { Link } from 'react-router-dom'
import { useMeta } from '../useMeta'

const layers = [
  {
    index: '01',
    name: 'Content layer',
    required: true,
    tagline: 'The text itself',
    desc: 'Plain text, paragraphs, headings, and semantic blocks. The foundation of every Studio Document. A document with only this layer is a conformant minimum.',
    contains: [
      'Plain prose paragraphs',
      'Headings and section structure',
      'Semantic block types (quote, note, aside)',
      'Inline annotation markers',
    ],
    conformance: 'Required. All Studio Documents must implement this layer.',
  },
  {
    index: '02',
    name: 'Formatting layer',
    required: false,
    tagline: 'Inline and block-level styles',
    desc: 'Formatting applied to words and paragraphs — above raw text, below embedded objects. Covers everything a writer applies: emphasis, lists, tables, inline code, and block-level callouts.',
    contains: [
      'Bold, italic, underline, strikethrough',
      'Ordered and unordered lists',
      'Tables and definition lists',
      'Inline code and block quotes',
    ],
    conformance: 'Optional. Implement when the document carries styled text beyond plain prose.',
  },
  {
    index: '03',
    name: 'Object layer',
    required: false,
    tagline: 'Images and embedded elements',
    desc: 'Non-text elements that belong to the document: images, diagrams, and other embedded media. References may be embedded or external with permanence intent.',
    contains: [
      'Embedded or referenced images',
      'Diagrams and figures',
      'Spatial placement hints',
      'Captions and alt descriptions',
    ],
    conformance: 'Optional. Implement when the document carries visual objects.',
  },
  {
    index: '04',
    name: 'Tiles layer',
    required: false,
    tagline: 'Mnemonic art tiles linked to text',
    desc: 'A writing studio is a studio — a place for artwork and drafting together. The Tiles layer carries mnemonic art tiles drawn from a curated open-source library of 2028 tiles (26² × 3, the number of letters in the alphabet squared times three). Each tile links to specific words, phrases, or sentences in the document, functioning as visual mnemonics alongside the written work.',
    contains: [
      'Tile references from the 2028-tile open library',
      'Word, phrase, and sentence link targets',
      'Tile placement and display hints',
      'Library version and attribution records',
    ],
    conformance: 'Optional. Implement when the document uses mnemonic tile artwork.',
  },
  {
    index: '05',
    name: 'Process layer',
    required: false,
    tagline: 'Sessions, revisions, and writing history',
    desc: 'Records the making of the document. Writing sessions, significant revision checkpoints, and keystroke-level session data belong here. Keylog data is stored encrypted. This layer is distinct from version control — it captures creative process, not file diff.',
    contains: [
      'Writing session timestamps and durations',
      'Named revision checkpoints',
      'Keystroke session data (encrypted)',
      'Word counts per session',
    ],
    conformance: 'Optional. Required if the implementation claims to preserve process.',
  },
  {
    index: '06',
    name: 'Provenance layer',
    required: false,
    tagline: 'Authorship, snapshots, and verification',
    desc: 'Evidence of origin and integrity. Carries unencrypted author metadata alongside encrypted provenance snapshots and encrypted keylog metadata. Not a digital rights system — a record of making, for archival and attribution purposes.',
    contains: [
      'Unencrypted author and attribution metadata',
      'Light provenance snapshots (encrypted)',
      'Keylog metadata (encrypted)',
      'Integrity checksums for archival copies',
    ],
    conformance: 'Optional. Required if the implementation claims to preserve provenance.',
  },
  {
    index: '07',
    name: 'Portability layer',
    required: false,
    tagline: 'Packaging and cross-system travel',
    desc: 'Defines how a document package is assembled — source file plus exported artefacts — and what metadata must accompany it to be reconstructed on another system.',
    contains: [
      'Package manifest',
      'Companion file references (source + exports)',
      'External dependency declarations',
      'Software and standard version records',
    ],
    conformance: 'Optional. Implement when distributing document packages across systems.',
  },
]

export default function Architecture() {
  useMeta({
    title: 'Architecture',
    description: 'The Writing Studio Standard defines seven layers: Content, Formatting, Object, Tiles, Process, Provenance, and Portability.',
    path: '/architecture',
  })
  return (
    <main>
      <div className="container">
        <div className="page-hero">
          <p className="page-hero__kicker">Technical model</p>
          <h1 className="page-hero__title">Architecture of the standard</h1>
          <p className="page-hero__lead">
            Seven independent, composable layers. A conformant implementation
            adopts only the layers it claims and implements them fully.
          </p>
        </div>
      </div>

      <section>
        <div className="container container--narrow">
          <p className="section-label">Design rationale</p>
          <h2>Why layers?</h2>
          <hr className="divider" />
          <p>
            A monolithic standard would be unusable. A minimal tool should not
            need to implement full provenance infrastructure; a full studio should
            not be penalised for exceeding a narrow baseline. Layers let the
            standard scale without one set of requirements imposing on another.
          </p>
          <p>
            The name <em>studio</em> is deliberate. A studio is a place for
            drafting and artwork together. The Tiles layer carries that: 2028
            mnemonic art tiles from an open-source library, each linkable to
            words, phrases, or sentences in the document.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <p className="section-label">Layer reference</p>
          <h2>The seven layers</h2>
          <hr className="divider" />
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {layers.map((layer, i) => (
              <div key={layer.name} style={{
                background: 'var(--white)',
                border: '1px solid var(--ivory-mid)',
                borderLeft: `5px solid hsl(${163 + i * 5}, ${36 - i * 2}%, ${53 - i * 2}%)`,
                borderRadius: 'var(--radius)',
                padding: '2rem',
                boxShadow: 'var(--shadow-card)',
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
                  }}>
                    {layer.required ? 'Required' : 'Optional'}
                  </span>
                </div>
                <p style={{ fontStyle: 'italic', color: 'var(--slate)', marginBottom: '0.875rem', fontSize: '0.9375rem' }}>
                  {layer.tagline}
                </p>
                <p style={{ fontSize: '0.9375rem', color: 'var(--charcoal-mid)', marginBottom: '1.25rem', maxWidth: '68ch' }}>
                  {layer.desc}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 2rem' }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--teal)', marginBottom: '0.5rem' }}>Contains</p>
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

      <section>
        <div className="container container--narrow">
          <p className="section-label">Dependencies</p>
          <h2>Layer dependencies</h2>
          <hr className="divider" />
          <p>The Content layer is the only required layer. All others depend on it.</p>
          <ul className="checklist" style={{ marginTop: '1.25rem' }}>
            <li>The Formatting layer depends on the Content layer.</li>
            <li>The Object layer depends on the Content layer.</li>
            <li>The Tiles layer depends on the Content layer.</li>
            <li>The Process layer depends on the Content layer.</li>
            <li>The Provenance layer depends on the Content layer and, if present, the Process layer.</li>
            <li>The Portability layer depends on the Content layer.</li>
          </ul>
          <div className="btn-group" style={{ marginTop: '2rem' }}>
            <Link to="/examples" className="btn btn--outline">See file examples</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
