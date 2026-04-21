"use client"

import { useState, useTransition } from "react"
import { ChevronRight, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { EpicRow } from "@/features/epics/types"
import type { PaginationMeta } from "@/lib/pagination"
import { getEpicsAction } from "@/features/epics/actions"
import EpicCard from "@/features/epics/components/epic-card"
import EpicsEmpty from "@/features/epics/components/epics-empty"
import EpicsError from "@/features/epics/components/epics-error"
import EpicsSkeleton from "@/features/epics/components/epics-skeleton"

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
  const [pagination, setPagination] =
    useState<PaginationMeta>(initialPagination)
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
      <PageHeader projectName={projectName} />

      {error ? (
        <EpicsError onRetry={handleRetry} />
      ) : epics.length === 0 ? (
        <EpicsEmpty />
      ) : (
        <>
          <div
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
            aria-label="Epics list"
          >
            {epics.map((epic) => (
              <EpicCard key={epic.id} epic={epic} />
            ))}
          </div>
        </>
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

function PageHeader({ projectName }: { projectName: string }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      {/* Left: breadcrumb + title */}
      <div>
        <nav
          className="flex items-center gap-1 text-[0.65rem] font-bold tracking-widest text-muted-foreground uppercase"
          aria-label="Breadcrumb"
        >
          <span>Projects</span>
          <ChevronRight className="size-3" aria-hidden="true" />
          <span>{projectName}</span>
          <ChevronRight className="size-3" aria-hidden="true" />
          <span className="text-primary">Epics</span>
        </nav>

        <h1 className="mt-2 text-[2rem] leading-none font-bold tracking-tight text-foreground sm:text-[2.2rem]">
          Project Epics
        </h1>
      </div>

      {/* Right: search + CTA (desktop only) */}
      <div className="hidden items-center gap-3 sm:flex">
        <div className="relative">
          <Search
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search epics..."
            className="h-10 w-52 bg-card pl-9 text-sm shadow-none"
            aria-label="Search epics"
          />
        </div>

        <Button
          size="lg"
          className="h-10 gap-2 px-5 text-sm font-semibold shadow-[0_8px_20px_rgba(0,50,184,0.18)]"
        >
          <Plus className="size-4" aria-hidden="true" />
          New Epic
        </Button>
      </div>

      {/* Mobile: search bar full-width */}
      <div className="relative sm:hidden">
        <Search
          className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Search epics..."
          className="h-10 w-full bg-card pl-9 text-sm shadow-none"
          aria-label="Search epics"
        />
      </div>
    </div>
  )
}
