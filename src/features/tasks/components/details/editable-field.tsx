import { Pencil } from "lucide-react"

import { cn } from "@/lib/utils"

type EditableFieldProps = {
  children: React.ReactNode
  onEdit: () => void
  disabled?: boolean
  className?: string
}

export function EditableField({
  children,
  onEdit,
  disabled,
  className,
}: EditableFieldProps) {
  return (
    <div
      className={cn(
        "group relative flex cursor-pointer items-center gap-1 rounded-md transition-all hover:bg-muted/30",
        disabled && "pointer-events-none opacity-60",
        className
      )}
      onClick={onEdit}
    >
      {children}
      <Pencil className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  )
}
