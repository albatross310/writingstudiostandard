import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__name">Writing Studio Standard</span>
          <p className="footer__tagline">
            An open standard for documents that remember how they were made.
          </p>
          <p className="footer__tagline" style={{ marginTop: '0.6rem', opacity: 0.8 }}>
            The mnemonic-tile layer is still in development.
          </p>
          <p className="footer__tagline" style={{ marginTop: '0.6rem', fontSize: '0.8125rem', opacity: 0.7, maxWidth: '44ch' }}>
            Privacy: this site collects nothing — no analytics, no cookies, no tracking.
            Fonts are served from this domain. Our host (Vercel) keeps standard server request logs.
          </p>
        </div>
        <p className="footer__copy" style={{ marginLeft: 'auto', textAlign: 'right', marginTop: '100px' }}>
          By Peter Gibson — Philosopher, Creator, and Developer.<br />
          <a href="mailto:petergibson127@gmail.com" style={{ color: 'inherit' }}>petergibson127@gmail.com</a>.<br />
          Other projects at <a href="https://mnemonicecologies.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>mnemonicecologies.com</a>.<br />
          An open specification, released for public use without restriction.
        </p>
      </div>
    </footer>
  )
}
