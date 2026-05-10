import { useEffect, useState } from "react"

import { DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { TaskWithAssignee } from "@/features/tasks/queries"

import { EditableField } from "./editable-field"

interface TaskTitleSectionProps {
  task: TaskWithAssignee
  isBusy: boolean
  onSave: (title: string) => void
}

export function TaskTitleSection({ task, isBusy, onSave }: TaskTitleSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(task.title)

  useEffect(() => {
    setDraftTitle(task.title)
  }, [task.title])

  const handleSave = () => {
    setIsEditing(false)
    const normalizedTitle = draftTitle.trim()

    if (!normalizedTitle || normalizedTitle === task.title) {
      setDraftTitle(task.title)
      return
    }

    onSave(normalizedTitle)
  }

  if (isEditing) {
    return (
      <Input
        value={draftTitle}
        autoFocus
        onChange={(event) => setDraftTitle(event.target.value)}
        onBlur={handleSave}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSave()
          }

          if (event.key === "Escape") {
            setDraftTitle(task.title)
            setIsEditing(false)
          }
        }}
        className="h-auto border-0 px-0 text-[35px] leading-[1.08] font-bold tracking-[-0.02em] text-[#132A4D] shadow-none focus-visible:ring-0"
      />
    )
  }

  return (
    <EditableField
      onEdit={() => {
        if (isBusy) return
        setIsEditing(true)
      }}
      className="mt-3 inline-flex"
    >
      <DialogTitle className="text-[35px] leading-[1.08] font-bold tracking-[-0.02em] text-[#132A4D]">
        {task.title}
      </DialogTitle>
    </EditableField>
  )
}
