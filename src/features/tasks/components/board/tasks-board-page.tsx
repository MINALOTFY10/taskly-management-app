"use client"

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { useEffect, useState, useTransition } from "react"

import { useAppToast } from "@/components/providers/toast-provider"
import { updateTaskStatusAction } from "@/features/tasks/actions"
import type { TaskWithAssignee } from "@/features/tasks/queries"
import { TASK_STATUS_VALUES, type TaskStatus } from "@/features/tasks/types"
import { TasksPageHeader } from "../shared/tasks-page-header"
import TaskColumn from "./task-column"
import TaskDetailsModal from "../details/task-details-popup"

type TasksBoardPageProps = {
  projectId: string
  projectName: string
  tasks: TaskWithAssignee[]
  view?: "board" | "list"
  onViewChange?: (view: "board" | "list") => void
}

function sortTasksByNearestDueDate(tasks: TaskWithAssignee[]) {
  return [...tasks].sort((firstTask, secondTask) => {
    const firstDueDate = firstTask.due_date ? new Date(firstTask.due_date) : null
    const secondDueDate = secondTask.due_date
      ? new Date(secondTask.due_date)
      : null

    if (!firstDueDate && !secondDueDate) {
      return 0
    }

    if (!firstDueDate) {
      return 1
    }

    if (!secondDueDate) {
      return -1
    }

    return firstDueDate.getTime() - secondDueDate.getTime()
  })
}

export default function TasksBoardPage({
  projectId,
  projectName,
  tasks,
  view = "board",
  onViewChange,
}: TasksBoardPageProps) {
  const { showToast } = useAppToast()
  const [, startTransition] = useTransition()
  const [selectedTask, setSelectedTask] = useState<TaskWithAssignee | null>(null)
  const [boardTasks, setBoardTasks] = useState<TaskWithAssignee[]>(tasks)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor)
  )

  useEffect(() => {
    setBoardTasks(tasks)
  }, [tasks])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      return
    }

    const taskId = String(active.id)
    const nextStatus = String(over.id)

    if (!TASK_STATUS_VALUES.includes(nextStatus as TaskStatus)) {
      return
    }

    const previousTasks = boardTasks
    const sourceTask = previousTasks.find((task) => task.id === taskId)

    if (!sourceTask || sourceTask.status === nextStatus) {
      return
    }

    const optimisticTasks = previousTasks.map((task) =>
      task.id === taskId ? { ...task, status: nextStatus as TaskStatus } : task
    )

    setBoardTasks(optimisticTasks)
    setSelectedTask((previousSelectedTask) =>
      previousSelectedTask && previousSelectedTask.id === taskId
        ? { ...previousSelectedTask, status: nextStatus as TaskStatus }
        : previousSelectedTask
    )

    startTransition(async () => {
      const { error } = await updateTaskStatusAction(projectId, taskId, nextStatus)

      if (!error) {
        return
      }

      setBoardTasks(previousTasks)
      setSelectedTask((previousSelectedTask) =>
        previousSelectedTask && previousSelectedTask.id === sourceTask.id
          ? { ...previousSelectedTask, status: sourceTask.status }
          : previousSelectedTask
      )
      showToast({ variant: "error", message: error })
    })
  }

  const groupedTasks = TASK_STATUS_VALUES.map((status) => ({
    status,
    tasks: sortTasksByNearestDueDate(
      boardTasks.filter((task) => task.status === status)
    ),
  }))

  return (
    <section className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto w-full max-w-[calc(94vw-var(--sidebar-width))] min-w-0 max-sm:max-w-full">
        <TasksPageHeader
          projectId={projectId}
          projectName={projectName}
          view={view}
          onViewChange={onViewChange ?? (() => {})}
        />

        <div className="mt-10 max-w-full overflow-x-auto pb-3">
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="grid min-w-max auto-cols-[17.8rem] grid-flow-col gap-4">
              {groupedTasks.map(({ status, tasks: columnTasks }) => (
                <TaskColumn
                  key={status}
                  projectId={projectId}
                  status={status}
                  tasks={columnTasks}
                  onTaskSelect={setSelectedTask}
                />
              ))}
            </div>
          </DndContext>
        </div>

        <TaskDetailsModal
          open={selectedTask !== null}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          projectId={projectId}
        />
      </div>
    </section>
  )
}