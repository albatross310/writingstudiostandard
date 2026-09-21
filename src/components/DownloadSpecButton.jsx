// Builds the downloadable Markdown in the browser so its header and filename can carry the reader's
// local download date while retaining a normal download anchor rather than a programmatic Blob click.
import engineeringSpec from '../content/engineering-spec.md?raw'

const VERSION_LINE = '**Specification version:** 0.2\n'

function localIsoDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function DownloadSpecButton() {
  const now = new Date()
  const isoDate = localIsoDate(now)
  const readableDate = new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now)
  const dateLine = `**Downloaded:** ${readableDate}\n`
  const datedSpec = engineeringSpec.includes(VERSION_LINE)
    ? engineeringSpec.replace(VERSION_LINE, `${VERSION_LINE}${dateLine}`)
    : `${dateLine}\n${engineeringSpec}`
  const downloadUrl = `data:text/markdown;charset=utf-8,${encodeURIComponent(datedSpec)}`

  return (
    <a
      className="btn btn--primary"
      href={downloadUrl}
      download={`writing-studio-standard-engineering-spec-${isoDate}.md`}
    >
      Download engineering spec
    </a>
  )
}
