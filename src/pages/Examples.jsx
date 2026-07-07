import { useRef, useState, useEffect } from 'react'
import { useMeta } from '../useMeta'

// ── VS Code-style syntax highlighting (Dark+) for the .studio content ──────────────────────────────
const C = {
  key: '#9cdcfe', str: '#ce9178', num: '#b5cea8', kw: '#569cd6',
  punct: '#d4d4d4', comment: '#6a9955', head: '#4ec9b0', text: '#d4d4d4',
}
function tokenize(src) {
  const out = []
  let buf = '', bufC = C.text
  const flush = () => { if (buf) { out.push([buf, bufC]); buf = '' } }
  const emit = (t, c) => { flush(); out.push([t, c]) }
  const add = (ch, c) => { if (c !== bufC) { flush(); bufC = c } buf += ch }
  let i = 0
  while (i < src.length) {
    const two = src.slice(i, i + 2)
    const four = src.slice(i, i + 4)
    if (four === '<!--') { const j = src.indexOf('-->', i); const e = j < 0 ? src.length : j + 3; emit(src.slice(i, e), C.comment); i = e; continue }
    if (two === '/*') { const j = src.indexOf('*/', i); const e = j < 0 ? src.length : j + 2; emit(src.slice(i, e), C.comment); i = e; continue }
    if (two === '//') { const j = src.indexOf('\n', i); const e = j < 0 ? src.length : j; emit(src.slice(i, e), C.comment); i = e; continue }
    const ch = src[i]
    if (ch === '═' || ch === '━') { let j = i; while (j < src.length && (src[j] === '═' || src[j] === '━' || src[j] === ' ')) j++; emit(src.slice(i, j), C.comment); i = j; continue }
    if (ch === '"') {
      let j = i + 1
      while (j < src.length && src[j] !== '"') { if (src[j] === '\\') j++; j++ }
      j++
      let k = j; while (k < src.length && /\s/.test(src[k])) k++
      emit(src.slice(i, Math.min(j, src.length)), src[k] === ':' ? C.key : C.str)
      i = j; continue
    }
    if (/[0-9]/.test(ch) && !/[A-Za-z_]/.test(src[i - 1] || ' ')) {
      let j = i; while (j < src.length && /[0-9.eE+-]/.test(src[j])) j++
      emit(src.slice(i, j), C.num); i = j; continue
    }
    const kw = src.slice(i).match(/^(true|false|null)\b/)
    if (kw) { emit(kw[0], C.kw); i += kw[0].length; continue }
    add(ch, /[{}[\]:,]/.test(ch) ? C.punct : C.text)
    i++
  }
  flush()
  return out
}
function HL({ text }) {
  return <>{tokenize(text).map(([t, c], i) => <span key={i} style={{ color: c }}>{t}</span>)}</>
}

const DIVIDER = `
═══════════════════════════════════════════════════
══════ INKWAVE RECORD · verify at iwzero.me/verify ══════
Everything below is the structured record that proves the
writing above. You don't need to read it — open this file at
iwzero.me/verify to check it.
═══════════════════════════════════════════════════
`

// ── Example 1: a toy file ──────────────────────────────────────────────────────────────────────────
const TOY_BLOCKS = [
  { id: 'header', text: `# On Artificial Languages

*Ada Lindqvist · draft · 11 March 2026 · v1.3*

The dream of a perfect language is old. Leibniz imagined a
*characteristica universalis* in which disputes might be settled
not by rhetoric but by calculation — calculemus, "let us compute."
Later constructed languages traded that ambition for something
humbler: to be spoken.

This essay asks a smaller question. What does a made language keep
that a natural one lets slip? [see: leibniz1666, p. 12]

...` },
  { text: DIVIDER },
  { text: `{
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
               …≈1.2 MB of the source PDF, base64-encoded, elided…
               dHJhaWxlcgo8PC9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCg=="
    }
  },` },
  { id: 'receipts', text: `
  "receipts": [
    { "period": 1, "prevHash": null,
      "contentHash": "9f2c7b1e…c4", "nudgesHash": "a1b2…7e",
      "keyId": "inkwave-signing-v1", "sig": "ed25519:5c2d…9b" },
    { "period": 2, "prevHash": "9f2c7b1e…c4",
      "contentHash": "b7e1442a…03", "nudgesHash": "cc90…5f",
      "keyId": "inkwave-signing-v1", "sig": "ed25519:8a6b…11" }
  ],` },
  { id: 'snapshots', text: `
  "snapshots": [
    { "id": "s1", "createdAt": "2026-03-11T09:14:00Z", "wordCount": 312,
      "contentHash": "9f2c7b1e…c4", "bundleHash": "d4e9…7a",
      "ots": { "status": "confirmed", "bitcoinBlock": 883042 } }
  ],
  "signingKey": {
    "keyId": "inkwave-signing-v1", "alg": "Ed25519",
    "publicKeyHex": "b1fa2bad9c044e7a88d1…"
  }
}
` },
]
const TOY_PARTS = [
  { id: 'header', label: 'The readable text', body: 'Every .studio file opens with a plain-Markdown header holding the whole document. Open it in any text editor — or hand it to a language model — and you can read it straight through, no Studio software required.' },
  { id: 'content', label: 'The document model', body: 'Below the header, the same prose is stored as a structured tree: headings, paragraphs, marks such as emphasis, tables, mathematics. The Markdown header is generated from it, so the two never disagree.' },
  { id: 'bibliography', label: 'A pinpointed citation', body: 'Sources are real bibliographic records. Here a citation is pinned to page 12 of Leibniz’s 1666 book and to a highlighted passage, by its rectangle on the page and the citation occurrence it belongs to.' },
  { id: 'pdf', label: 'An embedded source PDF', body: 'A source PDF can travel inside the document, base64-encoded, so the evidence is in hand and links never rot. Exports can strip these or gzip the whole file for email.' },
  { id: 'receipts', label: 'Signed session receipts', body: 'The writing session is a hash chain of receipts, each signed with a private key. Every receipt carries only hashes of the content and the constraints — never your text or identity.' },
  { id: 'snapshots', label: 'Anchored snapshots', body: 'At meaningful points the document is snapshotted and its hash timestamped to Bitcoin via OpenTimestamps. Once confirmed, the record can be dated by anyone, indefinitely.' },
]

