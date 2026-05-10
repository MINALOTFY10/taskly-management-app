function EpicCardSkeleton() {
  return (
    <div className="flex flex-col rounded-lg border border-border/60 bg-card p-3 shadow-sm">
      <div className="flex items-start justify-between gap-1.5">
        <div className="h-4 w-16 animate-pulse rounded-sm bg-muted" />
        <div className="size-6 animate-pulse rounded-md bg-muted" />
      </div>

      <div className="mt-2 space-y-1.5">
        <div className="h-3.5 w-full animate-pulse rounded bg-muted" />
        <div className="h-3.5 w-2/3 animate-pulse rounded bg-muted" />
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="size-7 animate-pulse rounded-full bg-muted" />
          <div className="space-y-1">
            <div className="h-2 w-10 animate-pulse rounded bg-muted" />
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="h-5 w-12 animate-pulse rounded-sm bg-muted" />
      </div>

      <div className="my-2.5 h-px w-full bg-border/60" />

      <div className="flex items-center justify-between">
        <div className="h-2.5 w-32 animate-pulse rounded bg-muted" />
        <div className="h-2.5 w-18 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

export default function EpicsSkeleton() {
  return (
    <section className="relative px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2.5">
          <div className="h-2.5 w-48 animate-pulse rounded bg-muted" />
          <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="hidden items-center gap-2.5 sm:flex">
          <div className="h-9 w-40 animate-pulse rounded-lg bg-muted" />
          <div className="h-9 w-28 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Epics list">
        {Array.from({ length: 6 }).map((_, index) => (
          <EpicCardSkeleton key={index} />
        ))}
      </div>
    </section>
  )
}