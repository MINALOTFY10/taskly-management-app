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
      <section className="flex flex-col items-center justify-center px-6 py-30 text-center">
        <div className="mb-8 flex size-19 items-center justify-center rounded-xl bg-[#f4d8d8]">
          <Search
            className="size-8 text-[#c62828]"
            strokeWidth={2.6}
            aria-hidden="true"
          />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          No epics found matching your search
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Try a different title keyword.
        </p>
      </section>
    )
  }

  return (
    <section className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-8 rounded-4xl border border-border/60 bg-card p-10 shadow-sm">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex size-18 items-center justify-center rounded-xl bg-primary/10">
            <Rocket className="size-7 text-primary" aria-hidden="true" />
          </div>
          <div className="flex size-18 items-center justify-center rounded-xl bg-muted">
            <Ruler
              className="size-7 text-muted-foreground/40"
              aria-hidden="true"
            />
          </div>
          <div className="flex size-18 items-center justify-center rounded-xl bg-muted">
            <LayoutGrid
              className="size-7 text-muted-foreground/40"
              aria-hidden="true"
            />
          </div>
          <div className="flex size-18 items-center justify-center rounded-xl border-2 border-dashed border-border">
            <Plus
              className="size-6 text-muted-foreground/40"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground">No epics found for this project</h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Break down your large project into manageable epics to track progress
        better and maintain architectural clarity.
      </p>

      <Link href={`/project/${projectId}/epics/add`} aria-label="New epic">
        <Button
          className="mt-8 h-12 gap-2 px-8 text-sm font-semibold shadow-[0_8px_20px_rgba(0,50,184,0.18)]"
          size="lg"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          Create First Epic
        </Button>
      </Link>

      <div className="mt-12 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
        {featureCards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-border/60 bg-card px-5 py-4 text-left shadow-sm"
          >
            <div className="mb-3">{card.icon}</div>
            <h3 className="text-sm font-semibold text-foreground">
              {card.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
