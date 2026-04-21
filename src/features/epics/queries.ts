import { createSupabaseServerClient } from "@/lib/supabase/server"
import { PAGE_SIZE, type PaginationMeta } from "@/lib/pagination"
import type { EpicRow } from "@/features/epics/types"

export type EpicsQueryResult = {
  data: EpicRow[]
  error: string | null
  pagination: PaginationMeta
}

export type GetEpicsOptions = {
  limit?: number
  offset?: number
}

const EMPTY_PAGINATION = (limit: number, offset: number): PaginationMeta => ({
  limit,
  offset,
  totalCount: 0,
  rangeStart: 0,
  rangeEnd: 0,
})

export async function getEpics(
  projectId: string,
  options: GetEpicsOptions = {}
): Promise<EpicsQueryResult> {
  const normalizedId = projectId.trim()

  if (!normalizedId) {
    return {
      data: [],
      error: "Invalid project id.",
      pagination: EMPTY_PAGINATION(PAGE_SIZE, 0),
    }
  }

  const limit = Math.max(1, options.limit ?? PAGE_SIZE)
  const offset = Math.max(0, options.offset ?? 0)

  const supabase = await createSupabaseServerClient()

  const { data, error, count } = await supabase
    .from("project_epics")
    .select("*", { count: "exact" })
    .eq("project_id", normalizedId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return {
      data: [],
      error: `Failed to load epics: ${error.message}`,
      pagination: EMPTY_PAGINATION(limit, offset),
    }
  }

  const rows = (data ?? []) as EpicRow[]

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