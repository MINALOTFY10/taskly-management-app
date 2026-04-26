import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectMembersLoading() {
  return (
    <section className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-350">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-3 w-56" />
            <Skeleton className="h-11 w-70" />
          </div>

          <Skeleton className="hidden h-12 w-44 rounded-md sm:block" />
        </div>

        <div className="mt-7 hidden overflow-hidden rounded-xl border border-border/45 bg-card sm:mt-8 md:block">
          <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(110px,0.7fr)_minmax(120px,0.7fr)_40px] gap-4 border-b border-border/60 px-6 py-4">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="ml-auto h-3 w-10" />
          </div>

          <div className="divide-y divide-border/60">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[minmax(0,1.5fr)_minmax(110px,0.7fr)_minmax(120px,0.7fr)_40px] items-center gap-4 px-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-11 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-52" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="ml-auto size-4" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3 md:hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-border/45 bg-card px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-11 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="size-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
