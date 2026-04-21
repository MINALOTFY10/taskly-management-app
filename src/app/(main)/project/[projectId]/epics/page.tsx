import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { PAGE_SIZE } from "@/lib/pagination"
import { getProjectById } from "@/features/projects/queries"
import { getEpics } from "@/features/epics/queries"
import EpicsListPage from "@/features/epics/components/listing/epics-list-page"
import { getOffsetFromPage, parsePageParam } from "@/lib/pagination"

type EpicsPageProps = {
  params: Promise<{ projectId: string }>
  searchParams: Promise<{ page?: string }>
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
  const { page: pageParam } = await searchParams
  const page = parsePageParam(pageParam)
  const offset = getOffsetFromPage(page, PAGE_SIZE)

  const [projectResult, epicsResult] = await Promise.all([
    getProjectById(projectId),
    getEpics(projectId, { limit: PAGE_SIZE, offset }),
  ])

  if (projectResult.error) {
    throw new Error(projectResult.error)
  }

  if (projectResult.notFound || !projectResult.data) {
    notFound()
  }

  return (
    <EpicsListPage
      key={`page-${page}`}
      projectId={projectId}
      projectName={projectResult.data.name}
      initialEpics={epicsResult.data}
      initialError={epicsResult.error}
      initialPagination={epicsResult.pagination}
    />
  )
}
