import { DialogTitle } from "@/components/ui/dialog"
import type { TaskWithAssignee } from "@/features/tasks/queries"

interface TaskTitleSectionProps {
  task: TaskWithAssignee
}

export function TaskTitleSection({ task }: TaskTitleSectionProps) {
  return (
    <DialogTitle className="text-2xl font-semibold text-foreground">
      {task.title}
    </DialogTitle>
  )
}
