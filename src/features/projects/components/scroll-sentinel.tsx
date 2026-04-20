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

  useEffect(() => {
    if (!enabled || !ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onIntersect()
      },
      { rootMargin: "220px" }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [enabled, onIntersect])

  return <div ref={ref} className="h-4 w-full" />
}
