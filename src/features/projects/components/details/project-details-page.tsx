"use client"

import Link from "next/link"
import { CalendarDays, CheckSquare, Layers, Pencil, Users } from "lucide-react"

import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav"
import { Button } from "@/components/ui/button"
import { formatProjectDate } from "@/features/projects/utils/date"
import type { EpicRow, ProjectRow, TaskRow } from "@/features/projects/types"
import type { ProjectMemberRow } from "@/features/members/types"

import EpicsSection from "./epics-section"
import MembersSection from "./members-section"
import TasksSection from "./tasks-section"

type ProjectDetailsPageProps = {
  project: ProjectRow
  members: ProjectMemberRow[]
  recentEpics: EpicRow[]
  recentTasks: TaskRow[]
  membersError: string | null
  epicsError: string | null
  tasksError: string | null
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: number
}) {
  return (
    <div className="app-stat-card">
      <div className="app-surface-icon size-9 rounded-xl">
        <Icon className="size-4 text-primary" />
      </div>
      <div>
        <p className="text-[1.25rem] leading-none font-bold text-foreground">
          {value}
        </p>
        <p className="mt-0.5 text-[0.75rem] font-medium text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  )
}

export default function ProjectDetailsPage({
  project,
  members,
  recentEpics,
  recentTasks,
  membersError,
  epicsError,
  tasksError,
}: ProjectDetailsPageProps) {
  return (
    <section className="app-page-shell">
      <div className="app-page-frame">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="space-y-3">
            <BreadcrumbNav
              items={[
                { label: "Projects", href: "/project" },
                {
                  label: project.name,
                  href: `/project/${project.id}/details`,
                },
                { label: "Overview", current: true },
              ]}
            />
            <h1 className="text-4xl leading-none font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {project.name}
            </h1>
          </div>

          <Button
            asChild
            size="lg"
            className="hidden h-10 gap-1.5 px-4 text-sm font-semibold shadow-sm sm:inline-flex"
          >
            <Link href={`/project/${project.id}/edit`}>
              <Pencil className="size-4" />
              Edit Project
            </Link>
          </Button>
        </div>

        <div className="mt-5 max-w-2xl space-y-2">
          {project.description && (
            <p className="text-base leading-7 text-muted-foreground">
              {project.description}
            </p>
          )}
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
            Created {formatProjectDate(project.created_at)}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:max-w-3xl">
          <StatCard icon={Users} label="Members" value={members.length} />
          <StatCard icon={Layers} label="Epics" value={recentEpics.length} />
          <StatCard icon={CheckSquare} label="Tasks" value={recentTasks.length} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3 xl:gap-4">
          <div className="space-y-4 lg:col-span-2 xl:space-y-4">
            <EpicsSection
              epics={recentEpics}
              projectId={project.id}
              error={epicsError}
            />
            <TasksSection
              tasks={recentTasks}
              projectId={project.id}
              error={tasksError}
            />
          </div>

          <div className="lg:col-span-1">
            <MembersSection
              members={members}
              projectId={project.id}
              error={membersError}
            />
          </div>
        </div>
      </div>

      <Button
        asChild
        size="icon-lg"
        variant="outline"
        className="app-floating-action p-6"
      >
        <Link href={`/project/${project.id}/edit`} aria-label="Edit project">
          <Pencil className="size-5" />
        </Link>
      </Button>
    </section>
  )
}