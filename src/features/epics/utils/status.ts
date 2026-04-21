import type { EpicStatus } from "@/features/epics/types"

export function normalizeEpicStatus(raw: unknown): EpicStatus | null {
  if (typeof raw !== "string") return null
  const s = raw.trim().toLowerCase().replace(/[\s\-]+/g, "_")
  const valid: EpicStatus[] = [
    "todo",
    "in_progress",
    "in_review",
    "done",
    "blocked",
    "reopened",
    "ready_for_qa",
    "ready_for_prod",
  ]
  if (s === "to_do") return "todo"
  if (valid.includes(s as EpicStatus)) return s as EpicStatus
  return null
}

const STATUS_LABELS: Record<EpicStatus, string> = {
  todo: "TO DO",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Done",
  blocked: "Blocked",
  reopened: "Reopened",
  ready_for_qa: "Ready for QA",
  ready_for_prod: "Ready for Prod",
}

// Matches the .status-* utility classes defined in globals.css
const STATUS_CLASSES: Record<EpicStatus, string> = {
  todo: "status-todo",
  in_progress: "status-in-progress",
  in_review: "status-in-review",
  done: "status-done",
  blocked: "status-blocked",
  reopened: "status-reopened",
  ready_for_qa: "status-ready-for-qa",
  ready_for_prod: "status-ready-for-prod",
}

export function getStatusLabel(status: EpicStatus | null): string {
  status = normalizeEpicStatus(status) 
  return status ? (STATUS_LABELS[status] ?? "TO DO") : "TO DO"
}

export function getStatusClassName(status: EpicStatus | null): string {
  return status ? (STATUS_CLASSES[status] ?? "status-todo") : "status-todo"
}
