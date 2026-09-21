# Writing Studio Standard

The public website for the Writing Studio Standard. It is a small Vite and React application deployed through Vercel.

## Development

```bash
pnpm install
pnpm dev
pnpm build
```

## Downloadable engineering specification

[`src/content/engineering-spec.md`](src/content/engineering-spec.md) is the source for the **Download engineering spec** control on the Standard page. Vite bundles that Markdown directly into the client, and the browser creates the downloaded file from those exact bytes. There is no separately uploaded static export that can drift from the deployed website.

When changing any public-page content, update `engineering-spec.md` in the same pull request. That includes terminology, capability status, data-model details, conformance requirements, privacy/provenance claims, FAQ answers, worked examples and contact information. The Markdown is the complete engineer-formatted counterpart to the public site, not a shorter technical summary.

## Release check

Before merging a content update, run:

```bash
node node_modules/vite/bin/vite.js build
```

When the specification changes, download the Markdown from the Standard page and confirm it identifies the current document model and capability status.
