import type { TaskStatus } from "@/features/tasks/types"

export function getTaskStatusLabel(status: TaskStatus): string {
  return status.split("_").join(" ")
}
