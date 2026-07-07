import { useMeta } from '../useMeta'

const faqs = [
  {
    q: 'Why not just use .docx or PDF?',
    a: 'Those formats store how a document looks, not how it was made — and they’re opaque to read raw. A .studio file keeps the writing legible as plain text, keeps its sources with it, and can carry a verifiable record of the session that produced it. It’s also far easier for a person or a language model to read. And because everything lives in one structured file, it can grow: planned work includes mnemonic-tile artwork anchored to specific passages, the ability to dynamically bring up other .studio files from within a document, and dynamically hyperlinked files — so a reader can navigate a document, and the wider body of work and sources around it, as one connected space with ease.',
  },
  {
    q: 'Does it record my keystrokes?',
    a: (
      <>
        For ordinary use, no. Provenance is built from signed hashes of the content and of the constraints
        applied while writing — never keystroke logs, your text, or your identity. Proving authorship does
        not require surveillance, and it is by no means necessary for a Studio Document to record your
        keystrokes. However, in some versions a Writing Studio may choose to record keystrokes for higher
        levels of provenance detail. If so, it is <em>highly recommended</em> that keystrokes are stored in
        the document, not kept on a server (and not seen if possible), and encrypted in the document when
        stored at rest. But for day-to-day purposes and online sharing, the answer is no: a .studio document
        does not store keystrokes. And no .studio document needs to.
      </>
    ),
  },
  {
    q: 'How does the Bitcoin blockchain work?',
    a: (
      <>
        <p>
          Bitcoin is a public, append-only ledger maintained by a peer-to-peer network with no central
          authority. Transactions are grouped into <em>blocks</em>; each block header contains the SHA-256
          hash of the previous block, so the blocks form a chain in which changing any old block would
          alter every hash after it. Blocks also commit to their transactions through a <em>Merkle tree</em>
          {' '}— a binary tree of hashes whose single 32-byte root sits in the header — so one value fixes
          the entire set of transactions.
        </p>
        <p style={{ marginTop: '0.9rem' }}>
          New blocks are added by <em>proof-of-work</em>. Miners repeatedly hash a candidate block header
          while varying a nonce, searching for an output below a network-set target. Because SHA-256 is
          effectively unpredictable, the only way to find such a hash is brute force, and the difficulty
          auto-adjusts so the network produces roughly one block every ten minutes regardless of total
          computing power. Rewriting history would mean redoing the proof-of-work for the altered block and
          every block after it, faster than the rest of the network extends the honest chain — economically
          infeasible once a block is buried under several confirmations. That is what makes the ledger
          practically immutable and its ordering trustworthy without trusting any party.
        </p>
        <p style={{ marginTop: '0.9rem' }}>
          Timestamping rides on this. To prove a document existed at a point in time you don't put the
          document on-chain; you put a <em>hash</em> of it. OpenTimestamps aggregates many such hashes into
          its own Merkle tree and commits only the root in a single Bitcoin transaction, so millions of
          documents share one on-chain footprint. The resulting proof links your document's hash → the
          Merkle path → the Bitcoin block, and anyone can verify it against the public chain with no server
          and no trust in the timestamper.{' '}
          <a href="https://en.wikipedia.org/wiki/OpenTimestamps" target="_blank" rel="noopener noreferrer">
            OpenTimestamps on Wikipedia →
          </a>
        </p>
      </>
    ),
  },
  {
    q: 'Who controls the standard? Can I build on it?',
    a: 'No one owns it and there is no certification body. Any software may read, write, extend, and verify the .studio format for any purpose, commercial or otherwise, without permission or fee.',
  },
  {
    q: 'What are the mnemonic tiles I’ve seen mentioned?',
    a: 'A planned layer that links artwork — mnemonic tiles — to words and passages in the document, as visual memory anchors. The underlying word list is planned to be open source, but the tiles themselves must be custom-built by each individual Writing Studio. It is still in development and not yet part of a conformant implementation.',
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
                <div className="faq-item__a">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
