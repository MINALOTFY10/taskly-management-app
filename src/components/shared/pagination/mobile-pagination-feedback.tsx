"use client"

import { Loader2 } from "lucide-react"

type MobilePaginationFeedbackProps = {
  isLoadingMore: boolean
  errorMessage: string | null
  showError?: boolean
  loadingText?: string
  retryLabel?: string
  onRetry?: () => void
}

export default function MobilePaginationFeedback({
  isLoadingMore,
  errorMessage,
  showError = true,
  loadingText = "Loading more items",
  retryLabel = "Retry",
  onRetry,
}: MobilePaginationFeedbackProps) {
  return (
    <>
      {isLoadingMore && (
        <div
          role="status"
          aria-live="polite"
          className="mb-2 rounded-lg border border-border/60 bg-card/60 px-3 py-2.5 backdrop-blur-sm"
        >
          <span className="inline-flex items-center gap-2.5 text-xs text-muted-foreground">
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Loader2 className="size-3.5 animate-spin" />
            </span>
            <span className="leading-none">
              {loadingText}
              <span className="ml-1 inline-flex animate-pulse">...</span>
            </span>
          </span>
        </div>
      )}

      {showError && errorMessage && (
        <div className="flex items-center justify-between pb-4">
          <p className="text-xs text-error">{errorMessage}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="text-xs text-primary underline underline-offset-2 transition-opacity hover:opacity-70"
            >
              {retryLabel}
            </button>
          )}
        </div>
      )}
    </>
  )
}
