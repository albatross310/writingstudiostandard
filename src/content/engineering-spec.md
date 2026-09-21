# Writing Studio Standard

## Engineering specification and reference guide

**Specification status:** living draft
**Specification version:** 0.2
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

### 5.6 Capability declaration

A record SHOULD declare the optional capabilities it carries before a reader attempts to load their payloads. A capability declaration MUST identify a stable capability name and schema version. It MAY also identify byte ranges, attachment IDs, media types and integrity hashes. Capability discovery MUST NOT require decoding every attachment.

A reader MUST distinguish four states:

- **absent** — the record does not declare the capability;
- **present** — the record declares the capability and its required fields are available;
- **unavailable** — the capability is declared but the current reader does not implement it or cannot currently access its external payload; and
- **invalid** — declared material fails schema, integrity or dependency checks.

An unavailable capability MUST NOT be reported as absent. An invalid capability MUST NOT be silently ignored when it affects document meaning, citations, evidence or export fidelity.

### 5.7 Canonical content and derived projections

The structured document is the editable source of truth. `text`, summary counts, search indexes, rendered HTML, thumbnails and similar views are derived. A conforming writer MUST regenerate a derived projection after any edit that changes its source fields. A verifier MUST hash a documented canonical representation rather than platform-dependent in-memory objects.

Canonicalization MUST define text encoding, property ordering, number representation, line endings and the inclusion or exclusion of derived fields. Two implementations using the same schema version and canonicalization profile MUST produce the same canonical bytes for semantically identical covered fields.

### 5.8 Record identity and time fields

A Studio Document SHOULD carry a stable document ID that survives ordinary renaming and relocation. `exportedAt` describes the creation of one exported package; it MUST NOT be treated as document creation time, proof time or last-edit time. Creation, modification, snapshot, receipt, anchor and export times MUST use distinct fields and SHOULD use RFC 3339 timestamps.

### 5.9 Record envelope contract

The following catalogue combines current fields and specified extension points. Optional arrays MAY be omitted when absent; if present they MUST have the stated element kind. A reader MUST NOT infer presence from summary counts.

~~~ts
type StudioRecord = {
  v: number
  id?: string
  summary?: Summary
  text: string
  exportedAt?: string
  document: {
    id?: string
    title?: string
    docType?: "document" | "email"
    schemaVersion?: string
    contentJson: DocumentNode
    email?: EmailHeaders
  }
  capabilities?: CapabilityDeclaration[]
  attachments?: Attachment[]
  bibliography?: CSLItem[]
  pdfs?: Record<string, LegacyEmbeddedPdf>
  modules?: ModuleAssociation[]
  voiceEditions?: VoiceEdition[]
  receipts?: Receipt[]
  snapshots?: Snapshot[]
  signingKey?: SigningKeyReference
  extensions?: Record<string, unknown>
}
~~~

`pdfs` and a singular `voiceEdition` occur in current illustrative records and MAY be accepted as legacy-compatible spellings. New schemas SHOULD use the general attachment and plural capability models. A migration MUST preserve payload identity and MUST NOT silently create two authoritative copies.

### 5.10 Field ownership and merges

Each extension SHOULD declare which fields it owns and whether they are replaceable, append-only, set-like or derived. Structured document edits replace the current editable state while snapshots and receipts are append-only. Bibliography and attachment manifests are keyed collections. Derived fields are recomputed.

When two copies diverge, a merger MUST NOT choose one append-only history solely because its document edit time is newer. It SHOULD union independently valid history entries by stable ID, detect conflicting entries with the same ID, and report conflicts affecting canonical content or evidence. Unknown fields MUST remain associated with their owning object during a merge.

## 6. Sources and citations

### 6.1 Bibliographic data

Citation records SHOULD use CSL JSON-compatible data. Citation marks MUST refer to stable citekeys and MAY contain a locator, prefix and suffix.

### 6.2 Pinpoints and highlights

A source record MAY identify a page, passage and highlight. PDF highlights SHOULD be stored as annotation data rather than irreversibly written into publisher PDF bytes. An implementation MAY connect a citation occurrence to the exact source location it supports.

### 6.3 Source payloads

A Studio attachment MAY include complete source bytes or an explicit derivative. A writer MUST be able to identify whether an attachment is complete or derivative. An implementation MUST NOT silently replace an original with a truncated clip or excerpt.

### 6.4 Web sources

A web reference that needs stable evidence SHOULD use an immutable writer-owned snapshot. A live URL MAY be retained as provenance metadata but MUST NOT be treated as the durable source itself.

### 6.5 Attachment descriptors

An attachment descriptor SHOULD include:

~~~ts
type Attachment = {
  id: string
  masterId?: string
  revision?: string
  role: "source" | "excerpt" | "image" | "movie" | "audio" | "voice"
  mediaType: string
  byteLength?: number
  contentHash?: string
  storage: "embedded" | "linked" | "deferred"
  locator?: string
  derivativeOf?: string
}
~~~

An embedded attachment MUST be recoverable from the Studio without its provider. A linked attachment MUST state that it depends on an external locator. A deferred attachment MUST preserve enough identity and integrity metadata to detect retrieval of the wrong revision. Locator values are operational hints; stable IDs, revisions and content hashes provide identity.

### 6.6 Citation occurrence identity

A citekey identifies a bibliographic work. A citation occurrence ID identifies one use of that work in the document. Pinpoints, prefixes, suffixes and highlights that support a particular claim SHOULD bind to the occurrence ID, not merely to the citekey. Deleting one occurrence MUST NOT delete a highlight used by another occurrence without an explicit ownership rule.

### 6.7 Source failure behavior

Failure to fetch a source MUST leave its citation metadata and pinpoint intact. A reader SHOULD display the source as unavailable and SHOULD expose the expected revision or hash. It MUST NOT replace the failed source with a live webpage, a later master revision or a similarly named local file without explicit user action.

### 6.8 Bibliographic interoperability

CSL JSON is the preferred interchange form. BibTeX MAY be imported or retained as original source text, but the Studio SHOULD also carry a normalised record used by the citation processor. Import provenance SHOULD identify the original format and unparsed fields so round trips do not discard information.

Citekeys MUST be unique within a document-scoped bibliography. Renaming a citekey requires updating every citation mark and source association in one transaction. Human-readable formatted citations are derived and MUST NOT be the only citation representation.

### 6.9 Coordinate systems and excerpts

PDF rectangles SHOULD use normalised page coordinates and declare page rotation or the coordinate-space convention. Implementations MUST NOT assume every PDF page shares dimensions. EPUB and HTML pinpoints SHOULD prefer durable fragment identifiers, content selectors or quoted-text selectors over volatile DOM indexes.

An excerpt SHOULD state source revision, start and end selectors, extracted text and whether it is exact or normalised. If the master changes, the stored excerpt remains frozen; a reader MAY offer to locate an analogous passage in the new revision but MUST NOT silently rebind the citation.

### 6.10 Rights and redistribution

Attachment presence does not establish permission to redistribute it. A source descriptor MAY include rights, licence, public-availability and redistribution-policy fields. Export profiles SHOULD consult those fields but MUST ask for an explicit policy when rights are unknown. `publiclyAvailable` means retrievable by the public; it does not necessarily mean freely redistributable.

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

### 7.5 Stable IDs, revisions and deduplication

