import { useRef, useState, useEffect } from 'react'
import { useMeta } from '../useMeta'

// A realistic (illustrative) .studio file — PDF-stripped except one embedded source. Split into blocks so
// the "interesting parts" links can scroll to + highlight them and show commentary. Not a real thesis.
const BLOCKS = [
  { id: 'header', text: `# On Artificial Languages

*Ada Lindqvist · draft · 11 March 2026 · v1.3*

The dream of a perfect language is old. Leibniz imagined a
*characteristica universalis* in which disputes might be settled
not by rhetoric but by calculation — calculemus, "let us compute."
Later constructed languages traded that ambition for something
humbler: to be spoken.

This essay asks a smaller question. What does a made language keep
that a natural one lets slip? A grammar with no exceptions is also
a grammar with no history. [see: leibniz1666, p. 12]

...` },
  { text: `
<!-- Everything above is the document, in plain Markdown. You are
     reading it now with no Studio software at all. Everything below
     is the machine-readable body: structure, sources, and the signed
     record of how this file was written. It is never needed to READ
     the document — only to edit or verify it. -->
` },
  { text: `
{
  "studio": 1,
  "id": "b1fa2bad-9c04-4e7a-88d1-3f0a12c4e5d6",
  "title": "On Artificial Languages",
  "markdownHeader": true,` },
  { id: 'content', text: `
  "content": {
    "type": "doc",
    "content": [
      { "type": "heading", "attrs": { "level": 1 },
        "content": [{ "type": "text", "text": "On Artificial Languages" }] },
      { "type": "paragraph", "content": [
        { "type": "text", "text": "The dream of a perfect language is old. " },
        { "type": "text", "marks": [{ "type": "em" }],
          "text": "characteristica universalis" }
      ] }
      /* …the full editable document tree… */
    ]
  },` },
  { id: 'bibliography', text: `
  "bibliography": [
    {
      "id": "leibniz1666",
      "type": "book",
      "title": "Dissertatio de Arte Combinatoria",
      "author": [{ "family": "Leibniz", "given": "G. W." }],
      "issued": { "date-parts": [[1666]] },
      "_iw": {
        "pdfName": "leibniz-1666.pdf",
        "highlights": [
          { "page": 12, "instanceId": "cite-occ-1",
            "text": "an alphabet of human thoughts",
            "rects": [{ "x": 0.14, "y": 0.42, "w": 0.55, "h": 0.02 }] }
        ]
      }
    }
  ],` },
  { id: 'pdf', text: `
  "pdfs": {
    "leibniz1666": {
      "name": "leibniz-1666.pdf",
      "data": "JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PC9UeXBlL1BhZ2Vz
               R2VuZXJhdGVkIGJ5IElua3dhdmUgWmVyby4uLg==
               …≈1.2 MB of the source PDF, base64-encoded, elided…
               …dHJhaWxlcgo8PC9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCg==
               JVUlPRgo="
    }
  },` },
  { id: 'scas', text: `
  "scas": {
    "mode": "server",
    "poolId": "iw-pool-2026-03",
    "setSize": 141,
    "sessionSeed": "3a91c0f7"
  },` },
  { id: 'receipts', text: `
  "receipts": [
    { "period": 1, "prevHash": null,
      "contentHash": "9f2c7b1e…c4", "nudgesHash": "a1b2…7e",
      "keyId": "inkwave-signing-v1",
      "sig": "ed25519:5c2d8a1f…9b" },
    { "period": 2, "prevHash": "9f2c7b1e…c4",
      "contentHash": "b7e1442a…03", "nudgesHash": "cc90…5f",
      "keyId": "inkwave-signing-v1",
      "sig": "ed25519:8a6b04d2…11" }
  ],` },
  { id: 'snapshots', text: `
  "snapshots": [
    { "id": "s1", "createdAt": "2026-03-11T09:14:00Z", "wordCount": 312,
      "contentHash": "9f2c7b1e…c4", "bundleHash": "d4e9…7a",
      "ots": { "status": "confirmed", "bitcoinBlock": 883042 } },
    { "id": "s2", "createdAt": "2026-03-11T10:02:00Z", "wordCount": 468,
      "contentHash": "b7e1442a…03", "bundleHash": "1c55…9e",
      "ots": { "status": "pending" } }
  ],` },
  { id: 'key', text: `
  "signingKey": {
    "keyId": "inkwave-signing-v1",
    "alg": "Ed25519",
    "publicKeyHex": "b1fa2bad9c044e7a88d1…"
  }
}
` },
]