// ── Example 2: a real file (an excerpt of the author's actual honours proposal) ──────────────────────
const REAL_BLOCKS = [
  { id: 'rheader', text: `Honours Proposal                  Peter Gibson

Disclaimer: Claude Opus 4.8 and GPT 5.5 (High) were used
collaboratively as dialog partners, for deep web research, and to
pressure test ideas throughout the formulation of this proposal.
Models were instructed to avoid giving direct writes or rewrites,
and the final prose and intention are my own.

Philosophical Question:

Very broadly, the philosophical question I will be addressing is
whether a universal constructed language of the type the early
modern philosophers envisaged is possible, and why or why not with
reference to the nature of language and how it comes to be.

I will be focussing specifically on a revisionary reading of
Leibniz, and his philosophical answer to this question. [see:
leibniz-new-essays, bk. III]

  … (the full proposal continues in the header) …` },
  { text: DIVIDER },
  { text: `{
  "studio": 1,
  "title": "Honours Proposal",
  "author": "Peter Gibson",
  "markdownHeader": true,
  "scasMode": "server",` },
  { id: 'rbib', text: `
  "bibliography": [
    {
      "id": "leibniz-new-essays",
      "type": "book",
      "title": "New Essays on Human Understanding",
      "author": [{ "family": "Leibniz", "given": "G. W." }],
      "issued": { "date-parts": [[1704]] },
      "_iw": {
        "pdfName": "Leibniz, New Essays … Book III Words.pdf",
        "publiclyAvailable": true,
        "highlights": [
          { "page": 3, "instanceId": "occ-4",
            "text": "languages are the best mirror of the human mind",
            "rects": [{ "x": 0.16, "y": 0.31, "w": 0.62, "h": 0.02 }] }
        ]
      }
    }
    /* Locke, Croft, Hayek, Kirby … the rest of the reading list */
  ],` },
  { id: 'rpdf', text: `
  "pdfs": {
    "leibniz-new-essays": {
      "name": "Leibniz, New Essays … Book III Words.pdf",
      "data": "JVBERi0xLjUKJeLjz9MKMyAwIG9iago8PC9GaWx0ZXI…
               …the ONE source left embedded (Leibniz's reply to
               Locke); every other source PDF stripped for size…
               Cg1lbmRzdHJlYW0KZW5kb2JqCg=="
    }
  },` },
  { id: 'rprov', text: `
  "receipts": [
    { "period": 1, "prevHash": null, "contentHash": "3c8f…d1",
      "nudgesHash": "77ab…09", "keyId": "inkwave-signing-v1",
      "sig": "ed25519:41c9…e2" }
    /* … one signed receipt per writing period … */
  ],
  "snapshots": [
    { "id": "v1", "createdAt": "2026-06-30T22:10:00Z",
      "wordCount": 1840, "contentHash": "3c8f…d1",
      "ots": { "status": "confirmed", "bitcoinBlock": 901173 } }
  ],
  "signingKey": { "keyId": "inkwave-signing-v1", "alg": "Ed25519",
    "publicKeyHex": "b1fa2bad…" }
}
` },
]
const REAL_PARTS = [
  { id: 'rheader', label: 'A real proposal, readable', body: 'This is an excerpt of the author’s actual honours proposal — a revisionary reading of Leibniz on whether a universal constructed language is possible. The whole argument sits in the plain-Markdown header, disclaimer and all, readable with no tooling.' },
  { id: 'rbib', label: 'The reading list, pinpointed', body: 'The real sources travel with the document as CSL records. Leibniz’s New Essays — his reply to Locke — is pinned here to a passage on page 3, tied to the fourth in-text citation occurrence. It’s marked publiclyAvailable, so a "strip public PDFs" export can drop it.' },
  { id: 'rpdf', label: 'One source left embedded', body: 'To keep the file small enough to share, only one source PDF is embedded — Leibniz’s New Essays (the reply to Locke). The rest of the reading list is stripped; the citations and page pins remain, and the PDFs can be re-fetched from their origins.' },
  { id: 'rprov', label: 'Signed and anchored', body: 'The same provenance machinery as the toy file, over real work: hash-chained signed receipts for each writing period, and snapshots whose hashes are timestamped to Bitcoin — so the composition of this proposal can be dated and verified by anyone.' },
]

