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
    <section className="flex min-h-[calc(100dvh-56px)] flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
      <div className="app-surface-card-soft w-full max-w-lg px-5 py-6 sm:px-6">
        <div className="mx-auto flex size-16 items-center justify-center rounded-lg bg-error/15 text-error shadow-sm">
          <Icon className="size-8" />
        </div>

        <h1 className="mt-4 text-[2rem] leading-none font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-3 text-[0.85rem] leading-relaxed text-muted-foreground sm:text-[0.9rem]">
          {message}
        </p>

        {actionHref ? (
          <Button
            asChild
            size="lg"
            className="mt-5 h-10 px-6 text-[13px] font-semibold"
          >
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onAction}
            size="lg"
            className="mt-5 h-10 px-6 text-[13px] font-semibold"
            disabled={!onAction}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </section>
  )
}