File paths and provider URLs are mutable locators and MUST NOT serve as the sole identity of a master item. A stable master ID identifies the logical item; a revision identifies a particular state; a content hash identifies particular bytes. Implementations SHOULD keep these concepts separate.

Within one Studio, the tuple `(masterId, revision, role)` SHOULD identify a reusable attachment. A second request for the same tuple SHOULD return the existing attachment ID. A different revision MAY create a new attachment, but MUST NOT rewrite an older Studio's frozen evidence in place.

### 7.6 Provider independence

A provider adapter MAY map logical collections to folders, buckets, labels or database indexes. Moving a library between providers MUST preserve stable IDs and revision relationships. Provider-specific tokens, account IDs and local absolute paths SHOULD NOT be required to interpret an exported Studio.

### 7.7 Deletion and cache clearing

Deleting a cache entry is a local performance operation. Deleting a master item or a Studio attachment is a durable data operation and MUST require a distinct user action. If a master is deleted, Studios containing frozen attachments remain self-describing. If a Studio attachment is deleted, the record MUST retain sufficient metadata to explain the missing dependency unless the user explicitly removes the reference as well.

### 7.8 Transactional saves

A save that changes document text and attachment or citation relationships SHOULD be atomic. A crash MUST NOT leave a new readable projection paired with the previous structured tree, or a citation mark pointing to a bibliography update that was not committed. Implementations SHOULD write a new package or journal entry, verify it, then replace the visible version.

### 7.9 Provider synchronisation

Provider adapters SHOULD use revision tokens, entity tags or content hashes to detect remote change before overwrite. Last-write-wins MAY be used for disposable view state but SHOULD NOT be used for document content, evidence or attachment manifests without surfacing the lost branch. Offline edits MUST retain their base revision so later synchronisation can distinguish clean upload from conflict.

### 7.10 Backup and recovery

Backups are physical resilience copies, not a third logical library. Recovery software SHOULD restore stable IDs and revision relationships. A restored Studio MUST NOT silently relink to a different master merely because it occupies the same path. A recovery audit SHOULD report missing payloads, hash mismatches and provider locators that need reauthorisation.

## 8. Initial open and lazy payload loading

### 8.1 Required open ordering

The initial open path MUST read the compact document core before large attachment payloads. The core consists of the summary, readable text, editable document tree and attachment manifest.

Container parsing SHOULD execute away from the main interaction surface. The writing surface SHOULD appear before library hydration, timestamp work, media decoding or source downloads can block it.

### 8.2 Deferred material

Library metadata MAY restore after the first reveal. A PDF, EPUB, webpage snapshot, movie, isolated audio file or voice edition SHOULD be read from an SSD cache or fetched from its provider only when the associated reader or player is opened.

Large attachment work MUST be attributed to the module requesting it. It MUST NOT be required for an unrelated document's initial open.

### 8.3 Performance target

The target cold-open experience is a usable Studio Document no slower than opening the equivalent writing in Markdown. This target applies to the usable writing surface, not to all optional source or media payloads completing their downloads.

### 8.4 Load-state model

Large payload consumers SHOULD expose at least `idle`, `loading`, `ready`, `unavailable` and `invalid` states. A module MAY render metadata and controls while its payload is loading. Switching between already hydrated modules SHOULD preserve the current foreground until the replacement is ready, then commit the visual change atomically.

An implementation SHOULD avoid a loading animation for cached changes that complete within approximately 100 ms. Longer changes MAY show a compact, non-blocking progress indicator. This is an interface target, not part of file conformance.

### 8.5 Integrity before use

When an attachment carries a content hash, a reader SHOULD verify the retrieved bytes before presenting them as the frozen source. Integrity work MAY stream while bytes arrive. A hash mismatch MUST enter the invalid state and MUST NOT be described as a temporary network failure.

### 8.6 Indexes and partial reads

An indexed package MAY place its core and manifest ahead of large byte ranges. The manifest MAY map attachment IDs, chapters, voice parts or media segments to byte ranges. A reader SHOULD be able to request one range without downloading unrelated payloads. Compression MUST NOT prevent useful partial access unless the package explicitly declares that tradeoff.

### 8.7 Request scheduling and cancellation

Payload requests SHOULD be cancellable when the requesting module closes or navigates elsewhere. A cancelled fetch MUST NOT become a failed durable attachment. Duplicate concurrent requests for the same `(attachmentId, revision, range)` SHOULD share work where practical.

Foreground writing, text selection and cursor movement take priority over decoding, OCR, waveform generation, speech rendering and library indexing. Background work SHOULD yield or reduce concurrency when it affects interaction latency.

### 8.8 Offline behavior

The compact Studio core MUST remain usable offline when it is present locally. Deferred provider-only payloads enter the unavailable state with their identity intact. A module SHOULD distinguish “not downloaded”, “provider unavailable”, “authentication required” and “integrity failure”.

### 8.9 Cache keys and invalidation

Derived cache keys SHOULD include the authoritative content hash, transformation version and material settings. Page images include source revision, page, scale and colour mode; voice parts include text, voice, renderer and pause settings. Updating an implementation does not require discarding valid durable data, but MAY invalidate derived caches whose transformation semantics changed.

## 9. Modules

A Studio MAY associate the following modules with one document context:

- writing and reference surfaces;
- email drafts and saved messages;
- PDF, EPUB, Markdown, text and web readers;
- pictures, movies and isolated audio; and
- Read Along and other voice-reader surfaces.

Opening a module MUST NOT manufacture a new master document. Opening Voice on an email MUST NOT convert the email to a citation or copy the email body into an email voice store.

### 9.1 Module identity

A module is a presentation and editing surface attached to an existing Studio context. A module record SHOULD identify its type, stable module ID, associated document or master IDs, view state and any active payload IDs. Module navigation MUST NOT change the stable identity of the central Studio.

### 9.2 Module lifecycle

Opening a module MAY hydrate deferred metadata or payloads. Closing a module MAY release decoded pages, audio buffers and other caches, but MUST NOT delete durable data. Reopening an already hydrated module SHOULD restore its previous view state without constructing a second Studio Document.

### 9.3 Cross-module references

Email, reference, reader, media and voice modules MAY refer to the same master item. Each association MUST state its role. A book used as evidence may be a reference; the same bytes opened for reading remain the same master item. Changing module role MUST NOT duplicate the master.

### 9.4 Module navigation

An implementation with several open modules SHOULD provide stable navigation back to the central writing surface and between adjacent open modules. Navigation state is interface metadata; it MUST NOT alter readable text or provenance-covered content unless the user edits the document.

### 9.5 Association record

~~~ts
type ModuleAssociation = {
  id: string
  type: "reference" | "reader" | "email" | "picture" | "movie" | "audio" | "voice"
  studioId: string
  masterId?: string
  attachmentId?: string
  sourceRevision?: string
  viewState?: Record<string, unknown>
}
~~~

At least one of `masterId` or `attachmentId` is required for a source-backed module. `viewState` MAY be discarded without changing document meaning. Relationship fields are durable and MUST survive reopening or moving the Studio.

### 9.6 Atomic foreground switching

Already hydrated modules SHOULD remain resident within a bounded cache. When switching, the current module stays visible until the target has enough state to render coherently; then the host commits the target in one update. A placeholder MAY replace the foreground after a meaningful delay, but clearing the foreground immediately is discouraged because it makes cached navigation appear slower and can expose partial state.

