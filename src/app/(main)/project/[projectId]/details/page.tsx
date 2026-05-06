import { notFound } from "next/navigation"
import type { Metadata } from "next"

import {
  getProjectById,
  getProjectEpics,
  getProjectTasks,
} from "@/features/projects/queries"
import { getProjectMembers } from "@/features/members/queries"
import ProjectDetailsPage from "@/features/projects/components/details/project-details-page"
import AppErrorState from "@/components/shared/app-error-state"

type Props = {
  params: Promise<{ projectId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectId } = await params
  const { data } = await getProjectById(projectId)
  return {
    title: data?.name ?? "Project",
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { projectId } = await params

  // Fetch all data in parallel — one round-trip to Supabase
  const [projectResult, membersResult, epicsResult, tasksResult] =
    await Promise.all([
      getProjectById(projectId),
      getProjectMembers(projectId),
      getProjectEpics(projectId, 5),
      getProjectTasks(projectId, 5),
    ])

  if (projectResult.notFound) {
    notFound()
  }

  if (!projectResult.data) {
    return (
      <AppErrorState
        message={projectResult.error ?? "Failed to load project"}
        actionHref="/project"
      />
    )
  }

  return (
    <ProjectDetailsPage
      project={projectResult.data}
      members={membersResult.data}
      recentEpics={epicsResult.data}
      recentTasks={tasksResult.data}
      membersError={membersResult.error}
      epicsError={epicsResult.error}
      tasksError={tasksResult.error}
    />
  )
}