function Explorer({ filename, blocks, parts, firstId }) {
  const [active, setActive] = useState(firstId)
  const scrollRef = useRef(null)
  const blockRefs = useRef({})
  useEffect(() => {
    const el = blockRefs.current[active], scroller = scrollRef.current
    if (el && scroller) scroller.scrollTo({ top: el.offsetTop - 14, behavior: 'smooth' })
  }, [active])
  const activePart = parts.find(p => p.id === active)
  return (
    <div className="studio-explorer">
      <div className="studio-explorer__file">
        <div className="file-example__header">
          <div className="file-example__dot" /><div className="file-example__dot" /><div className="file-example__dot" />
          <span style={{ marginLeft: '0.25rem' }}>{filename}</span>
        </div>
        <div className="studio-explorer__scroll" ref={scrollRef}>
          <pre>
            {blocks.map((b, i) => (
              <div key={i} ref={el => { if (b.id) blockRefs.current[b.id] = el }}
                className={'studio-block' + (b.id && b.id === active ? ' is-active' : '')}
                onClick={b.id ? () => setActive(b.id) : undefined}
                style={b.id ? { cursor: 'pointer' } : undefined}>
                <HL text={b.text} />
              </div>
            ))}
          </pre>
        </div>
      </div>
      <aside className="studio-explorer__panel">
        <p className="section-label" style={{ marginTop: 0 }}>Interesting parts</p>
        <ul className="studio-explorer__links">
          {parts.map(p => (
            <li key={p.id}>
              <button type="button" className={'studio-explorer__link' + (p.id === active ? ' is-active' : '')}
                onClick={() => setActive(p.id)}>{p.label}</button>
            </li>
          ))}
        </ul>
        <div className="studio-explorer__commentary">
          <p className="card__label">{activePart?.label}</p>
          <p className="card__body">{activePart?.body}</p>
        </div>
      </aside>
    </div>
  )
}

export default function Examples() {
  useMeta({
    title: 'Worked examples',
    description: 'Two annotated .studio files — a toy example and an excerpt of a real honours proposal — scroll the structure and click through the parts: readable text, sources, embedded PDF, signed receipts, and Bitcoin-anchored snapshots.',
    path: '/examples',
  })
  return (
    <main>
      <div className="container">
        <div className="page-hero">
          <p className="page-hero__kicker">Worked examples</p>
          <h1 className="page-hero__title">Two <code className="tag">.studio</code> files, annotated</h1>
          <p className="page-hero__lead">
            Scroll each file on the left; select a part on the right to jump to it and read what it does.
            Syntax-highlighted exactly as your editor would show it.
          </p>
          <p className="page-hero__lead" style={{ marginTop: '0.9rem', fontSize: '0.98rem', color: 'var(--slate)' }}>
            Both files here are heavily stripped down. In practice, a <code className="tag">.studio</code> made
            in Inkwave Writing Studio ranges from a few MB to a hundred or so MB unzipped (much less when
            zipped) — though active engineering work is bringing those sizes down.
          </p>
        </div>
      </div>

      <section>
        <div className="container">
          <p className="section-label">Example one</p>
          <h2>A Toy Example: Leibniz and His World</h2>
          <hr className="divider" />
          <Explorer filename="on-artificial-languages.studio" blocks={TOY_BLOCKS} parts={TOY_PARTS} firstId="header" />
        </div>
      </section>

      <section>
        <div className="container">
          <p className="section-label">Example two</p>
          <h2>A Real Life Example: Leibniz and Universal Constructed Language</h2>
          <hr className="divider" />
          <p style={{ marginBottom: '0.5rem', color: 'var(--slate)', fontSize: '0.95rem', maxWidth: '68ch' }}>
            An excerpt of a real honours proposal, PDF-stripped except one source — Leibniz’s <em>New
            Essays</em>, his reply to Locke.
          </p>
          <Explorer filename="honours-proposal.studio" blocks={REAL_BLOCKS} parts={REAL_PARTS} firstId="rheader" />
        </div>
      </section>
    </main>
  )
}
