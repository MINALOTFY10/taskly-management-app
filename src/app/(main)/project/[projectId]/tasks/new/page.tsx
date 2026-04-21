import type { Metadata } from "next"
import { notFound } from "next/navigation"

import AddTaskForm from "@/features/tasks/components/add/add-task-form"
import { getEpics } from "@/features/epics/queries"
import { getProjectById, getProjectMembers } from "@/features/projects/queries"

type NewTaskPageProps = {
  params: Promise<{ projectId: string }>
  searchParams: Promise<{ epicId?: string }>
}

export async function generateMetadata({
  params,
}: NewTaskPageProps): Promise<Metadata> {
  const { projectId } = await params
  const { data } = await getProjectById(projectId)

  return {
    title: data ? `Create Task - ${data.name}` : "Create Task",
  }
}

export default async function NewTaskPage({
  params,
  searchParams,
}: NewTaskPageProps) {
  const { projectId } = await params
  const { epicId } = await searchParams

  const [projectResult, membersResult, epicsResult] = await Promise.all([
    getProjectById(projectId),
    getProjectMembers(projectId),
    getEpics(projectId, { limit: 500, offset: 0 }),
  ])

  if (projectResult.error) {
    throw new Error(projectResult.error)
  }

  if (projectResult.notFound || !projectResult.data) {
    notFound()
  }

  if (membersResult.error) {
    throw new Error(membersResult.error)
  }

  if (epicsResult.error) {
    throw new Error(epicsResult.error)
  }

  const members = membersResult.data.map((member) => ({
    userId: member.userId,
    name: member.name,
    email: member.email,
  }))

  const epics = epicsResult.data.map((epic) => ({
    id: epic.id,
    epicId: epic.epic_id,
    title: epic.title,
  }))

  return (
    <AddTaskForm
      projectId={projectId}
      projectName={projectResult.data.name}
      initialEpicId={epicId}
      members={members}
      epics={epics}
    />
  )
}
