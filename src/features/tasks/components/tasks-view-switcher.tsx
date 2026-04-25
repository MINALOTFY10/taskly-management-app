"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

import TasksBoardPage from "@/features/tasks/components/board/tasks-board-page"
import TasksListPage from "@/features/tasks/components/list/tasks-list-page"
import type { TaskWithAssignee } from "@/features/tasks/queries"
import type { PaginationMeta } from "@/lib/pagination"

type TasksView = "board" | "list"

type TasksViewSwitcherProps = {
  projectId: string
  projectName: string
  boardTasks: TaskWithAssignee[]
  hasBoardTasksLoaded: boolean
  listTasks: TaskWithAssignee[]
  listError: string | null
  listPagination: PaginationMeta
  initialSearchTerm: string
  initialView: TasksView
}

export default function TasksViewSwitcher({
  projectId,
  projectName,
  boardTasks,
  hasBoardTasksLoaded,
  listTasks,
  listError,
  listPagination,
  initialSearchTerm,
  initialView,
}: TasksViewSwitcherProps) {
  const pathname = usePathname()
  const router = useRouter()

  const [activeView, setActiveView] = useState<TasksView>(initialView)
  const [mountedViews, setMountedViews] = useState<Record<TasksView, boolean>>({
    board: initialView === "board",
    list: initialView === "list",
  })

  const syncUrl = (nextView: TasksView) => {
    const params = new URLSearchParams(window.location.search)
    params.delete("page")

    if (nextView === "list") {
      params.set("view", "list")
    } else {
      params.delete("view")
    }

    const query = params.toString()
    const nextUrl = query ? `${pathname}?${query}` : pathname
    window.history.replaceState(window.history.state, "", nextUrl)
  }

  const handleViewChange = (nextView: TasksView) => {
    if (nextView === activeView) return

    if (nextView === "board" && !hasBoardTasksLoaded) {
      const params = new URLSearchParams(window.location.search)
      params.delete("view")
      params.delete("page")

      const query = params.toString()
      router.push(query ? `${pathname}?${query}` : pathname)
      return
    }

    setActiveView(nextView)
    setMountedViews((previous) => ({ ...previous, [nextView]: true }))
    syncUrl(nextView)
  }

  return (
    <>
      {mountedViews.board && (
        <div className={activeView === "board" ? "block" : "hidden"}>
          <TasksBoardPage
            projectId={projectId}
            projectName={projectName}
            tasks={boardTasks}
            initialSearchTerm={initialSearchTerm}
            view={activeView}
            onViewChange={handleViewChange}
          />
        </div>
      )}

      {mountedViews.list && (
        <div className={activeView === "list" ? "block" : "hidden"}>
          <TasksListPage
            projectId={projectId}
            projectName={projectName}
            initialSearchTerm={initialSearchTerm}
            initialTasks={listTasks}
            initialError={listError}
            initialPagination={listPagination}
            view={activeView}
            onViewChange={handleViewChange}
          />
        </div>
      )}
    </>
  )
}