import { useMeta } from '../useMeta'

export default function Contact() {
  useMeta({
    title: 'Contact',
    description: 'Send the Writing Studio Standard maintainer implementation reports, compatibility questions and specification corrections.',
    path: '/contact',
  })

  return (
    <main>
      <section className="hero contact-hero">
        <div className="container container--prose hero__inner">
          <p className="section-label">Contact</p>
          <h1 className="hero__title">Contact and participation</h1>
          <p className="hero__lead">
            Specification development is public. Implementation reports, compatibility questions and
            corrections are welcome.
          </p>
          <div className="btn-group">
            <a href="#feedback" className="btn btn--primary">Leave feedback</a>
          </div>
        </div>
      </section>

      <section>
        <div className="container container--prose">
          <h2 id="feedback">Leave feedback</h2>
          <p>
            The standard is written and maintained by <strong>Peter Gibson</strong>. Implementation reports,
            interoperability tests, corrections and questions are welcome.
          </p>

          <form className="contact-form" action="https://formspree.io/f/mjgqyqrq" method="POST">
            <input type="hidden" name="_subject" value="Writing Studio Standard feedback" />
            <div className="contact-form__identity">
              <label>
                Name
                <input type="text" name="name" autoComplete="name" placeholder="Your name" required />
              </label>
              <label>
                Email
                <input type="email" name="email" autoComplete="email" placeholder="your@email.com" required />
              </label>
            </div>
            <label>
              Message
              <textarea name="message" rows="6" placeholder="What would you like us to know?" required />
            </label>
            <div className="contact-form__actions">
              <button type="submit" className="btn btn--primary">Send feedback</button>
              <p className="contact-form__privacy">
                Submitting sends your name, email, message and standard request metadata to Formspree for
                delivery to Peter. This site uses no analytics or advertising trackers.
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
