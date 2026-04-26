"use client"

import { getTaskStatusLabel } from "@/features/tasks/utils/status"
import { TaskStatus } from "../../types"
import { TaskWithAssignee } from "../../queries"
import { TASK_STATUS_VISUALS } from "../../utils/task-status-visuals"
import { Button } from "@/components/ui/button"
import { Plus, PlusCircle } from "lucide-react"
import Link from "next/link"
import { useDroppable } from "@dnd-kit/core"

import { cn } from "@/lib/utils"
import DraggableTaskCard from "./draggable-task-card"

export default function TaskColumn({
  projectId,
  status,
  tasks,
  onTaskSelect,
}: {
  projectId: string
  status: TaskStatus
  tasks: TaskWithAssignee[]
  onTaskSelect?: (task: TaskWithAssignee) => void
}) {
  const { setNodeRef } = useDroppable({
    id: status,
    data: {
      status,
    },
  })

  const theme = TASK_STATUS_VISUALS[status]
  const statusLabel = getTaskStatusLabel(status).toUpperCase()
  const addTaskHref = `/project/${projectId}/tasks/new?status=${status}`

  return (
    <section className="flex min-h-120 flex-col gap-3">
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2.5">
          <span
            className={cn("size-2 rounded-full", theme.dot)}
            aria-hidden="true"
          />
          <h2 className="text-[0.72rem] font-bold tracking-[0.24em] text-slate-500 uppercase">
            {statusLabel}
          </h2>
          <span
            className={cn(
              "inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[0.68rem] font-semibold",
              theme.count
            )}
          >
            {tasks.length}
          </span>
        </div>

        <Button
          asChild
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:text-foreground"
        >
          <Link href={addTaskHref} aria-label={`Add task to ${statusLabel}`}>
            <Plus className="size-4" />
          </Link>
        </Button>
      </div>

      <Button
        asChild
        variant="outline"
        className="h-12 w-full border-dashed border-border/60 bg-transparent px-3 text-[0.75rem] font-semibold tracking-[0.18em] text-slate-500 uppercase shadow-none hover:bg-muted/40"
      >
        <Link
          href={addTaskHref}
          className="flex items-center justify-center gap-2"
        >
          <PlusCircle className="size-4" />
          Add New Task
        </Link>
      </Button>

      <div ref={setNodeRef} className="flex flex-1 flex-col gap-3 pt-0.5">
        {tasks.map((task) => (
          <DraggableTaskCard
            key={task.id}
            task={task}
            status={status}
            onSelect={onTaskSelect}
          />
        ))}
      </div>
    </section>
  )
}
