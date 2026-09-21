export function countLines(source) {
  return source ? source.split('\n').length : 0
}

export function CodeBar({ filename, language, symbol, lines }) {
  return (
    <div className="code-bar">
      <span className="code-bar__language" aria-label={`${language} code`}>{symbol}</span>
      <span className="code-bar__filename">{filename}</span>
      <span className="code-bar__meta">{lines} {lines === 1 ? 'line' : 'lines'}</span>
    </div>
  )
}
