"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { type PaginationMeta } from "@/lib/pagination"
import type { ProjectRow } from "@/features/projects/types"
import EmptyState from "./project-list-empty"
import ErrorState from "./project-list-error"
import ProjectListItem from "./project-list-item"
import CompactPagination from "@/components/shared/pagination/compact-pagination"
import MobilePaginationFeedback from "@/components/shared/pagination/mobile-pagination-feedback"
import ScrollSentinel from "@/components/shared/pagination/scroll-sentinel"
import ListPaginationSummary from "@/components/shared/pagination/list-pagination-summary"
import { useMobilePaginationFetch } from "@/hooks/use-mobile-pagination-fetch"

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

  const {
    items: projects,
    currentPage,
    totalCount,
    totalPages,
    hasMore,
    isLoadingMore,
    loadMoreError,
    fetchNextPageOnMobile,
  } = useMobilePaginationFetch<ProjectRow>({
    initialItems: initialProjects,
    initialPagination,
    isMobile,
    buildRequestUrl: ({ limit, offset }) =>
      `/api/projects?limit=${limit}&offset=${offset}`,
    getItemId: (project) => project.id,
    loadMoreErrorMessage: "Failed to load more projects.",
  })

  if (initialError) return <ErrorState message="Failed to load projects" />
  if (projects.length === 0) return <EmptyState />

  return (
    <section className="app-page-shell">
      <div className="app-page-frame">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[2rem] leading-none font-semibold tracking-tight text-foreground">
              Projects
            </h1>
            <p className="mt-1.5 text-[0.82rem] text-muted-foreground">
              Manage and curate your projects
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="mt-auto hidden h-10 gap-1.5 rounded-md px-3.5 text-[13px] font-semibold shadow-[0_10px_18px_rgba(0,50,184,0.15)] sm:inline-flex"
          >
            <Link href="/project/add">
              <Plus className="size-4" /> Create New Project
            </Link>
          </Button>
        </div>

        <div
          role="list"
          className="mt-6 grid grid-cols-1 gap-3 sm:mt-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-3"
        >
          {projects.map((project) => (
            <div key={project.id} role="listitem">
              <ProjectListItem project={project} />
            </div>
          ))}
        </div>

        <div className="mt-6 flex min-h-7 items-center justify-between gap-4 pb-3">
          <ListPaginationSummary
            shownCount={projects.length}
            totalCount={totalCount}
            itemLabel="active projects"
          />

          {isMobile === false && totalCount > 0 && (
            <CompactPagination
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </div>

        <ScrollSentinel
          enabled={isMobile === true && hasMore}
          onIntersect={fetchNextPageOnMobile}
        />

        <MobilePaginationFeedback
          isLoadingMore={isLoadingMore}
          loadingText="Loading more projects"
          errorMessage={loadMoreError}
          showError={projects.length > 0}
          onRetry={() => {
            void fetchNextPageOnMobile()
          }}
        />
      </div>

      {/* ── Mobile FAB ── */}
      <Button
        asChild
        size="icon-lg"
        className="app-floating-action p-4 shadow-[0_10px_20px_rgba(0,50,184,0.22)]"
      >
        <Link href="/project/add" aria-label="Create new project">
          <Plus className="size-5" />
        </Link>
      </Button>
    </section>
  )
}