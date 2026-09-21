# Writing Studio Standard

## Engineering specification and reference guide

**Specification status:** living draft
**Specification version:** 0.1
**Licence:** Creative Commons Attribution 4.0 International (CC BY 4.0)  
**Reference implementation:** Inkwave

## 1. Conventions

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHOULD**, **SHOULD NOT** and **MAY** in this document are to be interpreted as normative requirements.

A requirement marked **Current** describes an exported or implemented Inkwave capability. A requirement marked **Planned** defines the intended interoperable extension and is not a claim that every current Studio reader implements it.

Informative examples and answers are included in appendices. They explain the model but do not add conformance requirements.

## 2. Scope

A Writing Studio is software for creating, opening or verifying a Studio Document. The standard defines:

- the portable Studio Document contract;
- readable and structured document representations;
- source, citation, attachment and module relationships;
- user-controlled master libraries and portable Studio attachments;
- optional voice, email, provenance and timestamp capabilities; and
- conformance and claim boundaries.

The standard does not define a required interface, provider, voice engine, identity system, business model or central service.

## 3. Design requirements

A conforming design MUST satisfy the following principles.

1. **Readable record.** A portable record MUST expose a human-readable projection of the writing.
2. **Portable record.** A document MUST remain data that can be copied, inspected and opened independently of one account or vendor.
3. **Source-aware record.** A citation-capable implementation MUST preserve stable source identity and bibliographic metadata.
4. **Modular context.** Reader, email, media and voice surfaces MAY share one Studio context without creating competing master documents.
5. **User-controlled storage.** The writer MUST control the location of durable master files.
6. **Bounded claims.** A provenance implementation MUST state only what its recorded evidence supports.

## 4. Terms

### 4.1 Writing Studio

Software that creates, opens or verifies Studio Documents. It MUST preserve compatible fields it does not interpret whenever safe to do so.

### 4.2 Studio Document

A portable Studio record, normally identified by the .studio extension, containing an editable document, a readable representation and zero or more capability records.

### 4.3 Master item

A reusable source, email, document, picture, movie or audio item held in a writer-controlled library.

### 4.4 Studio attachment

The frozen revision, explicit excerpt or metadata subset of a master item used by one Studio Document.

### 4.5 Voice edition

A rendered readalong or user recording associated with a stable source ID and source revision. A voice edition is separate from the book, reference or email it reads.

### 4.6 Verified record

A Studio Document containing one or more snapshots, signed receipt-chain records or timestamp proofs. This term does not imply that every word was independently conceived by one biological human.

## 5. Portable Studio record

### 5.1 Current export shape

The current Inkwave export is a versioned JSON container. A representative top-level shape is:

~~~json
{
  "v": 1,
  "summary": {
    "what": "Inkwave provenance record",
    "title": "Example document",
    "verifyAt": "https://iwzero.me/verify"
  },
  "text": "Readable plain-text projection",
  "exportedAt": "2026-01-01T00:00:00.000Z",
  "document": {
    "contentJson": { "type": "doc", "content": [] }
  },
  "snapshots": [],
  "receipts": [],
  "bibliography": []
}
~~~

### 5.2 Summary

A writer MAY include a human-facing summary. A summary MAY state title, word count, snapshot count, receipt count, timestamp status, export time and verifier location. A verifier MUST NOT treat summary fields as the cryptographic source of truth.

### 5.3 Readable text projection

A Studio Document MUST contain, or deterministically expose, a readable text projection of its writing. The projection MUST be derived from the editable content rather than edited independently. A reader MUST make the projection available when it cannot render richer document structure.

### 5.4 Editable document

The document field MUST contain a versioned editable representation. Current Inkwave records use a rich-text tree for paragraphs, headings, lists, tables, mathematics, block quotes, marks, links and citation nodes.

An implementation MAY add document type, creation time, schema version, email headers, toolbar configuration, library references and readalong associations. It MUST version such extensions and MUST NOT silently discard them during a normal save.

### 5.5 Forward compatibility

