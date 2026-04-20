import type { Metadata } from "next"
import { PAGE_SIZE } from "@/lib/pagination"
import { getProjects } from "@/features/projects/queries"
import ProjectListPage from "@/features/projects/components/project-list-page"
import { getOffsetFromPage, parsePageParam } from "@/lib/pagination"

export const metadata: Metadata = {
  title: "Projects",
}

export default async function ProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = parsePageParam(pageParam)
  const offset = getOffsetFromPage(page, PAGE_SIZE)

  const { data, error, pagination } = await getProjects({
    limit: PAGE_SIZE,
    offset,
  })

  return (
    <ProjectListPage
      key={offset}
      initialProjects={data}
      initialError={error}
      initialPagination={pagination}
    />
  )
}
