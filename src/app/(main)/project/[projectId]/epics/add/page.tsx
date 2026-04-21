import type { Metadata } from "next"
import { notFound } from "next/navigation"

import AddEpicForm from "@/features/epics/components/add/add-epic-form"
import { getProjectById, getProjectMembers } from "@/features/projects/queries"

type NewEpicPageProps = {
  params: Promise<{ projectId: string }>
}

export async function generateMetadata({
  params,
}: NewEpicPageProps): Promise<Metadata> {
  const { projectId } = await params
  const { data } = await getProjectById(projectId)

  return {
    title: data ? `Create Epic - ${data.name}` : "Create Epic",
  }
}

export default async function NewEpicPage({ params }: NewEpicPageProps) {
  const { projectId } = await params

  const [projectResult, membersResult] = await Promise.all([
    getProjectById(projectId),
    getProjectMembers(projectId),
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

  const members = membersResult.data.map((member) => ({
    userId: member.userId,
    name: member.name,
    email: member.email,
  }))

  return (
    <AddEpicForm
      projectId={projectId}
      projectName={projectResult.data.name}
      members={members}
    />
  )
}