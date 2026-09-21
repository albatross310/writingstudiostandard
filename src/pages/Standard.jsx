import { useMeta } from '../useMeta'
import DownloadSpecButton from '../components/DownloadSpecButton'

export default function Standard() {
  useMeta({
    title: null,
    description: 'A plain-language introduction to the Writing Studio Standard and its portable, source-aware document format.',
    path: '/',
  })

  return (
    <main>
      <div className="container container--prose">
        <div className="page-hero">
          <p className="page-hero__kicker">What it is</p>
          <h1 className="page-hero__title">A writing file that keeps more than the words</h1>
          <p className="page-hero__lead">
            A Studio Document keeps the writing together with the sources you used, emails or
            recordings connected to the project, and a record of important changes.
          </p>
          <p className="page-hero__lead page-hero__lead--secondary">
            The aim is simple: you should be able to read the writing without Inkwave, move the file
            to another compatible app, and see clearly which extra features and evidence it contains.
          </p>
          <div className="btn-group"><DownloadSpecButton /></div>
        </div>
      </div>

      <section>
        <div className="container container--prose">
          <p className="section-label">The basic idea</p>
          <h2>Three things to know</h2>
          <hr className="divider" />
          <div className="trio-grid">
            <article className="card">
              <p className="card__label">The writing stays readable</p>
              <p className="card__body">Every file includes ordinary readable text as well as the structured version used for editing.</p>
            </article>
            <article className="card">
              <p className="card__label">Your sources stay yours</p>
              <p className="card__body">Original books, emails and media remain in storage you choose. A document carries only the material it actually uses.</p>
            </article>
            <article className="card">
              <p className="card__label">Evidence has limits</p>
              <p className="card__body">Hashes and timestamps can show that exact content existed or changed. They cannot prove who had an idea or that no AI was involved.</p>
            </article>
          </div>
        </div>
      </section>

      <section>
        <div className="container container--prose">
          <p className="section-label">Minimum rules</p>
          <h2>What compatible software must preserve</h2>
          <hr className="divider" />
          <ul className="checklist">
            <li>The readable text and the structured, editable document.</li>
            <li>Sources, citations and attached evidence that the software can safely carry forward.</li>
            <li>A clear distinction between material that is absent, unavailable or invalid.</li>
            <li>Enough information to identify optional parts before large files are loaded.</li>
            <li>Claims about authorship or history that do not go beyond the recorded evidence.</li>
          </ul>
        </div>
      </section>

      <section>
        <div className="container container--prose">
          <p className="section-label">Licence</p>
          <h2>Open to implement</h2>
          <hr className="divider" />
          <p>
            The Writing Studio Standard is published under the{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
              Creative Commons Attribution 4.0 International licence
            </a>. Anyone may implement or extend it with attribution.
          </p>
          <p style={{ marginTop: '1rem', color: 'var(--quiet)', fontSize: '0.95rem' }}>
            “Writing Studio Standard”, “Studio Document” and “Inkwave” identify the standard and its
            reference implementation. Their names should not be used to imply compatibility that has
            not been tested.
          </p>
        </div>
      </section>
    </main>
  )
}
