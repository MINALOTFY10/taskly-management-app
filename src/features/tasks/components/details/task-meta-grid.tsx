import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { TaskWithAssignee } from "@/features/tasks/queries"
import type { UpdateTaskFormValues } from "@/features/tasks/schemas/validations"
import { formatTaskDate } from "@/features/tasks/utils/date"
import { getTaskStatusLabel } from "@/features/tasks/utils/status"
import { TASK_STATUS_VALUES, type TaskStatus } from "@/features/tasks/types"
import { getInitials, getAvatarColor } from "@/features/epics/utils/avatar"
import { CalendarDays, Clock3 } from "lucide-react"
import { TaskStatusBadge } from "./task-status-badge"

interface TaskMetaGridProps {
  task: TaskWithAssignee
  mode?: "desktop" | "mobile"
  isBusy?: boolean
  onUpdate?: (
    payload: UpdateTaskFormValues,
    buildOptimisticTask: (current: TaskWithAssignee) => TaskWithAssignee
  ) => void
}

type PersonRowProps = {
  name: string
  avatar: string | null
  subtitle?: string | null
  compact?: boolean
}

function PersonRow({ name, avatar, subtitle, compact = false }: PersonRowProps) {
  const { bg, text } = getAvatarColor(name)
  const initials = getInitials(name)

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full font-semibold",
          compact ? "size-5 text-[9px]" : "size-7 text-[10px]",
          bg,
          text
        )}
        title={name}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="size-full rounded-[inherit] object-cover"
            loading="lazy"
          />
        ) : (
          initials
        )}
      </div>
      <div className="min-w-0">
        <p className={cn("truncate font-medium text-foreground", compact ? "text-[13px]" : "text-sm")}>
          {name}
        </p>
        {subtitle ? (
          <p className="truncate text-[11px] text-muted-foreground/80">{subtitle}</p>
        ) : null}
      </div>
    </div>
  )
}

function toDateTimeLocalValue(value: string | null) {
  if (!value) return ""

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return ""
  }

  const pad = (segment: number) => String(segment).padStart(2, "0")

  const year = parsed.getFullYear()
  const month = pad(parsed.getMonth() + 1)
  const day = pad(parsed.getDate())
  const hours = pad(parsed.getHours())
  const minutes = pad(parsed.getMinutes())

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function TaskMetaGrid({
  task,
  mode = "desktop",
  isBusy = false,
  onUpdate,
}: TaskMetaGridProps) {
  const assigneeName = task.assignee_name ?? "Unassigned"
  const reporterName = task.reporter_name ?? "Unknown"

  if (mode === "mobile") {
    return (
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <div className="rounded-xl border border-[#E7EBF6] bg-[#F4F6FB] p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/80">
            Assignee
          </p>
          <div className="mt-2.5">
            <PersonRow
              name={assigneeName}
              avatar={task.assignee_avatar}
              subtitle={task.assignee_email}
              compact
            />
          </div>
        </div>

        <div className="rounded-xl border border-[#E7EBF6] bg-[#F4F6FB] p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/80">
            Due Date
          </p>
          <div className="mt-2.5 flex items-center gap-2 text-[13px] font-medium text-foreground">
            <CalendarDays className="size-3.5 text-[#4D6285]" />
            <span>{formatTaskDate(task.due_date)}</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#E7EBF6] bg-[#F4F6FB] p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/80">
            Created By
          </p>
          <div className="mt-2.5">
            <PersonRow
              name={reporterName}
              avatar={task.reporter_avatar}
              subtitle={task.reporter_email}
              compact
            />
          </div>
        </div>

        <div className="rounded-xl border border-[#E7EBF6] bg-[#F4F6FB] p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/80">
            Created At
          </p>
          <div className="mt-2.5 flex items-center gap-2 text-[13px] font-medium text-foreground">
            <Clock3 className="size-3.5 text-[#4D6285]" />
            <span>{formatTaskDate(task.created_at)}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-7">
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/80">
          Status
        </p>
        {onUpdate ? (
          <div className="mt-2.5">
            <Select
              value={task.status}
              onValueChange={(nextStatus) => {
                if (!onUpdate || nextStatus === task.status) return
                onUpdate(
                  { status: nextStatus as TaskStatus },
                  (current) => ({ ...current, status: nextStatus as TaskStatus })
                )
              }}
              disabled={isBusy}
            >
              <SelectTrigger className="h-10 w-full rounded-lg border-[#CFD7EA] bg-white px-3 text-left text-sm font-medium text-[#243B63]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUS_VALUES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {getTaskStatusLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="mt-2.5">
            <TaskStatusBadge
              status={task.status}
              className="w-full justify-start rounded-lg px-4 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.08em]"
            />
          </div>
        )}
      </section>

      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/80">
          Assignee
        </p>
        <div className="mt-2.5 rounded-lg border border-white/70 bg-white/85 p-3 shadow-sm shadow-[#DCE2F4]/70">
          <PersonRow
            name={assigneeName}
            avatar={task.assignee_avatar}
            subtitle={task.assignee_email}
          />
        </div>
      </section>

      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/80">
          Reporter
        </p>
        <div className="mt-2.5">
          <PersonRow
            name={reporterName}
            avatar={task.reporter_avatar}
            subtitle={task.reporter_email}
          />
        </div>
      </section>

      <section className="space-y-3.5 border-t border-[#D9DFED] pt-6">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">Due Date</span>
          {onUpdate ? (
            <Input
              key={task.due_date ?? "no-due-date"}
              type="datetime-local"
              defaultValue={toDateTimeLocalValue(task.due_date)}
              onBlur={(event) => {
                if (!onUpdate) return

                const nextValue = event.target.value
                const currentValue = toDateTimeLocalValue(task.due_date)

                if (nextValue === currentValue) {
                  return
                }

                onUpdate(
                  { dueDate: nextValue || null },
                  (current) => ({
                    ...current,
                    due_date: nextValue ? new Date(nextValue).toISOString() : null,
                  })
                )
              }}
              disabled={isBusy}
              className="h-8 w-44 border-[#CFD7EA] bg-white px-2 text-xs"
            />
          ) : (
            <span className="font-medium text-foreground">{formatTaskDate(task.due_date)}</span>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">Created At</span>
          <span className="font-medium text-foreground">{formatTaskDate(task.created_at)}</span>
        </div>
      </section>

    </div>
  )
}
