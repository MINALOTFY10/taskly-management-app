import { MoreVertical } from "lucide-react"
import { getTaskStatusLabel } from "../../utils/status"
import { TASK_STATUS_VISUALS } from "../../utils/task-status-visuals"
import { formatTaskDate } from "../../utils/date"
import { cn } from "@/lib/utils"
import type { TaskWithAssignee } from "../../queries"

// Bug fix: was incorrectly importing from @/features/projects/utils/avatar.
// All other task/epic components use @/features/epics/utils/avatar — use that.
// Long-term: move these utilities to @/lib/utils/avatar so they have one home.
import { getAvatarColor, getInitials } from "@/features/epics/utils/avatar"

export default function TaskRow({
  task,
  onTaskSelect,
}: {
  task: TaskWithAssignee
  onTaskSelect?: (task: TaskWithAssignee) => void
}) {
  const assigneeName = task.assignee_name ?? "Unassigned"
  const { bg, text } = getAvatarColor(assigneeName)
  const initials = getInitials(assigneeName)
  const statusLabel = getTaskStatusLabel(task.status)
  const statusVisuals = TASK_STATUS_VISUALS[task.status]
  const shortId = `Task-${task.id.slice(0, 3).toUpperCase()}`

  const handleSelect = () => onTaskSelect?.(task)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onTaskSelect?.(task)
    }
  }

  return (
    <tr
      role="button"
      tabIndex={0}
      aria-label={`Open task: ${task.title}`}
      className="cursor-pointer border-b border-border/30 transition-colors hover:bg-accent/20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
    >
      <td className="px-5 py-3 text-sm font-semibold whitespace-nowrap text-blue-600">
        {shortId}
      </td>

      <td className="max-w-xs px-5 py-3 text-sm font-medium text-foreground">
        <span className="block truncate">{task.title}</span>
      </td>

      <td className="px-5 py-3 text-sm whitespace-nowrap">
        <span
          className={cn(
            "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold",
            statusVisuals.count
          )}
        >
          {statusLabel}
        </span>
      </td>

      <td className="px-5 py-3 text-sm whitespace-nowrap text-muted-foreground">
        {formatTaskDate(task.due_date)}
      </td>

      <td className="px-5 py-3 text-sm whitespace-nowrap">
        <AssigneeCell
          name={assigneeName}
          avatar={task.assignee_avatar}
          bg={bg}
          text={text}
          initials={initials}
        />
      </td>

      <td className="px-5 py-3 text-center">
        <button
          type="button"
          aria-label="Task options"
          className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="size-4" />
        </button>
      </td>
    </tr>
  )
}

type AssigneeCellProps = {
  name: string
  avatar: string | null
  bg: string
  text: string
  initials: string
}

function AssigneeCell({ name, avatar, bg, text, initials }: AssigneeCellProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold",
          !avatar && ["p-2 text-[8px]", bg, text]
        )}
        title={name}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="size-full object-cover"
            loading="lazy"
          />
        ) : (
          initials
        )}
      </div>
      <span className="text-xs text-muted-foreground">{name}</span>
    </div>
  )
}
