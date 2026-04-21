"use client"

import { useEffect, useRef } from "react"

export default function ScrollSentinel({
  onIntersect,
  enabled,
}: {
  onIntersect: () => void
  enabled: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const onIntersectRef = useRef(onIntersect)
  onIntersectRef.current = onIntersect

  useEffect(() => {
    if (!enabled || !ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onIntersectRef.current()
      },
      { rootMargin: "220px" }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [enabled])

  return <div ref={ref} className="h-4 w-full" />
}
