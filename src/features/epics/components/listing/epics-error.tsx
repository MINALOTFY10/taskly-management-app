"use client"

import { EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"

type EpicsErrorProps = {
  onRetry: () => void
}

export default function EpicsError({ onRetry }: EpicsErrorProps) {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-error/15">
        <EyeOff className="size-8 text-error" aria-hidden="true" />
      </div>

      <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        We&apos;re having trouble retrieving your project epics right now. Please try again in a moment.
      </p>

      <Button className="mt-6 h-11 px-8 text-sm font-semibold" onClick={onRetry}>
        Retry Connection
      </Button>
    </section>
  )
}