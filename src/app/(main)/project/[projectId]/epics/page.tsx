import type { Metadata } from "next"

import { PAGE_SIZE } from "@/lib/pagination"
import { getProjectById } from "@/features/projects/queries"
import { getEpics } from "@/features/epics/queries"
import EpicsListPage from "@/features/epics/components/listing/epics-list-page"
import { getOffsetFromPage, parsePageParam } from "@/lib/pagination"
import { getProjectMembers } from "@/features/members/queries"
import { assertProjectExists } from "@/lib/project-guards"

type EpicsPageProps = {
  params: Promise<{ projectId: string }>
  searchParams: Promise<{ page?: string; q?: string }>
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

  assertProjectExists(projectResult)

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
