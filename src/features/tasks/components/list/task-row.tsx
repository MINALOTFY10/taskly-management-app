import Link from "next/link"
import { MoreVertical } from "lucide-react"
import { getTaskStatusLabel } from "../../utils/status"
import { TASK_STATUS_VISUALS } from "../../utils/task-status-visuals"
import { formatTaskDate } from "../../utils/date"
import { cn } from "@/lib/utils"
import { TaskWithAssignee } from "../../queries"
import { getAvatarColor, getInitials } from "@/features/projects/utils/avatar"

export default function TaskRow({
  task,
  projectId,
}: {
  task: TaskWithAssignee
  projectId: string
}) {
  const assigneeName = task.assignee_name ?? "Unassigned"
  const { bg, text } = getAvatarColor(assigneeName)
  const initials = getInitials(assigneeName)
  const statusLabel = getTaskStatusLabel(task.status)
  const statusVisuals = TASK_STATUS_VISUALS[task.status]

  // Short human-readable task ID: #AB12CD34
  const shortId = `Task-${task.id.slice(0, 3).toUpperCase()}`

  return (
    <tr className="border-b border-border/20 transition-colors hover:bg-accent/20">
      <td className="px-6 py-4 text-sm font-semibold whitespace-nowrap text-blue-600">
        {shortId}
      </td>

      {/* Title doubles as the navigation entry-point into the task detail page */}
      <td className="max-w-xs px-6 py-4 text-sm font-medium text-foreground">
        <Link
          href={`/project/${projectId}/tasks/${task.id}`}
          className="block truncate underline-offset-2 transition-colors hover:text-blue-600 hover:underline"
        >
          {task.title}
        </Link>
      </td>

      <td className="px-6 py-4 text-sm whitespace-nowrap">
        <span
          className={cn(
            "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold",
            statusVisuals.count
          )}
        >
          {statusLabel}
        </span>
      </td>

      <td className="px-6 py-4 text-sm whitespace-nowrap text-muted-foreground">
        {formatTaskDate(task.due_date)}
      </td>

      <td className="px-6 py-4 text-sm whitespace-nowrap">
        <AssigneeCell
          name={assigneeName}
          avatar={task.assignee_avatar}
          bg={bg}
          text={text}
          initials={initials}
        />
      </td>

      <td className="px-6 py-4 text-center">
        <button
          type="button"
          aria-label="Task options"
          className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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
          "flex size-6 shrink-0 items-center justify-center rounded-full font-semibold overflow-hidden",
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
