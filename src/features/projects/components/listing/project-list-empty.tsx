import { Compass, Layers, MousePointer2, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EmptyState() {
  return (
    <section className="flex min-h-[calc(100dvh-56px)] flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
      <div className="relative h-56 w-52 rounded-3xl border border-t-14 border-l-14 border-primary/15 bg-primary/5 sm:h-70 sm:w-68">
        <div className="absolute bottom-8 left-4 flex size-10 -rotate-6 items-center justify-center rounded-xl border border-border/60 bg-card shadow-sm">
          <MousePointer2 className="size-4 text-muted-foreground" />
        </div>

        <div className="absolute top-1/2 left-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-primary/15 sm:size-20">
          <Compass className="size-8 text-primary sm:size-10" />
        </div>

        <div className="absolute top-5 right-5 flex size-10 rotate-6 items-center justify-center rounded-xl border border-border/60 bg-card shadow-sm">
          <Layers className="size-4 text-primary" />
        </div>
      </div>

      <h1 className="mt-6 text-[1.9rem] leading-none font-semibold tracking-tight text-foreground">
        No projects found
      </h1>
      <p className="mt-3 max-w-md text-[0.85rem] leading-relaxed text-muted-foreground sm:text-[0.9rem]">
        You don&apos;t have any projects yet. Start by defining your first
        architectural workspace to begin tracking tasks and epics.
      </p>

      <Button
        asChild
        size="lg"
        className="mt-7 h-10 gap-1.5 px-6 text-[13px] font-semibold"
      >
        <Link href="/project/add">
          <Plus className="size-4" />
          Create New Project
        </Link>
      </Button>
    </section>
  )
}