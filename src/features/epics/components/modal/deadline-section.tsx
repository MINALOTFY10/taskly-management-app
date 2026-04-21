import { useState } from "react"
import { Input } from "@/components/ui/input"
import { formatEpicDate } from "@/features/epics/utils/date"
import { EditableField } from "./editable-field"
import { CalendarDays } from "lucide-react"

export function DeadlineSection({ epic, isBusy, onUpdate }: any) {
  const [isEditing, setIsEditing] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value || null
    onUpdate({ deadline: val }, (curr: any) => ({ ...curr, deadline: val }))
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Input
        type="date"
        autoFocus
        defaultValue={epic?.deadline?.slice(0, 10)}
        onChange={handleChange}
        onBlur={() => setIsEditing(false)}
        className="h-8 w-32 px-1 text-xs"
      />
    )
  }

  return (
    <EditableField onEdit={() => !isBusy && setIsEditing(true)} className="">
      <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="text-sm font-medium">
        {formatEpicDate(epic?.deadline) || "Set deadline"}
      </span>
    </EditableField>
  )
}
