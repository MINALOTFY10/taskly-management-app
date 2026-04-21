"use client"

import { useState, useTransition } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getEpicsAction } from "@/features/epics/actions"
import EpicsError from "@/features/epics/components/listing/epics-error"
import EpicsEmpty from "@/features/epics/components/listing/epics-empty"
import EpicCard from "@/features/epics/components/listing/epic-card"
import EpicsListHeader from "@/features/epics/components/listing/epics-list-header"
import EpicsSkeleton from "@/features/epics/components/listing/epics-skeleton"
import type { EpicRow } from "@/features/epics/types"
import type { PaginationMeta } from "@/lib/pagination"

type EpicsListPageProps = {
  projectId: string
  projectName: string
  initialEpics: EpicRow[]
  initialError: string | null
  initialPagination: PaginationMeta
}

export default function EpicsListPage({
  projectId,
  projectName,
  initialEpics,
  initialError,
  initialPagination,
}: EpicsListPageProps) {
  const [epics, setEpics] = useState<EpicRow[]>(initialEpics)
  const [error, setError] = useState<string | null>(initialError)
  const [pagination, setPagination] = useState<PaginationMeta>(initialPagination)
  const [isPending, startTransition] = useTransition()

  function handleRetry() {
    startTransition(async () => {
      setError(null)

      const result = await getEpicsAction(projectId, {
        limit: pagination.limit,
        offset: pagination.offset,
      })

      setEpics(result.data)
      setError(result.error)
      setPagination(result.pagination)
    })
  }

  if (isPending) {
    return <EpicsSkeleton />
  }

  return (
    <section className="relative px-5 py-5 sm:px-6 sm:py-7 lg:px-8">
      <EpicsListHeader projectName={projectName} />

      {error ? (
        <EpicsError onRetry={handleRetry} />
      ) : epics.length === 0 ? (
        <EpicsEmpty />
      ) : (
        <div
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
          aria-label="Epics list"
        >
          {epics.map((epic) => (
            <EpicCard key={epic.id} epic={epic} />
          ))}
        </div>
      )}

      <Button
        size="icon"
        className="fixed right-6 bottom-6 size-14 rounded-full shadow-[0_8px_24px_rgba(0,50,184,0.25)] sm:hidden"
        aria-label="New epic"
      >
        <Plus className="size-6" aria-hidden="true" />
      </Button>
    </section>
  )
}