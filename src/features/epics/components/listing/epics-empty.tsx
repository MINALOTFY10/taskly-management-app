import Link from "next/link"
import {
  GitBranch,
  LayoutGrid,
  Search,
  Plus,
  Rocket,
  Ruler,
  Sparkles,
  TrendingUp,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const featureCards = [
  {
    icon: <Sparkles className="size-5 text-primary" aria-hidden="true" />,
    title: "High-Level Goals",
    description:
      "Define the broad objectives that span across multiple cycles.",
  },
  {
    icon: <GitBranch className="size-5 text-primary" aria-hidden="true" />,
    title: "Hierarchy Design",
    description:
      "Link individual tasks to parent epics for a consolidated view.",
  },
  {
    icon: <TrendingUp className="size-5 text-primary" aria-hidden="true" />,
    title: "Track Velocity",
    description: "Visualize percentage completion at a macro project level.",
  },
]

type EpicsEmptyProps = {
  projectId: string
  searchTerm?: string
}

export default function EpicsEmpty({ projectId, searchTerm }: EpicsEmptyProps) {
  if (searchTerm?.trim()) {
    return (
      <section className="flex flex-col items-center justify-center px-5 py-24 text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-lg bg-error/15">
          <Search
            className="size-7 text-error"
            strokeWidth={2.6}
            aria-hidden="true"
          />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          No epics found matching your search
        </h2>
        <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
          Try a different title keyword.
        </p>
      </section>
    )
  }

  return (
    <section className="flex flex-col items-center justify-center px-5 py-10 text-center">
      <div className="mb-6 rounded-3xl border border-border/60 bg-card p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex size-15 items-center justify-center rounded-lg bg-primary/10">
            <Rocket className="size-7 text-primary" aria-hidden="true" />
          </div>
          <div className="flex size-15 items-center justify-center rounded-lg bg-muted">
            <Ruler
              className="size-7 text-muted-foreground/40"
              aria-hidden="true"
            />
          </div>
          <div className="flex size-15 items-center justify-center rounded-lg bg-muted">
            <LayoutGrid
              className="size-7 text-muted-foreground/40"
              aria-hidden="true"
            />
          </div>
          <div className="flex size-15 items-center justify-center rounded-lg border-2 border-dashed border-border">
            <Plus
              className="size-5 text-muted-foreground/40"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-foreground">No epics found for this project</h2>
      <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
        Break down your large project into manageable epics to track progress
        better and maintain architectural clarity.
      </p>

      <Link href={`/project/${projectId}/epics/add`} aria-label="New epic">
        <Button
          className="mt-6 h-10 gap-1.5 px-6 text-xs font-semibold shadow-sm"
          size="lg"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          Create First Epic
        </Button>
      </Link>

      <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
        {featureCards.map((card) => (
          <div
            key={card.title}
            className="rounded-lg border border-border/60 bg-card px-4 py-3 text-left shadow-sm"
          >
            <div className="mb-2.5">{card.icon}</div>
            <h3 className="text-xs font-semibold text-foreground">
              {card.title}
            </h3>
            <p className="mt-0.5 text-[0.7rem] leading-relaxed text-muted-foreground">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
