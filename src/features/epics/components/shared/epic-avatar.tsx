import { cn } from "@/lib/utils"
import { getAvatarColor, getInitials } from "@/features/epics/utils/avatar"

type EpicAvatarProps = {
  name: string
  size?: "sm" | "md"
  className?: string
}

const SIZE_CLASSES = {
  sm: "size-7 text-[0.65rem]",
  md: "size-9 text-sm",
}

export default function EpicAvatar({ name, size = "md", className }: EpicAvatarProps) {
  const { bg, text } = getAvatarColor(name)
  const initials = getInitials(name)

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl font-bold",
        SIZE_CLASSES[size],
        bg,
        text,
        className
      )}
      aria-hidden="true"
      title={name}
    >
      {initials}
    </div>
  )
}