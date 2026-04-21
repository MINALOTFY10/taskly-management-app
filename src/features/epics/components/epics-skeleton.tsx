function EpicCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
        <div className="size-7 animate-pulse rounded-md bg-muted" />
      </div>

      <div className="mt-3 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="size-9 animate-pulse rounded-full bg-muted" />
          <div className="space-y-1.5">
            <div className="h-2.5 w-12 animate-pulse rounded bg-muted" />
            <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="h-6 w-14 animate-pulse rounded-md bg-muted" />
      </div>

      <div className="my-4 h-px w-full bg-border/60" />

      <div className="flex items-center justify-between">
        <div className="h-3 w-36 animate-pulse rounded bg-muted" />
        <div className="h-3 w-20 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

export default function EpicsSkeleton() {
  return (
    <section className="px-5 py-5 sm:px-6 sm:py-7 lg:px-8">
      {/* Page header skeleton */}
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="h-3 w-52 animate-pulse rounded bg-muted" />
          <div className="h-9 w-44 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <div className="h-10 w-44 animate-pulse rounded-lg bg-muted" />
          <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>

      {/* Card grid skeleton — 6 cards matching default PAGE_SIZE */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <EpicCardSkeleton key={i} />
        ))}
      </div>
    </section>
  )
}
