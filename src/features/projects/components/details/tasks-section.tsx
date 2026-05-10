import Link from "next/link"
import { ArrowRight, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TASK_STATUS_CONFIG } from "@/features/projects/utils/status"
import { formatProjectDate } from "@/features/projects/utils/date"
import type { TaskRow } from "@/features/projects/types"
import { cn } from "@/lib/utils"

// ─── Single row ───────────────────────────────────────────────────────────────

function TaskItem({ task, projectId }: { task: TaskRow; projectId: string }) {
  const statusConfig =
    TASK_STATUS_CONFIG[task.status] ?? TASK_STATUS_CONFIG.TO_DO

  return (
    <li>
      <Link
        href={`/project/${projectId}/tasks/${task.id}`}
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
            {task.title}
          </p>
          {task.task_id && (
            <p className="mt-0.5 text-[0.6rem] font-mono text-muted-foreground/70">
              {task.task_id}
            </p>
          )}
        </div>

        {/* Due date */}
        {task.due_date && (
          <span className="shrink-0 text-[0.65rem] text-muted-foreground">
            {formatProjectDate(task.due_date)}
          </span>
        )}
      </Link>
    </li>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

type TasksSectionProps = {
  tasks: TaskRow[]
  projectId: string
  error: string | null
}

export default function TasksSection({
  tasks,
  projectId,
  error,
}: TasksSectionProps) {
  return (
    <div className="app-surface-card">
      <div className="app-surface-header">
        <div className="flex items-center gap-2.5">
          <div className="app-surface-icon">
            <CheckSquare className="size-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Tasks</h2>
            <p className="text-[0.72rem] text-muted-foreground">Recent tasks</p>
          </div>
        </div>

        <Button
          asChild
          size="sm"
          variant="ghost"
          className="h-8 gap-1 px-3 text-[0.75rem] font-semibold text-primary hover:text-primary/85"
        >
          <Link href={`/project/${projectId}/tasks`}>
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
        ) : tasks.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No tasks yet.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} projectId={projectId} />
            ))}
          </ul>
        )}
      </div>

      {/* Footer link on mobile */}
      {tasks.length > 0 && (
        <div className="border-t border-border/60 px-5 py-3 sm:hidden">
          <Link
            href={`/project/${projectId}/tasks`}
            className="flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            View all tasks
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}
    </div>
  )
}