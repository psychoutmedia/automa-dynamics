'use client'

import { useEffect, useRef, useState } from 'react'

/* The ARGUS Proof-2 Executive graph, embedded from the static explorer.
   The explorer's ?embed=exec mode posts its content height to the parent
   (argusEmbedHeight) and answers argusHeightRequest, so the frame grows to
   fit instead of scrolling inside the page. Messages are accepted only from
   this frame's own window. */
export default function ArgusEmbed({ src, title, minHeight = 900 }) {
  const ref = useRef(null)
  const [height, setHeight] = useState(minHeight)

  useEffect(() => {
    const onMessage = (ev) => {
      const frame = ref.current
      if (!frame || ev.source !== frame.contentWindow) return
      const h = ev.data && ev.data.argusEmbedHeight
      if (typeof h === 'number' && h > 200 && h < 20000) setHeight(Math.ceil(h))
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const ask = () => {
    try {
      ref.current?.contentWindow?.postMessage({ argusHeightRequest: true }, window.location.origin)
    } catch (_) {}
  }

  return (
    <iframe
      ref={ref}
      src={src}
      title={title}
      onLoad={ask}
      style={{ height }}
      className="block w-full rounded-2xl border border-white/10 bg-[#0E131A]"
    />
  )
}
