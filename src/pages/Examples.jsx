import { Link } from 'react-router-dom'
import { useMeta } from '../useMeta'

const studioTxtExample = `On Keeping a Commonplace Book
Eleanor Marsh, March 2024

Writing is a practice of accumulation. You read, you mark,
you copy, you arrange. The commonplace book is older than
the printing press: a place to put things worth keeping.

A writing studio does something similar. It keeps not just
the text you wrote, but the conditions in which you wrote it.

---

{
  "studio": "1.0",
  "id": "a3f9d1b2-77e4-4c88-b5c1-0d2e8f4a1234",
  "title": "On Keeping a Commonplace Book",
  "author": "Eleanor Marsh",
  "created": "2024-03-12T09:14:00Z",
  "modified": "2024-03-14T16:42:00Z",
  "layers": {
    "content": true,
    "formatting": true,
    "process": true,
    "provenance": true
  },
  "sessions": [
    { "date": "2024-03-12T09:14:00Z", "duration": 47, "words": 312 },
    { "date": "2024-03-13T08:30:00Z", "duration": 22, "words": 104 },
    { "date": "2024-03-14T16:20:00Z", "duration": 18, "words": 56 }
  ],
  "revisions": [
    { "id": "r1", "label": "First draft",             "ts": "2024-03-12T10:01:00Z" },
    { "id": "r2", "label": "Second paragraph reworked","ts": "2024-03-13T08:52:00Z" }
  ],
  "provenance": {
    "local_history_id": "lh-marsh-2024-commonplace",
    "environment": "inkwave-solo/0.9.4"
  }
}`

export default function Examples() {
  useMeta({
    title: 'File Examples',
    description: 'Sample Studio Documents: essay.studio.txt (prose at top, JSON at bottom) and essay.studio.pdf (PDF with embedded source attachment).',
    path: '/examples',
  })
  return (
    <main>
      <div className="container">
        <div className="page-hero">
          <p className="page-hero__kicker">Examples</p>
          <h1 className="page-hero__title">Sample Studio Documents</h1>
          <p className="page-hero__lead">
            Representative examples. Implementations may use any encoding that satisfies the layer requirements.
          </p>
        </div>
      </div>

      <section>
        <div className="container">
          <p className="section-label">Studio Text</p>
          <h2><code className="tag">essay.studio.txt</code></h2>
          <hr className="divider" />
          <p>
            Human-readable prose at the top. A JSON block at the bottom — separated
            by a horizontal rule — carries process data, layer declarations, and provenance.
            The file is readable as plain text; the JSON is there for software that knows to look.
          </p>
          <div className="file-example" style={{ marginTop: '1.75rem' }}>
            <div className="file-example__header">
              <div className="file-example__dot" />
              <div className="file-example__dot" />
              <div className="file-example__dot" />
              <span style={{ marginLeft: '0.25rem' }}>essay.studio.txt</span>
            </div>
            <pre>{studioTxtExample}</pre>
          </div>
        </div>
      </section>

      <section>
        <div className="container container--narrow">
          <p className="section-label">Studio PDF</p>
          <h2><code className="tag">essay.studio.pdf</code></h2>
          <hr className="divider" />
          <p>
            A standard PDF for reading, sharing, or submission. The source{' '}
            <code className="tag">.studio.txt</code> file is embedded as a PDF attachment,
            making the document self-contained — the rendered view and the full
            editable source travel together.
          </p>
          <p>
            Provenance and standard metadata are also embedded in the PDF's
            document information dictionary.
          </p>
          <div className="card" style={{ marginTop: '1.75rem' }}>
            <p className="card__label">Embedded metadata fields</p>
            <ul className="checklist" style={{ marginTop: '0.75rem' }}>
              <li><code className="tag">Studio-ID</code> — document identity string</li>
              <li><code className="tag">Studio-Author</code> — primary author</li>
              <li><code className="tag">Studio-Created</code> — creation timestamp</li>
              <li><code className="tag">Studio-Modified</code> — last modification</li>
              <li><code className="tag">Studio-Standard</code> — standard version</li>
              <li><code className="tag">Studio-Source</code> — attached source filename</li>
            </ul>
          </div>
          <div className="btn-group" style={{ marginTop: '2rem' }}>
            <Link to="/architecture" className="btn btn--outline">Architecture reference</Link>
            <Link to="/documents" className="btn btn--outline">Document types</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
