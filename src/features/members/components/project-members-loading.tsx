import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectMembersLoading() {
  return (
    <section className="px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
      <div className="mx-auto w-full max-w-350">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2.5">
            <Skeleton className="h-3 w-52" />
            <Skeleton className="h-10 w-64" />
          </div>

          <Skeleton className="hidden h-10 w-40 rounded-md sm:block" />
        </div>

        <div className="mt-5 hidden overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm sm:mt-6 md:block">
          <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(110px,0.7fr)_minmax(120px,0.7fr)_40px] gap-3 border-b border-border/60 px-5 py-3">
            <Skeleton className="h-2.5 w-10" />
            <Skeleton className="h-2.5 w-8" />
            <Skeleton className="h-2.5 w-14" />
            <Skeleton className="ml-auto h-2.5 w-8" />
          </div>

          <div className="divide-y divide-border/60">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[minmax(0,1.5fr)_minmax(110px,0.7fr)_minmax(120px,0.7fr)_40px] items-center gap-3 px-5 py-3"
              >
                <div className="flex items-center gap-2.5">
                  <Skeleton className="size-9 rounded-lg" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <Skeleton className="h-5 w-18 rounded-full" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="ml-auto size-3.5" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-2.5 md:hidden">
          {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-lg border border-border/60 bg-card px-3 py-2.5 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Skeleton className="size-9 rounded-lg" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-36" />
                </div>
                  <Skeleton className="h-5 w-14 rounded-md" />
                  <Skeleton className="size-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
