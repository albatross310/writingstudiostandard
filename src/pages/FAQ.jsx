import { useMeta } from '../useMeta'

const faqs = [
  {
    q: 'Why not just use .docx or PDF?',
    a: 'Those formats store how a document looks, not how it was made — and they’re opaque to read raw. A .studio file keeps the writing legible as plain text, keeps its sources with it, and can carry a verifiable record of the session that produced it. It’s also far easier for a person or a language model to read.',
  },
  {
    q: 'Does it record my keystrokes?',
    a: 'No. Provenance is built from signed hashes of the content and of the constraints applied while writing — never keystroke logs, your text, or your identity. Proving authorship does not require surveillance. Not in the day-to-day, free version, though some Writing Studios may choose to record keystrokes for higher levels of provenance detail. If so, it is HIGHLY RECOMMENDED that keystrokes are stored in the document, not kept on a server (and not seen if possible), and encrypted in the document when stored at rest. But for day-to-day purposes and online sharing, the answer is no: a .studio document does not store keystrokes. And no .studio document needs to.',
  },
  {
    q: 'How can a reader trust the record?',
    a: 'The provenance layer is a hash-chained set of receipts signed with a private key, with document hashes timestamped to the Bitcoin blockchain. Anyone can verify the chain and the anchor in their own browser, against an independently published key — no account, nothing uploaded.',
  },
  {
    q: 'Can I implement only part of the standard?',
    a: 'Yes. Past the readable text, every layer is optional. A conformant tool implements the layers it claims, fully, and a reader can check which layers a given file actually carries.',
  },
  {
    q: 'Who controls the standard? Can I build on it?',
    a: 'No one owns it and there is no certification body. Any software may read, write, extend, and verify the .studio format for any purpose, commercial or otherwise, without permission or fee.',
  },
  {
    q: 'What are the mnemonic tiles I’ve seen mentioned?',
    a: 'A planned layer that links artwork — mnemonic tiles from an open library — to words and passages in the document, as visual memory anchors. It is still in development and not yet part of a conformant implementation.',
  },
  {
    q: 'What are Inkwave Zero and Inkwave Cubed?',
    a: 'Implementations of the standard, not the standard itself. Inkwave Zero is live — a free writing studio that produces, signs, and anchors .studio files. Inkwave Cubed, in development, links verified documents into a network. Other tools may implement the format and remain fully conformant.',
  },
]

export default function FAQ() {
  useMeta({
    title: 'FAQ',
    description: 'Common questions about the Writing Studio Standard — the .studio file, provenance without surveillance, verification, conformance, and building on the format.',
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
        </div>
      </section>
    </main>
  )
}
