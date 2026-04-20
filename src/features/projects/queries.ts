import { createSupabaseServerClient } from "@/lib/supabase/server"
import { PAGE_SIZE, type PaginationMeta } from "@/lib/pagination"
import type { ProjectRow } from "@/features/projects/types"

const PROJECT_SELECT_COLUMNS = "id, name, description, created_at"

export type ProjectsQueryResult = {
  data: ProjectRow[]
  error: string | null
  pagination: PaginationMeta
}

export type GetProjectsOptions = {
  limit?: number
  offset?: number
}

export type ProjectByIdQueryResult = {
  data: ProjectRow | null
  error: string | null
  notFound: boolean
}

export async function getProjects(
  options: GetProjectsOptions = {}
): Promise<ProjectsQueryResult> {
  const limit = Math.max(1, options.limit ?? PAGE_SIZE)
  const offset = Math.max(0, options.offset ?? 0)

  const supabase = await createSupabaseServerClient()

  const { data, error, count } = await supabase
    .from("projects")
    .select(PROJECT_SELECT_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return {
      data: [],
      error: `Failed to load projects: ${error.message}`,
      pagination: {
        limit,
        offset,
        totalCount: 0,
        rangeStart: 0,
        rangeEnd: 0,
      },
    }
  }

  const rows = data ?? []

  return {
    data: rows,
    error: null,
    pagination: {
      limit,
      offset,
      totalCount: count ?? 0,
      rangeStart: rows.length > 0 ? offset : 0,
      rangeEnd: rows.length > 0 ? offset + rows.length - 1 : 0,
    },
  }
}

export async function getProjectById(
  projectId: string
): Promise<ProjectByIdQueryResult> {
  const normalizedProjectId = projectId.trim()

  if (!normalizedProjectId) {
    return { data: null, error: "Invalid project id.", notFound: false }
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT_COLUMNS)
    .eq("id", normalizedProjectId)
    .maybeSingle<ProjectRow>()

  if (error) {
    return {
      data: null,
      error: `Failed to load project: ${error.message}`,
      notFound: false,
    }
  }

  if (!data) {
    return { data: null, error: null, notFound: true }
  }

  return { data, error: null, notFound: false }
}