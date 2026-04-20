import { EllipsisVertical } from "lucide-react"
import type { ProjectRow } from "../types"

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

function formatProjectDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return dateFormatter.format(date)
}

export default function ProjectListItem({ project }: { project: ProjectRow }) {
  return (
    <article className="flex min-h-47.5 flex-col rounded-lg border border-border/45 bg-card px-4 py-4 shadow-[0_1px_0_rgba(0,0,0,0.02)] sm:min-h-55 sm:px-5 sm:py-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="line-clamp-2 text-[1.3rem] leading-tight font-semibold text-foreground">
          {project.name}
        </h2>
        <button
          type="button"
          aria-label="Project options"
          className="text-muted-foreground/70 sm:hidden"
        >
          <EllipsisVertical className="size-4" />
        </button>
      </div>

      <p className="mt-4 line-clamp-3 text-[0.8rem] leading-relaxed text-muted-foreground sm:line-clamp-4">
        {project.description || "No project description provided."}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-3 sm:pt-4">
        <span className="text-[0.6rem] font-bold tracking-[0.07em] text-muted-foreground uppercase sm:text-[0.67rem]">
          Created At
        </span>
        <span className="text-[0.9rem] font-medium text-foreground/80">
          {formatProjectDate(project.created_at)}
        </span>
      </div>
    </article>
  )
}