## 10. Voice editions and Read Along

A voice edition MUST identify source kind, source ID and source revision. It SHOULD record model or renderer, voice or cast identity, chapter or passage coverage, timing data and available parts.

Audio bytes, timing data and cast metadata MUST remain independent from source text. Removing optional voice audio MUST NOT remove or rewrite its book or email source. A stale source revision MAY invalidate future rendering, but older takes SHOULD remain recoverable until the writer removes them.

### 10.1 Voice-edition shape

~~~ts
type VoiceEdition = {
  editionId: string
  sourceKind: "book" | "reference" | "email" | "document" | "web"
  sourceId: string
  sourceRevision: string
  title?: string
  renderer?: { model?: string; version?: string; settingsHash?: string }
  cast?: { role: string; voice: string }[]
  script?: string[]
  parts: VoicePart[]
}

type VoicePart = {
  id: string
  sectionId?: string
  status: "queued" | "rendering" | "recorded" | "failed"
  durationMs?: number
  audioAttachmentId?: string
  timing?: { text: string; startMs: number; endMs: number }[]
}
~~~

The source revision is REQUIRED because timing and audio cease to correspond when source text changes. Renderer metadata SHOULD be sufficient to decide whether a cached part may be reused.

### 10.2 Incremental reuse

An implementation MAY cache audio by section, sentence or clause. Cache keys SHOULD include canonical source text, voice identity, renderer version and pause or pronunciation settings. Reordering an unchanged segment MAY reuse its audio when its cache key is stable. Edited segments MUST be re-rendered; unrelated segments SHOULD remain available.

### 10.3 Coverage and download state

A voice edition SHOULD expose which chapters, sections and parts are present locally, which remain provider-only and which are not rendered. Removing downloaded audio MAY change availability state but MUST NOT erase edition metadata, timing for retained parts or the source relationship.

### 10.4 Timing and highlighting

Timing entries MAY address words, clauses or passages. A player MUST distinguish estimated passage timing from verified word timing. Highlighting SHOULD degrade to passage-level progress when word timing is unavailable rather than presenting inferred timing as exact.

### 10.5 Structural pauses

A renderer SHOULD derive pauses from punctuation and document structure. Heading, subheading, paragraph, subparagraph, list-item and explicit break boundaries MAY use different configurable pause classes. The stored edition SHOULD record settings that materially affect segmentation or cache reuse.

### 10.6 Text preparation pipeline

Voice preparation SHOULD preserve a trace from structured source ranges to spoken segments. It MAY remove running page numbers, repeated publisher headers and footers, discretionary hyphenation and non-reading metadata, but MUST NOT silently omit semantic prose. Footnotes need an explicit policy: inline at their marker, grouped after the section, skipped by user choice, or rendered as a separate part.

Nonstandard punctuation, abbreviations, citations, URLs, mathematics and code SHOULD pass through typed normalisers. A language-model rewrite MAY be offered for ambiguous “ghost text”, but its output MUST be reviewable, versioned and distinguishable from deterministic extraction.

### 10.7 Mathematical speech

A voice renderer MAY provide at least two mathematics modes: concise colloquial speech and explicit structural speech. For example, `(a + b)² / c` may be spoken colloquially as “a plus b, squared, over c”, while an explicit mode identifies numerator, denominator and grouping. Operator precedence and grouping SHOULD use pauses or spoken boundary words; the renderer MUST NOT change mathematical meaning merely to sound natural.

### 10.8 Render scheduling and fallback

A high-quality renderer MAY be queued alongside a fast local renderer. Playback MAY begin with available local audio and switch only at a segment boundary when higher-quality parts arrive. The interface SHOULD state which renderer is playing and SHOULD estimate remaining render time for the current section and document. Estimates are heuristic and MUST NOT be stored as evidence.

### 10.9 Human recordings

A user recording is a VoiceEdition whose renderer metadata identifies human capture. It MAY contain multiple takes and shared editions. Word or passage timing MAY be generated after recording. Sharing a recording MUST preserve source identity and revision so recipients can detect when audio no longer matches the text.

Recording provenance proves at most that particular audio bytes and timing data are associated with a source revision. It does not establish the speaker's legal identity unless a separate identity system supplies that evidence.

### 10.10 Segmentation invariants

Every part SHOULD address stable section or segment IDs. Segment boundaries SHOULD be deterministic under unchanged structure and settings so local edits invalidate as little audio as possible. Render progress can be divided by relative source length; progress MUST distinguish queued, rendering, locally available, downloaded and failed parts.

## 11. Email

An implementation MAY represent email as a first-class Studio document with structured To, Cc, Bcc and Subject fields plus an editable body.

Browsing a provider mailbox MUST NOT automatically create Studio Documents, snapshots or provenance. A Studio record of an email draft MUST NOT be described as proof of sending, delivery or receipt unless independent message evidence establishes that specific claim.

### 11.1 Structured email fields

An email document SHOULD represent `to`, `cc`, `bcc`, `from`, `replyTo`, `subject` and provider message identifiers as structured fields rather than embedding them only in body text. The readable projection SHOULD place essential headers ahead of the body.

### 11.2 Draft identity and provider state

A Studio email draft has its own stable document ID. Opening a mailbox item MUST NOT silently replace that ID with a provider message ID. Snapshot evidence can establish that a particular draft existed; it cannot establish that the draft was sent. Delivery and read claims require independent provider or recipient evidence.

### 11.3 Email voice editions

Email voice audio belongs in the logical `emailVoices/` collection and MUST reference the email ID and revision. Audio MUST NOT be embedded into the authoritative email body. Removing or regenerating a voice edition MUST leave recipients, subject and body unchanged.

### 11.4 Import and export

Imported provider messages SHOULD retain immutable raw-message evidence where lawful and useful, while the editable Studio representation remains distinct. Export to RFC 5322 or a provider API MUST state whether attachments, thread headers and provenance metadata are included.

### 11.5 Email record catalogue

~~~ts
type EmailHeaders = {
  to: string[]
  cc?: string[]
  bcc?: string[]
  from?: string
  replyTo?: string
  subject?: string
  messageId?: string
  inReplyTo?: string
  references?: string[]
}
~~~

Address strings SHOULD preserve display names and addr-spec values in a parsed representation. Bcc values are private and MUST NOT appear in a public export unless the writer explicitly includes them. Thread headers relate messages; they do not merge several message masters into one mutable record.

### 11.6 Mailbox libraries

The logical `emails/` collection MAY include drafts, sent copies, received messages and immutable raw-message attachments. Folder, label and read state are provider metadata and may vary without changing message identity. `emailVoices/` remains a separate collection because audio is larger, optional and independently removable.

### 11.7 Sending boundary

A Studio writer MAY prepare and snapshot a draft without provider access. Sending is an external side effect and SHOULD require an explicit user action. A send operation SHOULD record provider response metadata separately from the pre-send draft snapshot. Failure, queued send, provider acceptance, delivery and read receipt are distinct states.

## 12. Snapshots, receipts and timestamps

A cryptographic hash is a deterministic fixed-length fingerprint calculated from exact content bytes. Identical canonical content MUST produce the same hash; a content change is expected to produce a different hash. Hashes allow a verifier to compare content without sending the document to a signing or timestamp service.

