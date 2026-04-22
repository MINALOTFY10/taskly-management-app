"use server"

import { revalidatePath } from "next/cache"

import { requireUser } from "@/lib/auth.utils"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  createTaskSchema,
  type CreateTaskFormValues,
} from "@/features/tasks/schemas/validations"
import { isTaskStatus, type TaskStatus } from "@/features/tasks/types"

type TaskActionResult = {
  data: { id: string } | null
  error: string | null
}

type TaskStatusActionResult = {
  data: { id: string; status: TaskStatus } | null
  error: string | null
}

function toNullable(value: string | undefined) {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

function toIsoDateTime(value: string | undefined) {
  const normalized = value?.trim()
  if (!normalized) return null

  const parsed = new Date(normalized)
  if (Number.isNaN(parsed.getTime())) return null

  return parsed.toISOString()
}

export async function createTaskAction(
  projectId: string,
  values: CreateTaskFormValues
): Promise<TaskActionResult> {
  const normalizedProjectId = projectId.trim()

  if (!normalizedProjectId) {
    return { data: null, error: "Invalid project id." }
  }

  const validated = createTaskSchema.safeParse(values)
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
      error: "You are not allowed to create tasks in this project.",
    }
  }

  const assigneeId = toNullable(validated.data.assigneeId)
  if (assigneeId) {
    const { data: assigneeMember, error: assigneeError } = await supabase
      .from("project_members")
      .select("user_id")
      .eq("project_id", normalizedProjectId)
      .eq("user_id", assigneeId)
      .maybeSingle<{ user_id: string }>()

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

  const epicId = toNullable(validated.data.epicId)
  if (epicId) {
    const { data: epic, error: epicError } = await supabase
      .from("epics")
      .select("id")
      .eq("project_id", normalizedProjectId)
      .eq("id", epicId)
      .maybeSingle<{ id: string }>()

    if (epicError) {
      return {
        data: null,
        error: `Failed to validate epic: ${epicError.message}`,
      }
    }

    if (!epic) {
      return {
        data: null,
        error: "Selected epic does not belong to this project.",
      }
    }
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      project_id: normalizedProjectId,
      title: validated.data.title,
      status: validated.data.status,
      epic_id: epicId,
      description: toNullable(validated.data.description),
      assignee_id: assigneeId,
      due_date: toIsoDateTime(validated.data.dueDate),
      created_by: authUser.id,
    })
    .select("id")
    .single<{ id: string }>()

  if (error) {
    return {
      data: null,
      error: `Failed to create task: ${error.message}`,
    }
  }

  revalidatePath(`/project/${normalizedProjectId}/tasks`)
  revalidatePath(`/project/${normalizedProjectId}/tasks/new`)
  revalidatePath(`/project/${normalizedProjectId}/epics`)

  return { data, error: null }
}

export async function updateTaskStatusAction(
  projectId: string,
  taskId: string,
  status: string
): Promise<TaskStatusActionResult> {
  const normalizedProjectId = projectId.trim()
  const normalizedTaskId = taskId.trim()

  if (!normalizedProjectId || !normalizedTaskId) {
    return { data: null, error: "Invalid project id or task id." }
  }

  if (!isTaskStatus(status)) {
    return { data: null, error: "Invalid task status." }
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
      error: "You are not allowed to update tasks in this project.",
    }
  }

  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("id")
    .eq("id", normalizedTaskId)
    .eq("project_id", normalizedProjectId)
    .maybeSingle<{ id: string }>()

  if (taskError) {
    return {
      data: null,
      error: `Failed to validate task: ${taskError.message}`,
    }
  }

  if (!task) {
    return {
      data: null,
      error: "Task does not belong to this project.",
    }
  }

  const { data, error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", normalizedTaskId)
    .eq("project_id", normalizedProjectId)
    .select("id, status")
    .single<{ id: string; status: TaskStatus }>()

  if (error) {
    return {
      data: null,
      error: `Failed to update task status: ${error.message}`,
    }
  }

  revalidatePath(`/project/${normalizedProjectId}/tasks`)
  revalidatePath(`/project/${normalizedProjectId}/epics`)

  return { data, error: null }
}
