import { useMeta } from '../useMeta'

export default function Contact() {
  useMeta({
    title: 'Contact',
    description: 'Contact the Writing Studio Standard maintainer with implementation reports, compatibility questions and specification corrections.',
    path: '/contact',
  })

  return (
    <main>
      <section className="hero contact-hero">
        <div className="container hero__inner">
          <p className="section-label">Contact</p>
          <h1 className="hero__title">Contact and participation</h1>
          <p className="hero__lead">
            Specification development is public. Implementation reports, compatibility questions and
            corrections are welcome.
          </p>
          <div className="btn-group">
            <a href="mailto:petergibson127@gmail.com" className="btn btn--primary">Email the developer</a>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <h2>Feedback welcome</h2>
          <p>
            The standard is written and maintained by <strong>Peter Gibson</strong>. If you are implementing
            the format, testing interoperability or proposing a correction, contact{' '}
            <a href="mailto:petergibson127@gmail.com">petergibson127@gmail.com</a>.
          </p>
          <p style={{ marginTop: '1.25rem' }}>
            You can find some of his other projects at{' '}
            <a href="https://mnemonicecologies.com" target="_blank" rel="noopener noreferrer">MnemonicEcologies.com</a>.
          </p>
        </div>
      </section>
    </main>
  )
}
