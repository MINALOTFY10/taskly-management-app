import { Compass, Layers, MousePointer2, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EmptyState() {
  return (
    <section className="flex min-h-[calc(100dvh-64px)] flex-col items-center justify-center px-5 py-12 text-center sm:px-8">
      <div className="relative h-56 w-52 rounded-2xl border border-t-14 border-l-14 border-indigo-100/70 bg-indigo-50/80 sm:h-70 sm:w-68">
        <div className="absolute bottom-8 left-4 flex size-10 -rotate-6 items-center justify-center rounded-lg border border-slate-200/80 bg-white shadow-sm">
          <MousePointer2 className="size-4 text-slate-500" />
        </div>

        <div className="absolute top-1/2 left-1/2 flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-indigo-200/70 sm:size-22">
          <Compass className="size-8 text-indigo-600 sm:size-10" />
        </div>

        <div className="absolute top-5 right-5 flex size-10 rotate-6 items-center justify-center rounded-lg border border-slate-200/80 bg-white shadow-sm">
          <Layers className="size-4 text-indigo-500" />
        </div>
      </div>

      <h1 className="mt-8 text-[2.2rem] leading-none font-semibold tracking-tight text-foreground">
        No projects found
      </h1>
      <p className="mt-4 max-w-md text-[0.9rem] leading-relaxed text-muted-foreground sm:text-[1rem]">
        You don&apos;t have any projects yet. Start by defining your first
        architectural workspace to begin tracking tasks and epics.
      </p>

      <Button
        asChild
        size="lg"
        className="mt-9 h-12 gap-2 px-7 text-[14px] font-semibold"
      >
        <Link href="/project/add">
          <Plus className="size-4" />
          Create New Project
        </Link>
      </Button>
    </section>
  )
}