import { createClient } from "@supabase/supabase-js"

import { ProjectMemberRole, ProjectMemberRow } from "@/features/members/types"
import { requireUser } from "@/lib/auth.utils"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export type ProjectMembersQueryResult = {
  data: ProjectMemberRow[]
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

  return { data: result, error: null }
}