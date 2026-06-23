import { useEffect } from 'react'

const BASE = 'Writing Studio Standard'

export function useMeta({ title, description, path = '/' }) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : `${BASE} — Open standard for process-aware documents`

    const setMeta = (sel, val) => {
      const el = document.querySelector(sel)
      if (el) el.setAttribute('content', val)
    }

    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:title"]', document.title)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:url"]', `https://writingstudiostandard.org${path}`)

    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', `https://writingstudiostandard.org${path}`)
  }, [title, description, path])
}
