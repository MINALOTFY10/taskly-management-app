import { useState } from "react"
import { Input } from "@/components/ui/input"
import { DialogTitle } from "@/components/ui/dialog"
import { EditableField } from "./editable-field"

interface EpicTitleSectionProps {
  epic: any
  isBusy: boolean
  onSave: (title: string) => void
}

export function EpicTitleSection({ epic, isBusy, onSave }: EpicTitleSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(epic?.title ?? "")

  const handleBlur = () => {
    setIsEditing(false)
    if (draft.trim() !== epic?.title) onSave(draft.trim())
  }

  if (isEditing) {
    return (
      <Input
        value={draft}
        autoFocus
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === "Enter" && handleBlur()}
        className="h-auto border-0 px-0 text-[1.53rem]! font-bold shadow-none focus-visible:ring-0"
      />
    )
  }

  return (
    <EditableField onEdit={() => !isBusy && setIsEditing(true)} className="mt-2 inline-flex">
      <DialogTitle className="text-[1.5rem] font-bold">
        {epic?.title ?? "Epic details"}
      </DialogTitle>
    </EditableField>
  )
}