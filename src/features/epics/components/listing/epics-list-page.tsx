"use client"

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
  initialEpics,
  initialError,
  initialPagination,
  assigneeOptions,
}: EpicsListPageProps) {
  const isMobile = useIsMobile()

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
    buildRequestUrl: ({ limit, offset }) =>
      `/api/projects/${projectId}/epics?limit=${limit}&offset=${offset}`,
    getItemId: (epic) => epic.id,
    loadMoreErrorMessage: "Failed to load more epics.",
  })

  if (initialError) return <EpicsError />
  if (epics.length === 0) return <EpicsEmpty projectId={projectId} />

  return (
    <section className="relative px-5 py-5 sm:px-6 sm:py-7 lg:px-8">
      <EpicsListHeader projectId={projectId} projectName={projectName} />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="Epics list">
        {epics.map((epic) => (
          <EpicCard
            key={epic.id}
            epic={epic}
            projectId={projectId}
            assigneeOptions={assigneeOptions}
          />
        ))}
      </div>

      <div className="mt-8 flex min-h-7 items-center justify-between gap-4 pb-4">
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

      <Button
        asChild
        size="icon"
        className="fixed right-6 bottom-6 size-14 rounded-full shadow-[0_8px_24px_rgba(0,50,184,0.25)] sm:hidden"
      >
        <Link href={`/project/${projectId}/epics/add`} aria-label="New epic">
          <Plus className="size-6" aria-hidden="true" />
        </Link>
      </Button>
    </section>
  )
}