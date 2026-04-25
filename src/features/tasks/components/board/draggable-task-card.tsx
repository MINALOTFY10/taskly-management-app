"use client"

import { CSS } from "@dnd-kit/utilities"
import { useDraggable } from "@dnd-kit/core"

import type { TaskWithAssignee } from "@/features/tasks/queries"
import type { TaskStatus } from "@/features/tasks/types"
import TaskCard from "./task-card"

type DraggableTaskCardProps = {
  task: TaskWithAssignee
  status: TaskStatus
  onSelect?: (task: TaskWithAssignee) => void
}

export default function DraggableTaskCard({
  task,
  status,
  onSelect,
}: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: {
        taskId: task.id,
        status,
      },
    })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TaskCard task={task} status={status} onSelect={onSelect} />
    </div>
  )
}