The hash algorithm and canonicalization profile MUST be identified alongside the hash or unambiguously fixed by the record version. A bare hexadecimal string with no algorithm or covered-field definition is insufficient for interoperable verification.

### 12.1 Snapshots

Snapshots record document states and hashes. A snapshot archive MUST be grow-only. Merge operations MUST union history and MUST NOT silently truncate it. A failed read MUST NOT be interpreted as an empty archive.

A snapshot SHOULD include a stable snapshot ID, creation time, canonical content hash, word count and the schema or canonicalization version used. It MAY include a bundle hash covering attachments or capability manifests. A snapshot of one field set MUST NOT be compared with a hash covering a different field set without an explicit transformation rule.

### 12.2 Signed receipts

A receipt chain binds canonical content hashes across writing periods. A signing service MAY receive content hashes but MUST NOT require document text, keystrokes or writer identity. A verifier MUST use an independently published public key rather than blindly trusting a key provided by the file.

Each receipt SHOULD include a monotonically ordered period, the previous receipt or content hash, the current canonical content hash, any separately covered constraint hash, a key ID, signature algorithm and signature. The first receipt MUST declare its lack of predecessor. A broken predecessor link invalidates the chain after that point; it does not retroactively invalidate independently verifiable earlier receipts.

The signed message format MUST be documented and domain-separated so that a signature for another protocol cannot be misread as a Studio receipt. Implementations SHOULD sign canonical binary or UTF-8 bytes, not display-formatted JSON.

### 12.3 Timestamp proofs

A snapshot MAY carry an OpenTimestamps or Bitcoin-backed proof. The proof demonstrates that the matching hash existed by the proof boundary; it MUST NOT be represented as publication of document text to a public chain.

A pending proof MUST remain distinguishable from a confirmed proof. Confirmation metadata MAY include block height, transaction or calendar references and the proof bytes needed for independent verification. A verifier MUST recompute the covered hash before following the timestamp proof.

### 12.4 Verification limits

Verification MAY establish whether hashes, signatures, snapshots and timestamp proofs agree. Where a valid signature or timestamp exists, it MAY establish that the matching content was recorded by the applicable proof boundary and has not subsequently been altered without detection. A hash by itself does not establish who produced the content, how it was entered or whether AI assistance was used. Verification MUST NOT claim to establish legal identity, eliminate all possible assistance, establish private intention or certify the origin of every idea.

### 12.5 Verification procedure

A verifier SHOULD perform these steps in order:

1. parse the record version and capability declarations;
2. validate required schemas without discarding unknown compatible fields;
3. reconstruct the canonical covered bytes;
4. recompute content and bundle hashes;
5. validate receipt signatures against an independently obtained key;
6. validate predecessor links and period ordering;
7. validate timestamp proofs against their named external system; and
8. report each result and limitation separately.

The verifier MUST NOT collapse partial success into a single undifferentiated “verified” badge. A valid timestamp with an invalid receipt chain, or a valid receipt over content that does not match the displayed text, requires a mixed result.

### 12.6 Privacy boundary

Hash-only services reduce disclosure but do not make all metadata harmless. Request timing, IP addresses, key IDs and receipt frequency may still be visible to a service operator. Implementations SHOULD minimise retained request metadata and MUST document any service-side logging relevant to a provenance claim.

### 12.7 History merge and pruning

Snapshots and receipts are grow-only within their declared history. Synchronisation SHOULD union entries by stable ID and verify identical IDs have identical covered data. A user MAY create a deliberately redacted or compacted export, but the export MUST declare that history was omitted and MUST NOT present its first retained receipt as the original chain genesis.

### 12.8 Key rotation and revocation

Signing key references SHOULD include key ID, algorithm and a location or method for obtaining historical public-key status. Rotation creates a new key ID and MAY be linked by a transition statement signed by old and new keys. Revocation after signing does not rewrite historical content; verifiers report signature time, key status and policy separately.

### 12.9 Algorithm agility

Hash and signature algorithms MUST be named. New algorithms require new identifiers and test vectors. Implementations MUST NOT reinterpret bytes created under an old canonicalization or algorithm version using a new one. Deprecation policy SHOULD distinguish creation of new evidence from verification of historical evidence.

## 13. Verified Capture (Planned)

Inkwave is being expanded into a desktop application for macOS and Windows. Verified Capture is a planned, optional desktop-only extension intended to give readers materially higher confidence that certified portions of a Studio were edited inside the Inkwave surface without AI insertion. It is not a current public product claim.

The proposed implementation will bind eligible native input to signed capture intervals and classify text as verified, inherited, imported or uncertified. It is intended to restrict ordinary bulk insertion and raise the cost of routine browser automation, including Playwright, Selenium, DevTools insertion and clipboard insertion.

Verified Capture MUST NOT claim to defeat a hostile operating system, custom hardware injector or manual retyping of generated prose.

### 13.1 Evidence classes

- **verified** identifies text changes observed through an eligible native Inkwave input path during a valid capture interval;
- **inherited** identifies unchanged content carried forward from an earlier certified state;
- **imported** identifies content deliberately inserted through an import, paste or external-document operation; and
- **uncertified** identifies content whose input path is unknown, unsupported or outside a valid capture interval.

Classification MUST attach to exact text ranges or change records. A document-level badge MUST NOT imply that imported or uncertified ranges are verified.

### 13.2 Capture interval

A capture interval SHOULD bind application build identity, document ID, starting content hash, ending content hash, eligible input events, interruption state and a signed receipt. Sleep, crash, debugger attachment, unsupported automation state or loss of the native event guard SHOULD close or invalidate the interval.

### 13.3 Desktop threat boundary

The desktop application is intended to remove routine web-page insertion paths and detect ordinary automation or bulk insertion. It cannot prove that the operating system, accessibility stack, device firmware or physical keyboard is trustworthy. It cannot distinguish original thought from manually retyped generated text. Product language MUST say “higher confidence” or an equivalently bounded phrase, never “proof of no AI”.

### 13.4 Reader presentation

A reader SHOULD be able to inspect coverage by evidence class, capture interval and application build. The interface MUST expose gaps and imported ranges at least as prominently as verified coverage. An unverifiable signature, unknown build or missing interval record MUST reduce the displayed confidence rather than disappear.

## 14. Portability and planned visual layer

An implementation MAY export a fixed-layout PDF, a source-stripped Studio copy or a gzip-compressed Studio file. View settings MAY travel with a document but MUST NOT change its readable text or verification record.

Mnemonic tiles are a planned, provisional visual layer. A tile MAY link to a word, phrase or passage as a visual memory anchor. The underlying word list is intended to be open; tile artwork is produced by an implementation. Mnemonic tiles are not yet required for conformance.

### 14.1 Export profiles

An exporter SHOULD declare one of these profiles or an equivalently explicit profile:

- **complete Studio** — document core plus every available attachment and capability record;
- **portable subset** — document core plus selected attachments, with omitted items retained as declared unavailable dependencies;
- **public copy** — document core with private or redistributable payloads removed according to an explicit policy;
- **source-stripped copy** — citations and pinpoints retained while source bytes are omitted; or
- **rendered publication** — fixed-layout output such as PDF, optionally linked to a Studio or verification location.

