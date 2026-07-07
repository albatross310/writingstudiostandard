export default function Contact() {
  return (
    <main>
      <section className="hero">
        <div className="container hero__inner">
          <p className="section-label">Contact</p>
          <h1 className="hero__title">Please do get in touch</h1>
          <p className="hero__lead">
            The Writing Studio Standard is a work in progress, and feedback shapes it — we would really
            appreciate any feedback you can give! Ideas, critiques, implementations, corrections — all
            very welcome :)
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
            The standard is written and maintained by <strong>Peter Gibson</strong>, the developer. If
            you're building a tool, writing about the format, correcting something, or simply have
            thoughts, please reach out at{' '}
            <a href="mailto:petergibson127@gmail.com">petergibson127@gmail.com</a>.
          </p>
          <p style={{ marginTop: '1.25rem' }}>
            You can find some of his other projects at{' '}
            <a href="https://mnemonicecologies.com" target="_blank" rel="noopener noreferrer">mnemonicecologies.com</a>.
          </p>
        </div>
      </section>
    </main>
  )
}
