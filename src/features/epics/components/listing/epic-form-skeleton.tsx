function FieldSkeleton({ height = "h-12" }: { height?: string }) {
  return (
    <div className={`w-full animate-pulse rounded-md bg-muted ${height}`} />
  )
}

function LabelSkeleton() {
  return (
    <div className="mb-2 h-3 w-24 animate-pulse rounded bg-muted" />
  )
}

export default function EpicFormSkeleton() {
  return (
    <section className="px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
      {/* Header */}
      <div className="mx-auto hidden w-full sm:flex">
        <div className="space-y-2.5">
          <div className="h-2.5 w-60 animate-pulse rounded bg-muted" />
          <div className="h-7 w-48 animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* Form Card */}
      <div className="mx-auto mt-5 w-full max-w-220 rounded-lg sm:border sm:border-border/55 sm:bg-card">
        {/* Title Section */}
        <div className="space-y-2.5 border-b border-border/60 px-0 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="size-10 animate-pulse rounded-lg bg-muted" />
            <div className="space-y-1.5">
              <div className="h-4 w-36 animate-pulse rounded bg-muted" />
              <div className="h-2.5 w-60 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-5 px-0 py-5 sm:px-7">
          {/* Title */}
          <div>
            <LabelSkeleton />
            <FieldSkeleton height="h-10" />
          </div>

          {/* Description */}
          <div>
            <LabelSkeleton />
            <div className="h-28 w-full animate-pulse rounded-md bg-muted" />
            <div className="mt-2 h-2.5 w-14 animate-pulse rounded bg-muted ml-auto" />
          </div>

          {/* Grid Fields */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <LabelSkeleton />
              <FieldSkeleton />
            </div>

            <div>
              <LabelSkeleton />
              <FieldSkeleton />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
            <div className="h-9 w-20 animate-pulse rounded bg-muted" />
            <div className="h-10 w-36 animate-pulse rounded bg-muted" />
          </div>
        </div>

        {/* Tip */}
        <div className="border-t border-border/60 px-3 py-3 sm:px-7">
          <div className="h-2.5 w-68 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </section>
  )
}