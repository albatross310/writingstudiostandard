import { Link } from 'react-router-dom'
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
        </div>
        <nav className="footer__nav" aria-label="Footer">
          <Link to="/standard">Standard</Link>
          <Link to="/documents">Documents</Link>
          <Link to="/architecture">Architecture</Link>
          <Link to="/examples">Examples</Link>
          <Link to="/faq">FAQ</Link>
        </nav>
        <p className="footer__copy">
          Writing Studio Standard is an open specification.<br />
          Released for public use without restriction.
        </p>
      </div>
    </footer>
  )
}
