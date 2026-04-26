import { cn } from "@/lib/utils"
import type { TaskStatus } from "@/features/tasks/types"

interface TaskStatusBadgeProps {
  status: TaskStatus
  className?: string
  showDot?: boolean
  size?: "md" | "sm"
}

function getStatusConfig(status: TaskStatus): {
  label: string
  bg: string
  text: string
} {
  switch (status) {
    case "TO_DO":
      return {
        label: "To Do",
        bg: "bg-slate-100",
        text: "text-slate-800",
      }
    case "IN_PROGRESS":
      return {
        label: "In Progress",
        bg: "bg-blue-100",
        text: "text-blue-800",
      }
    case "BLOCKED":
      return {
        label: "Blocked",
        bg: "bg-red-100",
        text: "text-red-800",
      }
    case "IN_REVIEW":
      return {
        label: "In Review",
        bg: "bg-orange-100",
        text: "text-orange-800",
      }
    case "READY_FOR_QA":
      return {
        label: "Ready for QA",
        bg: "bg-purple-100",
        text: "text-purple-800",
      }
    case "REOPENED":
      return {
        label: "Reopened",
        bg: "bg-red-100",
        text: "text-red-800",
      }
    case "READY_FOR_PRODUCTION":
      return {
        label: "Ready for Prod",
        bg: "bg-yellow-100",
        text: "text-yellow-800",
      }
    case "DONE":
      return {
        label: "Completed",
        bg: "bg-green-100",
        text: "text-green-800",
      }
    default:
      return {
        label: status,
        bg: "bg-gray-100",
        text: "text-gray-800",
      }
  }
}

export function TaskStatusBadge({
  status,
  className,
  showDot = true,
  size = "md",
}: TaskStatusBadgeProps) {
  const { label, bg, text } = getStatusConfig(status)

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        size === "md" && "px-3 py-1 text-xs",
        size === "sm" && "px-2.5 py-1 text-[11px]",
        bg,
        text,
        className
      )}
    >
      {label}
    </span>
  )
}
