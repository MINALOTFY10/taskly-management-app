import Link from "next/link"
import { ChevronRight, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type EpicsListHeaderProps = {
  projectId: string
  projectName: string
}

export default function EpicsListHeader({
  projectId,
  projectName,
}: EpicsListHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
          asChild
          size="lg"
          className="h-10 gap-2 px-5 text-sm font-semibold shadow-[0_8px_20px_rgba(0,50,184,0.18)]"
        >
          <Link href={`/project/${projectId}/epics/add`}>
            <Plus className="size-4" aria-hidden="true" />
            New Epic
          </Link>
        </Button>
      </div>

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