An export MUST NOT silently claim completeness after stripping data. Source removal MUST NOT remove citekeys, bibliographic metadata, occurrence IDs or pinpoints needed to understand the writing.

### 14.2 Compression and byte-range access

Gzip MAY be used for whole-file transport. An indexed container MAY instead compress payloads independently to preserve range access. The chosen packaging profile SHOULD document whether a reader must decompress the whole package before showing the core.

### 14.3 View settings

Theme, zoom, open module, panel widths, reading position and toolbar choices MAY travel as view settings. Readers MAY ignore them. View settings MUST NOT change canonical readable text, citation semantics, attachment integrity or provenance results.

### 14.4 Mnemonic tile references

Tile records SHOULD identify an implementation-defined artwork reference, a text target and placement. Text targets SHOULD use stable document positions or anchors resilient to nearby edits. Attribution and licence fields SHOULD travel when artwork is not owned by the writer.

### 14.5 Indexed package manifest

~~~ts
type PackageEntry = {
  id: string
  mediaType: string
  offset?: number
  length?: number
  compression?: "none" | "gzip" | "deflate" | "zstd"
  encodedLength?: number
  contentHash?: string
}

type PackageIndex = {
  version: number
  coreLength: number
  entries: PackageEntry[]
}
~~~

Offsets and lengths address package bytes and MUST use a declared integer and endianness model in a binary container. JSON-only v1 records may omit them. An indexed reader MUST validate bounds before allocating or reading and SHOULD verify entry hashes after decompression.

### 14.6 Export reproducibility

Two exports of the same Studio may differ in `exportedAt`, compression layout and selected attachments while representing the same canonical document state. Exporters SHOULD expose both a document-state hash and, where useful, a package hash. A package hash covers exact transport bytes; a document-state hash covers the specified semantic fields.

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

### 15.1 Conformance profiles

An implementation MAY claim one or more profiles:

- **Core Reader** — parses the record envelope and exposes readable text;
- **Core Writer** — creates and edits the structured document and derived readable projection;
- **Source Reader/Writer** — implements bibliographic records, citation occurrences, pinpoints and attachment states;
- **Module Host** — preserves module identity and lifecycle without creating duplicate masters;
- **Voice Reader/Writer** — implements voice-edition identity, parts, coverage and source revisions;
- **Provenance Verifier** — verifies canonical hashes, receipts and declared timestamp proofs; and
- **Verified Capture Writer** — implements the planned desktop capture evidence model when that profile is finalised.

A claim MUST name implemented profile versions and optional capability versions. “Supports Studio Documents” without identifying read, write and preservation behavior is insufficient for a formal compatibility claim.

### 15.2 Round-trip test

A writer conformance test SHOULD open a fixture containing unknown compatible fields, edit ordinary text, save, and confirm that the unknown fields and untouched attachments remain byte-equivalent or semantically equivalent as required by their schema. Citation, provenance and source fixtures MUST be included.

### 15.3 Projection test

Given a structured document fixture, independent implementations SHOULD produce the same readable projection under the named projection version. Tests SHOULD cover headings, nested lists, tables, mathematics, block quotes, links, citations, figures and explicit breaks.

### 15.4 Failure tests

Conformance fixtures SHOULD include missing linked files, wrong content hashes, unsupported capability versions, malformed optional payloads, broken receipt links, unknown signing keys, pending anchors and failed cache reads. The implementation MUST preserve the distinction between these cases.

### 15.5 Minimum fixture suite

The maintained suite SHOULD contain:

1. a minimal Core Reader record with only required fields;
2. a rich document with every standard block and mark;
3. a citation record with repeated citekey occurrences and separate pinpoints;
4. embedded, linked, deferred and derivative attachments;
5. an email draft plus an independently evidenced sent message;
6. a voice edition with multiple roles, parts and partial timing;
7. a valid receipt chain and confirmed timestamp proof;
8. each individual provenance failure described in section 15.4;
9. unknown compatible fields at top-level and nested extension points;
10. a source-stripped export and a complete export of the same state; and
11. a package whose large payloads can be range-read after the core.

Every fixture SHOULD state expected reader state, round-trip preservation and verification results. Private keys used by fixtures MUST be test-only and publicly documented as such.

### 15.6 Accessibility and readable fallback

Conformance is not limited to visual rendering. A reader SHOULD expose document structure, form labels, navigation names and media alternatives through platform accessibility APIs. Code, citations and mathematics SHOULD retain meaningful text alternatives. Optional visual layers MUST NOT make the underlying writing inaccessible.

### 15.7 Capability preservation report

A writer that opens a record with unsupported capabilities SHOULD be able to report which fields it will preserve, omit or invalidate before saving. If safe preservation is impossible, it SHOULD offer read-only access or an explicit lossy export rather than overwrite the original.

## 16. Security, privacy and error handling

### 16.1 Untrusted records

A Studio reader MUST treat document text, HTML, SVG, media metadata, filenames, provider locators and unknown fields as untrusted input. It MUST NOT execute embedded script or open active external content merely because it appears in a Studio. HTML views SHOULD use sanitisation and a restrictive content security policy.

### 16.2 Paths and extraction

Package readers MUST reject absolute paths, parent-directory traversal and archive entries that escape the chosen extraction root. Duplicate attachment names MUST NOT overwrite one another; stable attachment IDs, not filenames, select payloads.

### 16.3 Resource limits

Readers SHOULD impose configurable limits on JSON depth, node count, decoded Base64 size, decompressed bytes, image dimensions, media duration and attachment count. Exceeding a limit MUST produce an explicit unavailable or invalid state, not partial content presented as complete.

### 16.4 External requests

Opening a Studio MUST NOT automatically contact every live URL, provider locator, verifier or timestamp service named by the record. Network access SHOULD follow a user action or an explicit trusted policy. Verification software SHOULD disclose which external systems it queries.

### 16.5 Feedback-form privacy

The public website uses no analytics, cookies or advertising trackers. Its optional contact form posts the supplied name, email address, message and normal request metadata to Formspree for delivery to the maintainer. Fonts are self-hosted. Vercel retains ordinary server request logs according to its hosting policy.

### 16.6 Error reporting

Errors SHOULD identify the affected capability, attachment or proof without exposing unrelated private document content. Implementations MUST NOT upload a document to an error-reporting service unless the user knowingly chooses to send it.

### 16.7 Encryption and secrets

The base format does not require encryption. An implementation MAY encrypt attachments or an entire package, but MUST declare the encryption envelope, key-derivation method and which metadata remains visible. Encryption and signatures solve different problems: encryption controls reading; signatures detect unauthorised change.

Provider credentials, OAuth refresh tokens, private signing keys and local encryption keys MUST NOT be exported inside an ordinary Studio. A portable record MAY carry public keys, key IDs and reauthorisation hints.

### 16.8 External content and privacy leakage

Remote images, fonts, embeds and verification endpoints can disclose that a document was opened. A reader SHOULD block or mediate remote loads by default for untrusted Studios. Link previews and web snapshots SHOULD be generated deliberately and cached as declared derivatives.

### 16.9 Personal-data minimisation

