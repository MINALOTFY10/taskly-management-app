"use client"

import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { FileWarning } from "lucide-react"

import { Button } from "@/components/ui/button"

type AppErrorStateProps = {
  title?: string
  message: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  icon?: LucideIcon
}

export default function AppErrorState({
  title = "Something went wrong",
  message,
  actionLabel = "Retry Connection",
  actionHref,
  onAction,
  icon: Icon = FileWarning,
}: AppErrorStateProps) {
  return (
    <section className="flex min-h-[calc(100dvh-64px)] flex-col items-center justify-center px-5 py-12 text-center sm:px-8">
      <div className="flex size-18 items-center justify-center rounded-xl bg-error/15 text-error">
        <Icon className="size-9" />
      </div>

      <h1 className="mt-6 text-[2.2rem] leading-none font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-4 max-w-sm text-[0.9rem] leading-relaxed text-muted-foreground sm:text-[1rem]">
        {message}
      </p>

      {actionHref ? (
        <Button
          asChild
          size="lg"
          className="mt-7 h-12 px-7 text-[14px] font-semibold"
        >
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onAction}
          size="lg"
          className="mt-7 h-12 px-7 text-[14px] font-semibold"
          disabled={!onAction}
        >
          {actionLabel}
        </Button>
      )}
    </section>
  )
}