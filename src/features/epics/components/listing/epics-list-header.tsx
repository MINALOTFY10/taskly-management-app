"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronRight, Loader2, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type EpicsListHeaderProps = {
  projectId: string
  projectName: string
  initialSearchTerm: string
}

export default function EpicsListHeader({
  projectId,
  projectName,
  initialSearchTerm,
}: EpicsListHeaderProps) {
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

  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
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

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center lg:justify-end">
        <div className="relative w-full sm:w-80 lg:w-82.5">
          {isSearching ? (
            <Loader2
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
              aria-hidden="true"
            />
          ) : (
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          )}
          <Input
            type="search"
            placeholder="Search epics..."
            className="h-10 w-full border-0 bg-[#d9e2ff] pl-9 text-sm text-foreground shadow-none placeholder:text-slate-500 focus-visible:ring-0"
            aria-label="Search epics"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-busy={isSearching}
          />
        </div>

        <Button
          asChild
          size="lg"
          className="hidden h-10 gap-2 px-5 text-sm font-semibold shadow-[0_8px_20px_rgba(0,50,184,0.18)] sm:inline-flex"
        >
          <Link href={`/project/${projectId}/epics/add`}>
            <Plus className="size-4" aria-hidden="true" />
            New Epic
          </Link>
        </Button>
      </div>
    </header>
  )
}