const PARTS = [
  { id: 'header', label: 'The readable text', body: 'Every .studio file opens with a plain-Markdown header holding the whole document. Open it in any text editor — or hand it to a language model — and you can read it straight through, no Studio software required. The human-readable content can never be locked behind the machinery below it.' },
  { id: 'content', label: 'The document model', body: 'Below the header, the same prose is stored as a structured tree: headings, paragraphs, marks such as emphasis, tables, mathematics. This is the faithful editable form the software round-trips; the Markdown header is generated from it, so the two never disagree.' },
  { id: 'bibliography', label: 'A pinpointed citation', body: 'Sources are real bibliographic records. Here a citation is pinned to page 12 of Leibniz’s 1666 book and to a specific highlighted passage — “an alphabet of human thoughts” — by its rectangle on the page and the citation occurrence it belongs to. In the editor, the citation opens that source at exactly that spot.' },
  { id: 'pdf', label: 'An embedded source PDF', body: 'A source PDF can travel inside the document, base64-encoded, so the evidence is in hand and links never rot. One is left in here; the rest were stripped for size. A single export can drop the sources marked public, and the whole file gzips for email.' },
  { id: 'scas', label: 'The authorship signal', body: 'Rather than logging keystrokes, the tool applies gentle, unpredictable constraints while you write and records only how you respond. This block names the constraint pool and its size — enough to check the friction later, with nothing that watches you.' },
  { id: 'receipts', label: 'Signed session receipts', body: 'The writing session is a hash chain of receipts, each signed with a private key. Every receipt carries only cryptographic hashes of the content and the constraints — never your text or identity. The prevHash links them, so no period can be silently removed or reordered.' },
  { id: 'snapshots', label: 'Anchored snapshots', body: 'At meaningful points the document is snapshotted and its hash timestamped to the Bitcoin blockchain through OpenTimestamps. Once confirmed — here, block 883,042 — the record can be dated by anyone, indefinitely, without trusting any company to still exist.' },
  { id: 'key', label: 'The verification key', body: 'The file names the key it was signed with, but a verifier checks against the independently published key, not this claim. Dropped into a verification page, the whole chain is checked in the reader’s browser — content integrity, signatures, constraint consistency, and the Bitcoin anchor — with no account and nothing uploaded.' },
]

export default function Examples() {
  useMeta({
    title: 'A .studio file, annotated',
    description: 'A worked, interactive example of a .studio file: scroll the real structure and click through its parts — readable text, sources, an embedded PDF, the authorship signal, signed receipts, and Bitcoin-anchored snapshots.',
    path: '/examples',
  })
  const [active, setActive] = useState('header')
  const scrollRef = useRef(null)
  const blockRefs = useRef({})

  useEffect(() => {
    const el = blockRefs.current[active]
    const scroller = scrollRef.current
    if (el && scroller) scroller.scrollTo({ top: el.offsetTop - 14, behavior: 'smooth' })
  }, [active])

  const activePart = PARTS.find(p => p.id === active)

  return (
    <main>
      <div className="container">
        <div className="page-hero">
          <p className="page-hero__kicker">A worked example</p>
          <h1 className="page-hero__title">A <code className="tag">.studio</code> file, annotated</h1>
          <p className="page-hero__lead">
            One illustrative file. Scroll it on the left; select a part on the right to jump to it and read
            what it does. This is exactly the shape a Writing Studio produces.
          </p>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="studio-explorer">
            <div className="studio-explorer__file">
              <div className="file-example__header">
                <div className="file-example__dot" />
                <div className="file-example__dot" />
                <div className="file-example__dot" />
                <span style={{ marginLeft: '0.25rem' }}>on-artificial-languages.studio</span>
              </div>
              <div className="studio-explorer__scroll" ref={scrollRef}>
                <pre>
                  {BLOCKS.map((b, i) => (
                    <div
                      key={i}
                      ref={el => { if (b.id) blockRefs.current[b.id] = el }}
                      className={'studio-block' + (b.id && b.id === active ? ' is-active' : '')}
                      onClick={b.id ? () => setActive(b.id) : undefined}
                      style={b.id ? { cursor: 'pointer' } : undefined}
                    >{b.text}</div>
                  ))}
                </pre>
              </div>
            </div>

            <aside className="studio-explorer__panel">
              <p className="section-label" style={{ marginTop: 0 }}>Interesting parts</p>
              <ul className="studio-explorer__links">
                {PARTS.map(p => (
                  <li key={p.id}>
                    <button
                      type="button"
                      className={'studio-explorer__link' + (p.id === active ? ' is-active' : '')}
                      onClick={() => setActive(p.id)}
                    >{p.label}</button>
                  </li>
                ))}
              </ul>
              <div className="studio-explorer__commentary">
                <p className="card__label">{activePart?.label}</p>
                <p className="card__body">{activePart?.body}</p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}
