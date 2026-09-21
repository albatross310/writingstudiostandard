import { useRef, useState, useEffect } from 'react'
import { useMeta } from '../useMeta'

// ── VS Code-style syntax highlighting (Dark+) for the .studio content ──────────────────────────────
const C = {
  key: '#d7dadd', str: '#f1f1ef', num: '#b7bbbd', kw: '#e2e4e5',
  punct: '#a4a8aa', comment: '#7f8588', head: '#ffffff', text: '#cdd0d2',
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

// ── Example 1: a toy file ──────────────────────────────────────────────────────────────────────────
const TOY_BLOCKS = [
  { id: 'header', text: `{
  "v": 1,
  "summary": {
    "title": "On Artificial Languages",
    "words": 312,
    "verifyAt": "https://iwzero.me/verify"
  },
  "text": "On Artificial Languages\\n\\nAda Lindqvist — draft\\n\\nThe dream of a perfect language is old. Leibniz imagined a characteristica universalis in which disputes might be settled by calculation. This essay asks what a made language keeps that a natural one lets slip. (leibniz1666, p. 12)",` },
  { id: 'content', text: `
  "document": {
    "id": "b1fa2bad-9c04-4e7a-88d1-3f0a12c4e5d6",
    "title": "On Artificial Languages",
    "contentJson": {
      "type": "doc",
      "content": [
        { "type": "heading", "attrs": { "level": 1 },
          "content": [{ "type": "text",
            "text": "On Artificial Languages" }] },
        { "type": "paragraph", "content": [
          { "type": "text",
            "text": "The dream of a perfect language is old. " },
          { "type": "text", "marks": [{ "type": "em" }],
            "text": "characteristica universalis" }
        ] }
      ]
    }
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
  { id: 'header', label: 'Summary and readable text', body: 'The versioned record begins with a compact summary and deterministic plain-text projection. A person or language model can inspect the writing without rebuilding the editor.' },
  { id: 'content', label: 'The document model', body: 'The document field holds the editable structured tree: headings, paragraphs, marks, tables and mathematics. The readable text is generated from this source of truth.' },
  { id: 'bibliography', label: 'A pinpointed citation', body: 'Sources are real bibliographic records. Here a citation is pinned to page 12 of Leibniz’s 1666 book and to a highlighted passage, by its rectangle on the page and the citation occurrence it belongs to.' },
  { id: 'pdf', label: 'An embedded source PDF', body: 'A source PDF can travel inside the document, base64-encoded, so the evidence is in hand and links never rot. Exports can strip these or gzip the whole file for email.' },
  { id: 'receipts', label: 'Signed session receipts', body: 'The writing session is a hash chain of receipts, each signed with a private key. Every receipt carries only hashes of the content and the constraints — never your text or identity.' },
  { id: 'snapshots', label: 'Anchored snapshots', body: 'At meaningful points the document is snapshotted and its hash timestamped to Bitcoin via OpenTimestamps. Once confirmed, the record can be dated by anyone, indefinitely.' },
]

// ── Example 2: a real file (an excerpt of the author's actual honours proposal) ──────────────────────
const REAL_BLOCKS = [
  { id: 'rheader', text: `{
  "v": 1,
  "summary": {
    "title": "Honours Proposal",
    "author": "Peter Gibson",
    "verifyAt": "https://iwzero.me/verify"
  },
  "text": "Honours Proposal\\n\\nDisclaimer: AI models were used as dialogue partners for research and pressure-testing. The final prose and intention are my own.\\n\\nPhilosophical Question:\\n\\nIs a universal constructed language of the kind early modern philosophers envisaged possible? This proposal develops a revisionary reading of Leibniz. (leibniz-new-essays, bk. III)",` },
  { id: 'rdoc', text: `
  "document": {
    "id": "honours-proposal-01",
    "title": "Honours Proposal",
    "schemaVersion": "1",
    "scasMode": "server",
    "contentJson": {
      "type": "doc",
      "content": [/* full editable proposal tree */]
    }
  },` },
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
  { id: 'rheader', label: 'A real proposal, readable', body: 'This is an excerpt of the author’s honours proposal: a revisionary reading of Leibniz on language, combinatorics, compossibility and petites perceptions. Its summary and plain-text projection remain inspectable without Studio software.' },
  { id: 'rdoc', label: 'The editable proposal', body: 'The document field contains the complete versioned rich-text tree. The readable projection is derived from that tree rather than maintained as a competing copy.' },
  { id: 'rbib', label: 'The reading list, pinpointed', body: 'The real sources travel with the document as CSL records. Leibniz’s New Essays — his reply to Locke — is pinned here to a passage on page 3, tied to the fourth in-text citation occurrence. It’s marked publiclyAvailable, so a "strip public PDFs" export can drop it.' },
  { id: 'rpdf', label: 'One source left embedded', body: 'To keep the file small enough to share, only one source PDF is embedded — Leibniz’s New Essays (the reply to Locke). The rest of the reading list is stripped; the citations and page pins remain, and the PDFs can be re-fetched from their origins.' },
  { id: 'rprov', label: 'Signed and anchored', body: 'The same provenance machinery as the toy file, over real work: hash-chained signed receipts for each writing period, and snapshots whose hashes are timestamped to Bitcoin — so the composition of this proposal can be dated and verified by anyone.' },
]

// ── Example 3: an original night-watch email with an illustrative voice edition ─────────────────────
const EMAIL_VOICE_BLOCKS = [
  { id: 'eheader', text: `{
  "v": 1,
  "summary": {
    "title": "Please attend the north watch",
    "what": "Studio email with voice edition"
  },
  "text": "To: Horatio Vale\\nFrom: Marcellus Reed\\nSubject: Please attend the north watch\\n\\nAt the second bell, Bernardo and I saw the armoured figure again. Come before midnight.",` },
  { id: 'email', text: `
  "document": {
    "id": "north-watch-email-01",
    "docType": "email",
    "email": {
      "to": ["horatio@elsinore.example"],
      "from": "marcellus@elsinore.example",
      "subject": "Please attend the north watch"
    },
    "contentJson": { "type": "doc", "content": [] }
  },` },
  { id: 'scene', text: `  "voiceEdition": {
    "editionId": "north-platform-scene-v1",
    "sourceKind": "email",
    "sourceId": "north-watch-email-01",
    "sourceRevision": "sha256:FAKE_EMAIL_REVISION",
    "title": "The First Watch",
    "cast": [
      { "role": "Narrator", "voice": "grey-harbour" },
      { "role": "Bernardo", "voice": "north-wind" },
      { "role": "Francisco", "voice": "low-lantern" }
    ],
    "script": [
      "NARRATOR: Wind crosses the north wall.",
      "BERNARDO: Who keeps the watch?",
      "FRANCISCO: Name yourself before you come closer."
    ],` },
  { id: 'audio', text: `    "parts": [{
      "id": "north-platform-01",
      "status": "recorded",
      "durationMs": 18400,
      "audio": "RkFLRV9BVURJT19CWVRFU19OT1RfUExBWUFCTEU=",
      "audioNote": "Illustrative placeholder; not playable.",
      "timing": [
        { "text": "Wind", "startMs": 0, "endMs": 340 },
        { "text": "crosses", "startMs": 360, "endMs": 820 },
        { "text": "the north wall", "startMs": 850, "endMs": 1410 }
      ]
    }]
  }
}
` },
]
const EMAIL_VOICE_PARTS = [
  { id: 'eheader', label: 'Readable email record', body: 'The summary and plain-text projection make the message inspectable before any provider or voice payload loads.' },
  { id: 'email', label: 'Structured email metadata', body: 'The document declares its email type and carries its To, From and Subject fields beside the editable body. This example uses fictional addresses.' },
  { id: 'scene', label: 'A voice edition with a cast', body: 'The short original night-watch scene is deliberately Hamlet-like without reproducing the play. A voice edition names its source, source revision, title, cast and script.' },
  { id: 'audio', label: 'Audio bytes and timing', body: 'The audio string is an illustrative Base64 placeholder. It demonstrates where a real rendered part, duration and word timings would live without pretending the page contains playable audio.' },
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
          <div className="studio-explorer__code">
            {blocks.map((b, i) => (
              <button type="button" key={b.id ?? i} ref={el => { if (b.id) blockRefs.current[b.id] = el }}
                className={'studio-block' + (b.id && b.id === active ? ' is-active' : '')}
                onClick={() => { if (b.id) setActive(b.id) }}
                disabled={!b.id}>
                <HL text={b.text} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <aside className="studio-explorer__panel">
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
    description: 'Three annotated .studio files: a toy essay, an honours proposal and an email with a multi-voice recording edition.',
    path: '/examples',
  })
  return (
    <main>
      <div className="container container--prose">
        <div className="page-hero">
          <p className="page-hero__kicker">Worked examples</p>
          <h1 className="page-hero__title">Three <code className="tag">.studio</code> files, annotated</h1>
          <p className="page-hero__lead">
            Inspect each record on the left; select a labelled part on the right to see its role in the
            portable document contract.
          </p>
          <p className="page-hero__lead" style={{ marginTop: '0.9rem', fontSize: '0.98rem', color: 'var(--quiet)' }}>
            The examples elide large payloads. Indexed implementations reveal the compact document core
            first and load PDF, media and voice bytes only when their modules request them.
          </p>
        </div>
      </div>

      <section>
        <div className="container container--prose">
          <p className="section-label">Example one</p>
          <h2>A Toy Example: Leibniz and His World</h2>
          <hr className="divider" />
          <Explorer filename="on-artificial-languages.studio" blocks={TOY_BLOCKS} parts={TOY_PARTS} firstId="header" />
        </div>
      </section>

      <section>
        <div className="container container--prose">
          <p className="section-label">Example two</p>
          <h2>A Real Life Example: Leibniz and Universal Constructed Language</h2>
          <hr className="divider" />
          <p style={{ marginBottom: '0.5rem', color: 'var(--quiet)', fontSize: '0.95rem', maxWidth: '68ch' }}>
            An excerpt of a real honours proposal, PDF-stripped except one source — Leibniz’s <em>New
            Essays</em>, his reply to Locke.
          </p>
          <Explorer filename="honours-proposal.studio" blocks={REAL_BLOCKS} parts={REAL_PARTS} firstId="rheader" />
        </div>
      </section>

      <section>
        <div className="container container--prose">
          <p className="section-label">Example three</p>
          <h2>A Toy Email and a Voice Recording</h2>
          <hr className="divider" />
          <p style={{ marginBottom: '0.5rem', color: 'var(--quiet)', fontSize: '0.95rem', maxWidth: '68ch' }}>
            A fictional message about a night watch, followed by an original, Hamlet-like scene and a
            clearly labelled illustrative audio payload. It shows how email and a voice edition stay connected
            without making the audio part of the source email itself.
          </p>
          <Explorer filename="north-watch-email.studio" blocks={EMAIL_VOICE_BLOCKS} parts={EMAIL_VOICE_PARTS} firstId="eheader" />
        </div>
      </section>
    </main>
  )
}
