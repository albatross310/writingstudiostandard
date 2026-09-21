# Writing Studio Standard

## Engineering specification

**Status:** living specification companion  
**Licence:** Creative Commons Attribution 4.0 International (CC BY 4.0)  
**Primary implementation:** Inkwave

## 1. Purpose

The Writing Studio Standard defines a portable document model for serious writing. A conforming implementation keeps a document's readable text and editable structure, and may preserve the sources, context, media, reading state, snapshots and verification material around that writing.

The standard is broader than a word processor but narrower than a general-purpose personal database. It is intended to stop useful writing context becoming a collection of unrelated browser tabs, provider-specific records and opaque application state.

The standard does not prescribe a user interface, storage vendor, speech model, identity provider, business model or central service.

## 2. Principles

1. **Readable.** A portable record contains a human-readable text representation of the work.
2. **Portable.** A document is data that can be copied, inspected, exported and opened elsewhere.
3. **Source-aware.** References have stable identities, bibliographic metadata and, where required, frozen source material.
4. **Modular.** Email, source-reader, media and voice surfaces share document context without becoming one monolithic editor screen.
5. **User-controlled.** Master files live in a location the writer chooses. Application caches do not become an undisclosed authoritative copy.
6. **Honest.** Provenance describes exactly the technical evidence it contains. It does not claim that a particular person conceived every sentence independently.

## 3. Terms

### Writing Studio

Software that creates, opens or verifies Studio Documents. It preserves the capabilities it understands and clearly declares the capabilities it does not.

### Studio Document

