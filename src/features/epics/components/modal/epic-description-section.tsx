import { useState } from "react"
import { DialogDescription } from "@/components/ui/dialog"
import { EditableField } from "./editable-field"
import { cn } from "@/lib/utils"

interface Props {
  epic: any
  isBusy: boolean
  onSave: (description: string | null) => void
}

export function EpicDescriptionSection({ epic, isBusy, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(epic?.description ?? "")

  const handleBlur = () => {
    setIsEditing(false)
    const normalizedDraft = draft.trim() || null
    const currentDescription = epic?.description?.trim() || null

    if (normalizedDraft !== currentDescription) {
      onSave(normalizedDraft)
    }
  }

  if (isEditing) {
    return (
      <textarea
        value={draft}
        autoFocus
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleBlur}
        onFocus={(e) => {
          const val = e.target.value
          e.target.value = ""
          e.target.value = val
        }}
        maxLength={500}
        className="mt-3 min-h-14 w-full resize-none rounded-md border-0 bg-transparent text-[16.5px] text-muted-foreground outline-none focus-visible:ring-0"
      />
    )
  }

  return (
    <DialogDescription className="mt-3">
      <EditableField 
        onEdit={() => !isBusy && setIsEditing(true)} 
        className="p-1 -ml-1"
      >
        <span className={cn(
          "text-left text-[16px] leading-relaxed",
          !epic?.description && "italic opacity-70"
        )}>
          {epic?.description?.trim() || "No description provided"}
        </span>
      </EditableField>
    </DialogDescription>
  )
}