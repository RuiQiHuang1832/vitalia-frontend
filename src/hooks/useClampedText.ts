import { useEffect, useRef, useState } from 'react'

export function useClampedText(key?: string | number | null) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [isClamped, setIsClamped] = useState(false)

  useEffect(() => {
    setExpanded(false)
    const el = ref.current
    if (el) setIsClamped(el.scrollHeight > el.clientHeight)
  }, [key])

  const toggle = () => setExpanded((prev) => !prev)
  const showToggle = isClamped || expanded

  return { ref, expanded, showToggle, toggle }
}