Summary, receipt and contact metadata SHOULD contain only what is needed for their stated function. Writers SHOULD be able to export a public copy that removes provider locators, private recipients, local paths and identifying metadata while retaining document text and explicitly selected evidence. Redaction MUST update covered hashes and create a distinct export state; it cannot preserve a signature over removed bytes unless the proof scheme explicitly supports selective disclosure.

## 17. Licensing and naming

This specification is available under CC BY 4.0. Implementations may build on it for commercial or non-commercial purposes with attribution.

Writing Studio Standard, Studio Document and Inkwave are names used to identify the format and its implementation. An implementation MUST NOT use them in a way that falsely implies compatibility or endorsement.

## 18. Maintenance and publication

This document is bundled into the website and is downloaded by the **Download engineering spec** button. It is the complete engineer-formatted counterpart to the public pages. Every public terminology, capability, model, FAQ, example, contact or conformance change MUST update this document in the same commit.

The website-generated download inserts the reader's local download date into the specification header and appends the ISO date to the Markdown filename. The source specification intentionally contains no fixed download date.

The canonical public home page at `/` is the Standard page. The former `/standard` route redirects to `/`; it is not a second copy of the specification or a separate landing page.

A specification revision SHOULD update `Specification version` when it changes a normative requirement, field meaning or conformance profile. Editorial corrections MAY retain the version. Breaking wire changes MUST increment the top-level record version.

## Appendix A: Complete architecture reference (informative)

This appendix reproduces every implementation brief displayed on the Architecture page. The briefs use TypeScript-like pseudocode and are explanatory views of the normative requirements above; they are not a substitute for a versioned machine-readable schema.

### A.1 Readable record — required

The readable layer carries a human-facing summary, complete deterministic plain-text projection, and verifier or capability metadata. Every conforming reader exposes the projection even if it cannot reconstruct the rich editor. The projection is derived from the structured document and MUST NOT be maintained as an independent competing text.

~~~ts
// A portable record carries readable text
// and structured data in one document.

record = {
  summary: makeSummary(doc),
  text: toPlainText(doc),
  document: toStructuredDoc(doc),
}

// text is derived from document.
// A reader can inspect it without
// rebuilding the editing interface.
~~~

### A.2 Document model — required for writers

The document model is the structured, editable source. It carries block and inline nodes, lists, tables, mathematics, figures, captions and marks. A Core Reader may expose only the readable projection; a Core Writer MUST preserve and update the structured model.

~~~ts
content: {
  type: "doc",
  content: Node[],
}

type Node = {
  type: "paragraph" | "heading"
      | "list" | "table" | "math",
  attrs?: Record<string, unknown>,
  content?: Node[],
  text?: string,
  marks?: Mark[],
}

// Marks hold emphasis, links,
// code and citation references.
~~~

Node vocabularies MUST be schema-versioned. Unknown nodes SHOULD be retained as opaque compatible nodes where safe. A writer MUST NOT flatten an unsupported table, equation or citation into plain text during an ordinary save without explicit user consent.

### A.3 Sources & citations — optional

This layer carries CSL-compatible bibliography entries, pinpointed citation occurrences, embedded or linked source attachments and highlights. Citation marks refer to stable citekeys; occurrence-level evidence binds to an occurrence ID.

~~~ts
bibliography: CSLItem[]

type CSLItem = {
  id: string,       // stable citekey
  type: string,
  title: string,
  author?: Name[],
  issued?: DateInfo,
}

source?: {
  file?: Attachment,
  highlights?: Highlight[],
}

// A citation can name a page,
// a passage and its highlight.
~~~

The source file may be complete, derivative, linked or deferred. Its state and revision MUST be explicit. Pinpoint metadata survives source stripping.

### A.4 Provenance record — optional

This layer carries hash-chained signed receipts, content snapshots and bounded composition evidence. A signer may receive canonical hashes; it need not receive document text, keystrokes or identity.

~~~ts
receipts: Receipt[]

type Receipt = {
  period: number,
  prevHash: string | null,
  contentHash: string,
  keyId: string,
  signature: string,
}

snapshots: Snapshot[]

// The signer receives hashes only.
// It never receives text, keystrokes
// or the writer's identity.
~~~

An implementation claiming provenance preservation MUST retain these records and report validation results. The existence of a chain does not establish identity, independent thought or absence of AI.

### A.5 Anchoring — optional and dependent on provenance

Anchoring makes a matching content hash independently dateable. A proof may share a Merkle commitment with many documents. The proof publishes or commits to hashes, not document text.

~~~ts
snapshot.anchor: {
  status: "pending" | "confirmed",
  block?: number,
  proof: TimestampProof,
}

// Many document hashes share one
// Merkle-tree commitment.
//
// Verification recomputes the hash,
// follows the proof, then checks the
// named public-chain commitment.
~~~

Readers MUST distinguish pending, confirmed, invalid and unsupported proofs. A block number without independently verifiable proof bytes is descriptive metadata, not a successful verification result.

### A.6 Portability & export — optional

This layer describes fixed-layout rendering, source inclusion policy, compression and travelling view settings. Export policy changes packaging, not the semantics of retained text or evidence.

~~~ts
export = {
  render: "pdf",
  sources: "all" | "public" | "none",
  compression: "gzip" | "none",
}

// View settings may travel with a
// document. They do not affect its
// text or verification record.

// Text extraction stays deterministic.
// Snapshot history is append-only.
~~~

An export MUST declare removed attachments. A rendered PDF may carry or link to provenance, but the appearance of a verification mark MUST remain traceable to the exact Studio state it covers.

### A.7 Mnemonic tiles — provisional

Mnemonic tiles are implementation-produced artwork linked to words, phrases or passages as visual memory anchors. The underlying word list is intended to be open; tile artwork and attribution remain implementation or creator records. This layer is not yet required for conformance.

~~~ts
// Planned; not yet a conformant layer.
tiles?: {
  ref: string,
  target: { from, to },
  placement?: "margin" | "inline",
}[]

// A tile links visual memory support
// to a word, phrase or passage.
//
// Future readers may also navigate
// between related Studio Documents.
~~~

Targets SHOULD use durable document anchors and MUST declare their coordinate or offset model. A reader that does not implement tiles preserves the records and continues to expose the writing.

## Appendix B: Complete worked examples (informative)

These are the complete illustrative snippets displayed on the Examples page, concatenated in their displayed order. Comments, shortened hashes, ellipses and fake Base64 strings are deliberate; the examples explain relationships and are not byte-valid conformance fixtures. A production fixture MUST replace every elision with valid data and satisfy the normative rules above.

### B.1 Toy essay — `on-artificial-languages.studio`

~~~jsonc
{
  "v": 1,
  "summary": {
    "title": "On Artificial Languages",
    "words": 312,
    "verifyAt": "https://iwzero.me/verify"
  },
  "text": "On Artificial Languages\n\nAda Lindqvist — draft\n\nThe dream of a perfect language is old. Leibniz imagined a characteristica universalis in which disputes might be settled by calculation. This essay asks what a made language keeps that a natural one lets slip. (leibniz1666, p. 12)",

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
  },

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
  ],

  "pdfs": {
    "leibniz1666": {
      "name": "leibniz-1666.pdf",
      "data": "JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PC9UeXBlL1BhZ2Vz
               …≈1.2 MB of the source PDF, base64-encoded, elided…
               dHJhaWxlcgo8PC9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCg=="
    }
  },

  "receipts": [
    { "period": 1, "prevHash": null,
      "contentHash": "9f2c7b1e…c4", "nudgesHash": "a1b2…7e",
      "keyId": "inkwave-signing-v1", "sig": "ed25519:5c2d…9b" },
    { "period": 2, "prevHash": "9f2c7b1e…c4",
      "contentHash": "b7e1442a…03", "nudgesHash": "cc90…5f",
      "keyId": "inkwave-signing-v1", "sig": "ed25519:8a6b…11" }
  ],

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
~~~

