import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__identity">
            <span className="footer__name">Writing Studio Standard</span>
            <p className="footer__tagline">
              An open standard for documents that carry the work around them.
            </p>
            <p className="footer__tagline footer__status">
              Source libraries, voice editions and Verified Capture each state their own implementation status.
            </p>
          </div>
          <p className="footer__privacy">
            Privacy: no analytics, cookies or advertising trackers. Formspree handles feedback only when
            submitted; Vercel keeps request logs. Fonts are self-hosted.
          </p>
        </div>
        <div className="footer__copy">
          <span className="footer__name footer__credit-spacer" aria-hidden="true">
            Writing Studio Standard
          </span>
          <p className="footer__credit">
            By Peter Gibson — philosophy student,<br className="footer__credit-break" />
            math graduate, and product designer.
          </p>
          <div className="footer__contact">
            <a href="mailto:petergibson127@gmail.com">petergibson127@gmail.com</a>.<br />
            Other projects at <a href="https://mnemonicecologies.com" target="_blank" rel="noopener noreferrer">MnemonicEcologies.com</a>.
          </div>
          <p className="footer__licence">An open specification, published under CC BY 4.0.</p>
        </div>
      </div>
    </footer>
  )
}
