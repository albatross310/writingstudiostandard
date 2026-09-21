// Emits a versioned Markdown asset and uses a normal anchor, so browsers can download the current
// specification without relying on a programmatic Blob download.
import engineeringSpecUrl from '../content/engineering-spec.md?url'

export default function DownloadSpecButton() {
  return <a className="btn btn--primary" href={engineeringSpecUrl} download="writing-studio-standard-engineering-spec.md">Download engineering spec</a>
}
