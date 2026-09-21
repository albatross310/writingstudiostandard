function tokenize(source) {
  const tokens = []
  let index = 0

  const push = (type, value) => tokens.push({ type, value })

  while (index < source.length) {
    const rest = source.slice(index)

    if (rest.startsWith('<!--')) {
      const end = source.indexOf('-->', index)
      const next = end < 0 ? source.length : end + 3
      push('comment', source.slice(index, next))
      index = next
      continue
    }

    if (rest.startsWith('/*')) {
      const end = source.indexOf('*/', index)
      const next = end < 0 ? source.length : end + 2
      push('comment', source.slice(index, next))
      index = next
      continue
    }

    if (rest.startsWith('//')) {
      const end = source.indexOf('\n', index)
      const next = end < 0 ? source.length : end
      push('comment', source.slice(index, next))
      index = next
      continue
    }

    const rule = rest.match(/^[═━ ]+/)
    if ((source[index] === '═' || source[index] === '━') && rule) {
      push('comment', rule[0])
      index += rule[0].length
      continue
    }

    const quote = source[index]
    if (quote === '"' || quote === "'" || quote === '`') {
      let end = index + 1
      while (end < source.length) {
        if (source[end] === '\\') {
          end += 2
          continue
        }
        if (source[end] === quote) {
          end++
          break
        }
        end++
      }
      let next = end
      while (next < source.length && /\s/.test(source[next])) next++
      push(source[next] === ':' ? 'key' : 'string', source.slice(index, end))
      index = end
      continue
    }

    const number = rest.match(/^-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/)
    if (number && !/[A-Za-z_$]/.test(source[index - 1] || '')) {
      push('number', number[0])
      index += number[0].length
      continue
    }

    const identifier = rest.match(/^[A-Za-z_$][\w$-]*/)
    if (identifier) {
      const value = identifier[0]
      let next = index + value.length
      while (next < source.length && /\s/.test(source[next])) next++
      const type = /^(true|false|null|undefined)$/.test(value)
        ? 'keyword'
        : source[next] === ':'
          ? 'key'
          : source[next] === '('
            ? 'function'
            : 'text'
      push(type, value)
      index += value.length
      continue
    }

    const punctuation = rest.match(/^[{}[\]():,;?.=|]+/)
    if (punctuation) {
      push('punctuation', punctuation[0])
      index += punctuation[0].length
      continue
    }

    const plain = rest.match(/^[^A-Za-z_$0-9'"`{}[\]():,;?.=|/═━-]+/)
    if (plain) {
      push('text', plain[0])
      index += plain[0].length
      continue
    }

    push('text', source[index])
    index++
  }

  return tokens
}

export function SyntaxHighlight({ text }) {
  return tokenize(text).map(({ type, value }, index) => (
    <span className={`syntax-token syntax-token--${type}`} key={index}>{value}</span>
  ))
}
