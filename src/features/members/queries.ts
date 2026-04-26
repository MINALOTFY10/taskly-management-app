import { createClient } from "@supabase/supabase-js"

import { ProjectMemberRole, ProjectMemberRow } from "@/features/members/types"
import { requireUser } from "@/lib/auth.utils"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export type ProjectMembersQueryResult = {
  data: ProjectMemberRow[]
  error: string | null
}

const PROJECT_MEMBER_ROLE_PRIORITY: Record<ProjectMemberRole, number> = {
  owner: 0,
  admin: 1,
  member: 2,
  viewer: 3,
}

export type CurrentUserRoleQueryResult = {
  userId: string | null
  role: ProjectMemberRole | null
  error: string | null
}

function createSupabaseAdminClient() {
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable.")
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey)
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
  const authUser = await requireUser()

  const { data: memberRecord, error: memberRecordError } = await supabase
    .from("project_members")
    .select("id")
    .eq("project_id", normalizedProjectId)
    .eq("user_id", authUser.id)
    .maybeSingle()

  if (memberRecordError) {
    return {
      data: [],
      error: `Failed to validate project membership: ${memberRecordError.message}`,
    }
  }

  if (!memberRecord) {
    return {
      data: [],
      error: "You do not have permission to view this project's members.",
    }
  }

  let adminClient

  try {
    adminClient = createSupabaseAdminClient()
  } catch (error) {
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while loading members.",
    }
  }

  const { data: members, error: membersError } = await adminClient
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

  const { data: profiles, error: profilesError } = await adminClient
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

  result.sort((a, b) => {
    const roleDifference =
      PROJECT_MEMBER_ROLE_PRIORITY[a.role] - PROJECT_MEMBER_ROLE_PRIORITY[b.role]

    if (roleDifference !== 0) {
      return roleDifference
    }

    return a.name.localeCompare(b.name)
  })

  return { data: result, error: null }
}

export async function getCurrentUserRole(
  projectId: string
): Promise<CurrentUserRoleQueryResult> {
  const normalizedProjectId = projectId.trim()

  if (!normalizedProjectId) {
    return { userId: null, role: null, error: "Invalid project id." }
  }

  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      userId: null,
      role: null,
      error: userError?.message ?? "Failed to load current user role.",
    }
  }

  const { data, error } = await supabase
    .from("project_members")
    .select("role")
    .eq("project_id", normalizedProjectId)
    .eq("user_id", user.id)
    .maybeSingle<{ role: unknown }>()

  if (error) {
    return { userId: user.id, role: null, error: `Failed to load role: ${error.message}` }
  }

  if (!data) {
    return { userId: user.id, role: null, error: null }
  }

  return { userId: user.id, role: normalizeRole(data.role), error: null }
}