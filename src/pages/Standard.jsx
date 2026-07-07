import { useMeta } from '../useMeta'

const terms = [
  { term: 'Writing Studio', def: 'Software that produces Studio Documents, implementing at least the readable-text layer.' },
  { term: 'Studio Document', def: 'A file conforming to this standard — the readable text plus at least one further layer.' },
  { term: 'The .studio file', def: 'The canonical form: a single JSON file that opens with a human-readable Markdown header carrying the document’s full text. Readable in any editor; verifiable by anyone.' },
  { term: 'Verifiable record', def: 'The signed, hash-chained session data and its public-blockchain anchor, which let a third party confirm an authentic composition without trusting the vendor.' },
]

export default function Standard() {
  useMeta({
    title: 'The Standard',
    description: 'The Writing Studio Standard defines a Writing Studio, the Studio Document, the .studio file, six principles, and what conformance means.',
    path: '/standard',
  })
  return (
    <main>
      <div className="container">
        <div className="page-hero">
          <p className="page-hero__kicker">Specification</p>
          <h1 className="page-hero__title">The Writing Studio Standard</h1>
          <p className="page-hero__lead">
            A definition of what it means for software to be a Writing Studio, and of the open file its
            documents take.
          </p>
        </div>
      </div>

      <section>
        <div className="container container--narrow">
          <p className="section-label">Scope</p>
          <h2>What the standard defines</h2>
          <hr className="divider" />
          <p>
            A text editor stores text. A word processor stores how a document looks. A Writing Studio
            stores the writing together with the sources it rests on and a verifiable record of the session
            that produced it.
          </p>
          <p>
            The standard defines that class of software, the layered document it produces, and the minimum
            each layer must satisfy to be claimed. It does not prescribe user-interface choices, and it
            settles on exactly one interchange file — the <code className="tag">.studio</code> file — so
            documents move between tools without translation.
          </p>
        </div>
      </section>

      <section>
        <div className="container container--narrow">
          <p className="section-label">Definitions</p>
          <h2>Primary terms</h2>
          <hr className="divider" />
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {terms.map(d => (
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
          <p className="section-label">Conformance</p>
          <h2>What conformance means</h2>
          <hr className="divider" />
          <p>
            A <strong>conformant Writing Studio</strong> produces <code className="tag">.studio</code> files
            that carry the readable text and at least one further layer.
          </p>
          <p>
            A <strong>conformant reader</strong> can open the Markdown header of any <code className="tag">.studio</code> file
            as plain text, and — where the provenance layer is present — verify the signed chain and public
            anchor against an independently published key.
          </p>
          <p>
            Conformance is self-declared and self-checkable. There is no authority that certifies
            implementations, and none is needed: the file carries everything required to be read and proven.
          </p>
        </div>
      </section>
    </main>
  )
}
