import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { ProjectRow } from "@/features/projects/types"
import EmptyState from "./project-list-empty"
import ErrorState from "./project-list-error"
import ProjectListItem from "./project-list-item"

type ProjectListPageProps = {
  projects: ProjectRow[]
  hasError: boolean
}

export default function ProjectListPage({
  projects,
  hasError,
}: ProjectListPageProps) {
  if (hasError) return <ErrorState />
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
            className="hidden h-12 gap-2 rounded-md px-6 text-[14px] font-semibold shadow-[0_10px_18px_rgba(0,50,184,0.15)] sm:inline-flex"
          >
            <Link href="/project/add">
              <Plus className="size-4" />
              Create New Project
            </Link>
          </Button>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:mt-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
          {projects.map((project) => (
            <ProjectListItem key={project.id} project={project} />
          ))}

          <Link
            href="/project/add"
            className="hidden min-h-55 items-center justify-center rounded-lg border border-dashed border-border/70 bg-card/40 text-center transition-colors hover:bg-card md:flex"
          >
            <div className="space-y-3">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Plus className="size-5" />
              </div>
              <p className="text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
                Add Project
              </p>
            </div>
          </Link>
        </div>
      </div>

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
