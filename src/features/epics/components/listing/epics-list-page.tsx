"use client"

import { useCallback } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { useMobilePaginationFetch } from "@/hooks/use-mobile-pagination-fetch"
import EpicsError from "@/features/epics/components/listing/epics-error"
import EpicsEmpty from "@/features/epics/components/listing/epics-empty"
import EpicCard from "@/features/epics/components/listing/epic-card"
import EpicsListHeader from "@/features/epics/components/listing/epics-list-header"
import type { EpicRow } from "@/features/epics/types"
import { type PaginationMeta } from "@/lib/pagination"
import CompactPagination from "@/components/shared/pagination/compact-pagination"
import ListPaginationSummary from "@/components/shared/pagination/list-pagination-summary"
import MobilePaginationFeedback from "@/components/shared/pagination/mobile-pagination-feedback"
import ScrollSentinel from "@/components/shared/pagination/scroll-sentinel"

type EpicsListPageProps = {
  projectId: string
  projectName: string
  initialSearchTerm: string
  initialEpics: EpicRow[]
  initialError: string | null
  initialPagination: PaginationMeta
  assigneeOptions: {
    userId: string
    name: string
    email: string
    avatarUrl: string | null
  }[]
}

export default function EpicsListPage({
  projectId,
  projectName,
  initialSearchTerm,
  initialEpics,
  initialError,
  initialPagination,
  assigneeOptions,
}: EpicsListPageProps) {
  const isMobile = useIsMobile()

  const buildRequestUrl = useCallback(
    ({ limit, offset }: { limit: number; offset: number }) =>
      `/api/projects/${projectId}/epics?limit=${limit}&offset=${offset}${
        initialSearchTerm ? `&q=${encodeURIComponent(initialSearchTerm)}` : ""
      }`,
    [projectId, initialSearchTerm]
  )

  const {
    items: epics,
    currentPage,
    totalCount,
    totalPages,
    hasMore,
    isLoadingMore,
    loadMoreError,
    fetchNextPageOnMobile,
  } = useMobilePaginationFetch<EpicRow>({
    initialItems: initialEpics,
    initialPagination,
    isMobile,
    buildRequestUrl,
    getItemId: (epic) => epic.id,
    loadMoreErrorMessage: "Failed to load more epics.",
  })

  const hasError = Boolean(initialError)
  const isEmpty = !hasError && epics.length === 0

  return (
    <section className="app-page-shell">
      <div className="app-page-frame">
        <EpicsListHeader
          projectId={projectId}
          projectName={projectName}
          initialSearchTerm={initialSearchTerm}
        />

        {hasError ? (
          <EpicsError
            message={initialSearchTerm ? "Failed to search epics" : undefined}
          />
        ) : isEmpty ? (
          <EpicsEmpty projectId={projectId} searchTerm={initialSearchTerm} />
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Epics list">
              {epics.map((epic) => (
                <EpicCard
                  key={epic.id}
                  epic={epic}
                  projectId={projectId}
                  assigneeOptions={assigneeOptions}
                />
              ))}
            </div>

            <div className="mt-6 flex min-h-7 items-center justify-between gap-4 pb-3">
              <ListPaginationSummary
                shownCount={epics.length}
                totalCount={totalCount}
                itemLabel="active epics"
              />

              {isMobile === false && totalCount > 0 && (
                <CompactPagination currentPage={currentPage} totalPages={totalPages} />
              )}
            </div>

            <ScrollSentinel
              enabled={isMobile === true && hasMore}
              onIntersect={fetchNextPageOnMobile}
            />

            <MobilePaginationFeedback
              isLoadingMore={isLoadingMore}
              loadingText="Loading more epics"
              errorMessage={loadMoreError}
              showError={epics.length > 0}
              onRetry={() => {
                void fetchNextPageOnMobile()
              }}
            />
          </>
        )}
      </div>

      <Button
        asChild
        size="icon-lg"
        className="app-floating-action p-4 shadow-[0_10px_20px_rgba(0,50,184,0.22)]"
      >
        <Link href={`/project/${projectId}/epics/add`} aria-label="New epic">
          <Plus className="size-5" aria-hidden="true" />
        </Link>
      </Button>
    </section>
  )
}