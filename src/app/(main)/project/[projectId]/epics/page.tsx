import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { PAGE_SIZE } from "@/lib/pagination"
import { getProjectById, getProjectMembers } from "@/features/projects/queries"
import { getEpics } from "@/features/epics/queries"
import EpicsListPage from "@/features/epics/components/listing/epics-list-page"
import { getOffsetFromPage, parsePageParam } from "@/lib/pagination"

type EpicsPageProps = {
  params: Promise<{ projectId: string }>
  searchParams: Promise<{ page?: string; q?: string }>
}

export async function generateMetadata({
  params,
}: EpicsPageProps): Promise<Metadata> {
  const { projectId } = await params
  const { data } = await getProjectById(projectId)
  return {
    title: data ? `${data.name} — Epics` : "Project Epics",
  }
}

export default async function EpicsPage({
  params,
  searchParams,
}: EpicsPageProps) {
  const { projectId } = await params
  const { page: pageParam, q } = await searchParams
  const page = parsePageParam(pageParam)
  const offset = getOffsetFromPage(page, PAGE_SIZE)
  const searchTerm = q?.trim() ?? ""

  const [projectResult, epicsResult, membersResult] = await Promise.all([
    getProjectById(projectId),
    getEpics(projectId, { limit: PAGE_SIZE, offset, search: searchTerm }),
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

  const assigneeOptions = membersResult.data.map((member) => ({
    userId: member.userId,
    name: member.name,
    email: member.email,
    avatarUrl: member.avatarUrl,
  }))

  return (
    <EpicsListPage
      projectId={projectId}
      projectName={projectResult.data.name}
      initialSearchTerm={searchTerm}
      initialEpics={epicsResult.data}
      initialError={epicsResult.error}
      initialPagination={epicsResult.pagination}
      assigneeOptions={assigneeOptions}
    />
  )
}
