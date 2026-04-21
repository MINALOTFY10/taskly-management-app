import { createSupabaseServerClient } from "@/lib/supabase/server"
import { PAGE_SIZE, type PaginationMeta } from "@/lib/pagination"
import type {
  ProjectMemberRole,
  ProjectMemberRow,
  ProjectRow,
} from "@/features/projects/types"

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

export type ProjectMembersQueryResult = {
  data: ProjectMemberRow[]
  error: string | null
}

function normalizeRole(value: unknown): ProjectMemberRole {
  if (typeof value !== "string") return "viewer"

  const normalized = value.trim().toLowerCase()

  if (
    normalized === "owner" ||
    normalized === "admin" ||
    normalized === "member" ||
    normalized === "viewer"
  ) {
    return normalized
  }

  return "viewer"
}

export async function getProjectMembers(
  projectId: string
): Promise<ProjectMembersQueryResult> {
  const normalizedProjectId = projectId.trim()

  if (!normalizedProjectId) {
    return { data: [], error: "Invalid project id." }
  }

  const supabase = await createSupabaseServerClient()

  const { data: members, error: membersError } = await supabase
    .from("project_members")
    .select("id, user_id, role, created_at")
    .eq("project_id", normalizedProjectId)

  if (membersError) {
    return {
      data: [],
      error: `Failed to load project members: ${membersError.message}`,
    }
  }

  if (!members || members.length === 0) {
    return { data: [], error: null }
  }

  const userIds = members.map((m) => m.user_id)

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, name, email, avatar_url")
    .in("id", userIds)

  if (profilesError) {
    return {
      data: [],
      error: `Failed to load member profiles: ${profilesError.message}`,
    }
  }

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]))

  const result: ProjectMemberRow[] = members.map((member, index) => {
    const profile = profileMap.get(member.user_id)

    return {
      id: member.id ?? `${normalizedProjectId}-member-${index}`,
      userId: member.user_id,
      projectId: normalizedProjectId,
      name: profile?.name?.trim() || "Unknown User",
      email: profile?.email?.trim() || "No email",
      role: normalizeRole(member.role),
      avatarUrl: profile?.avatar_url?.trim() || null,
      joinedAt: member.created_at ?? null,
    }
  })

  return { data: result, error: null }
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