#### B.1.1 Summary and readable text

The record begins with a compact summary and deterministic plain-text projection. The projection includes the heading, author status, prose and a readable citation. A person or language model can inspect the argument without rebuilding the editor. A conforming implementation would derive the 312-word count and `text` from the covered structured content rather than trusting hand-maintained values.

#### B.1.2 The document model

`document.contentJson` is the editable tree. It distinguishes a level-one heading, paragraph nodes and an emphasis mark. The website shows only enough nodes to demonstrate the relationship; a real record would carry the complete tree. Text extraction MUST define how marks, block boundaries and citation marks appear in the readable projection.

#### B.1.3 A pinpointed citation

The bibliography entry uses the stable citekey `leibniz1666`. `_iw.highlights[0]` identifies page 12, the supporting text, normalised page coordinates and `instanceId: cite-occ-1`. The occurrence ID matters because several claims can cite the same work at different passages. Rectangle coordinates are annotation data and do not alter publisher PDF bytes.

#### B.1.4 An embedded source PDF

`pdfs.leibniz1666` demonstrates an embedded Base64 payload. The displayed string is deliberately elided. A conforming attachment also needs media type, byte length or integrity metadata, and an explicit relationship to the bibliography record. Complete exports can retain it; source-stripped exports preserve the citation and pinpoint while declaring the PDF omitted.

#### B.1.5 Signed session receipts

The second receipt refers to the first period's hash, creating an ordered chain. `nudgesHash` illustrates separately covered writing constraints. Full records require complete hashes and signatures plus a documented signed-message format. Receipts expose hashes, not prose or identity, to the signing service.

#### B.1.6 Anchored snapshots

The snapshot identifies time, word count, content hash, bundle hash and a confirmed Bitcoin-backed OpenTimestamps state. Verification recomputes the covered hashes before checking the proof. Block height alone is not enough; the full proof must be available in a production record or through a declared attachment.

### B.2 Honours proposal — `honours-proposal.studio`

~~~jsonc
{
  "v": 1,
  "summary": {
    "title": "Honours Proposal",
    "author": "Peter Gibson",
    "verifyAt": "https://iwzero.me/verify"
  },
  "text": "Honours Proposal\n\nDisclaimer: AI models were used as dialogue partners for research and pressure-testing. The final prose and intention are my own.\n\nPhilosophical Question:\n\nIs a universal constructed language of the kind early modern philosophers envisaged possible? This proposal develops a revisionary reading of Leibniz. (leibniz-new-essays, bk. III)",

  "document": {
    "id": "honours-proposal-01",
    "title": "Honours Proposal",
    "schemaVersion": "1",
    "scasMode": "server",
    "contentJson": {
      "type": "doc",
      "content": [/* full editable proposal tree */]
    }
  },

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
  ],

  "pdfs": {
    "leibniz-new-essays": {
      "name": "Leibniz, New Essays … Book III Words.pdf",
      "data": "JVBERi0xLjUKJeLjz9MKMyAwIG9iago8PC9GaWx0ZXI…
               …the ONE source left embedded (Leibniz's reply to
               Locke); every other source PDF stripped for size…
               Cg1lbmRzdHJlYW0KZW5kb2JqCg=="
    }
  },

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
~~~

#### B.2.1 A real proposal, readable

This example is an excerpt from Peter Gibson's honours proposal about Leibniz, language, combinatorics, compossibility and petites perceptions. The readable projection includes the AI-use disclosure and philosophical question. The disclosure is document content, not cryptographic proof; its truth is not established merely because it is hashed.

#### B.2.2 The editable proposal

The website elides the full rich-text tree but shows its required location, document ID and schema version. `scasMode` is implementation metadata and MUST be preserved by readers that do not interpret it when compatible. A complete conformance fixture must replace the comment with actual nodes.

#### B.2.3 The reading list, pinpointed

The excerpt shows Leibniz's *New Essays on Human Understanding*, his reply to Locke. The pinpoint binds page 3 and a quoted passage to the fourth citation occurrence. Other bibliography entries are deliberately elided on the website; a full file retains their CSL data even when their source PDFs are stripped.

#### B.2.4 One source left embedded

Only the *New Essays* PDF remains embedded to keep the shared file small. `publiclyAvailable: true` can inform a “strip public PDFs” policy, but public availability does not itself grant redistribution rights. The export retains citation identity and page pins for removed PDFs and SHOULD preserve an origin from which the writer can retrieve the correct revision.

#### B.2.5 Signed and anchored

The receipt and snapshot use the same bounded machinery as the toy file. A full proposal would carry one receipt per covered writing period and complete proof data. The chain can show that matching proposal states were signed and dateable; it cannot prove the disclosure, identity or intellectual origin of every sentence.

### B.3 Email and voice edition — `north-watch-email.studio`

