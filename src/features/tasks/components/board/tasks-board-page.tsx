"use client"

import { useState } from "react"

import type { TaskWithAssignee } from "@/features/tasks/queries"
import { TASK_STATUS_VALUES } from "@/features/tasks/types"
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

export default function TasksBoardPage({
  projectId,
  projectName,
  tasks,
  view = "board",
  onViewChange,
}: TasksBoardPageProps) {
  const [selectedTask, setSelectedTask] = useState<TaskWithAssignee | null>(null)

  const groupedTasks = TASK_STATUS_VALUES.map((status) => ({
    status,
    tasks: tasks.filter((task) => task.status === status),
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

        <div className="mt-7 max-w-full overflow-x-auto pb-3">
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