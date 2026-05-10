import Link from "next/link"
import { EllipsisVertical, Pencil } from "lucide-react"

import { formatProjectDate } from "@/features/projects/utils/date"
import type { ProjectRow } from "../../types"

export default function ProjectListItem({ project }: { project: ProjectRow }) {
  return (
    <Link href={`/project/${project.id}/epics`} className="flex min-h-36 flex-col rounded-lg border border-border/60 bg-card px-3 py-2.5 shadow-sm transition-all duration-200 hover:border-border/80 hover:bg-accent/10 hover:shadow-md sm:min-h-40 sm:px-3 sm:py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="block min-w-0 flex-1">
          <h2 className="line-clamp-2 text-[1rem] leading-snug font-semibold text-foreground">
            {project.name}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href={`/project/${project.id}/edit`}
            aria-label={`Edit ${project.name}`}
            className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
          >
            <Pencil className="size-3.5" />
          </Link>

          <div
            aria-label={`Open ${project.name}`}
            className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground/70 transition-colors hover:bg-accent hover:text-foreground sm:hidden"
          >
            <EllipsisVertical className="size-3.5" />
          </div>
        </div>
      </div>

      <div className="mt-2 flex grow flex-col">
        <p className="line-clamp-2 text-[0.72rem] leading-relaxed text-muted-foreground sm:line-clamp-3 sm:text-[0.78rem]">
          {project.description || "No project description provided."}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-2 sm:pt-2.5">
          <span className="text-[0.6rem] font-bold tracking-[0.07em] text-muted-foreground uppercase sm:text-[0.65rem]">
            Created At
          </span>
          <span className="text-[0.76rem] font-medium text-foreground/80 sm:text-[0.82rem]">
            {formatProjectDate(project.created_at)}
          </span>
        </div>
      </div>
    </Link>
  )
}
