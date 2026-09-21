// Builds the download from Markdown bundled with this site, so the public page and its engineering
// specification always come from the same release.
import engineeringSpec from '../content/engineering-spec.md?raw'

export default function DownloadSpecButton() {
  const download = () => {
    const file = new Blob([engineeringSpec], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = 'writing-studio-standard-engineering-spec.md'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  return <button type="button" className="btn btn--primary" onClick={download}>Download engineering spec</button>
}