A reader that encounters an unknown compatible field SHOULD retain it exactly when rewriting the record. The interface MUST distinguish unavailable material from absent material and from a failed read.

## 6. Sources and citations

### 6.1 Bibliographic data

Citation records SHOULD use CSL JSON-compatible data. Citation marks MUST refer to stable citekeys and MAY contain a locator, prefix and suffix.

### 6.2 Pinpoints and highlights

A source record MAY identify a page, passage and highlight. PDF highlights SHOULD be stored as annotation data rather than irreversibly written into publisher PDF bytes. An implementation MAY connect a citation occurrence to the exact source location it supports.

### 6.3 Source payloads

A Studio attachment MAY include complete source bytes or an explicit derivative. A writer MUST be able to identify whether an attachment is complete or derivative. An implementation MUST NOT silently replace an original with a truncated clip or excerpt.

### 6.4 Web sources

A web reference that needs stable evidence SHOULD use an immutable writer-owned snapshot. A live URL MAY be retained as provenance metadata but MUST NOT be treated as the durable source itself.

## 7. Storage contract

### 7.1 Two durable tiers

For each Studio use, the system has exactly two product-visible durable tiers:

1. **Master library item.** The reusable original exists in a local folder, OneDrive, Google Drive or another provider chosen by the writer. The master record identifies a stable ID, provider locator, revision token, content hash and metadata.
2. **Studio attachment.** The current Studio contains the full source, explicit subset or metadata it uses, bound to the master ID and exact revision.

The master and Studio attachment are the two durable roles. If one master item is deliberately used by several Studios, each Studio has its own intentional frozen attachment. Re-attaching an item within the same Studio MUST reuse the existing attachment and MUST NOT duplicate its payload.

### 7.2 No third authoritative store

OPFS, IndexedDB, thumbnails, page images, waveform data, search indexes, transcodes and downloaded source bytes are derived device caches. They MAY be evicted or regenerated. They MUST NOT be represented as an independent authoritative library copy. Clearing a cache MUST NOT delete the only master item or Studio attachment.

### 7.3 Logical library layout

The default logical collections are:

~~~text
emails/       master email records
emailVoices/  voice editions keyed to email/message IDs
books/        references and uncited source documents
bookVoices/   voice editions keyed to book/source IDs
~~~

A provider MAY map these logical names to folders, labels, buckets or indexed prefixes. The mapping does not alter stable item IDs.

### 7.4 Classification

A source master MUST have one classification at a time: reference or document. Moving an item between classifications MUST preserve its stable ID and MUST NOT duplicate source bytes. Moving an item to reference SHOULD require a citekey and minimally valid bibliographic metadata.

## 8. Initial open and lazy payload loading

### 8.1 Required open ordering

The initial open path MUST read the compact document core before large attachment payloads. The core consists of the summary, readable text, editable document tree and attachment manifest.

Container parsing SHOULD execute away from the main interaction surface. The writing surface SHOULD appear before library hydration, timestamp work, media decoding or source downloads can block it.

### 8.2 Deferred material

Library metadata MAY restore after the first reveal. A PDF, EPUB, webpage snapshot, movie, isolated audio file or voice edition SHOULD be read from an SSD cache or fetched from its provider only when the associated reader or player is opened.

Large attachment work MUST be attributed to the module requesting it. It MUST NOT be required for an unrelated document's initial open.

### 8.3 Performance target

The target cold-open experience is a usable Studio Document no slower than opening the equivalent writing in Markdown. This target applies to the usable writing surface, not to all optional source or media payloads completing their downloads.

## 9. Modules

A Studio MAY associate the following modules with one document context:

- writing and reference surfaces;
- email drafts and saved messages;
- PDF, EPUB, Markdown, text and web readers;
- pictures, movies and isolated audio; and
- Read Along and other voice-reader surfaces.

Opening a module MUST NOT manufacture a new master document. Opening Voice on an email MUST NOT convert the email to a citation or copy the email body into an email voice store.

## 10. Voice editions and Read Along

