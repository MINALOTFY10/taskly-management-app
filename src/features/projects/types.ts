export type ProjectRow = {
  id: string
  name: string
  description: string | null
  created_at: string
}

export type EpicStatus = "TO_DO" | "IN_PROGRESS" | "DONE" | "CANCELLED"
export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "DONE" | "CANCELLED"

export type EpicRow = {
  id: string
  project_id: string
  title: string
  description: string | null
  status: EpicStatus
  epic_id: string | null
  deadline: string | null
  created_at: string
}

export type TaskRow = {
  id: string
  project_id: string
  epic_id: string | null
  title: string
  description: string | null
  status: TaskStatus
  task_id: string | null
  due_date: string | null
  created_at: string
}