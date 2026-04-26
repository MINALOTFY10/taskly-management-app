import { DialogDescription } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { TaskWithAssignee } from "@/features/tasks/queries"

interface TaskDescriptionSectionProps {
  task: TaskWithAssignee
}

export function TaskDescriptionSection({ task }: TaskDescriptionSectionProps) {
  return (
    <DialogDescription className="mt-3">
      <span
        className={cn(
          "text-left text-base leading-relaxed",
          !task.description && "italic opacity-70"
        )}
      >
        {task.description?.trim() || "No description provided"}
      </span>
    </DialogDescription>
  )
}
