import type { Metadata } from "next"
import { notFound } from "next/navigation"

import EditProjectForm from "@/features/projects/components/edit-project-form"
import { getProjectById } from "@/features/projects/queries"

type EditProjectPageProps = {
  params: Promise<{ projectId: string }>
}

export async function generateMetadata({
  params,
}: EditProjectPageProps): Promise<Metadata> {
  const { projectId } = await params
  const { data } = await getProjectById(projectId)

  return {
    title: data ? `Edit "${data.name}"` : "Edit Project",
  }
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { projectId } = await params
  const { data, error, notFound: isNotFound } = await getProjectById(projectId)

  if (error) {
    throw new Error(error)
  }

  if (isNotFound || !data) {
    notFound()
  }

  return <EditProjectForm project={data} />
}