"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  TASK_STATUS_VALUES,
  type TaskStatus,
} from "@/features/tasks/types"

export type TaskWithAssignee = {
  id: string
  project_id: string
  title: string
  description: string | null
  epic_id: string | null
  assignee_id: string | null
  assignee_name: string | null
  assignee_email: string | null
  assignee_avatar: string | null
  due_date: string | null
  status: TaskStatus
  created_at: string
}

export type TasksByEpicResult = {
  data: TaskWithAssignee[]
  error: string | null
}

export type TasksByProjectResult = {
  data: TaskWithAssignee[]
  error: string | null
}

type TaskQueryRow = {
  id: string
  project_id: string
  title: string
  description: string | null
  epic_id: string | null
  assignee_id: string | null
  due_date: string | null
  status: string | null
  created_at: string
}

type AssigneeProfile = {
  id: string
  name: string | null
  email: string | null
  avatar_url: string | null
}

function normalizeTaskStatus(value: string | null | undefined): TaskStatus {
  if (typeof value !== "string") {
    return "TO_DO"
  }

  return TASK_STATUS_VALUES.includes(value as TaskStatus)
    ? (value as TaskStatus)
    : "TO_DO"
}

function buildAssigneeMap(profiles: AssigneeProfile[] | null | undefined) {
  return new Map((profiles ?? []).map((profile) => [profile.id, profile]))
}

function mapTasksWithAssignees(
  projectId: string,
  tasks: TaskQueryRow[],
  profileMap: Map<string, AssigneeProfile>
): TaskWithAssignee[] {
  return tasks.map((task) => {
    const assignee = task.assignee_id ? profileMap.get(task.assignee_id) : null

    return {
      id: task.id,
      project_id: projectId,
      title: task.title,
      description: task.description,
      epic_id: task.epic_id,
      assignee_id: task.assignee_id,
      assignee_name: assignee?.name ?? null,
      assignee_email: assignee?.email ?? null,
      assignee_avatar: assignee?.avatar_url ?? null,
      due_date: task.due_date,
      status: normalizeTaskStatus(task.status),
      created_at: task.created_at,
    }
  })
}

async function getTaskRowsByProject(
  projectId: string,
  epicId?: string
): Promise<{ data: TaskQueryRow[]; error: string | null }> {
  const normalizedProjectId = projectId.trim()
  const normalizedEpicId = epicId?.trim()

  if (!normalizedProjectId) {
    return {
      data: [],
      error: "Invalid project id.",
    }
  }

  const supabase = await createSupabaseServerClient()

  let query = supabase
    .from("tasks")
    .select(
      "id, project_id, title, description, epic_id, assignee_id, due_date, status, created_at"
    )
    .eq("project_id", normalizedProjectId)

  if (normalizedEpicId) {
    query = query.eq("epic_id", normalizedEpicId)
  }

  const { data: tasks, error } = await query.order("created_at", {
    ascending: false,
  })

  if (error) {
    return {
      data: [],
      error: `Failed to load tasks: ${error.message}`,
    }
  }

  return {
    data: (tasks ?? []) as TaskQueryRow[],
    error: null,
  }
}

async function resolveTasksWithAssignees(
  projectId: string,
  tasks: TaskQueryRow[]
): Promise<{ data: TaskWithAssignee[]; error: string | null }> {
  if (tasks.length === 0) {
    return { data: [], error: null }
  }

  const assigneeIds = tasks
    .map((task) => task.assignee_id)
    .filter(Boolean) as string[]

  if (assigneeIds.length === 0) {
    return {
      data: mapTasksWithAssignees(projectId, tasks, new Map()),
      error: null,
    }
  }

  const supabase = await createSupabaseServerClient()
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, name, email, avatar_url")
    .in("id", assigneeIds)

  if (profilesError) {
    return {
      data: [],
      error: `Failed to load assignee profiles: ${profilesError.message}`,
    }
  }

  return {
    data: mapTasksWithAssignees(
      projectId,
      tasks,
      buildAssigneeMap(profiles ?? null)
    ),
    error: null,
  }
}

export async function getTasksByEpicId(
  projectId: string,
  epicId: string
): Promise<TasksByEpicResult> {
  const normalizedEpicId = epicId.trim()

  if (!normalizedEpicId) {
    return {
      data: [],
      error: "Invalid epic id.",
    }
  }

  const taskResult = await getTaskRowsByProject(projectId, normalizedEpicId)

  if (taskResult.error) {
    return { data: [], error: taskResult.error }
  }

  return resolveTasksWithAssignees(projectId.trim(), taskResult.data)
}

export async function getTasksByProjectId(
  projectId: string
): Promise<TasksByProjectResult> {
  const taskResult = await getTaskRowsByProject(projectId)

  if (taskResult.error) {
    return { data: [], error: taskResult.error }
  }

  return resolveTasksWithAssignees(projectId.trim(), taskResult.data)
}