import Link from "next/link"
import { ArrowRight, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EPIC_STATUS_CONFIG } from "../../utils/status"
import { formatProjectDate } from "@/features/projects/utils/date"
import type { EpicRow } from "@/features/projects/types"
import { cn } from "@/lib/utils"

// ─── Single row ───────────────────────────────────────────────────────────────

function EpicItem({ epic, projectId }: { epic: EpicRow; projectId: string }) {
  const statusConfig =
    EPIC_STATUS_CONFIG[epic.status] ?? EPIC_STATUS_CONFIG.TO_DO

  return (
    <li>
      <Link
        href={`/project/${projectId}/epics/${epic.id}`}
        className="flex items-start gap-2 rounded-lg px-2.5 py-2 transition-colors hover:bg-accent/40"
      >
        {/* Status badge */}
        <span
          className={cn(
            "mt-0.5 shrink-0 rounded-sm px-1.5 py-0.5 text-[0.55rem] font-bold tracking-wide uppercase",
            statusConfig.className
          )}
        >
          {statusConfig.label}
        </span>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.85rem] font-semibold leading-snug text-foreground">
            {epic.title}
          </p>
          {epic.epic_id && (
            <p className="mt-0.5 text-[0.6rem] font-mono text-muted-foreground/70">
              {epic.epic_id}
            </p>
          )}
        </div>

        {/* Deadline */}
        {epic.deadline && (
          <span className="shrink-0 text-[0.65rem] text-muted-foreground">
            {formatProjectDate(epic.deadline)}
          </span>
        )}
      </Link>
    </li>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

type EpicsSectionProps = {
  epics: EpicRow[]
  projectId: string
  error: string | null
}

export default function EpicsSection({
  epics,
  projectId,
  error,
}: EpicsSectionProps) {
  return (
    <div className="app-surface-card">
      <div className="app-surface-header">
        <div className="flex items-center gap-2.5">
          <div className="app-surface-icon">
            <Layers className="size-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Epics</h2>
            <p className="text-[0.72rem] text-muted-foreground">
              Recent epics
            </p>
          </div>
        </div>

        <Button
          asChild
          size="sm"
          variant="ghost"
          className="h-8 gap-1 px-3 text-[0.75rem] font-semibold text-primary hover:text-primary/85"
        >
          <Link href={`/project/${projectId}/epics`}>
            View all
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>

      {/* Body */}
      <div className="app-surface-body">
        {error ? (
          <p className="px-3 py-4 text-center text-sm text-destructive">
            {error}
          </p>
        ) : epics.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No epics yet.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {epics.map((epic) => (
              <EpicItem key={epic.id} epic={epic} projectId={projectId} />
            ))}
          </ul>
        )}
      </div>

      {/* Footer link on mobile */}
      {epics.length > 0 && (
        <div className="border-t border-border/60 px-5 py-3 sm:hidden">
          <Link
            href={`/project/${projectId}/epics`}
            className="flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            View all epics
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}
    </div>
  )
}