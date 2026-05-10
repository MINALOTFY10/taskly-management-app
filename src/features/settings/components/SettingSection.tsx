"use client"

import React from "react"

type Props = {
  title: string
  description?: string
  children?: React.ReactNode
}

export default function SettingSection({ title, description, children }: Props) {
  return (
    <section className="pb-5 border-b border-border/50 last:border-b-0">
      <div className="flex w-full items-start justify-between">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold mb-1">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}
