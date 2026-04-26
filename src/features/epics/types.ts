export type EpicUserObject = {
  sub: string
  name: string
  email: string
  department: string | null
}

export type EpicStatus =
  | "todo"
  | "in_progress"
  | "in_review"
  | "done"
  | "blocked"
  | "reopened"
  | "ready_for_qa"
  | "ready_for_prod"

export type EpicRow = {
  id: string
  epic_id: string
  title: string
  description: string | null
  deadline: string | null
  status: EpicStatus | null
  created_at: string
  created_by: EpicUserObject
  assignee: EpicUserObject | null
  project_id: string
}
