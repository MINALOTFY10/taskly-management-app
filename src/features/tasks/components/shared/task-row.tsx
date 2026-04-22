import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getInitials, getAvatarColor } from "@/features/epics/utils/avatar"
import { formatTaskDate } from "@/features/tasks/utils/date"
import type { TaskWithAssignee } from "@/features/tasks/queries"

type TaskRowProps = {
  task: TaskWithAssignee
}

export function TaskRow({ task }: TaskRowProps) {
  const assigneeName = task.assignee_name ?? "Unassigned"
  const { bg, text } = getAvatarColor(assigneeName)
  const initials = getInitials(assigneeName)
  const isCompleted = task.status === "DONE"

  return (
    <div className="flex items-center justify-between py-4 px-4 hover:bg-accent/30 transition-colors">
      <div className="flex items-center gap-4">
        {isCompleted ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-muted-foreground/50" />
        ) : (
          <Circle className="h-5 w-5 shrink-0 text-muted-foreground/30" />
        )}
        <div>
          <h4 className="text-base font-semibold text-foreground line-clamp-1">
            {task.title}
          </h4>
          <div className="mt-1 flex items-center gap-1.5">
            <div
              className={cn(
                "flex shrink-0 items-center justify-center rounded-full font-semibold text-[8px] size-5 p-2",
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
            <span className="text-xs text-muted-foreground">{assigneeName}</span>
          </div>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
          Due Date
        </p>
        <p className="mt-0.5 text-sm font-medium text-foreground">
          {formatTaskDate(task.due_date)}
        </p>
      </div>
    </div>
  )
}