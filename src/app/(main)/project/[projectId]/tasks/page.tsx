import type { Metadata } from "next"

import TasksViewSwitcher from "@/features/tasks/components/tasks-view-switcher"
import { getProjectById } from "@/features/projects/queries"
import {
  getAllTasksByProjectId,
  getTasksByProjectId,
} from "@/features/tasks/queries"
import { PAGE_SIZE, getOffsetFromPage, parsePageParam } from "@/lib/pagination"
import { assertProjectExists } from "@/lib/project-guards"

type TasksPageProps = {
  params: Promise<{ projectId: string }>
  searchParams: Promise<{ view?: string; page?: string; q?: string }>
}

export async function generateMetadata({
  params,
}: TasksPageProps): Promise<Metadata> {
  const { projectId } = await params
  const { data } = await getProjectById(projectId)

  return {
    title: data ? `${data.name} — Tasks` : "Project Tasks",
  }
}

export default async function TasksPage({
  params,
  searchParams,
}: TasksPageProps) {
  const { projectId } = await params
  const { view, page: pageParam, q } = await searchParams
  const initialView = view === "list" ? "list" : "board"
  const page = initialView === "list" ? parsePageParam(pageParam) : 1
  const offset = getOffsetFromPage(page, PAGE_SIZE)
  const searchTerm = q?.trim() ?? ""
  const shouldLoadBoardTasks = initialView === "board"

  const [projectResult, boardTasksResult, listTasksResult] = await Promise.all([
    getProjectById(projectId),
    shouldLoadBoardTasks
      ? getAllTasksByProjectId(projectId, { search: searchTerm })
      : Promise.resolve({
          data: [],
          error: null,
          pagination: {
            limit: PAGE_SIZE,
            offset: 0,
            totalCount: 0,
            rangeStart: 0,
            rangeEnd: 0,
          },
        }),
    getTasksByProjectId(projectId, {
      limit: PAGE_SIZE,
      offset,
      search: searchTerm,
    }),
  ])

  assertProjectExists(projectResult)

  return (
    <TasksViewSwitcher
      key={`${initialView}-${page}`}
      projectId={projectId}
      projectName={projectResult.data.name}
      boardTasks={boardTasksResult.data}
      hasBoardTasksLoaded={shouldLoadBoardTasks}
      listTasks={listTasksResult.data}
      listError={listTasksResult.error}
      listPagination={listTasksResult.pagination}
      initialSearchTerm={searchTerm}
      initialView={initialView}
    />
  )
}
