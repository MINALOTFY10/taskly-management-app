import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectListLoading() {
  return (
    <section className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-350">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-11 w-48" />
            <Skeleton className="h-6 w-64" />
          </div>

          <Skeleton className="hidden h-12 w-44 rounded-md sm:block" />
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:mt-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg border border-border/45 bg-card px-4 py-4 sm:px-5 sm:py-5"
            >
              <Skeleton className="h-26 w-full rounded-md" />
              <Skeleton className="mt-4 h-4 w-4/5" />
              <Skeleton className="mt-2 h-4 w-1/2" />
              <Skeleton className="mt-5 h-13 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