A portable \`.studio\` record with an editable document, a readable representation and zero or more associated capabilities.

### Master item

A source, email, document, picture, movie or audio item kept in a writer-controlled library. A Studio Document carries only the frozen reference or payload it needs.

### Voice edition

A rendered readalong or user recording linked to a stable source revision. A voice edition is separate from its book, reference or email source.

### Verified record

A Studio Document carrying snapshot, signed receipt-chain and/or timestamp evidence. Verification checks the stated evidence; it is not a general AI detector or a certificate of human authorship.

## 4. Current portable record

The current Inkwave export is a versioned JSON container. A representative top-level shape is:

~~~json
{
  "v": 1,
  "summary": {
    "what": "Inkwave provenance record",
    "title": "Example document",
    "verifyAt": "https://iwzero.me/verify"
  },
  "text": "A readable plain-text copy of the work…",
  "exportedAt": "2026-01-01T00:00:00.000Z",
  "document": { "contentJson": { "type": "doc", "content": [] } },
  "snapshots": [],
  "receipts": [],
  "bibliography": []
}
~~~

### 4.1 Summary and readable text

\`summary\` is a short human-facing description of the export. It may state title, word count, snapshot and receipt counts, timestamp status, export time and the verifier URL. It is not the cryptographic source of truth.

\`text\` is a clean plain-text projection of the document. It allows a person to inspect the writing without recreating a rich-text editor. A writer generates it deterministically from the structured document model.

### 4.2 Structured document

\`document\` carries the versioned editable representation. Inkwave currently uses a rich-text tree for headings, paragraphs, lists, tables, block quotes, mathematics, inline formatting, links and citation marks. It also carries document metadata, title, creation time, schema version, document type, toolbar configuration, readalong associations and a document-scoped library where available.

The editable tree is the source of truth. Implementations must not permit the readable projection to silently diverge from it.

### 4.3 Extensibility

Unknown forward-versioned or namespaced fields must be retained on normal open-and-save operations when it is safe to do so. An application that cannot show a field must distinguish “unavailable to this reader” from “not present in the record”.

## 5. Sources and citations

Bibliographic metadata uses Citation Style Language (CSL) JSON-compatible records. Citation marks refer to stable citekeys and may include locators, prefixes and suffixes.

A source may include page, passage and highlight information. PDF highlights are annotation data rather than permanently burned into publisher PDF bytes. A citation occurrence may be linked to the exact source page and passage it uses.

An export may include selected PDF or other source bytes. This is an explicit portability decision, not a requirement that every \`.studio\` clone the writer's complete library. A source can instead be represented by frozen metadata and a stable identifier.

Web references require a user-owned immutable snapshot because a URL can change or disappear. The snapshot is the preserved source; the live URL remains provenance metadata.

## 6. Modules and attachments

A central Studio can open associated modules while preserving one document context. Modules include:

- writing and reference surfaces;
- email drafts and saved messages;
- PDF, EPUB, Markdown, text and web readers;
- pictures, movies and isolated audio;
- Read Along and other voice-reader surfaces.

Opening a module must not manufacture a second master document or silently convert an email into a citation. Module associations carry stable identifiers and usage context.

## 7. Master library and storage model

The developing shared-library model separates user-owned master items from each Studio's frozen subset.

### 7.1 The two durable tiers

The system has exactly two product-visible durable tiers for a Studio use:

1. **Master library item.** The reusable source is kept in a local folder, OneDrive, Google Drive or another provider the writer chooses. Its master record contains a stable ID, provider locator, revision token, content hash and descriptive metadata.
2. **Studio attachment.** The Studio stores the full source or explicit subset it actually uses, bound to the master ID and exact revision. This frozen record keeps the Studio portable and prevents later master edits from silently changing evidence, citations, quoted email or media.

“Two copies” describes these two durable roles for one Studio attachment. If the same master source is deliberately used by three Studios, there is one master and three frozen Studio attachments. Re-attaching a source to the same Studio reuses the existing attachment record and must not duplicate its payload.

There is no hidden third authoritative Inkwave library. OPFS, IndexedDB, thumbnails, page images, waveforms, search indexes and transcoded renditions are derived device caches. They can deduplicate physical bytes and can be evicted, but clearing them must never delete the only master or Studio copy.

### 7.2 Fast first frame and lazy payloads

The cold-open path reads only the compact Studio core: summary, readable text, editable document tree and attachment manifest. Container parsing runs off the main interface. The writer receives the writing surface before library hydration, timestamp work or large source payloads can block it.

The library manifest and lightweight metadata restore after the first reveal. A PDF, EPUB, webpage snapshot, movie, isolated audio file or voice edition is read from SSD cache or fetched from its provider only when the corresponding reader or player opens. Downloaded payloads remain evictable SSD cache data.

The design target is that an Inkwave Studio becomes usable no slower than opening the equivalent writing in Markdown. Large attachments must add work only to the module that requests them, not to the document's initial open.

~~~text
emails/       master email records
emailVoices/  voice editions keyed to stable email/message IDs
books/        references and uncited PDF, EPUB, Markdown, text and web snapshots
bookVoices/   voice editions keyed to stable book/source IDs
~~~

References and ordinary documents are mutually exclusive classifications of one master item. Moving an item between them changes its classification without duplicating its bytes or changing its stable identifier.

The intended providers are a local folder, OneDrive and Google Drive. Local OPFS and IndexedDB data are caches or migration inputs, not an extra hidden source of truth.

## 8. Voice editions and Read Along

Voice features use the same source and library identity model as references and email. A voice edition records the source ID and revision, model and cast information, chapter or passage coverage, text mapping, timing and available audio parts.

The source text and rendered audio are intentionally independent. A writer can evict, replace or decline to sync a voice edition without rewriting or deleting its book or email source. Implementors may support local, cloud or user-recorded rendering, but must record enough information for a reader to identify the edition it is playing.

## 9. Email

Email may be represented as a first-class Studio document with structured To, Cc, Bcc and Subject fields plus an editable body. Provider mailbox views are not automatically Studio Documents: browsing an inbox must not create local records, snapshots or provenance by itself.

Provider synchronisation and sending are implementation capabilities. A record of an email draft is not proof of sending, delivery or receipt unless separate evidence establishes that claim.

## 10. Snapshots and provenance

### 10.1 Snapshot archive

Snapshots record document states and hashes. The archive is grow-only: merges union existing history and must not silently truncate it. A failed read is never interpreted as an empty archive.

### 10.2 Signed receipts

Receipt chains bind canonical content hashes across writing periods. A signing service can receive only hashes, not the document text, keystrokes or writer identity. A verifier must use an independently published public key rather than blindly trusting a key contained in the file.

### 10.3 Timestamp proofs

Snapshots may be timestamped through OpenTimestamps and Bitcoin. The proof binds a document hash to a public-chain commitment. It demonstrates that the matching hash existed by the proof's timestamp boundary; it does not put the document text on-chain.

### 10.4 Verification boundaries

Verification can establish whether declared hashes, signatures, snapshots and timestamp proofs agree. It cannot establish legal identity, rule out all assistance, prove a writer's private intentions or determine that every sentence is human-authored.

## 11. Verified Capture status

Verified Capture is a planned desktop-only extension, not a current public product claim. The proposed Tauri application will bind eligible native input to signed capture intervals and label text as verified, inherited, imported or uncertified.

It is intended to raise the cost of routine browser automation such as Playwright, Selenium, DevTools insertion and clipboard bulk insertion. It must never claim to defeat a hostile operating system, custom hardware injector or a writer who manually retypes generated prose.

## 12. Conformance

A conforming writer:

1. produces a versioned \`.studio\` record with an editable structure and readable text projection;
2. retains fields it does not understand when safely possible;
3. does not silently delete citations, attachments, provenance or evidence during ordinary saves;
4. states which optional capabilities it writes; and
5. makes privacy and provenance claims no stronger than its record supports.

A conforming reader:

1. identifies the record version and available capabilities;
2. exposes the readable text even when a richer feature is unsupported;
3. clearly distinguishes absent, unavailable and failed-to-load material;
4. preserves unknown compatible fields when re-saving; and
5. does not present an unverified or incomplete record as verified.

## 13. Examples

The website's Examples page includes both a toy file and an annotated excerpt from Peter Gibson's Leibniz honours proposal. They demonstrate readable text, a rich document model, CSL bibliography records, pinpointed source passages, selected embedded PDFs, signed receipts and Bitcoin-anchored snapshots.

## 14. Licensing and naming

This specification is available under CC BY 4.0. Implementations may build on it for commercial or non-commercial purposes with attribution.

“Writing Studio Standard”, “Studio Document” and “Inkwave” are names used to identify the format and its implementation. An implementation must not use those names in a way that falsely implies compatibility or endorsement.

## 15. Maintenance

This document is bundled into the website and is downloaded by the **Download engineering spec** button. It is the engineer-facing companion to the public pages. Any change to the public model, terminology, capability status or conformance claim must update this document in the same commit.
