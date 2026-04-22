export const TASK_STATUS_VALUES = [
  "TO_DO",
  "IN_PROGRESS",
  "BLOCKED",
  "IN_REVIEW",
  "READY_FOR_QA",
  "REOPENED",
  "READY_FOR_PRODUCTION",
  "DONE",
] as const

export type TaskStatus = (typeof TASK_STATUS_VALUES)[number]

export function isTaskStatus(
  value: string | null | undefined
): value is TaskStatus {
  return typeof value === "string" && TASK_STATUS_VALUES.includes(value as TaskStatus)
}

export type TaskRow = {
  id: string
  project_id: string
  title: string
  description: string | null
  epic_id: string | null
  assignee_id: string | null
  due_date: string | null
  status: TaskStatus
  created_at: string
}

