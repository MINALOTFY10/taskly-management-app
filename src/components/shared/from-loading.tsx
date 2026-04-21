import { Skeleton } from "@/components/ui/skeleton"

export default function FormLoading() {
  return (
    <section className="px-5 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto hidden w-full items-start justify-between gap-4 sm:flex">
        <div className="space-y-2">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-11 w-52" />
        </div>
      </div>

      <div className="mx-auto mt-4 w-full max-w-220 overflow-hidden rounded-md bg-transparent sm:mt-10 sm:mb-5 sm:border sm:border-border/55 sm:bg-card">
        <div className="px-0 py-5 sm:border-b sm:border-border/60 sm:px-8 sm:py-8">
          <div className="flex items-start gap-4">
            <Skeleton className="hidden size-12 shrink-0 sm:block" />

            <div className="space-y-3">
              <Skeleton className="h-9 w-64" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
        </div>

        <div className="space-y-6 px-0 py-5 sm:px-8 sm:py-7">
          <div className="space-y-2">
            <Skeleton className="h-4 w-30" />
            <Skeleton className="h-14 w-full sm:h-12" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>

            <Skeleton className="h-44 w-full sm:h-36" />
            <div className="flex justify-end">
              <Skeleton className="h-4 w-28" />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-11 w-26" />
            <Skeleton className="h-12 w-full sm:w-40" />
          </div>
        </div>

        <div className="mt-3 rounded-lg bg-surface-high px-4 py-4 sm:mt-0 sm:rounded-none sm:border-t sm:border-border/60 sm:px-8">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-4 w-full max-w-160" />
          </div>
        </div>
      </div>
    </section>
  )
}