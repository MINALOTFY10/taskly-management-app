import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectListLoading() {
  return (
    <section className="px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
      <div className="mx-auto w-full max-w-350">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2.5">
            <Skeleton className="h-10 w-44" />
            <Skeleton className="h-5 w-60" />
          </div>

          <Skeleton className="hidden h-10 w-40 rounded-md sm:block" />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg border border-border/45 bg-card px-3 py-3 sm:px-3 sm:py-3"
            >
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="mt-2.5 h-3 w-4/5" />
              <Skeleton className="mt-1.5 h-3 w-1/2" />
              <Skeleton className="mt-4 h-11 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
