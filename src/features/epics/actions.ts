"use server"

import { revalidatePath } from "next/cache"

import {
  getEpicById,
  getEpics,
  type GetEpicsOptions,
  type EpicsQueryResult,
} from "@/features/epics/queries"
import {
  createEpicSchema,
  type CreateEpicFormValues,
  updateEpicSchema,
  type UpdateEpicFormValues,
} from "@/features/epics/schemas/validations"
import type { EpicRow } from "@/features/epics/types"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { requireUser } from "@/lib/auth.utils"

type EpicActionResult = {
  data: EpicRow | null
  error: string | null
}

export async function getEpicsAction(
  projectId: string,
  options: GetEpicsOptions = {}
): Promise<EpicsQueryResult> {
  return getEpics(projectId, options)
}

export async function createEpicAction(
  projectId: string,
  values: CreateEpicFormValues
): Promise<EpicActionResult> {
  const normalizedProjectId = projectId.trim()

  if (!normalizedProjectId) {
    return { data: null, error: "Invalid project id." }
  }

  const validated = createEpicSchema.safeParse(values)
  if (!validated.success) {
    return { data: null, error: "Invalid form data." }
  }

  const authUser = await requireUser()
  const supabase = await createSupabaseServerClient()

  //  Round trip 1+2
  const [memberResult, countResult] = await Promise.all([
    supabase
      .from("project_members")
      .select("id")
      .eq("project_id", normalizedProjectId)
      .eq("user_id", authUser.id)
      .maybeSingle<{ id: string }>(),

    supabase
      .from("project_epics")
      .select("id", { count: "exact", head: true })
      .eq("project_id", normalizedProjectId),
  ])

  if (memberResult.error) {
    return {
      data: null,
      error: `Failed to validate project membership: ${memberResult.error.message}`,
    }
  }

  if (!memberResult.data) {
    return {
      data: null,
      error: "You are not allowed to create epics in this project.",
    }
  }

  if (countResult.error) {
    return {
      data: null,
      error: `Failed to generate epic id: ${countResult.error.message}`,
    }
  }

  //  Round trip 3
  const assigneeId = validated.data.assigneeUserId || null

  if (assigneeId) {
    const { data: assigneeMember, error: assigneeError } = await supabase
      .from("project_members")
      .select("user_id")
      .eq("project_id", normalizedProjectId)
      .eq("user_id", assigneeId)
      .maybeSingle()

    if (assigneeError) {
      return {
        data: null,
        error: `Failed to validate assignee: ${assigneeError.message}`,
      }
    }

    if (!assigneeMember) {
      return {
        data: null,
        error: "Selected assignee is not a project member.",
      }
    }
  }

  // Round trip 4: insert
  const epicId = `EPC-${String((countResult.count ?? 0) + 1).padStart(3, "0")}`

  const { error: insertError } = await supabase.from("epics").insert({
    project_id: normalizedProjectId,
    epic_id: epicId,
    title: validated.data.title,
    description: validated.data.description?.trim() || null,
    deadline: validated.data.deadline || null,
    created_by: authUser.id,
    assignee_id: assigneeId,
  })

  if (insertError) {
    return {
      data: null,
      error: `Failed to create epic: ${insertError.message}`,
    }
  }

  revalidatePath(`/project/${normalizedProjectId}/epics`)
  revalidatePath(`/project/${normalizedProjectId}/epics/new`)

  return { data: null, error: null }
}

export async function updateEpicAction(
  projectId: string,
  epicId: string,
  values: UpdateEpicFormValues
): Promise<EpicActionResult> {
  const normalizedProjectId = projectId.trim()
  const normalizedEpicId = epicId.trim()

  if (!normalizedProjectId || !normalizedEpicId) {
    return { data: null, error: "Invalid project id or epic id." }
  }

  const validated = updateEpicSchema.safeParse(values)
  if (!validated.success) {
    return { data: null, error: "Invalid form data." }
  }

  const authUser = await requireUser()
  const supabase = await createSupabaseServerClient()

  const { data: member, error: memberError } = await supabase
    .from("project_members")
    .select("id")
    .eq("project_id", normalizedProjectId)
    .eq("user_id", authUser.id)
    .maybeSingle<{ id: string }>()

  if (memberError) {
    return {
      data: null,
      error: `Failed to validate project membership: ${memberError.message}`,
    }
  }

  if (!member) {
    return {
      data: null,
      error: "You are not allowed to update epics in this project.",
    }
  }

  const payload = validated.data

  if (payload.assigneeUserId) {
    const { data: assigneeMember, error: assigneeError } = await supabase
      .from("project_members")
      .select("user_id")
      .eq("project_id", normalizedProjectId)
      .eq("user_id", payload.assigneeUserId)
      .maybeSingle()

    if (assigneeError) {
      return {
        data: null,
        error: `Failed to validate assignee: ${assigneeError.message}`,
      }
    }

    if (!assigneeMember) {
      return {
        data: null,
        error: "Selected assignee is not a project member.",
      }
    }
  }

  const updatePayload: {
    title?: string
    description?: string | null
    assignee_id?: string | null
    deadline?: string | null
  } = {}

  if (payload.title !== undefined) {
    updatePayload.title = payload.title
  }

  if (payload.description !== undefined) {
    updatePayload.description = payload.description?.trim() || null
  }

  if (payload.assigneeUserId !== undefined) {
    updatePayload.assignee_id = payload.assigneeUserId
  }

  if (payload.deadline !== undefined) {
    updatePayload.deadline = payload.deadline
  }

  const { data: updatedRow, error: updateError } = await supabase
    .from("epics")
    .update(updatePayload)
    .eq("project_id", normalizedProjectId)
    .eq("id", normalizedEpicId)
    .select("id")
    .maybeSingle<{ id: string }>()

  if (updateError) {
    return {
      data: null,
      error: `Failed to update epic: ${updateError.message}`,
    }
  }

  if (!updatedRow) {
    return {
      data: null,
      error: "Epic not found or you do not have permission to edit it.",
    }
  }

  const refreshedEpic = await getEpicById(normalizedProjectId, normalizedEpicId)
  if (refreshedEpic.error || !refreshedEpic.data) {
    return {
      data: null,
      error: refreshedEpic.error ?? "Failed to load updated epic details.",
    }
  }

  revalidatePath(`/project/${normalizedProjectId}/epics`)

  return { data: refreshedEpic.data, error: null }
}