~~~jsonc
{
  "v": 1,
  "summary": {
    "title": "Please attend the north watch",
    "what": "Studio email with voice edition"
  },
  "text": "To: Horatio Vale\nFrom: Marcellus Reed\nSubject: Please attend the north watch\n\nAt the second bell, Bernardo and I saw the armoured figure again. Come before midnight.",

  "document": {
    "id": "north-watch-email-01",
    "docType": "email",
    "email": {
      "to": ["horatio@elsinore.example"],
      "from": "marcellus@elsinore.example",
      "subject": "Please attend the north watch"
    },
    "contentJson": { "type": "doc", "content": [] }
  },

  "voiceEdition": {
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
    ],
    "parts": [{
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
~~~

#### B.3.1 Readable email record

The projection places To, From and Subject before the body so the message is inspectable before provider or voice data loads. The addresses use the reserved `.example` domain. A production projection would also define Cc, Bcc and attachment rendering when present.

#### B.3.2 Structured email metadata

`docType: email` activates the email vocabulary without creating a different master document. Structured headers remain distinct from the editable body. This Studio state proves only that a draft with these fields existed; it does not prove sending, delivery or reading.

#### B.3.3 A voice edition with a cast

The short night-watch script is original and intentionally Hamlet-like without reproducing the play. The edition identifies its source kind, stable source ID and exact revision before naming a cast and script. A source edit changes the revision and requires reuse or invalidation decisions at part granularity.

#### B.3.4 Fake audio bytes and timing

The Base64 value decodes to fake marker bytes and is deliberately not playable. It demonstrates the location of audio, duration and timing entries. A production record SHOULD use an attachment reference rather than a large inline string, MUST identify media type and integrity, and MUST ensure timing values are monotonic, non-negative and within the part duration.

## Appendix C: Complete public FAQ (informative)

This appendix contains every question published on the website. The answers restate the relevant normative boundaries in ordinary language and point to details already specified above.

### C.1 Why not just use .docx or PDF?

A `.docx` focuses on editable presentation and a PDF focuses on fixed presentation. A Studio Document can keep a readable text projection, editable structure, source information, working context and optional verification evidence together. It can still export a normal PDF when a normal PDF is the right thing to send.

The distinction is not that Studio replaces those formats. DOCX and PDF are valid import and export targets. Studio preserves relationships those formats ordinarily omit: stable citation occurrences, frozen source revisions, module associations, voice editions, snapshots and bounded proof. A rendered export MUST state which of those relationships it carries or omits.

### C.2 Is a .studio file readable without Inkwave?

Yes. It is versioned JSON with a short summary and plain-text representation near the beginning. A person can inspect the writing with ordinary tools; a compatible reader can reconstruct the rich document and capabilities it supports.

The readable projection is required even when the reader cannot render the structured tree. Large payloads may be deferred, but capability declarations and attachment descriptors explain what exists. Unknown compatible data should survive a round trip through another writer.

### C.3 Does it copy all my books, email and audio into every document?

No. The library model treats those as master items in storage chosen by the writer. A Studio keeps a frozen subset only when it cites, attaches, quotes or otherwise uses an item. Voice audio is stored separately from its book or email source so it can be removed without harming the original.

An attachment may contain full bytes, an excerpt, metadata only or a deferred locator. The record must say which. Merely opening a book, mailbox or audio file does not attach it to every Studio.

### C.4 What does “two copies and no more” mean?

For each Studio use, there are two durable roles: the master item in the writer's library and the frozen attachment inside the Studio that uses it. If the same book is used in several Studios, each has its own deliberate frozen attachment; adding it twice to one Studio does not duplicate it. Local thumbnails, indexes, waveforms and downloaded bytes are evictable caches, never a secret third source of truth.

“Two” describes product-visible authoritative roles, not a claim about filesystem blocks, backups or provider replication. Cloud backups and content-addressed deduplication may create physical copies while preserving the same two logical authorities.

### C.5 Will a large book or recording slow down my document?

It should not. Inkwave opens the small document core first: readable text, editable structure and attachment manifest. Library metadata restores after the first frame, while PDFs, EPUBs, media and voice bytes load only when the corresponding reader or player opens. The design target is a usable cold open no slower than the equivalent Markdown writing.

An implementation meets that target by indexing payloads, parsing away from the main interaction surface, using evictable SSD caches and attributing downloads to requesting modules. A malformed or slow optional payload must not block unrelated writing.

### C.6 Which source types can it represent?

The current and specified vocabulary covers PDFs, EPUBs, Markdown and text files, immutable webpage snapshots, email, pictures, movies, isolated audio and readalong editions. Citation records use standard bibliographic metadata and can move between a reference collection and ordinary documents without changing stable identity.

The format is extensible. A new media type needs a declared media type, stable attachment identity, revision and integrity rules. A live webpage URL alone is not an immutable evidence object; durable web evidence should use a writer-owned snapshot.

### C.7 Does it record my keystrokes?

Ordinary Inkwave provenance is built from content hashes, snapshots and signed receipts, not a surveillance log of every keystroke. A future desktop-only Verified Capture mode is explicitly separate and will label the precise evidence it has; it will not claim to prove that a person conceived every sentence alone.

Ordinary receipts can cover document states or bounded periods without sending prose to the signer. Verified Capture may observe eligible native editing paths, but imported and uncertified text remain visibly distinct.

### C.8 How do hashes work, and what do they prove?

A cryptographic hash is a short fingerprint calculated from the exact content of a document state. The same content produces the same hash; even a tiny edit produces a different one. Inkwave can hash snapshots, link signed receipts to earlier hashes and optionally timestamp a hash. A verifier can detect later alteration and, where a valid signature or timestamp exists, show that the exact content was signed or existed by a certain time.

A hash alone does not identify the writer, reveal how text was produced, detect AI assistance or prove that text was entered through Inkwave. Those conclusions require additional evidence, and some remain impossible. Interoperability also requires an identified algorithm, canonicalization profile and field coverage; two hashes over different representations cannot be meaningfully compared.

### C.9 Can Inkwave show that a Studio was written without AI?

Inkwave is being expanded into a desktop application for macOS and Windows. Its planned optional Verified Capture mode will distinguish eligible native editing inside the Inkwave surface from imported or uncertified text, restrict ordinary bulk insertion and browser automation, and sign bounded capture intervals. That should give readers much higher confidence than a normal web document that certified portions were written in Inkwave without AI insertion.

It cannot guarantee that no AI was used. Manual retyping, custom input hardware and a compromised operating system remain outside its proof, and it cannot establish who conceived an idea. Reader language must expose exact coverage and use bounded terms such as “higher confidence”.

### C.10 Can I build on the format?

Yes. The standard is published under CC BY 4.0. Implementations should use the name carefully: compatibility means preserving the document contract and being clear about which layers and profiles they support.

Independent tools may implement only Core Reader, add source or voice support, or implement a complete writer. They should publish supported record, capability and canonicalization versions. The name must not imply endorsement by Inkwave or compatibility beyond tested profiles.

## Appendix D: Participation, contact and website privacy (informative)

The Writing Studio Standard develops in public. Implementation reports, interoperability tests, terminology corrections and concrete failure cases are welcome.

The website contact page provides Name, Email and Message fields. Its native HTML form posts to Formspree endpoint `https://formspree.io/f/mjgqyqrq` with the subject “Writing Studio Standard feedback”. Submitting sends the entered values and ordinary request metadata to Formspree for delivery to the maintainer. Visitors may instead use direct email.

Contact: petergibson127@gmail.com<br>
Related work: MnemonicEcologies.com

The website uses no analytics, cookies or advertising trackers. Fonts are served from the website domain. Vercel retains ordinary server request logs. These statements describe the public specification site, not every implementation of the Studio format.

## Appendix E: Website-to-specification coverage matrix (informative)

This matrix prevents the concise website from becoming a second, divergent specification.

| Public website subject | Authoritative specification coverage |
|---|---|
| Portable writing, sources and provenance | Sections 2–6 |
| Rich text, mathematics, tables, images, notes and settings | Sections 5.4, 5.7 and Appendix A.2 |
| CSL/BibTeX-style metadata, pinpoints and highlights | Section 6 and Appendix A.3 |
| Emails, readers, media and readalongs as modules | Sections 9–11 |
| Two durable roles and no hidden authoritative cache | Section 7 |
| Lazy first frame and on-demand SSD/provider reads | Section 8 |
| Readable JSON record and structured source of truth | Section 5 and Appendix A.1–A.2 |
| Capability layers and explicit claims | Sections 5.6, 15 and Appendix A |
| Snapshots, hash-only receipts and honest verification | Sections 12–13 and Appendix C.7–C.9 |
| Source-stripped, compressed and rendered exports | Section 14 and Appendix A.6 |
| Planned mnemonic tiles | Section 14.4 and Appendix A.7 |
| Three annotated example records | Appendix B |
| Every published FAQ | Appendix C |
| Feedback form and privacy statement | Section 16.5 and Appendix D |
| CC BY 4.0 and independent implementations | Sections 15 and 17 |
| Download date and maintenance rule | Section 18 |

If the website introduces a capability, claim, example field or limitation absent from this matrix and the referenced section, the downloadable specification is incomplete and MUST be updated before that website change is considered complete.
