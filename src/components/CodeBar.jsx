export function sourceLineRange(source, snippet) {
  const offset = source.indexOf(snippet)
  if (offset < 0) throw new Error('Displayed code snippet does not match its engineering-spec source')

  const start = source.slice(0, offset).split('\n').length
  return { start, end: start + snippet.split('\n').length - 1 }
}

export function fencedSourceLineRange(source, marker) {
  const markerOffset = source.indexOf(marker)
  const fenceOffset = markerOffset < 0 ? -1 : source.indexOf('\n~~~', markerOffset)
  const codeOffset = fenceOffset < 0 ? -1 : source.indexOf('\n', fenceOffset + 1) + 1
  const fenceEnd = codeOffset < 0 ? -1 : source.indexOf('\n~~~', codeOffset)

  if (markerOffset < 0 || fenceOffset < 0 || codeOffset < 0 || fenceEnd < 0) {
    throw new Error(`Could not locate fenced source for ${marker}`)
  }

  const snippet = source.slice(codeOffset, fenceEnd)
  const start = source.slice(0, codeOffset).split('\n').length
  return { start, end: start + snippet.split('\n').length - 1 }
}

export function CodeBar({ filename, language, symbol, lineStart, lineEnd }) {
  return (
    <div className="code-bar">
      <span className="code-bar__language" aria-label={`${language} code`}>{symbol}</span>
      <span className="code-bar__filename">{filename}</span>
      <span className="code-bar__meta">{lineStart === lineEnd ? `Line ${lineStart}` : `Lines ${lineStart}–${lineEnd}`}</span>
    </div>
  )
}
