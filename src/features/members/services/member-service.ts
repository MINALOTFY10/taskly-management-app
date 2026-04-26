import { createClient } from "@/lib/supabase/client"

import type { ProjectMemberRole } from "@/features/members/types"

type MemberServiceErrorResult = { error: string }

type MemberServiceResult = { success: true } | MemberServiceErrorResult

function mapMemberError(rawError: unknown): string {
  const defaultMessage = "Something went wrong. Please try again."

  if (!rawError) {
    return defaultMessage
  }

  if (rawError instanceof TypeError) {
    return defaultMessage
  }

  const normalizedText =
    typeof rawError === "string"
      ? rawError.toLowerCase()
      : [
          (rawError as { code?: unknown })?.code,
          (rawError as { message?: unknown })?.message,
          (rawError as { details?: unknown })?.details,
          (rawError as { hint?: unknown })?.hint,
        ]
          .filter((value) => typeof value === "string")
          .join(" ")
          .toLowerCase()

  if (normalizedText.includes("not allowed") || normalizedText.includes("permission")) {
    return "You don't have permission to do this."
  }

  if (normalizedText.includes("cannot remove the project owner")) {
    return "The project owner cannot be removed."
  }

  if (normalizedText.includes("cannot remove yourself")) {
    return "Use 'Leave Project' to remove yourself."
  }

  if (normalizedText.includes("cannot change the owner's role")) {
    return "Use 'Transfer Ownership' to change the owner's role."
  }

  if (normalizedText.includes("invalid role")) {
    return "Please select a valid role."
  }

  if (normalizedText.includes("owner cannot leave")) {
    return "Transfer ownership to another member before leaving."
  }

  if (normalizedText.includes("user is not a member")) {
    return "This user is not a member of the project."
  }

  if (normalizedText.includes("network") || normalizedText.includes("failed to fetch")) {
    return defaultMessage
  }

  return defaultMessage
}

export async function removeMember(
  projectId: string,
  userId: string
): Promise<MemberServiceResult> {
  const supabase = createClient()

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Failed to get session before remove_member RPC", sessionError)
      return { error: mapMemberError(sessionError) }
    }

    if (!session) {
      return { error: "You don't have permission to do this." }
    }

    const { error } = await supabase.rpc("remove_member", {
      p_project_id: projectId.trim(),
      p_user_id: userId,
    })

    if (error) {
      console.error("remove_member RPC failed", error)
      return { error: mapMemberError(error) }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected removeMember failure", error)
    return { error: mapMemberError(error) }
  }
}

export async function changeRole(
  projectId: string,
  userId: string,
  newRole: Exclude<ProjectMemberRole, "owner">
): Promise<MemberServiceResult> {
  const supabase = createClient()

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Failed to get session before change_member_role RPC", sessionError)
      return { error: mapMemberError(sessionError) }
    }

    if (!session) {
      return { error: "You don't have permission to do this." }
    }

    const { error } = await supabase.rpc("change_member_role", {
      p_project_id: projectId.trim(),
      p_user_id: userId,
      p_new_role: newRole,
    })

    if (error) {
      console.error("change_member_role RPC failed", error)
      return { error: mapMemberError(error) }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected changeRole failure", error)
    return { error: mapMemberError(error) }
  }
}

export async function transferOwnership(
  projectId: string,
  newOwnerId: string
): Promise<MemberServiceResult> {
  const supabase = createClient()

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Failed to get session before transfer_ownership RPC", sessionError)
      return { error: mapMemberError(sessionError) }
    }

    if (!session) {
      return { error: "You don't have permission to do this." }
    }

    const { error } = await supabase.rpc("transfer_ownership", {
      p_project_id: projectId.trim(),
      p_new_owner_id: newOwnerId,
    })

    if (error) {
      console.error("transfer_ownership RPC failed", error)
      return { error: mapMemberError(error) }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected transferOwnership failure", error)
    return { error: mapMemberError(error) }
  }
}

export async function leaveProject(projectId: string): Promise<MemberServiceResult> {
  const supabase = createClient()

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Failed to get session before leave_project RPC", sessionError)
      return { error: mapMemberError(sessionError) }
    }

    if (!session) {
      return { error: "You don't have permission to do this." }
    }

    const { error } = await supabase.rpc("leave_project", {
      p_project_id: projectId.trim(),
    })

    if (error) {
      console.error("leave_project RPC failed", error)
      return { error: mapMemberError(error) }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected leaveProject failure", error)
    return { error: mapMemberError(error) }
  }
}
