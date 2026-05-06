import { Skeleton } from "@/components/ui/skeleton"

export default function FormLoading() {
  return (
    <section className="app-page-shell">
      <div className="mx-auto hidden w-full items-start justify-between gap-3 sm:flex">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-9 w-48" />
        </div>
      </div>

      <div className="mx-auto mt-3 w-full max-w-220 overflow-hidden rounded-lg bg-transparent sm:mt-8 sm:mb-4 sm:border sm:border-border/60 sm:bg-card sm:shadow-sm">
        <div className="px-0 py-4 sm:border-b sm:border-border/60 sm:px-7 sm:py-6">
          <div className="flex items-start gap-3">
            <Skeleton className="hidden size-10 shrink-0 sm:block" />

            <div className="space-y-2.5">
              <Skeleton className="h-8 w-60" />
              <Skeleton className="h-3 w-68" />
            </div>
          </div>
        </div>

        <div className="space-y-5 px-0 py-4 sm:px-7 sm:py-6">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-10 w-full sm:h-9" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-14" />
            </div>

            <Skeleton className="h-40 w-full sm:h-32" />
            <div className="flex justify-end">
              <Skeleton className="h-3 w-24" />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-10 w-full sm:w-36" />
          </div>
        </div>

        <div className="mt-2 rounded-lg bg-surface-high px-3 py-3 sm:mt-0 sm:rounded-none sm:border-t sm:border-border/60 sm:px-7">
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="h-3 w-full max-w-148" />
          </div>
        </div>
      </div>
    </section>
  )
}