"use client"

import { useState } from "react"

import type { TaskWithAssignee } from "@/features/tasks/queries"
import { TasksPageHeader } from "../shared/tasks-page-header"
import { TasksListTable } from "./tasks-list-table"
import TaskDetailsModal from "../details/task-details-popup"

type TasksListPageProps = {
  projectId: string
  projectName: string
  tasks: TaskWithAssignee[]
  view?: "board" | "list"
  onViewChange?: (view: "board" | "list") => void
}

export default function TasksListPage({
  projectId,
  projectName,
  tasks,
  view = "list",
  onViewChange,
}: TasksListPageProps) {
  const [selectedTask, setSelectedTask] = useState<TaskWithAssignee | null>(null)

  return (
    <section className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto w-full max-w-[calc(94vw-var(--sidebar-width))] min-w-0 max-sm:max-w-full">
        <TasksPageHeader
          projectId={projectId}
          projectName={projectName}
          view={view}
          onViewChange={onViewChange ?? (() => {})}
        />

        <div className="mt-7">
          <TasksListTable tasks={tasks} onTaskSelect={setSelectedTask} />
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