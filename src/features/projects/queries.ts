import { createSupabaseServerClient } from "@/lib/supabase/server"
import { PAGE_SIZE, type PaginationMeta } from "@/lib/pagination"
import type {
  ProjectRow,
  EpicRow,
  TaskRow,
} from "@/features/projects/types"

// ─── existing selectors ──────────────────────────────────────────────────────

const PROJECT_SELECT_COLUMNS = "id, name, description, created_at"

// ─── existing result types ────────────────────────────────────────────────────

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

// ─── new result types ─────────────────────────────────────────────────────────

export type ProjectEpicsQueryResult = {
  data: EpicRow[]
  error: string | null
}

export type ProjectTasksQueryResult = {
  data: TaskRow[]
  error: string | null
}

// ─── existing queries ─────────────────────────────────────────────────────────

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

// ─── new queries ──────────────────────────────────────────────────────────────
// Note: getProjectMembers lives in @/features/members/queries — it uses a
// service-role admin client to fetch profiles because there is no direct FK
// between project_members and profiles in the schema.

/**
 * Fetches the most-recently-created epics for a project.
 * `limit` defaults to 5 for the details-page preview.
 */
export async function getProjectEpics(
  projectId: string,
  limit = 5
): Promise<ProjectEpicsQueryResult> {
  const normalizedId = projectId.trim()
  if (!normalizedId) {
    return { data: [], error: "Invalid project id." }
  }

  const safeLimit = Math.max(1, limit)
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("epics")
    .select("id, project_id, title, description, status, epic_id, deadline, created_at")
    .eq("project_id", normalizedId)
    .order("created_at", { ascending: false })
    .limit(safeLimit)

  if (error) {
    return { data: [], error: `Failed to load epics: ${error.message}` }
  }

  return { data: (data as EpicRow[]) ?? [], error: null }
}

/**
 * Fetches the most-recently-created tasks for a project.
 * `limit` defaults to 5 for the details-page preview.
 */
export async function getProjectTasks(
  projectId: string,
  limit = 5
): Promise<ProjectTasksQueryResult> {
  const normalizedId = projectId.trim()
  if (!normalizedId) {
    return { data: [], error: "Invalid project id." }
  }

  const safeLimit = Math.max(1, limit)
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("tasks")
    .select("id, project_id, epic_id, title, description, status, task_id, due_date, created_at")
    .eq("project_id", normalizedId)
    .order("created_at", { ascending: false })
    .limit(safeLimit)

  if (error) {
    return { data: [], error: `Failed to load tasks: ${error.message}` }
  }

  return { data: (data as TaskRow[]) ?? [], error: null }
}