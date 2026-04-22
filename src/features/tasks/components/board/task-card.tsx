import { CalendarDays } from "lucide-react"

import { cn } from "@/lib/utils"
import { getAvatarColor, getInitials } from "@/features/epics/utils/avatar"
import type { TaskWithAssignee } from "../../queries"
import type { TaskStatus } from "../../types"
import { formatTaskDate } from "../../utils/date"
import { TASK_STATUS_VISUALS } from "../../utils/task-status-visuals"

export default function TaskCard({
  task,
  status,
  onSelect,
}: {
  task: TaskWithAssignee
  status: TaskStatus
  onSelect?: (task: TaskWithAssignee) => void
}) {
  const theme = TASK_STATUS_VISUALS[status]
  const assigneeName = task.assignee_name ?? "Unassigned"
  const { bg, text } = getAvatarColor(assigneeName)
  const initials = getInitials(assigneeName)

  const handleSelect = () => onSelect?.(task)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onSelect?.(task)
    }
  }

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Open task: ${task.title}`}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        "rounded-xl border px-4 py-4 shadow-sm cursor-pointer transition-all",
        "hover:shadow-md hover:scale-105",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        theme.card
      )}
    >
      <div className="flex min-h-28 flex-col justify-between gap-4">
        <div className="space-y-3">
          <h3 className="line-clamp-2 text-[0.93rem] leading-5 font-semibold tracking-tight text-slate-800">
            {task.title}
          </h3>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[0.68rem] font-semibold tracking-[0.18em] text-slate-500 uppercase">
            <CalendarDays className="size-3.5" />
            <span>{formatTaskDate(task.due_date)}</span>
          </div>

          <div
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full text-[0.55rem] font-semibold ring-2 ring-background",
              bg,
              text
            )}
            title={assigneeName}
          >
            {task.assignee_avatar ? (
              <img
                src={task.assignee_avatar}
                alt={assigneeName}
                className="size-full rounded-[inherit] object-cover"
                loading="lazy"
              />
            ) : (
              initials
            )}
          </div>
        </div>
      </div>
    </article>
  )
}