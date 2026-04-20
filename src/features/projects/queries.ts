import { createSupabaseServerClient } from "@/lib/supabase/server"
import { PAGE_SIZE, type PaginationMeta } from "@/lib/pagination"
import type { ProjectRow } from "@/features/projects/types"

export type ProjectsQueryResult = {
  data: ProjectRow[]
  error: string | null
  pagination: PaginationMeta
}

export type GetProjectsOptions = {
  limit?: number
  offset?: number
}

export async function getProjects(
  options: GetProjectsOptions = {}
): Promise<ProjectsQueryResult> {
  const limit = Math.max(1, options.limit ?? PAGE_SIZE)
  const offset = Math.max(0, options.offset ?? 0)

  const supabase = await createSupabaseServerClient()

  const { data, error, count } = await supabase
    .from("projects")
    .select("id, name, description, created_at", { count: "exact" })
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
