import { useEffect, useState } from "react"

import { DialogDescription } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { TaskWithAssignee } from "@/features/tasks/queries"

import { EditableField } from "./editable-field"

interface TaskDescriptionSectionProps {
  task: TaskWithAssignee
  isBusy: boolean
  onSave: (description: string | null) => void
}

export function TaskDescriptionSection({
  task,
  isBusy,
  onSave,
}: TaskDescriptionSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftDescription, setDraftDescription] = useState(task.description ?? "")

  useEffect(() => {
    setDraftDescription(task.description ?? "")
  }, [task.description])

  const handleSave = () => {
    setIsEditing(false)

    const normalizedDescription = draftDescription.trim()
    const currentDescription = task.description?.trim() ?? ""

    if (normalizedDescription === currentDescription) {
      return
    }

    onSave(normalizedDescription ? normalizedDescription : null)
  }

  if (isEditing) {
    return (
      <textarea
        autoFocus
        value={draftDescription}
        onChange={(event) => setDraftDescription(event.target.value)}
        onBlur={handleSave}
        maxLength={2000}
        className="min-h-24 w-full resize-none rounded-xl border border-[#E4E8F2] bg-white/65 px-4 py-3 text-[14px] leading-6 text-[#2A3D5F] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    )
  }

  return (
    <DialogDescription className="mt-3 text-left">
      <EditableField
        onEdit={() => {
          if (isBusy) return
          setIsEditing(true)
        }}
        className="inline-flex w-full"
      >
        <span
          className={cn(
            "text-left text-base leading-relaxed text-[#2A3D5F]",
            !task.description && "italic opacity-70"
          )}
        >
          {task.description?.trim() || "No description provided"}
        </span>
      </EditableField>
    </DialogDescription>
  )
}
