"use client"

import { useState } from "react"

import CompactPagination from "@/components/shared/pagination/compact-pagination"
import ListPaginationSummary from "@/components/shared/pagination/list-pagination-summary"
import MobilePaginationFeedback from "@/components/shared/pagination/mobile-pagination-feedback"
import ScrollSentinel from "@/components/shared/pagination/scroll-sentinel"
import { useIsMobile } from "@/hooks/use-mobile"
import { useMobilePaginationFetch } from "@/hooks/use-mobile-pagination-fetch"
import type { PaginationMeta } from "@/lib/pagination"
import type { TaskWithAssignee } from "@/features/tasks/queries"
import { TasksPageHeader } from "../shared/tasks-page-header"
import { TasksListTable } from "./tasks-list-table"
import TaskDetailsModal from "../details/task-details-popup"

type TasksListPageProps = {
  projectId: string
  projectName: string
  initialTasks: TaskWithAssignee[]
  initialError: string | null
  initialPagination: PaginationMeta
  view?: "board" | "list"
  onViewChange?: (view: "board" | "list") => void
}

export default function TasksListPage({
  projectId,
  projectName,
  initialTasks,
  initialError,
  initialPagination,
  view = "list",
  onViewChange,
}: TasksListPageProps) {
  const isMobile = useIsMobile()

  const {
    items: tasks,
    currentPage,
    totalCount,
    totalPages,
    hasMore,
    isLoadingMore,
    loadMoreError,
    fetchNextPageOnMobile,
  } = useMobilePaginationFetch<TaskWithAssignee>({
    initialItems: initialTasks,
    initialPagination,
    isMobile,
    buildRequestUrl: ({ limit, offset }) =>
      `/api/projects/${projectId}/tasks?limit=${limit}&offset=${offset}`,
    getItemId: (task) => task.id,
    loadMoreErrorMessage: "Failed to load more tasks.",
  })

  const [selectedTask, setSelectedTask] = useState<TaskWithAssignee | null>(null)

  if (initialError) {
    return (
      <section className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        <div className="mx-auto w-full max-w-[calc(94vw-var(--sidebar-width))] min-w-0 max-sm:max-w-full">
          <TasksPageHeader
            projectId={projectId}
            projectName={projectName}
            view={view}
            onViewChange={onViewChange ?? (() => {})}
          />

          <div className="mt-9 rounded-lg border border-error/20 bg-error/5 px-6 py-10 text-center">
            <p className="text-sm font-medium text-error">Failed to load tasks.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto w-full max-w-[calc(94vw-var(--sidebar-width))] min-w-0 max-sm:max-w-full">
        <TasksPageHeader
          projectId={projectId}
          projectName={projectName}
          view={view}
          onViewChange={onViewChange ?? (() => {})}
        />

        <div className="mt-9">
          <TasksListTable tasks={tasks} onTaskSelect={setSelectedTask} />
        </div>

        <div className="mt-8 flex min-h-7 items-center justify-between gap-4 pb-4">
          <ListPaginationSummary
            shownCount={tasks.length}
            totalCount={totalCount}
            itemLabel="tasks"
          />

          {isMobile === false && totalCount > 0 && (
            <CompactPagination
              currentPage={currentPage}
              totalPages={totalPages}
              fixedSearchParams={{ view: "list" }}
            />
          )}
        </div>

        <ScrollSentinel
          enabled={isMobile === true && hasMore}
          onIntersect={fetchNextPageOnMobile}
        />

        <MobilePaginationFeedback
          isLoadingMore={isLoadingMore}
          loadingText="Loading more tasks"
          errorMessage={loadMoreError}
          showError={tasks.length > 0}
          onRetry={() => {
            void fetchNextPageOnMobile()
          }}
        />

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