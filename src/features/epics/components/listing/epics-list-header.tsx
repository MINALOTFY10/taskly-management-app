"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Loader2, Plus, Search } from "lucide-react"

import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav"
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
        <BreadcrumbNav
          items={[
            { label: "Projects", href: "/project" },
            {
              label: projectName,
              href: `/project/${projectId}/details`,
            },
            { label: "Epics", current: true },
          ]}
        />

        <h1 className="mt-2 text-[2rem] leading-none font-semibold tracking-tight text-foreground">
          Project Epics
        </h1>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center lg:justify-end">
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
