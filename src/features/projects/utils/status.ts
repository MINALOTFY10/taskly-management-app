import type { EpicStatus, TaskStatus } from "@/features/projects/types"
import type { ProjectMemberRole } from "@/features/members/types"

// ─── Epic status ──────────────────────────────────────────────────────────────

type StatusConfig = {
  label: string
  className: string
}

export const EPIC_STATUS_CONFIG: Record<EpicStatus, StatusConfig> = {
  TO_DO: {
    label: "To Do",
    className:
      "bg-muted text-muted-foreground",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className:
      "bg-primary/10 text-primary",
  },
  DONE: {
    label: "Done",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  CANCELLED: {
    label: "Cancelled",
    className:
      "bg-destructive/10 text-destructive",
  },
}

// ─── Task status ──────────────────────────────────────────────────────────────

export const TASK_STATUS_CONFIG: Record<TaskStatus, StatusConfig> = {
  TO_DO: {
    label: "To Do",
    className:
      "bg-muted text-muted-foreground",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className:
      "bg-primary/10 text-primary",
  },
  DONE: {
    label: "Done",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  CANCELLED: {
    label: "Cancelled",
    className:
      "bg-destructive/10 text-destructive",
  },
}

// ─── Member role ──────────────────────────────────────────────────────────────

export const ROLE_CONFIG: Record<ProjectMemberRole, StatusConfig> = {
  owner: {
    label: "Owner",
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  admin: {
    label: "Admin",
    className:
      "bg-primary/10 text-primary",
  },
  member: {
    label: "Member",
    className:
      "bg-muted text-muted-foreground",
  },
  viewer: {
    label: "Viewer",
    className:
      "bg-muted text-muted-foreground/60",
  },
}