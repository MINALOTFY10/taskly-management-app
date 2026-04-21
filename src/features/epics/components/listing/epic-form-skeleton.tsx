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
    <section className="px-5 py-5 sm:px-6 sm:py-7 lg:px-8">
      {/* Header */}
      <div className="mx-auto hidden w-full sm:flex">
        <div className="space-y-3">
          <div className="h-3 w-64 animate-pulse rounded bg-muted" />
          <div className="h-8 w-52 animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* Form Card */}
      <div className="mx-auto mt-6 w-full max-w-220 rounded-md sm:border sm:border-border/55 sm:bg-card">
        {/* Title Section */}
        <div className="space-y-3 border-b border-border/60 px-0 py-6 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="size-12 animate-pulse rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-5 w-40 animate-pulse rounded bg-muted" />
              <div className="h-3 w-64 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6 px-0 py-6 sm:px-8">
          {/* Title */}
          <div>
            <LabelSkeleton />
            <FieldSkeleton height="h-14" />
          </div>

          {/* Description */}
          <div>
            <LabelSkeleton />
            <div className="h-32 w-full animate-pulse rounded-md bg-muted" />
            <div className="mt-2 h-3 w-16 animate-pulse rounded bg-muted ml-auto" />
          </div>

          {/* Grid Fields */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
          <div className="flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:justify-between">
            <div className="h-11 w-24 animate-pulse rounded bg-muted" />
            <div className="h-12 w-40 animate-pulse rounded bg-muted" />
          </div>
        </div>

        {/* Tip */}
        <div className="border-t border-border/60 px-4 py-4 sm:px-8">
          <div className="h-3 w-72 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </section>
  )
}