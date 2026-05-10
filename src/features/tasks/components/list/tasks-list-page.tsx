"use client"

import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { EyeOff, Search } from "lucide-react"

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
  initialSearchTerm: string
  initialTasks: TaskWithAssignee[]
  initialError: string | null
  initialPagination: PaginationMeta
  view?: "board" | "list"
  onViewChange?: (view: "board" | "list") => void
}

export default function TasksListPage({
  projectId,
  projectName,
  initialSearchTerm,
  initialTasks,
  initialError,
  initialPagination,
  view = "list",
  onViewChange,
}: TasksListPageProps) {
  const isMobile = useIsMobile()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [isSearching, startSearchTransition] = useTransition()
  const normalizedInitialSearchTerm = useMemo(
    () => initialSearchTerm.trim(),
    [initialSearchTerm]
  )

  useEffect(() => {
    setSearchTerm(initialSearchTerm)
  }, [initialSearchTerm])

  useEffect(() => {
    const normalizedSearchTerm = searchTerm.trim()

    if (normalizedSearchTerm === normalizedInitialSearchTerm) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      startSearchTransition(() => {
        const params = new URLSearchParams(searchParams.toString())

        if (normalizedSearchTerm) {
          params.set("q", normalizedSearchTerm)
        } else {
          params.delete("q")
        }

        params.set("view", "list")
        params.delete("page")

        const query = params.toString()
        const nextUrl = query ? `${pathname}?${query}` : pathname
        router.replace(nextUrl)
      })
    }, 400)

    return () => window.clearTimeout(timeoutId)
  }, [
    normalizedInitialSearchTerm,
    pathname,
    router,
    searchParams,
    searchTerm,
  ])

  const buildRequestUrl = useCallback(
    ({ limit, offset }: { limit: number; offset: number }) =>
      `/api/projects/${projectId}/tasks?limit=${limit}&offset=${offset}${
        normalizedInitialSearchTerm
          ? `&q=${encodeURIComponent(normalizedInitialSearchTerm)}`
          : ""
      }`,
    [projectId, normalizedInitialSearchTerm]
  )

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
    buildRequestUrl,
    getItemId: (task) => task.id,
    loadMoreErrorMessage: "Failed to load more tasks.",
  })

  const [selectedTask, setSelectedTask] = useState<TaskWithAssignee | null>(null)
  const hasError = Boolean(initialError)
  const isEmpty = !hasError && tasks.length === 0
  const hasSearchTerm = Boolean(normalizedInitialSearchTerm)

  return (
    <section className="app-page-shell">
      <div className="app-page-frame min-w-0">
        <TasksPageHeader
          projectId={projectId}
          projectName={projectName}
          view={view}
          onViewChange={onViewChange ?? (() => {})}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          isSearching={isSearching}
        />

        {hasError ? (
          hasSearchTerm ? (
            <section className="mt-7 flex flex-col items-center justify-center px-5 py-18 text-center">
              <div className="mb-6 flex size-16 items-center justify-center rounded-lg bg-error/15">
                <EyeOff className="size-8 text-error" aria-hidden="true" />
              </div>

              <h2 className="text-xl font-bold text-foreground">
                Failed to search tasks
              </h2>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Please try again in a moment.
              </p>
            </section>
          ) : (
            <div className="mt-7 rounded-lg border border-error/20 bg-error/5 px-5 py-8 text-center">
              <p className="text-sm font-medium text-error">Failed to load tasks.</p>
            </div>
          )
        ) : isEmpty ? (
          hasSearchTerm ? (
            <section className="mt-7 flex flex-col items-center justify-center px-5 py-18 text-center">
              <div className="mb-6 flex size-16 items-center justify-center rounded-lg bg-[#f4d8d8]">
                <Search
                  className="size-7 text-[#c62828]"
                  strokeWidth={2.6}
                  aria-hidden="true"
                />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                No tasks found matching your search
              </h2>
              <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
                Try a different title keyword.
              </p>
            </section>
          ) : (
            <div className="mt-7 rounded-lg border border-border/60 bg-card px-5 py-9 text-center shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">
                No tasks found for this project
              </p>
            </div>
          )
        ) : (
          <>
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
                  fixedSearchParams={{
                    view: "list",
                    q: normalizedInitialSearchTerm,
                  }}
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
          </>
        )}

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