import { Link } from 'react-router-dom'
import { useMeta } from '../useMeta'

const faqs = [
  {
    q: 'Is this a file format?',
    a: 'Not exactly. It is a model — layered definitions that describe what a writing studio is and what a Studio Document must contain. Implementations choose their own encodings, provided they satisfy the layer requirements.',
  },
  {
    q: 'Who controls the standard?',
    a: 'No one. The Writing Studio Standard is released under CC0 — public domain. There is no governing body, no certification, and no authority that approves implementations.',
  },
  {
    q: 'Can I implement only part of the standard?',
    a: 'Yes. Layers are independent. A conformant implementation adopts the layers it claims and implements them fully. Claiming no optional layers is valid.',
  },
  {
    q: 'How is a Writing Studio different from a word processor?',
    a: 'A word processor records appearance — typefaces, margins, styles. A Writing Studio records process and context: revision history, writing sessions, layout intent, tile artwork, and provenance. The name is deliberate: a studio is a place for drafting and artwork together.',
  },
  {
    q: 'What does studio.txt actually look like?',
    a: 'Human-readable prose at the top. A JSON block at the bottom, separated by a horizontal rule, carrying layer data, session records, and provenance. The text is readable in any editor; the JSON is there for software.',
  },
  {
    q: 'What is a Studio PDF?',
    a: 'A standard PDF with the source .studio.txt file embedded as an attachment. The rendered view and the full source travel together in one file.',
  },
  {
    q: 'What is keylog data and why is it encrypted?',
    a: 'Keystroke-level process data — the sequence and timing of individual keystrokes during a writing session. It is sensitive personal data and is stored encrypted by conformant implementations.',
  },
  {
    q: 'What is mnemonic tile artwork?',
    a: 'Visual tiles used in a writing studio to represent concepts, scenes, or reference material alongside draft text. Part of the Object layer. The word "mnemonic" reflects their function: they are memory and reference aids, not decoration.',
  },
  {
    q: 'Can I use the .studio.txt extension in my own software?',
    a: 'Yes. The standard is CC0. Use it freely, without permission, attribution, or fee.',
  },
  {
    q: 'What are Inkwave Solo and Inkwave Cubed?',
    a: 'Early experimental implementations of the Writing Studio Standard. They do not define the standard. Other implementations may differ and remain fully conformant.',
  },
]

export default function FAQ() {
  useMeta({
    title: 'FAQ',
    description: 'Common questions about the Writing Studio Standard — what it defines, how conformance works, and how Studio Documents differ from word processor files.',
    path: '/faq',
  })
  return (
    <main>
      <div className="container">
        <div className="page-hero">
          <p className="page-hero__kicker">FAQ</p>
          <h1 className="page-hero__title">Frequently asked questions</h1>
        </div>
      </div>

      <section>
        <div className="container container--narrow">
          <div className="faq-list">
            {faqs.map(item => (
              <div className="faq-item" key={item.q}>
                <p className="faq-item__q">{item.q}</p>
                <p className="faq-item__a">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="btn-group" style={{ marginTop: '3rem' }}>
            <Link to="/standard" className="btn btn--primary">Read the standard</Link>
            <Link to="/architecture" className="btn btn--outline">Architecture</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
