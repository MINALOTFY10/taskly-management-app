"use client"
import type { TaskWithAssignee } from "@/features/tasks/queries"
import TaskRow from "./task-row"

type TasksListTableProps = {
  tasks: TaskWithAssignee[]
  onTaskSelect?: (task: TaskWithAssignee) => void
}

export function TasksListTable({
  tasks,
  onTaskSelect,
}: TasksListTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-border/60 bg-card px-4 py-9 text-center shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">
          No tasks found. Create a new task to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/20">
              <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Task ID
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Title
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Status
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Due Date
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Assignee
              </th>
              <th className="px-5 py-3 text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onTaskSelect={onTaskSelect}
              />
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
