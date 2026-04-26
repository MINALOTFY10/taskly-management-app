import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import EpicAvatar from "@/features/epics/components/shared/epic-avatar"
import { EditableField } from "./editable-field"

export function AssigneeSection({ epic, isBusy, options, onUpdate }: any) {
  const [isEditing, setIsEditing] = useState(false)

  const handleSelect = (value: string) => {
    const nextId = value === "unassigned" ? null : value
    const currentId = epic?.assignee?.sub ?? null

    if (nextId !== currentId) {
      const selected = options.find((o: any) => o.userId === nextId)
      onUpdate(
        { assigneeUserId: nextId },
        (curr: any) => ({
          ...curr,
          assignee: nextId ? { sub: nextId, name: selected?.name, email: selected?.email } : null
        })
      )
    }
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Select 
        open={true} 
        onOpenChange={(open) => !open && setIsEditing(false)}
        value={epic?.assignee?.sub ?? "unassigned"} 
        onValueChange={handleSelect}
      >
        <SelectTrigger className="mt-2.5 h-9 w-full max-w-56">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="mt-18">
          <SelectItem value="unassigned">Unassigned</SelectItem>
          {options.map((opt: any) => (
            <SelectItem key={opt.userId} value={opt.userId}>{opt.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <EditableField onEdit={() => !isBusy && setIsEditing(true)} className="inline-flex p-1">
      <div className="flex items-center gap-2">
        <EpicAvatar name={epic?.assignee?.name ?? "Unassigned"} size="sm" />
        <span className="text-sm font-medium">{epic?.assignee?.name ?? "Unassigned"}</span>
      </div>
    </EditableField>
  )
}