A voice edition MUST identify source kind, source ID and source revision. It SHOULD record model or renderer, voice or cast identity, chapter or passage coverage, timing data and available parts.

Audio bytes, timing data and cast metadata MUST remain independent from source text. Removing optional voice audio MUST NOT remove or rewrite its book or email source. A stale source revision MAY invalidate future rendering, but older takes SHOULD remain recoverable until the writer removes them.

## 11. Email

An implementation MAY represent email as a first-class Studio document with structured To, Cc, Bcc and Subject fields plus an editable body.

Browsing a provider mailbox MUST NOT automatically create Studio Documents, snapshots or provenance. A Studio record of an email draft MUST NOT be described as proof of sending, delivery or receipt unless independent message evidence establishes that specific claim.

## 12. Snapshots, receipts and timestamps

A cryptographic hash is a deterministic fixed-length fingerprint calculated from exact content bytes. Identical canonical content MUST produce the same hash; a content change is expected to produce a different hash. Hashes allow a verifier to compare content without sending the document to a signing or timestamp service.

### 12.1 Snapshots

Snapshots record document states and hashes. A snapshot archive MUST be grow-only. Merge operations MUST union history and MUST NOT silently truncate it. A failed read MUST NOT be interpreted as an empty archive.

### 12.2 Signed receipts

A receipt chain binds canonical content hashes across writing periods. A signing service MAY receive content hashes but MUST NOT require document text, keystrokes or writer identity. A verifier MUST use an independently published public key rather than blindly trusting a key provided by the file.

### 12.3 Timestamp proofs

A snapshot MAY carry an OpenTimestamps or Bitcoin-backed proof. The proof demonstrates that the matching hash existed by the proof boundary; it MUST NOT be represented as publication of document text to a public chain.

### 12.4 Verification limits

Verification MAY establish whether hashes, signatures, snapshots and timestamp proofs agree. Where a valid signature or timestamp exists, it MAY establish that the matching content was recorded by the applicable proof boundary and has not subsequently been altered without detection. A hash by itself does not establish who produced the content, how it was entered or whether AI assistance was used. Verification MUST NOT claim to establish legal identity, eliminate all possible assistance, establish private intention or certify the origin of every idea.

## 13. Verified Capture (Planned)

Inkwave is being expanded into a desktop application for macOS and Windows. Verified Capture is a planned, optional desktop-only extension intended to give readers materially higher confidence that certified portions of a Studio were edited inside the Inkwave surface without AI insertion. It is not a current public product claim.

The proposed implementation will bind eligible native input to signed capture intervals and classify text as verified, inherited, imported or uncertified. It is intended to restrict ordinary bulk insertion and raise the cost of routine browser automation, including Playwright, Selenium, DevTools insertion and clipboard insertion.

Verified Capture MUST NOT claim to defeat a hostile operating system, custom hardware injector or manual retyping of generated prose.

## 14. Portability and planned visual layer

An implementation MAY export a fixed-layout PDF, a source-stripped Studio copy or a gzip-compressed Studio file. View settings MAY travel with a document but MUST NOT change its readable text or verification record.

Mnemonic tiles are a planned, provisional visual layer. A tile MAY link to a word, phrase or passage as a visual memory anchor. The underlying word list is intended to be open; tile artwork is produced by an implementation. Mnemonic tiles are not yet required for conformance.

## 15. Conformance

A conforming writer MUST:

1. produce a versioned Studio record with an editable structure and readable text projection;
2. preserve fields it does not understand whenever safely possible;
3. avoid silently deleting citations, attachments, provenance or evidence during ordinary saves;
4. state which optional capabilities it writes; and
5. keep privacy and provenance claims within the record's available evidence.

A conforming reader MUST:

1. identify the record version and available capabilities;
2. expose readable text even when richer content is unsupported;
3. distinguish absent, unavailable and failed-to-load material;
4. preserve unknown compatible fields when re-saving; and
5. avoid presenting an unverified or incomplete record as verified.

