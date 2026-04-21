"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { type PaginationMeta } from "@/lib/pagination"
import type { ProjectRow } from "@/features/projects/types"
import {
  getOffsetFromPage,
  getPageFromOffset,
  getTotalPages,
} from "@/lib/pagination"
import EmptyState from "./project-list-empty"
import ErrorState from "./project-list-error"
import ProjectListItem from "./project-list-item"
import CompactPagination from "@/components/shared/compact-pagination"
import MobilePaginationFeedback from "@/components/shared/mobile-pagination-feedback"
import ScrollSentinel from "../scroll-sentinel"

type ProjectListPageProps = {
  initialProjects: ProjectRow[]
  initialError: string | null
  initialPagination: PaginationMeta
}

export default function ProjectListPage({
  initialProjects,
  initialError,
  initialPagination,
}: ProjectListPageProps) {
  const isMobile = useIsMobile()
  const limit = initialPagination.limit

  const [projects, setProjects] = useState<ProjectRow[]>(initialProjects)
  const [currentPage, setCurrentPage] = useState(
    getPageFromOffset(initialPagination.offset, limit)
  )
  const [totalCount, setTotalCount] = useState(initialPagination.totalCount)
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const totalPages = getTotalPages(totalCount, limit)
  const hasMore = projects.length < totalCount

  const fetchProjectsOnMobileMode = useCallback(async () => {
    if (!isMobile || isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    setLoadMoreError(null)

    const nextPage = currentPage + 1

    try {
      const res = await fetch(
        `/api/projects?limit=${limit}&offset=${getOffsetFromPage(nextPage, limit)}`
      )

      if (!res.ok) {
        setLoadMoreError("Failed to load more projects.")
        return
      }

      const { data, error, pagination } = await res.json()

      if (error) {
        setLoadMoreError(error)
        return
      }

      setCurrentPage(nextPage)
      setTotalCount(pagination.totalCount)

      setProjects((prev) => {
        const existingIds = new Set(prev.map((p) => p.id))
        const newRows = data.filter((row: ProjectRow) => !existingIds.has(row.id))
        return newRows.length ? [...prev, ...newRows] : prev
      })
    } finally {
      setIsLoadingMore(false)
    }
  }, [currentPage, hasMore, isMobile, isLoadingMore, limit])

  if (initialError) return <ErrorState message="Failed to load projects" />
  if (projects.length === 0) return <EmptyState />

  return (
    <section className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-350">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[2.2rem] leading-none font-semibold tracking-tight text-foreground">
              Projects
            </h1>
            <p className="mt-2 text-[0.9rem] text-muted-foreground">
              Manage and curate your projects
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="mt-auto hidden h-12 gap-2 rounded-md px-4 text-[14px] font-semibold shadow-[0_10px_18px_rgba(0,50,184,0.15)] sm:inline-flex"
          >
            <Link href="/project/add">
              <Plus className="size-4" /> Create New Project
            </Link>
          </Button>
        </div>

        <div
          role="list"
          className="mt-7 grid grid-cols-1 gap-4 sm:mt-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-5"
        >
          {projects.map((project) => (
            <div key={project.id} role="listitem">
              <ProjectListItem project={project} />
            </div>
          ))}
        </div>

        <div className="mt-8 flex min-h-7 items-center justify-between gap-4 pb-4">
          <p className="text-[0.82rem] text-muted-foreground">
            Showing {projects.length} of {totalCount} active projects
          </p>

          {isMobile === false && totalCount > 0 && (
            <CompactPagination
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </div>

        <ScrollSentinel
          enabled={isMobile === true && hasMore}
          onIntersect={fetchProjectsOnMobileMode}
        />

        <MobilePaginationFeedback
          isLoadingMore={isLoadingMore}
          loadingText="Loading more projects"
          errorMessage={loadMoreError}
          showError={projects.length > 0}
          onRetry={() => {
            void fetchProjectsOnMobileMode()
          }}
        />
      </div>

      {/* ── Mobile FAB ── */}
      <Button
        asChild
        size="icon-lg"
        className="fixed right-4 bottom-4 z-20 rounded-xl p-6 shadow-[0_10px_20px_rgba(0,50,184,0.22)] sm:hidden"
      >
        <Link href="/project/add" aria-label="Create new project">
          <Plus className="size-6" />
        </Link>
      </Button>
    </section>
  )
}