## Appendix A: Worked examples (informative)

### A.1 Toy essay: On Artificial Languages

The first website example demonstrates readable text, a rich document model, CSL bibliography data, a pinpoint citation, an optional embedded PDF, signed receipts and an anchored snapshot.

### A.2 Honours proposal: Leibniz and universal constructed language

The second example is an annotated excerpt from Peter Gibson's honours proposal. It demonstrates a long-form argument, source records, a pinned passage from Leibniz's New Essays on Human Understanding, one deliberately embedded PDF and provenance data. Other source PDFs are stripped for size while their citation data and pinpoints remain.

### A.3 Email and voice edition: The First Watch

The third example is a fictional email about a north-wall night watch, with structured headers and an editable body. It also contains an original small scene written in the spirit of a Shakespearean watch scene, a voice cast, source revision, part coverage and timing entries.

Its audio string is intentionally fake Base64 placeholder data. It is not playable and exists only to demonstrate the shape of a rendered audio part.

## Appendix B: Common questions (informative)

### Why not use DOCX or PDF alone?

DOCX focuses on editable presentation and PDF on fixed presentation. A Studio Document can retain readable text, editable structure, source information, working context and optional verification evidence together. It can still export a standard PDF for ordinary delivery.

### Is a Studio file readable without Inkwave?

Yes. It is versioned JSON with a summary and plain-text projection near the beginning. A person can inspect the writing with ordinary tools; a compatible reader can restore richer document structure and supported capabilities.

### What source types are represented?

The current and specified vocabulary includes PDFs, EPUBs, Markdown and text files, immutable webpage snapshots, email, pictures, movies, isolated audio and readalong editions.

### Does ordinary provenance record keystrokes?

No. Ordinary Inkwave provenance uses content hashes, snapshots and signed receipts rather than a surveillance log of every keypress. Verified Capture is a distinct planned extension with explicit, bounded evidence claims.

### How do hashes work, and what do they prove?

A cryptographic hash is a short fingerprint calculated from exact document content. The same content produces the same hash; an edit produces a different one. Inkwave can hash snapshots, link signed receipts to earlier hashes and optionally timestamp a hash. A verifier can use that evidence to detect alteration and establish bounded dating claims. A hash alone cannot identify the writer, explain how text was entered, detect AI assistance or prove that writing occurred inside Inkwave.

### Can Inkwave show that a Studio was written without AI?

Inkwave is being expanded into a desktop application for macOS and Windows. Its planned optional Verified Capture mode is designed to distinguish eligible native editing in the Inkwave surface from imported or uncertified text, restrict ordinary bulk insertion and browser automation, and sign bounded capture intervals. This is intended to provide materially higher confidence than an ordinary web document that certified portions were written in Inkwave without AI insertion. It cannot guarantee that no AI was used: manual retyping, custom input hardware and a compromised operating system remain outside the proof, and the evidence cannot establish who conceived an idea.

## Appendix C: Participation and contact (informative)

The Writing Studio Standard develops in public. Feedback on the specification, implementations, compatibility, terminology and corrections is welcome.

The website contact page provides a feedback form delivered through Formspree. Submitting the form sends the visitor's name, email address, message and standard request metadata to Formspree for delivery to the maintainer. The form is optional; direct email remains available.

Contact: petergibson127@gmail.com
Related work: MnemonicEcologies.com

## 16. Licensing and naming

This specification is available under CC BY 4.0. Implementations may build on it for commercial or non-commercial purposes with attribution.

Writing Studio Standard, Studio Document and Inkwave are names used to identify the format and its implementation. An implementation MUST NOT use them in a way that falsely implies compatibility or endorsement.

## 17. Maintenance

This document is bundled into the website and is downloaded by the **Download engineering spec** button. It is the complete engineer-formatted counterpart to the public pages. Every public terminology, capability, model, FAQ, example, contact or conformance change MUST update this document in the same commit.

The website-generated download inserts the reader's local download date into the specification header and appends the ISO date to the Markdown filename.
